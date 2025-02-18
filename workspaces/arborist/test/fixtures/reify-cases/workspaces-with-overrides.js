// generated from test/fixtures/workspaces-with-overrides
module.exports = t => {
  const path = t.testdir({
  "package-lock.json": JSON.stringify({
    "name": "workspace-with-overrides",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
      "": {
        "name": "workspace-with-overrides",
        "workspaces": [
          "ws"
        ]
      },
      "node_modules/a": {
        "resolved": "ws",
        "link": true
      },
      "node_modules/arg": {
        "version": "4.1.3",
        "resolved": "https://registry.npmjs.org/arg/-/arg-4.1.3.tgz",
        "integrity": "sha512-58S9QDqG0Xx27YwPSt9fJxivjYl432YCwfDMfZ+71RAqUrZef7LrKQZ3LHLOwCS4FLNBplP533Zx895SeOCHvA==",
        "license": "MIT"
      },
      "ws": {
        "name": "a",
        "version": "1.0.0",
        "dependencies": {
          "arg": "4.1.2"
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "workspace-with-overrides",
    "workspaces": [
      "ws"
    ],
    "overrides": {
      "arg": "4.1.3"
    }
  }),
  "ws": {
    "package.json": JSON.stringify({
      "name": "a",
      "version": "1.0.0",
      "dependencies": {
        "arg": "4.1.2"
      }
    })
  }
})
  return path
}
