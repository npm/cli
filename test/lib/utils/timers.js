const t = require('tap')
const { resolve, join } = require('path')
const fs = require('graceful-fs')
const { log, time } = require('proc-log')
const tmock = require('../../fixtures/tmock')

const mockTimers = (t, options) => {
  const logs = log.LEVELS.reduce((acc, l) => {
    acc[l] = []
    return acc
  }, {})
  const logHandler = (level, ...args) => {
    logs[level].push(args.join(' '))
  }
  process.on('log', logHandler)
  const Timers = tmock(t, '{LIB}/utils/timers')
  const timers = new Timers(options)
  t.teardown(() => {
    timers.off()
    process.off('log', logHandler)
  })
  return { timers, logs }
}

t.test('listens/stops on process', async (t) => {
  const { timers } = mockTimers(t)
  time.start('foo')
  time.start('bar')
  time.end('bar')
  t.match(timers.unfinished, new Map([['foo', Number]]))
  t.match(timers.finished, { bar: Number })
  timers.off()
  time.start('baz')
  t.notOk(timers.unfinished.get('baz'))
})

t.test('initial timer is named npm', async (t) => {
  const { timers } = mockTimers(t)
  time.end('npm')
  t.match(timers.finished, { npm: Number })
})

t.test('logs timing events', async (t) => {
  const events = []
  const listener = (...args) => events.push(args)
  const { timers, logs } = mockTimers(t, { listener })
  time.start('foo')
  time.start('bar')
  time.end('bar')
  timers.off(listener)
  time.end('foo')
  t.equal(logs.timing.length, 1)
  t.match(logs.timing[0], /^bar Completed in [0-9]ms/)
})

t.test('finish unstarted timer', async (t) => {
  const { logs } = mockTimers(t)
  time.end('foo')
  t.match(logs.silly, ["timing Tried to end timer that doesn't exist: foo"])
})

t.test('writes file', async (t) => {
  const { timers } = mockTimers(t)
  const dir = t.testdir()
  time.start('foo')
  time.end('foo')
  timers.load({ path: resolve(dir, `TIMING_FILE-`) })
  timers.writeFile({ some: 'data' })
  const data = JSON.parse(fs.readFileSync(resolve(dir, 'TIMING_FILE-timing.json')))
  t.match(data, {
    metadata: { some: 'data' },
    timers: { foo: Number },
    unfinishedTimers: {
      npm: [Number, Number],
    },
  })
})

t.test('fails to write file', async (t) => {
  const { logs, timers } = mockTimers(t)
  const dir = t.testdir()

  timers.load({ path: join(dir, 'does', 'not', 'exist') })
  timers.writeFile()

  t.match(logs.warn, ['timing could not write timing file:'])
  t.equal(timers.file, null)
})

t.test('no dir and no file', async (t) => {
  const { logs, timers } = mockTimers(t)

  timers.load()
  timers.writeFile()

  t.strictSame(logs.warn, [])
  t.strictSame(logs.silly, [])
  t.equal(timers.file, null)
})
