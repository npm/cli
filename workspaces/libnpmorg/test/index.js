'use strict'

const { Minipass } = require('minipass')
const test = require('tap').test
const tnock = require('./fixtures/tnock.js')

const org = require('../lib/index.js')

const OPTS = {
  registry: 'https://mock.reg/',
}
const REG = 'https://registry.npmjs.org/'

test('set', async t => {
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

  const res = await org.set('myorg', 'myuser', 'admin', OPTS)
  t.same(res, memDeets, 'got a membership details object back')
})

test('optional role for set', async t => {
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
  const res = await org.set('myorg', 'myuser', OPTS)
  t.same(res, memDeets, 'got a membership details object back')
})

test('rm with no options', async t => {
  tnock(t, REG).delete('/-/org/myorg/user', {
    user: 'myuser',
  }).reply(204)
  await t.resolves(org.rm('myorg', 'myuser'))
})

test('rm', async t => {
  tnock(t, OPTS.registry).delete('/-/org/myorg/user', {
    user: 'myuser',
  }).reply(204)
  const ret = await org.rm('myorg', 'myuser', OPTS)
  t.equal(ret, null, 'null return value')
})

test('ls with no options', async t => {
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  tnock(t, REG).get('/-/org/myorg/user').reply(200, roster)
  const res = await org.ls('myorg')
  t.same(res, roster, 'got back a roster')
})

test('ls', async t => {
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  tnock(t, OPTS.registry).get('/-/org/myorg/user').reply(200, roster)
  const res = await org.ls('myorg', OPTS)
  t.same(res, roster, 'got back a roster')
})

test('ls stream with no options', async t => {
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  const rosterArr = Object.keys(roster).map(k => [k, roster[k]])
  tnock(t, REG).get('/-/org/myorg/user').reply(200, roster)
  const result = org.ls.stream('myorg')
  t.ok(Minipass.isStream(result), 'returns a stream')
  const res = await result.collect()
  t.same(res, rosterArr, 'got back a roster, in entries format')
})

test('ls stream', async t => {
  const roster = {
    zkat: 'developer',
    iarna: 'admin',
    isaacs: 'owner',
  }
  const rosterArr = Object.keys(roster).map(k => [k, roster[k]])
  tnock(t, OPTS.registry).get('/-/org/myorg/user').reply(200, roster)
  const result = org.ls.stream('myorg', OPTS)
  t.ok(Minipass.isStream(result), 'returns a stream')
  const res = await result.collect()
  t.same(res, rosterArr, 'got back a roster, in entries format')
})
