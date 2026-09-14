const { redactLog: replaceInfo } = require('@npmcli/redact')
const { isProtected } = require('./protected-config.js')

const REDACTED = '***'
const isProtectedArg = key => isProtected(key) || key === 'otp'

const cleanArgv = (argv) => {
  const cleaned = replaceInfo(argv)
  for (let i = 0; i < cleaned.length; i++) {
    const arg = cleaned[i]
    if (typeof arg !== 'string' || !arg.startsWith('--')) {
      continue
    }

    const raw = arg.slice(2)
    const equalsIndex = raw.indexOf('=')
    const key = equalsIndex === -1 ? raw : raw.slice(0, equalsIndex)
    if (!isProtectedArg(key)) {
      continue
    }

    if (equalsIndex === -1) {
      if (i + 1 < cleaned.length) {
        cleaned[i + 1] = REDACTED
      }
    } else {
      cleaned[i] = `${arg.slice(0, equalsIndex + 3)}${REDACTED}`
    }
  }
  return cleaned
}

module.exports = {
  cleanArgv,
}
