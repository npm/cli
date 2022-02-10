## v8.5.0 (2022-02-10)

### Features

* [`0cc9d4c51`](https://github.com/npm/cli/commit/0cc9d4c51a337af0edd2e20c6fadb26807e5d09f)
  [#4372](https://github.com/npm/cli/pull/4372)
  feat(deps): `@npmcli/config@3.0.0 - introduce automatic workspace roots`
  ([@nlf](https://github.com/nlf))

### Bug Fixes

* [`fb6e2ddf9`](https://github.com/npm/cli/commit/fb6e2ddf942bacf5ae745d16c2d57f3836dce75a)
  [#4386](https://github.com/npm/cli/pull/4386)
  fix(log): pass in logger to more external modules
  ([@wraithgar](https://github.com/wraithgar))
* [`0e231d4a4`](https://github.com/npm/cli/commit/0e231d4a40526608411aca0a6e7cf27c750f2409)
  [#4389](https://github.com/npm/cli/pull/4389)
  fix(pack): let libnpmpack take care of file writes
  ([@nlf](https://github.com/nlf))
* [`e2f1f7b04`](https://github.com/npm/cli/commit/e2f1f7b045a3ae9840f431cb4266ba046831247b)
  [#4389](https://github.com/npm/cli/pull/4389)
  fix(publish): pass dryRun: true to libnpmpack so it doesnt write a tarball
  ([@nlf](https://github.com/nlf))
* [`2937b43d4`](https://github.com/npm/cli/commit/2937b43d4629225d83b6c71833df00743209f5ff)
  [#4389](https://github.com/npm/cli/pull/4389)
  fix(config): add pack-destination flattener
  ([@nlf](https://github.com/nlf))

### Documentation

* [`b836d596f`](https://github.com/npm/cli/commit/b836d596f9d98cd7849882000cad11ad2a0b9a26)
  [#4384](https://github.com/npm/cli/pull/4384)
  docs: add cross-references between npx and npm exec
  ([@Delapouite](https://github.com/Delapouite))
* [`f3fbeea5a`](https://github.com/npm/cli/commit/f3fbeea5a173902ca7455c6c94a9e677591b0410)
  [#4388](https://github.com/npm/cli/pull/4388)
  docs: add --save-bundle to --save usage output
  ([@wraithgar](https://github.com/wraithgar))

### Dependencies

* [`8732f393e`](https://github.com/npm/cli/commit/8732f393ee547e2eada4317613599517c1d8ec0a)
  deps: `@npmcli/arborist@4.3.1`
    * [`2ba09cc0d`](https://github.com/npm/cli/commit/2ba09cc0d7d56a064aa67bbb1881d381e6504888)
      [#4371](https://github.com/npm/cli/pull/4371)
      fix(arborist): check if a spec is a workspace before fetching a manifest, closes #3637
      ([@nlf](https://github.com/nlf))
    * [`e631faf7b`](https://github.com/npm/cli/commit/e631faf7b5f414c233d723ee11413264532b37de)
      [#4387](https://github.com/npm/cli/pull/4387)
      fix(arborist): save bundleDependencies to package.json when reifying
      ([@wraithgar](https://github.com/wraithgar))
* [`d3a7c15e1`](https://github.com/npm/cli/commit/d3a7c15e1e3d305a0bf781493406dfb1fdbaca35)
  deps: `libnpmpack@3.1.0`
    * [`4884821f6`](https://github.com/npm/cli/commit/4884821f637ca1992b494fbdbd94d000e4428a40)
      [#4389](https://github.com/npm/cli/pull/4389)
      feat(libnpmpack): write tarball file when dryRun === false
      ([@nlf](https://github.com/nlf))
* [`ab926995e`](https://github.com/npm/cli/commit/ab926995e43ccdd048a6e1164b436fea1940f932)
  [#4393](https://github.com/npm/cli/pull/4393)
  deps: `npm-registry-fetch@12.0.2`
* [`1c0d0699c`](https://github.com/npm/cli/commit/1c0d0699c13e1cb36a69f2ac4acdb78ea205aa3e)
  [#4394](https://github.com/npm/cli/pull/4394)
  deps: `npmlog@6.0.1`
    * changed notice color from blue to cyan for improved readability
* [`3c33a5842`](https://github.com/npm/cli/commit/3c33a584213e4f2230f3b912fad2c2f5786906fb)
  [#4400](https://github.com/npm/cli/pull/4400)
  deps: `make-fetch-happen@10.0.2`

## v8.4.1 (2022-02-03)

### Bug Fixes

* [`1b9338554`](https://github.com/npm/cli/commit/1b9338554fc006954fae54c25c33e64e26ae997e)
  [#4359](https://github.com/npm/cli/pull/4359)
  fix(log): pass in logger to external modules
  ([@wraithgar](https://github.com/wraithgar))
* [`457e0ae61`](https://github.com/npm/cli/commit/457e0ae61bbc55846f5af44afa4066921923490f)
  [#4363](https://github.com/npm/cli/pull/4363)
  fix(ci): lock file validation
  ([@ruyadorno](https://github.com/ruyadorno))
* [`c0519edc1`](https://github.com/npm/cli/commit/c0519edc16f66370b2153430342247b4ec5cb496)
  [#4364](https://github.com/npm/cli/pull/4364)
  fix(ci): should not use package-lock config
  ([@ruyadorno](https://github.com/ruyadorno))
* [`ebb428375`](https://github.com/npm/cli/commit/ebb428375cd417c096d5a648df92620dc4215a3d)
  [#4365](https://github.com/npm/cli/pull/4365)
  fix(outdated): parse aliased modules
  ([@ruyadorno](https://github.com/ruyadorno))

### Documentation

* [`0b0a7cc76`](https://github.com/npm/cli/commit/0b0a7cc767947ea738da50caa832d8a922e20ac6)
  [#4361](https://github.com/npm/cli/pull/4361)
  docs: bundleDependencies can be a boolean.
  ([@forty](https://github.com/forty))

### Dependencies

* [`3d41447b9`](https://github.com/npm/cli/commit/3d41447b961a72f1ce541fea252d0cd462399c76)
  [#4353](https://github.com/npm/cli/pull/4353)
  deps: `wide-align@1.1.5`
* [`dc1a0573a`](https://github.com/npm/cli/commit/dc1a0573ace328d985a741af76d03752b1dbf1ff)
  [#4353](https://github.com/npm/cli/pull/4353)
  deps: `socks-proxy-agent@6.1.1`
* [`adcefef6b`](https://github.com/npm/cli/commit/adcefef6b953e0804f4a2de3a1912321f44c4a7e)
  [#4353](https://github.com/npm/cli/pull/4353)
  deps: `spdx-license-ids@3.0.11`
* [`d7e2499e0`](https://github.com/npm/cli/commit/d7e2499e073301a62607266d3ab8f9b63d630fb5)
  [#4353](https://github.com/npm/cli/pull/4353)
  deps: `debug@4.3.3`
* [`f0f307140`](https://github.com/npm/cli/commit/f0f30714002db979a2707d85c65bb92ae0ff76fe)
  [#4353](https://github.com/npm/cli/pull/4353)
  deps: `@npmcli/fs@1.1.0`
* [`1cb107d33`](https://github.com/npm/cli/commit/1cb107d33d7e1499d92c3405fa0694142bdee8df)
  [#4353](https://github.com/npm/cli/pull/4353)
  deps: `is-core-module@2.8.1`
* [`e198ac0d1`](https://github.com/npm/cli/commit/e198ac0d1c1e536db57e84af6e7f40089b4c1bfc)
  [#4354](https://github.com/npm/cli/pull/4354)
  deps: `cli-table3@0.6.1`
* [`5a84e6515`](https://github.com/npm/cli/commit/5a84e6515a0331be20395ce2a6b1e892ecea20f8)
  [#4355](https://github.com/npm/cli/pull/4355)
  deps: `graceful-fs@4.2.9`

## v8.4.0 (2022-01-27)

### Features

* [`fbe48a840`](https://github.com/npm/cli/commit/fbe48a84047e0c5de31bdaa84707f0f8fdcef71d)
  [#4307](https://github.com/npm/cli/pull/4307)
  feat(arborist): add named updates validation
  ([@ruyadorno](https://github.com/ruyadorno))

### Bug Fixes

* [`1f853f8bf`](https://github.com/npm/cli/commit/1f853f8bf7cecd1222703dde676a4b664526141d)
  [#4306](https://github.com/npm/cli/pull/4306)
  fix(arborist): load actual tree on named updates
  ([@ruyadorno](https://github.com/ruyadorno))
* [`90c384ccc`](https://github.com/npm/cli/commit/90c384ccccac32c80c481a04c438cbcbea82539c)
  [#4326](https://github.com/npm/cli/pull/4326)
  fix(logout): require proper auth.js from npm-registry-fetch
  ([@wraithgar](https://github.com/wraithgar))
* [`fabcf431a`](https://github.com/npm/cli/commit/fabcf431a63ecf93b56ae5d9a05ad4e7ef280c2a)
  [#4327](https://github.com/npm/cli/pull/4327)
  fix(arborist): correctly load overrides on workspace edges, closes #4205
  ([@nlf](https://github.com/nlf))
* [`8c3b143ca`](https://github.com/npm/cli/commit/8c3b143ca20d0da56c0ce2764e288a4c203b9f93)
  [#4258](https://github.com/npm/cli/pull/4258)
  fix(arborist): shrinkwrap throws when trying to read a folder without permissions
  ([@Linkgoron](https://github.com/Linkgoron))
* [`b51b29c56`](https://github.com/npm/cli/commit/b51b29c563fa97aa4fbf38250d1f04e879a8d961)
  [#4334](https://github.com/npm/cli/pull/4334)
  fix(arborist): update save exact
  ([@ruyadorno](https://github.com/ruyadorno))

### Dependencies

* [`8558527c7`](https://github.com/npm/cli/commit/8558527c7158b2c1c353f8ab9c31de2a66ab470e)
  [#4333](https://github.com/npm/cli/pull/4333)
  deps: `make-fetch-happen@10.0.0`
    * compress option and accept/content encoding header edge cases
    * strip cookie header on redirect across hostnames
* [`1bfc507f2`](https://github.com/npm/cli/commit/1bfc507f2a5afa02f04d4dea2fc6d151d4fef3ac)
  [#4326](https://github.com/npm/cli/pull/4326)
  deps: `npm-registry-fetch@12.0.1`
* [`52c9608e7`](https://github.com/npm/cli/commit/52c9608e7bb1cda396b2cef3fc1b48dbaa2b7de3)
  [#4326](https://github.com/npm/cli/pull/4326)
  deps: `pacote@12.0.3`
* [`2bbeedfeb`](https://github.com/npm/cli/commit/2bbeedfebb3aea082d612deb5e4d9de9e550c529)
  [#4326](https://github.com/npm/cli/pull/4326)
  deps: `npm-profile@6.0.0`
* [`9652d685b`](https://github.com/npm/cli/commit/9652d685b1e4bd21cec107a611c2e307387623d6)
  chore(release): `@npmcli/arborist@4.3.0`
  ([@wraithgar](https://github.com/wraithgar))
* [`0ee4927d2`](https://github.com/npm/cli/commit/0ee4927d2e8206dd24fa7eea5e1c10ea649ecc49)
  chore(release): `libnpmaccess@5.0.1`
  ([@wraithgar](https://github.com/wraithgar))
* [`6c0dc1ffb`](https://github.com/npm/cli/commit/6c0dc1ffb70858be1e9ca9afdb6950e39609a367)
  chore(release): `libnpmexec@3.0.3`
  ([@wraithgar](https://github.com/wraithgar))
* [`41b8f7b6f`](https://github.com/npm/cli/commit/41b8f7b6ff62f0e738865eb8e98df8650f5467bd)
  chore(release): `libnpmorg@3.0.1`
  ([@wraithgar](https://github.com/wraithgar))
* [`433e6aafb`](https://github.com/npm/cli/commit/433e6aafbbf56efcf71e991767a6f00afe4aba7c)
  chore(release): `libnpmpublish@5.0.1`
  ([@wraithgar](https://github.com/wraithgar))
* [`6654b6efe`](https://github.com/npm/cli/commit/6654b6efe02666bdb9864f4608e477ba132fd215)
  chore(release): `libnpmsearch@4.0.1`
  ([@wraithgar](https://github.com/wraithgar))
* [`3423a9804`](https://github.com/npm/cli/commit/3423a980436492b7f0ee9e002517387a801f4f4a)
  chore(release): `libnpmteam@3.0.1`
  ([@wraithgar](https://github.com/wraithgar))
* [`fb03e485d`](https://github.com/npm/cli/commit/fb03e485d9b1f09eb1cbcce00ee8e3e5c012097f)
  chore(release): `libnpmhook@7.0.1`
  ([@wraithgar](https://github.com/wraithgar))

## v8.3.2 (2022-01-20)

### Bug Fixes

* [`cfd59b8c8`](https://github.com/npm/cli/commit/cfd59b8c81078f842328b13a23a234150842cd58)
  [#4223](https://github.com/npm/cli/pull/4223)
  fix: npm update --save
  ([@ruyadorno](https://github.com/ruyadorno))
* [`510f0ecbc`](https://github.com/npm/cli/commit/510f0ecbc9970ed8c8993107cc03cf27b7b996dc)
  [#4218](https://github.com/npm/cli/pull/4218)
  fix(arborist): ensure indentation is preserved
  ([@ljharb](https://github.com/ljharb))
* [`c99c2151a`](https://github.com/npm/cli/commit/c99c2151a868672c017f64ff0ecb12149a2fb095)
  [#4230](https://github.com/npm/cli/pull/4230)
  fix(arborist): prioritize valid workspace nodes
  ([@nlf](https://github.com/nlf))
* [`14a3d9500`](https://github.com/npm/cli/commit/14a3d95000f1cba937f3309d198a363ae65cf01f)
  [#4265](https://github.com/npm/cli/pull/4265)
  fix: resolve workspace paths from cwd when possible
  ([@nlf](https://github.com/nlf))

### Dependencies

* [`2ef9f9847`](https://github.com/npm/cli/commit/2ef9f9847c11fe8c0c0494558fe77c15ac4dbc80)
  [#4254](https://github.com/npm/cli/pull/4254)
  deps: `bin-links@3.0.0 write-file-atomic@4.0.0`

## v8.3.1 (2022-01-13)

### Bug Fixes

* [`2ac540b0c`](https://github.com/npm/cli/commit/2ac540b0ccd016a14676ad891758e8d9e903a12c)
  fix(unpublish): Show warning on unpublish command when last version (#4191)
  ([@ebsaral](https://github.com/ebsaral))

### Dependencies

* [`da80d579d`](https://github.com/npm/cli/commit/da80d579d1f1db61894c54f7b9b3623394882c16)
  [#4211](https://github.com/npm/cli/pull/4211)
  deps: `hosted-git-info@4.1.0`
  * feat: Support Sourcehut
* [`5a87d190f`](https://github.com/npm/cli/commit/5a87d190f38af9f2f98084d9b476184dbcaf1429)
  [#4228](https://github.com/npm/cli/pull/4228)
  deps: `@npmcli/config@2.4.0`
* [`1f0d1370f`](https://github.com/npm/cli/commit/1f0d1370ff6bf2ca978ef0d7d32640314c62204e)
  chore(release): `@npmcli/arborist@4.2.0`
  * [`3cfae3840`](https://github.com/npm/cli/commit/3cfae384011a8b291cc82cc02b56bc114557a9e5)
    [#4181](https://github.com/npm/cli/pull/4181)
    feat(arborist) add `toJSON`/`toString` methods to get shrinkwrap contents without saving
    ([@ljharb](https://github.com/ljharb))

### Chores

* [`d72650457`](https://github.com/npm/cli/commit/d7265045730555c03b3142c004c7438e9577028c)
  chore: Bring in all libnpm modules + arborist as workspaces (#4166)
  ([@fritzy](https://github.com/fritzy))


## v8.3.0 (2021-12-09)

### Features

* [`4b0c29a7c`](https://github.com/npm/cli/commit/4b0c29a7c5860410c7b453bec389c54cb21dbde3)
  [#4116](https://github.com/npm/cli/issues/4116)
  feat: `@npmcli/arborist@4.1.0`
  * introduces overrides
  ([@nlf](https://github.com/nlf))
* [`166d9e144`](https://github.com/npm/cli/commit/166d9e144b38087ee5e7d8aaf6ec7d602cf2957c)
  [npm/statusboard#416](https://github.com/npm/statusboard/issues/416)
  [#4143](https://github.com/npm/cli/issues/4143)
  feat: output configured registry during publish
  ([@lukekarrys](https://github.com/lukekarrys))
* [`71777be17`](https://github.com/npm/cli/commit/71777be17e57179d203cb9162664ecd0c36ca633)
  [npm/statusboard#417](https://github.com/npm/statusboard/issues/417)
  [#4146](https://github.com/npm/cli/issues/4146)
  feat: display `publishConfig` during `config list`
  ([@lukekarrys](https://github.com/lukekarrys))

### Bug Fixes

* [`08c663931`](https://github.com/npm/cli/commit/08c663931ec1f56d777ffdb38f94926b9eac13ef)
  [#4128](https://github.com/npm/cli/issues/4128)
  [#4134](https://github.com/npm/cli/issues/4134)
  fix: dont warn on error cleaning individual log files
  ([@lukekarrys](https://github.com/lukekarrys))
* [`e605b128c`](https://github.com/npm/cli/commit/e605b128c87620aae843cdbd8f35cc614da3f8a2)
  [#4142](https://github.com/npm/cli/issues/4142)
  fix: redact all private keys from config output
  ([@lukekarrys](https://github.com/lukekarrys))

### Documentation

* [`db1885d7f`](https://github.com/npm/cli/commit/db1885d7fec012f018093c76dec5a9c01a0ca2b0)
  [#4092](https://github.com/npm/cli/issues/4092)
  chore(docs): document overrides
  ([@nlf](https://github.com/nlf))

### Dependencies

* [`e1da1fa4b`](https://github.com/npm/cli/commit/e1da1fa4ba7d95616928d2192b5b9db09b3120bc)
  [#4141](https://github.com/npm/cli/issues/4141)
  deps: `@npmcli/arborist@4.1.1`: `parse-conflict-json@2.0.1`
  * Fixes object property assignment bug in resolving package-locks with
  conflicts
* [`1d8bec566`](https://github.com/npm/cli/commit/1d8bec566cb08ff5ff220f53083323fa8c3fb72e)
  [#4144](https://github.com/npm/cli/issues/4144)
  [#3884](https://github.com/npm/cli/issues/3884)
  deps: `minipass@3.1.6`
  * fixes some TAR_ENTRY_INVALID and Z_DATA_ERROR errors

## v8.2.0 (2021-12-02)

### Features

* [`6734ba36d`](https://github.com/npm/cli/commit/6734ba36dd6e07a859ab4d6eb4f264d2c0022276)
  [#4062](https://github.com/npm/cli/issues/4062)
  feat: streaming debug logfile
  ([@lukekarrys](https://github.com/lukekarrys))

### Bug Fixes

* [`5f4040aa0`](https://github.com/npm/cli/commit/5f4040aa0e30a3b74caab64958770c682e4d0031)
  chore: remove get-project-scope utils
  ([@Yucel Okcu](https://github.com/Yucel Okcu))
* [`c5c6d1603`](https://github.com/npm/cli/commit/c5c6d1603b06df4c10b503047aeed34d6e0c36c2)
  [#4060](https://github.com/npm/cli/issues/4060)
  fix: add missing scope on flat options
  ([@yuqu](https://github.com/yuqu))
* [`47828b766`](https://github.com/npm/cli/commit/47828b766a4a7b50c1245c8f01b99ffbeffd014f)
  chore: update one-time password prompt
  ([@Darcy Clarke](https://github.com/Darcy Clarke))

### Documentation

* [`fc46a7926`](https://github.com/npm/cli/commit/fc46a792621c89354eddc0e1ee2d4f5c26efe5a5)
  [#4072](https://github.com/npm/cli/issues/4072)
  docs: fix typo in `save-peer` description
  ([@chalkygames123](https://github.com/chalkygames123))
* [`2fbf1576f`](https://github.com/npm/cli/commit/2fbf1576f5427babab2bdf314b1760adc5f9a575)
  [#4081](https://github.com/npm/cli/issues/4081)
  docs: Fix typo
  ([@idleberg](https://github.com/idleberg))
* [`a8bc95f11`](https://github.com/npm/cli/commit/a8bc95f11c9d21319581d7b09baf9f864bea21ac)
  [#4089](https://github.com/npm/cli/issues/4089)
  docs(workspaces): Fix typo
  ([@yotamselementor](https://github.com/yotamselementor))
* [`31b098ee2`](https://github.com/npm/cli/commit/31b098ee26ed17facb132278bb3205e80e2a760d)
  [#4113](https://github.com/npm/cli/issues/4113)
  docs: add logging docs
  ([@darcyclarke](https://github.com/darcyclarke))
* [`cbae0fb71`](https://github.com/npm/cli/commit/cbae0fb71cea55004f7066c0dfc870137b53ee8b)
  [#4114](https://github.com/npm/cli/issues/4114)
  docs: update description about where/when debug log is written
  ([@lukekarrys](https://github.com/lukekarrys))


### Dependencies

* [`037f2cc8c`](https://github.com/npm/cli/commit/037f2cc8c8ed9d9a092475a5a07f2a3a88915633)
  [#4078](https://github.com/npm/cli/issues/4078)
  `node-gyp@8.4.1`
* [`0e63df612`](https://github.com/npm/cli/commit/0e63df61283a2f7ace991f72e4577c6f23ffc5df)
  [#4102](https://github.com/npm/cli/issues/4102)
  `@npmcli/config@2.3.2`:
  * fix: always load localPrefix

## v8.1.4 (2021-11-18)

### BUG FIXES

* [`7887fb3d7`](https://github.com/npm/cli/commit/7887fb3d7ba7f05abeb49dd92b76d90422cb38ca)
  [#4025](https://github.com/npm/cli/issues/4025)
  fix: don't try to open file:/// urls
  ([@wraithgar](https://github.com/wraithgar))
* [`cd6d3a90d`](https://github.com/npm/cli/commit/cd6d3a90d4bbf3793834830b4c77fc8eb0846596)
  [#4026](https://github.com/npm/cli/issues/4026)
  fix: explicitly allow `npm help` to open file:/// man pages
  ([@wraithgar](https://github.com/wraithgar))
* [`72ca4a4e3`](https://github.com/npm/cli/commit/72ca4a4e39a1d4de03d6423480aa2ee82b021060)
  [#4020](https://github.com/npm/cli/issues/4020)
  [#4032](https://github.com/npm/cli/issues/4032)
  fix: command completion
  ([@wraithgar](https://github.com/wraithgar))
* [`b78949134`](https://github.com/npm/cli/commit/b789491345aa6fbe345aa3c96fe9f415296ec418)
  [#4023](https://github.com/npm/cli/issues/4023)
  fix(install): command completion with single match
  ([@wraithgar](https://github.com/wraithgar))
* [`44bfa3787`](https://github.com/npm/cli/commit/44bfa378723554195fccf8cf4ca2d895ddbd8f8c)
  [#4065](https://github.com/npm/cli/issues/4065)
  @npmcli/arborist 4.0.5
  * fix: accurate filtering of workspaces `--no-workspaces`
  ([@fritzy](https://github.com/fritzy))

### DEPENDENCIES

* [`225645420`](https://github.com/npm/cli/commit/225645420cf3d13bc0b0d591f7f7bf21a9c24e47)
  [#3995](https://github.com/npm/cli/issues/3995)
  update to latest eslint and linting rules
  ([@wraithgar](https://github.com/wraithgar))
* [`203fedf5b`](https://github.com/npm/cli/commit/203fedf5b1eba78b76ebacbda88f215caabea6ca)
  [#4016](https://github.com/npm/cli/issues/4016)
  `eslint@8.0.0`: `@npmcli/eslint-config@2.0.0`
  * Update to eslint@8 and and `@npmcli/eslint-config@2.0.0`
  * Remove eslint-plugin-node.
  Also remove an unused script that was failing linting.  We don't use the
  update-dist-tags script anymore as part of our release process.
  ([@wraithgar](https://github.com/wraithgar))
* [`7b4aa59b6`](https://github.com/npm/cli/commit/7b4aa59b6630831f25d19c0c15a65acaf3a83327)
  `signal-exit@3.0.6`:, `tap@15.1.2`
  ([@isaacs](https://github.com/isaacs))
* [`08015859c`](https://github.com/npm/cli/commit/08015859ca0abe47845d2970212cd344cdfc56e6)
  [#4049](https://github.com/npm/cli/issues/4049)
  `npmlog@6.0.0`
* [`088c11694`](https://github.com/npm/cli/commit/088c11694a9f575e5c0fe10ab9efb55d14019be7)
  [#4045](https://github.com/npm/cli/issues/4045)
  `node-gyp@8.4.0`:
  * feat: support vs2022
  * feat: build with config.gypi from node headers

## v8.1.3 (2021-11-04)

### BUG FIXES

* [`8ffeb71df`](https://github.com/npm/cli/commit/8ffeb71dfb248b4a76744bd06cd4d6100f17c8ae)
  [#3959](https://github.com/npm/cli/issues/3959)
  fix: refactor commands
  ([@wraithgar](https://github.com/wraithgar))
* [`e5bfdaca4`](https://github.com/npm/cli/commit/e5bfdaca455e294109ba026f4d8b5cc80d3dfd20)
  [#3978](https://github.com/npm/cli/issues/3978)
  fix: shrinkwrap setting incorrect lockfileVersion
  ([@lukekarrys](https://github.com/lukekarrys))
* [`32ccd3c27`](https://github.com/npm/cli/commit/32ccd3c2767a14198a1803f04e747ef848f7c938)
  [#3988](https://github.com/npm/cli/issues/3988)
  fix: remove usage of unnecessary util.promisify
  ([@lukekarrys](https://github.com/lukekarrys))
* [`1e9c31c4e`](https://github.com/npm/cli/commit/1e9c31c4e3929483580a0a554d7515095b5418ca)
  [#3994](https://github.com/npm/cli/issues/3994)
  fix: npm help on windows
  ([@wraithgar](https://github.com/wraithgar))
* [`22230ef3d`](https://github.com/npm/cli/commit/22230ef3dd590def31c274b3412106b4cfbd212f)
  [#3987](https://github.com/npm/cli/issues/3987)
  fix: make prefixed usage errors more consistent
  ([@lukekarrys](https://github.com/lukekarrys))

### DEPENDENCIES

* [`ac2fabb86`](https://github.com/npm/cli/commit/ac2fabb8604db0dac852913d61c8415ae7464485)
  [#3990](https://github.com/npm/cli/issues/3990)
  `@npmcli/arborist@4.0.4`
  * fix: don't compare spec for local dep vs existing
  * fix: stop pruning peerSets when entryEdge is from a workspace
* [`a0d35ff20`](https://github.com/npm/cli/commit/a0d35ff20aed6aab8508123eb540bc9c61fb127d)
  [#3996](https://github.com/npm/cli/issues/3996)
  `@npmcli/config@2.3.1`:
  * fix: dont load project configs in global mode

## v8.1.2 (2021-10-28)

### BUG FIXES

* [`cb9f43551`](https://github.com/npm/cli/commit/cb9f43551f46bf27095cd7bd6c1885a441004cd2)
  [#3949](https://github.com/npm/cli/issues/3949)
  allow `--lockfile-version` config to be string and coerce to number ([@lukekarrys](https://github.com/lukekarrys))
* [`070901d7a`](https://github.com/npm/cli/commit/070901d7a6e3110a04ef41d8fcf14ffbfcce1496)
  [#3943](https://github.com/npm/cli/issues/3943)
  fix(publish): clean args before logging
  ([@wraithgar](https://github.com/wraithgar))

### DEPENDENCIES

* [`8af94726b`](https://github.com/npm/cli/commit/8af94726b098031c7c0cae7ed50cc4e2e3499181)
  [#3953](https://github.com/npm/cli/issues/3953)
  `arborist@4.0.3`
  * [`38cee94`](https://github.com/npm/arborist/commit/38cee94afa53d578830cc282348a803a8a6eefad)
    [#340](https://github.com/npm/arborist/pull/340)
    fix: set lockfileVersion from file during reset
  * [`d310bd3`](https://github.com/npm/arborist/commit/d310bd3290c3a81e8285ceeb6eda9c9b5aa867d7)
    [#339](https://github.com/npm/arborist/pull/339)
    fix: always set originalLockfileVersion when doing shrinkwrap reset

## v8.1.1 (2021-10-21)

### DEPENDENCIES

* [`51fb83ce9`](https://github.com/npm/cli/commit/51fb83ce93fdd7e289da7b2aabc95b0518f0aa31)
  [#3921](https://github.com/npm/cli/issues/3921)
  `@npmcli/arborist@4.0.2`:
  * fix: skip peer conflict check if there is a current node
* [`1d07f2187`](https://github.com/npm/cli/commit/1d07f21876994c6d4d69559203cfdac6022536b6)
  [#3913](https://github.com/npm/cli/issues/3913)
  `node-gyp@8.3.0`:
  * feat(gyp): update gyp to v0.10.0

## v8.1.0 (2021-10-14)

### FEATURES

* [`24273a862`](https://github.com/npm/cli/commit/24273a862e54abfd022df9fc4b8c250bfe77817c)
  [#3890](https://github.com/npm/cli/issues/3890)
  feat(workspaces): add --include-workspace-root and explicit --no-workspaces
  ([@fritzy](https://github.com/fritzy))
* [`d559d6da8`](https://github.com/npm/cli/commit/d559d6da84c2dae960c6b7c89c6012fb31bcfa37)
  [#3880](https://github.com/npm/cli/issues/3880)
  feat(config): Add --lockfile-version config option
  ([@isaacs](https://github.com/isaacs))

### DEPENDENCIES

* [`ae4bf013d`](https://github.com/npm/cli/commit/ae4bf013d06d84b8600937a28cc7b4c4034f571c)
  [#3883](https://github.com/npm/cli/issues/3883)
  `pacote@12.0.2`:
  * fix: preserve git+ssh url for non-hosted repos
  * deps: update `npm-packlist@3.0.0`
  * fix: no longer include ignored bundled link deps
* [`fbc5a3d08`](https://github.com/npm/cli/commit/fbc5a3d08231176b9d8a7b9dd3371fb40ba6abc9)
  [#3889](https://github.com/npm/cli/issues/3889)
  `@npmcli/ci-detect@1.4.0`
* [`b6bc279e5`](https://github.com/npm/cli/commit/b6bc279e55aa65afff09d9258f9df7168a7dbadb)
  `@npmcli/arborist@4.0.1`
* [`0f69d295b`](https://github.com/npm/cli/commit/0f69d295bd5516f496af75ef29e7ae6304fa2ba5)
  [#3893](https://github.com/npm/cli/issues/3893)
  `@npmcli/map-workspaces@2.0.0`

### DOCUMENTATION

* [`f77932ca1`](https://github.com/npm/cli/commit/f77932ca1eafbece16fc249a7470f760d652bd94)
  [#3861](https://github.com/npm/cli/issues/3861)
  fix(docs): Update Node support in README
  ([@gfyoung](https://github.com/gfyoung))
* [`a190f422a`](https://github.com/npm/cli/commit/a190f422a2587a0e56afa5032175e57e55123ea2)
  [#3878](https://github.com/npm/cli/issues/3878)
  fix(docs): grammar fix
  ([@XhmikosR](https://github.com/XhmikosR))

## v8.0.0 (2021-10-07)

The purpose of this release is to drop support for old node versions and
to remove support for `require('npm')`.  There are no other breaking
changes.

### BREAKING CHANGES

* Drop support for node 10 and 11
* Raise support ceiling in node 12 and 14 to LTS (^12.13.0/^14.15.0)
* Drop support to `require('npm')`
* Update subdependencies that also dropped node10 support

### DEPENDENCIES

* The following dependencies were updated to drop node10 support and
    update to the latest node-gyp
  * libnpmversion@2.0.1
  * pacote@12.0.0
  * libnpmpack@3.0.0
  * @npmcli/arborist@3.0.0
  * libnpmfund@2.0.0
  * libnpmexec@3.0.0
  * node-gyp@8.2.0
* [`8bd85cdae`](https://github.com/npm/cli/commit/8bd85cdae5eead60d5e92d6f1be27e88b480b1cb)
  [#3813](https://github.com/npm/cli/issues/3813)
  `cli-columns@4.0.0`
