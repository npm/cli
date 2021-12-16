// generated from test/fixtures/prune-dev-bins
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    ".bin": {
      "yes": process.platform === 'win32' ? '' : t.fixture('symlink', "../yes/yes.js"),
      "yes.cmd": "PLAIN FILE\n"
    },
    "yes": {
      "package.json": JSON.stringify({
        "_from": "yes@^1.0.0",
        "_id": "yes@1.1.1",
        "_inBundle": false,
        "_integrity": "sha1-N9/SD0IJE5JlflhCN4pw2MGthuY=",
        "_location": "/yes",
        "_phantomChildren": {},
        "_requested": {
          "type": "range",
          "registry": true,
          "raw": "yes@^1.0.0",
          "name": "yes",
          "escapedName": "yes",
          "rawSpec": "^1.0.0",
          "saveSpec": null,
          "fetchSpec": "^1.0.0"
        },
        "_requiredBy": [
          "#DEV:/"
        ],
        "_resolved": "https://registry.npmjs.org/yes/-/yes-1.1.1.tgz",
        "_shasum": "37dfd20f42091392657e5842378a70d8c1ad86e6",
        "_spec": "yes@^1.0.0",
        "_where": "/Users/claudiahdz/npm/arborist/test/fixtures/prune-dev-bins",
        "author": {
          "name": "Sequoia McDowell",
          "email": "sequoia.mcdowell@gmail.com",
          "url": "https://sequoia.makes.software/"
        },
        "bin": {
          "yes": "yes.js"
        },
        "bugs": {
          "url": "https://github.com/Sequoia/yes/issues"
        },
        "bundleDependencies": false,
        "contributors": [
          {
            "name": "Matt Nathan",
            "url": "https://github.com/mattnathan"
          }
        ],
        "deprecated": false,
        "description": "outputs 'y' over and over (or another string if you pass one)",
        "homepage": "https://github.com/Sequoia/yes#readme",
        "keywords": [
          "yes",
          "cli",
          "unix",
          "modular",
          "small-modules",
          "such-modular",
          "composable"
        ],
        "license": "GPL-3.0",
        "name": "yes",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/Sequoia/yes.git"
        },
        "scripts": {
          "test": "echo \"Error: todo: write tests\" && exit 1"
        },
        "version": "1.1.1"
      }),
      "yes.js": `#!/usr/bin/env node
var msg = process.argv.length > 2 ? process.argv[2] : 'y';

while(1){
  if(!process.stdout.write(msg + '\\r\\n')){
    process.exit(0);
  }
}

`
    }
  },
  "package.json": JSON.stringify({
    "name": "prune-dev-bins",
    "version": "1.0.0",
    "devDependencies": {
      "yes": "^1.0.0"
    }
  })
})
  return path
}
