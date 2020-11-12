const t = require('tap')
const none = {}
const lifecycleCmd = t.mock('../../../lib/utils/lifecycle-cmd.js', {
  '../../../lib/npm.js': {
    commands: {
      run: (args, cb) => cb(null, 'called npm.commands.run'),
    },
  },
  '../../../lib/utils/completion/none.js': none,
})

t.test('create a lifecycle command', t => {
  const cmd = lifecycleCmd('asdf')
  t.equal(cmd.completion, none, 'empty completion')
  cmd(['some', 'args'], (er, result) => {
    t.strictSame(result, 'called npm.commands.run')
    t.end()
  })
})
