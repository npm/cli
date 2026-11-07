const t = require('tap')
const { registryVersions } = require('../lib/trust-policy-verifier.js')

const node = ({
  name,
  packageName = name,
  version = '1.0.0',
  edgeSpecs = ['^1.0.0'],
  isProjectRoot = false,
  isWorkspace = false,
  isLink = false,
  inDepBundle = false,
} = {}) => ({
  name,
  packageName,
  version,
  edgesIn: new Set(edgeSpecs.map(spec => ({ spec }))),
  isProjectRoot,
  isWorkspace,
  isLink,
  inDepBundle,
})

const tree = nodes => ({
  inventory: new Map(nodes.map((n, i) => [String(i), n])),
})

t.test('registryVersions groups exact registry versions and skips non-registry nodes', t => {
  const result = registryVersions(tree([
    node({ name: 'a', version: '1.0.0' }),
    node({ name: 'a', version: '2.0.0' }),
    node({ name: 'edgeless', edgeSpecs: [] }),
    node({ name: 'git-dep', edgeSpecs: ['git+https://github.com/example/pkg.git'] }),
    node({ name: 'remote-dep', edgeSpecs: ['https://example.test/pkg.tgz'] }),
    node({ name: 'workspace', isWorkspace: true }),
    node({ name: 'link', isLink: true }),
    node({ name: 'bundled', inDepBundle: true }),
    node({ name: 'root', isProjectRoot: true }),
  ]))

  t.strictSame([...result.entries()].map(([name, versions]) => [name, [...versions]]), [
    ['a', ['1.0.0', '2.0.0']],
    ['edgeless', ['1.0.0']],
  ])
  t.end()
})

t.test('registryVersions verifies nodes with mixed registry and non-registry consumers', t => {
  const result = registryVersions(tree([
    node({
      name: 'mixed',
      edgeSpecs: ['^1.0.0', 'git+https://github.com/example/pkg.git'],
    }),
  ]))

  t.strictSame([...result.entries()].map(([name, versions]) => [name, [...versions]]), [
    ['mixed', ['1.0.0']],
  ])
  t.end()
})

t.test('registryVersions uses packageName for npm aliases', t => {
  const result = registryVersions(tree([
    node({ name: 'alias-name', packageName: 'real-package', version: '3.0.0', edgeSpecs: ['npm:real-package@^3'] }),
  ]))
  t.strictSame([...result.entries()].map(([name, versions]) => [name, [...versions]]), [
    ['real-package', ['3.0.0']],
  ])
  t.end()
})

t.test('verifyTrustPolicy is a no-op unless enabled', async t => {
  let fetched = false
  const { verifyTrustPolicy } = t.mock('../lib/trust-policy-verifier.js', {
    pacote: {
      packument: async () => {
        fetched = true
        return {}
      },
    },
  })
  await verifyTrustPolicy(tree([node({ name: 'a' })]), {})
  t.equal(fetched, false)
})

t.test('verifyTrustPolicy fetches full metadata once per package and checks each selected version', async t => {
  const fetches = []
  const checks = []
  const meta = { name: 'a', versions: {}, time: {} }
  const { verifyTrustPolicy } = t.mock('../lib/trust-policy-verifier.js', {
    pacote: {
      packument: async (name, opts) => {
        fetches.push({ name, fullMetadata: opts.fullMetadata, cache: opts.packumentCache })
        return meta
      },
    },
    '../lib/trust-policy.js': {
      isTrustPolicyExcluded: (entries, name, version) =>
        Boolean(entries?.includes(name + '@' + version)),
      checkTrustDowngrade: (packument, version, opts) => {
        checks.push({ packument, version, opts })
      },
    },
  })

  const packumentCache = new Map()
  await verifyTrustPolicy(tree([
    node({ name: 'a', version: '1.0.0' }),
    node({ name: 'a', version: '2.0.0' }),
  ]), {
    trustPolicy: 'no-downgrade',
    trustPolicyExclude: ['a@2.0.0'],
    trustPolicyIgnoreAfter: 60,
    packumentCache,
  })

  t.strictSame(fetches, [{ name: 'a', fullMetadata: true, cache: packumentCache }])
  t.strictSame(checks.map(c => ({ version: c.version, opts: c.opts })), [
    { version: '1.0.0', opts: { exclude: ['a@2.0.0'], ignoreAfter: 60 } },
  ])
  t.equal(checks.every(c => c.packument === meta), true)
})

t.test('verifyTrustPolicy preserves scoped registry routing options', async t => {
  const fetches = []
  const { verifyTrustPolicy } = t.mock('../lib/trust-policy-verifier.js', {
    pacote: {
      packument: async (name, opts) => {
        fetches.push({ name, registry: opts.registry, scopedRegistry: opts['@scope:registry'] })
        return {
          name,
          versions: { '1.0.0': {} },
          time: { '1.0.0': '2026-01-01T00:00:00.000Z' },
        }
      },
    },
    '../lib/trust-policy.js': {
      isTrustPolicyExcluded: () => false,
      checkTrustDowngrade: () => {},
    },
  })

  await verifyTrustPolicy(tree([
    node({ name: '@scope/pkg', version: '1.0.0' }),
  ]), {
    trustPolicy: 'no-downgrade',
    registry: 'https://registry.example.test/',
    '@scope:registry': 'https://scope.example.test/',
  })

  t.strictSame(fetches, [{
    name: '@scope/pkg',
    registry: 'https://registry.example.test/',
    scopedRegistry: 'https://scope.example.test/',
  }])
})
