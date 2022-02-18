const tap = require('tap')
const fs = require('fs')
const path = require('path')
const os = require('os')

const oldMap = Map

class newMap extends oldMap {
  get(prop) {
    const newThis = this.__target || this
    return oldMap.prototype.get.bind(newThis)(prop)
  }
}
Map = newMap

const Arborist = require('../lib/arborist')
const { getRepo } = require('./nock')

/**
  * The testing framework here is work in progress, in particular it does not have nice ergonomics.
  * The syntactic suggar for this framework will be introduced over time as we add more features.
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
      if (alreadyAsserted.has(key)) { return }
      alreadyAsserted.add(key)
      t.ok(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
        `Rule 1: Package "${[p.initialDir.replace('packages/',''), ...p.chain].join(' => ')}" should have access to itself using its own name.`)
    })
  }
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
        if (alreadyAsserted.has(key)) { return }
        alreadyAsserted.add(key)
        t.ok(path.join(dir, p.initialDir),
          `Rule 2: ${p.chain.length === 0 && p.initialDir === '.' ? "The root" : `Package "${[p.initialDir.replace('packages/',''), ...p.chain].join(' => ')}"`} should have access to "${n}" because it has it as a resolved dependency.`)
      })
    })
    // testing circular deps
    allPackages.forEach(p => {
      (p.dependencies || []).filter(d => isLoopToken(d)).forEach(token => {
        const back = parseLoopToken(token)
        const n = p.chain.slice(-1 - back)[0] // getting the name of the circular dep by going back in the chain
        const resolveChain = [...p.chain, n]
        const key = p.initialDir + ' => ' + resolveChain.join(' => ')
        if (alreadyAsserted.has(key)) { return }
        alreadyAsserted.add(key)
        t.ok(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
          `Rule 2: ${p.chain.length === 0 && p.initialDir === '.' ? "The root" : `Package "${[p.initialDir.replace('packages/',''), ...p.chain].join(' => ')}"`} should have access to "${n}" because it has it as a resolved dependency.`)
      })
    })
  }
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
        if (alreadyAsserted.has(key)) { return }
        alreadyAsserted.add(key)
        t.ok(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
          `Rule 3: ${p.chain.length === 0 && p.initialDir === '.' ? "The root" : `Package "${[p.initialDir.replace('packages/',''), ...p.chain].join(" => ")}"`} should have access to "${d}" because it is a root dependency.`)
      })
    })
  }
}

const rule4 ={
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
          if (alreadyAsserted.has(key)) { return }
          alreadyAsserted.add(key)
          t.notOk(setupRequire(path.join(dir, p.initialDir))(...resolveChain),
            `Rule 4: ${p.chain.length === 0 && p.initialDir === '.' ? "The root" : `Package "${[p.initialDir.replace('packages/',''), ...p.chain].join(" => ")}"`} should not have access to "${n}" because it not a root dependency, not in its resolved dependencies and not itself.`)
        })
    })
  }
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
          `Rule 5: Package "${[p.initialDir.replace('packages/',''), ...chain.slice(0, -1)].join(' => ')}" should get the same instance of "${p.name}" as its parent`)
      })
  }
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
  }
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

        t.ok(dversion === d.version, `Rule 7: The version of ${dname} (${dversion}) provided to ${p.chain.length === 0 && p.initialDir === '.' ? "the root" : `package "${[p.initialDir.replace('packages/',''), ...p.chain].join(" => ")}"`} should be "${d.version}"`)
      })
      p.dependencies.filter(d => isLoopToken(d)).forEach(token => {
        const back = parseLoopToken(token)
        const name = p.chain.slice(-1 - back)[0] // getting the name of the circular dep by going back in the chain
        const loopStartChain = p.chain.slice(0, -back)
        const loopEndChain = [...p.chain, name]
        t.same(setupRequire(path.join(dir, p.initialDir))(...loopStartChain),
          setupRequire(path.join(dir, p.initialDir))(...loopEndChain),
          `The two ends of this dependency loop should resolve to the same location: "${[p.initialDir.replace('packages/',''), ...loopEndChain].join(" => ")}"`)
      })
    })
  }
}

tap.only('most simple happy scenario', async t => {
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
      { name: 'isexe', version: '1.0.0' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {}
      }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('simple peer dependencies scenarios', async t => {
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
        { name: 'tsutils', version: '1.0.0', dependencies: {}, peerDependencies: { typescript: "*" } },
        { name: 'typescript', version: '1.0.0', dependencies: { baz: "*" } },
        { name: 'baz', version: '2.0.0'},
      ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { tsutils: '1.0.0', typescript: '1.0.0' }
    }
  }
  
  const resolved = {
    'foo@1.2.3 (root)': {
      'tsutils@1.0.0': {
        'typescript@1.0.0 (peer)': {
          'baz@2.0.0': {}
        }
      },
      'typescript@1.0.0': {
        'baz@2.0.0': {}
      }
    }
  }


  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})


tap.only('Lock file is same in hoisted and in isolated mode', async t => {
  const graph = {
  registry: [
      { name: 'which', version: '2.0.2' }
      ],
      root: { name: 'foo', version: '1.2.3', dependencies: { 'which': '2.0.2' } }
  }

  const { dir: hoistedModeDir , registry } = await getRepo(graph)
  const { dir: isolatedModeDir } = await getRepo(graph)

  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arboristHoisted  = new Arborist({ path: hoistedModeDir, registry, packumentCache: new Map(), cache  })
  const arboristIsolated  = new Arborist({ path: isolatedModeDir , registry, packumentCache: new Map(), cache  })

  await Promise.all([
    arboristHoisted.reify({ isolated: false }),
    arboristIsolated.reify({ isolated: true }),
  ])

  const [hoistedModeLockFile, isolatedModeLockFile] = await Promise.all([
    fs.promises.readFile(path.join(hoistedModeDir, 'package-lock.json'), { encoding: 'utf8' }),
    fs.promises.readFile(path.join(isolatedModeDir, 'package-lock.json'), { encoding: 'utf8' }),
  ])

  t.same(hoistedModeLockFile, isolatedModeLockFile, 'hoited mode and isolated mode produce the same lockfile')
})

tap.only('Basic workspaces setup', async t => {
  const graph = {
    registry: [
        { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
        { name: 'which', version: '2.0.0', dependencies: { isexe: '^1.0.0' } },
        { name: 'isexe', version: '1.0.0' }
      ] ,
    root: {
      name: 'dog', version: '1.2.3', dependencies: { bar: '*' }
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '2.0.0' } },
      { name: 'baz', version: '1.0.0', dependencies: { which: '2.0.0', bar: "*" } },
      { name: 'cat', version: '1.0.0', dependencies: { which: '1.0.0' } },
      { name: 'fish', version: '1.0.0', dependencies: { which: '1.0.0', cat: "*" } },
      { name: 'catfish', version: '1.0.0' },
    ]
  }


  const resolved = {
    'dog@1.2.3 (root)': {
      'bar@1.0.0 (workspace)': {
        'which@2.0.0': {
          'isexe@1.0.0': {}
        }
      },
      'baz@1.0.0 (workspace)': {
        'bar@1.0.0 (workspace)': {
          'which@2.0.0': {
            'isexe@1.0.0': {}
          }
        },
        'which@2.0.0': {
          'isexe@1.0.0': {}
        }
      },
      'cat@1.0.0 (workspace)': {
        'which@1.0.0': {
          'isexe@1.0.0': {}
        }
      },
      'fish@1.0.0 (workspace)': {
        'cat@1.0.0 (workspace)': {
          'which@1.0.0': {
            'isexe@1.0.0': {}
          }
        },
        'which@1.0.0': {
          'isexe@1.0.0': {}
        }
      },
      'catfish@1.0.0': {}
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('resolved versions are the same on isolated and in hoisted mode', async t => {
  const graph = {
    registry: [
        { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
        { name: 'which', version: '2.0.0', dependencies: { isexe: '^1.0.0' } },
        { name: 'isexe', version: '1.0.0' }
      ] ,
    root: {
      name: 'dog', version: '1.2.3', dependencies: { bar: '*' }
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '2.0.0' } },
      { name: 'baz', version: '1.0.0', dependencies: { which: '2.0.0', bar: "*" } },
      { name: 'cat', version: '1.0.0', dependencies: { which: '1.0.0' } },
      { name: 'fish', version: '1.0.0', dependencies: { which: '1.0.0', cat: "*" } },
      { name: 'catfish', version: '1.0.0' },
    ]
  }


  const resolved = {
    'dog@1.2.3 (root)': {
      'bar@1.0.0 (workspace)': {
        'which@2.0.0': {
          'isexe@1.0.0': {}
        }
      }
    },
    'bar@1.0.0 (workspace)': {
      'which@2.0.0': {
        'isexe@1.0.0': {}
      }
    },
    'baz@1.0.0 (workspace)': {
      'bar@1.0.0 (workspace)': {
        'which@2.0.0': {
          'isexe@1.0.0': {}
        }
      },
      'which@2.0.0': {
        'isexe@1.0.0': {}
      }
    },
    'cat@1.0.0 (workspace)': {
      'which@1.0.0': {
        'isexe@1.0.0': {}
      }
    },
    'fish@1.0.0 (workspace)': {
      'cat@1.0.0 (workspace)': {
        'which@1.0.0': {
          'isexe@1.0.0': {}
        }
      },
      'which@1.0.0': {
        'isexe@1.0.0': {}
      }
    },
    'catfish@1.0.0': {}
  }

  let { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  let cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  let arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  rule7.apply(t, dir, resolved, new Set())

  const mock = await getRepo(graph)
  dir = mock.dir
  registry = mock.registry

  // Note that we override this cache to prevent interference from other tests
  cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: false })

  // checking that the resolved graph is the same in hoisting and in isolated mode
  rule7.apply(t, dir, resolved, new Set())
})

tap.only('peer dependency chain', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'bar', version: '1.0.0', dependencies: { baz: '^1.0.0' }, peerDependencies: { boat : '*' } },
      { name: 'baz', version: '1.0.0', peerDependencies: { boat : '*' } },
      { name: 'boat', version: '3.0.0' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { bar: '1.0.0', boat: '^3.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'bar@1.0.0': {
        'baz@1.0.0': {
          'boat@3.0.0 (peer)': {}
        },
        'boat@3.0.0 (peer)': {}
      },
      'boat@3.0.0': {}
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('failing optional deps are not installed', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', os: [ '!linux' ] }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', optionalDependencies: { which: '1.0.0' }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })
  
  t.notOk(setupRequire(dir)('which'), 'Failing optional deps should not be installed')

  t.notOk(fs.existsSync(path.join(dir, 'node_modules', '.bin', 'which')))
})

tap.only('Optional deps are installed when possible', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', optionalDependencies: { which: '1.0.0' }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })
  
  t.ok(setupRequire(dir)('which'), 'Optional deps should be installed when possible')

  // TODO: make sure that existsSync is not deprecated
  t.ok(fs.existsSync(path.join(dir, 'node_modules', '.bin', 'which')))
})

tap.test('shrinkwrap', async t => {
  const shrinkwrap = JSON.stringify({
    "name": "which",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "which",
        "version": "1.0.0",
        "dependencies": {
          "isexe": "^1.0.0"
        }
      },
      "node_modules/isexe": {
        "version": "1.0.0",
        "resolved": "##REG##/isexe/1.0.0.tar"
      }
    },
    "dependencies": {
      "isexe": {
        "version": "1.0.0",
        "resolved": "##REG##/isexe/1.0.0.tar"
      }
    }
  })

  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' }, shrinkwrap, _hasShrinkwrap: true },
      { name: 'isexe', version: '1.1.0' },
      { name: 'isexe', version: '1.0.0' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0', isexe: '^1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {}
      },
      'isexe@1.1.0': {}
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.test('bundled dependencies', async t => {

  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' }, bundleDependencies: [ 'isexe' ],
        bundledDeps: [{ name: 'isexe', version: '1.0.0' }]
      },
      { name: 'isexe', version: '1.1.0' },
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {}
      }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('adding a dependency', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
      { name: 'bar', version: '2.2.0' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': {}
      },
      'bar@2.2.0': {}
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  // Add a new dependency
  const cache2 = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache: cache2, add: [ 'bar@^2.0.0' ]  })
  await arborist2.reify({ isolated: true })

  // Note that the 'resolved' dependency graph contains 'bar'
  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)

})

tap.only('removing a dependency', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0' },
      { name: 'bar', version: '2.2.0' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0', bar: '^2.0.0' }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })
  
  // checking that bar is installed
  t.ok(setupRequire(dir)('bar'), 'bar should be installed initially')

  // Add a new dependency
  const cache2 = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist2 = new Arborist({ path: dir, registry, packumentCache: new Map(), cache: cache2 })
  await arborist2.buildIdealTree({ rm: ['bar'] })
  await arborist2.reify({ isolated: true })

  t.notOk(setupRequire(dir)('bar'), 'bar should not be installed anymore')
})

tap.only('circular dependencies', async t => {

  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', dependencies: { isexe: '^1.0.0' } },
      { name: 'isexe', version: '1.0.0', dependencies: { which: '1.0.0' } },
      { name: 'bar', version: '1.2.6' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0', bar: '1.2.6' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        'isexe@1.0.0': '(back 1)' 
      },
      'bar@1.2.6': {}
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('circular peer dependencies', async t => {

  // Input of arborist
  const graph = {
    registry: [
      { name: 'cat', version: '1.0.0', peerDependencies: { bar: '*' } },
      { name: 'bar', version: '1.0.0', peerDependencies: { cat: '*' } }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { cat: '1.0.0', bar: '1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'cat@1.0.0': {
        'bar@1.0.0': '(back 1)' 
      },
      'bar@1.0.0': {
        'cat@1.0.0': '(back 1)'
      }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('peer dependency on parent', async t => {

  // Input of arborist
  const graph = {
    registry: [
      { name: 'cat', version: '1.0.0', dependencies: { bar: '*' } },
      { name: 'bar', version: '1.0.0', peerDependencies: { cat: '*' } }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { cat: '1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'cat@1.0.0': {
        'bar@1.0.0': '(back 1)' 
      }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('scoped package', async t => {
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
      { name: 'which', version: '1.0.0', dependencies: { ['@foo/isexe']: '^1.0.0' } },
      { name: '@foo/isexe', version: '1.0.0' }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'foo@1.2.3 (root)': {
      'which@1.0.0': {
        '@foo/isexe@1.0.0': {}
      }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('failing optional peer deps are not installed', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', os: [ 'npmOS' ] },
      { name: 'bar', version: '1.0.0', peerDependencies: { which: "*" }, peerDependenciesMeta: { which: { optional: true } } }
    ] ,
    root: {
      name: 'foo', version: '1.2.3', optionalDependencies: { which: '1.0.0', bar: '*' }
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })
  
  t.notOk(setupRequire(dir)('bar', 'which'), 'Failing optional peer deps should not be installed')
})

// Virtual packages are 2 packages that have the same version but are
// duplicated on disk to solve peer-dependency conflict.
tap.only('virtual packages', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'foo', version: '1.0.0' },
      { name: 'foo', version: '2.0.0', peerDependencies: { cat: '*' } },
      { name: 'cat', version: '1.0.0' },
      { name: 'cat', version: '2.0.0' },
      { name: 'bar', version: '1.0.0' , dependencies: { foo: '2.0.0', cat: '2.0.0' } },
      { name: 'baz', version: '1.0.0' , dependencies: { foo: '2.0.0', cat: '1.0.0' } },
    ] ,
    root: {
      name: 'toor', version: '1.2.3', dependencies: { foo: '1.0.0', bar: '*', baz: '*', cat: '1.0.0' }
    }
  }

  // expected output
  const resolved = {
    'toor@1.2.3 (root)': {
      'foo@1.0.0': {},
      'bar@1.0.0': {
        'foo@2.0.0': {
          'cat@2.0.0 (peer)': {}
        },
        'cat@2.0.0': {}
      },
      'baz@1.0.0': {
        'foo@2.0.0': {
          'cat@1.0.0 (peer)': {}
        },
        'cat@1.0.0': {}
      },
      'cat@1.0.0': {}
    }
  }

  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })
  
  const asserted = new Set()
  rule1.apply(t, dir, resolved, asserted)
  rule2.apply(t, dir, resolved, asserted)
  rule3.apply(t, dir, resolved, asserted)
  rule4.apply(t, dir, resolved, asserted)
  rule5.apply(t, dir, resolved, asserted)
  rule6.apply(t, dir, resolved, asserted)
  rule7.apply(t, dir, resolved, asserted)
})

tap.only('postinstall scripts are run', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', scripts: { postinstall: 'touch postInstallRanWhich' } },
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' }
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', scripts: { postinstall: 'touch postInstallRanBar' } },
    ]
  }


  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  const postInstallRanWhich = pathExists(`${setupRequire(dir)('which')}/postInstallRanWhich`)
  t.ok(postInstallRanWhich)

  const postInstallRanBar = pathExists(`${setupRequire(dir)('bar')}/postInstallRanBar`)
  t.ok(postInstallRanBar)
})

tap.only('bins are installed', async t => {
  // Input of arborist
  const graph = {
    registry: [
      { name: 'which', version: '1.0.0', bin: './bin.js' },
    ] ,
    root: {
      name: 'foo', version: '1.2.3', dependencies: { which: '1.0.0' }
    },
    workspaces: [
      { name: 'bar', version: '1.0.0', dependencies: { which: '1.0.0' }, bin: './bin.js' }
    ]
  }


  const { dir, registry } = await getRepo(graph)

  // Note that we override this cache to prevent interference from other tests
  const cache = fs.mkdtempSync(`${os.tmpdir}/test-`)
  const arborist = new Arborist({ path: dir, registry, packumentCache: new Map(), cache  })
  await arborist.reify({ isolated: true })

  // TODO: make the test not assume folder structure
  const binFromWhichToWhich = pathExists(`${setupRequire(dir)('which')}/../.bin/which`)
  t.ok(binFromWhichToWhich)

  const binFromRootToWhich = pathExists(`${dir}/node_modules/.bin/which`)
  t.ok(binFromRootToWhich)

  const binFromRootToBar = pathExists(`${dir}/node_modules/.bin/bar`)
  t.ok(binFromRootToBar)

  const binFromBarToWhich = pathExists(`${setupRequire(dir)('bar')}/node_modules/.bin/which`)
  t.ok(binFromBarToWhich )
})


function setupRequire(cwd) {
  return function requireChain(...chain) {
    return chain.reduce((path, name) => {
      if (path === undefined) {
        return undefined
      }
      return resolvePackage(name, path)
    }, cwd)
  }
}

function pathExists(path) {
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
function resolvePackage(name, from) {
  try {
    const loc = `${from}/node_modules/${name}`
    fs.statSync(loc);
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

function getAllPackages(resolvedGraph) {
  return [...getAllPackagesRecursive(resolvedGraph.root),
    ...(resolvedGraph.workspaces?.map(w => getAllPackagesRecursive(w)) || []).reduce((a,n) => ([...a, ...n]), [])]
}

function getAllPackagesRecursive(resolvedGraph) {
  return [
    resolvedGraph,
    ...(resolvedGraph.dependencies
      ?.filter(d => !isLoopToken(d))
      .map(d => getAllPackagesRecursive(d)) || [])
    .reduce((a,n) => ([...a, ...n]), [])
  ]
}

function withRequireChain(resolvedGraph) {
  return {
    root: {
      ...resolvedGraph.root,
      chain: [],
      initialDir: '.',
      dependencies: resolvedGraph.root.dependencies?.map(d => 
        withRequireChainRecursive(d, [], '.'))
    },
    workspaces: resolvedGraph.workspaces?.map(w => {
      const initialDir = `packages/${w.name}`
      return {
        ...w,
        chain: [],
        initialDir,
        dependencies: w.dependencies?.map(d => withRequireChainRecursive(d, [], initialDir))
      }
    })
  } 
}

function withRequireChainRecursive(resolvedGraph, chain, initialDir) {
  if ( isLoopToken(resolvedGraph)) {
    return resolvedGraph
  }

  const newChain = [...chain, resolvedGraph.name]
  return {
    ...resolvedGraph,
    chain: newChain,
    initialDir,
    dependencies: resolvedGraph.dependencies?.map(d => 
      withRequireChainRecursive(d, newChain, initialDir))
  } 
}

function parseGraph(graph) {
  const root = Object.entries(graph).find(([key]) => key.includes('(root)'))
  const result = { root: parseGraphRecursive(...root), workspaces: [] }

  Object.entries(graph).filter(([key]) => key.includes('(workspace)'))
    .forEach(([key, value]) => {
      result.workspaces.push(parseGraphRecursive(key, value))
  })
  return result
}

function isLoopToken(obj) {
  return typeof obj === 'string' && /^\(back \d+\)$/.test(obj)
}

function parseLoopToken(t) {
  return parseInt(/\d+/.exec(t)[0])
}

function parseGraphRecursive(key, deps) {
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


/*
  * TO TEST:
  *   --------------------------------------
  * - rollbacks
  * - scoped installs
  * - overrides?
  * - changing repo from isolated to hoisted and from hoisted to isolated
  */
