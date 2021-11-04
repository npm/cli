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
