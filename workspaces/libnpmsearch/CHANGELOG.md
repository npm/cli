# Changelog

## [7.0.0](https://github.com/npm/cli/compare/libnpmsearch-v7.0.0-pre.0...libnpmsearch-v7.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

## [7.0.0-pre.0](https://github.com/npm/cli/compare/libnpmsearch-v6.0.2...libnpmsearch-v7.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`5c8c6cc`](https://github.com/npm/cli/commit/5c8c6ccc0be6e544f6884ecc1189de02450b7dfc) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)

### Dependencies

* [`2ee0fb3`](https://github.com/npm/cli/commit/2ee0fb3ac0c5e49f9eba545d6b05e20be1352414) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@16.0.0`
* [`5d0d859`](https://github.com/npm/cli/commit/5d0d8592cbf3b816d9fe44c36d390200ec15e87a) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@15.0.0`

## [6.0.2](https://github.com/npm/cli/compare/libnpmsearch-v6.0.1...libnpmsearch-v6.0.2) (2023-02-01)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`

## [6.0.1](https://github.com/npm/cli/compare/libnpmsearch-v6.0.0...libnpmsearch-v6.0.1) (2022-12-07)

### Dependencies

* [`0a3fe00`](https://github.com/npm/cli/commit/0a3fe000e2723ae6fdb8b1d3154fd3835057c992) [#5933](https://github.com/npm/cli/pull/5933) `minipass@4.0.0`
* [`fee9b66`](https://github.com/npm/cli/commit/fee9b6686892a1c7f976c36ddd5d89b70c416817) `npm-registry-fetch@14.0.3`

## [6.0.0](https://github.com/npm/cli/compare/libnpmsearch-v6.0.0-pre.1...libnpmsearch-v6.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

## [6.0.0-pre.1](https://github.com/npm/cli/compare/libnpmsearch-v6.0.0-pre.0...libnpmsearch-v6.0.0-pre.1) (2022-10-19)

### Dependencies

* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies

## [6.0.0-pre.0](https://github.com/npm/cli/compare/libnpmsearch-v5.0.4...libnpmsearch-v6.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)

## [5.0.4](https://github.com/npm/cli/compare/libnpmsearch-v5.0.3...libnpmsearch-v5.0.4) (2022-08-31)

### Dependencies

  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`

### [5.0.3](https://github.com/npm/cli/compare/libnpmsearch-v5.0.2...libnpmsearch-v5.0.3) (2022-04-06)


### Bug Fixes

* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [5.0.2](https://www.github.com/npm/cli/compare/libnpmsearch-v5.0.1...libnpmsearch-v5.0.2) (2022-03-10)


### Documentation

* standardize changelog heading ([#4510](https://www.github.com/npm/cli/issues/4510)) ([91f03ee](https://www.github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))

## [3.0.0](https://github.com/npm/libnpmhook/compare/v2.0.2...v3.0.0) (2020-02-26)

### Breaking Changes

* [`45f4db1`](https://github.com/npm/libnpmsearch/commit/45f4db1) fix: remove figgy-pudding ([@claudiahdz](https://github.com/claudiahdz))

### Miscellaneuous

* [`b413aae`](https://github.com/npm/libnpmsearch/commit/b413aae) chore: basic project updates ([@claudiahdz](https://github.com/claudiahdz))
* [`534983c`](https://github.com/npm/libnpmsearch/commit/534983c) chore: remove pr temmsearch ([@ruyadorno](https://github.com/ruyadorno))
* [`c503a89`](https://github.com/npm/libnpmsearch/commit/c503a89) chore: cleanup badges + contributing ([@ruyadorno](https://github.com/ruyadorno))

---

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.0.2"></a>
### [5.0.1](https://www.github.com/npm/cli/compare/libnpmsearch-vlibnpmsearch@5.0.0...libnpmsearch-v5.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## [2.0.2](https://github.com/npm/libnpmsearch/compare/v2.0.1...v2.0.2) (2019-07-16)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/npm/libnpmsearch/compare/v2.0.0...v2.0.1) (2019-06-10)


### Bug Fixes

* **opts:** support `opts.from` properly ([#2](https://github.com/npm/libnpmsearch/issues/2)) ([da6636c](https://github.com/npm/libnpmsearch/commit/da6636c))
* **standard:** standard --fix ([beca19c](https://github.com/npm/libnpmsearch/commit/beca19c))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/npm/libnpmsearch/compare/v1.0.0...v2.0.0) (2018-08-28)


### Features

* **opts:** added options for pagination, details, and sorting weights ([ff97eb5](https://github.com/npm/libnpmsearch/commit/ff97eb5))


### BREAKING CHANGES

* **opts:** this changes default requests and makes libnpmsearch return more complete data for individual packages, without null-defaulting



<a name="1.0.0"></a>
# 1.0.0 (2018-08-27)


### Features

* **api:** got API working ([fe90008](https://github.com/npm/libnpmsearch/commit/fe90008))
