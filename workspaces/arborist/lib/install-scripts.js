const { isNodeGypPackage } = require('@npmcli/node-gyp')

// Returns the install-relevant lifecycle scripts that would run for a
// given arborist Node, or `{}` if there are none.
//
// Includes:
//   - explicit preinstall/install/postinstall
//   - prepare, but only for non-registry sources (git, file, link, remote)
//   - synthetic `node-gyp rebuild`, when `binding.gyp` is present on disk
//     and the package does not opt out via `gypfile: false` or define its
//     own install / preinstall script

const isRegistrySource = (node) => {
  // Prefer arborist's edge-based check when available — symmetric with
  // isRegistryNode in script-allowed.js. A node whose edges resolve to
  // non-registry specs must be treated as non-registry even if its
  // resolved URL happens to share the registry tarball shape.
  if (typeof node.isRegistryDependency === 'boolean') {
    return node.isRegistryDependency
  }
  if (!node.resolved) {
    // Without a resolved field or the arborist getter, fall back to
    // treating the node as a registry source. Used by lockfiles produced
    // with omit-lockfile-registry-resolved.
    return true
  }
  return /^https?:\/\/[^/]+\/.+\/-\/[^/]+-\d/.test(node.resolved)
}

const getInstallScripts = async (node) => {
  /* istanbul ignore next: arborist Nodes always carry a `package` object;
     defensive fallbacks for non-arborist callers. */
  const pkg = node.package || {}
  /* istanbul ignore next */
  const scripts = pkg.scripts || {}
  const collected = {}

  if (scripts.preinstall) {
    collected.preinstall = scripts.preinstall
  }
  if (scripts.install) {
    collected.install = scripts.install
  }
  if (scripts.postinstall) {
    collected.postinstall = scripts.postinstall
  }
  if (scripts.prepare && !isRegistrySource(node)) {
    collected.prepare = scripts.prepare
  }

  const hasExplicitGypGate = !!(collected.preinstall || collected.install)
  if (
    !hasExplicitGypGate &&
    pkg.gypfile !== false &&
    await isNodeGypPackage(node.path).catch(() => false)
  ) {
    collected.install = 'node-gyp rebuild'
  }

  // Lockfile-only nodes (e.g. `npm ci` before reify) carry
  // `hasInstallScript: true` but no enumerated scripts: the lockfile
  // records the presence flag but never the script bodies. Without this
  // fallback the strict-allow-scripts preflight would miss them entirely
  // and let postinstall run. We can't recover the real script body
  // without fetching the manifest, so emit a sentinel describing that
  // install scripts are present.
  if (Object.keys(collected).length === 0 && node.hasInstallScript === true) {
    collected.install = '(install scripts present)'
  }

  return collected
}

module.exports = getInstallScripts
module.exports.getInstallScripts = getInstallScripts
