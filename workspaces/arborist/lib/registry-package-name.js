const npa = require('npm-package-arg')
const { trustedSpecName } = require('./release-age-exclude.js')

const carriedNames = new WeakMap()

// Registry tarball exemptions widen fetch policy, so derive their package
// identity from valid dependency specs and require every such edge to agree.
const getRegistryPackageName = (node) => {
  if (carriedNames.has(node)) {
    return carriedNames.get(node)
  }
  if (!node.edgesIn || typeof node.edgesIn[Symbol.iterator] !== 'function') {
    return null
  }

  const names = new Set()
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
    names.add(name)
  }

  return names.size === 1 ? names.values().next().value : null
}

const carryRegistryPackageName = (from, to) => {
  carriedNames.set(to, getRegistryPackageName(from))
}

module.exports = { carryRegistryPackageName, getRegistryPackageName }
