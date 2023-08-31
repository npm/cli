# Changelog

## [5.0.0](https://github.com/npm/cli/compare/libnpmversion-v5.0.0-pre.0...libnpmversion-v5.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

## [5.0.0-pre.0](https://github.com/npm/cli/compare/libnpmversion-v4.0.2...libnpmversion-v5.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)

### Dependencies

* [`5ab3f7e`](https://github.com/npm/cli/commit/5ab3f7e944b12481cb1164175c7a79d24d5e3ac5) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.3`
* [`eb41977`](https://github.com/npm/cli/commit/eb41977c56cbac88fa7d02f88dbf630cc652471a) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.1`
* [`f30c9e3`](https://github.com/npm/cli/commit/f30c9e30c2a6d777ea31157a90fddadc81fd11d0) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.2`
* [`bb63bf9`](https://github.com/npm/cli/commit/bb63bf945b2db8f3074e7429aff6343721c55cd1) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.0`
* [`f1dd130`](https://github.com/npm/cli/commit/f1dd1305fdcba0b7f5496223b5a65f0fe7e29975) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.1`
* [`c9587d7`](https://github.com/npm/cli/commit/c9587d79c7c02aff4f53b093bf6702026ecea53a) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.0`

## [4.0.2](https://github.com/npm/cli/compare/libnpmversion-v4.0.1...libnpmversion-v4.0.2) (2023-02-01)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`

## [4.0.1](https://github.com/npm/cli/compare/libnpmversion-v4.0.0...libnpmversion-v4.0.1) (2022-11-02)

### Bug Fixes

* [`1f5382d`](https://github.com/npm/cli/commit/1f5382dada181cda41f1504974de1e69a6c1ad7f) [#5789](https://github.com/npm/cli/pull/5789) don't set `stdioString` for any spawn/run-script calls (@lukekarrys)

### Dependencies

* [`abfb28b`](https://github.com/npm/cli/commit/abfb28b249183b8c033f8e7acc1546150cdac137) `@npmcli/run-script@6.0.0`

## [4.0.0](https://github.com/npm/cli/compare/libnpmversion-v4.0.0-pre.1...libnpmversion-v4.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

## [4.0.0-pre.1](https://github.com/npm/cli/compare/libnpmversion-v4.0.0-pre.0...libnpmversion-v4.0.0-pre.1) (2022-10-19)

### Dependencies

* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies

## [4.0.0-pre.0](https://github.com/npm/cli/compare/libnpmversion-v3.0.7...libnpmversion-v4.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)

## [3.0.7](https://github.com/npm/cli/compare/libnpmversion-v3.0.6...libnpmversion-v3.0.7) (2022-08-31)

### Bug Fixes

  * [`bd2ae5d`](https://github.com/npm/cli/commit/bd2ae5d79eb8807bfca6075e98432c545a9ededa) [#5323](https://github.com/npm/cli/pull/5323) fix: linting (@wraithgar)

### Dependencies

  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`

## [3.0.6](https://github.com/npm/cli/compare/libnpmversion-v3.0.5...libnpmversion-v3.0.6) (2022-06-23)


### Dependencies

* @npmcli/run-script@4.1.3 ([#5064](https://github.com/npm/cli/issues/5064)) ([f59a114](https://github.com/npm/cli/commit/f59a114ffe3d1f86ccb2e52a4432292ab76852cc))

## [3.0.5](https://github.com/npm/cli/compare/libnpmversion-v3.0.4...libnpmversion-v3.0.5) (2022-06-22)


### Dependencies

* @npmcli/run-script@4.1.0 ([2c06cee](https://github.com/npm/cli/commit/2c06ceee82dd813c0ae84cc0b09e6941cfc5533e))

### [3.0.4](https://github.com/npm/cli/compare/libnpmversion-v3.0.3...libnpmversion-v3.0.4) (2022-04-26)


### Dependencies

* semver@7.3.7 ([c51e553](https://github.com/npm/cli/commit/c51e553a32315e4f1b703ca9030eb7ade91d1a85))

### [3.0.3](https://github.com/npm/cli/compare/libnpmversion-v3.0.2...libnpmversion-v3.0.3) (2022-04-12)


### Dependencies

* remove stringify-package ([#4714](https://github.com/npm/cli/issues/4714)) ([e33aa0f](https://github.com/npm/cli/commit/e33aa0f94f87ae4f9d2a73781e84832ef61d1855))

### [3.0.2](https://github.com/npm/cli/compare/libnpmversion-v3.0.1...libnpmversion-v3.0.2) (2022-04-06)


### Bug Fixes

* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [3.0.1](https://www.github.com/npm/cli/compare/libnpmversion-vlibnpmversion@3.0.0...libnpmversion-v3.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))
