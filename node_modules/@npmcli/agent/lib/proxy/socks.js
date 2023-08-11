'use strict'

const { SocksClient } = require('socks')
const tls = require('tls')

const {
  ConnectionTimeoutError,
  IdleTimeoutError,
  InvalidProxyProtocolError,
  ResponseTimeoutError,
  TransferTimeoutError,
} = require('../errors.js')

class SocksProxy {
  constructor ({ agent, lookup, secure, url }) {
    this.agent = agent
    this.lookup = lookup
    this.secure = secure
    this.url = url
    if (!this.url.port) {
      this.url.port = 1080
    }

    if (this.url.protocol === 'socks4:') {
      this.shouldLookup = true
      this.type = 4
    } else if (this.url.protocol === 'socks4a:') {
      this.shouldLookup = false
      this.type = 4
    } else if (this.url.protocol === 'socks5:') {
      this.shouldLookup = true
      this.type = 5
    } else if (this.url.protocol === 'socks5h:' || this.url.protocol === 'socks:') {
      this.shouldLookup = false
      this.type = 5
    } else {
      throw new InvalidProxyProtocolError(this.url)
    }
  }

  createConnection (options, callback) {
    const socksOptions = {
      proxy: {
        host: this.url.hostname,
        port: parseInt(this.url.port, 10),
        type: this.type,
        userId: this.url.username,
        password: this.url.password,
      },
      destination: {
        host: options.host,
        port: parseInt(options.port, 10),
      },
      command: 'connect',
      socket_options: {
        family: this.agent.options.family,
        lookup: this.lookup,
      },
    }

    const connect = () => {
      let connectionTimeout
      const socksClient = new SocksClient(socksOptions)

      const onError = (err) => {
        socksClient.removeListener('established', onEstablished)
        return callback(err)
      }

      const onEstablished = (connection) => {
        clearTimeout(connectionTimeout)
        socksClient.removeListener('error', onError)

        if (this.secure) {
          connection.socket = tls.connect({ ...options, socket: connection.socket })
        }

        connection.socket.setKeepAlive(this.agent.keepAlive, this.agent.keepAliveMsecs)
        connection.socket.setNoDelay(this.agent.keepAlive)

        if (options.timeouts.idle) {
          connection.socket.setTimeout(options.timeouts.idle)
          connection.socket.once('timeout', () => {
            connection.socket.destroy(new IdleTimeoutError(this.url.host))
          })
        }

        return callback(null, connection.socket)
      }

      socksClient.once('error', onError)
      socksClient.once('established', onEstablished)

      if (options.timeouts.connection) {
        connectionTimeout = setTimeout(() => {
          return callback(new ConnectionTimeoutError(this.url.host))
        }, options.timeouts.connection)
      }

      socksClient.connect()
    }

    if (!this.shouldLookup) {
      return connect()
    }

    this.lookup(options.host, (err, result) => {
      if (err) {
        return callback(err)
      }

      socksOptions.destination.host = result
      connect()
    })
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

module.exports = SocksProxy
