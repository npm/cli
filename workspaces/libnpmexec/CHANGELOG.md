# Changelog

### [4.0.12](https://github.com/npm/cli/compare/libnpmexec-v4.0.11...libnpmexec-v4.0.12) (2022-08-24)


### Dependencies

* @npmcli/eslint-config@3.1.0 ([8ab12dc](https://github.com/npm/cli/commit/8ab12dc32b26db770b868cf694cedab38f4e7460))

## [4.0.11](https://github.com/npm/cli/compare/libnpmexec-v4.0.10...libnpmexec-v4.0.11) (2022-08-17)


### Bug Fixes

* don't prompt on `npm exec [directory]` ([#5298](https://github.com/npm/cli/issues/5298)) ([6eba131](https://github.com/npm/cli/commit/6eba13164d84efb34554c7dddeb2dbfed063ac0a))
* npm exec does not use script-shell option to run commands ([#5297](https://github.com/npm/cli/issues/5297)) ([e5a9162](https://github.com/npm/cli/commit/e5a9162a9dae9471e1ea77ad38baa02bb8d9852e))

## [4.0.10](https://github.com/npm/cli/compare/libnpmexec-v4.0.9...libnpmexec-v4.0.10) (2022-08-10)


### Bug Fixes

* ignore global prefix if --prefix is used ([#5291](https://github.com/npm/cli/issues/5291)) ([daaf461](https://github.com/npm/cli/commit/daaf4619c85ecf62346770735cfa8e2ddecbef8b))
* look up local command bins from local tree ([#5273](https://github.com/npm/cli/issues/5273)) ([c992fd6](https://github.com/npm/cli/commit/c992fd6757505974dc8e92a9e2886d2233e098eb))
* only try to run global bin if the bin name exists ([#5253](https://github.com/npm/cli/issues/5253)) ([95ae9f2](https://github.com/npm/cli/commit/95ae9f2e2555ef592777399bf8fee5206d77f41d))

## [4.0.9](https://github.com/npm/cli/compare/libnpmexec-v4.0.8...libnpmexec-v4.0.9) (2022-08-03)


### Bug Fixes

* fix exec tests and  clean up workspace-location-msg ([3b30af2](https://github.com/npm/cli/commit/3b30af25e93665f5aa21897910a65d7f26bbd066))
* properly find and run global scoped packages ([#5250](https://github.com/npm/cli/issues/5250)) ([19a8346](https://github.com/npm/cli/commit/19a834610d154f36748536b27aed13bfdb5ee748))
* properly find locally/globally/npxCache packages ([ea44995](https://github.com/npm/cli/commit/ea449954844f21abbf984e09e421f0e03485a535))
* use binPaths ([19f1497](https://github.com/npm/cli/commit/19f1497322411f1566885bd53e63dc39f0df27ea))


### Dependencies

* @npmcli/run-script@4.2.0 ([d0be9a2](https://github.com/npm/cli/commit/d0be9a2bb53e74b30e13751afd1f6924990c8422))
* add @npmcli/fs@2.1.1 ([c18dbc4](https://github.com/npm/cli/commit/c18dbc4393491e02532d698351747307848d2e20))
* add semver@7.3.7 ([cd6bafd](https://github.com/npm/cli/commit/cd6bafdfbbd7a054709c11850b58f7dbc26eb8da))

## [4.0.8](https://github.com/npm/cli/compare/libnpmexec-v4.0.7...libnpmexec-v4.0.8) (2022-06-23)


### Dependencies

* @npmcli/run-script@4.1.3 ([#5064](https://github.com/npm/cli/issues/5064)) ([f59a114](https://github.com/npm/cli/commit/f59a114ffe3d1f86ccb2e52a4432292ab76852cc))

## [4.0.7](https://github.com/npm/cli/compare/libnpmexec-v4.0.6...libnpmexec-v4.0.7) (2022-06-22)


### Dependencies

* @npmcli/run-script@4.1.0 ([2c06cee](https://github.com/npm/cli/commit/2c06ceee82dd813c0ae84cc0b09e6941cfc5533e))
* pacote@13.6.1 ([2e50cb8](https://github.com/npm/cli/commit/2e50cb83e84cf25fee93ba0ca5a0343fbdb33c41))

### [4.0.6](https://github.com/npm/cli/compare/libnpmexec-v4.0.5...libnpmexec-v4.0.6) (2022-06-01)


### Bug Fixes

* **libnpmexec:** fix bug not install latest pkg ([#4929](https://github.com/npm/cli/issues/4929)) ([fcc72dd](https://github.com/npm/cli/commit/fcc72dd8791187f4b3d8705fb23c2744c83ef943))

### [4.0.5](https://github.com/npm/cli/compare/libnpmexec-v4.0.4...libnpmexec-v4.0.5) (2022-04-26)


### Dependencies

* npmlog@6.0.2 ([5e31322](https://github.com/npm/cli/commit/5e313223100db1207818d756b081eaba3468b273))

### [4.0.4](https://github.com/npm/cli/compare/libnpmexec-v4.0.3...libnpmexec-v4.0.4) (2022-04-19)


### Bug Fixes

* **exec:** workspaces support ([6253d19](https://github.com/npm/cli/commit/6253d1968d8390ea6b16604ff3abb5e6509349c9))
* **libnpmexec:** fix read mixed local/registry pkg ([4a46a27](https://github.com/npm/cli/commit/4a46a27f2b968e2f8c1f4821508f93013738c482))

### [4.0.3](https://github.com/npm/cli/compare/libnpmexec-v4.0.2...libnpmexec-v4.0.3) (2022-04-06)


### Bug Fixes

* update readme badges ([#4658](https://github.com/npm/cli/issues/4658)) ([2829cb2](https://github.com/npm/cli/commit/2829cb28a432b5ff7beeeb3bf3e7e2e174c1121d))


### Dependencies

* @npmcli/template-oss@3.2.1 ([aac01b8](https://github.com/npm/cli/commit/aac01b89caf6336a2eb34d696296303cdadd5c08))
* @npmcli/template-oss@3.2.2 ([#4639](https://github.com/npm/cli/issues/4639)) ([a59fd2c](https://github.com/npm/cli/commit/a59fd2cb863245fce56f96c90ac854e62c5c4d6f))

### [4.0.2](https://www.github.com/npm/cli/compare/libnpmexec-v4.0.1...libnpmexec-v4.0.2) (2022-03-15)


### Dependencies

* npm-package-arg@9.0.1 ([9555a5f](https://www.github.com/npm/cli/commit/9555a5f1d135aa1b8f7374273403efe41e99ee26))
* pacote@13.0.4 ([6d31450](https://www.github.com/npm/cli/commit/6d3145014861b4198c16d7772d809fd037ece289))
* pacote@13.0.5 ([340fa51](https://www.github.com/npm/cli/commit/340fa51f423a518a96c8015a67d8f6144a2e8051))

### [4.0.1](https://www.github.com/npm/cli/compare/libnpmexec-vlibnpmexec@4.0.0...libnpmexec-v4.0.1) (2022-03-03)


### Bug Fixes

* set proper workspace repo urls in package.json ([#4476](https://www.github.com/npm/cli/issues/4476)) ([0cfc155](https://www.github.com/npm/cli/commit/0cfc155db5f11ce23419e440111d99a63bf39754))

## v2.0.0

- Added a new required `npxCache` option

## v1.2.0

- Added a default value to `scriptShell` option

## v1.1.0

- Add add walk up dir lookup logic to satisfy local bins,
similar to `@npmcli/run-script`

## v1.0.1

- Fix `scriptShell` option name.

## v1.0.0

- Initial implementation, moves the code that used to live in the **npm cli**,
ref: https://github.com/npm/cli/blob/release/v7.10.0/lib/exec.js into this
separate module, providing a programmatic API to the **npm exec** functionality.
