:robot: I have created a release *beep* *boop*
---


<details><summary>12.0.0-pre.1</summary>

## [12.0.0-pre.1](https://github.com/npm/cli/compare/v12.0.0-pre.0...v12.0.0-pre.1) (2026-05-27)
###   BREAKING CHANGES
* root \`preinstall\` now runs before dependencies are installed.
* unknown configs in .npmrc, unknown CLI flags, abbreviated flags, and single-hyphen multi-char shorthands now throw instead of warning.
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
* [`f2e4a28`](https://github.com/npm/cli/commit/f2e4a285ec5ed43055462a47db6d330758a16e64) [#9351](https://github.com/npm/cli/pull/9351) add a global npmignore file (#9351) (@ljharb)
* [`c9be2d1`](https://github.com/npm/cli/commit/c9be2d1efadd353e743bcebd52faaa5aa64e2fc0) [#9153](https://github.com/npm/cli/pull/9153) publish --access=private alias for restricted (#9153) (@reggi, @Copilot)
* [`7068d42`](https://github.com/npm/cli/commit/7068d4286eb446fdb0ded08d15d7b5c3883d80f5) [#9360](https://github.com/npm/cli/pull/9360) Phase 1 of `allowScripts` opt-in install-script policy (#9360) (@JamieMagee)
* [`979518d`](https://github.com/npm/cli/commit/979518dd198b9f2beb788c6c3cdcd1e055b03d22) [#9276](https://github.com/npm/cli/pull/9276) error on unknown configs, flags, and abbreviations (#9276) (@owlstronaut)
* [`254809e`](https://github.com/npm/cli/commit/254809e318ee0046092d07d68a99154c3f672147) [#9201](https://github.com/npm/cli/pull/9201) npm stage (#9201) (@reggi, @Copilot)
* [`cf94dbe`](https://github.com/npm/cli/commit/cf94dbe2432251623966bb7be1c6ded15ea97e14) [#9248](https://github.com/npm/cli/pull/9248) add permissions support to trust commands (#9248) (@reggi, @Copilot)
* [`e0f12f7`](https://github.com/npm/cli/commit/e0f12f7e57aca36f71c9615bd971f427ed23e91a) [#9348](https://github.com/npm/cli/pull/9348) add allow-git/allow-file/allow-directory/allow-remote configs (@owlstronaut)
* [`916cb4b`](https://github.com/npm/cli/commit/916cb4b262df1d188ce7644e916b138fbc78c4e7) [#9287](https://github.com/npm/cli/pull/9287) add allow-directory, allow-file, and allow-remote (#9287) (@wraithgar)
* [`2e5dcad`](https://github.com/npm/cli/commit/2e5dcad17a59ee9f69eeec27fc5b087b5b032df7) [#9262](https://github.com/npm/cli/pull/9262) drop npm-shrinkwrap.json support (@owlstronaut)
* [`2397196`](https://github.com/npm/cli/commit/239719668a73afbacc02eedcedcd3d3dd7f36b01) [#9265](https://github.com/npm/cli/pull/9265) Remove Twitter and Freenode profile fields (@owlstronaut)
* [`738be10`](https://github.com/npm/cli/commit/738be10651522e94038f1eff0da12f15b10438ea) [#9196](https://github.com/npm/cli/pull/9196) remove star commands (#9196) (@wraithgar)
* [`db7c1f8`](https://github.com/npm/cli/commit/db7c1f887eb1c1cb281ea7c9f6d84fba8f10d44d) [#9163](https://github.com/npm/cli/pull/9163) add `u` as alias for `update` command (#9163) (@Ausoj)
* [`45e44dd`](https://github.com/npm/cli/commit/45e44dd7ac2a3af815684ece3bdc99ada2f317f7) [#9228](https://github.com/npm/cli/pull/9228) adds a backport script (@owlstronaut)
* [`8eff5fb`](https://github.com/npm/cli/commit/8eff5fb31afc996c71c8f159defa324cb86dfc5a) [#9049](https://github.com/npm/cli/pull/9049) audit: add --include-attestations flag to output sigstore bundles (#9049) (@mitchdenny)
* [`4fcd352`](https://github.com/npm/cli/commit/4fcd352c553fdc0f13a87ad71ef66d7515c11886) [#9017](https://github.com/npm/cli/pull/9017) add :type(registry) to query selector syntax (#9017) (@wraithgar)
* [`e1b21f0`](https://github.com/npm/cli/commit/e1b21f03e20dfd7b9cc1e631041027a013721df4) [#8909](https://github.com/npm/cli/pull/8909) adds circleci to trust command (#8909) (@owlstronaut)
* [`9a33ad0`](https://github.com/npm/cli/commit/9a33ad03c0ac2a3feed2db5f8a84c25635865186) [#8925](https://github.com/npm/cli/pull/8925) adds circleci to oidc (#8925) (@owlstronaut)
* [`cf56a1e`](https://github.com/npm/cli/commit/cf56a1e4df9c8ae7b7e9752437d827a183e4040e) [#8899](https://github.com/npm/cli/pull/8899) npm trust, per-command config (@reggi)
* [`cf56a1e`](https://github.com/npm/cli/commit/cf56a1e4df9c8ae7b7e9752437d827a183e4040e) [#8899](https://github.com/npm/cli/pull/8899) npm trust (@reggi)
* [`66d6e11`](https://github.com/npm/cli/commit/66d6e11f3ecdbc823ede24ef83257f3bb6e69d46) [#8965](https://github.com/npm/cli/pull/8965) add min-release-age (#8965) (@wraithgar)
* [`f5f6cf7`](https://github.com/npm/cli/commit/f5f6cf7c9fc9315b96eb29c5c7d5ab63ad3a9122) [#8943](https://github.com/npm/cli/pull/8943) config: add --allow-git (@wraithgar)
* [`545e861`](https://github.com/npm/cli/commit/545e86154cc847766ceb356c3b1229d0573314c0) [#8828](https://github.com/npm/cli/pull/8828) show proxy environment variables in npm config list (Max Black)
* [`b380d15`](https://github.com/npm/cli/commit/b380d155050be21a9ee5ce08d50e184c06a13f36) [#8697](https://github.com/npm/cli/pull/8697) add deduping to notices unless in verbose+ mode (@owlstronaut)
* [`bdcc10d`](https://github.com/npm/cli/commit/bdcc10d9f848940987b3d326ccd4673fab2bcfef) [#8359](https://github.com/npm/cli/pull/8359) add support for optional env var replacements in .npmrc (#8359) (@aczekajski, @owlstronaut)
* [`1cce318`](https://github.com/npm/cli/commit/1cce31810eb5ff1e0f7c8ee4516e7c73cedb38a1) [#8336](https://github.com/npm/cli/pull/8336) adds support for oidc publish (#8336) (@reggi)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
* [`33aebaa`](https://github.com/npm/cli/commit/33aebaa58541ac0af3882cc0b56f09b1b676740a) [#9410](https://github.com/npm/cli/pull/9410) fix typo of fullMetadata (@owlstronaut)
* [`2a03860`](https://github.com/npm/cli/commit/2a03860fcafe92b22770fc554b25994b29bacbdb) [#9267](https://github.com/npm/cli/pull/9267) run root preinstall before reify (@owlstronaut)
* [`c0fc549`](https://github.com/npm/cli/commit/c0fc54935af8e17a3a96cbdeac52bb4c597803b6) [#9372](https://github.com/npm/cli/pull/9372) config: pause progress spinner during interactive editor spawn (#9372) (@Zelys-DFKH, @claude)
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
* [`596706a`](https://github.com/npm/cli/commit/596706a3d10100587e3751d860b4cfcc59342d2f) [#9148](https://github.com/npm/cli/pull/9148) revert prefer-offline/prefer-online exclusivity (#9129) (@owlstronaut)
* [`03af94d`](https://github.com/npm/cli/commit/03af94d9020b35d09c838b9bd4f26697e49bf08b) [#9123](https://github.com/npm/cli/pull/9123) skip synopsis code block when command has no usage (@owlstronaut)
* [`21ea382`](https://github.com/npm/cli/commit/21ea382a60b3693ff6c44c81447caa5d0294169c) [#9110](https://github.com/npm/cli/pull/9110) arborist: resolve sibling override sets via common ancestor (#9110) (@manzoorwanijk)
* [`a9d242b`](https://github.com/npm/cli/commit/a9d242bc4f04440630141743949ddb0d323f90b4) [#9099](https://github.com/npm/cli/pull/9099) include all subcommands on main command help (#9099) (@wraithgar)
* [`29b8407`](https://github.com/npm/cli/commit/29b8407971af1b9a2a3dcdb3849adfa04363fa7f) [#9087](https://github.com/npm/cli/pull/9087) unwrap comments and lines meant for output (#9087) (@wraithgar)
* [`b56986a`](https://github.com/npm/cli/commit/b56986acb0661fba2c80135eff3d140aa659dcf5) [#9095](https://github.com/npm/cli/pull/9095) ls: suppress false UNMET DEPENDENCYs in linked strategy (#9095) (@manzoorwanijk)
* [`76c76e5`](https://github.com/npm/cli/commit/76c76e5ad7cc5c7f641a92334b900c9d0c9a3fbd) [#9083](https://github.com/npm/cli/pull/9083) ci: don't error on optional deps in the lockfile (#9083) (@wraithgar)
* [`a29aeee`](https://github.com/npm/cli/commit/a29aeee18f3ddc2348a8e00787d237c874642789) [#9028](https://github.com/npm/cli/pull/9028) arborist: retry bin-links on Windows EPERM (#9028) (@manzoorwanijk)
* [`6565eeb`](https://github.com/npm/cli/commit/6565eeb818494e1feb4e14492804ce936b394b4a) [#9045](https://github.com/npm/cli/pull/9045) bypass packument cache to prevent ETARGET errors after publish (#9045) (@Jadu07)
* [`4426411`](https://github.com/npm/cli/commit/4426411bda7807afbb47aa01d8bf789e8c91eaff) [#9026](https://github.com/npm/cli/pull/9026) npm audit signatures for keyless attestation registries (#9026) (@ajayk)
* [`658b323`](https://github.com/npm/cli/commit/658b32373e3490c72826b0bbcc6c1b74129e3ced) [#9010](https://github.com/npm/cli/pull/9010) handle legacy licenses array in sbom output (#9010) (@JNC4)
* [`9fac412`](https://github.com/npm/cli/commit/9fac412105c4bbd116cffb6e27dda54a2adecf33) [#8995](https://github.com/npm/cli/pull/8995) improve unknown config warning with .npmrc section hint (#8995) (@umeshmore45)
* [`bb135cc`](https://github.com/npm/cli/commit/bb135cc8998b8b936f2cb412ec3303ae02d6920c) [#8981](https://github.com/npm/cli/pull/8981) arborist: fix `peerOptional` dependency resolution in `buildIdealTree` (#8981) (@Saibamen, @cursoragent)
* [`5c03826`](https://github.com/npm/cli/commit/5c03826e7aabedc03aaeaaa2f6863e6259519443) [#8993](https://github.com/npm/cli/pull/8993) remove tabular output from "npm view" (@wraithgar)
* [`4648f26`](https://github.com/npm/cli/commit/4648f26f2e68c86306161b7ed6550c06adba4483) [#8993](https://github.com/npm/cli/pull/8993) remove tabular output from "npm team" (@wraithgar)
* [`2242f25`](https://github.com/npm/cli/commit/2242f2515826474a4fb8664fc679f1919ecaf458) [#8952](https://github.com/npm/cli/pull/8952) webauth: improve error messages around webauth in non-TTY (#8952) (@Andarist)
* [`c2f784d`](https://github.com/npm/cli/commit/c2f784dbb5a83106558ff6ee7cc60bfc088ee9ed) [#8859](https://github.com/npm/cli/pull/8859) preserve serialNumber UUID in CycloneDX SBOM output #8837 (#8859) (@saksham-malhotra-27)
* [`f2c3af7`](https://github.com/npm/cli/commit/f2c3af7de1906b0517bba1e7e5b9247d57960d99) [#8840](https://github.com/npm/cli/pull/8840) more intuitive byte formatting boundaries for rounding (#8840) (@watilde)
* [`4ebb831`](https://github.com/npm/cli/commit/4ebb831d93f13cc0b980754bf36abb2982b131f7) [#8839](https://github.com/npm/cli/pull/8839) updates hints to use cli paradigm (@owlstronaut)
* [`7896e51`](https://github.com/npm/cli/commit/7896e51812d6b3d7f204f32a92a6721affd257a5) [#8838](https://github.com/npm/cli/pull/8838) update the token list text (@owlstronaut)
* [`8ab8668`](https://github.com/npm/cli/commit/8ab86685baee32ef9428ab202f60b8b631e40ca9) [#8836](https://github.com/npm/cli/pull/8836) query: support package-lock-only in workspaces (@watilde)
* [`35e8d38`](https://github.com/npm/cli/commit/35e8d38ef880239b5dd2c61a8112f6aa11d10eab) [#8322](https://github.com/npm/cli/pull/8322) properly handle newlines with input when using the spinner (#8322) (@mbtools)
* [`0c0faae`](https://github.com/npm/cli/commit/0c0faae91d47fe1303de77aae7c6b38709972d2f) [#8780](https://github.com/npm/cli/pull/8780) adduser: improve email prompt (#8780) (@mbtools)
* [`c6242d9`](https://github.com/npm/cli/commit/c6242d92e5227e0a772d9cfe474ea57776af79e0) [#8706](https://github.com/npm/cli/pull/8706) change npm profile to create tokens with GAT support (#8706) (@owlstronaut, @wraithgar)
* [`cbc6fa9`](https://github.com/npm/cli/commit/cbc6fa9cd7c582053be77a56677191313c7e8d98) [#8731](https://github.com/npm/cli/pull/8731) order of version information in error message (#8731) (@piotrd, @pd-be)
* [`11dbd7e`](https://github.com/npm/cli/commit/11dbd7e36287695801f02a43e53b24fc2d72a545) [#8709](https://github.com/npm/cli/pull/8709) display full token when creating authentication tokens  (#8709) (@MaxBlack-dev, Max Black)
* [`49a4eef`](https://github.com/npm/cli/commit/49a4eefd613dbb60bcff3dac39129f70586d3cff) [#8676](https://github.com/npm/cli/pull/8676) use look behind regex for trailing slash stripping (#8676) (@wraithgar)
* [`b1aee62`](https://github.com/npm/cli/commit/b1aee62082d7b25ec07f64e906afd76840907fbd) [#8645](https://github.com/npm/cli/pull/8645) dep flag calculation (#8645) (@liamcmitchell)
* [`c54d1e9`](https://github.com/npm/cli/commit/c54d1e96f37e7fd4bf2645c4905535c9b3d93e3b) [#8633](https://github.com/npm/cli/pull/8633) progress bar code cleanup (#8633) (@wraithgar)
* [`d352e27`](https://github.com/npm/cli/commit/d352e27a679b1b7f4417ff5f7e3ac73fe13b403a) [#8629](https://github.com/npm/cli/pull/8629) do not redact notice logs going to stdout (#8629) (@wraithgar)
* [`5ac3678`](https://github.com/npm/cli/commit/5ac3678feabbb28b1d0d8a78838bf8da79f63c1b) [#8617](https://github.com/npm/cli/pull/8617) spelling in ./lib and ./test/lib (#8617) (@jsoref)
* [`9197995`](https://github.com/npm/cli/commit/9197995ef0b760738454f2d255c0683d0731b24c) [#8619](https://github.com/npm/cli/pull/8619) spelling (#8619) (@jsoref)
* [`dd884e3`](https://github.com/npm/cli/commit/dd884e371c1fba7e2b7c1540baec405dd30ac3e7) [#8618](https://github.com/npm/cli/pull/8618) spelling (#8618) (@jsoref)
* [`f6028e6`](https://github.com/npm/cli/commit/f6028e67aa1b2696e60e115d870182a026bae07f) [#8614](https://github.com/npm/cli/pull/8614) skip redacting urls meant for opening by the user (#8614) (@wraithgar, @internettrans)
* [`54fd27f`](https://github.com/npm/cli/commit/54fd27f9f6af54ca9fd11165aafbc8a13a38f39e) [#8602](https://github.com/npm/cli/pull/8602) refactor node.ideallyInert to node.inert (#8602) (@liamcmitchell)
* [`79e3c1e`](https://github.com/npm/cli/commit/79e3c1eff776ed7bbc76c1aa53b02cfdea40a6e7) [#8593](https://github.com/npm/cli/pull/8593) use @npmcli/package-json to normalize package data (@wraithgar)
* [`d389614`](https://github.com/npm/cli/commit/d3896147c61b06d6d39a55bbb609f878548e0107) [#8579](https://github.com/npm/cli/pull/8579) corrects peer dependency flag propagation (@owlstronaut)
* [`5db81c3`](https://github.com/npm/cli/commit/5db81c350654dbbe2e1442d623efada9a24e04f1) [#8512](https://github.com/npm/cli/pull/8512) allow concurrent non-local npx calls (#8512) (@jenseng, @wraithgar)
* [`dd4cee9`](https://github.com/npm/cli/commit/dd4cee9026c8e2dd5e4c28fd45ac8bceae74fb89) [#8539](https://github.com/npm/cli/pull/8539) powershell: improve argument parsing (#8539) (@alexsch01)
* [`5f18557`](https://github.com/npm/cli/commit/5f1855778b5e376c5f1389e0ee5f204dc86c4d32) [#8532](https://github.com/npm/cli/pull/8532) powershell: fix issue with modified InvocationName (#8532) (@alexsch01)
* [`9e5abf1`](https://github.com/npm/cli/commit/9e5abf19b93359881b2035bc371e09794a1dad01) [#8529](https://github.com/npm/cli/pull/8529) add redaction to log format egress (#8529) (@wraithgar)
* [`75ce64a`](https://github.com/npm/cli/commit/75ce64a5b21b806be203b97f35a48497b4afcb56) [#8524](https://github.com/npm/cli/pull/8524) revert handle signal exits gracefully (#8524) (@owlstronaut)
* [`5d82d0b`](https://github.com/npm/cli/commit/5d82d0b4a4bd1424031fb68b4df740c1bbe5b172) [#8469](https://github.com/npm/cli/pull/8469) ps1 scripts in powershell 5.1 (#8469) (@splatteredbits)
* [`7d900c4`](https://github.com/npm/cli/commit/7d900c4656cfffc8cca93240c6cda4b441fbbfaa) [#8467](https://github.com/npm/cli/pull/8467) oidc visibility check for provenance (#8467) (@reggi, @wraithgar)
* [`476bf17`](https://github.com/npm/cli/commit/476bf174c1c9874fa2a92df7257c3d445e3e16d3) [#8457](https://github.com/npm/cli/pull/8457) provenance should only default for oidc (@reggi)
* [`7f66f0a`](https://github.com/npm/cli/commit/7f66f0ae8fb84f567fe83a9a5738d06c7fe8fb54) [#8447](https://github.com/npm/cli/pull/8447) add better hint for `before` and clean up description (@wraithgar)
* [`280817a`](https://github.com/npm/cli/commit/280817a0a5b4e2aebd4b2f39c79ac9af58165edf) [#8447](https://github.com/npm/cli/pull/8447) add --before param to command help output (@wraithgar)
* [`6e47325`](https://github.com/npm/cli/commit/6e47325e59f19e4e563b5f9308cff165739088a2) [#8441](https://github.com/npm/cli/pull/8441) Makes 404 errors less scary without revealing existence (#8441) (@owlstronaut)
### Documentation
* [`d124c08`](https://github.com/npm/cli/commit/d124c0858da0b138cda2addcb0987b063ca86a47) [#9385](https://github.com/npm/cli/pull/9385) Document `npm_old_version` and `npm_new_version` environment variables (#9385) (@36degrees)
* [`c97b39b`](https://github.com/npm/cli/commit/c97b39b1e3436cd20a67ab5f4012a5f395c538b9) [#9363](https://github.com/npm/cli/pull/9363) add example to optionalDependencies section (#9363) (@verifizieren)
* [`6704ab2`](https://github.com/npm/cli/commit/6704ab2c8a025800d871571889466e06399bf6a2) [#9335](https://github.com/npm/cli/pull/9335) npm view with json outputs array docs update (#9335) (@yetanotheraryan)
* [`d1ee8a5`](https://github.com/npm/cli/commit/d1ee8a524783e6ce33209fc48c83c89af5a5ccdf) [#9140](https://github.com/npm/cli/pull/9140) Add note on relative path prefix for npm publish (#9140) (@pydsigner)
* [`3b96929`](https://github.com/npm/cli/commit/3b96929166a55f7f0c346f9715988ec1e1ce195d) [#9074](https://github.com/npm/cli/pull/9074) scripts: remove mention of obsolete root user behavior (#9074) (@mohd-akram)
* [`16ac4e0`](https://github.com/npm/cli/commit/16ac4e02796248f3abb4fa043427236cda22a902) [#9054](https://github.com/npm/cli/pull/9054) fix workspace cross-dependency documentation (@owlstronaut)
* [`143f8cd`](https://github.com/npm/cli/commit/143f8cdf4c6503240cc655b383ba865c0b9ea599) [#9007](https://github.com/npm/cli/pull/9007) docs shouldn't wrap yaml description (#9007) (@owlstronaut)
* [`0a5756d`](https://github.com/npm/cli/commit/0a5756d5d06972dcf29cdee6978f5317dce92e6b) [#8998](https://github.com/npm/cli/pull/8998) clarify unsupported custom .npmrc keys and recommend alternatives (#8998) (@maitrawebtech)
* [`22c9153`](https://github.com/npm/cli/commit/22c91534d057dc4474495ed1d675fc9b15829275) [#8985](https://github.com/npm/cli/pull/8985) fix typo and grammar in README (#8985) (@csmit195, Chris)
* [`3474ec3`](https://github.com/npm/cli/commit/3474ec35fb579873d20a4b6747983ca369d61592) [#8866](https://github.com/npm/cli/pull/8866) fix typo/logic error in npm-dedupe docs (#8866) (@Schweinepriester)
* [`5552e46`](https://github.com/npm/cli/commit/5552e465125c72e5d591fb6dff76c450e78c7c70) [#8797](https://github.com/npm/cli/pull/8797) npm-install: explain package-lock.json behavior (#8797) (@MaxBlack-dev, Max Black)
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
* [`dfb83c7`](https://github.com/npm/cli/commit/dfb83c7887810abd555a2ab62a681858aabe2430) [#8749](https://github.com/npm/cli/pull/8749) add example for keywords field (#8749) (@MaxBlack-dev, Max Black)
* [`1b1e227`](https://github.com/npm/cli/commit/1b1e227d234dc6132832e1a65141260d3601838b) [#8750](https://github.com/npm/cli/pull/8750) remove outdated roadmap link (#8750) (@MaxBlack-dev, Max Black)
* [`1333d57`](https://github.com/npm/cli/commit/1333d576448c3868a29a65cf9cfb0d07ccfccd93) [#8752](https://github.com/npm/cli/pull/8752) clarify .npmrc naming convention for environment variable overrides (#8752) (@MaxBlack-dev)
* [`22cddb8`](https://github.com/npm/cli/commit/22cddb83f884c179258dabe6f20954246074c623) [#8755](https://github.com/npm/cli/pull/8755) add workspace dependencies example to workspaces (Max Black)
* [`17e154c`](https://github.com/npm/cli/commit/17e154cac7394b1baa3987c5b9b168762d9ba4ad) [#8756](https://github.com/npm/cli/pull/8756) standardize env vars to uppercase convention (Max Black)
* [`1e51a25`](https://github.com/npm/cli/commit/1e51a25d02508fbfa1d5d53602d35669115e55ff) [#8754](https://github.com/npm/cli/pull/8754) fix lifecycle event order for prepare script (Max Black)
* [`8d72bc9`](https://github.com/npm/cli/commit/8d72bc99dc705e04e25f24b05cac0f72934608b4) [#8753](https://github.com/npm/cli/pull/8753) add os, cpu, and funding fields to package-lock.json (Max Black)
* [`ca53c21`](https://github.com/npm/cli/commit/ca53c21e8a0f0e659e891415735e184443b8f48b) [#8745](https://github.com/npm/cli/pull/8745) add workspace usage examples (#8745) (@MaxBlack-dev, Max Black)
* [`e71ca0e`](https://github.com/npm/cli/commit/e71ca0e1934b805c97485b39501653655a54c919) [#8746](https://github.com/npm/cli/pull/8746) add --save flag to documentation (#8746) (@MaxBlack-dev, Max Black)
* [`06510a8`](https://github.com/npm/cli/commit/06510a8720fa180e9ef9093d9caee2e85bbc5165) [#8683](https://github.com/npm/cli/pull/8683) add ignore-scripts option to npm version help and docs (#8683) (@Tejas242)
* [`0469c5e`](https://github.com/npm/cli/commit/0469c5ebec7d4998f957d7c69702796af6797c57) [#8639](https://github.com/npm/cli/pull/8639) rewrap markdown (#8639) (@jsoref)
* [`9ceb9c1`](https://github.com/npm/cli/commit/9ceb9c1d18d2c52a5c3328b4939e979baca7edea) [#8636](https://github.com/npm/cli/pull/8636) rewrap markdown (#8636) (@jsoref)
* [`6324370`](https://github.com/npm/cli/commit/63243709429ab7d95f360caebce6c31946d41857) [#8616](https://github.com/npm/cli/pull/8616) fix spelling (#8616) (@jsoref)
* [`1b0429a`](https://github.com/npm/cli/commit/1b0429af3b837e12fc5063d153393641435a856d) [#8607](https://github.com/npm/cli/pull/8607) Fix spelling (#8607) (@jsoref)
* [`7fbe07a`](https://github.com/npm/cli/commit/7fbe07a6ad9eff81a41776fb6068fce9e7b557d1) [#8603](https://github.com/npm/cli/pull/8603) clean up deprecated `npm access` commands (#8603) (@jsoref)
* [`7a09902`](https://github.com/npm/cli/commit/7a099029dbeeeab821498b9b462abce1269461f4) [#8582](https://github.com/npm/cli/pull/8582) bring back certfile (#8582) (@jenseng)
* [`d4e56b2`](https://github.com/npm/cli/commit/d4e56b2976ef1d2af273a6750d10b217adf4bf8e) [#8459](https://github.com/npm/cli/pull/8459) update snapshot generation command (#8459) (@MikeMcC399)
### Dependencies
* [`d28783e`](https://github.com/npm/cli/commit/d28783e3f00feecf4ca76b497e80ffd281af1655) [#9420](https://github.com/npm/cli/pull/9420) `undici@6.26.0`
* [`7f6c6ef`](https://github.com/npm/cli/commit/7f6c6ef49023286bed47a334cc2bd0064cb8ec05) [#9420](https://github.com/npm/cli/pull/9420) `sigstore@4.1.1`
* [`ee61b6e`](https://github.com/npm/cli/commit/ee61b6e8279b1d26d28a47613d66a9deb5c06529) [#9420](https://github.com/npm/cli/pull/9420) `lru-cache@11.5.1`
* [`d5ddef2`](https://github.com/npm/cli/commit/d5ddef2571b5b26dfade31eb040dbd4a096aeed8) [#9420](https://github.com/npm/cli/pull/9420) `@sigstore/verify@3.1.1`
* [`11e7ac7`](https://github.com/npm/cli/commit/11e7ac72c3ea0490f8d5edfb4bd5a60729d25b66) [#9420](https://github.com/npm/cli/pull/9420) `@sigstore/core@3.2.1`
* [`11cd66e`](https://github.com/npm/cli/commit/11cd66e10490af0ef46ceeb5e8764a855580a2de) [#9420](https://github.com/npm/cli/pull/9420) `@npmcli/agent@4.0.2`
* [`8be4c04`](https://github.com/npm/cli/commit/8be4c046fbbbb8ede02a288b727fcbf7470956fb) [#9420](https://github.com/npm/cli/pull/9420) `semver@7.8.1`
* [`577d61d`](https://github.com/npm/cli/commit/577d61da646833994ecfda8b2f1dc993ec9b58d1) [#9420](https://github.com/npm/cli/pull/9420) `make-fetch-happen@15.0.6`
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
* [`03f4c3a`](https://github.com/npm/cli/commit/03f4c3a443bbd2a93e318bc5657ddb07e7a84fa7) [#9131](https://github.com/npm/cli/pull/9131) `@sigstore/tuf@4.0.2`
* [`4d5f7d9`](https://github.com/npm/cli/commit/4d5f7d9d33a41d124c2f7fedb4f267e3ce2ca5d8) [#9131](https://github.com/npm/cli/pull/9131) `@gar/promise-retry@1.0.3`
* [`8dcfe69`](https://github.com/npm/cli/commit/8dcfe693deda7e756b6b98ce8de8f28f8ecc584d) [#9131](https://github.com/npm/cli/pull/9131) `@sigstore/sign@4.1.1`
* [`e5a7e22`](https://github.com/npm/cli/commit/e5a7e222c7dc76fd1eed1efa31ca2d416ff20074) [#9127](https://github.com/npm/cli/pull/9127) `lru-cache@11.2.7`
* [`82deab6`](https://github.com/npm/cli/commit/82deab60ef2649c64830e734c48977090294dc7b) [#9127](https://github.com/npm/cli/pull/9127) `make-fetch-happen@15.0.5`
* [`ce195dc`](https://github.com/npm/cli/commit/ce195dc698e917d2169c3c0e632e5691f1fbbcdf) [#9127](https://github.com/npm/cli/pull/9127) `cacache@20.0.4`
* [`075ae23`](https://github.com/npm/cli/commit/075ae23e46d821c56a0f50f56b2d6c745fe7367e) [#9086](https://github.com/npm/cli/pull/9086) `tar@7.5.11`
* [`13fa40d`](https://github.com/npm/cli/commit/13fa40d4ce8f7b0ea3e437056faca693472b3efa) [#9086](https://github.com/npm/cli/pull/9086) `pacote@21.5.0`
* [`bf7ea2b`](https://github.com/npm/cli/commit/bf7ea2b19f5446d3c3a33de2844f7504cc418570) [#9060](https://github.com/npm/cli/pull/9060) `brace-expansion@5.0.4`
* [`2000d2c`](https://github.com/npm/cli/commit/2000d2ce858c79664c6255d78485580b0d65f5b4) [#9060](https://github.com/npm/cli/pull/9060) `minimatch@10.2.4`
* [`d86b260`](https://github.com/npm/cli/commit/d86b260103358e6f8dd7d9cc2526ac3144d595c8) [#9060](https://github.com/npm/cli/pull/9060) `tar@7.5.10`
* [`dff1853`](https://github.com/npm/cli/commit/dff1853ed6e5b4acfdd36d0109cb2ebe27693a6f) [#9060](https://github.com/npm/cli/pull/9060) `@npmcli/run-script@10.0.4`
* [`93c3365`](https://github.com/npm/cli/commit/93c33658f6ac4e83cff83a0e064b222f1b36a515) [#9060](https://github.com/npm/cli/pull/9060) `write-file-atomic@7.0.1`
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
* [`aae84bf`](https://github.com/npm/cli/commit/aae84bf5a90bb42599b27631734a9899735d4016) [#8973](https://github.com/npm/cli/pull/8973) `pacote@21.3.1`
* [`8bcb675`](https://github.com/npm/cli/commit/8bcb6754b95628da78bd4b6ddcc8c8ff40f7d0fb) [#8973](https://github.com/npm/cli/pull/8973) `cidr-regex@5.0.2`
* [`f87aaab`](https://github.com/npm/cli/commit/f87aaab974931766b1372fbd5d5ef9daa645b1ad) [#8973](https://github.com/npm/cli/pull/8973) `lru-cache@11.2.6`
* [`acec871`](https://github.com/npm/cli/commit/acec871478eeb4cf75d89216feb9e6a70efc1d33) [#8973](https://github.com/npm/cli/pull/8973) `ssri@13.0.1`
* [`1e42a86`](https://github.com/npm/cli/commit/1e42a86aa2460d39e8e3e450025d7df75e911d87) [#8973](https://github.com/npm/cli/pull/8973) `glob@13.0.2`
* [`e1c08a4`](https://github.com/npm/cli/commit/e1c08a4cf10465c76f037bfe31c0666a183feb7c) [#8973](https://github.com/npm/cli/pull/8973) `is-cidr@6.0.3`
* [`dfb0e34`](https://github.com/npm/cli/commit/dfb0e3466b444a5e1f25f785d42e8b8936bf5c3f) [#8973](https://github.com/npm/cli/pull/8973) `semver@7.7.4`
* [`0ee7776`](https://github.com/npm/cli/commit/0ee7776b17bb0f1ae745ed9cb0db61347a64d37d) [#8973](https://github.com/npm/cli/pull/8973) `which@6.0.1`
* [`332c9f3`](https://github.com/npm/cli/commit/332c9f355ff7c9a9a9e624100a84130a9b7c4162) [#8960](https://github.com/npm/cli/pull/8960) `glob@13.0.1`
* [`eca02c7`](https://github.com/npm/cli/commit/eca02c78c993af969f837c55068239468794932a) [#8960](https://github.com/npm/cli/pull/8960) `minimatch@10.1.2` `@isaacs/brace-expansion@5.0.1`
* [`b3f8475`](https://github.com/npm/cli/commit/b3f847568bcc95e1466668476cf3dcf1a4993ac3) [#8951](https://github.com/npm/cli/pull/8951) `minipass-fetch@5.0.1`
* [`924171b`](https://github.com/npm/cli/commit/924171bf5794f16f688b8544912a6205ec1d1fb5) [#8951](https://github.com/npm/cli/pull/8951) `is-cidr@6.0.2`
* [`4404002`](https://github.com/npm/cli/commit/4404002a16502e710625c7668cbc9b3a932d6fe8) [#8951](https://github.com/npm/cli/pull/8951) `ci-info@4.4.0`
* [`b65af73`](https://github.com/npm/cli/commit/b65af737d8b05b1fec4540dfefeda4edd84e4aea) [#8951](https://github.com/npm/cli/pull/8951) `lru-cache@11.2.5`
* [`164c355`](https://github.com/npm/cli/commit/164c35580ba9dd26461d9bcdf0c993b7a0eee5a6) [#8951](https://github.com/npm/cli/pull/8951) `tar@7.5.7`
* [`a74a19c`](https://github.com/npm/cli/commit/a74a19ce52501e63af19db5a542b793c8ad2477b) [#8951](https://github.com/npm/cli/pull/8951) `node-gyp@12.2.0`
* [`e0bc212`](https://github.com/npm/cli/commit/e0bc2129c9ba0ba5ac61c07e07aefd99adff5fb6) [#8943](https://github.com/npm/cli/pull/8943) `pacote@21.1.0`
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
* [`da63c79`](https://github.com/npm/cli/commit/da63c79be758fd9d3faa9f5edf962219c805c579) [#9420](https://github.com/npm/cli/pull/9420) dev dependency updates (@owlstronaut)
* [`5fc9bc0`](https://github.com/npm/cli/commit/5fc9bc0f202aadedd7b123394560047671afca6b) [#9393](https://github.com/npm/cli/pull/9393) sanitize newlines in flags table default and type values (#9393) (@reggi, @Copilot)
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
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
* [`63b9a7c`](https://github.com/npm/cli/commit/63b9a7c1a65361eb2e082d5f4aff267df52ba817) release 11.12.1 (@github-actions[bot])
* [`1afa738`](https://github.com/npm/cli/commit/1afa73868d05c67480c6fb211f38d8c165d49fc9) release 11.12.0 (@github-actions[bot])
* [`95fa7f4`](https://github.com/npm/cli/commit/95fa7f4d8f560bb9993141f2d2e55c8b8add02c8) [#9132](https://github.com/npm/cli/pull/9132) fix docs test snapshot (#9132) (@wraithgar)
* [`7e9d538`](https://github.com/npm/cli/commit/7e9d53841be2a944739b7e226647b68f68b5742e) [#9127](https://github.com/npm/cli/pull/9127) dev dependency updates (@wraithgar)
* [`920e5ed`](https://github.com/npm/cli/commit/920e5ed32d859041978e8b63e7af228ab12a4346) [#9127](https://github.com/npm/cli/pull/9127) test snapshots (@wraithgar)
* [`98ccf92`](https://github.com/npm/cli/commit/98ccf9246ea07b33c6813f34fc98e88889177297) [#9125](https://github.com/npm/cli/pull/9125) fix snap tests (@owlstronaut)
* [`8afa3bd`](https://github.com/npm/cli/commit/8afa3bd21461c0984caf1bcc2e486c4881bda516) release 11.11.1 (@github-actions[bot])
* [`d1996a7`](https://github.com/npm/cli/commit/d1996a7a79982f616600d134dbdcfb223cd0d81d) [#9060](https://github.com/npm/cli/pull/9060) dev dependency updates (@wraithgar)
* [`6cb34ca`](https://github.com/npm/cli/commit/6cb34cac9f4e4c6af7ecebc98fcfecd22a5e061d) release 11.11.0 (@github-actions[bot])
* [`c029cb2`](https://github.com/npm/cli/commit/c029cb2e5e8b6b61d1a7fd8c454da51a52cd650c) release 11.10.1 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`1598adb`](https://github.com/npm/cli/commit/1598adb05de18cb738c9a7fbcc63692059f46a17) [#8991](https://github.com/npm/cli/pull/8991) dev dependency updates (@wraithgar)
* [`21c3f02`](https://github.com/npm/cli/commit/21c3f02cdc5abca7d3f334dc97a45f6110f87c38) release 11.10.0 (@github-actions[bot])
* [`eb81df8`](https://github.com/npm/cli/commit/eb81df8f6acba2e8921f06983d3f8ba44ea79094) [#8973](https://github.com/npm/cli/pull/8973) dev dependency updates (@wraithgar)
* [`995e757`](https://github.com/npm/cli/commit/995e7579d66dfedbf20e3602b9523bc992dde139) [#8966](https://github.com/npm/cli/pull/8966) Clean up some todos, add tests for previously skipped blocks (@owlstronaut)
* [`417daa7`](https://github.com/npm/cli/commit/417daa72b09c5129e7390cd12743ef31bf3ddb83) release 11.9.0 (@github-actions[bot])
* [`4a82a8f`](https://github.com/npm/cli/commit/4a82a8f2e8873853ce3ef2f91c459ec9fd5aebde) [#8951](https://github.com/npm/cli/pull/8951) dev dependency updates (@wraithgar)
* [`f8d25cd`](https://github.com/npm/cli/commit/f8d25cd00132c8c7798a3f982a8da38ceed81e6b) release 11.8.0 (@github-actions[bot])
* [`8f599df`](https://github.com/npm/cli/commit/8f599df6a3888fd9a06a5c17748657cbb45076c3) [#8919](https://github.com/npm/cli/pull/8919) pin jsdom to 27.0.0 (@wraithgar)
* [`f4f1161`](https://github.com/npm/cli/commit/f4f1161520e6c2b4b9038d4bd723ccef235e4273) [#8919](https://github.com/npm/cli/pull/8919) dev dependency updates (@wraithgar)
* [`6d1db87`](https://github.com/npm/cli/commit/6d1db8724b1d0e5457a87bb31e62e43d566348ce) release 11.7.0 (@github-actions[bot])
* [`54929ce`](https://github.com/npm/cli/commit/54929cef8e26a4698234e5d2499a43b746569b12) [#8836](https://github.com/npm/cli/pull/8836) update baseline-browser-mapping (@watilde)
* [`5271485`](https://github.com/npm/cli/commit/52714855e62a196fb853872f5106803605ab0ec4) release 11.6.4 (@github-actions[bot])
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`32bdd83`](https://github.com/npm/cli/commit/32bdd833f83cf2a939ed56eba1972d5d729c677c) [#8723](https://github.com/npm/cli/pull/8723) fix package-lock (@wraithgar)
* [`4bff14b`](https://github.com/npm/cli/commit/4bff14b536f70b998b38ca984cbcab94a6c65bf9) [#8670](https://github.com/npm/cli/pull/8670) write tarball to testDir (#8670) (@wraithgar)
* [`679486b`](https://github.com/npm/cli/commit/679486b095f262d478daa21629d01f68f0240c9b) [#8672](https://github.com/npm/cli/pull/8672) fix lockfile (#8672) (@wraithgar)
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`b3409f4`](https://github.com/npm/cli/commit/b3409f480fef2b9885fd071c951ad8313de2754e) [#8659](https://github.com/npm/cli/pull/8659) dev dependency updates (@wraithgar)
* [`e8de81b`](https://github.com/npm/cli/commit/e8de81bc8202cfe1253676fd3f9785508e9051a6) [#8643](https://github.com/npm/cli/pull/8643) Add automatically generated annotation to dependencies.md (#8643) (@jsoref)
* [`67cfaf3`](https://github.com/npm/cli/commit/67cfaf35295fa2f5d7aa01d37c423c60ad7afeca) [#8627](https://github.com/npm/cli/pull/8627) fix spelling: different (#8627) (@jsoref)
* [`17ddc0d`](https://github.com/npm/cli/commit/17ddc0d6af1b56c4670b36b2c2705d31bdfa7749) [#8622](https://github.com/npm/cli/pull/8622) fix spelling (#8622) (@jsoref)
* [`c3e1790`](https://github.com/npm/cli/commit/c3e1790c98d5c7fabc92bcfb1a5fa170f4c7fc1d) [#8605](https://github.com/npm/cli/pull/8605) Remove reference to nonexistent calendar (#8605) (@jsoref)
* [`ac9143e`](https://github.com/npm/cli/commit/ac9143eafd46a89f707f525381b0ddb109b3beb6) [#8604](https://github.com/npm/cli/pull/8604) Improve link accessibility for screen reader users (#8604) (@jsoref)
* [`62d73e7`](https://github.com/npm/cli/commit/62d73e763fa2deffa629a4451a80b7e58032b8e0) [#8601](https://github.com/npm/cli/pull/8601) remove references to benchmarks workflow (#8601) (@jsoref)
* [`bb4b739`](https://github.com/npm/cli/commit/bb4b73953ada43285aa43dad626f48dafc53fea2) [#8598](https://github.com/npm/cli/pull/8598) remove stale comment (#8598) (@jsoref)
* [`f73e65d`](https://github.com/npm/cli/commit/f73e65d86d425bcf6b1693553e981bd05d2daeaf) [#8592](https://github.com/npm/cli/pull/8592) fix build url code for remark-github@12 (#8592) (@wraithgar)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
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
* [`3b30e0b`](https://github.com/npm/cli/commit/3b30e0b1f1ee9c7119d352dc4f9a27d53f24b988) release 11.6.0 (@github-actions[bot])
* [`d006583`](https://github.com/npm/cli/commit/d006583e20731e8ae55cee94c3b7bd23cbd6f2d0) release 11.5.2 (@github-actions[bot])
* [`da1d4d2`](https://github.com/npm/cli/commit/da1d4d299151781500ec854f10eb7e570696d506) release 11.5.1 (@github-actions[bot])
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])
* [`804a964`](https://github.com/npm/cli/commit/804a9646e41d3aaa11ed084aa0c9997b7375882f) [#8450](https://github.com/npm/cli/pull/8450) update devDependencies in lockfile (@wraithgar)
* [`643ae71`](https://github.com/npm/cli/commit/643ae7104e5246a8ea10bfbd4f98540945c8430d) [#8450](https://github.com/npm/cli/pull/8450) update mock-registry to use local arborist (@wraithgar)
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.1): `@npmcli/arborist@10.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/config-v11.0.0-pre.1): `@npmcli/config@11.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmdiff-v8.2.0-pre.0): `libnpmdiff@8.2.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmexec-v10.3.0-pre.0): `libnpmexec@10.3.0-pre.0`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmfund-v7.0.20-pre.1): `libnpmfund@7.0.20-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpack-v10.0.0-pre.1): `libnpmpack@10.0.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmpublish-v11.2.0-pre.1): `libnpmpublish@11.2.0-pre.1`
* [workspace](https://github.com/npm/cli/releases/tag/libnpmversion-v9.0.0-pre.1): `libnpmversion@9.0.0-pre.1`
</details>

<details><summary>arborist: 10.0.0-pre.1</summary>

## [10.0.0-pre.1](https://github.com/npm/cli/compare/arborist-v10.0.0-pre.0...arborist-v10.0.0-pre.1) (2026-05-27)
###   BREAKING CHANGES
* `npm shrinkwrap` is removed, the `shrinkwrap` config alias is removed, and `npm-shrinkwrap.json` is no longer loaded or honored at the project root or from inside dependency tarballs. Rename project-root `npm-shrinkwrap.json` to `package-lock.json`; use `bundleDependencies` if you need to ship a locked dependency tree.
### Features
* [`7068d42`](https://github.com/npm/cli/commit/7068d4286eb446fdb0ded08d15d7b5c3883d80f5) [#9360](https://github.com/npm/cli/pull/9360) Phase 1 of `allowScripts` opt-in install-script policy (#9360) (@JamieMagee)
* [`e0f12f7`](https://github.com/npm/cli/commit/e0f12f7e57aca36f71c9615bd971f427ed23e91a) [#9348](https://github.com/npm/cli/pull/9348) add allow-git/allow-file/allow-directory/allow-remote configs (@owlstronaut)
* [`b8655c7`](https://github.com/npm/cli/commit/b8655c7b12a3e299b159f879a2b1dfed71016ec2) [#9282](https://github.com/npm/cli/pull/9282) arborist: add lockfileString() for in-memory lockfile generation (@ljharb)
* [`2e5dcad`](https://github.com/npm/cli/commit/2e5dcad17a59ee9f69eeec27fc5b087b5b032df7) [#9262](https://github.com/npm/cli/pull/9262) drop npm-shrinkwrap.json support (@owlstronaut)
* [`4fcd352`](https://github.com/npm/cli/commit/4fcd352c553fdc0f13a87ad71ef66d7515c11886) [#9017](https://github.com/npm/cli/pull/9017) add :type(registry) to query selector syntax (#9017) (@wraithgar)
* [`7c038b7`](https://github.com/npm/cli/commit/7c038b75d4738635a3dd7140b63ead711de3d8d5) [#8968](https://github.com/npm/cli/pull/8968) add support for git-256 sha lengths (#8968) (@wraithgar)
* [`f5f6cf7`](https://github.com/npm/cli/commit/f5f6cf7c9fc9315b96eb29c5c7d5ab63ad3a9122) [#8943](https://github.com/npm/cli/pull/8943) config: add --allow-git (@wraithgar)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
* [`dac7ff6`](https://github.com/npm/cli/commit/dac7ff6d3d62422bb8dad136fcb8f48e99a4594a) [#9399](https://github.com/npm/cli/pull/9399) arborist: drop self-link materialization for undeclared workspaces (#9399) (@manzoorwanijk)
* [`b77850e`](https://github.com/npm/cli/commit/b77850e550a15c6205fdafc9e3843323b7135923) [#9395](https://github.com/npm/cli/pull/9395) skip hidden lockfile save on dry run (#9395) (@puneetdixit200, @puneetdixit200)
* [`822ce86`](https://github.com/npm/cli/commit/822ce861a056c599be38ddf58683179f4c9bd9c6) [#9343](https://github.com/npm/cli/pull/9343) arborist: skip lockfile entries for optional deps with incomplete manifests (#9343) (@ecanturk, @owlstronaut)
* [`2c9587e`](https://github.com/npm/cli/commit/2c9587e92b4490bcfb6e7cef6beb5ee6d9c9b730) [#9359](https://github.com/npm/cli/pull/9359) arborist: only forward Link overrides when a rule names a target dep (@manzoorwanijk)
* [`f550eb4`](https://github.com/npm/cli/commit/f550eb415de0aff83a5fa297850104f5390a6e30) [#9348](https://github.com/npm/cli/pull/9348) refactor #failureNode, adjust tests and safety (@owlstronaut)
* [`1f17566`](https://github.com/npm/cli/commit/1f17566ad90353b88e81fa1f8a4da5879d3ec7a3) [#9348](https://github.com/npm/cli/pull/9348) allow-remote=none does not block registry tarballs (@owlstronaut)
* [`81793ae`](https://github.com/npm/cli/commit/81793aeabcd862ed2be3d62b7864bf7ea34d0b2b) [#9332](https://github.com/npm/cli/pull/9332) arborist: skip extraneous fsChildren in linked-strategy reify (@manzoorwanijk)
* [`4c7f6ba`](https://github.com/npm/cli/commit/4c7f6baf70bba8200b4a9fe335fd66d3e8314523) [#9330](https://github.com/npm/cli/pull/9330) arborist: prune removed-workspace entries from package-lock.json (@manzoorwanijk)
* [`076551b`](https://github.com/npm/cli/commit/076551b8724741b0c615b26d44595348c3111dc2) [#9309](https://github.com/npm/cli/pull/9309) arborist: clean up orphan top-level symlinks in linked strategy (#9309) (@manzoorwanijk)
* [`32940e2`](https://github.com/npm/cli/commit/32940e231e34121aaf378309361b4b34fafdf939) [#9299](https://github.com/npm/cli/pull/9299) arborist: ignore hidden entries in global update (#9299) (@Grynn)
* [`0629fbf`](https://github.com/npm/cli/commit/0629fbf736eafcb555428d96bd86a69f8e791d70) [#9283](https://github.com/npm/cli/pull/9283) prefer existing tree nodes for peerOptional deps (#9249) (#9283) (@everett1992)
* [`bc32d94`](https://github.com/npm/cli/commit/bc32d94d3845078784603022e9c3504e1c5cde4a) [#9198](https://github.com/npm/cli/pull/9198) arborist: propagate overrides through Link nodes to targets (#9198) (@manzoorwanijk)
* [`1ab20c8`](https://github.com/npm/cli/commit/1ab20c8abd58cadc976429bb3b7b35cd6b627db4) [#9235](https://github.com/npm/cli/pull/9235) arborist: fix infinite loop with bundledDependencies and overrides (#9235) (@everett1992)
* [`0dc5585`](https://github.com/npm/cli/commit/0dc5585fa284f5c8cac36579983119304775c1c8) [#9167](https://github.com/npm/cli/pull/9167) arborist: handle `npm link` with install-strategy=linked (@manzoorwanijk)
* [`1d058b0`](https://github.com/npm/cli/commit/1d058b0cc7161fa728cba2020a265a81e0ec7cdf) [#9221](https://github.com/npm/cli/pull/9221) arborist: do not install inert optional extraneous shared dependencies (#9221) (@lovell)
* [`dcad8ec`](https://github.com/npm/cli/commit/dcad8ec1f830874d2ec1c3312f2c15d03109ce49) [#9206](https://github.com/npm/cli/pull/9206) pass _isRoot context where missing (#9206) (@wraithgar)
* [`21ea382`](https://github.com/npm/cli/commit/21ea382a60b3693ff6c44c81447caa5d0294169c) [#9110](https://github.com/npm/cli/pull/9110) arborist: resolve sibling override sets via common ancestor (#9110) (@manzoorwanijk)
* [`51365b1`](https://github.com/npm/cli/commit/51365b1b8a7924d082f00c27a4aedcb1f81110ec) [#9107](https://github.com/npm/cli/pull/9107) arborist: update store symlinks when hash changes in linked strategy (#9107) (@manzoorwanijk)
* [`8e0a731`](https://github.com/npm/cli/commit/8e0a7315d0719227c83ce9921c2bd56d201ad3ca) [#9108](https://github.com/npm/cli/pull/9108) arborist: skip linked actual tree diff in package-lock-only mode (#9108) (@manzoorwanijk)
* [`5b7c0cc`](https://github.com/npm/cli/commit/5b7c0cc83b6957a2478aff90b64343555919da84) [#9096](https://github.com/npm/cli/pull/9096) arborist: exclude store nodes from :root > * in linked strategy (#9096) (@manzoorwanijk)
* [`3b70a9d`](https://github.com/npm/cli/commit/3b70a9d1ade5aa5e7edebd0dbc84f0c5f6f202a9) [#9097](https://github.com/npm/cli/pull/9097) arborist: simplify rootDeclaredDeps initialization (#9097) (@manzoorwanijk)
* [`c7702d0`](https://github.com/npm/cli/commit/c7702d044907e56e06c769fa7a42ed1ed308f29a) [#9094](https://github.com/npm/cli/pull/9094) arborist: fix non-idempotent linked install with workspace projects (#9094) (@manzoorwanijk)
* [`1a744b5`](https://github.com/npm/cli/commit/1a744b5e030c82ec205ef2be1995ec8d36fba49b) [#9081](https://github.com/npm/cli/pull/9081) arborist: omit root dev deps in linked strategy when shared with workspaces (#9081) (@manzoorwanijk)
* [`ff51827`](https://github.com/npm/cli/commit/ff51827ba603b069afababf0292016ffb8841bd2) [#9076](https://github.com/npm/cli/pull/9076) arborist: do not hoist undeclared workspaces in linked strategy (#9076) (@manzoorwanijk)
* [`1206f8b`](https://github.com/npm/cli/commit/1206f8b97b5a57df00518eecb7b9aa7ab24ef73c) [#9069](https://github.com/npm/cli/pull/9069) consolidate isolated node/link attributes (#9069) (@wraithgar)
* [`a774fb7`](https://github.com/npm/cli/commit/a774fb77aadf01b46c13fe3d48bc2393fc6ef0ff) [#9066](https://github.com/npm/cli/pull/9066) arborist: respect --omit flag in linked install strategy (#9066) (@manzoorwanijk)
* [`8614b2a`](https://github.com/npm/cli/commit/8614b2af5c912e1ab293bdc41f9b8ae189cfa901) [#9031](https://github.com/npm/cli/pull/9031) arborist: avoid full reinstall on subsequent linked strategy runs (#9031) (@manzoorwanijk)
* [`16fbe13`](https://github.com/npm/cli/commit/16fbe135b86908426ffb8d4caa73e66cd7a679b1) [#9030](https://github.com/npm/cli/pull/9030) resolve relative file: dependencies correctly with install-strategy=linked (#9030) (@manzoorwanijk)
* [`983742b`](https://github.com/npm/cli/commit/983742b7ed70673b31f4607836fd156bf2d22f1d) [#9055](https://github.com/npm/cli/pull/9055) isolated mode code cleanup (#9055) (@wraithgar)
* [`a29aeee`](https://github.com/npm/cli/commit/a29aeee18f3ddc2348a8e00787d237c874642789) [#9028](https://github.com/npm/cli/pull/9028) arborist: retry bin-links on Windows EPERM (#9028) (@manzoorwanijk)
* [`10d5302`](https://github.com/npm/cli/commit/10d530242c7d893c562456013bb1c5104ca3e3b8) [#9051](https://github.com/npm/cli/pull/9051) arborist: unwrap Link nodes in legacyPeerDeps for linked strategy (#9051) (@manzoorwanijk)
* [`94bfef5`](https://github.com/npm/cli/commit/94bfef5a9f1a841840deee77cd961c90fbed5f3c) [#9044](https://github.com/npm/cli/pull/9044) audit: exclude locally linked packages from vulnerability audit  (#9044) (@lucas-gomes-santana)
* [`26fa40e`](https://github.com/npm/cli/commit/26fa40eeafdbbb616d48fe254c92544cb13fba60) [#9041](https://github.com/npm/cli/pull/9041) fix workspace-filtered install with linked strategy (@owlstronaut)
* [`880ecb7`](https://github.com/npm/cli/commit/880ecb786d83e7bc95b1ed75660769e2af253579) [#9013](https://github.com/npm/cli/pull/9013) arborist: skip postinstall on store links in linked strategy (#9013) (@manzoorwanijk)
* [`07e6edd`](https://github.com/npm/cli/commit/07e6edd9d0f21ab65bd98e444598ddcb50b66551) [#9025](https://github.com/npm/cli/pull/9025) save libc field to package-lock.json (@owlstronaut)
* [`a2154cd`](https://github.com/npm/cli/commit/a2154cd91370c9c611cc19c943d00c3d0bbfa4ef) [#8996](https://github.com/npm/cli/pull/8996) linked strategy fixes for scoped packages, aliases, and peer deps (#8996) (@manzoorwanijk)
* [`bb135cc`](https://github.com/npm/cli/commit/bb135cc8998b8b936f2cb412ec3303ae02d6920c) [#8981](https://github.com/npm/cli/pull/8981) arborist: fix `peerOptional` dependency resolution in `buildIdealTree` (#8981) (@Saibamen, @cursoragent)
* [`0765289`](https://github.com/npm/cli/commit/07652896c44bd21a585255151f90f171eefbb00e) [#8721](https://github.com/npm/cli/pull/8721) handle ENOTEMPTY errors in moveFile (@keegancsmith)
* [`b118364`](https://github.com/npm/cli/commit/b1183644faea618ee36af513c5bfc3387ada0f7e) [#8760](https://github.com/npm/cli/pull/8760) undefined override set conflicts shouldn't error (@owlstronaut)
* [`3225fa3`](https://github.com/npm/cli/commit/3225fa3200cb0217bdd0735bba390268f8362532) [#8737](https://github.com/npm/cli/pull/8737) fix usage of path of custom registry (#8737) (@flj2mu2)
* [`e9f0418`](https://github.com/npm/cli/commit/e9f0418250aa47216e449d3a63b8607e530ed27f) [#8689](https://github.com/npm/cli/pull/8689) arborist: improve override conflict detection with semantic comparison (#8689) (@Artur-)
* [`05319f0`](https://github.com/npm/cli/commit/05319f0cc3fee6680e4f59a13ed9420785cf673b) [#8677](https://github.com/npm/cli/pull/8677) code cleanup (#8677) (@wraithgar)
* [`49a4eef`](https://github.com/npm/cli/commit/49a4eefd613dbb60bcff3dac39129f70586d3cff) [#8676](https://github.com/npm/cli/pull/8676) use look behind regex for trailing slash stripping (#8676) (@wraithgar)
* [`b1aee62`](https://github.com/npm/cli/commit/b1aee62082d7b25ec07f64e906afd76840907fbd) [#8645](https://github.com/npm/cli/pull/8645) dep flag calculation (#8645) (@liamcmitchell)
* [`0a8b8c2`](https://github.com/npm/cli/commit/0a8b8c2ba37872b08a24bcf067f6da34d718f6d8) [#8621](https://github.com/npm/cli/pull/8621) typo bugs and other spelling fixes (#8621) (@jsoref)
* [`54fd27f`](https://github.com/npm/cli/commit/54fd27f9f6af54ca9fd11165aafbc8a13a38f39e) [#8602](https://github.com/npm/cli/pull/8602) refactor node.ideallyInert to node.inert (#8602) (@liamcmitchell)
* [`13d8df6`](https://github.com/npm/cli/commit/13d8df64e78dc13c49ab0607b252de1d54f0122a) [#8537](https://github.com/npm/cli/pull/8537) optional set calculation (#8537) (@liamcmitchell)
* [`60aa94b`](https://github.com/npm/cli/commit/60aa94b0379b2f4491c5d6857c1cff3036d9a3a9) [#8576](https://github.com/npm/cli/pull/8576) attach path to json parse error (@wraithgar)
* [`1eedf82`](https://github.com/npm/cli/commit/1eedf82f2a36df193a51dca2c07fdc82dcb18a68) [#8576](https://github.com/npm/cli/pull/8576) use @npmcli/package-json to parse package.json (@wraithgar)
* [`f6c868d`](https://github.com/npm/cli/commit/f6c868d8a2df4d2961983d4e52095d6e7551e9cb) [#8566](https://github.com/npm/cli/pull/8566) calculate omit in diff (#8566) (@liamcmitchell, @liamcmitchell)
* [`d389614`](https://github.com/npm/cli/commit/d3896147c61b06d6d39a55bbb609f878548e0107) [#8579](https://github.com/npm/cli/pull/8579) corrects peer dependency flag propagation (@owlstronaut)
* [`208c06e`](https://github.com/npm/cli/commit/208c06e91a187b03d6bdd75bff4e4285b365750c) [#8448](https://github.com/npm/cli/pull/8448) peer edge crash due to no parent or detached node (#8448) (@milaninfy)
* [`3b54e9c`](https://github.com/npm/cli/commit/3b54e9c59c6dba342d2931cce6458a755e55960e) [#8534](https://github.com/npm/cli/pull/8534) installLinks works with transitive external file dependencies (#8534) (@owlstronaut)
* [`ed71acb`](https://github.com/npm/cli/commit/ed71acb89fc3883e735987cc9be77efc2daff26a) [#8473](https://github.com/npm/cli/pull/8473) arborist: #8472 Keeps the registry protocol when modifying resolve URL (#8473) (@Jeepsboucher, Jean-Philippe Boucher)
### Dependencies
* [`f951820`](https://github.com/npm/cli/commit/f95182001771ad5d52dfc57934d7ce1b97055b70) [#8919](https://github.com/npm/cli/pull/8919) `common-ancestor-path@2.0.0`
* [`f963223`](https://github.com/npm/cli/commit/f96322350e497f90a54c8a1cfd952b3329f00492) [#8770](https://github.com/npm/cli/pull/8770) `proggy@4.0.0`
* [`f51e4aa`](https://github.com/npm/cli/commit/f51e4aaf06ac6703abe053a95fe25b8efca3c527) [#8770](https://github.com/npm/cli/pull/8770) `nopt@9.0.0`
* [`2d15040`](https://github.com/npm/cli/commit/2d15040390697cd78c9a9db3f0dbafab51a6e3e9) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/query@5.0.0`
* [`58650dc`](https://github.com/npm/cli/commit/58650dc089c74d090c51d1cb2f269f2d605dcca0) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/fs@5.0.0`
* [`8cc9f70`](https://github.com/npm/cli/commit/8cc9f70c2769f068ea0ef77a602162cdd949998e) [#8723](https://github.com/npm/cli/pull/8723) `ssri@13.0.0`
* [`59b3c6a`](https://github.com/npm/cli/commit/59b3c6adf5fb7e5c8e0f990ade7417677270057a) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/redact@4.0.0`
* [`6cb77df`](https://github.com/npm/cli/commit/6cb77df37989cb7c165cb2c35c735fb12dc1385a) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/installed-package-contents@4.0.0`
* [`05ac7a7`](https://github.com/npm/cli/commit/05ac7a7ea2a4d258658537a19ba350e07df34fda) [#8723](https://github.com/npm/cli/pull/8723) `proc-log@6.0.0`
* [`0a74f6d`](https://github.com/npm/cli/commit/0a74f6d1d8643f3a089f6e63502df77e6e3038ff) [#8723](https://github.com/npm/cli/pull/8723) `bin-links@6.0.0`
* [`041b9b2`](https://github.com/npm/cli/commit/041b9b29b30c539c5bf8b8cd26ea2202f94862b3) [#8723](https://github.com/npm/cli/pull/8723) `parse-conflict-json@5.0.1`
* [`a1b0fea`](https://github.com/npm/cli/commit/a1b0feac64ff681b2aec6938eb5136f5e177a07a) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/name-from-folder@4.0.0`
* [`3404dca`](https://github.com/npm/cli/commit/3404dca3d986d1bf0de3e74cf8b61856778711c6) [#8723](https://github.com/npm/cli/pull/8723) `npm-install-checks@8.0.0`
* [`542fcf3`](https://github.com/npm/cli/commit/542fcf3eee92cc41e86838c97c4036a97d749155) [#8723](https://github.com/npm/cli/pull/8723) `@npmcli/node-gyp@5.0.0`
* [`566f1b7`](https://github.com/npm/cli/commit/566f1b7b487ad80604c61162ddde769d5ac2b241) [#8576](https://github.com/npm/cli/pull/8576) `minimatch@10.0.3`
* [`ea7ca5f`](https://github.com/npm/cli/commit/ea7ca5f49d6cab81e9ce3d412963c48acd87b7c0) [#8576](https://github.com/npm/cli/pull/8576) `lru-cache@11.2.1`
* [`bf6b686`](https://github.com/npm/cli/commit/bf6b6862731e03002cc6fa3b86b6f090df46b009) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-arg@13.0.0`
* [`9392488`](https://github.com/npm/cli/commit/9392488d6036dfc9696e29cc8d463335517974ca) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-manifest@11.0.1`
* [`633c4ed`](https://github.com/npm/cli/commit/633c4ed76ea13b8dfb5837a397e984e44cccb820) [#8576](https://github.com/npm/cli/pull/8576) `hosted-git-info@9.0.0`
* [`1149971`](https://github.com/npm/cli/commit/11499711e4c10e4ddb97bf3e1ef1652d151894fb) [#8576](https://github.com/npm/cli/pull/8576) `npm-registry-fetch@19.0.0`
* [`6221e27`](https://github.com/npm/cli/commit/6221e277b4b841df09225b4d72f9eda70db1f15a) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/metavuln-calculator@9.0.2`
* [`da81a37`](https://github.com/npm/cli/commit/da81a3702fdf7ea2dc7223fc6ece4c7a19e32ad1) [#8576](https://github.com/npm/cli/pull/8576) `cacache@20.0.1`
* [`6b4c5f9`](https://github.com/npm/cli/commit/6b4c5f92865230ed9a260cd3e8486bf3991120eb) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/run-script@10.0.0`
* [`b6bb9ae`](https://github.com/npm/cli/commit/b6bb9aea4134c47f0593c111a734eda12ec3c20d) [#8576](https://github.com/npm/cli/pull/8576) `pacote@21.0.3`
* [`1b4433f`](https://github.com/npm/cli/commit/1b4433fdb85623e019a6194cb01ff85c7f64ccad) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/map-workspaces@5.0.0`
* [`ceae674`](https://github.com/npm/cli/commit/ceae674c32a080b81e62d79003c2d537d7ca93d2) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/package-json@7.0.1`
* [`4f37534`](https://github.com/npm/cli/commit/4f37534300553e9ddfbc413c14d1ef15b02b46f2) [#8576](https://github.com/npm/cli/pull/8576) remove read-package-json-fast
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`b61281d`](https://github.com/npm/cli/commit/b61281da2d4e0a60a93f7138392bfc5893595705) [#9349](https://github.com/npm/cli/pull/9349) change test wording to not collide with tap (#9349) (@owlstronaut)
* [`1afa738`](https://github.com/npm/cli/commit/1afa73868d05c67480c6fb211f38d8c165d49fc9) release 11.12.0 (@github-actions[bot])
* [`8afa3bd`](https://github.com/npm/cli/commit/8afa3bd21461c0984caf1bcc2e486c4881bda516) release 11.11.1 (@github-actions[bot])
* [`6cb34ca`](https://github.com/npm/cli/commit/6cb34cac9f4e4c6af7ecebc98fcfecd22a5e061d) release 11.11.0 (@github-actions[bot])
* [`c029cb2`](https://github.com/npm/cli/commit/c029cb2e5e8b6b61d1a7fd8c454da51a52cd650c) release 11.10.1 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`21c3f02`](https://github.com/npm/cli/commit/21c3f02cdc5abca7d3f334dc97a45f6110f87c38) release 11.10.0 (@github-actions[bot])
* [`417daa7`](https://github.com/npm/cli/commit/417daa72b09c5129e7390cd12743ef31bf3ddb83) release 11.9.0 (@github-actions[bot])
* [`f8d25cd`](https://github.com/npm/cli/commit/f8d25cd00132c8c7798a3f982a8da38ceed81e6b) release 11.8.0 (@github-actions[bot])
* [`6d1db87`](https://github.com/npm/cli/commit/6d1db8724b1d0e5457a87bb31e62e43d566348ce) release 11.7.0 (@github-actions[bot])
* [`5271485`](https://github.com/npm/cli/commit/52714855e62a196fb853872f5106803605ab0ec4) release 11.6.4 (@github-actions[bot])
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`180e9f7`](https://github.com/npm/cli/commit/180e9f709d10c959556c19205bb3636220bed9c7) [#8610](https://github.com/npm/cli/pull/8610) fix spelling in workspaces/arborist (#8610) (@jsoref)
* [`91393de`](https://github.com/npm/cli/commit/91393deaf71bad084bb1d2aa868d5f895cc5f103) [#8599](https://github.com/npm/cli/pull/8599) Update references for arborist to cli (#8599) (@jsoref)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`4059dfa`](https://github.com/npm/cli/commit/4059dfa47b0afc982703d8d83fce5574fdc6308f) [#8576](https://github.com/npm/cli/pull/8576) properly use arborist and cache in test (@owlstronaut)
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`3b30e0b`](https://github.com/npm/cli/commit/3b30e0b1f1ee9c7119d352dc4f9a27d53f24b988) release 11.6.0 (@github-actions[bot])
* [`619d43e`](https://github.com/npm/cli/commit/619d43e54ef7408d4ee6b38a776262b5132829b6) [#8540](https://github.com/npm/cli/pull/8540) fix pruner and reify tests for optional peer deps (#8540) (@liamcmitchell, @liamcmitchell)
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])
</details>

<details><summary>config: 11.0.0-pre.1</summary>

## [11.0.0-pre.1](https://github.com/npm/cli/compare/config-v11.0.0-pre.0...config-v11.0.0-pre.1) (2026-05-27)
###   BREAKING CHANGES
* unknown configs in .npmrc, unknown CLI flags, abbreviated flags, and single-hyphen multi-char shorthands now throw instead of warning.
* `npm shrinkwrap` is removed, the `shrinkwrap` config alias is removed, and `npm-shrinkwrap.json` is no longer loaded or honored at the project root or from inside dependency tarballs. Rename project-root `npm-shrinkwrap.json` to `package-lock.json`; use `bundleDependencies` if you need to ship a locked dependency tree.
### Features
* [`f2e4a28`](https://github.com/npm/cli/commit/f2e4a285ec5ed43055462a47db6d330758a16e64) [#9351](https://github.com/npm/cli/pull/9351) add a global npmignore file (#9351) (@ljharb)
* [`c9be2d1`](https://github.com/npm/cli/commit/c9be2d1efadd353e743bcebd52faaa5aa64e2fc0) [#9153](https://github.com/npm/cli/pull/9153) publish --access=private alias for restricted (#9153) (@reggi, @Copilot)
* [`7068d42`](https://github.com/npm/cli/commit/7068d4286eb446fdb0ded08d15d7b5c3883d80f5) [#9360](https://github.com/npm/cli/pull/9360) Phase 1 of `allowScripts` opt-in install-script policy (#9360) (@JamieMagee)
* [`979518d`](https://github.com/npm/cli/commit/979518dd198b9f2beb788c6c3cdcd1e055b03d22) [#9276](https://github.com/npm/cli/pull/9276) error on unknown configs, flags, and abbreviations (#9276) (@owlstronaut)
* [`916cb4b`](https://github.com/npm/cli/commit/916cb4b262df1d188ce7644e916b138fbc78c4e7) [#9287](https://github.com/npm/cli/pull/9287) add allow-directory, allow-file, and allow-remote (#9287) (@wraithgar)
* [`2e5dcad`](https://github.com/npm/cli/commit/2e5dcad17a59ee9f69eeec27fc5b087b5b032df7) [#9262](https://github.com/npm/cli/pull/9262) drop npm-shrinkwrap.json support (@owlstronaut)
* [`8eff5fb`](https://github.com/npm/cli/commit/8eff5fb31afc996c71c8f159defa324cb86dfc5a) [#9049](https://github.com/npm/cli/pull/9049) audit: add --include-attestations flag to output sigstore bundles (#9049) (@mitchdenny)
* [`cf56a1e`](https://github.com/npm/cli/commit/cf56a1e4df9c8ae7b7e9752437d827a183e4040e) [#8899](https://github.com/npm/cli/pull/8899) npm trust, per-command config (@reggi)
* [`cf56a1e`](https://github.com/npm/cli/commit/cf56a1e4df9c8ae7b7e9752437d827a183e4040e) [#8899](https://github.com/npm/cli/pull/8899) npm trust (@reggi)
* [`66d6e11`](https://github.com/npm/cli/commit/66d6e11f3ecdbc823ede24ef83257f3bb6e69d46) [#8965](https://github.com/npm/cli/pull/8965) add min-release-age (#8965) (@wraithgar)
* [`f5f6cf7`](https://github.com/npm/cli/commit/f5f6cf7c9fc9315b96eb29c5c7d5ab63ad3a9122) [#8943](https://github.com/npm/cli/pull/8943) config: add --allow-git (@wraithgar)
* [`5a444d5`](https://github.com/npm/cli/commit/5a444d57f1068efddc71ddfd131a949632524e00) [#8828](https://github.com/npm/cli/pull/8828) export environment config variable names (Max Black)
* [`bdcc10d`](https://github.com/npm/cli/commit/bdcc10d9f848940987b3d326ccd4673fab2bcfef) [#8359](https://github.com/npm/cli/pull/8359) add support for optional env var replacements in .npmrc (#8359) (@aczekajski, @owlstronaut)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
* [`18ebb0f`](https://github.com/npm/cli/commit/18ebb0f8b2370d9a4fd3df0a5b89ec6a8036bb81) [#9368](https://github.com/npm/cli/pull/9368) min-release-age=0 doesn't filter, honor cross-source precedence (@owlstronaut)
* [`ca585c8`](https://github.com/npm/cli/commit/ca585c80dee759fedb85c5c20f9dd3ea8d017be4) [#9368](https://github.com/npm/cli/pull/9368) allow min-release-age in npmrc to coexist with --before (@raazkhnl)
* [`6628d05`](https://github.com/npm/cli/commit/6628d0524b460c26cefc93b1ec3e901abdcb86f4) [#9285](https://github.com/npm/cli/pull/9285) config: preserve min-release-age after flattening (@lawrence3699)
* [`596706a`](https://github.com/npm/cli/commit/596706a3d10100587e3751d860b4cfcc59342d2f) [#9148](https://github.com/npm/cli/pull/9148) revert prefer-offline/prefer-online exclusivity (#9129) (@owlstronaut)
* [`d273380`](https://github.com/npm/cli/commit/d2733809b820a9a9dc3a5453b55f2690afee6066) [#9129](https://github.com/npm/cli/pull/9129) config: make prefer-offline and prefer-online exclusive (#9129) (@mvanhorn)
* [`e839b07`](https://github.com/npm/cli/commit/e839b07b1a512a98e2266ff85ff79774d9385d9d) [#9023](https://github.com/npm/cli/pull/9023) clear exclusive param siblings when setting from CLI (#9023) (@umeshmore45)
* [`9fac412`](https://github.com/npm/cli/commit/9fac412105c4bbd116cffb6e27dda54a2adecf33) [#8995](https://github.com/npm/cli/pull/8995) improve unknown config warning with .npmrc section hint (#8995) (@umeshmore45)
* [`4ebb831`](https://github.com/npm/cli/commit/4ebb831d93f13cc0b980754bf36abb2982b131f7) [#8839](https://github.com/npm/cli/pull/8839) updates hints to use cli paradigm (@owlstronaut)
* [`958b10e`](https://github.com/npm/cli/commit/958b10e52f442f73796a92c7bbb7d2808bb5bbe5) [#8761](https://github.com/npm/cli/pull/8761) move config.list to a getter (#8761) (@wraithgar)
* [`c6242d9`](https://github.com/npm/cli/commit/c6242d92e5227e0a772d9cfe474ea57776af79e0) [#8706](https://github.com/npm/cli/pull/8706) change npm profile to create tokens with GAT support (#8706) (@owlstronaut, @wraithgar)
* [`5b4a7fc`](https://github.com/npm/cli/commit/5b4a7fc594e23dbdd5acab8df7bd195992383d5f) [#8650](https://github.com/npm/cli/pull/8650) handle missing node-gyp gracefully in @npmcli/config definitions (@owlstronaut)
* [`9197995`](https://github.com/npm/cli/commit/9197995ef0b760738454f2d255c0683d0731b24c) [#8619](https://github.com/npm/cli/pull/8619) spelling (#8619) (@jsoref)
* [`7f66f0a`](https://github.com/npm/cli/commit/7f66f0ae8fb84f567fe83a9a5738d06c7fe8fb54) [#8447](https://github.com/npm/cli/pull/8447) add better hint for `before` and clean up description (@wraithgar)
### Documentation
* [`1fde042`](https://github.com/npm/cli/commit/1fde04261c899fd03753e2a90698774e41943887) [#8640](https://github.com/npm/cli/pull/8640) rewrap markdown (#8640) (@jsoref)
* [`7a09902`](https://github.com/npm/cli/commit/7a099029dbeeeab821498b9b462abce1269461f4) [#8582](https://github.com/npm/cli/pull/8582) bring back certfile (#8582) (@jenseng)
### Dependencies
* [`f51e4aa`](https://github.com/npm/cli/commit/f51e4aaf06ac6703abe053a95fe25b8efca3c527) [#8770](https://github.com/npm/cli/pull/8770) `nopt@9.0.0`
* [`e49286e`](https://github.com/npm/cli/commit/e49286e2189dfe1604d957ccc415038957a64d19) [#8723](https://github.com/npm/cli/pull/8723) `ini@5.0.0`
* [`05ac7a7`](https://github.com/npm/cli/commit/05ac7a7ea2a4d258658537a19ba350e07df34fda) [#8723](https://github.com/npm/cli/pull/8723) `proc-log@6.0.0`
* [`1b4433f`](https://github.com/npm/cli/commit/1b4433fdb85623e019a6194cb01ff85c7f64ccad) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/map-workspaces@5.0.0`
* [`ceae674`](https://github.com/npm/cli/commit/ceae674c32a080b81e62d79003c2d537d7ca93d2) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/package-json@7.0.1`
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`63b9a7c`](https://github.com/npm/cli/commit/63b9a7c1a65361eb2e082d5f4aff267df52ba817) release 11.12.1 (@github-actions[bot])
* [`1afa738`](https://github.com/npm/cli/commit/1afa73868d05c67480c6fb211f38d8c165d49fc9) release 11.12.0 (@github-actions[bot])
* [`c029cb2`](https://github.com/npm/cli/commit/c029cb2e5e8b6b61d1a7fd8c454da51a52cd650c) release 11.10.1 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`21c3f02`](https://github.com/npm/cli/commit/21c3f02cdc5abca7d3f334dc97a45f6110f87c38) release 11.10.0 (@github-actions[bot])
* [`417daa7`](https://github.com/npm/cli/commit/417daa72b09c5129e7390cd12743ef31bf3ddb83) release 11.9.0 (@github-actions[bot])
* [`f8d25cd`](https://github.com/npm/cli/commit/f8d25cd00132c8c7798a3f982a8da38ceed81e6b) release 11.8.0 (@github-actions[bot])
* [`6d1db87`](https://github.com/npm/cli/commit/6d1db8724b1d0e5457a87bb31e62e43d566348ce) release 11.7.0 (@github-actions[bot])
* [`5271485`](https://github.com/npm/cli/commit/52714855e62a196fb853872f5106803605ab0ec4) release 11.6.4 (@github-actions[bot])
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`8e5d204`](https://github.com/npm/cli/commit/8e5d2042b041d637db14670f22cb7e866dd00479) [#8626](https://github.com/npm/cli/pull/8626) fix spelling: different (#8626) (@jsoref)
* [`7455fc0`](https://github.com/npm/cli/commit/7455fc01fffa8419dda0f01e2480ab860b81b56f) [#8608](https://github.com/npm/cli/pull/8608) Fix spelling in workspaces/config (#8608) (@jsoref)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`3b30e0b`](https://github.com/npm/cli/commit/3b30e0b1f1ee9c7119d352dc4f9a27d53f24b988) release 11.6.0 (@github-actions[bot])
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])
</details>

<details><summary>libnpmdiff: 8.2.0-pre.0</summary>

## [8.2.0-pre.0](https://github.com/npm/cli/compare/libnpmdiff-v8.1.6-pre.0...libnpmdiff-v8.2.0-pre.0) (2026-05-27)
### Features
* [`f5f6cf7`](https://github.com/npm/cli/commit/f5f6cf7c9fc9315b96eb29c5c7d5ab63ad3a9122) [#8943](https://github.com/npm/cli/pull/8943) config: add --allow-git (@wraithgar)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
### Documentation
* [`268e4f8`](https://github.com/npm/cli/commit/268e4f8ae9845991e15cccd7bcaf2545af766898) [#8642](https://github.com/npm/cli/pull/8642) rewrap markdown (#8642) (@jsoref)
### Dependencies
* [`9d77b84`](https://github.com/npm/cli/commit/9d77b84ce961a28941af8b1a597a03e308828cd4) [#8770](https://github.com/npm/cli/pull/8770) `@npmcli/installed-package-contents@4.0.0`
* [`849dcb6`](https://github.com/npm/cli/commit/849dcb6dc22a16f01869ba9c6bf9146143000b25) [#8589](https://github.com/npm/cli/pull/8589) `tar@7.5.1` (#8589)
* [`ef87ec6`](https://github.com/npm/cli/commit/ef87ec6612fe5924d3466967aa7e104f3f98bf15) [#8576](https://github.com/npm/cli/pull/8576) `diff@8.0.2`
* [`566f1b7`](https://github.com/npm/cli/commit/566f1b7b487ad80604c61162ddde769d5ac2b241) [#8576](https://github.com/npm/cli/pull/8576) `minimatch@10.0.3`
* [`bf6b686`](https://github.com/npm/cli/commit/bf6b6862731e03002cc6fa3b86b6f090df46b009) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-arg@13.0.0`
* [`b6bb9ae`](https://github.com/npm/cli/commit/b6bb9aea4134c47f0593c111a734eda12ec3c20d) [#8576](https://github.com/npm/cli/pull/8576) `pacote@21.0.3`
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`1afa738`](https://github.com/npm/cli/commit/1afa73868d05c67480c6fb211f38d8c165d49fc9) release 11.12.0 (@github-actions[bot])
* [`8afa3bd`](https://github.com/npm/cli/commit/8afa3bd21461c0984caf1bcc2e486c4881bda516) release 11.11.1 (@github-actions[bot])
* [`6cb34ca`](https://github.com/npm/cli/commit/6cb34cac9f4e4c6af7ecebc98fcfecd22a5e061d) release 11.11.0 (@github-actions[bot])
* [`c029cb2`](https://github.com/npm/cli/commit/c029cb2e5e8b6b61d1a7fd8c454da51a52cd650c) release 11.10.1 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`21c3f02`](https://github.com/npm/cli/commit/21c3f02cdc5abca7d3f334dc97a45f6110f87c38) release 11.10.0 (@github-actions[bot])
* [`417daa7`](https://github.com/npm/cli/commit/417daa72b09c5129e7390cd12743ef31bf3ddb83) release 11.9.0 (@github-actions[bot])
* [`f8d25cd`](https://github.com/npm/cli/commit/f8d25cd00132c8c7798a3f982a8da38ceed81e6b) release 11.8.0 (@github-actions[bot])
* [`6d1db87`](https://github.com/npm/cli/commit/6d1db8724b1d0e5457a87bb31e62e43d566348ce) release 11.7.0 (@github-actions[bot])
* [`5271485`](https://github.com/npm/cli/commit/52714855e62a196fb853872f5106803605ab0ec4) release 11.6.4 (@github-actions[bot])
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`6c4c387`](https://github.com/npm/cli/commit/6c4c387ea9f8900a1e1e70e661be1ec54b073aea) [#8609](https://github.com/npm/cli/pull/8609) Fix spelling in workspaces/libnpmdiff (#8609) (@jsoref)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`3b30e0b`](https://github.com/npm/cli/commit/3b30e0b1f1ee9c7119d352dc4f9a27d53f24b988) release 11.6.0 (@github-actions[bot])
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.1): `@npmcli/arborist@10.0.0-pre.1`
</details>

<details><summary>libnpmexec: 10.3.0-pre.0</summary>

## [10.3.0-pre.0](https://github.com/npm/cli/compare/libnpmexec-v10.2.6-pre.0...libnpmexec-v10.3.0-pre.0) (2026-05-27)
### Features
* [`f5f6cf7`](https://github.com/npm/cli/commit/f5f6cf7c9fc9315b96eb29c5c7d5ab63ad3a9122) [#8943](https://github.com/npm/cli/pull/8943) config: add --allow-git (@wraithgar)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
* [`6237783`](https://github.com/npm/cli/commit/62377832db5f91ae50856ef871c16e3d07c074e2) [#9408](https://github.com/npm/cli/pull/9408) exempt local project introspection from allow-directory (@owlstronaut)
* [`e9b0157`](https://github.com/npm/cli/commit/e9b0157b367aef184e7c4e99b90d9fcb8f0bff54) [#9255](https://github.com/npm/cli/pull/9255) libnpmexec: skip redundant reify for cached directory specs (#9255) (@manzoorwanijk)
* [`cf88236`](https://github.com/npm/cli/commit/cf8823608afe4229cb05f8b6c29890a6bda64502) [#9008](https://github.com/npm/cli/pull/9008) use @gar/promise-retry instead of promise-retry (@wraithgar)
* [`3439a89`](https://github.com/npm/cli/commit/3439a89d58a25deac08650da53157595e8b8edfb) [#8733](https://github.com/npm/cli/pull/8733) libnpmexec: fix lock compromise logic (#8733) (@jenseng)
* [`d62c5fe`](https://github.com/npm/cli/commit/d62c5fe9a7c6b180019cd4d62e7963f232038ebb) [#8625](https://github.com/npm/cli/pull/8625) spelling in workspaces/libnpmexec (#8625) (@jsoref)
* [`1eedf82`](https://github.com/npm/cli/commit/1eedf82f2a36df193a51dca2c07fdc82dcb18a68) [#8576](https://github.com/npm/cli/pull/8576) use @npmcli/package-json to parse package.json (@wraithgar)
* [`7949cff`](https://github.com/npm/cli/commit/7949cff04d28e2344461a18ef30bf36fc76a091d) [#8577](https://github.com/npm/cli/pull/8577) libnpmexec: improve withLock stability (#8577) (@jenseng)
* [`5db81c3`](https://github.com/npm/cli/commit/5db81c350654dbbe2e1442d623efada9a24e04f1) [#8512](https://github.com/npm/cli/pull/8512) allow concurrent non-local npx calls (#8512) (@jenseng, @wraithgar)
### Dependencies
* [`60f332c`](https://github.com/npm/cli/commit/60f332c9df28e736f510ef8ac1f207175687dcad) [#9008](https://github.com/npm/cli/pull/9008) remove promise-retry
* [`cb8b9c7`](https://github.com/npm/cli/commit/cb8b9c7a45d81883ada7891f492afbf998574d10) [#9008](https://github.com/npm/cli/pull/9008) add `@gar/promise-retry@1.0.0`
* [`e2ac092`](https://github.com/npm/cli/commit/e2ac092fdab0ccbf3b20abbac7ff1ebb7cda9a88) [#8770](https://github.com/npm/cli/pull/8770) `read@5.0.1`
* [`05ac7a7`](https://github.com/npm/cli/commit/05ac7a7ea2a4d258658537a19ba350e07df34fda) [#8723](https://github.com/npm/cli/pull/8723) `proc-log@6.0.0`
* [`0a74f6d`](https://github.com/npm/cli/commit/0a74f6d1d8643f3a089f6e63502df77e6e3038ff) [#8723](https://github.com/npm/cli/pull/8723) `bin-links@6.0.0`
* [`bf6b686`](https://github.com/npm/cli/commit/bf6b6862731e03002cc6fa3b86b6f090df46b009) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-arg@13.0.0`
* [`6b4c5f9`](https://github.com/npm/cli/commit/6b4c5f92865230ed9a260cd3e8486bf3991120eb) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/run-script@10.0.0`
* [`b6bb9ae`](https://github.com/npm/cli/commit/b6bb9aea4134c47f0593c111a734eda12ec3c20d) [#8576](https://github.com/npm/cli/pull/8576) `pacote@21.0.3`
* [`ceae674`](https://github.com/npm/cli/commit/ceae674c32a080b81e62d79003c2d537d7ca93d2) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/package-json@7.0.1`
* [`4f37534`](https://github.com/npm/cli/commit/4f37534300553e9ddfbc413c14d1ef15b02b46f2) [#8576](https://github.com/npm/cli/pull/8576) remove read-package-json-fast
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`2ca36c4`](https://github.com/npm/cli/commit/2ca36c4b37f50419303db41cf482d05f5ec69023) [#9261](https://github.com/npm/cli/pull/9261) fixed non-functional typos throughout the codebase (@opensourcezeal)
* [`1afa738`](https://github.com/npm/cli/commit/1afa73868d05c67480c6fb211f38d8c165d49fc9) release 11.12.0 (@github-actions[bot])
* [`8afa3bd`](https://github.com/npm/cli/commit/8afa3bd21461c0984caf1bcc2e486c4881bda516) release 11.11.1 (@github-actions[bot])
* [`6cb34ca`](https://github.com/npm/cli/commit/6cb34cac9f4e4c6af7ecebc98fcfecd22a5e061d) release 11.11.0 (@github-actions[bot])
* [`c029cb2`](https://github.com/npm/cli/commit/c029cb2e5e8b6b61d1a7fd8c454da51a52cd650c) release 11.10.1 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`21c3f02`](https://github.com/npm/cli/commit/21c3f02cdc5abca7d3f334dc97a45f6110f87c38) release 11.10.0 (@github-actions[bot])
* [`417daa7`](https://github.com/npm/cli/commit/417daa72b09c5129e7390cd12743ef31bf3ddb83) release 11.9.0 (@github-actions[bot])
* [`f8d25cd`](https://github.com/npm/cli/commit/f8d25cd00132c8c7798a3f982a8da38ceed81e6b) release 11.8.0 (@github-actions[bot])
* [`6d1db87`](https://github.com/npm/cli/commit/6d1db8724b1d0e5457a87bb31e62e43d566348ce) release 11.7.0 (@github-actions[bot])
* [`5271485`](https://github.com/npm/cli/commit/52714855e62a196fb853872f5106803605ab0ec4) release 11.6.4 (@github-actions[bot])
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`91393de`](https://github.com/npm/cli/commit/91393deaf71bad084bb1d2aa868d5f895cc5f103) [#8599](https://github.com/npm/cli/pull/8599) Update references for arborist to cli (#8599) (@jsoref)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`3b30e0b`](https://github.com/npm/cli/commit/3b30e0b1f1ee9c7119d352dc4f9a27d53f24b988) release 11.6.0 (@github-actions[bot])
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.1): `@npmcli/arborist@10.0.0-pre.1`
</details>

<details><summary>libnpmfund: 7.0.20-pre.1</summary>

## [7.0.20-pre.1](https://github.com/npm/cli/compare/libnpmfund-v7.0.20-pre.0...libnpmfund-v7.0.20-pre.1) (2026-05-27)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`1afa738`](https://github.com/npm/cli/commit/1afa73868d05c67480c6fb211f38d8c165d49fc9) release 11.12.0 (@github-actions[bot])
* [`8afa3bd`](https://github.com/npm/cli/commit/8afa3bd21461c0984caf1bcc2e486c4881bda516) release 11.11.1 (@github-actions[bot])
* [`6cb34ca`](https://github.com/npm/cli/commit/6cb34cac9f4e4c6af7ecebc98fcfecd22a5e061d) release 11.11.0 (@github-actions[bot])
* [`c029cb2`](https://github.com/npm/cli/commit/c029cb2e5e8b6b61d1a7fd8c454da51a52cd650c) release 11.10.1 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`21c3f02`](https://github.com/npm/cli/commit/21c3f02cdc5abca7d3f334dc97a45f6110f87c38) release 11.10.0 (@github-actions[bot])
* [`417daa7`](https://github.com/npm/cli/commit/417daa72b09c5129e7390cd12743ef31bf3ddb83) release 11.9.0 (@github-actions[bot])
* [`f8d25cd`](https://github.com/npm/cli/commit/f8d25cd00132c8c7798a3f982a8da38ceed81e6b) release 11.8.0 (@github-actions[bot])
* [`6d1db87`](https://github.com/npm/cli/commit/6d1db8724b1d0e5457a87bb31e62e43d566348ce) release 11.7.0 (@github-actions[bot])
* [`5271485`](https://github.com/npm/cli/commit/52714855e62a196fb853872f5106803605ab0ec4) release 11.6.4 (@github-actions[bot])
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`91393de`](https://github.com/npm/cli/commit/91393deaf71bad084bb1d2aa868d5f895cc5f103) [#8599](https://github.com/npm/cli/pull/8599) Update references for arborist to cli (#8599) (@jsoref)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`3b30e0b`](https://github.com/npm/cli/commit/3b30e0b1f1ee9c7119d352dc4f9a27d53f24b988) release 11.6.0 (@github-actions[bot])
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])


### Dependencies

* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.1): `@npmcli/arborist@10.0.0-pre.1`
</details>

<details><summary>libnpmpack: 10.0.0-pre.1</summary>

## [10.0.0-pre.1](https://github.com/npm/cli/compare/libnpmpack-v10.0.0-pre.0...libnpmpack-v10.0.0-pre.1) (2026-05-27)
###   BREAKING CHANGES
* npm pack and npm publish now error when a package's overrides apply to one or more of its bundled packages (bundledDependencies / bundleDependencies). Defining both fields is still allowed as long as no override actually targets a bundled package. To resolve the error, remove the affected entries from either overrides or the bundle.
### Features
* [`f5f6cf7`](https://github.com/npm/cli/commit/f5f6cf7c9fc9315b96eb29c5c7d5ab63ad3a9122) [#8943](https://github.com/npm/cli/pull/8943) config: add --allow-git (@wraithgar)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
* [`b1965d6`](https://github.com/npm/cli/commit/b1965d6af116dff6edcec7f70524b483d554ec4f) [#9271](https://github.com/npm/cli/pull/9271) refuse to pack when overrides apply to bundled packages (@owlstronaut)
### Dependencies
* [`bf6b686`](https://github.com/npm/cli/commit/bf6b6862731e03002cc6fa3b86b6f090df46b009) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-arg@13.0.0`
* [`6b4c5f9`](https://github.com/npm/cli/commit/6b4c5f92865230ed9a260cd3e8486bf3991120eb) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/run-script@10.0.0`
* [`b6bb9ae`](https://github.com/npm/cli/commit/b6bb9aea4134c47f0593c111a734eda12ec3c20d) [#8576](https://github.com/npm/cli/pull/8576) `pacote@21.0.3`
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`1afa738`](https://github.com/npm/cli/commit/1afa73868d05c67480c6fb211f38d8c165d49fc9) release 11.12.0 (@github-actions[bot])
* [`8afa3bd`](https://github.com/npm/cli/commit/8afa3bd21461c0984caf1bcc2e486c4881bda516) release 11.11.1 (@github-actions[bot])
* [`6cb34ca`](https://github.com/npm/cli/commit/6cb34cac9f4e4c6af7ecebc98fcfecd22a5e061d) release 11.11.0 (@github-actions[bot])
* [`c029cb2`](https://github.com/npm/cli/commit/c029cb2e5e8b6b61d1a7fd8c454da51a52cd650c) release 11.10.1 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`21c3f02`](https://github.com/npm/cli/commit/21c3f02cdc5abca7d3f334dc97a45f6110f87c38) release 11.10.0 (@github-actions[bot])
* [`417daa7`](https://github.com/npm/cli/commit/417daa72b09c5129e7390cd12743ef31bf3ddb83) release 11.9.0 (@github-actions[bot])
* [`f8d25cd`](https://github.com/npm/cli/commit/f8d25cd00132c8c7798a3f982a8da38ceed81e6b) release 11.8.0 (@github-actions[bot])
* [`6d1db87`](https://github.com/npm/cli/commit/6d1db8724b1d0e5457a87bb31e62e43d566348ce) release 11.7.0 (@github-actions[bot])
* [`5271485`](https://github.com/npm/cli/commit/52714855e62a196fb853872f5106803605ab0ec4) release 11.6.4 (@github-actions[bot])
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`3b30e0b`](https://github.com/npm/cli/commit/3b30e0b1f1ee9c7119d352dc4f9a27d53f24b988) release 11.6.0 (@github-actions[bot])
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])
* [workspace](https://github.com/npm/cli/releases/tag/arborist-v10.0.0-pre.1): `@npmcli/arborist@10.0.0-pre.1`
</details>

<details><summary>libnpmpublish: 11.2.0-pre.1</summary>

## [11.2.0-pre.1](https://github.com/npm/cli/compare/libnpmpublish-v11.2.0-pre.0...libnpmpublish-v11.2.0-pre.1) (2026-05-27)
### Features
* [`254809e`](https://github.com/npm/cli/commit/254809e318ee0046092d07d68a99154c3f672147) [#9201](https://github.com/npm/cli/pull/9201) npm stage (#9201) (@reggi, @Copilot)
* [`1cce318`](https://github.com/npm/cli/commit/1cce31810eb5ff1e0f7c8ee4516e7c73cedb38a1) [#8336](https://github.com/npm/cli/pull/8336) adds support for oidc publish (#8336) (@reggi)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
### Dependencies
* [`8cc9f70`](https://github.com/npm/cli/commit/8cc9f70c2769f068ea0ef77a602162cdd949998e) [#8723](https://github.com/npm/cli/pull/8723) `ssri@13.0.0`
* [`05ac7a7`](https://github.com/npm/cli/commit/05ac7a7ea2a4d258658537a19ba350e07df34fda) [#8723](https://github.com/npm/cli/pull/8723) `proc-log@6.0.0`
* [`fa7cc6f`](https://github.com/npm/cli/commit/fa7cc6f9338e6d9c0be1dbe7002d683fd389794a) [#8662](https://github.com/npm/cli/pull/8662) `ci-info@4.3.1` (#8662)
* [`b05461b`](https://github.com/npm/cli/commit/b05461b6b16f262179efdea45fccf388f88ddc51) [#8663](https://github.com/npm/cli/pull/8663) `@sigstore/sign@4.0.1` (#8663)
* [`bf6b686`](https://github.com/npm/cli/commit/bf6b6862731e03002cc6fa3b86b6f090df46b009) [#8576](https://github.com/npm/cli/pull/8576) `npm-package-arg@13.0.0`
* [`a2bdecc`](https://github.com/npm/cli/commit/a2bdecc6677abcd58ed3037ab0edafb419ea86fa) [#8576](https://github.com/npm/cli/pull/8576) `sigstore@4.0.0`
* [`1149971`](https://github.com/npm/cli/commit/11499711e4c10e4ddb97bf3e1ef1652d151894fb) [#8576](https://github.com/npm/cli/pull/8576) `npm-registry-fetch@19.0.0`
* [`ceae674`](https://github.com/npm/cli/commit/ceae674c32a080b81e62d79003c2d537d7ca93d2) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/package-json@7.0.1`
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`0722535`](https://github.com/npm/cli/commit/072253549d774893a3689341dbc660cb845ebcfe) release 11.6.2 (@github-actions[bot])
* [`5e0909b`](https://github.com/npm/cli/commit/5e0909b74ea1510eaae348d66548c75030911ed8) [#8620](https://github.com/npm/cli/pull/8620) fix spelling in workspaces (#8620) (@jsoref)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
* [`946b34a`](https://github.com/npm/cli/commit/946b34a1c1a364acfed36ba5f2eaa3c6e5036e19) release 11.5.0 (@github-actions[bot])
</details>

<details><summary>libnpmversion: 9.0.0-pre.1</summary>

## [9.0.0-pre.1](https://github.com/npm/cli/compare/libnpmversion-v9.0.0-pre.0...libnpmversion-v9.0.0-pre.1) (2026-05-27)
###   BREAKING CHANGES
* `npm shrinkwrap` is removed, the `shrinkwrap` config alias is removed, and `npm-shrinkwrap.json` is no longer loaded or honored at the project root or from inside dependency tarballs. Rename project-root `npm-shrinkwrap.json` to `package-lock.json`; use `bundleDependencies` if you need to ship a locked dependency tree.
### Features
* [`2e5dcad`](https://github.com/npm/cli/commit/2e5dcad17a59ee9f69eeec27fc5b087b5b032df7) [#9262](https://github.com/npm/cli/pull/9262) drop npm-shrinkwrap.json support (@owlstronaut)
### Bug Fixes
* [`c5292fa`](https://github.com/npm/cli/commit/c5292fa8a09a56b25394d393faf21e47ffb096c0) [#9422](https://github.com/npm/cli/pull/9422) use prerelease strategy without a bug (@owlstronaut)
### Documentation
* [`d124c08`](https://github.com/npm/cli/commit/d124c0858da0b138cda2addcb0987b063ca86a47) [#9385](https://github.com/npm/cli/pull/9385) Document `npm_old_version` and `npm_new_version` environment variables (#9385) (@36degrees)
### Dependencies
* [`05ac7a7`](https://github.com/npm/cli/commit/05ac7a7ea2a4d258658537a19ba350e07df34fda) [#8723](https://github.com/npm/cli/pull/8723) `proc-log@6.0.0`
* [`9c0cefa`](https://github.com/npm/cli/commit/9c0cefa8417d9e14ee19dd5e833019f0f99ce837) [#8723](https://github.com/npm/cli/pull/8723) `json-parse-even-better-errors@5.0.0`
* [`521823b`](https://github.com/npm/cli/commit/521823bc398de0eb85135a3ef09e217db93ed1ce) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/git@7.0.0`
* [`6b4c5f9`](https://github.com/npm/cli/commit/6b4c5f92865230ed9a260cd3e8486bf3991120eb) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/run-script@10.0.0`
### Chores
* [`4296f64`](https://github.com/npm/cli/commit/4296f64beaa514581952a17ab82b6f1bcc0761e1) release 12.0.0-pre.0.0 (@github-actions[bot])
* [`40fcab4`](https://github.com/npm/cli/commit/40fcab45d356545f8db7f34df3e5630116d0dd40) [#8991](https://github.com/npm/cli/pull/8991) `@npmcli/template-oss@4.29.0` (@wraithgar)
* [`7da8fdd`](https://github.com/npm/cli/commit/7da8fdd3625dd5541af57052c90fe1eabb41eb96) release 11.6.3 (@github-actions[bot])
* [`5e0909b`](https://github.com/npm/cli/commit/5e0909b74ea1510eaae348d66548c75030911ed8) [#8620](https://github.com/npm/cli/pull/8620) fix spelling in workspaces (#8620) (@jsoref)
* [`c4ba7f4`](https://github.com/npm/cli/commit/c4ba7f40d1760c69ba05c162ad155821900d9181) release 11.6.1 (@github-actions[bot])
* [`402a0ab`](https://github.com/npm/cli/commit/402a0ab1b4e5d1a8414dd063d0cbde0c0bc5a192) [#8576](https://github.com/npm/cli/pull/8576) `@npmcli/template-oss@4.25.1` (@wraithgar)
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).