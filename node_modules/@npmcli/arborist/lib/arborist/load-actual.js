// mix-in implementing the loadActual method

const {dirname, resolve, join} = require('path')

const rpj = require('read-package-json-fast')
const {promisify} = require('util')
const readdir = promisify(require('readdir-scoped-modules'))

const Shrinkwrap = require('../shrinkwrap.js')
const calcDepFlags = require('../calc-dep-flags.js')
const Node = require('../node.js')
const Link = require('../link.js')
const realpath = require('../realpath.js')

const loadFSNode = Symbol('loadFSNode')
const newNode = Symbol('newNode')
const newLink = Symbol('newLink')
const loadFSTree = Symbol('loadFSTree')
const loadFSChildren = Symbol('loadFSChildren')
const findFSParents = Symbol('findFSParents')

const _actualTreeLoaded = Symbol('actualTreeLoaded')
const _rpcache = Symbol('realpathCache')
const _stcache = Symbol('statCache')
const _linkTargets = Symbol('linkTargets')
const _cache = Symbol('nodeLoadingCache')
const _loadActualVirtually = Symbol('loadActualVirtually')
const _loadActualActually = Symbol('loadActualActually')

module.exports = cls => class ActualLoader extends cls {
  constructor (options) {
    super(options)

    // the tree of nodes on disk
    this.actualTree = options.actualTree

    // ensure when walking the tree that we don't call loadTree on the
    // same actual node more than one time.
    this[_actualTreeLoaded] = null

    // caches for cached realpath calls
    const cwd = process.cwd()
    // assume that the cwd is real enough for our purposes
    this[_rpcache] = new Map([[ cwd, cwd ]])
    this[_stcache] = new Map()

    // cache of nodes when loading the actualTree, so that we avoid
    // loaded the same node multiple times when symlinks attack.
    this[_cache] = new Map()

    // cache of link targets for setting fsParent links
    // We don't do fsParent as a magic getter/setter, because
    // it'd be too costly to keep up to date along the walk.
    // And, we know that it can ONLY be relevant when the node
    // is a target of a link, otherwise it'd be in a node_modules
    // folder, so take advantage of that to limit the scans later.
    this[_linkTargets] = new Set()
  }

  // public method
  loadActual () {
    // mostly realpath to throw if the root doesn't exist
    if (this.actualTree)
      return Promise.resolve(this.actualTree)

    return realpath(this.path, this[_rpcache], this[_stcache])
      .then(real => this[loadFSNode]({ path: this.path, real }))
      .then(node => {
        // XXX only rely on this if the hidden lockfile is the newest thing?
        // need some kind of heuristic, like if the package.json or sw have
        // been touched more recently, then ignore it?  This is a hazard if
        // user switches back and forth between Arborist and another way of
        // mutating the node_modules folder.
        this.actualTree = node
        return Shrinkwrap.load({
          path: node.realpath,
          hiddenLockfile: true,
        }).then(meta => {
          if (meta.loadedFromDisk) {
            node.meta = meta
            meta.add(node)
            return this[_loadActualVirtually]()
          }
          return Shrinkwrap.load({
            path: node.realpath,
          }).then(meta => {
            node.meta = meta
            meta.add(node)
            return this[_loadActualActually]()
          })
        })
      })
  }

  [_loadActualVirtually] () {
    // have to load on a new Arborist object, so we don't assign
    // the virtualTree on this one!  Also, the weird reference is because
    // we can't easily get a ref to Arborist in this module, without
    // creating a circular reference, since this class is a mixin used
    // to build up the Arborist class itself.
    return new this.constructor({...this.options}).loadVirtual({
      root: this.actualTree,
    })
  }

  [_loadActualActually] () {
    this[_actualTreeLoaded] = new Set()
    // did is a set of all realpaths visited on this walk
    // important when a link points at a node we end up visiting later.
    return this[loadFSTree](this.actualTree)
      .then(() => this[findFSParents]())
      .then(() => calcDepFlags(this.actualTree))
      .then(() => this.actualTree)
  }

  [loadFSNode] ({ path, parent, real, root }) {
    if (!real)
      return realpath(path, this[_rpcache], this[_stcache])
        .then(
          real => this[loadFSNode]({ path, parent, real, root }),
          // if realpath fails, just provide a dummy error node
          error => new Node({ error, path, realpath: path, parent, root })
        )

    // cache temporarily holds a promise placeholder so we don't try to create
    // the same node multiple times.  this is rare to encounter, given the
    // aggressive caching on realpath and lstat calls, but it's possible that
    // it's already loaded as a tree top, and then gets its parent loaded
    // later, if a symlink points deeper in the tree.
    const cached = this[_cache].get(path)
    if (cached) {
      return Promise.resolve(cached).then(node => {
        node.parent = parent
        return node
      })
    }

    const p = rpj(join(real, 'package.json'))
      // soldier on if read-package-json raises an error
      .then(pkg => [pkg, null], error => [null, error])
      .then(([pkg, error]) => {
        return this[path === real ? newNode : newLink]({
          path,
          realpath: real,
          pkg,
          error,
          parent,
          root,
        })
      })

    this[_cache].set(path, p)
    p.then(node => this[_cache].set(path, node))
    return p
  }

  // this is the way it is to expose a timing issue which is difficult to
  // test otherwise.  The creation of a Node may take slightly longer than
  // the creation of a Link that targets it.  If the Node has _begun_ its
  // creation phase (and put a Promise in the cache) then the Link will
  // get a Promise as its cachedTarget instead of an actual Node object.
  // This is not a problem, because it gets resolved prior to returning
  // the tree or attempting to load children.  However, it IS remarkably
  // difficult to get to happen in a test environment to verify reliably.
  // Hence this kludge.
  [newNode] (options) {
    // check it for an fsParent if it's a tree top.  there's a decent chance
    // it'll get parented later, making the fsParent scan a no-op, but better
    // safe than sorry, since it's cheap.
    const { parent, realpath, path } = options
    if (!parent && path !== this.path)
      this[_linkTargets].add(realpath)
    return process.env._TEST_ARBORIST_SLOW_LINK_TARGET_ === '1'
      ? new Promise(res => setTimeout(() => res(new Node(options)), 10))
      : new Node(options)
  }

  [newLink] (options) {
    const { realpath } = options
    this[_linkTargets].add(realpath)
    const target = this[_cache].get(realpath)
    const link = new Link({ ...options, target })

    if (!target) {
      this[_cache].set(realpath, link.target)
      const nmParent = link.target.inNodeModules()
      // if a link points at /path/to/node_modules/foo, and we haven't
      // loaded the node at /path/to, then load that, so that we'll also
      // pick up peers of that node in the node_modules tree.  This is how
      // we can read pnpm trees properly. Defer loading until this is done.
      if (nmParent) {
        return this[loadFSNode]({ path: nmParent, root: link.root })
          .then(node => this[loadFSTree](node))
          .then(() => link)
      }
    } else if (target.then)
      target.then(node => link.target = node)

    return link
  }

  [loadFSTree] (node) {
    const did = this[_actualTreeLoaded]
    node = node.target || node

    // if a Link target has started, but not completed, then
    // a Promise will be in the cache to indicate this.
    if (node.then)
      return node.then(node => this[loadFSTree](node))

    // impossible except in pathological ELOOP cases
    /* istanbul ignore next */
    if (did.has(node.realpath))
      return Promise.resolve(node)

    did.add(node.realpath)
    return this[loadFSChildren](node)
      .then(() => Promise.all(
        [...node.children.entries()]
          .filter(([name, kid]) => !did.has(kid.realpath))
          .map(([name, kid]) => this[loadFSTree](kid))))
  }

  // create child nodes for all the entries in node_modules
  // and attach them to the node as a parent
  [loadFSChildren] (node) {
    const nm = resolve(node.realpath, 'node_modules')
    return readdir(nm).then(kids => {
      return Promise.all(
      // ignore . dirs and retired scoped package folders
      kids.filter(kid => !/^(@[^/]+\/)?\./.test(kid))
      .map(kid => this[loadFSNode]({
        parent: node,
        path: resolve(nm, kid),
      })))
    },
      // error in the readdir is not fatal, just means no kids
      () => {})
  }

  // try to find a node that is the parent in a fs tree sense, but not a
  // node_modules tree sense, of any link targets.  this allows us to
  // resolve deps that node will find, but a legacy npm view of the
  // world would not have noticed.
  [findFSParents] () {
    for (const path of this[_linkTargets]) {
      const node = this[_cache].get(path)
      if (!node.parent && !node.fsParent) {
        for (let p = dirname(path); p;) {
          if (this[_cache].has(p)) {
            node.fsParent = this[_cache].get(p)
            p = null
          } else {
            // walk up the tree until p === dirname(p)
            const pp = dirname(p)
            if (pp === p)
              p = null
            else
              p = pp
          }
        }
      }
    }
  }
}
