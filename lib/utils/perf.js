const log = require('npmlog')
const timers = new Map()

process.on('time', (name) => {
  timers.set(name, Date.now())
})

process.on('timeEnd', (name) => {
  if (timers.has(name)) {
    const ms = Date.now() - timers.get(name)
    process.emit('timing', name, ms)
    log.timing(name, `Completed in ${ms}ms`)
    timers.delete(name)
  } else
    log.silly('timing', "Tried to end timer that doesn't exist:", name)
})

exports.timers = timers
// for tests
/* istanbul ignore next */
exports.reset = () => {
  process.removeAllListeners('time')
  process.removeAllListeners('timeEnd')
}
