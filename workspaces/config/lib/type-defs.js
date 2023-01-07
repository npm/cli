const nopt = require('nopt').lib
const semver = require('semver')
const querystring = require('querystring')
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

function validatePositiveNumber (data, k, val) {
  if (isNaN(val)) {
    return false
  }
  val = +val
  if (val < 1) {
    return false
  }
  data[k] = val
}

const validateQs = (data, k, val) => {
  data[k] = querystring.parse(val.replace(/\s+/g, '&'))
}

const validateCsv = (data, k, val) => {
  data[k] = val.split(',')
}

const validateScope = (data, k, val) => {
  data[k] = !/^@/.test(val) ? `@${val}` : val
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

// `description` gets shown during a runtime validation warning
// `typeDescription` gets displayed in the docs for the `Type:`
const typeDefs = {
  String: {
    ...nopt.typeDefs.String,
    type: Symbol('String'),
    typeDescription: 'String',
    description: 'a string',
  },
  Boolean: {
    ...nopt.typeDefs.Boolean,
    type: Symbol('Boolean'),
    typeDescription: 'Boolean',
    description: 'a boolean value (true or false)',
    isBoolean: true,
  },
  // todo: when type is all numbers, allow string verion of those numbers too
  Number: {
    ...nopt.typeDefs.Number,
    type: Symbol('Number'),
    typeDescription: 'Number',
    description: 'a numeric value',
    hint: 'number',
  },
  PositiveInteger: {
    type: Symbol('PositiveInteger'),
    validate: validatePositiveNumber,
    typeDescription: 'Positive integer',
    description: 'an integer greater than or equal to 1',
    hint: '1|2|3|n',
  },
  Date: {
    ...nopt.typeDefs.Date,
    type: Symbol('Date'),
    typeDescription: 'Date',
    description: 'a valid Date string',
  },
  URL: {
    ...nopt.typeDefs.url,
    type: Symbol('URL'),
    typeDescription: 'URL',
    description: 'a full url with "http://"',
  },
  Querystring: {
    type: Symbol('Querystring'),
    validate: validateQs,
    typeDescription: 'Querystring',
    description: 'a space-delimited querystring',
    hint: 'key=val key2=val2',
  },
  CSV: {
    type: Symbol('CSV'),
    validate: validateCsv,
    typeDescription: 'Comma-delimited string',
    description: 'a comma-delimited string',
  },
  Scope: {
    type: Symbol('Scope'),
    validate: validateScope,
    typeDescription: 'Scope',
    description: 'an npm scope with or without the leading @',
    hint: '@scope',
  },
  Spec: {
    type: Symbol('Spec'),
    validate: nopt.typeDefs.String.validate,
    typeDescription: 'Spec',
    description: 'an npm package spec',
    hint: 'package-spec',
  },
  Path: {
    ...nopt.typeDefs.path,
    type: Symbol('Path'),
    validate: validatePath,
    typeDescription: 'Path',
    description: 'a valid filesystem path',
  },
  Semver: {
    type: Symbol('Semver'),
    validate: (data, k, val) => {
      const valid = semver.valid(val)
      if (!valid) {
        return false
      }
      data[k] = valid
    },
    typeDescription: 'SemVer string',
    description: 'a full valid SemVer string',
  },
  Umask: {
    type: Symbol('Umask'),
    validate: validateUmask,
    typeDescription: 'Octal numeric string in range 0000..0777 (0..511)',
    description: 'an octal number in range 0o000..0o777 (0..511)',
  },
  IpAddress: {
    // this one cant be a symbol because it is an actual array of local
    // ip addresses for the current runtime
    type: IpAddress,
    typeDescription: 'IP Address',
    // this explicitly has no description since it is an array of values
    // that will be shown to the user when it is invalid
    description: null,
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
    description: ['a boolean value (true or false)', 'a string'],
    isBoolean: true,
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
    description: ['a boolean value (true or false)', 'a a numeric valid'],
    isBoolean: true,
  },
  // the array type has no validation or description its presence in a
  // definition signals that more than one value of the other types are allowed
  Array: {
    type: Symbol('Array'),
  },
}

const byType = new Map()
const Types = {}
const TypesList = []
const getType = (k) => byType.get(k)

for (const [key, value] of Object.entries(typeDefs)) {
  byType.set(value.type, value)
  Types[key] = value.type
  TypesList.push(value.type)
}

module.exports = {
  typeDefs,
  Types,
  TypesList,
  getType,
}
