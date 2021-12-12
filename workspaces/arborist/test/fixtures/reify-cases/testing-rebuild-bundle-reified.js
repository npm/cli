// generated from test/fixtures/testing-rebuild-bundle-reified
module.exports = t => {
  const path = t.testdir({
  "README.md": `- \`root\` depends on \`parent\`
- \`parent\` bundles \`a\`
- \`a\` depends on \`b\`
- \`b\` has a build script

Should get rebuilt if \`rebuildBundle\` is true, otherwise not.
`,
  "node_modules": {
    ".package-lock.json": JSON.stringify({
      "name": "@isaacs/testing-rebuild-bundle-reified",
      "version": "1.0.0",
      "lockfileVersion": 2,
      "requires": true,
      "packages": {
        "node_modules/@isaacs/testing-rebuild-bundle-a": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-a/-/testing-rebuild-bundle-a-1.0.1.tgz",
          "integrity": "sha512-ZJeJZTSSm38+dZaFbei3ruFvLPWRbWrF8/CAojhuqopKHxp3qdQ4n4UVfVnUdzl55ZJ+gOzItKelIu3sASglKQ==",
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
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-parent/-/testing-rebuild-bundle-parent-1.0.0.tgz",
          "integrity": "sha512-fa+mV2K+BDLzuxfI1LUWNmii92sylksrtaUITSO74ylcdWslvTFyr+REJfwdH5fDOxGqBH6kbVcDvWY8WqhgXg==",
          "dependencies": {
            "@isaacs/testing-rebuild-bundle-a": ""
          }
        }
      }
    }),
    "@isaacs": {
      "testing-rebuild-bundle-a": {
        "node_modules": {
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
        "package.json": JSON.stringify({
          "name": "@isaacs/testing-rebuild-bundle-a",
          "version": "1.0.1",
          "dependencies": {
            "@isaacs/testing-rebuild-bundle-b": ""
          },
          "bundleDependencies": [
            "@isaacs/testing-rebuild-bundle-b"
          ]
        })
      },
      "testing-rebuild-bundle-parent": {
        "package.json": JSON.stringify({
          "name": "@isaacs/testing-rebuild-bundle-parent",
          "version": "1.0.0",
          "dependencies": {
            "@isaacs/testing-rebuild-bundle-a": ""
          }
        })
      }
    }
  },
  "package-lock.json": JSON.stringify({
    "name": "@isaacs/testing-rebuild-bundle-reified",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "@isaacs/testing-rebuild-bundle-reified",
        "version": "1.0.0",
        "dependencies": {
          "@isaacs/testing-rebuild-bundle-parent": ""
        }
      },
      "node_modules/@isaacs/testing-rebuild-bundle-a": {
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-a/-/testing-rebuild-bundle-a-1.0.1.tgz",
        "integrity": "sha512-ZJeJZTSSm38+dZaFbei3ruFvLPWRbWrF8/CAojhuqopKHxp3qdQ4n4UVfVnUdzl55ZJ+gOzItKelIu3sASglKQ==",
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
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-parent/-/testing-rebuild-bundle-parent-1.0.0.tgz",
        "integrity": "sha512-fa+mV2K+BDLzuxfI1LUWNmii92sylksrtaUITSO74ylcdWslvTFyr+REJfwdH5fDOxGqBH6kbVcDvWY8WqhgXg==",
        "dependencies": {
          "@isaacs/testing-rebuild-bundle-a": ""
        }
      }
    },
    "dependencies": {
      "@isaacs/testing-rebuild-bundle-a": {
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-a/-/testing-rebuild-bundle-a-1.0.1.tgz",
        "integrity": "sha512-ZJeJZTSSm38+dZaFbei3ruFvLPWRbWrF8/CAojhuqopKHxp3qdQ4n4UVfVnUdzl55ZJ+gOzItKelIu3sASglKQ==",
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
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/testing-rebuild-bundle-parent/-/testing-rebuild-bundle-parent-1.0.0.tgz",
        "integrity": "sha512-fa+mV2K+BDLzuxfI1LUWNmii92sylksrtaUITSO74ylcdWslvTFyr+REJfwdH5fDOxGqBH6kbVcDvWY8WqhgXg==",
        "requires": {
          "@isaacs/testing-rebuild-bundle-a": ""
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "@isaacs/testing-rebuild-bundle-reified",
    "version": "1.0.0",
    "dependencies": {
      "@isaacs/testing-rebuild-bundle-parent": ""
    },
    "files": []
  })
})
  const {utimesSync} = require('fs')
  const n = Date.now() + 10000
  const {resolve} = require('path')
  
  utimesSync(resolve(path, "node_modules/.package-lock.json"), new Date(n), new Date(n))
  return path
}
