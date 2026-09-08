const t = require('tap')
const npa = require('npm-package-arg')
const PackumentCache = require('../lib/packument-cache.js')

const registry = 'https://registry.example.com/npm/'
const url = 'https://registry.example.com/download/pkg-1.0.0.tgz'
const arb = (options = {}) => ({ options: { registry, ...options } })
const manifest = (version = '1.0.0', tarball = url, name = 'pkg') => ({
  name,
  version,
  dist: { tarball },
})
const packument = (...versions) => ({
  name: 'pkg',
  versions: Object.fromEntries(versions.map(m => [m.version, m])),
})

t.test('preserves a snapshot of registry-sourced alias metadata', async t => {
  const { getRegistryTarball, rememberRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: () => {
        throw new Error('unexpected metadata request')
      },
    },
  })
  const tree = arb({ '@scope:registry': registry })
  const spec = npa.resolve('alias', 'npm:@scope/pkg@1.0.0')
  const metadata = manifest('1.0.0', url, '@scope/pkg')
  metadata._resolved = 'https://example.com/not-registry-evidence.tgz'
  rememberRegistryTarball(tree, spec, metadata)
  metadata.dist.tarball = 'https://example.com/changed-after-resolution.tgz'

  t.equal(await getRegistryTarball(tree, '@scope/pkg', '1.0.0'), url)
  t.equal(await getRegistryTarball(tree, '@scope/pkg', 'v1.0.0'), url,
    'normalizes an exact version without reinterpreting it as a dependency spec')
})

t.test('ignores non-registry and incomplete manifest evidence', async t => {
  for (const [spec, metadata] of [
    [npa('https://example.com/pkg.tgz'), manifest()],
    [npa('pkg'), manifest('not-a-version')],
    [npa('pkg'), manifest('1.0.0', url, 'other-package')],
    [npa('pkg'), { name: 'pkg', version: '1.0.0' }],
    [npa('pkg'), { name: 'pkg', version: '1.0.0', dist: {} }],
    [npa('pkg'), manifest('1.0.0', '')],
    [npa('pkg'), {}],
  ]) {
    let calls = 0
    const { getRegistryTarball, rememberRegistryTarball } = t.mock('../lib/registry-tarball.js', {
      pacote: {
        packument: async () => {
          calls++
          return { versions: {} }
        },
      },
    })
    const tree = arb()
    rememberRegistryTarball(tree, spec, metadata)
    t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), null)
    t.equal(calls, 1, 'unusable evidence cannot skip verification')
  }
})

t.test('rejects locked specifications that are not exact versions', async t => {
  const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: () => {
        throw new Error('unexpected metadata request')
      },
      manifest: () => {
        throw new Error('unexpected manifest request')
      },
    },
  })
  for (const version of [
    undefined, null, 1, {}, '', '*', '^1.0.0', 'latest',
    'npm:other-package@1.0.0', 'https://example.com/pkg.tgz',
    'file:pkg.tgz', 'git+https://example.com/pkg.git',
  ]) {
    t.equal(await getRegistryTarball(arb(), 'pkg', version), null)
  }
})

t.test('reuses full and abbreviated packuments, including pending cache entries', async t => {
  for (const format of ['full', 'corgi']) {
    for (const pending of [false, true]) {
      const metadata = packument(manifest())
      const cache = new Map([[`${format}:${registry}pkg`,
        pending ? Promise.resolve(metadata) : metadata]])
      const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
        pacote: {
          packument: () => {
            throw new Error('unexpected metadata request')
          },
        },
      })
      const tree = arb({ packumentCache: cache })
      t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), url)
      t.equal(await getRegistryTarball(tree, 'pkg', '2.0.0'), null,
        'does not select a different version when the locked version is absent')
    }
  }
})

t.test('prefers existing full metadata without requesting a second format', async t => {
  const cache = new Map([
    [`full:${registry}pkg`, packument(manifest())],
    [`corgi:${registry}pkg`, packument(manifest('1.0.0', 'https://example.com/stale.tgz'))],
  ])
  const { getRegistryTarball } = require('../lib/registry-tarball.js')
  t.equal(await getRegistryTarball(arb({ packumentCache: cache }), 'pkg', '1.0.0'), url)
})

t.test('an offline cache miss can reuse the full HTTP response variant', async t => {
  const requests = []
  const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: async (spec, options) => {
        t.equal(options.offline, true, 'neither attempt can access the network')
        requests.push(options.fullMetadata)
        if (!options.fullMetadata) {
          throw Object.assign(new Error('no cached abbreviated response'), { code: 'ENOTCACHED' })
        }
        return packument(manifest())
      },
    },
  })
  t.equal(await getRegistryTarball(arb({ offline: true }), 'pkg', '1.0.0'), url)
  t.same(requests, [false, true])
})

t.test('does not retry arbitrary offline errors as another metadata format', async t => {
  let calls = 0
  const failure = Object.assign(new Error('bad cached data'), { code: 'EINTEGRITY' })
  const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: async () => {
        calls++
        throw failure
      },
    },
  })
  await t.rejects(getRegistryTarball(arb({ offline: true }), 'pkg', '1.0.0'), failure)
  t.equal(calls, 1)
})

t.test('coalesces versions and retains compact evidence rejected by the production cache', async t => {
  for (const size of [undefined, 1_000_000]) {
    const cache = new PackumentCache()
    let calls = 0
    let complete
    const pending = new Promise(resolve => {
      complete = resolve
    })
    const secondURL = 'https://registry.example.com/download/pkg-2.0.0.tgz'
    const metadata = { ...packument(manifest(), manifest('2.0.0', secondURL)), _contentLength: size }
    const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
      pacote: {
        packument: async (spec, options) => {
          calls++
          t.equal(spec.name, 'pkg')
          t.ok(spec.registry, 'requests the registry package, never the locked URL')
          t.equal(options.fullMetadata, false, 'only requests installation metadata')
          t.equal(options.before, null, 'does not reapply version-selection age filters')
          t.equal(options.offline, true, 'preserves caller network/cache policy')
          t.equal(options['//registry.example.com/npm/:_authToken'], 'test-token')
          await pending
          cache.set(`corgi:${registry}pkg`, metadata)
          return metadata
        },
      },
    })
    const tree = arb({
      packumentCache: cache,
      before: new Date(),
      offline: true,
      '//registry.example.com/npm/:_authToken': 'test-token',
    })
    const first = getRegistryTarball(tree, 'pkg', '1.0.0')
    const second = getRegistryTarball(tree, 'pkg', '2.0.0')
    const duplicate = getRegistryTarball(tree, 'pkg', '1.0.0')
    t.equal(calls, 1, 'concurrent cache misses share a request')
    complete()
    t.same(await Promise.all([first, second, duplicate]), [url, secondURL, url])
    t.notOk(cache.has(`corgi:${registry}pkg`), 'the production cache does not retain this response')
    t.equal(await getRegistryTarball(tree, 'pkg', '2.0.0'), secondURL)
    t.equal(await getRegistryTarball(tree, 'pkg', '3.0.0'), null)
    t.equal(calls, 1, 'completed evidence and absent versions do not trigger another request')
  }
})

t.test('keeps registry endpoints and Arborist instances separate', async t => {
  let calls = 0
  const { getRegistryTarball, rememberRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: async () => {
        calls++
        return { versions: {} }
      },
    },
  })
  const tree = arb()
  rememberRegistryTarball(tree, npa('pkg'), manifest())
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), url)
  t.equal(await getRegistryTarball(arb(), 'pkg', '1.0.0'), null, 'another tree has no trusted evidence')
  tree.options.registry = 'https://registry.example.com/another-registry/'
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), null, 'a different registry path has no proof')
  tree.options.registry = registry
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), url)
  t.equal(calls, 2)
})

t.test('selects scoped registry metadata', async t => {
  const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: async (spec, options) => {
        t.equal(spec.name, '@scope/pkg')
        t.equal(spec.scope, '@scope')
        t.equal(options['@scope:registry'], registry)
        return packument(manifest('1.0.0', url, '@scope/pkg'))
      },
    },
  })
  t.equal(await getRegistryTarball(arb({
    registry: 'https://registry.npmjs.org/',
    '@scope:registry': registry,
  }), '@scope/pkg', '1.0.0'), url)
})

t.test('malformed metadata cannot authorize another identity or version', async t => {
  for (const versions of [
    undefined,
    {},
    { '1.0.0': null },
    { '1.0.0': manifest('1.0.0', url, 'other') },
    { '1.0.0': manifest('2.0.0') },
    { '1.0.0': { name: 'pkg', version: '1.0.0' } },
    { '1.0.0': manifest('1.0.0', 123) },
    { '1.0.0': manifest('1.0.0', '') },
    { 'npm:other@1.0.0': manifest('npm:other@1.0.0') },
  ]) {
    const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
      pacote: { packument: async () => ({ versions }) },
    })
    t.equal(await getRegistryTarball(arb(), 'pkg', '1.0.0'), null)
  }
})

t.test('retains build metadata in exact-version evidence', async t => {
  const one = 'https://registry.example.com/download/one.tgz'
  const two = 'https://registry.example.com/download/two.tgz'
  const { getRegistryTarball, rememberRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: async () => packument(
        manifest('1.0.0+one', one),
        manifest('1.0.0+two', two)
      ),
    },
  })
  const tree = arb()
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0+one'), one)
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0+two'), two)
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), null)
  const remembered = arb()
  rememberRegistryTarball(remembered, npa('pkg'), manifest('1.0.0+one', one))
  t.equal(await getRegistryTarball(remembered, 'pkg', '1.0.0+one'), one)
  t.equal(await getRegistryTarball(remembered, 'pkg', '1.0.0+two'), two)
})

t.test('shares failures without swallowing errors and permits a later retry', async t => {
  let calls = 0
  let fail
  const failure = new Error('registry unavailable')
  const pending = new Promise((resolve, reject) => {
    fail = reject
  })
  const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      packument: async () => {
        calls++
        if (calls === 1) {
          return pending
        }
        return packument(manifest())
      },
    },
  })
  const tree = arb()
  const first = getRegistryTarball(tree, 'pkg', '1.0.0')
  const second = getRegistryTarball(tree, 'pkg', '2.0.0')
  const assertions = [
    t.rejects(first, failure),
    t.rejects(second, failure),
  ]
  fail(failure)
  await Promise.all(assertions)
  t.equal(calls, 1)
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), url)
  t.equal(calls, 2)
})

t.test('does not substitute URL-only evidence for requested signature verification', async t => {
  for (const flag of ['verifySignatures', 'verifyAttestations']) {
    let calls = 0
    const { getRegistryTarball, rememberRegistryTarball } = t.mock('../lib/registry-tarball.js', {
      pacote: {
        packument: () => {
          throw new Error('unexpected unverified packument request')
        },
        manifest: async (spec, options) => {
          calls++
          t.equal(spec.name, 'pkg')
          t.equal(spec.type, 'version')
          t.equal(spec.fetchSpec, '1.0.0')
          t.equal(options[flag], true)
          t.equal(options.fullMetadata, true)
          t.equal(options.before, null)
          return manifest()
        },
      },
    })
    const tree = arb()
    rememberRegistryTarball(tree, npa('pkg'), manifest())
    tree.options[flag] = true
    t.same(await Promise.all([
      getRegistryTarball(tree, 'pkg', '1.0.0'),
      getRegistryTarball(tree, 'pkg', '1.0.0'),
    ]), [url, url])
    t.equal(calls, 1, 'verification cannot reuse evidence recorded without the requested checks')

    const enabledBeforeCapture = arb({ [flag]: true })
    rememberRegistryTarball(enabledBeforeCapture, npa('pkg'), manifest())
    t.equal(await getRegistryTarball(enabledBeforeCapture, 'pkg', '1.0.0'), url)
    t.equal(calls, 2,
      'flags at capture time do not prove that abbreviated metadata contained verification data')
  }
})

t.test('abbreviated evidence cannot hide an attestation present in full metadata', async t => {
  const failure = Object.assign(new Error('attestation unavailable'), { code: 'E404' })
  let calls = 0
  const { getRegistryTarball, rememberRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      manifest: async (spec, options) => {
        calls++
        t.equal(options.fullMetadata, true)
        t.equal(options.verifyAttestations, true)
        throw failure
      },
    },
  })
  const tree = arb({ verifyAttestations: true })
  rememberRegistryTarball(tree, npa('pkg'), manifest())
  await t.rejects(getRegistryTarball(tree, 'pkg', '1.0.0'), failure)
  t.equal(calls, 1, 'still attempts full attestation verification after abbreviated resolution')
})

t.test('propagates signature verification errors and retries without accepting them', async t => {
  let calls = 0
  const failure = Object.assign(new Error('invalid registry signature'), { code: 'EINTEGRITYSIGNATURE' })
  const { getRegistryTarball } = t.mock('../lib/registry-tarball.js', {
    pacote: {
      manifest: async () => {
        calls++
        if (calls === 1) {
          throw failure
        }
        return manifest()
      },
    },
  })
  const tree = arb({ verifySignatures: true })
  await t.rejects(getRegistryTarball(tree, 'pkg', '1.0.0'), failure)
  t.equal(await getRegistryTarball(tree, 'pkg', '1.0.0'), url)
  t.equal(calls, 2)
})
