const npa = require('npm-package-arg')
const depValid = require('./dep-valid.js')
const { trustedSpecName } = require('./release-age-exclude.js')

const carriedNames = new WeakMap()

// Registry tarball exemptions widen fetch policy, so derive trusted names
// from valid dependency specs rather than package metadata.
const getRegistryPackageNames = (node) => {
  if (carriedNames.has(node)) {
    return carriedNames.get(node)
  }
  if (!node.edgesIn || typeof node.edgesIn[Symbol.iterator] !== 'function') {
    return null
  }

  const names = new Set()
  const peerNames = new Set()
  const rootNames = new Set()
  const aliases = new Set()
  const inDepBundle = node.inDepBundle
  for (const edge of node.edgesIn) {
    if (!edge.valid) {
      continue
    }
    let spec
    try {
      const requested = inDepBundle || edge.overrides?.keySpec &&
        !depValid(node, edge.spec, edge.accept, edge.from) ? edge.rawSpec : edge.spec
      spec = npa.resolve(edge.name, requested)
    } catch {
      return null
    }
    if (!spec.registry) {
      return null
    }
    const name = trustedSpecName(spec)
    if (!name) {
      return null
    }
    if (spec.type === 'alias') {
      aliases.add(name)
    }
    // Ordinary peers constrain the installed slot, not an alias's target.
    // An explicit peer alias still selects a target and must agree.
    if (edge.peer && spec.type !== 'alias') {
      peerNames.add(name)
    } else {
      names.add(name)
      if (edge.from?.isProjectRoot || edge.from?.isWorkspace) {
        rootNames.add(name)
      }
    }
  }

  // Root/workspace selections take precedence over ordinary transitive
  // requirements. Explicit aliases must agree; the caller checks whether
  // different selected names share a registry under the current options.
  const selectedNames = rootNames.size ? rootNames : names.size ? names : peerNames
  if (!selectedNames.size || aliases.size > 1) {
    return null
  }
  return new Set([...selectedNames, ...aliases])
}

const carryRegistryPackageNames = (from, to) => {
  carriedNames.set(to, getRegistryPackageNames(from))
}

module.exports = { carryRegistryPackageNames, getRegistryPackageNames }
