# Changelog

## [12.0.0-pre.2](https://github.com/npm/cli/compare/v12.0.0-pre.1...v12.0.0-pre.2) (2026-06-29)
### Features
* [`b51d156`](https://github.com/npm/cli/commit/b51d156fd9858f418775df9c70859377eba1fa0c) [#9672](https://github.com/npm/cli/pull/9672) arborist: extend replace-registry-host with URL prefix matching (#6110) (#9672) (@u2mejc)
* [`86416a6`](https://github.com/npm/cli/commit/86416a626e4599791c5d8115ed08aa4369774844) [#9674](https://github.com/npm/cli/pull/9674) graduate the linked install strategy from experimental to stable (#9674) (@manzoorwanijk)
* [`c4e5356`](https://github.com/npm/cli/commit/c4e53561e5c112f635b1eb5bdca8198d8dffcd12) [#9651](https://github.com/npm/cli/pull/9651) install-scripts: prune unused allowScripts entries (#9651) (@JamieMagee)
* [`0c4dd41`](https://github.com/npm/cli/commit/0c4dd414f213971c82fe0d620bbf34d7fae25f0d) [#9629](https://github.com/npm/cli/pull/9629) namespace install-script approval commands under npm install-scripts (#9629) (@manzoorwanijk)
* [`58cd8f5`](https://github.com/npm/cli/commit/58cd8f591d0fdeafbb8f477fb8b8f5aa2e042c90) [#9586](https://github.com/npm/cli/pull/9586) `.npm-extension` transformManifest for imperative manifest repairs (#9586) (@manzoorwanijk)
### Bug Fixes
* [`024e6d9`](https://github.com/npm/cli/commit/024e6d98fd0262c87c3207387d324b7a9274aed8) [#9670](https://github.com/npm/cli/pull/9670) sbom: percent-encode vcs_url qualifier in generated purls (#9670) (@ubeddulla)
* [`6da6555`](https://github.com/npm/cli/commit/6da65552c8941d051340359174d75f54b70dadec) [#9588](https://github.com/npm/cli/pull/9588) output all the required parameters for npm token list (#9588) (@rijildaniel)
* [`ae6dbeb`](https://github.com/npm/cli/commit/ae6dbeb12a6f4b313a28c99068e34ba834ae91d1) [#9657](https://github.com/npm/cli/pull/9657) arborist: surface undeclared workspaces under the linked strategy (#9657) (@manzoorwanijk)
* [`0c33947`](https://github.com/npm/cli/commit/0c339479113d8f2c2e3455afc1344037e33e532a) [#9661](https://github.com/npm/cli/pull/9661) reify: report added count for fresh linked installs (#9661) (@manzoorwanijk)
* [`803ba70`](https://github.com/npm/cli/commit/803ba701d7a4f188308d99d47d1f5587930acbba) [#9656](https://github.com/npm/cli/pull/9656) query: report logical dep location under linked strategy (#9656) (@manzoorwanijk)
* [`60d0d3d`](https://github.com/npm/cli/commit/60d0d3d7c4c8b394b4a35b18f138439d75308368) [#9652](https://github.com/npm/cli/pull/9652) allowScripts: close three enforcement gaps (#9652) (@JamieMagee)
* [`d6fbb55`](https://github.com/npm/cli/commit/d6fbb55991cf92e8c9a904c88b9b7736cf3a1861) [#9639](https://github.com/npm/cli/pull/9639) exec: resolve workspace-local bin under the linked install strategy (#9639) (@manzoorwanijk)
* [`7e29a19`](https://github.com/npm/cli/commit/7e29a19f04b5a0fa136d3a342346c4b1ea21043f) [#9646](https://github.com/npm/cli/pull/9646) ls: restore 100% coverage on latest after #9626 (#9646) (@manzoorwanijk)
* [`971500f`](https://github.com/npm/cli/commit/971500fce94c91b1a78ab8b88664a03070c571dd) [#9606](https://github.com/npm/cli/pull/9606) approve-scripts: approve deps with no resolved URL by name (#9606) (@JamieMagee)
* [`7655822`](https://github.com/npm/cli/commit/765582219fee6ca599ad65681c7b63168801aa15) [#9597](https://github.com/npm/cli/pull/9597) arborist: don't flag inert optional deps in strict-allow-scripts (#9597) (@JamieMagee)
* [`1a9ce8e`](https://github.com/npm/cli/commit/1a9ce8e3f56ec26dd283b8957119f721d8d3fe5f) [#9592](https://github.com/npm/cli/pull/9592) link: scope `npm link <path> --workspace` to the workspace, not the root (#9592) (@manzoorwanijk)
### Documentation
* [`fdcfcee`](https://github.com/npm/cli/commit/fdcfcee5b68fa3e0dce1afaa7f4ac7d32d74b5cd) [#9678](https://github.com/npm/cli/pull/9678) recommend install-strategy=linked to catch phantom dependencies (#9678) (@manzoorwanijk)
### Dependencies
* [`f055ce6`](https://github.com/npm/cli/commit/f055ce6879c4650d47d38e0b25ee50be8d4f90ca) [#9695](https://github.com/npm/cli/pull/9695) `undici@6.27.0`
* [`2d74bfb`](https://github.com/npm/cli/commit/2d74bfb7ce9ff9a4db75e325e4102d2595567517) [#9695](https://github.com/npm/cli/pull/9695) `tinyglobby@0.2.17`
* [`c1edadd`](https://github.com/npm/cli/commit/c1edadd85e707889b4b6b76dc3a850b1cc702e06) [#9695](https://github.com/npm/cli/pull/9695) `postcss-selector-parser@7.1.4`
* [`2b7c6a4`](https://github.com/npm/cli/commit/2b7c6a42d6ce45f68e592bcea349b118085f5f40) [#9695](https://github.com/npm/cli/pull/9695) `cmd-shim@9.0.2`
* [`c1d0a10`](https://github.com/npm/cli/commit/c1d0a1047bbd5808bda73c7a32ce6b07c6a0ce61) [#9695](https://github.com/npm/cli/pull/9695) `brace-expansion@5.0.7`
* [`8e6ba7a`](https://github.com/npm/cli/commit/8e6ba7a4c045755388bd20a5e54f088c449dca8b) [#9695](https://github.com/npm/cli/pull/9695) `@sigstore/verify@4.1.0`
* [`09ce72f`](https://github.com/npm/cli/commit/09ce72fa64bdc4764f33a8da0f2643470952ef71) [#9695](https://github.com/npm/cli/pull/9695) `@sigstore/core@4.0.1`
* [`a18679a`](https://github.com/npm/cli/commit/a18679a59ce98b27368d0b0f0a0425bd2dcccda8) [#9695](https://github.com/npm/cli/pull/9695) `@npmcli/agent@5.0.2`
* [`52349de`](https://github.com/npm/cli/commit/52349de3a6a9d79bc7cb852973830f7c4cc6ca9f) [#9695](https://github.com/npm/cli/pull/9695) `tar@7.5.19`
* [`0f77bb1`](https://github.com/npm/cli/commit/0f77bb17e34417771cc65809fe84241ab80a5094) [#9695](https://github.com/npm/cli/pull/9695) `semver@7.8.5`
* [`ce11dcf`](https://github.com/npm/cli/commit/ce11dcf775f6bc3ad42bf3f3f6b9e0ff7cc3e695) [#9596](https://github.com/npm/cli/pull/9596) `npm-packlist@11.3.0`
### Chores
* [`bbd640d`](https://github.com/npm/cli/commit/bbd640d9ce13c1a8f845eca48ec7a710f46a5740) [#9695](https://github.com/npm/cli/pull/9695) dev dependency updates (@owlstronaut)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.2): `@npmcli/arborist@10.0.0-pre.2`
* [workspace](https://github.com/npm/cli/releases/tag/config-v11.0.0-pre.2): `@npmcli/config@11.0.0-pre.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v9.0.0-pre.1): `libnpmdiff@9.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v11.0.0-pre.1): `libnpmexec@11.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v8.0.0-pre.1): `libnpmfund@8.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v10.0.0-pre.2): `libnpmpack@10.0.0-pre.2`

## [12.0.0-pre.1](https://github.com/npm/cli/compare/v12.0.0-pre.0...v12.0.0-pre.1) (2026-06-19)
### ⚠️ BREAKING CHANGES
* Preserve https protocol when working with git (#8703)
* The default license for `npm init` has been changed from "ISC" to an empty string. If not set, the license field will be omitted from new packages.
* `npm` now supports node `^22.22.2 || ^24.15.0 || >=26.0.0`
* allow-git and allow-remote now default to "none"; set them to "all" (or "root") to install git or user-supplied tarball-URL dependencies.
* root \`preinstall\` now runs before dependencies are installed.
* unknown configs in .npmrc, unknown CLI flags, abbreviated flags, and single-hyphen multi-char shorthands now throw instead of warning.
### Features
* [`ce7681f`](https://github.com/npm/cli/commit/ce7681fe7dbcc20abb5f1379558e14ddd069654f) [#9496](https://github.com/npm/cli/pull/9496) packageExtensions for root-owned dependency manifest repairs (#9496) (@manzoorwanijk)
* [`1db885c`](https://github.com/npm/cli/commit/1db885c84b2dfc5126ab663abb12262b533922c1) [#9439](https://github.com/npm/cli/pull/9439) native dependency patching (npm patch add/commit/update/ls/rm) (#9439) (@manzoorwanijk)
* [`fc80bb3`](https://github.com/npm/cli/commit/fc80bb359502699bb0a055157e01eaedd5bd73c8) [#9234](https://github.com/npm/cli/pull/9234) remove default license for npm init (@owlstronaut)
* [`be8053c`](https://github.com/npm/cli/commit/be8053c390a2be3902b9382d3c7d4ad9012fa1c2) [#9544](https://github.com/npm/cli/pull/9544) warn when min-release-age blocks an audit fix (#9544) (@JamieMagee)
* [`18eb967`](https://github.com/npm/cli/commit/18eb9672dc884be4412752fb6e55e9d33c261c65) [#9559](https://github.com/npm/cli/pull/9559) bump to new node engine range (@owlstronaut)
* [`c3e1a71`](https://github.com/npm/cli/commit/c3e1a7175c6475553e212e2f7671bd31bfe07aba) [#9532](https://github.com/npm/cli/pull/9532) add min-release-age-exclude config (@JamieMagee, @caseyjhol)
* [`5cd5150`](https://github.com/npm/cli/commit/5cd5150d3e85dcf5d246e7e5c9de216c2ff849db) [#9424](https://github.com/npm/cli/pull/9424) default-deny install scripts (allowScripts opt-in) [v12] (@JamieMagee)
* [`64e3f79`](https://github.com/npm/cli/commit/64e3f798344e66f4c500636cb8aec5c8111a1fe9) [#9480](https://github.com/npm/cli/pull/9480) allowScripts tooling and inBundle hardening (#9480) (@JamieMagee)
* [`caa3295`](https://github.com/npm/cli/commit/caa329568d32587e53f6e098f43b550dd2685034) [#9466](https://github.com/npm/cli/pull/9466) default allow-git and allow-remote to none (@owlstronaut)
* [`f2e4a28`](https://github.com/npm/cli/commit/f2e4a285ec5ed43055462a47db6d330758a16e64) [#9351](https://github.com/npm/cli/pull/9351) add a global npmignore file (#9351) (@ljharb)
* [`c9be2d1`](https://github.com/npm/cli/commit/c9be2d1efadd353e743bcebd52faaa5aa64e2fc0) [#9153](https://github.com/npm/cli/pull/9153) publish --access=private alias for restricted (#9153) (@reggi, @Copilot)
* [`7068d42`](https://github.com/npm/cli/commit/7068d4286eb446fdb0ded08d15d7b5c3883d80f5) [#9360](https://github.com/npm/cli/pull/9360) Phase 1 of `allowScripts` opt-in install-script policy (#9360) (@JamieMagee)
* [`979518d`](https://github.com/npm/cli/commit/979518dd198b9f2beb788c6c3cdcd1e055b03d22) [#9276](https://github.com/npm/cli/pull/9276) error on unknown configs, flags, and abbreviations (#9276) (@owlstronaut)
### Bug Fixes
* [`e96a7de`](https://github.com/npm/cli/commit/e96a7decbd00d637ec8d9121c62cef2930abbb69) [#8703](https://github.com/npm/cli/pull/8703) Preserve https protocol when working with git (#8703) (@oldium)
* [`a847d28`](https://github.com/npm/cli/commit/a847d28d787f4f864de00ad1fd3344ccac016c62) [#9575](https://github.com/npm/cli/pull/9575) patch: warn when `patch update --to` targets an uninstalled version (#9575) (@manzoorwanijk)
* [`62b0694`](https://github.com/npm/cli/commit/62b0694d5ec4c529076bf968c3fe6cd47c3f2bb0) [#9576](https://github.com/npm/cli/pull/9576) patch: explain out-of-sync lockfile after --ignore-patch-failures (#9576) (@manzoorwanijk)
* [`5ddf6cc`](https://github.com/npm/cli/commit/5ddf6ccce5255d35da217d3e7342dde2bcb478d1) [#9567](https://github.com/npm/cli/pull/9567) patch: keep the update marker on a no-op commit so a retry finalizes (#9567) (@manzoorwanijk)
* [`fc3ef5a`](https://github.com/npm/cli/commit/fc3ef5a096854a73817af407fabb5eb5f98b50b1) [#9559](https://github.com/npm/cli/pull/9559) adapt to @npmcli/run-script@11 breaking changes (@owlstronaut)
* [`abf78b3`](https://github.com/npm/cli/commit/abf78b3c143a1825de910c0e401d01c0d3f5199b) [#9540](https://github.com/npm/cli/pull/9540) match dotted and versioned args in approve-scripts/deny-scripts (@owlstronaut)
* [`f6270d1`](https://github.com/npm/cli/commit/f6270d1069dcf60b4798f83eb87b6580162902e6) [#9531](https://github.com/npm/cli/pull/9531) emit valid JSON from approve-scripts/deny-scripts --json (@owlstronaut)
* [`0e55f97`](https://github.com/npm/cli/commit/0e55f97deea0f2395196dd572fac5fd7c9fbee38) [#9492](https://github.com/npm/cli/pull/9492) pass script-shell to publish lifecycle hooks (@Zelys-DFKH)
* [`2cbb13b`](https://github.com/npm/cli/commit/2cbb13b77edd9410704eac6f30ffea30a18c7046) [#9490](https://github.com/npm/cli/pull/9490) recognize allowScripts for local link targets (#9490) (@cyphercodes, @cyphercodes)
* [`bf623e0`](https://github.com/npm/cli/commit/bf623e0a9ea568a47b777c563e48a097cb12e442) [#9473](https://github.com/npm/cli/pull/9473) validate registry path for allow-remote tarballs (@Abhinav-143x)
* [`6be874b`](https://github.com/npm/cli/commit/6be874b88174e87f004b31cbbdda54d0d50cb399) [#9479](https://github.com/npm/cli/pull/9479) list pending scripts in approve-scripts when ignore-scripts is set (#9479) (@JamieMagee)
* [`6603b2c`](https://github.com/npm/cli/commit/6603b2c5fdbb5d4ec504199b2f10b5b378168016) [#9469](https://github.com/npm/cli/pull/9469) suggest --allow-scripts for global installs in unreviewed-scripts warnings (#9469) (@JamieMagee)
* [`fe820b6`](https://github.com/npm/cli/commit/fe820b6f2bbac9fdb3c8937d6d5bf6544bac55fc) [#9442](https://github.com/npm/cli/pull/9442) invalid issue template YAML indentation (#9442) (@fallintoplace)
* [`fe41ae7`](https://github.com/npm/cli/commit/fe41ae7c6b38e7e9957b646bf379e2b5daae03f9) [#9404](https://github.com/npm/cli/pull/9404) show full parent command path in subcommand usage errors (#9404) (@shaanmajid)
* [`75bf7de`](https://github.com/npm/cli/commit/75bf7decec60da0e68296356b8da82d3eb18f0bc) [#9456](https://github.com/npm/cli/pull/9456) respect allowScripts policy in prune, dedupe, uninstall, audit fix, and link (@JamieMagee)
* [`6efac6e`](https://github.com/npm/cli/commit/6efac6ead98af50c5a40fc45cb657bbee496a584) [#9453](https://github.com/npm/cli/pull/9453) config: clarify --all help so it's accurate for approve-scripts and deny-scripts (@JamieMagee)
* [`b97edc0`](https://github.com/npm/cli/commit/b97edc0193017800ecb1f26d212977729ca19739) [#9430](https://github.com/npm/cli/pull/9430) audit: don't apply min-release-age before filter when verifying installed signatures (@JamieMagee)
* [`080e3b2`](https://github.com/npm/cli/commit/080e3b29e69d35d7b0f4823a9ac7ab4e1e4d1af6) [#9425](https://github.com/npm/cli/pull/9425) block forbidden keys in Queryable setter to prevent prototype pollution (@12122J, @claude)
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
* [`33aebaa`](https://github.com/npm/cli/commit/33aebaa58541ac0af3882cc0b56f09b1b676740a) [#9410](https://github.com/npm/cli/pull/9410) fix typo of fullMetadata (@owlstronaut)
* [`2a03860`](https://github.com/npm/cli/commit/2a03860fcafe92b22770fc554b25994b29bacbdb) [#9267](https://github.com/npm/cli/pull/9267) run root preinstall before reify (@owlstronaut)
* [`c0fc549`](https://github.com/npm/cli/commit/c0fc54935af8e17a3a96cbdeac52bb4c597803b6) [#9372](https://github.com/npm/cli/pull/9372) config: pause progress spinner during interactive editor spawn (#9372) (@Zelys-DFKH, @claude)
### Documentation
* [`357e8cd`](https://github.com/npm/cli/commit/357e8cdcb8f44326a50cee2539219a91d8bfbbe5) [#9520](https://github.com/npm/cli/pull/9520) approve-scripts only throws EGLOBAL when run with -g (@JamieMagee)
* [`bcf01c6`](https://github.com/npm/cli/commit/bcf01c6b1889ac97cf0f8a339da298a64f0767ef) [#9505](https://github.com/npm/cli/pull/9505) clarify package.json override value specs (#9505) (@ded-furby)
* [`455aa4a`](https://github.com/npm/cli/commit/455aa4a17b92a77ffbd474c4dc17a16f71cfe6b1) [#9401](https://github.com/npm/cli/pull/9401) use the latest version for global update and outdated's `wanted` (#9401) (@liangmiQwQ)
* [`aac80dc`](https://github.com/npm/cli/commit/aac80dc00748863ed4bdec90a49e33b0d9d3ed93) [#9470](https://github.com/npm/cli/pull/9470) update minimum npm required for npm trust (@meeech)
* [`d124c08`](https://github.com/npm/cli/commit/d124c0858da0b138cda2addcb0987b063ca86a47) [#9385](https://github.com/npm/cli/pull/9385) Document `npm_old_version` and `npm_new_version` environment variables (#9385) (@36degrees)
### Dependencies
* [`9cbba72`](https://github.com/npm/cli/commit/9cbba7258a41dd141eca070edcf661afc8ca159d) [#9579](https://github.com/npm/cli/pull/9579) `npm-profile@13.0.1`
* [`d4e0a70`](https://github.com/npm/cli/commit/d4e0a70f3231992f73ea4a80b60c81c103f421cb) [#9559](https://github.com/npm/cli/pull/9559) `@tufjs/repo-mock@5.0.0`
* [`3ef66bb`](https://github.com/npm/cli/commit/3ef66bb796f5029da2fdfc2a5dcf33585d67381f) [#9559](https://github.com/npm/cli/pull/9559) bundle arborist runtime deps for bootstrap
* [`5dce6fb`](https://github.com/npm/cli/commit/5dce6fb61493bf72a895f4b670cb8dec660b35db) [#9559](https://github.com/npm/cli/pull/9559) `npm-packlist@11.2.0`
* [`ad05528`](https://github.com/npm/cli/commit/ad055282671363fd72d3729fb2de020fbb319293) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/git@8.0.0`
* [`cc45055`](https://github.com/npm/cli/commit/cc450554861ec9f6ec8f1c4494fa9144379eb741) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/node-gyp@6.0.0`
* [`a12e2c8`](https://github.com/npm/cli/commit/a12e2c8f40e0d551e79f12df25e1f1d93ac90ac5) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/name-from-folder@5.0.0`
* [`cc96d57`](https://github.com/npm/cli/commit/cc96d57246df7cbcaedca6c2540d4e45190d9bb8) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/installed-package-contents@5.0.0`
* [`3dc18e5`](https://github.com/npm/cli/commit/3dc18e561b3304778f38f9e7637ab5e0b696797e) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/git@8.0.0`
* [`428afa6`](https://github.com/npm/cli/commit/428afa666b96b54a69ae72b25ab6fa48d3d19e61) [#9559](https://github.com/npm/cli/pull/9559) `sigstore@5.0.0`
* [`95ed19c`](https://github.com/npm/cli/commit/95ed19cd940f6cfef17279be2399f400694fbb00) [#9559](https://github.com/npm/cli/pull/9559) regenerate bundled dependencies
* [`b62db95`](https://github.com/npm/cli/commit/b62db95b7768049f58a0aca0d7266cba6ed17757) [#9559](https://github.com/npm/cli/pull/9559) `bin-links@7.0.0`
* [`2f5da83`](https://github.com/npm/cli/commit/2f5da83be1e90f00542f0445f06b142084f1ec5a) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/fs@6.0.0`
* [`370f9c6`](https://github.com/npm/cli/commit/370f9c6f069094fcb8b668fe7c9241106eef1bde) [#9559](https://github.com/npm/cli/pull/9559) `node-gyp@13.0.0`
* [`e459d7a`](https://github.com/npm/cli/commit/e459d7af61a5f3611a8faadd21d99e9440552368) [#9559](https://github.com/npm/cli/pull/9559) `which@7.0.0`
* [`5032af3`](https://github.com/npm/cli/commit/5032af36d7d1832f4ecb850f51d9b2b10d281336) [#9559](https://github.com/npm/cli/pull/9559) `validate-npm-package-name@8.0.0`
* [`13d97ac`](https://github.com/npm/cli/commit/13d97acea43ccab49eb7efeec8eda54a50f80c8c) [#9559](https://github.com/npm/cli/pull/9559) `tar@7.5.16`
* [`1502286`](https://github.com/npm/cli/commit/15022869509f110510fa8336144500108cdc6677) [#9559](https://github.com/npm/cli/pull/9559) `ssri@14.0.0`
* [`68eb39c`](https://github.com/npm/cli/commit/68eb39caa238479aa476beb71a9ec2ee2ea054d3) [#9559](https://github.com/npm/cli/pull/9559) `semver@7.8.4`
* [`3484d7f`](https://github.com/npm/cli/commit/3484d7f1cdb7595353562129e6ab6ef83204f227) [#9559](https://github.com/npm/cli/pull/9559) `read@6.0.0`
* [`21df0ab`](https://github.com/npm/cli/commit/21df0ab3c629496511a3c481ee721b0e62c16e92) [#9559](https://github.com/npm/cli/pull/9559) `proc-log@7.0.0`
* [`8f85646`](https://github.com/npm/cli/commit/8f856463d0e85f7083312b3825d0b72304f369e7) [#9559](https://github.com/npm/cli/pull/9559) `parse-conflict-json@6.0.0`
* [`a44c1cf`](https://github.com/npm/cli/commit/a44c1cf1635de5ecda02ed80af70f5d7360111b6) [#9559](https://github.com/npm/cli/pull/9559) `pacote@22.0.0`
* [`171bba3`](https://github.com/npm/cli/commit/171bba3011b45f6629b03f7ff3c59b71d09ab1fa) [#9559](https://github.com/npm/cli/pull/9559) `npm-user-validate@5.0.0`
* [`1f9c567`](https://github.com/npm/cli/commit/1f9c56792493f80fb3b3d61710086ed748312f2a) [#9559](https://github.com/npm/cli/pull/9559) `npm-registry-fetch@20.0.1`
* [`1fd247a`](https://github.com/npm/cli/commit/1fd247a79a814292db35d01d723c1fd05713707e) [#9559](https://github.com/npm/cli/pull/9559) `npm-profile@13.0.0`
* [`998ff1d`](https://github.com/npm/cli/commit/998ff1d50816061706c88c56664d131fcfe83f31) [#9559](https://github.com/npm/cli/pull/9559) `npm-pick-manifest@12.0.0`
* [`d80859a`](https://github.com/npm/cli/commit/d80859a2dd97376e4ea621812b3bc7de6a218d21) [#9559](https://github.com/npm/cli/pull/9559) `npm-package-arg@14.0.0`
* [`5e1d513`](https://github.com/npm/cli/commit/5e1d513b9c5e8eef7e318125bd2c34276ffe3858) [#9559](https://github.com/npm/cli/pull/9559) `npm-install-checks@9.0.0`
* [`faf97e5`](https://github.com/npm/cli/commit/faf97e5fadd5ae42ac3c92513df2c08654e9566b) [#9559](https://github.com/npm/cli/pull/9559) `npm-audit-report@8.0.0`
* [`471309f`](https://github.com/npm/cli/commit/471309f580efdf7f8055020ac0a08610f692a4f4) [#9559](https://github.com/npm/cli/pull/9559) `nopt@10.0.1`
* [`40395b8`](https://github.com/npm/cli/commit/40395b85e98596751a8b0a136c7687438339776f) [#9559](https://github.com/npm/cli/pull/9559) `make-fetch-happen@16.0.1`
* [`30e89d9`](https://github.com/npm/cli/commit/30e89d922c0ee790524151a98049aad47de70773) [#9559](https://github.com/npm/cli/pull/9559) `json-parse-even-better-errors@6.0.0`
* [`d44db96`](https://github.com/npm/cli/commit/d44db96fbc7b26fa6c53ed73eb8e1a267070a06c) [#9559](https://github.com/npm/cli/pull/9559) `is-cidr@7.0.0`
* [`350fb18`](https://github.com/npm/cli/commit/350fb188e9789ac7bb701fc9533ff9e271f87ee7) [#9559](https://github.com/npm/cli/pull/9559) `init-package-json@9.0.0`
* [`406820a`](https://github.com/npm/cli/commit/406820a15bc2c19543c7457a4331ea40ae8d0cf6) [#9559](https://github.com/npm/cli/pull/9559) `ini@7.0.0`
* [`d867351`](https://github.com/npm/cli/commit/d867351cf9d3b75956b555659040c56334f8f4c1) [#9559](https://github.com/npm/cli/pull/9559) `hosted-git-info@10.1.1`
* [`66d46bc`](https://github.com/npm/cli/commit/66d46bc23909f06433237985452c0102181e8fc9) [#9559](https://github.com/npm/cli/pull/9559) `cacache@21.0.1`
* [`0d15aec`](https://github.com/npm/cli/commit/0d15aecf3dbc918d599c2588b23f0c53e3637c95) [#9559](https://github.com/npm/cli/pull/9559) `abbrev@5.0.0`
* [`9bbdefb`](https://github.com/npm/cli/commit/9bbdefbfd54e59c8494d1467c89a3aee5f225423) [#9559](https://github.com/npm/cli/pull/9559) `@sigstore/tuf@5.0.0`
* [`9d13ebf`](https://github.com/npm/cli/commit/9d13ebfc2adca5543e4797632039adaa7a318985) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/run-script@11.0.0`
* [`27c4dcc`](https://github.com/npm/cli/commit/27c4dcc7e4aa3521563c1af80617e7697d88cd16) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/redact@5.0.0`
* [`f0eaef3`](https://github.com/npm/cli/commit/f0eaef370ab7ff0be1cfd833a6986f8ef0378a4c) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/promise-spawn@10.0.0`
* [`0be6ae2`](https://github.com/npm/cli/commit/0be6ae21c79eb3986a76d5d769d5dd5ef00283c2) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/package-json@8.0.0`
* [`f86a019`](https://github.com/npm/cli/commit/f86a0198bec5a70153bbb29d276fddb30c682792) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/metavuln-calculator@10.0.0`
* [`4d234b2`](https://github.com/npm/cli/commit/4d234b22e59416f6307eb75bef52ac9b43ee6628) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/map-workspaces@6.0.0`
* [`d28783e`](https://github.com/npm/cli/commit/d28783e3f00feecf4ca76b497e80ffd281af1655) [#9420](https://github.com/npm/cli/pull/9420) `undici@6.26.0`
* [`7f6c6ef`](https://github.com/npm/cli/commit/7f6c6ef49023286bed47a334cc2bd0064cb8ec05) [#9420](https://github.com/npm/cli/pull/9420) `sigstore@4.1.1`
* [`ee61b6e`](https://github.com/npm/cli/commit/ee61b6e8279b1d26d28a47613d66a9deb5c06529) [#9420](https://github.com/npm/cli/pull/9420) `lru-cache@11.5.1`
* [`d5ddef2`](https://github.com/npm/cli/commit/d5ddef2571b5b26dfade31eb040dbd4a096aeed8) [#9420](https://github.com/npm/cli/pull/9420) `@sigstore/verify@3.1.1`
* [`11e7ac7`](https://github.com/npm/cli/commit/11e7ac72c3ea0490f8d5edfb4bd5a60729d25b66) [#9420](https://github.com/npm/cli/pull/9420) `@sigstore/core@3.2.1`
* [`11cd66e`](https://github.com/npm/cli/commit/11cd66e10490af0ef46ceeb5e8764a855580a2de) [#9420](https://github.com/npm/cli/pull/9420) `@npmcli/agent@4.0.2`
* [`8be4c04`](https://github.com/npm/cli/commit/8be4c046fbbbb8ede02a288b727fcbf7470956fb) [#9420](https://github.com/npm/cli/pull/9420) `semver@7.8.1`
* [`577d61d`](https://github.com/npm/cli/commit/577d61da646833994ecfda8b2f1dc993ec9b58d1) [#9420](https://github.com/npm/cli/pull/9420) `make-fetch-happen@15.0.6`
### Chores
* [`059c06e`](https://github.com/npm/cli/commit/059c06e52f00e2d9cd2fa28baf6a6acd5be3b297) [#9560](https://github.com/npm/cli/pull/9560) add web-login proxy doneUrl regression for npm-profile fix (#9560) (@manzoorwanijk)
* [`1453954`](https://github.com/npm/cli/commit/1453954f9328a6b2480c183f9d1903ac93764915) [#9559](https://github.com/npm/cli/pull/9559) `nock@14.0.0` (@owlstronaut)
* [`0323f2d`](https://github.com/npm/cli/commit/0323f2d74bf2e747957c74992d9431e3fca35f85) [#9559](https://github.com/npm/cli/pull/9559) template-oss-apply (@owlstronaut)
* [`ee3d87f`](https://github.com/npm/cli/commit/ee3d87fe521bc144493b93a94d456c22eb147dbf) [#9559](https://github.com/npm/cli/pull/9559) `@npmcli/template-oss@5.1.1` (@owlstronaut)
* [`d25a179`](https://github.com/npm/cli/commit/d25a1798f3ba8ff80437f491afc17e98ef07c77f) [#9559](https://github.com/npm/cli/pull/9559) template-oss-apply (@owlstronaut)
* [`acdd6d5`](https://github.com/npm/cli/commit/acdd6d57fc90312ceb2eabfda21e05e9da1c1477) [#9559](https://github.com/npm/cli/pull/9559) bumping @npmcli/template-oss from 4.29.0 to 5.1.0 (@owlstronaut)
* [`4e2496a`](https://github.com/npm/cli/commit/4e2496a6a7ae015483dd9ff9072830c939baddff) [#9513](https://github.com/npm/cli/pull/9513) update issue templates - better language (@owlstronaut)
* [`7a997ac`](https://github.com/npm/cli/commit/7a997ac48ead642efcbb48fc5da5d99f0c850389) [#9512](https://github.com/npm/cli/pull/9512) update issue templates (#9512) (@owlstronaut)
* [`da63c79`](https://github.com/npm/cli/commit/da63c79be758fd9d3faa9f5edf962219c805c579) [#9420](https://github.com/npm/cli/pull/9420) dev dependency updates (@owlstronaut)
* [`5fc9bc0`](https://github.com/npm/cli/commit/5fc9bc0f202aadedd7b123394560047671afca6b) [#9393](https://github.com/npm/cli/pull/9393) sanitize newlines in flags table default and type values (#9393) (@reggi, @Copilot)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.1): `@npmcli/arborist@10.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/config-v11.0.0-pre.1): `@npmcli/config@11.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v11.0.0-pre.0): `libnpmaccess@11.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v9.0.0-pre.0): `libnpmdiff@9.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v11.0.0-pre.0): `libnpmexec@11.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v8.0.0-pre.0): `libnpmfund@8.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v9.0.0-pre.0): `libnpmorg@9.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v10.0.0-pre.1): `libnpmpack@10.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v12.0.0-pre.0): `libnpmpublish@12.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v10.0.0-pre.0): `libnpmsearch@10.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v9.0.0-pre.0): `libnpmteam@9.0.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v9.0.0-pre.1): `libnpmversion@9.0.0-pre.1`

## [12.0.0-pre.0.0](https://github.com/npm/cli/compare/v11.12.1...v12.0.0-pre.0.0) (2026-05-20)
### ⚠️ BREAKING CHANGES
* npm view --json now always returns an array.
* `npm sbom --sbom-format=cyclonedx` now reports the `name` field from each package's `package.json` instead of the on-disk directory name. The `name`, `bom-ref`, and `purl` of the root component and of aliased dependencies may change.
* npm no longer registers man pages with the system when installed globally. `man npm-install` will no longer work, but `npm help install` is unaffected.
* The `npm pkg` output is no longer forced to json.  This means you can get single values without having to worry about wrapping of the values.  It also outputs non-json content more similarly to `npm view`.
* `npm shrinkwrap` is removed, the `shrinkwrap` config alias is removed, and `npm-shrinkwrap.json` is no longer loaded or honored at the project root or from inside dependency tarballs. Rename project-root `npm-shrinkwrap.json` to `package-lock.json`; use `bundleDependencies` if you need to ship a locked dependency tree.
* The Twitter and Freenode profile fields have been removed from the npm registry. This means that users will no longer be able to set or view these fields in their npm profiles.
* npm will no longer attempt to resolve the path to node via whichnode. process.execPath is already set by Node to the resolved real path of the node binary, so the lookup was redundant. Scripts that expected npm to override process.execPath with a PATH-resolved (potentially symlinked) node path may be affected.
* the --json output of `npm pack` and `npm publish` have changed. They are now always consistent, and in the same format.
* the `star`, `stars` and `unstar` commands have been removed
* The `npm adduser` command has been removed. Create and manage user accounts on the npm website, and use `npm login` to authenticate on the command line.
### Features
* [`254809e`](https://github.com/npm/cli/commit/254809e318ee0046092d07d68a99154c3f672147) [#9201](https://github.com/npm/cli/pull/9201) npm stage (#9201) (@reggi, @Copilot)
* [`cf94dbe`](https://github.com/npm/cli/commit/cf94dbe2432251623966bb7be1c6ded15ea97e14) [#9248](https://github.com/npm/cli/pull/9248) add permissions support to trust commands (#9248) (@reggi, @Copilot)
* [`e0f12f7`](https://github.com/npm/cli/commit/e0f12f7e57aca36f71c9615bd971f427ed23e91a) [#9348](https://github.com/npm/cli/pull/9348) add allow-git/allow-file/allow-directory/allow-remote configs (@owlstronaut)
* [`916cb4b`](https://github.com/npm/cli/commit/916cb4b262df1d188ce7644e916b138fbc78c4e7) [#9287](https://github.com/npm/cli/pull/9287) add allow-directory, allow-file, and allow-remote (#9287) (@wraithgar)
* [`2e5dcad`](https://github.com/npm/cli/commit/2e5dcad17a59ee9f69eeec27fc5b087b5b032df7) [#9262](https://github.com/npm/cli/pull/9262) drop npm-shrinkwrap.json support (@owlstronaut)
* [`2397196`](https://github.com/npm/cli/commit/239719668a73afbacc02eedcedcd3d3dd7f36b01) [#9265](https://github.com/npm/cli/pull/9265) Remove Twitter and Freenode profile fields (@owlstronaut)
* [`738be10`](https://github.com/npm/cli/commit/738be10651522e94038f1eff0da12f15b10438ea) [#9196](https://github.com/npm/cli/pull/9196) remove star commands (#9196) (@wraithgar)
* [`db7c1f8`](https://github.com/npm/cli/commit/db7c1f887eb1c1cb281ea7c9f6d84fba8f10d44d) [#9163](https://github.com/npm/cli/pull/9163) add `u` as alias for `update` command (#9163) (@Ausoj)
* [`45e44dd`](https://github.com/npm/cli/commit/45e44dd7ac2a3af815684ece3bdc99ada2f317f7) [#9228](https://github.com/npm/cli/pull/9228) adds a backport script (@owlstronaut)
### Bug Fixes
* [`2a13550`](https://github.com/npm/cli/commit/2a1355011540a06eac841c04136f07cdf086fd75) [#9380](https://github.com/npm/cli/pull/9380) key stage download --json output by package name (#9380) (@reggi, @Copilot)
* [`ca585c8`](https://github.com/npm/cli/commit/ca585c80dee759fedb85c5c20f9dd3ea8d017be4) [#9368](https://github.com/npm/cli/pull/9368) allow min-release-age in npmrc to coexist with --before (@raazkhnl)
* [`f550eb4`](https://github.com/npm/cli/commit/f550eb415de0aff83a5fa297850104f5390a6e30) [#9348](https://github.com/npm/cli/pull/9348) refactor #failureNode, adjust tests and safety (@owlstronaut)
* [`1f17566`](https://github.com/npm/cli/commit/1f17566ad90353b88e81fa1f8a4da5879d3ec7a3) [#9348](https://github.com/npm/cli/pull/9348) allow-remote=none does not block registry tarballs (@owlstronaut)
* [`70af7b3`](https://github.com/npm/cli/commit/70af7b3c727fed6c7078d4ff7177fe02349e9b65) [#9327](https://github.com/npm/cli/pull/9327) remove settings (#9327) (@owlstronaut)
* [`d623988`](https://github.com/npm/cli/commit/d6239889dc9b4eff776cd2a258fbaf5b645f5585) [#9311](https://github.com/npm/cli/pull/9311) sbom: dedupe per-node dependsOn / relationships (#9311) (@mikaelkristiansson)
* [`d36945d`](https://github.com/npm/cli/commit/d36945dec26ffdc6899b3dc561260cd1b980a2f8) [#9160](https://github.com/npm/cli/pull/9160) do not unwrap single-item arrays in --json output (@yetanotheraryan)
* [`faf7348`](https://github.com/npm/cli/commit/faf7348549c418de3c2a5be26f0a882e7189b5b2) [#9284](https://github.com/npm/cli/pull/9284) align CycloneDX SBOM component names with SPDX (#9284) (@cyphercodes, @cyphercodes)
* [`e20424b`](https://github.com/npm/cli/commit/e20424b01a2d60c6ff5edb0480dcea529edf2dec) [#9035](https://github.com/npm/cli/pull/9035) don't install man pages in system locations (@owlstronaut)
* [`01d9acd`](https://github.com/npm/cli/commit/01d9acd41c357f6b607d026bf5bc1cc44ad92db6) [#9269](https://github.com/npm/cli/pull/9269) pkg: output like npm view does, do not force json output (@wraithgar)
* [`27567ab`](https://github.com/npm/cli/commit/27567ab27bef8af303bde0b2d7da0386da182b81) [#9257](https://github.com/npm/cli/pull/9257) ignore intended error code (@owlstronaut)
* [`4ef5b6e`](https://github.com/npm/cli/commit/4ef5b6e0439297048dee92729b5c93529ad39488) [#9039](https://github.com/npm/cli/pull/9039) stop resolving node path via whichnode (@owlstronaut)
* [`2e9b26e`](https://github.com/npm/cli/commit/2e9b26eff18114b2fe34ea7c8159500b5eafb98e) [#9247](https://github.com/npm/cli/pull/9247) sync json output of pack and publish (#9247) (@wraithgar)
* [`7357d7f`](https://github.com/npm/cli/commit/7357d7fd82a61657618d632b5a842d4d04335be5) [#9036](https://github.com/npm/cli/pull/9036) remove npm adduser command (@owlstronaut)
### Documentation
* [`c97b39b`](https://github.com/npm/cli/commit/c97b39b1e3436cd20a67ab5f4012a5f395c538b9) [#9363](https://github.com/npm/cli/pull/9363) add example to optionalDependencies section (#9363) (@verifizieren)
* [`6704ab2`](https://github.com/npm/cli/commit/6704ab2c8a025800d871571889466e06399bf6a2) [#9335](https://github.com/npm/cli/pull/9335) npm view with json outputs array docs update (#9335) (@yetanotheraryan)
### Dependencies
* [`d151521`](https://github.com/npm/cli/commit/d1515210085586c147a6653cdc6ae25f672d45db) [#9382](https://github.com/npm/cli/pull/9382) `socks@2.8.9`
* [`a77416e`](https://github.com/npm/cli/commit/a77416ee08e8884f35b1a2390ee98f6b570b3a0d) [#9382](https://github.com/npm/cli/pull/9382) `lru-cache@11.5.0`
* [`b2717e4`](https://github.com/npm/cli/commit/b2717e46e4ea6c70b137f68b37440ef7f016bc66) [#9382](https://github.com/npm/cli/pull/9382) `ip-address@10.2.0`
* [`1c4a796`](https://github.com/npm/cli/commit/1c4a79667af9703ede9683c2cc0f33b05983b724) [#9382](https://github.com/npm/cli/pull/9382) `brace-expansion@5.0.6`
* [`e36a4e3`](https://github.com/npm/cli/commit/e36a4e3f237d0e60d7b85490da8ff8e3663fdea9) [#9382](https://github.com/npm/cli/pull/9382) `bin-links@6.0.2`
* [`91bd674`](https://github.com/npm/cli/commit/91bd674ff822adc0f84bb79069e8b21d640bb40e) [#9382](https://github.com/npm/cli/pull/9382) `tar@7.5.15`
* [`66c7ff1`](https://github.com/npm/cli/commit/66c7ff1e66e3d0bf5b9ed5cae172ac6a7501ce4c) [#9382](https://github.com/npm/cli/pull/9382) `semver@7.8.0`
* [`514c71b`](https://github.com/npm/cli/commit/514c71b253f7e91afc3aa17a28aa6cb6f7d01b30) [#9382](https://github.com/npm/cli/pull/9382) `hosted-git-info@9.0.3`
* [`fbe1dd0`](https://github.com/npm/cli/commit/fbe1dd03a9a4b0690725df8ca40e96c49a0319ac) [#9316](https://github.com/npm/cli/pull/9316) `socks@10.1.1`
* [`af65766`](https://github.com/npm/cli/commit/af65766bd2d18923e5d24cc86f6a0e502450db33) [#9316](https://github.com/npm/cli/pull/9316) `ip-address@10.1.1`
* [`37bd0c6`](https://github.com/npm/cli/commit/37bd0c63a176ca8fe7012c08b8acbebff2e65865) [#9316](https://github.com/npm/cli/pull/9316) `cidr-regex@5.0.5`
* [`5af02ec`](https://github.com/npm/cli/commit/5af02ecf3e3ed27e62b57ceaf59a293f42d3e309) [#9270](https://github.com/npm/cli/pull/9270) `lru-cache@11.3.5`
* [`799866f`](https://github.com/npm/cli/commit/799866f4d877241cdd30501229901a0ba355adbb) [#9270](https://github.com/npm/cli/pull/9270) `node-gyp@12.3.0`
* [`79d394e`](https://github.com/npm/cli/commit/79d394e9f5e74b6fba3adb09e4bfd6e7b63e9839) [#9270](https://github.com/npm/cli/pull/9270) `is-cidr@6.0.4`
* [`9669d31`](https://github.com/npm/cli/commit/9669d31060a2ed7220e140c354a45cfe993a0e7d) [#9207](https://github.com/npm/cli/pull/9207) `@sigstore/protobuf-specs@0.5.1`
* [`b09a5ac`](https://github.com/npm/cli/commit/b09a5ac3c59f6a70f05ee035c9c6ee03dfdd1eda) [#9207](https://github.com/npm/cli/pull/9207) `tinyglobby@0.2.16`
* [`150231d`](https://github.com/npm/cli/commit/150231d74a90ff1fb34ec588eefb94aeb4979fd2) [#9207](https://github.com/npm/cli/pull/9207) `picomatch@4.0.4`
* [`413e0a0`](https://github.com/npm/cli/commit/413e0a00aee08b4f190bffd360b53efb20783ad1) [#9207](https://github.com/npm/cli/pull/9207) `lru-cache@11.3.3`
* [`6faa25e`](https://github.com/npm/cli/commit/6faa25ecff4eb72aa9c16adba53bf46d39d556df) [#9207](https://github.com/npm/cli/pull/9207) `diff@8.0.4`
* [`87bb9d0`](https://github.com/npm/cli/commit/87bb9d069375e74354bcd69f39a081ad960009de) [#9207](https://github.com/npm/cli/pull/9207) `minimatch@10.2.5`
* [`2501dd8`](https://github.com/npm/cli/commit/2501dd83ea9e9fc39b0bf6814728a132dd57fa6d) [#9207](https://github.com/npm/cli/pull/9207) `tar@7.5.13`
* [`ccce5f6`](https://github.com/npm/cli/commit/ccce5f611daf50727a134ba1df46ac9c53caa61a) [#9207](https://github.com/npm/cli/pull/9207) `minipass-flush@1.0.6`
### Chores
* [`f502c4f`](https://github.com/npm/cli/commit/f502c4f07fb14eef041f4dfb04ad5d9f287c6ba4) [#9382](https://github.com/npm/cli/pull/9382) dev dependency updates (@owlstronaut)
* [`4259e57`](https://github.com/npm/cli/commit/4259e57f26640a137b38cb7e0b1eda04e6c42026) [#9316](https://github.com/npm/cli/pull/9316) dev dependency updates (@owlstronaut)
* [`d68bd36`](https://github.com/npm/cli/commit/d68bd365960da9933b215c87b3335b0b8d9b2bda) [#9317](https://github.com/npm/cli/pull/9317) add cli-triage team as codeowner (#9317) (@owlstronaut)
* [`b9332e6`](https://github.com/npm/cli/commit/b9332e6370cb4c3ee32c7b87cfab5847f4657acc) [#9270](https://github.com/npm/cli/pull/9270) dev dependency updates (@owlstronaut)
* [`cc468a8`](https://github.com/npm/cli/commit/cc468a81fd9fc000dc430c782ba05f0c6fcea079) [#9269](https://github.com/npm/cli/pull/9269) refactor tests (@wraithgar)
* [`2ca36c4`](https://github.com/npm/cli/commit/2ca36c4b37f50419303db41cf482d05f5ec69023) [#9261](https://github.com/npm/cli/pull/9261) fixed non-functional typos throughout the codebase (@opensourcezeal)
* [`8131de4`](https://github.com/npm/cli/commit/8131de4453af45a351fd610a660a1d60724ef74f) [#9239](https://github.com/npm/cli/pull/9239) add action permission for backport workflow (@owlstronaut)
* [`6df5f91`](https://github.com/npm/cli/commit/6df5f918a350e30d865a647cbbbe0a8e713d0189) [#9232](https://github.com/npm/cli/pull/9232) backports can trigger CI (@owlstronaut)
* [`07552f5`](https://github.com/npm/cli/commit/07552f58111dea3aa563693ea103342fb625d47b) [#9224](https://github.com/npm/cli/pull/9224) don't run npm update in CI (@owlstronaut)
* [`05dbba5`](https://github.com/npm/cli/commit/05dbba5b8d727ddb2c098ce0553714eae791c5f2) [#9195](https://github.com/npm/cli/pull/9195) enable prerelease mode (#9195) (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.0.0): `@npmcli/arborist@10.0.0-pre.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v11.0.0-pre.0.0): `@npmcli/config@11.0.0-pre.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.1.6-pre.0.0): `libnpmdiff@8.1.6-pre.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.2.6-pre.0.0): `libnpmexec@10.2.6-pre.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.20-pre.0.0): `libnpmfund@7.0.20-pre.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v10.0.0-pre.0.0): `libnpmpack@10.0.0-pre.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.2.0-pre.0.0): `libnpmpublish@11.2.0-pre.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v9.0.0-pre.0.0): `libnpmversion@9.0.0-pre.0.0`

## [11.12.1](https://github.com/npm/cli/compare/v11.12.0...v11.12.1) (2026-03-24)
### Bug Fixes
* [`596706a`](https://github.com/npm/cli/commit/596706a3d10100587e3751d860b4cfcc59342d2f) [#9148](https://github.com/npm/cli/pull/9148) revert prefer-offline/prefer-online exclusivity (#9129) (@owlstronaut)
### Documentation
* [`d1ee8a5`](https://github.com/npm/cli/commit/d1ee8a524783e6ce33209fc48c83c89af5a5ccdf) [#9140](https://github.com/npm/cli/pull/9140) Add note on relative path prefix for npm publish (#9140) (@pydsigner)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/config-v10.8.1): `@npmcli/config@10.8.1`

## [11.12.0](https://github.com/npm/cli/compare/v11.11.1...v11.12.0) (2026-03-18)
### Features
* [`8eff5fb`](https://github.com/npm/cli/commit/8eff5fb31afc996c71c8f159defa324cb86dfc5a) [#9049](https://github.com/npm/cli/pull/9049) audit: add --include-attestations flag to output sigstore bundles (#9049) (@mitchdenny)
### Bug Fixes
* [`03af94d`](https://github.com/npm/cli/commit/03af94d9020b35d09c838b9bd4f26697e49bf08b) [#9123](https://github.com/npm/cli/pull/9123) skip synopsis code block when command has no usage (@owlstronaut)
* [`21ea382`](https://github.com/npm/cli/commit/21ea382a60b3693ff6c44c81447caa5d0294169c) [#9110](https://github.com/npm/cli/pull/9110) arborist: resolve sibling override sets via common ancestor (#9110) (@manzoorwanijk)
### Dependencies
* [`03f4c3a`](https://github.com/npm/cli/commit/03f4c3a443bbd2a93e318bc5657ddb07e7a84fa7) [#9131](https://github.com/npm/cli/pull/9131) `@sigstore/tuf@4.0.2`
* [`4d5f7d9`](https://github.com/npm/cli/commit/4d5f7d9d33a41d124c2f7fedb4f267e3ce2ca5d8) [#9131](https://github.com/npm/cli/pull/9131) `@gar/promise-retry@1.0.3`
* [`8dcfe69`](https://github.com/npm/cli/commit/8dcfe693deda7e756b6b98ce8de8f28f8ecc584d) [#9131](https://github.com/npm/cli/pull/9131) `@sigstore/sign@4.1.1`
* [`e5a7e22`](https://github.com/npm/cli/commit/e5a7e222c7dc76fd1eed1efa31ca2d416ff20074) [#9127](https://github.com/npm/cli/pull/9127) `lru-cache@11.2.7`
* [`82deab6`](https://github.com/npm/cli/commit/82deab60ef2649c64830e734c48977090294dc7b) [#9127](https://github.com/npm/cli/pull/9127) `make-fetch-happen@15.0.5`
* [`ce195dc`](https://github.com/npm/cli/commit/ce195dc698e917d2169c3c0e632e5691f1fbbcdf) [#9127](https://github.com/npm/cli/pull/9127) `cacache@20.0.4`
### Chores
* [`95fa7f4`](https://github.com/npm/cli/commit/95fa7f4d8f560bb9993141f2d2e55c8b8add02c8) [#9132](https://github.com/npm/cli/pull/9132) fix docs test snapshot (#9132) (@wraithgar)
* [`7e9d538`](https://github.com/npm/cli/commit/7e9d53841be2a944739b7e226647b68f68b5742e) [#9127](https://github.com/npm/cli/pull/9127) dev dependency updates (@wraithgar)
* [`920e5ed`](https://github.com/npm/cli/commit/920e5ed32d859041978e8b63e7af228ab12a4346) [#9127](https://github.com/npm/cli/pull/9127) test snapshots (@wraithgar)
* [`98ccf92`](https://github.com/npm/cli/commit/98ccf9246ea07b33c6813f34fc98e88889177297) [#9125](https://github.com/npm/cli/pull/9125) fix snap tests (@owlstronaut)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.4.2): `@npmcli/arborist@9.4.2`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.8.0): `@npmcli/config@10.8.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.1.5): `libnpmdiff@8.1.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.2.5): `libnpmexec@10.2.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.19): `libnpmfund@7.0.19`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.1.5): `libnpmpack@9.1.5`

## [11.11.1](https://github.com/npm/cli/compare/v11.11.0...v11.11.1) (2026-03-10)
### Bug Fixes
* [`a9d242b`](https://github.com/npm/cli/commit/a9d242bc4f04440630141743949ddb0d323f90b4) [#9099](https://github.com/npm/cli/pull/9099) include all subcommands on main command help (#9099) (@wraithgar)
* [`29b8407`](https://github.com/npm/cli/commit/29b8407971af1b9a2a3dcdb3849adfa04363fa7f) [#9087](https://github.com/npm/cli/pull/9087) unwrap comments and lines meant for output (#9087) (@wraithgar)
* [`b56986a`](https://github.com/npm/cli/commit/b56986acb0661fba2c80135eff3d140aa659dcf5) [#9095](https://github.com/npm/cli/pull/9095) ls: suppress false UNMET DEPENDENCYs in linked strategy (#9095) (@manzoorwanijk)
* [`76c76e5`](https://github.com/npm/cli/commit/76c76e5ad7cc5c7f641a92334b900c9d0c9a3fbd) [#9083](https://github.com/npm/cli/pull/9083) ci: don't error on optional deps in the lockfile (#9083) (@wraithgar)
* [`a29aeee`](https://github.com/npm/cli/commit/a29aeee18f3ddc2348a8e00787d237c874642789) [#9028](https://github.com/npm/cli/pull/9028) arborist: retry bin-links on Windows EPERM (#9028) (@manzoorwanijk)
* [`6565eeb`](https://github.com/npm/cli/commit/6565eeb818494e1feb4e14492804ce936b394b4a) [#9045](https://github.com/npm/cli/pull/9045) bypass packument cache to prevent ETARGET errors after publish (#9045) (@Jadu07)
### Documentation
* [`3b96929`](https://github.com/npm/cli/commit/3b96929166a55f7f0c346f9715988ec1e1ce195d) [#9074](https://github.com/npm/cli/pull/9074) scripts: remove mention of obsolete root user behavior (#9074) (@mohd-akram)
* [`16ac4e0`](https://github.com/npm/cli/commit/16ac4e02796248f3abb4fa043427236cda22a902) [#9054](https://github.com/npm/cli/pull/9054) fix workspace cross-dependency documentation (@owlstronaut)
### Dependencies
* [`075ae23`](https://github.com/npm/cli/commit/075ae23e46d821c56a0f50f56b2d6c745fe7367e) [#9086](https://github.com/npm/cli/pull/9086) `tar@7.5.11`
* [`13fa40d`](https://github.com/npm/cli/commit/13fa40d4ce8f7b0ea3e437056faca693472b3efa) [#9086](https://github.com/npm/cli/pull/9086) `pacote@21.5.0`
* [`bf7ea2b`](https://github.com/npm/cli/commit/bf7ea2b19f5446d3c3a33de2844f7504cc418570) [#9060](https://github.com/npm/cli/pull/9060) `brace-expansion@5.0.4`
* [`2000d2c`](https://github.com/npm/cli/commit/2000d2ce858c79664c6255d78485580b0d65f5b4) [#9060](https://github.com/npm/cli/pull/9060) `minimatch@10.2.4`
* [`d86b260`](https://github.com/npm/cli/commit/d86b260103358e6f8dd7d9cc2526ac3144d595c8) [#9060](https://github.com/npm/cli/pull/9060) `tar@7.5.10`
* [`dff1853`](https://github.com/npm/cli/commit/dff1853ed6e5b4acfdd36d0109cb2ebe27693a6f) [#9060](https://github.com/npm/cli/pull/9060) `@npmcli/run-script@10.0.4`
* [`93c3365`](https://github.com/npm/cli/commit/93c33658f6ac4e83cff83a0e064b222f1b36a515) [#9060](https://github.com/npm/cli/pull/9060) `write-file-atomic@7.0.1`
### Chores
* [`d1996a7`](https://github.com/npm/cli/commit/d1996a7a79982f616600d134dbdcfb223cd0d81d) [#9060](https://github.com/npm/cli/pull/9060) dev dependency updates (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.4.1): `@npmcli/arborist@9.4.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.1.4): `libnpmdiff@8.1.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.2.4): `libnpmexec@10.2.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.18): `libnpmfund@7.0.18`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.1.4): `libnpmpack@9.1.4`

## [11.11.0](https://github.com/npm/cli/compare/v11.10.1...v11.11.0) (2026-02-25)
### Features
* [`4fcd352`](https://github.com/npm/cli/commit/4fcd352c553fdc0f13a87ad71ef66d7515c11886) [#9017](https://github.com/npm/cli/pull/9017) add :type(registry) to query selector syntax (#9017) (@wraithgar)
* [`e1b21f0`](https://github.com/npm/cli/commit/e1b21f03e20dfd7b9cc1e631041027a013721df4) [#8909](https://github.com/npm/cli/pull/8909) adds circleci to trust command (#8909) (@owlstronaut)
* [`9a33ad0`](https://github.com/npm/cli/commit/9a33ad03c0ac2a3feed2db5f8a84c25635865186) [#8925](https://github.com/npm/cli/pull/8925) adds circleci to oidc (#8925) (@owlstronaut)
### Bug Fixes
* [`4426411`](https://github.com/npm/cli/commit/4426411bda7807afbb47aa01d8bf789e8c91eaff) [#9026](https://github.com/npm/cli/pull/9026) npm audit signatures for keyless attestation registries (#9026) (@ajayk)
* [`658b323`](https://github.com/npm/cli/commit/658b32373e3490c72826b0bbcc6c1b74129e3ced) [#9010](https://github.com/npm/cli/pull/9010) handle legacy licenses array in sbom output (#9010) (@JNC4)
### Documentation
* [`143f8cd`](https://github.com/npm/cli/commit/143f8cdf4c6503240cc655b383ba865c0b9ea599) [#9007](https://github.com/npm/cli/pull/9007) docs shouldn't wrap yaml description (#9007) (@owlstronaut)
### Dependencies
* [`7798b6e`](https://github.com/npm/cli/commit/7798b6e3a9515b6114d4143c3b692e21242307fb) [#9027](https://github.com/npm/cli/pull/9027) `@gar/promise-retry@1.0.2`
* [`4838864`](https://github.com/npm/cli/commit/4838864bd0693897a3059d13b1297b941454b3d7) [#9027](https://github.com/npm/cli/pull/9027) `balanced-match@4.0.4`
* [`0c200dd`](https://github.com/npm/cli/commit/0c200ddca74c7b57c526d6742451f4104a0f5af1) [#9027](https://github.com/npm/cli/pull/9027) `brace-expansion@5.0.3`
* [`f0606bb`](https://github.com/npm/cli/commit/f0606bbfb06de39ce230afaa0f1f167fd1e10124) [#9027](https://github.com/npm/cli/pull/9027) `spdx-license-ids@3.0.23`
* [`d43f350`](https://github.com/npm/cli/commit/d43f35071cbef1d9ed9841684a5c32503727ed12) [#9027](https://github.com/npm/cli/pull/9027) `make-fetch-happen@15.0.4`
* [`4d0918a`](https://github.com/npm/cli/commit/4d0918a913bf60766c37c178f41693c75b29f6a3) [#9027](https://github.com/npm/cli/pull/9027) `@npmcli/git@7.0.2`
* [`8912ca7`](https://github.com/npm/cli/commit/8912ca7488f9e0e78bf7fcb51bf4dbe98b51eb5b) [#9027](https://github.com/npm/cli/pull/9027) `minipass-fetch@5.0.2`
* [`450ff35`](https://github.com/npm/cli/commit/450ff35d9cc70f5196040c31221cce0601d8a3a1) [#9027](https://github.com/npm/cli/pull/9027) `npm-packlist@10.0.4`
* [`20ef5a5`](https://github.com/npm/cli/commit/20ef5a5b6596891ba632410d97cdf5cb90b17bb3) [#9027](https://github.com/npm/cli/pull/9027) `pacote@21.4.0`
* [`60f332c`](https://github.com/npm/cli/commit/60f332c9df28e736f510ef8ac1f207175687dcad) [#9008](https://github.com/npm/cli/pull/9008) remove promise-retry
* [`cb8b9c7`](https://github.com/npm/cli/commit/cb8b9c7a45d81883ada7891f492afbf998574d10) [#9008](https://github.com/npm/cli/pull/9008) add `@gar/promise-retry@1.0.0`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.4.0): `@npmcli/arborist@9.4.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.1.3): `libnpmdiff@8.1.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.2.3): `libnpmexec@10.2.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.17): `libnpmfund@7.0.17`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.1.3): `libnpmpack@9.1.3`

## [11.10.1](https://github.com/npm/cli/compare/v11.10.0...v11.10.1) (2026-02-19)
### Bug Fixes
* [`9fac412`](https://github.com/npm/cli/commit/9fac412105c4bbd116cffb6e27dda54a2adecf33) [#8995](https://github.com/npm/cli/pull/8995) improve unknown config warning with .npmrc section hint (#8995) (@umeshmore45)
* [`bb135cc`](https://github.com/npm/cli/commit/bb135cc8998b8b936f2cb412ec3303ae02d6920c) [#8981](https://github.com/npm/cli/pull/8981) arborist: fix `peerOptional` dependency resolution in `buildIdealTree` (#8981) (@Saibamen, @cursoragent)
* [`5c03826`](https://github.com/npm/cli/commit/5c03826e7aabedc03aaeaaa2f6863e6259519443) [#8993](https://github.com/npm/cli/pull/8993) remove tabular output from "npm view" (@wraithgar)
* [`4648f26`](https://github.com/npm/cli/commit/4648f26f2e68c86306161b7ed6550c06adba4483) [#8993](https://github.com/npm/cli/pull/8993) remove tabular output from "npm team" (@wraithgar)
### Documentation
* [`0a5756d`](https://github.com/npm/cli/commit/0a5756d5d06972dcf29cdee6978f5317dce92e6b) [#8998](https://github.com/npm/cli/pull/8998) clarify unsupported custom .npmrc keys and recommend alternatives (#8998) (@maitrawebtech)
* [`22c9153`](https://github.com/npm/cli/commit/22c91534d057dc4474495ed1d675fc9b15829275) [#8985](https://github.com/npm/cli/pull/8985) fix typo and grammar in README (#8985) (@csmit195, Chris)
### Dependencies
* [`aa8ffbf`](https://github.com/npm/cli/commit/aa8ffbf955a0ba768e58af1865988894d3404d78) [#9002](https://github.com/npm/cli/pull/9002) `init-package-json@8.2.5` (#9002)
* [`67a0f09`](https://github.com/npm/cli/commit/67a0f09ad2e6a4e217963d73cd61e60ae9a27192) [#9001](https://github.com/npm/cli/pull/9001) `glob@13.0.6`
* [`56b8fd4`](https://github.com/npm/cli/commit/56b8fd43467f49607eb52095ade83138ae35583b) [#9001](https://github.com/npm/cli/pull/9001) `minimatch@10.2.2`
* [`aa7fef5`](https://github.com/npm/cli/commit/aa7fef50603457a0f74828042ab0f4ae124c0617) [#9001](https://github.com/npm/cli/pull/9001) `minipass@7.1.3`
* [`d3a4161`](https://github.com/npm/cli/commit/d3a41615d857437af43ddc5c94f0f644c3cc2491) [#9000](https://github.com/npm/cli/pull/9000) `@npmcli/package-json@7.0.5` (#9000)
* [`7aa9338`](https://github.com/npm/cli/commit/7aa9338565bd5b1fa9364727900225089746f0c9) [#8993](https://github.com/npm/cli/pull/8993) remove cli-columns
* [`f7f7c53`](https://github.com/npm/cli/commit/f7f7c5383f9d599cd1982783e9afcb3e45b0e7e7) [#8991](https://github.com/npm/cli/pull/8991) hoist balanced-match
* [`10cb575`](https://github.com/npm/cli/commit/10cb575743deb1ca0459c957fd19e50129116afe) [#8991](https://github.com/npm/cli/pull/8991) hoist latest yallist
* [`1b3dc9a`](https://github.com/npm/cli/commit/1b3dc9a79a2bfc9ac9217bca724a38ce504eca0a) [#8991](https://github.com/npm/cli/pull/8991) `cidr-regex@5.0.3`
* [`4307af6`](https://github.com/npm/cli/commit/4307af6c1d5a0a6a9d301f109546181e1d747c5a) [#8991](https://github.com/npm/cli/pull/8991) `glob@13.0.5`
* [`13b4d6a`](https://github.com/npm/cli/commit/13b4d6a715b2369363a7e2d237eed8e45a5752aa) [#8991](https://github.com/npm/cli/pull/8991) `minimatch@10.2.1`
* [`45d4000`](https://github.com/npm/cli/commit/45d40008877357c645256de4c244e065d20b8932) [#8991](https://github.com/npm/cli/pull/8991) `tar@7.5.9`
### Chores
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`1598adb`](https://github.com/npm/cli/commit/1598adb05de18cb738c9a7fbcc63692059f46a17) [#8991](https://github.com/npm/cli/pull/8991) dev dependency updates (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.3.1): `@npmcli/arborist@9.3.1`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.7.1): `@npmcli/config@10.7.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.1.2): `libnpmdiff@8.1.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.2.2): `libnpmexec@10.2.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.16): `libnpmfund@7.0.16`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.1.2): `libnpmpack@9.1.2`

## [11.10.0](https://github.com/npm/cli/compare/v11.9.0...v11.10.0) (2026-02-11)
### Features
* [`cf56a1e`](https://github.com/npm/cli/commit/cf56a1e4df9c8ae7b7e9752437d827a183e4040e) [#8899](https://github.com/npm/cli/pull/8899) npm trust, per-command config (@reggi)
* [`cf56a1e`](https://github.com/npm/cli/commit/cf56a1e4df9c8ae7b7e9752437d827a183e4040e) [#8899](https://github.com/npm/cli/pull/8899) npm trust (@reggi)
* [`66d6e11`](https://github.com/npm/cli/commit/66d6e11f3ecdbc823ede24ef83257f3bb6e69d46) [#8965](https://github.com/npm/cli/pull/8965) add min-release-age (#8965) (@wraithgar)
### Dependencies
* [`aae84bf`](https://github.com/npm/cli/commit/aae84bf5a90bb42599b27631734a9899735d4016) [#8973](https://github.com/npm/cli/pull/8973) `pacote@21.3.1`
* [`8bcb675`](https://github.com/npm/cli/commit/8bcb6754b95628da78bd4b6ddcc8c8ff40f7d0fb) [#8973](https://github.com/npm/cli/pull/8973) `cidr-regex@5.0.2`
* [`f87aaab`](https://github.com/npm/cli/commit/f87aaab974931766b1372fbd5d5ef9daa645b1ad) [#8973](https://github.com/npm/cli/pull/8973) `lru-cache@11.2.6`
* [`acec871`](https://github.com/npm/cli/commit/acec871478eeb4cf75d89216feb9e6a70efc1d33) [#8973](https://github.com/npm/cli/pull/8973) `ssri@13.0.1`
* [`1e42a86`](https://github.com/npm/cli/commit/1e42a86aa2460d39e8e3e450025d7df75e911d87) [#8973](https://github.com/npm/cli/pull/8973) `glob@13.0.2`
* [`e1c08a4`](https://github.com/npm/cli/commit/e1c08a4cf10465c76f037bfe31c0666a183feb7c) [#8973](https://github.com/npm/cli/pull/8973) `is-cidr@6.0.3`
* [`dfb0e34`](https://github.com/npm/cli/commit/dfb0e3466b444a5e1f25f785d42e8b8936bf5c3f) [#8973](https://github.com/npm/cli/pull/8973) `semver@7.7.4`
* [`0ee7776`](https://github.com/npm/cli/commit/0ee7776b17bb0f1ae745ed9cb0db61347a64d37d) [#8973](https://github.com/npm/cli/pull/8973) `which@6.0.1`
### Chores
* [`eb81df8`](https://github.com/npm/cli/commit/eb81df8f6acba2e8921f06983d3f8ba44ea79094) [#8973](https://github.com/npm/cli/pull/8973) dev dependency updates (@wraithgar)
* [`995e757`](https://github.com/npm/cli/commit/995e7579d66dfedbf20e3602b9523bc992dde139) [#8966](https://github.com/npm/cli/pull/8966) Clean up some todos, add tests for previously skipped blocks (@owlstronaut)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.3.0): `@npmcli/arborist@9.3.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.7.0): `@npmcli/config@10.7.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.1.1): `libnpmdiff@8.1.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.2.1): `libnpmexec@10.2.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.15): `libnpmfund@7.0.15`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.1.1): `libnpmpack@9.1.1`

## [11.9.0](https://github.com/npm/cli/compare/v11.8.0...v11.9.0) (2026-02-04)
### Features
* [`f5f6cf7`](https://github.com/npm/cli/commit/f5f6cf7c9fc9315b96eb29c5c7d5ab63ad3a9122) [#8943](https://github.com/npm/cli/pull/8943) config: add --allow-git (@wraithgar)
### Bug Fixes
* [`2242f25`](https://github.com/npm/cli/commit/2242f2515826474a4fb8664fc679f1919ecaf458) [#8952](https://github.com/npm/cli/pull/8952) webauth: improve error messages around webauth in non-TTY (#8952) (@Andarist)
### Dependencies
* [`332c9f3`](https://github.com/npm/cli/commit/332c9f355ff7c9a9a9e624100a84130a9b7c4162) [#8960](https://github.com/npm/cli/pull/8960) `glob@13.0.1`
* [`eca02c7`](https://github.com/npm/cli/commit/eca02c78c993af969f837c55068239468794932a) [#8960](https://github.com/npm/cli/pull/8960) `minimatch@10.1.2` `@isaacs/brace-expansion@5.0.1`
* [`b3f8475`](https://github.com/npm/cli/commit/b3f847568bcc95e1466668476cf3dcf1a4993ac3) [#8951](https://github.com/npm/cli/pull/8951) `minipass-fetch@5.0.1`
* [`924171b`](https://github.com/npm/cli/commit/924171bf5794f16f688b8544912a6205ec1d1fb5) [#8951](https://github.com/npm/cli/pull/8951) `is-cidr@6.0.2`
* [`4404002`](https://github.com/npm/cli/commit/4404002a16502e710625c7668cbc9b3a932d6fe8) [#8951](https://github.com/npm/cli/pull/8951) `ci-info@4.4.0`
* [`b65af73`](https://github.com/npm/cli/commit/b65af737d8b05b1fec4540dfefeda4edd84e4aea) [#8951](https://github.com/npm/cli/pull/8951) `lru-cache@11.2.5`
* [`164c355`](https://github.com/npm/cli/commit/164c35580ba9dd26461d9bcdf0c993b7a0eee5a6) [#8951](https://github.com/npm/cli/pull/8951) `tar@7.5.7`
* [`a74a19c`](https://github.com/npm/cli/commit/a74a19ce52501e63af19db5a542b793c8ad2477b) [#8951](https://github.com/npm/cli/pull/8951) `node-gyp@12.2.0`
* [`e0bc212`](https://github.com/npm/cli/commit/e0bc2129c9ba0ba5ac61c07e07aefd99adff5fb6) [#8943](https://github.com/npm/cli/pull/8943) `pacote@21.1.0`
### Chores
* [`4a82a8f`](https://github.com/npm/cli/commit/4a82a8f2e8873853ce3ef2f91c459ec9fd5aebde) [#8951](https://github.com/npm/cli/pull/8951) dev dependency updates (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.2.0): `@npmcli/arborist@9.2.0`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.6.0): `@npmcli/config@10.6.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.1.0): `libnpmdiff@8.1.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.2.0): `libnpmexec@10.2.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.14): `libnpmfund@7.0.14`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.1.0): `libnpmpack@9.1.0`

## [11.8.0](https://github.com/npm/cli/compare/v11.7.0...v11.8.0) (2026-01-21)
### Features
* [`545e861`](https://github.com/npm/cli/commit/545e86154cc847766ceb356c3b1229d0573314c0) [#8828](https://github.com/npm/cli/pull/8828) show proxy environment variables in npm config list (Max Black)
### Bug Fixes
* [`c2f784d`](https://github.com/npm/cli/commit/c2f784dbb5a83106558ff6ee7cc60bfc088ee9ed) [#8859](https://github.com/npm/cli/pull/8859) preserve serialNumber UUID in CycloneDX SBOM output #8837 (#8859) (@saksham-malhotra-27)
* [`f2c3af7`](https://github.com/npm/cli/commit/f2c3af7de1906b0517bba1e7e5b9247d57960d99) [#8840](https://github.com/npm/cli/pull/8840) more intuitive byte formatting boundaries for rounding (#8840) (@watilde)
### Documentation
* [`3474ec3`](https://github.com/npm/cli/commit/3474ec35fb579873d20a4b6747983ca369d61592) [#8866](https://github.com/npm/cli/pull/8866) fix typo/logic error in npm-dedupe docs (#8866) (@Schweinepriester)
* [`5552e46`](https://github.com/npm/cli/commit/5552e465125c72e5d591fb6dff76c450e78c7c70) [#8797](https://github.com/npm/cli/pull/8797) npm-install: explain package-lock.json behavior (#8797) (@MaxBlack-dev, Max Black)
### Dependencies
* [`f478ca0`](https://github.com/npm/cli/commit/f478ca0efb6e3dd7b32a3d7b51c896fdd5f5cd90) [#8919](https://github.com/npm/cli/pull/8919) `postcss-selector-parser@7.1.1`
* [`2b6a71f`](https://github.com/npm/cli/commit/2b6a71fae386e76e142dbab8e1bbc368d5ef0487) [#8919](https://github.com/npm/cli/pull/8919) `path-scurry@2.0.1`
* [`19096f2`](https://github.com/npm/cli/commit/19096f28883706a96a5146d4ec313dffbcc148f7) [#8919](https://github.com/npm/cli/pull/8919) `sigstore@4.1.0`
* [`e7f5d1e`](https://github.com/npm/cli/commit/e7f5d1e445f599c60791a849484c4c0167392d10) [#8919](https://github.com/npm/cli/pull/8919) `lru-cache@11.2.4`
* [`9e756ae`](https://github.com/npm/cli/commit/9e756ae2b51b8ae6b4661ab47a1401690b82ce31) [#8919](https://github.com/npm/cli/pull/8919) `ip-address@10.1.0`
* [`f951820`](https://github.com/npm/cli/commit/f95182001771ad5d52dfc57934d7ce1b97055b70) [#8919](https://github.com/npm/cli/pull/8919) `common-ancestor-path@2.0.0`
* [`7a949ad`](https://github.com/npm/cli/commit/7a949ad8967c93c6b38ed9d4ee469703d269eea5) [#8919](https://github.com/npm/cli/pull/8919) `@sigstore/verify@3.1.0`
* [`6979ce1`](https://github.com/npm/cli/commit/6979ce1e0455042038d953d1631eaf8ed5cbb90a) [#8919](https://github.com/npm/cli/pull/8919) `@sigstore/sign@4.1.0`
* [`b4a6a41`](https://github.com/npm/cli/commit/b4a6a41bcc17694047c85fd71b3155ab0cb29302) [#8919](https://github.com/npm/cli/pull/8919) `@sigstore/core@3.1.0`
* [`dc8a8e8`](https://github.com/npm/cli/commit/dc8a8e8090deffc244f836fde2328d6444fc8ffc) [#8919](https://github.com/npm/cli/pull/8919) `@sigstore/tuf@4.0.1`
* [`be221ea`](https://github.com/npm/cli/commit/be221eae2974a04fadb1c80fc423eb949e4df723) [#8919](https://github.com/npm/cli/pull/8919) `validate-npm-package-name@7.0.2`
* [`149823d`](https://github.com/npm/cli/commit/149823de9a920e8ea25ed11399d79d3758f592ef) [#8919](https://github.com/npm/cli/pull/8919) `diff@8.0.3`
* [`32b2001`](https://github.com/npm/cli/commit/32b2001f552078eac8f4ec863d704fc91346efe3) [#8919](https://github.com/npm/cli/pull/8919) `tar@7.5.4`
### Chores
* [`8f599df`](https://github.com/npm/cli/commit/8f599df6a3888fd9a06a5c17748657cbb45076c3) [#8919](https://github.com/npm/cli/pull/8919) pin jsdom to 27.0.0 (@wraithgar)
* [`f4f1161`](https://github.com/npm/cli/commit/f4f1161520e6c2b4b9038d4bd723ccef235e4273) [#8919](https://github.com/npm/cli/pull/8919) dev dependency updates (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.10): `@npmcli/arborist@9.1.10`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.5.0): `@npmcli/config@10.5.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.13): `libnpmdiff@8.0.13`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.12): `libnpmexec@10.1.12`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.13): `libnpmfund@7.0.13`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.13): `libnpmpack@9.0.13`

## [11.7.0](https://github.com/npm/cli/compare/v11.6.4...v11.7.0) (2025-12-09)
### Features
* [`b380d15`](https://github.com/npm/cli/commit/b380d155050be21a9ee5ce08d50e184c06a13f36) [#8697](https://github.com/npm/cli/pull/8697) add deduping to notices unless in verbose+ mode (@owlstronaut)
### Bug Fixes
* [`4ebb831`](https://github.com/npm/cli/commit/4ebb831d93f13cc0b980754bf36abb2982b131f7) [#8839](https://github.com/npm/cli/pull/8839) updates hints to use cli paradigm (@owlstronaut)
* [`7896e51`](https://github.com/npm/cli/commit/7896e51812d6b3d7f204f32a92a6721affd257a5) [#8838](https://github.com/npm/cli/pull/8838) update the token list text (@owlstronaut)
* [`8ab8668`](https://github.com/npm/cli/commit/8ab86685baee32ef9428ab202f60b8b631e40ca9) [#8836](https://github.com/npm/cli/pull/8836) query: support package-lock-only in workspaces (@watilde)
* [`35e8d38`](https://github.com/npm/cli/commit/35e8d38ef880239b5dd2c61a8112f6aa11d10eab) [#8322](https://github.com/npm/cli/pull/8322) properly handle newlines with input when using the spinner (#8322) (@mbtools)
* [`0c0faae`](https://github.com/npm/cli/commit/0c0faae91d47fe1303de77aae7c6b38709972d2f) [#8780](https://github.com/npm/cli/pull/8780) adduser: improve email prompt (#8780) (@mbtools)
### Documentation
* [`7f2ab9d`](https://github.com/npm/cli/commit/7f2ab9dac62b56343204e13194f8f53421c19f3b) [#8810](https://github.com/npm/cli/pull/8810) scripts: replace deprecated prepublish and install examples with prepare (Max Black)
* [`91ebab7`](https://github.com/npm/cli/commit/91ebab777e5bfac6f34537e58c228209f7cc961a) [#8847](https://github.com/npm/cli/pull/8847) remove note about token create being disabled (@owlstronaut)
* [`2030250`](https://github.com/npm/cli/commit/2030250fbce3ac99ab116b6aee7e4d06f395134b) [#8822](https://github.com/npm/cli/pull/8822) scripts: clarify prepare script runs with --production (Max Black)
* [`33a50d7`](https://github.com/npm/cli/commit/33a50d7981492e71f533448d93fc586429e603fd) [#8821](https://github.com/npm/cli/pull/8821) scripts: update npm_package_* environment variables documentation (Max Black)
* [`50508f9`](https://github.com/npm/cli/commit/50508f9b18051761ec466de85cf0ecbee3130165) [#8793](https://github.com/npm/cli/pull/8793) package-json: add documentation for type field (#8793) (@MaxBlack-dev, Max Black)
* [`aa1dd7e`](https://github.com/npm/cli/commit/aa1dd7e974176225973bd1aa1683ef4ae3c418eb) [#8823](https://github.com/npm/cli/pull/8823) scripts: document that prepare scripts run concurrently in workspaces (Max Black)
* [`3f48487`](https://github.com/npm/cli/commit/3f48487aa343003bce0e55e1dfcd5fc8a9b3e198) [#8820](https://github.com/npm/cli/pull/8820) package-spec: fix alias syntax in examples (Max Black)
* [`dd104da`](https://github.com/npm/cli/commit/dd104da7d7c2ddd00731df716a082595df4a89b0) [#8812](https://github.com/npm/cli/pull/8812) version: add note about git version requirements (Max Black)
* [`58afdcc`](https://github.com/npm/cli/commit/58afdcc2094bd245c9916a02a62640a76ace8e72) [#8792](https://github.com/npm/cli/pull/8792) install: clarify prerelease version range behavior (Max Black)
* [`9f818e8`](https://github.com/npm/cli/commit/9f818e8cdfb4f10e36c7659e9aa86ddc4633e503) [#8795](https://github.com/npm/cli/pull/8795) npm-view: clarify object property access syntax and provide examples (Max Black)
* [`39c2f2e`](https://github.com/npm/cli/commit/39c2f2ef890b3af97aad85f71fbcb148f8965259) [#8791](https://github.com/npm/cli/pull/8791) add examples for command line flags including --prefix (Max Black)
* [`1298530`](https://github.com/npm/cli/commit/1298530af04f6982b7ba8b2cb677f23090fb806f) [#8790](https://github.com/npm/cli/pull/8790) clarify version field can be omitted in package-lock (Max Black)
* [`090b6ca`](https://github.com/npm/cli/commit/090b6cacb8228b2050e0e3746655441d2739a2ab) [#8794](https://github.com/npm/cli/pull/8794) npx: clarify that arguments are passed to executed command (Max Black)
* [`a864f80`](https://github.com/npm/cli/commit/a864f80799b407ee90f6482d5eb966dd66d13b56) [#8787](https://github.com/npm/cli/pull/8787) document gypfile field in package.json (Max Black)
* [`2fc689d`](https://github.com/npm/cli/commit/2fc689dfa0a69d66d7599997b4fa51a64111a619) [#8788](https://github.com/npm/cli/pull/8788) add field access patterns to npm view (Max Black)
* [`4850639`](https://github.com/npm/cli/commit/48506391c6248837cfd357aec28f5a3beb3cf184) [#8796](https://github.com/npm/cli/pull/8796) package-json: add examples for replacing dependencies with forks in overrides (Max Black)
* [`4864dd4`](https://github.com/npm/cli/commit/4864dd4289272e310065ccd43b254e1d3232d07f) [#8798](https://github.com/npm/cli/pull/8798) npm-install: document engines field priority when installing packages (Max Black)
* [`95d25cd`](https://github.com/npm/cli/commit/95d25cd97d88baa3ae11c69d5e69a1e850c39701) [#8799](https://github.com/npm/cli/pull/8799) package-json: clarify repository field normalization during publish (Max Black)
* [`a367f9b`](https://github.com/npm/cli/commit/a367f9bdac86f34769acfc427200e11f21e0c3ce) [#8800](https://github.com/npm/cli/pull/8800) package-lock-json: clarify that version field may be omitted for certain dependencies (Max Black)
* [`ffc9b71`](https://github.com/npm/cli/commit/ffc9b713b6a4ef762d6231ade70b008e9f296cb7) [#8801](https://github.com/npm/cli/pull/8801) npm-install: clarify --tag does not override package.json (#8801) (@MaxBlack-dev, Max Black)
* [`73688ca`](https://github.com/npm/cli/commit/73688ca5eb984d0027abcc72980cc287a892e5c8) [#8735](https://github.com/npm/cli/pull/8735) clarify npm version behavior with prerelease versions (#8735) (@yashwantbezawada)
* [`4a32606`](https://github.com/npm/cli/commit/4a32606ff50c71309455a0e3324d5ca90c1bbecc) [#8785](https://github.com/npm/cli/pull/8785) updates the token create documentation (#8785) (@owlstronaut, @wraithgar)
### Chores
* [`54929ce`](https://github.com/npm/cli/commit/54929cef8e26a4698234e5d2499a43b746569b12) [#8836](https://github.com/npm/cli/pull/8836) update baseline-browser-mapping (@watilde)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.9): `@npmcli/arborist@9.1.9`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.4.5): `@npmcli/config@10.4.5`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.12): `libnpmdiff@8.0.12`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.11): `libnpmexec@10.1.11`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.12): `libnpmfund@7.0.12`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.12): `libnpmpack@9.0.12`

## [11.6.4](https://github.com/npm/cli/compare/v11.6.3...v11.6.4) (2025-11-25)
### Documentation
* [`dfb83c7`](https://github.com/npm/cli/commit/dfb83c7887810abd555a2ab62a681858aabe2430) [#8749](https://github.com/npm/cli/pull/8749) add example for keywords field (#8749) (@MaxBlack-dev, Max Black)
* [`1b1e227`](https://github.com/npm/cli/commit/1b1e227d234dc6132832e1a65141260d3601838b) [#8750](https://github.com/npm/cli/pull/8750) remove outdated roadmap link (#8750) (@MaxBlack-dev, Max Black)
* [`1333d57`](https://github.com/npm/cli/commit/1333d576448c3868a29a65cf9cfb0d07ccfccd93) [#8752](https://github.com/npm/cli/pull/8752) clarify .npmrc naming convention for environment variable overrides (#8752) (@MaxBlack-dev)
* [`22cddb8`](https://github.com/npm/cli/commit/22cddb83f884c179258dabe6f20954246074c623) [#8755](https://github.com/npm/cli/pull/8755) add workspace dependencies example to workspaces (Max Black)
* [`17e154c`](https://github.com/npm/cli/commit/17e154cac7394b1baa3987c5b9b168762d9ba4ad) [#8756](https://github.com/npm/cli/pull/8756) standardize env vars to uppercase convention (Max Black)
* [`1e51a25`](https://github.com/npm/cli/commit/1e51a25d02508fbfa1d5d53602d35669115e55ff) [#8754](https://github.com/npm/cli/pull/8754) fix lifecycle event order for prepare script (Max Black)
* [`8d72bc9`](https://github.com/npm/cli/commit/8d72bc99dc705e04e25f24b05cac0f72934608b4) [#8753](https://github.com/npm/cli/pull/8753) add os, cpu, and funding fields to package-lock.json (Max Black)
### Dependencies
* [`f56bb13`](https://github.com/npm/cli/commit/f56bb133bbd07f92b32f776f310bcd2aa26cbdfc) [#8779](https://github.com/npm/cli/pull/8779) `proc-log@6.1.0` (#8779)
* [`f963223`](https://github.com/npm/cli/commit/f96322350e497f90a54c8a1cfd952b3329f00492) [#8770](https://github.com/npm/cli/pull/8770) `proggy@4.0.0`
* [`f51e4aa`](https://github.com/npm/cli/commit/f51e4aaf06ac6703abe053a95fe25b8efca3c527) [#8770](https://github.com/npm/cli/pull/8770) `nopt@9.0.0`
* [`2d15040`](https://github.com/npm/cli/commit/2d15040390697cd78c9a9db3f0dbafab51a6e3e9) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/query@5.0.0`
* [`9d77b84`](https://github.com/npm/cli/commit/9d77b84ce961a28941af8b1a597a03e308828cd4) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/installed-package-contents@4.0.0`
* [`e2ac092`](https://github.com/npm/cli/commit/e2ac092fdab0ccbf3b20abbac7ff1ebb7cda9a88) [#8770](https://github.com/npm/cli/pull/8770) `read@5.0.1`
* [`6e5bfd9`](https://github.com/npm/cli/commit/6e5bfd93f5423ab0b89fd81493969af108438066) [#8770](https://github.com/npm/cli/pull/8770) `init-package-json@8.2.4`
* [`7f8e237`](https://github.com/npm/cli/commit/7f8e2376e289fc46410f68b7c686d3868ad837c0) [#8770](https://github.com/npm/cli/pull/8770) `p-map@7.0.4`
* [`a4aa218`](https://github.com/npm/cli/commit/a4aa218fa0a3cc5fc65bc516bc4c83fd4bac7fd8) [#8770](https://github.com/npm/cli/pull/8770) `npm-user-validate@4.0.0`
* [`6430446`](https://github.com/npm/cli/commit/643044690be9554366e0cbd5bc42afa77c4acc45) [#8770](https://github.com/npm/cli/pull/8770) `npm-audit-report@7.0.0`
* [`58650dc`](https://github.com/npm/cli/commit/58650dc089c74d090c51d1cb2f269f2d605dcca0) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/fs@5.0.0`
* [`4a11146`](https://github.com/npm/cli/commit/4a11146aa7e3d06c42793ef5daf3c19b37bdc7ce) [#8770](https://github.com/npm/cli/pull/8770) `glob@13.0.0`
* [`00511d4`](https://github.com/npm/cli/commit/00511d426a7f8d761700b315a0f660854a782353) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/cacache@20.0.3`
* [`224afa2`](https://github.com/npm/cli/commit/224afa27174f43695ac308de9f849529419a59b2) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/map-workspaces@5.0.3`
* [`664ac34`](https://github.com/npm/cli/commit/664ac341efef746ac47d08fcd8cc4cc105f1445b) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/package-json@7.0.4`
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.8): `@npmcli/arborist@9.1.8`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.4.4): `@npmcli/config@10.4.4`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.11): `libnpmdiff@8.0.11`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.10): `libnpmexec@10.1.10`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.11): `libnpmfund@7.0.11`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.11): `libnpmpack@9.0.11`

## [11.6.3](https://github.com/npm/cli/compare/v11.6.2...v11.6.3) (2025-11-19)
### Bug Fixes
* [`c6242d9`](https://github.com/npm/cli/commit/c6242d92e5227e0a772d9cfe474ea57776af79e0) [#8706](https://github.com/npm/cli/pull/8706) change npm profile to create tokens with GAT support (#8706) (@owlstronaut, @wraithgar)
* [`cbc6fa9`](https://github.com/npm/cli/commit/cbc6fa9cd7c582053be77a56677191313c7e8d98) [#8731](https://github.com/npm/cli/pull/8731) order of version information in error message (#8731) (@piotrd, @pd-be)
* [`11dbd7e`](https://github.com/npm/cli/commit/11dbd7e36287695801f02a43e53b24fc2d72a545) [#8709](https://github.com/npm/cli/pull/8709) display full token when creating authentication tokens  (#8709) (@MaxBlack-dev, Max Black)
* [`49a4eef`](https://github.com/npm/cli/commit/49a4eefd613dbb60bcff3dac39129f70586d3cff) [#8676](https://github.com/npm/cli/pull/8676) use look behind regex for trailing slash stripping (#8676) (@wraithgar)
* [`b1aee62`](https://github.com/npm/cli/commit/b1aee62082d7b25ec07f64e906afd76840907fbd) [#8645](https://github.com/npm/cli/pull/8645) dep flag calculation (#8645) (@liamcmitchell)
### Documentation
* [`ca53c21`](https://github.com/npm/cli/commit/ca53c21e8a0f0e659e891415735e184443b8f48b) [#8745](https://github.com/npm/cli/pull/8745) add workspace usage examples (#8745) (@MaxBlack-dev, Max Black)
* [`e71ca0e`](https://github.com/npm/cli/commit/e71ca0e1934b805c97485b39501653655a54c919) [#8746](https://github.com/npm/cli/pull/8746) add --save flag to documentation (#8746) (@MaxBlack-dev, Max Black)
* [`06510a8`](https://github.com/npm/cli/commit/06510a8720fa180e9ef9093d9caee2e85bbc5165) [#8683](https://github.com/npm/cli/pull/8683) add ignore-scripts option to npm version help and docs (#8683) (@Tejas242)
### Dependencies
* [`7f72238`](https://github.com/npm/cli/commit/7f7223833b9f655ea82039cf389ed8d03fb3b212) [#8723](https://github.com/npm/cli/pull/8723) `cacache@20.0.2`
* [`7ac9db8`](https://github.com/npm/cli/commit/7ac9db8564312ffd57a8f622634d6f3de080c472) [#8723](https://github.com/npm/cli/pull/8723) `init-package-json@8.2.3`
* [`41e97c6`](https://github.com/npm/cli/commit/41e97c65d1d9d0bf7fa80d4b018ff4c051b1487b) [#8723](https://github.com/npm/cli/pull/8723) `validate-npm-package-name@7.0.0`
* [`6b1fbe1`](https://github.com/npm/cli/commit/6b1fbe1ef3db7f5782809abdcdf6c53ff7542330) [#8723](https://github.com/npm/cli/pull/8723) `npm-package-arg@13.0.2`
* [`aa1d486`](https://github.com/npm/cli/commit/aa1d486a4e4a82de16d4c63154a1b1a89ad09e6d) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/promise-spawn@9.0.1`
* [`599c819`](https://github.com/npm/cli/commit/599c819e525f235bab08c9395e7f357d4d2454a6) [#8723](https://github.com/npm/cli/pull/8723) `which@6.0.0`
* [`e49286e`](https://github.com/npm/cli/commit/e49286e2189dfe1604d957ccc415038957a64d19) [#8723](https://github.com/npm/cli/pull/8723) `ini@5.0.0`
* [`b7c9f96`](https://github.com/npm/cli/commit/b7c9f960063da93c8476739d1d6a717746255f93) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/promise-spawn@9.0.0`
* [`8cc9f70`](https://github.com/npm/cli/commit/8cc9f70c2769f068ea0ef77a602162cdd949998e) [#8723](https://github.com/npm/cli/pull/8723) `ssri@13.0.0`
* [`0b7274f`](https://github.com/npm/cli/commit/0b7274fa39edacc7103eacf2a72c074d01451284) [#8723](https://github.com/npm/cli/pull/8723) `pacote@21.0.4`
* [`59b3c6a`](https://github.com/npm/cli/commit/59b3c6adf5fb7e5c8e0f990ade7417677270057a) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/redact@4.0.0`
* [`578abad`](https://github.com/npm/cli/commit/578abad64d57dee1db460f1013c8514099e08136) [#8723](https://github.com/npm/cli/pull/8723) `node-gyp@12.1.0`
* [`89c4151`](https://github.com/npm/cli/commit/89c4151a9182ddb77eff1beaeaaa2c0279578a2e) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/git@7.0.1`
* [`c6d109d`](https://github.com/npm/cli/commit/c6d109d7ad59b0be87225917e6393bcc9838f64d) [#8723](https://github.com/npm/cli/pull/8723) `make-fetch-happen@15.0.3`
* [`34d8599`](https://github.com/npm/cli/commit/34d8599987bdd4335391394fc00f80b395fb3a7c) [#8723](https://github.com/npm/cli/pull/8723) `npm-registry-fetch@19.1.1`
* [`4811a86`](https://github.com/npm/cli/commit/4811a86a563d4361b15dd33415857410785a8e81) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/run-script@10.0.3`
* [`6cb77df`](https://github.com/npm/cli/commit/6cb77df37989cb7c165cb2c35c735fb12dc1385a) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/installed-package-contents@4.0.0`
* [`05ac7a7`](https://github.com/npm/cli/commit/05ac7a7ea2a4d258658537a19ba350e07df34fda) [#8723](https://github.com/npm/cli/pull/8723) `proc-log@6.0.0`
* [`0a74f6d`](https://github.com/npm/cli/commit/0a74f6d1d8643f3a089f6e63502df77e6e3038ff) [#8723](https://github.com/npm/cli/pull/8723) `bin-links@6.0.0`
* [`c02ce5c`](https://github.com/npm/cli/commit/c02ce5c132ea6e2b3d1941520228b10a10ad50f1) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/package-json@7.0.2`
* [`9c0cefa`](https://github.com/npm/cli/commit/9c0cefa8417d9e14ee19dd5e833019f0f99ce837) [#8723](https://github.com/npm/cli/pull/8723) `json-parse-even-better-errors@5.0.0`
* [`041b9b2`](https://github.com/npm/cli/commit/041b9b29b30c539c5bf8b8cd26ea2202f94862b3) [#8723](https://github.com/npm/cli/pull/8723) `parse-conflict-json@5.0.1`
* [`a1b0fea`](https://github.com/npm/cli/commit/a1b0feac64ff681b2aec6938eb5136f5e177a07a) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/name-from-folder@4.0.0`
* [`a085745`](https://github.com/npm/cli/commit/a085745da65662f5ce02933b99109f77542fc3bb) [#8723](https://github.com/npm/cli/pull/8723) `abbrev@4.0.0`
* [`00d9c7d`](https://github.com/npm/cli/commit/00d9c7da4173cd48c4295d32d4d8b47d3c8d8701) [#8723](https://github.com/npm/cli/pull/8723) `nopt@9.0.0`
* [`3404dca`](https://github.com/npm/cli/commit/3404dca3d986d1bf0de3e74cf8b61856778711c6) [#8723](https://github.com/npm/cli/pull/8723) `npm-install-checks@8.0.0`
* [`542fcf3`](https://github.com/npm/cli/commit/542fcf3eee92cc41e86838c97c4036a97d749155) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/node-gyp@5.0.0`
* [`89e14d3`](https://github.com/npm/cli/commit/89e14d376fa4d0dc3bb15fefcd932e3f949dbbaa) [#8723](https://github.com/npm/cli/pull/8723) `tar@7.5.2`
* [`5383f3a`](https://github.com/npm/cli/commit/5383f3aa680a028bc6f66ce76383d0259cc5a80d) [#8723](https://github.com/npm/cli/pull/8723) `npm-registry-fetch@19.1.0`
* [`1bb9a7d`](https://github.com/npm/cli/commit/1bb9a7d4ce779cca184d665c7ee4a4d3c9494168) [#8723](https://github.com/npm/cli/pull/8723) `npm-profile@12.0.1`
* [`de619a4`](https://github.com/npm/cli/commit/de619a40eccaa34eafb68b026bd6790ec38d2249) [#8723](https://github.com/npm/cli/pull/8723) `npm-pick-manifest@11.0.3`
* [`0e042ec`](https://github.com/npm/cli/commit/0e042ec4ed6eab646c645506378d409746b324bc) [#8723](https://github.com/npm/cli/pull/8723) `npm-packlist@10.0.3`
* [`2a3c338`](https://github.com/npm/cli/commit/2a3c33871471f327444a0e477199b3c1885683ed) [#8723](https://github.com/npm/cli/pull/8723) `node-gyp@11.5.0`
* [`b96e86c`](https://github.com/npm/cli/commit/b96e86cca5b0c63d98f3cfb92883f9a26882a1dd) [#8723](https://github.com/npm/cli/pull/8723) `minimatch@10.1.1`
* [`d347329`](https://github.com/npm/cli/commit/d347329513229ed2ba5954b996c322e9fd3d807d) [#8723](https://github.com/npm/cli/pull/8723) `exponential-backoff@3.1.3`
* [`d6830f4`](https://github.com/npm/cli/commit/d6830f4fac3b03090d97dce4cac26d5ff0b903d7) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/run-script@10.0.2`
* [`bcc7ec8`](https://github.com/npm/cli/commit/bcc7ec83ad69b2a80d98cfced94553d7f6e8c943) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/metavuln-calculator@9.0.3`
* [`7a419df`](https://github.com/npm/cli/commit/7a419df651b3d8d6fbf9571b80d2f4009e7a5e37) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/map-workspaces@5.0.1`
### Chores
* [`32bdd83`](https://github.com/npm/cli/commit/32bdd833f83cf2a939ed56eba1972d5d729c677c) [#8723](https://github.com/npm/cli/pull/8723) fix package-lock (@wraithgar)
* [`4bff14b`](https://github.com/npm/cli/commit/4bff14b536f70b998b38ca984cbcab94a6c65bf9) [#8670](https://github.com/npm/cli/pull/8670) write tarball to testDir (#8670) (@wraithgar)
* [`679486b`](https://github.com/npm/cli/commit/679486b095f262d478daa21629d01f68f0240c9b) [#8672](https://github.com/npm/cli/pull/8672) fix lockfile (#8672) (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.7): `@npmcli/arborist@9.1.7`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.4.3): `@npmcli/config@10.4.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.10): `libnpmdiff@8.0.10`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.9): `libnpmexec@10.1.9`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.10): `libnpmfund@7.0.10`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.10): `libnpmpack@9.0.10`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.1.3): `libnpmpublish@11.1.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v8.0.3): `libnpmversion@8.0.3`

## [11.6.2](https://github.com/npm/cli/compare/v11.6.1...v11.6.2) (2025-10-08)
### Bug Fixes
* [`c54d1e9`](https://github.com/npm/cli/commit/c54d1e96f37e7fd4bf2645c4905535c9b3d93e3b) [#8633](https://github.com/npm/cli/pull/8633) progress bar code cleanup (#8633) (@wraithgar)
* [`d352e27`](https://github.com/npm/cli/commit/d352e27a679b1b7f4417ff5f7e3ac73fe13b403a) [#8629](https://github.com/npm/cli/pull/8629) do not redact notice logs going to stdout (#8629) (@wraithgar)
* [`5ac3678`](https://github.com/npm/cli/commit/5ac3678feabbb28b1d0d8a78838bf8da79f63c1b) [#8617](https://github.com/npm/cli/pull/8617) spelling in ./lib and ./test/lib (#8617) (@jsoref)
* [`9197995`](https://github.com/npm/cli/commit/9197995ef0b760738454f2d255c0683d0731b24c) [#8619](https://github.com/npm/cli/pull/8619) spelling (#8619) (@jsoref)
* [`dd884e3`](https://github.com/npm/cli/commit/dd884e371c1fba7e2b7c1540baec405dd30ac3e7) [#8618](https://github.com/npm/cli/pull/8618) spelling (#8618) (@jsoref)
* [`f6028e6`](https://github.com/npm/cli/commit/f6028e67aa1b2696e60e115d870182a026bae07f) [#8614](https://github.com/npm/cli/pull/8614) skip redacting urls meant for opening by the user (#8614) (@wraithgar, @jolyndenning)
* [`54fd27f`](https://github.com/npm/cli/commit/54fd27f9f6af54ca9fd11165aafbc8a13a38f39e) [#8602](https://github.com/npm/cli/pull/8602) refactor node.ideallyInert to node.inert (#8602) (@liamcmitchell)
* [`79e3c1e`](https://github.com/npm/cli/commit/79e3c1eff776ed7bbc76c1aa53b02cfdea40a6e7) [#8593](https://github.com/npm/cli/pull/8593) use @npmcli/package-json to normalize package data (@wraithgar)
### Documentation
* [`0469c5e`](https://github.com/npm/cli/commit/0469c5ebec7d4998f957d7c69702796af6797c57) [#8639](https://github.com/npm/cli/pull/8639) rewrap markdown (#8639) (@jsoref)
* [`9ceb9c1`](https://github.com/npm/cli/commit/9ceb9c1d18d2c52a5c3328b4939e979baca7edea) [#8636](https://github.com/npm/cli/pull/8636) rewrap markdown (#8636) (@jsoref)
* [`6324370`](https://github.com/npm/cli/commit/63243709429ab7d95f360caebce6c31946d41857) [#8616](https://github.com/npm/cli/pull/8616) fix spelling (#8616) (@jsoref)
* [`1b0429a`](https://github.com/npm/cli/commit/1b0429af3b837e12fc5063d153393641435a856d) [#8607](https://github.com/npm/cli/pull/8607) Fix spelling (#8607) (@jsoref)
* [`7fbe07a`](https://github.com/npm/cli/commit/7fbe07a6ad9eff81a41776fb6068fce9e7b557d1) [#8603](https://github.com/npm/cli/pull/8603) clean up deprecated `npm access` commands (#8603) (@jsoref)
### Dependencies
* [`fa7cc6f`](https://github.com/npm/cli/commit/fa7cc6f9338e6d9c0be1dbe7002d683fd389794a) [#8662](https://github.com/npm/cli/pull/8662) `ci-info@4.3.1` (#8662)
* [`b05461b`](https://github.com/npm/cli/commit/b05461b6b16f262179efdea45fccf388f88ddc51) [#8663](https://github.com/npm/cli/pull/8663) `@sigstore/sign@4.0.1` (#8663)
* [`c31de22`](https://github.com/npm/cli/commit/c31de22970930bedf43c1f92ff771bccf435271b) [#8661](https://github.com/npm/cli/pull/8661) downgrade ci-info to 4.3.0 (#8661) (@wraithgar)
* [`c5191b5`](https://github.com/npm/cli/commit/c5191b542a9a49edf121be7127110e2958309df0) [#8659](https://github.com/npm/cli/pull/8659) `ci-info@4.3.1`
* [`f255c92`](https://github.com/npm/cli/commit/f255c92abf6281af7b7f148b9683194ad09d9ba9) [#8659](https://github.com/npm/cli/pull/8659) `hosted-git-info@9.0.2`
* [`bdaf323`](https://github.com/npm/cli/commit/bdaf323a160e47862ca228fa82e90555dcb567a8) [#8659](https://github.com/npm/cli/pull/8659) `is-cidr@6.0.1`
* [`a33f106`](https://github.com/npm/cli/commit/a33f1062c3cacd889cea0d989de77a704931f54c) [#8659](https://github.com/npm/cli/pull/8659) `lru-cache@11.2.2`
* [`8044e07`](https://github.com/npm/cli/commit/8044e07000c2b00e7db33693b1f7fb8e96978e02) [#8659](https://github.com/npm/cli/pull/8659) `npm-package-arg@13.0.1`
* [`f577504`](https://github.com/npm/cli/commit/f5775043e7d2739256db20937ae072a1b1b3fb57) [#8659](https://github.com/npm/cli/pull/8659) `npm-packlist@10.0.2`
* [`9aa4fa6`](https://github.com/npm/cli/commit/9aa4fa6687ee85a5c0085b3c3c96330eb9a9c7df) [#8659](https://github.com/npm/cli/pull/8659) `semver@7.7.3`
* [`fe9484a`](https://github.com/npm/cli/commit/fe9484a17707f5a6bc16cdc91f29f848a4b54d31) [#8593](https://github.com/npm/cli/pull/8593) remove normalize-package-data
### Chores
* [`b3409f4`](https://github.com/npm/cli/commit/b3409f480fef2b9885fd071c951ad8313de2754e) [#8659](https://github.com/npm/cli/pull/8659) dev dependency updates (@wraithgar)
* [`e8de81b`](https://github.com/npm/cli/commit/e8de81bc8202cfe1253676fd3f9785508e9051a6) [#8643](https://github.com/npm/cli/pull/8643) Add automatically generated annotation to dependencies.md (#8643) (@jsoref)
* [`67cfaf3`](https://github.com/npm/cli/commit/67cfaf35295fa2f5d7aa01d37c423c60ad7afeca) [#8627](https://github.com/npm/cli/pull/8627) fix spelling: different (#8627) (@jsoref)
* [`17ddc0d`](https://github.com/npm/cli/commit/17ddc0d6af1b56c4670b36b2c2705d31bdfa7749) [#8622](https://github.com/npm/cli/pull/8622) fix spelling (#8622) (@jsoref)
* [`c3e1790`](https://github.com/npm/cli/commit/c3e1790c98d5c7fabc92bcfb1a5fa170f4c7fc1d) [#8605](https://github.com/npm/cli/pull/8605) Remove reference to nonexistent calendar (#8605) (@jsoref)
* [`ac9143e`](https://github.com/npm/cli/commit/ac9143eafd46a89f707f525381b0ddb109b3beb6) [#8604](https://github.com/npm/cli/pull/8604) Improve link accessibility for screen reader users (#8604) (@jsoref)
* [`62d73e7`](https://github.com/npm/cli/commit/62d73e763fa2deffa629a4451a80b7e58032b8e0) [#8601](https://github.com/npm/cli/pull/8601) remove references to benchmarks workflow (#8601) (@jsoref)
* [`bb4b739`](https://github.com/npm/cli/commit/bb4b73953ada43285aa43dad626f48dafc53fea2) [#8598](https://github.com/npm/cli/pull/8598) remove stale comment (#8598) (@jsoref)
* [`f73e65d`](https://github.com/npm/cli/commit/f73e65d86d425bcf6b1693553e981bd05d2daeaf) [#8592](https://github.com/npm/cli/pull/8592) fix build url code for remark-github@12 (#8592) (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.6): `@npmcli/arborist@9.1.6`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.4.2): `@npmcli/config@10.4.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v10.0.3): `libnpmaccess@10.0.3`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.9): `libnpmdiff@8.0.9`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.8): `libnpmexec@10.1.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.9): `libnpmfund@7.0.9`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.9): `libnpmpack@9.0.9`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.1.2): `libnpmpublish@11.1.2`

## [11.6.1](https://github.com/npm/cli/compare/v11.6.0...v11.6.1) (2025-09-23)
### Bug Fixes
* [`d389614`](https://github.com/npm/cli/commit/d3896147c61b06d6d39a55bbb609f878548e0107) [#8579](https://github.com/npm/cli/pull/8579) corrects peer dependency flag propagation (@owlstronaut)
* [`5db81c3`](https://github.com/npm/cli/commit/5db81c350654dbbe2e1442d623efada9a24e04f1) [#8512](https://github.com/npm/cli/pull/8512) allow concurrent non-local npx calls (#8512) (@jenseng, @wraithgar)
### Documentation
* [`7a09902`](https://github.com/npm/cli/commit/7a099029dbeeeab821498b9b462abce1269461f4) [#8582](https://github.com/npm/cli/pull/8582) bring back certfile (#8582) (@jenseng)
### Dependencies
* [`849dcb6`](https://github.com/npm/cli/commit/849dcb6dc22a16f01869ba9c6bf9146143000b25) [#8589](https://github.com/npm/cli/pull/8589) `tar@7.5.1` (#8589)
* [`ea15731`](https://github.com/npm/cli/commit/ea15731e3246ca698ad3f63fadd696479a906633) [#8576](https://github.com/npm/cli/pull/8576) `binary-extensions@3.1.0`
* [`0f41bac`](https://github.com/npm/cli/commit/0f41bace5677d0d624c67ff3fac5e2caeebcb399) [#8576](https://github.com/npm/cli/pull/8576) `tiny-relative-date@2.0.2`
* [`07bf540`](https://github.com/npm/cli/commit/07bf5402fbec900f1d69c05b7cb73a987d963d2c) [#8576](https://github.com/npm/cli/pull/8576) `is-cidr@6.0.0`
* [`ef87ec6`](https://github.com/npm/cli/commit/ef87ec6612fe5924d3466967aa7e104f3f98bf15) [#8576](https://github.com/npm/cli/pull/8576) `diff@8.0.2`
* [`48285e0`](https://github.com/npm/cli/commit/48285e04fd0a89b34d0c214295d5e76f68413f91) [#8576](https://github.com/npm/cli/pull/8576) add fdir, isexe, and picomatch to node_modules
* [`099238a`](https://github.com/npm/cli/commit/099238ac13ba535c99ff51bde348fcd9f6b86542) [#8576](https://github.com/npm/cli/pull/8576) `fdir@6.5.0`
* [`6e4d673`](https://github.com/npm/cli/commit/6e4d673138ee4026081e72bea1f6cdfc14516a98) [#8576](https://github.com/npm/cli/pull/8576) `isexe@3.1.1`
* [`09a7494`](https://github.com/npm/cli/commit/09a7494b59a89faa1f550864ce9f68b0c86179f1) [#8576](https://github.com/npm/cli/pull/8576) `supports-color@10.2.2`
* [`c5157c9`](https://github.com/npm/cli/commit/c5157c978fc235dea3a70235b6d08902473058f4) [#8576](https://github.com/npm/cli/pull/8576) `chalk@5.6.2`
* [`46035db`](https://github.com/npm/cli/commit/46035dbf4d87dad76051410c6b1b2536a874d9ed) [#8576](https://github.com/npm/cli/pull/8576) `debug@4.4.3`
* [`5f6664b`](https://github.com/npm/cli/commit/5f6664b7a8f622cfdd356d776e97dc8bae7e0ada) [#8576](https://github.com/npm/cli/pull/8576) `spdx-license-ids@3.0.22`
* [`5516583`](https://github.com/npm/cli/commit/5516583de7982f4b8d5142510429b809654d8f75) [#8576](https://github.com/npm/cli/pull/8576) `socks@2.8.7`
* [`6a392f3`](https://github.com/npm/cli/commit/6a392f36312b71cc4b0e71c25b4c95f47d1eeaf8) [#8576](https://github.com/npm/cli/pull/8576) `tinyglobby@0.2.15`
* [`9519f18`](https://github.com/npm/cli/commit/9519f189a427eb0a56c846379fdd92ff95078a5b) [#8576](https://github.com/npm/cli/pull/8576) `npm-install-checks@7.1.2`
* [`34bafd1`](https://github.com/npm/cli/commit/34bafd153f20954b5f8efdbf068fe1ec384ab489) [#8576](https://github.com/npm/cli/pull/8576) `node-gyp@11.4.2`
* [`dfd034e`](https://github.com/npm/cli/commit/dfd034eaf9c8fac8c40276aab42c65e2736158c8) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/promise-spawn@8.0.3`
* [`d4eef14`](https://github.com/npm/cli/commit/d4eef14dcdc30ef3a09e88180168b649ea82d72e) [#8576](https://github.com/npm/cli/pull/8576) `rimraf@6.0.1`
* [`566f1b7`](https://github.com/npm/cli/commit/566f1b7b487ad80604c61162ddde769d5ac2b241) [#8576](https://github.com/npm/cli/pull/8576) `minimatch@10.0.3`
* [`ac33497`](https://github.com/npm/cli/commit/ac334979ab94a52085b81a276c64788fa688e735) [#8576](https://github.com/npm/cli/pull/8576) `mkdirp@3.0.1`
* [`1676626`](https://github.com/npm/cli/commit/167662683d7ebbb34b1d65cf1cb74d69db12c871) [#8576](https://github.com/npm/cli/pull/8576) `glob@11.0.3`
* [`817f0b1`](https://github.com/npm/cli/commit/817f0b1eb57b9b0e5893beac11f053e3a7d3f765) [#8576](https://github.com/npm/cli/pull/8576) `ignore-walk@8.0.0`
* [`79a4e67`](https://github.com/npm/cli/commit/79a4e67c358b491f0456162fa9307e0f5a99167b) [#8576](https://github.com/npm/cli/pull/8576) `minizlib@3.0.2`
* [`38fa2c2`](https://github.com/npm/cli/commit/38fa2c2e67bed4c6e69d894cdbed0175d30ad085) [#8576](https://github.com/npm/cli/pull/8576) `negotiator@1.0.0`
* [`24252a1`](https://github.com/npm/cli/commit/24252a16fc45bfa6a4c1112269016568484006e1) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/agent@4.0.0`
* [`ea7ca5f`](https://github.com/npm/cli/commit/ea7ca5f49d6cab81e9ce3d412963c48acd87b7c0) [#8576](https://github.com/npm/cli/pull/8576) `lru-cache@11.2.1`
* [`521823b`](https://github.com/npm/cli/commit/521823bc398de0eb85135a3ef09e217db93ed1ce) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/git@7.0.0`
* [`bf6b686`](https://github.com/npm/cli/commit/bf6b6862731e03002cc6fa3b86b6f090df46b009) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-arg@13.0.0`
* [`9392488`](https://github.com/npm/cli/commit/9392488d6036dfc9696e29cc8d463335517974ca) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-manifest@11.0.1`
* [`0082083`](https://github.com/npm/cli/commit/0082083fe4f52d3ef40241e9d8b991f7ed4a60dc) [#8576](https://github.com/npm/cli/pull/8576) `normalize-package-data@8.0.0`
* [`633c4ed`](https://github.com/npm/cli/commit/633c4ed76ea13b8dfb5837a397e984e44cccb820) [#8576](https://github.com/npm/cli/pull/8576) `hosted-git-info@9.0.0`
* [`66f64eb`](https://github.com/npm/cli/commit/66f64eb1426beaad314321c22b5debff64b2357a) [#8576](https://github.com/npm/cli/pull/8576) `make-fetch-happen@15.0.2`
* [`1f85f94`](https://github.com/npm/cli/commit/1f85f94ec2e5dcf295c68c02b21d0b830b2082c2) [#8576](https://github.com/npm/cli/pull/8576) `@sigstore/tuf@4.0.0`
* [`a2bdecc`](https://github.com/npm/cli/commit/a2bdecc6677abcd58ed3037ab0edafb419ea86fa) [#8576](https://github.com/npm/cli/pull/8576) `sigstore@4.0.0`
* [`1149971`](https://github.com/npm/cli/commit/11499711e4c10e4ddb97bf3e1ef1652d151894fb) [#8576](https://github.com/npm/cli/pull/8576) `npm-registry-fetch@19.0.0`
* [`b5bd5e3`](https://github.com/npm/cli/commit/b5bd5e351061b46d6417210cd73c0f64c39e6819) [#8576](https://github.com/npm/cli/pull/8576) `npm-profile@12.0.0`
* [`6221e27`](https://github.com/npm/cli/commit/6221e277b4b841df09225b4d72f9eda70db1f15a) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/metavuln-calculator@9.0.2`
* [`da81a37`](https://github.com/npm/cli/commit/da81a3702fdf7ea2dc7223fc6ece4c7a19e32ad1) [#8576](https://github.com/npm/cli/pull/8576) `cacache@20.0.1`
* [`6b4c5f9`](https://github.com/npm/cli/commit/6b4c5f92865230ed9a260cd3e8486bf3991120eb) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/run-script@10.0.0`
* [`cb36a8a`](https://github.com/npm/cli/commit/cb36a8ad38df37579f59cf794d6c23ed7274fba9) [#8576](https://github.com/npm/cli/pull/8576) `init-package-json@8.2.2`
* [`b6bb9ae`](https://github.com/npm/cli/commit/b6bb9aea4134c47f0593c111a734eda12ec3c20d) [#8576](https://github.com/npm/cli/pull/8576) `pacote@21.0.3`
* [`1b4433f`](https://github.com/npm/cli/commit/1b4433fdb85623e019a6194cb01ff85c7f64ccad) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/map-workspaces@5.0.0`
* [`ceae674`](https://github.com/npm/cli/commit/ceae674c32a080b81e62d79003c2d537d7ca93d2) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/package-json@7.0.1`
* [`4f37534`](https://github.com/npm/cli/commit/4f37534300553e9ddfbc413c14d1ef15b02b46f2) [#8576](https://github.com/npm/cli/pull/8576) remove read-package-json-fast
### Chores
* [`7eb5c09`](https://github.com/npm/cli/commit/7eb5c09eb4c9d20095fd285a32275743f10cf80b) [#8576](https://github.com/npm/cli/pull/8576) update package-lock with peer flag fixes (@wraithgar)
* [`0d00fd8`](https://github.com/npm/cli/commit/0d00fd862c75d743a38ed4c5336636696129cf3b) [#8576](https://github.com/npm/cli/pull/8576) `jsdom@27.0.0` (@wraithgar)
* [`420a569`](https://github.com/npm/cli/commit/420a569762e65b50d18338706420a85f24e3e0ee) [#8576](https://github.com/npm/cli/pull/8576) `unified@11.0.5` (@wraithgar)
* [`064deb3`](https://github.com/npm/cli/commit/064deb3b329a953d86c3cbaee26805987ff82d0d) [#8576](https://github.com/npm/cli/pull/8576) `remark-rehype@11.1.2` (@wraithgar)
* [`30fe3ba`](https://github.com/npm/cli/commit/30fe3ba2455caa66e0aaf7d1e9343ed9872faba0) [#8576](https://github.com/npm/cli/pull/8576) `remark-man@9.0.0` (@wraithgar)
* [`1c6bb4c`](https://github.com/npm/cli/commit/1c6bb4c54f515fdb7ead06cb05d24e0b9d403f8b) [#8576](https://github.com/npm/cli/pull/8576) `rehype-stringify@10.0.1` (@wraithgar)
* [`208cb93`](https://github.com/npm/cli/commit/208cb93fabae2b11993497382ceb48dacc41e490) [#8576](https://github.com/npm/cli/pull/8576) `remark-gfm@4.0.1` (@wraithgar)
* [`4a46b5a`](https://github.com/npm/cli/commit/4a46b5aaaeaa68ce718d4d4a95a74b9e49da8129) [#8576](https://github.com/npm/cli/pull/8576) `remark-github@12.0.0` (@wraithgar)
* [`93d190b`](https://github.com/npm/cli/commit/93d190bcb02342ce4d159168f12b86f071d6fca7) [#8576](https://github.com/npm/cli/pull/8576) `remark-parse@11.0.0` (@wraithgar)
* [`05301a4`](https://github.com/npm/cli/commit/05301a49fb3feed88736722c8b511dde3a1117e6) [#8576](https://github.com/npm/cli/pull/8576) `remark@15.0.1` (@wraithgar)
* [`6afdda9`](https://github.com/npm/cli/commit/6afdda99ed20c7e1fb95ed379fcc9665ef4f340d) [#8576](https://github.com/npm/cli/pull/8576) `ajv-formats@3.0.1` (@wraithgar)
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`3b43bf7`](https://github.com/npm/cli/commit/3b43bf79d36a04ee65f562528c7ac54ebafaf79b) [#8576](https://github.com/npm/cli/pull/8576) dev dependency updates (@wraithgar)
* [`9f9146f`](https://github.com/npm/cli/commit/9f9146f99c638361aed606a67156854c7cf2c2cf) [#8576](https://github.com/npm/cli/pull/8576) `@tufjs/repo-mock@4.0.0` (@wraithgar)
* [`eed8a10`](https://github.com/npm/cli/commit/eed8a10f09831cc01bdc7d07c4fae5c27dcf966c) [#8576](https://github.com/npm/cli/pull/8576) use latest/local arborist in mock-registry (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.5): `@npmcli/arborist@9.1.5`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.4.1): `@npmcli/config@10.4.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmaccess-v10.0.2): `libnpmaccess@10.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.8): `libnpmdiff@8.0.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.7): `libnpmexec@10.1.7`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.8): `libnpmfund@7.0.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmorg-v8.0.1): `libnpmorg@8.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.8): `libnpmpack@9.0.8`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.1.1): `libnpmpublish@11.1.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmsearch-v9.0.1): `libnpmsearch@9.0.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmteam-v8.0.2): `libnpmteam@8.0.2`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v8.0.2): `libnpmversion@8.0.2`

## [11.6.0](https://github.com/npm/cli/compare/v11.5.2...v11.6.0) (2025-09-03)
### Features
* [`bdcc10d`](https://github.com/npm/cli/commit/bdcc10d9f848940987b3d326ccd4673fab2bcfef) [#8359](https://github.com/npm/cli/pull/8359) add support for optional env var replacements in .npmrc (#8359) (@aczekajski, @owlstronaut)
### Bug Fixes
* [`dd4cee9`](https://github.com/npm/cli/commit/dd4cee9026c8e2dd5e4c28fd45ac8bceae74fb89) [#8539](https://github.com/npm/cli/pull/8539) powershell: improve argument parsing (#8539) (@alexsch01)
* [`5f18557`](https://github.com/npm/cli/commit/5f1855778b5e376c5f1389e0ee5f204dc86c4d32) [#8532](https://github.com/npm/cli/pull/8532) powershell: fix issue with modified InvocationName (#8532) (@alexsch01)
* [`9e5abf1`](https://github.com/npm/cli/commit/9e5abf19b93359881b2035bc371e09794a1dad01) [#8529](https://github.com/npm/cli/pull/8529) add redaction to log format egress (#8529) (@wraithgar)
* [`75ce64a`](https://github.com/npm/cli/commit/75ce64a5b21b806be203b97f35a48497b4afcb56) [#8524](https://github.com/npm/cli/pull/8524) revert handle signal exits gracefully (#8524) (@owlstronaut)
* [`5d82d0b`](https://github.com/npm/cli/commit/5d82d0b4a4bd1424031fb68b4df740c1bbe5b172) [#8469](https://github.com/npm/cli/pull/8469) ps1 scripts in powershell 5.1 (#8469) (@splatteredbits)


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v9.1.4): `@npmcli/arborist@9.1.4`
* [workspace](https://github.com/npm/cli/releases/tag/config-v10.4.0): `@npmcli/config@10.4.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.0.7): `libnpmdiff@8.0.7`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.1.6): `libnpmexec@10.1.6`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.7): `libnpmfund@7.0.7`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v9.0.7): `libnpmpack@9.0.7`

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
* [`26b6454`](https://github.com/npm/cli/commit/26b64543ebb27e421c05643eb996f6765c13444c) fix grammar in local path note (@cgay)
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
* [`7f72944`](https://github.com/npm/cli/commit/7f72944e43f009cf4d55ff4fe24c459e07f588fd) [#8038](https://github.com/npm/cli/pull/8038) publish: accept publishConfig.tag to override highest semver check (@wraithgar)
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
* `npm init` now has a `type` prompt, and sorts the entries in created packages differently
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
* [`852dd8b`](https://github.com/npm/cli/commit/852dd8bdcb958439d343bcd9fb27fb4f07e95991) [#7831](https://github.com/npm/cli/pull/7831) sets npm 11 to prerelease (@reggi)
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
