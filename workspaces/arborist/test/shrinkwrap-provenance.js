const t = require('tap')
const procLog = require('proc-log')
const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const Arborist = require('../lib/index.js')
const calcDepFlags = require('../lib/calc-dep-flags.js')
const { readFile, writeFile, mkdir } = require('node:fs/promises')
const { resolve } = require('node:path')

const warnings = []
const Shrinkwrap = t.mock('../lib/shrinkwrap.js', {
  'proc-log': {
    ...procLog,
    log: { ...procLog.log, warn: (...args) => warnings.push(args) },
  },
})

const resolved = 'https://registry.example/dep/-/dep-1.0.0.tgz'
const integrity = 'sha512-dep'
const getWarnings = () => warnings.splice(0)

const makeTree = async (t, options = {}) => {
  const dir = t.testdir()
  const sw = await Shrinkwrap.load({
    path: dir,
    lockfileVersion: options.lockfileVersion || 3,
    hiddenLockfile: options.hiddenLockfile,
    resolveOptions: { omitLockfileRegistryResolved: options.omitResolved },
  })
  const root = new Node({
    path: dir,
    meta: sw,
    pkg: {
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: options.spec || '1.0.0' },
      ...(options.bundled ? { bundleDependencies: ['dep'] } : {}),
    },
  })
  const dep = new Node({
    pkg: { name: 'dep', version: '1.0.0' },
    resolved: options.resolved,
    integrity: options.integrity,
    parent: root,
  })
  calcDepFlags(root)
  sw.add(root)
  return { root, dep, sw }
}

const assertWarning = (t, count = 1) => {
  const messages = getWarnings()
  t.equal(messages.length, 1, 'one aggregate warning')
  t.equal(messages[0]?.[0], 'shrinkwrap')
  t.match(messages[0]?.[1], `metadata for ${count} non-bundled registry`)
  t.notMatch(messages[0]?.[1], /registry\.example|node_modules|sha512|root/,
    'diagnostic contains no source or package data')
}

for (const lockfileVersion of [1, 2, 3, 4]) {
  t.test(`public v${lockfileVersion} lockfile provenance warnings`, async t => {
    const cases = [
      [{}, 'both fields missing'],
      [{ resolved }, 'integrity missing'],
      [{ integrity }, 'resolved missing'],
      [{ omitResolved: true }, 'integrity missing with resolved omitted'],
    ]
    for (const [options, name] of cases) {
      await t.test(name, async t => {
        const { sw } = await makeTree(t, { ...options, lockfileVersion })
        const expected = sw.toString()
        await sw.save()
        assertWarning(t)
        t.equal(await readFile(sw.filename, 'utf8'), expected,
          'warning leaves serialized data unchanged')
      })
    }
  })
}

t.test('complete and deliberately omitted metadata do not warn', async t => {
  for (const options of [{ resolved, integrity }, { resolved, integrity, omitResolved: true }]) {
    await t.test(JSON.stringify(options), async t => {
      const { sw } = await makeTree(t, options)
      await sw.save()
      t.same(getWarnings(), [])
      const data = JSON.parse(await readFile(sw.filename, 'utf8'))
      t.equal(data.packages['node_modules/dep'].resolved,
        options.omitResolved ? undefined : resolved)
    })
  }
})

t.test('multiple incomplete dependencies produce one warning', async t => {
  const { sw, root } = await makeTree(t)
  root.package = { ...root.package, dependencies: { dep: '1.0.0', other: '1.0.0' } }
  new Node({ pkg: { name: 'other', version: '1.0.0' }, parent: root })
  calcDepFlags(root)
  await sw.save()
  assertWarning(t, 2)
})

t.test('non-registry sources and bundled packages are excluded', async t => {
  const cases = [
    { spec: 'git+https://example.com/dep.git' },
    { spec: 'file:../dep.tgz' },
    { spec: 'file:../dep' },
    { spec: 'https://example.com/dep.tgz' },
    { bundled: true },
  ]
  for (const options of cases) {
    await t.test(JSON.stringify(options), async t => {
      const { sw } = await makeTree(t, options)
      await sw.save()
      t.ok(sw.data.packages['node_modules/dep'], 'excluded package is serialized')
      t.same(getWarnings(), [])
    })
  }
})

t.test('workspace links and their targets are excluded', async t => {
  const { sw, root, dep } = await makeTree(t)
  dep.parent = null
  const path = resolve(root.path, 'packages/dep')
  root.workspaces = new Map([['dep', path]])
  const target = new Node({ path, pkg: { name: 'dep', version: '1.0.0' }, root })
  const link = new Link({ path: resolve(root.path, 'node_modules/dep'), target, parent: root })
  calcDepFlags(root)
  t.equal(link.isLink, true)
  t.equal(target.isWorkspace, true)
  await sw.save()
  t.ok(sw.data.packages['packages/dep'])
  t.ok(sw.data.packages['node_modules/dep'].link)
  t.same(getWarnings(), [])
})

t.test('root and packages with no incoming spec are excluded', async t => {
  const { sw, root, dep } = await makeTree(t)
  root.package = { name: 'root', version: '1.0.0' }
  calcDepFlags(root)
  t.equal(dep.isRegistryDependency, false)
  await sw.save()
  t.ok(sw.data.packages['node_modules/dep'])
  t.same(getWarnings(), [])
})

t.test('inert packages omitted from serialization do not warn', async t => {
  const { sw, dep } = await makeTree(t)
  dep.package = { name: 'dep' }
  dep.inert = true
  await sw.save()
  t.notOk(sw.data.packages['node_modules/dep'])
  t.same(getWarnings(), [])
})

t.test('hidden lockfiles and metadata-only saves do not warn', async t => {
  const { sw } = await makeTree(t, { hiddenLockfile: true })
  await mkdir(resolve(sw.path, 'node_modules'))
  await sw.save()
  t.ok(JSON.parse(await readFile(sw.filename, 'utf8')).packages['node_modules/dep'])
  t.same(getWarnings(), [])
  sw.hiddenLockfile = false
  sw.tree = null
  await sw.save()
  t.same(getWarnings(), [])
})

t.test('root links use the project inventory', async t => {
  const { sw, root } = await makeTree(t)
  const link = new Link({ path: resolve(root.path, '../project-link'), realpath: root.path })
  link.target = root
  t.equal(root.root, link)
  t.equal(root.inventory.size, 0)
  t.ok(link.inventory.size > 0)
  await sw.save()
  assertWarning(t)
})

t.test('save errors are preserved', async t => {
  t.throws(() => new Shrinkwrap().save(), Error('run load() before saving data'))
  const { sw } = await makeTree(t)
  sw.filename = resolve(sw.path, 'missing/package-lock.json')
  await t.rejects(sw.save(), { code: 'ENOENT' })
  assertWarning(t)
})

t.test('reify warns when rebuilding a lockfile from an installed tree', async t => {
  const dir = t.testdir()
  const project = resolve(dir, 'project')
  await mkdir(resolve(project, 'node_modules/dep'), { recursive: true })
  await writeFile(resolve(project, 'package.json'), JSON.stringify({
    name: 'root',
    version: '1.0.0',
    dependencies: { dep: '1.0.0' },
  }))
  await writeFile(resolve(project, 'node_modules/dep/package.json'), JSON.stringify({
    name: 'dep',
    version: '1.0.0',
  }))

  const seen = []
  const onlog = (...args) => args[0] === 'warn' && seen.push(args)
  process.on('log', onlog)
  try {
    await new Arborist({
      path: project,
      cache: resolve(dir, 'cache'),
      offline: true,
      ignoreScripts: true,
      audit: false,
      fund: false,
    }).reify()
  } finally {
    process.removeListener('log', onlog)
  }

  const lock = JSON.parse(await readFile(resolve(project, 'package-lock.json'), 'utf8'))
  const dep = lock.packages['node_modules/dep']
  t.ok(dep, 'the installed dependency is saved to the public lockfile')
  t.equal(dep.resolved, undefined, 'the original source URL remains unknown')
  t.equal(dep.integrity, undefined, 'the original integrity remains unknown')
  t.equal(seen.length, 1, 'one aggregate warning reaches the reify caller')
  if (seen[0]) {
    t.same(seen[0].slice(0, 2), ['warn', 'shrinkwrap'])
    t.match(seen[0][2], /Missing resolved or integrity metadata for 1 non-bundled registry dependency/)
  }
})
