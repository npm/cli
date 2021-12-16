# handling optional dependencies failures

If optional dependencies fail to install, we should remove the optional dep
from the disk, but keep them included in the lockfile.  If they are
unresolveable, then they should be removed from the `idealTree`.

Types of failure:

1. Optional dependency metadata failure (404, etc.) `optional-dep-missing`
2. Optional dependency tgz download failure `optional-dep-tgz-missing`
3. Optional dependency version not satisfiable `optional-dep-enotarget`
4. Optional dependency build failure `optional-dep-postinstall-fail`
5. Optional dependency specifies unsupported engine or platform `optional-platform-specification`
6. Optional dependency depends on any failure above
      1. `optional-metadep-missing`
      2. `optional-metadep-tgz-missing`
      3. `optional-metadep-enotarget`
      4. `optional-metadep-postinstall-fail`

These failures can occur in one of three places:

1. buildIdealTree (unresolveable or failed metadata optional dep/meta-dep)

2. reifyNode (failure to download/unpack tgz, engine/platform unsupported)

3. lifecycle scripts



After taking the diff, get the list of modules to remove `trashList`

Also add the retired folders to the trash list when they're ready to be
removed

If a dep fails, and it has `optional: true`, then we have to find the entry
point into the optional tree.  Eg, `a -> b -OPT-> c -> d`, if `d` fails,
then we need to remove `c`, as well as any dependencies of `c` that are not
depended upon by any modules outside of the set.



- Gather the set of nodes linking into the node that are not `optional:
  true`.  We know this won't be unbounded, because the node is optional in
  the first place.

- Add the set of dependencies from that root node that don't have any
  edgesIn from outside the set.

- Add the nodes in the set to the `trashList`. 
