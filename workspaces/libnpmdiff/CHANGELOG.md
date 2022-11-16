# Changelog

## [5.0.4](https://github.com/npm/cli/compare/libnpmdiff-v5.0.3...libnpmdiff-v5.0.4) (2022-11-16)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.2...arborist-v6.1.3): `@npmcli/arborist@6.1.3`

## [5.0.3](https://github.com/npm/cli/compare/libnpmdiff-v5.0.2...libnpmdiff-v5.0.3) (2022-11-09)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.1...arborist-v6.1.2): `@npmcli/arborist@6.1.2`

## [5.0.2](https://github.com/npm/cli/compare/libnpmdiff-v5.0.1...libnpmdiff-v5.0.2) (2022-11-02)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.0...arborist-v6.1.1): `@npmcli/arborist@6.1.1`

## [5.0.1](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0...libnpmdiff-v5.0.1) (2022-10-26)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0...arborist-v6.1.0): `@npmcli/arborist@6.1.0`

## [5.0.0](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.3...libnpmdiff-v5.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.5...arborist-v6.0.0): `@npmcli/arborist@6.0.0`

## [5.0.0-pre.3](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.2...libnpmdiff-v5.0.0-pre.3) (2022-10-19)

### Dependencies

* [`2008ea6`](https://github.com/npm/cli/commit/2008ea6a807acbd97912799adfe97f276202cea6) `npm-package-arg@10.0.0`, `pacote@15.0.2`
* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.4...arborist-v6.0.0-pre.5): `@npmcli/arborist@6.0.0-pre.5`

## [5.0.0-pre.2](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.1...libnpmdiff-v5.0.0-pre.2) (2022-10-05)

### Dependencies

* [`5344d2c`](https://github.com/npm/cli/commit/5344d2ca9ffd1f6db473fd58b46b50179f899ff5) [#5644](https://github.com/npm/cli/pull/5644) `pacote@14.0.0`
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.3...arborist-v6.0.0-pre.4): `@npmcli/arborist@6.0.0-pre.4`

## [5.0.0-pre.1](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.0...libnpmdiff-v5.0.0-pre.1) (2022-09-30)

### ⚠️ BREAKING CHANGES

* `npm pack` now follows a strict order of operations when applying ignore rules. If a files array is present in the package.json, then rules in .gitignore and .npmignore files from the root will be ignored.

### Features

* [`3ae796d`](https://github.com/npm/cli/commit/3ae796d937bd36a5b1b9fd6e9e8473b4f2ddc32d) implement new `npm-packlist` behavior (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.2...arborist-v6.0.0-pre.3): `@npmcli/arborist@6.0.0-pre.3`

## [5.0.0-pre.0](https://github.com/npm/cli/compare/libnpmdiff-v4.0.5...libnpmdiff-v5.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)

## [4.0.5](https://github.com/npm/cli/compare/libnpmdiff-v4.0.4...libnpmdiff-v4.0.5) (2022-08-31)

### Dependencies

  * [`1286f03`](https://github.com/npm/cli/commit/1286f03fe73dee9a447b13b662f0c5622ab6ec9e) [#5381](https://github.com/npm/cli/pull/5381) deps: `unique-filename@2.0.1`
  * [`f4205e5`](https://github.com/npm/cli/commit/f4205e57d6c4ee5f2ff7d21ffc116ffc420d191e) [#5381](https://github.com/npm/cli/pull/5381) deps: `diff@5.1.0`
  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`

## [4.0.4](https://github.com/npm/cli/compare/libnpmdiff-v4.0.3...libnpmdiff-v4.0.4) (2022-06-22)


### Dependencies

* pacote@13.6.1 ([2e50cb8](https://github.com/npm/cli/commit/2e50cb83e84cf25fee93ba0ca5a0343fbdb33c41))

### [4.0.3](https://github.com/npm/cli/compare/libnpmdiff-v4.0.2...libnpmdiff-v4.0.3) (2022-04-06)


### Bug Fixes

* replace deprecated String.prototype.substr() ([#4667](https://github.com/npm/cli/issues/4667)) ([e3da5df](https://github.com/npm/cli/commit/e3da5df4152fbe547f7871547165328e1bf06262))
* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/disparity-colors@2.0.0 ([f86f1af](https://github.com/npm/cli/commit/f86f1af636f39d7d30a97873bbb6652416f68013))
* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))
* minimatch@5.0.1 ([1b30c72](https://github.com/npm/cli/commit/1b30c725ecd0f03f55e3c0576962972748eec238))

### [4.0.2](https://www.github.com/npm/cli/compare/libnpmdiff-v4.0.1...libnpmdiff-v4.0.2) (2022-03-15)


### Dependencies

* npm-package-arg@9.0.1 ([9555a5f](https://www.github.com/npm/cli/commit/9555a5f1d135aa1b8f7374273403efe41e99ee26))
* pacote@13.0.4 ([6d31450](https://www.github.com/npm/cli/commit/6d3145014861b4198c16d7772d809fd037ece289))
* pacote@13.0.5 ([340fa51](https://www.github.com/npm/cli/commit/340fa51f423a518a96c8015a67d8f6144a2e8051))

### [4.0.1](https://www.github.com/npm/cli/compare/libnpmdiff-vlibnpmdiff@4.0.0...libnpmdiff-v4.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## 2.0.3

- fix name of options sent by the npm cli

## 2.0.2

- fix matching basename file filter

## 2.0.1

- fix for tarballs not listing folder names

## 2.0.0

- API rewrite:
  - normalized all options
  - specs to compare are now an array
- fix context=0
- added support to filtering by folder names

## 1.0.1

- fixed nameOnly option

## 1.0.0

- Initial release
