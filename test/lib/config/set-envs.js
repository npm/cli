const t = require('tap')
const setEnvs = require('../../../lib/config/set-envs.js')
const { defaults } = require('../../../lib/config/defaults.js')

t.test('set envs that are not defaults and not already in env', t => {
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const npm = {
    config: {
      list: [cliConf, envConf]
    }
  }
  const extras = {
    npm_execpath: require.main.filename,
    npm_node_execpath: process.execPath,
    npm_command: undefined
  }
  const env = {}
  setEnvs(npm, env)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')
  envConf.call = 'me, maybe'
  setEnvs(npm, env)
  t.strictSame(env, { ...extras }, 'no new environment vars to create, already in env')
  delete envConf.call
  cliConf.call = 'me, maybe'
  setEnvs(npm, env)
  t.strictSame(env, {
    ...extras,
    npm_config_call: 'me, maybe'
  }, 'set in env, because changed from default in cli')
  envConf.call = 'me, maybe'
  cliConf.call = ''
  cliConf['node-options'] = 'some options for node'
  setEnvs(npm, env)
  t.strictSame(env, {
    ...extras,
    npm_config_call: '',
    npm_config_node_options: 'some options for node',
    NODE_OPTIONS: 'some options for node'
  }, 'set in env, because changed from default in env, back to default in cli')
  t.end()
})

t.test('set envs that are not defaults and not already in env, array style', t => {
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const npm = {
    config: {
      list: [cliConf, envConf]
    }
  }
  const extras = {
    npm_execpath: require.main.filename,
    npm_node_execpath: process.execPath,
    npm_command: undefined
  }
  const env = {}
  setEnvs(npm, env)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')
  envConf.omit = ['dev']
  setEnvs(npm, env)
  t.strictSame(env, { ...extras }, 'no new environment vars to create, already in env')
  delete envConf.omit
  cliConf.omit = ['dev', 'optional']
  setEnvs(npm, env)
  t.strictSame(env, {
    ...extras,
    npm_config_omit: 'dev\n\noptional'
  }, 'set in env, because changed from default in cli')
  envConf.omit = ['optional', 'peer']
  cliConf.omit = []
  setEnvs(npm, env)
  t.strictSame(env, {
    ...extras,
    npm_config_omit: ''
  }, 'set in env, because changed from default in env, back to default in cli')
  t.end()
})

t.test('set envs that are not defaults and not already in env, boolean edition', t => {
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const npm = {
    config: {
      list: [cliConf, envConf]
    }
  }
  const extras = {
    npm_execpath: require.main.filename,
    npm_node_execpath: process.execPath,
    npm_command: undefined
  }
  const env = {}
  setEnvs(npm, env)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')
  envConf.audit = false
  setEnvs(npm, env)
  t.strictSame(env, { ...extras }, 'no new environment vars to create, already in env')
  delete envConf.audit
  cliConf.audit = false
  cliConf.ignoreObjects = {
    some: { object: 12345 }
  }
  setEnvs(npm, env)
  t.strictSame(env, {
    ...extras,
    npm_config_audit: ''
  }, 'set in env, because changed from default in cli')
  envConf.audit = false
  cliConf.audit = true
  setEnvs(npm, env)
  t.strictSame(env, {
    ...extras,
    npm_config_audit: 'true'
  }, 'set in env, because changed from default in env, back to default in cli')
  t.end()
})

t.test('default to process.env', t => {
  const envConf = Object.create(defaults)
  const cliConf = Object.create(envConf)
  const npm = {
    config: {
      list: [cliConf, envConf]
    }
  }
  const extras = {
    npm_execpath: require.main.filename,
    npm_node_execpath: process.execPath,
    npm_command: undefined
  }
  const env = {}
  const envDescriptor = Object.getOwnPropertyDescriptor(process, 'env')
  Object.defineProperty(process, 'env', {
    value: env,
    configurable: true,
    enumerable: true,
    writable: true
  })
  t.teardown(() => Object.defineProperty(process, env, envDescriptor))

  setEnvs(npm)
  t.strictSame(env, { ...extras }, 'no new environment vars to create')
  envConf.audit = false
  setEnvs(npm)
  t.strictSame(env, { ...extras }, 'no new environment vars to create, already in env')
  delete envConf.audit
  cliConf.audit = false
  cliConf.ignoreObjects = {
    some: { object: 12345 }
  }
  setEnvs(npm)
  t.strictSame(env, {
    ...extras,
    npm_config_audit: ''
  }, 'set in env, because changed from default in cli')
  envConf.audit = false
  cliConf.audit = true
  setEnvs(npm)
  t.strictSame(env, {
    ...extras,
    npm_config_audit: 'true'
  }, 'set in env, because changed from default in env, back to default in cli')
  t.end()
})
