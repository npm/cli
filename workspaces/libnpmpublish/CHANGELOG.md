# Changelog

## [9.0.1](https://github.com/npm/cli/compare/libnpmpublish-v9.0.0...libnpmpublish-v9.0.1) (2023-10-02)

### Dependencies

* [`aa6728b`](https://github.com/npm/cli/commit/aa6728b1d003f0fc620b074ba0396a3e07f2db6a) [#6859](https://github.com/npm/cli/pull/6859) `tar@6.2.0`
* [`ce9089f`](https://github.com/npm/cli/commit/ce9089f604a01297d3d2dd544283696a6297dce5) [#6859](https://github.com/npm/cli/pull/6859) `npm-package-arg@11.0.1`

## [9.0.0](https://github.com/npm/cli/compare/libnpmpublish-v9.0.0-pre.0...libnpmpublish-v9.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

## [9.0.0-pre.0](https://github.com/npm/cli/compare/libnpmpublish-v8.0.0...libnpmpublish-v9.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`d431647`](https://github.com/npm/cli/commit/d4316479a7894290586718e412d7c670316a36f2) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)

### Dependencies

* [`812aa6d`](https://github.com/npm/cli/commit/812aa6d2027ed42453b86b22f4cf8de25f6e0180) [#6706](https://github.com/npm/cli/pull/6706) `sigstore@2.1.0`
* [`0d2e2c9`](https://github.com/npm/cli/commit/0d2e2c9d09ff760d8db09774fcd7ad417a88c4c7) [#6706](https://github.com/npm/cli/pull/6706) bump sigstore from 1.7.0 to 2.0.0
* [`2ee0fb3`](https://github.com/npm/cli/commit/2ee0fb3ac0c5e49f9eba545d6b05e20be1352414) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@16.0.0`
* [`c784b57`](https://github.com/npm/cli/commit/c784b57b654d25e8d932e6fe415b87e75dcf9026) [#6706](https://github.com/npm/cli/pull/6706) `npm-package-arg@11.0.0`
* [`d6b1790`](https://github.com/npm/cli/commit/d6b1790492d9bc96c196d85d8fc9fd98d62d0087) [#6706](https://github.com/npm/cli/pull/6706) `normalize-package-data@6.0.0`
* [`9117a4f`](https://github.com/npm/cli/commit/9117a4fcf05291ce7609bcad5bb810df9a5158e7) [#6706](https://github.com/npm/cli/pull/6706) `ssri@10.0.5`
* [`5d0d859`](https://github.com/npm/cli/commit/5d0d8592cbf3b816d9fe44c36d390200ec15e87a) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@15.0.0`

## [8.0.0](https://github.com/npm/cli/compare/libnpmpublish-v7.5.0...libnpmpublish-v8.0.0) (2023-07-26)

### ⚠️ BREAKING CHANGES

* the "ci-name" config has been removed
* libnpmpublish will no longer attempt a single automatic retry on 409 responses during publish.

### Bug Fixes

* [`e0d3edd`](https://github.com/npm/cli/commit/e0d3edd9908f8303abb9941bdd2f6e9aa31bc9d7) [#6641](https://github.com/npm/cli/pull/6641) remove "ci-name" config (@wraithgar)
* [`0a71ebb`](https://github.com/npm/cli/commit/0a71ebb3d1e7fca07d39ea64e5f1acd22ecd255c) [#6641](https://github.com/npm/cli/pull/6641) stop retrying on 409 conflict (@wraithgar)

## [7.5.0](https://github.com/npm/cli/compare/libnpmpublish-v7.4.0...libnpmpublish-v7.5.0) (2023-07-05)

### Features

* [`5baf6a2`](https://github.com/npm/cli/commit/5baf6a2c6274d9838556617e9ff5b66fe87ede51) [#6613](https://github.com/npm/cli/pull/6613) SLSA 1.0 provenance statement (#6613) (@bdehamer)

## [7.4.0](https://github.com/npm/cli/compare/libnpmpublish-v7.3.0...libnpmpublish-v7.4.0) (2023-06-21)

### Features

* [`7701105`](https://github.com/npm/cli/commit/770110535c07502e30619c3def8f35a522c36427) [#6526](https://github.com/npm/cli/pull/6526) Add GitLab CI provenance (#6375) (#6526) (@wraithgar, @wlynch)

### Bug Fixes

* [`29622c1`](https://github.com/npm/cli/commit/29622c1349b38173924058a1fb0ede9edf8a5f6f) [#6530](https://github.com/npm/cli/pull/6530) public package check in libnpmpublish (#6530) (@bdehamer)

## [7.3.0](https://github.com/npm/cli/compare/libnpmpublish-v7.2.0...libnpmpublish-v7.3.0) (2023-05-31)

### Features

* [`a63a6d8`](https://github.com/npm/cli/commit/a63a6d8d6fd339d504ab94c0364ce7ee3d4e3775) [#6490](https://github.com/npm/cli/pull/6490) add provenanceFile option for libnpmpublish (@bdehamer)

## [7.2.0](https://github.com/npm/cli/compare/libnpmpublish-v7.1.4...libnpmpublish-v7.2.0) (2023-05-17)

### Features

* [`bdab631`](https://github.com/npm/cli/commit/bdab631b9847013dc4e8d4083669acf6c7bfb457) [#6428](https://github.com/npm/cli/pull/6428) expose provenance transparency url (#6428) (@JamesHenry, @wraithgar)

### Bug Fixes

* [`f064696`](https://github.com/npm/cli/commit/f06469607b80faf72eb897ec3e33deebc6dc10fc) [#6437](https://github.com/npm/cli/pull/6437) Update publish /w provenance to ignore pkg vis 404 (#6437) (@feelepxyz)

## [7.1.4](https://github.com/npm/cli/compare/libnpmpublish-v7.1.3...libnpmpublish-v7.1.4) (2023-05-03)

### Dependencies

* [`abdca39`](https://github.com/npm/cli/commit/abdca39a78af416f82771bde69360c0b664ac63d) [#6416](https://github.com/npm/cli/pull/6416) `sigstore@1.4.0`

## [7.1.3](https://github.com/npm/cli/compare/libnpmpublish-v7.1.2...libnpmpublish-v7.1.3) (2023-03-30)

### Bug Fixes

* [`3cf6f0d`](https://github.com/npm/cli/commit/3cf6f0d6fcb9a9fd069b7178a223ddd1cfaf5f2b) [#6287](https://github.com/npm/cli/pull/6287) update provenance transparency log link (#6287) (@bdehamer)

## [7.1.2](https://github.com/npm/cli/compare/libnpmpublish-v7.1.1...libnpmpublish-v7.1.2) (2023-03-14)

### Bug Fixes

* [`4622b42`](https://github.com/npm/cli/commit/4622b425751bc6e3eebb9abfa5fc3fbf94890e34) [#6247](https://github.com/npm/cli/pull/6247) add provenance publish notice (#6247) (@bdehamer)
* [`17adfb7`](https://github.com/npm/cli/commit/17adfb7b6c125cf033ac259936fb15bb85339aac) [#6228](https://github.com/npm/cli/pull/6228) provenance build type v2 (#6228) (@bdehamer, @feelepxyz)

## [7.1.1](https://github.com/npm/cli/compare/libnpmpublish-v7.1.0...libnpmpublish-v7.1.1) (2023-03-08)

### Bug Fixes

* [`26cbe99`](https://github.com/npm/cli/commit/26cbe9912a1b5f6c16bbc5121435037ef691b6c3) [#6226](https://github.com/npm/cli/pull/6226) improve permission error for provenance (#6226) (@bdehamer)

## [7.1.0](https://github.com/npm/cli/compare/libnpmpublish-v7.0.8...libnpmpublish-v7.1.0) (2023-02-14)

### Features

* [`5fc6473`](https://github.com/npm/cli/commit/5fc647316cdc07d4337cdf1b75f73a0663822c7f) add provenance attestation (@bdehamer)

## [7.0.8](https://github.com/npm/cli/compare/libnpmpublish-v7.0.7...libnpmpublish-v7.0.8) (2023-02-07)

### Bug Fixes

* [`12ec7ee`](https://github.com/npm/cli/commit/12ec7ee1983876565445ae7967e2f14f3d95e356) remove unused package.json scripts (@lukekarrys)

## [7.0.7](https://github.com/npm/cli/compare/libnpmpublish-v7.0.6...libnpmpublish-v7.0.7) (2023-02-01)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`

## [7.0.6](https://github.com/npm/cli/compare/libnpmpublish-v7.0.5...libnpmpublish-v7.0.6) (2022-12-07)

### Dependencies

* [`0a3fe00`](https://github.com/npm/cli/commit/0a3fe000e2723ae6fdb8b1d3154fd3835057c992) [#5933](https://github.com/npm/cli/pull/5933) `minipass@4.0.0`
* [`cf0a174`](https://github.com/npm/cli/commit/cf0a17407abc577c27420a1c8a4a0c08c7cefce9) `ssri@10.0.1`
* [`fee9b66`](https://github.com/npm/cli/commit/fee9b6686892a1c7f976c36ddd5d89b70c416817) `npm-registry-fetch@14.0.3`
* [`875bd56`](https://github.com/npm/cli/commit/875bd56c33ca5eef80c2a50a11808445f2a39a2a) `npm-package-arg@10.1.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v5.0.6): `libnpmpack@5.0.6`

## [7.0.5](https://github.com/npm/cli/compare/libnpmpublish-v7.0.4...libnpmpublish-v7.0.5) (2022-11-30)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.4...libnpmpack-v5.0.5): `libnpmpack@5.0.5`

## [7.0.4](https://github.com/npm/cli/compare/libnpmpublish-v7.0.3...libnpmpublish-v7.0.4) (2022-11-16)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.3...libnpmpack-v5.0.4): `libnpmpack@5.0.4`

## [7.0.3](https://github.com/npm/cli/compare/libnpmpublish-v7.0.2...libnpmpublish-v7.0.3) (2022-11-09)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.2...libnpmpack-v5.0.3): `libnpmpack@5.0.3`

## [7.0.2](https://github.com/npm/cli/compare/libnpmpublish-v7.0.1...libnpmpublish-v7.0.2) (2022-11-02)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.1...libnpmpack-v5.0.2): `libnpmpack@5.0.2`

## [7.0.1](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0...libnpmpublish-v7.0.1) (2022-10-26)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0...libnpmpack-v5.0.1): `libnpmpack@5.0.1`

## [7.0.0](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.4...libnpmpublish-v7.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.4...libnpmpack-v5.0.0): `libnpmpack@5.0.0`

## [7.0.0-pre.4](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.3...libnpmpublish-v7.0.0-pre.4) (2022-10-19)

### Dependencies

* [`2008ea6`](https://github.com/npm/cli/commit/2008ea6a807acbd97912799adfe97f276202cea6) `npm-package-arg@10.0.0`, `pacote@15.0.2`
* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies
* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.3...libnpmpack-v5.0.0-pre.4): `libnpmpack@5.0.0-pre.4`

## [7.0.0-pre.3](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.2...libnpmpublish-v7.0.0-pre.3) (2022-10-13)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.2...libnpmpack-v5.0.0-pre.3): `libnpmpack@5.0.0-pre.3`

## [7.0.0-pre.2](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.1...libnpmpublish-v7.0.0-pre.2) (2022-10-05)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.1...libnpmpack-v5.0.0-pre.2): `libnpmpack@5.0.0-pre.2`

## [7.0.0-pre.1](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.0...libnpmpublish-v7.0.0-pre.1) (2022-09-30)

### ⚠️ BREAKING CHANGES

* The default value of `access` is now `public`

### Features

* [`525654e`](https://github.com/npm/cli/commit/525654e957a80c7f47472e18240e3c8d94e0568f) default access to `public` (@wraithgar)

### Documentation

* [`f0e7584`](https://github.com/npm/cli/commit/f0e758494698d9dd8a58d07bf71c87608c36869e) [#5601](https://github.com/npm/cli/pull/5601) update docs/logging for new --access default (@wraithgar)

## [7.0.0-pre.0](https://github.com/npm/cli/compare/libnpmpublish-v6.0.5...libnpmpublish-v7.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * libnpmpack bumped from ^4.1.3 to ^5.0.0-pre.0

## [6.0.5](https://github.com/npm/cli/compare/libnpmpublish-v6.0.4...libnpmpublish-v6.0.5) (2022-08-31)

### Dependencies

  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`
* The following workspace dependencies were updated
  * devDependencies
    * libnpmpack bumped from ^4.0.0 to ^4.1.3

### [6.0.4](https://github.com/npm/cli/compare/libnpmpublish-v6.0.3...libnpmpublish-v6.0.4) (2022-04-26)


### Bug Fixes

* **libnpmpublish:** unpublish from custom reg ([#4657](https://github.com/npm/cli/issues/4657)) ([e9163b4](https://github.com/npm/cli/commit/e9163b48d8e46a80d2a4cc98c492b94dfa152cb8))


### Dependencies

* semver@7.3.7 ([c51e553](https://github.com/npm/cli/commit/c51e553a32315e4f1b703ca9030eb7ade91d1a85))

### [6.0.3](https://github.com/npm/cli/compare/libnpmpublish-v6.0.2...libnpmpublish-v6.0.3) (2022-04-06)


### Bug Fixes

* replace deprecated String.prototype.substr() ([#4667](https://github.com/npm/cli/issues/4667)) ([e3da5df](https://github.com/npm/cli/commit/e3da5df4152fbe547f7871547165328e1bf06262))
* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))
* ssri@9.0.0 ([a2781a3](https://github.com/npm/cli/commit/a2781a367d62328d7f870de878f1b63d66593f4f))

### [6.0.2](https://www.github.com/npm/cli/compare/libnpmpublish-v6.0.1...libnpmpublish-v6.0.2) (2022-03-15)


### Documentation

* standardize changelog heading ([#4510](https://www.github.com/npm/cli/issues/4510)) ([91f03ee](https://www.github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))


### Dependencies

* normalize-package-data@4.0.0 ([b2a4942](https://www.github.com/npm/cli/commit/b2a494283f45a25d1b87bc40bf2d68812871e89c))
* npm-package-arg@9.0.1 ([9555a5f](https://www.github.com/npm/cli/commit/9555a5f1d135aa1b8f7374273403efe41e99ee26))

## [3.0.1](https://github.com/npm/libnpmpublish/compare/v3.0.0...v3.0.1) (2020-03-27)

### Features

* [`3e02307`](https://github.com/npm/libnpmpublish/commit/3e02307) chore: pack tarballs using libnpmpack ([@claudiahdz](https://github.com/claudiahdz))

<a name="3.0.0"></a>
# [3.0.0](https://github.com/npm/libnpmpublish/compare/v2.0.0...v3.0.0) (2020-03-09)

### Breaking Changes

* [`ecaeb0b`](https://github.com/npm/libnpmpublish/commit/ecaeb0b) feat: pack tarballs from source code using pacote v10 ([@claudiahdz](https://github.com/claudiahdz))

* [`f6bf2b8`](https://github.com/npm/libnpmpublish/commit/f6bf2b8) feat: unpublish code refactor ([@claudiahdz](https://github.com/claudiahdz))

### Miscellaneuous

* [`5cea10f`](https://github.com/npm/libnpmpublish/commit/5cea10f) chore: basic project updates ([@claudiahdz](https://github.com/claudiahdz))
* [`3010b93`](https://github.com/npm/libnpmpublish/commit/3010b93) chore: cleanup badges + contributing ([@ruyadorno](https://github.com/ruyadorno))

---

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [6.0.1](https://www.github.com/npm/cli/compare/libnpmpublish-vlibnpmpublish@6.0.0...libnpmpublish-v6.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## [2.0.0](https://github.com/npm/libnpmpublish/compare/v1.1.3...v2.0.0) (2019-09-18)


### ⚠ BREAKING CHANGES

* This drops support for Node.js version 6.

### Bug Fixes

* audit warnings, drop support for Node.js v6 ([d9a1fb6](https://github.com/npm/libnpmpublish/commit/d9a1fb6))

### [1.1.3](https://github.com/npm/libnpmpublish/compare/v1.1.2...v1.1.3) (2019-09-18)

<a name="1.1.2"></a>
## [1.1.2](https://github.com/npm/libnpmpublish/compare/v1.1.1...v1.1.2) (2019-07-16)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/npm/libnpmpublish/compare/v1.1.0...v1.1.1) (2019-01-22)


### Bug Fixes

* **auth:** send username in correct key ([#3](https://github.com/npm/libnpmpublish/issues/3)) ([38422d0](https://github.com/npm/libnpmpublish/commit/38422d0))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/npm/libnpmpublish/compare/v1.0.1...v1.1.0) (2018-08-31)


### Features

* **publish:** add support for publishConfig on manifests ([161723b](https://github.com/npm/libnpmpublish/commit/161723b))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/npm/libnpmpublish/compare/v1.0.0...v1.0.1) (2018-08-31)


### Bug Fixes

* **opts:** remove unused opts ([2837098](https://github.com/npm/libnpmpublish/commit/2837098))



<a name="1.0.0"></a>
# 1.0.0 (2018-08-31)


### Bug Fixes

* **api:** use opts.algorithms, return true on success ([80fe34b](https://github.com/npm/libnpmpublish/commit/80fe34b))
* **publish:** first test pass w/ bugfixes ([74135c9](https://github.com/npm/libnpmpublish/commit/74135c9))
* **publish:** full coverage test and related fixes ([b5a3446](https://github.com/npm/libnpmpublish/commit/b5a3446))


### Features

* **docs:** add README with api docs ([553c13d](https://github.com/npm/libnpmpublish/commit/553c13d))
* **publish:** add initial publish support. tests tbd ([5b3fe94](https://github.com/npm/libnpmpublish/commit/5b3fe94))
* **unpublish:** add new api with unpublish support ([1c9d594](https://github.com/npm/libnpmpublish/commit/1c9d594))
