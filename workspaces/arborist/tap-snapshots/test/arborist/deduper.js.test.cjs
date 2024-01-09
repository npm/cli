/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/arborist/deduper.js TAP dedupes with actual tree > must match snapshot 1`] = `
ArboristNode {
  "children": Map {
    "@isaacs/dedupe-tests-a" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@isaacs/dedupe-tests-a",
          "spec": "1.0.1",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@isaacs/dedupe-tests-b" => EdgeOut {
          "name": "@isaacs/dedupe-tests-b",
          "spec": "1",
          "to": "node_modules/@isaacs/dedupe-tests-b",
          "type": "prod",
        },
      },
      "location": "node_modules/@isaacs/dedupe-tests-a",
      "name": "@isaacs/dedupe-tests-a",
      "path": "{CWD}/test/arborist/tap-testdir-deduper-dedupes-with-actual-tree/node_modules/@isaacs/dedupe-tests-a",
      "version": "1.0.1",
    },
    "@isaacs/dedupe-tests-b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@isaacs/dedupe-tests-b",
          "spec": "1||2",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/@isaacs/dedupe-tests-a",
          "name": "@isaacs/dedupe-tests-b",
          "spec": "1",
          "type": "prod",
        },
      },
      "location": "node_modules/@isaacs/dedupe-tests-b",
      "name": "@isaacs/dedupe-tests-b",
      "path": "{CWD}/test/arborist/tap-testdir-deduper-dedupes-with-actual-tree/node_modules/@isaacs/dedupe-tests-b",
      "resolved": "https://registry.npmjs.org/@isaacs/dedupe-tests-b/-/dedupe-tests-b-1.0.0.tgz",
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "@isaacs/dedupe-tests-a" => EdgeOut {
      "name": "@isaacs/dedupe-tests-a",
      "spec": "1.0.1",
      "to": "node_modules/@isaacs/dedupe-tests-a",
      "type": "prod",
    },
    "@isaacs/dedupe-tests-b" => EdgeOut {
      "name": "@isaacs/dedupe-tests-b",
      "spec": "1||2",
      "to": "node_modules/@isaacs/dedupe-tests-b",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-deduper-dedupes-with-actual-tree",
  "packageName": "dedupe-actual",
  "path": "{CWD}/test/arborist/tap-testdir-deduper-dedupes-with-actual-tree",
  "version": "1.0.0",
}
`

exports[`test/arborist/deduper.js TAP dedupes with lockfile > must match snapshot 1`] = `
ArboristNode {
  "children": Map {
    "@isaacs/dedupe-tests-a" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@isaacs/dedupe-tests-a",
          "spec": "1.0.1",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@isaacs/dedupe-tests-b" => EdgeOut {
          "name": "@isaacs/dedupe-tests-b",
          "spec": "1",
          "to": "node_modules/@isaacs/dedupe-tests-b",
          "type": "prod",
        },
      },
      "location": "node_modules/@isaacs/dedupe-tests-a",
      "name": "@isaacs/dedupe-tests-a",
      "path": "{CWD}/test/arborist/tap-testdir-deduper-dedupes-with-lockfile/node_modules/@isaacs/dedupe-tests-a",
      "resolved": "https://registry.npmjs.org/@isaacs/dedupe-tests-a/-/dedupe-tests-a-1.0.1.tgz",
      "version": "1.0.1",
    },
    "@isaacs/dedupe-tests-b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@isaacs/dedupe-tests-b",
          "spec": "1||2",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/@isaacs/dedupe-tests-a",
          "name": "@isaacs/dedupe-tests-b",
          "spec": "1",
          "type": "prod",
        },
      },
      "location": "node_modules/@isaacs/dedupe-tests-b",
      "name": "@isaacs/dedupe-tests-b",
      "path": "{CWD}/test/arborist/tap-testdir-deduper-dedupes-with-lockfile/node_modules/@isaacs/dedupe-tests-b",
      "resolved": "https://registry.npmjs.org/@isaacs/dedupe-tests-b/-/dedupe-tests-b-1.0.0.tgz",
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "@isaacs/dedupe-tests-a" => EdgeOut {
      "name": "@isaacs/dedupe-tests-a",
      "spec": "1.0.1",
      "to": "node_modules/@isaacs/dedupe-tests-a",
      "type": "prod",
    },
    "@isaacs/dedupe-tests-b" => EdgeOut {
      "name": "@isaacs/dedupe-tests-b",
      "spec": "1||2",
      "to": "node_modules/@isaacs/dedupe-tests-b",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-deduper-dedupes-with-lockfile",
  "packageName": "dedupe-lockfile",
  "path": "{CWD}/test/arborist/tap-testdir-deduper-dedupes-with-lockfile",
  "version": "1.0.0",
}
`
