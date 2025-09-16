const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const setTimeout = require('node:timers/promises').setTimeout

const getTempDir = () => fs.realpathSync(os.tmpdir())

const t = require('tap')

let mockMkdir
let mockStat
let mockUtimes
let mockRmdirSync
let onExitHandler
const withLock = t.mock('../lib/with-lock.js', {
  // make various fs things mockable, but default to the real implementation
  'node:fs/promises': {
    mkdir: async (...args) => {
      return await (mockMkdir?.(...args) ?? fs.promises.mkdir(...args))
    },
    stat: async (...args) => {
      return await (mockStat?.(...args) ?? fs.promises.stat(...args))
    },
    utimes: async (...args) => {
      return await (mockUtimes?.(...args) ?? fs.promises.utimes(...args))
    },
  },
  'node:fs': {
    rmdirSync: (...args) => {
      return (mockRmdirSync?.(...args) ?? fs.rmdirSync(...args))
    },
  },
  'signal-exit': {
    onExit: (handler) => {
      onExitHandler = handler
    },
  },
})

t.beforeEach(() => {
  mockMkdir = undefined
  mockStat = undefined
  mockUtimes = undefined
  mockRmdirSync = undefined
})

t.test('concurrent locking', async (t) => {
  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  const events = []
  const lockPromise1 = withLock(lockPath, async () => {
    events.push('lock1 acquired')
    await setTimeout(100)
    events.push('lock1 released')
  })
  await setTimeout(50) // ensure lock1 is acquired before lock2
  const lockPromise2 = withLock(lockPath, async () => {
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
  const lockPath1 = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-1-')), 'concurrency.lock')
  const lockPath2 = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-2-')), 'concurrency.lock')
  const lockPromise1 = withLock(lockPath1, async () => {
    await setTimeout(100)
    return 'lock1'
  })
  const lockPromise2 = withLock(lockPath2, async () => 'lock2')
  t.equal(await lockPromise2, 'lock2', 'lock2 should not be blocked by lock1')
  t.equal(await lockPromise1, 'lock1', 'lock1 should complete after lock2')
})

t.test('resolved value', async (t) => {
  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  const result = await withLock(lockPath, async () => 'test value')
  t.equal(result, 'test value', 'should resolve to the same value as the callback')
})

t.test('rejection', async (t) => {
  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  await t.rejects(withLock(lockPath, async () => {
    throw new Error('test error')
  }), new Error('test error'))
  t.equal(await withLock(lockPath, async () => 'test'), 'test', 'should allow subsequent locks after rejection')
})

t.test('stale lock takeover', async (t) => {
  let mkdirCalls = 0
  mockMkdir = async () => {
    if (++mkdirCalls === 1) {
      throw Object.assign(new Error(), { code: 'EEXIST' })
    }
  }
  let statCalls = 0
  const mtimeMs = Math.round(Date.now() / 1000) * 1000
  mockStat = async () => {
    if (++statCalls === 1) {
      return { mtimeMs: mtimeMs - 10_000 }
    } else {
      return { mtimeMs, ino: 1 }
    }
  }
  mockUtimes = async () => {}
  mockRmdirSync = () => {}

  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  const lockPromise = withLock(lockPath, async () => {
    await setTimeout(100)
    return 'test value'
  })
  t.equal(await lockPromise, 'test value', 'should take over the lock')
  t.equal(mkdirCalls, 2, 'should make two mkdir calls')
})

t.test('EBUSY during lock acquisition', async (t) => {
  let mkdirCalls = 0
  mockMkdir = async (...args) => {
    if (++mkdirCalls === 1) {
      throw Object.assign(new Error(), { code: 'EBUSY' })
    }
    return fs.promises.mkdir(...args)
  }
  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  t.ok(await withLock(lockPath, async () => true))
  t.equal(mkdirCalls, 2, 'should make two mkdir calls')
})

t.test('EBUSY during stale lock takeover', async (t) => {
  let mkdirCalls = 0
  mockMkdir = async () => {
    if (++mkdirCalls === 1) {
      throw Object.assign(new Error(), { code: 'EEXIST' })
    }
  }
  let statCalls = 0
  const mtimeMs = Math.round(Date.now() / 1000) * 1000
  mockStat = async () => {
    if (++statCalls === 1) {
      return { mtimeMs: mtimeMs - 10_000 }
    } else {
      return { mtimeMs, ino: 1 }
    }
  }
  let rmdirSyncCalls = 0
  mockRmdirSync = () => {
    if (++rmdirSyncCalls === 1) {
      throw Object.assign(new Error(), { code: 'EBUSY' })
    }
  }

  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  const lockPromise = withLock(lockPath, async () => 'test value')
  t.equal(await lockPromise, 'test value', 'should take over the lock')
  t.equal(mkdirCalls, 2, 'should make two mkdir calls')
})

t.test('concurrent stale lock takeover', async (t) => {
  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  // make a stale lock
  await fs.promises.mkdir(lockPath)
  await fs.promises.utimes(lockPath, new Date(Date.now() - 10_000), new Date(Date.now() - 10_000))

  const results = await Promise.allSettled([
    withLock(lockPath, () => 'lock1'),
    withLock(lockPath, () => 'lock2'),
    withLock(lockPath, () => 'lock3'),
  ])
  // all locks should either be successfully acquired or get compromised (expected occasional race condition)
  t.ok(results.every(result => result.status === 'fulfilled' || result.status === 'rejected' && result.reason.code === 'ECOMPROMISED'))
})

t.test('mkdir -> getLockStatus race', async (t) => {
  // validate that we can acquire a lock when mkdir fails (due to the lock existing)
  // but status indicates it's unlocked (i.e. lock was released after the mkdir call)
  let mkdirCalls = 0
  mockMkdir = async () => {
    if (++mkdirCalls === 1) {
      throw Object.assign(new Error(), { code: 'EEXIST' })
    }
  }
  let statCalls = 0
  const mtimeMs = Math.round(Date.now() / 1000) * 1000
  mockStat = async () => {
    if (++statCalls === 1) {
      throw Object.assign(new Error(), { code: 'ENOENT' })
    } else {
      return { mtimeMs, ino: 1 }
    }
  }
  mockUtimes = async () => {}
  mockRmdirSync = () => {}

  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  const lockPromise = withLock(lockPath, async () => {
    await setTimeout(100)
    return 'test value'
  })
  t.equal(await lockPromise, 'test value', 'should acquire the lock')
  t.equal(mkdirCalls, 2, 'should make two mkdir calls')
})

t.test('mtime floating point mismatch', async (t) => {
  let mtimeMs = Math.round(Date.now() / 1000) * 1000
  mockStat = async () => {
    return { mtimeMs, ino: 1 }
  }
  mockUtimes = async (_, nextMtimeSeconds) => {
    mtimeMs = nextMtimeSeconds * 1000 - 0.001
  }

  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  t.ok(await withLock(lockPath, async () => {
    await setTimeout(2000)
    return true
  }), 'should handle mtime floating point mismatches')
})

t.test('unexpected errors', async (t) => {
  t.test('can\'t create lock', async (t) => {
    const lockPath = '/these/parent/directories/do/not/exist/so/it/should/fail.lock'
    await t.rejects(withLock(lockPath, async () => {}), { code: 'ENOENT' })
  })

  t.test('can\'t release lock', async (t) => {
    mockRmdirSync = () => {
      throw Object.assign(new Error(), { code: 'ENOTDIR' })
    }
    const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
    await t.rejects(withLock(lockPath, async () => {}), { code: 'ENOTDIR' })
  })

  t.test('existing lock becomes unreadable right before we check its status', async (t) => {
    // someone else has the lock
    mockMkdir = async () => {
      throw Object.assign(new Error(), { code: 'EEXIST' })
    }
    // we can't stat the lock file
    mockStat = async () => {
      throw Object.assign(new Error(), { code: 'EACCES' })
    }
    const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
    await t.rejects(withLock(lockPath, async () => {}), { code: 'EACCES' })
  })

  t.test('can\'t take over stale lock', async (t) => {
    // someone else has the lock
    mockMkdir = async () => {
      throw Object.assign(new Error(), { code: 'EEXIST' })
    }
    // it's stale
    mockStat = async () => {
      return { mtimeMs: Date.now() - 10_000 }
    }
    // but we can't release it
    mockRmdirSync = () => {
      throw Object.assign(new Error(), { code: 'ENOTDIR' })
    }
    const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
    await t.rejects(withLock(lockPath, async () => {}), { code: 'ENOTDIR' })
  })

  t.test('lock compromised (recreated)', async (t) => {
    const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')

    mockStat = async () => {
      return { mtimeMs: Date.now(), ino: Math.floor(Math.random() * 1000000) }
    }
    await t.rejects(withLock(lockPath, () => setTimeout(2000)), { code: 'ECOMPROMISED' })
  })

  t.test('lock compromised (deleted)', async (t) => {
    const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')

    mockStat = async () => {
      throw Object.assign(new Error(), { code: 'ENOENT' })
    }
    await t.rejects(withLock(lockPath, () => setTimeout(2000)), { code: 'ECOMPROMISED' })
  })
})

t.test('lock released during maintenance', async (t) => {
  // this test validates that if we release the lock while touchLock is running, it doesn't interfere with subsequent locks
  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')

  let releaseLock
  const releaseLockPromise = new Promise((resolve) => {
    releaseLock = resolve
  })

  let statCalls = 0
  mockStat = async (...args) => {
    const value = await fs.promises.stat(...args)
    if (++statCalls > 1) {
      // this runs during the setInterval; release the lock so that we no longer hold it
      await releaseLock('test value')
      await setTimeout()
    }
    return value
  }

  let utimesCalls = 0
  mockUtimes = async () => {
    utimesCalls++
  }

  const lockPromise = withLock(lockPath, () => releaseLockPromise)
  // since we unref the interval timeout, we need to wait to ensure it actually runs
  await setTimeout(2000)
  t.equal(await lockPromise, 'test value', 'should acquire the lock')
  t.equal(utimesCalls, 0, 'should never call utimes')
})

t.test('onExit handler', async (t) => {
  t.ok(onExitHandler, 'should be registered')
  let rmdirSyncCalls = 0

  mockRmdirSync = () => {
    rmdirSyncCalls++
  }

  const lockPath = path.join(fs.mkdtempSync(path.join(getTempDir(), 'test-')), 'concurrency.lock')
  // don't await it since the promise never resolves
  withLock(lockPath, () => new Promise(() => {})).catch(() => {})
  // since we unref the interval timeout, we need to wait to ensure it actually runs
  await setTimeout(2000)
  onExitHandler()
  t.ok(rmdirSyncCalls > 0, 'should have removed outstanding locks')
})
