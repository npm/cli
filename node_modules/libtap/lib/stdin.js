'use strict'
const ownOr = require('own-or')
const Base = require('./base.js')

class Stdin extends Base {
  constructor (options) {
    options = options || {}
    options.name = ownOr(options, 'name', '/dev/stdin')
    super(options)

    // This has to be here for node 0.10's wonky streams
    this.stream = ownOr(options, 'tapStream', process.stdin)
    this.stream.pause()
  }

  main (cb) {
    this.stream.on('error', er => {
      er.tapCaught = 'stdinError'
      this.threw(er)
    })
    this.setTimeout(this.options.timeout)
    this.stream.pipe(this.parser)
    if (this.parent)
      this.parent.emit('stdin', this)
    this.stream.resume()
    this.once('end', cb)
  }

  threw (er, extra, proxy) {
    extra = super.threw(er, extra, proxy)
    this.options = extra
    this.parser.abort(er.message, extra)
    this.parser.end()
  }
}

module.exports = Stdin
