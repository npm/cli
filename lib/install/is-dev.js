'use strict'
module.exports = isDev

// Returns true if the module `node` is a dev dependency itself or a
// dependency of some dev dependency higher in the hierarchy.
function isDev (node, seen) {
  if (!seen) seen = new Set()
  if (seen.has(node.package.name)) return true

  seen.add(node.package.name)
  if (!node.requiredBy || node.requiredBy.length === 0 || node.package._development || node.isTop) {
    return !!node.package._development
  }

  return node.requiredBy.some((parent) => {
    return isDev(parent, seen)
  })
}
