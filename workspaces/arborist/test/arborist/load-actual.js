const t = require('tap')
const { format } = require('tcompare')
const Arborist = require('../../lib/arborist')

const { join, resolve } = require('node:path')
const Node = require('../../lib/node.js')
const Shrinkwrap = require('../../lib/shrinkwrap.js')
const fs = require('node:fs')

const {
  fixtures,
  roots,
} = require('../fixtures/index.js')

// strip the fixtures path off of the trees in snapshots
const pp = path => path &&
  normalizePath(path).slice(normalizePath(fixtures).length + 1)
const defixture = obj => {
  if (obj instanceof Set) {
    return new Set([...obj].map(defixture))
  }

  if (obj instanceof Map) {
    return new Map([...obj].map(([name, val]) => [name, defixture(val)]))
  }

  for (const key in obj) {
    if (['path', 'realpath'].includes(key)) {
      obj[key] = pp(obj[key])
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      obj[key] = defixture(obj[key])
    }
  }
  return obj
}

const {
  normalizePath,
  printTree,
} = require('../fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

t.formatSnapshot = tree => format(defixture(printTree(tree)), { sort: true })

const loadActual = (path, opts) =>
  new Arborist({ path, ...opts }).loadActual(opts)

roots.forEach(path => {
  const dir = resolve(fixtures, path)
  t.test(path, t => loadActual(dir).then(tree =>
    t.matchSnapshot(tree, 'loaded tree')))
})

t.test('look for missing deps by default', t => {
  const paths = ['external-dep/root', 'external-link/root']
  t.plan(paths.length)
  for (const p of paths) {
    t.test(p, async t => {
      const path = resolve(__dirname, '../fixtures', p)
      const arb = new Arborist({ path })
      const tree = await arb.loadActual()
      t.matchSnapshot(tree, '"dep" should have missing deps, "link" should not')
    })
  }
})

t.test('already loaded', t => new Arborist({
  path: resolve(__dirname, '../fixtures/selflink'),
}).loadActual({ ignoreMissing: true }).then(actualTree => new Arborist({
  path: resolve(__dirname, '../fixtures/selflink'),
  actualTree,
}).loadActual().then(tree2 => t.equal(tree2, actualTree))))

t.test('already loading', t => {
  const arb = new Arborist({
    path: resolve(__dirname, '../fixtures/selflink'),
  })
  // try repeatedly to get at the actual tree, but it's not there until
  // the end of the process and the promise resolves
  const promise = arb.loadActual()
  const int = setInterval(() => {
    if (arb.actualTree) {
      t.fail('set public arb.actualTree before promise resolved')
    }
    arb.loadActual()
  })
  return promise.then(() => clearInterval(int))
})

t.test('load a tree rooted on a different node', async t => {
  const path = resolve(fixtures, 'workspace')
  const other = resolve(fixtures.replace(/[a-z]/gi, 'X'), 'workspace')
  const root = new Node({
    meta: await Shrinkwrap.reset({ path: other }),
    path: other,
    realpath: other,
    pkg: require(path + '/package.json'),
  })
  root.extraneous = false
  root.dev = false
  root.devOptional = false
  root.optional = false
  root.peer = false

  const actual = await (new Arborist({ path }).loadActual())
  const transp = await (new Arborist({ path }).loadActual({ root }))

  // verify that the transp nodes have the right paths
  t.equal(transp.children.get('a').path, resolve(other, 'node_modules/a'))
  t.equal(transp.children.get('b').path, resolve(other, 'node_modules/b'))
  t.equal(transp.children.get('c').path, resolve(other, 'node_modules/c'))
  t.not(transp.children.get('a').target, null, 'did not break link')
  t.not(transp.children.get('b').target, null, 'did not break link')
  t.not(transp.children.get('c').target, null, 'did not break link')
  t.equal(transp.children.get('a').realpath, resolve(other, 'packages/a'))
  t.equal(transp.children.get('b').realpath, resolve(other, 'packages/b'))
  t.equal(transp.children.get('c').realpath, resolve(other, 'packages/c'))

  // should look the same, once we strip off the other/fixture paths
  t.equal(format(defixture(printTree(actual))), format(defixture(printTree(transp))), 'similar trees')

  // now try with a transplant filter that keeps out the 'a' module
  const rootFiltered = new Node({
    meta: await Shrinkwrap.reset({ path: other }),
    path: other,
    realpath: other,
    pkg: require(path + '/package.json'),
  })
  rootFiltered.extraneous = false
  rootFiltered.dev = false
  rootFiltered.devOptional = false
  rootFiltered.optional = false
  rootFiltered.peer = false
  const transpFilter = await new Arborist({ path }).loadActual({
    root: rootFiltered,
    transplantFilter: n => n.name !== 'a',
  })
  t.equal(transpFilter.children.get('a'), undefined)
  t.equal(transpFilter.children.get('b').path, resolve(other, 'node_modules/b'))
  t.equal(transpFilter.children.get('c').path, resolve(other, 'node_modules/c'))
  t.equal(transpFilter.children.get('a'), undefined)
  t.equal(transpFilter.children.get('b').realpath, resolve(other, 'packages/b'))
  t.equal(transpFilter.children.get('c').realpath, resolve(other, 'packages/c'))
})

t.test('looking outside of cwd', t => {
  const cwd = process.cwd()
  t.teardown(() => process.chdir(cwd))
  process.chdir(resolve(__dirname, '../fixtures/selflink'))
  const dir = '../root'
  return loadActual(dir).then(tree =>
    t.matchSnapshot(tree, 'loaded tree'))
})

t.test('cwd is default root', t => {
  const cwd = process.cwd()
  t.teardown(() => process.chdir(cwd))
  process.chdir('test/fixtures/root')
  return loadActual().then(tree =>
    t.matchSnapshot(tree, 'loaded tree'))
})

t.test('broken json', async t => {
  const d = await loadActual(resolve(fixtures, 'bad'))
  t.ok(d.errors.length, 'Got an error object')
  t.equal(d.errors[0] && d.errors[0].code, 'EJSONPARSE')
  t.ok(d, 'Got a tree')
})

t.test('missing json does not obscure deeper errors', async t => {
  const d = await loadActual(resolve(fixtures, 'empty'))
  t.match(d, { errors: [{ code: 'ENOENT' }] },
    'Error reading json of top level')
  t.match(d.children.get('foo'), { errors: [{ code: 'EJSONPARSE' }] },
    'Error parsing JSON of child node')
})

t.test('missing folder', t =>
  t.rejects(loadActual(resolve(fixtures, 'does-not-exist')), {
    code: 'ENOENT',
  }))

t.test('missing symlinks', async t => {
  const d = await loadActual(resolve(fixtures, 'badlink'))
  t.equal(d.children.size, 2, 'both broken children are included')
  t.match(d.children.get('foo'), { errors: [{ code: 'ELOOP' }] },
    'foo has error')
  t.match(d.children.get('bar'), { errors: [{ code: 'ENOENT' }] },
    'bar has error')
})

t.test('load from a hidden lockfile', async (t) => {
  const tree = await loadActual(resolve(fixtures, 'hidden-lockfile'))
  t.ok(tree.meta.loadedFromDisk, 'meta was loaded from disk')
  t.matchSnapshot(tree)
})

t.test('do not load from a hidden lockfile when forceActual is set', async (t) => {
  const tree = await loadActual(resolve(fixtures, 'hidden-lockfile'), { forceActual: true })
  t.not(tree.meta.loadedFromDisk, 'meta was NOT loaded from disk')
  t.matchSnapshot(tree)
})

t.test('load a global space', t =>
  t.resolveMatchSnapshot(loadActual(resolve(fixtures, 'global-style/lib'), {
    global: true,
  })))
t.test('load a global space symlink', t =>
  t.resolveMatchSnapshot(loadActual(resolve(fixtures, 'global-style/lib-link'), {
    global: true,
  })))
t.test('load a global space with a filter', t =>
  t.resolveMatchSnapshot(loadActual(resolve(fixtures, 'global-style/lib'), {
    global: true,
    filter: (parent, kid) => parent.parent || kid === 'semver',
  })))

t.test('workspaces', t => {
  t.test('load a simple install tree containing workspaces', t =>
    t.resolveMatchSnapshot(
      loadActual(resolve(fixtures, 'workspaces-simple'))
    ))

  t.end()
})

t.test('load workspace targets, even if links not present', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
      dependencies: {
        wrappy: '1.0.0',
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
        }),
      },
      c: {
        'package.json': JSON.stringify({
          name: 'c',
          version: '1.2.3',
        }),
      },
    },
  })
  t.matchSnapshot(await loadActual(path))
})

t.test('transplant workspace targets, even if links not present', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
      dependencies: {
        wrappy: '1.0.0',
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
        }),
      },
      c: {
        'package.json': JSON.stringify({
          name: 'c',
          version: '1.2.3',
        }),
      },
    },
  })
  const root = new Node({
    path,
    pkg: {
      workspaces: ['packages/*'],
      dependencies: {
        wrappy: '1.0.0',
      },
    },
  })
  t.matchSnapshot(await loadActual(path, { root }), 'transplant everything')
  t.matchSnapshot(await loadActual(path, {
    root,
    transplantFilter: node => node.name !== 'a',
  }), 'do not transplant node named "a"')
})

t.test('linked strategy propagates dep flags into undeclared workspaces', async t => {
  // Undeclared workspaces aren't in root node_modules under linked; without the fix their edges resolve to null and stay dev.
  // `tools` is also a devDependency of `app`, so it is reached by both a prod root link and a dev `app` link.
  // `app` is linked into root node_modules, so its edge already resolves and the synthesis is skipped.
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      workspaces: ['packages/*'],
    }),
    node_modules: {
      '@test': {
        app: t.fixture('symlink', '../../packages/app'),
      },
    },
    packages: {
      app: {
        'package.json': JSON.stringify({
          name: '@test/app',
          version: '1.0.0',
          devDependencies: { '@test/tools': '*' },
        }),
        node_modules: {
          '@test': {
            tools: t.fixture('symlink', '../../../tools'),
          },
        },
      },
      tools: {
        'package.json': JSON.stringify({
          name: '@test/tools',
          version: '1.0.0',
        }),
      },
    },
  })
  const tree = await loadActual(path, { installStrategy: 'linked' })
  const byLocation = loc => [...tree.inventory.values()].find(n => n.location === loc)
  const app = byLocation('packages/app')
  const tools = byLocation('packages/tools')
  t.equal(app.dev, false, 'app workspace is prod')
  t.equal(tools.dev, false, 'tools workspace is prod, not overwritten by the dev app link')
})

t.test('linked strategy surfaces undeclared workspaces', async t => {
  // Under linked, undeclared workspaces are not symlinked into root node_modules, so loadActual must synthesize their root links for their edges to resolve (npm/cli#9618).
  const fixture = {
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      workspaces: ['packages/*'],
      // declared workspace is symlinked at root; undeclared one is not
      dependencies: { a: '*' },
    }),
    node_modules: {
      a: t.fixture('symlink', '../packages/a'),
    },
    packages: {
      a: { 'package.json': JSON.stringify({ name: 'a', version: '1.2.3' }) },
      b: { 'package.json': JSON.stringify({ name: 'b', version: '1.2.3' }) },
    },
  }

  const assertVisible = (t, tree) => {
    const aLink = tree.children.get('a')
    const bLink = tree.children.get('b')
    t.ok(aLink, 'declared workspace a present (from disk symlink)')
    t.ok(bLink, 'undeclared workspace b synthesized')
    t.equal(tree.edgesOut.get('b').to, bLink, 'workspace edge b resolves to its link')
    t.notOk(tree.edgesOut.get('b').missing, 'workspace edge b is not missing')
    t.equal(bLink.target.version, '1.2.3', 'b target loaded')
  }

  t.test('filesystem scan', async t => {
    const path = t.testdir(fixture)
    assertVisible(t, await loadActual(path, { installStrategy: 'linked' }))
  })

  t.test('hidden lockfile', async t => {
    const path = t.testdir({
      ...fixture,
      node_modules: {
        a: t.fixture('symlink', '../packages/a'),
        '.package-lock.json': JSON.stringify({
          name: 'root',
          lockfileVersion: 3,
          requires: true,
          packages: {
            'node_modules/a': { resolved: 'packages/a', link: true },
            'packages/a': { version: '1.2.3' },
            'packages/b': { version: '1.2.3' },
          },
        }),
      },
    })
    const hidden = resolve(path, 'node_modules/.package-lock.json')
    const then = Date.now() + 10000
    fs.utimesSync(hidden, new Date(then), new Date(then))
    assertVisible(t, await loadActual(path, { installStrategy: 'linked' }))
  })

  t.test('no workspaces is a no-op', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({ name: 'root', version: '1.0.0' }),
    })
    const tree = await loadActual(path, { installStrategy: 'linked' })
    t.notOk(tree.workspaces, 'no workspaces set')
    t.equal(tree.children.size, 0, 'no links synthesized')
  })

  t.test('does not clobber an existing root child', async t => {
    // an undeclared workspace that already has a root symlink keeps that child instead of a synthesized link
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        version: '1.0.0',
        workspaces: ['packages/*'],
      }),
      node_modules: {
        b: t.fixture('symlink', '../packages/b'),
      },
      packages: {
        a: { 'package.json': JSON.stringify({ name: 'a', version: '1.2.3' }) },
        b: { 'package.json': JSON.stringify({ name: 'b', version: '1.2.3' }) },
      },
    })
    const tree = await loadActual(path, { installStrategy: 'linked' })
    t.equal(tree.children.get('b').realpath, resolve(path, 'packages/b'), 'existing b child preserved')
    t.ok(tree.children.get('a'), 'undeclared a still synthesized')
  })

  t.test('skips a workspace with no loaded target', async t => {
    // hidden lockfile omits packages/b, so it is in the workspaces map but never loaded; it must be skipped, not crash
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'root',
        version: '1.0.0',
        workspaces: ['packages/*'],
      }),
      node_modules: {
        '.package-lock.json': JSON.stringify({
          name: 'root',
          lockfileVersion: 3,
          requires: true,
          packages: {
            'packages/a': { version: '1.2.3' },
          },
        }),
      },
      packages: {
        a: { 'package.json': JSON.stringify({ name: 'a', version: '1.2.3' }) },
        b: { 'package.json': JSON.stringify({ name: 'b', version: '1.2.3' }) },
      },
    })
    const hidden = resolve(path, 'node_modules/.package-lock.json')
    const then = Date.now() + 10000
    fs.utimesSync(hidden, new Date(then), new Date(then))
    const tree = await loadActual(path, { installStrategy: 'linked' })
    t.ok(tree.children.get('a'), 'loaded workspace a synthesized')
    t.notOk(tree.children.get('b'), 'unloaded workspace b skipped')
  })
})

t.test('load workspaces when loading from hidden lockfile', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
    }),
    node_modules: {
      a: t.fixture('symlink', '../packages/a'),
      b: t.fixture('symlink', '../packages/b'),
      '.package-lock.json': JSON.stringify({
        name: 'workspace-abc',
        lockfileVersion: 2,
        requires: true,
        packages: {
          'node_modules/a': {
            resolved: 'packages/a',
            link: true,
          },
          'node_modules/b': {
            resolved: 'packages/b',
            link: true,
          },
          'packages/a': {
            version: '1.0.0',
          },
          'packages/b': {
            version: '1.2.3',
          },
        },
      }),
    },
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          // note: version changed since reifying
          version: '1.2.3',
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
        }),
      },
    },
  })
  const hidden = resolve(path, 'node_modules/.package-lock.json')
  const then = Date.now() + 10000
  fs.utimesSync(hidden, new Date(then), new Date(then))
  const tree = await loadActual(path)
  const aLink = tree.children.get('a')
  const bLink = tree.children.get('b')
  t.notOk(aLink.extraneous, 'a link not be extraneous')
  t.notOk(bLink.extraneous, 'b link not be extraneous')
  const aTarget = aLink.target
  const bTarget = bLink.target
  t.notOk(aTarget.extraneous, 'a target not be extraneous')
  t.notOk(bTarget.extraneous, 'b target not be extraneous')
  t.equal(aTarget.version, '1.2.3', 'updated a target version')
  t.matchSnapshot(tree, 'actual tree')
})

t.test('recalc dep flags for virtual load actual', async t => {
  const path = t.testdir({
    node_modules: {
      abbrev: {
        'package.json': JSON.stringify({
          name: 'abbrev',
          version: '1.1.1',
        }),
      },
      '.package-lock.json': JSON.stringify({
        lockfileVersion: 2,
        requires: true,
        packages: {
          'node_modules/abbrev': {
            version: '1.1.1',
            resolved: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz',
            integrity: 'sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==',
          },
        },
      }),
    },
    'package.json': JSON.stringify({}),
  })

  const hidden = resolve(path, 'node_modules/.package-lock.json')
  const then = Date.now() + 10000
  fs.utimesSync(hidden, new Date(then), new Date(then))
  const tree = await loadActual(path)
  const abbrev = tree.children.get('abbrev')
  t.equal(abbrev.extraneous, true, 'abbrev is extraneous')
})

t.test('load global space with link deps', async t => {
  const path = t.testdir({
    target: {
      'package.json': JSON.stringify({
        name: 'foo',
        version: '1.2.3',
      }),
    },
    node_modules: {
      foo: t.fixture('symlink', '../target'),
      bar: {
        'package.json': JSON.stringify({
          name: 'bar',
          version: '2.3.4',
        }),
      },
    },
  })
  const tree = await loadActual(path, { global: true })
  t.strictSame(tree.package, {
    dependencies: {
      foo: `file:${resolve(path, 'target')}`,
      bar: '*',
    },
  })
})

t.test('no edge errors for nested deps', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'a',
      version: '1.0.0',
      dependencies: {
        b: '1.0.0',
      },
    }),
    node_modules: {
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.0.0',
          dependencies: {
            c: '1.0.0',
          },
        }),
      },
      c: {
        'package.json': JSON.stringify({
          name: 'c',
          version: '1.0.0',
        }),
      },
    },
  })

  // disable treeCheck since it prevents the original issue from occurring
  const ArboristNoTreeCheck = t.mock('../../lib/arborist', {
    '../../lib/tree-check.js': tree => tree,
  })
  const loadActualNoTreeCheck = (path, opts) =>
    new ArboristNoTreeCheck({ path, ...opts }).loadActual(opts)

  const tree = await loadActualNoTreeCheck(path)

  // assert that no outgoing edges have errors
  for (const node of tree.inventory.values()) {
    for (const [name, edge] of node.edgesOut.entries()) {
      t.equal(edge.error, null, `node ${node.name} has outgoing edge to ${name} with error ${edge.error}`)
    }
  }
})

t.test('loading a workspace maintains overrides', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: {
        foo: '1.0.0',
      },
      overrides: {
        bar: '2.0.0',
      },
      workspaces: ['./foo'],
    }),
    foo: {
      'package.json': JSON.stringify({
        name: 'foo',
        version: '1.0.0',
        dependencies: {
          bar: '1.0.0',
        },
      }),
    },
  })

  const tree = await loadActual(path)

  const fooEdge = tree.edgesOut.get('foo')
  t.equal(tree.overrides, fooEdge.overrides, 'foo edge got the correct overrides')
})

t.test('applies root packageExtensions to a linked actual tree', async t => {
  // packageExtensions never rewrite a package's package.json, so the extension edge lives only in lockfile metadata.
  // The linked store layout forces loadActual onto the filesystem-scan path, where the edge must be re-derived from the root rule set.
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { broken: '1.0.0', safe: '1.0.0' },
      packageExtensions: { 'broken@1': { dependencies: { missing: '^1.0.0' } } },
    }),
    node_modules: {
      broken: t.fixture('symlink', '.store/broken@1.0.0/node_modules/broken'),
      // safe matches no selector, exercising the non-extended path
      safe: t.fixture('symlink', '.store/safe@1.0.0/node_modules/safe'),
      '.store': {
        'broken@1.0.0': {
          node_modules: {
            // physical manifest deliberately omits the extension-added dependency
            broken: { 'package.json': JSON.stringify({ name: 'broken', version: '1.0.0' }) },
            missing: t.fixture('symlink', '../../missing@1.0.0/node_modules/missing'),
          },
        },
        'missing@1.0.0': {
          node_modules: {
            missing: { 'package.json': JSON.stringify({ name: 'missing', version: '1.0.0' }) },
          },
        },
        'safe@1.0.0': {
          node_modules: {
            safe: { 'package.json': JSON.stringify({ name: 'safe', version: '1.0.0' }) },
          },
        },
      },
    },
  })

  const tree = await loadActual(path)
  const brokenLink = tree.children.get('broken')
  const broken = brokenLink.target
  const edge = broken.edgesOut.get('missing')
  t.ok(edge && !edge.error, 'extension-added edge is present and resolves')
  t.equal(edge.to.name, 'missing', 'edge resolves to the installed package')
  const applied = { selector: 'broken@1', dependencies: ['missing'] }
  t.strictSame(broken.packageExtensionsApplied, applied, 'provenance recorded on the store node')
  t.strictSame(brokenLink.packageExtensionsApplied, applied, 'provenance mirrored onto the link')
})

t.test('forwards a transitive override through a linked store link — npm/cli#9619', async t => {
  // The override must propagate through the intermediate store Link whose own direct deps don't name the overridden package, or `npm ls` reports the edge `invalid` instead of `overridden`.
  // Shaped like glob -> minimatch -> brace-expansion: the override target sits two links deep, with a shared node reached by two paths.
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { a: '1.0.0' },
      overrides: { leaf: '2.0.0' },
    }),
    node_modules: {
      a: t.fixture('symlink', '.store/a@1.0.0/node_modules/a'),
      '.store': {
        'a@1.0.0': {
          node_modules: {
            a: { 'package.json': JSON.stringify({ name: 'a', version: '1.0.0', dependencies: { b: '1.0.0', c: '1.0.0' } }) },
            b: t.fixture('symlink', '../../b@1.0.0/node_modules/b'),
            c: t.fixture('symlink', '../../c@1.0.0/node_modules/c'),
          },
        },
        'b@1.0.0': {
          node_modules: {
            // leaf is declared ^1.0.0 but overridden to 2.0.0, which is outside that range
            b: { 'package.json': JSON.stringify({ name: 'b', version: '1.0.0', dependencies: { leaf: '^1.0.0', shared: '1.0.0' } }) },
            leaf: t.fixture('symlink', '../../leaf@2.0.0/node_modules/leaf'),
            shared: t.fixture('symlink', '../../shared@1.0.0/node_modules/shared'),
          },
        },
        'c@1.0.0': {
          node_modules: {
            // c's subtree has no overridden package but reaches shared via both c and c->d, so its walk revisits a seen node
            c: { 'package.json': JSON.stringify({ name: 'c', version: '1.0.0', dependencies: { d: '1.0.0', shared: '1.0.0' } }) },
            d: t.fixture('symlink', '../../d@1.0.0/node_modules/d'),
            shared: t.fixture('symlink', '../../shared@1.0.0/node_modules/shared'),
          },
        },
        'd@1.0.0': {
          node_modules: {
            d: { 'package.json': JSON.stringify({ name: 'd', version: '1.0.0', dependencies: { shared: '1.0.0' } }) },
            shared: t.fixture('symlink', '../../shared@1.0.0/node_modules/shared'),
          },
        },
        'leaf@2.0.0': {
          node_modules: {
            leaf: { 'package.json': JSON.stringify({ name: 'leaf', version: '2.0.0' }) },
          },
        },
        'shared@1.0.0': {
          node_modules: {
            shared: { 'package.json': JSON.stringify({ name: 'shared', version: '1.0.0' }) },
          },
        },
      },
    },
  })

  const tree = await loadActual(path)
  const b = tree.children.get('a').target.edgesOut.get('b').to.target
  const leafEdge = b.edgesOut.get('leaf')
  t.ok(leafEdge && !leafEdge.error, 'transitive overridden edge resolves without error')
  t.ok(leafEdge.overrides, 'edge carries the override rule')
  t.equal(leafEdge.spec, '2.0.0', 'edge spec is the overridden version')
  t.equal(leafEdge.rawSpec, '^1.0.0', 'edge rawSpec is the original declared range')
  t.equal(leafEdge.to.target.version, '2.0.0', 'edge resolves to the overridden package')
})

t.test('forwards a transitive override across a file: link boundary — npm/cli#9659', async t => {
  // The override path crosses a file: link (root -> a) before entering the store chain (a -> b -> leaf).
  // Loading from the hidden lockfile, the file link target's subtree resolves late, so override repropagation must run once all edges are resolved or `npm ls` reports the edge `invalid`.
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { a: 'file:./pkgs/a' },
      overrides: { leaf: '2.0.0' },
    }),
    pkgs: {
      a: {
        'package.json': JSON.stringify({ name: 'a', version: '1.0.0', dependencies: { b: '1.0.0' } }),
        node_modules: {
          b: t.fixture('symlink', '../../../node_modules/.store/b@1.0.0/node_modules/b'),
        },
      },
    },
    node_modules: {
      a: t.fixture('symlink', '../pkgs/a'),
      '.store': {
        'b@1.0.0': {
          node_modules: {
            // leaf is declared ^1.0.0 but overridden to 2.0.0, outside that range
            b: { 'package.json': JSON.stringify({ name: 'b', version: '1.0.0', dependencies: { leaf: '^1.0.0' } }) },
            leaf: t.fixture('symlink', '../../leaf@2.0.0/node_modules/leaf'),
          },
        },
        'leaf@2.0.0': {
          node_modules: {
            leaf: { 'package.json': JSON.stringify({ name: 'leaf', version: '2.0.0' }) },
          },
        },
      },
      '.package-lock.json': JSON.stringify({
        name: 'root',
        lockfileVersion: 3,
        requires: true,
        packages: {
          '': { name: 'root', version: '1.0.0', dependencies: { a: 'file:./pkgs/a' }, overrides: { leaf: '2.0.0' } },
          'node_modules/a': { resolved: 'pkgs/a', link: true },
          'pkgs/a': { version: '1.0.0', dependencies: { b: '1.0.0' } },
          'pkgs/a/node_modules/b': { resolved: 'node_modules/.store/b@1.0.0/node_modules/b', link: true },
          'node_modules/.store/b@1.0.0': {},
          'node_modules/.store/b@1.0.0/node_modules/b': { version: '1.0.0', dependencies: { leaf: '^1.0.0' } },
          'node_modules/.store/b@1.0.0/node_modules/leaf': { resolved: 'node_modules/.store/leaf@2.0.0/node_modules/leaf', link: true },
          'node_modules/.store/leaf@2.0.0': {},
          'node_modules/.store/leaf@2.0.0/node_modules/leaf': { version: '2.0.0' },
        },
      }),
    },
  })
  // make the hidden lockfile the newest entry so loadActual loads from it
  const hidden = resolve(path, 'node_modules/.package-lock.json')
  const then = Date.now() + 10000
  fs.utimesSync(hidden, new Date(then), new Date(then))

  const tree = await loadActual(path)
  const b = tree.children.get('a').target.edgesOut.get('b').to.target
  const leafEdge = b.edgesOut.get('leaf')
  t.ok(leafEdge && !leafEdge.error, 'transitive overridden edge resolves without error')
  t.ok(leafEdge.overrides, 'edge carries the override rule')
  t.equal(leafEdge.spec, '2.0.0', 'edge spec is the overridden version')
  t.equal(leafEdge.to.target.version, '2.0.0', 'edge resolves to the overridden package')
})

t.test('store nodes do not load devDependencies as required edges', async t => {
  // A package in the linked store is structurally a tree top, so without the isInStore guard its devDependencies would load as required edges and surface as missing (e.g. npm sbom ESBOMPROBLEMS).
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '1.0.0' },
    }),
    node_modules: {
      dep: t.fixture('symlink', '.store/dep@1.0.0/node_modules/dep'),
      '.store': {
        'dep@1.0.0': {
          node_modules: {
            dep: {
              'package.json': JSON.stringify({
                name: 'dep',
                version: '1.0.0',
                devDependencies: { 'a-dev-dep': '^1.0.0' },
              }),
            },
          },
        },
      },
    },
  })

  const tree = await loadActual(path)
  const dep = tree.children.get('dep').target
  t.equal(dep.isInStore, true, 'store node is flagged isInStore')
  t.notOk(dep.edgesOut.get('a-dev-dep'), 'devDependency of a store node is not a required edge')
})

t.test('loads an installed transitive optional dep from the linked store', async t => {
  // A transitive optional dep lives as a store sibling, and its edge reports missing === false despite having no target.
  // #findMissingEdges must still walk it, or npm sbom/query omit the installed dep.
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { dep: '1.0.0' },
    }),
    node_modules: {
      dep: t.fixture('symlink', '.store/dep@1.0.0/node_modules/dep'),
      '.store': {
        'dep@1.0.0': {
          node_modules: {
            dep: {
              'package.json': JSON.stringify({
                name: 'dep',
                version: '1.0.0',
                optionalDependencies: { opt: '^1.0.0' },
              }),
            },
            // the optional dep is installed as a store sibling of its consumer
            opt: { 'package.json': JSON.stringify({ name: 'opt', version: '1.0.0' }) },
          },
        },
      },
    },
  })

  const tree = await loadActual(path)
  const dep = tree.children.get('dep').target
  const edge = dep.edgesOut.get('opt')
  t.ok(edge && !edge.error, 'optional edge resolves')
  t.equal(edge.to?.name, 'opt', 'edge resolves to the installed package')
  t.ok([...tree.inventory.values()].some(n => n.name === 'opt'), 'opt is present in the inventory')
})

t.test('a project located under a .store path still loads its own devDependencies', async t => {
  // The loaded root must never be treated as a store node, even when its own path happens to sit under a node_modules/.store directory.
  const path = t.testdir({
    node_modules: {
      '.store': {
        'root@1.0.0': {
          node_modules: {
            root: {
              'package.json': JSON.stringify({
                name: 'root',
                version: '1.0.0',
                devDependencies: { 'a-dev-dep': '^1.0.0' },
              }),
            },
          },
        },
      },
    },
  })
  const root = join(path, 'node_modules/.store/root@1.0.0/node_modules/root')

  const tree = await loadActual(root)
  t.equal(tree.isInStore, false, 'loaded root is not flagged isInStore')
  t.ok(tree.edgesOut.get('a-dev-dep'), 'root devDependency is a required edge')
})
