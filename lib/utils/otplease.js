async function otplease (npm, opts, fn) {
  try {
    return await fn(opts)
  } catch (err) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw err
    }

    const isBackwardsCompatibleOTP = err.code === 'E401' && /one-time pass/.test(err.body)
    const isClassicOTP = err.code === 'EOTP'
    const isWebOTP = err.code === 'EOTP' && err.body?.authUrl && err.body?.doneUrl

    if (isWebOTP) {
      const webAuth = require('./web-auth')
      const openUrlPrompt = require('./open-url-prompt')

      const openerPromise = (url, emitter) =>
        openUrlPrompt(
          npm,
          url,
          'Authenticate your account at',
          'Press ENTER to open in the browser...',
          emitter
        )
      const otp = await webAuth(openerPromise, err.body.authUrl, err.body.doneUrl, opts)
      return await fn({ ...opts, otp })
    }

    if (isClassicOTP || isBackwardsCompatibleOTP) {
      const readUserInfo = require('./read-user-info.js')
      const otp = await readUserInfo.otp('This operation requires a one-time password.\nEnter OTP:')
      return await fn({ ...opts, otp })
    }

    throw err
  }
}

module.exports = otplease
