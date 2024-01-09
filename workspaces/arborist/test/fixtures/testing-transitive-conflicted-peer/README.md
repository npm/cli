# @isaacs/testing-transitive-conflicted-peer

This demonstrates a case where a transitive dependency of a project
has a peer dependency which can only be placed in the root, but conflicts
with the root's direct dependency.

```
root -> (a, b@2)
a -> (c), PEER(b@1||2)
c -> PEER(b@1)
```

The algorithm places `a` and `b@2` in the root, as it must.

When seeking a placement for `c`, it hits a `CONFLICT` with the peerDeps
`c->(b@1)` and `root->(b@2)`.  Since that is not the deepestNestingTarget
for `c`, it places it under `a` as the target.

(NB: this is somewhat inefficient in this particular sort of situation, as
it can lead to unnecessary duplication, and there is no practical benefit
in this case to nesting `c` under `a`.  But as a general heuristic, it
prevents most conflicts, and the work to determine that nesting is
effectively the same outcome as deduplicating can be expensive.)

Then, resolving the `c->(b@1)` peer dep, it cannot place `b` under `a`,
because `a` has a peerDep on `b`.  So, the deepest nesting target for `b`
is under `root`.

However, there it hits a conflict, and checks to see if the `c` node (the
nearest non-peer dependency leading to the conflicted node) is one of our
project's direct dependencies.  Since it is not, this is a warning, rather
than an error.
