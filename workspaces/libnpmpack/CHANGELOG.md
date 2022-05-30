# Changelog

## [5.0.0](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/compare/libnpmpack-v4.1.0...libnpmpack-v5.0.0) (2022-05-30)


### ⚠ BREAKING CHANGES

* **libnpmpack:** this drops support for the `log` property and the banner is shown using the silent option
* **libnpmpack:** the log option is no longer passed to the updated deps

### Features

* **libnpmpack:** bump pacote for better workspace awareness ([7307c8d](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/7307c8de388cd14c96c42d70b7e567ec343ad084))
* **libnpmpack:** use silent boolean instead of log.level ([64d451c](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/64d451c80d3385aba0f0a89736368318f2389500))
* **libnpmpack:** write tarball file when dryRun === false ([4884821](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/4884821f637ca1992b494fbdbd94d000e4428a40))


### Bug Fixes

* **config:** add pack-destination flattener ([2937b43](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/2937b43d4629225d83b6c71833df00743209f5ff))
* ignore integrity values for git dependencies ([#4468](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/issues/4468)) ([c608512](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/c608512ed03ccf87dc989cec2849d14bf034513a))
* set proper workspace repo urls in package.json ([#4476](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/issues/4476)) ([0cfc155](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))
* update readme badges ([#4658](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/issues/4658)) ([2829cb2](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Documentation

* standardize changelog heading ([#4510](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/issues/4510)) ([91f03ee](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/issues/4639)) ([a59fd2c](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))
* cacache@16.0.1 ([f95396a](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/f95396a033b75e2a3e9aa83f0b06c527641027a4))
* libnpmpack@3.1.0 ([d3a7c15](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/d3a7c15e1e3d305a0bf781493406dfb1fdbaca35))
* libnpmpack@4.0.0 ([8b1d963](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/8b1d9636ad2374254263d154f2b4ca8ea6416f4c))
* libnpmpack@4.0.3 ([86f5b27](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/86f5b273fc57118b8b1a5e53ec3ca49d94d81601))
* libnpmpack@4.1.0 ([f4d4126](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/f4d41265931c3c2eee433e27f4535c7a209e69fa))
* **libnpmpack:** update to latest major versions of npm deps ([780609b](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/780609b0be8cc7b06e2c36dd0707a6e5a154d976))
* npm-package-arg@9.0.1 ([9555a5f](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/9555a5f1d135aa1b8f7374273403efe41e99ee26))
* pacote@13.0.4 ([6d31450](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/6d3145014861b4198c16d7772d809fd037ece289))
* pacote@13.0.5 ([340fa51](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/340fa51f423a518a96c8015a67d8f6144a2e8051))
* pacote@13.5.0 npm-packlist@5.1.0 ([353e2f9](https://github.com/samkenxstream/turnkey-triumph-326606_samkencoin-cli/commit/353e2f9dc60a5d319d4105822a9e0b2ddbf82bc0))

## [4.1.0](https://github.com/npm/cli/compare/libnpmpack-v4.0.3...libnpmpack-v4.1.0) (2022-05-25)


### Features

* **libnpmpack:** bump pacote for better workspace awareness ([7307c8d](https://github.com/npm/cli/commit/7307c8de388cd14c96c42d70b7e567ec343ad084))


### Dependencies

* pacote@13.5.0 npm-packlist@5.1.0 ([353e2f9](https://github.com/npm/cli/commit/353e2f9dc60a5d319d4105822a9e0b2ddbf82bc0))

### [4.0.3](https://github.com/npm/cli/compare/libnpmpack-v4.0.2...libnpmpack-v4.0.3) (2022-04-06)


### Bug Fixes

* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [4.0.2](https://www.github.com/npm/cli/compare/libnpmpack-v4.0.1...libnpmpack-v4.0.2) (2022-03-15)


### Documentation

* standardize changelog heading ([#4510](https://www.github.com/npm/cli/issues/4510)) ([91f03ee](https://www.github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))


### Dependencies

* npm-package-arg@9.0.1 ([9555a5f](https://www.github.com/npm/cli/commit/9555a5f1d135aa1b8f7374273403efe41e99ee26))
* pacote@13.0.4 ([6d31450](https://www.github.com/npm/cli/commit/6d3145014861b4198c16d7772d809fd037ece289))
* pacote@13.0.5 ([340fa51](https://www.github.com/npm/cli/commit/340fa51f423a518a96c8015a67d8f6144a2e8051))

### [4.0.1](https://www.github.com/npm/cli/compare/libnpmpack-vlibnpmpack@4.0.0...libnpmpack-v4.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))


## [2.0.0](https://github.com/npm/libnpmpack/compare/v1.0.0...v2.0.0) (2020-03-27)

### Breaking Changes

* [`cb2ecf2`](https://github.com/npm/libnpmpack/commit/cb2ecf2) feat: resolve to tarball data Buffer ([@claudiahdz](https://github.com/claudiahdz))


### 1.0.0 (2020-03-26)


### Features

* [`a35c590`](https://github.com/npm/libnpmpack/commit/a35c590) feat: pack tarballs from local dir or registry spec ([@claudiahdz](https://github.com/claudiahdz))
* [`6d72149`](https://github.com/npm/libnpmpack/commit/6d72149) feat: sorted tarball contents ([@eridal](https://github.com/eridal))
