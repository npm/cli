'use strict'

// XXX: To date, npm Enterprise Legacy is the only system that ever
// implemented support for this type of login.  A better way to do
// SSO is to use the WebLogin type of login supported by the npm-login
// module.  This more forward-looking login style is, ironically,
// supported by the '--auth-type=legacy' type of login.
// When and if npm Enterprise Legacy is no longer supported by the npm
// CLI, we can remove this, and fold the lib/auth/legacy.js back into
// lib/adduser.js

const log = require('npmlog')
const npm = require('../npm.js')
const npmFetch = require('npm-registry-fetch')
const output = require('../utils/output.js')
const { promisify } = require('util')
const openUrl = promisify(require('../utils/open-url.js'))
const otplease = require('../utils/otplease.js')
const profile = require('npm-profile')

module.exports.login = function login (creds, registry, scope, cb) {
  log.warn('deprecated', 'SSO --auth-type is deprecated')
  const opts = { ...npm.flatOptions, creds, registry, scope }
  const ssoType = opts.ssoType
  if (!ssoType) { return cb(new Error('Missing option: sso-type')) }

  // We're reusing the legacy login endpoint, so we need some dummy
  // stuff here to pass validation. They're never used.
  const auth = {
    username: 'npm_' + ssoType + '_auth_dummy_user',
    password: 'placeholder',
    email: 'support@npmjs.com',
    authType: ssoType
  }

  otplease(opts,
    opts => profile.loginCouch(auth.username, auth.password, opts)
  ).then(({ token, sso }) => {
    if (!token) { throw new Error('no SSO token returned') }
    if (!sso) { throw new Error('no SSO URL returned by services') }
    return openUrl(sso, 'to complete your login please visit').then(() => {
      return pollForSession(registry, token, opts)
    }).then(username => {
      log.info('adduser', 'Authorized user %s', username)
      var scopeMessage = scope ? ' to scope ' + scope : ''
      output('Logged in as %s%s on %s.', username, scopeMessage, registry)
      return { token }
    })
  }).then(res => cb(null, res), cb)
}

function pollForSession (registry, token, opts) {
  log.info('adduser', 'Polling for validated SSO session')
  return npmFetch.json(
    '/-/whoami', { ...opts, registry, forceAuth: { token } }
  ).then(
    ({ username }) => username,
    err => {
      if (err.code === 'E401') {
        return sleep(opts.ssoPollFrequency).then(() => {
          return pollForSession(registry, token, opts)
        })
      } else {
        throw err
      }
    }
  )
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
