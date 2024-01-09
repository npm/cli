const { basename, join, dirname, sep, posix } = require('path')

function ensureNavigationComplete (nav, fsPaths, ext) {
  const navPaths = getNavigationPaths(nav)
  const unmatchedNav = {}
  const unmatchedFs = {}

  for (const navPath of navPaths) {
    // every nav path starts as an unmatched fs path
    unmatchedFs[navPath] = true
  }

  for (const path of fsPaths) {
    const key = posix.sep + join(dirname(path), basename(path, ext)).split(sep).join(posix.sep)
    // for each fs path, if it exists in the nav we
    // unmark it as unmatched on the filesystem.
    // otherwise its unmarked in the nav
    if (unmatchedFs[key]) {
      delete unmatchedFs[key]
    } else {
      unmatchedNav[key] = true
    }
  }

  const toKeys = (v) => Object.keys(v).sort().map((p) => p.split(posix.sep).join(sep))
  const missingNav = toKeys(unmatchedNav)
  const missingFs = toKeys(unmatchedFs)

  const errors = []

  if (missingNav.length) {
    errors.push('The following path(s) exist on disk but are not present in nav.yml:')
    errors.push(...missingNav.map(n => `  ${n}`))
  }

  if (missingFs.length) {
    errors.push('The following path(s) exist in nav.yml but are not present on disk:')
    errors.push(...missingFs.map(n => `  ${n}`))
  }

  if (errors.length) {
    errors.unshift('Documentation navigation (nav.yml) does not match filesystem.')
    errors.push('Update nav.yml to ensure that all files are listed in the appropriate place.')
    throw new Error(errors.join('\n'))
  }
}

function getNavigationPaths (entries) {
  const paths = []

  for (const entry of entries) {
    if (entry.children) {
      paths.push(...getNavigationPaths(entry.children))
    } else {
      paths.push(entry.url)
    }
  }

  return paths
}

module.exports = ensureNavigationComplete
