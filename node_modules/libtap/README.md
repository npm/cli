# libtap

A <abbr title="Test Anything Protocol">TAP</abbr> test library for
Node.js.

## `libtap` vs `tap`

`tap` extends this module and provides many other nice features.  Generally
you should be using `require('tap')` instead of `require('libtap')`.  In some
edge cases it can be appropriate to use `libtap` directly.

* Install size is important - `libtap` has significantly less dependencies.
* Your tests are suspectable to transformations or other environmental changes.
  `tap` does things that are useful by default, if this causes problems for your
  code you may wish to go lower level.

### Recursive rmdir

Some parts of `libtap` require recursive rmdir functions.  In Node.js 12.10.0+
this is provided by the Node.js core `fs` module.  For older versions of Node.js you
must set compatible functions:

```js
const rimraf = require('rimraf')
const settings = require('libtap/settings')
settings.rmdirRecursiveSync = dir => rimraf.sync(dir, {glob: false})
settings.rmdirRecursive = (dir, cb) => rimraf(dir, {glob: false}, cb)
```

This is handled by `tap` so only direct users of `libtap` who need to support older
versions of Node.js need to worry about this.

It is not considered semver-major for a libtap function to use recursive rmdir where
it previously did not.  If you test on older versions of Node.js then you must ensure
a user-space implementation is available even if it is not currently needed.

## Environmental changes still in place

* signal-exit is run
* async-domain-hook is run
* process.stdout.emit is monkey-patched to swallow EPIPE errors
* process.reallyExit and process.exit are monkey-patched
* Handlers are added to process `beforeexit` and `exit` events

These all have an effect on the environment and may be undesirable in some edge cases.
Should any/all of these be opt-out or even opt-in?  The goal is to be able to create
functional tests using `require('libtap')`.
