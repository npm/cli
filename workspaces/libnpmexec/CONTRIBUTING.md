# Contributing
## Table of Contents

* [Introduction](#introduction)
* [Running Tests](#running-tests)
* [Coverage](#coverage)
* [Types of Contributions](#types-of-contributions)
  * [Contributing an Issue?](#contributing-an-issue)
  * [Contributing a Question?](#contributing-a-question)
  * [Contributing a Bug Fix?](#contributing-a-bug-fix)
  * [Contributing a Feature?](#contributing-a-feature)
* [Development Dependencies](#development-dependencies)
* [Dependencies](#dependencies)

## Introduction

Welcome to the **libnpmexec** Contributor Guide! This document outlines the libnpmexec's process for community interaction and contribution. This includes the issue tracker, pull requests, wiki pages, and, to a certain extent, outside communication in the context of the libnpmexec. This is an entry point for anyone wishing to contribute their time and effort to making libnpmexec a better tool for the JavaScript community!

All interactions in the **libnpmexec** repository are covered by the [npm Code of Conduct](https://www.npmjs.com/policies/conduct)


## Running Tests

```
# Make sure you install the dependencies first before running tests.
$ npm install

# Run tests for the CLI (it could take awhile).
$ npm run test
```

## Coverage

We try and make sure that each new feature or bug fix has tests to go along with them in order to keep code coverages consistent and increasing. We are actively striving for 100% code coverage!

## Types of Contributions

> Before contributing something, double check the issue you're creating doesn't already exist in the repository but doing a quick search. Search of the [current issues](https://github.com/npm/libnpmexec/issues).

### Contributing a Question?

Huh? 🤔 Got a situation you're not sure about?! Perfect!

You can create a new question [here](https://github.com/npm/libnpmexec/issues/new?template=question.md&title=%5BQUESTION%5D+%3Ctitle%3E)!

### Contributing a Bug Fix?

We'd be happy to triage and help! Head over to the issues and [create a new one](https://github.com/npm/libnpmexec/issues/new?template=bug.md&title=%5BBUG%5D+%3Ctitle%3E)!


### Contributing a Feature?

Snazzy, we're always up for fancy new things! If the feature is fairly minor [create a new one](https://github.com/npm/libnpmexec/issues/new?template=feature.md&title=%5BFEATURE%5D+%3Ctitle%3E), and the team can triage it and prioritize it into our backlog. However, if the feature is a little more complex, then it's best to create an [RFC](https://en.wikipedia.org/wiki/Request_for_Comments) in our [RFC repository](https://github.com/npm/rfcs). Exactly how to do that is outlined in that repository. If you're not sure _exactly_ how to implement your idea, or don't want to make a document about your idea, then please create an issue on that repository. We consider these RRFC's, or a "Requesting Request For Comment".

## Development Dependencies

You'll need a few things installed in order to update and test **libnpmexec** during development:


* [node](https://nodejs.org/) v10 or greater

> We recommend that you have a [node version manager](https://github.com/nvm-sh/nvm) installed if you plan on fixing bugs that might be present in a specific version of node. With a version manager you can easily switch versions of node and test if your changes to the CLI project are working.

* [git](https://git-scm.com/) v2.11+


## Dependencies
<!-- Optional Section -->
