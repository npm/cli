// generated from test/fixtures/workspaces-simple
module.exports = t => {
  const path = t.testdir({
  "a": {
    "package.json": JSON.stringify({
      "name": "a",
      "version": "1.0.0",
      "dependencies": {
        "b": "^1.0.0"
      }
    })
  },
  "b": {
    "package.json": JSON.stringify({
      "name": "b",
      "version": "1.0.0"
    })
  },
  "node_modules": {
    "a": t.fixture('symlink', "../a"),
    "b": t.fixture('symlink', "../b")
  },
  "package.json": JSON.stringify({
    "name": "workspace-simple",
    "workspaces": [
      "a",
      "b"
    ]
  })
})
  return path
}
