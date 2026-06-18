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
