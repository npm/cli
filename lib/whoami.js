const getIdentity = require('./utils/get-identity.js')

const BaseCommand = require('./base-command.js')
class Whoami extends BaseCommand {
  static get description () {
    return 'Display npm username'
  }

  static get name () {
    return 'whoami'
  }

  static get params () {
    return ['registry']
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
