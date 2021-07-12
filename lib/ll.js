const LS = require('./ls.js')

class LL extends LS {
  static get name () {
    return 'll'
  }

  static get usage () {
    return ['[[<@scope>/]<pkg> ...]']
  }

  exec (args, cb) {
    this.npm.config.set('long', true)
    super.exec(args, cb)
  }
}

module.exports = LL
