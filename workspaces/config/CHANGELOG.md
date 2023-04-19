# Changelog

## [6.1.6](https://github.com/npm/cli/compare/config-v6.1.5...config-v6.1.6) (2023-04-19)

### Bug Fixes

* [`c7fe1c7`](https://github.com/npm/cli/commit/c7fe1c70eef49fa666f9f25ec941afa8b6acbf05) [#6328](https://github.com/npm/cli/pull/6328) save raw data to file, not parsed data (@wraithgar)
* [`667cff5`](https://github.com/npm/cli/commit/667cff5e29f9be5666d701692ac238dc38194192) [#6328](https://github.com/npm/cli/pull/6328) move to private attributes where possible (@wraithgar)

### Dependencies

* [`3fa9542`](https://github.com/npm/cli/commit/3fa9542d7f3c0123cb3c49a40f6d5b7bc8d857a5) [#6363](https://github.com/npm/cli/pull/6363) `semver@7.5.0`
* [`357cc29`](https://github.com/npm/cli/commit/357cc29a335e684391c7b840019223e555919406) [#6363](https://github.com/npm/cli/pull/6363) `walk-up-path@3.0.1`
* [`2c80b1e`](https://github.com/npm/cli/commit/2c80b1ede7b6a3c49b3255e171759d30913f0c74) [#6363](https://github.com/npm/cli/pull/6363) `ini@4.1.0`

## [6.1.5](https://github.com/npm/cli/compare/config-v6.1.4...config-v6.1.5) (2023-03-30)

### Bug Fixes

* [`6a4bcba`](https://github.com/npm/cli/commit/6a4bcbaaf12c15041c73914fb3a24389a62f7436) [#6275](https://github.com/npm/cli/pull/6275) clean up man sorting (@wraithgar)

## [6.1.4](https://github.com/npm/cli/compare/config-v6.1.3...config-v6.1.4) (2023-03-14)

### Bug Fixes

* [`968f63a`](https://github.com/npm/cli/commit/968f63ada828ee8ccfdba3d6d437c9e7c6917026) [#6236](https://github.com/npm/cli/pull/6236) parse date objects from config files (#6236) (@wraithgar)

## [6.1.3](https://github.com/npm/cli/compare/config-v6.1.2...config-v6.1.3) (2023-02-07)

### Dependencies

* [`d43f881`](https://github.com/npm/cli/commit/d43f8812af5900cce45364729871a745b379aea9) `map-workspaces@3.0.2`

## [6.1.2](https://github.com/npm/cli/compare/config-v6.1.1...config-v6.1.2) (2023-02-01)

### Bug Fixes

* [`328c3d8`](https://github.com/npm/cli/commit/328c3d8e7362eb08ae2aebabc47f8f3c2537a1d2) [#6093](https://github.com/npm/cli/pull/6093) repair config items using raw values when possible (@nlf)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`1d4be7a`](https://github.com/npm/cli/commit/1d4be7a5457fd0081696e29f8382645873cf13d9) `@npmcli/map-workspaces@3.0.1`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`

## [6.1.1](https://github.com/npm/cli/compare/config-v6.1.0...config-v6.1.1) (2023-01-12)

### Bug Fixes

* [`450e50f`](https://github.com/npm/cli/commit/450e50fa555bfef869735b0195fe0a451e94eb3d) evaluate configs in command class (@lukekarrys)

## [6.1.0](https://github.com/npm/cli/compare/config-v6.0.1...config-v6.1.0) (2022-11-02)

### Features

* [`706b3d3`](https://github.com/npm/cli/commit/706b3d3f227de43a095263926d2eef2b4e4cf2a9) [#5779](https://github.com/npm/cli/pull/5779) set --no-audit when installing outside of a project (like --global) (@fritzy)
* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

### Dependencies

* [`b89c19e`](https://github.com/npm/cli/commit/b89c19e9a7674b0bd9d336c14dee1bf381843648) [#5795](https://github.com/npm/cli/pull/5795) `cli-table3@0.6.3`
* [`66f9bcd`](https://github.com/npm/cli/commit/66f9bcd10b8d8cb635593c526727056581c7955d) `nopt@7.0.0`

## [6.0.1](https://github.com/npm/config/compare/v6.0.0...v6.0.1) (2022-10-17)

### Dependencies

* [`dca20cc`](https://github.com/npm/config/commit/dca20cc00c0cbebd9d1a1cf1962e32e99057ea8e) [#99](https://github.com/npm/config/pull/99) bump @npmcli/map-workspaces from 2.0.4 to 3.0.0
* [`fc42456`](https://github.com/npm/config/commit/fc424565014cc155e902940221b6283cbb40faf4) [#100](https://github.com/npm/config/pull/100) bump proc-log from 2.0.1 to 3.0.0

## [6.0.0](https://github.com/npm/config/compare/v5.0.0...v6.0.0) (2022-10-13)

### ⚠️ BREAKING CHANGES

* this module no longer attempts to change file ownership automatically

### Features

* [`805535f`](https://github.com/npm/config/commit/805535ff6b7255a3a2fb5e7da392f53b1c2f3c04) [#96](https://github.com/npm/config/pull/96) do not alter file ownership (#96) (@nlf)

### Dependencies

* [`c62c19c`](https://github.com/npm/config/commit/c62c19cffc65a8b6e89cbd071bd7578f246312a9) [#95](https://github.com/npm/config/pull/95) bump read-package-json-fast from 2.0.3 to 3.0.0

## [5.0.0](https://github.com/npm/config/compare/v4.2.2...v5.0.0) (2022-10-06)

### ⚠️ BREAKING CHANGES

* unscoped auth configuration is no longer automatically scoped to a registry. the `validate` method is no longer called automatically. the `_auth` configuration key is no longer split into `username` and `_password`. errors will be thrown by `validate()` if problems are found.
* `@npmcli/config` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

* [`344ccd3`](https://github.com/npm/config/commit/344ccd3d07979d0cb36dad8a7fe2e9cbbdbdbc9e) [#92](https://github.com/npm/config/pull/92) throw errors for invalid auth configuration (#92) (@nlf)
* [`aa25682`](https://github.com/npm/config/commit/aa256827d76ec9b1aea06eb3ebdd033067a5e604) [#87](https://github.com/npm/config/pull/87) postinstall for dependabot template-oss PR (@lukekarrys)

## [4.2.2](https://github.com/npm/config/compare/v4.2.1...v4.2.2) (2022-08-25)


### Bug Fixes

* warn on bare auth related configs ([#78](https://github.com/npm/config/issues/78)) ([d4e582a](https://github.com/npm/config/commit/d4e582ab7d8d9f4a8615619bb7d3263df5de66e6))

## [4.2.1](https://github.com/npm/config/compare/v4.2.0...v4.2.1) (2022-08-09)


### Bug Fixes

* correctly handle nerf-darted env vars ([#74](https://github.com/npm/config/issues/74)) ([71f559b](https://github.com/npm/config/commit/71f559b08e01616b53f61e1cf385fc44162e2d66))
* linting ([#75](https://github.com/npm/config/issues/75)) ([deb1001](https://github.com/npm/config/commit/deb10011d1b5e3df84b7d13284ea55b07dd62b63))


### Dependencies

* bump nopt from 5.0.0 to 6.0.0 ([#72](https://github.com/npm/config/issues/72)) ([d825726](https://github.com/npm/config/commit/d825726049644f5bbe0edf27b5600cc60ae14ee5))

## [4.2.0](https://github.com/npm/config/compare/v4.1.0...v4.2.0) (2022-07-18)


### Features

* detect registry-scoped certfile and keyfile options ([#69](https://github.com/npm/config/issues/69)) ([e58a4f1](https://github.com/npm/config/commit/e58a4f18f0ec0820fe57ccaff34c4135ece12558))

## [4.1.0](https://github.com/npm/config/compare/v4.0.2...v4.1.0) (2022-04-13)


### Features

* warn on deprecated config ([#62](https://github.com/npm/config/issues/62)) ([190065e](https://github.com/npm/config/commit/190065ef53d39a1e09486639c710dabdd73d8a7c))

### [4.0.2](https://github.com/npm/config/compare/v4.0.1...v4.0.2) (2022-04-05)


### Bug Fixes

* replace deprecated String.prototype.substr() ([#59](https://github.com/npm/config/issues/59)) ([43893b6](https://github.com/npm/config/commit/43893b638f82ade945cba27fe9e483b32eea99ae))


### Dependencies

* bump ini from 2.0.0 to 3.0.0 ([#60](https://github.com/npm/config/issues/60)) ([965e2a4](https://github.com/npm/config/commit/965e2a40c7649ffd6e84fb83823a2b751bcda294))
* update @npmcli/map-workspaces requirement from ^2.0.1 to ^2.0.2 ([#49](https://github.com/npm/config/issues/49)) ([9a0f182](https://github.com/npm/config/commit/9a0f182c4fa46dadccc631a244678a3c469ad63a))

### [4.0.1](https://www.github.com/npm/config/compare/v4.0.0...v4.0.1) (2022-03-02)


### Bug Fixes

* skip workspace detection when in global mode ([#47](https://www.github.com/npm/config/issues/47)) ([bedff61](https://www.github.com/npm/config/commit/bedff61c6f074f21c1586afe391dc2cb6e821619))


### Dependencies

* update @npmcli/map-workspaces requirement from ^2.0.0 to ^2.0.1 ([#43](https://www.github.com/npm/config/issues/43)) ([c397ab8](https://www.github.com/npm/config/commit/c397ab88c459fc477ae9094ec0ee0b571e6bb8ed))

## [4.0.0](https://www.github.com/npm/config/compare/v3.0.1...v4.0.0) (2022-02-14)


### ⚠ BREAKING CHANGES

* drop support for the `log` option

### Features

* remove `log` option ([#40](https://www.github.com/npm/config/issues/40)) ([bbf5128](https://www.github.com/npm/config/commit/bbf512818f30d0764e3951449c8f07856d70991e))


### Bug Fixes

* correct a polynomial regex ([#39](https://www.github.com/npm/config/issues/39)) ([9af098f](https://www.github.com/npm/config/commit/9af098fb874c1a8122ab7a5e009235a1f7df72f5))

### [3.0.1](https://www.github.com/npm/config/compare/v3.0.0...v3.0.1) (2022-02-10)


### Dependencies

* update semver requirement from ^7.3.4 to ^7.3.5 ([2cb225a](https://www.github.com/npm/config/commit/2cb225a907180a3b569c8c9baf23da1a989a2f1f))
* use proc-log instead of process.emit ([fd4cd42](https://www.github.com/npm/config/commit/fd4cd429ef875ce68aa0be9bba329cae4e7adfe3))

## [3.0.0](https://www.github.com/npm/config/compare/v2.4.0...v3.0.0) (2022-02-01)


### ⚠ BREAKING CHANGES

* this drops support for node10 and non-LTS versions of node12 and node14

### Features

* automatically detect workspace roots ([#28](https://www.github.com/npm/config/issues/28)) ([a3dc623](https://www.github.com/npm/config/commit/a3dc6234d57c7c80c66a8c33e17cf1d97f86f8d9))


### Bug Fixes

* template-oss ([#29](https://www.github.com/npm/config/issues/29)) ([6440fba](https://www.github.com/npm/config/commit/6440fba6e04b1f87e57b4c2ccc5ea84d8a69b823))
