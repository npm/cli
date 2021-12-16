# Tree Types

Arborist handles three different types of tree:

- `arborist.actualTree` - This is the representation of the actual packages
  on disk.  It's loaded by calling `arborist.loadActual()`.

- `arborist.virtualTree` - This is the package tree as captured in a
  `package-lock.json` or `npm-shrinkwrap.json`.  It's loaded by calling
  `arborist.loadVirtual()`.

    This method _may_ be called with an argument
    specifyig the node to use as the `root` of the tree, like
    `arborist.loadVirtual({ root: nodeObject })`.  If a root is not specified
    then a missing shrinkwrap is treated as a failure.  If a root is not
    specified, then a shrinkwrap file must be present, or the virtual load
    fails.

- `arborist.idealTree` - This is the tree of package data that we intend to
  install.  It's built up based on the shrinkwrap/lockfile if present, the
  dependencies in package.json, and any add/remove/update changes requested.

    This is loaded by calling `arborist.buildIdealTree(options)`.  The
    options object can specify what to add, remove, and/or update.

During [reification](./reify.md), the `idealTree` is [diffed](./diff.md)
against the actual tree, and then the nodes from the ideal tree are
extracted onto disk.  At the end of `arborist.reify()`, the ideal tree is
copied to `arborist.actualTree`, since then it reflects the actual state of
the `node_modules` folder.
