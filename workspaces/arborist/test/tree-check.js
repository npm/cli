const t = require('tap')

// turn on debug mode, or this does nothing
const treeCheck = t.mock('../lib/tree-check.js', {
  '../lib/debug.js': fn => fn(),
})

const { resolve } = require('node:path')

const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const Edge = require('../lib/edge.js')

t.test('basic tree that is a-ok', t => {
  const tree = new Node({
    path: '/some/path',
    pkg: {},
    children: [
      { pkg: { name: 'foo', version: '1.2.3' } },
    ],
  })
  const link = new Link({
    parent: tree,
    name: 'glorb',
    target: new Node({
      fsParent: tree,
      path: '/some/path/glorb',
      pkg: { name: 'glorb', version: '1.2.3' },
    }),
  })
  link.parent = tree
  t.equal(treeCheck(tree), tree)
  t.equal(treeCheck(link), link)
  t.equal(treeCheck(link.target), link.target)
  const nonTree = {}
  t.equal(treeCheck(nonTree), nonTree)
  nonTree.root = {}
  t.equal(treeCheck(nonTree), nonTree)
  t.end()
})

t.test('break some stuff', t => {
  const tree = new Node({
    path: '/some/path',
    pkg: {},
    children: [
      { pkg: { name: 'foo', version: '1.2.3' } },
      { pkg: { name: 'disowned', version: '1.2.3' } },
    ],
  })
  new Link({
    parent: tree,
    name: 'glorb',
    target: new Node({
      fsParent: tree,
      path: '/some/path/glorb',
      pkg: { name: 'glorb', version: '1.2.3' },
    }),
  })
  const disowned = tree.children.get('disowned')
  disowned.parent = null

  // oops...
  Map.prototype.set.call(tree.inventory, 'xyz', disowned)
  t.equal(treeCheck(tree, false), tree, 'unreachable allowed')
  t.throws(() => treeCheck(tree), {
    message: 'unreachable in inventory',
    node: resolve('/some/path/node_modules/disowned'),
    realpath: resolve('/some/path/node_modules/disowned'),
    location: '',
    name: 'Error',
    log: Array,
  })

  Map.prototype.delete.call(tree.inventory, 'xyz')
  disowned.parent = tree
  tree.inventory.delete(disowned)
  t.throws(() => treeCheck(tree), {
    message: 'not in inventory',
    node: resolve('/some/path/node_modules/disowned'),
    name: 'Error',
    log: Array,
  })

  disowned.root = null
  tree.children.set('wtf', disowned)
  t.throws(() => treeCheck(tree), {
    message: 'double root',
    node: resolve('/some/path/node_modules/disowned'),
    realpath: resolve('/some/path/node_modules/disowned'),
    tree: tree.path,
    name: 'Error',
    log: Array,
  })

  const otherTree = new Node({
    name: 'other',
    parent: disowned,
  })
  tree.children.set('wtf', otherTree)
  t.throws(() => treeCheck(tree), {
    message: 'node from other root in tree',
    node: resolve('/some/path/node_modules/disowned/node_modules/other'),
    realpath: resolve('/some/path/node_modules/disowned/node_modules/other'),
    tree: tree.path,
    name: 'Error',
    log: Array,
  })

  tree.children.delete('wtf')
  Map.prototype.set.call(otherTree.inventory, 'othertree', disowned)
  t.throws(() => treeCheck(otherTree), {
    message: 'non-root has non-zero inventory',
    node: disowned.path,
    tree: otherTree.path,
    inventory: [[disowned.path, disowned.location]],
    name: 'Error',
    log: Array,
  })
  Map.prototype.delete.call(tree.inventory, 'othertree')

  t.end()
})

t.test('just return the tree if not in debug mode', t => {
  const treeCheck = t.mock('../lib/tree-check.js', {
    '../lib/debug.js': () => {},
  })
  const tree = new Node({
    path: '/some/path',
    pkg: {},
    children: [
      { pkg: { name: 'foo', version: '1.2.3' } },
      { pkg: { name: 'disowned', version: '1.2.3' } },
    ],
  })
  const disowned = tree.children.get('disowned')
  disowned.parent = null
  // oops...
  Map.prototype.set.call(tree.inventory, 'xyz', disowned)
  t.equal(treeCheck(tree), tree, 'error suppressed outside of debug mode')
  t.end()
})

t.test('tree with dev edges on a nested dep node', t => {
  const tree = new Node({
    path: '/some/path',
    pkg: {},
    children: [
      { pkg: { name: 'foo', version: '1.2.3', devDependencies: { x: '' } } },
    ],
  })
  // ensure it actually gets added
  new Edge({
    type: 'dev',
    name: 'x',
    spec: '',
    from: tree.children.get('foo'),
  })
  t.throws(() => treeCheck(tree), {
    message: 'dev edges on non-top node',
    node: tree.children.get('foo').path,
    tree: tree.path,
    root: tree.root.path,
    via: tree.path,
    viaType: 'children',
    devEdges: [['dev', 'x', '', 'MISSING']],
    log: Array,
  })
  t.end()
})

t.test('node with same path as root', t => {
  const root = new Node({
    path: '/path/to/root',
    pkg: {
      dependencies: {
        foo: '1',
      },
    },
  })
  const tree = new Node({
    parent: root,
    pkg: {
      name: 'foo',
      version: '1.2.3',
    },
  })
  const child = new Node({
    parent: tree,
    pkg: {
      name: 'not-root',
      version: '1.2.3',
    },
  })
  child.path = root.path
  t.throws(() => treeCheck(tree), {
    message: 'node with same path as root',
    node: child.path,
    tree: tree.path,
    root: root.path,
    via: tree.path,
    viaType: 'children',
    log: Array,
  })
  child.path = root.path + '/some/where/else'
  t.throws(() => treeCheck(tree), {
    message: 'non-link with mismatched path/realpath',
    node: child.path,
    tree: tree.path,
    root: root.path,
    via: tree.path,
    viaType: 'children',
    log: Array,
  })
  t.end()
})
