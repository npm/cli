'use strict'

const Interceptor = require('./interceptor')
const util = require('util')
const cp = require('child_process')
const { spawn: originalSpawn } = cp

const _allowUnmatched = Symbol('allowUnmatched')
const _interceptors = Symbol('interceptors')
const _loaded = Symbol('loaded')
const _match = Symbol('match')
const _run = Symbol('run')

class Spawk {
  constructor () {
    this[_loaded] = false
    this[_allowUnmatched] = true
    this[_interceptors] = {
      spawn: []
    }
  }

  get loaded () {
    return this[_loaded]
  }

  get uncalled () {
    const uncalled = this[_interceptors].spawn.find((interceptor) => !interceptor.called)
    if (uncalled) {
      return `${uncalled}`
    }
  }

  load () {
    if (!this.loaded) {
      load()
      this[_loaded] = true
    }
  }

  unload () {
    if (this.loaded) {
      cp.spawn = originalSpawn
      this[_loaded] = false
      this.clean()
    }
  }

  allowUnmatched () {
    this[_allowUnmatched] = true
  }

  preventUnmatched () {
    this[_allowUnmatched] = false
  }

  done () {
    if (this.uncalled) {
      throw new Error(`Uncalled spawn interceptors found: ${this.uncalled}`)
    }
    return true
  }

  clean () {
    this[_interceptors].spawn = []
  }

  spawn (command, args, options) {
    if (!this.loaded) {
      throw new Error('Can not intercept spawn while unloaded')
    }
    if (!command) {
      throw new Error('You must specify the command to intercept')
    }
    const intercepted = new Interceptor(command, args, options)
    this[_interceptors].spawn.push(intercepted)
    return intercepted.api
  }

  [_match] (type, command, args, options) {
    for (const interceptor of this[_interceptors][type]) {
      if (interceptor.match(command, args, options)) {
        return interceptor
      }
    }
  }

  [_run] (type, command, args, options) {
    const interceptor = this[_match](type, command, args, options)
    if (interceptor) {
      return interceptor.run(command, args, options)
    }

    if (!this[_allowUnmatched]) {
      throw new Error(`spawk: Unmatched spawn(${command},${util.inspect(args)},${util.inspect(options)})`)
    }

    return originalSpawn.apply(null, Array.from(arguments).slice(1))
  }
}

const spawk = new Spawk()

const load = function () {
  cp.spawn = function (command, args, options) {
    return spawk[_run]('spawn', command, args, options)
  }
}

spawk.load()

module.exports = spawk
