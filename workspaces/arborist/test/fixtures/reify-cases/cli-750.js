// generated from test/fixtures/cli-750
module.exports = t => {
  const path = t.testdir({
  "app": {
    "package.json": JSON.stringify({
      "name": "app",
      "dependencies": {
        "lib": "file:../lib"
      }
    })
  },
  "lib": {
    "package.json": JSON.stringify({
      "name": "lib"
    })
  },
  "node_modules": {
    "app": t.fixture('symlink', "../app"),
    "lib": t.fixture('symlink', "../lib")
  },
  "package-lock.json": JSON.stringify({
    "name": "monorepo",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "monorepo",
        "dependencies": {
          "app": "file:./app"
        }
      },
      "app": {
        "name": "app",
        "dependencies": {
          "lib": "file:../lib"
        }
      },
      "lib": {
        "name": "lib"
      },
      "node_modules/app": {
        "resolved": "app",
        "link": true
      },
      "node_modules/lib": {
        "resolved": "lib",
        "link": true
      }
    },
    "dependencies": {
      "app": {
        "version": "file:app"
      },
      "lib": {
        "version": "file:lib"
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "monorepo",
    "dependencies": {
      "app": "file:./app"
    }
  })
})
  return path
}
