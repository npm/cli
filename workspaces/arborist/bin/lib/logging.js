const log = require('proc-log')
const mkdirp = require('mkdirp')
const fs = require('fs')
const { dirname } = require('path')
const os = require('os')
const { inspect, format } = require('util')
const proggy = require('proggy')

const { bin: options } = require('./options.js')

const META = Symbol('meta')
const parseArgs = (...args) => {
  const { [META]: isMeta } = args[args.length - 1] || {}
  return isMeta
    ? [args[args.length - 1], ...args.slice(0, args.length - 1)]
    : [{}, ...args]
}

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

const initStream = (stream, { eol = os.EOL, loglevel = 'silly', colors = false } = {}) => {
  const levelIndex = levels.get(loglevel)

  const magenta = m => colors ? `\x1B[35m${m}\x1B[39m` : m
  const dim = m => colors ? `\x1B[2m${m}\x1B[22m` : m
  const red = m => colors ? `\x1B[31m${m}\x1B[39m` : m

  const formatter = (level, ...args) => {
    const depth = level === 'error' && args[0] && args[0].code === 'ERESOLVE' ? Infinity : 10

    if (level === 'info' && args[0] === 'timeEnd') {
      args[1] = dim(args[1])
    } else if (level === 'error' && args[0] === 'timeError') {
      args[1] = red(args[1])
    }

    const messages = args.map(a => typeof a === 'string' ? a : inspect(a, { depth, colors }))
    const pref = `${process.pid} ${magenta(level)} `

    return pref + format(...messages).trim().split('\n').join(`${eol}${pref}`) + eol
  }

  process.on('log', (...args) => {
    const [meta, level, ...logArgs] = parseArgs(...args)

    if (levelIndex <= levels.get(level) || meta.force) {
      stream.write(formatter(level, ...logArgs))
    }
  })
}

initStream(process.stderr, {
  eol: '\n',
  colors: options.colors,
  loglevel: options.loglevel,
})

if (options.logfile) {
  log.silly('logfile', options.logfile)
  mkdirp.sync(dirname(options.logfile))
  const fd = fs.openSync(options.logfile, 'a')
  initStream({ write: (str) => fs.writeSync(fd, str) })
}

if (options.progress) {
  const client = proggy.createClient()
  client.on('progress', (...args) => {
    console.error(...args)
  })
}

log.meta = (meta = {}) => ({ [META]: true, ...meta })
module.exports = log
