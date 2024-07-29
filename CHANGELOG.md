# Changelog

## [10.8.3](https://github.com/npm/cli/compare/v10.8.2...v10.8.3) (2024-07-29)

### Bug Fixes

* [`4e81a6a`](https://github.com/npm/cli/commit/4e81a6a4106e4e125b0eefda042b75cfae0a5f23) [#7674](https://github.com/npm/cli/pull/7674) always set exit code if exiting uncleanly (#7674) (@wraithgar, @hashtagchris)
* [`a947f25`](https://github.com/npm/cli/commit/a947f25bd4576f7ef70fe6b1226e72252fa7a571) [#7679](https://github.com/npm/cli/pull/7679) update lifecycle script list in run-script (#7679) (@sonsurim)

### Chores

* [`86b05fc`](https://github.com/npm/cli/commit/86b05fc8f110cadc67fcf7417bc0646289919000) [#7683](https://github.com/npm/cli/pull/7683) allow for longer timer values (#7683) (@wraithgar)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v8.1.4): `libnpmexec@8.1.4`

## [10.8.2](https://github.com/npm/cli/compare/v10.8.1...v10.8.2) (2024-07-09)

### Bug Fixes

* [`3101a40`](https://github.com/npm/cli/commit/3101a4045bd7030f232d6cb2ae61339214968321) [#7631](https://github.com/npm/cli/pull/7631) limit concurrent open files during 'npm cache verify' (#7631) (@oikumene)
* [`2273183`](https://github.com/npm/cli/commit/22731831e22011e32fa0ca12178e242c2ee2b33d) [#7595](https://github.com/npm/cli/pull/7595) outdated: fixed wanted range for alias with version range (#7595) (@milaninfy)
* [`15be6dd`](https://github.com/npm/cli/commit/15be6dd33bfab8bdfaf8c3dece435d7139c1bf6d) [#7574](https://github.com/npm/cli/pull/7574) don't try parsing workspaces if none exist (@wraithgar)

### Documentation

* [`ac937d4`](https://github.com/npm/cli/commit/ac937d4f29b27fb877f79f33034ee1144c7202c4) [#7616](https://github.com/npm/cli/pull/7616) install: add save-peer flag (#7616) (@drew4237)
* [`55639ef`](https://github.com/npm/cli/commit/55639efd2d3094ca0931ddf9276c93f6880cd6e6) [#7615](https://github.com/npm/cli/pull/7615) use git+https in package.com url examples (#7615) (@MikeMcC399)
* [`93883bb`](https://github.com/npm/cli/commit/93883bb6459208a916584cad8c6c72a315cf32af) [#7582](https://github.com/npm/cli/pull/7582) Improve manpage section for `package.json` `funding` properties (#7582) (@kemitchell)
* [`92e71e6`](https://github.com/npm/cli/commit/92e71e6b0c7889e243e6b54ef8b4eb9656de95f8) [#7576](https://github.com/npm/cli/pull/7576) fix links to community discussions (#7576) (@leobalter)

### Dependencies

* [`1c1adae`](https://github.com/npm/cli/commit/1c1adaeeb59401db32d3d1ac4074654c87cd6f25) [#7636](https://github.com/npm/cli/pull/7636) `npm-pick-manifest@9.1.0`
* [`5e4fa18`](https://github.com/npm/cli/commit/5e4fa18dc02cd6b99df51e220661d82b2db12c3d) [#7636](https://github.com/npm/cli/pull/7636) `socks-proxy-agent@8.0.4`
* [`d8fa116`](https://github.com/npm/cli/commit/d8fa116f142044d3774439cf64dd51e8acb5bcff) [#7636](https://github.com/npm/cli/pull/7636) `https-proxy-agent@7.0.5`
* [`76dab91`](https://github.com/npm/cli/commit/76dab917eb22f5079cbb8bc052ec7c5bb07e9389) [#7636](https://github.com/npm/cli/pull/7636) `normalize-package-data@6.0.2`
* [`094c4ea`](https://github.com/npm/cli/commit/094c4ea17398d092a8b2c631564209c10183d417) [#7636](https://github.com/npm/cli/pull/7636) `minimatch@9.0.5`
* [`1c8d41d`](https://github.com/npm/cli/commit/1c8d41ddafc5810511d54fd227ce964c503464e0) [#7636](https://github.com/npm/cli/pull/7636) `@npmcli/git@5.0.8`
* [`e5451e1`](https://github.com/npm/cli/commit/e5451e1e91d7a71546f21daca604fb956c1cac3f) [#7605](https://github.com/npm/cli/pull/7605) `jackspeak@3.4.0`
* [`7b584d3`](https://github.com/npm/cli/commit/7b584d3b60ff118fd04f3ee5693816d9e948ff1b) [#7605](https://github.com/npm/cli/pull/7605) `foreground-child@3.2.1`
* [`941d0d7`](https://github.com/npm/cli/commit/941d0d7b596ec4cc2d21f86fb03876e2c6360987) [#7605](https://github.com/npm/cli/pull/7605) `debug@4.3.5`
* [`8b8ce7a`](https://github.com/npm/cli/commit/8b8ce7a23543a4d28c850fa27cd411de68a74cfd) [#7605](https://github.com/npm/cli/pull/7605) `glob@10.4.2`
* [`4646768`](https://github.com/npm/cli/commit/46467680d0e75c95406e46b5e2f754d2b7df1f7b) [#7605](https://github.com/npm/cli/pull/7605) `npm-registry-fetch@17.1.0`
* [`6f0d7ce`](https://github.com/npm/cli/commit/6f0d7cec260993d269294e05e18eacf23935b78a) [#7605](https://github.com/npm/cli/pull/7605) `@npmcli/redact@2.0.1`
* [`29204c8`](https://github.com/npm/cli/commit/29204c8ad4be0a1ffbca6f40393b00278bb34b3e) [#7605](https://github.com/npm/cli/pull/7605) `@npmcli/package-json@5.2.0`
* [`04d6910`](https://github.com/npm/cli/commit/04d6910e474003762b4606837960b4eb10d7bcd9) [#7574](https://github.com/npm/cli/pull/7574) `@npmcli/package-json@5.1.1`
* [`4ef4830`](https://github.com/npm/cli/commit/4ef4830dd792c2f23d3ffc7a10f797fc4ac8e5cb) [#7574](https://github.com/npm/cli/pull/7574) remove read-package-json-fast
## [10.8.2](https://github.com/npm/cli/compare/v10.8.1...v10.8.2) (2024-07-09)

### Bug Fixes

* [`3101a40`](https://github.com/npm/cli/commit/3101a4045bd7030f232d6cb2ae61339214968321) [#7631](https://github.com/npm/cli/pull/7631) limit concurrent open files during 'npm cache verify' (#7631) (@oikumene)
* [`2273183`](https://github.com/npm/cli/commit/22731831e22011e32fa0ca12178e242c2ee2b33d) [#7595](https://github.com/npm/cli/pull/7595) outdated: fixed wanted range for alias with version range (#7595) (@milaninfy)
* [`15be6dd`](https://github.com/npm/cli/commit/15be6dd33bfab8bdfaf8c3dece435d7139c1bf6d) [#7574](https://github.com/npm/cli/pull/7574) don't try parsing workspaces if none exist (@wraithgar)

### Documentation

* [`ac937d4`](https://github.com/npm/cli/commit/ac937d4f29b27fb877f79f33034ee1144c7202c4) [#7616](https://github.com/npm/cli/pull/7616) install: add save-peer flag (#7616) (@drew4237)
* [`55639ef`](https://github.com/npm/cli/commit/55639efd2d3094ca0931ddf9276c93f6880cd6e6) [#7615](https://github.com/npm/cli/pull/7615) use git+https in package.com url examples (#7615) (@MikeMcC399)
* [`93883bb`](https://github.com/npm/cli/commit/93883bb6459208a916584cad8c6c72a315cf32af) [#7582](https://github.com/npm/cli/pull/7582) Improve manpage section for `package.json` `funding` properties (#7582) (@kemitchell)
* [`92e71e6`](https://github.com/npm/cli/commit/92e71e6b0c7889e243e6b54ef8b4eb9656de95f8) [#7576](https://github.com/npm/cli/pull/7576) fix links to community discussions (#7576) (@leobalter)

### Dependencies

* [`1c1adae`](https://github.com/npm/cli/commit/1c1adaeeb59401db32d3d1ac4074654c87cd6f25) [#7636](https://github.com/npm/cli/pull/7636) `npm-pick-manifest@9.1.0`
* [`5e4fa18`](https://github.com/npm/cli/commit/5e4fa18dc02cd6b99df51e220661d82b2db12c3d) [#7636](https://github.com/npm/cli/pull/7636) `socks-proxy-agent@8.0.4`
* [`d8fa116`](https://github.com/npm/cli/commit/d8fa116f142044d3774439cf64dd51e8acb5bcff) [#7636](https://github.com/npm/cli/pull/7636) `https-proxy-agent@7.0.5`
* [`76dab91`](https://github.com/npm/cli/commit/76dab917eb22f5079cbb8bc052ec7c5bb07e9389) [#7636](https://github.com/npm/cli/pull/7636) `normalize-package-data@6.0.2`
* [`094c4ea`](https://github.com/npm/cli/commit/094c4ea17398d092a8b2c631564209c10183d417) [#7636](https://github.com/npm/cli/pull/7636) `minimatch@9.0.5`
* [`1c8d41d`](https://github.com/npm/cli/commit/1c8d41ddafc5810511d54fd227ce964c503464e0) [#7636](https://github.com/npm/cli/pull/7636) `@npmcli/git@5.0.8`
* [`e5451e1`](https://github.com/npm/cli/commit/e5451e1e91d7a71546f21daca604fb956c1cac3f) [#7605](https://github.com/npm/cli/pull/7605) `jackspeak@3.4.0`
* [`7b584d3`](https://github.com/npm/cli/commit/7b584d3b60ff118fd04f3ee5693816d9e948ff1b) [#7605](https://github.com/npm/cli/pull/7605) `foreground-child@3.2.1`
* [`941d0d7`](https://github.com/npm/cli/commit/941d0d7b596ec4cc2d21f86fb03876e2c6360987) [#7605](https://github.com/npm/cli/pull/7605) `debug@4.3.5`
* [`8b8ce7a`](https://github.com/npm/cli/commit/8b8ce7a23543a4d28c850fa27cd411de68a74cfd) [#7605](https://github.com/npm/cli/pull/7605) `glob@10.4.2`
* [`4646768`](https://github.com/npm/cli/commit/46467680d0e75c95406e46b5e2f754d2b7df1f7b) [#7605](https://github.com/npm/cli/pull/7605) `npm-registry-fetch@17.1.0`
* [`6f0d7ce`](https://github.com/npm/cli/commit/6f0d7cec260993d269294e05e18eacf23935b78a) [#7605](https://github.com/npm/cli/pull/7605) `@npmcli/redact@2.0.1`
* [`29204c8`](https://github.com/npm/cli/commit/29204c8ad4be0a1ffbca6f40393b00278bb34b3e) [#7605](https://github.com/npm/cli/pull/7605) `@npmcli/package-json@5.2.0`
* [`04d6910`](https://github.com/npm/cli/commit/04d6910e474003762b4606837960b4eb10d7bcd9) [#7574](https://github.com/npm/cli/pull/7574) `@npmcli/package-json@5.1.1`
* [`4ef4830`](https://github.com/npm/cli/commit/4ef4830dd792c2f23d3ffc7a10f797fc4ac8e5cb) [#7574](https://github.com/npm/cli/pull/7574) remove read-package-json-fast

### Chores

* [`2490b49`](https://github.com/npm/cli/commit/2490b492cc8d9a351841d2c643b13a47a3254f41) [#7621](https://github.com/npm/cli/pull/7621) remove .github/workflows/benchmark.yml (#7621) (@wraithgar)
* [`3b8b111`](https://github.com/npm/cli/commit/3b8b11161ee2f88817dcc19b4770040d5bc73261) [#7605](https://github.com/npm/cli/pull/7605) update devDependencies in lockfile (@wraithgar)

### Chores

* [`2490b49`](https://github.com/npm/cli/commit/2490b492cc8d9a351841d2c643b13a47a3254f41) [#7621](https://github.com/npm/cli/pull/7621) remove .github/workflows/benchmark.yml (#7621) (@wraithgar)
* [`3b8b111`](https://github.com/npm/cli/commit/3b8b11161ee2f88817dcc19b4770040d5bc73261) [#7605](https://github.com/npm/cli/pull/7605) update devDependencies in lockfile (@wraithgar)

## [10.8.1](https://github.com/npm/cli/compare/v10.8.0...v10.8.1) (2024-05-29)

### Bug Fixes

* [`6b55646`](https://github.com/npm/cli/commit/6b556468f9d6ed62c681954bfe6ad012315e3b53) [#7569](https://github.com/npm/cli/pull/7569) exec: look in workspace and root for bin entries (#7569) (@wraithgar)
* [`e4c7a41`](https://github.com/npm/cli/commit/e4c7a410f590e5c9c81f6410f600181a4deef005) [#7564](https://github.com/npm/cli/pull/7564) publish: skip workspace packages marked private on publish (#7564) (@milaninfy)
* [`8f94ae8`](https://github.com/npm/cli/commit/8f94ae8c4d36cd397c53e8dc9f54d4332bf1b847) [#7556](https://github.com/npm/cli/pull/7556) utils/tar: index access while match is null (#7555) (#7556) (@NormanPerrin)
* [`2d1d8d0`](https://github.com/npm/cli/commit/2d1d8d0ef18a10ac7938380884745f1d3c3cb078) [#7559](https://github.com/npm/cli/pull/7559) adds `node:` specifier to all native node modules (#7559) (@reggi)
* [`7d89b55`](https://github.com/npm/cli/commit/7d89b55341160459e0fcd3374c3720d758b16339) [#7490](https://github.com/npm/cli/pull/7490) ci: rm workspace node_modules (#7490) (@reggi)
* [`9122fb6`](https://github.com/npm/cli/commit/9122fb65ac05d793a69f4fdcbd03b59595adf937) [#7516](https://github.com/npm/cli/pull/7516) cache: add both full and minified packument to cache (#7516) (@milaninfy)
* [`9e6686b`](https://github.com/npm/cli/commit/9e6686bb965fa6843ea483cb802f14282eabf3e5) [#7545](https://github.com/npm/cli/pull/7545) send proper otp token on web auth (#7545) (@wraithgar)
* [`b1db070`](https://github.com/npm/cli/commit/b1db070cb4a497fd91fd61cf197d28b5d47274bb) [#7534](https://github.com/npm/cli/pull/7534) refactor: use output.buffer and set explicit json mode in query (#7534) (@lukekarrys)
* [`53cda32`](https://github.com/npm/cli/commit/53cda32aa35f3a592fb0ddf37e43c028f93ef613) [#7542](https://github.com/npm/cli/pull/7542) refactor ls to use output.buffer for json (#7542) (@lukekarrys)
* [`61d5771`](https://github.com/npm/cli/commit/61d57719e6443978c5e9a91ca7a63397be3065fa) [#7541](https://github.com/npm/cli/pull/7541) remove json.stringify from all commands (#7541) (@lukekarrys)
* [`4dfc7d2`](https://github.com/npm/cli/commit/4dfc7d20b58eaa3d231ef5dc86b9802e1c0d0e68) [#7540](https://github.com/npm/cli/pull/7540) pass strings to JSON.stringify in --json mode (#7540) (@lukekarrys)
* [`3cefdf6`](https://github.com/npm/cli/commit/3cefdf6eaab5bfb4371149f674dc95e9b9c54853) [#7538](https://github.com/npm/cli/pull/7538) outdated: return array for outdated deps from multiple workspaces (@lukekarrys)
* [`ef4c975`](https://github.com/npm/cli/commit/ef4c975f2784f70ab86a3e7e6e40c99279e5a3e3) [#7508](https://github.com/npm/cli/pull/7508) view: dont immediately exit on first workspace 404 (#7508) (@lukekarrys)

### Documentation

* [`fd6479f`](https://github.com/npm/cli/commit/fd6479f85b9cf14a23cb4f9a049e0ea68632d8e9) [#7560](https://github.com/npm/cli/pull/7560) update publish docs: dist-tag + publish case (#7560) (@davidlj95)

### Dependencies

* [`e3f0fd4`](https://github.com/npm/cli/commit/e3f0fd45d97569a0d6c2a67e179e4a5f13eb9442) [#7568](https://github.com/npm/cli/pull/7568) `@npmcli/package-json@5.1.1`
* [`447a8d7`](https://github.com/npm/cli/commit/447a8d7f3124bf9f69453098ce31b56bad20efd7) [#7566](https://github.com/npm/cli/pull/7566) `spdx-license-ids@3.0.18`
* [`83fed2e`](https://github.com/npm/cli/commit/83fed2e8ec253051d60babdf2b10e2f2c64df318) [#7566](https://github.com/npm/cli/pull/7566) `sigstore@2.3.1`
* [`41291ba`](https://github.com/npm/cli/commit/41291bab34d3f7351c94e97e89ac1f85b0950188) [#7566](https://github.com/npm/cli/pull/7566) `@sigstore/tuf@2.3.4`
* [`18b42a4`](https://github.com/npm/cli/commit/18b42a46abdbc26a28f2e16ea74a1812d8de4c4d) [#7566](https://github.com/npm/cli/pull/7566) `glob@10.4.1`
* [`5c6759d`](https://github.com/npm/cli/commit/5c6759decb00dfbe377c0ad41f85a3222f79a36a) [#7566](https://github.com/npm/cli/pull/7566) `postcss-selector-parser@6.1.0`
* [`2508a83`](https://github.com/npm/cli/commit/2508a83e6d2936d15c210b9dee41098131ed6aff) [#7566](https://github.com/npm/cli/pull/7566) `is-cidr@5.1.0`
* [`6278fe4`](https://github.com/npm/cli/commit/6278fe430bb7c3ecfae730f9ea084501e57c0e2c) [#7566](https://github.com/npm/cli/pull/7566) `ini@4.1.3`
## [10.8.1](https://github.com/npm/cli/compare/v10.8.0...v10.8.1) (2024-05-29)

### Bug Fixes

* [`6b55646`](https://github.com/npm/cli/commit/6b556468f9d6ed62c681954bfe6ad012315e3b53) [#7569](https://github.com/npm/cli/pull/7569) exec: look in workspace and root for bin entries (#7569) (@wraithgar)
* [`e4c7a41`](https://github.com/npm/cli/commit/e4c7a410f590e5c9c81f6410f600181a4deef005) [#7564](https://github.com/npm/cli/pull/7564) publish: skip workspace packages marked private on publish (#7564) (@milaninfy)
* [`8f94ae8`](https://github.com/npm/cli/commit/8f94ae8c4d36cd397c53e8dc9f54d4332bf1b847) [#7556](https://github.com/npm/cli/pull/7556) utils/tar: index access while match is null (#7555) (#7556) (@NormanPerrin)
* [`2d1d8d0`](https://github.com/npm/cli/commit/2d1d8d0ef18a10ac7938380884745f1d3c3cb078) [#7559](https://github.com/npm/cli/pull/7559) adds `node:` specifier to all native node modules (#7559) (@reggi)
* [`7d89b55`](https://github.com/npm/cli/commit/7d89b55341160459e0fcd3374c3720d758b16339) [#7490](https://github.com/npm/cli/pull/7490) ci: rm workspace node_modules (#7490) (@reggi)
* [`9122fb6`](https://github.com/npm/cli/commit/9122fb65ac05d793a69f4fdcbd03b59595adf937) [#7516](https://github.com/npm/cli/pull/7516) cache: add both full and minified packument to cache (#7516) (@milaninfy)
* [`9e6686b`](https://github.com/npm/cli/commit/9e6686bb965fa6843ea483cb802f14282eabf3e5) [#7545](https://github.com/npm/cli/pull/7545) send proper otp token on web auth (#7545) (@wraithgar)
* [`b1db070`](https://github.com/npm/cli/commit/b1db070cb4a497fd91fd61cf197d28b5d47274bb) [#7534](https://github.com/npm/cli/pull/7534) refactor: use output.buffer and set explicit json mode in query (#7534) (@lukekarrys)
* [`53cda32`](https://github.com/npm/cli/commit/53cda32aa35f3a592fb0ddf37e43c028f93ef613) [#7542](https://github.com/npm/cli/pull/7542) refactor ls to use output.buffer for json (#7542) (@lukekarrys)
* [`61d5771`](https://github.com/npm/cli/commit/61d57719e6443978c5e9a91ca7a63397be3065fa) [#7541](https://github.com/npm/cli/pull/7541) remove json.stringify from all commands (#7541) (@lukekarrys)
* [`4dfc7d2`](https://github.com/npm/cli/commit/4dfc7d20b58eaa3d231ef5dc86b9802e1c0d0e68) [#7540](https://github.com/npm/cli/pull/7540) pass strings to JSON.stringify in --json mode (#7540) (@lukekarrys)
* [`3cefdf6`](https://github.com/npm/cli/commit/3cefdf6eaab5bfb4371149f674dc95e9b9c54853) [#7538](https://github.com/npm/cli/pull/7538) outdated: return array for outdated deps from multiple workspaces (@lukekarrys)
* [`ef4c975`](https://github.com/npm/cli/commit/ef4c975f2784f70ab86a3e7e6e40c99279e5a3e3) [#7508](https://github.com/npm/cli/pull/7508) view: dont immediately exit on first workspace 404 (#7508) (@lukekarrys)

### Documentation

* [`fd6479f`](https://github.com/npm/cli/commit/fd6479f85b9cf14a23cb4f9a049e0ea68632d8e9) [#7560](https://github.com/npm/cli/pull/7560) update publish docs: dist-tag + publish case (#7560) (@davidlj95)

### Dependencies

* [`e3f0fd4`](https://github.com/npm/cli/commit/e3f0fd45d97569a0d6c2a67e179e4a5f13eb9442) [#7568](https://github.com/npm/cli/pull/7568) `@npmcli/package-json@5.1.1`
* [`447a8d7`](https://github.com/npm/cli/commit/447a8d7f3124bf9f69453098ce31b56bad20efd7) [#7566](https://github.com/npm/cli/pull/7566) `spdx-license-ids@3.0.18`
* [`83fed2e`](https://github.com/npm/cli/commit/83fed2e8ec253051d60babdf2b10e2f2c64df318) [#7566](https://github.com/npm/cli/pull/7566) `sigstore@2.3.1`
* [`41291ba`](https://github.com/npm/cli/commit/41291bab34d3f7351c94e97e89ac1f85b0950188) [#7566](https://github.com/npm/cli/pull/7566) `@sigstore/tuf@2.3.4`
* [`18b42a4`](https://github.com/npm/cli/commit/18b42a46abdbc26a28f2e16ea74a1812d8de4c4d) [#7566](https://github.com/npm/cli/pull/7566) `glob@10.4.1`
* [`5c6759d`](https://github.com/npm/cli/commit/5c6759decb00dfbe377c0ad41f85a3222f79a36a) [#7566](https://github.com/npm/cli/pull/7566) `postcss-selector-parser@6.1.0`
* [`2508a83`](https://github.com/npm/cli/commit/2508a83e6d2936d15c210b9dee41098131ed6aff) [#7566](https://github.com/npm/cli/pull/7566) `is-cidr@5.1.0`
* [`6278fe4`](https://github.com/npm/cli/commit/6278fe430bb7c3ecfae730f9ea084501e57c0e2c) [#7566](https://github.com/npm/cli/pull/7566) `ini@4.1.3`

### Chores

* [`2d84091`](https://github.com/npm/cli/commit/2d840917bbeff6a1eb5accc10a5ec1c2280b9470) [#7568](https://github.com/npm/cli/pull/7568) fix snapshots for updated @npmcli/package-json (@wraithgar)
* [`6574dc9`](https://github.com/npm/cli/commit/6574dc98705cf0a88ea6fe41a57d0d0adfcea439) [#7566](https://github.com/npm/cli/pull/7566) dev dependency updates (@wraithgar)

### Chores

* [`2d84091`](https://github.com/npm/cli/commit/2d840917bbeff6a1eb5accc10a5ec1c2280b9470) [#7568](https://github.com/npm/cli/pull/7568) fix snapshots for updated @npmcli/package-json (@wraithgar)
* [`6574dc9`](https://github.com/npm/cli/commit/6574dc98705cf0a88ea6fe41a57d0d0adfcea439) [#7566](https://github.com/npm/cli/pull/7566) dev dependency updates (@wraithgar)

## [10.8.0](https://github.com/npm/cli/compare/v10.7.0...v10.8.0) (2024-05-15)

### Features

* [`1e375c1`](https://github.com/npm/cli/commit/1e375c1f8d16ac114b615c2a2f374099345b0b69) [#7442](https://github.com/npm/cli/pull/7442) create exit handler class (#7442) (@lukekarrys)

### Bug Fixes

* [`d5c3289`](https://github.com/npm/cli/commit/d5c32899b6ffc6254c96f62a06a854bb2c2b95c5) [#7513](https://github.com/npm/cli/pull/7513) refactor: use output buffer and error for more commands (#7513) (@lukekarrys)
* [`12f103c`](https://github.com/npm/cli/commit/12f103ce55ed21c9c04f87a101fb64d55ac02d3c) [#7533](https://github.com/npm/cli/pull/7533) add first param titles to logs where missing (#7533) (@lukekarrys)
* [`badeac2`](https://github.com/npm/cli/commit/badeac28faf9fde5f8c05d235219be840999a646) [#7521](https://github.com/npm/cli/pull/7521) config: use redact on config output (#7521) (@lukekarrys)
* [`76aef74`](https://github.com/npm/cli/commit/76aef7423ab7e47a5f9b73849b47ba029730d75a) [#7520](https://github.com/npm/cli/pull/7520) view: refactor exec and execWorkspaces to call same methods (#7520) (@lukekarrys)
* [`b54cdb8`](https://github.com/npm/cli/commit/b54cdb836d6c4146a1aa8e1a5fe9655ba2ed0a6a) [#7515](https://github.com/npm/cli/pull/7515) refactor: create new error output primitives (#7515) (@lukekarrys)
* [`e40454c`](https://github.com/npm/cli/commit/e40454c35f75b5b814e7b5167c8a8b05664246f3) [#7506](https://github.com/npm/cli/pull/7506) view: dont unwrap arrays in json mode (#7506) (@lukekarrys)
* [`6f64148`](https://github.com/npm/cli/commit/6f6414829fd82704233fbb56375b167495a0aaf5) require stdout to be a TTY for progress (#7507) (@lukekarrys)
* [`db62910`](https://github.com/npm/cli/commit/db6291036f076bf0251b74a504bd5b693c29c4bb) [#7504](https://github.com/npm/cli/pull/7504) config: be more aggressive about hiding protected values (#7504) (@wraithgar)
* [`6d456bb`](https://github.com/npm/cli/commit/6d456bba46d6afe1e2cf9464908e6ad99375cb7c) [#7497](https://github.com/npm/cli/pull/7497) dont write log file for completion commands (#7497) (@lukekarrys)
* [`722c0fa`](https://github.com/npm/cli/commit/722c0faa387ae6e35886f08eefb238c03ae85db1) [#7463](https://github.com/npm/cli/pull/7463) limit packument cache size based on heap size (@wraithgar)
* [`ca1a68d`](https://github.com/npm/cli/commit/ca1a68d14d184f2535720ed4715f388965ade21a) [#7474](https://github.com/npm/cli/pull/7474) log if `npm deprecate` does not match any version (#7474) (@mbtools)
* [`261ea19`](https://github.com/npm/cli/commit/261ea193c96aaa73ce5630e21c6a31de9f19ef5b) [#7457](https://github.com/npm/cli/pull/7457) run input.start around help and openining urls (@lukekarrys)
* [`4ab6cf4`](https://github.com/npm/cli/commit/4ab6cf4a9e7fca64f95422f4099b33cdbb9efa25) [#7459](https://github.com/npm/cli/pull/7459) publish: validate dist-tag (#7459) (@reggi)

### Documentation

* [`b2ce025`](https://github.com/npm/cli/commit/b2ce0250e32abaaaf60d895cda210914bdf903ea) [#7518](https://github.com/npm/cli/pull/7518) suggest correct bin entry (#7518) (@Santoshraj2)
* [`bdd2aae`](https://github.com/npm/cli/commit/bdd2aae12b213815b5d800902b0a9722b263a03c) [#7502](https://github.com/npm/cli/pull/7502) remove obsolete removal using make uninstall (#7502) (@avinal)
* [`c3d2819`](https://github.com/npm/cli/commit/c3d281984ed363ed03d6a7abe083f301c1dd2c88) [#7496](https://github.com/npm/cli/pull/7496) npm help json/global command on windows (#7496) (@klm-turing, @lukekarrys)
* [`268303c`](https://github.com/npm/cli/commit/268303c3b40551ae558f201841d3d5977769a7c9) [#7479](https://github.com/npm/cli/pull/7479) add npm version to every local help output (#7479) (@klm-turing)
* [`e39d422`](https://github.com/npm/cli/commit/e39d422d69c2275ed1e3a606447a9b9d87bdca4f) [#7473](https://github.com/npm/cli/pull/7473) suggest "npm repo" for showing the repo of a package (#7473) (@full-stop)
* [`f6fff32`](https://github.com/npm/cli/commit/f6fff3295d19b63003cf49eb1c4805f453c5390a) [#7433](https://github.com/npm/cli/pull/7433) clarify what peerDependenciesMeta does (#7433) (@xuhdev, @wraithgar)

### Dependencies

* [`1cdc662`](https://github.com/npm/cli/commit/1cdc662bd2835531fbe790011a00f88ddb5f6868) [#7522](https://github.com/npm/cli/pull/7522) `@tufjs/repo-mock@2.0.1`
* [`898bcfd`](https://github.com/npm/cli/commit/898bcfda5c5ac192b2cf5f47d0b939794c1b2164) [#7522](https://github.com/npm/cli/pull/7522) `@sigstore/protobuf-specs@0.3.2`
* [`fec3c94`](https://github.com/npm/cli/commit/fec3c947d7dcc71071a8f527aa5bd81f47015486) [#7522](https://github.com/npm/cli/pull/7522) `path-scurry@1.11.1`
* [`cb85973`](https://github.com/npm/cli/commit/cb8597316a8d53815835901ae9d5756d4dc481ea) [#7522](https://github.com/npm/cli/pull/7522) `glob@10.3.15`
* [`e189873`](https://github.com/npm/cli/commit/e18987371399f508cb224e159987b10ddb922bb8) [#7498](https://github.com/npm/cli/pull/7498) `@sigstore/sign@2.3.1`
* [`c2b28f9`](https://github.com/npm/cli/commit/c2b28f9d6cba12e88f849e5b4a82607e2c218a16) [#7498](https://github.com/npm/cli/pull/7498) `minipass@7.1.1`
* [`9064ffc`](https://github.com/npm/cli/commit/9064ffc6c85309de2e9e798fdc6caca209f5fa18) [#7498](https://github.com/npm/cli/pull/7498) `@sigstore/tuf@2.3.3`
* [`fd42986`](https://github.com/npm/cli/commit/fd429866c79cc001979135857c019d7d2873f291) [#7498](https://github.com/npm/cli/pull/7498) `@npmcli/fs@3.1.1`
* [`4e53e33`](https://github.com/npm/cli/commit/4e53e33757c88ca9c413e3943b17e0cb246e955c) [#7498](https://github.com/npm/cli/pull/7498) `semver@7.6.2`
* [`f078c82`](https://github.com/npm/cli/commit/f078c8224f6775d53da98f310531524c616e6099) [#7495](https://github.com/npm/cli/pull/7495) `glob@10.3.14`
* [`58f773c`](https://github.com/npm/cli/commit/58f773c99742ef55ac2a9eca23c27b32800c2cf1) [#7495](https://github.com/npm/cli/pull/7495) `path-scurry@1.11.0`
* [`ea0b07d`](https://github.com/npm/cli/commit/ea0b07da149767265f11d5d77d2156e2c9f43e63) [#7482](https://github.com/npm/cli/pull/7482) `pacote@18.0.6`
* [`8d161a4`](https://github.com/npm/cli/commit/8d161a414160dab7a930b1668c3af3ba280e8532) [#7482](https://github.com/npm/cli/pull/7482) `semver@7.6.1`
* [`5b2317b`](https://github.com/npm/cli/commit/5b2317b472342428c6521d7b0d550d0fcc9bb202) [#7463](https://github.com/npm/cli/pull/7463) add lru-cache
* [`26fefb8`](https://github.com/npm/cli/commit/26fefb82b3bd812009b8b627e3c19032a931aade) [#7480](https://github.com/npm/cli/pull/7480) `promzard@1.0.2`
* [`2146e1f`](https://github.com/npm/cli/commit/2146e1f83ae94debecfaf08ef32e319c02223c12) [#7480](https://github.com/npm/cli/pull/7480) `npm-bundled@3.0.1`
* [`ff6c5d1`](https://github.com/npm/cli/commit/ff6c5d161b52e8961e0c2ebf0467bc1382ef72d2) [#7480](https://github.com/npm/cli/pull/7480) `minipass-fetch@3.0.5`
* [`419f9b9`](https://github.com/npm/cli/commit/419f9b9d9d6806d56b68d96bd50f7d25274a8f48) [#7480](https://github.com/npm/cli/pull/7480) `cmd-shim@6.0.3`
* [`dade2c8`](https://github.com/npm/cli/commit/dade2c88d23289d57351d614feaa876d9e1e17f4) [#7480](https://github.com/npm/cli/pull/7480) `minipass@7.1.0`
* [`18e5312`](https://github.com/npm/cli/commit/18e53129f0f3a19725e377b336336aa85ade3ba5) [#7480](https://github.com/npm/cli/pull/7480) `validate-npm-package-name@5.0.1`
* [`d440011`](https://github.com/npm/cli/commit/d44001164f66d15daa3fd27da004194478b7c99c) [#7480](https://github.com/npm/cli/pull/7480) `npm-user-validate@2.0.1`
* [`552113e`](https://github.com/npm/cli/commit/552113e7a663efdcebfcbcc6148b1d51be55596b) [#7480](https://github.com/npm/cli/pull/7480) `ignore-walk@6.0.5`
* [`7e15b6d`](https://github.com/npm/cli/commit/7e15b6d56abbf47456c12fa2d5688d5d187a0ae7) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/metavuln-calculator@7.1.1`
* [`8b20f8c`](https://github.com/npm/cli/commit/8b20f8c8ba70e43ad222538fc396dedb071b1680) [#7480](https://github.com/npm/cli/pull/7480) `ssri@10.0.6`
* [`a9a6dcd`](https://github.com/npm/cli/commit/a9a6dcd4427ec82e491a2cad5672d8183e12180f) [#7480](https://github.com/npm/cli/pull/7480) `pacote@18.0.5`
* [`e2fdb65`](https://github.com/npm/cli/commit/e2fdb651cda9ec603f009f5713a5a2b489d49e15) [#7480](https://github.com/npm/cli/pull/7480) `npm-pick-manifest@9.0.1`
* [`310a7a5`](https://github.com/npm/cli/commit/310a7a5583d14da761d38b7421ebb6cee65600b6) [#7480](https://github.com/npm/cli/pull/7480) `normalize-package-data@6.0.1`
* [`e71f541`](https://github.com/npm/cli/commit/e71f541b020de7940faccffab68d0255c4079e1a) [#7480](https://github.com/npm/cli/pull/7480) `nopt@7.2.1`
* [`18c3b40`](https://github.com/npm/cli/commit/18c3b4058c7f721ff585de2f2766e53da897e16e) [#7480](https://github.com/npm/cli/pull/7480) `json-parse-even-better-errors@3.0.2`
* [`4c5bf77`](https://github.com/npm/cli/commit/4c5bf77af6db3b447f9b9abc3b67b211d7bb82b8) [#7480](https://github.com/npm/cli/pull/7480) `init-package-json@6.0.3`
* [`714e3e1`](https://github.com/npm/cli/commit/714e3e1e1ce014cba71db41c2d6c02d9dd53fcd3) [#7480](https://github.com/npm/cli/pull/7480) `hosted-git-info@7.0.2`
* [`f94d672`](https://github.com/npm/cli/commit/f94d6726a6ca96cad0da88ea499fa22f35b7c4c0) [#7480](https://github.com/npm/cli/pull/7480) `cacache@18.0.3`
* [`43331e4`](https://github.com/npm/cli/commit/43331e4d0647c3af4cc2aa3db8b47d797584a6d8) [#7480](https://github.com/npm/cli/pull/7480) `bin-links@4.0.4`
* [`8234412`](https://github.com/npm/cli/commit/823441219ce63d7863aede8b22b4b1d07021fd22) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/promise-spawn@7.0.2`
* [`6dfaebb`](https://github.com/npm/cli/commit/6dfaebb8f08acf992ac36faf4db8b650e8e55eae) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/git@5.0.7`
* [`63ef498`](https://github.com/npm/cli/commit/63ef498bf2916a882a92c0b9fe6de6728584694a) [#7457](https://github.com/npm/cli/pull/7457) `npm-registry-fetch@17.0.1`
* [`4cbc2d4`](https://github.com/npm/cli/commit/4cbc2d402174933052c7addd6ea55b1ecee202c5) [#7457](https://github.com/npm/cli/pull/7457) `npm-profile@10.0.0`
## [10.8.0](https://github.com/npm/cli/compare/v10.7.0...v10.8.0) (2024-05-15)

### Features

* [`1e375c1`](https://github.com/npm/cli/commit/1e375c1f8d16ac114b615c2a2f374099345b0b69) [#7442](https://github.com/npm/cli/pull/7442) create exit handler class (#7442) (@lukekarrys)

### Bug Fixes

* [`d5c3289`](https://github.com/npm/cli/commit/d5c32899b6ffc6254c96f62a06a854bb2c2b95c5) [#7513](https://github.com/npm/cli/pull/7513) refactor: use output buffer and error for more commands (#7513) (@lukekarrys)
* [`12f103c`](https://github.com/npm/cli/commit/12f103ce55ed21c9c04f87a101fb64d55ac02d3c) [#7533](https://github.com/npm/cli/pull/7533) add first param titles to logs where missing (#7533) (@lukekarrys)
* [`badeac2`](https://github.com/npm/cli/commit/badeac28faf9fde5f8c05d235219be840999a646) [#7521](https://github.com/npm/cli/pull/7521) config: use redact on config output (#7521) (@lukekarrys)
* [`76aef74`](https://github.com/npm/cli/commit/76aef7423ab7e47a5f9b73849b47ba029730d75a) [#7520](https://github.com/npm/cli/pull/7520) view: refactor exec and execWorkspaces to call same methods (#7520) (@lukekarrys)
* [`b54cdb8`](https://github.com/npm/cli/commit/b54cdb836d6c4146a1aa8e1a5fe9655ba2ed0a6a) [#7515](https://github.com/npm/cli/pull/7515) refactor: create new error output primitives (#7515) (@lukekarrys)
* [`e40454c`](https://github.com/npm/cli/commit/e40454c35f75b5b814e7b5167c8a8b05664246f3) [#7506](https://github.com/npm/cli/pull/7506) view: dont unwrap arrays in json mode (#7506) (@lukekarrys)
* [`6f64148`](https://github.com/npm/cli/commit/6f6414829fd82704233fbb56375b167495a0aaf5) require stdout to be a TTY for progress (#7507) (@lukekarrys)
* [`db62910`](https://github.com/npm/cli/commit/db6291036f076bf0251b74a504bd5b693c29c4bb) [#7504](https://github.com/npm/cli/pull/7504) config: be more aggressive about hiding protected values (#7504) (@wraithgar)
* [`6d456bb`](https://github.com/npm/cli/commit/6d456bba46d6afe1e2cf9464908e6ad99375cb7c) [#7497](https://github.com/npm/cli/pull/7497) dont write log file for completion commands (#7497) (@lukekarrys)
* [`722c0fa`](https://github.com/npm/cli/commit/722c0faa387ae6e35886f08eefb238c03ae85db1) [#7463](https://github.com/npm/cli/pull/7463) limit packument cache size based on heap size (@wraithgar)
* [`ca1a68d`](https://github.com/npm/cli/commit/ca1a68d14d184f2535720ed4715f388965ade21a) [#7474](https://github.com/npm/cli/pull/7474) log if `npm deprecate` does not match any version (#7474) (@mbtools)
* [`261ea19`](https://github.com/npm/cli/commit/261ea193c96aaa73ce5630e21c6a31de9f19ef5b) [#7457](https://github.com/npm/cli/pull/7457) run input.start around help and openining urls (@lukekarrys)
* [`4ab6cf4`](https://github.com/npm/cli/commit/4ab6cf4a9e7fca64f95422f4099b33cdbb9efa25) [#7459](https://github.com/npm/cli/pull/7459) publish: validate dist-tag (#7459) (@reggi)

### Documentation

* [`b2ce025`](https://github.com/npm/cli/commit/b2ce0250e32abaaaf60d895cda210914bdf903ea) [#7518](https://github.com/npm/cli/pull/7518) suggest correct bin entry (#7518) (@Santoshraj2)
* [`bdd2aae`](https://github.com/npm/cli/commit/bdd2aae12b213815b5d800902b0a9722b263a03c) [#7502](https://github.com/npm/cli/pull/7502) remove obsolete removal using make uninstall (#7502) (@avinal)
* [`c3d2819`](https://github.com/npm/cli/commit/c3d281984ed363ed03d6a7abe083f301c1dd2c88) [#7496](https://github.com/npm/cli/pull/7496) npm help json/global command on windows (#7496) (@klm-turing, @lukekarrys)
* [`268303c`](https://github.com/npm/cli/commit/268303c3b40551ae558f201841d3d5977769a7c9) [#7479](https://github.com/npm/cli/pull/7479) add npm version to every local help output (#7479) (@klm-turing)
* [`e39d422`](https://github.com/npm/cli/commit/e39d422d69c2275ed1e3a606447a9b9d87bdca4f) [#7473](https://github.com/npm/cli/pull/7473) suggest "npm repo" for showing the repo of a package (#7473) (@full-stop)
* [`f6fff32`](https://github.com/npm/cli/commit/f6fff3295d19b63003cf49eb1c4805f453c5390a) [#7433](https://github.com/npm/cli/pull/7433) clarify what peerDependenciesMeta does (#7433) (@xuhdev, @wraithgar)

### Dependencies

* [`1cdc662`](https://github.com/npm/cli/commit/1cdc662bd2835531fbe790011a00f88ddb5f6868) [#7522](https://github.com/npm/cli/pull/7522) `@tufjs/repo-mock@2.0.1`
* [`898bcfd`](https://github.com/npm/cli/commit/898bcfda5c5ac192b2cf5f47d0b939794c1b2164) [#7522](https://github.com/npm/cli/pull/7522) `@sigstore/protobuf-specs@0.3.2`
* [`fec3c94`](https://github.com/npm/cli/commit/fec3c947d7dcc71071a8f527aa5bd81f47015486) [#7522](https://github.com/npm/cli/pull/7522) `path-scurry@1.11.1`
* [`cb85973`](https://github.com/npm/cli/commit/cb8597316a8d53815835901ae9d5756d4dc481ea) [#7522](https://github.com/npm/cli/pull/7522) `glob@10.3.15`
* [`e189873`](https://github.com/npm/cli/commit/e18987371399f508cb224e159987b10ddb922bb8) [#7498](https://github.com/npm/cli/pull/7498) `@sigstore/sign@2.3.1`
* [`c2b28f9`](https://github.com/npm/cli/commit/c2b28f9d6cba12e88f849e5b4a82607e2c218a16) [#7498](https://github.com/npm/cli/pull/7498) `minipass@7.1.1`
* [`9064ffc`](https://github.com/npm/cli/commit/9064ffc6c85309de2e9e798fdc6caca209f5fa18) [#7498](https://github.com/npm/cli/pull/7498) `@sigstore/tuf@2.3.3`
* [`fd42986`](https://github.com/npm/cli/commit/fd429866c79cc001979135857c019d7d2873f291) [#7498](https://github.com/npm/cli/pull/7498) `@npmcli/fs@3.1.1`
* [`4e53e33`](https://github.com/npm/cli/commit/4e53e33757c88ca9c413e3943b17e0cb246e955c) [#7498](https://github.com/npm/cli/pull/7498) `semver@7.6.2`
* [`f078c82`](https://github.com/npm/cli/commit/f078c8224f6775d53da98f310531524c616e6099) [#7495](https://github.com/npm/cli/pull/7495) `glob@10.3.14`
* [`58f773c`](https://github.com/npm/cli/commit/58f773c99742ef55ac2a9eca23c27b32800c2cf1) [#7495](https://github.com/npm/cli/pull/7495) `path-scurry@1.11.0`
* [`ea0b07d`](https://github.com/npm/cli/commit/ea0b07da149767265f11d5d77d2156e2c9f43e63) [#7482](https://github.com/npm/cli/pull/7482) `pacote@18.0.6`
* [`8d161a4`](https://github.com/npm/cli/commit/8d161a414160dab7a930b1668c3af3ba280e8532) [#7482](https://github.com/npm/cli/pull/7482) `semver@7.6.1`
* [`5b2317b`](https://github.com/npm/cli/commit/5b2317b472342428c6521d7b0d550d0fcc9bb202) [#7463](https://github.com/npm/cli/pull/7463) add lru-cache
* [`26fefb8`](https://github.com/npm/cli/commit/26fefb82b3bd812009b8b627e3c19032a931aade) [#7480](https://github.com/npm/cli/pull/7480) `promzard@1.0.2`
* [`2146e1f`](https://github.com/npm/cli/commit/2146e1f83ae94debecfaf08ef32e319c02223c12) [#7480](https://github.com/npm/cli/pull/7480) `npm-bundled@3.0.1`
* [`ff6c5d1`](https://github.com/npm/cli/commit/ff6c5d161b52e8961e0c2ebf0467bc1382ef72d2) [#7480](https://github.com/npm/cli/pull/7480) `minipass-fetch@3.0.5`
* [`419f9b9`](https://github.com/npm/cli/commit/419f9b9d9d6806d56b68d96bd50f7d25274a8f48) [#7480](https://github.com/npm/cli/pull/7480) `cmd-shim@6.0.3`
* [`dade2c8`](https://github.com/npm/cli/commit/dade2c88d23289d57351d614feaa876d9e1e17f4) [#7480](https://github.com/npm/cli/pull/7480) `minipass@7.1.0`
* [`18e5312`](https://github.com/npm/cli/commit/18e53129f0f3a19725e377b336336aa85ade3ba5) [#7480](https://github.com/npm/cli/pull/7480) `validate-npm-package-name@5.0.1`
* [`d440011`](https://github.com/npm/cli/commit/d44001164f66d15daa3fd27da004194478b7c99c) [#7480](https://github.com/npm/cli/pull/7480) `npm-user-validate@2.0.1`
* [`552113e`](https://github.com/npm/cli/commit/552113e7a663efdcebfcbcc6148b1d51be55596b) [#7480](https://github.com/npm/cli/pull/7480) `ignore-walk@6.0.5`
* [`7e15b6d`](https://github.com/npm/cli/commit/7e15b6d56abbf47456c12fa2d5688d5d187a0ae7) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/metavuln-calculator@7.1.1`
* [`8b20f8c`](https://github.com/npm/cli/commit/8b20f8c8ba70e43ad222538fc396dedb071b1680) [#7480](https://github.com/npm/cli/pull/7480) `ssri@10.0.6`
* [`a9a6dcd`](https://github.com/npm/cli/commit/a9a6dcd4427ec82e491a2cad5672d8183e12180f) [#7480](https://github.com/npm/cli/pull/7480) `pacote@18.0.5`
* [`e2fdb65`](https://github.com/npm/cli/commit/e2fdb651cda9ec603f009f5713a5a2b489d49e15) [#7480](https://github.com/npm/cli/pull/7480) `npm-pick-manifest@9.0.1`
* [`310a7a5`](https://github.com/npm/cli/commit/310a7a5583d14da761d38b7421ebb6cee65600b6) [#7480](https://github.com/npm/cli/pull/7480) `normalize-package-data@6.0.1`
* [`e71f541`](https://github.com/npm/cli/commit/e71f541b020de7940faccffab68d0255c4079e1a) [#7480](https://github.com/npm/cli/pull/7480) `nopt@7.2.1`
* [`18c3b40`](https://github.com/npm/cli/commit/18c3b4058c7f721ff585de2f2766e53da897e16e) [#7480](https://github.com/npm/cli/pull/7480) `json-parse-even-better-errors@3.0.2`
* [`4c5bf77`](https://github.com/npm/cli/commit/4c5bf77af6db3b447f9b9abc3b67b211d7bb82b8) [#7480](https://github.com/npm/cli/pull/7480) `init-package-json@6.0.3`
* [`714e3e1`](https://github.com/npm/cli/commit/714e3e1e1ce014cba71db41c2d6c02d9dd53fcd3) [#7480](https://github.com/npm/cli/pull/7480) `hosted-git-info@7.0.2`
* [`f94d672`](https://github.com/npm/cli/commit/f94d6726a6ca96cad0da88ea499fa22f35b7c4c0) [#7480](https://github.com/npm/cli/pull/7480) `cacache@18.0.3`
* [`43331e4`](https://github.com/npm/cli/commit/43331e4d0647c3af4cc2aa3db8b47d797584a6d8) [#7480](https://github.com/npm/cli/pull/7480) `bin-links@4.0.4`
* [`8234412`](https://github.com/npm/cli/commit/823441219ce63d7863aede8b22b4b1d07021fd22) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/promise-spawn@7.0.2`
* [`6dfaebb`](https://github.com/npm/cli/commit/6dfaebb8f08acf992ac36faf4db8b650e8e55eae) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/git@5.0.7`
* [`63ef498`](https://github.com/npm/cli/commit/63ef498bf2916a882a92c0b9fe6de6728584694a) [#7457](https://github.com/npm/cli/pull/7457) `npm-registry-fetch@17.0.1`
* [`4cbc2d4`](https://github.com/npm/cli/commit/4cbc2d402174933052c7addd6ea55b1ecee202c5) [#7457](https://github.com/npm/cli/pull/7457) `npm-profile@10.0.0`

### Chores

* [`10256e8`](https://github.com/npm/cli/commit/10256e8cbe3583b65cb253a19ba9ee64f21c9584) [#7522](https://github.com/npm/cli/pull/7522) dev dependency updates (@wraithgar)
* [`dcfc3de`](https://github.com/npm/cli/commit/dcfc3deba2bb0066ec5d8b1870719f730adc2e97) [#7517](https://github.com/npm/cli/pull/7517) convert run-script tests to snapshots (#7517) (@lukekarrys)
* [`8add914`](https://github.com/npm/cli/commit/8add914841775f239acd838b1d8d52b251d0e1b2) [#7505](https://github.com/npm/cli/pull/7505) create single bug report issue template (#7505) (@lukekarrys)
* [`7c7fba4`](https://github.com/npm/cli/commit/7c7fba4fc92528287e1f2ef5fb8256e60760c201) [#7500](https://github.com/npm/cli/pull/7500) benchmarks: fix emoji reaction to comment (#7500) (@lukekarrys)
* [`d3b9587`](https://github.com/npm/cli/commit/d3b958756144d71c25cc4bd2020e040a940fbe3b) [#7494](https://github.com/npm/cli/pull/7494) disable progress on npm pack test (@wraithgar)
* [`67ebb66`](https://github.com/npm/cli/commit/67ebb66d3ffa61582f8dd63ddbb5679649a5d2a4) [#7494](https://github.com/npm/cli/pull/7494) disable color in config tests (@wraithgar)
* [`2ec2e75`](https://github.com/npm/cli/commit/2ec2e75ee81361a850bca643341d240441870334) [#7494](https://github.com/npm/cli/pull/7494) disable progress on shellout exit tests (@wraithgar)
* [`e9fdc9a`](https://github.com/npm/cli/commit/e9fdc9a792666d5b9aa73833c65516bafcb80863) [#7483](https://github.com/npm/cli/pull/7483) create smoke-publish-test.sh script (#7483) (@lukekarrys)
* [`1524cfd`](https://github.com/npm/cli/commit/1524cfd94daaca131ab16180c27323999fab07b3) [#7484](https://github.com/npm/cli/pull/7484) remove extra quotes from benchmark event_type (#7484) (@lukekarrys)
* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)
* [`8ded848`](https://github.com/npm/cli/commit/8ded848b099297a12a81ec008d6229f3ad3494a6) [#7457](https://github.com/npm/cli/pull/7457) remove doctor snapshot stack traces (@lukekarrys)

### Chores

* [`10256e8`](https://github.com/npm/cli/commit/10256e8cbe3583b65cb253a19ba9ee64f21c9584) [#7522](https://github.com/npm/cli/pull/7522) dev dependency updates (@wraithgar)
* [`dcfc3de`](https://github.com/npm/cli/commit/dcfc3deba2bb0066ec5d8b1870719f730adc2e97) [#7517](https://github.com/npm/cli/pull/7517) convert run-script tests to snapshots (#7517) (@lukekarrys)
* [`8add914`](https://github.com/npm/cli/commit/8add914841775f239acd838b1d8d52b251d0e1b2) [#7505](https://github.com/npm/cli/pull/7505) create single bug report issue template (#7505) (@lukekarrys)
* [`7c7fba4`](https://github.com/npm/cli/commit/7c7fba4fc92528287e1f2ef5fb8256e60760c201) [#7500](https://github.com/npm/cli/pull/7500) benchmarks: fix emoji reaction to comment (#7500) (@lukekarrys)
* [`d3b9587`](https://github.com/npm/cli/commit/d3b958756144d71c25cc4bd2020e040a940fbe3b) [#7494](https://github.com/npm/cli/pull/7494) disable progress on npm pack test (@wraithgar)
* [`67ebb66`](https://github.com/npm/cli/commit/67ebb66d3ffa61582f8dd63ddbb5679649a5d2a4) [#7494](https://github.com/npm/cli/pull/7494) disable color in config tests (@wraithgar)
* [`2ec2e75`](https://github.com/npm/cli/commit/2ec2e75ee81361a850bca643341d240441870334) [#7494](https://github.com/npm/cli/pull/7494) disable progress on shellout exit tests (@wraithgar)
* [`e9fdc9a`](https://github.com/npm/cli/commit/e9fdc9a792666d5b9aa73833c65516bafcb80863) [#7483](https://github.com/npm/cli/pull/7483) create smoke-publish-test.sh script (#7483) (@lukekarrys)
* [`1524cfd`](https://github.com/npm/cli/commit/1524cfd94daaca131ab16180c27323999fab07b3) [#7484](https://github.com/npm/cli/pull/7484) remove extra quotes from benchmark event_type (#7484) (@lukekarrys)
* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)
* [`8ded848`](https://github.com/npm/cli/commit/8ded848b099297a12a81ec008d6229f3ad3494a6) [#7457](https://github.com/npm/cli/pull/7457) remove doctor snapshot stack traces (@lukekarrys)

## [10.7.0](https://github.com/npm/cli/compare/v10.6.0...v10.7.0) (2024-04-30)

### Features

* [`7e349f4`](https://github.com/npm/cli/commit/7e349f45363bb8dbe1cc803f8b48befc01aae7fd) [#7432](https://github.com/npm/cli/pull/7432) add spinner (#7432) (@lukekarrys)

### Bug Fixes

* [`d679ce8`](https://github.com/npm/cli/commit/d679ce80fd9b761b2323777ec5cd84ebc5c164fe) [#7449](https://github.com/npm/cli/pull/7449) linting: no-unused-vars (@wraithgar)
* [`2558283`](https://github.com/npm/cli/commit/25582837b0ebb8c2de2932c04224332b11d0e1d5) [#7450](https://github.com/npm/cli/pull/7450) powershell: fallback to script root if globalPrefix does not exist (#7450) (@lukekarrys)
* [`bc4c342`](https://github.com/npm/cli/commit/bc4c3426c35201baff7230c2b3beee2cf5936296) [#7448](https://github.com/npm/cli/pull/7448) account for registries with no publisher in search (#7448) (@wraithgar)
* [`bcc781a`](https://github.com/npm/cli/commit/bcc781abf10b46aa5b04da996fc4602524be9b0e) [#7439](https://github.com/npm/cli/pull/7439) move run-script banners to stderr when in json mode (#7439) (@lukekarrys)
* [`104fcb5`](https://github.com/npm/cli/commit/104fcb53282653a1c5610a6590afecc207920a6b) [#7438](https://github.com/npm/cli/pull/7438) remove doctor log for each file permission check (#7438) (@lukekarrys)
* [`5230647`](https://github.com/npm/cli/commit/52306473da03123ef5623e9e152e10285c8097f3) [#7422](https://github.com/npm/cli/pull/7422) rewrite powershell scripts to use PSScriptRoot (#7422) (@lukekarrys)
* [`71cbd91`](https://github.com/npm/cli/commit/71cbd91b6f01875a99eeae989ea67489bdd0178d) [#7421](https://github.com/npm/cli/pull/7421) hide banner for exec and explore (#7421) (@lukekarrys)
* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

### Documentation

* [`1674136`](https://github.com/npm/cli/commit/1674136bc14b0f708bb01f75d65474346c863bd9) [#7441](https://github.com/npm/cli/pull/7441) correct search help output (#7441) (@wraithgar)

### Dependencies

* [`80eec03`](https://github.com/npm/cli/commit/80eec03462e5747cb4434d43aff25939826b7850) [#7453](https://github.com/npm/cli/pull/7453) `@npmcli/redact@2.0.0`
* [`a7145d4`](https://github.com/npm/cli/commit/a7145d422485fcbcb9427efa775c15180c7ee1c2) [#7453](https://github.com/npm/cli/pull/7453) `npm-registry-fetch@17.0.0`
* [`a785766`](https://github.com/npm/cli/commit/a785766325141335cde39d43eb631062e32d6605) [#7453](https://github.com/npm/cli/pull/7453) `pacote@18.0.3`
* [`65d76db`](https://github.com/npm/cli/commit/65d76dbd2fb11c83141302500ec4a3f5128ff12f) [#7453](https://github.com/npm/cli/pull/7453) `npm-profile@9.0.2`
* [`cadc0f0`](https://github.com/npm/cli/commit/cadc0f0cad8909755ae8ac72f2dd5802a0d34943) [#7449](https://github.com/npm/cli/pull/7449) hoist production copy of sprintf-js
* [`2cffdfe`](https://github.com/npm/cli/commit/2cffdfef45b9a13d189f5059cc69fc7319620fda) [#7449](https://github.com/npm/cli/pull/7449) `lru-cache@10.2.2`
* [`432efb5`](https://github.com/npm/cli/commit/432efb5ee313ac5bd08642a9cef2b7c52da23ea9) [#7449](https://github.com/npm/cli/pull/7449) `make-fetch-happen@13.0.1`
* [`9da5738`](https://github.com/npm/cli/commit/9da57388ebd5c643c2a95bbf63abc745cad45ccc) [#7437](https://github.com/npm/cli/pull/7437) `@npmcli/run-script@8.1.0` (#7437)
* [`762888a`](https://github.com/npm/cli/commit/762888a3b603704c7c53a94a704b8a7f3edea918) [#7429](https://github.com/npm/cli/pull/7429) update dependencies for workspaces (#7429)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.1): `@npmcli/arborist@7.5.1`
* [workspace](https://github.com/npm/cli/releases/tag/config-v8.3.1): `@npmcli/config@8.3.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v8.0.5): `libnpmaccess@8.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.1.1): `libnpmdiff@6.1.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v8.1.0): `libnpmexec@8.1.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.9): `libnpmfund@5.0.9`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmhook-v10.0.4): `libnpmhook@10.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v6.0.5): `libnpmorg@6.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v7.0.1): `libnpmpack@7.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.7): `libnpmpublish@9.0.7`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v7.0.4): `libnpmsearch@7.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v6.0.4): `libnpmteam@6.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v6.0.1): `libnpmversion@6.0.1`

### Chores

* [`356c374`](https://github.com/npm/cli/commit/356c374817711845719902184547e1e0ac359b22) [#7453](https://github.com/npm/cli/pull/7453) fix test fixture for new redact behavior (@wraithgar)
* [`2fba4b7`](https://github.com/npm/cli/commit/2fba4b7b6218900fd895daf5218682edeb4253a4) [#7449](https://github.com/npm/cli/pull/7449) update devDependencies in lockfile (@wraithgar)

## [10.6.0](https://github.com/npm/cli/compare/v10.5.2...v10.6.0) (2024-04-25)

### Features

* [`9123de4`](https://github.com/npm/cli/commit/9123de4d282bfd19ea17ad613f5a2acab0e0e162) [#7373](https://github.com/npm/cli/pull/7373) do all ouput over proc-log events (@lukekarrys)
* [`9622597`](https://github.com/npm/cli/commit/9622597399ec93224fddf90a9209a98dbcfd6b2f) [#7339](https://github.com/npm/cli/pull/7339) refactor terminal display (#7339) (@lukekarrys)

### Bug Fixes

* [`0e74ee4`](https://github.com/npm/cli/commit/0e74ee42cbd2cbe438e64a2426767dad1868e70d) [#7416](https://github.com/npm/cli/pull/7416) clean up npm object (#7416) (@wraithgar)
* [`c060e60`](https://github.com/npm/cli/commit/c060e60a7ce767f6fdb32782c0d373e717df7856) [#7415](https://github.com/npm/cli/pull/7415) return command and argv from load (@lukekarrys)
* [`180b919`](https://github.com/npm/cli/commit/180b919d2322e55ec5d58bbd476c3ecc31880479) [#7415](https://github.com/npm/cli/pull/7415) remove unused npm.setCmd method (@lukekarrys)
* [`0708b3b`](https://github.com/npm/cli/commit/0708b3b2dbfc811b0e692133557b6b2e698519fd) [#7414](https://github.com/npm/cli/pull/7414) use name of level instead of label for logging prefixes (#7414) (@lukekarrys)
* [`7f4e667`](https://github.com/npm/cli/commit/7f4e66772ee631158b47fcfcd8e22b7b6b9b9cce) [#7403](https://github.com/npm/cli/pull/7403) redact when displaying non-ascii arguments (@lukekarrys)
* [`06202f0`](https://github.com/npm/cli/commit/06202f0e13d91f5ee6edfe2da6ee21bafbf18cca) [#7403](https://github.com/npm/cli/pull/7403) store unref promises for awaiting in tests (@lukekarrys)
* [`e5f1948`](https://github.com/npm/cli/commit/e5f1948a569224c59a9a4fdeb0e3b82312fb87c6) [#7403](https://github.com/npm/cli/pull/7403) run update notifier after exec but before waiting (@lukekarrys)
* [`f309c1c`](https://github.com/npm/cli/commit/f309c1cd8ab26b9cdc3b1224499aba345edfc582) [#7403](https://github.com/npm/cli/pull/7403) refactor: move timer and error logfile messages to lib/npm (@lukekarrys)
* [`43e6194`](https://github.com/npm/cli/commit/43e619480568493433af78208e2b3c48843185ef) [#7403](https://github.com/npm/cli/pull/7403) dont show run script banners in silent (@lukekarrys)
* [`694dba9`](https://github.com/npm/cli/commit/694dba9fd9a8d71facc7b832bf8f00ca9468e68a) [#7403](https://github.com/npm/cli/pull/7403) dont expose as many public properties of timers (@lukekarrys)
* [`7ca6d84`](https://github.com/npm/cli/commit/7ca6d8490b675c9d4c402ae8e41c9afd5871aa35) [#7403](https://github.com/npm/cli/pull/7403) use proc-log META for flush and force (@lukekarrys)
* [`2538438`](https://github.com/npm/cli/commit/25384388e01d1c9d6c4cae4a49149407b0024176) [#7403](https://github.com/npm/cli/pull/7403) dont write timing logs to file unless requested (@lukekarrys)
* [`7e04417`](https://github.com/npm/cli/commit/7e04417d4b084043300d1cdd5b4dce8ea7184d9e) [#7403](https://github.com/npm/cli/pull/7403) rename base-cmd to match other commands (@lukekarrys)
* [`fc68547`](https://github.com/npm/cli/commit/fc68547eb9b06a1a6a2a0feb7e422accec50230d) [#7403](https://github.com/npm/cli/pull/7403) remove some npm.load timers and exit earlier for --versions (@lukekarrys)
* [`28019d5`](https://github.com/npm/cli/commit/28019d50fdb1b2395199516694180edc7b4f8dd6) [#7403](https://github.com/npm/cli/pull/7403) cleanup: move cli specific files to separate dir (@lukekarrys)
* [`469f788`](https://github.com/npm/cli/commit/469f7885ca47f79bbd3c7171dc56a471a3e422a2) [#7403](https://github.com/npm/cli/pull/7403) cleanup: newlines and whitespace (@lukekarrys)
* [`4ab6401`](https://github.com/npm/cli/commit/4ab64013236925e7bceb9f88cfcc81f4a65f292f) [#7403](https://github.com/npm/cli/pull/7403) cleanup: dont nest files utils dir (@lukekarrys)
* [`78447d7`](https://github.com/npm/cli/commit/78447d7a35fab870456ba66eee408b2baddca23e) [#7399](https://github.com/npm/cli/pull/7399) prefer fs/promises over promisify (#7399) (@lukekarrys)
* [`d531f8b`](https://github.com/npm/cli/commit/d531f8b9237fabf640d421a8c4ea3c4284e00f0a) [#7407](https://github.com/npm/cli/pull/7407) Remove table output from search and tar summary (@wraithgar)
* [`c209e98`](https://github.com/npm/cli/commit/c209e989b405fa3e86df7015c22e6840e18313b8) [#7401](https://github.com/npm/cli/pull/7401) Remove table output from many commands (@wraithgar)
* [`ad7ab8c`](https://github.com/npm/cli/commit/ad7ab8c19994c1d2a452278edba65968185d3871) [#7388](https://github.com/npm/cli/pull/7388) perf: lazy loading optimizations (#7388) (@wraithgar)
* [`8eae4b3`](https://github.com/npm/cli/commit/8eae4b3b30a7375f0f9dd4172a8b683efe0bb354) [#7385](https://github.com/npm/cli/pull/7385) token: properly await registry request (#7385) (@wraithgar)
* [`9216d59`](https://github.com/npm/cli/commit/9216d5985fb3e2a2754be5bf0b1d43fc321cf723) [#7377](https://github.com/npm/cli/pull/7377) better output colors (#7377) (@wraithgar)
* [`6512112`](https://github.com/npm/cli/commit/65121122d99855541f63aa787f8ee8bb4eea4a3f) [#7378](https://github.com/npm/cli/pull/7378) use proc-log for all timers (@lukekarrys)
* [`2a80dab`](https://github.com/npm/cli/commit/2a80dab2ed1feedf3cd3af8ff7f41846567b2fd3) [#7370](https://github.com/npm/cli/pull/7370) typo in `npm access` usage (#7370) (@mbtools)

### Documentation

* [`dfa4cab`](https://github.com/npm/cli/commit/dfa4cabdccdd1c82cc160bb435c29c45ed05fdf4) [#7401](https://github.com/npm/cli/pull/7401) update output examples (@wraithgar)
* [`140b9c9`](https://github.com/npm/cli/commit/140b9c988d08beb6c3cd95b67cd4135ed32a19e6) [#7382](https://github.com/npm/cli/pull/7382) package-json: note that line endings are inferred (#7382) (@ertw)
* [`c16dd4e`](https://github.com/npm/cli/commit/c16dd4e46b58d6c4490284e6edc5c255862e322b) [#7367](https://github.com/npm/cli/pull/7367) Document that overrides only work in the root `package.json` (#7367) (@s100)

### Dependencies

* [`36adff3`](https://github.com/npm/cli/commit/36adff36c41f56315fe582e1e4dda29060f7fdf7) [#7408](https://github.com/npm/cli/pull/7408) `pacote@18.0.2`
* [`486d46c`](https://github.com/npm/cli/commit/486d46cd5b5678ad1ab6c23ee12cf7559477805a) [#7408](https://github.com/npm/cli/pull/7408) `@npmcli/installed-package-contents@2.1.0`
* [`157d0ae`](https://github.com/npm/cli/commit/157d0aebfe5710880d0c91bddee970316b8a6612) [#7408](https://github.com/npm/cli/pull/7408) `@npmcli/package-json@5.1.0`
* [`b0ca163`](https://github.com/npm/cli/commit/b0ca16310d9db944dd13f80ecce534c65eea42c5) [#7409](https://github.com/npm/cli/pull/7409) remove @npmcli/disparity-colors
* [`c77f035`](https://github.com/npm/cli/commit/c77f035fc18fdc0a9eb3ef0a7d1faf2c7aec6af3) [#7407](https://github.com/npm/cli/pull/7407) remove columnify
* [`2ec690d`](https://github.com/npm/cli/commit/2ec690da99fb441cdd7069480b42b6302e098005) [#7401](https://github.com/npm/cli/pull/7401) move cli-table3 to devDependencies
* [`fc6e291`](https://github.com/npm/cli/commit/fc6e291e9c2154c2e76636cb7ebf0a17be307585) [#7392](https://github.com/npm/cli/pull/7392) `proc-log@4.2.0` (#7392)
* [`38ed048`](https://github.com/npm/cli/commit/38ed048ac0d7a36785dbff0eeca3618cb7f084c5) [#7378](https://github.com/npm/cli/pull/7378) `@npmcli/metavuln-calculator@7.1.0`
* [`7678a3d`](https://github.com/npm/cli/commit/7678a3d92835457bb402c82e4ca7ea3fa734d23b) [#7378](https://github.com/npm/cli/pull/7378) `proc-log@4.1.0`
* [`87f6c09`](https://github.com/npm/cli/commit/87f6c094ac47f4e6eb5d5d6a03a0ad97711b51e9) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/metavuln-calculator@7.0.1`
* [`b8f8b41`](https://github.com/npm/cli/commit/b8f8b414d8ad9635e3efedc6e491c8c6e3df0973) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/run-script@8.0.0`
* [`79f79c7`](https://github.com/npm/cli/commit/79f79c7460be8a74f2b77c647100bcefd89b2efa) [#7373](https://github.com/npm/cli/pull/7373) `proc-log@4.0.0`
* [`9027266`](https://github.com/npm/cli/commit/90272661b16d861a5926af8ec394d32ec0f307fd) [#7373](https://github.com/npm/cli/pull/7373) `pacote@18.0.0`
* [`ee4b3e0`](https://github.com/npm/cli/commit/ee4b3e0e741545045dc03741c7147560961d867d) [#7373](https://github.com/npm/cli/pull/7373) `npm-registry-fetch@16.2.1`
* [`0e7789b`](https://github.com/npm/cli/commit/0e7789b7d9ec88c89edcdade9fc898c131ed492a) [#7373](https://github.com/npm/cli/pull/7373) `npm-profile@9.0.1`
* [`ac98fd3`](https://github.com/npm/cli/commit/ac98fd3a8514f2552555d2b8af74a52e64888797) [#7373](https://github.com/npm/cli/pull/7373) `npm-package-arg@11.0.2`
* [`9351570`](https://github.com/npm/cli/commit/93515700efbb2147a6e929cf117da9e6e87c0aca) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/package-json@5.0.3`
* [`d3a0cfa`](https://github.com/npm/cli/commit/d3a0cfad06ddffe6a3d4968257b7993aea68fc7c) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/git@5.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.5.0): `@npmcli/arborist@7.5.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v8.3.0): `@npmcli/config@8.3.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v8.0.4): `libnpmaccess@8.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.1.0): `libnpmdiff@6.1.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v8.0.0): `libnpmexec@8.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.8): `libnpmfund@5.0.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmhook-v10.0.3): `libnpmhook@10.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v6.0.4): `libnpmorg@6.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v7.0.0): `libnpmpack@7.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.6): `libnpmpublish@9.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v7.0.3): `libnpmsearch@7.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v6.0.3): `libnpmteam@6.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v6.0.0): `libnpmversion@6.0.0`

### Chores

* [`3cbc258`](https://github.com/npm/cli/commit/3cbc25800bbd14a8b22ee3feddad715b3a6436d7) [#7403](https://github.com/npm/cli/pull/7403) test for early version exit (@lukekarrys)
* [`08e0c0e`](https://github.com/npm/cli/commit/08e0c0ed1ad7bc2f12b4f358eb3e6b18bdbca053) [#7403](https://github.com/npm/cli/pull/7403) move sigstore json files to fixtures dir (@lukekarrys)
* [`ea66e95`](https://github.com/npm/cli/commit/ea66e9534f4b9004f8b4c53a2f8adb7688ee9b36) [#7380](https://github.com/npm/cli/pull/7380) remove licensee as a devDependency (#7380) (@lukekarrys, @wraithgar)
* [`9333e9d`](https://github.com/npm/cli/commit/9333e9df9b6ad3143f084a25b0e7ea347c8094d3) [#7386](https://github.com/npm/cli/pull/7386) reduce windows shim test flakes (#7386) (@lukekarrys)

## [10.5.2](https://github.com/npm/cli/compare/v10.5.1...v10.5.2) (2024-04-10)

### Bug Fixes

* [`ef381b1`](https://github.com/npm/cli/commit/ef381b1449c99e174437665aa767e7a9b60edf22) [#7363](https://github.com/npm/cli/pull/7363) use @npmcli/redact for url cleaning (#7363) (@lukekarrys)
* [`3760dd2`](https://github.com/npm/cli/commit/3760dd275aaa53cd2cee92e6a7b90aaf62f663cf) [#7361](https://github.com/npm/cli/pull/7361) perf: do less work loading config (#7361) (@wraithgar)
* [`64bcf4c`](https://github.com/npm/cli/commit/64bcf4cf09e284ca18988615ab8696b55d27d829) [#7360](https://github.com/npm/cli/pull/7360) perf: only initialize workpaces when we are inside a workspace (#7360) (@H4ad)
* [`5a28a29`](https://github.com/npm/cli/commit/5a28a29799aac2c89b4e7a3d5c1d1d880346b743) [#7352](https://github.com/npm/cli/pull/7352) perf: lazy load workspace dependency (#7352) (@H4ad)
* [`5fc0f9d`](https://github.com/npm/cli/commit/5fc0f9dfdac3f95fd2eb6855beb2020941b2a361) [#7347](https://github.com/npm/cli/pull/7347) lazy load validate npm package name on error message (#7347) (@H4ad)
* [`c929ed1`](https://github.com/npm/cli/commit/c929ed180b3d3361d1541737a4c3c9932cd480c6) [#7321](https://github.com/npm/cli/pull/7321) prioritize CLI flags over publishConfig settings (#7321) (@roni-berlin)
* [`70497cb`](https://github.com/npm/cli/commit/70497cbcd4e6b32948253b644ccd7a3f0ee29270) [#7346](https://github.com/npm/cli/pull/7346) perf: avoid importing the entire semver package for update-notifier (#7346) (@H4ad)

### Documentation

* [`90ba1c9`](https://github.com/npm/cli/commit/90ba1c9fd6c1ea89173ed7712cf1da205732b164) [#7340](https://github.com/npm/cli/pull/7340) fix incorrect ISO 8601 reference (#7340) (@emmanuel-ferdman)

### Dependencies

* [`699a1de`](https://github.com/npm/cli/commit/699a1de9d22e6c552141f87e468f5b37ed825206) [#7362](https://github.com/npm/cli/pull/7362) `@npmcli/map-workspaces@3.0.6`
* [`49fb9b7`](https://github.com/npm/cli/commit/49fb9b7cc22a348f608ab443c6953d950955c9e2) [#7362](https://github.com/npm/cli/pull/7362) `socks@2.8.3`
* [`f69052e`](https://github.com/npm/cli/commit/f69052e16c21ce87c3f8f53a3769cc42ae68db63) [#7362](https://github.com/npm/cli/pull/7362) `@npmcli/package-json@5.0.2`
* [`c18a0ad`](https://github.com/npm/cli/commit/c18a0ade8c4e7f6e35ffa937aa7afe06351b4b60) [#7357](https://github.com/npm/cli/pull/7357) `sigstore@2.3.0`
* [`fd4153b`](https://github.com/npm/cli/commit/fd4153b3ccbc8d49b3aff90fed5e853f35fd6beb) [#7357](https://github.com/npm/cli/pull/7357) `socks@2.8.2`
* [`d6b705a`](https://github.com/npm/cli/commit/d6b705a474a39b83b3d75516a95e34af92793034) [#7357](https://github.com/npm/cli/pull/7357) `postcss-selector-parser@6.0.16`
* [`248c177`](https://github.com/npm/cli/commit/248c1771b8b406337ec96cffc6b8bc8f9b3b55b4) [#7357](https://github.com/npm/cli/pull/7357) `hasown@2.0.2`
* [`4af9e86`](https://github.com/npm/cli/commit/4af9e863d1a3ad4a934315113745bad4f3c29bb0) [#7357](https://github.com/npm/cli/pull/7357) `builtins@5.1.0`
* [`7546b56`](https://github.com/npm/cli/commit/7546b5608d86fdefc5d2f080cd9c0223150ab2f7) [#7357](https://github.com/npm/cli/pull/7357) `@npmcli/agent@2.2.2`
* [`d38fd4f`](https://github.com/npm/cli/commit/d38fd4f6035a6ec9fbd366079d6761cf9c25b471) [#7357](https://github.com/npm/cli/pull/7357) `spdx-expression-parse@4.0.0`
* [`913b326`](https://github.com/npm/cli/commit/913b326f62319c95df3b576dd71cdbb04be26782) [#7357](https://github.com/npm/cli/pull/7357) `is-cidr@5.0.5`
* [`84bbbd4`](https://github.com/npm/cli/commit/84bbbd4b61be12025cfa952c9d2a522a1b996245) [#7357](https://github.com/npm/cli/pull/7357) `@npmcli/package-json@5.0.1`
* [`a0f5048`](https://github.com/npm/cli/commit/a0f504808b81af7442f47343366724eea1bc8623) [#7357](https://github.com/npm/cli/pull/7357) `@npmcli/git@5.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.2): `@npmcli/arborist@7.4.2`
* [workspace](https://github.com/npm/cli/releases/tag/config-v8.2.2): `@npmcli/config@8.2.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.9): `libnpmdiff@6.0.9`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.10): `libnpmexec@7.0.10`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.7): `libnpmfund@5.0.7`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.9): `libnpmpack@6.0.9`

### Chores

* [`81be28d`](https://github.com/npm/cli/commit/81be28de88fb5f3951e782a474548214f61eef70) [#7357](https://github.com/npm/cli/pull/7357) dev dependency updates (@wraithgar)

## [10.5.1](https://github.com/npm/cli/compare/v10.5.0...v10.5.1) (2024-04-03)

### Bug Fixes

* [`17d97d2`](https://github.com/npm/cli/commit/17d97d266807f69cfc2a7a3982e8db126f90c48a) [#7334](https://github.com/npm/cli/pull/7334) use @npmcli/redact for log redactions (@lukekarrys)
* [`8cab136`](https://github.com/npm/cli/commit/8cab136f731c69be079be08d79e3514e01bbd563) [#7324](https://github.com/npm/cli/pull/7324) ensure maxSockets is respected (#7324) (@lukekarrys)
* [`9bffa13`](https://github.com/npm/cli/commit/9bffa13e0b96efe1039d9075fdcb11d5946b2f90) [#7320](https://github.com/npm/cli/pull/7320) query: properly return :missing nodes (#7320) (@wraithgar)
* [`9d4e85f`](https://github.com/npm/cli/commit/9d4e85f2379eded50b54f4e0b6f307031037f1ec) [#7297](https://github.com/npm/cli/pull/7297) search: include searchlimit option in help output (#7297) (@10xLaCroixDrinker)
* [`bdb3c28`](https://github.com/npm/cli/commit/bdb3c28167f757060474ef2b82c92f3a1f210972) [#7274](https://github.com/npm/cli/pull/7274) added check for dry-run (#7274) (@cod1r)
* [`7f1ab88`](https://github.com/npm/cli/commit/7f1ab8822a8d50403338595ab9f218e4d63f37fa) [#7271](https://github.com/npm/cli/pull/7271) more lightweight npm bin discovery in windows (#7271) (@wraithgar)

### Documentation

* [`1da5cf0`](https://github.com/npm/cli/commit/1da5cf0ace30d89edf05833b91ce80467c7864bd) [#7198](https://github.com/npm/cli/pull/7198) add link to engines section (#7198) (@uiolee)
* [`1114a12`](https://github.com/npm/cli/commit/1114a12f2b4691d403d0863d4dca44f25580f57d) [#7307](https://github.com/npm/cli/pull/7307) fix incorrect npm audit key response link (#7307) (@davidlj95)
* [`9807caf`](https://github.com/npm/cli/commit/9807cafbaf274eca2a0abbd04a9b2b55e850de9d) [#7304](https://github.com/npm/cli/pull/7304) update audit docs with provenance info (#7304) (@bdehamer)
* [`e1ecfa7`](https://github.com/npm/cli/commit/e1ecfa7829be91282373862669b92ef42b9e48df) [#7285](https://github.com/npm/cli/pull/7285) Correct capitalization for URL (#7285) (@coliff)

### Dependencies

* [`87a61fc`](https://github.com/npm/cli/commit/87a61fc8bb65c950cda389ab3d14ae250ab2345d) [#7334](https://github.com/npm/cli/pull/7334) `npm-registry-fetch@16.2.0`
* [`5469614`](https://github.com/npm/cli/commit/54696148f25986bcdf39e1acb5aca4bf09e7d1a0) [#7327](https://github.com/npm/cli/pull/7327) `init-package-json@6.0.2`
* [`5469614`](https://github.com/npm/cli/commit/54696148f25986bcdf39e1acb5aca4bf09e7d1a0) [#7327](https://github.com/npm/cli/pull/7327) `promzard@1.0.1`
* [`5469614`](https://github.com/npm/cli/commit/54696148f25986bcdf39e1acb5aca4bf09e7d1a0) [#7327](https://github.com/npm/cli/pull/7327) `read@3.0.1` (#7327)
* [`9ccff72`](https://github.com/npm/cli/commit/9ccff72c332e6062e6ebcf8123c7888d8d617091) [#7329](https://github.com/npm/cli/pull/7329) `tar@6.2.1`
* [`7201a00`](https://github.com/npm/cli/commit/7201a00632f5cedf50101e8411a4b3c514439efb) [#7329](https://github.com/npm/cli/pull/7329) `node-gyp@10.1.0`
* [`6fd94f2`](https://github.com/npm/cli/commit/6fd94f249f43080ae183da36b971981e8ad00882) [#7329](https://github.com/npm/cli/pull/7329) `minimatch@9.0.4`
* [`b048592`](https://github.com/npm/cli/commit/b048592a9583dca6f75a9c837edee57ab4e12ab0) [#7329](https://github.com/npm/cli/pull/7329) `ini@4.1.2`
* [`c54a84a`](https://github.com/npm/cli/commit/c54a84ab5fdd7513913518734c0ece5f3d3e39c9) [#7329](https://github.com/npm/cli/pull/7329) `glob@10.3.12`
* [`6853531`](https://github.com/npm/cli/commit/6853531da30bc8fecb776c823144766915b5e421) [#7329](https://github.com/npm/cli/pull/7329) `cli-table3@0.6.4`
* [`c9315cb`](https://github.com/npm/cli/commit/c9315cb240be02babbbd99585f7ef23679e1d963) [#7329](https://github.com/npm/cli/pull/7329) `binary-extensions@2.3.0`
* [`5bb0031`](https://github.com/npm/cli/commit/5bb003147423a644969c04222e2ba1b6cf407e6f) [#7329](https://github.com/npm/cli/pull/7329) `@sigstore/tuf@2.3.2`
* [`8cab136`](https://github.com/npm/cli/commit/8cab136f731c69be079be08d79e3514e01bbd563) [#7324](https://github.com/npm/cli/pull/7324) `agent-base@7.1.1` (@lukekarrys)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.1): `@npmcli/arborist@7.4.1`
* [workspace](https://github.com/npm/cli/releases/tag/config-v8.2.1): `@npmcli/config@8.2.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v8.0.3): `libnpmaccess@8.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.8): `libnpmdiff@6.0.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.9): `libnpmexec@7.0.9`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.6): `libnpmfund@5.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmhook-v10.0.2): `libnpmhook@10.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v6.0.3): `libnpmorg@6.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.8): `libnpmpack@6.0.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.5): `libnpmpublish@9.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v7.0.2): `libnpmsearch@7.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v6.0.2): `libnpmteam@6.0.2`

### Chores

* [`8cab136`](https://github.com/npm/cli/commit/8cab136f731c69be079be08d79e3514e01bbd563) [#7324](https://github.com/npm/cli/pull/7324) add smoke-test for large prod installs (@lukekarrys)
* [`0dab381`](https://github.com/npm/cli/commit/0dab3810e6b84e1b4afcc2a315c878fffccb328b) [#7258](https://github.com/npm/cli/pull/7258) `jsdom@24.0.0` (#7258) (@wraithgar)
* [`af3c48e`](https://github.com/npm/cli/commit/af3c48e074d03caebaa8ed24d39405329f545497) [#7262](https://github.com/npm/cli/pull/7262) test refactor (#7262) (@wraithgar)

## [10.5.0](https://github.com/npm/cli/compare/v10.4.0...v10.5.0) (2024-02-28)

### Features

* [`2366edc`](https://github.com/npm/cli/commit/2366edcaf2b32b5d1c6a7c03184c59eef0e08eae) [#7218](https://github.com/npm/cli/pull/7218) query: add :vuln pseudo selector (@wraithgar)
* [`4f3ddbb`](https://github.com/npm/cli/commit/4f3ddbbe88df7c94d1e06e660928a962e973f332) [#5966](https://github.com/npm/cli/pull/5966) add --expect-entries to `npm query` (@wraithgar)

### Bug Fixes

* [`818957c`](https://github.com/npm/cli/commit/818957c0f88c859bf3ea90ff440ec5d9d9e990b9) [#7158](https://github.com/npm/cli/pull/7158) pack, publish: default foreground-scripts to true (#7158) (@ljharb)
* [`d04111d`](https://github.com/npm/cli/commit/d04111d48ca59fce27909712b328fe5cfc4d016d) [#7197](https://github.com/npm/cli/pull/7197) view: filter out invalid semver (#7197) (@wraithgar)
* [`b0a3ba0`](https://github.com/npm/cli/commit/b0a3ba0b99ce5920722244f1ccb8b830826abef4) [#7195](https://github.com/npm/cli/pull/7195) prevent adding invalid dist-tag (#7195) (@wraithgar)

### Documentation

* [`c4741fe`](https://github.com/npm/cli/commit/c4741fee8b4e6cdca90c6773385ff710c8b3f7f5) [#7254](https://github.com/npm/cli/pull/7254) Remove additional example and comments about uninstall script (#7254) (@rveerd)
* [`686a622`](https://github.com/npm/cli/commit/686a622480d32eabf2d69982e422ba3dcd8a6f7c) [#7247](https://github.com/npm/cli/pull/7247) scope: update example command to work in windows (#7247) (@robertobasile84)
* [`95b5057`](https://github.com/npm/cli/commit/95b505738a73ba740227a41b8c7c87013af5acaf) [#5966](https://github.com/npm/cli/pull/5966) clarify in-range and out-of-range in dependency selectors (@wraithgar)
* [`5b7184f`](https://github.com/npm/cli/commit/5b7184f3aaf5a9ca58418b6d029616088964ed0a) [#7190](https://github.com/npm/cli/pull/7190) workspaces: fix grammar (#7190) (@alekstech)
* [`0dd03f9`](https://github.com/npm/cli/commit/0dd03f9450e0cf57fa85ad2ef74b5a54f3c775a9) [#7182](https://github.com/npm/cli/pull/7182) fix typos (#7182) (@GoodDaisy)

### Dependencies

* [`16d4c9f`](https://github.com/npm/cli/commit/16d4c9f0e48a18719f1461460504a4228f8f663d) [#7218](https://github.com/npm/cli/pull/7218) `@npmcli/query@3.1.0`
* [`06247d1`](https://github.com/npm/cli/commit/06247d18fd3573d48b220512e84f87eaab06210a) [#7242](https://github.com/npm/cli/pull/7242) `spdx-license-ids@3.0.17`
* [`79d1e0b`](https://github.com/npm/cli/commit/79d1e0bc9f781b02af876f0615595976958ca410) [#7242](https://github.com/npm/cli/pull/7242) `spdx-exceptions@2.5.0`
* [`67e853a`](https://github.com/npm/cli/commit/67e853a507ab31af5b82fd3fcbcb2fe2f18cad5d) [#7242](https://github.com/npm/cli/pull/7242) `socks@2.8.0`
* [`4c9fe4b`](https://github.com/npm/cli/commit/4c9fe4be4df39960cfadef2ca07465c90d9ee414) [#7242](https://github.com/npm/cli/pull/7242) `lru-cache@10.2.0`
* [`4a50c5a`](https://github.com/npm/cli/commit/4a50c5adaa0f28a8e9f6433c34b0eedfc73885a1) [#7242](https://github.com/npm/cli/pull/7242) `https-proxy-agent@7.0.4`
* [`ed3f254`](https://github.com/npm/cli/commit/ed3f254a09d8f0da49e927e8b7fbd81c1232208e) [#7242](https://github.com/npm/cli/pull/7242) `http-proxy-agent@7.0.2`
* [`8ec4fd5`](https://github.com/npm/cli/commit/8ec4fd541be937a965e685ad4dbbfb57ae3b2462) [#7242](https://github.com/npm/cli/pull/7242) `hasown@2.0.1`
* [`98b1189`](https://github.com/npm/cli/commit/98b11894b770065979c8fefb87861c156ad0c895) [#7242](https://github.com/npm/cli/pull/7242) `@npmcli/agent@2.2.1`
* [`dafa903`](https://github.com/npm/cli/commit/dafa903fe9083343fd17bdd3a5acc6f9acc8f356) [#7242](https://github.com/npm/cli/pull/7242) `sigstore@2.2.2`
* [`d0bcb76`](https://github.com/npm/cli/commit/d0bcb76bd635eefcb1fae39e831e227a1852ef68) [#7242](https://github.com/npm/cli/pull/7242) `diff@5.2.0`
* [`a13808e`](https://github.com/npm/cli/commit/a13808e2e8ed0507e12ad27f8b212e5b0b6ccae8) [#7242](https://github.com/npm/cli/pull/7242) `semver@7.6.0`
* [`d6521ac`](https://github.com/npm/cli/commit/d6521ac9c43ccf909ff4d1564dffa0f07e260503) [#7242](https://github.com/npm/cli/pull/7242) `@sigstore/tuf@2.3.1`
* [`43cac2f`](https://github.com/npm/cli/commit/43cac2f990aefca283d49e26ff83ba5d6fb28313) [#7242](https://github.com/npm/cli/pull/7242) `ip@2.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.4.0): `@npmcli/arborist@7.4.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v8.2.0): `@npmcli/config@8.2.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.7): `libnpmdiff@6.0.7`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.8): `libnpmexec@7.0.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.5): `libnpmfund@5.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.7): `libnpmpack@6.0.7`

### Chores

* [`d6bc684`](https://github.com/npm/cli/commit/d6bc6840edce1957c0ea0ed618819cbfe23fa611) [#7242](https://github.com/npm/cli/pull/7242) update devDependencies in lockfile (@wraithgar)

## [10.4.0](https://github.com/npm/cli/compare/v10.3.0...v10.4.0) (2024-01-24)

### Features

* [`35a098c`](https://github.com/npm/cli/commit/35a098cc54ef208c53e7329bfb65a7e5656c559b) [#7175](https://github.com/npm/cli/pull/7175) display tree diff on `--long` (@wraithgar)
* [`dffca29`](https://github.com/npm/cli/commit/dffca29f0690be82692eaa44a1dd02a0807a70ae) [#7174](https://github.com/npm/cli/pull/7174) format: print `--dry-run` diffs in table format (#7174) (@ritaaktay)
* [`6d5f9ac`](https://github.com/npm/cli/commit/6d5f9acd0dc7f755a9ef4d27e1dac7076ec7e469) [#7133](https://github.com/npm/cli/pull/7133) dedupe - display difference when `--dry-run` is enabled (#7133) (@Blaumaus)

### Bug Fixes

* [`ec06f77`](https://github.com/npm/cli/commit/ec06f7712bbdc3b38c546593e9970962fee127ed) [#7175](https://github.com/npm/cli/pull/7175) inline diff table code w/ summary code (@wraithgar)
* [`d4ebfba`](https://github.com/npm/cli/commit/d4ebfba91991423b52edf5f9431424faa6618073) [#7157](https://github.com/npm/cli/pull/7157) use util.stripVTControlCharacters instead of strip-ansi (@wraithgar)
* [`81c95c7`](https://github.com/npm/cli/commit/81c95c7de71b40831ad46356d75ed56b20c66372) [#7063](https://github.com/npm/cli/pull/7063) don't reset update notifier duration on every check (#7063) (@wraithgar)

### Documentation

* [`2b7eaad`](https://github.com/npm/cli/commit/2b7eaade0620b3ea69e8b0b21335ed25af082351) [#7168](https://github.com/npm/cli/pull/7168) package-json: Reword warning about publishing local dependencies (#7168) (@DanKaplanSES)
* [`67ab0f7`](https://github.com/npm/cli/commit/67ab0f745ad182fa8250cc1da53b618df2e0d95a) [#7142](https://github.com/npm/cli/pull/7142) update: Replace comma with period in run on sentence (#7142) (@DanKaplanSES)
* [`05c69dc`](https://github.com/npm/cli/commit/05c69dc7ac70d27f1ec1d58ea0dd7111770fd0aa) [#7150](https://github.com/npm/cli/pull/7150) config: State default configuration file affected by `npm config set` (#7150) (@DanKaplanSES)
* [`44f4518`](https://github.com/npm/cli/commit/44f45187ef8ee20c373e89407f3c32708bef9f0f) [#7149](https://github.com/npm/cli/pull/7149) Link to the config command in the npm configuration description (#7149) (@DanKaplanSES)
* [`dd5699f`](https://github.com/npm/cli/commit/dd5699f7f0dcf9e5ad1c5549f3eaacaa1715f8eb) [#7152](https://github.com/npm/cli/pull/7152) update: Fix a typo and remove unneeded statement (#7152) (@DanKaplanSES)

### Dependencies

* [`ec77e81`](https://github.com/npm/cli/commit/ec77e81f5ecc3603bb7c9963f860a8c46f6a61ec) [#7124](https://github.com/npm/cli/pull/7124) `promise-call-limit@3.0.1`
* [`e32189c`](https://github.com/npm/cli/commit/e32189c768181d58ab72825d67307a3a653652ac) [#7173](https://github.com/npm/cli/pull/7173) deduplicate tree
* [`b7af4d9`](https://github.com/npm/cli/commit/b7af4d9bb96a86abee6a745b4a756b84d54d6e79) [#7173](https://github.com/npm/cli/pull/7173) `tar-stream@3.1.7`
* [`6883743`](https://github.com/npm/cli/commit/68837432c0b78bf7a4382a443f35ce2484449952) [#7173](https://github.com/npm/cli/pull/7173) `@npmcli/run-script@7.0.4`
* [`739634d`](https://github.com/npm/cli/commit/739634d76168f438934f1f8287618dabe2f3b968) [#7157](https://github.com/npm/cli/pull/7157) remove strip-ansi
* [`162c82e`](https://github.com/npm/cli/commit/162c82e845d410ede643466f9f8af78a312296cc) [#7148](https://github.com/npm/cli/pull/7148) `pacote@17.0.6` (#7148) (@bdehamer)
* [`a50b03b`](https://github.com/npm/cli/commit/a50b03b10046cf769cd328df96adcf292db5c067) [#7141](https://github.com/npm/cli/pull/7141) `sigstore@2.2.0` (#7141) (@bdehamer)
* [`f696b51`](https://github.com/npm/cli/commit/f696b517a39bea1be0f7116983a5b4c8ed6f01b7) [#7132](https://github.com/npm/cli/pull/7132) `@sigstore/tuf@2.3.0` (#7132) (@bdehamer)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.3.1): `@npmcli/arborist@7.3.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.6): `libnpmdiff@6.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.7): `libnpmexec@7.0.7`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.4): `libnpmfund@5.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.6): `libnpmpack@6.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.4): `libnpmpublish@9.0.4`

### Chores

* [`a82ccc5`](https://github.com/npm/cli/commit/a82ccc5f97a60698fb0ee413347a621d0662f493) [#7173](https://github.com/npm/cli/pull/7173) `nock@13.5.0` (@wraithgar)
* [`dcaa99c`](https://github.com/npm/cli/commit/dcaa99c5138ad20a3210a8396772177aa1fa33da) [#7173](https://github.com/npm/cli/pull/7173) fix exec test (@wraithgar)
* [`0d96080`](https://github.com/npm/cli/commit/0d96080fa8c08b5eb77bbd6ae64111379fa24465) [#7162](https://github.com/npm/cli/pull/7162) release: do not exclude docs directory from CLI release commits (#7162) (@lukekarrys)

## [10.3.0](https://github.com/npm/cli/compare/v10.2.5...v10.3.0) (2024-01-10)

### Features

* [`6673c77`](https://github.com/npm/cli/commit/6673c77bc4222d0f1719449fe903b7461b3e6907) [#6914](https://github.com/npm/cli/pull/6914) add `--libc` option to override platform specific install (#6914) (@wraithgar, @Brooooooklyn)

### Bug Fixes

* [`b7fc10a`](https://github.com/npm/cli/commit/b7fc10aa37bc2422f479119558f82e01bdaab6cd) [#7113](https://github.com/npm/cli/pull/7113) filter C0 and C1 control characters from logs and cli output (#7113) (@wraithgar)

### Dependencies

* [`3fd5213`](https://github.com/npm/cli/commit/3fd521393461639b6b768df43f0b5b71d3ee7dd2) [#7121](https://github.com/npm/cli/pull/7121) `npm-packlist@8.0.2`
* [`5698415`](https://github.com/npm/cli/commit/56984154b445c479236effdb844888b1ef409250) [#7121](https://github.com/npm/cli/pull/7121) `postcss-selector-parser@6.0.15`
* [`e56a4f3`](https://github.com/npm/cli/commit/e56a4f3dff9de349917d530074e698c644471080) [#7121](https://github.com/npm/cli/pull/7121) `are-we-there-yet@4.0.2`
* [`8495b7c`](https://github.com/npm/cli/commit/8495b7c088118e383ff6f3c7ce744df9c0d8e106) [#7121](https://github.com/npm/cli/pull/7121) `cacache@18.0.2`
* [`796d1c7`](https://github.com/npm/cli/commit/796d1c7507d69382181e515d6c6987930c9ec636) [#7121](https://github.com/npm/cli/pull/7121) `@npmcli/run-script@7.0.3`
* [`3b7f6f2`](https://github.com/npm/cli/commit/3b7f6f274aceed4218e5e903752d879a41d3a547) [#7121](https://github.com/npm/cli/pull/7121) `@npmcli/promise-spawn@7.0.1`
* [`7ecd146`](https://github.com/npm/cli/commit/7ecd146a3241723602693ca67c78ca5e2da8cb57) [#7121](https://github.com/npm/cli/pull/7121) `npmcli/git@5.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.3.0): `@npmcli/arborist@7.3.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v8.1.0): `@npmcli/config@8.1.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.5): `libnpmdiff@6.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.6): `libnpmexec@7.0.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.3): `libnpmfund@5.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.5): `libnpmpack@6.0.5`

### Chores

* [`2fd8292`](https://github.com/npm/cli/commit/2fd8292eff1155ec84a53f6d4321e6a386df93c7) [#7121](https://github.com/npm/cli/pull/7121) work around @npmcli/git lazy loading (@wraithgar)
* [`cd9a66d`](https://github.com/npm/cli/commit/cd9a66df2476d602fe3d36a6c3c6185f1bd8c676) [#7121](https://github.com/npm/cli/pull/7121) update devDependencies in lockfile (@wraithgar)
* [`2dda715`](https://github.com/npm/cli/commit/2dda715c9e72eefe69b49ee07c87fa126c84ff10) [#7121](https://github.com/npm/cli/pull/7121) `tap@16.3.10` (@wraithgar)

## [10.2.5](https://github.com/npm/cli/compare/v10.2.4...v10.2.5) (2023-12-06)

### Bug Fixes

* [`c7a592c`](https://github.com/npm/cli/commit/c7a592c9c400e73dd27264c11ad6459616023e4c) [#7061](https://github.com/npm/cli/pull/7061) dont use cache for update notifier manifest request (@lukekarrys)
* [`7b952f6`](https://github.com/npm/cli/commit/7b952f64b882bd891fab5c21c7c3b49838c8a995) [#7049](https://github.com/npm/cli/pull/7049) unpublish: bubble up all errors parsing local package.json (#7049) (@wraithgar)
* [`be4741f`](https://github.com/npm/cli/commit/be4741f5bc20239f11842f780047d91fda23935d) [#7039](https://github.com/npm/cli/pull/7039) unpublish bugfixes (#7039) (@wraithgar)
* [`bc7f53d`](https://github.com/npm/cli/commit/bc7f53db793d362d2015d3e55ce121e6b4d3d91f) [#7036](https://github.com/npm/cli/pull/7036) reverse direction of SPDX SBOM dependency rels (#7036) (@bdehamer, @antonbauhofer)
* [`11ec231`](https://github.com/npm/cli/commit/11ec231e895300e5b7292ac16685d37d1d5df3b9) [#7033](https://github.com/npm/cli/pull/7033) skip creation of log directory if `logs-max` is set to 0 (#7033) (@JJ)
* [`6267f54`](https://github.com/npm/cli/commit/6267f543c2ac134c0f8433f8b48659a3949bf210) [#7005](https://github.com/npm/cli/pull/7005) properly catch missing url opener error on interactive prompt (#7005) (@wraithgar)

### Dependencies

* [`ff1204a`](https://github.com/npm/cli/commit/ff1204aff0651e32679ecd09d0a2a62de49f4eac) [#7058](https://github.com/npm/cli/pull/7058) `lru-cache@10.1.0`
* [`c648020`](https://github.com/npm/cli/commit/c648020cdc0fa0916bc618b6d1191e68dcfc8d73) [#7058](https://github.com/npm/cli/pull/7058) `json-parse-even-better-errors@3.0.1`
* [`53aa8f2`](https://github.com/npm/cli/commit/53aa8f2c110f38a10f98f976cb40f54ea6d95844) [#7058](https://github.com/npm/cli/pull/7058) `pacote@17.0.5`
* [`2e5331c`](https://github.com/npm/cli/commit/2e5331c75df8606b1f92bf61c8612f5e7b0274aa) [#7058](https://github.com/npm/cli/pull/7058) `npm-packlist@8.0.1`
* [`937b7b7`](https://github.com/npm/cli/commit/937b7b7b11ec21fbe373ab93f4e4e170625dd6b1) [#7058](https://github.com/npm/cli/pull/7058) `ignore-walk@6.0.4`
* [`35371c8`](https://github.com/npm/cli/commit/35371c8796a08a269ac3f7017c35e5fcb7ef0968) [#7058](https://github.com/npm/cli/pull/7058) `cacache@18.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.2): `@npmcli/arborist@7.2.2`
* [workspace](https://github.com/npm/cli/releases/tag/config-v8.0.3): `@npmcli/config@8.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v8.0.2): `libnpmaccess@8.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.4): `libnpmdiff@6.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.5): `libnpmexec@7.0.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.2): `libnpmfund@5.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmhook-v10.0.1): `libnpmhook@10.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v6.0.2): `libnpmorg@6.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.4): `libnpmpack@6.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.3): `libnpmpublish@9.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v7.0.1): `libnpmsearch@7.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v6.0.1): `libnpmteam@6.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v5.0.2): `libnpmversion@5.0.2`

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)
* [`71f70fa`](https://github.com/npm/cli/commit/71f70fa0e86448b20a63b9eec922ad25971a9377) [#7058](https://github.com/npm/cli/pull/7058) `nock@13.4.0` (@wraithgar)
* [`43674a4`](https://github.com/npm/cli/commit/43674a449816e364265205e56270ad547718069c) [#7058](https://github.com/npm/cli/pull/7058) `tap@16.3.9` (@wraithgar)
* [`4ba585c`](https://github.com/npm/cli/commit/4ba585ce0e1a2ea4591d64d7166b81b7fe92010b) [#7040](https://github.com/npm/cli/pull/7040) fix tests for zlib differences between node versions (#7040) (@wraithgar)

## [10.2.4](https://github.com/npm/cli/compare/v10.2.3...v10.2.4) (2023-11-14)

### Bug Fixes

* [`cd291e7`](https://github.com/npm/cli/commit/cd291e7aa52e56fc45f8245e67c77e0ed3711b07) [#6995](https://github.com/npm/cli/pull/6995) refactor search formatting code (#6995) (@wraithgar)
* [`f3a7380`](https://github.com/npm/cli/commit/f3a7380a45323dbf6c74015e418de3963fb11a69) [#6973](https://github.com/npm/cli/pull/6973) look in workspace for exec commands (#6973) (@wraithgar)
* [`d11496b`](https://github.com/npm/cli/commit/d11496b26dfee5957e7e2a1b328f346b2aca9348) [#6977](https://github.com/npm/cli/pull/6977) pkg: properly output in workspace mode (#6977) (@wraithgar)
* [`0f70088`](https://github.com/npm/cli/commit/0f7008851f1c250405e8dc326f15d535e8fc1eae) [#6969](https://github.com/npm/cli/pull/6969) correctly handle object licenses in SBOM generation (#6969) (@jamietanna)
* [`dce3b08`](https://github.com/npm/cli/commit/dce3b0896ba81b2109fea42ab32edd8a3193324c) [#6951](https://github.com/npm/cli/pull/6951) properly catch missing url opener error (#6951) (@wraithgar)

### Documentation

* [`a38836c`](https://github.com/npm/cli/commit/a38836ce9d703f5012ff4d4a8a4e3b9a9aedc025) [#6616](https://github.com/npm/cli/pull/6616) add path usage for view command (#6616) (@RobinKnipe)
* [`da18e4f`](https://github.com/npm/cli/commit/da18e4f9baa180beeb325a384759a26a19ac2919) [#6987](https://github.com/npm/cli/pull/6987) update npm-prune description (#6987) (@Eomm)

### Dependencies

* [`e9ec2f7`](https://github.com/npm/cli/commit/e9ec2f7005e7326d9a819978b251cf0a05062538) [#6994](https://github.com/npm/cli/pull/6994) `lru-cache@10.0.2`
* [`faf9eff`](https://github.com/npm/cli/commit/faf9efffb7bfe6efde6e53830cb054b34c3a6ea3) [#6994](https://github.com/npm/cli/pull/6994) `is-core-module@2.13.1`
* [`b00e780`](https://github.com/npm/cli/commit/b00e7808e370513e79ca31c261958377984e7444) [#6994](https://github.com/npm/cli/pull/6994) `@sigstore/sign@2.2.0`
* [`4613774`](https://github.com/npm/cli/commit/461377426d998ed79400501b09e1ee67c32bee23) [#6994](https://github.com/npm/cli/pull/6994) hoisting newer deps in favor of older ones
* [`54c4f7b`](https://github.com/npm/cli/commit/54c4f7b8705b2c9d5b8bc5bb846f4e7863735b7e) [#6994](https://github.com/npm/cli/pull/6994) `signal-exit@4.1.0`
* [`8c5882f`](https://github.com/npm/cli/commit/8c5882f3eed305bbd3514d7143f9d92e9577e1b9) [#6994](https://github.com/npm/cli/pull/6994) `strip-ansi@7.1.0`
* [`cd0c649`](https://github.com/npm/cli/commit/cd0c649ec2b421b59012854e61788a11a77194f2) [#6994](https://github.com/npm/cli/pull/6994) `ci-info@4.0.0`
* [`a0a58b7`](https://github.com/npm/cli/commit/a0a58b735c418d8555a06890b63098c68f53106e) [#6994](https://github.com/npm/cli/pull/6994) `@sigstore/tuf@2.2.0`
* [`b3a53c6`](https://github.com/npm/cli/commit/b3a53c6ab5fd933fc7f8258c155ed31be834393e) [#6949](https://github.com/npm/cli/pull/6949) `is-cidr@5.0.3` (#6949)
* [Workspace](https://github.com/npm/cli/releases/tag/config-v8.0.2): `@npmcli/config@8.0.2`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.4): `libnpmexec@7.0.4`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v9.0.2): `libnpmpublish@9.0.2`

## [10.2.3](https://github.com/npm/cli/compare/v10.2.2...v10.2.3) (2023-11-02)

### Dependencies

* [`b5dedf3`](https://github.com/npm/cli/commit/b5dedf39dd772192ed6639926ad4c99ff5dfd28a) [#6958](https://github.com/npm/cli/pull/6958) `node-gyp@10.0.1`

## [10.2.2](https://github.com/npm/cli/compare/v10.2.1...v10.2.2) (2023-10-31)

### Bug Fixes

* [`8ed6d28`](https://github.com/npm/cli/commit/8ed6d28fa14b40d7a05784ad0a1e80661256b466) [#6910](https://github.com/npm/cli/pull/6910) make npm link respect --no-save (#6910) (@Santoshraj2)
* [`eacec5f`](https://github.com/npm/cli/commit/eacec5f49060d3dfcdc3c7043115619e4bb22864) [#6941](https://github.com/npm/cli/pull/6941) add back bin/node-gyp-bin/node-gyp files (#6941) (@lukekarrys)
* [`b776753`](https://github.com/npm/cli/commit/b776753f9cfeab329169105f604bc55ed03bd0e1) [#6928](https://github.com/npm/cli/pull/6928) Grammar mistake in authentication error message (#6928) (@Gekuro, gek)

### Documentation

* [`c422a01`](https://github.com/npm/cli/commit/c422a01e1564d25148c821ee257196ebe60e8e6c) [#6924](https://github.com/npm/cli/pull/6924) use markdown links instead of html (@lukekarrys)
* [`dd03aa0`](https://github.com/npm/cli/commit/dd03aa0b9acc535283daf39699de9831202348cb) [#6921](https://github.com/npm/cli/pull/6921) add v9 and above for lockfile version 3 (#6921) (@MikeMcC399)

### Dependencies

* [`dfb6298`](https://github.com/npm/cli/commit/dfb6298c3eb9fb7ef452906765ac5f23ea6fec49) [#6937](https://github.com/npm/cli/pull/6937) `node-gyp@10.0.0` (#6937)
* [Workspace](https://github.com/npm/cli/releases/tag/arborist-v7.2.1): `@npmcli/arborist@7.2.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v6.0.3): `libnpmdiff@6.0.3`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v7.0.3): `libnpmexec@7.0.3`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v5.0.1): `libnpmfund@5.0.1`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v6.0.3): `libnpmpack@6.0.3`
* [Workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v5.0.1): `libnpmversion@5.0.1`

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
