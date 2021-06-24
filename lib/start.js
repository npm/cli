const LifecycleCmd = require('./utils/lifecycle-cmd.js')

// This ends up calling run-script(['start', ...args])
class Start extends LifecycleCmd {
  static get description () {
    return 'Start a package'
  }

  static get name () {
    return 'start'
  }

  static get params () {
    return [
      'ignore-scripts',
      'script-shell',
    ]
  }
}
module.exports = Start
