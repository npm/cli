/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/place-dep.js TAP placement tests accept an older transitive dependency > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP placement tests accept an older transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {},
    "dep": "bar@1.0.1",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests accept an older transitive dependency > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests basic placement of a production dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,8 +12,27 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "foo" => ArboristNode {
+      "name": "foo",
+      "version": "1.0.0",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests basic placement of a production dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@1.0.0",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
]
`

exports[`test/place-dep.js TAP placement tests basic placement of a production dep > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests basic placement of a production dep with peer deps > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,8 +12,79 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "bar" => ArboristNode {
+      "name": "bar",
+      "version": "1.0.0",
+      "location": "node_modules/bar",
+      "path": "/some/path/node_modules/bar",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "baz" => EdgeOut {
+          "type": "peer",
+          "name": "baz",
+          "spec": "*",
+          "to": "node_modules/baz",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "bar",
+          "spec": "*",
+          "from": "node_modules/foo",
+        },
+      },
+    },
+    "baz" => ArboristNode {
+      "name": "baz",
+      "version": "1.0.0",
+      "location": "node_modules/baz",
+      "path": "/some/path/node_modules/baz",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "baz",
+          "spec": "*",
+          "from": "node_modules/bar",
+        },
+      },
+    },
+    "foo" => ArboristNode {
+      "name": "foo",
+      "version": "1.0.0",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "bar" => EdgeOut {
+          "type": "peer",
+          "name": "bar",
+          "spec": "*",
+          "to": "node_modules/bar",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests basic placement of a production dep with peer deps > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@1.0.0",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/foo peer bar@ }",
    "parent": "foo",
    "placed": "node_modules/bar",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "baz@1.0.0",
    "edge": "{ node_modules/bar peer baz@ }",
    "parent": "bar",
    "placed": "node_modules/baz",
  },
]
`

exports[`test/place-dep.js TAP placement tests basic placement of a production dep with peer deps > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests bounce off an existing dep that is newer, preferDedupe > changes to tree 1`] = `
--- expected
+++ actual
@@ -66,13 +66,6 @@
           "spec": "2",
           "from": "node_modules/a",
         },
-        EdgeIn {
-          "type": "prod",
-          "name": "b",
-          "spec": "2.0.0",
-          "error": "INVALID",
-          "from": "node_modules/c",
-        },
       },
     },
     "c" => ArboristNode {
@@ -89,8 +82,7 @@
           "type": "prod",
           "name": "b",
           "spec": "2.0.0",
-          "to": "node_modules/b",
-          "error": "INVALID",
+          "to": "node_modules/c/node_modules/b",
         },
       },
       "edgesIn": Set {
@@ -101,6 +93,52 @@
           "from": "",
         },
       },
+      "children": Map {
+        "a" => ArboristNode {
+          "name": "a",
+          "version": "3.0.0",
+          "location": "node_modules/c/node_modules/a",
+          "path": "/some/path/node_modules/c/node_modules/a",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "peer",
+              "name": "a",
+              "spec": "3",
+              "from": "node_modules/c/node_modules/b",
+            },
+          },
+        },
+        "b" => ArboristNode {
+          "name": "b",
+          "version": "2.0.0",
+          "location": "node_modules/c/node_modules/b",
+          "path": "/some/path/node_modules/c/node_modules/b",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesOut": Map {
+            "a" => EdgeOut {
+              "type": "peer",
+              "name": "a",
+              "spec": "3",
+              "to": "node_modules/c/node_modules/a",
+            },
+          },
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "b",
+              "spec": "2.0.0",
+              "from": "node_modules/c",
+            },
+          },
+        },
+      },
     },
   },
 }

`

exports[`test/place-dep.js TAP placement tests bounce off an existing dep that is newer, preferDedupe > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "node_modules/c" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@2.0.0",
    "edge": "{ node_modules/c prod b@2.0.0 }",
    "placed": "node_modules/c/node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/c" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(REPLACE),
      ],
    },
    "dep": "a@3.0.0",
    "edge": "{ node_modules/c/node_modules/b peer a@3 }",
    "parent": "b",
    "placed": "node_modules/c/node_modules/a",
  },
]
`

exports[`test/place-dep.js TAP placement tests bounce off an existing dep that is newer, preferDedupe > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests clobber and nest a non-peer dep in favor of a root dep peer > changes to tree 1`] = `
--- expected
+++ actual
@@ -18,8 +18,7 @@
       "type": "prod",
       "name": "x",
       "spec": "2",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/x",
     },
   },
   "children": Map {
@@ -63,6 +62,7 @@
           "type": "prod",
           "name": "y",
           "spec": "1",
+          "error": "INVALID",
           "to": "node_modules/y",
         },
       },
@@ -75,9 +75,35 @@
         },
       },
     },
+    "x" => ArboristNode {
+      "name": "x",
+      "version": "2.0.0",
+      "location": "node_modules/x",
+      "path": "/some/path/node_modules/x",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "y" => EdgeOut {
+          "type": "peer",
+          "name": "y",
+          "spec": "2",
+          "to": "node_modules/y",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "x",
+          "spec": "2",
+          "from": "",
+        },
+      },
+    },
     "y" => ArboristNode {
       "name": "y",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/y",
       "path": "/some/path/node_modules/y",
       "extraneous": true,
@@ -89,8 +115,15 @@
           "type": "prod",
           "name": "y",
           "spec": "1",
+          "error": "INVALID",
           "from": "node_modules/b",
         },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "2",
+          "from": "node_modules/x",
+        },
       },
     },
   },

`

exports[`test/place-dep.js TAP placement tests clobber and nest a non-peer dep in favor of a root dep peer > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "x@2.0.0",
    "edge": "{ ROOT prod x@2 }",
    "placed": "node_modules/x",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/x peer y@2 }",
    "parent": "x",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests clobber and nest a non-peer dep in favor of a root dep peer > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests clobber and nest a non-peer dep in favor of a root dep peer, step 2 > changes to tree 1`] = `
--- expected
+++ actual
@@ -62,6 +62,7 @@
           "type": "prod",
           "name": "y",
           "spec": "1",
+          "error": "INVALID",
           "to": "node_modules/y",
         },
       },
@@ -89,7 +90,6 @@
           "name": "y",
           "spec": "2",
           "to": "node_modules/y",
-          "error": "INVALID",
         },
       },
       "edgesIn": Set {
@@ -103,7 +103,7 @@
     },
     "y" => ArboristNode {
       "name": "y",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/y",
       "path": "/some/path/node_modules/y",
       "extraneous": true,
@@ -115,13 +115,13 @@
           "type": "prod",
           "name": "y",
           "spec": "1",
+          "error": "INVALID",
           "from": "node_modules/b",
         },
         EdgeIn {
           "type": "peer",
           "name": "y",
           "spec": "2",
-          "error": "INVALID",
           "from": "node_modules/x",
         },
       },

`

exports[`test/place-dep.js TAP placement tests clobber and nest a non-peer dep in favor of a root dep peer, step 2 > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/x peer y@2 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests clobber and nest a non-peer dep in favor of a root dep peer, step 2 > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests clobber and nest a peer set in favor of a root dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -18,8 +18,7 @@
       "type": "prod",
       "name": "x",
       "spec": "2",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/x",
     },
   },
   "children": Map {
@@ -37,7 +36,8 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
-          "to": "node_modules/b",
+          "error": "MISSING",
+          "to": null,
         },
       },
       "edgesIn": Set {
@@ -49,49 +49,49 @@
         },
       },
     },
-    "y" => ArboristNode {
-      "name": "y",
-      "version": "1.0.0",
-      "location": "node_modules/y",
-      "path": "/some/path/node_modules/y",
+    "x" => ArboristNode {
+      "name": "x",
+      "version": "2.0.0",
+      "location": "node_modules/x",
+      "path": "/some/path/node_modules/x",
       "extraneous": true,
       "dev": true,
       "optional": true,
       "peer": true,
-      "edgesIn": Set {
-        EdgeIn {
+      "edgesOut": Map {
+        "y" => EdgeOut {
           "type": "peer",
           "name": "y",
-          "spec": "1",
-          "from": "node_modules/b",
+          "spec": "2",
+          "to": "node_modules/y",
         },
       },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "x",
+          "spec": "2",
+          "from": "",
+        },
+      },
     },
-    "b" => ArboristNode {
-      "name": "b",
-      "version": "1.0.0",
-      "location": "node_modules/b",
-      "path": "/some/path/node_modules/b",
+    "y" => ArboristNode {
+      "name": "y",
+      "version": "2.0.0",
+      "location": "node_modules/y",
+      "path": "/some/path/node_modules/y",
       "extraneous": true,
       "dev": true,
       "optional": true,
       "peer": true,
-      "edgesOut": Map {
-        "y" => EdgeOut {
+      "edgesIn": Set {
+        EdgeIn {
           "type": "peer",
           "name": "y",
-          "spec": "1",
-          "to": "node_modules/y",
+          "spec": "2",
+          "from": "node_modules/x",
         },
       },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "b",
-          "spec": "1",
-          "from": "node_modules/a",
-        },
-      },
     },
   },
 }

`

exports[`test/place-dep.js TAP placement tests clobber and nest a peer set in favor of a root dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "x@2.0.0",
    "edge": "{ ROOT prod x@2 }",
    "placed": "node_modules/x",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/x peer y@2 }",
    "parent": "x",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests clobber and nest a peer set in favor of a root dep > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests clobber and nest a peer set in favor of a root dep, step 2 > changes to tree 1`] = `
--- expected
+++ actual
@@ -36,7 +36,8 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
-          "to": "node_modules/b",
+          "error": "MISSING",
+          "to": null,
         },
       },
       "edgesIn": Set {
@@ -63,7 +64,6 @@
           "name": "y",
           "spec": "2",
           "to": "node_modules/y",
-          "error": "INVALID",
         },
       },
       "edgesIn": Set {
@@ -77,7 +77,7 @@
     },
     "y" => ArboristNode {
       "name": "y",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/y",
       "path": "/some/path/node_modules/y",
       "extraneous": true,
@@ -88,43 +88,10 @@
         EdgeIn {
           "type": "peer",
           "name": "y",
-          "spec": "1",
-          "from": "node_modules/b",
-        },
-        EdgeIn {
-          "type": "peer",
-          "name": "y",
           "spec": "2",
-          "error": "INVALID",
           "from": "node_modules/x",
         },
       },
     },
-    "b" => ArboristNode {
-      "name": "b",
-      "version": "1.0.0",
-      "location": "node_modules/b",
-      "path": "/some/path/node_modules/b",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "y" => EdgeOut {
-          "type": "peer",
-          "name": "y",
-          "spec": "1",
-          "to": "node_modules/y",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "b",
-          "spec": "1",
-          "from": "node_modules/a",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests clobber and nest a peer set in favor of a root dep, step 2 > must match snapshot 1`] = `
Array [
  "node_modules/a 1.0.0",
]
`

exports[`test/place-dep.js TAP placement tests clobber and nest a peer set in favor of a root dep, step 2 > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/x peer y@2 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests clobber and nest a peer set in favor of a root dep, step 2 > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests cycle of peers > changes to tree 1`] = `
--- expected
+++ actual
@@ -14,8 +14,93 @@
       "type": "prod",
       "name": "a",
       "spec": "1.x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/a",
     },
   },
+  "children": Map {
+    "a" => ArboristNode {
+      "name": "a",
+      "version": "1.2.3",
+      "location": "node_modules/a",
+      "path": "/some/path/node_modules/a",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.x",
+          "from": "",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "a",
+          "spec": "1",
+          "from": "node_modules/c",
+        },
+      },
+    },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "1.2.3",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/a",
+        },
+      },
+    },
+    "c" => ArboristNode {
+      "name": "c",
+      "version": "1.2.3",
+      "location": "node_modules/c",
+      "path": "/some/path/node_modules/c",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "a" => EdgeOut {
+          "type": "peer",
+          "name": "a",
+          "spec": "1",
+          "to": "node_modules/a",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "from": "node_modules/b",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests cycle of peers > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.2.3",
    "edge": "{ ROOT prod a@1.x }",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.2.3",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@1.2.3",
    "edge": "{ node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests cycle of peers > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests cycle of peers hanging off entry node > changes to tree 1`] = `
--- expected
+++ actual
@@ -14,8 +14,119 @@
       "type": "prod",
       "name": "a",
       "spec": "1.x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/a",
     },
   },
+  "children": Map {
+    "a" => ArboristNode {
+      "name": "a",
+      "version": "1.2.3",
+      "location": "node_modules/a",
+      "path": "/some/path/node_modules/a",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.x",
+          "from": "",
+        },
+      },
+    },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "1.2.3",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/a",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/d",
+        },
+      },
+    },
+    "c" => ArboristNode {
+      "name": "c",
+      "version": "1.2.3",
+      "location": "node_modules/c",
+      "path": "/some/path/node_modules/c",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "d" => EdgeOut {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "to": "node_modules/d",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "from": "node_modules/b",
+        },
+      },
+    },
+    "d" => ArboristNode {
+      "name": "d",
+      "version": "1.2.3",
+      "location": "node_modules/d",
+      "path": "/some/path/node_modules/d",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "from": "node_modules/c",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests cycle of peers hanging off entry node > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.2.3",
    "edge": "{ ROOT prod a@1.x }",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.2.3",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@1.2.3",
    "edge": "{ node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "d@1.2.3",
    "edge": "{ node_modules/c peer d@1 }",
    "parent": "c",
    "placed": "node_modules/d",
  },
]
`

exports[`test/place-dep.js TAP placement tests cycle of peers hanging off entry node > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests dedupe a transitive dependency > changes to tree 1`] = `
--- expected
+++ actual
@@ -22,6 +22,30 @@
     },
   },
   "children": Map {
+    "bar" => ArboristNode {
+      "name": "bar",
+      "version": "1.0.0",
+      "location": "node_modules/bar",
+      "path": "/some/path/node_modules/bar",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "bar",
+          "spec": "1",
+          "from": "node_modules/baz",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "bar",
+          "spec": "1",
+          "from": "node_modules/foo",
+        },
+      },
+    },
     "baz" => ArboristNode {
       "name": "baz",
       "version": "1.0.0",
@@ -36,8 +60,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -63,8 +86,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/bar",
         },
       },
       "edgesIn": Set {

`

exports[`test/place-dep.js TAP placement tests dedupe a transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": "node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP placement tests dedupe a transitive dependency > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests dep with load error > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,9 +12,35 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "error": "MISSING",
+      "error": "INVALID",
       "peerConflicted": true,
-      "to": null,
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "foo" => ArboristNode {
+      "name": "foo",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "errors": Array [
+        Object {
+          "code": "testing",
+        },
+      ],
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests dep with load error > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
]
`

exports[`test/place-dep.js TAP placement tests dep with load error > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests do not shadow inappropriately > changes to tree 1`] = `
--- expected
+++ actual
@@ -56,13 +56,6 @@
           "spec": "1",
           "from": "node_modules/x/node_modules/b",
         },
-        EdgeIn {
-          "type": "prod",
-          "name": "c",
-          "spec": "2",
-          "error": "INVALID",
-          "from": "node_modules/x/node_modules/a/node_modules/b",
-        },
       },
     },
     "x" => ArboristNode {
@@ -137,8 +130,7 @@
                   "type": "prod",
                   "name": "c",
                   "spec": "2",
-                  "to": "node_modules/c",
-                  "error": "INVALID",
+                  "to": "node_modules/x/node_modules/a/node_modules/c",
                 },
               },
               "edgesIn": Set {
@@ -150,6 +142,24 @@
                 },
               },
             },
+            "c" => ArboristNode {
+              "name": "c",
+              "version": "2.0.0",
+              "location": "node_modules/x/node_modules/a/node_modules/c",
+              "path": "/some/path/node_modules/x/node_modules/a/node_modules/c",
+              "extraneous": true,
+              "dev": true,
+              "optional": true,
+              "peer": true,
+              "edgesIn": Set {
+                EdgeIn {
+                  "type": "prod",
+                  "name": "c",
+                  "spec": "2",
+                  "from": "node_modules/x/node_modules/a/node_modules/b",
+                },
+              },
+            },
           },
         },
         "b" => ArboristNode {

`

exports[`test/place-dep.js TAP placement tests do not shadow inappropriately > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/x/node_modules/a/node_modules/b" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "node_modules/x/node_modules/a" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "node_modules/x" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "c@2.0.0",
    "edge": "{ node_modules/x/node_modules/a/node_modules/b prod c@2 }",
    "placed": "node_modules/x/node_modules/a/node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests do not shadow inappropriately > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, but new dep set can > changes to tree 1`] = `
--- expected
+++ actual
@@ -38,8 +38,7 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
-          "to": "node_modules/b",
-          "error": "INVALID",
+          "to": "node_modules/a/node_modules/b",
         },
       },
       "edgesIn": Set {
@@ -50,6 +49,52 @@
           "from": "",
         },
       },
+      "children": Map {
+        "b" => ArboristNode {
+          "name": "b",
+          "version": "1.0.1",
+          "location": "node_modules/a/node_modules/b",
+          "path": "/some/path/node_modules/a/node_modules/b",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesOut": Map {
+            "c" => EdgeOut {
+              "type": "peer",
+              "name": "c",
+              "spec": "1",
+              "to": "node_modules/a/node_modules/c",
+            },
+          },
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "b",
+              "spec": "1",
+              "from": "node_modules/a",
+            },
+          },
+        },
+        "c" => ArboristNode {
+          "name": "c",
+          "version": "1.0.1",
+          "location": "node_modules/a/node_modules/c",
+          "path": "/some/path/node_modules/a/node_modules/c",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "peer",
+              "name": "c",
+              "spec": "1",
+              "from": "node_modules/a/node_modules/b",
+            },
+          },
+        },
+      },
     },
     "b" => ArboristNode {
       "name": "b",
@@ -75,13 +120,6 @@
           "spec": "2",
           "from": "node_modules/d",
         },
-        EdgeIn {
-          "type": "prod",
-          "name": "b",
-          "spec": "1",
-          "error": "INVALID",
-          "from": "node_modules/a",
-        },
       },
     },
     "c" => ArboristNode {

`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, but new dep set can > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/a" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "b@1.0.1",
    "edge": "{ node_modules/a prod b@1 }",
    "placed": "node_modules/a/node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/a" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "c@1.0.1",
    "edge": "{ node_modules/a/node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/a/node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, but new dep set can > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set > thrown error 1`] = `
Error: could not resolve {
  "code": "ERESOLVE",
  "current": Object {
    "dependents": Array [
      Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "d",
              "spec": "2.x",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/d",
          "name": "d",
          "version": "2.2.2",
        },
        "name": "b",
        "spec": "2",
        "type": "peer",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/b",
    "name": "b",
    "version": "2.2.2",
  },
  "dep": Object {
    "dependents": Array [
      Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "1.x",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "1.0.1",
        },
        "name": "b",
        "spec": "1",
        "type": "peer",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/b",
    "name": "b",
    "version": "1.0.1",
    "whileInstalling": Object {
      "name": "a",
      "path": "/some/path/node_modules/a",
      "version": "1.0.1",
    },
  },
  "edge": Object {
    "error": "INVALID",
    "from": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "location": "/some/path",
          },
          "name": "a",
          "spec": "1.x",
          "type": "prod",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/a",
      "name": "a",
      "version": "1.0.1",
    },
    "name": "b",
    "spec": "1",
    "type": "peer",
  },
  "force": false,
  "isMine": true,
  "name": "Error",
  "peerConflict": Object {
    "current": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "location": "/some/path",
                },
                "name": "d",
                "spec": "2.x",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/d",
            "name": "d",
            "version": "2.2.2",
          },
          "name": "b",
          "spec": "2",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/b",
      "name": "b",
      "version": "2.2.2",
    },
    "peer": Object {
      "dependents": Array [
        Object {
          "error": "INVALID",
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "location": "/some/path",
                },
                "name": "a",
                "spec": "1.x",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/a",
            "name": "a",
            "version": "1.0.1",
          },
          "name": "b",
          "spec": "1",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/b",
      "name": "b",
      "version": "1.0.1",
      "whileInstalling": Object {
        "name": "a",
        "path": "/some/path/node_modules/a",
        "version": "1.0.1",
      },
    },
  },
  "strictPeerDeps": false,
}
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer > thrown error 1`] = `
Error: could not resolve {
  "code": "ERESOLVE",
  "current": Object {
    "dependents": Array [
      Object {
        "from": Object {
          "location": "/some/path",
        },
        "name": "d",
        "spec": "1.x",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/d",
    "name": "d",
    "version": "1.1.1",
  },
  "dep": Object {
    "dependents": Array [
      Object {
        "from": Object {
          "location": "/some/path",
        },
        "name": "d",
        "spec": "1.x",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/d",
    "name": "d",
    "version": "1.2.2",
    "whileInstalling": Object {
      "name": "project",
      "path": "/some/path",
      "version": "1.2.3",
    },
  },
  "edge": Object {
    "from": Object {
      "location": "/some/path",
    },
    "name": "d",
    "spec": "1.x",
    "type": "prod",
  },
  "force": false,
  "isMine": true,
  "name": "Error",
  "peerConflict": Object {
    "current": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "location": "/some/path",
                },
                "name": "a",
                "spec": "1.x",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/a",
            "name": "a",
            "version": "1.0.1",
          },
          "name": "c",
          "spec": "*",
          "type": "peer",
        },
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "dependents": Array [
                    Object {
                      "from": Object {
                        "location": "/some/path",
                      },
                      "name": "a",
                      "spec": "1.x",
                      "type": "prod",
                    },
                  ],
                  "isWorkspace": false,
                  "location": "node_modules/a",
                  "name": "a",
                  "version": "1.0.1",
                },
                "name": "bb",
                "spec": "1",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/bb",
            "name": "bb",
            "version": "1.0.1",
          },
          "name": "c",
          "spec": "*",
          "type": "peer",
        },
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "dependents": Array [
                    Object {
                      "from": Object {
                        "dependents": Array [
                          Object {
                            "from": Object {
                              "dependents": Array [
                                Object {
                                  "from": Object {
                                    "location": "/some/path",
                                  },
                                  "name": "a",
                                  "spec": "1.x",
                                  "type": "prod",
                                },
                              ],
                              "isWorkspace": false,
                              "location": "node_modules/a",
                              "name": "a",
                              "version": "1.0.1",
                            },
                            "name": "bb",
                            "spec": "1",
                            "type": "prod",
                          },
                        ],
                        "isWorkspace": false,
                        "location": "node_modules/bb",
                        "name": "bb",
                        "version": "1.0.1",
                      },
                      "name": "cc",
                      "spec": "1",
                      "type": "prod",
                    },
                  ],
                  "isWorkspace": false,
                  "location": "node_modules/cc",
                  "name": "cc",
                  "version": "1.0.1",
                },
                "name": "dd",
                "spec": "1",
                "type": "peer",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/dd",
            "name": "dd",
            "version": "1.0.1",
          },
          "name": "c",
          "spec": "1",
          "type": "peer",
        },
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "location": "/some/path",
                },
                "name": "d",
                "spec": "1.x",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/d",
            "name": "d",
            "version": "1.1.1",
          },
          "name": "c",
          "spec": "1",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "1.0.1",
    },
    "peer": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "dependents": Array [
                    Object {
                      "from": Object {
                        "location": "/some/path",
                      },
                      "name": "d",
                      "spec": "1.x",
                      "type": "prod",
                    },
                  ],
                  "isWorkspace": false,
                  "location": "node_modules/d",
                  "name": "d",
                  "version": "1.2.2",
                  "whileInstalling": Object {
                    "name": "project",
                    "path": "/some/path",
                    "version": "1.2.3",
                  },
                },
                "name": "b",
                "spec": "2",
                "type": "peer",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/b",
            "name": "b",
            "version": "2.2.2",
            "whileInstalling": Object {
              "name": "project",
              "path": "/some/path",
              "version": "1.2.3",
            },
          },
          "name": "c",
          "spec": "2",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "2.2.2",
      "whileInstalling": Object {
        "name": "project",
        "path": "/some/path",
        "version": "1.2.3",
      },
    },
  },
  "strictPeerDeps": false,
}
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer, force > changes to tree 1`] = `
--- expected
+++ actual
@@ -116,12 +116,6 @@
           "spec": "1",
           "from": "node_modules/dd",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "from": "node_modules/d",
-        },
       },
     },
     "cc" => ArboristNode {
@@ -152,7 +146,7 @@
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "1.1.1",
+      "version": "1.2.2",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -160,11 +154,12 @@
       "optional": true,
       "peer": true,
       "edgesOut": Map {
-        "c" => EdgeOut {
+        "b" => EdgeOut {
           "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "to": "node_modules/c",
+          "name": "b",
+          "spec": "2",
+          "error": "MISSING",
+          "to": null,
         },
       },
       "edgesIn": Set {

`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer, force > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.2.2",
    "edge": "{ ROOT prod d@1.x }",
    "placed": "node_modules/d",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer, force > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer, legacyPeerDeps > changes to tree 1`] = `
--- expected
+++ actual
@@ -161,15 +161,6 @@
           "from": "",
         },
       },
-      "edgesOut": Map {
-        "b" => EdgeOut {
-          "type": "peer",
-          "name": "b",
-          "spec": "2",
-          "error": "MISSING",
-          "to": null,
-        },
-      },
     },
     "dd" => ArboristNode {
       "name": "dd",

`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer, legacyPeerDeps > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.2.2",
    "edge": "{ ROOT prod d@1.x }",
    "placed": "node_modules/d",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer, legacyPeerDeps > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz > thrown error 1`] = `
Error: could not resolve {
  "code": "ERESOLVE",
  "current": Object {
    "dependents": Array [
      Object {
        "from": Object {
          "location": "/some/path",
        },
        "name": "d",
        "spec": "1.x",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/d",
    "name": "d",
    "version": "1.1.1",
  },
  "dep": Object {
    "dependents": Array [
      Object {
        "from": Object {
          "location": "/some/path",
        },
        "name": "d",
        "spec": "1.x",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/d",
    "name": "d",
    "version": "1.2.2",
    "whileInstalling": Object {
      "name": "project",
      "path": "/some/path",
      "version": "1.2.3",
    },
  },
  "edge": Object {
    "from": Object {
      "location": "/some/path",
    },
    "name": "d",
    "spec": "1.x",
    "type": "prod",
  },
  "force": false,
  "isMine": true,
  "name": "Error",
  "peerConflict": Object {
    "current": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "location": "/some/path",
                },
                "name": "a",
                "spec": "1.x",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/a",
            "name": "a",
            "version": "1.0.1",
          },
          "name": "c",
          "spec": "*",
          "type": "peer",
        },
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "dependents": Array [
                    Object {
                      "from": Object {
                        "location": "/some/path",
                      },
                      "name": "a",
                      "spec": "1.x",
                      "type": "prod",
                    },
                  ],
                  "isWorkspace": false,
                  "location": "node_modules/a",
                  "name": "a",
                  "version": "1.0.1",
                },
                "name": "bb",
                "spec": "1",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/bb",
            "name": "bb",
            "version": "1.0.1",
          },
          "name": "c",
          "spec": "1",
          "type": "peer",
        },
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "location": "/some/path",
                },
                "name": "d",
                "spec": "1.x",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/d",
            "name": "d",
            "version": "1.1.1",
          },
          "name": "c",
          "spec": "1",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "1.0.1",
    },
    "peer": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "dependents": Array [
                    Object {
                      "from": Object {
                        "location": "/some/path",
                      },
                      "name": "d",
                      "spec": "1.x",
                      "type": "prod",
                    },
                  ],
                  "isWorkspace": false,
                  "location": "node_modules/d",
                  "name": "d",
                  "version": "1.2.2",
                  "whileInstalling": Object {
                    "name": "project",
                    "path": "/some/path",
                    "version": "1.2.3",
                  },
                },
                "name": "b",
                "spec": "2",
                "type": "peer",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/b",
            "name": "b",
            "version": "2.2.2",
            "whileInstalling": Object {
              "name": "project",
              "path": "/some/path",
              "version": "1.2.3",
            },
          },
          "name": "c",
          "spec": "2",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "2.2.2",
      "whileInstalling": Object {
        "name": "project",
        "path": "/some/path",
        "version": "1.2.3",
      },
    },
  },
  "strictPeerDeps": false,
}
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz, force > changes to tree 1`] = `
--- expected
+++ actual
@@ -104,17 +104,11 @@
           "spec": "1",
           "from": "node_modules/bb",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "from": "node_modules/d",
-        },
       },
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "1.1.1",
+      "version": "1.2.2",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -122,11 +116,12 @@
       "optional": true,
       "peer": true,
       "edgesOut": Map {
-        "c" => EdgeOut {
+        "b" => EdgeOut {
           "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "to": "node_modules/c",
+          "name": "b",
+          "spec": "2",
+          "error": "MISSING",
+          "to": null,
         },
       },
       "edgesIn": Set {

`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz, force > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.2.2",
    "edge": "{ ROOT prod d@1.x }",
    "placed": "node_modules/d",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz, force > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz, legacyPeerDeps > changes to tree 1`] = `
--- expected
+++ actual
@@ -123,15 +123,6 @@
           "from": "",
         },
       },
-      "edgesOut": Map {
-        "b" => EdgeOut {
-          "type": "peer",
-          "name": "b",
-          "spec": "2",
-          "error": "MISSING",
-          "to": null,
-        },
-      },
     },
   },
 }

`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz, legacyPeerDeps > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.2.2",
    "edge": "{ ROOT prod d@1.x }",
    "placed": "node_modules/d",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer xyz, legacyPeerDeps > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, force > changes to tree 1`] = `
--- expected
+++ actual
@@ -39,6 +39,7 @@
           "name": "b",
           "spec": "1",
           "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/b",
         },
       },
@@ -72,15 +73,16 @@
         EdgeIn {
           "type": "peer",
           "name": "b",
-          "spec": "2",
-          "from": "node_modules/d",
+          "spec": "1",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "node_modules/a",
         },
         EdgeIn {
           "type": "peer",
           "name": "b",
-          "spec": "1",
-          "error": "INVALID",
-          "from": "node_modules/a",
+          "spec": "2",
+          "from": "node_modules/d",
         },
       },
     },

`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, force > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "b@1.0.1",
    "edge": "{ node_modules/a peer b@1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, force > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "d",
                  "spec": "2.x",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/d",
              "name": "d",
              "version": "2.2.2",
            },
            "name": "b",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "2.2.2",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "a",
                  "spec": "1.x",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/a",
              "name": "a",
              "version": "1.0.1",
            },
            "name": "b",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "1.0.1",
        "whileInstalling": Object {
          "name": "a",
          "path": "/some/path/node_modules/a",
          "version": "1.0.1",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "1.x",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "1.0.1",
        },
        "name": "b",
        "spec": "1",
        "type": "peer",
      },
      "force": true,
      "isMine": true,
      "peerConflict": Object {
        "current": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "location": "/some/path",
                    },
                    "name": "d",
                    "spec": "2.x",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/d",
                "name": "d",
                "version": "2.2.2",
              },
              "name": "b",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/b",
          "name": "b",
          "version": "2.2.2",
        },
        "peer": Object {
          "dependents": Array [
            Object {
              "error": "INVALID",
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "location": "/some/path",
                    },
                    "name": "a",
                    "spec": "1.x",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/a",
                "name": "a",
                "version": "1.0.1",
              },
              "name": "b",
              "spec": "1",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/b",
          "name": "b",
          "version": "1.0.1",
          "whileInstalling": Object {
            "name": "a",
            "path": "/some/path/node_modules/a",
            "version": "1.0.1",
          },
        },
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, replacement satisfies > changes to tree 1`] = `
--- expected
+++ actual
@@ -56,6 +56,32 @@
         },
       },
     },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "2.2.2",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "from": "node_modules/d",
+        },
+      },
+    },
     "bb" => ArboristNode {
       "name": "bb",
       "version": "1.0.1",
@@ -107,6 +133,12 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
+          "spec": "1",
+          "from": "node_modules/b",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
           "spec": "*",
           "from": "node_modules/bb",
         },
@@ -122,12 +154,6 @@
           "spec": "1",
           "from": "node_modules/dd",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "from": "node_modules/d",
-        },
       },
     },
     "cc" => ArboristNode {
@@ -164,7 +190,7 @@
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "1.1.1",
+      "version": "1.2.2",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -172,11 +198,11 @@
       "optional": true,
       "peer": true,
       "edgesOut": Map {
-        "c" => EdgeOut {
+        "b" => EdgeOut {
           "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "to": "node_modules/c",
+          "name": "b",
+          "spec": "2",
+          "to": "node_modules/b",
         },
       },
       "edgesIn": Set {

`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, replacement satisfies > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.2.2",
    "edge": "{ ROOT prod d@1.x }",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@2.2.2",
    "edge": "{ node_modules/d peer b@2 }",
    "parent": "d",
    "placed": "node_modules/b",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set cannot be pushed deeper, neither can new set, replacement satisfies > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, conflict on peer > changes to tree 1`] = `
--- expected
+++ actual
@@ -38,7 +38,8 @@
           "type": "prod",
           "name": "bb",
           "spec": "1",
-          "to": "node_modules/bb",
+          "error": "MISSING",
+          "to": null,
         },
       },
       "edgesIn": Set {
@@ -50,9 +51,35 @@
         },
       },
     },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "2.2.2",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "2",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "from": "node_modules/d",
+        },
+      },
+    },
     "c" => ArboristNode {
       "name": "c",
-      "version": "1.0.1",
+      "version": "2.2.2",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -63,20 +90,14 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "1",
-          "from": "node_modules/bb",
+          "spec": "2",
+          "from": "node_modules/b",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "from": "node_modules/d",
-        },
       },
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "1.1.1",
+      "version": "1.2.2",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -84,11 +105,11 @@
       "optional": true,
       "peer": true,
       "edgesOut": Map {
-        "c" => EdgeOut {
+        "b" => EdgeOut {
           "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "to": "node_modules/c",
+          "name": "b",
+          "spec": "2",
+          "to": "node_modules/b",
         },
       },
       "edgesIn": Set {
@@ -100,31 +121,5 @@
         },
       },
     },
-    "bb" => ArboristNode {
-      "name": "bb",
-      "version": "1.0.1",
-      "location": "node_modules/bb",
-      "path": "/some/path/node_modules/bb",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "c" => EdgeOut {
-          "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "to": "node_modules/c",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "bb",
-          "spec": "1",
-          "from": "node_modules/a",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, conflict on peer > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.2.2",
    "edge": "{ ROOT prod d@1.x }",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@2.2.2",
    "edge": "{ node_modules/d peer b@2 }",
    "parent": "d",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "c@2.2.2",
    "edge": "{ node_modules/b peer c@2 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, conflict on peer > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, no current > changes to tree 1`] = `
--- expected
+++ actual
@@ -20,8 +20,7 @@
       "type": "prod",
       "name": "d",
       "spec": "2.x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/d",
     },
   },
   "children": Map {
@@ -39,6 +38,7 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
           "to": "node_modules/b",
         },
       },
@@ -53,7 +53,7 @@
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "1.0.1",
+      "version": "2.2.2",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -64,7 +64,7 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/c",
         },
       },
@@ -73,13 +73,20 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
           "from": "node_modules/a",
         },
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "from": "node_modules/d",
+        },
       },
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "1.0.1",
+      "version": "2.2.2",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -90,10 +97,36 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/b",
         },
       },
     },
+    "d" => ArboristNode {
+      "name": "d",
+      "version": "2.2.2",
+      "location": "node_modules/d",
+      "path": "/some/path/node_modules/d",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "d",
+          "spec": "2.x",
+          "from": "",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, no current > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "d@2.2.2",
    "edge": "{ ROOT prod d@2.x }",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@2.2.2",
    "edge": "{ node_modules/d peer b@2 }",
    "parent": "d",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@2.2.2",
    "edge": "{ node_modules/b peer c@2 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, no current > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, with invalid current > changes to tree 1`] = `
--- expected
+++ actual
@@ -21,7 +21,6 @@
       "name": "d",
       "spec": "2.x",
       "to": "node_modules/d",
-      "error": "INVALID",
     },
   },
   "children": Map {
@@ -39,6 +38,7 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
           "to": "node_modules/b",
         },
       },
@@ -53,7 +53,7 @@
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "1.0.1",
+      "version": "2.2.2",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -64,7 +64,7 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/c",
         },
       },
@@ -73,19 +73,20 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
           "from": "node_modules/a",
         },
         EdgeIn {
           "type": "peer",
           "name": "b",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/d",
         },
       },
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "1.0.1",
+      "version": "2.2.2",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -96,14 +97,14 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/b",
         },
       },
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "1.1.1",
+      "version": "2.2.2",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -114,7 +115,7 @@
         "b" => EdgeOut {
           "type": "peer",
           "name": "b",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/b",
         },
       },
@@ -123,7 +124,6 @@
           "type": "prod",
           "name": "d",
           "spec": "2.x",
-          "error": "INVALID",
           "from": "",
         },
       },

`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, with invalid current > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@2.2.2",
    "edge": "{ ROOT prod d@2.x }",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@2.2.2",
    "edge": "{ node_modules/d peer b@2 }",
    "parent": "d",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "c@2.2.2",
    "edge": "{ node_modules/b peer c@2 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, with invalid current > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, with valid current > changes to tree 1`] = `
--- expected
+++ actual
@@ -38,6 +38,7 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
           "to": "node_modules/b",
         },
       },
@@ -52,7 +53,7 @@
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "1.0.1",
+      "version": "2.2.2",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -63,7 +64,7 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/c",
         },
       },
@@ -72,19 +73,20 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
           "from": "node_modules/a",
         },
         EdgeIn {
           "type": "peer",
           "name": "b",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/d",
         },
       },
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "1.0.1",
+      "version": "2.2.2",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -95,14 +97,14 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/b",
         },
       },
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "1.1.1",
+      "version": "1.2.2",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -113,7 +115,7 @@
         "b" => EdgeOut {
           "type": "peer",
           "name": "b",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/b",
         },
       },

`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, with valid current > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.2.2",
    "edge": "{ ROOT prod d@1.x }",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@2.2.2",
    "edge": "{ node_modules/d peer b@2 }",
    "parent": "d",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "c@2.2.2",
    "edge": "{ node_modules/b peer c@2 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests existing peer set which can be pushed deeper, with valid current > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests explicit placement of a production dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,8 +12,27 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "foo" => ArboristNode {
+      "name": "foo",
+      "version": "1.0.0",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests explicit placement of a production dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@1.0.0",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
]
`

exports[`test/place-dep.js TAP placement tests explicit placement of a production dep > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests fail with ERESOLVE on deep peer dep > thrown error 1`] = `
Error: could not resolve {
  "code": "ERESOLVE",
  "current": null,
  "dep": Object {
    "dependents": Array [
      Object {
        "error": "MISSING",
        "from": Object {
          "location": "/some/path",
        },
        "name": "b",
        "spec": "2",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/b",
    "name": "b",
    "version": "2.0.0",
    "whileInstalling": Object {
      "name": undefined,
      "path": "/some/path",
      "version": undefined,
    },
  },
  "edge": Object {
    "error": "MISSING",
    "from": Object {
      "location": "/some/path",
    },
    "name": "b",
    "spec": "2",
    "type": "prod",
  },
  "force": false,
  "isMine": true,
  "name": "Error",
  "peerConflict": Object {
    "current": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "dependents": Array [
                    Object {
                      "from": Object {
                        "location": "/some/path",
                      },
                      "name": "a",
                      "spec": "1",
                      "type": "prod",
                    },
                  ],
                  "isWorkspace": false,
                  "location": "node_modules/a",
                  "name": "a",
                  "version": "1.0.0",
                },
                "name": "x",
                "spec": "1",
                "type": "peer",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/x",
            "name": "x",
            "version": "1.0.0",
          },
          "name": "y",
          "spec": "1",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/y",
      "name": "y",
      "version": "1.0.0",
    },
    "peer": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "from": Object {
                  "dependents": Array [
                    Object {
                      "error": "MISSING",
                      "from": Object {
                        "location": "/some/path",
                      },
                      "name": "b",
                      "spec": "2",
                      "type": "prod",
                    },
                  ],
                  "isWorkspace": false,
                  "location": "node_modules/b",
                  "name": "b",
                  "version": "2.0.0",
                  "whileInstalling": Object {
                    "name": undefined,
                    "path": "/some/path",
                    "version": undefined,
                  },
                },
                "name": "k",
                "spec": "2",
                "type": "peer",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/k",
            "name": "k",
            "version": "2.0.0",
            "whileInstalling": Object {
              "name": undefined,
              "path": "/some/path",
              "version": undefined,
            },
          },
          "name": "y",
          "spec": "2",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/y",
      "name": "y",
      "version": "2.0.0",
      "whileInstalling": Object {
        "name": undefined,
        "path": "/some/path",
        "version": undefined,
      },
    },
  },
  "strictPeerDeps": false,
}
`

exports[`test/place-dep.js TAP placement tests fail with ERESOLVE on deep peer dep, force > changes to tree 1`] = `
--- expected
+++ actual
@@ -18,8 +18,7 @@
       "type": "prod",
       "name": "b",
       "spec": "2",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/b",
     },
   },
   "children": Map {
@@ -49,6 +48,33 @@
         },
       },
     },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "2.0.0",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "k" => EdgeOut {
+          "type": "peer",
+          "name": "k",
+          "spec": "2",
+          "error": "MISSING",
+          "to": null,
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "b",
+          "spec": "2",
+          "from": "",
+        },
+      },
+    },
     "x" => ArboristNode {
       "name": "x",
       "version": "1.0.0",

`

exports[`test/place-dep.js TAP placement tests fail with ERESOLVE on deep peer dep, force > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@2.0.0",
    "edge": "{ ROOT prod b@2 }",
    "placed": "node_modules/b",
  },
]
`

exports[`test/place-dep.js TAP placement tests fail with ERESOLVE on deep peer dep, force > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests fail with ERESOLVE on deep peer dep, legacyPeerDeps > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP placement tests fail with ERESOLVE on deep peer dep, legacyPeerDeps > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {},
    "dep": "b@2.0.0",
    "edge": "{ ROOT prod b@2 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests fail with ERESOLVE on deep peer dep, legacyPeerDeps > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests have replacement for conflicted entry node > changes to tree 1`] = `
--- expected
+++ actual
@@ -13,7 +13,6 @@
       "name": "a",
       "spec": "2",
       "to": "node_modules/a",
-      "error": "INVALID",
     },
     "c" => EdgeOut {
       "type": "prod",
@@ -25,7 +24,7 @@
   "children": Map {
     "a" => ArboristNode {
       "name": "a",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/a",
       "path": "/some/path/node_modules/a",
       "extraneous": true,
@@ -36,7 +35,7 @@
         "b" => EdgeOut {
           "type": "peer",
           "name": "b",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/b",
         },
       },
@@ -45,14 +44,13 @@
           "type": "prod",
           "name": "a",
           "spec": "2",
-          "error": "INVALID",
           "from": "",
         },
       },
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -63,7 +61,7 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/c",
         },
       },
@@ -71,14 +69,14 @@
         EdgeIn {
           "type": "peer",
           "name": "b",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/a",
         },
       },
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -89,7 +87,7 @@
         "d" => EdgeOut {
           "type": "peer",
           "name": "d",
-          "spec": "1",
+          "spec": "2",
           "to": "node_modules/d",
         },
       },
@@ -103,14 +101,14 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/b",
         },
       },
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -121,7 +119,7 @@
         EdgeIn {
           "type": "peer",
           "name": "d",
-          "spec": "1",
+          "spec": "2",
           "from": "node_modules/c",
         },
       },

`

exports[`test/place-dep.js TAP placement tests have replacement for conflicted entry node > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "a@2.0.0",
    "edge": "{ ROOT prod a@2 }",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@2.0.0",
    "edge": "{ node_modules/a peer b@2 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "c@2.0.0",
    "edge": "{ node_modules/b peer c@2 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@2.0.0",
    "edge": "{ node_modules/c peer d@2 }",
    "parent": "c",
    "placed": "node_modules/d",
  },
]
`

exports[`test/place-dep.js TAP placement tests have replacement for conflicted entry node > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests keep, but dedupe > changes to tree 1`] = `
--- expected
+++ actual
@@ -43,29 +43,9 @@
           "type": "prod",
           "name": "y",
           "spec": "1",
-          "to": "z/node_modules/y",
+          "to": "node_modules/y",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.1.2",
-          "location": "z/node_modules/y",
-          "path": "/some/path/z/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1",
-              "from": "z",
-            },
-          },
-        },
-      },
     },
   },
   "children": Map {
@@ -83,7 +63,7 @@
           "type": "prod",
           "name": "y",
           "spec": "1.1",
-          "to": "node_modules/x/node_modules/y",
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -94,26 +74,6 @@
           "from": "",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.1.0",
-          "location": "node_modules/x/node_modules/y",
-          "path": "/some/path/node_modules/x/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1.1",
-              "from": "node_modules/x",
-            },
-          },
-        },
-      },
     },
     "y" => ArboristNode {
       "name": "y",
@@ -131,6 +91,18 @@
           "spec": "1",
           "from": "",
         },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1.1",
+          "from": "node_modules/x",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1",
+          "from": "z",
+        },
       },
     },
   },

`

exports[`test/place-dep.js TAP placement tests keep, but dedupe > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(KEEP),
    "canPlaceSelf": Symbol(KEEP),
    "checks": Map {
      "node_modules/x" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
      "" => Array [
        Symbol(KEEP),
        Symbol(KEEP),
      ],
    },
    "dep": "y@1.1.2",
    "edge": "{ node_modules/x prod y@1.1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests keep, but dedupe > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests nest a transitive dependency > changes to tree 1`] = `
--- expected
+++ actual
@@ -38,13 +38,6 @@
           "spec": "1",
           "from": "node_modules/foo",
         },
-        EdgeIn {
-          "type": "prod",
-          "name": "bar",
-          "spec": "1.0.0",
-          "error": "INVALID",
-          "from": "node_modules/baz",
-        },
       },
     },
     "baz" => ArboristNode {
@@ -61,8 +54,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1.0.0",
-          "to": "node_modules/bar",
-          "error": "INVALID",
+          "to": "node_modules/baz/node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -73,6 +65,26 @@
           "from": "",
         },
       },
+      "children": Map {
+        "bar" => ArboristNode {
+          "name": "bar",
+          "version": "1.0.0",
+          "location": "node_modules/baz/node_modules/bar",
+          "path": "/some/path/node_modules/baz/node_modules/bar",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "bar",
+              "spec": "1.0.0",
+              "from": "node_modules/baz",
+            },
+          },
+        },
+      },
     },
     "foo" => ArboristNode {
       "name": "foo",

`

exports[`test/place-dep.js TAP placement tests nest a transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/baz" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/baz prod bar@1.0.0 }",
    "placed": "node_modules/baz/node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP placement tests nest a transitive dependency > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests nest because globalStyle > changes to tree 1`] = `
--- expected
+++ actual
@@ -37,8 +37,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/foo/node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -49,6 +48,26 @@
           "from": "",
         },
       },
+      "children": Map {
+        "bar" => ArboristNode {
+          "name": "bar",
+          "version": "1.0.0",
+          "location": "node_modules/foo/node_modules/bar",
+          "path": "/some/path/node_modules/foo/node_modules/bar",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "bar",
+              "spec": "1",
+              "from": "node_modules/foo",
+            },
+          },
+        },
+      },
     },
   },
 }

`

exports[`test/place-dep.js TAP placement tests nest because globalStyle > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": "node_modules/foo/node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP placement tests nest because globalStyle > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests nest even though unnecessary, because legacy bundling > changes to tree 1`] = `
--- expected
+++ actual
@@ -63,8 +63,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/foo/node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -75,6 +74,26 @@
           "from": "",
         },
       },
+      "children": Map {
+        "bar" => ArboristNode {
+          "name": "bar",
+          "version": "1.0.0",
+          "location": "node_modules/foo/node_modules/bar",
+          "path": "/some/path/node_modules/foo/node_modules/bar",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "bar",
+              "spec": "1",
+              "from": "node_modules/foo",
+            },
+          },
+        },
+      },
     },
   },
 }

`

exports[`test/place-dep.js TAP placement tests nest even though unnecessary, because legacy bundling > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": "node_modules/foo/node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP placement tests nest even though unnecessary, because legacy bundling > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests nest only 1 level due to globalStyle > changes to tree 1`] = `
--- expected
+++ actual
@@ -63,8 +63,7 @@
               "type": "prod",
               "name": "baz",
               "spec": "*",
-              "to": null,
-              "error": "MISSING",
+              "to": "node_modules/foo/node_modules/baz",
             },
           },
           "edgesIn": Set {
@@ -76,6 +75,24 @@
             },
           },
         },
+        "baz" => ArboristNode {
+          "name": "baz",
+          "version": "1.0.0",
+          "location": "node_modules/foo/node_modules/baz",
+          "path": "/some/path/node_modules/foo/node_modules/baz",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "baz",
+              "spec": "*",
+              "from": "node_modules/foo/node_modules/bar",
+            },
+          },
+        },
       },
     },
   },

`

exports[`test/place-dep.js TAP placement tests nest only 1 level due to globalStyle > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo/node_modules/bar" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "baz@1.0.0",
    "edge": "{ node_modules/foo/node_modules/bar prod baz@ }",
    "placed": "node_modules/foo/node_modules/baz",
  },
]
`

exports[`test/place-dep.js TAP placement tests nest only 1 level due to globalStyle > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests nest peer set of non-root dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -88,8 +88,7 @@
           "type": "prod",
           "name": "x",
           "spec": "2",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/k/node_modules/x",
         },
       },
       "edgesIn": Set {
@@ -100,6 +99,52 @@
           "from": "",
         },
       },
+      "children": Map {
+        "x" => ArboristNode {
+          "name": "x",
+          "version": "2.0.0",
+          "location": "node_modules/k/node_modules/x",
+          "path": "/some/path/node_modules/k/node_modules/x",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesOut": Map {
+            "y" => EdgeOut {
+              "type": "peer",
+              "name": "y",
+              "spec": "2",
+              "to": "node_modules/k/node_modules/y",
+            },
+          },
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "x",
+              "spec": "2",
+              "from": "node_modules/k",
+            },
+          },
+        },
+        "y" => ArboristNode {
+          "name": "y",
+          "version": "2.0.0",
+          "location": "node_modules/k/node_modules/y",
+          "path": "/some/path/node_modules/k/node_modules/y",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "peer",
+              "name": "y",
+              "spec": "2",
+              "from": "node_modules/k/node_modules/x",
+            },
+          },
+        },
+      },
     },
     "y" => ArboristNode {
       "name": "y",

`

exports[`test/place-dep.js TAP placement tests nest peer set of non-root dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/k" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "x@2.0.0",
    "edge": "{ node_modules/k prod x@2 }",
    "placed": "node_modules/k/node_modules/x",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/k" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/k/node_modules/x peer y@2 }",
    "parent": "x",
    "placed": "node_modules/k/node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests nest peer set of non-root dep > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests nest peer set of non-root dep, step 2 > changes to tree 1`] = `
--- expected
+++ actual
@@ -114,8 +114,7 @@
               "type": "peer",
               "name": "y",
               "spec": "2",
-              "to": "node_modules/y",
-              "error": "INVALID",
+              "to": "node_modules/k/node_modules/y",
             },
           },
           "edgesIn": Set {
@@ -127,6 +126,24 @@
             },
           },
         },
+        "y" => ArboristNode {
+          "name": "y",
+          "version": "2.0.0",
+          "location": "node_modules/k/node_modules/y",
+          "path": "/some/path/node_modules/k/node_modules/y",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "peer",
+              "name": "y",
+              "spec": "2",
+              "from": "node_modules/k/node_modules/x",
+            },
+          },
+        },
       },
     },
     "y" => ArboristNode {
@@ -145,13 +162,6 @@
           "spec": "1",
           "from": "node_modules/b",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "y",
-          "spec": "2",
-          "error": "INVALID",
-          "from": "node_modules/k/node_modules/x",
-        },
       },
     },
   },

`

exports[`test/place-dep.js TAP placement tests nest peer set of non-root dep, step 2 > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/k" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/k/node_modules/x peer y@2 }",
    "placed": "node_modules/k/node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests nest peer set of non-root dep, step 2 > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests nest peer set under dependent node > changes to tree 1`] = `
--- expected
+++ actual
@@ -38,8 +38,7 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
-          "to": "node_modules/b",
-          "error": "INVALID",
+          "to": "node_modules/a/node_modules/b",
         },
       },
       "edgesIn": Set {
@@ -50,6 +49,52 @@
           "from": "",
         },
       },
+      "children": Map {
+        "b" => ArboristNode {
+          "name": "b",
+          "version": "1.0.1",
+          "location": "node_modules/a/node_modules/b",
+          "path": "/some/path/node_modules/a/node_modules/b",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesOut": Map {
+            "c" => EdgeOut {
+              "type": "peer",
+              "name": "c",
+              "spec": "1",
+              "to": "node_modules/a/node_modules/c",
+            },
+          },
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "b",
+              "spec": "1",
+              "from": "node_modules/a",
+            },
+          },
+        },
+        "c" => ArboristNode {
+          "name": "c",
+          "version": "1.0.1",
+          "location": "node_modules/a/node_modules/c",
+          "path": "/some/path/node_modules/a/node_modules/c",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "peer",
+              "name": "c",
+              "spec": "1",
+              "from": "node_modules/a/node_modules/b",
+            },
+          },
+        },
+      },
     },
     "b" => ArboristNode {
       "name": "b",
@@ -75,13 +120,6 @@
           "spec": "2",
           "from": "node_modules/d",
         },
-        EdgeIn {
-          "type": "prod",
-          "name": "b",
-          "spec": "1",
-          "error": "INVALID",
-          "from": "node_modules/a",
-        },
       },
     },
     "c" => ArboristNode {

`

exports[`test/place-dep.js TAP placement tests nest peer set under dependent node > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/a" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "b@1.0.1",
    "edge": "{ node_modules/a prod b@1 }",
    "placed": "node_modules/a/node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/a" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "c@1.0.1",
    "edge": "{ node_modules/a/node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/a/node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests nest peer set under dependent node > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests pathologically nested dependency cycle > changes to tree 1`] = `
--- expected
+++ actual
@@ -118,13 +118,6 @@
               "spec": "2",
               "from": "node_modules/b/node_modules/a",
             },
-            EdgeIn {
-              "type": "prod",
-              "name": "b",
-              "spec": "1",
-              "error": "INVALID",
-              "from": "node_modules/b/node_modules/b/node_modules/a",
-            },
           },
           "children": Map {
             "a" => ArboristNode {
@@ -141,8 +134,7 @@
                   "type": "prod",
                   "name": "b",
                   "spec": "1",
-                  "to": "node_modules/b/node_modules/b",
-                  "error": "INVALID",
+                  "to": "node_modules/b/node_modules/b/node_modules/b",
                 },
               },
               "edgesIn": Set {
@@ -154,6 +146,29 @@
                 },
               },
             },
+            "b" => ArboristLink {
+              "name": "b",
+              "version": "1.0.0",
+              "location": "node_modules/b/node_modules/b/node_modules/b",
+              "path": "/some/path/node_modules/b/node_modules/b/node_modules/b",
+              "realpath": "/some/path/node_modules/b",
+              "resolved": "file:../../..",
+              "extraneous": true,
+              "dev": true,
+              "optional": true,
+              "peer": true,
+              "edgesIn": Set {
+                EdgeIn {
+                  "type": "prod",
+                  "name": "b",
+                  "spec": "1",
+                  "from": "node_modules/b/node_modules/b/node_modules/a",
+                },
+              },
+              "target": ArboristNode {
+                "location": "node_modules/b",
+              },
+            },
           },
         },
       },

`

exports[`test/place-dep.js TAP placement tests pathologically nested dependency cycle > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/b/node_modules/b/node_modules/a" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "node_modules/b/node_modules/b" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "node_modules/b" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "b@1.0.0",
    "edge": "{ node_modules/b/node_modules/b/node_modules/a prod b@1 }",
    "placed": "node_modules/b/node_modules/b/node_modules/b",
  },
]
`

exports[`test/place-dep.js TAP placement tests pathologically nested dependency cycle > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests peer all the way down, conflict but not ours > changes to tree 1`] = `
--- expected
+++ actual
@@ -106,8 +106,7 @@
               "type": "prod",
               "name": "d",
               "spec": "1",
-              "to": "node_modules/d",
-              "error": "INVALID",
+              "to": "node_modules/b/node_modules/c/node_modules/d",
             },
             "p" => EdgeOut {
               "type": "peer",
@@ -124,6 +123,36 @@
               "from": "node_modules/b",
             },
           },
+          "children": Map {
+            "d" => ArboristNode {
+              "name": "d",
+              "version": "1.0.0",
+              "location": "node_modules/b/node_modules/c/node_modules/d",
+              "path": "/some/path/node_modules/b/node_modules/c/node_modules/d",
+              "extraneous": true,
+              "dev": true,
+              "optional": true,
+              "peer": true,
+              "edgesOut": Map {
+                "p" => EdgeOut {
+                  "type": "peer",
+                  "name": "p",
+                  "spec": "1",
+                  "error": "INVALID",
+                  "peerConflicted": true,
+                  "to": "node_modules/p",
+                },
+              },
+              "edgesIn": Set {
+                EdgeIn {
+                  "type": "prod",
+                  "name": "d",
+                  "spec": "1",
+                  "from": "node_modules/b/node_modules/c",
+                },
+              },
+            },
+          },
         },
       },
     },
@@ -177,13 +206,6 @@
           "spec": "2",
           "from": "node_modules/b",
         },
-        EdgeIn {
-          "type": "prod",
-          "name": "d",
-          "spec": "1",
-          "error": "INVALID",
-          "from": "node_modules/b/node_modules/c",
-        },
       },
     },
     "p" => ArboristNode {
@@ -217,6 +239,14 @@
         EdgeIn {
           "type": "peer",
           "name": "p",
+          "spec": "1",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "node_modules/b/node_modules/c/node_modules/d",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "p",
           "spec": "*",
           "from": "node_modules/c",
         },

`

exports[`test/place-dep.js TAP placement tests peer all the way down, conflict but not ours > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/b/node_modules/c" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "d@1.0.0",
    "edge": "{ node_modules/b/node_modules/c prod d@1 }",
    "placed": "node_modules/b/node_modules/c/node_modules/d",
  },
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {
      "node_modules/b/node_modules/c" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "p@1.0.0",
    "edge": "{ node_modules/b/node_modules/c/node_modules/d peer p@1 }",
    "parent": "d",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests peer all the way down, conflict but not ours > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "a",
                                    "spec": "",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/a",
                                "name": "a",
                                "version": "1.0.0",
                              },
                              "name": "b",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/b",
                          "name": "b",
                          "version": "1.0.0",
                        },
                        "name": "c",
                        "spec": "1",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b/node_modules/c",
                    "name": "c",
                    "version": "1.0.0",
                  },
                  "name": "d",
                  "spec": "1",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/b/node_modules/c/node_modules/d",
              "name": "d",
              "version": "1.0.0",
            },
            "name": "p",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/p",
        "name": "p",
        "version": "2.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "a",
                                    "spec": "",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/a",
                                "name": "a",
                                "version": "1.0.0",
                              },
                              "name": "b",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/b",
                          "name": "b",
                          "version": "1.0.0",
                        },
                        "name": "c",
                        "spec": "1",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b/node_modules/c",
                    "name": "c",
                    "version": "1.0.0",
                  },
                  "name": "d",
                  "spec": "1",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/b/node_modules/c/node_modules/d",
              "name": "d",
              "version": "1.0.0",
            },
            "name": "p",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/p",
        "name": "p",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": "c",
          "path": "/some/path/node_modules/b/node_modules/c",
          "version": "1.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "location": "/some/path",
                                },
                                "name": "a",
                                "spec": "",
                                "type": "prod",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/a",
                            "name": "a",
                            "version": "1.0.0",
                          },
                          "name": "b",
                          "spec": "",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/b",
                      "name": "b",
                      "version": "1.0.0",
                    },
                    "name": "c",
                    "spec": "1",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b/node_modules/c",
                "name": "c",
                "version": "1.0.0",
              },
              "name": "d",
              "spec": "1",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/b/node_modules/c/node_modules/d",
          "name": "d",
          "version": "1.0.0",
        },
        "name": "p",
        "spec": "1",
        "type": "peer",
      },
      "force": false,
      "isMine": false,
      "peerConflict": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "a",
                                    "spec": "",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/a",
                                "name": "a",
                                "version": "1.0.0",
                              },
                              "name": "b",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/b",
                          "name": "b",
                          "version": "1.0.0",
                        },
                        "name": "c",
                        "spec": "1",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b/node_modules/c",
                    "name": "c",
                    "version": "1.0.0",
                  },
                  "name": "d",
                  "spec": "1",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/b/node_modules/c/node_modules/d",
              "name": "d",
              "version": "1.0.0",
            },
            "name": "p",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/p",
        "name": "p",
        "version": "2.0.0",
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests peer with peers > changes to tree 1`] = `
--- expected
+++ actual
@@ -14,8 +14,79 @@
       "type": "prod",
       "name": "a",
       "spec": "1.x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/a",
     },
   },
+  "children": Map {
+    "a" => ArboristNode {
+      "name": "a",
+      "version": "1.2.3",
+      "location": "node_modules/a",
+      "path": "/some/path/node_modules/a",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.x",
+          "from": "",
+        },
+      },
+    },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "1.2.3",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/a",
+        },
+      },
+    },
+    "c" => ArboristNode {
+      "name": "c",
+      "version": "1.2.3",
+      "location": "node_modules/c",
+      "path": "/some/path/node_modules/c",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "from": "node_modules/b",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests peer with peers > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.2.3",
    "edge": "{ ROOT prod a@1.x }",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.2.3",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@1.2.3",
    "edge": "{ node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests peer with peers > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet > changes to tree 1`] = `
--- expected
+++ actual
@@ -14,8 +14,109 @@
       "type": "prod",
       "name": "a",
       "spec": "1.x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/a",
     },
   },
+  "children": Map {
+    "a" => ArboristNode {
+      "name": "a",
+      "version": "1.2.3",
+      "location": "node_modules/a",
+      "path": "/some/path/node_modules/a",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.x",
+          "from": "",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "a",
+          "spec": "2",
+          "error": "INVALID",
+          "from": "node_modules/c",
+        },
+      },
+    },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "1.2.3",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/a",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "error": "INVALID",
+          "from": "node_modules/c",
+        },
+      },
+    },
+    "c" => ArboristNode {
+      "name": "c",
+      "version": "1.2.3",
+      "location": "node_modules/c",
+      "path": "/some/path/node_modules/c",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "a" => EdgeOut {
+          "type": "peer",
+          "name": "a",
+          "spec": "2",
+          "error": "INVALID",
+          "to": "node_modules/a",
+        },
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "error": "INVALID",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "from": "node_modules/b",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.2.3",
    "edge": "{ ROOT prod a@1.x }",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.2.3",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@1.2.3",
    "edge": "{ node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet from dependent > changes to tree 1`] = `
--- expected
+++ actual
@@ -14,8 +14,7 @@
       "type": "prod",
       "name": "a",
       "spec": "1.x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/a",
     },
     "c" => EdgeOut {
       "type": "prod",
@@ -25,6 +24,73 @@
     },
   },
   "children": Map {
+    "a" => ArboristNode {
+      "name": "a",
+      "version": "1.2.3",
+      "location": "node_modules/a",
+      "path": "/some/path/node_modules/a",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.x",
+          "from": "",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "a",
+          "spec": "2",
+          "error": "INVALID",
+          "from": "node_modules/c",
+        },
+      },
+    },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "1.2.3",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "error": "INVALID",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/a",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "error": "INVALID",
+          "from": "node_modules/c",
+        },
+      },
+    },
     "c" => ArboristNode {
       "name": "c",
       "version": "2.0.1",
@@ -39,15 +105,15 @@
           "type": "peer",
           "name": "a",
           "spec": "2",
-          "error": "MISSING",
-          "to": null,
+          "error": "INVALID",
+          "to": "node_modules/a",
         },
         "b" => EdgeOut {
           "type": "peer",
           "name": "b",
           "spec": "2",
-          "error": "MISSING",
-          "to": null,
+          "error": "INVALID",
+          "to": "node_modules/b",
         },
       },
       "edgesIn": Set {
@@ -57,6 +123,13 @@
           "spec": "2.x",
           "from": "",
         },
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "error": "INVALID",
+          "from": "node_modules/b",
+        },
       },
     },
   },

`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet from dependent > changes to tree 2`] = `
--- expected
+++ actual
@@ -14,8 +14,7 @@
       "type": "prod",
       "name": "a",
       "spec": "1.x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/a",
     },
     "c" => EdgeOut {
       "type": "prod",
@@ -25,6 +24,73 @@
     },
   },
   "children": Map {
+    "a" => ArboristNode {
+      "name": "a",
+      "version": "1.2.3",
+      "location": "node_modules/a",
+      "path": "/some/path/node_modules/a",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "b" => EdgeOut {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.x",
+          "from": "",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "a",
+          "spec": "2",
+          "error": "INVALID",
+          "from": "node_modules/c",
+        },
+      },
+    },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "1.2.3",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "error": "INVALID",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/a",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "b",
+          "spec": "2",
+          "error": "INVALID",
+          "from": "node_modules/c",
+        },
+      },
+    },
     "c" => ArboristNode {
       "name": "c",
       "version": "2.0.1",
@@ -39,15 +105,15 @@
           "type": "peer",
           "name": "a",
           "spec": "2",
-          "error": "MISSING",
-          "to": null,
+          "error": "INVALID",
+          "to": "node_modules/a",
         },
         "b" => EdgeOut {
           "type": "peer",
           "name": "b",
           "spec": "2",
-          "error": "MISSING",
-          "to": null,
+          "error": "INVALID",
+          "to": "node_modules/b",
         },
       },
       "edgesIn": Set {
@@ -57,6 +123,13 @@
           "spec": "2.x",
           "from": "",
         },
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "error": "INVALID",
+          "from": "node_modules/b",
+        },
       },
     },
   },

`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet from dependent > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.2.3",
    "edge": "{ ROOT prod a@1.x }",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.2.3",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
]
`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet from dependent > placements 2`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.2.3",
    "edge": "{ ROOT prod a@1.x }",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.2.3",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
]
`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet from dependent > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests peers with peerConflicted edges in peerSet from dependent > warnings 2`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests place a dep with an override > changes to tree 1`] = `
--- expected
+++ actual
@@ -15,8 +15,30 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "foo" => ArboristNode {
+      "name": "foo",
+      "version": "1.0.0",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "overrides": Map {
+        "bar" => "2",
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests place a dep with an override > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@1.0.0",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
]
`

exports[`test/place-dep.js TAP placement tests place a dep with an override > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests place a link dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,8 +12,7 @@
       "type": "prod",
       "name": "x",
       "spec": "file:x",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/x",
     },
   },
   "fsChildren": Set {
@@ -28,4 +27,29 @@
       "peer": true,
     },
   },
+  "children": Map {
+    "x" => ArboristLink {
+      "name": "x",
+      "version": "1.2.3",
+      "location": "node_modules/x",
+      "path": "/some/path/node_modules/x",
+      "realpath": "/some/path/x",
+      "resolved": "file:../x",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "x",
+          "spec": "file:x",
+          "from": "",
+        },
+      },
+      "target": ArboristNode {
+        "location": "x",
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP placement tests place a link dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "x@1.2.3",
    "edge": "{ ROOT prod x@file:x }",
    "placed": "node_modules/x",
  },
]
`

exports[`test/place-dep.js TAP placement tests place a link dep > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests prefer to dedupe rather than nest > changes to tree 1`] = `
--- expected
+++ actual
@@ -24,7 +24,7 @@
   "children": Map {
     "bar" => ArboristNode {
       "name": "bar",
-      "version": "1.0.1",
+      "version": "1.0.0",
       "location": "node_modules/bar",
       "path": "/some/path/node_modules/bar",
       "extraneous": true,
@@ -35,15 +35,14 @@
         EdgeIn {
           "type": "prod",
           "name": "bar",
-          "spec": "1",
-          "from": "node_modules/foo",
+          "spec": "1.0.0",
+          "from": "node_modules/baz",
         },
         EdgeIn {
           "type": "prod",
           "name": "bar",
-          "spec": "1.0.0",
-          "error": "INVALID",
-          "from": "node_modules/baz",
+          "spec": "1",
+          "from": "node_modules/foo",
         },
       },
     },
@@ -62,7 +61,6 @@
           "name": "bar",
           "spec": "1.0.0",
           "to": "node_modules/bar",
-          "error": "INVALID",
         },
       },
       "edgesIn": Set {

`

exports[`test/place-dep.js TAP placement tests prefer to dedupe rather than nest > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "node_modules/baz" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/baz prod bar@1.0.0 }",
    "placed": "node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP placement tests prefer to dedupe rather than nest > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, force, end of first step > changes to tree 1`] = `
--- expected
+++ actual
@@ -52,6 +52,7 @@
           "name": "a",
           "spec": "2",
           "error": "INVALID",
+          "peerConflicted": true,
           "from": "node_modules/e",
         },
       },
@@ -156,6 +157,7 @@
           "name": "a",
           "spec": "2",
           "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/a",
         },
       },

`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, force, end of first step > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "a@2.0.0",
    "edge": "{ node_modules/e peer a@2 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, force, end of first step > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "location": "/some/path",
            },
            "name": "a",
            "spec": "1",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/a",
        "name": "a",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "b",
                                    "spec": "2",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/b",
                                "name": "b",
                                "version": "2.0.0",
                              },
                              "name": "c",
                              "spec": "2",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/c",
                          "name": "c",
                          "version": "2.0.0",
                        },
                        "name": "d",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/d",
                    "name": "d",
                    "version": "2.0.0",
                  },
                  "name": "e",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/e",
              "name": "e",
              "version": "2.0.0",
            },
            "name": "a",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/a",
        "name": "a",
        "version": "2.0.0",
        "whileInstalling": Object {
          "name": "e",
          "path": "/some/path/node_modules/e",
          "version": "2.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "location": "/some/path",
                                },
                                "name": "b",
                                "spec": "2",
                                "type": "prod",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/b",
                            "name": "b",
                            "version": "2.0.0",
                          },
                          "name": "c",
                          "spec": "2",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/c",
                      "name": "c",
                      "version": "2.0.0",
                    },
                    "name": "d",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/d",
                "name": "d",
                "version": "2.0.0",
              },
              "name": "e",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/e",
          "name": "e",
          "version": "2.0.0",
        },
        "name": "a",
        "spec": "2",
        "type": "peer",
      },
      "force": true,
      "isMine": true,
      "peerConflict": Object {
        "current": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "1",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "1.0.0",
        },
        "peer": Object {
          "dependents": Array [
            Object {
              "error": "INVALID",
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "dependents": Array [
                                    Object {
                                      "from": Object {
                                        "location": "/some/path",
                                      },
                                      "name": "b",
                                      "spec": "2",
                                      "type": "prod",
                                    },
                                  ],
                                  "isWorkspace": false,
                                  "location": "node_modules/b",
                                  "name": "b",
                                  "version": "2.0.0",
                                },
                                "name": "c",
                                "spec": "2",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/c",
                            "name": "c",
                            "version": "2.0.0",
                          },
                          "name": "d",
                          "spec": "2",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/d",
                      "name": "d",
                      "version": "2.0.0",
                    },
                    "name": "e",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/e",
                "name": "e",
                "version": "2.0.0",
              },
              "name": "a",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "2.0.0",
          "whileInstalling": Object {
            "name": "e",
            "path": "/some/path/node_modules/e",
            "version": "2.0.0",
          },
        },
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, newer > thrown error 1`] = `
Error: could not resolve {
  "code": "ERESOLVE",
  "current": Object {
    "dependents": Array [
      Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "name": "b",
                                  "version": "1.0.0",
                                },
                                "name": "c",
                                "spec": "1",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/c",
                            "name": "c",
                            "version": "1.0.0",
                          },
                          "name": "d",
                          "spec": "1",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/d",
                      "name": "d",
                      "version": "1.0.0",
                    },
                    "name": "e",
                    "spec": "1",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/e",
                "name": "e",
                "version": "1.0.0",
              },
              "name": "a",
              "spec": "1",
              "type": "peer",
            },
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "1",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "1.0.0",
        },
        "name": "b",
        "spec": "1",
        "type": "peer",
      },
      Object {
        "error": "INVALID",
        "from": Object {
          "location": "/some/path",
        },
        "name": "b",
        "spec": "2",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/b",
    "name": "b",
    "version": "1.0.0",
  },
  "dep": Object {
    "dependents": Array [
      Object {
        "error": "INVALID",
        "from": Object {
          "location": "/some/path",
        },
        "name": "b",
        "spec": "2",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/b",
    "name": "b",
    "version": "2.0.0",
    "whileInstalling": Object {
      "name": undefined,
      "path": "/some/path",
      "version": undefined,
    },
  },
  "edge": Object {
    "error": "INVALID",
    "from": Object {
      "location": "/some/path",
    },
    "name": "b",
    "spec": "2",
    "type": "prod",
  },
  "force": false,
  "isMine": true,
  "name": "Error",
  "peerConflict": Object {
    "current": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "name": "b",
            "version": "1.0.0",
          },
          "name": "c",
          "spec": "1",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "1.0.0",
    },
    "peer": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "error": "INVALID",
                "from": Object {
                  "location": "/some/path",
                },
                "name": "b",
                "spec": "2",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/b",
            "name": "b",
            "version": "2.0.0",
            "whileInstalling": Object {
              "name": undefined,
              "path": "/some/path",
              "version": undefined,
            },
          },
          "name": "c",
          "spec": "2",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "2.0.0",
      "whileInstalling": Object {
        "name": undefined,
        "path": "/some/path",
        "version": undefined,
      },
    },
  },
  "strictPeerDeps": false,
}
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, newer, force > changes to tree 1`] = `
--- expected
+++ actual
@@ -19,7 +19,6 @@
       "name": "b",
       "spec": "2",
       "to": "node_modules/b",
-      "error": "INVALID",
     },
   },
   "children": Map {
@@ -37,6 +36,8 @@
           "type": "peer",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/b",
         },
       },
@@ -47,17 +48,11 @@
           "spec": "1",
           "from": "",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "a",
-          "spec": "1",
-          "from": "node_modules/e",
-        },
       },
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -68,8 +63,9 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "1",
-          "to": "node_modules/c",
+          "spec": "2",
+          "error": "MISSING",
+          "to": null,
         },
       },
       "edgesIn": Set {
@@ -77,94 +73,17 @@
           "type": "prod",
           "name": "b",
           "spec": "2",
-          "error": "INVALID",
           "from": "",
         },
         EdgeIn {
           "type": "peer",
           "name": "b",
           "spec": "1",
+          "error": "INVALID",
+          "peerConflicted": true,
           "from": "node_modules/a",
         },
       },
     },
-    "c" => ArboristNode {
-      "name": "c",
-      "version": "1.0.0",
-      "location": "node_modules/c",
-      "path": "/some/path/node_modules/c",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "d" => EdgeOut {
-          "type": "peer",
-          "name": "d",
-          "spec": "1",
-          "to": "node_modules/d",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "peer",
-          "name": "c",
-          "spec": "1",
-          "from": "node_modules/b",
-        },
-      },
-    },
-    "d" => ArboristNode {
-      "name": "d",
-      "version": "1.0.0",
-      "location": "node_modules/d",
-      "path": "/some/path/node_modules/d",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "e" => EdgeOut {
-          "type": "peer",
-          "name": "e",
-          "spec": "1",
-          "to": "node_modules/e",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "peer",
-          "name": "d",
-          "spec": "1",
-          "from": "node_modules/c",
-        },
-      },
-    },
-    "e" => ArboristNode {
-      "name": "e",
-      "version": "1.0.0",
-      "location": "node_modules/e",
-      "path": "/some/path/node_modules/e",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "a" => EdgeOut {
-          "type": "peer",
-          "name": "a",
-          "spec": "1",
-          "to": "node_modules/a",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "peer",
-          "name": "e",
-          "spec": "1",
-          "from": "node_modules/d",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, newer, force > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@2.0.0",
    "edge": "{ ROOT prod b@2 }",
    "placed": "node_modules/b",
  },
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, newer, force > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "name": "b",
                                      "version": "1.0.0",
                                    },
                                    "name": "c",
                                    "spec": "1",
                                    "type": "peer",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/c",
                                "name": "c",
                                "version": "1.0.0",
                              },
                              "name": "d",
                              "spec": "1",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/d",
                          "name": "d",
                          "version": "1.0.0",
                        },
                        "name": "e",
                        "spec": "1",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/e",
                    "name": "e",
                    "version": "1.0.0",
                  },
                  "name": "a",
                  "spec": "1",
                  "type": "peer",
                },
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "a",
                  "spec": "1",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/a",
              "name": "a",
              "version": "1.0.0",
            },
            "name": "b",
            "spec": "1",
            "type": "peer",
          },
          Object {
            "error": "INVALID",
            "from": Object {
              "location": "/some/path",
            },
            "name": "b",
            "spec": "2",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "location": "/some/path",
            },
            "name": "b",
            "spec": "2",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "2.0.0",
        "whileInstalling": Object {
          "name": undefined,
          "path": "/some/path",
          "version": undefined,
        },
      },
      "edge": Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "name": "b",
                                  "version": "1.0.0",
                                },
                                "name": "c",
                                "spec": "1",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/c",
                            "name": "c",
                            "version": "1.0.0",
                          },
                          "name": "d",
                          "spec": "1",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/d",
                      "name": "d",
                      "version": "1.0.0",
                    },
                    "name": "e",
                    "spec": "1",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/e",
                "name": "e",
                "version": "1.0.0",
              },
              "name": "a",
              "spec": "1",
              "type": "peer",
            },
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "1",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "1.0.0",
        },
        "name": "b",
        "spec": "1",
        "type": "peer",
      },
      "force": true,
      "isMine": true,
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, newer, legacyPeerDeps > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, newer, legacyPeerDeps > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {},
    "dep": "b@2.0.0",
    "edge": "{ ROOT prod b@2 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, newer, legacyPeerDeps > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older > thrown error 1`] = `
Error: could not resolve {
  "code": "ERESOLVE",
  "current": Object {
    "dependents": Array [
      Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "name": "b",
                                  "version": "2.0.0",
                                },
                                "name": "c",
                                "spec": "2",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/c",
                            "name": "c",
                            "version": "2.0.0",
                          },
                          "name": "d",
                          "spec": "2",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/d",
                      "name": "d",
                      "version": "2.0.0",
                    },
                    "name": "e",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/e",
                "name": "e",
                "version": "2.0.0",
              },
              "name": "a",
              "spec": "2",
              "type": "peer",
            },
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "2",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "2.0.0",
        },
        "name": "b",
        "spec": "2",
        "type": "peer",
      },
      Object {
        "error": "INVALID",
        "from": Object {
          "location": "/some/path",
        },
        "name": "b",
        "spec": "1",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/b",
    "name": "b",
    "version": "2.0.0",
  },
  "dep": Object {
    "dependents": Array [
      Object {
        "error": "INVALID",
        "from": Object {
          "location": "/some/path",
        },
        "name": "b",
        "spec": "1",
        "type": "prod",
      },
    ],
    "isWorkspace": false,
    "location": "node_modules/b",
    "name": "b",
    "version": "1.0.0",
    "whileInstalling": Object {
      "name": undefined,
      "path": "/some/path",
      "version": undefined,
    },
  },
  "edge": Object {
    "error": "INVALID",
    "from": Object {
      "location": "/some/path",
    },
    "name": "b",
    "spec": "1",
    "type": "prod",
  },
  "force": false,
  "isMine": true,
  "name": "Error",
  "peerConflict": Object {
    "current": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "name": "b",
            "version": "2.0.0",
          },
          "name": "c",
          "spec": "2",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "2.0.0",
    },
    "peer": Object {
      "dependents": Array [
        Object {
          "from": Object {
            "dependents": Array [
              Object {
                "error": "INVALID",
                "from": Object {
                  "location": "/some/path",
                },
                "name": "b",
                "spec": "1",
                "type": "prod",
              },
            ],
            "isWorkspace": false,
            "location": "node_modules/b",
            "name": "b",
            "version": "1.0.0",
            "whileInstalling": Object {
              "name": undefined,
              "path": "/some/path",
              "version": undefined,
            },
          },
          "name": "c",
          "spec": "1",
          "type": "peer",
        },
      ],
      "isWorkspace": false,
      "location": "node_modules/c",
      "name": "c",
      "version": "1.0.0",
      "whileInstalling": Object {
        "name": undefined,
        "path": "/some/path",
        "version": undefined,
      },
    },
  },
  "strictPeerDeps": false,
}
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, force > changes to tree 1`] = `
--- expected
+++ actual
@@ -19,7 +19,6 @@
       "name": "b",
       "spec": "1",
       "to": "node_modules/b",
-      "error": "INVALID",
     },
   },
   "children": Map {
@@ -37,6 +36,8 @@
           "type": "peer",
           "name": "b",
           "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/b",
         },
       },
@@ -47,17 +48,11 @@
           "spec": "2",
           "from": "",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "a",
-          "spec": "2",
-          "from": "node_modules/e",
-        },
       },
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -68,8 +63,9 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "2",
-          "to": "node_modules/c",
+          "spec": "1",
+          "error": "MISSING",
+          "to": null,
         },
       },
       "edgesIn": Set {
@@ -77,94 +73,17 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
-          "error": "INVALID",
           "from": "",
         },
         EdgeIn {
           "type": "peer",
           "name": "b",
           "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
           "from": "node_modules/a",
         },
       },
     },
-    "c" => ArboristNode {
-      "name": "c",
-      "version": "2.0.0",
-      "location": "node_modules/c",
-      "path": "/some/path/node_modules/c",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "d" => EdgeOut {
-          "type": "peer",
-          "name": "d",
-          "spec": "2",
-          "to": "node_modules/d",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "peer",
-          "name": "c",
-          "spec": "2",
-          "from": "node_modules/b",
-        },
-      },
-    },
-    "d" => ArboristNode {
-      "name": "d",
-      "version": "2.0.0",
-      "location": "node_modules/d",
-      "path": "/some/path/node_modules/d",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "e" => EdgeOut {
-          "type": "peer",
-          "name": "e",
-          "spec": "2",
-          "to": "node_modules/e",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "peer",
-          "name": "d",
-          "spec": "2",
-          "from": "node_modules/c",
-        },
-      },
-    },
-    "e" => ArboristNode {
-      "name": "e",
-      "version": "2.0.0",
-      "location": "node_modules/e",
-      "path": "/some/path/node_modules/e",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "a" => EdgeOut {
-          "type": "peer",
-          "name": "a",
-          "spec": "2",
-          "to": "node_modules/a",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "peer",
-          "name": "e",
-          "spec": "2",
-          "from": "node_modules/d",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, force > changes to tree 2`] = `
--- expected
+++ actual
@@ -19,7 +19,6 @@
       "name": "b",
       "spec": "1",
       "to": "node_modules/b",
-      "error": "INVALID",
     },
   },
   "children": Map {
@@ -37,6 +36,8 @@
           "type": "peer",
           "name": "b",
           "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/b",
         },
       },
@@ -50,14 +51,16 @@
         EdgeIn {
           "type": "peer",
           "name": "a",
-          "spec": "2",
+          "spec": "1",
+          "error": "INVALID",
+          "peerConflicted": true,
           "from": "node_modules/e",
         },
       },
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -68,7 +71,7 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/c",
         },
       },
@@ -77,20 +80,21 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
-          "error": "INVALID",
           "from": "",
         },
         EdgeIn {
           "type": "peer",
           "name": "b",
           "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
           "from": "node_modules/a",
         },
       },
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -101,7 +105,7 @@
         "d" => EdgeOut {
           "type": "peer",
           "name": "d",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/d",
         },
       },
@@ -109,14 +113,14 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/b",
         },
       },
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -127,7 +131,7 @@
         "e" => EdgeOut {
           "type": "peer",
           "name": "e",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/e",
         },
       },
@@ -135,14 +139,14 @@
         EdgeIn {
           "type": "peer",
           "name": "d",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/c",
         },
       },
     },
     "e" => ArboristNode {
       "name": "e",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/e",
       "path": "/some/path/node_modules/e",
       "extraneous": true,
@@ -153,7 +157,9 @@
         "a" => EdgeOut {
           "type": "peer",
           "name": "a",
-          "spec": "2",
+          "spec": "1",
+          "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/a",
         },
       },
@@ -161,7 +167,7 @@
         EdgeIn {
           "type": "peer",
           "name": "e",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/d",
         },
       },

`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, force > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@1.0.0",
    "edge": "{ ROOT prod b@1 }",
    "placed": "node_modules/b",
  },
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, force > placements 2`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(REPLACE),
      ],
    },
    "dep": "b@1.0.0",
    "edge": "{ ROOT prod b@1 }",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(REPLACE),
      ],
    },
    "dep": "c@1.0.0",
    "edge": "{ node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(REPLACE),
      ],
    },
    "dep": "d@1.0.0",
    "edge": "{ node_modules/c peer d@1 }",
    "parent": "c",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(REPLACE),
      ],
    },
    "dep": "e@1.0.0",
    "edge": "{ node_modules/d peer e@1 }",
    "parent": "d",
    "placed": "node_modules/e",
  },
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(REPLACE),
      ],
    },
    "dep": "a@1.0.0",
    "edge": "{ node_modules/e peer a@1 }",
    "parent": "e",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, force > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "name": "b",
                                      "version": "2.0.0",
                                    },
                                    "name": "c",
                                    "spec": "2",
                                    "type": "peer",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/c",
                                "name": "c",
                                "version": "2.0.0",
                              },
                              "name": "d",
                              "spec": "2",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/d",
                          "name": "d",
                          "version": "2.0.0",
                        },
                        "name": "e",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/e",
                    "name": "e",
                    "version": "2.0.0",
                  },
                  "name": "a",
                  "spec": "2",
                  "type": "peer",
                },
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "a",
                  "spec": "2",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/a",
              "name": "a",
              "version": "2.0.0",
            },
            "name": "b",
            "spec": "2",
            "type": "peer",
          },
          Object {
            "error": "INVALID",
            "from": Object {
              "location": "/some/path",
            },
            "name": "b",
            "spec": "1",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "2.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "location": "/some/path",
            },
            "name": "b",
            "spec": "1",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": undefined,
          "path": "/some/path",
          "version": undefined,
        },
      },
      "edge": Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "name": "b",
                                  "version": "2.0.0",
                                },
                                "name": "c",
                                "spec": "2",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/c",
                            "name": "c",
                            "version": "2.0.0",
                          },
                          "name": "d",
                          "spec": "2",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/d",
                      "name": "d",
                      "version": "2.0.0",
                    },
                    "name": "e",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/e",
                "name": "e",
                "version": "2.0.0",
              },
              "name": "a",
              "spec": "2",
              "type": "peer",
            },
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "2",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "2.0.0",
        },
        "name": "b",
        "spec": "2",
        "type": "peer",
      },
      "force": true,
      "isMine": true,
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, force > warnings 2`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "name": "a",
              "version": "2.0.0",
            },
            "name": "b",
            "spec": "2",
            "type": "peer",
          },
          Object {
            "error": "INVALID",
            "from": Object {
              "location": "/some/path",
            },
            "name": "b",
            "spec": "1",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "2.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "dependents": Array [
                                        Object {
                                          "from": Object {
                                            "name": "a",
                                            "version": "2.0.0",
                                          },
                                          "name": "b",
                                          "spec": "2",
                                          "type": "peer",
                                        },
                                        Object {
                                          "error": "INVALID",
                                          "from": Object {
                                            "location": "/some/path",
                                          },
                                          "name": "b",
                                          "spec": "1",
                                          "type": "prod",
                                        },
                                      ],
                                      "isWorkspace": false,
                                      "location": "node_modules/b",
                                      "name": "b",
                                      "version": "2.0.0",
                                    },
                                    "name": "c",
                                    "spec": "2",
                                    "type": "peer",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/c",
                                "name": "c",
                                "version": "2.0.0",
                              },
                              "name": "d",
                              "spec": "2",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/d",
                          "name": "d",
                          "version": "2.0.0",
                        },
                        "name": "e",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/e",
                    "name": "e",
                    "version": "2.0.0",
                  },
                  "name": "a",
                  "spec": "2",
                  "type": "peer",
                },
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "a",
                  "spec": "2",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/a",
              "name": "a",
              "version": "2.0.0",
            },
            "name": "b",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/b",
        "name": "b",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": undefined,
          "path": "/some/path",
          "version": undefined,
        },
      },
      "edge": Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "dependents": Array [
                                    Object {
                                      "from": Object {
                                        "name": "a",
                                        "version": "2.0.0",
                                      },
                                      "name": "b",
                                      "spec": "2",
                                      "type": "peer",
                                    },
                                    Object {
                                      "error": "INVALID",
                                      "from": Object {
                                        "location": "/some/path",
                                      },
                                      "name": "b",
                                      "spec": "1",
                                      "type": "prod",
                                    },
                                  ],
                                  "isWorkspace": false,
                                  "location": "node_modules/b",
                                  "name": "b",
                                  "version": "2.0.0",
                                },
                                "name": "c",
                                "spec": "2",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/c",
                            "name": "c",
                            "version": "2.0.0",
                          },
                          "name": "d",
                          "spec": "2",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/d",
                      "name": "d",
                      "version": "2.0.0",
                    },
                    "name": "e",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/e",
                "name": "e",
                "version": "2.0.0",
              },
              "name": "a",
              "spec": "2",
              "type": "peer",
            },
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "a",
              "spec": "2",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a",
          "name": "a",
          "version": "2.0.0",
        },
        "name": "b",
        "spec": "2",
        "type": "peer",
      },
      "force": true,
      "isMine": true,
      "peerConflict": Object {
        "current": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "name": "a",
                      "version": "2.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "peer",
                  },
                  Object {
                    "error": "INVALID",
                    "from": Object {
                      "location": "/some/path",
                    },
                    "name": "b",
                    "spec": "1",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b",
                "name": "b",
                "version": "2.0.0",
              },
              "name": "c",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/c",
          "name": "c",
          "version": "2.0.0",
        },
        "peer": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "dependents": Array [
                                    Object {
                                      "from": Object {
                                        "dependents": Array [
                                          Object {
                                            "from": Object {
                                              "dependents": Array [
                                                Object {
                                                  "from": Object {
                                                    "name": "a",
                                                    "version": "2.0.0",
                                                  },
                                                  "name": "b",
                                                  "spec": "2",
                                                  "type": "peer",
                                                },
                                                Object {
                                                  "error": "INVALID",
                                                  "from": Object {
                                                    "location": "/some/path",
                                                  },
                                                  "name": "b",
                                                  "spec": "1",
                                                  "type": "prod",
                                                },
                                              ],
                                              "isWorkspace": false,
                                              "location": "node_modules/b",
                                              "name": "b",
                                              "version": "2.0.0",
                                            },
                                            "name": "c",
                                            "spec": "2",
                                            "type": "peer",
                                          },
                                        ],
                                        "isWorkspace": false,
                                        "location": "node_modules/c",
                                        "name": "c",
                                        "version": "2.0.0",
                                      },
                                      "name": "d",
                                      "spec": "2",
                                      "type": "peer",
                                    },
                                  ],
                                  "isWorkspace": false,
                                  "location": "node_modules/d",
                                  "name": "d",
                                  "version": "2.0.0",
                                },
                                "name": "e",
                                "spec": "2",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/e",
                            "name": "e",
                            "version": "2.0.0",
                          },
                          "name": "a",
                          "spec": "2",
                          "type": "peer",
                        },
                        Object {
                          "from": Object {
                            "location": "/some/path",
                          },
                          "name": "a",
                          "spec": "2",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/a",
                      "name": "a",
                      "version": "2.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b",
                "name": "b",
                "version": "1.0.0",
                "whileInstalling": Object {
                  "name": undefined,
                  "path": "/some/path",
                  "version": undefined,
                },
              },
              "name": "c",
              "spec": "1",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/c",
          "name": "c",
          "version": "1.0.0",
          "whileInstalling": Object {
            "name": undefined,
            "path": "/some/path",
            "version": undefined,
          },
        },
      },
      "strictPeerDeps": false,
    },
  ],
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "name": "a",
                                      "version": "2.0.0",
                                    },
                                    "name": "b",
                                    "spec": "2",
                                    "type": "peer",
                                  },
                                  Object {
                                    "error": "INVALID",
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "b",
                                    "spec": "1",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/b",
                                "name": "b",
                                "version": "2.0.0",
                              },
                              "name": "c",
                              "spec": "2",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/c",
                          "name": "c",
                          "version": "2.0.0",
                        },
                        "name": "d",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/d",
                    "name": "d",
                    "version": "2.0.0",
                  },
                  "name": "e",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/e",
              "name": "e",
              "version": "2.0.0",
            },
            "name": "a",
            "spec": "2",
            "type": "peer",
          },
          Object {
            "from": Object {
              "location": "/some/path",
            },
            "name": "a",
            "spec": "2",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/a",
        "name": "a",
        "version": "2.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "b",
                                    "spec": "1",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/b",
                                "name": "b",
                                "version": "1.0.0",
                              },
                              "name": "c",
                              "spec": "1",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/c",
                          "name": "c",
                          "version": "1.0.0",
                        },
                        "name": "d",
                        "spec": "1",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/d",
                    "name": "d",
                    "version": "1.0.0",
                  },
                  "name": "e",
                  "spec": "1",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/e",
              "name": "e",
              "version": "1.0.0",
            },
            "name": "a",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/a",
        "name": "a",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": undefined,
          "path": "/some/path",
          "version": undefined,
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "location": "/some/path",
                                },
                                "name": "b",
                                "spec": "1",
                                "type": "prod",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/b",
                            "name": "b",
                            "version": "1.0.0",
                          },
                          "name": "c",
                          "spec": "1",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/c",
                      "name": "c",
                      "version": "1.0.0",
                    },
                    "name": "d",
                    "spec": "1",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/d",
                "name": "d",
                "version": "1.0.0",
              },
              "name": "e",
              "spec": "1",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/e",
          "name": "e",
          "version": "1.0.0",
        },
        "name": "a",
        "spec": "1",
        "type": "peer",
      },
      "force": true,
      "isMine": true,
      "peerConflict": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "name": "a",
                                      "version": "2.0.0",
                                    },
                                    "name": "b",
                                    "spec": "2",
                                    "type": "peer",
                                  },
                                  Object {
                                    "error": "INVALID",
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "b",
                                    "spec": "1",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/b",
                                "name": "b",
                                "version": "2.0.0",
                              },
                              "name": "c",
                              "spec": "2",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/c",
                          "name": "c",
                          "version": "2.0.0",
                        },
                        "name": "d",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/d",
                    "name": "d",
                    "version": "2.0.0",
                  },
                  "name": "e",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/e",
              "name": "e",
              "version": "2.0.0",
            },
            "name": "a",
            "spec": "2",
            "type": "peer",
          },
          Object {
            "from": Object {
              "location": "/some/path",
            },
            "name": "a",
            "spec": "2",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/a",
        "name": "a",
        "version": "2.0.0",
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, legacyPeerDeps > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, legacyPeerDeps > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {},
    "dep": "b@1.0.0",
    "edge": "{ ROOT prod b@1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests prod dep directly on conflicted peer, older, legacyPeerDeps > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests prune competing peerSet that can be nested, 1 > changes to tree 1`] = `
--- expected
+++ actual
@@ -42,8 +42,7 @@
           "type": "prod",
           "name": "y",
           "spec": "*",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/a/node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -54,6 +53,36 @@
           "from": "",
         },
       },
+      "children": Map {
+        "y" => ArboristNode {
+          "name": "y",
+          "version": "1.0.0",
+          "location": "node_modules/a/node_modules/y",
+          "path": "/some/path/node_modules/a/node_modules/y",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesOut": Map {
+            "j" => EdgeOut {
+              "type": "peer",
+              "name": "j",
+              "spec": "2",
+              "error": "INVALID",
+              "peerConflicted": true,
+              "to": "node_modules/j",
+            },
+          },
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "y",
+              "spec": "*",
+              "from": "node_modules/a",
+            },
+          },
+        },
+      },
     },
     "j" => ArboristNode {
       "name": "j",
@@ -74,6 +103,14 @@
         EdgeIn {
           "type": "peer",
           "name": "j",
+          "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "node_modules/a/node_modules/y",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "j",
           "spec": "1",
           "from": "node_modules/x",
         },

`

exports[`test/place-dep.js TAP placement tests prune competing peerSet that can be nested, 1 > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/a" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "y@1.0.0",
    "edge": "{ node_modules/a prod y@ }",
    "placed": "node_modules/a/node_modules/y",
  },
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {
      "node_modules/a" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "j@2.0.0",
    "edge": "{ node_modules/a/node_modules/y peer j@2 }",
    "parent": "y",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests prune competing peerSet that can be nested, 1 > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "location": "/some/path",
                        },
                        "name": "a",
                        "spec": "",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "1.0.0",
                  },
                  "name": "y",
                  "spec": "",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/a/node_modules/y",
              "name": "y",
              "version": "1.0.0",
            },
            "name": "j",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/j",
        "name": "j",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "location": "/some/path",
                        },
                        "name": "a",
                        "spec": "",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "1.0.0",
                  },
                  "name": "y",
                  "spec": "",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/a/node_modules/y",
              "name": "y",
              "version": "1.0.0",
            },
            "name": "j",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/j",
        "name": "j",
        "version": "2.0.0",
        "whileInstalling": Object {
          "name": "a",
          "path": "/some/path/node_modules/a",
          "version": "1.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "location": "/some/path",
                    },
                    "name": "a",
                    "spec": "",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/a",
                "name": "a",
                "version": "1.0.0",
              },
              "name": "y",
              "spec": "",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/a/node_modules/y",
          "name": "y",
          "version": "1.0.0",
        },
        "name": "j",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": false,
      "peerConflict": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "location": "/some/path",
                        },
                        "name": "a",
                        "spec": "",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "1.0.0",
                  },
                  "name": "y",
                  "spec": "",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/a/node_modules/y",
              "name": "y",
              "version": "1.0.0",
            },
            "name": "j",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/j",
        "name": "j",
        "version": "1.0.0",
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests prune competing peerSet that can be nested, 2 > changes to tree 1`] = `
--- expected
+++ actual
@@ -30,13 +30,15 @@
           "type": "prod",
           "name": "j",
           "spec": "1",
+          "error": "INVALID",
           "to": "node_modules/j",
         },
         "x" => EdgeOut {
           "type": "prod",
           "name": "x",
           "spec": "*",
-          "to": "node_modules/x",
+          "error": "MISSING",
+          "to": null,
         },
         "y" => EdgeOut {
           "type": "prod",
@@ -56,7 +58,7 @@
     },
     "j" => ArboristNode {
       "name": "j",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/j",
       "path": "/some/path/node_modules/j",
       "extraneous": true,
@@ -68,19 +70,13 @@
           "type": "prod",
           "name": "j",
           "spec": "1",
+          "error": "INVALID",
           "from": "node_modules/a",
         },
         EdgeIn {
           "type": "peer",
           "name": "j",
-          "spec": "1",
-          "from": "node_modules/x",
-        },
-        EdgeIn {
-          "type": "peer",
-          "name": "j",
           "spec": "2",
-          "error": "INVALID",
           "from": "node_modules/y",
         },
       },
@@ -100,7 +96,6 @@
           "name": "j",
           "spec": "2",
           "to": "node_modules/j",
-          "error": "INVALID",
         },
       },
       "edgesIn": Set {
@@ -112,31 +107,5 @@
         },
       },
     },
-    "x" => ArboristNode {
-      "name": "x",
-      "version": "1.0.0",
-      "location": "node_modules/x",
-      "path": "/some/path/node_modules/x",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "j" => EdgeOut {
-          "type": "peer",
-          "name": "j",
-          "spec": "1",
-          "to": "node_modules/j",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "x",
-          "spec": "*",
-          "from": "node_modules/a",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests prune competing peerSet that can be nested, 2 > must match snapshot 1`] = `
Array [
  "node_modules/a 1.0.0",
]
`

exports[`test/place-dep.js TAP placement tests prune competing peerSet that can be nested, 2 > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "j@2.0.0",
    "edge": "{ node_modules/y peer j@2 }",
    "placed": "node_modules/j",
  },
]
`

exports[`test/place-dep.js TAP placement tests prune competing peerSet that can be nested, 2 > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests replace higher up, and dedupe descendants > changes to tree 1`] = `
--- expected
+++ actual
@@ -47,55 +47,9 @@
           "type": "prod",
           "name": "y",
           "spec": "1.2",
-          "to": "k/node_modules/y",
+          "to": "node_modules/y",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.2.0",
-          "location": "k/node_modules/y",
-          "path": "/some/path/k/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesOut": Map {
-            "z" => EdgeOut {
-              "type": "prod",
-              "name": "z",
-              "spec": "1",
-              "to": "k/node_modules/z",
-            },
-          },
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1.2",
-              "from": "k",
-            },
-          },
-        },
-        "z" => ArboristNode {
-          "name": "z",
-          "version": "1.0.0",
-          "location": "k/node_modules/z",
-          "path": "/some/path/k/node_modules/z",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "z",
-              "spec": "1",
-              "from": "k/node_modules/y",
-            },
-          },
-        },
-      },
     },
   },
   "children": Map {
@@ -212,7 +166,7 @@
           "type": "prod",
           "name": "y",
           "spec": "1.2",
-          "to": "node_modules/x/node_modules/y",
+          "to": "node_modules/y",
         },
         "z" => EdgeOut {
           "type": "prod",
@@ -229,58 +183,10 @@
           "from": "",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.2.0",
-          "location": "node_modules/x/node_modules/y",
-          "path": "/some/path/node_modules/x/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesOut": Map {
-            "z" => EdgeOut {
-              "type": "prod",
-              "name": "z",
-              "spec": "1",
-              "to": "node_modules/x/node_modules/y/node_modules/z",
-            },
-          },
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1.2",
-              "from": "node_modules/x",
-            },
-          },
-          "children": Map {
-            "z" => ArboristNode {
-              "name": "z",
-              "version": "1.0.0",
-              "location": "node_modules/x/node_modules/y/node_modules/z",
-              "path": "/some/path/node_modules/x/node_modules/y/node_modules/z",
-              "extraneous": true,
-              "dev": true,
-              "optional": true,
-              "peer": true,
-              "edgesIn": Set {
-                EdgeIn {
-                  "type": "prod",
-                  "name": "z",
-                  "spec": "1",
-                  "from": "node_modules/x/node_modules/y",
-                },
-              },
-            },
-          },
-        },
-      },
     },
     "y" => ArboristNode {
       "name": "y",
-      "version": "1.1.0",
+      "version": "1.2.2",
       "location": "node_modules/y",
       "path": "/some/path/node_modules/y",
       "extraneous": true,
@@ -294,12 +200,6 @@
           "spec": "1",
           "to": "node_modules/y/node_modules/z",
         },
-        "f" => EdgeOut {
-          "type": "prod",
-          "name": "f",
-          "spec": "*",
-          "to": "node_modules/f",
-        },
       },
       "edgesIn": Set {
         EdgeIn {
@@ -308,6 +208,18 @@
           "spec": "1",
           "from": "",
         },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1.2",
+          "from": "k",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1.2",
+          "from": "node_modules/x",
+        },
       },
       "children": Map {
         "z" => ArboristNode {
@@ -354,49 +266,5 @@
         },
       },
     },
-    "f" => ArboristNode {
-      "name": "f",
-      "version": "1.0.0",
-      "location": "node_modules/f",
-      "path": "/some/path/node_modules/f",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "g" => EdgeOut {
-          "type": "prod",
-          "name": "g",
-          "spec": "*",
-          "to": "node_modules/g",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "f",
-          "spec": "*",
-          "from": "node_modules/y",
-        },
-      },
-    },
-    "g" => ArboristNode {
-      "name": "g",
-      "version": "1.0.0",
-      "location": "node_modules/g",
-      "path": "/some/path/node_modules/g",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "g",
-          "spec": "*",
-          "from": "node_modules/f",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests replace higher up, and dedupe descendants > changes to tree 2`] = `
--- expected
+++ actual
@@ -24,7 +24,7 @@
   "children": Map {
     "a" => ArboristNode {
       "name": "a",
-      "version": "1.0.0",
+      "version": "1.1.1",
       "location": "node_modules/a",
       "path": "/some/path/node_modules/a",
       "extraneous": true,
@@ -42,9 +42,14 @@
           "type": "prod",
           "name": "a",
           "spec": "1.1",
-          "error": "INVALID",
           "from": "node_modules/b",
         },
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.1.1",
+          "from": "node_modules/b/c",
+        },
       },
     },
     "b" => ArboristNode {
@@ -62,7 +67,6 @@
           "name": "a",
           "spec": "1.1",
           "to": "node_modules/a",
-          "error": "INVALID",
         },
         "c" => EdgeOut {
           "type": "prod",
@@ -95,29 +99,9 @@
               "type": "prod",
               "name": "a",
               "spec": "1.1.1",
-              "to": "node_modules/b/c/node_modules/a",
+              "to": "node_modules/a",
             },
           },
-          "children": Map {
-            "a" => ArboristNode {
-              "name": "a",
-              "version": "1.1.1",
-              "location": "node_modules/b/c/node_modules/a",
-              "path": "/some/path/node_modules/b/c/node_modules/a",
-              "extraneous": true,
-              "dev": true,
-              "optional": true,
-              "peer": true,
-              "edgesIn": Set {
-                EdgeIn {
-                  "type": "prod",
-                  "name": "a",
-                  "spec": "1.1.1",
-                  "from": "node_modules/b/c",
-                },
-              },
-            },
-          },
         },
       },
     },

`

exports[`test/place-dep.js TAP placement tests replace higher up, and dedupe descendants > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "node_modules/x" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "y@1.2.2",
    "edge": "{ node_modules/x prod y@1.2 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests replace higher up, and dedupe descendants > placements 2`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "node_modules/b" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "a@1.1.1",
    "edge": "{ node_modules/b prod a@1.1 }",
    "placed": "node_modules/a",
  },
]
`

exports[`test/place-dep.js TAP placement tests replace higher up, and dedupe descendants > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests replace higher up, and dedupe descendants > warnings 2`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests replace peer set of non-root dep already in root, step 2 > changes to tree 1`] = `
--- expected
+++ actual
@@ -36,12 +36,14 @@
           "type": "prod",
           "name": "b",
           "spec": "1",
-          "to": "node_modules/b",
+          "error": "MISSING",
+          "to": null,
         },
         "y" => EdgeOut {
           "type": "prod",
           "name": "y",
           "spec": "1",
+          "error": "INVALID",
           "to": "node_modules/y",
         },
       },
@@ -101,7 +103,6 @@
           "name": "y",
           "spec": "2",
           "to": "node_modules/y",
-          "error": "INVALID",
         },
       },
       "edgesIn": Set {
@@ -128,7 +129,6 @@
           "name": "y",
           "spec": "2",
           "to": "node_modules/y",
-          "error": "INVALID",
         },
       },
       "edgesIn": Set {
@@ -142,7 +142,7 @@
     },
     "y" => ArboristNode {
       "name": "y",
-      "version": "1.0.0",
+      "version": "2.0.0",
       "location": "node_modules/y",
       "path": "/some/path/node_modules/y",
       "extraneous": true,
@@ -154,55 +154,22 @@
           "type": "prod",
           "name": "y",
           "spec": "1",
+          "error": "INVALID",
           "from": "node_modules/a",
         },
         EdgeIn {
-          "type": "peer",
-          "name": "y",
-          "spec": "1",
-          "from": "node_modules/b",
-        },
-        EdgeIn {
           "type": "prod",
           "name": "y",
           "spec": "2",
-          "error": "INVALID",
           "from": "node_modules/l",
         },
         EdgeIn {
           "type": "peer",
           "name": "y",
           "spec": "2",
-          "error": "INVALID",
           "from": "node_modules/x",
         },
       },
     },
-    "b" => ArboristNode {
-      "name": "b",
-      "version": "1.0.0",
-      "location": "node_modules/b",
-      "path": "/some/path/node_modules/b",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "y" => EdgeOut {
-          "type": "peer",
-          "name": "y",
-          "spec": "1",
-          "to": "node_modules/y",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "b",
-          "spec": "1",
-          "from": "node_modules/a",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests replace peer set of non-root dep already in root, step 2 > must match snapshot 1`] = `
Array [
  "node_modules/a 1.0.0",
]
`

exports[`test/place-dep.js TAP placement tests replace peer set of non-root dep already in root, step 2 > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/x peer y@2 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests replace peer set of non-root dep already in root, step 2 > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests replacing existing peer set > changes to tree 1`] = `
--- expected
+++ actual
@@ -26,7 +26,7 @@
   "children": Map {
     "a" => ArboristNode {
       "name": "a",
-      "version": "1.0.1",
+      "version": "1.2.3",
       "location": "node_modules/a",
       "path": "/some/path/node_modules/a",
       "extraneous": true,
@@ -53,6 +53,7 @@
           "name": "a",
           "spec": "2",
           "error": "INVALID",
+          "peerConflicted": true,
           "from": "node_modules/c",
         },
       },
@@ -106,6 +107,7 @@
           "name": "a",
           "spec": "2",
           "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/a",
         },
         "b" => EdgeOut {

`

exports[`test/place-dep.js TAP placement tests replacing existing peer set > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "a@1.2.3",
    "edge": "{ ROOT prod a@1.x }",
    "placed": "node_modules/a",
  },
]
`

exports[`test/place-dep.js TAP placement tests replacing existing peer set > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "location": "/some/path",
            },
            "name": "a",
            "spec": "1.x",
            "type": "prod",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/a",
        "name": "a",
        "version": "1.0.1",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "c",
                  "spec": "2.x",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/c",
              "name": "c",
              "version": "2.0.1",
            },
            "name": "a",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/a",
        "name": "a",
        "version": "1.2.3",
        "whileInstalling": Object {
          "name": "project",
          "path": "/some/path",
          "version": "1.2.3",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "location": "/some/path",
              },
              "name": "c",
              "spec": "2.x",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/c",
          "name": "c",
          "version": "2.0.1",
        },
        "name": "a",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": true,
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests replacing overlapping peer sets > changes to tree 1`] = `
--- expected
+++ actual
@@ -18,14 +18,13 @@
       "type": "prod",
       "name": "y",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/y",
     },
   },
   "children": Map {
     "a" => ArboristNode {
       "name": "a",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/a",
       "path": "/some/path/node_modules/a",
       "extraneous": true,
@@ -36,7 +35,7 @@
         "b" => EdgeOut {
           "type": "peer",
           "name": "b",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/b",
         },
       },
@@ -44,20 +43,20 @@
         EdgeIn {
           "type": "peer",
           "name": "a",
-          "spec": "1||2",
-          "from": "node_modules/v",
+          "spec": "1",
+          "from": "node_modules/e",
         },
         EdgeIn {
           "type": "peer",
           "name": "a",
-          "spec": "2",
-          "from": "node_modules/e",
+          "spec": "1||2",
+          "from": "node_modules/v",
         },
       },
     },
     "b" => ArboristNode {
       "name": "b",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/b",
       "path": "/some/path/node_modules/b",
       "extraneous": true,
@@ -68,7 +67,7 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/c",
         },
       },
@@ -76,14 +75,14 @@
         EdgeIn {
           "type": "peer",
           "name": "b",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/a",
         },
       },
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -94,7 +93,7 @@
         "d" => EdgeOut {
           "type": "peer",
           "name": "d",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/d",
         },
       },
@@ -102,14 +101,14 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/b",
         },
       },
     },
     "d" => ArboristNode {
       "name": "d",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/d",
       "path": "/some/path/node_modules/d",
       "extraneous": true,
@@ -120,7 +119,7 @@
         "e" => EdgeOut {
           "type": "peer",
           "name": "e",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/e",
         },
       },
@@ -128,14 +127,20 @@
         EdgeIn {
           "type": "peer",
           "name": "d",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/c",
         },
+        EdgeIn {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "from": "node_modules/y",
+        },
       },
     },
     "e" => ArboristNode {
       "name": "e",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/e",
       "path": "/some/path/node_modules/e",
       "extraneous": true,
@@ -146,7 +151,7 @@
         "a" => EdgeOut {
           "type": "peer",
           "name": "a",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/a",
         },
       },
@@ -154,7 +159,7 @@
         EdgeIn {
           "type": "peer",
           "name": "e",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/d",
         },
       },
@@ -191,5 +196,31 @@
         },
       },
     },
+    "y" => ArboristNode {
+      "name": "y",
+      "version": "1.0.0",
+      "location": "node_modules/y",
+      "path": "/some/path/node_modules/y",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "d" => EdgeOut {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "to": "node_modules/d",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests replacing overlapping peer sets > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "y@1.0.0",
    "edge": "{ ROOT prod y@1 }",
    "placed": "node_modules/y",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "d@1.0.0",
    "edge": "{ node_modules/y peer d@1 }",
    "parent": "y",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "e@1.0.0",
    "edge": "{ node_modules/d peer e@1 }",
    "parent": "d",
    "placed": "node_modules/e",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.0.0",
    "edge": "{ node_modules/e peer a@1 }",
    "parent": "e",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.0.0",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@1.0.0",
    "edge": "{ node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests replacing overlapping peer sets > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "name": "c",
              "version": "2.0.0",
            },
            "name": "d",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/d",
        "name": "d",
        "version": "2.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "v",
                                    "spec": "4",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/v",
                                "name": "v",
                                "version": "4.0.0",
                              },
                              "name": "a",
                              "spec": "1||2",
                              "type": "peer",
                            },
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "dependents": Array [
                                        Object {
                                          "from": Object {
                                            "name": "c",
                                            "version": "2.0.0",
                                          },
                                          "name": "d",
                                          "spec": "2",
                                          "type": "peer",
                                        },
                                      ],
                                      "isWorkspace": false,
                                      "location": "node_modules/d",
                                      "name": "d",
                                      "version": "2.0.0",
                                    },
                                    "name": "e",
                                    "spec": "2",
                                    "type": "peer",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/e",
                                "name": "e",
                                "version": "2.0.0",
                              },
                              "name": "a",
                              "spec": "2",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/a",
                          "name": "a",
                          "version": "2.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "c",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/c",
              "name": "c",
              "version": "2.0.0",
            },
            "name": "d",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/d",
        "name": "d",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": undefined,
          "path": "/some/path",
          "version": undefined,
        },
      },
      "edge": Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "location": "/some/path",
                                },
                                "name": "v",
                                "spec": "4",
                                "type": "prod",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/v",
                            "name": "v",
                            "version": "4.0.0",
                          },
                          "name": "a",
                          "spec": "1||2",
                          "type": "peer",
                        },
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "dependents": Array [
                                    Object {
                                      "from": Object {
                                        "name": "c",
                                        "version": "2.0.0",
                                      },
                                      "name": "d",
                                      "spec": "2",
                                      "type": "peer",
                                    },
                                  ],
                                  "isWorkspace": false,
                                  "location": "node_modules/d",
                                  "name": "d",
                                  "version": "2.0.0",
                                },
                                "name": "e",
                                "spec": "2",
                                "type": "peer",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/e",
                            "name": "e",
                            "version": "2.0.0",
                          },
                          "name": "a",
                          "spec": "2",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/a",
                      "name": "a",
                      "version": "2.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b",
                "name": "b",
                "version": "2.0.0",
              },
              "name": "c",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/c",
          "name": "c",
          "version": "2.0.0",
        },
        "name": "d",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": true,
      "peerConflict": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "name": "c",
              "version": "2.0.0",
            },
            "name": "d",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/d",
        "name": "d",
        "version": "2.0.0",
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping divergent peer sets > changes to tree 1`] = `
--- expected
+++ actual
@@ -18,14 +18,13 @@
       "type": "prod",
       "name": "w",
       "spec": "*",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/w",
     },
   },
   "children": Map {
     "a" => ArboristNode {
       "name": "a",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/a",
       "path": "/some/path/node_modules/a",
       "extraneous": true,
@@ -36,14 +35,14 @@
         "c" => EdgeOut {
           "type": "peer",
           "name": "c",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/c",
         },
-        "e" => EdgeOut {
+        "d" => EdgeOut {
           "type": "peer",
-          "name": "e",
+          "name": "d",
           "spec": "1",
-          "to": "node_modules/e",
+          "to": "node_modules/d",
         },
       },
       "edgesIn": Set {
@@ -56,6 +55,12 @@
         EdgeIn {
           "type": "peer",
           "name": "a",
+          "spec": "1",
+          "from": "node_modules/w",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "a",
           "spec": "1||2",
           "from": "node_modules/y",
         },
@@ -63,7 +68,7 @@
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -74,11 +79,55 @@
         EdgeIn {
           "type": "peer",
           "name": "c",
-          "spec": "2",
+          "spec": "1",
           "from": "node_modules/a",
         },
       },
     },
+    "d" => ArboristNode {
+      "name": "d",
+      "version": "1.0.0",
+      "location": "node_modules/d",
+      "path": "/some/path/node_modules/d",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "from": "node_modules/a",
+        },
+      },
+    },
+    "j" => ArboristNode {
+      "name": "j",
+      "version": "1.0.0",
+      "location": "node_modules/j",
+      "path": "/some/path/node_modules/j",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "y" => EdgeOut {
+          "type": "peer",
+          "name": "y",
+          "spec": "1",
+          "to": "node_modules/y",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "j",
+          "spec": "1",
+          "from": "node_modules/w",
+        },
+      },
+    },
     "v" => ArboristNode {
       "name": "v",
       "version": "1.0.0",
@@ -111,6 +160,38 @@
         },
       },
     },
+    "w" => ArboristNode {
+      "name": "w",
+      "version": "1.0.0",
+      "location": "node_modules/w",
+      "path": "/some/path/node_modules/w",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "a" => EdgeOut {
+          "type": "peer",
+          "name": "a",
+          "spec": "1",
+          "to": "node_modules/a",
+        },
+        "j" => EdgeOut {
+          "type": "peer",
+          "name": "j",
+          "spec": "1",
+          "to": "node_modules/j",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "w",
+          "spec": "*",
+          "from": "",
+        },
+      },
+    },
     "x" => ArboristNode {
       "name": "x",
       "version": "1.0.0",
@@ -159,25 +240,13 @@
           "type": "peer",
           "name": "y",
           "spec": "1",
-          "from": "node_modules/x",
+          "from": "node_modules/j",
         },
-      },
-    },
-    "e" => ArboristNode {
-      "name": "e",
-      "version": "1.0.0",
-      "location": "node_modules/e",
-      "path": "/some/path/node_modules/e",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesIn": Set {
         EdgeIn {
           "type": "peer",
-          "name": "e",
+          "name": "y",
           "spec": "1",
-          "from": "node_modules/a",
+          "from": "node_modules/x",
         },
       },
     },

`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping divergent peer sets > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "w@1.0.0",
    "edge": "{ ROOT prod w@ }",
    "placed": "node_modules/w",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.0.0",
    "edge": "{ node_modules/w peer a@1 }",
    "parent": "w",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "j@1.0.0",
    "edge": "{ node_modules/w peer j@1 }",
    "parent": "w",
    "placed": "node_modules/j",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@1.0.0",
    "edge": "{ node_modules/a peer c@1 }",
    "parent": "a",
    "placed": "node_modules/c",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "d@1.0.0",
    "edge": "{ node_modules/a peer d@1 }",
    "parent": "a",
    "placed": "node_modules/d",
  },
]
`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping divergent peer sets > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping peer sets, subset > changes to tree 1`] = `
--- expected
+++ actual
@@ -18,8 +18,7 @@
       "type": "prod",
       "name": "y",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/y",
     },
   },
   "children": Map {
@@ -131,6 +130,13 @@
           "spec": "2",
           "from": "node_modules/c",
         },
+        EdgeIn {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "error": "INVALID",
+          "from": "node_modules/y",
+        },
       },
     },
     "e" => ArboristNode {
@@ -191,5 +197,32 @@
         },
       },
     },
+    "y" => ArboristNode {
+      "name": "y",
+      "version": "1.0.0",
+      "location": "node_modules/y",
+      "path": "/some/path/node_modules/y",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "d" => EdgeOut {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "error": "INVALID",
+          "to": "node_modules/d",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping peer sets, subset > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "y@1.0.0",
    "edge": "{ ROOT prod y@1 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping peer sets, subset > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping peer sets, superset > changes to tree 1`] = `
--- expected
+++ actual
@@ -18,14 +18,13 @@
       "type": "prod",
       "name": "y",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/y",
     },
   },
   "children": Map {
     "a" => ArboristNode {
       "name": "a",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/a",
       "path": "/some/path/node_modules/a",
       "extraneous": true,
@@ -33,31 +32,57 @@
       "optional": true,
       "peer": true,
       "edgesOut": Map {
-        "c" => EdgeOut {
+        "b" => EdgeOut {
           "type": "peer",
-          "name": "c",
-          "spec": "2",
-          "to": "node_modules/c",
+          "name": "b",
+          "spec": "1",
+          "to": "node_modules/b",
         },
       },
       "edgesIn": Set {
         EdgeIn {
           "type": "peer",
           "name": "a",
+          "spec": "1",
+          "from": "node_modules/e",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "a",
           "spec": "1||2",
           "from": "node_modules/v",
         },
+      },
+    },
+    "b" => ArboristNode {
+      "name": "b",
+      "version": "1.0.0",
+      "location": "node_modules/b",
+      "path": "/some/path/node_modules/b",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "c" => EdgeOut {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "to": "node_modules/c",
+        },
+      },
+      "edgesIn": Set {
         EdgeIn {
           "type": "peer",
-          "name": "a",
-          "spec": "2",
-          "from": "node_modules/e",
+          "name": "b",
+          "spec": "1",
+          "from": "node_modules/a",
         },
       },
     },
     "c" => ArboristNode {
       "name": "c",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/c",
       "path": "/some/path/node_modules/c",
       "extraneous": true,
@@ -65,25 +90,57 @@
       "optional": true,
       "peer": true,
       "edgesOut": Map {
+        "d" => EdgeOut {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "to": "node_modules/d",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "c",
+          "spec": "1",
+          "from": "node_modules/b",
+        },
+      },
+    },
+    "d" => ArboristNode {
+      "name": "d",
+      "version": "1.0.0",
+      "location": "node_modules/d",
+      "path": "/some/path/node_modules/d",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
         "e" => EdgeOut {
           "type": "peer",
           "name": "e",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/e",
         },
       },
       "edgesIn": Set {
         EdgeIn {
           "type": "peer",
-          "name": "c",
-          "spec": "2",
-          "from": "node_modules/a",
+          "name": "d",
+          "spec": "1",
+          "from": "node_modules/c",
         },
+        EdgeIn {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "from": "node_modules/y",
+        },
       },
     },
     "e" => ArboristNode {
       "name": "e",
-      "version": "2.0.0",
+      "version": "1.0.0",
       "location": "node_modules/e",
       "path": "/some/path/node_modules/e",
       "extraneous": true,
@@ -94,7 +151,7 @@
         "a" => EdgeOut {
           "type": "peer",
           "name": "a",
-          "spec": "2",
+          "spec": "1",
           "to": "node_modules/a",
         },
       },
@@ -102,8 +159,8 @@
         EdgeIn {
           "type": "peer",
           "name": "e",
-          "spec": "2",
-          "from": "node_modules/c",
+          "spec": "1",
+          "from": "node_modules/d",
         },
       },
     },
@@ -139,5 +196,31 @@
         },
       },
     },
+    "y" => ArboristNode {
+      "name": "y",
+      "version": "1.0.0",
+      "location": "node_modules/y",
+      "path": "/some/path/node_modules/y",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesOut": Map {
+        "d" => EdgeOut {
+          "type": "peer",
+          "name": "d",
+          "spec": "1",
+          "to": "node_modules/d",
+        },
+      },
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping peer sets, superset > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "y@1.0.0",
    "edge": "{ ROOT prod y@1 }",
    "placed": "node_modules/y",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "d@1.0.0",
    "edge": "{ node_modules/y peer d@1 }",
    "parent": "y",
    "placed": "node_modules/d",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "e@1.0.0",
    "edge": "{ node_modules/d peer e@1 }",
    "parent": "d",
    "placed": "node_modules/e",
  },
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "a@1.0.0",
    "edge": "{ node_modules/e peer a@1 }",
    "parent": "e",
    "placed": "node_modules/a",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "b@1.0.0",
    "edge": "{ node_modules/a peer b@1 }",
    "parent": "a",
    "placed": "node_modules/b",
  },
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "c@1.0.0",
    "edge": "{ node_modules/b peer c@1 }",
    "parent": "b",
    "placed": "node_modules/c",
  },
]
`

exports[`test/place-dep.js TAP placement tests replacing partially overlapping peer sets, superset > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "name": "c",
              "version": "2.0.0",
            },
            "name": "e",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/e",
        "name": "e",
        "version": "2.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "4",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "4.0.0",
                        },
                        "name": "a",
                        "spec": "1||2",
                        "type": "peer",
                      },
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "name": "c",
                                "version": "2.0.0",
                              },
                              "name": "e",
                              "spec": "2",
                              "type": "peer",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/e",
                          "name": "e",
                          "version": "2.0.0",
                        },
                        "name": "a",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "2.0.0",
                  },
                  "name": "c",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/c",
              "name": "c",
              "version": "2.0.0",
            },
            "name": "e",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/e",
        "name": "e",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": undefined,
          "path": "/some/path",
          "version": undefined,
        },
      },
      "edge": Object {
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "location": "/some/path",
                          },
                          "name": "v",
                          "spec": "4",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/v",
                      "name": "v",
                      "version": "4.0.0",
                    },
                    "name": "a",
                    "spec": "1||2",
                    "type": "peer",
                  },
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "name": "c",
                            "version": "2.0.0",
                          },
                          "name": "e",
                          "spec": "2",
                          "type": "peer",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/e",
                      "name": "e",
                      "version": "2.0.0",
                    },
                    "name": "a",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/a",
                "name": "a",
                "version": "2.0.0",
              },
              "name": "c",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/c",
          "name": "c",
          "version": "2.0.0",
        },
        "name": "e",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": true,
      "peerConflict": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "name": "c",
              "version": "2.0.0",
            },
            "name": "e",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/e",
        "name": "e",
        "version": "2.0.0",
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests skip over peer dependents in the ancestry walkup > changes to tree 1`] = `
--- expected
+++ actual
@@ -68,8 +68,7 @@
           "type": "peer",
           "name": "v",
           "spec": "*",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/v",
         },
       },
       "edgesIn": Set {
@@ -95,8 +94,7 @@
               "type": "prod",
               "name": "v",
               "spec": "1",
-              "to": null,
-              "error": "MISSING",
+              "to": "node_modules/v",
             },
           },
           "edgesIn": Set {
@@ -128,5 +126,29 @@
         },
       },
     },
+    "v" => ArboristNode {
+      "name": "v",
+      "version": "1.0.0",
+      "location": "node_modules/v",
+      "path": "/some/path/node_modules/v",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "v",
+          "spec": "*",
+          "from": "node_modules/b",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "v",
+          "spec": "1",
+          "from": "node_modules/b/node_modules/c",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests skip over peer dependents in the ancestry walkup > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/b/node_modules/c" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "v@1.0.0",
    "edge": "{ node_modules/b/node_modules/c prod v@1 }",
    "placed": "node_modules/v",
  },
]
`

exports[`test/place-dep.js TAP placement tests skip over peer dependents in the ancestry walkup > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests upgrade a transitive dependency > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP placement tests upgrade a transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {},
    "dep": "bar@1.0.1",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests upgrade a transitive dependency > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -62,8 +62,7 @@
           "type": "prod",
           "name": "b",
           "spec": "2",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/v/node_modules/b",
         },
         "y" => EdgeOut {
           "type": "peer",
@@ -80,6 +79,62 @@
           "from": "",
         },
       },
+      "children": Map {
+        "b" => ArboristNode {
+          "name": "b",
+          "version": "2.0.0",
+          "location": "node_modules/v/node_modules/b",
+          "path": "/some/path/node_modules/v/node_modules/b",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesOut": Map {
+            "k" => EdgeOut {
+              "type": "peer",
+              "name": "k",
+              "spec": "2",
+              "to": "node_modules/v/node_modules/k",
+            },
+          },
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "b",
+              "spec": "2",
+              "from": "node_modules/v",
+            },
+          },
+        },
+        "k" => ArboristNode {
+          "name": "k",
+          "version": "2.0.0",
+          "location": "node_modules/v/node_modules/k",
+          "path": "/some/path/node_modules/v/node_modules/k",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesOut": Map {
+            "y" => EdgeOut {
+              "type": "peer",
+              "name": "y",
+              "spec": "2",
+              "error": "INVALID",
+              "peerConflicted": true,
+              "to": "node_modules/y",
+            },
+          },
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "peer",
+              "name": "k",
+              "spec": "2",
+              "from": "node_modules/v/node_modules/b",
+            },
+          },
+        },
+      },
     },
     "x" => ArboristNode {
       "name": "x",
@@ -126,6 +181,14 @@
         EdgeIn {
           "type": "peer",
           "name": "y",
+          "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "node_modules/v/node_modules/k",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
           "spec": "1",
           "from": "node_modules/x",
         },

`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/v" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "b@2.0.0",
    "edge": "{ node_modules/v prod b@2 }",
    "placed": "node_modules/v/node_modules/b",
  },
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/v" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "k@2.0.0",
    "edge": "{ node_modules/v/node_modules/b peer k@2 }",
    "parent": "b",
    "placed": "node_modules/v/node_modules/k",
  },
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {
      "node_modules/v" => Array [
        Symbol(CONFLICT),
        Symbol(OK),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/v/node_modules/k peer y@2 }",
    "parent": "k",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/v/node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/v/node_modules/k",
              "name": "k",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/v/node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/v/node_modules/k",
              "name": "k",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "2.0.0",
        "whileInstalling": Object {
          "name": "v",
          "path": "/some/path/node_modules/v",
          "version": "1.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "location": "/some/path",
                          },
                          "name": "v",
                          "spec": "",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/v",
                      "name": "v",
                      "version": "1.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/v/node_modules/b",
                "name": "b",
                "version": "2.0.0",
              },
              "name": "k",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/v/node_modules/k",
          "name": "k",
          "version": "2.0.0",
        },
        "name": "y",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": false,
      "peerConflict": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/v/node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/v/node_modules/k",
              "name": "k",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2 > changes to tree 1`] = `
--- expected
+++ actual
@@ -83,6 +83,7 @@
           "name": "y",
           "spec": "2",
           "error": "INVALID",
+          "peerConflicted": true,
           "to": "node_modules/y",
         },
       },
@@ -172,6 +173,14 @@
         EdgeIn {
           "type": "peer",
           "name": "y",
+          "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "node_modules/k",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
           "spec": "*",
           "from": "node_modules/v",
         },
@@ -181,13 +190,6 @@
           "spec": "1",
           "from": "node_modules/x",
         },
-        EdgeIn {
-          "type": "peer",
-          "name": "y",
-          "spec": "2",
-          "error": "INVALID",
-          "from": "node_modules/k",
-        },
       },
     },
   },

`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2 > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": null,
    "checks": Map {
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "y@2.0.0",
    "edge": "{ node_modules/k peer y@2 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2 > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "v",
                  "spec": "",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/v",
              "name": "v",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "",
            "type": "peer",
          },
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "a",
                        "spec": "1",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "1.0.0",
                  },
                  "name": "x",
                  "spec": "1",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/x",
              "name": "x",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/k",
              "name": "k",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "2.0.0",
        "whileInstalling": Object {
          "name": "k",
          "path": "/some/path/node_modules/k",
          "version": "2.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "location": "/some/path",
                          },
                          "name": "v",
                          "spec": "",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/v",
                      "name": "v",
                      "version": "1.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b",
                "name": "b",
                "version": "2.0.0",
              },
              "name": "k",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/k",
          "name": "k",
          "version": "2.0.0",
        },
        "name": "y",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": false,
      "peerConflict": Object {
        "current": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "location": "/some/path",
                    },
                    "name": "v",
                    "spec": "",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/v",
                "name": "v",
                "version": "1.0.0",
              },
              "name": "y",
              "spec": "",
              "type": "peer",
            },
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "location": "/some/path",
                                },
                                "name": "v",
                                "spec": "",
                                "type": "prod",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/v",
                            "name": "v",
                            "version": "1.0.0",
                          },
                          "name": "a",
                          "spec": "1",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/a",
                      "name": "a",
                      "version": "1.0.0",
                    },
                    "name": "x",
                    "spec": "1",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/x",
                "name": "x",
                "version": "1.0.0",
              },
              "name": "y",
              "spec": "1",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/y",
          "name": "y",
          "version": "1.0.0",
        },
        "peer": Object {
          "dependents": Array [
            Object {
              "error": "INVALID",
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "location": "/some/path",
                                },
                                "name": "v",
                                "spec": "",
                                "type": "prod",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/v",
                            "name": "v",
                            "version": "1.0.0",
                          },
                          "name": "b",
                          "spec": "2",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/b",
                      "name": "b",
                      "version": "2.0.0",
                    },
                    "name": "k",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/k",
                "name": "k",
                "version": "2.0.0",
              },
              "name": "y",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/y",
          "name": "y",
          "version": "2.0.0",
          "whileInstalling": Object {
            "name": "k",
            "path": "/some/path/node_modules/k",
            "version": "2.0.0",
          },
        },
      },
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2, but with override > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2, but with override > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(KEEP),
    "canPlaceSelf": Symbol(KEEP),
    "checks": Map {
      "" => Array [
        Symbol(KEEP),
        Symbol(KEEP),
      ],
    },
    "dep": "y@1.0.0",
    "edge": "{ node_modules/k peer y@2 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2, but with override > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "v",
                  "spec": "",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/v",
              "name": "v",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "",
            "type": "peer",
          },
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "a",
                        "spec": "1",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "1.0.0",
                  },
                  "name": "x",
                  "spec": "1",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/x",
              "name": "x",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/k",
              "name": "k",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": "k",
          "path": "/some/path/node_modules/k",
          "version": "2.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "location": "/some/path",
                          },
                          "name": "v",
                          "spec": "",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/v",
                      "name": "v",
                      "version": "1.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b",
                "name": "b",
                "version": "2.0.0",
              },
              "name": "k",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/k",
          "name": "k",
          "version": "2.0.0",
        },
        "name": "y",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": false,
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2, override, no current > changes to tree 1`] = `
--- expected
+++ actual
@@ -114,9 +114,9 @@
           "type": "peer",
           "name": "y",
           "spec": "2",
-          "error": "MISSING",
+          "error": "INVALID",
           "peerConflicted": true,
-          "to": null,
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -160,8 +160,7 @@
           "type": "peer",
           "name": "y",
           "spec": "*",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -187,8 +186,7 @@
           "type": "peer",
           "name": "y",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -200,5 +198,37 @@
         },
       },
     },
+    "y" => ArboristNode {
+      "name": "y",
+      "version": "1.0.0",
+      "location": "node_modules/y",
+      "path": "/some/path/node_modules/y",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "node_modules/k",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "*",
+          "from": "node_modules/v",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "1",
+          "from": "node_modules/x",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2, override, no current > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "y@1.0.0",
    "edge": "{ node_modules/k peer y@2 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on deep peer dep, step 2, override, no current > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "v",
                  "spec": "",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/v",
              "name": "v",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "",
            "type": "peer",
          },
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "a",
                        "spec": "1",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "1.0.0",
                  },
                  "name": "x",
                  "spec": "1",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/x",
              "name": "x",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "1",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "prod",
                },
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "dependents": Array [
                                  Object {
                                    "from": Object {
                                      "location": "/some/path",
                                    },
                                    "name": "v",
                                    "spec": "",
                                    "type": "prod",
                                  },
                                ],
                                "isWorkspace": false,
                                "location": "node_modules/v",
                                "name": "v",
                                "version": "1.0.0",
                              },
                              "name": "b",
                              "spec": "2",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/b",
                          "name": "b",
                          "version": "2.0.0",
                        },
                        "name": "c",
                        "spec": "2",
                        "type": "peer",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/c",
                    "name": "c",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/k",
              "name": "k",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": "k",
          "path": "/some/path/node_modules/k",
          "version": "2.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "location": "/some/path",
                          },
                          "name": "v",
                          "spec": "",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/v",
                      "name": "v",
                      "version": "1.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b",
                "name": "b",
                "version": "2.0.0",
              },
              "name": "k",
              "spec": "2",
              "type": "prod",
            },
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "dependents": Array [
                              Object {
                                "from": Object {
                                  "location": "/some/path",
                                },
                                "name": "v",
                                "spec": "",
                                "type": "prod",
                              },
                            ],
                            "isWorkspace": false,
                            "location": "node_modules/v",
                            "name": "v",
                            "version": "1.0.0",
                          },
                          "name": "b",
                          "spec": "2",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/b",
                      "name": "b",
                      "version": "2.0.0",
                    },
                    "name": "c",
                    "spec": "2",
                    "type": "peer",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/c",
                "name": "c",
                "version": "2.0.0",
              },
              "name": "k",
              "spec": "2",
              "type": "peer",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/k",
          "name": "k",
          "version": "2.0.0",
        },
        "name": "y",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": false,
      "strictPeerDeps": false,
    },
  ],
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on less deep peer dep, step 2, override, no current > changes to tree 1`] = `
--- expected
+++ actual
@@ -62,8 +62,7 @@
           "type": "peer",
           "name": "y",
           "spec": "*",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -89,9 +88,9 @@
           "type": "peer",
           "name": "y",
           "spec": "2",
-          "error": "MISSING",
+          "error": "INVALID",
           "peerConflicted": true,
-          "to": null,
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -129,8 +128,7 @@
           "type": "peer",
           "name": "y",
           "spec": "*",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -156,8 +154,7 @@
           "type": "peer",
           "name": "y",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -169,5 +166,43 @@
         },
       },
     },
+    "y" => ArboristNode {
+      "name": "y",
+      "version": "1.0.0",
+      "location": "node_modules/y",
+      "path": "/some/path/node_modules/y",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "*",
+          "from": "node_modules/b",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "2",
+          "error": "INVALID",
+          "peerConflicted": true,
+          "from": "node_modules/k",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "*",
+          "from": "node_modules/v",
+        },
+        EdgeIn {
+          "type": "peer",
+          "name": "y",
+          "spec": "1",
+          "from": "node_modules/x",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on less deep peer dep, step 2, override, no current > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "y@1.0.0",
    "edge": "{ node_modules/k peer y@2 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP placement tests warn ERESOLVE on less deep peer dep, step 2, override, no current > warnings 1`] = `
Array [
  Array [
    "ERESOLVE",
    "overriding peer dependency",
    Object {
      "code": "ERESOLVE",
      "current": Object {
        "dependents": Array [
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "location": "/some/path",
                  },
                  "name": "v",
                  "spec": "",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/v",
              "name": "v",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "",
            "type": "peer",
          },
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "a",
                        "spec": "1",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/a",
                    "name": "a",
                    "version": "1.0.0",
                  },
                  "name": "x",
                  "spec": "1",
                  "type": "peer",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/x",
              "name": "x",
              "version": "1.0.0",
            },
            "name": "y",
            "spec": "1",
            "type": "peer",
          },
          Object {
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "location": "/some/path",
                        },
                        "name": "v",
                        "spec": "",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/v",
                    "name": "v",
                    "version": "1.0.0",
                  },
                  "name": "b",
                  "spec": "2",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/b",
              "name": "b",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
      },
      "dep": Object {
        "dependents": Array [
          Object {
            "error": "INVALID",
            "from": Object {
              "dependents": Array [
                Object {
                  "from": Object {
                    "dependents": Array [
                      Object {
                        "from": Object {
                          "dependents": Array [
                            Object {
                              "from": Object {
                                "location": "/some/path",
                              },
                              "name": "v",
                              "spec": "",
                              "type": "prod",
                            },
                          ],
                          "isWorkspace": false,
                          "location": "node_modules/v",
                          "name": "v",
                          "version": "1.0.0",
                        },
                        "name": "b",
                        "spec": "2",
                        "type": "prod",
                      },
                    ],
                    "isWorkspace": false,
                    "location": "node_modules/b",
                    "name": "b",
                    "version": "2.0.0",
                  },
                  "name": "k",
                  "spec": "2",
                  "type": "prod",
                },
              ],
              "isWorkspace": false,
              "location": "node_modules/k",
              "name": "k",
              "version": "2.0.0",
            },
            "name": "y",
            "spec": "2",
            "type": "peer",
          },
        ],
        "isWorkspace": false,
        "location": "node_modules/y",
        "name": "y",
        "version": "1.0.0",
        "whileInstalling": Object {
          "name": "k",
          "path": "/some/path/node_modules/k",
          "version": "2.0.0",
        },
      },
      "edge": Object {
        "error": "INVALID",
        "from": Object {
          "dependents": Array [
            Object {
              "from": Object {
                "dependents": Array [
                  Object {
                    "from": Object {
                      "dependents": Array [
                        Object {
                          "from": Object {
                            "location": "/some/path",
                          },
                          "name": "v",
                          "spec": "",
                          "type": "prod",
                        },
                      ],
                      "isWorkspace": false,
                      "location": "node_modules/v",
                      "name": "v",
                      "version": "1.0.0",
                    },
                    "name": "b",
                    "spec": "2",
                    "type": "prod",
                  },
                ],
                "isWorkspace": false,
                "location": "node_modules/b",
                "name": "b",
                "version": "2.0.0",
              },
              "name": "k",
              "spec": "2",
              "type": "prod",
            },
          ],
          "isWorkspace": false,
          "location": "node_modules/k",
          "name": "k",
          "version": "2.0.0",
        },
        "name": "y",
        "spec": "2",
        "type": "peer",
      },
      "force": false,
      "isMine": false,
      "strictPeerDeps": false,
    },
  ],
]
`
