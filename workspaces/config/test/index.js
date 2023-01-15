const t = require('tap')
const { join } = require('path')
const mockGlobals = require('@npmcli/mock-globals')
const configPath = require.resolve('..')

const setup = async (t, {
  user = {},
  global = {},
  project = {},
  builtin = {},
  chdir = 'root',
} = {}) => {
  const cwd = process.cwd()

  const root = t.testdir({
    user,
    global,
    project,
    builtin,
  })

  mockGlobals(t, {
    'process.env': { HOME: join(root, 'user') },
  }, { replace: true })

  process.chdir(join(root, chdir === 'root' ? '' : chdir))
  t.teardown(() => process.chdir(cwd))

  const Config = t.mock(configPath)

  const config = new Config({
    builtinRoot: join(root, 'builtin'),
    localPrefixRoot: root,
    argv: [process.execPath, 'index.js'],
  })
  return config
}

t.test('basic', async t => {
  const config = await setup(t)
  await config.load()
  console.log(config.data)
  t.ok(1)
})
