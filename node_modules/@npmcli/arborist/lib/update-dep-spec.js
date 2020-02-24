// given a dep name and spec, update it wherever it exists in
// the manifest, or add the spec to 'dependencies' if not found.

module.exports = (pkg, name, newSpec) => {
  const type = findType(pkg, name)
  pkg[type] = pkg[type] || {}
  pkg[type][name] = newSpec
  return pkg
}

const types = [
  'peerDependencies',
  'devDependencies',
  'optionalDependencies',
  'dependencies',
]

const findType = (pkg, name) => {
  for (const t of types) {
    if (pkg[t] && typeof pkg[t] === 'object' && pkg[t][name] !== undefined)
      return t
  }
  return 'dependencies'
}
