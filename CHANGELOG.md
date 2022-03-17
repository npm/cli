# Changelog

## v8.5.5 (2022-03-17)

### Bug Fixes
  
  * [`0e7511d14`](https://github.com/npm/cli/commit/0e7511d144bdb6624e4c0fdfb31b4b42ed2954c9) [#4261](https://github.com/npm/cli/pull/4261) fix(arborist): _findMissingEdges missing dependency due to inconsistent path separators ([@salvadorj](https://github.com/salvadorj))
  * [`c83069436`](https://github.com/npm/cli/commit/c83069436ef4af75eaef071bc181ba1ab49729e9) [#4547](https://github.com/npm/cli/pull/4547) fix: omit bots from authors ([@wraithgar](https://github.com/wraithgar))
  * [`f66da2ed8`](https://github.com/npm/cli/commit/f66da2ed8948fbfa919dd5debe52eafe2018735c) [#4565](https://github.com/npm/cli/pull/4565) fix(owner): bypass cache when fetching packument ([@wraithgar](https://github.com/wraithgar))
  * [`f0c6e86ca`](https://github.com/npm/cli/commit/f0c6e86ca5920baa85355af3ea50ed13f7429a10) [#4572](https://github.com/npm/cli/pull/4572) fix: remove name from unpublished message ([@wraithgar](https://github.com/wraithgar))
  * [`f7e58fa74`](https://github.com/npm/cli/commit/f7e58fa74d9008731b86c82f75251ca295056cf1) [#4572](https://github.com/npm/cli/pull/4572) fix: remove "bug the author" message from package 404 ([@wraithgar](https://github.com/wraithgar))
  * [`5471ff5fe`](https://github.com/npm/cli/commit/5471ff5fe8f74f46cdc2bb056ba9b496c7dd1a78) [#4573](https://github.com/npm/cli/pull/4573) fix: add isntall alias to install ([@wraithgar](https://github.com/wraithgar))
  * [`84d19210e`](https://github.com/npm/cli/commit/84d19210e5604775a3a413aa32cbba2c103933f2) [#4576](https://github.com/npm/cli/pull/4576) fix: properly show `npm view ./directory` ([@wraithgar](https://github.com/wraithgar))
  * [`e9a2981f5`](https://github.com/npm/cli/commit/e9a2981f55f84ff521ef597883a4e732d08ce1c1) [#4578](https://github.com/npm/cli/pull/4578) fix(arborist): save workspace version ([@ruyadorno](https://github.com/ruyadorno))
  
### Documentation
  
  * [`a30405258`](https://github.com/npm/cli/commit/a304052580c070a1f8c1c0cf8cbeec615c46af02) [#4580](https://github.com/npm/cli/pull/4580) docs: add foreground-scripts and ignore-scripts to commands ([@wraithgar](https://github.com/wraithgar))
  * [`2361a68e1`](https://github.com/npm/cli/commit/2361a68e14f893e97dad53d66fde32082e23521a) [#4582](https://github.com/npm/cli/pull/4582) docs: add isntall alias to install command ([@wraithgar](https://github.com/wraithgar))
  * [`8ff1dfaae`](https://github.com/npm/cli/commit/8ff1dfaaeeb32e88c879b96a786835fe13526a88) [#4575](https://github.com/npm/cli/pull/4575) docs: explain that linked deps need `npm install` ran in them ([@wraithgar](https://github.com/wraithgar))
  * [`ddbb505ec`](https://github.com/npm/cli/commit/ddbb505ec6077576e0a9d00a14b43d32d69e4f9e) [#4574](https://github.com/npm/cli/pull/4574) docs: explain that git-tag-version=false does not commit ([@wraithgar](https://github.com/wraithgar))
  * [`7c878b978`](https://github.com/npm/cli/commit/7c878b9781be2e2151f41bd29d46c33e421aeb10) [#4584](https://github.com/npm/cli/pull/4584) docs: fix unpublish docs to auto generate usage ([@wraithgar](https://github.com/wraithgar))
  
### Dependencies
  
  * [`fcc6acfa8`](https://github.com/npm/cli/commit/fcc6acfa808aa556748544edf4e9b73262f77608) [#4562](https://github.com/npm/cli/pull/4562) deps: `@npmcli/metavuln-calculator@3.0.1`
  * [`6d3145014`](https://github.com/npm/cli/commit/6d3145014861b4198c16d7772d809fd037ece289) [#4562](https://github.com/npm/cli/pull/4562) deps: `pacote@13.0.4`
  * [`f6b771aab`](https://github.com/npm/cli/commit/f6b771aabece09dca2231426d4f681d3578e5ab7) [#4562](https://github.com/npm/cli/pull/4562) deps: `make-fetch-happen@10.0.6`
  * [`e26548fb1`](https://github.com/npm/cli/commit/e26548fb12a3bb23fbe32a336f1305e083aa51c0) [#4562](https://github.com/npm/cli/pull/4562) deps: `cacache@16.0.0`
  * [`915dda7ab`](https://github.com/npm/cli/commit/915dda7abeedf79cfe0dde1bd55d80115e2a795d) [#4562](https://github.com/npm/cli/pull/4562) deps: `init-package-json@3.0.1`
  * [`f2ec2ef1f`](https://github.com/npm/cli/commit/f2ec2ef1f7a639ea292d6ab442d588ed72198857) [#4562](https://github.com/npm/cli/pull/4562) deps: `read-package-json@5.0.0`
  * [`340fa51f4`](https://github.com/npm/cli/commit/340fa51f423a518a96c8015a67d8f6144a2e8051) [#4562](https://github.com/npm/cli/pull/4562) deps: `pacote@13.0.5`
  * [`9555a5f1d`](https://github.com/npm/cli/commit/9555a5f1d135aa1b8f7374273403efe41e99ee26) [#4562](https://github.com/npm/cli/pull/4562) deps: `npm-package-arg@9.0.1`
  * [`b2a494283`](https://github.com/npm/cli/commit/b2a494283f45a25d1b87bc40bf2d68812871e89c) [#4562](https://github.com/npm/cli/pull/4562) deps: `normalize-package-data@4.0.0`
  * [`1cb88f4b3`](https://github.com/npm/cli/commit/1cb88f4b31019af9cb8eac8a46433b44bba9d061) [#4562](https://github.com/npm/cli/pull/4562) deps: `hosted-git-info@5.0.0`
  * [`f95396a03`](https://github.com/npm/cli/commit/f95396a033b75e2a3e9aa83f0b06c527641027a4) [#4562](https://github.com/npm/cli/pull/4562) deps: `cacache@16.0.1`
  * [`aec2bfecc`](https://github.com/npm/cli/commit/aec2bfecca4ad3ee7db4481cf068add9c42e7160) [#4585](https://github.com/npm/cli/pull/4585) deps: `cacache@16.0.2`
  * [`ed8ab63e4`](https://github.com/npm/cli/commit/ed8ab63e4a2c8e6527bf7d49736d1bbb6f0aead2) deps: `libnpmpack@4.0.2`
  * [`0b73bfa82`](https://github.com/npm/cli/commit/0b73bfa82d4eb826ec0dbda4cc457c94580e0d64) deps: `libnpmteam@4.0.2`
  * [`475d59b36`](https://github.com/npm/cli/commit/475d59b361ef9e260e21d39361baf92f2272f1d7) deps: `libnpmaccess@6.0.2`
  * [`7201c7395`](https://github.com/npm/cli/commit/7201c7395f66d3faf24b361e69555490d606ed91) deps: `libnpmsearch@5.0.2`
  * [`f5df358c3`](https://github.com/npm/cli/commit/f5df358c3af2c23e7818105608bcceabdd8b62fa) deps: `libnpmorg@4.0.2`
  * [`472e7dd7a`](https://github.com/npm/cli/commit/472e7dd7aa6935cb6b89ec78cbce45f75f3f0044) deps: `libnpmhook@8.0.2`
  * [`c901d7290`](https://github.com/npm/cli/commit/c901d7290ed09aefe3ba6e8c09cb3126f0d92f95) deps: `libnpmpublish@6.0.2`
  * [`aad53327f`](https://github.com/npm/cli/commit/aad53327f23b123d0e017338a9a1b65d40f21efe) deps: `@npmcli/arborist@5.0.3`
  * [`b40136bca`](https://github.com/npm/cli/commit/b40136bcaf32232e4cacdb517ce40f61871da159) deps: `libnpmdiff@4.0.2`
  * [`5d91201d1`](https://github.com/npm/cli/commit/5d91201d1c69e3c095a4eedf0f1d702f35b0d8c1) deps: `libnpmexec@4.0.2`

## v8.5.4 (2022-03-10)

### Bug Fixes

* [`fbdb43138`](https://github.com/npm/cli/commit/fbdb43138ab8e682efb7668767465e7066d43b9f)
  [#4529](https://github.com/npm/cli/pull/4529)
  fix(rebuild): don't run lifecycle scripts twice on linked deps
  ([@wraithgar](https://github.com/wraithgar))
* [`1c182e11d`](https://github.com/npm/cli/commit/1c182e11d524294d85348a3c2566f266bd281c00)
  [#4495](https://github.com/npm/cli/pull/4495)
  fix(doctor): don't retry ping
  ([@wraithgar](https://github.com/wraithgar))
* [`55ab38c53`](https://github.com/npm/cli/commit/55ab38c5337de76b739c4f0cdfb8932dc5420ce4)
  [#4495](https://github.com/npm/cli/pull/4495)
  fix(doctor): allow for missing local bin and `node_modules`
  ([@wraithgar](https://github.com/wraithgar))
* [`5c06a33e6`](https://github.com/npm/cli/commit/5c06a33e641594c5617a0606c338fc54c64d623b)
  [#4528](https://github.com/npm/cli/pull/4528)
  fix: clean up owner command and otplease
  ([@wraithgar](https://github.com/wraithgar))

### Documentation

* [`2485064da`](https://github.com/npm/cli/commit/2485064da590ef787e94a952e0bbdcd9f4880703)
  [#4524](https://github.com/npm/cli/pull/4524)
  docs: fix typo in configuring-npm/package-json.md
  ([@dlcmh](https://github.com/dlcmh))
* [`91f03ee61`](https://github.com/npm/cli/commit/91f03ee618bc635f9cfbded735fe98bbfa9d643f)
  [#4510](https://github.com/npm/cli/pull/4510)
  docs: standardize changelog heading
  ([@wraithgar](https://github.com/wraithgar))

### Dependencies

* [`377f55e0e`](https://github.com/npm/cli/commit/377f55e0e786ac6c26d64848a89ce720c5d478eb)
  [#4530](https://github.com/npm/cli/pull/4530)
  deps: `make-fetch-happen@10.0.5`
    * add code property to unsupported proxy url error
* [`40b7fbf67`](https://github.com/npm/cli/commit/40b7fbf670c8ba064b3a771981fa0510d63fb6ef)
  [#4531](https://github.com/npm/cli/pull/4531)
  deps: `read-package-json@4.1.2`
    * don't throw exception on invalid main attr
* [`d9dc70ce4`](https://github.com/npm/cli/commit/d9dc70ce4d632b8b0401c41e9a015b8083e87db1)
  [#4545](https://github.com/npm/cli/pull/4545)
  deps: `map-workspaces@2.0.2`
    * evaluate all patterns before throwing `EDUPLICATEWORKSPACE`
* [`70fcfb46b`](https://github.com/npm/cli/commit/70fcfb46bebc777e0ef6b36a47d9620807488acd)
  deps: `libnpmfund@3.0.1`
* [`621cd033f`](https://github.com/npm/cli/commit/621cd033f64f101084af83ff8a797f5415a3b70d)
  deps: `@npmcli/arborist@5.0.2`
* [`087fdc4cb`](https://github.com/npm/cli/commit/087fdc4cb4d6582b2b628087f866e8ca8bc00934)
  deps: `libnpmpublish@6.0.1`
* [`d24c6d288`](https://github.com/npm/cli/commit/d24c6d288b1cfe6dd893a8ffedb15cbe6837d545)
  deps: `libnpmhook@8.0.1`
* [`fa59830fc`](https://github.com/npm/cli/commit/fa59830fc429d354179853e8f9b9a32ef3444067)
  deps: `libnpmsearch@5.0.1`
* [`6d5f22b86`](https://github.com/npm/cli/commit/6d5f22b86006e7c563161837f56e47079e0fde4a)
  deps: `libnpmexec@4.0.1`
* [`69ea54350`](https://github.com/npm/cli/commit/69ea5435016a9d1c454af7253a80204dc9941380)
  deps: `libnpmaccess@6.0.1`
* [`4742d7cf3`](https://github.com/npm/cli/commit/4742d7cf3ad15f5263fd5fefd15c04f9871c58af)
  deps: `libnpmteam@4.0.1`
* [`fdd255ae9`](https://github.com/npm/cli/commit/fdd255ae9ebf41147085e74cec5c9f65eb5ff1de)
  deps: `libnpmorg@4.0.1`
* [`ed41bc101`](https://github.com/npm/cli/commit/ed41bc10182ffd1db66181c20db6c348dba6783e)
  deps: `libnpmdiff@4.0.1`
* [`21e241025`](https://github.com/npm/cli/commit/21e24102564e2f3c795312d256fade4228e67776)
  deps: `libnpmversion@3.0.1`
* [`ec7f36ff9`](https://github.com/npm/cli/commit/ec7f36ff9e6c973ae5d5998a783bcff16027c282)
  deps: `libnpmpack@4.0.1`
* [`ad4b56414`](https://github.com/npm/cli/commit/ad4b564148eaa6fdfe68e5b68f910e41e4e8ee14)
  deps: `gauge@4.0.3`

## v8.5.3 (2022-03-03)

### Bug Fixes

* [`defe79ad6`](https://github.com/npm/cli/commit/defe79ad6f2f4216bf5e0188256c77b49164eb94)
  [#4480](https://github.com/npm/cli/pull/4480)
  fix: publish of tarballs includes README in packument
  ([@fritzy](https://github.com/fritzy))
* [`45fc297f1`](https://github.com/npm/cli/commit/45fc297f12e63c026715945a186ba0ec4efbdedb)
  [#4479](https://github.com/npm/cli/pull/4479)
  fix: ignore implict workspace for some commands
  ([@fritzy](https://github.com/fritzy))
* [`a0900bdf1`](https://github.com/npm/cli/commit/a0900bdf1ab7a68988984735f1f3885d02ffb67f)
  [#4481](https://github.com/npm/cli/pull/4481)
  fix(ls): respect `--include-workspace-root`
  ([@fritzy](https://github.com/fritzy))
* [`0cfc155db`](https://github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754)
  [#4476](https://github.com/npm/cli/pull/4476)
  fix: set proper workspace repo urls in package.json
  ([@ljharb](https://github.com/ljharb))
* [`9e43de8a5`](https://github.com/npm/cli/commit/9e43de8a59e5bf354a9595ed8a79fedcec085aaa)
  [#4493](https://github.com/npm/cli/pull/4493)
  fix: ignore implicit workspace for whoami
  ([@nlf](https://github.com/nlf))

### Dependencies

* [`d13f067d9`](https://github.com/npm/cli/commit/d13f067d91283e1dec94780a3c007883de9edc46)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `@npmcli/run-script@3.0.1`
  ([@wraithgar](https://github.com/wraithgar))
* [`ce9a6eac0`](https://github.com/npm/cli/commit/ce9a6eac0c8329871664167c37f4982c5e443a2a)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `node-gyp@9.0.0`
  ([@wraithgar](https://github.com/wraithgar))
* [`bd660f5f1`](https://github.com/npm/cli/commit/bd660f5f1ccc1d9fa88085b168ea05b6dcf5826a)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `@npmcli/config@4.0.1`
* [`3c17b6965`](https://github.com/npm/cli/commit/3c17b6965f0c5fffd5ac908388568a307466a73f)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `make-fetch-happen@10.0.4`
* [`e9b69c4c5`](https://github.com/npm/cli/commit/e9b69c4c5454cc8b7d6cf2cbf1f09313f0d20afc)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `npm-registry-fetch@13.0.1`
* [`cf27ca888`](https://github.com/npm/cli/commit/cf27ca8884387f2b82f8f6900a29e4e41693e774)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `write-file-atomic@4.0.1`
* [`f3421921a`](https://github.com/npm/cli/commit/f3421921aa72ef570105474cdb2e48cec80de796)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `gauge@4.0.2`
* [`1dd2f7ee1`](https://github.com/npm/cli/commit/1dd2f7ee16a61024e520b3efa54f8cdba5458a16)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `socks@2.6.2`
* [`236e3b403`](https://github.com/npm/cli/commit/236e3b4030dd91397713eb02cdf2737dcc988fd7)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `minimatch@3.1.2`
  ([@wraithgar](https://github.com/wraithgar))
* [`10e1326d2`](https://github.com/npm/cli/commit/10e1326d2eb7ff2c70ee19907991b369476ccdd0)
  [#4490](https://github.com/npm/cli/pull/4490)
  deps: `lru-cache@7.4.0`

## v8.5.2 (2022-02-24)

### Bug Fixes

* [`9bdd1ace8`](https://github.com/npm/cli/commit/9bdd1ace86300a8ee562027bbc5cb57d62dc7ba8)
  [#4300](https://github.com/npm/cli/pull/4300)
  fix(arborist): use full location as tracker key when inflating
  ([@lukekarrys](https://github.com/lukekarrys)) ([@kirtangajjar](https://github.com/kirtangajjar))
* [`c9ff797e8`](https://github.com/npm/cli/commit/c9ff797e8b5e5a7b39ced04b1d3f8a0006993a1f)
  [#4457](https://github.com/npm/cli/pull/4457)
  fix: remove html comments from man entries
  ([@wraithgar](https://github.com/wraithgar))
* [`f4c5f0e52`](https://github.com/npm/cli/commit/f4c5f0e52679b1aa42db833fc23dc07d96cc904e)
  fix(arborist): fix unescaped periods (#4462)
  ([@lukekarrys](https://github.com/lukekarrys))
* [`c608512ed`](https://github.com/npm/cli/commit/c608512ed03ccf87dc989cec2849d14bf034513a)
  [#4468](https://github.com/npm/cli/pull/4468)
  fix: ignore integrity values for git dependencies
  ([@lukekarrys](https://github.com/lukekarrys))

### Documentation

* [`e83e5c9ba`](https://github.com/npm/cli/commit/e83e5c9bad93e598969088ae780149dbe34c6b5c)
  [#4435](https://github.com/npm/cli/pull/4435)
  docs: clarify npm init @latest behavior
  ([@wraithgar](https://github.com/wraithgar))
* [`d8fa9fa5e`](https://github.com/npm/cli/commit/d8fa9fa5e44d91e1c0170628d4839f7802c65a7f)
  [#4436](https://github.com/npm/cli/pull/4436)
  docs: explain $INIT_CWD on using scripts page
  ([@wraithgar](https://github.com/wraithgar))
* [`6b68c1aaa`](https://github.com/npm/cli/commit/6b68c1aaa282205eb4d47dbc81909c11851f7e06)
  [#4450](https://github.com/npm/cli/pull/4450)
  docs: auto-generate npm usage for each command
  ([@manekinekko](https://github.com/manekinekko))

### Dependencies

* [`d58e4442b`](https://github.com/npm/cli/commit/d58e4442b0a16c84219d5f80ab88ef68ad209918)
  deps `@npmcli/arborist@5.0.0`
* [`77399cb98`](https://github.com/npm/cli/commit/77399cb988d984133bfc2885a6407ffc56b9152d)
  deps: `libnpmaccess@6.0.0`
* [`9633752cd`](https://github.com/npm/cli/commit/9633752cd5c4a0d240adcb24f0ae7e3fafd122ba)
  deps: `libnpmdiff@4.0.0`
* [`938750581`](https://github.com/npm/cli/commit/9387505819f0e7e4b3d76dd3e2bd8636a1bb6306)
  deps: `libnpmexec@4.0.0`
* [`2c86feaf1`](https://github.com/npm/cli/commit/2c86feaf1f974ee510563c7d93c0dd26f6355b15)
  deps: `libnpmfund@3.0.0`
* [`1dab29805`](https://github.com/npm/cli/commit/1dab29805c820f82e4bae18123e911fec6948dfd)
  deps: `libnpmhook@8.0.0`
* [`cf273f1cf`](https://github.com/npm/cli/commit/cf273f1cf31775c8a73cc67b654faf87b44f7f79)
  deps: `libnpmorg@4.0.0`
* [`8b1d9636a`](https://github.com/npm/cli/commit/8b1d9636ad2374254263d154f2b4ca8ea6416f4c)
  deps: `libnpmpack@4.0.0`
* [`67aed0542`](https://github.com/npm/cli/commit/67aed05429163fc120e05e6fb15f8f3cd9c6ef22)
  deps: `libnpmpublish@6.0.0`
* [`8b26a6db1`](https://github.com/npm/cli/commit/8b26a6db13c37a6f0df86c54ca859ad2f9627825)
  deps: `libnpmsearch@5.0.0`
* [`0b2fa7fed`](https://github.com/npm/cli/commit/0b2fa7feda4643fe16c9a492497908f94d310dbd)
  deps: `libnpmteam@4.0.0`
* [`2646d199f`](https://github.com/npm/cli/commit/2646d199f26f77c4197ec0bcf30c3e452844c1ab)
  deps: `libnpmversion@3.0.0`
* [`5b29666e5`](https://github.com/npm/cli/commit/5b29666e566c09dc685108daaa20163dd58ade2b)
  [#4459](https://github.com/npm/cli/pull/4459)
  deps: `columnify@1.6.0 and dedupe vulnerable deps`

## v8.5.1 (2022-02-17)

### Dependencies

* [`54cda9697`](https://github.com/npm/cli/commit/54cda9697b776fae807966097315c7b836623743)
  [#4410](https://github.com/npm/cli/pull/4410)
  fix(arborist): do not audit in offline mode
  ([@mohd-akram](https://github.com/mohd-akram))
* [`fb13bdaf1`](https://github.com/npm/cli/commit/fb13bdaf12dde3ef5685a77354e51a9cfa579879)
  [#4403](https://github.com/npm/cli/pull/4403)
  deps: `@npmcli/ci-detect@2.0.0`
* [`702801002`](https://github.com/npm/cli/commit/702801002e99bf02dd4d6d1e447a5ab332d56c79)
  [#4415](https://github.com/npm/cli/pull/4415)
  deps: `make-fetch-happen@10.0.3`
* [`88bab3540`](https://github.com/npm/cli/commit/88bab354097023c96c49e78d7ee54159f495bf73)
  [#4416](https://github.com/npm/cli/pull/4416)
  deps: `gauge@4.0.1`

### Documentation

* [`20378c67c`](https://github.com/npm/cli/commit/20378c67cd533db514dd2aec7828c6d119e9d6c7)
  [#4423](https://github.com/npm/cli/pull/4423)
  docs: update documentation for ping
  ([@fhinkel](https://github.com/fhinkel))
* [`408d2fc15`](https://github.com/npm/cli/commit/408d2fc150185ef66125f7d6bdb1c25edb71bba3)
  [#4426](https://github.com/npm/cli/pull/4426)
  docs: update workspaces guide for consistency
  ([@bnb](https://github.com/bnb))
* [`9275856eb`](https://github.com/npm/cli/commit/9275856eb75e7c394a3c7617c2b495aba35ee2de)
  [#4424](https://github.com/npm/cli/pull/4424)
  docs: update usage example for npm pkg
  ([@manekinekko](https://github.com/manekinekko))
* [`20c83fae7`](https://github.com/npm/cli/commit/20c83fae76ff4a051e4f6542a328f1c00cf071bb)
  [#4428](https://github.com/npm/cli/pull/4428)
  docs: update docs for npm install <folder>
  ([@manekinekko](https://github.com/manekinekko))

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
