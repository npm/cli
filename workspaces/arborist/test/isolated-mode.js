const tap = require('tap')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')

const oldMap = Map

class newMap extends oldMap {
  get (prop) {
    const newThis = this.__target || this
    return oldMap.prototype.get.bind(newThis)(prop)
  }
}
Map = newMap

const getTempDir = () => fs.realpathSync(os.tmpdir())

const Arborist = require('../lib/arborist')
const { getRepo } = require('./fixtures/isolated-nock')

/**
 * The testing framework here is work in progress, in particular it does not have nice ergonomics.
 * The syntactic sugar for this framework will be introduced over time as we add more features.
 *
 * The framework has two parts:
 * - Mocking: The tool generates a test repo based on a declarative list of packages.
 * - Asserting: Some generic rules are defined which assert a particular contract of a resolved dependency graph.
 *     For each test we declaratively define the expected resolved dependency graph and apply all the rules to it.
 *     This validates that arborist produced the expected dependency graph and respect all the contracts set by the rules.
 *
 * The automatic assertions aims to make new tests easy.
 * A rule needs to be written only once and can be asserted against many graphs cheaply.
 * The only part that needs to be produced by hand is the conversion from the list of packages to a resolved dependency graph.
 * Automating this part would mean reimplementing the full resolution algorithm for the tests, this would be error prone.
 * Manually defining declaratively the input and the output of arborist is what gives us confidence that the tests do what
 * we want.
 *
 **/

const rule1 = {
  description: 'Any package (except root package and workspace) should be able to require itself.',
  apply: (t, dir, resolvedGraph, alreadyAsserted) => {
    const graph = parseGraph(resolvedGraph)
    const allPackages = getAllPackages(withRequireChain(graph))
    allPackages.filter(p => p.chain.length !== 0).forEach(p => {
      const resolveChain = [...p.chain, p.name]
      const key = p.initialDir + ' => ' + resolveChain.join(' => ')
      if (alreadyAsserted.has(key)) {
        return
      }
      alreadyAsserted.add(key)
      t.ok(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
           `Rule 1: Package "${[p.initialDir.replace('packages/', ''), ...p.chain].join(' => ')}" should have access to itself using its own name.`)
    })
  },
}

const rule2 = {
  description: 'Packages can require their resolved dependencies.',
  apply: (t, dir, resolvedGraph, alreadyAsserted) => {
    const graph = parseGraph(resolvedGraph)
    const allPackages = getAllPackages(withRequireChain(graph))
    allPackages.forEach(p => {
      (p.dependencies || []).filter(d => !isLoopToken(d)).map(d => d.name).forEach(n => {
        const resolveChain = [...p.chain, n]
        const key = p.initialDir + ' => ' + resolveChain.join(' => ')
        if (alreadyAsserted.has(key)) {
          return
        }
        alreadyAsserted.add(key)
        t.ok(path.join(dir, p.initialDir),
             `Rule 2: ${p.chain.length === 0 && p.initialDir === '.' ? 'The root' : `Package "${[p.initialDir.replace('packages/', ''), ...p.chain].join(' => ')}"`} should have access to "${n}" because it has it as a resolved dependency.`)
      })
    })
    // testing circular deps
    allPackages.forEach(p => {
      (p.dependencies || []).filter(d => isLoopToken(d)).forEach(token => {
        const back = parseLoopToken(token)
        const n = p.chain.slice(-1 - back)[0] // getting the name of the circular dep by going back in the chain
        const resolveChain = [...p.chain, n]
        const key = p.initialDir + ' => ' + resolveChain.join(' => ')
        if (alreadyAsserted.has(key)) {
          return
        }
        alreadyAsserted.add(key)
        t.ok(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
             `Rule 2: ${p.chain.length === 0 && p.initialDir === '.' ? 'The root' : `Package "${[p.initialDir.replace('packages/', ''), ...p.chain].join(' => ')}"`} should have access to "${n}" because it has it as a resolved dependency.`)
      })
    })
  },
}

const rule3 = {
  description: 'Any package can require a package installed at the root.',
  apply: (t, dir, resolvedGraph, alreadyAsserted) => {
    const graph = parseGraph(resolvedGraph)
    const rootDependencies = graph.root.dependencies.map(o => o.name)
    const allPackages = getAllPackages(withRequireChain(graph))
    allPackages.forEach(p => {
      rootDependencies.forEach(d => {
        const resolveChain = [...p.chain, d]
        const key = p.initialDir + ' => ' + resolveChain.join(' => ')
        if (alreadyAsserted.has(key)) {
          return
        }
        alreadyAsserted.add(key)
        t.ok(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
             `Rule 3: ${p.chain.length === 0 && p.initialDir === '.' ? 'The root' : `Package "${[p.initialDir.replace('packages/', ''), ...p.chain].join(' => ')}"`} should have access to "${d}" because it is a root dependency.`)
      })
    })
  },
}

const rule4 = {
  description: 'Packages cannot require packages that are not in their dependencies, not root dependencies or not themselves.',
  apply: (t, dir, resolvedGraph, alreadyAsserted) => {
    const graph = parseGraph(resolvedGraph)
    const allPackages = getAllPackages(withRequireChain(graph))
    const allPackageNames = allPackages.filter(p => p.chain.length !== 0 || p.initialDir !== '.').map(o => o.name)
    const rootDependencyNames = graph.root.dependencies.map(o => o.name)
    allPackages.forEach(p => {
      const resolvedDependencyNames = (p.dependencies || [])
        .filter(d => !isLoopToken(d))
        .map(d => d.name)
        .concat((p.dependencies || [])
          .filter(d => isLoopToken(d))
          .map(t => {
            const back = parseLoopToken(t)
            return p.chain.slice(-1 - back)[0] // getting the name of the circular dep by going back in the chain
          }))
      allPackageNames.filter(n => !rootDependencyNames.includes(n))
        .filter(n => !resolvedDependencyNames.includes(n))
        .filter(n => n !== p.name)
        .forEach(n => {
          const resolveChain = [...p.chain, n]
          const key = p.initialDir + ' => ' + resolveChain.join(' => ')
          if (alreadyAsserted.has(key)) {
            return
          }
          alreadyAsserted.add(key)
          t.notOk(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
          `Rule 4: ${p.chain.length === 0 && p.initialDir === '.' ? 'The root' : `Package "${[p.initialDir.replace('packages/', ''), ...p.chain].join(' => ')}"`} should not have access to "${n}" because it not a root dependency, not in its resolved dependencies and not itself.`)
        })
    })
  },
}

const rule5 = {
  description: 'Peer dependencies should be resolved to same instance as parents',
  apply: (t, dir, resolvedGraph) => {
    const graph = parseGraph(resolvedGraph)
    const allPackages = getAllPackages(withRequireChain(graph))
    allPackages.filter(p => p.peer)
      .forEach(p => {
        const chain = p.chain
        const parentChain = chain.slice(0, -2).concat([p.name])
        t.same(setupRequire(path.join(dir, p.initialDir))(...parentChain), setupRequire(path.join(dir, p.initialDir))(...chain),
               `Rule 5: Package "${[p.initialDir.replace('packages/', ''), ...chain.slice(0, -1)].join(' => ')}" should get the same instance of "${p.name}" as its parent`)
      })
  },
}

const rule6 = {
  description: 'Packages with the same name, same version, and same peer deps are installed at the same place on disk',
  apply: (t, dir, resolvedGraph) => {
    const graph = parseGraph(resolvedGraph)
    const allPackages = getAllPackages(withRequireChain(graph))
    const byNameAndVersion = new Map()
    allPackages.forEach(p => {
      const peerDeps = p.dependencies.filter(d => d.peer).map(d => `${d.name}@${d.version}`).sort().join(' - ')
      const key = `${p.name}@${p.version} - ${peerDeps}`
      if (!byNameAndVersion.has(key)) {
        byNameAndVersion.set(key, [])
      }
      byNameAndVersion.get(key).push(setupRequire(path.join(dir, p.initialDir))(...p.chain))
    })
    byNameAndVersion.forEach((value, key) => {
      if (value.length === 1) {
        return
      }
      const same = value.every(l => l === value[0])
      t.ok(same, `Rule 6: Even though it is referenced multiple times, package "${key}" should be installed only once`)
    })
  },
}

const rule7 = {
  description: 'The version of the resolved dependencies is the one we expect',
  apply: (t, dir, resolvedGraph) => {
    const graph = parseGraph(resolvedGraph)
    const allPackages = getAllPackages(withRequireChain(graph))
    allPackages.forEach(p => {
      const ppath = setupRequire(path.join(dir, p.initialDir))(...p.chain)
      p.dependencies.filter(d => !isLoopToken(d)).forEach(d => {
        const dname = d.name
        const dversion = JSON.parse(fs.readFileSync(`${resolvePackage(dname, ppath)}/package.json`).toString()).version

        t.ok(dversion === d.version, `Rule 7: The version of ${dname} (${dversion}) provided to ${p.chain.length === 0 && p.initialDir === '.' ? 'the root' : `package "${[p.initialDir.replace('packages/', ''), ...p.chain].join(' => ')}"`} should be "${d.version}"`)
      })
      p.dependencies.filter(d => isLoopToken(d)).forEach(token => {
        const back = parseLoopToken(token)
        const name = p.chain.slice(-1 - back)[0] // getting the name of the circular dep by going back in the chain
        const loopStartChain = p.chain.slice(0, -back)
        const loopEndChain = [...p.chain, name]
        t.same(setupRequire(path.join(dir, p.initialDir))(...loopStartChain),
          setupRequire(path.join(dir, p.initialDir))(...loopEndChain),
               `The two ends of this dependency loop should resolve to the same location: "${[p.initialDir.replace('packages/', ''), ...loopEndChain].join(' => ')}"`)
      })
    })
  },
}

tap.test('most simple happy scenario', async t => {
  /*
   *
   * Dependency graph:
   *
   * foo -> which -> isexe
   *
   */

  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('simple peer dependencies scenarios', async t => {
  /*
   * Dependencies:
   *
   * foo -> tsutils
   *        tsutils -> typescript (peer dep)
   *                   typescript -> baz
   * foo -> typescript
   *        typescript -> baz
   *
   */

  const graph = {
    registry: [
      { name: 'tsutils', version: '1.0.0', dependencies: {}, peerDependencies: { typescript: '*' } },
      { name: 'typescript', version: '1.0.0', dependencies: { baz: '*' } },
      { name: 'baz', version: '2.0.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { tsutils: '1.0.0', typescript: '1.0.0' },
    },
  }

  const resolved = {
    'foo@1.2.3 (root)': {
      'tsutils@1.0.0': {
        'typescript@1.0.0 (peer)': {
          'baz@2.0.0': {},
        },
      },
      'typescript@1.0.0': {
        'baz@2.0.0': {},
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('peer dependencies with legacyPeerDeps', async t => {
  /*
   * With legacyPeerDeps, peer dep edges are not created on the node.
   * The linked strategy should still place peer deps alongside the
   * package in the store so require() works from the real path.
   *
   * root -> phpegjs
   *         phpegjs -> pegjs (peer dep, no edge with legacyPeerDeps)
   * root -> pegjs
   */

  const graph = {
    registry: [
      { name: 'phpegjs', version: '1.0.0', peerDependencies: { pegjs: '*', missing: '*' } },
      { name: 'pegjs', version: '2.0.0' },
      {
        name: 'adapter',
        version: '1.0.0',
        dependencies: { pegjs: '*' },
        peerDependencies: { pegjs: '*' },
      },
    ],
    root: {
      name: 'foo',
      version: '1.2.3',
      dependencies: { phpegjs: '1.0.0', pegjs: '2.0.0', adapter: '1.0.0' },
    },
  }

  const resolved = {
    'foo@1.2.3 (root)': {
      'phpegjs@1.0.0': {
        'pegjs@2.0.0 (peer)': {},
      },
      'pegjs@2.0.0': {},
      'adapter@1.0.0': {
        'pegjs@2.0.0': {},
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache, legacyPeerDeps: true })
  await arborist.reify({ installStrategy: 'linked' })

  // phpegjs should be able to require its peer dep pegjs
  t.ok(setupRequire(dir)('phpegjs', 'pegjs'),
    'phpegjs can require peer dep pegjs with legacyPeerDeps')

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('idempotent install with legacyPeerDeps and workspace peer deps', async t => {
  // Regression: when legacyPeerDeps is enabled and a workspace has a peer dependency on another workspace, node.resolve() returns the Link node (not its target). This caused workspaceProxy to be called with the Link, producing store links under node_modules/<ws>/node_modules/ that race with the workspace symlink at node_modules/<ws>, hitting EEXIST on the second install.
  // Use many workspaces with cross-peer-deps to increase concurrency and make the race window large enough to trigger reliably.
  const workspaces = []
  for (let i = 0; i < 20; i++) {
    workspaces.push({
      name: `ws-${i}`,
      version: '1.0.0',
      dependencies: { abbrev: '1.0.0' },
      peerDependencies: { [`ws-${(i + 1) % 20}`]: '*' },
    })
  }

  const graph = {
    registry: [
      { name: 'abbrev', version: '1.0.0' },
    ],
    root: {
      name: 'myroot', version: '1.0.0',
    },
    workspaces,
  }

  const { dir, registry } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const opts = { path: dir, registry, packumentCache: new Map(), cache, legacyPeerDeps: true }

  // First install
  const arb1 = new Arborist(opts)
  await arb1.reify({ installStrategy: 'linked' })

  // Second install must not throw EEXIST
  const arb2 = new Arborist({ ...opts, packumentCache: new Map() })
  await arb2.reify({ installStrategy: 'linked' })

  // Workspace peer dep symlinks should still be present after second install
  for (let i = 0; i < 20; i++) {
    const peerTarget = `ws-${(i + 1) % 20}`
    const peerLink = path.join(dir, 'packages', `ws-${i}`, 'node_modules', peerTarget)
    t.ok(fs.lstatSync(peerLink).isSymbolicLink(),
      `ws-${i} peer dep on ${peerTarget} is still a symlink after second install`)
  }
})

tap.test('Lock file is same in hoisted and in isolated mode', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '2.0.2' },
    ],
    root: { name: 'foo', version: '1.2.3', dependencies: { which: '2.0.2' } },
  }

  const { dir: hoistedModeDir, registry } = await getRepo(graph)
  const { dir: isolatedModeDir } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arboristHoisted = new Arborist({ path: hoistedModeDir, registry, packumentCache: new Map(), cache })
  const arboristIsolated = new Arborist({ path: isolatedModeDir, registry, packumentCache: new Map(), cache })

  await Promise.all([
    arboristHoisted.reify({ strategy: 'hoisted' }),
    arboristIsolated.reify({ installStrategy: 'linked' }),
  ])

  const [hoistedModeLockFile, isolatedModeLockFile] = await Promise.all([
    fs.promises.readFile(path.join(hoistedModeDir, 'package-lock.json'), { encoding: 'utf8' }),
    fs.promises.readFile(path.join(isolatedModeDir, 'package-lock.json'), { encoding: 'utf8' }),
  ])

  t.same(hoistedModeLockFile, isolatedModeLockFile, 'hoisted mode and isolated mode produce the same lockfile')
})

tap.test('Basic workspaces setup', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'which', version: '2.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'dog', version: '1.2.3', dependencies: { bar: '*' },
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '2.0.0' } },
      { name: 'baz', version: '1.0.0', dependencies: { which: '2.0.0', bar: '*' } },
      { name: 'cat', version: '1.0.0', dependencies: { which: '1.0.0' } },
      { name: 'fish', version: '1.0.0', dependencies: { which: '1.0.0', cat: '*' } },
      { name: 'catfish', version: '1.0.0' },
    ],
  }

  const resolved = {
    'dog@1.2.3 (root)': {
      'bar@1.0.0 (workspace)': {
        'which@2.0.0': {
          'isexe@1.0.0': {},
        },
      },
    },
    'bar@1.0.0 (workspace)': {
      'which@2.0.0': {
        'isexe@1.0.0': {},
      },
    },
    'baz@1.0.0 (workspace)': {
      'bar@1.0.0 (workspace)': {
        'which@2.0.0': {
          'isexe@1.0.0': {},
        },
      },
      'which@2.0.0': {
        'isexe@1.0.0': {},
      },
    },
    'cat@1.0.0 (workspace)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
    },
    'fish@1.0.0 (workspace)': {
      'cat@1.0.0 (workspace)': {
        'which@1.0.0': {
          'isexe@1.0.0': {},
        },
      },
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('resolved versions are the same on isolated and in hoisted mode', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'which', version: '2.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'dog', version: '1.2.3', dependencies: { bar: '*' },
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '2.0.0' } },
      { name: 'baz', version: '1.0.0', dependencies: { which: '2.0.0', bar: '*' } },
      { name: 'cat', version: '1.0.0', dependencies: { which: '1.0.0' } },
      { name: 'fish', version: '1.0.0', dependencies: { which: '1.0.0', cat: '*' } },
      { name: 'catfish', version: '1.0.0' },
    ],
  }

  const resolved = {
    'dog@1.2.3 (root)': {
      'bar@1.0.0 (workspace)': {
        'which@2.0.0': {
          'isexe@1.0.0': {},
        },
      },
    },
    'bar@1.0.0 (workspace)': {
      'which@2.0.0': {
        'isexe@1.0.0': {},
      },
    },
    'baz@1.0.0 (workspace)': {
      'bar@1.0.0 (workspace)': {
        'which@2.0.0': {
          'isexe@1.0.0': {},
        },
      },
      'which@2.0.0': {
        'isexe@1.0.0': {},
      },
    },
    'cat@1.0.0 (workspace)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
    },
    'fish@1.0.0 (workspace)': {
      'cat@1.0.0 (workspace)': {
        'which@1.0.0': {
          'isexe@1.0.0': {},
        },
      },
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
    },
    'catfish@1.0.0': {},
  }

  let { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  let cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  let arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  rule7.apply(t, dir, resolved, new Set())

  const mock = await getRepo(graph)
  dir = mock.dir
  registry = mock.registry

  // Note that we override this cache to prevent interference from other tests
  cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ strategy: 'hoisted' })

  // checking that the resolved graph is the same in hoisting and in isolated mode
  rule7.apply(t, dir, resolved, new Set())
})

tap.test('peer dependency chain', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'bar', version: '1.0.0', dependencies: { baz: '^1.0.0' }, peerDependencies: { boat: '*' } },
      { name: 'baz', version: '1.0.0', peerDependencies: { boat: '*' } },
      { name: 'boat', version: '3.0.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { bar: '1.0.0', boat: '^3.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'bar@1.0.0': {
        'baz@1.0.0': {
          'boat@3.0.0 (peer)': {},
        },
        'boat@3.0.0 (peer)': {},
      },
      'boat@3.0.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('failing optional deps are not installed', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', os: ['npmOS'] },
    ],
    root: {
      name: 'foo', version: '1.2.3', optionalDependencies: { which: '1.0.0' },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  t.notOk(setupRequire(dir)('which'), 'Failing optional deps should not be installed')

  t.notOk(fs.existsSync(path.join(dir, 'node_modules', '.bin', 'which')))
})

tap.test('Optional deps are installed when possible', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', optionalDependencies: { which: '1.0.0' },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  t.ok(setupRequire(dir)('which'), 'Optional deps should be installed when possible')

  // TODO: make sure that existsSync is not deprecated
  t.ok(fs.existsSync(path.join(dir, 'node_modules', '.bin', 'which')))
})

tap.test('shrinkwrap', async t => {
  const shrinkwrap = JSON.stringify({
    name: 'which',
    version: '1.0.0',
    lockfileVersion: 2,
    requires: true,
    packages: {
      '': {
        name: 'which',
        version: '1.0.0',
        dependencies: {
          isexe: '^1.0.0',
        },
      },
      'node_modules/isexe': {
        version: '1.0.0',
        resolved: '##REG##/isexe/1.0.0.tar',
      },
    },
    dependencies: {
      isexe: {
        version: '1.0.0',
        resolved: '##REG##/isexe/1.0.0.tar',
      },
    },
  })

  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' }, shrinkwrap, _hasShrinkwrap: true },
      { name: 'isexe', version: '1.1.0' },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0', isexe: '^1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
      'isexe@1.1.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('shrinkwrap install dev deps (like hoisting does)', async t => {
  const shrinkwrap = JSON.stringify({
    name: 'which',
    version: '1.0.0',
    lockfileVersion: 2,
    requires: true,
    packages: {
      '': {
        name: 'which',
        version: '1.0.0',
        devDependencies: {
          isexe: '^1.0.0',
        },
      },
      'node_modules/isexe': {
        version: '1.0.0',
        dev: true,
        resolved: '##REG##/isexe/1.0.0.tar',
      },
    },
    dependencies: {
      isexe: {
        version: '1.0.0',
        dev: true,
        resolved: '##REG##/isexe/1.0.0.tar',
      },
    },
  })

  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', devDependencies: { isexe: '^1.0.0' }, shrinkwrap, _hasShrinkwrap: true },
      { name: 'isexe', version: '1.1.0' },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0', isexe: '^1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
      'isexe@1.1.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('shrinkwrap with peer dependencies', async t => {
  const shrinkwrap = JSON.stringify({
    name: 'which',
    version: '1.0.0',
    lockfileVersion: 2,
    requires: true,
    packages: {
      '': {
        name: 'which',
        version: '1.0.0',
        dependencies: {
          isexe: '^1.0.0',
        },
        devDependencies: {
          bar: '1.0.0',
        },
        peerDependencies: {
          bar: '*',
        },
      },
      'node_modules/bar': {
        version: '1.0.0',
        resolved: '##REG##/bar/1.0.0.tar',
        dev: true,
        bin: {
          bar: 'bin.js',
        },
      },
      'node_modules/isexe': {
        version: '1.0.0',
        resolved: '##REG##/isexe/1.0.0.tar',
        bin: {
          isexe: 'bin.js',
        },
      },
    },
    dependencies: {
      bar: {
        version: '1.0.0',
        resolved: '##REG##/bar/1.0.0.tar',
        dev: true,
      },
      isexe: {
        version: '1.0.0',
        resolved: '##REG##/isexe/1.0.0.tar',
      },
    },
  })
  // expected output
  const resolved = {
    'foo@1.0.0 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
        'bar@1.0.0': {},
      },
      'isexe@1.1.0': {},
      'bar@1.1.0': {},
    },
  }

  // Input of arborist
  const graph = {
    registry: [
      {
        name: 'which',
        version: '1.0.0',
        dependencies: { isexe: '^1.0.0' },
        peerDependencies: { bar: '*' },
        devDependencies: { bar: '1.0.0' },
        shrinkwrap,
        _hasShrinkwrap: true,
      },
      { name: 'isexe', version: '1.1.0' },
      { name: 'isexe', version: '1.0.0' },
      { name: 'bar', version: '1.1.0' },
      { name: 'bar', version: '1.0.0' },
    ],
    root: {
      name: 'foo',
      version: '1.0.0',
      dependencies: { isexe: '^1.0.0', bar: '^1.0.0', which: '1.0.0' },
    },
  }

  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  // TODO: create the resolved object
  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('bundled dependencies of external packages', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which',
        version: '1.0.0',
        dependencies: { isexe: '^1.0.0' },
        bundleDependencies: ['isexe'],
        bundledDeps: [{ name: 'isexe', version: '1.0.0' }],
      },
      { name: 'isexe', version: '1.1.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('bundled dependencies of internal packages', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' },
      },
      { name: 'isexe', version: '1.1.0' },
    ],
    root: {
      name: 'foo',
      version: '1.2.3',
      dependencies: { which: '1.0.0', isexe: '^1.0.0' },
      bundleDependencies: ['isexe'],
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.1.0': {},
      },
      'isexe@1.1.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  // I think that duplicated versions are okay in the case of bundled deps
  //  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)

  const isexePath = path.join(dir, 'node_modules', 'isexe')
  t.equal(isexePath, fs.realpathSync(isexePath))
})

tap.test('nested bundled dependencies of internal packages', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' },
      },
      { name: 'isexe', version: '1.1.0', dependencies: { bar: '*' } },
      { name: 'bar', version: '3.0.0' },
    ],
    root: {
      name: 'foo',
      version: '1.2.3',
      dependencies: { which: '1.0.0', isexe: '^1.0.0' },
      bundleDependencies: ['isexe'],
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.1.0': {
          'bar@3.0.0': {},
        },
      },
      'isexe@1.1.0': {},
      'bar@3.0.0': {}, // The bundled bar is hoisted
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)

  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  // I think that duplicated versions are okay in the case of bundled deps
  //  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)

  const isexePath = path.join(dir, 'node_modules', 'isexe')
  t.equal(isexePath, fs.realpathSync(isexePath))
})

tap.test('nested bundled dependencies of workspaces', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '2.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'dog', version: '1.2.3',
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '2.0.0' }, bundleDependencies: ['which'] },
    ],
  }

  const resolved = {
    'dog@1.2.3 (root)': {
      'which@2.0.0': {},
      'isexe@1.0.0': {},
    },
    'bar@1.0.0 (workspace)': {
      'which@2.0.0': {},
      'isexe@1.0.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)

  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  // Workspace link at packages/bar/node_modules/bar and bundled deps (which, isexe) are co-located in the same node_modules/, making them mutually accessible regardless of declared dependencies.
  // rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  // I think that duplicated versions are okay in the case of bundled deps
  //  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)

  // Bundled deps are hoisted to root node_modules as real directories
  const isexePath = path.join(dir, 'node_modules', 'isexe')
  t.equal(isexePath, fs.realpathSync(isexePath))
  const whichPath = path.join(dir, 'node_modules', 'which')
  t.equal(whichPath, fs.realpathSync(whichPath))
})

tap.test('nested bundled dependencies of workspaces with conflicting isolated dep', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '3.0.0', dependencies: { isexe: '^2.0.0' } },
      { name: 'isexe', version: '2.0.0' },
      { name: 'which', version: '2.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'dog', version: '1.2.3', dependencies: { which: '3.0.0' },
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '2.0.0' }, bundleDependencies: ['which'] },
    ],
  }

  // the isexe that is bundled is hoisted
  // the 'which' that is bundled is not hoisted due to a conflict
  const resolved = {
    'dog@1.2.3 (root)': {
      'which@3.0.0': {
        'isexe@2.0.0': {},
      },
    },
    'bar@1.0.0 (workspace)': {
      'which@2.0.0': {
        'isexe@1.0.0': {},
      },
      'isexe@1.0.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)

  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  // Workspace link at packages/bar/node_modules/bar and bundled deps (which, isexe) share the same node_modules/, making them mutually accessible regardless of declared dependencies.
  // rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  // I think that duplicated versions are okay in the case of bundled deps
  //  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)

  const isexePath = path.join(dir, 'packages', 'bar', 'node_modules', 'isexe')
  t.equal(isexePath, fs.realpathSync(isexePath))
  const whichPath = path.join(dir, 'packages', 'bar', 'node_modules', 'which')
  t.equal(whichPath, fs.realpathSync(whichPath))
})

tap.test('adding a dependency', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
      { name: 'bar', version: '2.2.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {},
      },
      'bar@2.2.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  // Add a new dependency
  const cache2 = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache: cache2, add: ['bar@^2.0.0'] })
  await arborist2.reify({ installStrategy: 'linked' })

  // Note that the 'resolved' dependency graph contains 'bar'
  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('removing a dependency', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
      { name: 'bar', version: '2.2.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0', bar: '^2.0.0' },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  // checking that bar is installed
  t.ok(setupRequire(dir)('bar'), 'bar should be installed initially')

  // Add a new dependency
  const cache2 = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache: cache2 })
  await arborist2.buildIdealTree({ rm: ['bar'] })
  await arborist2.reify({ installStrategy: 'linked' })

  t.notOk(setupRequire(dir)('bar'), 'bar should not be installed anymore')
})

tap.test('circular dependencies', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0', dependencies: { which: '1.0.0' } },
      { name: 'bar', version: '1.2.6' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0', bar: '1.2.6' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': '(back 1)',
      },
      'bar@1.2.6': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('circular peer dependencies', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'cat', version: '1.0.0', peerDependencies: { bar: '*' } },
      { name: 'bar', version: '1.0.0', peerDependencies: { cat: '*' } },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { cat: '1.0.0', bar: '1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'cat@1.0.0': {
        'bar@1.0.0': '(back 1)',
      },
      'bar@1.0.0': {
        'cat@1.0.0': '(back 1)',
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('peer dependency on parent', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'cat', version: '1.0.0', dependencies: { bar: '*' } },
      { name: 'bar', version: '1.0.0', peerDependencies: { cat: '*' } },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { cat: '1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'cat@1.0.0': {
        'bar@1.0.0': '(back 1)',
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('scoped package', async t => {
  /*
   *
   * Dependency graph:
   *
   * foo -> which -> isexe
   *
   */

  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { '@foo/isexe': '^1.0.0' } },
      { name: '@foo/isexe', version: '1.0.0' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        '@foo/isexe@1.0.0': {},
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('scoped workspace packages', async t => {
  /*
   * Dependency graph:
   *
   * root -> @scope/package-b (workspace)
   *         @scope/package-b -> @scope/package-a (workspace)
   * root -> @scope/package-a (workspace)
   */

  const graph = {
    registry: [
      { name: 'which', version: '1.0.0' },
    ],
    root: {
      name: 'myproject', version: '1.0.0', dependencies: { '@scope/package-a': '*', '@scope/package-b': '*' },
    },
    workspaces: [
      { name: '@scope/package-a', version: '1.0.0', dependencies: { which: '1.0.0' } },
      { name: '@scope/package-b', version: '1.0.0', dependencies: { '@scope/package-a': '*' } },
    ],
  }

  const resolved = {
    'myproject@1.0.0 (root)': {
      '@scope/package-a@1.0.0 (workspace)': {
        'which@1.0.0': {},
      },
      '@scope/package-b@1.0.0 (workspace)': {
        '@scope/package-a@1.0.0 (workspace)': {
          'which@1.0.0': {},
        },
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('aliased packages in workspace', async t => {
  /*
   * Dependency graph:
   *
   * root -> prettier (alias for npm:custom-prettier@3.0.3)
   *         custom-prettier -> isexe
   * root -> my-pkg (workspace)
   *         my-pkg -> prettier (alias for npm:custom-prettier@3.0.3)
   */

  const graph = {
    registry: [
      { name: 'custom-prettier', version: '3.0.3', dependencies: { isexe: '1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'myproject',
      version: '1.0.0',
      dependencies: { prettier: 'npm:custom-prettier@3.0.3' },
    },
    workspaces: [
      { name: 'my-pkg', version: '1.0.0', dependencies: { prettier: 'npm:custom-prettier@3.0.3' } },
    ],
  }

  const resolved = {
    'myproject@1.0.0 (root)': {
      'prettier@3.0.3': {
        'isexe@1.0.0': {},
      },
    },
    'my-pkg@1.0.0 (workspace)': {
      'prettier@3.0.3': {
        'isexe@1.0.0': {},
      },
    },
  }

  const { dir, registry } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  // Verify symlink uses alias name, not real package name
  t.ok(setupRequire(dir)('prettier'), 'root can require via alias "prettier"')
  t.notOk(
    pathExists(path.join(dir, 'node_modules', 'custom-prettier')),
    'no custom-prettier symlink at root node_modules'
  )

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('failing optional peer deps are not installed', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', os: ['npmOS'] },
      { name: 'bar', version: '1.0.0', peerDependencies: { which: '*' }, peerDependenciesMeta: { which: { optional: true } } },
    ],
    root: {
      name: 'foo', version: '1.2.3', optionalDependencies: { which: '1.0.0', bar: '*' },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  t.notOk(setupRequire(dir)('bar', 'which'), 'Failing optional peer deps should not be installed')
})

// Virtual packages are 2 packages that have the same version but are
// duplicated on disk to solve peer-dependency conflict.
tap.test('virtual packages', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'foo', version: '1.0.0' },
      { name: 'foo', version: '2.0.0', peerDependencies: { cat: '*' } },
      { name: 'cat', version: '1.0.0' },
      { name: 'cat', version: '2.0.0' },
      { name: 'bar', version: '1.0.0', dependencies: { foo: '2.0.0', cat: '2.0.0' } },
      { name: 'baz', version: '1.0.0', dependencies: { foo: '2.0.0', cat: '1.0.0' } },
    ],
    root: {
      name: 'toor', version: '1.2.3', dependencies: { foo: '1.0.0', bar: '*', baz: '*', cat: '1.0.0' },
    },
  }

  // expected output
  const resolved = {
    'toor@1.2.3 (root)': {
      'foo@1.0.0': {},
      'bar@1.0.0': {
        'foo@2.0.0': {
          'cat@2.0.0 (peer)': {},
        },
        'cat@2.0.0': {},
      },
      'baz@1.0.0': {
        'foo@2.0.0': {
          'cat@1.0.0 (peer)': {},
        },
        'cat@1.0.0': {},
      },
      'cat@1.0.0': {},
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('postinstall scripts are run', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', scripts: { postinstall: `node -e "fs.openSync('postInstallRanWhich', 'w')"` } },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' },
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', scripts: { postinstall: `node -e "fs.openSync('postInstallRanBar', 'w')"` } },
    ],
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const postInstallRanWhich = pathExists(`${setupRequire(dir)('which')}/postInstallRanWhich`)
  t.ok(postInstallRanWhich)

  const postInstallRanBar = pathExists(`${path.join(dir, 'packages', 'bar')}/postInstallRanBar`)
  t.ok(postInstallRanBar)
})

tap.test('postinstall scripts run once for store packages', async t => {
  // Regression test: store links should not cause scripts to run twice.
  // The store entry and its symlink both end up in the build queue, but
  // only the store entry should run scripts.
  const graph = {
    registry: [
      {
        name: 'which',
        version: '1.0.0',
        scripts: {
          postinstall: 'node -e "var c=0;try{c=+fs.readFileSync(\'postinstall-count\',\'utf8\')}catch(e){};fs.writeFileSync(\'postinstall-count\',String(c+1))"',
        },
      },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' },
    },
  }

  const { dir, registry } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  const whichDir = setupRequire(dir)('which')
  const count = Number(fs.readFileSync(`${whichDir}/postinstall-count`, 'utf8'))
  t.equal(count, 1, 'postinstall ran exactly once')
})

tap.test('workspace-filtered install with linked strategy', async t => {
  // Two workspaces sharing the same dependency must not crash when installing with --workspace + --install-strategy=linked.
  const graph = {
    registry: [
      { name: 'abbrev', version: '2.0.0' },
    ],
    root: {
      name: 'myroot', version: '1.0.0',
    },
    workspaces: [
      { name: 'ws-a', version: '1.0.0', dependencies: { abbrev: '2.0.0' } },
      { name: 'ws-b', version: '1.0.0', dependencies: { abbrev: '2.0.0' } },
    ],
  }

  const { dir, registry } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })

  // Full install first
  await arborist.reify({ installStrategy: 'linked' })

  // Verify store entry exists
  const storeDir = path.join(dir, 'node_modules', '.store')
  const storeEntries = fs.readdirSync(storeDir)
  t.ok(storeEntries.some(e => e.startsWith('abbrev@')), 'store has abbrev entry after full install')

  // Workspace-filtered install must not crash
  const arborist2 = new Arborist({
    path: dir,
    registry,
    packumentCache: new Map(),
    cache,
    workspaces: ['ws-a'],
  })
  await arborist2.reify({
    installStrategy: 'linked',
    workspaces: ['ws-a'],
  })

  // Verify workspace filtering was actually applied (not silently skipped)
  t.ok(arborist2.diff.filterSet.size > 0, 'workspace filter was applied to diff')

  // Store entries still intact
  const storeEntries2 = fs.readdirSync(storeDir)
  t.ok(storeEntries2.some(e => e.startsWith('abbrev@')), 'store entries preserved after ws install')

  // Workspace symlinks preserved
  const wsALink = fs.readlinkSync(path.join(dir, 'packages', 'ws-a', 'node_modules', 'abbrev'))
  t.ok(wsALink.includes('.store'), 'workspace a abbrev symlink points to store')

  const wsBLink = fs.readlinkSync(path.join(dir, 'packages', 'ws-b', 'node_modules', 'abbrev'))
  t.ok(wsBLink.includes('.store'), 'workspace b abbrev symlink preserved')
})

tap.test('bins are installed', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', bin: './bin.js' },
    ],
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' },
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '1.0.0' }, bin: './bin.js' },
    ],
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  // TODO: make the test not assume folder structure
  // TODO should the bin also be in the store?
  // const binFromWhichToWhich = pathExists(fs.realpathSync(`${setupRequire(dir)('which')}/../.bin/which`))
  // t.ok(binFromWhichToWhich)

  const binFromRootToWhich = pathExists(`${dir}/node_modules/.bin/which`)
  t.ok(binFromRootToWhich)

  // bar is not a root dep, so its bin should be in the workspace's own node_modules
  const binFromBarToWhich = pathExists(`${path.join(dir, 'packages', 'bar')}/node_modules/.bin/which`)
  t.ok(binFromBarToWhich)
})

tap.test('file: dependency with linked strategy', async t => {
  /*
   * Regression test for https://github.com/npm/cli/issues/7549
   *
   * A relative file: dependency (file:./project2) was incorrectly resolved as file:../project2, causing ENOENT errors because the path was resolved one level above the project root.
   */
  const graph = {
    registry: [],
    root: {
      name: 'project1',
      version: '1.0.0',
      dependencies: { project2: 'file:./project2' },
    },
  }

  const { dir, registry } = await getRepo(graph)

  // Create the local file: dependency on disk
  const depDir = path.join(dir, 'project2')
  fs.mkdirSync(depDir, { recursive: true })
  fs.writeFileSync(path.join(depDir, 'package.json'), JSON.stringify({
    name: 'project2',
    version: '1.0.0',
  }))
  fs.writeFileSync(path.join(depDir, 'index.js'), "module.exports = 'project2'")

  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  // The file dep should be symlinked in node_modules
  const linkPath = path.join(dir, 'node_modules', 'project2')
  const stat = fs.lstatSync(linkPath)
  t.ok(stat.isSymbolicLink(), 'project2 is a symlink in node_modules')

  // The symlink should resolve to the actual local directory
  const realpath = fs.realpathSync(linkPath)
  t.equal(realpath, depDir, 'symlink points to the correct local directory')

  // The package should be requireable
  t.ok(setupRequire(dir)('project2'), 'project2 can be required from root')
})

tap.test('subsequent linked install is a no-op', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', bin: './bin.js', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'myproject',
      version: '1.0.0',
      dependencies: { which: '1.0.0' },
    },
  }
  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)

  // First install
  const arb1 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb1.reify({ installStrategy: 'linked' })

  // Verify packages are installed
  t.ok(fs.lstatSync(path.join(dir, 'node_modules', 'which')).isSymbolicLink(),
    'which is a symlink after first install')

  // Second install — should detect everything is up-to-date
  const arb2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb2.reify({ installStrategy: 'linked' })

  // Verify the diff has zero actionable leaves
  const leaves = arb2.diff?.leaves || []
  const actions = leaves.filter(l => l.action)
  t.equal(actions.length, 0, 'second install should have no diff actions')

  // Verify unchanged nodes were detected
  t.ok(arb2.diff.unchanged.length > 0, 'second install should have unchanged nodes')

  // Verify packages are still correctly installed
  t.ok(fs.lstatSync(path.join(dir, 'node_modules', 'which')).isSymbolicLink(),
    'which is still a symlink after second install')
  t.ok(setupRequire(dir)('which'), 'which is requireable after second install')
})

tap.test('workspace links are not affected by store resolved fix', async t => {
  const graph = {
    registry: [
      { name: 'abbrev', version: '1.0.0' },
    ],
    root: {
      name: 'myproject',
      version: '1.0.0',
      dependencies: { abbrev: '1.0.0' },
    },
    workspaces: [
      { name: 'mypkg', version: '1.0.0', dependencies: { abbrev: '1.0.0' } },
    ],
  }
  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)

  // First install
  const arb1 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb1.reify({ installStrategy: 'linked' })

  // Second install
  const arb2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb2.reify({ installStrategy: 'linked' })

  // Verify workspace is still correctly linked (workspace can resolve itself via self-link)
  t.ok(setupRequire(path.join(dir, 'packages', 'mypkg'))('mypkg'), 'workspace is requireable via self-link after second install')
  t.ok(setupRequire(dir)('abbrev'), 'registry dep is requireable after second install')

  // Verify the diff has unchanged nodes (store entries are correctly matched)
  t.ok(arb2.diff.unchanged.length > 0, 'second install should have unchanged nodes')
})

tap.test('idempotent install with cross-workspace deps (diamond pattern)', async t => {
  // Regression: when workspace-x depends on workspace-y (and both share a registry dep), the second install would report "changed N packages" because (1) workspace link resolved values didn't match between ideal and actual trees, and (2) actual fsChildren overwrote synthetic store entries in the diff proxy.
  const graph = {
    registry: [
      { name: 'abbrev', version: '2.0.0' },
    ],
    root: {
      name: 'myproject',
      version: '1.0.0',
      dependencies: { 'workspace-x': '*', 'workspace-y': '*' },
    },
    workspaces: [
      { name: 'workspace-x', version: '1.0.0', dependencies: { abbrev: '2.0.0', 'workspace-y': '*' } },
      { name: 'workspace-y', version: '1.0.0', dependencies: { abbrev: '2.0.0' } },
    ],
  }
  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)

  // First install
  const arb1 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb1.reify({ installStrategy: 'linked' })

  // Second install — should detect everything is up-to-date
  const arb2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb2.reify({ installStrategy: 'linked' })

  const leaves = arb2.diff?.leaves || []
  const actions = leaves.filter(l => l.action)
  t.equal(actions.length, 0, 'second install should have no diff actions')
  t.ok(arb2.diff.unchanged.length > 0, 'second install should have unchanged nodes')

  // Verify packages are still correctly installed (abbrev is a workspace dep, not root)
  t.ok(setupRequire(path.join(dir, 'packages', 'workspace-y'))('abbrev'),
    'abbrev is requireable from workspace after second install')
})

tap.test('orphaned store entries are cleaned up on dependency update', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'which', version: '2.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'myproject',
      version: '1.0.0',
      dependencies: { which: '1.0.0' },
    },
  }
  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const storeDir = path.join(dir, 'node_modules', '.store')

  // First install — which@1.0.0
  const arb1 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb1.reify({ installStrategy: 'linked' })

  const entriesAfterV1 = fs.readdirSync(storeDir)
  t.ok(entriesAfterV1.some(e => e.startsWith('which@1.0.0-')),
    'store has which@1.0.0 entry after first install')

  // Update package.json to depend on which@2.0.0
  const pkgPath = path.join(dir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.dependencies.which = '2.0.0'
  fs.writeFileSync(pkgPath, JSON.stringify(pkg))

  // Second install — which@2.0.0
  const arb2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb2.reify({ installStrategy: 'linked' })

  const entriesAfterV2 = fs.readdirSync(storeDir)
  t.ok(entriesAfterV2.some(e => e.startsWith('which@2.0.0-')),
    'store has which@2.0.0 entry after update')
  t.notOk(entriesAfterV2.some(e => e.startsWith('which@1.0.0-')),
    'old which@1.0.0 store entry is removed after update')
})

tap.test('orphaned store entries are cleaned up on dependency removal', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'myproject',
      version: '1.0.0',
      dependencies: { which: '1.0.0' },
    },
  }
  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const storeDir = path.join(dir, 'node_modules', '.store')

  // First install
  const arb1 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb1.reify({ installStrategy: 'linked' })

  t.ok(fs.readdirSync(storeDir).length > 0, 'store has entries after install')

  // Remove the dependency
  const pkgPath = path.join(dir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  delete pkg.dependencies
  fs.writeFileSync(pkgPath, JSON.stringify(pkg))

  // Reinstall
  const arb2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb2.reify({ installStrategy: 'linked' })

  const entriesAfterRemoval = fs.readdirSync(storeDir)
  t.equal(entriesAfterRemoval.length, 0,
    'all store entries are removed when dependencies are removed')
})

tap.test('store symlinks are updated when hash changes after adding a dep', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
      { name: 'abbrev', version: '2.0.0' },
    ],
    root: {
      name: 'myproject',
      version: '1.0.0',
      dependencies: { which: '1.0.0' },
    },
  }
  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)

  // First install — only which
  const arb1 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb1.reify({ installStrategy: 'linked' })

  const whichLink = path.join(dir, 'node_modules', 'which')
  t.ok(fs.lstatSync(whichLink).isSymbolicLink(), 'which is a symlink after first install')
  const hashBefore = fs.readlinkSync(whichLink)

  // Add abbrev — changes the dep graph, causing store hash recalculation
  const pkgPath = path.join(dir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.dependencies.abbrev = '2.0.0'
  fs.writeFileSync(pkgPath, JSON.stringify(pkg))

  const arb2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arb2.reify({ installStrategy: 'linked' })

  // The symlink target should still be valid (not dangling)
  t.ok(fs.existsSync(whichLink), 'which symlink target exists after adding abbrev')
  t.ok(setupRequire(dir)('which'), 'which is requireable after adding abbrev')

  // Verify the symlink was updated if the hash changed
  const hashAfter = fs.readlinkSync(whichLink)
  if (hashBefore !== hashAfter) {
    const storeDir = path.join(dir, 'node_modules', '.store')
    const storeEntries = fs.readdirSync(storeDir)
    const oldKey = hashBefore.split('/')[0].replace('.store/', '')
    t.notOk(storeEntries.includes(oldKey), 'old store entry was cleaned up')
  }
})

function setupRequire (cwd) {
  return function requireChain (...chain) {
    return chain.reduce((path, name) => {
      if (path === undefined) {
        return undefined
      }
      return resolvePackage(name, path)
    }, cwd)
  }
}

function pathExists (path) {
  try {
    fs.statSync(path)
    return true
  } catch (_) {
    return false
  }
}

/**
 * We reimplement a lightweight version of require.resolve because the
 * one that is implemented in nodejs memoizes the resolution which
 * asserts interfering with each others
 **/
function resolvePackage (name, from) {
  try {
    const loc = `${from}/node_modules/${name}`
    fs.statSync(loc)
    return fs.realpathSync(loc)
  } catch (_) {
    const next = path.dirname(from)
    if (next === from) {
      return undefined
    } else {
      return resolvePackage(name, next)
    }
  }
}

function getAllPackages (resolvedGraph) {
  return [...getAllPackagesRecursive(resolvedGraph.root),
    ...(resolvedGraph.workspaces?.map(w => getAllPackagesRecursive(w)) || []).reduce((a, n) => ([...a, ...n]), [])]
}

function getAllPackagesRecursive (resolvedGraph) {
  return [
    resolvedGraph,
    ...(resolvedGraph.dependencies
      ?.filter(d => !isLoopToken(d))
      .map(d => getAllPackagesRecursive(d)) || [])
      .reduce((a, n) => ([...a, ...n]), []),
  ]
}

function withRequireChain (resolvedGraph) {
  return {
    root: {
      ...resolvedGraph.root,
      chain: [],
      initialDir: '.',
      dependencies: resolvedGraph.root.dependencies?.map(d =>
        withRequireChainRecursive(d, [], '.')),
    },
    workspaces: resolvedGraph.workspaces?.map(w => {
      const initialDir = `packages/${w.name}`
      return {
        ...w,
        chain: [],
        initialDir,
        dependencies: w.dependencies?.map(d => withRequireChainRecursive(d, [], initialDir)),
      }
    }),
  }
}

function withRequireChainRecursive (resolvedGraph, chain, initialDir) {
  if (isLoopToken(resolvedGraph)) {
    return resolvedGraph
  }

  const newChain = [...chain, resolvedGraph.name]
  return {
    ...resolvedGraph,
    chain: newChain,
    initialDir,
    dependencies: resolvedGraph.dependencies?.map(d =>
      withRequireChainRecursive(d, newChain, initialDir)),
  }
}

function parseGraph (graph) {
  const root = Object.entries(graph).find(([key]) => key.includes('(root)'))
  const result = { root: parseGraphRecursive(...root), workspaces: [] }

  Object.entries(graph).filter(([key]) => key.includes('(workspace)'))
    .forEach(([key, value]) => {
      result.workspaces.push(parseGraphRecursive(key, value))
    })
  return result
}

function isLoopToken (obj) {
  return typeof obj === 'string' && /^\(back \d+\)$/.test(obj)
}

function parseLoopToken (t) {
  return parseInt(/\d+/.exec(t)[0])
}

function parseGraphRecursive (key, deps) {
  if (isLoopToken(key)) {
    return key
  }
  const name = /^(.[^@]*)@/.exec(key)[1]
  const version = /^.[^@]*@([^ ]*)/.exec(key)[1]
  const workspace = / \(workspace\)/.test(key)
  const peer = / \(peer\)/.test(key)
  const normalizedDeps = typeof deps === 'string' ? { [deps]: {} } : deps
  const dependencies = Object.entries(normalizedDeps).map(([key, value]) => parseGraphRecursive(key, value))
  return { name, version, workspace, peer, dependencies }
}

tap.test('undeclared workspaces are not hoisted to root node_modules', async t => {
  // Regression test: all workspace packages were unconditionally symlinked into root node_modules/.
  // Only workspaces that root explicitly depends on should appear at root node_modules/.
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'myapp',
      version: '1.0.0',
      dependencies: { 'ws-a': '*' },
    },
    workspaces: [
      { name: 'ws-a', version: '1.0.0', dependencies: { 'ws-b': '*', which: '1.0.0' } },
      { name: 'ws-b', version: '1.0.0' },
      { name: 'ws-c', version: '1.0.0' },
    ],
  }

  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache })
  await arborist.reify({ installStrategy: 'linked' })

  // ws-a is declared as a root dependency — should be at root node_modules
  t.ok(pathExists(path.join(dir, 'node_modules', 'ws-a')),
    'declared workspace ws-a is symlinked at root node_modules')
  t.ok(fs.lstatSync(path.join(dir, 'node_modules', 'ws-a')).isSymbolicLink(),
    'ws-a at root is a symlink')

  // ws-b is NOT a root dependency — should NOT be at root node_modules
  t.notOk(pathExists(path.join(dir, 'node_modules', 'ws-b')),
    'undeclared workspace ws-b is NOT at root node_modules')

  // ws-c is NOT a root dependency — should NOT be at root node_modules
  t.notOk(pathExists(path.join(dir, 'node_modules', 'ws-c')),
    'undeclared workspace ws-c is NOT at root node_modules')

  // ws-b should be resolvable from ws-a (ws-a depends on ws-b)
  t.ok(pathExists(path.join(dir, 'packages', 'ws-a', 'node_modules', 'ws-b')),
    'ws-b is linked in ws-a/node_modules (declared dep)')

  // ws-c has no dependencies and is not depended on — should not be able to access ws-b
  t.notOk(pathExists(path.join(dir, 'packages', 'ws-c', 'node_modules', 'ws-b')),
    'ws-c cannot access ws-b (no dependency declared)')
})

tap.test('omit dev dependencies with linked strategy', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
      { name: 'eslint', version: '1.0.0' },
    ],
    root: {
      name: 'myapp',
      version: '1.0.0',
      dependencies: { which: '1.0.0' },
      devDependencies: { eslint: '1.0.0' },
    },
    workspaces: [
      {
        name: 'mylib',
        version: '1.0.0',
        dependencies: { isexe: '1.0.0' },
        devDependencies: { eslint: '1.0.0' },
      },
    ],
  }

  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({
    path: dir,
    registry,
    packumentCache: new Map(),
    cache,
    omit: ['dev'],
  })
  await arborist.reify({ installStrategy: 'linked' })

  const storeDir = path.join(dir, 'node_modules', '.store')
  const storeEntries = fs.readdirSync(storeDir)

  t.ok(storeEntries.some(e => e.startsWith('which@')), 'prod dep which is in store')
  t.ok(storeEntries.some(e => e.startsWith('isexe@')), 'prod dep isexe is in store')
  t.notOk(storeEntries.some(e => e.startsWith('eslint@')), 'dev dep eslint is not in store')
})

tap.test('omit dev deps from root even when shared with workspace prod deps', async t => {
  // In a monorepo, a root devDependency may also be a workspace prod dependency.
  // With --omit=dev, root should NOT link to it, but the workspace still should.
  // Also covers the case where a workspace itself is a root devDependency.
  const graph = {
    registry: [
      { name: 'typescript', version: '5.0.0' },
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
    ],
    root: {
      name: 'myapp',
      version: '1.0.0',
      dependencies: { which: '1.0.0', mylib: '1.0.0' },
      devDependencies: { typescript: '5.0.0', devtool: '1.0.0' },
    },
    workspaces: [
      {
        name: 'mylib',
        version: '1.0.0',
        dependencies: { typescript: '5.0.0' },
      },
      {
        name: 'devtool',
        version: '1.0.0',
      },
    ],
  }

  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({
    path: dir,
    registry,
    packumentCache: new Map(),
    cache,
    omit: ['dev'],
  })
  await arborist.reify({ installStrategy: 'linked' })

  const storeDir = path.join(dir, 'node_modules', '.store')
  const storeEntries = fs.readdirSync(storeDir)

  // typescript should still be in the store because mylib needs it as a prod dep
  t.ok(storeEntries.some(e => e.startsWith('typescript@')), 'typescript is in store (workspace prod dep)')
  t.ok(storeEntries.some(e => e.startsWith('which@')), 'which is in store')

  // root should NOT have a symlink to typescript (it's a dev dep of root)
  const rootNmEntries = fs.readdirSync(path.join(dir, 'node_modules'))
  t.ok(rootNmEntries.includes('which'), 'root has symlink to prod dep which')
  t.ok(rootNmEntries.includes('mylib'), 'root has symlink to prod workspace mylib')
  t.notOk(rootNmEntries.includes('typescript'), 'root does not have symlink to dev dep typescript')
  t.notOk(rootNmEntries.includes('devtool'), 'root does not have symlink to dev workspace devtool')

  // workspace should have a symlink to typescript (it's a prod dep of mylib)
  const wsNmEntries = fs.readdirSync(path.join(dir, 'packages', 'mylib', 'node_modules'))
  t.ok(wsNmEntries.includes('typescript'), 'workspace has symlink to prod dep typescript')
})

tap.test('omit optional dependencies with linked strategy', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0' },
      { name: 'fsevents', version: '1.0.0' },
    ],
    root: {
      name: 'myapp',
      version: '1.0.0',
      dependencies: { which: '1.0.0' },
      optionalDependencies: { fsevents: '1.0.0' },
    },
    workspaces: [
      {
        name: 'mylib',
        version: '1.0.0',
        dependencies: { fsevents: '1.0.0' },
      },
    ],
  }

  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({
    path: dir,
    registry,
    packumentCache: new Map(),
    cache,
    omit: ['optional'],
  })
  await arborist.reify({ installStrategy: 'linked' })

  const rootNmEntries = fs.readdirSync(path.join(dir, 'node_modules'))
  t.ok(rootNmEntries.includes('which'), 'root has prod dep which')
  t.notOk(rootNmEntries.includes('fsevents'), 'root does not have optional dep fsevents')
})

tap.test('omit peer dependencies with linked strategy', async t => {
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0' },
      { name: 'react', version: '18.0.0' },
    ],
    root: {
      name: 'myapp',
      version: '1.0.0',
      dependencies: { which: '1.0.0' },
      peerDependencies: { react: '18.0.0' },
    },
    workspaces: [
      {
        name: 'mylib',
        version: '1.0.0',
        dependencies: { react: '18.0.0' },
      },
    ],
  }

  const { dir, registry } = await getRepo(graph)
  const cache = fs.mkdtempSync(`${getTempDir()}/test-`)
  const arborist = new Arborist({
    path: dir,
    registry,
    packumentCache: new Map(),
    cache,
    omit: ['peer'],
  })
  await arborist.reify({ installStrategy: 'linked' })

  const rootNmEntries = fs.readdirSync(path.join(dir, 'node_modules'))
  t.ok(rootNmEntries.includes('which'), 'root has prod dep which')
  t.notOk(rootNmEntries.includes('react'), 'root does not have peer dep react')
})

/*
 * TO TEST:
 *   --------------------------------------
 * - rollbacks
 * - scoped installs
 * - overrides?
 * - changing repo from isolated to hoisted and from hoisted to isolated
 */
