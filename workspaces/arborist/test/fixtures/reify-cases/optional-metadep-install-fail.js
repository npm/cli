// generated from test/fixtures/optional-metadep-install-fail
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "@isaacs": {
      "testing-fail-postinstall": {
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-fail-postinstall@^1.0.0",
          "_id": "@isaacs/testing-fail-postinstall@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-dOoHClc0+gQ+GYiFLinkdH6G7mfSdjex+iiDhN26/h/WA+t7rax4Vg+TOB/VXjIuHawfiS5RllIxtPt7Fyqv+g==",
          "_location": "/@isaacs/testing-fail-postinstall",
          "_phantomChildren": {},
          "_requested": {
            "type": "range",
            "registry": true,
            "raw": "@isaacs/testing-fail-postinstall@^1.0.0",
            "name": "@isaacs/testing-fail-postinstall",
            "escapedName": "@isaacs%2ftesting-fail-postinstall",
            "scope": "@isaacs",
            "rawSpec": "^1.0.0",
            "saveSpec": null,
            "fetchSpec": "^1.0.0"
          },
          "_requiredBy": [
            "/@isaacs/testing-prod-dep-postinstall-fail"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-fail-postinstall/-/testing-fail-postinstall-1.0.0.tgz",
          "_shasum": "0ee96aa4b99c1640446ba5809d554a6e1f2a052a",
          "_spec": "@isaacs/testing-fail-postinstall@^1.0.0",
          "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/optional-metadep-postinstall-fail/node_modules/@isaacs/testing-prod-dep-postinstall-fail",
          "bundleDependencies": false,
          "deprecated": false,
          "license": "ISC",
          "name": "@isaacs/testing-fail-postinstall",
          "scripts": {
            "postinstall": "exit 1"
          },
          "version": "1.0.0"
        })
      },
      "testing-prod-dep-postinstall-fail": {
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-prod-dep-postinstall-fail@1.0.0",
          "_id": "@isaacs/testing-prod-dep-postinstall-fail@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-0OUhi2IXYma2CBXQt4tUknTp5D58qfYAfE5m/wOaeHmnAk7f0qwHoNiytPbtziyVEVYwWBWABBm7mW1McneyBw==",
          "_location": "/@isaacs/testing-prod-dep-postinstall-fail",
          "_phantomChildren": {},
          "_requested": {
            "type": "version",
            "registry": true,
            "raw": "@isaacs/testing-prod-dep-postinstall-fail@1.0.0",
            "name": "@isaacs/testing-prod-dep-postinstall-fail",
            "escapedName": "@isaacs%2ftesting-prod-dep-postinstall-fail",
            "scope": "@isaacs",
            "rawSpec": "1.0.0",
            "saveSpec": null,
            "fetchSpec": "1.0.0"
          },
          "_requiredBy": [
            "/"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-prod-dep-postinstall-fail/-/testing-prod-dep-postinstall-fail-1.0.0.tgz",
          "_shasum": "ea11e9a51de8ef4b17f3651438c34f4e33bc363d",
          "_spec": "@isaacs/testing-prod-dep-postinstall-fail@1.0.0",
          "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/optional-metadep-postinstall-fail",
          "bundleDependencies": false,
          "dependencies": {
            "@isaacs/testing-fail-postinstall": "^1.0.0"
          },
          "deprecated": false,
          "description": "a prod dependency that fails to install",
          "license": "ISC",
          "name": "@isaacs/testing-prod-dep-postinstall-fail",
          "version": "1.0.0"
        })
      }
    }
  },
  "package.json": JSON.stringify({
    "name": "optional-metadep-install-fail",
    "version": "1.0.0",
    "optionalDependencies": {
      "@isaacs/testing-prod-dep-install-fail": "*"
    }
  })
})
  return path
}
