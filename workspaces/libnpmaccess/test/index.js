'use strict'

const t = require('tap')
const tnock = require('./fixtures/tnock.js')

const access = require('../lib/index.js')

const REG = 'http://localhost:1337'
const OPTS = {
  registry: REG,
}

t.test('access public', async t => {
  tnock(t, REG).post(
    '/-/package/%40foo%2Fbar/access', { access: 'public' }
  ).reply(200)
  await t.resolves(access.public('@foo/bar', OPTS))
})

t.test('access public - failure', async t => {
  tnock(t, REG).post(
    '/-/package/%40foo%2Fbar/access', { access: 'public' }
  ).reply(418)
  await t.rejects(
    access.public('@foo/bar', OPTS),
    { statusCode: 418 },
    'fails with code from registry'
  )
})

t.test('access restricted', async t => {
  tnock(t, REG).post(
    '/-/package/%40foo%2Fbar/access', { access: 'restricted' }
  ).reply(200)
  await t.resolves(access.restricted('@foo/bar', OPTS))
})

t.test('access restricted - failure', async t => {
  tnock(t, REG).post(
    '/-/package/%40foo%2Fbar/access', { access: 'restricted' }
  ).reply(418)
  await t.rejects(
    access.restricted('@foo/bar', OPTS),
    { statusCode: 418 },
    'fails with code from registry')
})

t.test('access 2fa-required', async t => {
  tnock(t, REG).post('/-/package/%40foo%2Fbar/access', {
    publish_requires_tfa: true,
  }).reply(200, { ok: true })
  await t.resolves(access.tfaRequired('@foo/bar', OPTS))
})

t.test('access 2fa-not-required', async t => {
  tnock(t, REG).post('/-/package/%40foo%2Fbar/access', {
    publish_requires_tfa: false,
  }).reply(200, { ok: true })
  await t.resolves(access.tfaNotRequired('@foo/bar', OPTS))
})

t.test('access grant basic read-write', async t => {
  tnock(t, REG).put('/-/team/myorg/myteam/package', {
    package: '@foo/bar',
    permissions: 'read-write',
  }).reply(201)
  await t.resolves(access.grant('@foo/bar', 'myorg:myteam', 'read-write', OPTS))
})

t.test('access grant basic read-only', async t => {
  tnock(t, REG).put('/-/team/myorg/myteam/package', {
    package: '@foo/bar',
    permissions: 'read-only',
  }).reply(201)
  await t.resolves(access.grant('@foo/bar', 'myorg:myteam', 'read-only', OPTS))
})

t.test('access grant bad perm', async t => {
  await t.rejects(
    access.grant('@foo/bar', 'myorg:myteam', 'unknown', OPTS),
    { message: /must be.*read-write.*read-only/ },
    'only read-write and read-only are accepted'
  )
})

t.test('access grant no entity', async t => {
  await t.rejects(
    access.grant('@foo/bar', undefined, 'read-write', OPTS),
    { message: /Expected string/ },
    'passing undefined entity gives useful error'
  )
})

t.test('access grant basic unscoped', async t => {
  tnock(t, REG).put('/-/team/myorg/myteam/package', {
    package: 'bar',
    permissions: 'read-write',
  }).reply(201)
  await t.resolves(access.grant('bar', 'myorg:myteam', 'read-write', OPTS))
})

t.test('access grant no opts passed', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url
  tnock(t, 'https://registry.npmjs.org')
    .put('/-/team/myorg/myteam/package', {
      package: 'bar',
      permissions: 'read-write',
    })
    .reply(201)
  await t.resolves(access.grant('bar', 'myorg:myteam', 'read-write'))
})

t.test('access revoke basic', async t => {
  tnock(t, REG).delete('/-/team/myorg/myteam/package', {
    package: '@foo/bar',
  }).reply(200)
  await t.resolves(access.revoke('@foo/bar', 'myorg:myteam', OPTS))
})

t.test('access revoke basic unscoped', async t => {
  tnock(t, REG).delete('/-/team/myorg/myteam/package', {
    package: 'bar',
  }).reply(200, { accessChanged: true })
  await t.resolves(access.revoke('bar', 'myorg:myteam', OPTS))
})

t.test('access revoke no opts passed', async t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url
  tnock(t, 'https://registry.npmjs.org')
    .delete('/-/team/myorg/myteam/package', {
      package: 'bar',
    })
    .reply(201)
  await t.resolves(access.revoke('bar', 'myorg:myteam'))
})

t.test('ls-packages on team', async t => {
  const serverPackages = {
    '@foo/bar': 'write',
    '@foo/util': 'read',
    '@foo/other': 'shrödinger',
  }
  const clientPackages = {
    '@foo/bar': 'read-write',
    '@foo/util': 'read-only',
    '@foo/other': 'shrödinger',
  }
  tnock(t, REG).get(
    '/-/team/myorg/myteam/package?format=cli'
  ).reply(200, serverPackages)
  const data = await access.lsPackages('myorg:myteam', OPTS)
  t.same(data, clientPackages, 'got client package info')
})

t.test('ls-packages on org', async t => {
  const serverPackages = {
    '@foo/bar': 'write',
    '@foo/util': 'read',
    '@foo/other': 'shrödinger',
  }
  const clientPackages = {
    '@foo/bar': 'read-write',
    '@foo/util': 'read-only',
    '@foo/other': 'shrödinger',
  }
  tnock(t, REG).get(
    '/-/org/myorg/package?format=cli'
  ).reply(200, serverPackages)
  const data = await access.lsPackages('myorg', OPTS)
  t.same(data, clientPackages, 'got client package info')
})

t.test('ls-packages on user', async t => {
  const serverPackages = {
    '@foo/bar': 'write',
    '@foo/util': 'read',
    '@foo/other': 'shrödinger',
  }
  const clientPackages = {
    '@foo/bar': 'read-write',
    '@foo/util': 'read-only',
    '@foo/other': 'shrödinger',
  }
  const srv = tnock(t, REG)
  srv.get('/-/org/myuser/package?format=cli').reply(404, { error: 'not found' })
  srv.get('/-/user/myuser/package?format=cli').reply(200, serverPackages)
  const data = await access.lsPackages('myuser', OPTS)
  t.same(data, clientPackages, 'got client package info')
})

t.test('ls-packages error on team', async t => {
  tnock(t, REG).get('/-/team/myorg/myteam/package?format=cli').reply(404)
  await t.rejects(
    access.lsPackages('myorg:myteam', OPTS),
    { code: 'E404' },
    'spit out 404 directly if team provided'
  )
})

t.test('ls-packages error on user', async t => {
  const srv = tnock(t, REG)
  srv.get('/-/org/myuser/package?format=cli').reply(404, { error: 'not found' })
  srv.get('/-/user/myuser/package?format=cli').reply(404, { error: 'not found' })
  await t.rejects(
    access.lsPackages('myuser', OPTS),
    { code: 'E404' },
    'spit out 404 if both reqs fail'
  )
})

t.test('ls-packages bad response', async t => {
  tnock(t, REG).get(
    '/-/team/myorg/myteam/package?format=cli'
  ).reply(200, JSON.stringify(null))
  const data = await access.lsPackages('myorg:myteam', OPTS)
  t.same(data, null, 'succeeds with null')
})

t.test('ls-packages stream', async t => {
  const serverPackages = {
    '@foo/bar': 'write',
    '@foo/util': 'read',
    '@foo/other': 'shrödinger',
  }
  const clientPackages = [
    ['@foo/bar', 'read-write'],
    ['@foo/util', 'read-only'],
    ['@foo/other', 'shrödinger'],
  ]
  tnock(t, REG).get(
    '/-/team/myorg/myteam/package?format=cli'
  ).reply(200, serverPackages)
  const data = await access.lsPackages.stream('myorg:myteam', OPTS).collect()
  t.same(data, clientPackages, 'got streamed client package info')
})

t.test('ls-packages stream no opts', async t => {
  const serverPackages = {
    '@foo/bar': 'write',
    '@foo/util': 'read',
    '@foo/other': 'shrödinger',
  }
  const clientPackages = [
    ['@foo/bar', 'read-write'],
    ['@foo/util', 'read-only'],
    ['@foo/other', 'shrödinger'],
  ]
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/team/myorg/myteam/package?format=cli')
    .reply(200, serverPackages)
  const data = await access.lsPackages.stream('myorg:myteam').collect()
  t.same(data, clientPackages, 'got streamed client package info')
})

t.test('ls-collaborators', async t => {
  const serverCollaborators = {
    'myorg:myteam': 'write',
    'myorg:anotherteam': 'read',
    'myorg:thirdteam': 'special-case',
  }
  const clientCollaborators = {
    'myorg:myteam': 'read-write',
    'myorg:anotherteam': 'read-only',
    'myorg:thirdteam': 'special-case',
  }
  tnock(t, REG).get(
    '/-/package/%40foo%2Fbar/collaborators?format=cli'
  ).reply(200, serverCollaborators)
  const data = await access.lsCollaborators('@foo/bar', OPTS)
  t.same(data, clientCollaborators, 'got collaborators')
})

t.test('ls-collaborators stream', async t => {
  const serverCollaborators = {
    'myorg:myteam': 'write',
    'myorg:anotherteam': 'read',
    'myorg:thirdteam': 'special-case',
  }
  const clientCollaborators = [
    ['myorg:myteam', 'read-write'],
    ['myorg:anotherteam', 'read-only'],
    ['myorg:thirdteam', 'special-case'],
  ]
  tnock(t, REG).get(
    '/-/package/%40foo%2Fbar/collaborators?format=cli'
  ).reply(200, serverCollaborators)
  const data = await access.lsCollaborators.stream('@foo/bar', OPTS).collect()
  t.same(data, clientCollaborators, 'got collaborators')
})

t.test('ls-collaborators w/scope', async t => {
  const serverCollaborators = {
    'myorg:myteam': 'write',
    'myorg:anotherteam': 'read',
    'myorg:thirdteam': 'special-case',
  }
  const clientCollaborators = {
    'myorg:myteam': 'read-write',
    'myorg:anotherteam': 'read-only',
    'myorg:thirdteam': 'special-case',
  }
  tnock(t, REG).get(
    '/-/package/%40foo%2Fbar/collaborators?format=cli&user=zkat'
  ).reply(200, serverCollaborators)
  const data = await access.lsCollaborators('@foo/bar', 'zkat', OPTS)
  t.same(data, clientCollaborators, 'got collaborators')
})

t.test('ls-collaborators w/o scope', async t => {
  const serverCollaborators = {
    'myorg:myteam': 'write',
    'myorg:anotherteam': 'read',
    'myorg:thirdteam': 'special-case',
  }
  const clientCollaborators = {
    'myorg:myteam': 'read-write',
    'myorg:anotherteam': 'read-only',
    'myorg:thirdteam': 'special-case',
  }
  tnock(t, REG).get(
    '/-/package/bar/collaborators?format=cli&user=zkat'
  ).reply(200, serverCollaborators)
  const data = await access.lsCollaborators('bar', 'zkat', OPTS)
  t.same(data, clientCollaborators, 'got collaborators')
})

t.test('ls-collaborators bad response', async t => {
  tnock(t, REG).get(
    '/-/package/%40foo%2Fbar/collaborators?format=cli'
  ).reply(200, JSON.stringify(null))
  const data = await access.lsCollaborators('@foo/bar', null, OPTS)
  t.same(data, null, 'succeeds with null')
})

t.test('error on non-registry specs', async t => {
  await t.rejects(access.public('githubusername/reponame'),
    /spec.*must be a registry spec/, 'registry spec required')
  await t.rejects(access.restricted('foo/bar'),
    /spec.*must be a registry spec/, 'registry spec required')
  await t.rejects(access.grant('foo/bar', 'myorg', 'myteam', 'read-only'),
    /spec.*must be a registry spec/, 'registry spec required')
  await t.rejects(access.revoke('foo/bar', 'myorg', 'myteam'),
    /spec.*must be a registry spec/, 'registry spec required')
  await t.rejects(access.lsCollaborators('foo/bar'),
    /spec.*must be a registry spec/, 'registry spec required')
  await t.rejects(access.tfaRequired('foo/bar'),
    /spec.*must be a registry spec/, 'registry spec required')
  await t.rejects(access.tfaNotRequired('foo/bar'),
    /spec.*must be a registry spec/, 'registry spec required')
})

t.test('edit', t => {
  t.equal(typeof access.edit, 'function', 'access.edit exists')
  t.throws(() => {
    access.edit()
  }, /Not implemented/, 'directly throws NIY message')
  t.end()
})
