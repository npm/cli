const t = require('tap')
const { join } = require('node:path')
const mockGlobals = require('@npmcli/mock-globals')
const tmock = require('../../fixtures/tmock')

// The tests that load real config get their own project, user and global
// npmrc, so the developer's npmrc files and cwd don't change the result.
// npm_config_prefix is cleared too, since `npm test` exports it.
const isolate = (t, userNpmrc = '') => {
  const dir = t.testdir({
    project: { 'package.json': '{}' },
    user: { npmrc: userNpmrc },
    global: { npmrc: '' },
  })
  mockGlobals(t, {
    'process.cwd': () => join(dir, 'project'),
    'process.env.npm_config_userconfig': join(dir, 'user', 'npmrc'),
    'process.env.npm_config_globalconfig': join(dir, 'global', 'npmrc'),
    'process.env.npm_config_prefix': undefined,
  })
  return dir
}

t.test('returns the global prefix from config', async t => {
  class Config {
    globalPrefix = '/global/prefix'

    async load () {}
  }
  const globalPrefix = tmock(t, '{LIB}/cli/global-prefix.js', { '@npmcli/config': Config })
  t.equal(await globalPrefix(), '/global/prefix')
})

t.test('rejects if config cannot be loaded', async t => {
  class Config {
    async load () {
      throw new Error('bad config')
    }
  }
  const globalPrefix = tmock(t, '{LIB}/cli/global-prefix.js', { '@npmcli/config': Config })
  await t.rejects(globalPrefix(), /bad config/)
})

t.test('leaves process.env alone, but keeps what others set during load', async t => {
  isolate(t, 'fund=false\n')
  mockGlobals(t, { 'process.env.npm_test_global_prefix_added': undefined })
  const before = { ...process.env }
  const globalPrefix = require('../../../lib/cli/global-prefix.js')
  const loading = globalPrefix()
  setImmediate(() => {
    process.env.npm_test_global_prefix_added = 'added'
  })
  await loading
  t.strictSame({ ...process.env }, { ...before, npm_test_global_prefix_added: 'added' })
})

t.test('honors the prefix config, as npm does', async t => {
  const dir = isolate(t)
  const prefix = join(dir, 'prefix')
  mockGlobals(t, { 'process.env.npm_config_prefix': prefix })
  const globalPrefix = require('../../../lib/cli/global-prefix.js')
  t.equal(await globalPrefix(), prefix)
})

t.test('expands ${VAR} in an npmrc without regard to case on Windows, as npm does', {
  skip: process.platform !== 'win32' && 'environment variable names are case-sensitive here',
}, async t => {
  const dir = isolate(t, 'prefix=${Npm_Test_Global_Prefix}\n')
  const prefix = join(dir, 'prefix')
  mockGlobals(t, { 'process.env.NPM_TEST_GLOBAL_PREFIX': prefix })
  const globalPrefix = require('../../../lib/cli/global-prefix.js')
  t.equal(await globalPrefix(), prefix)
})
