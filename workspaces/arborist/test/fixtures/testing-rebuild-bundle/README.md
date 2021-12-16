- `root` depends on `parent`
- `parent` bundles `a`
- `a` depends on `b`
- `b` has a build script

Should get rebuilt if `rebuildBundle` is true, otherwise not.
