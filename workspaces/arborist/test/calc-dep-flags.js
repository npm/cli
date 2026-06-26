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
      peerDependencies: { peer: '', peeroptional: '' },
      peerDependenciesMeta: { peeroptional: { optional: true } },
    },
  })

  const optional = new Node({
    pkg: {
      name: 'optional',
      version: '1.2.3',
      dependencies: { devoptional: '', missing: '' },
    },
    parent: root,
  })

  const devoptional = new Node({
    pkg: {
      name: 'devoptional',
      version: '1.2.3',
    },
    parent: root,
  })

  const extraneous = new Node({
    pkg: {
      name: 'extraneous',
    },
    parent: root,
  })

  const peer = new Node({
    pkg: {
      name: 'peer',
      version: '1.2.3',
      dependencies: { peerdep: '' },
    },
    parent: root,
  })

  const peerdep = new Node({
    pkg: {
      name: 'peerdep',
      version: '1.2.3',
    },
    parent: root,
  })

  const prod = new Node({
    pkg: {
      name: 'prod',
      version: '1.2.3',
      dependencies: { proddep: '' },
      peerDependencies: { metapeer: '' },
    },
    parent: root,
  })

  const metapeer = new Node({
    pkg: {
      name: 'metapeer',
      version: '1.2.3',
      dependencies: { metapeerdep: '' },
    },
    parent: root,
  })

  const metapeerdep = new Node({
    pkg: {
      name: 'metapeerdep',
      version: '1.2.3',
    },
    parent: root,
  })

  const proddep = new Node({
    pkg: {
      name: 'proddep',
      version: '1.2.3',
      dependencies: { proddep: '' },
    },
    parent: root,
  })

  const dev = new Node({
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

  const devandoptional = new Node({
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
  const linkylinky = new Link({
    pkg: {
      name: 'linklink',
      version: '1.2.3',
    },
    realpath: '/l/i/n/k/link',
    parent: linky.target,
  })

  const peeroptional = new Node({
    pkg: {
      name: 'peeroptional',
      version: '1.2.3',
      dependencies: { optional: '' },
    },
    parent: root,
  })

  calcDepFlags(root)

  t.match(optional, {
    extraneous: false,
    dev: false,
    optional: true,
    devOptional: false,
    peer: false,
  })
  t.match(devoptional, {
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: true,
    peer: false,
  })
  t.match(extraneous, {
    extraneous: true,
  })
  t.match(peer, {
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: false,
    peer: true,
  })
  t.match(peerdep, {
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: false,
    peer: true,
  })
  t.match(prod, {
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: false,
    peer: false,
  })
  t.match(metapeer, {
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: false,
    peer: true,
  })
  t.match(metapeerdep, {
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: false,
    peer: true,
  })
  t.match(proddep, {
    extraneous: false,
    dev: false,
    optional: false,
    devOptional: false,
    peer: false,
  })
  t.match(dev, {
    extraneous: false,
    dev: true,
    optional: false,
    devOptional: false,
    peer: false,
  })
  t.match(devdep, {
    extraneous: false,
    dev: true,
    optional: false,
    devOptional: false,
    peer: false,
  })
  t.match(devandoptional, {
    extraneous: false,
    dev: true,
    optional: true,
    devOptional: false,
    peer: false,
  })
  t.match(linky, {
    extraneous: false,
    dev: true,
    optional: false,
    devOptional: false,
    peer: false,
  })
  t.match(linkylinky, {
    extraneous: false,
    dev: true,
    optional: false,
    devOptional: false,
    peer: false,
  })
  t.match(peeroptional, {
    extraneous: true,
    dev: false,
    optional: true,
    devOptional: false,
    peer: true,
  })

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

  calcDepFlags(root, true)

  t.equal(root.extraneous, false, 'root is not extraneous')
  t.equal(asdf.extraneous, false, 'asdf is not extraneous')
  t.equal(bar.extraneous, false, 'bar is not extraneous')
  t.equal(baz.extraneous, false, 'baz is not extraneous')
  t.equal(foo.extraneous, false, 'foo is not extraneous')
  t.equal(fooLink.extraneous, false, 'fooLink is not extraneous')
  t.equal(bazLink.extraneous, false, 'bazLink is not extraneous')
  t.end()
})

t.test('multiple links to one target keep the most permissive flags', async t => {
  // `tools` is reached by a prod root link and a dev `app` link; the dev link must not overwrite the prod dev flag.
  const root = new Node({
    path: '/r',
    realpath: '/r',
    pkg: { name: 'root', workspaces: ['app', 'tools'] },
  })
  const app = new Node({
    path: '/r/app',
    realpath: '/r/app',
    root,
    pkg: { name: 'app', version: '1.0.0', devDependencies: { tools: '*' } },
  })
  const tools = new Node({
    path: '/r/tools',
    realpath: '/r/tools',
    root,
    pkg: { name: 'tools', version: '1.0.0' },
  })
  new Link({ name: 'app', parent: root, realpath: '/r/app', target: app })
  new Link({ name: 'tools', parent: root, realpath: '/r/tools', target: tools })
  new Link({ name: 'tools', parent: app, realpath: '/r/tools', target: tools })
  root.workspaces = new Map([['app', '/r/app'], ['tools', '/r/tools']])

  calcDepFlags(root)

  t.equal(tools.dev, false, 'tools is prod via the root workspace link')
  t.equal(app.dev, false, 'app is prod via the root workspace link')
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
