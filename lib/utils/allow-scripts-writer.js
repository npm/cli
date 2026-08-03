const npa = require('npm-package-arg')
const { log } = require('proc-log')
const {
  filePolicyIdentity,
  getTrustedRegistryIdentity,
  matches,
  resolvedSourceSpecs,
} = require('@npmcli/arborist/lib/script-allowed.js')

// Pure helpers that implement the RFC's pin-mismatch table for
// `npm approve-scripts` and `npm deny-scripts`.
//
// Approving writes either `"<spec>": true` or `"<name>": true` to the
// project's `allowScripts` field, depending on `--allow-scripts-pin` and the currently
// installed versions.
//
// Denying writes the widest trusted identity available: registry and hosted-git
// keys use their coarsest trusted identity; file and remote dependencies use
// the exact resolved source because there is no coarser trusted identity.
// `--allow-scripts-pin` does not affect denies.

const primaryResolvedSource = (node) => resolvedSourceSpecs(node)[0] || ''
const parseSpec = (spec) => {
  if (typeof spec !== 'string' || spec === '') {
    return null
  }
  try {
    return npa(spec)
  } catch {
    return null
  }
}
const isRemoteSpec = (spec) => parseSpec(spec)?.type === 'remote'
const isRegistrySpec = (spec) => parseSpec(spec)?.registry === true

const incomingEdges = function * (node, seen = new Set()) {
  if (!node || seen.has(node)) {
    return
  }
  seen.add(node)

  if (node.edgesIn && typeof node.edgesIn[Symbol.iterator] === 'function') {
    yield * node.edgesIn
  }
  if (node.linksIn && typeof node.linksIn[Symbol.iterator] === 'function') {
    for (const link of node.linksIn) {
      yield * incomingEdges(link, seen)
    }
  }
}
const hasIncomingSpec = (node, predicate) => {
  for (const edge of incomingEdges(node)) {
    if (predicate(edge?.spec)) {
      return true
    }
  }
  return false
}
const hasRemoteProvenance = (node) => hasIncomingSpec(node, isRemoteSpec)
const hasRegistryProvenance = (node) =>
  node?.isRegistryDependency === true || hasIncomingSpec(node, isRegistrySpec)

// `undefined` means the node has no remote provenance. `null` means it does,
// but no exact resolved URL can be matched, so callers must fail closed.
const exactRemoteKeyFor = (node, resolved) => {
  if (!hasRemoteProvenance(node)) {
    return undefined
  }
  return isRemoteSpec(resolved) ? resolved : null
}

// Convert an arborist Node into the spec string used for a versioned policy
// entry. Returns `null` if the node cannot be represented as a versioned key
// derived from trusted sources (lockfile URL for registry, exact resolved URL
// for direct remote installs, hosted shortcut for git, exact lockfile source
// for file installs). Never falls back to `node.packageName` / `node.version`,
// which are tarball-controlled.
const versionedKeyFor = (node) => {
  if (!node) {
    return null
  }
  const resolved = primaryResolvedSource(node)
  const remoteKey = exactRemoteKeyFor(node, resolved)
  if (remoteKey !== undefined) {
    return remoteKey
  }
  if (resolved.startsWith('git')) {
    const parsed = parseSpec(resolved)
    if (!parsed?.hosted) {
      return null
    }
    const committish = parsed.gitCommittish || parsed.hosted.committish
    const base = parsed.hosted.shortcut({ noCommittish: true })
    return committish ? `${base}#${committish}` : base
  }
  if (isRemoteSpec(resolved)) {
    if (!hasRegistryProvenance(node)) {
      return null
    }
    const trusted = getTrustedRegistryIdentity(node)
    if (trusted && trusted.version) {
      return `${trusted.name}@${trusted.version}`
    }
    // Registry node with a resolved URL that versionFromTgz couldn't
    // parse (private-registry mirror, alternate CDN URL shape). Leave a
    // breadcrumb so users notice when policy keys are silently pruned.
    log.silly(
      'install-scripts',
      `unable to derive trusted versioned key for ${node.path || node.name || '<unknown>'} ` +
      `(resolved: ${resolved}); key will be pruned on next save`
    )
    return null
  }
  const fileIdentity = filePolicyIdentity(node)
  if (fileIdentity !== undefined) {
    return fileIdentity
  }
  // No trusted source. Refuse to compose a key from attacker-controlled
  // `node.packageName` / `node.version`.
  /* istanbul ignore next: callers filter out non-registry/non-file nodes before reaching this fallback */
  return null
}

// Convert an arborist Node into the spec string used for the widest-trusted
// policy entry. Same trust rules as versionedKeyFor — returns `null` rather
// than falling back to tarball-controlled fields.
const nameKeyFor = (node) => {
  if (!node) {
    return null
  }
  const resolved = primaryResolvedSource(node)
  const remoteKey = exactRemoteKeyFor(node, resolved)
  if (remoteKey !== undefined) {
    return remoteKey
  }
  if (resolved.startsWith('git')) {
    const parsed = parseSpec(resolved)
    if (!parsed?.hosted) {
      return null
    }
    return parsed.hosted.shortcut({ noCommittish: true })
  }
  const fileIdentity = filePolicyIdentity(node)
  if (fileIdentity !== undefined) {
    return fileIdentity
  }
  if (!hasRegistryProvenance(node)) {
    return null
  }
  // Registry deps: only the URL-derived (or edges-derived, in the
  // omit-lockfile case) trusted name is acceptable.
  const trusted = getTrustedRegistryIdentity(node)
  return trusted ? trusted.name : null
}

const isSingleVersionPin = (key) => {
  try {
    const parsed = npa(key)
    return parsed.type === 'version'
  } catch {
    return false
  }
}

// Build the warning string emitted when an existing deny entry blocks
// an approval. Only versioned or ranged registry denies can be widened with
// `npm install-scripts deny <name>`; name-only registry denies and git,
// file, or remote denies must be removed to approve the current install.
const denyWarning = (key, subject, name) => {
  if (!isVersionedRegistryKey(key)) {
    return `${key} is denied; remove the entry from allowScripts to approve ${subject}.`
  }
  /* istanbul ignore next: name fallback is defensive; callers pass nameKeyFor(sample) */
  const widenTarget = name || 'this package'
  return `${key} is a versioned deny; run \`npm install-scripts deny ${widenTarget}\` ` +
    `to widen the deny to all versions of ${widenTarget}, or remove the entry ` +
    `to approve ${subject}.`
}

const isVersionedRegistryKey = (key) => {
  try {
    const parsed = npa(key)
    if (parsed.type === 'version') {
      return true
    }
    if (parsed.type !== 'range') {
      return false
    }
    return parsed.fetchSpec !== '*'
      && parsed.rawSpec !== ''
      && parsed.rawSpec !== '*'
  } catch {
    /* istanbul ignore next: keys reaching denyWarning have already parsed in keyTargetsNode */
    return false
  }
}

// Does this policy key target this node by identity (ignoring the
// allow/deny value)?
//
// Registry keys (`tag`, `range`, `version`) require a trusted identity on
// the node. If the node has no `getTrustedRegistryIdentity` result, the
// key does not match — never fall back to `node.name`, which is the
// install-directory name and is forgeable through aliases / manifest
// confusion.
const keyTargetsNode = (key, node) => {
  let parsed
  try {
    parsed = npa(key)
  } catch {
    return false
  }
  switch (parsed.type) {
    case 'tag':
    case 'range':
    case 'version': {
      if (node?.isRegistryDependency === false) {
        return false
      }
      const trusted = getTrustedRegistryIdentity(node)
      if (!trusted) {
        return false
      }
      return trusted.name === parsed.name
    }
    case 'git': {
      let resolvedParsed
      try {
        const resolved = primaryResolvedSource(node)
        resolvedParsed = resolved ? npa(resolved) : null
      } catch {
        /* istanbul ignore next */
        return false
      }
      const keyHost = parsed.hosted?.ssh({ noCommittish: true })
      const nodeHost = resolvedParsed?.hosted?.ssh({ noCommittish: true })
      return !!(keyHost && nodeHost && keyHost === nodeHost)
    }
    case 'file':
    case 'directory':
    case 'remote':
      return matches(node, key, false)
    default:
      return false
  }
}

// Apply approvals for all currently-installed versions of a single package.
//
// `nodes` must all share an identity (same package name for registry deps,
// or same hosted shortcut for git deps, etc.). The caller is responsible
// for grouping nodes correctly.
//
// Returns `{ allowScripts, changes, warning }` where:
//   - `allowScripts` is the new object (the input is never mutated)
//   - `changes` is a list of `{ key, change }` entries describing edits
//   - `warning` is an optional message to surface to the user
const applyApprovalForPackage = (existing, nodes, { pin = true } = {}) => {
  const allowScripts = { ...existing }
  const changes = []

  if (!Array.isArray(nodes) || nodes.length === 0) {
    return { allowScripts, changes }
  }

  const sample = nodes[0]
  const name = nameKeyFor(sample)

  // Deny-wins: any existing false that targets any installed version aborts.
  for (const node of nodes) {
    for (const [key, value] of Object.entries(allowScripts)) {
      if (value === false && keyTargetsNode(key, node)) {
        /* istanbul ignore next: name fallback covers the empty-name edge case */
        const subject = name || 'this package'
        return {
          allowScripts,
          changes,
          warning: denyWarning(key, subject, name),
        }
      }
    }
  }

  if (!pin) {
    // Name-only mode: collapse any single-version pins for this package
    // into a single name-only entry.
    for (const key of Object.keys(allowScripts)) {
      if (
        keyTargetsNode(key, sample) &&
        key !== name &&
        isSingleVersionPin(key) &&
        allowScripts[key] === true
      ) {
        delete allowScripts[key]
      }
    }

    /* istanbul ignore else: name === null is the no-identity path tested separately */
    if (name && allowScripts[name] !== true) {
      allowScripts[name] = true
      changes.push({ key: name, change: 'added' })
    }
    return { allowScripts, changes }
  }

  // Pin mode. For each currently installed version, write a single-version
  // pin if one is not already in place. Stale single-version pins for this
  // package are removed. Per the RFC's pin-mismatch table, an existing
  // name-only entry (`pkg: true`) is replaced by `pkg@x.y.z: true` once
  // every installed version has a pin.
  const versionedKeys = nodes.map(versionedKeyFor)
  const installedKeys = new Set(versionedKeys.filter(Boolean))

  // A registry dep with no `resolved` URL in the lockfile has no trustable
  // version (getTrustedRegistryIdentity won't trust the tarball's
  // node.version), so versionedKeyFor returns null and a `pkg@x.y.z` pin can
  // never match it (npm/cli#9558). When any installed version can't be
  // pinned, approve the whole package by name and drop now-redundant pins.
  if (name && versionedKeys.some(key => !key)) {
    for (const key of Object.keys(allowScripts)) {
      if (
        keyTargetsNode(key, sample) &&
        key !== name &&
        isSingleVersionPin(key) &&
        allowScripts[key] === true
      ) {
        delete allowScripts[key]
        changes.push({ key, change: 'removed-pinned-allow' })
      }
    }
    if (allowScripts[name] !== true) {
      allowScripts[name] = true
      changes.push({ key: name, change: 'added' })
    }
    return {
      allowScripts,
      changes,
      warning: changes.length
        ? `${name}: approved by name (all versions) because its ` +
        `package-lock.json entry has no "resolved" URL, so npm can't pin a ` +
        `specific version. Run \`npm install\` to refresh the lockfile and ` +
        `enable pinning.`
        : undefined,
    }
  }

  for (const key of Object.keys(allowScripts)) {
    if (
      keyTargetsNode(key, sample) &&
      isSingleVersionPin(key) &&
      allowScripts[key] === true &&
      !installedKeys.has(key)
    ) {
      delete allowScripts[key]
      changes.push({ key, change: 'removed-stale' })
    }
  }

  for (const key of installedKeys) {
    if (allowScripts[key] !== true) {
      allowScripts[key] = true
      changes.push({ key, change: 'added' })
    }
  }

  // Upgrade: drop the name-only entry once every installed version has a
  // pin. The operation is convergent: running the command twice produces
  // the same shape regardless of the starting state.
  if (
    installedKeys.size > 0 &&
    name &&
    !installedKeys.has(name) &&
    allowScripts[name] === true
  ) {
    delete allowScripts[name]
    changes.push({ key: name, change: 'replaced-by-pin' })
  }

  return { allowScripts, changes }
}

// Apply a deny for a single package. Uses the source-appropriate trusted
// identity and ignores `--allow-scripts-pin`.
const applyDenyForPackage = (existing, nodes) => {
  const allowScripts = { ...existing }
  const changes = []

  if (!Array.isArray(nodes) || nodes.length === 0) {
    return { allowScripts, changes }
  }

  const sample = nodes[0]
  const name = nameKeyFor(sample)
  if (!name) {
    return { allowScripts, changes }
  }

  // Drop narrower allow entries for this dependency; the denial overrides
  // them.
  for (const key of Object.keys(allowScripts)) {
    if (keyTargetsNode(key, sample) && key !== name) {
      delete allowScripts[key]
      changes.push({ key, change: 'removed-pinned-allow' })
    }
  }

  if (allowScripts[name] !== false) {
    allowScripts[name] = false
    changes.push({ key: name, change: 'added' })
  }
  return { allowScripts, changes }
}

module.exports = {
  parseSpec,
  applyApprovalForPackage,
  applyDenyForPackage,
  versionedKeyFor,
  nameKeyFor,
  keyTargetsNode,
  isSingleVersionPin,
}
