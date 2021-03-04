# Workspaces command examples

Sketch of commands and their output given a perspective in which npm
subcommands are all operating in a `workspaces=all` mode by default.

This approach assumes workspace filtering and opt-in/opt-out are set via
configuration values, e.g: `--workspace=a` / `-w a` OR `--workspaces`,
`--no-workspaces`.

**NOTE:** Except when noticed otherwise, all examples assume a very
simplistic workspace setup as such:

```
.
├── packages
│   ├── a
│   │   └── package.json
│   └── b
│       └── package.json
└── package.json
```

## Commands that just need context from package.json

- **defaults:** workspaces=false, workspace=[]

Runs the command in the context of each nested workspace when using the
`--workspaces` option.

Runs the command **only** in the workspaces defined in the `workspace` config.

- `docs`
- `diff`
- `dist-tag`
- `pack`
- `publish`
- `repo`
- `set-script`
- `unpublish`
- `view`

#### npm docs

Top-level run:

```
$ npm docs --no-browser
<name> docs available at the following URL:
  https://github.com/<org>/<repo>#readme
```

Run across all nested workspaces:

```
$ npm docs --workspaces --no-browser
<a-name> docs available at the following URL:
  https://github.com/<org>/<repo>#readme

<b-name> docs available at the following URL:
  https://github.com/<org>/<repo>#readme
```

Run across filtered workspaces:

```
$ npm docs --workspace=a --no-browser
<a-name> docs available at the following URL:
  https://github.com/<org>/<repo>#readme
```

#### npm diff

Given a workspace setup as such:

```
.
├── package.json
└── packages
    ├── libnpmdiff
    │   └── package.json
    └── libnpmfund
        └── package.json
```

Top-level run:

```patch
$ npm diff
diff --git a/package.json b/package.json
index v1.1.1..v2.0.0 100644
--- a/package.json
+++ b/package.json
@@ -1,9 +1,10 @@
 {
   "name": "abbrev",
-  "version": "1.1.1",
+  "version": "2.0.0",
   "description": "Like ruby's abbrev module, but in js",
   "author": "Isaac Z. Schlueter <i@izs.me>",
   "main": "abbrev.js",
+  "workspaces": ["packages/*"],
   "scripts": {
     "test": "tap test.js --100",
     "preversion": "npm test",
```

Run across all nested workspaces:

```patch
$ npm diff --workspaces
diff --git a/package.json b/package.json
index v1.0.2..v2.0.0 100644
--- a/package.json
+++ b/package.json
@@ -1,6 +1,6 @@
 {
   "name": "libnpmfund",
-  "version": "1.0.2",
+  "version": "2.0.0",
   "files": [
     "index.js"
   ],

diff --git a/package.json b/package.json
index v2.0.3..v3.0.0 100644
--- a/package.json
+++ b/package.json
@@ -1,6 +1,6 @@
 {
   "name": "libnpmdiff",
-  "version": "2.0.3",
+  "version": "3.0.0",
   "description": "The registry diff",
   "repository": "https://github.com/npm/libnpmdiff",
   "files": [
```

Run across filtered workspaces:

```patch
$ npm diff -w libnpmfund
diff --git a/package.json b/package.json
index v1.0.2..v2.0.0 100644
--- a/package.json
+++ b/package.json
@@ -1,6 +1,6 @@
 {
   "name": "libnpmfund",
-  "version": "1.0.2",
+  "version": "2.0.0",
   "files": [
     "index.js"
   ],
```

#### npm dist-tag

Top-level run:

```
$ npm dist-tag
latest: 1.1.1
```

Run across filtered workspaces:

```
$ npm dist-tag --workspace=libnpmfund
libnpmfund@latest: 1.0.2
```

Run across all nested workspaces:

```
$ npm dist-tag --workspaces
libnpmdiff@latest: 2.0.3
libnpmfund@latest: 1.0.2
```

Suggested tweaks/improvements:

- Add `<pkg-name>@` in front of tagnames+version in order to make UI clear
to what package that info belongs to.

#### npm pack

Top-level run:

```
$ npm pack
npm notice
npm notice 📦  abbrev@2.0.0
npm notice === Tarball Contents ===
npm notice 2.0kB LICENSE
npm notice 499B  README.md
npm notice 1.8kB abbrev.js
npm notice 549B  package.json
npm notice === Tarball Details ===
npm notice name:          abbrev
npm notice version:       2.0.0
npm notice filename:      abbrev-2.0.0.tgz
npm notice package size:  2.3 kB
npm notice unpacked size: 4.8 kB
npm notice shasum:        40584c072286572a8dbb0c604c530f1a6e59cf50
npm notice integrity:     sha512-lgJ/1ZXJuF2BE[...]UpGqEwGByr1vw==
npm notice total files:   4
npm notice
abbrev-2.0.0.tgz
```

Run across filtered workspaces:

```
$ npm pack --workspace=libnpmfund
npm notice
npm notice 📦  libnpmfund@1.0.2
npm notice === Tarball Contents ===
npm notice 53B   CHANGELOG.md
npm notice 738B  LICENSE
npm notice 3.8kB README.md
npm notice 4.6kB index.js
npm notice 997B  package.json
npm notice === Tarball Details ===
npm notice name:          libnpmfund
npm notice version:       1.0.2
npm notice filename:      libnpmfund-1.0.2.tgz
npm notice package size:  4.0 kB
npm notice unpacked size: 10.1 kB
npm notice shasum:        d9552d4b76dd7f0a1a61b7af6b8f27184e51b0f5
npm notice integrity:     sha512-Scw2JiLxfT7wq[...]b4mgYVQnqigjA==
npm notice total files:   5
npm notice
libnpmfund-1.0.2.tgz
```

Run across all nested workspaces:

```
```

## Custom behavior

### Reads from installed dependency tree

- **defaults:** workspaces=false, workspace=[]

Runs the command making sure to include pertinent info about deps/devDeps
when using `workspaces=true`.

Filter the **actual tree** to only include nodes from the workspaces defined
in the `workspace` config.

- `audit`
- `explain`
- `fund` List funding info for all **workspaces**
- `ls` List all packages including **workspaces**
- `outdated` List outdated **dependencies** including **workspaces** and its **dependencies**

### Modify installed dependency tree

- **defaults:** workspaces=**true**, workspace=[]

- `ci`
- `dedupe|find-dupes`
- `install-ci-test`
- `install-test`
- `install`
- `link`
- `rebuild`
- `update`
- `uninstall`
- `update`

### Other

- **defaults:** workspaces=false, workspace=[]

- `exec` Run exec in the context of specific **workspaces**
- `init` Initialize a new **workspace**
- `run-script|restart|start|stop|test` Run arbitrary **scripts** in all **workspaces**, skip any **workspace** that does not have a targetting **script**
- `version` Run version in the context of specific **workspaces**, needs tweaked commit msg, tag

#### npm test

Top-level run:

```
$ npm test
> try-npm7@1.0.0 test
> tap test.js --reporter tap --no-coverage

TAP version 13
ok 1 - test.js # time=15.044ms {
    ok 1 - top-level works
    1..1
    # time=15.044ms
}
```

Run across all nested workspaces:

```
$ npm test -w a
> a@1.0.0 test
> tap test.js --reporter tap --no-coverage

TAP version 13
ok 1 - test.js # time=15.535ms {
    ok 1 - a works!
    1..1
    # time=15.535ms
}

1..1
# time=254.36ms
```

Run across all nested workspaces:

```
$ npm test --workspaces
> a@1.0.0 test
> tap test.js --reporter tap --no-coverage

TAP version 13
ok 1 - test.js # time=15.535ms {
    ok 1 - a works!
    1..1
    # time=15.535ms
}

1..1
# time=254.36ms
> b@1.0.0 test
> tap test.js --reporter tap --no-coverage

TAP version 13
ok 1 - test.js # time=18.44ms {
    ok 1 - B works!
    1..1
    # time=18.44ms
}

1..1
# time=259.699ms
```

## Workspaces unaware commands:

Should just print a warning message letting users know that using any
workspaces-related config doesn't affect the current subcommand:

- `adduser|login`
- `bin`
- `birthday`
- `cache`
- `completion`
- `config|get|set`
- `deprecate`
- `doctor`
- `edit`
- `explore`
- `help`
- `help-search`
- `hook`
- `logout`
- `org`
- `owner`
- `ping`
- `prefix`
- `profile`
- `search`
- `shrinkwrap`
- `star`
- `team`
- `token`
- `unstar`
- `whoami`
- `workspaces`

