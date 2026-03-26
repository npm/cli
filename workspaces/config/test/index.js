const t = require('tap')

const fs = require('node:fs')
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

const { resolve, join, dirname } = require('node:path')

const mockFs = {
  ...fs,
  readFileSync: (path, ...args) => {
    if (path.includes('WEIRD-ERROR')) {
      throw Object.assign(new Error('weird error'), { code: 'EWEIRD' })
    }

    return fs.readFileSync(path, ...args)
  },
}

const mockFsPromises = {
  ...fs.promises,
  readFile: async (path, ...args) => {
    if (path.includes('WEIRD-ERROR')) {
      throw Object.assign(new Error('weird error'), { code: 'EWEIRD' })
    }

    return fs.promises.readFile(path, ...args)
  },
}

const fsMocks = {
  'node:fs/promises': mockFsPromises,
  'node:fs': mockFs,
}

const { definitions: realDefinitions, shorthands, nerfDarts, flatten } =
  t.mock('../lib/definitions/index.js', fsMocks)

// Extend the real definitions with stub entries for fake config keys used
// in the shared fixture below. Treating them as known lets merge-order,
// env-override, and similar tests exercise Config.load() without tripping
// the npm 12 unknown-config throw. Tests that want to exercise unknown
// behavior use keys NOT in this stub list (e.g. "totally-unknown-key").
const stubDef = (key) => ({ key, type: [String, Boolean] })
const definitions = {
  ...realDefinitions,
  'builtin-config': stubDef('builtin-config'),
  'global-config': stubDef('global-config'),
  'user-config-from-builtin': stubDef('user-config-from-builtin'),
  'default-user-config-in-home': stubDef('default-user-config-in-home'),
  'project-config': stubDef('project-config'),
  'cli-config': stubDef('cli-config'),
  foo: stubDef('foo'),
  bAr: stubDef('bAr'),
}
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
default-user-config-in-home = true
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
    })
    logs.length = 0
    await config.load()
    t.match(logs.find(l => l[0] === 'verbose'),
      ['verbose', 'config', 'error loading user config', {
        message: 'weird error',
      }])
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

    config.set('foo', 'quux', 'global')
    await config.save('global')
    const gres = readFileSync(`${path}/global/etc/npmrc`, 'utf8')
    t.match(gres, 'foo=quux')

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
    t.strictSame(logs.filter(l => l[0] === 'warn'), [
      ['warn', 'invalid config', 'registry="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'proxy="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'omit="cucumber"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more of:', 'dev, optional, peer'],
      ['warn', 'invalid config', 'access="blueberry"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one of:', 'null, restricted, public, private'],
      ['warn', 'invalid config', 'multiple-numbers="what kind of fruit is not a number"',
        'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more', 'numeric value'],
      ['warn', 'invalid config', 'multiple-numbers="a baNaNa!!"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more', 'numeric value'],
      ['warn', 'invalid config', 'prefix=true', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'valid filesystem path'],
      ['warn', 'config', 'also', 'Please use --include=dev instead.'],
      ['warn', 'invalid config', 'loglevel="yolo"', `set in ${resolve(path, 'project/.npmrc')}`],
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
      'should return false for an env-defined value')
    t.notOk(config.isDefault('project-config'),
      'should return false for a project-defined value')
    t.notOk(config.isDefault('default-user-config-in-home'),
      'should return false for a user-defined value')
    t.notOk(config.isDefault('global-config'),
      'should return false for a global-defined value')
    t.notOk(config.isDefault('builtin-config'),
      'should return false for a builtin-defined value')

    // make sure isDefault still works as intended after
    // setting and deleting values in different sources
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
      nerfDarts,
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
      nerfDarts,
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

    t.strictSame(logs.filter(l => l[0] === 'warn'), [
      ['warn', 'invalid config', 'registry="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'proxy="hello"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be', 'full url with "http://"'],
      ['warn', 'invalid config', 'omit="cucumber"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one or more of:', 'dev, optional, peer'],
      ['warn', 'invalid config', 'access="blueberry"', 'set in command line options'],
      ['warn', 'invalid config', 'Must be one of:', 'null, restricted, public, private'],
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
    nerfDarts,
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
    nerfDarts,
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
    nerfDarts,
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
    nerfDarts,
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
//registry.example/:email = i@izs.me`,
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
  // Cases whose fixtures include top-level legacy auth keys that are no
  // longer tolerated in npm 12 — Config collects them as unknowns; the
  // error is raised by base-cmd.validateCli when the command runs.
  const mustCollect = new Set([
    'def_userpass',
    'def_userNoPass',
    'def_passNoUser',
    'def_auth',
    'none_authToken',
    'none_lcAuthToken',
  ])
  for (const testCase of Object.keys(fixtures)) {
    t.test(testCase, async t => {
      const c = new Config({
        npmPath: path,
        shorthands,
        definitions,
        nerfDarts,
        env: { HOME: resolve(path, testCase) },
        argv: ['node', 'file', '--registry', defReg],
      })

      await c.load()

      if (mustCollect.has(testCase)) {
        const unknowns = [
          ...c.getUnknownConfigs('user'),
          ...c.getUnknownConfigs('project'),
          ...c.getUnknownConfigs('global'),
        ]
        t.ok(unknowns.length > 0, 'unknown top-level legacy auth keys collected')
        return
      }

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

      // def_authEnv still needs validate+repair (uses defined `_auth` at top
      // level, which loads fine but validate flags as incomplete auth).
      if (testCase === 'def_authEnv') {
        try {
          c.validate()
          t.fail('validate should have thrown')
        } catch (err) {
          if (err.code !== 'ERR_INVALID_AUTH') {
            throw err
          }
          c.repair(err.problems)
          t.ok(c.valid, 'config is valid')
        }
      } else {
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
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
      nerfDarts,
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
    env: {},
    definitions: {
      registry: { default: registry },
    },
    nerfDarts,
    cwd: path,
    excludeNpmCwd: true,
    npmPath: path,
  }
  const c = new Config(opts)
  await c.load()
  c.setCredentialsByURI(registry, {
    username: 'admin',
    password: 'admin',
  })
  c.set('//registry.npmjs.org/:email', 'name@example.com', 'user')
  await c.save('user')
  t.strictSame(c.getCredentialsByURI(registry), {
    email: 'name@example.com',
    username: 'admin',
    password: 'admin',
    auth: _auth,
  })
  const d = new Config(opts)
  await d.load()
  t.equal(d.get('_auth', 'user'), undefined, 'un-nerfed _auth not present')
  t.strictSame(d.getCredentialsByURI(registry), {
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
    env: {},
    definitions: {
      registry: { default: registry },
    },
    nerfDarts,
    cwd: path,
    excludeNpmCwd: true,
    npmPath: path,
  }
  const c = new Config(opts)
  await c.load()
  c.setCredentialsByURI(registry, {
    username: 'admin',
    password: 'admin',
  })
  c.set('//registry.npmjs.org/:email', 'name@example.com', 'user')
  t.equal(c.get('//registry.npmjs.org/:email'), 'name@example.com')
  t.equal(c.get('//registry.npmjs.org/:username'), 'admin')
  t.equal(c.get('_auth'), undefined)
  await c.save('user')

  const d = new Config(opts)
  await d.load()
  t.strictSame(d.getCredentialsByURI(registry), {
    email: 'name@example.com',
    username: 'admin',
    password: 'admin',
    auth: Buffer.from('admin:admin').toString('base64'),
  })
})

t.test('nerfdart auths set at the top level now throw in npm 12', async t => {
  const registry = 'https://registry.npmjs.org/'
  const _auth = Buffer.from('admin:admin').toString('base64')
  const username = 'admin'
  const _password = Buffer.from('admin').toString('base64')
  const email = 'i@izs.me'
  const _authToken = 'deadbeefblahblah'

  // All these legacy fixtures place auth-like keys at the top level of an
  // .npmrc. In npm 11 these produced warnings and `repair()` migrated them
  // into a nerfdart section. In npm 12 they are collected as unknown
  // configs; base-cmd.validateCli throws on them when the command runs.
  const throwingCases = {
    '_auth only, no email': `_auth=${_auth}`,
    '_auth with email': `_auth=${_auth}\nemail=${email}`,
    '_authToken alone': `_authToken=${_authToken}`,
    '_authToken and email': `_authToken=${_authToken}\nemail=${email}`,
    'username and _password': `username=${username}\n_password=${_password}`,
    'username, password, email':
      `username=${username}\n_password=${_password}\nemail=${email}`,
    'username, no _password': `username=${username}`,
    '_password, no username': `_password=${_password}`,
    '_authtoken instead of _authToken': `_authtoken=${_authToken}`,
    '-authtoken instead of _authToken': `-authtoken=${_authToken}`,
  }

  for (const [name, ini] of Object.entries(throwingCases)) {
    t.test(name, async t => {
      const path = t.testdir({
        '.npmrc': ini,
        'package.json': JSON.stringify({}),
      })
      const opts = {
        shorthands: {},
        argv: [
          'node',
          __filename,
          `--prefix=${path}`,
          `--userconfig=${path}/.npmrc`,
          `--globalconfig=${path}/etc/npmrc`,
        ],
        env: {},
        definitions: {
          registry: { default: registry },
        },
        cwd: path,
        excludeNpmCwd: true,
        npmPath: path,
      }
      const c = new Config(opts)
      await c.load()
      const unknowns = [
        ...c.getUnknownConfigs('user'),
        ...c.getUnknownConfigs('project'),
        ...c.getUnknownConfigs('global'),
        ...c.getUnknownConfigs('builtin'),
      ]
      t.ok(unknowns.length > 0, 'legacy top-level auth keys collected as unknown')
      t.throws(
        () => c.validate(),
        { code: 'ERR_INVALID_AUTH' },
        'validate() throws ErrInvalidAuth with a message describing each problem'
      )
    })
  }

  t.test('nerf-darted email still loads', async t => {
    const path = t.testdir({
      '.npmrc': `//registry.npmjs.org/:email=${email}`,
      'package.json': JSON.stringify({}),
    })
    const opts = {
      shorthands: {},
      argv: [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ],
      env: {},
      definitions: {
        registry: { default: registry },
      },
      nerfDarts,
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
    }
    const c = new Config(opts)
    await c.load()
    c.repair()
    await c.save('user')
    t.same(c.data.get('user').data, { '//registry.npmjs.org/:email': email })
  })
})

t.test('checkUnknown and repair carve-outs', async t => {
  const registry = 'https://registry.npmjs.org/'
  const _authToken = 'deadbeef'

  t.test('repair() with no args validates and fixes auth problems', async t => {
    const path = t.testdir({
      '.npmrc': `_authtoken=${_authToken}`,
      'package.json': JSON.stringify({}),
    })
    const c = new Config({
      shorthands: {},
      argv: [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ],
      env: {},
      definitions: { registry: { default: registry } },
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
    })
    await c.load()
    t.throws(() => c.validate(), { code: 'ERR_INVALID_AUTH' }, 'pre-repair validate throws')
    c.repair()
    t.equal(c.get('_authtoken', 'user'), undefined, 'deleted from user config')
    t.doesNotThrow(() => c.validate(), 'post-repair validate passes')
  })

  t.test('repair() migrates top-level email to nerfdart form', async t => {
    const email = 'me@example.com'
    const path = t.testdir({
      '.npmrc': `email=${email}`,
      'package.json': JSON.stringify({}),
    })
    const c = new Config({
      shorthands: {},
      argv: [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ],
      env: {},
      definitions: { registry: { default: registry } },
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
    })
    await c.load()
    t.throws(() => c.validate(), { code: 'ERR_INVALID_AUTH' },
      'pre-repair validate flags top-level email')
    c.repair()
    t.equal(c.get('email', 'user'), undefined, 'top-level email deleted')
    t.equal(c.get('//registry.npmjs.org/:email', 'user'), email,
      'email moved to nerfdart form')
    t.doesNotThrow(() => c.validate(), 'post-repair validate passes')
  })

  t.test('repair() migrates certfile+keyfile pair to nerfdart form', async t => {
    const path = t.testdir({
      '.npmrc': 'certfile=/path/to/cert\nkeyfile=/path/to/key',
      'package.json': JSON.stringify({}),
    })
    const c = new Config({
      shorthands: {},
      argv: [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ],
      env: {},
      definitions: { registry: { default: registry } },
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
    })
    await c.load()
    t.throws(() => c.validate(), { code: 'ERR_INVALID_AUTH' },
      'pre-repair validate flags top-level certfile/keyfile')
    c.repair()
    t.equal(c.get('certfile', 'user'), undefined, 'top-level certfile deleted')
    t.equal(c.get('keyfile', 'user'), undefined, 'top-level keyfile deleted')
    t.equal(c.get('//registry.npmjs.org/:certfile', 'user'), '/path/to/cert',
      'certfile moved to nerfdart form')
    t.equal(c.get('//registry.npmjs.org/:keyfile', 'user'), '/path/to/key',
      'keyfile moved to nerfdart form')
    t.doesNotThrow(() => c.validate(), 'post-repair validate passes')
  })

  t.test('repair() drops orphan certfile (no matching keyfile)', async t => {
    const path = t.testdir({
      '.npmrc': 'certfile=/path/to/cert',
      'package.json': JSON.stringify({}),
    })
    const c = new Config({
      shorthands: {},
      argv: [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ],
      env: {},
      definitions: { registry: { default: registry } },
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
    })
    await c.load()
    c.repair()
    t.equal(c.get('certfile', 'user'), undefined, 'orphan certfile deleted')
    t.equal(c.get('//registry.npmjs.org/:certfile', 'user'), undefined,
      'orphan certfile NOT moved (useless without keyfile)')
  })

  t.test('repair() preserves existing scoped destination on collision', async t => {
    // Stale top-level + current scoped should keep the scoped value.
    const stale = 'old@example.com'
    const current = 'new@example.com'
    const path = t.testdir({
      '.npmrc': `email=${stale}\n//registry.npmjs.org/:email=${current}`,
      'package.json': JSON.stringify({}),
    })
    const c = new Config({
      shorthands: {},
      argv: [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ],
      env: {},
      definitions: { registry: { default: registry } },
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
    })
    await c.load()
    c.repair()
    t.equal(c.get('email', 'user'), undefined, 'stale top-level email deleted')
    t.equal(c.get('//registry.npmjs.org/:email', 'user'), current,
      'existing scoped email preserved (not clobbered)')
  })

  t.test('publishConfig unknown warns but does not error', async t => {
    const path = t.testdir({ 'package.json': JSON.stringify({}) })
    const c = new Config({
      shorthands: {},
      argv: ['node', __filename, `--prefix=${path}`],
      env: {},
      definitions: { registry: { default: registry } },
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
      warn: false,
    })
    await c.load()
    c.checkUnknown('publishConfig', 'bogus-pub-key')
    c.checkUnknown('publishConfig', '@scope:bogus-scoped-pub')
    const pubUnknowns = c.getUnknownConfigs('publishConfig')
    t.equal(pubUnknowns.length, 2, 'publishConfig unknowns collected')
    t.notOk(
      c.getUnknownConfigs().some(u => u.where === 'publishConfig'),
      'publishConfig unknowns excluded from default getUnknownConfigs()'
    )
  })

  t.test('getUnknownConfigs() returns all file + cli entries', async t => {
    const path = t.testdir({
      '.npmrc': 'bogus-user-key=yes',
      'package.json': JSON.stringify({}),
    })
    const c = new Config({
      shorthands: {},
      argv: [
        'node',
        __filename,
        `--prefix=${path}`,
        `--userconfig=${path}/.npmrc`,
        `--globalconfig=${path}/etc/npmrc`,
      ],
      env: {
        npm_config_bogus_env_key: 'x',
        'npm_config_@scope:bogus-scoped-env': 'y',
      },
      definitions: { registry: { default: registry } },
      cwd: path,
      excludeNpmCwd: true,
      npmPath: path,
    })
    await c.load()
    const all = c.getUnknownConfigs()
    t.ok(all.some(u => u.key === 'bogus-user-key' && u.where === 'user'), 'includes user file key')
    t.notOk(all.some(u => u.where === 'env'), 'excludes env entries')
    const envUnknowns = c.getUnknownConfigs('env')
    t.ok(envUnknowns.some(u => !u.baseKey), 'plain env unknown collected')
    t.ok(envUnknowns.some(u => u.baseKey), 'scoped env unknown collected')
  })
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), [join(path, 'workspaces', 'one')], 'set the workspace')
    const info = logs.filter(l => l[0] === 'info')
    t.equal(info.length, 1, 'got one log message')
    t.match(info[0],
      ['info', 'config', /^found workspace root at/], 'logged info about workspace root')
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), ['../two'], 'kept the specified workspace')
    const info = logs.filter(l => l[0] === 'info')
    t.equal(info.length, 1, 'got one log message')
    t.match(info[0],
      ['info', 'config', /^found workspace root at/], 'logged info about workspace root')
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), [join(path, 'workspaces', 'three')], 'kept the workspace')
    const filtered = logs.filter(l => l[0] === 'info' || l[0] === 'warn')
    t.equal(filtered.length, 2, 'got two log messages')
    t.match(filtered[0],
      ['warn', 'config', /^ignoring workspace config/], 'warned about ignored config')
    t.match(filtered[1],
      ['info', 'config', /^found workspace root at/], 'logged info about workspace root')
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    const filtered = logs.filter(l => l[0] !== 'silly')
    t.equal(filtered.length, 0, 'got no log messages')
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    const filtered = logs.filter(l => l[0] !== 'silly')
    t.equal(filtered.length, 0, 'got no log messages')
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    const filtered = logs.filter(l => l[0] !== 'silly')
    t.equal(filtered.length, 0, 'got no log messages')
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    const filtered = logs.filter(l => l[0] !== 'silly')
    t.equal(filtered.length, 0, 'got no log messages')
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
      nerfDarts,
      excludeNpmCwd: true,
    })

    await config.load()
    t.equal(config.localPrefix, join(path, 'workspaces', 'one'), 'localPrefix is the root')
    t.same(config.get('workspace'), [], 'did not set workspace')
    const filtered = logs.filter(l => l[0] !== 'silly')
    t.equal(filtered.length, 0, 'got no log messages')
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
      nerfDarts,
    })

    await config.load()
    t.equal(config.localPrefix, path, 'localPrefix is the root')
    t.same(config.get('workspace'), [join(path, 'workspaces', 'one')], 'set the workspace')
    const filtered = logs.filter(l => l[0] !== 'silly')
    t.equal(filtered.length, 1, 'got one log message')
    t.match(filtered[0],
      ['info', 'config', /^found workspace root at/], 'logged info about workspace root')
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
    message: '--lie cannot be provided when using --truth',
  })
})

t.test('exclusive options both from env still conflict', async t => {
  const path = t.testdir()
  const config = new Config({
    env: {
      npm_config_aaa: 'true',
      npm_config_zzz: 'true',
    },
    npmPath: __dirname,
    argv: [
      process.execPath,
      __filename,
    ],
    cwd: join(`${path}/project`),
    shorthands,
    definitions: {
      ...definitions,
      ...createDef('aaa', {
        default: false,
        type: Boolean,
        description: 'aaa',
        exclusive: ['zzz'],
      }),
      ...createDef('zzz', {
        default: false,
        type: Boolean,
        description: 'zzz',
        exclusive: ['aaa'],
      }),
    },
    flatten,
  })
  await t.rejects(config.load(), {
    name: 'TypeError',
    message: '--zzz cannot be provided when using --aaa',
  })
})

t.test('exclusive env option is skipped when sibling is set via CLI', async t => {
  const path = t.testdir()
  const config = new Config({
    env: {
      HOME: path,
      npm_config_truth: 'true',
    },
    npmPath: __dirname,
    argv: [
      process.execPath,
      __filename,
      '--lie=true',
    ],
    cwd: join(`${path}/project`),
    excludeNpmCwd: true,
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
    nerfDarts,
    flatten,
  })
  // should not throw — env `truth` is skipped because `lie` was set via CLI
  await t.resolves(config.load())
  t.equal(config.get('lie'), true, 'CLI lie is set')
  t.equal(config.get('truth'), false, 'env truth is skipped, remains default')
})

t.test('env-replaced config from files is not clobbered when saving', async (t) => {
  const path = t.testdir()
  const opts = {
    shorthands: {},
    argv: ['node', __filename, `--userconfig=${path}/.npmrc`],
    env: { TEST: 'test value' },
    definitions: {
      registry: { default: 'https://registry.npmjs.org/' },
      test: { default: '' },
      other: { default: '' },
    },
    cwd: path,
    excludeNpmCwd: true,
    npmPath: path,
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
      nerfDarts,
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

t.test('catch project config prefix error', async t => {
  const path = t.testdir()
  t.testdir({
    project: {
      node_modules: {},
      '.npmrc': `
      project-config = true
      foo = from-project-config
      prefix=./lib
      `,
    },
  })
  const config = new Config({
    npmPath: `${path}/npm`,
    argv: [process.execPath, __filename],
    cwd: join(`${path}/project`),
    shorthands,
    definitions,
    nerfDarts,
  })
  const logs = []
  const logHandler = (...args) => logs.push(args)
  process.on('log', logHandler)
  t.teardown(() => process.off('log', logHandler))
  logs.length = 0
  // config.load() triggers the error to be logged
  await config.load()
  const filtered = logs.filter(l => l[0] === 'error')
  t.match(filtered, [[
    'error', 'config', `prefix cannot be changed from project config: ${path}`,
  ]], 'Expected error logged')
})

t.test('invalid single hyphen errors', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '-ws', '-iwr'],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })
  await t.rejects(config.load(), {
    code: 'EUNKNOWNCONFIG',
    message: /single-hyphen/,
  }, 'Throws on invalid single-hyphen flag')
})

t.test('positional arg is collected as unknown cli config', async t => {
  const path = t.testdir()
  const logs = []
  const logHandler = (...args) => logs.push(args)
  process.on('log', logHandler)
  t.teardown(() => process.off('log', logHandler))
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '--something', 'extra'],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })
  // Unknown CLI flags are collected silently during load(); base-cmd throws
  // later once command-scoped definitions are known.
  await config.load()
  const filtered = logs.filter(l => l[0] === 'warn')
  t.match(filtered, [
    ['warn', '"extra" is being parsed as a normal command line argument.'],
  ], 'Still warns about positional cli arg being parsed as positional')
  const unknowns = config.getUnknownConfigs('cli')
  t.ok(unknowns.some(u => u.key === 'something'),
    'unknown cli flag collected for later validation')
})

t.test('abbreviation expansion errors', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '--bef', '2020-01-01'],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })
  await t.rejects(config.load(), {
    code: 'EUNKNOWNCONFIG',
    message: /--bef.*--before/,
  }, 'Throws on abbreviation expansion')
})

t.test('warning suppression and logging', async t => {
  const path = t.testdir()
  const logs = []
  const logHandler = (...args) => logs.push(args)
  process.on('log', logHandler)
  t.teardown(() => process.off('log', logHandler))

  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '--unknown-key', 'value'],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })

  // Load first to collect warnings
  await config.load()

  // Now disable warnings and trigger more
  config.warn = false
  config.queueWarning('test-type', 'test warning 1')
  config.queueWarning('test-type2', 'test warning 2')

  // Should have warnings collected but not logged
  const initialWarnings = logs.filter(l => l[0] === 'warn')
  const beforeCount = initialWarnings.length

  // Now log the warnings
  config.warn = true
  config.logWarnings()
  const afterLogging = logs.filter(l => l[0] === 'warn')
  t.ok(afterLogging.length > beforeCount, 'warnings logged after logWarnings()')

  // Calling logWarnings again should not add more warnings
  const warningCount = afterLogging.length
  config.logWarnings()
  const finalWarnings = logs.filter(l => l[0] === 'warn')
  t.equal(finalWarnings.length, warningCount, 'no duplicate warnings after second logWarnings()')
})

t.test('warn false with unknown env flag and warning removal', async t => {
  const path = t.testdir()
  const logs = []
  const logHandler = (...args) => logs.push(args)
  process.on('log', logHandler)
  t.teardown(() => process.off('log', logHandler))

  const config = new Config({
    npmPath: `${path}/npm`,
    env: { npm_config_invalid_flag: 'value' },
    argv: [process.execPath, __filename],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })

  config.warn = false
  await config.load()

  // First logWarnings call - should log the queued env-unknown warning
  const logsBeforeFirst = logs.filter(l => l[0] === 'warn').length
  config.logWarnings()
  const logsAfterFirst = logs.filter(l => l[0] === 'warn')

  t.ok(logsAfterFirst.length > logsBeforeFirst, 'warnings were logged')
  const invalidFlagWarnings = logsAfterFirst.filter(w => w[1] && w[1].includes('invalid-flag'))
  t.ok(invalidFlagWarnings.length > 0, 'invalid-flag warning present')

  // Trigger the same warning again
  config.checkUnknown('env', 'invalid-flag')

  // Remove the warning
  config.removeWarning('invalid-flag')

  // Call logWarnings again - should not add the invalid-flag warning since we removed it
  const beforeSecondLog = logs.filter(l => l[0] === 'warn').length
  config.logWarnings()
  const afterSecondLog = logs.filter(l => l[0] === 'warn')
  t.equal(afterSecondLog.length, beforeSecondLog, 'no new warnings after removal and logWarnings')
})

t.test('prefix getter when global is true', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '--global'],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })

  await config.load()
  t.equal(config.prefix, config.globalPrefix, 'prefix returns globalPrefix when global=true')
})

t.test('prefix getter when global is false', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })

  await config.load()
  t.equal(config.prefix, config.localPrefix, 'prefix returns localPrefix when global=false')
})

t.test('find throws when config not loaded', async t => {
  const config = new Config({
    npmPath: t.testdir(),
    env: {},
    argv: [process.execPath, __filename],
    cwd: process.cwd(),
    shorthands,
    definitions,
    nerfDarts,
  })

  t.throws(
    () => config.find('registry'),
    /call config\.load\(\) before reading values/,
    'find throws before load'
  )
})

t.test('valid getter with invalid config', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '--maxsockets', 'not-a-number'],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
  })

  await config.load()
  const isValid = config.valid
  t.notOk(isValid, 'config is invalid when it has invalid values')
})

t.test('getUnknownPositionals and removeUnknownPositional', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    // Pass unknown flags with values - the values become "unknown positionals"
    argv: [process.execPath, __filename, '--unknown-flag1', 'positional1', '--unknown-flag2', 'positional2'],
    cwd: path,
    shorthands,
    definitions,
    nerfDarts,
    warn: false, // Queue warnings instead of logging them
  })

  await config.load()

  // Get the unknown positionals (values after unknown flags)
  const unknownPositionals = config.getUnknownPositionals()
  t.ok(unknownPositionals.includes('positional1'), 'positional1 is in unknown positionals')
  t.ok(unknownPositionals.includes('positional2'), 'positional2 is in unknown positionals')

  // Remove one positional
  config.removeUnknownPositional('positional1')

  // Verify it was removed
  const afterRemoval = config.getUnknownPositionals()
  t.notOk(afterRemoval.includes('positional1'), 'positional1 was removed')
  t.ok(afterRemoval.includes('positional2'), 'positional2 still exists')

  // Remove the second positional
  config.removeUnknownPositional('positional2')

  // Verify all are removed
  const afterSecondRemoval = config.getUnknownPositionals()
  t.equal(afterSecondRemoval.length, 0, 'no unknown positionals remain')
})

t.test('before and min-release-age', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '--min-release-age', '30'],
    cwd: path,
    definitions,
    nerfDarts,
    shorthands,
    flatten,
  })
  await config.load()
  // Simple gut check to make sure we didn't do + instead of -
  t.ok(config.flat.before < Date.now(), 'before date is in the past not the future')
  t.equal(config.get('min-release-age'), 30, 'min-release-age config remains readable after flattening')
})

// Regression test for https://github.com/npm/cli/issues/9291
// pacote spawns child npm processes with `--before=<date>` whenever it has a
// `before` option (which includes the case where the parent derived `before`
// from `min-release-age`). The child process then loads the user's npmrc, which
// still contains `min-release-age=N`. Previously this combination crashed
// because the two options were declared mutually exclusive.
t.test('min-release-age in npmrc coexists with --before from CLI (pacote spawn)', async t => {
  const dir = t.testdir({
    '.npmrc': 'min-release-age=7',
  })
  const cliBefore = new Date('2024-01-15T00:00:00.000Z')
  const config = new Config({
    npmPath: __dirname,
    env: { HOME: dir },
    argv: [process.execPath, __filename, `--before=${cliBefore.toISOString()}`],
    cwd: dir,
    definitions,
    shorthands,
    flatten,
  })
  await t.resolves(config.load(), 'loads without crashing on previously exclusive options')
  // CLI is the highest-priority source, so its `before` overrides whatever
  // `min-release-age` in the npmrc would have produced.
  t.equal(
    config.flat.before.toISOString(),
    cliBefore.toISOString(),
    'CLI --before overrides npmrc min-release-age'
  )
})

// A higher-priority source must be able to relax (or override) a stricter
// lower-priority `min-release-age`. Previously this would have thrown via
// the `exclusive` check; now it follows normal cli > npmrc precedence.
t.test('CLI --min-release-age=0 relaxes a stricter npmrc min-release-age', async t => {
  const dir = t.testdir({
    '.npmrc': 'min-release-age=30',
  })
  const config = new Config({
    npmPath: __dirname,
    env: { HOME: dir },
    argv: [process.execPath, __filename, '--min-release-age=0'],
    cwd: dir,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  // CLI=0 explicitly asserts "no minimum age", clearing the before filter
  // derived from the lower-priority npmrc value. (Setting `before = now`
  // here would still filter out brand-new versions due to clock skew.)
  t.equal(config.flat.before, null, 'CLI 0 clears the npmrc-derived before filter')
})

// Within a single source, an explicit `before` wins over a relative
// `min-release-age` so the resolution is deterministic regardless of the
// argv parser's key-iteration order.
t.test('within a single source, before wins over min-release-age', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [
      process.execPath,
      __filename,
      '--min-release-age=1',
      '--before=2020-01-01T00:00:00.000Z',
    ],
    cwd: path,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  t.equal(
    config.flat.before.toISOString(),
    '2020-01-01T00:00:00.000Z',
    'explicit --before wins over --min-release-age in the same source'
  )
})

t.test('min-release-age=0 does not set a before filter', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: {},
    argv: [process.execPath, __filename, '--min-release-age', '0'],
    cwd: path,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  t.equal(config.flat.before, null, 'flat.before remains null when min-release-age=0')
  t.equal(config.get('min-release-age'), 0, 'min-release-age=0 is preserved')
})

t.test('higher-priority min-release-age overrides a lower-priority before', async t => {
  const dir = t.testdir({
    '.npmrc': 'before=2020-01-01T00:00:00.000Z',
  })
  const config = new Config({
    npmPath: __dirname,
    env: { HOME: dir },
    argv: [process.execPath, __filename, '--min-release-age=7'],
    cwd: dir,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  const expected = Date.now() - (7 * 86400000)
  t.ok(
    Math.abs(config.flat.before.getTime() - expected) < 60_000,
    'flat.before reflects CLI --min-release-age, not npmrc before'
  )
})

t.test('CLI --min-release-age=0 clears a lower-priority npmrc before', async t => {
  const dir = t.testdir({
    '.npmrc': 'before=2020-01-01T00:00:00.000Z',
  })
  const config = new Config({
    npmPath: __dirname,
    env: { HOME: dir },
    argv: [process.execPath, __filename, '--min-release-age=0'],
    cwd: dir,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  t.equal(config.flat.before, null, 'CLI 0 clears the npmrc-set before')
})

// Env source (`npm_config_*`) routes through the same flatten path as cli and npmrc; lock down its precedence behavior too.
t.test('env npm_config_min_release_age applies as a relative window', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: { npm_config_min_release_age: '7' },
    argv: [process.execPath, __filename],
    cwd: path,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  const expected = Date.now() - (7 * 86400000)
  t.ok(
    Math.abs(config.flat.before.getTime() - expected) < 60_000,
    'flat.before reflects env-source min-release-age'
  )
})

t.test('env npm_config_min_release_age=0 clears a lower-priority npmrc before', async t => {
  const dir = t.testdir({
    '.npmrc': 'before=2020-01-01T00:00:00.000Z',
  })
  const config = new Config({
    npmPath: __dirname,
    env: { HOME: dir, npm_config_min_release_age: '0' },
    argv: [process.execPath, __filename],
    cwd: dir,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  t.equal(config.flat.before, null, 'env 0 clears the npmrc-set before')
})

t.test('CLI --min-release-age beats env npm_config_min_release_age', async t => {
  const path = t.testdir()
  const config = new Config({
    npmPath: `${path}/npm`,
    env: { npm_config_min_release_age: '30' },
    argv: [process.execPath, __filename, '--min-release-age=3'],
    cwd: path,
    definitions,
    shorthands,
    flatten,
  })
  await config.load()
  const expected = Date.now() - (3 * 86400000)
  t.ok(
    Math.abs(config.flat.before.getTime() - expected) < 60_000,
    'CLI --min-release-age=3 overrides env npm_config_min_release_age=30'
  )
})
