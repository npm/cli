// generated from test/fixtures/link-meta-deps-empty
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "dependencies": {
      "@isaacs/testing-link-dep": "^1.0.0",
      "@isaacs/testing-link-dev-dep": "^1.0.1"
    }
  })
})
  return path
}
