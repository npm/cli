const t = require('tap')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const gatherDepSet = require('../lib/gather-dep-set.js')

const Node = require('../lib/node.js')

/*
tree (a, b, c)
+-- a (x, y)
+-- x (b)
+-- y (i)
+-- b (i, j)
+-- i (j, k)
+-- j (k)
+-- k ()
+-- c (r, s)
+-- r (s, t)
+-- s (t)
+-- t (missing) <-- unmet dependency

logical tree:
tree
+-- a
|   +-- x
|   |   +-- b (deduped)
|   +-- y
|       +-- i (deduped)
+-- b
|   +-- i
|   |   +-- j (deduped)
|   |   +-- k
|   +-- j
|       +-- k (deduped)
+-- c
    +-- r
    |   +-- s (deduped)
    |   +-- t (deduped)
    +-- s
        +-- t
            +-- missing (error, missing)

Gather dep set, ignoring edges coming from or going to root.

Gathering from a will include b.  Gathering from c will not.  Gathering from b
alone will be an empty set.
*/

const tree = new Node({
  path: '/path/to/tree',
  pkg: {
    dependencies: {
      a: '',
      b: '',
      c: '',
    },
  },
  children: [
    // [name, [deps]]
    ['a', ['x', 'y']],
    ['x', ['b']],
    ['y', ['i']],
    ['b', ['i', 'j']],
    ['i', ['j', 'k']],
    ['j', ['k']],
    ['k', []],
    ['c', ['r', 's']],
    ['r', ['s', 't']],
    ['s', ['t']],
    ['t', ['missing']],
  ].map(([name, deps]) => ({
    pkg: {
      name,
      version: '1.0.0',
      dependencies: deps.reduce((d, n) => {
        d[n] = ''
        return d
      }, {}),
    },
  })),
})

const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')

const printSet = set => [...set]
  .sort((a, b) => localeCompare(a.name, b.name))
  .map(n => n.location)

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

t.formatSnapshot = obj => obj instanceof Set ? printSet(obj) : obj

const nodeA = tree.children.get('a')
const nodeB = tree.children.get('b')
const nodeC = tree.children.get('c')
const nodeX = tree.children.get('x')

const f = edge => edge.from !== tree && edge.to !== tree

const setA = gatherDepSet(new Set([nodeA]), f)
t.matchSnapshot(setA, 'set with a')
t.equal(setA.has(nodeB), true, 'set(a) includes node b')
t.equal(setA.has(nodeC), false, 'set(a) does not include node c')
t.equal(setA.has(nodeX), true, 'set(a) includes node x')

const setAX = gatherDepSet(new Set([nodeA, nodeX]), f)
t.matchSnapshot(setAX, 'set with a and x')
t.equal(setAX.has(nodeB), true, 'set(ax) includes node b')
t.equal(setAX.has(nodeC), false, 'set(ax) does not include node c')

const setB = gatherDepSet(new Set([nodeB]), f)
t.matchSnapshot(setB, 'set with b')
t.equal(setB.size, 0, 'gathering dep set from b is an empty set')

const setC = gatherDepSet(new Set([nodeC]), f)
t.matchSnapshot(setC, 'set with c only')
t.equal(setC.has(nodeC), true, 'set(c) includes node c')
t.equal(setC.has(nodeA), false, 'set(c) does not includes node a')
t.equal(setC.has(nodeB), false, 'set(c) does not includes node b')
t.equal(setC.has(nodeX), false, 'set(c) does not includes node b')
