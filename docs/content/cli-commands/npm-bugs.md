---
section: cli-commands 
title: npm-bugs
description: Bugs for a package in a web browser maybe
---

# npm-bugs

## Bugs for a package in a web browser maybe

### Synopsis
```bash
npm bugs [<pkgname>]

aliases: issues
```

### Description

This command tries to guess at the likely location of a package's
bug tracker URL, and then tries to open it using the `--browser`
config param. If no package name is provided, it will search for
a `package.json` in the current folder and use the `name` property.

### Configuration

#### browser

* Default: OS X: `"open"`, Windows: `"start"`, Others: `"xdg-open"`
* Type: String

The browser that is called by the `npm bugs` command to open websites.

#### registry

* Default: https://registry.npmjs.org/
* Type: url

The base URL of the npm package registry.


### See Also

* [npm-docs](npm-docs)
* [npm-view](npm-view)
* [npm-publish](npm-publish)
* [npm-registry](/docs/using-npm/registry)
* [npm-config](npm-config)
* [npmrc](/docs/configuring-npm/npmrc)
* [package.json](/docs/configuring-npm/package.json)
