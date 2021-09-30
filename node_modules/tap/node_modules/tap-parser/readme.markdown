# tap-parser

parse the [test anything protocol](http://testanything.org/)

[![build status](https://secure.travis-ci.org/tapjs/tap-parser.png)](http://travis-ci.org/tapjs/tap-parser)

[![browser support](http://ci.testling.com/substack/tap-parser.png)](http://ci.testling.com/substack/tap-parser)

[![coverage status](https://coveralls.io/repos/tapjs/tap-parser/badge.svg?branch=master&service=github)](https://coveralls.io/github/tapjs/tap-parser?branch=master)

# example

``` js
// stream style
const Parser = require('tap-parser')
const p = new Parser(results => console.dir(results))
process.stdin.pipe(p)
```

given some [TAP](http://testanything.org/)-formatted input:

```
$ node test.js
TAP version 13
# beep
ok 1 should be equal
ok 2 should be equivalent
# boop
ok 3 should be equal
ok 4 (unnamed assert)

1..4
# tests 4
# pass  4

# ok
```

parse the output:

```
$ node test.js | node parse.js
{ ok: true, count: 4, pass: 4, plan: { start: 1, end: 4 } }
```

If you have a string, you can also turn it into an array of parse events,
and turn such an array back into a TAP string with `Parser.parse()` and
`Parser.stringify()`, respectively.

```js
// JSON.parse/stringify style

// Note that stringifying arbitrary object types isn't supported,
// because TAP is a streaming line-based protocol, not an object
// serialization notation like JSON or YAML.

const { parse, stringify } = require('tap-parser')
const fs = require('fs')
const tapData = fs.readFileSync('previous-test-output.tap')
const result = parse(tapData)
console.dir(result)
const reEncodedAsTap = stringify(result)
console.log(reEncodedAsTap)
```

# usage

This package also has a `tap-parser` command.

```
Usage:
  tap-parser <options>

Parses TAP data from stdin, and outputs the parsed result
in the format specified by the options.  Default output
uses node's `util.inspect()` method.

Options:

  -j [<indent>] | --json[=indent]
    Output event data as JSON with the specified indentation (default=2)

  -t | --tap
    Output data as reconstituted TAP based on parsed results

  -l | --lines
    Output each parsed line as it is recognized by the parser

  -b | --bail
    Emit a `Bail out!` at the first failed test point encountered

  -B | --no-bail
    Do not bail out at the first failed test point encountered
    (Default)

  -f | --flat
    Flatten all assertions to the top level parser

  -F | --no-flat
    Do not flatten all assertions to the top level parser
    (Default)

  -w | --ignore-all-whitespace
    Skip over blank lines outside of YAML blocks

  -o | --omit-version
    Ignore the `TAP version 13` line at the start of tests

  --strict
    Run the parser in strict mode

  --no-strict
    Do not run the parser in strict mode

  -s | --silent
    Do not print output, just exit success/failure based on TAP stream
```

# methods

``` js
const Parser = require('tap-parser')
```

## `const p = new Parser(options, cb)`

Return a writable stream `p` that emits parse events.

If `cb` is given it will listen for the `'complete'` event.

If `options` is given, it may contain the following flags:

- `preserveWhitespace` boolean which is `false` by default and will
  cause the parser to emit `line` events even for lines containing
  only whitespace.  (Whitespace lines in yaml blocks are always
  emitted, because whitespace is semantically relevant for yaml.)

- `strict` boolean which is `false` by default and causes the parser
  to treat non-TAP input as a failure.  Strictness is heritable to
  child subtests.  You can also turn strictness on or off by using the
  `pragma +strict` line in the TAP data to turn strictness on, or
  `pragma -strict` to turn strictness off.

- `bail` boolean which is `false` by default and will cause the parser
  to bail out (including emitting a synthetic `Bail out!` line)
  whenever a failed test point is encountered.

- `omitVersion` boolean which is `false` by default and will cause the
  parser to ignore `TAP version 13` lines.  Version lines in subtests
  cause problems with some parsers, so they are always ignored.

- `passes` boolean which is false by default and will add "passes" property
  for that contains the result of all passed tests

The `parent`, `level` and `buffered` options are reserved for internal
use.

# events

## `p.on('complete', function (results) {})`

The `results` object contains a summary of the number of tests
skipped, failed, passed, etc., as well as a boolean `ok` member which
is true if and only if the planned test were all found, and either
"ok" or marked as "TODO".

## `p.on('line', function (line) {})`

As each line of input is parsed, a `line` event is emitted.

"Synthetic" line events will be emitted to support the `bail`
behavior, and to inject `1..0` plan lines in subtests that have no
test points.  They can be used as a sort of "passthrough stream" to
sanitize and filter a TAP stream, with the caveat that, while `line`
events will be semantically equivalent to the TAP input, they will not
be a perfect replica of the input.

## `p.on('assert', function (assert) {})`

Every `/^(not )?ok\b/` line will emit an `'assert'` event.

Every `assert` object has these keys:

* `assert.ok` - true if the assertion succeeded, false if failed
* `assert.id` - the assertion number
* `assert.name` - optional short description of the assertion

and may also have

* `assert.todo` - optional description of why the assertion failure is
  not a problem.  (Boolean `true` if no explaination provided)
* `assert.skip` - optional description of why this assertion was
  skipped (boolean `true` if no explanation provided)
* `assert.diag` - a diagnostic object with additional information
  about the test point.

## `p.on('comment', function (comment) {})`

Every `/^# (.+)/` line will emit the string contents of `comment`.

## `p.on('plan', function (plan) {})`

Every `/^\d+\.\.\d+/` line emits a `'plan'` event for the test numbers
`plan.start` through `plan.end`, inclusive.

If the test is [completely
skipped](http://podwiki.hexten.net/TAP/TAP.html?page=TAP#Skippingeverything)
the result will look like

```
{ ok: true,
  count: 0,
  pass: 0,
  plan:
   { start: 1,
     end: 0,
     skipAll: true,
     skipReason: 'This code has no seat belt' } }
```

## `p.on('version', function (version) {})`

A `/^TAP version (\d+)/` line emits a `'version'` event with a version
number or string.

## `p.on('bailout', function (reason) {})`

A `bail out!` line will cause the parser to completely stop doing
anything.  Child parser bailouts will bail out their parents as well.

## `p.on('child', function (childParser) {})`

If a child test set is embedded in the stream like this:

```
TAP Version 13
1..2
# nesting
    1..2
    ok 1 - true is ok
    ok 2 - doag is also okay
ok 1 - nesting
ok 2 - second
```

then the child stream will be parsed and events will be raised on the
`childParser` object.

Since TAP streams with child tests *must* follow child test sets
with a pass or fail assert based on the child test's results, failing
to handle child tests should always result in the same end result.
However, additional information from those child tests will obviously
be lost.

See `Subtests` below for more information on which sorts of subtest
formats are supported by this parser.

## `p.on('result', function (assert) {})`

This is the same as the `assert` event, except that it only emits on the root
parser, whenever it or any child parser has an `assert` event that is not
merely closing a child test block.

## `p.on('pass', function (assert) {})`
## `p.on('fail', function (assert) {})`
## `p.on('skip', function (assert) {})`
## `p.on('todo', function (assert) {})`

Emitted on the root parser object, whenever it or any child parser has an
`assert` event that is not merely closing a child test block, if the result is
of the appropriate type.

## `p.on('extra', function (extra) {})`

All other lines will trigger an `'extra'` event with the line text.

# static method: `const results = Parser.parse(string, options = {})`

This will return an array of all the events encountered in the parsed TAP
string.

Any options to the `Parser` constructor may be provided, in addition to the
following:

* `flat`: Boolean, default false, flatten nested child tests into a single
  level.  Note that this will lose child test information, and will result
  in a `complete` event that may not match the counts of assertions in the
  list.  This is useful if you are transforming TAP strings for use by a
  parser that does not support child tests, or just simply don't care about
  that level of detail.  Result `id` values will be coerced to an
  incrementing numeric values, and a valid `plan` will be generated at the
  end of the stream.

# static method: `const tap = Parser.stringify(results, options = {})`

Turn a `results` list of the sort returned by `Parser.parse()` into a TAP
string.

The following options are supported:

* `flat`: Boolean, default false, flatten nested child tests into a single
  level.  Note that this will lose child test information, and will result
  in a `complete` event that may not match the counts of assertions in the
  list.  This is useful if you are transforming TAP strings for use by a
  parser that does not support child tests, or just simply don't care about
  that level of detail.  Result `id` values will be coerced to an
  incrementing numeric values, and a valid `plan` will be generated at the
  end of the stream.

The `indent` and `id` options are used internally, and should not be
modified.

# install

With [npm](https://npmjs.org) do:

```
npm install tap-parser
```

You can use [browserify](http://browserify.org) to `require('tap-parser')` in
the browser.

# license

MIT

# subtests

5 flavors of Subtests are suppored by this parser.

1. Unadorned.
   Indented TAP data with no comment, followed by a test
   point at the parent level.

    ```
        ok 1
        1..1
    ok 1 - child test
    1..1
    ```

2. Indented comment.
   An indented `# Subtest: <name>` comment, followed by indented TAP
   data, and then a not-indented test point with a matching name.
   The summary test point may have yaml diagnostics.

    ```
        # Subtest: child test
        ok 1
        1..1
    ok 1 - child test
    1..1
    ```

3. Unindented comment.
   A not-indented `# Subtest: <name>` comment, followed by indented TAP
   content, followed by a test point with a matching name.
   The summary test point may have yaml diagnostics.

    ```
    # Subtest: child test
        ok 1
        1..1
    ok 1 - child test
    1..1
    ```

4. Buffered, without diagnostics.
   A test point line ending in {, followed by indented TAP content, ended
   with a } to close the block.  todo/skip directives may come *either*
   before or after the `{` character.  Yaml diagnostics are not allowed.

    ```
    ok 1 - child test {
        ok 1
        1..1
    }
    1..1
    ```

5. Buffered, with diagnostics.
   A test point line with yaml diagnostics, followed by `{` alone on a
   line, indented TAP data, and then a `}`.

    ```
    ok 1 - child test
      ---
      some: diagnostic
      data: true
      ...
    {
        ok 1
        1..1
    }
    ```

In all cases, the parsed behavior is identical:

1. The parent emits a `child` event with the `childParser` as an
   argument.
2. The `childParser` emits a `comment` with `# Subtest: <name>` (or
   `(anonymous)` for Unadorned subtests.)
3. When the test is over, the closing test point is emitted on parent
   test.

That is, buffered and nonindented/indented comment subtests are parsed
as if they are identical input, since their semantics are the same.  This
simplifies implementation of test harness and reporter modules.

Since unadorned subtests have no introduction, a child event is not
emitted until the first "relevant tap" line is encountered.  This can
cause confusion if the test output contains a spurious "    1..2" line
or something, but such cases are rare.

Similarly, this means that a test point ending in `{` needs to wait to
emit *either* the 'assert' or 'child' events until an indented line is
encountered.  *Any* test point with yaml diagnostics needs to wait to
see if it will be followed by a `{` indicating a subtest.
