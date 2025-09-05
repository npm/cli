const typeDefs = require('../lib/type-defs.js')
const t = require('tap')
const {
  semver: {
    validate: validateSemver,
  },
  path: {
    validate: validatePath,
  },
} = typeDefs
const { resolve } = require('node:path')

const d = { semver: 'foobar', somePath: true }
t.equal(validateSemver(d, 'semver', 'foobar'), false)
t.equal(validateSemver(d, 'semver', 'v1.2.3'), undefined)
t.equal(d.semver, '1.2.3')
t.equal(validatePath(d, 'somePath', true), false)
t.equal(validatePath(d, 'somePath', false), false)
t.equal(validatePath(d, 'somePath', null), false)
t.equal(validatePath(d, 'somePath', 1234), false)
t.equal(validatePath(d, 'somePath', 'false'), true)
t.equal(d.somePath, resolve('false'))

// Test Windows drive letter normalization to achieve 100% coverage
if (process.platform === 'win32') {
  const winData = {}
  // This should hit the normalization code path and line 31
  t.equal(validatePath(winData, 'testPath', 'c:\\test'), true)
  t.equal(winData.testPath, 'C:\\test')
  
  // Test that already uppercase drive letter works normally  
  const winData2 = {}
  t.equal(validatePath(winData2, 'testPath2', 'C:\\test'), true)
  t.equal(winData2.testPath2, 'C:\\test')
}
