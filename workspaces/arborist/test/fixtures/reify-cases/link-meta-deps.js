// generated from test/fixtures/link-meta-deps
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "@isaacs": {
      "testing-link-dep": {
        "node_modules": {
          "linked-dep": t.fixture('symlink', "../target")
        },
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-link-dep@1.0.0",
          "_id": "@isaacs/testing-link-dep@1.0.0",
          "_inBundle": false,
          "_integrity": "sha512-pcFALrJNXI/F0WXRtSUdyJEwdmUV6IwQrTmFwDASfNTv6/fZTyUgXpUtmKGrpFnvzj+mU/2U12lKOVjSErlFNg==",
          "_location": "/@isaacs/testing-link-dep",
          "_phantomChildren": {},
          "_requested": {
            "type": "version",
            "registry": true,
            "raw": "@isaacs/testing-link-dep@1.0.0",
            "name": "@isaacs/testing-link-dep",
            "escapedName": "@isaacs%2ftesting-link-dep",
            "scope": "@isaacs",
            "rawSpec": "1.0.0",
            "saveSpec": null,
            "fetchSpec": "1.0.0"
          },
          "_requiredBy": [
            "/"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-link-dep/-/testing-link-dep-1.0.0.tgz",
          "_shasum": "1c207f922d6e7f2299aa5c2bf2617d560077457d",
          "_spec": "@isaacs/testing-link-dep@1.0.0",
          "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/link-meta-deps",
          "bundleDependencies": false,
          "dependencies": {
            "linked-dep": "file:target"
          },
          "deprecated": false,
          "name": "@isaacs/testing-link-dep",
          "version": "1.0.0"
        }),
        "target": {
          "package.json": JSON.stringify({
            "name": "linked-dep",
            "version": "1.2.3"
          })
        }
      },
      "testing-link-dev-dep": {
        "package.json": JSON.stringify({
          "_from": "@isaacs/testing-link-dev-dep@^1.0.1",
          "_id": "@isaacs/testing-link-dev-dep@1.0.1",
          "_inBundle": false,
          "_integrity": "sha512-SHkefZXrqvzneMjVmbQym9s8GkljDZgFQpVBEQXM9uPhkzdC8vs4AidNDdBGJgGbDzAMdGA+YGt0p2d/YcnAtA==",
          "_location": "/@isaacs/testing-link-dev-dep",
          "_phantomChildren": {},
          "_requested": {
            "type": "range",
            "registry": true,
            "raw": "@isaacs/testing-link-dev-dep@^1.0.1",
            "name": "@isaacs/testing-link-dev-dep",
            "escapedName": "@isaacs%2ftesting-link-dev-dep",
            "scope": "@isaacs",
            "rawSpec": "^1.0.1",
            "saveSpec": null,
            "fetchSpec": "^1.0.1"
          },
          "_requiredBy": [
            "/"
          ],
          "_resolved": "https://registry.npmjs.org/@isaacs/testing-link-dev-dep/-/testing-link-dev-dep-1.0.1.tgz",
          "_shasum": "9711f576ef11f03c2e3373614d2690f13bc589dc",
          "_spec": "@isaacs/testing-link-dev-dep@^1.0.1",
          "_where": "/Users/isaacs/dev/npm/arborist/test/fixtures/link-meta-deps",
          "bundleDependencies": false,
          "deprecated": false,
          "devDependencies": {
            "linked-dev-dep": "file:target"
          },
          "name": "@isaacs/testing-link-dev-dep",
          "version": "1.0.1"
        }),
        "target": {
          "package.json": JSON.stringify({
            "name": "linked-dep",
            "version": "1.2.3"
          })
        }
      }
    }
  },
  "package-lock.json": JSON.stringify({
    "requires": true,
    "lockfileVersion": 1,
    "dependencies": {
      "@isaacs/testing-link-dep": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-link-dep/-/testing-link-dep-1.0.0.tgz",
        "integrity": "sha512-pcFALrJNXI/F0WXRtSUdyJEwdmUV6IwQrTmFwDASfNTv6/fZTyUgXpUtmKGrpFnvzj+mU/2U12lKOVjSErlFNg==",
        "requires": {
          "linked-dep": "file:node_modules/@isaacs/testing-link-dep/target"
        },
        "dependencies": {
          "linked-dep": {
            "version": "file:node_modules/@isaacs/testing-link-dep/target"
          }
        }
      },
      "@isaacs/testing-link-dev-dep": {
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-link-dev-dep/-/testing-link-dev-dep-1.0.1.tgz",
        "integrity": "sha512-SHkefZXrqvzneMjVmbQym9s8GkljDZgFQpVBEQXM9uPhkzdC8vs4AidNDdBGJgGbDzAMdGA+YGt0p2d/YcnAtA=="
      }
    }
  }),
  "package.json": JSON.stringify({
    "dependencies": {
      "@isaacs/testing-link-dep": "^1.0.0",
      "@isaacs/testing-link-dev-dep": "^1.0.1"
    }
  })
})
  return path
}
