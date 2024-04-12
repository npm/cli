const { output } = require('proc-log')
const BaseCommand = require('../base-command.js')

class Prefix extends BaseCommand {
  static description = 'Display prefix'
  static name = 'prefix'
  static params = ['global']
  static usage = ['[-g]']

  async exec (args) {
    return output.standard(this.npm.prefix)
  }
}
module.exports = Prefix
