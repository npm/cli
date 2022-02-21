const t = require('tap')
const getWorkspaceNodes = require('../lib/get-workspace-nodes.js')
const Arborist = require('../lib/arborist/index.js')
const { resolve } = require('path')
const path = resolve(__dirname, './fixtures/workspaces-shared-deps-virtual')

const warningTracker = () => {
  const list = []
  const onlog = (...msg) => msg[0] === 'warn' && list.push(msg)
  process.on('log', onlog)
  return () => {
    process.removeListener('log', onlog)
    return list
  }
}

let tree
t.before(async () => {
  tree = await new Arborist({ path }).loadVirtual()
})

t.test('basic behavior', t => {
  const getLogs = warningTracker()
  const wsNodes = getWorkspaceNodes(tree, ['a'])
  t.equal(wsNodes.length, 1)
  t.equal(wsNodes[0], tree.children.get('a').target)
  t.same(getLogs(), [])
  t.end()
})

t.test('filter set, but no workspaces present', t => {
  const getLogs = warningTracker()
  const wsNodes = getWorkspaceNodes(tree.children.get('b').target, ['xyz'])
  t.same(wsNodes, [])
  t.same(getLogs(), [
    ['warn', 'workspaces', 'filter set, but no workspaces present'],
  ])
  t.end()
})

t.test('name in filter set, but not in workspaces', t => {
  const getLogs = warningTracker()
  const wsNodes = getWorkspaceNodes(tree, ['xyz'])
  t.same(wsNodes, [])
  t.same(getLogs(), [
    ['warn', 'workspaces', 'xyz in filter set, but not in workspaces'],
  ])
  t.end()
})

t.test('name in filter set, but no workspace folder present', t => {
  const getLogs = warningTracker()
  // damage the tree somehow.  Note that the getWorkspaces() function
  // that returns the map already *should* prevent this from happening,
  // but if we start moving things around and make a mistake, it's
  // possible to get there.
  tree.children.get('c').target.root = null
  const wsNodes = getWorkspaceNodes(tree, ['c'])
  t.same(wsNodes, [])
  t.same(getLogs(), [
    ['warn', 'workspaces', 'c in filter set, but no workspace folder present'],
  ])
  t.end()
})
