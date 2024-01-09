# building the ideal tree

Options:

- update: Object || boolean.  If `true`, then treat as `{all:true}`
  - all: Boolean.  Ignore the lockfile, update everything everywhere as if
    it was a clean install.
  - names: Array.  Update any dependencies in the tree by that name.
- add: Object.  Provide dependencies, devDependencies, peerDependencies,
  and/or peerDependenciesMeta objects, and/or a bundleDependencies array,
  to add the metadata to the root node.
- rm: Array.  List of names to remove from the root node's dependencies
  objects.
- prune: Boolean, default true.  Remove extraneous nodes from the tree
  after building the ideal tree.
- preferDedupe: Boolean, default false.  Prefer to deduplicate packages if
  possible, rather than choosing a newer version of a dependency.  Default
  is to always try to get the highest possible version dependency, even if
  that causes more duplication.
- legacyBundling: Boolean, default false.  Always nest packages in their
  dependent's `node_modules` folder, even if they could be moved further up
  the tree, deduplicating only when the dependency is already met by a
  shallower node in the tree.  This is the layout algorithm of npm v1 and
  v2.

## to BUILD IDEAL TREE:

1. Load the root node's package and (if present) shrinkwrap
2. Add and remove deps to/from the root node's package if requested
3. If any named updates specified, then for each name on the list:
    1. Find all nodes in the tree by that name that are not in a shrinkwrap
       or bundle
    2. For each dependent in their edgesIn set, add the dependent to the
       queue of packages to be checked for updates
4. Add the root node to the queue of packages to be checked for updates
5. Loop until queue is empty:
    1. Sort the queue so that shallower nodes are in front, and then
       alphabetical
    2. Shift the next node off the list
    3. If node has already been visited, continue to next node (already
       visited)
    4. If node has been moved out of the tree or replaced, continue to next
       node (it's no longer relevant)
    5. If node has a shrinkwrap, continue to next node (its deps are
       locked)
    6. For each dependency in node.edgesOut:
        1. If part of a bundle or shrinkwrap, continue to next dependency
        2. If edge is invalid, or name is on the update.names list:
            1. Fetch the manifest for the dependency, and create a new Node
            2. Add Node to virtual root node, also load Node's
               peerDependencies (and meta-peerDependencies)
            3. Attempt to PLACE the dep in the tree
        3. Add each placed node to the queue to be checked for updates
6. If the shrinkwrap was loaded from disk, and the tree was mutated, reset
   all dependency flags to true (dev, optional, devOptionl, extraneous)
7. If the shrinkwrap was not loaded from disk, or the tree was mutated,
   calculate dependency flags appropriately (like for a `loadActual` walk)
8. If options.prune is not false, and we started from a shrinkwrap and then
   mutated the tree, prune any deps that are now extraneous.

## to PLACE a dep in the tree to satisfy an edge for a node:

Starting from the original thing depending on the dep, walk up the tree
checking each spot until we find the shallowest spot in the tree where the
dependency can go without causing conflicts.

1. If edge is valid, and dep name is not on the update list, do not place
2. If the node is not a top node, and the dep is a peer dep, then the
   starting TARGET is node.parent, otherwise it's node
3. Do until CONFLICT:
    1. CHECK if dep can be placed at TARGET
    2. If not CONFLICT, set result in CAN PLACE
    3. set TARGET to TARGET parent
4. If no satisfying target found, throw Unresolvable Dep Tree error
5. set TARGET to last non-conclict target checked
6. If CAN PLACE is KEEP, do not place
7. add dep to placed list
8. If an existing child by that name at TARGET,
    1. Prune any nodes that are only needed because of the node being
       replaced.  (Ie, the set of dependencies that are not valid for the
       new node being placed, and have no dependents outside of the set.)

         This is relevant because a cycle of peer deps can make it
         impossible to update otherwise.
    2. Replace the old child node with the new dep
9. Else, set dep.parent = TARGET
10. If the original edge is valid, but does not resolve to the newly placed
    dep, and the newly placed dep could replace the node that the edge
    _does_ resolve to, then we've created an unnecessary duplicate.  Prune
    the node that the edge resolves to.
11. If the newly placed node has any invalid edges in, add their sources to
    the update queue
12. For each peer dep in the virtual tree (the dep's former parent)
    1. If the dep's current dependency on that peer is met, then continue
       to next peer dep.
    2. PLACE to satisfy the peer edge
13. Return list of all placed nodes

## to CHECK if a dep can be placed at a target to satisfy an edge for a node

At each level walking up the tree, try to determine whether it's acceptable
to place the dependency at that point in the tree.

This can return:

- CONFLICT: it is incorrect to place that dependency here.  Note that there
  _are_ cases where we allow a dependency to be placed such that it causes
  problems, but only because we then clean up those problems.
- OK: no problem putting the dep here.
- KEEP: there is already a version at this spot that satisfies the
  dependency as well (or better) than the dep being placed.
- REPLACE: there is already a version at this spot, but the dep being
  placed is better, so put that here instead.

1. If a child by that name in target:
    1. If integrity matches current dep in tree, KEEP
    2. If node is root, REPLACE if peers can be placed
    3. If target has edge not met by dep, CONFLICT
    3. If current version is less than new version, REPLACE if peers can be
       placed
    4. If `preferDedupe` option is set, and current node can satisfy edge,
       then KEEP if peers can be placed.
    5. CONFLICT
2. Else, no child by that name in target
    1. If target is not node, and target has a dependency on dep's name,
       and dependency is not met by dep, then CONFLICT
    2. Find any descendants of target with a dependency on dep's name,
       which resolve to a node HIGHER in the dep tree than target, and
       which would be made invalid if this dep took its place (ie, would be
       made invalid if their deduped dependency was masked by dep).  IF any
       exist, CONFLICT
    3. OK to place dep in target
