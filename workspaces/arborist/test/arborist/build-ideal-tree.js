// the tree-checking is too abusively slow on Windows, and
// can make the test time out unnecessarily.
if (process.platform === 'win32') {
  process.env.ARBORIST_DEBUG = 0
}

const { join, basename, resolve, relative } = require('node:path')
const pacote = require('pacote')
const t = require('tap')
const Arborist = require('../..')
const fixtures = resolve(__dirname, '../fixtures')
// load the symbolic links that we depend on
require(fixtures)
const npa = require('npm-package-arg')
const fs = require('node:fs')
const MockRegistry = require('@npmcli/mock-registry')

const createRegistry = (t, mocks = false) => {
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

// track the warnings that are emitted.  returns the list of what it saw
const warningTracker = (t) => {
  const warnings = []
  const onlog = (...msg) => msg[0] === 'warn' && warnings.push(msg)
  process.on('log', onlog)
  t.teardown(() => {
    process.removeListener('log', onlog)
  })
  return warnings
}

const {
  normalizePath,
  normalizePaths,
  printTree,
} = require('../fixtures/utils.js')

const oldLockfileWarning = [
  'warn',
  'old lockfile',
  `
The package-lock.json file was created with an old version of npm,
so supplemental metadata must be fetched from the registry.

This is a one-time fix-up, please be patient...
`,
]

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

const cache = t.testdir()
// give it a very long timeout so CI doesn't crash as easily
const newArb = (path, opt = {}) => new Arborist({ timeout: 30 * 60 * 1000, path, cache, ...opt })
const buildIdeal = (path, opt) => newArb(path, opt).buildIdealTree(opt)
const printIdeal = (path, opt) => buildIdeal(path, opt).then(printTree)

t.test('fail on mismatched engine when engineStrict is set', async t => {
  const path = resolve(fixtures, 'engine-specification')

  await t.rejects(buildIdeal(path, {
    nodeVersion: '12.18.4',
    engineStrict: true,
  }),
  { code: 'EBADENGINE' },
  'should fail with EBADENGINE error'
  )
})

t.test('fail on malformed package.json', async t => {
  const path = resolve(fixtures, 'malformed-json')

  await t.rejects(
    buildIdeal(path),
    { code: 'EJSONPARSE' },
    'should fail with EJSONPARSE error'
  )
})

t.test('ignore mismatched engine for optional dependencies', async () => {
  const path = resolve(fixtures, 'optional-engine-specification')
  await buildIdeal(path, {
    nodeVersion: '12.18.4',
    engineStrict: true,
  })
})

t.test('warn on mismatched engine when engineStrict is false', t => {
  const path = resolve(fixtures, 'engine-specification')
  createRegistry(t, false)
  const warnings = warningTracker(t)
  return buildIdeal(path, {
    nodeVersion: '12.18.4',
    engineStrict: false,
  }).then(() => t.match(warnings, [
    ['warn', 'EBADENGINE'],
  ]))
})

t.test('fail on mismatched platform', async t => {
  const path = resolve(fixtures, 'platform-specification')
  createRegistry(t, true)
  await t.rejects(buildIdeal(path, {
    nodeVersion: '4.0.0',
  }), { code: 'EBADPLATFORM' })
})

t.test('ignore mismatched platform for optional dependencies', async t => {
  const path = resolve(fixtures, 'optional-platform-specification')
  createRegistry(t, true)
  const tree = await buildIdeal(path, {
    nodeVersion: '12.18.4',
    engineStrict: true,
  })
  t.equal(tree.children.get('platform-specifying-test-package').package.version, '1.0.0', 'added the optional dep to the ideal tree')
})

t.test('no options', async t => {
  const arb = new Arborist()
  t.match(
    arb.registry,
    'https://registry.npmjs.org',
    'should use default registry'
  )
})

t.test('a workspace with a conflicted nested duplicated dep', async t => {
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(resolve(fixtures, 'workspace4')))
})

t.test('a tree with an outdated dep, missing dep, no lockfile', async t => {
  const path = resolve(fixtures, 'outdated-no-lockfile')
  createRegistry(t, true)
  const tree = await buildIdeal(path)
  const expected = {
    once: '1.3.3',
    wrappy: '1.0.1',
  }
  for (const [name, version] of Object.entries(expected)) {
    t.equal(tree.children.get(name).package.version, version, `expect ${name}@${version}`)
  }

  t.matchSnapshot(printTree(tree), 'should not update all')
})

t.test('tarball deps with transitive tarball deps', async t => {
  createRegistry(t, false)
  await t.resolveMatchSnapshot(printIdeal(
    resolve(fixtures, 'tarball-dependencies')))
})

t.test('testing-peer-deps-overlap package', async t => {
  const path = resolve(fixtures, 'testing-peer-deps-overlap')
  createRegistry(t, true)
  const idealTree = await buildIdeal(path)
  const arb = newArb(path, { idealTree })
  const tree2 = await arb.buildIdealTree()
  t.equal(tree2, idealTree)
  t.matchSnapshot(printTree(idealTree), 'build ideal tree with overlapping peer dep ranges')
})

t.test('testing-peer-deps package', async t => {
  const path = resolve(fixtures, 'testing-peer-deps')
  createRegistry(t, true)
  const idealTree = await buildIdeal(path)
  const arb = newArb(path, { idealTree })
  const tree2 = await arb.buildIdealTree()
  t.equal(tree2, idealTree)
  t.matchSnapshot(printTree(idealTree), 'build ideal tree with peer deps')
})

t.test('testing-peer-deps package with symlinked root', async t => {
  const path = resolve(fixtures, 'testing-peer-deps-link')
  createRegistry(t, true)
  const idealTree = await buildIdeal(path)
  t.ok(idealTree.isLink, 'ideal tree is rooted on a Link')
  const arb = newArb(path, { idealTree })
  const tree2 = await arb.buildIdealTree()
  t.equal(tree2, idealTree)
  t.matchSnapshot(printTree(idealTree), 'build ideal tree with peer deps')
})

t.test('testing-peer-deps nested', async t => {
  const path = resolve(fixtures, 'testing-peer-deps-nested')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'build ideal tree')
  await t.resolveMatchSnapshot(printIdeal(path, {
    // hit the branch where update is just a list of names
    update: ['@isaacs/testing-peer-deps'],
  }), 'can update a peer dep cycle')
})

t.test('tap vs react15', async t => {
  const path = resolve(fixtures, 'tap-react15-collision')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'build ideal tree with tap collision')
})

t.test('tap vs react15 with legacy shrinkwrap', async t => {
  const path = resolve(fixtures, 'tap-react15-collision-legacy-sw')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'tap collision with legacy sw file')
})

t.test('bad shrinkwrap file', async t => {
  const path = resolve(fixtures, 'testing-peer-deps-bad-sw')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'bad shrinkwrap')
})

t.test('a direct link dep has a dep with optional dependencies', async t => {
  const path = resolve(fixtures, 'link-dep-has-dep-with-optional-dep')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'should not mark children of the optional dep as extraneous')
})

t.test('cyclical peer deps', async t => {
  const paths = [
    resolve(fixtures, 'peer-dep-cycle'),
    resolve(fixtures, 'peer-dep-cycle-with-sw'),
  ]
  createRegistry(t, true)
  for (const path of paths) {
    await t.test(basename(path), async t => {
      await t.resolveMatchSnapshot(printIdeal(path), 'cyclical peer deps')
      await t.resolveMatchSnapshot(printIdeal(path, {
        // just reload the dep at its current required version
        add: ['@isaacs/peer-dep-cycle-a'],
      }), 'cyclical peer deps - reload a dependency')
      await t.resolveMatchSnapshot(printIdeal(path, {
        add: ['@isaacs/peer-dep-cycle-a@2.x'],
      }), 'cyclical peer deps - upgrade a package')
      await t.rejects(printIdeal(path, {
        // this conflicts with the direct dep on a@1 PEER-> b@1
        add: ['@isaacs/peer-dep-cycle-b@2.x'],
      }))
      // this conflict is ok since we're using legacy peer deps
      await t.resolveMatchSnapshot(printIdeal(path, {
        add: ['@isaacs/peer-dep-cycle-b@2.x'],
        legacyPeerDeps: true,
      }), 'add b@2.x with legacy peer deps')
      await t.resolveMatchSnapshot(printIdeal(path, {
        // use @latest rather than @2.x to exercise the 'explicit tag' path
        add: ['@isaacs/peer-dep-cycle-b@latest'],
        rm: ['@isaacs/peer-dep-cycle-a'],
      }), 'can add b@2 if we remove a@1 dep')
      await t.resolveMatchSnapshot(printIdeal(path, {
        rm: ['@isaacs/peer-dep-cycle-a'],
      }), 'remove the dep, prune everything')
    })
  }
})

t.test('nested cyclical peer deps', async t => {
  const registry = createRegistry(t, true)
  const paths = [
    resolve(fixtures, 'peer-dep-cycle-nested'),
    resolve(fixtures, 'peer-dep-cycle-nested-with-sw'),
  ]

  // if we have a shrinkwrap, then we'll get a collision with the current
  // version already there.  if we don't, then we'll get a peerConflict
  // when we try to put the second one there.
  const ers = {
    [paths[0]]: {
      code: 'ERESOLVE',
    },
    [paths[1]]: {
      code: 'ERESOLVE',
    },
  }

  for (const path of paths) {
    await t.test(basename(path), async t => {
      await t.resolveMatchSnapshot(printIdeal(path), 'nested peer deps cycle')
      await t.resolveMatchSnapshot(printIdeal(path, {
        // just make sure it works if it gets a spec object
        add: [npa('@isaacs/peer-dep-cycle-a@2.x')],
      }), 'upgrade a')
      await t.resolveMatchSnapshot(printIdeal(path, {
        // a dep whose name we don't yet know
        add: [
          '@isaacs/peer-dep-cycle-a@2.x',
          `${registry.origin}/@isaacs/peer-dep-cycle-b/-/peer-dep-cycle-b-2.0.0.tgz`,
        ],
      }), 'upgrade b')
      await t.resolveMatchSnapshot(printIdeal(path, {
        force: true,
        add: ['@isaacs/peer-dep-cycle-c@2.x'],
      }), 'upgrade c, forcibly')
      await t.rejects(printIdeal(path, {
        add: [
          '@isaacs/peer-dep-cycle-a@1.x',
          '@isaacs/peer-dep-cycle-c@2.x',
        ],
      }), ers[path], 'try (and fail) to upgrade c and a incompatibly')
    })
  }
})

t.test('dedupe example - not deduped', async t => {
  createRegistry(t, true)
  const path = resolve(fixtures, 'dedupe-tests')
  await t.resolveMatchSnapshot(printIdeal(path), 'dedupe testing')
})

t.test('dedupe example - deduped because preferDedupe=true', async t => {
  createRegistry(t, true)
  const path = resolve(fixtures, 'dedupe-tests')
  await t.resolveMatchSnapshot(printIdeal(path, { preferDedupe: true }))
})

t.test('dedupe example - nested because legacyBundling=true', async t => {
  const path = resolve(fixtures, 'dedupe-tests')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path, {
    installStrategy: 'nested',
    preferDedupe: true,
  }))
})

t.test('dedupe example - deduped', async t => {
  const path = resolve(fixtures, 'dedupe-tests-2')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'dedupe testing')
})

t.test('expose explicitRequest', async t => {
  const path = resolve(fixtures, 'simple')
  createRegistry(t, true)
  const arb = newArb(path)
  await arb.buildIdealTree({ add: ['abbrev'] })
  t.match(arb.explicitRequests, Set, 'exposes the explicit request Set')
  t.strictSame([...arb.explicitRequests].map(e => e.name), ['abbrev'])
})

t.test('bundle deps example 1, empty', async t => {
  // NB: this results in ignoring the bundled deps when building the
  // ideal tree.  When we reify, we'll have to ignore the deps that
  // got placed as part of the bundle.
  const path = resolve(fixtures, 'testing-bundledeps-empty')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'bundle deps testing')
  await t.resolveMatchSnapshot(printIdeal(path, {
    saveBundle: true,
    add: ['@isaacs/testing-bundledeps'],
  }), 'should have some missing deps in the ideal tree')
})

t.test('bundle deps example 1, full', async t => {
  // In this test, bundle deps show up, because they're present in
  // the actual tree to begin with.
  const path = resolve(fixtures, 'testing-bundledeps')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'no missing deps')
  await t.resolveMatchSnapshot(printIdeal(path, {
    saveBundle: true,
    add: ['@isaacs/testing-bundledeps'],
  }), 'add stuff, no missing deps')
})

t.test('bundle deps example 1, complete:true', async t => {
  // When complete:true is set, we extract into a temp dir to read
  // the bundled deps, so they ARE included, just like during reify()
  const path = resolve(fixtures, 'testing-bundledeps-empty')
  createRegistry(t, true)

  // wrap pacote.extract in a spy so we can be sure the integrity and resolved
  // options both made it through
  const _extract = pacote.extract
  // restore in a teardown, just in case
  t.teardown(() => {
    pacote.extract = _extract
  })
  pacote.extract = (uri, dir, opts) => {
    t.ok(uri.endsWith('testing-bundledeps-1.0.0.tgz'))
    t.equal(uri, opts.resolved, 'passed resolved')
    t.ok(opts.integrity, 'passed integrity')
    const res = _extract(uri, dir, opts)
    pacote.extract = _extract
    return res
  }

  await t.resolveMatchSnapshot(printIdeal(path, {
    complete: true,
  }), 'no missing deps, because complete: true')
  await t.resolveMatchSnapshot(printIdeal(path, {
    saveBundle: true,
    add: ['@isaacs/testing-bundledeps'],
    complete: true,
  }), 'no missing deps, because complete: true, add dep, save bundled')
})

t.test('bundle deps example 2', async t => {
  // bundled deps at the root level are NOT ignored when building ideal trees
  const path = resolve(fixtures, 'testing-bundledeps-2')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'bundle deps testing')
  await t.resolveMatchSnapshot(printIdeal(path, {
    saveBundle: true,
    add: ['@isaacs/testing-bundledeps-c'],
  }), 'add new bundled dep c')
  await t.resolveMatchSnapshot(printIdeal(path, {
    rm: ['@isaacs/testing-bundledeps-a'],
  }), 'remove bundled dependency a')
})

t.test('bundle deps example 2, link', async t => {
  // bundled deps at the root level are NOT ignored when building ideal trees
  const path = resolve(fixtures, 'testing-bundledeps-link')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'bundle deps testing')
  await t.resolveMatchSnapshot(printIdeal(path, {
    saveBundle: true,
    add: ['@isaacs/testing-bundledeps-c'],
  }), 'add new bundled dep c')
  await t.resolveMatchSnapshot(printIdeal(path, {
    rm: ['@isaacs/testing-bundledeps-a'],
  }), 'remove bundled dependency a')
})

t.test('unresolvable peer deps', async t => {
  const path = resolve(fixtures, 'testing-peer-deps-unresolvable')
  createRegistry(t, true)

  await t.rejects(printIdeal(path, { strictPeerDeps: true }), {
    message: 'unable to resolve dependency tree',
    code: 'ERESOLVE',
  }, 'unacceptable')
})

t.test('do not add shrinkwrapped deps', async t => {
  const path = resolve(fixtures, 'shrinkwrapped-dep-no-lock')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path, { update: true }))
})

t.test('do add shrinkwrapped deps when complete:true is set', async t => {
  const path = resolve(fixtures, 'shrinkwrapped-dep-no-lock')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path, {
    complete: true,
    update: true,
  }))
})

t.test('do not update shrinkwrapped deps', async t => {
  const path = resolve(fixtures, 'shrinkwrapped-dep-with-lock')
  createRegistry(t, false)
  await t.resolveMatchSnapshot(printIdeal(path,
    { update: { names: ['abbrev'] } }))
})

t.test('do not update shrinkwrapped deps, ignore lockfile', async t => {
  const path = resolve(fixtures, 'shrinkwrapped-dep-with-lock')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path,
    { packageLock: false, update: { names: ['abbrev'] } }))
})

t.test('do not update shrinkwrapped deps when complete:true is set', async t => {
  const path = resolve(fixtures, 'shrinkwrapped-dep-with-lock')
  createRegistry(t, false)
  await t.resolveMatchSnapshot(printIdeal(path,
    { update: { names: ['abbrev'] }, complete: true }))
})

t.test('deduped transitive deps with asymmetrical bin declaration', async t => {
  const path = resolve(fixtures, 'testing-asymmetrical-bin-no-lock')
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(path), 'with no lockfile')
})

t.test('deduped transitive deps with asymmetrical bin declaration', async t => {
  const path = resolve(fixtures, 'testing-asymmetrical-bin-with-lock')
  createRegistry(t, false)
  await t.resolveMatchSnapshot(printIdeal(path), 'with lockfile')
})

t.test('update', async t => {
  await t.test('flow outdated', async t => {
    createRegistry(t, true)
    const flowOutdated = resolve(fixtures, 'flow-outdated')
    await t.resolveMatchSnapshot(printIdeal(flowOutdated, {
      update: {
        names: ['flow-parser'],
      },
    }), 'update flow parser')
    await t.resolveMatchSnapshot(printIdeal(flowOutdated, {
      update: true,
    }), 'update everything')
  })

  await t.test('tap and flow', async t => {
    createRegistry(t, true)
    const tapAndFlow = resolve(fixtures, 'tap-and-flow')
    await t.resolveMatchSnapshot(printIdeal(tapAndFlow, {
      update: {
        all: true,
      },
    }), 'update everything')
    await t.resolveMatchSnapshot(printIdeal(tapAndFlow, {
      update: {
        names: ['ink'],
      },
    }), 'update ink')
  })
})

t.test('link meta deps', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(
    resolve(fixtures, 'link-meta-deps-empty')))
})

t.test('respect the yarn.lock file', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(
    resolve(fixtures, 'yarn-lock-mkdirp')))
})

t.test('respect the yarn.lock file version, if lacking resolved', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(
    resolve(fixtures, 'yarn-lock-mkdirp-no-resolved')))
})

t.test('optional dependency failures', async t => {
  const cases = [
    'optional-ok',
    'optional-dep-enotarget',
    'optional-dep-missing',
    'optional-metadep-enotarget',
    'optional-metadep-missing',
  ]
  createRegistry(t, true)
  for (const c of cases) {
    const tree = await printIdeal(resolve(fixtures, c))
    t.matchSnapshot(tree, c)
  }
})

t.test('prod dependency failures', async t => {
  const cases = [
    'prod-dep-enotarget',
    'prod-dep-missing',
  ]
  createRegistry(t, true)
  for (const c of cases) {
    await t.rejects(printIdeal(resolve(fixtures, c)), c)
  }
})

t.test('link dep with a link dep', async t => {
  const path = resolve(fixtures, 'cli-750')
  createRegistry(t, false)
  await Promise.all([
    t.resolveMatchSnapshot(printIdeal(path), 'link metadeps with lockfile'),
    t.resolveMatchSnapshot(printIdeal(path, { update: true }), 'link metadeps without lockfile'),
  ])
})

t.test('link dep within node_modules and outside root', async t => {
  const path = resolve(fixtures, 'external-link-dep')
  createRegistry(t, true)
  await Promise.all([
    t.resolveMatchSnapshot(printIdeal(path), 'linky deps with lockfile'),
    t.resolveMatchSnapshot(printIdeal(path, { update: true }), 'linky deps without lockfile'),
    t.resolveMatchSnapshot(printIdeal(path, { follow: true }), 'linky deps followed'),
    t.resolveMatchSnapshot(printIdeal(path, { update: true, follow: true }), 'linky deps followed without lockfile'),
  ])
})

t.test('global style', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(t.testdir(), {
    installStrategy: 'shallow',
    add: ['rimraf'],
  }))
})

t.test('global', async t => {
  createRegistry(t, true)
  await t.resolveMatchSnapshot(printIdeal(t.testdir(), {
    global: true,
    add: ['rimraf'],
  }))
})

t.test('global has to add or remove', async t => {
  createRegistry(t, false)
  await t.rejects(printIdeal(t.testdir(), {
    global: true,
  }))
})

// // somewhat copy-pasta from the test/arborist/audit.js to exercise
// // the buildIdealTree code paths
t.test('update mkdirp to non-minimist-using version', async t => {
  const path = resolve(fixtures, 'deprecated-dep')
  const registry = createRegistry(t, true)
  registry.audit({ convert: true, results: require('../fixtures/audit-nyc-mkdirp/audit.json') })

  const arb = newArb(path)

  await arb.audit()
  t.matchSnapshot(printTree(await arb.buildIdealTree()))
})

t.test('force a new nyc (and update mkdirp nicely)', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t, true)
  // TODO why does this infinite loop if no results?
  registry.audit({ convert: true, results: require('../fixtures/audit-nyc-mkdirp/audit.json') })

  const arb = newArb(path, { force: true })
  await arb.audit()
  t.matchSnapshot(printTree(await arb.buildIdealTree()))
  t.equal(arb.idealTree.children.get('mkdirp').package.version, '0.5.5')
  t.equal(arb.idealTree.children.get('nyc').package.version, '15.1.0')
})

t.test('force a new mkdirp (but not semver major)', async t => {
  const path = resolve(fixtures, 'mkdirp-pinned')
  const registry = createRegistry(t, true)
  registry.audit({ convert: true, results: require('../fixtures/audit-nyc-mkdirp/audit.json') })

  const arb = newArb(path, { force: true })

  await arb.audit()
  t.matchSnapshot(printTree(await arb.buildIdealTree()))
  t.equal(arb.idealTree.children.get('mkdirp').package.version, '0.5.5')
  t.equal(arb.idealTree.children.get('minimist').package.version, '1.2.5')
})

t.test('empty update should not trigger old lockfile', async t => {
  createRegistry(t, false)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'empty-update',
      version: '1.0.0',
    }),
    'package-lock.json': JSON.stringify({
      name: 'empty-update',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          name: 'empty-update',
          version: '1.0.0',
        },
      },
    }),
  })
  const warnings = warningTracker(t)

  const arb = newArb(path)
  await arb.reify({ update: true })

  t.strictSame(warnings, [])
})

t.test('update v3 doesnt downgrade lockfile', async t => {
  createRegistry(t, false)
  const fixt = t.testdir({
    'package-lock.json': JSON.stringify({
      name: 'empty-update-v3',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          name: 'empty-update-v3',
          version: '1.0.0',
        },
      },
    }),
    'package.json': JSON.stringify({
      name: 'empty-update-v3',
      version: '1.0.0',
    }),
  })

  const arb = newArb(fixt)
  await arb.reify({ update: true })

  const { lockfileVersion } = require(resolve(fixt, 'package-lock.json'))

  t.strictSame(lockfileVersion, 3)
})

t.test('no fix available', async t => {
  const path = resolve(fixtures, 'audit-mkdirp/mkdirp-unfixable')
  const warnings = warningTracker(t)
  const registry = createRegistry(t, true)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })

  const arb = newArb(path, { force: true })

  await arb.audit()
  t.matchSnapshot(printTree(await arb.buildIdealTree()))
  t.equal(arb.idealTree.children.get('mkdirp').package.version, '0.5.1')
  t.match(warnings, [
    oldLockfileWarning,
    ['warn', 'audit', 'No fix available for mkdirp@*'],
  ])
})

t.test('no fix available, linked top package', async t => {
  const path = resolve(fixtures, 'audit-mkdirp')
  const warnings = warningTracker(t)
  const registry = createRegistry(t, true)
  registry.audit({ convert: true, results: require(resolve(path, 'mkdirp-unfixable', 'audit.json')) })

  const arb = newArb(path, { force: true })

  await arb.audit()
  t.matchSnapshot(printTree(await arb.buildIdealTree()))
  t.strictSame(warnings, [
    oldLockfileWarning,
    ['warn', 'audit',
      'Manual fix required in linked project at ./mkdirp-unfixable for mkdirp@*.\n' +
    "'cd ./mkdirp-unfixable' and run 'npm audit' for details.",
    ]])
})

t.test('workspaces', async t => {
  await t.test('should install a simple example', async t => {
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-simple')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should update a simple example', async t => {
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-simple')
    await t.resolveMatchSnapshot(printIdeal(path, { update: { all: true } }))
  })

  await t.test('should install a simple scoped pkg example', async t => {
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-scoped-pkg')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should not work with duplicate names', async t => {
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-duplicate')
    await t.rejects(printIdeal(path), { code: 'EDUPLICATEWORKSPACE' }, 'throws EDUPLICATEWORKSPACE error')
  })

  await t.test('should install shared dependencies into root folder', async t => {
    createRegistry(t, true)
    const path = resolve(__dirname, '../fixtures/workspaces-shared-deps')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should install conflicting dep versions', async t => {
    createRegistry(t, true)
    const path = resolve(__dirname, '../fixtures/workspaces-conflicting-versions')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should prefer linking nested workspaces', async t => {
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-prefer-linking')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should install from registry on version not satisfied', async t => {
    createRegistry(t, true)
    const path = resolve(__dirname, '../fixtures/workspaces-version-unsatisfied')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should link top level nested workspaces', async t => {
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-top-level-link')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should install workspace transitive dependencies', async t => {
    createRegistry(t, true)
    const path = resolve(__dirname, '../fixtures/workspaces-transitive-deps')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should ignore nested node_modules folders', async t => {
    // packages/a/node_modules/nested-workspaces should not be installed
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-ignore-nm')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should work with files spec', async t => {
    createRegistry(t, false)
    const path = resolve(__dirname, '../fixtures/workspaces-with-files-spec')
    await t.resolveMatchSnapshot(printIdeal(path))
  })

  await t.test('should handle conflicting peer deps ranges', async t => {
    createRegistry(t, true)
    const path = resolve(__dirname, '../fixtures/workspaces-peer-ranges')
    await t.rejects(
      printIdeal(path),
      {
        code: 'ERESOLVE',
      },
      'throws ERESOLVE error'
    )
  })

  await t.test('should allow adding a workspace as a dep to a workspace', async t => {
    createRegistry(t, false)

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        workspaces: ['workspace-a', 'workspace-b'],
      }),
      'workspace-a': {
        'package.json': JSON.stringify({
          name: 'workspace-a',
          version: '1.0.0',
        }),
      },
      'workspace-b': {
        'package.json': JSON.stringify({
          name: 'workspace-b',
          version: '1.0.0',
        }),
      },
    })

    const arb = newArb(path, { workspaces: ['workspace-a'] })

    const tree = arb.buildIdealTree({
      path,
      add: [
        'workspace-b',
      ],
    })

    // just assert that the buildIdealTree call resolves, if there's a
    // problem here it will reject because of nock disabling requests
    await t.resolves(tree)

    t.matchSnapshot(printTree(await tree))
  })

  await t.test('should allow cyclic peer dependencies between workspaces and packages from a repository', async t => {
    const registry = createRegistry(t, false)
    const packument = registry.packument({
      name: 'foo',
      version: '1.0.0',
      peerDependencies: { 'workspace-a': '1.0.0' },
    })
    const manifest = registry.manifest({ name: 'foo', packuments: [packument] })
    await registry.package({ manifest })
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          'workspace-a': '*',
        },
        workspaces: ['workspace-a'],
      }),
      'workspace-a': {
        'package.json': JSON.stringify({
          name: 'workspace-a',
          version: '1.0.0',
          dependencies: {
            foo: '>=1.0.0',
          },
        }),
      },
    })

    const arb = newArb(path, { workspaces: ['workspace-a'] })
    const tree = await arb.buildIdealTree({ path, add: ['foo'] })
    t.matchSnapshot(printTree(tree))
  })

  t.test('workspace nodes are used instead of fetching manifests when they are valid', async t => {
    createRegistry(t, false)
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        workspaces: ['workspace-a', 'workspace-b'],
      }),
      // the package-lock.json references version 1.0.0 of the workspace deps
      // as it would if a user hand edited their workspace's package.json and
      // now are attempting to reify with a stale package-lock
      'package-lock.json': JSON.stringify({
        name: 'root',
        lockfileVersion: 2,
        requires: true,
        packages: {
          '': {
            name: 'root',
            workspaces: ['workspace-a', 'workspace-b'],
          },
          'node_modules/workspace-a': {
            resolved: 'workspace-a',
            link: true,
          },
          'node_modules/workspace-b': {
            resolved: 'workspace-b',
            link: true,
          },
          'workspace-a': {
            name: 'workspace-a',
            version: '1.0.0',
            dependencies: {
              'workspace-b': '1.0.0',
            },
          },
          'workspace-b': {
            name: 'workspace-b',
            version: '1.0.0',
          },
        },
        dependencies: {
          'workspace-a': {
            version: 'file:workspace-a',
            requires: {
              'workspace-b': '1.0.0',
            },
          },
          'workspace-b': {
            version: 'file:workspace-b',
          },
        },
      }),
      node_modules: {
        'workspace-a': t.fixture('symlink', '../workspace-a'),
        'workspace-b': t.fixture('symlink', '../workspace-b'),
      },
      // the workspaces themselves are at 2.0.0 because they're what was edited
      'workspace-a': {
        'package.json': JSON.stringify({
          name: 'workspace-a',
          version: '2.0.0',
          dependencies: {
            'workspace-b': '2.0.0',
          },
        }),
      },
      'workspace-b': {
        'package.json': JSON.stringify({
          name: 'workspace-b',
          version: '2.0.0',
        }),
      },
    })

    const arb = newArb(path, { workspaces: ['workspace-a', 'workspace-b'] })

    // this will reject if we try to fetch a manifest for some reason
    const tree = await arb.buildIdealTree({
      path,
    })

    const edgeA = tree.edgesOut.get('workspace-a')
    t.ok(edgeA.valid, 'workspace-a should be valid')
    const edgeB = tree.edgesOut.get('workspace-b')
    t.ok(edgeB.valid, 'workspace-b should be valid')
    const nodeA = edgeA.to.target
    t.ok(nodeA.isWorkspace, 'workspace-a is definitely a workspace')
    const nodeB = edgeB.to.target
    t.ok(nodeB.isWorkspace, 'workspace-b is definitely a workspace')
    const nodeBfromA = nodeA.edgesOut.get('workspace-b').to.target
    t.equal(nodeBfromA, nodeB, 'workspace-b edgeOut from workspace-a is the workspace')
  })
})

t.test('adding tarball to global prefix that is a symlink at a different path depth', async t => {
  createRegistry(t, false)
  const fixt = t.testdir({
    'real-root': {},
    'another-path': {
      'global-root': t.fixture('symlink', '../real-root'),
    },
  })
  const path = resolve(fixt, 'another-path/global-root')
  const arb = newArb(path, { global: true })

  const tarballpath = resolve(__dirname, '../fixtures/registry-mocks/content/mkdirp/-/mkdirp-1.0.2.tgz')
  const tree = await arb.buildIdealTree({
    path,
    global: true,
    add: [
      // this will be a relative path to the tarball above
      relative(process.cwd(), tarballpath),
    ],
  })
  t.matchSnapshot(printTree(tree))
})

t.test('add symlink that points to a symlink', t => {
  createRegistry(t, false)
  const fixt = t.testdir({
    'global-prefix': {
      lib: {
        node_modules: {
          a: t.fixture('symlink', '../../../linked-pkg'),
        },
      },
    },
    'linked-pkg': {
      'package.json': JSON.stringify({
        name: 'a',
        version: '1.0.0',
      }),
    },
    'my-project': {
      'package.json': JSON.stringify({}),
    },
  })
  const path = resolve(fixt, 'my-project')
  const arb = newArb(path)
  return arb.buildIdealTree({
    add: [
      // simulates the string used by `npm link <pkg>` when
      // installing a package available in the global space
      `file:${resolve(fixt, 'global-prefix/lib/node_modules/a')}`,
    ],
  }).then(tree =>
    t.matchSnapshot(
      printTree(tree),
      'should follow symlinks to find final realpath destination'
    )
  )
})

t.test('update global space single dep', async t => {
  createRegistry(t, true)
  const fixt = t.testdir({
    'global-prefix': {
      lib: {
        node_modules: {
          abbrev: {
            'package.json': JSON.stringify({
              name: 'abbrev',
              version: '1.0.0',
            }),
          },
        },
      },
    },
  })
  const path = resolve(fixt, 'global-prefix/lib')
  const opts = {
    path,
    global: true,
    update: true,
  }
  const arb = newArb(path, opts)
  const tree = await arb.buildIdealTree(opts)
  t.matchSnapshot(
    printTree(tree),
    'should update global dependencies'
  )
})

// if we get this wrong, it'll spin forever and use up all the memory
t.test('pathologically nested dependency cycle', async t => {
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(
    resolve(fixtures, 'pathological-dep-nesting-cycle')))
})

t.test('resolve file deps from cwd', async t => {
  const cwd = process.cwd()
  t.teardown(() => process.chdir(cwd))
  createRegistry(t, false)
  const path = t.testdir({
    global: {},
    local: {},
  })
  const fixturedir = resolve(fixtures, 'root-bundler')
  process.chdir(fixturedir)
  const arb = newArb(resolve(path, 'global'), { global: true })
  const tree = await arb.buildIdealTree({
    path: `${path}/local`,
    add: ['child-1.2.3.tgz'],
    global: true,
  })
  const resolved = `file:${resolve(fixturedir, 'child-1.2.3.tgz')}`
  t.equal(normalizePath(tree.children.get('child').resolved), normalizePath(resolved))
})

t.test('resolve links in global mode', async t => {
  const cwd = process.cwd()
  t.teardown(() => process.chdir(cwd))
  createRegistry(t, false)
  const path = t.testdir({
    global: {},
    lib: {
      'my-project': {},
    },
    'linked-dep': {
      'package.json': JSON.stringify({
        name: 'linked-dep',
        version: '1.0.0',
      }),
    },
  })
  const fixturedir = resolve(path, 'lib', 'my-project')
  process.chdir(fixturedir)

  const arb = newArb(resolve(path, 'global'), { global: true })
  const tree = await arb.buildIdealTree({
    add: ['file:../../linked-dep'],
    global: true,
  })
  const resolved = 'file:../../linked-dep'
  t.equal(tree.children.get('linked-dep').resolved, resolved)
})

t.test('dont get confused if root matches duped metadep', async t => {
  createRegistry(t, true)
  const path = resolve(fixtures, 'test-root-matches-metadep')
  const arb = newArb(path, { installStrategy: 'hoisted' })
  const tree = await arb.buildIdealTree()
  t.matchSnapshot(printTree(tree))
})

t.test('inflate an ancient lockfile by hitting the registry', async t => {
  const warnings = warningTracker(t)
  createRegistry(t, true)
  const path = resolve(fixtures, 'sax')
  const arb = newArb(path)
  const tree = await arb.buildIdealTree()
  t.matchSnapshot(printTree(tree))
  t.strictSame(warnings, [
    [
      'warn',
      'ancient lockfile',
      `
The package-lock.json file was created with an old version of npm,
so supplemental metadata must be fetched from the registry.

This is a one-time fix-up, please be patient...
`,
    ],
  ])
})

t.test('inflating a link node in an old lockfile skips registry', async t => {
  const warnings = warningTracker(t)
  const path = resolve(fixtures, 'old-lock-with-link')
  const arb = newArb(path, { registry: 'http://invalid.host' })
  const tree = await arb.buildIdealTree()
  t.matchSnapshot(printTree(tree))
  t.strictSame(warnings, [
    [
      'warn',
      'old lockfile',
      `
The package-lock.json file was created with an old version of npm,
so supplemental metadata must be fetched from the registry.

This is a one-time fix-up, please be patient...
`,
    ],
  ])
})

t.test('warn for ancient lockfile, even if we use v1', async t => {
  const warnings = warningTracker(t)
  const path = resolve(fixtures, 'sax')
  createRegistry(t, true)
  const arb = newArb(path, { lockfileVersion: 1 })
  const tree = await arb.buildIdealTree()
  t.matchSnapshot(printTree(tree))
  t.strictSame(warnings, [
    [
      'warn',
      'ancient lockfile',
      `
The package-lock.json file was created with an old version of npm,
so supplemental metadata must be fetched from the registry.

This is a one-time fix-up, please be patient...
`,
    ],
  ])
})

t.test('no old lockfile warning if we write back v1', async t => {
  const warnings = warningTracker(t)
  const path = resolve(fixtures, 'old-package-lock')
  createRegistry(t, true)
  const arb = newArb(path, { lockfileVersion: 1 })
  const tree = await arb.buildIdealTree()
  t.matchSnapshot(printTree(tree))
  t.strictSame(warnings, [])
})

t.test('inflate an ancient lockfile with a dep gone missing', async t => {
  const warnings = warningTracker(t)
  const path = resolve(fixtures, 'ancient-lockfile-invalid')
  createRegistry(t, true)
  const arb = newArb(path)
  const tree = await arb.buildIdealTree()
  t.matchSnapshot(printTree(tree))
  t.match(warnings, [
    [
      'warn',
      'ancient lockfile',
      `
The package-lock.json file was created with an old version of npm,
so supplemental metadata must be fetched from the registry.

This is a one-time fix-up, please be patient...
`,
    ],
    [
      'warn',
      'ancient lockfile',
      'Could not fetch metadata for @isaacs/this-does-not-exist-at-all@1.2.3',
      { code: 'E404', method: 'GET' },
    ],
  ])
})

t.test('complete build for project with old lockfile', async t => {
  const warnings = warningTracker(t)
  createRegistry(t, false)
  const path = resolve(fixtures, 'link-dep-empty')
  const arb = newArb(path)
  const tree = await arb.buildIdealTree({ complete: true })
  t.matchSnapshot(printTree(tree))
  t.match(warnings, [
    oldLockfileWarning,
  ])
})

t.test('no old lockfile warning with no package-lock', async t => {
  const fixt = t.testdir({
    node_modules: {
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.1.1',
        }),
      },
    },
    'package.json': JSON.stringify({
      name: 'no-package-lock',
      dependencies: {
        abbrev: '1',
      },
    }),
  })
  const warnings = warningTracker(t)
  const registry = createRegistry(t, false)
  registry.audit()
  await newArb(fixt).reify()
  t.strictSame(warnings, [])
})

t.test('no old lockfile warning with a conflict package-lock', async t => {
  const fixt = t.testdir({
    node_modules: {
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.1.1',
        }),
      },
    },
    'package.json': JSON.stringify({
      name: 'conflict-package-lock',
      dependencies: {
        abbrev: '1',
      },
    }),
    'package-lock.json': fs.readFileSync(
      resolve(fixtures, 'conflict-package-lock/package-lock.json')
    ),
  })
  const warnings = warningTracker(t)
  const registry = createRegistry(t, false)
  registry.audit()
  await newArb(fixt).reify()
  t.strictSame(warnings, [])
})

t.test('override a conflict with the root dep (with force)', async t => {
  const path = resolve(fixtures, 'testing-peer-dep-conflict-chain/override')
  // note: fails because this is the root dep, unless --force used
  await t.rejects(() => buildIdeal(path), {
    code: 'ERESOLVE',
  })
  createRegistry(t, false)
  t.matchSnapshot(await printIdeal(path, { strictPeerDeps: true, force: true }), 'strict and force override')
  t.matchSnapshot(await printIdeal(path, { strictPeerDeps: false, force: true }), 'non-strict and force override')
})

t.test('override a conflict with the root peer dep (with force)', async t => {
  const path = resolve(fixtures, 'testing-peer-dep-conflict-chain/override-peer')
  await t.rejects(() => buildIdeal(path, { strictPeerDeps: true }), {
    code: 'ERESOLVE',
  })
  createRegistry(t, false)
  t.matchSnapshot(await printIdeal(path, { strictPeerDeps: true, force: true }), 'strict and force override')
  t.matchSnapshot(await printIdeal(path, { strictPeerDeps: false, force: true }), 'non-strict and force override')
})

t.test('push conflicted peer deps deeper in to the tree to solve', async t => {
  const path = resolve(fixtures, 'testing-peer-dep-conflict-chain/override-dep')
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path))
})

t.test('do not continually re-resolve deps that failed to load', async t => {
  const path = t.testdir({
    node_modules: {
      '@isaacs': {
        'this-does-not-exist-actually': {
          'package.json': JSON.stringify({
            name: '@isaacs/this-does-not-exist-actually',
            version: '1.0.0',
          }),
        },
        'depends-on-load-failer': {
          'package.json': JSON.stringify({
            name: '@isaacs/depends-on-load-failer',
            version: '1.0.0',
            dependencies: {
              '@isaacs/this-does-not-exist-actually': '1.x',
            },
          }),
        },
      },
    },
    'package.json': JSON.stringify({
      name: 'my-project',
      version: '1.2.3',
      dependencies: {
        '@isaacs/depends-on-load-failer': '1.x',
        '@isaacs/this-does-not-exist-actually': '1.x',
      },
    }),
  })
  createRegistry(t, true)
  const arb = newArb(path)
  await t.rejects(() => arb.buildIdealTree({
    add: ['@isaacs/this-does-not-exist-actually@2.x'],
  }), { code: 'E404' })
})

t.test('update a node if it is bundled by the root project', async t => {
  const path = t.testdir({
    node_modules: {
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.0.0',
        }),
      },
    },
    'package.json': JSON.stringify({
      bundleDependencies: ['abbrev'],
      dependencies: {
        abbrev: '1',
      },
    }),
  })
  createRegistry(t, true)
  const arb = newArb(path)
  await arb.buildIdealTree({ update: ['abbrev'] })
  t.equal(arb.idealTree.children.get('abbrev').version, '1.1.1')
})

t.test('more peer dep conflicts', async t => {
  // each of these is installed and should pass in force mode,
  // fail in strictPeerDeps mode, and pass/fail based on the
  // 'error' field in non-strict/non-forced mode.
  const cases = Object.entries({
    'this is fine': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-x': '3',
        },
      },
      error: false,
      resolvable: true,
    },

    'prod dep directly on conflicted peer, newer': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '1',
          '@isaacs/testing-peer-dep-conflict-chain-b': '2',
        },
      },
      error: true,
    },

    'prod dep directly on conflicted peer, older': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '2',
          '@isaacs/testing-peer-dep-conflict-chain-b': '1',
        },
      },
      error: true,
    },

    'prod dep directly on conflicted peer, full peer set, newer': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '1',
          '@isaacs/testing-peer-dep-conflict-chain-b': '2',
          '@isaacs/testing-peer-dep-conflict-chain-c': '2',
          '@isaacs/testing-peer-dep-conflict-chain-d': '2',
          '@isaacs/testing-peer-dep-conflict-chain-e': '2',
        },
      },
      error: true,
    },

    'prod dep directly on conflicted peer, full peer set, older': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '2',
          '@isaacs/testing-peer-dep-conflict-chain-b': '1',
          '@isaacs/testing-peer-dep-conflict-chain-c': '1',
          '@isaacs/testing-peer-dep-conflict-chain-d': '1',
          '@isaacs/testing-peer-dep-conflict-chain-e': '1',
        },
      },
      error: true,
    },

    'prod dep directly on conflicted peer, meta peer set, older': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-e': '2',
          '@isaacs/testing-peer-dep-conflict-chain-m': '2',
          '@isaacs/testing-peer-dep-conflict-chain-b': '1',
          '@isaacs/testing-peer-dep-conflict-chain-l': '1',
        },
      },
      error: true,
    },

    'dep indirectly on conflicted peer': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '1',
          '@isaacs/testing-peer-dep-conflict-chain-w': '2',
        },
      },
      error: true,
    },

    'collision forcing duplication, order 1': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-j': '1',
          '@isaacs/testing-peer-dep-conflict-chain-v': '2',
        },
      },
      error: false,
      resolvable: true,
    },

    'collision forcing duplication, order 2': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '2',
          '@isaacs/testing-peer-dep-conflict-chain-j': '1',
        },
      },
      error: false,
      resolvable: true,
    },

    'collision forcing duplication via add, order 1': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-j': '1',
        },
      },
      add: ['@isaacs/testing-peer-dep-conflict-chain-a@2'],
      error: false,
      resolvable: true,
    },

    'collision forcing duplication via add, order 2': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-j': '1',
        },
      },
      add: ['@isaacs/testing-peer-dep-conflict-chain-v@2'],
      error: false,
      resolvable: true,
    },

    'collision forcing metadep duplication, order 1': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-ii': '1',
          '@isaacs/testing-peer-dep-conflict-chain-j': '2',
        },
      },
      error: false,
      resolvable: true,
    },

    'collision forcing metadep duplication, order 2': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-i': '1',
          '@isaacs/testing-peer-dep-conflict-chain-jj': '2',
        },
      },
      error: false,
      resolvable: true,
    },

    'direct collision forcing metadep duplication, order 1': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-jj': '1',
          '@isaacs/testing-peer-dep-conflict-chain-j': '2',
        },
      },
      error: false,
      resolvable: true,
    },

    'direct collision forcing metadep duplication, order 2': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-j': '1',
          '@isaacs/testing-peer-dep-conflict-chain-jj': '2',
        },
      },
      error: false,
      resolvable: true,
    },

    'dep with conflicting peers': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-p': '1',
        },
      },
      // XXX should this be false?  it's not OUR fault, after all?
      // but it is a conflict in a peerSet that the root is sourcing.
      error: true,
    },

    'metadeps with conflicting peers': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-p': '2',
        },
      },
      error: false,
    },

    'metadep conflict that warns because source is target': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-i': '1',
          '@isaacs/testing-peer-dep-conflict-chain-p': '2',
        },
      },
      error: false,
      resolvable: false,
    },

    'metadep conflict triggering the peerConflict code path': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-v': '1',
          '@isaacs/testing-peer-dep-conflict-chain-y': '2',
        },
      },
      error: true,
      resolvable: false,
    },

    'metadep conflict triggering the peerConflict code path, order 2': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-v': '2',
          '@isaacs/testing-peer-dep-conflict-chain-y': '1',
        },
      },
      error: true,
      resolvable: false,
    },

    'conflict on root edge, order 1': {
      pkg: {
        name: '@isaacs/testing-peer-dep-conflict-chain-a',
        version: '2.3.4',
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': 'file:.',
          '@isaacs/testing-peer-dep-conflict-chain-d': '1',
        },
      },
      error: true,
      resolvable: false,
    },
    'conflict on root edge, order 2': {
      pkg: {
        name: '@isaacs/testing-peer-dep-conflict-chain-d',
        version: '2.3.4',
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '1',
          '@isaacs/testing-peer-dep-conflict-chain-d': 'file:.',
        },
      },
      error: true,
      resolvable: false,
    },

    'metadep without conflicts, partly overlapping peerSets, resolvable': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-v': '4',
          '@isaacs/testing-peer-dep-conflict-chain-y': '1',
        },
      },
      error: false,
      resolvable: true,
    },
    'metadep without conflicts, partly overlapping peerSets, resolvable order 2': {
      pkg: {
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-v': '1',
          '@isaacs/testing-peer-dep-conflict-chain-y': '4',
        },
      },
      error: false,
      resolvable: true,
    },
  })

  createRegistry(t, true)
  for (const [name, { pkg, error, resolvable, add }] of cases) {
    await t.test(name, { buffer: true }, async t => {
      const path = t.testdir({
        'package.json': JSON.stringify(pkg),
      })
      const warnings = []
      const log = {
        silly: () => {},
        http: () => {},
        info: () => {},
        notice: () => {},
        error: () => {},
        warn: (...msg) => warnings.push(normalizePaths(msg)),
      }
      const strict = newArb(path, { strictPeerDeps: true })
      const force = newArb(path, { force: true })
      const def = newArb(path, { log })

      // cannot do this in parallel on Windows machines, or it
      // crashes in CI with an EBUSY error when it tries to read
      // from the registry mock contents.
      const results = process.platform !== 'win32' ? await Promise.all([
        strict.buildIdealTree({ add }).catch(er => er),
        force.buildIdealTree({ add }).catch(er => er),
        def.buildIdealTree({ add }).catch(er => er),
      ]) : [
        await strict.buildIdealTree({ add }).catch(er => er),
        await force.buildIdealTree({ add }).catch(er => er),
        await def.buildIdealTree({ add }).catch(er => er),
      ]

      const [strictRes, forceRes, defRes] = results

      if (!resolvable) {
        if (!(strictRes instanceof Error)) {
          console.error(printTree(strictRes))
        }
        t.match(strictRes, { code: 'ERESOLVE' })
      } else if (strictRes instanceof Error) {
        t.fail('should not get error in strict mode', { error: strictRes })
      } else {
        t.matchSnapshot(printTree(strictRes), 'strict result')
      }

      if (forceRes instanceof Error) {
        t.fail('should not get error when forced', { error: forceRes })
      } else {
        t.matchSnapshot(printTree(forceRes), 'force result')
      }

      if (error) {
        if (!(defRes instanceof Error)) {
          console.error(printTree(defRes))
        }
        t.match(defRes, { code: 'ERESOLVE' })
      } else if (defRes instanceof Error) {
        t.fail('should not get error in default mode', { error: defRes })
      } else {
        if (resolvable) {
          t.strictSame(warnings, [])
        } else {
          t.matchSnapshot(warnings, 'warnings')
        }
        warnings.length = 0
        t.matchSnapshot(printTree(defRes), 'default result')
      }
    })
  }
})

t.test('cases requiring peer sets to be nested', async t => {
  const cases = [
    'multi',
    'simple',
  ]
  for (const c of cases) {
    await t.test(c, async t => {
      createRegistry(t, true)
      const path = resolve(`${fixtures}/testing-peer-dep-nesting/${c}`)
      t.matchSnapshot(await printIdeal(path))
    })
  }
})

t.test('make sure yargs works', async t => {
  // While I generally find it's best to use reduced unit tests, to run
  // tests faster and force us to fully understand a problem, yargs has
  // been a bountiful source of complicated eslint peerDep issues.
  const yargs = resolve(fixtures, 'yargs')
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(yargs), 'yargs should build fine')
})

t.test('allow updating when peer outside of explicit update set', async t => {
  // see https://github.com/npm/cli/issues/2000
  await t.test('valid, no force required', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'x',
        version: '1.0.0',
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '1',
          '@isaacs/testing-peer-dep-conflict-chain-single-a': '^1.0.1',
          '@isaacs/testing-peer-dep-conflict-chain-single-b': '^1.0.1',
        },
      }),
      'package-lock.json': JSON.stringify({
        name: 'x',
        version: '1.0.0',
        lockfileVersion: 2,
        requires: true,
        packages: {
          '': {
            dependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '1',
              '@isaacs/testing-peer-dep-conflict-chain-single-a': '^1.0.1',
              '@isaacs/testing-peer-dep-conflict-chain-single-b': '^1.0.1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-a': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-a/-/testing-peer-dep-conflict-chain-a-1.0.0.tgz',
            integrity: 'sha512-yUUG0Sem+AzNZ0uPXmEZN/GHHMmAg3kbM/zrijnd+tAAKVV5PhWXVUuLKJ3Q6wSAxz3WuYG08OaJl3lpV4UFOA==',
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-b': '1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-b': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-b/-/testing-peer-dep-conflict-chain-b-1.0.0.tgz',
            integrity: 'sha512-tbsZ8No4L7h5YiIqDwGlJ14dg44oG4ZstF/wx7eZKUlnZax392thEeac5MNGFsv1T0Uqtiby9+SdpIRpejrHSw==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-c': '1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-c': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-c/-/testing-peer-dep-conflict-chain-c-1.0.0.tgz',
            integrity: 'sha512-173OUwUJK8QN4CGTF+oPHwoOHbUzgxjC3tzg2kBVLE/eak02ZXJrW9l4LmW03vqcToADVhsVMcFLIaAb6yd1mQ==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-d': '1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-d': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-d/-/testing-peer-dep-conflict-chain-d-1.0.0.tgz',
            integrity: 'sha512-zOtmaure/xJHmz7yGU7T33hjV6MZpo8Y6v1GuxDBx0PbqGoCxxCMacNtTUsEL5Sj8T19r5UShGZQmirNqPuhww==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-e': '1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-e': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-e/-/testing-peer-dep-conflict-chain-e-1.0.0.tgz',
            integrity: 'sha512-EDuAVgd6DBGe2tKQKdQt7Z6RoptSWQem4W++F+bqC31E0JuRVJHu44sENtIviUGsi0jVJS5xD75cL6kvvbaw/Q==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-single-a': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-a/-/testing-peer-dep-conflict-chain-single-a-1.0.1.tgz',
            integrity: 'sha512-NLHsR3z4e5I7+IXbe8l0SXDSdsghDtbsCMAG3deh21djZAH4dawx0bR/V/knYDrd0OZWdr0jDhivmVm42SmB1w==',
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-single-b': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-b/-/testing-peer-dep-conflict-chain-single-b-1.0.1.tgz',
            integrity: 'sha512-cyXyBAMPJWv28bHI0cJrer64eqQsM59CR+/ideNwthD5X5hZVyvVMTpuai7noDA34jllf9Xgb+jcPgt2xmvR6A==',
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '1',
              '@isaacs/testing-peer-dep-conflict-chain-single-a': '1',
            },
          },
        },
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-a/-/testing-peer-dep-conflict-chain-a-1.0.0.tgz',
            integrity: 'sha512-yUUG0Sem+AzNZ0uPXmEZN/GHHMmAg3kbM/zrijnd+tAAKVV5PhWXVUuLKJ3Q6wSAxz3WuYG08OaJl3lpV4UFOA==',
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-b': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-b/-/testing-peer-dep-conflict-chain-b-1.0.0.tgz',
            integrity: 'sha512-tbsZ8No4L7h5YiIqDwGlJ14dg44oG4ZstF/wx7eZKUlnZax392thEeac5MNGFsv1T0Uqtiby9+SdpIRpejrHSw==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-c': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-c/-/testing-peer-dep-conflict-chain-c-1.0.0.tgz',
            integrity: 'sha512-173OUwUJK8QN4CGTF+oPHwoOHbUzgxjC3tzg2kBVLE/eak02ZXJrW9l4LmW03vqcToADVhsVMcFLIaAb6yd1mQ==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-d': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-d/-/testing-peer-dep-conflict-chain-d-1.0.0.tgz',
            integrity: 'sha512-zOtmaure/xJHmz7yGU7T33hjV6MZpo8Y6v1GuxDBx0PbqGoCxxCMacNtTUsEL5Sj8T19r5UShGZQmirNqPuhww==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-e': {
            version: '1.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-e/-/testing-peer-dep-conflict-chain-e-1.0.0.tgz',
            integrity: 'sha512-EDuAVgd6DBGe2tKQKdQt7Z6RoptSWQem4W++F+bqC31E0JuRVJHu44sENtIviUGsi0jVJS5xD75cL6kvvbaw/Q==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-single-a': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-a/-/testing-peer-dep-conflict-chain-single-a-1.0.1.tgz',
            integrity: 'sha512-NLHsR3z4e5I7+IXbe8l0SXDSdsghDtbsCMAG3deh21djZAH4dawx0bR/V/knYDrd0OZWdr0jDhivmVm42SmB1w==',
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-single-b': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-b/-/testing-peer-dep-conflict-chain-single-b-1.0.1.tgz',
            integrity: 'sha512-cyXyBAMPJWv28bHI0cJrer64eqQsM59CR+/ideNwthD5X5hZVyvVMTpuai7noDA34jllf9Xgb+jcPgt2xmvR6A==',
            requires: {},
          },
        },
      }),
    })
    createRegistry(t, true)
    t.matchSnapshot(await printIdeal(path, {
      add: [
        '@isaacs/testing-peer-dep-conflict-chain-single-a@2',
        '@isaacs/testing-peer-dep-conflict-chain-single-b@2',
      ],
    }))
  })

  await t.test('conflict, but resolves appropriately with --force', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'x',
        version: '1.0.0',
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': '2',
          '@isaacs/testing-peer-dep-conflict-chain-single-a': '^1.0.1',
          '@isaacs/testing-peer-dep-conflict-chain-single-b': '^1.0.1',
        },
      }),
      'package-lock.json': JSON.stringify({
        name: 'x',
        lockfileVersion: 2,
        requires: true,
        packages: {
          '': {
            dependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '2',
              '@isaacs/testing-peer-dep-conflict-chain-single-a': '^1.0.1',
              '@isaacs/testing-peer-dep-conflict-chain-single-b': '^1.0.1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-a': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-a/-/testing-peer-dep-conflict-chain-a-2.0.0.tgz',
            integrity: 'sha512-B1L3NDBf8/nZSDM+E0AmotxaSGi5e/EUPRpoGLS0nAqulv3itMULe7s4VREyuS195j4JlhJEaz9C8idB9mA8Bw==',
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-b': '2',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-b': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-b/-/testing-peer-dep-conflict-chain-b-2.0.0.tgz',
            integrity: 'sha512-6Lh4Gj5Nl5i+IhYxCjBmD5acTRkSni5m/wjXZCVaj0xJUVaNO+MprVlktUc0w1WN8E6CM4yhrkVdFTMDxBIZ0Q==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-c': '2',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-c': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-c/-/testing-peer-dep-conflict-chain-c-2.0.0.tgz',
            integrity: 'sha512-iRawfr15PBTW8PHYySyCF/DvgNuEy8hCZQfWkLrdfiQvJfbMWsbSLAdX2HBT2hh0pefc0v+vBKpuhPi/jy6pvQ==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-d': '2',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-d': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-d/-/testing-peer-dep-conflict-chain-d-2.0.0.tgz',
            integrity: 'sha512-zDS6IzO10KmLdtrG1m8M5wZ8wzmHPWaUBc4QaqptvI/nhLrgcH8OZB0hoMmK8tQg4MalbOyam4EdKOg7u9kGGg==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-e': '2',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-e': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-e/-/testing-peer-dep-conflict-chain-e-2.0.0.tgz',
            integrity: 'sha512-HEcKq/WWndty//qXYNL9TxDve0FAJqSPAAFU7t6Hm5AtluOGmIPiGUf7Ei9HGe60iBrrfmnzSxfFRG7j0SbW9Q==',
            peer: true,
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '2',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-single-a': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-a/-/testing-peer-dep-conflict-chain-single-a-1.0.1.tgz',
            integrity: 'sha512-NLHsR3z4e5I7+IXbe8l0SXDSdsghDtbsCMAG3deh21djZAH4dawx0bR/V/knYDrd0OZWdr0jDhivmVm42SmB1w==',
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '1',
            },
          },
          'node_modules/@isaacs/testing-peer-dep-conflict-chain-single-b': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-b/-/testing-peer-dep-conflict-chain-single-b-1.0.1.tgz',
            integrity: 'sha512-cyXyBAMPJWv28bHI0cJrer64eqQsM59CR+/ideNwthD5X5hZVyvVMTpuai7noDA34jllf9Xgb+jcPgt2xmvR6A==',
            peerDependencies: {
              '@isaacs/testing-peer-dep-conflict-chain-a': '1',
              '@isaacs/testing-peer-dep-conflict-chain-single-a': '1',
            },
          },
        },
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-a': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-a/-/testing-peer-dep-conflict-chain-a-2.0.0.tgz',
            integrity: 'sha512-B1L3NDBf8/nZSDM+E0AmotxaSGi5e/EUPRpoGLS0nAqulv3itMULe7s4VREyuS195j4JlhJEaz9C8idB9mA8Bw==',
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-b': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-b/-/testing-peer-dep-conflict-chain-b-2.0.0.tgz',
            integrity: 'sha512-6Lh4Gj5Nl5i+IhYxCjBmD5acTRkSni5m/wjXZCVaj0xJUVaNO+MprVlktUc0w1WN8E6CM4yhrkVdFTMDxBIZ0Q==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-c': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-c/-/testing-peer-dep-conflict-chain-c-2.0.0.tgz',
            integrity: 'sha512-iRawfr15PBTW8PHYySyCF/DvgNuEy8hCZQfWkLrdfiQvJfbMWsbSLAdX2HBT2hh0pefc0v+vBKpuhPi/jy6pvQ==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-d': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-d/-/testing-peer-dep-conflict-chain-d-2.0.0.tgz',
            integrity: 'sha512-zDS6IzO10KmLdtrG1m8M5wZ8wzmHPWaUBc4QaqptvI/nhLrgcH8OZB0hoMmK8tQg4MalbOyam4EdKOg7u9kGGg==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-e': {
            version: '2.0.0',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-e/-/testing-peer-dep-conflict-chain-e-2.0.0.tgz',
            integrity: 'sha512-HEcKq/WWndty//qXYNL9TxDve0FAJqSPAAFU7t6Hm5AtluOGmIPiGUf7Ei9HGe60iBrrfmnzSxfFRG7j0SbW9Q==',
            peer: true,
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-single-a': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-a/-/testing-peer-dep-conflict-chain-single-a-1.0.1.tgz',
            integrity: 'sha512-NLHsR3z4e5I7+IXbe8l0SXDSdsghDtbsCMAG3deh21djZAH4dawx0bR/V/knYDrd0OZWdr0jDhivmVm42SmB1w==',
            requires: {},
          },
          '@isaacs/testing-peer-dep-conflict-chain-single-b': {
            version: '1.0.1',
            resolved: 'https://registry.npmjs.org/@isaacs/testing-peer-dep-conflict-chain-single-b/-/testing-peer-dep-conflict-chain-single-b-1.0.1.tgz',
            integrity: 'sha512-cyXyBAMPJWv28bHI0cJrer64eqQsM59CR+/ideNwthD5X5hZVyvVMTpuai7noDA34jllf9Xgb+jcPgt2xmvR6A==',
            requires: {},
          },
        },
      }),
    })
    createRegistry(t, true)
    t.matchSnapshot(await printIdeal(path, {
      force: true,
      add: [
        '@isaacs/testing-peer-dep-conflict-chain-single-a@2',
        '@isaacs/testing-peer-dep-conflict-chain-single-b@2',
      ],
    }), 'succeed if force applied')
    await t.rejects(printIdeal(path, {
      add: [
        '@isaacs/testing-peer-dep-conflict-chain-single-a@2',
        '@isaacs/testing-peer-dep-conflict-chain-single-b@2',
      ],
    }), 'fail without force')
  })
})

t.test('carbonium eslint conflicts', async t => {
  const path = resolve(fixtures, 'carbonium')
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path, {
    add: [
      '@typescript-eslint/eslint-plugin@4',
      '@typescript-eslint/parser@4',
    ],
  }))
})

t.test('peerOptionals that are devDeps or explicit request', async t => {
  const path = resolve(fixtures, 'peer-optional-installs')
  createRegistry(t, true)
  const arb = newArb(path)
  const tree = await arb.buildIdealTree({ add: ['abbrev'] })
  t.matchSnapshot(printTree(tree), 'should install the abbrev dep')
  t.ok(tree.children.get('abbrev'), 'should install abbrev dep')

  t.matchSnapshot(await printIdeal(path, {
    add: ['wrappy'],
    saveType: 'dev',
  }), 'should install the wrappy dep, and not remove from peerDeps')
})

t.test('weird thing when theres a link to ..', async t => {
  // don't set the fsParent of x to y, that's just not how trees work.
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'x',
      version: '1.2.3',
    }),
    y: {
      'package.json': JSON.stringify({
        name: 'y',
        version: '1.2.3',
        dependencies: {
          x: 'file:../',
        },
      }),
    },
  }) + '/y'
  createRegistry(t, false)
  const arb = newArb(path)
  const tree = await arb.buildIdealTree()
  t.equal(tree.children.get('x').target.fsParent, null)
})

t.test('always prefer deduping peer deps', async t => {
  // ink 3.8.0 peer depends on react >=16.8.0, and has deps that peerDepend
  // on react 16.x, so we need to ensure that they get deduped up a level.
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        '@pmmmwh/react-refresh-webpack-plugin': '0.4.2',
        ink: '3.0.8',
        'react-reconciler': '0.25.0',
      },
    }),
  })
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path))
})

t.test('do not ever nest peer deps underneath their dependent ever', async t => {
  // ink 3.8.0 peer depends on react >=16.8.0, and has deps that peerDepend
  // on react 16.x, so we need to ensure that they fail when they cannot be
  // deduped up a level.  Tests for a bug where react 16 would end up nested
  // underneath ink, even though it is a peerDep.
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        treport: '1.0.2',
        // this peer depends on react 17
        'react-reconciler': '0.26.0',
      },
    }),
  })
  createRegistry(t, true)
  await t.rejects(printIdeal(path), { code: 'ERESOLVE' })
})

t.test('properly fail on conflicted peerOptionals', async t => {
  // react-refresh-webpack-plugin has a peerOptional dep on
  // type-fest 0.13.0, but the root package is stipulating 0.12
  // we would not normally install type-fest, but if we DO install it,
  // it must not be a version that conflicts.
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        '@pmmmwh/react-refresh-webpack-plugin': '0.4.2',
        'type-fest': '^0.12.0',
      },
    }),
  })
  createRegistry(t, true)
  await t.rejects(printIdeal(path), { code: 'ERESOLVE' })
})

t.test('properly assign fsParent when paths have .. in them', async t => {
  const path = resolve(fixtures, 'fs-parent-dots/x/y/z')
  createRegistry(t, false)
  const arb = newArb(path)
  const tree = await arb.buildIdealTree()
  t.matchSnapshot(printTree(tree))
  for (const child of tree.children.values()) {
    t.equal(child.isLink, true, 'all children should be links')
    t.equal(tree.inventory.has(child.target), true, 'target should be known')
  }
  for (const node of tree.inventory.filter(n => n.isLink)) {
    const { target } = node
    if (target.location === '../..') {
      t.equal(target.fsParent, null, '../.. has no fsParent')
    } else {
      t.equal(tree.inventory.has(target.fsParent), true, 'other targets have fsParent')
    }
  }
})

t.test('update global', async t => {
  // global root
  // ├─┬ @isaacs/testing-dev-optional-flags@1.0.0
  // │ ├── own-or@1.0.0
  // │ └── wrappy@1.0.2
  // └─┬ once@1.3.1
  //   └── wrappy@1.0.1

  const path = t.testdir({
    node_modules: {
      '@isaacs': {
        'testing-dev-optional-flags': {
          'package.json': JSON.stringify({
            name: '@isaacs/testing-dev-optional-flags',
            version: '1.0.0',
            dependencies: {
              wrappy: '^1.0.2',
              'own-or': '^1.0.0',
            },
          }),
          node_modules: {
            'own-or': {
              'package.json': JSON.stringify({
                name: 'own-or',
                version: '1.0.0',
              }),
            },
            wrappy: {
              'package.json': JSON.stringify({
                name: 'wrappy',
                version: '1.0.0',
              }),
            },
          },
        },
      },
      once: {
        'package.json': JSON.stringify({
          name: 'once',
          version: '1.3.1',
          dependencies: {
            wrappy: '1',
          },
        }),
        node_modules: {
          wrappy: {
            'package.json': JSON.stringify({
              name: 'wrappy',
              version: '1.0.1',
            }),
          },
        },
      },
    },
  })

  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path, { global: true, update: ['abbrev'] }),
    'updating missing dep should have no effect, but fix the invalid node')

  t.matchSnapshot(await printIdeal(path, { global: true, update: ['wrappy'] }),
    'updating sub-dep has no effect, but fixes the invalid node')

  const invalidArgs = [
    'once@1.4.0',
    'once@next',
    'once@^1.0.0',
    'once@>=2.0.0',
    'once@2',
  ]
  for (const updateName of invalidArgs) {
    await t.rejects(
      printIdeal(path, { global: true, update: [updateName] }),
      { code: 'EUPDATEARGS' },
      'should throw an error when using semver ranges'
    )
  }

  t.matchSnapshot(await printIdeal(path, { global: true, update: ['once'] }),
    'update a single dep, also fixes the invalid node')
  t.matchSnapshot(await printIdeal(path, { global: true, update: true }),
    'update all the deps')
})

t.test('update global when nothing in global', async t => {
  const path = t.testdir({
    no_nm: {},
    empty_nm: {
      node_modules: {},
    },
  })
  createRegistry(t, false)
  const opts = { global: true, update: true }
  t.matchSnapshot(await printIdeal(path + '/no_nm', opts),
    'update without node_modules')
  t.matchSnapshot(await printIdeal(path + '/empty_nm', opts),
    'update with empty node_modules')
})

t.test('peer dep that needs to be replaced', async t => {
  // this verifies that the webpack 5 that gets placed by default for
  // the initial dep will be successfully replaced by webpack 4 that
  // webpack-dev-server needs, even though webpack 5 has a dep that
  // peer-depends back on it.
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        '@pmmmwh/react-refresh-webpack-plugin': '^0.4.3',
        'webpack-dev-server': '^3.11.0',
      },
    }),
  })
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path))
})

t.test('transitive conflicted peer dependency', async t => {
  // see test/fixtures/testing-transitive-conflicted-peer/README.md
  // for a thorough explanation.
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        '@isaacs/testing-transitive-conflicted-peer-a': '1',
        '@isaacs/testing-transitive-conflicted-peer-b': '2',
      },
    }),
  })
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path))
  t.matchSnapshot(await printIdeal(path, { force: true }))
  await t.rejects(printIdeal(path, { strictPeerDeps: true }), { code: 'ERESOLVE' })
})

t.test('remove deps when initializing tree from actual tree', async t => {
  const path = t.testdir({
    node_modules: {
      foo: {
        'package.json': JSON.stringify({
          name: 'foo',
          version: '1.2.3',
        }),
      },
    },
  })

  createRegistry(t, false)
  const arb = newArb(path)
  const tree = await arb.buildIdealTree({ rm: ['foo'] })
  t.equal(tree.children.get('foo'), undefined, 'removed foo child')
})

t.test('detect conflicts in transitive peerOptional deps', async t => {
  const base = resolve(fixtures, 'test-conflicted-optional-peer-dep')

  await t.test('nest when peerOptional conflicts', async t => {
    const path = resolve(base, 'nest-peer-optional')
    createRegistry(t, true)
    const tree = await buildIdeal(path)
    t.matchSnapshot(printTree(tree))
    const name = '@isaacs/test-conflicted-optional-peer-dep-peer'
    const peers = tree.inventory.query('name', name)
    t.equal(peers.size, 2, 'installed the peer dep twice to avoid conflict')
  })

  await t.test('omit peerOptionals when not needed for conflicts', async t => {
    const path = resolve(base, 'omit-peer-optional')
    createRegistry(t, true)
    const tree = await buildIdeal(path)
    t.matchSnapshot(printTree(tree))
    const name = '@isaacs/test-conflicted-optional-peer-dep-peer'
    const peers = tree.inventory.query('name', name)
    t.equal(peers.size, 0, 'omit peerOptional, not needed')
  })
})

t.test('do not fail if root peerDep looser than meta peerDep', async t => {
  const path = resolve(fixtures, 'test-peer-looser-than-dev')
  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path))
})

t.test('adding existing dep with updateable version in package.json', async t => {
  const path = t.testdir({
    node_modules: {
      lodash: {
        'package.json': JSON.stringify({
          version: '3.9.1',
        }),
      },
    },
    'package.json': JSON.stringify({
      devDependencies: {
        lodash: '^3.9.1',
      },
    }),
  })

  createRegistry(t, true)
  t.matchSnapshot(await printIdeal(path, { add: ['lodash'] }))
})

t.test('set the current on ERESOLVE triggered by devDeps', async t => {
  // fixes a bug where the dev deps are not loaded properly in the
  // virtual root, leading to incomprehensible ERESOLVE explanations
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root-dev-peer-conflict',
      version: '1.0.0',
      devDependencies: {
        eslint: '^4.19.1',
        'eslint-config-standard': '^11.0.0',
      },
    }),
  })

  createRegistry(t, true)
  const arb = newArb(path)
  await t.rejects(arb.buildIdealTree(), {
    code: 'ERESOLVE',
    current: {
      name: 'eslint',
      version: '4.19.1',
      whileInstalling: {
        name: 'root-dev-peer-conflict',
        version: '1.0.0',
        path: resolve(path),
      },
      location: 'node_modules/eslint',
    },
  })
})

t.test('shrinkwrapped dev/optional deps should not clobber flags', async t => {
  await t.test('optional', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'project',
        version: '1.2.3',
        optionalDependencies: {
          '@isaacs/test-package-with-shrinkwrap': '^1.0.0',
        },
      }),
    })
    createRegistry(t, true)
    const tree = await buildIdeal(path, { complete: true })
    const swName = '@isaacs/test-package-with-shrinkwrap'
    const swDep = tree.children.get(swName)
    const metaDep = swDep.children.get('abbrev')
    t.equal(swDep.optional, true, 'shrinkwrapped dep is optional')
    t.equal(metaDep.optional, true, 'shrinkwrapped metadep optional')

    // make sure we're not just somehow leaving ALL flags true
    t.equal(swDep.dev, false, 'sw dep is not dev')
    t.equal(metaDep.dev, false, 'meta dep is not dev')
  })

  await t.test('dev', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'project',
        version: '1.2.3',
        devDependencies: {
          '@isaacs/test-package-with-shrinkwrap': '^1.0.0',
        },
      }),
    })
    createRegistry(t, true)
    const tree = await buildIdeal(path, { complete: true })
    const swName = '@isaacs/test-package-with-shrinkwrap'
    const swDep = tree.children.get(swName)
    const metaDep = swDep.children.get('abbrev')
    t.equal(swDep.dev, true, 'shrinkwrapped dep is dev')
    t.equal(metaDep.dev, true, 'shrinkwrapped metadep dev')

    // make sure we're not just somehow leaving ALL flags true
    t.equal(swDep.optional, false, 'sw dep is not optional')
    t.equal(metaDep.optional, false, 'meta dep is not optional')
  })
})

t.test('do not ERESOLVE on peerOptionals that are ignored anyway', async t => {
  // this simulates three cases where a conflict occurs during the peerSet
  // generation phase, but will not manifest in the tree building phase.
  const base = resolve(fixtures, 'peer-optional-eresolve')
  const cases = ['a', 'b', 'c', 'd', 'e', 'f']
  for (const c of cases) {
    await t.test(`case ${c}`, async t => {
      createRegistry(t, true)
      const path = resolve(base, c)
      t.matchSnapshot(await printIdeal(path))
    })
  }
})

t.test('allow ERESOLVE to be forced when not in the source', async t => {
  const types = [
    'peerDependencies',
    'optionalDependencies',
    'devDependencies',
    'dependencies',
  ]

  // in these tests, the deps are both of the same type.  b has a peerOptional
  // dep on peer, and peer is a direct dependency of the root.
  await t.test('both direct and peer of the same type', async t => {
    const pj = type => ({
      name: '@isaacs/conflicted-peer-optional-from-dev-dep',
      version: '1.2.3',
      [type]: {
        '@isaacs/conflicted-peer-optional-from-dev-dep-peer': '1',
        '@isaacs/conflicted-peer-optional-from-dev-dep-b': '',
      },
    })

    for (const type of types) {
      await t.test(type, async t => {
        const path = t.testdir({
          'package.json': JSON.stringify(pj(type)),
        })
        createRegistry(t, true)
        t.matchSnapshot(await printIdeal(path, { force: true }), 'use the force')
        t.rejects(printIdeal(path), { code: 'ERESOLVE' }, 'no force')
      })
    }
  })

  // in these, the peer is a peer dep of the root, and b is a different type
  await t.test('peer is peer, b is some other type', async t => {
    t.plan(types.length - 1)
    const pj = type => ({
      name: '@isaacs/conflicted-peer-optional-from-dev-dep',
      version: '1.2.3',
      peerDependencies: {
        '@isaacs/conflicted-peer-optional-from-dev-dep-b': '',
      },
      [type]: {
        '@isaacs/conflicted-peer-optional-from-dev-dep-peer': '1',
      },
    })
    for (const type of types) {
      if (type === 'peerDependencies') {
        continue
      }
      await t.test(type, async t => {
        const path = t.testdir({
          'package.json': JSON.stringify(pj(type)),
        })
        createRegistry(t, true)
        t.matchSnapshot(await printIdeal(path, { force: true }), 'use the force')
        t.rejects(printIdeal(path), { code: 'ERESOLVE' }, 'no force')
      })
    }
  })

  // in these, b is a peer dep, and peer is some other type
  await t.test('peer is peer, b is some other type', async t => {
    const pj = type => ({
      name: '@isaacs/conflicted-peer-optional-from-dev-dep',
      version: '1.2.3',
      peerDependencies: {
        '@isaacs/conflicted-peer-optional-from-dev-dep-peer': '1',
      },
      [type]: {
        '@isaacs/conflicted-peer-optional-from-dev-dep-b': '',
      },
    })
    for (const type of types) {
      if (type === 'peerDependencies') {
        continue
      }
      await t.test(type, async t => {
        const path = t.testdir({
          'package.json': JSON.stringify(pj(type)),
        })
        createRegistry(t, true)
        t.matchSnapshot(await printIdeal(path, { force: true }), 'use the force')
        t.rejects(printIdeal(path), { code: 'ERESOLVE' }, 'no force')
      })
    }
  })
})

t.test('allow a link dep to satisfy a peer dep', async t => {
  const path = t.testdir({
    v2: {
      'package.json': JSON.stringify({
        name: '@isaacs/testing-peer-dep-conflict-chain-v',
        version: '2.0.0',
      }),
    },
    main: {
      'package.json': JSON.stringify({
        name: 'main',
        version: '1.0.0',
        dependencies: {
          '@isaacs/testing-peer-dep-conflict-chain-v': 'file:../v2',
          '@isaacs/testing-peer-dep-conflict-chain-a': '1',
        },
      }),
      node_modules: {
        '@isaacs': {}, // needed for when we create the link
      },
    },
  })

  createRegistry(t, true)
  const add = ['@isaacs/testing-peer-dep-conflict-chain-vv@2']

  // avoids if the link dep is unmet
  t.matchSnapshot(await printIdeal(path + '/main', { add }), 'unmet link avoids conflict')

  // also avoid the conflict if the link is present
  const link = resolve(path, 'main/node_modules/@isaacs/testing-peer-dep-conflict-chain-v')
  fs.symlinkSync(resolve(path, 'v2'), link, 'junction')

  // avoids if the link dep is unmet
  t.matchSnapshot(await printIdeal(path + '/main', { add }), 'reified link avoids conflict')
})

t.test('replace a link with a matching link when the current one is wrong', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        // testing what happens when a user hand-edits the
        // package.json to point to a different target with
        // a matching package.
        x: 'file:correct/x',
        y: 'file:correct/x',
      },
    }),
    correct: {
      x: {
        'package.json': JSON.stringify({
          name: 'x',
          version: '1.2.3',
        }),
      },
    },
    incorrect: {
      x: {
        'package.json': JSON.stringify({
          name: 'x',
          version: '1.2.3',
        }),
      },
    },
    node_modules: {
      x: t.fixture('symlink', '../incorrect/x'),
      y: t.fixture('symlink', '../correct/x'),
    },
    'package-lock.json': JSON.stringify({
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          dependencies: {
            x: 'file:incorrect/x',
            y: 'file:correct/x',
          },
        },
        'incorrect/x': {
          version: '1.2.3',
          name: 'x',
        },
        'node_modules/y': {
          resolved: 'correct/x',
          link: true,
        },
        'correct/x': {
          version: '1.2.3',
          name: 'x',
        },
        'node_modules/x': {
          resolved: 'incorrect/x',
          link: true,
        },
      },
      dependencies: {
        y: {
          version: 'file:correct/x',
        },
        x: {
          version: 'file:incorrect/x',
        },
      },
    }),
  })
  createRegistry(t, false)
  t.matchSnapshot(await printIdeal(path, {
    workspaces: null, // also test that a null workspaces is ignored.
  }), 'replace incorrect with correct')
})

t.test('cannot do workspaces in global mode', async t => {
  createRegistry(t, false)
  t.throws(() => printIdeal(t.testdir(), {
    workspaces: ['a', 'b', 'c'],
    global: true,
  }), { message: 'Cannot operate on workspaces in global mode' })
})

t.test('add packages to workspaces, not root', async t => {
  const path = resolve(__dirname, '../fixtures/workspaces-not-root')

  createRegistry(t, true)
  const addTree = await buildIdeal(path, {
    add: ['wrappy@1.0.1'],
    workspaces: ['a', 'c'],
  })
  t.match(addTree.edgesOut.get('wrappy'), { spec: '1.0.0' })
  const a = addTree.children.get('a').target
  const b = addTree.children.get('b').target
  const c = addTree.children.get('c').target
  t.match(a.edgesOut.get('wrappy'), { spec: '1.0.1' })
  t.equal(b.edgesOut.get('wrappy'), undefined)
  t.match(c.edgesOut.get('wrappy'), { spec: '1.0.1' })
  t.matchSnapshot(printTree(addTree), 'tree with wrappy added to a and c')

  const rmTree = await buildIdeal(path, {
    rm: ['abbrev'],
    workspaces: ['a', 'b'],
  })
  t.match(rmTree.edgesOut.get('abbrev'), { spec: '' })
  t.equal(rmTree.children.get('a').target.edgesOut.get('abbrev'), undefined)
  t.equal(rmTree.children.get('b').target.edgesOut.get('abbrev'), undefined)
  t.match(rmTree.children.get('c').target.edgesOut.get('abbrev'), { spec: '' })
  t.matchSnapshot(printTree(rmTree), 'tree with abbrev removed from a and b')
})

t.test('add one workspace to another', async t => {
  const path = resolve(__dirname, '../fixtures/workspaces-not-root')
  const packageA = resolve(path, 'packages/a')

  createRegistry(t, false)
  const addTree = await buildIdeal(path, {
    add: [packageA],
    workspaces: ['c'],
  })
  const c = addTree.children.get('c').target
  t.match(c.edgesOut.get('a'), { spec: 'file:../a' })
  t.matchSnapshot(printTree(addTree), 'tree with workspace a added to workspace c')
})

t.test('workspace error handling', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
      dependencies: {
        wrappy: '1.0.0',
        abbrev: '',
      },
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
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
            abbrev: '',
          },
        }),
      },
    },
  })
  await t.test('set filter, but no workspaces present', async t => {
    const warnings = warningTracker(t)
    createRegistry(t, false)
    await buildIdeal(resolve(path, 'packages/a'), {
      workspaces: ['a'],
    })
    t.strictSame(warnings, [[
      'warn',
      'workspaces',
      'filter set, but no workspaces present',
    ]], 'got warning')
  })
  await t.test('set filter for workspace that is not present', async t => {
    const warnings = warningTracker(t)
    createRegistry(t, true)
    await buildIdeal(path, {
      workspaces: ['not-here'],
    })
    t.strictSame(warnings, [[
      'warn',
      'workspaces',
      'not-here in filter set, but not in workspaces',
    ]], 'got warning')
  })
})

t.test('avoid dedupe when a dep is bundled', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      bundleDependencies: [
        '@isaacs/testing-bundle-dupes-a',
        '@isaacs/testing-bundle-dupes-b',
      ],
      dependencies: {
        '@isaacs/testing-bundle-dupes-a': '2',
        '@isaacs/testing-bundle-dupes-b': '1',
      },
    }),
  })

  createRegistry(t, true)
  // do our install, prior to the publishing of b@2.1.0
  const startTree = await buildIdeal(path, {
    // date between publish times of b@2.0.0 and b@2.1.0
    // so we get a b@2.0.0 nested
    before: new Date('2021-04-23T16:24:00Z'),
  })
  // this causes it to get the package tree:
  // root
  // +-- b@1
  // +-- a@2
  //     +-- b@2.0
  await startTree.meta.save()
  let b200
  await t.test('initial tree state', async t => {
    const a = startTree.children.get('@isaacs/testing-bundle-dupes-a')
    const b = startTree.children.get('@isaacs/testing-bundle-dupes-b')
    const bNested = a.children.get('@isaacs/testing-bundle-dupes-b')
    t.equal(b.version, '1.0.0')
    t.equal(a.version, '2.0.0')
    t.equal(bNested.version, '2.0.0')
    // save this to synthetically create the dupe later, so we can fix it
    b200 = bNested
  })

  // Now ensure that adding b@2 will install b@2.1.0 AND
  // dedupe the nested b@2.0.0 dep.
  const add = ['@isaacs/testing-bundle-dupes-b@2']
  const newTree = await buildIdeal(path, { add })
  await t.test('did not create dupe', async t => {
    const a = newTree.children.get('@isaacs/testing-bundle-dupes-a')
    const b = newTree.children.get('@isaacs/testing-bundle-dupes-b')
    const bNested = a.children.get('@isaacs/testing-bundle-dupes-b')
    t.equal(b.version, '2.1.0')
    t.equal(a.version, '2.0.0')
    t.notOk(bNested, 'should not have a nested b')
  })

  // now, synthetically create the bug we just verified no longer happens,
  // so that we can ensure that we can fix it when encountered.
  b200.parent = newTree.children.get('@isaacs/testing-bundle-dupes-a')
  await newTree.meta.save()
  fs.writeFileSync(`${path}/package.json`, JSON.stringify({
    bundleDependencies: [
      '@isaacs/testing-bundle-dupes-a',
      '@isaacs/testing-bundle-dupes-b',
    ],
    dependencies: {
      '@isaacs/testing-bundle-dupes-a': '2',
      '@isaacs/testing-bundle-dupes-b': '2',
    },
  }))

  // gut check that we have reproduced the error condition
  await t.test('gut check that dupe synthetically created', async t => {
    const a = newTree.children.get('@isaacs/testing-bundle-dupes-a')
    const b = newTree.children.get('@isaacs/testing-bundle-dupes-b')
    const bNested = a.children.get('@isaacs/testing-bundle-dupes-b')
    t.equal(b.version, '2.1.0')
    t.equal(a.version, '2.0.0')
    t.equal(bNested.version, '2.0.0')
    t.end()
  })

  // now we're in the "oh no, a duplicate" mode.  make sure that we can
  // dedupe out of it through any of these reasonable approaches.
  const check = (t, tree) => {
    const a = tree.children.get('@isaacs/testing-bundle-dupes-a')
    const b = tree.children.get('@isaacs/testing-bundle-dupes-b')
    const bNested = a.children.get('@isaacs/testing-bundle-dupes-b')
    t.equal(b.version, '2.1.0')
    t.equal(a.version, '2.0.0')
    t.notOk(bNested, 'should not have a nested b')
  }

  await t.test('dedupe to remove dupe', async t => {
    check(t, await buildIdeal(path, {
      update: ['@isaacs/testing-bundle-dupes-b'],
      preferDedupe: true,
    }))
  })

  await t.test('update b to remove dupe', async t => {
    check(t, await buildIdeal(path, {
      update: ['@isaacs/testing-bundle-dupes-b'],
    }))
  })

  await t.test('update all to remove dupe', async t => {
    check(t, await buildIdeal(path, { update: true }))
  })

  await t.test('reinstall a to remove dupe', async t => {
    check(t, await buildIdeal(path, {
      add: ['@isaacs/testing-bundle-dupes-a@2'],
    }))
  })

  t.test('reinstall b to remove dupe', async t => {
    const tree = await buildIdeal(path, {
      add: ['@isaacs/testing-bundle-dupes-b@2'],
    })
    check(t, tree)
  })
})

t.test('upgrade a partly overlapping peer set', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        '@isaacs/testing-peer-dep-conflict-chain-b': '2',
        '@isaacs/testing-peer-dep-conflict-chain-m': '2',
      },
    }),
  })
  createRegistry(t, true)
  const tree = await buildIdeal(path)
  await tree.meta.save()
  t.matchSnapshot(await printIdeal(path, {
    add: ['@isaacs/testing-peer-dep-conflict-chain-b@3'],
  }), 'should be able to upgrade dep, nesting the conflict')
})

t.test('fail to upgrade a partly overlapping peer set', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      dependencies: {
        '@isaacs/testing-peer-dep-conflict-chain-v': '2',
        '@isaacs/testing-peer-dep-conflict-chain-y': '2',
        '@isaacs/testing-peer-dep-conflict-chain-m': '2',
      },
    }),
  })
  createRegistry(t, true)
  const tree = await buildIdeal(path)
  await tree.meta.save()
  await t.rejects(printIdeal(path, {
    add: ['@isaacs/testing-peer-dep-conflict-chain-y@3'],
  }), { code: 'ERESOLVE' }, 'should not be able to upgrade dep')
})

t.test('add deps to workspaces', async t => {
  const fixtureDef = {
    'package.json': JSON.stringify({
      workspaces: [
        'packages/*',
      ],
      dependencies: {
        mkdirp: '^1.0.4',
        minimist: '1',
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
  const path = t.testdir(fixtureDef)

  t.test('no args', async t => {
    createRegistry(t, true)
    const tree = await buildIdeal(path)
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp').version, '0.5.5')
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.matchSnapshot(printTree(tree))
  })

  t.test('add mkdirp 0.5.0 to b', async t => {
    createRegistry(t, true)
    const tree = await buildIdeal(path, { workspaces: ['b'], add: ['mkdirp@0.5.0'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp').version, '0.5.5')
    t.equal(tree.children.get('b').target.children.get('mkdirp').version, '0.5.0')
    t.matchSnapshot(printTree(tree))
  })

  t.test('remove mkdirp from a', async t => {
    createRegistry(t, true)
    const tree = await buildIdeal(path, { workspaces: ['a'], rm: ['mkdirp'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.matchSnapshot(printTree(tree))
  })

  t.test('upgrade mkdirp in a, dedupe on root', async t => {
    createRegistry(t, true)
    const tree = await buildIdeal(path, { workspaces: ['a'], add: ['mkdirp@1'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a').target.edgesOut.get('mkdirp').spec, '1')
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.matchSnapshot(printTree(tree))
  })

  t.test('KEEP in the root, prune out unnecessary dupe', async t => {
    const path = t.testdir(fixtureDef)
    const registry = createRegistry(t, true)
    registry.audit()
    const arb = newArb(path)
    // reify first so that the other mkdirp is present in the tree
    await arb.reify()
    const tree = await buildIdeal(path, { workspaces: ['a'], add: ['mkdirp@1'] })
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp'), undefined)
    t.equal(tree.children.get('a').target.edgesOut.get('mkdirp').spec, '1')
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.matchSnapshot(printTree(tree))
  })
})

t.test('add deps and include workspace-root', async t => {
  const fixtureDef = {
    'package.json': JSON.stringify({
      workspaces: [
        'packages/*',
      ],
      dependencies: {
        mkdirp: '^1.0.4',
        minimist: '1',
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
  const path = t.testdir(fixtureDef)

  t.test('no args', async t => {
    createRegistry(t, true)
    const tree = await buildIdeal(path)
    t.equal(tree.children.get('mkdirp').version, '1.0.4')
    t.equal(tree.children.get('a').target.children.get('mkdirp').version, '0.5.5')
    t.equal(tree.children.get('b').target.children.get('mkdirp'), undefined)
    t.ok(tree.edgesOut.has('mkdirp'))
    t.matchSnapshot(printTree(tree))
  })

  t.test('add mkdirp 0.5.0 to b', async t => {
    createRegistry(t, true)
    const tree = await buildIdeal(path, { workspaces: ['b'], add: ['mkdirp@0.5.0'], includeWorkspaceRoot: true })
    t.equal(tree.children.get('mkdirp').version, '0.5.0')
    t.ok(tree.edgesOut.has('mkdirp'))
    t.matchSnapshot(printTree(tree))
  })
})

t.test('inflates old lockfile with hasInstallScript', async t => {
  const path = t.testdir({
    'package-lock.json': JSON.stringify({
      requires: true,
      lockfileVersion: 1,
      dependencies: {
        esbuild: {
          version: '0.11.10',
          resolved: 'https://registry.npmjs.org/esbuild/-/esbuild-0.11.10.tgz',
          integrity: 'sha512-XvGbf+UreVFA24Tlk6sNOqNcvF2z49XAZt4E7A4H80+yqn944QOLTTxaU0lkdYNtZKFiITNea+VxmtrfjvnLPA==',
        },
      },
    }),
    'package.json': JSON.stringify({
      dependencies: {
        esbuild: '^0.11.10',
      },
    }),
    node_modules: {
      esbuild: {
        'package.json': JSON.stringify({
          name: 'esbuild',
          scripts: {
            postinstall: 'node install.js',
          },
          version: '0.11.10',
        }),
      },
    },
  })
  createRegistry(t, true)

  const tree = await buildIdeal(path, {
    add: ['esbuild@0.11.10'],
  })

  t.equal(tree.children.get('esbuild').hasInstallScript, true)
})

t.test('update a global space that contains a link', async t => {
  const path = t.testdir({
    target: {
      'package.json': JSON.stringify({
        name: 'once',
        version: '1.0.0-foo',
      }),
    },
    node_modules: {
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.0.0',
        }),
      },
      once: t.fixture('symlink', '../target'),
    },
  })
  createRegistry(t, true)
  const tree = await buildIdeal(path, { update: true, global: true })
  t.matchSnapshot(printTree(tree))
  t.equal(tree.children.get('once').isLink, true)
})

t.test('peer conflicts between peer sets in transitive deps', async t => {
  // caused an infinite loop in https://github.com/npm/arborist/issues/325,
  // which is the reason for the package name.
  await t.test('y and j@2 at root, x and j@1 underneath a', async t => {
    const path = t.testdir({
      'package.json': '{}',
    })
    createRegistry(t, true)
    const warnings = warningTracker(t)
    const tree = await buildIdeal(path, {
      add: ['@isaacs/peer-dep-conflict-infinite-loop-a@1'],
    })
    t.strictSame(warnings, [])
    const a = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-a')
    const j = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const x = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const y = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    const aj = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const ax = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const ay = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    t.equal(a.version, '1.0.0')
    t.equal(y.version, '1.0.0')
    t.equal(j.version, '2.0.0')
    t.notOk(x)
    t.equal(ax.version, '1.0.0')
    t.equal(aj.version, '1.0.0')
    t.notOk(ay)
  })

  await t.test('x and j@1 at root, y and j@2 underneath a', async t => {
    const path = t.testdir({
      'package.json': '{}',
    })
    createRegistry(t, true)
    const warnings = warningTracker(t)
    const tree = await buildIdeal(path, {
      add: ['@isaacs/peer-dep-conflict-infinite-loop-a@2'],
    })
    t.strictSame(warnings, [])
    const a = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-a')
    const j = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const x = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const y = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    const aj = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const ax = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const ay = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    t.equal(a.version, '2.0.0')
    t.equal(x.version, '1.0.0')
    t.equal(j.version, '1.0.0')
    t.notOk(y)
    t.equal(ay.version, '1.0.0')
    t.equal(aj.version, '2.0.0')
    t.notOk(ax)
  })

  await t.test('get warning, x and j@1 in root, put y and j@3 in a', async t => {
    const path = t.testdir({
      'package.json': '{}',
    })
    createRegistry(t, true)
    const warnings = warningTracker(t)
    const tree = await buildIdeal(path, {
      add: ['@isaacs/peer-dep-conflict-infinite-loop-a@3'],
    })
    const w = warnings
    t.match(w, [['warn', 'ERESOLVE', 'overriding peer dependency', {
      code: 'ERESOLVE',
    }]], 'warning is an ERESOLVE')
    t.equal(w.length, 1, 'one warning')
    t.matchSnapshot(normalizePaths(w[0][3]), 'ERESOLVE explanation')
    const a = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-a')
    const j = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const x = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const y = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    const aj = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const ax = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const ay = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    t.equal(a.version, '3.0.0')
    t.equal(x.version, '1.0.0')
    t.equal(j.version, '1.0.0')
    t.notOk(y)
    t.equal(ay.version, '1.0.0')
    t.equal(aj.version, '3.0.0')
    t.notOk(ax)
  })

  await t.test('x and j@1 at root, y and j@2 underneath a (no a->j dep)', async t => {
    const path = t.testdir({
      'package.json': '{}',
    })
    const warnings = warningTracker(t)
    createRegistry(t, true)
    const tree = await buildIdeal(path, {
      add: ['@isaacs/peer-dep-conflict-infinite-loop-a@4'],
    })
    t.strictSame(warnings, [], 'no warnings')

    const a = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-a')
    const j = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const x = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const y = tree.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    const aj = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-j')
    const ax = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-x')
    const ay = a.children.get('@isaacs/peer-dep-conflict-infinite-loop-y')
    t.equal(a.version, '4.0.0')
    t.equal(x.version, '1.0.0')
    t.equal(j.version, '1.0.0')
    t.notOk(y)
    t.equal(ay.version, '1.0.0')
    t.equal(aj.version, '2.0.0')
    t.notOk(ax)
  })
})

t.test('competing peerSets resolve in both root and workspace', async t => {
  // The following trees caused an infinite loop in a workspace
  // https://github.com/npm/cli/issues/3933

  const rootAndWs = async dependencies => {
    const fixt = t.testdir({
      root: {
        'package.json': JSON.stringify({
          name: 'root',
          version: '1.0.0',
          dependencies,
        }),
      },
      ws: {
        'package.json': JSON.stringify({
          name: 'workspace',
          version: '1.0.0',
          workspaces: ['a'],
        }),
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            version: '1.0.0',
            dependencies,
          }),
        },
      },
    })
    return [
      await buildIdeal(resolve(fixt, 'root')),
      await buildIdeal(resolve(fixt, 'ws')),
    ]
  }

  await t.test('overlapping peerSets dont warn', async t => {
    // This should not cause a warning because replacing `c@2` and `d@2`
    // with `c@1` and `d@1` is still valid.
    //
    // ```
    // project -> (a@1)
    // a@1 -> (b), PEER(c@1||2), PEER(d@1||2)
    // b -> PEER(c@1), PEER(d@1)
    // c -> ()
    // d@1 -> PEER(c@1)
    // d@2 -> PEER(c@2)
    // ```

    createRegistry(t, true)
    const warnings = warningTracker(t)
    const [rootTree, wsTree] = await rootAndWs({
      '@lukekarrys/workspace-peer-dep-infinite-loop-a': '1',
    })

    const rootA = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-a')
    const rootB = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-b')
    const rootC = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-c')
    const rootD = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-d')

    const wsA = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-a')
    const wsB = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-b')
    const wsC = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-c')
    const wsD = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-d')

    t.equal(rootA.version, '1.0.0', 'root a version')
    t.equal(rootB.version, '1.0.0', 'root b version')
    t.equal(rootC.version, '1.0.0', 'root c version')
    t.equal(rootD.version, '1.0.0', 'root d version')
    t.equal(wsA.version, '1.0.0', 'workspace a version')
    t.equal(wsB.version, '1.0.0', 'workspace b version')
    t.equal(wsC.version, '1.0.0', 'workspace c version')
    t.equal(wsD.version, '1.0.0', 'workspace d version')

    const [rootWarnings = [], wsWarnings = []] = warnings
    // TODO: these warn for now but shouldnt
    // https://github.com/npm/arborist/issues/347
    t.comment('FIXME')
    t.match(rootWarnings, ['warn', 'ERESOLVE', 'overriding peer dependency', {
      code: 'ERESOLVE',
    }], 'root warning is an ERESOLVE')
    t.match(wsWarnings, ['warn', 'ERESOLVE', 'overriding peer dependency', {
      code: 'ERESOLVE',
    }], 'workspace warning is an ERESOLVE')

    t.matchSnapshot(normalizePaths(rootWarnings[3]), 'root warnings')
    t.matchSnapshot(normalizePaths(wsWarnings[3]), 'workspace warnings')
    t.matchSnapshot(printTree(rootTree), 'root tree')
    t.matchSnapshot(printTree(wsTree), 'workspace tree')
  })

  await t.test('conflicting peerSets do warn', async t => {
    // ```
    // project -> (a@2)
    // a@2 -> (b), PEER(c@2), PEER(d@2)
    // b -> PEER(c@1), PEER(d@1)
    // c -> ()
    // d@1 -> PEER(c@1)
    // d@2 -> PEER(c@2)
    // ```

    createRegistry(t, true)
    const warnings = warningTracker(t)
    const [rootTree, wsTree] = await rootAndWs({
      // It's 2.0.1 because I messed up publishing 2.0.0
      '@lukekarrys/workspace-peer-dep-infinite-loop-a': '2.0.1',
    })

    const rootA = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-a')
    const rootB = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-b')
    const rootC = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-c')
    const rootD = rootTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-d')

    const wsA = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-a')
    const wsB = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-b')
    const wsC = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-c')
    const wsD = wsTree.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-d')

    const wsTarget = wsTree.children.get('a').target

    const wsTargetC = wsTarget.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-c')
    const wsTargetD = wsTarget.children.get('@lukekarrys/workspace-peer-dep-infinite-loop-d')

    t.equal(rootA.version, '2.0.1', 'root a version')
    t.equal(rootB.version, '1.0.0', 'root b version')
    t.equal(rootC.version, '2.0.0', 'root c version')
    t.equal(rootD.version, '2.0.0', 'root d version')

    t.equal(wsA.version, '2.0.1', 'workspace a version')
    t.equal(wsB.version, '1.0.0', 'workspace b version')

    // TODO: these should be 2.0.0 also?
    t.comment('FIXME')
    t.equal(wsC.version, '1.0.0', 'workspace c version')
    t.equal(wsD.version, '1.0.0', 'workspace d version')

    // TODO: these should not be undefined
    // https://github.com/npm/arborist/issues/348
    t.comment('FIXME')
    t.equal((wsTargetC || {}).version, undefined, 'workspace target c version')
    t.equal((wsTargetD || {}).version, undefined, 'workspace target d version')

    const [rootWarnings, wsWarnings] = warnings
    t.match(rootWarnings, ['warn', 'ERESOLVE', 'overriding peer dependency', {
      code: 'ERESOLVE',
    }], 'root warning is an ERESOLVE')
    t.match(wsWarnings, ['warn', 'ERESOLVE', 'overriding peer dependency', {
      code: 'ERESOLVE',
    }], 'workspace warning is an ERESOLVE')

    t.matchSnapshot(normalizePaths(rootWarnings[3]), 'root warnings')
    t.matchSnapshot(normalizePaths(wsWarnings[3]), 'workspace warnings')
    t.matchSnapshot(printTree(rootTree), 'root tree')
    t.matchSnapshot(printTree(wsTree), 'workspace tree')
  })
})

t.test('overrides', async t => {
  await t.test('throws when override conflicts with dependencies', async (t) => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          abbrev: '1.0.3',
        },
        overrides: {
          abbrev: '1.1.1',
        },
      }),
    })

    createRegistry(t, false)
    await t.rejects(buildIdeal(path), { code: 'EOVERRIDE' }, 'throws EOVERRIDE')
  })

  await t.test('throws when override conflicts with devDependencies', async (t) => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        devDependencies: {
          abbrev: '1.0.3',
        },
        overrides: {
          abbrev: '1.1.1',
        },
      }),
    })

    createRegistry(t, false)
    await t.rejects(buildIdeal(path), { code: 'EOVERRIDE' }, 'throws EOVERRIDE')
  })

  await t.test('throws when override conflicts with peerDependencies', async (t) => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        peerDependencies: {
          abbrev: '1.0.3',
        },
        overrides: {
          abbrev: '1.1.1',
        },
      }),
    })

    createRegistry(t, false)
    await t.rejects(buildIdeal(path), { code: 'EOVERRIDE' }, 'throws EOVERRIDE')
  })

  t.test('overrides a nested dependency', async (t) => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '1.0.1',
        },
        overrides: {
          bar: '2.0.0',
        },
      }),
    })
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true)

    const fooBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(fooBarEdge.valid, true)
    t.equal(fooBarEdge.to.version, '2.0.0')
  })

  t.test('overrides a nested dependency with a more specific override', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '1.0.1',
          bar: '2.0.0',
        },
        overrides: {
          foo: {
            bar: '2.0.0',
          },
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true)

    const fooBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(fooBarEdge.valid, true)
    t.equal(fooBarEdge.to.version, '2.0.0')

    const barEdge = tree.edgesOut.get('bar')
    t.equal(barEdge.valid, true)
    t.equal(barEdge.to.version, '2.0.0')
  })

  t.test('does not override a nested dependency when parent spec does not match', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest, times: 2 })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '1.0.1',
          bar: '2.0.0',
        },
        overrides: {
          'foo@2': {
            bar: '2.0.0',
          },
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true)

    const fooBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(fooBarEdge.valid, true)
    t.equal(fooBarEdge.to.version, '1.0.1')

    const barEdge = tree.edgesOut.get('bar')
    t.equal(barEdge.valid, true)
    t.equal(barEdge.to.version, '2.0.0')
  })

  t.test('overrides a nested dependency that also exists as a direct dependency', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '2.0.0',
          bar: '1.0.1',
        },
        overrides: {
          foo: {
            bar: '1.0.1',
          },
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true, 'foo is valid')
    t.equal(fooEdge.to.version, '2.0.0')

    const barEdge = tree.edgesOut.get('bar')
    t.equal(barEdge.valid, true, 'top level bar is valid')
    t.equal(barEdge.to.version, '1.0.1')

    const nestedBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(nestedBarEdge.valid, true, 'nested bar is valid')
    t.equal(nestedBarEdge.to.version, '1.0.1', 'nested bar version was overridden')

    t.equal(barEdge.to, nestedBarEdge.to, 'deduplicated tree correctly')
  })

  t.test('overrides a nested dependency that also exists as a direct dependency without a top level specifier', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '2.0.0',
          bar: '1.0.1',
        },
        overrides: {
          bar: '1.0.1', // this override is allowed because the spec matches the dep
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true, 'foo is valid')
    t.equal(fooEdge.to.version, '2.0.0')

    const barEdge = tree.edgesOut.get('bar')
    t.equal(barEdge.valid, true, 'top level bar is valid')
    t.equal(barEdge.to.version, '1.0.1')

    const nestedBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(nestedBarEdge.valid, true, 'nested bar is valid')
    t.equal(nestedBarEdge.to.version, '1.0.1', 'nested bar version was overridden')

    t.equal(barEdge.to, nestedBarEdge.to, 'deduplicated tree correctly')
  })

  t.test('overrides a nested dependency with a reference to a direct dependency', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '2.0.0',
          bar: '1.0.1',
        },
        overrides: {
          foo: {
            bar: '$bar',
          },
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true, 'foo is valid')
    t.equal(fooEdge.to.version, '2.0.0')

    const barEdge = tree.edgesOut.get('bar')
    t.equal(barEdge.valid, true, 'top level bar is valid')
    t.equal(barEdge.to.version, '1.0.1')

    const nestedBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(nestedBarEdge.valid, true, 'nested bar is valid')
    t.equal(nestedBarEdge.to.version, '1.0.1', 'nested bar version was overridden')

    t.equal(barEdge.to, nestedBarEdge.to, 'deduplicated tree correctly')
  })

  t.test('overrides a nested dependency with a reference to a direct dependency without a top level identifier', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '2.0.0',
          bar: '1.0.1',
        },
        overrides: {
          bar: '$bar',
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true, 'foo is valid')
    t.equal(fooEdge.to.version, '2.0.0')

    const barEdge = tree.edgesOut.get('bar')
    t.equal(barEdge.valid, true, 'top level bar is valid')
    t.equal(barEdge.to.version, '1.0.1')

    const nestedBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(nestedBarEdge.valid, true, 'nested bar is valid')
    t.equal(nestedBarEdge.to.version, '1.0.1', 'nested bar version was overridden')

    t.equal(barEdge.to, nestedBarEdge.to, 'deduplicated tree correctly')
  })

  t.test('overrides a peerDependency', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '1.0.1',
        },
        overrides: {
          foo: {
            bar: '2.0.0',
          },
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true, 'foo is valid')
    t.equal(fooEdge.to.version, '1.0.1')

    const nestedBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(nestedBarEdge.valid, true, 'peer bar is valid')
    t.equal(nestedBarEdge.to.version, '2.0.0', 'peer bar version was overridden')
  })

  t.test('overrides a peerDependency without top level specifier', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    await registry.package({ manifest: fooManifest })
    await registry.package({ manifest: barManifest })

    // this again with no foo
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '1.0.1',
        },
        overrides: {
          bar: '2.0.0',
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true, 'foo is valid')
    t.equal(fooEdge.to.version, '1.0.1')

    const nestedBarEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(nestedBarEdge.valid, true, 'peer bar is valid')
    t.equal(nestedBarEdge.to.version, '2.0.0', 'peer bar version was overridden')
  })

  t.test('can override inside a cyclical dep chain', async (t) => {
    const registry = createRegistry(t, false)
    const fooPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { bar: '1.0.0' } },
      { version: '1.0.1', dependencies: { bar: '1.0.1' } },
      { version: '2.0.0', dependencies: { bar: '2.0.0' } },
    ], 'foo')
    const fooManifest = registry.manifest({ name: 'foo', packuments: fooPackuments })
    const barPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { baz: '1.0.0' } },
      { version: '1.0.1', dependencies: { baz: '1.0.1' } },
      { version: '2.0.0', dependencies: { baz: '2.0.0' } },
    ], 'bar')
    const barManifest = registry.manifest({ name: 'bar', packuments: barPackuments })
    const bazPackuments = registry.packuments([
      { version: '1.0.0', dependencies: { foo: '1.0.0' } },
      { version: '1.0.1', dependencies: { foo: '1.0.1' } },
      { version: '2.0.0', dependencies: { foo: '2.0.0' } },
    ], 'baz')
    const bazManifest = registry.manifest({ name: 'baz', packuments: bazPackuments })
    await registry.package({ manifest: fooManifest, times: 2 })
    await registry.package({ manifest: barManifest, times: 2 })
    await registry.package({ manifest: bazManifest, times: 2 })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '1.0.1',
        },
        overrides: {
          foo: {
            foo: '2.0.0',
          },
        },
      }),
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true, 'foo is valid')
    t.equal(fooEdge.to.version, '1.0.1')

    const barEdge = fooEdge.to.edgesOut.get('bar')
    t.equal(barEdge.valid, true, 'bar is valid')
    t.equal(barEdge.to.version, '1.0.1', 'bar version is correct')

    const bazEdge = barEdge.to.edgesOut.get('baz')
    t.equal(bazEdge.valid, true, 'baz is valid')
    t.equal(bazEdge.to.version, '1.0.1', 'baz version is correct')

    const fooBazEdge = bazEdge.to.edgesOut.get('foo')
    t.equal(fooBazEdge.valid, true, 'cyclical foo is valid')
    t.equal(fooBazEdge.to.version, '2.0.0', 'override broke the cycle')
  })

  t.test('can fix an ERESOLVE with overrides', async (t) => {
    // this tree creates an ERESOLVE due to a@1 having a peer on b@1
    // and d@2 having a peer on b@2, to fix it we override the a@1 peer
    // to be b@2
    const registry = createRegistry(t, false)
    const aPackuments = registry.packuments([
      { version: '1.0.0', peerDependencies: { b: '1.0.0' } },
    ], 'a')
    const aManifest = registry.manifest({ name: 'a', packuments: aPackuments })
    const bPackuments = registry.packuments([
      { version: '1.0.0', peerDependencies: { c: '2.0.0' } },
      { version: '2.0.0', peerDependencies: { c: '2.0.0' } },
    ], 'b')
    const bManifest = registry.manifest({ name: 'b', packuments: bPackuments })
    const cPackuments = registry.packuments(['2.0.0'], 'c')
    const cManifest = registry.manifest({ name: 'c', packuments: cPackuments })
    const dPackuments = registry.packuments([
      { version: '2.0.0', peerDependencies: { b: '2.0.0' } },
    ], 'd')
    const dManifest = registry.manifest({ name: 'd', packuments: dPackuments })
    await registry.package({ manifest: aManifest, times: 2 })
    await registry.package({ manifest: bManifest, times: 4 })
    await registry.package({ manifest: cManifest, times: 2 })
    await registry.package({ manifest: dManifest, times: 2 })

    const pkg = {
      name: 'root',
      dependencies: {
        a: '1.x',
        d: '2.x',
      },
    }

    // start off with no overrides, prove we get an ERESOLVE
    const path = t.testdir({
      'package.json': JSON.stringify(pkg),
    })

    await t.rejects(buildIdeal(path), { code: 'ERESOLVE' }, 'prove we have an ERESOLVE')

    // add the override and overwrite the existing package.json
    pkg.overrides = { a: { b: '2' } }
    fs.writeFileSync(resolve(path, 'package.json'), JSON.stringify(pkg))

    const tree = await buildIdeal(path)

    const aEdge = tree.edgesOut.get('a')
    t.equal(aEdge.valid, true, 'a is valid')
    t.equal(aEdge.to.version, '1.0.0', 'a is 1.0.0')

    const abEdge = aEdge.to.edgesOut.get('b')
    t.equal(abEdge.valid, true, 'a->b is valid')
    t.equal(abEdge.to.version, '2.0.0', 'a->b was overridden to 2.0.0')

    const dEdge = tree.edgesOut.get('d')
    t.equal(dEdge.valid, true, 'd is valid')
    t.equal(dEdge.to.version, '2.0.0', 'd is 2.0.0')

    const dbEdge = dEdge.to.edgesOut.get('b')
    t.equal(dbEdge.valid, true, 'd->b is valid')
    t.equal(dbEdge.to.version, '2.0.0', 'd->b is 2.0.0')

    t.equal(abEdge.to, dbEdge.to, 'a->b and d->b point to same node')

    const bcEdge = abEdge.to.edgesOut.get('c')
    t.equal(bcEdge.valid, true, 'b->c is valid')
    t.equal(bcEdge.to.version, '2.0.0', 'b->c is 2.0.0')
  })

  t.test('overrides a workspace dependency', async (t) => {
    const registry = createRegistry(t, false)
    const packuments = registry.packuments(['1.0.0', '1.0.1', '2.0.0'], 'bar')
    const manifest = registry.manifest({ name: 'bar', packuments })
    await registry.package({ manifest })

    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        dependencies: {
          foo: '1.0.1',
        },
        overrides: {
          bar: '2.0.0',
        },
        workspaces: [
          './workspaces/*',
        ],
      }),
      workspaces: {
        foo: {
          'package.json': JSON.stringify({
            name: 'foo',
            version: '1.0.1',
            dependencies: {
              bar: '1.0.0',
            },
          }),
        },
      },
    })

    const tree = await buildIdeal(path)

    const fooEdge = tree.edgesOut.get('foo')
    t.equal(fooEdge.valid, true)

    // fooEdge.to is a link, so we need to look at the target for edgesOut
    const fooBarEdge = fooEdge.to.target.edgesOut.get('bar')
    t.equal(fooBarEdge.valid, true)
    t.equal(fooBarEdge.to.version, '2.0.0')
  })
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
  const tree = await buildIdeal(path)
  t.matchSnapshot(String(tree.meta))
})

t.test('should take devEngines in account', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'empty-update',
      devEngines: {
        runtime: {
          name: 'node',
        },
      },
    }),
  })
  createRegistry(t, false)
  const tree = await buildIdeal(path)
  t.matchSnapshot(String(tree.meta))
})
