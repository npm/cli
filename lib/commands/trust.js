const BaseCommand = require('../base-cmd.js')

class Trust extends BaseCommand {
  static description = 'Create a trusted relationship between a package and a OIDC provider'
  static name = 'trust'

  static subcommands = {
    github: require('../subcommands/trust-github.js'),
    gitlab: require('../subcommands/trust-gitlab.js'),
    list: require('../subcommands/trust-list.js'),
    revoke: require('../subcommands/trust-revoke.js'),
  }

  static async completion (opts) {
    const argv = opts.conf.argv.remain
    if (argv.length === 2) {
      return Object.keys(Trust.subcommands)
    }
    return []
  }
}

module.exports = Trust
