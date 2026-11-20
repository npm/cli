const { relative, resolve } = require('node:path')
const { readFile, writeFile } = require('node:fs/promises')
const { output } = require('proc-log')
const BaseCommand = require('../base-cmd.js')

class Version extends BaseCommand {
  static description = 'Bump a package version'
  static name = 'version'
  static params = [
    'allow-same-version',
    'commit-hooks',
    'git-tag-version',
    'json',
    'preid',
    'sign-git-tag',
    'save',
    'workspace',
    'workspaces',
    'workspaces-update',
    'include-workspace-root',
    'ignore-scripts',
  ]

  static workspaces = true
  static ignoreImplicitWorkspace = true
  static skipConfigValidation = true

  static usage = ['[<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]']

  get prefix () {
    const [workspacePrefix] = this.npm.config.get('workspace', 'default') || []
    return workspacePrefix || this.npm.prefix
  }

  static async completion (opts) {
    const {
      conf: {
        argv: { remain },
      },
    } = opts
    if (remain.length > 2) {
      return []
    }

    return [
      'major',
      'minor',
      'patch',
      'premajor',
      'preminor',
      'prepatch',
      'prerelease',
      'from-git',
    ]
  }

  async exec (args) {
    switch (args.length) {
      case 0:
        return this.list()
      case 1:
        return this.change(args)
      default:
        throw this.usageError()
    }
  }

  async execWorkspaces (args) {
    switch (args.length) {
      case 0:
        return this.listWorkspaces()
      case 1:
        return this.changeWorkspaces(args)
      default:
        throw this.usageError()
    }
  }

  async change (args) {
    const libnpmversion = require('libnpmversion')
    const prefix = this.npm.config.get('tag-version-prefix')
    const version = await libnpmversion(args[0], {
      ...this.npm.flatOptions,
      path: this.prefix,
    })
    await this.updateProjectLockfile(version)
    return output.standard(`${prefix}${version}`)
  }

  // libnpmversion only writes a lockfile that sits next to the manifest it
  // versions. A workspace that is versioned implicitly has no lockfile of its
  // own, so its entry in the project lockfile is updated here instead. This is
  // opt in through `--save` for the same reason `update-workspaces` is: writing
  // the project lockfile is what makes parallel versions race with each other.
  async updateProjectLockfile (version) {
    const { config, flatOptions, localPrefix } = this.npm
    if (this.prefix === localPrefix) {
      return
    }
    if (config.isDefault('save') || !config.get('save')) {
      return
    }
    if (!flatOptions.workspacesUpdate) {
      return
    }

    const lockPath = resolve(localPrefix, 'package-lock.json')
    const lock = await readFile(lockPath, 'utf8')
      .then(data => JSON.parse(data))
      .catch(() => null)
    const workspacePath = relative(localPrefix, this.prefix).replace(/\\/g, '/')
    const entry = lock?.packages?.[workspacePath]
    if (!entry) {
      return
    }
    entry.version = version
    await writeFile(lockPath, JSON.stringify(lock, null, 2) + '\n')
  }

  async changeWorkspaces (args) {
    const updateWorkspaces = require('../utils/update-workspaces.js')
    const libnpmversion = require('libnpmversion')
    const prefix = this.npm.config.get('tag-version-prefix')
    const {
      config,
      flatOptions,
      localPrefix,
    } = this.npm
    await this.setWorkspaces()
    const updatedWorkspaces = []
    for (const [name, path] of this.workspaces) {
      output.standard(name)
      const version = await libnpmversion(args[0], {
        ...flatOptions,
        'git-tag-version': false,
        path,
      })
      updatedWorkspaces.push(name)
      output.standard(`${prefix}${version}`)
    }
    return updateWorkspaces({
      config,
      flatOptions,
      localPrefix,
      npm: this.npm,
      workspaces: updatedWorkspaces,
    })
  }

  async list (results = {}) {
    const pj = resolve(this.prefix, 'package.json')

    const pkg = await readFile(pj, 'utf8')
      .then(data => JSON.parse(data))
      .catch(() => ({}))

    if (pkg.name && pkg.version) {
      results[pkg.name] = pkg.version
    }

    results.npm = this.npm.version
    for (const [key, version] of Object.entries(process.versions)) {
      results[key] = version
    }

    if (this.npm.config.get('json')) {
      output.buffer(results)
    } else {
      output.standard(results)
    }
  }

  async listWorkspaces () {
    const results = {}
    await this.setWorkspaces()
    for (const path of this.workspacePaths) {
      const pj = resolve(path, 'package.json')
      // setWorkspaces has already parsed package.json so we know it won't error
      const pkg = await readFile(pj, 'utf8').then(data => JSON.parse(data))

      if (pkg.name && pkg.version) {
        results[pkg.name] = pkg.version
      }
    }
    return this.list(results)
  }
}

module.exports = Version
