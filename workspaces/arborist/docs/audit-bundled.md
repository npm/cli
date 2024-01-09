# audit advisories on bundled dependencies

```
root -> (x)
x -> (BUNDLE y)
y -> !known vulnerability!
```

With a normal dep, any version of `x` would be considered vulnerable if its
dependency on `y` is entirely contained by the vulnerable range on the `y`
advisory.

However, with `bundleDependencies`, any version of `x` whose dependency on
`y` _intersects_ with the vulnerable range on the `y` advisory should be
considered potentally vulnerable.

When considering the meta-vulnerability of any version of `x`, thus:

- If `x -> y` is gone, `x` is not vulnerable.
- If `x -> y` is not in `bundleDependencies`, treat as we normally do.
- If `x -> y` IS a in `bundleDependencies`, then treat `x` as a meta-vuln
  if `semver.intersects(x's dep on y, y's vulnerability range)`

From there, we just treat it as a regular meta-vulnerability, and report
the appropriate fix accordingly.
