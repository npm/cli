const t = require('tap')
const Arborist = require('../../lib/arborist/index.js')

const { start, stop, registry } = require('../fixtures/server.js')
t.before(start)
t.teardown(stop)

const {
  normalizePath,
  printTree,
} = require('../fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')
  .split(registry).join('https://registry.npmjs.org/')

const fixture = (t, p) => require('../fixtures/reify-cases/' + p)(t)

const cache = t.testdir()
const dedupeTree = (path, opt) =>
  new Arborist({ registry, path, cache, save: false, ...(opt || {}) }).dedupe(opt)

t.test('dedupes with actual tree', async t => {
  const path = fixture(t, 'dedupe-actual')
  const tree = await dedupeTree(path)
  const dep = tree.children.get('@isaacs/dedupe-tests-a')
    .edgesOut.get('@isaacs/dedupe-tests-b').to
  const child = tree.children.get('@isaacs/dedupe-tests-b')
  t.equal(dep, child, 'dep was deduped to child of root node')
  t.matchSnapshot(printTree(tree))
})

t.test('dedupes with lockfile', async t => {
  const path = fixture(t, 'dedupe-lockfile')
  const tree = await dedupeTree(path)
  const dep = tree.children.get('@isaacs/dedupe-tests-a')
    .edgesOut.get('@isaacs/dedupe-tests-b').to
  const child = tree.children.get('@isaacs/dedupe-tests-b')
  t.equal(dep, child, 'dep was deduped to child of root node')
  t.matchSnapshot(printTree(tree))
})
