// this test depends on debug stuff, so force it on, even if the test env
// does not enable it.
process.env.ARBORIST_DEBUG = '1'
const t = require('tap')
const CanPlaceDep = require('../lib/can-place-dep.js')
const {
  CONFLICT,
  OK,
  REPLACE,
  KEEP,
} = CanPlaceDep

const Node = require('../lib/node.js')

t.test('basic placement check tests', t => {
  const path = '/some/path'

  // boilerplate so we can define a bunch of test cases declaratively
  const runTest = (desc, {
    // the tree we're asking to add something into
    tree,
    // the target we're asking to add it in
    targetLoc,
    // the location of the node with the dependency
    nodeLoc,
    // the dep being added
    dep,
    // the expected overall result for the dep and its peers
    expect,
    // the expected result for the dep itself, ignoring peers
    expectSelf,
    // --prefer-dedupe set?
    preferDedupe,
    // array of nodes representing the dep's peer group
    peerSet,
    // is this dep the thing the user is explicitly installing?
    explicitRequest,
  }) => {
    const target = tree.inventory.get(targetLoc)
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

    const msg = `place ${
      dep.package._id
    } in ${targetLoc || 'ROOT'} for { ${
      edge.from.location || 'ROOT'
    } ${
      edge.type + ' ' + edge.name + '@' + edge.spec
    } }`

    t.test(desc, t => {
      const cpd = new CanPlaceDep({
        target,
        edge,
        dep,
        preferDedupe,
        explicitRequest,
      })
      // dump a comment if the assertion fails.
      // would put it in the diags, but yaml stringifies Set objects
      // super awkwardly, and Node objects have a lot of those.
      if (!t.equal(cpd.canPlace, expect, msg)) {
        t.comment(cpd)
      }
      if (expectSelf) {
        t.equal(cpd.canPlaceSelf, expectSelf, msg)
      }
      t.equal(cpd.description, cpd.canPlace.description || cpd.canPlace)
      t.matchSnapshot([...cpd.conflictChildren].map(c => ({
        dep: [c.dep.name, c.dep.version],
        edge: [c.edge.from.location, c.edge.type, c.edge.name, c.edge.spec],
        canPlace: c.canPlace,
        canPlaceSelf: c.canPlaceSelf,
      })), 'conflict children')
      t.end()
    })
  }

  runTest('basic placement of a dep, no conflicts or issues', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3' },
    }),
    expect: OK,
  })

  runTest('replace an existing dep', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
      children: [{ pkg: { name: 'a', version: '1.0.0' } }],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({ pkg: { name: 'a', version: '1.2.3' } }),
    expect: REPLACE,
  })

  runTest('place nested', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0' } },
        {
          pkg: { name: 'b', version: '1.0.0', dependencies: { a: '2.x' } },
        },
      ],
    }),
    targetLoc: 'node_modules/b',
    nodeLoc: 'node_modules/b',
    dep: new Node({ pkg: { name: 'a', version: '2.3.4' } }),
    expect: OK,
  })

  runTest('conflict in root for nested dep', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
      children: [
        { pkg: { name: 'a', version: '1.0.0' } },
        { pkg: { name: 'b', version: '1.0.0', dependencies: { a: '2' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: 'node_modules/b',
    dep: new Node({ pkg: { name: 'a', version: '2.3.4' } }),
    expect: CONFLICT,
  })

  runTest('conflict in root for nested dep, no current', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
      children: [
        { pkg: { name: 'b', version: '1.0.0', dependencies: { a: '2' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: 'node_modules/b',
    dep: new Node({ pkg: { name: 'a', version: '2.3.4' } }),
    expect: CONFLICT,
  })

  runTest('keep an existing dep that matches', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1' } },
      children: [
        { pkg: { name: 'a', version: '1.2.3' } },
      ],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({ pkg: { name: 'a', version: '1.2.3' } }),
    expect: KEEP,
  })

  runTest('do not keep existing dep that matches, but does not satisfy', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: 'foo/bar' } },
      children: [
        { pkg: { name: 'a', version: '1.2.3' } },
      ],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3' },
      resolved: 'git+ssh://github.com/foo/bar',
    }),
    expect: REPLACE,
  })

  runTest('keep existing dep that matches, does not satisfy, but peerConflicted', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '2.3.4' } },
      children: [
        { pkg: { name: 'a', version: '1.2.3' } },
      ],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({ pkg: { name: 'a', version: '1.2.3' } }),
    expect: KEEP,
  })

  // https://github.com/npm/cli/issues/3411
  runTest('replace an existing dep that matches, explicit request', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1' } },
      children: [
        { pkg: { name: 'a', version: '1.2.3' } },
      ],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({ pkg: { name: 'a', version: '1.2.3' } }),
    expect: REPLACE,
    explicitRequest: true,
  })

  runTest('replace an existing dep that could dedupe, explicit request', {
    tree: new Node({
      path,
      pkg: { name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '*',
          b: '1.2.3',
        } },
      children: [
        { pkg: { name: 'a', version: '1.2.3' } },
        { pkg: { name: 'b', version: '1.2.3', dependencies: { a: '1.2.3' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({ pkg: { name: 'a', version: '2.3.4' } }),
    expect: REPLACE,
    explicitRequest: true,
  })

  runTest('keep an existing dep that could dedupe, explicit request, preferDedupe', {
    tree: new Node({
      path,
      pkg: { name: 'project',
        version: '1.2.3',
        dependencies: {
          a: '*',
          b: '1.2.3',
        } },
      children: [
        { pkg: { name: 'a', version: '1.2.3' } },
        { pkg: { name: 'b', version: '1.2.3', dependencies: { a: '1.2.3' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({ pkg: { name: 'a', version: '2.3.4' } }),
    expect: KEEP,
    preferDedupe: true,
    explicitRequest: true,
  })

  runTest('keep an existing dep that is older, but also works', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1', c: '2.0.0' } },
      children: [
        { pkg: { name: 'b', version: '2.0.0' } },
        { pkg: { name: 'c', version: '2.0.0', dependencies: { b: '2.0.0' } } },
        { pkg: { name: 'a', version: '1.2.3', dependencies: { b: '2' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: 'node_modules/a',
    dep: new Node({ pkg: { name: 'b', version: '2.3.4' } }),
    expect: KEEP,
  })

  runTest('replace an existing dep that is newer, because preferDedupe', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1', c: '2.0.0' } },
      children: [
        { pkg: { name: 'b', version: '2.3.4' } },
        { pkg: { name: 'c', version: '2.0.0', dependencies: { b: '2.0.0' } } },
        { pkg: { name: 'a', version: '1.2.3', dependencies: { b: '2' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: 'node_modules/c',
    dep: new Node({ pkg: { name: 'b', version: '2.0.0' } }),
    expect: REPLACE,
    preferDedupe: true,
  })

  runTest('conflict an existing dep that is newer, preferDedupe peerConflict', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1', c: '2.0.0' } },
      children: [
        { pkg: { name: 'b', version: '2.3.4' } },
        { pkg: { name: 'c', version: '2.0.0', dependencies: { b: '2.0.0' } } },
        { pkg: { name: 'a', version: '1.2.3', dependencies: { b: '2' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: 'node_modules/c',
    dep: new Node({
      pkg: { name: 'b', version: '2.0.0', peerDependencies: { a: '3' } },
    }),
    peerSet: [
      { pkg: { name: 'a', version: '3.0.0' } },
    ],
    expect: CONFLICT,
    preferDedupe: true,
  })

  runTest('conflict an existing dep that is newer, because no preferDedupe', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1', c: '2.0.0' } },
      children: [
        { pkg: { name: 'b', version: '2.3.4' } },
        { pkg: { name: 'c', version: '2.0.0', dependencies: { b: '2.0.0' } } },
        { pkg: { name: 'a', version: '1.2.3', dependencies: { b: '2' } } },
      ],
    }),
    targetLoc: '',
    nodeLoc: 'node_modules/c',
    dep: new Node({ pkg: { name: 'b', version: '2.0.0' } }),
    expect: CONFLICT,
    preferDedupe: false,
  })

  // always OK or REPLACE if the dep being placed had errors
  runTest('return REPLACE because node had errors', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1' } },
      children: [
        { pkg: { name: 'a', version: '1.2.3' } },
      ],
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3' },
      error: new Error('uh oh'),
    }),
    expect: REPLACE,
  })
  runTest('return OK because node had errors', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
      children: [
        {
          pkg: { name: 'b', version: '1.0.0', peerDependencies: { a: '2.x' } },
        },
      ],
    }),
    targetLoc: '',
    nodeLoc: 'node_modules/b',
    dep: new Node({
      pkg: { name: 'a', version: '2.3.4' },
      error: new Error('uh oh'),
    }),
    expect: OK,
  })

  runTest('cannot place peer inside of dependent', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { b: '1.x' } },
      children: [
        {
          pkg: { name: 'b', version: '1.0.0', peerDependencies: { a: '2.x' } },
        },
      ],
    }),
    targetLoc: 'node_modules/b',
    nodeLoc: 'node_modules/b',
    dep: new Node({ pkg: { name: 'a', version: '2.3.4' } }),
    expect: CONFLICT,
  })

  // root -> (x)
  // x -> (a, b@1)
  // a -> (b@2)
  // b@1 -> (c@1)
  // b@2 -> (c@2)
  //
  // root
  // +-- c@1
  // +-- x
  //     +-- a
  //     |   +-- b@2
  //     +-- b@1
  // place c@2 in x, CONFLICT due to shadowing
  runTest('invalid shadowing', {
    tree: new Node({
      path,
      pkg: { dependencies: { x: '1' } },
      children: [
        { pkg: { name: 'c', version: '1.0.0' } },
        {
          pkg: { name: 'x', version: '1.0.0', dependencies: { a: '1', b: '1' } },
          children: [
            {
              pkg: { name: 'a', version: '1.0.0', dependencies: { b: '2' } },
              children: [
                { pkg: { name: 'b', version: '2.0.0', dependencies: { c: '2' } } },
              ],
            },
            { pkg: { name: 'b', version: '1.0.0', dependencies: { c: '1' } } },
          ],
        },
      ],
    }),
    targetLoc: 'node_modules/x',
    nodeLoc: 'node_modules/x/node_modules/a/node_modules/b',
    dep: new Node({ pkg: { name: 'c', version: '2.0.0' } }),
    expect: CONFLICT,
  })

  runTest('totally valid shadowing', {
    tree: new Node({
      path,
      pkg: { dependencies: { x: '1' } },
      children: [
        { pkg: { name: 'c', version: '1.0.0' } },
        {
          pkg: { name: 'x', version: '1.0.0', dependencies: { a: '1', b: '1' } },
          children: [
            {
              pkg: { name: 'a', version: '1.0.0', dependencies: { b: '2' } },
              children: [
                { pkg: { name: 'b', version: '2.0.0', dependencies: { c: '2' } } },
              ],
            },
            // difference right here on the c@1||2 line
            { pkg: { name: 'b', version: '1.0.0', dependencies: { c: '1||2' } } },
          ],
        },
      ],
    }),
    targetLoc: 'node_modules/x',
    nodeLoc: 'node_modules/x/node_modules/a/node_modules/b',
    dep: new Node({ pkg: { name: 'c', version: '2.0.0' } }),
    expect: OK,
  })

  // peer dep shenanigans
  runTest('basic placement with peers', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    expect: OK,
    peerSet: [
      { pkg: { name: 'b', version: '1.2.3' } },
    ],
  })

  runTest('peer with peers', {
    tree: new Node({
      path,
      pkg: { name: 'project', version: '1.2.3', dependencies: { a: '1.x' } },
    }),
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    expect: OK,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    expect: OK,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    expect: OK,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    expect: OK,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    expect: OK,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'a', version: '1.2.3', peerDependencies: { b: '1' } },
    }),
    expect: REPLACE,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '2.2.2', peerDependencies: { b: '2' } },
    }),
    expect: OK,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '2.2.2', peerDependencies: { b: '2' } },
    }),
    expect: REPLACE,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    expect: REPLACE,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    expect: REPLACE,
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
    targetLoc: '',
    nodeLoc: 'node_modules/a',
    dep: new Node({
      pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } },
    }),
    expect: CONFLICT,
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
    targetLoc: 'node_modules/a',
    nodeLoc: 'node_modules/a',
    dep: new Node({
      pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } },
    }),
    expect: OK,
    peerSet: [
      { pkg: { name: 'c', version: '1.0.1' } },
    ],
    explicitRequest: true,
  })

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
    targetLoc: '',
    nodeLoc: 'node_modules/a',
    dep: new Node({
      pkg: { name: 'b', version: '1.0.1', peerDependencies: { c: '1' } },
    }),
    expect: CONFLICT,
    peerSet: [
      { pkg: { name: 'c', version: '1.0.1' } },
    ],
    explicitRequest: true,
  })

  runTest('existing peer set cannot be pushed deeper, neither can new set, conflict on peer', {
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    expect: CONFLICT,
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    expect: CONFLICT,
    peerSet: [
      { pkg: { name: 'b', version: '2.2.2', peerDependencies: { c: '2' } } },
      { pkg: { name: 'c', version: '2.2.2' } },
    ],
    explicitRequest: true,
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
    targetLoc: '',
    nodeLoc: '',
    dep: new Node({
      pkg: { name: 'd', version: '1.2.2', peerDependencies: { b: '2' } },
    }),
    expect: REPLACE,
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
    targetLoc: 'node_modules/b/node_modules/c',
    expect: CONFLICT,
    expectSelf: OK,
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
    targetLoc: '',
    expect: CONFLICT,
    expectSelf: REPLACE,
  })

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
    targetLoc: '',
    expect: CONFLICT,
    expectSelf: REPLACE,
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
    targetLoc: '',
    expect: REPLACE,
    expectSelf: REPLACE,
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
    targetLoc: '',
    expect: OK,
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
    targetLoc: '',
    expect: OK,
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
    targetLoc: '',
    expect: OK,
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
    targetLoc: '',
    expect: OK,
  })

  // root -> (k, y@1)
  // k -> (x)
  // x -> PEER(y@1||2)
  //
  // root
  // +-- y@1
  // +-- k@1
  //
  // place x in root with y@2 in peerset
  // https://github.com/npm/cli/issues/3881
  runTest('can dedupe, cannot place peer', {
    tree: new Node({
      path,
      pkg: { dependencies: { k: '1', y: '1' } },
      children: [
        { pkg: { name: 'y', version: '1.0.0' } },
        { pkg: { name: 'k', version: '1.0.0', dependencies: { x: '' } } },
      ],
    }),
    dep: new Node({
      pkg: { name: 'x', version: '1.0.0', peerDependencies: { y: '1||2' } },
    }),
    peerSet: [
      { pkg: { name: 'y', version: '2.0.0' } },
    ],
    targetLoc: '',
    nodeLoc: 'node_modules/k',
    expect: OK,
  })

  t.end()
})

t.test('constructor debug throws', t => {
  t.throws(() => new CanPlaceDep({}), {
    message: 'no dep provided to CanPlaceDep',
  })

  t.throws(() => new CanPlaceDep({
    dep: new Node({ pkg: { name: 'x', version: '1.2.3' } }),
  }), {
    message: 'no target provided to CanPlaceDep',
  })

  t.throws(() => new CanPlaceDep({
    dep: new Node({ pkg: { name: 'x', version: '1.2.3' } }),
    target: new Node({ path: '/some/path' }),
  }), {
    message: 'no edge provided to CanPlaceDep',
  })

  t.end()
})
