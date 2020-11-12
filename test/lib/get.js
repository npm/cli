const t = require('tap')

t.test('should retrieve values from npm.commands.config', (t) => {
  const get = t.mock('../../lib/get.js', {
    '../../lib/npm.js': {
      commands: {
        config: ([action, arg]) => {
          t.equal(action, 'get', 'should use config get action')
          t.equal(arg, 'foo', 'should use expected key')
          t.end()
        },
      },
    },
  })

  get(['foo'])
})
