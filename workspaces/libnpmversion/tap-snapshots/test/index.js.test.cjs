/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/index.js TAP all the defaults > must match snapshot 1`] = `
Array [
  "from-git",
  Object {
    "allowSameVersion": false,
    "commitHooks": true,
    "cwd": "{CWD}",
    "force": false,
    "gitTagVersion": true,
    "ignoreScripts": false,
    "message": "v%s",
    "path": "{CWD}",
    "pkg": Object {
      "name": "package from rj",
    },
    "preid": null,
    "scriptShell": undefined,
    "signGitCommit": false,
    "signGitTag": false,
    "tagVersionPrefix": "v",
  },
]
`

exports[`test/index.js TAP set the package ahead of time > must match snapshot 1`] = `
Array [
  "major",
  Object {
    "allowSameVersion": true,
    "commitHooks": false,
    "cwd": "/some/path",
    "force": true,
    "gitTagVersion": false,
    "ignoreScripts": true,
    "message": "hello, i have a message for you",
    "path": "/some/path",
    "pkg": Object {
      "name": "package set in options",
    },
    "preid": "rc",
    "scriptShell": "/bin/bash",
    "signGitCommit": true,
    "signGitTag": true,
    "tagVersionPrefix": "=",
  },
]
`
