const { formatWithOptions: baseFormatWithOptions, inspect } = require('util')

const CUSTOM_INSPECT = Symbol('npm.display.original.util.inspect.custom')

// These are most assuredly not a mistake
// https://eslint.org/docs/latest/rules/no-control-regex
// \x00 through \x1f, \x7f through \x9f, not including \x09 \x0a \x0b \x0d
/* eslint-disable-next-line no-control-regex */
const HAS_C01 = /[\x00-\x08\x0c\x0e-\x1f\x7f-\x9f]/

// Allows everything up to '[38;5;255m' in 8 bit notation
const ALLOWED_SGR = /^\[[0-9;]{0,8}m/

// '[38;5;255m'.length
const SGR_MAX_LEN = 10

// Strips all ANSI C0 and C1 control characters (except for SGR up to 8 bit)
function STRIP_C01 (str) {
  if (!HAS_C01.test(str)) {
    return str
  }
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const code = char.charCodeAt(0)
    if (!HAS_C01.test(char)) {
      // Most characters are in this set so continue early if we can
      result = `${result}${char}`
    } else if (code === 27 && ALLOWED_SGR.test(str.slice(i + 1, i + SGR_MAX_LEN + 1))) {
      // \x1b with allowed SGR
      result = `${result}\x1b`
    } else if (code <= 31) {
      // escape all other C0 control characters besides \x7f
      result = `${result}^${String.fromCharCode(code + 64)}`
    } else {
      // hasC01 ensures this is now a C1 control character or \x7f
      result = `${result}^${String.fromCharCode(code - 64)}`
    }
  }
  return result
}

const createCleaner = (fn) => (output) => {
  if (typeof output === 'string') {
    // Strings are cleaned inline
    return STRIP_C01(output)
  }

  if (!output || typeof output !== 'object') {
    // Numbers, booleans, null all end up here and don't need cleaning
    return output
  }

  return fn(output)
}

const cleanInspect = createCleaner((output) => {
  return STRIP_C01(inspect(output, { customInspect: false }))
})

const cleanControl = createCleaner((output) => {
  // output && typeof output === 'object'
  // We can't use hasOwn et al for detecting the original but we can use it
  // for detecting the properties we set via defineProperty
  if (!Object.hasOwn(output, CUSTOM_INSPECT)) {
    // Save the old one if we didn't already do it or put a dummy one in for
    // when we run multiple times on the same object
    Object.defineProperty(output, CUSTOM_INSPECT, {
      value: output[inspect.custom] || function () {
        return this
      },
      writable: true,
    })
  }

  // Set the custom inspect to our own function
  Object.defineProperty(output, inspect.custom, {
    value: function () {
      return cleanInspect(this[CUSTOM_INSPECT]())
    },
    writable: true,
  })

  return output
})

const formatWithOptions = ({ prefix = [], eol = '\n', ...options }, ...args) => {
  const prefixStr = prefix.filter(p => p != null).join(' ')
  return baseFormatWithOptions(options, ...args)
    .trim()
    .split(/\r?\n/)
    .map(cleanControl)
    .reduce((lines, line) =>
      lines += prefixStr + (prefixStr && line ? ' ' : '') + line + eol,
    ''
    )
}

const format = (...args) => formatWithOptions({}, ...args)

module.exports = { format, formatWithOptions }
