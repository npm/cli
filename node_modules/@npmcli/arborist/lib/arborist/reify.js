// mixin implementing the reify method

// XXX unsupported platforms should be failures if the node is optional
// otherwise we try anyway.
// XXX this needs to clone rather than copy, so that we can leave failed
// optional deps in the ideal tree, but remove them from the actual.
// But to do that, we need a way to clone a tree efficiently.

const npa = require('npm-package-arg')
const pacote = require('pacote')
const binLinks = require('bin-links')
const runScript = require('@npmcli/run-script')
const rpj = require('read-package-json-fast')
const {checkEngine, checkPlatform} = require('npm-install-checks')
const updateDepSpec = require('../update-dep-spec.js')

const boolEnv = b => b ? '1' : ''

const {dirname, resolve, relative} = require('path')
const {depth: dfwalk} = require('treeverse')
const fs = require('fs')
const {promisify} = require('util')
const rename = promisify(fs.rename)
const symlink = promisify(fs.symlink)
const writeFile = promisify(fs.writeFile)
const mkdirp = require('mkdirp-infer-owner')
const rimraf = promisify(require('rimraf'))
const packageContents = require('@npmcli/installed-package-contents')

const relpath = require('../relpath.js')
const Diff = require('../diff.js')
const retirePath = require('../retire-path.js')
const promiseAllRejectLate = require('promise-all-reject-late')
const promiseCallLimit = require('promise-call-limit')
const Ideal = require('./build-ideal-tree.js')
const optionalSet = require('../optional-set.js')

const _retiredPaths = Symbol('retiredPaths')
const _retiredUnchanged = Symbol('retiredUnchanged')
const _sparseTreeDirs = Symbol('sparseTreeDirs')
const _savePrefix = Symbol('savePrefix')
const _retireShallowNodes = Symbol('retireShallowNodes')
const _getBundlesByDepth = Symbol('getBundlesByDepth')
const _registryResolved = Symbol('registryResolved')
const _trashList = Symbol('trashList')
const _addNodeToTrashList = Symbol('addNodeToTrashList')
const _handleOptionalFailure = Symbol('handleOptionalFailure')
const _loadTrees = Symbol('loadTrees')

// shared symbols for swapping out when testing
const _diffTrees = Symbol.for('diffTrees')
const _createSparseTree = Symbol.for('createSparseTree')
const _loadShrinkwrapsAndUpdateTrees = Symbol.for('loadShrinkwrapsAndUpdateTrees')
const _reifyNode = Symbol.for('reifyNode')
const _checkEngineAndPlatform = Symbol('checkEngineAndPlatform')
const _extractOrLink = Symbol('extractOrLink')
const _symlink = Symbol('symlink')
const _recheckEngineAndPlatform = Symbol('recheckEngineAndPlatform')
const _checkEngine = Symbol('checkEngine')
const _checkPlatform = Symbol('checkPlatform')
const _binLinks = Symbol('binLinks')
const _loadBundlesAndUpdateTrees = Symbol.for('loadBundlesAndUpdateTrees')
const _unpackNewModules = Symbol.for('unpackNewModules')
const _moveContents = Symbol.for('moveContents')
const _moveBackRetiredUnchanged = Symbol.for('moveBackRetiredUnchanged')
const _runLifecycleScripts = Symbol('runLifecycleScripts')
const _runScriptQueue = Symbol('runScriptQueue')
const _removeTrash = Symbol.for('removeTrash')
const _renamePath = Symbol.for('renamePath')
const _rollbackRetireShallowNodes = Symbol.for('rollbackRetireShallowNodes')
const _rollbackCreateSparseTree = Symbol.for('rollbackCreateSparseTree')
const _rollbackMoveBackRetiredUnchanged = Symbol.for('rollbackMoveBackRetiredUnchanged')
const _saveIdealTree = Symbol.for('saveIdealTree')
const _copyIdealToActual = Symbol('copyIdealToActual')
const _addOmitsToTrashList = Symbol('addOmitsToTrashList')

const _omitDev = Symbol('omitDev')
const _omitOptional = Symbol('omitOptional')
const _omitPeer = Symbol('omitPeer')

const _global = Symbol.for('global')
const _ignoreScripts = Symbol('ignoreScripts')
const _scriptShell = Symbol('scriptShell')
const _force = Symbol('force')

// defined by Ideal mixin
const _idealTreePrune = Symbol.for('idealTreePrune')
const _explicitRequests = Symbol.for('explicitRequests')
const _resolvedAdd = Symbol.for('resolvedAdd')

module.exports = cls => class Reifier extends Ideal(cls) {
  constructor (options) {
    super(options)

    const {
      ignoreScripts = false,
      force = false,
      scriptShell,
      savePrefix = '^',
      binLinks = true,
    } = options

    if (!binLinks)
      this[_binLinks] = () => {}

    this[_ignoreScripts] = !!ignoreScripts
    this[_force] = !!force
    this[_scriptShell] = scriptShell
    this[_savePrefix] = savePrefix

    this.diff = null
    this[_retiredPaths] = {}
    this[_retiredUnchanged] = {}
    this[_sparseTreeDirs] = new Set()
    this[_trashList] = new Set()
  }

  // public method
  reify (options = {}) {
    const omit = new Set(options.omit || [])
    this[_omitDev] = omit.has('dev')
    this[_omitOptional] = omit.has('optional')
    this[_omitPeer] = omit.has('peer')

    // start tracker block
    this.addTracker('reify')
    return this[_loadTrees](options)
      .then(() => this[_diffTrees]())
      .then(() => this[_retireShallowNodes]())
      .then(() => this[_createSparseTree]())
      .then(() => this[_addOmitsToTrashList]())
      .then(() => this[_loadShrinkwrapsAndUpdateTrees]())
      .then(() => this[_loadBundlesAndUpdateTrees]())
      .then(() => this[_unpackNewModules]())
      .then(() => this[_moveBackRetiredUnchanged]())
      .then(() => this[_runLifecycleScripts]())
      .then(() => this[_removeTrash]())
      .then(() => this[_saveIdealTree](options))
      .then(() => this[_copyIdealToActual]())
      .then(() => {
        this.finishTracker('reify')
        return this.actualTree
      })
  }

  // when doing a local install, we load everything and figure it all out.
  // when doing a global install, we *only* care about the explicit requests.
  [_loadTrees] (options) {
    if (!this[_global])
      return Promise.all([this.loadActual(), this.buildIdealTree(options)])

    // the global install space tends to have a lot of stuff in it.  don't
    // load all of it, just what we care about.  we won't be saving a
    // hidden lockfile in there anyway.
    const actualOpts = {
      global: true,
      filter: (node, kid) => !node.isRoot ? true
        : this[_explicitRequests].has(kid),
    }
    return this.buildIdealTree(options)
      .then(() => this.loadActual(actualOpts))
  }

  [_diffTrees] () {
    // XXX if we have an existing diff already, there should be a way
    // to just invalidate the parts that changed, but avoid walking the
    // whole tree again.

    // find all the nodes that need to change between the actual
    // and ideal trees.
    this.diff = Diff.calculate({
      actual: this.actualTree,
      ideal: this.idealTree,
    })
    for (const node of this.diff.removed) {
      this[_addNodeToTrashList](node)
    }
  }

  // add the node and all its bins to the list of things to be
  // removed later on in the process.  optionally, also mark them
  // as a retired paths, so that we move them out of the way and
  // replace them when rolling back on failure.
  [_addNodeToTrashList] (node, retire) {
    const paths = [ node.path, ...node.binPaths ]
    const moves = this[_retiredPaths]
    for (const path of paths) {
      if (retire) {
        const retired = retirePath(path)
        moves[path] = retired
        this[_trashList].add(retired)
      } else
        this[_trashList].add(path)
    }
  }

  // move aside the shallowest nodes in the tree that have to be
  // changed or removed, so that we can rollback if necessary.
  [_retireShallowNodes] () {
    const moves = this[_retiredPaths] = {}
    for (const diff of this.diff.children) {
      if (diff.action === 'CHANGE' || diff.action === 'REMOVE') {
        // we'll have to clean these up at the end, so add them to the list
        this[_addNodeToTrashList](diff.actual, true)
      }
    }
    let errState = null
    const movePromises = Object.entries(moves)
      .map(([from, to]) => this[_renamePath](from, to))
    return promiseAllRejectLate(movePromises)
      .catch(er => this[_rollbackRetireShallowNodes](er))
  }

  [_renamePath] (from, to, didMkdirp = false) {
    return rename(from, to)
      .catch(er => {
        // Occasionally an expected bin file might not exist in the package,
        // or a shim/symlink might have been moved aside.  If we've already
        // handled the most common cause of ENOENT (dir doesn't exist yet),
        // then just ignore any ENOENT.
        if (er.code === 'ENOENT')
          return didMkdirp ? null : mkdirp(dirname(to)).then(() =>
            this[_renamePath](from, to, true))
        else if (er.code === 'EEXIST')
          return rimraf(to).then(() => rename(from, to))
        else
          throw er
      })
  }

  [_rollbackRetireShallowNodes] (er) {
    const moves = this[_retiredPaths]
    const movePromises = Object.entries(moves)
      .map(([from, to]) => this[_renamePath](to, from))
    return promiseAllRejectLate(movePromises)
      // ignore subsequent rollback errors
      .catch(er => {})
      .then(() => { throw er })
  }

  // adding to the trash list will skip reifying, and delete them
  // if they are currently in the tree and otherwise untouched.
  [_addOmitsToTrashList] () {
    if (!this[_omitDev] && !this[_omitOptional] && !this[_omitPeer])
      return

    const filter = node =>
      node.peer && this[_omitPeer] ||
      node.dev && this[_omitDev] ||
      node.optional && this[_omitOptional] ||
      node.devOptional && this[_omitOptional] && this[_omitDev]

    for (const node of this.idealTree.inventory.filter(filter)) {
      this[_trashList].add(node.path)
    }
  }

  [_createSparseTree] () {
    // if we call this fn again, we look for the previous list
    // so that we can avoid making the same directory multiple times
    const dirs = this.diff.leaves
      .filter(diff => {
        return (diff.action === 'ADD' || diff.action === 'CHANGE') &&
          !this[_sparseTreeDirs].has(diff.ideal.path)
      })
      .map(diff => diff.ideal.path)

    return promiseAllRejectLate(dirs.map(d => mkdirp(d)))
      .then(() => dirs.forEach(dir => this[_sparseTreeDirs].add(dir)))
      .catch(er => this[_rollbackCreateSparseTree](er))
  }

  [_rollbackCreateSparseTree] (er) {
    // cut the roots of the sparse tree, not the leaves
    const moves = this[_retiredPaths]
    const failures = []
    const unlinks = Object.entries(moves)
      .map(([from, to]) => rimraf(from).catch(er => failures.push([from, er])))
    return promiseAllRejectLate(unlinks)
      .then(() => {
        if (failures.length)
          this.emit('warn', 'Failed to clean up some directories', failures)
      })
      .then(() => this[_rollbackRetireShallowNodes](er))
  }

  // shrinkwrap nodes define their dependency branches with a file, so
  // we need to unpack them, read that shrinkwrap file, and then update
  // the tree by calling loadVirtual with the node as the root.
  [_loadShrinkwrapsAndUpdateTrees] (seen = new Set()) {
    const shrinkwraps = this.diff.leaves
      .filter(d => (d.action === 'CHANGE' || d.action === 'ADD') &&
        d.ideal.hasShrinkwrap && !seen.has(d.ideal) &&
        !this[_trashList].has(d.ideal.path))

    if (!shrinkwraps.length)
      return

    const Arborist = this.constructor
    return promiseAllRejectLate(shrinkwraps.map(diff => {
      const node = diff.ideal
      seen.add(node)
      return this[_reifyNode](node)
    }))
      .then(nodes => promiseAllRejectLate(nodes.map(node => new Arborist({
        ...this.options,
        path: node.path,
      }).loadVirtual({ root: node }))))
      // reload the diff and sparse tree because the ideal tree changed
      .then(() => this[_diffTrees]())
      .then(() => this[_createSparseTree]())
      .catch(er => this[_rollbackCreateSparseTree](er))
  }

  // create a symlink for Links, extract for Nodes
  // return the node object, since we usually want that
  // handle optional dep failures here
  // If node is in trash list, skip it
  // If reifying fails, and the node is optional, add it and its optionalSet
  // to the trash list
  // Always return the node.
  [_reifyNode] (node) {
    if (this[_trashList].has(node.path))
      return node

    this.addTracker('reify', node.name, node.location)

    const p = this[_checkEngineAndPlatform](node)
      .then(() => this[_extractOrLink](node))
      .then(() => this[_recheckEngineAndPlatform](node))
      .then(() => this[_binLinks](node))

    return this[_handleOptionalFailure](node, p)
      .then(() => {
        this.finishTracker('reify', node.name, node.location)
        return node
      })
  }

  [_extractOrLink] (node) {
    return node.isLink
      ? rimraf(node.path).then(() => this[_symlink](node))
      : pacote.extract(this[_registryResolved](node.resolved), node.path, {
          ...this.options,
          resolved: node.resolved,
          integrity: node.integrity,
        })
  }

  [_symlink] (node) {
    const dir = dirname(node.path)
    const target = node.realpath
    const rel = relative(dir, target)
    return symlink(rel, node.path, 'dir')
  }

  [_recheckEngineAndPlatform] (node) {
    // If we're loading from a v1 lockfile, then need to do this again later
    // after reading from the disk.
    const {meta} = this.idealTree
    return meta.loadedFromDisk && meta.originalLockfileVersion < 2 &&
      rpj(node.path + '/package.json').then(pkg => {
        node.package.os = pkg.os
        node.package.cpu = pkg.cpu
        node.package.engines = pkg.engines
        return this[_checkEngineAndPlatform](node)
      })
  }

  [_checkEngineAndPlatform] (node) {
    // engine/platform checks throw, so start the promise chain off first
    return Promise.resolve()
      .then(() => this[_checkEngine](node))
      .then(() => this[_checkPlatform](node))
  }


  [_checkPlatform] (node) {
    checkPlatform(node.package, this[_force])
  }

  [_checkEngine] (node) {
    const { engineStrict, npmVersion, nodeVersion } = this.options
    const c = () => checkEngine(node.package, npmVersion, nodeVersion, this[_force])

    if (engineStrict)
      c()
    else {
      try {
        c()
      } catch (er) {
        this.emit('log', 'warn', er)
      }
    }
  }

  // if the node is optional, then the failure of the promise is nonfatal
  // just add it and its optional set to the trash list.
  [_handleOptionalFailure] (node, p) {
    return (node.optional ? p.catch(er => {
      const set = optionalSet(node)
      for (node of set) {
        this[_addNodeToTrashList](node)
      }
    }) : p).then(() => node)
  }

  [_binLinks] (node) {
    return binLinks({
      pkg: node.package,
      path: node.path,
      top: node.isTop || node.globalTop,
      force: this[_force],
      global: node.globalTop,
    })
  }

  [_registryResolved] (resolved) {
    // the default registry url is a magic value meaning "the currently
    // configured registry".
    //
    // XXX: use a magic string that isn't also a valid value, like
    // ${REGISTRY} or something.  This has to be threaded through the
    // Shrinkwrap and Node classes carefully, so for now, just treat
    // the default reg as the magical animal that it has been.
    return resolved && resolved
      .replace(/^https?:\/\/registry.npmjs.org\//, this.registry)
  }

  // bundles are *sort of* like shrinkwraps, in that the branch is defined
  // by the contents of the package.  however, in their case, rather than
  // shipping a virtual tree that must be reified, they ship an entire
  // reified actual tree that must be unpacked and not modified.
  [_loadBundlesAndUpdateTrees] (
    depth = 0, bundlesByDepth = this[_getBundlesByDepth]()
  ) {
    const maxBundleDepth = bundlesByDepth.get('maxBundleDepth')
    if (depth > maxBundleDepth) {
      // if we did something, then prune the tree and update the diffs
      // XXX this is two full tree scans, find a better way to do this.
      if (maxBundleDepth !== -1) {
        this[_idealTreePrune]()
        this[_diffTrees]()
      }
      return
    }

    // skip any that have since been removed from the tree, eg by a
    // shallower bundle overwriting them with a bundled meta-dep.
    const set = (bundlesByDepth.get(depth) || [])
      .filter(node => node.root === this.idealTree &&
        !this[_trashList].has(node.path))

    if (!set.length) {
      return this[_loadBundlesAndUpdateTrees](depth + 1, bundlesByDepth)
    }

    const Arborist = this.constructor
    // extract all the nodes with bundles
    this.log.silly('reify', 'reifyNode')
    return promiseAllRejectLate(set.map(node => this[_reifyNode](node)))
    // then load their unpacked children and move into the ideal tree
    .then(nodes => promiseAllRejectLate(nodes.map(node =>
      new Arborist({
        ...this.options,
        path: node.path,
      }).loadActual().then(tree => {
        for (const child of tree.children.values()) {
          // skip the empty sparse tree folders
          if (child.package._id)
            child.parent = node
        }
        return node
      }).then(node => {
        // link the bins for any bundled deps in its tree.
        // these are often required for build scripts.
        const set = new Set()
        dfwalk({
          tree: node,
          visit: node => set.add(node),
          getChildren: node => [...node.children.values()],
          filter: node => node.inBundle,
        })
        const promises = []
        for (const node of set) {
          promises.push(this[_binLinks](node))
        }
        return promiseAllRejectLate(promises)
      }).then(() => node)
    )))
    // move onto the next level of bundled items
    .then(() => this[_loadBundlesAndUpdateTrees](depth + 1, bundlesByDepth))
    .catch(er => this[_rollbackCreateSparseTree](er))
  }

  [_getBundlesByDepth] () {
    const bundlesByDepth = new Map()
    let maxBundleDepth = -1
    dfwalk({
      tree: this.diff,
      visit: diff => {
        const node = diff.ideal
        if (node && !node.isRoot && node.package.bundleDependencies &&
            node.package.bundleDependencies.length) {
          maxBundleDepth = Math.max(maxBundleDepth, node.depth)
          if (!bundlesByDepth.has(node.depth))
            bundlesByDepth.set(node.depth, [node])
          else
            bundlesByDepth.get(node.depth).push(node)
        }
      },
      getChildren: diff => diff.children,
    })

    bundlesByDepth.set('maxBundleDepth', maxBundleDepth)
    return bundlesByDepth
  }

  // ok!  actually unpack stuff into their target locations!
  // The sparse tree has already been created, so we walk the diff
  // kicking off each unpack job.  If any fail, we rimraf the sparse
  // tree entirely and try to put everything back where it was.
  [_unpackNewModules] () {
    const unpacks = []
    dfwalk({
      tree: this.diff,
      filter: diff => diff.ideal,
      visit: diff => {
        const node = diff.ideal
        const bd = node.package.bundleDependencies
        const sw = node.hasShrinkwrap
        // should inBundle differentiate if it's in the root's bundle?
        // because in that case, it should still be installed.
        if (node && !node.isRoot && !(bd && bd.length) && !sw && !node.inBundle)
          unpacks.push(this[_reifyNode](node))
      },
      getChildren: diff => diff.children,
    })
    return promiseAllRejectLate(unpacks)
      .catch(er => this[_rollbackCreateSparseTree](er))
  }

  // This is the part where we move back the unchanging nodes that were
  // the children of a node that did change.  If this fails, the rollback
  // is a three-step process.  First, we try to move the retired unchanged
  // nodes BACK to their retirement folders, then delete the sparse tree,
  // then move everything out of retirement.
  [_moveBackRetiredUnchanged] () {
    // get a list of all unchanging children of any shallow retired nodes
    // if they are not the ancestor of any node in the diff set, then the
    // directory won't already exist, so just rename it over.
    // This is sort of an inverse diff tree, of all the nodes where
    // the actualTree and idealTree _don't_ differ, starting from the
    // shallowest nodes that we moved aside in the first place.
    const moves = this[_retiredPaths]
    this[_retiredUnchanged] = {}
    return promiseAllRejectLate(this.diff.children.map(diff => {
      const realFolder = (diff.actual || diff.ideal).path
      const retireFolder = moves[realFolder]
      this[_retiredUnchanged][retireFolder] = []
      return promiseAllRejectLate(diff.unchanged.map(node => {
        // no need to roll back links, since we'll just delete them anyway
        if (node.isLink)
          return mkdirp(dirname(node.path)).then(() => this[_reifyNode](node))

        if (node.inBundle) {
          // will have been moved/unpacked along with bundler
          return
        }

        this[_retiredUnchanged][retireFolder].push(node)

        const rel = relative(realFolder, node.path)
        const fromPath = resolve(retireFolder, rel)
        // if it has bundleDependencies, then make node_modules.  otherwise
        // skip it.
        const bd = node.package.bundleDependencies
        const dir = bd && bd.length ? node.path + '/node_modules' : node.path
        return mkdirp(dir).then(() => this[_moveContents](node, fromPath))
      }))
    }))
    .catch(er => this[_rollbackMoveBackRetiredUnchanged](er))
  }

  // move the contents from the fromPath to the node.path
  [_moveContents] (node, fromPath) {
    return packageContents({
      path: fromPath,
      depth: 1,
      packageJsonCache: new Map([[fromPath + '/package.json', node.package]]),
    }).then(res => promiseAllRejectLate(res.map(path => {
      const rel = relative(fromPath, path)
      const to = resolve(node.path, rel)
      return this[_renamePath](path, to)
    })))
  }

  [_rollbackMoveBackRetiredUnchanged] (er) {
    const moves = this[_retiredPaths]
    // flip the mapping around to go back
    const realFolders = new Map(Object.entries(moves).map(([k, v]) => [v, k]))
    const promises = Object.entries(this[_retiredUnchanged])
      .map(([retireFolder, nodes]) => promiseAllRejectLate(nodes.map(node => {
        const realFolder = realFolders.get(retireFolder)
        const rel = relative(realFolder, node.path)
        const fromPath = resolve(retireFolder, rel)
        return this[_moveContents]({ ...node, path: fromPath }, node.path)
      })))
    return promiseAllRejectLate(promises)
      .then(() => this[_rollbackCreateSparseTree](er))
  }

  [_runLifecycleScripts] () {
    if (this[_ignoreScripts])
      return

    // for all the things being installed, run their appropriate scripts
    // run in tip->root order, so as to be more likely to build a node's
    // deps before attempting to build it itself
    const installedNodes = []
    dfwalk({
      tree: this.diff,
      leave: diff => installedNodes.push(diff.ideal),
      // process adds before changes, ignore removals
      getChildren: diff => diff && diff.children,
      filter: diff => diff.action === 'ADD' || diff.action === 'CHANGE'
    })

    const preinstall = []
    const install = []
    const postinstall = []

    // have to get the scripts from the actual package.json, because the
    // legacy read-package-json is too enthusiastic about adding a node-gyp
    // command, even if the gypfile is not included in the package
    const {meta} = this.idealTree
    return promiseAllRejectLate(installedNodes.map(node => {
      // ignore any from paths that we already know we'll delete
      if (this[_trashList].has(node.path))
        return

      // if we loaded from a v1 lockfile, then we have to check them all
      // otherwise, we only have to check the ones with hasInstallScript
      const hasInstallScript = node.hasInstallScript ||
        meta.loadedFromDisk && meta.originalLockfileVersion < 2

      if (!hasInstallScript)
        return

      return rpj(node.path + '/package.json').then(pkg => {
        if (pkg.scripts) {
          node.package.scripts = pkg.scripts
          const val = [node, pkg]
          if (pkg.scripts.preinstall)
            preinstall.push(val)
          if (pkg.scripts.install)
            install.push(val)
          if (pkg.scripts.postinstall)
            postinstall.push(val)
        }
      })
      // failure just means no scripts to add, probably just no pj
      .catch(/* istanbul ignore next */ er => {})
    }))
      .then(() => this[_runScriptQueue]('preinstall', preinstall))
      .then(() => this[_runScriptQueue]('install', install))
      .then(() => this[_runScriptQueue]('postinstall', postinstall))
      .catch(er => this[_rollbackMoveBackRetiredUnchanged](er))
  }

  [_runScriptQueue] (event, queue) {
    if (!queue.length)
      return

    return promiseCallLimit(queue.map(([node, pkg]) => () => {
      const {path} = node
      // skip any that we know we'll be deleting
      if (this[_trashList].has(node.path))
        return Promise.resolve()

      return this[_handleOptionalFailure](node, runScript({
        event,
        path,
        pkg,
        stdioString: true,
        env: {
          npm_package_resolved: node.resolved,
          npm_package_integrity: node.integrity,
          npm_package_json: resolve(node.path, 'package.json'),
          npm_package_optional: boolEnv(node.optional),
          npm_package_dev: boolEnv(node.dev),
          npm_package_peer: boolEnv(node.peer),
          npm_package_dev_optional:
            boolEnv(node.devOptional && !node.dev && !node.optional),
        },
        scriptShell: this[_scriptShell],
      }))
    }))
  }

  // the tree is pretty much built now, so it's cleanup time.
  // remove the retired folders, and any deleted nodes
  // If this fails, there isn't much we can do but tell the user about it.
  // Thankfully, it's pretty unlikely that it'll fail, since rimraf is a tank.
  [_removeTrash] () {
    const promises = []
    const failures = []
    const rm = path => rimraf(path).catch(er => failures.push([path, er]))

    for (const path of this[_trashList]) {
      promises.push(rm(path))
    }

    return promiseAllRejectLate(promises).then(() => {
      if (failures.length)
        this.emit('warn', 'Failed to clean up some directories', failures)
    })
  }

  // last but not least, we save the ideal tree metadata to the package-lock
  // or shrinkwrap file, and any additions or removals to package.json
  [_saveIdealTree] (options) {
    // the ideal tree is actualized now, hooray!
    // it still contains all the references to optional nodes that were removed
    // for install failures.  Those still end up in the shrinkwrap, so we
    // save it first, then prune out the optional trash, and then return it.

    // support save=false option
    if (options.save === false || this[_global])
      return

    if (this[_resolvedAdd]) {
      const root = this.idealTree
      const pkg = root.package
      for (const req of this[_resolvedAdd]) {
        const {name} = req
        const child = root.children.get(name)
        const res = npa(child.resolved)

        if (req.registry) {
          const version = child.package.version
          const range = this[_savePrefix] + version
          const pname = child.package.name
          const alias = name !== pname
          updateDepSpec(pkg, name, (alias ? `npm:${pname}@` : '') + range)
        } else if (req.hosted) {
          updateDepSpec(pkg, name, req.hosted.shortcut({ noCommittish: false }))
        } else {
          updateDepSpec(pkg, name, req.saveSpec)
        }
      }

      // refresh the edges so they have the correct specs
      this.idealTree.package = pkg
    }

    // XXX preserve indentation maybe?
    const pj = resolve(this.idealTree.path, 'package.json')
    return Promise.all([
      this.idealTree.meta.save(),
      writeFile(pj, JSON.stringify({
        ...this.idealTree.package,
        _id: undefined,
      }, null, 2) + '\n'),
    ])
  }

  [_copyIdealToActual] () {
    // save the ideal's meta as a hidden lockfile after we actualize it
    this.idealTree.meta.filename =
      this.path + '/node_modules/.package-lock.json'
    this.idealTree.meta.hiddenLockfile = true
    this.actualTree = this.idealTree
    this.idealTree = null
    for (const path of this[_trashList]) {
      const loc = relpath(this.path, path)
      const node = this.actualTree.inventory.get(loc)
      if (node && node.root === this.actualTree)
        node.parent = null
    }

    return !this[_global] && this.actualTree.meta.save()
  }
}
