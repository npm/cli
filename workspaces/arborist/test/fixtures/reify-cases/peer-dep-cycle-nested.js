// generated from test/fixtures/peer-dep-cycle-nested
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/peer-dep-nested",
    "version": "1.0.0",
    "description": "dep -> a -> b -> c -> a",
    "dependencies": {
      "@isaacs/peer-dep-cycle": "1"
    }
  })
})
  return path
}
