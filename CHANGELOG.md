# Changelog

## [11.5.2](https://github.com/npm/cli/compare/v11.5.1...v11.5.2) (2025-07-30)
### Bug Fixes
* [`7d900c4`](https://github.com/npm/cli/commit/7d900c4656cfffc8cca93240c6cda4b441fbbfaa) [#8467](https://github.com/npm/cli/pull/8467) oidc visibility check for provenance (#8467) (@reggi, @wraithgar)
### Documentation
* [`d4e56b2`](https://github.com/npm/cli/commit/d4e56b2976ef1d2af273a6750d10b217adf4bf8e) [#8459](https://github.com/npm/cli/pull/8459) update snapshot generation command (#8459) (@MikeMcC399)

## [11.5.1](https://github.com/npm/cli/compare/v11.5.0...v11.5.1) (2025-07-24)
### Bug Fixes
* [`476bf17`](https://github.com/npm/cli/commit/476bf174c1c9874fa2a92df7257c3d445e3e16d3) [#8457](https://github.com/npm/cli/pull/8457) provenance should only default for oidc (@reggi)

## [11.5.0](https://github.com/npm/cli/compare/v11.4.2...v11.5.0) (2025-07-24)
### Features
* [`1cce318`](https://github.com/npm/cli/commit/1cce31810eb5ff1e0f7c8ee4516e7c73cedb38a1) [#8336](https://github.com/npm/cli/pull/8336) adds support for oidc publish (#8336) (@reggi)
### Bug Fixes
* [`7f66f0a`](https://github.com/npm/cli/commit/7f66f0ae8fb84f567fe83a9a5738d06c7fe8fb54) [#8447](https://github.com/npm/cli/pull/8447) add better hint for `before` and clean up description (@wraithgar)
* [`280817a`](https://github.com/npm/cli/commit/280817a0a5b4e2aebd4b2f39c79ac9af58165edf) [#8447](https://github.com/npm/cli/pull/8447) add --before param to command help output (@wraithgar)
* [`6e47325`](https://github.com/npm/cli/commit/6e47325e59f19e4e563b5f9308cff165739088a2) [#8441](https://github.com/npm/cli/pull/8441) Makes 404 errors less scary without revealing existence (#8441) (@owlstronaut)
* [`0a97ffd`](https://github.com/npm/cli/commit/0a97ffdf8b2df40a5f24b710415eb0c9aaa82f5d) [#8429](https://github.com/npm/cli/pull/8429) handle signal exits gracefully (@owlstronaut)
* [`5b858c6`](https://github.com/npm/cli/commit/5b858c6b2c275f0e670e09c52de5b931936d6e07) [#8411](https://github.com/npm/cli/pull/8411) ensure progress bars display consistently across all environments (#8411) (@owlstronaut)
### Documentation
* [`ef3529e`](https://github.com/npm/cli/commit/ef3529ec4b45901c95182850e8e9da8dae833227) [#8435](https://github.com/npm/cli/pull/8435) add test snapshot (#8435) (@reggi, @wraithgar)
* [`b7758d7`](https://github.com/npm/cli/commit/b7758d73d6b715a62e6d0c48e11b87017ce2b71c) [#8418](https://github.com/npm/cli/pull/8418) remove reference to Node.js download less common os (#8418) (@MikeMcC399)
* [`746ac5d`](https://github.com/npm/cli/commit/746ac5d95dc19a74c519a8e3f3e1eed029957921) [#8380](https://github.com/npm/cli/pull/8380) remove duplicate info (#8380) (@alexsch01)
* [`4673e9c`](https://github.com/npm/cli/commit/4673e9c165b39563e16409f3b1ca06fdc32e7d44) [#8371](https://github.com/npm/cli/pull/8371) rebrand OS X references to macOS (@MikeMcC399)
### Dependencies
* [`398fed4`](https://github.com/npm/cli/commit/398fed45af63a8f7e3f5da8fc882674befd39216) [#8450](https://github.com/npm/cli/pull/8450) `normalize-package-data@7.0.1`
* [`5b242c9`](https://github.com/npm/cli/commit/5b242c9302e9ae1405b5ecbc76eb290c0f72634d) [#8450](https://github.com/npm/cli/pull/8450) `validate-npm-package-name@6.0.2`
* [`d4e8a8a`](https://github.com/npm/cli/commit/d4e8a8aba42f146a5feb20da262f92d0c3100986) [#8450](https://github.com/npm/cli/pull/8450) `tuf-js@3.1.0`
* [`e1b37b2`](https://github.com/npm/cli/commit/e1b37b2c84346eba3451369753756381658214b5) [#8450](https://github.com/npm/cli/pull/8450) `picomatch@4.0.3`
* [`3cb5884`](https://github.com/npm/cli/commit/3cb58842ff65a9ca2b31306e0e71ccf9ee5702e5) [#8450](https://github.com/npm/cli/pull/8450) `socks@2.8.6`
* [`daea981`](https://github.com/npm/cli/commit/daea98168b636b89ced80ab6d895ba7d9c5c8e20) [#8450](https://github.com/npm/cli/pull/8450) `ci-info@4.3.0`
* [`39ad47d`](https://github.com/npm/cli/commit/39ad47dd46dd69bcf16eb7dd5b6d8efec0d5d1c2) [#8450](https://github.com/npm/cli/pull/8450) `aproba@2.1.0`
* [`a789f33`](https://github.com/npm/cli/commit/a789f334757b691db02fcc182781d02b41e8bb5c) [#8450](https://github.com/npm/cli/pull/8450) `agent-base@7.1.4`
* [`1c0d257`](https://github.com/npm/cli/commit/1c0d257aa015297b703d0f413928bff661ed1430) [#8450](https://github.com/npm/cli/pull/8450) `@npmcli/metavuln-calculator@9.0.1`
### Chores
* [`804a964`](https://github.com/npm/cli/commit/804a9646e41d3aaa11ed084aa0c9997b7375882f) [#8450](https://github.com/npm/cli/pull/8450) update devDependencies in lockfile (@wraithgar)
* [`643ae71`](https://github.com/npm/cli/commit/643ae7104e5246a8ea10bfbd4f98540945c8430d) [#8450](https://github.com/npm/cli/pull/8450) update mock-registry to use local arborist (@wraithgar)
* [`cf023d7`](https://github.com/npm/cli/commit/cf023d71135427f2fdb290162432802e8a1514da) [#8421](https://github.com/npm/cli/pull/8421) contributing: prepare easier copy-paste contributing commands (#8421) (@MikeMcC399)
* [`3f60b5f`](https://github.com/npm/cli/commit/3f60b5f9621b43ae0b8796d3a7160a603748f756) [#8383](https://github.com/npm/cli/pull/8383) `@npmcli/template-oss@4.24.4` (#8383) (@wraithgar)
* [`01f8cc6`](https://github.com/npm/cli/commit/01f8cc6f001e3211135fa0563f7129aed09dc46c) [#8381](https://github.com/npm/cli/pull/8381) `@npmcli/template-oss@4.24.3` (#8381) (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.3): `@npmcli/arborist@9.1.3`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.3.1): `@npmcli/config@10.3.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.6): `libnpmdiff@8.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.5): `libnpmexec@10.1.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.6): `libnpmfund@7.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.6): `libnpmpack@9.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.1.0): `libnpmpublish@11.1.0`

## [11.4.2](https://github.com/npm/cli/compare/v11.4.1...v11.4.2) (2025-06-11)
### Bug Fixes
* [`f2d6947`](https://github.com/npm/cli/commit/f2d69478923b919c77bbb8bdb70c30ddeb59ffe7) [#8345](https://github.com/npm/cli/pull/8345) move warning to new line when `npm init` is canceled (@mbtools)
* [`e758dd7`](https://github.com/npm/cli/commit/e758dd7bec58efed2cc865a6d360b0432ccc9f57) [#8318](https://github.com/npm/cli/pull/8318) powershell: multiple Invoke-Expression fixes (#8318) (@alexsch01)
### Documentation
* [`7233cb3`](https://github.com/npm/cli/commit/7233cb3a159872236338b97bcb9d3797864abb33) [#8355](https://github.com/npm/cli/pull/8355) remove deprecated section related temp files (#8355) (@milaninfy)
* [`fb7a498`](https://github.com/npm/cli/commit/fb7a498d557abdd0c1a6945522d47878cf930a27) [#8351](https://github.com/npm/cli/pull/8351) clarify shell used for script (#8351) (@milaninfy)
* [`8b55d38`](https://github.com/npm/cli/commit/8b55d38cd2815a9503aed664c85eb678203dc4d4) [#8329](https://github.com/npm/cli/pull/8329) Rename "command" to "script" (#8329) (@DanKaplanSES)
### Dependencies
* [`7b05420`](https://github.com/npm/cli/commit/7b0542028f9c3cc326c26a1986c34cec7eb04931) [#8358](https://github.com/npm/cli/pull/8358) `fdir@6.4.6`
* [`e1a3b23`](https://github.com/npm/cli/commit/e1a3b23ebca0cb9b42c62a8c7b506ae9c2cc1a03) [#8358](https://github.com/npm/cli/pull/8358) `tinyglobby@0.2.14`
* [`522efa2`](https://github.com/npm/cli/commit/522efa2641780e1703d3578baeb94d3e57bcc8af) [#8358](https://github.com/npm/cli/pull/8358) `socks@2.8.5`
* [`7a0723f`](https://github.com/npm/cli/commit/7a0723f142b29065efec602e9e7d6585175e87a1) [#8358](https://github.com/npm/cli/pull/8358) `debug@4.4.1`
* [`9a342a4`](https://github.com/npm/cli/commit/9a342a4afb40d0668ab6a2c3820be7cacb4b79f7) [#8358](https://github.com/npm/cli/pull/8358) `brace-expansion@2.0.2`
* [`e691ba0`](https://github.com/npm/cli/commit/e691ba0918ea8526be9655f4c4c51e0887f7c623) [#8358](https://github.com/npm/cli/pull/8358) `@sigstore/protobuf-specs@0.4.3`
* [`42ef765`](https://github.com/npm/cli/commit/42ef765008ed76e5cc2521a92ba2d329933524b7) [#8358](https://github.com/npm/cli/pull/8358) `validate-npm-package-name@6.0.1`
* [`774c0b1`](https://github.com/npm/cli/commit/774c0b1e9c5704ffa24196fdcc44ba9575b04ca0) [#8358](https://github.com/npm/cli/pull/8358) `@npmcli/redact@3.2.2`
* [`dda6f87`](https://github.com/npm/cli/commit/dda6f871331280eeb37493a4ccc57361a27949eb) [#8317](https://github.com/npm/cli/pull/8317) `@npmcli/package-json@6.2.0`
* [`bc08ac7`](https://github.com/npm/cli/commit/bc08ac7a82f047485885d9c41a8b6fc48e8981b0) [#8317](https://github.com/npm/cli/pull/8317) remove normalize-package-data
### Chores
* [`0ad1444`](https://github.com/npm/cli/commit/0ad1444d76b0b68e4a4d48d7f22ebd4cd0d0e850) [#8358](https://github.com/npm/cli/pull/8358) dev dependency updates (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.2): `@npmcli/arborist@9.1.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.5): `libnpmdiff@8.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.4): `libnpmexec@10.1.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.5): `libnpmfund@7.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.5): `libnpmpack@9.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.0.1): `libnpmpublish@11.0.1`

## [11.4.1](https://github.com/npm/cli/compare/v11.4.0...v11.4.1) (2025-05-21)
### Documentation
* [`3ed764a`](https://github.com/npm/cli/commit/3ed764aa08f2087fa1d1bd7391a646ba47565294) [#8308](https://github.com/npm/cli/pull/8308) Clarify script working directory behavior (fixes #8305) (#8308) (@tarekwfa0110, @owlstronaut)
### Chores
* [`2f30251`](https://github.com/npm/cli/commit/2f302516401928239593dd2eebc171729df60537) [#8314](https://github.com/npm/cli/pull/8314) remove references to skimdb.npmjs.com (#8314) (@shmam)
* [`9cb9d50`](https://github.com/npm/cli/commit/9cb9d5030b1fdb83e3ffa45b7c8d2de80a657768) [#8298](https://github.com/npm/cli/pull/8298) add contributor to changelog entry (#8298) (@wraithgar)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.1): `@npmcli/arborist@9.1.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.4): `libnpmdiff@8.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.3): `libnpmexec@10.1.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.4): `libnpmfund@7.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.4): `libnpmpack@9.0.4`

## [11.4.0](https://github.com/npm/cli/compare/v11.3.0...v11.4.0) (2025-05-15)
### Features
* [`a0e60fb`](https://github.com/npm/cli/commit/a0e60fb1893ac77a78380d9a9faaaaa54da1fe85) [#8246](https://github.com/npm/cli/pull/8246) added init-private option (@owlstronaut)
* [`57aa89f`](https://github.com/npm/cli/commit/57aa89ff70e0c6186a43888b944b5799b25c7bc8) [#8265](https://github.com/npm/cli/pull/8265) use run by default and run-script as the alias (#8265) (@owlstronaut)
* [`0d4c023`](https://github.com/npm/cli/commit/0d4c023914f835927540bd0110c1ca5716b84056) [#8234](https://github.com/npm/cli/pull/8234) install: add package info to json output (#8234) (@wraithgar)
### Bug Fixes
* [`8794fd9`](https://github.com/npm/cli/commit/8794fd9161c29fea3f51ae8581f54172011d4069) [#8297](https://github.com/npm/cli/pull/8297) powershell: support pipeline input with Invoke-Expression (#8297) (@alexsch01)
* [`b5173d1`](https://github.com/npm/cli/commit/b5173d13c182efa5434ef4ca413e62ce1437f47a) [#8293](https://github.com/npm/cli/pull/8293) docs: corrected github_path (#8293) (@xaos7991)
* [`2210d7a`](https://github.com/npm/cli/commit/2210d7a670ac3522ceee8856a3399e8f44e77bbe) [#8278](https://github.com/npm/cli/pull/8278) powershell: use Invoke-Expression to pass args (#8278) (@alexsch01, @mbtools)
* [`8669d09`](https://github.com/npm/cli/commit/8669d0931abd0ae4b655cf9e5a024065054a8bb4) [#8228](https://github.com/npm/cli/pull/8228) add otplease for enable-2fa, disable-2fa, access (#8228) (@reggi, @wraithgar)
* [`78b5a6f`](https://github.com/npm/cli/commit/78b5a6fa9cd103bb80a25957ddfcb5832bc1f937) [#8269](https://github.com/npm/cli/pull/8269) correctly handle scenario where prefix is the cwd (#8269) (@owlstronaut, @ficocelliguy)
* [`fdc3413`](https://github.com/npm/cli/commit/fdc3413019c2f34f1fde35449e5f3a6b0fb51ba2) [#8221](https://github.com/npm/cli/pull/8221) exec: Fails to Execute Binaries Named After Shell Keywords (#8221) (@13sfaith)
* [`4b08e2e`](https://github.com/npm/cli/commit/4b08e2ed252a18f85a360b76c7273a7aa7a994ca) [#8245](https://github.com/npm/cli/pull/8245) docs: prepare script runs for local package links (@milaninfy)
* [`1622ac4`](https://github.com/npm/cli/commit/1622ac456f07403e6afe02352b8f95db14dcf9eb) [#8241](https://github.com/npm/cli/pull/8241) handle missing `time` in packument to prevent crash on `npm view` (@owlstronaut)
* [`db8f5da`](https://github.com/npm/cli/commit/db8f5da886326ae40d44a8cceedb99e2e6a00855) [#8110](https://github.com/npm/cli/pull/8110) outdated: add dependent location in long output (#8110) (@milaninfy, @wraithgar)
### Documentation
* [`d2498df`](https://github.com/npm/cli/commit/d2498df8efa558c3048f71324be0ef189c14bd49) [#8295](https://github.com/npm/cli/pull/8295) Remove `CHANGELOG` from never-ignored list (#8295) (@mrazauskas)
* [`4d5c3c1`](https://github.com/npm/cli/commit/4d5c3c1d8d99e352b1b4906c2607752ee3051a75) [#8283](https://github.com/npm/cli/pull/8283) fix `overrides` example in package-json.md (#8283) (@glasser)
* [`96cc4f9`](https://github.com/npm/cli/commit/96cc4f9a87a231abf4c9584a277765368ba6663d) [#8226](https://github.com/npm/cli/pull/8226) format publish as code to highlight it (@LiangYingC)
* [`4990ea0`](https://github.com/npm/cli/commit/4990ea0f0c017e4702cf2da2fbd99dad61c77015) [#8226](https://github.com/npm/cli/pull/8226) clarify legacy token creation in npm login and adduser commands (@LiangYingC)
### Dependencies
* [`c97ef8a`](https://github.com/npm/cli/commit/c97ef8ae62187b5330c82887e9f566a4d2466cc4) [#8246](https://github.com/npm/cli/pull/8246) `init-package-json@8.2.1`
* [`f48613d`](https://github.com/npm/cli/commit/f48613d0403a5267a7a55cbaa9d1e814d2033fe4) [#8292](https://github.com/npm/cli/pull/8292) `@sigstore/verify@2.1.1`
* [`a4c5e74`](https://github.com/npm/cli/commit/a4c5e7455b621a4dffa893fef0ebf8ffa2307b1f) [#8292](https://github.com/npm/cli/pull/8292) `tinyglobby@0.2.13`
* [`b9156d2`](https://github.com/npm/cli/commit/b9156d2144ca387edd13178547c0ec276450f118) [#8292](https://github.com/npm/cli/pull/8292) `http-cache-semantics@4.2.0`
* [`472a685`](https://github.com/npm/cli/commit/472a685a8fe4d120a86ea6c7ee50e304bc8e7e94) [#8292](https://github.com/npm/cli/pull/8292) `binary-extensions@3.1.0`
* [`988696e`](https://github.com/npm/cli/commit/988696eb93548e703ae04496d0e361a6015cb0d3) [#8292](https://github.com/npm/cli/pull/8292) `@sigstore/tuf@3.1.1`
* [`569ac84`](https://github.com/npm/cli/commit/569ac84537f05450260e05d006361cdfe586359b) [#8292](https://github.com/npm/cli/pull/8292) `semver@7.7.2`
* [`2521c9b`](https://github.com/npm/cli/commit/2521c9ba18172c2ade525cbe9a675d293a0484d9) [#8233](https://github.com/npm/cli/pull/8233) `@sigstore/protobuf-specs@0.4.1`
* [`3274d68`](https://github.com/npm/cli/commit/3274d68b13595415586b41445838cc258543173a) [#8233](https://github.com/npm/cli/pull/8233) `@npmcli/query@4.0.1`
* [`c263626`](https://github.com/npm/cli/commit/c2636268e83b8049789534e78f4c15913e047c89) [#8233](https://github.com/npm/cli/pull/8233) `abbrev@3.0.1`
* [`78df711`](https://github.com/npm/cli/commit/78df711a60aaf8538b9fcaf13f2f9d50ce62b7b8) [#8233](https://github.com/npm/cli/pull/8233) `hosted-git-info@8.1.0`
### Chores
* [`e80e38e`](https://github.com/npm/cli/commit/e80e38eb961865de4006dc0e2ea991aebb1a3bdf) [#8292](https://github.com/npm/cli/pull/8292) dev dependency updates (@wraithgar)
* [`3231ee9`](https://github.com/npm/cli/commit/3231ee9afefcadce2b17a143fd51d365de4d6dea) [#8244](https://github.com/npm/cli/pull/8244) update snapshots (@owlstronaut)
* [`c561a33`](https://github.com/npm/cli/commit/c561a3307b18f9c208eb7305db0f2a51db61277d) [#8233](https://github.com/npm/cli/pull/8233) dev dependency updates (@owlstronaut)
* [`7eca19c`](https://github.com/npm/cli/commit/7eca19cb5ddc32688a8e331d5468d58f14684bff) [#8215](https://github.com/npm/cli/pull/8215) update workflow permissions for updating Node PR (@owlstronaut)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.0): `@npmcli/arborist@9.1.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.3.0): `@npmcli/config@10.3.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v10.0.1): `libnpmaccess@10.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.3): `libnpmdiff@8.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.2): `libnpmexec@10.1.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.3): `libnpmfund@7.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.3): `libnpmpack@9.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v8.0.1): `libnpmteam@8.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v8.0.1): `libnpmversion@8.0.1`

## [11.3.0](https://github.com/npm/cli/compare/v11.2.0...v11.3.0) (2025-04-08)
### Features
* [`b306d25`](https://github.com/npm/cli/commit/b306d25df2f2e6ae75fd4f6657e0858b6dd71c43) [#8129](https://github.com/npm/cli/pull/8129) add `node-gyp` as actual config (@wraithgar)
### Bug Fixes
* [`2f5392a`](https://github.com/npm/cli/commit/2f5392ae1f87fd3df3d7e521e0e69222fb9899e5) [#8135](https://github.com/npm/cli/pull/8135) make `npm run` autocomplete work with workspaces (#8135) (@terrainvidia)
### Documentation
* [`26b6454`](https://github.com/npm/cli/commit/26b64543ebb27e421c05643eb996f6765c13444c) fix grammer in local path note (@cgay)
* [`1c0e83d`](https://github.com/npm/cli/commit/1c0e83d6c165a714c7c37c0887e350042e53cf34) [#7886](https://github.com/npm/cli/pull/7886) fix typo in package-json.md (#7886) (@stoneLeaf)
* [`14efa57`](https://github.com/npm/cli/commit/14efa57f13b2bbbf10b0b217b981f919556789cd) [#8178](https://github.com/npm/cli/pull/8178) fix example package name in `overrides` explainer (#8178) (@G-Rath)
* [`4183cba`](https://github.com/npm/cli/commit/4183cba3e13bcfea83fa3ef2b6c5b0c9685f79bc) [#8162](https://github.com/npm/cli/pull/8162) logging: replace proceeding with preceding in loglevels details (#8162) (@tyleralbee)
### Dependencies
* [`e57f112`](https://github.com/npm/cli/commit/e57f1126e496aa88e7164bf3102147b95d96c9c8) [#8207](https://github.com/npm/cli/pull/8207) `minipass-fetch@4.0.1`
* [`3daabb1`](https://github.com/npm/cli/commit/3daabb1a0cd048db303a9246ab6855f2a0550c96) [#8207](https://github.com/npm/cli/pull/8207) `minizlib@3.0.2`
* [`c7a7527`](https://github.com/npm/cli/commit/c7a752709509baffe674ca6d49e480835ff4a2df) [#8207](https://github.com/npm/cli/pull/8207) `ci-info@4.2.0`
* [`20b09b6`](https://github.com/npm/cli/commit/20b09b67bedca8d2d49404d32d031bf1d875bf81) [#8207](https://github.com/npm/cli/pull/8207) `node-gyp@11.2.0`
* [`679bc4a`](https://github.com/npm/cli/commit/679bc4a71614bffedfbea3058af13c7deb69fcd4) [#8129](https://github.com/npm/cli/pull/8129) `@npmcli/run-script@9.1.0`
### Chores
* [`3fbed84`](https://github.com/npm/cli/commit/3fbed848c1f909cf1321ad0916f938bae116219f) [#8207](https://github.com/npm/cli/pull/8207) install rimraf as a devdependency for smoke tests (@owlstronaut)
* [`43f0b41`](https://github.com/npm/cli/commit/43f0b41a17b32997e7de9369c485acc8aa661c0a) [#8207](https://github.com/npm/cli/pull/8207) dev dependency updates (@wraithgar)
* [`26803bc`](https://github.com/npm/cli/commit/26803bc46cf85e400b66644c975ee99f6fd0575e) [#8147](https://github.com/npm/cli/pull/8147) release integration node 23 yml (#8147) (@reggi)
* [`d679a1a`](https://github.com/npm/cli/commit/d679a1ae9e22eb01663d3390b9522b1b5380db32) [#8146](https://github.com/npm/cli/pull/8146) release integration node 23 (#8146) (@reggi)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.2): `@npmcli/arborist@9.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.2.0): `@npmcli/config@10.2.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.2): `libnpmdiff@8.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.1): `libnpmexec@10.1.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.2): `libnpmfund@7.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.2): `libnpmpack@9.0.2`

## [11.2.0](https://github.com/npm/cli/compare/v11.1.0...v11.2.0) (2025-03-05)
### Features
* [`247ee1d`](https://github.com/npm/cli/commit/247ee1d95a12983e181c3c3f2f1fdb790dd21794) [#8100](https://github.com/npm/cli/pull/8100) cache: add npx commands (@wraithgar)
* [`3a80a7b`](https://github.com/npm/cli/commit/3a80a7b7d168c23b5e297cba7b47ba5b9875934d) [#8081](https://github.com/npm/cli/pull/8081) add --init-type flag (#8081) (@reggi)
* [`2a1e11f`](https://github.com/npm/cli/commit/2a1e11f1f6e4a4c948b8ac52b9cda8f370d8674b) [#8071](https://github.com/npm/cli/pull/8071) move nerfDart list into @npmcli/config (@wraithgar)
### Bug Fixes
* [`8461186`](https://github.com/npm/cli/commit/846118686849f821b084775f7891038013f7ba97) [#8100](https://github.com/npm/cli/pull/8100) update npx cache if possible when spec is a range (@wraithgar)
* [`e345cc5`](https://github.com/npm/cli/commit/e345cc58ecad0e1e18eefc00638d7fa32966c2b7) [#8050](https://github.com/npm/cli/pull/8050) don't suggest npm update outside of valid engine range (#8050) (@milaninfy)
* [`811ca29`](https://github.com/npm/cli/commit/811ca2927eed733c8fabf308bf9d467e7c959163) [#8115](https://github.com/npm/cli/pull/8115) stop working around bug fixed in `npm-package-arg@12.0.2` (@TrevorBurnham)
* [`879303c`](https://github.com/npm/cli/commit/879303cd7c529a04d855f47d14dce433118ac626) [#8078](https://github.com/npm/cli/pull/8078) warn on invalid publishConfig (#8078) (@wraithgar)
* [`41417de`](https://github.com/npm/cli/commit/41417de9f493969a5826d05d7024fdd1da8d88da) [#8080](https://github.com/npm/cli/pull/8080) warn when TUF fetching of keys fails (#8080) (@wraithgar)
* [`593c849`](https://github.com/npm/cli/commit/593c84921b0df963cef2ca7b13e44acc20cbd558) [#8076](https://github.com/npm/cli/pull/8076) warn on invalid single-hyphen cli flags (#8076) (@wraithgar)
### Dependencies
* [`3d8b257`](https://github.com/npm/cli/commit/3d8b257bd667e76e74236c756aaa2dceaa6d6e5e) [#8100](https://github.com/npm/cli/pull/8100) `@npmcli/package-json@6.1.1`
* [`ab17523`](https://github.com/npm/cli/commit/ab175238dd885e2aa6cf2be21796055c629ec1e5) [#8134](https://github.com/npm/cli/pull/8134) `supports-color@10.0.0`
* [`3cbe21a`](https://github.com/npm/cli/commit/3cbe21ae64d5c1276c9aa6b53876fe86c165867d) [#8134](https://github.com/npm/cli/pull/8134) `foreground-child@3.3.1`
* [`ee5e1aa`](https://github.com/npm/cli/commit/ee5e1aa43e69e89da5ce210969a2f4cc1e3e08b0) [#8118](https://github.com/npm/cli/pull/8118) `@npmcli/redact@3.1.1`
* [`5df69b4`](https://github.com/npm/cli/commit/5df69b42be4e16b770d4452520a37f9456c26b66) [#8118](https://github.com/npm/cli/pull/8118) `exponential-backoff@3.1.2`
* [`80c3273`](https://github.com/npm/cli/commit/80c3273901e9878ec5492e8d99cca5ef14324a60) [#8118](https://github.com/npm/cli/pull/8118) `read@4.1.0`
* [`7fd70fa`](https://github.com/npm/cli/commit/7fd70fa2660c549cb564f956db0f5d0d2363db98) [#8118](https://github.com/npm/cli/pull/8118) `node-gyp@11.1.0`
* [`7aeffff`](https://github.com/npm/cli/commit/7aeffff2a39446b28319cbac5dbbd949d1965412) [#8118](https://github.com/npm/cli/pull/8118) `cidr-regex@4.1.3`
* [`b0c0490`](https://github.com/npm/cli/commit/b0c04908d413e71704cf8f5c6f469ab005c7385b) [#8118](https://github.com/npm/cli/pull/8118) `is-cidr@5.1.1`
* [`ef49d6b`](https://github.com/npm/cli/commit/ef49d6bcc8130f3e25f92b123bc46abe8a64e773) [#8118](https://github.com/npm/cli/pull/8118) `sigstore@3.1.0`
* [`1399bfb`](https://github.com/npm/cli/commit/1399bfb24ac04fcdc3d7464488dc4e8cd191b9da) [#8118](https://github.com/npm/cli/pull/8118) `socks@2.8.4`
* [`6b72107`](https://github.com/npm/cli/commit/6b72107063757bfd4b061dde01029a8a75c5e8b4) [#8118](https://github.com/npm/cli/pull/8118) `semver@7.7.1`
* [`c9ad0c4`](https://github.com/npm/cli/commit/c9ad0c4bbee2ee13a1521e10268edbbb3b794e8e) [#8118](https://github.com/npm/cli/pull/8118) `@npmcli/git@6.0.3`
* [`b153927`](https://github.com/npm/cli/commit/b153927feca3717598440b82a705281d652b4bf0) [#8115](https://github.com/npm/cli/pull/8115) `npm-package-arg@12.0.2`
* [`f0f6265`](https://github.com/npm/cli/commit/f0f626526b86bb54862bb4c0e3c24adfc0f1c8ce) [#8071](https://github.com/npm/cli/pull/8071) `nopt@8.1.0`
### Chores
* [`cc72b89`](https://github.com/npm/cli/commit/cc72b89cc07993a0fa3a7fb55ab91ac2798de7a2) [#8143](https://github.com/npm/cli/pull/8143) fix smoke tests to account for new release versions within a workspace (#8143) (@reggi)
* [`c3810bc`](https://github.com/npm/cli/commit/c3810bc8735336e6983fefb811f8e08279f7cddf) [#8134](https://github.com/npm/cli/pull/8134) dev dependency updates (@wraithgar)
* [`9dc40e6`](https://github.com/npm/cli/commit/9dc40e6c96c2c019c95fdc745bc1756da08bcc28) [#8118](https://github.com/npm/cli/pull/8118) dev dependency updates (@wraithgar)
* [`7ec0831`](https://github.com/npm/cli/commit/7ec0831b22eb65b69c0f0908139e582ff5b5af15) [#8118](https://github.com/npm/cli/pull/8118) update jsonpath-plus (@wraithgar)
* [`ed85b01`](https://github.com/npm/cli/commit/ed85b014bfb050ae4ae04827133d49b0f78c5df0) [#8071](https://github.com/npm/cli/pull/8071) tests for config warnings/changes (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.0.1): `@npmcli/arborist@9.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.1.0): `@npmcli/config@10.1.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.1): `libnpmdiff@8.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.0): `libnpmexec@10.1.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.1): `libnpmfund@7.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.1): `libnpmpack@9.0.1`

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
