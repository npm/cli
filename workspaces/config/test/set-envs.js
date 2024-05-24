const setEnvs = require('../lib/set-envs.js')
const mockGlobals = require('@npmcli/mock-globals')

const { join } = require('node:path')
const t = require('tap')
const { execPath } = process
const cwd = process.cwd()
const globalPrefix = join(cwd, 'global')
const localPrefix = join(cwd, 'local')
const NODE = execPath

const npmPath = '{path}'
const npmBin = join(npmPath, 'bin/npm-cli.js')

const mockDefinitions = (t) => {
  mockGlobals(t, { 'process.env': { EDITOR: 'vim' } })
  const { definitions, defaults } = t.mock('../lib/definitions/index.js')
  return { definitions, defaults }
}

t.test('set envs that are not defaults and not already in env', t => {
  const { definitions, defaults } = mockDefinitions(t)
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const extras = {
    NODE,
    INIT_CWD: cwd,
    EDITOR: 'vim',
    HOME: undefined,
    npm_execpath: npmBin,
    npm_node_execpath: execPath,
    npm_config_global_prefix: globalPrefix,
    npm_config_local_prefix: localPrefix,
  }

  const env = {}
  const config = {
    list: [cliConf, envConf],
    env,
    defaults,
    definitions,
    execPath,
    globalPrefix,
    localPrefix,
    npmPath,
    npmBin,
  }

  setEnvs(config)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')
  envConf.call = 'me, maybe'
  setEnvs(config)
  t.strictSame(env, { ...extras }, 'no new environment vars to create, already in env')
  delete envConf.call
  cliConf.call = 'me, maybe'
  setEnvs(config)
  t.strictSame(env, {
    ...extras,
    npm_config_call: 'me, maybe',
  }, 'set in env, because changed from default in cli')
  envConf.call = 'me, maybe'
  cliConf.call = ''
  cliConf['node-options'] = 'some options for node'
  setEnvs(config)
  t.strictSame(env, {
    ...extras,
    npm_config_call: '',
    npm_config_node_options: 'some options for node',
    NODE_OPTIONS: 'some options for node',
  }, 'set in env, because changed from default in env, back to default in cli')
  t.end()
})

t.test('set envs that are not defaults and not already in env, array style', t => {
  const { definitions, defaults } = mockDefinitions(t)
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const extras = {
    NODE,
    INIT_CWD: cwd,
    EDITOR: 'vim',
    HOME: undefined,
    npm_execpath: npmBin,
    npm_node_execpath: execPath,
    npm_config_global_prefix: globalPrefix,
    npm_config_local_prefix: localPrefix,
  }
  // make sure it's not sticky
  const env = { INIT_CWD: '/some/other/path' }
  const config = {
    list: [cliConf, envConf],
    env,
    defaults,
    definitions,
    execPath,
    globalPrefix,
    localPrefix,
    npmPath,
    npmBin,
  }
  setEnvs(config)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')

  envConf.omit = ['dev']
  setEnvs(config)
  t.strictSame(env, { ...extras }, 'no new environment vars to create, already in env')
  delete envConf.omit
  cliConf.omit = ['dev', 'optional']
  setEnvs(config)
  t.strictSame(env, {
    ...extras,
    npm_config_omit: 'dev\n\noptional',
  }, 'set in env, because changed from default in cli')
  envConf.omit = ['optional', 'peer']
  cliConf.omit = []
  setEnvs(config)
  t.strictSame(env, {
    ...extras,
    npm_config_omit: '',
  }, 'set in env, because changed from default in env, back to default in cli')
  t.end()
})

t.test('set envs that are not defaults and not already in env, boolean edition', t => {
  const { definitions, defaults } = mockDefinitions(t)
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const extras = {
    NODE,
    INIT_CWD: cwd,
    EDITOR: 'vim',
    HOME: undefined,
    npm_execpath: npmBin,
    npm_node_execpath: execPath,
    npm_config_global_prefix: globalPrefix,
    npm_config_local_prefix: localPrefix,
  }

  const env = {}
  const config = {
    list: [cliConf, envConf],
    env,
    defaults,
    definitions,
    execPath,
    globalPrefix,
    localPrefix,
    npmPath,
    npmBin,
  }
  setEnvs(config)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')
  envConf.audit = false
  setEnvs(config)
  t.strictSame(env, { ...extras }, 'no new environment vars to create, already in env')
  delete envConf.audit
  cliConf.audit = false
  cliConf.ignoreObjects = {
    some: { object: 12345 },
  }
  setEnvs(config)
  t.strictSame(env, {
    ...extras,
    npm_config_audit: '',
  }, 'set in env, because changed from default in cli')
  envConf.audit = false
  cliConf.audit = true
  setEnvs(config)
  t.strictSame(env, {
    ...extras,
    npm_config_audit: 'true',
  }, 'set in env, because changed from default in env, back to default in cli')
  t.end()
})

t.test('set npm_execpath even if require.main.filename is not set', t => {
  const { definitions, defaults } = mockDefinitions(t)
  const { filename } = require.main
  t.teardown(() => require.main.filename = filename)
  require.main.filename = null
  // also, don't set editor
  const d = { ...defaults, editor: null }
  const envConf = Object.create(d)
  const cliConf = Object.create(envConf)
  const env = { DESTDIR: '/some/dest' }
  const config = {
    list: [cliConf, envConf],
    env,
    defaults: d,
    definitions,
    execPath,
    globalPrefix,
    localPrefix,
    npmBin,
  }
  setEnvs(config)
  t.equal(env.npm_execpath, npmBin, 'did not set npm_execpath')
  t.end()
})

t.test('dont set configs marked as envExport:false', t => {
  const { definitions, defaults } = mockDefinitions(t)
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const extras = {
    NODE,
    INIT_CWD: cwd,
    EDITOR: 'vim',
    HOME: undefined,
    npm_execpath: npmBin,
    npm_node_execpath: execPath,
    npm_config_global_prefix: globalPrefix,
    npm_config_local_prefix: localPrefix,
  }

  const env = {}
  const config = {
    list: [cliConf, envConf],
    env,
    defaults,
    definitions,
    execPath,
    globalPrefix,
    localPrefix,
    npmPath,
    npmBin,
  }
  setEnvs(config)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')
  cliConf['include-workspace-root'] = true
  setEnvs(config)
  t.strictSame(env, { ...extras }, 'not exported, because envExport=false')
  t.end()
})
