const { format, inspect } = require('util')
const log = require('proc-log')
const proggy = require('proggy')
const { explain } = require('./explain-eresolve.js')

const originalCustomInspect = Symbol('npm.display.original.util.inspect.custom')

// These are most assuredly not a mistake
// https://eslint.org/docs/latest/rules/no-control-regex
/* eslint-disable no-control-regex */
// \x00 through \x1f, \x7f through \x9f, not including \x09 \x0a \x0b \x0d
const hasC01 = /[\x00-\x08\x0c\x0e-\x1f\x7f-\x9f]/
// Allows everything up to '[38;5;255m' in 8 bit notation
const allowedSGR = /^\[[0-9;]{0,8}m/
// '[38;5;255m'.length
const sgrMaxLen = 10

// Strips all ANSI C0 and C1 control characters (except for SGR up to 8 bit)
function stripC01 (str) {
  if (!hasC01.test(str)) {
    return str
  }
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const code = char.charCodeAt(0)
    if (!hasC01.test(char)) {
      // Most characters are in this set so continue early if we can
      result = `${result}${char}`
    } else if (code === 27 && allowedSGR.test(str.slice(i + 1, i + sgrMaxLen + 1))) {
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

const defaultLevel = 'notice'

const loglevels = [
  'silent',
  'error',
  'warn',
  'notice',
  'http',
  'info',
  'verbose',
  'silly',
]

const levels = new Map(loglevels.reduce((set, level, index) => {
  set.push([level, index], [index, level])
  return set
}, []))

const labels = {
  silly: 'sill',
  verbose: 'verb',
  warn: 'WARN',
  error: 'ERR!',
}

const getColors = (c, chalk) => {
  const colors = {
    heading: chalk.white.bgBlack,
    prefix: chalk.magenta,
    silly: chalk.inverse,
    verbose: chalk.blue.bgBlack,
    info: chalk.green,
    timing: chalk.green.bgBlack,
    http: chalk.green.bgBlack,
    notice: chalk.blue.bgBlack,
    warn: chalk.black.bgYellow,
    error: chalk.red.bgBlack,
  }

  return c ? colors : Object.keys(colors).reduce((acc, key) => {
    acc[key] = (s) => s
    return acc
  })
}

class Display {
  #chalk = null

  // pause by default until config is loaded
  #paused = true
  #buffer = []

  #level = null
  #color = false
  #timing = false
  #unicode = false
  #progress = false
  #heading = 'npm'

  #colors = null

  constructor () {
    this.on()
  }

  static clean (output) {
    if (typeof output === 'string') {
      // Strings are cleaned inline
      return stripC01(output)
    }
    if (!output || typeof output !== 'object') {
      // Numbers, booleans, null all end up here and don't need cleaning
      return output
    }
    // output && typeof output === 'object'
    // We can't use hasOwn et al for detecting the original but we can use it
    // for detecting the properties we set via defineProperty
    if (
      output[inspect.custom] &&
      (!Object.hasOwn(output, originalCustomInspect))
    ) {
      // Save the old one if we didn't already do it.
      Object.defineProperty(output, originalCustomInspect, {
        value: output[inspect.custom],
        writable: true,
      })
    }
    if (!Object.hasOwn(output, originalCustomInspect)) {
      // Put a dummy one in for when we run multiple times on the same object
      Object.defineProperty(output, originalCustomInspect, {
        value: function () {
          return this
        },
        writable: true,
      })
    }
    // Set the custom inspect to our own function
    Object.defineProperty(output, inspect.custom, {
      value: function () {
        const toClean = this[originalCustomInspect]()
        // Custom inspect can return things other than objects, check type again
        if (typeof toClean === 'string') {
          // Strings are cleaned inline
          return stripC01(toClean)
        }
        if (!toClean || typeof toClean !== 'object') {
          // Numbers, booleans, null all end up here and don't need cleaning
          return toClean
        }
        return stripC01(inspect(toClean, { customInspect: false }))
      },
      writable: true,
    })
    return output
  }

  on () {
    process.on('log', this.#logHandler)
    this.progress = proggy.createClient()

    this.progress.on('progress', (name, { value, total }) => {
      // this[_write]('progress', name, (value / total).toFixed())
    })
  }

  off () {
    process.off('log', this.#logHandler)
    // Unbalanced calls to enable/disable progress
    // will leave change listeners on the tracker
    // This pretty much only happens in tests but
    // this removes the event emitter listener warnings
    log.tracker.removeAllListeners()
  }

  load ({ loglevel, ...opts }) {
    const silent = loglevel === 'silent'

    this.#level = loglevel
    this.#color = opts.color
    this.#colors = getColors(this.#color, opts.chalk)
    this.#timing = opts.timing
    this.#unicode = opts.unicode
    this.#progress = opts.progress && !silent
    this.#heading = opts.heading || 'npm'

    // proc log does not have a timing leve so to avoid this being
    // a breaking change before npm9, we need to change the loglevel
    // in some cases when timing mode is turned on to match npmlog behavior.
    // XXX(npm9): remove this and make timing independent of loglevel
    // new behavior should be timing logs are always shown if timing=true
    // except when loglevel is silent
    if (levels.get(this.#level) >= levels.get('timing')) {
      this.#timing = true
      if (this.#level === 'timing') {
        this.#level = 'info'
      }
    } else if (this.#timing && this.#level === defaultLevel) {
      this.#level = 'http'
    }
  }

  log (...args) {
    this.#logHandler(...args)
  }

  #write (level, prefix, ...args) {
    if (level === 'pause') {
      this.#paused = true
    } else if (level === 'resume') {
      this.#paused = false
      this.#buffer.forEach((item) => this.#write(...item))
      this.#buffer.length = 0
    } else if (
      (level === 'timing' && this.#timing) ||
      (levels.get(level) <= levels.get(this.#level))
    ) {
      const writeHeading = this.#heading && this.#colors.heading(this.heading)
      const writeLevel = this.#colors[level](labels[level] || level)
      const writePrefix = prefix && this.#colors.prefix(prefix)

      format(...args).trim().split(/\r?\n/).forEach((line) => {
        const writeArgs = [
          writeHeading,
          writeLevel,
          writePrefix,
          line,
        ]
        process.stderr.write(writeArgs.filter(Boolean).join(' ') + '\n')
      })
    }
  }

  #logHandler = (level, ...args) => {
    try {
      this.#log(level, ...args)
    } catch (ex) {
      try {
        // if it crashed once, it might again!
        this.#write('verbose', `attempt to log ${inspect(args)} crashed`, ex)
      } catch (ex2) {
        // eslint-disable-next-line no-console
        console.error(`attempt to log ${inspect(args)} crashed`, ex, ex2)
      }
    }
  }

  #log (...args) {
    return this.#eresolveWarn(...args) || this.#write(...args)
  }

  // Also (and this is a really inexcusable kludge), we patch the
  // log.warn() method so that when we see a peerDep override
  // explanation from Arborist, we can replace the object with a
  // highly abbreviated explanation of what's being overridden.
  #eresolveWarn (level, heading, message, expl) {
    if (level === 'warn' &&
      heading === 'ERESOLVE' &&
      expl && typeof expl === 'object'
    ) {
      this.#write(level, heading, message)
      this.#write(level, '', explain(expl, this.#chalk, 2))
      // Return true to short circuit other log in chain
      return true
    }
  }
}

module.exports = Display
