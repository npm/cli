Verify that bundled deps are not unnecessarily duplicated outside of the
bundling node, leading to missed extraneous nodes.

Dep graph:

```
root -> (x)
x -> (y<bundle>, z, abbrev)
y -> z
z -> a
```

`x` bundles `y`, implicitly bundling `z` and `a`

The version of `a` bundled in `x` is older than latest.

`abbrev` is not bundled, either implicitly or explicitly, and so _should_
be installed at the shallowest possible location.

## expect

```
root
+-- abbrev
+-- x
    +-- y
    +-- z
    +-- a
```
