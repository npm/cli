const procLog = require('proc-log')
const { resolve } = require('node:path')
const t = require('tap')
const fs = require('node:fs/promises')
const { setup, createPkg, merge } = require('./fixtures/setup.js')

t.test('prompt, accepts', async t => {
  const { pkg, package, fixtures } = createPkg({
    name: '@npmcli/create-index',
    version: '1.0.0',
  })
  const { exec, path, registry } = setup(t, {
    testdir: fixtures,
    mocks: {
      'ci-info': { isCI: false },
      '../../lib/no-tty.js': () => false,
      read: { read: async () => 'y' },
      'proc-log': {
        ...procLog,
        input: {
          ...procLog.input,
          read: (fn) => fn(),
        },
      },
    },
  })

  await package({ registry, path })

  await exec({
    args: ['@npmcli/create-index'],
    yes: undefined,
  })

  const installedDir = `npxCache/e7ce50d8d2d8ec11/node_modules/${pkg.name}/package.json`
  t.ok(await fs.stat(resolve(path, installedDir)).then(f => f.isFile()))
})

t.test('prompt, refuses', async t => {
  const { pkg, package, fixtures } = createPkg({
    name: '@npmcli/create-index',
    version: '1.0.0',
  })
  const { exec, path, registry } = setup(t, {
    testdir: fixtures,
    mocks: {
      'ci-info': { isCI: false },
      read: { read: async () => 'n' },
      'proc-log': {
        ...procLog,
        input: {
          ...procLog.input,
          read: (fn) => fn(),
        },
      },
      '../../lib/no-tty.js': () => false,
    },
  })

  await package({ registry, path, times: 1, tarballs: [] })

  await t.rejects(
    exec({
      args: ['@npmcli/create-index'],
      yes: undefined,
    }),
    /canceled/,
    'should throw with canceled error'
  )

  const installedDir = `npxCache/e7ce50d8d2d8ec11/node_modules/${pkg.name}/package.json`
  t.rejects(
    () => fs.stat(resolve(path, installedDir)),
    { code: 'ENOENT' }
  )
})

t.test('prompt, -n', async t => {
  const { pkg, package, fixtures } = createPkg({
    name: '@npmcli/create-index',
    version: '1.0.0',
  })
  const { exec, path, registry } = setup(t, {
    testdir: fixtures,
  })

  await package({ registry, path, times: 1, tarballs: [] })

  await t.rejects(
    exec({
      args: ['@npmcli/create-index'],
      yes: false,
    }),
    /canceled/,
    'should throw with canceled error'
  )

  const installedDir = `npxCache/e7ce50d8d2d8ec11/node_modules/${pkg.name}/package.json`
  t.rejects(
    () => fs.stat(resolve(path, installedDir)),
    { code: 'ENOENT' }
  )
})

t.test('no prompt if no tty', async t => {
  const { pkg, package, fixtures } = createPkg({
    name: '@npmcli/create-index',
    version: '1.0.0',
  })
  const { exec, path, registry } = setup(t, {
    testdir: fixtures,
    mocks: { '../../lib/no-tty.js': () => true },
  })

  await package({ registry, path })

  await exec({
    args: ['@npmcli/create-index'],
    yes: undefined,
  })

  const installedDir = `npxCache/e7ce50d8d2d8ec11/node_modules/${pkg.name}/package.json`
  t.ok(await fs.stat(resolve(path, installedDir)).then(f => f.isFile()))
})

t.test('no prompt if CI', async t => {
  const { pkg, package, fixtures } = createPkg({
    name: '@npmcli/create-index',
    version: '1.0.0',
  })
  const { exec, path, registry } = setup(t, {
    testdir: fixtures,
    mocks: { 'ci-info': { isCI: true } },
  })

  await package({ registry, path })

  await exec({
    args: ['@npmcli/create-index'],
    yes: undefined,
  })

  const installedDir = `npxCache/e7ce50d8d2d8ec11/node_modules/${pkg.name}/package.json`
  t.ok(await fs.stat(resolve(path, installedDir)).then(f => f.isFile()))
})

t.test('no prompt if CI, multiple packages', async t => {
  t.plan(4)

  const pkgIndex = createPkg({
    name: '@npmcli/create-index',
    version: '1.0.0',
  })
  const pkgTest = createPkg({
    name: '@npmcli/create-test',
    version: '1.0.0',
  })
  const { exec, path, registry } = setup(t, {
    testdir: merge(pkgIndex.fixtures, pkgTest.fixtures),
    mocks: {
      'ci-info': { isCI: true },
      'proc-log': {
        ...procLog,
        log: {
          ...procLog.log,
          warn (title, msg) {
            t.equal(title, 'exec', 'should warn exec title')
            // this message is nondeterministic as it queries manifests so we just
            // test the constituent parts
            t.match(
              msg,
              'The following packages were not found and will be installed:',
              'should warn installing packages'
            )
            t.match(msg, '@npmcli/create-index@1.0.0', 'includes package being installed')
            t.match(msg, '@npmcli/create-test@1.0.0', 'includes package being installed')
          },
        },
      },
    },
  })

  await pkgIndex.package({ path, registry })
  await pkgTest.package({ path, registry })

  await exec({
    call: 'create-index',
    packages: ['@npmcli/create-index', '@npmcli/create-test'],
    yes: undefined,
  })
})

t.test('defaults', async t => {
  const { pkg, fixtures, package } = createPkg({
    name: '@npmcli/create-index',
    version: '1.0.0',
  })
  const { exec, path, registry, readOutput } = setup(t, {
    pkg,
    defaults: false,
    execPath: '../../../lib/index.js',
    testdir: {
      ...fixtures,
      work: {},
    },
  })

  const workDir = resolve(path, 'work')
  const cwd = process.cwd()
  process.chdir(workDir)
  t.teardown(() => process.chdir(cwd))

  await package({ registry, path })

  await exec({
    args: ['@npmcli/create-index'],
    yes: true,
  })

  t.match(await readOutput('', { root: workDir }), {
    value: 'packages-1.0.0',
    args: [],
  })
})

t.test('scriptShell default value', async t => {
  await t.test('/bin/sh platforms', async t => {
    t.plan(1)
    const mockexec = t.mock('../lib/index.js', {
      '../lib/is-windows.js': false,
      '../lib/run-script.js': (opt) => {
        t.equal(opt.scriptShell, 'sh', 'should use expected shell value')
      },
    })
    await mockexec({ args: [], runPath: t.testDirName })
  })

  await t.test('win32 defined ComSpec env var', async t => {
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
    await mockexec({ args: [], runPath: t.testDirName })
  })

  await t.test('win32 cmd', async t => {
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
    await mockexec({ args: [], runPath: t.testDirName })
  })
})

t.test('workspaces', async t => {
  const { pkg, fixtures } = createPkg({
    name: '@npmcli/create-index',
    localVersion: '2.0.0',
  })

  const { path, exec, chmod, binLinks, readOutput } = setup(t, {
    pkg,
    testdir: merge(fixtures, {
      'package.json': {
        workspaces: ['a'],
        dependencies: null,
      },
      a: {
        'package.json': {
          name: 'a',
          version: '1.0.0',
          dependencies: fixtures['package.json'].dependencies,
        },
      },
      node_modules: {
        a: t.fixture('symlink', '../a'),
      },
    }),
  })

  await chmod()
  await binLinks()

  // runs at the project level
  await exec({
    args: ['create-index'],
    localBin: resolve(path, 'node_modules/.bin'),
  })

  t.match(await readOutput(), {
    value: 'local-2.0.0',
  })

  // runs at the child workspace level
  await exec({
    args: ['create-index'],
    localBin: resolve(path, 'a/node_modules/.bin'),
    path: resolve(path, 'a'),
    runPath: resolve(path, 'a'),
  })

  t.match(await readOutput('', { root: resolve(path, 'a') }), {
    value: 'local-2.0.0',
  })
})
