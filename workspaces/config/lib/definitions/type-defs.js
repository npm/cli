const { typeDefs: noptDefs } = require('nopt').lib
const semver = require('semver')
const querystring = require('querystring')
const { resolve } = require('path')
const { networkInterfaces } = require('os')

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const noptValidators = Object.entries(noptDefs).reduce((acc, [k, v]) => {
  acc[capitalize(k)] = v.validate
  acc[k.toUpperCase()] = v.validate
  return acc
}, {})

const typeSymbols = {}
const typeDefs = {}
const byType = new Map()
const Types = {}

const getType = (k) => byType.get(k)
const updateType = (k, data) => Object.assign(getType(k), data)

const type = (key, { type: t, ...typeOpts } = {}) => {
  const typeKey = t ?? key
  const typeSymbol = typeSymbols[typeKey] ?? Symbol(typeKey)
  typeSymbols[typeKey] = typeSymbol

  const typeDef = {
    type: typeSymbol,
    validate: noptValidators[key],
    ...typeOpts,
  }
  typeDefs[key] = typeDef
  byType.set(typeSymbol, typeDefs[key])
  Types[key] = typeSymbol
  return typeSymbol
}

const valuesType = (values) => {
  const allNumeric = values.every(v => typeof v === 'number')
  return {
    type: JSON.stringify(values),
    values,
    validate: (data, k, val) => {
      if (allNumeric) {
        const numVal = noptValidators.Number(data, k, val)
        if (values.includes(numVal)) {
          data[k] = numVal
          return
        }
        return false
      }

      if (values.includes(val)) {
        data[k] = val
      }

      return false
    },
  }
}

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

  const isWin = typeDefs.Path.PLATFORM === 'win32'
  const homePattern = isWin ? /^~(\/|\\)/ : /^~\//
  const home = typeDefs.Path.HOME

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

const getLocalIps = () => {
  try {
    return Object.values(networkInterfaces()).flatMap(i => i.map(ii => ii.address))
  } catch {
    return []
  }
}

const isStrictBool = (val) => {
  if (typeof val === 'boolean' || val === 'true' || val === 'false') {
    return true
  }
}

// `description` gets shown during a runtime validation warning
// `typeDescription` gets displayed in the docs for the `Type:`
type('String', {
  typeDescription: 'String',
  description: 'a string',
})

type('Boolean', {
  typeDescription: 'Boolean',
  description: 'a boolean value (true or false)',
  isBoolean: true,
})

type('Number', {
  typeDescription: 'Number',
  description: 'a numeric value',
  hint: 'number',
})

type('PositiveInteger', {
  validate: validatePositiveNumber,
  typeDescription: 'Positive integer',
  description: 'an integer greater than or equal to 1',
  hint: '1|2|3|n',
})

type('Date', {
  typeDescription: 'Date',
  description: 'a valid Date string',
})

type('URL', {
  typeDescription: 'URL',
  description: 'a full url with "http://"',
})

type('Querystring', {
  validate: validateQs,
  typeDescription: 'Querystring',
  description: 'a space-delimited querystring',
  hint: 'key=val key2=val2',
})

type('CSV', {
  validate: validateCsv,
  typeDescription: 'Comma-delimited string',
  description: 'a comma-delimited string',
})

type('Scope', {
  validate: validateScope,
  typeDescription: 'Scope',
  description: 'an npm scope with or without the leading @',
  hint: '@scope',
})

type('Spec', {
  // a spec has always been just a string but we could validate futher
  // here and give better validation messages for certain formats
  validate: noptValidators.String,
  typeDescription: 'Spec',
  description: 'an npm package spec',
  hint: 'package-spec',
})

type('Path', {
  validate: validatePath,
  typeDescription: 'Path',
  description: 'a valid filesystem path',
})

type('Semver', {
  validate: (data, k, val) => {
    const valid = semver.valid(val)
    if (!valid) {
      return false
    }
    data[k] = valid
  },
  typeDescription: 'SemVer string',
  description: 'a full valid SemVer string',
})

type('Umask', {
  validate: validateUmask,
  typeDescription: 'Octal numeric string in range 0000..0777 (0..511)',
  description: 'an octal number in range 0o000..0o777 (0..511)',
})

type('BooleanOrString', {
  validate: (data, k, val) => {
    if (isStrictBool(val)) {
      return noptValidators.Boolean(data, k, val)
    }
    return noptValidators.String(data, k, val)
  },
  typeDescription: ['Boolean', 'String'],
  description: ['a boolean value (true or false)', 'a string'],
  isBoolean: true,
})

type('BooleanOrNumber', {
  validate: (data, k, val) => {
    if (isStrictBool(val)) {
      return noptValidators.Boolean(data, k, val)
    }
    return noptValidators.Number(data, k, val)
  },
  typeDescription: ['Boolean', 'Number'],
  description: ['a boolean value (true or false)', 'a numeric value'],
  isBoolean: true,
})

type('IpAddress', {
  ...valuesType(getLocalIps()),
  type: 'IpAddress',
  typeDescription: 'IP Address',
})

// the array type has no validation or description its presence in a
// definition signals that more than one value of the other types are allowed
type('Array')

// This type is used to set a config value as explicitly not allowed since nopt
// will always parse unknown keys to the raw value passed in. It's not used
// explicitly in the defintions, but can be used at certain config locations to
// not allow certain keys there.
type('NotAllowed', { validate: () => false })

Types.Values = (...values) => {
  const t = valuesType(values)
  return type(t.type, t)
}

module.exports = {
  typeDefs,
  Types,
  getType,
  updateType,
}
