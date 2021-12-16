// generated from test/fixtures/testing-rebuild-bundle
module.exports = t => {
  const path = t.testdir({
  "README.md": `- \`root\` depends on \`parent\`
- \`parent\` bundles \`a\`
- \`a\` depends on \`b\`
- \`b\` has a build script

Should get rebuilt if \`rebuildBundle\` is true, otherwise not.
`,
  "a": {
    "node_modules": {
      ".package-lock.json": JSON.stringify({
        "name": "@isaacs/testing-rebuild-bundle-a",
        "version": "1.0.2",
        "lockfileVersion": 2,
        "requires": true,
        "packages": {
          "node_modules/@isaacs/testing-rebuild-bundle-b": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-b/-/testing-rebuild-bundle-b-1.0.1.tgz",
            "integrity": "sha512-Uk8u/2pQYJ2LRdm0bZB6k2MTxwtLJyZVfTHTFNR2pxirl9TPCLoRkGozbzwDV7n2V9pMwC26Oy230NoAml9tQg==",
            "hasInstallScript": true,
            "inBundle": true
          }
        }
      }),
      "@isaacs": {
        "testing-rebuild-bundle-b": {
          "package.json": JSON.stringify({
            "name": "@isaacs/testing-rebuild-bundle-b",
            "version": "1.0.1",
            "scripts": {
              "install": "node -e \"require('fs').writeFileSync('cwd', process.cwd())\""
            }
          })
        }
      }
    },
    "package-lock.json": JSON.stringify({
      "name": "@isaacs/testing-rebuild-bundle-a",
      "version": "1.0.2",
      "lockfileVersion": 2,
      "requires": true,
      "packages": {
        "": {
          "name": "@isaacs/testing-rebuild-bundle-a",
          "version": "1.0.2",
          "bundleDependencies": [
            "@isaacs/testing-rebuild-bundle-b"
          ],
          "dependencies": {
            "@isaacs/testing-rebuild-bundle-b": ""
          }
        },
        "node_modules/@isaacs/testing-rebuild-bundle-b": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-b/-/testing-rebuild-bundle-b-1.0.1.tgz",
          "integrity": "sha512-Uk8u/2pQYJ2LRdm0bZB6k2MTxwtLJyZVfTHTFNR2pxirl9TPCLoRkGozbzwDV7n2V9pMwC26Oy230NoAml9tQg==",
          "hasInstallScript": true,
          "inBundle": true
        }
      },
      "dependencies": {
        "@isaacs/testing-rebuild-bundle-b": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-b/-/testing-rebuild-bundle-b-1.0.1.tgz",
          "integrity": "sha512-Uk8u/2pQYJ2LRdm0bZB6k2MTxwtLJyZVfTHTFNR2pxirl9TPCLoRkGozbzwDV7n2V9pMwC26Oy230NoAml9tQg=="
        }
      }
    }),
    "package.json": JSON.stringify({
      "name": "@isaacs/testing-rebuild-bundle-a",
      "version": "1.0.2",
      "dependencies": {
        "@isaacs/testing-rebuild-bundle-b": ""
      },
      "bundleDependencies": [
        "@isaacs/testing-rebuild-bundle-b"
      ]
    })
  },
  "b": {
    "package.json": JSON.stringify({
      "name": "@isaacs/testing-rebuild-bundle-b",
      "version": "1.0.1",
      "scripts": {
        "install": "node -e \"require('fs').writeFileSync('cwd', process.cwd())\""
      }
    })
  },
  "package-lock.json": JSON.stringify({
    "name": "@isaacs/testing-rebuild-bundle",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "@isaacs/testing-rebuild-bundle",
        "version": "1.0.0",
        "dependencies": {
          "@isaacs/testing-rebuild-bundle-parent": ""
        }
      },
      "node_modules/@isaacs/testing-rebuild-bundle-a": {
        "version": "1.0.2",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-a/-/testing-rebuild-bundle-a-1.0.2.tgz",
        "integrity": "sha512-iMx/CGv5Z5dHRdeuYDoaCy0Nfgg0ih9G23C4bwoYPbkdXemc8ahbE9AFJ7jCP0u0hm5ZoZiP11FLN1i7ADhRbA==",
        "bundleDependencies": [
          "@isaacs/testing-rebuild-bundle-b"
        ],
        "dependencies": {
          "@isaacs/testing-rebuild-bundle-b": ""
        }
      },
      "node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b": {
        "version": "1.0.1",
        "hasInstallScript": true,
        "inBundle": true
      },
      "node_modules/@isaacs/testing-rebuild-bundle-parent": {
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-parent/-/testing-rebuild-bundle-parent-1.0.1.tgz",
        "integrity": "sha512-PM20bXdRox3OOUEC7m0oYrpW3qZIYN+fh+/9TazZrWkfIggkHNnB91mROyPwlc/HvfPYoYHp1CMGPlgUSl3FDQ==",
        "dependencies": {
          "@isaacs/testing-rebuild-bundle-a": ""
        }
      }
    },
    "dependencies": {
      "@isaacs/testing-rebuild-bundle-a": {
        "version": "1.0.2",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-a/-/testing-rebuild-bundle-a-1.0.2.tgz",
        "integrity": "sha512-iMx/CGv5Z5dHRdeuYDoaCy0Nfgg0ih9G23C4bwoYPbkdXemc8ahbE9AFJ7jCP0u0hm5ZoZiP11FLN1i7ADhRbA==",
        "requires": {
          "@isaacs/testing-rebuild-bundle-b": ""
        },
        "dependencies": {
          "@isaacs/testing-rebuild-bundle-b": {
            "version": "1.0.1",
            "bundled": true
          }
        }
      },
      "@isaacs/testing-rebuild-bundle-parent": {
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-parent/-/testing-rebuild-bundle-parent-1.0.1.tgz",
        "integrity": "sha512-PM20bXdRox3OOUEC7m0oYrpW3qZIYN+fh+/9TazZrWkfIggkHNnB91mROyPwlc/HvfPYoYHp1CMGPlgUSl3FDQ==",
        "requires": {
          "@isaacs/testing-rebuild-bundle-a": ""
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-rebuild-bundle",
    "version": "1.0.0",
    "dependencies": {
      "@isaacs/testing-rebuild-bundle-parent": ""
    },
    "files": []
  }),
  "parent": {
    "package-lock.json": JSON.stringify({
      "name": "@isaacs/testing-rebuild-bundle-parent",
      "version": "1.0.1",
      "lockfileVersion": 2,
      "requires": true,
      "packages": {
        "": {
          "name": "@isaacs/testing-rebuild-bundle-parent",
          "version": "1.0.1",
          "dependencies": {
            "@isaacs/testing-rebuild-bundle-a": ""
          }
        },
        "node_modules/@isaacs/testing-rebuild-bundle-a": {
          "version": "1.0.2",
          "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-a/-/testing-rebuild-bundle-a-1.0.2.tgz",
          "integrity": "sha512-iMx/CGv5Z5dHRdeuYDoaCy0Nfgg0ih9G23C4bwoYPbkdXemc8ahbE9AFJ7jCP0u0hm5ZoZiP11FLN1i7ADhRbA==",
          "bundleDependencies": [
            "@isaacs/testing-rebuild-bundle-b"
          ],
          "dependencies": {
            "@isaacs/testing-rebuild-bundle-b": ""
          }
        },
        "node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b": {
          "version": "1.0.1",
          "hasInstallScript": true,
          "inBundle": true
        }
      },
      "dependencies": {
        "@isaacs/testing-rebuild-bundle-a": {
          "version": "1.0.2",
          "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-a/-/testing-rebuild-bundle-a-1.0.2.tgz",
          "integrity": "sha512-iMx/CGv5Z5dHRdeuYDoaCy0Nfgg0ih9G23C4bwoYPbkdXemc8ahbE9AFJ7jCP0u0hm5ZoZiP11FLN1i7ADhRbA==",
          "requires": {
            "@isaacs/testing-rebuild-bundle-b": ""
          },
          "dependencies": {
            "@isaacs/testing-rebuild-bundle-b": {
              "version": "1.0.1",
              "bundled": true
            }
          }
        }
      }
    }),
    "package.json": JSON.stringify({
      "name": "@isaacs/testing-rebuild-bundle-parent",
      "version": "1.0.1",
      "dependencies": {
        "@isaacs/testing-rebuild-bundle-a": ""
      }
    })
  }
})
  const {utimesSync} = require('fs')
  const n = Date.now() + 10000
  const {resolve} = require('path')
  
  utimesSync(resolve(path, "a/node_modules/.package-lock.json"), new Date(n), new Date(n))
  return path
}
