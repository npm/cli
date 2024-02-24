# Contributing

## Code of Conduct

All interactions in the **npm** organization on GitHub are considered to be covered by our standard [Code of Conduct](https://docs.npmjs.com/policies/conduct).

## Reporting Bugs

When submitting a new bug report, please first [search](https://github.com/npm/cli/issues) for an existing or similar report & then use one of our existing [issue templates](https://github.com/npm/cli/issues/new/choose) if you believe you've come across a unique problem. Duplicate issues, or issues that don't use one of our templates may get closed without a response.

## Development

**1. Clone this repository...**

```bash
$ git clone git@github.com:npm/cli.git npm
```

**2. Navigate into project & install development-specific dependencies...**

```bash
$ cd ./npm && node ./scripts/resetdeps.js
```

**3. Write some code &/or add some tests...**

```bash
...
```

**4. Run tests & ensure they pass...**
```
$ node . run test
```

**5. Open a [Pull Request](https://github.com/npm/cli/pulls) for your work & become the newest contributor to `npm`! 🎉**

## Pull Request Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).  When opening a pull request, please be sure that either the pull request title, or each commit in the pull request, has one of the following prefixes:

 - `feat`: For when introducing a new feature.  The result will be a new semver minor version of the package when it is next published.
 - `fix`: For bug fixes. The result will be a new semver patch version of the package when it is next published.
 - `docs`: For documentation updates.  The result will be a new semver patch version of the package when it is next published.
 - `chore`: For changes that do not affect the published module.  Often these are changes to tests.  The result will be *no* change to the version of the package when it is next published (as the commit does not affect the published version).

## Test Coverage

We use [`tap`](https://node-tap.org/) for testing & expect that every new feature or bug fix comes with corresponding tests that validate the solutions. Tap also reports on code coverage and it will fail if that drops below 100%.

To run your repository's version of the npm cli on your local machine use the following commands:

**npm commands:**
```bash
node . <command>
```

**npx commands:**
```bash
node . exec
```

For example instead of:
```bash 
npm exec -- <package>
```  
Use:
```bash
node . exec -- <package>
```


## Performance & Benchmarks

We've set up an automated [benchmark](https://github.com/npm/benchmarks) integration that will run against all Pull Requests; Posting back a comment with the results of the run.

**Example:**

![image](https://user-images.githubusercontent.com/2818462/72312698-e2e57f80-3656-11ea-9fcf-4a8f6b97b0d1.png)

You can learn more about this tool, including how to run & configure it manually, [here](https://github.com/npm/benchmarks)

## What _not_ to contribute?

### Dependencies

It should be noted that our team does not accept third-party dependency updates/PRs. We have a [release process](https://github.com/npm/cli/wiki/Release-Process) that includes checks to ensure dependencies are staying up-to-date & will ship security patches for CVEs as they occur. If you submit a PR trying to update our dependencies we will close it with or without a reference to these contribution guidelines.

### Tools/Automation

Our core team is responsible for the maintenance of the tooling/automation in this project & we ask collaborators to kindly not make changes to these when contributing (ex. `.github/*`, `.eslintrc.json`, `.licensee.json` etc.)
