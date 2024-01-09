// generated from test/fixtures/platform-specification
module.exports = t => {
  const path = t.testdir({
  "package.json": JSON.stringify({
    "name": "platform-test",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
      "platform-specifying-test-package": "1.0.0"
    }
  })
})
  return path
}
