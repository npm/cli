'use strict'
const process = require('../lib/process.js')
const path = require('path')
const cp = require('child_process')
const ownOr = require('own-or')
const Base = require('./base.js')
const cleanYamlObject = require('./clean-yaml-object.js')

class Spawn extends Base {
  constructor (options) {
    // figure out the name before calling super()
    options = options || {}
    const cwd = ownOr(options, 'cwd', process.cwd())
    const command = options.command
    if (!command)
      throw new TypeError('no command provided')
    const args = ownOr(options, 'args', [])

    options.name = options.name || Spawn.procName(cwd, command, args)

    super(options)

    this.command = options.command

    this.args = options.args
    // stdout must be a pipe
    if (options.stdio) {
      if (typeof options.stdio === 'string')
        this.stdio = [ options.stdio, 'pipe', options.stdio ]
      else
        this.stdio = options.stdio.slice(0)
    } else
      this.stdio = [ 0, 'pipe', 2 ]

    this.stdio[1] = 'pipe'
    options.stdio = this.stdio

    if (!options.env)
      options.env = process.env
    this.env = {
      ...(options.env),
      TAP_CHILD_ID: options.childId
        || options.env.TAP_CHILD_ID
        || /* istanbul ignore next */ 0,
      TAP: '1',
      TAP_BAIL: this.bail ? '1' : '0',
    }
    // prune off the extraneous bits so we're not logging the world
    this.options.env = Object.keys(this.options.env).reduce((env, k) => {
      if (process.env[k] !== this.options.env[k])
        env[k] = this.options.env[k]
      return env
    }, {})

    this.cwd = cwd
    options.cwd = this.cwd

    this.processDB = ownOr(options, 'processDB', null) || {
      spawn: async (name, ...rest) => cp.spawn(...rest)
    }
    delete options.processDB

    this.proc = null
  }

  endAll () {
    if (this.proc)
      this.proc.kill('SIGKILL')
    this.parser.abort('test unfinished')
    this.callCb()
  }

  main (cb) {
    this.cb = cb
    this.setTimeout(this.options.timeout)
    this.parser.on('comment', c => {
      const tomatch = c.match(/# timeout=([0-9]+)\n$/)
      if (tomatch)
        this.setTimeout(+tomatch[1])
    })
    const options = {
      ...(this.options),
      cwd: this.cwd,
      env: this.env,
      stdio: this.stdio,
    }
    Promise.resolve()
      .then(async () => {
        this.emit('preprocess', options)
        const proc = this.proc =
          await this.processDB.spawn(this.name, this.command, this.args, options)

        proc.stdout.pipe(this.parser)
        proc.on('close', (code, signal) => this.onprocclose(code, signal))
        proc.on('error', er => this.threw(er))
        this.emit('process', proc)
        if (this.parent)
          this.parent.emit('spawn', this)
      })
      .catch(er => {
        er.tapCaught = 'spawn'
        this.threw(er)
      })
  }

  callCb () {
    if (this.cb)
      this.cb()
    this.cb = null
  }

  threw (er, extra, proxy) {
    extra = Base.prototype.threw.call(this, er, extra, proxy)
    extra = cleanYamlObject(extra)
    // unhook entirely
    this.parser.abort(er.message, extra)
    if (this.proc) {
      this.proc.stdout.removeAllListeners('data')
      this.proc.stdout.removeAllListeners('end')
      this.proc.removeAllListeners('close')
      this.proc.kill('SIGKILL')
    }
    this.callCb()
  }

  onprocclose (code, signal) {
    this.debug('SPAWN close %j %s', code, signal)
    this.options.exitCode = code
    if (signal)
      this.options.signal = signal

    // spawn closing with no tests is treated as a skip.
    if (this.results && this.results.plan && this.results.plan.skipAll && !code && !signal)
      this.options.skip = this.results.plan.skipReason || true

    if (code || signal) {
      this.results.ok = false
      this.parser.ok = false
    }
    return this.callCb()
  }

  timeout (extra) {
    if (this.proc) {
      this.proc.kill('SIGTERM')
      const t = setTimeout(() => {
        if (!this.options.signal && this.options.exitCode === undefined) {
          Base.prototype.timeout.call(this, extra)
          this.proc.kill('SIGKILL')
        }
      }, 1000)
      t.unref()
    }
  }
}

Spawn.procName = (cwd, command, args) => (
  (command === process.execPath)
  ? path.basename(process.execPath) + ' ' + args.map(a =>
    a.indexOf(cwd) === 0 ?
      './' + a.substr(cwd.length + 1).replace(/\\/g, '/')
    : a).join(' ').trim()
  : command + ' ' + args.join(' ')
).replace(/\\/g, '/')

module.exports = Spawn
