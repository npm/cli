const lockfile = require('proper-lockfile')

async function withLock (dir, cb) {
  const release = await lockfile.lock(dir, {
    retries: {
      minTimeout: 100,
      maxTimeout: 5_000,
      // if another process legitimately holds the lock, wait for it to release;
      // if it dies abnormally we'll acquire it automatically
      forever: true,
    },
  })
  try {
    return await cb()
  } finally {
    await release()
  }
}

module.exports = withLock
