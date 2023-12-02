// generated from test/fixtures/file-dep
module.exports = t => {
  const path = t.testdir({
    "fake": {
      "package.json": JSON.stringify({
        "bundleDependencies": true,
        "dependencies": {
          "abbrev": "1.1.1"
        },
        "devDependencies": {
          "has-package-exports": "file:."
        }
      })
    },
    "package.json": JSON.stringify({
      "devDependencies": {
        "some-fake-name": "file:./fake",
        "has-package-exports": "^1.3.0"
      }
    })
  })
  return path
}
