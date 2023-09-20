const t = require('tap')
const path = require('path')
const semver = require('semver')
const setup = require('./fixtures/setup.js')

const nodeVersion = semver.parse(process.version)

const getFixture = (p) => require(
  path.resolve(__dirname, './fixtures/max-listeners', p))

const runTest = async (t, { env } = {}) => {
  const { npm } = await setup(t, {
    mockRegistry: false,
    testdir: {
      project: {
        'package.json': getFixture('package.json'),
        'package-lock.json': getFixture('package-lock.json'),
      },
    },
  })

  return npm('install', { stderr: true, env })
}

// https://github.com/npm/cli/issues/6763
t.test('no max listeners', async t => {
  // in node 20.4.0 and above (20.6.1 at the time of this test) installs show
  // MaxListenersExceeded warnings during some installs. these go away with the
  // --no-network-family-autoselection flag. this test documents this behavior
  // so we can fix this behavior at some point either in npm or node
  const isNode204 = semver.gte(nodeVersion, '20.4.0')

  await t[isNode204 ? 'skip' : 'test']('by default', async t => {
    const { stderr } = await runTest(t)

    t.ok(!stderr.includes('MaxListenersExceededWarning'))
  })

  if (isNode204) {
    await t.test('with --no-network-family-autoselection', async t => {
      const { stderr } = await runTest(t, {
        env: { NODE_OPTIONS: '--no-network-family-autoselection' },
      })

      t.ok(!stderr.includes('MaxListenersExceededWarning'))
    })
  }
})
