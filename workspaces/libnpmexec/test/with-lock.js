const fs = require('fs')
const path = require('path')
const os = require('os')
const setTimeout = require('timers/promises').setTimeout
const t = require('tap')

const withLock = require('../lib/with-lock.js')

const getTempDir = () => fs.realpathSync(os.tmpdir())

t.test('concurrent locking', async (t) => {
  const dir = fs.mkdtempSync(path.join(getTempDir(), 'test-'))
  const events = []
  const lockPromise1 = withLock(dir, async () => {
    events.push('lock1 acquired')
    await setTimeout(100)
    events.push('lock1 released')
  })
  await setTimeout(50)
  const lockPromise2 = withLock(dir, async () => {
    events.push('lock2 acquired')
    await setTimeout(100)
    events.push('lock2 released')
    return 'lock2'
  })
  await Promise.all([lockPromise1, lockPromise2])
  t.same(events, [
    'lock1 acquired',
    'lock1 released',
    'lock2 acquired',
    'lock2 released',
  ], 'should acquire locks in order and release them correctly')
})

t.test('unrelated locks', async (t) => {
  const dir1 = fs.mkdtempSync(path.join(getTempDir(), 'test-1-'))
  const dir2 = fs.mkdtempSync(path.join(getTempDir(), 'test-2-'))
  const lockPromise1 = withLock(dir1, async () => {
    await setTimeout(100)
    return 'lock1'
  })
  const lockPromise2 = withLock(dir2, async () => 'lock2')
  t.equal(await lockPromise2, 'lock2', 'lock2 should not be blocked by lock1')
  t.equal(await lockPromise1, 'lock1', 'lock1 should complete after lock2')
})

t.test('resolved value', async (t) => {
  const dir = fs.mkdtempSync(path.join(getTempDir(), 'test-'))
  const result = await withLock(dir, async () => 'test value')
  t.equal(result, 'test value', 'should return the resolved value from the callback')
})

t.test('rejection', async (t) => {
  const dir = fs.mkdtempSync(path.join(getTempDir(), 'test-'))
  await t.rejects(withLock(dir, async () => {
    throw new Error('test error')
  }), new Error('test error'))
  t.equal(await withLock(dir, async () => 'test'), 'test', 'should allow subsequent locks after rejection')
})
