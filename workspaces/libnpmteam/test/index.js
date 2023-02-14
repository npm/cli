'use strict'

const { test } = require('tap')
const tnock = require('./fixtures/tnock.js')

const team = require('../lib/index.js')

const REG = 'http://localhost:1337'
const OPTS = {
  registry: REG,
}

test('create', async t => {
  tnock(t, REG).put(
    '/-/org/foo/team', { name: 'cli' }
  ).reply(201, { name: 'cli' })
  const ret = await team.create('@foo:cli', OPTS)
  t.same(ret, { name: 'cli' }, 'request succeeded')
})

test('create - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .put('/-/org/foo/team', { name: 'cli' })
    .reply(201, { name: 'cli' })

  const ret = await team.create('@foo:cli')
  t.same(ret, { name: 'cli' })
})

test('create bad entity name', async t => {
  await t.rejects(team.create('go away', OPTS))
})

test('create empty entity', async t => {
  await t.rejects(team.create(undefined, OPTS))
})

test('create w/ description', async t => {
  tnock(t, REG).put('/-/org/foo/team', {
    name: 'cli',
    description: 'just some cool folx',
  }).reply(201, { name: 'cli' })
  const ret = await team.create('@foo:cli', {
    ...OPTS,
    description: 'just some cool folx',
  })
  t.same(ret, { name: 'cli' }, 'no desc in return')
})

test('destroy', async t => {
  tnock(t, REG).delete(
    '/-/team/foo/cli'
  ).reply(204)
  await t.resolves(
    team.destroy('@foo:cli', OPTS),
    'request succeeded'
  )
})

test('destroy - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .delete('/-/team/foo/cli')
    .reply(204)

  await t.resolves(
    team.destroy('@foo:cli'),
    'request succeeded'
  )
})

test('add', async t => {
  tnock(t, REG).put(
    '/-/team/foo/cli/user', { user: 'zkat' }
  ).reply(201, {})
  const ret = await team.add('zkat', '@foo:cli', OPTS)
  t.ok(ret, 'request succeeded')
})

test('add - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .put('/-/team/foo/cli/user', { user: 'zkat' })
    .reply(201, {})

  const ret = await team.add('zkat', '@foo:cli')
  t.same(ret, {}, 'request succeeded')
})

test('rm', async t => {
  tnock(t, REG).delete(
    '/-/team/foo/cli/user', { user: 'zkat' }
  ).reply(204)
  await t.resolves(
    team.rm('zkat', '@foo:cli', OPTS),
    'request succeeded'
  )
})

test('rm - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .delete('/-/team/foo/cli/user', { user: 'zkat' })
    .reply(204)

  await t.resolves(
    team.rm('zkat', '@foo:cli'),
    'request succeeded'
  )
})

test('lsTeams', async t => {
  tnock(t, REG).get(
    '/-/org/foo/team?format=cli'
  ).reply(200, ['foo:bar', 'foo:cli'])
  const ret = await team.lsTeams('foo', OPTS)
  t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
})

test('lsTeams - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/org/foo/team?format=cli')
    .reply(200, ['foo:bar', 'foo:cli'])

  const ret = await team.lsTeams('foo')
  t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
})

test('lsTeams error', async t => {
  tnock(t, REG).get(
    '/-/org/foo/team?format=cli'
  ).reply(500)
  await t.rejects(
    team.lsTeams('foo', OPTS),
    { code: 'E500' }
  )
})

test('lsTeams.stream', async t => {
  tnock(t, REG).get(
    '/-/org/foo/team?format=cli'
  ).reply(200, ['foo:bar', 'foo:cli'])
  const ret = await team.lsTeams.stream('foo', OPTS).collect()
  t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
})

test('lsTeams.stream - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/org/foo/team?format=cli')
    .reply(200, ['foo:bar', 'foo:cli'])

  const ret = await team.lsTeams.stream('foo').collect()
  t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
})

test('lsUsers', async t => {
  tnock(t, REG).get(
    '/-/team/foo/cli/user?format=cli'
  ).reply(500)
  await t.rejects(
    team.lsUsers('@foo:cli', OPTS),
    { code: 'E500' }
  )
})

test('lsUsers - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/team/foo/cli/user?format=cli')
    .reply(500)

  await t.rejects(
    team.lsUsers('@foo:cli'),
    { code: 'E500' }
  )
})

test('lsUsers error', async t => {
  tnock(t, REG).get(
    '/-/team/foo/cli/user?format=cli'
  ).reply(200, ['iarna', 'zkat'])
  const ret = await team.lsUsers('@foo:cli', OPTS)
  t.same(ret, ['iarna', 'zkat'], 'got team members')
})

test('lsUsers.stream', async t => {
  tnock(t, REG).get(
    '/-/team/foo/cli/user?format=cli'
  ).reply(200, ['iarna', 'zkat'])
  const ret = await team.lsUsers.stream('@foo:cli', OPTS).collect()
  t.same(ret, ['iarna', 'zkat'], 'got team members')
})

test('lsUsers.stream - no options', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/team/foo/cli/user?format=cli')
    .reply(200, ['iarna', 'zkat'])

  const ret = await team.lsUsers.stream('@foo:cli').collect()
  t.same(ret, ['iarna', 'zkat'], 'got team members')
})

test('edit', t => {
  t.throws(() => {
    team.edit()
  }, /not implemented/)
  t.end()
})
