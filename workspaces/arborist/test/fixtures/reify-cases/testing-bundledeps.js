// generated from test/fixtures/testing-bundledeps
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "@isaacs": {
      "testing-bundledeps": {
        "a": {
          "package.json": JSON.stringify({
            "name": "@isaacs/testing-bundledeps-a",
            "version": "1.0.0",
            "description": "depends on b",
            "dependencies": {
              "@isaacs/testing-bundledeps-b": "*"
            }
          })
        },
        "b": {
          "package.json": JSON.stringify({
            "name": "@isaacs/testing-bundledeps-b",
            "version": "1.0.0",
            "description": "depended upon by a"
          })
        },
        "c": {
          "package.json": JSON.stringify({
            "name": "@isaacs/testing-bundledeps-c",
            "version": "1.0.0",
            "description": "not part of the bundle party, but depends on b",
            "dependencies": {
              "@isaacs/testing-bundledeps-b": "*"
            }
          })
        },
        "node_modules": {
          "@isaacs": {
            "testing-bundledeps-a": {
              "package.json": JSON.stringify({
                "_from": "@isaacs/testing-bundledeps-a@*",
                "_id": "@isaacs/testing-bundledeps-a@1.0.0",
                "_inBundle": true,
                "_integrity": "sha512-2b/w0tAsreSNReTbLmIf+1jtt8R0cvMgMCeLF4P2LAE6cmKw7aIjLPupeB+5R8dm1BoMUuZbzFCzw0P4vP6spw==",
                "_location": "/@isaacs/testing-bundledeps/@isaacs/testing-bundledeps-a",
                "_phantomChildren": {},
                "_requested": {
                  "type": "range",
                  "registry": true,
                  "raw": "@isaacs/testing-bundledeps-a@*",
                  "name": "@isaacs/testing-bundledeps-a",
                  "escapedName": "@isaacs%2ftesting-bundledeps-a",
                  "scope": "@isaacs",
                  "rawSpec": "*",
                  "saveSpec": null,
                  "fetchSpec": "*"
                },
                "_requiredBy": [
                  "/@isaacs/testing-bundledeps"
                ],
                "_resolved": "https://registry.npmjs.org/@isaacs/testing-bundledeps-a/-/testing-bundledeps-a-1.0.0.tgz",
                "_shasum": "f404461d6da767c10ca6c5e36402f671aa0264ba",
                "_spec": "@isaacs/testing-bundledeps-a@*",
                "_where": "/Users/isaacs/dev/js/x/test-bundledeps",
                "dependencies": {
                  "@isaacs/testing-bundledeps-b": "*"
                },
                "deprecated": false,
                "description": "depends on b",
                "name": "@isaacs/testing-bundledeps-a",
                "version": "1.0.0"
              })
            },
            "testing-bundledeps-b": {
              "package.json": JSON.stringify({
                "_from": "@isaacs/testing-bundledeps-b@*",
                "_id": "@isaacs/testing-bundledeps-b@1.0.0",
                "_inBundle": true,
                "_integrity": "sha512-UDbCq7GHRDb743m4VBpnsui6hNeB3o08qe/FRnX9JFo0VHnLoXkdtvm/WurwABLxL/xw5wP/tfN2jF90EjQehQ==",
                "_location": "/@isaacs/testing-bundledeps/@isaacs/testing-bundledeps-b",
                "_phantomChildren": {},
                "_requested": {
                  "type": "range",
                  "registry": true,
                  "raw": "@isaacs/testing-bundledeps-b@*",
                  "name": "@isaacs/testing-bundledeps-b",
                  "escapedName": "@isaacs%2ftesting-bundledeps-b",
                  "scope": "@isaacs",
                  "rawSpec": "*",
                  "saveSpec": null,
                  "fetchSpec": "*"
                },
                "_requiredBy": [
                  "/@isaacs/testing-bundledeps/@isaacs/testing-bundledeps-a"
                ],
                "_resolved": "https://registry.npmjs.org/@isaacs/testing-bundledeps-b/-/testing-bundledeps-b-1.0.0.tgz",
                "_shasum": "6b17c748cf89d5b909faa9347e8a8e5e47a95dbc",
                "_spec": "@isaacs/testing-bundledeps-b@*",
                "_where": "/Users/isaacs/dev/js/x/test-bundledeps/node_modules/@isaacs/testing-bundledeps-a",
                "deprecated": false,
                "description": "depended upon by a",
                "name": "@isaacs/testing-bundledeps-b",
                "version": "1.0.0"
              })
            }
          }
        },
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-bundledeps@*",
          "_id": "@isaacs/testing-bundledeps@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-P8AF2FoTfHOPGY6W53FHVg9mza6ipzkppAwnbnNNkPaLQIEFTpx3U95ir1AKqmub7nTi115Qi6zHiqJzGe5Cqg==",
          "_location": "/@isaacs/testing-bundledeps",
          "_phantomChildren": {},
          "_requested": {
            "type": "range",
            "registry": true,
            "raw": "@isaacs/testing-bundledeps@*",
            "name": "@isaacs/testing-bundledeps",
            "escapedName": "@isaacs%2ftesting-bundledeps",
            "scope": "@isaacs",
            "rawSpec": "*",
            "saveSpec": null,
            "fetchSpec": "*"
          },
          "_requiredBy": [
            "/"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-bundledeps/-/testing-bundledeps-1.0.0.tgz",
          "_shasum": "d4e8ce7c55d4319ad2fc27df484afb4f5b014022",
          "_spec": "@isaacs/testing-bundledeps@*",
          "_where": "/home/isaacs/arborist/test/fixtures/testing-bundledeps",
          "bundleDependencies": [
            "@isaacs/testing-bundledeps-a"
          ],
          "dependencies": {
            "@isaacs/testing-bundledeps-a": "*",
            "@isaacs/testing-bundledeps-c": "*"
          },
          "deprecated": false,
          "name": "@isaacs/testing-bundledeps",
          "version": "1.0.0"
        })
      },
      "testing-bundledeps-b": {
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-bundledeps-b@*",
          "_id": "@isaacs/testing-bundledeps-b@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-UDbCq7GHRDb743m4VBpnsui6hNeB3o08qe/FRnX9JFo0VHnLoXkdtvm/WurwABLxL/xw5wP/tfN2jF90EjQehQ==",
          "_location": "/@isaacs/testing-bundledeps-b",
          "_phantomChildren": {},
          "_requested": {
            "type": "range",
            "registry": true,
            "raw": "@isaacs/testing-bundledeps-b@*",
            "name": "@isaacs/testing-bundledeps-b",
            "escapedName": "@isaacs%2ftesting-bundledeps-b",
            "scope": "@isaacs",
            "rawSpec": "*",
            "saveSpec": null,
            "fetchSpec": "*"
          },
          "_requiredBy": [
            "/@isaacs/testing-bundledeps-c"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-bundledeps-b/-/testing-bundledeps-b-1.0.0.tgz",
          "_shasum": "6b17c748cf89d5b909faa9347e8a8e5e47a95dbc",
          "_spec": "@isaacs/testing-bundledeps-b@*",
          "_where": "/home/isaacs/arborist/test/fixtures/testing-bundledeps/node_modules/@isaacs/testing-bundledeps-c",
          "bundleDependencies": false,
          "deprecated": false,
          "description": "depended upon by a",
          "name": "@isaacs/testing-bundledeps-b",
          "version": "1.0.0"
        })
      },
      "testing-bundledeps-c": {
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-bundledeps-c@*",
          "_id": "@isaacs/testing-bundledeps-c@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-eRCBm5V6bx5+7Qnp/b06LbXBdhltQX2UOI4j3aO1TkQT/QYKnWmbW1XPjCsAGZ9KnXgOYuh1SyROUQT/oy733g==",
          "_location": "/@isaacs/testing-bundledeps-c",
          "_phantomChildren": {},
          "_requested": {
            "type": "range",
            "registry": true,
            "raw": "@isaacs/testing-bundledeps-c@*",
            "name": "@isaacs/testing-bundledeps-c",
            "escapedName": "@isaacs%2ftesting-bundledeps-c",
            "scope": "@isaacs",
            "rawSpec": "*",
            "saveSpec": null,
            "fetchSpec": "*"
          },
          "_requiredBy": [
            "/@isaacs/testing-bundledeps"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-bundledeps-c/-/testing-bundledeps-c-1.0.0.tgz",
          "_shasum": "9f7f87838d1682aab469cfd683db3b5461e4ea8b",
          "_spec": "@isaacs/testing-bundledeps-c@*",
          "_where": "/home/isaacs/arborist/test/fixtures/testing-bundledeps/node_modules/@isaacs/testing-bundledeps",
          "bundleDependencies": false,
          "dependencies": {
            "@isaacs/testing-bundledeps-b": "*"
          },
          "deprecated": false,
          "description": "not part of the bundle party, but depends on b",
          "name": "@isaacs/testing-bundledeps-c",
          "version": "1.0.0"
        })
      }
    }
  },
  "package.json": JSON.stringify({
    "name": "testing-bundledeps",
    "version": "1.2.3",
    "dependencies": {
      "@isaacs/testing-bundledeps": "*"
    }
  })
})
  return path
}
