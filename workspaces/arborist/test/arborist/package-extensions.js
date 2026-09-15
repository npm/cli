const { resolve } = require('node:path')
const t = require('tap')
const Arborist = require('../..')
const fixtures = resolve(__dirname, '../fixtures')
require(fixtures)
const MockRegistry = require('@npmcli/mock-registry')

const createRegistry = (t) => new MockRegistry({
  strict: false,
  tap: t,
  registry: 'https://registry.npmjs.org',
})

const warningTracker = (t) => {
  const warnings = []
  const onlog = (...msg) => msg[0] === 'warn' && warnings.push(msg)
  process.on('log', onlog)
  t.teardown(() => process.removeListener('log', onlog))
  return warnings
}

const cache = t.testdir()
const newArb = (path, opt = {}) => new Arborist({ timeout: 30 * 60 * 1000, path, cache, ...opt })
const buildIdeal = (path, opt) => newArb(path, opt).buildIdealTree(opt)

// foo@1.0.0 imports bar but does not declare it; bar is published separately.
// withBar is false for tests that reject before bar is ever fetched.
const mockFooBar = async (t, { fooDeps, withBar = true } = {}) => {
  const registry = createRegistry(t)
  const fooManifest = registry.manifest({
    name: 'foo',
    packuments: registry.packuments([{ version: '1.0.0', dependencies: fooDeps }], 'foo'),
  })
  await registry.package({ manifest: fooManifest })
  if (withBar) {
    const barManifest = registry.manifest({
      name: 'bar',
      packuments: registry.packuments(['1.0.0', '1.2.3', '2.0.0'], 'bar'),
    })
    await registry.package({ manifest: barManifest })
  }
}

t.test('adds a missing dependency edge', async t => {
  await mockFooBar(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { foo: '1.0.0' },
      packageExtensions: { 'foo@1': { dependencies: { bar: '^1.0.0' } } },
    }),
  })
  const tree = await buildIdeal(path)
  const foo = tree.edgesOut.get('foo').to
  const barEdge = foo.edgesOut.get('bar')
  t.ok(barEdge, 'foo has a bar edge created by the extension')
  t.equal(barEdge.valid, true, 'bar edge is valid')
  t.equal(barEdge.to.version, '1.2.3', 'resolved to the highest 1.x')
  t.strictSame(foo.packageExtensionsApplied, { selector: 'foo@1', dependencies: ['bar'] },
    'provenance attached to the extended node')
  t.strictSame(barEdge.explain().packageExtensions, { selector: 'foo@1', field: 'dependencies' },
    'edge explanation records the extension provenance')
})

t.test('edge explanation omits provenance for non-extension edges', async t => {
  // foo declares baz itself; the extension only adds bar
  const registry = createRegistry(t)
  const fooManifest = registry.manifest({
    name: 'foo',
    packuments: registry.packuments([{ version: '1.0.0', dependencies: { baz: '1.0.0' } }], 'foo'),
  })
  const barManifest = registry.manifest({ name: 'bar', packuments: registry.packuments(['1.2.3'], 'bar') })
  const bazManifest = registry.manifest({ name: 'baz', packuments: registry.packuments(['1.0.0'], 'baz') })
  await registry.package({ manifest: fooManifest })
  await registry.package({ manifest: barManifest })
  await registry.package({ manifest: bazManifest })

  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { foo: '1.0.0' },
      packageExtensions: { 'foo@1': { dependencies: { bar: '^1.0.0' } } },
    }),
  })
  const tree = await buildIdeal(path)
  const foo = tree.edgesOut.get('foo').to
  t.ok(foo.edgesOut.get('bar').explain().packageExtensions, 'extension-created edge has provenance')
  t.equal(foo.edgesOut.get('baz').explain().packageExtensions, undefined,
    'a self-declared edge from the same node has no provenance')
})

t.test('composes with overrides', async t => {
  await mockFooBar(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { foo: '1.0.0' },
      packageExtensions: { 'foo@1': { dependencies: { bar: '^1.0.0' } } },
      overrides: { bar: '1.0.0' },
    }),
  })
  const tree = await buildIdeal(path)
  const foo = tree.edgesOut.get('foo').to
  t.equal(foo.edgesOut.get('bar').to.version, '1.0.0', 'override forces the extension-created edge')
})

t.test('name-only selector matches every version', async t => {
  await mockFooBar(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { foo: '1.0.0' },
      packageExtensions: { foo: { dependencies: { bar: '^1.0.0' } } },
    }),
  })
  const tree = await buildIdeal(path)
  t.ok(tree.edgesOut.get('foo').to.edgesOut.get('bar'), 'name-only selector applied')
})

t.test('conflicting selectors fail the install', async t => {
  await mockFooBar(t, { withBar: false })
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { foo: '1.0.0' },
      packageExtensions: {
        foo: { dependencies: { bar: '^1.0.0' } },
        'foo@1': { dependencies: { bar: '^2.0.0' } },
      },
    }),
  })
  await t.rejects(buildIdeal(path), { code: 'EEXTENSIONCONFLICT' }, 'two matching selectors reject')
})

t.test('invalid selector is rejected at load', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      packageExtensions: { 'foo@latest': { dependencies: { bar: '^1.0.0' } } },
    }),
  })
  await t.rejects(buildIdeal(path), { code: 'EEXTENSIONSELECTOR' }, 'dist-tag selector rejected')
})

t.test('rejects replacing an existing dependency', async t => {
  await mockFooBar(t, { fooDeps: { bar: '1.0.0' }, withBar: false })
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { foo: '1.0.0' },
      packageExtensions: { 'foo@1': { dependencies: { bar: '^2.0.0' } } },
    }),
  })
  await t.rejects(buildIdeal(path), { code: 'EEXTENSIONDUPDEP' }, 'cannot replace existing dependency')
})

t.test('does not extend workspace members but warns', async t => {
  const warnings = warningTracker(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      workspaces: ['packages/*'],
      packageExtensions: { ws: { dependencies: { bar: '^1.0.0' } } },
    }),
    packages: {
      ws: {
        'package.json': JSON.stringify({
          name: 'ws',
          version: '1.0.0',
          // a non-root workspace declaring packageExtensions is ignored with a warning
          packageExtensions: { other: { dependencies: { x: '^1' } } },
        }),
      },
      // a second workspace that neither declares packageExtensions nor matches a selector
      'other-ws': { 'package.json': JSON.stringify({ name: 'other-ws', version: '1.0.0' }) },
    },
  })
  createRegistry(t)
  const tree = await buildIdeal(path)
  const ws = [...tree.inventory.values()].find(n => n.name === 'ws')
  t.notOk(ws.edgesOut.get('bar'), 'workspace member is not extended')
  // a workspace appears in the inventory as both a Link and its target node, so the warning must be deduped to fire once
  t.equal(warnings.filter(w => /workspace package ws/.test(w[2])).length, 1,
    'warns exactly once about the workspace selector match')
  t.equal(warnings.filter(w => /in workspace ws is ignored/.test(w[2])).length, 1,
    'warns exactly once about non-root workspace packageExtensions')
})

t.test('ignores packageExtensions from an installed dependency', async t => {
  const registry = createRegistry(t)
  const fooManifest = registry.manifest({
    name: 'foo',
    packuments: registry.packuments([{
      version: '1.0.0',
      // a published package trying to extend itself must have no effect
      packageExtensions: { foo: { dependencies: { bar: '^1.0.0' } } },
    }], 'foo'),
  })
  await registry.package({ manifest: fooManifest })
  const path = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' } }),
  })
  const tree = await buildIdeal(path)
  t.notOk(tree.edgesOut.get('foo').to.edgesOut.get('bar'),
    'dependency-level packageExtensions is ignored')
})

t.test('records the canonical hash on the lockfile meta', async t => {
  await mockFooBar(t)
  const { canonicalHash } = require('../../lib/package-extensions.js')
  const packageExtensions = { 'foo@1': { dependencies: { bar: '^1.0.0' } } }
  const path = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' }, packageExtensions }),
  })
  const tree = await buildIdeal(path)
  t.equal(tree.meta.packageExtensionsHash, canonicalHash(packageExtensions), 'hash stashed on meta')
})

const optionalPeer = { peerDependencies: { x: '*' }, peerDependenciesMeta: { x: { optional: true } } }

// Serve packuments for any number of fetches; each must still be fetched at least once.
const mockPackuments = (t, packuments) => {
  const registry = createRegistry(t)
  for (const [name, versions] of Object.entries(packuments)) {
    registry.nock = registry.nock.get(`/${name}`).reply(200, registry.manifest({ name, packuments: versions })).persist()
  }
  return registry
}

// A lockfile written without packageExtensions, so its hash differs from the current rules.
const lockedProject = (t, { dependencies, packages, packageExtensions = { foo: optionalPeer } }) => t.testdir({
  'package.json': JSON.stringify({ name: 'root', dependencies, packageExtensions }),
  'package-lock.json': JSON.stringify({
    name: 'root',
    lockfileVersion: 3,
    requires: true,
    packages: { '': { name: 'root', dependencies }, ...packages },
  }),
})

const locked = (version, { name = 'foo', ...extra } = {}) =>
  ({ version, resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, ...extra })
const fooVersions = ['1.0.0', '1.0.1', '1.1.0', '1.2.0']
const versionAt = (tree, location) => tree.inventory.get(location)?.version

t.test('keeps locked versions when the extension rules change', async t => {
  mockPackuments(t, { foo: fooVersions })
  const path = lockedProject(t, {
    dependencies: { foo: '^1.0.0', aliased: 'npm:foo@^1.0.0', qux: '1.0.0' },
    packages: {
      'node_modules/foo': locked('1.1.0'),
      'node_modules/aliased': { ...locked('1.0.0'), name: 'foo' },
      'node_modules/qux': locked('1.0.0', { name: 'qux', dependencies: { foo: '~1.0.0' } }),
      'node_modules/qux/node_modules/foo': locked('1.0.0'),
    },
  })
  const tree = await buildIdeal(path, { cache: resolve(path, 'cache') })
  t.equal(versionAt(tree, 'node_modules/foo'), '1.1.0', 'root dep keeps the newest locked version it accepts')
  t.ok(tree.inventory.get('node_modules/foo').packageExtensionsApplied, 'the kept node is extended')
  t.equal(versionAt(tree, 'node_modules/aliased'), '1.0.0', 'alias keeps its locked version')
  t.equal(tree.inventory.get('node_modules/aliased').packageName, 'foo', 'alias still targets foo')
  t.equal(versionAt(tree, 'node_modules/qux/node_modules/foo'), '1.0.0', 'nested dep keeps its locked version')
})

t.test('only reuses locked registry versions', async t => {
  mockPackuments(t, { foo: fooVersions })
  const dependencies = { foo: '^1.0.0', qux: '1.0.0', quux: '1.0.0' }
  const path = lockedProject(t, {
    dependencies,
    packages: {
      'node_modules/foo': locked('1.0.0'),
      'node_modules/qux': locked('1.0.0', { name: 'qux', dependencies: { foo: 'file:../../local-foo' } }),
      'node_modules/qux/node_modules/foo': { resolved: 'local-foo', link: true },
      'local-foo': { name: 'foo', version: '1.2.0' },
      'node_modules/quux': locked('1.0.0', { name: 'quux', bundleDependencies: ['foo'], dependencies: { foo: '^1.0.0' } }),
      'node_modules/quux/node_modules/foo': { version: '1.1.0', inBundle: true },
    },
  })
  const tree = await buildIdeal(path, { cache: resolve(path, 'cache') })
  t.equal(versionAt(tree, 'node_modules/foo'), '1.0.0', 'linked and bundled versions are not fetched from the registry')
})

t.test('re-resolves a locked alias to another package', async t => {
  mockPackuments(t, { foo: fooVersions })
  const path = lockedProject(t, {
    dependencies: { foo: '^1.0.0' },
    packageExtensions: { bar: optionalPeer },
    packages: { 'node_modules/foo': { ...locked('1.0.0', { name: 'bar' }), name: 'bar' } },
  })
  const tree = await buildIdeal(path, { cache: resolve(path, 'cache') })
  const foo = tree.inventory.get('node_modules/foo')
  t.equal(foo.packageName, 'foo', 'the locked alias is not reused')
  t.equal(foo.version, '1.2.0', 'resolved from the edge spec')
})

t.test('falls back to the edge spec when the locked version cannot be fetched', async t => {
  mockPackuments(t, { foo: ['1.1.0'] })
  const path = lockedProject(t, {
    dependencies: { foo: '^1.0.0' },
    packages: { 'node_modules/foo': locked('1.0.0') },
  })
  const tree = await buildIdeal(path, { cache: resolve(path, 'cache') })
  t.equal(versionAt(tree, 'node_modules/foo'), '1.1.0', 'resolved from the edge spec')
})

t.test('surfaces a locked version fetch failure other than an unavailable version', async t => {
  const registry = createRegistry(t)
  registry.nock = registry.nock.get('/foo').reply(500)
  mockPackuments(t, { foo: fooVersions })
  const path = lockedProject(t, {
    dependencies: { foo: '^1.0.0' },
    packages: { 'node_modules/foo': locked('1.0.0') },
  })
  await t.rejects(buildIdeal(path, { cache: resolve(path, 'cache'), fetchRetries: 0 }), { statusCode: 500 },
    'the failure is not replaced by a newer version')
})

t.test('keeps locked versions under a file link inside a detached package', async t => {
  mockPackuments(t, {
    foo: fooVersions,
    qux: [{ version: '1.0.0', dependencies: { sub: 'file:./sub' } }],
  })
  const dependencies = { qux: '1.0.0' }
  const path = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies, packageExtensions: { qux: optionalPeer } }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', dependencies },
        'node_modules/qux': locked('1.0.0', { name: 'qux', dependencies: { sub: 'file:./sub' } }),
        'node_modules/qux/node_modules/sub': { resolved: 'node_modules/qux/sub', link: true },
        'node_modules/qux/sub': { name: 'sub', version: '1.0.0', dependencies: { foo: '^1.0.0' } },
        'node_modules/qux/sub/node_modules/foo': locked('1.0.0'),
      },
    }),
    node_modules: { qux: { sub: { 'package.json': JSON.stringify({ name: 'sub', version: '1.0.0', dependencies: { foo: '^1.0.0' } }) } } },
  })
  const tree = await buildIdeal(path, { cache: resolve(path, 'cache') })
  const foo = [...tree.inventory.values()].find(n => n.name === 'foo')
  t.equal(foo?.version, '1.0.0', 'the link target dependency keeps its locked version')
})

const upgradeRequests = {
  'npm update': { update: ['foo'] },
  'an explicit install': { add: ['foo@^1.0.0'] },
}
for (const [label, opt] of Object.entries(upgradeRequests)) {
  t.test(`${label} still upgrades a locked version`, async t => {
    mockPackuments(t, { foo: fooVersions })
    const path = lockedProject(t, {
      dependencies: { foo: '^1.0.0' },
      packages: { 'node_modules/foo': locked('1.0.0') },
    })
    const tree = await buildIdeal(path, { cache: resolve(path, 'cache'), ...opt })
    t.equal(versionAt(tree, 'node_modules/foo'), '1.2.0', 'resolved from the edge spec')
  })
}

t.test('does not keep a vulnerable locked version', async t => {
  mockPackuments(t, { foo: fooVersions })
  const path = lockedProject(t, {
    dependencies: { foo: '^1.0.0' },
    packages: { 'node_modules/foo': locked('1.0.0') },
  })
  const arb = newArb(path, { cache: resolve(path, 'cache') })
  arb.auditReport = { size: 0, get: () => null, isVulnerable: node => node.version === '1.0.0' }
  const tree = await arb.buildIdealTree()
  t.equal(versionAt(tree, 'node_modules/foo'), '1.2.0', 'resolved from the edge spec')
})
