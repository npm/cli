// generated from test/fixtures/prune-actual
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "abbrev": {
      "package.json": JSON.stringify({
        "name": "abbrev",
        "version": "1.1.1"
      })
    }
  },
  "package.json": JSON.stringify({
    "name": "prune-actual",
    "version": "1.0.0"
  })
})
  return path
}
