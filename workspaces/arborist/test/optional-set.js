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
const nodeA = tree.children.get('a')
const nodeO = tree.children.get('o')
const nodeM = tree.children.get('m')
const nodeN = tree.children.get('n')
const nodeB = tree.children.get('b')

const setJ = optionalSet(nodeJ)
t.equal(setJ.has(nodeJ), true, 'gathering from j includes j')
t.equal(setJ.has(nodeI), true, 'gathering from j includes i')
t.equal(setJ.size, 2, 'two nodes in j set')

const setA = optionalSet(nodeA)
t.equal(setA.size, 0, 'gathering from a is empty set')

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
