// generated from test/fixtures/fail-postinstall
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-fail-postinstall",
    "version": "1.0.0",
    "scripts": {
      "postinstall": "exit 1"
    },
    "license": "ISC"
  })
})
  return path
}
