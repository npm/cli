const t = require('tap')
const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const deepestNestingTarget = require('../lib/deepest-nesting-target.js')

// root -> (a, b, file:target) PEER(p)
// a -> (x) PEER(p)
// b -> PEER(p)
// target -> (a, b, file:/outer) PEER(p)
// /outer -> (a, b) PEER(p)
//
// p can be placed under the root (because project root), or any of the
// 'x' nodes (because no peer dep), or in the /outer node (no resolve parent)
// Any other place is not allowed, because of peer dependencies.

const tree = new Node({
  path: '/some/path',
  pkg: {
    name: 'root',
    dependencies: {
      a: '',
      b: '',
      link: 'file:target',
    } },
  fsChildren: [
    {
      path: '/some/path/target',
      pkg: {
        name: 'link',
        version: '1.2.3',
        peerDependencies: { p: '' },
        dependencies: {
          a: '',
          b: '',
          outerlink: 'file:/other/path',
        },
      },
      children: [
        {
          pkg: {
            name: 'a',
            version: '1.2.3',
            dependencies: { x: '' },
            peerDependencies: { p: '' },
          },
          children: [{ pkg: { name: 'x', version: '1.2.3' } }],
        },
        { pkg: { name: 'b', version: '1.2.3', peerDependencies: { p: '' } } },
      ],
    },
  ],
  children: [
    {
      pkg: {
        name: 'a',
        version: '1.2.3',
        dependencies: { x: '' },
        peerDependencies: { p: '' },
      },
      children: [{ pkg: { name: 'x', version: '1.2.3' } }],
    },
    { pkg: { name: 'b', version: '1.2.3', peerDependencies: { p: '' } } },
  ],
})

const a = tree.children.get('a')
const x = a.children.get('x')
const b = tree.children.get('b')

const inner = tree.inventory.get('target')
const innerLink = new Link({
  parent: tree,
  name: 'link',
  target: inner,
})
t.equal(inner, innerLink.target, 'gut check')
t.equal(innerLink, tree.children.get('link'), 'gut check')
const innerA = inner.children.get('a')
const innerX = innerA.children.get('x')
const innerB = inner.children.get('b')

// the target of the outer link dep. it can hold p, but b cannot
const outer = new Node({
  path: '/other/path',
  pkg: {
    name: 'other',
    version: '1.2.3',
    peerDependencies: { p: '' },
    dependencies: { a: '', b: '' },
  },
  children: [
    {
      pkg: {
        name: 'a',
        version: '1.2.3',
        dependencies: { x: '' },
        peerDependencies: { p: '' },
      },
      children: [{ pkg: { name: 'x', version: '1.2.3' } }],
    },
    { pkg: { name: 'b', version: '1.2.3', peerDependencies: { p: '' } } },
  ],
})
const outerA = outer.children.get('a')
const outerX = outerA.children.get('x')
const outerB = outer.children.get('b')

const outerLink = new Link({
  parent: inner,
  name: 'outerlink',
  target: outer,
})
t.equal(outer, tree.inventory.get('../../other/path'), 'gut check')
t.equal(outer, outerLink.target, 'gut check')
t.equal(outerLink, inner.children.get('outerlink'), 'gut check')

t.equal(deepestNestingTarget(tree, 'p'), tree)
t.equal(deepestNestingTarget(a, 'p'), tree)
t.equal(deepestNestingTarget(b, 'p'), tree)
t.equal(deepestNestingTarget(x, 'p'), x)
t.equal(deepestNestingTarget(inner, 'p'), tree)
t.equal(deepestNestingTarget(innerA, 'p'), tree)
t.equal(deepestNestingTarget(innerB, 'p'), tree)
t.equal(deepestNestingTarget(innerX, 'p'), innerX)
t.equal(deepestNestingTarget(outer, 'p'), outer)
t.equal(deepestNestingTarget(outerA, 'p'), outer)
t.equal(deepestNestingTarget(outerB, 'p'), outer)
t.equal(deepestNestingTarget(outerX, 'p'), outerX)
