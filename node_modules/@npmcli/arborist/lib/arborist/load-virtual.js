// mixin providing the loadVirtual method

const {resolve} = require('path')
const mapWorkspaces = require('@npmcli/map-workspaces')

const consistentResolve = require('../consistent-resolve.js')
const Shrinkwrap = require('../shrinkwrap.js')
const Node = require('../node.js')
const Link = require('../link.js')
const relpath = require('../relpath.js')
const rpj = require('read-package-json-fast')

const loadFromShrinkwrap = Symbol('loadFromShrinkwrap')
const resolveNodes = Symbol('resolveNodes')
const resolveLinks = Symbol('resolveLinks')
const assignParentage = Symbol('assignParentage')
const loadNode = Symbol('loadVirtualNode')
const loadLink = Symbol('loadVirtualLink')
const loadWorkspaces = Symbol('loadWorkspaces')

module.exports = cls => class VirtualLoader extends cls {
  constructor (options) {
    super(options)

    // the virtual tree we load from a shrinkwrap
    this.virtualTree = options.virtualTree
  }

  // public method
  loadVirtual (options = {}) {
    if (this.virtualTree)
      return Promise.resolve(this.virtualTree)

    if (options.root && options.root.meta)
      return this[loadFromShrinkwrap](options.root.meta, options.root)

    return Shrinkwrap.load({ path: this.path }).then(s => {
      if (!s.loadedFromDisk && !options.root)
        throw new Error('loadVirtual requires existing shrinkwrap file')

      // when building the ideal tree, we pass in a root node to this function
      // otherwise, load it from the root package in the lockfile
      const {
        root = this[loadWorkspaces](
          this[loadNode]('', s.data.packages[''] || {}),
          s
        )
      } = options

      return this[loadFromShrinkwrap](s, root)
    })
  }

  async [loadFromShrinkwrap] (s, root) {
    root.meta = s
    s.add(root)
    this.virtualTree = root
    const {links, nodes} = this[resolveNodes](s, root)
    await this[resolveLinks](links, nodes)
    this[assignParentage](nodes)
    return root
  }

  // separate out link metadatas, and create Node objects for nodes
  [resolveNodes] (s, root) {
    const links = new Map()
    const nodes = new Map([['', root]])
    for (const [location, meta] of Object.entries(s.data.packages)) {
      // skip the root because we already got it
      if (!location)
        continue

      if (meta.link)
        links.set(location, meta)
      else
        nodes.set(location, this[loadNode](location, meta))
    }
    return {links, nodes}
  }

  // links is the set of metadata, and nodes is the map of non-Link nodes
  // Set the targets to nodes in the set, if we have them (we might not)
  async [resolveLinks] (links, nodes) {
    // now we've loaded the root, and all real nodes
    // link up the links
    const {meta} = this.virtualTree
    const {loadedFromDisk, originalLockfileVersion} = meta
    const oldLockfile = loadedFromDisk && !(originalLockfileVersion >= 2)

    for (const [location, meta] of links.entries()) {
      const targetPath = resolve(this.path, meta.resolved)
      const targetLoc = relpath(this.path, targetPath)
      const target = nodes.get(targetLoc)
      const link = this[loadLink](location, targetLoc, target, meta)
      nodes.set(location, link)
      nodes.set(targetLoc, link.target)
      // legacy shrinkwraps do not store all the info we need for the target.
      // if we're loading from disk, and have a link in place, we need to
      // look in that actual folder (or at least try to) in order to get
      // the dependencies of the link target and load it properly.
      if (oldLockfile) {
        const pj = link.realpath + '/package.json'
        const pkg = await rpj(pj).catch(() => null)
        if (pkg)
          link.target.package = pkg
      }
    }
  }

  [assignParentage] (nodes) {
    for (const [location, node] of nodes) {
      if (location === '')
        continue

      // node_modules/foo/node_modules/bar -> node_modules/foo
      // if we have something like node_modules/foo/a/b/c,
      // however, then the foo module isn't actually the 'parent' of
      // the c module, but it is the fsparent
      const split = location.split(/(?:^|\/)node_modules\//)
      const name = split.pop()
      const ploc = split.join('/node_modules/').substr(1)
      const parent = nodes.get(ploc)
      /* istanbul ignore else - impossible unless lockfile damaged/invalid */
      if (parent) {
        // if the node location doesn't actually start with node_modules, but
        // the node name DOES match the folder it's in, like if you have a
        // link from `node_modules/app` to `./app`, then split won't contain
        // anything, but the name will still match.  In that case, it is an
        // fsParent, though, not a parent.
        const parentType = name === node.name && split.length
          ? 'parent'
          : 'fsParent'
        node[ parentType ] = parent
        // read inBundle from package because 'package' here is
        // actually a v2 lockfile metadata entry.
        if (node.package.inBundle && parent.edgesOut.has(name)) {
          const ppkg = parent.package
          if (!ppkg.bundleDependencies)
            ppkg.bundleDependencies = [name]
          else if (!ppkg.bundleDependencies.includes(name))
            ppkg.bundleDependencies.push(name)
        }
      }
    }
  }

  [loadNode] (location, sw) {
    const path = resolve(this.path, location)
    const node = new Node({
      legacyPeerDeps: this.legacyPeerDeps,
      root: this.virtualTree,
      path,
      realpath: path,
      integrity: sw.integrity,
      resolved: consistentResolve(sw.resolved, this.path, path),
      pkg: sw,
      hasShrinkwrap: sw.hasShrinkwrap,
    })
    // cast to boolean because they're undefined in the lock file when false
    node.extraneous = !!sw.extraneous
    node.devOptional = !!(sw.devOptional || sw.dev || sw.optional)
    node.peer = !!sw.peer
    node.optional = !!sw.optional
    node.dev = !!sw.dev
    return node
  }

  [loadWorkspaces] (node, s) {
    const workspaces = mapWorkspaces.virtual({
      cwd: node.path,
      lockfile: s.data
    })
    if (workspaces.size)
      node.workspaces = workspaces
    return node
  }

  [loadLink] (location, targetLoc, target, meta) {
    const path = resolve(this.path, location)
    const link = new Link({
      legacyPeerDeps: this.legacyPeerDeps,
      path,
      realpath: resolve(this.path, targetLoc),
      target,
      pkg: target && target.package,
    })
    if (target) {
      link.extraneous = target.extraneous
      link.devOptional = target.devOptional
      link.peer = target.peer
      link.optional = target.optional
      link.dev = target.dev
    } else {
      // probably only had a legacy shrinkwrap.  assume that it
      // ought to be here.
      link.extraneous = link.target.extraneous = !!meta.extraneous
      link.optional = link.target.optional = !!meta.optional
      link.dev = link.target.dev = !!meta.dev
      link.peer = link.target.peer = !!meta.peer
      link.devOptional = link.target.devOptional =
        !!meta.devOptional ||
        !!meta.dev ||
        !!meta.optional
    }
    return link
  }
}
