// generated from test/fixtures/optional-metadep-tgz-missing
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-optional-metadep-tgz-missing",
    "version": "1.0.0",
    "description": "a package with an optional metadep that does not exist",
    "optionalDependencies": {
      "@isaacs/testing-prod-dep-tgz-missing": "*"
    }
  })
})
  return path
}
