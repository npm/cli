/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/arborist/rebuild.js TAP verify dep flags in script environments > saved script results 1`] = `
Array [
  Object {
    "cmd": "node ../../env.js",
    "code": 0,
    "event": "postinstall",
    "pkg": Object {
      "_id": "devdep@1.0.0",
      "dependencies": Object {
        "devopt": "",
      },
      "name": "devdep",
      "optionalDependencies": Object {
        "opt-and-dev": "",
      },
      "scripts": Object {
        "postinstall": "node ../../env.js",
      },
      "version": "1.0.0",
    },
    "signal": null,
    "stderr": "stderr",
    "stdout": "npm_package_dev",
  },
  Object {
    "cmd": "node ../../env.js",
    "code": 0,
    "event": "postinstall",
    "pkg": Object {
      "_id": "devopt@1.0.0",
      "name": "devopt",
      "scripts": Object {
        "postinstall": "node ../../env.js",
      },
      "version": "1.0.0",
    },
    "signal": null,
    "stderr": "stderr",
    "stdout": "npm_package_dev_optional",
  },
  Object {
    "cmd": "node ../../env.js",
    "code": 0,
    "event": "postinstall",
    "pkg": Object {
      "_id": "opt-and-dev@1.0.0",
      "name": "opt-and-dev",
      "scripts": Object {
        "postinstall": "node ../../env.js",
      },
      "version": "1.0.0",
    },
    "signal": null,
    "stderr": "stderr",
    "stdout": String(
      npm_package_dev
      npm_package_optional
    ),
  },
  Object {
    "cmd": "node ../../env.js",
    "code": 0,
    "event": "postinstall",
    "pkg": Object {
      "_id": "optdep@1.0.0",
      "dependencies": Object {
        "devopt": "",
      },
      "name": "optdep",
      "scripts": Object {
        "postinstall": "node ../../env.js",
      },
      "version": "1.0.0",
    },
    "signal": null,
    "stderr": "stderr",
    "stdout": "npm_package_optional",
  },
]
`
