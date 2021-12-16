# peer optional failure F

```
root -> (x, z@1)
x -> PEEROPTIONAL(y) PEER(z@1) PEER(w@1)
w -> PEER(z@1)
y -> PEER(z@2)
```

[npm/arborist#223](https://github.com/npm/arborist/issues/223)

[npm/arborist#236](https://github.com/npm/arborist/issues/236)

The same as case E, but with the addition of a `x->w->z` peerDep chain.
