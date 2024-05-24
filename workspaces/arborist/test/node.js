const util = require('node:util')
const t = require('tap')
const Node = require('../lib/node.js')
const OverrideSet = require('../lib/override-set.js')
const Link = require('../lib/link.js')
const Shrinkwrap = require('../lib/shrinkwrap.js')
const { resolve } = require('node:path')
const treeCheck = require('../lib/tree-check.js')

const { normalizePath, normalizePaths } = require('./fixtures/utils.js')

t.cleanSnapshot = str =>
  str.split(process.cwd()).join('{CWD}')
    .replace(/[A-Z]:/g, '')
    .replace(/\\\\?/g, '/')

t.test('basic instantiation', t => {
  const overrides = new OverrideSet({
    overrides: { foo: '1' },
  })
  const root = new Node({
    pkg: { name: 'root' },
    path: '/home/user/projects/root',
    realpath: '/home/user/projects/root',
    overrides,
  })

  t.equal(root.depth, 0, 'root is depth 0')
  t.equal(root.isTop, true, 'root is top')
  t.equal(root.isLink, false, 'root is not a link')
  t.equal(root.overrides, overrides, 'constructor copied provided overrides')

  t.test('dep flags all set true', t => {
    t.equal(root.dummy, false)
    t.equal(root.extraneous, true)
    t.equal(root.dev, true)
    t.equal(root.devOptional, true)
    t.equal(root.optional, true)
    t.equal(root.peer, true)
    t.end()
  })

  t.matchSnapshot(root, 'just a lone root node')

  t.test('dummy node', t => {
    const node = new Node({
      path: '/not/a/real/path',
      dummy: true,
    })
    t.test('dep flags all set false', t => {
      t.equal(node.dummy, true)
      t.equal(node.extraneous, false)
      t.equal(node.dev, false)
      t.equal(node.devOptional, false)
      t.equal(node.optional, false)
      t.equal(node.peer, false)
      t.end()
    })
    t.end()
  })

  t.end()
})

t.test('testing with dep tree', async t => {
  const runTest = rootMetadata => async t => {
    const root = new Node({
      pkg: {
        name: 'root',
        bundleDependencies: ['bundled'],
        dependencies: { prod: '1.x', bundled: '', missing: '' },
        devDependencies: { dev: '', overlap: '' },
        optionalDependencies: { optional: '', overlap: '', optMissing: '' },
      },
      realpath: '/home/user/projects/root',
      path: '/home/user/projects/root',
      meta: rootMetadata,
      children: [{
        pkg: {
          name: 'prod',
          version: '1.2.3',
          dependencies: { meta: '' },
          peerDependencies: { peer: '' },
        },
        fsChildren: [{
          realpath: '/home/user/projects/root/node_modules/prod/foo',
          path: '/home/user/projects/root/node_modules/prod/foo',
          name: 'foo',
          pkg: { name: 'foo', version: '1.2.3', dependencies: { meta: '' } },
        }],
        resolved: 'prod',
        integrity: 'prod',
      }],
    })
    t.equal(root.root, root, 'root is its own root node')
    const prod = root.children.get('prod')
    t.equal(prod.fsChildren.size, 1, 'prod has one fsChild')
    const foo = [...prod.fsChildren][0]
    t.equal(foo.fsParent, prod, 'foo has prod as fsParent')
    t.equal(prod.root, root, 'prod rooted on root')
    t.equal(prod.depth, 1, 'prod is depth 1')
    const meta = new Node({
      pkg: {
        name: 'meta',
        version: '1.2.3',
        devDependencies: { missing: '' },
        dependencies: { bundled: '' },
        _resolved: 'meta',
        _integrity: 'meta',
      },
      path: '/home/user/projects/root/node_modules/prod/node_modules/meta',
      realpath: '/home/user/projects/root/node_modules/prod/node_modules/meta',
      parent: prod,
    })
    t.equal(meta.isDescendantOf(root), true, 'meta descends from root')
    t.equal(meta.root, root, 'meta rooted in same tree via parent')

    // retrieve a node using querySelectorAll
    const queryResult = await root.querySelectorAll('* #meta')
    t.same(queryResult, [meta], 'should retrieve node using querySelectorAll')

    const bundled = new Node({
      pkg: {
        name: 'bundled',
        version: '1.2.3',
        dependencies: { meta: '' },
      },
      resolved: 'bundled',
      integrity: 'bundled',
      path: '/home/user/projects/root/node_modules/bundled',
      realpath: '/home/user/projects/root/node_modules/bundled',
      parent: root,
    })
    t.equal(meta.isDescendantOf(bundled), false, 'meta does not descend from bundled')
    t.equal(bundled.root, root, 'bundled root is project root')

    const dev = new Node({
      pkg: {
        name: 'dev',
        version: '1.2.3',
      },
      resolved: 'dev',
      integrity: 'dev',
      path: '/home/user/projects/root/node_modules/dev',
      realpath: '/home/user/projects/root/node_modules/dev',
      parent: root,
    })
    t.equal(dev.root, root, 'dev root is project root')

    const opt = new Node({
      pkg: {
        name: 'optional',
        version: '1.2.3',
      },
      resolved: 'opt',
      integrity: 'opt',
      path: '/home/user/projects/root/node_modules/optional',
      realpath: '/home/user/projects/root/node_modules/optional',
      parent: root,
    })
    t.equal(opt.root, root, 'opt root is project root')

    const peer = new Node({
      pkg: {
        name: 'peer',
        version: '1.2.3',
      },
      resolved: 'peer',
      integrity: 'peer',
      path: '/home/user/projects/root/node_modules/peer',
      realpath: '/home/user/projects/root/node_modules/peer',
      parent: root,
    })
    t.equal(peer.root, root)

    const extraneous = new Node({
      pkg: {
        name: 'extraneous',
        version: '1.2.3',
      },
      resolved: 'extraneous',
      integrity: 'extraneous',
      path: '/home/user/projects/root/node_modules/extraneous',
      realpath: '/home/user/projects/root/node_modules/extraneous',
      parent: root,
    })
    t.equal(extraneous.root, root, 'extraneous.root is project root')

    t.equal(prod.top, root, 'root is top of tree')
    t.equal(prod.root, root, 'root is root of tree')
    t.equal(root.isRoot, true, 'root is root of tree')
    t.equal(prod.isRoot, false, 'prod is not root of tree')
    t.equal(extraneous.extraneous, true, 'extraneous is extraneous')
    t.matchSnapshot(root, 'initial load with some deps')

    // move dep to top level
    meta.parent = root
    t.matchSnapshot(root, 'move meta to top level, update stuff')
    t.equal(meta.root, root, 'meta.root is root still')
    t.equal(meta.parent, root, 'meta.parent is root')
    t.equal(root.inventory.get(meta.location), meta)

    const newMeta = new Node({
      pkg: {
        name: 'meta',
        version: '2.3.4',
        peerDependencies: { asdf: '' },
        peerDependenciesMeta: {
          asdf: { optional: true },
        },
      },
      resolved: 'newMeta',
      integrity: 'newMeta',
      name: 'meta',
      parent: prod,
    })
    t.equal(newMeta.root, root)
    newMeta.root = prod
    t.equal(newMeta.root, root, 'setting root to non-root crawls up root list')
    t.equal(meta.parent, root)
    t.equal(newMeta.parent, prod)
    t.equal(root.inventory.get(meta.location), meta)

    // test that reparenting a link _doesn't_ update realpath
    const metaMeta = new Link({
      pkg: {
        name: 'metameta',
        version: '1.2.3',
        _resolved: 'metameta',
        _integrity: 'metameta',
      },
      path: newMeta.path + '/node_modules/metameta',
      realpath: meta.realpath,
      target: meta,
    })
    t.equal(metaMeta.root, root, 'link takes root of target if unspecified')
    metaMeta.parent = newMeta
    t.equal(metaMeta.root, root)
    t.equal(meta.root, root)
    t.equal(meta.parent, root)
    t.equal(root.children.get('meta'), meta)
    t.equal(root.inventory.get(meta.location), meta)

    t.matchSnapshot(root, 'add new meta under prod')

    t.equal(meta.parent, root, 'old meta parent is root before assigning')
    newMeta.parent = root

    t.equal(meta.parent, null, 'old meta parent removed')
    t.not(root.children.get('meta'), meta,
      'root.children no longer has old meta')
    t.matchSnapshot(root, 'move new meta to top level')

    newMeta.parent = root
    t.matchSnapshot(root, 'move new meta to top level second time (no-op)')

    t.test('replacement tests', t => {
      const newProd = new Node({
        name: 'prod',
        pkg: {
          name: 'prod',
          version: '1.2.3',
          dependencies: { meta: '' },
          peerDependencies: { peer: '' },
        },
        path: '/some/path',
        resolved: 'prod',
        integrity: 'prod',
      })
      t.equal(newProd.canReplace(prod), true, 'new prod can replace prod')
      const kidCount = prod.children.size
      newProd.replace(prod)
      t.equal(newProd.children.size, kidCount, 'kids moved to newProd')
      t.equal(prod.children.size, 0, 'kids moved to newProd')
      t.equal(prod.root, prod, 'prod excised from tree')
      t.equal(newProd.root, root, 'newProd in the tree')
      // XXX seems wrong, taking over fsChildren is weird?
      t.equal(newProd.fsChildren.size, 0, 'fsChildren replaced')
      t.equal(prod.fsChildren.size, 1, 'fsChildren go along with fsParent')
      t.equal([...prod.fsChildren][0], foo, 'foo still in old prod fsChildren set')
      t.equal(foo.fsParent, prod, 'prod is still foos fsParent')

      const notProd = new Node({
        pkg: {
          name: 'notprod',
          version: '1.2.3',
        },
        path: '/some/path',
      })
      t.equal(notProd.canReplace(newProd), false, 'cannot replace with different name')

      const prodV2 = new Node({
        name: 'prod',
        path: '/path/to/prod',
        pkg: {
          name: 'prod',
          version: '2.3.4',
        },
      })
      // also call the other alias for this function, from the other dir
      t.equal(newProd.canReplaceWith(prodV2), false, 'cannot replace with 2.x')

      const root2 = new Node({
        pkg: {
          name: 'root',
          bundleDependencies: ['bundled'],
          dependencies: { prod: '1.x', bundled: '', missing: '' },
          devDependencies: { dev: '', overlap: '' },
          optionalDependencies: { optional: '', overlap: '', optMissing: '' },
        },
        realpath: '/home/user/projects/root',
        path: '/home/user/projects/root',
        meta: rootMetadata,
      })
      // call the inverse function, for coverage
      root.replaceWith(root2)
      t.equal(root2.root, root2, 'replacing root preserves self-rootedness')
      root.replace(root2)

      const prodLink = new Link({
        pkg: prod.package,
        realpath: '/some/other/path/entirely',
        path: '/not/where/it/really/is',
        name: 'prod',
      })
      t.equal(prodLink.canReplace(newProd), true, 'link can replace node')
      prodLink.replace(newProd)
      t.equal(newProd.parent, null, 'newProd removed from tree')
      t.equal(newProd.root, newProd, 'newProd removed from tree')
      t.equal(normalizePath(prodLink.path), normalizePath(newProd.path), 'replaced link')
      t.equal(newProd.children.size, 0, 'newProd kids moved over')
      t.equal(prodLink.children.size, 0, 'links do not have child nodes')
      t.equal(prodLink.target.children.size, kidCount, 'link target has children')

      t.equal(newProd.canReplace(prodLink), true, 'node can replace link')
      const { target } = prodLink
      newProd.replace(prodLink)
      t.equal(prodLink.parent, null, 'prodLink removed from tree')
      t.equal(prodLink.target, null, 'prodLink lost its target')
      t.equal(prodLink.root, prodLink, 'prodLink removed from tree')
      t.equal(target.root, target, 'prodLinks old target removed from tree')
      t.equal(normalizePath(newProd.path), normalizePath(prodLink.path), 'replaced node')
      t.equal(prodLink.children.size, 0, 'prodLink has no child nodes')

      t.end()
    })

    t.end()
  }

  t.test('without meta', await runTest())
  const meta = new Shrinkwrap({ path: '/home/user/projects/root' })
  meta.data = {
    lockfileVersion: 2,
    packages: {},
    dependencies: {},
  }
  t.test('with meta', await runTest(meta))

  t.end()
})

t.test('adding two children that both have links into them', t => {
  const root = new Node({
    path: '/path/to/root',
  })
  const o1 = new Link({
    parent: root,
    realpath: '/path/m/node_modules/n/o1',
    name: 'o1',
  })
  const t1 = new Node({
    path: o1.realpath,
    root,
  })
  const o2 = new Link({
    parent: root,
    realpath: '/path/m/node_modules/n/o2',
    name: 'o2',
  })
  const t2 = new Node({
    path: o2.realpath,
    root,
  })
  const m = new Node({
    path: '/path/m',
    dummy: true,
    root,
  })
  t.equal(o1.target, t1)
  t.equal(o2.target, t2)
  t.equal(t1.linksIn.has(o1), true)
  t.equal(t2.linksIn.has(o2), true)
  t.equal(t1.fsParent, m)
  t.equal(t2.fsParent, m)
  t.end()
})

t.test('edge cases for branch coverage', t => {
  const noPkg = new Node({
    realpath: '/home/user/projects/root',
    path: '/home/user/projects/root',
  })
  t.same(noPkg.package, {}, 'default package is empty object')
  t.equal(noPkg.name, 'root', 'root default name is . if package empty')

  const noPath = new Node({
    realpath: '/home/user/projects/root',
  })
  t.equal(noPath.name, 'root', 'pathless gets named for realpath')

  t.end()
})

t.test('tracks the loading error encountered', t => {
  const error = new Error('this is fine')
  const root = new Node({
    pkg: { name: 'root' },
    path: '/home/user/projects/root',
    realpath: '/home/user/projects/root',
    error,
  })
  t.equal(root.errors[0], error, 'keeps ahold of the error')
  t.end()
})

t.throws(() => new Node({ pkg: {} }), TypeError(
  'could not detect node name from path or package'))

t.test('load from system-root path', t => {
  const root = new Node({
    path: resolve('/'),
  })
  t.equal(root.name, null, 'ok to have a nameless node in system root')
  t.end()
})

t.test('load with a virtual filesystem parent', t => {
  const Node = t.mock('../lib/node.js', {
    '../lib/debug.js': a => a(),
  })
  const Link = t.mock('../lib/link.js', {
    '../lib/node.js': Node,
  })
  const root = new Node({
    pkg: { name: 'root', dependencies: { a: '', link: '', link2: '', link3: '' } },
    path: '/home/user/projects/root',
    realpath: '/home/user/projects/root',
  })
  const a = new Node({
    pkg: { name: 'a', version: '1.2.3' },
    parent: root,
    name: 'a',
  })
  const link = new Link({
    pkg: { name: 'link', version: '1.2.3', dependencies: { a: '', kid: '' } },
    realpath: root.realpath + '/link-target',
    parent: root,
  })
  t.ok(link.target, 'link has a target')
  const linkKid = new Node({
    pkg: { name: 'kid', dependencies: { a: '' } },
    parent: link.target,
  })

  const link2 = new Link({
    pkg: { name: 'link2', version: '1.2.3', dependencies: { link: '' } },
    realpath: a.realpath + '/node_modules/link2-target',
    parent: root,
    fsParent: a,
  })

  t.equal(link2.target.parent, a, 'fsParent=parent sets parent')
  t.equal(link2.target.fsParent, null, 'fsParent=parent does not set fsParent')
  t.equal(link2.target.resolveParent, a, 'resolveParent is parent')

  const target3 = new Node({
    name: 'link3',
    path: root.realpath + '/packages/link3',
    realpath: root.realpath + '/packages/link3',
    pkg: { name: 'link3', version: '1.2.3', dependencies: { link2: '' } },
    fsParent: new Node({
      path: root.realpath + '/packages',
      realpath: root.realpath + '/packages',
      pkg: { name: 'packages', version: '2.3.4', dependencies: { link: '' } },
    }),
  })
  const packages = target3.fsParent

  const link3 = new Link({
    pkg: { name: 'link3', version: '1.2.3', dependencies: { link2: '' } },
    realpath: root.realpath + '/packages/link3',
    target: target3,
    parent: root,
  })
  t.equal(target3.root, root)
  t.equal(packages.fsChildren.size, 0)

  packages.root = root

  t.equal(normalizePath(target3.fsParent.path), normalizePath(packages.path))
  t.equal(packages.fsChildren.size, 1)

  t.equal(packages.location, 'packages')
  t.equal(target3.location, 'packages/link3')
  t.equal(normalizePath(target3.realpath), normalizePath(root.path + '/packages/link3'))
  t.equal(target3.fsParent, packages)
  t.equal(packages.fsChildren.size, 1)
  t.equal(normalizePath(link3.realpath), normalizePath(target3.realpath))
  t.equal(link3.root, target3.root)
  t.equal(link3.target, target3, 'before fsParent move')

  packages.fsParent = link.target
  t.equal(packages.location, 'link-target/packages')
  t.equal(target3.location, 'link-target/packages/link3')
  t.equal(normalizePath(target3.realpath), normalizePath(root.path + '/link-target/packages/link3'))
  t.equal(target3.fsParent, packages)
  t.equal(packages.fsChildren.size, 1)
  t.equal(normalizePath(link3.realpath), normalizePath(target3.realpath))
  t.equal(link3.root, target3.root)
  t.equal(link3.target, target3, 'after fsParent move')

  // do it again so we can verify nothing changed.  this should be a no-op.
  packages.fsParent = link.target
  t.equal(packages.location, 'link-target/packages')
  t.equal(target3.location, 'link-target/packages/link3')
  t.equal(normalizePath(target3.realpath), normalizePath(root.path + '/link-target/packages/link3'))
  t.equal(target3.fsParent, packages)
  t.equal(packages.fsChildren.size, 1)
  t.equal(normalizePath(link3.realpath), normalizePath(target3.realpath))
  t.equal(link3.root, target3.root)
  t.equal(link3.target, target3, 'after fsParent move')

  t.equal(normalizePath(packages.path), normalizePath(root.realpath + '/link-target/packages'))
  t.equal(normalizePath(target3.path), normalizePath(root.realpath + '/link-target/packages/link3'))
  t.equal(link3.target, target3, 'still targeting the right node 4')
  t.equal(target3.fsParent, packages, 'link3 target under packages')
  t.equal(normalizePath(link3.realpath), normalizePath(target3.path), 'link realpath updated')

  // can't set fsParent to a link!  set to the target instead.
  const linkChild = new Node({
    path: target3.path + '/linkchild',
    pkg: { name: 'linkchild', version: '1.2.3' },
  })
  linkChild.fsParent = link3
  t.equal(linkChild.fsParent, link3.target)
  t.equal(linkChild.root, root)

  t.equal(target3.fsParent, packages, 'link3 target under packages')

  // can't set fsParent to the same node
  t.throws(() => packages.fsParent = packages, {
    message: 'setting node to its own fsParent',
  })

  t.throws(() => packages.fsParent = new Node({ path: packages.path }), {
    message: 'setting fsParent to same path',
  })

  // can't set fsParent on a new node such that it's outside its path
  const outsideNode = new Node({ path: '/not/the/root/path', pkg: {} })
  t.throws(() => outsideNode.fsParent = root, {
    message: 'setting fsParent improperly',
  })

  // automatically set fsParent based on path calculations
  t.equal(link.target.fsParent, root)
  t.equal(link.target.resolveParent, root, 'resolveParent is fsParent')
  t.equal(link.target.edgesOut.get('a').error, null)
  t.equal(linkKid.edgesOut.get('a').error, null)
  t.equal(linkKid.parent, link.target)

  const target = link.target
  link.target.root = null
  t.equal(link.target, null)
  t.equal(target.edgesOut.get('a').error, 'MISSING')
  t.equal(linkKid.edgesOut.get('a').error, 'MISSING')

  target.fsParent = link.root
  t.equal(link.target, target)
  t.equal(link.target.fsParent, root)
  t.equal(link.target.edgesOut.get('a').error, null)
  t.equal(linkKid.edgesOut.get('a').error, null)

  // move it under this other one for some reason
  link.target.fsParent = link2.target
  t.equal(link.target.fsParent, link2.target)
  t.equal(link.target.edgesOut.get('a').error, null)
  t.equal(linkKid.edgesOut.get('a').error, null)

  // move it into node_modules
  link.target.parent = link2.target
  t.equal(link.target.fsParent, null, 'lost fsParent for parent')
  t.equal(link.target.edgesOut.get('a').error, null)
  t.equal(linkKid.edgesOut.get('a').error, null)
  t.equal(normalizePath(link.realpath), normalizePath(link2.realpath + '/node_modules/link-target'))

  const linkLoc = link.location
  const linkTarget = link.target
  link.parent = null
  t.equal(link.root, link, 'removed from parent, removed from root')
  t.equal(root.inventory.get(linkLoc), undefined, 'removed from root inventory')
  t.equal(link.inventory.has(link), true, 'link added to own inventory')
  t.equal(link.target, null, 'target left behind when setting root to null')
  linkTarget.root = link
  t.equal(link.target, linkTarget, 'target set once roots match')
  t.equal(link.inventory.get(''), linkTarget)
  t.equal(root.edgesOut.get('link').error, 'MISSING')

  packages.fsParent = null
  t.equal(packages.root, packages, 'removed from fsParent, removed from root')

  // now replace the real node with a link
  // ensure that everything underneath it is removed from root
  const aChild = new Node({
    parent: a,
    pkg: { name: 'achild', version: '1.2.3' },
  })
  t.equal(aChild.parent, a)
  t.equal(a.children.get('achild'), aChild)
  const underA = [...root.inventory.values()]
    .filter(node => node.path.startsWith(a.path) && node !== a)
  const aLoc = a.location
  const aLink = new Link({
    path: a.path,
    target: new Node({
      path: '/some/other/a',
      pkg: a.package,
    }),
  })
  aLink.root = root
  t.equal(root.inventory.get(aLoc), aLink)
  t.equal(a.root, a)
  for (const node of underA) {
    t.not(node.root, root, `${node.path} still under old root`)
  }

  // create a new fsChild several steps below the root, then shove
  // a link in the way of it, removing it.
  const fsD = new Node({
    path: root.path + '/a/b/c/d',
    pkg: { name: 'd', version: '1.2.3' },
    root,
  })
  t.equal(fsD.fsParent, root, 'root should be fsParent')
  new Link({
    path: root.path + '/a/b',
    target: new Node({
      path: '/some/exotic/location',
      pkg: { name: 'b', version: '1.2.3' },
    }),
    root,
  })
  t.not(fsD.root, root, 'fsD removed from root')

  // add a node completely outside the root folder, as a link
  // target, then add a new node that takes over as its parent,
  // to exercise the code path where a top node has no fsParent
  const remoteLink = new Link({
    parent: root,
    name: 'x',
    realpath: '/remote/node_modules/a/node_modules/x',
  })
  const remoteTarget = new Node({
    path: '/remote/node_modules/a/node_modules/x',
    realpath: '/remote/node_modules/a/node_modules/x',
    pkg: { name: 'x', version: '1.2.3' },
    root,
  })
  t.equal(remoteLink.target, remoteTarget, 'automatically found target')
  t.equal(remoteTarget.fsParent, null, 'remote target has no fsParent')
  t.equal(remoteTarget.parent, null, 'remote target has no parent')
  root.tops.has(remoteTarget, 'remote target in root.tops')
  const remoteParent = new Node({
    path: '/remote/node_modules/a',
    pkg: { name: 'a', version: '1.2.3' },
    root,
  })
  t.throws(() => remoteParent.target = remoteTarget, {
    message: 'cannot set target on non-Link Nodes',
    path: remoteParent.path,
  })
  t.equal(remoteParent.children.get('x'), remoteTarget)
  treeCheck(root)

  t.end()
})

t.test('child of link target has path, like parent', t => {
  const root = new Node({
    pkg: { name: 'root', dependencies: { a: '', link: '', link2: '' } },
    path: '/home/user/projects/root',
    realpath: '/home/user/projects/root',
  })
  new Node({
    pkg: { name: 'a', version: '1.2.3' },
    parent: root,
    name: 'a',
  })
  const link = new Link({
    pkg: { name: 'link', version: '1.2.3', dependencies: { a: '', kid: '' } },
    realpath: root.realpath + '/link-target',
    parent: root,
    fsParent: root,
  })
  const linkKid = new Node({
    pkg: { name: 'kid' },
    parent: link,
  })
  t.equal(linkKid.parent, link.target, 'setting link as parent sets target instead')
  t.equal(normalizePath(linkKid.path), normalizePath(linkKid.realpath), 'child of link target path is realpath')
  t.end()
})

t.test('changing root', t => {
  const meta = new Shrinkwrap({ path: '/home/user/projects/root' })
  meta.data = { lockfileVersion: 2, dependencies: {}, packages: {} }
  const root = new Node({
    pkg: { name: 'root', dependencies: { a: '', link: '', link2: '' } },
    path: '/home/user/projects/root',
    realpath: '/home/user/projects/root',
    meta,
  })
  const a = new Node({
    pkg: { name: 'a', version: '1.2.3' },
    parent: root,
    name: 'a',
    resolved: 'https://example.com/a-1.2.3.tgz',
    integrity: 'sha512-asdfasdfasdf',
  })
  const b = new Node({
    pkg: { name: 'b', version: '1.2.3' },
    parent: a,
    name: 'b',
  })
  const meta2 = new Shrinkwrap({ path: '/home/user/projects/root2' })
  meta2.data = { lockfileVersion: 2, dependencies: {}, packages: {} }
  const root2 = new Node({
    pkg: { name: 'root2', dependencies: { a: '', link: '', link2: '' } },
    path: '/home/user/projects/root2',
    realpath: '/home/user/projects/root2',
    meta: meta2,
  })
  t.equal(a.root, root, 'root is root of tree from a')
  t.equal(b.root, root, 'root is root of tree from b')
  a.parent = root2
  t.equal(a.root, root2, 'root is set when parent is changed')
  t.equal(b.root, root2, 'root is set on children when parent is changed')
  t.end()
})

t.test('attempt to assign parent to self on root node', t => {
  // turn off debugging for this one so we don't throw
  const Node = t.mock('../lib/node.js', {
    '../lib/debug.js': () => {},
  })
  const root = new Node({
    pkg: { name: 'root' },
    path: '/',
    realpath: '/',
  })
  root.parent = root.fsParent = root
  t.equal(root.parent, null, 'root node parent should be empty')
  t.equal(root.fsParent, null, 'root node fsParent should be empty')
  t.end()
})

t.test('bundled dependencies logic', t => {
  const root = new Node({
    pkg: {
      name: 'root',
      dependencies: { a: '', b: '', d: '', e: '', f: '' },
      bundleDependencies: ['a'],
    },
    path: '/path/to/root',
    realpath: '/path/to/root',
  })
  const a = new Node({
    pkg: { name: 'a', version: '1.2.3', dependencies: { b: '', aa: '' } },
    parent: root,
  })
  const aa = new Node({
    pkg: { name: 'aa', version: '1.2.3' },
    parent: a,
  })
  const b = new Node({
    pkg: { name: 'b', version: '1.2.3', dependencies: { c: '' } },
    parent: root,
  })
  const c = new Node({
    pkg: { name: 'c', version: '1.2.3', dependencies: { cc: '' } },
    parent: root,
  })
  new Node({
    pkg: { name: 'cc', version: '1.2.3', dependencies: { d: '' } },
    parent: c,
  })
  const d = new Node({
    pkg: { name: 'd', version: '1.2.3' },
    parent: root,
  })
  const e = new Node({
    pkg: { name: 'e', version: '1.2.3' },
    parent: root,
  })
  const f = new Node({
    pkg: {
      name: 'f',
      version: '1.2.3',
      dependencies: { fa: '', fb: '' },
      bundleDependencies: ['fb'],
    },
    parent: root,
  })
  new Node({
    pkg: { name: 'fa', version: '1.2.3' },
    parent: f,
  })
  const fb = new Node({
    pkg: { name: 'fb', version: '1.2.3', dependencies: { e: '', fc: '' } },
    parent: f,
  })
  new Node({
    pkg: { name: 'fc', version: '1.2.3', dependencies: { fb: '' } },
    parent: f,
  })

  t.equal(a.inBundle, true, 'bundled dep is bundled')
  t.equal(a.inDepBundle, false, 'bundled dep is bundled by root')
  t.equal(aa.inBundle, true, 'child of bundled dep is bundled')
  t.equal(aa.inDepBundle, false, 'child of dep bundled by root is not dep bundled')
  t.equal(b.inBundle, true, 'dep of bundled dep at peer level is bundled')
  t.equal(c.inBundle, true, 'metadep of bundled dep at peer level is bundled')
  t.equal(d.inBundle, true, 'deduped metadep of bundled metadep is bundled')
  t.equal(e.inBundle, false, 'deduped dep of bundled dep of metadep is not bundled')
  t.equal(fb.inBundle, true, 'bundled dep of dep is bundled')
  t.equal(fb.inDepBundle, true, 'bundled dep of dep is dep bundled (not by root)')
  t.end()
})

t.test('move fsChildren when moving to a new fsParent in same root', t => {
  const root = new Node({
    path: '/path/to/root',
  })
  const p1 = new Node({
    path: '/path/to/root/p1',
    root: root,
  })
  t.equal(p1.fsParent, root)
  const p2 = new Node({
    path: '/path/to/root/p2',
    root: root,
  })
  t.equal(p2.fsParent, root)
  const c2 = new Node({
    path: '/path/to/root/p2/c2',
    root: root,
  })
  t.equal(c2.fsParent, p2)
  p2.fsParent = p1
  t.equal(normalizePath(c2.path), normalizePath('/path/to/root/p1/p2/c2'))
  t.end()
})

t.test('check if a node is in a node_modules folder or not', t => {
  const a = new Node({
    path: '/path/to/foo/node_modules/a',
    realpath: '/path/to/foo/node_modules/a',
    pkg: { name: 'a' },
  })
  t.equal(normalizePath(a.inNodeModules()), '/path/to/foo', 'basic obvious case')

  const b = new Node({
    path: '/path/to/foo/node_modules/a',
    realpath: '/path/to/foo/node_modules/a',
    pkg: { name: 'b' },
  })
  t.equal(normalizePath(b.inNodeModules()), '/path/to/foo', 'based on path name, not pkg name')

  const c = new Node({
    path: '/path/to/foo/node_modules/a/b/c',
    realpath: '/path/to/foo/node_modules/a/b/c',
    pkg: { name: 'c' },
  })
  t.equal(c.inNodeModules(), false, 'not directly in node_modules')

  const d = new Node({
    path: '/path/to/foo/node_modules/@c/d',
    realpath: '/path/to/foo/node_modules/@c/d',
    pkg: { name: '@a/b/c/d/e' },
  })
  t.equal(normalizePath(d.inNodeModules()), '/path/to/foo', 'scoped package in node_modules')

  t.end()
})

t.test('update metadata when moving between linked top-of-tree parents', t => {
  // this is a bit of a weird edge case, but covered for completeness.
  // When moving the parent of a node, we update the metadata in the root,
  // AND in the top-of-tree node, if it's not also the root (as that would be
  // redundant).

  const rootMeta = new Shrinkwrap({ path: '/home/user/projects/root' })
  rootMeta.data = { lockfileVersion: 2, dependencies: {}, packages: {} }
  const root = new Node({
    pkg: { name: 'root' },
    path: rootMeta.path,
    realpath: rootMeta.path,
    meta: rootMeta,
  })

  const top1Meta = new Shrinkwrap({ path: '/path/to/top1' })
  top1Meta.data = { lockfileVersion: 2, dependencies: {}, packages: {} }
  const top1 = new Node({
    pkg: { name: 'top', version: '1.1.1' },
    path: top1Meta.path,
    realpath: top1Meta.path,
    meta: top1Meta,
  })

  new Link({
    name: 'link1',
    parent: root,
    realpath: top1.path,
    target: top1,
  })

  const top2Meta = new Shrinkwrap({ path: '/path/to/top2' })
  top2Meta.data = { lockfileVersion: 2, dependencies: {}, packages: {} }
  const top2 = new Node({
    pkg: { name: 'top', version: '1.1.1' },
    path: top2Meta.path,
    realpath: top2Meta.path,
    meta: top2Meta,
  })

  const link2 = new Link({
    name: 'link2',
    parent: root,
    realpath: top2.path,
    target: top2,
  })

  const child = new Node({
    parent: top1,
    pkg: {
      name: 'child',
      version: '1.2.3',
      dependencies: { child2: '2' },
    },
    resolved: 'https://child.com/-/child-1.2.3.tgz',
    integrity: 'sha512-blortzeyblartzeyfartz',
  })
  const child2 = new Node({
    parent: child,
    pkg: { name: 'child2', version: '2.3.4' },
    resolved: 'https://child.com/-/child-2.3.4.tgz',
    integrity: 'sha512-a childs child is a kidkid',
  })

  t.matchSnapshot(child.location, 'initial child location, pre-move')
  t.equal(child.root, root, 'child root is the shared root node')
  t.equal(child.top, top1, 'child top is top1')
  t.matchSnapshot(child2.location, 'initial child2 location, pre-move')
  t.equal(child2.root, root, 'child2 root is the shared root node')
  t.equal(child2.top, top1, 'child2 top is top1')
  t.matchSnapshot(root.meta.get(child.location), 'metadata from root')
  t.matchSnapshot(top1.meta.get(child.location), 'metadata from top1')

  // now move it over
  const oldLocation = child.location
  const oldLocation2 = child2.location
  child.parent = link2
  t.equal(child.top, top2, 'after move, top points at top2')
  t.equal(child.parent, top2, 'parent assigned to link target')
  t.matchSnapshot(child.location, 'new child location')
  t.equal(child2.top, top2, 'after move, top points at top2')
  t.equal(child2.parent, child, 'parent assigned to link target')
  t.matchSnapshot(child2.location, 'new child2 location')
  t.matchSnapshot(root.meta.get(child.location), 'root metadata updated')
  t.matchSnapshot(root.meta.get(child2.location), 'root metadata updated')
  t.matchSnapshot(root.meta.get(oldLocation), 'old location deleted from root')
  t.matchSnapshot(top1.meta.get(oldLocation), 'old location deleted from top1')
  t.matchSnapshot(root.meta.get(oldLocation2), 'old location2 deleted from root')
  t.matchSnapshot(top1.meta.get(oldLocation2), 'old location2 deleted from top1')
  t.matchSnapshot(top2.meta.get(child.location), 'new top metadata updated')
  t.matchSnapshot(top2.meta.get(child2.location), 'new top metadata updated')

  return t.end()
})

t.test('setting package refreshes deps', t => {
  const root = new Node({
    pkg: {
      dependencies: {
        a: '1',
      },
    },
    path: '/path/to/root',
  })
  const a = new Node({
    pkg: {
      name: 'a',
      version: '1.2.3',
    },
    parent: root,
  })
  t.equal(root.edgesOut.get('a').valid, true,
    'dep is valid before updating pkg')
  root.package = { dependencies: { a: '2' } }
  t.equal(root.edgesOut.get('a').valid, false,
    'dep is invalid after updating pkg')
  a.package = { name: 'a', version: '2.3.4' }
  t.equal(root.edgesOut.get('a').valid, true,
    'dep is valid again after updating dep pkg')
  t.end()
})

t.test('nodes in shrinkwraps', t => {
  const root = new Node({
    pkg: { dependencies: { a: '' } },
    path: '/path/to/root',
    children: [
      {
        name: 'a',
        pkg: {
          name: 'a',
          version: '1.2.3',
          dependencies: { b: '' },
          _hasShrinkwrap: true,
        },
        children: [
          {
            name: 'b',
            pkg: {
              version: '1.2.3',
              name: 'b',
              dependencies: { c: '' },
            },
            children: [{ name: 'c', pkg: { name: 'c', version: '1.2.3' } }],
          },
        ],
      },
    ],
  })
  const a = root.children.get('a')
  const b = a.children.get('b')
  const c = b.children.get('c')

  t.equal(a.hasShrinkwrap, true, 'a has a shrinkwrap')
  t.equal(b.inShrinkwrap, true, 'b is in shrinkwrap')
  t.equal(c.inShrinkwrap, true, 'c is in shrinkwrap')
  t.end()
})

t.test('bin paths', t => {
  const root = new Node({
    path: '/a/b/c',
    pkg: { bin: { c: 'blorp' } },
    children: [
      { pkg: { name: '@foo/bar', bin: { bar: 'foo' } } },
      { pkg: { name: 'foo', bin: { foo: 'bloo' } },
        children: [{ pkg: { name: 'bar', bin: { bar: 'noscope' } } }] },
      { pkg: { name: 'nobin' } },
    ],
  })

  const link = new Link({
    parent: root,
    name: 'linkfoo',
    pkg: { bin: { d: 'from-link' } },
    realpath: root.path + '/d/e/f',
  })

  const { resolve: r } = require('node:path')

  t.strictSame(root.binPaths, [])
  t.strictSame(link.binPaths, [
    r('/a/b/c/node_modules/.bin/d'),
    ...(process.platform !== 'win32' ? [] : [
      r('/a/b/c/node_modules/.bin/d.cmd'),
      r('/a/b/c/node_modules/.bin/d.ps1'),
    ]),
  ])
  t.strictSame(link.target.binPaths, [])
  const scoped = root.children.get('@foo/bar')
  t.strictSame(scoped.binPaths, [
    r('/a/b/c/node_modules/.bin/bar'),
    ...(process.platform !== 'win32' ? [] : [
      r('/a/b/c/node_modules/.bin/bar.cmd'),
      r('/a/b/c/node_modules/.bin/bar.ps1'),
    ]),
  ])
  const unscoped = root.children.get('foo')
  t.strictSame(unscoped.binPaths, [
    r('/a/b/c/node_modules/.bin/foo'),
    ...(process.platform !== 'win32' ? [] : [
      r('/a/b/c/node_modules/.bin/foo.cmd'),
      r('/a/b/c/node_modules/.bin/foo.ps1'),
    ]),
  ])
  const nested = unscoped.children.get('bar')
  t.strictSame(nested.binPaths, [
    r('/a/b/c/node_modules/foo/node_modules/.bin/bar'),
    ...(process.platform !== 'win32' ? [] : [
      r('/a/b/c/node_modules/foo/node_modules/.bin/bar.cmd'),
      r('/a/b/c/node_modules/foo/node_modules/.bin/bar.ps1'),
    ]),
  ])
  const nobin = root.children.get('nobin')
  t.strictSame(nobin.binPaths, [])
  t.end()
})

t.test('binPaths, but global', t => {
  const root = new Node({
    global: true,
    path: '/usr/local/lib',
    children: [
      { pkg: { name: '@foo/bar', bin: { bar: 'foo' } } },
      { pkg: { name: 'foo', bin: { foo: 'bloo' } },
        children: [{ pkg: { name: 'bar', bin: { bar: 'noscope' } } }] },
      { pkg: { name: 'nobin' } },
    ],
  })

  const link = new Link({
    parent: root,
    name: 'linkfoo',
    pkg: { bin: { d: 'from-link' } },
    realpath: root.path + '/d/e/f',
  })

  const { resolve: r } = require('node:path')

  t.strictSame(root.binPaths, [])
  t.strictSame(link.binPaths, process.platform === 'win32'
    ? [
      r('/usr/local/lib/d'),
      r('/usr/local/lib/d.cmd'),
      r('/usr/local/lib/d.ps1'),
    ]
    : [
      r('/usr/local/bin/d'),
    ]
  )
  t.strictSame(link.target.binPaths, [])
  const scoped = root.children.get('@foo/bar')
  t.strictSame(scoped.binPaths, process.platform === 'win32'
    ? [
      r('/usr/local/lib/bar'),
      r('/usr/local/lib/bar.cmd'),
      r('/usr/local/lib/bar.ps1'),
    ]
    : [
      r('/usr/local/bin/bar'),
    ]
  )
  const unscoped = root.children.get('foo')
  t.strictSame(unscoped.binPaths, process.platform === 'win32'
    ? [
      r('/usr/local/lib/foo'),
      r('/usr/local/lib/foo.cmd'),
      r('/usr/local/lib/foo.ps1'),
    ]
    : [
      r('/usr/local/bin/foo'),
    ]
  )
  const nested = unscoped.children.get('bar')
  t.strictSame(nested.binPaths, [
    r('/usr/local/lib/node_modules/foo/node_modules/.bin/bar'),
    ...(process.platform !== 'win32' ? [] : [
      r('/usr/local/lib/node_modules/foo/node_modules/.bin/bar.cmd'),
      r('/usr/local/lib/node_modules/foo/node_modules/.bin/bar.ps1'),
    ]),
  ])
  const nobin = root.children.get('nobin')
  t.strictSame(nobin.binPaths, [])
  t.end()
})

t.test('has install script', t => {
  const node = new Node({
    pkg: {},
    path: '/a/b/c',
  })
  t.equal(node.hasInstallScript, false)
  node.package = { scripts: { postinstall: 'hello' } }
  t.equal(node.hasInstallScript, true)
  node.package = { scripts: { nothing: 'of interest' } }
  t.equal(node.hasInstallScript, false)
  node.package = { hasInstallScript: true }
  t.equal(node.hasInstallScript, true)
  t.end()
})

t.test('legacy peer dependencies', t => {
  const root = new Node({
    pkg: {
      name: 'root',
      peerDependencies: {
        foo: '1.x',
      },
    },
    path: '/home/user/projects/root',
    realpath: '/home/user/projects/root',
    legacyPeerDeps: true,
  })

  const foo = new Node({
    pkg: {
      name: 'foo',
      version: '1.2.3',
    },
    path: '/home/user/projects/root/foo',
    realpath: '/home/user/projects/root/foo',
    legacyPeerDeps: true,
    parent: root,
  })

  t.equal(root.children.get('foo'), foo, 'should be a children')
  t.equal(root.edgesOut.size, 0, 'should have no edges out')
  t.end()
})

t.test('set workspaces', t => {
  const root = new Node({
    pkg: { name: 'workspaces_root' },
    path: '/home/user/projects/workspaces_root',
    realpath: '/home/user/projects/workspaces_root',
  })

  const link = new Link({
    parent: root,
    target: new Node({
      path: '/home/user/projects/workspaces_root/foo',
      pkg: {
        name: 'foo',
        version: '1.2.3',
      },
    }),
  })

  const unknown = new Link({
    parent: root,
    target: new Node({
      path: '/home/user/projects/workspaces_root/unknown',
      pkg: {
        name: 'unknown',
        version: '1.2.3',
      },
    }),
  })

  root.workspaces = new Map([
    ['foo', '/home/user/projects/workspaces_root/foo'],
    ['bar', '/home/user/projects/workspaces_root/bar'],
  ])

  t.matchSnapshot(root, 'should setup edges out for each workspace')
  t.equal(link.isWorkspace, true, 'link node reports isWorkspace true')
  t.equal(link.target.isWorkspace, true, 'target reports isWorkspace true')
  t.equal(root.isWorkspace, false, 'root is not a workspace')
  t.equal(unknown.isWorkspace, false, 'unknown node is not a workspace')
  t.end()
})

t.test('get workspaces', t => {
  const root = new Node({
    pkg: { name: 'workspaces_root' },
    path: '/home/user/projects/workspaces_root',
    realpath: '/home/user/projects/workspaces_root',
  })

  t.equal(root.workspaces, null, 'should default to null when no workspaces defined')

  const ws = new Map()
  root.workspaces = ws

  t.equal(root.workspaces, ws, 'should match set value')
  t.end()
})

t.test('replace workspaces', t => {
  const root = new Node({
    pkg: { name: 'workspaces_root' },
    path: '/home/user/projects/workspaces_root',
    realpath: '/home/user/projects/workspaces_root',
  })

  root.workspaces = new Map([
    ['foo', '/home/user/projects/workspaces_root/foo'],
    ['bar', '/home/user/projects/workspaces_root/bar'],
  ])

  const ws = new Map()
  root.workspaces = ws

  t.equal(root.workspaces, ws, 'should remove previously set workspaces')
  t.end()
})

t.test('replace workspaces keeping existing edges out', t => {
  const root = new Node({
    pkg: { name: 'workspaces_root' },
    path: '/home/user/projects/workspaces_root',
    realpath: '/home/user/projects/workspaces_root',
  })

  root.workspaces = new Map([
    ['foo', '/home/user/projects/workspaces_root/foo'],
  ])

  const ws = new Map([
    ['foo', '/home/user/projects/workspaces_root/foo'],
    ['bar', '/home/user/projects/workspaces_root/bar'],
  ])
  root.workspaces = ws

  t.equal(root.workspaces, ws, 'should keep existing edges out')
  t.end()
})

t.test('dont rely on legacy _resolved for file: nodes', async t => {
  const old = new Node({
    pkg: {
      _resolved: 'file:/x/y/z/blorg.tgz',
      _where: '/why/did/i/think/this/was/a/good/idea',
    },
    path: '/some/completely/different/path',
  })
  t.equal(old.resolved, null)

  // _resolved without _where means it's probably valid though
  const notOld = new Node({
    pkg: {
      _resolved: 'file:/x/y/z/blorg.tgz',
    },
    path: '/some/completely/different/path',
  })
  t.equal(normalizePath(notOld.resolved), 'file:/x/y/z/blorg.tgz')
})

t.test('reparenting keeps children in root inventory', async t => {
  const root = new Node({ path: '/some/path' })
  const nested = new Node({
    fsParent: root,
    path: '/some/path/node_modules/parent/node_modules/nested',
  })
  const fsNested = new Node({
    fsParent: nested,
    path: '/some/path/node_modules/parent/node_modules/nested/x',
  })

  const kid = new Node({
    name: 'kid',
    parent: nested,
  })

  t.equal(root.inventory.has(kid), true)
  t.equal(root.inventory.has(fsNested), true)

  // now reparent, and make sure the kids are still accounted for
  const parent = new Node({ name: 'parent', parent: root })
  t.equal(nested.parent, parent)

  t.equal(root.inventory.has(kid), true)
  t.equal(root.inventory.has(fsNested), true)
})

t.test('reloading named edges should refresh edgesIn', t => {
  // pathological dep nesting scenario:
  //
  // x@1 -> y@1
  // x@2 -> y@2
  // y@1 -> x@2
  // y@2 -> x@1
  //
  // ensure we have the correct edge state at all points along this
  // infinite journey.  (will *prevent* said infinite journey in
  // buildIdealTree, but only if we can detect its presence properly
  // with correct Node edge behavior along the way.)
  //
  // Resulting tree looks like:
  //
  // +-- x1
  // +-- y1
  //     +-- x2
  //     +-- y2
  //         +-- x1
  //         +-- y1 ...and so on forever

  const root = new Node({
    path: '/some/path',
    pkg: { dependencies: { x: '1' } },
  })
  t.match(root.edgesOut.get('x'), { spec: '1', missing: true })

  const x1 = new Node({
    pkg: { name: 'x', version: '1.0.0', dependencies: { y: '1' } },
    parent: root,
  })
  t.match(root.edgesOut.get('x'), { spec: '1', invalid: false, to: x1 })
  t.match(x1.edgesOut.get('y'), { spec: '1', missing: true })

  const y1 = new Node({
    pkg: { name: 'y', version: '1.0.0', dependencies: { x: '2' } },
    parent: root,
  })
  t.match(root.edgesOut.get('x'), { spec: '1', invalid: false, to: x1 })
  t.match(x1.edgesOut.get('y'), { spec: '1', invalid: false, to: y1 })
  t.match(y1.edgesOut.get('x'), { spec: '2', invalid: true, to: x1 })

  const y1x2 = new Node({
    pkg: { name: 'x', version: '2.0.0', dependencies: { y: '2' } },
    parent: y1,
  })
  t.match(root.edgesOut.get('x'), { spec: '1', invalid: false, to: x1 })
  t.match(x1.edgesOut.get('y'), { spec: '1', invalid: false, to: y1 })
  t.match(y1.edgesOut.get('x'), { spec: '2', invalid: false, to: y1x2 })
  t.match(y1x2.edgesOut.get('y'), { spec: '2', invalid: true, to: y1 })

  const y1y2 = new Node({
    pkg: { name: 'y', version: '2.0.0', dependencies: { x: '1' } },
    parent: y1,
  })
  t.match(root.edgesOut.get('x'), { spec: '1', invalid: false, to: x1 })
  t.match(x1.edgesOut.get('y'), { spec: '1', invalid: false, to: y1 })
  t.match(y1.edgesOut.get('x'), { spec: '2', invalid: false, to: y1x2 })
  t.match(y1x2.edgesOut.get('y'), { spec: '2', invalid: false, to: y1y2 })
  t.match(y1y2.edgesOut.get('x'), { spec: '1', invalid: true, to: y1x2 })

  const y1y2x1 = new Node({
    pkg: { name: 'x', version: '1.0.0', dependencies: { y: '1' } },
    parent: y1y2,
  })
  t.match(root.edgesOut.get('x'), { spec: '1', invalid: false, to: x1 })
  t.match(x1.edgesOut.get('y'), { spec: '1', invalid: false, to: y1 })
  t.match(y1.edgesOut.get('x'), { spec: '2', invalid: false, to: y1x2 })
  t.match(y1x2.edgesOut.get('y'), { spec: '2', invalid: false, to: y1y2 })
  t.match(y1y2.edgesOut.get('x'), { spec: '1', invalid: false, to: y1y2x1 })
  t.match(y1y2x1.edgesOut.get('y'), { spec: '1', invalid: true, to: y1y2 })

  // this is the point at which can tell for certain it's an infinite cycle
  const y1y2y1 = new Node({
    pkg: { name: 'y', version: '1.0.0', dependencies: { x: '2' } },
    parent: y1y2,
  })
  t.match(root.edgesOut.get('x'), { spec: '1', invalid: false, to: x1 })
  t.match(x1.edgesOut.get('y'), { spec: '1', invalid: false, to: y1 })
  t.match(y1.edgesOut.get('x'), { spec: '2', invalid: false, to: y1x2 })
  t.match(y1x2.edgesOut.get('y'), { spec: '2', invalid: false, to: y1y2 })
  t.match(y1y2.edgesOut.get('x'), { spec: '1', invalid: false, to: y1y2x1 })
  t.match(y1y2x1.edgesOut.get('y'), { spec: '1', invalid: false, to: y1y2y1 })
  t.match(y1y2y1.edgesOut.get('x'), { spec: '2', invalid: true, to: y1y2x1 })

  t.end()
})

t.test('detect that two nodes are the same thing', async t => {
  const check = (a, b, expect, message) => {
    t.equal(a.matches(b), expect, message)
    if (a !== b) {
      t.equal(b.matches(a), expect, message)
    }
  }

  {
    const a = new Node({ path: '/x' })
    check(a, a, true, 'same object is trivially matching')
  }

  {
    const p = new Node({ path: '/foo' })
    const a = new Node({ name: 'a', parent: p, integrity: 'sha512-xyz' })
    const b = new Node({ name: 'b', parent: p, integrity: 'sha512-xyz' })
    check(a, b, false, 'different names mean no match')
  }

  {
    const root = new Node({ path: '/root' })
    const target = new Node({ root, path: '/foo', pkg: { name: 'x', version: '1.2.3' } })
    const a = new Link({ root, path: '/a/x', target })
    const b = new Link({ root, path: '/b/x', target })
    check(a, b, true, 'links match if targets match')
  }

  {
    const a = new Node({ path: '/foo', pkg: { name: 'x', version: '1.2.3' } })
    const b = new Node({ path: '/foo', pkg: { name: 'x', version: '1.2.3' } })
    check(a, b, true, 'root nodes match if paths patch')
  }

  {
    const a = new Node({ path: '/a/x', pkg: { name: 'x', version: '1.2.3' } })
    const b = new Node({ path: '/b/x', pkg: { name: 'x', version: '1.2.3' } })
    check(a, b, false, 'root nodes do not match if paths differ')
  }

  {
    const root = new Node({ path: '/x' })
    const integrity = 'sha512-xyzabc'
    const a = new Node({ parent: root, name: 'x', integrity })
    const b = new Node({ parent: a, name: 'x', integrity })
    t.equal(a.integrity, integrity, 'integrity was set')
    t.equal(a.integrity, b.integrity, 'integrities match')
    check(a, b, true, 'same integrity means same thing')
  }

  {
    const root = new Node({ path: '/x' })
    const inta = 'sha512-xyzabc'
    const intb = 'sha512-foobar'
    const pkg = { name: 'x', version: '1.2.3' }
    const resolved = 'https://registry.npmjs.org/x/-/x-1.2.3.tgz'
    const a = new Node({ parent: root, pkg, integrity: inta, resolved })
    const b = new Node({ parent: a, pkg, integrity: intb, resolved })
    t.equal(a.integrity, inta, 'integrity a was set')
    t.equal(b.integrity, intb, 'integrity b was set')
    check(a, b, false, 'different integrity means different thing')
  }

  {
    const root = new Node({ path: '/x' })
    const resolved = 'https://registry.npmjs.org/x/-/x-1.2.3.tgz'
    const pkga = { name: 'x', version: '1.2.3-a' }
    const pkgb = { name: 'x', version: '1.2.3-b' }
    const a = new Node({ parent: root, pkg: pkga, resolved })
    const b = new Node({ parent: a, pkg: pkgb, resolved })
    check(a, b, true, 'same resolved means same thing, if no integrity')
  }

  {
    const root = new Node({ path: '/x' })
    const pkga = { name: 'x', version: '1.2.3' }
    const pkgb = { name: 'x', version: '1.2.3' }
    const a = new Node({ parent: root, pkg: pkga })
    const b = new Node({ parent: a, pkg: pkgb })
    check(a, b, true, 'name/version match, if no resolved/integrity')
  }

  {
    const root = new Node({ path: '/x' })
    const pkga = { name: 'x', version: '1.2.3-a' }
    const pkgb = { name: 'x', version: '1.2.3-b' }
    const a = new Node({ parent: root, pkg: pkga })
    const b = new Node({ parent: a, pkg: pkgb })
    check(a, b, false, 'name/version mismatch, if no resolved/integrity')
  }
})

t.test('node.satisfies(requested)', t => {
  const node = new Node({
    path: '/some/path/to/foo',
    resolved: 'https://registry.npmjs.org/foo/-/foo-1.2.3.tgz',
    pkg: {
      name: 'foo',
      version: '1.2.3',
    },
  })
  t.equal(node.satisfies('foo'), true)
  t.equal(node.satisfies('foo@1'), true)
  t.equal(node.satisfies('https://registry.npmjs.org/foo/-/foo-1.2.3.tgz'), true)
  t.equal(node.satisfies('foo@2'), false)
  t.equal(node.satisfies('bar'), false)
  t.equal(node.satisfies('https://registry.npmjs.org/foo/-/foo-1.2.5.tgz'), false)
  node.resolved = 'git+ssh://git@github.com/org/foo.git#decafbad1100facefaceface'
  t.equal(node.satisfies('https://registry.npmjs.org/foo/-/foo-1.2.3.tgz'), false)
  t.equal(node.satisfies('org/foo'), true)
  t.equal(node.satisfies('github:org/foo'), true)
  t.end()
})

t.test('node.pkgid', t => {
  const parent = new Node({ path: '/some/path' })
  t.equal(parent.pkgid, 'path@')

  parent.package = { name: 'parent' }
  t.equal(parent.pkgid, 'parent@')

  parent.package = { name: 'parent', version: '1.2.3' }
  t.equal(parent.pkgid, 'parent@1.2.3')

  const n = new Node({ path: '/some/path/node_modules/foo', parent })
  t.equal(n.pkgid, 'foo@')

  n.package = { name: 'foo', version: '1.2.3' }
  t.equal(n.pkgid, 'foo@1.2.3')

  n.package = { name: 'bar', version: '1.2.3' }
  t.equal(n.pkgid, 'foo@npm:bar@1.2.3')

  t.end()
})

t.test('node.version', t => {
  const n = new Node({ path: '/some/path' })
  t.equal(n.version, '')
  n.package.version = '1.2.3'
  t.equal(n.version, '1.2.3')
  t.end()
})

t.test('explain yourself', t => {
  const n = new Node({ path: '/some/path',
    pkg: {
      dependencies: { x: '1', y: '2' },
    } })
  t.strictSame(normalizePaths(n.explain()), { location: '/some/path' })
  t.equal(n.explain(), n.explain(), 'caches result')
  const x = new Node({ parent: n, pkg: { name: 'x', version: '1.2.3' } })
  t.strictSame(x.explain(), {
    name: 'x',
    version: '1.2.3',
    location: 'node_modules/x',
    isWorkspace: false,
    dependents: [{ name: 'x', type: 'prod', spec: '1', from: n.explain() }],
  })

  const virtual = new Node({
    path: '/virtual-root',
    sourceReference: x,
  })

  t.equal(virtual.explain(), x.explain())
  const y = new Node({
    parent: n,
    pkg: { name: 'y', version: '2.3.4', dependencies: { z: '3' } },
    children: [
      { pkg: { name: 'z', version: '3.4.5', dependencies: { a: '4' } },
        children: [
          { pkg: { name: 'a', version: '4.5.6', dependencies: {} } },
        ],
      },
    ],
  })

  const z = y.children.get('z')
  const a = z.children.get('a')

  t.strictSame(y.explain(), {
    name: 'y',
    version: '2.3.4',
    location: 'node_modules/y',
    isWorkspace: false,
    dependents: [
      {
        type: 'prod',
        name: 'y',
        spec: '2',
        from: n.explain(),
      },
    ],
  })

  t.strictSame(z.explain(), {
    name: 'z',
    version: '3.4.5',
    location: 'node_modules/y/node_modules/z',
    isWorkspace: false,
    dependents: [
      {
        type: 'prod',
        name: 'z',
        spec: '3',
        from: y.explain(),
      },
    ],
  })

  t.strictSame(a.explain(), {
    name: 'a',
    version: '4.5.6',
    location: 'node_modules/y/node_modules/z/node_modules/a',
    isWorkspace: false,
    dependents: [
      {
        type: 'prod',
        name: 'a',
        spec: '4',
        from: z.explain(),
      },
    ],
  })

  // ignore invalid edgesIn except from root node
  y.package = {
    ...y.package,
    dependencies: {
      ...y.package.dependencies,
      b: '1.2.3',
    },
  }
  a.package = {
    ...a.package,
    dependencies: {
      ...a.package.dependencies,
      b: '1.2.3',
    },
  }
  const b = new Node({
    parent: n,
    pkg: { name: 'b', version: '9.9.9' },
  })
  t.strictSame(b.explain(), {
    name: 'b',
    version: '9.9.9',
    location: 'node_modules/b',
    isWorkspace: false,
    dependents: [],
  })
  b.package = { ...b.package }
  n.package = {
    ...n.package,
    dependencies: {
      ...n.package.dependencies,
      b: '1.2.3',
    },
  }
  t.strictSame(b.explain(), {
    name: 'b',
    version: '9.9.9',
    location: 'node_modules/b',
    isWorkspace: false,
    dependents: [{ type: 'prod', name: 'b', spec: '1.2.3', error: 'INVALID', from: n.explain() }],
  })

  // explain with a given edge
  b.package = { ...b.package }
  const otherNode = new Node({
    pkg: {
      ...n.package,
      dependencies: {
        ...n.package.dependencies,
        b: '9',
      },
    },
    path: '/virtual-root',
    children: [{ pkg: { ...b.package } }],
  })

  // explain a node with respect to a specific hypothetical edge
  t.strictSame(normalizePaths(b.explain(otherNode.edgesOut.get('b'))), {
    name: 'b',
    version: '9.9.9',
    location: 'node_modules/b',
    isWorkspace: false,
    dependents: [
      {
        type: 'prod',
        name: 'b',
        spec: '9',
        from: { location: '/virtual-root' },
      },
    ],
  })

  // don't get tripped up by cycles
  const cycle = new Node({
    path: '/cy/cle',
    pkg: { name: 'cycle-root', dependencies: { c: '1' } },
    children: [
      { pkg: { name: 'a', version: '1.1.1', dependencies: { b: '1' } } },
      { pkg: { name: 'b', version: '1.1.1', dependencies: { a: '1' } } },
      { pkg: { name: 'c', version: '1.1.1', dependencies: { a: '1' } } },
    ],
  })

  t.strictSame(normalizePaths(cycle.children.get('b').explain()), {
    name: 'b',
    version: '1.1.1',
    location: 'node_modules/b',
    isWorkspace: false,
    dependents: [
      {
        type: 'prod',
        name: 'b',
        spec: '1',
        from: {
          name: 'a',
          version: '1.1.1',
          location: 'node_modules/a',
          isWorkspace: false,
          dependents: [
            {
              type: 'prod',
              name: 'a',
              spec: '1',
              from: {
                name: 'b',
                version: '1.1.1',
                // doesn't keep adding "from" links here.
              },
            },
            {
              type: 'prod',
              name: 'a',
              spec: '1',
              from: {
                name: 'c',
                version: '1.1.1',
                location: 'node_modules/c',
                isWorkspace: false,
                dependents: [
                  {
                    type: 'prod',
                    name: 'c',
                    spec: '1',
                    from: {
                      location: '/cy/cle',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  })

  {
    // treat a source reference by explaining the thing it's standing in for
    const actual = new Node({
      path: '/project',
      pkg: { dependencies: { a: '1' } },
      children: [
        { pkg: { name: 'a', version: '1.2.3', dependencies: { b: '1' } } },
        { pkg: { name: 'b', version: '1.2.3', dependencies: { c: '1', d: '1' } } },
      ],
    }).children.get('b')
    const virtual = new Node({
      path: '/virtual-root',
      pkg: { ...actual.package },
      sourceReference: actual,
      children: [
        { pkg: { name: 'c', version: '1.2.3', dependencies: { d: '1' } } },
        { pkg: { name: 'd', version: '1.2.3' } },
      ],
    })

    const edge = virtual.children.get('c').edgesOut.get('d')
    t.strictSame(normalizePaths(virtual.children.get('d').explain(edge)), {
      name: 'd',
      version: '1.2.3',
      whileInstalling: {
        name: 'b',
        version: '1.2.3',
        path: '/project/node_modules/b',
      },
      location: 'node_modules/d',
      isWorkspace: false,
      dependents: [
        {
          type: 'prod',
          name: 'd',
          spec: '1',
          from: {
            name: 'c',
            version: '1.2.3',
            whileInstalling: {
              name: 'b',
              version: '1.2.3',
              path: '/project/node_modules/b',
            },
            location: 'node_modules/c',
            isWorkspace: false,
            dependents: [
              {
                type: 'prod',
                name: 'c',
                spec: '1',
                from: {
                  name: 'b',
                  version: '1.2.3',
                  location: 'node_modules/b',
                  isWorkspace: false,
                  dependents: [
                    {
                      type: 'prod',
                      name: 'b',
                      spec: '1',
                      from: {
                        name: 'a',
                        version: '1.2.3',
                        location: 'node_modules/a',
                        isWorkspace: false,
                        dependents: [
                          {
                            type: 'prod',
                            name: 'a',
                            spec: '1',
                            from: {
                              location: '/project',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    })
  }

  // explain with errors
  const badParent = new Node({ path: '/bad/nodes' })
  const errNode = new Node({
    error: new Error('bad node'),
    pkg: { name: 'bad', version: 'node' },
    parent: badParent,
  })
  t.match(errNode.explain(), {
    errors: [{ message: 'bad node' }],
    name: 'bad',
    version: 'node',
    package: { name: 'bad', version: 'node' },
  })
  const noPkgDep = new Node({
    pkg: { noname: 'bad', noversion: 'node' },
    parent: badParent,
    path: '/bad/nodes/node_modules/noname',
  })
  t.match(noPkgDep.explain(), {
    errors: [{ message: 'invalid package: lacks name and/or version' }],
    package: { noname: 'bad', noversion: 'node' },
  })

  // workspaces
  const workspacesRoot = new Node({
    path: '/some/path',
    pkg: {
      name: 'project-root',
      version: '1.0.0',
      workspaces: ['a'],
    },
  })
  const workspacesMap = new Map(
    [['a', '/some/path/a']]
  )
  const ws = new Node({
    root: workspacesRoot,
    path: '/some/path/a',
    pkg: { name: 'a', version: '1.0.0' },
  })
  new Link({
    name: 'a',
    parent: workspacesRoot,
    target: ws,
  })
  workspacesRoot.workspaces = workspacesMap
  t.strictSame(
    normalizePaths(ws.explain()),
    {
      name: 'a',
      version: '1.0.0',
      location: 'a',
      isWorkspace: true,
      dependents: [],
      linksIn: [
        {
          name: 'a',
          version: '1.0.0',
          location: 'node_modules/a',
          isWorkspace: true,
          dependents: [
            {
              type: 'workspace',
              name: 'a',
              spec: 'file:/some/path/a',
              from: { location: '/some/path' },
            },
          ],
        },
      ],
    },
    'should have workspaces properly set up'
  )
  t.end()
})

t.test('guard against setting package to something improper', t => {
  // no pkg
  const n = new Node({ path: '/some/path' })
  t.strictSame(n.package, {})
  // falsey pkg
  const o = new Node({ path: '/some/path', pkg: null })
  t.strictSame(o.package, {})
  // non-object pkg
  const p = new Node({ path: '/some/path', pkg: 'hello' })
  t.strictSame(p.package, {})

  // this will throw if we hit the debug, but it'll be an object regardless
  try {
    p.package = 'this is not an object'
  } catch (er) {
    t.match(er, { message: 'setting Node.package to non-object' })
  } finally {
    t.strictSame(p.package, {})
  }
  t.end()
})

t.test('clear inventory when changing root', t => {
  const r1 = new Node({ path: '/root1' })
  const r2 = new Node({ path: '/root1/root2',
    children: [
      { pkg: { name: 'foo', version: '1.2.3' } },
    ] })
  const r3 = new Node({ path: '/root1/root3' })
  // child3 gets munged together with the foo module in root2,
  // because the paths are the same
  const child3 = new Node({ path: '/root1/root2/node_modules/foo',
    pkg: { name: 'foo', version: '1.2.3' },
    root: r3,
  })
  const child = r2.children.get('foo')
  t.equal(r1.inventory.size, 1)
  t.equal(r2.inventory.size, 2)
  t.equal(r1.inventory.has(child), false)
  t.equal(r2.inventory.has(child), true)
  r2.root = r1
  t.equal(r1.inventory.size, 3)
  t.equal(r2.inventory.size, 0)
  t.equal(r1.inventory.has(child), true)
  t.equal(r2.inventory.has(child), false)
  t.equal(r3.inventory.size, 2)
  r3.root = r1
  t.equal(r1.inventory.size, 4)
  t.equal(r3.inventory.size, 0)
  t.equal(r1.inventory.has(child3), true)
  t.equal(child3.root, r1)
  t.end()
})

t.test('create a node that doesnt get added to a root until later', t => {
  const root = new Node({ path: '/path/to/root' })
  const foo = new Node({ name: 'foo' })
  t.equal(foo.root, foo, 'other is self-rooted at first')
  t.equal(foo.path, null, 'foo has null path')
  foo.parent = root
  t.equal(foo.root, root, 'foo is rooted on root after parent assignment')
  t.equal(normalizePath(foo.path), normalizePath('/path/to/root/node_modules/foo'), 'foo has updated path')
  t.end()
})

t.test('changing path to a node_modules folder sets name if necessary', t => {
  const node = new Node({
    path: '/some/random/path',
  })
  t.equal(node.name, 'path')
  const _changePath = Symbol.for('_changePath')
  node[_changePath]('/path/to/node_modules/foo')
  t.equal(node.name, 'foo')
  node[_changePath]('/path/to/node_modules/foo/node_modules/bar')
  t.equal(node.name, 'bar')
  node[_changePath]('/path/to/node_modules/foo/node_modules/@bar/baz/node_modules')
  t.equal(node.name, 'bar')
  node[_changePath]('/path/to/node_modules/foo/node_modules/@bar/baz')
  t.equal(node.name, '@bar/baz')
  t.end()
})

t.test('printable Node', t => {
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
  t.end()
})

t.test('isProjectRoot shows if the node is the root link target', async t => {
  const link = new Link({
    path: '/link',
    realpath: '/actual',
  })
  const n = new Node({ path: '/actual', root: link })
  t.equal(n.isProjectRoot, true)
  t.equal(link.isProjectRoot, true)
  t.equal(link.isRoot, true)
  t.equal(n.isRoot, false)
})

t.test('virtual references to root node has devDep edges', async t => {
  const root = new Node({
    path: '/some/project/path',
    pkg: {
      devDependencies: {
        a: '1',
      },
    },
  })
  const virtualRoot = new Node({
    path: '/virtual-root',
    sourceReference: root,
  })
  t.equal(virtualRoot.edgesOut.get('a').type, 'dev')
})

t.test('globaTop set for children of global link root target', async t => {
  const root = new Link({
    path: '/usr/local/lib',
    realpath: '/data/lib',
    global: true,
  })
  root.target = new Node({
    path: '/data/lib',
    global: true,
    root,
  })
  const gtop = new Node({
    parent: root.target,
    pkg: { name: 'foo', version: '1.2.3' },
  })
  t.equal(gtop.globalTop, true)
})

t.test('duplicated dependencies', t => {
  // the specific logic here is justifiable at all steps, but gets weird
  // in the "specified in all three" case, even though that's the logical
  // outcome of the other rules.  at least we have a test showing what
  // actually happens.

  t.test('prefer prod over peer', async t => {
    const n = new Node({
      path: '/path/to/project',
      pkg: {
        dependencies: {
          foo: '1.x',
        },
        peerDependencies: {
          foo: '>=1',
        },
      },
    })
    t.match(n.edgesOut.get('foo'), { type: 'prod', spec: '1.x' })
  })

  t.test('prefer dev over peer', async t => {
    const n = new Node({
      path: '/path/to/project',
      pkg: {
        devDependencies: {
          foo: '1.x',
        },
        peerDependencies: {
          foo: '>=1',
        },
      },
    })
    t.match(n.edgesOut.get('foo'), { type: 'dev', spec: '1.x' })
  })

  t.test('prefer prod over dev', async t => {
    const n = new Node({
      path: '/path/to/project',
      pkg: {
        devDependencies: {
          foo: '1.x',
        },
        dependencies: {
          foo: '>=1',
        },
      },
    })
    t.match(n.edgesOut.get('foo'), { type: 'dev', spec: '1.x' })
  })

  t.test('if in all three, use dev', async t => {
    const n = new Node({
      path: '/path/to/project',
      pkg: {
        devDependencies: {
          foo: '1.x',
        },
        dependencies: {
          foo: '2',
        },
        peerDependencies: {
          foo: '>=1',
        },
      },
    })
    t.match(n.edgesOut.get('foo'), { type: 'dev', spec: '1.x' })
  })

  t.test('prefer workspace version', async t => {
    const root = new Node({
      pkg: { name: 'workspaces_root' },
      path: '/home/user/projects/workspaces_root',
      realpath: '/home/user/projects/workspaces_root',
    })

    root.workspaces = new Map([
      ['foo', '/home/user/projects/workspaces_root/foo'],
    ])

    root.package = { name: 'bar', version: '1.2.3', dependencies: { foo: '2.3.4' } }
    t.equal(root.edgesOut.get('foo').type, 'workspace', 'keeps workspace edge')
  })

  t.end()
})

t.test('canDedupe()', t => {
  /*
  root
  +-- a@1.2.3
  +-- b@2.3.4
  |   +-- a@1.9.9 (removable only if preferDedupe)
  |   +-- c@2.3.4
  |   |   +-- a 2.3.99
  |   |       +-- e 2.0.1 (removable, older version)
  |   +-- d 3.4.5
  |   |   +-- a 3.4.5
  |   +-- e 2.3.4
  +-- bundler 1.2.3
  |   +-- a 1.2.3 (not removable, in bundle)
  +-- c 3.4.5
  |   +-- a 1.2.3 (removable, matches)
  +-- extraneous 1.2.3
  +-- wrapper
      +-- a 1.2.3 (not removable, in shrinkwrap)
  */

  const root = new Node({
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

  const canDedupeLocs = [...root.inventory.filter(n => n.canDedupe())]
    .map(n => n.location)
  t.match(canDedupeLocs, [
    'node_modules/c/node_modules/a',
    'node_modules/b/node_modules/e',
    'node_modules/b/node_modules/c/node_modules/a/node_modules/e',
  ], 'preferDedupe=false')

  const canDedupeTrueLocs = [...root.inventory.filter(n => n.canDedupe(true))]
    .map(n => n.location)
  t.match(canDedupeTrueLocs, [
    'node_modules/c/node_modules/a',
    // this is the one that's only deduped if we preferDedupe
    'node_modules/b/node_modules/a',
    'node_modules/b/node_modules/e',
    'node_modules/b/node_modules/c/node_modules/a/node_modules/e',
  ], 'preferDedupe=true')

  // canDedupe also handles fsChildren properly
  const top = new Node({
    fsParent: root,
    path: root.path + '/packages/top',
    pkg: {
      name: 'top',
      version: '1.2.3',
      dependencies: {
        a: '1',
      },
    },
    children: [
      { pkg: { name: 'a', version: '1.0.0' } },
    ],
  })

  t.equal(top.children.get('a').canDedupe(), true)

  // check fsTop and isDescendantOf
  t.equal(top.isDescendantOf(root), true)
  t.equal(top.isFsTop, false)
  t.equal(top.fsTop, root)
  t.equal(top.children.get('a').isFsTop, true)

  t.end()
})

t.test('packageName getter', t => {
  const node = new Node({
    pkg: { name: 'foo' },
    path: '/path/to/bar',
  })
  t.equal(node.name, 'bar')
  t.equal(node.packageName, 'foo')
  t.end()
})

t.test('node at / should not have fsParent', t => {
  const root = new Node({ path: '/some/path' })
  const link = new Link({
    parent: root,
    name: 'link',
    realpath: '/',
  })
  t.equal(link.target.fsParent, null)
  t.end()
})

t.test('node.ancestry iterator', t => {
  const root = new Node({
    path: '/some/path',
    pkg: { name: 'root', version: '1.2.3' },
    children: [{
      pkg: { name: 'a', version: '1.2.3' },
      children: [{
        pkg: { name: 'b', version: '1.2.3' },
        children: [{
          pkg: { name: 'c', version: '1.2.3' },
        }],
      }],
    }],
  })
  const c = root.children.get('a').children.get('b').children.get('c')
  const d = new Node({
    root,
    path: c.path + '/d',
    pkg: { name: 'd', version: '1.2.3' },
    children: [{
      pkg: { name: 'e', version: '1.2.3' },
      children: [{
        pkg: { name: 'f', version: '1.2.3' },
        children: [{
          pkg: { name: 'g', version: '1.2.3' },
        }],
      }],
    }],
  })
  const g = d.children.get('e').children.get('f').children.get('g')

  const ancestry = [...g.ancestry()].map(n => n.packageName)
  t.strictSame(ancestry, ['g', 'f', 'e', 'd', 'c', 'b', 'a', 'root'])
  t.end()
})

t.test('canReplaceWith is always false when packageName does not match', t => {
  const root = new Node({
    path: '/some/path',
    pkg: {
      dependencies: {
        foo: '1.2.3',
        alias: 'npm:bar@1.2.3',
      },
    },
    children: [
      { pkg: { name: 'foo', version: '1.2.3' } },
      { name: 'alias', pkg: { name: 'bar', version: '1.2.3' } },
    ],
  })
  const rep = new Node({
    path: '/some/path/node_modules/foo',
    name: 'foo',
    pkg: {
      name: 'bar',
      version: '1.2.3',
    },
  })
  t.equal(rep.canReplace(root.children.get('foo')), false,
    'cannot replace actual node with an alias')
  const alias = new Node({
    path: '/some/path/node_modules/alias',
    name: 'alias',
    pkg: {
      name: 'bar',
      version: '1.2.3',
    },
  })
  t.equal(alias.canReplace(root.children.get('alias')), true,
    'can replace alias with a different alias to same thing')
  t.end()
})

t.test('canReplace while ignoring certain peer deps', t => {
  const tree = new Node({
    path: '/some/path',
    pkg: { dependencies: { a: '1||2', b: '' } },
    children: [
      { pkg: { name: 'a', version: '1.0.0', peerDependencies: { b: '1' } } },
      { pkg: { name: 'b', version: '1.0.0', peerDependencies: { a: '1' } } },
    ],
  })
  const current = tree.children.get('a')
  const rep = new Node({
    path: current.path,
    pkg: { name: 'a', version: '2.0.0' },
  })
  t.equal(rep.canReplace(current), false, 'cannot replace because peer dep')
  t.equal(rep.canReplace(current, ['b']), true,
    'can replace if ignoring the `b` peer')

  t.end()
})

t.test('children are unicode-normalizing and case-insensitive', t => {
  const cafe1 = Buffer.from([0x63, 0x61, 0x66, 0x65, 0xcc, 0x81]).toString()
  const cafe2 = Buffer.from([0x63, 0x61, 0x66, 0xc3, 0xa9]).toString()
  const tree = new Node({
    path: '/some/path',
    children: [
      { pkg: { name: 'A', version: '1.0.0' } },
      { pkg: { name: 'a', version: '2.0.0' } },
      { pkg: { name: cafe1, version: '1.0.0' } },
      { pkg: { name: cafe2, version: '2.0.0' } },
    ],
  })
  t.equal(tree.children.size, 2)
  t.equal(tree.children.get('A'), tree.children.get('a'))
  t.match(tree.children.get('a'), {
    version: '2.0.0',
    packageName: 'a',
    name: 'a',
  })
  t.equal(tree.children.get(cafe1), tree.children.get(cafe2))
  t.match(tree.children.get(cafe1), {
    version: '2.0.0',
    packageName: cafe2,
    name: cafe2,
  })
  t.end()
})

t.test('children of the global root are considered tops', t => {
  const tree = new Node({
    path: '/usr/local/lib',
    global: true,
    children: [
      {
        pkg: { name: 'foo', version: '1.2.3' },
        children: [{ pkg: { name: 'bar', version: '1.2.3' } }],
      },
    ],
  })
  const foo = tree.children.get('foo')
  const bar = foo.children.get('bar')
  t.equal(foo.isTop, true)
  t.equal(foo.top, foo)
  t.equal(bar.top, foo)
  t.end()
})

t.test('overrides', (t) => {
  t.test('skips loading when no overrides are provided', (t) => {
    const tree = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
      },
    })
    t.equal(tree.overrides, undefined, 'overrides is undefined')
    t.end()
  })

  t.test('skips loading when overrides are empty', (t) => {
    const tree = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        overrides: {},
      },
    })
    t.equal(tree.overrides, undefined, 'overrides is undefined')
    t.end()
  })

  t.test('loads overrides', (t) => {
    const tree = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '^1',
        },
        overrides: {
          bar: { '.': '2.0.0' },
        },
      },
    })
    t.ok(tree.overrides, 'overrides is defined')
    t.end()
  })

  t.test('node.overridden is true when an override applies to a specific node', async (t) => {
    const tree = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '^1',
        },
        overrides: {
          baz: '1.0.0',
        },
      },
      children: [{
        name: 'bar',
        version: '1.0.0',
        pkg: {
          dependencies: {
            baz: '2.0.0',
          },
        },
        children: [{
          name: 'baz',
          version: '1.0.0',
          pkg: {
            dependencies: {
              buzz: '1.0.0',
            },
          },
          children: [{
            name: 'buzz',
            version: '1.0.0',
            pkg: {},
          }],
        }],
      }],
    })

    const bar = tree.edgesOut.get('bar').to
    t.not(bar.overridden, 'bar was not overridden')
    const baz = bar.edgesOut.get('baz').to
    t.ok(baz.overridden, 'baz was overridden')
    const buzz = baz.edgesOut.get('buzz').to
    t.not(buzz.overridden, 'buzz was not overridden')
  })

  t.test('assertRootOverrides throws when a dependency and override conflict', async (t) => {
    const conflictingTree = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '1.x',
        },
        overrides: {
          bar: '2.x',
        },
      },
      children: [
        { pkg: { name: 'bar', version: '1.x' } },
      ],
    })

    t.throws(() => conflictingTree.assertRootOverrides(), { code: 'EOVERRIDE' }, 'throws EOVERRIDE')

    const conflictingChild = conflictingTree.children.get('bar')
    t.doesNotThrow(() => conflictingChild.assertRootOverrides(), 'child does not throw')

    const safeTree = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '1.x',
        },
        overrides: {
          baz: '2.x',
        },
      },
      children: [
        { pkg: { name: 'bar', version: '1.x' } },
      ],
    })

    t.doesNotThrow(() => safeTree.assertRootOverrides(), 'non conflicting tree does not throw')
  })

  t.test('overrides propagate to children and edges', (t) => {
    const tree = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '^1',
        },
        overrides: {
          bar: { '.': '2.0.0' },
        },
      },
      children: [
        { pkg: { name: 'bar', version: '1.0.0' } },
      ],
    })

    t.ok(tree.overrides, 'overrides is defined on root')
    t.ok(tree.edgesOut.get('bar').overrides, 'overrides is defined on edgeOut')
    t.ok(tree.children.get('bar').overrides, 'overrides is defined on child')
    t.end()
  })

  t.test('setting root replaces overrides', async (t) => {
    const root = new Node({
      path: '/some/path',
      loadOverrides: true,
      pkg: {
        name: 'root',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
        },
        overrides: {
          bar: '^2.0.0',
        },
      },
    })

    const foo = new Node({
      path: '/some/path/node_modules/foo',
      pkg: {
        name: 'foo',
        version: '1.0.0',
        dependencies: {
          bar: '^1.0.0',
        },
      },
    })

    const bar = new Node({
      path: '/some/path/node_modules/bar',
      pkg: {
        name: 'bar',
        version: '2.0.0',
      },
    })

    t.ok(root.overrides, 'root has overrides')
    t.notOk(foo.overrides, 'foo does not have overrides')
    t.notOk(bar.overrides, 'bar does not have overrides')
    t.notOk(root.edgesOut.get('foo').valid, 'foo edge is not valid')
    t.notOk(foo.edgesOut.get('bar').valid, 'bar edge is not valid')

    // we add bar to the root first, this is deliberate so that we don't have a simple
    // linear inheritance. we'll add foo later and make sure that both edges and nodes
    // become valid after that

    bar.root = root
    t.ok(bar.overrides, 'bar now has overrides')
    t.notOk(foo.edgesOut.get('bar').valid, 'bar edge is not valid yet')

    foo.root = root
    t.ok(foo.overrides, 'foo now has overrides')
    t.ok(root.edgesOut.get('foo').valid, 'foo edge is now valid')
    t.ok(bar.overrides, 'bar still has overrides')
    t.ok(foo.edgesOut.get('bar').valid, 'bar edge is now valid')
  })

  t.test('canReplaceWith requires the same overrides', async (t) => {
    const original = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '^1',
        },
        overrides: {
          bar: { '.': '2.0.0' },
        },
      },
      children: [
        { pkg: { name: 'bar', version: '1.0.0' } },
      ],
    })

    const badReplacement = new Node({
      loadOverrides: true,
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '^1',
        },
        overrides: {
          bar: { '.': '2.0.0' },
        },
      },
      children: [
        { pkg: { name: 'bar', version: '1.0.0' } },
      ],
    })

    t.equal(original.canReplaceWith(badReplacement), false, 'different overrides fails')

    const goodReplacement = new Node({
      path: '/some/path',
      pkg: {
        name: 'foo',
        dependencies: {
          bar: '^1',
        },
        overrides: {
          bar: { '.': '2.0.0' },
        },
      },
      children: [
        { pkg: { name: 'bar', version: '1.0.0' } },
      ],
    })

    t.equal(original.canReplaceWith(goodReplacement), false, 'no overrides fails')

    goodReplacement.overrides = original.overrides
    t.equal(original.canReplaceWith(goodReplacement), true, 'same overrides passes')
  })

  t.end()
})

t.test('node with no edges in is not a registry dep', async t => {
  const node = new Node({ path: '/foo' })
  t.equal(node.isRegistryDependency, false)
})

t.test('node with non registry edge in is not a registry dep', async t => {
  const root = new Node({ path: '/some/path', pkg: { dependencies: { registry: '', tar: '' } } })
  const node = new Node({ pkg: { name: 'node', version: '1.0.0' }, parent: root })

  new Node({ pkg: { name: 'registry', dependencies: { node: '^1.0.0' } }, parent: root })
  new Node({ pkg: { name: 'tar', dependencies: { node: 'file:node' } }, parent: root })

  t.equal(node.isRegistryDependency, false)
})

t.test('node with only registry edges in a registry dep', async t => {
  const root = new Node({ path: '/some/path', pkg: { dependencies: { registry: '', tar: '' } } })
  const node = new Node({ pkg: { name: 'node', version: '1.0.0' }, parent: root })
  new Node({ pkg: { name: 'registry', dependencies: { node: '^1.0.0' } }, parent: root })

  t.equal(node.isRegistryDependency, true)
})
