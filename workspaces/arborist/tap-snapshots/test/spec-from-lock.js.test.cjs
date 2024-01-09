/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/spec-from-lock.js TAP > completely invalid, return empty object 1`] = `
Object {}
`

exports[`test/spec-from-lock.js TAP > directory symlink 1`] = `
Result {
  "escapedName": "x",
  "fetchSpec": "{..}/some/path",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "x",
  "raw": "x@file:../some/path",
  "rawSpec": "file:../some/path",
  "registry": undefined,
  "saveSpec": "file:../some/path",
  "scope": undefined,
  "type": "directory",
  "where": "{CWD}",
}
`

exports[`test/spec-from-lock.js TAP > file with from, no integrity 1`] = `
Result {
  "escapedName": "x",
  "fetchSpec": "{CWD}/x-1.2.3.tgz",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "x",
  "raw": "x@x-1.2.3.tgz",
  "rawSpec": "x-1.2.3.tgz",
  "registry": undefined,
  "saveSpec": "file:x-1.2.3.tgz",
  "scope": undefined,
  "type": "file",
  "where": "{CWD}",
}
`

exports[`test/spec-from-lock.js TAP > file with resolved and from 1`] = `
Result {
  "escapedName": "x",
  "fetchSpec": "/path/to/x-1.2.3.tgz",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "x",
  "raw": "x@/path/to/x-1.2.3.tgz",
  "rawSpec": "/path/to/x-1.2.3.tgz",
  "registry": undefined,
  "saveSpec": "file:/path/to/x-1.2.3.tgz",
  "scope": undefined,
  "type": "file",
  "where": "{CWD}",
}
`

exports[`test/spec-from-lock.js TAP > file with resolved, no integrity 1`] = `
Result {
  "escapedName": "x",
  "fetchSpec": "/path/to/x-1.2.3.tgz",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "x",
  "raw": "x@/path/to/x-1.2.3.tgz",
  "rawSpec": "/path/to/x-1.2.3.tgz",
  "registry": undefined,
  "saveSpec": "file:/path/to/x-1.2.3.tgz",
  "scope": undefined,
  "type": "file",
  "where": "{CWD}",
}
`

exports[`test/spec-from-lock.js TAP > git repo with resolved value 1`] = `
Result {
  "escapedName": "gitthing",
  "fetchSpec": "ssh://git@github.com/isaacs/abbrev-js.git",
  "gitCommittish": "a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": GitHost {
    "auth": null,
    "blobpath": "blob",
    "browseblobtemplate": "function browseblobtemplate",
    "browsetemplate": "function browsetemplate",
    "browsetreetemplate": "function browsetreetemplate",
    "bugstemplate": "function bugstemplate",
    "committish": "a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
    "default": "sshurl",
    "docstemplate": "function docstemplate",
    "domain": "github.com",
    "editpath": "edit",
    "edittemplate": "function edittemplate",
    "extract": "function extract",
    "filetemplate": "function filetemplate",
    "gittemplate": "function gittemplate",
    "hashformat": "function hashformat",
    "httpstemplate": "function httpstemplate",
    "opts": Object {
      "noCommittish": true,
      "noGitPlus": true,
    },
    "pathtemplate": "function pathtemplate",
    "project": "abbrev-js",
    "protocols": Array [
      "git:",
      "http:",
      "git+ssh:",
      "git+https:",
      "ssh:",
      "https:",
    ],
    "shortcuttemplate": "function shortcuttemplate",
    "sshtemplate": "function sshtemplate",
    "sshurltemplate": "function sshurltemplate",
    "tarballtemplate": "function tarballtemplate",
    "treepath": "tree",
    "type": "github",
    "user": "isaacs",
  },
  "name": "gitthing",
  "raw": "gitthing@git+ssh://git@github.com/isaacs/abbrev-js#a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
  "rawSpec": "git+ssh://git@github.com/isaacs/abbrev-js#a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
  "registry": undefined,
  "saveSpec": "git+ssh://git@github.com/isaacs/abbrev-js.git#a9ee72ebc8fe3975f1b0c7aeb3a8f2a806a432eb",
  "scope": undefined,
  "type": "git",
  "where": undefined,
}
`

exports[`test/spec-from-lock.js TAP > legacy metadata with "from" and no integrity 1`] = `
Result {
  "escapedName": "legacy",
  "fetchSpec": "1.2.3",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "legacy",
  "raw": "legacy@1.2.3",
  "rawSpec": "1.2.3",
  "registry": true,
  "saveSpec": null,
  "scope": undefined,
  "type": "version",
  "where": undefined,
}
`

exports[`test/spec-from-lock.js TAP > version (file) and integrity set 1`] = `
Result {
  "escapedName": "x",
  "fetchSpec": "{CWD}/foo.tgz",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "x",
  "raw": "x@foo.tgz",
  "rawSpec": "foo.tgz",
  "registry": undefined,
  "saveSpec": "file:foo.tgz",
  "scope": undefined,
  "type": "file",
  "where": "{CWD}",
}
`

exports[`test/spec-from-lock.js TAP > version and integrity 1`] = `
Result {
  "escapedName": "x",
  "fetchSpec": "1.2.3",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "x",
  "raw": "x@1.2.3",
  "rawSpec": "1.2.3",
  "registry": true,
  "saveSpec": null,
  "scope": undefined,
  "type": "version",
  "where": undefined,
}
`

exports[`test/spec-from-lock.js TAP > version and range, no integrity 1`] = `
Result {
  "escapedName": "x",
  "fetchSpec": "1.2.3",
  "gitCommittish": undefined,
  "gitRange": undefined,
  "gitSubdir": undefined,
  "hosted": undefined,
  "name": "x",
  "raw": "x@1.2.3",
  "rawSpec": "1.2.3",
  "registry": true,
  "saveSpec": null,
  "scope": undefined,
  "type": "version",
  "where": undefined,
}
`
