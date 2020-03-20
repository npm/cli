// a module that manages a shrinkwrap file (npm-shrinkwrap.json or
// package-lock.json).

// Increment whenever the lockfile version updates
// v1 - npm <=6
// v2 - arborist v1, npm v7, backwards compatible with v1, add 'packages'
// v3 will drop the 'dependencies' field, backwards comp with v2, not v1
//
// We cannot bump to v3 until npm v6 is out of common usage, and
// definitely not before npm v8.

const lockfileVersion = 2

// don't update this.data right away when doing this.add(node) Just add the
// node to a set of nodes needing an update.  When this.get(location) or
// this.save() is called, then update the data for the location(s) in question.
// That way, it doesn't matter whether the node.devOptional/etc is set when
// adding, since we'll look at it's current state when it's time to check,
// which will be when the caller is ready to do something with the data.

// It's tempting to handle yarn.lock files here as well.  However, since they
// don't capture the shape of the tree, they're not useful for most of the
// cases we care about.  We load them in this class because it's convenient
// to do so while loading other lock files, but they're not kept automatically
// in sync.  Rather, if present, they're just used as a fallback, and updated
// all at once at the end with the state of the fully realized tree.

const YarnLock = require('./yarn-lock.js')
const {promisify} = require('util')
const rimraf = promisify(require('rimraf'))
const fs = require('fs')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const link = promisify(fs.link)
const { resolve, dirname, basename } = require('path')
const specFromLock = require('./spec-from-lock.js')
const versionFromTgz = require('./version-from-tgz.js')
const npa = require('npm-package-arg')
const rpj = require('read-package-json-fast')
const parseJSON = require('parse-conflict-json')

const stringify = require('json-stringify-nice')
const swKeyOrder = [
  'name',
  'version',
  'lockfileVersion',
  'resolved',
  'integrity',
  'requires',
  'packages',
  'dependencies',
]

// sometimes resolved: is weird or broken, or something npa can't handle
const specFromResolved = resolved => {
  try {
    return npa(resolved)
  } catch (er) {
    return {}
  }
}

const relpath = require('./relpath.js')

const consistentResolve = require('./consistent-resolve.js')

const maybeReadFile = file => {
  return readFile(file, 'utf8').then(d => d, er => {
    /* istanbul ignore else - can't test without breaking module itself */
    if (er.code === 'ENOENT')
      return ''
    else
      throw er
  })
}

const pkgMetaKeys = [
  'name',
  'version',
  'dependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'optionalDependencies',
  'bundleDependencies',
  'acceptDependencies',
  'funding',
  'engines',
  'os',
  'cpu',
  '_integrity',
  'license',
  '_hasShrinkwrap',
  'hasInstallScript',
  'bin',
]

const nodeMetaKeys = [
  'integrity',
  'inBundle',
  'hasShrinkwrap',
  'hasInstallScript',
]

const metaFieldFromPkg = (pkg, key) => {
  const val = pkg[key]
  // get the license type, not an object
  return (key === 'license' && val && typeof val === 'object' && val.type)
    ? val.type
    // skip empty objects and falsey values
    : (val && !(typeof val === 'object' && !Object.keys(val).length))
    ? val
    : null
}
const _awaitingUpdate = Symbol('_awaitingUpdate')
const _updateWaitingNode = Symbol('_updateWaitingNode')
const _lockFromLoc = Symbol('_lockFromLoc')
const _createLockFromLoc = Symbol('_createLockFromLoc')
const _pathToLoc = Symbol('_pathToLoc')
const _loadAll = Symbol('_loadAll')
const _metaFromLock = Symbol('_metaFromLock')
const _resolveMetaNode = Symbol('_resolveMetaNode')
const _fixDependencies = Symbol('_fixDependencies')
class Shrinkwrap {
  static load (options) {
    return new Shrinkwrap(options).load()
  }

  static metaFromNode (node, path) {
    if (node.isLink)
      return {
        resolved: relpath(path, node.realpath),
        link: true,
      }

    const meta = {}
    pkgMetaKeys.forEach(key => {
      const val = metaFieldFromPkg(node.package, key)
      if (val)
        meta[key.replace(/^_/, '')] = val
    })

    if (node.isTop && node.package.devDependencies)
      meta.devDependencies = node.package.devDependencies

    nodeMetaKeys.forEach(key => {
      if (node[key])
        meta[key] = node[key]
    })

    const res = node.resolved || node.package._resolved
    const resolved = consistentResolve(res, node.path, path)
    if (resolved && (node.resolved || !/^file:/.test(resolved)))
      meta.resolved = resolved

    if (node.extraneous)
      meta.extraneous = true
    else {
      if (node.peer)
        meta.peer = true
      if (node.dev)
        meta.dev = true
      if (node.optional)
        meta.optional = true
      if (node.devOptional && !node.dev && !node.optional)
        meta.devOptional = true
    }
    return meta
  }

  constructor (options = {}) {
    const {
      path,
      indent = 2,
      shrinkwrapOnly = false,
      hiddenLockfile = false,
    } = options
    this[_awaitingUpdate] = new Map()
    this.path = resolve(path || '.')
    this.filename = null
    this.data = null
    this.indent = indent
    this.loadedFromDisk = false
    this.type = null
    this.yarnLock = null
    this.hiddenLockfile = hiddenLockfile
    // only load npm-shrinkwrap.json in dep trees, not package-lock
    this.shrinkwrapOnly = shrinkwrapOnly
  }

  // throw away the shrinkwrap data so we can start fresh
  // still worth doing a load() first so we know which files to write.
  reset () {
    this.data = {
      lockfileVersion,
      requires: true,
      packages: {},
      dependencies: {},
    }
  }

  load () {
    // we don't need to load package-lock.json except for top of tree nodes,
    // only npm-shrinkwrap.json.
    return Promise.all(this.shrinkwrapOnly ? [
      maybeReadFile(this.path + '/npm-shrinkwrap.json'),
    ] : this.hiddenLockfile ? [
      null,
      maybeReadFile(this.path + '/node_modules/.package-lock.json'),
    ] : [
      maybeReadFile(this.path + '/npm-shrinkwrap.json'),
      maybeReadFile(this.path + '/package-lock.json'),
      maybeReadFile(this.path + '/yarn.lock'),
    ]).then(([sw, lock, yarn]) => {
      const data = lock || sw || ''
      // don't use detect-indent, just pick the first line.
      const indent = data.match(/^\{\n([\s\t]+)/)
      if (indent)
        this.indent = indent[1]
      // use shrinkwrap only for deps, otherwise prefer package-lock
      // and ignore npm-shrinkwrap if both are present.
      // TODO: emit a warning here or something if both are present.
      this.filename = `${this.path}/${
        this.hiddenLockfile ? 'node_modules/.package-lock'
          : this.shrinkwrapOnly || sw && !lock ? 'npm-shrinkwrap'
          : 'package-lock'
      }.json`
      this.type = basename(this.filename)
      this.loadedFromDisk = !!data

      if (yarn) {
        this.yarnLock = new YarnLock()
        // ignore invalid yarn data.  we'll likely clobber it later anyway.
        try { this.yarnLock.parse(yarn) } catch (_) {}
      }

      return data ? parseJSON(data) : {}
    }).catch(er => {
      this.loadedFromDisk = false
      return {}
    }).then(lock => {
      this.data = {
        ...lock,
        lockfileVersion,
        requires: true,
        packages: lock.packages || {},
        ...(this.hiddenLockfile ? {} : {dependencies: lock.dependencies || {}}),
      }
      this.originalLockfileVersion = lock.lockfileVersion
      // load old lockfile deps into the packages listing
      if (lock.dependencies && !lock.packages) {
        return rpj(this.path + '/package.json').then(pkg => pkg, er => ({}))
          .then(pkg => {
            this[_loadAll]('', null, this.data)
            this[_fixDependencies](pkg)
            return this
          })
      }

      return this
    })
  }


  // v1 lockfiles track the optional/dev flags, but they don't tell us
  // which thing had what kind of dep on what other thing, so we need
  // to correct that now, or every link will be considered prod
  [_fixDependencies] (pkg) {
    // we need the root package.json because legacy shrinkwraps just
    // have requires:true at the root level, which is even less useful
    // than merging all dep types into one object.
    const root = this.data.packages['']
    pkgMetaKeys.forEach(key => {
      const val = metaFieldFromPkg(pkg, key)
      const k = key.replace(/^_/, '')
      if (val)
        root[k] = val
    })

    for (const [loc, meta] of Object.entries(this.data.packages)) {
      if (!meta.requires || !loc)
        continue

      // resolve each require to a meta entry
      // if this node isn't optional, but the dep is, then it's an optionalDep
      // likewise for dev deps.
      // This isn't perfect, but it's a pretty good approximation, and at
      // least gets us out of having all 'prod' edges, which throws off the
      // buildIdealTree process
      for (const [name, spec] of Object.entries(meta.requires)) {
        const dep = this[_resolveMetaNode](loc, name)
        // this overwrites the false value set above
        const depType = dep && dep.optional && !meta.optional
          ? 'optionalDependencies'
          : /* istanbul ignore next - dev deps are only for the root level */
            dep && dep.dev && !meta.dev ? 'devDependencies'
          // also land here if the dep just isn't in the tree, which maybe
          // should be an error, since it means that the shrinkwrap is
          // invalid, but we can't do much better without any info.
          : 'dependencies'
        meta[depType] = meta[depType] || {}
        meta[depType][name] = spec
      }
      delete meta.requires
    }
  }

  [_resolveMetaNode] (loc, name) {
    for (let path = loc; true; path = path.replace(/(^|\/)[^\/]*$/, '')) {
      const check = `${path}${path ? '/' : ''}node_modules/${name}`
      if (this.data.packages[check])
        return this.data.packages[check]

      if (!path)
        break
    }
    return null
  }


  [_loadAll] (location, name, lock) {
    // migrate a v1 package lock to the new format.
    this[_metaFromLock](location, name, lock)
    if (lock.dependencies) {
      Object.keys(lock.dependencies).forEach(name =>
        this[_loadAll](
          location + (location ? '/' : '') + 'node_modules/' + name,
          name,
          lock.dependencies[name]
        ))
    }
  }

  [_lockFromLoc] (lock, path, i = 0) {
    if (!lock)
      return null

    if (path[i] === '')
      i++

    if (i >= path.length)
      return lock

    if (!lock.dependencies)
      return null

    return this[_lockFromLoc](lock.dependencies[path[i]], path, i + 1)
  }

  [_createLockFromLoc] (lock, path, i = 0) {
    if (path[i] === '')
      i++

    if (i === path.length)
      return lock

    lock.dependencies = lock.dependencies || {}
    lock.dependencies[path[i]] = lock.dependencies[path[i]] || {}
    return this[_createLockFromLoc](lock.dependencies[path[i]], path, i + 1)
  }

  // pass in a path relative to the root path, or an absolute path,
  // get back a /-normalized location based on root path.
  [_pathToLoc] (path) {
    return relpath(this.path, resolve(this.path, path))
  }

  delete (nodePath) {
    if (!this.data)
      throw new Error('run load() before getting or setting data')
    const location = this[_pathToLoc](nodePath)
    this[_awaitingUpdate].delete(location)

    delete this.data.packages[location]
    const path = location.split(/(?:^|\/)node_modules\//)
    const name = path.pop()
    const pLock = this[_lockFromLoc](this.data, path)
    if (pLock && pLock.dependencies)
      delete pLock.dependencies[name]
  }

  get (nodePath) {
    if (!this.data)
      throw new Error('run load() before getting or setting data')

    const location = this[_pathToLoc](nodePath)
    if (this[_awaitingUpdate].has(location))
      this[_updateWaitingNode](location)

    // first try to get from the newer spot, which we know has
    // all the things we need.
    if (this.data.packages[location])
      return this.data.packages[location]

    // otherwise, fall back to the legacy metadata, and hope for the best
    // get the node in the shrinkwrap corresponding to this spot
    const path = location.split(/(?:^|\/)node_modules\//)
    const name = path[path.length - 1]
    const lock = this[_lockFromLoc](this.data, path)

    return this[_metaFromLock](location, name, lock)
  }

  [_metaFromLock] (location, name, lock) {
    // This function tries as hard as it can to figure out the metadata
    // from a lockfile which may be outdated or incomplete.  Since v1
    // lockfiles used the "version" field to contain a variety of
    // different possible types of data, this gets a little complicated.
    if (!lock)
      return {}

    const meta = {}
    // when calling loadAll we'll change these into proper dep objects
    if (lock.requires && typeof lock.requires === 'object')
      meta.requires = lock.requires

    if (lock.optional)
      meta.optional = true
    if (lock.dev)
      meta.dev = true

    // the root will typically have a name from the root project's
    // package.json file.
    if (location === '')
      meta.name = lock.name

    // if we have integrity, save it now.
    if (lock.integrity)
      meta.integrity = lock.integrity

    // try to figure out a npm-package-arg spec from the lockfile entry
    // This will return null if we could not get anything valid out of it.
    const spec = specFromLock(name, lock, this.path)

    if (spec.type === 'directory') {
      // the "version" was a file: url to a non-tarball path
      // this is a symlink dep.  We don't store much metadata
      // about symlinks, just the target.
      meta.link = true
      meta.resolved = relpath(this.path, spec.fetchSpec)
      return this.data.packages[location] = meta
    }

    if (lock.version && !lock.integrity) {
      // this is usually going to be a git url or symlink, but it could
      // also be a registry dependency that did not have integrity at
      // the time it was saved.
      // Symlinks were already handled above, so that leaves git.
      //
      // For git, always save the full SSH url.  we'll actually fetch the
      // tgz most of the time, since it's faster, but it won't work for
      // private repos, and we can't get back to the ssh from the tgz,
      // so we store the ssh instead.
      // For unknown git hosts, just resolve to the raw spec in lock.version
      if (spec.type === 'git') {
        meta.resolved = consistentResolve(spec, this.path, this.path)

        // return early because there is nothing else we can do with this
        return this.data.packages[location] = meta
      } else if (spec.registry) {
        // registry dep that didn't save integrity.  grab the version, and
        // fall through to pick up the resolved and potentially name.
        meta.version = lock.version
      }
      // only other possible case is a tarball without integrity.
      // fall through to do what we can with the filename later.
    }

    // at this point, we know that the spec is either a registry dep
    // (ie, version, because locking, which means a resolved url),
    // or a remote dep, or file: url.  Remote deps and file urls
    // have a fetchSpec equal to the fully resolved thing.
    // Registry deps, we take what's in the lockfile.
    if (lock.resolved || (spec.type && !spec.registry)) {
      if (spec.registry)
        meta.resolved = lock.resolved
      else if (spec.type === 'file')
        meta.resolved = consistentResolve(spec, this.path, this.path)
      else if (spec.fetchSpec)
        meta.resolved = spec.fetchSpec
    }

    // at this point, if still we don't have a version, do our best to
    // infer it from the tarball url/file.  This works a surprising
    // amount of the time, even though it's not guaranteed.
    if (!meta.version) {
      if (spec.type === 'file' || spec.type === 'remote') {
        const fromTgz = versionFromTgz(spec.name, spec.fetchSpec)
          || versionFromTgz(spec.name, meta.resolved)
        if (fromTgz) {
          meta.version = fromTgz.version
          if (fromTgz.name !== name)
            meta.name = fromTgz.name
        }
      } else if (spec.type === 'alias') {
        meta.name = spec.subSpec.name
        meta.version = spec.subSpec.fetchSpec
      } else if (spec.type === 'version')
        meta.version = spec.fetchSpec
      // ok, I did my best!  good luck!
    }

    if (lock.bundled)
      meta.inBundle = true

    // save it for next time
    return this.data.packages[location] = meta
  }

  add (node) {
    if (!this.data)
      throw new Error('run load() before getting or setting data')

    // will be actually updated on read
    const loc = relpath(this.path, node.path)
    this[_awaitingUpdate].set(loc, node)
    return
  }

  [_updateWaitingNode] (loc) {
    const node = this[_awaitingUpdate].get(loc)
    this[_awaitingUpdate].delete(loc)

    const meta = Shrinkwrap.metaFromNode(node, this.path)
    this.data.packages[loc] = meta

    // hidden lockfiles don't include legacy metadata
    if (this.hiddenLockfile)
      return

    const path = loc.split(/(?:^|\/)node_modules\//)

    // legacy shrinkwraps don't track nodes outside of node_modules
    if (!node.parent && node.path !== this.path)
      return

    const lock = this[_createLockFromLoc](this.data, path)

    // set legacy shrinkwrap data
    if (node.path === this.path) {
      lock.name = node.package.name || node.name
      if (node.package && node.package.version)
        lock.version = node.package.version
    }

    // npm v6 and before tracked 'from', meaning "the request that led
    // to this package being installed".  However, that's inherently
    // racey and non-deterministic in a world where deps are deduped
    // ahead of fetch time.  In order to maintain backwards compatibility
    // with v6 in the lockfile, we do this trick where we pick a valid
    // dep link out of the edgesIn set.  Choose the edge with the fewest
    // number of `node_modules` sections in the requestor path, and then
    // lexically sort afterwards.
    const edge = [...node.edgesIn].filter(edge => edge.valid).sort((a, b) => {
      const aloc = a.from.location.split('node_modules')
      const bloc = b.from.location.split('node_modules')
      /* istanbul ignore next - sort calling order is indeterminate */
      return aloc.length > bloc.length ? 1
        : bloc.length > aloc.length ? -1
        : aloc[aloc.length - 1].localeCompare(bloc[bloc.length - 1])
    })[0]
    // if we don't have one, just an empty object so nothing matches below
    // This will effectively just save the version and resolved, as if it's
    // a standard version/range dep, which is a reasonable default.
    const spec = !edge ? {}
      : npa.resolve(node.name, edge.spec, edge.from.realpath)

    const rSpec = specFromResolved(node.resolved)

    if (node.target)
      lock.version = `file:${relpath(this.path, node.realpath)}`
    else if (spec && (spec.type === 'file' || spec.type === 'remote'))
      lock.version = spec.saveSpec
    else if (spec && spec.type === 'git' || rSpec && rSpec.type === 'git') {
      lock.version = node.resolved
      /* istanbul ignore else - don't think there are any cases where a git
       * spec (or indeed, ANY npa spec) doesn't have a .raw member */
      if (spec.raw)
        lock.from = spec.raw
    } else if (!node.isRoot &&
        node.package &&
        node.package.name &&
        node.package.name !== node.name)
      lock.version = `npm:${node.package.name}@${node.package.version}`
    else if (node.package && node.package.version)
      lock.version = node.package.version

    if (node.inBundle)
      lock.bundled = true

    // when we didn't resolve to git, file, or dir, and didn't request
    // git, file, dir, or remote, then the resolved value is necessary.
    if (node.resolved &&
        !node.target &&
        rSpec.type !== 'git' &&
        rSpec.type !== 'file' &&
        rSpec.type !== 'directory' &&
        spec.type !== 'directory' &&
        spec.type !== 'git' &&
        spec.type !== 'file' &&
        spec.type !== 'remote')
      lock.resolved = node.resolved

    if (node.integrity)
      lock.integrity = node.integrity

    // XXX: may need to clean up old flags if lock updated multiple times
    // If we see things like "extraneous":true,"optional":true, then that'll
    // be an indication that the lock is updating multiple times, and we'll
    // have to delete keys that are no longer valid.
    if (node.extraneous)
      lock.extraneous = true
    else if (!node.isLink) {
      if (node.peer)
        lock.peer = true

      if (node.devOptional && !node.dev && !node.optional)
        lock.devOptional = true

      if (node.dev)
        lock.dev = true

      if (node.optional)
        lock.optional = true
    }

    if (node.edgesOut.size > 0) {
      if (node.path !== this.path) {
        lock.requires = [...node.edgesOut.entries()].reduce((set, [k, v]) => {
          set[k] = v.spec
          return set
        }, {})
      } else {
        lock.requires = true
      }
    }
  }

  commit () {
    if (this[_awaitingUpdate].size > 0) {
      for (const loc of this[_awaitingUpdate].keys()) {
        this[_updateWaitingNode](loc)
      }
    }

    // hidden lockfiles don't include legacy metadata
    if (this.hiddenLockfile)
      delete this.data.dependencies

    return this.data
  }

  save () {
    if (!this.data)
      throw new Error('run load() before saving data')

    const json = stringify(this.commit(), swKeyOrder, this.indent)
    return Promise.all([
      writeFile(this.filename, json).catch(er => {
        if (this.hiddenLockfile) {
          // well, we did our best.
          // if we reify, and there's nothing there, then it might be lacking
          // a node_modules folder, but then the lockfile is not important.
          // Remove the file, so that in case there WERE deps, but we just
          // failed to update the file for some reason, it's not out of sync.
          return rimraf(this.filename)
        }
        throw er
      }),
      this.yarnLock && this.yarnLock.entries.size &&
        writeFile(this.path + '/yarn.lock', this.yarnLock.toString())
    ])
  }
}

module.exports = Shrinkwrap
