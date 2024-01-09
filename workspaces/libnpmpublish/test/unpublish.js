'use strict'

const t = require('tap')
const MockRegistry = require('@npmcli/mock-registry')
const npa = require('npm-package-arg')

const opts = {
  registry: 'https://mock.reg/',
}

const { unpublish } = require('..')

t.test('basic test with no scope', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: 'npm-unpublish-test' })
  registry.package({ manifest, query: { write: true } })
  registry.unpublish({ manifest })
  const ret = await unpublish('npm-unpublish-test', opts)
  t.ok(ret, 'npm-unpublish-test was unpublished')
})

t.test('basic test with scope', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: '@npmcli/npm-unpublish-test' })
  registry.package({ manifest, query: { write: true } })
  registry.unpublish({ manifest })
  const ret = await unpublish('@npmcli/npm-unpublish-test', opts)
  t.ok(ret, '@npmcli/npm-unpublish-test was unpublished')
})

t.test('unpublish specific, last version', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: 'npm-unpublish-test' })
  registry.package({ manifest, query: { write: true } })
  registry.unpublish({ manifest })
  const ret = await unpublish('npm-unpublish-test@1.0.0', opts)
  t.ok(ret, 'npm-unpublish-test was unpublished')
})

t.test('unpublish specific version', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: 'npm-unpublish-test', versions: ['1.0.0', '1.0.1'] })
  const unpublished = {
    ...manifest,
    versions: { '1.0.0': manifest.versions['1.0.0'] },
    'dist-tags': { latest: '1.0.0' },
  }
  registry.package({ manifest, query: { write: true } })
  // nock does not properly compare json payloads with Date objects in them,
  // hence the pre-stringifying
  /* eslint-disable-next-line max-len */
  registry.nock.put(`/npm-unpublish-test/-rev/${manifest._rev}`, JSON.stringify(unpublished)).reply(200)
  registry.package({ manifest: unpublished, query: { write: true } })
  /* eslint-disable-next-line max-len */
  registry.nock.delete(`/npm-unpublish-test/-/npm-unpublish-test-1.0.1.tgz/-rev/${manifest._rev}`).reply(200)
  const ret = await unpublish('npm-unpublish-test@1.0.1', opts)
  t.ok(ret, 'foo was unpublished')
})

t.test('unpublishing specific version from a registry with a pathname', async t => {
  const _opts = {
    registry: 'https://artifactory.example.com/api/npm/npm-snapshots/',
  }
  const registry = new MockRegistry({
    tap: t,
    registry: _opts.registry,
  })
  const manifest = registry.manifest({ name: 'npm-unpublish-test', versions: ['1.0.0', '1.0.1'] })
  const unpublished = {
    ...manifest,
    versions: { '1.0.0': manifest.versions['1.0.0'] },
    'dist-tags': { latest: '1.0.0' },
  }
  registry.package({ manifest, query: { write: true } })
  // nock does not properly compare json payloads with Date objects in them,
  // hence the pre-stringifying
  /* eslint-disable-next-line max-len */
  registry.nock.put(`${registry.pathname}/npm-unpublish-test/-rev/${manifest._rev}`, JSON.stringify(unpublished)).reply(200)
  registry.package({ manifest: unpublished, query: { write: true } })
  /* eslint-disable-next-line max-len */
  registry.nock.delete(`${registry.pathname}/npm-unpublish-test/-/npm-unpublish-test-1.0.1.tgz/-rev/${manifest._rev}`).reply(200)
  const ret = await unpublish('npm-unpublish-test@1.0.1', _opts)
  t.ok(ret, 'npm-unpublish-test was unpublished')
})

t.test('404 considered a success', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: '@npmcli/npm-unpublish-test' })
  const spec = npa(manifest.name)
  registry.nock.get(`/${spec.escapedName}?write=true`).reply(404)
  const ret = await unpublish('@npmcli/npm-unpublish-test', opts)
  t.ok(ret, '@npmcli/npm-unpublish-test was unpublished')
})

t.test('non-404 errors', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: '@npmcli/npm-unpublish-test' })
  const spec = npa(manifest.name)
  registry.nock.get(`/${spec.escapedName}?write=true`).reply(500)
  await t.rejects(
    unpublish('@npmcli/npm-unpublish-test', opts),
    { code: 'E500' },
    'got correct error from server'
  )
})

t.test('packument with missing versions unpublishes whole thing', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: '@npmcli/npm-unpublish-test' })
  delete manifest.versions
  delete manifest.time
  registry.package({ manifest, query: { write: true } })
  registry.unpublish({ manifest })
  const ret = await unpublish('@npmcli/npm-unpublish-test@1.0.0', opts)
  t.ok(ret, '@npmcli/npm-unpublish-test was unpublished')
})

t.test('packument with missing specific version assumed unpublished', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: '@npmcli/npm-unpublish-test' })
  registry.package({ manifest, query: { write: true } })
  const ret = await unpublish('@npmcli/npm-unpublish-test@1.0.1', opts)
  t.ok(ret, '@npmcli/npm-unpublish-test was unpublished')
})

t.test('unpublish specific version without dist-tag update', async t => {
  const registry = new MockRegistry({
    tap: t,
    registry: opts.registry,
  })
  const manifest = registry.manifest({ name: 'npm-unpublish-test', versions: ['1.0.0', '1.0.1'] })
  manifest['dist-tags'].latest = '1.0.0'
  const unpublished = {
    ...manifest,
    versions: { '1.0.0': manifest.versions['1.0.0'] },
    'dist-tags': { latest: '1.0.0' },
  }
  registry.package({ manifest, query: { write: true } })
  // nock does not properly compare json payloads with Date objects in them,
  // hence the pre-stringifying
  /* eslint-disable-next-line max-len */
  registry.nock.put(`/npm-unpublish-test/-rev/${manifest._rev}`, JSON.stringify(unpublished)).reply(200)
  /* eslint-disable-next-line max-len */
  registry.package({ manifest: unpublished, query: { write: true } })
  /* eslint-disable-next-line max-len */
  registry.nock.delete(`/npm-unpublish-test/-/npm-unpublish-test-1.0.1.tgz/-rev/${manifest._rev}`).reply(200)
  const ret = await unpublish('npm-unpublish-test@1.0.1', opts)
  t.ok(ret, 'foo was unpublished')
})
