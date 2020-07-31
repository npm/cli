// mixin providing the loadVirtual method

const {dirname, resolve} = require('path')
const mapWorkspaces = require('@npmcli/map-workspaces')
const walkUp = require('walk-up-path')

const nameFromFolder = require('@npmcli/name-from-folder')
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

    // allow the user to set reify options on the ctor as well.
    // XXX: deprecate separate reify() options object.
    options = { ...this.options, ...options }

    if (options.root && options.root.meta)
      return this[loadFromShrinkwrap](options.root.meta, options.root)

    return Shrinkwrap.load({ path: this.path }).then(s => {
      if (!s.loadedFromDisk && !options.root) {
        const er = new Error('loadVirtual requires existing shrinkwrap file')
        throw Object.assign(er, { code: 'ENOLOCK' })
      }

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
    // root is never any of these things, but might be a brand new
    // baby Node object that never had its dep flags calculated.
    root.extraneous = false
    root.dev = false
    root.optional = false
    root.devOptional = false
    root.peer = false
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
      const { path, name } = node
      for (const p of walkUp(dirname(path))) {
        const ploc = relpath(this.path, p)
        const parent = nodes.get(ploc)
        if (!parent)
          continue

        const locTest = `${ploc}/node_modules/${name}`.replace(/^\//, '')
        const ptype = location === locTest
          ? 'parent'
          : 'fsParent'
        node[ptype] = parent
        // read inBundle from package because 'package' here is
        // actually a v2 lockfile metadata entry.
        // If the *parent* is also bundled, though, then we assume
        // that it's being pulled in just by virtue of that.
        const {inBundle} = node.package
        const ppkg = parent.package
        const {inBundle: parentBundled} = ppkg
        const hasEdge = parent.edgesOut.has(name)
        if (ptype === 'parent' && inBundle && hasEdge && !parentBundled) {
          if (!ppkg.bundleDependencies)
            ppkg.bundleDependencies = [name]
          else if (!ppkg.bundleDependencies.includes(name))
            ppkg.bundleDependencies.push(name)
        }

        break
      }
    }
  }

  [loadNode] (location, sw) {
    const path = resolve(this.path, location)
    // shrinkwrap doesn't include package name unless necessary
    if (!sw.name)
      sw.name = nameFromFolder(path)
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
    link.extraneous = target.extraneous
    link.devOptional = target.devOptional
    link.peer = target.peer
    link.optional = target.optional
    link.dev = target.dev
    return link
  }
}
