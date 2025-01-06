const t = require('tap')
const { join } = require('node:path')
const Arborist = require('../..')
const MockRegistry = require('@npmcli/mock-registry')

const {
  normalizePath,
  printTree,
} = require('../fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

const fixture = (t, p) => require('../fixtures/reify-cases/' + p)(t)
const cache = t.testdir()
const dedupeTree = (path, opt) =>
  new Arborist({ path, cache, save: false, ...(opt || {}) }).dedupe(opt)

const createRegistry = t => {
  const registry = new MockRegistry({
    strict: true,
    tap: t,
    registry: 'https://registry.npmjs.org',
  })
  registry.mocks({ dir: join(__dirname, '..', 'fixtures') })
  return registry
}

t.test('dedupes with actual tree', async t => {
  const registry = createRegistry(t)
  registry.audit({})
  const path = fixture(t, 'dedupe-actual')
  const tree = await dedupeTree(path)
  const dep = tree.children.get('@isaacs/dedupe-tests-a')
    .edgesOut.get('@isaacs/dedupe-tests-b').to
  const child = tree.children.get('@isaacs/dedupe-tests-b')
  t.equal(dep, child, 'dep was deduped to child of root node')
  t.matchSnapshot(printTree(tree))
})

t.test('dedupes with lockfile', async t => {
  const registry = createRegistry(t)
  registry.audit({})
  const path = fixture(t, 'dedupe-lockfile')
  const tree = await dedupeTree(path)
  const dep = tree.children.get('@isaacs/dedupe-tests-a')
    .edgesOut.get('@isaacs/dedupe-tests-b').to
  const child = tree.children.get('@isaacs/dedupe-tests-b')
  t.equal(dep, child, 'dep was deduped to child of root node')
  t.matchSnapshot(printTree(tree))
})
