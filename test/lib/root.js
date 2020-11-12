const t = require('tap')

t.test('root', (t) => {
  t.plan(3)
  const dir = '/root/dir'

  const root = t.mock('../../lib/root.js', {
    '../../lib/npm.js': { dir },
    '../../lib/utils/output.js': (output) => {
      t.equal(output, dir, 'prints the correct directory')
    },
  })

  root([], (err) => {
    t.ifError(err, 'npm root')
    t.ok('should have printed directory')
  })
})
