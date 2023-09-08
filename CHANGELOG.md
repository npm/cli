# Changelog

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
