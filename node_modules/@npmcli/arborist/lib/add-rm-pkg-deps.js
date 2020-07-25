// add and remove dependency specs to/from pkg manifest

const relpath = require('./relpath.js')

const removeFromOthers = (name, type, pkg) => {
  const others = new Set([
    'dependencies',
    'optionalDependencies',
    'devDependencies',
    'peerDependenciesMeta',
    'peerDependencies',
  ])

  switch (type) {
    case 'prod':
      others.delete('dependencies')
      break
    case 'dev':
      others.delete('devDependencies')
      break
    case 'optional':
      others.delete('optionalDependencies')
      break
    case 'peer':
    case 'peerOptional':
      others.delete('peerDependencies')
      others.delete('peerDependenciesMeta')
      break
  }

  for (const other of others) {
    deleteSubKey(pkg, other, name)
  }
}

const add = ({pkg, add, saveBundle, saveType, path}) => {
  for (const spec of add) {
    addSingle({pkg, spec, saveBundle, saveType, path})
  }
  return pkg
}

const addSingle = ({pkg, spec, saveBundle, saveType, path}) => {
  if (!saveType)
    saveType = getSaveType(pkg, spec)

  const {name, rawSpec, type: specType, fetchSpec } = spec
  removeFromOthers(name, saveType, pkg)
  const type = saveType === 'prod' ? 'dependencies'
    : saveType === 'dev' ? 'devDependencies'
    : saveType === 'optional' ? 'optionalDependencies'
    : saveType === 'peer' || saveType === 'peerOptional' ? 'peerDependencies'
    : /* istanbul ignore next */ null

  pkg[type] = pkg[type] || {}
  if (rawSpec !== '' || pkg[type][name] === undefined) {
    // if we're in global mode, file specs are based on cwd, not arb path
    pkg[type][name] = specType === 'file' ? `file:${relpath(path, fetchSpec)}`
      : (rawSpec || '*')
  }

  if (saveType === 'peer' || saveType === 'peerOptional') {
    const pdm = pkg.peerDependenciesMeta || {}
    if (saveType === 'peer' && pdm[name] && pdm[name].optional)
      pdm[name].optional = false
    else if (saveType === 'peerOptional') {
      pdm[name] = pdm[name] || {}
      pdm[name].optional = true
      pkg.peerDependenciesMeta = pdm
    }
  }

  if (saveBundle) {
    // keep it sorted, keep it unique
    const bd = new Set(pkg.bundleDependencies || [])
    bd.add(spec.name)
    pkg.bundleDependencies = [...bd].sort((a, b) => a.localeCompare(b))
  }
}

const getSaveType = (pkg, spec) => {
  const {name} = spec
  const {
    // these names are so lonnnnngggg
    dependencies: deps,
    devDependencies: devDeps,
    optionalDependencies: optDeps,
    peerDependencies: peerDeps,
    peerDependenciesMeta: peerDepsMeta,
  } = pkg

  if (devDeps && devDeps[name] !== undefined)
    return 'dev'
  else if (optDeps && optDeps[name] !== undefined)
    return 'optional'
  else if (peerDeps && peerDeps[name] !== undefined) {
    if (peerDepsMeta && peerDepsMeta[name] && peerDepsMeta[name].optional)
      return 'peerOptional'
    else
      return 'peer'
  } else
    return 'prod'
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
