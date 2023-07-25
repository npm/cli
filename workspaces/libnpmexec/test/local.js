const log = require('proc-log')
const { resolve } = require('path')
const t = require('tap')
const fs = require('fs/promises')
const { resetSeen: resetSeenLinks } = require('bin-links')
const { setup, createPkg, merge } = require('./fixtures/setup.js')

t.test('bin in local pkg', async t => {
  const { pkg, fixtures } = createPkg({
    version: '1.0.0',
    name: '@npmcli/local-pkg-bin-test',
    bin: {
      b: 'does-not-exist.js',
      a: 'local-bin-test.js',
      'a-nested': 'bin-dir/nested-bin-test.js',
      'conflicting-bin': 'conflicting-bin-test.js',
    },
    files: {
      'local-bin-test.js': { key: 'local-bin', value: 'LOCAL PKG' },
      'conflicting-bin-test.js': { key: 'conflicting-bin', value: 'LOCAL PKG' },
      'bin-dir': {
        'nested-bin-test.js': { key: 'nested-bin', value: 'LOCAL PKG' },
      },
    },
  })

  const existingPkg = createPkg({
    name: 'pkg-with-conflicting-bin',
    localVersion: '1.0.0',
    bin: {
      'conflicting-bin': 'index.js',
    },
    files: {
      'index.js': { key: 'existing-bin', value: 'NODE_MODULES PKG' },
    },
  })

  const { exec: _exec, chmod, readOutput, binLinks, path } = setup(t, {
    pkg,
    testdir: merge(
      existingPkg.fixtures,
      fixtures.packages[`@npmcli-local-pkg-bin-test-1.0.0`],
      {
        node_modules: {
          '@npmcli': {
            'some-other-pkg-with-same-scope': {},
          },
        },
      }
    ),
  })

  const localBin = resolve(path, 'node_modules', '.bin')

  await chmod('local-bin-test.js')
  await chmod('conflicting-bin-test.js')
  await chmod('bin-dir/nested-bin-test.js')
  await chmod('node_modules/pkg-with-conflicting-bin/index.js')

  // Note that we have to resetSeenLinks after each exec since otherwise
  // our non-existent file will fail when it gets attempted to get chmod'ed
  // in a real world situation these would happen during different
  // processes where these is no shared cache
  const exec = async (...args) => {
    await _exec(...args)
    resetSeenLinks()
  }

  await exec({ localBin, args: ['a', 'argument-a'] })
  t.match(await readOutput('local-bin'), {
    value: 'LOCAL PKG',
    args: ['argument-a'],
  })
  t.strictSame(await fs.readdir(resolve(path, 'node_modules', '.bin')), [])

  await exec({ localBin, args: ['a-nested', 'argument-a-nested'] })
  t.strictSame(await fs.readdir(resolve(path, 'node_modules', '.bin')), [])
  t.match(await readOutput('nested-bin'), {
    value: 'LOCAL PKG',
    args: ['argument-a-nested'],
  })

  // now link a bin which will conflict with the one we try to run next
  await binLinks(existingPkg.pkg)

  t.match(await fs.readdir(resolve(path, 'node_modules', '.bin')), ['conflicting-bin'])
  await exec({ localBin, args: ['conflicting-bin'] })
  // local bin was called for conflicting-bin
  t.match(await readOutput('conflicting-bin'), {
    value: 'LOCAL PKG',
  })

  await t.rejects(() => exec({ localBin, args: ['b'] }), /command failed/)
})

t.test('locally available pkg - by scoped name only', async t => {
  const { pkg, fixtures } = createPkg({
    name: '@npmcli/npx-local-test',
    localVersion: '2.0.0',
  })

  const { exec, chmod, binLinks, readOutput } = setup(t, {
    pkg,
    testdir: fixtures,
  })

  await chmod()
  await binLinks()
  await exec({ args: ['@npmcli/npx-local-test', 'arg'] })

  t.match(await readOutput(), {
    value: 'local-2.0.0',
    args: ['arg'],
  })
})

t.test('locally available pkg - by name', async t => {
  const { pkg, fixtures } = createPkg({
    name: '@npmcli/create-index',
    localVersion: '2.0.0',
  })

  const { chmod, binLinks, exec, readOutput } = setup(t, {
    pkg,
    testdir: fixtures,
  })

  await chmod()
  await binLinks()
  await exec({
    packages: ['@npmcli/create-index'],
    call: 'create-index arg',
  })

  t.match(await readOutput(), {
    value: 'local-2.0.0',
    args: ['arg'],
  })
})

t.test('locally available pkg - by version', async t => {
  const { pkg, fixtures } = createPkg({
    name: '@npmcli/create-index',
    localVersion: '1.0.0',
  })
  const { chmod, binLinks, exec, readOutput } = setup(t, {
    pkg,
    testdir: fixtures,
  })

  await chmod()
  await binLinks()
  await exec({ args: ['@npmcli/create-index@1.0.0'] })

  t.match(await readOutput(), {
    value: 'local-1.0.0',
    args: [],
  })
})

t.test('locally available pkg - by range', async t => {
  const { pkg, fixtures } = createPkg({
    name: '@npmcli/create-index',
    localVersion: '2.0.0',
  })
  const { chmod, binLinks, exec, readOutput } = setup(t, {
    pkg,
    testdir: fixtures,
  })

  await chmod()
  await binLinks()
  await exec({
    packages: ['@npmcli/create-index@^2.0.0'],
    call: 'create-index resfile',
  })

  t.match(await readOutput(), {
    value: 'local-2.0.0',
    args: ['resfile'],
  })
})

t.test('locally available pkg - by latest tag', async t => {
  const { pkg, fixtures, package } = createPkg({
    name: '@npmcli/create-index',
    localVersion: '1.0.0',
  })
  const { chmod, binLinks, exec, readOutput, registry, path } = setup(t, {
    pkg,
    testdir: merge(fixtures, {
      node_modules: {
        '.package-lock.json': {
          name: 'lock',
          lockfileVersion: 3,
          requires: true,
          packages: {
            [`node_modules/${pkg.name}`]: {
              ...pkg,
              resolved: `{REGISTRY}/${pkg.name}/-/create-index-${pkg.version}.tgz`,
            },
          },
        },
      },
    }),
  })

  // latest forces the manifest to be fetched
  await package({ registry, path, times: 1, tarballs: [] })

  await chmod()
  await binLinks()
  await exec({
    packages: ['@npmcli/create-index@latest'],
    call: 'create-index resfile',
  })

  t.match(await readOutput(), {
    value: 'local-1.0.0',
    args: ['resfile'],
  })
})

t.test('multiple local pkgs', async t => {
  const pkgFoo = createPkg({
    name: '@npmcli/create-foo',
    localVersion: '2.0.0',
  })

  const pkgBar = createPkg({
    name: '@npmcli/create-bar',
    localVersion: '1.0.0',
  })

  const { readOutput, chmod, exec, binLinks } = setup(t, {
    pkg: [pkgFoo.pkg, pkgBar.pkg],
    testdir: merge(pkgFoo.fixtures, pkgBar.fixtures),
  })

  await chmod()
  await binLinks()

  await exec({
    packages: ['@npmcli/create-foo', '@npmcli/create-bar'],
    call: 'create-foo resfile && create-bar bar',
  })

  t.match(await readOutput('@npmcli-create-foo'), {
    value: 'local-2.0.0',
    args: ['resfile'],
  })
  t.match(await readOutput('@npmcli-create-bar'), {
    value: 'local-1.0.0',
    args: ['bar'],
  })
})

t.test('no npxCache', async t => {
  const { chmod, exec, path } = setup(t, {
    testdir: {
      npxCache: null,
      a: {
        'package.json': {
          name: 'a',
          bin: {
            a: './index.js',
          },
        },
        'index.js': { key: 'a', value: 'LOCAL PKG' },
      },
    },
  })

  await chmod('a/index.js')

  await t.rejects(() => exec({
    args: [`file:${resolve(path, 'a')}`, 'resfile'],
  }), /Must provide a valid npxCache path/)
})

t.test('local file system path', async t => {
  const { exec, chmod, readOutput, path } = setup(t, {
    mocks: {
      'ci-info': { isCI: true },
      'proc-log': {
        ...log,
        warn () {
          t.fail('should not warn about local file package install')
        },
      },
    },
    testdir: {
      a: {
        'package.json': {
          name: 'a',
          bin: {
            a: './index.js',
          },
        },
        'index.js': { key: 'a', value: 'LOCAL PKG' },
      },
    },
  })

  await chmod('a/index.js')

  await exec({
    args: [`file:${resolve(path, 'a')}`, 'resfile'],

  })

  t.match(await readOutput('a'), {
    value: 'LOCAL PKG',
    args: ['resfile'],
  })
})

t.test('global space pkg', async t => {
  const { pkg, fixtures } = createPkg({
    name: 'a',
    localVersion: '1.0.0',
  })

  const { exec, chmod, readOutput, binLinks } = setup(t, {
    pkg,
    global: true,
    testdir: fixtures,
  })

  await chmod()
  await binLinks()

  await exec({
    args: ['a', 'resfile'],
  })

  t.match(await readOutput(), {
    value: 'local-1.0.0',
    args: [],
    created: 'global/node_modules/a/bin-file.js',
  })
})

t.test('global scoped pkg', async t => {
  const { pkg, fixtures, package } = createPkg({
    localVersion: '1.0.0',
    name: '@npmcli/create-test',
  })

  const { chmod, exec, readOutput, binLinks, registry, path } = setup(t, {
    pkg,
    global: true,
    testdir: fixtures,
  })

  await chmod()
  await binLinks()

  await package({ registry, path, times: 1, tarballs: [] })

  await exec({
    args: ['@npmcli/create-test', 'resfile'],
  })

  t.match(await readOutput(), {
    value: 'local-1.0.0',
    args: ['resfile'],
    created: 'global/node_modules/@npmcli/create-test/bin-file.js',
  })
})
