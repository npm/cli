// generated from test/fixtures/prod-dep-allinstall-fail
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-prod-dep-allinstall-fail",
    "version": "1.0.1",
    "description": "a prod dependency that fails to install",
    "license": "ISC",
    "dependencies": {
      "@isaacs/testing-fail-allinstall": "^1.0.0"
    },
    "scripts": {
      "install": "this will never run"
    }
  })
})
  return path
}
