# Changelog

## [10.0.0](https://github.com/npm/cli/compare/libnpmexec-v10.0.0-pre.1...libnpmexec-v10.0.0) (2024-12-16)
### Features
* [`a7bfc6d`](https://github.com/npm/cli/commit/a7bfc6df76882996ebb834dbca785fdf33b8c50d) [#7972](https://github.com/npm/cli/pull/7972) trigger release process (#7972) (@wraithgar)
### Chores
* [`a07f4e0`](https://github.com/npm/cli/commit/a07f4e0d921f640be6aa87736debd550ec478f89) [#7976](https://github.com/npm/cli/pull/7976) `@npmcli/template-oss@4.23.6` (@wraithgar)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0): `@npmcli/arborist@9.0.0`

## [10.0.0-pre.1](https://github.com/npm/cli/compare/libnpmexec-v10.0.0-pre.0...libnpmexec-v10.0.0-pre.1) (2024-12-06)
### ⚠️ BREAKING CHANGES
* `bun.lockb` files are now included in the strict ignore list during packing
### Dependencies
* [`c0bcc2a`](https://github.com/npm/cli/commit/c0bcc2a860fec5c86234dec44f5474364c25aefc) [#7955](https://github.com/npm/cli/pull/7955) `walk-up-path@4.0.0`
* [`ca84b22`](https://github.com/npm/cli/commit/ca84b22a18806495c37ef6ee2aecd42a1c7bb7f6) [#7945](https://github.com/npm/cli/pull/7945) `pacote@21.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0-pre.1): `@npmcli/arborist@9.0.0-pre.1`

## [10.0.0-pre.0](https://github.com/npm/cli/compare/libnpmexec-v9.0.0...libnpmexec-v10.0.0-pre.0) (2024-11-26)
### ⚠️ BREAKING CHANGES
* libnpmexec now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`7f541e8`](https://github.com/npm/cli/commit/7f541e82a0b2908cc0cfef9a36b714eeab40c029) [#7815](https://github.com/npm/cli/pull/7815) make pack and exec work with git hash refs (#7815) (@milaninfy)
* [`2902d4c`](https://github.com/npm/cli/commit/2902d4cfd363eac1dd011e90bd9a1b156852155c) [#7831](https://github.com/npm/cli/pull/7831) for libnpmexec sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
### Dependencies
* [`7dbef6f`](https://github.com/npm/cli/commit/7dbef6f3a3ead089b1b8b9fe6b2fa25e24309000) [#7850](https://github.com/npm/cli/pull/7850) `pacote@20.0.0`
### Chores
* [`6edfe2f`](https://github.com/npm/cli/commit/6edfe2f3a45169b6d194ccd8d366bb8d0e09b4a5) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/template-oss@4.23.5` (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0-pre.0): `@npmcli/arborist@9.0.0-pre.0`

## [9.0.0](https://github.com/npm/cli/compare/libnpmexec-v8.1.4...libnpmexec-v9.0.0) (2024-10-03)
### ⚠️ BREAKING CHANGES
* `libnpmexec` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`a2c8016`](https://github.com/npm/cli/commit/a2c80166e02a79402fb7bbb629f8ecc14ff8b546) [#7803](https://github.com/npm/cli/pull/7803) align libnpmexec to npm 10 node engine range (@reggi)
### Dependencies
* [`99ccae3`](https://github.com/npm/cli/commit/99ccae3ded6f7013b26ed268a208c24473cdeb8f) [#7803](https://github.com/npm/cli/pull/7803) update `bin-links@5.0.0`
* [`9cd6603`](https://github.com/npm/cli/commit/9cd66031ebd2e9a0d6fdee3a7b4d7779694306ff) [#7803](https://github.com/npm/cli/pull/7803) update `read-package-json-fast@4.0.0`
* [`8b7dbc8`](https://github.com/npm/cli/commit/8b7dbc8234914352b2649f56c6a11765f1904e30) [#7803](https://github.com/npm/cli/pull/7803) update `read@4.0.0`
* [`f6909a0`](https://github.com/npm/cli/commit/f6909a022c9373c85d980c96a30f47a3a65aa4a9) [#7803](https://github.com/npm/cli/pull/7803) update `proc-log@5.0.0`
* [`e7ab206`](https://github.com/npm/cli/commit/e7ab206370e5fc62fefe6916e5dcc40b3e577d22) [#7803](https://github.com/npm/cli/pull/7803) update `pacote@19.0.0`
* [`50a7bc8`](https://github.com/npm/cli/commit/50a7bc8737bb4e0a8fbc5f00b8f580512153a5bc) [#7803](https://github.com/npm/cli/pull/7803) update `npm-package-arg@12.0.0`
* [`538a4cc`](https://github.com/npm/cli/commit/538a4cc1dd731a3643ab4477fe545db39997bcdf) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/run-script@9.0.1`
### Chores
* [`2072705`](https://github.com/npm/cli/commit/2072705aa80d009dc077639adc305692f4a6c0b9) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/eslint-config@5.0.1` (@reggi)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v8.0.0): `@npmcli/arborist@8.0.0`

## [8.1.4](https://github.com/npm/cli/compare/libnpmexec-v8.1.3...libnpmexec-v8.1.4) (2024-08-28)
### Bug Fixes
* [`9214be9`](https://github.com/npm/cli/commit/9214be9ed8779493e00d193e36a930918a30be64) [#7640](https://github.com/npm/cli/pull/7640) gracefully handle nonexistent global installation directory (#7640) (@milaninfy)
### Chores
* [`8035725`](https://github.com/npm/cli/commit/80357253ecd8483463cd66c783c4464c330d72df) [#7756](https://github.com/npm/cli/pull/7756) `@npmcli/template-oss@4.23.3` (@wraithgar)

## [8.1.3](https://github.com/npm/cli/compare/libnpmexec-v8.1.2...libnpmexec-v8.1.3) (2024-07-09)

### Bug Fixes

* [`71c6848`](https://github.com/npm/cli/commit/71c6848acd97f00c84b07ee1a80d92a053d405b5) [#7587](https://github.com/npm/cli/pull/7587) exec: npx to run specified version if multiple version exist globally  (#7587) (@milaninfy)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.4): `@npmcli/arborist@7.5.4`

## [8.1.2](https://github.com/npm/cli/compare/libnpmexec-v8.1.1...libnpmexec-v8.1.2) (2024-05-29)

### Bug Fixes

* [`6b55646`](https://github.com/npm/cli/commit/6b556468f9d6ed62c681954bfe6ad012315e3b53) [#7569](https://github.com/npm/cli/pull/7569) exec: look in workspace and root for bin entries (#7569) (@wraithgar)
* [`2d1d8d0`](https://github.com/npm/cli/commit/2d1d8d0ef18a10ac7938380884745f1d3c3cb078) [#7559](https://github.com/npm/cli/pull/7559) adds `node:` specifier to all native node modules (#7559) (@reggi)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.3): `@npmcli/arborist@7.5.3`

## [8.1.1](https://github.com/npm/cli/compare/libnpmexec-v8.1.0...libnpmexec-v8.1.1) (2024-05-15)

### Dependencies

* [`ea0b07d`](https://github.com/npm/cli/commit/ea0b07da149767265f11d5d77d2156e2c9f43e63) [#7482](https://github.com/npm/cli/pull/7482) `pacote@18.0.6`
* [`a9a6dcd`](https://github.com/npm/cli/commit/a9a6dcd4427ec82e491a2cad5672d8183e12180f) [#7480](https://github.com/npm/cli/pull/7480) `pacote@18.0.5`
* [`43331e4`](https://github.com/npm/cli/commit/43331e4d0647c3af4cc2aa3db8b47d797584a6d8) [#7480](https://github.com/npm/cli/pull/7480) `bin-links@4.0.4`
## [8.1.1](https://github.com/npm/cli/compare/libnpmexec-v8.1.0...libnpmexec-v8.1.1) (2024-05-15)

### Dependencies

* [`ea0b07d`](https://github.com/npm/cli/commit/ea0b07da149767265f11d5d77d2156e2c9f43e63) [#7482](https://github.com/npm/cli/pull/7482) `pacote@18.0.6`
* [`a9a6dcd`](https://github.com/npm/cli/commit/a9a6dcd4427ec82e491a2cad5672d8183e12180f) [#7480](https://github.com/npm/cli/pull/7480) `pacote@18.0.5`
* [`43331e4`](https://github.com/npm/cli/commit/43331e4d0647c3af4cc2aa3db8b47d797584a6d8) [#7480](https://github.com/npm/cli/pull/7480) `bin-links@4.0.4`

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

## [8.1.0](https://github.com/npm/cli/compare/libnpmexec-v8.0.0...libnpmexec-v8.1.0) (2024-04-30)

### Features

* [`7e349f4`](https://github.com/npm/cli/commit/7e349f45363bb8dbe1cc803f8b48befc01aae7fd) [#7432](https://github.com/npm/cli/pull/7432) add spinner (#7432) (@lukekarrys)

### Bug Fixes

* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

### Dependencies

* [`9da5738`](https://github.com/npm/cli/commit/9da57388ebd5c643c2a95bbf63abc745cad45ccc) [#7437](https://github.com/npm/cli/pull/7437) `@npmcli/run-script@8.1.0` (#7437)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.1): `@npmcli/arborist@7.5.1`

## [8.0.0](https://github.com/npm/cli/compare/libnpmexec-v7.0.10...libnpmexec-v8.0.0) (2024-04-25)

### ⚠️ BREAKING CHANGES

* libnpmexec now emits an output event on process instead of invoking the output function passed in

### Features

* [`39e4da0`](https://github.com/npm/cli/commit/39e4da0358ce44858117921b2aabe271ebcee797) [#7373](https://github.com/npm/cli/pull/7373) libnpmexec: no longer accept output function (@lukekarrys)
* [`9622597`](https://github.com/npm/cli/commit/9622597399ec93224fddf90a9209a98dbcfd6b2f) [#7339](https://github.com/npm/cli/pull/7339) refactor terminal display (#7339) (@lukekarrys)

### Dependencies

* [`36adff3`](https://github.com/npm/cli/commit/36adff36c41f56315fe582e1e4dda29060f7fdf7) [#7408](https://github.com/npm/cli/pull/7408) `pacote@18.0.2`
* [`fc6e291`](https://github.com/npm/cli/commit/fc6e291e9c2154c2e76636cb7ebf0a17be307585) [#7392](https://github.com/npm/cli/pull/7392) `proc-log@4.2.0` (#7392)
* [`7678a3d`](https://github.com/npm/cli/commit/7678a3d92835457bb402c82e4ca7ea3fa734d23b) [#7378](https://github.com/npm/cli/pull/7378) `proc-log@4.1.0`
* [`b8f8b41`](https://github.com/npm/cli/commit/b8f8b414d8ad9635e3efedc6e491c8c6e3df0973) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/run-script@8.0.0`
* [`79f79c7`](https://github.com/npm/cli/commit/79f79c7460be8a74f2b77c647100bcefd89b2efa) [#7373](https://github.com/npm/cli/pull/7373) `proc-log@4.0.0`
* [`9027266`](https://github.com/npm/cli/commit/90272661b16d861a5926af8ec394d32ec0f307fd) [#7373](https://github.com/npm/cli/pull/7373) `pacote@18.0.0`
* [`ac98fd3`](https://github.com/npm/cli/commit/ac98fd3a8514f2552555d2b8af74a52e64888797) [#7373](https://github.com/npm/cli/pull/7373) `npm-package-arg@11.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.0): `@npmcli/arborist@7.5.0`

## [7.0.10](https://github.com/npm/cli/compare/libnpmexec-v7.0.9...libnpmexec-v7.0.10) (2024-04-10)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.2): `@npmcli/arborist@7.4.2`

## [7.0.9](https://github.com/npm/cli/compare/libnpmexec-v7.0.8...libnpmexec-v7.0.9) (2024-04-03)

### Dependencies

* [`5469614`](https://github.com/npm/cli/commit/54696148f25986bcdf39e1acb5aca4bf09e7d1a0) [#7327](https://github.com/npm/cli/pull/7327) `init-package-json@6.0.2`
* [`5469614`](https://github.com/npm/cli/commit/54696148f25986bcdf39e1acb5aca4bf09e7d1a0) [#7327](https://github.com/npm/cli/pull/7327) `promzard@1.0.1`
* [`5469614`](https://github.com/npm/cli/commit/54696148f25986bcdf39e1acb5aca4bf09e7d1a0) [#7327](https://github.com/npm/cli/pull/7327) `read@3.0.1` (#7327)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.1): `@npmcli/arborist@7.4.1`

## [7.0.8](https://github.com/npm/cli/compare/libnpmexec-v7.0.7...libnpmexec-v7.0.8) (2024-02-28)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.0): `@npmcli/arborist@7.4.0`

## [7.0.7](https://github.com/npm/cli/compare/libnpmexec-v7.0.6...libnpmexec-v7.0.7) (2024-01-24)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.3.1): `@npmcli/arborist@7.3.1`

## [7.0.6](https://github.com/npm/cli/compare/libnpmexec-v7.0.5...libnpmexec-v7.0.6) (2024-01-10)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.3.0): `@npmcli/arborist@7.3.0`

## [7.0.5](https://github.com/npm/cli/compare/libnpmexec-v7.0.4...libnpmexec-v7.0.5) (2023-12-06)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.2): `@npmcli/arborist@7.2.2`

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)

## [7.0.4](https://github.com/npm/cli/compare/libnpmexec-v7.0.3...libnpmexec-v7.0.4) (2023-11-14)

### Dependencies

* [`cd0c649`](https://github.com/npm/cli/commit/cd0c649ec2b421b59012854e61788a11a77194f2) [#6994](https://github.com/npm/cli/pull/6994) `ci-info@4.0.0`

## [7.0.3](https://github.com/npm/cli/compare/libnpmexec-v7.0.2...libnpmexec-v7.0.3) (2023-10-31)

### Dependencies

* [`dfb6298`](https://github.com/npm/cli/commit/dfb6298c3eb9fb7ef452906765ac5f23ea6fec49) [#6937](https://github.com/npm/cli/pull/6937) `node-gyp@10.0.0` (#6937)
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.1): `@npmcli/arborist@7.2.1`

## [7.0.2](https://github.com/npm/cli/compare/libnpmexec-v7.0.1...libnpmexec-v7.0.2) (2023-10-02)

### Dependencies

* [`aa6728b`](https://github.com/npm/cli/commit/aa6728b1d003f0fc620b074ba0396a3e07f2db6a) [#6859](https://github.com/npm/cli/pull/6859) `tar@6.2.0`
* [`ce9089f`](https://github.com/npm/cli/commit/ce9089f604a01297d3d2dd544283696a6297dce5) [#6859](https://github.com/npm/cli/pull/6859) `npm-package-arg@11.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.0): `@npmcli/arborist@7.2.0`

## [7.0.1](https://github.com/npm/cli/compare/libnpmexec-v7.0.0...libnpmexec-v7.0.1) (2023-09-08)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.1.0): `@npmcli/arborist@7.1.0`

## [7.0.0](https://github.com/npm/cli/compare/libnpmexec-v7.0.0-pre.0...libnpmexec-v7.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.0.0): `@npmcli/arborist@7.0.0`

## [7.0.0-pre.0](https://github.com/npm/cli/compare/libnpmexec-v6.0.3...libnpmexec-v7.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`37a99eb`](https://github.com/npm/cli/commit/37a99eb98b8846ab9481cc4ebd7a7278a8bc89bd) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)

### Dependencies

* [`eb41977`](https://github.com/npm/cli/commit/eb41977c56cbac88fa7d02f88dbf630cc652471a) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.1`
* [`f334466`](https://github.com/npm/cli/commit/f334466c53669e7debd4b9c67eafca74955509ee) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.4`
* [`bb63bf9`](https://github.com/npm/cli/commit/bb63bf945b2db8f3074e7429aff6343721c55cd1) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.0`
* [`43831d0`](https://github.com/npm/cli/commit/43831d0fe4b02cb18d1c533f2831aaeedf5102e1) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.3`
* [`44e8fec`](https://github.com/npm/cli/commit/44e8fec3f28ce3bdd0500b92cbcf8f211da3c866) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.2`
* [`81ff4df`](https://github.com/npm/cli/commit/81ff4dfd17024efb068816c9b0824ffc709a7cc4) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.1`
* [`cac0725`](https://github.com/npm/cli/commit/cac07256e7234d0782a4833dae207732c71fef95) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.0`
* [`c784b57`](https://github.com/npm/cli/commit/c784b57b654d25e8d932e6fe415b87e75dcf9026) [#6706](https://github.com/npm/cli/pull/6706) `npm-package-arg@11.0.0`
* [`edbc25a`](https://github.com/npm/cli/commit/edbc25a5980c34e0d28aac7503475cd33e07f7d2) [#6706](https://github.com/npm/cli/pull/6706) `pacote@16.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.0.0-pre.0): `@npmcli/arborist@7.0.0-pre.0`

## [6.0.3](https://github.com/npm/cli/compare/libnpmexec-v6.0.2...libnpmexec-v6.0.3) (2023-07-18)

### Bug Fixes

* [`02c7ddb`](https://github.com/npm/cli/commit/02c7ddb4501682c9e84b8c1325638b7db1ca7deb) [#6642](https://github.com/npm/cli/pull/6642) much clearer npx 'canceled' error (#6642) (@rahulio96, @AaronHamilton965)

## [6.0.2](https://github.com/npm/cli/compare/libnpmexec-v6.0.1...libnpmexec-v6.0.2) (2023-07-05)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.3.0): `@npmcli/arborist@6.3.0`

## [6.0.1](https://github.com/npm/cli/compare/libnpmexec-v6.0.0...libnpmexec-v6.0.1) (2023-06-21)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.10): `@npmcli/arborist@6.2.10`

## [6.0.0](https://github.com/npm/cli/compare/libnpmexec-v5.0.17...libnpmexec-v6.0.0) (2023-05-31)

### ⚠️ BREAKING CHANGES

* require passing in chalk instance

### Features

* [`9e7f5ac`](https://github.com/npm/cli/commit/9e7f5ac5caa8a8ad710cc726744dcaadd8efb040) require passing in chalk instance (@lukekarrys)

## [5.0.17](https://github.com/npm/cli/compare/libnpmexec-v5.0.16...libnpmexec-v5.0.17) (2023-05-03)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.9): `@npmcli/arborist@6.2.9`

## [5.0.16](https://github.com/npm/cli/compare/libnpmexec-v5.0.15...libnpmexec-v5.0.16) (2023-04-19)

### Bug Fixes

* [`33dc428`](https://github.com/npm/cli/commit/33dc4285fd8c698c539faae10fe1bf76ceedb6b1) [#6374](https://github.com/npm/cli/pull/6374) account for npx package-name with no spec (@wraithgar)

### Dependencies

* [`3fa9542`](https://github.com/npm/cli/commit/3fa9542d7f3c0123cb3c49a40f6d5b7bc8d857a5) [#6363](https://github.com/npm/cli/pull/6363) `semver@7.5.0`
* [`357cc29`](https://github.com/npm/cli/commit/357cc29a335e684391c7b840019223e555919406) [#6363](https://github.com/npm/cli/pull/6363) `walk-up-path@3.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.8): `@npmcli/arborist@6.2.8`

## [5.0.15](https://github.com/npm/cli/compare/libnpmexec-v5.0.14...libnpmexec-v5.0.15) (2023-04-05)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.7): `@npmcli/arborist@6.2.7`

## [5.0.14](https://github.com/npm/cli/compare/libnpmexec-v5.0.13...libnpmexec-v5.0.14) (2023-03-30)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.6): `@npmcli/arborist@6.2.6`

## [5.0.13](https://github.com/npm/cli/compare/libnpmexec-v5.0.12...libnpmexec-v5.0.13) (2023-03-08)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.5): `@npmcli/arborist@6.2.5`

## [5.0.12](https://github.com/npm/cli/compare/libnpmexec-v5.0.11...libnpmexec-v5.0.12) (2023-03-02)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.4): `@npmcli/arborist@6.2.4`

## [5.0.11](https://github.com/npm/cli/compare/libnpmexec-v5.0.10...libnpmexec-v5.0.11) (2023-02-22)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.3): `@npmcli/arborist@6.2.3`

## [5.0.10](https://github.com/npm/cli/compare/libnpmexec-v5.0.9...libnpmexec-v5.0.10) (2023-02-07)

### Dependencies

* [`f4c8c62`](https://github.com/npm/cli/commit/f4c8c62baf532b7599e3760f959788bbda97ba0b) `init-package-json@5.0.0`
* [`10445ca`](https://github.com/npm/cli/commit/10445ca4a09df590777a9289ab1ed0f41449c85d) remove mkdirp
* [`5c84a99`](https://github.com/npm/cli/commit/5c84a99f5a141a632bd644ca97505010c2842eb2) `ci-info@3.7.1`
* [`fc5332f`](https://github.com/npm/cli/commit/fc5332f4027f3019a855f12a66e29bca1b143364) `read@2.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.2): `@npmcli/arborist@6.2.2`

## [5.0.9](https://github.com/npm/cli/compare/libnpmexec-v5.0.8...libnpmexec-v5.0.9) (2023-02-01)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`6e4a649`](https://github.com/npm/cli/commit/6e4a64976dc9a359b97413cd725e93caa1f0fc28) `pacote@15.0.8`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.1): `@npmcli/arborist@6.2.1`

## [5.0.8](https://github.com/npm/cli/compare/libnpmexec-v5.0.7...libnpmexec-v5.0.8) (2023-01-25)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.0): `@npmcli/arborist@6.2.0`

## [5.0.7](https://github.com/npm/cli/compare/libnpmexec-v5.0.6...libnpmexec-v5.0.7) (2023-01-12)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.1.6): `@npmcli/arborist@6.1.6`

## [5.0.6](https://github.com/npm/cli/compare/libnpmexec-v5.0.5...libnpmexec-v5.0.6) (2022-12-07)

### Dependencies

* [`0e6c28b`](https://github.com/npm/cli/commit/0e6c28ba093f8c5d35df98afca28e842b247004b) [#5934](https://github.com/npm/cli/pull/5934) `ci-info@3.7.0` (#5934)
* [`0a3fe00`](https://github.com/npm/cli/commit/0a3fe000e2723ae6fdb8b1d3154fd3835057c992) [#5933](https://github.com/npm/cli/pull/5933) `minipass@4.0.0`
* [`3da9a1a`](https://github.com/npm/cli/commit/3da9a1a4ebcf1779035b5f9ae985c087f617efe3) `pacote@15.0.7`
* [`875bd56`](https://github.com/npm/cli/commit/875bd56c33ca5eef80c2a50a11808445f2a39a2a) `npm-package-arg@10.1.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.1.5): `@npmcli/arborist@6.1.5`

## [5.0.5](https://github.com/npm/cli/compare/libnpmexec-v5.0.4...libnpmexec-v5.0.5) (2022-11-30)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.3...arborist-v6.1.4): `@npmcli/arborist@6.1.4`

## [5.0.4](https://github.com/npm/cli/compare/libnpmexec-v5.0.3...libnpmexec-v5.0.4) (2022-11-16)

### Bug Fixes

* [`cc0ad27`](https://github.com/npm/cli/commit/cc0ad2798a3e9d2a25e9b3ac947c0324fa8b40c1) [#5842](https://github.com/npm/cli/pull/5842) npx: properly look for local bins when there are more than one (#5842) (@wraithgar)

### Dependencies

* [`a351685`](https://github.com/npm/cli/commit/a351685c4951b1d9e2ba86bc99e3706688813438) [#5858](https://github.com/npm/cli/pull/5858) move from @npmcli/ci-detect to ci-info (#5858)
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.2...arborist-v6.1.3): `@npmcli/arborist@6.1.3`

## [5.0.3](https://github.com/npm/cli/compare/libnpmexec-v5.0.2...libnpmexec-v5.0.3) (2022-11-09)

### Bug Fixes

* [`a767aae`](https://github.com/npm/cli/commit/a767aae7148dbbc943095ba994bbfab58bf2a8be) npx: look for bins in local package.json (@wraithgar)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.1...arborist-v6.1.2): `@npmcli/arborist@6.1.2`

## [5.0.2](https://github.com/npm/cli/compare/libnpmexec-v5.0.1...libnpmexec-v5.0.2) (2022-11-02)

### Bug Fixes

* [`1f5382d`](https://github.com/npm/cli/commit/1f5382dada181cda41f1504974de1e69a6c1ad7f) [#5789](https://github.com/npm/cli/pull/5789) don't set `stdioString` for any spawn/run-script calls (@lukekarrys)

### Dependencies

* [`b89c19e`](https://github.com/npm/cli/commit/b89c19e9a7674b0bd9d336c14dee1bf381843648) [#5795](https://github.com/npm/cli/pull/5795) `cli-table3@0.6.3`
* [`9972ed1`](https://github.com/npm/cli/commit/9972ed1423d7a4f7ca03a34f5aa69321b81850fd) `@npmcli/ci-detect@3.0.1`
* [`abfb28b`](https://github.com/npm/cli/commit/abfb28b249183b8c033f8e7acc1546150cdac137) `@npmcli/run-script@6.0.0`
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.0...arborist-v6.1.1): `@npmcli/arborist@6.1.1`

## [5.0.1](https://github.com/npm/cli/compare/libnpmexec-v5.0.0...libnpmexec-v5.0.1) (2022-10-26)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0...arborist-v6.1.0): `@npmcli/arborist@6.1.0`

## [5.0.0](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.5...libnpmexec-v5.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.5...arborist-v6.0.0): `@npmcli/arborist@6.0.0`

## [5.0.0-pre.5](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.4...libnpmexec-v5.0.0-pre.5) (2022-10-19)

### ⚠️ BREAKING CHANGES

* this package no longer attempts to change file ownership automatically

### Features

* [`58065bc`](https://github.com/npm/cli/commit/58065bc679e6968742b5b15fa2fb82dd9e8ae988) [#5704](https://github.com/npm/cli/pull/5704) do not alter file ownership (@nlf)

### Bug Fixes

* [`1afe5ba`](https://github.com/npm/cli/commit/1afe5ba9647d1f0f55bf0a4bace543965d05daed) account for new npm-package-arg behavior (@wraithgar)

### Dependencies

* [`88137a3`](https://github.com/npm/cli/commit/88137a329c8ad418db265dd465768a7cf5ebccb1) `npmlog@7.0.1`
* [`2008ea6`](https://github.com/npm/cli/commit/2008ea6a807acbd97912799adfe97f276202cea6) `npm-package-arg@10.0.0`, `pacote@15.0.2`
* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.4...arborist-v6.0.0-pre.5): `@npmcli/arborist@6.0.0-pre.5`

## [5.0.0-pre.4](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.3...libnpmexec-v5.0.0-pre.4) (2022-10-05)

### Dependencies

* [`5344d2c`](https://github.com/npm/cli/commit/5344d2ca9ffd1f6db473fd58b46b50179f899ff5) [#5644](https://github.com/npm/cli/pull/5644) `pacote@14.0.0`
* [`8b072dc`](https://github.com/npm/cli/commit/8b072dc113190ed49b296a5f02650b7d8cbf384a) [#5639](https://github.com/npm/cli/pull/5639) `@npmcli/ci-detect@3.0.0` (#5639)
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.3...arborist-v6.0.0-pre.4): `@npmcli/arborist@6.0.0-pre.4`

## [5.0.0-pre.3](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.2...libnpmexec-v5.0.0-pre.3) (2022-09-30)

### ⚠️ BREAKING CHANGES

* `npm pack` now follows a strict order of operations when applying ignore rules. If a files array is present in the package.json, then rules in .gitignore and .npmignore files from the root will be ignored.

### Features

* [`3ae796d`](https://github.com/npm/cli/commit/3ae796d937bd36a5b1b9fd6e9e8473b4f2ddc32d) implement new `npm-packlist` behavior (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.2...arborist-v6.0.0-pre.3): `@npmcli/arborist@6.0.0-pre.3`

## [5.0.0-pre.2](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.1...libnpmexec-v5.0.0-pre.2) (2022-09-23)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.1...arborist-v6.0.0-pre.2): `@npmcli/arborist@6.0.0-pre.2`

## [5.0.0-pre.1](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.0...libnpmexec-v5.0.0-pre.1) (2022-09-14)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.0...arborist-v6.0.0-pre.1): `@npmcli/arborist@6.0.0-pre.1`

## [5.0.0-pre.0](https://github.com/npm/cli/compare/libnpmexec-v4.0.12...libnpmexec-v5.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @npmcli/arborist bumped from ^5.6.1 to ^6.0.0-pre.0

## [4.0.12](https://github.com/npm/cli/compare/libnpmexec-v4.0.11...libnpmexec-v4.0.12) (2022-08-31)

### Dependencies

  * [`1286f03`](https://github.com/npm/cli/commit/1286f03fe73dee9a447b13b662f0c5622ab6ec9e) [#5381](https://github.com/npm/cli/pull/5381) deps: `unique-filename@2.0.1`
  * [`7fbf6f7`](https://github.com/npm/cli/commit/7fbf6f7825f76906ecdec79ab15595f9e2f7b784) [#5381](https://github.com/npm/cli/pull/5381) deps: `bin-links@3.0.3`
  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`
* The following workspace dependencies were updated
  * dependencies
    * @npmcli/arborist bumped from ^5.0.0 to ^5.6.1

## [4.0.11](https://github.com/npm/cli/compare/libnpmexec-v4.0.10...libnpmexec-v4.0.11) (2022-08-17)


### Bug Fixes

* don't prompt on `npm exec [directory]` ([#5298](https://github.com/npm/cli/issues/5298)) ([6eba131](https://github.com/npm/cli/commit/6eba13164d84efb34554c7dddeb2dbfed063ac0a))
* npm exec does not use script-shell option to run commands ([#5297](https://github.com/npm/cli/issues/5297)) ([e5a9162](https://github.com/npm/cli/commit/e5a9162a9dae9471e1ea77ad38baa02bb8d9852e))

## [4.0.10](https://github.com/npm/cli/compare/libnpmexec-v4.0.9...libnpmexec-v4.0.10) (2022-08-10)


### Bug Fixes

* ignore global prefix if --prefix is used ([#5291](https://github.com/npm/cli/issues/5291)) ([daaf461](https://github.com/npm/cli/commit/daaf4619c85ecf62346770735cfa8e2ddecbef8b))
* look up local command bins from local tree ([#5273](https://github.com/npm/cli/issues/5273)) ([c992fd6](https://github.com/npm/cli/commit/c992fd6757505974dc8e92a9e2886d2233e098eb))
* only try to run global bin if the bin name exists ([#5253](https://github.com/npm/cli/issues/5253)) ([95ae9f2](https://github.com/npm/cli/commit/95ae9f2e2555ef592777399bf8fee5206d77f41d))

## [4.0.9](https://github.com/npm/cli/compare/libnpmexec-v4.0.8...libnpmexec-v4.0.9) (2022-08-03)


### Bug Fixes

* fix exec tests and  clean up workspace-location-msg ([3b30af2](https://github.com/npm/cli/commit/3b30af25e93665f5aa21897910a65d7f26bbd066))
* properly find and run global scoped packages ([#5250](https://github.com/npm/cli/issues/5250)) ([19a8346](https://github.com/npm/cli/commit/19a834610d154f36748536b27aed13bfdb5ee748))
* properly find locally/globally/npxCache packages ([ea44995](https://github.com/npm/cli/commit/ea449954844f21abbf984e09e421f0e03485a535))
* use binPaths ([19f1497](https://github.com/npm/cli/commit/19f1497322411f1566885bd53e63dc39f0df27ea))


### Dependencies

* @npmcli/run-script@4.2.0 ([d0be9a2](https://github.com/npm/cli/commit/d0be9a2bb53e74b30e13751afd1f6924990c8422))
* add @npmcli/fs@2.1.1 ([c18dbc4](https://github.com/npm/cli/commit/c18dbc4393491e02532d698351747307848d2e20))
* add semver@7.3.7 ([cd6bafd](https://github.com/npm/cli/commit/cd6bafdfbbd7a054709c11850b58f7dbc26eb8da))

## [4.0.8](https://github.com/npm/cli/compare/libnpmexec-v4.0.7...libnpmexec-v4.0.8) (2022-06-23)


### Dependencies

* @npmcli/run-script@4.1.3 ([#5064](https://github.com/npm/cli/issues/5064)) ([f59a114](https://github.com/npm/cli/commit/f59a114ffe3d1f86ccb2e52a4432292ab76852cc))

## [4.0.7](https://github.com/npm/cli/compare/libnpmexec-v4.0.6...libnpmexec-v4.0.7) (2022-06-22)


### Dependencies

* @npmcli/run-script@4.1.0 ([2c06cee](https://github.com/npm/cli/commit/2c06ceee82dd813c0ae84cc0b09e6941cfc5533e))
* pacote@13.6.1 ([2e50cb8](https://github.com/npm/cli/commit/2e50cb83e84cf25fee93ba0ca5a0343fbdb33c41))

### [4.0.6](https://github.com/npm/cli/compare/libnpmexec-v4.0.5...libnpmexec-v4.0.6) (2022-06-01)


### Bug Fixes

* **libnpmexec:** fix bug not install latest pkg ([#4929](https://github.com/npm/cli/issues/4929)) ([fcc72dd](https://github.com/npm/cli/commit/fcc72dd8791187f4b3d8705fb23c2744c83ef943))

### [4.0.5](https://github.com/npm/cli/compare/libnpmexec-v4.0.4...libnpmexec-v4.0.5) (2022-04-26)


### Dependencies

* npmlog@6.0.2 ([5e31322](https://github.com/npm/cli/commit/5e313223100db1207818d756b081eaba3468b273))

### [4.0.4](https://github.com/npm/cli/compare/libnpmexec-v4.0.3...libnpmexec-v4.0.4) (2022-04-19)


### Bug Fixes

* **exec:** workspaces support ([6253d19](https://github.com/npm/cli/commit/6253d1968d8390ea6b16604ff3abb5e6509349c9))
* **libnpmexec:** fix read mixed local/registry pkg ([4a46a27](https://github.com/npm/cli/commit/4a46a27f2b968e2f8c1f4821508f93013738c482))

### [4.0.3](https://github.com/npm/cli/compare/libnpmexec-v4.0.2...libnpmexec-v4.0.3) (2022-04-06)


### Bug Fixes

* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [4.0.2](https://www.github.com/npm/cli/compare/libnpmexec-v4.0.1...libnpmexec-v4.0.2) (2022-03-15)


### Dependencies

* npm-package-arg@9.0.1 ([9555a5f](https://www.github.com/npm/cli/commit/9555a5f1d135aa1b8f7374273403efe41e99ee26))
* pacote@13.0.4 ([6d31450](https://www.github.com/npm/cli/commit/6d3145014861b4198c16d7772d809fd037ece289))
* pacote@13.0.5 ([340fa51](https://www.github.com/npm/cli/commit/340fa51f423a518a96c8015a67d8f6144a2e8051))

### [4.0.1](https://www.github.com/npm/cli/compare/libnpmexec-vlibnpmexec@4.0.0...libnpmexec-v4.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## v2.0.0

- Added a new required `npxCache` option

## v1.2.0

- Added a default value to `scriptShell` option

## v1.1.0

- Add add walk up dir lookup logic to satisfy local bins,
similar to `@npmcli/run-script`

## v1.0.1

- Fix `scriptShell` option name.

## v1.0.0

- Initial implementation, moves the code that used to live in the **npm cli**,
ref: https://github.com/npm/cli/blob/release/v7.10.0/lib/exec.js into this
separate module, providing a programmatic API to the **npm exec** functionality.
