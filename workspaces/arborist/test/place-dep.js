const t = require('tap')
const PlaceDep = require('../lib/place-dep.js')
const { KEEP } = require('../lib/can-place-dep.js')

// for diffing trees when we place something
const { strict } = require('tcompare')

const { normalizePaths } = require('./fixtures/utils.js')

const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const OverrideSet = require('../lib/override-set.js')

t.test('placement tests', t => {
  const path = '/some/path'

  // boilerplate so we can define a bunch of test cases declaratively
  const runTest = (desc, options) => {
    const {
      // the tree we're placing a dep within
      tree,
      // the location of the node with the dependency
      nodeLoc,
      // the dep being added
      dep,
      // array of nodes representing the dep's peer group
      peerSet,
      // an extra function for running assertions after placement
      test,
      // do we expect this to fail with ERESOLVE?
      error = false,
      // --prefer-dedupe set?
      preferDedupe = false,
      // --force set?
      force = false,
      // is this the thing the user is explicitly installing?
      explicitRequest,
      // the names passed to `npm update foo bar baz` for example.
      updateNames = [],
      // an audit report, telling us which nodes are vulnerable
      auditReport = null,
      // --strict-peer-deps set?
      strictPeerDeps = false,
      // --legacy-peer-deps set?
      legacyPeerDeps = false,
      // installing with --global or --global-style?
      installStrategy = 'hoisted',
    } = options

    const node = tree.inventory.get(nodeLoc)
    const edge = node.edgesOut.get(dep.name)
    if (!dep.satisfies(edge)) {
      edge.peerConflicted = true
    }
    const vr = new Node({
      sourceReference: node,
      path: node.path,
      pkg: { ...node.package },
      children: peerSet,
    })
    dep.parent = vr

    // mark any invalid edges in the virtual root as peerConflicted
    for (const child of vr.children.values()) {
      for (const edgeIn of child.edgesIn) {
        if (edgeIn.invalid) {
          edgeIn.peerConflicted = true
        }
      }
    }

    const place = () => {
      return new PlaceDep({
        edge,
        dep,
        preferDedupe,
        force,
        explicitRequest,
        updateNames,
        auditReport,
        strictPeerDeps,
        legacyPeerDeps,
        installStrategy,
      })
    }

    t.test(desc, t => {
      const before = normalizePaths(tree.toJSON())

      // the 'error' arg is the ERESOLVE we expect to get
      if (error) {
        const thrown = t.throws(place)
        t.matchSnapshot(normalizePaths(thrown), 'thrown error')
        const after = normalizePaths(tree.toJSON())
        t.strictSame(before, after, 'tree should not change')
        t.end()

        // any time we have an error, we should NOT get that error
        // when run in force or legacyPeerDeps mode
        runTest(desc + ', force', {
          ...options,
          error: false,
          force: true,
          legacyPeerDeps: false,
        })
        if (!edge.peer && !legacyPeerDeps) {
          runTest(desc + ', legacyPeerDeps', {
            ...options,
            error: false,
            force: false,
            legacyPeerDeps: true,
            peerSet: [],
          })
        }
        return
      }

      const warnings = []
      const onwarn = (level, ...msg) => {
        if (level === 'warn') {
          warnings.push(msg)
        }
      }

      process.on('log', onwarn)
      let pd
      try {
        pd = place()
      } catch (er) {
        console.error(require('util').inspect(er, { depth: Infinity }))
        throw er
      }
      process.removeListener('log', onwarn)

      if (test) {
        test(t, tree, pd)
      }

      const after = normalizePaths(tree.toJSON())
      const { diff } = strict(after, before)

      if (pd.needEvaluation.size) {
        t.matchSnapshot([...pd.needEvaluation]
          .map(n => `${n.location} ${n.version}`))
      }
      t.matchSnapshot(diff, 'changes to tree')
      t.matchSnapshot(normalizePaths(warnings), 'warnings')
      t.matchSnapshot([pd, ...pd.allChildren].map(c => {
        if (c.canPlace && c.canPlace.canPlace === KEEP) {
          t.equal(c.placed, null, 'should not place if result is KEEP')
        }
        return normalizePaths({
          ...(c.parent ? { parent: c.parent.name } : {}),
          edge: `{ ${
            c.edge.from.location || 'ROOT'
          } ${c.edge.type} ${c.edge.name}@${c.edge.spec} }`,
          dep: `${c.dep.name}@${c.dep.version}`,
          canPlace: c.canPlace && c.canPlace.canPlace,
          canPlaceSelf: c.canPlaceSelf && c.canPlaceSelf.canPlaceSelf,
          placed: c.placed && c.placed.location,
          checks: new Map([...pd.checks].map(([target, cpd]) =>
            [target.location, [cpd.canPlace, cpd.canPlaceSelf]])),
        })
      }), 'placements')

      t.end()
    })
  }

  runTest('basic placement of a production dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' } },
    }),
    dep: new Node({ pkg: { name: 'foo', version: '1.0.0' } }),
    nodeLoc: '',
  })

  runTest('explicit placement of a production dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' } },
    }),
    dep: new Node({ pkg: { name: 'foo', version: '1.0.0' } }),
    nodeLoc: '',
    explicitRequest: true,
  })

  runTest('dedupe a transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' } } },
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' } }),
    nodeLoc: 'node_modules/foo',
  })

  runTest('upgrade a transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' } } },
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1' } } },
        { pkg: { name: 'bar', version: '1.0.0' } },
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.1' } }),
    nodeLoc: 'node_modules/foo',
  })

  runTest('nest a transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' } } },
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' } } },
        { pkg: { name: 'bar', version: '1.0.1' } },
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' } }),
    nodeLoc: 'node_modules/baz',
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/bar')
      t.equal(foobar.version, '1.0.1')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar.location, 'node_modules/baz/node_modules/bar')
      t.equal(bazbar.version, '1.0.0')
    },
  })

  runTest('accept an older transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' } } },
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' } } },
        { pkg: { name: 'bar', version: '1.0.0' } },
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.1' } }),
    nodeLoc: 'node_modules/foo',
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/bar')
      t.equal(foobar.version, '1.0.0')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar.location, 'node_modules/bar')
      t.equal(bazbar.version, '1.0.0')
    },
  })

  runTest('nest even though unnecessary, because legacy bundling', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' } } },
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' } }),
    nodeLoc: 'node_modules/foo',
    installStrategy: 'nested',
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/foo/node_modules/bar')
      t.equal(foobar.version, '1.0.0')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar, null)
    },
  })

  runTest('nest because globalStyle', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' } }),
    nodeLoc: 'node_modules/foo',
    installStrategy: 'shallow',
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/foo/node_modules/bar')
    },
  })

  runTest('nest only 1 level due to globalStyle', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        {
          pkg: {
            name: 'foo',
            version: '1.0.0',
            dependencies: { bar: '1' },
          },
          children: [
            {
              pkg: {
                name: 'bar',
                version: '1.0.0',
                dependencies: { baz: '' },
              },
            },
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'baz', version: '1.0.0' } }),
    nodeLoc: 'node_modules/foo/node_modules/bar',
    installStrategy: 'shallow',
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      const foobarbaz = foobar.resolve('baz')
      t.equal(foobar.location, 'node_modules/foo/node_modules/bar')
      t.equal(foobarbaz.location, 'node_modules/foo/node_modules/baz')
    },
  })

  runTest('prefer to dedupe rather than nest', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' } },
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' } } },
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' } } },
        { pkg: { name: 'bar', version: '1.0.1' } },
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' } }),
    nodeLoc: 'node_modules/baz',
    preferDedupe: true,
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/bar')
      t.equal(foobar.version, '1.0.0')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar.location, 'node_modules/bar')
      t.equal(bazbar.version, '1.0.0')
    },
  })

  runTest('dep with load error', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' } },
    }),
    dep: new Node({
      error: Object.assign(new Error('oops'), { code: 'testing' }),
      name: 'foo',
    }),
    nodeLoc: '',
  })

  // root -> (x, y@1)
  // +-- x -> (y@1.1)
  // |   +-- y@1.1.0 (replacing with 1.1.2, got KEEP at the root)
  // +-- y@1.1.2 (updated already from 1.0.0)
  runTest('keep, but dedupe', {
    tree: new Node({
      path,
      pkg: { dependencies: { x: '', y: '1', z: 'file:z' } },
      children: [
        { pkg: { name: 'y', version: '1.1.2' } },
        {
          pkg: { name: 'x', version: '1.0.0', dependencies: { y: '1.1' } },
          children: [{ pkg: { name: 'y', version: '1.1.0' } }],
        },
      ],
      fsChildren: [
        {
          path: `${path}/z`,
          pkg: { name: 'z', version: '1.2.3', dependencies: { y: '1' } },
          // this will get deduped out
          children: [{ pkg: { name: 'y', version: '1.1.2' } }],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '1.1.2' } }),
    updateNames: ['y'],
    nodeLoc: 'node_modules/x',
    test: (t, tree) => {
      const x = tree.children.get('x')
      const y = x.resolve('y')
      t.equal(y.location, 'node_modules/y')
      t.equal(y.version, '1.1.2')
      const z = tree.inventory.get('z')
      const zy = z.resolve('y')
      t.equal(zy.location, y.location, 'y bundled under z is removed')
    },
  })

  // y depends on z@1, everything else depends on z@2, so every y has a z dupe
  // root -> (y@1, x, z@2, a, k@file:k)
  // +-- a -> (y@1.0.0, z@2.0.0)
  // |   +-- z@2.0.0
  // |   +-- y@1.0.0 -> (z@1, file:v) (will not be deduped)
  // |       +fs v@1.0.0 -> (z@2)
  // |       |   +-- z@2.0.0
  // |       +-- z@1.0.0
  // +-- z@2.1.0
  // +-- f@1.0.0 (will be pruned upon replacement)
  // +-- y@1.1.0 -> (z@1, f) (replacing with 1.2.2)
  // |   +-- z@1.0.0
  // +-- x -> (y@1.2, z@2)
  //     +-- y@1.2.0 -> (z@1, w@1) (got REPLACE at the root, will dedupe)
  //         +-- z@1.0.0
  // root/k -> (y@1.2)
  // +-- y@1.2.0 -> (z@1) (will dedupe)
  // +-- z@1.0.0 (will be pruned when y sibling removed)
  runTest('replace higher up, and dedupe descendants', {
    tree: new Node({
      path,
      pkg: { dependencies: { y: '1', z: '2', a: '', x: '' } },
      children: [
        {
          pkg: { name: 'a', version: '1.0.0', dependencies: { y: '1.0.0', z: '2.0.0' } },
          children: [
            { pkg: { name: 'z', version: '2.0.0' } },
            {
              pkg: { name: 'y', dependencies: { z: '1' } },
              children: [{ pkg: { name: 'z', version: '1.0.0' } }],
            },
          ],
        },
        { pkg: { name: 'f', version: '1.0.0', dependencies: { g: '' } } },
        { pkg: { name: 'g', version: '1.0.0' } },
        {
          pkg: { name: 'y', version: '1.1.0', dependencies: { z: '1', f: '' } },
          children: [{ pkg: { name: 'z', version: '1.0.0' } }],
        },
        { pkg: { name: 'z', version: '2.1.0' } },
        {
          pkg: { name: 'x', version: '1.0.0', dependencies: { y: '1.2', z: '2' } },
          children: [{
            pkg: { name: 'y', version: '1.2.0', dependencies: { z: '1' } },
            children: [{ pkg: { name: 'z', version: '1.0.0' } }],
          }],
        },
      ],
      // root/k -> (y@1.2)
      // +-- y@1.2.0 -> (z@1) (will dedupe)
      // +-- z@1.0.0
      fsChildren: [
        {
          pkg: { name: 'k', dependencies: { y: '1.2' } },
          path: `${path}/k`,
          children: [
            { pkg: { name: 'y', version: '1.2.0', dependencies: { z: '1' } } },
            { pkg: { name: 'z', version: '1.0.0' } },
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '1.2.2', dependencies: { z: '1' } } }),
    auditReport: {
      isVulnerable: node => node.name === 'y' && node.version === '1.2.0',
    },
    nodeLoc: 'node_modules/x',
    test: (t, tree) => {
      const x = tree.children.get('x')
      const y = x.resolve('y')
      t.equal(y.location, 'node_modules/y')
      t.equal(y.version, '1.2.2')
      t.equal(tree.resolve('f'), null)
      t.equal(tree.resolve('g'), null)
      const z = tree.resolve('z')
      t.equal(z.location, 'node_modules/z')
      t.equal(z.version, '2.1.0')
      const k = tree.inventory.get('k')
      t.equal(k.children.size, 0, 'children of fsChild all deduped out')
    },
  })

  // root -> (a@1, b)
  // +-- a@1.0.0
  // +-- b -> (c@link:c, a@1.1)
  //     +-- a@1.1.0
  // root/node_modules/b/c -> (a@1.1.1)
  // +-- a@1.1.1
  //
  // place a@1.1.1 for b, dedupe all other a's
  runTest('replace higher up, and dedupe descendants', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', b: '' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0' } },
        {
          pkg: {
            name: 'b',
            version: '1.0.0',
            dependencies: {
              c: 'file:c',
              a: '1.1',
            },
          },
          fsChildren: [
            {
              path: `${path}/node_modules/b/c`,
              pkg: {
                name: 'c',
                version: '1.0.0',
                dependencies: { a: '1.1.1' },
              },
              children: [{ pkg: { name: 'a', version: '1.1.1' } }],
            },
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'a', version: '1.1.1' } }),
    nodeLoc: 'node_modules/b',
    test: (t, tree) => {
      const a = [...tree.inventory.query('name', 'a')].map(a => a.location)
      t.strictSame(a, ['node_modules/a'], 'should be left with one a')
    },
  })

  // a -> (b@1, c@1)
  // +-- c@1
  // +-- b -> PEEROPTIONAL(v) (c@2)
  //     +-- c@2 -> (v)
  // place v for c@2, should end up at a, skipping over b
  runTest('skip over peer dependents in the ancestry walkup', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '' } },
      children: [
        {
          pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1.0.0', c: '1.0.0' } },
        },
        { pkg: { name: 'c', version: '1.0.0' } },
        {
          pkg: {
            name: 'b',
            version: '1.0.0',
            dependencies: { c: '2' },
            peerDependencies: { v: '' },
          },
          children: [{
            pkg: { name: 'c', version: '2.0.0', dependencies: { v: '1' } },
          }],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'v', version: '1.0.0' } }),
    nodeLoc: 'node_modules/b/node_modules/c',
    test: (t, tree) => t.ok(tree.children.get('v')),
  })

  // root -> (a@1, x)
  // x -> (a@2, b@1)
  // a@1 -> (b@1)
  // a@2 -> (b@2)
  // b@1 -> (c@1)
  // b@2 -> (c@2)
  //
  // root
  // +-- c@1
  // +-- b@1
  // +-- x
  //     +-- b@1
  //     +-- a
  //         +-- b@2
  // place c@2 for b@2, should land in a
  runTest('do not shadow inappropriately', {
    tree: new Node({
      path,
      pkg: { dependencies: { x: '', a: '1' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0' } },
        { pkg: { name: 'c', version: '1.0.0' } },
        {
          pkg: { name: 'x', version: '1.0.0', dependencies: { a: '2', b: '1' } },
          children: [
            { pkg: { name: 'b', version: '1.0.0', dependencies: { c: '1' } } },
            {
              pkg: { name: 'a', version: '2.0.0', dependencies: { b: '2' } },
              children: [
                { pkg: { name: 'b', version: '2.0.0', dependencies: { c: '2' } } },
              ],
            },
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'c', version: '2.0.0' } }),
    nodeLoc: 'node_modules/x/node_modules/a/node_modules/b',
    test: (t, tree) => {
      const c = tree.children.get('c')
      const x = tree.children.get('x')
      const xa = x.resolve('a')
      const xab = xa.resolve('b')
      const xabc = xab.resolve('c')
      t.equal(c.version, '1.0.0')
      t.equal(xabc.parent, xa)
      t.equal(xab.parent, xa)
      t.equal(xa.parent, x)
    },
  })

  // pathologically nested dep cycle
  // a1 -> b1 -> a2 -> b2 -> a1
  runTest('pathologically nested dependency cycle', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
        {
          pkg: { name: 'b', version: '1.0.0', dependencies: { a: '2' } },
          children: [
            { pkg: { name: 'a', version: '2.0.0', dependencies: { b: '2' } } },
            {
              pkg: { name: 'b', version: '2.0.0', dependencies: { a: '1' } },
              children: [
                { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
              ],
            },
          ],
        },
      ],
    }),
    dep: new Node({
      pkg: { name: 'b', version: '1.0.0', dependencies: { a: '2' } },
    }),
    nodeLoc: 'node_modules/b/node_modules/b/node_modules/a',
  })

  // peer dep shenanigans
  runTest('basic placement of a production dep with peer deps', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' } },
    }),
    dep: new Node({
      pkg: { name: 'foo', version: '1.0.0', peerDependencies: { bar: '' } },
    }),
    nodeLoc: '',
    peerSet: [
      { pkg: { name: 'bar', version: '1.0.0', peerDependencies: { baz: '' } } },
      { pkg: { name: 'baz', version: '1.0.0' } },
    ],
  })

  runTest('bounce off an existing dep that is newer, preferDedupe', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1', c: '2.0.0' } },
      children: [
        { pkg: { name: 'b', version: '2.3.4' } },
        { pkg: { name: 'c', version: '2.0.0', dependencies: { b: '2.0.0' } } },
        { pkg: { name: 'a', version: '1.2.3', dependencies: { b: '2' } } },
      ],
    }),
    nodeLoc: 'node_modules/c',
    dep: new Node({
      pkg: { name: 'b', version: '2.0.0', peerDependencies: { a: '3' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '3.0.0' } },
    ],
    preferDedupe: true,
  })

  runTest('peer with peers', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.2.3' } },
    ],
  })

  runTest('cycle of peers', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.2.3', peerDependencies: { a: '1' } } },
    ],
  })

  runTest('cycle of peers hanging off entry node', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.2.3', peerDependencies: { d: '1' } } },
      { pkg: { name: 'd', version: '1.2.3', peerDependencies: { b: '1' } } },
    ],
  })

  runTest('peers with peerConflicted edges in peerSet', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.2.3', peerDependencies: { b: '2', a: '2' } } },
    ],
  })

  runTest('peers with peerConflicted edges in peerSet from dependent', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          c: '2.x',
        },
      },
      children: [
        { pkg: { name: 'c', version: '2.0.1', peerDependencies: { b: '2', a: '2' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '2.2.3', peerDependencies: { b: '2', a: '2' } } },
    ],
  })

  runTest('peers with peerConflicted edges in peerSet from dependent', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          c: '2.x',
        },
      },
      children: [
        { pkg: { name: 'c', version: '2.0.1', peerDependencies: { b: '2', a: '2' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '2.2.3', peerDependencies: { b: '2', a: '2' } } },
    ],
  })

  runTest('replacing existing peer set', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          c: '2.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', peerDependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '2.0.1', peerDependencies: { b: '2', a: '2' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '2.2.3', peerDependencies: { b: '2', a: '2' } } },
    ],
    explicitRequest: true,
  })

  runTest('existing peer set which can be pushed deeper, no current', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '2.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.1' } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '2.2.2', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
  })

  runTest('existing peer set which can be pushed deeper, with invalid current', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '2.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.1' } },
        { pkg: { name: 'd', version: '1.1.1', peerDependencies: { b: '1' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '2.2.2', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
  })

  // root -> (a@1, d@1)
  // a@1.0.1 -> (b@1)
  // b@1.0.1 -> PEER(c@1)
  // d@1.1.1 -> PEER(b@1)
  // d@1.2.2 -> PEER(b@2)
  // b@2.2.2 -> PEER(c@2)
  //
  // root
  // +-- a@1.0.1
  // +-- b@1.0.1 <-- can be pushed under a, along with c & d
  // +-- c@1.0.1
  // +-- d@1.0.1
  // PLACE(d@1.2.2<b@2.2.2, c@2.2.2>)
  runTest('existing peer set which can be pushed deeper, with valid current', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '1.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.1' } },
        { pkg: { name: 'd', version: '1.1.1', peerDependencies: { b: '1' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
  })

  runTest('existing peer set which can be pushed deeper, conflict on peer', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '1.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', dependencies: { bb: '1' } } },
        { pkg: { name: 'bb', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.1' } },
        { pkg: { name: 'd', version: '1.1.1', peerDependencies: { c: '1' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
  })

  runTest('existing peer set cannot be pushed deeper, but new dep set can', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '2.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', dependencies: { b: '1' } } },
        { pkg: { name: 'd', version: '2.2.2', peerDependencies: { b: '2' } } },
        { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.2.2' } },
      ],
    }),
    nodeLoc: 'node_modules/a',
    dep: new Node({
      pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'c', version: '1.0.1' } },
    ],
    explicitRequest: true,
  })

  runTest('nest peer set under dependent node', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '2.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', dependencies: { b: '1' } } },
        { pkg: { name: 'd', version: '2.2.2', peerDependencies: { b: '2' } } },
        { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.2.2' } },
      ],
    }),
    nodeLoc: 'node_modules/a',
    dep: new Node({
      pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'c', version: '1.0.1' } },
    ],
    explicitRequest: true,
  })

  // root -> (a@1, d@2)
  // a@1 -> PEER(b@1)
  // b@1 -> PEER(c@1)
  // b@2 -> PEER(c@2)
  // d@2 -> PEER(b@2)
  //
  // root
  // +-- a@1
  // +-- b@2 (peer from d@2)
  // +-- c@2 (peer from b@2)
  // +-- d@2
  // place b@1(c@1) for a@1, expect ERESOLVE, because b conflicts, and
  // neither can be pushed deeper.
  runTest('existing peer set cannot be pushed deeper, neither can new set', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '2.x',
        },
      },
      children: [
        { pkg: { name: 'a', version: '1.0.1', peerDependencies: { b: '1' } } },
        { pkg: { name: 'd', version: '2.2.2', peerDependencies: { b: '2' } } },
        { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.2.2' } },
      ],
    }),
    nodeLoc: 'node_modules/a',
    dep: new Node({
      pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'c', version: '1.0.1' } },
    ],
    explicitRequest: true,
    error: true,
  })

  // root -> (a@1, d@1)
  // a@1 -> (bb@1) PEER(c)
  // bb@1 -> PEER(c@1)
  // d@1.1.1 -> PEER(c@1)
  // d@1.2.2 -> PEER(b@2)
  // b@2 -> PEER(c@2)
  //
  // root
  // +-- a@1 -> (bb@1) PEER(c)
  // +-- bb@1 -> PEER(c@1)
  // +-- c@1
  // +-- d@1.1.1 -> PEER(c@1)
  //
  // place d@1.2.2(b@2 c@2) and receive ERESOLVE, because
  // the c@2 peer dep cannot be placed.
  runTest('existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '1.x',
        },
      },
      children: [
        // the bb dep could be nested, but it has a peerDep on c, and
        // a would be fine with the c@2, but can't nest its c@1 dep
        { pkg: { name: 'a', version: '1.0.1', dependencies: { bb: '1' }, peerDependencies: { c: '*' } } },
        { pkg: { name: 'bb', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.1' } },
        { pkg: { name: 'd', version: '1.1.1', peerDependencies: { c: '1' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
    error: true,
  })

  // root -> (a@1, d@1)
  // a@1.0.1 -> (bb@1), PEER(c)
  // bb@1.0.1 -> (cc@1), PEER(c)
  // cc@1.0.1 -> PEER(dd@1)
  // dd@1.0.1 -> PEER(c@1)
  // d@1.0.1 -> PEER(c)
  // d@1.2.2 -> PEER(b@2)
  // b@2.2.2 -> PEER(c@2)
  //
  // root
  // +-- a@1.0.1
  // +-- bb@1.0.1
  // +-- cc@1.0.1
  // +-- dd@1.0.1
  // +-- c@1.0.1
  // +-- d@1.1.1
  //
  // PLACE d@1.2.2 in root. peerSet(b@2, c@2)
  // REPLACE d@1.0.1
  // OK b@2 (no current, no conflicting edges)
  // c@1.0.1 -> c@2.2.2?
  //   entry edges:
  //    root->(a): no replacement
  //      a->(c): replacement satisfies
  //      a->(bb): not a peer edge
  //    >> can replace
  //    a->(bb):
  //      bb->(c): replacement satisfies
  //      bb->(cc): not a peer edge
  //    root->(d): is cpd peerEntryEdge, skip
  //    bb->(cc): no replacement
  //      dd->(cc): not a peer edge
  //    >> can replace

  runTest('existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '1.x',
        },
      },
      children: [
        // the bb dep could be nested, but it has a peerDep on c, and
        // a would be fine with the c@2, but can't nest its c@1 dep
        { pkg: { name: 'a', version: '1.0.1', dependencies: { bb: '1' }, peerDependencies: { c: '*' } } },
        { pkg: { name: 'bb', version: '1.0.1', dependencies: { cc: '1' }, peerDependencies: { c: '*' } } },
        { pkg: { name: 'cc', version: '1.0.1', peerDependencies: { dd: '1' } } },
        { pkg: { name: 'dd', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.1' } },
        { pkg: { name: 'd', version: '1.1.1', peerDependencies: { c: '1' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
    error: true,
  })

  runTest('existing peer set cannot be pushed deeper, neither can new set, replacement satisfies', {
    tree: new Node({
      path,
      pkg: {
        name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '1.x',
          d: '1.x',
        },
      },
      children: [
        // the bb dep could be nested, but it has a peerDep on c, and
        // a would be fine with the c@2, but can't nest its c@1 dep
        { pkg: { name: 'a', version: '1.0.1', dependencies: { bb: '1' }, peerDependencies: { c: '*' } } },
        { pkg: { name: 'bb', version: '1.0.1', dependencies: { cc: '1' }, peerDependencies: { c: '*' } } },
        { pkg: { name: 'cc', version: '1.0.1', dependencies: { dd: '1' }, peerDependencies: { c: '*' } } },
        { pkg: { name: 'dd', version: '1.0.1', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.1' } },
        { pkg: { name: 'd', version: '1.1.1', peerDependencies: { c: '1' } } },
      ],
    }),
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.2.2' } },
    ],
    explicitRequest: true,
  })

  // root -> (a)
  // a -> (b, c) PEER(p)
  // b -> (c@1, d@2) PEER(p)
  // c@1 -> (d@1) PEER(p)
  // c@2 -> (d@2) PEER(p)
  // d@1 -> PEER(p@1)
  // d@2 -> PEER(p@2)
  // root
  // +-- a
  // +-- b
  // |   +-- c@1
  // |       +-- d@1 <-- cannot place p@1 peer dep!
  // +-- p@2
  // +-- c@2
  // +-- d@2
  runTest('peer all the way down, conflict but not ours', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '' } },
      children: [
        {
          pkg: {
            name: 'a',
            version: '1.0.0',
            dependencies: { b: '', c: '' },
            peerDependencies: { p: '' },
          },
        },
        {
          pkg: {
            name: 'b',
            version: '1.0.0',
            dependencies: { c: '1', d: '2' },
            peerDependencies: { p: '' },
          },
          children: [
            {
              pkg: {
                name: 'c',
                version: '1.0.0',
                dependencies: { d: '1' }, // <-- the dep we'll try to place
                peerDependencies: { p: '' },
              },
            },
          ],
        },
        { pkg: { name: 'p', version: '2.0.0' } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { p: '' } } },
        { pkg: { name: 'd', version: '2.0.0', peerDependencies: { p: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'd', version: '1.0.0', peerDependencies: { p: '1' } },
    }),
    peerSet: [{ pkg: { name: 'p', version: '1.0.0' } }],
    nodeLoc: 'node_modules/b/node_modules/c',
  })

  // root -> (a@1, b@2)
  // a@1 -> PEER(b@1)
  // b@1 -> PEER(c@1)
  // c@1 -> PEER(d@1)
  // d@1 -> PEER(e@1)
  // e@1 -> PEER(a@1)
  // a@2 -> PEER(b@2)
  // b@2 -> PEER(c@2)
  // c@2 -> PEER(d@2)
  // d@2 -> PEER(e@2)
  // e@2 -> PEER(a@2)
  // root
  // +-- a@1
  // +-- b@1
  // +-- c@1
  // +-- d@1
  // +-- e@1
  // place b@2, peerSet (c@2, d@2, e@2, a@2)
  runTest('prod dep directly on conflicted peer, newer', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', b: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.0', peerDependencies: { d: '1' } } },
        { pkg: { name: 'd', version: '1.0.0', peerDependencies: { e: '1' } } },
        { pkg: { name: 'e', version: '1.0.0', peerDependencies: { a: '1' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } } },
      { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
      { pkg: { name: 'd', version: '2.0.0', peerDependencies: { e: '2' } } },
      { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
    ],
    nodeLoc: '',
    error: true,
  })

  runTest('prod dep directly on conflicted peer, force, end of first step', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', b: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
        { pkg: { name: 'd', version: '2.0.0', peerDependencies: { e: '2' } } },
        { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } } },
      { pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
      { pkg: { name: 'd', version: '2.0.0', peerDependencies: { e: '2' } } },
      { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
    ],
    nodeLoc: 'node_modules/e',
    force: true,
  })

  // same as above test, but this time, the root has a@2, and
  // we are attempting to add b@1
  runTest('prod dep directly on conflicted peer, older', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '2', b: '1' } },
      children: [
        { pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } } },
        { pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
        { pkg: { name: 'd', version: '2.0.0', peerDependencies: { e: '2' } } },
        { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'b', version: '1.0.0', peerDependencies: { c: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
      { pkg: { name: 'c', version: '1.0.0', peerDependencies: { d: '1' } } },
      { pkg: { name: 'd', version: '1.0.0', peerDependencies: { e: '1' } } },
      { pkg: { name: 'e', version: '1.0.0', peerDependencies: { a: '1' } } },
    ],
    nodeLoc: '',
    error: true,
  })

  runTest('prod dep directly on conflicted peer, older, force', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '2', b: '1' } },
      children: [
        { pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } } },
        { pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
        { pkg: { name: 'd', version: '2.0.0', peerDependencies: { e: '2' } } },
        { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'b', version: '1.0.0', peerDependencies: { c: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
      { pkg: { name: 'c', version: '1.0.0', peerDependencies: { d: '1' } } },
      { pkg: { name: 'd', version: '1.0.0', peerDependencies: { e: '1' } } },
      { pkg: { name: 'e', version: '1.0.0', peerDependencies: { a: '1' } } },
    ],
    nodeLoc: '',
    force: true,
  })

  // root -> (c@1||2, a@2)
  // a@1 -> PEER(b@1)
  // a@2 -> PEER(b@2)
  // b@1 -> PEER(c@1)
  // b@2 -> PEER(c@2)
  // c@1 -> PEER(d@1)
  // c@2 -> PEER(d@2)
  //
  // root
  // +-- a@1
  // +-- b@1
  // +-- c@1
  // +-- d@1
  //
  // place a@2 peerSet(b@2, c@2, d@2)
  //
  // peer group (c@1, d@1) can be replaced, because the entry node c has a
  // valid replacement.

  runTest('have replacement for conflicted entry node', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '2', c: '1||2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', peerDependencies: { c: '1' } } },
        { pkg: { name: 'c', version: '1.0.0', peerDependencies: { d: '1' } } },
        { pkg: { name: 'd', version: '1.0.0' } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
      { pkg: { name: 'd', version: '2.0.0' } },
    ],
    nodeLoc: '',
  })

  // v@4 -> PEER(a@1||2)
  // y@1 -> PEER(d@1)
  // a@1 -> PEER(b@1)
  // b@1 -> PEER(c@1)
  // c@1 -> PEER(d@1)
  // d@1 -> PEER(e@1)
  // e@1 -> PEER(a@1)
  // a@2 -> PEER(b@2)
  // b@2 -> PEER(c@2)
  // c@2 -> PEER(d@2)
  // d@2 -> PEER(e@2)
  // e@2 -> PEER(a@2)
  //
  // root
  // +-- v@4
  // +-- a@2
  // +-- b@2
  // +-- c@2
  // +-- d@2
  // +-- e@2
  //
  // place y@1 (a@1, b@1, c@1, d@1, e@1), OK, because all peers replaced
  runTest('replacing overlapping peer sets', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '4', y: '1' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '4.0.0',
            peerDependencies: { a: '1||2', x: '2' },
            peerDependenciesMeta: { x: { optional: true } },
          },
        },
        { pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } } },
        { pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
        { pkg: { name: 'd', version: '2.0.0', peerDependencies: { e: '2' } } },
        { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'y', version: '1.0.0', peerDependencies: { d: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
      { pkg: { name: 'b', version: '1.0.0', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.0.0', peerDependencies: { d: '1' } } },
      { pkg: { name: 'd', version: '1.0.0', peerDependencies: { e: '1' } } },
      { pkg: { name: 'e', version: '1.0.0', peerDependencies: { a: '1' } } },
    ],
    nodeLoc: '',
  })

  // same as above, but the new peer set only overlaps _part_ of the existing
  // v@4 -> PEER(a@1||2)
  // y@1 -> PEER(d@1)
  // a@1 -> PEER(c@1)
  // c@1 -> PEER(e@1)
  // e@1 -> PEER(a@1)
  // a@2 -> PEER(b@2)
  // b@2 -> PEER(c@2)
  // c@2 -> PEER(d@2)
  // d@2 -> PEER(e@2)
  // e@2 -> PEER(a@2)
  //
  // root
  // +-- v@4
  // +-- a@2
  // +-- b@2
  // +-- c@2
  // +-- d@2
  // +-- e@2
  //
  // place y@1 (a@1, c@1, e@1), OK, because all peers replaced
  runTest('replacing partially overlapping peer sets, subset', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '4', y: '1' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '4.0.0',
            peerDependencies: { a: '1||2', x: '2' },
            peerDependenciesMeta: { x: { optional: true } },
          },
        },
        { pkg: { name: 'a', version: '2.0.0', peerDependencies: { b: '2' } } },
        { pkg: { name: 'b', version: '2.0.0', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { d: '2' } } },
        { pkg: { name: 'd', version: '2.0.0', peerDependencies: { e: '2' } } },
        { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'y', version: '1.0.0', peerDependencies: { d: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '1.0.0', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.0.0', peerDependencies: { e: '1' } } },
      { pkg: { name: 'e', version: '1.0.0', peerDependencies: { a: '1' } } },
    ],
    nodeLoc: '',
  })

  // same as above, but now the existing one has 3, replacment has 5
  // v@4 -> PEER(a@1||2)
  // y@1 -> PEER(d@1)
  // a@1 -> PEER(b@1)
  // b@1 -> PEER(c@1)
  // c@1 -> PEER(d@1)
  // d@1 -> PEER(e@1)
  // e@1 -> PEER(a@1)
  // a@2 -> PEER(c@2)
  // c@2 -> PEER(e@2)
  // e@2 -> PEER(a@2)
  //
  // root
  // +-- v@4
  // +-- a@2
  // +-- c@2
  // +-- e@2
  //
  // place y@1 (a@1, b@1, c@1, d@1, e@1), OK, because all peers replaced
  runTest('replacing partially overlapping peer sets, superset', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '4', y: '1' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '4.0.0',
            peerDependencies: { a: '1||2', x: '2' },
            peerDependenciesMeta: { x: { optional: true } },
          },
        },
        { pkg: { name: 'a', version: '2.0.0', peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { e: '2' } } },
        { pkg: { name: 'e', version: '2.0.0', peerDependencies: { a: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'y', version: '1.0.0', peerDependencies: { d: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
      { pkg: { name: 'b', version: '1.0.0', peerDependencies: { c: '1' } } },
      { pkg: { name: 'c', version: '1.0.0', peerDependencies: { d: '1' } } },
      { pkg: { name: 'd', version: '1.0.0', peerDependencies: { e: '1' } } },
      { pkg: { name: 'e', version: '1.0.0', peerDependencies: { a: '1' } } },
    ],
    nodeLoc: '',
  })

  // partly overlapping peer sets that diverge
  // v -> PEER(a@1||2, x@1)
  // a@1 -> PEER(c@1, d@1)
  // a@2 -> PEER(c@2, e@1)
  // x@1 -> PEER(y@1)
  // y@1 -> PEER(a@1||2)
  // w -> PEER(a@1, j@1)
  // j@1 -> PEER(y@1)
  // root
  // +-- v
  // +-- a@2
  // +-- c@2
  // +-- e@1
  // +-- x@1
  // +-- y@1
  // place w(a@1, j@1, y@1, c@1, d@1), OK
  runTest('replacing partially overlapping divergent peer sets', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '', w: '' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '1.0.0',
            peerDependencies: { a: '1||2', x: '1' },
          },
        },
        { pkg: { name: 'a', version: '2.0.0', peerDependencies: { c: '2', e: '1' } } },
        { pkg: { name: 'c', version: '2.0.0' } },
        { pkg: { name: 'e', version: '1.0.0' } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0', peerDependencies: { a: '1||2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'w', version: '1.0.0', peerDependencies: { a: '1', j: '1' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '1.0.0', peerDependencies: { c: '1', d: '1' } } },
      { pkg: { name: 'j', version: '1.0.0', peerDependencies: { y: '1' } } },
      { pkg: { name: 'y', version: '1.0.0', peerDependencies: { a: '1||2' } } },
      { pkg: { name: 'c', version: '1.0.0' } },
      { pkg: { name: 'd', version: '1.0.0' } },
    ],
    nodeLoc: '',
  })

  // root -> (a@1, b@2)
  // a@1 -> PEER(x@1)
  // x@1 -> PEER(y@1)
  // b@2 -> PEER(k@2)
  // k@2 -> PEER(y@2)
  // root
  // +-- a@1
  // +-- x@1
  // +-- y@1
  // place b@2(k@2, y@2) and get a conflict on the y peerdep
  runTest('fail with ERESOLVE on deep peer dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', b: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { x: '1' } } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'b', version: '2.0.0', peerDependencies: { k: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'k', version: '2.0.0', peerDependencies: { y: '2' } } },
      { pkg: { name: 'y', version: '2.0.0' } },
    ],
    nodeLoc: '',
    error: true,
  })

  // same as above, but not ours, so we override it
  // root -> (v)
  // v -> (a@1, b@2)
  // a@1 -> PEER(x@1)
  // x@1 -> PEER(y@1)
  // b@2 -> PEER(k@2)
  // k@2 -> PEER(y@2)
  // root
  // +-- v
  // +-- a@1
  // +-- x@1
  // +-- y@1
  // place b@2(k@2, y@2) and override a conflict on the y peerdep
  runTest('warn ERESOLVE on deep peer dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '1.0.0',
            dependencies: { a: '1', b: '2' },
            // this keeps either the a or b set from nesting the conflicted y
            peerDependencies: { y: '' },
          },
        },
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { x: '1' } } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'b', version: '2.0.0', peerDependencies: { k: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'k', version: '2.0.0', peerDependencies: { y: '2' } } },
      { pkg: { name: 'y', version: '2.0.0' } },
    ],
    nodeLoc: 'node_modules/v',
  })
  runTest('warn ERESOLVE on deep peer dep, step 2', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '1.0.0',
            dependencies: { a: '1', b: '2' },
            peerDependencies: { y: '' },
          },
        },
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { x: '1' } } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
        { pkg: { name: 'b', version: '2.0.0', peerDependencies: { k: '2' } } },
        { pkg: { name: 'k', version: '2.0.0', peerDependencies: { y: '2' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '2.0.0' } }),
    nodeLoc: 'node_modules/k',
  })
  runTest('warn ERESOLVE on deep peer dep, step 2, but with override', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '1.0.0',
            dependencies: { a: '1', b: '2' },
            peerDependencies: { y: '' },
          },
        },
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { x: '1' } } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
        { pkg: { name: 'b', version: '2.0.0', peerDependencies: { k: '2' } } },
        { pkg: { name: 'k', version: '2.0.0', peerDependencies: { y: '2' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '1.0.0' } }),
    nodeLoc: 'node_modules/k',
  })
  runTest('warn ERESOLVE on deep peer dep, step 2, override, no current', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '1.0.0',
            dependencies: { a: '1', b: '2' },
            peerDependencies: { y: '' },
          },
        },
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { x: '1' } } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1' } } },
        // prod dep on k to exercise some isMine checking code paths
        { pkg: { name: 'b', version: '2.0.0', dependencies: { k: '2' }, peerDependencies: { c: '2' } } },
        { pkg: { name: 'c', version: '2.0.0', peerDependencies: { k: '2' } } },
        { pkg: { name: 'k', version: '2.0.0', peerDependencies: { y: '2' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '1.0.0' } }),
    nodeLoc: 'node_modules/k',
  })
  runTest('warn ERESOLVE on less deep peer dep, step 2, override, no current', {
    tree: new Node({
      path,
      pkg: { dependencies: { v: '' } },
      children: [
        {
          pkg: {
            name: 'v',
            version: '1.0.0',
            dependencies: { a: '1', b: '2' },
            peerDependencies: { y: '' },
          },
        },
        { pkg: { name: 'a', version: '1.0.0', peerDependencies: { x: '1' } } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1' } } },
        // prod dep, and no peer dep, on k to exercise some isMine checks
        { pkg: { name: 'b', version: '2.0.0', dependencies: { k: '2' }, peerDependencies: { y: '' } } },
        { pkg: { name: 'k', version: '2.0.0', peerDependencies: { y: '2' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '1.0.0' } }),
    nodeLoc: 'node_modules/k',
  })

  runTest('clobber and nest a peer set in favor of a root dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', x: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'x', version: '2.0.0', peerDependencies: { y: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'y', version: '2.0.0' } },
    ],
    explicitRequest: true,
    nodeLoc: '',
  })
  runTest('clobber and nest a peer set in favor of a root dep, step 2', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', x: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
        { pkg: { name: 'x', version: '2.0.0', peerDependencies: { y: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'y', version: '2.0.0' },
    }),
    nodeLoc: 'node_modules/x',
  })

  runTest('clobber and nest a non-peer dep in favor of a root dep peer', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', x: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', dependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'x', version: '2.0.0', peerDependencies: { y: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'y', version: '2.0.0' } },
    ],
    explicitRequest: true,
    nodeLoc: '',
  })
  runTest('clobber and nest a non-peer dep in favor of a root dep peer, step 2', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', x: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', dependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
        { pkg: { name: 'x', version: '2.0.0', peerDependencies: { y: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'y', version: '2.0.0' },
    }),
    nodeLoc: 'node_modules/x',
  })

  runTest('nest peer set of non-root dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', k: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
        { pkg: { name: 'k', version: '2.0.0', dependencies: { x: '2' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'x', version: '2.0.0', peerDependencies: { y: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'y', version: '2.0.0' } },
    ],
    nodeLoc: 'node_modules/k',
    test: (t, tree) => {
      const k = tree.children.get('k')
      const x = k.resolve('x')
      const y = x.resolve('y')
      t.equal(y.location, 'node_modules/k/node_modules/y')
      t.equal(x.location, 'node_modules/k/node_modules/x')
    },
  })
  runTest('nest peer set of non-root dep, step 2', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', k: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
        {
          pkg: { name: 'k', version: '2.0.0', dependencies: { x: '2' } },
          children: [
            { pkg: { name: 'x', version: '2.0.0', peerDependencies: { y: '2' } } },
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '2.0.0' } }),
    nodeLoc: 'node_modules/k/node_modules/x',
    test: (t, tree) => {
      const k = tree.children.get('k')
      const x = k.resolve('x')
      const y = x.resolve('y')
      t.equal(y.location, 'node_modules/k/node_modules/y')
      t.equal(x.location, 'node_modules/k/node_modules/x')
    },
  })
  runTest('replace peer set of non-root dep already in root, step 2', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', k: '2' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1', y: '1' } } },
        { pkg: { name: 'b', version: '1.0.0', peerDependencies: { y: '1' } } },
        { pkg: { name: 'y', version: '1.0.0' } },
        { pkg: { name: 'k', version: '2.0.0', dependencies: { l: '2' } } },
        { pkg: { name: 'l', version: '2.0.0', dependencies: { x: '2', y: '2' } } },
        { pkg: { name: 'x', version: '2.0.0', peerDependencies: { y: '2' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '2.0.0' } }),
    nodeLoc: 'node_modules/x',
    test: (t, tree) => {
      const k = tree.children.get('k')
      const x = k.resolve('x')
      const y = x.resolve('y')
      t.equal(y.location, 'node_modules/y')
      t.equal(x.location, 'node_modules/x')
      t.equal(y.version, '2.0.0')
    },
  })

  runTest('place a link dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { x: 'file:x' } },
      fsChildren: [
        { path: `${path}/x`, pkg: { name: 'x', version: '1.2.3' } },
      ],
    }),
    dep: new Link({
      realpath: `${path}/x`,
      pkg: { name: 'x', version: '1.2.3' },
    }),
    nodeLoc: '',
  })

  const overrides = new OverrideSet({
    overrides: { bar: '2' },
  })
  runTest('place a dep with an override', {
    tree: new Node({
      path,
      pkg: {
        dependencies: { foo: '1' },
        overrides: { bar: '2' },
      },
      overrides,
    }),
    dep: new Node({
      pkg: { name: 'foo', version: '1.0.0' },
      overrides,
    }),
    nodeLoc: '',
  })

  // https://github.com/npm/arborist/issues/325
  runTest('prune competing peerSet that can be nested, 1', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '' } },
      children: [
        {
          pkg: {
            name: 'a',
            version: '1.0.0',
            dependencies: {
              j: '1',
              x: '',
              y: '',
            },
          },
        },
        { pkg: { name: 'j', version: '1.0.0' } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { j: '1' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'y', version: '1.0.0', peerDependencies: { j: '2' } },
    }),
    peerSet: [
      { pkg: { name: 'j', version: '2.0.0' } },
    ],
    nodeLoc: 'node_modules/a',
  })

  runTest('prune competing peerSet that can be nested, 2', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '' } },
      children: [
        {
          pkg: {
            name: 'a',
            version: '1.0.0',
            dependencies: {
              j: '1',
              x: '',
              y: '',
            },
          },
        },
        { pkg: { name: 'j', version: '1.0.0' } },
        { pkg: { name: 'x', version: '1.0.0', peerDependencies: { j: '1' } } },
        { pkg: { name: 'y', version: '1.0.0', peerDependencies: { j: '2' } } },
      ],
    }),
    dep: new Node({ pkg: { name: 'j', version: '2.0.0' } }),
    nodeLoc: 'node_modules/y',
    test: (t, tree, pd) => {
      t.equal(tree.children.get('x'), undefined)
      t.equal(tree.children.get('j').version, '2.0.0')
      t.equal([...pd.needEvaluation][0], tree.children.get('a'))
    },
  })

  t.end()
})
