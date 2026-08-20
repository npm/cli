
const t = require('tap')
const pacote = require('pacote')
const {
  checkTrustDowngrade,
  getTrustEvidence,
  isTrustPolicyExcluded,
  registrySpecForNode,
  verifyTrustPolicy,
} = require('../lib/trust-policy.js')

const provenance = {
  dist: {
    attestations: {
      provenance: {
        url: 'https://registry.example.test/attestations',
      },
    },
  },
}

const trustedPublisher = {
  ...provenance,
  _npmUser: {
    trustedPublisher: {
      id: 'github',
    },
  },
}

const packument = ({ current = {}, prior = provenance } = {}) => ({
  name: 'example-package',
  time: {
    '1.0.0': '2026-01-01T00:00:00.000Z',
    '2.0.0': '2026-02-01T00:00:00.000Z',
  },
  versions: {
    '1.0.0': prior,
    '2.0.0': current,
  },
})

const registryNode = (overrides = {}) => ({
  isRoot: false,
  isWorkspace: false,
  isLink: false,
  path: '/tmp/project/node_modules/example-package',
  resolved: 'https://registry.npmjs.org/example-package/-/example-package-2.0.0.tgz',
  packageName: 'example-package',
  version: '2.0.0',
  package: {
    name: 'example-package',
    version: '2.0.0',
  },
  ...overrides,
})

const treeWith = (...nodes) => ({
  inventory: new Map(nodes.map((node, index) => [String(index), node])),
})

t.test('detects trust evidence', t => {
  t.equal(getTrustEvidence({}), 'none')
  t.equal(getTrustEvidence(provenance), 'provenance')
  t.equal(getTrustEvidence(trustedPublisher), 'trustedPublisher')
  t.end()
})

t.test('rejects provenance downgrade to no evidence', t => {
  t.throws(
    () => checkTrustDowngrade(packument(), '2.0.0'),
    {
      code: 'ETRUSTDOWNGRADE',
      package: 'example-package',
      version: '2.0.0',
      previousTrust: 'provenance',
      currentTrust: 'none',
    }
  )
  t.end()
})

t.test('rejects trusted publisher downgrade to provenance', t => {
  t.throws(
    () => checkTrustDowngrade(packument({ current: provenance, prior: trustedPublisher }), '2.0.0'),
    {
      code: 'ETRUSTDOWNGRADE',
      previousTrust: 'trustedPublisher',
      currentTrust: 'provenance',
    }
  )
  t.end()
})

t.test('accepts equal or stronger trust', t => {
  t.doesNotThrow(() => checkTrustDowngrade(packument({ current: provenance }), '2.0.0'))
  t.doesNotThrow(() => checkTrustDowngrade(packument({ current: trustedPublisher }), '2.0.0'))
  t.doesNotThrow(() => checkTrustDowngrade(packument({ current: provenance, prior: {} }), '2.0.0'))
  t.end()
})

t.test('uses publish order rather than semver order', t => {
  const meta = {
    name: 'example-package',
    time: {
      '2.0.0': '2026-01-01T00:00:00.000Z',
      '1.5.0': '2026-02-01T00:00:00.000Z',
    },
    versions: {
      '2.0.0': provenance,
      '1.5.0': {},
    },
  }
  t.throws(() => checkTrustDowngrade(meta, '1.5.0'), { code: 'ETRUSTDOWNGRADE' })
  t.end()
})

t.test('stable releases ignore prior prerelease trust evidence', t => {
  const meta = {
    name: 'example-package',
    time: {
      '2.0.0-beta.1': '2026-01-01T00:00:00.000Z',
      '2.0.0': '2026-02-01T00:00:00.000Z',
    },
    versions: {
      '2.0.0-beta.1': provenance,
      '2.0.0': {},
    },
  }
  t.doesNotThrow(() => checkTrustDowngrade(meta, '2.0.0'))
  t.end()
})

t.test('prereleases compare against earlier prereleases', t => {
  const meta = {
    name: 'example-package',
    time: {
      '2.0.0-beta.1': '2026-01-01T00:00:00.000Z',
      '2.0.0-beta.2': '2026-02-01T00:00:00.000Z',
    },
    versions: {
      '2.0.0-beta.1': provenance,
      '2.0.0-beta.2': {},
    },
  }
  t.throws(() => checkTrustDowngrade(meta, '2.0.0-beta.2'), { code: 'ETRUSTDOWNGRADE' })
  t.end()
})

t.test('supports package and version exclusions', t => {
  t.equal(isTrustPolicyExcluded(['example-package'], 'example-package', '2.0.0'), true)
  t.equal(isTrustPolicyExcluded(['example-package@2.0.0'], 'example-package', '2.0.0'), true)
  t.equal(isTrustPolicyExcluded(['example-package@^2'], 'example-package', '2.1.0'), true)
  t.equal(isTrustPolicyExcluded(['other-package'], 'example-package', '2.0.0'), false)
  t.doesNotThrow(() => checkTrustDowngrade(packument(), '2.0.0', {
    exclude: ['example-package@2.0.0'],
  }))
  t.end()
})

t.test('ignore-after skips old selected versions', t => {
  const now = Date.parse('2026-02-02T00:00:00.000Z')
  t.doesNotThrow(() => checkTrustDowngrade(packument(), '2.0.0', {
    ignoreAfter: 60,
    now,
  }))
  t.throws(() => checkTrustDowngrade(packument(), '2.0.0', {
    ignoreAfter: 60 * 24 * 2,
    now,
  }), { code: 'ETRUSTDOWNGRADE' })
  t.end()
})

t.test('fails closed when selected version metadata is incomplete', t => {
  const meta = packument()
  delete meta.time['2.0.0']
  t.throws(
    () => checkTrustDowngrade(meta, '2.0.0'),
    {
      code: 'ETRUSTPOLICYMETADATA',
      package: 'example-package',
      version: '2.0.0',
    }
  )
  t.end()
})

t.test('registry node detection ignores non-registry and local nodes', t => {
  t.ok(registrySpecForNode(registryNode(), { registry: 'https://registry.npmjs.org/' }))
  t.equal(registrySpecForNode(registryNode({
    resolved: 'https://example.test/example-package-2.0.0.tgz',
  }), { registry: 'https://registry.npmjs.org/' }), null)
  t.equal(registrySpecForNode(registryNode({ isWorkspace: true }), {}), null)
  t.equal(registrySpecForNode(registryNode({ isLink: true }), {}), null)
  t.equal(registrySpecForNode(registryNode({ version: 'workspace:*' }), {}), null)
  t.end()
})

t.test('trust verifier is disabled unless no-downgrade is selected', async t => {
  const original = pacote.packument
  let calls = 0
  pacote.packument = async () => {
    calls++
    return packument({ current: provenance })
  }
  t.teardown(() => {
    pacote.packument = original
  })

  await verifyTrustPolicy(treeWith(registryNode()), {
    registry: 'https://registry.npmjs.org/',
  })
  t.equal(calls, 0)
})

t.test('trust verifier deduplicates identical package versions', async t => {
  const original = pacote.packument
  let calls = 0
  pacote.packument = async () => {
    calls++
    return packument({ current: provenance })
  }
  t.teardown(() => {
    pacote.packument = original
  })

  await verifyTrustPolicy(treeWith(
    registryNode(),
    registryNode({ path: '/tmp/project/node_modules/a/node_modules/example-package' })
  ), {
    trustPolicy: 'no-downgrade',
    registry: 'https://registry.npmjs.org/',
  })
  t.equal(calls, 1)
})

t.test('trust verifier rejects a registry provenance downgrade', async t => {
  const original = pacote.packument
  pacote.packument = async () => packument()
  t.teardown(() => {
    pacote.packument = original
  })

  await t.rejects(
    verifyTrustPolicy(treeWith(registryNode()), {
      trustPolicy: 'no-downgrade',
      registry: 'https://registry.npmjs.org/',
    }),
    {
      code: 'ETRUSTDOWNGRADE',
      package: 'example-package',
      version: '2.0.0',
    }
  )
})

t.test('trust verifier honors an exclusion before fetching metadata', async t => {
  const original = pacote.packument
  let calls = 0
  pacote.packument = async () => {
    calls++
    return packument()
  }
  t.teardown(() => {
    pacote.packument = original
  })

  await verifyTrustPolicy(treeWith(registryNode()), {
    trustPolicy: 'no-downgrade',
    trustPolicyExclude: ['example-package@2.0.0'],
    registry: 'https://registry.npmjs.org/',
  })
  t.equal(calls, 0)
})
