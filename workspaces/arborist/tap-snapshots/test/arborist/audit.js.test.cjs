/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/arborist/audit.js TAP audit fix reifies out the bad deps > reified out the bad mkdirp and minimist 1`] = `
ArboristNode {
  "children": Map {
    "minimist" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/mkdirp",
          "name": "minimist",
          "spec": "^1.2.5",
          "type": "prod",
        },
      },
      "location": "node_modules/minimist",
      "name": "minimist",
      "path": "{CWD}/test/arborist/tap-testdir-audit-audit-fix-reifies-out-the-bad-deps/node_modules/minimist",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.5.tgz",
      "version": "1.2.5",
    },
    "mkdirp" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "mkdirp",
          "spec": "^0.5.1 <0.5.4",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "minimist" => EdgeOut {
          "name": "minimist",
          "spec": "^1.2.5",
          "to": "node_modules/minimist",
          "type": "prod",
        },
      },
      "location": "node_modules/mkdirp",
      "name": "mkdirp",
      "path": "{CWD}/test/arborist/tap-testdir-audit-audit-fix-reifies-out-the-bad-deps/node_modules/mkdirp",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-0.5.3.tgz",
      "version": "0.5.3",
    },
  },
  "edgesOut": Map {
    "mkdirp" => EdgeOut {
      "name": "mkdirp",
      "spec": "^0.5.1 <0.5.4",
      "to": "node_modules/mkdirp",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-audit-audit-fix-reifies-out-the-bad-deps",
  "path": "{CWD}/test/arborist/tap-testdir-audit-audit-fix-reifies-out-the-bad-deps",
}
`
