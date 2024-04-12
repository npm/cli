const EE = require('events')
const fs = require('fs')
const { log } = require('proc-log')

const INITIAL_TIMER = 'npm'

class Timers extends EE {
  file = null

  #unfinished = new Map()
  #finished = {}

  constructor () {
    super()
    this.on()
    process.emit('time', INITIAL_TIMER)
    this.started = this.#unfinished.get(INITIAL_TIMER)
  }

  get unfinished () {
    return this.#unfinished
  }

  get finished () {
    return this.#finished
  }

  on () {
    process.on('time', this.#timeListener)
    process.on('timeEnd', this.#timeEndListener)
  }

  off () {
    process.off('time', this.#timeListener)
    process.off('timeEnd', this.#timeEndListener)
  }

  time (name, fn) {
    process.emit('time', name)
    const end = () => process.emit('timeEnd', name)
    if (typeof fn === 'function') {
      const res = fn()
      return res && res.finally ? res.finally(end) : (end(), res)
    }
    return end
  }

  load ({ path } = {}) {
    if (path) {
      this.file = `${path}timing.json`
    }
  }

  writeFile (metadata) {
    if (!this.file) {
      return
    }

    try {
      const globalStart = this.started
      const globalEnd = this.#finished[INITIAL_TIMER] || Date.now()
      const content = {
        metadata,
        timers: this.#finished,
        // add any unfinished timers with their relative start/end
        unfinishedTimers: [...this.#unfinished.entries()].reduce((acc, [name, start]) => {
          acc[name] = [start - globalStart, globalEnd - globalStart]
          return acc
        }, {}),
      }
      fs.writeFileSync(this.file, JSON.stringify(content) + '\n')
    } catch (e) {
      this.file = null
      log.warn('timing', `could not write timing file: ${e}`)
    }
  }

  #timeListener = (name) => {
    this.#unfinished.set(name, Date.now())
  }

  #timeEndListener = (name) => {
    if (this.#unfinished.has(name)) {
      const ms = Date.now() - this.#unfinished.get(name)
      this.#finished[name] = ms
      this.#unfinished.delete(name)
      log.timing(name, `Completed in ${ms}ms`)
    } else {
      log.silly('timing', "Tried to end timer that doesn't exist:", name)
    }
  }
}

module.exports = Timers
