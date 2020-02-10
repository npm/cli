'use strict'

const BB = require('bluebird')

const pacote = require('pacote')
// const npmlog = require('npmlog')

module.exports = (args, cb) => {
  const parsed = typeof args === 'string' ? JSON.parse(args) : args
  const spec = parsed[0]
  const extractTo = parsed[1]
  const opts = parsed[2]
  // if (!opts.log) {
  //   opts.log = npmlog
  // }
  // opts.log.level = opts.loglevel || opts.log.level
  // NOTE: this might be naive; we might need to check if `toJSON` exists
  const plain = opts.toJSON()
  BB.resolve(pacote.extract(spec, extractTo, plain)).nodeify(cb)
}
