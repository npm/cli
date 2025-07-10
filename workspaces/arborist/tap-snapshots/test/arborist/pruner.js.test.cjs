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
          "to": null,
          "type": "peerOptional",
        },
      },
      "location": "node_modules/dedent",
      "name": "dedent",
      "path": "{CWD}/test/arborist/tap-testdir-pruner-prune-with-lockfile-with-implicit-optional-peer-dependencies/node_modules/dedent",
      "resolved": "https://registry.npmjs.org/dedent/-/dedent-1.6.0.tgz",
      "version": "1.6.0",
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
