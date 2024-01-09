// generated from test/fixtures/rebuild-foreground-scripts
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    ".package-lock.json": JSON.stringify({
      "name": "rebuild-foreground-scripts",
      "lockfileVersion": 2,
      "requires": true,
      "packages": {
        "node_modules/a": {
          "version": "1.2.3",
          "hasInstallScript": true
        },
        "node_modules/b": {
          "version": "1.2.3",
          "hasInstallScript": true
        }
      }
    }),
    "a": {
      "package.json": JSON.stringify({
        "name": "a",
        "version": "1.2.3",
        "scripts": {
          "preinstall": "node -e \"console.log('a preinstall')\"",
          "postinstall": "node -e \"console.log('a postinstall')\"",
          "install": "node -e \"console.log('a install')\""
        }
      })
    },
    "b": {
      "package.json": JSON.stringify({
        "name": "b",
        "version": "1.2.3",
        "scripts": {
          "preinstall": "node -e \"console.log('b preinstall')\"",
          "postinstall": "node -e \"console.log('b postinstall')\"",
          "install": "node -e \"console.log('b install')\""
        }
      })
    }
  },
  "package-lock.json": JSON.stringify({
    "name": "rebuild-foreground-scripts",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "dependencies": {
          "a": "",
          "b": ""
        }
      },
      "node_modules/a": {
        "version": "1.2.3",
        "hasInstallScript": true
      },
      "node_modules/b": {
        "version": "1.2.3",
        "hasInstallScript": true
      }
    },
    "dependencies": {
      "a": {
        "version": "1.2.3"
      },
      "b": {
        "version": "1.2.3"
      }
    }
  }),
  "package.json": JSON.stringify({
    "dependencies": {
      "a": "",
      "b": ""
    }
  })
})
  const {utimesSync} = require('fs')
  const n = Date.now() + 10000
  const {resolve} = require('path')
  
  utimesSync(resolve(path, "node_modules/.package-lock.json"), new Date(n), new Date(n))
  return path
}
