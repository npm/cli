const t = require('tap')

const load = t => {
  const calls = []
  const preflight = t.mock('../../../lib/utils/trust-policy-preflight.js', {
    '@npmcli/arborist/lib/trust-policy-verifier.js': {
      verifyTrustPolicy: async (tree, options) => calls.push({ tree, options }),
    },
  })
  return { preflight, calls }
}

t.test('no-op when trust policy is disabled', async t => {
  const { preflight, calls } = load(t)
  let builds = 0
  const arb = { idealTree: null,
    buildIdealTree: async () => {
      builds++
    } }
  await preflight({ arb, options: {} })
  t.equal(builds, 0)
  t.equal(calls.length, 0)
})

t.test('builds and verifies the ideal tree for install-style calls', async t => {
  const { preflight, calls } = load(t)
  const idealTree = { inventory: new Map() }
  let builds = 0
  const arb = {
    idealTree: null,
    buildIdealTree: async options => {
      builds++
      t.equal(options.trustPolicy, 'no-downgrade')
      arb.idealTree = idealTree
    },
  }
  const options = { trustPolicy: 'no-downgrade' }
  await preflight({ arb, options })
  t.equal(builds, 1)
  t.equal(calls.length, 1)
  t.equal(calls[0].tree, idealTree)
  t.strictSame(calls[0].options, options)
})

t.test('reuses a prebuilt ideal tree for ci-style calls', async t => {
  const { preflight, calls } = load(t)
  const idealTree = { inventory: new Map() }
  let builds = 0
  const arb = { idealTree,
    buildIdealTree: async () => {
      builds++
    } }
  const options = { trustPolicy: 'no-downgrade', trustPolicyExclude: ['pkg@1'] }
  await preflight({ arb, options })
  t.equal(builds, 0)
  t.equal(calls.length, 1)
  t.equal(calls[0].tree, idealTree)
  t.strictSame(calls[0].options, options)
})

t.test('uses Arborist constructor options for ci-style calls', async t => {
  const { preflight, calls } = load(t)
  const idealTree = { inventory: new Map() }
  const arb = {
    idealTree,
    options: {
      trustPolicy: 'no-downgrade',
      trustPolicyExclude: ['pkg@1'],
      registry: 'https://registry.example.test/',
    },
  }

  await preflight({ arb, options: { packageLock: true } })

  t.equal(calls.length, 1)
  t.equal(calls[0].tree, idealTree)
  t.strictSame(calls[0].options, {
    trustPolicy: 'no-downgrade',
    trustPolicyExclude: ['pkg@1'],
    registry: 'https://registry.example.test/',
    packageLock: true,
  })
})
