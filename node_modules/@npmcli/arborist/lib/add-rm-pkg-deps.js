// add and remove dependency specs to/from pkg manifest

const removeFromOthers = (name, type, pkg) => {
  const others = new Set([
    'dependencies',
    'optionalDependencies',
    'devDependencies',
  ])
  // these two ride along together
  if (type !== 'peerDependencies' && type !== 'peerDependenciesMeta') {
    others.delete(type)
    others.add('peerDependenciesMeta')
    others.add('peerDependencies')
  }
  for (const other of others) {
    deleteSubKey(pkg, other, name)
  }
}

const add = (pkg, add) => {
  // if adding to one kind of dependency set, remove from others
  for (const [type, specs] of Object.entries(add)) {
    if (type === 'bundleDependencies') {
      pkg.bundleDependencies = pkg.bundleDependencies || []
      pkg.bundleDependencies.push(...specs)
    } else {
      // keep the existing value if it's ''
      for (const [name, spec] of Object.entries(specs)) {
        removeFromOthers(name, type, pkg)
        pkg[type] = pkg[type] || {}
        if (spec !== '' || pkg[type][name] === undefined)
          pkg[type][name] = spec
      }
    }
  }
  return pkg
}

const deleteSubKey = (obj, k, sk) => {
  if (obj[k]) {
    delete obj[k][sk]
    if (!Object.keys(obj[k]).length)
      delete obj[k]
  }
}

const rm = (pkg, rm) => {
  for (const type of [
    'dependencies',
    'optionalDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
    'devDependencies',
  ]) {
    for (const name of rm) {
      deleteSubKey(pkg, type, name)
    }
  }
  if (pkg.bundleDependencies) {
    pkg.bundleDependencies = pkg.bundleDependencies
      .filter(name => !rm.includes(name))
    if (!pkg.bundleDependencies.length)
      delete pkg.bundleDependencies
  }
  return pkg
}

module.exports = { add, rm }
