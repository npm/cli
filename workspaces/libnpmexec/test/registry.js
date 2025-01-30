const { resolve } = require('node:path')
const t = require('tap')
const { setup, createPkg, merge } = require('./fixtures/setup.js')
const crypto = require('node:crypto')

t.test('run from registry - no local packages', async t => {
  const { fixtures, package } = createPkg({ versions: ['2.0.0'] })

  const { exec, path, registry, readOutput } = setup(t, {
    testdir: merge(fixtures, {
      global: {},
    }),
  })

  await package({ registry, path })

  await exec({
    args: ['@npmcli/create-index'],
    globalPath: resolve(path, 'global'),
  })

  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-2.0.0',
  })
})

t.test('run from registry - local version mismatch', async t => {
  const { fixtures, package } = createPkg({
    localVersion: '2.0.0',
    versions: ['2.0.0', '1.0.0'],
  })

  const { exec, path, registry, readOutput } = setup(t, {
    testdir: {
      ...fixtures,
    },
  })

  await package({ registry, path, tarballs: ['1.0.0'] })

  await exec({ args: ['@npmcli/create-index@1.0.0'] })

  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-1.0.0',
  })
})

t.test('run from registry - local range mismatch', async t => {
  const { fixtures, package } = createPkg({
    localVersion: '2.0.0',
    versions: ['2.0.0', '1.0.0'],
  })

  const { exec, path, registry, readOutput } = setup(t, {
    testdir: {
      ...fixtures,
    },
  })

  await package({ registry, path, tarballs: ['1.0.0'] })

  await exec({
    args: ['@npmcli/create-index@^1.0.0'],
  })

  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-1.0.0',
  })
})

t.test('run from registry - local tag mismatch', async t => {
  const { fixtures, package } = createPkg({
    localVersion: '2.0.0',
    versions: ['2.0.0'],
  })

  const { exec, path, registry, readOutput } = setup(t, {
    testdir: {
      ...fixtures,
    },
  })

  await package({ registry, path })

  await exec({
    args: ['@npmcli/create-index@latest'],
  })

  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-2.0.0',
  })
})

t.test('avoid install when exec from registry an available pkg', async t => {
  const { fixtures, package } = createPkg({
    versions: ['2.0.0'],
  })

  const { exec, path, registry, readOutput, rmOutput } = setup(t, {
    testdir: {
      ...fixtures,
    },
  })

  await package({ registry, path })

  // no file
  t.rejects(() => readOutput('@npmcli-create-index'), { code: 'ENOENT' })

  // file is created
  await exec({ args: ['@npmcli/create-index'] })
  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-2.0.0',
  })

  // remove file
  await rmOutput('@npmcli-create-index')
  t.rejects(() => readOutput('@npmcli-create-index'), { code: 'ENOENT' })

  // create file again but mock manifest only once
  await package({ registry, path, tarballs: [], times: 1 })
  await exec({ args: ['@npmcli/create-index'] })
  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-2.0.0',
  })
})

t.test('run multiple from registry', async t => {
  const indexPkg = createPkg({
    versions: ['2.0.0'],
    name: '@npmcli/create-index',
  })
  const testPkg = createPkg({
    versions: ['2.0.0'],
    name: '@npmcli/create-test',
  })

  const { exec, path, registry, readOutput } = setup(t, {
    testdir: {
      ...merge(indexPkg.fixtures, testPkg.fixtures),
    },
  })

  await indexPkg.package({ registry, path })
  await testPkg.package({ registry, path })

  t.rejects(
    () => readOutput(resolve('@npmcli-create-index')),
    { code: 'ENOENT' }
  )
  t.rejects(
    () => readOutput(resolve('@npmcli-create-test')),
    { code: 'ENOENT' }
  )

  await exec({
    packages: ['@npmcli/create-test', '@npmcli/create-index'],
    call: 'create-test && create-index',
  })

  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-2.0.0',
  })
  t.match(await readOutput('@npmcli-create-test'), {
    value: 'packages-2.0.0',
  })
})
t.test('packages with different versions in the global tree', async t => {
  const pkgA1 = createPkg({
    localVersion: '1.0.0',
    versions: ['1.0.0', '2.0.0'],
    name: '@npmcli/A',
  })

  const pkgA2 = createPkg({
    localVersion: '2.0.0',
    name: '@npmcli/A',
    versions: ['1.0.0', '2.0.0'],
  })

  const pkgB = createPkg({
    localVersion: '1.0.0',
    name: '@npmcli/B',
  })

  const pkgBfix = merge(pkgB.fixtures, {
    node_modules: {
      '@npmcli': { B: {
        node_modules: {
          '@npmcli': {
            A: pkgA2.fixtures.packages['@npmcli-A-2.0.0'],
          } },
        'package.json': { dependencies: { '@npmcli/A': '2.0.0' } },
      },
      },
    } })

  const { chmod, exec, readOutput, binLinks, registry, path } = setup(t, {
    pkg: [pkgA2.pkg, pkgA1.pkg, pkgB.pkg],
    global: true,
    testdir: merge(pkgA1.fixtures, pkgBfix),
  })

  await chmod()
  await binLinks()

  await pkgA2.package({ registry, path, times: 2, tarballs: ['2.0.0'] })
  await pkgA1.package({ registry, path, times: 1, tarballs: [] })

  await exec({
    args: ['@npmcli/A@2.0.0'],
  })

  t.match(await readOutput('@npmcli-A'), {
    value: 'packages-2.0.0',
    args: [],
    created: 'packages/@npmcli-A-2.0.0/bin-file.js',
  })

  await exec({
    args: ['@npmcli/A@1.0.0'],
  })

  t.match(await readOutput('@npmcli-A'), {
    value: 'local-1.0.0',
    args: [],
    created: 'global/node_modules/@npmcli/A/bin-file.js',
  })
})

t.test('run from registry - non existant global path', async t => {
  const { fixtures, package } = createPkg({ versions: ['2.0.0'] })

  const { exec, path, registry, readOutput } = setup(t, {
    testdir: fixtures,
  })

  await package({ registry, path })

  await exec({
    args: ['@npmcli/create-index'],
    globalPath: resolve(path, 'non-existant'),
  })

  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-2.0.0',
  })
})

t.test('npx tree triggers manifest fetch when local version does satisfy range using real npx cache inventory', async t => {
  // The local installation is version 1.0.0, which does NOT satisfy the spec ^2.0.0.
  const pkgData = createPkg({
    localVersion: '1.0.0',
    versions: ['1.0.0', '2.0.0', '2.0.1'],
    name: '@npmcli/create-index',
  })
  const { fixtures, package: pkg } = pkgData

  const hash = crypto.createHash('sha512')
    .update('@npmcli/create-index@^2.0.0')
    .digest('hex')
    .slice(0, 16)

  const npxCacheFixture = {
    [hash]: {
      'package.json': {
        name: '@npmcli/create-index',
        version: '2.0.0',
      },
    },
  }

  const { exec: execFn, path, registry, readOutput, binLinks } = setup(t, {
    pkg: [pkg],
    testdir: {
      ...fixtures,
      npxCache: npxCacheFixture,
    },
  })

  // Set up the registry package so that a manifest fetch returns version 2.0.1.
  await pkg({
    registry,
    path,
    tarballs: ['2.0.1'],
  })
  await binLinks()

  // Execute in NPX mode with the spec ^2.0.0.
  // The local tree (version 1.0.0) does not satisfy ^2.0.0, so the system will find the cached package (version 2.0.0) in npxCache and then update from the registry to 2.0.1.
  await execFn({
    args: ['create-index'],
    packages: ['@npmcli/create-index@^2.0.0'],
  })

  t.match(await readOutput('@npmcli-create-index'), {
    value: 'packages-2.0.1',
  })
})
