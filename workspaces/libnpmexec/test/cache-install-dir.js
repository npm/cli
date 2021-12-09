const t = require('tap')

const cacheInstallDir = require('../lib/cache-install-dir.js')

t.test('invalid npxCache path', t => {
  t.throws(
    () => cacheInstallDir({}),
    /Must provide a valid npxCache path/,
    'should throw invalid path error'
  )
  t.end()
})
