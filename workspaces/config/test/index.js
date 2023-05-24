const t = require('tap')

const fs = require('fs')
const { readFileSync } = fs

// when running with `npm test` it adds environment variables that
// mess with the things we expect here, so delete all of those.
Object.keys(process.env)
  .filter(k => /^npm_/.test(k))
  .forEach(k => delete process.env[k])
delete process.env.PREFIX
delete process.env.DESTDIR

const Definition = require('../lib/definitions/definition.js')
const createDef = (key, value) => ({ [key]: new Definition(key, { key, ...value }) })

const typeDefs = require('../lib/type-defs.js')

const { resolve, join, dirname } = require('path')

const fsMocks = {
  'fs/promises': {
    ...fs.promises,
    readFile: async (path, ...args) => {
      if (path.includes('WEIRD-ERROR')) {
        throw Object.assign(new Error('weird error'), { code: 'EWEIRD' })
      }

      return fs.promises.readFile(path, ...args)
    },
  },
  fs: {
    ...fs,
    readFileSync: (path, ...args) => {
      if (path.includes('WEIRD-ERROR')) {
        throw Object.assign(new Error('weird error'), { code: 'EWEIRD' })
      }

      return fs.readFileSync(path, ...args)
    },
  },
}

const { definitions, shorthands, flatten } = t.mock('../lib/definitions/index.js', fsMocks)
const Config = t.mock('../', fsMocks)

// because we used t.mock above, the require cache gets blown and we lose our direct equality
// on the typeDefs. to get around that, we require an un-mocked Config and assert against that
const RealConfig = require('../')

t.equal(typeDefs, RealConfig.typeDefs, 'exposes type definitions')

t.test('construct with no settings, get default values for stuff', t => {
  const npmPath = t.testdir()
  const c = new Config({
    definitions: {},
    npmPath,
  })

  t.test('default some values from process object', t => {
    const { env, execPath, platform } = process
    const cwd = process.cwd()
    t.equal(c.env, env, 'env')
    t.equal(c.execPath, execPath, 'execPath')
    t.equal(c.cwd, cwd, 'cwd')
    t.equal(c.platform, platform, 'platform')
    t.end()
  })

  t.test('not loaded yet', t => {
    t.equal(c.loaded, false, 'not loaded yet')
    t.throws(() => c.get('foo'), {
      message: 'call config.load() before reading values',
    })
    t.throws(() => c.find('foo'), {
      message: 'call config.load() before reading values',
    })
    t.throws(() => c.set('foo', 'bar'), {
      message: 'call config.load() before setting values',
    })
    t.throws(() => c.delete('foo'), {
      message: 'call config.load() before deleting values',
    })
    t.rejects(() => c.save('user'), {
      message: 'call config.load() before saving',
    })
    t.throws(() => c.data.set('user', {}), {
      message: 'cannot change internal config data structure',
    })
    t.throws(() => c.data.delete('user'), {
      message: 'cannot change internal config data structure',
    })
    t.end()
  })

  t.test('data structure all wired up properly', t => {
    // verify that the proto objects are all wired up properly
    c.list.forEach((data, i) => {
      t.equal(Object.getPrototypeOf(data), c.list[i + 1] || null)
    })
    t.equal(c.data.get('default').data, c.list[c.list.length - 1])
    t.equal(c.data.get('cli').data, c.list[0])
    t.end()
  })

  t.end()
})

t.test('load from files and environment variables', t => {
  // need to get the dir because we reference it in the contents
  const path = t.testdir()
  t.testdir({
    npm: {
      npmrc: `
builtin-config = true
foo = from-builtin
userconfig = ${path}/user/.npmrc-from-builtin
`,
    },
    global: {
      etc: {
        npmrc: `
global-config = true
foo = from-global
userconfig = ${path}/should-not-load-this-file
`,
      },
    },
    user: {
      '.npmrc': `
default-user-config-in-home = true
foo = from-default-userconfig
prefix = ${path}/global
`,
      '.npmrc-from-builtin': `
user-config-from-builtin = true
foo = from-custom-userconfig
globalconfig = ${path}/global/etc/npmrc
`,
    },
    project: {
      node_modules: {},
      '.npmrc': `
project-config = true
foo = from-project-config
loglevel = yolo
`,
    },
    'project-no-config': {
      'package.json': '{"name":"@scope/project"}',
    },
  })

  const logs = []
  const logHandler = (...args) => logs.push(args)
  process.on('log', logHandler)
  t.teardown(() => process.off('log', logHandler))

  const argv = [
    process.execPath,
    __filename,
    '-v',
    '--no-audit',
    'config',
    'get',
    'foo',
    '--also=dev',
    '--registry=hello',
    '--proxy=hello',
    '--omit=cucumber',
    '--access=blueberry',
    '--multiple-numbers=what kind of fruit is not a number',
    '--multiple-numbers=a baNaNa!!',
    '-C',
  ]

  t.test('dont let userconfig be the same as builtin config', async t => {
    const config = new Config({
      npmPath: `${path}/npm`,
      env: {},
      argv: [process.execPath, __filename, '--userconfig', `${path}/npm/npmrc`],
      cwd: join(`${path}/project`),
      shorthands,
      definitions,
    })
    await t.rejects(() => config.load(), {
      message: `double-loading config "${resolve(path, 'npm/npmrc')}" as "user",` +
       ' previously loaded as "builtin"',
    })
  })

  t.test('dont load project config if global is true', async t => {
    const config = new Config({
      npmPath: `${path}/npm`,
      env: {},
      argv: [process.execPath, __filename, '--global'],
      cwd: join(`${path}/project`),
      shorthands,
      definitions,
    })

    await config.load()
    const source = config.data.get('project').source
    t.equal(source, '(global mode enabled, ignored)', 'data has placeholder')
    t.equal(config.sources.get(source), 'project', 'sources has project')
  })

  t.test('dont load project config if location is global', async t => {
    const config = new Config({
      npmPath: `${path}/npm`,
      env: {},
      argv: [process.execPath, __filename, '--location', 'global'],
      cwd: join(`${path}/project`),
      shorthands,
      definitions,
    })

    await config.load()
    const source = config.data.get('project').source
    t.equal(source, '(global mode enabled, ignored)', 'data has placeholder')
    t.equal(config.sources.get(source), 'project', 'sources has project')
    t.ok(config.localPrefix, 'localPrefix is set')
  })

  t.test('verbose log if config file read is weird error', async t => {
    const config = new Config({
      npmPath: path,
      env: {},
      argv: [process.execPath,
        __filename,
        '--userconfig',
        `${path}/WEIRD-ERROR`,
        '--no-workspaces'],
      cwd: path,
      shorthands,
      definitions,
    })
    logs.length = 0
    await config.load()
    t.match(logs, [['verbose', 'config', 'error loading user config', {
      message: 'weird error',
    }]])
    logs.length = 0
  })

  t.test('load configs from all files, cli, and env', async t => {
    const env = {
      npm_config_foo: 'from-env',
      npm_config_global: '',
      npm_config_prefix: '/something',
    }
    const config = new Config({
      npmPath: `${path}/npm`,
      env,
      argv,
      cwd: join(`${path}/project`),
      shorthands,
      definitions: {
        ...definitions,
        ...createDef('multiple-numbers', {
          default: [],
          type: [Array, Number],
          description: 'one or more numbers',
        }),
        ...createDef('methane', {
          envExport: false,
          type: String,
          typeDescription: 'Greenhouse Gas',
          default: 'CH4',
          description: `
            This is bad for the environment, for our children, do not put it there.
          `,
        }),
      },
    })

    t.equal(config.globalPrefix, null, 'globalPrefix missing before load')

    await config.load()

    t.equal(config.globalPrefix, resolve('/something'), 'env-defined prefix should be loaded')

    t.equal(config.get('global', 'env'), undefined, 'empty env is missing')
    t.equal(config.get('global'), false, 'empty env is missing')

    config.set('asdf', 'quux', 'global')
    await config.save('global')
    const gres = readFileSync(`${path}/global/etc/npmrc`, 'utf8')
    t.match(gres, 'asdf=quux')

    const cliData = config.data.get('cli')
    t.throws(() => cliData.loadError = true, {
      message: 'cannot set ConfigData loadError after load',
    })
    t.throws(() => cliData.source = 'foo', {
      message: 'cannot set ConfigData source more than once',
    })
    t.throws(() => cliData.raw = 1234, {
      message: 'cannot set ConfigData raw after load',
    })

    config.argv = []

    t.throws(() => config.loadCLI(), {
      message: 'double-loading "cli" configs from command line options, previously loaded from' +
      ' command line options',
    })
    t.rejects(() => config.loadUserConfig(), {
      message: `double-loading "user" configs from ${resolve(path, 'should-not-load-this-file')}` +
      `, previously loaded from ${resolve(path, 'user/.npmrc-from-builtin')}`,
    })

    t.equal(config.loaded, true, 'config is loaded')

    await t.rejects(() => config.load(), {
      message: 'attempting to load npm config multiple times',
    })
    t.equal(config.find('no config value here'), null)

    t.equal(config.prefix, config.localPrefix, 'prefix is local prefix when not global')
    config.set('global', true)
    t.equal(config.prefix, config.globalPrefix, 'prefix is global prefix when global')
    config.set('global', false)
    t.equal(config.find('global'), 'cli')
    config.delete('global')
    t.equal(config.find('global'), 'default')

    t.throws(() => config.get('foo', 'barbaz'), {
      message: 'invalid config location param: barbaz',
    })
    t.throws(() => config.set('foo', 1234, 'barbaz'), {
      message: 'invalid config location param: barbaz',
    })
    t.throws(() => config.delete('foo', 'barbaz'), {
      message: 'invalid config location param: barbaz',
    })

    t.match(config.sources, new Map([
      ['default values', 'default'],
      [resolve(path, 'npm/npmrc'), 'builtin'],
      ['command line options', 'cli'],
      ['environment', 'env'],
      [resolve(path, 'project/.npmrc'), 'project'],
      [resolve(path, 'user/.npmrc-from-builtin'), 'user'],
      [resolve(path, 'global/etc/npmrc'), 'global'],
    ]))

    t.strictSame({
      version: config.get('version'),
      audit: config.get('audit'),
      'project-config': config.get('project-config'),
      foo: config.get('foo'),
      'user-config-from-builtin': config.get('user-config-from-builtin'),
      'global-config': config.get('global-config'),
      'builtin-config': config.get('builtin-config'),
      all: config.get('all'),
    }, {
      version: true,
      audit: false,
      'project-config': true,
      foo: 'from-env',
      'user-config-from-builtin': true,
      'global-config': true,
      'builtin-config': true,
      all: config.get('all'),
    })

    t.match(env, {
      npm_config_user_config_from_builtin: 'true',
      npm_config_audit: '',
      npm_config_version: 'true',
      npm_config_foo: 'from-env',
      npm_config_builtin_config: 'true',
    }, 'set env values')

    // warn logs are emitted as a side effect of validate
    config.validate()
    t.strictSame(logs, [
      ['warn', 'invalid config', 'registry="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'proxy="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'omit="cucumber"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more of:', 'dev, optional, peer'],
      ['warn', 'invalid config', 'access="blueberry"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one of:', 'null, restricted, public'],
      ['warn', 'invalid config', 'multiple-numbers="what kind of fruit is not a number"',
        'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more', 'numeric value'],
      ['warn', 'invalid config', 'multiple-numbers="a baNaNa!!"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more', 'numeric value'],
      ['warn', 'invalid config', 'prefix=true', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'valid filesystem path'],
      ['warn', 'config', 'also', 'Please use --include=dev instead.'],
      ['warn', 'invalid config', 'loglevel="yolo"',
        `set in ${resolve(path, 'project/.npmrc')}`],
      ['warn', 'invalid config', 'Must be one of:',
        ['silent', 'error', 'warn', 'notice', 'http', 'info', 'verbose', 'silly'].join(', '),
      ],
    ])
    t.equal(config.valid, false)
    logs.length = 0

    // set a new value that defaults to cli source
    config.set('cli-config', 1)

    t.ok(config.isDefault('methane'),
      'should return true if value is retrieved from default definitions')
    t.notOk(config.isDefault('cli-config'),
      'should return false for a cli-defined value')
    t.notOk(config.isDefault('foo'),
      'should return false for a env-defined value')
    t.notOk(config.isDefault('project-config'),
      'should return false for a project-defined value')
    t.notOk(config.isDefault('default-user-config-in-home'),
      'should return false for a user-defined value')
    t.notOk(config.isDefault('global-config'),
      'should return false for a global-defined value')
    t.notOk(config.isDefault('builtin-config'),
      'should return false for a builtin-defined value')

    // make sure isDefault still works as intended after
    // setting and deleting values in differente sources
    config.set('methane', 'H2O', 'cli')
    t.notOk(config.isDefault('methane'),
      'should no longer return true now that a cli value was defined')
    config.delete('methane', 'cli')
    t.ok(config.isDefault('methane'),
      'should return true once again now that values is retrieved from defaults')
  })

  t.test('normalize config env keys', async t => {
    const env = {
      npm_config_bAr: 'bAr env',
      NPM_CONFIG_FOO: 'FOO env',
      'npm_config_//reg.example/UP_CASE/:username': 'ME',
      'npm_config_//reg.example/UP_CASE/:_password': 'Shhhh!',
      'NPM_CONFIG_//reg.example/UP_CASE/:_authToken': 'sEcReT',
    }
    const config = new Config({
      npmPath: `${path}/npm`,
      env,
      argv,
      cwd: join(`${path}/project`),

      shorthands,
      definitions,
    })

    await config.load()

    t.strictSame({
      bar: config.get('bar'),
      foo: config.get('foo'),
      '//reg.example/UP_CASE/:username': config.get('//reg.example/UP_CASE/:username'),
      '//reg.example/UP_CASE/:_password': config.get('//reg.example/UP_CASE/:_password'),
      '//reg.example/UP_CASE/:_authToken': config.get('//reg.example/UP_CASE/:_authToken'),
    }, {
      bar: 'bAr env',
      foo: 'FOO env',
      '//reg.example/UP_CASE/:username': 'ME',
      '//reg.example/UP_CASE/:_password': 'Shhhh!',
      '//reg.example/UP_CASE/:_authToken': 'sEcReT',
    })
  })

  t.test('do not double-load project/user config', async t => {
    const env = {
      npm_config_foo: 'from-env',
      npm_config_globalconfig: '/this/path/does/not/exist',
    }

    const config = new Config({
      npmPath: `${path}/npm`,
      env,
      argv: [process.execPath, __filename, '--userconfig', `${path}/project/.npmrc`],
      cwd: join(`${path}/project`),

      shorthands,
      definitions,
    })
    await config.load()

    config.argv = []
    t.equal(config.loaded, true, 'config is loaded')

    t.match(config.data.get('global').loadError, { code: 'ENOENT' })
    t.strictSame(config.data.get('env').raw, Object.assign(Object.create(null), {
      foo: 'from-env',
      globalconfig: '/this/path/does/not/exist',
    }))

    t.match(config.sources, new Map([
      ['default values', 'default'],
      [resolve(path, 'npm/npmrc'), 'builtin'],
      ['command line options', 'cli'],
      ['environment', 'env'],
      ['(same as "user" config, ignored)', 'project'],
      [resolve(path, 'project/.npmrc'), 'user'],
    ]))

    t.rejects(() => config.save('yolo'), {
      message: 'invalid config location param: yolo',
    })
    config.validate()
    t.equal(config.valid, false, 'config should not be valid')
    logs.length = 0
  })

  t.test('load configs from files, cli, and env, no builtin or project', async t => {
    const env = {
      npm_config_foo: 'from-env',
      HOME: `${path}/user`,
    }

    const config = new Config({
      // no builtin
      npmPath: path,
      env,
      argv,
      cwd: join(`${path}/project-no-config`),

      // should prepend DESTDIR to /global
      DESTDIR: path,
      PREFIX: '/global',
      platform: 'posix',

      shorthands,
      definitions: {
        ...definitions,
        ...createDef('multiple-numbers', {
          default: [],
          type: [Array, Number],
          description: 'one or more numbers',
        }),
      },
    })
    await config.load()

    t.match(config.sources, new Map([
      ['default values', 'default'],
      ['command line options', 'cli'],
      ['environment', 'env'],
      [resolve(path, 'user/.npmrc'), 'user'],
      [resolve(path, 'global/etc/npmrc'), 'global'],
    ]))
    // no builtin or project config
    t.equal(config.sources.get(resolve(path, 'npm/npmrc')), undefined)
    t.equal(config.sources.get(resolve(path, 'project/.npmrc')), undefined)

    t.strictSame({
      version: config.get('version'),
      audit: config.get('audit'),
      'project-config': config.get('project-config'),
      foo: config.get('foo'),
      'user-config-from-builtin': config.get('user-config-from-builtin'),
      'default-user-config-in-home': config.get('default-user-config-in-home'),
      'global-config': config.get('global-config'),
      'builtin-config': config.get('builtin-config'),
      all: config.get('all'),
    }, {
      version: true,
      audit: false,
      'project-config': undefined,
      foo: 'from-env',
      'user-config-from-builtin': undefined,
      'default-user-config-in-home': true,
      'global-config': true,
      'builtin-config': undefined,
      all: config.get('all'),
    })

    t.strictSame(logs, [
      ['warn', 'invalid config', 'registry="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'proxy="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'omit="cucumber"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more of:', 'dev, optional, peer'],
      ['warn', 'invalid config', 'access="blueberry"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one of:', 'null, restricted, public'],
      ['warn', 'invalid config', 'multiple-numbers="what kind of fruit is not a number"',
        'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more', 'numeric value'],
      ['warn', 'invalid config', 'multiple-numbers="a baNaNa!!"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more', 'numeric value'],
      ['warn', 'invalid config', 'prefix=true', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'valid filesystem path'],
      ['warn', 'config', 'also', 'Please use --include=dev instead.'],
    ])
    logs.length = 0
  })

  t.end()
})

t.test('cafile loads as ca (and some saving tests)', async t => {
  const cafile = resolve(__dirname, 'fixtures', 'cafile')
  const dir = t.testdir({
    '.npmrc': `cafile = ${cafile}
//registry.npmjs.org/:_authToken = deadbeefcafebadfoobarbaz42069
`,
  })
  const expect = `cafile=${cafile}
//registry.npmjs.org/:_authToken=deadbeefcafebadfoobarbaz42069
`

  const config = new Config({
    shorthands,
    definitions,
    npmPath: __dirname,
    env: { HOME: dir, PREFIX: dir },
    flatten,
  })
  await config.load()
  t.equal(config.get('ca'), null, 'does not overwrite config.get')
  const { flat } = config
  t.equal(config.flat, flat, 'getter returns same value again')
  const ca = flat.ca
  t.equal(ca.join('\n').replace(/\r\n/g, '\n').trim(), readFileSync(cafile, 'utf8')
    .replace(/\r\n/g, '\n').trim())
  await config.save('user')
  const res = readFileSync(`${dir}/.npmrc`, 'utf8').replace(/\r\n/g, '\n')
  t.equal(res, expect, 'did not write back ca, only cafile')
  // while we're here, test that saving an empty config file deletes it
  config.delete('cafile', 'user')
  config.clearCredentialsByURI(config.get('registry'))
  await config.save('user')
  t.throws(() => readFileSync(`${dir}/.npmrc`, 'utf8'), { code: 'ENOENT' })
  // do it again to verify we ignore the unlink error
  await config.save('user')
  t.throws(() => readFileSync(`${dir}/.npmrc`, 'utf8'), { code: 'ENOENT' })
  t.equal(config.valid, true)
})

t.test('cafile ignored if ca set', async t => {
  const cafile = resolve(__dirname, 'fixtures', 'cafile')
  const dir = t.testdir({
    '.npmrc': `cafile = ${cafile}`,
  })
  const ca = `
-----BEGIN CERTIFICATE-----
fakey mc fakerson
-----END CERTIFICATE-----
`
  const config = new Config({
    shorthands,
    definitions,
    npmPath: __dirname,
    env: {
      HOME: dir,
      npm_config_ca: ca,
    },
  })
  await config.load()
  t.strictSame(config.get('ca'), [ca.trim()])
  await config.save('user')
  const res = readFileSync(`${dir}/.npmrc`, 'utf8')
  t.equal(res.trim(), `cafile=${cafile}`)
})

t.test('ignore cafile if it does not load', async t => {
  const cafile = resolve(__dirname, 'fixtures', 'cafile-does-not-exist')
  const dir = t.testdir({
    '.npmrc': `cafile = ${cafile}`,
  })
  const config = new Config({
    shorthands,
    definitions,
    npmPath: __dirname,
    env: { HOME: dir },
  })
  await config.load()
  t.equal(config.get('ca'), null)
  await config.save('user')
  const res = readFileSync(`${dir}/.npmrc`, 'utf8')
  t.equal(res.trim(), `cafile=${cafile}`)
})

t.test('raise error if reading ca file error other than ENOENT', async t => {
  const dir = t.testdir({
    '.npmrc': `cafile = ~/WEIRD-ERROR`,
    'WEIRD-ERROR': '',
  })
  const config = new Config({
    shorthands,
    definitions,
    npmPath: __dirname,
    env: { HOME: dir },
    flatten,
  })
  await config.load()
  t.throws(() => config.flat.ca, { code: 'EWEIRD' })
})

t.test('credentials management', async t => {
  const fixtures = {
    nerfed_authToken: { '.npmrc': '//registry.example/:_authToken = 0bad1de4' },
    nerfed_userpass: {
      '.npmrc': `//registry.example/:username = hello
//registry.example/:_password = ${Buffer.from('world').toString('base64')}
//registry.example/:email = i@izs.me
//registry.example/:always-auth = "false"`,
    },
    nerfed_auth: { // note: does not load, because we don't do _auth per reg
      '.npmrc': `//registry.example/:_auth = ${Buffer.from('hello:world').toString('base64')}`,
    },
    nerfed_mtls: { '.npmrc': `//registry.example/:certfile = /path/to/cert
//registry.example/:keyfile = /path/to/key`,
    },
    nerfed_mtlsAuthToken: { '.npmrc': `//registry.example/:_authToken = 0bad1de4
//registry.example/:certfile = /path/to/cert
//registry.example/:keyfile = /path/to/key`,
    },
    nerfed_mtlsUserPass: { '.npmrc': `//registry.example/:username = hello
//registry.example/:_password = ${Buffer.from('world').toString('base64')}
//registry.example/:email = i@izs.me
//registry.example/:always-auth = "false"
//registry.example/:certfile = /path/to/cert
//registry.example/:keyfile = /path/to/key`,
    },
    def_userpass: {
      '.npmrc': `username = hello
_password = ${Buffer.from('world').toString('base64')}
email = i@izs.me
//registry.example/:always-auth = true
`,
    },
    def_userNoPass: {
      '.npmrc': `username = hello
email = i@izs.me
//registry.example/:always-auth = true
`,
    },
    def_passNoUser: {
      '.npmrc': `_password = ${Buffer.from('world').toString('base64')}
email = i@izs.me
//registry.example/:always-auth = true
`,
    },
    def_auth: {
      '.npmrc': `_auth = ${Buffer.from('hello:world').toString('base64')}
always-auth = true`,
    },
    def_authEnv: {
      '.npmrc': '_auth = ${PATH}',
    },
    none_authToken: { '.npmrc': '_authToken = 0bad1de4' },
    none_lcAuthToken: { '.npmrc': '_authtoken = 0bad1de4' },
    none_emptyConfig: { '.npmrc': '' },
    none_noConfig: {},
  }
  const path = t.testdir(fixtures)

  const defReg = 'https://registry.example/'
  const otherReg = 'https://other.registry/'
  for (const testCase of Object.keys(fixtures)) {
    t.test(testCase, async t => {
      const c = new Config({
        npmPath: path,
        shorthands,
        definitions,
        env: { HOME: resolve(path, testCase) },
        argv: ['node', 'file', '--registry', defReg],
      })
      await c.load()

      // only have to do this the first time, it's redundant otherwise
      if (testCase === 'none_noConfig') {
        t.throws(() => c.setCredentialsByURI('http://x.com', {
          username: 'foo',
          email: 'bar@baz.com',
        }), { message: 'must include password' })
        t.throws(() => c.setCredentialsByURI('http://x.com', {
          password: 'foo',
          email: 'bar@baz.com',
        }), { message: 'must include username' })
        c.setCredentialsByURI('http://x.com', {
          username: 'foo',
          password: 'bar',
          email: 'asdf@quux.com',
        })
      }

      // the def_ and none_ prefixed cases have unscoped auth values and should throw
      if (testCase.startsWith('def_') ||
          testCase === 'none_authToken' ||
          testCase === 'none_lcAuthToken') {
        try {
          c.validate()
          // validate should throw, fail the test here if it doesn't
          t.fail('validate should have thrown')
        } catch (err) {
          if (err.code !== 'ERR_INVALID_AUTH') {
            throw err
          }

          // we got our expected invalid auth error, so now repair it
          c.repair(err.problems)
          t.ok(c.valid, 'config is valid')
        }
      } else {
        // validate won't throw for these ones, so let's prove it and repair are no-ops
        c.validate()
        c.repair()
      }

      const d = c.getCredentialsByURI(defReg)
      const o = c.getCredentialsByURI(otherReg)

      t.matchSnapshot(d, 'default registry')
      t.matchSnapshot(o, 'other registry')

      c.clearCredentialsByURI(defReg)
      const defAfterDelete = c.getCredentialsByURI(defReg)
      {
        const expectKeys = []
        if (defAfterDelete.email) {
          expectKeys.push('email')
        }
        t.strictSame(Object.keys(defAfterDelete), expectKeys)
      }

      c.clearCredentialsByURI(otherReg)
      const otherAfterDelete = c.getCredentialsByURI(otherReg)
      {
        const expectKeys = []
        if (otherAfterDelete.email) {
          expectKeys.push('email')
        }
        t.strictSame(Object.keys(otherAfterDelete), expectKeys)
      }

      // need both or none of user/pass
      if (!d.token && (!d.username || !d.password) && (!d.certfile || !d.keyfile)) {
        t.throws(() => c.setCredentialsByURI(defReg, d))
      } else {
        c.setCredentialsByURI(defReg, d)
        t.matchSnapshot(c.getCredentialsByURI(defReg), 'default registry after set')
      }

      if (!o.token && (!o.username || !o.password) && (!o.certfile || !o.keyfile)) {
        t.throws(() => c.setCredentialsByURI(otherReg, o), {}, { otherReg, o })
      } else {
        c.setCredentialsByURI(otherReg, o)
        t.matchSnapshot(c.getCredentialsByURI(otherReg), 'other registry after set')
      }
    })
  }
  t.end()
})

t.test('finding the global prefix', t => {
  const npmPath = __dirname
  t.test('load from PREFIX env', t => {
    const c = new Config({
      env: {
        PREFIX: '/prefix/env',
      },
      shorthands,
      definitions,
      npmPath,
    })
    c.loadGlobalPrefix()
    t.throws(() => c.loadGlobalPrefix(), {
      message: 'cannot load default global prefix more than once',
    })
    t.equal(c.globalPrefix, '/prefix/env')
    t.end()
  })
  t.test('load from execPath, win32', t => {
    const c = new Config({
      platform: 'win32',
      execPath: '/path/to/nodejs/node.exe',
      shorthands,
      definitions,
      npmPath,
    })
    c.loadGlobalPrefix()
    t.equal(c.globalPrefix, dirname('/path/to/nodejs/node.exe'))
    t.end()
  })
  t.test('load from execPath, posix', t => {
    const c = new Config({
      platform: 'posix',
      execPath: '/path/to/nodejs/bin/node',
      shorthands,
      definitions,
      npmPath,
    })
    c.loadGlobalPrefix()
    t.equal(c.globalPrefix, dirname(dirname('/path/to/nodejs/bin/node')))
    t.end()
  })
  t.test('load from execPath with destdir, posix', t => {
    const c = new Config({
      platform: 'posix',
      execPath: '/path/to/nodejs/bin/node',
      env: { DESTDIR: '/some/dest/dir' },
      shorthands,
      definitions,
      npmPath,
    })
    c.loadGlobalPrefix()
    t.equal(c.globalPrefix, join('/some/dest/dir', dirname(dirname('/path/to/nodejs/bin/node'))))
    t.end()
  })
  t.end()
})

t.test('finding the local prefix', t => {
  const path = t.testdir({
    hasNM: {
      node_modules: {},
      x: { y: { z: {} } },
    },
    hasPJ: {
      'package.json': '{}',
      x: { y: { z: {} } },
    },
  })
  t.test('explicit cli prefix', async t => {
    const c = new Config({
      argv: [process.execPath, __filename, '-C', path],
      shorthands,
      definitions,
      npmPath: path,
    })
    await c.load()
    t.equal(c.localPrefix, resolve(path))
  })
  t.test('has node_modules', async t => {
    const c = new Config({
      cwd: join(`${path}/hasNM/x/y/z`),
      shorthands,
      definitions,
      npmPath: path,
    })
    await c.load()
    t.equal(c.localPrefix, resolve(path, 'hasNM'))
  })
  t.test('has package.json', async t => {
    const c = new Config({
      cwd: join(`${path}/hasPJ/x/y/z`),
      shorthands,
      definitions,
      npmPath: path,
    })
    await c.load()
    t.equal(c.localPrefix, resolve(path, 'hasPJ'))
  })
  t.test('nada, just use cwd', async t => {
    const c = new Config({
      cwd: join('/this/path/does/not/exist/x/y/z'),
      shorthands,
      definitions,
      npmPath: path,
    })
    await c.load()
    t.equal(c.localPrefix, join('/this/path/does/not/exist/x/y/z'))
  })
  t.end()
})

t.test('setting basic auth creds and email', async t => {
  const registry = 'https://registry.npmjs.org/'
  const path = t.testdir()
  const _auth = Buffer.from('admin:admin').toString('base64')
  const opts = {
    shorthands: {},
    argv: ['node', __filename, `--userconfig=${path}/.npmrc`],
    definitions: {
      registry: { default: registry },
    },
    npmPath: process.cwd(),
  }
  const c = new Config(opts)
  await c.load()
  c.set('email', 'name@example.com', 'user')
  t.equal(c.get('email', 'user'), 'name@example.com', 'email was set')
  await c.save('user')
  t.equal(c.get('email', 'user'), 'name@example.com', 'email still top level')
  t.strictSame(c.getCredentialsByURI(registry), { email: 'name@example.com' })
  const d = new Config(opts)
  await d.load()
  t.strictSame(d.getCredentialsByURI(registry), { email: 'name@example.com' })
  d.set('_auth', _auth, 'user')
  t.equal(d.get('_auth', 'user'), _auth, '_auth was set')
  d.repair()
  await d.save('user')
  const e = new Config(opts)
  await e.load()
  t.equal(e.get('_auth', 'user'), undefined, 'un-nerfed _auth deleted')
  t.strictSame(e.getCredentialsByURI(registry), {
    email: 'name@example.com',
    username: 'admin',
    password: 'admin',
    auth: _auth,
  }, 'credentials saved and nerfed')
})

t.test('setting username/password/email individually', async t => {
  const registry = 'https://registry.npmjs.org/'
  const path = t.testdir()
  const opts = {
    shorthands: {},
    argv: ['node', __filename, `--userconfig=${path}/.npmrc`],
    definitions: {
      registry: { default: registry },
    },
    npmPath: process.cwd(),
  }
  const c = new Config(opts)
  await c.load()
  c.set('email', 'name@example.com', 'user')
  t.equal(c.get('email'), 'name@example.com')
  c.set('username', 'admin', 'user')
  t.equal(c.get('username'), 'admin')
  c.set('_password', Buffer.from('admin').toString('base64'), 'user')
  t.equal(c.get('_password'), Buffer.from('admin').toString('base64'))
  t.equal(c.get('_auth'), undefined)
  c.repair()
  await c.save('user')

  const d = new Config(opts)
  await d.load()
  t.equal(d.get('email'), 'name@example.com')
  t.equal(d.get('username'), undefined)
  t.equal(d.get('_password'), undefined)
  t.equal(d.get('_auth'), undefined)
  t.strictSame(d.getCredentialsByURI(registry), {
    email: 'name@example.com',
    username: 'admin',
    password: 'admin',
    auth: Buffer.from('admin:admin').toString('base64'),
  })
})

t.test('nerfdart auths set at the top level into the registry', async t => {
  const registry = 'https://registry.npmjs.org/'
  const _auth = Buffer.from('admin:admin').toString('base64')
  const username = 'admin'
  const _password = Buffer.from('admin').toString('base64')
  const email = 'i@izs.me'
  const _authToken = 'deadbeefblahblah'

  // name: [ini, expect, wontThrow]
  const cases = {
    '_auth only, no email': [`_auth=${_auth}`, {
      '//registry.npmjs.org/:_auth': _auth,
    }],
    '_auth with email': [`_auth=${_auth}\nemail=${email}`, {
      '//registry.npmjs.org/:_auth': _auth,
      email,
    }],
    '_authToken alone': [`_authToken=${_authToken}`, {
      '//registry.npmjs.org/:_authToken': _authToken,
    }],
    '_authToken and email': [`_authToken=${_authToken}\nemail=${email}`, {
      '//registry.npmjs.org/:_authToken': _authToken,
      email,
    }],
    'username and _password': [`username=${username}\n_password=${_password}`, {
      '//registry.npmjs.org/:username': username,
      '//registry.npmjs.org/:_password': _password,
    }],
    'username, password, email': [`username=${username}\n_password=${_password}\nemail=${email}`, {
      '//registry.npmjs.org/:username': username,
      '//registry.npmjs.org/:_password': _password,
      email,
    }],
    // handled invalid/legacy cases
    'username, no _password': [`username=${username}`, {}],
    '_password, no username': [`_password=${_password}`, {}],
    '_authtoken instead of _authToken': [`_authtoken=${_authToken}`, {}],
    '-authtoken instead of _authToken': [`-authtoken=${_authToken}`, {}],
    // de-nerfdart the email, if present in that way
    'nerf-darted email': [`//registry.npmjs.org/:email=${email}`, {
      email,
    }, true],
  }

  const logs = []
  const logHandler = (...args) => logs.push(args)
  process.on('log', logHandler)
  t.teardown(() => {
    process.removeListener('log', logHandler)
  })
  const cwd = process.cwd()
  for (const [name, [ini, expect, wontThrow]] of Object.entries(cases)) {
    t.test(name, async t => {
      t.teardown(() => {
        process.chdir(cwd)
        logs.length = 0
      })
      const path = t.testdir({
        '.npmrc': ini,
        'package.json': JSON.stringify({}),
      })
      process.chdir(path)
      const argv = [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ]
      const opts = {
        shorthands: {},
        argv,
        env: {},
        definitions: {
          registry: { default: registry },
        },
        npmPath: process.cwd(),
      }

      const c = new Config(opts)
      await c.load()

      if (!wontThrow) {
        t.throws(() => c.validate(), { code: 'ERR_INVALID_AUTH' })
      }

      // now we go ahead and do the repair, and save
      c.repair()
      await c.save('user')
      t.same(c.list[3], expect)
    })
  }
})

t.test('workspaces', async (t) => {
  const path = resolve(t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      workspaces: ['./workspaces/*'],
    }),
    workspaces: {
      one: {
        'package.json': JSON.stringify({
          name: 'one',
          version: '1.0.0',
        }),
      },
      two: {
        'package.json': JSON.stringify({
          name: 'two',
          version: '1.0.0',
        }),
      },
      three: {
        'package.json': JSON.stringify({
          name: 'three',
          version: '1.0.0',
        }),
        '.npmrc': 'package-lock=false',
      },
    },
  }))

  const logs = []
  const logHandler = (...args) => logs.push(args)
  process.on('log', logHandler)
  t.teardown(() => process.off('log', logHandler))
  t.afterEach(() => logs.length = 0)

  t.test('finds own parent', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/one`)

    const config = new Config({
      npmPath: cwd,
      env: {},
      argv: [process.execPath, __filename],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), [join(path, 'workspaces', 'one')], 'set the workspace')
    t.equal(logs.length, 1, 'got one log message')
    t.match(logs[0], ['info', /^found workspace root at/], 'logged info about workspace root')
  })

  t.test('finds other workspace parent', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/one`)

    const config = new Config({
      npmPath: process.cwd(),
      env: {},
      argv: [process.execPath, __filename, '--workspace', '../two'],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), ['../two'], 'kept the specified workspace')
    t.equal(logs.length, 1, 'got one log message')
    t.match(logs[0], ['info', /^found workspace root at/], 'logged info about workspace root')
  })

  t.test('warns when workspace has .npmrc', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/three`)

    const config = new Config({
      npmPath: process.cwd(),
      env: {},
      argv: [process.execPath, __filename],
      cwd: join(`${path}/workspaces/three`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), [join(path, 'workspaces', 'three')], 'kept the workspace')
    t.equal(logs.length, 2, 'got two log messages')
    t.match(logs[0], ['warn', /^ignoring workspace config/], 'warned about ignored config')
    t.match(logs[1], ['info', /^found workspace root at/], 'logged info about workspace root')
  })

  t.test('prefix skips auto detect', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/one`)

    const config = new Config({
      npmPath: process.cwd(),
      env: {},
      argv: [process.execPath, __filename, '--prefix', './'],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    t.equal(logs.length, 0, 'got no log messages')
  })

  t.test('no-workspaces skips auto detect', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/one`)

    const config = new Config({
      npmPath: process.cwd(),
      env: {},
      argv: [process.execPath, __filename, '--no-workspaces'],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    t.equal(logs.length, 0, 'got no log messages')
  })

  t.test('global skips auto detect', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/one`)

    const config = new Config({
      npmPath: process.cwd(),
      env: {},
      argv: [process.execPath, __filename, '--global'],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    t.equal(logs.length, 0, 'got no log messages')
  })

  t.test('location=global skips auto detect', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/one`)

    const config = new Config({
      npmPath: process.cwd(),
      env: {},
      argv: [process.execPath, __filename, '--location=global'],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    t.equal(logs.length, 0, 'got no log messages')
  })

  t.test('excludeNpmCwd skips auto detect', async (t) => {
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(`${path}/workspaces/one`)

    const config = new Config({
      npmPath: process.cwd(),
      env: {},
      argv: [process.execPath, __filename],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
      excludeNpmCwd: true,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    t.equal(logs.length, 0, 'got no log messages')
  })

  t.test('does not error for invalid package.json', async (t) => {
    const invalidPkg = join(path, 'workspaces', 'package.json')
    const cwd = process.cwd()
    t.teardown(() => {
      fs.unlinkSync(invalidPkg)
      process.chdir(cwd)
    })
    process.chdir(`${path}/workspaces/one`)

    // write some garbage to the file so read-package-json-fast will throw
    fs.writeFileSync(invalidPkg, 'not-json')
    const config = new Config({
      npmPath: cwd,
      env: {},
      argv: [process.execPath, __filename],
      cwd: join(`${path}/workspaces/one`),
      shorthands,
      definitions,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), [join(path, 'workspaces', 'one')], 'set the workspace')
    t.equal(logs.length, 1, 'got one log message')
    t.match(logs[0], ['info', /^found workspace root at/], 'logged info about workspace root')
  })
})

t.test('exclusive options conflict', async t => {
  const path = t.testdir()
  const config = new Config({
    env: {},
    npmPath: __dirname,
    argv: [
      process.execPath,
      __filename,
      '--truth=true',
      '--lie=true',
    ],
    cwd: join(`${path}/project`),
    shorthands,
    definitions: {
      ...definitions,
      ...createDef('truth', {
        default: false,
        type: Boolean,
        description: 'The Truth',
        exclusive: ['lie'],
      }),
      ...createDef('lie', {
        default: false,
        type: Boolean,
        description: 'A Lie',
        exclusive: ['truth'],
      }),
    },
    flatten,
  })
  await t.rejects(config.load(), {
    name: 'TypeError',
    message: '--lie can not be provided when using --truth',
  })
})

t.test('env-replaced config from files is not clobbered when saving', async (t) => {
  const path = t.testdir()
  const opts = {
    shorthands: {},
    argv: ['node', __filename, `--userconfig=${path}/.npmrc`],
    env: { TEST: 'test value' },
    definitions: {
      registry: { default: 'https://registry.npmjs.org/' },
    },
    npmPath: process.cwd(),
  }
  const c = new Config(opts)
  await c.load()
  c.set('test', '${TEST}', 'user')
  await c.save('user')
  const d = new Config(opts)
  await d.load()
  d.set('other', '${SOMETHING}', 'user')
  await d.save('user')
  const rc = readFileSync(`${path}/.npmrc`, 'utf8')
  t.match(rc, 'test=${TEST}', '${TEST} is present, not parsed')
})

t.test('umask', async t => {
  const mockUmask = async (t, umask) => {
    const path = t.testdir()
    const config = new Config({
      env: {},
      npmPath: __dirname,
      argv: [
        process.execPath,
        __filename,
        `--umask=${umask}`,
      ],
      cwd: join(`${path}/project`),
      shorthands,
      definitions,
      flatten,
    })
    await config.load()
    return config.get('umask')
  }

  t.test('valid', async t => {
    const umask = await mockUmask(t, '777')
    t.equal(umask, 777)
  })
  t.test('invalid', async t => {
    const umask = await mockUmask(t, true)
    t.equal(umask, 0)
  })
})
