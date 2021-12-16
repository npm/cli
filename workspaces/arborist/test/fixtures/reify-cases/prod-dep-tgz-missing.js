// generated from test/fixtures/prod-dep-tgz-missing
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-prod-dep-tgz-missing",
    "version": "1.0.1",
    "description": "a package with an optional dependency on a package whose tarball does not exist",
    "dependencies": {
      "@isaacs/testing-missing-tgz": "*"
    },
    "scripts": {
      "install": "this never gets run"
    }
  })
})
  return path
}
