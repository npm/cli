'use strict'
const t = require('./tap.js')
t.jobs = 1
const tapStack = [ t ]
let level = 0
const suiteStack = []

const describe = (name, fn, opt) =>
  new Suite(name, fn, opt)

class Suite {
  constructor (name, fn, opt) {
    this.parent = suiteStack[ suiteStack.length - 1 ]
    if (typeof name === 'function')
      fn = name, name = null
    if (fn && fn.name && !name)
      name = fn.name
    this.options = opt || {}
    this.options.todo = this.options.todo || !fn
    this.fn = fn
    this.name = name
    this.after = []
    this.test = null

    this.run()
  }

  run () {
    const t = tapStack[ tapStack.length - 1 ]
    t.test(this.name, this.options, tt => {
      this.test = tt
      tapStack.push(tt)
      suiteStack.push(this)
      const ret = this.fn()
      this.runAfter()
      suiteStack.pop()
      return ret
    })
  }

  runAfter () {
    this.after.forEach(a =>
      before(a[0], a[1], a[2]))
    let t
    do {
      t = tapStack.pop()
    } while (t && t !== this.test)
    if (this.test && !this.test.results)
      t.end()
  }
}

const before = (name, fn, options) => {
  if (typeof name === 'function')
    fn = name, name = null
  if (fn && fn.name && !name)
    name = fn.name
  options = options || {}
  const todo = !fn
  options.todo = options.todo || todo
  options.silent = true
  const suite = suiteStack[ suiteStack.length - 1 ]
  if (!suite)
    throw new Error('cannot call "before" outside of describe()')
  const t = tapStack[ tapStack.length - 1 ]
  if (!name)
    name = ''

  const done = tt => er => er ? tt.threw(er) : tt.end()
  t.test(name, options, tt => {
    const ret = fn.call(suite, done(tt))
    if (!ret && fn.length === 0)
      tt.end()
    else
      return ret
  })
}

const it = (name, fn, options) => {
  if (typeof name === 'function')
    fn = name, name = null
  if (fn && fn.name && !name)
    name = fn.name
  options = options || {}
  const todo = !fn
  const suite = suiteStack[ suiteStack.length - 1 ]
  const t = tapStack[ tapStack.length - 1 ]
  if (!name)
    name = ''

  const done = tt => er => er ? tt.threw(er) : tt.end()
  options.todo = options.todo || todo
  options.tapMochaTest = true
  t.test(name, options, tt => {
    const ret = fn.call(tt, done(tt))
    if (ret && ret.then)
      return ret
    else if (fn.length === 0)
      tt.end()
  })
}

it.skip = (name, fn) => it(name, fn, { skip: true })
it.todo = (name, fn) => it(name, fn, { todo: true })

function after (name, fn, options) {
  const suite = suiteStack[ suiteStack.length - 1 ]
  if (!suite)
    throw new Error('cannot call "after" outside of describe()')
  suite.after.push([name, fn, options])
}

const cbPromise = require('./cb-promise.js')

function moment (when, fn) {
  const t = tapStack[ tapStack.length - 1 ]
  // need function because 'this' tells us which tap object
  // has the tapMochaTest thing in its options object
  t[when](function () {
    if (!this.options.tapMochaTest)
      return
    const suite = suiteStack[ suiteStack.length - 1 ]

    const [cb, p] = cbPromise()
    const ret = fn.call(this, cb)
    if (ret && ret.then)
      return ret
    else if (fn.length !== 0)
      return p
  })
}

const beforeEach = fn =>
  moment('beforeEach', fn)

const afterEach = fn =>
  moment('afterEach', fn)

exports.it = exports.specify = it
exports.context = exports.describe = describe
exports.before = before
exports.after = after
exports.beforeEach = beforeEach
exports.afterEach = afterEach

let saved
exports.global = _ => {
  if (!saved)
    saved = new Map()

  Object.keys(exports).filter(g => g !== 'global').forEach(g => {
    if (!saved.has(g))
      saved.set(g, global[g])
    global[g] = exports[g]
  })
}

exports.deglobal = _ =>
  Object.keys(exports).filter(g => g !== 'global').forEach(g => {
    if (saved && saved.has(g))
      global[g] = saved.get(g)
  })
