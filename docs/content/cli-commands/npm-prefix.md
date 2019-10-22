---
section: cli-commands 
title: npm-prefix
description: Display prefix
---

# npm-prefix

## Display prefix

### Synopsis

```bash
npm prefix [-g]
```

### Description

Print the local prefix to standard out. This is the closest parent directory
to contain a `package.json` file or `node_modules` directory, unless `-g` is
also specified.

If `-g` is specified, this will be the value of the global prefix. See
[`npm-config`](npm-config) for more detail.

### See Also

* [npm-root](npm-root)
* [npm-bin](npm-bin)
* [npm-folders](/docs/configuring-npm/folders)
* [npm-config](npm-config)
* [npmrc](/docs/configuring-npm/npmrc)
