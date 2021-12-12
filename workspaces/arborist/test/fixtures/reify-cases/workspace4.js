// generated from test/fixtures/workspace4
module.exports = t => {
  const path = t.testdir({
  "README.md": "an example where a workspace needs a duplicated nested dep\n",
  "package.json": JSON.stringify({
    "dependencies": {
      "foo": "file:packages/foo",
      "bar": "file:packages/bar"
    }
  }),
  "packages": {
    "bar": {
      "package.json": JSON.stringify({
        "name": "bar",
        "version": "1.2.3",
        "dependencies": {
          "mkdirp": "0.x"
        }
      })
    },
    "foo": {
      "package.json": JSON.stringify({
        "name": "foo",
        "version": "1.2.3",
        "dependencies": {
          "mkdirp": "1",
          "bar": "^1.0.0"
        }
      })
    }
  }
})
  return path
}
