const { isAbsolute, relative, resolve, sep } = require('node:path')
const npa = require('npm-package-arg')
const relpath = require('./relpath.js')

const isPathInside = path => path === '' ||
  (!isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`))

class PathCoordinates {
  constructor (logicalRoot, canonicalRoot = logicalRoot) {
    this.logicalRoot = resolve(logicalRoot)
    this.canonicalRoot = resolve(canonicalRoot)
    Object.freeze(this)
  }

  static fromRoot (root) {
    return root?.meta?.coordinates ||
      new PathCoordinates(root.path, root.realpath)
  }

  toLockfile (nodePath) {
    const absolute = resolve(this.logicalRoot, nodePath)
    if (!isAbsolute(nodePath)) {
      return relpath(this.logicalRoot, absolute)
    }

    const logical = relative(this.logicalRoot, absolute)
    if (isPathInside(logical)) {
      return relpath(this.logicalRoot, absolute)
    }

    const canonical = relative(this.canonicalRoot, absolute)
    if (this.canonicalRoot !== this.logicalRoot) {
      return isPathInside(canonical)
        ? relpath(this.logicalRoot, resolve(this.logicalRoot, canonical))
        : relpath(this.canonicalRoot, absolute)
    }
    return relpath(this.logicalRoot, absolute)
  }

  toFilesystem (location) {
    if (!isAbsolute(location)) {
      return resolve(this.canonicalRoot, location)
    }

    const logical = relative(this.logicalRoot, location)
    return this.canonicalRoot !== this.logicalRoot && isPathInside(logical)
      ? resolve(this.canonicalRoot, logical)
      : location
  }

  isInternal (location) {
    const path = this.toFilesystem(location)
    return isPathInside(relative(this.canonicalRoot, path))
  }

  toLockfileSpec (spec, base, fallback = spec) {
    if (typeof spec !== 'string' ||
        spec.includes('\u0000') ||
        (!spec.startsWith('file:') && !isAbsolute(spec))) {
      return fallback
    }

    try {
      const parsed = npa(spec, base)
      return `file:${this.toLockfile(parsed.fetchSpec)}`
    } catch {
      /* istanbul ignore next - npm-package-arg accepts arbitrary file paths */
      return fallback
    }
  }

  toFilesystemSpec (spec) {
    if (typeof spec !== 'string' ||
        spec.includes('\u0000') ||
        !spec.startsWith('file:')) {
      return spec
    }

    try {
      const parsed = npa(spec, this.canonicalRoot)
      return `file:${this.toFilesystem(parsed.fetchSpec)}`
    } catch {
      /* istanbul ignore next - npm-package-arg accepts arbitrary file paths */
      return spec
    }
  }
}

module.exports = PathCoordinates
