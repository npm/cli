// generated from test/fixtures/optional-dep-tgz-missing
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-optional-dep-tgz-missing",
    "version": "1.0.0",
    "description": "a package with an optional dependency on a package whose tarball does not exist",
    "optionalDependencies": {
      "@isaacs/testing-missing-tgz": "*"
    },
    "dependencies": {
      "@isaacs/testing-missing-tgz": "*"
    }
  })
})
  return path
}
