# Changelog

## [10.2.1](https://github.com/npm/cli/compare/v10.2.0...v10.2.1) (2023-10-18)

### Bug Fixes

* [`35c92fe`](https://github.com/npm/cli/commit/35c92fec3d053d303cc8057faa0ff4fe6e7cdc8a) [#6902](https://github.com/npm/cli/pull/6902) Add check to pkg command to deal with empty values (#6902) (@NeonArray)
* [`5b6172f`](https://github.com/npm/cli/commit/5b6172f01c88b73e83a75a508bbdcad92231ead5) [#6895](https://github.com/npm/cli/pull/6895) logout from custom registry (@wraithgar)
* [`8423d4f`](https://github.com/npm/cli/commit/8423d4f133a40c8ceb0e1a75d23aa95fbf4f5b65) [#6895](https://github.com/npm/cli/pull/6895) delete auth from proper location on logout (@wraithgar)
* [`0cfe9de`](https://github.com/npm/cli/commit/0cfe9de1c74b20d3e04ecc26ccf594196d101afe) [#6873](https://github.com/npm/cli/pull/6873) audit: spelling error in message (#6873) (@Fdawgs)

### Documentation

* [`5142735`](https://github.com/npm/cli/commit/5142735c462e285a7a7d9bcbd562885c6ef96c96) [#6894](https://github.com/npm/cli/pull/6894) update npm build description (#6894) (@siemhesda)
* [`2e4b4ad`](https://github.com/npm/cli/commit/2e4b4ad8bef158def1b2302846ab294fe7a83de4) [#6861](https://github.com/npm/cli/pull/6861) npm publish content modification (#6861) (@jpg619)

### Dependencies

* [`96e1637`](https://github.com/npm/cli/commit/96e1637117b6614b5ad861d86d828746d5db356c) [#6915](https://github.com/npm/cli/pull/6915) `cmd-shim@6.0.2` (#6915)
* [`b405da1`](https://github.com/npm/cli/commit/b405da1672e05d55bd22e476091891c443bcbeab) [#6899](https://github.com/npm/cli/pull/6899) `bin-links@4.0.3`
* [`ef69d36`](https://github.com/npm/cli/commit/ef69d362fa81640ac3ca60a6e01921c17f7a76cb) [#6895](https://github.com/npm/cli/pull/6895) `npm-registry-fetch@16.1.0`
* [`337c903`](https://github.com/npm/cli/commit/337c9038605b97431e06d2f470229f4370703b13) [#6882](https://github.com/npm/cli/pull/6882) `spdx-license-ids@3.0.16`
* [`e6b0be7`](https://github.com/npm/cli/commit/e6b0be7d3b3cd7f66612f9adb6c4de829335b607) [#6882](https://github.com/npm/cli/pull/6882) `socks-proxy-agent@8.0.2`
* [`ee6892e`](https://github.com/npm/cli/commit/ee6892e69079b07c0a8747d873018819a97e3877) [#6882](https://github.com/npm/cli/pull/6882) `readable-stream@4.4.2`
* [`61c3ee9`](https://github.com/npm/cli/commit/61c3ee9a073528b30676ec66fdd29788ea7be09d) [#6882](https://github.com/npm/cli/pull/6882) `minipass@7.0.4`
* [`14d31fd`](https://github.com/npm/cli/commit/14d31fdcc747f420158d254d0ac258a848bc888c) [#6882](https://github.com/npm/cli/pull/6882) `is-core-module@2.13.0`
* [`03f3d2e`](https://github.com/npm/cli/commit/03f3d2e1d13cd12f23a946cfb9065b8e8fbe129b) [#6882](https://github.com/npm/cli/pull/6882) `https-proxy-agent@7.0.2`
* [`e0163c6`](https://github.com/npm/cli/commit/e0163c6787f3877c3ad6c84d8af44378f7eed23b) [#6882](https://github.com/npm/cli/pull/6882) `are-we-there-yet@4.0.1`
* [`fca804a`](https://github.com/npm/cli/commit/fca804adec57e176bb2a2e60bf84df44e661478f) [#6882](https://github.com/npm/cli/pull/6882) `ci-info@3.9.0`
* [`6af582f`](https://github.com/npm/cli/commit/6af582f23bf046a224d5679e917977f0bb3f95e3) [#6882](https://github.com/npm/cli/pull/6882) `npm-install-checks@6.3.0`
* [Workspace](https://github.com/npm/cli/releases/tag/config-v8.0.1): `@npmcli/config@8.0.1`

## [10.2.0](https://github.com/npm/cli/compare/v10.1.0...v10.2.0) (2023-10-02)

### Features

* [`7c459d2`](https://github.com/npm/cli/commit/7c459d28ca987264028d4d2ca21b0825493c1537) [#6801](https://github.com/npm/cli/pull/6801) add npm sbom command (#6801) (@bdehamer)
* [`81a460f`](https://github.com/npm/cli/commit/81a460f6e6317aca2288d16cda591aa6541540c6) [#6732](https://github.com/npm/cli/pull/6732) add package-lock-only mode to npm query (@wraithgar)
* [`0d29855`](https://github.com/npm/cli/commit/0d2985535c9cc3dfc3e1f355580570c9cce37d61) [#6732](https://github.com/npm/cli/pull/6732) add no-package-lock mode to npm audit (@wraithgar)

### Bug Fixes

* [`2207628`](https://github.com/npm/cli/commit/22076286a46499e3d0b3f8564b7ba07008317be4) [#6823](https://github.com/npm/cli/pull/6823) use strip-ansi module instead of internal regex (#6823) (@wraithgar)
* [`d46d052`](https://github.com/npm/cli/commit/d46d0526be12eae2cd458fd08dd5c0a0320cc8bd) [#6798](https://github.com/npm/cli/pull/6798) tolerate null bugs URLs (#6798) (@vladh)
* [`fb1b674`](https://github.com/npm/cli/commit/fb1b6741bd52d865b8f8a93ad3fd6c8afa758b6a) [#6758](https://github.com/npm/cli/pull/6758) deprecate: ignore implicit workspace mode (#6758) (@wraithgar)

### Documentation

* [`68031f2`](https://github.com/npm/cli/commit/68031f2ae1cd5d49b0fb263da1a7eae62712ff97) [#6844](https://github.com/npm/cli/pull/6844) update `CONTRIBUTING.md` to prevent errors (#6844) (@darcyclarke)
* [`3ac703c`](https://github.com/npm/cli/commit/3ac703c95e7bb851d0f6145f1d612749ed479fef) [#6831](https://github.com/npm/cli/pull/6831) add `include `param to commands that have `omit` param (#6831) (@siemhesda)
* [`03912db`](https://github.com/npm/cli/commit/03912dbaeb92559270ab3f7df75b507b2f35a119) [#6819](https://github.com/npm/cli/pull/6819) add init-specific params to init docs/help (#6819) (@wraithgar)
* [`8088325`](https://github.com/npm/cli/commit/8088325281bc976e8a8aea4d7527b54f4e25fb5f) [#6800](https://github.com/npm/cli/pull/6800) Update npm-doctor.md (#6800) (@siemhesda)

### Dependencies

* [`aa6728b`](https://github.com/npm/cli/commit/aa6728b1d003f0fc620b074ba0396a3e07f2db6a) [#6859](https://github.com/npm/cli/pull/6859) `tar@6.2.0`
* [`ce9089f`](https://github.com/npm/cli/commit/ce9089f604a01297d3d2dd544283696a6297dce5) [#6859](https://github.com/npm/cli/pull/6859) `npm-package-arg@11.0.1`
* [`39d7f04`](https://github.com/npm/cli/commit/39d7f046f1c39017b398cb242ad07e874484e86c) [#6859](https://github.com/npm/cli/pull/6859) `minipass@7.0.4`
* [`0a47af5`](https://github.com/npm/cli/commit/0a47af509d66071908c7e0bf065dcf2f4c877669) [#6859](https://github.com/npm/cli/pull/6859) `hosted-git-info@7.0.1`
* [`af93130`](https://github.com/npm/cli/commit/af93130fe949f07df23891286c634c77ecf38c53) [#6859](https://github.com/npm/cli/pull/6859) `glob@10.3.10`
* [`3ebc474`](https://github.com/npm/cli/commit/3ebc4744433d906e5c491d183fc077ffe79958cf) [#6859](https://github.com/npm/cli/pull/6859) `@npmcli/query@3.0.1`
* [`284cbfd`](https://github.com/npm/cli/commit/284cbfd168879b9277c9999e8a28dad8f72ecc02) [#6858](https://github.com/npm/cli/pull/6858) `@npmcli/agent@2.2.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.0): `@npmcli/arborist@7.2.0`
* [Workspace](https://github.com/npm/cli/releases/tag/config-v8.0.0): `@npmcli/config@8.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v8.0.1): `libnpmaccess@8.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.2): `libnpmdiff@6.0.2`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.2): `libnpmexec@7.0.2`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.0): `libnpmfund@5.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v6.0.1): `libnpmorg@6.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.2): `libnpmpack@6.0.2`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.1): `libnpmpublish@9.0.1`

## [10.1.0](https://github.com/npm/cli/compare/v10.0.0...v10.1.0) (2023-09-08)

### Features

* [`1c93c44`](https://github.com/npm/cli/commit/1c93c4430300e3b3bd2cb5bab327c1732f470bca) [#6755](https://github.com/npm/cli/pull/6755) Add `--cpu` and `--os` option to override platform specific install  (#6755) (@yukukotani)

### Bug Fixes

* [`7bf2374`](https://github.com/npm/cli/commit/7bf2374a1dde0e9b4a4345eeaafb23316a9a5a0b) [#6762](https://github.com/npm/cli/pull/6762) make `$npm_execpath` always point to npm (@rotu)

### Documentation

* [`09d8e0a`](https://github.com/npm/cli/commit/09d8e0a20bd11f53a9fafac1fff4f1ec0b7b379e) [#6759](https://github.com/npm/cli/pull/6759) fix versions of node.js in readme (#6759) (@JoaoOtavioS)

### Dependencies

* [`f76066a`](https://github.com/npm/cli/commit/f76066a047e4a0e819149356b68a1c50fd30f9de) [#6771](https://github.com/npm/cli/pull/6771) `@npmcli/agent@2.1.1`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.1.0): `@npmcli/arborist@7.1.0`
* [Workspace](https://github.com/npm/cli/releases/tag/config-v7.2.0): `@npmcli/config@7.2.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.1): `libnpmdiff@6.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.1): `libnpmexec@7.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v4.1.1): `libnpmfund@4.1.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.1): `libnpmpack@6.0.1`

## [10.0.0](https://github.com/npm/cli/compare/v10.0.0-pre.1...v10.0.0) (2023-08-31)

### Features

* [`48a7b07`](https://github.com/npm/cli/commit/48a7b077d70cbe5bc808db6aae2c734aa202938a) remove prerelease flags (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.0.0): `@npmcli/arborist@7.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/config-v7.1.0): `@npmcli/config@7.1.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v8.0.0): `libnpmaccess@8.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.0): `libnpmdiff@6.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.0): `libnpmexec@7.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v4.1.0): `libnpmfund@4.1.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmhook-v10.0.0): `libnpmhook@10.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v6.0.0): `libnpmorg@6.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.0): `libnpmpack@6.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.0): `libnpmpublish@9.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v7.0.0): `libnpmsearch@7.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v6.0.0): `libnpmteam@6.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v5.0.0): `libnpmversion@5.0.0`

## [10.0.0-pre.1](https://github.com/npm/cli/compare/v10.0.0-pre.0...v10.0.0-pre.1) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`b34ee65`](https://github.com/npm/cli/commit/b34ee65ad1c82b53d5b5b28595203e18163fe4df) [#6706](https://github.com/npm/cli/pull/6706) set objectMode for search filter stream (@lukekarrys)
* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`d857c4a`](https://github.com/npm/cli/commit/d857c4ac7321211848076d148a4bea46af7058fd) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`37a99eb`](https://github.com/npm/cli/commit/37a99eb98b8846ab9481cc4ebd7a7278a8bc89bd) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`ee7292e`](https://github.com/npm/cli/commit/ee7292ed78c362927736471e0584217b2000f493) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`8b0e755`](https://github.com/npm/cli/commit/8b0e755b78098d9c0800e69f0cc2f6a457ce28a6) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`5c8c6cc`](https://github.com/npm/cli/commit/5c8c6ccc0be6e544f6884ecc1189de02450b7dfc) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`d431647`](https://github.com/npm/cli/commit/d4316479a7894290586718e412d7c670316a36f2) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`b6f2205`](https://github.com/npm/cli/commit/b6f220569791d655ab3c423990356cee47ca5218) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`4caedd0`](https://github.com/npm/cli/commit/4caedd0e49641e9f1757f5622e5845b5b49c56c1) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`355bac8`](https://github.com/npm/cli/commit/355bac87eb66b105c9f0c2338ae37fed5f973b66) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`e3a377d`](https://github.com/npm/cli/commit/e3a377d3b047c0436e05096d70cc5697714e413d) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)
* [`f916d33`](https://github.com/npm/cli/commit/f916d333c16b4f0433d8a304e856b73ed4f949cd) [#6715](https://github.com/npm/cli/pull/6715) allow searching packages with no description (@lukekarrys)

### Documentation

* [`c736b62`](https://github.com/npm/cli/commit/c736b622b8504b07f5a19f631ade42dd40063269) [#6686](https://github.com/npm/cli/pull/6686) add missing bugs key in package-json.md (#6686) (@airscripts)
* [`c1e01d9`](https://github.com/npm/cli/commit/c1e01d97da3b775edf104de158ee5db5cf027d0d) [#6680](https://github.com/npm/cli/pull/6680) Update package-json.md (#6680) (@p-chan, @ljharb)

### Dependencies

* [`5ab3f7e`](https://github.com/npm/cli/commit/5ab3f7e944b12481cb1164175c7a79d24d5e3ac5) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.3`
* [`eb41977`](https://github.com/npm/cli/commit/eb41977c56cbac88fa7d02f88dbf630cc652471a) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.1`
* [`f30c9e3`](https://github.com/npm/cli/commit/f30c9e30c2a6d777ea31157a90fddadc81fd11d0) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.2`
* [`f334466`](https://github.com/npm/cli/commit/f334466c53669e7debd4b9c67eafca74955509ee) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.4`
* [`bb63bf9`](https://github.com/npm/cli/commit/bb63bf945b2db8f3074e7429aff6343721c55cd1) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.0`
* [`75642c6`](https://github.com/npm/cli/commit/75642c6041195e093ef15ee2a42e1fc6a381c572) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/promise-spawn@7.0.0`
* [`dbb18f4`](https://github.com/npm/cli/commit/dbb18f4778a97915cd8bbb737a807f3db51c4619) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/agent@2.1.0`
* [`812aa6d`](https://github.com/npm/cli/commit/812aa6d2027ed42453b86b22f4cf8de25f6e0180) [#6706](https://github.com/npm/cli/pull/6706) `sigstore@2.1.0`
* [`7fab9d3`](https://github.com/npm/cli/commit/7fab9d3d2efd71f505658216dc44d802bc3203a6) [#6706](https://github.com/npm/cli/pull/6706) `@sigstore/tuf@2.1.0`
* [`12337cc`](https://github.com/npm/cli/commit/12337cc9d43bae2c5ad75e295b6a4d70e15a39cf) [#6706](https://github.com/npm/cli/pull/6706) `which@4.0.0`
* [`b1ad3ad`](https://github.com/npm/cli/commit/b1ad3ad194d046aa6209a4efad961429b379393c) [#6706](https://github.com/npm/cli/pull/6706) `npm-packlist@8.0.0`
* [`43831d0`](https://github.com/npm/cli/commit/43831d0fe4b02cb18d1c533f2831aaeedf5102e1) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.3`
* [`44e8fec`](https://github.com/npm/cli/commit/44e8fec3f28ce3bdd0500b92cbcf8f211da3c866) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.2`
* [`0d2e2c9`](https://github.com/npm/cli/commit/0d2e2c9d09ff760d8db09774fcd7ad417a88c4c7) [#6706](https://github.com/npm/cli/pull/6706) bump sigstore from 1.7.0 to 2.0.0
* [`dbd5885`](https://github.com/npm/cli/commit/dbd5885364648d3f2fe1c7b672e8aeadcd06edd1) [#6706](https://github.com/npm/cli/pull/6706) `npm-profile@9.0.0`
* [`2ee0fb3`](https://github.com/npm/cli/commit/2ee0fb3ac0c5e49f9eba545d6b05e20be1352414) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@16.0.0`
* [`81ff4df`](https://github.com/npm/cli/commit/81ff4dfd17024efb068816c9b0824ffc709a7cc4) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.1`
* [`2b23d44`](https://github.com/npm/cli/commit/2b23d44a9f0f01370d4999853aedecec4f1d8dd3) [#6706](https://github.com/npm/cli/pull/6706) hoist `read-package-json@7.0.0`
* [`325ed05`](https://github.com/npm/cli/commit/325ed05be53b57096727fb962925bf362edf9730) [#6706](https://github.com/npm/cli/pull/6706) hoist `normalize-package-data@6.0.0`
* [`c3a1a02`](https://github.com/npm/cli/commit/c3a1a021780d948a3023b622700b98aabb0df2f4) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/metavuln-calculator@7.0.0`
* [`f1dd130`](https://github.com/npm/cli/commit/f1dd1305fdcba0b7f5496223b5a65f0fe7e29975) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.1`
* [`10792ea`](https://github.com/npm/cli/commit/10792ea951a3ef8fc138f82d7b81484006213ce9) [#6706](https://github.com/npm/cli/pull/6706) `init-package-json@6.0.0`
* [`cac0725`](https://github.com/npm/cli/commit/cac07256e7234d0782a4833dae207732c71fef95) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.0`
* [`fd8beaf`](https://github.com/npm/cli/commit/fd8beaf4de23b8fbd9d5b968e10a5034d1a8f7bd) [#6706](https://github.com/npm/cli/pull/6706) `npm-pick-manifest@9.0.0`
* [`65f435e`](https://github.com/npm/cli/commit/65f435ee0a088d6593d8e985c2519cdd783f9a6d) [#6706](https://github.com/npm/cli/pull/6706) hoist `lru-cache@10.0.1`
* [`c784b57`](https://github.com/npm/cli/commit/c784b57b654d25e8d932e6fe415b87e75dcf9026) [#6706](https://github.com/npm/cli/pull/6706) `npm-package-arg@11.0.0`
* [`d6b1790`](https://github.com/npm/cli/commit/d6b1790492d9bc96c196d85d8fc9fd98d62d0087) [#6706](https://github.com/npm/cli/pull/6706) `normalize-package-data@6.0.0`
* [`2f03fb9`](https://github.com/npm/cli/commit/2f03fb9d8f25fd2b047d46edb608eb75f1f36017) [#6706](https://github.com/npm/cli/pull/6706) `make-fetch-happen@13.0.0`
* [`729e893`](https://github.com/npm/cli/commit/729e893cf610de725142f72cc344d1c11f42d7af) [#6706](https://github.com/npm/cli/pull/6706) `hosted-git-info@7.0.0`
* [`7af81c7`](https://github.com/npm/cli/commit/7af81c7360a6df31cdb0a8f18104b42656166378) [#6706](https://github.com/npm/cli/pull/6706) `cacache@18.0.0`
* [`b0849ab`](https://github.com/npm/cli/commit/b0849ab6feb62bf307ee362389bfcaf0e85653be) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/package-json@5.0.0`
* [`c9587d7`](https://github.com/npm/cli/commit/c9587d79c7c02aff4f53b093bf6702026ecea53a) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/git@5.0.0`
* [`e28d426`](https://github.com/npm/cli/commit/e28d42674deb791d862e07756bb453190773e6ec) [#6706](https://github.com/npm/cli/pull/6706) `minipass-fetch@3.0.4`
* [`61e9b00`](https://github.com/npm/cli/commit/61e9b00e096ce2e3122f1b21d22f3073ff22f2ce) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/metavuln-calculator@6.0.1`
* [`2c5542d`](https://github.com/npm/cli/commit/2c5542d29ba207e7c5c4337ac9ad7f296188508a) [#6706](https://github.com/npm/cli/pull/6706) `minipass@7.0.3`
* [`ede7f5e`](https://github.com/npm/cli/commit/ede7f5e74ad4d88559fec2532ddba2facbd7af7f) [#6706](https://github.com/npm/cli/pull/6706) `glob@10.3.3`
* [`4c9eb17`](https://github.com/npm/cli/commit/4c9eb1703bd41555e4ef7c2fc087a349b90c9b4c) [#6706](https://github.com/npm/cli/pull/6706) `npm-install-checks@6.2.0`
* [`88ece81`](https://github.com/npm/cli/commit/88ece8161021997cb5c22040b34d0dffff55fcf1) [#6706](https://github.com/npm/cli/pull/6706) `npm-pick-manifest@8.0.2`
* [`9117a4f`](https://github.com/npm/cli/commit/9117a4fcf05291ce7609bcad5bb810df9a5158e7) [#6706](https://github.com/npm/cli/pull/6706) `ssri@10.0.5`
* [`45f8d6f`](https://github.com/npm/cli/commit/45f8d6f15f82067f27d56357159a7f965b857f5d) [#6706](https://github.com/npm/cli/pull/6706) `make-fetch-happen@12.0.0`
* [`f6f6a18`](https://github.com/npm/cli/commit/f6f6a18120b31626259cdd4da834524a034aa4cb) [#6706](https://github.com/npm/cli/pull/6706) `fs-minipass@3.0.3`
* [`5eea975`](https://github.com/npm/cli/commit/5eea975437ab27d02afa2aaee59b2d4f98831df3) [#6706](https://github.com/npm/cli/pull/6706) `cacache@17.1.4`
* [`ca33c98`](https://github.com/npm/cli/commit/ca33c9840533435bda634adefb61757f30fad5ab) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/metavuln-calculator@6.0.0`
* [`7be541a`](https://github.com/npm/cli/commit/7be541a7a82cf1fb0de58953605b69c058f7efe0) [#6706](https://github.com/npm/cli/pull/6706) `npm-profile@8.0.0`
* [`edbc25a`](https://github.com/npm/cli/commit/edbc25a5980c34e0d28aac7503475cd33e07f7d2) [#6706](https://github.com/npm/cli/pull/6706) `pacote@16.0.0`
* [`5d0d859`](https://github.com/npm/cli/commit/5d0d8592cbf3b816d9fe44c36d390200ec15e87a) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@15.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.0.0-pre.0): `@npmcli/arborist@7.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/config-v7.0.1): `@npmcli/config@7.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v8.0.0-pre.0): `libnpmaccess@8.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.0-pre.0): `libnpmdiff@6.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.0-pre.0): `libnpmexec@7.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v4.0.20): `libnpmfund@4.0.20`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmhook-v10.0.0-pre.0): `libnpmhook@10.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v6.0.0-pre.0): `libnpmorg@6.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.0-pre.0): `libnpmpack@6.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.0-pre.0): `libnpmpublish@9.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v7.0.0-pre.0): `libnpmsearch@7.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v6.0.0-pre.0): `libnpmteam@6.0.0-pre.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v5.0.0-pre.0): `libnpmversion@5.0.0-pre.0`

## [10.0.0-pre.0](https://github.com/npm/cli/compare/v9.8.1...v10.0.0-pre.0) (2023-07-26)

### ⚠️ BREAKING CHANGES

* the "ci-name" config has been removed
* npm no longer treats missing scripts as a special case in workspace mode.  Use `if-present` to ignore missing scripts.
* npm now supports node `^18.17.0 || >=20.5.0`

### Features

* [`b6cf113`](https://github.com/npm/cli/commit/b6cf113f5199d3c23f632dbe35d8020515c6c623) [#6674](https://github.com/npm/cli/pull/6674) set engines and prerelease for npm 10 (#6674) (@lukekarrys)

### Bug Fixes

* [`e0d3edd`](https://github.com/npm/cli/commit/e0d3edd9908f8303abb9941bdd2f6e9aa31bc9d7) [#6641](https://github.com/npm/cli/pull/6641) remove "ci-name" config (@wraithgar)
* [`0318f44`](https://github.com/npm/cli/commit/0318f442fe6c18275607a5d574c383f085484e6e) [#6641](https://github.com/npm/cli/pull/6641) remove implicit if-present logic from run-script workspaces (@wraithgar)

### Documentation

* [`e5338af`](https://github.com/npm/cli/commit/e5338af3ca5d1aea78348f4894481eef3b1f7354) [#6672](https://github.com/npm/cli/pull/6672) remove link to deprecated `npm set-script` command (#6672) (@emmanuel-ferdman)

### Dependencies

* [Workspace](https://github.com/npm/cli/releases/tag/config-v7.0.0): `@npmcli/config@7.0.0`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v8.0.0): `libnpmpublish@8.0.0`
