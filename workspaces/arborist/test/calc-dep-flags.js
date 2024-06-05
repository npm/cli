const { resolve } = require('node:path')
const t = require('tap')
const calcDepFlags = require('../lib/calc-dep-flags.js')
const Node = require('../lib/node.js')
const Link = require('../lib/link.js')

const {
  normalizePath,
  printTree,
} = require('./fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

t.test('flag stuff', t => {
  const root = new Node({
    path: '/x',
    realpath: '/x',
    pkg: {
      dependencies: { prod: '' },
      devDependencies: { dev: '' },
      optionalDependencies: { optional: '' },
      peerDependencies: { peer: '' },
    },
  })

  new Node({
    pkg: {
      name: 'optional',
      version: '1.2.3',
      dependencies: { devoptional: '', missing: '' },
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'devoptional',
      version: '1.2.3',
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'extraneous',
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'peer',
      version: '1.2.3',
      dependencies: { peerdep: '' },
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'peerdep',
      version: '1.2.3',
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'prod',
      version: '1.2.3',
      dependencies: { proddep: '' },
      peerDependencies: { metapeer: '' },
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'metapeer',
      version: '1.2.3',
      dependencies: { metapeerdep: '' },
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'metapeerdep',
      version: '1.2.3',
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'proddep',
      version: '1.2.3',
      dependencies: { proddep: '' },
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'dev',
      version: '1.2.3',
      dependencies: { devdep: '' },
    },
    parent: root,
  })

  const devdep = new Node({
    pkg: {
      name: 'devdep',
      version: '1.2.3',
      dependencies: { proddep: '', linky: '', devoptional: '' },
      optionalDependencies: { devandoptional: '' },
    },
    parent: root,
  })

  new Node({
    pkg: {
      name: 'devandoptional',
      version: '1.2.3',
    },
    parent: root,
  })

  const linky = new Link({
    pkg: {
      name: 'linky',
      version: '1.2.3',
      dependencies: { linklink: '' },
    },
    realpath: '/x/y/z',
    parent: devdep,
  })

  // a link dep depended upon by the target of a linked dep
  new Link({
    pkg: {
      name: 'linklink',
      version: '1.2.3',
    },
    realpath: '/l/i/n/k/link',
    parent: linky.target,
  })

  calcDepFlags(root)

  t.matchSnapshot(printTree(root), 'after')
  t.end()
})

t.test('no reset', async t => {
  const root = new Node({
    path: '/some/path',
    realpath: '/some/path',
    pkg: {
      dependencies: { foo: '' },
    },
  })
  const foo = new Node({ parent: root, pkg: { name: 'foo', version: '1.2.3' } })

  root.optional = false
  root.dev = true
  root.extraneous = false

  calcDepFlags(root, false)
  t.matchSnapshot(printTree(root), 'after')
  t.equal(root.dev, true, 'root.dev')
  t.equal(foo.dev, true, 'foo.dev')
  t.equal(root.optional, false, 'root.optional')
  t.equal(foo.optional, false, 'foo.optional')
  t.equal(root.extraneous, false, 'root.extraneous')
  t.equal(foo.extraneous, false, 'foo.extraneous')
})

t.test('set parents to not extraneous when visiting', t => {
  const root = new Node({
    path: '/some/path',
    realpath: '/some/path',
    pkg: {
      dependencies: {
        baz: 'file:node_modules/asdf/node_modules/baz',
        foo: 'file:bar/foo',
      },
    },
  })
  const bar = new Node({
    root,
    path: resolve(root.path, 'bar'),
  })
  const foo = new Node({
    root,
    path: resolve(bar.path, 'foo'),
    pkg: { name: 'foo', version: '1.2.3' },
  })
  const asdf = new Node({
    parent: root,
    pkg: { name: 'asdf', version: '1.2.3' },
  })
  const baz = new Node({
    parent: asdf,
    pkg: { name: 'baz', version: '1.2.3' },
  })
  const fooLink = new Link({
    name: 'foo',
    target: foo,
    parent: root,
    realpath: foo.path,
  })
  const bazLink = new Link({
    name: 'baz',
    target: baz,
    parent: root,
    realpath: baz.path,
  })

  t.matchSnapshot(printTree(root), 'before')
  calcDepFlags(root, true)
  t.matchSnapshot(printTree(root), 'after')

  t.equal(root.extraneous, false, 'root')
  t.equal(asdf.extraneous, false, 'asdf')
  t.equal(bar.extraneous, false, 'bar')
  t.equal(baz.extraneous, false, 'baz')
  t.equal(foo.extraneous, false, 'foo')
  t.equal(fooLink.extraneous, false, 'fooLink')
  t.equal(bazLink.extraneous, false, 'bazLink')

  t.equal(root.dev, false, 'root not dev')
  t.equal(asdf.dev, false, 'asdf not dev')
  t.equal(bar.dev, false, 'bar not dev')
  t.equal(baz.dev, false, 'baz not dev')
  t.equal(foo.dev, false, 'foo not dev')
  t.equal(fooLink.dev, false, 'fooLink not dev')
  t.equal(bazLink.dev, false, 'bazLink not dev')

  t.equal(root.optional, false, 'root not optional')
  t.equal(asdf.optional, false, 'asdf not optional')
  t.equal(bar.optional, false, 'bar not optional')
  t.equal(baz.optional, false, 'baz not optional')
  t.equal(foo.optional, false, 'foo not optional')
  t.equal(fooLink.optional, false, 'foolink not optional')
  t.equal(bazLink.optional, false, 'bazlink not optional')

  t.equal(root.peer, false, 'root not peer')
  t.equal(asdf.peer, false, 'asdf not peer')
  t.equal(bar.peer, false, 'bar not peer')
  t.equal(baz.peer, false, 'baz not peer')
  t.equal(foo.peer, false, 'foo not peer')
  t.equal(fooLink.peer, false, 'foolink not peer')
  t.equal(bazLink.peer, false, 'bazlink not peer')

  t.equal(root.devOptional, false, 'root not devOptional')
  t.equal(asdf.devOptional, false, 'asdf not devOptional')
  t.equal(bar.devOptional, false, 'bar not devOptional')
  t.equal(baz.devOptional, false, 'baz not devOptional')
  t.equal(foo.devOptional, false, 'foo not devOptional')
  t.equal(fooLink.devOptional, false, 'foolink not devOptional')
  t.equal(bazLink.devOptional, false, 'bazlink not devOptional')
  t.end()
})

t.test('check null target in link', async t => {
  const root = new Link({
    path: '/some/path',
    realpath: '/some/path',
    pkg: {
      dependencies: { foo: '' },
    },
  })
  t.doesNotThrow(() => calcDepFlags(root))
  t.doesNotThrow(() => calcDepFlags(root, false))
  t.end()
})
