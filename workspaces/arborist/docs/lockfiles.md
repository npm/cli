# lockfiles

`package-lock.json` is the lockfile that Arborist reads and writes. It is
loaded by `Shrinkwrap.load()`, which reads it along with any `yarn.lock` in the
same directory, and it is written back by `Shrinkwrap.save()`.

Two other package managers are involved to a lesser degree, described below.

## yarn v1

A `yarn.lock` file is parsed into a `YarnLock` object, and is written back out
when a tree is saved. It is used as a source of metadata, not as a description
of the tree.

Yarn entries supply `resolved`, `integrity`, and `version` metadata that a
`package-lock.json` would otherwise have to provide. That metadata is consumed
when building the ideal tree and when loading the actual tree.

On save, if the yarn lock has any entries it is rewritten to `yarn.lock` in the
project root. A `yarn.lock` file is never created when one did not already
exist.

### Caveats

- Yarn entries are only consulted when no `package-lock.json` was loaded from
  disk. Arborist always prefers the package-lock when one is present and
  readable, so the yarn entries are effectively a fallback for projects that
  have a `yarn.lock` but no `package-lock.json`.
- Only the yarn v1 lockfile format is handled. The parser writes and expects
  the `# yarn lockfile v1` header, so Yarn Berry (v2+) lockfiles are not
  supported.
- The parser only supports a single layer of nested objects.
- A `yarn.lock` file is not sufficient on its own. It does not define the
  shape of the tree, so `loadVirtual()` still requires a `package-lock.json`
  or a `package.json` to be present.
- Yarn data that fails to parse is ignored, and is likely to be overwritten on
  the next save.

## pnpm

There is no pnpm support in Arborist. `pnpm-lock.yaml` is neither read nor
written, and Arborist does not create or consume pnpm's isolated
`node_modules` layout.

The closest thing to pnpm handling is the `test/fixtures/pnpm` test fixture,
whose `package-lock.json` describes a `node_modules/.pnpm` virtual store. It
exists to exercise Arborist's link and `fsParent` resolution against a
pnpm-shaped layout, and is not a statement of pnpm lockfile support.
