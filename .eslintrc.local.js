const { resolve, relative } = require('path')

// Create an override to lockdown a file to es6 syntax only
// and only allow it to require an allowlist of files
const res = (p) => resolve(__dirname, p)
const rel = (p) => relative(__dirname, res(p))
const braces = (a) => a.length > 1 ? `{${a.map(rel).join(',')}}` : a[0]

const es6Files = (e) => Object.entries(e).map(([file, allow]) => ({
  files: `./${rel(file)}`,
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    'node/no-restricted-require': ['error', [{
      name: ['/**', `!${__dirname}/${braces(allow)}`],
      message: `This file can only require: ${allow.join(',')}`,
    }]],
  },
}))

module.exports = {
  rules: {
    'no-console': 'error',
  },
  overrides: es6Files({
    'index.js': ['lib/cli/validate-engines.js'],
    'lib/cli/validate-engines.js': ['package.json', 'lib/cli/index.js'],
  }),
}
