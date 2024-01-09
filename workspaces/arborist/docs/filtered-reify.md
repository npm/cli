# filtered reify

Use case: call `Arborist.reify()` but _only_ reify nodes that are the
dependencies of one specific node.

Examples:

- Global reification: we don't want to have to read the entire global space
  to install a new package globally.  Anything that is not in the
  `explicitRequests` list should be ignored.  Since `global` triggers
  `globalStyle` bundling, this means that effectively any other top-level
  node should be untouched.  Then if it is present in the idealTree but not
  in the actualTree, we don't end up deleting it, which has been the source
  of some very unfortunate bugs.

- Workspace reification: we want to be able to say `npm i -w foo -w bar` to
  only install specific workspaces and their (possibly hoisted/shared)
  dependencies.

The goal here would be that if we accidentally have more nodes in the
actualTree that are outside of the filter, we don't accidentally remove
them, or if we have nodes in the idealTree that are outside the filter, we
don't accidentally add/change them.

## approach 1 - limit actualTree and idealTree to filtered subtree

This is closest to the current behavior with respect to global installs.
However, rather than relying on starting with a filtered actualTree, and
trusting that we only built the idealTree correctly, we'd add a step where
we explicitly filter/prune both trees to only include the dependencies of
the starting Node.

Advantage is that reify and diff can remain unaware of dependency graphs.
Diff continues to just calculate the difference between trees, and reify
just makes the changes required to turn the existing actual nodes into the
ideal nodes.

Would avoid previous global install problems by adding an extra step to
prevent any accidental inclusion of nodes that are outside of the expected
set.

This would still require that the idealTree be built up in its entirety for
workspace installs, because some dependencies might be hoisted or shared,
and the idealTree that is _saved_ must still reflect these.

So, how to save the idealTree in its entirety, but only Diff the filtered
set?  Some kind of flag to tell Diff to ignore it?  The value of this
approach is that Diff doesn't have to know about the dependency
relationships, so if we have to put duct tape on it to communicate those
relationships out of band, then that's not great.  Maybe keep two
idealTree's around, one with the full set, and one that's filtered down to
just the bits we want to diff/install?

## approach 2 - make Diff dependency-graph-aware

This avoids having to maintain two idealTree instances, or do a subsequent
step to prune the trees before letting reify/diff operate on them, and
preserves the ability for reify() to remain dependency-agnostic.

Instead of starting from the root and walking `children` and `fsChildren`,
the Diff algorithm would start from the root node, and walk only to the
target filter node, and then walk through the `edgesOut` to find nodes that
need to be diffed.

### one pass

Instead of walking the physical `children`/`fsChildren` tree, _only_ walk
the `edgesOut` and build up the diff object that way.

The challenge here will be that we may end up several layers deep in the
physical tree, and then have to add a node that is shallower.  So that
makes the diff walking algorithm a bit more complicated, because we're not
just slapping a new object into a child set, but may find ourselves
back-tracking up the tree as the graph wanders around.

### two pass

Make a first pass to create the set of nodes based on the edgesOut
traversal.  Then do the current physical-tree based differencing walk, but
skipping any nodes that are not in the set.

This is potentially expensive if the trees are very large (eg, a project
with thousands of workspaces), but is safe and very low complexity.

Start with this.

## approach 3 - make Reify dependency-graph-aware

Given the existing complexity of reify(), making it have to look at the
dependency graph is a pretty big paradigm shift.  Currently, the one thing
that makes it reasonable to reason about, is that while the algorithm is
somewhat involved, it really only has one job (turn one representation of a
tree into another).
