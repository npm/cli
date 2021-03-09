const getIdentity = require('./utils/get-identity.js')

const BaseCommand = require('./base-command.js')
class Whoami extends BaseCommand {
  /* istanbul ignore next - see test/lib/load-all-commands.js */
  static get name () {
    return 'whoami'
  }

  /* istanbul ignore next - see test/lib/load-all-commands.js */
  static get description () {
    return 'prints username according to given registry'
  }

  /* istanbul ignore next - see test/lib/load-all-commands.js */
  static get usage () {
    return ['[--registry <registry>]']
  }

  exec (args, cb) {
    this.whoami(args).then(() => cb()).catch(cb)
  }

  async whoami (args) {
    const username = await getIdentity(this.npm, this.npm.flatOptions)
    this.npm.output(
      this.npm.config.get('json') ? JSON.stringify(username) : username
    )
  }
}
module.exports = Whoami
