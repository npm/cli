---
title: .npmrc
section: 5
description: The npm config files
---

### Description

npm gets its config settings from the command line, environment variables, and `npmrc` files.

The `npm config` command can be used to update and edit the contents of the user and global npmrc files.

For a list of available configuration options, see [config](/using-npm/config).

### Files

The four relevant files are:

* per-project config file (`/path/to/my/project/.npmrc`)
* per-user config file (`~/.npmrc`)
* global config file (`$PREFIX/etc/npmrc`)
* npm builtin config file (`/path/to/npm/npmrc`)

All npm config files are an ini-formatted list of `key = value` parameters.
Environment variables can be replaced using `${VARIABLE_NAME}`.
By default if the variable is not defined, it is left unreplaced.
By adding `?` after variable name they can be forced to evaluate to an empty string instead.
For example:

```bash
cache = ${HOME}/.npm-packages
node-options = "${NODE_OPTIONS?} --use-system-ca"
```

Each of these files is loaded, and config options are resolved in priority order.
For example, a setting in the userconfig file would override the setting in the globalconfig file.

Array values are specified by adding "[]" after the key name.
For example:

```bash
key[] = "first value"
key[] = "second value"
```

#### Comments

Lines in `.npmrc` files are interpreted as comments when they begin with a
`;` or `#` character.
`.npmrc` files are parsed by
[npm/ini](https://github.com/npm/ini), which specifies this comment syntax.

For example:

```bash
# last modified: 01 Jan 2016
; Set a new registry for a scoped package
@myscope:registry=https://mycustomregistry.example.org
```

#### Per-project config file

When working locally in a project, a `.npmrc` file in the root of the project (ie, a sibling of `node_modules` and `package.json`) will set config values specific to this project.

Note that this only applies to the root of the project that you're running npm in.
It has no effect when your module is published.
For example, you can't publish a module that forces itself to install globally, or in a different location.

Additionally, this file is not read in global mode, such as when running `npm install -g`.

#### Per-user config file

`$HOME/.npmrc` (or the `userconfig` param, if set in the environment or on the command line)

#### Global config file

`$PREFIX/etc/npmrc` (or the `globalconfig` param, if set above): This file is an ini-file formatted list of `key = value` parameters.
Environment variables can be replaced as above.

#### Built-in config file

`path/to/npm/itself/npmrc`

This is an unchangeable "builtin" configuration file that npm keeps consistent across updates.
Set fields in here using the `./configure` script that comes with npm.
This is primarily for distribution maintainers to override default configs in a standard and consistent manner.

### Auth related configuration

The settings `_auth`, `_authToken`, `username`, `_password`, `certfile`, and `keyfile` must all be scoped to a specific registry.
This ensures that `npm` will never send credentials to the wrong host.

The full list is:
 - `_auth` (base64 authentication string)
 - `_authToken` (authentication token)
 - `username`
 - `_password`
 - `email`
 - `cafile` (path to certificate authority file)
 - `certfile` (path to certificate file)
 - `keyfile` (path to key file)

In order to scope these values, they must be prefixed by a URI fragment.
If the credential is meant for any request to a registry on a single host, the scope may look like `//registry.npmjs.org/:`.
If it must be scoped to a specific path on the host that path may also be provided, such as
`//my-custom-registry.org/unique/path:`.

#### The scope must match the registry URI exactly

npm looks credentials up by the registry URI, and that lookup is an exact string match.
The scope in front of `_authToken` therefore has to be the same URI as `registry` (or a
`@scope:registry`) character for character, including any trailing slash. A host-level
scope does *not* act as a fallback for a request to a path on that host: if the registry
URL is `https://acme.com/api/v4/projects/123/packages/npm/`, then `//acme.com/:_authToken`
and `//acme.com/api/v4/projects/123/packages/npm:_authToken` (missing the final slash) are
both different keys and neither will be used.

The scope and the registry URL are independent settings, so a typo in either one can break
authentication on its own. When they disagree, npm reports no credentials at all rather
than a partially matching token, and commands that need to log in fail with
`ENEEDAUTH` and the message "This command requires you to be logged in". That message is
the same one you get when no credentials have ever been configured, so it is misleading
in this case: the token is present, it is just keyed to a URI that does not match the
registry being written to. Check both settings before running `npm adduser`.

To see which key npm actually resolved, ask for it by the registry URI:

```bash
npm config get //acme.com/api/v4/projects/123/packages/npm/:_authToken
```

An empty result means no credential is keyed to that exact URI. `npm config ls -l` prints
the full list of keys as npm parsed them, which is the quickest way to spot a missing
slash or a different port.

```ini
; the registry and the credential key disagree, so nothing is sent
@acme:registry=https://acme.com/projects/123/packages/npm/
//acme.com/projects/123/packages/npm:_authToken=TOKEN

; both URIs are identical, including the trailing slash
@acme:registry=https://acme.com/projects/123/packages/npm/
//acme.com/projects/123/packages/npm/:_authToken=TOKEN
```

Note that the port is part of the key. A registry URL and a credential scope built from
different hostnames, or one built with `${CI_API_V4_URL}` and the other with
`${CI_REGISTRY}`, will not match even though both reach the same server.

### Unsupported Custom Configuration Keys

Starting in npm v11.2.0, npm warns when unknown configuration keys are defined in `.npmrc`. In a future major version of npm, these unknown keys may no longer be accepted.

Only configuration keys that npm officially supports are recognized. Custom keys intended for third-party tools (for example, `electron-builder`) should not be placed in `.npmrc`.

If you need package-level configuration for use in scripts, use the `config` field in your `package.json` instead:

```json
{
  "name": "my-package",
  "config": {
    "mirror": "https://example.com/"
  }
}

```

Values defined in `package.json#config` are exposed to scripts as environment variables prefixed with `npm_package_config_`. For example:

```
npm_package_config_mirror
```

If you need to pass arguments to a script command, use `--` to separate npm arguments from script arguments:

```
npm run build -- --customFlag
```

Using environment variables is also recommended for cross-platform configuration instead of defining unsupported keys in `.npmrc`.


```
; bad config
_authToken=MYTOKEN

; good config
@myorg:registry=https://somewhere-else.com/myorg
@another:registry=https://somewhere-else.com/another
//registry.npmjs.org/:_authToken=MYTOKEN

; would apply to both @myorg and @another
//somewhere-else.com/:_authToken=MYTOKEN

; would apply only to @myorg
//somewhere-else.com/myorg/:_authToken=MYTOKEN1

; would apply only to @another
//somewhere-else.com/another/:_authToken=MYTOKEN2
```

### Custom / third-party config keys

npm only recognizes its own [configuration options](/using-npm/config).
If your `.npmrc` contains keys that are not part of npm's config definitions
(for example, `electron_mirror` or `sass_binary_site`), npm will emit a
warning:

```
warn Unknown user config "electron_mirror".
This will stop working in the next major version of npm.
```

These keys were historically tolerated but are not officially supported.
A future major version of npm will treat unknown top-level keys as errors.

Some tools (such as `@electron/get` or `node-sass`) read their own
configuration from environment variables or from `.npmrc` by convention.
You can set these values as environment variables instead:

```bash
export ELECTRON_MIRROR="https://mirrorexample.npmjs.org/mirrors/electron/"
export ELECTRON_CUSTOM_DIR="{{ version }}"
```

Environment variables are the most portable approach and work regardless
of `.npmrc` format.

### See also

* [npm folders](/configuring-npm/folders)
* [npm config](/commands/npm-config)
* [config](/using-npm/config)
* [package.json](/configuring-npm/package-json)
* [npm](/commands/npm)
