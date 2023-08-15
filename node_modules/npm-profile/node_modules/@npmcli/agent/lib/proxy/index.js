'use strict'

const { InvalidProxyProtocolError } = require('../errors.js')
const HttpProxy = require('./http.js')
const NullProxy = require('./null.js')
const SocksProxy = require('./socks.js')

const createProxy = ({ agent, lookup, proxy, secure }) => {
  if (!proxy) {
    return new NullProxy({ agent, lookup, secure })
  }

  const parsed = new URL(proxy)
  if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
    return new HttpProxy({ agent, lookup, url: parsed, secure })
  }

  if (parsed.protocol.startsWith('socks')) {
    return new SocksProxy({ agent, lookup, url: parsed, secure })
  }

  throw new InvalidProxyProtocolError(parsed)
}

module.exports = createProxy
