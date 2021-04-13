'use strict'

const assert = require('assert')
const util = require('util')
const {AsyncResource} = require('async_hooks')
const MiniPass = require('minipass')
const Domain = require('async-hook-domain')
const Parser = require('tap-parser')
const ownOr = require('own-or')
const ownOrEnv = require('own-or-env')
const extraFromError = require('./extra-from-error.js')

class TapWrap extends AsyncResource {
  constructor (test) {
    super('tap.' + test.constructor.name)
    this.test = test
  }
}

class Base extends MiniPass {
  constructor (options) {
    options = options || {}
    super(options)

    this.started = false

    // establish the wrapper resource to limit the domain to this one object
    this.hook = new TapWrap(this)
    this.hook.runInAsyncScope(() =>
      this.hookDomain = new Domain((er, type) => {
        if (!er || typeof er !== 'object')
          er = { error: er }
        er.tapCaught = type
        this.threw(er)
      }))

    this.start = 0
    this.hrtime = null
    this.time = null
    this.timer = null
    this.readyToProcess = false
    this.options = options
    this.grep = ownOr(options, 'grep', [])
    this.grepInvert = ownOr(options, 'grepInvert', false)
    this.parent = ownOr(options, 'parent', null)
    this.bail = ownOrEnv(options, 'bail', 'TAP_BAIL', true)
    this.saveFixture = ownOrEnv(options, 'saveFixture', 'TAP_SAVE_FIXTURE', true)
    const name = (ownOr(options, 'name', '') || '').replace(/[\n\r\s\t]/g, ' ')
    Object.defineProperty(this, 'name', {
      value: name,
      writable: false,
      enumerable: true,
      configurable: false,
    })
    this.indent = ownOr(options, 'indent', '')
    this.silent = !!options.silent
    this.buffered = !!options.buffered || !!options.silent
    this.finished = false
    this.strict = ownOrEnv(options, 'strict', 'TAP_STRICT', true)
    this.omitVersion = !!options.omitVersion
    this.preserveWhitespace = ownOr(options, 'preserveWhitespace', true)
    this.jobs = +ownOrEnv(options, 'jobs', 'TAP_JOBS') || 0
    this.runOnly = ownOrEnv(options, 'runOnly', 'TAP_ONLY', true)
    this.setupParser(options)
    this.finished = false
    this.output = ''
    this.results = null
    this.bailedOut = false
    this.childId = +ownOrEnv(options, 'childId', 'TAP_CHILD_ID')
      || /* istanbul ignore next */ 0
    const skip = ownOr(options, 'skip', false)
    const todo = ownOr(options, 'todo', false)
    if (skip || todo)
      this.main = Base.prototype.main

    this.counts = {
      total: 0,
      pass: 0,
      fail: 0,
      skip: 0,
      todo: 0,
    }

    const ctx = ownOr(options, 'context', null)
    delete options.context
    this.context = typeof ctx === 'object' || ctx instanceof Object
      ? Object.create(ctx) : ctx

    this.lists = {
      fail: [],
      todo: [],
      skip: [],
    }

    const doDebug = typeof options.debug === 'boolean' ? options.debug
      : /\btap\b/i.test(process.env.NODE_DEBUG || '')

    if (doDebug)
      this.debug = debug(this.name)
  }

  passing () {
    return this.parser.ok
  }

  setTimeout (n) {
    if (!this.hrtime)
      this.hrtime = process.hrtime()

    if (!this.start)
      this.start = Date.now()

    if (!n) {
      clearTimeout(this.timer)
      this.timer = null
    } else {
      if (this.timer)
        clearTimeout(this.timer)

      this.timer = setTimeout(() => this.timeout(), n)
      this.timer.duration = n
      this.timer.unref()
    }
  }

  threw (er, extra, proxy) {
    this.hook.emitDestroy()
    this.hookDomain.destroy()
    if (!er || typeof er !== 'object')
      er = { error: er }
    if (this.name && !proxy)
      er.test = this.name

    const message = er.message

    if (!extra)
      extra = extraFromError(er, extra, this.options)

    if (this.results) {
      this.results.ok = false
      if (this.parent)
        this.parent.threw(er, extra, true)
      else if (!er.stack)
        console.error(er)
      else {
        if (message)
          er.message = message
        delete extra.stack
        delete extra.at
        console.error('%s: %s', er.name || 'Error', message)
        console.error(er.stack.split(/\n/).slice(1).join('\n'))
        console.error(extra)
      }
    } else
      this.parser.ok = false

    return extra
  }

  timeout (options) {
    this.setTimeout(false)
    options = options || {}
    options.expired = options.expired || this.name
    this.emit('timeout', this.threw(new Error('timeout!'), options))
  }

  runMain (cb) {
    this.started = true
    this.hook.runInAsyncScope(this.main, this, cb)
  }

  main (cb) {
    cb()
  }

  online (line) {
    this.debug('LINE %j', line)
    return this.write(this.indent + line)
  }

  write (c, e) {
    assert.equal(typeof c, 'string')
    assert.equal(c.substr(-1), '\n')

    if (this.buffered) {
      this.output += c
      return true
    }

    return super.write(c, e)
  }

  onbail (reason) {
    this.bailedOut = reason || true
    this.emit('bailout', reason)
  }

  oncomplete (results) {
    if (this.hrtime) {
      this.hrtime = process.hrtime(this.hrtime)
      this.time = results.time ||
        Math.round(this.hrtime[0] * 1e6 + this.hrtime[1] / 1e3) / 1e3
    }

    this.debug('ONCOMPLETE %j %j', this.name, results)

    if (this.results)
      Object.keys(this.results)
        .forEach(k => results[k] = this.results[k])

    this.results = results
    this.emit('complete', results)
    const failures = results.failures
      .filter(f => f.tapError)
      .map(f => {
        delete f.diag
        delete f.ok
        return f
      })

    if (failures.length)
      this.options.failures = failures

    this.onbeforeend()
    // if we're piping, and buffered, then it means we need to hold off
    // on emitting 'end' and calling ondone() until the pipes clear out.
    if (this.pipes.length && this.buffer.length)
      super.end()
    else
      this.emit('end')
  }

  onbeforeend () {}
  ondone () {}

  emit (ev, data) {
    if (ev === 'end') {
      const ret = super.emit(ev, data)
      this.ondone()
      this.hook.emitDestroy()
      this.hookDomain.destroy()
      return ret
    } else
      return super.emit(ev, data)
  }

  setupParser (options) {
    this.parser = options.parser || new Parser({
      bail: this.bail,
      strict: this.strict,
      omitVersion: this.omitVersion,
      preserveWhitespace: this.preserveWhitespace,
      name: this.name,
    })
    this.parser.on('line', l => this.online(l))
    this.parser.once('bailout', reason => this.onbail(reason))
    this.parser.on('complete', result => this.oncomplete(result))

    this.parser.on('result', () => this.counts.total++)
    this.parser.on('pass', () => this.counts.pass++)
    this.parser.on('todo', res => {
      this.counts.todo++
      this.lists.todo.push(res)
    })
    this.parser.on('skip', res => {
      // it is uselessly noisy to print out lists of tests skipped
      // because of a --grep or --only argument.
      if (/^filter: (only|\/.*\/)$/.test(res.skip))
        return

      this.counts.skip++
      this.lists.skip.push(res)
    })
    this.parser.on('fail', res => {
      this.counts.fail++
      this.lists.fail.push(res)
    })
  }

  [util.inspect.custom] () {
    return this.constructor.name + ' ' + util.inspect({
      name: this.name,
      time: this.time,
      hrtime: this.hrtime,
      jobs: this.jobs,
      buffered: this.buffered,
      occupied: this.occupied,
      pool: this.pool,
      queue: this.queue,
      subtests: this.subtests,
      output: this.output,
      skip: ownOr(this.options, 'skip', false),
      todo: ownOr(this.options, 'todo', false),
      only: ownOr(this.options, 'only', false),
      results: this.results,
      options: [
        'autoend',
        'command',
        'args',
        'stdio',
        'env',
        'cwd',
        'exitCode',
        'signal',
        'expired',
        'timeout',
        'at',
        'skip',
        'todo',
        'only',
        'runOnly'
      ].filter(k => this.options[k] !== undefined)
        .reduce((s, k) => (s[k] = this.options[k], s), {})
    })
  }

  debug () {}

}

const debug = name => (...args) => {
  const prefix = `TAP ${process.pid} ${name}: `
  const msg = util.format(...args).trim()
  console.error(prefix + msg.split('\n').join(`\n${prefix}`))
}

module.exports = Base
