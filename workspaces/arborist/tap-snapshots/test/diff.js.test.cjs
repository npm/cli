/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/diff.js TAP > diff two trees 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "a",
    "path": "/path/to/root",
    "integrity": "sha512-aaa",
  },
  "ideal": Node {
    "name": "a",
    "path": "/path/to/root",
    "integrity": "sha512-aaa",
  },
  "leaves": Array [
    "/path/to/root/node_modules/b/node_modules/c",
    "/path/to/root/node_modules/b/node_modules/d/node_modules/e",
    "/path/to/root/node_modules/x/node_modules/y",
    "/path/to/root/node_modules/p/node_modules/q",
    "/path/to/root/node_modules/bundler/node_modules/not-bundled",
    "/path/to/root/node_modules/should-have-bins",
    "/path/to/root/foo/node_modules/baz",
    "/path/to/root/node_modules/i/node_modules/j",
    "/path/to/root/foo/node_modules/boo",
  ],
  "unchanged": Array [
    "/path/to/root/node_modules/x",
    "/path/to/root/node_modules/bundler",
    "/path/to/root/node_modules/bundler/node_modules/bundled-a",
    "/path/to/root/node_modules/bundler/node_modules/metabundled",
    "/path/to/root/foo/node_modules/bar",
    "/path/to/root/node_modules/b/node_modules/d",
    "/path/to/root/node_modules/b/node_modules/f",
    "/path/to/root/node_modules/x/node_modules/y/node_modules/z",
  ],
  "removed": Array [
    "/path/to/root/node_modules/p",
    "/path/to/root/node_modules/p/node_modules/q",
  ],
  "children": Array [
    Diff {
      "action": "CHANGE",
      "actual": Node {
        "name": "baz",
        "path": "/path/to/root/foo/node_modules/baz",
        "integrity": "sha512-baz",
      },
      "ideal": Node {
        "name": "baz",
        "path": "/path/to/root/foo/node_modules/baz",
        "integrity": "sha512-BAZ",
      },
      "leaves": Array [
        "/path/to/root/foo/node_modules/baz",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
    Diff {
      "action": "ADD",
      "actual": undefined,
      "ideal": Node {
        "name": "boo",
        "path": "/path/to/root/foo/node_modules/boo",
        "integrity": "sha512-BOO",
      },
      "leaves": Array [
        "/path/to/root/foo/node_modules/boo",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
    Diff {
      "action": "CHANGE",
      "actual": Node {
        "name": "b",
        "path": "/path/to/root/node_modules/b",
        "integrity": "sha512-bbb",
      },
      "ideal": Node {
        "name": "b",
        "path": "/path/to/root/node_modules/b",
        "integrity": "sha512-BBB",
      },
      "leaves": Array [
        "/path/to/root/node_modules/b/node_modules/c",
        "/path/to/root/node_modules/b/node_modules/d/node_modules/e",
      ],
      "unchanged": Array [
        "/path/to/root/node_modules/b/node_modules/d",
        "/path/to/root/node_modules/b/node_modules/f",
      ],
      "removed": Array [],
      "children": Array [
        Diff {
          "action": "CHANGE",
          "actual": Node {
            "name": "c",
            "path": "/path/to/root/node_modules/b/node_modules/c",
            "integrity": "sha512-ccc",
          },
          "ideal": Node {
            "name": "c",
            "path": "/path/to/root/node_modules/b/node_modules/c",
            "integrity": "sha512-CCC",
          },
          "leaves": Array [
            "/path/to/root/node_modules/b/node_modules/c",
          ],
          "unchanged": Array [],
          "removed": Array [],
          "children": Array [],
        },
        Diff {
          "action": "CHANGE",
          "actual": Node {
            "name": "e",
            "path": "/path/to/root/node_modules/b/node_modules/d/node_modules/e",
            "integrity": "sha512-eee",
          },
          "ideal": Node {
            "name": "e",
            "path": "/path/to/root/node_modules/b/node_modules/d/node_modules/e",
            "integrity": "sha512-EEE",
          },
          "leaves": Array [
            "/path/to/root/node_modules/b/node_modules/d/node_modules/e",
          ],
          "unchanged": Array [],
          "removed": Array [],
          "children": Array [],
        },
      ],
    },
    Diff {
      "action": "CHANGE",
      "actual": Node {
        "name": "not-bundled",
        "path": "/path/to/root/node_modules/bundler/node_modules/not-bundled",
        "integrity": "sha512-not-bundled",
      },
      "ideal": Node {
        "name": "not-bundled",
        "path": "/path/to/root/node_modules/bundler/node_modules/not-bundled",
        "integrity": "sha512-NOT-BUNDLED",
      },
      "leaves": Array [
        "/path/to/root/node_modules/bundler/node_modules/not-bundled",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
    Diff {
      "action": "ADD",
      "actual": undefined,
      "ideal": Node {
        "name": "i",
        "path": "/path/to/root/node_modules/i",
        "integrity": "sha512-III",
      },
      "leaves": Array [
        "/path/to/root/node_modules/i/node_modules/j",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [
        Diff {
          "action": "ADD",
          "actual": undefined,
          "ideal": Node {
            "name": "j",
            "path": "/path/to/root/node_modules/i/node_modules/j",
            "integrity": "sha512-JJJ",
          },
          "leaves": Array [
            "/path/to/root/node_modules/i/node_modules/j",
          ],
          "unchanged": Array [],
          "removed": Array [],
          "children": Array [],
        },
      ],
    },
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "p",
        "path": "/path/to/root/node_modules/p",
        "integrity": "sha512-ppp",
      },
      "ideal": undefined,
      "leaves": Array [
        "/path/to/root/node_modules/p/node_modules/q",
      ],
      "unchanged": Array [],
      "removed": Array [
        "/path/to/root/node_modules/p/node_modules/q",
      ],
      "children": Array [
        Diff {
          "action": "REMOVE",
          "actual": Node {
            "name": "q",
            "path": "/path/to/root/node_modules/p/node_modules/q",
            "integrity": "sha512-qqq",
          },
          "ideal": undefined,
          "leaves": Array [
            "/path/to/root/node_modules/p/node_modules/q",
          ],
          "unchanged": Array [],
          "removed": Array [],
          "children": Array [],
        },
      ],
    },
    Diff {
      "action": "CHANGE",
      "actual": Node {
        "name": "should-have-bins",
        "path": "/path/to/root/node_modules/should-have-bins",
        "integrity": "sha512-should-have-bins",
      },
      "ideal": Node {
        "name": "should-have-bins",
        "path": "/path/to/root/node_modules/should-have-bins",
        "integrity": "sha512-should-have-bins",
      },
      "leaves": Array [
        "/path/to/root/node_modules/should-have-bins",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
    Diff {
      "action": "CHANGE",
      "actual": Node {
        "name": "y",
        "path": "/path/to/root/node_modules/x/node_modules/y",
        "integrity": "sha512-yyy",
      },
      "ideal": Node {
        "name": "y",
        "path": "/path/to/root/node_modules/x/node_modules/y",
        "integrity": "sha512-YYY",
      },
      "leaves": Array [
        "/path/to/root/node_modules/x/node_modules/y",
      ],
      "unchanged": Array [
        "/path/to/root/node_modules/x/node_modules/y/node_modules/z",
      ],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP diff doesnt break unchanged shrinkwrapped deps > made no changes 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "a",
    "path": "/path/to/actual",
    "integrity": null,
  },
  "ideal": Node {
    "name": "a",
    "path": "/path/to/actual",
    "integrity": null,
  },
  "leaves": Array [
    "/path/to/actual/node_modules/shrinkwrapped-dep",
  ],
  "unchanged": Array [
    "/path/to/actual/node_modules/regular-dep",
    "/path/to/actual/node_modules/regular-dep/node_modules/shrinkwrapped-inner",
    "/path/to/actual/node_modules/regular-dep/node_modules/shrinkwrapped-inner/node_modules/shrinkwrap-inner-c",
  ],
  "removed": Array [],
  "children": Array [
    Diff {
      "action": null,
      "actual": Node {
        "name": "shrinkwrapped-dep",
        "path": "/path/to/actual/node_modules/shrinkwrapped-dep",
        "integrity": "sha512-ddd",
      },
      "ideal": Node {
        "name": "shrinkwrapped-dep",
        "path": "/path/to/actual/node_modules/shrinkwrapped-dep",
        "integrity": "sha512-ddd",
      },
      "leaves": Array [
        "/path/to/actual/node_modules/shrinkwrapped-dep",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP extraneous pruning in workspaces > prune in workspace A 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "tap-testdir-diff-extraneous-pruning-in-workspaces",
    "path": "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces",
    "integrity": null,
  },
  "ideal": Node {
    "name": "tap-testdir-diff-extraneous-pruning-in-workspaces",
    "path": "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces",
    "integrity": null,
  },
  "leaves": Array [
    "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/a/node_modules/once",
  ],
  "unchanged": Array [],
  "removed": Array [
    "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/a/node_modules/once",
  ],
  "children": Array [
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "once",
        "path": "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/a/node_modules/once",
        "integrity": null,
      },
      "ideal": undefined,
      "leaves": Array [
        "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/a/node_modules/once",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP extraneous pruning in workspaces > prune in workspace B 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "tap-testdir-diff-extraneous-pruning-in-workspaces",
    "path": "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces",
    "integrity": null,
  },
  "ideal": Node {
    "name": "tap-testdir-diff-extraneous-pruning-in-workspaces",
    "path": "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces",
    "integrity": null,
  },
  "leaves": Array [
    "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/b/node_modules/abbrev",
  ],
  "unchanged": Array [
    "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/b/node_modules/once",
    "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/b/node_modules/wrappy",
  ],
  "removed": Array [
    "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/b/node_modules/abbrev",
  ],
  "children": Array [
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "abbrev",
        "path": "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/b/node_modules/abbrev",
        "integrity": null,
      },
      "ideal": undefined,
      "leaves": Array [
        "{CWD}/test/tap-testdir-diff-extraneous-pruning-in-workspaces/packages/b/node_modules/abbrev",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP filtered diff > c excluded, a and b present 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "ideal": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "leaves": Array [
    "/project/path/node_modules/a",
    "/project/path/node_modules/b",
  ],
  "unchanged": Array [],
  "removed": Array [],
  "children": Array [
    Diff {
      "action": "ADD",
      "actual": undefined,
      "ideal": Link {
        "name": "a",
        "path": "/project/path/node_modules/a",
        "integrity": null,
      },
      "leaves": Array [
        "/project/path/node_modules/a",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
    Diff {
      "action": "ADD",
      "actual": undefined,
      "ideal": Node {
        "name": "b",
        "path": "/project/path/node_modules/b",
        "integrity": null,
      },
      "leaves": Array [
        "/project/path/node_modules/b",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP filtered diff > d is removed 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "ideal": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "leaves": Array [
    "/project/path/node_modules/d",
  ],
  "unchanged": Array [
    "/project/path/node_modules/a",
    "/project/path/node_modules/b",
  ],
  "removed": Array [
    "/project/path/node_modules/d",
  ],
  "children": Array [
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "d",
        "path": "/project/path/node_modules/d",
        "integrity": null,
      },
      "ideal": undefined,
      "leaves": Array [
        "/project/path/node_modules/d",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP filtered diff > e is removed (extraneous) 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "ideal": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "leaves": Array [
    "/project/path/node_modules/e",
  ],
  "unchanged": Array [],
  "removed": Array [
    "/project/path/node_modules/e",
  ],
  "children": Array [
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "e",
        "path": "/project/path/node_modules/e",
        "integrity": null,
      },
      "ideal": undefined,
      "leaves": Array [
        "/project/path/node_modules/e",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP filtered diff > e is removed 1`] = `
Diff {
  "action": null,
  "actual": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "ideal": Node {
    "name": "path",
    "path": "/project/path",
    "integrity": null,
  },
  "leaves": Array [
    "/project/path/node_modules/e",
  ],
  "unchanged": Array [],
  "removed": Array [
    "/project/path/node_modules/e",
  ],
  "children": Array [
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "e",
        "path": "/project/path/node_modules/e",
        "integrity": null,
      },
      "ideal": undefined,
      "leaves": Array [
        "/project/path/node_modules/e",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP when a root is a link, traverse the target children global=false > correctly removes the child node 1`] = `
Diff {
  "action": null,
  "actual": Link {
    "name": "path",
    "path": "/some/linked/path",
    "integrity": null,
  },
  "ideal": Node {
    "name": "path",
    "path": "/some/real/path",
    "integrity": null,
  },
  "leaves": Array [
    "/some/real/path/node_modules/child",
  ],
  "unchanged": Array [],
  "removed": Array [
    "/some/real/path/node_modules/child",
  ],
  "children": Array [
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "child",
        "path": "/some/real/path/node_modules/child",
        "integrity": null,
      },
      "ideal": undefined,
      "leaves": Array [
        "/some/real/path/node_modules/child",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`

exports[`test/diff.js TAP when a root is a link, traverse the target children global=true > correctly removes the child node 1`] = `
Diff {
  "action": null,
  "actual": Link {
    "name": "path",
    "path": "/some/linked/path",
    "integrity": null,
  },
  "ideal": Node {
    "name": "path",
    "path": "/some/real/path",
    "integrity": null,
  },
  "leaves": Array [
    "/some/real/path/node_modules/child",
  ],
  "unchanged": Array [],
  "removed": Array [
    "/some/real/path/node_modules/child",
  ],
  "children": Array [
    Diff {
      "action": "REMOVE",
      "actual": Node {
        "name": "child",
        "path": "/some/real/path/node_modules/child",
        "integrity": null,
      },
      "ideal": undefined,
      "leaves": Array [
        "/some/real/path/node_modules/child",
      ],
      "unchanged": Array [],
      "removed": Array [],
      "children": Array [],
    },
  ],
}
`
