// generated from test/fixtures/testing-asymmetrical-bin-with-lock
module.exports = t => {
  const path = t.testdir({
  "a": {
    "package.json": JSON.stringify({
      "name": "a",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "@ruyadorno/package-with-added-bin": "^1.0.0"
      }
    })
  },
  "b": {
    "file.js": `#!/usr/bin/env node

console.log('foo')
`,
    "package.json": JSON.stringify({
      "name": "b",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "bin": {
        "b": "file.js"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "@ruyadorno/package-with-added-bin": "^2.0.0"
      }
    })
  },
  "package-lock.json": JSON.stringify({
    "name": "test-bin-added-transitive-deps",
    "version": "1.0.0",
    "lockfileVersion": 1,
    "requires": true,
    "dependencies": {
      "a": {
        "version": "file:a",
        "requires": {
          "@ruyadorno/package-with-added-bin": "^1.0.0"
        },
        "dependencies": {
          "@ruyadorno/package-with-added-bin": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/@ruyadorno/package-with-added-bin/-/package-with-added-bin-1.0.0.tgz",
            "integrity": "sha512-hdo4fqsQASK9NDsw47yAjrMK0qVfnjW0fwQFz546ygzyoN96X2zOBf8Ri32lvFmjswtF/UyJterBnWhNHk7omQ=="
          }
        }
      },
      "b": {
        "version": "file:b",
        "requires": {
          "@ruyadorno/package-with-added-bin": "^2.0.0"
        },
        "dependencies": {
          "@ruyadorno/package-with-added-bin": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/@ruyadorno/package-with-added-bin/-/package-with-added-bin-2.0.0.tgz",
            "integrity": "sha512-TjszCDj6g98yvljxbDw9TjSvq6kjfxUZKd9Eew5gNuHZiaqLKiX99XXVP+671z8Qhjmbbr+nPVf1pH9xuNP9Gw=="
          }
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "test-bin-added-transitive-deps",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
      "a": "file:a",
      "b": "file:b"
    }
  })
})
  return path
}
