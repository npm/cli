// generated from test/fixtures/prod-dep-install-fail
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-prod-dep-install-fail",
    "version": "1.0.1",
    "description": "a prod dependency that fails to install",
    "license": "ISC",
    "dependencies": {
      "@isaacs/testing-fail-install": "^1.0.0"
    },
    "scripts": {
      "install": "this will never run"
    }
  })
})
  return path
}
