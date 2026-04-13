const t = require('tap')
const optionalSet = require('../lib/optional-set.js')
const calcDepFlags = require('../lib/calc-dep-flags.js')

const Node = require('../lib/node.js')

/*
tree (PROD a, PROD c, OPT i)
+-- a (OPT o)
+-- b (PROD c)
+-- c (OPT b)
+-- o (PROD m, OPT i)
+-- m (OPT n)
+-- n ()
+-- OPT i (PROD j)
+-- j ()

Gathering the optional set from:
j: [j, i],
a: [],
o: [o, m, n],
m: [o, m, n],
b: [b],
*/

const tree = new Node({
  path: '/path/to/tree',
  pkg: {
    dependencies: {
      a: '',
      c: '',
    },
    optionalDependencies: {
      i: '',
    },
  },
  children: [
    // [name, deps, optDeps]
    ['a', [], ['o']],
    ['b', ['c'], []],
    ['c', [], ['b']],
    ['o', ['m'], ['i']],
    ['m', [], ['n']],
    ['n', [], []],
    ['i', ['j'], []],
    ['j', [], []],
  ].map(([name, deps, optDeps]) => ({
    pkg: {
      name,
      version: '1.0.0',
      dependencies: deps.reduce((d, n) => {
        d[n] = ''
        return d
      }, {}),
      optionalDependencies: optDeps.reduce((d, n) => {
        d[n] = ''
        return d
      }, {}),
    },
  })),
})

calcDepFlags(tree)

const nodeJ = tree.children.get('j')
const nodeI = tree.children.get('i')
const nodeO = tree.children.get('o')
const nodeM = tree.children.get('m')
const nodeN = tree.children.get('n')
const nodeB = tree.children.get('b')

const setJ = optionalSet(nodeJ)
t.equal(setJ.has(nodeJ), true, 'gathering from j includes j')
t.equal(setJ.has(nodeI), true, 'gathering from j includes i')
t.equal(setJ.size, 2, 'two nodes in j set')

const setO = optionalSet(nodeO)
t.equal(setO.size, 3, 'three nodes in o set')
t.equal(setO.has(nodeO), true, 'set o includes o')
t.equal(setO.has(nodeM), true, 'set o includes m')
t.equal(setO.has(nodeN), true, 'set o includes n')

const setM = optionalSet(nodeM)
t.equal(setM.size, 3, 'three nodes in m set')
t.equal(setM.has(nodeO), true, 'set m includes o')
t.equal(setM.has(nodeM), true, 'set m includes m')
t.equal(setM.has(nodeN), true, 'set m includes n')

const setB = optionalSet(nodeB)
t.equal(setB.size, 1, 'gathering from b is only b')
t.equal(setB.has(nodeB), true, 'set b includes b')

// tree (OPT opt-p, OPT opt-q)
// +-- OPT opt-p (PROD shared-dep)
// +-- OPT opt-q (PROD shared-dep)
// +-- shared-dep ()
const sharedTree = new Node({
  path: '/path/to/shared-tree',
  pkg: {
    optionalDependencies: {
      'opt-p': '',
      'opt-q': '',
    },
  },
  children: [
    { pkg: { name: 'opt-p', version: '1.0.0', dependencies: { 'shared-dep': '' } } },
    { pkg: { name: 'opt-q', version: '1.0.0', dependencies: { 'shared-dep': '' } } },
    { pkg: { name: 'shared-dep', version: '1.0.0' } },
  ],
})

calcDepFlags(sharedTree)

const nodeOptP = sharedTree.children.get('opt-p')
const nodeOptQ = sharedTree.children.get('opt-q')
const nodeSharedDep = sharedTree.children.get('shared-dep')

// Simulate opt-p failing platform check and being marked inert first
const setOptP = optionalSet(nodeOptP)
// shared-dep is excluded because opt-q (not yet inert) also depends on it
t.equal(setOptP.has(nodeOptP), true, 'set opt-p includes opt-p')
t.equal(setOptP.has(nodeSharedDep), false, 'set opt-p excludes shared-dep (opt-q is not inert)')
for (const n of setOptP) {
  n.inert = true
}

// Simulate opt-q failing platform check second (opt-p is already inert)
const setOptQ = optionalSet(nodeOptQ)
// shared-dep now has no active external dependents and is included
t.equal(setOptQ.has(nodeOptQ), true, 'set opt-q includes opt-q')
t.equal(setOptQ.has(nodeSharedDep), true, 'set opt-q includes shared-dep (opt-p is inert)')
t.equal(setOptQ.size, 2, 'set opt-q has two nodes: opt-q and shared-dep')
