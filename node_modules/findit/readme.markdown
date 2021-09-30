# findit

Recursively walk directory trees. Think `/usr/bin/find`.

[![build status](https://secure.travis-ci.org/substack/node-findit.png)](http://travis-ci.org/substack/node-findit)

# example

``` js
var finder = require('findit')(process.argv[2] || '.');
var path = require('path');

finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') stop()
    else console.log(dir + '/')
});

finder.on('file', function (file, stat) {
    console.log(file);
});

finder.on('link', function (link, stat) {
    console.log(link);
});
```

# methods

``` js
var find = require('findit')
```

## var finder = find(basedir, opts)

Return an event emitter `finder` that performs a recursive walk starting at
`basedir`.

If you set `opts.followSymlinks`, symlinks will be followed. Otherwise, a
`'link'` event will fire but symlinked directories will not be walked.

If `basedir` is actually a non-directory regular file, findit emits a single
"file" event for it then emits "end".

You can optionally specify a custom
[fs](http://nodejs.org/docs/latest/api/fs.html)
implementation with `opts.fs`. `opts.fs` should implement:

* `opts.fs.readdir(dir, cb)`
* `opts.fs.lstat(dir, cb)`
* `opts.fs.readlink(dir, cb)` - optional if your stat objects from
`opts.fs.lstat` never return true for `stat.isSymbolicLink()`

## finder.stop()

Stop the traversal. A `"stop"` event will fire and then no more events will
fire.

# events

## finder.on('path', function (file, stat) {})

For each file, directory, and symlink `file`, this event fires.

## finder.on('file', function (file, stat) {})

For each file, this event fires.

## finder.on('directory', function (dir, stat, stop) {})

For each directory, this event fires with the path `dir`.

Your callback may call `stop()` on the first tick to tell findit to stop walking
the current directory.

## finder.on('link', function (file, stat) {})

For each symlink, this event fires.

## finder.on('readlink', function (src, dst) {})

Every time a symlink is read when `opts.followSymlinks` is on, this event fires.

## finder.on('end', function () {})

When the recursive walk is complete unless `finder.stop()` was called, this
event fires.

## finder.on('stop', function () {})

When `finder.stop()` is called, this event fires.

## finder.on('error', function (err) {})

Whenever there is an error, this event fires. You can choose to ignore errors or
stop the traversal using `finder.stop()`.

You can always get the source of the error by checking `err.path`.

# install

With [npm](https://npmjs.org) do:

```
npm install findit
```

# license

MIT
