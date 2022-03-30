const fs = require('fs')
const { resolve } = require('path')
const t = require('tap')
const binLinks = require('bin-links')

const libexec = require('../lib/index.js')

// setup server
const registryServer = require('./registry/server.js')
const { registry } = registryServer
t.test('setup server', { bail: true, buffered: false }, registryServer)

const baseOpts = {
  audit: false,
  call: '',
  color: false,
  localBin: '',
  globalBin: '',
  packages: [],
  path: '',
  registry,
  runPath: '',
  scriptShell: undefined,
  yes: true,
}

t.test('local pkg', async t => {
  const pkg = {
    name: 'pkg',
    bin: {
      a: 'index.js',
    },
  }
  const path = t.testdir({
    cache: {},
    npxCache: {},
    node_modules: {
      '.bin': {},
      a: {
        'index.js': `#!/usr/bin/env node
require('fs').writeFileSync(process.argv.slice(2)[0], 'LOCAL PKG')`,
      },
    },
    'package.json': JSON.stringify(pkg),
  })
  const localBin = resolve(path, 'node_modules/.bin')
  const runPath = path

  const executable = resolve(path, 'node_modules/a')
  fs.chmodSync(executable, 0o775)

  await binLinks({
    path: resolve(path, 'node_modules/a'),
    pkg,
  })

  await libexec({
    ...baseOpts,
    args: ['a', 'resfile'],
    localBin,
    path,
    runPath,
  })

  const res = fs.readFileSync(resolve(path, 'resfile')).toString()
  t.equal(res, 'LOCAL PKG', 'should run local pkg bin script')
})

t.test('local pkg, must not fetch manifest for avail pkg', async t => {
  const pkg = {
    name: '@ruyadorno/create-index',
    version: '2.0.0',
    bin: {
      'create-index': './index.js',
    },
  }
  const path = t.testdir({
    cache: {},
    npxCache: {},
    node_modules: {
      '.bin': {},
      '@ruyadorno': {
        'create-index': {
          'package.json': JSON.stringify(pkg),
          'index.js': `#!/usr/bin/env node
  require('fs').writeFileSync(process.argv.slice(2)[0], 'LOCAL PKG')`,
        },
      },
    },
    'package.json': JSON.stringify({
      name: 'pkg',
      dependencies: {
        '@ruyadorno/create-index': '^2.0.0',
      },
    }),
  })
  const runPath = path
  const cache = resolve(path, 'cache')
  const npxCache = resolve(path, 'npxCache')

  const executable =
    resolve(path, 'node_modules/@ruyadorno/create-index/index.js')
  fs.chmodSync(executable, 0o775)

  await binLinks({
    path: resolve(path, 'node_modules/@ruyadorno/create-index'),
    pkg,
  })

  await libexec({
    ...baseOpts,
    cache,
    npxCache,
    packages: ['@ruyadorno/create-index'],
    call: 'create-index resfile',
    path,
    runPath,
  })

  const res = fs.readFileSync(resolve(path, 'resfile')).toString()
  t.equal(res, 'LOCAL PKG', 'should run local pkg bin script')
})

t.test('multiple local pkgs', async t => {
  const foo = {
    name: '@ruyadorno/create-foo',
    version: '2.0.0',
    bin: {
      'create-foo': './index.js',
    },
  }
  const bar = {
    name: '@ruyadorno/create-bar',
    version: '2.0.0',
    bin: {
      'create-bar': './index.js',
    },
  }
  const path = t.testdir({
    cache: {},
    npxCache: {},
    node_modules: {
      '.bin': {},
      '@ruyadorno': {
        'create-foo': {
          'package.json': JSON.stringify(foo),
          'index.js': `#!/usr/bin/env node
  require('fs').writeFileSync(process.argv.slice(2)[0], 'foo')`,
        },
        'create-bar': {
          'package.json': JSON.stringify(bar),
          'index.js': `#!/usr/bin/env node
  require('fs').writeFileSync(process.argv.slice(2)[0], 'bar')`,
        },
      },
    },
    'package.json': JSON.stringify({
      name: 'pkg',
      dependencies: {
        '@ruyadorno/create-foo': '^2.0.0',
        '@ruyadorno/create-bar': '^2.0.0',
      },
    }),
  })
  const runPath = path
  const cache = resolve(path, 'cache')
  const npxCache = resolve(path, 'npxCache')

  const setupBins = async (pkg) => {
    const executable =
      resolve(path, `node_modules/${pkg.name}/index.js`)
    fs.chmodSync(executable, 0o775)

    await binLinks({
      path: resolve(path, `node_modules/${pkg.name}`),
      pkg,
    })
  }

  await Promise.all([foo, bar]
    .map(setupBins))

  await libexec({
    ...baseOpts,
    localBin: resolve(path, 'node_modules/.bin'),
    cache,
    npxCache,
    packages: ['@ruyadorno/create-foo', '@ruyadorno/create-bar'],
    call: 'create-foo resfile && create-bar bar',
    path,
    runPath,
  })

  const resFoo = fs.readFileSync(resolve(path, 'resfile')).toString()
  t.equal(resFoo, 'foo', 'should run local pkg bin script')
  const resBar = fs.readFileSync(resolve(path, 'bar')).toString()
  t.equal(resBar, 'bar', 'should run local pkg bin script')
})

t.test('local file system path', async t => {
  const path = t.testdir({
    cache: {},
    npxCache: {},
    a: {
      'package.json': JSON.stringify({
        name: 'a',
        bin: {
          a: './index.js',
        },
      }),
      'index.js': `#!/usr/bin/env node
require('fs').writeFileSync(process.argv.slice(2)[0], 'LOCAL PKG')`,
    },
  })
  const runPath = path
  const cache = resolve(path, 'cache')
  const npxCache = resolve(path, 'npxCache')

  const executable = resolve(path, 'a/index.js')
  fs.chmodSync(executable, 0o775)

  await libexec({
    ...baseOpts,
    args: [`file:${resolve(path, 'a')}`, 'resfile'],
    cache,
    npxCache,
    path,
    runPath,
  })

  const res = fs.readFileSync(resolve(path, 'resfile')).toString()
  t.equal(res, 'LOCAL PKG', 'should run local pkg bin script')
})

t.test('global space pkg', async t => {
  const pkg = {
    name: 'a',
    bin: {
      a: 'index.js',
    },
  }
  const path = t.testdir({
    cache: {},
    npxCache: {},
    global: {
      node_modules: {
        '.bin': {},
        a: {
          'index.js': `#!/usr/bin/env node
  require('fs').writeFileSync(process.argv.slice(2)[0], 'GLOBAL PKG')`,
          'package.json': JSON.stringify(pkg),
        },
      },
    },
  })
  const globalBin = resolve(path, 'global/node_modules/.bin')
  const runPath = path

  const executable = resolve(path, 'global/node_modules/a')
  fs.chmodSync(executable, 0o775)

  await binLinks({
    path: resolve(path, 'global/node_modules/a'),
    pkg,
  })

  await libexec({
    ...baseOpts,
    args: ['a', 'resfile'],
    globalBin,
    path,
    runPath,
  })

  const res = fs.readFileSync(resolve(path, 'resfile')).toString()
  t.equal(res, 'GLOBAL PKG', 'should run local pkg bin script')
})

t.test('run from registry', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')

  t.throws(
    () => fs.statSync(resolve(path, 'index.js')),
    { code: 'ENOENT' },
    'should not have template file'
  )

  await libexec({
    ...baseOpts,
    args: ['@ruyadorno/create-index'],
    cache,
    npxCache,
    path,
    runPath,
  })

  t.ok(fs.statSync(resolve(path, 'index.js')).isFile(), 'ran create pkg')
})

t.test('avoid install when exec from registry an available pkg', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')

  t.throws(
    () => fs.statSync(resolve(path, 'index.js')),
    { code: 'ENOENT' },
    'should not have template file'
  )

  await libexec({
    ...baseOpts,
    args: ['@ruyadorno/create-index'],
    cache,
    npxCache,
    path,
    runPath,
  })

  t.ok(fs.statSync(resolve(path, 'index.js')).isFile(), 'ran create pkg')
  fs.unlinkSync(resolve(path, 'index.js'))

  await libexec({
    ...baseOpts,
    args: ['@ruyadorno/create-index'],
    cache,
    npxCache,
    path,
    runPath,
  })

  t.ok(fs.statSync(resolve(path, 'index.js')).isFile(), 'ran create pkg again')
})

t.test('run multiple from registry', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')

  t.throws(
    () => fs.statSync(resolve(path, 'index.js')),
    { code: 'ENOENT' },
    'should not have index template file'
  )

  t.throws(
    () => fs.statSync(resolve(path, 'test.js')),
    { code: 'ENOENT' },
    'should not have test template file'
  )

  await libexec({
    ...baseOpts,
    packages: ['@ruyadorno/create-test', '@ruyadorno/create-index'],
    call: ['create-test && create-index'],
    cache,
    npxCache,
    path,
    runPath,
  })

  t.ok(fs.statSync(resolve(path, 'index.js')).isFile(), 'ran index pkg')
  t.ok(fs.statSync(resolve(path, 'test.js')).isFile(), 'ran test pkg')
})

t.test('no args', async t => {
  const path = t.testdir({})
  const runPath = path
  const mockexec = t.mock('../lib/index.js', {
    '../lib/run-script': ({ args }) => {
      t.ok(args.length === 0, 'should call run-script with no args')
    },
  })

  await mockexec({
    ...baseOpts,
    path,
    runPath,
  })
})

t.test('prompt, accepts', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')
  t.test('with clearProgress function', async t => {
    const mockexec = t.mock('../lib/index.js', {
      '@npmcli/ci-detect': () => false,
      npmlog: {
        clearProgress () {
          t.ok(true, 'should call clearProgress function')
        },
        disableProgress () {},
        enableProgress () {},
      },
      read (opts, cb) {
        cb(null, 'y')
      },
      '../lib/no-tty.js': () => false,
    })

    await mockexec({
      ...baseOpts,
      args: ['@ruyadorno/create-index'],
      cache,
      npxCache,
      path,
      runPath,
      yes: undefined,
    })

    const installedDir = resolve(npxCache,
      '0e8e15840a234288/node_modules/@ruyadorno/create-index/package.json')
    t.ok(fs.statSync(installedDir).isFile(), 'installed required packages')
  })

  t.test('without clearProgress function', async t => {
    const mockexec = t.mock('../lib/index.js', {
      '@npmcli/ci-detect': () => false,
      read (opts, cb) {
        cb(null, 'y')
      },
      '../lib/no-tty.js': () => false,
    })

    await mockexec({
      ...baseOpts,
      args: ['@ruyadorno/create-index'],
      cache,
      npxCache,
      path,
      runPath,
      yes: undefined,
    })

    const installedDir = resolve(npxCache,
      '0e8e15840a234288/node_modules/@ruyadorno/create-index/package.json')
    t.ok(fs.statSync(installedDir).isFile(), 'installed required packages')
  })
})

t.test('prompt, refuses', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')
  t.test('with clearProgress function', async t => {
    const mockexec = t.mock('../lib/index.js', {
      '@npmcli/ci-detect': () => false,
      npmlog: {
        clearProgress () {
          t.ok(true, 'should call clearProgress function')
        },
        disableProgess () {},
      },
      read (opts, cb) {
        cb(null, 'n')
      },
      '../lib/no-tty.js': () => false,
    })

    await t.rejects(
      mockexec({
        ...baseOpts,
        args: ['@ruyadorno/create-index'],
        cache,
        npxCache,
        path,
        runPath,
        yes: undefined,
      }),
      /canceled/,
      'should throw with canceled error'
    )

    const installedDir = resolve(npxCache,
      '0e8e15840a234288/node_modules/@ruyadorno/create-index/package.json')

    t.throws(
      () => fs.statSync(installedDir),
      { code: 'ENOENT' },
      'should not have installed required packages'
    )
  })

  t.test('without clearProgress function', async t => {
    const mockexec = t.mock('../lib/index.js', {
      '@npmcli/ci-detect': () => false,
      read (opts, cb) {
        cb(null, 'n')
      },
      '../lib/no-tty.js': () => false,
    })

    await t.rejects(
      mockexec({
        ...baseOpts,
        args: ['@ruyadorno/create-index'],
        cache,
        npxCache,
        path,
        runPath,
        yes: undefined,
      }),
      /canceled/,
      'should throw with canceled error'
    )

    const installedDir = resolve(npxCache,
      '0e8e15840a234288/node_modules/@ruyadorno/create-index/package.json')

    t.throws(
      () => fs.statSync(installedDir),
      { code: 'ENOENT' },
      'should not have installed required packages'
    )
  })
})

t.test('prompt, -n', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')

  await t.rejects(
    libexec({
      ...baseOpts,
      args: ['@ruyadorno/create-index'],
      cache,
      npxCache,
      path,
      runPath,
      yes: false,
    }),
    /canceled/,
    'should throw with canceled error'
  )

  const installedDir = resolve(npxCache,
    '0e8e15840a234288/node_modules/@ruyadorno/create-index/package.json')

  t.throws(
    () => fs.statSync(installedDir),
    { code: 'ENOENT' },
    'should not have installed required packages'
  )
})

t.test('no prompt if no tty', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')
  const mockexec = t.mock('../lib/index.js', {
    '../lib/no-tty.js': () => true,
  })

  await mockexec({
    ...baseOpts,
    args: ['@ruyadorno/create-index'],
    cache,
    npxCache,
    path,
    runPath,
    yes: undefined,
  })

  const installedDir = resolve(npxCache,
    '0e8e15840a234288/node_modules/@ruyadorno/create-index/package.json')
  t.ok(fs.statSync(installedDir).isFile(), 'installed required packages')
})

t.test('no prompt if CI', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')
  const mockexec = t.mock('../lib/index.js', {
    '@npmcli/ci-detect': () => true,
  })

  await mockexec({
    ...baseOpts,
    args: ['@ruyadorno/create-index'],
    cache,
    npxCache,
    path,
    runPath,
    yes: undefined,
  })

  const installedDir = resolve(npxCache,
    '0e8e15840a234288/node_modules/@ruyadorno/create-index/package.json')
  t.ok(fs.statSync(installedDir).isFile(), 'installed required packages')
})

t.test('no prompt if CI, multiple packages', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const path = resolve(testdir, 'work')
  const runPath = path
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')
  const mockexec = t.mock('../lib/index.js', {
    '@npmcli/ci-detect': () => true,
    'proc-log': {
      warn (title, msg) {
        t.equal(title, 'exec', 'should warn exec title')
        const expected = 'The following packages were not found and will be ' +
          'installed: @ruyadorno/create-index, @ruyadorno/create-test'
        t.equal(msg, expected, 'should warn installing pkg')
      },
    },
  })

  await mockexec({
    ...baseOpts,
    call: 'create-index',
    packages: ['@ruyadorno/create-index', '@ruyadorno/create-test'],
    cache,
    npxCache,
    path,
    runPath,
    yes: undefined,
  })
})

t.test('sane defaults', async t => {
  const testdir = t.testdir({
    cache: {},
    npxCache: {},
    work: {},
  })
  const cache = resolve(testdir, 'cache')
  const npxCache = resolve(testdir, 'npxCache')
  const workdir = resolve(testdir, 'work')

  const cwd = process.cwd()
  process.chdir(workdir)
  t.teardown(() => {
    process.chdir(cwd)
  })

  await libexec({
    args: ['@ruyadorno/create-index'],
    cache,
    npxCache,
    yes: true,
  })

  t.ok(fs.statSync(resolve(workdir, 'index.js')).isFile(),
    'ran create-index pkg')
})

t.test('scriptShell default value', t => {
  t.test('/bin/sh platforms', t => {
    t.plan(1)
    const mockexec = t.mock('../lib/index.js', {
      '../lib/is-windows.js': false,
      '../lib/run-script.js': (opt) => {
        t.equal(opt.scriptShell, 'sh', 'should use expected shell value')
      },
    })
    mockexec({ args: [], runPath: t.testDirName })
  })

  t.test('win32 defined ComSpec env var', t => {
    t.plan(1)
    const comspec = process.env.ComSpec
    process.env.ComSpec = 'CMD'
    const mockexec = t.mock('../lib/index.js', {
      '../lib/is-windows.js': true,
      '../lib/run-script.js': ({ scriptShell }) => {
        t.equal(scriptShell, 'CMD', 'should use expected ComSpec value')
        process.env.ComSpec = comspec
      },
    })
    mockexec({ args: [], runPath: t.testDirName })
  })

  t.test('win32 cmd', t => {
    t.plan(1)
    const comspec = process.env.ComSpec
    process.env.ComSpec = ''
    const mockexec = t.mock('../lib/index.js', {
      '../lib/is-windows.js': true,
      '../lib/run-script.js': ({ scriptShell }) => {
        t.equal(scriptShell, 'cmd', 'should use expected cmd default value')
        process.env.ComSpec = comspec
      },
    })
    mockexec({ args: [], runPath: t.testDirName })
  })

  t.end()
})

t.test('workspaces', async t => {
  const pkg = {
    name: '@ruyadorno/create-index',
    version: '2.0.0',
    bin: {
      'create-index': './index.js',
    },
  }
  const path = t.testdir({
    cache: {},
    npxCache: {},
    node_modules: {
      '.bin': {},
      '@ruyadorno': {
        'create-index': {
          'package.json': JSON.stringify(pkg),
          'index.js': `#!/usr/bin/env node
  require('fs').writeFileSync('resfile', 'LOCAL PKG')`,
        },
      },
      a: t.fixture('symlink', '../a'),
    },
    'package.json': JSON.stringify({
      name: 'project',
      workspaces: ['a'],
    }),
    a: {
      'package.json': JSON.stringify({
        name: 'a',
        version: '1.0.0',
        dependencies: {
          '@ruyadorno/create-index': '^2.0.0',
        },
      }),
    },
  })
  const runPath = path
  const cache = resolve(path, 'cache')
  const npxCache = resolve(path, 'npxCache')

  const executable =
    resolve(path, 'node_modules/@ruyadorno/create-index/index.js')
  fs.chmodSync(executable, 0o775)

  await binLinks({
    path: resolve(path, 'node_modules/@ruyadorno/create-index'),
    pkg,
  })

  // runs at the project level
  await libexec({
    ...baseOpts,
    args: ['create-index'],
    localBin: resolve(path, 'node_modules/.bin'),
    cache,
    npxCache,
    path,
    runPath,
  })

  const res = fs.readFileSync(resolve(path, 'resfile')).toString()
  t.equal(res, 'LOCAL PKG', 'should run existing bin from project level')

  // runs at the child workspace level
  await libexec({
    ...baseOpts,
    args: ['create-index'],
    cache,
    npxCache,
    localBin: resolve(path, 'a/node_modules/.bin'),
    path: resolve(path, 'a'),
    runPath: resolve(path, 'a'),
  })

  const wRes = fs.readFileSync(resolve(path, 'a/resfile')).toString()
  t.equal(wRes, 'LOCAL PKG', 'should run existing bin from workspace level')
})
