// generated from test/fixtures/prune-lockfile-optional-peer
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "dedent": {
      "package.json": JSON.stringify({
        "name": "dedent",
        "version": "1.6.0",
        "peerDependencies": {
          "babel-plugin-macros": "^3.1.0"
        },
        "peerDependenciesMeta": {
          "babel-plugin-macros": {
            "optional": true
          }
        }
      })
    }
  },
  "package-lock.json": JSON.stringify({
    "name": "prune-lockfile-optional-peer",
    "version": "1.0.0",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
      "": {
        "name": "prune-lockfile-optional-peer",
        "version": "1.0.0",
        "dependencies": {
          "dedent": "^1.6.0"
        }
      },
      "node_modules/babel-plugin-macros": {
        "version": "3.1.0",
        "optional": true,
        "peer": true
      },
      "node_modules/dedent": {
        "version": "1.6.0",
        "peerDependencies": {
          "babel-plugin-macros": "^3.1.0"
        },
        "peerDependenciesMeta": {
          "babel-plugin-macros": {
            "optional": true
          }
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "prune-lockfile-optional-peer",
    "version": "1.0.0",
    "dependencies": {
      "dedent": "^1.6.0"
    }
  })
  })
  return path
}
