const t = require('tap')
const requireInject = require('require-inject')
const tag = requireInject('../lib/tag.js', {
  '@npmcli/git': { spawn: args => args.slice(1) },
})

t.test('generate args from options', async t => {
  t.matchSnapshot(await tag('1.2.3', {
    message: 'v%s',
  }), 'default options')
  t.matchSnapshot(await tag('1.2.3', {
    signGitTag: true,
    allowSameVersion: true,
    message: 'hello, %s, this is a message for you about %s.',
  }), 'non-default options')
})
