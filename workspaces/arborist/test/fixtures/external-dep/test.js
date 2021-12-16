const t = require('tap')

const printEdge = edge => ({
  from: edge.from.location,
  name: edge.name,
  ...(edge.spec !== '' ? { spec: edge.spec } : {}),
  ...(edge.to ? { to: edge.to.location } : {}),
  ...(edge.error ? { error: edge.error } : {}),
})

t.test('check resolution', async t => {
  const Arborist = require('../')
  const arb = new Arborist({ path: __dirname + '/root' })
  const tree = await arb.loadActual()
  let ok = true
  for (const node of [tree, ...tree.inventory.values()]) {
    for (const edge of node.edgesOut.values()) {
      t.equal(edge.valid, true, edge.name, { edge: printEdge(edge), at: null })
    }
  }
})
