# tree diffing

For the tree:

```
a
+-- b
|   +-- c
|   +-- d
|   |   +-- e
|   +-- f
+-- x
|   +-- y
|       +-- z
+-- p
    +-- q
```

To turn it into:

```
a
+-- b'
|   +-- c'
|   +-- d
|   |   +-- e'
|   +-- f
+-- x
|   +-- y'
|       +-- z
+-- i
    +-- j
```

That is, update b, c, e, and y, but not d, x, or z, and remove p and q, and
add i and j.

The Diff set looks like:

```
+-- b (change)
|   +-- c (change)
|       +-- e (change)
+-- y (change)
+-- p (remove)
+-- i (add)
    +-- j (add)
```

Each Diff node has a reference to the actual and ideal node that it refers
to, and a list of each leaf `diff` object under its tree, and a list of
each ideal tree node that isn't changing.
