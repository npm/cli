const LifecycleCmd = require('./utils/lifecycle-cmd.js')

// This ends up calling run-script(['restart', ...args])
class Restart extends LifecycleCmd {
  static get description () {
    return 'Restart a package'
  }

  static get name () {
    return 'restart'
  }

  static get params () {
    return [
      'ignore-scripts',
      'script-shell',
    ]
  }
}
module.exports = Restart
