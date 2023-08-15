'use strict'

const net = require('net')
const tls = require('tls')

const {
  ConnectionTimeoutError,
  IdleTimeoutError,
  ResponseTimeoutError,
  TransferTimeoutError,
} = require('../errors.js')

class NullProxy {
  constructor ({ agent, lookup, secure }) {
    this.agent = agent
    this.lookup = lookup
    this.secure = secure
  }

  createConnection (options, callback) {
    const socket = this.secure
      ? tls.connect({ ...options, family: this.agent.options.family, lookup: this.lookup })
      : net.connect({ ...options, family: this.agent.options.family, lookup: this.lookup })

    socket.setKeepAlive(this.agent.keepAlive, this.agent.keepAliveMsecs)
    socket.setNoDelay(this.agent.keepAlive)

    let connectionTimeout

    if (options.timeouts.connection) {
      connectionTimeout = setTimeout(() => {
        callback(new ConnectionTimeoutError(options.host))
      }, options.timeouts.connection)
    }

    if (options.timeouts.idle) {
      socket.setTimeout(options.timeouts.idle)
      socket.once('timeout', () => {
        socket.destroy(new IdleTimeoutError(options.host))
      })
    }

    const onConnect = () => {
      clearTimeout(connectionTimeout)
      socket.removeListener('error', onError)
      callback(null, socket)
    }

    const onError = (err) => {
      socket.removeListener('connect', onConnect)
      callback(err)
    }

    socket.once('error', onError)
    socket.once(this.secure ? 'secureConnect' : 'connect', onConnect)
  }

  addRequest (request, options) {
    if (this.agent.options.timeouts.response) {
      let responseTimeout

      const onFinish = () => {
        responseTimeout = setTimeout(() => {
          request.destroy(new ResponseTimeoutError(this, request))
        }, this.agent.options.timeouts.response)
      }

      const onResponse = () => {
        clearTimeout(responseTimeout)
      }

      request.once('finish', onFinish)
      request.once('response', onResponse)
    }

    if (this.agent.options.timeouts.transfer) {
      let transferTimeout

      const onResponse = (res) => {
        transferTimeout = setTimeout(() => {
          // swallow the error event on the request, this allows the one on the response
          // to make it to the end user
          request.once('error', () => {})
          res.destroy(new TransferTimeoutError(this, request))
        }, this.agent.options.timeouts.transfer)

        res.once('close', () => {
          clearTimeout(transferTimeout)
        })
      }

      request.once('response', onResponse)
    }
  }
}

module.exports = NullProxy
