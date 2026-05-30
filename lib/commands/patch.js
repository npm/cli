const { resolve, relative, join, dirname, isAbsolute } = require('node:path')
const { tmpdir } = require('node:os')
const { mkdir, mkdtemp, rm, writeFile } = require('node:fs/promises')
const pacote = require('pacote')
const npa = require('npm-package-arg')
const semver = require('semver')
const PackageJson = require('@npmcli/package-json')
const { log, output } = require('proc-log')
const { matchSelector, parseSelector } = require('@npmcli/arborist/lib/patched-dependencies.js')
const { patchRelaxOpts } = require('../utils/cli-only-flag.js')
const BaseCommand = require('../base-cmd.js')
const { diffDirs } = require('../utils/patch-diff.js')
const reifyFinish = require('../utils/reify-finish.js')

const SUBCOMMANDS = ['add', 'commit', 'ls', 'rm']

// Build the selector key stored in patchedDependencies, e.g. lodash@4.17.21.
const selectorKey = (name, version) => `${name}@${version}`

// Posix-relative path to a patch file inside patches-dir for name@version.
const patchFilePath = (patchesDir, name, version) =>
  `${patchesDir}/${name}@${version}.patch`.split('\\').join('/')

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
    'registry',
  ]

  static usage = [
    '<pkg>[@<version>]',
    'add <pkg>[@<version>] [--edit-dir <path>] [--ignore-existing]',
    'commit <edit-dir> [--patches-dir <dir>] [--keep-edit-dir]',
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

  // Resolve a user spec to a concrete registry name@version to patch.
  async #resolveTarget (spec) {
    const parsed = npa(spec)
    if (parsed.type && !parsed.registry) {
      throw this.#nonRegistryError(spec)
    }

    const { name } = parsed
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

    // an explicit version/range is honored even when not present in the tree
    if (parsed.rawSpec && parsed.rawSpec !== '*' && parsed.rawSpec !== 'latest') {
      const exact = semver.valid(parsed.fetchSpec)
      if (exact) {
        ensureRegistry(exact)
        return { name, version: exact }
      }
      const matches = [...installed.keys()].filter(v => semver.satisfies(v, parsed.fetchSpec))
      if (matches.length > 1) {
        throw this.#ambiguousError(name, matches, installed)
      }
      if (matches.length === 1) {
        ensureRegistry(matches[0])
        return { name, version: matches[0] }
      }
      // resolve the range against the registry
      const mani = await pacote.manifest(spec, this.npm.flatOptions)
      return { name: mani.name, version: mani.version }
    }

    if (installed.size === 0) {
      throw Object.assign(
        new Error(`No installed version of "${name}" found. ` +
          `Run "npm install" first, or pass an explicit version.`),
        { code: 'EPATCHNOTINSTALLED' }
      )
    }
    if (installed.size > 1) {
      throw this.#ambiguousError(name, [...installed.keys()], installed)
    }
    const [version] = [...installed.keys()]
    ensureRegistry(version)
    return { name, version }
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

  async add (args) {
    if (args.length !== 1) {
      throw this.usageError()
    }
    const { name, version } = await this.#resolveTarget(args[0])

    let editDir = this.npm.config.get('edit-dir')
    if (!editDir) {
      const base = join(tmpdir(), 'npm-patch')
      await mkdir(base, { recursive: true })
      editDir = await mkdtemp(join(base, `${name.replace(/\//g, '+')}@${version}-`))
    } else {
      editDir = resolve(editDir)
      if (this.npm.config.get('ignore-existing')) {
        await rm(editDir, { recursive: true, force: true })
      }
      await mkdir(editDir, { recursive: true })
    }

    await pacote.extract(selectorKey(name, version), editDir, this.npm.flatOptions)

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
    const { name, version } = edited
    if (!name || !version) {
      throw new Error(`Edit directory package.json is missing name or version: ${editDir}`)
    }

    // extract a clean baseline to diff against
    const base = await mkdtemp(join(tmpdir(), 'npm-patch-base-'))
    let diff
    try {
      await pacote.extract(selectorKey(name, version), base, this.npm.flatOptions)
      diff = await diffDirs(base, editDir)
    } finally {
      await rm(base, { recursive: true, force: true })
    }

    if (!diff) {
      log.warn('patch', `no changes detected in ${editDir}; nothing to commit`)
      return
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
    patchedDependencies[selectorKey(name, version)] = relPatch
    pkgJson.update({ patchedDependencies })
    await pkgJson.save()

    // reify to apply the patch and record its integrity in the lockfile
    const arb = this.#newArborist()
    await arb.reify(arb.options)
    await reifyFinish(this.npm, arb)

    if (!this.npm.config.get('keep-edit-dir')) {
      await rm(editDir, { recursive: true, force: true })
    }

    output.standard(`Patched ${selectorKey(name, version)} -> ${relPatch}`)
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
