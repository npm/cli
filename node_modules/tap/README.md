# node-tap

A <abbr title="Test Anything Protocol">TAP</abbr> test framework for
Node.js.

![Build Status](https://github.com/tapjs/node-tap/workflows/ci/badge.svg)

_Just wanna see some code? [Get started!](http://www.node-tap.org/basics/)_

It includes a command line test runner for consuming TAP-generating test
scripts, and a JavaScript framework for writing such scripts.

* [Getting started guide](http://www.node-tap.org/basics/)
* Built-in [test coverage](http://www.node-tap.org/coverage/)
* Many [reporter formats](http://www.node-tap.org/reporting/)
* Extensive [API](http://www.node-tap.org/api/) featuring:
  * Great [promise support](http://www.node-tap.org/promises/)
  * Comprehensive [assert library](http://www.node-tap.org/asserts/)
  * Other [advanced stuff](http://www.node-tap.org/advanced/)
  * Mocha-like [BDD DSL](http://www.node-tap.org/mochalike/)
  * [Parallel Testing](http://www.node-tap.org/parallel/)
* [Command-line interface](http://www.node-tap.org/cli/) for running tests
  (whether they use node-tap or not)

See [the changelog](http://www.node-tap.org/changelog/) for recent updates,
or just get started with [the basics](http://www.node-tap.org/basics/).

All this is too much to manage in a single README file, so head over to
[the website](http://www.node-tap.org/) to learn more.

## Why TAP?

Why should you use this thing!?  **LET ME TELL YOU!**

Just kidding.

Most frameworks spend a lot of their documentation telling you why they're
the greatest.  I'm not going to do that.

### <i lang="it" title="all tastes are tastes">tutti i gusti sono gusti</i>

Software testing is a software and user experience design challenge that
balances on the intersection of many conflicting demands.

Node-tap is based on [my](http://izs.me) opinions about how a test
framework should work, and what it should let you do.  I do _not_ have any
opinion about whether or not you share those opinions.  If you do share
them, you will probably enjoy this test library.

1. **Test files should be "normal" programs that can be run directly.**

   That means that it can't require a special runner that puts magic
   functions into a global space.  `node test.js` is a perfectly ok way to
   run a test, and it ought to function exactly the same as when it's run
   by the fancy runner with reporting and such.  JavaScript tests should be
   JavaScript programs; not english-language poems with weird punctuation.

2. **Test output should be connected to the structure of the test file in a
   way that is easy to determine.**

   That means not unnecessarily deferring test functions until `nextTick`,
   because that would shift the order of `console.log` output.  Synchronous
   tests should be synchronous.

3. **Test files should be run in separate processes.**

   That means that it can't use `require()` to load test files.  Doing
   `node ./test.js` must be the exact same sort of environment for the test
   as doing `test-runner ./test.js`.  Doing `node test/1.js; node
   test/2.js` should be equivalent (from the test's point of view) to doing
   `test-runner test/*.js`.  This prevents tests from becoming implicitly
   dependent on one anothers' globals.

4. **Assertions should not normally throw (but throws MUST be handled
   nicely).**

   I frequently write programs that have many hundreds of assertions based
   on some list of test cases.  If the first failure throws, then I don't
   know if I've failed 100 tests or 1, without wrapping everything in a
   try-catch.  Furthermore, I usually want to see some kind of output or
   reporting to verify that each one actually ran.

   Basically, it should be your decision whether you want to throw or not.
   The test framework shouldn't force that on you, and should make either
   case easy.

5. **Test reporting should be separate from the test process, included in
   the framework, and enabled by default for humans.**

   The [raw test output](https://www.node-tap.org/tap-format/) should be
   machine-parseable and human-intelligible, and a separate process should
   consume test output and turn it into a [pretty summarized
   report](https://www.node-tap.org/reporting/).  This means that test data
   can be stored and parsed later, dug into for additional details, and so
   on.  Also: nyan cat.

6. **Writing tests should be easy, maybe even fun.**

   The lower the barrier to entry for writing new tests, the more tests get
   written.  That means that there should be a relatively small vocabulary
   of actions that I need to remember as a test author.  There is no
   benefit to having a distinction between a "suite" and a "subtest".
   Fancy DSLs are pretty, but more to remember.

   That being said, if you return a Promise, or use a DSL that throws a
   decorated error, then the test framework should Just Work in a way that
   helps a human being understand the situation.

7. **Tests should output enough data to diagnose a failure, and no more or
   less.**

   Stack traces pointing at JS internals or the guts of the test framework
   itself are not helpful.  A test framework is a serious UX challenge, and
   should be treated with care.

8. **Test coverage should be included.**

   Running tests with coverage changes the way that you think about your
   programs, and provides much deeper insight.  Node-tap bundles
   [NYC](https://istanbul.js.org/) for this.

   It _does_ necessarily change the nature of the environment a little bit.
   But in this case, it's worth it, and NYC has come a long way towards
   maintaining this promise.

   Coverage _enforcement_ is not on by default, but I strongly encourage
   it.  You can put `"tap":{"check-coverage":true}` in your package.json,
   or pass [`--100`](https://www.node-tap.org/100/) on the command line.
   In a future version, it will likely be enabled by default.

9. **Tests should not require more building than your code.**

   Babel and Webpack are lovely and fine.  But if your code doesn't require
   compilation, then I think your tests shouldn't either.  Tap is extremely
   [promise-aware](https://www.node-tap.org/promises/).  JSX, TypeScript,
   Flow, and ES-Modules are
   [built-in](https://www.node-tap.org/using-with/) when tests are run by
   the tap CLI.

10. **Tests should run as fast as possible, given all the prior
    considerations.**

   As of version 10, tap supports [parallel
   tests](https://www.node-tap.org/parallel/).  As of version 13, the test
   runner defaults to running the same number of parallel tests as there
   are CPUs on the system.

   This makes tests significantly faster in almost every case, on any machine
   with multiple cores.

Software testing should help you build software.  It should be a security
blanket and a quality ratchet, giving you the support to undertake massive
refactoring and fix bugs without worrying.  It shouldn't be a purification
rite or a hazing ritual.

There are many opinions left off of this list!  Reasonable people can
disagree.  But if you find yourself nodding along, [maybe tap is for
you](https://www.node-tap.org/basics/).
