// generated from test/fixtures/package-json-shorthands
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "package-json-shorthands",
    "version": "1.0.0",
    "bin": "./index.js",
    "main": "./index.js",
    "funding": "https://example.com"
  })
})
  return path
}
