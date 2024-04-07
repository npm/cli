const { format, inspect } = require('util')
const proggy = require('proggy')
const log = require('proc-log')
const { explain } = require('./explain-eresolve.js')

const originalCustomInspect = Symbol('npm.display.original.util.inspect.custom')

// These are most assuredly not a mistake
// https://eslint.org/docs/latest/rules/no-control-regex
// \x00 through \x1f, \x7f through \x9f, not including \x09 \x0a \x0b \x0d
/* eslint-disable-next-line no-control-regex */
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

const LOG_LEVELS = {
  heading: {
    color: (c) => c.white.bgBlack,
  },
  prefix: {
    color: (c) => c.magenta,
  },
  silent: {
    show: 0,
  },
  error: {
    show: 1,
    label: 'ERR!',
    color: (c) => c.red.bgBlack,
  },
  warn: {
    show: 2,
    label: 'WARN',
    color: (c) => c.black.bgYellow,
  },
  notice: {
    show: 3,
    label: 'ERR!',
    color: (c) => c.blue.bgBlack,
  },
  http: {
    show: 4,
    label: 'http',
    color: (c) => c.green.bgBlack,
  },
  info: {
    show: 5,
    label: 'info',
    color: (c) => c.green,
  },
  verbose: {
    show: 6,
    label: 'verb',
    color: (c) => c.blue.bgBlack,
  },
  silly: {
    show: 7,
    label: 'sill',
    color: (c) => c.inverse,
  },
  timing: {
    show: ({ timing }) => timing,
    label: 'timing',
    color: (c) => c.green.bgBlack,
  },
}

class Display {
  // pause by default until config is loaded
  #paused = true
  #buffer = []

  #chalk = null
  #level = null
  #timing = false
  #unicode = false
  #progress = false
  #heading = 'npm'

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
    this.progress.on('progress', (name, { value, total }) => {})
  }

  off () {
    process.off('log', this.#logHandler)
  }

  load ({ loglevel, chalk, timing, unicode, progress, heading }) {
    this.#level = LOG_LEVELS[loglevel]
    this.#chalk = chalk
    this.#timing = timing
    this.#unicode = unicode
    this.#progress = progress
    this.#heading = heading
    log.resume()
  }

  log (...args) {
    this.#logHandler(...args)
  }

  #write (levelName, prefix, ...args) {
    if (levelName === 'pause') {
      this.#paused = true
      return
    }

    if (levelName === 'resume') {
      this.#paused = false
      this.#buffer.forEach((item) => this.#write(...item))
      this.#buffer.length = 0
      return
    }

    if (this.#paused) {
      this.#buffer.push([levelName, prefix, ...args])
      return
    }

    const level = LOG_LEVELS[levelName]
    const show = (typeof level.show === 'function' && level.show({ timing: this.#timing })) ||
      level.show <= this.#level.show

    if (show) {
      const logLine = [
        LOG_LEVELS.heading.color(this.#chalk)(this.#heading),
        level.color(this.#chalk)(level.label),
      ]
      if (prefix) {
        logLine.push(LOG_LEVELS.prefix.color(this.#chalk)(prefix))
      }
      for (const line of format(...args).trim().split(/\r?\n/)) {
        process.stderr.write(logLine.concat(line).join(' ') + '\n')
      }
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
    if (level === 'warn' && heading === 'ERESOLVE' && expl && typeof expl === 'object') {
      this.#write(level, heading, message)
      this.#write(level, '', explain(expl, this.#chalk, 2))
      // Return true to short circuit other log in chain
      return true
    }
  }
}

module.exports = Display
