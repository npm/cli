const npa = require('npm-package-arg')
const { trustedSpecName } = require('./release-age-exclude.js')

const carriedNames = new WeakMap()

// Registry tarball exemptions widen fetch policy, so derive their package
// identity from valid dependency specs rather than package metadata.
const getRegistryPackageName = (node) => {
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
  for (const edge of node.edgesIn) {
    if (!edge.valid) {
      continue
    }
    let spec
    try {
      spec = npa.resolve(edge.name, edge.spec)
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

  // A project/workspace can select a fork for an installed slot also used
  // by ordinary transitive requirements. Explicit alias targets must agree.
  const identities = rootNames.size ? rootNames : names.size ? names : peerNames
  if (identities.size !== 1) {
    return null
  }
  const name = identities.values().next().value
  return [...aliases].every(alias => alias === name) ? name : null
}

const carryRegistryPackageName = (from, to) => {
  carriedNames.set(to, getRegistryPackageName(from))
}

module.exports = { carryRegistryPackageName, getRegistryPackageName }
