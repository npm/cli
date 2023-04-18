/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/index.js TAP basic npm (no args) > should have expected no args output 1`] = `
npm <command>

Usage:

npm install        install all the dependencies in your project
npm install <foo>  add the <foo> dependency to your project
npm test           run this project's tests
npm run <foo>      run the script named <foo>
npm <command> -h   quick help on <command>
npm -l             display usage info for all commands
npm help <term>    search for help on <term>
npm help npm       more involved overview

All commands:

    access, adduser, audit, bugs, cache, ci, completion,
    config, dedupe, deprecate, diff, dist-tag, docs, doctor,
    edit, exec, explain, explore, find-dupes, fund, get, help,
    help-search, hook, init, install, install-ci-test,
    install-test, link, ll, login, logout, ls, org, outdated,
    owner, pack, ping, pkg, prefix, profile, prune, publish,
    query, rebuild, repo, restart, root, run-script, search,
    set, shrinkwrap, star, stars, start, stop, team, test,
    token, uninstall, unpublish, unstar, update, version, view,
    whoami

Specify configs in the ini-formatted file:
    {NPM}/{TESTDIR}/project/.npmrc
or on the command line via: npm <command> --key=value

More configuration info: npm help config
Configuration fields: npm help 7 config

npm {NPM}
`

exports[`test/index.js TAP basic npm ci > should throw mismatch deps in lock file error 1`] = `
npm ERR! code EUSAGE
npm ERR! 
npm ERR! \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with \`npm install\` before continuing.
npm ERR! 
npm ERR! Invalid: lock file's abbrev@1.0.4 does not satisfy abbrev@1.1.1
npm ERR! 
npm ERR! Clean install a project
npm ERR! 
npm ERR! Usage:
npm ERR! npm ci
npm ERR! 
npm ERR! Options:
npm ERR! [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
npm ERR! [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
npm ERR! [--strict-peer-deps] [--no-package-lock] [--foreground-scripts]
npm ERR! [--ignore-scripts] [--no-audit] [--no-bin-links] [--no-fund] [--dry-run]
npm ERR! [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
npm ERR! [-ws|--workspaces] [--include-workspace-root] [--install-links]
npm ERR! 
npm ERR! aliases: clean-install, ic, install-clean, isntall-clean
npm ERR! 
npm ERR! Run "npm help ci" for more info

npm ERR! A complete log of this run can be found in: {NPM}/{TESTDIR}/cache/_logs/{LOG}
`

exports[`test/index.js TAP basic npm diff > should have expected diff output 1`] = `
diff --git a/index.js b/index.js
index v1.0.4..v1.1.1 100644
--- a/index.js
+++ b/index.js
@@ -1,1 +1,1 @@
-module.exports = "1.0.4"
/ No newline at end of file
+module.exports = "1.1.1"
/ No newline at end of file
diff --git a/package.json b/package.json
index v1.0.4..v1.1.1 100644
--- a/package.json
+++ b/package.json
@@ -1,4 +1,4 @@
 {
   "name": "abbrev",
-  "version": "1.0.4"
+  "version": "1.1.1"
 }
/ No newline at end of file
`

exports[`test/index.js TAP basic npm explain > should have expected explain output 1`] = `
abbrev@1.0.4
node_modules/abbrev
  abbrev@"^1.0.4" from the root project
`

exports[`test/index.js TAP basic npm fund > should have expected fund output 1`] = `
project@1.0.0
\`-- https://github.com/sponsors
    \`-- promise-all-reject-late@5.0.0
`

exports[`test/index.js TAP basic npm init > should have successful npm init result 1`] = `
Wrote to {NPM}/{TESTDIR}/project/package.json:

{
  "name": "project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo /"Error: no test specified/" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
`

exports[`test/index.js TAP basic npm install dev dep > should have expected dev dep added lockfile result 1`] = `
Object {
  "lockfileVersion": 3,
  "name": "project",
  "packages": Object {
    "": Object {
      "dependencies": Object {
        "abbrev": "^1.0.4",
      },
      "devDependencies": Object {
        "promise-all-reject-late": "^5.0.0",
      },
      "license": "ISC",
      "name": "project",
      "version": "1.0.0",
    },
    "node_modules/abbrev": Object {
      "resolved": "{REGISTRY}/abbrev/-/abbrev-1.0.4.tgz",
      "version": "1.0.4",
    },
    "node_modules/promise-all-reject-late": Object {
      "dev": true,
      "funding": Object {
        "url": "https://github.com/sponsors",
      },
      "resolved": "{REGISTRY}/promise-all-reject-late/-/promise-all-reject-late-5.0.0.tgz",
      "version": "5.0.0",
    },
  },
  "requires": true,
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm install dev dep > should have expected dev dep added package.json result 1`] = `
Object {
  "author": "",
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "devDependencies": Object {
    "promise-all-reject-late": "^5.0.0",
  },
  "keywords": Array [],
  "license": "ISC",
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm install dev dep > should have expected dev dep added reify output 1`] = `
added 1 package in {TIME}

1 package is looking for funding
  run \`npm fund\` for details
`

exports[`test/index.js TAP basic npm install prodDep@version > should have expected install reify output 1`] = `
added 1 package in {TIME}
`

exports[`test/index.js TAP basic npm install prodDep@version > should have expected lockfile result 1`] = `
Object {
  "lockfileVersion": 3,
  "name": "project",
  "packages": Object {
    "": Object {
      "dependencies": Object {
        "abbrev": "^1.0.4",
      },
      "license": "ISC",
      "name": "project",
      "version": "1.0.0",
    },
    "node_modules/abbrev": Object {
      "resolved": "{REGISTRY}/abbrev/-/abbrev-1.0.4.tgz",
      "version": "1.0.4",
    },
  },
  "requires": true,
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm install prodDep@version > should have expected package.json result 1`] = `
Object {
  "author": "",
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
  "license": "ISC",
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm ls > should have expected ls output 1`] = `
project@1.0.0 {NPM}/{TESTDIR}/project
+-- abbrev@1.0.4
\`-- promise-all-reject-late@5.0.0
`

exports[`test/index.js TAP basic npm outdated > should have expected outdated output 1`] = `
Package  Current  Wanted  Latest  Location             Depended by
abbrev     1.0.4   1.1.1   1.1.1  node_modules/abbrev  project
`

exports[`test/index.js TAP basic npm pkg > should have expected npm pkg delete modified package.json result 1`] = `
Object {
  "author": "",
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
  "license": "ISC",
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm pkg > should have expected npm pkg set modified package.json result 1`] = `
Object {
  "author": "",
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
  "license": "ISC",
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "tap": Object {
    "test-env": Array [
      "LC_ALL=sk",
    ],
  },
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm pkg > should have expected pkg delete output 1`] = `

`

exports[`test/index.js TAP basic npm pkg > should have expected pkg get output 1`] = `
"ISC"
`

exports[`test/index.js TAP basic npm pkg > should have expected pkg set output 1`] = `

`

exports[`test/index.js TAP basic npm pkg > should print package.json contents 1`] = `
{
  "name": "project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo /"Error: no test specified/" && exit 1",
    "hello": "echo Hello"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "abbrev": "^1.0.4"
  },
  "tap": {
    "test-env": [
      "LC_ALL=sk"
    ]
  }
}
`

exports[`test/index.js TAP basic npm pkg set scripts > should have expected script added package.json result 1`] = `
Object {
  "author": "",
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "devDependencies": Object {
    "promise-all-reject-late": "^5.0.0",
  },
  "keywords": Array [],
  "license": "ISC",
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm pkg set scripts > should have expected set-script output 1`] = `

`

exports[`test/index.js TAP basic npm prefix > should have expected prefix output 1`] = `
{NPM}/{TESTDIR}/project
`

exports[`test/index.js TAP basic npm run-script > should have expected run-script output 1`] = `
> project@1.0.0 hello
> echo Hello

Hello
`

exports[`test/index.js TAP basic npm uninstall > should have expected uninstall lockfile result 1`] = `
Object {
  "lockfileVersion": 3,
  "name": "project",
  "packages": Object {
    "": Object {
      "dependencies": Object {
        "abbrev": "^1.0.4",
      },
      "license": "ISC",
      "name": "project",
      "version": "1.0.0",
    },
    "node_modules/abbrev": Object {
      "resolved": "{REGISTRY}/abbrev/-/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
  },
  "requires": true,
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm uninstall > should have expected uninstall package.json result 1`] = `
Object {
  "author": "",
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
  "license": "ISC",
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm uninstall > should have expected uninstall reify output 1`] = `
removed 1 package in {TIME}
`

exports[`test/index.js TAP basic npm update dep > should have expected update lockfile result 1`] = `
Object {
  "lockfileVersion": 3,
  "name": "project",
  "packages": Object {
    "": Object {
      "dependencies": Object {
        "abbrev": "^1.0.4",
      },
      "devDependencies": Object {
        "promise-all-reject-late": "^5.0.0",
      },
      "license": "ISC",
      "name": "project",
      "version": "1.0.0",
    },
    "node_modules/abbrev": Object {
      "resolved": "{REGISTRY}/abbrev/-/abbrev-1.1.1.tgz",
      "version": "1.1.1",
    },
    "node_modules/promise-all-reject-late": Object {
      "dev": true,
      "funding": Object {
        "url": "https://github.com/sponsors",
      },
      "resolved": "{REGISTRY}/promise-all-reject-late/-/promise-all-reject-late-5.0.0.tgz",
      "version": "5.0.0",
    },
  },
  "requires": true,
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm update dep > should have expected update package.json result 1`] = `
Object {
  "author": "",
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "devDependencies": Object {
    "promise-all-reject-late": "^5.0.0",
  },
  "keywords": Array [],
  "license": "ISC",
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm update dep > should have expected update reify output 1`] = `
changed 1 package in {TIME}

1 package is looking for funding
  run \`npm fund\` for details
`

exports[`test/index.js TAP basic npm view > should have expected view output 1`] = `
abbrev@1.0.4 | Proprietary | deps: none | versions: 2
mocked test package

dist
.tarball: {REGISTRY}/abbrev/-/abbrev-1.0.4.tgz
.shasum: undefined

dist-tags:
latest: 1.1.1

published just now
`
