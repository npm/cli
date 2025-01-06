# Changelog

## [9.0.0](https://github.com/npm/cli/compare/arborist-v9.0.0-pre.1...arborist-v9.0.0) (2024-12-16)
### Features
* [`a7bfc6d`](https://github.com/npm/cli/commit/a7bfc6df76882996ebb834dbca785fdf33b8c50d) [#7972](https://github.com/npm/cli/pull/7972) trigger release process (#7972) (@wraithgar)
### Chores
* [`a07f4e0`](https://github.com/npm/cli/commit/a07f4e0d921f640be6aa87736debd550ec478f89) [#7976](https://github.com/npm/cli/pull/7976) `@npmcli/template-oss@4.23.6` (@wraithgar)

## [9.0.0-pre.1](https://github.com/npm/cli/compare/arborist-v9.0.0-pre.0...arborist-v9.0.0-pre.1) (2024-12-06)
### ⚠️ BREAKING CHANGES
* Upon publishing, in order to apply a default "latest" dist tag, the command now retrieves all prior versions of the package. It will require that the version you're trying to publish is above the latest semver version in the registry, not including pre-release tags.
* `bun.lockb` files are now included in the strict ignore list during packing
### Features
* [`f3ac7b7`](https://github.com/npm/cli/commit/f3ac7b7460e1d9e1f9d3d8056317e36bb9813d5d) [#7939](https://github.com/npm/cli/pull/7939) no implicit latest tag on publish when latest > version (#7939) (@reggi, @ljharb)
### Dependencies
* [`c0bcc2a`](https://github.com/npm/cli/commit/c0bcc2a860fec5c86234dec44f5474364c25aefc) [#7955](https://github.com/npm/cli/pull/7955) `walk-up-path@4.0.0`
* [`4bf1901`](https://github.com/npm/cli/commit/4bf1901f6dc57748d851ebe82262e9bef85a4ba7) [#7945](https://github.com/npm/cli/pull/7945) `@npmcli/metavuln-calculator@9.0.0`
* [`ca84b22`](https://github.com/npm/cli/commit/ca84b22a18806495c37ef6ee2aecd42a1c7bb7f6) [#7945](https://github.com/npm/cli/pull/7945) `pacote@21.0.0`

## [9.0.0-pre.0](https://github.com/npm/cli/compare/arborist-v8.0.0...arborist-v9.0.0-pre.0) (2024-11-26)
### ⚠️ BREAKING CHANGES
* `--ignore-scripts` now applies to all lifecycle scripts, include `prepare`
* npm will no longer fall back to the old audit endpoint if the bulk advisory request fails.
* @npmcli/arborist now supports node `^20.17.0 || >=22.9.0`
### Features
* [`6995303`](https://github.com/npm/cli/commit/6995303687ab59541b727bf611f73624d1829b6c) [#7850](https://github.com/npm/cli/pull/7850) adds `--ignore-scripts` flag to `pack` (@reggi)
### Bug Fixes
* [`080a0f2`](https://github.com/npm/cli/commit/080a0f2d3f09a81f0a5b2992431e0bc7feb8d701) [#7911](https://github.com/npm/cli/pull/7911) remove old audit fallback request (@wraithgar)
* [`3ffc08b`](https://github.com/npm/cli/commit/3ffc08bc848ed262ab95e37593c8c058fd633caa) [#7831](https://github.com/npm/cli/pull/7831) for @npmcli/arborist sets node engine range to `^20.17.0 || >=22.9.0` (@reggi)
### Dependencies
* [`7dbef6f`](https://github.com/npm/cli/commit/7dbef6f3a3ead089b1b8b9fe6b2fa25e24309000) [#7850](https://github.com/npm/cli/pull/7850) `pacote@20.0.0`
* [`75a3f12`](https://github.com/npm/cli/commit/75a3f1228865f426d8790be27f1258e501f2c450) [#7859](https://github.com/npm/cli/pull/7859) remove unused deps (#7859)
### Chores
* [`6edfe2f`](https://github.com/npm/cli/commit/6edfe2f3a45169b6d194ccd8d366bb8d0e09b4a5) [#7937](https://github.com/npm/cli/pull/7937) `@npmcli/template-oss@4.23.5` (@wraithgar)

## [8.0.0](https://github.com/npm/cli/compare/arborist-v7.5.4...arborist-v8.0.0) (2024-10-03)
### ⚠️ BREAKING CHANGES
* `@npmcli/arborist` now supports node `^18.17.0 || >=20.5.0`
### Features
* [`4d57928`](https://github.com/npm/cli/commit/4d57928ea20c1672864dc0c8ebaff5d877e61c9c) [#7766](https://github.com/npm/cli/pull/7766) devEngines (#7766) (@reggi)
### Bug Fixes
* [`365580a`](https://github.com/npm/cli/commit/365580a2b0d3c645cdbf250c60994007c8e33a89) [#7803](https://github.com/npm/cli/pull/7803) align @npmcli/arborist to npm 10 node engine range (@reggi)
### Dependencies
* [`5795987`](https://github.com/npm/cli/commit/5795987605af9bb163ad3a689a0854b99cd39cbe) [#7803](https://github.com/npm/cli/pull/7803) update `proggy@3.0.0`
* [`99ccae3`](https://github.com/npm/cli/commit/99ccae3ded6f7013b26ed268a208c24473cdeb8f) [#7803](https://github.com/npm/cli/pull/7803) update `bin-links@5.0.0`
* [`75786ad`](https://github.com/npm/cli/commit/75786adb86f763d781f840feea4afb8d01953b99) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/query@4.0.0`
* [`1c25a1d`](https://github.com/npm/cli/commit/1c25a1d74c26364742b59f9d57b9a07bb4f8726f) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/node-gyp@4.0.0`
* [`2d7fc3d`](https://github.com/npm/cli/commit/2d7fc3d320b92a8447e7282df14e2b99047cc426) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/name-from-folder@3.0.0`
* [`1e09334`](https://github.com/npm/cli/commit/1e093347e3723c77bb4dc9214e111a3ec78fbbea) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/metavuln-calculator@8.0.0`
* [`820e983`](https://github.com/npm/cli/commit/820e983b1d5a82d6c9c10895487c2e43b423d6ef) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/installed-package-contents@3.0.0`
* [`9cd6603`](https://github.com/npm/cli/commit/9cd66031ebd2e9a0d6fdee3a7b4d7779694306ff) [#7803](https://github.com/npm/cli/pull/7803) update `read-package-json-fast@4.0.0`
* [`8206c4f`](https://github.com/npm/cli/commit/8206c4f675937e855b60164946c086eb64d7ecb6) [#7803](https://github.com/npm/cli/pull/7803) update `ssri@12.0.0`
* [`f6909a0`](https://github.com/npm/cli/commit/f6909a022c9373c85d980c96a30f47a3a65aa4a9) [#7803](https://github.com/npm/cli/pull/7803) update `proc-log@5.0.0`
* [`f9b2e18`](https://github.com/npm/cli/commit/f9b2e1884fbfe2a2c41e3fcaa4be722209141aed) [#7803](https://github.com/npm/cli/pull/7803) update `parse-conflict-json@4.0.0`
* [`e7ab206`](https://github.com/npm/cli/commit/e7ab206370e5fc62fefe6916e5dcc40b3e577d22) [#7803](https://github.com/npm/cli/pull/7803) update `pacote@19.0.0`
* [`d13a20b`](https://github.com/npm/cli/commit/d13a20bebef1b9932f86c44741ea6d214ad6842b) [#7803](https://github.com/npm/cli/pull/7803) update `npm-registry-fetch@18.0.1`
* [`092f41f`](https://github.com/npm/cli/commit/092f41fec40f418468605557fcb4f4e1babd9d45) [#7803](https://github.com/npm/cli/pull/7803) update `npm-pick-manifest@10.0.0`
* [`50a7bc8`](https://github.com/npm/cli/commit/50a7bc8737bb4e0a8fbc5f00b8f580512153a5bc) [#7803](https://github.com/npm/cli/pull/7803) update `npm-package-arg@12.0.0`
* [`591130d`](https://github.com/npm/cli/commit/591130d0aaaa032f484504287e993d38b6f04d4f) [#7803](https://github.com/npm/cli/pull/7803) update `npm-install-checks@7.1.0`
* [`105fa2b`](https://github.com/npm/cli/commit/105fa2bdb2bbb0502bb8e0c5ccec3dadcff3c2d6) [#7803](https://github.com/npm/cli/pull/7803) update `nopt@8.0.0`
* [`7214149`](https://github.com/npm/cli/commit/72141496fbc7e5f0e0824d584b82690eeee45bb5) [#7803](https://github.com/npm/cli/pull/7803) update `json-parse-even-better-errors@4.0.0`
* [`6deae9e`](https://github.com/npm/cli/commit/6deae9e5d989ac30208fbcbca13ec827c6f2b588) [#7803](https://github.com/npm/cli/pull/7803) update `hosted-git-info@8.0.0`
* [`034c729`](https://github.com/npm/cli/commit/034c7297568d328bcaf79bd2c7226d3593e21810) [#7803](https://github.com/npm/cli/pull/7803) update `cacache@19.0.1`
* [`538a4cc`](https://github.com/npm/cli/commit/538a4cc1dd731a3643ab4477fe545db39997bcdf) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/run-script@9.0.1`
* [`b80d048`](https://github.com/npm/cli/commit/b80d0482cb52fc00275fef9548d86e17eaf28f50) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/redact@3.0.0`
* [`2076368`](https://github.com/npm/cli/commit/207636897aa5544ec28cad5b75fe2e685028dafd) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/package-json@6.0.1`
* [`feac87c`](https://github.com/npm/cli/commit/feac87c7ed6113665bc144ee677017bc66138b70) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/map-workspaces@4.0.1`
* [`dd90f9e`](https://github.com/npm/cli/commit/dd90f9ee7882dbeec073604638b98e68f9873371) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/fs@4.0.0`
### Chores
* [`be1e6da`](https://github.com/npm/cli/commit/be1e6da91380d7a10edb1767dd433ca296b96771) [#7803](https://github.com/npm/cli/pull/7803) update `minify-registry-metadata@4.0.0` (@reggi)
* [`2072705`](https://github.com/npm/cli/commit/2072705aa80d009dc077639adc305692f4a6c0b9) [#7803](https://github.com/npm/cli/pull/7803) update `@npmcli/eslint-config@5.0.1` (@reggi)
* [`8035725`](https://github.com/npm/cli/commit/80357253ecd8483463cd66c783c4464c330d72df) [#7756](https://github.com/npm/cli/pull/7756) `@npmcli/template-oss@4.23.3` (@wraithgar)

## [7.5.4](https://github.com/npm/cli/compare/arborist-v7.5.3...arborist-v7.5.4) (2024-07-09)

### Bug Fixes

* [`6f33d74`](https://github.com/npm/cli/commit/6f33d74f310fa27aad30fd00d58d8e4404ef8cb2) [#7579](https://github.com/npm/cli/pull/7579) arborist: safeguard against null node.target in flag calculation (#7579) (@AmirSa12)
* [`a8e666e`](https://github.com/npm/cli/commit/a8e666e05d18b2e309787eb80b85f0006521b302) [#7602](https://github.com/npm/cli/pull/7602) arborist: condition to include name field in package-lock fixed (#7602) (@milaninfy)

## [7.5.3](https://github.com/npm/cli/compare/arborist-v7.5.2...arborist-v7.5.3) (2024-05-29)

### Bug Fixes

* [`2d1d8d0`](https://github.com/npm/cli/commit/2d1d8d0ef18a10ac7938380884745f1d3c3cb078) [#7559](https://github.com/npm/cli/pull/7559) adds `node:` specifier to all native node modules (#7559) (@reggi)

### Chores

* [`4a36d78`](https://github.com/npm/cli/commit/4a36d78f6474835df1d3cd358145e74e38e3ea7a) [#7568](https://github.com/npm/cli/pull/7568) fix linting in arborist debugger (@wraithgar)

## [7.5.2](https://github.com/npm/cli/compare/arborist-v7.5.1...arborist-v7.5.2) (2024-05-15)

### Bug Fixes

* [`12f103c`](https://github.com/npm/cli/commit/12f103ce55ed21c9c04f87a101fb64d55ac02d3c) [#7533](https://github.com/npm/cli/pull/7533) add first param titles to logs where missing (#7533) (@lukekarrys)
* [`e290352`](https://github.com/npm/cli/commit/e290352c6b9fd3bc7fa4b8ea2cc2000fb20fdec7) [#7499](https://github.com/npm/cli/pull/7499) revert DepsQueue to re-sort on pop() (#7499) (@lukekarrys)
* [`56a27fa`](https://github.com/npm/cli/commit/56a27fa400f157fb9a56182900278c41efc6aba1) [#7494](https://github.com/npm/cli/pull/7494) avoid caching manifests as promises (@wraithgar)
* [`722c0fa`](https://github.com/npm/cli/commit/722c0faa387ae6e35886f08eefb238c03ae85db1) [#7463](https://github.com/npm/cli/pull/7463) limit packument cache size based on heap size (@wraithgar)
* [`effe910`](https://github.com/npm/cli/commit/effe9109d6bc7828bf916c4dee49b2a53c72f39d) [#7475](https://github.com/npm/cli/pull/7475) dont omit license from stored manifests (#7475) (@lukekarrys)

### Dependencies

* [`fd42986`](https://github.com/npm/cli/commit/fd429866c79cc001979135857c019d7d2873f291) [#7498](https://github.com/npm/cli/pull/7498) `@npmcli/fs@3.1.1`
* [`ea0b07d`](https://github.com/npm/cli/commit/ea0b07da149767265f11d5d77d2156e2c9f43e63) [#7482](https://github.com/npm/cli/pull/7482) `pacote@18.0.6`
* [`5b2317b`](https://github.com/npm/cli/commit/5b2317b472342428c6521d7b0d550d0fcc9bb202) [#7463](https://github.com/npm/cli/pull/7463) add lru-cache
* [`7e15b6d`](https://github.com/npm/cli/commit/7e15b6d56abbf47456c12fa2d5688d5d187a0ae7) [#7480](https://github.com/npm/cli/pull/7480) `@npmcli/metavuln-calculator@7.1.1`
* [`8b20f8c`](https://github.com/npm/cli/commit/8b20f8c8ba70e43ad222538fc396dedb071b1680) [#7480](https://github.com/npm/cli/pull/7480) `ssri@10.0.6`
* [`a9a6dcd`](https://github.com/npm/cli/commit/a9a6dcd4427ec82e491a2cad5672d8183e12180f) [#7480](https://github.com/npm/cli/pull/7480) `pacote@18.0.5`
* [`e2fdb65`](https://github.com/npm/cli/commit/e2fdb651cda9ec603f009f5713a5a2b489d49e15) [#7480](https://github.com/npm/cli/pull/7480) `npm-pick-manifest@9.0.1`
* [`e71f541`](https://github.com/npm/cli/commit/e71f541b020de7940faccffab68d0255c4079e1a) [#7480](https://github.com/npm/cli/pull/7480) `nopt@7.2.1`
* [`18c3b40`](https://github.com/npm/cli/commit/18c3b4058c7f721ff585de2f2766e53da897e16e) [#7480](https://github.com/npm/cli/pull/7480) `json-parse-even-better-errors@3.0.2`
* [`714e3e1`](https://github.com/npm/cli/commit/714e3e1e1ce014cba71db41c2d6c02d9dd53fcd3) [#7480](https://github.com/npm/cli/pull/7480) `hosted-git-info@7.0.2`
* [`f94d672`](https://github.com/npm/cli/commit/f94d6726a6ca96cad0da88ea499fa22f35b7c4c0) [#7480](https://github.com/npm/cli/pull/7480) `cacache@18.0.3`
* [`43331e4`](https://github.com/npm/cli/commit/43331e4d0647c3af4cc2aa3db8b47d797584a6d8) [#7480](https://github.com/npm/cli/pull/7480) `bin-links@4.0.4`
* [`63ef498`](https://github.com/npm/cli/commit/63ef498bf2916a882a92c0b9fe6de6728584694a) [#7457](https://github.com/npm/cli/pull/7457) `npm-registry-fetch@17.0.1`

### Chores

* [`9c4d3c4`](https://github.com/npm/cli/commit/9c4d3c402c77bd7aaa514ee9e02d7fd87223343e) [#7467](https://github.com/npm/cli/pull/7467) template-oss-apply (@lukekarrys)
* [`2b7ec54`](https://github.com/npm/cli/commit/2b7ec54f52f9e8aee568ccb4e34ce4a5733af21a) [#7467](https://github.com/npm/cli/pull/7467) `template-oss@4.22.0` (@lukekarrys)

## [7.5.1](https://github.com/npm/cli/compare/arborist-v7.5.0...arborist-v7.5.1) (2024-04-30)

### Bug Fixes

* [`a1b95eb`](https://github.com/npm/cli/commit/a1b95ebeaf7bf32cf0c16605ad836e74370e2e24) [#7453](https://github.com/npm/cli/pull/7453) linting: no-unused-vars (@wraithgar)
* [`abcbc54`](https://github.com/npm/cli/commit/abcbc545ca226dfc39821200f2a0c9e122b400dd) [#7430](https://github.com/npm/cli/pull/7430) reify: cleanup of Symbols (#7430) (@wraithgar)
* [`57ebebf`](https://github.com/npm/cli/commit/57ebebf03d55d4eda2b6439149a97b595a191aaf) [#7418](https://github.com/npm/cli/pull/7418) update repository.url in package.json (#7418) (@wraithgar)

### Dependencies

* [`80eec03`](https://github.com/npm/cli/commit/80eec03462e5747cb4434d43aff25939826b7850) [#7453](https://github.com/npm/cli/pull/7453) `@npmcli/redact@2.0.0`
* [`a7145d4`](https://github.com/npm/cli/commit/a7145d422485fcbcb9427efa775c15180c7ee1c2) [#7453](https://github.com/npm/cli/pull/7453) `npm-registry-fetch@17.0.0`
* [`9da5738`](https://github.com/npm/cli/commit/9da57388ebd5c643c2a95bbf63abc745cad45ccc) [#7437](https://github.com/npm/cli/pull/7437) `@npmcli/run-script@8.1.0` (#7437)

## [7.5.0](https://github.com/npm/cli/compare/arborist-v7.4.2...arborist-v7.5.0) (2024-04-25)

### Features

* [`9123de4`](https://github.com/npm/cli/commit/9123de4d282bfd19ea17ad613f5a2acab0e0e162) [#7373](https://github.com/npm/cli/pull/7373) do all ouput over proc-log events (@lukekarrys)
* [`9622597`](https://github.com/npm/cli/commit/9622597399ec93224fddf90a9209a98dbcfd6b2f) [#7339](https://github.com/npm/cli/pull/7339) refactor terminal display (#7339) (@lukekarrys)

### Bug Fixes

* [`78447d7`](https://github.com/npm/cli/commit/78447d7a35fab870456ba66eee408b2baddca23e) [#7399](https://github.com/npm/cli/pull/7399) prefer fs/promises over promisify (#7399) (@lukekarrys)
* [`6512112`](https://github.com/npm/cli/commit/65121122d99855541f63aa787f8ee8bb4eea4a3f) [#7378](https://github.com/npm/cli/pull/7378) use proc-log for all timers (@lukekarrys)

### Dependencies

* [`36adff3`](https://github.com/npm/cli/commit/36adff36c41f56315fe582e1e4dda29060f7fdf7) [#7408](https://github.com/npm/cli/pull/7408) `pacote@18.0.2`
* [`486d46c`](https://github.com/npm/cli/commit/486d46cd5b5678ad1ab6c23ee12cf7559477805a) [#7408](https://github.com/npm/cli/pull/7408) `@npmcli/installed-package-contents@2.1.0`
* [`157d0ae`](https://github.com/npm/cli/commit/157d0aebfe5710880d0c91bddee970316b8a6612) [#7408](https://github.com/npm/cli/pull/7408) `@npmcli/package-json@5.1.0`
* [`fc6e291`](https://github.com/npm/cli/commit/fc6e291e9c2154c2e76636cb7ebf0a17be307585) [#7392](https://github.com/npm/cli/pull/7392) `proc-log@4.2.0` (#7392)
* [`38ed048`](https://github.com/npm/cli/commit/38ed048ac0d7a36785dbff0eeca3618cb7f084c5) [#7378](https://github.com/npm/cli/pull/7378) `@npmcli/metavuln-calculator@7.1.0`
* [`7678a3d`](https://github.com/npm/cli/commit/7678a3d92835457bb402c82e4ca7ea3fa734d23b) [#7378](https://github.com/npm/cli/pull/7378) `proc-log@4.1.0`
* [`87f6c09`](https://github.com/npm/cli/commit/87f6c094ac47f4e6eb5d5d6a03a0ad97711b51e9) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/metavuln-calculator@7.0.1`
* [`b8f8b41`](https://github.com/npm/cli/commit/b8f8b414d8ad9635e3efedc6e491c8c6e3df0973) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/run-script@8.0.0`
* [`79f79c7`](https://github.com/npm/cli/commit/79f79c7460be8a74f2b77c647100bcefd89b2efa) [#7373](https://github.com/npm/cli/pull/7373) `proc-log@4.0.0`
* [`9027266`](https://github.com/npm/cli/commit/90272661b16d861a5926af8ec394d32ec0f307fd) [#7373](https://github.com/npm/cli/pull/7373) `pacote@18.0.0`
* [`ee4b3e0`](https://github.com/npm/cli/commit/ee4b3e0e741545045dc03741c7147560961d867d) [#7373](https://github.com/npm/cli/pull/7373) `npm-registry-fetch@16.2.1`
* [`ac98fd3`](https://github.com/npm/cli/commit/ac98fd3a8514f2552555d2b8af74a52e64888797) [#7373](https://github.com/npm/cli/pull/7373) `npm-package-arg@11.0.2`
* [`9351570`](https://github.com/npm/cli/commit/93515700efbb2147a6e929cf117da9e6e87c0aca) [#7373](https://github.com/npm/cli/pull/7373) `@npmcli/package-json@5.0.3`

### Chores

* [`dd39de7`](https://github.com/npm/cli/commit/dd39de7d1da743cbd33b671fa96f66667109b451) [#7411](https://github.com/npm/cli/pull/7411) disable selflink test on apple silicon (#7411) (@lukekarrys)

## [7.4.2](https://github.com/npm/cli/compare/arborist-v7.4.1...arborist-v7.4.2) (2024-04-10)

### Bug Fixes

* [`ef381b1`](https://github.com/npm/cli/commit/ef381b1449c99e174437665aa767e7a9b60edf22) [#7363](https://github.com/npm/cli/pull/7363) use @npmcli/redact for url cleaning (#7363) (@lukekarrys)

## [7.4.1](https://github.com/npm/cli/compare/arborist-v7.4.0...arborist-v7.4.1) (2024-04-03)

### Bug Fixes

* [`8cab136`](https://github.com/npm/cli/commit/8cab136f731c69be079be08d79e3514e01bbd563) [#7324](https://github.com/npm/cli/pull/7324) ensure maxSockets is respected (#7324) (@lukekarrys)
* [`9bffa13`](https://github.com/npm/cli/commit/9bffa13e0b96efe1039d9075fdcb11d5946b2f90) [#7320](https://github.com/npm/cli/pull/7320) query: properly return :missing nodes (#7320) (@wraithgar)

### Dependencies

* [`87a61fc`](https://github.com/npm/cli/commit/87a61fc8bb65c950cda389ab3d14ae250ab2345d) [#7334](https://github.com/npm/cli/pull/7334) `npm-registry-fetch@16.2.0`
* [`6fd94f2`](https://github.com/npm/cli/commit/6fd94f249f43080ae183da36b971981e8ad00882) [#7329](https://github.com/npm/cli/pull/7329) `minimatch@9.0.4`
* [`8cab136`](https://github.com/npm/cli/commit/8cab136f731c69be079be08d79e3514e01bbd563) [#7324](https://github.com/npm/cli/pull/7324) `agent-base@7.1.1` (@lukekarrys)

### Chores

* [`8cab136`](https://github.com/npm/cli/commit/8cab136f731c69be079be08d79e3514e01bbd563) [#7324](https://github.com/npm/cli/pull/7324) add smoke-test for large prod installs (@lukekarrys)

## [7.4.0](https://github.com/npm/cli/compare/arborist-v7.3.1...arborist-v7.4.0) (2024-02-28)

### Features

* [`2366edc`](https://github.com/npm/cli/commit/2366edcaf2b32b5d1c6a7c03184c59eef0e08eae) [#7218](https://github.com/npm/cli/pull/7218) query: add :vuln pseudo selector (@wraithgar)

### Bug Fixes

* [`6d1789c`](https://github.com/npm/cli/commit/6d1789cd5f3c8aad4ef83e38c4f5d131460dad0f) [#7237](https://github.com/npm/cli/pull/7237) Arborist code cleanup (#7237) (@wraithgar)
* [`ed17276`](https://github.com/npm/cli/commit/ed172762e6a0bb020bf8a0cd1e566c3ba67fc070) [#7218](https://github.com/npm/cli/pull/7218) query-selector: don't look up private packages on :outdated (@wraithgar)

### Dependencies

* [`16d4c9f`](https://github.com/npm/cli/commit/16d4c9f0e48a18719f1461460504a4228f8f663d) [#7218](https://github.com/npm/cli/pull/7218) `@npmcli/query@3.1.0`

## [7.3.1](https://github.com/npm/cli/compare/arborist-v7.3.0...arborist-v7.3.1) (2024-01-24)

### Bug Fixes

* [`d3f1845`](https://github.com/npm/cli/commit/d3f184591af009b0b9471c1da1245c9206449f8b) [#7124](https://github.com/npm/cli/pull/7124) clean up idealTree code (@wraithgar)
* [`8382fb3`](https://github.com/npm/cli/commit/8382fb3f6acfa39d45d191c3215c7b899966b1f6) [#7126](https://github.com/npm/cli/pull/7126) fetch full packument so that libc can be assessed (@styfle, @ljharb)

### Dependencies

* [`ec77e81`](https://github.com/npm/cli/commit/ec77e81f5ecc3603bb7c9963f860a8c46f6a61ec) [#7124](https://github.com/npm/cli/pull/7124) `promise-call-limit@3.0.1`

## [7.3.0](https://github.com/npm/cli/compare/arborist-v7.2.2...arborist-v7.3.0) (2024-01-10)

### Features

* [`6673c77`](https://github.com/npm/cli/commit/6673c77bc4222d0f1719449fe903b7461b3e6907) [#6914](https://github.com/npm/cli/pull/6914) add `--libc` option to override platform specific install (#6914) (@wraithgar, @Brooooooklyn)

## [7.2.2](https://github.com/npm/cli/compare/arborist-v7.2.1...arborist-v7.2.2) (2023-12-06)

### Bug Fixes

* [`ae2d982`](https://github.com/npm/cli/commit/ae2d98292472897b8365829633cd47a6cb006d03) [#7027](https://github.com/npm/cli/pull/7027) arborist: `node.target` can be `null` when it is a file dep or symlink (#7027) (@ljharb, @lukekarrys)
* [`f875caa`](https://github.com/npm/cli/commit/f875caa86900122819311dd77cde01c700fd1817) [#6998](https://github.com/npm/cli/pull/6998) clean up shrinkwrap code (#6998) (@wraithgar)

### Chores

* [`f656b66`](https://github.com/npm/cli/commit/f656b669e549286844f2071b9b62cf23f7958034) [#7062](https://github.com/npm/cli/pull/7062) `@npmcli/template-oss@4.21.3` (#7062) (@lukekarrys)
* [`9754b17`](https://github.com/npm/cli/commit/9754b173de26f3173e7f41eab34733fe9ba50f1d) [#7051](https://github.com/npm/cli/pull/7051) use global npm for workspace tests (@lukekarrys)
* [`3891757`](https://github.com/npm/cli/commit/3891757f54d6d960cbf5f0d93d183d6424e8bed6) [#7051](https://github.com/npm/cli/pull/7051) `@npmcli/template-oss@4.21.2` (@lukekarrys)

## [7.2.1](https://github.com/npm/cli/compare/arborist-v7.2.0...arborist-v7.2.1) (2023-10-31)

### Dependencies

* [`dfb6298`](https://github.com/npm/cli/commit/dfb6298c3eb9fb7ef452906765ac5f23ea6fec49) [#6937](https://github.com/npm/cli/pull/6937) `node-gyp@10.0.0` (#6937)

## [7.2.0](https://github.com/npm/cli/compare/arborist-v7.1.0...arborist-v7.2.0) (2023-10-02)

### Features

* [`81a460f`](https://github.com/npm/cli/commit/81a460f6e6317aca2288d16cda591aa6541540c6) [#6732](https://github.com/npm/cli/pull/6732) add package-lock-only mode to npm query (@wraithgar)
* [`0d29855`](https://github.com/npm/cli/commit/0d2985535c9cc3dfc3e1f355580570c9cce37d61) [#6732](https://github.com/npm/cli/pull/6732) add no-package-lock mode to npm audit (@wraithgar)

### Bug Fixes

* [`0860159`](https://github.com/npm/cli/commit/0860159e18aa0fa985ef53fcfe0a57fbda995efb) [#6829](https://github.com/npm/cli/pull/6829) ensure workspace links query parents correctly (#6829) (@Carl-Foster)
* [`bef7481`](https://github.com/npm/cli/commit/bef7481282f18f5b8ad864dc76669801187029fe) [#6782](https://github.com/npm/cli/pull/6782) query with workspace descendents (#6782) (@bdehamer)

### Dependencies

* [`aa6728b`](https://github.com/npm/cli/commit/aa6728b1d003f0fc620b074ba0396a3e07f2db6a) [#6859](https://github.com/npm/cli/pull/6859) `tar@6.2.0`
* [`ce9089f`](https://github.com/npm/cli/commit/ce9089f604a01297d3d2dd544283696a6297dce5) [#6859](https://github.com/npm/cli/pull/6859) `npm-package-arg@11.0.1`
* [`0a47af5`](https://github.com/npm/cli/commit/0a47af509d66071908c7e0bf065dcf2f4c877669) [#6859](https://github.com/npm/cli/pull/6859) `hosted-git-info@7.0.1`
* [`3ebc474`](https://github.com/npm/cli/commit/3ebc4744433d906e5c491d183fc077ffe79958cf) [#6859](https://github.com/npm/cli/pull/6859) `@npmcli/query@3.0.1`

## [7.1.0](https://github.com/npm/cli/compare/arborist-v7.0.0...arborist-v7.1.0) (2023-09-08)

### Features

* [`1c93c44`](https://github.com/npm/cli/commit/1c93c4430300e3b3bd2cb5bab327c1732f470bca) [#6755](https://github.com/npm/cli/pull/6755) Add `--cpu` and `--os` option to override platform specific install  (#6755) (@yukukotani)

## [7.0.0](https://github.com/npm/cli/compare/arborist-v7.0.0-pre.0...arborist-v7.0.0) (2023-08-31)

### Features

* [`fb31c7e`](https://github.com/npm/cli/commit/fb31c7e5f00ae39e67f9a5d6b6860c1d839c704b) trigger release process (@lukekarrys)

## [7.0.0-pre.0](https://github.com/npm/cli/compare/arborist-v6.3.0...arborist-v7.0.0-pre.0) (2023-08-31)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed
* support for node 14 has been removed

### Bug Fixes

* [`6b251b1`](https://github.com/npm/cli/commit/6b251b1009648b36d49b83a2cc407c348fa225e0) [#6706](https://github.com/npm/cli/pull/6706) drop node 16.13.x support (@lukekarrys)
* [`e3a377d`](https://github.com/npm/cli/commit/e3a377d3b047c0436e05096d70cc5697714e413d) [#6706](https://github.com/npm/cli/pull/6706) drop node14 support (@lukekarrys)

### Dependencies

* [`eb41977`](https://github.com/npm/cli/commit/eb41977c56cbac88fa7d02f88dbf630cc652471a) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.1`
* [`f334466`](https://github.com/npm/cli/commit/f334466c53669e7debd4b9c67eafca74955509ee) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.4`
* [`bb63bf9`](https://github.com/npm/cli/commit/bb63bf945b2db8f3074e7429aff6343721c55cd1) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/run-script@7.0.0`
* [`43831d0`](https://github.com/npm/cli/commit/43831d0fe4b02cb18d1c533f2831aaeedf5102e1) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.3`
* [`44e8fec`](https://github.com/npm/cli/commit/44e8fec3f28ce3bdd0500b92cbcf8f211da3c866) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.2`
* [`2ee0fb3`](https://github.com/npm/cli/commit/2ee0fb3ac0c5e49f9eba545d6b05e20be1352414) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@16.0.0`
* [`81ff4df`](https://github.com/npm/cli/commit/81ff4dfd17024efb068816c9b0824ffc709a7cc4) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.1`
* [`c3a1a02`](https://github.com/npm/cli/commit/c3a1a021780d948a3023b622700b98aabb0df2f4) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/metavuln-calculator@7.0.0`
* [`cac0725`](https://github.com/npm/cli/commit/cac07256e7234d0782a4833dae207732c71fef95) [#6706](https://github.com/npm/cli/pull/6706) `pacote@17.0.0`
* [`fd8beaf`](https://github.com/npm/cli/commit/fd8beaf4de23b8fbd9d5b968e10a5034d1a8f7bd) [#6706](https://github.com/npm/cli/pull/6706) `npm-pick-manifest@9.0.0`
* [`c784b57`](https://github.com/npm/cli/commit/c784b57b654d25e8d932e6fe415b87e75dcf9026) [#6706](https://github.com/npm/cli/pull/6706) `npm-package-arg@11.0.0`
* [`729e893`](https://github.com/npm/cli/commit/729e893cf610de725142f72cc344d1c11f42d7af) [#6706](https://github.com/npm/cli/pull/6706) `hosted-git-info@7.0.0`
* [`7af81c7`](https://github.com/npm/cli/commit/7af81c7360a6df31cdb0a8f18104b42656166378) [#6706](https://github.com/npm/cli/pull/6706) `cacache@18.0.0`
* [`b0849ab`](https://github.com/npm/cli/commit/b0849ab6feb62bf307ee362389bfcaf0e85653be) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/package-json@5.0.0`
* [`61e9b00`](https://github.com/npm/cli/commit/61e9b00e096ce2e3122f1b21d22f3073ff22f2ce) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/metavuln-calculator@6.0.1`
* [`4c9eb17`](https://github.com/npm/cli/commit/4c9eb1703bd41555e4ef7c2fc087a349b90c9b4c) [#6706](https://github.com/npm/cli/pull/6706) `npm-install-checks@6.2.0`
* [`88ece81`](https://github.com/npm/cli/commit/88ece8161021997cb5c22040b34d0dffff55fcf1) [#6706](https://github.com/npm/cli/pull/6706) `npm-pick-manifest@8.0.2`
* [`9117a4f`](https://github.com/npm/cli/commit/9117a4fcf05291ce7609bcad5bb810df9a5158e7) [#6706](https://github.com/npm/cli/pull/6706) `ssri@10.0.5`
* [`5eea975`](https://github.com/npm/cli/commit/5eea975437ab27d02afa2aaee59b2d4f98831df3) [#6706](https://github.com/npm/cli/pull/6706) `cacache@17.1.4`
* [`ca33c98`](https://github.com/npm/cli/commit/ca33c9840533435bda634adefb61757f30fad5ab) [#6706](https://github.com/npm/cli/pull/6706) `@npmcli/metavuln-calculator@6.0.0`
* [`edbc25a`](https://github.com/npm/cli/commit/edbc25a5980c34e0d28aac7503475cd33e07f7d2) [#6706](https://github.com/npm/cli/pull/6706) `pacote@16.0.0`
* [`5d0d859`](https://github.com/npm/cli/commit/5d0d8592cbf3b816d9fe44c36d390200ec15e87a) [#6706](https://github.com/npm/cli/pull/6706) `npm-registry-fetch@15.0.0`

## [6.3.0](https://github.com/npm/cli/compare/arborist-v6.2.10...arborist-v6.3.0) (2023-07-05)

### Features

* [`67459e7`](https://github.com/npm/cli/commit/67459e7b56a5e8d2b4f8eb3a0487183013c63b99) [#6626](https://github.com/npm/cli/pull/6626) add `pkg fix` subcommand (@wraithgar)

### Bug Fixes

* [`c61e037`](https://github.com/npm/cli/commit/c61e0376408240590bfc712fe9fdadd7dc9a48bc) [#6626](https://github.com/npm/cli/pull/6626) use new load/create syntax for package-json (@wraithgar)

### Dependencies

* [`b252164`](https://github.com/npm/cli/commit/b252164dd5c866bf2d25c96836ad829d4d6909ee) [#6626](https://github.com/npm/cli/pull/6626) `@npmcli/package-json@4.0.0`

## [6.2.10](https://github.com/npm/cli/compare/arborist-v6.2.9...arborist-v6.2.10) (2023-06-21)

### Bug Fixes

* [`f5b9713`](https://github.com/npm/cli/commit/f5b97137ee6e0c380f005ebe56d4033e7dc01ac2) [#6549](https://github.com/npm/cli/pull/6549) make omit flags work properly with workspaces (#6549) (@Rayyan98, @lukekarrys)
* [`40d7e09`](https://github.com/npm/cli/commit/40d7e09aa9c038bc20e37c4fbd21d02dc82b93a7) [#6555](https://github.com/npm/cli/pull/6555) remove unnecessary package.json values (#6555) (@lukekarrys)

## [6.2.9](https://github.com/npm/cli/compare/arborist-v6.2.8...arborist-v6.2.9) (2023-05-03)

### Bug Fixes

* [`a558bbd`](https://github.com/npm/cli/commit/a558bbd3760e8da272d7afdd11e7b0f1238f92dc) [#6393](https://github.com/npm/cli/pull/6393) code cleanup (#6393) (@wraithgar)

### Dependencies

* [`e498f82`](https://github.com/npm/cli/commit/e498f82852e49f638dc661d89785df7d6112fb76) [#6416](https://github.com/npm/cli/pull/6416) `minimatch@9.0.0`

## [6.2.8](https://github.com/npm/cli/compare/arborist-v6.2.7...arborist-v6.2.8) (2023-04-19)

### Bug Fixes

* [`82879f6`](https://github.com/npm/cli/commit/82879f69c72681f636be73d13c4464e35f258954) [#6225](https://github.com/npm/cli/pull/6225) lazy loading of arborist and pacote (#6225) (@wraithgar)

### Dependencies

* [`3fa9542`](https://github.com/npm/cli/commit/3fa9542d7f3c0123cb3c49a40f6d5b7bc8d857a5) [#6363](https://github.com/npm/cli/pull/6363) `semver@7.5.0`
* [`357cc29`](https://github.com/npm/cli/commit/357cc29a335e684391c7b840019223e555919406) [#6363](https://github.com/npm/cli/pull/6363) `walk-up-path@3.0.1`

## [6.2.7](https://github.com/npm/cli/compare/arborist-v6.2.6...arborist-v6.2.7) (2023-04-05)

### Dependencies

* [`f1388b4`](https://github.com/npm/cli/commit/f1388b4c5aac0617893b546ff9c764f05d20bc07) [#6317](https://github.com/npm/cli/pull/6317) npm update
* [`deca335`](https://github.com/npm/cli/commit/deca335ed47697e6e9cb4d67c84cfff8ae95ca5c) [#6317](https://github.com/npm/cli/pull/6317) `promise-call-limit@1.0.2`

## [6.2.6](https://github.com/npm/cli/compare/arborist-v6.2.5...arborist-v6.2.6) (2023-03-30)

### Dependencies

* [`ea12627`](https://github.com/npm/cli/commit/ea12627ec8f3455ada2b011bc6ff84980b2a5b30) [#6275](https://github.com/npm/cli/pull/6275) `minimatch@7.4.2`

## [6.2.5](https://github.com/npm/cli/compare/arborist-v6.2.4...arborist-v6.2.5) (2023-03-08)

### Bug Fixes

* [`8a78c6f`](https://github.com/npm/cli/commit/8a78c6fc400e9b9ca4068c61c8374a86dec7f2d1) [#6222](https://github.com/npm/cli/pull/6222) only add directories we made to _sparseTreeRoots (#6222) (@nlf)

## [6.2.4](https://github.com/npm/cli/compare/arborist-v6.2.3...arborist-v6.2.4) (2023-03-02)

### Bug Fixes

* [`962a12e`](https://github.com/npm/cli/commit/962a12e5017dc8e576fd819d785e45d4c8d9244d) [#6193](https://github.com/npm/cli/pull/6193) arborist: dependencies from registries with a peerDependency on a workspace (#6193) (@ixalon)

### Dependencies

* [`71ae406`](https://github.com/npm/cli/commit/71ae4067bccef53aa99ccf8abbe9115daaae8e8c) [#6218](https://github.com/npm/cli/pull/6218) `@npmcli/installed-package-contents@2.0.2`

## [6.2.3](https://github.com/npm/cli/compare/arborist-v6.2.2...arborist-v6.2.3) (2023-02-22)

### Bug Fixes

* [`6ed3535`](https://github.com/npm/cli/commit/6ed353597733e906bacf6a9546983464134e4817) [#6175](https://github.com/npm/cli/pull/6175) linked-strategy lifecycle missing bins (#6175) (@fritzy)

### Documentation

* [`9bc455b`](https://github.com/npm/cli/commit/9bc455bc2c0f247ff4ca2e1fd299063008b4e260) [#6188](https://github.com/npm/cli/pull/6188) fixing typos (#6188) (@deining)

## [6.2.2](https://github.com/npm/cli/compare/arborist-v6.2.1...arborist-v6.2.2) (2023-02-07)

### Bug Fixes

* [`12ec7ee`](https://github.com/npm/cli/commit/12ec7ee1983876565445ae7967e2f14f3d95e356) remove unused package.json scripts (@lukekarrys)

### Dependencies

* [`d43f881`](https://github.com/npm/cli/commit/d43f8812af5900cce45364729871a745b379aea9) `map-workspaces@3.0.2`
* [`99457f1`](https://github.com/npm/cli/commit/99457f1f48d57f913b398e25f4e5da066af71204) `minimatch@6.1.6`

## [6.2.1](https://github.com/npm/cli/compare/arborist-v6.2.0...arborist-v6.2.1) (2023-02-01)

### Bug Fixes

* [`72a7a59`](https://github.com/npm/cli/commit/72a7a5915e9d333d104d88bf73d7a555f9400e24) [#6095](https://github.com/npm/cli/pull/6095) only save package-lock when truly finished (@wraithgar)

### Dependencies

* [`721fe3f`](https://github.com/npm/cli/commit/721fe3fac383d714aa7fd7285b4392619903b1e7) [#6118](https://github.com/npm/cli/pull/6118) `read-package-json-fast@3.0.2`
* [`6e4a649`](https://github.com/npm/cli/commit/6e4a64976dc9a359b97413cd725e93caa1f0fc28) `pacote@15.0.8`
* [`1820afe`](https://github.com/npm/cli/commit/1820afe4b34909b8702da69032dde9d3ecdbb447) `cacache@17.0.4`
* [`4b8046e`](https://github.com/npm/cli/commit/4b8046e680d5907d2df71d6d3775b66e0bea7ed2) `@npmcli/name-from-folder@2.0.0`
* [`1d4be7a`](https://github.com/npm/cli/commit/1d4be7a5457fd0081696e29f8382645873cf13d9) `@npmcli/map-workspaces@3.0.1`
* [`a39556f`](https://github.com/npm/cli/commit/a39556f1cff4526dcbcb7b65cdd86a1ba092e13e) `@npmcli/template-oss@4.11.3`

## [6.2.0](https://github.com/npm/cli/compare/arborist-v6.1.6...arborist-v6.2.0) (2023-01-25)

### Features

* [`8d6d851`](https://github.com/npm/cli/commit/8d6d8519fbbcebdca8834e19cb34ac71f045a010) [#6078](https://github.com/npm/cli/pull/6078) added --install-strategy=linked (#6078) (@fritzy)

## [6.1.6](https://github.com/npm/cli/compare/arborist-v6.1.5...arborist-v6.1.6) (2023-01-12)

### Bug Fixes

* [`b584af0`](https://github.com/npm/cli/commit/b584af0237eecd5c32cdab98b8a067798eb25eea) [#6022](https://github.com/npm/cli/pull/6022) remove unneeded param default (@wraithgar)
* [`2ba1171`](https://github.com/npm/cli/commit/2ba1171f867bfacedbab056d165d50e58b0cb7ed) streamline workspace loading code (@wraithgar)
* [`2383deb`](https://github.com/npm/cli/commit/2383deb9723593365cf748238f3b2388e7aaf6f5) [#6037](https://github.com/npm/cli/pull/6037) clean urls from arborist, owner, and ping commands (#6037) (@lukekarrys)
* [`c52cf6b`](https://github.com/npm/cli/commit/c52cf6bc547268833cde2715fe4f6299240049f8) [#5960](https://github.com/npm/cli/pull/5960) properly handle directory, file, git and alias specs in overrides (@nlf)

## [6.1.5](https://github.com/npm/cli/compare/arborist-v6.1.4...arborist-v6.1.5) (2022-12-07)

### Bug Fixes

* [`83fb125`](https://github.com/npm/cli/commit/83fb125446a9fb217eedf53ca98c203d7d48527b) [#5923](https://github.com/npm/cli/pull/5923) audit package mismatch in special case (@fritzy)

### Dependencies

* [`372d158`](https://github.com/npm/cli/commit/372d158d2637120600a95abee64355ed1cb6f990) [#5935](https://github.com/npm/cli/pull/5935) `minimatch@5.1.1` (#5935)
* [`0a3fe00`](https://github.com/npm/cli/commit/0a3fe000e2723ae6fdb8b1d3154fd3835057c992) [#5933](https://github.com/npm/cli/pull/5933) `minipass@4.0.0`
* [`cf0a174`](https://github.com/npm/cli/commit/cf0a17407abc577c27420a1c8a4a0c08c7cefce9) `ssri@10.0.1`
* [`3da9a1a`](https://github.com/npm/cli/commit/3da9a1a4ebcf1779035b5f9ae985c087f617efe3) `pacote@15.0.7`
* [`fee9b66`](https://github.com/npm/cli/commit/fee9b6686892a1c7f976c36ddd5d89b70c416817) `npm-registry-fetch@14.0.3`
* [`e940917`](https://github.com/npm/cli/commit/e940917befcdaf44ee7e24d31b540f4de8507734) `cacache@17.0.3`
* [`875bd56`](https://github.com/npm/cli/commit/875bd56c33ca5eef80c2a50a11808445f2a39a2a) `npm-package-arg@10.1.0`

## [6.1.4](https://github.com/npm/cli/compare/arborist-v6.1.3...arborist-v6.1.4) (2022-11-30)

### Bug Fixes

* [`80c6c4a`](https://github.com/npm/cli/commit/80c6c4a5111ab1779256a779a2cba41eb2c8675f) [#5907](https://github.com/npm/cli/pull/5907) do not reset hidden lockfile data before saving (#5907) (@nlf)

## [6.1.3](https://github.com/npm/cli/compare/arborist-v6.1.2...arborist-v6.1.3) (2022-11-16)

### Bug Fixes

* [`3f13818`](https://github.com/npm/cli/commit/3f1381898ad6c8a477d32765d7304dd55a2c8c9d) [#5859](https://github.com/npm/cli/pull/5859) refactor / inline single use code (#5859) (@wraithgar)

## [6.1.2](https://github.com/npm/cli/compare/arborist-v6.1.1...arborist-v6.1.2) (2022-11-09)

### Dependencies

* [`335c7e4`](https://github.com/npm/cli/commit/335c7e4348f5505fad33b8a78348a02a82b91426) [#5813](https://github.com/npm/cli/pull/5813) `cacache@17.0.2`
* [`878ddfb`](https://github.com/npm/cli/commit/878ddfb5b68c03bdcd7d7da8dae92c4947942801) `@npmcli/fs@3.1.0`

## [6.1.1](https://github.com/npm/cli/compare/arborist-v6.1.0...arborist-v6.1.1) (2022-11-02)

### Bug Fixes

* [`1f5382d`](https://github.com/npm/cli/commit/1f5382dada181cda41f1504974de1e69a6c1ad7f) [#5789](https://github.com/npm/cli/pull/5789) don't set `stdioString` for any spawn/run-script calls (@lukekarrys)
* [`0c5834e`](https://github.com/npm/cli/commit/0c5834ed635833ef49fe10cc888025a5debebe21) [#5758](https://github.com/npm/cli/pull/5758) use hosted-git-info to parse registry urls (#5758) (@lukekarrys)

### Dependencies

* [`b89c19e`](https://github.com/npm/cli/commit/b89c19e9a7674b0bd9d336c14dee1bf381843648) [#5795](https://github.com/npm/cli/pull/5795) `cli-table3@0.6.3`
* [`66f9bcd`](https://github.com/npm/cli/commit/66f9bcd10b8d8cb635593c526727056581c7955d) `nopt@7.0.0`
* [`abfb28b`](https://github.com/npm/cli/commit/abfb28b249183b8c033f8e7acc1546150cdac137) `@npmcli/run-script@6.0.0`

## [6.1.0](https://github.com/npm/cli/compare/arborist-v6.0.0...arborist-v6.1.0) (2022-10-26)

### Features

* [`3dd8d68`](https://github.com/npm/cli/commit/3dd8d68577817f65ea148629905acdee3a9b1902) [#5751](https://github.com/npm/cli/pull/5751) sort and quote yarn lock keys according to yarn rules (#5751) (@wraithgar, @shalvah)

### Dependencies

* [`de6618e`](https://github.com/npm/cli/commit/de6618e93182ba00b4be516db1efb3c51efa17ba) [#5757](https://github.com/npm/cli/pull/5757) `@npmcli/promise-spawn@5.0.0` (#5757)

## [6.0.0](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.5...arborist-v6.0.0) (2022-10-19)

### Features

* [`586e78d`](https://github.com/npm/cli/commit/586e78d59c3dad29e8e886a4764d2eb8021d11d1) empty commit to trigger all workspace releases (@lukekarrys)

## [6.0.0-pre.5](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.4...arborist-v6.0.0-pre.5) (2022-10-19)

### ⚠️ BREAKING CHANGES

* deprecate boolean install flags in favor of `--install-strategy`
    * deprecate --global-style, --global now sets --install-strategy=shallow
    * deprecate --legacy-bundling, now sets --install-strategy=nested
* this package no longer attempts to change file ownership automatically

### Features

* [`de2d33f`](https://github.com/npm/cli/commit/de2d33f3ed42e187803bdd31db4f7a12f08f353c) add --install-strategy=hoisted|nested|shallow, deprecate --global-style, --legacy-bundling (#5709) (@fritzy)
* [`475e9b6`](https://github.com/npm/cli/commit/475e9b6c0c978a104dd2ee47bde22b0a031a95f9) [#5703](https://github.com/npm/cli/pull/5703) do not alter file ownership (@nlf)

### Bug Fixes

* [`1afe5ba`](https://github.com/npm/cli/commit/1afe5ba9647d1f0f55bf0a4bace543965d05daed) account for new npm-package-arg behavior (@wraithgar)

### Dependencies

* [`88137a3`](https://github.com/npm/cli/commit/88137a329c8ad418db265dd465768a7cf5ebccb1) `npmlog@7.0.1`
* [`2008ea6`](https://github.com/npm/cli/commit/2008ea6a807acbd97912799adfe97f276202cea6) `npm-package-arg@10.0.0`, `pacote@15.0.2`
* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies

## [6.0.0-pre.4](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.3...arborist-v6.0.0-pre.4) (2022-10-05)

### Features

* [`9609e9e`](https://github.com/npm/cli/commit/9609e9eed87c735f0319ac0af265f4d406cbf800) [#5605](https://github.com/npm/cli/pull/5605) use v3 lockfiles by default (#5605) (@fritzy)

### Dependencies

* [`5344d2c`](https://github.com/npm/cli/commit/5344d2ca9ffd1f6db473fd58b46b50179f899ff5) [#5644](https://github.com/npm/cli/pull/5644) `pacote@14.0.0`
* [`6a43b31`](https://github.com/npm/cli/commit/6a43b31eab8bd392ed684d2f906259ddfe0f26b5) `@npmcli/metavuln-calculator@4.0.0`

## [6.0.0-pre.3](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.2...arborist-v6.0.0-pre.3) (2022-09-30)

### ⚠️ BREAKING CHANGES

* `npm pack` now follows a strict order of operations when applying ignore rules. If a files array is present in the package.json, then rules in .gitignore and .npmignore files from the root will be ignored.

### Features

* [`3ae796d`](https://github.com/npm/cli/commit/3ae796d937bd36a5b1b9fd6e9e8473b4f2ddc32d) implement new `npm-packlist` behavior (@lukekarrys)

## [6.0.0-pre.2](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.1...arborist-v6.0.0-pre.2) (2022-09-23)

### Features

* [`ebf167b`](https://github.com/npm/cli/commit/ebf167b621ed14933826f617077ab5890e72bf83) add `:outdated` pseudo selector (@nlf)

### Documentation

* [`8402fd8`](https://github.com/npm/cli/commit/8402fd8780c5e0461850da882dca024f7df1a681) [#5547](https://github.com/npm/cli/pull/5547) add `:outdated` pseudo selector to docs (@nlf)

### Dependencies

* [`d030f10`](https://github.com/npm/cli/commit/d030f10fd535433e5a824df1b099f500a71075dd) `@npmcli/query@2.0.0`

## [6.0.0-pre.1](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.0...arborist-v6.0.0-pre.1) (2022-09-14)

### Bug Fixes

* [`f3b0c43`](https://github.com/npm/cli/commit/f3b0c438d5b62b267f36c21d7b9fa57ae9507ef5) keep saveTypes separate for each `add` (@wraithgar)

## [6.0.0-pre.0](https://github.com/npm/cli/compare/arborist-v5.6.1...arborist-v6.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)
  * [`09c46e8`](https://github.com/npm/cli/commit/09c46e815fe1b44658d32dd760a689e8b2c8d92f) [#5324](https://github.com/npm/cli/pull/5324) feat(arborist): allow for selectors and function names with :semver pseudo selector (@nlf)

### Bug Fixes

  * [`fe926ed`](https://github.com/npm/cli/commit/fe926eddf98459e1fcb0ffd011ce7703da14928c) [#5484](https://github.com/npm/cli/pull/5484) fix: don't mark workspaces as invalid if installing links (@wraithgar)
  * [`548e70e`](https://github.com/npm/cli/commit/548e70e0f87167fb96929b29787620391a77b826) [#5376](https://github.com/npm/cli/pull/5376) fix: link.target setter (@wraithgar)
  * [`2db6c08`](https://github.com/npm/cli/commit/2db6c085ea08ee639767d37e6fd83a1ca0fbd9ce) [#5376](https://github.com/npm/cli/pull/5376) fix: loadActual cleanup (@wraithgar)

### Documentation

  * [`285b39f`](https://github.com/npm/cli/commit/285b39f8d6915823fb424cca7161a0b445b86bd3) [#5324](https://github.com/npm/cli/pull/5324) docs: add documentation for expanded :semver selector (@nlf)

## [5.6.1](https://github.com/npm/cli/compare/arborist-v5.6.0...arborist-v5.6.1) (2022-08-31)

### Bug Fixes

  * [`1e84102`](https://github.com/npm/cli/commit/1e841029917817556207c39d25be1ea91e2959e7) [#5350](https://github.com/npm/cli/pull/5350) fix: create links relative to the target (@wraithgar)
  * [`ea5e3a3`](https://github.com/npm/cli/commit/ea5e3a319a7c1b5f7f2a66284227a34b79b2c831) [#5350](https://github.com/npm/cli/pull/5350) fix: inline single-use functions (@wraithgar)
  * [`645c680`](https://github.com/npm/cli/commit/645c6804c09014b96c2d1eff191b174d12a2b7c0) [#5329](https://github.com/npm/cli/pull/5329) fix: update `index.js` spelling error in comment (@KevinBrother)
  * [`bd2ae5d`](https://github.com/npm/cli/commit/bd2ae5d79eb8807bfca6075e98432c545a9ededa) [#5323](https://github.com/npm/cli/pull/5323) fix: linting (@wraithgar)

### Dependencies

  * [`1286f03`](https://github.com/npm/cli/commit/1286f03fe73dee9a447b13b662f0c5622ab6ec9e) [#5381](https://github.com/npm/cli/pull/5381) deps: `unique-filename@2.0.1`
  * [`2c4e387`](https://github.com/npm/cli/commit/2c4e38728f25fd32624df2eb5bbf61c2c40c8ad5) [#5381](https://github.com/npm/cli/pull/5381) deps: `hosted-git-info@5.1.0`
  * [`b12ac01`](https://github.com/npm/cli/commit/b12ac013226b7d86b5b1847d58eabbac2846b153) [#5381](https://github.com/npm/cli/pull/5381) deps: `npm-pick-manifest@7.0.2`
  * [`7fbf6f7`](https://github.com/npm/cli/commit/7fbf6f7825f76906ecdec79ab15595f9e2f7b784) [#5381](https://github.com/npm/cli/pull/5381) deps: `bin-links@3.0.3`
  * [`26d2e55`](https://github.com/npm/cli/commit/26d2e551b250972caa550d56127810648a1663a1) [#5381](https://github.com/npm/cli/pull/5381) deps: `@npmcli/query@1.2.0`
  * [`a79ee00`](https://github.com/npm/cli/commit/a79ee00b530b765ed219e81de77c37057c373adf) [#5381](https://github.com/npm/cli/pull/5381) deps: `cacache@16.1.3`
  * [`8ab12dc`](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460) [#5323](https://github.com/npm/cli/pull/5323) deps: `@npmcli/eslint-config@3.1.0`

## [5.6.0](https://github.com/npm/cli/compare/arborist-v5.5.0...arborist-v5.6.0) (2022-08-17)


### Features

* **arborist:** add :overridden pseudo selector ([d221f72](https://github.com/npm/cli/commit/d221f72c00e13258469a748227a1d6f9953a5948))
* **arborist:** add overridden getter to Node class ([e6d4304](https://github.com/npm/cli/commit/e6d4304bbd03e38dcf2c7467bb1e61b5740a4c73))
* **query:** support :overridden pseudo selector ([0d4ed0f](https://github.com/npm/cli/commit/0d4ed0fb1cd86edd827cac0b5367b73bb864a9bf))

## [5.5.0](https://github.com/npm/cli/compare/arborist-v5.4.0...arborist-v5.5.0) (2022-08-10)


### Features

* **arborist:** add option to forcibly skip loading a virtual tree ([96b6781](https://github.com/npm/cli/commit/96b6781086143d7285c2c5bf7808c24b2c87e4dd))


### Bug Fixes

* **query:** tell arborist to load an actual tree, not a virtual one ([9078e27](https://github.com/npm/cli/commit/9078e27cef0233d6fc81e0ca824a34fd7685d93c))


### Dependencies

* nopt@6.0.0 ([7f31b85](https://github.com/npm/cli/commit/7f31b85db650c7a2b3b0577840251f5e25e63a01))

## [5.4.0](https://github.com/npm/cli/compare/arborist-v5.3.1...arborist-v5.4.0) (2022-08-03)


### Features

* add --replace-registry-host=<npmjs|always|never> ([#4860](https://github.com/npm/cli/issues/4860)) ([703dbbf](https://github.com/npm/cli/commit/703dbbf2a8149dff72c848d60600889a76779828))
* add --replace-registry-host=<npmjs|always|never>|<hostname> ([703dbbf](https://github.com/npm/cli/commit/703dbbf2a8149dff72c848d60600889a76779828))
* add npm query cmd ([#5000](https://github.com/npm/cli/issues/5000)) ([3c024ac](https://github.com/npm/cli/commit/3c024ace60904c69e61da00e1fb56c0c1735804a))


### Bug Fixes

* **arborist:** fix bare attribute queries ([#5248](https://github.com/npm/cli/issues/5248)) ([8233fca](https://github.com/npm/cli/commit/8233fca44321186c485964d26aa3c7c43eafff3d))
* **arborist:** pass the edge to fromPath in order to determine correct path ([#5233](https://github.com/npm/cli/issues/5233)) ([050284d](https://github.com/npm/cli/commit/050284d2abb6aa91a0f9ffad5b0c4f074e5dbf6d))
* **arborist:** use the sourceReference root rather than the node root for overrides ([#5227](https://github.com/npm/cli/issues/5227)) ([47cc95d](https://github.com/npm/cli/commit/47cc95d9ffb37fc8ff62a1d5554eab16d303aa43)), closes [#4395](https://github.com/npm/cli/issues/4395)


### Dependencies

* @npmcli/query@1.1.1 ([#5247](https://github.com/npm/cli/issues/5247)) ([d55007d](https://github.com/npm/cli/commit/d55007d9c535b17612a07a7a58cb6be94eedf77a))

## [5.3.1](https://github.com/npm/cli/compare/arborist-v5.3.0...arborist-v5.3.1) (2022-07-27)


### Bug Fixes

* allow hash character in paths ([#5122](https://github.com/npm/cli/issues/5122)) ([62b95a0](https://github.com/npm/cli/commit/62b95a04337661e3fa17093708b57000054442d9))

## [5.3.0](https://github.com/npm/cli/compare/arborist-v5.2.3...arborist-v5.3.0) (2022-07-11)


### Features

* **arborist:** add support for dependencies script ([#5094](https://github.com/npm/cli/issues/5094)) ([e9b4214](https://github.com/npm/cli/commit/e9b4214e1ddb1ad79fe6826cf2ce7ba385f0c274))

## [5.2.3](https://github.com/npm/cli/compare/arborist-v5.2.2...arborist-v5.2.3) (2022-06-23)


### Dependencies

* @npmcli/run-script@4.1.3 ([#5064](https://github.com/npm/cli/issues/5064)) ([f59a114](https://github.com/npm/cli/commit/f59a114ffe3d1f86ccb2e52a4432292ab76852cc))

## [5.2.2](https://github.com/npm/cli/compare/arborist-v5.2.1...arborist-v5.2.2) (2022-06-22)


### Bug Fixes

* Add space to SemVer log message ([#5042](https://github.com/npm/cli/issues/5042)) ([e03009f](https://github.com/npm/cli/commit/e03009f4b423e85e498f1b1851fae785de91a73d))


### Dependencies

* @npmcli/run-script@4.1.0 ([2c06cee](https://github.com/npm/cli/commit/2c06ceee82dd813c0ae84cc0b09e6941cfc5533e))
* pacote@13.6.1 ([2e50cb8](https://github.com/npm/cli/commit/2e50cb83e84cf25fee93ba0ca5a0343fbdb33c41))

### [5.2.1](https://github.com/npm/cli/compare/arborist-v5.2.0...arborist-v5.2.1) (2022-06-01)


### Bug Fixes

* **arborist:** use rawSpec for bundled and shrinkwrapped deps ([#4963](https://github.com/npm/cli/issues/4963)) ([646b6b5](https://github.com/npm/cli/commit/646b6b5d05de937beb8202e5fd8b8daf3e58e902))

## [5.2.0](https://github.com/npm/cli/compare/arborist-v5.1.1...arborist-v5.2.0) (2022-05-10)


### Features

* add flag --omit-lockfile-registry-resolved ([#4874](https://github.com/npm/cli/issues/4874)) ([bfb8bcc](https://github.com/npm/cli/commit/bfb8bccbe83753e527b43c8a3889696087dbe8f1))


### Bug Fixes

* **arborist:** link deps lifecycle scripts ([#4875](https://github.com/npm/cli/issues/4875)) ([5a50762](https://github.com/npm/cli/commit/5a50762faa37ae5964ae6f12595b20b367056c0a))

### [5.1.1](https://github.com/npm/cli/compare/arborist-v5.1.0...arborist-v5.1.1) (2022-04-26)


### Dependencies

* @npmcli/map-workspaces@2.0.3 ([3f2b24a](https://github.com/npm/cli/commit/3f2b24afe205547dbbadf5a6313e95f6b565fb49))
* cacache@16.0.6 ([532883f](https://github.com/npm/cli/commit/532883ffc35fc1cc9aec09f03bf5ee0f256b94a4))
* npmlog@6.0.2 ([5e31322](https://github.com/npm/cli/commit/5e313223100db1207818d756b081eaba3468b273))
* semver@7.3.7 ([c51e553](https://github.com/npm/cli/commit/c51e553a32315e4f1b703ca9030eb7ade91d1a85))

## [5.1.0](https://github.com/npm/cli/compare/arborist-v5.0.6...arborist-v5.1.0) (2022-04-19)


### Features

* **arborist:** add support for installLinks ([0ebadf5](https://github.com/npm/cli/commit/0ebadf5b603368557e9e837a46ea5c59c2677a81))


### Bug Fixes

* **arborist:** when replacing a Link with a Node, make sure to remove the Link target from the root ([3d96494](https://github.com/npm/cli/commit/3d964940f410052918e37a9b05818fe9dc4cd86a))

### [5.0.6](https://github.com/npm/cli/compare/arborist-v5.0.5...arborist-v5.0.6) (2022-04-13)


### Bug Fixes

* **arborist:** dont skip adding advisories to audit based on name/range ([aa4a4da](https://github.com/npm/cli/commit/aa4a4da336a6ec1963394fdbd06acb173c842d26)), closes [#4681](https://github.com/npm/cli/issues/4681)
* **arborist:** when reloading an edge, also refresh overrides ([4d676e3](https://github.com/npm/cli/commit/4d676e31a68f081b8553eff4e79db1f29acf47e1))

### [5.0.5](https://github.com/npm/cli/compare/arborist-v5.0.4...arborist-v5.0.5) (2022-04-06)


### Bug Fixes

* replace deprecated String.prototype.substr() ([#4667](https://github.com/npm/cli/issues/4667)) ([e3da5df](https://github.com/npm/cli/commit/e3da5df4152fbe547f7871547165328e1bf06262))
* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/arborist@5.0.4 ([679e569](https://github.com/npm/cli/commit/679e569d5778aef312b37c1ba3bda0171366c9fb))
* @npmcli/move-file@2.0.0 ([e9b25cd](https://github.com/npm/cli/commit/e9b25cd66bef17e807a84e7b10384f5f4d0064b7))
* @npmcli/node-gyp@2.0.0 ([0e87cac](https://github.com/npm/cli/commit/0e87cac8b6f09692f6bd1bf086aadbe323d127b5))
* @npmcli/package-json@2.0.0 ([4a9a705](https://github.com/npm/cli/commit/4a9a705de6992a3e9eefecc6c0cf8da45a527c7a))
* npm-install-checks@5.0.0 ([ad99360](https://github.com/npm/cli/commit/ad9936063f20829eb9d5358d056593883f17a57b))
* ssri@9.0.0 ([a2781a3](https://github.com/npm/cli/commit/a2781a367d62328d7f870de878f1b63d66593f4f))
* treeverse@2.0.0 ([1a90b9e](https://github.com/npm/cli/commit/1a90b9e9ebe98cce83591e11312aaf41c830f835))

### [5.0.4](https://github.com/npm/cli/compare/arborist-v5.0.3...arborist-v5.0.4) (2022-03-31)


### Bug Fixes

* **arborist:** handle link nodes in old lockfiles correctly ([6f9cb49](https://github.com/npm/cli/commit/6f9cb490e7299976c43c6a118036c130671fe188))
* **arborist:** identify and repair invalid nodes in the virtual tree ([bd96ae4](https://github.com/npm/cli/commit/bd96ae4071f9cc8a65e741f414db12e98537971d))
* **arborist:** make sure resolveParent exists before checking props ([18b8b94](https://github.com/npm/cli/commit/18b8b94357d8f57301fbaa0f1e5dc2cf1128bf3e))
* make sure we loadOverrides on the root node in loadVirtual() ([99d8845](https://github.com/npm/cli/commit/99d88454248f950b82652b592fe2b4d019c1060b))
* only call npmlog progress methods if explicitly requested ([#4644](https://github.com/npm/cli/issues/4644)) ([668ec7f](https://github.com/npm/cli/commit/668ec7f33b7a76f5e86a59f7e5a6c0e068a242b1)), closes [#3314](https://github.com/npm/cli/issues/3314)

### [5.0.3](https://www.github.com/npm/cli/compare/arborist-v5.0.2...arborist-v5.0.3) (2022-03-17)


### Bug Fixes

* **arborist:** _findMissingEdges missing dependency due to inconsistent path separators ([#4261](https://www.github.com/npm/cli/issues/4261)) ([0e7511d](https://www.github.com/npm/cli/commit/0e7511d144bdb6624e4c0fdfb31b4b42ed2954c9))
* **arborist:** save workspace version ([#4578](https://www.github.com/npm/cli/issues/4578)) ([e9a2981](https://www.github.com/npm/cli/commit/e9a2981f55f84ff521ef597883a4e732d08ce1c1))


### Dependencies

* @npmcli/metavuln-calculator@3.0.1 ([fcc6acf](https://www.github.com/npm/cli/commit/fcc6acfa808aa556748544edf4e9b73262f77608))
* cacache@16.0.0 ([e26548f](https://www.github.com/npm/cli/commit/e26548fb12a3bb23fbe32a336f1305e083aa51c0))
* pacote@13.0.5 ([340fa51](https://www.github.com/npm/cli/commit/340fa51f423a518a96c8015a67d8f6144a2e8051))

### [5.0.2](https://www.github.com/npm/cli/compare/arborist-v5.0.1...arborist-v5.0.2) (2022-03-10)


### Bug Fixes

* **rebuild:** don't run lifecycle scripts twice on linked deps ([#4529](https://www.github.com/npm/cli/issues/4529)) ([fbdb431](https://www.github.com/npm/cli/commit/fbdb43138ab8e682efb7668767465e7066d43b9f))


### Documentation

* standardize changelog heading ([#4510](https://www.github.com/npm/cli/issues/4510)) ([91f03ee](https://www.github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f))

### [5.0.1](https://www.github.com/npm/cli/compare/arborist-v5.0.0...arborist-v5.0.1) (2022-03-08)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## 2.0.0

* BREAKING CHANGE: root node is now included in inventory
* All parent/target/fsParent/etc. references set in `root` setter, rather
  than the hodgepodge of setters that existed before.
* `treeCheck` function added, to enforce strict correctness guarantees when
  `ARBORIST_DEBUG=1` in the environment (on by default in Arborist tests).

## 1.0.0

* Release for npm v7 beta
* Fully functional

## 0.0.0

* Proof of concept
* Before this, it was [`read-package-tree`](http://npm.im/read-package-tree)
