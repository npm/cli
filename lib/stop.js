const LifecycleCmd = require('./utils/lifecycle-cmd.js')

// This ends up calling run-script(['stop', ...args])
class Stop extends LifecycleCmd {
  static get description () {
    return 'Stop a package'
  }

  static get name () {
    return 'stop'
  }

  static get params () {
    return [
      'ignore-scripts',
      'script-shell',
    ]
  }
}
module.exports = Stop
