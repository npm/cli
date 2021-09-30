# treporter

Reporters for node-tap

An [ink](http://npm.im/ink)-based reporter for use with
[tap](http://npm.im/tap) version 13 and higher.

## Built-in Report Types

### Base

The default, and the class to extend to create new reporters.  Does all the
things, handles all the edge cases, and ends with a pleasant surprise.

### Terse

A lot like Base, but says a lot less.  No timer, no list of tests concurrently
running, nothing printed on test passing.  Just the failures and the terse
summary.

### Specy

A `spec` style reporter with the current running jobs and Terse summary and
footer.

## Extending

You can extend this by creating a module whose main `module.exports` is a
child class that extends the `treport.Base` class (which in turn extends
`React.Component`).

```js
const React = require('react')
const {Base} = require('treport')
class MyTreportBasedTapReporter extends Base {
  // my stuff...
}
module.exports = MyTreportBasedTapReporter
```

To use your module as the test reporter, you'd do this:

```
npm install -D my-treport-based-tap-reporter
tap --reporter=my-treport-based-tap-reporter
```

Tap will `require()` that module, see it's a `React.Component`, and use it
with ink.

Your child class will get its `constructor()` called with `{tap:tap}`,
which is the root tap object for the test runner.

It can override the `render()` method, or anything else.  In most cases, you
will likely want to override just part of the class, or one of the tags used
for the layout, but the sky is the limit.  A child class could also modify the
data being tracked, but leave the tags untouched.

The following methods describe each of the class methods that can be
overridden.

### render()

The main rendering entry point, as is the React custom.  The Base class
returns:

```jsx
<Box flexDirection="column">
  <this.Log log={this.state.log} />
  <this.Runs runs={this.state.runs} />
  { this.state.results ? (
      <this.Summary
        results={this.state.results}
        tests={this.state.tests} />
    )
    : '' }
  <this.Footer
    suiteCounts={suiteCounts}
    assertCounts={assertCounts}
    time={time} />
</Box>
```

One of the easiest ways to change the look and feel of the test reporter is to
swap out these components.

### get Log()

A getter function that returns the React component for the "log" section.  This
section gets failure/todo/skip results pushed into it, as well as the final
pass/fail/todo/skip result for tests when they complete.  Typically, it should
use a `<Static>` tag, since this will often get much longer than the height of
the terminal window, and you want to be able to see the results.

See `state.log` below for more info.

### get Runs()

- `runs` Array of Test objects

A getter function that returns the React component for the "runs" section.
`this.state.runs` is a list of the tests currently in progress.

### get Summary()

This is a section that shows when the test run is fully completed.  It shows a
pretty banner with rainbows, along with any tests that failed, or are marked as
skip or todo.

### get Footer()

This is a section that shows the count of test suites (ie, processes) queued
and completed, a count of assertions completed, and a timer so you can see how
long the test is running for.

## State Properties

The reporter keeps the following state properties up to date as the test
proceeds:

### this.state.log

Array of log objects.  Each is one of the following types:

- `{ raw: <String> }` just a plain old string.
- `{ res: {ok, name, diag, todo, skip, testName} }` A test point
- `{ test: [Test Object] }` A test that has completed

### this.state.tests

All tests are added to this array.  In the event of a bailout, everything other
than the bailing-out test is removed, so that the Summary output isn't
cluttered up with a bunch of spurious failures.

### this.state.runs

Array of tests currently running.  (When not running in parallel mode, this is
always a single item.)

### this.state.results

The `tap.results` object at the end of the test run.

### this.state.assertCounts

Counts of all assertions run in all tests. `{total, pass, fail, skip, todo}`

In order to avoid overwhelming the display, updates to assertion counts are
debounced so that they are not updated more than once every 50ms.

### this.state.suiteCounts

Just like `assertCounts`, but for test suites, and not debounced.

### this.state.time

Total elapsed time in ms since the test run started.

### this.state.bailout

When a bailout occurs, this is set to the bailout reason, or `true` if no
reason is given.

### this.start

The `Date.now()` when the test run started.

### this.assertCounts

Updated on each test assertion.  Matched to `this.state.assertCounts` at most
once every 50ms.

### constructor()

The constructor receives `tap` as an argument, initializes state, and assigns
appropriate event handlers to keep state up to date.  Then, the
`this.tapResume(tap)` method is called to resume and discard the TAP output
from the test harness, since the reporter gets everything it needs from the
events and child test objects.

### tapResume(tap)

Override to prevent the `tap` object from being resumed when calling the Base
constructor.

### get time()

Called to get the current running time.

### bailout(bailout, test = null)

Called when a test bails out.  If `test` is set to null, then that means that
the root Tap test is bailing out independently of any child test.  (This is
unusual.)

### inc(type)

Called on each assertion to increment `this.assertCounts` and
`this.state.assertCounts`.

### addTest(test)

Called whenever a new test is added to the queue (but before it has started
running).

### startTest(test)

Called when a test starts.

### endTest(test)

Called when a test ends.

### endAll(tap)

Called when the main all tests are done and the tap test runner completes.

### logRes(test, res)

Called when a fail/todo/skip result is emitted from a test, and pushes it onto
the log.

### onRaw(test, fd)

Returns a handler to take all the non-TAP data from a child test, so that it
can be printed to the log with a helpful prefix.  In the Base test class, this
prefixes with the name of the test and the file descriptor printed to.

So, for example, a test named `test/foo.js` would have its stderr output
prefixed with `test/foo.js 2> ...` and its stdout output prefixed with
`test/foo.js 1> ...`.
