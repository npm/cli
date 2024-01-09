// generated from test/fixtures/old-package-lock
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "once": {
      "package.json": JSON.stringify({
        "_from": "once",
        "_id": "once@1.4.0",
        "_inBundle": false,
        "_integrity": "sha1-WDsap3WWHUsROsF9nFC6753Xa9E=",
        "_location": "/once",
        "_phantomChildren": {},
        "_requested": {
          "type": "tag",
          "registry": true,
          "raw": "once",
          "name": "once",
          "escapedName": "once",
          "rawSpec": "",
          "saveSpec": null,
          "fetchSpec": "latest"
        },
        "_requiredBy": [
          "#USER",
          "/"
        ],
        "_resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
        "_shasum": "583b1aa775961d4b113ac17d9c50baef9dd76bd1",
        "_spec": "once",
        "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/old-package-lock",
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
          "tap": "^7.0.1"
        },
        "directories": {
          "test": "test"
        },
        "files": [
          "once.js"
        ],
        "homepage": "https://github.com/isaacs/once#readme",
        "keywords": [
          "once",
          "function",
          "one",
          "single"
        ],
        "license": "ISC",
        "main": "once.js",
        "name": "once",
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/once.git"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "version": "1.4.0"
      })
    },
    "wrappy": {
      "package.json": JSON.stringify({
        "_from": "wrappy@1",
        "_id": "wrappy@1.0.2",
        "_inBundle": false,
        "_integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8=",
        "_location": "/wrappy",
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
        "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/old-package-lock/node_modules/once",
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
  "package-lock.json": JSON.stringify({
    "requires": true,
    "lockfileVersion": 1,
    "dependencies": {
      "once": {
        "version": "1.4.0",
        "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
        "integrity": "sha1-WDsap3WWHUsROsF9nFC6753Xa9E=",
        "requires": {
          "wrappy": "1"
        }
      },
      "wrappy": {
        "version": "1.0.2",
        "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
        "integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8="
      }
    }
  }),
  "package.json": JSON.stringify({
    "dependencies": {
      "once": "^1.4.0"
    }
  })
})
  return path
}
