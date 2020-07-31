const t = require('tap')
const requireInject = require('require-inject')
const npx = require.resolve('../../bin/npx-cli.js')
const cli = require.resolve('../../lib/cli.js')
const npm = require.resolve('../../bin/npm-cli.js')

t.test('npx foo -> npm exec -- foo', t => {
  process.argv = ['node', npx, 'foo']
  requireInject(npx, { [cli]: () => {} })
  t.strictSame(process.argv, ['node', npm, 'exec', '--', 'foo'])
  t.end()
})

t.test('npx -- foo -> npm exec -- foo', t => {
  process.argv = ['node', npx, '--', 'foo']
  requireInject(npx, { [cli]: () => {} })
  t.strictSame(process.argv, ['node', npm, 'exec', '--', 'foo'])
  t.end()
})

t.test('npx -x y foo -z -> npm exec -x y -- foo -z', t => {
  process.argv = ['node', npx, '-x', 'y', 'foo', '-z']
  requireInject(npx, { [cli]: () => {} })
  t.strictSame(process.argv, ['node', npm, 'exec', '-x', 'y', '--', 'foo', '-z'])
  t.end()
})

t.test('npx --x=y foo -z -> npm exec --x=y -- foo -z', t => {
  process.argv = ['node', npx, '--x=y', 'foo', '-z']
  requireInject(npx, { [cli]: () => {} })
  t.strictSame(process.argv, ['node', npm, 'exec', '--x=y', '--', 'foo', '-z'])
  t.end()
})
