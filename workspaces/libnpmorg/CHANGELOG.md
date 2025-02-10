# Changelog

## [8.0.0](https://github.com/npm/cli/compare/libnpmorg-v8.0.0-pre.1...libnpmorg-v8.0.0) (2024-12-16)
### Features
* [`a7bfc6d`](https://github.com/npm/cli/commit/a7bfc6df76882996ebb834dbca785fdf33b8c50d) [#7972](https://github.com/npm/cli/pull/7972) trigger release process (#7972) (@wraithgar)
### Chores
* [`a07f4e0`](https://github.com/npm/cli/commit/a07f4e0d921f640be6aa87736debd550ec478f89) [#7976](https://github.com/npm/cli/pull/7976) `@npmcli/template-oss@4.23.6` (@wraithgar)

## [8.0.0-pre.1](https://github.com/npm/cli/compare/libnpmorg-v8.0.0-pre.0...libnpmorg-v8.0.0-pre.1) (2024-12-06)
### ⚠️ BREAKING CHANGES
* Upon publishing, in order to apply a default "latest" dist tag, the command now retrieves all prior versions of the package. It will require that the version you're trying to publish is above the latest semver version in the registry, not including pre-release tags.
### Features
* [`f3ac7b7`](https://github.com/npm/cli/commit/f3ac7b7460e1d9e1f9d3d8056317e36bb9813d5d) [#7939](https://github.com/npm/cli/pull/7939) no implicit latest tag on publish when latest > version (#7939) (@reggi, @ljharb)

## [8.0.0-pre.0](https://github.com/npm/cli/compare/libnpmorg-v7.0.0...libnpmorg-v8.0.0-pre.0) (2024-11-26)
### ⚠️ BREAKING CHANGES
* libnpmorg now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`62c4604`](https://github.com/npm/cli/commit/62c4604c9c1fcdb511f922d40edb1aecb6f9943d) [#7831](https://github.com/npm/cli/pull/7831) for libnpmorg sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
### Chores
* [`6edfe2f`](https://github.com/npm/cli/commit/6edfe2f3a45169b6d194ccd8d366bb8d0e09b4a5) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/template-oss@4.23.5` (@wraithgar)

## [7.0.0](https://github.com/npm/cli/compare/libnpmorg-v6.0.6...libnpmorg-v7.0.0) (2024-10-03)
### ⚠️ BREAKING CHANGES
* `libnpmorg` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`47f6f76`](https://github.com/npm/cli/commit/47f6f764235fd9a268afc504b03038b22e97537d) [#7803](https://github.com/npm/cli/pull/7803) align libnpmorg to npm 10 node engine range (@reggi)
### Dependencies
* [`d13a20b`](https://github.com/npm/cli/commit/d13a20bebef1b9932f86c44741ea6d214ad6842b) [#7803](https://github.com/npm/cli/pull/7803) update `npm-registry-fetch@18.0.1`
### Chores
* [`2072705`](https://github.com/npm/cli/commit/2072705aa80d009dc077639adc305692f4a6c0b9) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/eslint-config@5.0.1` (@reggi)
* [`8035725`](https://github.com/npm/cli/commit/80357253ecd8483463cd66c783c4464c330d72df) [#7756](https://github.com/npm/cli/pull/7756) `@npmcli/template-oss@4.23.3` (@wraithgar)

## [6.0.6](https://github.com/npm/cli/compare/libnpmorg-v6.0.5...libnpmorg-v6.0.6) (2024-05-15)

### Dependencies

* [`c2b28f9`](https://github.com/npm/cli/commit/c2b28f9d6cba12e88f849e5b4a82607e2c218a16) [#7498](https://github.com/npm/cli/pull/7498) `minipass@7.1.1`
* [`dade2c8`](https://github.com/npm/cli/commit/dade2c88d23289d57351d614feaa876d9e1e17f4) [#7480](https://github.com/npm/cli/pull/7480) `minipass@7.1.0`
* [`63ef498`](https://github.com/npm/cli/commit/63ef498bf2916a882a92c0b9fe6de6728584694a) [#7457](https://github.com/npm/cli/pull/7457) `npm-registry-fetch@17.0.1`

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

## [6.0.5](https://github.com/npm/cli/compare/libnpmorg-v6.0.4...libnpmorg-v6.0.5) (2024-04-30)

### Bug Fixes

* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

### Dependencies

* [`a7145d4`](https://github.com/npm/cli/commit/a7145d422485fcbcb9427efa775c15180c7ee1c2) [#7453](https://github.com/npm/cli/pull/7453) `npm-registry-fetch@17.0.0`

## [6.0.4](https://github.com/npm/cli/compare/libnpmorg-v6.0.3...libnpmorg-v6.0.4) (2024-04-25)

### Dependencies

* [`ee4b3e0`](https://github.com/npm/cli/commit/ee4b3e0e741545045dc03741c7147560961d867d) [#7373](https://github.com/npm/cli/pull/7373) `npm-registry-fetch@16.2.1`

## [6.0.3](https://github.com/npm/cli/compare/libnpmorg-v6.0.2...libnpmorg-v6.0.3) (2024-04-03)

### Dependencies

* [`87a61fc`](https://github.com/npm/cli/commit/87a61fc8bb65c950cda389ab3d14ae250ab2345d) [#7334](https://github.com/npm/cli/pull/7334) `npm-registry-fetch@16.2.0`

## [6.0.2](https://github.com/npm/cli/compare/libnpmorg-v6.0.1...libnpmorg-v6.0.2) (2023-12-06)

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)

## [6.0.1](https://github.com/npm/cli/compare/libnpmorg-v6.0.0...libnpmorg-v6.0.1) (2023-10-02)

### Dependencies

* [`aa6728b`](https://github.com/npm/cli/commit/aa6728b1d003f0fc620b074ba0396a3e07f2db6a) [#6859](https://github.com/npm/cli/pull/6859) `tar@6.2.0`
* [`39d7f04`](https://github.com/npm/cli/commit/39d7f046f1c39017b398cb242ad07e874484e86c) [#6859](https://github.com/npm/cli/pull/6859) `minipass@7.0.4`

## [6.0.0](https://github.com/npm/cli/compare/libnpmorg-v6.0.0-pre.0...libnpmorg-v6.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

## [6.0.0-pre.0](https://github.com/npm/cli/compare/libnpmorg-v5.0.4...libnpmorg-v6.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`b6f2205`](https://github.com/npm/cli/commit/b6f220569791d655ab3c423990356cee47ca5218) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)

### Dependencies

* [`2ee0fb3`](https://github.com/npm/cli/commit/2ee0fb3ac0c5e49f9eba545d6b05e20be1352414) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@16.0.0`
* [`2c5542d`](https://github.com/npm/cli/commit/2c5542d29ba207e7c5c4337ac9ad7f296188508a) [#6706](https://github.com/npm/cli/pull/6706) `minipass@7.0.3`
* [`5d0d859`](https://github.com/npm/cli/commit/5d0d8592cbf3b816d9fe44c36d390200ec15e87a) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@15.0.0`

## [5.0.4](https://github.com/npm/cli/compare/libnpmorg-v5.0.3...libnpmorg-v5.0.4) (2023-05-03)

### Dependencies

* [`13aa7b7`](https://github.com/npm/cli/commit/13aa7b7a75b8fb18db3f4d86dfe780c8057c4213) [#6416](https://github.com/npm/cli/pull/6416) `minipass@5.0.0`

## [5.0.3](https://github.com/npm/cli/compare/libnpmorg-v5.0.2...libnpmorg-v5.0.3) (2023-02-07)

### Dependencies

* [`74c5cbb`](https://github.com/npm/cli/commit/74c5cbbd774f7ff7c1f037b382aec36cbc8ca2f1) `minipass@4.0.2`

## [5.0.2](https://github.com/npm/cli/compare/libnpmorg-v5.0.1...libnpmorg-v5.0.2) (2023-02-01)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`

## [5.0.1](https://github.com/npm/cli/compare/libnpmorg-v5.0.0...libnpmorg-v5.0.1) (2022-12-07)

### Dependencies

* [`0a3fe00`](https://github.com/npm/cli/commit/0a3fe000e2723ae6fdb8b1d3154fd3835057c992) [#5933](https://github.com/npm/cli/pull/5933) `minipass@4.0.0`
* [`fee9b66`](https://github.com/npm/cli/commit/fee9b6686892a1c7f976c36ddd5d89b70c416817) `npm-registry-fetch@14.0.3`

## [5.0.0](https://github.com/npm/cli/compare/libnpmorg-v5.0.0-pre.1...libnpmorg-v5.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

## [5.0.0-pre.1](https://github.com/npm/cli/compare/libnpmorg-v5.0.0-pre.0...libnpmorg-v5.0.0-pre.1) (2022-10-19)

### Dependencies

* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies

## [5.0.0-pre.0](https://github.com/npm/cli/compare/libnpmorg-v4.0.4...libnpmorg-v5.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)

## [4.0.4](https://github.com/npm/cli/compare/libnpmorg-v4.0.3...libnpmorg-v4.0.4) (2022-08-31)

### Dependencies

  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`

### [4.0.3](https://github.com/npm/cli/compare/libnpmorg-v4.0.2...libnpmorg-v4.0.3) (2022-04-06)


### Bug Fixes

* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [4.0.2](https://www.github.com/npm/cli/compare/libnpmorg-v4.0.1...libnpmorg-v4.0.2) (2022-03-10)


### Documentation

* standardize changelog heading ([#4510](https://www.github.com/npm/cli/issues/4510)) ([91f03ee](https://www.github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))

### [4.0.1](https://www.github.com/npm/cli/compare/libnpmorg-vlibnpmorg@4.0.0...libnpmorg-v4.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## 2.0.0 (2020-03-02)

### BREAKING CHANGE
- Removed `figgy-pudding` as a dependecy
- Using native promises
- Require node >= v10

### Feature
- Updated stream interface to `minipass` type stream

---

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.1"></a>
## [1.0.1](https://github.com/npm/libnpmorg/compare/v1.0.0...v1.0.1) (2019-07-16)


### Bug Fixes

* **standard:** standard --fix ([5118358](https://github.com/npm/libnpmorg/commit/5118358))



<a name="1.0.0"></a>
# 1.0.0 (2018-08-23)


### Features

* **API:** implement org api ([731b9c6](https://github.com/npm/libnpmorg/commit/731b9c6))
