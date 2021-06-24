const BaseCommand = require('./base-command.js')

class Get extends BaseCommand {
  static get description () {
    return 'Get a value from the npm configuration'
  }

  static get name () {
    return 'get'
  }

  static get usage () {
    return ['[<key> ...] (See `npm config`)']
  }

  async completion (opts) {
    return this.npm.commands.config.completion(opts)
  }

  exec (args, cb) {
    this.npm.commands.config(['get'].concat(args), cb)
  }
}
module.exports = Get
