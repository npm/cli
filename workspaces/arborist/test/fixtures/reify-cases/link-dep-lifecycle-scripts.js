// generated from test/fixtures/link-dep-lifecycle-scripts
module.exports = t => {
  const path = t.testdir({
  "a": {
    "package.json": JSON.stringify({
      "name": "a",
      "version": "1.0.0",
      "scripts": {
        "prepare": "node -e \"require('fs').writeFileSync('a-prepare', '')\"",
        "postinstall": "node -e \"require('fs').writeFileSync('a-post-install', '')\""
      }
    })
  },
  "node_modules": {
    ".package-lock.json": JSON.stringify({
      "name": "link-dep-lifecycle-scripts",
      "version": "1.0.0",
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
    "a": t.fixture('symlink', "../a")
  },
  "package-lock.json": JSON.stringify({
    "name": "link-dep-lifecycle-scripts",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "version": "1.0.0",
        "dependencies": {
          "a": "file:./a"
        }
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
    "name": "link-dep-lifecycle-scripts",
    "version": "1.0.0",
    "dependencies": {
      "a": "file:./a"
    }
  })
})
  const {utimesSync} = require('fs')
  const n = Date.now() + 10000
  const {resolve} = require('path')
  
  utimesSync(resolve(path, "node_modules/.package-lock.json"), new Date(n), new Date(n))
  return path
}
