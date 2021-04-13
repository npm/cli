'use strict'
// We need TWO queues (work and subtest) and one jobs pool
//
// The pool stores buffered subtests being run in parallel.
//
// When new subtests are created, they get put in the work queue and also
// in the subtests queue if they are buffered and jobs>0.  When we put a
// test in the subtest queue, we also process it.
//
// Processing the subtest queue means moving tests into the jobs pool until
// the jobs pool length is at this.jobs
//
// Any output functions get put in the work queue if its length > 0 (ie,
// no cutting the line)
//
// Processing the work queue means walking until we run out of things, or
// encounter an unfinished test.  When we encounter ANY kind of test, we
// block until its output is completed, dumping it all into the parser.

const path = require('path')
const assert = require('assert')
const util = require('util')

const {format, same, strict, match, has, hasStrict} = require('tcompare')
const Deferred = require('trivial-deferred')
const loop = require('function-loop')
const Pool = require('yapool')
const ownOr = require('own-or')
const ownOrEnv = require('own-or-env')
const bindObj = require('bind-obj-methods')

const Base = require('./base.js')
const Spawn = require('./spawn.js')
const Stdin = require('./stdin.js')
const TestPoint = require('./point.js')
const parseTestArgs = require('./parse-test-args.js')
const Fixture = require('./fixture.js')
const Mock = require('./mock.js')
const cleanYamlObject = require('./clean-yaml-object.js')
const extraFromError = require('./extra-from-error.js')
const stack = require('./stack.js')
const settings = require('../settings.js')
const Snapshot = require('./snapshot.js')
const Waiter = require('./waiter.js')
const findMainScript = require('./find-main-script.js')

const formatSnapshotDefault = obj => format(obj, { sort: true })
const cwd = process.cwd()

// A sigil object for implicit end() calls that should not
// trigger an error if the user then calls t.end()
const IMPLICIT = Symbol('implicit t.end()')

// Sigil to put in the queue to signal the end of all things
const EOF = Symbol('EOF')

const _currentAssert = Symbol('_currentAssert')
const _end = Symbol('_end')
const _snapshot = Symbol('_snapshot')
const _getSnapshot = Symbol('_getSnapshot')
const _beforeEnd = Symbol('_beforeEnd')
const _emits = Symbol('_emits')
const _nextChildId = Symbol('_nextChildId')
const _expectUncaught = Symbol('_expectUncaught')
const _createdFixture = Symbol('_createdFixture')
const _beforeCalled = Symbol('_beforeCalled')
const _printedResult = Symbol('_printedResult')

const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj, key)

const isRegExp = re =>
  Object.prototype.toString.call(re) === '[object RegExp]'

const normalizeMessageExtra = (defaultMessage, message, extra) => {
  if (message && typeof message === 'object') {
    return [defaultMessage, message]
  }

  return [
    message || defaultMessage,
    extra || {}
  ]

}

class Test extends Base {
  constructor (options) {
    options = options || {}
    super(options)

    const cmp = ownOr(options, 'compareOptions', undefined)
    this.compareOptions = cmp && typeof cmp === 'object'
      ? Object.create(cmp) : {}

    this[_nextChildId] = 1
    this.pushedEnd = false
    this.jobs = ownOr(options, 'jobs', 1)

    this.doingStdinOnly = false
    this.onTeardown = []
    this[_createdFixture] = false
    this.subtests = []
    this.pool = new Pool()
    this.queue = ['TAP version 13\n']

    // snapshots are keyed off of the main file that loads the
    // root test object. Typically, this is the TAP object.
    // To do this, we climb the ladder and only save in the teardown
    // of that root (parentless) test object.  This allows handling
    // cases where the same test name can be used multiple times
    // in a single test file, which would otherwise clobber snapshots.
    this.writeSnapshot = ownOrEnv(
      options, 'snapshot', 'TAP_SNAPSHOT', true)

    if (this.parent && this.parent.cleanSnapshot)
      this.cleanSnapshot = this.parent.cleanSnapshot

    this.formatSnapshot = this.parent && this.parent.formatSnapshot

    this.noparallel = false
    if (options.cb)
      this.cb = (...args) => this.hook.runInAsyncScope(options.cb, this, ...args)

    this.occupied = false
    this[_currentAssert] = null
    this[_beforeEnd] = []
    this.count = 0
    this.n = 0
    this.ended = false
    this.explicitEnded = false
    this.multiEndThrew = false
    this.assertAt = null
    this.assertStack = null
    this.planEnd = -1
    this.onBeforeEach = []
    this.onAfterEach = []
    this.ranAfterEach = false

    this[_expectUncaught] = []

    // bind all methods to this object, so we can pass t.end as a callback
    // and do `const test = require('tap').test` like people do.
    const bound = Object.create(null)
    bindObj(this, this, bound)
    bindObj(this, Object.getPrototypeOf(this), bound)
    bindObj(this, Test.prototype, bound)
  }

  spawn (cmd, args, options, name) {
    if (typeof args === 'string')
      args = [ args ]

    args = args || []

    if (typeof options === 'string') {
      name = options
      options = {}
    }

    options = options || {}
    options.name = ownOr(options, 'name', name)
    options.command = cmd
    options.args = args

    return this.sub(Spawn, options, Test.prototype.spawn)
  }

  sub (Class, extra, caller) {
    if (this.bailedOut)
      return

    if (this.doingStdinOnly)
      throw new Error('cannot run subtests in stdinOnly mode')

    if (this.results || this.ended) {
      const er = new Error('cannot create subtest after parent test end')
      Error.captureStackTrace(er, caller)
      this.threw(er)
      return Promise.resolve(this)
    }

    extra.childId = this[_nextChildId]++

    if (!extra.skip && this.grep.length) {
      const m = this.grep[0].test(extra.name)
      const match = this.grepInvert ? !m : m
      if (!match) {
        const p = 'filter' + (this.grepInvert ? ' out' : '') + ': '
        extra.skip = p + this.grep[0]
      }
    }

    if (extra.only && !this.runOnly)
      this.comment('%j has `only` set but all tests run', extra.name)

    if (this.runOnly && !extra.only)
      extra.skip = 'filter: only'

    if (extra.todo || extra.skip) {
      this.pass(extra.name, extra)
      return Promise.resolve(this)
    }

    if (!extra.grep) {
      extra.grep = this.grep.slice(1)
      extra.grepInvert = this.grepInvert
    }

    extra.indent = '    '
    if (this.jobs > 1 && process.env.TAP_BUFFER === undefined)
      extra.buffered = ownOr(extra, 'buffered', true)
    else
      extra.buffered = ownOrEnv(extra, 'buffered', 'TAP_BUFFER', true)

    extra.bail = ownOr(extra, 'bail', this.bail)
    extra.saveFixture = ownOr(extra, 'saveFixture', this.saveFixture)
    extra.parent = this
    extra.stack = stack.captureString(80, caller)
    extra.context = this.context
    extra.compareOptions = this.compareOptions
    const t = new Class(extra)

    this.queue.push(t)
    this.subtests.push(t)
    this.emit('subtestAdd', t)

    const d = new Deferred()
    t.deferred = d
    this.process()
    return d.promise
  }

  todo (name, extra, cb) {
    extra = parseTestArgs(name, extra, cb)
    extra.todo = extra.todo || true
    return this.sub(Test, extra, Test.prototype.todo)
  }

  skip (name, extra, cb) {
    extra = parseTestArgs(name, extra, cb)
    extra.skip = extra.skip || true
    return this.sub(Test, extra, Test.prototype.skip)
  }

  only (name, extra, cb) {
    extra = parseTestArgs(name, extra, cb)
    extra.only = true
    return this.sub(Test, extra, Test.prototype.only)
  }

  test (name, extra, cb) {
    extra = parseTestArgs(name, extra, cb)
    return this.sub(Test, extra, Test.prototype.test)
  }

  stdinOnly (extra) {
    const stream = extra && extra.tapStream || process.stdin
    if (this.queue.length !== 1 ||
        this.queue[0] !== 'TAP version 13\n' ||
        this.processing ||
        this.results ||
        this.occupied ||
        this.pool.length ||
        this.subtests.length)
      throw new Error('Cannot use stdinOnly on a test in progress')

    this.doingStdinOnly = true
    this.queue.length = 0
    this.parser.on('child', p => {
      // pretend to be a rooted parser, so it gets counts.
      p.root = p
      const t = new Base({
        name: p.name,
        parent: this,
        parser: p,
        root: p,
        bail: p.bail,
        strict: p.strict,
        omitVersion: p.omitVersion,
        preserveWhitespace: p.preserveWhitespace,
        childId: this[_nextChildId]++,
      })
      this.emit('subtestAdd', t)
      this.emit('subtestStart', t)
      this.emit('subtestProcess', t)
      p.on('complete', () => {
        t.time = p.time
        this.emit('subtestEnd', t)
      })
    })
    stream.pause()
    stream.pipe(this.parser)
    stream.resume()
  }

  stdin (name, extra) {
    extra = parseTestArgs(name, extra, false, '/dev/stdin')
    return this.sub(Stdin, extra, Test.prototype.stdin)
  }

  bailout (message) {
    if (this.parent && (this.results || this.ended))
      this.parent.bailout(message)
    else {
      this.process()
      message = message ? ' ' + ('' + message).trim() : ''
      message = message.replace(/[\r\n]/g, ' ')
      this.parser.write('Bail out!' + message + '\n')
    }
    this.end(IMPLICIT)
    this.process()
  }

  comment (...args) {
    const body = util.format(...args)
    const message = '# ' + body.split(/\r?\n/).join('\n# ') + '\n'

    if (this.results)
      this.write(message)
    else
      this.queue.push(message)
    this.process()
  }

  timeout (options) {
    options = options || {}
    options.expired = options.expired || this.name
    if (this.occupied && this.occupied.timeout)
      this.occupied.timeout(options)
    else
      Base.prototype.timeout.call(this, options)
    this.end(IMPLICIT)
  }

  main (cb) {
    this.setTimeout(this.options.timeout)
    this.debug('MAIN pre', this)

    const end = () => {
      this.debug(' > implicit end for promise')
      this.end(IMPLICIT)
      done()
    }

    const done = (er) => {
      if (er)
        this.threw(er)

      if (this.results || this.bailedOut)
        cb()
      else
        this.ondone = cb
    }

    // This bit of overly clever line-noise wraps the call to user-code
    // in a try-catch. We can't rely on the domain for this yet, because
    // the 'end' event can trigger a throw after the domain is unhooked,
    // but before this is no longer the official "active test"
    const ret = (() => {
      try {
        return this.cb(this)
      } catch (er) {
        if (!er || typeof er !== 'object')
          er = { error: er }
        er.tapCaught = 'testFunctionThrow'
        this.threw(er)
      }
    })()

    if (ret && ret.then) {
      this.promise = ret
      ret.tapAbortPromise = done
      ret.then(end, er => {
        if (!er || typeof er !== 'object')
          er = { error: er }
        er.tapCaught = 'returnedPromiseRejection'
        done(er)
      })
    } else
      done()

    this.debug('MAIN post', this)
  }

  process () {
    if (this.processing)
      return this.debug(' < already processing')

    this.debug('\nPROCESSING(%s)', this.name, this.queue.length)
    this.processing = true

    while (!this.occupied) {
      const p = this.queue.shift()
      if (!p)
        break
      if (p instanceof Base) {
        this.processSubtest(p)
      } else if (p === EOF) {
        this.debug(' > EOF', this.name)
        // I AM BECOME EOF, DESTROYER OF STREAMS
        if (this.writeSnapshot)
          this[_getSnapshot]().save()
        this.parser.end()
      } else if (p instanceof TestPoint) {
        this.debug(' > TESTPOINT')
        this.parser.write(p.ok + (++this.n) + p.message)
      } else if (typeof p === 'string') {
        this.debug(' > STRING')
        this.parser.write(p)
      } else if (p instanceof Waiter) {
        p.ready = true
        this.occupied = p
        p.finish()
      } else {
        /* istanbul ignore else */
        if (Array.isArray(p)) {
          this.debug(' > METHOD')
          const m = p.shift()
          const ret = this[m].apply(this, p)
          if (ret && typeof ret.then === 'function') {
            // returned promise
            ret.then(() => {
              this.processing = false
              this.process()
            }, er => {
              this.processing = false
              this.threw(er)
            })
            return
          }
        } else {
          throw new Error('weird thing got in the queue')
        }
      }
    }

    while (!this.noparallel && this.pool.length < this.jobs) {
      const p = this.subtests.shift()
      if (!p)
        break

      if (!p.buffered) {
        this.noparallel = true
        break
      }

      this.debug('start subtest', p)
      this.emit('subtestStart', p)
      this.pool.add(p)
      if (this.bailedOut)
        this.onbufferedend(p)
      else
        this.runBeforeEach(p, () =>
          p.runMain(() => this.onbufferedend(p)))
    }

    this.debug('done processing', this.queue, this.occupied)
    this.processing = false

    // just in case any tests ended, and we have sync stuff still
    // waiting around in the queue to be processed
    if (!this.occupied && this.queue.length)
      this.process()

    this.maybeAutoend()
  }

  processSubtest (p) {
    this.debug(' > subtest')
    this.occupied = p
    if (!p.buffered) {
      this.emit('subtestStart', p)
      this.debug(' > subtest indented')
      p.pipe(this.parser, { end: false })
      this.runBeforeEach(p, () =>
        this.writeSubComment(p, () =>
          p.runMain(() => this.onindentedend(p))))
    } else if (p.readyToProcess) {
      this.emit('subtestProcess', p)
      this.debug(' > subtest buffered, finished')
      // finished!  do the thing!
      this.occupied = null
      if (!p.passing() || !p.silent) {
        this.queue.unshift(['emitSubTeardown', p])
        this.printResult(p.passing(), p.name, p.options, true)
      }
    } else {
      this.occupied = p
      this.debug(' > subtest buffered, unfinished', p)
      // unfinished buffered test.
      // nothing to do yet, just leave it there.
      this.queue.unshift(p)
    }
  }

  emitSubTeardown (p) {
    // if it's not a thing that CAN have teardowns, nothing to do here
    if (!p.onTeardown)
      return

    const otd = p.onTeardown
    p.onTeardown = []
    const threw = er => {
      if (!er || typeof er !== 'object')
        er = { error: er }
      er.tapCaught = 'teardown'
      delete p.options.time
      p.threw(er)
    }
    for (let i = 0; i < otd.length; i++) {
      const fn = otd[i]
      try {
        const ret = fn.call(p)
        if (ret && typeof ret.then === 'function') {
          p.onTeardown = otd.slice(i + 1)
          this.queue.unshift(['emitSubTeardown', p])
          return ret.then(() => this.emitSubTeardown(p), er => {
            if (!er || typeof er !== 'object')
              er = { error: er }
            er.tapCaught = 'teardown'
            throw er
          })
        }
      } catch (er) {
        threw(er)
      }
    }

    // ok we're done, just delete the fixture if it created one.
    // do this AFTER all user-generated teardowns, and asynchronously so
    // that we can do the fancy backoff dance for Win32's weirdo fs.
    if (p[_createdFixture]) {
      const {rmdirRecursive} = settings
      return new Promise((res, rej) => {
        rmdirRecursive(p[_createdFixture], er =>
          er ? /* istanbul ignore next - rimraf never fails lol */ rej(er)
          : res())
      }).then(() => p.emit('teardown'))
    } else
      p.emit('teardown')
  }

  writeSubComment (p, cb) {
    const comment = '# Subtest' +
      (p.name ? ': ' + p.name : '') +
      '\n'
    this.parser.write(comment)
    cb()
  }

  onbufferedend (p) {
    delete p.ondone
    p.results = p.results || {}
    p.readyToProcess = true
    const to = p.options.timeout
    const dur = (to && p.passing()) ? Date.now() - p.start : null
    if (dur && dur > to)
      p.timeout()
    else
      p.setTimeout(false)
    this.debug('%s.onbufferedend', this.name, p.name, p.results.bailout)
    this.pool.remove(p)
    p.options.tapChildBuffer = p.output || ''
    p.options.stack = ''
    if (p.time)
      p.options.time = p.time
    if (this.occupied === p)
      this.occupied = null
    p.deferred.resolve(p.results)
    this.emit('subtestEnd', p)
    this.process()
  }

  onindentedend (p) {
    this.emit('subtestProcess', p)
    delete p.ondone
    this.debug('onindentedend', p)
    this.noparallel = false
    const sti = this.subtests.indexOf(p)
    if (sti !== -1)
      this.subtests.splice(sti, 1)
    p.readyToProcess = true
    p.options.time = p.time
    const to = p.options.timeout
    const dur = (to && p.passing()) ? Date.now() - p.start : null
    if (dur && dur > to)
      p.timeout()
    else
      p.setTimeout(false)
    this.debug('onindentedend %s(%s)', this.name, p.name)
    this.occupied = null
    this.debug('OIE(%s) b>shift into queue', this.name, this.queue)
    p.options.stack = ''

    this.queue.unshift(['emitSubTeardown', p])
    this.printResult(p.passing(), p.name, p.options, true)

    this.debug('OIE(%s) shifted into queue', this.name, this.queue)
    p.deferred.resolve(p.results)
    this.emit('subtestEnd', p)
    this.process()
  }

  addAssert (name, length, fn) {
    if (!name)
      throw new TypeError('name is required for addAssert')

    if (!(typeof length === 'number' && length >= 0))
      throw new TypeError('number of args required')

    if (typeof fn !== 'function')
      throw new TypeError('function required for addAssert')

    if (Test.prototype[name] || this[name])
      throw new TypeError('attempt to re-define `' + name + '` assert')

    const ASSERT = function (...args) {
      this.currentAssert = ASSERT
      args.splice(length, 0, ...normalizeMessageExtra('', ...args.splice(length, 2)))

      return fn.apply(this, args)
    }
    this[name] = ASSERT
  }

  static addAssert (name, length, fn) {
    this.prototype.addAssert(name, length, fn)
  }

  printResult (ok, message, extra, front) {
    this[_printedResult] = true

    if (this.doingStdinOnly)
      throw new Error('cannot print results in stdinOnly mode')
    const n = this.count + 1
    this.currentAssert = Test.prototype.printResult
    const fn = this[_currentAssert]
    this[_currentAssert] = null

    if (this.planEnd !== -1 && n > this.planEnd) {
      if (!this.passing())
        return

      const failMessage = this.explicitEnded
          ? 'test after end() was called'
          : 'test count exceeds plan'

      const er = new Error(failMessage)
      Error.captureStackTrace(er, fn)
      er.test = this.name
      er.plan = this.planEnd
      this.threw(er)
      return
    }

    extra = extra || {}

    if (extra.expectFail)
      ok = !ok

    if (this.assertAt) {
      extra.at = this.assertAt
      this.assertAt = null
    }

    if (this.assertStack) {
      extra.stack = this.assertStack
      this.assertStack = null
    }

    if (hasOwn(extra, 'stack') && !hasOwn(extra, 'at'))
      extra.at = stack.parseLine(extra.stack.split('\n')[0])

    if (!ok && !extra.skip && !hasOwn(extra, 'at')) {
      assert.equal(typeof fn, 'function')
      extra.at = stack.at(fn)
      if (!extra.todo)
        extra.stack = stack.captureString(80, fn)
    }

    const diagnostic =
      typeof extra.diagnostic === 'boolean' ? extra.diagnostic
      : process.env.TAP_DIAG === '0' ? false
      : process.env.TAP_DIAG === '1' ? true
      : extra.skip ? false
      : !ok

    if (diagnostic)
      extra.diagnostic = true

    this.count = n
    message = message + ''
    const res = { ok, message, extra }

    const output = new TestPoint(ok, message, extra)
    // when we jump the queue, skip an extra line
    if (front)
      output.message = output.message.trimRight() + '\n\n'

    if (this.occupied && this.occupied instanceof Waiter &&
        this.occupied.finishing)
      front = true

    if (front) {
      this.emit('result', res)
      this.parser.write(output.ok + (++this.n) + output.message)
      if (this.bail && !ok && !extra.skip && !extra.todo)
        this.parser.write('Bail out! ' + message + '\n')
    } else {
      this.queue.push(['emit', 'result', res], output)
      if (this.bail && !ok && !extra.skip && !extra.todo)
        this.queue.push('Bail out! ' + message + '\n')
    }

    if (this.planEnd === this.count)
      this.end(IMPLICIT)

    this.process()
  }

  pragma (set) {
    const p = Object.keys(set).reduce((acc, i) =>
      acc + 'pragma ' + (set[i] ? '+' : '-') + i + '\n', '')
    this.queue.push(p)
    this.process()
  }

  plan (n, comment) {
    if (this.bailedOut)
      return

    if (this.planEnd !== -1) {
      throw new Error('Cannot set plan more than once')
    }

    if (typeof n !== 'number' || n < 0) {
      throw new TypeError('plan must be a number')
    }

    // Cannot get any tests after a trailing plan, or a plan of 0
    const ending = this.count !== 0 || n === 0

    if (n === 0 && comment && !this.options.skip)
      this.options.skip = comment

    this.planEnd = n
    comment = comment ? ' # ' + comment.trim() : ''
    this.queue.push('1..' + n + comment + '\n')

    if (ending)
      this.end(IMPLICIT)
    else
      this.process()
  }

  end (implicit) {
    if (this.doingStdinOnly && implicit !== IMPLICIT)
      throw new Error('cannot explicitly end while in stdinOnly mode')
    this.debug('END implicit=%j', implicit === IMPLICIT)
    if (this.ended && implicit === IMPLICIT)
      return

    if (this[_beforeEnd].length) {
      for (let b = 0; b < this[_beforeEnd].length; b++) {
        const m = this[_beforeEnd][b].shift()
        this[m].apply(this, this[_beforeEnd][b])
      }
      this[_beforeEnd].length = 0
    }

    // beyond here we have to be actually done with things, or else
    // the semantic checks on counts and such will be off.
    if (!queueEmpty(this) || this.occupied) {
      if (!this.pushedEnd)
        this.queue.push(['end', implicit])
      this.pushedEnd = true
      return this.process()
    }

    if (!this.ranAfterEach && this.parent) {
      this.ranAfterEach = true
      this.parent.runAfterEach(this, () => this[_end](implicit))
      return
    } else
      this[_end](implicit)
  }

  [_end] (implicit) {
    this.ended = true

    if (implicit !== IMPLICIT && !this.multiEndThrew) {
      if (this.explicitEnded) {
        this.multiEndThrew = true
        const er = new Error('test end() method called more than once')
        Error.captureStackTrace(er, this[_currentAssert] ||
          Test.prototype[_end])
        er.test = this.name
        this.threw(er)
        return
      }
      this.explicitEnded = true
    }

    if (this.planEnd === -1) {
      this.debug('END(%s) implicit plan', this.name, this.count)
      this.plan(this.count)
    }

    this.queue.push(EOF)

    if (this[_expectUncaught].length) {
      const wanted = this[_expectUncaught]
      this[_expectUncaught] = []
      const diag = {
        wanted: wanted.map(a => a.filter(e => e != null)),
        test: this.name,
        at: null,
        stack: null,
      }
      const msg = 'test end without expected uncaught exceptions'
      this.queue.push(['threw', Object.assign(new Error(msg), diag)])
    }
    this.process()
  }

  threw (er, extra, proxy) {
    // this can only happen if a beforeEach function raises an error
    if (this.parent && !this.started) {
      this.cb = () => {
        this.threw(er)
        this.end()
      }
      return
    }

    if (!er || typeof er !== 'object')
      er = { error: er }

    if (this[_expectUncaught].length && er.tapCaught === 'uncaughtException') {
      const [wanted, message, extra] = this[_expectUncaught].shift()
      const actual = isRegExp(wanted) ? er.message : er
      return wanted
        ? this.match(actual, wanted, message, extra)
        : this.pass(message, extra)
    }

    if (this.name && !proxy)
      er.test = this.name
    if (!proxy)
      extra = extraFromError(er, extra, this.options)
    Base.prototype.threw.call(this, er, extra, proxy)

    if (!this.results) {
      this.fail(extra.message || er.message, extra)
      if (!proxy)
        this.end(IMPLICIT)
    }
    // threw while waiting for a promise to resolve.
    // probably it's not ever gonna.
    if (this.occupied && this.occupied instanceof Waiter)
      this.occupied.abort(Object.assign(
        new Error('error thrown while awaiting Promise'),
        { thrown: er }
      ))

    this.process()
  }

  runBeforeEach (who, cb) {
    if (this.parent)
      this.parent.runBeforeEach(who, () => {
        loop(who, this.onBeforeEach, cb, er => {
          who.threw(er)
          cb()
        })
      })
    else
      loop(who, this.onBeforeEach, cb, er => {
        who.threw(er)
        cb()
      })
  }

  runAfterEach (who, cb) {
    loop(who, this.onAfterEach, () => {
      if (this.parent)
        this.parent.runAfterEach(who, cb)
      else
        cb()
    }, who.threw)
  }

  beforeEach (fn) {
    // use function so that 'this' can be overridden
    this.onBeforeEach.push(function () {
      return fn.call(this, this)
    })
  }

  afterEach (fn) {
    // use function so that 'this' can be overridden
    this.onAfterEach.push(function () {
      return fn.call(this, this)
    })
  }

  teardown (fn) {
    this.onTeardown.push(fn)
  }

  shouldAutoend () {
    const should = (
      this.options.autoend &&
      !this.ended &&
      !this.occupied &&
      queueEmpty(this) &&
      !this.pool.length &&
      !this.subtests.length &&
      this.planEnd === -1
    )
    return should
  }

  autoend (value) {
    // set to false to NOT trigger autoend
    if (value === false) {
      this.options.autoend = false
      clearTimeout(this.autoendTimer)
    } else {
      this.options.autoend = true
      this.maybeAutoend()
    }
  }

  maybeAutoend () {
    if (this.shouldAutoend()) {
      clearTimeout(this.autoendTimer)
      this.autoendTimer = setTimeout(() => {
        if (this.shouldAutoend()) {
          clearTimeout(this.autoendTimer)
          this.autoendTimer = setTimeout(() => {
            if (this.shouldAutoend())
              this.end(IMPLICIT)
          })
        }
      })
    }
  }

  onbail (message) {
    super.onbail(message)
    this.end(IMPLICIT)
    if (!this.parent)
      this.endAll()
  }

  endAll (sub) {
    // in the case of the root TAP test object, we might sometimes
    // call endAll on a bailing-out test, as the process is ending
    // In that case, we WILL have a this.occupied and a full queue
    // These cases are very rare to encounter in other Test objs tho
    this.processing = true
    if (this.occupied) {
      const p = this.occupied
      if (p instanceof Waiter)
        p.abort(new Error('test unfinished'))
      else if (p.endAll)
        p.endAll(true)
      else
        p.parser.abort('test unfinished')
    } else if (sub) {
      this.process()
      if (queueEmpty(this)) {
        const options = Object.assign({}, this.options)
        this.options.at = null
        this.options.stack = ''
        options.test = this.name
        this.fail('test unfinished', options)
      }
    }

    if (this.promise && this.promise.tapAbortPromise)
      this.promise.tapAbortPromise()

    if (this.occupied) {
      this.queue.unshift(this.occupied)
      this.occupied = null
    }

    endAllQueue(this.queue)
    this.processing = false
    this.process()
    this.parser.end()
  }

  get currentAssert () {
    return this[_currentAssert]
  }

  set currentAssert (fn) {
    if (!this[_currentAssert])
      this[_currentAssert] = fn
  }

  pass (message, extra) {
    this.currentAssert = Test.prototype.pass

    this.printResult(true, ...normalizeMessageExtra('(unnamed test)', message, extra))
    return true
  }

  fail (message, extra) {
    [message, extra] = normalizeMessageExtra('(unnamed test)', message, extra)
    this.currentAssert = Test.prototype.fail

    this.printResult(false, message, extra)
    return !!(extra.todo || extra.skip)
  }

  ok (obj, message, extra) {
    [message, extra] = normalizeMessageExtra('expect truthy value', message, extra)
    this.currentAssert = Test.prototype.ok

    return obj ? this.pass(message, extra) : this.fail(message, extra)
  }

  notOk (obj, message, extra) {
    [message, extra] = normalizeMessageExtra('expect falsey value', message, extra)
    this.currentAssert = Test.prototype.notOk

    return this.ok(!obj, message, extra)
  }

  emits (emitter, event, message, extra) {
    [message, extra] = normalizeMessageExtra(`expect ${event} event to be emitted`, message, extra)
    this.currentAssert = Test.prototype.emits

    const handler = () => handler.emitted = true
    handler.emitted = false
    emitter.once(event, handler)
    extra.at = stack.at(Test.prototype.emits)
    extra.stack = stack.captureString(80, Test.prototype.emits)
    this[_beforeEnd].push([_emits, emitter, event, handler, message, extra])
  }

  [_emits] (emitter, event, handler, message, extra) {
    if (handler.emitted)
      return this.pass(message, extra)
    else {
      emitter.removeListener(event, handler)
      return this.fail(message, extra)
    }
  }

  error (er, message, extra) {
    [message, extra] = normalizeMessageExtra('', message, extra)
    this.currentAssert = Test.prototype.error

    if (!er) {
      return this.pass(message || 'should not error', extra)
    }

    if (!(er instanceof Error)) {
      extra.found = er
      return this.fail(message || 'non-Error error encountered', extra)
    }

    message = message || er.message
    extra.origin = cleanYamlObject(extraFromError(er))
    extra.found = er
    return this.fail(message, extra)
  }

  equal (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should be equal', message, extra)
    this.currentAssert = Test.prototype.equal

    if (found === wanted) {
      return this.pass(message, extra)
    }

    const objects = found &&
      wanted &&
      typeof found === 'object' &&
      typeof wanted === 'object'
    if (objects) {
      const s = strict(found, wanted, this.compareOptions)
      if (!s.match)
        extra.diff = s.diff
      else {
        extra.found = found
        extra.wanted = wanted
        extra.note = 'object identities differ'
      }
    } else {
      extra.found = found
      extra.wanted = wanted
    }

    extra.compare = '==='

    return this.fail(message, extra)
  }

  not (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should not be equal', message, extra)
    this.currentAssert = Test.prototype.not

    if (found !== wanted) {
      return this.pass(message, extra)
    }

    extra.found = found
    extra.doNotWant = wanted
    extra.compare = '!=='

    return this.fail(message, extra)
  }

  same (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should be equivalent', message, extra)
    this.currentAssert = Test.prototype.same

    const s = same(found, wanted, this.compareOptions)
    if (!s.match)
      extra.diff = s.diff
    else {
      extra.found = found
      extra.wanted = wanted
    }
    return this.ok(s.match, message, extra)
  }

  notSame (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should not be equivalent', message, extra)
    this.currentAssert = Test.prototype.notSame

    extra.found = found
    extra.doNotWant = wanted
    const s = same(found, wanted, this.compareOptions)
    return this.notOk(s.match, message, extra)
  }

  strictSame (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should be equivalent strictly', message, extra)
    this.currentAssert = Test.prototype.strictSame

    const s = strict(found, wanted, this.compareOptions)
    if (!s.match)
      extra.diff = s.diff
    else {
      extra.found = found
      extra.wanted = wanted
    }

    return this.ok(s.match, message, extra)
  }

  strictNotSame (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should not be equivalent strictly', message, extra)
    this.currentAssert = Test.prototype.strictNotSame

    extra.found = found
    extra.doNotWant = wanted
    const s = strict(found, wanted, this.compareOptions)
    return this.notOk(s.match, message, extra)
  }

  get fullname () {
    const main = process.argv.slice(1).join(' ').trim()
    return (this.parent ? this.parent.fullname
      : main.indexOf(cwd) === 0 ? main.substr(cwd.length + 1)
      : path.basename(main)).replace(/\\/g, '/') +
      ' ' + (this.name || '').trim()
  }

  get snapshotFile () {
    return this[_getSnapshot]().file
  }
  set snapshotFile (file) {
    this[_getSnapshot]().file = file
  }

  get testdirName () {
    const re = /[^a-zA-Z0-9\._\-]+/ig
    if (!this.parent) {
      const main = findMainScript('TAP')
      // put in a prefix in the dirname so do not inadvertently run it
      // on a subsequent tap invocation, if it was saved.
      const dir = path.dirname(main)
      const base = 'tap-testdir-' + (path.basename(main).replace(/\.[^.]+$/, '')
        + ' ' + process.argv.slice(2).join(' ')).trim()
      return dir + '/' + base.replace(re, '-')
    }

    return this.parent.testdirName + '-' +
      (this.name || 'unnamed test').replace(re, '-')
  }

  testdir (fixture) {
    const {rmdirRecursiveSync} = settings
    const dir = this.testdirName
    rmdirRecursiveSync(dir)
    if (!this.saveFixture)
      this[_createdFixture] = dir
    Fixture.make(dir, fixture || {})
    return dir
  }

  fixture (type, content) {
    return new Fixture(type, content)
  }

  mock (module, mocks) {
    const {file} = stack.at(Test.prototype.mock)
    const resolved = path.resolve(file)
    return Mock.get(resolved, module, mocks)
  }

  matchSnapshot (found, message, extra) {
    [message, extra] = normalizeMessageExtra('must match snapshot', message, extra)
    this.currentAssert = Test.prototype.matchSnapshot

    // use notOk because snap doesn't return a truthy value
    const m = this.fullname + ' > ' + message
    if (typeof found !== 'string') {
      found = (this.formatSnapshot || formatSnapshotDefault)(found)
      if (typeof found !== 'string')
        found = formatSnapshotDefault(found)
    }

    found = this.cleanSnapshot(found)

    return this.writeSnapshot
      ? this.notOk(this[_getSnapshot]().snap(found, m),
        message, extra)
      : this.equal(found, this[_getSnapshot]().read(m),
        message, extra)
  }

  [_getSnapshot] () {
    if (this[_snapshot])
      return this[_snapshot]

    if (this.parent) {
      const parentSnapshot = this.parent[_getSnapshot]()
      // very rare for the parent to not have one.
      /* istanbul ignore else */
      if (parentSnapshot)
        return this[_snapshot] = parentSnapshot
    }

    return this[_snapshot] = new Snapshot()
  }

  cleanSnapshot (string) {
    return string
  }

  has (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should contain all provided fields', message, extra)
    this.currentAssert = Test.prototype.has

    const s = has(found, wanted, this.compareOptions)
    if (!s.match)
      extra.diff = s.diff
    else {
      extra.found = found
      extra.pattern = wanted
    }
    return this.ok(s.match, message, extra)
  }

  notHas (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should not contain all provided fields', message, extra)
    this.currentAssert = Test.prototype.notHas

    extra.found = found
    extra.pattern = wanted
    const s = has(found, wanted, this.compareOptions)
    return this.notOk(s.match, message, extra)
  }

  hasStrict (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should contain all provided fields strictly', message, extra)
    this.currentAssert = Test.prototype.hasStrict

    const s = hasStrict(found, wanted, this.compareOptions)
    if (!s.match)
      extra.diff = s.diff
    else {
      extra.found = found
      extra.pattern = wanted
    }
    return this.ok(s.match, message, extra)
  }

  notHasStrict (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should not contain all provided fields strictly', message, extra)
    this.currentAssert = Test.prototype.notHasStrict

    extra.found = found
    extra.pattern = wanted
    const s = hasStrict(found, wanted, this.compareOptions)
    return this.notOk(s.match, message, extra)
  }

  match (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should match pattern provided', message, extra)
    this.currentAssert = Test.prototype.match

    const s = match(found, wanted, this.compareOptions)
    if (!s.match)
      extra.diff = s.diff
    else
      extra.found = found
    extra.pattern = wanted
    return this.ok(s.match, message, extra)
  }

  notMatch (found, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('should not match pattern provided', message, extra)
    this.currentAssert = Test.prototype.notMatch

    extra.found = found
    extra.pattern = wanted
    const s = match(found, wanted, this.compareOptions)
    return this.notOk(s.match, message, extra)
  }

  type (obj, klass, message, extra) {
    this.currentAssert = Test.prototype.type

    const name = typeof klass === 'function' ?
      klass.name || '(anonymous constructor)'
      : klass;

    [message, extra] = normalizeMessageExtra(`type is ${name}`, message, extra)

    // simplest case, it literally is the same thing
    if (obj === klass) {
      return this.pass(message, extra)
    }

    const tof = typeof obj
    const type = (!obj && tof === 'object') ? 'null'
      // treat as object, but not Object
      // t.type(() => {}, Function)
      : (tof === 'function' &&
        typeof klass === 'function' &&
        klass !== Object) ? 'object'
      : tof

    if (type === 'object' && klass !== 'object') {
      if (typeof klass === 'function') {
        extra.found = Object.getPrototypeOf(obj).constructor.name
        extra.wanted = name
        return this.ok(obj instanceof klass, message, extra)
      }

      // check prototype chain for name
      // at this point, we already know klass is not a function
      // if the klass specified is an obj in the proto chain, pass
      // if the name specified is the name of a ctor in the chain, pass
      for (let p = obj; p; p = Object.getPrototypeOf(p)) {
        const ctor = p.constructor && p.constructor.name
        if (p === klass || ctor === name) {
          return this.pass(message, extra)
        }
      }
    }

    return this.equal(type, name, message, extra)
  }

  expectUncaughtException (...args) {
    let [, ...rest] = this.throwsArgs('expect uncaughtException', ...args)
    this[_expectUncaught].push(rest)
  }

  throwsArgs (defaultMessage, ...args) {
    let fn, wanted, message, extra
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      if (typeof arg === 'function') {
        if (arg === Error || arg.prototype instanceof Error) {
          wanted = arg
        } else if (!fn) {
          fn = arg
        }
      } else if (typeof arg === 'string' && arg) {
        message = arg
      } else if (typeof arg === 'object') {
        if (!wanted) {
          wanted = arg
        } else {
          extra = arg
        }
      }
    }

    [message, extra] = normalizeMessageExtra(defaultMessage, message, extra)

    if (wanted) {
      if (wanted instanceof Error) {
        const w = {
          message: wanted.message
        }
        if (wanted.name) {
          w.name = wanted.name
        }

        // intentionally copying non-local properties, since this
        // is an Error object, and those are funky.
        for (let i in wanted) {
          w[i] = wanted[i]
        }
        wanted = w

        message += ': ' + (wanted.name || 'Error') + ' ' + wanted.message
        extra.wanted = wanted
      }
    }

    return [fn, wanted, message, extra]
  }

  throws (...args) {
    this.currentAssert = Test.prototype.throws

    const [fn, wanted, message, extra] =
      this.throwsArgs('expected to throw', ...args)

    if (typeof fn !== 'function') {
      extra.todo = extra.todo || true
      return this.pass(message, extra)
    }

    try {
      fn()
      return this.fail(message, extra)
    } catch (er) {
      // 'name' is a getter.
      if (er.name) {
        Object.defineProperty(er, 'name', {
          value: er.name + '',
          enumerable: true,
          configurable: true,
          writable: true
        })
      }

      const actual = isRegExp(wanted) ? er.message : er
      return wanted
        ? this.match(actual, wanted, message, extra) && er
        : this.pass(message, extra) && er
    }
  }

  doesNotThrow (fn, message, extra) {
    [message, extra] = normalizeMessageExtra('', message, extra)
    this.currentAssert = Test.prototype.doesNotThrow

    if (typeof fn === 'string') {
      const x = fn
      fn = message
      message = x
    }

    if (!message) {
      message = fn && fn.name || 'expected to not throw'
    }

    if (typeof fn !== 'function') {
      extra.todo = extra.todo || true
      return this.pass(message, extra)
    }

    try {
      fn()
      return this.pass(message, extra)
    } catch (er) {
      const e = extraFromError(er, extra)
      e.message = er.message
      return this.fail(message, e)
    }
  }

  before (fn) {
    this.currentAssert = Test.prototype.before
    if (this.occupied || this[_printedResult])
      throw new Error('t.before() called after starting tests')

    if (this[_beforeCalled])
      throw new Error('called t.before() more than once')

    this[_beforeCalled] = true

    // if it throws, we let it kill the test
    const ret = fn.call(this)

    if (ret && typeof ret.then === 'function')
      this.waitOn(ret, w => {
        if (w.rejected) {
          // sort of a mini bailout, just for this one test
          // drop everything from the queue, quit right away
          this.queue.length = 0
          this.threw(w.value)
          this.planEnd = -1
          this.count = 1
          this.end()
        }
      })
  }

  waitOn (promise, cb, expectReject) {
    const w = new Waiter(promise, w => {
      assert.equal(this.occupied, w)
      cb(w)
      this.occupied = null
      this.process()
    }, expectReject)
    this.queue.push(w)
    this.process()
    return w.promise
  }

  // like throws, but rejects a returned promise instead
  // also, can pass in a promise instead of a function
  rejects (...args) {
    this.currentAssert = Test.prototype.rejects

    let fn, wanted, extra, promise, message
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      if (typeof arg === 'function') {
        if (arg === Error || arg.prototype instanceof Error) {
          wanted = arg
        } else if (!fn) {
          fn = arg
        }
      } else if (typeof arg === 'string' && arg) {
        message = arg
      } else if (arg && typeof arg.then === 'function' && !promise) {
        promise = arg
      } else if (typeof arg === 'object') {
        if (!wanted) {
          wanted = arg
        } else {
          extra = arg
        }
      }
    }

    if (!extra)
      extra = {}

    if (!message)
      message = fn && fn.name || 'expect rejected Promise'

    if (wanted) {
      if (wanted instanceof Error) {
        const w = {
          message: wanted.message
        }
        if (wanted.name)
          w.name = wanted.name

        // intentionally copying non-local properties, since this
        // is an Error object, and those are funky.
        for (let i in wanted) {
          w[i] = wanted[i]
        }
        wanted = w

        message += ': ' + (wanted.name || 'Error') + ' ' + wanted.message
        extra.wanted = wanted
      }
    }

    if (!promise && typeof fn !== 'function') {
      extra.todo = extra.todo || true
      this.pass(message, extra)
      return Promise.resolve(this)
    }

    if (!promise)
      promise = fn()

    if (!promise || typeof promise.then !== 'function') {
      this.fail(message, extra)
      return Promise.resolve(this)
    }

    extra.at = stack.at(this.currentAssert)
    return this.waitOn(promise, w => {
      if (!w.rejected) {
        extra.found = w.value
        return this.fail(message, extra)
      }

      const er = w.value
      // 'name' is a getter.
      if (er && er.name) {
        Object.defineProperty(er, 'name', {
          value: er.name + '',
          enumerable: true,
          configurable: true,
          writable: true
        })
      }

      const actual = isRegExp(wanted) && er ? er.message : er
      return wanted ? this.match(actual, wanted, message, extra)
        : this.pass(message, extra)
    }, true)
  }

  resolves (promise, message, extra) {
    [message, extra] = normalizeMessageExtra('expect resolving Promise', message, extra)
    this.currentAssert = Test.prototype.resolves

    if (typeof promise === 'function')
      promise = promise()

    extra.at = stack.at(this.currentAssert)

    if (!promise || typeof promise.then !== 'function') {
      this.fail(message, extra)
      return Promise.resolve(this)
    }

    return this.waitOn(promise, w => {
      extra.found = w.value
      this.ok(w.resolved, message, extra)
    })
  }

  resolveMatch (promise, wanted, message, extra) {
    [message, extra] = normalizeMessageExtra('expect resolving Promise', message, extra)
    this.currentAssert = Test.prototype.resolveMatch

    extra.at = stack.at(this.currentAssert)

    if (typeof promise === 'function')
      promise = promise()

    if (!promise || typeof promise.then !== 'function') {
      this.fail(message, extra)
      return Promise.resolve(this)
    }

    return this.waitOn(promise, w => {
      extra.found = w.value
      return w.rejected ? this.fail(message, extra)
        : this.match(w.value, wanted, message, extra)
    })
  }

  resolveMatchSnapshot (promise, message, extra) {
    [message, extra] = normalizeMessageExtra('expect resolving Promise', message, extra)
    this.currentAssert = Test.prototype.resolveMatch

    extra.at = stack.at(this.currentAssert)

    if (typeof promise === 'function')
      promise = promise()

    if (!promise || typeof promise.then !== 'function') {
      this.fail(message, extra)
      return Promise.resolve(this)
    }

    return this.waitOn(promise, w => {
      extra.found = w.value
      return w.rejected ? this.fail(message, extra)
        : this.matchSnapshot(w.value, message, extra)
    })
  }
}

const endAllQueue = queue => {
  queue.forEach((p, i) => {
    if ((p instanceof Base) && !p.readyToProcess)
      queue[i] = new TestPoint(false,
        'child test left in queue:' +
        ' t.' + p.constructor.name.toLowerCase() + ' ' + p.name,
        p.options)
  })
  queue.push(['end', IMPLICIT])
}

const queueEmpty = t =>
  t.queue.length === 0 ||
    t.queue.length === 1 && t.queue[0] === 'TAP version 13\n'

module.exports = Test
