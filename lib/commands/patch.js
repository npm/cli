const { resolve, relative, join, dirname } = require('node:path')
const { tmpdir } = require('node:os')
const { mkdir, mkdtemp, rm, writeFile } = require('node:fs/promises')
const pacote = require('pacote')
const npa = require('npm-package-arg')
const semver = require('semver')
const PackageJson = require('@npmcli/package-json')
const { log, output } = require('proc-log')
const BaseCommand = require('../base-cmd.js')
const { diffDirs } = require('../utils/patch-diff.js')
const reifyFinish = require('../utils/reify-finish.js')

const SUBCOMMANDS = ['add', 'commit', 'ls', 'rm']

// Build the selector key stored in patchedDependencies, e.g. lodash@4.17.21.
const selectorKey = (name, version) => `${name}@${version}`

// Posix-relative path to a patch file inside patches-dir for name@version.
const patchFilePath = (patchesDir, name, version) =>
  `${patchesDir}/${name}@${version}.patch`.split('\\').join('/')

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
    return new Arborist({ ...this.npm.flatOptions, path: this.#root, ...opts })
  }

  async #loadActual () {
    return this.#newArborist().loadActual()
  }

  // Resolve a user spec to a concrete registry name@version to patch.
  async #resolveTarget (spec) {
    const parsed = npa(spec)
    if (parsed.type && !parsed.registry) {
      throw Object.assign(
        new Error(`Cannot patch non-registry dependency "${spec}". ` +
          `Only registry dependencies can be patched; edit the source directly.`),
        { code: 'EPATCHNONREGISTRY' }
      )
    }

    const { name } = parsed
    const tree = await this.#loadActual()
    const installed = new Map()
    for (const node of tree.inventory.values()) {
      if (node.name === name && !node.isProjectRoot && !node.isLink && node.version) {
        if (!installed.has(node.version)) {
          installed.set(node.version, node)
        }
      }
    }

    // an explicit version/range is honored even when not present in the tree
    if (parsed.rawSpec && parsed.rawSpec !== '*' && parsed.rawSpec !== 'latest') {
      const exact = semver.valid(parsed.fetchSpec)
      if (exact) {
        return { name, version: exact }
      }
      const match = [...installed.keys()]
        .filter(v => semver.satisfies(v, parsed.fetchSpec))
        .sort(semver.rcompare)[0]
      if (match) {
        return { name, version: match }
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
      const lines = [...installed.entries()].map(([version, node]) => {
        const dependant = [...node.edgesIn][0]?.from?.location || '(root)'
        return `  ${selectorKey(name, version)}  (via ${dependant})`
      })
      throw Object.assign(
        new Error(`Multiple versions of "${name}" are installed:\n${lines.join('\n')}\n` +
          `Re-run with an exact selector, e.g. "npm patch add ${selectorKey(name, [...installed.keys()][0])}".`),
        { code: 'EPATCHAMBIGUOUS' }
      )
    }
    return { name, version: [...installed.keys()][0] }
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
      diff = await diffDirs(base, editDir, { exclude: [] })
    } finally {
      await rm(base, { recursive: true, force: true })
    }

    if (!diff) {
      log.warn('patch', `no changes detected in ${editDir}; nothing to commit`)
      return
    }

    const patchesDir = this.npm.config.get('patches-dir')
    const absPatch = resolve(this.#root, patchFilePath(patchesDir, name, version))
    // always store a project-root-relative, posix-style path
    const relPatch = relative(this.#root, absPatch).split('\\').join('/')
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

    const tree = await this.#loadActual()
    for (const key of keys) {
      const { name, spec } = this.#parseKey(key)
      const matches = [...tree.inventory.values()].filter(node =>
        node.name === name && !node.isProjectRoot && !node.isLink && node.version &&
        (!spec || semver.valid(spec)
          ? (!spec || node.version === spec)
          : semver.satisfies(node.version, spec)))
      output.standard(`${patched[key]}\t${key}\t(${matches.length} node${matches.length === 1 ? '' : 's'})`)
    }
  }

  #parseKey (key) {
    const at = key.indexOf('@', 1)
    return at === -1
      ? { name: key, spec: null }
      : { name: key.slice(0, at), spec: key.slice(at + 1) }
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
      const { name, spec } = this.#parseKey(key)
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
        await rm(resolve(this.#root, patchPath), { force: true })
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
