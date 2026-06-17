'use strict'

// nock (v14+, built on @mswjs/interceptors) can only intercept requests made
// through the default global agent, not the custom agents @npmcli/agent
// returns. This preload (loaded via tap's node-arg --require, before any test
// code) hooks the module loader so that every copy of @npmcli/agent has its
// getAgent forced to return false as it is required. Routing requests through
// the default agent lets nock intercept them. There can be multiple nested
// copies of @npmcli/agent in the tree (e.g. under sigstore), so patching at
// load time covers them all regardless of nesting.
//
// When a proxy is configured the real implementation is used so that proxy
// validation (e.g. rejecting unsupported protocols) still happens.
const Module = require('node:module')

const originalLoad = Module._load
Module._load = function (request, ...args) {
  const loaded = originalLoad.call(this, request, ...args)
  if (request === '@npmcli/agent' && loaded && typeof loaded.getAgent === 'function') {
    const realGetAgent = loaded.getAgent
    loaded.getAgent = (url, options) => {
      if (options.proxy) {
        return realGetAgent(url, options)
      }
      return false
    }
  }
  return loaded
}
