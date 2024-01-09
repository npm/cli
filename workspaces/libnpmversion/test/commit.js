const t = require('tap')
const requireInject = require('require-inject')
const commit = requireInject('../lib/commit.js', {
  '@npmcli/git': { spawn: args => args.slice(1) },
})

t.test('generate args from options', async t => {
  t.matchSnapshot(await commit('1.2.3', {
    message: 'v%s',
  }), 'default options')
  t.matchSnapshot(await commit('1.2.3', {
    commitHooks: false,
    allowSameVersion: true,
    signGitCommit: true,
    message: 'hello, %s, this is a message for you about %s.',
  }), 'non-default options')
})
