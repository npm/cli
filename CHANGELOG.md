# Changelog

## [11.1.0](https://github.com/npm/cli/compare/v11.0.0...v11.1.0) (2025-01-29)
### Features
* [`7f6c997`](https://github.com/npm/cli/commit/7f6c9973dc9a4dfebd76e52e060a9d8496b8bd98) [#8009](https://github.com/npm/cli/pull/8009) add dry-run to deprecate/undeprecate commands (@wraithgar)
* [`1764a37`](https://github.com/npm/cli/commit/1764a37f1913b6a0811a85d89e029fc1dc79da54) [#8009](https://github.com/npm/cli/pull/8009) add npm undeprecate command (@wraithgar)
### Bug Fixes
* [`31455b2`](https://github.com/npm/cli/commit/31455b2e177b721292f3382726e3f5f3f2963b1d) [#8054](https://github.com/npm/cli/pull/8054) publish: honor force for no dist tag and registry version check (#8054) (@reggi)
* [`dc31c1b`](https://github.com/npm/cli/commit/dc31c1bdc6658ab69554adcf2988ee99a615c409) [#8038](https://github.com/npm/cli/pull/8038) remove max-len linting bypasses (@wraithgar)
* [`8a911ff`](https://github.com/npm/cli/commit/8a911ff895967678aa786595db3418fc28e6966a) [#8038](https://github.com/npm/cli/pull/8038) publish: disregard deprecated versions when calculating highest version (@wraithgar)
* [`7f72944`](https://github.com/npm/cli/commit/7f72944e43f009cf4d55ff4fe24c459e07f588fd) [#8038](https://github.com/npm/cli/pull/8038) publish: accept publishConfig.tag to override highes semver check (@wraithgar)
* [`ab9ddc0`](https://github.com/npm/cli/commit/ab9ddc0413374fbf4879da535f82e03bc4e62cf3) [#7992](https://github.com/npm/cli/pull/7992) sbom: deduplicate sbom dependencies (#7992) (@bdehamer)
* [`f7da341`](https://github.com/npm/cli/commit/f7da341322c2f860156e8144b208583596504479) [#7980](https://github.com/npm/cli/pull/7980) search: properly display multiple search terms (#7980) (@wraithgar)
### Documentation
* [`3644e79`](https://github.com/npm/cli/commit/3644e79a73e511bc54d857bc2026b071fe18a6fe) [#8055](https://github.com/npm/cli/pull/8055) update readme for Node.js versions, remove badges (#8055) (@wraithgar)
* [`f1af61f`](https://github.com/npm/cli/commit/f1af61f917e58a0a45d2b15d1e5600988b2c824f) [#8041](https://github.com/npm/cli/pull/8041) fix typos in "package-json" (#8041) (@maxkoryukov)
* [`e90c6fe`](https://github.com/npm/cli/commit/e90c6feeacdf9ad010d4d73b65d7dd7d3b86efe2) [#8051](https://github.com/npm/cli/pull/8051) depth flag default value (#8051) (@milaninfy)
* [`866b5ee`](https://github.com/npm/cli/commit/866b5ee3ae5ed508ecbe832d01f5ebd6b00f6789) [#8030](https://github.com/npm/cli/pull/8030) safer documentation urls, repos, packages (#8030) (@reggi)
### Dependencies
* [`7ddfbad`](https://github.com/npm/cli/commit/7ddfbadd1d51d07e68afbe1b91a36106d98c7bea) [#8053](https://github.com/npm/cli/pull/8053) `@npmcli/package-json@6.1.1`
* [`9473a86`](https://github.com/npm/cli/commit/9473a8638257297c420136009de567c131d2f299) [#8053](https://github.com/npm/cli/pull/8053) `spdx-license-ids@3.0.21`
* [`a65e5ce`](https://github.com/npm/cli/commit/a65e5ceb15c4aad6bde1ffdbee7da6f685caf81e) [#8053](https://github.com/npm/cli/pull/8053) `@sigstore/protobuf-specs@0.3.3`
* [`215ebe4`](https://github.com/npm/cli/commit/215ebe4d8f6c7f30d4b6a68fa11a3372c132929e) [#8053](https://github.com/npm/cli/pull/8053) `chalk@5.4.1`
### Chores
* [`61f00e3`](https://github.com/npm/cli/commit/61f00e3c23211d37c7980ebd6d1cf8d1dac49f18) [#8069](https://github.com/npm/cli/pull/8069) splits out smoke-tests from publish-dryrun tests (#8069) (@reggi)
* [`6d0f46e`](https://github.com/npm/cli/commit/6d0f46e67e9673e8a2dc6edb92144a73f853950c) [#8058](https://github.com/npm/cli/pull/8058) stop publish smoke from check git clean (#8058) (@reggi)
* [`9281ebf`](https://github.com/npm/cli/commit/9281ebf8e428d40450ad75ba61bc6f040b3bf896) [#8057](https://github.com/npm/cli/pull/8057) fix smoke tests prerelease needs separate string args (#8057) (@reggi)
* [`aa202e9`](https://github.com/npm/cli/commit/aa202e9dac2f927bedcaaed4db0eef7b3415fc68) [#8056](https://github.com/npm/cli/pull/8056) smoke tests using a preid (#8056) (@reggi)
* [`18e0449`](https://github.com/npm/cli/commit/18e0449ae41703a7980cee73bae69521db6fa53e) [#8053](https://github.com/npm/cli/pull/8053) dev dependency updates (@wraithgar)
* [`859a71c`](https://github.com/npm/cli/commit/859a71c59ea5f91f21a8410db46585a2fc0a8126) [#8052](https://github.com/npm/cli/pull/8052) update node versions for release integration tests (#8052) (@wraithgar)
* [`7e7961d`](https://github.com/npm/cli/commit/7e7961d8936e277f3dbc8e44f9e7b07daaeb36ca) [#8038](https://github.com/npm/cli/pull/8038) bump @npmcli/eslint-config to 5.1.0 (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.0.1): `@npmcli/config@10.0.1`

## [11.0.0](https://github.com/npm/cli/compare/v11.0.0-pre.1...v11.0.0) (2024-12-16)
### Documentation
* [`8a911da`](https://github.com/npm/cli/commit/8a911da452b9785bcd051778570beeb2d8b27421) [#7963](https://github.com/npm/cli/pull/7963) ls: removed design change pending section note (#7963) (@milaninfy)
### Dependencies
* [`5319e48`](https://github.com/npm/cli/commit/5319e48a5a91768dccdfe728392dc2040e7ce27e) [#7973](https://github.com/npm/cli/pull/7973) remove unnecessary sprintf-js files in node_modules (#7973)
* [`d369c77`](https://github.com/npm/cli/commit/d369c7716d753580da708723a2a4f8b3be767cb1) [#7976](https://github.com/npm/cli/pull/7976) `socks-proxy-agent@8.0.5`
* [`3b2951a`](https://github.com/npm/cli/commit/3b2951a3ba1521b9866d9b33960aa3307d4f31dd) [#7976](https://github.com/npm/cli/pull/7976) `https-proxy-agent@7.0.6`
* [`a598b7b`](https://github.com/npm/cli/commit/a598b7bd3de2b02bd14a3fa2f49c14a5ca50a43e) [#7976](https://github.com/npm/cli/pull/7976) `agent-base@7.1.3`
* [`52bcaf6`](https://github.com/npm/cli/commit/52bcaf6464f44b30137ee3d3fe79322c1b1646ef) [#7976](https://github.com/npm/cli/pull/7976) `debug@4.4.0`
* [`aabf345`](https://github.com/npm/cli/commit/aabf345a524f8aba7e0f45c0d4b8c86d5160d0cc) [#7976](https://github.com/npm/cli/pull/7976) `p-map@7.0.3`
* [`28e8761`](https://github.com/npm/cli/commit/28e876135411cd9a93dbdd74906869c54286d7bc) [#7976](https://github.com/npm/cli/pull/7976) `npm-package-arg@12.0.1`
### Chores
* [`ecd7190`](https://github.com/npm/cli/commit/ecd719026860d464557223b212acec4347477128) [#7976](https://github.com/npm/cli/pull/7976) dev dependency updates (@wraithgar)
* [`a07f4e0`](https://github.com/npm/cli/commit/a07f4e0d921f640be6aa87736debd550ec478f89) [#7976](https://github.com/npm/cli/pull/7976) `@npmcli/template-oss@4.23.6` (@wraithgar)
* [`687ab12`](https://github.com/npm/cli/commit/687ab12eb5ea0ee1017101f3a83d42fd76299627) [#7970](https://github.com/npm/cli/pull/7970) remove pre-release mode from npm 11 and workspaces (#7970) (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0): `@npmcli/arborist@9.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.0.0): `@npmcli/config@10.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v10.0.0): `libnpmaccess@10.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.0): `libnpmdiff@8.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.0.0): `libnpmexec@10.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.0): `libnpmfund@7.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v8.0.0): `libnpmorg@8.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.0): `libnpmpack@9.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.0.0): `libnpmpublish@11.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v9.0.0): `libnpmsearch@9.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v8.0.0): `libnpmteam@8.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v8.0.0): `libnpmversion@8.0.0`

## [11.0.0-pre.1](https://github.com/npm/cli/compare/v11.0.0-pre.0...v11.0.0-pre.1) (2024-12-06)
### ⚠️ BREAKING CHANGES
* Upon publishing, in order to apply a default "latest" dist tag, the command now retrieves all prior versions of the package. It will require that the version you're trying to publish is above the latest semver version in the registry, not including pre-release tags.
* `npm init` now has a `type` prompt, and sorts the entries the created packages differently
* `bun.lockb` files are now included in the strict ignore list during packing
### Features
* [`f3ac7b7`](https://github.com/npm/cli/commit/f3ac7b7460e1d9e1f9d3d8056317e36bb9813d5d) [#7939](https://github.com/npm/cli/pull/7939) no implicit latest tag on publish when latest > version (#7939) (@reggi, @ljharb)
### Bug Fixes
* [`e362c6d`](https://github.com/npm/cli/commit/e362c6d3a6c8bc0221b8c8a6c3dd623da9e6ae04) [#7944](https://github.com/npm/cli/pull/7944) prefix: remove duplicate -g from usage output (#7944) (@wraithgar)
### Documentation
* [`2af31dd`](https://github.com/npm/cli/commit/2af31dd30f4c226f43ce7295cd0b5fbb3f3cb2a6) [#7947](https://github.com/npm/cli/pull/7947) change certfile to cafile (#7947) (@wraithgar)
* [`1be8e95`](https://github.com/npm/cli/commit/1be8e9500826e7aef041976fd908658f473caf23) [#7945](https://github.com/npm/cli/pull/7945) update ignore rules (@wraithgar)
### Dependencies
* [`bc9b14d`](https://github.com/npm/cli/commit/bc9b14dc35378262c36ef5f59f96455b21a430cc) [#7955](https://github.com/npm/cli/pull/7955) `@npmcli/run-script@9.0.2`
* [`fecfcf4`](https://github.com/npm/cli/commit/fecfcf4987e30cc5ed04b0b77ccc9eb30c2b5c8f) [#7955](https://github.com/npm/cli/pull/7955) `node-gyp@11.0.0`
* [`8905037`](https://github.com/npm/cli/commit/890503767c733a1eacfdd562b01eb37ac253906c) [#7955](https://github.com/npm/cli/pull/7955) `p-map@7.0.2`
* [`ac8eb39`](https://github.com/npm/cli/commit/ac8eb390b0e0a21346fcdc5476ee0b884278b3a9) [#7955](https://github.com/npm/cli/pull/7955) `diff@7.0.0`
* [`c0bcc2a`](https://github.com/npm/cli/commit/c0bcc2a860fec5c86234dec44f5474364c25aefc) [#7955](https://github.com/npm/cli/pull/7955) `walk-up-path@4.0.0`
* [`d463a6f`](https://github.com/npm/cli/commit/d463a6f071da79b7a2151eeeea8a6f6cceea182f) [#7955](https://github.com/npm/cli/pull/7955) `init-package-json@8.0.0`
* [`b87ba24`](https://github.com/npm/cli/commit/b87ba2402ab86532d54b7b4e09b38582c0f11a5e) [#7945](https://github.com/npm/cli/pull/7945) `@npmcli/package-json@6.1.0`
* [`4bf1901`](https://github.com/npm/cli/commit/4bf1901f6dc57748d851ebe82262e9bef85a4ba7) [#7945](https://github.com/npm/cli/pull/7945) `@npmcli/metavuln-calculator@9.0.0`
* [`ca84b22`](https://github.com/npm/cli/commit/ca84b22a18806495c37ef6ee2aecd42a1c7bb7f6) [#7945](https://github.com/npm/cli/pull/7945) `pacote@21.0.0`
* [`4906f3d`](https://github.com/npm/cli/commit/4906f3ddf05c97f6e9832617a22c7ae228b46985) [#7945](https://github.com/npm/cli/pull/7945) `npm-packlist@10.0.0`
### Chores
* [`cfdf214`](https://github.com/npm/cli/commit/cfdf2147b5bfd80c7478486d07cb085de6fb8c4c) [#7943](https://github.com/npm/cli/pull/7943) fork changelog (#7943) (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0-pre.1): `@npmcli/arborist@9.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.0.0-pre.1): `@npmcli/config@10.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.0-pre.1): `libnpmdiff@8.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.0.0-pre.1): `libnpmexec@10.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.0-pre.1): `libnpmfund@7.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v8.0.0-pre.1): `libnpmorg@8.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.0-pre.1): `libnpmpack@9.0.0-pre.1`

## [11.0.0-pre.0](https://github.com/npm/cli/compare/v10.9.0...v11.0.0-pre.0) (2024-11-26)
### ⚠️ BREAKING CHANGES
* When publishing a package with a pre-release version, you must explicitly specify a tag.
* `--ignore-scripts` now applies to all lifecycle scripts, include `prepare`
* npm will no longer fall back to the old audit endpoint if the bulk advisory request fails.
* npm will no longer switch to global mode if aliased to "npmg" or "npm-g" etc.
* The `npm hook` command has been removed
* Attestations made by this package will no longer validate in npm versions prior to 10.6.0
* npm now supports node `^20.17.0 || >=22.9.0`
* @npmcli/docs now supports node `^20.17.0 || >=22.9.0`
### Features
* [`6995303`](https://github.com/npm/cli/commit/6995303687ab59541b727bf611f73624d1829b6c) [#7850](https://github.com/npm/cli/pull/7850) adds `--ignore-scripts` flag to `pack` (@reggi)
### Bug Fixes
* [`16b7367`](https://github.com/npm/cli/commit/16b7367245a0ea7228a27a43555eefb3c6b16870) [#7910](https://github.com/npm/cli/pull/7910) publishing prerelease requires explicit tag (#7910) (@reggi)
* [`e19bff0`](https://github.com/npm/cli/commit/e19bff0ece79b189497720f076c0b324cb641061) [#7901](https://github.com/npm/cli/pull/7901) perf: enable compile cache if present (#7901) (@H4ad)
* [`080a0f2`](https://github.com/npm/cli/commit/080a0f2d3f09a81f0a5b2992431e0bc7feb8d701) [#7911](https://github.com/npm/cli/pull/7911) remove old audit fallback request (@wraithgar)
* [`780afc5`](https://github.com/npm/cli/commit/780afc50e3a345feb1871a28e33fa48235bc3bd5) [#7855](https://github.com/npm/cli/pull/7855) pkg: display if any of multiple attributes exist (#7855) (@Sanderovich)
* [`ecd2d23`](https://github.com/npm/cli/commit/ecd2d23d429b2fee833e534e679cce97e4190b1b) [#7842](https://github.com/npm/cli/pull/7842) don't go into global mode if aliased to npmg (#7842) (@wraithgar)
* [`62c71e5`](https://github.com/npm/cli/commit/62c71e5128a01283f97bd62da30ddc673bddda0b) [#7835](https://github.com/npm/cli/pull/7835) removes `npm hook` command (@reggi)
* [`7f541e8`](https://github.com/npm/cli/commit/7f541e82a0b2908cc0cfef9a36b714eeab40c029) [#7815](https://github.com/npm/cli/pull/7815) make pack and exec work with git hash refs (#7815) (@milaninfy)
* [`3162620`](https://github.com/npm/cli/commit/316262004747e04dfdcf2628abbc45cd366c86b8) [#7831](https://github.com/npm/cli/pull/7831) sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
* [`4c8ba0a`](https://github.com/npm/cli/commit/4c8ba0aa678b532146200e4cc082f151983b0d82) [#7831](https://github.com/npm/cli/pull/7831) for @npmcli/docs sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
* [`70cd88d`](https://github.com/npm/cli/commit/70cd88d95aa06ac96154c14ee262076704af807f) [#7808](https://github.com/npm/cli/pull/7808) view: sort and truncate dist-tags (#7808) (@wraithgar)
* [`534ad77`](https://github.com/npm/cli/commit/534ad7789e5c61f579f44d782bdd18ea3ff1ee20) [#7795](https://github.com/npm/cli/pull/7795) remove unused parameters catch statements (#7795) (@btea)
### Documentation
* [`feb54f7`](https://github.com/npm/cli/commit/feb54f7e9a39bd52519221bae4fafc8bc70f235e) [#7822](https://github.com/npm/cli/pull/7822) package.json: add libc field (#7822) (@wraithgar)
### Dependencies
* [`78293ad`](https://github.com/npm/cli/commit/78293ad9b58b30b373dd69d15ea4e5735e720f55) [#7937](https://github.com/npm/cli/pull/7937) `spdx-license-ids@3.0.20`
* [`33cf580`](https://github.com/npm/cli/commit/33cf5801308b4b0b2a055e842a340135367f8a8d) [#7937](https://github.com/npm/cli/pull/7937) `promise-call-limit@3.0.2`
* [`ef1c368`](https://github.com/npm/cli/commit/ef1c3687b35295993258127ad7a5b0fd323fba8b) [#7937](https://github.com/npm/cli/pull/7937) `package-json-from-dist@1.0.1`
* [`92e6f07`](https://github.com/npm/cli/commit/92e6f076789b3bc39377308b84ee834b98855258) [#7937](https://github.com/npm/cli/pull/7937) `npm-registry-fetch@18.0.2`
* [`e32284a`](https://github.com/npm/cli/commit/e32284a8ebb679e41a2e8f0c8c63cc704296810c) [#7937](https://github.com/npm/cli/pull/7937) `npm-install-checks@7.1.1`
* [`5dffd11`](https://github.com/npm/cli/commit/5dffd112ba85864582b9af688ffc0b6d1a6a0166) [#7937](https://github.com/npm/cli/pull/7937) `negotiator@0.6.4`
* [`69d9f01`](https://github.com/npm/cli/commit/69d9f01ab11cb79bede2bde00423b9511d048c56) [#7937](https://github.com/npm/cli/pull/7937) `make-fetch-happen@14.0.3`
* [`884bbde`](https://github.com/npm/cli/commit/884bbde5a2865722fae0eb4de386f4d55ebdba93) [#7937](https://github.com/npm/cli/pull/7937) `hosted-git-info@8.0.2`
* [`3c74ec0`](https://github.com/npm/cli/commit/3c74ec00e1244178226b88331f703aded3c9d1e2) [#7937](https://github.com/npm/cli/pull/7937) `debug@4.3.7`
* [`f00359f`](https://github.com/npm/cli/commit/f00359f422d00ea6d209d624e2885e072b0a8f60) [#7937](https://github.com/npm/cli/pull/7937) `cross-spawn@7.0.6`
* [`534bbe8`](https://github.com/npm/cli/commit/534bbe8482f04f65c96c34fdd8734be91b29b18a) [#7937](https://github.com/npm/cli/pull/7937) `ci-info@4.1.0`
* [`8cbf1a7`](https://github.com/npm/cli/commit/8cbf1a75e12c586cdf77f03f7494ecb17b7030df) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/promise-spawn@8.0.2`
* [`1bd39e7`](https://github.com/npm/cli/commit/1bd39e7f766373021cc137fecc3cc3076967b444) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/map-workspaces@4.0.2`
* [`eb6498d`](https://github.com/npm/cli/commit/eb6498dc543fa117ba4d4bc87c7bc77423e2b72a) [#7937](https://github.com/npm/cli/pull/7937) `ansi-regex@6.1.0`
* [`66fc8c9`](https://github.com/npm/cli/commit/66fc8c997a37b0e28d35cb537fc68f6ed5466a73) [#7850](https://github.com/npm/cli/pull/7850) `@npmcli/metavuln-calculator@8.0.1`
* [`7dbef6f`](https://github.com/npm/cli/commit/7dbef6f3a3ead089b1b8b9fe6b2fa25e24309000) [#7850](https://github.com/npm/cli/pull/7850) `pacote@20.0.0`
* [`75a3f12`](https://github.com/npm/cli/commit/75a3f1228865f426d8790be27f1258e501f2c450) [#7859](https://github.com/npm/cli/pull/7859) remove unused deps (#7859)
* [`f36dc59`](https://github.com/npm/cli/commit/f36dc593ecbfe77439a1d0e31afb5a45de3b8d14) [#7833](https://github.com/npm/cli/pull/7833) `pacote@19.0.1`
* [`7ee15bb`](https://github.com/npm/cli/commit/7ee15bbdc1da0ed85297f47952b66089f29ed3fd) [#7833](https://github.com/npm/cli/pull/7833) bump sigstore from 2.x to 3.0.0 (@bdehamer)
### Chores
* [`2d530a5`](https://github.com/npm/cli/commit/2d530a5db705e72569d4beec02d86a2939b212f3) [#7941](https://github.com/npm/cli/pull/7941) tests: account for when npm is a prerelease (#7941) (@wraithgar)
* [`2c1b369`](https://github.com/npm/cli/commit/2c1b36951b1af9b798ece9392d778d4f9eff2268) [#7937](https://github.com/npm/cli/pull/7937) dev dependency updates (@wraithgar)
* [`6edfe2f`](https://github.com/npm/cli/commit/6edfe2f3a45169b6d194ccd8d366bb8d0e09b4a5) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/template-oss@4.23.5` (@wraithgar)
* [`475285b`](https://github.com/npm/cli/commit/475285b81e8db441ccadca1273b2bae9d83fc941) [#7920](https://github.com/npm/cli/pull/7920) clean up dependency graph repos (#7920) (@hashtagchris)
* [`ec57f5f`](https://github.com/npm/cli/commit/ec57f5f0831e6e82b87b9ed9ebdfa9fc3d5ba1ee) [#7911](https://github.com/npm/cli/pull/7911) fix dependencies script for circular workspace deps (@wraithgar)
* [`ccd8420`](https://github.com/npm/cli/commit/ccd84201e4e369992289842a5117cb3b531a7a36) [#7911](https://github.com/npm/cli/pull/7911) fix cli tests for audit fallback removal (@wraithgar)
* [`720b4d8`](https://github.com/npm/cli/commit/720b4d807bd2e214a045a9ffa9c56435823a7a05) [#7833](https://github.com/npm/cli/pull/7833) bump @npmcli/arborist to 8.0.0 (@wraithgar)
* [`286739c`](https://github.com/npm/cli/commit/286739c0224bad88c4a38927bafd61973f71098c) [#7824](https://github.com/npm/cli/pull/7824) add creation of a DEPENDENCIES.json file (#7824) (@reggi)
* [`852dd8b`](https://github.com/npm/cli/commit/852dd8bdcb958439d343bcd9fb27fb4f07e95991) [#7831](https://github.com/npm/cli/pull/7831) sets npm 11 to prerelase (@reggi)
* [`95d009e`](https://github.com/npm/cli/commit/95d009e606b187b9e148f4f1119b8a19e5beb7f0) [#7831](https://github.com/npm/cli/pull/7831) update engine `^20.17.0 || >=22.9.0` in actions (@reggi)
* [`5a74478`](https://github.com/npm/cli/commit/5a744782af53d6655669e49d911468934ea5e027) [#7831](https://github.com/npm/cli/pull/7831) update engines `^20.17.0 || >=22.9.0` in package template (@reggi)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.0-pre.0): `@npmcli/arborist@9.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.0.0-pre.0): `@npmcli/config@10.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v10.0.0-pre.0): `libnpmaccess@10.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.0-pre.0): `libnpmdiff@8.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.0.0-pre.0): `libnpmexec@10.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.0-pre.0): `libnpmfund@7.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v8.0.0-pre.0): `libnpmorg@8.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.0-pre.0): `libnpmpack@9.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.0.0-pre.0): `libnpmpublish@11.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v9.0.0-pre.0): `libnpmsearch@9.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v8.0.0-pre.0): `libnpmteam@8.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v8.0.0-pre.0): `libnpmversion@8.0.0-pre.0`
