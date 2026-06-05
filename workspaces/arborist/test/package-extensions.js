const t = require('tap')
const PackageExtensions = require('../lib/package-extensions.js')
const {
  parseSelector,
  rangeMatches,
  canonicalHash,
  canonicalStringify,
} = require('../lib/package-extensions.js')

t.test('parseSelector', async t => {
  t.strictSame(parseSelector('foo'), { name: 'foo', range: null }, 'name only')
  t.strictSame(parseSelector('foo@1'), { name: 'foo', range: '1' }, 'name with range')
  t.strictSame(parseSelector('@scope/foo'), { name: '@scope/foo', range: null }, 'scoped name only')
  t.strictSame(parseSelector('@scope/foo@^2.3.0'), { name: '@scope/foo', range: '^2.3.0' }, 'scoped with range')

  for (const bad of ['', null, undefined, 5]) {
    t.throws(() => parseSelector(bad), { code: 'EEXTENSIONSELECTOR' }, `rejects ${JSON.stringify(bad)}`)
  }
  // dist-tags, git, file, url, alias specs are not valid selectors
  for (const bad of ['foo@latest', 'foo@next', 'foo@git+https://x.com/a.git', 'foo@file:../x', 'foo@npm:bar@1', 'foo@https://x.com/a.tgz']) {
    t.throws(() => parseSelector(bad), { code: 'EEXTENSIONSELECTOR' }, `rejects spec selector ${bad}`)
  }
  // a blank range is malformed; use the name-only form to match every version
  for (const bad of ['foo@', 'foo@ ', '@scope/foo@']) {
    t.throws(() => parseSelector(bad), { code: 'EEXTENSIONSELECTOR' }, `rejects blank range ${JSON.stringify(bad)}`)
  }
  // invalid package names
  for (const bad of ['  @1', ' space ', '.hidden']) {
    t.throws(() => parseSelector(bad), { code: 'EEXTENSIONSELECTOR' }, `rejects invalid name ${bad}`)
  }
})

t.test('rangeMatches', async t => {
  t.ok(rangeMatches(null, '1.2.3'), 'name-only matches semver version')
  t.ok(rangeMatches(null, 'not-semver'), 'name-only matches non-semver version')
  t.ok(rangeMatches('1', '1.2.3'), 'range matches satisfying version')
  t.notOk(rangeMatches('1', '2.0.0'), 'range rejects non-satisfying version')
  t.notOk(rangeMatches('1', 'not-semver'), 'versioned selector rejects non-semver version')
})

t.test('constructor validation', async t => {
  t.equal(new PackageExtensions(undefined).present, false, 'absent field is allowed and not present')
  t.equal(new PackageExtensions(undefined).hash, null, 'absent field has no hash')

  const empty = new PackageExtensions({})
  t.equal(empty.present, true, 'empty object is present')
  t.ok(empty.hash, 'empty object still hashes')

  for (const bad of [null, [], 'x', 5]) {
    t.throws(() => new PackageExtensions(bad), { code: 'EEXTENSIONROOT' }, `rejects root ${JSON.stringify(bad)}`)
  }

  t.throws(() => new PackageExtensions({ foo: { devDependencies: { a: '1' } } }),
    { code: 'EEXTENSIONFIELD' }, 'rejects unsupported field')
  t.throws(() => new PackageExtensions({ foo: { dependencies: [] } }),
    { code: 'EEXTENSIONVALUE' }, 'rejects non-object field value')
  t.throws(() => new PackageExtensions({ foo: 'bar' }),
    { code: 'EEXTENSIONVALUE' }, 'rejects non-object extension')

  for (const del of [null, false, '-']) {
    t.throws(() => new PackageExtensions({ foo: { dependencies: { bar: del } } }),
      { code: 'EEXTENSIONDELETE' }, `rejects deletion value ${JSON.stringify(del)}`)
  }

  for (const bad of [null, false, '-', 'x', 5]) {
    t.throws(() => new PackageExtensions({ foo: { peerDependenciesMeta: { bar: bad } } }),
      { code: 'EEXTENSIONVALUE' }, `rejects non-object peerDependenciesMeta value ${JSON.stringify(bad)}`)
  }
})

t.test('match', async t => {
  const pe = new PackageExtensions({
    foo: { dependencies: { a: '1' } },
    'bar@^2': { dependencies: { b: '1' } },
  })
  t.equal(pe.match('foo', '9.9.9').key, 'foo', 'name-only matches any version')
  t.equal(pe.match('bar', '2.5.0').key, 'bar@^2', 'range matches satisfying version')
  t.equal(pe.match('bar', '1.0.0'), null, 'range misses non-satisfying version')
  t.equal(pe.match('nope', '1.0.0'), null, 'unknown name misses')

  const conflict = new PackageExtensions({
    foo: { dependencies: { a: '1' } },
    'foo@1': { dependencies: { b: '1' } },
  })
  t.throws(() => conflict.match('foo', '1.2.3'), { code: 'EEXTENSIONCONFLICT' }, 'two matching selectors conflict')
  t.equal(conflict.match('foo', '2.0.0').key, 'foo', 'only one matches at 2.0.0, no conflict')
})

t.test('apply: add missing dependencies and optionalDependencies', async t => {
  const pe = new PackageExtensions({
    foo: {
      dependencies: { 'missing-dep': '^2.0.0' },
      optionalDependencies: { 'opt-dep': '^1.0.0' },
    },
  })
  const { pkg, applied } = pe.apply({ name: 'foo', version: '1.0.0', dependencies: { existing: '^1' } })
  t.strictSame(pkg.dependencies, { existing: '^1', 'missing-dep': '^2.0.0' }, 'added to dependencies, kept existing')
  t.strictSame(pkg.optionalDependencies, { 'opt-dep': '^1.0.0' }, 'created optionalDependencies')
  t.strictSame(applied, {
    selector: 'foo',
    dependencies: ['missing-dep'],
    optionalDependencies: ['opt-dep'],
  }, 'provenance records selector and changed names')
})

t.test('apply: does not mutate the input manifest', async t => {
  const pe = new PackageExtensions({ foo: { dependencies: { bar: '^1' } } })
  const input = { name: 'foo', version: '1.0.0', dependencies: { a: '1' } }
  const inputDeps = input.dependencies
  const { pkg } = pe.apply(input)
  t.strictSame(input.dependencies, { a: '1' }, 'input dependencies unchanged')
  t.equal(input.dependencies, inputDeps, 'input dependencies object identity unchanged')
  t.not(pkg.dependencies, input.dependencies, 'output has a fresh dependencies object')
})

t.test('apply: rejects replacing an existing normal dependency', async t => {
  const pe = new PackageExtensions({ foo: { dependencies: { bar: '^2' } } })
  t.throws(() => pe.apply({ name: 'foo', version: '1.0.0', dependencies: { bar: '^1' } }),
    { code: 'EEXTENSIONDUPDEP' }, 'cannot replace existing dependency')

  const peOpt = new PackageExtensions({ foo: { dependencies: { bar: '^2' } } })
  t.throws(() => peOpt.apply({ name: 'foo', version: '1.0.0', optionalDependencies: { bar: '^1' } }),
    { code: 'EEXTENSIONDUPDEP' }, 'cannot add a dependency already in optionalDependencies (no field move)')

  const peMove = new PackageExtensions({ foo: { optionalDependencies: { bar: '^2' } } })
  t.throws(() => peMove.apply({ name: 'foo', version: '1.0.0', dependencies: { bar: '^1' } }),
    { code: 'EEXTENSIONDUPDEP' }, 'cannot add an optionalDependency already in dependencies (no field move)')
})

t.test('apply: peerDependencies merge and replace', async t => {
  const pe = new PackageExtensions({
    foo: {
      peerDependencies: { typescript: '>=5', react: '^18' },
    },
  })
  const { pkg, applied } = pe.apply({
    name: 'foo',
    version: '1.0.0',
    peerDependencies: { typescript: '>=4', vue: '^3' },
  })
  t.strictSame(pkg.peerDependencies, { typescript: '>=5', vue: '^3', react: '^18' },
    'replaced existing range, added new, kept unrelated')
  t.strictSame(applied.peerDependencies.sort(), ['react', 'typescript'], 'provenance lists changed peers')
})

t.test('apply: peerDependenciesMeta merge by key', async t => {
  const pe = new PackageExtensions({
    foo: {
      peerDependenciesMeta: { typescript: { optional: true } },
    },
  })
  const { pkg } = pe.apply({
    name: 'foo',
    version: '1.0.0',
    peerDependencies: { typescript: '>=5' },
    peerDependenciesMeta: { typescript: { somethingElse: true } },
  })
  t.strictSame(pkg.peerDependenciesMeta.typescript, { somethingElse: true, optional: true },
    'shallow-merged meta object without dropping existing keys')
})

t.test('apply: peerDependenciesMeta with same extension adding the peer', async t => {
  const pe = new PackageExtensions({
    foo: {
      peerDependencies: { typescript: '>=5' },
      peerDependenciesMeta: { typescript: { optional: true } },
    },
  })
  const { pkg } = pe.apply({ name: 'foo', version: '1.0.0' })
  t.strictSame(pkg.peerDependencies, { typescript: '>=5' }, 'peer added')
  t.strictSame(pkg.peerDependenciesMeta, { typescript: { optional: true } }, 'meta added')
})

t.test('apply: orphan peerDependenciesMeta is an error', async t => {
  const pe = new PackageExtensions({
    foo: { peerDependenciesMeta: { typescript: { optional: true } } },
  })
  t.throws(() => pe.apply({ name: 'foo', version: '1.0.0' }),
    { code: 'EEXTENSIONORPHANMETA' }, 'meta without corresponding peer fails')
})

t.test('apply: peer may overlap with dependencies', async t => {
  const pe = new PackageExtensions({
    foo: { peerDependencies: { bar: '^1' } },
  })
  const { pkg } = pe.apply({ name: 'foo', version: '1.0.0', dependencies: { bar: '^1' } })
  t.strictSame(pkg.dependencies, { bar: '^1' }, 'dependency kept')
  t.strictSame(pkg.peerDependencies, { bar: '^1' }, 'peer added alongside dependency')
})

t.test('apply: returns null when nothing matches', async t => {
  const pe = new PackageExtensions({ foo: { dependencies: { a: '1' } } })
  t.equal(pe.apply({ name: 'other', version: '1.0.0' }), null, 'no match returns null')
  t.equal(new PackageExtensions(undefined).apply({ name: 'foo', version: '1' }), null, 'absent returns null')
  t.equal(pe.apply(null), null, 'no manifest returns null')
})

t.test('canonical hash is order-independent and value-sensitive', async t => {
  const a = canonicalHash({ foo: { dependencies: { a: '1', b: '2' } }, bar: { dependencies: { c: '3' } } })
  const b = canonicalHash({ bar: { dependencies: { c: '3' } }, foo: { dependencies: { b: '2', a: '1' } } })
  t.equal(a, b, 'key order does not change the hash')

  const c = canonicalHash({ foo: { dependencies: { a: '1.0.0' } } })
  t.not(a, c, 'value changes change the hash')
  t.match(a, /^sha512-/, 'uses sha512 digest encoding')

  t.equal(canonicalStringify({ b: 1, a: 2 }), '{"a":2,"b":1}', 'sorts keys')
  t.equal(canonicalStringify({ a: [3, 1] }), '{"a":[3,1]}', 'preserves array order')
})

t.test('constructor stores hash of present field', async t => {
  const raw = { foo: { dependencies: { bar: '^1' } } }
  t.equal(new PackageExtensions(raw).hash, canonicalHash(raw), 'instance hash matches canonicalHash')
})
