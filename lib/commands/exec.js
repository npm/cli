const libexec = require('libnpmexec')
const BaseCommand = require('../base-command.js')

class Exec extends BaseCommand {
  static description = 'Run a command from a local or remote npm package'
  static params = [
    'package',
    'call',
    'workspace',
    'workspaces',
    'include-workspace-root',
  ]

  static name = 'exec'
  static usage = [
    '-- <pkg>[@<version>] [args...]',
    '--package=<pkg>[@<version>] -- <cmd> [args...]',
    '-c \'<cmd> [args...]\'',
    '--package=foo -c \'<cmd> [args...]\'',
  ]

  static ignoreImplicitWorkspace = false
  static isShellout = true

  async exec (_args, { locationMsg, runPath } = {}) {
    // This is where libnpmexec will look for locally installed packages
    const path = this.npm.localPrefix

    // This is where libnpmexec will actually run the scripts from
    if (!runPath) {
      runPath = process.cwd()
    }

    const args = [..._args]
    const call = this.npm.config.get('call')
    const {
      flatOptions,
      localBin,
      globalBin,
    } = this.npm
    const output = this.npm.output.bind(this.npm)
    const scriptShell = this.npm.config.get('script-shell') || undefined
    const packages = this.npm.config.get('package')
    const yes = this.npm.config.get('yes')

    if (call && _args.length) {
      throw this.usageError()
    }

    return libexec({
      ...flatOptions,
      // we explicitly set packageLockOnly to false because if it's true
      // when we try to install a missing package, we won't actually install it
      packageLockOnly: false,
      args,
      call,
      localBin,
      locationMsg,
      globalBin,
      output,
      packages,
      path,
      runPath,
      scriptShell,
      yes,
    })
  }

  async execWorkspaces (args, filters) {
    await this.setWorkspaces(filters)

    for (const [name, path] of this.workspaces) {
      const locationMsg =
        `in workspace ${this.npm.chalk.green(name)} at location:\n${this.npm.chalk.dim(path)}`
      await this.exec(args, { locationMsg, runPath: path })
    }
  }
}

module.exports = Exec
