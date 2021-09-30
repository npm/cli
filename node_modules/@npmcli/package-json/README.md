# @npmcli/package-json

[![npm version](https://img.shields.io/npm/v/@npmcli/package-json)](https://www.npmjs.com/package/@npmcli/package-json)
[![Build Status](https://img.shields.io/github/workflow/status/npm/package-json/node-ci)](https://github.com/npm/package-json)

Programmatic API to update `package.json` files. Updates and saves files the
same way the **npm cli** handles them.

## Install

`npm install @npmcli/package-json`

## Usage:

```js
const PackageJson = require('@npmcli/package-json')
const pkgJson = await PackageJson.load(path)
// $ cat package.json
// {
//   "name": "foo",
//   "version": "1.0.0",
//   "dependencies": {
//     "a": "^1.0.0",
//     "abbrev": "^1.1.1"
//   }
// }

pkgJson.update({
  dependencies: {
    a: '^1.0.0',
    b: '^1.2.3',
  },
  workspaces: [
    './new-workspace',
  ],
})

await pkgJson.save()
// $ cat package.json
// {
//   "name": "foo",
//   "version": "1.0.0",
//   "dependencies": {
//     "a": "^1.0.0",
//     "b": "^1.2.3"
//   }
// }
```

## API:

### `constructor(path)`

Creates a new instance of `PackageJson`.

- `path`: `String` that points to the folder from where to read the
`package.json` from

---

### `async PackageJson.load()`

Loads the `package.json` at location determined in the `path` option of
the constructor.

### Example:

Loads contents of the `package.json` file located at `./`:

```js
const PackageJson = require('@npmcli/package-json')
const pkgJson = new PackageJson('./')
await pkgJson.load()
```

Throws an error in case the `package.json` file is missing or has invalid
contents.

---

### **static** `async PackageJson.load(path)`

Convenience static method that returns a new instance and loads the contents of
the `package.json` file from that location.

- `path`: `String` that points to the folder from where to read the
`package.json` from

### Example:

Loads contents of the `package.json` file located at `./`:

```js
const PackageJson = require('@npmcli/package-json')
const pkgJson = await PackageJson.load('./')
```

---

### `PackageJson.update(content)`

Updates the contents of the `package.json` with the `content` provided.

- `content`: `Object` containing the properties to be updated/replaced in the
`package.json` file.

Special properties like `dependencies`, `devDependencies`,
`optionalDependencies`, `peerDependencies` will have special logic to handle
the update of these options, such as deduplications.

### Example:

Adds a new script named `new-script` to your `package.json` `scripts` property:

```js
const PackageJson = require('@npmcli/package-json')
const pkgJson = await PackageJson.load('./')
pkgJson.update({
  scripts: {
    ...pkgJson.content.scripts,
    'new-script': 'echo "Bom dia!"'
  }
})
```

**NOTE:** When working with dependencies, it's important to provide values for
all known dependency types as the update logic has some interdependence in
between these properties.

### Example:

A safe way to add a `devDependency` AND remove all peer dependencies of an
existing `package.json`:

```js
const PackageJson = require('@npmcli/package-json')
const pkgJson = await PackageJson.load('./')
pkgJson.update({
  dependencies: pkgJson.content.dependencies,
  devDependencies: {
    ...pkgJson.content.devDependencies,
    foo: '^foo@1.0.0',
  },
  peerDependencies: {},
  optionalDependencies: pkgJson.content.optionalDependencies,
})
```

---

### **get** `PackageJson.content`

Getter that retrieves the normalized `Object` read from the loaded
`package.json` file.

### Example:

```js
const PackageJson = require('@npmcli/package-json')
const pkgJson = await PackageJson.load('./')
pkgJson.content
// -> {
//   name: 'foo',
//   version: '1.0.0'
// }
```

---

### `async PackageJson.save()`

Saves the current `content` to the same location used when initializing
this instance.

<br />

## Related

When you make a living out of reading and writing `package.json` files, you end
up with quite the amount of packages dedicated to it, the **npm cli** also
uses:

- [read-package-json-fast](https://github.com/npm/read-package-json-fast) reads
and normalizes `package.json` files the way the **npm cli** expects it.
- [read-package-json](https://github.com/npm/read-package-json) reads and
normalizes more info from your `package.json` file. Used by `npm@6` and in
`npm@7` for publishing.

## LICENSE

[ISC](./LICENSE)

