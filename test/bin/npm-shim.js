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

for (const bin of ['npm', 'npx']) {
  const cliName = `${bin}-cli.js`
  const args = ['install', '--save-dev', 'a b', '']

  t.test(`runs the ${bin} in the global prefix if there is one`, async t => {
    const prefix = t.testdir({
      node_modules: { npm: { bin: { 'npm-cli.js': cli('global npm'), 'npx-cli.js': cli('global npx') } } },
    })
    const { seen, errors, exits } = await mockShim(t, {
      argv: ['node', join(BIN, 'npm-shim.js'), bin, ...args],
      prefix,
    })
    const globalCli = join(prefix, 'node_modules', 'npm', 'bin', cliName)
    t.strictSame(seen, [{ cli: `global ${bin}`, argv: ['node', globalCli, ...args] }])
    t.strictSame(errors, [])
    t.strictSame(exits, [])
  })

  t.test(`runs its own ${bin} if the global prefix has none`, async t => {
    const { seen, errors, exits } = await mockShim(t, {
      argv: ['node', join(BIN, 'npm-shim.js'), bin, ...args],
      prefix: t.testdir({}),
    })
    t.strictSame(seen, [], 'the global prefix cli is not loaded')
    t.strictSame(process.argv, ['node', join(BIN, cliName), ...args], `argv as seen by ${cliName}`)
    t.strictSame(errors, [])
    t.strictSame(exits, [])
  })
}

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
