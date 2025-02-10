const t = require('tap')
const { format } = require('tcompare')
const Arborist = require('../../lib/arborist')

const { resolve } = require('node:path')
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

t.test('shake out Link target timing issue', t => {
  process.env._TEST_ARBORIST_SLOW_LINK_TARGET_ = '1'
  t.teardown(() => process.env._TEST_ARBORIST_SLOW_LINK_TARGET_ = '')
  const dir = resolve(fixtures, 'selflink')
  return loadActual(dir).then(tree =>
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

t.test('load workspaces when loading from hidding lockfile', async t => {
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

  // disable treeCheck since it prevents the original issue from occuring
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
