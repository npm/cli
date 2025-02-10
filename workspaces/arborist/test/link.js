// this test depends on debug stuff, so force it on, even if the test env
// does not enable it.
process.env.ARBORIST_DEBUG = '1'
const t = require('tap')
const Link = require('../lib/link.js')
const Node = require('../lib/node.js')
const Shrinkwrap = require('../lib/shrinkwrap.js')

const { resolve } = require('node:path')
const normalizePath = path => path.replace(/^[A-Z]:/, '').replace(/\\/g, '/')
const normalizePaths = obj => {
  obj.path = obj.path && normalizePath(obj.path)
  obj.realpath = obj.realpath && normalizePath(obj.realpath)
  for (const key of obj.inventory.keys()) {
    const member = obj.inventory.get(key)
    member.path = member.path && normalizePath(member.path)
    member.realpath = member.realpath && normalizePath(member.realpath)
  }
  return obj
}

const meta = new Shrinkwrap({ path: '/home/user/projects/some/kind/of/path' })
meta.data = {
  lockfileVersion: 2,
  packages: {},
  dependencies: {},
}

const root = new Node({
  pkg: { name: 'root' },
  path: '/home/user/projects/some/kind/of/path',
  meta,
})

const l1 = new Link({
  pkg: { name: 'root' },
  path: '/home/user/some/other/path',
  realpath: '/home/user/projects/some/kind/of/path',
  meta,
})

t.matchSnapshot(normalizePaths(l1), 'instantiate without providing target')
t.equal(l1.isLink, true, 'link is a link')
t.same(l1.children.size, 0, 'children is empty')
l1.children = new Map([[1, 2], [3, 4]])
t.same(l1.children.size, 0, 'children still empty after being sasigned')
l1.children.set('asdf', 'foo')
t.same(l1.children.size, 0, 'children still empty after setting value')

t.throws(() => new Link({ path: '/x' }), {
  message: 'must provide realpath for Link node',
})

const resolver = new Link({
  path: '/x/y/z',
  realpath: '/x/z/y/a/b/c',
})
t.equal(resolver.resolved,
  'file:../z/y/a/b/c', 'link resolved is relpath to realpath')
resolver.path = null
t.equal(resolver.resolved, null, 'link resolved depends on path')
resolver.path = '/x/z/y/a/b/d'
t.equal(resolver.resolved, 'file:c', 'updates when path changes')

t.matchSnapshot(normalizePaths(new Link({
  path: '/home/user/some/other/path',
  target: root,
})), 'instantiate with target specified')

t.test('link.target setter', async t => {
  const link = new Link({
    path: '/path/to/link',
    realpath: '/node-a',
    pkg: { name: 'node-a', version: '1.2.3' },
  })
  const oldTarget = link.target
  t.equal(oldTarget.linksIn.has(link), true, 'target takes note of link')
  t.equal(link.package, oldTarget.package, 'link has same package as target')

  const newTarget = new Node({
    path: '/node-b',
    realpath: '/node-b',
    pkg: { name: 'node-b', version: '1.2.3' },
  })
  link.target = newTarget
  t.equal(oldTarget.linksIn.size, 0, 'old target has no links in now')
  t.equal(link.target, newTarget, 'new target is target')
  t.equal(newTarget.linksIn.has(link), true, 'new target notes the link')
  t.equal(link.package, newTarget.package, 'link package is new target package')

  link.target = null
  t.equal(link.target, null, 'link has no target')
  t.strictSame(link.package, {}, 'no package without link')
  t.equal(oldTarget.linksIn.size, 0, 'old target still has no links')
  t.equal(newTarget.linksIn.size, 0, 'new target has no links in now')

  link.target = null
  t.equal(link.target, null, 'target is now null')
  t.strictSame(link.package, {}, 'removed target, package is now empty')
  // just test the guard that setting to a different falsey value is fine
  link.target = undefined
  t.equal(link.target, null, 'target is still null')
  t.strictSame(link.package, {}, 'removed target, package is now empty')
})

t.test('get root from various places', t => {
  const root = new Node({
    path: '/path/to/root',
  })

  t.test('get from root', t => {
    const fromRoot = new Link({
      pkg: { name: 'from-root' },
      path: '/path/to/root/from-root',
      realpath: '/path/to/root/from-root-target',
      root,
    })
    t.equal(fromRoot.root, root)
    t.equal(fromRoot.fsParent, root)
    t.equal(fromRoot.parent, null)
    t.equal(fromRoot.target.root, root)
    t.equal(fromRoot.target.fsParent, root)
    t.equal(fromRoot.target.parent, null)
    t.end()
  })

  t.test('get from fsParent', t => {
    const fromFsParent = new Link({
      pkg: { name: 'from-fs-parent' },
      path: '/path/to/root/from-fs-parent',
      realpath: '/path/to/root/from-root-fs-parent',
      fsParent: root,
    })
    t.equal(fromFsParent.root, root)
    t.equal(fromFsParent.fsParent, root)
    t.equal(fromFsParent.parent, null)
    t.equal(fromFsParent.target.root, root)
    t.equal(fromFsParent.target.fsParent, root)
    t.equal(fromFsParent.target.parent, null)
    t.end()
  })

  t.test('get from parent', t => {
    const fromParent = new Link({
      pkg: { name: 'from-parent' },
      parent: root,
      realpath: '/path/to/root/from-root-parent',
    })
    t.equal(fromParent.root, root)
    t.equal(fromParent.fsParent, null)
    t.equal(fromParent.parent, root)
    t.equal(fromParent.target.root, root)
    t.equal(fromParent.target.fsParent, root)
    t.equal(fromParent.target.parent, null)
    t.end()
  })

  t.end()
})

t.test('temporary link node pending attachment to a tree', t => {
  const root = new Node({ path: '/path/to/node' })
  const link = new Link({ name: 'foo', realpath: '/this/will/change' })
  const target = new Node({ path: '/path/to/node/foo' })
  t.equal(link.root, link)
  t.equal(target.root, target)
  t.equal(normalizePath(link.realpath), normalizePath('/this/will/change'))
  link.target = target
  t.equal(target.root, link)
  t.equal(link.realpath, target.path)
  t.equal(link.path, null)
  link.parent = root
  t.equal(normalizePath(link.realpath), normalizePath(target.path))
  t.equal(normalizePath(link.path), normalizePath(root.path + '/node_modules/foo'))
  t.equal(link.root, root)
  t.equal(target.root, root)
  t.equal(target.fsParent, root)

  const link2 = new Link({ name: 'bar', realpath: '/this/will/change' })
  const target2 = new Node({ name: 'bar' })
  link2.target = target2
  t.equal(normalizePath(target2.path), normalizePath('/this/will/change'))
  link2.target = null
  target2.realpath = target2.path = resolve('/path/to/node/bar')
  link2.target = target2
  t.equal(normalizePath(link2.realpath), normalizePath(target2.path))
  link2.parent = root
  t.equal(target2.fsParent, root)

  t.end()
})

t.test('link gets version from target', t => {
  const link = new Link({ realpath: '/some/real/path', path: '/other/path' })
  t.equal(link.version, '')
  link.target = null
  link.package = { name: 'bar', version: '2.3.4' }
  t.equal(link.version, '2.3.4')
  link.package = {}
  t.equal(link.version, '')
  new Node({
    pkg: { name: 'foo', version: '1.2.3' },
    path: '/some/real/path',
    root: link,
  })
  t.equal(link.version, '1.2.3')
  t.end()
})

t.test('link to root path gets root as target', t => {
  const root = new Node({
    path: '/project/root',
    pkg: {
      name: 'root',
      dependencies: {
        root: 'file:.',
      },
    },
  })
  const link = new Link({
    parent: root,
    realpath: root.path,
    pkg: { ...root.package },
  })
  t.equal(link.target, root)
  t.end()
})
