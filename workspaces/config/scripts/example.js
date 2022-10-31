const Config = require('../')

const shorthands = require('../test/fixtures/shorthands.js')
const types = require('../test/fixtures/types.js')
const defaults = require('../test/fixtures/defaults.js')

const npmPath = __dirname

const timers = {}
process.on('time', k => {
  if (timers[k]) {
    throw new Error('duplicate timer: ' + k)
  }
  timers[k] = process.hrtime()
})
process.on('timeEnd', k => {
  if (!timers[k]) {
    throw new Error('ending unstarted timer: ' + k)
  }
  const dur = process.hrtime(timers[k])
  delete timers[k]
  console.error(`\x1B[2m${k}\x1B[22m`, Math.round(dur[0] * 1e6 + dur[1] / 1e3) / 1e3)
  delete timers[k]
})

process.on('log', (level, ...message) =>
  console.log(`\x1B[31m${level}\x1B[39m`, ...message))

const priv = /(^|:)_([^=]+)=(.*)\n/g
const ini = require('ini')
const config = new Config({ shorthands, types, defaults, npmPath })
config.load().then(async () => {
  for (const [where, { data, source }] of config.data.entries()) {
    console.log(`; ${where} from ${source}`)
    if (where === 'default' && !config.get('long')) {
      console.log('; not shown, run with -l to show all\n')
    } else {
      console.log(ini.stringify(data).replace(priv, '$1_$2=******\n'))
    }
  }
  console.log('argv:', { raw: config.argv, parsed: config.parsedArgv })
  return undefined
}).catch(() => {})
