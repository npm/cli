// Exercises resolvePatchedDependencies, which is not exported, so it must be driven through Arborist.
// We build a real ideal tree against a t.testdir fixture and assert that node.patched is set on matches and that the documented error codes throw.
const t = require('tap')
const Arborist = require('../lib/arborist')

// a trivial but valid unified diff used as the on-disk patch contents
const PATCH = '--- a/index.js\n+++ b/index.js\n@@ -1 +1 @@\n-old\n+new\n'

// build a lockfileVersion 3 entry for a registry dependency
const lockEntry = (name, version) => ({
  version,
  resolved: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`,
  integrity: 'sha512-deadbeef',
})

// build an offline ideal tree for a fixture directory, so registry deps need no network
const buildIdeal = (path, opts = {}) =>
  new Arborist({ path, offline: true, ...opts }).buildIdealTree()

t.test('attaches node.patched on an exact match', async t => {
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0' },
      patchedDependencies: { 'dep@1.0.0': 'fix.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' } },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  const tree = await buildIdeal(path)
  const dep = tree.inventory.query('name', 'dep').values().next().value
  t.ok(dep, 'dep node exists')
  t.ok(dep.patched, 'node.patched is set')
  t.equal(dep.patched.path, 'fix.patch', 'records the relative patch path')
  t.match(dep.patched.integrity, /^sha512-/, 'records the sha512 integrity')
})

t.test('no patchedDependencies is a no-op', async t => {
  // empty patchedDependencies hits the early return guard
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      patchedDependencies: {},
    }),
  })
  const tree = await buildIdeal(path)
  for (const node of tree.inventory.values()) {
    t.notOk(node.patched, `${node.name} is not patched`)
  }
})

t.test('marks patchRemoved when a lockfile-patched node loses its selector', async t => {
  // the lockfile records a patch but package.json declares none, so the node must be re-extracted
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 4,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' } },
        'node_modules/dep': {
          ...lockEntry('dep', '1.0.0'),
          patched: { path: 'patches/dep@1.0.0.patch', integrity: 'sha512-old' },
        },
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  const tree = await buildIdeal(path)
  const dep = tree.inventory.query('name', 'dep').values().next().value
  t.notOk(dep.patched, 'the stale patch record is cleared')
  t.ok(dep.patchRemoved, 'the node is marked for re-extraction')
})

t.test('shares integrity cache across selectors pointing at one file', async t => {
  // two selectors reference the same patch path, so the file is read once and both matched nodes get the identical integrity value
  const path = t.testdir({
    'shared.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { a: '^1.0.0', b: '^1.0.0' },
      patchedDependencies: { 'a@1.0.0': 'shared.patch', 'b@1.0.0': 'shared.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { a: '^1.0.0', b: '^1.0.0' } },
        'node_modules/a': lockEntry('a', '1.0.0'),
        'node_modules/b': lockEntry('b', '1.0.0'),
      },
    }),
    node_modules: {
      a: { 'package.json': JSON.stringify({ name: 'a', version: '1.0.0' }) },
      b: { 'package.json': JSON.stringify({ name: 'b', version: '1.0.0' }) },
    },
  })

  const tree = await buildIdeal(path)
  const a = tree.inventory.query('name', 'a').values().next().value
  const b = tree.inventory.query('name', 'b').values().next().value
  t.ok(a.patched && b.patched, 'both nodes are patched')
  t.equal(a.patched.integrity, b.patched.integrity, 'integrity is shared from the cache')
  t.equal(a.patched.path, 'shared.patch')
  t.equal(b.patched.path, 'shared.patch')
})

t.test('EPATCHWORKSPACE when a workspace member declares patchedDependencies', async t => {
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      workspaces: ['workspace-a'],
      // a root entry is needed so the function does not early-return
      patchedDependencies: { 'x@1.0.0': 'fix.patch' },
    }),
    'workspace-a': {
      'package.json': JSON.stringify({
        name: 'workspace-a',
        version: '1.0.0',
        patchedDependencies: { 'x@1.0.0': 'fix.patch' },
      }),
    },
  })

  await t.rejects(buildIdeal(path), { code: 'EPATCHWORKSPACE', workspace: 'workspace-a' })
})

t.test('skips a clean workspace member and patches a root dep', async t => {
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      workspaces: ['workspace-a'],
      dependencies: { dep: '^1.0.0' },
      patchedDependencies: { 'dep@1.0.0': 'fix.patch' },
    }),
    'workspace-a': {
      'package.json': JSON.stringify({ name: 'workspace-a', version: '1.0.0' }),
    },
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' }, workspaces: ['workspace-a'] },
        'workspace-a': { name: 'workspace-a', version: '1.0.0' },
        'node_modules/workspace-a': { link: true, resolved: 'workspace-a' },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
      },
    }),
    node_modules: {
      'workspace-a': t.fixture('symlink', '../workspace-a'),
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  const tree = await buildIdeal(path)
  const dep = tree.inventory.query('name', 'dep').values().next().value
  t.ok(dep.patched, 'root dep is patched even though a workspace member exists')
})

t.test('EPATCHNONREGISTRY when the matched node is not a registry dependency', async t => {
  // a file: dependency resolves to a Link/non-registry node and cannot be patched
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: 'file:./localdep' },
      patchedDependencies: { 'dep@1.0.0': 'fix.patch' },
    }),
    localdep: {
      'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }),
    },
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  await t.rejects(buildIdeal(path), { code: 'EPATCHNONREGISTRY', node: 'dep' })
})

t.test('EPATCHUNUSED when a registered patch matches no node', async t => {
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0' },
      // ghost has no installed node so it is unused
      patchedDependencies: { 'ghost@1.0.0': 'fix.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' } },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  await t.rejects(buildIdeal(path), { code: 'EPATCHUNUSED', unused: ['ghost@1.0.0'] })
})

t.test('uninstalling a patched package drops its orphaned patch entry', async t => {
  // npm uninstall removes the node but leaves the patchedDependencies entry, which would otherwise be EPATCHUNUSED
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0' },
      patchedDependencies: { 'dep@1.0.0': 'fix.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' } },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  const tree = await buildIdeal(path, { rm: ['dep'] })
  t.notOk(tree.inventory.query('name', 'dep').size, 'dep node is removed')
  t.notOk(tree.package.patchedDependencies, 'the orphaned patch entry is dropped')
})

t.test('uninstall keeps patch entries for packages that remain', async t => {
  // removing one package must not drop another package's still-used patch
  const path = t.testdir({
    'a.patch': PATCH,
    'b.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { a: '^1.0.0', b: '^1.0.0' },
      patchedDependencies: { 'a@1.0.0': 'a.patch', 'b@1.0.0': 'b.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { a: '^1.0.0', b: '^1.0.0' } },
        'node_modules/a': lockEntry('a', '1.0.0'),
        'node_modules/b': lockEntry('b', '1.0.0'),
      },
    }),
    node_modules: {
      a: { 'package.json': JSON.stringify({ name: 'a', version: '1.0.0' }) },
      b: { 'package.json': JSON.stringify({ name: 'b', version: '1.0.0' }) },
    },
  })

  const tree = await buildIdeal(path, { rm: ['a'] })
  t.notOk(tree.inventory.query('name', 'a').size, 'a node is removed')
  t.same(tree.package.patchedDependencies, { 'b@1.0.0': 'b.patch' }, 'b patch entry survives')
  const b = tree.inventory.query('name', 'b').values().next().value
  t.ok(b.patched, 'b is still patched')
})

t.test('uninstall does not drop a patch when the package survives as a transitive dep', async t => {
  // dep is a direct dep being removed but stays in the tree under parent, so its patch is still used
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0', parent: '^1.0.0' },
      patchedDependencies: { 'dep@1.0.0': 'fix.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0', parent: '^1.0.0' } },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
        'node_modules/parent': {
          ...lockEntry('parent', '1.0.0'),
          dependencies: { dep: '^1.0.0' },
        },
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
      parent: {
        'package.json': JSON.stringify({
          name: 'parent',
          version: '1.0.0',
          dependencies: { dep: '^1.0.0' },
        }),
      },
    },
  })

  const tree = await buildIdeal(path, { rm: ['dep'] })
  const dep = tree.inventory.query('name', 'dep').values().next().value
  t.ok(dep, 'dep node survives as a transitive dependency')
  t.ok(dep.patched, 'dep is still patched')
  t.same(tree.package.patchedDependencies, { 'dep@1.0.0': 'fix.patch' }, 'patch entry is kept')
})

t.test('allowUnusedPatches:true suppresses EPATCHUNUSED', async t => {
  const path = t.testdir({
    'fix.patch': PATCH,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0' },
      patchedDependencies: { 'ghost@1.0.0': 'fix.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' } },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  const tree = await buildIdeal(path, { allowUnusedPatches: true })
  for (const node of tree.inventory.values()) {
    t.notOk(node.patched, `${node.name} is not patched`)
  }
})

t.test('EPATCHNOTFOUND when the patch file is missing on disk', async t => {
  // selector matches an installed node but the referenced patch file is absent
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0' },
      patchedDependencies: { 'dep@1.0.0': 'missing.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' } },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  await t.rejects(buildIdeal(path), { code: 'EPATCHNOTFOUND', path: 'missing.patch' })
})

t.test('EPATCHUNSAFE when the patch path escapes the project', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '^1.0.0' },
      patchedDependencies: { 'dep@1.0.0': '../outside.patch' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'root', version: '1.0.0', dependencies: { dep: '^1.0.0' } },
        'node_modules/dep': lockEntry('dep', '1.0.0'),
      },
    }),
    node_modules: {
      dep: { 'package.json': JSON.stringify({ name: 'dep', version: '1.0.0' }) },
    },
  })

  await t.rejects(buildIdeal(path), { code: 'EPATCHUNSAFE' })
})
