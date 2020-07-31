const requireInject = require('require-inject')
const outputLog = []

const flatOptions = {
  json: false
}

const npmMock = { flatOptions, version: '7.8.9-bogus', prefix: '/boop' }

const version = requireInject('../../lib/version.js', {
  libnpmversion: async (newv, opts) => {
    if (newv === 'throw') {
      throw new Error('synthetic')
    }
    return newv
  },
  '../../lib/utils/output.js': (...msg) => outputLog.push(msg),
  '../../lib/npm.js': npmMock
})

const t = require('tap')
t.test('no args dumps pkg, npm, and node versions', t => {
  t.test('version with no args, in pkg dir', t => {
    const pkgDir = t.testdir({
      'package.json': JSON.stringify({
        name: 'foo',
        version: '1.2.3'
      })
    })
    npmMock.prefix = pkgDir
    t.teardown(() => npmMock.prefix = '/boop')
    version([], er => {
      if (er) {
        throw er
      }
      t.strictSame(outputLog, [
        [ { foo: '1.2.3', npm: '7.8.9-bogus', ...process.versions } ]
      ])
      outputLog.length = 0
      t.end()
    })
  })

  t.test('version with no args, no pkg dir', t => {
    version([], er => {
      if (er) {
        throw er
      }
      t.strictSame(outputLog, [
        [ { ...process.versions, npm: '7.8.9-bogus' } ]
      ])
      outputLog.length = 0
      t.end()
    })
  })

  t.test('version with no args, no pkg dir, json', t => {
    npmMock.flatOptions.json = true
    version([], er => {
      if (er) {
        throw er
      }
      t.strictSame(outputLog, [
        [ JSON.stringify({ npm: '7.8.9-bogus', ...process.versions }, null, 2) ]
      ])
      outputLog.length = 0
      t.end()
    })
  })
  t.end()
})

t.test('calls libnpmversion if there is one arg', t => {
  version(['argument'], er => {
    if (er) {
      throw er
    }
    t.strictSame(outputLog[0], ['argument'])
    outputLog.length = 0
    t.end()
  })
})

t.test('fails if libnpmversion fails', t => {
  version(['throw'], er => {
    t.match(er, { message: 'synthetic' })
    t.end()
  })
})

t.test('usage if too many args', t => {
  version(['a', 'b', 'c'], er => {
    t.equal(er, version.usage)
    t.end()
  })
})
