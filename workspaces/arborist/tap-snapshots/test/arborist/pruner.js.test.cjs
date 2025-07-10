/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/arborist/pruner.js TAP prune with actual tree > must match snapshot 1`] = `
ArboristNode {
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-pruner-prune-with-actual-tree",
  "packageName": "prune-actual",
  "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-actual-tree",
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune with actual tree omit dev > should keep dev dependencies in package-lock.json 1`] = `
Object {
  "lockfileVersion": 3,
  "name": "prune-actual",
  "packages": Object {
    "": Object {
      "devDependencies": Object {
        "once": "^1.4.0",
      },
      "name": "prune-actual",
      "version": "1.0.0",
    },
    "node_modules/once": Object {
      "dependencies": Object {
        "wrappy": "1",
      },
      "dev": true,
      "version": "1.4.0",
    },
    "node_modules/wrappy": Object {
      "dev": true,
      "version": "1.0.2",
    },
  },
  "requires": true,
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune with actual tree omit dev > should remove all deps from reified tree 1`] = `
ArboristNode {
  "edgesOut": Map {
    "once" => EdgeOut {
      "error": "MISSING",
      "name": "once",
      "spec": "^1.4.0",
      "to": null,
      "type": "dev",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-pruner-prune-with-actual-tree-omit-dev",
  "packageName": "prune-actual",
  "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-actual-tree-omit-dev",
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune with lockfile > must match snapshot 1`] = `
ArboristNode {
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-pruner-prune-with-lockfile",
  "packageName": "prune-actual",
  "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile",
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune with lockfile omit dev > should keep dev dependencies in package-lock.json 1`] = `
Object {
  "dependencies": Object {
    "once": Object {
      "dev": true,
      "version": "1.4.0",
    },
  },
  "lockfileVersion": 2,
  "name": "prune-actual",
  "packages": Object {
    "": Object {
      "devDependencies": Object {
        "once": "^1.4.0",
      },
      "name": "prune-actual",
      "version": "1.0.0",
    },
    "node_modules/once": Object {
      "dev": true,
      "version": "1.4.0",
    },
  },
  "requires": true,
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune with lockfile omit dev > should remove all deps from reified tree 1`] = `
ArboristNode {
  "edgesOut": Map {
    "once" => EdgeOut {
      "error": "MISSING",
      "name": "once",
      "spec": "^1.4.0",
      "to": null,
      "type": "dev",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-pruner-prune-with-lockfile-omit-dev",
  "packageName": "prune-actual",
  "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-omit-dev",
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune with lockfile with implicit optional peer dependencies > should remove all deps from reified tree 1`] = `
ArboristNode {
  "children": Map {
    "@babel/code-frame" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/parse-json",
          "name": "@babel/code-frame",
          "spec": "^7.0.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@babel/helper-validator-identifier" => EdgeOut {
          "name": "@babel/helper-validator-identifier",
          "spec": "^7.27.1",
          "to": "node_modules/@babel/helper-validator-identifier",
          "type": "prod",
        },
        "js-tokens" => EdgeOut {
          "name": "js-tokens",
          "spec": "^4.0.0",
          "to": "node_modules/js-tokens",
          "type": "prod",
        },
        "picocolors" => EdgeOut {
          "name": "picocolors",
          "spec": "^1.1.1",
          "to": "node_modules/picocolors",
          "type": "prod",
        },
      },
      "location": "node_modules/@babel/code-frame",
      "name": "@babel/code-frame",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/@babel/code-frame",
      "peer": true,
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.27.1.tgz",
      "version": "7.27.1",
    },
    "@babel/helper-validator-identifier" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/@babel/code-frame",
          "name": "@babel/helper-validator-identifier",
          "spec": "^7.27.1",
          "type": "prod",
        },
      },
      "location": "node_modules/@babel/helper-validator-identifier",
      "name": "@babel/helper-validator-identifier",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/@babel/helper-validator-identifier",
      "peer": true,
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.27.1.tgz",
      "version": "7.27.1",
    },
    "@babel/runtime" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/babel-plugin-macros",
          "name": "@babel/runtime",
          "spec": "^7.12.5",
          "type": "prod",
        },
      },
      "location": "node_modules/@babel/runtime",
      "name": "@babel/runtime",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/@babel/runtime",
      "peer": true,
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.27.6.tgz",
      "version": "7.27.6",
    },
    "@types/parse-json" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/cosmiconfig",
          "name": "@types/parse-json",
          "spec": "^4.0.0",
          "type": "prod",
        },
      },
      "location": "node_modules/@types/parse-json",
      "name": "@types/parse-json",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/@types/parse-json",
      "peer": true,
      "resolved": "https://registry.npmjs.org/@types/parse-json/-/parse-json-4.0.2.tgz",
      "version": "4.0.2",
    },
    "babel-plugin-macros" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/dedent",
          "name": "babel-plugin-macros",
          "spec": "^3.1.0",
          "type": "peerOptional",
        },
      },
      "edgesOut": Map {
        "@babel/runtime" => EdgeOut {
          "name": "@babel/runtime",
          "spec": "^7.12.5",
          "to": "node_modules/@babel/runtime",
          "type": "prod",
        },
        "cosmiconfig" => EdgeOut {
          "name": "cosmiconfig",
          "spec": "^7.0.0",
          "to": "node_modules/cosmiconfig",
          "type": "prod",
        },
        "resolve" => EdgeOut {
          "name": "resolve",
          "spec": "^1.19.0",
          "to": "node_modules/resolve",
          "type": "prod",
        },
      },
      "location": "node_modules/babel-plugin-macros",
      "name": "babel-plugin-macros",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/babel-plugin-macros",
      "peer": true,
      "resolved": "https://registry.npmjs.org/babel-plugin-macros/-/babel-plugin-macros-3.1.0.tgz",
      "version": "3.1.0",
    },
    "callsites" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/parent-module",
          "name": "callsites",
          "spec": "^3.0.0",
          "type": "prod",
        },
      },
      "location": "node_modules/callsites",
      "name": "callsites",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/callsites",
      "peer": true,
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "version": "3.1.0",
    },
    "cosmiconfig" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/babel-plugin-macros",
          "name": "cosmiconfig",
          "spec": "^7.0.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@types/parse-json" => EdgeOut {
          "name": "@types/parse-json",
          "spec": "^4.0.0",
          "to": "node_modules/@types/parse-json",
          "type": "prod",
        },
        "import-fresh" => EdgeOut {
          "name": "import-fresh",
          "spec": "^3.2.1",
          "to": "node_modules/import-fresh",
          "type": "prod",
        },
        "parse-json" => EdgeOut {
          "name": "parse-json",
          "spec": "^5.0.0",
          "to": "node_modules/parse-json",
          "type": "prod",
        },
        "path-type" => EdgeOut {
          "name": "path-type",
          "spec": "^4.0.0",
          "to": "node_modules/path-type",
          "type": "prod",
        },
        "yaml" => EdgeOut {
          "name": "yaml",
          "spec": "^1.10.0",
          "to": "node_modules/yaml",
          "type": "prod",
        },
      },
      "location": "node_modules/cosmiconfig",
      "name": "cosmiconfig",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/cosmiconfig",
      "peer": true,
      "resolved": "https://registry.npmjs.org/cosmiconfig/-/cosmiconfig-7.1.0.tgz",
      "version": "7.1.0",
    },
    "dedent" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "dedent",
          "spec": "^1.6.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "babel-plugin-macros" => EdgeOut {
          "name": "babel-plugin-macros",
          "spec": "^3.1.0",
          "to": "node_modules/babel-plugin-macros",
          "type": "peerOptional",
        },
      },
      "location": "node_modules/dedent",
      "name": "dedent",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/dedent",
      "resolved": "https://registry.npmjs.org/dedent/-/dedent-1.6.0.tgz",
      "version": "1.6.0",
    },
    "error-ex" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/parse-json",
          "name": "error-ex",
          "spec": "^1.3.1",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "is-arrayish" => EdgeOut {
          "name": "is-arrayish",
          "spec": "^0.2.1",
          "to": "node_modules/is-arrayish",
          "type": "prod",
        },
      },
      "location": "node_modules/error-ex",
      "name": "error-ex",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/error-ex",
      "peer": true,
      "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.2.tgz",
      "version": "1.3.2",
    },
    "function-bind" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/hasown",
          "name": "function-bind",
          "spec": "^1.1.2",
          "type": "prod",
        },
      },
      "location": "node_modules/function-bind",
      "name": "function-bind",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/function-bind",
      "peer": true,
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "version": "1.1.2",
    },
    "hasown" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/is-core-module",
          "name": "hasown",
          "spec": "^2.0.2",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "function-bind" => EdgeOut {
          "name": "function-bind",
          "spec": "^1.1.2",
          "to": "node_modules/function-bind",
          "type": "prod",
        },
      },
      "location": "node_modules/hasown",
      "name": "hasown",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/hasown",
      "peer": true,
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "version": "2.0.2",
    },
    "import-fresh" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/cosmiconfig",
          "name": "import-fresh",
          "spec": "^3.2.1",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "parent-module" => EdgeOut {
          "name": "parent-module",
          "spec": "^1.0.0",
          "to": "node_modules/parent-module",
          "type": "prod",
        },
        "resolve-from" => EdgeOut {
          "name": "resolve-from",
          "spec": "^4.0.0",
          "to": "node_modules/resolve-from",
          "type": "prod",
        },
      },
      "location": "node_modules/import-fresh",
      "name": "import-fresh",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/import-fresh",
      "peer": true,
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "version": "3.3.1",
    },
    "is-arrayish" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/error-ex",
          "name": "is-arrayish",
          "spec": "^0.2.1",
          "type": "prod",
        },
      },
      "location": "node_modules/is-arrayish",
      "name": "is-arrayish",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/is-arrayish",
      "peer": true,
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
      "version": "0.2.1",
    },
    "is-core-module" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/resolve",
          "name": "is-core-module",
          "spec": "^2.16.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "hasown" => EdgeOut {
          "name": "hasown",
          "spec": "^2.0.2",
          "to": "node_modules/hasown",
          "type": "prod",
        },
      },
      "location": "node_modules/is-core-module",
      "name": "is-core-module",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/is-core-module",
      "peer": true,
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.1.tgz",
      "version": "2.16.1",
    },
    "js-tokens" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/@babel/code-frame",
          "name": "js-tokens",
          "spec": "^4.0.0",
          "type": "prod",
        },
      },
      "location": "node_modules/js-tokens",
      "name": "js-tokens",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/js-tokens",
      "peer": true,
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "version": "4.0.0",
    },
    "json-parse-even-better-errors" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/parse-json",
          "name": "json-parse-even-better-errors",
          "spec": "^2.3.0",
          "type": "prod",
        },
      },
      "location": "node_modules/json-parse-even-better-errors",
      "name": "json-parse-even-better-errors",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/json-parse-even-better-errors",
      "peer": true,
      "resolved": "https://registry.npmjs.org/json-parse-even-better-errors/-/json-parse-even-better-errors-2.3.1.tgz",
      "version": "2.3.1",
    },
    "lines-and-columns" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/parse-json",
          "name": "lines-and-columns",
          "spec": "^1.1.6",
          "type": "prod",
        },
      },
      "location": "node_modules/lines-and-columns",
      "name": "lines-and-columns",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/lines-and-columns",
      "peer": true,
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "version": "1.2.4",
    },
    "parent-module" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/import-fresh",
          "name": "parent-module",
          "spec": "^1.0.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "callsites" => EdgeOut {
          "name": "callsites",
          "spec": "^3.0.0",
          "to": "node_modules/callsites",
          "type": "prod",
        },
      },
      "location": "node_modules/parent-module",
      "name": "parent-module",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/parent-module",
      "peer": true,
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "version": "1.0.1",
    },
    "parse-json" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/cosmiconfig",
          "name": "parse-json",
          "spec": "^5.0.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@babel/code-frame" => EdgeOut {
          "name": "@babel/code-frame",
          "spec": "^7.0.0",
          "to": "node_modules/@babel/code-frame",
          "type": "prod",
        },
        "error-ex" => EdgeOut {
          "name": "error-ex",
          "spec": "^1.3.1",
          "to": "node_modules/error-ex",
          "type": "prod",
        },
        "json-parse-even-better-errors" => EdgeOut {
          "name": "json-parse-even-better-errors",
          "spec": "^2.3.0",
          "to": "node_modules/json-parse-even-better-errors",
          "type": "prod",
        },
        "lines-and-columns" => EdgeOut {
          "name": "lines-and-columns",
          "spec": "^1.1.6",
          "to": "node_modules/lines-and-columns",
          "type": "prod",
        },
      },
      "location": "node_modules/parse-json",
      "name": "parse-json",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/parse-json",
      "peer": true,
      "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-5.2.0.tgz",
      "version": "5.2.0",
    },
    "path-parse" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/resolve",
          "name": "path-parse",
          "spec": "^1.0.7",
          "type": "prod",
        },
      },
      "location": "node_modules/path-parse",
      "name": "path-parse",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/path-parse",
      "peer": true,
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "version": "1.0.7",
    },
    "path-type" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/cosmiconfig",
          "name": "path-type",
          "spec": "^4.0.0",
          "type": "prod",
        },
      },
      "location": "node_modules/path-type",
      "name": "path-type",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/path-type",
      "peer": true,
      "resolved": "https://registry.npmjs.org/path-type/-/path-type-4.0.0.tgz",
      "version": "4.0.0",
    },
    "picocolors" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/@babel/code-frame",
          "name": "picocolors",
          "spec": "^1.1.1",
          "type": "prod",
        },
      },
      "location": "node_modules/picocolors",
      "name": "picocolors",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/picocolors",
      "peer": true,
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "version": "1.1.1",
    },
    "resolve" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/babel-plugin-macros",
          "name": "resolve",
          "spec": "^1.19.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "is-core-module" => EdgeOut {
          "name": "is-core-module",
          "spec": "^2.16.0",
          "to": "node_modules/is-core-module",
          "type": "prod",
        },
        "path-parse" => EdgeOut {
          "name": "path-parse",
          "spec": "^1.0.7",
          "to": "node_modules/path-parse",
          "type": "prod",
        },
        "supports-preserve-symlinks-flag" => EdgeOut {
          "name": "supports-preserve-symlinks-flag",
          "spec": "^1.0.0",
          "to": "node_modules/supports-preserve-symlinks-flag",
          "type": "prod",
        },
      },
      "location": "node_modules/resolve",
      "name": "resolve",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/resolve",
      "peer": true,
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.10.tgz",
      "version": "1.22.10",
    },
    "resolve-from" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/import-fresh",
          "name": "resolve-from",
          "spec": "^4.0.0",
          "type": "prod",
        },
      },
      "location": "node_modules/resolve-from",
      "name": "resolve-from",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/resolve-from",
      "peer": true,
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "version": "4.0.0",
    },
    "supports-preserve-symlinks-flag" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/resolve",
          "name": "supports-preserve-symlinks-flag",
          "spec": "^1.0.0",
          "type": "prod",
        },
      },
      "location": "node_modules/supports-preserve-symlinks-flag",
      "name": "supports-preserve-symlinks-flag",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/supports-preserve-symlinks-flag",
      "peer": true,
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "version": "1.0.0",
    },
    "yaml" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/cosmiconfig",
          "name": "yaml",
          "spec": "^1.10.0",
          "type": "prod",
        },
      },
      "location": "node_modules/yaml",
      "name": "yaml",
      "optional": true,
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/yaml",
      "peer": true,
      "resolved": "https://registry.npmjs.org/yaml/-/yaml-1.10.2.tgz",
      "version": "1.10.2",
    },
  },
  "edgesOut": Map {
    "dedent" => EdgeOut {
      "name": "dedent",
      "spec": "^1.6.0",
      "to": "node_modules/dedent",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies",
  "packageName": "prune-lockfile-optional-peer",
  "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies",
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune with lockfile with implicit optional peer dependencies > should remove optional peer dependencies in package-lock.json 1`] = `
Object {
  "lockfileVersion": 3,
  "name": "prune-lockfile-optional-peer",
  "packages": Object {
    "": Object {
      "dependencies": Object {
        "dedent": "^1.6.0",
      },
      "name": "prune-lockfile-optional-peer",
      "version": "1.0.0",
    },
    "node_modules/@babel/code-frame": Object {
      "dependencies": Object {
        "@babel/helper-validator-identifier": "^7.27.1",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1",
      },
      "engines": Object {
        "node": ">=6.9.0",
      },
      "integrity": "sha512-cjQ7ZlQ0Mv3b47hABuTevyTuYN4i+loJKGeV9flcCgIK37cCXRh+L1bd3iBHlynerhQ7BhCkn2BPbQUL+rGqFg==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.27.1.tgz",
      "version": "7.27.1",
    },
    "node_modules/@babel/helper-validator-identifier": Object {
      "engines": Object {
        "node": ">=6.9.0",
      },
      "integrity": "sha512-D2hP9eA+Sqx1kBZgzxZh0y1trbuU+JoDkiEwqhQ36nodYqJwyEIhPSdMNd7lOm/4io72luTPWH20Yda0xOuUow==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.27.1.tgz",
      "version": "7.27.1",
    },
    "node_modules/@babel/runtime": Object {
      "engines": Object {
        "node": ">=6.9.0",
      },
      "integrity": "sha512-vbavdySgbTTrmFE+EsiqUTzlOr5bzlnJtUv9PynGCAKvfQqjIXbvFdumPM/GxMDfyuGMJaJAU6TO4zc1Jf1i8Q==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.27.6.tgz",
      "version": "7.27.6",
    },
    "node_modules/@types/parse-json": Object {
      "integrity": "sha512-dISoDXWWQwUquiKsyZ4Ng+HX2KsPL7LyHKHQwgGFEA3IaKac4Obd+h2a/a6waisAoepJlBcx9paWqjA8/HVjCw==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/@types/parse-json/-/parse-json-4.0.2.tgz",
      "version": "4.0.2",
    },
    "node_modules/babel-plugin-macros": Object {
      "dependencies": Object {
        "@babel/runtime": "^7.12.5",
        "cosmiconfig": "^7.0.0",
        "resolve": "^1.19.0",
      },
      "engines": Object {
        "node": ">=10",
        "npm": ">=6",
      },
      "integrity": "sha512-Cg7TFGpIr01vOQNODXOOaGz2NpCU5gl8x1qJFbb6hbZxR7XrcE2vtbAsTAbJ7/xwJtUuJEw8K8Zr/AE0LHlesg==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/babel-plugin-macros/-/babel-plugin-macros-3.1.0.tgz",
      "version": "3.1.0",
    },
    "node_modules/callsites": Object {
      "engines": Object {
        "node": ">=6",
      },
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "version": "3.1.0",
    },
    "node_modules/cosmiconfig": Object {
      "dependencies": Object {
        "@types/parse-json": "^4.0.0",
        "import-fresh": "^3.2.1",
        "parse-json": "^5.0.0",
        "path-type": "^4.0.0",
        "yaml": "^1.10.0",
      },
      "engines": Object {
        "node": ">=10",
      },
      "integrity": "sha512-AdmX6xUzdNASswsFtmwSt7Vj8po9IuqXm0UXz7QKPuEUmPB4XyjGfaAr2PSuELMwkRMVH1EpIkX5bTZGRB3eCA==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/cosmiconfig/-/cosmiconfig-7.1.0.tgz",
      "version": "7.1.0",
    },
    "node_modules/dedent": Object {
      "integrity": "sha512-F1Z+5UCFpmQUzJa11agbyPVMbpgT/qA3/SKyJ1jyBgm7dUcUEa8v9JwDkerSQXfakBwFljIxhOJqGkjUwZ9FSA==",
      "license": "MIT",
      "peerDependencies": Object {
        "babel-plugin-macros": "^3.1.0",
      },
      "peerDependenciesMeta": Object {
        "babel-plugin-macros": Object {
          "optional": true,
        },
      },
      "resolved": "https://registry.npmjs.org/dedent/-/dedent-1.6.0.tgz",
      "version": "1.6.0",
    },
    "node_modules/error-ex": Object {
      "dependencies": Object {
        "is-arrayish": "^0.2.1",
      },
      "integrity": "sha512-7dFHNmqeFSEt2ZBsCriorKnn3Z2pj+fd9kmI6QoWw4//DL+icEBfc0U7qJCisqrTsKTjw4fNFy2pW9OqStD84g==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.2.tgz",
      "version": "1.3.2",
    },
    "node_modules/function-bind": Object {
      "funding": Object {
        "url": "https://github.com/sponsors/ljharb",
      },
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "version": "1.1.2",
    },
    "node_modules/hasown": Object {
      "dependencies": Object {
        "function-bind": "^1.1.2",
      },
      "engines": Object {
        "node": ">= 0.4",
      },
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "version": "2.0.2",
    },
    "node_modules/import-fresh": Object {
      "dependencies": Object {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0",
      },
      "engines": Object {
        "node": ">=6",
      },
      "funding": Object {
        "url": "https://github.com/sponsors/sindresorhus",
      },
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "version": "3.3.1",
    },
    "node_modules/is-arrayish": Object {
      "integrity": "sha512-zz06S8t0ozoDXMG+ube26zeCTNXcKIPJZJi8hBrF4idCLms4CG9QtK7qBl1boi5ODzFpjswb5JPmHCbMpjaYzg==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
      "version": "0.2.1",
    },
    "node_modules/is-core-module": Object {
      "dependencies": Object {
        "hasown": "^2.0.2",
      },
      "engines": Object {
        "node": ">= 0.4",
      },
      "funding": Object {
        "url": "https://github.com/sponsors/ljharb",
      },
      "integrity": "sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.1.tgz",
      "version": "2.16.1",
    },
    "node_modules/js-tokens": Object {
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "version": "4.0.0",
    },
    "node_modules/json-parse-even-better-errors": Object {
      "integrity": "sha512-xyFwyhro/JEof6Ghe2iz2NcXoj2sloNsWr/XsERDK/oiPCfaNhl5ONfp+jQdAZRQQ0IJWNzH9zIZF7li91kh2w==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/json-parse-even-better-errors/-/json-parse-even-better-errors-2.3.1.tgz",
      "version": "2.3.1",
    },
    "node_modules/lines-and-columns": Object {
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "version": "1.2.4",
    },
    "node_modules/parent-module": Object {
      "dependencies": Object {
        "callsites": "^3.0.0",
      },
      "engines": Object {
        "node": ">=6",
      },
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "version": "1.0.1",
    },
    "node_modules/parse-json": Object {
      "dependencies": Object {
        "@babel/code-frame": "^7.0.0",
        "error-ex": "^1.3.1",
        "json-parse-even-better-errors": "^2.3.0",
        "lines-and-columns": "^1.1.6",
      },
      "engines": Object {
        "node": ">=8",
      },
      "funding": Object {
        "url": "https://github.com/sponsors/sindresorhus",
      },
      "integrity": "sha512-ayCKvm/phCGxOkYRSCM82iDwct8/EonSEgCSxWxD7ve6jHggsFl4fZVQBPRNgQoKiuV/odhFrGzQXZwbifC8Rg==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-5.2.0.tgz",
      "version": "5.2.0",
    },
    "node_modules/path-parse": Object {
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "version": "1.0.7",
    },
    "node_modules/path-type": Object {
      "engines": Object {
        "node": ">=8",
      },
      "integrity": "sha512-gDKb8aZMDeD/tZWs9P6+q0J9Mwkdl6xMV8TjnGP3qJVJ06bdMgkbBlLU8IdfOsIsFz2BW1rNVT3XuNEl8zPAvw==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/path-type/-/path-type-4.0.0.tgz",
      "version": "4.0.0",
    },
    "node_modules/picocolors": Object {
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "version": "1.1.1",
    },
    "node_modules/resolve": Object {
      "bin": Object {
        "resolve": "bin/resolve",
      },
      "dependencies": Object {
        "is-core-module": "^2.16.0",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0",
      },
      "engines": Object {
        "node": ">= 0.4",
      },
      "funding": Object {
        "url": "https://github.com/sponsors/ljharb",
      },
      "integrity": "sha512-NPRy+/ncIMeDlTAsuqwKIiferiawhefFJtkNSW0qZJEqMEb+qBt/77B/jGeeek+F0uOeN05CDa6HXbbIgtVX4w==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.10.tgz",
      "version": "1.22.10",
    },
    "node_modules/resolve-from": Object {
      "engines": Object {
        "node": ">=4",
      },
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "version": "4.0.0",
    },
    "node_modules/supports-preserve-symlinks-flag": Object {
      "engines": Object {
        "node": ">= 0.4",
      },
      "funding": Object {
        "url": "https://github.com/sponsors/ljharb",
      },
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "license": "MIT",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "version": "1.0.0",
    },
    "node_modules/yaml": Object {
      "engines": Object {
        "node": ">= 6",
      },
      "integrity": "sha512-r3vXyErRCYJ7wg28yvBY5VSoAF8ZvlcW9/BwUzEtUsjvX/DKs24dIkuwjtuprwJJHsbyUbLApepYTR1BN4uHrg==",
      "license": "ISC",
      "optional": true,
      "peer": true,
      "resolved": "https://registry.npmjs.org/yaml/-/yaml-1.10.2.tgz",
      "version": "1.10.2",
    },
  },
  "requires": true,
  "version": "1.0.0",
}
`

exports[`test/arborist/pruner.js TAP prune workspaces > must match snapshot 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "error": "INVALID",
          "from": "",
          "name": "a",
          "spec": "file:{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/packages/a",
          "type": "workspace",
        },
      },
      "edgesOut": Map {
        "once" => EdgeOut {
          "name": "once",
          "spec": "*",
          "to": "node_modules/once",
          "type": "prod",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/a",
      "name": "a",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/node_modules/a",
      "version": "1.2.3",
    },
    "b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "error": "INVALID",
          "from": "",
          "name": "b",
          "spec": "file:{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/packages/b",
          "type": "workspace",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/b",
      "name": "b",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/node_modules/b",
      "version": "1.2.3",
    },
    "derp" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "derp",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/once",
          "name": "derp",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/derp",
      "name": "derp",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/node_modules/derp",
      "version": "90.2.11",
    },
    "once" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "once",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "derp" => EdgeOut {
          "name": "derp",
          "spec": "*",
          "to": "node_modules/derp",
          "type": "prod",
        },
        "wrappy" => EdgeOut {
          "name": "wrappy",
          "spec": "*",
          "to": "node_modules/wrappy",
          "type": "prod",
        },
      },
      "location": "node_modules/once",
      "name": "once",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/node_modules/once",
      "version": "1.2.3",
    },
    "qs" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "qs",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/qs",
      "name": "qs",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/node_modules/qs",
      "version": "1.2.3",
    },
    "wrappy" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/once",
          "name": "wrappy",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/wrappy",
      "name": "wrappy",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/node_modules/wrappy",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "error": "INVALID",
      "name": "a",
      "spec": "file:{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/packages/a",
      "to": "node_modules/a",
      "type": "workspace",
    },
    "b" => EdgeOut {
      "error": "INVALID",
      "name": "b",
      "spec": "file:{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces/packages/b",
      "to": "node_modules/b",
      "type": "workspace",
    },
    "derp" => EdgeOut {
      "name": "derp",
      "spec": "*",
      "to": "node_modules/derp",
      "type": "prod",
    },
    "qs" => EdgeOut {
      "name": "qs",
      "spec": "*",
      "to": "node_modules/qs",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-pruner-prune-workspaces",
  "packageName": "prune-workspaces",
  "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-workspaces",
  "version": "1.0.0",
  "workspaces": Map {
    "a" => "packages/a",
    "b" => "packages/b",
  },
}
`
