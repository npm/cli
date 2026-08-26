const { webAuthOpener, loginWeb, loginCouch } = require('npm-profile')
const { log } = require('proc-log')
const { createOpener } = require('../utils/open-url.js')
const read = require('../utils/read-user-info.js')

const otplease = async (npm, opts, fn) => {
  try {
    return await fn(opts)
  } catch (err) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw err
    }

    // web otp
    if (err.code === 'EOTP' && err.body?.authUrl && err.body?.doneUrl) {
      const { token: otp } = await webAuthOpener(
        createOpener(npm, 'Authenticate your account at'),
        err.body.authUrl,
        err.body.doneUrl,
        opts
      )
      return await fn({ ...opts, otp })
    }

    // classic otp
    if (err.code === 'EOTP' || (err.code === 'E401' && /one-time pass/.test(err.body))) {
      const otp = await read.otp('This operation requires a one-time password.\nEnter OTP:')
      return await fn({ ...opts, otp })
    }

    throw err
  }
}

// `read` only settles its returned promise on `line`, `error`, or `SIGINT` — when
// stdin hits EOF without ever producing a line (an empty/redirected file, a pipe
// that closes without writing, or Ctrl-D on a real TTY), readline emits `close`
// with no handler for it, and the promise never settles (npm/cli#9860). Race the
// prompt against stdin's own `end` event so that case rejects with a clear error
// instead of hanging forever, while leaving every other case — a real TTY session,
// or genuine piped/redirected credentials that actually produce a line before EOF —
// unaffected, since `prompt` then wins the race and this listener is a no-op.
const readOrErrorOnStdinEnd = (prompt) => new Promise((resolve, reject) => {
  const cleanup = () => process.stdin.removeListener('end', onStdinEnd)
  const onStdinEnd = () => {
    cleanup()
    reject(Object.assign(new Error(
      'npm login requires an interactive terminal, or credentials piped to stdin, to authenticate.'
    ), { code: 'ENOTTYAUTH' }))
  }
  process.stdin.once('end', onStdinEnd)
  prompt
    .then((value) => {
      cleanup()
      return resolve(value)
    })
    .catch((err) => {
      cleanup()
      reject(err)
    })
})

const login = async (npm, { creds, ...opts }) => {
  const authType = npm.config.get('auth-type')
  let res
  if (authType === 'web') {
    try {
      res = await loginWeb(createOpener(npm, 'Login at'), opts)
    } catch (err) {
      if (err.code === 'ENYI') {
        log.verbose('web login not supported, trying couch')
      } else {
        throw err
      }
    }
  }

  // auth type !== web or ENYI error w/ web login
  if (!res) {
    const username = await readOrErrorOnStdinEnd(read.username('Username:', creds.username))
    const password = await readOrErrorOnStdinEnd(read.password('Password:', creds.password))
    res = await otplease(npm, opts, (reqOpts) => loginCouch(username, password, reqOpts))
  }

  // We don't know the username if it was a web login, all we can reliably log is scope and registry
  const message = `Logged in${opts.scope ? ` to scope ${opts.scope}` : ''} on ${opts.registry}.`

  log.info('login', message)

  return {
    message,
    newCreds: { token: res.token },
  }
}

module.exports = {
  login,
  otplease,
}
