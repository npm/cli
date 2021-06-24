const BaseCommand = require('./base-command.js')

class Set extends BaseCommand {
  static get description () {
    return 'Set a value in the npm configuration'
  }

  static get name () {
    return 'set'
  }

  static get usage () {
    return ['<key>=<value> [<key>=<value> ...] (See `npm config`)']
  }

  async completion (opts) {
    return this.npm.commands.config.completion(opts)
  }

  exec (args, cb) {
    if (!args.length)
      return cb(this.usage)
    this.npm.commands.config(['set'].concat(args), cb)
  }
}
module.exports = Set
