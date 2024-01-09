// Arborist should be mkdir-ing the path, but not
// changing its ownership in that case.
// https://github.com/npm/arborist/issues/252
// This test has to club a lot of stuff, and provides no coverage,
// so it is separated from the arborist/reify.js tests.

const t = require('tap')

const chownr = Object.assign((path, uid, gid, cb) => {
  process.nextTick(() => cb(new Error('should not chown')))
}, { sync: () => {
  throw new Error('should not chown')
} })

process.getuid = () => 0
process.getgid = () => 0

// make it fail on windows if it tries, as well
process.env.__TESTING_MKDIRP_INFER_OWNER_PLATFORM__ = 'posix'

const Arborist = t.mock('../../lib/arborist/index.js', { chownr })

const { resolve } = require('path')
t.test('reify a folder that does not exist', async t => {
  const path = resolve(t.testdir({}), 'does-not-exist-yet')
  const arb = new Arborist({ path })
  await arb.reify()
  t.pass('did not try to chown')
})

t.test('reify a folder that does exist, and has different owner', async t => {
  const path = t.testdir({ 'does-exist': {} })
  const arb = new Arborist({ path })
  await arb.reify()
  t.pass('did not try to chown')
})
