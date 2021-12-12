Honestly still not exactly sure how this happened.  I was switching back
and forth between installing and removing a variety of things with npm v6
and v7, and somehow ended up in a case where it was trying to fetch a dep
that somehow did not have a resolved value.

My best guess is that it has something to do with the fact that mkdirp and
minimist are bundled in tap 14, but not in tap 12, and npm v6 isn't as
aggressive about re-optimizing the tree for nested deps, but arborist did
pluck off the `bundled: true` when setting back to tap 12.

Anyway, saved as a test case so we can verify that the defensive handling
of this brokenness works as intended.
