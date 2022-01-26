// generated from test/fixtures/update-exact-version
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "abbrev": {
      "package.json": JSON.stringify({
        "name": "abbrev",
        "version": "1.0.4",
        "description": "Like ruby's abbrev module, but in js",
        "author": "Isaac Z. Schlueter <i@izs.me>",
        "main": "./lib/abbrev.js",
        "scripts": {
          "test": "node lib/abbrev.js"
        },
        "repository": "http://github.com/isaacs/abbrev-js",
        "license": {
          "type": "MIT",
          "url": "https://github.com/isaacs/abbrev-js/raw/master/LICENSE"
        }
      })
    }
  },
  "package-lock.json": JSON.stringify({
    "name": "update-exact-version",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "dependencies": {
          "abbrev": "1.0.4"
        }
      },
      "node_modules/abbrev": {
        "version": "1.0.4",
        "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
        "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0="
      }
    },
    "dependencies": {
      "abbrev": {
        "version": "1.0.4",
        "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
        "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0="
      }
    }
  }),
  "package.json": JSON.stringify({
    "dependencies": {
      "abbrev": "1.0.4"
    }
  })
})
  return path
}
