const AllowScriptsCmd = require('../utils/allow-scripts-cmd.js')

// Namespaced front-end for managing install-script approvals.
// `approve` and `deny` write the `allowScripts` policy; `ls` lists packages with unreviewed install scripts.
// The standalone `npm approve-scripts` and `npm deny-scripts` commands remain as aliases for `approve` and `deny`.
class InstallScripts extends AllowScriptsCmd {
  static description = 'Manage install-script approvals for dependencies'
  static name = 'install-scripts'
  static usage = [
    'approve <pkg> [<pkg> ...]',
    'approve --all',
    'deny <pkg> [<pkg> ...]',
    'deny --all',
    'ls',
  ]

  static params = ['all', 'allow-scripts-pin', 'json']

  static async completion (opts) {
    const argv = opts.conf.argv.remain
    const subcommands = ['approve', 'deny', 'ls']
    if (argv.length === 2) {
      return subcommands
    }
    if (subcommands.includes(argv[2])) {
      return []
    }
    throw new Error(`${argv[2]} not recognized`)
  }

  async exec (args) {
    const [sub, ...rest] = args
    switch (sub) {
      case 'approve':
        return this.runMode('approve', rest)
      case 'deny':
        return this.runMode('deny', rest)
      case 'ls':
      case 'list':
        return this.runMode('list', rest)
      default:
        throw this.usageError(
          sub ? `\`${sub}\` is not a recognized subcommand.` : undefined
        )
    }
  }
}

module.exports = InstallScripts
