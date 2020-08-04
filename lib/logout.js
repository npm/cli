const eu = encodeURIComponent
const getAuth = require('npm-registry-fetch/auth.js')
const log = require('npmlog')
const npm = require('./npm.js')
const npmFetch = require('npm-registry-fetch')
const usageUtil = require('./utils/usage.js')

const usage = usageUtil('logout', 'npm logout [--registry=<url>] [--scope=<@scope>]')
const completion = require('./utils/completion/none.js')

const cmd = (args, cb) => logout(args).then(() => cb()).catch(cb)

const logout = async args => {
  const reg = npmFetch.pickRegistry('foo', npm.flatOptions)
  const auth = getAuth(reg, npm.flatOptions)
  if (auth.token) {
    log.verbose('logout', `clearing token for ${reg}`)
    await npmFetch(`/-/user/token/${eu(auth.token)}`, {
      ...npm.flatOptions,
      method: 'DELETE',
      ignoreBody: true
    })
  } else if (auth.username || auth.password) {
    log.verbose('logout', `clearing user credentials for ${reg}`)
  } else {
    throw Object.assign(new Error(`not logged in to ${reg}, so can't log out!`), {
      code: 'ENEEDAUTH'
    })
  }

  const scope = npm.config.get('scope')
  if (scope) {
    npm.config.del(`${scope}:registry`)
  }
  npm.config.clearCredentialsByURI(reg)
  // make npm.config.save() return a promise
  await new Promise((res, rej) => {
    npm.config.save('user', er => er ? rej(er) : res())
  })
}

module.exports = Object.assign(cmd, { completion, usage })
