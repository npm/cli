// generated from test/fixtures/testing-dev-optional-flags-2
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-dev-optional-flags-2",
    "version": "1.0.0",
    "description": "a package for testing dev, optional, and devOptional flags",
    "devDependencies": {
      "@isaacs/testing-dev-optional-flags": "*"
    }
  })
})
  return path
}
