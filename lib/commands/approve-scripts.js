const AllowScriptsCmd = require('../utils/allow-scripts-cmd.js')

class ApproveScripts extends AllowScriptsCmd {
  static description = 'Approve install scripts for specific dependencies'
  static name = 'approve-scripts'
  static usage = ['<pkg> [<pkg> ...]', '--all', '--pending']

  get verb () {
    return 'approve'
  }
}

module.exports = ApproveScripts
