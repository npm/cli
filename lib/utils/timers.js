const path = require('path')
const log = require('proc-log')
const mkdirp = require('mkdirp-infer-owner')
const fs = require('graceful-fs')
const EE = require('events')

const _timeListener = Symbol('timeListener')
const _timeEndListener = Symbol('timeEndListener')

class Timers extends EE {
  #unfinished = new Map()
  #finished = {}
  #EVENT_NAME = Symbol('__TIME__')

  constructor () {
    super()
    this.on()
  }

  get unfinished () {
    return this.#unfinished
  }

  // Convenience methods for start/stop timers
  time (name) {
    process.emit('time', name)
  }

  timeEnd (name) {
    process.emit('timeEnd', name)
  }

  on (listener) {
    if (listener) {
      super.on(this.#EVENT_NAME, listener)
    } else {
      process.on('time', this[_timeListener])
      process.on('timeEnd', this[_timeEndListener])
    }
  }

  off (listener) {
    if (listener) {
      super.off(this.#EVENT_NAME, listener)
    } else {
      this.removeAllListeners(this.#EVENT_NAME)
      process.off('time', this[_timeListener])
      process.off('timeEnd', this[_timeEndListener])
    }
  }

  writeFile ({ dir, command, logfile, version }) {
    try {
      const file = path.resolve(dir, '_timing.json')
      mkdirp.sync(dir)

      const data = JSON.stringify({
        command,
        logfile,
        version,
        ...this.#finished,
      })

      // XXX: we append line delimited json to this file...forever
      fs.appendFileSync(file, data + '\n')

      const st = fs.lstatSync(dir)
      fs.chownSync(dir, st.uid, st.gid)
      fs.chownSync(file, st.uid, st.gid)
    } catch (e) {
      log.warn('timing', 'could not write timing file', e)
    }
  }

  [_timeListener] = (name) => {
    this.#unfinished.set(name, Date.now())
  }

  [_timeEndListener] = (name) => {
    if (this.#unfinished.has(name)) {
      const ms = Date.now() - this.#unfinished.get(name)
      this.#finished[name] = ms
      this.#unfinished.delete(name)
      this.emit(this.#EVENT_NAME, name, ms)
    } else {
      log.silly('timing', "Tried to end timer that doesn't exist:", name)
    }
  }
}

module.exports = Timers
