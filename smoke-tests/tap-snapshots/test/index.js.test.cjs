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

    access, approve-scripts, audit, bugs, cache, ci,
    completion, config, dedupe, deny-scripts, deprecate, diff,
    dist-tag, docs, doctor, edit, exec, explain, explore,
    find-dupes, fund, get, help, help-search, init, install,
    install-ci-test, install-scripts, install-test, link, ll,
    login, logout, ls, org, outdated, owner, pack, patch, ping,
    pkg, prefix, profile, prune, publish, query, rebuild, repo,
    restart, root, run, sbom, search, set, stage, start, stop,
    team, test, token, trust, undeprecate, uninstall, unpublish,
    update, version, view, whoami

Specify configs in the ini-formatted file:
    {NPM}/{TESTDIR}/home/.npmrc
or on the command line via: npm <command> --key=value

More configuration info: npm help config
Configuration fields: npm help 7 config

npm {NPM}
`

exports[`test/index.js TAP basic npm ci > should throw mismatch deps in lock file error 1`] = `
npm error code EUSAGE
npm error
npm error \`npm ci\` can only install packages when your package.json and package-lock.json are in sync. Please update your lock file with \`npm install\` before continuing.
npm error
npm error Invalid: lock file's abbrev@1.0.4 does not satisfy abbrev@1.1.1
npm error
npm error Clean install a project
npm error
npm error Usage:
npm error npm ci
npm error
npm error Options:
npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
npm error [--no-bin-links] [--no-fund] [--dry-run]
npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
npm error [--workspaces] [--include-workspace-root] [--install-links]
npm error
npm error   --install-strategy
npm error     Sets the strategy for installing packages in node_modules. hoisted (default): Install non-duplicated in top-level, and duplicated as necessary within directory structure. nested: (formerly --legacy-bundling) install in place, no hoisting. shallow (formerly --global-style) only install direct deps at top-level. linked: install in node_modules/.store, link in place, unhoisted. We recommend that package authors use \`--install-strategy=linked\` during development to catch undeclared ("phantom") dependencies before publishing: the isolated layout only exposes a package's declared dependencies, so an \`import\` of a package that was never added to \`package.json\` can fail instead of resolving by accident and shipping broken. See [Catching undeclared ("phantom") dependencies](/using-npm/developers#catching-undeclared-phantom-dependencies).
npm error
npm error   --legacy-bundling
npm error     Instead of hoisting package installs in \`node_modules\`, install packages in the same manner that they are depended on. This may cause very deep directory structures and duplicate package installs as there is no de-duplicating. Sets \`--install-strategy=nested\`.
npm error
npm error   --global-style
npm error     Only install direct dependencies in the top level \`node_modules\`, but hoist on deeper dependencies. Sets \`--install-strategy=shallow\`.
npm error
npm error   --omit
npm error     Dependency types to omit from the installation tree on disk. Note that these dependencies _are_ still resolved and added to the \`package-lock.json\` file.  They are just not physically installed on disk. If a package type appears in both the \`--include\` and \`--omit\` lists, then it will be included. If the resulting omit list includes \`'dev'\`, then the \`NODE_ENV\` environment variable will be set to \`'production'\` for all lifecycle scripts.
npm error
npm error   --include
npm error     Option that allows for defining which types of dependencies to install. This is the inverse of \`--omit=<type>\`. Dependency types specified in \`--include\` will not be omitted, regardless of the order in which omit/include are specified on the command-line.
npm error
npm error   --strict-peer-deps
npm error     If set to \`true\`, and \`--legacy-peer-deps\` is not set, then _any_ conflicting \`peerDependencies\` will be treated as an install failure, even if npm could reasonably guess the appropriate resolution based on non-peer dependency relationships. By default, conflicting \`peerDependencies\` deep in the dependency graph will be resolved using the nearest non-peer dependency specification, even if doing so will result in some packages receiving a peer dependency outside the range set in their package's \`peerDependencies\` object. When such an override is performed, a warning is printed, explaining the conflict and the packages involved.  If \`--strict-peer-deps\` is set, then this warning is treated as a failure.
npm error
npm error   --foreground-scripts
npm error     Run all build scripts (ie, \`preinstall\`, \`install\`, and \`postinstall\`) scripts for installed packages in the foreground process, sharing standard input, output, and error with the main npm process. Note that this will generally make installs run slower, and be much noisier, but can be useful for debugging.
npm error
npm error   --ignore-scripts
npm error     If true, npm does not run scripts specified in package.json files. Note that commands explicitly intended to run a particular script, such as \`npm start\`, \`npm stop\`, \`npm restart\`, \`npm test\`, and \`npm run\` will still run their intended script if \`ignore-scripts\` is set, but they will *not* run any pre- or post-scripts. Setting \`ignore-scripts\` also disables \`.npm-extension\` execution, as if \`ignore-extension\` were set.
npm error
npm error   --allow-directory
npm error     Limits the ability for npm to install dependencies from directories. That is, dependencies that point to a directory instead of a version or semver range. Please note that this could leave your tree incomplete and some packages may not function as intended or designed. Changing this setting will not remove dependencies that are already installed. \`all\` allows any directories to be installed. \`none\` prevents any directories from being installed. \`root\` only allows directories defined in your project's package.json to be installed.  Also allows directory dependencies to be used for other commands like \`npm view\`
npm error
npm error   --allow-file
npm error     Limits the ability for npm to install dependencies from tarball files. That is, dependencies that point to a local tarball file instead of a version or semver range. Please note that this could leave your tree incomplete and some packages may not function as intended or designed. Changing this setting will not remove dependencies that are already installed. \`all\` allows any tarball file to be installed. \`none\` prevents any tarball file from being installed. \`root\` only allows tarball files defined in your project's package.json to be installed.  Also allows tarball file dependencies to be used for other commands like \`npm view\`
npm error
npm error   --allow-git
npm error     Limits the ability for npm to fetch dependencies from git references. That is, dependencies that point to a git repo instead of a version or semver range. Please note that this could leave your tree incomplete and some packages may not function as intended or designed. Changing this setting will not remove dependencies that are already installed. As of npm 12 the default is \`none\`. Git dependencies run \`git\` against a remote repo and may install configuration the project does not control. Opt in explicitly per project (in \`.npmrc\`) or per command (on the CLI) when you need git deps. \`all\` allows any git dependencies to be fetched and installed. \`none\` prevents any git dependencies from being fetched and installed. \`root\` only allows git dependencies defined in your project's package.json to be fetched and installed.  Also allows git dependencies to be fetched for other commands like \`npm view\`
npm error
npm error   --allow-remote
npm error     Limits the ability for npm to fetch dependencies from urls. That is, dependencies that point to a tarball url instead of a version or semver range. Please note that this could leave your tree incomplete and some packages may not function as intended or designed. Changing this setting will not remove dependencies that are already installed. As of npm 12 the default is \`none\`. Tarballs that share a hostname with the configured registry (the typical case for the npm registry, GitHub Packages, and most private registries) are still installed normally. If your registry serves tarballs from a different host, set \`replace-registry-host\` or override this setting. Opt in explicitly per project (in \`.npmrc\`) or per command (on the CLI) when you intentionally install from a URL. \`all\` allows any url to be installed. \`none\` prevents any url from being installed. \`root\` only allows urls defined in your project's package.json to be installed.  Also allows url dependencies to be used for other commands like \`npm view\`
npm error
npm error   --allow-scripts
npm error     Comma-separated list of packages whose install-time lifecycle scripts (\`preinstall\`, \`install\`, \`postinstall\`, and \`prepare\` for non-registry dependencies) are allowed to run. This setting is intended for one-off and global contexts: \`npm exec\`, \`npx\`, and \`npm install -g\`, where no project \`package.json\` is involved. For team-wide policy in a project, use the \`allowScripts\` field in \`package.json\` (which also supports explicit denials), or configure it in \`.npmrc\`. Passing \`--allow-scripts\` on the command line during a project-scoped \`npm install\`, \`ci\`, \`update\`, or \`rebuild\` is an error. Each name is matched against a dependency's resolved identity, not against the package's self-reported name. \`--ignore-scripts\` and \`--dangerously-allow-all-scripts\` both override this setting.
npm error
npm error   --strict-allow-scripts
npm error     If \`true\`, turn the install-script policy from a warning into a hard error: any dependency with install scripts that is not covered by \`allowScripts\` will fail the install instead of being blocked with a warning. Dependencies explicitly denied with \`false\` in \`allowScripts\` are always silently skipped; this setting only affects unreviewed entries (packages with install scripts that are neither approved nor denied). \`--ignore-scripts\` and \`--dangerously-allow-all-scripts\` both override this setting. Optional dependencies that cannot be installed on the current platform or engine (a non-matching \`os\`, \`cpu\`, or \`libc\`) are not flagged, because their install scripts never run.
npm error
npm error   --dangerously-allow-all-scripts
npm error     If \`true\`, bypass the \`allowScripts\` policy entirely and run every dependency install script regardless of whether it was approved or denied. Intended as a migration escape hatch only; its use is strongly discouraged. \`--ignore-scripts\` still takes precedence over this setting.
npm error
npm error   --audit
npm error     When "true" submit audit reports alongside the current npm command to the default registry and all registries configured for scopes.  See the documentation for [\`npm audit\`](/commands/npm-audit) for details on what is submitted.
npm error
npm error   --bin-links
npm error     Tells npm to create symlinks (or \`.cmd\` shims on Windows) for package executables. Set to false to have it not do this.  This can be used to work around the fact that some file systems don't support symlinks, even on ostensibly Unix systems.
npm error
npm error   --fund
npm error     When "true" displays the message at the end of each \`npm install\` acknowledging the number of dependencies looking for funding. See [\`npm fund\`](/commands/npm-fund) for details.
npm error
npm error   --dry-run
npm error     Indicates that you don't want npm to make any changes and that it should only report what it would have done.  This can be passed into any of the commands that modify your local installation, eg, \`install\`, \`update\`, \`dedupe\`, \`uninstall\`, as well as \`pack\` and \`publish\`. Note: This is NOT honored by other network related commands, eg \`dist-tags\`, \`owner\`, etc.
npm error
npm error   -w|--workspace
npm error     Enable running a command in the context of the configured workspaces of the current project while filtering by running only the workspaces defined by this configuration option. Valid values for the \`workspace\` config are either: * Workspace names * Path to a workspace directory * Path to a parent workspace directory (will result in selecting all workspaces within that folder) When set for the \`npm init\` command, this may be set to the folder of a workspace which does not yet exist, to create the folder and set it up as a brand new workspace within the project.
npm error
npm error   --workspaces
npm error     Set to true to run the command in the context of **all** configured workspaces. Explicitly setting this to false will cause commands like \`install\` to ignore workspaces altogether. When not set explicitly: - Commands that operate on the \`node_modules\` tree (install, update, etc.) will link workspaces into the \`node_modules\` folder. - Commands that do other things (test, exec, publish, etc.) will operate on the root project, _unless_ one or more workspaces are specified in the \`workspace\` config.
npm error
npm error   --include-workspace-root
npm error     Include the workspace root when workspaces are enabled for a command. When false, specifying individual workspaces via the \`workspace\` config, or all workspaces via the \`workspaces\` flag, will cause npm to operate only on the specified workspaces, and not on the root project.
npm error
npm error   --install-links
npm error     When set file: protocol dependencies will be packed and installed as regular dependencies instead of creating a symlink. This option has no effect on workspaces.
npm error
npm error
npm error aliases: clean-install, ic, install-clean, isntall-clean
npm error
npm error Run "npm help ci" for more info
npm error A complete log of this run can be found in: {NPM}/{TESTDIR}/cache/_logs/{LOG}
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
  "type": "commonjs"
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
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "devDependencies": Object {
    "promise-all-reject-late": "^5.0.0",
  },
  "keywords": Array [],
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "type": "commonjs",
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
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "type": "commonjs",
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
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "type": "commonjs",
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm pkg > should have expected npm pkg set modified package.json result 1`] = `
Object {
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
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
  "type": "commonjs",
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm pkg > should have expected pkg delete output 1`] = `

`

exports[`test/index.js TAP basic npm pkg > should have expected pkg get output 1`] = `

`

exports[`test/index.js TAP basic npm pkg > should have expected pkg set output 1`] = `

`

exports[`test/index.js TAP basic npm pkg > should print package.json contents 1`] = `
name = 'project'
version = '1.0.0'
description = ''
main = 'index.js'
scripts = {
  test: 'echo "Error: no test specified" && exit 1',
  hello: 'echo Hello'
}
keywords = []
type = 'commonjs'
dependencies = { abbrev: '^1.0.4' }
tap = { 'test-env': [ 'LC_ALL=sk' ] }
`

exports[`test/index.js TAP basic npm pkg set scripts > should have expected script added package.json result 1`] = `
Object {
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "devDependencies": Object {
    "promise-all-reject-late": "^5.0.0",
  },
  "keywords": Array [],
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "type": "commonjs",
  "version": "1.0.0",
}
`

exports[`test/index.js TAP basic npm pkg set scripts > should have expected set-script output 1`] = `

`

exports[`test/index.js TAP basic npm prefix > should have expected prefix output 1`] = `
{NPM}/{TESTDIR}/project
`

exports[`test/index.js TAP basic npm run > should have expected run output 1`] = `
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
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "keywords": Array [],
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "type": "commonjs",
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
  "dependencies": Object {
    "abbrev": "^1.0.4",
  },
  "description": "",
  "devDependencies": Object {
    "promise-all-reject-late": "^5.0.0",
  },
  "keywords": Array [],
  "main": "index.js",
  "name": "project",
  "scripts": Object {
    "hello": "echo Hello",
    "test": "echo /"Error: no test specified/" && exit 1",
  },
  "type": "commonjs",
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
