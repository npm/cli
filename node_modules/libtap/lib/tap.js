'use strict'
const process = require('./process.js')
const fakeProcess = require('./fake-process.js')
const Domain = require('async-hook-domain')
const onExit = require('signal-exit')
const Test = require('./test.js')
const Stdin = require('./stdin.js')
const Spawn = require('./spawn.js')
const objToYaml = require('./obj-to-yaml.js')
const settings = require('../settings.js')

const _didPipe = Symbol('_didPipe')
const _unmagicPipe = Symbol('_unmagicPipe')

let processPatched = false
/* eslint-disable-next-line no-unused-vars -- created for side-effects */
const rootDomain = new Domain((er, type) => {
  if (!processPatched)
    throw er
  else {
    if (!er || typeof er !== 'object')
      er = { error: er }
    er.tapCaught = type
    tap.threw(er)
  }
})

/* istanbul ignore next */
if (!settings.output) {
  // Set exitCode in case process.stderr is also invalid
  process.exitCode = 1
  console.error('Output stream is invalid')
  process.exit(1)
}

const monkeypatchEpipe = () => {
  const emit = settings.output.emit
  settings.output.emit = function (ev, er = {}) {
    if (ev !== 'error' || er.code !== 'EPIPE')
      return emit.apply(settings.output, arguments)
  }
}

const monkeypatchExit = () => {
  /* istanbul ignore next - impossible to cover, but we do have a test
   * that verifies we don't try to call process.on if process is gone */
  if (global.process !== process) {
    return
  }

  const exit = process.exit
  const reallyExit = process.reallyExit

  // ensure that we always get run, even if a user does
  // process.on('exit', process.exit)
  process.reallyExit = code => reallyExit.call(process, onExitEvent(code))
  process.exit = code => exit.call(process, onExitEvent(code))
  process.on('beforeExit', onExitEvent)
  process.on('exit', onExitEvent)
}

class TAP extends Test {
  constructor (options) {
    super(options)
    this.runOnly = process.env.TAP_ONLY === '1'
    this.childId = +process.env.TAP_CHILD_ID
      || /* istanbul ignore next */ 0
    this.start = Date.now()
    this[_didPipe] = false
  }

  resume () {
    this[_unmagicPipe]()
    const ret = this.resume.apply(this, arguments)
    this.process()
    return ret
  }

  [_unmagicPipe] () {
    this[_didPipe] = true
    this.setTimeout(this.options.timeout)
    this.pipe = Test.prototype.pipe
    this.write = Test.prototype.write
    this.resume = Test.prototype.resume
  }

  setTimeout (n, quiet) {
    if (n && typeof n === 'number' && !quiet)
      this.write(`# timeout=${n}\n`)
    return super.setTimeout(n)
  }

  pipe () {
    this[_unmagicPipe]()
    const ret = this.pipe.apply(this, arguments)
    this.process()
    return ret
  }

  write (c, e) {
    // this resets write and pipe to standard values
    this.patchProcess()
    this.pipe(settings.output)
    return super.write(c, e)
  }

  patchProcess () {
    if (processPatched)
      return
    processPatched = true
    monkeypatchEpipe()
    monkeypatchExit()
  }

  onbeforeend () {
    if (this[_didPipe] && this.time && !this.bailedOut)
      this.emit('data', '# time=' + this.time + 'ms\n')
  }

  ondone () {
    return this.emitSubTeardown(this)
  }

  // Root test runner doesn't have the 'teardown' event, because it
  // isn't hooked into any parent Test as a harness.
  teardown (fn) {
    if (this.options.autoend !== false)
      this.autoend(true)
    return super.teardown(fn)
  }
}

let didOnExitEvent = false
const onExitEvent = code => {
  if (didOnExitEvent)
    return process.exitCode

  didOnExitEvent = true

  if (!tap.results)
    tap.endAll()

  if (tap.results && !tap.results.ok && code === 0)
    process.exitCode = 1

  return process.exitCode || code || 0
}


const opt = { name: 'TAP' }
if (process.env.TAP_DEBUG === '1' ||
    /\btap\b/.test(process.env.NODE_DEBUG || ''))
  opt.debug = true

if (process.env.TAP_GREP) {
  opt.grep = process.env.TAP_GREP.split('\n').map(g => {
    const p = g.match(/^\/(.*)\/([a-z]*)$/)
    g = p ? p[1] : g
    const flags = p ? p[2] : ''
    return new RegExp(g, flags)
  })
}

if (process.env.TAP_GREP_INVERT === '1')
  opt.grepInvert = true

if (process.env.TAP_ONLY === '1')
  opt.only = true

const tap = new TAP(opt)

module.exports = tap.default = tap.t = tap

tap.Test = Test
tap.Spawn = Spawn
tap.Stdin = Stdin

// SIGTERM means being forcibly killed, almost always by timeout
let didTimeoutKill = false
onExit((code, signal) => {
  if (signal !== 'SIGTERM' || !tap[_didPipe] || didTimeoutKill)
    return

  const handles = process._getActiveHandles().filter(h =>
    h !== settings.output &&
    h !== process.stdout &&
    h !== process.stdin &&
    h !== process.stderr
  )
  const requests = process._getActiveRequests()

  const extra = {
    at: null,
    signal: signal
  }
  if (requests.length) {
    extra.requests = requests.map(r => {
      const ret = {}
      ret.type = r.constructor.name

      // most everything in node has a context these days
      /* istanbul ignore else */
      if (r.context)
        ret.context = r.context

      return ret
    })
  }

  // Newer node versions don't have this as reliably.
  /* istanbul ignore next */
  if (handles.length) {
    extra.handles = handles.map(h => {
      const ret = {}
      ret.type = h.constructor.name

      // all of this is very internal-ish
      /* istanbul ignore next */
      if (h.msecs)
        ret.msecs = h.msecs

      /* istanbul ignore next */
      if (h._events)
        ret.events = Object.keys(h._events)

      /* istanbul ignore next */
      if (h._sockname)
        ret.sockname = h._sockname

      /* istanbul ignore next */
      if (h._connectionKey)
        ret.connectionKey = h._connectionKey

      return ret
    })
  }

  // this is impossible to cover, because it happens after nyc has
  // already done its stuff.
  /* istanbul ignore else */
  if (!tap.results && tap.timeout)
    tap.timeout(extra)
  else {
    console.error('possible timeout: SIGTERM received after tap end')
    if (extra.handles || extra.requests) {
      delete extra.signal
      if (!extra.at) {
        delete extra.at
      }
      console.error(objToYaml(extra))
    }
    didTimeoutKill = true
    process.kill(process.pid, 'SIGTERM')
  }
})
