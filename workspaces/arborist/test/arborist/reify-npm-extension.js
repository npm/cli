const { join, resolve } = require('node:path')
const fs = require('node:fs')
const t = require('tap')
const Arborist = require('../..')
const fixtures = resolve(__dirname, '../fixtures')
require(fixtures)
const MockRegistry = require('@npmcli/mock-registry')
const { hashFile } = require('../../lib/npm-extension.js')

const createRegistry = (t) => new MockRegistry({
  strict: false,
  tap: t,
  registry: 'https://registry.npmjs.org',
})

// foo@1.0.0 does not declare bar; both are served as installable tarballs from source dirs.
const register = async (t, dir, { withBar = true, withBaz = false } = {}) => {
  const registry = createRegistry(t)
  const fooManifest = registry.manifest({ name: 'foo', packuments: [{ version: '1.0.0' }] })
  await registry.package({ manifest: fooManifest, tarballs: { '1.0.0': join(dir, 'src/foo') } })
  if (withBar) {
    const barManifest = registry.manifest({ name: 'bar', packuments: [{ version: '1.2.3' }] })
    await registry.package({ manifest: barManifest, tarballs: { '1.2.3': join(dir, 'src/bar') } })
  }
  if (withBaz) {
    const bazManifest = registry.manifest({ name: 'baz', packuments: [{ version: '3.0.0' }] })
    await registry.package({ manifest: bazManifest, tarballs: { '3.0.0': join(dir, 'src/baz') } })
  }
}

// a transformManifest that adds bar to foo
const addBar = `module.exports = {
  transformManifest (pkg) {
    if (pkg.name === 'foo') {
      pkg.dependencies = { ...pkg.dependencies, bar: '^1.0.0' }
    }
    return pkg
  },
}
`

const setup = async (t, { extension = addBar, file = '.npm-extension.cjs', dependencies = { foo: '1.0.0' }, overrides, withBar = true } = {}) => {
  const dir = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies, overrides }),
    [file]: extension,
    src: {
      foo: { 'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }) },
      bar: { 'package.json': JSON.stringify({ name: 'bar', version: '1.2.3' }) },
    },
  })
  await register(t, dir, { withBar })
  return dir
}

const newArb = (dir, opt = {}) => new Arborist({
  path: dir,
  cache: join(dir, 'cache'),
  registry: 'https://registry.npmjs.org',
  audit: false,
  timeout: 30 * 60 * 1000,
  ...opt,
})

const readLock = dir => JSON.parse(fs.readFileSync(join(dir, 'package-lock.json'), 'utf8'))

for (const installStrategy of ['hoisted', 'nested', 'shallow', 'linked']) {
  t.test(`installs the transform-created edge under install-strategy=${installStrategy}`, async t => {
    const dir = await setup(t)
    const tree = await newArb(dir, { installStrategy }).reify()
    const foo = [...tree.inventory.values()].find(n => n.name === 'foo' && !n.isLink)
    const barEdge = foo.edgesOut.get('bar')
    t.ok(barEdge && barEdge.valid && barEdge.to, `bar edge resolved under ${installStrategy}`)
    t.equal(barEdge.to.version, '1.2.3', 'bar resolved to a real installed node')
  })
}

t.test('lockfile records hash, provenance, effective deps, and version 4', async t => {
  const dir = await setup(t)
  await newArb(dir).reify()
  const lock = readLock(dir)
  t.equal(lock.lockfileVersion, 4, 'bumped to lockfileVersion 4')
  const expectHash = hashFile('cjs', Buffer.from(addBar))
  t.equal(lock.packages[''].npmExtensionHash, expectHash, 'root entry carries the file hash')
  const fooEntry = lock.packages['node_modules/foo']
  t.strictSame(fooEntry.npmExtensionApplied, { extensionPoint: 'transformManifest', dependencies: ['bar'] },
    'foo entry carries minimal provenance')
  t.strictSame(fooEntry.dependencies, { bar: '^1.0.0' }, 'foo entry carries the effective dependency metadata')
})

t.test('explain annotates the transform-created edge', async t => {
  const dir = await setup(t)
  const tree = await newArb(dir).reify()
  const foo = [...tree.inventory.values()].find(n => n.name === 'foo' && !n.isLink)
  const explanation = foo.edgesOut.get('bar').explain()
  t.strictSame(explanation.npmExtension, { extensionPoint: 'transformManifest', field: 'dependencies' },
    'edge explanation carries the transform provenance')
})

t.test('explain annotates an edge created in a non-first field', async t => {
  // adds bar to optionalDependencies, so the edge explanation loop skips `dependencies` before matching
  const dir = await setup(t, {
    extension: `module.exports = {
      transformManifest (pkg) {
        if (pkg.name === 'foo') {
          pkg.optionalDependencies = { ...pkg.optionalDependencies, bar: '^1.0.0' }
        }
        return pkg
      },
    }
`,
  })
  const tree = await newArb(dir).reify()
  const foo = [...tree.inventory.values()].find(n => n.name === 'foo' && !n.isLink)
  const explanation = foo.edgesOut.get('bar').explain()
  t.strictSame(explanation.npmExtension, { extensionPoint: 'transformManifest', field: 'optionalDependencies' },
    'edge explanation reports the optionalDependencies field')
})

t.test('does not rewrite the installed dependency package.json', async t => {
  const dir = await setup(t)
  await newArb(dir).reify()
  const installed = JSON.parse(fs.readFileSync(join(dir, 'node_modules/foo/package.json'), 'utf8'))
  t.notOk(installed.dependencies, 'the on-disk foo/package.json is not given a bar dependency')
})

t.test('composes with packageExtensions on the same package', async t => {
  // .npm-extension adds bar to foo (runs first); packageExtensions adds baz to foo (runs on the transform output)
  const dir = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { foo: '1.0.0' },
      packageExtensions: { 'foo@1': { dependencies: { baz: '^3.0.0' } } },
    }),
    '.npm-extension.cjs': addBar,
    src: {
      foo: { 'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }) },
      bar: { 'package.json': JSON.stringify({ name: 'bar', version: '1.2.3' }) },
      baz: { 'package.json': JSON.stringify({ name: 'baz', version: '3.0.0' }) },
    },
  })
  await register(t, dir, { withBaz: true })
  const tree = await newArb(dir).reify()
  const foo = [...tree.inventory.values()].find(n => n.name === 'foo' && !n.isLink)
  t.ok(foo.edgesOut.get('bar')?.to, 'transform-created bar edge resolved')
  t.ok(foo.edgesOut.get('baz')?.to, 'packageExtensions-created baz edge resolved')
  t.same(foo.npmExtensionApplied, { extensionPoint: 'transformManifest', dependencies: ['bar'] },
    'transform provenance recorded')
  t.same(foo.packageExtensionsApplied, { selector: 'foo@1', dependencies: ['baz'] },
    'packageExtensions provenance recorded')
})

t.test('composes with overrides during reify', async t => {
  const dir = await setup(t, { overrides: { bar: '1.2.3' } })
  const tree = await newArb(dir).reify()
  const bar = [...tree.inventory.values()].find(n => n.name === 'bar')
  t.equal(bar.version, '1.2.3', 'override applied to the transform-created edge')
})

t.test('an .mjs extension is honored', async t => {
  const dir = await setup(t, {
    file: '.npm-extension.mjs',
    extension: `export function transformManifest (pkg) {
      if (pkg.name === 'foo') pkg.dependencies = { ...pkg.dependencies, bar: '^1.0.0' }
      return pkg
    }
`,
  })
  const tree = await newArb(dir).reify()
  const foo = [...tree.inventory.values()].find(n => n.name === 'foo' && !n.isLink)
  t.ok(foo.edgesOut.get('bar')?.to, 'bar edge resolved via .mjs extension')
})

t.test('ignore-extension disables the transform and records no state', async t => {
  const dir = await setup(t, { withBar: false })
  await newArb(dir, { ignoreExtension: true }).reify()
  const lock = readLock(dir)
  t.notOk(lock.packages[''].npmExtensionHash, 'no extension hash recorded')
  t.notOk(lock.packages['node_modules/bar'], 'bar was never added by the disabled transform')
  t.notOk(lock.packages['node_modules/foo'].dependencies, 'foo has no extension-added dependency')
})

t.test('warns when a non-root workspace contains a .npm-extension file', async t => {
  const warnings = []
  const onlog = (...m) => m[0] === 'warn' && m[1] === 'npm-extension' && warnings.push(m[2])
  process.on('log', onlog)
  t.teardown(() => process.removeListener('log', onlog))

  const dir = t.testdir({
    'package.json': JSON.stringify({ name: 'root', workspaces: ['packages/*'] }),
    packages: {
      a: {
        'package.json': JSON.stringify({ name: 'a', version: '1.0.0' }),
        '.npm-extension.cjs': 'module.exports = { transformManifest (p) { return p } }\n',
      },
      b: { 'package.json': JSON.stringify({ name: 'b', version: '1.0.0' }) },
    },
  })
  await newArb(dir).buildIdealTree()
  t.match(warnings.join('\n'), /"\.npm-extension" in workspace a is ignored/, 'warns for the workspace with the file')
  t.notMatch(warnings.join('\n'), /workspace b/, 'does not warn for the workspace without one')
})

t.test('a project with no .npm-extension installs normally and records no state', async t => {
  const dir = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies: { foo: '1.0.0' } }),
    src: { foo: { 'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }) } },
  })
  await register(t, dir, { withBar: false })
  await newArb(dir).reify()
  const lock = readLock(dir)
  t.notOk(lock.packages[''].npmExtensionHash, 'no extension hash recorded')
  t.notOk(lock.packages['node_modules/foo'].dependencies, 'foo unchanged')
})

t.test('provenance round-trips under install-strategy=linked', async t => {
  const dir = await setup(t)
  await newArb(dir, { installStrategy: 'linked' }).reify()
  // the hidden lockfile carries the provenance forward on a second linked reify
  const tree = await newArb(dir, { installStrategy: 'linked' }).reify()
  const foo = [...tree.inventory.values()].find(n => n.name === 'foo')
  t.ok(foo.npmExtensionApplied || foo.target?.npmExtensionApplied, 'provenance present on the linked node or its target')
  // a full rescan (no cache) re-derives provenance on the store node and mirrors it onto the link
  const actual = await newArb(dir, { installStrategy: 'linked' }).loadActual({ forceActual: true })
  const fooLink = [...actual.inventory.values()].find(n => n.name === 'foo' && n.isLink)
  t.ok(fooLink?.npmExtensionApplied, 'a rescan mirrors provenance onto the linked location')
})

t.test('loadActual re-derives provenance only for transformed installed deps', async t => {
  // a filesystem-scanned tree: foo is the transform target, qux is an unrelated installed dep
  const dir = t.testdir({
    'package.json': JSON.stringify({ name: 'root', dependencies: { foo: '^1.0.0', qux: '^1.0.0' } }),
    '.npm-extension.cjs': addBar,
    node_modules: {
      foo: { 'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }) },
      qux: { 'package.json': JSON.stringify({ name: 'qux', version: '1.0.0' }) },
    },
  })
  const actual = await newArb(dir).loadActual()
  const foo = [...actual.inventory.values()].find(n => n.name === 'foo' && !n.isLink)
  const qux = [...actual.inventory.values()].find(n => n.name === 'qux' && !n.isLink)
  t.strictSame(foo.npmExtensionApplied, { extensionPoint: 'transformManifest', dependencies: ['bar'] },
    'foo carries provenance from the re-derived transform')
  t.equal(qux.npmExtensionApplied, null, 'qux, untouched by the transform, carries no provenance')
})

t.test('provenance round-trips through the lockfile', async t => {
  const dir = await setup(t)
  await newArb(dir).reify()
  // a second reify loads the lockfile and the on-disk tree; the edge and provenance must survive
  const tree = await newArb(dir).reify()
  const foo = [...tree.inventory.values()].find(n => n.name === 'foo' && !n.isLink)
  t.ok(foo.edgesOut.get('bar')?.to, 'bar edge still present after reinstall')
  t.strictSame(foo.npmExtensionApplied, { extensionPoint: 'transformManifest', dependencies: ['bar'] },
    'provenance preserved across reinstall')
})

t.test('changing the extension file re-resolves affected packages', async t => {
  const dir = await setup(t)
  await newArb(dir).reify()
  t.equal(readLock(dir).packages['node_modules/bar']?.version, '1.2.3', 'bar installed initially')

  // rewrite the extension so it no longer adds bar, then reinstall
  fs.writeFileSync(join(dir, '.npm-extension.cjs'), `module.exports = { transformManifest (pkg) { return pkg } }\n`)
  await register(t, dir, { withBar: false })
  await newArb(dir).reify()
  const lock = readLock(dir)
  t.notOk(lock.packages['node_modules/bar'], 'bar removed after the extension stopped adding it')
  t.notOk(lock.packages['node_modules/foo']?.npmExtensionApplied, 'provenance cleared')
})

t.test('removing the extension file reverts the locked graph', async t => {
  const dir = await setup(t)
  await newArb(dir).reify()
  t.ok(readLock(dir).packages['node_modules/bar'], 'bar installed by the extension')

  // delete the extension file entirely, then reinstall; the transform-added edge and state must be reverted
  fs.rmSync(join(dir, '.npm-extension.cjs'))
  await register(t, dir, { withBar: false })
  await newArb(dir).reify()
  const lock = readLock(dir)
  t.notOk(lock.packages['node_modules/bar'], 'bar removed once the extension file is gone')
  t.notOk(lock.packages[''].npmExtensionHash, 'root hash cleared')
  t.notOk(lock.packages['node_modules/foo']?.npmExtensionApplied, 'foo provenance cleared')
})
