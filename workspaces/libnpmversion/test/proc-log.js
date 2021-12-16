const procLog = require('../lib/proc-log.js')
const t = require('tap')
process.once('log', (...args) => t.same(args, ['warn', 1, 2, 3]))
procLog.warn(1, 2, 3)
t.same(Object.keys(procLog), [
  'notice', 'error',
  'warn', 'info',
  'verbose', 'http',
  'silly', 'pause',
  'resume',
])
