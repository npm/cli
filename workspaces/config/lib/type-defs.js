const nopt = require('nopt').lib
const semver = require('semver')
const { resolve } = require('path')
const { networkInterfaces } = require('os')

const validateUmask = (data, k, val) => {
  if (typeof val === 'string') {
    if (/^0o?[0-7]+$/.test(val)) {
      data[k] = parseInt(val.replace(/^0o?/, ''), 8)
    } else if (/^[1-9][0-9]*$/.test(val)) {
      data[k] = parseInt(val, 10)
    }
    return false
  }

  if (typeof val !== 'number') {
    return false
  }

  val = Math.floor(val)

  if (val < 0 || val > 511) {
    return false
  }

  data[k] = val
}

// Override nopt path validaton to use the HOME and PLATFORM
// values set by @npmcli/config constructor
const validatePath = (data, k, val) => {
  if (typeof val !== 'string') {
    return false
  }

  const isWin = typeDefs.path.PLATFORM === 'win32'
  const homePattern = isWin ? /^~(\/|\\)/ : /^~\//
  const home = typeDefs.path.HOME

  if (home && val.match(homePattern)) {
    data[k] = resolve(home, val.slice(2))
  } else {
    data[k] = resolve(val)
  }
}

const IpAddress = (() => {
  try {
    return [
      null,
      ...Object.values(networkInterfaces()).flatMap(i => i.map(ii => ii.address)),
    ]
  } catch {
    return [null]
  }
})()

const isStrictBool = (val) => {
  if (typeof val === 'boolean' || val === 'true' || val === 'false') {
    return true
  }
}

// These properties are only used for displaying appropriate config usage
const isString = { isString: true }
const isBoolean = { isBoolean: true }
const isNumber = { isNumber: true }

// `description` gets shown during a runtime validation warning
// `typeDescription` gets displayed in the docs for the `Type:`
const typeDefs = {
  String: {
    ...nopt.typeDefs.String,
    type: Symbol('String'),
    typeDescription: 'String',
    ...isString,
  },
  Boolean: {
    ...nopt.typeDefs.Boolean,
    type: Symbol('Boolean'),
    typeDescription: 'Boolean',
    description: 'boolean value (true or false)',
    ...isBoolean,
  },
  Number: {
    ...nopt.typeDefs.Number,
    type: Symbol('Number'),
    typeDescription: 'Number',
    description: 'numeric value',
    ...isNumber,
  },
  Date: {
    ...nopt.typeDefs.Date,
    type: Symbol('Date'),
    typeDescription: 'Date',
    description: 'valid Date string',
  },
  url: {
    ...nopt.typeDefs.url,
    type: Symbol('URL'),
    typeDescription: 'URL',
    description: 'full url with "http://"',
  },
  path: {
    ...nopt.typeDefs.path,
    type: Symbol('Path'),
    validate: validatePath,
    typeDescription: 'Path',
    description: 'valid filesystem path',
  },
  Stream: {
    ...nopt.typeDefs.Stream,
    type: Symbol('Stream'),
    typeDescription: 'Stream',
  },
  semver: {
    type: Symbol('Semver'),
    validate: (data, k, val) => {
      const valid = semver.valid(val)
      if (!valid) {
        return false
      }
      data[k] = valid
    },
    typeDescription: 'SemVer string',
    description: 'full valid SemVer string',
  },
  Umask: {
    type: Symbol('Umask'),
    validate: validateUmask,
    typeDescription: 'Octal numeric string in range 0000..0777 (0..511)',
    description: 'octal number in range 0o000..0o777 (0..511)',
  },
  IpAddress: {
    // this one cant be a symbol because it is an actual array of local
    // ip addresses for the current runtime
    type: IpAddress,
    typeDescription: 'IP Address',
  },
  BooleanOrString: {
    type: Symbol('BooleanOrString'),
    validate: (data, k, val) => {
      if (isStrictBool(val)) {
        return nopt.typeDefs.Boolean.validate(data, k, val)
      }
      return nopt.typeDefs.String.validate(data, k, val)
    },
    typeDescription: ['Boolean', 'String'],
    description: 'boolean value (true or false) or a string',
    ...isBoolean,
    ...isString,
  },
  BooleanOrNumber: {
    type: Symbol('BooleanOrNumber'),
    validate: (data, k, val) => {
      if (isStrictBool(val)) {
        return nopt.typeDefs.Boolean.validate(data, k, val)
      }
      return nopt.typeDefs.Number.validate(data, k, val)
    },
    typeDescription: ['Boolean', 'Number'],
    description: 'boolean value (true or false) or a string',
    ...isBoolean,
    ...isNumber,
  },
  Array: {
    type: Symbol('Array'),
  },
}

const byType = new Map()
const Types = {}
const getType = (k) => byType.get(k)

for (const [key, value] of Object.entries(typeDefs)) {
  // allow looking up a full type def by string key or type value
  byType.set(value.type, value)
  byType.set(key, value)
  Types[key] = value.type
}

module.exports = {
  typeDefs,
  Types,
  getType,
  isString: (ts) => [].concat(ts).some(t => getType(t)?.isString),
  isBoolean: (ts) => [].concat(ts).some(t => getType(t)?.isBoolean),
  isNumber: (ts) => [].concat(ts).some(t => getType(t)?.isNumber),
}
