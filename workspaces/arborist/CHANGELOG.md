# CHANGELOG

## 1.0.0 (2022-03-03)


### ⚠ BREAKING CHANGES

* **arborist:** this drops support for the `log` property
* **arborist:** the log option is no longer passed to the updated deps

### Features

* **arborist:** add named updates validation ([#4307](https://www.github.com/npm/cli/issues/4307)) ([fbe48a8](https://www.github.com/npm/cli/commit/fbe48a84047e0c5de31bdaa84707f0f8fdcef71d))
* **arborist:** refactor arborist bin to use consistent timing/logging ([d438d61](https://www.github.com/npm/cli/commit/d438d61d4f689966de8f964afe212d1319b8d460))


### Bug Fixes

* added arborist action and updated template-oss ([#4215](https://www.github.com/npm/cli/issues/4215)) ([aa538df](https://www.github.com/npm/cli/commit/aa538df4c19f46d2e24e2635d1214176c662fcea))
* **arborist:** check if a spec is a workspace before fetching a manifest, closes [#3637](https://www.github.com/npm/cli/issues/3637) ([#4371](https://www.github.com/npm/cli/issues/4371)) ([2ba09cc](https://www.github.com/npm/cli/commit/2ba09cc0d7d56a064aa67bbb1881d381e6504888))
* **arborist:** convert all sorting to string-locale-compare ([#4465](https://www.github.com/npm/cli/issues/4465)) ([1b4385f](https://www.github.com/npm/cli/commit/1b4385f85e8f6dd5015080cdd3e02a8fa3749ffd))
* **arborist:** correctly load overrides on workspace edges, closes [#4205](https://www.github.com/npm/cli/issues/4205) ([fabcf43](https://www.github.com/npm/cli/commit/fabcf431a63ecf93b56ae5d9a05ad4e7ef280c2a))
* **arborist:** do not audit in offline mode ([#4410](https://www.github.com/npm/cli/issues/4410)) ([54cda96](https://www.github.com/npm/cli/commit/54cda9697b776fae807966097315c7b836623743))
* **arborist:** ensure indentation is preserved ([#4218](https://www.github.com/npm/cli/issues/4218)) ([510f0ec](https://www.github.com/npm/cli/commit/510f0ecbc9970ed8c8993107cc03cf27b7b996dc))
* **arborist:** fix superfluous arguments ([#4464](https://www.github.com/npm/cli/issues/4464)) ([63b3557](https://www.github.com/npm/cli/commit/63b35578bd759cb5f3edaaef1c1122ecd0b27f48))
* **arborist:** fix unescaped periods ([#4462](https://www.github.com/npm/cli/issues/4462)) ([f4c5f0e](https://www.github.com/npm/cli/commit/f4c5f0e52679b1aa42db833fc23dc07d96cc904e))
* **arborist:** load actual tree on named updates ([1f853f8](https://www.github.com/npm/cli/commit/1f853f8bf7cecd1222703dde676a4b664526141d))
* **arborist:** prioritize valid workspace nodes ([#4230](https://www.github.com/npm/cli/issues/4230)) ([c99c215](https://www.github.com/npm/cli/commit/c99c2151a868672c017f64ff0ecb12149a2fb095)), closes [#3637](https://www.github.com/npm/cli/issues/3637)
* **arborist:** save bundleDependencies to package.json when reifying ([e631faf](https://www.github.com/npm/cli/commit/e631faf7b5f414c233d723ee11413264532b37de))
* **arborist:** shrinkwrap throws when trying to read a folder without permissions ([#4258](https://www.github.com/npm/cli/issues/4258)) ([8c3b143](https://www.github.com/npm/cli/commit/8c3b143ca20d0da56c0ce2764e288a4c203b9f93))
* **arborist:** update save exact ([b51b29c](https://www.github.com/npm/cli/commit/b51b29c563fa97aa4fbf38250d1f04e879a8d961))
* **arborist:** use full location as tracker key when inflating ([#4300](https://www.github.com/npm/cli/issues/4300)) ([9bdd1ac](https://www.github.com/npm/cli/commit/9bdd1ace86300a8ee562027bbc5cb57d62dc7ba8)), closes [#4273](https://www.github.com/npm/cli/issues/4273) [#4298](https://www.github.com/npm/cli/issues/4298)
* ignore integrity values for git dependencies ([#4468](https://www.github.com/npm/cli/issues/4468)) ([c608512](https://www.github.com/npm/cli/commit/c608512ed03ccf87dc989cec2849d14bf034513a))
* npm update --save ([#4223](https://www.github.com/npm/cli/issues/4223)) ([cfd59b8](https://www.github.com/npm/cli/commit/cfd59b8c81078f842328b13a23a234150842cd58))
* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))


* **arborist:** remove log option ([eef16c1](https://www.github.com/npm/cli/commit/eef16c18aacfbfed8bcfc72407d2a1b0c5ea00bc))


### Dependencies

* @npmcli/arborist@4.3.1 ([8732f39](https://www.github.com/npm/cli/commit/8732f393ee547e2eada4317613599517c1d8ec0a))
* @npmcli/arborist@5.0.0 ([d58e444](https://www.github.com/npm/cli/commit/d58e4442b0a16c84219d5f80ab88ef68ad209918))
* **arborist:** update to latest major versions of npm deps ([e5b4fa6](https://www.github.com/npm/cli/commit/e5b4fa6251f0c6b16d84d46d62f5b98ad755385f))
* bin-links@3.0.0 write-file-atomic@4.0.0 ([#4254](https://www.github.com/npm/cli/issues/4254)) ([2ef9f98](https://www.github.com/npm/cli/commit/2ef9f9847c11fe8c0c0494558fe77c15ac4dbc80))
* npm-registry-fetch@12.0.1 ([1bfc507](https://www.github.com/npm/cli/commit/1bfc507f2a5afa02f04d4dea2fc6d151d4fef3ac))

## 2.0

* BREAKING CHANGE: root node is now included in inventory
* All parent/target/fsParent/etc. references set in `root` setter, rather
  than the hodgepodge of setters that existed before.
* `treeCheck` function added, to enforce strict correctness guarantees when
  `ARBORIST_DEBUG=1` in the environment (on by default in Arborist tests).

## 1.0

* Release for npm v7 beta
* Fully functional

## 0.0

* Proof of concept
* Before this, it was [`read-package-tree`](http://npm.im/read-package-tree)
