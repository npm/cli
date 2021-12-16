# global installs

Global installs differ from local installs in the following ways:

1. Only the explicit requests are relevant.  Ignore everything that is not
   in the add or rm set.
2. Rather than start from a full actual and ideal tree, the "actual" tree
   is whatever versions of the add and rm set exist.
3. All deps are nested under the top level dependency, rather than being
   deduped up to the root.
4. The `binLinks` package handles this entirely, but the bins and mans need
   to be linked differently.
5. We don't save a package.json or package-lock.json

In a "global style" (but not truly global) install:

1. Only the things being added at the root level (ie, root-level where the
   diff.action is `'ADD'`) are relevant.  Whether this is an explicit
   addition or not is irrelevant.  (Implication: global installs can start
   with an empty dep set, so if nothing is being added, there's nothing to
   do.)
2. We _do_ have to get the actual and ideal trees, so that we can correct
   any issues caused by clobbering deduped deps at the top level.
   (Implication: global installs can do a filtered actualTree read that
   only includes the items that are deps of the effective root node.)
3. This is identical between global-style and global.  (In fact, it's what
   makes it "global style" in the first place.)
4. `binLinks` will get `global: false`, and do the right thing.
5. We do save a package.json and package-lock.json.

## performing global installs

```js
arborist.reify({
  // path up to where the node_modules lives
  // maybe consider making this $PREFIX, and adding the /lib on non-windows
  // systems, so that we can just pass in path: npm.prefix?
  path: '/usr/local/lib',
  global: true,
  add: { dependencies: [ pkgSpec ] },
  rm: [ pkgName ],
}).then(tree => {
  // tree is an empty root that includes only the deps added/removed
})
```

## Node `global` Field

Set `global: true` in the Node ctor to set the internal `_global` property.

`get global` returns `this.root[_global]`.

## Node `globalTop` Field

`globalTop` getter returns true if the node is global, and is parent is the
root node, to reflect that global nodes directly in the `node_modules`
folder need to have their bins linked differently.
