// generated from test/fixtures/prune-dev-dep-duplicate
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "prune-with-dev-dep-duplicate",
    "description": "fixture",
    "version": "0.0.1",
    "main": "index.js",
    "dependencies": {
      "once": "^1.0.0"
    },
    "devDependencies": {
      "once": "^1.0.0"
    }
  })
})
  return path
}
