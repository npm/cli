'use strict'

const dns = require('dns')

const normalizeOptions = (_options) => {
  const options = { ..._options }

  if (typeof options.keepAlive === 'undefined') {
    options.keepAlive = true
  }

  if (!options.timeouts) {
    options.timeouts = {}
  }

  if (options.timeout) {
    options.timeouts.idle = options.timeout
    delete options.timeout
  }

  options.family = !isNaN(+options.family) ? +options.family : 0
  options.dns = {
    ttl: 5 * 60 * 1000,
    lookup: dns.lookup,
    ...options.dns,
  }

  return options
}

module.exports = {
  normalizeOptions,
}
