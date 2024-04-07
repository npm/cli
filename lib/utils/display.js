const { inspect } = require('util')
const proggy = require('proggy')
const log = require('proc-log')
const { explain } = require('./explain-eresolve.js')
const { formatWith, format } = require('./format')

const HEADING = {
  color: (c) => c.white.bgBlack,
}

const TITLE = {
  color: (c) => c.magenta,
}

const LEVEL_INFO = {
  silent: {
    index: 0,
  },
  timing: {
    label: 'timing',
    color: (c) => c.green.bgBlack,
    // timing level is only shown if timing option is true
    show: ({ timing }) => timing,
  },
  error: {
    index: 1,
    label: 'ERR!',
    color: (c) => c.red.bgBlack,
    show ({ index }) {
      return this.index <= index
    },
  },
  warn: {
    index: 2,
    label: 'WARN',
    color: (c) => c.black.bgYellow,
    show ({ index }) {
      return this.index <= index
    },
  },
  notice: {
    index: 3,
    label: 'notice',
    color: (c) => c.blue.bgBlack,
    show ({ index }) {
      return this.index <= index
    },
  },
  http: {
    index: 4,
    label: 'http',
    color: (c) => c.green.bgBlack,
    show ({ index }) {
      return this.index <= index
    },
  },
  info: {
    index: 5,
    label: 'info',
    color: (c) => c.green,
    show ({ index }) {
      return this.index <= index
    },
  },
  verbose: {
    index: 6,
    label: 'verb',
    color: (c) => c.blue.bgBlack,
    show ({ index }) {
      return this.index <= index
    },
  },
  silly: {
    index: 7,
    label: 'sill',
    color: (c) => c.inverse,
    show ({ index }) {
      return this.index <= index
    },
  },
}

const LEVELS = log.LEVELS.reduce((acc, key) => {
  acc[key] = key
  return acc
}, { timing: 'timing' })

const safeJsonParse = (maybeJsonStr) => {
  if (typeof maybeJsonStr !== 'string') {
    return maybeJsonStr
  }
  try {
    return JSON.parse(maybeJsonStr)
  } catch {
    return maybeJsonStr
  }
}

class Display {
  // pause by default until config is loaded
  #paused = true
  #buffer = []
  #outputBuffer = []

  #chalk = null
  #unicode = false
  #progress = false
  #json = false
  #heading = 'npm'

  #showOptions = null

  constructor () {
    this.on()
  }

  on () {
    process.on('log', this.#logHandler)
    this.progress = proggy.createClient()
    this.progress.on('progress', (name, { value, total }) => {})
  }

  off () {
    process.off('log', this.#logHandler)
  }

  load ({ loglevel, chalk, timing, unicode, progress, json, heading }) {
    this.#chalk = chalk
    this.#unicode = unicode
    this.#progress = progress
    this.#json = json
    this.#heading = heading

    this.#showOptions = {
      timing,
      index: LEVEL_INFO[loglevel].index,
    }

    log.resume()

    log.silly('display', 'ok', { x: 1, y: new Map([['a', 2]]) })
  }

  log (...args) {
    this.#logHandler(...args)
  }

  output (...args) {
    process.stdout.write(format(...args))
  }

  outputError (...args) {
    process.stderr.write(format(...args))
  }

  outputBuffer (item) {
    this.#outputBuffer.push(item)
  }

  flushOutput (jsonError) {
    if (!jsonError && !this.#outputBuffer.length) {
      return
    }

    if (this.#json) {
      const output = this.#outputBuffer.reduce((a, i) => ({ ...a, ...safeJsonParse(i) }), {})
      this.output(JSON.stringify({ ...output, ...jsonError }, null, 2))
    } else {
      this.#outputBuffer.forEach((item) => this.output(item))
    }

    this.#outputBuffer.length = 0
  }

  #write (levelName, ...args) {
    if (levelName === LEVELS.pause) {
      this.#paused = true
      return
    }

    if (levelName === LEVELS.resume) {
      this.#paused = false
      this.#buffer.forEach((item) => this.#write(...item))
      this.#buffer.length = 0
      return
    }

    if (this.#paused) {
      this.#buffer.push([levelName, ...args])
      return
    }

    const level = LEVEL_INFO[levelName]
    if (level.show(this.#showOptions)) {
      const title = args.shift()
      const prefix = [
        HEADING.color(this.#chalk)(this.#heading),
        level.color(this.#chalk)(level.label),
        title ? TITLE.color(this.#chalk)(title) : null,
      ]
      process.stderr.write(formatWith({ prefix }, ...args))
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
    if (args.length === 4) {
      const [level, heading, message, expl] = args
      if (level === LEVELS.warn && heading === 'ERESOLVE' && expl && typeof expl === 'object') {
        // Also (and this is a really inexcusable kludge), we patch the
        // log.warn() method so that when we see a peerDep override
        // explanation from Arborist, we can replace the object with a
        // highly abbreviated explanation of what's being overridden.
        this.#write(level, heading, message)
        this.#write(level, '', explain(expl, this.#chalk, 2))
        return
      }
    }
    this.#write(...args)
  }
}

module.exports = Display
