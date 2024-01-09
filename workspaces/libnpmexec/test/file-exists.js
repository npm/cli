const t = require('tap')
const { localFileExists } = require('../lib/file-exists.js')

t.test('missing root value', async t => {
  const dir = t.testdir({
    b: {
      c: {},
    },
  })

  // root value a is not part of the file system hierarchy
  const fileExists = await localFileExists(dir, 'foo', 'a')
  t.equal(fileExists, false, 'should return false on missing root')
})
