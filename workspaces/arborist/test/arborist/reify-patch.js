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

  await t.resolves(newArb({ path, ignorePatchFailures: true }).reify(),
    'failure is downgraded and reify continues')
  // file remains as extracted since the patch was skipped
  t.equal(fs.readFileSync(installedFile(path), 'utf8'), ORIGINAL,
    'package left unpatched after skipped failure')
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
