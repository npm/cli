'use strict'

const Minipass = require('minipass')
const test = require('tap').test
const tnock = require('./fixtures/tnock.js')

const org = require('../lib/index.js')

const OPTS = {
  registry: 'https://mock.reg/',
}
const REG = 'https://registry.npmjs.org/'

test('set', t => {
  const memDeets = {
    org: {
      name: 'myorg',
      size: 15,
    },
    user: 'myuser',
    role: 'admin',
  }
  tnock(t, OPTS.registry)
    .put('/-/org/myorg/user', {
      user: 'myuser',
      role: 'admin',
    })
    .reply(201, memDeets)

  return org.set('myorg', 'myuser', 'admin', OPTS)
    .then(res => {
      t.same(res, memDeets, 'got a membership details object back')
    })
})

test('optional role for set', t => {
  const memDeets = {
    org: {
      name: 'myorg',
      size: 15,
    },
    user: 'myuser',
    role: 'developer',
  }
  tnock(t, OPTS.registry).put('/-/org/myorg/user', {
    user: 'myuser',
  }).reply(201, memDeets)
  return org.set('myorg', 'myuser', OPTS).then(res => {
    t.same(res, memDeets, 'got a membership details object back')
  })
})

test('rm with no options', t => {
  tnock(t, REG).delete('/-/org/myorg/user', {
    user: 'myuser',
  }).reply(204)
  return org.rm('myorg', 'myuser').then(() => {
    t.ok(true, 'request succeeded')
  })
})

test('rm', t => {
  tnock(t, OPTS.registry).delete('/-/org/myorg/user', {
    user: 'myuser',
  }).reply(204)
  return org.rm('myorg', 'myuser', OPTS)
    .then(ret => {
      t.equal(ret, null, 'null return value')
      t.ok(true, 'request succeeded')
    })
})

test('ls with no options', t => {
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  tnock(t, REG).get('/-/org/myorg/user').reply(200, roster)
  return org.ls('myorg').then(res => {
    t.same(res, roster, 'got back a roster')
  })
})

test('ls', t => {
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  tnock(t, OPTS.registry).get('/-/org/myorg/user').reply(200, roster)
  return org.ls('myorg', OPTS).then(res => {
    t.same(res, roster, 'got back a roster')
  })
})

test('ls stream with no options', t => {
  t.plan(2)
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  const rosterArr = Object.keys(roster).map(k => [k, roster[k]])
  tnock(t, REG).get('/-/org/myorg/user').reply(200, roster)
  const result = org.ls.stream('myorg')
  t.ok(Minipass.isStream(result), 'returns a stream')
  return result.collect()
    .then(res => {
      t.same(res, rosterArr, 'got back a roster, in entries format')
    })
})

test('ls stream', t => {
  t.plan(2)
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  const rosterArr = Object.keys(roster).map(k => [k, roster[k]])
  tnock(t, OPTS.registry).get('/-/org/myorg/user').reply(200, roster)
  const result = org.ls.stream('myorg', OPTS)
  t.ok(Minipass.isStream(result), 'returns a stream')
  return result.collect()
    .then(res => {
      t.same(res, rosterArr, 'got back a roster, in entries format')
    })
})
