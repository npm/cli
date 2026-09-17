
const t = require('tap')
const Arborist = require('../..')
const MockRegistry = require('@npmcli/mock-registry')
const { verifyTrustPolicy } = require('../../lib/trust-policy-verifier.js')

const createRegistry = t => new MockRegistry({
  strict: false,
  tap: t,
  registry: 'http://registry.npmjs.org',
})

const cache = t.testdir()
const buildIdeal = async (path, options = {}) => {
  const arb = new Arborist({
    path,
    cache,
    timeout: 30 * 60 * 1000,
    ...options,
  })
  const tree = await arb.buildIdealTree(options)
  await verifyTrustPolicy(tree, options)
  return tree
}

const mockDowngradedPackage = async (t, { times = 1 } = {}) => {
  const registry = createRegistry(t)
  const manifest = registry.manifest({
    name: 'example-package',
    packuments: registry.packuments(['2.0.0', '2.1.0'], 'example-package'),
  })
  manifest.time['2.0.0'] = '2026-01-01T00:00:00.000Z'
  manifest.time['2.1.0'] = '2026-02-01T00:00:00.000Z'
  manifest.versions['2.0.0'].dist.attestations = {
    provenance: { url: 'https://registry.example.test/attestations/2.0.0' },
  }
  await registry.package({ manifest, times })
  return registry
}

t.test('buildIdealTree rejects a registry trust downgrade before reify', async t => {
  const registry = await mockDowngradedPackage(t, { times: 2 })
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { 'example-package': '2.1.0' },
    }),
  })

  await t.rejects(buildIdeal(path, {
    registry: registry.origin,
    trustPolicy: 'no-downgrade',
  }), {
    code: 'ETRUSTDOWNGRADE',
    package: 'example-package',
    version: '2.1.0',
    previousTrust: 'provenance',
    currentTrust: 'none',
  })
})

t.test('buildIdealTree honors trust policy from constructor options for ci-style calls', async t => {
  const registry = await mockDowngradedPackage(t)
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { 'example-package': '2.1.0' },
    }),
  })

  const arb = new Arborist({
    path,
    cache: path + '/.cache',
    timeout: 30 * 60 * 1000,
    registry: registry.origin,
    trustPolicy: 'no-downgrade',
  })

  await t.rejects((async () => {
    const tree = await arb.buildIdealTree()
    await verifyTrustPolicy(tree, { ...arb.options, trustPolicy: 'no-downgrade' })
  })(), {
    code: 'ETRUSTDOWNGRADE',
    package: 'example-package',
    version: '2.1.0',
  })
})

t.test('locked dependency is still checked for trust downgrade', async t => {
  const registry = await mockDowngradedPackage(t)
  const tarball = registry.origin + '/example-package/-/example-package-2.1.0.tgz'
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'root',
      dependencies: { 'example-package': '2.1.0' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'root',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          dependencies: { 'example-package': '2.1.0' },
        },
        'node_modules/example-package': {
          version: '2.1.0',
          resolved: tarball,
        },
      },
    }),
  })

  const arb = new Arborist({
    path,
    cache: path + '/.cache',
    registry: registry.origin,
    trustPolicy: 'no-downgrade',
  })

  await t.rejects((async () => {
    const tree = await arb.buildIdealTree()
    await verifyTrustPolicy(tree, { ...arb.options, trustPolicy: 'no-downgrade' })
  })(), {
    code: 'ETRUSTDOWNGRADE',
    package: 'example-package',
    version: '2.1.0',
  })
})
