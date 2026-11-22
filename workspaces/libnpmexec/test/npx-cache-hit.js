const { resolve } = require('node:path')
const crypto = require('node:crypto')
const fs = require('node:fs/promises')
const t = require('tap')
const linkBins = require('bin-links')
const PackageJson = require('@npmcli/package-json')
const { setup, createPkg } = require('./fixtures/setup.js')

t.test('exact version already in the npx cache', async t => {
  const Arborist = require('@npmcli/arborist')
  let arborists = 0
  const { pkg, fixtures, package: mockPackage } = createPkg({
    versions: ['1.0.0', '2.0.0'],
  })
  const { exec, path, registry, readOutput, rmOutput } = setup(t, {
    pkg,
    testdir: fixtures,
    mocks: {
      '@npmcli/arborist': class extends Arborist {
        constructor (...args) {
          arborists++
          super(...args)
        }
      },
    },
  })
  const run = async (opts) => {
    arborists = 0
    await exec(opts)
    const output = await readOutput()
    await rmOutput()
    return output
  }

  await mockPackage({ registry, path, tarballs: ['1.0.0'] })
  t.match(await run({ args: ['@npmcli/create-index@1.0.0'] }), { value: 'packages-1.0.0' })

  await t.test('runs without the registry or Arborist', async t => {
    t.match(await run({ args: ['@npmcli/create-index@1.0.0', 'an argument'] }), {
      value: 'packages-1.0.0',
      args: ['an argument'],
    })
    t.equal(arborists, 0, 'does not load any tree')
  })

  await t.test('with --package', async t => {
    t.match(await run({
      packages: ['@npmcli/create-index@1.0.0'],
      args: ['create-index', 'an argument'],
    }), { value: 'packages-1.0.0', args: ['an argument'] })
    t.equal(arborists, 0, 'does not load any tree')
  })

  await t.test('--prefer-online still asks the registry', async t => {
    await mockPackage({ registry, path, tarballs: [], times: 1 })
    t.match(await run({ args: ['@npmcli/create-index@1.0.0'], preferOnline: true }), {
      value: 'packages-1.0.0',
    })
    t.ok(arborists > 0, 'loads the trees')
  })

  await t.test('a release age cutoff still asks the registry', async t => {
    await mockPackage({ registry, path, tarballs: [], times: 1 })
    t.match(await run({
      args: ['@npmcli/create-index@1.0.0'],
      before: new Date(Date.now() + 60_000),
    }), { value: 'packages-1.0.0' })
  })

  await t.test('a version that is not in the cache is installed', async t => {
    await mockPackage({ registry, path, tarballs: ['2.0.0'] })
    t.match(await run({ args: ['@npmcli/create-index@2.0.0'] }), { value: 'packages-2.0.0' })
  })

  for (const spec of ['^1.0.0', 'latest']) {
    await t.test(`@${spec} still asks the registry`, async t => {
      await mockPackage({ registry, path, tarballs: [spec === 'latest' ? '2.0.0' : '1.0.0'] })
      await run({ args: [`@npmcli/create-index@${spec}`] })
      // the second run has the same spec in the npx cache. A range is
      // checked for a newer version, which reifies the npx tree again.
      await mockPackage({ registry, path, tarballs: [], times: spec === 'latest' ? 1 : 2 })
      t.match(await run({ args: [`@npmcli/create-index@${spec}`] }), {
        value: spec === 'latest' ? 'packages-2.0.0' : 'packages-1.0.0',
      })
      t.ok(arborists > 0, 'loads the trees')
    })
  }

  await t.test('a cache entry with another version takes the full lookup', async t => {
    const hash = crypto.createHash('sha512')
      .update('@npmcli/create-index@1.0.0')
      .digest('hex')
      .slice(0, 16)
    const installed = resolve(path, 'npxCache', hash, 'node_modules/@npmcli/create-index')
    const pkgJson = await PackageJson.load(installed)
    pkgJson.update({ version: '0.0.1' })
    await pkgJson.save()

    await mockPackage({ registry, path, tarballs: [], times: 1 })
    t.match(await run({ args: ['@npmcli/create-index@1.0.0'] }), { value: 'packages-1.0.0' })
    t.ok(arborists > 0, 'loads the trees')
  })
})

t.test('exact version in the npx cache and in the project', async t => {
  const { pkg, fixtures, package: mockPackage } = createPkg({ localVersion: '1.0.0' })
  const { chmod, binLinks, exec, path, registry, readOutput } = setup(t, {
    pkg,
    testdir: { ...fixtures, other: {} },
  })
  await chmod()
  await binLinks()

  // fill the npx cache from another project
  await mockPackage({ registry, path })
  await exec({ args: ['@npmcli/create-index@1.0.0'], path: resolve(path, 'other') })
  t.match(await readOutput(), { value: 'packages-1.0.0' })

  await exec({ args: ['@npmcli/create-index@1.0.0'] })
  t.match(await readOutput(), { value: 'local-1.0.0' }, 'runs the copy in the project')
})

t.test('exact version in the npx cache and in a workspace', async t => {
  const { pkg, fixtures, package: mockPackage } = createPkg({ versions: ['1.0.0'] })
  const { exec, path, registry, readOutput } = setup(t, {
    pkg,
    testdir: {
      ...fixtures,
      'package.json': { name: 'root', version: '1.0.0', workspaces: ['ws/app'] },
      ws: { app: { 'package.json': { name: 'app', version: '1.0.0' } } },
      other: {},
    },
  })
  // a workspace with the requested version and its optional peer, as
  // `npm install --install-strategy=nested -w app` leaves them
  const ws = resolve(path, 'ws/app')
  const installed = resolve(ws, 'node_modules/@npmcli/create-index')
  await fs.mkdir(installed, { recursive: true })
  await fs.writeFile(resolve(installed, 'package.json'), JSON.stringify({
    ...pkg,
    peerDependencies: { peer: '*' },
    peerDependenciesMeta: { peer: { optional: true } },
  }))
  await fs.writeFile(resolve(installed, 'bin-file.js'), `#!/usr/bin/env node
let peer = null
try { peer = require('peer') } catch {}
require('fs').writeFileSync('output-@npmcli-create-index',
  JSON.stringify({ value: 'workspace-1.0.0', created: __filename, peer }))
`)
  await fs.chmod(resolve(installed, 'bin-file.js'), 0o775)
  await fs.mkdir(resolve(ws, 'node_modules/peer'))
  await fs.writeFile(resolve(ws, 'node_modules/peer/package.json'),
    JSON.stringify({ name: 'peer', version: '1.0.0' }))
  await fs.writeFile(resolve(ws, 'node_modules/peer/index.js'), `module.exports = 'peer-1.0.0'`)
  await linkBins({ pkg, path: installed })
  await fs.mkdir(resolve(path, 'node_modules'))
  await fs.symlink(ws, resolve(path, 'node_modules/app'), 'junction')

  // fill the npx cache from another project
  await mockPackage({ registry, path })
  await exec({ args: ['@npmcli/create-index@1.0.0'], path: resolve(path, 'other') })
  t.match(await readOutput(), { value: 'packages-1.0.0' })

  // what `npm exec -w app` passes, also when it runs inside the workspace
  const inWorkspace = { runPath: ws, localBin: resolve(ws, 'node_modules/.bin'), pkgPath: ws }
  for (const [form, opts] of [
    ['-- @npmcli/create-index@1.0.0', { args: ['@npmcli/create-index@1.0.0'] }],
    ['--package', { packages: ['@npmcli/create-index@1.0.0'], args: ['create-index'] }],
  ]) {
    await exec({ ...inWorkspace, ...opts })
    t.strictSame(await readOutput(undefined, { root: ws }), {
      value: 'workspace-1.0.0',
      created: resolve(installed, 'bin-file.js'),
      peer: 'peer-1.0.0',
    }, `runs the workspace copy with its peer: ${form}`)
  }
})

t.test('exact version in the npx cache and in the global prefix', async t => {
  const { pkg, fixtures, package: mockPackage } = createPkg({ localVersion: '1.0.0' })
  const { chmod, binLinks, exec, path, registry, readOutput } = setup(t, {
    pkg,
    global: true,
    testdir: fixtures,
  })
  await chmod()
  await binLinks()

  // --package does not look in the global prefix, so this fills the npx cache
  await mockPackage({ registry, path })
  await exec({ packages: ['@npmcli/create-index@1.0.0'], args: ['create-index'] })
  t.match(await readOutput(), { value: 'packages-1.0.0' })

  await mockPackage({ registry, path, tarballs: [], times: 1 })
  await exec({ args: ['@npmcli/create-index@1.0.0'] })
  t.match(await readOutput(), {
    value: 'local-1.0.0',
    created: 'global/node_modules/@npmcli/create-index/bin-file.js',
  }, 'runs the global copy')
})
