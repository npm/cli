// generated from test/fixtures/once-outdated
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "once": {
      "node_modules": {
        "wrappy": {
          "package.json": JSON.stringify({
            "_from": "wrappy@1",
            "_id": "wrappy@1.0.2",
            "_inBundle": false,
            "_integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8=",
            "_location": "/once/wrappy",
            "_phantomChildren": {},
            "_requested": {
              "type": "range",
              "registry": true,
              "raw": "wrappy@1",
              "name": "wrappy",
              "escapedName": "wrappy",
              "rawSpec": "1",
              "saveSpec": null,
              "fetchSpec": "1"
            },
            "_requiredBy": [
              "/once"
            ],
            "_resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
            "_shasum": "b5243d8f3ec1aa35f1364605bc0d1036e30ab69f",
            "_spec": "wrappy@1",
            "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/once-outdated/node_modules/once",
            "author": {
              "name": "Isaac Z. Schlueter",
              "email": "i@izs.me",
              "url": "http://blog.izs.me/"
            },
            "bugs": {
              "url": "https://github.com/npm/wrappy/issues"
            },
            "bundleDependencies": false,
            "dependencies": {},
            "deprecated": false,
            "description": "Callback wrapping utility",
            "devDependencies": {
              "tap": "^2.3.1"
            },
            "directories": {
              "test": "test"
            },
            "files": [
              "wrappy.js"
            ],
            "homepage": "https://github.com/npm/wrappy",
            "license": "ISC",
            "main": "wrappy.js",
            "name": "wrappy",
            "repository": {
              "type": "git",
              "url": "git+https://github.com/npm/wrappy.git"
            },
            "scripts": {
              "test": "tap --coverage test/*.js"
            },
            "version": "1.0.2"
          })
        }
      },
      "package.json": JSON.stringify({
        "_from": "once@1.3.1",
        "_id": "once@1.3.1",
        "_inBundle": false,
        "_integrity": "sha1-8/Pk2lt9J7XHMpae4+Z+cpRXsx8=",
        "_location": "/once",
        "_phantomChildren": {},
        "_requested": {
          "type": "version",
          "registry": true,
          "raw": "once@1.3.1",
          "name": "once",
          "escapedName": "once",
          "rawSpec": "1.3.1",
          "saveSpec": null,
          "fetchSpec": "1.3.1"
        },
        "_requiredBy": [
          "#USER",
          "/"
        ],
        "_resolved": "https://registry.npmjs.org/once/-/once-1.3.1.tgz",
        "_shasum": "f3f3e4da5b7d27b5c732969ee3e67e729457b31f",
        "_spec": "once@1.3.1",
        "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/once-outdated",
        "author": {
          "name": "Isaac Z. Schlueter",
          "email": "i@izs.me",
          "url": "http://blog.izs.me/"
        },
        "bugs": {
          "url": "https://github.com/isaacs/once/issues"
        },
        "bundleDependencies": false,
        "dependencies": {
          "wrappy": "1"
        },
        "deprecated": false,
        "description": "Run a function exactly one time",
        "devDependencies": {
          "tap": "~0.3.0"
        },
        "directories": {
          "test": "test"
        },
        "homepage": "https://github.com/isaacs/once#readme",
        "keywords": [
          "once",
          "function",
          "one",
          "single"
        ],
        "license": "BSD",
        "main": "once.js",
        "name": "once",
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/once.git"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "version": "1.3.1"
      })
    }
  },
  "package-lock.json": JSON.stringify({
    "requires": true,
    "lockfileVersion": 1,
    "dependencies": {
      "once": {
        "version": "1.3.1",
        "resolved": "https://registry.npmjs.org/once/-/once-1.3.1.tgz",
        "integrity": "sha1-8/Pk2lt9J7XHMpae4+Z+cpRXsx8=",
        "requires": {
          "wrappy": "1"
        },
        "dependencies": {
          "wrappy": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
            "integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8="
          }
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "dependencies": {
      "once": "^1.3.1"
    }
  })
})
  return path
}
