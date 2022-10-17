# tree reification

For the tree:

```
a
+-- b
|   +-- c
|   +-- d
|   |   +-- e
|   +-- f
+-- x
|   +-- y
|       +-- z
+-- p
    +-- q
```

Turn it into:

```
a
+-- b'
|   +-- c'
|   +-- d
|   |   +-- e'
|   +-- f
+-- x
|   +-- y'
|       +-- z
+-- i
    +-- j
```

That is, update b, c, e, and y, but not d, f, x, or z; delete p and q, and
add i and j.

## Considerations

- Windows will fail with EPERM when trying to move or delete a folder with
  current (or even recent) file operations happening inside it.
- Nodes with `bundleDependencies` _also_ bundle the meta-deps of their
  bundled deps.  But, we don't know what those are from the manifest, and
  it's possible that there's overlap between bundled metadeps and regular
  dependencies, meaning that there can be extraneous nodes in the ideal
  tree once all the tarballs are unpacked.
- This is exceedingly time-sensitive.
- Users generally expect that a failed install should not make their app
  unusable.

## Reify-A: Safe Rollback-able Process

This algorithm avoids ever renaming a directory, or removing a directory
with recent writes (except in the case of failure rollbacks), so as to
minimize the chances of hitting Windows file-locking EPERM issues.

It is very safe, and somewhat disk-inefficient.

### step 1: retire shallowest nodes to be replaced

Move aside the nodes that will be replaced.  They'll be removed if all goes
well, but if there's an error, we'll move them back.

(Note: `.b-hash` is actually something like `.b-<8 chars of base64 sha1>`.
We could probably do this _slightly_ faster if we didn't hash the folder,
and instead used a name like `.b-retired`, but not sure if it's worth
it?  Seems like it _should_ be safe from collisions?  If we're gonna hash
it to defend against concurrent reification commands, then it ought to
include the process id or something, which it currently doesn't, and limits
our options in the future.)

```
a
+-- b (.b-hash)
|   +-- c
|   +-- d
|   |   +-- e
|   +-- f
+-- x
|   +-- y (.y-hash)
|       +-- z
+-- p (.p-hash)
    +-- q
```

Fail: rename each retired `.${name}-hash` folder back to `${name}`

### step 2: create sparse tree

Now that the shallowest changing nodes are retired, `mkdir` all leaf
nodes.

```
a
+-- b (.b-hash)
|   +-- c
|   +-- d
|   |   +-- e
|   +-- f
+-- b (empty)
|   +-- c (empty)
|   +-- d (empty)
|       +-- e (empty)
+-- x
|   +-- y (.y-hash)
|   |   +-- z
|   +-- y (empty)
+-- p (.p-hash)
|   +-- q
+-- i (empty)
    +-- j (empty)
```

Fail: rimraf sparse tree, fail step 1

### step 3: load shrinkwraps

Unpack any shrinkwrapped nodes, and `loadVirtual` on them, and then update
the ideal tree with their virtual tree nodes.  These will always be leaf
nodes, because any `hasShrinkwrap` nodes did not have their deps loaded in
the buildIdealTree step.

If no shrinkwraps present, proceed to step 4.

Else:

- loadVirtual in the newly unpacked shrinkwrap node using the current ideal
  node as the root of the virtual tree
- diff trees again
- create the sparse tree

Fail: fail step 2

### step 4: unpack bundled deps into sparse tree and update

1. Group all nodes with bundles by depth.
2. For depth = 0 to max, for all nodes at that depth with bundleDeps,
    1. If no nodes at that level with bundles still in tree, done
    2. extract all nodes with bundles at that depth level in parallel
    3. call `loadActual` on each one, and move each of the actual subtree's
       children under the node in the ideal tree.
3. If any bundleDeps unpacked, prune tree

Fail: fail step 2

### step 5: unpack sparse tree of nodes changing

```
a
+-- b (.b-hash)
|   +-- c
|   +-- d
|   |   +-- e
|   +-- f
+-- b'
|   +-- c'
|   +-- d (empty)
|       +-- e'
+-- x
|   +-- y (.y-hash)
|   |   +-- z
|   +-- y'
+-- p (.p-hash)
|   +-- q
+-- i
    +-- j
```

To maximize parallelization while minimizing unnecessary fetches for
bundled deps and meta-deps:

For all diff nodes in parallel, `pacote.extract` if add/change.

Fail: fail step 2

### step 6: move unchanging nodes into sparse tree

```
a
+-- b (.b-hash)
|   +-- c
|   +-- d (empty)
|       +-- e
+-- b'
|   +-- c'
|   +-- d
|   |   +-- e'
|   +-- f
+-- x
|   +-- y (.y-hash)
|   +-- y'
|       +-- z
+-- p (.p-hash)
|   +-- q
+-- i
    +-- j
```

This actually means that we move each unchanging node's _contents_ (other
than `node_mdules`) into the new location.  (Maybe we ought to _only_ ever
move files, not directories?)

Fail: move unchanging nodes back to retired tree, fail step 2

**Windows Consideration!** Extremely easy for a failure in this step to
lead to EPERM in the rollback, if we try to rimraf the sparse tree before
we're fully moved out of it.

### step 7: rimraf retired original (now sparse) nodes and removal nodes

```
a
+-- b'
|   +-- c'
|   +-- d
|   |   +-- e'
|   +-- f
+-- x
|   +-- y'
|       +-- z
+-- i
    +-- j
```

Fail: report failure as a warning and instruct user to `rm -rf` the garbage
directory.

## Reify-B: Fast and Dirty Approach

This is the fastest and most efficient way to proceed, but does not admit
any reasonable rollback approach, since we fully delete existing packages
_before_ unpacking the new ones.

### step 1: clear away excess

Scan actualTree inventory.  For each node:

- If not in idealTree, rimraf path, remove from actualTree (so we don't
  check its children).
- If in ideal tree and identical resolved/integrity, leave it alone.
- If in ideal tree and different, and no unbundled children, rimraf path,
  remove from actualTree
- If in ideal tree and different and has unbundled children,
    - rimraf package contents
    - rimraf bundled children and remove them from tree

### step 2: lay the path

`mkdir` every path in ideal tree that does not exist in actualTree

### step 3: extract shrinkwrap modules

Each node with a shrinkwrap is already a tip of the tree, because its child
nodes are not traversed in the ideal tree.

Unpack them into place, and then call loadVirtual using the shrinkwrapped
node as the root, this filling out the ideal tree with the virtual nodes.

Repeat step 2 if any shrinkwrap nodes were created.

### step 4: extract bundlers

1. Group all nodes with bundles by depth.
2. for depth = 0, for all nodes at that depth with bundleDependencies,
    1. If no nodes at that level with bundles still in the tree, done.
    2. extract all nodes with bundles at that depth level in parallel
    3. call `loadActual` with a new Arborist on each one, and move each
       depth=1 child node into the ideal tree.
3. if any bundle deps unpacked, prune tree

### step 5: extract all others

Extract all remaining packages in parallel.

Their folders already exist, so it's fine to just dump them all into place.
