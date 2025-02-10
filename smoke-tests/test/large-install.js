const t = require('tap')
const path = require('node:path')
const setup = require('./fixtures/setup.js')

const getFixture = (p) => require(
  path.resolve(__dirname, './fixtures/large-install', p))

const runTest = async (t, { lowMemory } = {}) => {
  const { npm } = await setup(t, {
    // This test relies on the actual production registry
    mockRegistry: false,
    testdir: {
      project: {
        'package.json': getFixture('package.json'),
        ...lowMemory ? {} : { 'package-lock.json': getFixture('package-lock.json') },
      },
    },
  })
  return npm('install', '--no-audit', '--no-fund', {
    env: lowMemory ? { NODE_OPTIONS: '--max-old-space-size=500' } : {},
  })
}

// This test was originally created for https://github.com/npm/cli/issues/6763
// but was later removed after the corresponding Node bug was fixed and the test
// started flaking. These flakes were most likely a sign that there was actually
// a bug where maxSockets were not being respected  https://github.com/npm/cli/issues/7072.
// So now this test has been brought back and if it does start flaking again it
// should be investigated.
t.test('large install', async t => {
  const { stdout } = await runTest(t)
  // As a bonus this test asserts that this package-lock always
  // installs the same number of packages.
  t.match(stdout, `added 126${process.platform === 'linux' ? 4 : 5} packages in`)
})

t.test('large install, no lock and low memory', async t => {
  // Run the same install but with no lockfile and constrained max-old-space-size
  const { stdout } = await runTest(t, { lowMemory: true })
  t.match(stdout, /added \d+ packages/)
})
