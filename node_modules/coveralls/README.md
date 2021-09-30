# node-coveralls

[![Build Status][ci-image]][ci-url] [![Coverage Status][coveralls-image]][coveralls-url]

[Coveralls.io](https://coveralls.io/) support for Node.js. Get the great coverage reporting of coveralls.io and add a cool coverage button (like the one above) to your README.

## Supported CI services:

* [Travis CI](https://travis-ci.org/)
* [CodeShip](https://codeship.com/)
* [CircleCI](https://circleci.com/)
* [Jenkins](https://jenkins.io/)
* [Gitlab CI](https://gitlab.com/)
* [AppVeyor](https://www.appveyor.com/)
* [Buildkite](https://buildkite.com/)
* [GitHub Actions CI](https://github.com/features/actions)
* [CodeFresh](https://codefresh.io/)

## Installation:

Add the latest version of `coveralls` to your package.json:

```shell
npm install coveralls --save-dev
```

If you're using mocha, add `mocha-lcov-reporter` to your package.json:

```shell
npm install mocha-lcov-reporter --save-dev
```

## Usage:

This script `bin/coveralls.js` can take standard input from any tool that emits the lcov data format (including [mocha](https://mochajs.org/)'s [LCOV reporter](https://npmjs.org/package/mocha-lcov-reporter)) and send it to coveralls.io to report your code coverage there.

Once your app is instrumented for coverage, and building, you need to pipe the lcov output to `./node_modules/coveralls/bin/coveralls.js`.

This library currently supports [Travis CI](https://travis-ci.org/) with no extra effort beyond piping the lcov output to coveralls. However, if you're using a different build system, there are a few **necessary** environment variables:

- `COVERALLS_SERVICE_NAME` (the name of your build system)
- `COVERALLS_REPO_TOKEN` (the secret repo token from coveralls.io)
- `COVERALLS_GIT_BRANCH` (the branch name)

There are optional environment variables for other build systems as well:

- `COVERALLS_FLAG_NAME` (a flag name to differentiate jobs, e.g. Unit, Functional, Integration)
- `COVERALLS_SERVICE_NUMBER` (a number that uniquely identifies the build)
- `COVERALLS_SERVICE_JOB_ID` (an ID that uniquely identifies the build's job)
- `COVERALLS_SERVICE_JOB_NUMBER` (a number that uniquely identifies the build's job)
- `COVERALLS_RUN_AT` (a date string for the time that the job ran. RFC 3339 dates work. This defaults to your build system's date/time if you don't set it)
- `COVERALLS_PARALLEL` (set to `true` when running jobs in parallel, requires a completion webhook. More info here: <https://docs.coveralls.io/parallel-build-webhook>)

### GitHub Actions CI

If you are using GitHub Actions CI, you should look into [coverallsapp/github-action](https://github.com/coverallsapp/github-action).

Parallel runs example [workflow.yml](https://github.com/coverallsapp/coveralls-node-demo/blob/master/.github/workflows/workflow.yml)

### [CircleCI Orb](https://circleci.com/)

Here's our Orb for quick integration: [coveralls/coveralls](https://circleci.com/orbs/registry/orb/coveralls/coveralls)

Workflow example: [config.yml](https://github.com/coverallsapp/coveralls-node-demo/blob/master/.circleci/config.yml)

### [Travis-CI](https://travis-ci.org/)

Parallel jobs example: [.travis.yml](https://github.com/coverallsapp/coveralls-node-demo/blob/master/.travis.yml)

### [Jest](https://jestjs.io/)

- Install [jest](https://jestjs.io/docs/en/getting-started)
- Use the following to run tests and push files to coveralls on success:

  ```sh
  jest --coverage && coveralls < coverage/lcov.info
  ```

Check out an example [here](https://github.com/Ethan-Arrowood/harperdb-connect/blob/master/.travis.yml) which makes use of Travis CI build stages

### [Mocha](https://mochajs.org/) + [Blanket.js](https://github.com/alex-seville/blanket)

- Install [blanket.js](https://github.com/alex-seville/blanket)
- Configure blanket according to [docs](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md).
- Run your tests with a command like this:

  ```sh
  NODE_ENV=test YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha \
    --require blanket \
    --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
  ```

### [Mocha](https://mochajs.org/) + [JSCoverage](https://github.com/fishbar/jscoverage)

Instrumenting your app for coverage is probably harder than it needs to be (read [here](http://seejohncode.com/2012/03/13/setting-up-mocha-jscoverage/)), but that's also a necessary step.

In mocha, if you've got your code instrumented for coverage, the command for a Travis CI build would look something like this:

```sh
YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha test -R mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
```

Check out an example [Makefile](https://github.com/cainus/urlgrey/blob/master/Makefile) from one of my projects for an example, especially the test-coveralls build target. Note: Travis CI runs `npm test`, so whatever target you create in your Makefile must be the target that `npm test` runs (This is set in package.json's `scripts` property).

### [Istanbul](https://github.com/gotwarlost/istanbul)

#### With Mocha:

```sh
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
```

#### With Jasmine:

```sh
istanbul cover jasmine-node --captureExceptions spec/ && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
```

### [Nodeunit](https://github.com/caolan/nodeunit) + [JSCoverage](https://github.com/fishbar/jscoverage)

Depend on nodeunit, jscoverage, and coveralls:

```sh
npm install nodeunit jscoverage coveralls --save-dev
```

Add a coveralls script to "scripts" in your `package.json`:

```json
"scripts": {
  "test": "nodeunit test",
  "coveralls": "jscoverage lib && YOURPACKAGE_COVERAGE=1 nodeunit --reporter=lcov test | coveralls"
}
```

Ensure your app requires instrumented code when `process.env.YOURPACKAGE_COVERAGE` variable is defined.

Run your tests with a command like this:

```sh
npm run coveralls
```

For detailed instructions on requiring instrumented code, running on Travis CI and submitting to coveralls [see this guide](https://github.com/alanshaw/nodeunit-lcov-coveralls-example).

### [Poncho](https://github.com/deepsweet/poncho)

Client-side JS code coverage using [PhantomJS](https://github.com/ariya/phantomjs), [Mocha](https://mochajs.org/) and [Blanket](https://github.com/alex-seville/blanket):

- [Configure](https://mochajs.org/#running-mocha-in-the-browser) Mocha for browser
- [Mark](https://github.com/deepsweet/poncho#usage) target script(s) with `data-cover` HTML attribute
- Run your tests with a command like this:

  ```sh
  ./node_modules/.bin/poncho -R lcov test/test.html | ./node_modules/coveralls/bin/coveralls.js
  ```

### [Lab](https://github.com/hapijs/lab)

```sh
lab -r lcov | ./node_modules/.bin/coveralls
```

### [nyc](https://github.com/istanbuljs/nyc)

Works with almost any testing framework. Simply execute
`npm test` with the `nyc` bin followed by running its reporter:

```shell
nyc npm test && nyc report --reporter=text-lcov | coveralls
```

### [TAP](https://github.com/tapjs/node-tap)

Simply run your tap tests with the `COVERALLS_REPO_TOKEN` environment
variable set and tap will automatically use `nyc` to report
coverage to coveralls.

### Command Line Parameters

```shell
Usage: coveralls.js [-v] filepath
```

#### Optional arguments:

- `-v`, `--verbose`
- `filepath` - optionally defines the base filepath of your source files.

## Running locally

If you're running locally, you must have a `.coveralls.yml` file, as documented in [their documentation](https://docs.coveralls.io/ruby-on-rails#configuration), with your `repo_token` in it; or, you must provide a `COVERALLS_REPO_TOKEN` environment variable on the command-line.

If you want to send commit data to coveralls, you can set the `COVERALLS_GIT_COMMIT` environment-variable to the commit hash you wish to reference. If you don't want to use a hash, you can set it to `HEAD` to supply coveralls with the latest commit data. This requires git to be installed and executable on the current PATH.

## Contributing

I generally don't accept pull requests that are untested or break the build, because I'd like to keep the quality high (this is a coverage tool after all!).

I also don't care for "soft-versioning" or "optimistic versioning" (dependencies that have ^, x, > in them, or anything other than numbers and dots). There have been too many problems with bad semantic versioning in dependencies, and I'd rather have a solid library than a bleeding-edge one.


[ci-image]: https://github.com/nickmerwin/node-coveralls/workflows/Tests/badge.svg
[ci-url]: https://github.com/nickmerwin/node-coveralls/actions?workflow=Tests

[coveralls-image]: https://coveralls.io/repos/nickmerwin/node-coveralls/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/nickmerwin/node-coveralls?branch=master
