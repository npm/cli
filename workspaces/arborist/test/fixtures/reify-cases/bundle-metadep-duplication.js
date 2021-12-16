// generated from test/fixtures/bundle-metadep-duplication/bundle-metadep-duplication
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/bundle-metadep-duplication-root",
    "version": "1.0.0",
    "dependencies": {
      "@isaacs/bundle-metadep-duplication-x": "1"
    }
  })
})
  return path
}
