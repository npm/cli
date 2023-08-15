'use strict'

const http = require('http')

const { getLookup } = require('./dns.js')
const { normalizeOptions } = require('./util.js')
const createProxy = require('./proxy/index.js')

class HttpAgent extends http.Agent {
  constructor (_options = {}) {
    const options = normalizeOptions(_options)
    super(options)
    this.proxy = createProxy({
      agent: this,
      lookup: getLookup(options.dns),
      proxy: options.proxy,
      secure: false,
    })
  }

  createConnection (_options, callback) {
    const options = normalizeOptions(_options)
    return this.proxy.createConnection(options, callback)
  }

  addRequest (request, _options) {
    const options = normalizeOptions(_options)
    super.addRequest(request, _options)
    return this.proxy.addRequest(request, options)
  }
}

module.exports = HttpAgent
