---
title: npmrc
section: 5
description: The npm config files
---

### Description

npm gets its config settings from the command line, environment variables,
and `npmrc` files.

The `npm config` command can be used to update and edit the contents of the
user and global npmrc files.

For a list of available configuration options, see
[config](/using-npm/config).

### Files

The four relevant files are:

* per-project config file (`/path/to/my/project/.npmrc`)
* per-user config file (`~/.npmrc`)
* global config file (`$PREFIX/etc/npmrc`)
* npm builtin config file (`/path/to/npm/npmrc`)

All npm config files are an ini-formatted list of `key = value` parameters.
Environment variables can be replaced using `${VARIABLE_NAME}`. For
example:

```bash
cache = ${HOME}/.npm-packages
```

Each of these files is loaded, and config options are resolved in priority
order.  For example, a setting in the userconfig file would override the
setting in the globalconfig file.

Array values are specified by adding "[]" after the key name. For example:

```bash
key[] = "first value"
key[] = "second value"
```

#### Comments

Lines in `.npmrc` files are interpreted as comments when they begin with a
`;` or `#` character. `.npmrc` files are parsed by
[npm/ini](https://github.com/npm/ini), which specifies this comment syntax.

For example:

```bash
# last modified: 01 Jan 2016
; Set a new registry for a scoped package
@myscope:registry=https://mycustomregistry.example.org
```

#### Per-project config file

When working locally in a project, a `.npmrc` file in the root of the
project (ie, a sibling of `node_modules` and `package.json`) will set
config values specific to this project.

Note that this only applies to the root of the project that you're running
npm in.  It has no effect when your module is published.  For example, you
can't publish a module that forces itself to install globally, or in a
different location.

Additionally, this file is not read in global mode, such as when running
`npm install -g`.

#### Per-user config file

`$HOME/.npmrc` (or the `userconfig` param, if set in the environment or on
the command line)

#### Global config file

`$PREFIX/etc/npmrc` (or the `globalconfig` param, if set above): This file
is an ini-file formatted list of `key = value` parameters.  Environment
variables can be replaced as above.

#### Built-in config file

`path/to/npm/itself/npmrc`

This is an unchangeable "builtin" configuration file that npm keeps
consistent across updates.  Set fields in here using the `./configure`
script that comes with npm.  This is primarily for distribution maintainers
to override default configs in a standard and consistent manner.

### Auth related configuration

The settings `_auth`, `_authToken`, `username` and `_password` must all be
scoped to a specific `registry`. This ensures that `npm` will never send
credentials to the wrong host.

The full list is:
 - `_auth` (base64 authentication string)
 - `_authToken` (authentication token)
 - `username`
 - `_password`
 - `email`
 - `cafile` (path to certificate authority file)
 - `keyfile` (path to key file)

In order to scope these values, they must be prefixed by a URI fragment.
If the credential is meant for any request to a registry on a single host,
the scope may look like `//registry.npmjs.org/:`. If it must be scoped to a
specific path on the host that path may also be provided, such as
`//my-custom-registry.org/unique/path:`.

#### How NPM matches Registry URL with auth configuration

Let's say you have:

```ini
@myorg:registry=https://registry.npmjs.org/myorg
```

npm will look for:

```ini
//registry.npmjs.org/myorg/:_authToken=...
```

If instead you put:

```ini
//registry.npmjs.org/:_authToken=...
```

That won’t be used, because it **doesn’t match** what npm looks for from the registry URL you defined.

#### Extended configuration example

```ini
; bad config
_authToken=MYTOKEN

; good config
@myorg:registry=https://somewhere-else.npmjs.org/myorg
@another:registry=https://somewhere-else.npmjs.org/another
@anotherorg:registry=https:///registry.npmjs.org/path/anotherorg

; Applies to any registry at https://registry.npmjs.org/ but not to any sub-path (see @anotherorg)
//registry.npmjs.org/:_authToken=MYTOKEN

; Applies to both @myorg and @another but noth @anotherorg
//somewhere-else.npmjs.org/:_authToken=MYTOKEN

; Only applies to @myorg
//somewhere-else.npmjs.org/myorg/:_authToken=MYTOKEN1

; Only applies to @another
//somewhere-else.npmjs.org/another/:_authToken=MYTOKEN2

; Only applies to @anotherorg
//registry.npmjs.org/path/anotherorg:_authToken=MYTOKEN3

```

### See also

* [npm folders](/configuring-npm/folders)
* [npm config](/commands/npm-config)
* [config](/using-npm/config)
* [package.json](/configuring-npm/package-json)
* [npm](/commands/npm)
