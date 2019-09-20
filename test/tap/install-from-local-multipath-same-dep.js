var fs = require('graceful-fs')
var path = require('path')

var mkdirp = require('mkdirp')
var osenv = require('osenv')
var rimraf = require('rimraf')
var test = require('tap').test

var common = require('../common-tap')

var root = common.pkg
// Allow running this test on older commits (useful for bisecting)
if (!root) {
  var main = require.main.filename
  root = path.resolve(path.dirname(main), path.basename(main, '.js'))
}
var pkg = path.join(root, 'comp-a')

var EXEC_OPTS = { cwd: pkg }

var compA = {
  "name": "comp-a",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "classnames": "^2.2.6",
    "comp-b": "file:../comp-b",
    "comp-c": "file:../comp-c"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


var compALock = {
  "name": "comp-a",
  "version": "1.0.0",
  "lockfileVersion": 1,
  "requires": true,
  "dependencies": {
    "classnames": {
      "version": "2.2.6",
      "resolved": "https://registry.npmjs.org/classnames/-/classnames-2.2.6.tgz",
      "integrity": "sha512-JR/iSQOSt+LQIWwrwEzJ9uk0xfN3mTVYMwt1Ir5mUcSN6pU+V4zQFFaJsclJbPuAUQH+yfWef6tm7l1quW3C8Q=="
    },
    "comp-b": {
      "version": "file:../comp-b",
      "requires": {
        "classnames": "^2.2.6",
        "comp-c": "file:../comp-c"
      },
      "dependencies": {
        "classnames": {
          "version": "2.2.6",
          "resolved": "https://registry.npmjs.org/classnames/-/classnames-2.2.6.tgz",
          "integrity": "sha512-JR/iSQOSt+LQIWwrwEzJ9uk0xfN3mTVYMwt1Ir5mUcSN6pU+V4zQFFaJsclJbPuAUQH+yfWef6tm7l1quW3C8Q=="
        },
        "comp-c": {
          "version": "file:../comp-c",
          "requires": {
            "classnames": "^2.2.6"
          },
          "dependencies": {
            "classnames": {
              "version": "2.2.6",
              "resolved": "https://registry.npmjs.org/classnames/-/classnames-2.2.6.tgz",
              "integrity": "sha512-JR/iSQOSt+LQIWwrwEzJ9uk0xfN3mTVYMwt1Ir5mUcSN6pU+V4zQFFaJsclJbPuAUQH+yfWef6tm7l1quW3C8Q=="
            }
          }
        }
      }
    },
    "comp-c": {
      "version": "file:../comp-c",
      "requires": {
        "classnames": "^2.2.6"
      },
      "dependencies": {
        "classnames": {
          "version": "2.2.6",
          "resolved": "https://registry.npmjs.org/classnames/-/classnames-2.2.6.tgz",
          "integrity": "sha512-JR/iSQOSt+LQIWwrwEzJ9uk0xfN3mTVYMwt1Ir5mUcSN6pU+V4zQFFaJsclJbPuAUQH+yfWef6tm7l1quW3C8Q=="
        }
      }
    }
  }
}

var compB = {
  "name": "comp-b",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "classnames": "^2.2.6",
    "comp-c": "file:../comp-c"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

var compC = {
  "name": "comp-c",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "classnames": "^2.2.6"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


test('setup', function (t) {
  rimraf.sync(root)
  mkdirp.sync(root)

  mkdirp.sync(path.join(root, 'comp-a'))
  fs.writeFileSync(
    path.join(root, 'comp-a', 'package.json'),
    JSON.stringify(compA, null, 2)
  )
  fs.writeFileSync(
    path.join(root, 'comp-a', 'package-lock.json'),
    JSON.stringify(compALock, null, 2)
  )

  mkdirp.sync(path.join(root, 'comp-b'))
  fs.writeFileSync(
    path.join(root, 'comp-b', 'package.json'),
    JSON.stringify(compB, null, 2)
  )

  mkdirp.sync(path.join(root, 'comp-c'))
  fs.writeFileSync(
    path.join(root, 'comp-c', 'package.json'),
    JSON.stringify(compC, null, 2)
  )

  process.chdir(pkg)
  t.end()
})

test('\'npm install\' should install local packages', function (t) {
  common.npm(
    [
      'install', '.'
    ],
    EXEC_OPTS,
    function (err, code, out) {
      console.log(arguments)
      t.ifError(err, 'error should not exist')
      t.notOk(code, 'npm install exited with code 0')
      t.end()
    }
  )
})

test('cleanup', function (t) {
  process.chdir(osenv.tmpdir())
  rimraf.sync(root)
  t.end()
})
