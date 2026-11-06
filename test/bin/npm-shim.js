const t = require('tap')
const { join } = require('node:path')
const mockGlobals = require('@npmcli/mock-globals')
const tmock = require('../fixtures/tmock')

const BIN = join(__dirname, '../../bin')

// the cli files record what they see when they are loaded
const cli = (name) => `global.npmShimSeen.push({ cli: ${JSON.stringify(name)}, argv: process.argv.slice() })`

const mockShim = async (t, { argv, prefix, prefixError }) => {
  const seen = []
  const errors = []
  const exits = []
  mockGlobals(t, {
    npmShimSeen: seen,
    'process.argv': argv,
    'console.error': (...msg) => errors.push(msg),
    'process.exit': (code) => exits.push(code),
  })
  // the npm that came with node, next to the shim; process.argv[1] tells
  // which cli was loaded, since the shim sets it right before the require
  tmock(t, '{BIN}/npm-shim.js', {
    '{LIB}/cli/global-prefix.js': async () => {
      if (prefixError) {
        throw prefixError
      }
      return prefix
    },
    '{BIN}/npm-cli.js': {},
    '{BIN}/npx-cli.js': {},
  })
  await new Promise(resolve => setImmediate(resolve))
  return { seen, errors, exits }
}

t.test('runs the npm in the global prefix if there is one', async t => {
  const prefix = t.testdir({
    node_modules: { npm: { bin: { 'npm-cli.js': cli('global npm'), 'npx-cli.js': cli('global npx') } } },
  })
  const npmCli = join(prefix, 'node_modules', 'npm', 'bin', 'npm-cli.js')
  const { seen, errors, exits } = await mockShim(t, {
    argv: ['node', join(BIN, 'npm-shim.js'), 'npm', 'install', '--save-dev', 'a b', ''],
    prefix,
  })
  t.strictSame(seen, [{ cli: 'global npm', argv: ['node', npmCli, 'install', '--save-dev', 'a b', ''] }])
  t.strictSame(errors, [])
  t.strictSame(exits, [])
})

t.test('runs the npx in the global prefix if there is one', async t => {
  const prefix = t.testdir({
    node_modules: { npm: { bin: { 'npm-cli.js': cli('global npm'), 'npx-cli.js': cli('global npx') } } },
  })
  const npxCli = join(prefix, 'node_modules', 'npm', 'bin', 'npx-cli.js')
  const { seen } = await mockShim(t, {
    argv: ['node', join(BIN, 'npm-shim.js'), 'npx', '--no-install', 'tsc', '--version'],
    prefix,
  })
  t.strictSame(seen, [{ cli: 'global npx', argv: ['node', npxCli, '--no-install', 'tsc', '--version'] }])
})

t.test('runs its own npm if the global prefix has none', async t => {
  const prefix = t.testdir({})
  const { seen, errors, exits } = await mockShim(t, {
    argv: ['node', join(BIN, 'npm-shim.js'), 'npm', '--version'],
    prefix,
  })
  t.strictSame(seen, [], 'the global prefix npm is not loaded')
  t.strictSame(process.argv, ['node', join(BIN, 'npm-cli.js'), '--version'], 'argv as seen by npm-cli.js')
  t.strictSame(errors, [])
  t.strictSame(exits, [])
})

t.test('runs its own npx if the global prefix has none', async t => {
  const prefix = t.testdir({})
  const { seen } = await mockShim(t, {
    argv: ['node', join(BIN, 'npm-shim.js'), 'npx', 'cowsay', 'hi'],
    prefix,
  })
  t.strictSame(seen, [], 'the global prefix npx is not loaded')
  t.strictSame(process.argv, ['node', join(BIN, 'npx-cli.js'), 'cowsay', 'hi'], 'argv as seen by npx-cli.js')
})

t.test('a global prefix with only npx does not count for npm', async t => {
  const prefix = t.testdir({
    node_modules: { npm: { bin: { 'npx-cli.js': cli('global npx') } } },
  })
  const { seen } = await mockShim(t, {
    argv: ['node', join(BIN, 'npm-shim.js'), 'npm', 'ls'],
    prefix,
  })
  t.strictSame(seen, [])
  t.strictSame(process.argv, ['node', join(BIN, 'npm-cli.js'), 'ls'])
})

t.test('exits 1 if the global prefix cannot be determined', async t => {
  const prefixError = new Error('bad config')
  const { seen, errors, exits } = await mockShim(t, {
    argv: ['node', join(BIN, 'npm-shim.js'), 'npm', '--version'],
    prefixError,
  })
  t.strictSame(seen, [], 'no cli is loaded')
  t.strictSame(errors, [[prefixError], ['Could not determine Node.js install directory']])
  t.strictSame(exits, [1])
})
