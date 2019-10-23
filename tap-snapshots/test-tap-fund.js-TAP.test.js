/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/fund.js TAP fund containing multi-level nested deps with no funding > should omit dependencies with no funding declared 1`] = `
nested-no-funding-packages@1.0.0
├─┬ lorem@1.0.0
│ └── url: https://example.com/lorem
└─┬ bar@1.0.0
  ├── type: individual
  ├── url: http://example.com/donate
  └─┬ sub-bar@1.0.0
    └── url: https://example.com/sponsor


`

exports[`test/tap/fund.js TAP fund containing multi-level nested deps with no funding, using --json option > should omit dependencies with no funding declared 1`] = `
{
  length: 3,
  name: 'nested-no-funding-packages',
  version: '1.0.0',
  dependencies: {
    lorem: { version: '1.0.0', funding: { url: 'https://example.com/lorem' } },
    bar: {
      version: '1.0.0',
      funding: { type: 'individual', url: 'http://example.com/donate' },
      dependencies: {
        'sub-bar': {
          version: '1.0.0',
          funding: { url: 'https://example.com/sponsor' }
        }
      }
    }
  }
}
`

exports[`test/tap/fund.js TAP fund does not support global > should throw EFUNDGLOBAL error 1`] = `

`

exports[`test/tap/fund.js TAP fund does not support global > should write error msgs to stderr 1`] = `
npm ERR! code EFUNDGLOBAL
npm ERR! \`npm fund\` does not support globals
`

exports[`test/tap/fund.js TAP fund does not support global, using --json option > should throw EFUNDGLOBAL error 1`] = `
{
  error: {
    code: 'EFUNDGLOBAL',
    summary: '\`npm fund\` does not support globals',
    detail: ''
  }
}
`

exports[`test/tap/fund.js TAP fund does not support global, using --json option > should write error msgs to stderr 1`] = `
npm ERR! code EFUNDGLOBAL
npm ERR! \`npm fund\` does not support globals
`

exports[`test/tap/fund.js TAP fund in which same maintainer owns all its deps > should print stack packages together 1`] = `
maintainer-owns-all-deps@1.0.0, dep-bar@1.0.0, dep-sub-foo@1.0.0, dep-foo@1.0.0
├── type: individual
└── url: http://example.com/donate


`

exports[`test/tap/fund.js TAP fund in which same maintainer owns all its deps, using --json option > should print stack packages together 1`] = `
{
  length: 3,
  name: 'maintainer-owns-all-deps',
  version: '1.0.0',
  funding: { type: 'individual', url: 'http://example.com/donate' },
  dependencies: {
    'dep-bar': {
      version: '1.0.0',
      funding: { type: 'individual', url: 'http://example.com/donate' }
    },
    'dep-foo': {
      version: '1.0.0',
      funding: { type: 'individual', url: 'http://example.com/donate' },
      dependencies: {
        'dep-sub-foo': {
          version: '1.0.0',
          funding: { type: 'individual', url: 'http://example.com/donate' }
        }
      }
    }
  }
}
`

exports[`test/tap/fund.js TAP fund using package argument with no browser > should open funding url 1`] = `
individual funding available at the following URL:

http://example.com/donate

`

exports[`test/tap/fund.js TAP fund using package argument with no browser, using --json option > should open funding url 1`] = `
{
  title: 'individual funding available at the following URL',
  url: 'http://example.com/donate'
}
`

exports[`test/tap/fund.js TAP fund with no package containing funding > should print empty funding info 1`] = `
no-funding-package@0.0.0


`

exports[`test/tap/fund.js TAP fund with no package containing funding, using --json option > should print empty funding info 1`] = `
{
  length: 0,
  name: 'no-funding-package',
  version: '0.0.0',
  dependencies: {}
}
`
