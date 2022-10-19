# Changelog

## [5.0.0-pre.1](https://github.com/npm/cli/compare/libnpmteam-v5.0.0-pre.0...libnpmteam-v5.0.0-pre.1) (2022-10-19)

### Dependencies

* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies

## [5.0.0-pre.0](https://github.com/npm/cli/compare/libnpmteam-v4.0.4...libnpmteam-v5.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)

## [4.0.4](https://github.com/npm/cli/compare/libnpmteam-v4.0.3...libnpmteam-v4.0.4) (2022-08-31)

### Dependencies

  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`

### [4.0.3](https://github.com/npm/cli/compare/libnpmteam-v4.0.2...libnpmteam-v4.0.3) (2022-04-06)


### Bug Fixes

* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [4.0.2](https://www.github.com/npm/cli/compare/libnpmteam-v4.0.1...libnpmteam-v4.0.2) (2022-03-10)


### Documentation

* standardize changelog heading ([#4510](https://www.github.com/npm/cli/issues/4510)) ([91f03ee](https://www.github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))

### [4.0.1](https://www.github.com/npm/cli/compare/libnpmteam-vlibnpmteam@4.0.0...libnpmteam-v4.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## [2.0.0](https://github.com/npm/libnpmteam/compare/v1.0.2...v2.0.0) (2020-03-02)

### BREAKING CHANGE
- Removed `figgy-pudding` as a dependecy
- Using native promises
- Require node >= v10

### Feature
- Updated stream interface to `minipass` type stream

---

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.2"></a>
## [1.0.2](https://github.com/npm/libnpmteam/compare/v1.0.1...v1.0.2) (2019-07-16)


### Bug Fixes

* **standard:** standard --fix ([3dc9144](https://github.com/npm/libnpmteam/commit/3dc9144))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/npm/libnpmteam/compare/v1.0.0...v1.0.1) (2018-08-24)



<a name="1.0.0"></a>
# 1.0.0 (2018-08-22)


### Features

* **api:** implement team api ([50dd0e1](https://github.com/npm/libnpmteam/commit/50dd0e1))
* **docs:** add fully-documented readme ([b1370f3](https://github.com/npm/libnpmteam/commit/b1370f3))
* **test:** test --100 ftw ([9d3bdc3](https://github.com/npm/libnpmteam/commit/9d3bdc3))
