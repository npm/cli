const t = require('tap')
const isScriptAllowed = require('../lib/script-allowed.js')
const { trustedDisplay } = isScriptAllowed

// Test nodes default to a consistent registry-tarball shape: the resolved
// URL's name+version match the supplied name+version. Tests that need to
// simulate manifest confusion (mismatched URL) can override `resolved`
// independently.
const node = (overrides = {}) => {
  const name = overrides.name ?? overrides.packageName ?? 'pkg'
  const packageName = overrides.packageName ?? name
  const version = overrides.version ?? '1.0.0'
  // For real aliased installs, the URL is the TARGET package's URL, so
  // build the default URL from packageName, not name.
  const urlPkg = packageName
  return {
    name,
    packageName,
    version,
    resolved: overrides.resolved
      ?? `https://registry.npmjs.org/${urlPkg}/-/${urlPkg}-${version}.tgz`,
    location: overrides.location ?? `node_modules/${name}`,
    ...overrides,
  }
}

t.test('returns null when no policy is set', t => {
  t.equal(isScriptAllowed(node(), null), null)
  t.equal(isScriptAllowed(node(), undefined), null)
  t.equal(isScriptAllowed(node(), {}), null)
  t.end()
})

t.test('registry — name-only allow', t => {
  t.equal(isScriptAllowed(node({ name: 'canvas', version: '2.11.0' }), { canvas: true }), true)
  t.equal(isScriptAllowed(node({ name: 'other', version: '1.0.0' }), { canvas: true }), null)
  t.end()
})

t.test('registry — exact version match', t => {
  const policy = { 'canvas@2.11.0': true }
  t.equal(isScriptAllowed(node({ name: 'canvas', version: '2.11.0' }), policy), true)
  t.equal(isScriptAllowed(node({ name: 'canvas', version: '2.11.1' }), policy), null)
  t.end()
})

t.test('registry — semver range', t => {
  const policy = { 'sharp@0.33.2 || 0.34.0': true }
  t.equal(isScriptAllowed(node({ name: 'sharp', version: '0.33.2' }), policy), true)
  t.equal(isScriptAllowed(node({ name: 'sharp', version: '0.34.0' }), policy), true)
  t.equal(isScriptAllowed(node({ name: 'sharp', version: '0.33.3' }), policy), null)
  t.end()
})

t.test('registry — version mismatch returns null', t => {
  const policy = { 'canvas@2.11.0': true }
  t.equal(isScriptAllowed(node({ name: 'canvas', version: '3.0.0' }), policy), null)
  t.end()
})

t.test('alias must not match the alias name', t => {
  // install: `trusted@npm:naughty@1.0.0`
  // node.name === 'trusted', node.packageName === 'naughty'
  const aliased = node({ name: 'trusted', packageName: 'naughty', version: '1.0.0' })
  // Key matching the alias name must NOT match.
  t.equal(isScriptAllowed(aliased, { trusted: true }), null)
  // Key matching the real package name DOES match.
  t.equal(isScriptAllowed(aliased, { naughty: true }), true)
  t.equal(isScriptAllowed(aliased, { 'naughty@1.0.0': true }), true)
  t.end()
})

t.test('registry-style key does not match a tarball or git node', t => {
  const gitNode = node({
    name: 'pkg',
    version: '1.0.0',
    resolved: 'git+ssh://git@github.com/foo/bar.git#deadbeefcafebabe1234567890abcdef12345678',
  })
  t.equal(isScriptAllowed(gitNode, { pkg: true }), null)
  t.end()
})

t.test('git — repo-only match by canonical ssh URL', t => {
  const gitNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: 'git+ssh://git@github.com/foo/bar.git#deadbeefcafebabe1234567890abcdef12345678',
  })
  // Key by repo only — name-only allow for the git source.
  t.equal(isScriptAllowed(gitNode, { 'github:foo/bar': true }), true)
  t.equal(isScriptAllowed(gitNode, { 'github:foo/other': true }), null)
  t.end()
})

t.test('git — short SHA prefix matches full SHA', t => {
  const gitNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: 'git+ssh://git@github.com/foo/bar.git#deadbeefcafebabe1234567890abcdef12345678',
  })
  t.equal(isScriptAllowed(gitNode, { 'github:foo/bar#deadbeef': true }), true)
  t.equal(isScriptAllowed(gitNode, { 'github:foo/bar#deadbee': true }), true)
  t.equal(isScriptAllowed(gitNode, { 'github:foo/bar#abcdef0': true }), null)
  t.end()
})

t.test('file path — exact resolved match', t => {
  const fileNode = node({
    name: 'local-pkg',
    packageName: 'local-pkg',
    version: '1.0.0',
    resolved: 'file:../local-pkg',
  })
  t.equal(isScriptAllowed(fileNode, { 'file:../local-pkg': true }), true)
  t.equal(isScriptAllowed(fileNode, { 'file:../other': true }), null)
  t.end()
})

t.test('directory key — npa parses absolute paths as type=directory', t => {
  // npa treats absolute paths as { type: 'directory' }, which the
  // matcher shares with the 'file' case. path.resolve produces a
  // platform-correct absolute path so this works on Windows.
  const absDir = require('node:path').resolve('local-pkg')
  const dirNode = node({
    name: 'local-pkg',
    packageName: 'local-pkg',
    version: '1.0.0',
    resolved: absDir,
  })
  t.equal(isScriptAllowed(dirNode, { [absDir]: true }), true)
  t.end()
})

t.test('local tarball key — npa parses *.tgz paths as type=file', t => {
  // npa treats `*.tgz` paths as { type: 'file' }, separate from
  // 'directory'. Both share the matchFileOrDir body.
  const tgzNode = node({
    name: 'local-pkg',
    packageName: 'local-pkg',
    version: '1.0.0',
    resolved: 'file:../local-pkg.tgz',
  })
  t.equal(isScriptAllowed(tgzNode, { 'file:../local-pkg.tgz': true }), true)
  t.end()
})

t.test('remote tarball — exact resolved match', t => {
  const remoteNode = node({
    name: 'pkg',
    packageName: 'pkg',
    version: '1.0.0',
    resolved: 'https://example.com/pkg.tgz',
  })
  t.equal(isScriptAllowed(remoteNode, { 'https://example.com/pkg.tgz': true }), true)
  t.equal(isScriptAllowed(remoteNode, { 'https://example.com/other.tgz': true }), null)
  t.end()
})

t.test('omitLockfileRegistryResolved: name-only match via edges; version-pinned does not', t => {
  // Without a resolved URL, the trusted name comes from an incoming
  // dependency edge (consumer-written), not from node.location (which
  // for aliases would expose the alias name and let a malicious publisher
  // bypass the policy). Version isn't trustable in this case, so
  // version-pinned policy entries cannot match.
  const omitted = {
    name: 'canvas',
    packageName: 'canvas',
    version: '2.11.0',
    resolved: undefined,
    location: 'node_modules/canvas',
    edgesIn: new Set([{ name: 'canvas', spec: '^2.0.0' }]),
  }
  t.equal(isScriptAllowed(omitted, { canvas: true }), true)
  t.equal(isScriptAllowed(omitted, { 'canvas@2.11.0': true }), null,
    'version-pinned match requires the trusted URL-derived version')
  t.equal(isScriptAllowed(omitted, { 'canvas@3': true }), null)
  t.end()
})

t.test('omitLockfileRegistryResolved + alias: location is ignored; underlying name wins', t => {
  // Consumer's package.json has `"trusted": "npm:naughty@1.0.0"`. With
  // omitLockfileRegistryResolved, the resolved URL is absent. The install
  // location is `node_modules/trusted` (alias path). The matcher MUST
  // derive the underlying name from the edge's alias subSpec, not from
  // the location.
  const aliasOmitted = {
    name: 'trusted',
    packageName: 'naughty',
    version: '1.0.0',
    resolved: undefined,
    location: 'node_modules/trusted',
    edgesIn: new Set([{ name: 'trusted', spec: 'npm:naughty@1.0.0' }]),
  }
  // Alias name MUST NOT match.
  t.equal(isScriptAllowed(aliasOmitted, { trusted: true }), null,
    'alias name does not authorize the underlying package')
  // Underlying name DOES match.
  t.equal(isScriptAllowed(aliasOmitted, { naughty: true }), true,
    'underlying package name authorizes scripts')
  t.end()
})

t.test('omit-lockfile with no edges returns null (no trusted identity)', t => {
  const orphan = {
    name: 'canvas',
    packageName: 'canvas',
    version: '1.0.0',
    resolved: undefined,
    location: 'node_modules/canvas',
    // No edgesIn at all.
  }
  t.equal(isScriptAllowed(orphan, { canvas: true }), null,
    'cannot match without a trusted name source')
  t.end()
})

t.test('deny wins on conflict', t => {
  const n = node({ name: 'pkg', version: '2.0.0' })
  t.equal(isScriptAllowed(n, { 'pkg@1.0.0 || 2.0.0': true, 'pkg@2.0.0 || 3.0.0': false }), false)
  t.equal(isScriptAllowed(n, { pkg: true, 'pkg@2.0.0': false }), false)
  t.end()
})

t.test('name-only deny without overlap returns false', t => {
  t.equal(isScriptAllowed(node({ name: 'core-js', version: '3.0.0' }), { 'core-js': false }), false)
  t.end()
})

t.test('skips unparseable policy keys', t => {
  t.equal(
    isScriptAllowed(node({ name: 'pkg', version: '1.0.0' }), { '@@@invalid': true, pkg: true }),
    true
  )
  t.end()
})

t.test('registry — forbidden semver ranges are rejected', async t => {
  const n = node({ name: 'sharp', version: '0.33.5' })
  // Caret range that DOES match version, but RFC forbids — must return null
  t.equal(isScriptAllowed(n, { 'sharp@^0.33.0': true }), null)
  t.equal(isScriptAllowed(n, { 'sharp@~0.33.0': true }), null)
  t.equal(isScriptAllowed(n, { 'sharp@>=0.33.0': true }), null)
  t.equal(isScriptAllowed(n, { 'sharp@<1.0.0': true }), null)
  // Partial versions like `0.33` are ranges in semver — also rejected
  t.equal(isScriptAllowed(n, { 'sharp@0.33': true }), null)
  t.equal(isScriptAllowed(n, { 'sharp@0': true }), null)
})

t.test('registry — wildcard versions are allowed (treated as name-only)', async t => {
  const n = node({ name: 'sharp', version: '0.33.5' })
  t.equal(isScriptAllowed(n, { 'sharp@*': true }), true)
})

t.test('registry — exact disjunction with full semver is allowed', async t => {
  const n = node({ name: 'sharp', version: '0.33.2' })
  t.equal(isScriptAllowed(n, { 'sharp@0.33.2 || 0.34.0': true }), true)
})

t.test('registry — exact disjunction where version is not listed returns null', async t => {
  const n = node({ name: 'sharp', version: '0.33.5' })
  t.equal(isScriptAllowed(n, { 'sharp@0.33.2 || 0.34.0': true }), null)
})

t.test('forbidden range deny does NOT win (would silently allow new versions otherwise)', async t => {
  // A user wrote `sharp@^0.33.0: false` thinking they're denying all 0.33.x.
  // The matcher rejects the range, so the entry is effectively absent —
  // deny does not match the node, returns null (unreviewed).
  const n = node({ name: 'sharp', version: '0.33.5' })
  t.equal(isScriptAllowed(n, { 'sharp@^0.33.0': false }), null)
})

t.test('isRegistryNode — spoofed tarball URL is NOT treated as registry', async t => {
  // An attacker-controlled URL that happens to contain /-/<name>-<version>
  // must not match a registry-style allow entry.
  const spoofed = node({
    name: 'trusted',
    version: '1.0.0',
    resolved: 'https://evil.com/-/trusted-1.0.0.tgz',
  })
  // Without a path segment before /-/, the URL is not a registry tarball
  // pattern. The 'trusted@1.0.0' allow must not match.
  t.equal(isScriptAllowed(spoofed, { 'trusted@1.0.0': true }), null)
  t.equal(isScriptAllowed(spoofed, { trusted: true }), null)
  // The user can still allow this specific URL via an exact resolved match.
  t.equal(
    isScriptAllowed(spoofed, { 'https://evil.com/-/trusted-1.0.0.tgz': true }),
    true
  )
})

t.test('isRegistryNode — arborist isRegistryDependency overrides URL guessing', async t => {
  // A real arborist Node has isRegistryDependency. When false, the URL
  // pattern is ignored entirely.
  const arboristNode = {
    name: 'trusted',
    packageName: 'trusted',
    version: '1.0.0',
    resolved: 'https://registry.npmjs.org/trusted/-/trusted-1.0.0.tgz',
    isRegistryDependency: false, // edges say it came from a non-registry source
  }
  t.equal(isScriptAllowed(arboristNode, { 'trusted@1.0.0': true }), null)
})

t.test('isRegistryNode — arborist isRegistryDependency true accepts even unusual URLs', async t => {
  const arboristNode = {
    name: 'trusted',
    packageName: 'trusted',
    version: '1.0.0',
    resolved: 'https://internal.corp/private-registry/trusted/-/trusted-1.0.0.tgz',
    isRegistryDependency: true, // edges say it came from a configured registry
  }
  t.equal(isScriptAllowed(arboristNode, { 'trusted@1.0.0': true }), true)
})

t.test('bundled deps cannot be allowlisted (never run)', async t => {
  // Bundled dependencies have inBundle=true and no independent resolved
  // URL. They can never be allowlisted because matching by name@version
  // from the bundled tarball would reintroduce manifest confusion. They
  // always return null, and their install scripts never run.

  const bundled = {
    name: 'bundled-pkg',
    packageName: 'bundled-pkg',
    version: '1.0.0',
    resolved: undefined,
    inBundle: true,
  }

  // Name-only allow: must NOT match a bundled dep.
  t.equal(isScriptAllowed(bundled, { 'bundled-pkg': true }), null)
  // Versioned allow: must NOT match a bundled dep.
  t.equal(isScriptAllowed(bundled, { 'bundled-pkg@1.0.0': true }), null)
  // Disjunction allow: must NOT match a bundled dep.
  t.equal(isScriptAllowed(bundled, { 'bundled-pkg@1.0.0 || 2.0.0': true }), null)
  // No policy: still null (no policy = nothing to evaluate against).
  t.equal(isScriptAllowed(bundled, {}), null)
  t.equal(isScriptAllowed(bundled, null), null)
})

t.test('bundled deps: deny entry does not match either (returns null, not false)', async t => {
  // A deny entry doesn't apply to bundled deps because they're outside
  // the policy scope entirely. They're blocked because they never run,
  // not via a policy entry.
  const bundled = {
    name: 'bundled-pkg',
    packageName: 'bundled-pkg',
    version: '1.0.0',
    resolved: undefined,
    inBundle: true,
  }
  t.equal(isScriptAllowed(bundled, { 'bundled-pkg': false }), null)
})

t.test('bundled dep with resolved field is still rejected', async t => {
  // Defensive: even if a bundled dep somehow has a resolved URL, the
  // inBundle flag wins over identity matching.
  const bundledWithResolved = {
    name: 'pkg',
    packageName: 'pkg',
    version: '1.0.0',
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    inBundle: true,
  }
  t.equal(isScriptAllowed(bundledWithResolved, { 'pkg@1.0.0': true }), null)
})

t.test('inBundle: false does not affect normal matching', async t => {
  // Sanity check: explicit inBundle: false behaves identically to absent.
  const normal = {
    name: 'pkg',
    packageName: 'pkg',
    version: '1.0.0',
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-1.0.0.tgz',
    inBundle: false,
  }
  t.equal(isScriptAllowed(normal, { 'pkg@1.0.0': true }), true)
})

t.test('isolated mode (linked): bundled IsolatedNode is blocked', async t => {
  // Regression guard: in isolated/linked mode the gate runs against
  // IsolatedNode instances, not real Nodes. A bundled IsolatedNode must
  // report inBundle so the gate blocks it even when its resolved URL
  // looks like a registry identity that a name entry would otherwise
  // match. Without inBundle on IsolatedNode the guard is silently
  // skipped and the bundled install script runs.
  const { IsolatedNode } = require('../lib/isolated-classes.js')

  const bundled = new IsolatedNode({
    inBundle: true,
    location: 'node_modules/bundled-pkg',
    name: 'bundled-pkg',
    package: { name: 'bundled-pkg', version: '1.0.0' },
    path: '/project/node_modules/bundled-pkg',
    resolved: 'https://registry.npmjs.org/bundled-pkg/-/bundled-pkg-1.0.0.tgz',
  })

  t.equal(bundled.inBundle, true, 'bundled IsolatedNode reports inBundle')
  t.equal(isScriptAllowed(bundled, { 'bundled-pkg': true }), null)
  t.equal(isScriptAllowed(bundled, { 'bundled-pkg@1.0.0': true }), null)

  const store = new IsolatedNode({
    isInStore: true,
    location: 'node_modules/.store/store-pkg@1.0.0/node_modules/store-pkg',
    name: 'store-pkg',
    package: { name: 'store-pkg', version: '1.0.0' },
    path: '/project/node_modules/.store/store-pkg@1.0.0/node_modules/store-pkg',
    resolved: 'https://registry.npmjs.org/store-pkg/-/store-pkg-1.0.0.tgz',
  })

  t.equal(store.inBundle, false, 'external store IsolatedNode is not bundled')
  t.equal(isScriptAllowed(store, { 'store-pkg@1.0.0': true }), true)
})

t.test('manifest confusion: malicious tarball self-name cannot bypass allow entry', async t => {
  // A package author publishes 'naughty' to the registry but inside the
  // tarball claims `package.json#name = "trusted"` and the matching
  // version. The lockfile records the registry URL for 'naughty'.
  // node.packageName / node.version return the tarball's claims; the
  // matcher MUST ignore both and consult only the URL.
  const malicious = {
    name: 'naughty', // dependency edge name (consumer's deps)
    packageName: 'trusted', // tarball's self-claimed name (LIE)
    version: '1.0.0', // tarball's self-claimed version
    resolved: 'https://registry.npmjs.org/naughty/-/naughty-1.0.0.tgz',
    location: 'node_modules/naughty',
    isRegistryDependency: true,
  }

  // The 'trusted' allowlist entry must NOT match this node.
  t.equal(isScriptAllowed(malicious, { trusted: true }), null)
  t.equal(isScriptAllowed(malicious, { 'trusted@1.0.0': true }), null)
  // A 'naughty' entry (the URL-derived name) DOES match.
  t.equal(isScriptAllowed(malicious, { naughty: true }), true)
  t.equal(isScriptAllowed(malicious, { 'naughty@1.0.0': true }), true)
})

t.test('manifest confusion: malicious version claim cannot satisfy version pin', async t => {
  // The tarball claims version 1.0.0 but the URL records 2.0.0. The
  // matcher must trust the URL.
  const malicious = {
    name: 'pkg',
    packageName: 'pkg',
    version: '1.0.0', // tarball lie
    resolved: 'https://registry.npmjs.org/pkg/-/pkg-2.0.0.tgz',
    location: 'node_modules/pkg',
    isRegistryDependency: true,
  }
  // Pin for the URL version matches.
  t.equal(isScriptAllowed(malicious, { 'pkg@2.0.0': true }), true)
  // Pin for the tarball's lie does NOT match.
  t.equal(isScriptAllowed(malicious, { 'pkg@1.0.0': true }), null)
})

t.test('manifest confusion: scoped registry tarball', async t => {
  const node = {
    name: 'pkg',
    packageName: 'totally-different',
    version: '9.9.9',
    resolved: 'https://registry.npmjs.org/@scope/real/-/real-1.0.0.tgz',
    location: 'node_modules/@scope/real',
    isRegistryDependency: true,
  }
  t.equal(isScriptAllowed(node, { '@scope/real': true }), true)
  t.equal(isScriptAllowed(node, { '@scope/real@1.0.0': true }), true)
  t.equal(isScriptAllowed(node, { 'totally-different': true }), null)
})

t.test('git committish: matching is one-directional (key is prefix of resolved SHA)', async t => {
  // The lockfile records a 40-char SHA; the policy key has a (typically
  // shorter) SHA. The trusted check is `nodeFullSha.startsWith(keyShortSha)`.
  // The reverse direction must NOT match — a malformed lockfile that
  // happens to record only a short committish must not let a longer key
  // authorize it.
  const shortNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    // Node committish is 8 chars; key committish below is longer.
    resolved: 'git+ssh://git@github.com/foo/bar.git#deadbeef',
  })
  // Key SHA strictly longer than the node committish: must not match.
  t.equal(
    isScriptAllowed(shortNode, { 'github:foo/bar#deadbeefcafebabe1234567890abcdef12345678': true }),
    null
  )
  // Node fully starts with key — matches normally.
  const fullNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: 'git+ssh://git@github.com/foo/bar.git#deadbeefcafebabe1234567890abcdef12345678',
  })
  t.equal(isScriptAllowed(fullNode, { 'github:foo/bar#deadbeef': true }), true)
})

t.test('git policy key against a non-git node does not match', t => {
  // matchGit fast-exits when the node has no resolved or its resolved
  // does not begin with `git`.
  const registryNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: 'https://registry.npmjs.org/bar/-/bar-1.0.0.tgz',
  })
  t.equal(isScriptAllowed(registryNode, { 'github:foo/bar': true }), null)

  const noResolved = {
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: undefined,
    edgesIn: new Set([{ name: 'bar', spec: 'github:foo/bar' }]),
  }
  t.equal(isScriptAllowed(noResolved, { 'github:foo/bar': true }), null)
  t.end()
})

t.test('git — non-hosted git URL matches via fetchSpec', t => {
  // Self-hosted git server: not on GitHub/GitLab/etc, so `hosted` is
  // undefined and the matcher falls back to comparing fetchSpec.
  const gitNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: 'git+ssh://git.example.com/foo/bar.git#deadbeefcafebabe1234567890abcdef12345678',
  })
  t.equal(
    isScriptAllowed(gitNode, { 'git+ssh://git.example.com/foo/bar.git': true }),
    true
  )
  t.equal(
    isScriptAllowed(gitNode, { 'git+ssh://git.example.com/foo/other.git': true }),
    null
  )
  t.end()
})

t.test('git — hosted key against non-hosted node falls through', t => {
  // A GitHub-style key cannot match a self-hosted git node: one side
  // produces a hosted.ssh URL, the other does not, so neither the
  // hosted branch nor the fetchSpec branch applies.
  const gitNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: 'git+ssh://git.example.com/foo/bar.git#deadbeefcafebabe1234567890abcdef12345678',
  })
  t.equal(isScriptAllowed(gitNode, { 'github:foo/bar': true }), null)
  t.end()
})

t.test('git — resolved URL without a committish does not match keys with one', t => {
  // The lockfile somehow recorded the git URL without a #SHA suffix.
  // Any policy key that pins a specific committish must NOT match.
  const gitNode = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.0.0',
    resolved: 'git+ssh://git@github.com/foo/bar.git',
  })
  t.equal(isScriptAllowed(gitNode, { 'github:foo/bar#deadbeef': true }), null)
  // Repo-only key still matches.
  t.equal(isScriptAllowed(gitNode, { 'github:foo/bar': true }), true)
  t.end()
})

t.test('file/directory key against a node with no resolved does not match', t => {
  const noResolved = {
    name: 'local-pkg',
    packageName: 'local-pkg',
    version: '1.0.0',
    resolved: undefined,
    edgesIn: new Set([{ name: 'local-pkg', spec: 'file:../local-pkg' }]),
  }
  t.equal(isScriptAllowed(noResolved, { 'file:../local-pkg': true }), null)
  t.end()
})

t.test('remote key against a node with no resolved does not match', t => {
  const noResolved = {
    name: 'pkg',
    packageName: 'pkg',
    version: '1.0.0',
    resolved: undefined,
    edgesIn: new Set([{ name: 'pkg', spec: 'https://example.com/pkg.tgz' }]),
  }
  t.equal(isScriptAllowed(noResolved, { 'https://example.com/pkg.tgz': true }), null)
  t.end()
})

t.test('alias-typed policy key never matches anything', t => {
  // Policy key parsed as type 'alias' (e.g. `foo@npm:bar@1.0.0`) is
  // explicitly disallowed. The user must address the real package name.
  const aliased = node({ name: 'foo', packageName: 'bar', version: '1.0.0' })
  t.equal(isScriptAllowed(aliased, { 'foo@npm:bar@1.0.0': true }), null)
  t.end()
})

t.test('registry — `pkg@latest` tag spec does not match (rejected up front)', t => {
  // npa parses `canvas@latest` as { type: 'tag' }. Validated out by
  // resolve-allow-scripts.js#validatePolicy; defense-in-depth here.
  const n = node({ name: 'canvas', version: '2.11.0' })
  t.equal(isScriptAllowed(n, { 'canvas@latest': true }), null)
  t.equal(isScriptAllowed(n, { 'other@latest': true }), null)
  t.end()
})

t.test('omit-lockfile: unparseable edge specs are skipped', t => {
  // An edge whose spec npa.resolve cannot parse is ignored; the matcher
  // continues to the next edge to find a trusted name.
  const omitted = {
    name: 'canvas',
    packageName: 'canvas',
    version: '2.11.0',
    resolved: undefined,
    location: 'node_modules/canvas',
    edgesIn: new Set([
      { name: 'canvas', spec: '\u0000not a real spec' },
      { name: 'canvas', spec: '^2.0.0' },
    ]),
  }
  t.equal(isScriptAllowed(omitted, { canvas: true }), true)
  t.end()
})

t.test('omit-lockfile: edges with only non-registry specs yield no trusted name', t => {
  // Every incoming edge is a git/file/remote spec, so nameFromEdges
  // walks them all and returns null at the end.
  const omitted = {
    name: 'canvas',
    packageName: 'canvas',
    version: '2.11.0',
    resolved: undefined,
    location: 'node_modules/canvas',
    edgesIn: new Set([
      { name: 'canvas', spec: 'github:foo/canvas' },
      { name: 'canvas', spec: 'file:../canvas' },
    ]),
  }
  t.equal(isScriptAllowed(omitted, { canvas: true }), null)
  t.end()
})

t.test('trustedDisplay returns URL-derived identity when available', t => {
  // Registry tarball URL carries name and version — those are trusted and
  // must override the tarball-self-claimed package fields.
  const n = node({
    name: 'pkg',
    packageName: 'lying-name',
    version: '9.9.9',
    resolved: 'https://registry.npmjs.org/canvas/-/canvas-2.11.0.tgz',
  })
  t.strictSame(trustedDisplay(n), { name: 'canvas', version: '2.11.0' })
  t.end()
})

t.test('trustedDisplay falls back to node.name/version when URL has no identity', t => {
  // Git source: matchGit handles it for matching, but trustedDisplay
  // accepts the node's self-reported name/version for human-facing output.
  const n = node({
    name: 'bar',
    packageName: 'bar',
    version: '1.2.3',
    resolved: 'git+ssh://git@github.com/foo/bar.git#deadbeefcafebabe1234567890abcdef12345678',
  })
  t.strictSame(trustedDisplay(n), { name: 'bar', version: '1.2.3' })
  t.end()
})
