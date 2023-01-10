const ConfigCommand = require('./config')

class Get extends ConfigCommand {
  static description = 'Get a value from the npm configuration'
  static name = 'get'
  static usage = ['[<key> ...] (See `npm config`)']

  async exec (args) {
    return this.npm.exec('config', ['get'].concat(args))
  }
}

module.exports = Get
