'use strict'

const t = require('tap')
const MockRegistry = require('@npmcli/mock-registry')

const access = require('../lib/index.js')

const opts = {
  registry: 'http://localhost:1337',
}

const pkg = '@npmcli/libnpmaccess-test'
const team = 'npm:test-team'
const orgUser = 'test-user'
const mockRegistry = (t) => {
  return new MockRegistry({
    tap: t,
    strict: true,
    registry: 'http://localhost:1337',
  })
}

t.test('getCollaborators', t => {
  t.test('success', async t => {
    const registry = mockRegistry(t)
    const collaborators = {
      'npm:myteam': 'write',
      'npm:anotherteam': 'read',
      'npm:thirdteam': 'special-case',
    }
    registry.getCollaborators({ spec: pkg, collaborators })
    await t.resolves(
      access.getCollaborators(pkg, opts),
      collaborators
    )
  })

  t.test('non registry package', async t => {
    await t.rejects(access.getCollaborators('./local', opts), /package name only/)
  })
  t.end()
})

t.test('getPackages', t => {
  const packages = {
    '@npmcli/test-package': 'write',
    '@npmcli/util': 'read',
    '@npmcli/other': 'shrödinger',
  }
  t.test('team', async t => {
    const registry = mockRegistry(t)
    registry.getPackages({ team, packages })
    await t.resolves(access.getPackages(team, opts), packages)
  })
  t.test('org', async t => {
    const registry = mockRegistry(t)
    registry.getPackages({ team: 'npm', packages })
    await t.resolves(access.getPackages('npm', opts), packages)
  })
  t.test('user', async t => {
    const registry = mockRegistry(t)
    registry.getPackages({ team: orgUser, responseCode: 404 })
    registry.getPackages({ user: orgUser, packages })
    await t.resolves(access.getPackages(orgUser, opts), packages)
  })
  t.test('registry error', async t => {
    const registry = mockRegistry(t)
    registry.getPackages({ team: orgUser, responseCode: 500 })
    await t.rejects(access.getPackages(orgUser, opts), { code: 'E500' })
  })
  t.end()
})

t.test('getVisibility', t => {
  t.test('success', async t => {
    const registry = mockRegistry(t)
    const visibility = { public: true }
    registry.getVisibility({ spec: pkg, visibility })
    await t.resolves(access.getVisibility(pkg, opts), visibility)
  })
  t.test('non registry package', async t => {
    await t.rejects(access.getVisibility('./local', opts), /package name only/)
  })
  t.end()
})

t.test('removePermissions', t => {
  t.test('success', async t => {
    const registry = mockRegistry(t)
    registry.removePermissions({ spec: pkg, team })
    await t.resolves(access.removePermissions(team, pkg, opts))
  })
  t.test('non registry spec', async t => {
    await t.rejects(access.removePermissions(team, './local', opts), /package name only/)
  })
  t.end()
})

t.test('setAccess', t => {
  t.test('public', async t => {
    const body = { access: 'public' }
    const registry = mockRegistry(t)
    registry.setAccess({ spec: pkg, body })
    await t.resolves(access.setAccess(pkg, 'public', opts))
  })
  t.test('restricted', async t => {
    const body = { access: 'restricted' }
    const registry = mockRegistry(t)
    registry.setAccess({ spec: pkg, body })
    await t.resolves(access.setAccess(pkg, 'restricted', opts))
  })
  t.test('non registry package', async t => {
    await t.rejects(access.setAccess('./local', 'public', opts), /package name only/)
  })
  t.end()
})

t.test('setMfa', t => {
  t.test('none', async t => {
    const registry = mockRegistry(t)
    const body = { publish_requires_tfa: false }
    registry.setAccess({ spec: pkg, body })
    await t.resolves(access.setMfa(pkg, 'none', opts))
  })
  t.test('publish', async t => {
    const registry = mockRegistry(t)
    const body = {
      publish_requires_tfa: true,
      automation_token_overrides_tfa: false,
    }
    registry.setAccess({ spec: pkg, body })
    await t.resolves(access.setMfa(pkg, 'publish', opts))
  })
  t.test('automation', async t => {
    const registry = mockRegistry(t)
    const body = {
      publish_requires_tfa: true,
      automation_token_overrides_tfa: true,
    }
    registry.setAccess({ spec: pkg, body })
    await t.resolves(access.setMfa(pkg, 'automation', opts))
  })
  t.test('invalid', async t => {
    await t.rejects(access.setMfa(pkg, 'invalid', opts), /Invalid mfa setting/)
  })
  t.test('non registry spec', async t => {
    await t.rejects(access.setMfa('./local', 'none', opts, /package name only/))
  })
  t.end()
})

t.test('setPermissions', t => {
  t.test('scope:team read-only', async t => {
    const registry = mockRegistry(t)
    registry.setPermissions({ spec: pkg, team, permissions: 'read-only' })
    await t.resolves(access.setPermissions(team, pkg, 'read-only', opts))
  })
  t.test('scope only', async t => {
    await t.rejects(access.setPermissions('npmcli', pkg, 'read-only', opts), /scope:team/)
  })

  t.test('no scope or team', async t => {
    await t.rejects(access.setPermissions('@:myteam', pkg, 'read-only', opts), /scope:team/)
  })

  t.end()
})
