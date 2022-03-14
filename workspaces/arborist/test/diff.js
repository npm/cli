const localeCompare = require('@isaacs/string-locale-compare')('en')
const Diff = require('../lib/diff.js')
const t = require('tap')
const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const Arborist = require('../lib/arborist/index.js')

// don't print the full node objects because we don't need to track that
// for this test and it makes the snapshot unnecessarily noisy.

const normalizePath = path => path.replace(/^\w:/, '').replace(/\\/g, '/')
const normalizedCWD = normalizePath(process.cwd())
const formatNode = node =>
  node && Object.assign(Object.create(node.constructor.prototype), {
    name: node.name,
    path: normalizePath(node.path).split(normalizedCWD).join('{CWD}'),
    integrity: node.integrity,
  })

const { format } = require('tcompare')

const path = diff => normalizePath((diff.actual || diff.ideal).path)
  .split(normalizedCWD).join('{CWD}')

const formatDiff = obj =>
  Object.assign(Object.create(obj.constructor.prototype), {
    action: obj.action,
    actual: formatNode(obj.actual),
    ideal: formatNode(obj.ideal),
    leaves: obj.leaves.map(d => path(d)),
    unchanged: obj.unchanged.map(d => normalizePath(d.path).split(normalizedCWD).join('{CWD}')),
    removed: obj.removed.map(d => normalizePath(d.path).split(normalizedCWD).join('{CWD}')),
    children: [...obj.children]
      .map(formatDiff)
      .sort((a, b) => localeCompare(path(a), path(b))),
  })

t.formatSnapshot = obj => format(formatDiff(obj), { sort: false })

const actual = new Node({
  name: 'a',
  path: '/path/to/root',
  realpath: '/path/to/root',
  integrity: 'sha512-aaa',
  fsChildren: [
    {
      name: 'foo',
      path: '/path/to/root/foo',
      children: [
        { name: 'bar', integrity: 'sha512-bar' },
        { name: 'baz', integrity: 'sha512-baz' },
      ],
    },
  ],
  children: [
    {
      name: 'b',
      integrity: 'sha512-bbb',
      children: [
        { name: 'c', integrity: 'sha512-ccc' },
        { name: 'd',
          integrity: 'sha512-ddd',
          children: [{ name: 'e', integrity: 'sha512-eee' }],
        },
        { name: 'f', integrity: 'sha512-fff' },
      ],
    },
    {
      name: 'x',
      integrity: 'sha512-xxx',
      children: [
        { name: 'y',
          integrity: 'sha512-yyy',
          children: [
            { name: 'z', integrity: null, resolved: 'foobarbaz' },
          ] },
      ],
    },
    {
      name: 'p',
      integrity: 'sha512-ppp',
      children: [{ name: 'q', integrity: 'sha512-qqq' }],
    },
    {
      name: 'bundler',
      integrity: 'sha512-bundler',
      pkg: {
        bundleDependencies: ['bundled-a'],
      },
      children: [
        {
          name: 'bundled-a',
          pkg: {
            dependencies: { metabundled: '' },
          },
        },
        {
          name: 'metabundled',
          pkg: {
            name: 'metabundled',
            version: '1.2.3',
          },
        },
        {
          name: 'not-bundled',
          integrity: 'sha512-not-bundled',
        },
      ],
    },
    {
      name: 'should-have-bins',
      integrity: 'sha512-should-have-bins',
      pkg: {
        bin: {
          'should-exist': 'should-exist.js',
        },
      },
    },
  ],
})

const ideal = new Node({
  name: 'a',
  path: '/path/to/root',
  realpath: '/path/to/root',
  integrity: 'sha512-aaa',
  fsChildren: [
    {
      name: 'foo',
      path: '/path/to/root/foo',
      children: [
        { name: 'bar', integrity: 'sha512-bar' },
        { name: 'baz', integrity: 'sha512-BAZ' },
        { name: 'boo', integrity: 'sha512-BOO' },
      ],
    },
  ],
  children: [
    {
      name: 'b',
      integrity: 'sha512-BBB',
      children: [
        { name: 'c', integrity: 'sha512-CCC' },
        { name: 'd',
          integrity: 'sha512-ddd',
          children: [{ name: 'e', integrity: 'sha512-EEE' }],
        },
        { name: 'f', integrity: 'sha512-fff' },
      ],
    },
    {
      name: 'x',
      integrity: 'sha512-xxx',
      children: [
        { name: 'y',
          integrity: 'sha512-YYY',
          children: [
            { name: 'z', integrity: null, resolved: 'foobarbaz' },
          ] },
      ],
    },
    {
      name: 'i',
      integrity: 'sha512-III',
      children: [{ name: 'j', integrity: 'sha512-JJJ' }],
    },
    {
      name: 'bundler',
      integrity: 'sha512-bundler',
      pkg: {
        bundleDependencies: ['bundled-a'],
      },
      children: [
        {
          name: 'not-bundled',
          integrity: 'sha512-NOT-BUNDLED',
        },
      ],
    },
    {
      name: 'should-have-bins',
      integrity: 'sha512-should-have-bins',
      pkg: {
        bin: {
          'should-exist': 'should-exist.js',
        },
      },
    },
  ],
})

const d = Diff.calculate({ actual, ideal })
t.matchSnapshot(d, 'diff two trees')
t.equal(d.parent, null, 'root has no parent')
t.equal([...d.children][0].parent, d, 'parent of root child is root')
t.equal(d.action, null, 'root has no action')

t.test('when a root is a link, traverse the target children', t => {
  t.plan(2)
  for (const global of [true, false]) {
    t.test(`global=${global}`, async t => {
      const actual = new Link({
        global,
        path: '/some/linked/path',
        realpath: '/some/real/path',
      })

      actual.target = new Node({
        global,
        path: '/some/real/path',
        pkg: {},
        children: [{
          name: 'child',
          pkg: {
            name: 'child',
            version: '1.2.3',
          },
        }],
      })

      const ideal = new Node({
        path: '/some/real/path',
        realpath: '/some/real/path',
        children: [],
      })

      const diff = Diff.calculate({ actual, ideal })
      t.matchSnapshot(diff, 'correctly removes the child node')
      t.equal(diff.removed.length, 1, 'identifies the need to remove the child')
    })
  }
})

t.test('filtered diff', async t => {
  const ideal = new Node({
    path: '/project/path',
    pkg: {
      name: 'root',
      dependencies: { a: 'file:a', c: '' },
    },
  })

  new Link({
    parent: ideal,
    pkg: {},
    realpath: '/project/path/a',
  })
  const a = new Node({
    fsParent: ideal,
    path: '/project/path/a',
    pkg: {
      name: 'a',
      dependencies: {
        b: '',
      },
    },
  })
  new Node({
    parent: ideal,
    pkg: {
      name: 'b',
      version: '1.2.3',
    },
  })
  new Node({
    parent: ideal,
    pkg: {
      name: 'c',
      version: '1.2.3',
    },
  })

  const actual = new Node({
    path: '/project/path',
    pkg: {
      name: 'root',
      dependencies: { a: 'file:a', c: '' },
    },
  })

  const cExcludedABPresent = Diff.calculate({ actual, ideal, filterNodes: [a] })
  t.matchSnapshot(cExcludedABPresent, 'c excluded, a and b present')

  // make sure that *removing* something that *would* be depended on
  // by the actual node in the filter set is also removed properly.
  new Link({
    parent: actual,
    pkg: {},
    realpath: '/project/path/a',
  })
  new Node({
    fsParent: actual,
    path: '/project/path/a',
    pkg: {
      name: 'a',
      dependencies: {
        b: '',
        d: '',
      },
    },
  })
  new Node({
    parent: actual,
    pkg: {
      name: 'b',
      version: '1.2.3',
    },
  })
  new Node({
    parent: actual,
    pkg: {
      name: 'd',
      version: '1.2.3',
    },
  })

  const removeD = Diff.calculate({ actual, ideal, filterNodes: [a] })
  t.matchSnapshot(removeD, 'd is removed')

  // removing a dependency, like we would with `npm rm -g foo`
  actual.package = {
    ...actual.package,
    dependencies: {
      ...actual.package.dependencies,
      e: '*',
    },
  }
  const e = new Node({
    parent: actual,
    pkg: {
      name: 'e',
      version: '1.2.3',
    },
  })
  const eRemoved = Diff.calculate({ actual, ideal, filterNodes: [e] })
  t.matchSnapshot(eRemoved, 'e is removed')

  // can't filter based on something that isn't there
  t.throws(() => Diff.calculate({
    actual,
    ideal,
    filterNodes: [
      new Node({
        path: '/project/path/node_modules/x',
        pkg: { name: 'x' },
      }),
    ],
  }), {
    message: 'invalid filterNode: outside idealTree/actualTree',
  })

  // filtering an extraneous node is ok though
  delete actual.package.dependencies.e
  actual.package = { ...actual.package }
  const eRemovedExtraneous = Diff.calculate({ actual, ideal, filterNodes: [e] })
  t.matchSnapshot(eRemovedExtraneous, 'e is removed (extraneous)')
})

t.test('diff doesnt break unchanged shrinkwrapped deps', async t => {
  const actual = new Node({
    name: 'a',
    path: '/path/to/actual',
    children: [{
      name: 'shrinkwrapped-dep',
      hasShrinkwrap: true,
      integrity: 'sha512-ddd',
      children: [
        { name: 'shrinkwrap-inner-a', integrity: 'sha512-aaa' },
        { name: 'shrinkwrap-inner-b', integrity: 'sha512-bbb' },
      ],
    }, {
      name: 'regular-dep',
      integrity: 'sha512-eee',
      children: [{
        name: 'shrinkwrapped-inner',
        hasShrinkwrap: true,
        integrity: 'sha512-fff',
        children: [{
          name: 'shrinkwrap-inner-c',
          integrity: 'sha512-ccc',
        }],
      }],
    }],
  })

  const ideal = new Node({
    name: 'a',
    path: '/path/to/actual',
    children: [{
      name: 'shrinkwrapped-dep',
      hasShrinkwrap: true,
      integrity: 'sha512-ddd',
    }, {
      name: 'regular-dep',
      integrity: 'sha512-eee',
      children: [{
        name: 'shrinkwrapped-inner',
        hasShrinkwrap: true,
        integrity: 'sha512-fff',
        children: [{
          name: 'shrinkwrap-inner-c',
          integrity: 'sha512-ccc',
        }],
      }],
    }],
  })

  // putting the shrinkwrapped-inner node in the shrinkwrapInflated set
  // allows us to fake the behavior of reifying the node and then
  // running a second diff that includes that node's children. this
  // is reflected by the children of the shrinkwrapped-inner node being
  // marked as unchanged.
  const shrinkwrappedInner = ideal.children.get('regular-dep')
    .children.get('shrinkwrapped-inner')
  const diff = Diff.calculate({
    actual,
    ideal,
    shrinkwrapInflated: new Set([shrinkwrappedInner]),
  })
  t.matchSnapshot(diff, 'made no changes')

  t.equal(diff.leaves.length, 1, 'diff has exactly one leaf')
  t.match(diff.leaves[0], { action: null, ideal: { name: 'shrinkwrapped-dep' } },
    'the shrinkwrapped dep is in the leaves with a null action')
})

t.test('extraneous pruning in workspaces', async t => {
  // just load the virtual tree here twice,
  // and then remove the extraneous ones from the 'ideal'
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: [
        'packages/*',
      ],
    }),
    'package-lock.json': JSON.stringify({
      lockfileVersion: 3,
      packages: {
        'node_modules/a': {
          resolved: 'packages/a',
          link: true,
        },
        'node_modules/b': {
          resolved: 'packages/b',
          link: true,
        },
        'node_modules/wrappy': {
          version: '1.0.2',
          extraneous: true,
        },
        'packages/a': {
          version: '1.2.3',
        },
        'packages/a/node_modules/once': {
          version: '1.4.0',
          extraneous: true,
          dependencies: {
            wrappy: '1',
          },
        },
        'packages/b': {
          version: '1.2.3',
          dependencies: {
            once: '*',
          },
        },
        'packages/b/node_modules/abbrev': {
          version: '1.1.1',
          extraneous: true,
        },
        'packages/b/node_modules/once': {
          version: '1.4.0',
          dependencies: {
            wrappy: '1',
          },
        },
        'packages/b/node_modules/wrappy': {
          version: '1.0.2',
        },
      },
    }),
  })

  const actual = await new Arborist({ path }).loadVirtual()
  const ideal = await new Arborist({ path }).loadVirtual()
  for (const node of ideal.inventory.values()) {
    if (node.extraneous) {
      node.root = null
    }
  }
  const idealA = ideal.children.get('a').target
  const actualA = actual.children.get('a').target
  const pruneWsA = Diff.calculate({
    actual,
    ideal,
    filterNodes: [idealA, actualA],
  })
  t.matchSnapshot(pruneWsA, 'prune in workspace A')

  const idealB = ideal.children.get('b').target
  const actualB = actual.children.get('b').target
  const pruneWsB = Diff.calculate({
    actual,
    ideal,
    filterNodes: [idealB, actualB],
  })
  t.matchSnapshot(pruneWsB, 'prune in workspace B')
})

t.test('check versions (even if all other metadata is missing)', t => {
  const actual = new Node({
    path: '/some/path',
    pkg: {
      dependencies: {
        foo: '',
      },
    },
    children: [
      { name: 'foo', pkg: { name: 'foo', version: '1.0.0' } },
    ],
  })

  const ideal = new Node({
    path: '/some/path',
    pkg: {
      dependencies: {
        foo: '',
      },
    },
    children: [
      { name: 'foo', pkg: { name: 'foo', version: '1.2.3' } },
    ],
  })

  const diff = Diff.calculate({ actual, ideal })
  t.match(diff.children, [
    {
      actual: actual.children.get('foo'),
      ideal: ideal.children.get('foo'),
      action: 'CHANGE',
    },
  ])
  t.equal(diff.children.length, 1)

  t.match(diff.leaves, [
    {
      actual: actual.children.get('foo'),
      ideal: ideal.children.get('foo'),
      action: 'CHANGE',
    },
  ])
  t.equal(diff.leaves.length, 1)
  t.end()
})
