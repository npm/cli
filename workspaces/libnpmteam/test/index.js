'use strict'

const { test } = require('tap')
const tnock = require('./fixtures/tnock.js')

const team = require('../lib/index.js')

const REG = 'http://localhost:1337'
const OPTS = {
  registry: REG,
}

test('create', t => {
  tnock(t, REG).put(
    '/-/org/foo/team', { name: 'cli' }
  ).reply(201, { name: 'cli' })
  return team.create('@foo:cli', OPTS).then(ret => {
    t.same(ret, { name: 'cli' }, 'request succeeded')
  })
})

test('create - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .put('/-/org/foo/team', { name: 'cli' })
    .reply(201, { name: 'cli' })

  return team.create('@foo:cli')
    .then(ret => {
      t.same(ret, { name: 'cli' })
    })
})

test('create bad entity name', t => {
  return team.create('go away', OPTS).then(
    () => {
      throw new Error('should not succeed')
    },
    err => {
      t.ok(err, 'error on bad entity name')
    }
  )
})

test('create empty entity', t => {
  return team.create(undefined, OPTS).then(
    () => {
      throw new Error('should not succeed')
    },
    err => {
      t.ok(err, 'error on bad entity name')
    }
  )
})

test('create w/ description', t => {
  tnock(t, REG).put('/-/org/foo/team', {
    name: 'cli',
    description: 'just some cool folx',
  }).reply(201, { name: 'cli' })
  return team.create('@foo:cli', {
    ...OPTS,
    description: 'just some cool folx',
  }).then(ret => {
    t.same(ret, { name: 'cli' }, 'no desc in return')
  })
})

test('destroy', t => {
  tnock(t, REG).delete(
    '/-/team/foo/cli'
  ).reply(204, {})
  return team.destroy('@foo:cli', OPTS).then(ret => {
    t.same(ret, {}, 'request succeeded')
  })
})

test('destroy - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .delete('/-/team/foo/cli')
    .reply(204, {})

  return team.destroy('@foo:cli').then(ret => {
    t.same(ret, {}, 'request succeeded')
  })
})

test('add', t => {
  tnock(t, REG).put(
    '/-/team/foo/cli/user', { user: 'zkat' }
  ).reply(201, {})
  return team.add('zkat', '@foo:cli', OPTS).then(ret => {
    t.same(ret, {}, 'request succeeded')
  })
})

test('add - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .put('/-/team/foo/cli/user', { user: 'zkat' })
    .reply(201, {})

  return team.add('zkat', '@foo:cli').then(ret => {
    t.same(ret, {}, 'request succeeded')
  })
})

test('rm', t => {
  tnock(t, REG).delete(
    '/-/team/foo/cli/user', { user: 'zkat' }
  ).reply(204, {})
  return team.rm('zkat', '@foo:cli', OPTS).then(ret => {
    t.same(ret, {}, 'request succeeded')
  })
})

test('rm - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .delete('/-/team/foo/cli/user', { user: 'zkat' })
    .reply(204, {})

  return team.rm('zkat', '@foo:cli').then(ret => {
    t.same(ret, {}, 'request succeeded')
  })
})

test('lsTeams', t => {
  tnock(t, REG).get(
    '/-/org/foo/team?format=cli'
  ).reply(200, ['foo:bar', 'foo:cli'])
  return team.lsTeams('foo', OPTS).then(ret => {
    t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
  })
})

test('lsTeams - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/org/foo/team?format=cli')
    .reply(200, ['foo:bar', 'foo:cli'])

  return team.lsTeams('foo').then(ret => {
    t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
  })
})

test('lsTeams error', t => {
  tnock(t, REG).get(
    '/-/org/foo/team?format=cli'
  ).reply(500)
  return team.lsTeams('foo', OPTS).then(
    () => {
      throw new Error('should not succeed')
    },
    err => {
      t.equal(err.code, 'E500', 'got error code')
    }
  )
})

test('lsTeams.stream', t => {
  tnock(t, REG).get(
    '/-/org/foo/team?format=cli'
  ).reply(200, ['foo:bar', 'foo:cli'])
  return team.lsTeams.stream('foo', OPTS)
    .collect()
    .then(ret => {
      t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
    })
})

test('lsTeams.stream - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/org/foo/team?format=cli')
    .reply(200, ['foo:bar', 'foo:cli'])

  return team.lsTeams.stream('foo')
    .collect()
    .then(ret => {
      t.same(ret, ['foo:bar', 'foo:cli'], 'got teams')
    })
})

test('lsUsers', t => {
  tnock(t, REG).get(
    '/-/team/foo/cli/user?format=cli'
  ).reply(500)
  return team.lsUsers('@foo:cli', OPTS).then(
    () => {
      throw new Error('should not succeed')
    },
    err => {
      t.equal(err.code, 'E500', 'got error code')
    }
  )
})

test('lsUsers - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/team/foo/cli/user?format=cli')
    .reply(500)

  return team.lsUsers('@foo:cli').then(
    () => {
      throw new Error('should not succeed')
    },
    err => {
      t.equal(err.code, 'E500', 'got error code')
    }
  )
})

test('lsUsers error', t => {
  tnock(t, REG).get(
    '/-/team/foo/cli/user?format=cli'
  ).reply(200, ['iarna', 'zkat'])
  return team.lsUsers('@foo:cli', OPTS).then(ret => {
    t.same(ret, ['iarna', 'zkat'], 'got team members')
  })
})

test('lsUsers.stream', t => {
  tnock(t, REG).get(
    '/-/team/foo/cli/user?format=cli'
  ).reply(200, ['iarna', 'zkat'])
  return team.lsUsers.stream('@foo:cli', OPTS)
    .collect()
    .then(ret => {
      t.same(ret, ['iarna', 'zkat'], 'got team members')
    })
})

test('lsUsers.stream - no options', t => {
  // NOTE: mocking real url, because no opts variable means `registry` value
  // will be defauled to real registry url in `npm-registry-fetch`
  tnock(t, 'https://registry.npmjs.org')
    .get('/-/team/foo/cli/user?format=cli')
    .reply(200, ['iarna', 'zkat'])

  return team.lsUsers.stream('@foo:cli')
    .collect()
    .then(ret => {
      t.same(ret, ['iarna', 'zkat'], 'got team members')
    })
})

test('edit', t => {
  t.throws(() => {
    team.edit()
  }, /not implemented/)
  t.end()
})
