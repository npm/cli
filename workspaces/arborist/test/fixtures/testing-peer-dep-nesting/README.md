
# CASE A

```
root -> (s@1, p@2)
s@1 -> (x)
x -> PEER(p@1, q)
q -> PEER(p@1)
```

Expect:

```
root
+-- p@2
+-- s@1
    +-- x
    +-- p@1
    +-- q
```


## CASE B

```
root -> (s@2, p@2)
s@2 -> (x, y)
x -> PEER(p@1, q)
q -> PEER(p@1)
y -> PEER(z)
```

Expect:

```
root
+-- p@2
+-- s@2
|   +-- x
|   +-- p@1
|   +-- q@1
+-- y
+-- z
```
