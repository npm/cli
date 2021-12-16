A dependency that will first install its deps in one place, then have to
have them duped to accommodate a peer dependency from another of its deps.

This models the behavior of gatsby@2.24.53

```
gatsby -> (react-refresh@0.7.2, @pmmmwh/react-refresh-webpack-plugin@0.4.1)
@pmmmwh/react-refresh-webpack-plugin@0.4.1 -> PEER react-refresh@0.7.2
```

Initially `@pmmmwh/react-refresh-webpack-plugin@0.4.1` is installed
alongside `gatsby` and `react-refresh@0.7.2` like so:

```
+-- root
    +-- gatsby
    +-- @pmmmwh/react-refresh-webpack-plugin
    +-- react-refresh@0.7.2
```

Then, the peerDep from `@pmmmwh/react-refresh-webpack-plugin` on
`react-refresh@0.8.3` is evaluated, and has nowhere to go except where the
`react-refresh@0.7.2` is already living.

Since we _can_ move `react-refresh@0.7.2` underneath `gatsby`, we do so.

In this case:

```
override -> (a@2, v@1)
v@1 -> PEER(a@1)
```

This fails to install by default, because the `a` dep collides.

With `--force`, we override the peer with the direct root dep, and get:

```
override
+-- v@1
+-- a@2 (valid for root, invalid for v)
+-- b@2, c@2, ...
```

When installing `override` as a dep, we get:

```
push-dep
+-- v@1
+-- a@1
+-- b@1, c@1, ...
+-- override
    +-- a@2
    +-- b@2, c@2, ...
```

which is a compliant dependency resolution, where every module gets the
version of their dep that they declare.
