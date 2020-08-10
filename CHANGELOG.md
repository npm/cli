## v7.0.0-beta.3 (2020-08-10)

Bring back support for `npm audit --production`, fix a minor `npm version`
annoyance, and track down a very serious issue where a project could be
blown away when it matches a meta-dep in the tree.

* [`5fb217701`](https://github.com/npm/cli/commit/5fb217701c060e37a3fb4a2e985f80fb015157b9)
  [#1641](https://github.com/npm/cli/issues/1641) `@npmcli/arborist@0.0.15`
* [`3598fe1f2`](https://github.com/npm/cli/commit/3598fe1f2dfe6c55221bbac8aaf21feab74a936a)
  `@npmcli/arborist@0.0.16` Add support for `npm audit --production`
* [`8ba2aeaee`](https://github.com/npm/cli/commit/8ba2aeaeeb77718cb06fe577fdd56dcdcbfe9c52)
  `libnpmversion@1.0.3`

## v7.0.0-beta.2 (2020-08-07)

New notification style for updates, and a working doctor.

* [`cf2819210`](https://github.com/npm/cli/commit/cf2819210327952696346486002239f9fc184a3e)
  [#1622](https://github.com/npm/cli/pull/1622)
  Improve abbrevs for install and help
* [`d062b2c02`](https://github.com/npm/cli/commit/d062b2c02a4d6d5f1a274aa8eb9c5969ca6253db)
  new npm-specific update-notifier implementation
* [`f6d468a3b`](https://github.com/npm/cli/commit/f6d468a3b4bef0b3cc134065d776969869fca51e)
  update doctor command
* [`b8b4d77af`](https://github.com/npm/cli/commit/b8b4d77af836f8c49832dda29a0de1b3c2d39233)
  [#1638](https://github.com/npm/cli/pull/1638)
  Direct users to our GitHub issues instead of npm.community

## v7.0.0-beta.1 (2020-08-05)

Fix some issues found in the beta pubish process, and initial attempts to
use npm v7 with [citgm](https://github.com/nodejs/citgm/).

* [`2c305e8b7`](https://github.com/npm/cli/commit/2c305e8b7bfa28b07812df74f46983fad2cb85b6)
  output generated tarball filename
* [`0808328c9`](https://github.com/npm/cli/commit/0808328c93d9cd975837eeb53202ce3844e1cf70)
  pack: set correct filename for scoped packages
  ([@isaacs](https://github.com/isaacs))
* [`cf27df035`](https://github.com/npm/cli/commit/cf27df035cfba4f859d14859229bb90841b8fda6)
  `@npmcli/arborist@0.0.14` ([@isaacs](https://github.com/isaacs))

## v7.0.0-beta.0 (2020-08-04)

Major refactoring and overhaul of, well, pretty much everything.  Almost
all dependencies have been updated, many have been removed, and the entire
`Installer` class is moved into
[`@npmcli/arborist`](http://npm.im/@npmcli/arborist).

### Some High-level Changes and Improvements

- You can install GitHub pull requests by adding `#pull/<number>` to the
  git url.  So it'd be something like `npm install
  github:user/project#pull/123` to install PR number 123 of the
  `user/project` git repo.  You can of course also use this in
  dependencies, or anywhere else dependency specifiers are found.
- Initial Workspaces support is added.  If you `npm install` in a project
  with a `workspaces` declaration, npm will install all your sub-projects'
  dependencies as well, and link everything up proper.
- `npm exec` is added, to run any arbitrary command as if it was an npm
  script.  This is sort of like `npx`, which is also ported to use `npm
  exec` under the hood.
- `npm audit` output is tightened up, and prettified.  Audit can also now
  fix a few more classes of problems, sends far less data over the wire,
  and doesn't place blame on the wrong maintainers.  (Technically this is a
  breaking change if you depend on the specific audit output, but it's
  also a big improvement!)
- `npm install` got faster.  Like a lot faster.  "So fast you'll think it's
  broken" faster.  `npm ls` got even fasterer.  A lot of stuff sped up, is
  what we're saying.
- Support has been dropped for Node.js versions less than v10.

### On the "Breaking" in "Breaking Changes"

The Semantic Versioning specification precisely defines what constitutes a
"breaking" change.  In a nutshell, it's any change that causes a you to
change _your_ code in order to start using _our_ code.  We hasten to point
this out, because a "breaking change" does not mean that something about
the update is "broken", necessarily.

We're sure that some things likely _are_ broken in this beta, because beta
software, and a healthy pessimism about things.  But nothing is "broken" on
purpose here, and if you find a bug, we'd love for you to [let us
know](https://github.com/npm/cli/issues).

### Known Issues, and What's Missing From This Beta (Why Not GA?)

It's beta software!

#### Tests

We have not yet gotten to 100% test coverage of the npm CLI codebase.  As
such, there are almost certainly bugs lying in wait.  We _do_ have 100%
test coverage of most of the commands, and all recently-updated
dependencies in the npm stack, so it's certainly more well-tested than any
version of npm before.

#### Docs

The documentation is incorrect and out of date in most places.  Prior to a
GA release, we'll be going through all of our documentation with a
fine-toothed comb to minimize the lies that it tells.

#### Error Messaging

There are a few cases where this release will just say something failed,
and not give you as much help as we'd like.  We know, and we'll fix that
prior to the GA 7.0.0 release.

In particular, if you install a project that has conflicting
`peerDependencies` in the tree, it'll just say "Unable to resolve package
tree".  Prior to GA release, it'll tell you how to fix it.  (For the time
being, just run it again with `--legacy-peer-deps`, and that'll make it
operate like npm v6.)

#### Audit Issue

There is a known performance issue in some cases that we've identified
where `npm audit` can spin wildly out of control like a dancer gripped by a
fever, heating up your laptop with fires of passion and CPU work.  This
happens when a vulnerability is in a tree with a _lot_ of cross-linked
dependencies that all depend on one another.

We have a fix for it, but if you run into this issue, you can run with
`--no-audit` to tell npm to chill out a little bit.

That's about it!  It's ready to use, and you should try it out.

Now on to the list of **BREAKING CHANGES**!

### Programmatic Usage

- [RFC
  20](https://github.com/npm/rfcs/blob/latest/accepted/0020-npm-option-handling.md)
  The CLI and its dependencies no longer use the `figgy-pudding` library
  for configs.  Configuration is done using a flat plain old JavaScript
  object.
- The `lib/fetch-package-metadata.js` module is removed.  Use
  [`pacote`](http://npm.im/pacote) to fetch package metadata.
- [`@npmcli/arborist`](http://npm.im/@npmcli/arborist) should be used to do
  most things programmatically involving dependency trees.
- The `onload-script` option is no longer supported.
- The `log-stream` option is no longer supported.
- `npm.load()` MUST be called with two arguments (the parsed cli options
  and a callback).
- `npm.root` alias for `npm.dir` removed.
- The `package.json` in npm now defines an `exports` field, making it no
  longer possible to `require()` npm's internal modules.  (This was always
  a bad idea, but now it won't work.)

### All Registry Interactions

The following affect all commands that contact the npm registry.

- `referer` header no longer sent
- `npm-command` header added

### All Lifecycle Scripts

The environment for lifecycle scripts (eg, build scripts, `npm test`, etc.)
has changed.

- [RFC
  21](https://github.com/npm/rfcs/blob/latest/accepted/0021-reduce-lifecycle-script-environment.md)
  Environment no longer includes `npm_package_*` fields, or `npm_config_*`
  fields for default configs.  `npm_package_json`, `npm_package_integrity`,
  `npm_package_resolved`, and `npm_command` environment variables added.

    (NB: this [will change a bit prior to a `v7.0.0` GA
    release](https://github.com/npm/rfcs/pull/183))

- [RFC
  22](https://github.com/npm/rfcs/blob/latest/accepted/0022-quieter-install-scripts.md)
  Scripts run during the normal course of installation are silenced unless
  they exit in error (ie, with a signal or non-zero exit status code), and
  are for a non-optional dependency.

- [RFC
  24](https://github.com/npm/rfcs/blob/latest/accepted/0024-npm-run-traverse-directory-tree.md)
  `PATH` environment variable includes all `node_modules/.bin` folders,
  even if found outside of an existing `node_modules` folder hierarchy.

- The `user`, `group`, `uid`, `gid`, and `unsafe-perms` configurations are
  no longer relevant.  When npm is run as root, scripts are always run with
  the effective `uid` and `gid` of the working directory owner.

- Commands that just run a single script (`npm test`, `npm start`, `npm
  stop`, and `npm restart`) will now run their script even if
  `--ignore-scripts` is set.  Prior to the GA v7.0.0 release, [they will
  _not_ run the pre/post scripts](https://github.com/npm/rfcs/pull/185),
  however.  (So, it'll be possible to run `npm test --ignore-scripts` to
  run your test but not your linter, for example.)

### npx

The `npx` binary was rewritten in npm v7, and the standalone `npx` package
deprecated when v7.0.0 hits GA.  `npx` uses the new `npm exec` command
instead of a separate argument parser and install process, with some
affordances to maintain backwards compatibility with the arguments it
accepted in previous versions.

This resulted in some shifts in its functionality:

- Any `npm` config value may be provided.
- To prevent security and user-experience problems from mistyping package
  names, `npx` prompts before installing anything.  Suppress this
  prompt with the `-y` or `--yes` option.
- The `--no-install` option is deprecated, and will be converted to `--no`.
- Shell fallback functionality is removed, as it is not advisable.
- The `-p` argument is a shorthand for `--parseable` in npm, but shorthand
  for `--package` in npx.  This is maintained, but only for the `npx`
  executable.  (Ie, running `npm exec -p foo` will be different from
  running `npx -p foo`.)
- The `--ignore-existing` option is removed.  Locally installed bins are
  always present in the executed process `PATH`.
- The `--npm` option is removed.  `npx` will always use the `npm` it ships
  with.
- The `--node-arg` and `-n` options are removed.
- The `--always-spawn` option is redundant, and thus removed.
- The `--shell` option is replaced with `--script-shell`, but maintained
  in the `npx` executable for backwards compatibility.

We do intend to continue supporting the `npx` that npm ships; just not the
`npm install -g npx` library that is out in the wild today.

### Files On Disk

- [RFC
  13](https://github.com/npm/rfcs/blob/latest/accepted/0013-no-package-json-_fields.md)
  Installed `package.json` files no longer are mutated to include extra
  metadata.  (This extra metadata is stored in the lockfile.)
- `package-lock.json` is updated to a newer format, using
  `"lockfileVersion": 2`.  This format is backwards-compatible with npm CLI
  versions using `"lockfileVersion": 1`, but older npm clients will print a
  warning about the version mismatch.
- `yarn.lock` files used as source of package metadata and resolution
  guidance, if available.  (Prior to v7, they were ignored.)

### Dependency Resolution

These changes affect `install`, `ci`, `install-test`, `install-ci-test`,
`update`, `prune`, `dedupe`, `uninstall`, `link`, and `audit fix`.

- [RFC
  25](https://github.com/npm/rfcs/blob/latest/accepted/0025-install-peer-deps.md)
  `peerDependencies` are installed by default.  This behavior can be
  disabled by setting the `legacy-peer-deps` configuration flag.

    **BREAKING CHANGE**: this can cause some packages to not be
    installable, if they have unresolveable peer dependency conflicts.
    While the correct solution is to fix the conflict, this was not forced
    upon users for several years, and some have come to rely on this lack
    of correctness.  Use the `--legacy-peer-deps` config flag if impacted.

- [RFC
  23](https://github.com/npm/rfcs/blob/latest/accepted/0023-acceptDependencies.md)
  Support for `acceptDependencies` is added.  This can result in dependency
  resolutions that previous versions of npm will incorrectly flag as invalid.

- Git dependencies on known git hosts (GitHub, BitBucket, etc.) will
  always attempt to fetch package contents from the relevant tarball CDNs
  if possible, falling back to `git+ssh` for private packages.  `resolved`
  value in `package-lock.json` will always reflect the `git+ssh` url value.
  Saved value in `package.json` dependencies will always reflect the
  canonical shorthand value.

- Support for the `--link` flag (to install a link to a globall-installed
  copy of a module if present, otherwise install locally) has been removed.
  Local installs are always local, and `npm link <pkg>` must be used
  explicitly if desired.

- Installing a dependency with the same name as the root project no longer
  requires `--force`.  (That is, the `ENOSELF` error is removed.)

### Workspaces

- [RFC
  26](https://github.com/npm/rfcs/blob/latest/accepted/0026-workspaces.md)
  First phase of `workspaces` support is added.  This changes npm's
  behavior when a root project's `package.json` file contains a
  `workspaces` field.

### `npm update`

- [RFC
  19](https://github.com/npm/rfcs/blob/latest/accepted/0019-remove-update-depth-option.md)
  Update all dependencies when `npm update` is run without any arguments.
  As it is no longer relevant, `--depth` config flag removed from `npm
  update`.

### `npm outdated`

- [RFC
  27](https://github.com/npm/rfcs/blob/latest/accepted/0027-remove-depth-outdated.md)
  Remove `--depth` config from `npm outdated`.  Only top-level dependencies
  are shown, unless `--all` config option is set.

### `npm adduser`, `npm login`

- The `--sso` options are deprecated, and will print a warning.

### `npm audit`

- Output and data structure is significantly refactored to call attention
  to issues, identify classes of fixes not previously available, and
  remove extraneous data not used for any purpose.

    **BREAKING CHANGE**: Any tools consuming the output of `npm audit` will
    almost certainly need to be updated, as this has changed significantly,
    both in the readable and `--json` output styles.

### `npm dedupe`

- Performs a full dependency tree reification to disk.  As a result, `npm
  dedupe` can cause missing or invalid packages to be installed or updated,
  though it will only do this if required by the stated dependency
  semantics.

- Note that the `--prefer-dedupe` flag has been added, so that you may
  install in a maximally deduplicated state from the outset.

### `npm fund`

- Human readable output updated, reinstating depth level to the printed
  output.

### `npm ls`

- Extraneous dependencies are listed based on their location in the
  `node_modules` tree.
- `npm ls` only prints the first level of dependencies by default.  You can
  make it print more of the tree by using `--depth=<n>` to set a specific
  depth, or `--all` to print all of them.

### `npm pack`, `npm publish`

- Generated gzipped tarballs no longer contain the zlib OS indicator.  As a
  result, they are truly dependent _only_ on the contents of the package,
  and fully reproducible.  However, anyone relying on this byte to identify
  the operating system of a package's creation may no longer rely on it.

### `npm rebuild`

- Runs package installation scripts as well as re-creating links to bins.
  Properly respects the `--ignore-scripts` and `--bin-links=false`
  configuration options.

### `npm build`, `npm unbuild`

- These two internal commands were removed, as they are no longer needed.

### `npm test`

- When no test is specified, will fail with `missing script: test` rather
  than injecting a synthetic `echo 'Error: no test specified'` test script
  into the `package.json` data.

## Credits

Huge thanks to the people who wrote code for this update, as well as our
group of dedicated Open RFC call participants.  Your participation has
contributed immeasurably to the quality and design of npm.
