// generated from test/fixtures/workspaces-link-bin
module.exports = t => {
  const path = t.testdir({
  "foo.js": "",
  "package.json": JSON.stringify({
    "name": "workspace-duplicate",
    "bin": "foo.js",
    "workspaces": [
      "packages/*"
    ],
    "dependencies": {
      "a": "*"
    }
  }),
  "packages": {
    "a": {
      "file.js": "",
      "package.json": JSON.stringify({
        "name": "a",
        "version": "1.0.0",
        "files": [
          "file.js"
        ],
        "bin": "file.js"
      })
    },
    "b": {
      "create-file.js": "require('fs').writeFileSync('file.js', '')\n",
      "package.json": JSON.stringify({
        "name": "b",
        "version": "1.0.0",
        "files": [
          "file.js"
        ],
        "scripts": {
          "preinstall": "node create-file.js"
        },
        "bin": "file.js"
      })
    }
  }
})
  return path
}
