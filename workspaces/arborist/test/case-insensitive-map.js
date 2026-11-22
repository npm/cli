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

t.test('do not get confused with undefined or weird values', t => {
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

t.test('preserves case folding and Unicode normalization', t => {
  for (const [key, equivalent] of [
    ['@scope/package-name_1.0', '@SCOPE/PACKAGE-NAME_1.0'],
    ['caf\u00e9', 'cafe\u0301'],
    ['\u212a', 'k'],
    ['\ufb03', 'ffi'],
    ['\uff21', 'a'],
    ['\ud835\udc00', 'a'],
    ['\u0130', 'i\u0307'],
  ]) {
    const cmap = new CMap([[key, 1]])
    t.equal(cmap.get(equivalent), 1)
    t.equal(cmap.has(equivalent), true)
    cmap.set(equivalent, 2)
    t.equal(cmap.size, 1)
    t.equal(cmap.get(key), 2)
    t.strictSame([...cmap.keys()], [equivalent])
    t.equal(cmap.delete(key), true)
    t.equal(cmap.has(equivalent), false)
  }
  t.end()
})

t.test('preserves empty, undefined-valued, and non-string keys', t => {
  const object = {}
  const symbol = Symbol('key')
  for (const key of ['', '\u0000', undefined, null, NaN, 0, object, symbol]) {
    const cmap = new CMap([[key, undefined]])
    t.equal(cmap.has(key), true)
    t.equal(cmap.get(key), undefined)
    t.equal(cmap.delete(key), true)
    t.equal(cmap.has(key), false)
  }
  t.end()
})

t.test('skips normalization for canonical ASCII keys', t => {
  const normalizeDescriptor = Object.getOwnPropertyDescriptor(String.prototype, 'normalize')
  const toLowerCaseDescriptor =
    Object.getOwnPropertyDescriptor(String.prototype, 'toLowerCase')
  const canonicalKey = '@scope/package-name_1.0'
  const missingKey = '@scope/missing-package_2.0'
  const uppercaseKey = '@SCOPE/PACKAGE-NAME_1.0'
  const unicodeKey = 'caf\u00e9'
  const normalizedUnicodeKey = normalizeDescriptor.value.call(unicodeKey, 'NFKD')
  const normalizeInputs = new Set([
    canonicalKey,
    missingKey,
    uppercaseKey,
    unicodeKey,
  ])
  const toLowerCaseInputs = new Set([
    canonicalKey,
    missingKey,
    uppercaseKey,
    normalizedUnicodeKey,
  ])
  const normalizeCalls = []
  const toLowerCaseCalls = []
  const snapshots = {}
  let hit
  let miss
  let uppercaseHit
  let unicodeMiss

  try {
    Object.defineProperty(String.prototype, 'normalize', {
      ...normalizeDescriptor,
      value: function (...args) {
        const value = this.valueOf()
        if (normalizeInputs.has(value)) {
          normalizeCalls.push(value)
        }
        return normalizeDescriptor.value.apply(this, args)
      },
    })
    Object.defineProperty(String.prototype, 'toLowerCase', {
      ...toLowerCaseDescriptor,
      value: function (...args) {
        const value = this.valueOf()
        if (toLowerCaseInputs.has(value)) {
          toLowerCaseCalls.push(value)
        }
        return toLowerCaseDescriptor.value.apply(this, args)
      },
    })

    const cmap = new CMap()
    cmap.set(canonicalKey, 1)
    snapshots.insertion = [normalizeCalls.length, toLowerCaseCalls.length]
    hit = cmap.get(canonicalKey)
    snapshots.hit = [normalizeCalls.length, toLowerCaseCalls.length]
    miss = cmap.get(missingKey)
    snapshots.miss = [normalizeCalls.length, toLowerCaseCalls.length]
    uppercaseHit = cmap.get(uppercaseKey)
    snapshots.uppercase = [normalizeCalls.length, toLowerCaseCalls.length]
    unicodeMiss = cmap.get(unicodeKey)
    snapshots.unicode = [normalizeCalls.length, toLowerCaseCalls.length]
  } finally {
    Object.defineProperty(String.prototype, 'normalize', normalizeDescriptor)
    Object.defineProperty(String.prototype, 'toLowerCase', toLowerCaseDescriptor)
  }

  t.strictSame(snapshots, {
    insertion: [0, 0],
    hit: [0, 0],
    miss: [0, 0],
    uppercase: [1, 1],
    unicode: [2, 2],
  })
  t.strictSame(normalizeCalls, [uppercaseKey, unicodeKey])
  t.strictSame(toLowerCaseCalls, [uppercaseKey, normalizedUnicodeKey])
  t.equal(hit, 1)
  t.equal(miss, undefined)
  t.equal(uppercaseHit, 1)
  t.equal(unicodeMiss, undefined)
  t.end()
})
