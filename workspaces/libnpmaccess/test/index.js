'use strict'

const t = require('tap')
const tnock = require('./fixtures/tnock.js')

const access = require('../lib/index.js')

const REG = 'http://localhost:1337'
const OPTS = {
  registry: REG,
}

t.test('getCollaborators', t => {
  t.test('success', async t => {
    const collaborators = {
      'npm:myteam': 'write',
      'npm:anotherteam': 'read',
      'npm:thirdteam': 'special-case',
    }
    tnock(t, REG).get('/-/package/@npmcli%2ftest-package/collaborators').reply(200, collaborators)
    const data = await access.getCollaborators('@npmcli/test-package', OPTS)
    t.same(data, collaborators)
  })
  t.test('non registry package', async t => {
    await t.rejects(access.getCollaborators('./local', OPTS), /package name only/)
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
    tnock(t, REG).get('/-/team/npm/myteam/package').reply(200, packages)
    const data = await access.getPackages('npm:myteam', OPTS)
    t.same(data, packages)
  })
  t.test('org', async t => {
    tnock(t, REG).get('/-/org/npm/package').reply(200, packages)
    const data = await access.getPackages('npm', OPTS)
    t.same(data, packages)
  })
  t.test('user', async t => {
    tnock(t, REG).get('/-/org/testuser/package').reply(404, {})
    tnock(t, REG).get('/-/user/testuser/package').reply(200, packages)
    const data = await access.getPackages('testuser', OPTS)
    t.same(data, packages)
  })
  t.test('registry error', async t => {
    tnock(t, REG).get('/-/org/npm/package').reply(500, {})
    await t.rejects(access.getPackages('npm', OPTS), { code: 'E500' })
  })
  t.end()
})

t.test('getVisibility', t => {
  t.test('success', async t => {
    const visibility = { public: true }
    tnock(t, REG).get('/-/package/@npmcli%2ftest-package/visibility').reply(200, visibility)
    const data = await access.getVisibility('@npmcli/test-package', OPTS)
    t.same(data, visibility)
  })
  t.test('non registry package', async t => {
    await t.rejects(access.getVisibility('./local', OPTS), /package name only/)
  })
  t.end()
})

t.test('removePermissions', t => {
  t.test('success', async t => {
    tnock(t, REG).delete('/-/team/npm/myteam/package', {
      package: '@npmcli/test-package',
    }).reply(200)
    await t.resolves(access.removePermissions('npm:myteam', '@npmcli/test-package', OPTS))
  })
  t.test('non registry spec', async t => {
    await t.rejects(access.removePermissions('npm:myteam', './local', OPTS), /package name only/)
  })
  t.end()
})

t.test('setAccess', t => {
  t.test('public', async t => {
    tnock(t, REG).post(
      '/-/package/@npmcli%2ftest-package/access', { access: 'public' }
    ).reply(200)
    await t.resolves(access.setAccess('@npmcli/test-package', 'public', OPTS))
  })
  t.test('restricted', async t => {
    tnock(t, REG).post(
      '/-/package/@npmcli%2ftest-package/access', { access: 'restricted' }
    ).reply(200)
    await t.resolves(access.setAccess('@npmcli/test-package', 'restricted', OPTS))
  })
  t.test('non registry package', async t => {
    await t.rejects(access.setAccess('./local', 'public', OPTS), /package name only/)
  })
  t.end()
})

t.test('setMfa', t => {
  t.test('none', async t => {
    tnock(t, REG).post('/-/package/@npmcli%2ftest-package/access', {
      publish_requires_tfa: false,
    }).reply(200)
    await t.resolves(access.setMfa('@npmcli/test-package', 'none', OPTS))
  })
  t.test('publish', async t => {
    tnock(t, REG).post('/-/package/@npmcli%2ftest-package/access', {
      publish_requires_tfa: true,
      automation_token_overrides_tfa: false,
    }).reply(200)
    await t.resolves(access.setMfa('@npmcli/test-package', 'publish', OPTS))
  })
  t.test('automation', async t => {
    tnock(t, REG).post('/-/package/@npmcli%2ftest-package/access', {
      publish_requires_tfa: true,
      automation_token_overrides_tfa: true,
    }).reply(200)
    await t.resolves(access.setMfa('@npmcli/test-package', 'automation', OPTS))
  })
  t.test('invalid', async t => {
    await t.rejects(access.setMfa('@npmcli/test-package', 'invalid', OPTS), /Invalid mfa setting/)
  })
  t.test('non registry spec', async t => {
    await t.rejects(access.setMfa('./local', 'none', OPTS, /package name only/))
  })
  t.end()
})

t.test('setPermissions', t => {
  t.test('scope:team read-only', async t => {
    tnock(t, REG).put('/-/team/npmcli/myteam/package', {
      package: '@npmcli/test-package',
      permissions: 'read-only',
    }).reply(201)
    await t.resolves(
      access.setPermissions('npmcli:myteam', '@npmcli/test-package', 'read-only', OPTS)
    )
  })
  t.test('scope only', async t => {
    await t.rejects(
      access.setPermissions('npmcli', '@npmcli/test-package', 'read-only', OPTS),
      /scope:team/
    )
  })

  t.test('no scope or team', async t => {
    await t.rejects(
      access.setPermissions('@:myteam', '@npmcli/test-package', 'read-only', OPTS),
      /scope:team/
    )
  })

  t.end()
})
