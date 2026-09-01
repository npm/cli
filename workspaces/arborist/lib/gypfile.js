const { readFile } = require('node:fs/promises')
const { resolve } = require('node:path')
const PackageJson = require('@npmcli/package-json')

// `gypfile: false` opts a package out of the synthetic `node-gyp rebuild`
// install script npm adds when it finds a `binding.gyp`.
//
// The flag is only on the tree node when the node came from a packument or
// from disk. Lockfile-derived nodes (`npm ci`, a repeat `npm install`) carry
// no `gypfile` field at all, so the opt-out is invisible there and has to be
// read back off the installed package.json.
//
// `hasGypfileOptOut` is the read for callers whose subject is the package
// already on disk, such as the rebuild pass, which reads `binding.gyp` from
// the same directory in the same breath. A name and version check is all
// that is available there, and all that is needed: there is no second copy
// of the package for the disk copy to disagree with.
const hasGypfileOptOut = async (path, pkg, nodeName) => {
  if (pkg.gypfile !== undefined) {
    return pkg.gypfile === false
  }

  const name = pkg.name || nodeName
  const { version } = pkg
  if (!name || !version) {
    return false
  }

  const { content } = await PackageJson.load(path).catch(() => ({ content: {} }))
  if (content.name !== name || content.version !== version) {
    return false
  }

  return content.gypfile === false
}

// The identity of the package that is installed at `node.location` right now,
// taken from the hidden lockfile, which is written to describe the current
// contents of `node_modules`.
const readInstalledIdentity = async (root, location) => {
  const file = resolve(root.realpath, 'node_modules/.package-lock.json')
  const data = await readFile(file, 'utf8').then(JSON.parse).catch(() => ({}))
  return (data.packages || {})[location]
}

// Name and version do not identify a tarball. Two different tarballs can
// carry the same pair, so a package on disk that answers to the node's name
// and version is still not proof that it came from the node's source.
const matchesInstalledSource = async (node) => {
  const { resolved, integrity, location, root } = node
  if (!resolved || !integrity || !location || !root) {
    return false
  }

  const installed = await readInstalledIdentity(root, location)
  return !!installed &&
    installed.resolved === resolved &&
    installed.integrity === integrity
}

// `hasVerifiedGypfileOptOut` is the read for callers that enumerate the
// scripts a node *would* run, such as the strict allow-scripts preflight and
// `npm install-scripts`. Those run before reify replaces `node_modules`, so
// the subject is the node and the disk holds some other copy of the package.
// A stale `gypfile: false` accepted there lets the preflight pass while the
// later rebuild, which sees the real package, synthesises `node-gyp rebuild`
// anyway. So the source of the installed copy has to match the node's own
// before the disk read counts, and an identity we cannot establish counts as
// a mismatch. That is what npm did before the fallback existed.
const hasVerifiedGypfileOptOut = async (node) => {
  /* istanbul ignore next: arborist Nodes always carry a `package` object;
     defensive fallback for non-arborist callers. */
  const pkg = node.package || {}
  if (pkg.gypfile === undefined && !await matchesInstalledSource(node)) {
    return false
  }

  return hasGypfileOptOut(node.path, pkg, node.name)
}

module.exports = { hasGypfileOptOut, hasVerifiedGypfileOptOut }
