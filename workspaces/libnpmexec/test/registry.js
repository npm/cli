const { resolve } = require('path')
const t = require('tap')
const { setup, createPkg, merge } = require('./fixtures/setup.js')

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
