/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/arborist/load-actual.js TAP bundle > loaded tree 1`] = `
ArboristNode {
  "bundleDependencies": Array [
    "dep",
  ],
  "children": Map {
    "dep" => ArboristNode {
      "bundled": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "dep",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/dep",
      "name": "dep",
      "path": "bundle/node_modules/dep",
    },
  },
  "edgesOut": Map {
    "dep" => EdgeOut {
      "name": "dep",
      "spec": "*",
      "to": "node_modules/dep",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "bundle",
  "path": "bundle",
}
`

exports[`test/arborist/load-actual.js TAP cwd is default root > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "@scope/x" => ArboristNode {
      "children": Map {
        "glob" => ArboristNode {
          "children": Map {
            "graceful-fs" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "graceful-fs",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "name": "graceful-fs",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "version": "3.0.2",
            },
            "inherits" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "inherits",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "name": "inherits",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "version": "2.0.1",
            },
            "minimatch" => ArboristNode {
              "children": Map {
                "lru-cache" => ArboristNode {
                  "edgesIn": Set {
                    EdgeIn {
                      "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                      "name": "lru-cache",
                      "spec": "*",
                      "type": "prod",
                    },
                  },
                  "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "name": "lru-cache",
                  "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "version": "2.5.0",
                },
                "sigmund" => ArboristNode {
                  "edgesIn": Set {
                    EdgeIn {
                      "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                      "name": "sigmund",
                      "spec": "*",
                      "type": "prod",
                    },
                  },
                  "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "name": "sigmund",
                  "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "version": "1.0.0",
                },
              },
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "minimatch",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "edgesOut": Map {
                "lru-cache" => EdgeOut {
                  "name": "lru-cache",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "type": "prod",
                },
                "once" => EdgeOut {
                  "name": "once",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                  "type": "prod",
                },
                "sigmund" => EdgeOut {
                  "name": "sigmund",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "name": "minimatch",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "version": "1.0.0",
            },
            "once" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "once",
                  "spec": "*",
                  "type": "prod",
                },
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                  "name": "once",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/once",
              "name": "once",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/once",
              "version": "1.3.0",
            },
          },
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/@scope/x",
              "name": "glob",
              "spec": "4",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "graceful-fs" => EdgeOut {
              "name": "graceful-fs",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "type": "prod",
            },
            "inherits" => EdgeOut {
              "name": "inherits",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "type": "prod",
            },
            "minimatch" => EdgeOut {
              "name": "minimatch",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "type": "prod",
            },
            "once" => EdgeOut {
              "name": "once",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
              "type": "prod",
            },
          },
          "location": "node_modules/@scope/x/node_modules/glob",
          "name": "glob",
          "path": "root/node_modules/@scope/x/node_modules/glob",
          "version": "4.0.5",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/x",
          "spec": "1",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/@scope/x",
          "name": "@scope/x",
          "spec": "*",
          "type": "peer",
        },
        EdgeIn {
          "from": "node_modules/foo",
          "name": "@scope/x",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "@scope/x" => EdgeOut {
          "name": "@scope/x",
          "spec": "*",
          "to": "node_modules/@scope/x",
          "type": "peer",
        },
        "@scope/y" => EdgeOut {
          "name": "@scope/y",
          "spec": "*",
          "to": "node_modules/@scope/y",
          "type": "optional",
        },
        "express" => EdgeOut {
          "error": "MISSING",
          "name": "express",
          "spec": "420.69.0-nice",
          "to": null,
          "type": "peer",
        },
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "4",
          "to": "node_modules/@scope/x/node_modules/glob",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/x",
      "name": "@scope/x",
      "path": "root/node_modules/@scope/x",
      "version": "1.2.3",
    },
    "@scope/y" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/y",
          "spec": ">0.99.0",
          "type": "peer",
        },
        EdgeIn {
          "from": "node_modules/@scope/x",
          "name": "@scope/y",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "foo" => EdgeOut {
          "error": "INVALID",
          "name": "foo",
          "spec": "99.x",
          "to": "node_modules/foo",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/y",
      "name": "@scope/y",
      "path": "root/node_modules/@scope/y",
      "version": "1.2.3",
    },
    "foo" => ArboristNode {
      "children": Map {
        "express" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/foo",
              "name": "express",
              "spec": "npm:abbrev@*",
              "type": "prod",
            },
          },
          "location": "node_modules/foo/node_modules/express",
          "name": "express",
          "packageName": "abbrev",
          "path": "root/node_modules/foo/node_modules/express",
          "version": "1.1.1",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "foo",
          "spec": "*",
          "type": "dev",
        },
        EdgeIn {
          "error": "INVALID",
          "from": "node_modules/@scope/y",
          "name": "foo",
          "spec": "99.x",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@scope/x" => EdgeOut {
          "name": "@scope/x",
          "spec": "*",
          "to": "node_modules/@scope/x",
          "type": "optional",
        },
        "express" => EdgeOut {
          "name": "express",
          "spec": "npm:abbrev@*",
          "to": "node_modules/foo/node_modules/express",
          "type": "prod",
        },
      },
      "location": "node_modules/foo",
      "name": "foo",
      "path": "root/node_modules/foo",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "@scope/x" => EdgeOut {
      "name": "@scope/x",
      "spec": "1",
      "to": "node_modules/@scope/x",
      "type": "prod",
    },
    "@scope/y" => EdgeOut {
      "name": "@scope/y",
      "spec": ">0.99.0",
      "to": "node_modules/@scope/y",
      "type": "peer",
    },
    "foo" => EdgeOut {
      "name": "foo",
      "spec": "*",
      "to": "node_modules/foo",
      "type": "dev",
    },
    "notinstalledhere" => EdgeOut {
      "name": "notinstalledhere",
      "spec": "*",
      "to": null,
      "type": "optional",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "root",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP deepmixedloop > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/z",
          "name": "a",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "optional": true,
      "path": "deepmixedloop/node_modules/a",
      "version": "1.2.3",
    },
    "b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "optional": true,
      "path": "deepmixedloop/node_modules/b",
      "version": "1.2.3",
    },
    "c" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/b",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "optional": true,
      "path": "deepmixedloop/node_modules/c",
      "version": "1.2.3",
    },
    "d" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/c",
          "name": "d",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "e" => EdgeOut {
          "name": "e",
          "spec": "*",
          "to": "node_modules/e",
          "type": "prod",
        },
      },
      "location": "node_modules/d",
      "name": "d",
      "optional": true,
      "path": "deepmixedloop/node_modules/d",
      "version": "1.2.3",
    },
    "e" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/d",
          "name": "e",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/e",
      "name": "e",
      "optional": true,
      "path": "deepmixedloop/node_modules/e",
      "version": "1.2.3",
    },
    "i" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "i",
          "spec": "*",
          "type": "dev",
        },
      },
      "edgesOut": Map {
        "j" => EdgeOut {
          "name": "j",
          "spec": "*",
          "to": "node_modules/j",
          "type": "prod",
        },
      },
      "location": "node_modules/i",
      "name": "i",
      "path": "deepmixedloop/node_modules/i",
    },
    "j" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/i",
          "name": "j",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "k" => EdgeOut {
          "name": "k",
          "spec": "*",
          "to": "node_modules/k",
          "type": "prod",
        },
      },
      "location": "node_modules/j",
      "name": "j",
      "path": "deepmixedloop/node_modules/j",
    },
    "k" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/j",
          "name": "k",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/k",
      "name": "k",
      "path": "deepmixedloop/node_modules/k",
    },
    "x" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "x",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "y" => EdgeOut {
          "name": "y",
          "spec": "*",
          "to": "node_modules/y",
          "type": "prod",
        },
      },
      "location": "node_modules/x",
      "name": "x",
      "path": "deepmixedloop/node_modules/x",
    },
    "y" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/x",
          "name": "y",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "z" => EdgeOut {
          "name": "z",
          "spec": "*",
          "to": "node_modules/z",
          "type": "prod",
        },
      },
      "location": "node_modules/y",
      "name": "y",
      "path": "deepmixedloop/node_modules/y",
    },
    "z" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/y",
          "name": "z",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "a" => EdgeOut {
          "name": "a",
          "spec": "*",
          "to": "node_modules/a",
          "type": "optional",
        },
      },
      "location": "node_modules/z",
      "name": "z",
      "path": "deepmixedloop/node_modules/z",
    },
  },
  "edgesOut": Map {
    "i" => EdgeOut {
      "name": "i",
      "spec": "*",
      "to": "node_modules/i",
      "type": "dev",
    },
    "x" => EdgeOut {
      "name": "x",
      "spec": "*",
      "to": "node_modules/x",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "deepmixedloop",
  "packageName": "root",
  "path": "deepmixedloop",
}
`

exports[`test/arborist/load-actual.js TAP deeproot/root > loaded tree 1`] = `
ArboristLink {
  "isProjectRoot": true,
  "location": "../deeproot/root",
  "name": "root",
  "path": "deeproot/root",
  "realpath": "root",
  "resolved": "file:../root",
  "target": ArboristNode {
    "children": Map {
      "@scope/x" => ArboristNode {
        "children": Map {
          "glob" => ArboristNode {
            "children": Map {
              "graceful-fs" => ArboristNode {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "graceful-fs",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
                "name": "graceful-fs",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
                "version": "3.0.2",
              },
              "inherits" => ArboristNode {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "inherits",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
                "name": "inherits",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
                "version": "2.0.1",
              },
              "minimatch" => ArboristNode {
                "children": Map {
                  "lru-cache" => ArboristNode {
                    "edgesIn": Set {
                      EdgeIn {
                        "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                        "name": "lru-cache",
                        "spec": "*",
                        "type": "prod",
                      },
                    },
                    "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "name": "lru-cache",
                    "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "version": "2.5.0",
                  },
                  "sigmund" => ArboristNode {
                    "edgesIn": Set {
                      EdgeIn {
                        "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                        "name": "sigmund",
                        "spec": "*",
                        "type": "prod",
                      },
                    },
                    "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "name": "sigmund",
                    "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "version": "1.0.0",
                  },
                },
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "minimatch",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "edgesOut": Map {
                  "lru-cache" => EdgeOut {
                    "name": "lru-cache",
                    "spec": "*",
                    "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "type": "prod",
                  },
                  "once" => EdgeOut {
                    "name": "once",
                    "spec": "*",
                    "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                    "type": "prod",
                  },
                  "sigmund" => EdgeOut {
                    "name": "sigmund",
                    "spec": "*",
                    "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                "name": "minimatch",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                "version": "1.0.0",
              },
              "once" => ArboristNode {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "once",
                    "spec": "*",
                    "type": "prod",
                  },
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                    "name": "once",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                "name": "once",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/once",
                "version": "1.3.0",
              },
            },
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/@scope/x",
                "name": "glob",
                "spec": "4",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "graceful-fs" => EdgeOut {
                "name": "graceful-fs",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
                "type": "prod",
              },
              "inherits" => EdgeOut {
                "name": "inherits",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
                "type": "prod",
              },
              "minimatch" => EdgeOut {
                "name": "minimatch",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                "type": "prod",
              },
              "once" => EdgeOut {
                "name": "once",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                "type": "prod",
              },
            },
            "location": "node_modules/@scope/x/node_modules/glob",
            "name": "glob",
            "path": "root/node_modules/@scope/x/node_modules/glob",
            "version": "4.0.5",
          },
        },
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "@scope/x",
            "spec": "1",
            "type": "prod",
          },
          EdgeIn {
            "from": "node_modules/@scope/x",
            "name": "@scope/x",
            "spec": "*",
            "type": "peer",
          },
          EdgeIn {
            "from": "node_modules/foo",
            "name": "@scope/x",
            "spec": "*",
            "type": "optional",
          },
        },
        "edgesOut": Map {
          "@scope/x" => EdgeOut {
            "name": "@scope/x",
            "spec": "*",
            "to": "node_modules/@scope/x",
            "type": "peer",
          },
          "@scope/y" => EdgeOut {
            "name": "@scope/y",
            "spec": "*",
            "to": "node_modules/@scope/y",
            "type": "optional",
          },
          "express" => EdgeOut {
            "error": "MISSING",
            "name": "express",
            "spec": "420.69.0-nice",
            "to": null,
            "type": "peer",
          },
          "glob" => EdgeOut {
            "name": "glob",
            "spec": "4",
            "to": "node_modules/@scope/x/node_modules/glob",
            "type": "prod",
          },
        },
        "location": "node_modules/@scope/x",
        "name": "@scope/x",
        "path": "root/node_modules/@scope/x",
        "version": "1.2.3",
      },
      "@scope/y" => ArboristNode {
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "@scope/y",
            "spec": ">0.99.0",
            "type": "peer",
          },
          EdgeIn {
            "from": "node_modules/@scope/x",
            "name": "@scope/y",
            "spec": "*",
            "type": "optional",
          },
        },
        "edgesOut": Map {
          "foo" => EdgeOut {
            "error": "INVALID",
            "name": "foo",
            "spec": "99.x",
            "to": "node_modules/foo",
            "type": "prod",
          },
        },
        "location": "node_modules/@scope/y",
        "name": "@scope/y",
        "path": "root/node_modules/@scope/y",
        "version": "1.2.3",
      },
      "foo" => ArboristNode {
        "children": Map {
          "express" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/foo",
                "name": "express",
                "spec": "npm:abbrev@*",
                "type": "prod",
              },
            },
            "location": "node_modules/foo/node_modules/express",
            "name": "express",
            "packageName": "abbrev",
            "path": "root/node_modules/foo/node_modules/express",
            "version": "1.1.1",
          },
        },
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "foo",
            "spec": "*",
            "type": "dev",
          },
          EdgeIn {
            "error": "INVALID",
            "from": "node_modules/@scope/y",
            "name": "foo",
            "spec": "99.x",
            "type": "prod",
          },
        },
        "edgesOut": Map {
          "@scope/x" => EdgeOut {
            "name": "@scope/x",
            "spec": "*",
            "to": "node_modules/@scope/x",
            "type": "optional",
          },
          "express" => EdgeOut {
            "name": "express",
            "spec": "npm:abbrev@*",
            "to": "node_modules/foo/node_modules/express",
            "type": "prod",
          },
        },
        "location": "node_modules/foo",
        "name": "foo",
        "path": "root/node_modules/foo",
        "version": "1.2.3",
      },
    },
    "edgesOut": Map {
      "@scope/x" => EdgeOut {
        "name": "@scope/x",
        "spec": "1",
        "to": "node_modules/@scope/x",
        "type": "prod",
      },
      "@scope/y" => EdgeOut {
        "name": "@scope/y",
        "spec": ">0.99.0",
        "to": "node_modules/@scope/y",
        "type": "peer",
      },
      "foo" => EdgeOut {
        "name": "foo",
        "spec": "*",
        "to": "node_modules/foo",
        "type": "dev",
      },
      "notinstalledhere" => EdgeOut {
        "name": "notinstalledhere",
        "spec": "*",
        "to": null,
        "type": "optional",
      },
    },
    "isProjectRoot": true,
    "location": "",
    "name": "root",
    "path": "root",
    "version": "1.2.3",
  },
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP devloop > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "*",
          "type": "dev",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "path": "devloop/node_modules/a",
      "version": "1.2.3",
    },
    "b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/d",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "path": "devloop/node_modules/b",
      "version": "1.2.3",
    },
    "c" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "path": "devloop/node_modules/c",
      "version": "1.2.3",
    },
    "d" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "d",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/c",
          "name": "d",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "location": "node_modules/d",
      "name": "d",
      "path": "devloop/node_modules/d",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "*",
      "to": "node_modules/a",
      "type": "dev",
    },
    "c" => EdgeOut {
      "name": "c",
      "spec": "*",
      "to": "node_modules/c",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "devloop",
  "path": "devloop",
}
`

exports[`test/arborist/load-actual.js TAP do not load from a hidden lockfile when forceActual is set > must match snapshot 1`] = `
ArboristNode {
  "children": Map {
    "abbrev" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "abbrev",
          "spec": "^1.1.1",
          "type": "prod",
        },
      },
      "location": "node_modules/abbrev",
      "name": "abbrev",
      "path": "hidden-lockfile/node_modules/abbrev",
      "version": "1.1.1",
    },
  },
  "edgesOut": Map {
    "abbrev" => EdgeOut {
      "name": "abbrev",
      "spec": "^1.1.1",
      "to": "node_modules/abbrev",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "hidden-lockfile",
  "path": "hidden-lockfile",
}
`

exports[`test/arborist/load-actual.js TAP external-dep/root > loaded tree 1`] = `
ArboristNode {
  "edgesOut": Map {
    "dep" => EdgeOut {
      "error": "MISSING",
      "name": "dep",
      "spec": "*",
      "to": null,
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "external-dep/root",
  "version": "1.0.0",
}
`

exports[`test/arborist/load-actual.js TAP external-link-cached-dummy-dep/root > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "x" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "x",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/x",
      "name": "x",
      "path": "external-link-cached-dummy-dep/root/node_modules/x",
      "realpath": "external-link-cached-dummy-dep/a/node_modules/b/node_modules/x",
      "resolved": "file:../../a/node_modules/b/node_modules/x",
      "target": ArboristNode {
        "edgesIn": Set {
          EdgeIn {
            "from": "../a/node_modules/b",
            "name": "x",
            "spec": "*",
            "type": "prod",
          },
        },
        "edgesOut": Map {
          "y" => EdgeOut {
            "name": "y",
            "spec": "*",
            "to": "../a/node_modules/b/node_modules/y",
            "type": "prod",
          },
        },
        "location": "../a/node_modules/b/node_modules/x",
        "name": "x",
        "path": "external-link-cached-dummy-dep/a/node_modules/b/node_modules/x",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "z" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "z",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/z",
      "name": "z",
      "path": "external-link-cached-dummy-dep/root/node_modules/z",
      "realpath": "external-link-cached-dummy-dep/a/t/u/v/w/x/y/z",
      "resolved": "file:../../a/t/u/v/w/x/y/z",
      "target": ArboristNode {
        "edgesOut": Map {
          "b" => EdgeOut {
            "name": "b",
            "spec": "*",
            "to": "../a/node_modules/b",
            "type": "prod",
          },
        },
        "location": "../a/t/u/v/w/x/y/z",
        "name": "z",
        "path": "external-link-cached-dummy-dep/a/t/u/v/w/x/y/z",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "x" => EdgeOut {
      "name": "x",
      "spec": "*",
      "to": "node_modules/x",
      "type": "prod",
    },
    "z" => EdgeOut {
      "name": "z",
      "spec": "*",
      "to": "node_modules/z",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "external-link-cached-dummy-dep/root",
}
`

exports[`test/arborist/load-actual.js TAP external-link/root > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "j" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "j",
          "spec": "file:../i/j",
          "type": "prod",
        },
      },
      "location": "node_modules/j",
      "name": "j",
      "path": "external-link/root/node_modules/j",
      "realpath": "external-link/i/j",
      "resolved": "file:../../i/j",
      "target": ArboristNode {
        "edgesOut": Map {
          "k" => EdgeOut {
            "name": "k",
            "spec": "*",
            "to": "../i/node_modules/k",
            "type": "prod",
          },
        },
        "location": "../i/j",
        "name": "j",
        "path": "external-link/i/j",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "o" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "o",
          "spec": "file:../m/node_modules/n/o",
          "type": "prod",
        },
      },
      "location": "node_modules/o",
      "name": "o",
      "path": "external-link/root/node_modules/o",
      "realpath": "external-link/m/node_modules/n/o",
      "resolved": "file:../../m/node_modules/n/o",
      "target": ArboristNode {
        "edgesOut": Map {
          "p" => EdgeOut {
            "name": "p",
            "spec": "*",
            "to": "../m/node_modules/p",
            "type": "prod",
          },
        },
        "location": "../m/node_modules/n/o",
        "name": "o",
        "path": "external-link/m/node_modules/n/o",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "o2" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "o2",
          "spec": "file:../m/node_modules/n/o2",
          "type": "prod",
        },
      },
      "location": "node_modules/o2",
      "name": "o2",
      "path": "external-link/root/node_modules/o2",
      "realpath": "external-link/m/node_modules/n/o2",
      "resolved": "file:../../m/node_modules/n/o2",
      "target": ArboristNode {
        "edgesOut": Map {
          "p" => EdgeOut {
            "name": "p",
            "spec": "*",
            "to": "../m/node_modules/p",
            "type": "prod",
          },
        },
        "location": "../m/node_modules/n/o2",
        "name": "o2",
        "path": "external-link/m/node_modules/n/o2",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "x" => ArboristNode {
      "children": Map {
        "b" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/x",
              "name": "b",
              "spec": "file:../../../a/node_modules/b",
              "type": "prod",
            },
          },
          "location": "node_modules/x/node_modules/b",
          "name": "b",
          "path": "external-link/root/node_modules/x/node_modules/b",
          "realpath": "external-link/a/node_modules/b",
          "resolved": "file:../../../../a/node_modules/b",
          "target": ArboristNode {
            "edgesOut": Map {
              "c" => EdgeOut {
                "name": "c",
                "spec": "*",
                "to": "../a/node_modules/c",
                "type": "prod",
              },
            },
            "location": "../a/node_modules/b",
            "name": "b",
            "path": "external-link/a/node_modules/b",
            "version": "1.0.0",
          },
          "version": "1.0.0",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "x",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "file:../../../a/node_modules/b",
          "to": "node_modules/x/node_modules/b",
          "type": "prod",
        },
      },
      "location": "node_modules/x",
      "name": "x",
      "path": "external-link/root/node_modules/x",
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "j" => EdgeOut {
      "name": "j",
      "spec": "file:../i/j",
      "to": "node_modules/j",
      "type": "prod",
    },
    "o" => EdgeOut {
      "name": "o",
      "spec": "file:../m/node_modules/n/o",
      "to": "node_modules/o",
      "type": "prod",
    },
    "o2" => EdgeOut {
      "name": "o2",
      "spec": "file:../m/node_modules/n/o2",
      "to": "node_modules/o2",
      "type": "prod",
    },
    "x" => EdgeOut {
      "name": "x",
      "spec": "*",
      "to": "node_modules/x",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "external-link/root",
  "version": "1.0.0",
}
`

exports[`test/arborist/load-actual.js TAP install-types > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "abbrev" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "abbrev",
          "spec": "^1.1.1",
          "type": "prod",
        },
      },
      "location": "node_modules/abbrev",
      "name": "abbrev",
      "path": "install-types/node_modules/abbrev",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
    "balanced-match" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/brace-expansion",
          "name": "balanced-match",
          "spec": "^1.0.0",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/balanced-match",
      "name": "balanced-match",
      "optional": true,
      "path": "install-types/node_modules/balanced-match",
      "peer": true,
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz",
      "version": "1.0.0",
    },
    "brace-expansion" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/minimatch",
          "name": "brace-expansion",
          "spec": "^1.1.7",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "balanced-match" => EdgeOut {
          "name": "balanced-match",
          "spec": "^1.0.0",
          "to": "node_modules/balanced-match",
          "type": "prod",
        },
        "concat-map" => EdgeOut {
          "name": "concat-map",
          "spec": "0.0.1",
          "to": "node_modules/concat-map",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/brace-expansion",
      "name": "brace-expansion",
      "optional": true,
      "path": "install-types/node_modules/brace-expansion",
      "peer": true,
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.11.tgz",
      "version": "1.1.11",
    },
    "bundler" => ArboristNode {
      "bundleDependencies": Array [
        "a",
      ],
      "children": Map {
        "a" => ArboristNode {
          "bundled": true,
          "bundler": "node_modules/bundler",
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/bundler",
              "name": "a",
              "spec": "*",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "b" => EdgeOut {
              "name": "b",
              "spec": "*",
              "to": "node_modules/bundler/node_modules/b",
              "type": "prod",
            },
          },
          "location": "node_modules/bundler/node_modules/a",
          "name": "a",
          "path": "install-types/node_modules/bundler/node_modules/a",
          "resolved": "https://registry.internal/a/-/a-1.2.3.tgz",
          "version": "1.2.3",
        },
        "b" => ArboristNode {
          "bundled": true,
          "bundler": "node_modules/bundler",
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/bundler/node_modules/a",
              "name": "b",
              "spec": "*",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "c" => EdgeOut {
              "name": "c",
              "spec": "*",
              "to": "node_modules/bundler/node_modules/c",
              "type": "prod",
            },
          },
          "location": "node_modules/bundler/node_modules/b",
          "name": "b",
          "path": "install-types/node_modules/bundler/node_modules/b",
          "resolved": "https://registry.internal/b/-/b-1.2.3.tgz",
          "version": "1.2.3",
        },
        "c" => ArboristNode {
          "bundled": true,
          "bundler": "node_modules/bundler",
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/bundler/node_modules/b",
              "name": "c",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/bundler/node_modules/c",
          "name": "c",
          "path": "install-types/node_modules/bundler/node_modules/c",
          "resolved": "https://registry.internal/c/-/c-1.2.3.tgz",
          "version": "1.2.3",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "bundler",
          "spec": "1.2.3",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "a" => EdgeOut {
          "name": "a",
          "spec": "*",
          "to": "node_modules/bundler/node_modules/a",
          "type": "prod",
        },
      },
      "location": "node_modules/bundler",
      "name": "bundler",
      "path": "install-types/node_modules/bundler",
      "resolved": "https://registry.internal/bundler/-/bundler-1.2.3.tgz",
      "version": "1.2.3",
    },
    "concat-map" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/brace-expansion",
          "name": "concat-map",
          "spec": "0.0.1",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/concat-map",
      "name": "concat-map",
      "optional": true,
      "path": "install-types/node_modules/concat-map",
      "peer": true,
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "version": "0.0.1",
    },
    "fs.realpath" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/glob",
          "name": "fs.realpath",
          "spec": "^1.0.0",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/fs.realpath",
      "name": "fs.realpath",
      "optional": true,
      "path": "install-types/node_modules/fs.realpath",
      "peer": true,
      "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
      "version": "1.0.0",
    },
    "full-git-url" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "full-git-url",
          "spec": "git+https://github.com/isaacs/abbrev-js.git",
          "type": "prod",
        },
      },
      "location": "node_modules/full-git-url",
      "name": "full-git-url",
      "packageName": "abbrev",
      "path": "install-types/node_modules/full-git-url",
      "resolved": "git+ssh://git@github.com/isaacs/abbrev-js.git#a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
      "version": "1.1.1",
    },
    "ghshort" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "ghshort",
          "spec": "github:isaacs/abbrev-js",
          "type": "prod",
        },
      },
      "location": "node_modules/ghshort",
      "name": "ghshort",
      "packageName": "abbrev",
      "path": "install-types/node_modules/ghshort",
      "resolved": "git+ssh://git@github.com/isaacs/abbrev-js.git#a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
      "version": "1.1.1",
    },
    "ghtgz" => ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "node_modules/ghtgz",
      "name": "ghtgz",
      "optional": true,
      "packageName": "abbrev",
      "path": "install-types/node_modules/ghtgz",
      "peer": true,
      "resolved": "https://codeload.github.com/isaacs/abbrev-js/tar.gz/a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
      "version": "1.1.1",
    },
    "glob" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/rimraf",
          "name": "glob",
          "spec": "^7.1.3",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "fs.realpath" => EdgeOut {
          "name": "fs.realpath",
          "spec": "^1.0.0",
          "to": "node_modules/fs.realpath",
          "type": "prod",
        },
        "inflight" => EdgeOut {
          "name": "inflight",
          "spec": "^1.0.4",
          "to": "node_modules/inflight",
          "type": "prod",
        },
        "inherits" => EdgeOut {
          "name": "inherits",
          "spec": "2",
          "to": "node_modules/inherits",
          "type": "prod",
        },
        "minimatch" => EdgeOut {
          "name": "minimatch",
          "spec": "^3.0.4",
          "to": "node_modules/minimatch",
          "type": "prod",
        },
        "once" => EdgeOut {
          "name": "once",
          "spec": "^1.3.0",
          "to": "node_modules/once",
          "type": "prod",
        },
        "path-is-absolute" => EdgeOut {
          "name": "path-is-absolute",
          "spec": "^1.0.0",
          "to": "node_modules/path-is-absolute",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/glob",
      "name": "glob",
      "optional": true,
      "path": "install-types/node_modules/glob",
      "peer": true,
      "resolved": "https://registry.npmjs.org/glob/-/glob-7.1.4.tgz",
      "version": "7.1.4",
    },
    "inflight" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/glob",
          "name": "inflight",
          "spec": "^1.0.4",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "once" => EdgeOut {
          "name": "once",
          "spec": "^1.3.0",
          "to": "node_modules/once",
          "type": "prod",
        },
        "wrappy" => EdgeOut {
          "name": "wrappy",
          "spec": "1",
          "to": "node_modules/wrappy",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/inflight",
      "name": "inflight",
      "optional": true,
      "path": "install-types/node_modules/inflight",
      "peer": true,
      "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
      "version": "1.0.6",
    },
    "inherits" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/glob",
          "name": "inherits",
          "spec": "2",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/inherits",
      "name": "inherits",
      "optional": true,
      "path": "install-types/node_modules/inherits",
      "peer": true,
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "version": "2.0.4",
    },
    "minimatch" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/glob",
          "name": "minimatch",
          "spec": "^3.0.4",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "brace-expansion" => EdgeOut {
          "name": "brace-expansion",
          "spec": "^1.1.7",
          "to": "node_modules/brace-expansion",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/minimatch",
      "name": "minimatch",
      "optional": true,
      "path": "install-types/node_modules/minimatch",
      "peer": true,
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.4.tgz",
      "version": "3.0.4",
    },
    "old" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "old",
          "spec": "npm:abbrev@^1.0.3",
          "type": "prod",
        },
      },
      "location": "node_modules/old",
      "name": "old",
      "packageName": "abbrev",
      "path": "install-types/node_modules/old",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.3.tgz",
      "version": "1.0.3",
    },
    "once" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/glob",
          "name": "once",
          "spec": "^1.3.0",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/inflight",
          "name": "once",
          "spec": "^1.3.0",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "wrappy" => EdgeOut {
          "name": "wrappy",
          "spec": "1",
          "to": "node_modules/wrappy",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/once",
      "name": "once",
      "optional": true,
      "path": "install-types/node_modules/once",
      "peer": true,
      "resolved": "file:{CWD}/test/fixtures/install-types/once-1.4.0.tgz",
      "version": "1.4.0",
    },
    "path-is-absolute" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/glob",
          "name": "path-is-absolute",
          "spec": "^1.0.0",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/path-is-absolute",
      "name": "path-is-absolute",
      "optional": true,
      "path": "install-types/node_modules/path-is-absolute",
      "peer": true,
      "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
      "version": "1.0.1",
    },
    "pinned" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "pinned",
          "spec": "npm:abbrev@^1.1.1",
          "type": "prod",
        },
      },
      "location": "node_modules/pinned",
      "name": "pinned",
      "packageName": "abbrev",
      "path": "install-types/node_modules/pinned",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
    "reg" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "reg",
          "spec": "npm:abbrev@^1.1.1",
          "type": "prod",
        },
      },
      "location": "node_modules/reg",
      "name": "reg",
      "packageName": "abbrev",
      "path": "install-types/node_modules/reg",
      "resolved": "https://localhost:8080/abbrev/-/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
    "remote" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "remote",
          "spec": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
          "type": "prod",
        },
      },
      "location": "node_modules/remote",
      "name": "remote",
      "packageName": "abbrev",
      "path": "install-types/node_modules/remote",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
    "rimraf" => ArboristNode {
      "dev": true,
      "edgesOut": Map {
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "^7.1.3",
          "to": "node_modules/glob",
          "type": "optional",
        },
      },
      "extraneous": true,
      "location": "node_modules/rimraf",
      "name": "rimraf",
      "optional": true,
      "path": "install-types/node_modules/rimraf",
      "peer": true,
      "resolved": "file:{CWD}/test/fixtures/install-types/rimraf-2.6.3.tgz",
      "version": "2.6.3",
    },
    "symlink" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "symlink",
          "spec": "file:./abbrev-link-target",
          "type": "prod",
        },
      },
      "location": "node_modules/symlink",
      "name": "symlink",
      "packageName": "abbrev",
      "path": "install-types/node_modules/symlink",
      "realpath": "install-types/abbrev-link-target",
      "resolved": "file:../abbrev-link-target",
      "target": ArboristNode {
        "location": "abbrev-link-target",
      },
      "version": "1.1.1",
    },
    "tarball" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "tarball",
          "spec": "file:abbrev-1.1.1.tgz",
          "type": "prod",
        },
      },
      "location": "node_modules/tarball",
      "name": "tarball",
      "packageName": "abbrev",
      "path": "install-types/node_modules/tarball",
      "resolved": "file:{CWD}/test/fixtures/install-types/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
    "wrappy" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/inflight",
          "name": "wrappy",
          "spec": "1",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/once",
          "name": "wrappy",
          "spec": "1",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/wrappy",
      "name": "wrappy",
      "optional": true,
      "path": "install-types/node_modules/wrappy",
      "peer": true,
      "resolved": "https://localhost:8080/wrappy/-/wrappy-1.0.2.tgz",
      "version": "1.0.2",
    },
  },
  "edgesOut": Map {
    "abbrev" => EdgeOut {
      "name": "abbrev",
      "spec": "^1.1.1",
      "to": "node_modules/abbrev",
      "type": "prod",
    },
    "bundler" => EdgeOut {
      "name": "bundler",
      "spec": "1.2.3",
      "to": "node_modules/bundler",
      "type": "prod",
    },
    "full-git-url" => EdgeOut {
      "name": "full-git-url",
      "spec": "git+https://github.com/isaacs/abbrev-js.git",
      "to": "node_modules/full-git-url",
      "type": "prod",
    },
    "ghshort" => EdgeOut {
      "name": "ghshort",
      "spec": "github:isaacs/abbrev-js",
      "to": "node_modules/ghshort",
      "type": "prod",
    },
    "old" => EdgeOut {
      "name": "old",
      "spec": "npm:abbrev@^1.0.3",
      "to": "node_modules/old",
      "type": "prod",
    },
    "pinned" => EdgeOut {
      "name": "pinned",
      "spec": "npm:abbrev@^1.1.1",
      "to": "node_modules/pinned",
      "type": "prod",
    },
    "reg" => EdgeOut {
      "name": "reg",
      "spec": "npm:abbrev@^1.1.1",
      "to": "node_modules/reg",
      "type": "prod",
    },
    "remote" => EdgeOut {
      "name": "remote",
      "spec": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
      "to": "node_modules/remote",
      "type": "prod",
    },
    "symlink" => EdgeOut {
      "name": "symlink",
      "spec": "file:./abbrev-link-target",
      "to": "node_modules/symlink",
      "type": "prod",
    },
    "tarball" => EdgeOut {
      "name": "tarball",
      "spec": "file:abbrev-1.1.1.tgz",
      "to": "node_modules/tarball",
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "edgesOut": Map {
        "tap" => EdgeOut {
          "error": "MISSING",
          "name": "tap",
          "spec": "^14.4.1",
          "to": null,
          "type": "dev",
        },
      },
      "location": "abbrev-link-target",
      "name": "abbrev-link-target",
      "packageName": "abbrev",
      "path": "install-types/abbrev-link-target",
      "version": "1.1.1",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "install-types",
  "packageName": "a",
  "path": "install-types",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP link-dep-cycle > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "file:a",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "path": "link-dep-cycle/node_modules/a",
      "realpath": "link-dep-cycle/a",
      "resolved": "file:../a",
      "target": ArboristNode {
        "location": "a",
      },
    },
    "b" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "b",
          "spec": "file:b",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "path": "link-dep-cycle/node_modules/b",
      "realpath": "link-dep-cycle/b",
      "resolved": "file:../b",
      "target": ArboristNode {
        "location": "b",
      },
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "file:a",
      "to": "node_modules/a",
      "type": "prod",
    },
    "b" => EdgeOut {
      "name": "b",
      "spec": "file:b",
      "to": "node_modules/b",
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "children": Map {
        "b" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "a",
              "name": "b",
              "spec": "file:../b",
              "type": "prod",
            },
          },
          "location": "a/node_modules/b",
          "name": "b",
          "path": "link-dep-cycle/a/node_modules/b",
          "realpath": "link-dep-cycle/b",
          "resolved": "file:../../b",
          "target": ArboristNode {
            "children": Map {
              "a" => ArboristLink {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "b",
                    "name": "a",
                    "spec": "file:../a",
                    "type": "prod",
                  },
                },
                "location": "b/node_modules/a",
                "name": "a",
                "path": "link-dep-cycle/b/node_modules/a",
                "realpath": "link-dep-cycle/a",
                "resolved": "file:../../a",
                "target": ArboristNode {
                  "location": "a",
                },
              },
            },
            "edgesOut": Map {
              "a" => EdgeOut {
                "name": "a",
                "spec": "file:../a",
                "to": "b/node_modules/a",
                "type": "prod",
              },
            },
            "location": "b",
            "name": "b",
            "path": "link-dep-cycle/b",
          },
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "file:../b",
          "to": "a/node_modules/b",
          "type": "prod",
        },
      },
      "location": "a",
      "name": "a",
      "path": "link-dep-cycle/a",
    },
    ArboristNode {
      "location": "b",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "link-dep-cycle",
  "path": "link-dep-cycle",
}
`

exports[`test/arborist/load-actual.js TAP link-dep-nested > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "foo" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "foo",
          "spec": "file:once",
          "type": "prod",
        },
      },
      "location": "node_modules/foo",
      "name": "foo",
      "packageName": "once",
      "path": "link-dep-nested/node_modules/foo",
      "realpath": "link-dep-nested/once",
      "resolved": "file:../once",
      "target": ArboristNode {
        "location": "once",
      },
      "version": "1.4.0",
    },
    "once" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "once",
          "spec": "file:once",
          "type": "prod",
        },
      },
      "location": "node_modules/once",
      "name": "once",
      "path": "link-dep-nested/node_modules/once",
      "realpath": "link-dep-nested/once",
      "resolved": "file:../once",
      "target": ArboristNode {
        "location": "once",
      },
      "version": "1.4.0",
    },
  },
  "edgesOut": Map {
    "foo" => EdgeOut {
      "name": "foo",
      "spec": "file:once",
      "to": "node_modules/foo",
      "type": "prod",
    },
    "once" => EdgeOut {
      "name": "once",
      "spec": "file:once",
      "to": "node_modules/once",
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "children": Map {
        "wrappy" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "once",
              "name": "wrappy",
              "spec": "1",
              "type": "prod",
            },
          },
          "location": "once/node_modules/wrappy",
          "name": "wrappy",
          "path": "link-dep-nested/once/node_modules/wrappy",
          "version": "1.0.2",
        },
      },
      "edgesOut": Map {
        "tap" => EdgeOut {
          "error": "MISSING",
          "name": "tap",
          "spec": "^7.0.1",
          "to": null,
          "type": "dev",
        },
        "wrappy" => EdgeOut {
          "name": "wrappy",
          "spec": "1",
          "to": "once/node_modules/wrappy",
          "type": "prod",
        },
      },
      "location": "once",
      "name": "once",
      "path": "link-dep-nested/once",
      "version": "1.4.0",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "link-dep-nested",
  "packageName": "nested-thingies",
  "path": "link-dep-nested",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP link-dep-nested/root > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "bork" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "bork",
          "spec": "file:..",
          "type": "prod",
        },
      },
      "location": "node_modules/bork",
      "name": "bork",
      "packageName": "nested-thingies",
      "path": "link-dep-nested/root/node_modules/bork",
      "realpath": "link-dep-nested",
      "resolved": "file:../..",
      "target": ArboristNode {
        "children": Map {
          "foo" => ArboristLink {
            "edgesIn": Set {
              EdgeIn {
                "from": "..",
                "name": "foo",
                "spec": "file:once",
                "type": "prod",
              },
            },
            "location": "../node_modules/foo",
            "name": "foo",
            "packageName": "once",
            "path": "link-dep-nested/node_modules/foo",
            "realpath": "link-dep-nested/once",
            "resolved": "file:../once",
            "target": ArboristNode {
              "location": "../once",
            },
            "version": "1.4.0",
          },
          "once" => ArboristLink {
            "edgesIn": Set {
              EdgeIn {
                "from": "..",
                "name": "once",
                "spec": "file:once",
                "type": "prod",
              },
            },
            "location": "../node_modules/once",
            "name": "once",
            "path": "link-dep-nested/node_modules/once",
            "realpath": "link-dep-nested/once",
            "resolved": "file:../once",
            "target": ArboristNode {
              "location": "../once",
            },
            "version": "1.4.0",
          },
        },
        "edgesOut": Map {
          "foo" => EdgeOut {
            "name": "foo",
            "spec": "file:once",
            "to": "../node_modules/foo",
            "type": "prod",
          },
          "once" => EdgeOut {
            "name": "once",
            "spec": "file:once",
            "to": "../node_modules/once",
            "type": "prod",
          },
        },
        "fsChildren": Set {
          ArboristNode {
            "children": Map {
              "wrappy" => ArboristNode {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "../once",
                    "name": "wrappy",
                    "spec": "1",
                    "type": "prod",
                  },
                },
                "location": "../once/node_modules/wrappy",
                "name": "wrappy",
                "path": "link-dep-nested/once/node_modules/wrappy",
                "version": "1.0.2",
              },
            },
            "edgesOut": Map {
              "tap" => EdgeOut {
                "error": "MISSING",
                "name": "tap",
                "spec": "^7.0.1",
                "to": null,
                "type": "dev",
              },
              "wrappy" => EdgeOut {
                "name": "wrappy",
                "spec": "1",
                "to": "../once/node_modules/wrappy",
                "type": "prod",
              },
            },
            "location": "../once",
            "name": "once",
            "path": "link-dep-nested/once",
            "version": "1.4.0",
          },
        },
        "location": "..",
        "name": "link-dep-nested",
        "packageName": "nested-thingies",
        "path": "link-dep-nested",
        "version": "1.2.3",
      },
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "bork" => EdgeOut {
      "name": "bork",
      "spec": "file:..",
      "to": "node_modules/bork",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "link-dep-nested/root",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP linkedroot > loaded tree 1`] = `
ArboristLink {
  "isProjectRoot": true,
  "location": "../linkedroot",
  "name": "linkedroot",
  "packageName": "root",
  "path": "linkedroot",
  "realpath": "root",
  "resolved": "file:root",
  "target": ArboristNode {
    "children": Map {
      "@scope/x" => ArboristNode {
        "children": Map {
          "glob" => ArboristNode {
            "children": Map {
              "graceful-fs" => ArboristNode {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "graceful-fs",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
                "name": "graceful-fs",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
                "version": "3.0.2",
              },
              "inherits" => ArboristNode {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "inherits",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
                "name": "inherits",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
                "version": "2.0.1",
              },
              "minimatch" => ArboristNode {
                "children": Map {
                  "lru-cache" => ArboristNode {
                    "edgesIn": Set {
                      EdgeIn {
                        "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                        "name": "lru-cache",
                        "spec": "*",
                        "type": "prod",
                      },
                    },
                    "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "name": "lru-cache",
                    "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "version": "2.5.0",
                  },
                  "sigmund" => ArboristNode {
                    "edgesIn": Set {
                      EdgeIn {
                        "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                        "name": "sigmund",
                        "spec": "*",
                        "type": "prod",
                      },
                    },
                    "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "name": "sigmund",
                    "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "version": "1.0.0",
                  },
                },
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "minimatch",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "edgesOut": Map {
                  "lru-cache" => EdgeOut {
                    "name": "lru-cache",
                    "spec": "*",
                    "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "type": "prod",
                  },
                  "once" => EdgeOut {
                    "name": "once",
                    "spec": "*",
                    "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                    "type": "prod",
                  },
                  "sigmund" => EdgeOut {
                    "name": "sigmund",
                    "spec": "*",
                    "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                "name": "minimatch",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                "version": "1.0.0",
              },
              "once" => ArboristNode {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob",
                    "name": "once",
                    "spec": "*",
                    "type": "prod",
                  },
                  EdgeIn {
                    "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                    "name": "once",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                "name": "once",
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/once",
                "version": "1.3.0",
              },
            },
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/@scope/x",
                "name": "glob",
                "spec": "4",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "graceful-fs" => EdgeOut {
                "name": "graceful-fs",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
                "type": "prod",
              },
              "inherits" => EdgeOut {
                "name": "inherits",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
                "type": "prod",
              },
              "minimatch" => EdgeOut {
                "name": "minimatch",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                "type": "prod",
              },
              "once" => EdgeOut {
                "name": "once",
                "spec": "*",
                "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                "type": "prod",
              },
            },
            "location": "node_modules/@scope/x/node_modules/glob",
            "name": "glob",
            "path": "root/node_modules/@scope/x/node_modules/glob",
            "version": "4.0.5",
          },
        },
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "@scope/x",
            "spec": "1",
            "type": "prod",
          },
          EdgeIn {
            "from": "node_modules/@scope/x",
            "name": "@scope/x",
            "spec": "*",
            "type": "peer",
          },
          EdgeIn {
            "from": "node_modules/foo",
            "name": "@scope/x",
            "spec": "*",
            "type": "optional",
          },
        },
        "edgesOut": Map {
          "@scope/x" => EdgeOut {
            "name": "@scope/x",
            "spec": "*",
            "to": "node_modules/@scope/x",
            "type": "peer",
          },
          "@scope/y" => EdgeOut {
            "name": "@scope/y",
            "spec": "*",
            "to": "node_modules/@scope/y",
            "type": "optional",
          },
          "express" => EdgeOut {
            "error": "MISSING",
            "name": "express",
            "spec": "420.69.0-nice",
            "to": null,
            "type": "peer",
          },
          "glob" => EdgeOut {
            "name": "glob",
            "spec": "4",
            "to": "node_modules/@scope/x/node_modules/glob",
            "type": "prod",
          },
        },
        "location": "node_modules/@scope/x",
        "name": "@scope/x",
        "path": "root/node_modules/@scope/x",
        "version": "1.2.3",
      },
      "@scope/y" => ArboristNode {
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "@scope/y",
            "spec": ">0.99.0",
            "type": "peer",
          },
          EdgeIn {
            "from": "node_modules/@scope/x",
            "name": "@scope/y",
            "spec": "*",
            "type": "optional",
          },
        },
        "edgesOut": Map {
          "foo" => EdgeOut {
            "error": "INVALID",
            "name": "foo",
            "spec": "99.x",
            "to": "node_modules/foo",
            "type": "prod",
          },
        },
        "location": "node_modules/@scope/y",
        "name": "@scope/y",
        "path": "root/node_modules/@scope/y",
        "version": "1.2.3",
      },
      "foo" => ArboristNode {
        "children": Map {
          "express" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/foo",
                "name": "express",
                "spec": "npm:abbrev@*",
                "type": "prod",
              },
            },
            "location": "node_modules/foo/node_modules/express",
            "name": "express",
            "packageName": "abbrev",
            "path": "root/node_modules/foo/node_modules/express",
            "version": "1.1.1",
          },
        },
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "foo",
            "spec": "*",
            "type": "dev",
          },
          EdgeIn {
            "error": "INVALID",
            "from": "node_modules/@scope/y",
            "name": "foo",
            "spec": "99.x",
            "type": "prod",
          },
        },
        "edgesOut": Map {
          "@scope/x" => EdgeOut {
            "name": "@scope/x",
            "spec": "*",
            "to": "node_modules/@scope/x",
            "type": "optional",
          },
          "express" => EdgeOut {
            "name": "express",
            "spec": "npm:abbrev@*",
            "to": "node_modules/foo/node_modules/express",
            "type": "prod",
          },
        },
        "location": "node_modules/foo",
        "name": "foo",
        "path": "root/node_modules/foo",
        "version": "1.2.3",
      },
    },
    "edgesOut": Map {
      "@scope/x" => EdgeOut {
        "name": "@scope/x",
        "spec": "1",
        "to": "node_modules/@scope/x",
        "type": "prod",
      },
      "@scope/y" => EdgeOut {
        "name": "@scope/y",
        "spec": ">0.99.0",
        "to": "node_modules/@scope/y",
        "type": "peer",
      },
      "foo" => EdgeOut {
        "name": "foo",
        "spec": "*",
        "to": "node_modules/foo",
        "type": "dev",
      },
      "notinstalledhere" => EdgeOut {
        "name": "notinstalledhere",
        "spec": "*",
        "to": null,
        "type": "optional",
      },
    },
    "isProjectRoot": true,
    "location": "",
    "name": "root",
    "path": "root",
    "version": "1.2.3",
  },
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP links-all-over > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "link-deep" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "link-deep",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/link-deep",
      "name": "link-deep",
      "packageName": "deep",
      "path": "links-all-over/node_modules/link-deep",
      "realpath": "links-all-over/node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
      "resolved": "file:nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
      "target": ArboristNode {
        "children": Map {
          "deep-a" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
                "name": "deep-a",
                "spec": "*",
                "type": "prod",
              },
            },
            "location": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep/node_modules/deep-a",
            "name": "deep-a",
            "path": "links-all-over/node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep/node_modules/deep-a",
            "version": "1.2.3",
          },
        },
        "edgesIn": Set {
          EdgeIn {
            "from": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d",
            "name": "deep",
            "spec": "*",
            "type": "prod",
          },
        },
        "edgesOut": Map {
          "a" => EdgeOut {
            "name": "a",
            "spec": "*",
            "to": "node_modules/nest/node_modules/a",
            "type": "prod",
          },
          "deep-a" => EdgeOut {
            "name": "deep-a",
            "spec": "*",
            "to": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep/node_modules/deep-a",
            "type": "prod",
          },
        },
        "location": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
        "name": "deep",
        "path": "links-all-over/node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
        "version": "1.2.3",
      },
      "version": "1.2.3",
    },
    "link-link" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "link-link",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "real",
          "name": "link-link",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/link-link",
      "name": "link-link",
      "packageName": "deep",
      "path": "links-all-over/node_modules/link-link",
      "realpath": "links-all-over/node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
      "resolved": "file:nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
      "target": ArboristNode {
        "location": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
      },
      "version": "1.2.3",
    },
    "link-outside-nest" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "link-outside-nest",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/link-outside-nest",
      "name": "link-outside-nest",
      "packageName": "real",
      "path": "links-all-over/node_modules/link-outside-nest",
      "realpath": "links-all-over/real",
      "resolved": "file:../real",
      "target": ArboristNode {
        "location": "real",
      },
      "version": "1.2.3",
    },
    "nest" => ArboristNode {
      "children": Map {
        "a" => ArboristNode {
          "children": Map {
            "b" => ArboristNode {
              "children": Map {
                "c" => ArboristNode {
                  "children": Map {
                    "d" => ArboristNode {
                      "children": Map {
                        "deep" => ArboristNode {
                          "location": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
                        },
                      },
                      "edgesIn": Set {
                        EdgeIn {
                          "from": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c",
                          "name": "d",
                          "spec": "*",
                          "type": "prod",
                        },
                      },
                      "edgesOut": Map {
                        "deep" => EdgeOut {
                          "name": "deep",
                          "spec": "*",
                          "to": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
                          "type": "prod",
                        },
                      },
                      "location": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d",
                      "name": "d",
                      "path": "links-all-over/node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d",
                      "version": "1.2.3",
                    },
                  },
                  "edgesIn": Set {
                    EdgeIn {
                      "from": "node_modules/nest/node_modules/a/node_modules/b",
                      "name": "c",
                      "spec": "*",
                      "type": "prod",
                    },
                  },
                  "edgesOut": Map {
                    "d" => EdgeOut {
                      "name": "d",
                      "spec": "*",
                      "to": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d",
                      "type": "prod",
                    },
                  },
                  "location": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c",
                  "name": "c",
                  "path": "links-all-over/node_modules/nest/node_modules/a/node_modules/b/node_modules/c",
                  "version": "1.2.3",
                },
              },
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/nest/node_modules/a",
                  "name": "b",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "edgesOut": Map {
                "c" => EdgeOut {
                  "name": "c",
                  "spec": "*",
                  "to": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c",
                  "type": "prod",
                },
              },
              "location": "node_modules/nest/node_modules/a/node_modules/b",
              "name": "b",
              "path": "links-all-over/node_modules/nest/node_modules/a/node_modules/b",
              "version": "1.2.3",
            },
          },
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/nest",
              "name": "a",
              "spec": "*",
              "type": "prod",
            },
            EdgeIn {
              "from": "node_modules/nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep",
              "name": "a",
              "spec": "*",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "b" => EdgeOut {
              "name": "b",
              "spec": "*",
              "to": "node_modules/nest/node_modules/a/node_modules/b",
              "type": "prod",
            },
          },
          "location": "node_modules/nest/node_modules/a",
          "name": "a",
          "path": "links-all-over/node_modules/nest/node_modules/a",
          "version": "1.2.3",
        },
        "link-in-nest" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/nest",
              "name": "link-in-nest",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/nest/node_modules/link-in-nest",
          "name": "link-in-nest",
          "packageName": "real",
          "path": "links-all-over/node_modules/nest/node_modules/link-in-nest",
          "realpath": "links-all-over/real",
          "resolved": "file:../../../real",
          "target": ArboristNode {
            "location": "real",
          },
          "version": "1.2.3",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "nest",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "a" => EdgeOut {
          "name": "a",
          "spec": "*",
          "to": "node_modules/nest/node_modules/a",
          "type": "prod",
        },
        "link-in-nest" => EdgeOut {
          "name": "link-in-nest",
          "spec": "*",
          "to": "node_modules/nest/node_modules/link-in-nest",
          "type": "prod",
        },
      },
      "location": "node_modules/nest",
      "name": "nest",
      "path": "links-all-over/node_modules/nest",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "link-deep" => EdgeOut {
      "name": "link-deep",
      "spec": "*",
      "to": "node_modules/link-deep",
      "type": "prod",
    },
    "link-link" => EdgeOut {
      "name": "link-link",
      "spec": "*",
      "to": "node_modules/link-link",
      "type": "prod",
    },
    "link-outside-nest" => EdgeOut {
      "name": "link-outside-nest",
      "spec": "*",
      "to": "node_modules/link-outside-nest",
      "type": "prod",
    },
    "nest" => EdgeOut {
      "name": "nest",
      "spec": "*",
      "to": "node_modules/nest",
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "edgesOut": Map {
        "link-link" => EdgeOut {
          "name": "link-link",
          "spec": "*",
          "to": "node_modules/link-link",
          "type": "prod",
        },
      },
      "location": "real",
      "name": "real",
      "path": "links-all-over/real",
      "version": "1.2.3",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "links-all-over",
  "path": "links-all-over",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP load a global space > expect resolving Promise 1`] = `
ArboristNode {
  "children": Map {
    "rimraf" => ArboristNode {
      "children": Map {
        "balanced-match" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/brace-expansion",
              "name": "balanced-match",
              "spec": "^1.0.0",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/balanced-match",
          "name": "balanced-match",
          "path": "global-style/lib/node_modules/rimraf/node_modules/balanced-match",
          "version": "1.0.0",
        },
        "brace-expansion" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/minimatch",
              "name": "brace-expansion",
              "spec": "^1.1.7",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "balanced-match" => EdgeOut {
              "name": "balanced-match",
              "spec": "^1.0.0",
              "to": "node_modules/rimraf/node_modules/balanced-match",
              "type": "prod",
            },
            "concat-map" => EdgeOut {
              "name": "concat-map",
              "spec": "0.0.1",
              "to": "node_modules/rimraf/node_modules/concat-map",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/brace-expansion",
          "name": "brace-expansion",
          "path": "global-style/lib/node_modules/rimraf/node_modules/brace-expansion",
          "version": "1.1.11",
        },
        "concat-map" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/brace-expansion",
              "name": "concat-map",
              "spec": "0.0.1",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/concat-map",
          "name": "concat-map",
          "path": "global-style/lib/node_modules/rimraf/node_modules/concat-map",
          "version": "0.0.1",
        },
        "fs.realpath" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/glob",
              "name": "fs.realpath",
              "spec": "^1.0.0",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/fs.realpath",
          "name": "fs.realpath",
          "path": "global-style/lib/node_modules/rimraf/node_modules/fs.realpath",
          "version": "1.0.0",
        },
        "glob" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf",
              "name": "glob",
              "spec": "^7.1.3",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "fs.realpath" => EdgeOut {
              "name": "fs.realpath",
              "spec": "^1.0.0",
              "to": "node_modules/rimraf/node_modules/fs.realpath",
              "type": "prod",
            },
            "inflight" => EdgeOut {
              "name": "inflight",
              "spec": "^1.0.4",
              "to": "node_modules/rimraf/node_modules/inflight",
              "type": "prod",
            },
            "inherits" => EdgeOut {
              "name": "inherits",
              "spec": "2",
              "to": "node_modules/rimraf/node_modules/inherits",
              "type": "prod",
            },
            "minimatch" => EdgeOut {
              "name": "minimatch",
              "spec": "^3.0.4",
              "to": "node_modules/rimraf/node_modules/minimatch",
              "type": "prod",
            },
            "once" => EdgeOut {
              "name": "once",
              "spec": "^1.3.0",
              "to": "node_modules/rimraf/node_modules/once",
              "type": "prod",
            },
            "path-is-absolute" => EdgeOut {
              "name": "path-is-absolute",
              "spec": "^1.0.0",
              "to": "node_modules/rimraf/node_modules/path-is-absolute",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/glob",
          "name": "glob",
          "path": "global-style/lib/node_modules/rimraf/node_modules/glob",
          "version": "7.1.6",
        },
        "inflight" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/glob",
              "name": "inflight",
              "spec": "^1.0.4",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "once" => EdgeOut {
              "name": "once",
              "spec": "^1.3.0",
              "to": "node_modules/rimraf/node_modules/once",
              "type": "prod",
            },
            "wrappy" => EdgeOut {
              "name": "wrappy",
              "spec": "1",
              "to": "node_modules/rimraf/node_modules/wrappy",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/inflight",
          "name": "inflight",
          "path": "global-style/lib/node_modules/rimraf/node_modules/inflight",
          "version": "1.0.6",
        },
        "inherits" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/glob",
              "name": "inherits",
              "spec": "2",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/inherits",
          "name": "inherits",
          "path": "global-style/lib/node_modules/rimraf/node_modules/inherits",
          "version": "2.0.4",
        },
        "minimatch" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/glob",
              "name": "minimatch",
              "spec": "^3.0.4",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "brace-expansion" => EdgeOut {
              "name": "brace-expansion",
              "spec": "^1.1.7",
              "to": "node_modules/rimraf/node_modules/brace-expansion",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/minimatch",
          "name": "minimatch",
          "path": "global-style/lib/node_modules/rimraf/node_modules/minimatch",
          "version": "3.0.4",
        },
        "once" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/glob",
              "name": "once",
              "spec": "^1.3.0",
              "type": "prod",
            },
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/inflight",
              "name": "once",
              "spec": "^1.3.0",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "wrappy" => EdgeOut {
              "name": "wrappy",
              "spec": "1",
              "to": "node_modules/rimraf/node_modules/wrappy",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/once",
          "name": "once",
          "path": "global-style/lib/node_modules/rimraf/node_modules/once",
          "version": "1.4.0",
        },
        "path-is-absolute" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/glob",
              "name": "path-is-absolute",
              "spec": "^1.0.0",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/path-is-absolute",
          "name": "path-is-absolute",
          "path": "global-style/lib/node_modules/rimraf/node_modules/path-is-absolute",
          "version": "1.0.1",
        },
        "wrappy" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/inflight",
              "name": "wrappy",
              "spec": "1",
              "type": "prod",
            },
            EdgeIn {
              "from": "node_modules/rimraf/node_modules/once",
              "name": "wrappy",
              "spec": "1",
              "type": "prod",
            },
          },
          "location": "node_modules/rimraf/node_modules/wrappy",
          "name": "wrappy",
          "path": "global-style/lib/node_modules/rimraf/node_modules/wrappy",
          "version": "1.0.2",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "rimraf",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "^7.1.3",
          "to": "node_modules/rimraf/node_modules/glob",
          "type": "prod",
        },
      },
      "location": "node_modules/rimraf",
      "name": "rimraf",
      "path": "global-style/lib/node_modules/rimraf",
      "version": "3.0.2",
    },
    "which" => ArboristNode {
      "children": Map {
        "isexe" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/which",
              "name": "isexe",
              "spec": "^2.0.0",
              "type": "prod",
            },
          },
          "location": "node_modules/which/node_modules/isexe",
          "name": "isexe",
          "path": "global-style/lib/node_modules/which/node_modules/isexe",
          "version": "2.0.0",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "which",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "isexe" => EdgeOut {
          "name": "isexe",
          "spec": "^2.0.0",
          "to": "node_modules/which/node_modules/isexe",
          "type": "prod",
        },
      },
      "location": "node_modules/which",
      "name": "which",
      "path": "global-style/lib/node_modules/which",
      "version": "2.0.2",
    },
  },
  "edgesOut": Map {
    "rimraf" => EdgeOut {
      "name": "rimraf",
      "spec": "*",
      "to": "node_modules/rimraf",
      "type": "prod",
    },
    "which" => EdgeOut {
      "name": "which",
      "spec": "*",
      "to": "node_modules/which",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "lib",
  "path": "global-style/lib",
}
`

exports[`test/arborist/load-actual.js TAP load a global space symlink > expect resolving Promise 1`] = `
ArboristLink {
  "isProjectRoot": true,
  "location": "../lib-link",
  "name": "lib-link",
  "path": "global-style/lib-link",
  "realpath": "global-style/lib",
  "resolved": "file:lib",
  "target": ArboristNode {
    "children": Map {
      "rimraf" => ArboristNode {
        "children": Map {
          "balanced-match" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/brace-expansion",
                "name": "balanced-match",
                "spec": "^1.0.0",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/balanced-match",
            "name": "balanced-match",
            "path": "global-style/lib/node_modules/rimraf/node_modules/balanced-match",
            "version": "1.0.0",
          },
          "brace-expansion" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/minimatch",
                "name": "brace-expansion",
                "spec": "^1.1.7",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "balanced-match" => EdgeOut {
                "name": "balanced-match",
                "spec": "^1.0.0",
                "to": "node_modules/rimraf/node_modules/balanced-match",
                "type": "prod",
              },
              "concat-map" => EdgeOut {
                "name": "concat-map",
                "spec": "0.0.1",
                "to": "node_modules/rimraf/node_modules/concat-map",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/brace-expansion",
            "name": "brace-expansion",
            "path": "global-style/lib/node_modules/rimraf/node_modules/brace-expansion",
            "version": "1.1.11",
          },
          "concat-map" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/brace-expansion",
                "name": "concat-map",
                "spec": "0.0.1",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/concat-map",
            "name": "concat-map",
            "path": "global-style/lib/node_modules/rimraf/node_modules/concat-map",
            "version": "0.0.1",
          },
          "fs.realpath" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/glob",
                "name": "fs.realpath",
                "spec": "^1.0.0",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/fs.realpath",
            "name": "fs.realpath",
            "path": "global-style/lib/node_modules/rimraf/node_modules/fs.realpath",
            "version": "1.0.0",
          },
          "glob" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf",
                "name": "glob",
                "spec": "^7.1.3",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "fs.realpath" => EdgeOut {
                "name": "fs.realpath",
                "spec": "^1.0.0",
                "to": "node_modules/rimraf/node_modules/fs.realpath",
                "type": "prod",
              },
              "inflight" => EdgeOut {
                "name": "inflight",
                "spec": "^1.0.4",
                "to": "node_modules/rimraf/node_modules/inflight",
                "type": "prod",
              },
              "inherits" => EdgeOut {
                "name": "inherits",
                "spec": "2",
                "to": "node_modules/rimraf/node_modules/inherits",
                "type": "prod",
              },
              "minimatch" => EdgeOut {
                "name": "minimatch",
                "spec": "^3.0.4",
                "to": "node_modules/rimraf/node_modules/minimatch",
                "type": "prod",
              },
              "once" => EdgeOut {
                "name": "once",
                "spec": "^1.3.0",
                "to": "node_modules/rimraf/node_modules/once",
                "type": "prod",
              },
              "path-is-absolute" => EdgeOut {
                "name": "path-is-absolute",
                "spec": "^1.0.0",
                "to": "node_modules/rimraf/node_modules/path-is-absolute",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/glob",
            "name": "glob",
            "path": "global-style/lib/node_modules/rimraf/node_modules/glob",
            "version": "7.1.6",
          },
          "inflight" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/glob",
                "name": "inflight",
                "spec": "^1.0.4",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "once" => EdgeOut {
                "name": "once",
                "spec": "^1.3.0",
                "to": "node_modules/rimraf/node_modules/once",
                "type": "prod",
              },
              "wrappy" => EdgeOut {
                "name": "wrappy",
                "spec": "1",
                "to": "node_modules/rimraf/node_modules/wrappy",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/inflight",
            "name": "inflight",
            "path": "global-style/lib/node_modules/rimraf/node_modules/inflight",
            "version": "1.0.6",
          },
          "inherits" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/glob",
                "name": "inherits",
                "spec": "2",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/inherits",
            "name": "inherits",
            "path": "global-style/lib/node_modules/rimraf/node_modules/inherits",
            "version": "2.0.4",
          },
          "minimatch" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/glob",
                "name": "minimatch",
                "spec": "^3.0.4",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "brace-expansion" => EdgeOut {
                "name": "brace-expansion",
                "spec": "^1.1.7",
                "to": "node_modules/rimraf/node_modules/brace-expansion",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/minimatch",
            "name": "minimatch",
            "path": "global-style/lib/node_modules/rimraf/node_modules/minimatch",
            "version": "3.0.4",
          },
          "once" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/glob",
                "name": "once",
                "spec": "^1.3.0",
                "type": "prod",
              },
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/inflight",
                "name": "once",
                "spec": "^1.3.0",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "wrappy" => EdgeOut {
                "name": "wrappy",
                "spec": "1",
                "to": "node_modules/rimraf/node_modules/wrappy",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/once",
            "name": "once",
            "path": "global-style/lib/node_modules/rimraf/node_modules/once",
            "version": "1.4.0",
          },
          "path-is-absolute" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/glob",
                "name": "path-is-absolute",
                "spec": "^1.0.0",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/path-is-absolute",
            "name": "path-is-absolute",
            "path": "global-style/lib/node_modules/rimraf/node_modules/path-is-absolute",
            "version": "1.0.1",
          },
          "wrappy" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/inflight",
                "name": "wrappy",
                "spec": "1",
                "type": "prod",
              },
              EdgeIn {
                "from": "node_modules/rimraf/node_modules/once",
                "name": "wrappy",
                "spec": "1",
                "type": "prod",
              },
            },
            "location": "node_modules/rimraf/node_modules/wrappy",
            "name": "wrappy",
            "path": "global-style/lib/node_modules/rimraf/node_modules/wrappy",
            "version": "1.0.2",
          },
        },
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "rimraf",
            "spec": "*",
            "type": "prod",
          },
        },
        "edgesOut": Map {
          "glob" => EdgeOut {
            "name": "glob",
            "spec": "^7.1.3",
            "to": "node_modules/rimraf/node_modules/glob",
            "type": "prod",
          },
        },
        "location": "node_modules/rimraf",
        "name": "rimraf",
        "path": "global-style/lib/node_modules/rimraf",
        "version": "3.0.2",
      },
      "which" => ArboristNode {
        "children": Map {
          "isexe" => ArboristNode {
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/which",
                "name": "isexe",
                "spec": "^2.0.0",
                "type": "prod",
              },
            },
            "location": "node_modules/which/node_modules/isexe",
            "name": "isexe",
            "path": "global-style/lib/node_modules/which/node_modules/isexe",
            "version": "2.0.0",
          },
        },
        "edgesIn": Set {
          EdgeIn {
            "from": "",
            "name": "which",
            "spec": "*",
            "type": "prod",
          },
        },
        "edgesOut": Map {
          "isexe" => EdgeOut {
            "name": "isexe",
            "spec": "^2.0.0",
            "to": "node_modules/which/node_modules/isexe",
            "type": "prod",
          },
        },
        "location": "node_modules/which",
        "name": "which",
        "path": "global-style/lib/node_modules/which",
        "version": "2.0.2",
      },
    },
    "edgesOut": Map {
      "rimraf" => EdgeOut {
        "name": "rimraf",
        "spec": "*",
        "to": "node_modules/rimraf",
        "type": "prod",
      },
      "which" => EdgeOut {
        "name": "which",
        "spec": "*",
        "to": "node_modules/which",
        "type": "prod",
      },
    },
    "isProjectRoot": true,
    "location": "",
    "name": "lib",
    "path": "global-style/lib",
  },
}
`

exports[`test/arborist/load-actual.js TAP load a global space with a filter > expect resolving Promise 1`] = `
ArboristNode {
  "isProjectRoot": true,
  "location": "",
  "name": "lib",
  "path": "global-style/lib",
}
`

exports[`test/arborist/load-actual.js TAP load from a hidden lockfile > must match snapshot 1`] = `
ArboristNode {
  "children": Map {
    "abbrev" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "abbrev",
          "spec": "^1.1.1",
          "type": "prod",
        },
      },
      "location": "node_modules/abbrev",
      "name": "abbrev",
      "path": "hidden-lockfile/node_modules/abbrev",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
  },
  "edgesOut": Map {
    "abbrev" => EdgeOut {
      "name": "abbrev",
      "spec": "^1.1.1",
      "to": "node_modules/abbrev",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "hidden-lockfile",
  "path": "hidden-lockfile",
}
`

exports[`test/arborist/load-actual.js TAP load workspace targets, even if links not present > must match snapshot 1`] = `
ArboristNode {
  "edgesOut": Map {
    "a" => EdgeOut {
      "error": "MISSING",
      "name": "a",
      "spec": "file:{CWD}/test/arborist/tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present/packages/a",
      "to": null,
      "type": "workspace",
    },
    "b" => EdgeOut {
      "error": "MISSING",
      "name": "b",
      "spec": "file:{CWD}/test/arborist/tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present/packages/b",
      "to": null,
      "type": "workspace",
    },
    "c" => EdgeOut {
      "error": "MISSING",
      "name": "c",
      "spec": "file:{CWD}/test/arborist/tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present/packages/c",
      "to": null,
      "type": "workspace",
    },
    "wrappy" => EdgeOut {
      "error": "MISSING",
      "name": "wrappy",
      "spec": "1.0.0",
      "to": null,
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/a",
      "name": "a",
      "optional": true,
      "path": "tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present/packages/a",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/b",
      "name": "b",
      "optional": true,
      "path": "tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present/packages/b",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/c",
      "name": "c",
      "optional": true,
      "path": "tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present/packages/c",
      "peer": true,
      "version": "1.2.3",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present",
  "path": "tap-testdir-load-actual-load-workspace-targets-even-if-links-not-present",
  "workspaces": Map {
    "a" => "packages/a",
    "b" => "packages/b",
    "c" => "packages/c",
  },
}
`

exports[`test/arborist/load-actual.js TAP load workspaces when loading from hidding lockfile > actual tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "file:{CWD}/test/arborist/tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/a",
          "type": "workspace",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/a",
      "name": "a",
      "path": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/node_modules/a",
      "realpath": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/a",
      "resolved": "file:../packages/a",
      "target": ArboristNode {
        "location": "packages/a",
      },
      "version": "1.2.3",
    },
    "b" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "b",
          "spec": "file:{CWD}/test/arborist/tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/b",
          "type": "workspace",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/b",
      "name": "b",
      "path": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/node_modules/b",
      "realpath": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/b",
      "resolved": "file:../packages/b",
      "target": ArboristNode {
        "location": "packages/b",
      },
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "file:{CWD}/test/arborist/tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/a",
      "to": "node_modules/a",
      "type": "workspace",
    },
    "b" => EdgeOut {
      "name": "b",
      "spec": "file:{CWD}/test/arborist/tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/b",
      "to": "node_modules/b",
      "type": "workspace",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "isWorkspace": true,
      "location": "packages/a",
      "name": "a",
      "path": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/a",
      "version": "1.2.3",
    },
    ArboristNode {
      "isWorkspace": true,
      "location": "packages/b",
      "name": "b",
      "path": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile/packages/b",
      "version": "1.2.3",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile",
  "path": "tap-testdir-load-actual-load-workspaces-when-loading-from-hidding-lockfile",
  "workspaces": Map {
    "a" => "packages/a",
    "b" => "packages/b",
  },
}
`

exports[`test/arborist/load-actual.js TAP look for missing deps by default external-dep/root > "dep" should have missing deps, "link" should not 1`] = `
ArboristNode {
  "edgesOut": Map {
    "dep" => EdgeOut {
      "error": "MISSING",
      "name": "dep",
      "spec": "*",
      "to": null,
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "external-dep/root",
  "version": "1.0.0",
}
`

exports[`test/arborist/load-actual.js TAP look for missing deps by default external-link/root > "dep" should have missing deps, "link" should not 1`] = `
ArboristNode {
  "children": Map {
    "j" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "j",
          "spec": "file:../i/j",
          "type": "prod",
        },
      },
      "location": "node_modules/j",
      "name": "j",
      "path": "external-link/root/node_modules/j",
      "realpath": "external-link/i/j",
      "resolved": "file:../../i/j",
      "target": ArboristNode {
        "edgesOut": Map {
          "k" => EdgeOut {
            "name": "k",
            "spec": "*",
            "to": "../i/node_modules/k",
            "type": "prod",
          },
        },
        "location": "../i/j",
        "name": "j",
        "path": "external-link/i/j",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "o" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "o",
          "spec": "file:../m/node_modules/n/o",
          "type": "prod",
        },
      },
      "location": "node_modules/o",
      "name": "o",
      "path": "external-link/root/node_modules/o",
      "realpath": "external-link/m/node_modules/n/o",
      "resolved": "file:../../m/node_modules/n/o",
      "target": ArboristNode {
        "edgesOut": Map {
          "p" => EdgeOut {
            "name": "p",
            "spec": "*",
            "to": "../m/node_modules/p",
            "type": "prod",
          },
        },
        "location": "../m/node_modules/n/o",
        "name": "o",
        "path": "external-link/m/node_modules/n/o",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "o2" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "o2",
          "spec": "file:../m/node_modules/n/o2",
          "type": "prod",
        },
      },
      "location": "node_modules/o2",
      "name": "o2",
      "path": "external-link/root/node_modules/o2",
      "realpath": "external-link/m/node_modules/n/o2",
      "resolved": "file:../../m/node_modules/n/o2",
      "target": ArboristNode {
        "edgesOut": Map {
          "p" => EdgeOut {
            "name": "p",
            "spec": "*",
            "to": "../m/node_modules/p",
            "type": "prod",
          },
        },
        "location": "../m/node_modules/n/o2",
        "name": "o2",
        "path": "external-link/m/node_modules/n/o2",
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "x" => ArboristNode {
      "children": Map {
        "b" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/x",
              "name": "b",
              "spec": "file:../../../a/node_modules/b",
              "type": "prod",
            },
          },
          "location": "node_modules/x/node_modules/b",
          "name": "b",
          "path": "external-link/root/node_modules/x/node_modules/b",
          "realpath": "external-link/a/node_modules/b",
          "resolved": "file:../../../../a/node_modules/b",
          "target": ArboristNode {
            "edgesOut": Map {
              "c" => EdgeOut {
                "name": "c",
                "spec": "*",
                "to": "../a/node_modules/c",
                "type": "prod",
              },
            },
            "location": "../a/node_modules/b",
            "name": "b",
            "path": "external-link/a/node_modules/b",
            "version": "1.0.0",
          },
          "version": "1.0.0",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "x",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "file:../../../a/node_modules/b",
          "to": "node_modules/x/node_modules/b",
          "type": "prod",
        },
      },
      "location": "node_modules/x",
      "name": "x",
      "path": "external-link/root/node_modules/x",
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "j" => EdgeOut {
      "name": "j",
      "spec": "file:../i/j",
      "to": "node_modules/j",
      "type": "prod",
    },
    "o" => EdgeOut {
      "name": "o",
      "spec": "file:../m/node_modules/n/o",
      "to": "node_modules/o",
      "type": "prod",
    },
    "o2" => EdgeOut {
      "name": "o2",
      "spec": "file:../m/node_modules/n/o2",
      "to": "node_modules/o2",
      "type": "prod",
    },
    "x" => EdgeOut {
      "name": "x",
      "spec": "*",
      "to": "node_modules/x",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "external-link/root",
  "version": "1.0.0",
}
`

exports[`test/arborist/load-actual.js TAP looking outside of cwd > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "@scope/x" => ArboristNode {
      "children": Map {
        "glob" => ArboristNode {
          "children": Map {
            "graceful-fs" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "graceful-fs",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "name": "graceful-fs",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "version": "3.0.2",
            },
            "inherits" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "inherits",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "name": "inherits",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "version": "2.0.1",
            },
            "minimatch" => ArboristNode {
              "children": Map {
                "lru-cache" => ArboristNode {
                  "edgesIn": Set {
                    EdgeIn {
                      "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                      "name": "lru-cache",
                      "spec": "*",
                      "type": "prod",
                    },
                  },
                  "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "name": "lru-cache",
                  "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "version": "2.5.0",
                },
                "sigmund" => ArboristNode {
                  "edgesIn": Set {
                    EdgeIn {
                      "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                      "name": "sigmund",
                      "spec": "*",
                      "type": "prod",
                    },
                  },
                  "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "name": "sigmund",
                  "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "version": "1.0.0",
                },
              },
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "minimatch",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "edgesOut": Map {
                "lru-cache" => EdgeOut {
                  "name": "lru-cache",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "type": "prod",
                },
                "once" => EdgeOut {
                  "name": "once",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                  "type": "prod",
                },
                "sigmund" => EdgeOut {
                  "name": "sigmund",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "name": "minimatch",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "version": "1.0.0",
            },
            "once" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "once",
                  "spec": "*",
                  "type": "prod",
                },
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                  "name": "once",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/once",
              "name": "once",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/once",
              "version": "1.3.0",
            },
          },
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/@scope/x",
              "name": "glob",
              "spec": "4",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "graceful-fs" => EdgeOut {
              "name": "graceful-fs",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "type": "prod",
            },
            "inherits" => EdgeOut {
              "name": "inherits",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "type": "prod",
            },
            "minimatch" => EdgeOut {
              "name": "minimatch",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "type": "prod",
            },
            "once" => EdgeOut {
              "name": "once",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
              "type": "prod",
            },
          },
          "location": "node_modules/@scope/x/node_modules/glob",
          "name": "glob",
          "path": "root/node_modules/@scope/x/node_modules/glob",
          "version": "4.0.5",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/x",
          "spec": "1",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/@scope/x",
          "name": "@scope/x",
          "spec": "*",
          "type": "peer",
        },
        EdgeIn {
          "from": "node_modules/foo",
          "name": "@scope/x",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "@scope/x" => EdgeOut {
          "name": "@scope/x",
          "spec": "*",
          "to": "node_modules/@scope/x",
          "type": "peer",
        },
        "@scope/y" => EdgeOut {
          "name": "@scope/y",
          "spec": "*",
          "to": "node_modules/@scope/y",
          "type": "optional",
        },
        "express" => EdgeOut {
          "error": "MISSING",
          "name": "express",
          "spec": "420.69.0-nice",
          "to": null,
          "type": "peer",
        },
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "4",
          "to": "node_modules/@scope/x/node_modules/glob",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/x",
      "name": "@scope/x",
      "path": "root/node_modules/@scope/x",
      "version": "1.2.3",
    },
    "@scope/y" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/y",
          "spec": ">0.99.0",
          "type": "peer",
        },
        EdgeIn {
          "from": "node_modules/@scope/x",
          "name": "@scope/y",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "foo" => EdgeOut {
          "error": "INVALID",
          "name": "foo",
          "spec": "99.x",
          "to": "node_modules/foo",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/y",
      "name": "@scope/y",
      "path": "root/node_modules/@scope/y",
      "version": "1.2.3",
    },
    "foo" => ArboristNode {
      "children": Map {
        "express" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/foo",
              "name": "express",
              "spec": "npm:abbrev@*",
              "type": "prod",
            },
          },
          "location": "node_modules/foo/node_modules/express",
          "name": "express",
          "packageName": "abbrev",
          "path": "root/node_modules/foo/node_modules/express",
          "version": "1.1.1",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "foo",
          "spec": "*",
          "type": "dev",
        },
        EdgeIn {
          "error": "INVALID",
          "from": "node_modules/@scope/y",
          "name": "foo",
          "spec": "99.x",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@scope/x" => EdgeOut {
          "name": "@scope/x",
          "spec": "*",
          "to": "node_modules/@scope/x",
          "type": "optional",
        },
        "express" => EdgeOut {
          "name": "express",
          "spec": "npm:abbrev@*",
          "to": "node_modules/foo/node_modules/express",
          "type": "prod",
        },
      },
      "location": "node_modules/foo",
      "name": "foo",
      "path": "root/node_modules/foo",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "@scope/x" => EdgeOut {
      "name": "@scope/x",
      "spec": "1",
      "to": "node_modules/@scope/x",
      "type": "prod",
    },
    "@scope/y" => EdgeOut {
      "name": "@scope/y",
      "spec": ">0.99.0",
      "to": "node_modules/@scope/y",
      "type": "peer",
    },
    "foo" => EdgeOut {
      "name": "foo",
      "spec": "*",
      "to": "node_modules/foo",
      "type": "dev",
    },
    "notinstalledhere" => EdgeOut {
      "name": "notinstalledhere",
      "spec": "*",
      "to": null,
      "type": "optional",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "root",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP mixedloop > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "optional": true,
      "path": "mixedloop/node_modules/a",
      "version": "1.1.1",
    },
    "b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "optional": true,
      "path": "mixedloop/node_modules/b",
      "version": "1.2.3",
    },
    "c" => ArboristNode {
      "devOptional": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "c",
          "spec": "*",
          "type": "dev",
        },
        EdgeIn {
          "from": "node_modules/b",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "path": "mixedloop/node_modules/c",
      "version": "1.2.3",
    },
    "d" => ArboristNode {
      "devOptional": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/c",
          "name": "d",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "e" => EdgeOut {
          "name": "e",
          "spec": "*",
          "to": "node_modules/e",
          "type": "prod",
        },
      },
      "location": "node_modules/d",
      "name": "d",
      "path": "mixedloop/node_modules/d",
      "version": "1.2.3",
    },
    "e" => ArboristNode {
      "devOptional": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/d",
          "name": "e",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/e",
      "name": "e",
      "path": "mixedloop/node_modules/e",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "*",
      "to": "node_modules/a",
      "type": "optional",
    },
    "c" => EdgeOut {
      "name": "c",
      "spec": "*",
      "to": "node_modules/c",
      "type": "dev",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "mixedloop",
  "packageName": "root",
  "path": "mixedloop",
}
`

exports[`test/arborist/load-actual.js TAP mixedmidway > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "optional": true,
      "path": "mixedmidway/node_modules/a",
      "version": "1.2.3",
    },
    "b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "b",
          "spec": "*",
          "type": "optional",
        },
        EdgeIn {
          "from": "node_modules/a",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/n",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
        "j" => EdgeOut {
          "name": "j",
          "spec": "*",
          "to": "node_modules/j",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "optional": true,
      "path": "mixedmidway/node_modules/b",
      "version": "1.2.3",
    },
    "c" => ArboristNode {
      "devOptional": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "c",
          "spec": "*",
          "type": "optional",
        },
        EdgeIn {
          "from": "node_modules/b",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/k",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "path": "mixedmidway/node_modules/c",
      "version": "1.2.3",
    },
    "i" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "i",
          "spec": "*",
          "type": "dev",
        },
      },
      "edgesOut": Map {
        "j" => EdgeOut {
          "name": "j",
          "spec": "*",
          "to": "node_modules/j",
          "type": "prod",
        },
      },
      "location": "node_modules/i",
      "name": "i",
      "path": "mixedmidway/node_modules/i",
    },
    "j" => ArboristNode {
      "devOptional": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/b",
          "name": "j",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/i",
          "name": "j",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/n",
          "name": "j",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "k" => EdgeOut {
          "name": "k",
          "spec": "*",
          "to": "node_modules/k",
          "type": "prod",
        },
      },
      "location": "node_modules/j",
      "name": "j",
      "path": "mixedmidway/node_modules/j",
    },
    "k" => ArboristNode {
      "devOptional": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "k",
          "spec": "*",
          "type": "optional",
        },
        EdgeIn {
          "from": "node_modules/j",
          "name": "k",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
      },
      "location": "node_modules/k",
      "name": "k",
      "path": "mixedmidway/node_modules/k",
    },
    "l" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "l",
          "spec": "*",
          "type": "optional",
        },
        EdgeIn {
          "from": "node_modules/z",
          "name": "l",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "m" => EdgeOut {
          "name": "m",
          "spec": "*",
          "to": "node_modules/m",
          "type": "prod",
        },
      },
      "location": "node_modules/l",
      "name": "l",
      "path": "mixedmidway/node_modules/l",
    },
    "m" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "m",
          "spec": "*",
          "type": "optional",
        },
        EdgeIn {
          "from": "node_modules/l",
          "name": "m",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/m",
      "name": "m",
      "path": "mixedmidway/node_modules/m",
    },
    "n" => ArboristNode {
      "dev": true,
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
        "j" => EdgeOut {
          "name": "j",
          "spec": "*",
          "to": "node_modules/j",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/n",
      "name": "n",
      "optional": true,
      "path": "mixedmidway/node_modules/n",
      "peer": true,
    },
    "x" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "x",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "y" => EdgeOut {
          "name": "y",
          "spec": "*",
          "to": "node_modules/y",
          "type": "prod",
        },
      },
      "location": "node_modules/x",
      "name": "x",
      "path": "mixedmidway/node_modules/x",
    },
    "y" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "y",
          "spec": "*",
          "type": "optional",
        },
        EdgeIn {
          "from": "node_modules/x",
          "name": "y",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "z" => EdgeOut {
          "name": "z",
          "spec": "*",
          "to": "node_modules/z",
          "type": "prod",
        },
      },
      "location": "node_modules/y",
      "name": "y",
      "path": "mixedmidway/node_modules/y",
    },
    "z" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/y",
          "name": "z",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "l" => EdgeOut {
          "name": "l",
          "spec": "*",
          "to": "node_modules/l",
          "type": "prod",
        },
      },
      "location": "node_modules/z",
      "name": "z",
      "path": "mixedmidway/node_modules/z",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "*",
      "to": "node_modules/a",
      "type": "optional",
    },
    "b" => EdgeOut {
      "name": "b",
      "spec": "*",
      "to": "node_modules/b",
      "type": "optional",
    },
    "c" => EdgeOut {
      "name": "c",
      "spec": "*",
      "to": "node_modules/c",
      "type": "optional",
    },
    "i" => EdgeOut {
      "name": "i",
      "spec": "*",
      "to": "node_modules/i",
      "type": "dev",
    },
    "k" => EdgeOut {
      "name": "k",
      "spec": "*",
      "to": "node_modules/k",
      "type": "optional",
    },
    "l" => EdgeOut {
      "name": "l",
      "spec": "*",
      "to": "node_modules/l",
      "type": "optional",
    },
    "m" => EdgeOut {
      "name": "m",
      "spec": "*",
      "to": "node_modules/m",
      "type": "optional",
    },
    "x" => EdgeOut {
      "name": "x",
      "spec": "*",
      "to": "node_modules/x",
      "type": "prod",
    },
    "y" => EdgeOut {
      "name": "y",
      "spec": "*",
      "to": "node_modules/y",
      "type": "optional",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "mixedmidway",
  "packageName": "root",
  "path": "mixedmidway",
}
`

exports[`test/arborist/load-actual.js TAP noname > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "foo" => ArboristNode {
      "dev": true,
      "errors": Array [
        Object {
          "code": "ENOENT",
          "path": "noname/node_modules/foo/package.json",
        },
      ],
      "extraneous": true,
      "location": "node_modules/foo",
      "name": "foo",
      "optional": true,
      "path": "noname/node_modules/foo",
      "peer": true,
    },
  },
  "errors": Array [
    Object {
      "code": "ENOENT",
      "path": "noname/package.json",
    },
  ],
  "isProjectRoot": true,
  "location": "",
  "name": "noname",
  "path": "noname",
}
`

exports[`test/arborist/load-actual.js TAP optionalloop > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "optional": true,
      "path": "optionalloop/node_modules/a",
      "version": "1.2.3",
    },
    "b" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/d",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "path": "optionalloop/node_modules/b",
      "version": "1.2.3",
    },
    "c" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "path": "optionalloop/node_modules/c",
      "version": "1.2.3",
    },
    "d" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "d",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/c",
          "name": "d",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "location": "node_modules/d",
      "name": "d",
      "path": "optionalloop/node_modules/d",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "*",
      "to": "node_modules/a",
      "type": "optional",
    },
    "c" => EdgeOut {
      "name": "c",
      "spec": "*",
      "to": "node_modules/c",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "optionalloop",
  "path": "optionalloop",
}
`

exports[`test/arborist/load-actual.js TAP optofdev > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "*",
          "type": "dev",
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "optional",
        },
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "path": "optofdev/node_modules/a",
    },
    "b" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "b",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "optional": true,
      "path": "optofdev/node_modules/b",
    },
    "c" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/b",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "e" => EdgeOut {
          "name": "e",
          "spec": "*",
          "to": "node_modules/e",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "optional": true,
      "path": "optofdev/node_modules/c",
    },
    "d" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/a",
          "name": "d",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "e" => EdgeOut {
          "name": "e",
          "spec": "*",
          "to": "node_modules/e",
          "type": "prod",
        },
      },
      "location": "node_modules/d",
      "name": "d",
      "path": "optofdev/node_modules/d",
    },
    "e" => ArboristNode {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "node_modules/c",
          "name": "e",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/d",
          "name": "e",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/e",
      "name": "e",
      "path": "optofdev/node_modules/e",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "*",
      "to": "node_modules/a",
      "type": "dev",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "optofdev",
  "path": "optofdev",
}
`

exports[`test/arborist/load-actual.js TAP other > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "glob" => ArboristLink {
      "dev": true,
      "extraneous": true,
      "location": "node_modules/glob",
      "name": "glob",
      "optional": true,
      "path": "other/node_modules/glob",
      "peer": true,
      "realpath": "root/node_modules/@scope/x/node_modules/glob",
      "resolved": "file:../../root/node_modules/@scope/x/node_modules/glob",
      "target": ArboristNode {
        "children": Map {
          "graceful-fs" => ArboristNode {
            "dev": true,
            "edgesIn": Set {
              EdgeIn {
                "from": "../root/node_modules/@scope/x/node_modules/glob",
                "name": "graceful-fs",
                "spec": "*",
                "type": "prod",
              },
            },
            "extraneous": true,
            "location": "../root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
            "name": "graceful-fs",
            "optional": true,
            "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
            "peer": true,
            "version": "3.0.2",
          },
          "inherits" => ArboristNode {
            "dev": true,
            "edgesIn": Set {
              EdgeIn {
                "from": "../root/node_modules/@scope/x/node_modules/glob",
                "name": "inherits",
                "spec": "*",
                "type": "prod",
              },
            },
            "extraneous": true,
            "location": "../root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
            "name": "inherits",
            "optional": true,
            "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
            "peer": true,
            "version": "2.0.1",
          },
          "minimatch" => ArboristNode {
            "children": Map {
              "lru-cache" => ArboristNode {
                "dev": true,
                "edgesIn": Set {
                  EdgeIn {
                    "from": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                    "name": "lru-cache",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "extraneous": true,
                "location": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                "name": "lru-cache",
                "optional": true,
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                "peer": true,
                "version": "2.5.0",
              },
              "sigmund" => ArboristNode {
                "dev": true,
                "edgesIn": Set {
                  EdgeIn {
                    "from": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                    "name": "sigmund",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "extraneous": true,
                "location": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                "name": "sigmund",
                "optional": true,
                "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                "peer": true,
                "version": "1.0.0",
              },
            },
            "dev": true,
            "edgesIn": Set {
              EdgeIn {
                "from": "../root/node_modules/@scope/x/node_modules/glob",
                "name": "minimatch",
                "spec": "*",
                "type": "prod",
              },
            },
            "edgesOut": Map {
              "lru-cache" => EdgeOut {
                "name": "lru-cache",
                "spec": "*",
                "to": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                "type": "prod",
              },
              "once" => EdgeOut {
                "name": "once",
                "spec": "*",
                "to": "../root/node_modules/@scope/x/node_modules/glob/node_modules/once",
                "type": "prod",
              },
              "sigmund" => EdgeOut {
                "name": "sigmund",
                "spec": "*",
                "to": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                "type": "prod",
              },
            },
            "extraneous": true,
            "location": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
            "name": "minimatch",
            "optional": true,
            "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
            "peer": true,
            "version": "1.0.0",
          },
          "once" => ArboristNode {
            "dev": true,
            "edgesIn": Set {
              EdgeIn {
                "from": "../root/node_modules/@scope/x/node_modules/glob",
                "name": "once",
                "spec": "*",
                "type": "prod",
              },
              EdgeIn {
                "from": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                "name": "once",
                "spec": "*",
                "type": "prod",
              },
            },
            "extraneous": true,
            "location": "../root/node_modules/@scope/x/node_modules/glob/node_modules/once",
            "name": "once",
            "optional": true,
            "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/once",
            "peer": true,
            "version": "1.3.0",
          },
        },
        "dev": true,
        "edgesOut": Map {
          "graceful-fs" => EdgeOut {
            "name": "graceful-fs",
            "spec": "*",
            "to": "../root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
            "type": "prod",
          },
          "inherits" => EdgeOut {
            "name": "inherits",
            "spec": "*",
            "to": "../root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
            "type": "prod",
          },
          "minimatch" => EdgeOut {
            "name": "minimatch",
            "spec": "*",
            "to": "../root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
            "type": "prod",
          },
          "once" => EdgeOut {
            "name": "once",
            "spec": "*",
            "to": "../root/node_modules/@scope/x/node_modules/glob/node_modules/once",
            "type": "prod",
          },
        },
        "extraneous": true,
        "location": "../root/node_modules/@scope/x/node_modules/glob",
        "name": "glob",
        "optional": true,
        "path": "root/node_modules/@scope/x/node_modules/glob",
        "peer": true,
        "version": "4.0.5",
      },
      "version": "4.0.5",
    },
  },
  "errors": Array [
    Object {
      "code": "ENOENT",
      "path": "other/package.json",
    },
  ],
  "isProjectRoot": true,
  "location": "",
  "name": "other",
  "path": "other",
}
`

exports[`test/arborist/load-actual.js TAP pnpm > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "@scope/x" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/x",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/x",
      "name": "@scope/x",
      "path": "pnpm/node_modules/@scope/x",
      "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
      "resolved": "file:../.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
      "target": ArboristNode {
        "location": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
      },
      "version": "1.0.0",
    },
    "a" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "path": "pnpm/node_modules/a",
      "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
      "resolved": "file:.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
      "target": ArboristNode {
        "location": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
      },
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "@scope/x" => EdgeOut {
      "name": "@scope/x",
      "spec": "*",
      "to": "node_modules/@scope/x",
      "type": "prod",
    },
    "a" => EdgeOut {
      "name": "a",
      "spec": "*",
      "to": "node_modules/a",
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "children": Map {
        "@scope/x" => ArboristNode {
          "edgesOut": Map {
            "a" => EdgeOut {
              "name": "a",
              "spec": "*",
              "to": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/a",
              "type": "prod",
            },
            "b" => EdgeOut {
              "name": "b",
              "spec": "*",
              "to": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/b",
              "type": "prod",
            },
            "c" => EdgeOut {
              "name": "c",
              "spec": "*",
              "to": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/c",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
          "name": "@scope/x",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
          "version": "1.0.0",
        },
        "a" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
              "name": "a",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/a",
          "name": "a",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/a",
          "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
          "resolved": "file:../../../../a/1.0.0/node_modules/a",
          "target": ArboristNode {
            "edgesOut": Map {
              "b" => EdgeOut {
                "name": "b",
                "spec": "*",
                "to": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/b",
                "type": "prod",
              },
              "c" => EdgeOut {
                "name": "c",
                "spec": "*",
                "to": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/c",
                "type": "prod",
              },
            },
            "location": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
            "name": "a",
            "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
            "version": "1.0.0",
          },
          "version": "1.0.0",
        },
        "b" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
              "name": "b",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/b",
          "name": "b",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/b",
          "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/b",
          "resolved": "file:../../../../b/1.0.0/node_modules/b",
          "target": ArboristNode {
            "edgesOut": Map {
              "c" => EdgeOut {
                "name": "c",
                "spec": "*",
                "to": "node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/c",
                "type": "prod",
              },
            },
            "location": "node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/b",
            "name": "b",
            "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/b",
            "version": "1.0.0",
          },
          "version": "1.0.0",
        },
        "c" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
              "name": "c",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/c",
          "name": "c",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/c",
          "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
          "resolved": "file:../../../../c/1.0.0/node_modules/c",
          "target": ArboristNode {
            "edgesOut": Map {
              "@scope/x" => EdgeOut {
                "name": "@scope/x",
                "spec": "*",
                "to": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/@scope/x",
                "type": "prod",
              },
            },
            "location": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
            "name": "c",
            "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
            "version": "1.0.0",
          },
          "version": "1.0.0",
        },
      },
      "location": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0",
      "name": "1.0.0",
      "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0",
    },
    ArboristNode {
      "children": Map {
        "a" => ArboristNode {
          "location": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
        },
        "b" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
              "name": "b",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/b",
          "name": "b",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/b",
          "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/b",
          "resolved": "file:../../../b/1.0.0/node_modules/b",
          "target": ArboristNode {
            "location": "node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/b",
          },
          "version": "1.0.0",
        },
        "c" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a",
              "name": "c",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/c",
          "name": "c",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/c",
          "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
          "resolved": "file:../../../c/1.0.0/node_modules/c",
          "target": ArboristNode {
            "location": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
          },
          "version": "1.0.0",
        },
      },
      "location": "node_modules/.pnpm/registry.npmjs.org/a/1.0.0",
      "name": "1.0.0",
      "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0",
    },
    ArboristNode {
      "children": Map {
        "b" => ArboristNode {
          "location": "node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/b",
        },
        "c" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/b",
              "name": "c",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/c",
          "name": "c",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/c",
          "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
          "resolved": "file:../../../c/1.0.0/node_modules/c",
          "target": ArboristNode {
            "location": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
          },
          "version": "1.0.0",
        },
      },
      "location": "node_modules/.pnpm/registry.npmjs.org/b/1.0.0",
      "name": "1.0.0",
      "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/b/1.0.0",
    },
    ArboristNode {
      "children": Map {
        "@scope/x" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
              "name": "@scope/x",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/@scope/x",
          "name": "@scope/x",
          "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/@scope/x",
          "realpath": "pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
          "resolved": "file:../../../../@scope/x/1.0.0/node_modules/@scope/x",
          "target": ArboristNode {
            "location": "node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x",
          },
          "version": "1.0.0",
        },
        "c" => ArboristNode {
          "location": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/c",
        },
      },
      "location": "node_modules/.pnpm/registry.npmjs.org/c/1.0.0",
      "name": "1.0.0",
      "path": "pnpm/node_modules/.pnpm/registry.npmjs.org/c/1.0.0",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "pnpm",
  "packageName": "pnpm-root",
  "path": "pnpm",
  "version": "1.0.0",
}
`

exports[`test/arborist/load-actual.js TAP root > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "@scope/x" => ArboristNode {
      "children": Map {
        "glob" => ArboristNode {
          "children": Map {
            "graceful-fs" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "graceful-fs",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "name": "graceful-fs",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "version": "3.0.2",
            },
            "inherits" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "inherits",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "name": "inherits",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "version": "2.0.1",
            },
            "minimatch" => ArboristNode {
              "children": Map {
                "lru-cache" => ArboristNode {
                  "edgesIn": Set {
                    EdgeIn {
                      "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                      "name": "lru-cache",
                      "spec": "*",
                      "type": "prod",
                    },
                  },
                  "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "name": "lru-cache",
                  "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "version": "2.5.0",
                },
                "sigmund" => ArboristNode {
                  "edgesIn": Set {
                    EdgeIn {
                      "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                      "name": "sigmund",
                      "spec": "*",
                      "type": "prod",
                    },
                  },
                  "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "name": "sigmund",
                  "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "version": "1.0.0",
                },
              },
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "minimatch",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "edgesOut": Map {
                "lru-cache" => EdgeOut {
                  "name": "lru-cache",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                  "type": "prod",
                },
                "once" => EdgeOut {
                  "name": "once",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
                  "type": "prod",
                },
                "sigmund" => EdgeOut {
                  "name": "sigmund",
                  "spec": "*",
                  "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "name": "minimatch",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "version": "1.0.0",
            },
            "once" => ArboristNode {
              "edgesIn": Set {
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob",
                  "name": "once",
                  "spec": "*",
                  "type": "prod",
                },
                EdgeIn {
                  "from": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
                  "name": "once",
                  "spec": "*",
                  "type": "prod",
                },
              },
              "location": "node_modules/@scope/x/node_modules/glob/node_modules/once",
              "name": "once",
              "path": "root/node_modules/@scope/x/node_modules/glob/node_modules/once",
              "version": "1.3.0",
            },
          },
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/@scope/x",
              "name": "glob",
              "spec": "4",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "graceful-fs" => EdgeOut {
              "name": "graceful-fs",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/graceful-fs",
              "type": "prod",
            },
            "inherits" => EdgeOut {
              "name": "inherits",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/inherits",
              "type": "prod",
            },
            "minimatch" => EdgeOut {
              "name": "minimatch",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/minimatch",
              "type": "prod",
            },
            "once" => EdgeOut {
              "name": "once",
              "spec": "*",
              "to": "node_modules/@scope/x/node_modules/glob/node_modules/once",
              "type": "prod",
            },
          },
          "location": "node_modules/@scope/x/node_modules/glob",
          "name": "glob",
          "path": "root/node_modules/@scope/x/node_modules/glob",
          "version": "4.0.5",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/x",
          "spec": "1",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/@scope/x",
          "name": "@scope/x",
          "spec": "*",
          "type": "peer",
        },
        EdgeIn {
          "from": "node_modules/foo",
          "name": "@scope/x",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "@scope/x" => EdgeOut {
          "name": "@scope/x",
          "spec": "*",
          "to": "node_modules/@scope/x",
          "type": "peer",
        },
        "@scope/y" => EdgeOut {
          "name": "@scope/y",
          "spec": "*",
          "to": "node_modules/@scope/y",
          "type": "optional",
        },
        "express" => EdgeOut {
          "error": "MISSING",
          "name": "express",
          "spec": "420.69.0-nice",
          "to": null,
          "type": "peer",
        },
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "4",
          "to": "node_modules/@scope/x/node_modules/glob",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/x",
      "name": "@scope/x",
      "path": "root/node_modules/@scope/x",
      "version": "1.2.3",
    },
    "@scope/y" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/y",
          "spec": ">0.99.0",
          "type": "peer",
        },
        EdgeIn {
          "from": "node_modules/@scope/x",
          "name": "@scope/y",
          "spec": "*",
          "type": "optional",
        },
      },
      "edgesOut": Map {
        "foo" => EdgeOut {
          "error": "INVALID",
          "name": "foo",
          "spec": "99.x",
          "to": "node_modules/foo",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/y",
      "name": "@scope/y",
      "path": "root/node_modules/@scope/y",
      "version": "1.2.3",
    },
    "foo" => ArboristNode {
      "children": Map {
        "express" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/foo",
              "name": "express",
              "spec": "npm:abbrev@*",
              "type": "prod",
            },
          },
          "location": "node_modules/foo/node_modules/express",
          "name": "express",
          "packageName": "abbrev",
          "path": "root/node_modules/foo/node_modules/express",
          "version": "1.1.1",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "foo",
          "spec": "*",
          "type": "dev",
        },
        EdgeIn {
          "error": "INVALID",
          "from": "node_modules/@scope/y",
          "name": "foo",
          "spec": "99.x",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "@scope/x" => EdgeOut {
          "name": "@scope/x",
          "spec": "*",
          "to": "node_modules/@scope/x",
          "type": "optional",
        },
        "express" => EdgeOut {
          "name": "express",
          "spec": "npm:abbrev@*",
          "to": "node_modules/foo/node_modules/express",
          "type": "prod",
        },
      },
      "location": "node_modules/foo",
      "name": "foo",
      "path": "root/node_modules/foo",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "@scope/x" => EdgeOut {
      "name": "@scope/x",
      "spec": "1",
      "to": "node_modules/@scope/x",
      "type": "prod",
    },
    "@scope/y" => EdgeOut {
      "name": "@scope/y",
      "spec": ">0.99.0",
      "to": "node_modules/@scope/y",
      "type": "peer",
    },
    "foo" => EdgeOut {
      "name": "foo",
      "spec": "*",
      "to": "node_modules/foo",
      "type": "dev",
    },
    "notinstalledhere" => EdgeOut {
      "name": "notinstalledhere",
      "spec": "*",
      "to": null,
      "type": "optional",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "root",
  "path": "root",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP selflink > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "@scope/y" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/y",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "foo" => EdgeOut {
          "name": "foo",
          "spec": "*",
          "to": "node_modules/foo",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/y",
      "name": "@scope/y",
      "path": "selflink/node_modules/@scope/y",
      "version": "1.2.3",
    },
    "@scope/z" => ArboristNode {
      "children": Map {
        "glob" => ArboristLink {
          "dev": true,
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/@scope/z",
              "name": "glob",
              "spec": "4",
              "type": "prod",
            },
          },
          "extraneous": true,
          "location": "node_modules/@scope/z/node_modules/glob",
          "name": "glob",
          "optional": true,
          "path": "selflink/node_modules/@scope/z/node_modules/glob",
          "peer": true,
          "realpath": "selflink/node_modules/foo/node_modules/glob",
          "resolved": "file:../../../foo/node_modules/glob",
          "target": ArboristNode {
            "children": Map {
              "graceful-fs" => ArboristNode {
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/graceful-fs",
                "name": "graceful-fs",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/graceful-fs",
                "peer": true,
                "version": "3.0.2",
              },
              "inherits" => ArboristNode {
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/inherits",
                "name": "inherits",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/inherits",
                "peer": true,
                "version": "2.0.1",
              },
              "minimatch" => ArboristNode {
                "children": Map {
                  "lru-cache" => ArboristNode {
                    "dev": true,
                    "extraneous": true,
                    "location": "node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "name": "lru-cache",
                    "optional": true,
                    "path": "selflink/node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "peer": true,
                    "version": "2.5.0",
                  },
                  "sigmund" => ArboristNode {
                    "dev": true,
                    "extraneous": true,
                    "location": "node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "name": "sigmund",
                    "optional": true,
                    "path": "selflink/node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "peer": true,
                    "version": "1.0.0",
                  },
                },
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/minimatch",
                "name": "minimatch",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/minimatch",
                "peer": true,
                "version": "1.0.0",
              },
              "once" => ArboristNode {
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/once",
                "name": "once",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/once",
                "peer": true,
                "version": "1.3.0",
              },
            },
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/foo",
                "name": "glob",
                "spec": "4",
                "type": "prod",
              },
            },
            "location": "node_modules/foo/node_modules/glob",
            "name": "glob",
            "path": "selflink/node_modules/foo/node_modules/glob",
            "version": "4.0.5",
          },
          "version": "4.0.5",
        },
      },
      "dev": true,
      "edgesOut": Map {
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "4",
          "to": "node_modules/@scope/z/node_modules/glob",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/@scope/z",
      "name": "@scope/z",
      "optional": true,
      "path": "selflink/node_modules/@scope/z",
      "peer": true,
      "version": "1.2.3",
    },
    "foo" => ArboristNode {
      "children": Map {
        "glob" => ArboristNode {
          "location": "node_modules/foo/node_modules/glob",
        },
        "selflink" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/foo",
              "name": "selflink",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/foo/node_modules/selflink",
          "name": "selflink",
          "path": "selflink/node_modules/foo/node_modules/selflink",
          "realpath": "selflink",
          "resolved": "file:../../..",
          "target": ArboristNode {
            "location": "",
          },
          "version": "1.2.3",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "foo",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/@scope/y",
          "name": "foo",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "4",
          "to": "node_modules/foo/node_modules/glob",
          "type": "prod",
        },
        "selflink" => EdgeOut {
          "name": "selflink",
          "spec": "*",
          "to": "node_modules/foo/node_modules/selflink",
          "type": "prod",
        },
      },
      "location": "node_modules/foo",
      "name": "foo",
      "path": "selflink/node_modules/foo",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "@scope/x" => EdgeOut {
      "error": "MISSING",
      "name": "@scope/x",
      "spec": "*",
      "to": null,
      "type": "prod",
    },
    "@scope/y" => EdgeOut {
      "name": "@scope/y",
      "spec": "*",
      "to": "node_modules/@scope/y",
      "type": "prod",
    },
    "foo" => EdgeOut {
      "name": "foo",
      "spec": "*",
      "to": "node_modules/foo",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "selflink",
  "path": "selflink",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP shake out Link target timing issue > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "@scope/y" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "@scope/y",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "foo" => EdgeOut {
          "name": "foo",
          "spec": "*",
          "to": "node_modules/foo",
          "type": "prod",
        },
      },
      "location": "node_modules/@scope/y",
      "name": "@scope/y",
      "path": "selflink/node_modules/@scope/y",
      "version": "1.2.3",
    },
    "@scope/z" => ArboristNode {
      "children": Map {
        "glob" => ArboristLink {
          "dev": true,
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/@scope/z",
              "name": "glob",
              "spec": "4",
              "type": "prod",
            },
          },
          "extraneous": true,
          "location": "node_modules/@scope/z/node_modules/glob",
          "name": "glob",
          "optional": true,
          "path": "selflink/node_modules/@scope/z/node_modules/glob",
          "peer": true,
          "realpath": "selflink/node_modules/foo/node_modules/glob",
          "resolved": "file:../../../foo/node_modules/glob",
          "target": ArboristNode {
            "children": Map {
              "graceful-fs" => ArboristNode {
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/graceful-fs",
                "name": "graceful-fs",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/graceful-fs",
                "peer": true,
                "version": "3.0.2",
              },
              "inherits" => ArboristNode {
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/inherits",
                "name": "inherits",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/inherits",
                "peer": true,
                "version": "2.0.1",
              },
              "minimatch" => ArboristNode {
                "children": Map {
                  "lru-cache" => ArboristNode {
                    "dev": true,
                    "extraneous": true,
                    "location": "node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "name": "lru-cache",
                    "optional": true,
                    "path": "selflink/node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/lru-cache",
                    "peer": true,
                    "version": "2.5.0",
                  },
                  "sigmund" => ArboristNode {
                    "dev": true,
                    "extraneous": true,
                    "location": "node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "name": "sigmund",
                    "optional": true,
                    "path": "selflink/node_modules/foo/node_modules/glob/node_modules/minimatch/node_modules/sigmund",
                    "peer": true,
                    "version": "1.0.0",
                  },
                },
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/minimatch",
                "name": "minimatch",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/minimatch",
                "peer": true,
                "version": "1.0.0",
              },
              "once" => ArboristNode {
                "dev": true,
                "extraneous": true,
                "location": "node_modules/foo/node_modules/glob/node_modules/once",
                "name": "once",
                "optional": true,
                "path": "selflink/node_modules/foo/node_modules/glob/node_modules/once",
                "peer": true,
                "version": "1.3.0",
              },
            },
            "edgesIn": Set {
              EdgeIn {
                "from": "node_modules/foo",
                "name": "glob",
                "spec": "4",
                "type": "prod",
              },
            },
            "location": "node_modules/foo/node_modules/glob",
            "name": "glob",
            "path": "selflink/node_modules/foo/node_modules/glob",
            "version": "4.0.5",
          },
          "version": "4.0.5",
        },
      },
      "dev": true,
      "edgesOut": Map {
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "4",
          "to": "node_modules/@scope/z/node_modules/glob",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/@scope/z",
      "name": "@scope/z",
      "optional": true,
      "path": "selflink/node_modules/@scope/z",
      "peer": true,
      "version": "1.2.3",
    },
    "foo" => ArboristNode {
      "children": Map {
        "glob" => ArboristNode {
          "location": "node_modules/foo/node_modules/glob",
        },
        "selflink" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/foo",
              "name": "selflink",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/foo/node_modules/selflink",
          "name": "selflink",
          "path": "selflink/node_modules/foo/node_modules/selflink",
          "realpath": "selflink",
          "resolved": "file:../../..",
          "target": ArboristNode {
            "location": "",
          },
          "version": "1.2.3",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "foo",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/@scope/y",
          "name": "foo",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "glob" => EdgeOut {
          "name": "glob",
          "spec": "4",
          "to": "node_modules/foo/node_modules/glob",
          "type": "prod",
        },
        "selflink" => EdgeOut {
          "name": "selflink",
          "spec": "*",
          "to": "node_modules/foo/node_modules/selflink",
          "type": "prod",
        },
      },
      "location": "node_modules/foo",
      "name": "foo",
      "path": "selflink/node_modules/foo",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "@scope/x" => EdgeOut {
      "error": "MISSING",
      "name": "@scope/x",
      "spec": "*",
      "to": null,
      "type": "prod",
    },
    "@scope/y" => EdgeOut {
      "name": "@scope/y",
      "spec": "*",
      "to": "node_modules/@scope/y",
      "type": "prod",
    },
    "foo" => EdgeOut {
      "name": "foo",
      "spec": "*",
      "to": "node_modules/foo",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "selflink",
  "path": "selflink",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP symlinked-node-modules/example > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "bar" => ArboristLink {
      "dev": true,
      "extraneous": true,
      "location": "node_modules/bar",
      "name": "bar",
      "optional": true,
      "path": "symlinked-node-modules/example/node_modules/bar",
      "peer": true,
      "realpath": "symlinked-node-modules/bar",
      "resolved": "file:../../bar",
      "target": ArboristNode {
        "dev": true,
        "extraneous": true,
        "location": "../bar",
        "name": "bar",
        "optional": true,
        "path": "symlinked-node-modules/bar",
        "peer": true,
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
    "foo" => ArboristLink {
      "dev": true,
      "extraneous": true,
      "location": "node_modules/foo",
      "name": "foo",
      "optional": true,
      "path": "symlinked-node-modules/example/node_modules/foo",
      "peer": true,
      "realpath": "symlinked-node-modules/linked-node-modules/foo",
      "resolved": "file:../../linked-node-modules/foo",
      "target": ArboristNode {
        "dev": true,
        "extraneous": true,
        "location": "../linked-node-modules/foo",
        "name": "foo",
        "optional": true,
        "path": "symlinked-node-modules/linked-node-modules/foo",
        "peer": true,
        "version": "1.0.0",
      },
      "version": "1.0.0",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "example",
  "path": "symlinked-node-modules/example",
  "version": "1.0.0",
}
`

exports[`test/arborist/load-actual.js TAP transplant workspace targets, even if links not present > do not transplant node named "a" 1`] = `
ArboristNode {
  "dev": true,
  "edgesOut": Map {
    "wrappy" => EdgeOut {
      "error": "MISSING",
      "name": "wrappy",
      "spec": "1.0.0",
      "to": null,
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/a",
      "name": "a",
      "optional": true,
      "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present/packages/a",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/b",
      "name": "b",
      "optional": true,
      "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present/packages/b",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/c",
      "name": "c",
      "optional": true,
      "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present/packages/c",
      "peer": true,
      "version": "1.2.3",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present",
  "optional": true,
  "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present",
  "peer": true,
}
`

exports[`test/arborist/load-actual.js TAP transplant workspace targets, even if links not present > transplant everything 1`] = `
ArboristNode {
  "dev": true,
  "edgesOut": Map {
    "wrappy" => EdgeOut {
      "error": "MISSING",
      "name": "wrappy",
      "spec": "1.0.0",
      "to": null,
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/a",
      "name": "a",
      "optional": true,
      "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present/packages/a",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/b",
      "name": "b",
      "optional": true,
      "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present/packages/b",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "dev": true,
      "extraneous": true,
      "location": "packages/c",
      "name": "c",
      "optional": true,
      "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present/packages/c",
      "peer": true,
      "version": "1.2.3",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present",
  "optional": true,
  "path": "tap-testdir-load-actual-transplant-workspace-targets-even-if-links-not-present",
  "peer": true,
}
`

exports[`test/arborist/load-actual.js TAP workspace > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/a",
      "name": "a",
      "path": "workspace/node_modules/a",
      "realpath": "workspace/packages/a",
      "resolved": "file:../packages/a",
      "target": ArboristNode {
        "location": "packages/a",
      },
    },
    "b" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "path": "workspace/node_modules/b",
      "realpath": "workspace/packages/b",
      "resolved": "file:../packages/b",
      "target": ArboristNode {
        "location": "packages/b",
      },
    },
    "c" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "path": "workspace/node_modules/c",
      "realpath": "workspace/packages/c",
      "resolved": "file:../packages/c",
      "target": ArboristNode {
        "location": "packages/c",
      },
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "*",
      "to": "node_modules/a",
      "type": "prod",
    },
    "b" => EdgeOut {
      "name": "b",
      "spec": "*",
      "to": "node_modules/b",
      "type": "prod",
    },
    "c" => EdgeOut {
      "name": "c",
      "spec": "*",
      "to": "node_modules/c",
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "children": Map {
        "b" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "packages/a",
              "name": "b",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "packages/a/node_modules/b",
          "name": "b",
          "path": "workspace/packages/a/node_modules/b",
          "realpath": "workspace/packages/b",
          "resolved": "file:../../b",
          "target": ArboristNode {
            "children": Map {
              "a" => ArboristLink {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "packages/b",
                    "name": "a",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "packages/b/node_modules/a",
                "name": "a",
                "path": "workspace/packages/b/node_modules/a",
                "realpath": "workspace/packages/a",
                "resolved": "file:../../a",
                "target": ArboristNode {
                  "location": "packages/a",
                },
              },
              "c" => ArboristLink {
                "edgesIn": Set {
                  EdgeIn {
                    "from": "packages/b",
                    "name": "c",
                    "spec": "*",
                    "type": "prod",
                  },
                },
                "location": "packages/b/node_modules/c",
                "name": "c",
                "path": "workspace/packages/b/node_modules/c",
                "realpath": "workspace/packages/c",
                "resolved": "file:../../c",
                "target": ArboristNode {
                  "children": Map {
                    "a" => ArboristLink {
                      "edgesIn": Set {
                        EdgeIn {
                          "from": "packages/c",
                          "name": "a",
                          "spec": "*",
                          "type": "prod",
                        },
                      },
                      "location": "packages/c/node_modules/a",
                      "name": "a",
                      "path": "workspace/packages/c/node_modules/a",
                      "realpath": "workspace/packages/a",
                      "resolved": "file:../../a",
                      "target": ArboristNode {
                        "location": "packages/a",
                      },
                    },
                    "b" => ArboristLink {
                      "edgesIn": Set {
                        EdgeIn {
                          "from": "packages/c",
                          "name": "b",
                          "spec": "*",
                          "type": "prod",
                        },
                      },
                      "location": "packages/c/node_modules/b",
                      "name": "b",
                      "path": "workspace/packages/c/node_modules/b",
                      "realpath": "workspace/packages/b",
                      "resolved": "file:../../b",
                      "target": ArboristNode {
                        "location": "packages/b",
                      },
                    },
                  },
                  "edgesOut": Map {
                    "a" => EdgeOut {
                      "name": "a",
                      "spec": "*",
                      "to": "packages/c/node_modules/a",
                      "type": "prod",
                    },
                    "b" => EdgeOut {
                      "name": "b",
                      "spec": "*",
                      "to": "packages/c/node_modules/b",
                      "type": "prod",
                    },
                  },
                  "location": "packages/c",
                  "name": "c",
                  "path": "workspace/packages/c",
                },
              },
            },
            "edgesOut": Map {
              "a" => EdgeOut {
                "name": "a",
                "spec": "*",
                "to": "packages/b/node_modules/a",
                "type": "prod",
              },
              "c" => EdgeOut {
                "name": "c",
                "spec": "*",
                "to": "packages/b/node_modules/c",
                "type": "prod",
              },
            },
            "location": "packages/b",
            "name": "b",
            "path": "workspace/packages/b",
          },
        },
        "c" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "packages/a",
              "name": "c",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "packages/a/node_modules/c",
          "name": "c",
          "path": "workspace/packages/a/node_modules/c",
          "realpath": "workspace/packages/c",
          "resolved": "file:../../c",
          "target": ArboristNode {
            "location": "packages/c",
          },
        },
      },
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "packages/a/node_modules/b",
          "type": "prod",
        },
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "packages/a/node_modules/c",
          "type": "prod",
        },
      },
      "location": "packages/a",
      "name": "a",
      "path": "workspace/packages/a",
    },
    ArboristNode {
      "location": "packages/b",
    },
    ArboristNode {
      "location": "packages/c",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "workspace",
  "path": "workspace",
}
`

exports[`test/arborist/load-actual.js TAP workspace2 > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "b" => ArboristNode {
      "children": Map {
        "d" => ArboristNode {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/b",
              "name": "d",
              "spec": "*",
              "type": "prod",
            },
          },
          "edgesOut": Map {
            "b" => EdgeOut {
              "name": "b",
              "spec": "*",
              "to": "node_modules/b",
              "type": "prod",
            },
          },
          "location": "node_modules/b/node_modules/d",
          "name": "d",
          "path": "workspace2/node_modules/b/node_modules/d",
          "version": "1.2.3",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "node_modules/b/node_modules/d",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "x",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/b/node_modules/d",
          "type": "prod",
        },
      },
      "location": "node_modules/b",
      "name": "b",
      "path": "workspace2/node_modules/b",
      "version": "1.2.3",
    },
    "c" => ArboristNode {
      "children": Map {
        "d" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/c",
              "name": "d",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/c/node_modules/d",
          "name": "d",
          "path": "workspace2/node_modules/c/node_modules/d",
          "realpath": "workspace2/node_modules/b/node_modules/d",
          "resolved": "file:../../b/node_modules/d",
          "target": ArboristNode {
            "location": "node_modules/b/node_modules/d",
          },
          "version": "1.2.3",
        },
        "x" => ArboristLink {
          "edgesIn": Set {
            EdgeIn {
              "from": "node_modules/c",
              "name": "x",
              "spec": "*",
              "type": "prod",
            },
          },
          "location": "node_modules/c/node_modules/x",
          "name": "x",
          "path": "workspace2/node_modules/c/node_modules/x",
          "realpath": "workspace2/x",
          "resolved": "file:../../../x",
          "target": ArboristNode {
            "location": "x",
          },
          "version": "1.2.3",
        },
      },
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "edgesOut": Map {
        "d" => EdgeOut {
          "name": "d",
          "spec": "*",
          "to": "node_modules/c/node_modules/d",
          "type": "prod",
        },
        "x" => EdgeOut {
          "name": "x",
          "spec": "*",
          "to": "node_modules/c/node_modules/x",
          "type": "prod",
        },
      },
      "location": "node_modules/c",
      "name": "c",
      "path": "workspace2/node_modules/c",
      "version": "1.2.3",
    },
  },
  "edgesOut": Map {
    "b" => EdgeOut {
      "name": "b",
      "spec": "*",
      "to": "node_modules/b",
      "type": "prod",
    },
    "c" => EdgeOut {
      "name": "c",
      "spec": "*",
      "to": "node_modules/c",
      "type": "prod",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "location": "x",
      "name": "x",
      "path": "workspace2/x",
      "version": "1.2.3",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "workspace2",
  "packageName": "a",
  "path": "workspace2",
  "version": "1.2.3",
}
`

exports[`test/arborist/load-actual.js TAP workspace3 > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristLink {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "app",
          "name": "a",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "packages/b",
          "name": "a",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "packages/c",
          "name": "a",
          "spec": "*",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/a",
      "name": "a",
      "optional": true,
      "path": "workspace3/node_modules/a",
      "peer": true,
      "realpath": "workspace3/packages/a",
      "resolved": "file:../packages/a",
      "target": ArboristNode {
        "location": "packages/a",
      },
      "version": "1.2.3",
    },
    "app" => ArboristLink {
      "dev": true,
      "extraneous": true,
      "location": "node_modules/app",
      "name": "app",
      "optional": true,
      "path": "workspace3/node_modules/app",
      "peer": true,
      "realpath": "workspace3/app",
      "resolved": "file:../app",
      "target": ArboristNode {
        "location": "app",
      },
      "version": "1.2.3",
    },
    "b" => ArboristLink {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "app",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "packages/a",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "packages/c",
          "name": "b",
          "spec": "*",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/b",
      "name": "b",
      "optional": true,
      "path": "workspace3/node_modules/b",
      "peer": true,
      "realpath": "workspace3/packages/b",
      "resolved": "file:../packages/b",
      "target": ArboristNode {
        "location": "packages/b",
      },
      "version": "1.2.3",
    },
    "c" => ArboristLink {
      "dev": true,
      "edgesIn": Set {
        EdgeIn {
          "from": "app",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "packages/a",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
        EdgeIn {
          "from": "packages/b",
          "name": "c",
          "spec": "*",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "node_modules/c",
      "name": "c",
      "optional": true,
      "path": "workspace3/node_modules/c",
      "peer": true,
      "realpath": "workspace3/packages/c",
      "resolved": "file:../packages/c",
      "target": ArboristNode {
        "location": "packages/c",
      },
      "version": "1.2.3",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "children": Map {
        "i" => ArboristNode {
          "dev": true,
          "edgesIn": Set {
            EdgeIn {
              "from": "app",
              "name": "i",
              "spec": "*",
              "type": "prod",
            },
          },
          "extraneous": true,
          "location": "app/node_modules/i",
          "name": "i",
          "optional": true,
          "path": "workspace3/app/node_modules/i",
          "peer": true,
          "version": "1.2.3",
        },
      },
      "dev": true,
      "edgesOut": Map {
        "a" => EdgeOut {
          "name": "a",
          "spec": "*",
          "to": "node_modules/a",
          "type": "prod",
        },
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
        "i" => EdgeOut {
          "name": "i",
          "spec": "*",
          "to": "app/node_modules/i",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "app",
      "name": "app",
      "optional": true,
      "path": "workspace3/app",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "children": Map {
        "x" => ArboristNode {
          "dev": true,
          "edgesIn": Set {
            EdgeIn {
              "from": "packages/a",
              "name": "x",
              "spec": "*",
              "type": "prod",
            },
          },
          "extraneous": true,
          "location": "packages/a/node_modules/x",
          "name": "x",
          "optional": true,
          "path": "workspace3/packages/a/node_modules/x",
          "peer": true,
          "version": "1.2.3",
        },
      },
      "dev": true,
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
        "x" => EdgeOut {
          "name": "x",
          "spec": "*",
          "to": "packages/a/node_modules/x",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "packages/a",
      "name": "a",
      "optional": true,
      "path": "workspace3/packages/a",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "children": Map {
        "y" => ArboristNode {
          "dev": true,
          "edgesIn": Set {
            EdgeIn {
              "from": "packages/b",
              "name": "y",
              "spec": "*",
              "type": "prod",
            },
          },
          "extraneous": true,
          "location": "packages/b/node_modules/y",
          "name": "y",
          "optional": true,
          "path": "workspace3/packages/b/node_modules/y",
          "peer": true,
          "version": "1.2.3",
        },
      },
      "dev": true,
      "edgesOut": Map {
        "a" => EdgeOut {
          "name": "a",
          "spec": "*",
          "to": "node_modules/a",
          "type": "prod",
        },
        "c" => EdgeOut {
          "name": "c",
          "spec": "*",
          "to": "node_modules/c",
          "type": "prod",
        },
        "y" => EdgeOut {
          "name": "y",
          "spec": "*",
          "to": "packages/b/node_modules/y",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "packages/b",
      "name": "b",
      "optional": true,
      "path": "workspace3/packages/b",
      "peer": true,
      "version": "1.2.3",
    },
    ArboristNode {
      "children": Map {
        "z" => ArboristNode {
          "dev": true,
          "edgesIn": Set {
            EdgeIn {
              "from": "packages/c",
              "name": "z",
              "spec": "*",
              "type": "prod",
            },
          },
          "extraneous": true,
          "location": "packages/c/node_modules/z",
          "name": "z",
          "optional": true,
          "path": "workspace3/packages/c/node_modules/z",
          "peer": true,
          "version": "1.2.3",
        },
      },
      "dev": true,
      "edgesOut": Map {
        "a" => EdgeOut {
          "name": "a",
          "spec": "*",
          "to": "node_modules/a",
          "type": "prod",
        },
        "b" => EdgeOut {
          "name": "b",
          "spec": "*",
          "to": "node_modules/b",
          "type": "prod",
        },
        "z" => EdgeOut {
          "name": "z",
          "spec": "*",
          "to": "packages/c/node_modules/z",
          "type": "prod",
        },
      },
      "extraneous": true,
      "location": "packages/c",
      "name": "c",
      "optional": true,
      "path": "workspace3/packages/c",
      "peer": true,
      "version": "1.2.3",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "workspace3",
  "path": "workspace3",
}
`

exports[`test/arborist/load-actual.js TAP workspaces load a simple install tree containing workspaces > expect resolving Promise 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "file:{CWD}/test/fixtures/workspaces-simple/a",
          "type": "workspace",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/a",
      "name": "a",
      "path": "workspaces-simple/node_modules/a",
      "realpath": "workspaces-simple/a",
      "resolved": "file:../a",
      "target": ArboristNode {
        "location": "a",
      },
      "version": "1.0.0",
    },
    "b" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "b",
          "spec": "file:{CWD}/test/fixtures/workspaces-simple/b",
          "type": "workspace",
        },
        EdgeIn {
          "from": "a",
          "name": "b",
          "spec": "^1.0.0",
          "type": "prod",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/b",
      "name": "b",
      "path": "workspaces-simple/node_modules/b",
      "realpath": "workspaces-simple/b",
      "resolved": "file:../b",
      "target": ArboristNode {
        "location": "b",
      },
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "file:{CWD}/test/fixtures/workspaces-simple/a",
      "to": "node_modules/a",
      "type": "workspace",
    },
    "b" => EdgeOut {
      "name": "b",
      "spec": "file:{CWD}/test/fixtures/workspaces-simple/b",
      "to": "node_modules/b",
      "type": "workspace",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "^1.0.0",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "isWorkspace": true,
      "location": "a",
      "name": "a",
      "path": "workspaces-simple/a",
      "version": "1.0.0",
    },
    ArboristNode {
      "isWorkspace": true,
      "location": "b",
      "name": "b",
      "path": "workspaces-simple/b",
      "version": "1.0.0",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "workspaces-simple",
  "packageName": "workspace-simple",
  "path": "workspaces-simple",
  "workspaces": Map {
    "a" => "a",
    "b" => "b",
  },
}
`

exports[`test/arborist/load-actual.js TAP workspaces-simple > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "a" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "a",
          "spec": "file:{CWD}/test/fixtures/workspaces-simple/a",
          "type": "workspace",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/a",
      "name": "a",
      "path": "workspaces-simple/node_modules/a",
      "realpath": "workspaces-simple/a",
      "resolved": "file:../a",
      "target": ArboristNode {
        "location": "a",
      },
      "version": "1.0.0",
    },
    "b" => ArboristLink {
      "edgesIn": Set {
        EdgeIn {
          "from": "",
          "name": "b",
          "spec": "file:{CWD}/test/fixtures/workspaces-simple/b",
          "type": "workspace",
        },
        EdgeIn {
          "from": "a",
          "name": "b",
          "spec": "^1.0.0",
          "type": "prod",
        },
      },
      "isWorkspace": true,
      "location": "node_modules/b",
      "name": "b",
      "path": "workspaces-simple/node_modules/b",
      "realpath": "workspaces-simple/b",
      "resolved": "file:../b",
      "target": ArboristNode {
        "location": "b",
      },
      "version": "1.0.0",
    },
  },
  "edgesOut": Map {
    "a" => EdgeOut {
      "name": "a",
      "spec": "file:{CWD}/test/fixtures/workspaces-simple/a",
      "to": "node_modules/a",
      "type": "workspace",
    },
    "b" => EdgeOut {
      "name": "b",
      "spec": "file:{CWD}/test/fixtures/workspaces-simple/b",
      "to": "node_modules/b",
      "type": "workspace",
    },
  },
  "fsChildren": Set {
    ArboristNode {
      "edgesOut": Map {
        "b" => EdgeOut {
          "name": "b",
          "spec": "^1.0.0",
          "to": "node_modules/b",
          "type": "prod",
        },
      },
      "isWorkspace": true,
      "location": "a",
      "name": "a",
      "path": "workspaces-simple/a",
      "version": "1.0.0",
    },
    ArboristNode {
      "isWorkspace": true,
      "location": "b",
      "name": "b",
      "path": "workspaces-simple/b",
      "version": "1.0.0",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "workspaces-simple",
  "packageName": "workspace-simple",
  "path": "workspaces-simple",
  "workspaces": Map {
    "a" => "a",
    "b" => "b",
  },
}
`

exports[`test/arborist/load-actual.js TAP yarn-lock-mkdirp-file-dep > loaded tree 1`] = `
ArboristNode {
  "children": Map {
    "mkdirp" => ArboristNode {
      "edgesIn": Set {
        EdgeIn {
          "error": "INVALID",
          "from": "",
          "name": "mkdirp",
          "spec": "file:mkdirp",
          "type": "prod",
        },
      },
      "location": "node_modules/mkdirp",
      "name": "mkdirp",
      "path": "yarn-lock-mkdirp-file-dep/node_modules/mkdirp",
      "version": "1.0.2",
    },
  },
  "edgesOut": Map {
    "mkdirp" => EdgeOut {
      "error": "INVALID",
      "name": "mkdirp",
      "spec": "file:mkdirp",
      "to": "node_modules/mkdirp",
      "type": "prod",
    },
  },
  "isProjectRoot": true,
  "location": "",
  "name": "yarn-lock-mkdirp-file-dep",
  "path": "yarn-lock-mkdirp-file-dep",
}
`
