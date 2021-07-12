const Star = require('./star.js')

class Unstar extends Star {
  static get description () {
    return 'Remove an item from your favorite packages'
  }

  static get name () {
    return 'unstar'
  }

  static get params () {
    return [
      'registry',
      'unicode',
      'otp',
    ]
  }

  exec (args, cb) {
    this.npm.config.set('star.unstar', true)
    super.exec(args, cb)
  }
}
module.exports = Unstar
