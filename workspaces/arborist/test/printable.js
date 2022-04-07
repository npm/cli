const t = require('tap')
const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const Edge = require('../lib/edge.js')
const printable = require('../lib/printable.js')
const util = require('util')

t.cleanSnapshot = str => str
  // normalize paths
  .split(process.cwd()).join('{CWD}')
  .replace(/[A-Z]:/g, '')
  .replace(/\\+/g, '/')
  // FIXME: once we drop support to node10 we can remove some of this
  .replace(/:\n? +/g, ':')
  .replace(/\n +/g, '\n')
  .replace(/\n\}/g, ' }')
  .replace(/\n\]/g, ']')
  .replace(/\n\[/g, '[')
  .replace(/\n\{\n/g, ' { ')
  .replace(/Map\([0-9]\)/g, 'Map')
  .replace(/Set\([0-9]\)/g, 'Set')
  .replace(/:\n *Map/g, ':Map')
  .replace(/:\n *Set/g, ':Set')
  .replace(/ArboristNode /g, '')
  .replace(/Edge /g, '')
  .replace(/ *([[\]{}]) */g, '$1')

t.test('printable Node', t => {
  t.test('extraneous tree', t => {
    const tree = new Node({
      name: 'printable-node',
      pkg: {
        name: 'printable-node',
        version: '1.1.1',
        dependencies: { prod: '1.x', b: '', missing: '' },
      },
      path: '/home/user/projects/root',
      realpath: '/home/user/projects/root',
      children: [{
        pkg: {
          name: 'prod',
          version: '1.2.3',
          dependencies: { meta: '', b: '' },
          peerDependencies: { peer: '' },
        },
        fsChildren: [{
          realpath: '/home/user/projects/root/node_modules/prod/foo',
          path: '/home/user/projects/root/node_modules/prod/foo',
          name: 'foo',
          pkg: { name: 'foo', version: '1.2.3', dependencies: { meta: '' } },
        }, {
          realpath: '/home/user/projects/root/node_modules/prod/bar',
          path: '/home/user/projects/root/node_modules/prod/bar',
          name: 'bar',
          pkg: { name: 'bar', version: '1.0.0' },
        }],
        resolved: 'prod',
        integrity: 'prod',
      }, {
        pkg: {
          name: 'b',
          version: '1.2.3',
        },
        resolved: 'b',
        integrity: 'b',
      }, {
        pkg: {
          name: 'c',
        },
        resolved: 'c',
        integrity: 'c',
      }],
    })
    tree.error = { code: 'ERR', path: '/' }
    tree.edgesOut.get('prod').peerConflicted = true
    t.matchSnapshot(util.inspect(tree, { depth: 6 }),
      'should print human readable representation of node tree')
    t.end()
  })

  t.test('variations', t => {
    // manually tweaked variations in the tree to reach for
    // possible different trees output
    const tree = new Node({
      name: 'variations',
      pkg: {
        name: 'variations',
        version: '1.0.0',
        dependencies: { a: '^1.0.0', b: '^1.0.0' },
      },
      extraneous: false,
      path: '/home/user/projects/root',
      realpath: '/home/user/projects/root',
    })

    // append nodes
    const a = new Node({
      name: 'a',
      pkg: {
        name: 'a',
        version: '1.1.1',
      },
      path: '/home/users/projects/root/node_modules/a',
      realpath: '/home/users/projects/root/node_modules/a',
      parent: tree,
    })
    a.extraneous = false
    a.dev = true
    a.optional = true
    a.getBundler = () => true
    a.errors = [Object.assign(new Error('ERR'), { code: 'ERR' })]
    const b = new Link({
      name: 'b',
      pkg: {
        name: 'b',
        version: '1.0.0',
      },
      optional: true,
      path: '/home/users/projects/root/c-link',
      realpath: '/home/users/projects/root/c',
      parent: tree,
    })
    const c = new Node({
      name: 'c',
      pkg: { name: 'c', version: '1.0.0' },
      path: '/home/user/projects/root/c',
      realpath: '/home/user/projects/root/c',
      fsParent: tree,
    })
    b.target = c
    b.extraneous = false
    b.dev = false
    b.optional = false
    b.peer = false
    b.errors = [Object.assign(new Error('ERR'), {
      code: 'ERR',
      path: '/home/users/projects/root/node_modules/b',
    })]

    // another link to c
    new Link({
      name: 'd',
      realpath: '/home/users/projects/root/c',
      target: c,
      parent: tree,
    })

    tree.error = a.errors[0]

    t.matchSnapshot(util.inspect(tree, { depth: 6 }),
      'should match non-extraneous tree representation')
    t.end()
  })

  t.test('do not recurse forever', t => {
    const flags = {
      extraneous: false,
      dev: false,
      devOptional: false,
      optional: false,
      peer: false,
    }
    const tree = new Node({
      name: 'recursive',
      pkg: {
        name: 'recursive',
        version: '1.0.0',
        dependencies: { a: '^1.0.0', b: '^1.0.0' },
      },
      path: '/home/user/projects/root',
      realpath: '/home/user/projects/root',
      ...flags,
    })
    new Node({
      name: 'a',
      pkg: {
        name: 'a',
        version: '1.2.3',
      },
      parent: tree,
      ...flags,
    })
    const target = new Node({
      fsParent: tree,
      path: tree.path + '/b',
      pkg: {
        name: 'b',
        version: '1.2.3',
        dependencies: { c: '' },
      },
      ...flags,
    })
    const c = new Node({
      parent: target,
      pkg: {
        name: 'c',
        version: '1.2.3',
        dependencies: { b: '9.9.9999', notfound: '' },
      },
      ...flags,
    })
    new Link({
      parent: c,
      target,
      ...flags,
    })
    new Link({
      parent: tree,
      target,
      ...flags,
    })
    const s = util.inspect(printable(tree), { depth: Infinity })
    t.matchSnapshot(s)
    t.end()
  })
  t.end()
})

t.test('virtual roots are shown with their sourceReference', t => {
  const node = new Node({
    path: '/foo/bar/baz',
    pkg: {
      name: 'baz',
      version: '1.2.3',
    },
  })
  const virtual = new Node({ sourceReference: node })
  t.matchSnapshot(printable(virtual))
  t.end()
})

t.test('broken links dont break the printing', t => {
  const tree = new Node({
    path: '/home/user/projects/root',
  })

  // a link with no target
  const brokenLink = new Link({
    name: 'devnull',
    realpath: '/home/user/projects/root/no/thing/here',
    parent: tree,
  })
  brokenLink.target.root = null

  t.matchSnapshot(printable(tree))
  t.end()
})

t.test('show workspaces in printable node output', t => {
  const tree = new Node({
    path: '/home/user/projects/root',
    pkg: {
      workspaces: ['packages/*'],
    },
  })
  new Edge({
    from: tree,
    type: 'workspace',
    name: 'a',
    spec: 'file:/home/user/projects/root/packages/a',
  })
  new Edge({
    from: tree,
    type: 'workspace',
    name: 'b',
    spec: 'file:/home/user/projects/root/packages/b',
  })
  new Link({
    pkg: {
      name: 'a',
      version: '1.2.3',
    },
    realpath: '/home/user/projects/root/packages/a',
    parent: tree,
  })
  new Link({
    pkg: {
      name: 'b',
      version: '1.2.3',
    },
    realpath: '/home/user/projects/root/packages/b',
    parent: tree,
  })
  tree.workspaces = new Map([
    ['a', tree.children.get('a').realpath],
    ['b', tree.children.get('b').realpath],
  ])

  t.matchSnapshot(printable(tree))
  t.end()
})

t.test('show bundle/shrinkwrap info', t => {
  const tree = new Node({
    path: '/path/to/root',
    pkg: {
      name: 'root',
      version: '1.2.3',
      dependencies: {
        bundler: '',
        wrapper: '',
        a: '1',
        b: '2',
        c: '3',
      },
    },
    children: [
      {
        pkg: {
          name: 'bundler',
          version: '1.2.3',
          bundleDependencies: ['a'],
          dependencies: {
            a: '1',
          },
        },
        children: [
          {
            pkg: { name: 'a', version: '1.2.3' },
            integrity: 'a123',
          },
        ],
      },
      {
        pkg: {
          name: 'wrapper',
          version: '1.2.3',
          dependencies: {
            a: '1',
          },
          _hasShrinkwrap: true,
        },
        hasShrinkwrap: true,
        children: [
          {
            pkg: { name: 'a', version: '1.2.3' },
            integrity: 'a123',
          },
        ],
      },
      {
        pkg: { name: 'a', version: '1.2.3' },
        integrity: 'a123',
      },
      {
        pkg: { name: 'c', version: '3.4.5', dependencies: { a: '1' } },
        children: [
          {
            pkg: { name: 'a', version: '1.2.3' },
            integrity: 'a123',
          },
        ],
      },
      {
        pkg: {
          name: 'b',
          version: '2.3.4',
          dependencies: {
            a: '1',
            c: '2',
            d: '3',
          },
        },
        children: [
          { pkg: { name: 'a', version: '1.9.99' } },
          { pkg: { name: 'e', version: '2.3.4' }, integrity: 'y' },
          {
            pkg: {
              name: 'c',
              version: '2.3.4',
              dependencies: { a: '2' },
            },
            children: [
              {
                pkg: {
                  name: 'a',
                  version: '2.3.99',
                  dependencies: { e: '2' },
                },
                integrity: 'a2399',
                children: [
                  { pkg: { name: 'e', version: '2.0.1' }, integrity: 'x' },
                ],
              },
            ],
          },
          {
            pkg: {
              name: 'd',
              version: '3.4.5',
              dependencies: {
                a: '3',
              },
            },
            children: [{ pkg: { name: 'a', version: '3.4.5' } }],
          },
        ],
      },
      { pkg: { name: 'extraneous', version: '1.2.3' } },
    ],
  })

  t.matchSnapshot(printable(tree))
  t.end()
})

t.test('show overrides', (t) => {
  const flags = {
    extraneous: false,
    dev: false,
    peer: false,
    optional: false,
    devOptional: false,
  }

  const tree = new Node({
    path: '/some/path',
    loadOverrides: true,
    pkg: {
      name: 'root',
      version: '1.0.0',
      dependencies: {
        foo: '^1.0.0',
      },
      overrides: {
        bar: '2.0.0',
      },
    },
    children: [
      { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '^1.0.0' } }, ...flags },
      { pkg: { name: 'bar', version: '2.0.0' }, ...flags },
    ],
    ...flags,
  })

  t.matchSnapshot(util.inspect(printable(tree), { depth: 5 }))
  t.end()
})
