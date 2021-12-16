// generated from test/fixtures/shrinkwrapped-dep-no-lock-empty
module.exports = t => {
  const path = t.testdir({
  "README.md": "Just a module that depends on a module that ships a shrinkwrap.\n",
  "package.json": JSON.stringify({
    "name": "shrinkwrap",
    "version": "1.0.0",
    "license": "ISC",
    "dependencies": {
      "@isaacs/shrinkwrapped-dependency": "^1.0.0"
    }
  })
})
  return path
}
