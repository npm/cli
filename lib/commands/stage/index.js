const BaseCommand = require('../../base-cmd.js')

class Stage extends BaseCommand {
  static description = 'Stage packages for publishing, deferring proof-of-presence (2FA) to a later point in time'
  static name = 'stage'

  static subcommands = {
    publish: require('./publish.js'),
    list: require('./list.js'),
    view: require('./view.js'),
    approve: require('./approve.js'),
    reject: require('./reject.js'),
    download: require('./download.js'),
  }
}

module.exports = Stage
