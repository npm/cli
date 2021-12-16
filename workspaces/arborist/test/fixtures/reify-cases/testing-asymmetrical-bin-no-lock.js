// generated from test/fixtures/testing-asymmetrical-bin-no-lock
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
