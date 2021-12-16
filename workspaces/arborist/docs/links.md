# links and dep resolution

A link can be to a package in `node_modules`, or a package outside of
`node_modules`, which is either under the root folder, or not under the
root folder.

Link targets are considered a top-of-tree node if they are not within the
`node_modules` folder of another traversed node.

Missing dependencies of top nodes are searched for by checking each
parent dir's `node_modules` folder, as high as the common ancestor of the
project root and the top node itself.  Thus, if a link target is _within_
the project root, it'll only search as high as the project root; if it is
_outside_ the project root, it'll only search as high as the nearest common
ancestor.

If the dependency is found, then a "dummy node" is created at the parent,
such that the parent/fsParent node resolution can find it, and the dep node
is rooted there as a child of the dummy node.  The dummy node is not fully
loaded with its package and all dependencies, so if it's just a
`node_modules` folder containing a zillion packages, it will only load
those packages that are depended upon by something in the tree.

## Link within the tree: node is subsumed in tree

In all of these, root depends on link, b depends on c

```
root
+-- node_modules
    +-- link => root/node_modules/a/node_modules/b
    +-- a
    |   +-- node_modules
    |       +-- b
    +-- c
```

Edge from `root/node_modules/a/node_modules/b` -> `root/node_modules/c`

Loads fine, target is found in tree already.

## Link outside of tree, but in root folder

```
root
+-- b
+-- node_modules
    +-- link => root/b
    +-- c
```

Edge from `root/b` to `root/node_modules/c`

Loads fine, b has no edges out.

## Link in tree, but not traversed node

```
root
+-- node_modules
    +-- link => root/node_modules/a/b
    +-- a
    |   +-- b
    +-- c
```

Edge from `root/node_modules/a/b` to `root/node_modules/c`

Loads fine, because link target has no edges out.

## Link outside of root folder

```
root
+-- node_modules
    +-- link => b

b
+-- node_modules
    +-- c
```

Edge from `b` to `b/node_modules/c`

Loads fine, because link target has no edges out.

## Link into other tree

```
root
+-- node_modules
    +-- link => a/node_modules/b

a
+-- node_modules
    +-- b
    +-- c
```
Edge from `a/node_modules/b` to `a/node_modules/c`

Load `b`'s deps as high as common ancestor of `b` and `root`, finding `c`
at `a/node_modules/c`.

## Link into other root folder

```
root
+-- node_modules
    +-- j => i/j

i
+-- j
+-- node_modules
    +-- k
```

Edge from `i/j` to `i/node_modules/k`

Loads because `i` is under common ancestor of `root` and `i/j`.

## Link into other tree folder

```
root
+-- node_modules
    +-- o => m/node_modules/n/o

m
+-- node_modules
    +-- n
    |   +-- o
    +-- p
```

Edge from `m/node_modules/n/o` to `m/node_modules/p`

Loads because `m` is under common ancestor of `root` and `o`.
