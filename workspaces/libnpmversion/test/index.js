// just verify it sets up the default options correctly
const t = require('tap')
const requireInject = require('require-inject')
const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')
const index = requireInject('../lib/index.js', {
  '../lib/version.js': (newversion, opts) => [newversion, opts],
  '../lib/read-json.js': () => ({
    name: 'package from rj',
    [kIndent]: '  ',
    [kNewline]: '\n',
  }),
})

t.cleanSnapshot = s => s.split(process.cwd()).join('{CWD}')
  .split(process.cwd().replace(/\\/g, '\\\\')).join('{CWD}')

t.test('all the defaults', async t =>
  t.matchSnapshot(await index('from-git')))

t.test('set the package ahead of time', async t =>
  t.matchSnapshot(await index('major', {
    pkg: { name: 'package set in options' },
    path: '/some/path',
    cwd: 'different cwd, this should not show up',
    allowSameVersion: true,
    tagVersionPrefix: '=',
    commitHooks: false,
    gitTagVersion: false,
    signGitCommit: true,
    signGitTag: true,
    force: true,
    ignoreScripts: true,
    scriptShell: '/bin/bash',
    preid: 'rc',
    message: 'hello, i have a message for you',
    someOtherRandomField: 'this should not show up',
  })))
