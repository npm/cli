const { resolve, relative } = require('path')

// Create an override to lockdown a file to es6 syntax only
// and only allow it to require an allowlist of files
const rel = (p) => relative(__dirname, resolve(__dirname, p))
const braces = (a) => a.length > 1 ? `{${a.map(rel).join(',')}}` : a[0]

const es6Files = (e) => Object.entries(e).map(([file, allow]) => ({
  files: `./${rel(file)}`,
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: Array.isArray(allow) ? {
    'node/no-restricted-require': ['error', [{
      name: ['/**', `!${__dirname}/${braces(allow)}`],
      message: `This file can only require: ${allow.join(',')}`,
    }]],
  } : {},
}))

module.exports = {
  rules: {
    'no-console': 'error',
  },
  overrides: es6Files({
    'index.js': ['lib/cli.js'],
    'bin/npm-cli.js': ['lib/cli.js'],
    'lib/cli.js': ['lib/cli/validate-engines.js'],
    'lib/cli/validate-engines.js': ['package.json'],
    // TODO: This file should also have its requires restricted as well since it
    // is an entry point but it currently pulls in config definitions which have
    // a large require graph, so that is not currently feasible. A future config
    // refactor should keep that in mind and see if only config definitions can
    // be exported in a way that is compatible with ES6.
    'bin/npx-cli.js': null,
  }),
}
