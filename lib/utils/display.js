const { inspect } = require('util')
const proggy = require('proggy')
const log = require('proc-log')
const { explain } = require('./explain-eresolve.js')
const { formatWithOptions, format } = require('./format')

const COLOR_PALETTE = ({ chalk: c }) => ({
  heading: c.white.bgBlack,
  title: c.magenta,
  timing: c.green.bgBlack,
  // loglevels
  error: c.red.bgBlack,
  warn: c.black.bgYellow,
  notice: c.blue.bgBlack,
  http: c.green.bgBlack,
  info: c.green,
  verbose: c.blue.bgBlack,
  silly: c.inverse,
})

const LEVEL_OPTIONS = {
  silent: {
    index: 0,
  },
  error: {
    index: 1,
    label: 'ERR!',
    show ({ index }) {
      return this.index <= index
    },
  },
  warn: {
    index: 2,
    label: 'WARN',
    show ({ index }) {
      return this.index <= index
    },
  },
  notice: {
    index: 3,
    label: 'notice',
    show ({ index }) {
      return this.index <= index
    },
  },
  http: {
    index: 4,
    label: 'http',
    show ({ index }) {
      return this.index <= index
    },
  },
  info: {
    index: 5,
    label: 'info',
    show ({ index }) {
      return this.index <= index
    },
  },
  verbose: {
    index: 6,
    label: 'verb',
    show ({ index }) {
      return this.index <= index
    },
  },
  silly: {
    index: 7,
    label: 'sill',
    show ({ index }) {
      return this.index <= index
    },
  },
}

const LEVEL_METHODS = {
  ...LEVEL_OPTIONS,
  timing: {
    label: 'timing',
    show: ({ index, timing }) => timing && index !== 0,
  },
}

const LEVELS = log.LEVELS.reduce((acc, key) => {
  acc[key] = key
  return acc
}, {})

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

  // colors
  #chalk = null
  #colors = null

  // options
  #levelIndex = 0
  #timing = false
  #unicode = false
  #progress = false
  #json = false
  #heading = 'npm'

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
    this.#colors = COLOR_PALETTE({ chalk })

    this.#levelIndex = LEVEL_OPTIONS[loglevel].index
    this.#timing = timing
    this.#unicode = unicode
    this.#progress = progress
    this.#json = json
    this.#heading = heading

    if (this.#levelIndex <= 0) {
      this.off()
    } else {
      log.resume()
    }
  }

  logTiming (...args) {
    this.#logHandler('timing', ...args)
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

    const level = LEVEL_METHODS[levelName]
    if (level.show({ index: this.#levelIndex, timing: this.#timing })) {
      const title = args.shift()
      const prefix = [
        this.#colors.heading(this.#heading),
        this.#colors[levelName](level.label),
        title ? this.#colors.title(title) : null,
      ]
      process.stderr.write(formatWithOptions({ prefix }, ...args))
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
