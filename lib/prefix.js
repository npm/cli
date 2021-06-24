const BaseCommand = require('./base-command.js')

class Prefix extends BaseCommand {
  static get description () {
    return 'Display prefix'
  }

  static get name () {
    return 'prefix'
  }

  static get params () {
    return ['global']
  }

  static get usage () {
    return ['[-g]']
  }

  exec (args, cb) {
    this.prefix(args).then(() => cb()).catch(cb)
  }

  async prefix (args) {
    return this.npm.output(this.npm.prefix)
  }
}
module.exports = Prefix
