# Changelog

## [11.0.0](https://github.com/npm/cli/compare/libnpmhook-v10.0.5...libnpmhook-v11.0.0) (2024-10-03)
### ⚠️ BREAKING CHANGES
* `libnpmhook` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`0e69c92`](https://github.com/npm/cli/commit/0e69c928ba5bef5fbc101f15e498d4a1182a8b59) [#7803](https://github.com/npm/cli/pull/7803) align libnpmhook to npm 10 node engine range (@reggi)
### Dependencies
* [`d13a20b`](https://github.com/npm/cli/commit/d13a20bebef1b9932f86c44741ea6d214ad6842b) [#7803](https://github.com/npm/cli/pull/7803) update `npm-registry-fetch@18.0.1`
### Chores
* [`2072705`](https://github.com/npm/cli/commit/2072705aa80d009dc077639adc305692f4a6c0b9) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/eslint-config@5.0.1` (@reggi)
* [`8035725`](https://github.com/npm/cli/commit/80357253ecd8483463cd66c783c4464c330d72df) [#7756](https://github.com/npm/cli/pull/7756) `@npmcli/template-oss@4.23.3` (@wraithgar)

## [10.0.5](https://github.com/npm/cli/compare/libnpmhook-v10.0.4...libnpmhook-v10.0.5) (2024-05-15)

### Dependencies

* [`63ef498`](https://github.com/npm/cli/commit/63ef498bf2916a882a92c0b9fe6de6728584694a) [#7457](https://github.com/npm/cli/pull/7457) `npm-registry-fetch@17.0.1`

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

## [10.0.4](https://github.com/npm/cli/compare/libnpmhook-v10.0.3...libnpmhook-v10.0.4) (2024-04-30)

### Bug Fixes

* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

### Dependencies

* [`a7145d4`](https://github.com/npm/cli/commit/a7145d422485fcbcb9427efa775c15180c7ee1c2) [#7453](https://github.com/npm/cli/pull/7453) `npm-registry-fetch@17.0.0`

## [10.0.3](https://github.com/npm/cli/compare/libnpmhook-v10.0.2...libnpmhook-v10.0.3) (2024-04-25)

### Dependencies

* [`ee4b3e0`](https://github.com/npm/cli/commit/ee4b3e0e741545045dc03741c7147560961d867d) [#7373](https://github.com/npm/cli/pull/7373) `npm-registry-fetch@16.2.1`

## [10.0.2](https://github.com/npm/cli/compare/libnpmhook-v10.0.1...libnpmhook-v10.0.2) (2024-04-03)

### Dependencies

* [`87a61fc`](https://github.com/npm/cli/commit/87a61fc8bb65c950cda389ab3d14ae250ab2345d) [#7334](https://github.com/npm/cli/pull/7334) `npm-registry-fetch@16.2.0`

## [10.0.1](https://github.com/npm/cli/compare/libnpmhook-v10.0.0...libnpmhook-v10.0.1) (2023-12-06)

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)
* [`0270a7d`](https://github.com/npm/cli/commit/0270a7d42984210fd388f3d9a70aaa01887d29f6) [#6807](https://github.com/npm/cli/pull/6807) set workspace engines (@lukekarrys)
* [`fec08ad`](https://github.com/npm/cli/commit/fec08ade0fed990b838b781867adf03253907e91) [#6807](https://github.com/npm/cli/pull/6807) `@npmcli/template-oss@4.19.0` (@lukekarrys)

## [10.0.0](https://github.com/npm/cli/compare/libnpmhook-v10.0.0-pre.0...libnpmhook-v10.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

## [10.0.0-pre.0](https://github.com/npm/cli/compare/libnpmhook-v9.0.3...libnpmhook-v10.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`4caedd0`](https://github.com/npm/cli/commit/4caedd0e49641e9f1757f5622e5845b5b49c56c1) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)

### Dependencies

* [`2ee0fb3`](https://github.com/npm/cli/commit/2ee0fb3ac0c5e49f9eba545d6b05e20be1352414) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@16.0.0`
* [`5d0d859`](https://github.com/npm/cli/commit/5d0d8592cbf3b816d9fe44c36d390200ec15e87a) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@15.0.0`

## [9.0.3](https://github.com/npm/cli/compare/libnpmhook-v9.0.2...libnpmhook-v9.0.3) (2023-02-07)

### Bug Fixes

* [`12ec7ee`](https://github.com/npm/cli/commit/12ec7ee1983876565445ae7967e2f14f3d95e356) remove unused package.json scripts (@lukekarrys)

## [9.0.2](https://github.com/npm/cli/compare/libnpmhook-v9.0.1...libnpmhook-v9.0.2) (2023-02-01)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`

## [9.0.1](https://github.com/npm/cli/compare/libnpmhook-v9.0.0...libnpmhook-v9.0.1) (2022-12-07)

### Dependencies

* [`0a3fe00`](https://github.com/npm/cli/commit/0a3fe000e2723ae6fdb8b1d3154fd3835057c992) [#5933](https://github.com/npm/cli/pull/5933) `minipass@4.0.0`
* [`fee9b66`](https://github.com/npm/cli/commit/fee9b6686892a1c7f976c36ddd5d89b70c416817) `npm-registry-fetch@14.0.3`

## [9.0.0](https://github.com/npm/cli/compare/libnpmhook-v9.0.0-pre.1...libnpmhook-v9.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

## [9.0.0-pre.1](https://github.com/npm/cli/compare/libnpmhook-v9.0.0-pre.0...libnpmhook-v9.0.0-pre.1) (2022-10-19)

### Dependencies

* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies

## [9.0.0-pre.0](https://github.com/npm/cli/compare/libnpmhook-v8.0.4...libnpmhook-v9.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)

## [8.0.4](https://github.com/npm/cli/compare/libnpmhook-v8.0.3...libnpmhook-v8.0.4) (2022-08-31)

### Dependencies

  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`

### [8.0.3](https://github.com/npm/cli/compare/libnpmhook-v8.0.2...libnpmhook-v8.0.3) (2022-04-06)


### Bug Fixes

* replace deprecated String.prototype.substr() ([#4667](https://github.com/npm/cli/issues/4667)) ([e3da5df](https://github.com/npm/cli/commit/e3da5df4152fbe547f7871547165328e1bf06262))
* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [8.0.2](https://www.github.com/npm/cli/compare/libnpmhook-v8.0.1...libnpmhook-v8.0.2) (2022-03-10)


### Documentation

* standardize changelog heading ([#4510](https://www.github.com/npm/cli/issues/4510)) ([91f03ee](https://www.github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))

## [6.0.0](https://github.com/npm/libnpmhook/compare/v5.0.2...v6.0.0) (2020-02-26)

### Breaking Changes

* [`aa629b4`](https://github.com/npm/libnpmhook/commit/aa629b4) fix: remove figgy-pudding ([@claudiahdz](https://github.com/claudiahdz))

### Miscellaneuous

* [`ea795fb`](https://github.com/npm/libnpmhook/commit/ea795fb) chore: basic project updates ([@claudiahdz](https://github.com/claudiahdz))
* [`a0fdf7e`](https://github.com/npm/libnpmhook/commit/a0fdf7e) chore: cleanup badges, contrib, readme ([@ruyadorno](https://github.com/ruyadorno))

---

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="5.0.2"></a>
### [8.0.1](https://www.github.com/npm/cli/compare/libnpmhook-vlibnpmhook@8.0.0...libnpmhook-v8.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## [5.0.2](https://github.com/npm/libnpmhook/compare/v5.0.1...v5.0.2) (2018-08-24)



<a name="5.0.1"></a>
## [5.0.1](https://github.com/npm/libnpmhook/compare/v5.0.0...v5.0.1) (2018-08-23)


### Bug Fixes

* **deps:** move JSONStream to prod deps ([bb63594](https://github.com/npm/libnpmhook/commit/bb63594))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/npm/libnpmhook/compare/v4.0.1...v5.0.0) (2018-08-21)


### Features

* **api:** overhauled API ([46b271b](https://github.com/npm/libnpmhook/commit/46b271b))


### BREAKING CHANGES

* **api:** the API for ls() has changed, and rm() no longer errors on 404



<a name="4.0.1"></a>
## [4.0.1](https://github.com/npm/libnpmhook/compare/v4.0.0...v4.0.1) (2018-04-09)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/npm/libnpmhook/compare/v3.0.1...v4.0.0) (2018-04-08)


### meta

* drop support for node 4 and 7 ([f2a301e](https://github.com/npm/libnpmhook/commit/f2a301e))


### BREAKING CHANGES

* node@4 and node@7 are no longer supported



<a name="3.0.1"></a>
## [3.0.1](https://github.com/npm/libnpmhook/compare/v3.0.0...v3.0.1) (2018-04-08)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/npm/libnpmhook/compare/v2.0.1...v3.0.0) (2018-04-04)


### add

* guess type based on name ([9418224](https://github.com/npm/libnpmhook/commit/9418224))


### BREAKING CHANGES

* hook type is now based on name prefix



<a name="2.0.1"></a>
## [2.0.1](https://github.com/npm/libnpmhook/compare/v2.0.0...v2.0.1) (2018-03-16)


### Bug Fixes

* **urls:** was hitting the wrong URL endpoints ([10171a9](https://github.com/npm/libnpmhook/commit/10171a9))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/npm/libnpmhook/compare/v1.0.0...v2.0.0) (2018-03-16)



<a name="1.0.0"></a>
# 1.0.0 (2018-03-16)


### Features

* **api:** baseline working api ([122658e](https://github.com/npm/npm-hooks/commit/122658e))
