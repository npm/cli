// take a path and a resolved value, and turn it into a resolution from
// the given new path.  This is used with converting a package.json's
// relative file: path into one suitable for a lockfile, or between
// lockfiles, and for converting hosted git repos to a consistent url type.
const npa = require('npm-package-arg')
const relpath = require('./relpath.js')

const consistentResolve = (resolved, fromPath, toPath, relPaths = false) => {
  if (!resolved) {
    return null
  }

  try {
    const hostedOpt = { noCommittish: false }
    const {
      fetchSpec,
      saveSpec,
      type,
      hosted,
      rawSpec,
      raw,
    } = npa(resolved, fromPath)
    const isPath = type === 'file' || type === 'directory'

    if (isPath && !relPaths) {
      return `file:${fetchSpec.replace(/#/g, '%23')}`
    }

    if (isPath) {
      if (toPath) {
        return 'file:' + relpath(toPath, fetchSpec.replace(/#/g, '%23'))
      } else {
        return 'file:' + fetchSpec.replace(/#/g, '%23')
      }
    }

    if (hosted) {
      if (hosted.default === 'https') {
        return `git+${hosted.https(hostedOpt)}`
      } else {
        return `git+${hosted.sshurl(hostedOpt)}`
      }
    }

    if (type === 'git') {
      return saveSpec
    }

    if (rawSpec === '' && raw.slice(-1) !== '@') {
      // always return something.  'foo' is interpreted as 'foo@' otherwise.
      return raw
    }

    // just strip off the name, but otherwise return as-is
    return rawSpec
  } catch (_) {
    // whatever we passed in was not acceptable to npa.
    // leave it 100% untouched.
    return resolved
  }
}
module.exports = consistentResolve
