const fs = require('node:fs/promises')
const { rmdirSync } = require('node:fs')
const retry = require('retry')
const { onExit } = require('signal-exit')

// a lockfile implementation inspired by the unmaintained proper-lockfile library
//
// similarities:
// - based on mkdir's atomicity
// - works across processes and even machines (via NFS)
// - cleans up after itself
// - detects compromised locks
//
// differences:
// - higher-level API (just a withLock function)
// - written in async/await style
// - uses mtime + inode for more reliable compromised lock detection
// - more ergonomic compromised lock handling (i.e. withLock will reject, and callbacks have access to an AbortSignal)
// - uses a more recent version of signal-exit

const touchInterval = 100
// mtime precision is platform dependent, so use a reasonably large threshold
const staleThreshold = 5_000

// keep track of current locks. this lets us:
// - clean up any locks that were not released normally
// - detect if a lock has been compromised (e.g. due to lock manipulation outside this library,
//   or a small race condition during stale lock takeover)
const currentLocks = new Map()

function cleanupLocks () {
  for (const [, cleanup] of currentLocks) {
    try {
      cleanup()
    } catch (err) {
      //
    }
  }
}

// clean up any locks that were not released normally
onExit(cleanupLocks)

/**
 * Acquire an advisory lock for the given path and hold it for the duration of the callback.
 *
 * The lock will be released automatically when the callback resolves or rejects.
 * Concurrent calls to withLock() for the same path will wait until the lock is released.
 */
async function withLock (filePath, cb) {
  const lockPath = `${filePath}.lock`
  try {
    const signal = await acquireLock(lockPath)
    return await new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => {
        reject(Object.assign(new Error('Lock compromised'), { code: 'ECOMPROMISED' }))
      })
      Promise.resolve(cb(signal)).then(resolve).catch(reject)
    })
  } finally {
    await releaseLock(lockPath)
  }
}

function acquireLock (lockPath) {
  const operation = retry.operation({
    minTimeout: 100,
    maxTimeout: 5_000,
    // if another process legitimately holds the lock, wait for it to release;
    // if it dies abnormally and the lock becomes stale, we'll acquire it automatically
    forever: true,
  })
  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        await fs.mkdir(lockPath)
      } catch (err) {
        if (err.code !== 'EEXIST') {
          return reject(err)
        }

        try {
          const status = await getLockStatus(lockPath)

          if (status === 'locked') {
            // let's see if we can acquire it on the next attempt 🤞
            return operation.retry(err)
          }
          if (status === 'stale') {
            // there is a very tiny window where another process could also release the stale lock and acquire it
            // before we release it here; the lock compromise checker should detect this and throw an error
            await releaseLock(lockPath)
          }
          return resolve(await acquireLock(lockPath))
        } catch (e) {
          return reject(e)
        }
      }
      const signal = await maintainLock(lockPath)
      return resolve(signal)
    })
  })
}

async function releaseLock (lockPath) {
  try {
    currentLocks.get(lockPath)?.()
    currentLocks.delete(lockPath)
    await fs.rmdir(lockPath)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }
}

async function getLockStatus (lockPath) {
  try {
    const stat = await fs.stat(lockPath)
    return (Date.now() - stat.mtimeMs > staleThreshold) ? 'stale' : 'locked'
  } catch (err) {
    if (err.code === 'ENOENT') {
      return 'unlocked'
    }
    throw err
  }
}

async function maintainLock (lockPath) {
  const controller = new AbortController()
  const stats = await fs.stat(lockPath)
  let mtimeMs = stats.mtimeMs
  const signal = controller.signal

  async function touchLock () {
    try {
      const currentStats = (await fs.stat(lockPath))
      if (currentStats.ino !== stats.ino || currentStats.mtimeMs !== mtimeMs) {
        throw new Error('Lock compromised')
      }
      await fs.utimes(lockPath, new Date(), new Date(mtimeMs = Date.now()))
    } catch (err) {
      // stats mismatch or other fs error means the lock was compromised
      controller.abort()
    }
  }

  const timeout = setInterval(touchLock, touchInterval)
  timeout.unref()
  function cleanup () {
    rmdirSync(lockPath)
    clearInterval(timeout)
  }
  currentLocks.set(lockPath, cleanup)
  return signal
}

module.exports = withLock
