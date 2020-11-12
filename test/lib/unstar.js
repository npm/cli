const t = require('tap')

t.test('unstar', t => {
  t.plan(3)

  const unstar = t.mock('../../lib/unstar.js', {
    '../../lib/npm.js': {
      config: {
        set: (key, value) => {
          t.equal(key, 'star.unstar', 'should set unstar config value')
          t.equal(value, true, 'should set a truthy value')
        },
      },
      commands: {
        star: (args, cb) => {
          t.deepEqual(args, ['pkg'], 'should forward packages')
          cb()
        },
      },
    },
  })

  unstar(['pkg'], err => {
    if (err)
      throw err
  })
})
