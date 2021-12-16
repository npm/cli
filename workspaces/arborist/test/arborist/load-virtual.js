const Arborist = require('../../lib/arborist')
const t = require('tap')
const { resolve } = require('path')
const fixture = resolve(__dirname, '../fixtures/install-types')
const swonlyfixture = resolve(__dirname, '../fixtures/install-types-sw-only')
const badfixture = resolve(__dirname, '../fixtures/root')
const pnpmFixture = resolve(__dirname, '../fixtures/pnpm')
const depTypesFixture = resolve(__dirname, '../fixtures/dev-deps')
const bundleFixture = resolve(__dirname, '../fixtures/two-bundled-deps')
const emptyFixture = resolve(__dirname, '../fixtures/empty-with-shrinkwrap')
const emptyFixtureNoPJ = resolve(__dirname, '../fixtures/empty-with-shrinkwrap-no-pj')
const linkedMeta = resolve(__dirname, '../fixtures/cli-750')
const oldMeta = resolve(__dirname, '../fixtures/old-package-lock')
const tapAndFlow = resolve(__dirname, '../fixtures/tap-and-flow')
const editFixture = resolve(__dirname, '../fixtures/edit-package-json')
const Shrinkwrap = require('../../lib/shrinkwrap.js')
const Node = require('../../lib/node.js')

const {
  normalizePath,
  printTree,
} = require('../fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

const loadVirtual = (path, opts) =>
  new Arborist({ path, ...(opts || {}) }).loadVirtual(opts)

t.test('load from fixture', t =>
  loadVirtual(fixture).then(virtualTree => {
    t.matchSnapshot(printTree(virtualTree), 'loaded virtual tree from fixture')
    return new Arborist({ path: fixture, virtualTree }).loadVirtual()
      .then(tree2 => t.equal(tree2, virtualTree, 'same tree reused'))
  }))

t.test('load from fixture using filesystem root path', t => {
  const root = new Node({
    path: '/',
    pkg: require(fixture + '/package.json'),
  })
  return new Arborist({ path: '/' }).loadVirtual({ root })
    .then(virtualTree => t.equal(virtualTree, root))
})

t.test('load from root that already has shrinkwrap', t =>
  Shrinkwrap.load({ path: tapAndFlow }).then(meta => {
    const root = new Node({
      path: tapAndFlow,
      pkg: require(tapAndFlow + '/package.json'),
      meta,
    })
    return new Arborist({ path: tapAndFlow }).loadVirtual({ root })
      .then(virtualTree => t.equal(virtualTree, root))
  }))

t.test('tree with link deps of link deps', t =>
  t.resolveMatchSnapshot(loadVirtual(linkedMeta).then(printTree)))

t.test('load from cwd', t => {
  const cwd = process.cwd()
  t.teardown(() => process.chdir(cwd))
  process.chdir(fixture)
  return loadVirtual().then(tree =>
    t.matchSnapshot(printTree(tree), 'loaded virtual tree from fixture'))
})

t.test('loading without a package-lock fails', t =>
  t.rejects(loadVirtual(badfixture), {
    message: 'loadVirtual requires existing shrinkwrap file',
    code: 'ENOLOCK',
  }))

t.test('load from npm-shrinkwrap.json', t => {
  const lock = require(fixture + '/package-lock.json')
  const pkg = require(fixture + '/package.json')
  const path = t.testdir({
    'npm-shrinkwrap.json': JSON.stringify(lock),
    'package.json': JSON.stringify(pkg),
  })
  return loadVirtual(path).then(tree =>
    t.matchSnapshot(printTree(tree), 'loaded virtual tree from fixture'))
})

t.test('load without a root package.json is fine', t => {
  return loadVirtual(swonlyfixture).then(tree =>
    t.matchSnapshot(printTree(tree), 'loaded virtual no package json'))
})

t.test('load a tree with some links to nodes outside of node_modules', t =>
  loadVirtual(pnpmFixture).then(tree =>
    t.matchSnapshot(printTree(tree), 'loaded virtual tree with fsParents')))

t.test('load a tree with optional and dev dependencies', t =>
  loadVirtual(depTypesFixture).then(tree =>
    t.matchSnapshot(printTree(tree), 'loaded virtual tree with dev/optional deps')))

t.test('load a tree with a bunch of bundles', t =>
  loadVirtual(bundleFixture).then(tree =>
    t.matchSnapshot(printTree(tree), 'virtual tree with multiple bundles')))

t.test('load a tree with an empty root, pj, and a lockfile', async t => {
  const tree = await loadVirtual(emptyFixture)
  t.matchSnapshot(printTree(tree), 'virtual tree with no deps')
})

t.test('load a tree with an empty root, no pj, and a lockfile', async t => {
  const tree = await loadVirtual(emptyFixtureNoPJ)
  t.matchSnapshot(printTree(tree), 'virtual tree with no deps')
})

t.test('load a tree with a v1 lockfile', t =>
  loadVirtual(oldMeta).then(tree =>
    t.matchSnapshot(printTree(tree), 'virtual tree with v1 shronk')))

t.test('load a tree where package.json edited', async t => {
  const ok = resolve(editFixture, 'ok')
  const removed = resolve(editFixture, 'removed')
  const changed = resolve(editFixture, 'changed')
  const wsChanged = resolve(editFixture, 'workspaces-changed')
  const ws = resolve(__dirname, '../fixtures/workspaces-simple-virtual')
  const kFlagsSuspect = Symbol.for('flagsSuspect')

  const okArb = new Arborist({ path: ok })
  await okArb.loadVirtual()
  t.matchSnapshot(printTree(okArb.virtualTree), 'deps match')
  t.equal(okArb[kFlagsSuspect], false, 'flags not suspect')

  const wsArb = new Arborist({ path: ws })
  await wsArb.loadVirtual()
  t.matchSnapshot(printTree(wsArb.virtualTree), 'ws match')
  t.equal(wsArb[kFlagsSuspect], false, 'flags not suspect')

  const rmArb = new Arborist({ path: removed })
  await rmArb.loadVirtual()
  t.matchSnapshot(printTree(rmArb.virtualTree), 'deps removed')
  t.equal(rmArb[kFlagsSuspect], true, 'flags suspect')

  const wsChangedArb = new Arborist({ path: wsChanged })
  await wsChangedArb.loadVirtual()
  t.matchSnapshot(printTree(wsChangedArb.virtualTree), 'ws changed')
  t.equal(wsChangedArb[kFlagsSuspect], true, 'flags suspect')

  const changeArb = new Arborist({ path: changed })
  const root = await changeArb.loadVirtual()
  t.matchSnapshot(printTree(root), 'deps changed')
  t.equal(changeArb[kFlagsSuspect], true, 'flags suspect')

  // pretend that it's a new root with fresh metadata
  root.meta.loadedFromDisk = false
  const newArb = new Arborist({ path: changed })
  await newArb.loadVirtual({ root })
  t.matchSnapshot(printTree(newArb.virtualTree),
    'changed, but re-using the same root that already has meta')
  t.equal(newArb[kFlagsSuspect], false, 'flags not suspect')
})

t.test('workspaces', t => {
  t.test('load a simple example', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-simple-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree with multiple bundles')))

  t.test('load shared dependencies example', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-shared-deps-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree with shared dependencies')))

  t.test('load conflicting dep versions example', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-conflicting-versions-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree with resolved conflicting dependencies')))

  t.test('load prefer linking nested workspaces', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-prefer-linking-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree linking to local workspaces')))

  t.test('load installed from registry on version not satisfied', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-version-unsatisfied-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree with deduped dep')))

  t.test('load linked top level nested workspaces', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-top-level-link-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree top level dep')))

  t.test('load installed workspace with transitive dependencies', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-transitive-deps-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree with transitive deps')))

  t.test('load installed tree with ignored nested node_modules folders', t =>
    loadVirtual(
      resolve(__dirname, '../fixtures/workspaces-ignore-nm-virtual')
    ).then(tree =>
      t.matchSnapshot(printTree(tree), 'virtual tree ignoring nested node_modules')))

  t.end()
})

t.test('do not reset flags on supplied root option', async t => {
  const path = resolve(__dirname, '../fixtures/test-package-with-shrinkwrap')
  const root = new Node({
    path,
    pkg: require(path + '/package.json'),
    dev: true,
    optional: false,
    peer: false,
    devOptional: true,
  })
  const tree = await loadVirtual(path, { root })
  t.equal(tree.dev, true, 'tree is still dev')
  t.equal(tree.devOptional, true, 'tree is still devOptional')
  t.equal(tree.optional, false, 'tree is not optional')
  t.equal(tree.peer, false, 'tree is not peer')
})

t.test('do not bundle the entire universe', async t => {
  const path = resolve(__dirname, '../fixtures/tap-old-lockfile')
  const tree = await loadVirtual(path)
  t.same(tree.children.get('tap').package.bundleDependencies.sort(), [
    'ink',
    'treport',
    '@types/react',
    'import-jsx',
    'minipass',
    'signal-exit',
    'tap-parser',
    'tap-yaml',
    'yaml',
  ].sort())
})
