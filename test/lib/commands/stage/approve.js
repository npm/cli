const t = require('tap')
const { load: loadMockNpm } = require('../../../fixtures/mock-npm.js')
const MockRegistry = require('@npmcli/mock-registry')

const token = 'test-auth-token'
const authConfig = { '//registry.npmjs.org/:_authToken': token }
const stageId = '1de6f3db-2ed9-4d72-b3dd-8f0e2b474a2f'

t.test('approves a staged package', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { ...authConfig, otp: '123456' },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: token,
  })
  registry.nock.post(`/-/stage/${stageId}/approve`)
    .reply(201, { message: 'Package version approved and published successfully.' })
  await npm.exec('stage', ['approve', stageId])
  t.match(joinedOutput(), /approved and published successfully/)
})

t.test('throws usageError without stage-id', async t => {
  const { npm } = await loadMockNpm(t, {
    config: authConfig,
  })
  await t.rejects(npm.exec('stage', ['approve']), {
    code: 'EUSAGE',
  })
})
