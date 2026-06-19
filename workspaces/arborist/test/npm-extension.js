const t = require('tap')
const { resolve } = require('node:path')
const NpmExtension = require('../lib/npm-extension.js')
const { discover, hashFile, EXTENSION_POINT } = require('../lib/npm-extension.js')

// write a transformManifest module body as a .mjs or .cjs file in a fresh dir
const mjs = body => `export function transformManifest (pkg, context) {\n${body}\n}\n`
const cjs = body => `module.exports = { transformManifest (pkg, context) {\n${body}\n} }\n`

t.test('discover', async t => {
  t.equal(discover(t.testdir({}), null), null, 'nothing present')

  const mjsDir = t.testdir({ '.npm-extension.mjs': mjs('return pkg') })
  t.match(discover(mjsDir, null), { format: 'mjs', path: resolve(mjsDir, '.npm-extension.mjs') }, 'finds .mjs')

  const cjsDir = t.testdir({ '.npm-extension.cjs': cjs('return pkg') })
  t.match(discover(cjsDir, null), { format: 'cjs' }, 'finds .cjs')

  const bothDir = t.testdir({ '.npm-extension.mjs': mjs('return pkg'), '.npm-extension.cjs': cjs('return pkg') })
  t.throws(() => discover(bothDir, null), { code: 'ENPMEXTENSIONDUP' }, 'rejects both files present')

  // extension-file
  const cfgDir = t.testdir({ tools: { 'ext.mjs': mjs('return pkg') } })
  t.match(discover(cfgDir, 'tools/ext.mjs'), { format: 'mjs' }, 'loads configured file')
  t.throws(() => discover(cfgDir, '../escape.mjs'), { code: 'ENPMEXTENSIONPATH' }, 'rejects path outside root')
  t.throws(() => discover(cfgDir, 'tools/ext.js'), { code: 'ENPMEXTENSIONPATH' }, 'rejects non mjs/cjs extension')
  t.throws(() => discover(cfgDir, 'tools/missing.mjs'), { code: 'ENPMEXTENSIONPATH' }, 'rejects missing configured file')

  // a non-ENOENT read error (here a directory in the file's place) propagates
  const dirNamed = t.testdir({ '.npm-extension.mjs': {} })
  t.throws(() => discover(dirNamed, null), { code: 'EISDIR' }, 'propagates non-ENOENT read errors')
})

t.test('hashFile is deterministic and format-tagged', async t => {
  const bytes = Buffer.from('export function transformManifest (p) { return p }')
  t.equal(hashFile('mjs', bytes), hashFile('mjs', bytes), 'stable for same bytes')
  t.not(hashFile('mjs', bytes), hashFile('cjs', bytes), 'mjs and cjs differ for identical bytes')
  t.match(hashFile('mjs', bytes), /^sha512-/, 'sha512 ssri string')
})

t.test('constructor without root is absent', async t => {
  const ext = new NpmExtension()
  t.equal(ext.present, false)
  t.equal(ext.hash, null)
})

t.test('load: honors an ESM default export', async t => {
  const dir = t.testdir({
    '.npm-extension.mjs': `export default { transformManifest (pkg) { pkg.dependencies = { d: '1' }; return pkg } }\n`,
  })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  t.same(ext.apply({ name: 'foo', version: '1.0.0' }).applied.dependencies, ['d'], 'default export used')
})

t.test('apply: keys the cache by resolved source when integrity is absent', async t => {
  const dir = t.testdir({ '.npm-extension.cjs': cjs(`pkg.dependencies = { d: '1' }; return pkg`) })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  // a git-style manifest: no _integrity, no version, only a resolved source
  const res = ext.apply({ name: 'g', _resolved: 'git+ssh://host/a.git#abc' })
  t.same(res.applied.dependencies, ['d'], 'transform applied to a non-registry manifest')
})

t.test('apply: a manifest without a name is skipped', async t => {
  const dir = t.testdir({ '.npm-extension.mjs': mjs('pkg.dependencies = { d: "1" }; return pkg') })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  t.equal(ext.apply({ version: '1.0.0' }), null, 'no name means nothing to match')
})

t.test('load: rejects a bad export shape', async t => {
  const dir = t.testdir({ '.npm-extension.mjs': 'export const transformManifest = 5\n' })
  const ext = new NpmExtension({ root: dir })
  t.ok(ext.present)
  t.ok(ext.hash, 'hash computed without executing the module')
  await t.rejects(ext.load(), { code: 'ENPMEXTENSIONSHAPE' }, 'non-function export rejected')
})

t.test('load: absent extension is a no-op', async t => {
  const ext = new NpmExtension({ root: t.testdir({}) })
  await ext.load()
  t.equal(ext.apply({ name: 'x', version: '1.0.0' }), null, 'apply is a no-op when absent')
})

t.test('apply: cjs adds a dependency', async t => {
  const dir = t.testdir({
    '.npm-extension.cjs': cjs(`if (pkg.name === 'foo') { pkg.dependencies = { ...pkg.dependencies, bar: '^2.0.0' }; context.log('added bar') } return pkg`),
  })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  const res = ext.apply({ name: 'foo', version: '1.0.0', _integrity: 'sha512-foo' })
  t.same(res.pkg.dependencies, { bar: '^2.0.0' }, 'dependency added')
  t.same(res.applied, { extensionPoint: EXTENSION_POINT, dependencies: ['bar'] }, 'provenance recorded')
  t.equal(ext.apply({ name: 'other', version: '1.0.0' }), null, 'non-matching package unchanged')
})

t.test('apply: mjs adds optional peer and meta, sorted provenance', async t => {
  const dir = t.testdir({
    '.npm-extension.mjs': mjs(`
      if (pkg.name !== 'widget') return pkg
      pkg.peerDependencies = { ...pkg.peerDependencies, '@types/react': '*', react: '>=18' }
      pkg.peerDependenciesMeta = { ...pkg.peerDependenciesMeta, '@types/react': { optional: true } }
      return pkg`),
  })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  const res = ext.apply({ name: 'widget', version: '2.0.0', _integrity: 'sha512-w' })
  t.same(res.applied, {
    extensionPoint: EXTENSION_POINT,
    peerDependencies: ['@types/react', 'react'],
    peerDependenciesMeta: ['@types/react'],
  }, 'affected names sorted per field')
})

t.test('apply: can replace a range and delete an entry', async t => {
  const dir = t.testdir({
    '.npm-extension.cjs': cjs(`
      if (pkg.name === 'rep') pkg.dependencies = { ...pkg.dependencies, dep: '^9.0.0' }
      if (pkg.name === 'del') delete pkg.dependencies.gone
      return pkg`),
  })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  const rep = ext.apply({ name: 'rep', version: '1.0.0', dependencies: { dep: '^1.0.0' } })
  t.equal(rep.pkg.dependencies.dep, '^9.0.0', 'range replaced')
  t.same(rep.applied.dependencies, ['dep'])

  const del = ext.apply({ name: 'del', version: '1.0.0', dependencies: { gone: '1', keep: '2' } })
  t.same(del.pkg.dependencies, { keep: '2' }, 'entry deleted')
  t.same(del.applied.dependencies, ['gone'], 'deleted name recorded in provenance')
})

t.test('apply: no-op transform returns null', async t => {
  const dir = t.testdir({ '.npm-extension.mjs': mjs('return pkg') })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  t.equal(ext.apply({ name: 'foo', version: '1.0.0' }), null, 'unchanged manifest yields no provenance')
})

t.test('apply: caches per identity and isolates consumers', async t => {
  const dir = t.testdir({
    '.npm-extension.cjs': cjs(`pkg.dependencies = { ...pkg.dependencies, added: '1.0.0' }; return pkg`),
  })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  // two consumers of the same cached identity must each get a distinct, deeply isolated object
  const a = ext.apply({ name: 'foo', version: '1.0.0', _integrity: 'sha512-shared' })
  const b = ext.apply({ name: 'foo', version: '1.0.0', _integrity: 'sha512-shared' })
  t.not(a.pkg, b.pkg, 'each consumer gets a distinct object')
  a.pkg.dependencies.added = 'mutated'
  t.equal(b.pkg.dependencies.added, '1.0.0', 'mutating one copy does not affect another')
})

t.test('apply: rejects invalid transform output', async t => {
  const cases = [
    ['return null', 'ENPMEXTENSIONRETURN'],
    ['return 5', 'ENPMEXTENSIONRETURN'],
    ['return []', 'ENPMEXTENSIONRETURN'],
    ['return Promise.resolve(pkg)', 'ENPMEXTENSIONRETURN'],
    [`pkg.scripts = { build: 'x' }; return pkg`, 'ENPMEXTENSIONFIELD'],
    [`return { name: pkg.name, version: pkg.version, scripts: { build: 'x' } }`, 'ENPMEXTENSIONFIELD'],
    [`pkg.dependencies = 'nope'; return pkg`, 'ENPMEXTENSIONVALUE'],
    [`pkg.dependencies = null; return pkg`, 'ENPMEXTENSIONVALUE'],
    [`pkg.dependencies = { x: null }; return pkg`, 'ENPMEXTENSIONVALUE'],
    [`pkg.peerDependencies = { p: '*' }; pkg.peerDependenciesMeta = { p: null }; return pkg`, 'ENPMEXTENSIONVALUE'],
    [`throw new Error('boom')`, 'ENPMEXTENSIONTHROW'],
  ]
  // a unique dir per case so require/import cache never serves a previous module
  for (const [i, [body, code]] of cases.entries()) {
    const dir = t.testdir({ [`c${i}`]: { '.npm-extension.cjs': cjs(body) } })
    const ext = new NpmExtension({ root: resolve(dir, `c${i}`) })
    await ext.load()
    t.throws(() => ext.apply({ name: 'foo', version: '1.0.0', scripts: {} }), { code }, `${code}: ${body}`)
  }
})

t.test('apply: a handler may return a new object with only repaired fields', async t => {
  const dir = t.testdir({
    '.npm-extension.cjs': cjs(`return { name: pkg.name, version: pkg.version, dependencies: { ...pkg.dependencies, bar: '^2.0.0' } }`),
  })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  const res = ext.apply({ name: 'foo', version: '1.0.0', dependencies: { keep: '1' }, scripts: { build: 'x' }, _integrity: 'sha512-z' })
  t.same(res.pkg.dependencies, { keep: '1', bar: '^2.0.0' }, 'returned dependencies overlaid on the baseline')
  t.same(res.pkg.scripts, { build: 'x' }, 'omitted non-allowlisted field preserved from the baseline')
})

t.test('apply: isolates cached provenance between consumers', async t => {
  const dir = t.testdir({ '.npm-extension.cjs': cjs(`pkg.dependencies = { ...pkg.dependencies, bar: '1' }; return pkg`) })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  const a = ext.apply({ name: 'foo', version: '1.0.0', _integrity: 'sha512-prov' })
  const b = ext.apply({ name: 'foo', version: '1.0.0', _integrity: 'sha512-prov' })
  a.applied.dependencies.push('mutated')
  t.same(b.applied.dependencies, ['bar'], 'mutating one consumer\'s provenance does not affect another')
})

t.test('apply: does not mutate the input manifest', async t => {
  const dir = t.testdir({ '.npm-extension.cjs': cjs(`pkg.dependencies = { bar: '1' }; return pkg`) })
  const ext = new NpmExtension({ root: dir })
  await ext.load()
  const input = { name: 'foo', version: '1.0.0', dependencies: { keep: '2' } }
  ext.apply(input)
  t.same(input.dependencies, { keep: '2' }, 'caller manifest untouched')
})
