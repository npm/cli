# Changelog

## [8.0.0](https://github.com/npm/cli/compare/libnpmversion-v8.0.0-pre.0...libnpmversion-v8.0.0) (2024-12-16)
### Features
* [`a7bfc6d`](https://github.com/npm/cli/commit/a7bfc6df76882996ebb834dbca785fdf33b8c50d) [#7972](https://github.com/npm/cli/pull/7972) trigger release process (#7972) (@wraithgar)
### Chores
* [`a07f4e0`](https://github.com/npm/cli/commit/a07f4e0d921f640be6aa87736debd550ec478f89) [#7976](https://github.com/npm/cli/pull/7976) `@npmcli/template-oss@4.23.6` (@wraithgar)

## [8.0.0-pre.0](https://github.com/npm/cli/compare/libnpmversion-v7.0.0...libnpmversion-v8.0.0-pre.0) (2024-11-26)
### ⚠️ BREAKING CHANGES
* libnpmversion now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`57eef8d`](https://github.com/npm/cli/commit/57eef8df822885ebc57096a591191bdbb3f0c95b) [#7831](https://github.com/npm/cli/pull/7831) for libnpmversion sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
### Chores
* [`6edfe2f`](https://github.com/npm/cli/commit/6edfe2f3a45169b6d194ccd8d366bb8d0e09b4a5) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/template-oss@4.23.5` (@wraithgar)

## [7.0.0](https://github.com/npm/cli/compare/libnpmversion-v6.0.3...libnpmversion-v7.0.0) (2024-10-03)
### ⚠️ BREAKING CHANGES
* `libnpmversion` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`d3c0b1e`](https://github.com/npm/cli/commit/d3c0b1efca1431ee3dae24fdec96f7251b347614) [#7803](https://github.com/npm/cli/pull/7803) align libnpmversion to npm 10 node engine range (@reggi)
### Dependencies
* [`b84d907`](https://github.com/npm/cli/commit/b84d9079feaf9582763356e538c7247383b00e9f) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/git@6.0.1`
* [`f6909a0`](https://github.com/npm/cli/commit/f6909a022c9373c85d980c96a30f47a3a65aa4a9) [#7803](https://github.com/npm/cli/pull/7803) update `proc-log@5.0.0`
* [`7214149`](https://github.com/npm/cli/commit/72141496fbc7e5f0e0824d584b82690eeee45bb5) [#7803](https://github.com/npm/cli/pull/7803) update `json-parse-even-better-errors@4.0.0`
* [`538a4cc`](https://github.com/npm/cli/commit/538a4cc1dd731a3643ab4477fe545db39997bcdf) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/run-script@9.0.1`
### Chores
* [`2072705`](https://github.com/npm/cli/commit/2072705aa80d009dc077639adc305692f4a6c0b9) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/eslint-config@5.0.1` (@reggi)
* [`8035725`](https://github.com/npm/cli/commit/80357253ecd8483463cd66c783c4464c330d72df) [#7756](https://github.com/npm/cli/pull/7756) `@npmcli/template-oss@4.23.3` (@wraithgar)

## [6.0.3](https://github.com/npm/cli/compare/libnpmversion-v6.0.2...libnpmversion-v6.0.3) (2024-05-29)

### Bug Fixes

* [`2d1d8d0`](https://github.com/npm/cli/commit/2d1d8d0ef18a10ac7938380884745f1d3c3cb078) [#7559](https://github.com/npm/cli/pull/7559) adds `node:` specifier to all native node modules (#7559) (@reggi)

## [6.0.2](https://github.com/npm/cli/compare/libnpmversion-v6.0.1...libnpmversion-v6.0.2) (2024-05-15)

### Dependencies

* [`18c3b40`](https://github.com/npm/cli/commit/18c3b4058c7f721ff585de2f2766e53da897e16e) [#7480](https://github.com/npm/cli/pull/7480) `json-parse-even-better-errors@3.0.2`
* [`6dfaebb`](https://github.com/npm/cli/commit/6dfaebb8f08acf992ac36faf4db8b650e8e55eae) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/git@5.0.7`

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

## [6.0.1](https://github.com/npm/cli/compare/libnpmversion-v6.0.0...libnpmversion-v6.0.1) (2024-04-30)

### Bug Fixes

* [`3ec86a0`](https://github.com/npm/cli/commit/3ec86a0e258b1d5f5182f0093adf43c54e82578e) [#7456](https://github.com/npm/cli/pull/7456) linting: no-unused-vars (#7456) (@wraithgar)
* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

### Dependencies

* [`9da5738`](https://github.com/npm/cli/commit/9da57388ebd5c643c2a95bbf63abc745cad45ccc) [#7437](https://github.com/npm/cli/pull/7437) `@npmcli/run-script@8.1.0` (#7437)

## [6.0.0](https://github.com/npm/cli/compare/libnpmversion-v5.0.2...libnpmversion-v6.0.0) (2024-04-25)

### ⚠️ BREAKING CHANGES

* libnpmversion no longer takes a `silent` option to suppress output from `@npmcli/run-script`. That output is now emitted via an `output` event on `process`.

### Features

* [`60faa90`](https://github.com/npm/cli/commit/60faa9052a74d7a6ac8db59dae2d7017542310d7) [#7373](https://github.com/npm/cli/pull/7373) libnpmversion: remove silent option (@lukekarrys)

### Bug Fixes

* [`78447d7`](https://github.com/npm/cli/commit/78447d7a35fab870456ba66eee408b2baddca23e) [#7399](https://github.com/npm/cli/pull/7399) prefer fs/promises over promisify (#7399) (@lukekarrys)

### Dependencies

* [`fc6e291`](https://github.com/npm/cli/commit/fc6e291e9c2154c2e76636cb7ebf0a17be307585) [#7392](https://github.com/npm/cli/pull/7392) `proc-log@4.2.0` (#7392)
* [`7678a3d`](https://github.com/npm/cli/commit/7678a3d92835457bb402c82e4ca7ea3fa734d23b) [#7378](https://github.com/npm/cli/pull/7378) `proc-log@4.1.0`
* [`b8f8b41`](https://github.com/npm/cli/commit/b8f8b414d8ad9635e3efedc6e491c8c6e3df0973) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/run-script@8.0.0`
* [`79f79c7`](https://github.com/npm/cli/commit/79f79c7460be8a74f2b77c647100bcefd89b2efa) [#7373](https://github.com/npm/cli/pull/7373) `proc-log@4.0.0`
* [`d3a0cfa`](https://github.com/npm/cli/commit/d3a0cfad06ddffe6a3d4968257b7993aea68fc7c) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/git@5.0.6`

## [5.0.2](https://github.com/npm/cli/compare/libnpmversion-v5.0.1...libnpmversion-v5.0.2) (2023-12-06)

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)

## [5.0.1](https://github.com/npm/cli/compare/libnpmversion-v5.0.0...libnpmversion-v5.0.1) (2023-10-31)

### Dependencies

* [`dfb6298`](https://github.com/npm/cli/commit/dfb6298c3eb9fb7ef452906765ac5f23ea6fec49) [#6937](https://github.com/npm/cli/pull/6937) `node-gyp@10.0.0` (#6937)

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
