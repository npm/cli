// generated from test/fixtures/testing-bundledeps-empty
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "testing-bundledeps",
    "version": "1.2.3",
    "dependencies": {
      "@isaacs/testing-bundledeps": "*"
    }
  })
})
  return path
}
