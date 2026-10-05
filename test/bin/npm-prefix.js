const t = require('tap')
const mockGlobals = require('@npmcli/mock-globals')
const tmock = require('../fixtures/tmock')

const mockPrefix = async (t, globalPrefix) => {
  const logs = []
  const errors = []
  const exits = []
  mockGlobals(t, {
    'console.log': (...msg) => logs.push(msg),
    'console.error': (...msg) => errors.push(msg),
    'process.exit': (code) => exits.push(code),
  })
  tmock(t, '{BIN}/npm-prefix.js', { '{LIB}/cli/global-prefix.js': globalPrefix })
  await new Promise(resolve => setImmediate(resolve))
  return { logs, errors, exits }
}

t.test('prints the global prefix', async t => {
  const { logs, errors, exits } = await mockPrefix(t, async () => '/global/prefix')
  t.strictSame(logs, [['/global/prefix']])
  t.strictSame(errors, [])
  t.strictSame(exits, [])
})

t.test('exits 1 if the global prefix cannot be determined', async t => {
  const err = new Error('bad config')
  const { logs, errors, exits } = await mockPrefix(t, async () => {
    throw err
  })
  t.strictSame(logs, [])
  t.strictSame(errors, [[err]])
  t.strictSame(exits, [1])
})
