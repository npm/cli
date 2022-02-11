const log = require('proc-log')
const mkdirp = require('mkdirp')
const fs = require('fs')
const { dirname } = require('path')
const os = require('os')
const { inspect, format } = require('util')
const proggy = require('proggy')

const { bin: options } = require('./options.js')

// allow for last arg to proc log to be metadata that won't get displayed
const META = Symbol('meta')

const parseArgs = (...args) => {
  const { [META]: isMeta } = args[args.length - 1] || {}
  return isMeta
    ? [args[args.length - 1], ...args.slice(0, args.length - 1)]
    : [{}, ...args]
}

log.meta = (meta = {}) => ({ [META]: true, ...meta })

const addLogListener = (fn) => process.on('log', (...args) => fn(...parseArgs(...args)))

const levels = new Map([
  'silly',
  'verbose',
  'info',
  'http',
  'notice',
  'warn',
  'error',
  'silent',
].map((level, index) => [level, index]))

const createFormatter = ({ eol = os.EOL, colors = false } = {}) => {
  const magenta = m => colors ? `\x1B[35m${m}\x1B[39m` : m
  const dim = m => colors ? `\x1B[2m${m}\x1B[22m` : m
  const red = m => colors ? `\x1B[31m${m}\x1B[39m` : m
  const green = m => colors ? `\x1B[32m${m}\x1B[39m` : m

  return (level, ...args) => {
    const depth = level === 'error' && args[0] && args[0].code === 'ERESOLVE' ? Infinity : 10

    if (level === 'info' && args[0] === 'timeEnd') {
      args[1] = dim(args[1])
    } else if (level === 'error' && args[0] === 'timeError') {
      args[1] = red(args[1])
    }

    const messages = args.map(a => typeof a === 'string' ? a : inspect(a, { depth, colors }))
    const levelColor = level === 'progress' ? green : magenta
    const pref = `${dim(process.pid)} ${levelColor(level)} `

    return pref + format(...messages).trim().split('\n').join(`${eol}${pref}`) + eol
  }
}

if (options.loglevel !== 'silent') {
  const levelIndex = levels.get(options.loglevel)
  const format = createFormatter({ eol: '\n', colors: options.colors })
  addLogListener((meta, level, ...logArgs) => {
    if (levelIndex <= levels.get(level) || meta.force) {
      process.stderr.write(format(level, ...logArgs))
    }
  })
}

if (options.logfile) {
  log.silly('logfile', options.logfile)
  mkdirp.sync(dirname(options.logfile))
  const fd = fs.openSync(options.logfile, 'a')
  const format = createFormatter({ eol: os.EOL, colors: false })
  addLogListener((meta, level, ...logArgs) => {
    fs.writeSync(fd, format(level, ...logArgs))
  })
}

if (options.progress) {
  const client = proggy.createClient({ normalize: true })
  const format = createFormatter({ eol: '\n', colors: options.colors })
  client.on('progress', (key, data) => {
    process.stderr.write(format('progress', key, `${(data.value / data.total * 100).toFixed(0)}%`))
  })
}

module.exports = log
