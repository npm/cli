// some utils that we use in a bunch of tests

const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')
const normalizePaths = obj => {
  if (obj instanceof Set) {
    return new Set(normalizePaths([...obj]))
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizePaths)
  }

  if (typeof obj === 'string') {
    return normalizePath(obj)
  }

  if (obj instanceof Map) {
    return new Map([...obj].map(([name, val]) => [name, normalizePaths(val)]))
  }

  for (const key in obj) {
    if (['location', 'path', 'realpath', 'resolved', 'spec'].includes(key)) {
      obj[key] = normalizePath(obj[key])
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      obj[key] = normalizePaths(obj[key])
    }
  }
  return obj
}

const printTree = tree => normalizePaths(tree.toJSON())

module.exports = {
  normalizePath,
  normalizePaths,
  printTree,
}
