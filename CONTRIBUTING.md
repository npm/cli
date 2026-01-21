# Contributing to Rauch Tech CLI

Thank you for your interest in contributing to Rauch Tech! We welcome contributions from the community and are committed to making the process as smooth as possible.

## Code of Conduct

All interactions in the Rauch Tech organization on GitHub are covered by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior to [conduct@rauchtech.example](mailto:conduct@rauchtech.example).

## Reporting Bugs

When submitting a new bug report, please:

1. First [search](https://github.com/Rauch-Tech/cli/issues) for an existing or similar report.
2. Use one of our existing [issue templates](https://github.com/Rauch-Tech/cli/issues/new/choose) if you believe you've come across a unique problem.
3. Include as much detail as possible:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, Node version, etc.)

Duplicate issues or issues that don't use our templates may be closed without a response.

## Development

### Getting Started

**1. Fork and clone this repository**

```bash
git clone git@github.com:YOUR-USERNAME/cli.git rauch-cli
cd rauch-cli
```

**2. Install dependencies**

```bash
npm ci
node ./scripts/resetdeps.js
```

**3. Create a feature branch**

```bash
git checkout -b feat/short-description
```

**4. Write code and add tests**

- Write tests for new functionality
- Ensure existing tests still pass
- Follow the existing code style

**5. Run tests and ensure they pass**

```bash
npm test
```

**6. Lint your code**

```bash
npm run lint
npm run lintfix  # to automatically fix issues
```

**7. Commit your changes**

Follow our commit message conventions (see below).

**8. Push and open a Pull Request**

```bash
git push origin feat/short-description
```

Open a [Pull Request](https://github.com/Rauch-Tech/cli/pulls) against the `main` branch.

## Pull Request Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). When opening a pull request, please ensure that either the pull request title or each commit in the pull request has one of the following prefixes:

- `feat`: Introduces a new feature (semver MINOR)
- `fix`: Fixes a bug (semver PATCH)
- `docs`: Documentation updates only (semver PATCH)
- `chore`: Changes that don't affect the published module (no version change)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `ci`: Changes to CI/CD configuration

### Pull Request Guidelines

- Keep PRs focused and small where possible
- Describe the rationale for your changes
- Document any upgrade or migration impacts
- Link related issues
- Ensure all tests pass
- Update documentation as needed

## Test Coverage

We use [`tap`](https://node-tap.org/) for testing and expect that every new feature or bug fix comes with corresponding tests. We maintain 100% code coverage, and the build will fail if coverage drops below this threshold.

## Code Style

- Follow the existing code style in the project
- Use ESLint to check your code: `npm run lint`
- Fix linting issues automatically when possible: `npm run lintfix`

## Documentation

- Update relevant documentation when making changes
- Keep comments clear and concise
- Document public APIs and complex logic

## Questions?

If you have questions about contributing, feel free to:
- Open a discussion in the repository
- Contact the engineering team at [engineering@rauchtech.example](mailto:engineering@rauchtech.example)

Thank you for contributing to Rauch Tech! 🎉

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
To update the snapshots run:
```bash
TAP_SNAPSHOT=1 node . run test
```

## What _not_ to contribute?

### Dependencies

It should be noted that our team does not accept third-party dependency updates/PRs. We have a [release process](https://github.com/npm/cli/wiki/Release-Process) that includes checks to ensure dependencies are staying up-to-date & will ship security patches for CVEs as they occur. If you submit a PR trying to update our dependencies we will close it with or without a reference to these contribution guidelines.

### Tools/Automation

Our core team is responsible for the maintenance of the tooling/automation in this project & we ask collaborators to kindly not make changes to these when contributing (ex. `.github/*`, `.eslintrc.json`, `.licensee.json` etc.)
