# Changelog

## [9.0.1](https://github.com/npm/cli/compare/v9.0.0...v9.0.1) (2022-10-26)

### Documentation

* [`b5fadd0`](https://github.com/npm/cli/commit/b5fadd0cec392f4bf6d60fa1358f96400be94667) [#5742](https://github.com/npm/cli/pull/5742) Better npx link (#5742) (@mrienstra)

### Dependencies

* [`de6618e`](https://github.com/npm/cli/commit/de6618e93182ba00b4be516db1efb3c51efa17ba) [#5757](https://github.com/npm/cli/pull/5757) `@npmcli/promise-spawn@5.0.0` (#5757)
* [`5625274`](https://github.com/npm/cli/commit/562527456d3862d871d042fa4ff6e38354e320ea) [#5755](https://github.com/npm/cli/pull/5755) `hosted-git-info@6.1.0` (#5755)
* [`32bdd68`](https://github.com/npm/cli/commit/32bdd686ccf826050075e770ffddf7401efa79c9) [#5754](https://github.com/npm/cli/pull/5754) `npm-packlist@7.0.2` (#5754)
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0...arborist-v6.1.0): `@npmcli/arborist@6.1.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0...libnpmdiff-v5.0.1): `libnpmdiff@5.0.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmexec-v5.0.0...libnpmexec-v5.0.1): `libnpmexec@5.0.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmfund-v4.0.0...libnpmfund-v4.0.1): `libnpmfund@4.0.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0...libnpmpack-v5.0.1): `libnpmpack@5.0.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0...libnpmpublish-v7.0.1): `libnpmpublish@7.0.1`

## [9.0.0](https://github.com/npm/cli/compare/v9.0.0-pre.6...v9.0.0) (2022-10-19)

### Features

* [`e3b004c`](https://github.com/npm/cli/commit/e3b004c0d6dfcb153c4734af12afb09897e20932) [#5727](https://github.com/npm/cli/pull/5727) move cli and all workspaces out of prerelease mode (@lukekarrys)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.5...arborist-v6.0.0): `@npmcli/arborist@6.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmaccess-v7.0.0-pre.2...libnpmaccess-v7.0.0): `libnpmaccess@7.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.3...libnpmdiff-v5.0.0): `libnpmdiff@5.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.5...libnpmexec-v5.0.0): `libnpmexec@5.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmfund-v4.0.0-pre.5...libnpmfund-v4.0.0): `libnpmfund@4.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmhook-v9.0.0-pre.1...libnpmhook-v9.0.0): `libnpmhook@9.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmorg-v5.0.0-pre.1...libnpmorg-v5.0.0): `libnpmorg@5.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.4...libnpmpack-v5.0.0): `libnpmpack@5.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.4...libnpmpublish-v7.0.0): `libnpmpublish@7.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmsearch-v6.0.0-pre.1...libnpmsearch-v6.0.0): `libnpmsearch@6.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmteam-v5.0.0-pre.1...libnpmteam-v5.0.0): `libnpmteam@5.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmversion-v4.0.0-pre.1...libnpmversion-v4.0.0): `libnpmversion@4.0.0`

## [9.0.0-pre.6](https://github.com/npm/cli/compare/v9.0.0-pre.5...v9.0.0-pre.6) (2022-10-19)

### ⚠️ BREAKING CHANGES

* `npm` now outputs some json errors on stdout. Previously `npm` would output all json formatted errors on stderr, making it difficult to parse as the stderr stream usually has logs already written to it. In the future, `npm` will differentiate between errors and crashes. Errors, such as `E404` and `ERESOLVE`, will be handled and will continue to be output on stdout. In the case of a crash, `npm` will log the error as usual but will not attempt to display it as json, even in `--json` mode. Moving a case from the category of an error to a crash will not be considered a breaking change. For more information see npm/rfcs#482.
* `npm config set` will no longer accept deprecated or invalid config options.
* `timing` and `loglevel` changes
    - `timing` has been removed as a value for `--loglevel`
    - `--timing` will show timing information regardless of
      `--loglevel`, except when `--silent`
* deprecate boolean install flags in favor of `--install-strategy`
    * deprecate --global-style, --global now sets --install-strategy=shallow
    * deprecate --legacy-bundling, now sets --install-strategy=nested
* npm will no longer attempt to modify ownership of files it creates
* this package no longer attempts to change file ownership automatically
* this package no longer attempts to change file ownership automatically

### Features

* [`d3543e9`](https://github.com/npm/cli/commit/d3543e945e721783dcb83385935f282a4bb32cf3) output json formatted errors on stdout (#5716) (@lukekarrys)
* [`be642c6`](https://github.com/npm/cli/commit/be642c6b8e3df40fd43b0110b30d3ecd44086016) refuse to set deprecated/invalid config (#5719) (@wraithgar)
* [`332914b`](https://github.com/npm/cli/commit/332914b48b616099e586893b1df21480b7ddb733) separate configs for `--timing` and `--loglevel` (@lukekarrys)
* [`f653785`](https://github.com/npm/cli/commit/f6537855e1a34b84251993a49e1ee362082ada37) deprecated `key`, `cert` config options and updated registry scoped auth docs (@fritzy)
* [`de2d33f`](https://github.com/npm/cli/commit/de2d33f3ed42e187803bdd31db4f7a12f08f353c) add --install-strategy=hoisted|nested|shallow, deprecate --global-style, --legacy-bundling (#5709) (@fritzy)
* [`58065bc`](https://github.com/npm/cli/commit/58065bc679e6968742b5b15fa2fb82dd9e8ae988) [#5704](https://github.com/npm/cli/pull/5704) do not alter file ownership (@nlf)
* [`475e9b6`](https://github.com/npm/cli/commit/475e9b6c0c978a104dd2ee47bde22b0a031a95f9) [#5703](https://github.com/npm/cli/pull/5703) do not alter file ownership (@nlf)

### Bug Fixes

* [`6ffa5b7`](https://github.com/npm/cli/commit/6ffa5b7bbb8fd7cae1a0b955a1f762661ec5e9ed) `npm hook ls` duplicates hook name prefixes (#5295) (@gennadiygashev)
* [`1afe5ba`](https://github.com/npm/cli/commit/1afe5ba9647d1f0f55bf0a4bace543965d05daed) account for new npm-package-arg behavior (@wraithgar)
* [`353b5bb`](https://github.com/npm/cli/commit/353b5bb92c3f7899526536b597252b44aa8a712d) [#5710](https://github.com/npm/cli/pull/5710) remove chownr and mkdirp-infer-owner (@nlf)

### Documentation

* [`9e74d3e`](https://github.com/npm/cli/commit/9e74d3e847c4bc0abc630fbe81328e011d6f0187) update supported engines in readme (#5725) (@lukekarrys)

### Dependencies

* [`88137a3`](https://github.com/npm/cli/commit/88137a329c8ad418db265dd465768a7cf5ebccb1) `npmlog@7.0.1`
* [`2008ea6`](https://github.com/npm/cli/commit/2008ea6a807acbd97912799adfe97f276202cea6) `npm-package-arg@10.0.0`, `pacote@15.0.2`
* [`aa01072`](https://github.com/npm/cli/commit/aa010722996ef6de46e1bb937c6f8a94dc2844fa) [#5707](https://github.com/npm/cli/pull/5707) update the following dependencies
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.4...arborist-v6.0.0-pre.5): `@npmcli/arborist@6.0.0-pre.5`
* [Workspace](https://github.com/npm/cli/compare/libnpmaccess-v7.0.0-pre.1...libnpmaccess-v7.0.0-pre.2): `libnpmaccess@7.0.0-pre.2`
* [Workspace](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.2...libnpmdiff-v5.0.0-pre.3): `libnpmdiff@5.0.0-pre.3`
* [Workspace](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.4...libnpmexec-v5.0.0-pre.5): `libnpmexec@5.0.0-pre.5`
* [Workspace](https://github.com/npm/cli/compare/libnpmfund-v4.0.0-pre.4...libnpmfund-v4.0.0-pre.5): `libnpmfund@4.0.0-pre.5`
* [Workspace](https://github.com/npm/cli/compare/libnpmhook-v9.0.0-pre.0...libnpmhook-v9.0.0-pre.1): `libnpmhook@9.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmorg-v5.0.0-pre.0...libnpmorg-v5.0.0-pre.1): `libnpmorg@5.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.3...libnpmpack-v5.0.0-pre.4): `libnpmpack@5.0.0-pre.4`
* [Workspace](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.3...libnpmpublish-v7.0.0-pre.4): `libnpmpublish@7.0.0-pre.4`
* [Workspace](https://github.com/npm/cli/compare/libnpmsearch-v6.0.0-pre.0...libnpmsearch-v6.0.0-pre.1): `libnpmsearch@6.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmteam-v5.0.0-pre.0...libnpmteam-v5.0.0-pre.1): `libnpmteam@5.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmversion-v4.0.0-pre.0...libnpmversion-v4.0.0-pre.1): `libnpmversion@4.0.0-pre.1`

## [9.0.0-pre.5](https://github.com/npm/cli/compare/v9.0.0-pre.4...v9.0.0-pre.5) (2022-10-13)

### ⚠️ BREAKING CHANGES

* the presence of auth related settings that are not scoped to a specific registry found in a config file is no longer supported and will throw errors
* the `node-version` and `npm-version` configs have been removed.
* links generated from git urls will now use `HEAD` instead of `master` as the default ref

### Features

* [`a09e19d`](https://github.com/npm/cli/commit/a09e19d88f046e54e8d75343883635a1bd056310) [#5696](https://github.com/npm/cli/pull/5696) introduce the `npm config fix` command (@nlf)
* [`d2963c6`](https://github.com/npm/cli/commit/d2963c67b992b9b3b9dd32f6f41cbbe4bcc580c8) explicitly validate config within the cli (@nlf)
* [`a5fec08`](https://github.com/npm/cli/commit/a5fec08348add7e75fa2498e6a9efe608b20aa8b) rewrite docs generation (@lukekarrys)

### Bug Fixes

* [`a35c784`](https://github.com/npm/cli/commit/a35c784f8c25dce05b4173edd6c3f8e7913d7b50) [#5691](https://github.com/npm/cli/pull/5691) config: remove `node-version` and `npm-version` (@wraithgar)

### Documentation

* [`a8532eb`](https://github.com/npm/cli/commit/a8532eb39504584cef452152948e015cef8c010a) [#5661](https://github.com/npm/cli/pull/5661) typo missing parentheses (@hbrls)
* [`542efdb`](https://github.com/npm/cli/commit/542efdb0a31f663cd899bc6d2ddad8fa88c20bc8) update `folders` page for modern npm (@shalvah)

### Dependencies

* [`cee3fd9`](https://github.com/npm/cli/commit/cee3fd9905c7eb0a5cb26a8c9c08c5db48becd15) `@npmcli/config@5.0.0`
* [`2a740b1`](https://github.com/npm/cli/commit/2a740b14c3789d80825b1345f2e99765fcb90351) [#5692](https://github.com/npm/cli/pull/5692) `hosted-git-info@6.0.0`
* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.2...libnpmpack-v5.0.0-pre.3): `libnpmpack@5.0.0-pre.3`
* [Workspace](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.2...libnpmpublish-v7.0.0-pre.3): `libnpmpublish@7.0.0-pre.3`

## [9.0.0-pre.4](https://github.com/npm/cli/compare/v9.0.0-pre.3...v9.0.0-pre.4) (2022-10-05)

### Features

* [`9609e9e`](https://github.com/npm/cli/commit/9609e9eed87c735f0319ac0af265f4d406cbf800) [#5605](https://github.com/npm/cli/pull/5605) use v3 lockfiles by default (#5605) (@fritzy)

### Bug Fixes

* [`e4e8ae2`](https://github.com/npm/cli/commit/e4e8ae20aef9e27e57282e87e8757d5b364abb39) libnpmpack: obey foregroundScripts (@winterqt)
* [`07fabc9`](https://github.com/npm/cli/commit/07fabc93007495f0926f4dd24b4350c07d92887d) [#5633](https://github.com/npm/cli/pull/5633) `npm link` should override `--install-links` (#5633) (@fritzy)
* [`02fcbb6`](https://github.com/npm/cli/commit/02fcbb67e6b7cf78cd6dc996570b0ba58132de22) [#5634](https://github.com/npm/cli/pull/5634) ensure Arborist constructor gets passed around everywhere for pacote (#5634) (@nlf)

### Documentation

* [`f37caad`](https://github.com/npm/cli/commit/f37caad9e92c50ae949014f6bee6375d9299fb39) [#5606](https://github.com/npm/cli/pull/5606) accurately describe install-links effect on relative paths (#5606) (@lukekarrys)
* [`97c32ed`](https://github.com/npm/cli/commit/97c32ed24d8fa2edcdbb9448839a1f1c9d8fb86f) [#5637](https://github.com/npm/cli/pull/5637) remove link to cache command (#5637) (@wraithgar)
* [`130bc9f`](https://github.com/npm/cli/commit/130bc9fb31fcff956765493a9e3cec668867c30e) [#5626](https://github.com/npm/cli/pull/5626) Remove circular reference (#5626) (@giovanniPepi)

### Dependencies

* [`5344d2c`](https://github.com/npm/cli/commit/5344d2ca9ffd1f6db473fd58b46b50179f899ff5) [#5644](https://github.com/npm/cli/pull/5644) `pacote@14.0.0`
* [`6a43b31`](https://github.com/npm/cli/commit/6a43b31eab8bd392ed684d2f906259ddfe0f26b5) `@npmcli/metavuln-calculator@4.0.0`
* [`501f8ca`](https://github.com/npm/cli/commit/501f8ca47bb042f19cdfca4026970caf7160f7f6) [#5640](https://github.com/npm/cli/pull/5640) `semver@7.3.8` (#5640)
* [`8b072dc`](https://github.com/npm/cli/commit/8b072dc113190ed49b296a5f02650b7d8cbf384a) [#5639](https://github.com/npm/cli/pull/5639) `@npmcli/ci-detect@3.0.0` (#5639)
* [`1ebbb44`](https://github.com/npm/cli/commit/1ebbb4454c09891ca2c9f9a11432c4a10ccf8c32) [#5638](https://github.com/npm/cli/pull/5638) `npm-profile@7.0.0` (#5638)
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.3...arborist-v6.0.0-pre.4): `@npmcli/arborist@6.0.0-pre.4`
* [Workspace](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.1...libnpmdiff-v5.0.0-pre.2): `libnpmdiff@5.0.0-pre.2`
* [Workspace](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.3...libnpmexec-v5.0.0-pre.4): `libnpmexec@5.0.0-pre.4`
* [Workspace](https://github.com/npm/cli/compare/libnpmfund-v4.0.0-pre.3...libnpmfund-v4.0.0-pre.4): `libnpmfund@4.0.0-pre.4`
* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.1...libnpmpack-v5.0.0-pre.2): `libnpmpack@5.0.0-pre.2`
* [Workspace](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.1...libnpmpublish-v7.0.0-pre.2): `libnpmpublish@7.0.0-pre.2`

## [9.0.0-pre.3](https://github.com/npm/cli/compare/v9.0.0-pre.2...v9.0.0-pre.3) (2022-09-30)

### ⚠️ BREAKING CHANGES

* `npm pack` now follows a strict order of operations when applying ignore rules. If a files array is present in the package.json, then rules in .gitignore and .npmignore files from the root will be ignored.
* `--timing` file changes:
    - When run with the `--timing` flag, `npm` now writes timing data to a
    file alongside the debug log data, respecting the `logs-dir` option and
    falling back to `<CACHE>/_logs/` dir, instead of directly inside the
    cache directory.
    - The timing file data is no longer newline delimited JSON, and instead
    each run will create a uniquely named `<ID>-timing.json` file, with the
    `<ID>` portion being the same as the debug log.
    - Finally, the data inside the file now has three top level keys,
    `metadata`, `timers, and `unfinishedTimers` instead of everything being
    a top level key.

### Features

* [`3ae796d`](https://github.com/npm/cli/commit/3ae796d937bd36a5b1b9fd6e9e8473b4f2ddc32d) implement new `npm-packlist` behavior (@lukekarrys)
* [`e64d69a`](https://github.com/npm/cli/commit/e64d69aedecc0943425605b3a6dc68aec3ad93aa) [#5581](https://github.com/npm/cli/pull/5581) write eresolve error files to the logs directory (@lukekarrys)
* [`3445da0`](https://github.com/npm/cli/commit/3445da0138f9eed9d73d2b3f5f451fcc1fa2e3fe) timings are now written alongside debug log files (@lukekarrys)

### Documentation

* [`f0e7584`](https://github.com/npm/cli/commit/f0e758494698d9dd8a58d07bf71c87608c36869e) [#5601](https://github.com/npm/cli/pull/5601) update docs/logging for new --access default (@wraithgar)

### Dependencies

* [`bc21552`](https://github.com/npm/cli/commit/bc2155247d00b7a868c414f4bc86993069b035f9) [#5603](https://github.com/npm/cli/pull/5603) `npm-package-arg@9.1.2`
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.2...arborist-v6.0.0-pre.3): `@npmcli/arborist@6.0.0-pre.3`
* [Workspace](https://github.com/npm/cli/compare/libnpmdiff-v5.0.0-pre.0...libnpmdiff-v5.0.0-pre.1): `libnpmdiff@5.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.2...libnpmexec-v5.0.0-pre.3): `libnpmexec@5.0.0-pre.3`
* [Workspace](https://github.com/npm/cli/compare/libnpmfund-v4.0.0-pre.2...libnpmfund-v4.0.0-pre.3): `libnpmfund@4.0.0-pre.3`
* [Workspace](https://github.com/npm/cli/compare/libnpmpack-v5.0.0-pre.0...libnpmpack-v5.0.0-pre.1): `libnpmpack@5.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmpublish-v7.0.0-pre.0...libnpmpublish-v7.0.0-pre.1): `libnpmpublish@7.0.0-pre.1`

## [9.0.0-pre.2](https://github.com/npm/cli/compare/v9.0.0-pre.1...v9.0.0-pre.2) (2022-09-23)

### ⚠️ BREAKING CHANGES

* the default `auth-type` config value is now `web`
* `login`, `adduser`, and `auth-type` changes
    - This removes all `auth-type` configs except `web` and `legacy`.
    - `login` and `adduser` are now separate commands that send different data to the registry.
    - `auth-type` config values `web` and `legacy` only try
    their respective methods, npm no longer tries them all and waits to see
    which one doesn't fail.

### Features

* [`66ed584`](https://github.com/npm/cli/commit/66ed58454418dd69c4cd8196ad8499e73f7e46e1) [#5551](https://github.com/npm/cli/pull/5551) default auth-type to web (#5551) (@wraithgar)
* [`6ee5b32`](https://github.com/npm/cli/commit/6ee5b320d2eab58c18d50b861b3cfabe7f24124a) query: display `queryContext` in results (@nlf)
* [`314311c`](https://github.com/npm/cli/commit/314311c61b8f341715c168199d52976ee3237077) [#5550](https://github.com/npm/cli/pull/5550) separate login/adduser, remove auth types (#5550) (@wraithgar)

### Bug Fixes

* [`0d90a01`](https://github.com/npm/cli/commit/0d90a011fff411c878ba4b44582f14ef7dbdceb1) [#5480](https://github.com/npm/cli/pull/5480) audit: add a condition to allow third-party registries returning E400 (#5480) (@juanheyns, Juan Heyns)

### Documentation

* [`2d756cb`](https://github.com/npm/cli/commit/2d756cbb05125dcb769f2ca4c1687e42568d5882) [#5527](https://github.com/npm/cli/pull/5527) add instruction to query objects with npm view (#5527) (@moonith)
* [`8743366`](https://github.com/npm/cli/commit/874336699681ac37857167b2438fac19c059511c) [#5519](https://github.com/npm/cli/pull/5519) add hash to "tag" config link (#5519) (@mrienstra, @lukekarrys)
* [`5645c51`](https://github.com/npm/cli/commit/5645c51410a730c4b9c6831cf81ab22efbe8c0ce) [#5521](https://github.com/npm/cli/pull/5521) link mentions of config parameters (#5521) (@mrienstra)
* [`19762b4`](https://github.com/npm/cli/commit/19762b4ac4b10741ff53ddd315be1fd23d9b1e28) [#5529](https://github.com/npm/cli/pull/5529) modify Misleading doc about bins (@Hafizur046)
* [`19762b4`](https://github.com/npm/cli/commit/19762b4ac4b10741ff53ddd315be1fd23d9b1e28) [#5529](https://github.com/npm/cli/pull/5529) modify misleading doc about package.json:bin (#5529) (@Hafizur046)
* [`8402fd8`](https://github.com/npm/cli/commit/8402fd8780c5e0461850da882dca024f7df1a681) [#5547](https://github.com/npm/cli/pull/5547) add `:outdated` pseudo selector to docs (@nlf)

### Dependencies

* [`d030f10`](https://github.com/npm/cli/commit/d030f10fd535433e5a824df1b099f500a71075dd) `@npmcli/query@2.0.0`
* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.1...arborist-v6.0.0-pre.2): `@npmcli/arborist@6.0.0-pre.2`
* [Workspace](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.1...libnpmexec-v5.0.0-pre.2): `libnpmexec@5.0.0-pre.2`
* [Workspace](https://github.com/npm/cli/compare/libnpmfund-v4.0.0-pre.1...libnpmfund-v4.0.0-pre.2): `libnpmfund@4.0.0-pre.2`

## [9.0.0-pre.1](https://github.com/npm/cli/compare/v9.0.0-pre.0...v9.0.0-pre.1) (2022-09-14)

### ⚠️ BREAKING CHANGES

* renames most of the `npm access` subcommands
* the api for libnpmaccess is different now

### Features

* [`9c32c6c`](https://github.com/npm/cli/commit/9c32c6c8d6fc5bdfd6af685731fe26920d7e5446) rewrite: rewrite `npm access` (@wraithgar)
* [`854521b`](https://github.com/npm/cli/commit/854521baa49ef88ff9586ec2cc5f1fbaee7fa364) rewrite: Rewrite libnpmaccess (@wraithgar)

### Bug Fixes

* [`c3d7549`](https://github.com/npm/cli/commit/c3d75499cfd4e3601c6ca31621b2f693af466c4d) add tag to publish log message (@wraithgar)

### Documentation

* [`fd0eebe`](https://github.com/npm/cli/commit/fd0eebe4c2b55dd69972aff7de1b4db14ea6799a) update registry docs header (@hughlilly)

### Dependencies

* [Workspace](https://github.com/npm/cli/compare/arborist-v6.0.0-pre.0...arborist-v6.0.0-pre.1): `@npmcli/arborist@6.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmaccess-v7.0.0-pre.0...libnpmaccess-v7.0.0-pre.1): `libnpmaccess@7.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmexec-v5.0.0-pre.0...libnpmexec-v5.0.0-pre.1): `libnpmexec@5.0.0-pre.1`
* [Workspace](https://github.com/npm/cli/compare/libnpmfund-v4.0.0-pre.0...libnpmfund-v4.0.0-pre.1): `libnpmfund@4.0.0-pre.1`

## [9.0.0-pre.0](https://github.com/npm/cli/compare/v8.19.1...v9.0.0-pre.0) (2022-09-08)

### ⚠ BREAKING CHANGES

* **workspaces:** all workspace packages are now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`
* this removes the `npm birthday` command
* this removes `npm set-script`
* this changes the default value of `install-links` to true
* this removes the `npm bin` command
* `npm` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

  * [`e95017a`](https://github.com/npm/cli/commit/e95017a07b041cbb3293e659dad853f76462c108) [#5485](https://github.com/npm/cli/pull/5485) feat(workspaces): update supported node engines in package.json (@lukekarrys)
  * [`49bbb2f`](https://github.com/npm/cli/commit/49bbb2fb9d56e02d94da652befaa3d445283090b) [#5455](https://github.com/npm/cli/pull/5455) feat: remove `npm birthday` (@wraithgar)
  * [`926f0ad`](https://github.com/npm/cli/commit/926f0adbd71949c905932a241a245b78c85ef643) [#5456](https://github.com/npm/cli/pull/5456) feat: remove `npm set-script` (@wraithgar)
  * [`2a8c2fc`](https://github.com/npm/cli/commit/2a8c2fcd124ce7d4b23a6c26552d097c6501ac74) [#5458](https://github.com/npm/cli/pull/5458) feat: default `install-links` to true (@wraithgar)
  * [`2e92800`](https://github.com/npm/cli/commit/2e9280072f9852466fa0944d3a0fdb0c8af156a9) [#5459](https://github.com/npm/cli/pull/5459) feat: remove `npm bin` (@wraithgar)
  * [`457d388`](https://github.com/npm/cli/commit/457d388c9a70b4bc6c2421f576c79fb7524ff259) [#5475](https://github.com/npm/cli/pull/5475) feat: update supported node engines in package.json (@wraithgar)

### Bug Fixes

  * [`41481f8`](https://github.com/npm/cli/commit/41481f8bc1de0fb92a2d6aab3d4a43292d1a1db7) [#5475](https://github.com/npm/cli/pull/5475) fix: attempt more graceful failure in older node versions (@wraithgar)

### Documentation

  * [`7fc2b6f`](https://github.com/npm/cli/commit/7fc2b6f3cc157c8727da9e480f1f552eae2451e2) [#5468](https://github.com/npm/cli/pull/5468) docs: remove duplicate description for `prepare` script (@kidonng)
  * [`285b39f`](https://github.com/npm/cli/commit/285b39f8d6915823fb424cca7161a0b445b86bd3) [#5324](https://github.com/npm/cli/pull/5324) docs: add documentation for expanded :semver selector (@nlf)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @npmcli/arborist bumped from ^5.6.1 to ^6.0.0-pre.0
    * libnpmaccess bumped from ^6.0.4 to ^7.0.0-pre.0
    * libnpmdiff bumped from ^4.0.5 to ^5.0.0-pre.0
    * libnpmexec bumped from ^4.0.12 to ^5.0.0-pre.0
    * libnpmfund bumped from ^3.0.3 to ^4.0.0-pre.0
    * libnpmhook bumped from ^8.0.4 to ^9.0.0-pre.0
    * libnpmorg bumped from ^4.0.4 to ^5.0.0-pre.0
    * libnpmpack bumped from ^4.1.3 to ^5.0.0-pre.0
    * libnpmpublish bumped from ^6.0.5 to ^7.0.0-pre.0
    * libnpmsearch bumped from ^5.0.4 to ^6.0.0-pre.0
    * libnpmteam bumped from ^4.0.4 to ^5.0.0-pre.0
    * libnpmversion bumped from ^3.0.7 to ^4.0.0-pre.0
