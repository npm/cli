These angular fixtures are extremely large. They have been modified using the
prune-versions.js script in this directory to trim out every release and
pre-release that does not match ^10.0.0 or ^11.0.0 to keep them smaller.
If you replace these files, they will be large and you should probably do the
same thing.


To use it hand edit the `time` property in the full packument (i.e. core.json)
to remove all of the versions you do not wish to have, then run:

```
node prune-versions.js ./path/to/core.json
```

This will remove any version not listed in the `time` property from the `versions`
block in both the full packument _and_ the minified packument.
