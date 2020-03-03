'use strict'

const eu = encodeURIComponent
const getAuth = require('npm-registry-fetch/auth.js')
const log = require('npmlog')
const npm = require('./npm.js')
const npmFetch = require('npm-registry-fetch')

logout.usage = 'npm logout [--registry=<url>] [--scope=<@scope>]'

function afterLogout (normalized) {
  var scope = npm.config.get('scope')

  if (scope) npm.config.del(scope + ':registry')

  npm.config.clearCredentialsByURI(normalized)
  return new Promise((resolve, reject) => {
    npm.config.save('user', er => er ? reject(er) : resolve())
  })
}

module.exports = logout
function logout (args, cb) {
  const opts = npm.flatOptions
  Promise.resolve().then(() => {
    const reg = npmFetch.pickRegistry('foo', opts)
    const auth = getAuth(reg, opts)
    if (auth.token) {
      log.verbose('logout', 'clearing session token for', reg)
      return npmFetch(`/-/user/token/${eu(auth.token)}`, {
        ...opts,
        method: 'DELETE',
        ignoreBody: true
      }).then(() => afterLogout(reg))
    } else if (auth.username || auth.password) {
      log.verbose('logout', 'clearing user credentials for', reg)
      return afterLogout(reg)
    } else {
      throw new Error(
        'Not logged in to', reg + ',', "so can't log out."
      )
    }
  }).then(() => cb(), cb)
}
