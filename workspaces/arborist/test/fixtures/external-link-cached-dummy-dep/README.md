
```
root (y)
+-- node_modules
    +-- x => a/node_modules/b/node_modules/x (depends on y)
    |   creates dummy node a/node_modules/b
    +-- z => a/z
        | creates dummy node a
        | depPath is a/node_modules/b
        | already in cache, and a dummy!
a
+-- node_modules
|   +-- b
|       +-- node_modules
|           +-- y
|           +-- x (y)
+-- z (b)
```

- loadFSTree root
- find y
- loadFSNode root/nm/y (link)
- loadFSNode a/nm/b/nm/y (has missing edge x)
- loadFSNode root/nm/z (link)
- loadFSNode a/z (has missing edge b)


findMissingEdges!

- a/nm/b/nm/x (missing y)
  - check a/nm/b/nm/nm/y (not there)
  - check a/nm/b/nm/y (found!)
    - create dummy node for a/nm/b to be parent of a/nm/b/nm/y
- a/z (missing b)
  - check a/nm/b (found!)
    BUT!!! a/nm/b is a dummy node, and in the cache.
