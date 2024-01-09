// generated from test/fixtures/shrinkwrapped-dep-with-lock-empty
module.exports = t => {
  const path = t.testdir({
  "README.md": "Just a module that depends on a module that ships a shrinkwrap.\n",
  "package-lock.json": JSON.stringify({
    "name": "shrinkwrap",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "shrinkwrap",
        "version": "1.0.0",
        "license": "ISC",
        "dependencies": {
          "@isaacs/shrinkwrapped-dependency": "^1.0.0"
        }
      },
      "node_modules/@isaacs/shrinkwrapped-dependency": {
        "name": "@isaacs/shrinkwrapped-dependency",
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/shrinkwrapped-dependency/-/shrinkwrapped-dependency-1.0.0.tgz",
        "integrity": "sha512-9OAp7wVNnaxbqHi6n+AALGvSmZ/nJPGWKBNUr/RuGpVitaT54KCbwIHPA1sOwowUFaooDggoB8Jtk/aBOWwKoQ==",
        "hasShrinkwrap": true,
        "license": "ISC",
        "dependencies": {
          "abbrev": "^1.0.4"
        }
      },
      "node_modules/@isaacs/shrinkwrapped-dependency/node_modules/abbrev": {
        "name": "abbrev",
        "version": "1.0.4",
        "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
        "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0=",
        "license": "MIT"
      }
    },
    "dependencies": {
      "@isaacs/shrinkwrapped-dependency": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@isaacs/shrinkwrapped-dependency/-/shrinkwrapped-dependency-1.0.0.tgz",
        "integrity": "sha512-9OAp7wVNnaxbqHi6n+AALGvSmZ/nJPGWKBNUr/RuGpVitaT54KCbwIHPA1sOwowUFaooDggoB8Jtk/aBOWwKoQ==",
        "requires": {
          "abbrev": "^1.0.4"
        },
        "dependencies": {
          "abbrev": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz",
            "integrity": "sha1-vVWuXkE7oXIu5Mq6H26hBBSlns0="
          }
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "shrinkwrap",
    "version": "1.0.0",
    "license": "ISC",
    "dependencies": {
      "@isaacs/shrinkwrapped-dependency": "^1.0.0"
    }
  })
})
  return path
}
