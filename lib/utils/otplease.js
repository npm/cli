async function otplease (opts, fn) {
  try {
    return await fn(opts)
  } catch (err) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw err
    }

    const isBackwardsCompatibleOTP = err.code === 'E401' && /one-time pass/.test(err.body)
    const isClassicOTP = err.code === 'EOTP'

    if (isClassicOTP || isBackwardsCompatibleOTP) {
      const readUserInfo = require('./read-user-info.js')
      const otp = await readUserInfo.otp('This operation requires a one-time password.\nEnter OTP:')
      return await fn({ ...opts, otp })
    }

    throw err
  }
}

module.exports = otplease
