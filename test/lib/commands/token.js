const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm.js')
const MockRegistry = require('@npmcli/mock-registry')

const authToken = 'abcd1234'

const auth = {
  '//registry.npmjs.org/:_authToken': authToken,
}

const now = new Date().toISOString()
const tokens = [
  {
    key: 'abcd1234abcd1234',
    token: 'efgh5678efgh5678',
    cidr_whitelist: null,
    readonly: false,
    created: now,
    updated: now,
  },
  {
    key: 'abcd1256',
    token: 'hgfe8765',
    cidr_whitelist: ['192.168.1.1/32'],
    readonly: true,
    created: now,
    updated: now,
  },
]

t.test('completion', async t => {
  const { token } = await loadMockNpm(t, { command: 'token' })

  const testComp = (argv, expect) => {
    t.resolveMatch(token.completion({ conf: { argv: { remain: argv } } }), expect, argv.join(' '))
  }

  testComp(['npm', 'token'], ['list', 'revoke', 'create'])
  testComp(['npm', 'token', 'list'], [])
  testComp(['npm', 'token', 'revoke'], [])
  testComp(['npm', 'token', 'create'], [])

  t.rejects(token.completion({ conf: { argv: { remain: ['npm', 'token', 'foobar'] } } }), {
    message: 'foobar not recognize',
  })
})

t.test('token foobar', async t => {
  const { npm } = await loadMockNpm(t)

  await t.rejects(npm.exec('token', ['foobar']), /foobar is not a recognized subcommand/)
})

t.test('token list', async t => {
  const { npm, outputs } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  await npm.exec('token', [])
  t.strictSame(outputs, [
    `Publish token efgh5678efgh5678… with id abcd123 created ${now.slice(0, 10)}`,
    '',
    `Read only token hgfe8765… with id abcd125 created ${now.slice(0, 10)}`,
    'with IP whitelist: 192.168.1.1/32',
    '',
  ])
})

t.test('token list json output', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: {
      ...auth,
      json: true,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  await npm.exec('token', ['list'])
  const parsed = JSON.parse(joinedOutput())
  t.match(parsed, tokens, 'prints the json parsed tokens')
})

t.test('token list parseable output', async t => {
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      parseable: true,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  await npm.exec('token', [])
  t.strictSame(outputs, [
    'key\ttoken\tcreated\treadonly\tCIDR whitelist',
    `abcd1234abcd1234\tefgh5678efgh5678\t${now}\tfalse\t`,
    `abcd1256\thgfe8765\t${now}\ttrue\t192.168.1.1/32`,
  ])
})

t.test('token revoke', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })

  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  registry.nock.delete(`/-/npm/v1/tokens/token/${tokens[0].key}`).reply(404)
  registry.nock.delete(`/-/npm/v1/user/tokens/${tokens[0].key}`).reply(200)
  await npm.exec('token', ['rm', tokens[0].key.slice(0, 8)])

  t.equal(joinedOutput(), 'Removed 1 token')
})

t.test('token revoke multiple tokens', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })

  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  registry.nock.delete(`/-/npm/v1/tokens/token/${tokens[0].key}`).reply(404)
  registry.nock.delete(`/-/npm/v1/user/tokens/${tokens[0].key}`).reply(200)
  registry.nock.delete(`/-/npm/v1/tokens/token/${tokens[1].key}`).reply(404)
  registry.nock.delete(`/-/npm/v1/user/tokens/${tokens[1].key}`).reply(200)
  await npm.exec('token', ['rm', tokens[0].key.slice(0, 8), tokens[1].key.slice(0, 8)])

  t.equal(joinedOutput(), 'Removed 2 tokens')
})

t.test('token revoke json output', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: {
      ...auth,
      json: true,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })

  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  registry.nock.delete(`/-/npm/v1/tokens/token/${tokens[0].key}`).reply(404)
  registry.nock.delete(`/-/npm/v1/user/tokens/${tokens[0].key}`).reply(200)
  await npm.exec('token', ['rm', tokens[0].key.slice(0, 8)])

  const parsed = JSON.parse(joinedOutput())
  t.same(parsed, [tokens[0].key], 'logs the token as json')
})

t.test('token revoke parseable output', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: {
      ...auth,
      parseable: true,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })

  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  registry.nock.delete(`/-/npm/v1/tokens/token/${tokens[0].key}`).reply(404)
  registry.nock.delete(`/-/npm/v1/user/tokens/${tokens[0].key}`).reply(200)
  await npm.exec('token', ['rm', tokens[0].key.slice(0, 8)])
  t.equal(joinedOutput(), tokens[0].key, 'logs the token as a string')
})

t.test('token revoke by token', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  registry.nock.delete(`/-/npm/v1/tokens/token/${tokens[0].token}`).reply(404)
  registry.nock.delete(`/-/npm/v1/user/tokens/${tokens[0].token}`).reply(200)
  await npm.exec('token', ['rm', tokens[0].token])
  t.equal(joinedOutput(), 'Removed 1 token')
})

t.test('token revoke requires an id', async t => {
  const { npm } = await loadMockNpm(t)

  await t.rejects(npm.exec('token', ['rm']), {
    code: 'EUSAGE',
    message: '`<tokenKey>` argument is required',
  })
})

t.test('token revoke ambiguous id errors', async t => {
  const { npm } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  await t.rejects(npm.exec('token', ['rm', 'abcd']), {
    message: /Token ID "abcd" was ambiguous/,
  })
})

t.test('token revoke unknown token', async t => {
  const { npm } = await loadMockNpm(t, {
    config: { ...auth },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })

  registry.getTokens(tokens)
  registry.nock.get('/-/npm/v1/user/tokens').reply(200, { objects: [], urls: {}, total: 0 })
  await t.rejects(npm.exec('token', ['rm', '0xnotreal']),
    'Unknown token id or value 0xnotreal'
  )
})

t.test('token create', async t => {
  const cidr = ['10.0.0.0/8', '192.168.1.0/24']
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      cidr,
      name: 'test-token',
      access: 'read-write',
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens', body => {
    return body.type === 'granular' &&
      body.name === 'test-token' &&
      body.access === 'read-write' &&
      body.cidr_whitelist.length === 2
  }).reply(201, {
    token: 'n3wt0k3n',
    access: 'read-write',
    cidr_whitelist: cidr,
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  t.match(outputs, [
    'Created publish token n3wt0k3n',
    'with IP whitelist: 10.0.0.0/8,192.168.1.0/24',
  ])
})

t.test('token create read only', async t => {
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      name: 'readonly-token',
      access: 'read-only',
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens', body => {
    return body.type === 'granular' &&
      body.name === 'readonly-token' &&
      body.access === 'read-only'
  }).reply(201, {
    token: 'n3wt0k3n',
    access: 'read-only',
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  t.match(outputs, [
    'Created read only token n3wt0k3n',
  ])
})

t.test('token create with expiry', async t => {
  const expires = '2025-12-31'
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      name: 'expiry-token',
      access: 'read-only',
      expires,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens', body => {
    return body.type === 'granular' &&
      body.name === 'expiry-token' &&
      body.access === 'read-only' &&
      body.expires === new Date(expires).toISOString()
  }).reply(201, {
    token: 'n3wt0k3n',
    access: 'read-only',
    created: new Date().toISOString(),
    expires: new Date(expires).toISOString(),
  })
  await npm.exec('token', ['create'])
  t.match(outputs, [
    'Created read only token n3wt0k3n',
    `expires: ${new Date(expires).toISOString()}`,
  ])
})

t.test('token create with packages', async t => {
  const packages = ['@scope/pkg1', 'pkg2']
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      name: 'packages-token',
      access: 'read-write',
      packages,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens', body => {
    return body.type === 'granular' &&
      body.name === 'packages-token' &&
      body.access === 'read-write' &&
      JSON.stringify(body.packages) === JSON.stringify(packages)
  }).reply(201, {
    token: 'n3wt0k3n',
    access: 'read-write',
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  t.match(outputs, [
    'Created publish token n3wt0k3n',
  ])
})

t.test('token create with scopes', async t => {
  const scopes = ['@scope1', '@scope2']
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      name: 'scopes-token',
      access: 'read-write',
      scopes,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens', body => {
    return body.type === 'granular' &&
      body.name === 'scopes-token' &&
      body.access === 'read-write' &&
      JSON.stringify(body.scopes) === JSON.stringify(scopes)
  }).reply(201, {
    token: 'n3wt0k3n',
    access: 'read-write',
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  t.match(outputs, [
    'Created publish token n3wt0k3n',
  ])
})

t.test('token create with orgs', async t => {
  const orgs = ['org1', 'org2']
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      name: 'orgs-token',
      access: 'read-write',
      orgs,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens', body => {
    return body.type === 'granular' &&
      body.name === 'orgs-token' &&
      body.access === 'read-write' &&
      JSON.stringify(body.orgs) === JSON.stringify(orgs)
  }).reply(201, {
    token: 'n3wt0k3n',
    access: 'read-write',
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  t.match(outputs, [
    'Created publish token n3wt0k3n',
  ])
})

t.test('token create with bypass-2fa', async t => {
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      name: 'bypass2fa-token',
      access: 'read-write',
      'bypass-2fa': true,
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens', body => {
    return body.type === 'granular' &&
      body.name === 'bypass2fa-token' &&
      body.access === 'read-write' &&
      body.bypass_2fa === true
  }).reply(201, {
    token: 'n3wt0k3n',
    access: 'read-write',
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  t.match(outputs, [
    'Created publish token n3wt0k3n',
  ])
})

t.test('token create json output', async t => {
  const cidr = ['10.0.0.0/8', '192.168.1.0/24']
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: {
      ...auth,
      json: true,
      cidr,
      name: 'json-token',
      access: 'read-write',
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens').reply(201, {
    token: 'n3wt0k3n',
    access: 'read-write',
    cidr_whitelist: cidr,
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  const parsed = JSON.parse(joinedOutput())
  t.match(
    parsed,
    { token: 'n3wt0k3n', access: 'read-write', cidr_whitelist: cidr }
  )
  t.ok(parsed.created, 'also returns created')
})

t.test('token create parseable output', async t => {
  const cidr = ['10.0.0.0/8', '192.168.1.0/24']
  const { npm, outputs } = await loadMockNpm(t, {
    config: {
      ...auth,
      parseable: true,
      cidr,
      name: 'parseable-token',
      access: 'read-write',
    },
  })
  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    authorization: authToken,
  })
  registry.nock.post('/-/npm/v1/user/tokens').reply(201, {
    token: 'n3wt0k3n',
    access: 'read-write',
    cidr_whitelist: cidr,
    created: new Date().toISOString(),
  })
  await npm.exec('token', ['create'])
  // In parseable mode, all fields are output as key\tvalue pairs
  t.match(outputs.join('\n'), /token\tn3wt0k3n/)
  t.match(outputs.join('\n'), /created\t/)
  t.match(outputs.join('\n'), /cidr_whitelist\t10.0.0.0\/8,192.168.1.0\/24/)
})

t.test('token create ipv6 cidr', async t => {
  const { npm } = await loadMockNpm(t, {
    config: {
      ...auth,
      cidr: '::1/128',
      name: 'ipv6-test',
      access: 'read-only',
    },
  })
  await t.rejects(npm.exec('token', ['create']), {
    code: 'EINVALIDCIDR',
    message: /CIDR whitelist can only contain IPv4 addresses, ::1\/128 is IPv6/,
  })
})

t.test('token create invalid cidr', async t => {
  const { npm } = await loadMockNpm(t, {
    config: {
      ...auth,
      cidr: 'apple/cider',
      name: 'invalid-cidr-test',
      access: 'read-only',
    },
  })
  await t.rejects(npm.exec('token', ['create']), {
    code: 'EINVALIDCIDR',
    message: 'CIDR whitelist contains invalid CIDR entry: apple/cider',
  })
})

t.test('token create requires name', async t => {
  const { npm } = await loadMockNpm(t, {
    config: {
      ...auth,
      access: 'read-only',
    },
  })
  await t.rejects(npm.exec('token', ['create']), {
    code: 'EUSAGE',
  })
})

t.test('token create requires access and validates value', async t => {
  const { npm } = await loadMockNpm(t, {
    config: {
      ...auth,
      name: 'test-token',
    },
  })
  // Test missing access
  await t.rejects(npm.exec('token', ['create']), {
    code: 'EUSAGE',
  })

  // Test invalid access value
  npm.config.set('access', 'invalid-value')
  await t.rejects(npm.exec('token', ['create']), {
    code: 'EUSAGE',
  })
})
