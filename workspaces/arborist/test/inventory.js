// this test depends on debug stuff, so force it on, even if the test env
// does not enable it.
process.env.ARBORIST_DEBUG = '1'
const Inventory = require('../lib/inventory.js')
const localeCompare = require('@isaacs/string-locale-compare')('en')

const t = require('tap')

t.test('basic operations', t => {
  const i = new Inventory()
  t.equal(i.primaryKey, 'location')
  t.same(i.indexes, ['name', 'license', 'funding', 'realpath', 'packageName'])

  // uk spelling
  i.add({ location: 'x', name: 'x', package: { licence: 'MIT', funding: 'foo' } })
  // old-style multi-license array
  i.add({ location: 'y', name: 'x', package: { licenses: [{ type: 'ISC' }], funding: { url: 'foo' } } })
  i.add({ location: 'z', name: 'z', package: { license: { type: 'MIT' }, funding: 'bar' } })
  i.add({ location: 'a', name: 'a', package: {} })

  t.same(i.filter(node => /[xy]/.test(node.name)), [
    i.get('x'),
    i.get('y'),
  ], 'filter returns an iterable of all matching nodes')

  t.same([...i.query('license')].sort((a, b) => localeCompare(String(a), String(b))),
    ['ISC', 'MIT', undefined])
  t.same([...i.query('license', 'MIT')], [
    { location: 'x', name: 'x', package: { licence: 'MIT', funding: 'foo' } },
    { location: 'z', name: 'z', package: { license: { type: 'MIT' }, funding: 'bar' } },
  ], 'can query by license')
  t.same(i.query('license', 'blerg'), new Set(),
    'empty query returns empty set')
  t.same([...i.query('name', 'x')], [
    { location: 'x', name: 'x', package: { licence: 'MIT', funding: 'foo' } },
    { location: 'y', name: 'x', package: { licenses: [{ type: 'ISC' }], funding: { url: 'foo' } } },
  ], 'can query by name')
  t.same([...i.query('funding')].sort((a, b) => localeCompare(String(a), String(b))),
    ['bar', 'foo', undefined])
  t.same([...i.query('funding', 'foo')], [
    { location: 'x', name: 'x', package: { licence: 'MIT', funding: 'foo' } },
    { location: 'y', name: 'x', package: { licenses: [{ type: 'ISC' }], funding: { url: 'foo' } } },
  ], 'can query by funding url')

  const x = i.get('x')
  t.same(x, { location: 'x', name: 'x', package: { licence: 'MIT', funding: 'foo' } }, 'get by location')
  i.add(x)
  t.same(i.get('x'), x, 'adding a second time has no effect')
  t.equal(i.has(x), true, 'has a node')
  i.add({ location: 'x', name: 'a', package: { licences: [{ type: 'ABC' }] } })
  t.same(i.get('x'), { location: 'x', name: 'a', package: { licences: [{ type: 'ABC' }] } },
    'new node at same location overwrites')
  t.equal(i.has(x), false, 'node has been overwritten')

  const a = i.get('a')
  t.same([...i.query('license', undefined)], [a], 'can query by missing license')

  t.throws(() => i.set('a', 'b'), {
    message: 'direct set() not supported, use inventory.add(node)',
  })
  const y = i.get('y')
  i.delete({ location: 'y' })
  t.equal(i.get('y'), y, 'deleting other node with same key has no effect')
  i.delete(y)
  t.equal(i.has(y), false, 'no longer has the y node')
  t.equal(i.get('y'), undefined, 'get returns undefined')

  // no name or license!
  const z = { location: 'z' }
  i.add(z)
  t.equal(i.get('z'), z, 'can add and retrieve node without secondary keys')
  // oops!  mutated out of band, that's weird, but shouldn't throw anyway
  // though, of course, this makes the secondary indexes incomplete.
  // don't do this.  but probably not worth making the package immutable.
  z.package = { name: 'z' }
  t.doesNotThrow(() => i.delete(z), 'doesnt try to delete from nonexistent sets')
  t.equal(i.get('z'), undefined, 'node is not here')
  t.equal(i.has(z), false, 'i does not have z any more')

  t.doesNotThrow(() =>
    i.add({
      location: 'f',
      name: 'f',
      package: {
        license: 'MIT',
        funding: null,
      },
    }), 'doesnt throw on falsy funding info')

  t.doesNotThrow(() =>
    i.add({
      location: 'l',
      name: 'l',
      package: {
        license: null,
      },
    }), 'doesnt throw on falsy license info')

  // inherited properties and getters are allowed
  const n = Object.assign(Object.create({
    location: 'n',
    get packageName () {
      return this.package.name
    },
    get package () {
      return this._pkg
    },
  }), { _pkg: { name: 'n' } })
  i.add(n)
  t.equal(i.get('n'), n, 'found by inherited location')
  t.same([...i.query('packageName', 'n')], [n], 'found by packageName query')

  t.end()
})

t.test('dont allow external nodes to be added to inventory', t => {
  const i = new Inventory()
  const root = { location: '', path: 'rootpath' }
  i.add(root)
  t.throws(() => i.add({ root: { path: 'otherroot' }, location: 'adsf', path: 'nodepath' }), {
    message: 'adding external node to inventory',
    root: 'rootpath',
    node: 'nodepath',
    nodeRoot: 'otherroot',
  })
  t.end()
})

t.test('adding external nodes is no-op outside debug mode', t => {
  const Inventory = t.mock('../lib/inventory.js', {
    '../lib/debug.js': () => {},
  })
  const i = new Inventory()
  const root = { location: '', path: 'rootpath' }
  i.add(root)
  const other = { root: { path: 'otherroot' }, location: 'adsf', path: 'nodepath' }
  i.add(other)
  t.equal(i.has(other), false, 'did not add external node to inventory')
  t.end()
})
