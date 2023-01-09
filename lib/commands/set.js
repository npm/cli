const ConfigCommand = require('./config')

class Set extends ConfigCommand {
  static description = 'Set a value in the npm configuration'
  static name = 'set'
  static usage = ['<key>=<value> [<key>=<value> ...] (See `npm config`)']

  async exec (args) {
    if (!args.length) {
      throw this.usageError()
    }
    return this.npm.exec('config', ['set'].concat(args))
  }
}

module.exports = Set
