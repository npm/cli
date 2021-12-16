# testing-bundle-dupes

```
a@1 -> b@1
a@2 -> b@2
```

Start:

```
root -> BUNDLE(a@1, b@1)

root
+-- b@1
+-- a@1
```

Add `a@2.0.0` to root (before b@2.1.0 publish time)

```
root
+-- b@1
+-- a@2.0.0
    +-- b@2.0.0
```

`b@2.1.0` is published

Add `b@2.1.0` to root

Expect:

```
root
+-- b@2.1.0
+-- a@2.0.0
```
