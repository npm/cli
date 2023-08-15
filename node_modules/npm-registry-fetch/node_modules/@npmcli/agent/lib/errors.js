'use strict'

class InvalidProxyProtocolError extends Error {
  constructor (url) {
    super(`Invalid protocol \`${url.protocol}\` connecting to proxy \`${url.host}\``)
    this.code = 'EINVALIDPROXY'
    this.proxy = url
  }
}

class InvalidProxyResponseError extends Error {
  constructor (url, status) {
    super(`Invalid status code \`${status}\` connecting to proxy \`${url.host}\``)
    this.code = 'EINVALIDRESPONSE'
    this.proxy = url
    this.status = status
  }
}

class ConnectionTimeoutError extends Error {
  constructor (host) {
    super(`Timeout connecting to host \`${host}\``)
    this.code = 'ECONNECTIONTIMEOUT'
    this.host = host
  }
}

class IdleTimeoutError extends Error {
  constructor (host) {
    super(`Idle timeout reached for host \`${host}\``)
    this.code = 'EIDLETIMEOUT'
    this.host = host
  }
}

class ResponseTimeoutError extends Error {
  constructor (proxy, request) {
    let msg = 'Response timeout '
    if (proxy.url) {
      msg += `from proxy \`${proxy.url.host}\` `
    }
    msg += `connecting to host \`${request.host}\``
    super(msg)
    this.code = 'ERESPONSETIMEOUT'
    this.proxy = proxy.url
    this.request = request
  }
}

class TransferTimeoutError extends Error {
  constructor (proxy, request) {
    let msg = 'Transfer timeout '
    if (proxy.url) {
      msg += `from proxy \`${proxy.url.host}\` `
    }
    msg += `for \`${request.host}\``
    super(msg)
    this.code = 'ETRANSFERTIMEOUT'
    this.proxy = proxy.url
    this.request = request
  }
}

module.exports = {
  InvalidProxyProtocolError,
  InvalidProxyResponseError,
  ConnectionTimeoutError,
  IdleTimeoutError,
  ResponseTimeoutError,
  TransferTimeoutError,
}
