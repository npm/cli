const { join, resolve, basename } = require('node:path')
const t = require('tap')
const runScript = require('@npmcli/run-script')
const localeCompare = require('@isaacs/string-locale-compare')('en')
// TODO mock registry (will require several because of differing hosts
const tnock = require('../fixtures/tnock')
const fs = require('node:fs')
const fsp = require('node:fs/promises')
const npmFs = require('@npmcli/fs')
const MockRegistry = require('@npmcli/mock-registry')

let failRm = false
let failRename = null
let failRenameOnce = null
let failMkdir = null

const fspMock = {
  ...fsp,
  mkdir: async (...args) => {
    if (failMkdir) {
      throw failMkdir
    }

    return fsp.mkdir(...args)
  },
  rename: async (...args) => {
    if (failRename) {
      throw failRename
    } else if (failRenameOnce) {
      const er = failRenameOnce
      failRenameOnce = null
      throw er
    } else {
      return fsp.rename(...args)
    }
  },
  rm: async (...args) => {
    if (failRm) {
      throw new Error('rm fail')
    }

    return fsp.rm(...args)
  },
}

// need this to be injected so that it doesn't pull from main cache
const { moveFile } = t.mock('@npmcli/fs', { 'fs/promises': fspMock })
const mocks = {
  'node:fs/promises': fspMock,
  '@npmcli/fs': { ...npmFs, moveFile },
}

const oldLockfileWarning = [
  'warn',
  'old lockfile',
  `
The package-lock.json file was created with an old version of npm,
so supplemental metadata must be fetched from the registry.

This is a one-time fix-up, please be patient...
`,
]

// track the warnings that are emitted.  returns a function that removes
// the listener and provides the list of what it saw.
const warningTracker = () => {
  const list = []
  const onlog = (...msg) => msg[0] === 'warn' && list.push(msg)
  process.on('log', onlog)
  return () => {
    process.removeListener('log', onlog)
    return list
  }
}

const outputTracker = () => {
  const list = []
  const onlog = (...msg) => msg[0] === 'standard' && list.push(msg)
  process.on('output', onlog)
  return () => {
    process.removeListener('output', onlog)
    return list
  }
}

const debugLogTracker = () => {
  const list = []
  mockDebug.log = (...msg) => list.push(msg)
  return () => {
    mockDebug.log = () => {}
    return list
  }
}
const mockDebug = Object.assign(fn => fn(), { log: () => {} })

const Arborist = t.mock('../..', {
  ...mocks,
  // need to not mock this one, so we still can swap the process object
  '../../lib/signal-handling.js': require('../../lib/signal-handling.js'),

  // mock the debug so we can test these even when not enabled
  '../../lib/debug.js': mockDebug,
})

const { Node, Link, Shrinkwrap } = Arborist

const {
  normalizePath,
  normalizePaths,
  printTree,
} = require('../fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

const fixture = (t, p) => require('../fixtures/reify-cases/' + p)(t)

const printReified = (path, opt) => reify(path, opt).then(printTree)
const fixtures = join(__dirname, '..', 'fixtures')
const createRegistry = (t, mocks) => {
  const registry = new MockRegistry({
    strict: true,
    tap: t,
    registry: 'https://registry.npmjs.org',
  })
  if (mocks) {
    registry.mocks({ dir: join(__dirname, '..', 'fixtures') })
  }
  return registry
}

const newArb = (opt) => new Arborist({
  audit: false,
  cache: opt.path,
  // give it a very long timeout so CI doesn't crash as easily
  timeout: 30 * 60 * 1000,
  ...opt,
})

const reify = (path, opt = {}) => newArb({ path, ...opt }).reify(opt)

t.test('bundled file dep with same name as other dep', async t => {
  const registry = createRegistry(t)
  registry.mocks({ dir: fixtures })
  const tree = await printReified(fixture(t, 'conflict-bundle-file-dep'))
  t.matchSnapshot(tree)
})

t.test('tarball deps with transitive tarball deps', async t => {
  createRegistry(t)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'tarball-dependencies')))
})

t.test('update a yarn.lock file', async t => {
  const path = fixture(t, 'yarn-lock-mkdirp')
  createRegistry(t, true)
  const tree = await reify(path, { add: ['abbrev'] })
  t.matchSnapshot(printTree(tree), 'add abbrev')
  t.matchSnapshot(fs.readFileSync(path + '/yarn.lock', 'utf8'), 'updated yarn lock')
})

t.test('weirdly broken lockfile without resolved value', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'dep-missing-resolved')))
})

t.test('testing-peer-deps package', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'testing-peer-deps')))
})

t.test('just the shrinkwrap', async t => {
  await t.test('cli-750-fresh', async t => {
    const path = fixture(t, 'cli-750-fresh')
    createRegistry(t, false)
    const arb = newArb({ path, audit: true, packageLockOnly: true })
    await arb.reify()
    t.throws(() => fs.statSync(path + '/node_modules'), { code: 'ENOENT' })
    t.matchSnapshot(fs.readFileSync(path + '/package-lock.json', 'utf8'))
  })
  await t.test('yarn-lock-mkdirp', async t => {
    const path = fixture(t, 'yarn-lock-mkdirp')
    const registry = createRegistry(t, true)
    registry.audit({})
    const arb = newArb({ path, audit: true, packageLockOnly: true })
    await arb.reify()
    t.throws(() => fs.statSync(path + '/node_modules'), { code: 'ENOENT' })
    t.matchSnapshot(fs.readFileSync(path + '/package-lock.json', 'utf8'))
  })
})

t.test('packageLockOnly can add deps', async t => {
  const path = t.testdir({ 'package.json': '{}' })
  createRegistry(t, true)
  await reify(path, { add: ['abbrev'], packageLockOnly: true })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
  t.matchSnapshot(fs.readFileSync(path + '/package-lock.json', 'utf8'))
  t.throws(() => fs.statSync(path + '/node_modules'), { code: 'ENOENT' })
})

t.test('malformed package.json should not be overwitten', async t => {
  t.plan(2)

  const path = fixture(t, 'malformed-json')
  createRegistry(t, false)
  const originalContent = fs.readFileSync(path + '/package.json', 'utf8')

  try {
    await reify(path)
  } catch (err) {
    t.match(err, { code: 'EJSONPARSE' }, 'should throw EJSONPARSE error')
  }

  const resultContent = fs.readFileSync(path + '/package.json', 'utf8')
  t.equal(
    resultContent,
    originalContent,
    'should not touch file contents on malformed json'
  )
})

t.test('packageLockOnly does not work on globals', t => {
  const path = t.testdir({ 'package.json': '{}' })
  createRegistry(t, false)
  return t.rejects(() => reify(path, { global: true, packageLockOnly: true }))
})

t.test('omit peer deps', t => {
  const path = fixture(t, 'testing-peer-deps')
  createRegistry(t, true)
  // in this one we also snapshot the timers, mostly just as a smoke test
  const timers = {}
  const finishedTimers = []
  const onTime = (level, name) => {
    if (level === 'start') {
      t.notOk(timers[name], 'should not have duplicated timers started')
      timers[name] = true
    } else if (level === 'end') {
      t.ok(timers[name], 'should not end unstarted timer')
      delete timers[name]
      finishedTimers.push(name)
    }
  }
  process.on('time', onTime)

  return reify(path, { omit: ['peer'] })
    .then(tree => {
      for (const node of tree.inventory.values()) {
        t.equal(node.peer, false, 'did not reify any peer nodes')
      }

      const lock = require(tree.path + '/package-lock.json')
      // eslint-disable-next-line promise/always-return
      for (const [loc, meta] of Object.entries(lock.packages)) {
        if (meta.peer) {
          t.throws(() => fs.statSync(resolve(path, loc)), 'peer not reified')
        } else {
          t.equal(fs.statSync(resolve(path, loc)).isDirectory(), true)
        }
      }
    })
  // eslint-disable-next-line promise/always-return
    .then(() => {
      process.removeListener('time', onTime)
      finishedTimers.sort(localeCompare)
      t.matchSnapshot(finishedTimers, 'finished timers')
      t.strictSame(timers, {}, 'should have no timers in progress now')
    })
})

t.test('testing-peer-deps nested', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'testing-peer-deps-nested')))
})

t.test('a workspace with a duplicated nested conflicted dep', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'workspace4')))
})

t.test('testing-peer-deps nested with update', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'testing-peer-deps-nested'), {
    update: { names: ['@isaacs/testing-peer-deps'] },
    save: false,
  }))
})

t.test('update a bundling node without updating all of its deps', t => {
  const path = fixture(t, 'tap-react15-collision-legacy-sw')
  createRegistry(t, true)

  // check that it links the bin
  const bin = resolve(path, 'node_modules/.bin/tap')
  const checkBin = process.platform === 'win32'
    ? () => t.ok(fs.statSync(bin + '.cmd').isFile(), 'created shim')
    : () => t.ok(fs.lstatSync(bin).isSymbolicLink(), 'created symlink')

  const checkPackageLock = () => {
    t.match(require(path + '/package-lock.json').packages['node_modules/fsevents'],
      {
        dev: true,
        optional: true,
      },
      'contains fsevents in lockfile')
  }

  return t.resolveMatchSnapshot(printReified(path, {
    saveType: 'dev',
    add: ['tap@14.10.5'],
    omit: ['optional'],
  }))
    .then(checkBin)
    .then(checkPackageLock)
})

t.test('Bundles rebuilt as long as rebuildBundle not false', async t => {
  t.test('rebuild the bundle', async t => {
    const path = fixture(t, 'testing-rebuild-bundle')
    createRegistry(t, true)
    const a = resolve(path, 'node_modules/@isaacs/testing-rebuild-bundle-a')
    const dir = resolve(a, 'node_modules/@isaacs/testing-rebuild-bundle-b')
    const file = resolve(dir, 'cwd')
    await reify(path)
    t.equal(fs.readFileSync(file, 'utf8'), dir)
  })
  t.test('do not rebuild the bundle', async t => {
    const path = fixture(t, 'testing-rebuild-bundle')
    createRegistry(t, true)
    const a = resolve(path, 'node_modules/@isaacs/testing-rebuild-bundle-a')
    const dir = resolve(a, 'node_modules/@isaacs/testing-rebuild-bundle-b')
    const file = resolve(dir, 'cwd')
    await reify(path, { rebuildBundle: false })
    t.throws(() => fs.statSync(file))
  })
})

t.test('transitive deps containing asymmetrical bin no lockfile', t => {
  const path = fixture(t, 'testing-asymmetrical-bin-no-lock')
  createRegistry(t, true)

  // check that it links the bin
  const bin = resolve(path, 'node_modules/.bin/b')
  const checkBin = process.platform === 'win32'
    ? () => t.ok(fs.statSync(bin + '.cmd').isFile(), 'created shim')
    : () => t.ok(fs.lstatSync(bin).isSymbolicLink(), 'created symlink')

  return t.resolveMatchSnapshot(printReified(path, { packageLock: false }))
    .then(checkBin)
    .then(() => t.throws(() => fs.statSync(path + '/package-lock.json')))
})

t.test('transitive deps containing asymmetrical bin with lockfile', t => {
  const path = fixture(t, 'testing-asymmetrical-bin-with-lock')
  createRegistry(t, true)

  // check that it links the bin
  const bin = resolve(path, 'node_modules/.bin/b')
  const checkBin = process.platform === 'win32'
    ? () => t.ok(fs.statSync(bin + '.cmd').isFile(), 'created shim')
    : () => t.ok(fs.lstatSync(bin).isSymbolicLink(), 'created symlink')

  return t.resolveMatchSnapshot(printReified(path, {}))
    .then(checkBin)
})

t.test('omit optional dep', t => {
  const path = fixture(t, 'tap-react15-collision-legacy-sw')
  createRegistry(t, true)

  const arb = newArb({ path, ignoreScripts: true })
  // eslint-disable-next-line promise/always-return
  return arb.reify({ omit: ['optional'] }).then(tree => {
    t.equal(tree.children.get('fsevents'), undefined, 'no fsevents in tree')
    t.throws(() => fs.statSync(path + '/node_modules/fsevents'), 'no fsevents unpacked')
    t.match(require(path + '/package-lock.json').packages['node_modules/fsevents'], {
      dev: true,
      optional: true,
    }, 'fsevents present in lockfile')
  })
    .then(() => t.ok(arb.diff, 'has a diff tree'))
})

t.test('dev, optional, devOptional flags and omissions', t => {
  const path = 'testing-dev-optional-flags'
  const omits = [['dev'], ['dev', 'optional'], ['optional']]
  t.plan(omits.length)
  omits.forEach(omit => t.test(omit.join(','), async t => {
    createRegistry(t, true)
    await t.resolveMatchSnapshot(printReified(fixture(t, path), {
      omit,
    }))
  }))
})

t.test('omits when both dev and optional flags are set', t => {
  const path = 'testing-dev-optional-flags-2'
  const omits = [['dev'], ['optional']]
  t.plan(omits.length)
  omits.forEach(omit => t.test(omit.join(','), async t => {
    createRegistry(t, true)
    await t.resolveMatchSnapshot(printReified(fixture(t, path), {
      omit,
    }))
  }))
})

t.test('bad shrinkwrap file', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'testing-peer-deps-bad-sw')))
})

t.test('multiple bundles at the same level', t => {
  const path = fixture(t, 'two-bundled-deps')
  createRegistry(t, true)
  const a = newArb({ path })
  return a.reify().then(tree => {
    const root = tree.root
    const p = printTree(tree)
    // just fail on the failures, we don't need a zillion tap lines here
    for (const n of tree.inventory.values()) {
      if (n.root !== root) {
        t.equal(n.root, root, 'in same tree')
      } else {
        for (const e of n.edgesIn) {
          if (e.from.root !== root) {
            t.equal(e.from.root, root,
              `edge in same tree ${e.from.location} -> ${n.location}`)
          }
        }
      }
    }
    return t.matchSnapshot(p)
  })
})

t.test('update a node without updating its children', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'once-outdated'),
    { update: { names: ['once'] }, save: false }))
})

t.test('do not add shrinkwrapped deps', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(
    fixture(t, 'shrinkwrapped-dep-no-lock'), { update: true }))
})

t.test('do not update shrinkwrapped deps', async t => {
  createRegistry(t, false)
  await t.resolveMatchSnapshot(printReified(
    fixture(t, 'shrinkwrapped-dep-with-lock'),
    { update: { names: ['abbrev'] } }))
})

t.test('tracks changes of shrinkwrapped dep correctly', async t => {
  const path = t.testdir({ 'package.json': '{}' })
  createRegistry(t, true)

  const install1 = await printReified(path, { add: ['@nlf/shrinkwrapped-dep-updates-a@1.0.0'] })
  t.matchSnapshot(install1, 'install added the correct tree')

  const update1 = await printReified(path, { update: true })
  t.match(install1, update1, 'update maintains the same correct tree')

  const install2 = await printReified(path, { add: ['@nlf/shrinkwrapped-dep-updates-a@2.0.0'] })
  t.matchSnapshot(install2, 'installing new version brings in the correct children')

  const update2 = await printReified(path, { update: true })
  t.match(install2, update2, 'update maintains the same correct tree')

  // delete a dependency that was installed as part of the shrinkwrap
  fs.rmSync(resolve(path, 'node_modules/@nlf/shrinkwrapped-dep-updates-a/node_modules/@nlf/shrinkwrapped-dep-updates-b'), { recursive: true, force: true })
  const repair = await printReified(path)
  t.match(repair, install2, 'tree got repaired')
})

t.test('do not install optional deps with mismatched platform specifications', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'optional-platform-specification')))
})

t.test('still do not install optional deps with mismatched platform specifications even when forced', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'optional-platform-specification'), { force: true }))
})

t.test('fail to install deps with mismatched platform specifications', async t => {
  createRegistry(t, true)
  await t.rejects(printReified(fixture(t, 'platform-specification')), { code: 'EBADPLATFORM' })
})

t.test('success to install optional deps with matched platform specifications with os and cpu and libc options', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(
    fixture(t, 'optional-platform-specification'), { os: 'not-your-os', cpu: 'not-your-cpu', libc: 'not-your-libc' }))
})

t.test('fail to install optional deps with matched os and mismatched cpu with os and cpu and libc options', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(
    fixture(t, 'optional-platform-specification'), { os: 'not-your-os', cpu: 'another-cpu', libc: 'not-your-libc' }))
})

t.test('fail to install optional deps with mismatched os and matched cpu with os and cpu and libc options', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(
    fixture(t, 'optional-platform-specification'), { os: 'another-os', cpu: 'not-your-cpu', libc: 'not-your-libc' }))
})

t.test('fail to install optional deps with matched os and matched cpu and mismatched libc with os and cpu and libc options', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(
    fixture(t, 'optional-platform-specification'), { os: 'another-os', cpu: 'not-your-cpu', libc: 'not-your-libc' }))
})

t.test('dry run, do not get anything wet', async t => {
  const cases = [
    ['shrinkwrapped-dep-with-lock-empty', false],
    ['shrinkwrapped-dep-no-lock-empty', true],
    ['link-dep-empty', false],
    ['link-meta-deps-empty', true],
    ['testing-bundledeps-empty', true],
  ]
  t.plan(cases.length)
  for (const [c, mocks] of cases) {
    await t.test(c, async t => {
      const path = fixture(t, c)
      createRegistry(t, mocks)
      const arb = newArb({ path, dryRun: true })
      t.matchSnapshot(printTree(await arb.reify()))
      t.throws(() => fs.statSync(resolve(path, 'node_modules')))
      t.ok(arb.diff)
    })
  }
})

t.test('reifying with shronk warp dep', t => {
  const cases = [
    ['shrinkwrapped-dep-with-lock', false],
    ['shrinkwrapped-dep-with-lock-empty', true],
    ['shrinkwrapped-dep-no-lock', true],
    ['shrinkwrapped-dep-no-lock-empty', true],
  ]
  t.plan(cases.length)
  for (const [c, mocks] of cases) {
    t.test(c, async t => {
      const path = fixture(t, c)
      createRegistry(t, mocks)
      const tree = await printReified(path, {
        // set update so that we don't start the idealTree
        // with the actualTree, and can see that the deps
        // are indeed getting set up from the shrink wrap
        update: /no-lock/.test(c),
      })
      t.matchSnapshot(tree)
      const dep = `${path}/node_modules/@isaacs/shrinkwrapped-dependency`
      t.equal(fs.statSync(`${dep}/package.json`).isFile(), true, 'has package.json')
    })
  }
})

t.test('link deps already in place', async t => {
  createRegistry(t, false)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'link-dep')))
})

t.test('create link deps', async t => {
  createRegistry(t, false)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'link-dep-empty')))
})

t.test('link meta deps, fresh install', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'link-meta-deps-empty')))
})

t.test('link meta deps, update', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(fixture(t, 'link-meta-deps'), {
    // use legacy nesting so we leave the link nested
    legacyNesting: true,
    add: [
      '@isaacs/testing-link-dep@2',
      '@isaacs/testing-link-dev-dep@2',
    ],
  }))
})

t.test('update a child of a node with bundled deps', async t => {
  const path = fixture(t, 'testing-bundledeps-legacy-bundling')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(path, {
    update: ['@isaacs/testing-bundledeps-c'],
    installStrategy: 'nested',
  }))
})

t.test('update a node without updating a child that has bundle deps', async t => {
  const path = fixture(t, 'testing-bundledeps-3')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printReified(path, {
    update: ['@isaacs/testing-bundledeps-parent'],
    save: false,
  }))
})

t.test('optional dependency failures', async t => {
  const cases = [
    'optional-dep-tgz-missing',
    'optional-metadep-tgz-missing',
    'optional-dep-preinstall-fail',
    'optional-dep-install-fail',
    'optional-dep-postinstall-fail',
    'optional-dep-allinstall-fail',
    'optional-metadep-preinstall-fail',
    'optional-metadep-install-fail',
    'optional-metadep-postinstall-fail',
    'optional-metadep-allinstall-fail',
  ]
  // t.plan(cases.length * 2)
  for (const c of cases) {
    await t.test(`${c} save=false`, async t => {
      createRegistry(t, true)
      await t.resolveMatchSnapshot(printReified(fixture(t, c),
        { update: true, save: false }))
    })
    // npm update --save
    await t.test(`${c} save=true`, async t => {
      createRegistry(t, true)
      await t.resolveMatchSnapshot(printReified(fixture(t, c),
        { update: true, save: true }))
    })
  }
})

t.test('failure to fetch prod dep is failure', async t => {
  createRegistry(t, true)
  t.rejects(printReified(fixture(t, 'prod-dep-tgz-missing')))
})

t.test('failing script means install failure, unless ignoreScripts', async t => {
  const cases = [
    'prod-dep-preinstall-fail',
    'prod-dep-install-fail',
    'prod-dep-postinstall-fail',
    'prod-dep-allinstall-fail',
  ]

  for (const c of cases) {
    await t.test(c, async t => {
      createRegistry(t, true)
      t.rejects(printReified(fixture(t, c)))
    })
    await t.test(`${c} --ignore-scripts`, async t => {
      createRegistry(t, true)
      await t.resolveMatchSnapshot(printReified(
        fixture(t, c), { ignoreScripts: true }))
    })
  }
})

t.test('link metadep', async t => {
  const cases = [
    'cli-750',
    'cli-750-fresh',
  ]
  for (const c of cases) {
    createRegistry(t, false)
    await t.test(c, async t => {
      t.resolveMatchSnapshot(printReified(fixture(t, c)))
    })
  }
})

t.test('warn on reifying deprecated dependency', t => {
  createRegistry(t, true)
  const a = newArb({
    path: fixture(t, 'deprecated-dep'),
    lockfileVersion: 1,
  })
  const check = warningTracker()
  return a.reify({ update: true }).then(() => t.match(check(), [
    [
      'warn',
      'deprecated',
      'mkdirp@0.5.3: Legacy versions of mkdirp are no longer supported. ' +
      'Please update to mkdirp 1.x. (Note that the API surface has changed ' +
      'to use Promises in 1.x.)',
    ],
  ]))
})

t.test('rollbacks', { buffered: false }, t => {
  t.test('fail retiring shallow nodes', t => {
    const path = fixture(t, 'testing-bundledeps-3')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const expect = new Error('rename fail')
    const kRenamePath = Symbol.for('renamePath')
    const renamePath = a[kRenamePath]
    a[kRenamePath] = (from, to) => {
      a[kRenamePath] = renamePath
      failRename = expect
      return a[kRenamePath](from, to)
    }
    const kRollback = Symbol.for('rollbackRetireShallowNodes')
    const rollbackRetireShallowNodes = a[kRollback]
    let rolledBack = false
    a[kRollback] = er => {
      rolledBack = true
      failRename = null
      t.equal(er, expect)
      a[kRollback] = rollbackRetireShallowNodes
      return a[kRollback](er)
    }

    return t.rejects(a.reify({
      update: ['@isaacs/testing-bundledeps-parent'],
    }), expect).then(() => t.equal(rolledBack, true, 'rolled back'))
  })

  t.test('fail retiring nodes because rm fails after eexist', t => {
    const path = fixture(t, 'testing-bundledeps-3')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const eexist = new Error('rename fail')
    eexist.code = 'EEXIST'
    const kRenamePath = Symbol.for('renamePath')
    const renamePath = a[kRenamePath]
    a[kRenamePath] = (from, to) => {
      a[kRenamePath] = renamePath
      failRename = eexist
      failRm = true
      return a[kRenamePath](from, to)
    }
    const kRollback = Symbol.for('rollbackRetireShallowNodes')
    const rollbackRetireShallowNodes = a[kRollback]
    let rolledBack = false
    a[kRollback] = er => {
      rolledBack = true
      failRename = new Error('some other error')
      failRm = false
      t.match(er, new Error('rm fail'))
      a[kRollback] = rollbackRetireShallowNodes
      return a[kRollback](er).then(er => {
        failRename = null
        return er
      }, er => {
        failRename = null
        throw er
      })
    }

    return t.rejects(a.reify({
      update: ['@isaacs/testing-bundledeps-parent'],
    }), new Error('rm fail'))
      .then(() => t.equal(rolledBack, true, 'rolled back'))
  })

  t.test('fail retiring node, but then rm fixes it', async t => {
    const path = fixture(t, 'testing-bundledeps-3')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const eexist = new Error('rename fail')
    eexist.code = 'EEXIST'
    const kRenamePath = Symbol.for('renamePath')
    const renamePath = a[kRenamePath]
    a[kRenamePath] = (from, to) => {
      a[kRenamePath] = renamePath
      failRenameOnce = eexist
      return a[kRenamePath](from, to)
    }
    const kRollback = Symbol.for('rollbackRetireShallowNodes')
    const rollbackRetireShallowNodes = a[kRollback]
    a[kRollback] = er => {
      t.fail('should not roll back!')
      a[kRollback] = rollbackRetireShallowNodes
      return a[kRollback](er)
    }

    const tree = await a.reify({
      update: ['@isaacs/testing-bundledeps-parent'],
      save: false,
    })
    return printTree(tree)
  })

  t.test('fail creating sparse tree', t => {
    t.teardown(() => failMkdir = null)
    const path = fixture(t, 'testing-bundledeps-3')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const kCreateST = Symbol.for('createSparseTree')
    const createSparseTree = a[kCreateST]
    a[kCreateST] = () => {
      a[kCreateST] = createSparseTree
      failMkdir = new Error('poop')
      return a[kCreateST]()
    }
    const kRollback = Symbol.for('rollbackCreateSparseTree')
    const rollbackCreateSparseTree = a[kRollback]
    a[kRollback] = er => {
      t.match(er, new Error('poop'))
      a[kRollback] = rollbackCreateSparseTree
      return a[kRollback](er)
    }

    return t.rejects(a.reify({
      update: ['@isaacs/testing-bundledeps-parent'],
    }).then(() => 'it worked'), new Error('poop'))
  })

  t.test('fail rolling back from creating sparse tree', t => {
    failMkdir = null
    failRm = null
    const path = fixture(t, 'testing-bundledeps-3')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })

    const kCreateST = Symbol.for('createSparseTree')
    const kRetireShallowNodes = Symbol.for('retireShallowNodes')
    const retireShallowNodes = a[kRetireShallowNodes]
    a[kRetireShallowNodes] = async () => {
      a[kRetireShallowNodes] = retireShallowNodes
      await a[kRetireShallowNodes]()
      failRm = true
    }
    const createSparseTree = a[kCreateST]
    t.teardown(() => failMkdir = null)
    a[kCreateST] = () => {
      a[kCreateST] = createSparseTree
      failMkdir = new Error('poop')
      return a[kCreateST]()
    }
    const kRollback = Symbol.for('rollbackCreateSparseTree')
    const rollbackCreateSparseTree = a[kRollback]
    a[kRollback] = er => {
      t.match(er, new Error('poop'))
      a[kRollback] = rollbackCreateSparseTree
      return a[kRollback](er)
    }

    const check = warningTracker()
    return t.rejects(a.reify({
      update: ['@isaacs/testing-bundledeps-parent'],
    }).then(() => 'it worked'), new Error('poop'))
    // eslint-disable-next-line promise/always-return
      .then(() => {
        const warnings = check()
        t.equal(warnings.length, 2)
        t.match(warnings, [
          oldLockfileWarning,
          [
            'warn',
            'cleanup',
            'Failed to remove some directories',
            [[String, new Error('rm fail')]],
          ],
        ])
      })
      .then(() => failRm = false)
  })

  t.test('fail loading shrinkwraps and updating trees', t => {
    const path = fixture(t, 'shrinkwrapped-dep-no-lock-empty')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const kLoadSW = Symbol.for('loadShrinkwrapsAndUpdateTrees')
    const loadShrinkwrapsAndUpdateTrees = a[kLoadSW]
    a[kLoadSW] = seen => {
      a[kLoadSW] = loadShrinkwrapsAndUpdateTrees
      const kDiff = Symbol.for('diffTrees')
      const diffTrees = a[kDiff]
      a[kDiff] = () => {
        a[kDiff] = diffTrees
        return Promise.reject(new Error('poop'))
      }
      return a[kLoadSW](seen)
    }
    const kRollback = Symbol.for('rollbackCreateSparseTree')
    const rollbackCreateSparseTree = a[kRollback]
    a[kRollback] = er => {
      t.match(er, new Error('poop'))
      a[kRollback] = rollbackCreateSparseTree
      return a[kRollback](er)
    }

    return t.rejects(a.reify(), new Error('poop'))
  })

  t.test('fail loading bundles and updating trees', t => {
    const path = fixture(t, 'two-bundled-deps')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const kLoadBundles = Symbol.for('loadBundlesAndUpdateTrees')
    const loadBundlesAndUpdateTrees = a[kLoadBundles]
    a[kLoadBundles] = (depth, bundlesByDepth) => {
      const kRN = Symbol.for('reifyNode')
      const reifyNode = a[kRN]
      a[kRN] = () => {
        a[kRN] = reifyNode
        return Promise.reject(new Error('poop'))
      }
      a[kLoadBundles] = loadBundlesAndUpdateTrees
      return a[kLoadBundles](depth, bundlesByDepth)
    }
    return t.rejects(a.reify(), new Error('poop'))
  })

  t.test('fail unpacking new modules', t => {
    const path = fixture(t, 'two-bundled-deps')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const kUnpack = Symbol.for('unpackNewModules')
    const unpackNewModules = a[kUnpack]
    a[kUnpack] = () => {
      const kReify = Symbol.for('reifyNode')
      const reifyNode = a[kReify]
      a[kReify] = () => {
        a[kReify] = reifyNode
        return Promise.reject(new Error('poop'))
      }
      a[kUnpack] = unpackNewModules
      return a[kUnpack]()
    }
    return t.rejects(a.reify(), new Error('poop'))
  })

  t.test('fail moving back retired unchanged', t => {
    const path = fixture(t, 'testing-bundledeps-3')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const kMoveback = Symbol.for('moveBackRetiredUnchanged')

    const moveBackRetiredUnchanged = a[kMoveback]
    a[kMoveback] = () => {
      a[kMoveback] = moveBackRetiredUnchanged
      const kMoveContents = Symbol.for('moveContents')
      const moveContents = a[kMoveContents]
      a[kMoveContents] = () => {
        a[kMoveContents] = moveContents
        return Promise.reject(new Error('poop'))
      }
      return a[kMoveback]()
    }
    const kRollback = Symbol.for('rollbackMoveBackRetiredUnchanged')
    const rollbackMoveBackRetiredUnchanged = a[kRollback]
    a[kRollback] = er => {
      t.match(er, new Error('poop'))
      a[kRollback] = rollbackMoveBackRetiredUnchanged
      return a[kRollback](er)
    }
    return t.rejects(a.reify({
      update: ['@isaacs/testing-bundledeps-parent'],
    }), new Error('poop'))
  })

  t.test('fail removing retired and deleted nodes', t => {
    const path = fixture(t, 'testing-bundledeps-3')
    createRegistry(t, true)
    const a = newArb({ path, installStrategy: 'nested' })
    const kRemove = Symbol.for('removeTrash')
    const removeRetiredAndDeletedNodes = a[kRemove]
    a[kRemove] = () => {
      failRm = true
      a[kRemove] = removeRetiredAndDeletedNodes
      return a[kRemove]()
    }
    const check = warningTracker()

    return t.resolveMatchSnapshot(a.reify({
      update: ['@isaacs/testing-bundledeps-parent'],
      save: false,
      // eslint-disable-next-line promise/always-return
    }).then(tree => printTree(tree))).then(() => {
      const warnings = check()
      t.equal(warnings.length, 2)
      t.match(warnings, [
        oldLockfileWarning,
        [
          'warn',
          'cleanup',
          'Failed to remove some directories',
          [[String, new Error('rm fail')]],
        ],
      ])
    })
      .then(() => failRm = false)
  })

  t.end()
})

t.test('saving the ideal tree', t => {
  const kSaveIdealTree = Symbol.for('saveIdealTree')
  t.test('save=false', async t => {
    createRegistry(t, false)
    // doesn't actually do anything, just for coverage.
    // if it wasn't an early exit, it'd blow up and throw
    // an error though.
    const path = t.testdir()
    const a = newArb({ path })
    t.notOk(await a[kSaveIdealTree]({ save: false }))
  })

  t.test('save some stuff', t => {
    createRegistry(t, false)
    const pkg = {
      bundleDependencies: ['a', 'b', 'c'],
      dependencies: {
        a: 'git+ssh://git@github.com:foo/bar#baz',
        b: '',
        d: 'npm:c@1.x <1.9.9',
        e: '*',
        f: 'git+https://user:pass@github.com/baz/quux#asdf',
        g: '',
        h: '~1.2.3',
      },
      devDependencies: {
        c: `git+ssh://git@githost.com:a/b/c.git#master`,
      },
      workspaces: [
        'e',
      ],
    }

    const npa = require('npm-package-arg')
    const kResolvedAdd = Symbol.for('resolvedAdd')
    const path = t.testdir({
      'package.json': JSON.stringify(pkg),
      e: {
        'package.json': JSON.stringify({ name: 'e' }),
      },
      node_modules: {
        e: t.fixture('symlink', '../e'),
      },
    })
    const a = newArb({ path })
    const hash = '71f3ccfefba85d2048484569dba8c1829f6f41d7'
    return a.loadActual().then(tree => Shrinkwrap.load({ path }).then(meta => {
      tree.meta = meta
      meta.add(tree)
      return tree
    })).then(async tree => {
      // saving swaps the ideal tree onto the actual tree
      a.idealTree = tree

      // simulated child nodes
      // Note: these all show up as "extraneous" in the lockfile,
      // because we don't do the calcDepFlags step in this simulation,
      // but since we're only testing the saving step, that's fine.
      new Node({
        name: 'a',
        resolved: `git+ssh://git@github.com:foo/bar#${hash}`,
        parent: tree,
        pkg: {},
      })
      new Node({
        name: 'b',
        resolved: 'https://registry.npmjs.org/b/-/b-1.2.3.tgz',
        pkg: { version: '1.2.3', name: 'b' },
        parent: tree,
      })
      new Node({
        name: 'c',
        resolved: `git+ssh://git@githost.com:a/b/c.git#${hash}`,
        parent: tree,
        pkg: {},
      })
      new Node({
        name: 'd',
        resolved: 'https://registry.npmjs.org/c/-/c-1.2.3.tgz',
        pkg: {
          name: 'c',
          version: '1.2.3',
        },
        parent: tree,
      })
      new Node({
        name: 'f',
        resolved: `git+https://user:pass@github.com/baz/quux#${hash}`,
        pkg: {
          name: 'f',
          version: '1.2.3',
        },
        parent: tree,
      })
      new Node({
        name: 'g',
        resolved: 'https://registry.npmjs.org/g/-/g-1.2.3.tgz',
        pkg: {
          name: 'g', // no version, somehow
        },
        parent: tree,
      })
      new Node({
        name: 'h',
        resolved: 'https://registry.npmjs.org/h/-/h-1.2.3.tgz',
        pkg: {
          name: 'h',
          version: '1.2.3',
        },
        parent: tree,
      })

      const target = new Node({
        name: 'e',
        pkg: {
          name: 'e',
        },
        path: resolve(tree.path, 'e'),
        fsParent: tree,
      })
      new Link({
        name: 'e',
        realpath: target.path,
        path: resolve(tree.path, 'node_modules/e'),
        resolved: 'file:../e',
        pkg: {
          name: 'e',
        },
      })

      a[kResolvedAdd] = [
        npa('a@git+ssh://git@github.com:foo/bar#baz'),
        npa('b'),
        npa('d@npm:c@1.x <1.9.9'),
        npa('c@git+ssh://git@githost.com:a/b/c.git#master'),
        npa('e'),
        npa('f@git+https://user:pass@github.com/baz/quux#asdf'),
        npa('g'),
        npa('h@~1.2.3'),
      ].map(spec => Object.assign(spec, { tree }))

      // NB: these are all going to be marked as extraneous, because we're
      // skipping the actual buildIdealTree step that flags them properly
      return a[kSaveIdealTree]({})
      // eslint-disable-next-line promise/always-return
    }).then(saved => {
      t.ok(saved, 'true, because it was saved')
      t.matchSnapshot(require(path + '/package-lock.json'), 'lock after save')
      t.strictSame(require(path + '/package.json'), {
        bundleDependencies: ['a', 'b', 'c'],
        dependencies: {
          a: 'github:foo/bar#baz',
          b: '^1.2.3',
          d: 'npm:c@1.x <1.9.9',
          e: '*',
          f: 'git+https://user:pass@github.com/baz/quux.git#asdf',
          g: '*',
          h: '~1.2.3',
        },
        workspaces: [
          'e',
        ],
        devDependencies: {
          c: 'git+ssh://git@githost.com:a/b/c.git#master',
        },
      })
    })
  })

  t.end()
})

t.test('scoped registries', async t => {
  const path = t.testdir()

  // TODO
  // this is a very artifical test that is setting a lot of internal things
  // up so that we assert that the intended behavior of sending right
  // resolved data for pacote.extract is working as intended, alternatively
  // we might prefer to replace this with a proper parallel alternative
  // registry server so that we can have more of an integration test instead
  let sawPacoteExtract = false
  const pacote = {
    extract: res => {
      sawPacoteExtract = true
      t.matchSnapshot(
        res,
        'should preserve original resolved value'
      )
      return true
    },
  }
  const ArboristMock = t.mock('../../lib/arborist', {
    ...mocks,
    pacote,
  })
  const a = new ArboristMock({
    audit: false,
    path,
    cache: path,
  })
  const kReify = Symbol.for('reifyNode')
  a.addTracker('reify')
  a.idealTree = new Node({ path })

  const node = new Node({
    name: '@ruyadorno/theoretically-private-pkg',
    resolved: 'https://npm.pkg.github.com/@ruyadorno/' +
      'theoretically-private-pkg/-/theoretically-private-pkg-1.2.3.tgz',
    pkg: { version: '1.2.3', name: '@ruyadorno/theoretically-private-pkg' },
    parent: a.idealTree,
  })
  await a[kReify](node)
  t.equal(sawPacoteExtract, true, 'saw pacote extraction')
})

t.test('bin links adding and removing', t => {
  const path = t.testdir({
    'package.json': JSON.stringify({}),
  })
  const rbin = resolve(path, 'node_modules/.bin/rimraf')
  return reify(path, { add: ['rimraf@2.7.1'] })
    .then(() => fs.statSync(rbin)) // should be there
    .then(() => reify(path, { rm: ['rimraf'] }))
    .then(() => t.throws(() => fs.statSync(rbin))) // should be gone
})

t.test('global style', t => {
  const path = t.testdir()
  createRegistry(t, true)
  const nm = resolve(path, 'node_modules')
  const rbinPart = '.bin/rimraf' +
    (process.platform === 'win32' ? '.cmd' : '')
  const rbin = resolve(nm, rbinPart)
  return reify(path, { add: ['rimraf@2'], installStrategy: 'shallow' })
    .then(() => fs.statSync(rbin))
    .then(() => t.strictSame(fs.readdirSync(nm).sort(), ['.bin', '.package-lock.json', 'rimraf']))
})

t.test('global', async t => {
  const isWindows = process.platform === 'win32'

  const path = t.testdir({ lib: {} })
  const lib = resolve(path, 'lib')
  const nm = resolve(lib, 'node_modules')

  const binTarget = isWindows ? lib : resolve(path, 'bin')
  const rimrafBin = resolve(binTarget, isWindows ? 'rimraf.cmd' : 'rimraf')
  const semverBin = resolve(binTarget, isWindows ? 'semver.cmd' : 'semver')

  await t.test('add rimraf', async t => {
    createRegistry(t, true)
    await reify(lib, { add: ['rimraf@2'], global: true })
      .then(() => fs.statSync(rimrafBin))
      .then(() => t.strictSame(fs.readdirSync(nm), ['rimraf']))
  })

  await t.test('add semver', async t => {
    createRegistry(t, true)
    await reify(lib, { add: ['semver@6.3.0'], global: true })
      .then(() => fs.statSync(rimrafBin))
      .then(() => fs.statSync(semverBin))
      .then(() => t.strictSame(fs.readdirSync(nm).sort(), ['rimraf', 'semver']))
  })

  await t.test('remove semver', async t => {
    createRegistry(t, false)
    await reify(lib, { rm: ['semver'], global: true })
      .then(() => fs.statSync(rimrafBin))
      .then(() => t.throws(() => fs.statSync(semverBin)))
      .then(() => t.strictSame(fs.readdirSync(nm), ['rimraf']))
  })

  await t.test('remove rimraf', async t => {
    createRegistry(t, false)
    await reify(lib, { rm: ['rimraf'], global: true })
      .then(() => t.throws(() => fs.statSync(rimrafBin)))
      .then(() => t.throws(() => fs.statSync(semverBin)))
      .then(() => t.strictSame(fs.readdirSync(nm), []))
  })

  await t.test('add without bin links', async t => {
    createRegistry(t, true)
    await reify(lib, { add: ['rimraf@2'], global: true, binLinks: false })
      .then(() => t.throws(() => fs.statSync(rimrafBin)))
      .then(() => t.throws(() => fs.statSync(semverBin)))
      .then(() => t.strictSame(fs.readdirSync(nm), ['rimraf']))
  })
})

t.test('workspaces', async t => {
  await t.test('reify simple-workspaces', async t => {
    createRegistry(t, false)
    await t.resolveMatchSnapshot(printReified(fixture(t, 'workspaces-simple')), 'should reify simple workspaces')
  })

  await t.test('reify workspaces omit dev dependencies', async t => {
    const runCase = async (t, opts) => {
      const path = fixture(t, 'workspaces-conflicting-dev-deps')
      const rootAjv = resolve(path, 'node_modules/ajv/package.json')
      const ajvOfPkgA = resolve(path, 'a/node_modules/ajv/package.json')
      const ajvOfPkgB = resolve(path, 'b/node_modules/ajv/package.json')

      t.equal(fs.existsSync(rootAjv), true, 'root ajv exists')
      t.equal(fs.existsSync(ajvOfPkgA), true, 'ajv under package a node_modules exists')
      t.equal(fs.existsSync(ajvOfPkgB), true, 'ajv under package a node_modules exists')

      await reify(path, { omit: ['dev'], ...opts })

      return {
        root: { exists: () => fs.existsSync(rootAjv) },
        a: { exists: () => fs.existsSync(ajvOfPkgA) },
        b: { exists: () => fs.existsSync(ajvOfPkgB) },
      }
    }

    await t.test('default', async t => {
      createRegistry(t, false)
      const { root, a, b } = await runCase(t)
      t.equal(root.exists(), false, 'root')
      t.equal(a.exists(), false, 'a')
      t.equal(b.exists(), false, 'b')
    })

    await t.test('workspaces only', async t => {
      createRegistry(t, false)
      const { root, a, b } = await runCase(t, { workspaces: ['a'] })
      t.equal(root.exists(), false, 'root')
      t.equal(a.exists(), false, 'a')
      t.equal(b.exists(), true, 'b')
    })

    await t.test('workspaces + root', async t => {
      createRegistry(t, false)
      const { root, a, b } = await runCase(t, { workspaces: ['a'], includeWorkspaceRoot: true })
      t.equal(root.exists(), false, 'root')
      t.equal(a.exists(), false, 'a')
      t.equal(b.exists(), true, 'b')
    })

    await t.test('disable workspaces', async t => {
      createRegistry(t, false)
      const { root, a, b } = await runCase(t, { workspacesEnabled: false })
      t.equal(root.exists(), false, 'root')
      t.equal(a.exists(), true, 'a')
      t.equal(b.exists(), true, 'b')
    })
  })

  await t.test('reify workspaces lockfile', async t => {
    const path = fixture(t, 'workspaces-simple')
    createRegistry(t, false)
    await reify(path)
    t.matchSnapshot(require(path + '/package-lock.json'), 'should lock workspaces config')
  })

  await t.test('reify workspaces bin files', t => {
    const path = fixture(t, 'workspaces-link-bin')
    createRegistry(t, false)

    const bins = [
      resolve(path, 'node_modules/.bin/a'),
      resolve(path, 'node_modules/.bin/b'),
    ]

    const checkBin = () => {
      for (const bin of bins) {
        if (process.platform === 'win32') {
          t.ok(fs.statSync(bin + '.cmd').isFile(), 'created shim')
        } else {
          t.ok(fs.lstatSync(bin).isSymbolicLink(), 'created symlink')
        }
      }
    }

    return t.resolveMatchSnapshot(printReified(path, {}))
      .then(checkBin)
  })

  await t.test('reify from an actual loaded workspace env', async t => {
    createRegistry(t, false)
    await t.resolveMatchSnapshot(
      printReified(fixture(t, 'workspaces-non-simplistic')),
      'should not clean up entire nm folder for no reason'
    )
  })

  await t.test('add new workspaces dep', async t => {
    createRegistry(t, true)
    const path = fixture(t, 'workspaces-add-new-dep')
    await reify(path)
    t.matchSnapshot(require(path + '/package-lock.json'), 'should update package-lock with new added dep')
  })

  await t.test('root as-a-workspace', async t => {
    createRegistry(t, true)
    const path = fixture(t, 'workspaces-root-linked')
    await reify(path)
    t.matchSnapshot(require(path + '/package-lock.json'), 'should produce expected package-lock file')
  })
})

t.test('reify from old package-lock with bins', async t => {
  const path = fixture(t, 'old-package-lock-with-bins')
  createRegistry(t, true)
  await reify(path, {})

  t.matchSnapshot(
    require(resolve(path, 'package-lock.json')),
    'should add bins entry to package-lock packages entry'
  )

  const bin = resolve(path, 'node_modules/.bin/ruy')
  if (process.platform === 'win32') {
    t.ok(fs.statSync(`${bin}.cmd`).isFile(), 'created shim')
  } else {
    t.ok(fs.lstatSync(bin).isSymbolicLink(), 'created symlink')
  }
})

t.test('fail early if bins will conflict', async t => {
  const path = t.testdir({
    lib: {
      'semver.cmd': 'this is not the linked bin',
    },
    bin: {
      semver: 'this is not the linked bin',
    },
  })
  createRegistry(t, true)
  const arb = newArb({
    global: true,
    path: `${path}/lib`,
  })
  arb.rebuild = async () => {
    throw Object.assign(new Error('nope'), { code: 'NOPE' })
  }
  await t.rejects(arb.reify({ add: ['semver'] }), { code: 'EEXIST' })
})

t.test('add a dep present in the tree, with v1 shrinkwrap', async t => {
  // https://github.com/npm/arborist/issues/70
  const path = fixture(t, 'old-package-lock')
  createRegistry(t, true)
  await reify(path, { add: ['wrappy'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('store files with a custom indenting', async t => {
  const tabIndentedPackageJson =
    fs.readFileSync(
      resolve(__dirname, '../fixtures/tab-indented-package-json/package.json'),
      'utf8'
    ).replace(/\r\n/g, '\n')
  const path = t.testdir({
    'package.json': tabIndentedPackageJson,
  })
  createRegistry(t, true)
  await reify(path)
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
  t.matchSnapshot(fs.readFileSync(path + '/package-lock.json', 'utf8'))
})

t.test('do not rewrite valid package.json shorthands', async t => {
  const path = fixture(t, 'package-json-shorthands')
  createRegistry(t, false)
  await reify(path)
  const res = require(path + '/package.json')
  t.equal(res.bin, './index.js', 'should not rewrite bin property')
  t.equal(res.funding, 'https://example.com', 'should not rewrite funding')
})

t.test('modules bundled by the root should be installed', async t => {
  const path = fixture(t, 'root-bundler')
  createRegistry(t, false)
  await reify(path)
  t.matchSnapshot(fs.readFileSync(path + '/node_modules/child/package.json', 'utf8'))
})

t.test('add a new pkg to a prefix that needs to be mkdirpd', async t => {
  await t.test('not dry run', async t => {
    const path = resolve(t.testdir(), 'missing/path/to/root')
    createRegistry(t, true)
    const tree = await reify(path, { add: ['abbrev'] })
    t.matchSnapshot(
      printTree(tree),
      'should output a successful tree in mkdirp folder'
    )
    t.matchSnapshot(
      fs.readFileSync(path + '/package.json', 'utf8'),
      'should place expected package.json file into place'
    )
    t.matchSnapshot(
      fs.readFileSync(path + '/package-lock.json', 'utf8'),
      'should place expected lockfile file into place'
    )
  })

  await t.test('dry run scenarios', async t => {
    const path = resolve(t.testdir(), 'missing/path/to/root')
    createRegistry(t, false)

    try {
      await reify(path, { add: ['abbrev'], dryRun: true })
    } catch (e) {
      // TODO: should this be throwing?
    }

    t.throws(() =>
      fs.statSync(resolve(path, 'node_modules')), { code: 'ENOENT' })

    t.throws(() =>
      fs.statSync(resolve(path, 'package.json')), { code: 'ENOENT' })
  })
})

t.test('do not delete root-bundled deps in global update', async t => {
  const path = t.testdir()
  createRegistry(t, false)
  const file = resolve(__dirname, '../fixtures/bundle.tgz')
  await reify(path, { global: true, add: [`file:${file}`] })
  const depPJ = resolve(path, 'node_modules/bundle/node_modules/dep/package.json')
  t.matchSnapshot(fs.readFileSync(depPJ, 'utf8'), 'after first install')
  await reify(path, { global: true, add: [`file:${file}`] })
  t.matchSnapshot(fs.readFileSync(depPJ, 'utf8'), 'after second install')
})

t.test('do not excessively duplicate bundled metadeps', async t => {
  const path = fixture(t, 'bundle-metadep-duplication')
  createRegistry(t, true)
  const tree = await reify(path)
  const hidden = path + '/node_modules/.package-lock.json'
  t.matchSnapshot(fs.readFileSync(hidden, 'utf8'), 'hidden lockfile')
  const plock = path + '/package-lock.json'
  t.matchSnapshot(fs.readFileSync(plock, 'utf8'), 'normal lockfile')
  t.matchSnapshot(printTree(tree), 'tree')
})

t.test('do not reify root when root matches duplicated metadep', async t => {
  const path = fixture(t, 'test-root-matches-metadep')
  createRegistry(t, true)
  await reify(path)
  fs.statSync(path + '/do-not-delete-this-file')
})

t.test('reify properly with all deps when lockfile is ancient', async t => {
  const path = fixture(t, 'sax')
  createRegistry(t, true)
  const tree = await reify(path)
  t.matchSnapshot(printTree(tree))
  fs.statSync(path + '/node_modules/tap/node_modules/.bin/nyc')
})

t.test('add multiple pkgs in a specific order', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'multiple-pkgs',
    }),
  })
  createRegistry(t, true)
  await reify(path, { add: ['wrappy', 'abbrev'] })
  t.matchSnapshot(
    fs.readFileSync(path + '/package.json', 'utf8'),
    'should alphabetically sort dependencies'
  )
  await reify(path, { add: ['once'] })
  t.matchSnapshot(
    fs.readFileSync(path + '/package.json', 'utf8'),
    'should alphabetically sort new added dep'
  )
})

t.test('save complete lockfile on update-all', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'save-package-lock-after-update-test',
      version: '1.0.0',
    }),
  })
  createRegistry(t, true)
  // install the older version first
  const lock = () => fs.readFileSync(`${path}/package-lock.json`, 'utf8')
  await reify(path, { add: ['abbrev@1.0.4'] })
  t.matchSnapshot(lock(), 'should have abbrev 1.0.4')
  await reify(path, { update: true, save: false })
  t.matchSnapshot(lock(), 'should update, but not drop root metadata')
})

t.test('save proper lockfile with bins when upgrading lockfile', async t => {
  for (const complete of [true, false]) {
    await t.test(`complete=${complete}`, async t => {
      const path = fixture(t, 'semver-installed-with-old-package-lock')
      createRegistry(t, true)
      const lock = () => fs.readFileSync(`${path}/package-lock.json`, 'utf8')
      await reify(path, { complete })
      t.matchSnapshot(lock(), 'should upgrade, with bins in place')
    })
  }
})

t.test('rollback if process is terminated during reify process', async t => {
  const onExit = require('../../lib/signal-handling.js')
  // mock the process so we don't have to kill this test
  // copy-pasta from signal-handling test
  const EE = require('node:events')
  const proc = onExit.process = new class MockProcess extends EE {
    constructor () {
      super()
      this.pid = process.pid
    }

    // ignore the beforeExit handler, since we won't actually let that happen
    once (ev, ...args) {
      if (ev !== 'beforeExit') {
        return super.once(ev, ...args)
      }
    }

    kill (pid, signal) {
      if (pid !== this.pid) {
        throw Object.assign(new Error('wrong pid sent to kill() method'), {
          expect: this.pid,
          actual: pid,
        })
      }
      return new Promise(res => process.nextTick(() => {
        this.emit(signal)
        res()
      }))
    }
  }()

  t.teardown(() => onExit.process = process)

  const methods = [
    Symbol.for('retireShallowNodes'),
    Symbol.for('createSparseTree'),
    Symbol.for('loadShrinkwrapsAndUpdateTrees'),
    Symbol.for('loadBundlesAndUpdateTrees'),
    Symbol.for('unpackNewModules'),
    Symbol.for('moveBackRetiredUnchanged'),
    Symbol.for('build'),
    Symbol.for('removeTrash'),
  ]

  t.plan(methods.length)
  for (const method of methods) {
    t.test(Symbol.keyFor(method), t => {
      const orig = Arborist.prototype[method]
      t.teardown(() => Arborist.prototype[method] = orig)
      Arborist.prototype[method] = async function (...args) {
        return Promise.resolve(orig.call(this, ...args)).then(() =>
          proc.kill(process.pid, 'SIGINT'))
      }
      const path = t.testdir({
        'package.json': JSON.stringify({ dependencies: { abbrev: '' } }),
      })

      t.test('clean install', async t => {
        createRegistry(t, true)
        const arb = newArb({ path })
        // starting from an empty folder, ends up empty
        await t.rejects(arb.reify(), {
          message: 'process terminated',
          signal: 'SIGINT',
        })
        // if it fails while removing trash well... it's already over.
        // we can't actually roll back at that point, because "trash" is gone
        if (method !== Symbol.for('removeTrash')) {
          t.throws(() => fs.statSync(path + '/node_modules'), { code: 'ENOENT' })
        }
      })

      t.test('upgrade install', async t => {
        // ensure that we end up with the same thing we started with,
        // if it was something other than we're installing
        const a = resolve(path, 'node_modules/abbrev')
        fs.mkdirSync(a, { recursive: true })
        const pj = resolve(a, 'package.json')
        fs.writeFileSync(pj, JSON.stringify({
          name: 'abbrev',
          version: '0.0.0',
        }))
        createRegistry(t, true)
        const arb = newArb({ path })
        await t.rejects(arb.reify({ add: ['abbrev@1.1.1'] }), {
          message: 'process terminated',
          signal: 'SIGINT',
        })

        // if it fails while removing trash well... it's already over.
        // we can't actually roll back at that point, because "trash" is gone
        if (method !== Symbol.for('removeTrash')) {
          t.same(JSON.parse(fs.readFileSync(pj, 'utf8')), {
            name: 'abbrev',
            version: '0.0.0',
          })
        }
      })

      t.end()
    })
  }
})

t.test('warn and correct if damaged data in lockfile', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        abbrev: '',
      },
    }),
    'package-lock.json': JSON.stringify({
      name: 'garbage-in-reify-tree',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          dependencies: {
            abbrev: '',
          },
        },
        'node_modules/abbrev': {
          integrity: 'sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==',
        },
      },
      dependencies: {
        abbrev: {
          integrity: 'sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==',
        },
      },
    }),
  })

  await t.test('first pass logs', async t => {
    const getLogs = warningTracker()
    createRegistry(t, false)
    await reify(path)
    t.strictSame(getLogs(), [
      [
        'warn',
        'reify',
        'invalid or damaged lockfile detected\n' +
        'please re-try this operation once it completes\n' +
        'so that the damage can be corrected, or perform\n' +
        'a fresh install with no lockfile if the problem persists.',
      ],
    ], 'got warnings')
    t.matchSnapshot(fs.readFileSync(path + '/package-lock.json', 'utf8'), '"fixed" lockfile')
  })

  await t.test('second pass just does the right thing', async t => {
    const getLogs = warningTracker()
    createRegistry(t, true)
    await reify(path)
    t.strictSame(getLogs(), [], 'no warnings this time')
    t.matchSnapshot(fs.readFileSync(path + '/package-lock.json', 'utf8'), 'actually fixed lockfile')
  })
})

t.test('properly update one module when multiple are present', async t => {
  const path = t.testdir({})
  createRegistry(t, true)
  const abbrevpj = resolve(path, 'node_modules/abbrev/package.json')
  const oncepj = resolve(path, 'node_modules/once/package.json')

  await newArb({ path, global: true }).reify({ add: ['abbrev@1.0.4'] })
  t.equal(JSON.parse(fs.readFileSync(abbrevpj, 'utf8')).version, '1.0.4')
  t.throws(() => fs.readFileSync(oncepj, 'utf8'), 'once should not be yet')

  await newArb({ path, global: true }).reify({ add: ['once'] })
  t.equal(JSON.parse(fs.readFileSync(abbrevpj, 'utf8')).version, '1.0.4')
  t.equal(JSON.parse(fs.readFileSync(oncepj, 'utf8')).version, '1.4.0')

  await newArb({ path, global: true }).reify({ update: ['abbrev'] })
  t.equal(JSON.parse(fs.readFileSync(abbrevpj, 'utf8')).version, '1.1.1')
  t.equal(JSON.parse(fs.readFileSync(oncepj, 'utf8')).version, '1.4.0')
})

t.test('saving should not replace file: dep with version', async t => {
  // need to run in the path, as if the user typed `npm i file:abbrev`
  const cwd = process.cwd()
  t.teardown(() => process.chdir(cwd))
  const path = t.testdir({
    abbrev: {
      'package.json': JSON.stringify({
        name: 'abbrev',
        version: '1.1.1',
      }),
    },
    'package.json': JSON.stringify({}),
  })
  createRegistry(t, false)
  process.chdir(path)

  const pj = resolve(path, 'package.json')
  await newArb({ path, save: true }).reify({ add: ['file:abbrev'] })
  const pj1 = fs.readFileSync(pj, 'utf8')
  t.equal(JSON.parse(pj1).dependencies.abbrev, 'file:abbrev',
    'saved as file: spec after file: install')
  await newArb({ path, save: true }).reify({ add: ['abbrev'] })
  const pj2 = fs.readFileSync(pj, 'utf8')
  t.equal(JSON.parse(pj2).dependencies.abbrev, 'file:abbrev',
    'still a file: spec after a bare name install')
})

t.test('filtered reification in workspaces', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: [
        'apps/*',
        'packages/*',
      ],
    }),
    // 'apps' comes ahead of 'node_modules' alphabetically,
    // included in the test so that we ensure that the copy
    // over works properly in both directions.
    apps: {
      x: {
        'package.json': JSON.stringify({
          name: 'x',
          version: '1.2.3',
        }),
      },
    },
    // this is going to be a workspace that we switch to in the ideal
    // tree, but the actual tree will still be lagging behind.
    foo: {
      x: {
        'package.json': JSON.stringify({
          name: 'x',
          version: '1.2.3',
        }),
      },
    },
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: {
            once: '',
            wrappy: '1.0.2',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
          dependencies: {
            abbrev: '',
          },
        }),
      },
      c: {
        'package.json': JSON.stringify({
          name: 'c',
          version: '1.2.3',
          dependencies: {
            wrappy: '1.0.0',
          },
        }),
      },
    },
  })
  createRegistry(t, true)

  const hiddenLock = resolve(path, 'node_modules/.package-lock.json')

  t.matchSnapshot(await printReified(path, { workspaces: ['c'] }),
    'reify the c workspace only')

  t.matchSnapshot(fs.readFileSync(hiddenLock, 'utf8'),
    'hidden lockfile - c')

  t.matchSnapshot(await printReified(path, { workspaces: ['x'] }),
    'reify the x workspace after reifying c')

  t.matchSnapshot(fs.readFileSync(hiddenLock, 'utf8'),
    'hidden lockfile - c, x')

  t.matchSnapshot(await printReified(path, { workspaces: ['a'] }),
    'reify the a workspace after reifying c')

  t.matchSnapshot(fs.readFileSync(hiddenLock, 'utf8'),
    'hidden lockfile - c, x, a')

  // now remove the a workspace, and move x to a new target location,
  // but we will not reify the apps->foo change.
  fs.writeFileSync(`${path}/package.json`, JSON.stringify({
    workspaces: [
      'foo/*',
      'packages/b',
      'packages/c',
    ],
  }))

  t.matchSnapshot(await printReified(path, { workspaces: ['a', 'c'] }),
    'reify the workspaces, removing a and leaving c and old x in place')

  t.matchSnapshot(fs.readFileSync(hiddenLock, 'utf8'),
    'hidden lockfile - c, old x, removed a')

  // Same thing, BUT, we now have a reason to already have the foo/x
  // in fsChildren.  fully reify with this package.json, then change
  // the root package.json back to the test above.  This exercises an
  // edge case where the actual and ideal trees are somewhat out of sync,
  // by virtue of the actualTree being generated with a package.json
  // which has changed, but where only PART of the idealTree is reified
  // over it.
  fs.writeFileSync(`${path}/package.json`, JSON.stringify({
    dependencies: {
      foox: 'file:foo/x',
    },
    workspaces: [
      'apps/x',
      'packages/a',
      'packages/c',
    ],
  }))
  await reify(path)
  fs.writeFileSync(`${path}/package.json`, JSON.stringify({
    workspaces: [
      'foo/*',
      'packages/b',
      'packages/c',
    ],
  }))
  t.matchSnapshot(await printReified(path, { workspaces: ['a', 'c'] }),
    'reify the workspaces, foo/x linked, c, old x, removed a')

  t.matchSnapshot(fs.readFileSync(hiddenLock, 'utf8'),
    'hidden lockfile - foo/x linked, c, old x, removed a')
})

t.test('project with bundled deps and a link dep on itself', async t => {
  const pkg = {
    name: '@isaacs/testing-bundle-self-link',
    version: '1.0.0',
    bin: {
      'testing-bundle-self-link': 'bin.js',
    },
    scripts: {
      test: 'testing-bundle-self-link',
      postinstall: 'testing-bundle-self-link',
    },
    bundleDependencies: [
      'abbrev',
    ],
    dependencies: {
      '@isaacs/testing-bundle-self-link': 'file:.',
      abbrev: '',
    },
  }
  const path = t.testdir({
    'package.json': JSON.stringify(pkg),
    'bin.js': `#!/usr/bin/env node
console.log('TAP version 13')
console.log('1..1')
console.log('ok 1 - this is fine')
`,
  })
  createRegistry(t, true)

  t.matchSnapshot(await printReified(path), 'result')
  t.resolves(runScript({
    event: 'test',
    path,
    pkg,
    stdio: 'pipe',
  }), 'test result')
})

t.test('running lifecycle scripts of unchanged link nodes on reify', async t => {
  const path = fixture(t, 'link-dep-lifecycle-scripts')
  createRegistry(t, false)
  t.matchSnapshot(await printReified(path), 'result')

  t.ok(fs.lstatSync(resolve(path, 'a/a-prepare')).isFile(),
    'should run prepare lifecycle scripts for links directly linked to the tree')
  t.ok(fs.lstatSync(resolve(path, 'a/a-post-install')).isFile(),
    'should run postinstall lifecycle scripts for links directly linked to the tree')
})

t.test('save-prod, with optional', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      devDependencies: { abbrev: '*' },
      optionalDependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'], saveType: 'prod' })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('saveBundle', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'], saveType: 'prod', saveBundle: true })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('no saveType: dev w/ compatible peer', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      peerDependencies: { abbrev: '*' },
      devDependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('no saveType: dev w/ incompatible peer', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      peerDependencies: { abbrev: '0.0.0' },
      devDependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('no saveType: dev w/ compatible optional', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      optionalDependencies: { abbrev: '*' },
      devDependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('no saveType: dev w/ incompatible optional', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      optionalDependencies: { abbrev: '0.0.0' },
      devDependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('no saveType: prod w/ peer', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      peerDependencies: { abbrev: '*' },
      dependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('no saveType: peer only', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      peerDependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('no saveType: optional only', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      optionalDependencies: { abbrev: '*' },
    }),
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['abbrev'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('do not delete linked targets when link omitted', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      devDependencies: {
        foo: 'file:foo',
      },
      dependencies: {
        abbrev: '',
      },
    }),
    node_modules: {
      foo: t.fixture('symlink', '../foo'),
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.2.3',
        }),
      },
    },
    foo: {
      'package.json': JSON.stringify({
        name: 'foo',
        version: '1.2.3',
        dependencies: {
          bar: '1.2.3',
        },
      }),
      'index.js': 'console.log("hello from foo")',
      node_modules: {
        bar: {
          'package.json': JSON.stringify({
            name: 'bar',
            version: '1.2.3',
          }),
        },
      },
    },
  })
  const barpj = resolve(path, 'foo/node_modules/bar/package.json')
  const fooindex = resolve(path, 'foo/index.js')
  t.equal(fs.existsSync(barpj), true, 'bar package.json present')
  t.equal(fs.existsSync(fooindex), true, 'foo index.js present')
  createRegistry(t, false)
  const tree = await reify(path, { omit: ['dev'] })
  t.equal(fs.existsSync(barpj), true, 'bar package.json still present')
  t.equal(fs.existsSync(fooindex), true, 'foo index.js still present')
  t.notOk(tree.children.get('foo'), 'does not have foo child any more')
  t.equal(tree.fsChildren.size, 1, 'still has foo fschild')
})

t.test('add spec * with semver prefix range gets updated', async t => {
  const path = t.testdir({ 'package.json': '{}' })
  createRegistry(t, true)
  const arb = newArb({ path })
  await arb.reify({ add: ['latest-is-prerelease'] })
  t.matchSnapshot(fs.readFileSync(path + '/package.json', 'utf8'))
})

t.test('add deps to workspaces', async t => {
  const fixture = {
    'package.json': JSON.stringify({
      workspaces: [
        'packages/*',
      ],
      dependencies: {
        mkdirp: '^1.0.4',
      },
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: {
            mkdirp: '^0.5.0',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
        }),
      },
    },
  }

  t.test('no args', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    const tree = await reify(path)
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp').version, '0.5.5')
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile')
  })

  t.test('add mkdirp 0.5.0 to b', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    await reify(path)
    const tree = await reify(path, { workspaces: ['b'], add: ['mkdirp@0.5.0'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp').version, '0.5.5')
    t.equal(tree.children.get('b').target.children.get('mkdirp').version, '0.5.0')
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/packages/b/package.json'), 'package.json b')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile')
  })

  t.test('remove mkdirp from a', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    await reify(path)
    const tree = await reify(path, { workspaces: ['a'], rm: ['mkdirp'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a').target.edgesOut.get('mkdirp'), undefined)
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/packages/a/package.json'), 'package.json a')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile')
  })

  t.test('upgrade mkdirp in a, dedupe on root', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    await reify(path)
    const tree = await reify(path, { workspaces: ['a'], add: ['mkdirp@1'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a').target.edgesOut.get('mkdirp').spec, '^1.0.4')
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/packages/a/package.json'), 'package.json a')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile')
  })

  t.test('add mkdirp 0.5.0 to b, empty start', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    const tree = await reify(path, { workspaces: ['b'], add: ['mkdirp@0.5.0'] })
    t.equal(tree.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a'), undefined, 'did not even link workspace "a"')
    t.equal(tree.children.get('b').target.children.get('mkdirp').version, '0.5.0')
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/packages/b/package.json'), 'package.json b')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile')
  })

  t.test('remove mkdirp from a, empty start', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    const tree = await reify(path, { workspaces: ['a'], rm: ['mkdirp'] })
    t.equal(tree.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a').target.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a').target.edgesOut.get('mkdirp'), undefined)
    t.equal(tree.children.get('b'), undefined, 'did not link workspace "b"')
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/packages/a/package.json'), 'package.json a')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile')
  })

  t.test('upgrade mkdirp in a, dedupe on root, empty start', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    const tree = await reify(path, { workspaces: ['a'], add: ['mkdirp@1'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a').target.edgesOut.get('mkdirp').spec, '^1.0.4')
    t.equal(tree.children.get('b'), undefined, 'did not link "b" workspace')
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/packages/a/package.json'), 'package.json a')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile')
  })

  t.test('add a to root', async t => {
    const path = t.testdir(fixture)
    createRegistry(t, true)
    await reify(path)
    const tree = await reify(path, { add: ['a'], lockfileVersion: 3 })
    t.matchSnapshot(printTree(tree), 'returned tree')
    t.matchSnapshot(require(path + '/package.json'), 'package.json added workspace as dep')
    t.matchSnapshot(require(path + '/package-lock.json'), 'lockfile added workspace as dep')
  })
})

t.test('reify audit only workspace deps when reifying workspace', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: {
            'kind-of': '6.0.0',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
          dependencies: {
            minimist: '0.0.8',
          },
        }),
      },
    },
  })
  const registry = createRegistry(t, true)
  registry.audit({ results: require('../fixtures/audit-nyc-mkdirp/advisory-bulk.json') })
  const arb = newArb({ path, audit: true, workspaces: ['a'] })
  const tree = await arb.reify()
  const report = arb.auditReport.toJSON()
  t.equal(report.vulnerabilities.minimist, undefined, 'minimist not audited')
  t.match(report.vulnerabilities['kind-of'], {
    name: 'kind-of',
    severity: 'low',
    range: '6.0.0 - 6.0.2',
    nodes: ['node_modules/kind-of'],
    fixAvailable: {
      name: 'kind-of',
      version: '6.0.3',
      isSemVerMajor: false,
    },
    via: [{
      source: 1490,
      name: 'kind-of',
      dependency: 'kind-of',
      title: 'Validation Bypass',
      url: 'https://npmjs.com/advisories/1490',
      severity: 'low',
      range: '>=6.0.0 <6.0.3',
    }],
  }, 'kind-of audited')
  t.matchSnapshot(printTree(tree), 'resulting tree')
})

t.test('update a dep when the lockfile is lying about it', async t => {
  // lockfile and pj have new version, but old version is in nm
  // no hidden lockfile to provide metadata
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        abbrev: '1.1.1',
      },
    }),
    'package-lock.json': JSON.stringify({
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          devDependencies: {
            abbrev: '1.1.1',
          },
        },
        'node_modules/abbrev': {
          version: '1.1.1',
          resolved: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz',
          integrity: 'sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==',
          dev: true,
        },
      },
      dependencies: {
        abbrev: {
          version: '1.1.1',
          resolved: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz',
          integrity: 'sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==',
          dev: true,
        },
      },
    }),
    node_modules: {
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.1.0',
        }),
      },
    },
  })

  createRegistry(t, true)
  const tree = await reify(path)
  const abbrev = tree.children.get('abbrev')
  t.equal(abbrev.version, '1.1.1')
  t.equal(require(abbrev.path + '/package.json').version, '1.1.1')
})

t.test('shrinkwrap which lacks metadata updates deps', async t => {
  const path = t.testdir({
    'package.json': '{}',
  })

  createRegistry(t, true)
  const first = await reify(path, {
    add: ['@isaacs/testing-shrinkwrap-abbrev@1.2.0'],
  })
  const firstAbbrev = first.children.get('@isaacs/testing-shrinkwrap-abbrev')
    .children.get('abbrev')
  t.equal(firstAbbrev.version, '1.1.0')

  const abbrevPath = firstAbbrev.path
  const abbrevpj = () =>
    JSON.parse(fs.readFileSync(abbrevPath + '/package.json', 'utf8'))

  t.equal(abbrevpj().version, firstAbbrev.version)

  const second = await reify(path, {
    add: ['@isaacs/testing-shrinkwrap-abbrev@1.2.1'],
  })
  const secondAbbrev = second.children.get('@isaacs/testing-shrinkwrap-abbrev')
    .children.get('abbrev')
  t.equal(secondAbbrev.version, '1.1.1')
  t.equal(abbrevpj().version, secondAbbrev.version)
})

t.test('move aside symlink clutter', async t => {
  // have to make the clutter manually, because we collide packages based
  // on case-insensitive names, so the ABBREV folder would be removed.
  // not sure how this would ever happen, but defense in depth.
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        abbrev: 'latest',
      },
    }),
    target: {
      file: 'do not delete me please',
      'package.json': JSON.stringify({ name: 'ABBREV', version: '1.0.0' }),
    },
    'sensitivity-test': t.fixture('symlink', './target'),
  })

  // check to see if we're on a case-insensitive fs
  try {
    const st = fs.lstatSync(path + '/SENSITIVITY-TEST')
    t.equal(st.isSymbolicLink(), true, 'fs is case insensitive')
  } catch (er) {
    t.plan(0, 'case sensitive file system, test not relevant')
    return
  }

  const kReifyPackages = Symbol.for('reifyPackages')
  const reifyPackages = Arborist.prototype[kReifyPackages]
  t.teardown(() => Arborist.prototype[kReifyPackages] = reifyPackages)
  Arborist.prototype[kReifyPackages] = async function () {
    fs.mkdirSync(path + '/node_modules')
    fs.symlinkSync('../target', path + '/node_modules/ABBREV')
    Arborist.prototype[kReifyPackages] = reifyPackages
    return this[kReifyPackages]()
  }

  createRegistry(t, true)
  const tree = await printReified(path)
  const st = fs.lstatSync(path + '/node_modules/abbrev')
  t.equal(st.isSymbolicLink(), false)
  t.equal(st.isDirectory(), true)
  const realName = basename(fs.realpathSync.native(path + '/node_modules/abbrev'))
  t.equal(realName, 'abbrev', 'lowercase form is the winner')
  t.equal(fs.readFileSync(path + '/target/file', 'utf8'),
    'do not delete me please')
  const linkPJ = fs.readFileSync(path + '/target/package.json', 'utf8')
  t.strictSame(JSON.parse(linkPJ), {
    name: 'ABBREV',
    version: '1.0.0',
  })
  const abbrevPJ = fs.readFileSync(path + '/node_modules/abbrev/package.json', 'utf8')
  t.match(JSON.parse(abbrevPJ), {
    name: 'abbrev',
    version: '1.1.1',
  })

  t.matchSnapshot(tree)
})

t.test('collide case-variant dep names', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        ABBREV: 'file:target',
        abbrev: '1',
      },
    }),
    target: {
      file: 'do not delete me please',
      'package.json': JSON.stringify({ name: 'ABBREV', version: '1.0.0' }),
    },
    node_modules: {
      ABBREV: t.fixture('symlink', '../target'),
    },
  })

  createRegistry(t, true)
  const tree = await printReified(path)
  const st = fs.lstatSync(path + '/node_modules/abbrev')
  t.equal(st.isSymbolicLink(), false)
  const realName = basename(fs.realpathSync.native(path + '/node_modules/abbrev'))
  t.equal(realName, 'abbrev', 'lowercase form is the winner')
  t.equal(fs.readFileSync(path + '/target/file', 'utf8'),
    'do not delete me please')
  const linkPJ = fs.readFileSync(path + '/target/package.json', 'utf8')
  t.strictSame(JSON.parse(linkPJ), {
    name: 'ABBREV',
    version: '1.0.0',
  })

  t.matchSnapshot(tree, 'tree 1')
  const tree2 = await printReified(path, { add: ['abbrev@latest'] })
  t.matchSnapshot(tree2, 'tree 2')
  const linkPJ2 = fs.readFileSync(path + '/target/package.json', 'utf8')
  t.strictSame(JSON.parse(linkPJ2), {
    name: 'ABBREV',
    version: '1.0.0',
  }, 'target was not overwritten')
  t.equal(fs.readFileSync(path + '/target/file', 'utf8'),
    'do not delete me please')
  const abbrevPJ = fs.readFileSync(path + '/node_modules/abbrev/package.json', 'utf8')
  t.match(JSON.parse(abbrevPJ), {
    name: 'abbrev',
    version: '1.1.1',
  })
})

t.test('node_modules may not be a symlink', async t => {
  const path = t.testdir({
    target: {},
    node_modules: t.fixture('symlink', 'target'),
    'package.json': JSON.stringify({
      dependencies: {
        abbrev: '',
      },
    }),
  })
  createRegistry(t, true)
  const warnings = warningTracker()
  const tree = await printReified(path)
  t.matchSnapshot(tree)
  t.matchSnapshot(normalizePaths(warnings()))
})

t.test('never unpack into anything other than a real directory', async t => {
  const kUnpack = Symbol.for('unpackNewModules')
  const unpackNewModules = Arborist.prototype[kUnpack]
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        once: '',
        wrappy: 'file:target',
      },
    }),
    target: {
      donotdeleteme: 'please do not delete this',
      'package.json': JSON.stringify({
        name: 'donotclobberme',
        version: '1.2.3-please-do-not-clobber',
      }),
    },
  })
  createRegistry(t, true)
  const arb = newArb({ path })
  const logs = debugLogTracker()
  const wrappy = resolve(path, 'node_modules/once/node_modules/wrappy')
  arb[kUnpack] = () => {
    // will have already created it
    fs.rmSync(wrappy, { recursive: true, force: true })
    const target = resolve(path, 'target')
    fs.symlinkSync(target, wrappy, 'junction')
    arb[kUnpack] = unpackNewModules
    return arb[kUnpack]()
  }
  await t.rejects(arb.reify({ path }), {
    message: 'ENOTDIR: not a directory',
    code: 'ENOTDIR',
    path: wrappy,
  })
  t.match(logs(), [['unpacking into a non-directory', { path: wrappy }]])
})

t.test('adding an unresolvable optional dep is OK', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      optionalDependencies: {
        abbrev: '999999',
      },
    }),
  })
  createRegistry(t, true)
  const tree = await reify(path, { add: ['abbrev'] })
  t.strictSame([...tree.children.values()], [], 'nothing actually added')
  t.matchSnapshot(printTree(tree))
})

t.test('includeWorkspaceRoot in addition to workspace', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        once: '',
      },
      workspaces: ['packages/*'],
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.1',
          dependencies: {
            abbrev: '',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '9.8.1',
          dependencies: {
            semver: '',
          },
        }),
      },
    },
  })
  createRegistry(t, true)
  const tree = await reify(path, { includeWorkspaceRoot: true, workspaces: ['a'] })
  t.matchSnapshot(printTree(tree))
  t.equal(tree.inventory.query('name', 'semver').size, 0)
  t.equal(tree.inventory.query('name', 'abbrev').size, 1)
  t.equal(tree.inventory.query('name', 'once').size, 1)
})

t.test('no workspace', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        once: '',
      },
      workspaces: ['packages/*'],
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.1',
          dependencies: {
            abbrev: '',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '9.8.1',
          dependencies: {
            semver: '',
          },
        }),
      },
    },
  })
  createRegistry(t, true)
  const tree = await reify(path, { workspacesEnabled: false, workspaces: ['a', 'b'] })
  t.matchSnapshot(printTree(tree))
  t.equal(tree.inventory.query('name', 'semver').size, 0)
  t.equal(tree.inventory.query('name', 'abbrev').size, 0)
  t.equal(tree.inventory.query('name', 'once').size, 1)
})

t.test('add local dep with existing dev + peer/optional', async t => {
  const path = t.testdir({
    project: {
      'package.json': JSON.stringify({
        devDependencies: {
          abbrev: '^1.0.0',
        },
        peerDependencies: {
          abbrev: '^1.0.0',
        },
        optionalDependencies: {
          abbrev: '^1.0.0',
        },
      }),
    },
    dep: {
      'package.json': JSON.stringify({
        name: 'abbrev',
        version: '1.0.0',
      }),
    },
  })

  const project = resolve(path, 'project')
  const cwd = process.cwd()
  t.teardown(() => process.chdir(cwd))
  process.chdir(project)

  createRegistry(t, false)
  const tree = await reify(project, { add: ['../dep'] })

  t.matchSnapshot(printTree(tree), 'tree')
  t.equal(tree.children.get('abbrev').resolved, 'file:../../dep', 'resolved')
  t.equal(tree.children.size, 1, 'children')
})

t.test('runs dependencies script if tree changes', async (t) => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: {
        abbrev: '^1.1.1',
      },
      scripts: {
        predependencies: `node -e "require('fs').writeFileSync('ran-predependencies', '')"`,
        dependencies: `node -e "require('fs').writeFileSync('ran-dependencies', '')"`,
        postdependencies: `node -e "require('fs').writeFileSync('ran-postdependencies', '')"`,
      },
    }),
  })

  createRegistry(t, true)
  await reify(path)

  for (const script of ['predependencies', 'dependencies', 'postdependencies']) {
    const expectedPath = join(path, `ran-${script}`)
    t.ok(fs.existsSync(expectedPath), `ran ${script}`)
    // delete the files after we assert they exist
    fs.unlinkSync(expectedPath)
  }

  // reify again without changing dependencies
  await reify(path)

  for (const script of ['predependencies', 'dependencies', 'postdependencies']) {
    const expectedPath = join(path, `ran-${script}`)
    // and this time we assert that they do _not_ exist
    t.not(fs.existsSync(expectedPath), `did not run ${script}`)
  }

  const outputs = outputTracker()

  // reify again, this time adding a new dependency
  await reify(path, { foregroundScripts: true, add: ['once@^1.4.0'] })

  t.match(outputs(), [/predependencies/, /dependencies/, /postdependencies/], 'logged banners')

  // files should exist again
  for (const script of ['predependencies', 'dependencies', 'postdependencies']) {
    const expectedPath = join(path, `ran-${script}`)
    t.ok(fs.existsSync(expectedPath), `ran ${script}`)
    fs.unlinkSync(expectedPath)
  }
})

t.test('save package.json on update', t => {
  t.test('should save many deps in multiple package.json when using save=true', async t => {
    const path = fixture(t, 'workspaces-need-update')

    createRegistry(t, true)
    await reify(path, { update: true, save: true })

    t.same(
      require(resolve(path, 'package.json')),
      { dependencies: { abbrev: '^1.1.1' }, workspaces: ['a', 'b'] },
      'should save top level dep update to root package.json'
    )
    t.same(
      require(resolve(path, 'a', 'package.json')),
      { dependencies: { abbrev: '^1.1.1', once: '^1.4.0' } },
      'should save workspace dep to its package.json file')

    t.matchSnapshot(
      fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8'),
      'should update lockfile with many deps updated package.json save=true'
    )
  })

  t.test('should not save many deps in multiple package.json when using save=false', async t => {
    const path = fixture(t, 'workspaces-need-update')

    createRegistry(t, true)
    await reify(path, { update: true, save: false })

    t.same(
      require(resolve(path, 'package.json')),
      {
        dependencies: { abbrev: '^1.0.4' },
        workspaces: ['a', 'b'],
      },
      'should not save top level dep update to root package.json'
    )
    t.same(
      require(resolve(path, 'a', 'package.json')),
      { dependencies: { abbrev: '^1.0.4', once: '^1.3.2' } },
      'should not save workspace dep to its package.json file')

    // package-lock entries will still get updated:
    t.matchSnapshot(
      fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8'),
      'should update lockfile with many deps updated package.json save=false'
    )
  })

  t.test('should not save any with save=false and package-lock=false', async t => {
    const path = fixture(t, 'workspaces-need-update')

    createRegistry(t, true)
    await reify(path, { update: true, save: false, packageLock: false })

    t.same(
      require(resolve(path, 'package.json')),
      {
        dependencies: { abbrev: '^1.0.4' },
        workspaces: ['a', 'b'],
      },
      'should not save top level dep update to root package.json'
    )
    t.same(
      require(resolve(path, 'a', 'package.json')),
      { dependencies: { abbrev: '^1.0.4', once: '^1.3.2' } },
      'should not save workspace dep to its package.json file')

    // package-lock entries will still get updated:
    t.matchSnapshot(
      JSON.stringify(JSON.parse(fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8')), null, 2),
      'should update lockfile with many deps updated package.json save=false'
    )
  })

  t.test('should update named dep across multiple package.json using save=true', async t => {
    const path = fixture(t, 'workspaces-need-update')

    createRegistry(t, true)
    await reify(path, { update: ['abbrev'], save: true })

    t.same(
      require(resolve(path, 'package.json')),
      {
        dependencies: { abbrev: '^1.1.1' },
        workspaces: ['a', 'b'],
      },
      'should save top level dep update to root package.json'
    )
    t.same(
      require(resolve(path, 'a', 'package.json')),
      { dependencies: { abbrev: '^1.1.1', once: '^1.3.2' } },
      'should save only workspace a updated dep to its package.json file')
    t.same(
      require(resolve(path, 'b', 'package.json')),
      { dependencies: { abbrev: '^1.1.1' } },
      'should save only workspace b updated dep to its package.json file')

    t.matchSnapshot(
      fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8'),
      'should update lockfile with many deps updated package.json save=true'
    )
  })

  t.test('should update single named dep across multiple package.json using save=true', async t => {
    const path = fixture(t, 'workspaces-need-update')

    createRegistry(t, true)
    await reify(path, { update: ['once'], save: true })

    t.same(
      require(resolve(path, 'package.json')),
      {
        dependencies: { abbrev: '^1.0.4' },
        workspaces: ['a', 'b'],
      },
      'should save no top level dep update to root package.json'
    )
    t.same(
      require(resolve(path, 'a', 'package.json')),
      { dependencies: { abbrev: '^1.0.4', once: '^1.4.0' } },
      'should save only workspace single updated dep to its package.json file')
    t.same(
      require(resolve(path, 'b', 'package.json')),
      { dependencies: { abbrev: '^1.0.4' } },
      'should not change workspace b package.json file')

    t.matchSnapshot(
      fs.readFileSync(resolve(path, 'package-lock.json'), 'utf8'),
      'should update lockfile with single dep updated package.json save=true'
    )
  })

  t.test('should preserve exact ranges', async t => {
    const path = fixture(t, 'update-exact-version')

    createRegistry(t, true)
    await reify(path, { update: true, save: true })

    t.equal(
      require(resolve(path, 'package.json')).dependencies.abbrev,
      '1.0.4',
      'should save no top level dep update to root package.json'
    )
  })

  t.test('should preserve exact ranges, missing actual tree', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        dependencies: {
          abbrev: '1.0.4',
        },
      }),
    })

    createRegistry(t, true)
    await reify(path, { update: true, save: true })

    t.equal(
      require(resolve(path, 'package.json')).dependencies.abbrev,
      '1.0.4',
      'should save no top level dep update to root package.json'
    )
  })

  t.test('should not throw when trying to update a link dep', async t => {
    const path = t.testdir({
      one: {
        'package.json': JSON.stringify({
          name: 'one',
          version: '1.0.0',
          dependencies: {
            two: 'file:../two',
          },
        }),
      },
      two: {
        'package.json': JSON.stringify({
          name: 'two',
          version: '1.0.0',
        }),
      },
    })

    createRegistry(t, false)
    await t.resolves(reify(resolve(path, 'one'), { update: true, save: true, workspaces: [] }))

    t.equal(
      require(resolve(path, 'one', 'package.json')).dependencies.two,
      'file:../two',
      'should have made no changes'
    )
  })
  t.end()
})

t.test('installLinks', (t) => {
  t.test('when true, packs and extracts instead of symlinks', async (t) => {
    const path = t.testdir({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            b: 'file:../b',
          },
        }),
        'index.js': '',
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          main: 'index.js',
        }),
        'index.js': '',
      },
    })

    createRegistry(t, false)
    await reify(resolve(path, 'a'), { installLinks: true })

    const installedB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(installedB.isDirectory(), 'a/node_modules/b is a directory')
  })

  t.test('when false, symlinks', async (t) => {
    const path = t.testdir({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            b: 'file:../b',
          },
        }),
        'index.js': '',
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          main: 'index.js',
        }),
        'index.js': '',
      },
    })

    createRegistry(t, false)
    await reify(resolve(path, 'a'), { installLinks: false })

    const installedB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(installedB.isSymbolicLink(), 'a/node_modules/b is a symlink')
  })

  t.test('when symlinks exist, installLinks set to true replaces them with dirs', async (t) => {
    const path = t.testdir({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            b: 'file:../b',
          },
        }),
        'index.js': '',
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          main: 'index.js',
        }),
        'index.js': '',
      },
    })

    createRegistry(t, false)
    await reify(resolve(path, 'a'), { installLinks: false, save: true })

    const firstB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(firstB.isSymbolicLink(), 'a/node_modules/b is a symlink')

    await reify(resolve(path, 'a'), { installLinks: true, save: true })

    const secondB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(secondB.isDirectory(), 'a/node_modules/b is now a directory')
  })

  t.test('when directories exist, installLinks set to false replaces them with symlinks', async (t) => {
    const path = t.testdir({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            b: 'file:../b',
          },
        }),
        'index.js': '',
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          main: 'index.js',
        }),
        'index.js': '',
      },
    })

    createRegistry(t, false)
    await reify(resolve(path, 'a'), { installLinks: true })

    const firstB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(firstB.isDirectory(), 'a/node_modules/b is a directory')

    await reify(resolve(path, 'a'), { installLinks: false })

    const secondB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(secondB.isSymbolicLink(), 'a/node_modules/b is now a symlink')
  })

  t.test('when installLinks is true, dependencies of links are installed', async (t) => {
    const path = t.testdir({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            b: 'file:../b',
          },
        }),
        'index.js': '',
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            abbrev: '^1.0.0',
          },
        }),
        'index.js': '',
      },
    })

    createRegistry(t, true)
    await reify(resolve(path, 'a'), { installLinks: true })

    const installedB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(installedB.isDirectory(), 'a/node_modules/b is a directory')

    const abbrev = fs.lstatSync(resolve(path, 'a/node_modules/abbrev'))
    t.ok(abbrev.isDirectory(), 'abbrev got installed')
  })

  t.test('workspaces are always symlinks, even with installLinks set to true', async (t) => {
    const path = t.testdir({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            b: 'file:../b',
            c: '^1.0.0',
          },
          workspaces: ['./c'],
        }),
        'index.js': '',
        c: {
          'package.json': JSON.stringify({
            name: 'c',
            version: '1.0.0',
            main: 'index.js',
          }),
          'index.js': '',
        },
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          main: 'index.js',
          dependencies: {
            abbrev: '^1.0.0',
          },
        }),
        'index.js': '',
      },
    })

    createRegistry(t, true)
    await reify(resolve(path, 'a'), { installLinks: true })

    const installedB = fs.lstatSync(resolve(path, 'a/node_modules/b'))
    t.ok(installedB.isDirectory(), 'a/node_modules/b is a directory')

    const installedC = fs.lstatSync(resolve(path, 'a/node_modules/c'))
    t.ok(installedC.isSymbolicLink(), 'a/node_modules/c is a symlink')

    const abbrev = fs.lstatSync(resolve(path, 'a/node_modules/abbrev'))
    t.ok(abbrev.isDirectory(), 'abbrev got installed')
  })

  t.end()
})

t.only('should preserve exact ranges, missing actual tree', async (t) => {
  const Pacote = require('pacote')
  const Arborist = t.mock('../../lib/arborist', {
    pacote: {
      ...Pacote,
      extract: async (...args) => {
        if (args[0].startsWith('gitssh')) {
          // we just want to test that this url is handled properly
          // but its not a real git url we can clone so return early
          return true
        }
        return Pacote.extract(...args)
      },
    },
  })
  const abbrev = resolve(__dirname,
    '../fixtures/registry-mocks/content/abbrev/-/abbrev-1.1.1.tgz')
  const abbrevTGZ = fs.readFileSync(abbrev)

  const abbrevPackument = JSON.stringify({
    _id: 'abbrev',
    _rev: 'lkjadflkjasdf',
    name: 'abbrev',
    'dist-tags': { latest: '1.1.1' },
    versions: {
      '1.1.1': {
        name: 'abbrev',
        version: '1.1.1',
        dist: {
          tarball: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz',
        },
      },
    },
  })

  const abbrevPackument2 = JSON.stringify({
    _id: 'abbrev',
    _rev: 'lkjadflkjasdf',
    name: 'abbrev',
    'dist-tags': { latest: '1.1.1' },
    versions: {
      '1.1.1': {
        name: 'abbrev',
        version: '1.1.1',
        dist: {
          tarball: 'https://registry.garbage.org/abbrev/-/abbrev-1.1.1.tgz',
        },
      },
    },
  })

  const gitSshPackument = JSON.stringify({
    _id: 'gitssh',
    _rev: 'lkjadflkjasdf',
    name: 'gitssh',
    'dist-tags': { latest: '1.1.1' },
    versions: {
      '1.1.1': {
        name: 'gitssh',
        version: '1.1.1',
        dist: {
          // this is a url that `new URL()` cant parse
          // https://github.com/npm/cli/issues/5278
          tarball: 'git+ssh://git@github.com:a/b/c.git#lkjadflkjasdf',
        },
      },
    },
  })

  const notAUrlPackument = JSON.stringify({
    _id: 'notaurl',
    _rev: 'lkjadflkjasdf',
    name: 'notaurl',
    'dist-tags': { latest: '1.1.1' },
    versions: {
      '1.1.1': {
        name: 'notaurl',
        version: '1.1.1',
        dist: {
          tarball: 'hey been trying to break this test',
        },
      },
    },
  })

  t.only('host should not be replaced replaceRegistryHost=never', async (t) => {
    const testdir = t.testdir({
      project: {
        'package.json': JSON.stringify({
          name: 'myproject',
          version: '1.0.0',
          dependencies: {
            abbrev: '1.1.1',
            gitssh: '1.1.1',
            notaurl: '1.1.1',
          },
        }),
      },
    })

    tnock(t, 'https://registry.github.com')
      .get('/abbrev')
      .reply(200, abbrevPackument)

    tnock(t, 'https://registry.npmjs.org')
      .get('/abbrev/-/abbrev-1.1.1.tgz')
      .reply(200, abbrevTGZ)

    tnock(t, 'https://registry.github.com')
      .get('/gitssh')
      .reply(200, gitSshPackument)

    tnock(t, 'https://registry.github.com')
      .get('/notaurl')
      .reply(200, notAUrlPackument)

    const arb = new Arborist({
      path: resolve(testdir, 'project'),
      registry: 'https://registry.github.com',
      cache: resolve(testdir, 'cache'),
      replaceRegistryHost: 'never',
    })
    await arb.reify()
  })

  t.only('host should be replaced replaceRegistryHost=npmjs', async (t) => {
    const testdir = t.testdir({
      project: {
        'package.json': JSON.stringify({
          name: 'myproject',
          version: '1.0.0',
          dependencies: {
            abbrev: '1.1.1',
            gitssh: '1.1.1',
            notaurl: '1.1.1',
          },
        }),
      },
    })

    tnock(t, 'https://registry.github.com')
      .get('/abbrev')
      .reply(200, abbrevPackument)

    tnock(t, 'https://registry.github.com')
      .get('/gitssh')
      .reply(200, gitSshPackument)

    tnock(t, 'https://registry.github.com')
      .get('/abbrev/-/abbrev-1.1.1.tgz')
      .reply(200, abbrevTGZ)

    tnock(t, 'https://registry.github.com')
      .get('/notaurl')
      .reply(200, notAUrlPackument)

    const arb = new Arborist({
      path: resolve(testdir, 'project'),
      registry: 'https://registry.github.com',
      cache: resolve(testdir, 'cache'),
      replaceRegistryHost: 'npmjs',
    })
    await arb.reify()
  })

  t.only('host should be always replaceRegistryHost=always', async (t) => {
    const testdir = t.testdir({
      project: {
        'package.json': JSON.stringify({
          name: 'myproject',
          version: '1.0.0',
          dependencies: {
            abbrev: '1.1.1',
            gitssh: '1.1.1',
            notaurl: '1.1.1',
          },
        }),
      },
    })

    tnock(t, 'https://registry.github.com')
      .get('/abbrev')
      .reply(200, abbrevPackument2)

    tnock(t, 'https://registry.github.com')
      .get('/gitssh')
      .reply(200, gitSshPackument)

    tnock(t, 'https://registry.github.com')
      .get('/abbrev/-/abbrev-1.1.1.tgz')
      .reply(200, abbrevTGZ)

    tnock(t, 'https://registry.github.com')
      .get('/notaurl')
      .reply(200, notAUrlPackument)

    const arb = new Arborist({
      path: resolve(testdir, 'project'),
      registry: 'https://registry.github.com',
      cache: resolve(testdir, 'cache'),
      replaceRegistryHost: 'always',
    })
    await arb.reify()
  })
})

t.test('install stategy linked', async (t) => {
  const Arborist = require('../../lib/index.js')
  const abbrev = resolve(__dirname,
    '../fixtures/registry-mocks/content/abbrev/-/abbrev-1.1.1.tgz')
  const abbrevTGZ = fs.readFileSync(abbrev)

  const abbrevPackument = JSON.stringify({
    _id: 'abbrev',
    _rev: 'lkjadflkjasdf',
    name: 'abbrev',
    'dist-tags': { latest: '1.1.1' },
    versions: {
      '1.1.1': {
        name: 'abbrev',
        version: '1.1.1',
        dist: {
          tarball: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz',
        },
      },
    },
  })

  t.test('should install package linked', async (t) => {
    const testdir = t.testdir({
      project: {
        'package.json': JSON.stringify({
          name: 'myproject',
          version: '1.0.0',
          dependencies: {
            abbrev: '1.1.1',
          },
        }),
      },
    })

    tnock(t, 'https://registry.npmjs.org')
      .get('/abbrev')
      .reply(200, abbrevPackument)

    tnock(t, 'https://registry.npmjs.org')
      .get('/abbrev/-/abbrev-1.1.1.tgz')
      .reply(200, abbrevTGZ)

    const path = resolve(testdir, 'project')
    const arb = new Arborist({
      path,
      registry: 'https://registry.npmjs.org',
      cache: resolve(testdir, 'cache'),
      installStrategy: 'linked',
    })
    await arb.reify({ installStrategy: 'linked' })
    const abbrev = fs.lstatSync(resolve(path, 'node_modules', 'abbrev'))
    const store = fs.lstatSync(resolve(path, 'node_modules', '.store'))
    t.ok(store.isDirectory(), 'abbrev got installed')
    t.ok(abbrev.isSymbolicLink(), 'abbrev got installed')
  })
})
