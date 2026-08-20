const t = require('tap')
const {
  checkTrustDowngrade,
  getTrustEvidence,
  isTrustPolicyExcluded,
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
      message: /trust-policy-exclude/,
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
  t.equal(isTrustPolicyExcluded(['webpack@4.47.0 || 5.102.1'], 'webpack', '5.102.1'), true)
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
