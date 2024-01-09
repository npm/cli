# peer optional failure D

```
root -> (x, z@1)
x -> PEEROPTIONAL(y)
y -> PEER(z@2)
```

[npm/arborist#223](https://github.com/npm/arborist/issues/223)

[npm/arborist#236](https://github.com/npm/arborist/issues/236)

Subtly similar to case A, but note y and z swapped, so that they are
resolved in the reverse order (because deps are alphabetically sorted for
consistency).  This is relevant, because it ensures that there's no dep
present in the peerSet until _after_ the conflict is encountered, and that
code path was not being hit.
