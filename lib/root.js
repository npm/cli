const BaseCommand = require('./base-command.js')
class Root extends BaseCommand {
  static get description () {
    return 'Display npm root'
  }

  static get name () {
    return 'root'
  }

  static get params () {
    return ['global']
  }

  exec (args, cb) {
    this.root(args).then(() => cb()).catch(cb)
  }

  async root () {
    this.npm.output(this.npm.dir)
  }
}
module.exports = Root
