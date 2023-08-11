'use strict'

const { normalizeOptions } = require('./util.js')
const HttpAgent = require('./http.js')
const HttpsAgent = require('./https.js')

const AgentCache = new Map()

const proxyEnv = {}
for (const [key, value] of Object.entries(process.env)) {
  const lowerKey = key.toLowerCase()
  if (['https_proxy', 'http_proxy', 'proxy', 'no_proxy'].includes(lowerKey)) {
    proxyEnv[lowerKey] = value
  }
}

const getAgent = (url, options) => {
  url = new URL(url)
  options = normalizeOptions(options)

  // false has meaning so this can't be a simple truthiness check
  if (options.agent != null) {
    return options.agent
  }

  const isHttps = url.protocol === 'https:'

  let proxy = options.proxy
  if (!proxy) {
    proxy = isHttps
      ? proxyEnv.https_proxy
      : (proxyEnv.https_proxy || proxyEnv.http_proxy || proxyEnv.proxy)
  }

  if (proxy) {
    proxy = new URL(proxy)
    let noProxy = options.noProxy || proxyEnv.no_proxy
    if (typeof noProxy === 'string') {
      noProxy = noProxy.split(',').map((p) => p.trim())
    }

    if (noProxy) {
      const hostSegments = url.hostname.split('.').reverse()
      const matches = noProxy.some((no) => {
        const noSegments = no.split('.').filter(Boolean).reverse()
        if (!noSegments.length) {
          return false
        }

        for (let i = 0; i < noSegments.length; ++i) {
          if (hostSegments[i] !== noSegments[i]) {
            return false
          }
        }

        return true
      })

      if (matches) {
        proxy = ''
      }
    }
  }

  const timeouts = [
    options.timeouts.connection || 0,
    options.timeouts.idle || 0,
    options.timeouts.response || 0,
    options.timeouts.transfer || 0,
  ].join('.')

  const maxSockets = options.maxSockets || 15

  let proxyDescriptor = 'proxy:'
  if (!proxy) {
    proxyDescriptor += 'null'
  } else {
    proxyDescriptor += `${proxy.protocol}//`
    let auth = ''

    if (proxy.username) {
      auth += proxy.username
    }

    if (proxy.password) {
      auth += `:${proxy.password}`
    }

    if (auth) {
      proxyDescriptor += `${auth}@`
    }

    proxyDescriptor += proxy.host
  }

  const key = [
    `https:${isHttps}`,
    proxyDescriptor,
    `local-address:${options.localAddress || 'null'}`,
    `strict-ssl:${isHttps ? options.rejectUnauthorized : 'false'}`,
    `ca:${isHttps && options.ca || 'null'}`,
    `cert:${isHttps && options.cert || 'null'}`,
    `key:${isHttps && options.key || 'null'}`,
    `timeouts:${timeouts}`,
    `maxSockets:${maxSockets}`,
  ].join(':')

  if (AgentCache.has(key)) {
    return AgentCache.get(key)
  }

  const agentOptions = {
    ca: options.ca,
    cert: options.cert,
    key: options.key,
    rejectUnauthorized: options.rejectUnauthorized,
    maxSockets,
    timeouts: options.timeouts,
    localAddress: options.localAddress,
    proxy,
  }

  const agent = isHttps
    ? new HttpsAgent(agentOptions)
    : new HttpAgent(agentOptions)

  AgentCache.set(key, agent)
  return agent
}

module.exports = {
  getAgent,
  HttpAgent,
  HttpsAgent,
}
