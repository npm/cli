const t = require('tap')
const { load: loadMockNpm } = require('../../../fixtures/mock-npm.js')
const MockRegistry = require('@npmcli/mock-registry')

const packageName = '@npmcli/test-package'
const auth = { '//registry.npmjs.org/:_authToken': 'test-auth-token' }

t.test('buildkite with all options provided', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({
        name: packageName,
        version: '1.0.0',
      }),
    },
    config: { ...auth, yes: true },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: 'test-auth-token',
  })
  registry.trustCreate({ packageName })

  await npm.exec('trust', [
    'buildkite',
    packageName,
    '--yes',
    '--organization', 'npm',
    '--pipeline', 'cli',
    '--allow-publish',
  ])
})

t.test('buildkite uses package name from package.json', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify({
        name: packageName,
        version: '1.0.0',
      }),
    },
    config: { ...auth, yes: true },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: 'test-auth-token',
  })
  registry.trustCreate({ packageName })

  await npm.exec('trust', [
    'buildkite',
    '--yes',
    '--org', 'npm',
    '--pipeline', 'cli',
    '--allow-publish',
  ])
})

t.test('buildkite missing package name', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {},
    config: auth,
  })

  await t.rejects(npm.exec('trust', [
    'buildkite',
    '--yes',
    '--organization', 'npm',
    '--pipeline', 'cli',
    '--allow-publish',
  ]), { message: /Package name must be specified/ })
})

t.test('buildkite missing organization', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {},
    config: auth,
  })

  await t.rejects(npm.exec('trust', [
    'buildkite',
    packageName,
    '--yes',
    '--pipeline', 'cli',
    '--allow-publish',
  ]), { message: /organization is required/ })
})

t.test('buildkite missing pipeline', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {},
    config: auth,
  })

  await t.rejects(npm.exec('trust', [
    'buildkite',
    packageName,
    '--yes',
    '--organization', 'npm',
    '--allow-publish',
  ]), { message: /pipeline is required/ })
})

t.test('optionsToBody maps Buildkite claims', t => {
  const TrustBuildkite = require('../../../../lib/commands/trust/buildkite.js')
  const body = TrustBuildkite.optionsToBody({
    organization: 'npm',
    pipeline: 'cli',
  })

  t.strictSame(body, {
    type: 'buildkite',
    claims: {
      organization_slug: 'npm',
      pipeline_slug: 'cli',
    },
  })
  t.end()
})

t.test('bodyToOptions maps Buildkite claims', t => {
  const TrustBuildkite = require('../../../../lib/commands/trust/buildkite.js')
  const options = TrustBuildkite.bodyToOptions({
    id: 'test-id',
    type: 'buildkite',
    claims: {
      organization_slug: 'npm',
      pipeline_slug: 'cli',
    },
  })

  t.strictSame(options, {
    id: 'test-id',
    type: 'buildkite',
    organization: 'npm',
    pipeline: 'cli',
  })
  t.end()
})
