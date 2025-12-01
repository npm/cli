const nopt = require('nopt')
const ms = require('ms')

const { validate: validateUmask } = require('./umask.js')

class Umask {}
class Semver {}
class RelativeDate {}
const semverValid = require('semver/functions/valid')
const validateSemver = (data, k, val) => {
  const valid = semverValid(val)
  if (!valid) {
    return false
  }
  data[k] = valid
}

const noptValidatePath = nopt.typeDefs.path.validate
const validatePath = (data, k, val) => {
  if (typeof val !== 'string') {
    return false
  }
  return noptValidatePath(data, k, val)
}

const validateRelativeDate = (data, k, val) => {
  const valid = ms(val)
  if (valid === undefined) {
    return false
  }
  data[k] = new Date(Date.now() - valid)
}

// add descriptions so we can validate more usefully
module.exports = {
  ...nopt.typeDefs,
  semver: {
    type: Semver,
    validate: validateSemver,
    description: 'full valid SemVer string',
  },
  Umask: {
    type: Umask,
    validate: validateUmask,
    description: 'octal number in range 0o000..0o777 (0..511)',
  },
  relativeDate: {
    type: RelativeDate,
    validate: validateRelativeDate,
    description: 'valid relative date string e.g. "24h", "7d"',
  },
  url: {
    ...nopt.typeDefs.url,
    description: 'full url with "http://"',
  },
  path: {
    ...nopt.typeDefs.path,
    validate: validatePath,
    description: 'valid filesystem path',
  },
  Number: {
    ...nopt.typeDefs.Number,
    description: 'numeric value',
  },
  Boolean: {
    ...nopt.typeDefs.Boolean,
    description: 'boolean value (true or false)',
  },
  Date: {
    ...nopt.typeDefs.Date,
    description: 'valid Date string',
  },
}

// TODO: make nopt less of a global beast so this kludge isn't necessary
nopt.typeDefs = module.exports
