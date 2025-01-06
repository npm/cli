# Changelog

## [10.0.0](https://github.com/npm/cli/compare/config-v10.0.0-pre.1...config-v10.0.0) (2024-12-16)
### Features
* [`a7bfc6d`](https://github.com/npm/cli/commit/a7bfc6df76882996ebb834dbca785fdf33b8c50d) [#7972](https://github.com/npm/cli/pull/7972) trigger release process (#7972) (@wraithgar)
### Chores
* [`a07f4e0`](https://github.com/npm/cli/commit/a07f4e0d921f640be6aa87736debd550ec478f89) [#7976](https://github.com/npm/cli/pull/7976) `@npmcli/template-oss@4.23.6` (@wraithgar)

## [10.0.0-pre.1](https://github.com/npm/cli/compare/config-v10.0.0-pre.0...config-v10.0.0-pre.1) (2024-12-06)
### Documentation
* [`2af31dd`](https://github.com/npm/cli/commit/2af31dd30f4c226f43ce7295cd0b5fbb3f3cb2a6) [#7947](https://github.com/npm/cli/pull/7947) change certfile to cafile (#7947) (@wraithgar)
### Dependencies
* [`c0bcc2a`](https://github.com/npm/cli/commit/c0bcc2a860fec5c86234dec44f5474364c25aefc) [#7955](https://github.com/npm/cli/pull/7955) `walk-up-path@4.0.0`

## [10.0.0-pre.0](https://github.com/npm/cli/compare/config-v9.0.0...config-v10.0.0-pre.0) (2024-11-26)
### ⚠️ BREAKING CHANGES
* @npmcli/config now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`6e11eb2`](https://github.com/npm/cli/commit/6e11eb2cf663b6566f4fcf10b2b9d4fbce615b5d) [#7831](https://github.com/npm/cli/pull/7831) for @npmcli/config sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
### Chores
* [`6edfe2f`](https://github.com/npm/cli/commit/6edfe2f3a45169b6d194ccd8d366bb8d0e09b4a5) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/template-oss@4.23.5` (@wraithgar)

## [9.0.0](https://github.com/npm/cli/compare/config-v8.3.4...config-v9.0.0) (2024-10-03)
### ⚠️ BREAKING CHANGES
* `@npmcli/config` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`f846ad3`](https://github.com/npm/cli/commit/f846ad3e5e2a930c89cc8c4daa7752ba6fd52598) [#7803](https://github.com/npm/cli/pull/7803) align @npmcli/config to npm 10 node engine range (@reggi)
### Dependencies
* [`f6909a0`](https://github.com/npm/cli/commit/f6909a022c9373c85d980c96a30f47a3a65aa4a9) [#7803](https://github.com/npm/cli/pull/7803) update `proc-log@5.0.0`
* [`105fa2b`](https://github.com/npm/cli/commit/105fa2bdb2bbb0502bb8e0c5ccec3dadcff3c2d6) [#7803](https://github.com/npm/cli/pull/7803) update `nopt@8.0.0`
* [`f54b155`](https://github.com/npm/cli/commit/f54b155d0cbc251c7159cc42ba3b6154563f9e49) [#7803](https://github.com/npm/cli/pull/7803) update `ini@5.0.0`
* [`2076368`](https://github.com/npm/cli/commit/207636897aa5544ec28cad5b75fe2e685028dafd) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/package-json@6.0.1`
* [`feac87c`](https://github.com/npm/cli/commit/feac87c7ed6113665bc144ee677017bc66138b70) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/map-workspaces@4.0.1`
### Chores
* [`2072705`](https://github.com/npm/cli/commit/2072705aa80d009dc077639adc305692f4a6c0b9) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/eslint-config@5.0.1` (@reggi)
* [`8035725`](https://github.com/npm/cli/commit/80357253ecd8483463cd66c783c4464c330d72df) [#7756](https://github.com/npm/cli/pull/7756) `@npmcli/template-oss@4.23.3` (@wraithgar)

## [8.3.4](https://github.com/npm/cli/compare/config-v8.3.3...config-v8.3.4) (2024-07-09)

### Bug Fixes

* [`15be6dd`](https://github.com/npm/cli/commit/15be6dd33bfab8bdfaf8c3dece435d7139c1bf6d) [#7574](https://github.com/npm/cli/pull/7574) don't try parsing workspaces if none exist (@wraithgar)
* [`d185c9b`](https://github.com/npm/cli/commit/d185c9bdcab7dd2a8a485cd167b9a7c5c1f43ad0) [#7574](https://github.com/npm/cli/pull/7574) use @npmcli/package-json to parse local package (@wraithgar)

### Dependencies

* [`04d6910`](https://github.com/npm/cli/commit/04d6910e474003762b4606837960b4eb10d7bcd9) [#7574](https://github.com/npm/cli/pull/7574) `@npmcli/package-json@5.1.1`
* [`4ef4830`](https://github.com/npm/cli/commit/4ef4830dd792c2f23d3ffc7a10f797fc4ac8e5cb) [#7574](https://github.com/npm/cli/pull/7574) remove read-package-json-fast

## [8.3.3](https://github.com/npm/cli/compare/config-v8.3.2...config-v8.3.3) (2024-05-29)

### Bug Fixes

* [`2d1d8d0`](https://github.com/npm/cli/commit/2d1d8d0ef18a10ac7938380884745f1d3c3cb078) [#7559](https://github.com/npm/cli/pull/7559) adds `node:` specifier to all native node modules (#7559) (@reggi)

### Documentation

* [`fd6479f`](https://github.com/npm/cli/commit/fd6479f85b9cf14a23cb4f9a049e0ea68632d8e9) [#7560](https://github.com/npm/cli/pull/7560) update publish docs: dist-tag + publish case (#7560) (@davidlj95)

## [8.3.2](https://github.com/npm/cli/compare/config-v8.3.1...config-v8.3.2) (2024-05-15)

### Bug Fixes

* [`12f103c`](https://github.com/npm/cli/commit/12f103ce55ed21c9c04f87a101fb64d55ac02d3c) [#7533](https://github.com/npm/cli/pull/7533) add first param titles to logs where missing (#7533) (@lukekarrys)
* [`6f64148`](https://github.com/npm/cli/commit/6f6414829fd82704233fbb56375b167495a0aaf5) require stdout to be a TTY for progress (#7507) (@lukekarrys)

### Dependencies

* [`e71f541`](https://github.com/npm/cli/commit/e71f541b020de7940faccffab68d0255c4079e1a) [#7480](https://github.com/npm/cli/pull/7480) `nopt@7.2.1`

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

## [8.3.1](https://github.com/npm/cli/compare/config-v8.3.0...config-v8.3.1) (2024-04-30)

### Bug Fixes

* [`3ec86a0`](https://github.com/npm/cli/commit/3ec86a0e258b1d5f5182f0093adf43c54e82578e) [#7456](https://github.com/npm/cli/pull/7456) linting: no-unused-vars (#7456) (@wraithgar)
* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

## [8.3.0](https://github.com/npm/cli/compare/config-v8.2.2...config-v8.3.0) (2024-04-25)

### Features

* [`9123de4`](https://github.com/npm/cli/commit/9123de4d282bfd19ea17ad613f5a2acab0e0e162) [#7373](https://github.com/npm/cli/pull/7373) do all ouput over proc-log events (@lukekarrys)

### Bug Fixes

* [`03634be`](https://github.com/npm/cli/commit/03634be50fd1159e42f73ef4aa71bf5f06eb5ada) [#7403](https://github.com/npm/cli/pull/7403) remove granular config timers (@lukekarrys)
* [`78447d7`](https://github.com/npm/cli/commit/78447d7a35fab870456ba66eee408b2baddca23e) [#7399](https://github.com/npm/cli/pull/7399) prefer fs/promises over promisify (#7399) (@lukekarrys)
* [`6512112`](https://github.com/npm/cli/commit/65121122d99855541f63aa787f8ee8bb4eea4a3f) [#7378](https://github.com/npm/cli/pull/7378) use proc-log for all timers (@lukekarrys)

### Dependencies

* [`fc6e291`](https://github.com/npm/cli/commit/fc6e291e9c2154c2e76636cb7ebf0a17be307585) [#7392](https://github.com/npm/cli/pull/7392) `proc-log@4.2.0` (#7392)
* [`7678a3d`](https://github.com/npm/cli/commit/7678a3d92835457bb402c82e4ca7ea3fa734d23b) [#7378](https://github.com/npm/cli/pull/7378) `proc-log@4.1.0`
* [`79f79c7`](https://github.com/npm/cli/commit/79f79c7460be8a74f2b77c647100bcefd89b2efa) [#7373](https://github.com/npm/cli/pull/7373) `proc-log@4.0.0`
* [`9027266`](https://github.com/npm/cli/commit/90272661b16d861a5926af8ec394d32ec0f307fd) [#7373](https://github.com/npm/cli/pull/7373) `pacote@18.0.0`

## [8.2.2](https://github.com/npm/cli/compare/config-v8.2.1...config-v8.2.2) (2024-04-10)

### Bug Fixes

* [`3760dd2`](https://github.com/npm/cli/commit/3760dd275aaa53cd2cee92e6a7b90aaf62f663cf) [#7361](https://github.com/npm/cli/pull/7361) perf: do less work loading config (#7361) (@wraithgar)
* [`5a28a29`](https://github.com/npm/cli/commit/5a28a29799aac2c89b4e7a3d5c1d1d880346b743) [#7352](https://github.com/npm/cli/pull/7352) perf: lazy load workspace dependency (#7352) (@H4ad)

## [8.2.1](https://github.com/npm/cli/compare/config-v8.2.0...config-v8.2.1) (2024-04-03)

### Dependencies

* [`b048592`](https://github.com/npm/cli/commit/b048592a9583dca6f75a9c837edee57ab4e12ab0) [#7329](https://github.com/npm/cli/pull/7329) `ini@4.1.2`

## [8.2.0](https://github.com/npm/cli/compare/config-v8.1.0...config-v8.2.0) (2024-02-28)

### Features

* [`4f3ddbb`](https://github.com/npm/cli/commit/4f3ddbbe88df7c94d1e06e660928a962e973f332) [#5966](https://github.com/npm/cli/pull/5966) add --expect-entries to `npm query` (@wraithgar)

### Bug Fixes

* [`818957c`](https://github.com/npm/cli/commit/818957c0f88c859bf3ea90ff440ec5d9d9e990b9) [#7158](https://github.com/npm/cli/pull/7158) pack, publish: default foreground-scripts to true (#7158) (@ljharb)

## [8.1.0](https://github.com/npm/cli/compare/config-v8.0.3...config-v8.1.0) (2024-01-10)

### Features

* [`6673c77`](https://github.com/npm/cli/commit/6673c77bc4222d0f1719449fe903b7461b3e6907) [#6914](https://github.com/npm/cli/pull/6914) add `--libc` option to override platform specific install (#6914) (@wraithgar, @Brooooooklyn)

## [8.0.3](https://github.com/npm/cli/compare/config-v8.0.2...config-v8.0.3) (2023-12-06)

### Bug Fixes

* [`bc7f53d`](https://github.com/npm/cli/commit/bc7f53db793d362d2015d3e55ce121e6b4d3d91f) [#7036](https://github.com/npm/cli/pull/7036) reverse direction of SPDX SBOM dependency rels (#7036) (@bdehamer, @antonbauhofer)

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)

## [8.0.2](https://github.com/npm/cli/compare/config-v8.0.1...config-v8.0.2) (2023-11-14)

### Dependencies

* [`cd0c649`](https://github.com/npm/cli/commit/cd0c649ec2b421b59012854e61788a11a77194f2) [#6994](https://github.com/npm/cli/pull/6994) `ci-info@4.0.0`

## [8.0.1](https://github.com/npm/cli/compare/config-v8.0.0...config-v8.0.1) (2023-10-18)

### Bug Fixes

* [`8423d4f`](https://github.com/npm/cli/commit/8423d4f133a40c8ceb0e1a75d23aa95fbf4f5b65) [#6895](https://github.com/npm/cli/pull/6895) delete auth from proper location on logout (@wraithgar)

### Documentation

* [`92cd4ad`](https://github.com/npm/cli/commit/92cd4ad02bb2b802333a4d22ffd90a27e7fc4325) [#6913](https://github.com/npm/cli/pull/6913) added footnote about clearing argv (#6913) (@wesleytodd)
* [`5508fe1`](https://github.com/npm/cli/commit/5508fe13531dced504054957a011419864ae8c0c) [#6911](https://github.com/npm/cli/pull/6911) update readme example (#6911) (@wesleytodd)

## [8.0.0](https://github.com/npm/cli/compare/config-v7.2.0...config-v8.0.0) (2023-10-02)

### ⚠️ BREAKING CHANGES

* @npmcli/config now supports node ^16.14.0 || >=18.0.0

### Features

* [`7c459d2`](https://github.com/npm/cli/commit/7c459d28ca987264028d4d2ca21b0825493c1537) [#6801](https://github.com/npm/cli/pull/6801) add npm sbom command (#6801) (@bdehamer)

### Bug Fixes

* [`92e3f3f`](https://github.com/npm/cli/commit/92e3f3fccc4ed4ed0869731c3ef23f1fa7fa6b1d) [#6807](https://github.com/npm/cli/pull/6807) set engines to ^16.14.0 || >=18.0.0 (@lukekarrys)

### Documentation

* [`03912db`](https://github.com/npm/cli/commit/03912dbaeb92559270ab3f7df75b507b2f35a119) [#6819](https://github.com/npm/cli/pull/6819) add init-specific params to init docs/help (#6819) (@wraithgar)

## [7.2.0](https://github.com/npm/cli/compare/config-v7.1.0...config-v7.2.0) (2023-09-08)

### Features

* [`1c93c44`](https://github.com/npm/cli/commit/1c93c4430300e3b3bd2cb5bab327c1732f470bca) [#6755](https://github.com/npm/cli/pull/6755) Add `--cpu` and `--os` option to override platform specific install  (#6755) (@yukukotani)

### Bug Fixes

* [`7bf2374`](https://github.com/npm/cli/commit/7bf2374a1dde0e9b4a4345eeaafb23316a9a5a0b) [#6762](https://github.com/npm/cli/pull/6762) make `$npm_execpath` always point to npm (@rotu)

## [7.1.0](https://github.com/npm/cli/compare/config-v7.0.1...config-v7.1.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

## [7.0.1](https://github.com/npm/cli/compare/config-v7.0.0...config-v7.0.1) (2023-08-31)

### Bug Fixes

* [`ed9a461`](https://github.com/npm/cli/commit/ed9a4610facc39a629d4830553fd7779d28ccbed) [#6685](https://github.com/npm/cli/pull/6685) prefix in .npmrc error log (#6685) (@rahulio96, @AaronHamilton965)

## [7.0.0](https://github.com/npm/cli/compare/config-v6.2.1...config-v7.0.0) (2023-07-26)

### ⚠️ BREAKING CHANGES

* the "ci-name" config has been removed
* the hard-coded "hashAlgorithm" value is no longer being passed through flatOptions
* the unused "tmp" config has been removed
* the hard-coded "metrics-registry" config has been removed.

### Bug Fixes

* [`e0d3edd`](https://github.com/npm/cli/commit/e0d3edd9908f8303abb9941bdd2f6e9aa31bc9d7) [#6641](https://github.com/npm/cli/pull/6641) remove "ci-name" config (@wraithgar)
* [`db91a77`](https://github.com/npm/cli/commit/db91a77032f4024878d56bde099b2b3765ff08d2) [#6641](https://github.com/npm/cli/pull/6641) remove "hashAlgorithm" from flatOptions (@wraithgar)
* [`ece52a3`](https://github.com/npm/cli/commit/ece52a3dda09b1df960ae042d53560f18d446d5f) [#6641](https://github.com/npm/cli/pull/6641) remove "tmp" config (@wraithgar)
* [`1f767aa`](https://github.com/npm/cli/commit/1f767aa306e3a550e2c0aefb16a0370e59b44ce3) [#6641](https://github.com/npm/cli/pull/6641) remove metric-registry config (@wraithgar)

## [6.2.1](https://github.com/npm/cli/compare/config-v6.2.0...config-v6.2.1) (2023-06-21)

### Bug Fixes

* [`e722439`](https://github.com/npm/cli/commit/e722439b05bb4da691975359db58eac794f1f5d9) [#6497](https://github.com/npm/cli/pull/6497) move all definitions to @npmcli/config package (@lukekarrys)

## [6.2.0](https://github.com/npm/cli/compare/config-v6.1.7...config-v6.2.0) (2023-05-31)

### Features

* [`a63a6d8`](https://github.com/npm/cli/commit/a63a6d8d6fd339d504ab94c0364ce7ee3d4e3775) [#6490](https://github.com/npm/cli/pull/6490) add provenanceFile option for libnpmpublish (@bdehamer)
* [`2a8f4f2`](https://github.com/npm/cli/commit/2a8f4f203a47f60cc96312934927419a7d83c2f1) [#6490](https://github.com/npm/cli/pull/6490) add new exclusive config item publish-file (@wraithgar)

## [6.1.7](https://github.com/npm/cli/compare/config-v6.1.6...config-v6.1.7) (2023-05-17)

### Bug Fixes

* [`7ade93d`](https://github.com/npm/cli/commit/7ade93d299bfc908e5428f572bc7b502d5fe9eea) [#6443](https://github.com/npm/cli/pull/6443) Remove duplicates in config warnings (#6443) (@kashyapkaki)

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
