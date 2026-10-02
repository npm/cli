const { isNodeGypPackage } = require('@npmcli/node-gyp')
const PackageJson = require('@npmcli/package-json')

// Returns the install-relevant lifecycle scripts that would run for a
// given arborist Node, or `{}` if there are none.
//
// Includes:
//   - explicit preinstall/install/postinstall
//   - prepare, but only for non-registry sources (git, file, link, remote)
//   - synthetic `node-gyp rebuild`, when `binding.gyp` is present on disk
//     and the package does not opt out via `gypfile: false` or define its
//     own install / preinstall script

// Lifecycle-script enumeration boundary.
//
// IMPORTANT: this helper decides whether `prepare` should be included
// in the enumerated install scripts (true for non-registry sources only).
// It is NOT a policy-matching predicate. The policy matcher in
// script-allowed.js uses `isRegistryNode`, which is strictly tied to
// versionFromTgz(node.resolved). The two helpers exist separately on
// purpose:
//
//   - `hasNonRegistryShape` (here): "should we consider running prepare
//     on this node?" — a yes/no for what to enumerate.
//   - `isRegistryNode` (script-allowed.js): "do we trust this node's
//     identity enough to apply a policy entry?" — a security check.
//
// The looser fallback here (treating unknown-resolved nodes as registry,
// thus skipping `prepare`) is the safer default for enumeration: we'd
// rather omit a script we should have run than synthesise one for a
// non-registry source we couldn't confirm. The policy matcher's stricter
// behaviour is correct for its boundary; the two helpers must not be
// merged.
const hasNonRegistryShape = (node) => {
  if (typeof node.isRegistryDependency === 'boolean') {
    return !node.isRegistryDependency
  }
  if (!node.resolved) {
    return false
  }
  return !/^https?:\/\/[^/]+\/.+\/-\/[^/]+-\d/.test(node.resolved)
}

const getInstallScripts = async (node) => {
  /* istanbul ignore next: arborist Nodes always carry a `package` object;
     defensive fallbacks for non-arborist callers. */
  const pkg = node.package || {}
  let scripts = pkg.scripts || {}
  let { gypfile } = pkg
  const includePrepare = hasNonRegistryShape(node)
  const anyScript = scripts.preinstall || scripts.install || scripts.postinstall ||
    (includePrepare && scripts.prepare)
  let isGyp = !scripts.preinstall && !scripts.install && gypfile !== false &&
    await isNodeGypPackage(node.path).catch(() => false)
  let recoveredOptOut = false

  // Lockfiles omit scripts and gypfile. Recover both before inferring a
  // native build, including packages without a script-presence flag.
  if (isGyp || !anyScript && node.hasInstallScript === true) {
    const { content } = await PackageJson.normalize(node.path)
      .catch(() => ({ content: null }))
    // Before extraction, this path can still contain an older package.
    const matchesPackage = content && pkg.name && pkg.version &&
      content.name === pkg.name && content.version === pkg.version
    if (matchesPackage) {
      scripts = content.scripts || {}
      gypfile = content.gypfile
      recoveredOptOut = gypfile === false
    } else if (node.hasInstallScript === true) {
      isGyp = false
    }
  }

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
  if (scripts.prepare && includePrepare) {
    collected.prepare = scripts.prepare
  }

  if (isGyp && gypfile !== false && !scripts.preinstall && !scripts.install) {
    collected.install = 'node-gyp rebuild'
  }

  // A confirmed opt-out can disprove a stale flag left by native-build
  // detection. Otherwise keep the flag visible, including before extraction.
  if (Object.keys(collected).length === 0 && node.hasInstallScript === true && !recoveredOptOut) {
    collected.install = '(install scripts present)'
  }

  return collected
}

module.exports = getInstallScripts
module.exports.getInstallScripts = getInstallScripts
