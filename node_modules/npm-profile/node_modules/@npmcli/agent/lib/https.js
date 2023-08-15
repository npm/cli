'use strict'

const https = require('https')

const { getLookup } = require('./dns.js')
const { normalizeOptions } = require('./util.js')
const createProxy = require('./proxy/index.js')

class HttpsAgent extends https.Agent {
  constructor (_options) {
    const options = normalizeOptions(_options)
    super(options)
    this.proxy = createProxy({
      agent: this,
      lookup: getLookup(options.dns),
      proxy: options.proxy,
      secure: true,
    })
  }

  createConnection (_options, callback) {
    const options = normalizeOptions(_options)
    return this.proxy.createConnection(options, callback)
  }

  addRequest (request, _options) {
    const options = normalizeOptions(_options)
    super.addRequest(request, options)
    return this.proxy.addRequest(request, options)
  }
}

module.exports = HttpsAgent
