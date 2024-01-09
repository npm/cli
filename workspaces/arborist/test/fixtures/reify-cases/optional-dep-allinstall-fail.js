// generated from test/fixtures/optional-dep-allinstall-fail
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "@isaacs": {
      "testing-fail-postinstall": {
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-fail-postinstall",
          "_id": "@isaacs/testing-fail-postinstall@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-dOoHClc0+gQ+GYiFLinkdH6G7mfSdjex+iiDhN26/h/WA+t7rax4Vg+TOB/VXjIuHawfiS5RllIxtPt7Fyqv+g==",
          "_location": "/@isaacs/testing-fail-postinstall",
          "_phantomChildren": {},
          "_requested": {
            "type": "tag",
            "registry": true,
            "raw": "@isaacs/testing-fail-postinstall",
            "name": "@isaacs/testing-fail-postinstall",
            "escapedName": "@isaacs%2ftesting-fail-postinstall",
            "scope": "@isaacs",
            "rawSpec": "",
            "saveSpec": null,
            "fetchSpec": "latest"
          },
          "_requiredBy": [
            "#USER",
            "/"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-fail-postinstall/-/testing-fail-postinstall-1.0.0.tgz",
          "_shasum": "0ee96aa4b99c1640446ba5809d554a6e1f2a052a",
          "_spec": "@isaacs/testing-fail-postinstall",
          "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/optional-dep-postinstall-fail",
          "bundleDependencies": false,
          "deprecated": false,
          "license": "ISC",
          "name": "@isaacs/testing-fail-postinstall",
          "scripts": {
            "postinstall": "exit 1"
          },
          "version": "1.0.0"
        })
      }
    }
  },
  "package-lock.json": JSON.stringify({
    "name": "optional-dep-postinstall-fail",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "optional-dep-postinstall-fail",
        "version": "1.0.0",
        "license": "ISC",
        "dependencies": {
          "@isaacs/testing-fail-postinstall": "^1.0.0"
        },
        "optionalDependencies": {
          "@isaacs/testing-fail-postinstall": "^1.0.0"
        }
      },
      "node_modules/@isaacs/testing-fail-postinstall": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-fail-postinstall/-/testing-fail-postinstall-1.0.0.tgz",
        "integrity": "sha512-dOoHClc0+gQ+GYiFLinkdH6G7mfSdjex+iiDhN26/h/WA+t7rax4Vg+TOB/VXjIuHawfiS5RllIxtPt7Fyqv+g==",
        "optional": true
      }
    },
    "dependencies": {
      "@isaacs/testing-fail-postinstall": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-fail-postinstall/-/testing-fail-postinstall-1.0.0.tgz",
        "integrity": "sha512-dOoHClc0+gQ+GYiFLinkdH6G7mfSdjex+iiDhN26/h/WA+t7rax4Vg+TOB/VXjIuHawfiS5RllIxtPt7Fyqv+g==",
        "optional": true
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "optional-dep-allinstall-fail",
    "version": "1.0.0",
    "description": "an optional dependency that fails to install",
    "license": "ISC",
    "optionalDependencies": {
      "@isaacs/testing-fail-allinstall": "^1.0.0"
    }
  })
})
  return path
}
