'use strict'

const http = require('http')
const https = require('https')
const net = require('net')
const tls = require('tls')

const {
  ConnectionTimeoutError,
  IdleTimeoutError,
  InvalidProxyResponseError,
  ResponseTimeoutError,
  TransferTimeoutError,
} = require('../errors.js')

// this proxy class uses the http CONNECT method
class HttpProxy {
  constructor ({ agent, lookup, url, secure }) {
    this.agent = agent
    this.lookup = lookup
    this.url = url
    this.secure = secure
  }

  createConnection (options, callback) {
    const requestOptions = {
      // pass createConnection so this request doesn't go through an agent
      createConnection: (opts, cb) => {
        // delete the path first, otherwise (net|tls).connect will try to open a unix socket
        delete opts.path
        // we also delete the timeout since we control it ourselves
        delete opts.timeout
        opts.family = this.agent.options.family
        opts.lookup = this.lookup

        if (this.url.protocol === 'https:') {
          return tls.connect(opts, cb)
        }

        return net.connect(opts, cb)
      },
      method: 'CONNECT',
      host: this.url.hostname,
      port: this.url.port,
      servername: this.url.hostname,
      path: `${options.host}:${options.port}`,
      setHost: false,
      timeout: options.timeout,
      headers: {
        connection: this.agent.keepAlive ? 'keep-alive' : 'close',
        host: `${options.host}:${options.port}`,
      },
      rejectUnauthorized: options.rejectUnauthorized,
    }

    if (this.url.username || this.url.password) {
      const username = decodeURIComponent(this.url.username)
      const password = decodeURIComponent(this.url.password)
      requestOptions.headers['proxy-authentication'] =
        Buffer.from(`${username}:${password}`).toString('base64')
    }

    let connectionTimeout

    const onConnect = (res, socket) => {
      clearTimeout(connectionTimeout)
      req.removeListener('error', onError)

      if (res.statusCode !== 200) {
        return callback(new InvalidProxyResponseError(this.url, res.statusCode))
      }

      if (this.secure) {
        socket = tls.connect({ ...options, socket })
      }

      socket.setKeepAlive(this.agent.keepAlive, this.agent.keepAliveMsecs)
      socket.setNoDelay(this.agent.keepAlive)

      if (options.timeouts.idle) {
        socket.setTimeout(options.timeouts.idle)
        socket.once('timeout', () => {
          socket.destroy(new IdleTimeoutError(this.url.host))
        })
      }

      return callback(null, socket)
    }

    const onError = (err) => {
      req.removeListener('connect', onConnect)
      return callback(err)
    }

    const req = this.secure
      ? https.request(requestOptions)
      : http.request(requestOptions)

    req.once('connect', onConnect)
    req.once('error', onError)
    req.end()

    if (options.timeouts.connection) {
      connectionTimeout = setTimeout(() => {
        return callback(new ConnectionTimeoutError(this.url.host))
      }, options.timeouts.connection)
    }
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

module.exports = HttpProxy
