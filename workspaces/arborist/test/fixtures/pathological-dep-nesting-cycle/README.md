A cycle of dependencies that threatens to trigger an infinite regress of
nesting.

We fix this by adding a symlink up to the shallower match.

```
a@1 -> b@1
a@2 -> b@2
b@1 -> a@2
b@2 -> a@1
```

Resulting nesting goes:

```
+-- a@1
+-- b@1
    +-- a@2
    +-- b@2
        +-- a@1
        +-- b@1
            ... and so on
```

To prevent it, we do this:

```
+-- a@1
+-- b@1
    +-- a@2
    +-- b@2
        +-- a@1 --> ../../a
```
