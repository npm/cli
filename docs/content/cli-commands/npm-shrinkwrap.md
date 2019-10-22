---
section: cli-commands 
title: npm-shrinkwrap
description: Lock down dependency versions for publication
---

# npm-shrinkwrap

## Lock down dependency versions for publication

### Synopsis

```bash
npm shrinkwrap
```

### Description

This command repurposes `package-lock.json` into a publishable
`npm-shrinkwrap.json` or simply creates a new one. The file created and updated
by this command will then take precedence over any other existing or future
`package-lock.json` files. For a detailed explanation of the design and purpose
of package locks in npm, see [npm-package-locks](npm-package-locks).

### See Also

* [npm-install](npm-install)
* [npm-run-script](npm-run-script)
* [npm-scripts](/docs/using-npm/scripts)
* [package.json](/docs/configuring-npm/package.json)
* [npm-package-locks](/docs/configuring-npm/package-locks)
* [package-lock.json](/docs/configuring-npm/package-lock.json)
* [npm-shrinkwrap.json](/docs/configuring-npm/shrinkwrap.json)
* [npm-ls](npm-ls)
