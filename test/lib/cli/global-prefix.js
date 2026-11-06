const t = require('tap')
const { resolve } = require('node:path')
const mockGlobals = require('@npmcli/mock-globals')
const tmock = require('../../fixtures/tmock')

const ROOT = resolve(__dirname, '../../..')

t.test('loads config like npm, without argv, and returns the global prefix', async t => {
  const created = []
  class Config {
    constructor (opts) {
      created.push(opts)
      this.globalPrefix = '/global/prefix'
    }

    async load () {}
  }
  const globalPrefix = tmock(t, '{LIB}/cli/global-prefix.js', { '@npmcli/config': Config })
  t.equal(await globalPrefix(), '/global/prefix')
  t.equal(created.length, 1)
  t.match(created[0], {
    npmPath: ROOT,
    argv: [],
    definitions: Object,
    flatten: Function,
    shorthands: Object,
    excludeNpmCwd: false,
    env: { ...process.env },
  })
  t.not(created[0].env, process.env, 'config gets a copy of the environment')
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

t.test('honors the prefix config, as npm does', async t => {
  const prefix = t.testdir({})
  mockGlobals(t, { 'process.env.npm_config_prefix': prefix })
  const globalPrefix = require('../../../lib/cli/global-prefix.js')
  t.equal(await globalPrefix(), prefix)
})

t.test('leaves process.env alone for the npm that runs next', async t => {
  mockGlobals(t, { 'process.env': { ...process.env } })
  const before = { ...process.env }
  const globalPrefix = require('../../../lib/cli/global-prefix.js')
  await globalPrefix()
  t.strictSame({ ...process.env }, before)
})
