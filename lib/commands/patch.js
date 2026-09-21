const { resolve, relative, join, dirname, basename, isAbsolute, sep } = require('node:path')
const { tmpdir } = require('node:os')
const { cp, mkdir, mkdtemp, readFile, rm, writeFile } = require('node:fs/promises')
const pacote = require('pacote')
const npa = require('npm-package-arg')
const semver = require('semver')
const git = require('@npmcli/git')
const PackageJson = require('@npmcli/package-json')
const { log, output } = require('proc-log')
const { matchSelector, parseSelector } = require('@npmcli/arborist/lib/patched-dependencies.js')
const { applyPatchToDir } = require('@npmcli/arborist/lib/patch.js')
const { patchRelaxOpts } = require('../utils/cli-only-flag.js')
const BaseCommand = require('../base-cmd.js')
const { diffDirs } = require('../utils/patch-diff.js')
const reifyFinish = require('../utils/reify-finish.js')

const SUBCOMMANDS = ['add', 'commit', 'update', 'ls', 'rm']

// Marker left in a conflicted update edit dir so the finalizing commit drops the old exact selector.
const UPDATE_MARKER = '.npm-patch-update.json'
// Marker left in an npm: alias edit dir so commit keys the selector on the alias, not the real package name.
const ALIAS_MARKER = '.npm-patch-alias.json'
const MARKERS = new Set([UPDATE_MARKER, ALIAS_MARKER])

// fs.cp filter that skips a git working directory.
const notGitDir = src => !src.split(sep).includes('.git')

// Build the selector key stored in patchedDependencies, e.g. lodash@4.17.21.
const selectorKey = (name, version) => `${name}@${version}`

// Posix-relative path to a patch file inside patches-dir for name@version.
const patchFilePath = (patchesDir, name, version) =>
  `${patchesDir}/${name}@${version}.patch`.split('\\').join('/')

// Recover the exact version a patch file was authored against from its name.
// commit always writes <name>@<version>.patch, so the baseline is encoded there.
const patchFileVersion = patchPath => {
  const { spec } = parseSelector(basename(patchPath).replace(/\.patch$/, ''))
  return semver.valid(spec)
}

const patchErr = (message, code, extra = {}) =>
  Object.assign(new Error(message), { code, ...extra })

// Registry package names a dependency called `name` is fetched as: an npm: alias spec names its target.
const declaredSources = (specs, name) =>
  new Set(specs.length ? specs.map(spec => spec.startsWith('npm:') ? npa(spec.slice(4)).name : name) : [name])

// The project-root-relative posix path for abs, or null if abs escapes the root.
const containedRelative = (root, abs) => {
  const rel = relative(root, abs).split('\\').join('/')
  return (!rel || rel.startsWith('..') || isAbsolute(rel)) ? null : rel
}

class Patch extends BaseCommand {
  static description = 'Apply local patches to installed dependencies'
  static name = 'patch'
  static params = [
    'patches-dir',
    'allow-unused-patches',
    'ignore-patch-failures',
    'edit-dir',
    'ignore-existing',
    'keep-edit-dir',
    'to',
    'registry',
  ]

  static usage = [
    '<pkg>[@<version>]',
    'add <pkg>[@<version>] [--edit-dir <path>] [--ignore-existing]',
    'commit <edit-dir> [--patches-dir <dir>] [--keep-edit-dir]',
    'update <pkg>[@<old-version>] [--to <new-version>] [--patches-dir <dir>]',
    'ls',
    'rm <pkg>[@<version>]',
  ]

  static async completion (opts) {
    if (opts.conf.argv.remain.length === 2) {
      return SUBCOMMANDS
    }
    return []
  }

  async exec (args) {
    const [sub, ...rest] = args
    if (!sub) {
      throw this.usageError()
    }
    // explicit subcommand, else treat the bare arg as `patch add <pkg>`
    if (SUBCOMMANDS.includes(sub)) {
      return this[sub](rest)
    }
    return this.add(args)
  }

  get #root () {
    return this.npm.localPrefix
  }

  #newArborist (opts = {}) {
    const Arborist = require('@npmcli/arborist')
    return new Arborist({
      ...this.npm.flatOptions,
      ...patchRelaxOpts(this.npm.config),
      path: this.#root,
      ...opts,
    })
  }

  async #loadActual () {
    return this.#newArborist().loadActual()
  }

  // Resolve a user spec to the selector name, version, and registry package (source) to patch.
  // source differs from name only for an npm: alias, whose tarball is fetched under its real name.
  async #resolveTarget (spec) {
    const parsed = npa(spec)
    if (parsed.type && !parsed.registry) {
      throw this.#nonRegistryError(spec)
    }

    const { name } = parsed
    // name@npm:pkg@range resolves the range against pkg
    const explicitSource = parsed.type === 'alias' ? parsed.subSpec.name : null
    const wanted = parsed.type === 'alias' ? parsed.subSpec : parsed
    const tree = await this.#loadActual()
    // group every installed node by version so mixed-source duplicates are seen
    const installed = new Map()
    for (const node of tree.inventory.values()) {
      if (node.name === name && !node.isProjectRoot && node.version) {
        const nodes = installed.get(node.version) || []
        nodes.push(node)
        installed.set(node.version, nodes)
      }
    }

    // a version cannot be patched if a consumer depends on it through a non-registry spec (file:, git:, http(s)); npm: aliases stay registry.
    // checking the edges (not isRegistryDependency) avoids rejecting edgeless store nodes and linked symlinks, which are registry deps.
    const ensureRegistry = version => {
      const nodes = installed.get(version) || []
      if (nodes.some(n => [...n.edgesIn].some(e => e.spec && !npa(e.spec).registry))) {
        throw this.#nonRegistryError(`${name}@${version}`)
      }
    }

    // pick the one registry package behind name@version; installed nodes win over declared specs
    const sourceOf = version => {
      const nodes = version ? installed.get(version) || [] : [...installed.values()].flat()
      let sources = new Set(nodes.map(n => n.packageName || name))
      if (!sources.size) {
        const specs = [...tree.inventory.values()]
          .map(n => n.edgesOut.get(name)?.spec).filter(Boolean)
        sources = explicitSource ? new Set([explicitSource]) : declaredSources(specs, name)
      }
      if (explicitSource && [...sources].some(s => s !== explicitSource)) {
        throw patchErr(`"${name}" is installed as "${[...sources].join('", "')}", not "${explicitSource}".`,
          'EPATCHALIAS')
      }
      if (sources.size > 1) {
        throw patchErr(`"${name}" resolves to more than one package ` +
          `("${[...sources].join('", "')}"), so a "${name}" selector would patch all of them.`, 'EPATCHAMBIGUOUS')
      }
      return [...sources][0]
    }
    const target = version => {
      ensureRegistry(version)
      return { name, version, source: sourceOf(version) }
    }

    // an explicit version/range is honored even when not present in the tree
    if (wanted.rawSpec && wanted.rawSpec !== '*' && wanted.rawSpec !== 'latest') {
      const exact = semver.valid(wanted.fetchSpec)
      if (exact) {
        return target(exact)
      }
      const matches = [...installed.keys()].filter(v => semver.satisfies(v, wanted.fetchSpec))
      if (matches.length > 1) {
        throw this.#ambiguousError(name, matches, installed)
      }
      if (matches.length === 1) {
        return target(matches[0])
      }
      // resolve the range against the registry
      const source = sourceOf(null)
      const mani = await pacote.manifest(`${source}@${wanted.rawSpec}`, this.npm.flatOptions)
      return { name, version: mani.version, source }
    }

    if (installed.size === 0) {
      // point at the alias when the real package name was given
      const aliases = [...new Set([...tree.inventory.values()]
        .filter(n => n.packageName === name && n.name !== name && !n.isProjectRoot)
        .map(n => n.name))]
      const hint = aliases.length
        ? `It is installed as "${aliases.join('", "')}"; patch that name instead.`
        : 'Run "npm install" first, or pass an explicit version.'
      throw patchErr(`No installed version of "${name}" found. ${hint}`, 'EPATCHNOTINSTALLED')
    }
    if (installed.size > 1) {
      throw this.#ambiguousError(name, [...installed.keys()], installed)
    }
    return target([...installed.keys()][0])
  }

  // Record (or clear, for a reused --edit-dir) that an edit dir holds an npm: alias of source.
  async #writeAliasMarker (editDir, name, source) {
    const markerPath = join(editDir, ALIAS_MARKER)
    if (name === source) {
      return rm(markerPath, { force: true })
    }
    return writeFile(markerPath, JSON.stringify({ name, source }) + '\n')
  }

  // Parse a marker file left in an edit dir, or null when there is none.
  async #readMarker (editDir, file) {
    const raw = await readFile(join(editDir, file), 'utf8').catch(() => null)
    if (raw === null) {
      return null
    }
    try {
      return JSON.parse(raw)
    } catch {
      throw patchErr(`invalid ${file} marker in ${editDir}`, 'EPATCHBADMARKER')
    }
  }

  #nonRegistryError (label) {
    return Object.assign(
      new Error(`Cannot patch non-registry dependency "${label}". ` +
        `Only registry dependencies can be patched; edit the source directly.`),
      { code: 'EPATCHNONREGISTRY' }
    )
  }

  #ambiguousError (name, versions, installed) {
    const lines = versions.map(version => {
      const node = installed.get(version)[0]
      const dependant = [...node.edgesIn][0]?.from?.location || '(root)'
      return `  ${selectorKey(name, version)}  (via ${dependant})`
    })
    return Object.assign(
      new Error(`Multiple versions of "${name}" are installed:\n${lines.join('\n')}\n` +
        `Re-run with an exact selector, e.g. "npm patch add ${selectorKey(name, versions[0])}".`),
      { code: 'EPATCHAMBIGUOUS' }
    )
  }

  // Create (or reuse, with --edit-dir) the directory a package is extracted into for editing.
  async #makeEditDir (name, version) {
    let editDir = this.npm.config.get('edit-dir')
    if (!editDir) {
      const base = join(tmpdir(), 'npm-patch')
      await mkdir(base, { recursive: true })
      return mkdtemp(join(base, `${name.replace(/\//g, '+')}@${version}-`))
    }
    editDir = resolve(editDir)
    if (this.npm.config.get('ignore-existing')) {
      await rm(editDir, { recursive: true, force: true })
    }
    await mkdir(editDir, { recursive: true })
    return editDir
  }

  async add (args) {
    if (args.length !== 1) {
      throw this.usageError()
    }
    const { name, version, source } = await this.#resolveTarget(args[0])
    const editDir = await this.#makeEditDir(name, version)

    await pacote.extract(selectorKey(source, version), editDir, this.npm.flatOptions)
    await this.#writeAliasMarker(editDir, name, source)

    output.standard(`You can now edit the following directory: ${editDir}`)
    output.standard(`When done, run: npm patch commit ${editDir}`)
  }

  async commit (args) {
    if (args.length !== 1) {
      throw this.usageError()
    }
    const editDir = resolve(args[0])
    const { content: edited } = await PackageJson.normalize(editDir).catch(() => {
      throw Object.assign(
        new Error(`No package.json found in edit directory: ${editDir}`),
        { code: 'EPATCHNOEDITDIR' }
      )
    })
    const { name: source, version } = edited
    if (!source || !version) {
      throw new Error(`Edit directory package.json is missing name or version: ${editDir}`)
    }

    // an alias marker must describe this very package and a registry name, so a stale one cannot rename it
    const alias = await this.#readMarker(editDir, ALIAS_MARKER)
    if (alias && (alias.source !== source || typeof alias.name !== 'string' || npa(alias.name).name !== alias.name)) {
      throw patchErr(`invalid ${ALIAS_MARKER} marker in ${editDir}`, 'EPATCHBADMARKER')
    }
    const name = alias ? alias.name : source

    // a conflicted `patch update` leaves a marker so this commit drops the renamed-from selector
    // it is kept on disk (and excluded from the diff) so a re-run after a no-op resolution still finalizes the update
    const marker = await this.#readMarker(editDir, UPDATE_MARKER)

    // extract a clean baseline to diff against
    const base = await mkdtemp(join(tmpdir(), 'npm-patch-base-'))
    let diff, packageJsonChanged
    try {
      await pacote.extract(selectorKey(source, version), base, this.npm.flatOptions)
      ;({ diff, packageJsonChanged } = await diffDirs(base, editDir, MARKERS))
    } finally {
      await rm(base, { recursive: true, force: true })
    }

    if (!diff) {
      // package.json is excluded from patches, so an edit limited to it captures nothing
      const reason = packageJsonChanged
        ? `only package.json changed in ${editDir}, which is not patchable; nothing to commit`
        : `no changes detected in ${editDir}; nothing to commit`
      log.warn('patch', reason)
      return
    }
    if (packageJsonChanged) {
      log.warn('patch', 'changes to package.json are not included in patches and were ignored')
    }

    const patchesDir = this.npm.config.get('patches-dir')
    const absPatch = resolve(this.#root, patchFilePath(patchesDir, name, version))
    // refuse to write outside the project so the patch set stays in the repo
    const relPatch = containedRelative(this.#root, absPatch)
    if (!relPatch) {
      throw Object.assign(
        new Error(`patches-dir "${patchesDir}" resolves outside the project root.`),
        { code: 'EPATCHUNSAFE' }
      )
    }
    await mkdir(dirname(absPatch), { recursive: true })
    await writeFile(absPatch, diff)

    const pkgJson = await PackageJson.load(this.#root)
    const patchedDependencies = { ...pkgJson.content.patchedDependencies }
    const newKey = selectorKey(name, version)
    patchedDependencies[newKey] = relPatch
    // a marker left by a conflicted `patch update` for this package means a metadata-only finalize.
    // its name is checked so a stray or forged marker can never hijack a normal commit.
    const updateFinalize = !!marker && marker.name === name
    let orphan = null
    // an exact rename drops the renamed-from selector; a fork carries removeKey null and keeps the old entry.
    // removeKey must be a real, same-package selector string, so a malformed marker can neither crash nor drop the wrong entry.
    if (updateFinalize && typeof marker.removeKey === 'string' && marker.removeKey !== newKey &&
      patchedDependencies[marker.removeKey] !== undefined &&
      parseSelector(marker.removeKey).name === name) {
      orphan = this.#dropSelector(patchedDependencies, marker.removeKey)
    }
    pkgJson.update({ patchedDependencies })
    await pkgJson.save()

    // finishing a conflicted update is metadata-only (like update itself): the new version may not be installed yet
    const arb = updateFinalize
      ? this.#newArborist({ packageLockOnly: true, allowUnusedPatches: true, audit: false })
      : this.#newArborist()
    await arb.reify(arb.options)
    await reifyFinish(this.npm, arb)

    // remove the renamed-from patch file only after the lockfile is durable
    await this.#removePatchFile(orphan)

    if (!this.npm.config.get('keep-edit-dir')) {
      await rm(editDir, { recursive: true, force: true })
    }

    output.standard(`Patched ${newKey} -> ${relPatch}`)
  }

  // Remove a selector from the map; return its patch file path if nothing else references it.
  #dropSelector (patched, key) {
    const patchPath = patched[key]
    delete patched[key]
    /* istanbul ignore next - the shared-file branch only fires when two selectors point at one patch */
    return (patchPath && !Object.values(patched).includes(patchPath)) ? patchPath : null
  }

  // Delete an orphaned patch file, but never one that escapes the project root.
  async #removePatchFile (patchPath) {
    if (!patchPath) {
      return
    }
    const abs = resolve(this.#root, patchPath)
    /* istanbul ignore else - defensive: orphaned paths come from the manifest and stay in-project */
    if (containedRelative(this.#root, abs)) {
      await rm(abs, { force: true })
    }
  }

  async update (args) {
    if (args.length !== 1) {
      throw this.usageError()
    }

    const pkgJson = await PackageJson.load(this.#root)
    const patched = { ...pkgJson.content.patchedDependencies }
    const entry = this.#resolveUpdateEntry(args[0], patched)

    const baseVersion = patchFileVersion(entry.patchPath)
    if (!baseVersion) {
      throw patchErr(
        `cannot determine the version "${entry.patchPath}" was authored against; rebase by hand`,
        'EPATCHBASE'
      )
    }

    const { versions: installedVersions, sources } =
      await this.#installedVersions(entry.name, pkgJson.content)
    const newVersion = this.#resolveNewVersion(entry, installedVersions)
    if (newVersion === baseVersion) {
      throw patchErr(`nothing to update: the patch already targets ${selectorKey(entry.name, newVersion)}`, 'EPATCHNOOP')
    }
    const newKey = selectorKey(entry.name, newVersion)
    if (patched[newKey] && newKey !== entry.key) {
      throw patchErr(
        `an entry already exists for ${newKey}; use "npm patch rm" first or rebase manually`,
        'EPATCHEXISTS'
      )
    }

    // an npm: alias rebases the real package's tarballs but keeps the alias selector
    if (sources.size > 1) {
      throw patchErr(`"${entry.name}" resolves to more than one package ("${[...sources].join('", "')}"); rebase by hand`,
        'EPATCHAMBIGUOUS')
    }
    const [source] = sources
    const rebase = await this.#rebasePatch({
      source,
      baseVersion,
      newVersion,
      patchAbs: resolve(this.#root, entry.patchPath),
    })
    try {
      if (rebase.conflicted) {
        const editDir = await this.#makeEditDir(entry.name, newVersion)
        try {
          await cp(rebase.repo, editDir, { recursive: true, filter: notGitDir })
          // mark the conflict so the finalizing commit knows this is an update finalize.
          // an exact selector is a rename (drop the old key); a range/name-only is a fork (keep it).
          const removeKey = entry.spec && semver.valid(entry.spec) ? entry.key : null
          await writeFile(join(editDir, UPDATE_MARKER), JSON.stringify({ name: entry.name, removeKey }) + '\n')
          await this.#writeAliasMarker(editDir, entry.name, source)
        } catch (er) {
          // discard a temp edit dir we created if the copy or marker write fails; never a user-supplied --edit-dir
          /* istanbul ignore next - a failing copy/marker write is not deterministically reproducible */
          if (!this.npm.config.get('edit-dir')) {
            await rm(editDir, { recursive: true, force: true })
          }
          /* istanbul ignore next */
          throw er
        }
        output.standard(`Patch did not apply cleanly to ${newKey}.`)
        output.standard(`Resolve the conflicts in: ${editDir}`)
        output.standard(`When done, run: npm patch commit ${editDir}`)
        return
      }

      const { diff } = await diffDirs(rebase.newDir, rebase.repo)
      if (!diff) {
        throw patchErr(
          `the patch no longer changes ${newKey}; remove it with "npm patch rm" instead`,
          'EPATCHEMPTY'
        )
      }
      await this.#finalizeUpdate({
        pkgJson, patched, entry, name: entry.name, newVersion, newKey, diff, installedVersions,
      })
    } finally {
      await rm(rebase.work, { recursive: true, force: true })
    }
  }

  // Identify the single patchedDependencies entry the update targets.
  #resolveUpdateEntry (spec, patched) {
    const target = npa(spec)
    const name = target.name
    const oldSpec = target.rawSpec && target.rawSpec !== '*' ? target.fetchSpec : null
    const keys = Object.keys(patched)

    if (oldSpec) {
      const key = selectorKey(name, oldSpec)
      if (!patched[key]) {
        throw patchErr(`no patch registered for ${key}`, 'EPATCHNOTFOUND')
      }
      return { key, name, spec: oldSpec, patchPath: patched[key] }
    }

    const matches = keys.filter(k => parseSelector(k).name === name)
    if (!matches.length) {
      throw patchErr(`no patch to update for "${name}"`, 'EPATCHNOTFOUND')
    }
    if (matches.length > 1) {
      throw patchErr(
        `multiple patches match "${name}":\n${matches.map(k => `  ${k}`).join('\n')}\n` +
          `Re-run with an explicit selector, e.g. "npm patch update ${matches[0]}".`,
        'EPATCHAMBIGUOUS'
      )
    }
    const key = matches[0]
    return { key, name, spec: parseSelector(key).spec, patchPath: patched[key] }
  }

  // Determine the version to rebase onto: --to, else the installed version matching the selector.
  #resolveNewVersion (entry, installedVersions) {
    const to = this.npm.config.get('to')
    if (to) {
      const valid = semver.valid(to)
      if (!valid) {
        throw patchErr(`--to "${to}" is not a valid version`, 'EPATCHBADTO')
      }
      // update finalizes with allowUnusedPatches, so a --to absent from the tree records an unused patch silently.
      // The next plain install then rejects with EPATCHUNUSED, so warn now to surface the mismatch early.
      if (installedVersions !== null && !installedVersions.includes(valid)) {
        log.warn('patch',
          `${selectorKey(entry.name, valid)} is not installed; ` +
            `bump the dependency and reinstall, or the next "npm install" will fail with EPATCHUNUSED.`)
      }
      return valid
    }

    if (installedVersions === null) {
      throw patchErr(
        `could not read the lockfile for "${entry.name}"; ` +
          `run "npm install" first or pass --to <new-version>`,
        'EPATCHSTALE'
      )
    }
    const { spec } = entry
    let matching
    if (spec && semver.valid(spec)) {
      matching = installedVersions.filter(v => semver.eq(v, spec))
    } else if (spec) {
      matching = installedVersions.filter(v => semver.satisfies(v, spec))
    } else {
      matching = installedVersions
    }
    if (!matching.length) {
      throw patchErr(
        `no installed version matches the patch selector "${entry.key}"; ` +
          `pass --to <new-version> to rebase onto a specific version`,
        'EPATCHSTALE'
      )
    }
    return matching.sort(semver.rcompare)[0]
  }

  // Distinct registry-installed versions of a package from the lockfile (null when it cannot be loaded), plus the registry packages it is fetched as.
  // Uses loadVirtual so the lockfile's own validity gates staleness and links/workspaces are excluded.
  async #installedVersions (name, rootPkg) {
    // an uninstalled package can still be told apart as an npm: alias from the root manifest
    const declared = () => declaredSources(['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
      .map(type => rootPkg[type]?.[name]).filter(Boolean), name)
    let tree
    try {
      tree = await this.#newArborist().loadVirtual()
    } catch {
      return { versions: null, sources: declared() }
    }
    const versions = new Set()
    const sources = new Set()
    for (const node of tree.inventory.values()) {
      if (node.isProjectRoot || node.isWorkspace || node.isLink || !node.version) {
        continue
      }
      /* istanbul ignore else - other-named nodes are skipped; only exercised with multi-package trees */
      if (node.name === name) {
        versions.add(node.version)
        sources.add(node.packageName)
      }
    }
    return { versions: [...versions], sources: sources.size ? sources : declared() }
  }

  // 3-way merge the existing patch onto the new version via a throwaway git repo.
  // Returns { work, repo, newDir, conflicted }; the caller removes work on success.
  async #rebasePatch ({ source, baseVersion, newVersion, patchAbs }) {
    const work = await mkdtemp(join(tmpdir(), 'npm-patch-rebase-'))
    try {
      const baseDir = join(work, 'base')
      const newDir = join(work, 'new')
      const repo = join(work, 'repo')
      await pacote.extract(selectorKey(source, baseVersion), baseDir, this.npm.flatOptions)
      await pacote.extract(selectorKey(source, newVersion), newDir, this.npm.flatOptions)
      await mkdir(repo, { recursive: true })

      const id = ['-c', 'user.name=npm', '-c', 'user.email=npm@npmjs.com', '-c', 'commit.gpgsign=false']
      await this.#git(['init', '-q', '-b', 'base'], repo)
      // base = the version the patch was authored against
      await cp(baseDir, repo, { recursive: true })
      await this.#git(['add', '-Af'], repo)
      await this.#git([...id, 'commit', '-qm', 'base', '--allow-empty'], repo)
      // theirs = base + the existing patch, applied with the same jsdiff helper installs use
      await this.#git(['checkout', '-q', '-b', 'theirs'], repo)
      try {
        await applyPatchToDir({ patch: await readFile(patchAbs), cwd: repo })
      } catch (er) {
        throw patchErr(
          `the existing patch no longer applies to its baseline ${selectorKey(source, baseVersion)}; rebase by hand`,
          'EPATCHBASE',
          { cause: er }
        )
      }
      await this.#git(['add', '-Af'], repo)
      await this.#git([...id, 'commit', '-qm', 'theirs', '--allow-empty'], repo)
      // ours = the new version, branched from base
      await this.#git(['checkout', '-q', '-b', 'ours', 'base'], repo)
      await this.#git(['rm', '-rqf', '.'], repo)
      await cp(newDir, repo, { recursive: true })
      await this.#git(['add', '-Af'], repo)
      await this.#git([...id, 'commit', '-qm', 'ours', '--allow-empty'], repo)
      // replay the patch's intent onto the new version
      let conflicted = false
      try {
        await this.#git([...id, 'merge', '--no-edit', 'theirs'], repo)
      } catch (er) {
        // a genuine conflict leaves unmerged paths; any other non-zero exit is a real git failure
        const unmerged = await this.#git(['ls-files', '--unmerged'], repo)
        /* istanbul ignore else - a non-conflict merge failure is a git/environment fault */
        if (String(unmerged.stdout).trim()) {
          conflicted = true
        } else {
          throw er
        }
      }
      return { work, repo, newDir, conflicted }
    } catch (er) {
      await rm(work, { recursive: true, force: true })
      throw er
    }
  }

  #git (args, cwd) {
    return git.spawn(args, {
      cwd,
      env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null' },
    })
  }

  // Apply the selector rules, write the new patch, and sync the lockfile without touching node_modules.
  async #finalizeUpdate (opts) {
    const { pkgJson, patched, entry, name, newVersion, newKey, diff, installedVersions } = opts
    const patchesDir = this.npm.config.get('patches-dir')
    const absPatch = resolve(this.#root, patchFilePath(patchesDir, name, newVersion))
    const relPatch = containedRelative(this.#root, absPatch)
    if (!relPatch) {
      throw patchErr(`patches-dir "${patchesDir}" resolves outside the project root.`, 'EPATCHUNSAFE')
    }
    // write the new patch first so no selector points at a missing file
    await mkdir(dirname(absPatch), { recursive: true })
    await writeFile(absPatch, diff)

    patched[newKey] = relPatch
    // drop the old selector only when it no longer wins any installed node, so a still-needed range survives
    let orphan = null
    if (entry.key !== newKey && this.#selectorUnused(patched, entry.key, name, installedVersions)) {
      orphan = this.#dropSelector(patched, entry.key)
    }

    pkgJson.update({ patchedDependencies: patched })
    await pkgJson.save()

    // record the new patch integrity in the lockfile only; update never touches node_modules
    const arb = this.#newArborist({ packageLockOnly: true, allowUnusedPatches: true, audit: false })
    await arb.reify(arb.options)
    await reifyFinish(this.npm, arb)

    // remove the now-orphaned old patch file only after the lockfile is durable
    await this.#removePatchFile(orphan)

    output.standard(`Updated ${entry.key} -> ${newKey} (${relPatch})`)
  }

  // Whether `key` should be dropped once the new selector is added.
  // An exact selector is a straight rename. A range/name-only selector is dropped only when it no longer
  // wins any installed node under the installer's exact > range > name-only precedence, so a kept one is still used.
  #selectorUnused (patched, key, name, installedVersions) {
    const { spec } = parseSelector(key)
    if (spec && semver.valid(spec)) {
      return true
    }
    if (installedVersions === null) {
      return false
    }
    const selectors = Object.keys(patched)
      .filter(k => parseSelector(k).name === name)
      .map(k => ({ ...parseSelector(k), key: k }))
    for (const version of installedVersions) {
      let winner
      try {
        winner = matchSelector(selectors, { name, version })
      } catch {
        /* istanbul ignore next - ambiguous overlapping ranges: keep the selector to be safe */
        return false
      }
      /* istanbul ignore if - a still-winning selector is kept; only exercised with multiple installed versions */
      if (winner?.key === key) {
        return false
      }
    }
    return true
  }

  async ls () {
    const pkgJson = await PackageJson.normalize(this.#root).catch(() => ({ content: {} }))
    const patched = pkgJson.content.patchedDependencies || {}
    const keys = Object.keys(patched)
    if (!keys.length) {
      return
    }

    // count nodes per patch using the same precedence Arborist applies at install
    const tree = await this.#loadActual()
    const selectors = keys.map(key => ({ ...parseSelector(key), key, patchPath: patched[key] }))
    const counts = new Map(keys.map(key => [key, 0]))
    // only the overlapping range selectors that actually conflict on a node
    const ambiguous = new Set()
    for (const node of tree.inventory.values()) {
      if (node.isProjectRoot || node.isLink || !node.version) {
        continue
      }
      let winner = null
      try {
        winner = matchSelector(selectors, node)
      } catch {
        for (const s of selectors) {
          if (s.name === node.name && s.spec && !semver.valid(s.spec) &&
            semver.satisfies(node.version, s.spec)) {
            ambiguous.add(s.key)
          }
        }
        continue
      }
      if (winner) {
        counts.set(winner.key, counts.get(winner.key) + 1)
      }
    }
    for (const key of keys) {
      if (ambiguous.has(key)) {
        output.standard(`${patched[key]}\t${key}\t(error: ambiguous selectors)`)
        continue
      }
      const n = counts.get(key)
      output.standard(`${patched[key]}\t${key}\t(${n} node${n === 1 ? '' : 's'})`)
    }
  }

  async rm (args) {
    if (args.length !== 1) {
      throw this.usageError()
    }
    const target = npa(args[0])
    const targetName = target.name
    const targetVersion = target.rawSpec && target.rawSpec !== '*' ? target.fetchSpec : null

    const pkgJson = await PackageJson.load(this.#root)
    const patched = { ...pkgJson.content.patchedDependencies }
    const removed = []
    for (const key of Object.keys(patched)) {
      const { name, spec } = parseSelector(key)
      if (name === targetName && (!targetVersion || spec === targetVersion)) {
        removed.push(key)
      }
    }
    if (!removed.length) {
      throw Object.assign(
        new Error(`No registered patch found for "${args[0]}".`),
        { code: 'EPATCHNOTFOUND' }
      )
    }

    for (const key of removed) {
      const patchPath = patched[key]
      delete patched[key]
      // only delete the file when no remaining selector references it
      if (!Object.values(patched).includes(patchPath)) {
        const abs = resolve(this.#root, patchPath)
        // never delete a path that escapes the project root
        if (!containedRelative(this.#root, abs)) {
          throw Object.assign(
            new Error(`Refusing to delete patch outside the project root: ${patchPath}`),
            { code: 'EPATCHUNSAFE' }
          )
        }
        await rm(abs, { force: true })
      }
    }

    if (Object.keys(patched).length) {
      pkgJson.update({ patchedDependencies: patched })
    } else {
      delete pkgJson.content.patchedDependencies
    }
    await pkgJson.save()

    const arb = this.#newArborist()
    await arb.reify(arb.options)
    await reifyFinish(this.npm, arb)

    output.standard(`Removed patch${removed.length === 1 ? '' : 'es'}: ${removed.join(', ')}`)
  }
}

module.exports = Patch
