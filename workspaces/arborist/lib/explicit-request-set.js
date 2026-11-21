// Explicit requests override omission for the requested package and the
// dependencies needed to use it. Omitted edge types below it stay omitted.
module.exports = (requests, omit) => {
  const included = new Set()
  if (!omit.size) {
    return included
  }
  const queue = [...requests].map(edge => edge?.to).filter(Boolean)
  while (queue.length) {
    const node = queue.pop()
    if (included.has(node)) {
      continue
    }
    included.add(node)
    if (node.isLink) {
      queue.push(node.target)
    }
    for (const edge of node.edgesOut.values()) {
      if (edge.to && !(edge.dev && omit.has('dev') ||
          edge.optional && omit.has('optional') ||
          edge.peer && omit.has('peer'))) {
        queue.push(edge.to)
      }
    }
  }
  return included
}
