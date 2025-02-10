// generated from test/fixtures/conflict-bundle-file-dep
module.exports = t => {
  const path = t.testdir({
    "fixtures-has-package-exports": {
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
      "dependencies": {
        "@fixtures/has-package-exports": "file:fixtures-has-package-exports",
        "has-package-exports": "^1.3.0"
      }
    })
  })
  return path
}
