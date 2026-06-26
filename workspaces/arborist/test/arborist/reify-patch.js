const t = require('tap')
const fs = require('node:fs')
const { resolve } = require('node:path')
const { createTwoFilesPatch } = require('diff')
const MockRegistry = require('@npmcli/mock-registry')
const Arborist = require('../../lib/index.js')

// build a git-style unified diff for a single file change
const filePatch = (file, before, after) => {
  let p = createTwoFilesPatch(`a/${file}`, `b/${file}`, before, after, '', '')
    .replace('===================================================================\n', '')
  if (before === '') {
    p = p.replace(`--- a/${file}\t`, '--- /dev/null\t')
  }
  if (after === '') {
    p = p.replace(`+++ b/${file}\t`, '+++ /dev/null\t')
  }
  return p
}

const createRegistry = (t) => new MockRegistry({
  strict: false,
  tap: t,
  registry: 'https://registry.npmjs.org',
})

const newArb = (opt) => new Arborist({
  audit: false,
  cache: opt.path,
  registry: 'https://registry.npmjs.org',
  timeout: 30 * 60 * 1000,
  ...opt,
})

// the registry package source we patch in these tests
const PKG_NAME = 'patch-me'
const PKG_VERSION = '1.0.0'
const ORIGINAL = 'module.exports = "original"\n'
const PATCHED = 'module.exports = "patched"\n'

// register the package manifest + tarball on the mock registry.
// manifestTimes controls how many packument GETs are served, tarballTimes how many tarball GETs.
// nock consumes one mock per request and teardown asserts every registered mock is used, so counts must match the requests a test makes.
const mockPackage = async (t, registry, { manifestTimes = 1, tarballTimes = 1 } = {}) => {
  const src = t.testdir({
    'package.json': JSON.stringify({ name: PKG_NAME, version: PKG_VERSION }),
    'index.js': ORIGINAL,
  })
  const manifest = registry.manifest({
    name: PKG_NAME,
    packuments: [{ version: PKG_VERSION }],
  })
  registry.nock = registry.nock
    .get(registry.fullPath(`/${PKG_NAME}`)).times(manifestTimes).reply(200, manifest)
  for (let i = 0; i < tarballTimes; i++) {
    await registry.tarball({ manifest: manifest.versions[PKG_VERSION], tarball: src })
  }
  return manifest
}

// write a project root + on-disk patch file, return its path
const makeProject = (t, { patch, patchedDependencies, extra = {} }) => {
  const tree = {
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { [PKG_NAME]: `^${PKG_VERSION}` },
      ...(patchedDependencies ? { patchedDependencies } : {}),
    }),
    ...extra,
  }
  if (patch !== undefined) {
    tree.patches = { [`${PKG_NAME}@${PKG_VERSION}.patch`]: patch }
  }
  return t.testdir(tree)
}

const installedFile = (path) =>
  resolve(path, 'node_modules', PKG_NAME, 'index.js')

t.test('registry dep with patch is applied and recorded in lockfile', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry)

  const patch = filePatch('index.js', ORIGINAL, PATCHED)
  const path = makeProject(t, {
    patch,
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  await newArb({ path }).reify()

  t.equal(fs.readFileSync(installedFile(path), 'utf8'), PATCHED,
    'extracted package was patched')

  const lock = JSON.parse(fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8'))
  t.equal(lock.lockfileVersion, 4, 'lockfile bumped to version 4')
  const pkgEntry = lock.packages[`node_modules/${PKG_NAME}`]
  t.ok(pkgEntry.patched, 'lockfile records patched')
  t.equal(pkgEntry.patched.path, `patches/${PKG_NAME}@${PKG_VERSION}.patch`,
    'patched.path is the relative patch path')
  t.match(pkgEntry.patched.integrity, /^sha512-/, 'patched.integrity is an SSRI')
})

t.test('uninstalling a patched package drops its entry from package.json', async t => {
  const registry = createRegistry(t)
  // one install, then an uninstall that resolves from the lockfile so no extra fetches
  await mockPackage(t, registry)

  const patch = filePatch('index.js', ORIGINAL, PATCHED)
  const path = makeProject(t, {
    patch,
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  await newArb({ path }).reify()
  t.equal(fs.readFileSync(installedFile(path), 'utf8'), PATCHED, 'package installed and patched')

  // npm uninstall <pkg>: removes the dep but leaves the now-orphaned patch entry
  await newArb({ path }).reify({ rm: [PKG_NAME] })

  const rootPkg = JSON.parse(fs.readFileSync(resolve(path, 'package.json'), 'utf8'))
  t.notOk(rootPkg.dependencies?.[PKG_NAME], 'dependency removed from package.json')
  t.notOk(rootPkg.patchedDependencies, 'orphaned patch entry dropped from package.json')
  t.notOk(fs.existsSync(resolve(path, 'node_modules', PKG_NAME)), 'package removed from node_modules')
})

t.test('patch is re-applied on a patch-change reify even with ignoreScripts', async t => {
  const registry = createRegistry(t)
  // two reifys: the second re-extracts the node due to the patch change.
  // the second reify resolves the dep from the lockfile, so only one manifest GET.
  await mockPackage(t, registry, { manifestTimes: 1, tarballTimes: 2 })

  // first reify with no patch registered
  const path = makeProject(t, {})
  await newArb({ path }).reify()
  t.equal(fs.readFileSync(installedFile(path), 'utf8'), ORIGINAL,
    'first install is unpatched')

  // now add a patch + patchedDependencies and reify again with ignoreScripts
  const patch = filePatch('index.js', ORIGINAL, PATCHED)
  fs.mkdirSync(resolve(path, 'patches'), { recursive: true })
  fs.writeFileSync(resolve(path, 'patches', `${PKG_NAME}@${PKG_VERSION}.patch`), patch)
  const rootPkg = JSON.parse(fs.readFileSync(resolve(path, 'package.json'), 'utf8'))
  rootPkg.patchedDependencies = {
    [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch`,
  }
  fs.writeFileSync(resolve(path, 'package.json'), JSON.stringify(rootPkg))

  await newArb({ path, ignoreScripts: true }).reify()

  t.equal(fs.readFileSync(installedFile(path), 'utf8'), PATCHED,
    'patch applied on patch-change reify under ignoreScripts')
  const lock = JSON.parse(fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8'))
  t.equal(lock.lockfileVersion, 4, 'lockfile bumped to version 4 after patch added')
})

t.test('patch that fails to apply throws EPATCHFAILED', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry)

  // a patch whose context does not match the extracted file
  const patch = filePatch('index.js', 'totally different\n', 'something else\n')
  const path = makeProject(t, {
    patch,
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  await t.rejects(newArb({ path }).reify(), { code: 'EPATCHFAILED' },
    'hunk that does not apply hard-errors')
})

t.test('ignorePatchFailures downgrades EPATCHFAILED to a warning', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry)

  const patch = filePatch('index.js', 'totally different\n', 'something else\n')
  const path = makeProject(t, {
    patch,
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  const warnings = []
  const onLog = (level, prefix, msg) => level === 'warn' && warnings.push(`${prefix} ${msg}`)
  process.on('log', onLog)
  t.teardown(() => process.removeListener('log', onLog))

  await t.resolves(newArb({ path, ignorePatchFailures: true }).reify(),
    'failure is downgraded and reify continues')
  // file remains as extracted since the patch was skipped
  t.equal(fs.readFileSync(installedFile(path), 'utf8'), ORIGINAL,
    'package left unpatched after skipped failure')
  // the skipped patch must not be recorded in the lockfile
  const lock = JSON.parse(fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8'))
  t.notOk(lock.packages[`node_modules/${PKG_NAME}`].patched,
    'unapplied patch is not written to the lockfile')
  // the user is told the lockfile is now out of sync with package.json
  t.match(warnings.join('\n'), /out of sync and `npm ci` will fail/,
    'warns that the lockfile no longer matches package.json')
})

t.test('missing patch file throws EPATCHNOTFOUND', async t => {
  const registry = createRegistry(t)
  // resolvePatchedDependencies fails before extract, so the tarball is never fetched
  await mockPackage(t, registry, { tarballTimes: 0 })

  // register patchedDependencies but do NOT write the patch file
  const path = makeProject(t, {
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  await t.rejects(newArb({ path }).reify(), { code: 'EPATCHNOTFOUND' },
    'missing patch file on disk hard-errors')
})

t.test('warns when a patch upgrades the lockfile version', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry)
  const path = makeProject(t, {
    patch: filePatch('index.js', ORIGINAL, PATCHED),
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  const warnings = []
  const onLog = (level, prefix, msg) => level === 'warn' && warnings.push(`${prefix} ${msg}`)
  process.on('log', onLog)
  t.teardown(() => process.removeListener('log', onLog))

  await newArb({ path }).reify()
  t.match(warnings.join('\n'), /requires lockfileVersion 4/, 'warns that the lockfile was upgraded')
})

t.test('does not re-warn or bump the hidden lockfile once the lockfile is already v4', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry)
  const path = makeProject(t, {
    patch: filePatch('index.js', ORIGINAL, PATCHED),
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  // the first reify legitimately upgrades the real lockfile to v4
  await newArb({ path }).reify()

  const warnings = []
  const onLog = (level, prefix, msg) => level === 'warn' && warnings.push(`${prefix} ${msg}`)
  process.on('log', onLog)
  t.teardown(() => process.removeListener('log', onLog))

  // the hidden lockfile is pinned to v3, so a second reify must not re-fire the upgrade warning
  await newArb({ path }).reify()
  t.notMatch(warnings.join('\n'), /requires lockfileVersion 4/, 'no spurious upgrade warning when already v4')

  const hidden = JSON.parse(fs.readFileSync(resolve(path, 'node_modules/.package-lock.json'), 'utf8'))
  t.equal(hidden.lockfileVersion, 3, 'hidden lockfile stays at version 3')
})

t.test('reify revalidates the patch file when build-ideal-tree was already run', async t => {
  // build-ideal-tree validates first, but reify must still guard against a file removed afterwards
  const registry = createRegistry(t)
  await mockPackage(t, registry)
  const patchRel = `patches/${PKG_NAME}@${PKG_VERSION}.patch`
  const path = makeProject(t, {
    patch: filePatch('index.js', ORIGINAL, PATCHED),
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: patchRel },
  })

  const arb = newArb({ path })
  await arb.buildIdealTree()
  // delete the validated patch file; reify reuses the cached ideal tree and re-checks
  fs.rmSync(resolve(path, patchRel))
  await t.rejects(arb.reify(), { code: 'EPATCHNOTFOUND' },
    'reify re-checks the patch file even on a prebuilt ideal tree')
})

t.test('reify rejects a patch whose contents changed after build-ideal-tree', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry)
  const patchRel = `patches/${PKG_NAME}@${PKG_VERSION}.patch`
  const path = makeProject(t, {
    patch: filePatch('index.js', ORIGINAL, PATCHED),
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: patchRel },
  })

  const arb = newArb({ path })
  await arb.buildIdealTree()
  // change the patch contents after validation so the integrity no longer matches
  fs.writeFileSync(resolve(path, patchRel), filePatch('index.js', ORIGINAL, 'module.exports = "other"\n'))
  await t.rejects(arb.reify(), { code: 'EPATCHINTEGRITY' },
    'reify rejects an integrity mismatch introduced after build-ideal-tree')
})

t.test('applies a patch under install-strategy=linked via the side-store', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry)
  const patchRel = `patches/${PKG_NAME}@${PKG_VERSION}.patch`
  const path = makeProject(t, {
    patch: filePatch('index.js', ORIGINAL, PATCHED),
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: patchRel },
  })

  await newArb({ path, installStrategy: 'linked' }).reify()

  // the consumer symlink resolves to the patched contents
  t.equal(fs.readFileSync(installedFile(path), 'utf8'), PATCHED, 'linked consumer sees the patch')

  // the patched package lives in a distinct +patch side-store entry
  const store = fs.readdirSync(resolve(path, 'node_modules', '.store'))
  const entry = store.find(e => e.startsWith(`${PKG_NAME}@${PKG_VERSION}-`) && e.endsWith('+patch'))
  t.ok(entry, 'side-store key carries the +patch suffix')
  t.equal(
    fs.readFileSync(resolve(path, 'node_modules', '.store', entry, 'node_modules', PKG_NAME, 'index.js'), 'utf8'),
    PATCHED,
    'the patch is applied in the side-store entry'
  )
})

t.test('removing a patch under install-strategy=linked reverts via the side-store', async t => {
  const registry = createRegistry(t)
  await mockPackage(t, registry, { manifestTimes: 1, tarballTimes: 2 })
  const patchRel = `patches/${PKG_NAME}@${PKG_VERSION}.patch`
  const path = makeProject(t, {
    patch: filePatch('index.js', ORIGINAL, PATCHED),
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: patchRel },
  })

  // first install materializes the patched +patch side-store entry
  await newArb({ path, installStrategy: 'linked' }).reify()
  t.equal(fs.readFileSync(installedFile(path), 'utf8'), PATCHED, 'patched before removal')

  // remove the patch declaration and its file, then reinstall
  const pkg = JSON.parse(fs.readFileSync(resolve(path, 'package.json'), 'utf8'))
  delete pkg.patchedDependencies
  fs.writeFileSync(resolve(path, 'package.json'), JSON.stringify(pkg))
  fs.rmSync(resolve(path, patchRel))

  await newArb({ path, installStrategy: 'linked' }).reify()
  t.equal(fs.readFileSync(installedFile(path), 'utf8'), ORIGINAL, 'consumer reverted to unpatched contents')
  const store = fs.readdirSync(resolve(path, 'node_modules', '.store'))
  t.notOk(store.some(e => e.endsWith('+patch')), 'the +patch side-store entry was pruned')
})

t.test('linked ignorePatchFailures cannot skip a failed patch', async t => {
  // the content-addressed side-store cannot represent an unpatched package at a patched key,
  // so a failed patch must error rather than silently leave unpatched contents that later installs trust.
  const registry = createRegistry(t)
  await mockPackage(t, registry)
  const patch = filePatch('index.js', 'totally different\n', 'something else\n')
  const path = makeProject(t, {
    patch,
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: `patches/${PKG_NAME}@${PKG_VERSION}.patch` },
  })

  await t.rejects(
    newArb({ path, installStrategy: 'linked', ignorePatchFailures: true }).reify(),
    { code: 'EPATCHFAILED', message: /install-strategy=linked/ },
    'a failed patch cannot be skipped under linked mode'
  )
})

t.test('a patched optional dependency still fails loudly on patch problems', async t => {
  // optional installs tolerate platform/env failures, but a declared patch must not be silently skipped
  const registry = createRegistry(t)
  await mockPackage(t, registry)
  const patchRel = `patches/${PKG_NAME}@${PKG_VERSION}.patch`
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      optionalDependencies: { [PKG_NAME]: `^${PKG_VERSION}` },
      patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: patchRel },
    }),
    patches: { [`${PKG_NAME}@${PKG_VERSION}.patch`]: filePatch('index.js', ORIGINAL, PATCHED) },
  })

  const arb = newArb({ path })
  await arb.buildIdealTree()
  fs.rmSync(resolve(path, patchRel))
  await t.rejects(arb.reify(), { code: 'EPATCHNOTFOUND' },
    'optional patch failure is not swallowed by optional handling')
})

t.test('restores node.patched from an existing v4 lockfile', async t => {
  const patchRel = `patches/${PKG_NAME}@${PKG_VERSION}.patch`
  const path = makeProject(t, {
    patch: filePatch('index.js', ORIGINAL, PATCHED),
    patchedDependencies: { [`${PKG_NAME}@${PKG_VERSION}`]: patchRel },
    extra: {
      'package-lock.json': JSON.stringify({
        name: 'root',
        version: '1.0.0',
        lockfileVersion: 4,
        requires: true,
        packages: {
          '': { name: 'root', version: '1.0.0', dependencies: { [PKG_NAME]: `^${PKG_VERSION}` } },
          [`node_modules/${PKG_NAME}`]: {
            version: PKG_VERSION,
            resolved: `https://registry.npmjs.org/${PKG_NAME}/-/${PKG_NAME}-${PKG_VERSION}.tgz`,
            integrity: 'sha512-deadbeef',
            patched: { path: patchRel, integrity: 'sha512-abc' },
          },
        },
      }),
    },
  })
  const tree = await newArb({ path }).loadVirtual()
  const dep = [...tree.inventory.values()].find(n => n.name === PKG_NAME)
  t.strictSame(dep.patched, { path: patchRel, integrity: 'sha512-abc' },
    'node.patched is read back from the lockfile packages entry')
})
