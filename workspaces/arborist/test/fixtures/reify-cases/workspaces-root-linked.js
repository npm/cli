// generated from test/fixtures/workspaces-root-linked
module.exports = t => {
  const path = t.testdir({
  "a": {
    "package.json": JSON.stringify({
      "name": "a",
      "version": "1.0.0",
      "dependencies": {
        "abbrev": "^1.0.0"
      }
    })
  },
  "b": {
    "package.json": JSON.stringify({
      "name": "b",
      "version": "1.0.0"
    })
  },
  "package.json": JSON.stringify({
    "name": "workspaces-root-linked",
    "version": "1.0.0",
    "workspaces": [
      ".",
      "a",
      "b"
    ]
  })
})
  return path
}
