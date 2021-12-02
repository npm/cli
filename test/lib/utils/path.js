const t = require('tap')
const { delimiter } = require('path')
const mockGlobals = require('../../fixtures/mock-globals')

const mockPath = (t, key, parts) => {
  if (key) {
    // Dont use mockGlobals here since that normalizes this behavior across platforms
    process.env[key] = parts.join(delimiter)
    t.teardown(() => delete process.env[key])
  }
  t.match([key].filter(Boolean), Object.keys(process.env))
  t.match(t.mock('../../../lib/utils/path.js'), {
    PATH: parts,
    key: key,
    value: parts.join(delimiter),
  }, key)
}

t.before(() => {
  mockGlobals(t, { 'process.env': {} }, { replace: true })
  t.strictSame(process.env, {})
})

t.test('PATH', async (t) => mockPath(t, 'PATH', ['foo', 'bar', 'baz']))
t.test('Path', async (t) => mockPath(t, 'Path', ['a', 'b', 'c']))
t.test('path', async (t) => mockPath(t, 'path', ['x', 'y', 'z']))
t.test('undefined', async (t) => mockPath(t, undefined, []))
