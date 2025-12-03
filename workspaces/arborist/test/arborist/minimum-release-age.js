const t = require('tap')
const Arborist = require('../../lib/arborist/index.js')
const pacote = require('pacote')

// mock pacote response
const packumentResponse = {
  name: 'foo',
  versions: {
    '1.0.0': {},
    '1.0.1': {},
    '1.0.2': {},
  },
  time: {
    '1.0.0': new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    '1.0.1': new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    '1.0.2': new Date(Date.now() - 1000 * 60 * 1).toISOString(), // 1 minute ago
  },
}

t.test('minimum-release-age policy', async t => {
  const originalPackument = pacote.packument
  const originalManifest = pacote.manifest

  t.teardown(() => {
    pacote.packument = originalPackument
    pacote.manifest = originalManifest
  })

  pacote.packument = async () => {
    return packumentResponse
  }

  let capturedOptions = null
  pacote.manifest = async (spec, opts) => {
    // capture options if 'avoid' is present, which indicates our logic ran
    if (opts.avoid) {
      capturedOptions = opts
    }
    return { name: 'foo', version: '1.0.0' }
  }

  const path = t.testdir({})
  const arb = new Arborist({
    path,
    minimumReleaseAge: 10, // 10 minutes
    cache: path + '/cache',
  })

  // we try to add 'foo'
  // this should trigger buildIdealTree -> #add -> #fetchManifest
  try {
    await arb.buildIdealTree({ add: ['foo'] })
  } catch (e) {
    // it might fail later because we are mocking things partially,
    // but we just want to check if fetchManifest was called with avoid
  }

  t.ok(capturedOptions, 'pacote.manifest was called with options')

  if (capturedOptions) {
    const avoid = capturedOptions.avoid || ''
    // 1.0.1 is 5 mins old (should be avoided, limit is 10 mins)
    t.match(avoid, '1.0.1', 'should avoid 1.0.1')
    // 1.0.2 is 1 minute old (should be avoided)
    t.match(avoid, '1.0.2', 'should avoid 1.0.2')
    // 1.0.0 is 1 day old (should NOT be avoided)
    t.notMatch(avoid, '1.0.0', 'should not avoid 1.0.0')
  }
})

t.test('minimum-release-age-exclude bypasses policy', async t => {
  const originalPackument = pacote.packument
  const originalManifest = pacote.manifest

  t.teardown(() => {
    pacote.packument = originalPackument
    pacote.manifest = originalManifest
  })

  pacote.packument = async () => {
    return packumentResponse
  }

  let capturedOptions = null
  pacote.manifest = async (spec, opts) => {
    capturedOptions = opts
    return { name: 'foo', version: '1.0.2' }
  }

  const path = t.testdir({})
  const arb = new Arborist({
    path,
    minimumReleaseAge: 10,
    minimumReleaseAgeExclude: ['foo'], // exclude 'foo' from policy
    cache: path + '/cache',
  })

  try {
    await arb.buildIdealTree({ add: ['foo'] })
  } catch (e) {
    // ignore errors
  }

  t.ok(capturedOptions, 'pacote.manifest was called')

  if (capturedOptions) {
    const avoid = capturedOptions.avoid || ''
    // since 'foo' is excluded, recent versions should NOT be avoided
    t.notMatch(avoid, '1.0.1', 'should not avoid 1.0.1 (excluded)')
    t.notMatch(avoid, '1.0.2', 'should not avoid 1.0.2 (excluded)')
  }
})

t.test('minimum-release-age=0 disables policy', async t => {
  const originalPackument = pacote.packument
  const originalManifest = pacote.manifest

  t.teardown(() => {
    pacote.packument = originalPackument
    pacote.manifest = originalManifest
  })

  let packumentCalled = false
  pacote.packument = async () => {
    packumentCalled = true
    return packumentResponse
  }

  pacote.manifest = async () => {
    return { name: 'foo', version: '1.0.2' }
  }

  const path = t.testdir({})
  const arb = new Arborist({
    path,
    minimumReleaseAge: 0, // disabled
    cache: path + '/cache',
  })

  try {
    await arb.buildIdealTree({ add: ['foo'] })
  } catch (e) {
    // ignore errors
  }

  // when policy is disabled, packument should not be fetched for this purpose
  t.notOk(packumentCalled, 'packument should not be called when policy is disabled')
})

t.test('handles packument fetch errors gracefully', async t => {
  const originalPackument = pacote.packument
  const originalManifest = pacote.manifest

  t.teardown(() => {
    pacote.packument = originalPackument
    pacote.manifest = originalManifest
  })

  pacote.packument = async () => {
    throw new Error('Network error')
  }

  let manifestCalled = false
  pacote.manifest = async () => {
    manifestCalled = true
    return { name: 'foo', version: '1.0.0' }
  }

  const path = t.testdir({})
  const arb = new Arborist({
    path,
    minimumReleaseAge: 10,
    cache: path + '/cache',
  })

  try {
    await arb.buildIdealTree({ add: ['foo'] })
  } catch (e) {
    // ignore errors from buildIdealTree
  }

  // even if packument fails, manifest should still be called
  // (policy is just skipped on error)
  t.ok(manifestCalled, 'manifest should still be called even if packument fails')
})
