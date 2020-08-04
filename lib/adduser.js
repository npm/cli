const log = require('npmlog')
const npm = require('./npm.js')
const usageUtil = require('./utils/usage.js')

const usage = usageUtil(
  'adduser',
  'npm adduser [--registry=url] [--scope=@orgname] [--always-auth]'
)

const completion = require('./utils/completion/none.js')

const cmd = (args, cb) => adduser(args).then(() => cb()).catch(cb)

const getRegistry = opts => {
  const { scope, registry } = opts
  if (scope) {
    const scopedRegistry = npm.config.get(`${scope}:registry`)
    const cliRegistry = npm.config.get('registry', 'cli')
    if (scopedRegistry && !cliRegistry) {
      return scopedRegistry
    }
  }
  return registry
}

const getAuthType = ({ authType }) => {
  try {
    return require('./auth/' + authType)
  } catch (e) {
    throw new Error('no such auth module')
  }
}

const adduser = async args => {
  const registry = getRegistry(npm.flatOptions)
  const { scope } = npm.flatOptions
  const creds = npm.config.getCredentialsByURI(registry)

  log.disableProgress()

  const auth = getAuthType(npm.flatOptions)

  // XXX make auth.login() promise-returning so we don't have to wrap here
  await new Promise((res, rej) => {
    auth.login(creds, registry, scope, function (er, newCreds) {
      if (er) {
        return rej(er)
      }

      npm.config.del('_token', 'user') // prevent legacy pollution
      if (scope) {
        npm.config.set(scope + ':registry', registry, 'user')
      }
      npm.config.setCredentialsByURI(registry, newCreds)
      npm.config.save('user', er => er ? rej(er) : res())
    })
  })
}

module.exports = Object.assign(cmd, { completion, usage })
