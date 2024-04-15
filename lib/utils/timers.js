const EE = require('events')
const fs = require('fs')
const { log, time } = require('proc-log')

const INITIAL_TIMER = 'npm'

class Timers extends EE {
  file = null

  #unfinished = new Map()
  #finished = {}

  constructor () {
    super()
    this.on()
    time.start(INITIAL_TIMER)
    this.started = this.#unfinished.get(INITIAL_TIMER)
  }

  get unfinished () {
    return this.#unfinished
  }

  get finished () {
    return this.#finished
  }

  on () {
    process.on('time', this.#timeHandler)
  }

  off () {
    process.off('time', this.#timeHandler)
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

  #timeHandler = (level, name) => {
    const now = Date.now()
    switch (level) {
      case time.KEYS.start:
        this.#unfinished.set(name, now)
        break
      case time.KEYS.end: {
        if (this.#unfinished.has(name)) {
          const ms = now - this.#unfinished.get(name)
          this.#finished[name] = ms
          this.#unfinished.delete(name)
          log.timing(name, `Completed in ${ms}ms`)
        } else {
          log.silly('timing', "Tried to end timer that doesn't exist:", name)
        }
      }
    }
  }
}

module.exports = Timers
