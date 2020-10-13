---
section: using-npm
title: workspaces
description: Working with workspaces
---
# scope(7)

## Workspaces

### Description

**Workspaces** is a generic term that refers to the set of features in the
npm cli that provides support to managing multiple packages from your local
files system from within a singular top-level, root package.

This set of features makes up for a much more streamlined workflow handling
linked packages from the local file system. Automating the linking process
as part of `npm install` and avoiding manually having to use `npm link` in
order to add references to packages that should be symlinked into the current
`node_modules` folder.

We also refer to these packages being auto-symlinked during `npm install` as a
single **workspace**, meaning it's a nested package within the current local
file system that is explicitly defined in the [`package.json`](/using-npm/package-json)
`workspaces` configuration.

### Installing workspaces

Workspaces are usually defined via the `workspaces` property of the
[`package.json`](/using-npm/package-json) file, e.g:

```json
{
  "name": "my-workspaces-powered-project",
  "workspaces": [
    "workspace-a"
  ]
}
```

Given the above `package.json` example living at a current working
directory `.` that contains a folder named `workspace-a` that disposes
of a `package.json` inside it, defining a nodejs package, e.g:

```
.
+-- package.json
`-- workspace-a
   `-- package.json
```

The expected result once running `npm install` in this current working
directory `.` is that the folder `workspace-a` will get symlinked to the
`node_modules` folder of the current working dir.

Below is a post `npm install` example, given that same previous example
structure of files and folders:

```
.
+-- node_modules
|  `-- workspace-a -> ../workspace-a
+-- package-lock.json
+-- package.json
`-- workspace-a
   `-- package.json
```

### See also

* [npm install](/cli-commands/install)
* [npm publish](/cli-commands/publish)

