// generated from test/fixtures/workspaces-add-new-dep
module.exports = t => {
  const path = t.testdir({
  "a": {
    "package.json": JSON.stringify({
      "name": "a",
      "version": "1.0.0",
      "dependencies": {
        "abbrev": "^1.1.1"
      }
    })
  },
  "node_modules": {
    ".package-lock.json": JSON.stringify({
      "name": "workspaces-add-new-dep",
      "lockfileVersion": 2,
      "requires": true,
      "packages": {
        "a": {
          "version": "1.0.0"
        },
        "node_modules/a": {
          "resolved": "a",
          "link": true
        }
      }
    }),
    "a": t.fixture('symlink', "../a"),
    "pkg-a": t.fixture('symlink', "../a")
  },
  "package-lock.json": JSON.stringify({
    "name": "workspaces-add-new-dep",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "workspaces": [
          "a"
        ]
      },
      "a": {
        "version": "1.0.0"
      },
      "node_modules/a": {
        "resolved": "a",
        "link": true
      }
    },
    "dependencies": {
      "a": {
        "version": "file:a"
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "workspaces-add-new-dep",
    "workspaces": [
      "a"
    ]
  })
})
  const {utimesSync} = require('fs')
  const n = Date.now() + 10000
  const {resolve} = require('path')
  
  utimesSync(resolve(path, "node_modules/.package-lock.json"), new Date(n), new Date(n))
  return path
}
