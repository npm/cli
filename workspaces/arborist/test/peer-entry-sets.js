const t = require('tap')
const peerEntrySets = require('../lib/peer-entry-sets.js')

const Node = require('../lib/node.js')

t.test('basic test', t => {
  // a -> (b, c, d)
  // b -> PEER(d) b -> d -> e -> f <-> g
  // c -> PEER(f, h) c -> (f <-> g, h -> g)
  // d -> PEER(e) d -> e -> f <-> g
  // e -> PEER(f)
  // f -> PEER(g)
  // g -> PEER(f)
  // h -> PEER(g)
  const version = '1.0.0'
  const path = '/some/path'
  const a = new Node({
    path,
    pkg: { name: 'a', version, dependencies: { b: '', c: '', d: '' } },
    children: [
      { pkg: { name: 'b', version, peerDependencies: { d: '' } } },
      { pkg: { name: 'c', version, peerDependencies: { f: '', h: '' } } },
      { pkg: { name: 'd', version, peerDependencies: { e: '' } } },
      { pkg: { name: 'e', version, peerDependencies: { f: '' } } },
      { pkg: { name: 'f', version, peerDependencies: { g: '' } } },
      // g has an invalid dep on c, skip that one
      { pkg: { name: 'g', version, dependencies: { c: '2' }, peerDependencies: { f: '' } } },
      // h has an invalid peer dep on d, skip that one
      { pkg: { name: 'h', version, peerDependencies: { g: '', d: '2' } } },
    ],
  })
  const b = a.children.get('b')
  const c = a.children.get('c')
  const d = a.children.get('d')
  const e = a.children.get('e')
  const f = a.children.get('f')
  const g = a.children.get('g')
  const h = a.children.get('h')

  t.formatSnapshot = entrySet => {
    return new Map([...entrySet.entries()].map(([edge, nodes]) => {
      return [
        [edge.from.location, edge.type, edge.name, edge.spec],
        [...nodes].map(n => [n.location, n.version]),
      ]
    }))
  }

  t.matchSnapshot(peerEntrySets(b), 'b')
  t.matchSnapshot(peerEntrySets(c), 'c')
  t.matchSnapshot(peerEntrySets(d), 'd')
  t.matchSnapshot(peerEntrySets(e), 'e')
  t.matchSnapshot(peerEntrySets(f), 'f')
  t.matchSnapshot(peerEntrySets(g), 'g')
  t.matchSnapshot(peerEntrySets(h), 'h')
  t.end()
})
