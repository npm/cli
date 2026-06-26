const { join, resolve } = require('node:path')
const fs = require('node:fs')
const t = require('tap')
const Arborist = require('../..')
const fixtures = resolve(__dirname, '../fixtures')
require(fixtures)
const MockRegistry = require('@npmcli/mock-registry')
const { canonicalHash } = require('../../lib/package-extensions.js')

const createRegistry = (t) => new MockRegistry({
  strict: false,
  tap: t,
  registry: 'https://registry.npmjs.org',
})

// Serve foo@1.0.0 and bar@1.2.3 as installable tarballs; bar is optional so a reify that does not need it leaves no unconsumed mock.
const register = async (t, dir, { withBar = true } = {}) => {
  const registry = createRegistry(t)
  const fooManifest = registry.manifest({ name: 'foo', packuments: [{ version: '1.0.0' }] })
  await registry.package({ manifest: fooManifest, tarballs: { '1.0.0': join(dir, 'src/foo') } })
  if (withBar) {
    const barManifest = registry.manifest({ name: 'bar', packuments: [{ version: '1.2.3' }] })
    await registry.package({ manifest: barManifest, tarballs: { '1.2.3': join(dir, 'src/bar') } })
  }
}

// foo@1.0.0 does not declare bar; both are served as installable tarballs from source dirs.
const setup = async (t, { packageExtensions, dependencies = { foo: '1.0.0' }, overrides }) => {
  const dir = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies, packageExtensions, overrides }),
    src: {
      foo: { 'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }) },
      bar: { 'package.json': JSON.stringify({ name: 'bar', version: '1.2.3' }) },
    },
  })
  await register(t, dir)
  return dir
}

const newArb = (dir, opt = {}) => new Arborist({
  path: dir,
  cache: join(dir, 'cache'),
  registry: 'https://registry.npmjs.org',
  audit: false,
  timeout: 30 * 60 * 1000,
  ...opt,
})

const readLock = dir => JSON.parse(fs.readFileSync(join(dir, 'package-lock.json'), 'utf8'))

const ext = { 'foo@1': { dependencies: { bar: '^1.0.0' } } }

for (const installStrategy of ['hoisted', 'nested', 'shallow', 'linked']) {
  t.test(`installs the extension-created edge under install-strategy=${installStrategy}`, async t => {
    const dir = await setup(t, { packageExtensions: ext })
    const tree = await newArb(dir, { installStrategy }).reify()
    const foo = [...tree.inventory.values()].find(n => n.name === 'foo')
    const barEdge = foo.edgesOut.get('bar')
    t.ok(barEdge && barEdge.valid && barEdge.to, `bar edge resolved under ${installStrategy}`)
    t.equal(barEdge.to.version, '1.2.3', 'bar resolved to a real installed node')
  })
}

t.test('lockfile records hash, provenance, effective deps, and version 4', async t => {
  const dir = await setup(t, { packageExtensions: ext })
  await newArb(dir).reify()
  const lock = readLock(dir)
  t.equal(lock.lockfileVersion, 4, 'bumped to lockfileVersion 4')
  t.equal(lock.packages[''].packageExtensionsHash, canonicalHash(ext), 'root entry carries the canonical hash')
  const fooEntry = lock.packages['node_modules/foo']
  t.strictSame(fooEntry.packageExtensionsApplied, { selector: 'foo@1', dependencies: ['bar'] },
    'foo entry carries minimal provenance')
  t.strictSame(fooEntry.dependencies, { bar: '^1.0.0' }, 'foo entry carries the effective dependency metadata')
})

t.test('does not rewrite the installed dependency package.json', async t => {
  const dir = await setup(t, { packageExtensions: ext })
  await newArb(dir).reify()
  const installed = JSON.parse(fs.readFileSync(join(dir, 'node_modules/foo/package.json'), 'utf8'))
  t.notOk(installed.dependencies, 'the on-disk foo/package.json is not given a bar dependency')
})

t.test('composes with overrides during reify', async t => {
  const dir = await setup(t, { packageExtensions: ext, overrides: { bar: '1.2.3' } })
  const tree = await newArb(dir).reify()
  const bar = [...tree.inventory.values()].find(n => n.name === 'bar')
  t.equal(bar.version, '1.2.3', 'override applied to the extension-created edge')
})

t.test('provenance round-trips through the lockfile (npm ci style)', async t => {
  const dir = await setup(t, { packageExtensions: ext })
  await newArb(dir).reify()
  // a fresh build loaded from the lockfile retains the provenance and hash
  const virtual = await newArb(dir).loadVirtual()
  const foo = [...virtual.inventory.values()].find(n => n.name === 'foo')
  t.strictSame(foo.packageExtensionsApplied, { selector: 'foo@1', dependencies: ['bar'] },
    'provenance restored from the lockfile')
  t.equal(virtual.meta.packageExtensionsHash, canonicalHash(ext), 'hash restored from the lockfile')
})

t.test('refuses a lockfile newer than the supported version', async t => {
  const dir = await setup(t, { packageExtensions: ext })
  await newArb(dir).reify()
  const lock = readLock(dir)
  lock.lockfileVersion = 5
  fs.writeFileSync(join(dir, 'package-lock.json'), JSON.stringify(lock))
  await t.rejects(newArb(dir).loadVirtual(), { code: 'ELOCKFILEVERSION' }, 'too-new lockfile is rejected')
})

t.test('removing an extension on reinstall reverts the locked graph', async t => {
  const dir = await setup(t, { packageExtensions: ext })
  await newArb(dir).reify()
  t.ok(readLock(dir).packages['node_modules/bar'], 'bar installed by the extension')

  // remove the extension and reinstall; the stale extended manifest must not persist
  fs.writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' } }))
  await register(t, dir, { withBar: false })
  await newArb(dir).reify()
  const lock = readLock(dir)
  t.notOk(lock.packages['node_modules/bar'], 'bar removed once the extension is gone')
  t.notOk(lock.packages[''].packageExtensionsHash, 'root hash cleared')
  t.notOk(lock.packages['node_modules/foo'].packageExtensionsApplied, 'foo provenance cleared')
})

t.test('adding an extension to an existing lockfile applies it on reinstall', async t => {
  // first install with no extension, so the lockfile has foo but no bar
  const dir = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' } }),
    src: {
      foo: { 'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }) },
      bar: { 'package.json': JSON.stringify({ name: 'bar', version: '1.2.3' }) },
    },
  })
  await register(t, dir, { withBar: false })
  await newArb(dir).reify()
  t.notOk(readLock(dir).packages['node_modules/bar'], 'no bar before the extension is added')

  // add the extension and reinstall; the stale foo node must be rebuilt and gain the bar edge
  fs.writeFileSync(join(dir, 'package.json'),
    JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' }, packageExtensions: ext }))
  await register(t, dir)
  await newArb(dir).reify()
  const lock = readLock(dir)
  t.ok(lock.packages['node_modules/bar'], 'bar added after the extension is introduced')
  t.strictSame(lock.packages['node_modules/foo'].packageExtensionsApplied,
    { selector: 'foo@1', dependencies: ['bar'] }, 'provenance recorded for the newly extended node')
})

t.test('changing an extension range on reinstall re-resolves the edge', async t => {
  const dir = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' }, packageExtensions: ext }),
    src: {
      foo: { 'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }) },
      bar: { 'package.json': JSON.stringify({ name: 'bar', version: '1.2.3' }) },
      bar2: { 'package.json': JSON.stringify({ name: 'bar', version: '2.0.0' }) },
    },
  })
  const registerBoth = async () => {
    const registry = createRegistry(t)
    const fooManifest = registry.manifest({ name: 'foo', packuments: [{ version: '1.0.0' }] })
    const barManifest = registry.manifest({ name: 'bar', packuments: [{ version: '1.2.3' }, { version: '2.0.0' }] })
    await registry.package({ manifest: fooManifest, tarballs: { '1.0.0': join(dir, 'src/foo') } })
    await registry.package({
      manifest: barManifest,
      tarballs: { '1.2.3': join(dir, 'src/bar'), '2.0.0': join(dir, 'src/bar2') },
    })
  }
  await registerBoth()
  await newArb(dir).reify()
  t.equal(readLock(dir).packages['node_modules/bar'].version, '1.2.3', 'bar resolved to 1.x')

  fs.writeFileSync(join(dir, 'package.json'),
    JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' }, packageExtensions: { 'foo@1': { dependencies: { bar: '^2.0.0' } } } }))
  await registerBoth()
  await newArb(dir).reify()
  t.equal(readLock(dir).packages['node_modules/bar'].version, '2.0.0', 'bar re-resolved to 2.x after the range change')
})
