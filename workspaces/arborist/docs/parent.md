# parent/children, fsParent/fsChildren, target/linksIn, edges, root, and top

Each Node object has a link to certain other nodes within the tree,
reflecting various different relationships between packages on disk.

## root

There is a fundamental difference between "the project where we're working"
and "a thing loaded as a dependency".  When working in a project, we expect
metadata to be updated, new installs to be saved as new dependencies,
`peerDependencies` installed directly in `node_modules`, and so on.

The root node represents the ultimate "client" of all of this package
resolution.  Thus, it's important to keep metadata up to date in the root
node, so that the dependencies in use by the project can be kept
consistent.

## parent

If a package is located in a `node_modules` folder, then its `parent`
represents the the package that contains that `node_modules` folder.

For example:

```
x
+-- node_modules
    +-- y
```

In this tree, `x` is `y`'s parent.

`y` can resolve its dependents either within its own `node_modules` folder
(ie, it's `children` nodes), or its parent's `node_modules` folder (ie,
it's parent's `children`), or its parent's parent's, and so on up the tree.

Setting `node.parent` to another Node object will move it into that
location in the tree, automatically adding it to `parent.children`,
replacing an existing node, updating its path property, and so on.  Set the
parent to `null` to remove a node fro the tree entirely.

## children

The `children` member is a Map of names to Node objects.  In the example
above, `x.children.get('y')` returns the `y` Node.

When resolving dependencies, `y` can look in its own `children` for a
match, or in the `children` of its parent, and so on up to the top of the
tree.

## fsParent

Package nodes are not only found in `node_modules` folders.  They can be
symlinked into place from anywhere on the file system.

If a package is underneath the folder of another Node, we call that it's
file system parent node, or `fsParent`.  This is relevant when looking for
dependencies, because Node's `require()` lookup algorithm will walk up the
file system looking for resolutions.

For example, consider this folder tree:

```
root
+-- packages
|   +-- foo
|   +-- bar
+-- node_modules
    +-- asdf
    +-- quux
    +-- foo -> ../../packages/foo
    +-- bar -> ../../packages/bar
```

When the code in `root/packages/foo` calls `require('asdf')`, it'll walk up
the folder tree, checking for a match first in
`root/packages/foo/node_modules`, then `root/packages/node_modules`, then
`root/node_modules`, and find the match at `root/node_modules/asdf`.

Thus, the `foo` and `bar` nodes can find their dependencies in the children
of the `root` package.

To reflect this relationship, the `foo` and `bar` nodes will have the
`root` node set as their `fsParent`.  The `root` node will have `foo` and
`bar` in its `fsChildren` set.  (This is a Set rather than a Map, because
the name is not relevant.  See: path changes below for why this is a
bidirectional relationship at all.)

## target/linksIn

`Link` nodes represent a symbolic link to a package folder.

The link's `target` property is the node representing the real path to the
package on disk.  The targets of link nodes have a `linksIn` set of all
the known links to their package folder.

This is relevant because Node's `require()` resolution algorithm walks from
the _realpath_ of a module, not the location where it was found.

Links do not need to point to a package on disk that is underneath the root
node, like in the example above.  The target of a link can be literally
anywhere.  For example:

```
/home/isaacs/dev
+-- my-project  <-- root node
|   +-- node_modules
|       +-- dep -> /home/isaacs/dev/dep  <-- link node
+-- dep
    +-- node_modules
        +-- meta-dep
```

When we're working in `my-project`, that's the `root`.  However, when
`my-project` calls `require('dep')`, it'll look in
`my-project/node_modules/dep` and find the symlink there.

When the code in the `dep` package calls `require('meta-dep')`, it won't
look in `my-project/node_modules/meta-dep`, it'll start its search in
`dep/node_modules/meta-dep`.

To reflect this, the `dep` node does not have a `parent` or `fsParent`
reference.  All of its dependencies must be installed in its own
`node_modules` folder.

## top

A node without a parent is called a `top` node.  The `root` node is
_typically_ a top node, but not necessarily.  (Technically, the `root` node
is wherever we're doing work; there's nothing stopping us from also loading
a node above it in the fs hierarchy, and we may do so for workspaces.)

## edgesIn, edgesOut

Unlike file systems, dependencies are a _graph_ rather than a strict
hierarchical tree structure.  (That is, there can be cycles.)

An `Edge` represents a particular _dependency_ relationship, regardless of
the location on disk of the nodes in that relationship.

Each edge has `from` and `to` fields referring to the nodes in question.
`from` is the node with the dependency, and `to` is node that satisfies the
dependency (or `null` if it's missing).  Each edge also has a `type`, which
can be one of `prod`, `dev`, `optional`, `peer`, or `peerOptional`.

The `edgesOut` property is a map of names to edge objects representing all
the dependencies of a given node.  The `edgesIn` property is the set of all
edges that resolve to the node.

Edges in and out are always kept in sync by refreshing whenever a change is
made to the tree that can affect dependency resolution.

A node's `edgesOut` property is a Map of names to edges.  A node's
`edgesIn` property is a Set of all edges resolving to the node.

## refreshPath

Whenever a node changes location on disk, several other fields are changed
to keep the tree valid.

The paths of its `children` and `fsChildren` nodes are updated accordingly.

If a Node has linksIn, then the Link nodes' `realpath` is updated to still
point to the same path on disk.
