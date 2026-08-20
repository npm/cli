---
title: npm-shrinkwrap
section: 1
description: Lock down dependency versions for publication
---

### Synopsis

```bashnpm install (with no args, in package dir)
npm install [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
npm install [<@scope>/]<name>@<version range>
npm install <alias>@npm:<name>
npm install <git-host>:<git-user>/<repo-name>
npm install <git repo url>
npm install <tarball file>
npm install <tarball url>
npm install <folder>

aliases: npm i, npm add
common options: [-P|--save-prod|-D|--save-dev|-O|--save-optional] [-E|--save-exact] [-B|--save-bundle] [--no-save] [--dry-run]
npm shrinkwrap
```

### Description

This command repurposes `package-lock.json` into a publishable
`npm-shrinkwrap.json` or simply creates a new one. The file created and updated
by this command will then take precedence over any other existing or future
`package-lock.json` files. For a detailed explanation of the design and purpose
of package locks in npm, see [package-locks](/configuring-npm/package-locks).

### See Also

* [npm install](/commands/npm-install)
* [npm run-script](/commands/npm-run-script)
* [npm scripts](/using-npm/scripts)
* [package.js](/configuring-npm/package-json)
* [package-locks](/configuring-npm/package-locks)
* [package-lock.json](/configuring-npm/package-lock-json)
* [shrinkwrap.json](/configuring-npm/shrinkwrap-json)
* [npm ls](/commands/npm-ls)
