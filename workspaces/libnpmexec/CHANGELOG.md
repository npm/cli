# Changelog

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
