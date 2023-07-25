const t = require('tap')

const Edge = require('../../lib/edge.js')
const Node = require('../../lib/node.js')
const Link = require('../../lib/link.js')

const Arborist = require('../../lib/arborist/index.js')
const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')

const a = new Arborist({ path: '/some/kind/of/path' })
const b = new Arborist()
t.equal(normalizePath(a.path), '/some/kind/of/path')
t.equal(b.path, process.cwd())
t.match(a, {
  buildIdealTree: Function,
  reify: Function,
  loadActual: Function,
  loadVirtual: Function,
})
// make sure we don't mess up the class name with the mixin stack trick
t.equal(Arborist.name, 'Arborist')
const packumentCache = new Map()
const c = new Arborist({ packumentCache })
t.equal(c.options.packumentCache, packumentCache, 'passed in a packument cache')
t.throws(() => {
  new Arborist({ saveType: 'something' })
}, /saveType/, 'rejects invalid saveType')

t.test('workspace nodes and deps', async t => {
  const { resolve } = require('path')
  const fixture = resolve(__dirname, '../fixtures/workspaces-shared-deps-virtual')
  const arb = new Arborist({ path: fixture })
  const tree = await arb.loadVirtual()
  const wsNodes = arb.workspaceNodes(tree, ['b'])
  t.equal(wsNodes.length, 1, 'got one node')
  t.equal(wsNodes[0], tree.children.get('b').target, 'got the right node')

  {
    const wsDepSet = arb.workspaceDependencySet(tree, ['b'])
    t.equal(wsDepSet.size, 2)
    t.equal(wsDepSet.has(tree.children.get('b').target), true)
    t.equal(wsDepSet.has(tree.children.get('abbrev')), true)
  }

  {
    const wsDepSet = arb.workspaceDependencySet(tree, ['b'], true)
    t.equal(wsDepSet.size, 4)
    t.equal(wsDepSet.has(tree.children.get('b').target), true)
    t.equal(wsDepSet.has(tree.children.get('abbrev')), true)
    t.equal(wsDepSet.has(tree.children.get('once')), true)
    t.equal(wsDepSet.has(tree.children.get('wrappy')), true)
  }

  {
    const wsDepSet = arb.excludeWorkspacesDependencySet(tree)
    t.equal(wsDepSet.size, 2)
    t.equal(wsDepSet.has(tree.children.get('b').target), false)
    t.equal(wsDepSet.has(tree.children.get('abbrev')), false)
    t.equal(wsDepSet.has(tree.children.get('once')), true)
    t.equal(wsDepSet.has(tree.children.get('wrappy')), true)
  }

  const wsNode = wsNodes[0]
  new Edge({
    from: wsNode,
    type: 'prod',
    name: 'xyz',
    spec: '1.2.3',
  })

  // move abbrev under the 'a' workspace, and make a link to it
  tree.children.get('abbrev').parent = tree.children.get('a').target
  new Link({
    parent: tree,
    target: tree.children.get('a').target.children.get('abbrev'),
  })

  {
    // verify that xyz is not in the set, but abbrev AND its link both are
    const wsDepSet = arb.workspaceDependencySet(tree, ['b'])
    t.equal(wsDepSet.size, 3)
    t.equal(wsDepSet.has(tree.children.get('b').target), true)
    t.equal(wsDepSet.has(tree.children.get('abbrev')), true)
    t.equal(wsDepSet.has(tree.children.get('abbrev').target), true)
  }

  new Node({
    name: 'extra',
    pkg: {
      name: 'extra',
      version: '1.2.3',
    },
    parent: tree.children.get('b').target,
  })
  new Edge({
    from: tree.children.get('b').target,
    spec: '1.2.3',
    name: 'foobarbaz',
    type: 'prod',
  })
  new Node({
    name: 'foobarbaz',
    pkg: {
      name: 'foobarbaz',
      version: '1.2.3',
    },
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: false,
    peer: false,
    parent: tree.children.get('b').target,
  })
  {
    // verify that the extraneous dep is in the set
    const wsDepSet = arb.workspaceDependencySet(tree, ['b'])
    t.equal(wsDepSet.size, 5)
    const b = tree.children.get('b').target
    t.equal(wsDepSet.has(b), true)
    t.equal(wsDepSet.has(b.children.get('extra')), true)
    t.equal(wsDepSet.has(b.children.get('foobarbaz')), true)
    t.equal(wsDepSet.has(tree.children.get('abbrev')), true)
    t.equal(wsDepSet.has(tree.children.get('abbrev').target), true)
  }
})

t.test('excludeSet includes nonworkspace metadeps', async t => {
  const tree = new Node({
    path: '/hi',
    pkg: {
      workspaces: ['pkgs/*'],
      dependencies: {
        foo: '',
        fritzy: '',
      },
    },
    children: [
      {
        pkg: {
          name: 'foo',
          version: '0.1.1',
          dependencies: {
            bar: '',
            asdf: '',
          },
        },
      },
      {
        pkg: {
          name: 'bar',
          version: '0.2.0',
        },
      },
      {
        pkg: {
          name: 'baz',
          version: '9.2.0',
        },
      },
      {
        pkg: {
          name: 'fritzy',
          version: '2.2.9',
          optionalDependencies: {
            isaacs: '',
          },
        },
      },
    ],
  })
  const pkgA = new Node({
    path: tree.path + '/pkgs/a',
    pkg: {
      name: 'a',
      version: '1.0.0',
      dependencies: {
        baz: '',
      },
    },
    root: tree,
  })
  new Link({
    name: 'a',
    parent: tree,
    target: pkgA,
  })
  new Edge({
    type: 'workspace',
    from: tree,
    name: 'a',
    spec: 'file:pkgs/a',
  })
  const pkgB = new Node({
    path: tree.path + '/pkgs/b',
    pkg: {
      name: 'b',
      version: '1.0.0',
      dependencies: {
        fritzy: '',
      },
    },
    root: tree,
  })
  new Link({
    name: 'b',
    parent: tree,
    target: pkgB,
  })
  new Edge({
    type: 'workspace',
    from: tree,
    name: 'b',
    spec: 'file:pkgs/b',
  })

  const arb = new Arborist({})
  const filter = arb.excludeWorkspacesDependencySet(tree)

  t.equal(filter.size, 3)
  t.equal(filter.has(tree.children.get('foo')), true)
  t.equal(filter.has(tree.children.get('bar')), true)
  t.equal(filter.has(tree.children.get('baz')), false)
  t.equal(filter.has(tree.children.get('fritzy')), true)
})

t.test('lockfileVersion config validation', async t => {
  t.equal(new Arborist({ lockfileVersion: 1 }).options.lockfileVersion, 1)
  t.equal(new Arborist({ lockfileVersion: 2 }).options.lockfileVersion, 2)
  t.equal(new Arborist({ lockfileVersion: 3 }).options.lockfileVersion, 3)
  t.equal(new Arborist().options.lockfileVersion, null)
  t.equal(new Arborist({ lockfileVersion: null }).options.lockfileVersion, null)
  t.throws(() => new Arborist({ lockfileVersion: 1.2 }), {
    message: 'Invalid lockfileVersion config: 1.2',
  })
  t.throws(() => new Arborist({ lockfileVersion: 'banana' }), {
    message: 'Invalid lockfileVersion config: banana',
  })
})

t.test('valid replaceRegistryHost values', t => {
  t.equal(new Arborist({ replaceRegistryHost: 'registry.garbage.com' }).options.replaceRegistryHost, 'registry.garbage.com')
  t.equal(new Arborist({ replaceRegistryHost: 'npmjs' }).options.replaceRegistryHost, 'registry.npmjs.org')
  t.equal(new Arborist({ replaceRegistryHost: undefined }).options.replaceRegistryHost, 'registry.npmjs.org')
  t.equal(new Arborist({ replaceRegistryHost: 'always' }).options.replaceRegistryHost, 'always')
  t.equal(new Arborist({ replaceRegistryHost: 'never' }).options.replaceRegistryHost, 'never')
  t.end()
})

t.test('valid global/installStrategy values', t => {
  t.equal(new Arborist({ global: true }).options.installStrategy, 'shallow')
  t.equal(new Arborist({ global: false }).options.installStrategy, 'hoisted')
  t.equal(new Arborist({}).options.installStrategy, 'hoisted')
  t.equal(new Arborist({ installStrategy: 'hoisted' }).options.installStrategy, 'hoisted')
  t.end()
})
