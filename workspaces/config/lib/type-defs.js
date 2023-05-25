const { typeDefs: noptDefs } = require('nopt').lib
const semver = require('semver')
const querystring = require('querystring')
const { resolve } = require('path')
const { readFileSync } = require('fs')
const { networkInterfaces } = require('os')

const typeSymbols = {}
const typeDefs = {}
const Types = {}
const typesMap = new Map()

const getTypeBySymbol = (t) => typesMap.get(t)

const type = (typeKey, typeOpts = {}) => {
  let typeSymbol
  if (typeSymbols[typeKey]) {
    typeSymbol = typeSymbols[typeKey]
  } else {
    typeSymbol = typeSymbols[typeKey] = Symbol(typeKey)
  }

  const typeDef = { type: typeSymbol, ...typeOpts }
  // this is what gets passed to nopt, the string key is not
  // used. nopt looks it up based on the type property
  typeDefs[typeKey] = typeDef
  // this is exported and used in our defintions. each value
  // is a symbol that will then be looked up by nopt
  Types[typeKey] = typeSymbol
  // this is a map so full type definitions can be looked up
  // by symbol in the config definition to create usage, etc
  typesMap.set(typeSymbol, typeDef)

  return typeSymbol
}

const valuesType = (values) => {
  const allNumeric = values.every(v => typeof v === 'number')
  return {
    values,
    validate: (data, k, val) => {
      if (allNumeric) {
        if (noptDefs.Number.validate(data, k, val) === false) {
          return false
        }
        return !!values.includes(data[k])
      }

      if (values.includes(val)) {
        data[k] = val
        return
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

const parsePath = (val, { home, platform }) => {
  if (typeof val !== 'string') {
    return null
  }

  const isWin = platform === 'win32'
  const homePattern = isWin ? /^~(\/|\\)/ : /^~\//

  return home && val.match(homePattern)
    ? resolve(home, val.slice(2))
    : resolve(val)
}

const parseFile = (val) => {
  if (typeof val !== 'string') {
    return null
  }

  try {
    return readFileSync(val, 'utf8')
  } catch (er) {
    if (er.code !== 'ENOENT') {
      throw er
    }
  }

  return null
}

const validatePath = (data, k, val) => {
  if (typeof val !== 'string') {
    return false
  }

  data[k] = val
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
  if (typeof val !== 'string' && val !== null) {
    return false
  }

  data[k] = val ? !/^@/.test(val) ? `@${val}` : val : ''
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
  validate: noptDefs.String.validate,
  typeDescription: 'String',
  description: 'a string',
})

type('LowercaseString', {
  validate: (data, k, val) => {
    const valid = noptDefs.String.validate(data, k, val)
    if (valid === false) {
      return false
    }
    data[k] = data[k].toLowerCase()
  },
  typeDescription: 'String',
  description: 'a string',
})

type('Boolean', {
  validate: noptDefs.Boolean.validate,
  typeDescription: 'Boolean',
  description: 'a boolean value (true or false)',
  isBoolean: true,
})

type('Number', {
  validate: noptDefs.Number.validate,
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
  validate: noptDefs.Date.validate,
  typeDescription: 'Date',
  description: 'a valid Date string',
})

type('URL', {
  validate: noptDefs.url.validate,
  typeDescription: 'URL',
  description: 'a full url with "http://"',
})

type('Hostname', {
  validate: noptDefs.String.validate,
  typeDescription: 'Hostname',
  hint: 'hostname',
  description: 'a url hostname',
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
  validate: noptDefs.String.validate,
  typeDescription: 'Spec',
  description: 'an npm package spec',
  hint: 'package-spec',
})

type('Path', {
  validate: validatePath,
  typeDescription: 'Path',
  description: 'a valid filesystem path',
  depends: ['home', 'platform'],
  value: parsePath,
})

type('File', {
  validate: validatePath,
  typeDescription: 'File',
  description: 'a valid filesystem path to be read as utf-8',
  depends: ['home', 'platform'],
  value: [parsePath, parseFile],
})

type('SemVer', {
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
      return noptDefs.Boolean.validate(data, k, val)
    }
    return noptDefs.String.validate(data, k, val)
  },
  typeDescription: ['Boolean', 'String'],
  description: ['a boolean value (true or false)', 'a string'],
  isBoolean: true,
})

type('BooleanOrNumber', {
  validate: (data, k, val) => {
    if (isStrictBool(val)) {
      return noptDefs.Boolean.validate(data, k, val)
    }
    return noptDefs.Number.validate(data, k, val)
  },
  typeDescription: ['Boolean', 'Number'],
  description: ['a boolean value (true or false)', 'a numeric value'],
  isBoolean: true,
})

type('IpAddress', {
  ...valuesType(getLocalIps()),
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

// this allows for definitions to create ad-hoc type definitions that allow only
// certain values, with affordances for strings and numbers. like 1,2,3 for
// lockfile-version can be a string or number but we only want to display help
// for the coerced value of each allowed value
Types.Values = (...v) => type(JSON.stringify(v), valuesType(v))

module.exports = {
  typeDefs,
  Types,
  getType: getTypeBySymbol,
}
