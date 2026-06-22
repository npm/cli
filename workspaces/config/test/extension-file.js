const t = require('tap')
const { join, resolve } = require('node:path')
const Config = require('../lib/index.js')
const { definitions, shorthands, flatten, nerfDarts } = require('../lib/definitions')

const npmPath = resolve(__dirname, '..')

// build a Config whose project (local prefix) is the testdir root, with optional npmrc per source
// --prefix forces the local prefix to the testdir, so the project .npmrc lives there
const loadConfig = async (t, { project, user, argv = [] } = {}) => {
  const dir = t.testdir({
    '.npmrc': project ?? '',
    'package.json': '{"name":"proj","version":"1.0.0"}',
    home: { '.npmrc': user ?? '' },
  })
  const config = new Config({
    npmPath,
    shorthands,
    definitions,
    flatten,
    nerfDarts,
    env: { HOME: join(dir, 'home') },
    argv: [process.execPath, __filename, '--prefix', dir, '--userconfig', join(dir, 'home/.npmrc'), ...argv],
    cwd: dir,
  })
  await config.load()
  return config
}

t.test('extension-file is accepted from project config', async t => {
  const config = await loadConfig(t, { project: 'extension-file=tools/ext.mjs' })
  t.equal(config.find('extension-file'), 'project', 'sourced from project')
  t.match(config.get('extension-file'), /tools[/\\]ext\.mjs$/, 'value resolved')
})

t.test('extension-file is accepted from the command line', async t => {
  const config = await loadConfig(t, { argv: ['--extension-file', 'tools/ext.cjs'] })
  t.equal(config.find('extension-file'), 'cli', 'sourced from cli')
})

t.test('extension-file from user config exposes its source for the consumer to reject', async t => {
  // the config layer loads it and records the source; the npm CLI enforces the source restriction
  const config = await loadConfig(t, { user: 'extension-file=tools/ext.mjs' })
  t.equal(config.find('extension-file'), 'user', 'source reported as user')
})

t.test('extension-file unset loads cleanly', async t => {
  const config = await loadConfig(t, {})
  t.equal(config.get('extension-file'), null, 'default null')
})

t.test('ignore-scripts implies ignoreExtension in flatOptions', async t => {
  const onlyScripts = await loadConfig(t, { project: 'ignore-scripts=true' })
  t.equal(onlyScripts.flat.ignoreExtension, true, 'ignore-scripts turns on ignoreExtension')
  t.equal(onlyScripts.flat.ignoreScripts, true, 'ignore-scripts still flattens itself')

  const neither = await loadConfig(t, {})
  t.equal(neither.flat.ignoreExtension, false, 'off by default')

  const onlyExt = await loadConfig(t, { project: 'ignore-extension=true' })
  t.equal(onlyExt.flat.ignoreExtension, true, 'ignore-extension alone works')
})
