const t = require('tap')
const CMap = require('../lib/case-insensitive-map.js')

t.test('set values in ctor', t => {
  const cmap = new CMap([['a', 'a'], [null, 'null'], [{ a: 1 }, 'a:1'], ['A', 'A']])
  t.strictSame([...cmap.entries()], [[null, 'null'], [{ a: 1 }, 'a:1'], ['A', 'A']])
  t.equal(cmap.has('a'), true)
  t.equal(cmap.has('A'), true)
  t.equal(cmap.get('a'), 'A')
  cmap.delete('a')
  t.equal(cmap.has('a'), false)
  t.equal(cmap.has('A'), false)
  t.equal(cmap.get('A'), undefined)
  t.end()
})

t.test('set values after ctor', t => {
  const cmap = new CMap()
  cmap.set('a', 'a')
  t.equal(cmap.has('a'), true)
  t.equal(cmap.has('A'), true)
  cmap.set(null, 'null')
  cmap.set({ a: 1 }, 'a:1')
  cmap.set('A', 'A')
  t.strictSame([...cmap.entries()], [[null, 'null'], [{ a: 1 }, 'a:1'], ['A', 'A']])
  cmap.delete('a')
  t.equal(cmap.has('a'), false)
  t.equal(cmap.has('A'), false)
  t.equal(cmap.get('A'), undefined)
  t.end()
})

t.test('dont get confused with undefined or weird values', t => {
  const cmap = new CMap()
  cmap.set(undefined, 'this is not defined')
  cmap.set(NaN, 'this is not a number')
  cmap.set('NaN', 'this is a string')
  cmap.set('nan', 'this is a quieter string')

  cmap.delete('foo')
  cmap.delete('NAN')
  t.strictSame([...cmap.entries()], [
    [undefined, 'this is not defined'],
    [NaN, 'this is not a number'],
  ])
  t.end()
})
