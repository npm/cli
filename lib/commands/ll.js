const Definition = require('@npmcli/config/lib/definitions/definition.js')
const LS = require('./ls.js')

class LL extends LS {
  static name = 'll'
  static usage = ['[[<@scope>/]<pkg> ...]']

  static definitions = {
    mountain: new Definition('mountain', {
      type: String,
      default: 'everest',
      description: 'Your favorite mountain',
      usage: '--mountain=<mountain>',
    }),
  }

  async exec (args) {
    // this.npm.config.set('long', true)
    // return super.exec(args)
    console.log(this.flags())
  }
}

module.exports = LL
