# sequential peer dep tree shuffling test

Dependency graph:

```
root -> a
root' -> (a, c)
a -> b@1
c -> PEER b@2
```

Starting state: `root` depends only on `a`, resulting dep tree is:

```
root
+-- a
+-- b@1
```

Then, root adds `c` dependency.  Expect:

```
root
+-- a
|   +-- b@1
+-- b@2
+-- c
```
