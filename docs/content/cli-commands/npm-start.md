---
section: cli-commands 
title: npm-start
description: Start a package
---

# npm-start

## Start a package

### Synopsis

```bash
npm start [-- <args>]
```

### Description

This runs an arbitrary command specified in the package's `"start"` property of
its `"scripts"` object. If no `"start"` property is specified on the
`"scripts"` object, it will run `node server.js`.

As of [`npm@2.0.0`](https://blog.npmjs.org/post/98131109725/npm-2-0-0), you can
use custom arguments when executing scripts. Refer to [`npm-run-script`](npm-run-script) for
more details.

### See Also

* [npm-run-script](npm-run-script)
* [npm-scripts](/docs/using-npm/scripts)
* [npm-test](npm-test)
* [npm-restart](npm-restart)
* [npm-stop](npm-stop)
