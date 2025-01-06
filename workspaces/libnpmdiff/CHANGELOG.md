# Changelog

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.4): `@npmcli/arborist@7.5.4`

## [8.0.0](https://github.com/npm/cli/compare/libnpmdiff-v8.0.0-pre.1...libnpmdiff-v8.0.0) (2024-12-16)
### Features
* [`a7bfc6d`](https://github.com/npm/cli/commit/a7bfc6df76882996ebb834dbca785fdf33b8c50d) [#7972](https://github.com/npm/cli/pull/7972) trigger release process (#7972) (@wraithgar)
### Chores
* [`a07f4e0`](https://github.com/npm/cli/commit/a07f4e0d921f640be6aa87736debd550ec478f89) [#7976](https://github.com/npm/cli/pull/7976) `@npmcli/template-oss@4.23.6` (@wraithgar)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0): `@npmcli/arborist@9.0.0`

## [8.0.0-pre.1](https://github.com/npm/cli/compare/libnpmdiff-v8.0.0-pre.0...libnpmdiff-v8.0.0-pre.1) (2024-12-06)
### ⚠️ BREAKING CHANGES
* `bun.lockb` files are now included in the strict ignore list during packing
### Dependencies
* [`ac8eb39`](https://github.com/npm/cli/commit/ac8eb390b0e0a21346fcdc5476ee0b884278b3a9) [#7955](https://github.com/npm/cli/pull/7955) `diff@7.0.0`
* [`c0bcc2a`](https://github.com/npm/cli/commit/c0bcc2a860fec5c86234dec44f5474364c25aefc) [#7955](https://github.com/npm/cli/pull/7955) `walk-up-path@4.0.0`
* [`ca84b22`](https://github.com/npm/cli/commit/ca84b22a18806495c37ef6ee2aecd42a1c7bb7f6) [#7945](https://github.com/npm/cli/pull/7945) `pacote@21.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0-pre.1): `@npmcli/arborist@9.0.0-pre.1`

## [8.0.0-pre.0](https://github.com/npm/cli/compare/libnpmdiff-v7.0.0...libnpmdiff-v8.0.0-pre.0) (2024-11-26)
### ⚠️ BREAKING CHANGES
* libnpmdiff now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`dab3042`](https://github.com/npm/cli/commit/dab304274805ac64a0cb063eb21fa7d26fb5c1ce) [#7831](https://github.com/npm/cli/pull/7831) for libnpmdiff sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
### Dependencies
* [`7dbef6f`](https://github.com/npm/cli/commit/7dbef6f3a3ead089b1b8b9fe6b2fa25e24309000) [#7850](https://github.com/npm/cli/pull/7850) `pacote@20.0.0`
### Chores
* [`6edfe2f`](https://github.com/npm/cli/commit/6edfe2f3a45169b6d194ccd8d366bb8d0e09b4a5) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/template-oss@4.23.5` (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0-pre.0): `@npmcli/arborist@9.0.0-pre.0`

## [7.0.0](https://github.com/npm/cli/compare/libnpmdiff-v6.1.4...libnpmdiff-v7.0.0) (2024-10-03)
### ⚠️ BREAKING CHANGES
* `libnpmdiff` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`340a330`](https://github.com/npm/cli/commit/340a330a312ec784c100637fb3ff064a3fd68c56) [#7803](https://github.com/npm/cli/pull/7803) align libnpmdiff to npm 10 node engine range (@reggi)
### Dependencies
* [`820e983`](https://github.com/npm/cli/commit/820e983b1d5a82d6c9c10895487c2e43b423d6ef) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/installed-package-contents@3.0.0`
* [`e7ab206`](https://github.com/npm/cli/commit/e7ab206370e5fc62fefe6916e5dcc40b3e577d22) [#7803](https://github.com/npm/cli/pull/7803) update `pacote@19.0.0`
* [`50a7bc8`](https://github.com/npm/cli/commit/50a7bc8737bb4e0a8fbc5f00b8f580512153a5bc) [#7803](https://github.com/npm/cli/pull/7803) update `npm-package-arg@12.0.0`
### Chores
* [`2072705`](https://github.com/npm/cli/commit/2072705aa80d009dc077639adc305692f4a6c0b9) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/eslint-config@5.0.1` (@reggi)
* [`8035725`](https://github.com/npm/cli/commit/80357253ecd8483463cd66c783c4464c330d72df) [#7756](https://github.com/npm/cli/pull/7756) `@npmcli/template-oss@4.23.3` (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v8.0.0): `@npmcli/arborist@8.0.0`

## [6.1.3](https://github.com/npm/cli/compare/libnpmdiff-v6.1.2...libnpmdiff-v6.1.3) (2024-05-29)

### Bug Fixes

* [`2d1d8d0`](https://github.com/npm/cli/commit/2d1d8d0ef18a10ac7938380884745f1d3c3cb078) [#7559](https://github.com/npm/cli/pull/7559) adds `node:` specifier to all native node modules (#7559) (@reggi)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.3): `@npmcli/arborist@7.5.3`

## [6.1.2](https://github.com/npm/cli/compare/libnpmdiff-v6.1.1...libnpmdiff-v6.1.2) (2024-05-15)

### Dependencies

* [`ea0b07d`](https://github.com/npm/cli/commit/ea0b07da149767265f11d5d77d2156e2c9f43e63) [#7482](https://github.com/npm/cli/pull/7482) `pacote@18.0.6`
* [`a9a6dcd`](https://github.com/npm/cli/commit/a9a6dcd4427ec82e491a2cad5672d8183e12180f) [#7480](https://github.com/npm/cli/pull/7480) `pacote@18.0.5`
## [6.1.2](https://github.com/npm/cli/compare/libnpmdiff-v6.1.1...libnpmdiff-v6.1.2) (2024-05-15)

### Dependencies

* [`ea0b07d`](https://github.com/npm/cli/commit/ea0b07da149767265f11d5d77d2156e2c9f43e63) [#7482](https://github.com/npm/cli/pull/7482) `pacote@18.0.6`
* [`a9a6dcd`](https://github.com/npm/cli/commit/a9a6dcd4427ec82e491a2cad5672d8183e12180f) [#7480](https://github.com/npm/cli/pull/7480) `pacote@18.0.5`

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

## [6.1.1](https://github.com/npm/cli/compare/libnpmdiff-v6.1.0...libnpmdiff-v6.1.1) (2024-04-30)

### Bug Fixes

* [`3ec86a0`](https://github.com/npm/cli/commit/3ec86a0e258b1d5f5182f0093adf43c54e82578e) [#7456](https://github.com/npm/cli/pull/7456) linting: no-unused-vars (#7456) (@wraithgar)
* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.1): `@npmcli/arborist@7.5.1`

## [6.1.0](https://github.com/npm/cli/compare/libnpmdiff-v6.0.9...libnpmdiff-v6.1.0) (2024-04-25)

### Features

* [`9622597`](https://github.com/npm/cli/commit/9622597399ec93224fddf90a9209a98dbcfd6b2f) [#7339](https://github.com/npm/cli/pull/7339) refactor terminal display (#7339) (@lukekarrys)

### Bug Fixes

* [`03958c3`](https://github.com/npm/cli/commit/03958c375cd8fa9ec6d84ad35b7cc5cf5e9136f6) [#7409](https://github.com/npm/cli/pull/7409) inline color selector in libnpmdiff (@wraithgar)

### Dependencies

* [`36adff3`](https://github.com/npm/cli/commit/36adff36c41f56315fe582e1e4dda29060f7fdf7) [#7408](https://github.com/npm/cli/pull/7408) `pacote@18.0.2`
* [`486d46c`](https://github.com/npm/cli/commit/486d46cd5b5678ad1ab6c23ee12cf7559477805a) [#7408](https://github.com/npm/cli/pull/7408) `@npmcli/installed-package-contents@2.1.0`
* [`b0ca163`](https://github.com/npm/cli/commit/b0ca16310d9db944dd13f80ecce534c65eea42c5) [#7409](https://github.com/npm/cli/pull/7409) remove @npmcli/disparity-colors
* [`9027266`](https://github.com/npm/cli/commit/90272661b16d861a5926af8ec394d32ec0f307fd) [#7373](https://github.com/npm/cli/pull/7373) `pacote@18.0.0`
* [`ac98fd3`](https://github.com/npm/cli/commit/ac98fd3a8514f2552555d2b8af74a52e64888797) [#7373](https://github.com/npm/cli/pull/7373) `npm-package-arg@11.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.0): `@npmcli/arborist@7.5.0`

## [6.0.9](https://github.com/npm/cli/compare/libnpmdiff-v6.0.8...libnpmdiff-v6.0.9) (2024-04-10)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.2): `@npmcli/arborist@7.4.2`

## [6.0.8](https://github.com/npm/cli/compare/libnpmdiff-v6.0.7...libnpmdiff-v6.0.8) (2024-04-03)

### Dependencies

* [`9ccff72`](https://github.com/npm/cli/commit/9ccff72c332e6062e6ebcf8123c7888d8d617091) [#7329](https://github.com/npm/cli/pull/7329) `tar@6.2.1`
* [`6fd94f2`](https://github.com/npm/cli/commit/6fd94f249f43080ae183da36b971981e8ad00882) [#7329](https://github.com/npm/cli/pull/7329) `minimatch@9.0.4`
* [`c9315cb`](https://github.com/npm/cli/commit/c9315cb240be02babbbd99585f7ef23679e1d963) [#7329](https://github.com/npm/cli/pull/7329) `binary-extensions@2.3.0`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.1): `@npmcli/arborist@7.4.1`

## [6.0.7](https://github.com/npm/cli/compare/libnpmdiff-v6.0.6...libnpmdiff-v6.0.7) (2024-02-28)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.0): `@npmcli/arborist@7.4.0`

## [6.0.6](https://github.com/npm/cli/compare/libnpmdiff-v6.0.5...libnpmdiff-v6.0.6) (2024-01-24)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.3.1): `@npmcli/arborist@7.3.1`

## [6.0.5](https://github.com/npm/cli/compare/libnpmdiff-v6.0.4...libnpmdiff-v6.0.5) (2024-01-10)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.3.0): `@npmcli/arborist@7.3.0`

## [6.0.4](https://github.com/npm/cli/compare/libnpmdiff-v6.0.3...libnpmdiff-v6.0.4) (2023-12-06)

### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.2): `@npmcli/arborist@7.2.2`

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)

## [6.0.3](https://github.com/npm/cli/compare/libnpmdiff-v6.0.2...libnpmdiff-v6.0.3) (2023-10-31)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.1): `@npmcli/arborist@7.2.1`

## [6.0.2](https://github.com/npm/cli/compare/libnpmdiff-v6.0.1...libnpmdiff-v6.0.2) (2023-10-02)

### Dependencies

* [`aa6728b`](https://github.com/npm/cli/commit/aa6728b1d003f0fc620b074ba0396a3e07f2db6a) [#6859](https://github.com/npm/cli/pull/6859) `tar@6.2.0`
* [`ce9089f`](https://github.com/npm/cli/commit/ce9089f604a01297d3d2dd544283696a6297dce5) [#6859](https://github.com/npm/cli/pull/6859) `npm-package-arg@11.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.0): `@npmcli/arborist@7.2.0`

## [6.0.1](https://github.com/npm/cli/compare/libnpmdiff-v6.0.0...libnpmdiff-v6.0.1) (2023-09-08)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.1.0): `@npmcli/arborist@7.1.0`

## [6.0.0](https://github.com/npm/cli/compare/libnpmdiff-v6.0.0-pre.0...libnpmdiff-v6.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.0.0): `@npmcli/arborist@7.0.0`

## [6.0.0-pre.0](https://github.com/npm/cli/compare/libnpmdiff-v5.0.19...libnpmdiff-v6.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`ee7292e`](https://github.com/npm/cli/commit/ee7292ed78c362927736471e0584217b2000f493) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)

### Dependencies

* [`f334466`](https://github.com/npm/cli/commit/f334466c53669e7debd4b9c67eafca74955509ee) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.4`
* [`43831d0`](https://github.com/npm/cli/commit/43831d0fe4b02cb18d1c533f2831aaeedf5102e1) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.3`
* [`44e8fec`](https://github.com/npm/cli/commit/44e8fec3f28ce3bdd0500b92cbcf8f211da3c866) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.2`
* [`81ff4df`](https://github.com/npm/cli/commit/81ff4dfd17024efb068816c9b0824ffc709a7cc4) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.1`
* [`cac0725`](https://github.com/npm/cli/commit/cac07256e7234d0782a4833dae207732c71fef95) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.0`
* [`c784b57`](https://github.com/npm/cli/commit/c784b57b654d25e8d932e6fe415b87e75dcf9026) [#6706](https://github.com/npm/cli/pull/6706) `npm-package-arg@11.0.0`
* [`edbc25a`](https://github.com/npm/cli/commit/edbc25a5980c34e0d28aac7503475cd33e07f7d2) [#6706](https://github.com/npm/cli/pull/6706) `pacote@16.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.0.0-pre.0): `@npmcli/arborist@7.0.0-pre.0`

## [5.0.19](https://github.com/npm/cli/compare/libnpmdiff-v5.0.18...libnpmdiff-v5.0.19) (2023-07-05)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.3.0): `@npmcli/arborist@6.3.0`

## [5.0.18](https://github.com/npm/cli/compare/libnpmdiff-v5.0.17...libnpmdiff-v5.0.18) (2023-06-21)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.10): `@npmcli/arborist@6.2.10`

## [5.0.17](https://github.com/npm/cli/compare/libnpmdiff-v5.0.16...libnpmdiff-v5.0.17) (2023-05-03)

### Dependencies

* [`e498f82`](https://github.com/npm/cli/commit/e498f82852e49f638dc661d89785df7d6112fb76) [#6416](https://github.com/npm/cli/pull/6416) `minimatch@9.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.9): `@npmcli/arborist@6.2.9`

## [5.0.16](https://github.com/npm/cli/compare/libnpmdiff-v5.0.15...libnpmdiff-v5.0.16) (2023-04-19)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.8): `@npmcli/arborist@6.2.8`

## [5.0.15](https://github.com/npm/cli/compare/libnpmdiff-v5.0.14...libnpmdiff-v5.0.15) (2023-04-05)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.7): `@npmcli/arborist@6.2.7`

## [5.0.14](https://github.com/npm/cli/compare/libnpmdiff-v5.0.13...libnpmdiff-v5.0.14) (2023-03-30)

### Dependencies

* [`ea12627`](https://github.com/npm/cli/commit/ea12627ec8f3455ada2b011bc6ff84980b2a5b30) [#6275](https://github.com/npm/cli/pull/6275) `minimatch@7.4.2`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.6): `@npmcli/arborist@6.2.6`

## [5.0.13](https://github.com/npm/cli/compare/libnpmdiff-v5.0.12...libnpmdiff-v5.0.13) (2023-03-08)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.5): `@npmcli/arborist@6.2.5`

## [5.0.12](https://github.com/npm/cli/compare/libnpmdiff-v5.0.11...libnpmdiff-v5.0.12) (2023-03-02)

### Dependencies

* [`71ae406`](https://github.com/npm/cli/commit/71ae4067bccef53aa99ccf8abbe9115daaae8e8c) [#6218](https://github.com/npm/cli/pull/6218) `@npmcli/installed-package-contents@2.0.2`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.4): `@npmcli/arborist@6.2.4`

## [5.0.11](https://github.com/npm/cli/compare/libnpmdiff-v5.0.10...libnpmdiff-v5.0.11) (2023-02-22)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.3): `@npmcli/arborist@6.2.3`

## [5.0.10](https://github.com/npm/cli/compare/libnpmdiff-v5.0.9...libnpmdiff-v5.0.10) (2023-02-07)

### Bug Fixes

* [`12ec7ee`](https://github.com/npm/cli/commit/12ec7ee1983876565445ae7967e2f14f3d95e356) remove unused package.json scripts (@lukekarrys)

### Dependencies

* [`99457f1`](https://github.com/npm/cli/commit/99457f1f48d57f913b398e25f4e5da066af71204) `minimatch@6.1.6`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.2): `@npmcli/arborist@6.2.2`

## [5.0.9](https://github.com/npm/cli/compare/libnpmdiff-v5.0.8...libnpmdiff-v5.0.9) (2023-02-01)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`6e4a649`](https://github.com/npm/cli/commit/6e4a64976dc9a359b97413cd725e93caa1f0fc28) `pacote@15.0.8`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.1): `@npmcli/arborist@6.2.1`

## [5.0.8](https://github.com/npm/cli/compare/libnpmdiff-v5.0.7...libnpmdiff-v5.0.8) (2023-01-25)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.2.0): `@npmcli/arborist@6.2.0`

## [5.0.7](https://github.com/npm/cli/compare/libnpmdiff-v5.0.6...libnpmdiff-v5.0.7) (2023-01-12)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.1.6): `@npmcli/arborist@6.1.6`

## [5.0.6](https://github.com/npm/cli/compare/libnpmdiff-v5.0.5...libnpmdiff-v5.0.6) (2022-12-07)

### Dependencies

* [`372d158`](https://github.com/npm/cli/commit/372d158d2637120600a95abee64355ed1cb6f990) [#5935](https://github.com/npm/cli/pull/5935) `minimatch@5.1.1` (#5935)
* [`0a3fe00`](https://github.com/npm/cli/commit/0a3fe000e2723ae6fdb8b1d3154fd3835057c992) [#5933](https://github.com/npm/cli/pull/5933) `minipass@4.0.0`
* [`6b77340`](https://github.com/npm/cli/commit/6b7734009ecd939fbb3d382cb92eb0cdbec7dcd3) `tar@6.1.13`
* [`3da9a1a`](https://github.com/npm/cli/commit/3da9a1a4ebcf1779035b5f9ae985c087f617efe3) `pacote@15.0.7`
* [`875bd56`](https://github.com/npm/cli/commit/875bd56c33ca5eef80c2a50a11808445f2a39a2a) `npm-package-arg@10.1.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v6.1.5): `@npmcli/arborist@6.1.5`

## [5.0.5](https://github.com/npm/cli/compare/libnpmdiff-v5.0.4...libnpmdiff-v5.0.5) (2022-11-30)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.1.3...arborist-v6.1.4): `@npmcli/arborist@6.1.4`

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
