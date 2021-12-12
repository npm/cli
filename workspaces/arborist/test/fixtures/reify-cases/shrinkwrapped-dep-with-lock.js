// generated from test/fixtures/shrinkwrapped-dep-with-lock
module.exports = t => {
  const path = t.testdir({
  "README.md": "Just a module that depends on a module that ships a shrinkwrap.\n",
  "node_modules": {
    "@isaacs": {
      "shrinkwrapped-dependency": {
        "node_modules": {
          "abbrev": {
            "package.json": JSON.stringify({
              "_args": [
                [
                  "abbrev@1.0.4",
                  "/Users/isaacs/dev/npm/arborist/test/fixtures/shrinkwrap/node_modules/@isaacs/shrinkwrapped-dependency"
                ]
              ],
              "_from": "abbrev@1.0.4",
              "_id": "abbrev@1.0.4",
              "_inBundle": false,
              "_integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0=",
              "_location": "/@isaacs/shrinkwrapped-dependency/abbrev",
              "_phantomChildren": {},
              "_requested": {
                "type": "version",
                "registry": true,
                "raw": "abbrev@1.0.4",
                "name": "abbrev",
                "escapedName": "abbrev",
                "rawSpec": "1.0.4",
                "saveSpec": null,
                "fetchSpec": "1.0.4"
              },
              "_requiredBy": [
                "/@isaacs/shrinkwrapped-dependency"
              ],
              "_resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
              "_spec": "1.0.4",
              "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/shrinkwrap/node_modules/@isaacs/shrinkwrapped-dependency",
              "author": {
                "name": "Isaac Z. Schlueter",
                "email": "i@izs.me"
              },
              "bugs": {
                "url": "https://github.com/isaacs/abbrev-js/issues"
              },
              "description": "Like ruby's abbrev module, but in js",
              "homepage": "https://github.com/isaacs/abbrev-js#readme",
              "license": {
                "type": "MIT",
                "url": "https://github.com/isaacs/abbrev-js/raw/master/LICENSE"
              },
              "main": "./lib/abbrev.js",
              "name": "abbrev",
              "repository": {
                "type": "git",
                "url": "git+ssh://git@github.com/isaacs/abbrev-js.git"
              },
              "scripts": {
                "test": "node lib/abbrev.js"
              },
              "version": "1.0.4"
            })
          }
        },
        "npm-shrinkwrap.json": JSON.stringify({
          "name": "shrinkwrapped-dependency",
          "version": "1.0.0",
          "lockfileVersion": 1,
          "requires": true,
          "dependencies": {
            "abbrev": {
              "version": "1.0.4",
              "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
              "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0="
            }
          }
        }),
        "package.json": JSON.stringify({
          "_from": "@isaacs/shrinkwrapped-dependency@^1.0.0",
          "_id": "@isaacs/shrinkwrapped-dependency@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-9OAp7wVNnaxbqHi6n+AALGvSmZ/nJPGWKBNUr/RuGpVitaT54KCbwIHPA1sOwowUFaooDggoB8Jtk/aBOWwKoQ==",
          "_location": "/@isaacs/shrinkwrapped-dependency",
          "_phantomChildren": {},
          "_requested": {
            "type": "range",
            "registry": true,
            "raw": "@isaacs/shrinkwrapped-dependency@^1.0.0",
            "name": "@isaacs/shrinkwrapped-dependency",
            "escapedName": "@isaacs%2fshrinkwrapped-dependency",
            "scope": "@isaacs",
            "rawSpec": "^1.0.0",
            "saveSpec": null,
            "fetchSpec": "^1.0.0"
          },
          "_requiredBy": [
            "/"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/shrinkwrapped-dependency/-/shrinkwrapped-dependency-1.0.0.tgz",
          "_shasum": "a22edfd12f2e796c924a36fe6cbf52eb495e93c3",
          "_shrinkwrap": {
            "name": "shrinkwrapped-dependency",
            "version": "1.0.0",
            "lockfileVersion": 1,
            "requires": true,
            "dependencies": {
              "abbrev": {
                "version": "1.0.4",
                "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
                "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0="
              }
            }
          },
          "_spec": "@isaacs/shrinkwrapped-dependency@^1.0.0",
          "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/shrinkwrap",
          "author": "",
          "bundleDependencies": false,
          "dependencies": {
            "abbrev": "^1.0.4"
          },
          "deprecated": false,
          "description": "",
          "keywords": [],
          "license": "ISC",
          "main": "index.js",
          "name": "@isaacs/shrinkwrapped-dependency",
          "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
          },
          "version": "1.0.0"
        })
      }
    }
  },
  "package-lock.json": JSON.stringify({
    "name": "shrinkwrap",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "shrinkwrap",
        "version": "1.0.0",
        "license": "ISC",
        "dependencies": {
          "@isaacs/shrinkwrapped-dependency": "^1.0.0"
        }
      },
      "node_modules/@isaacs/shrinkwrapped-dependency": {
        "name": "@isaacs/shrinkwrapped-dependency",
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/shrinkwrapped-dependency/-/shrinkwrapped-dependency-1.0.0.tgz",
        "integrity": "sha512-9OAp7wVNnaxbqHi6n+AALGvSmZ/nJPGWKBNUr/RuGpVitaT54KCbwIHPA1sOwowUFaooDggoB8Jtk/aBOWwKoQ==",
        "hasShrinkwrap": true,
        "license": "ISC",
        "dependencies": {
          "abbrev": "^1.0.4"
        }
      },
      "node_modules/@isaacs/shrinkwrapped-dependency/node_modules/abbrev": {
        "name": "abbrev",
        "version": "1.0.4",
        "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
        "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0=",
        "license": "MIT"
      }
    },
    "dependencies": {
      "@isaacs/shrinkwrapped-dependency": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/shrinkwrapped-dependency/-/shrinkwrapped-dependency-1.0.0.tgz",
        "integrity": "sha512-9OAp7wVNnaxbqHi6n+AALGvSmZ/nJPGWKBNUr/RuGpVitaT54KCbwIHPA1sOwowUFaooDggoB8Jtk/aBOWwKoQ==",
        "requires": {
          "abbrev": "^1.0.4"
        },
        "dependencies": {
          "abbrev": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
            "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0="
          }
        }
      }
    }
  }),
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
