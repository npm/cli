const t = require('tap')

const onExit = require('../lib/signal-handling.js')
t.equal(onExit.process, process, 'uses the real process by default')

// ok, from here on out, use our mock
const EE = require('events')
const proc = onExit.process = new class MockProcess extends EE {
  constructor () {
    super()
    this.pid = process.pid
  }

  // yes, yes, the actual process.kill doesn't return a promise, but
  // we need to know when this async action is done to know when to
  // continue on to other parts of the test.
  kill (pid, signal) {
    if (pid !== this.pid) {
      throw Object.assign(new Error('wrong pid sent to kill() method'), {
        expect: this.pid,
        actual: pid,
      })
    }
    return new Promise(res => process.nextTick(() => {
      this.emit(signal)
      res()
    }))
  }
}()

t.test('load and unload', async t => {
  t.plan(2)

  const unload = onExit(({ signal }) => t.equal(signal, 'SIGINT'))
  unload()

  // should not trigger for these
  await Promise.all([
    proc.kill(process.pid, 'SIGINT'),
    proc.kill(process.pid, 'SIGINT'),
    proc.kill(process.pid, 'SIGINT'),
  ])

  t.equal(proc.listeners('beforeExit').length, 0, 'did not leave beforeExit')
  t.equal(proc.listeners('SIGINT').length, 0, 'did not leave SIGINT')

  // calling multiple times is safe
  unload()
  unload()
})

t.test('load only listens to one event', async t => {
  t.plan(2)
  onExit(({ signal }) => t.equal(signal, 'SIGINT'))
  await proc.kill(process.pid, 'SIGINT')
  // should not trigger our onExit handler, but WILL call this one,
  // since the beforeExit handler was assigned
  proc.once('SIGINT', () => t.pass('got follow-up signal'))
  proc.emit('beforeExit')
  // give it a moment for the synthetic kill timeout to fire
  await new Promise(res => setTimeout(res))
})

t.test('only respond to first signal', async t => {
  t.plan(5)
  onExit(({ signal }) => t.equal(signal, 'SIGINT'))
  await proc.kill(process.pid, 'SIGINT')
  await proc.kill(process.pid, 'SIGHUP')
  await proc.kill(process.pid, 'SIGTERM')
  proc.emit('beforeExit')
  t.equal(proc.listeners('beforeExit').length, 0, 'did not leave beforeExit')
  t.equal(proc.listeners('SIGINT').length, 0, 'did not leave SIGINT')
  t.equal(proc.listeners('SIGHUP').length, 0, 'did not leave SIGHUP')
  t.equal(proc.listeners('SIGTERM').length, 0, 'did not leave SIGTERM')
})

t.test('can do multiple loads in parallel', t => {
  t.plan(2)

  t.test('running two handlers', async t => {
    t.plan(3)
    onExit(({ signal }) => t.equal(signal, 'SIGINT', '1'))
    onExit(({ signal }) => t.equal(signal, 'SIGINT', '2'))
    await proc.kill(process.pid, 'SIGINT')
    // should not trigger our onExit handler, but WILL call this one,
    // since the beforeExit handler was assigned
    proc.once('SIGINT', () => t.pass('got follow-up signal'))
    proc.emit('beforeExit')
    // give it a moment for the synthetic kill timeout to fire
    await new Promise(res => setTimeout(res))
  })

  t.test('verify cleanup after both are finished', t => {
    t.plan(4)
    t.equal(proc.listeners('beforeExit').length, 0, 'did not leave beforeExit')
    t.equal(proc.listeners('SIGINT').length, 0, 'did not leave SIGINT')
    t.equal(proc.listeners('SIGHUP').length, 0, 'did not leave SIGHUP')
    t.equal(proc.listeners('SIGTERM').length, 0, 'did not leave SIGTERM')
  })
})

t.test('no max listener warning', t => {
  t.plan(1)
  const { emitWarning } = process
  Object.defineProperty(process, 'emitWarning', {
    value: (...args) => {
      emitWarning.call(process, ...args)
      throw new Error('no warnings should be emitted')
    },
    configurable: true,
  })
  t.teardown(() => Object.defineProperty(process, 'emitWarning', {
    value: emitWarning,
    configurable: true,
  }))

  const unloads = []
  for (let i = 0; i < 1000; i++) {
    unloads.push(onExit(() => {}))
  }
  for (const unload of unloads) {
    unload()
  }

  t.pass('if no throw, then it worked')
})
