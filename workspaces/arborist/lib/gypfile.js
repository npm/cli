const PackageJson = require('@npmcli/package-json')

// `gypfile: false` opts a package out of the synthetic `node-gyp rebuild`
// install script npm adds when it finds a `binding.gyp`.
//
// The flag is only on the tree node when the node came from a packument or
// from disk. Lockfile-derived nodes (`npm ci`, a repeat `npm install`) carry
// no `gypfile` field at all, so the opt-out is invisible there and has to be
// read back off the installed package.json.
//
// The disk read is only trustworthy when the package.json at `path` is the
// package the node describes. The strict allow-scripts preflight runs before
// reify replaces `node_modules`, so `path` can still hold a different version
// of the package, or a different package altogether. Trusting a stale
// `gypfile: false` there would let the preflight pass while the later rebuild
// (which sees the real package) synthesises `node-gyp rebuild` anyway. So the
// name and the version on disk must match the node before the flag counts.
// Without both, treat the opt-out as absent, which is what npm did before the
// fallback existed.
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

module.exports = { hasGypfileOptOut }
