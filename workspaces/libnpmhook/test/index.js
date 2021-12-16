'use strict'

const test = require('tap').test
const tnock = require('./fixtures/tnock.js')

const hooks = require('../lib/index.js')

const OPTS = {
  registry: 'https://mock.reg/',
}

const HOOK_URL = 'https://my.hook.url/'
const REG = 'https://registry.npmjs.org/'

test('add package hook with no options', t => {
  const params = {
    type: 'package',
    name: 'mypkg',
    endpoint: HOOK_URL,
    secret: 'sekrit',
  }
  const hook = Object.assign({
    id: 'deadbeef',
    status: 'active',
  }, params)
  tnock(t, REG)
    .post('/-/npm/v1/hooks/hook', params)
    .reply(200, hook)
  return hooks.add('mypkg', HOOK_URL, 'sekrit')
    .then(json => t.same(json, hook))
})

test('add package hook', t => {
  const params = {
    type: 'package',
    name: 'mypkg',
    endpoint: HOOK_URL,
    secret: 'sekrit',
  }
  const hook = Object.assign({
    id: 'deadbeef',
    status: 'active',
  }, params)
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook', params)
    .reply(200, hook)
  return hooks.add('mypkg', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.same(json, hook))
})

test('add scoped package hook', t => {
  const params = {
    type: 'package',
    name: '@myscope/mypkg',
    endpoint: HOOK_URL,
    secret: 'sekrit',
  }
  const hook = Object.assign({
    id: 'deadbeef',
    status: 'active',
  }, params)
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook', params)
    .reply(200, hook)
  return hooks.add('@myscope/mypkg', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.same(json, hook))
})

test('add owner hook', t => {
  const params = {
    type: 'owner',
    name: 'myuser',
    endpoint: HOOK_URL,
    secret: 'sekrit',
  }
  const hook = Object.assign({
    id: 'deadbeef',
    status: 'active',
  }, params)
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook', params)
    .reply(200, hook)
  return hooks.add('~myuser', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.same(json, hook))
})

test('add scope hook', t => {
  const params = {
    type: 'scope',
    name: '@myscope',
    endpoint: HOOK_URL,
    secret: 'sekrit',
  }
  const hook = Object.assign({
    id: 'deadbeef',
    status: 'active',
  }, params)
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook', params)
    .reply(200, hook)
  return hooks.add('@myscope', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.same(json, hook))
})

test('rm with no options', t => {
  tnock(t, REG)
    .delete('/-/npm/v1/hooks/hook/hithere')
    .reply(200, { id: 'hithere' })
  return hooks.rm('hithere')
    .then(json => t.equal(json.id, 'hithere'))
})

test('rm', t => {
  tnock(t, OPTS.registry)
    .delete('/-/npm/v1/hooks/hook/hithere')
    .reply(200, { id: 'hithere' })
  return hooks.rm('hithere', OPTS)
    .then(json => t.equal(json.id, 'hithere'))
})

test('rm null on 404', t => {
  tnock(t, OPTS.registry)
    .delete('/-/npm/v1/hooks/hook/hithere')
    .reply(404)
  return hooks.rm('hithere', OPTS)
    .then(json => t.equal(json, null))
})

test('rm null on other err', t => {
  tnock(t, OPTS.registry)
    .delete('/-/npm/v1/hooks/hook/hithere')
    .reply(401)
  return hooks.rm('hithere', OPTS).then(
    () => {
      throw new Error('should not succees')
    },
    err => t.equal(err.code, 'E401', 'got a proper error + code')
  )
})

test('find with no options', t => {
  tnock(t, REG)
    .get('/-/npm/v1/hooks/hook/hithere')
    .reply(200, { id: 'hithere' })
  return hooks.find('hithere')
    .then(json => t.equal(json.id, 'hithere'))
})

test('find', t => {
  tnock(t, OPTS.registry)
    .get('/-/npm/v1/hooks/hook/hithere')
    .reply(200, { id: 'hithere' })
  return hooks.find('hithere', OPTS)
    .then(json => t.equal(json.id, 'hithere'))
})

test('ls', t => {
  const entries = [
    { id: 'first' },
    { id: 'second' },
    { id: 'third' },
  ]
  tnock(t, REG)
    .get('/-/npm/v1/hooks')
    .reply(200, { objects: entries })
  return hooks.ls().then(
    json => t.same(json, entries)
  )
})

test('ls.stream', t => {
  const entries = [
    { id: 'first' },
    { id: 'second' },
    { id: 'third' },
  ]
  tnock(t, REG)
    .get('/-/npm/v1/hooks')
    .reply(200, { objects: entries })

  return hooks.ls.stream().collect().then(
    json => t.same(json, entries)
  )
})

test('ls', t => {
  const entries = [
    { id: 'first' },
    { id: 'second' },
    { id: 'third' },
  ]
  tnock(t, OPTS.registry)
    .get('/-/npm/v1/hooks')
    .reply(200, { objects: entries })
  return hooks.ls(OPTS).then(
    json => t.same(json, entries)
  )
})

test('ls package', t => {
  const entries = [
    { id: 'first' },
    { id: 'second' },
    { id: 'third' },
  ]
  tnock(t, OPTS.registry)
    .get('/-/npm/v1/hooks?package=%40npm%2Fhooks')
    .reply(200, { objects: entries })
  return hooks.ls({
    ...OPTS,
    package: '@npm/hooks',
  }).then(json => t.same(json, entries))
})

test('ls limit+offset', t => {
  const entries = [
    { id: 'first' },
    { id: 'second' },
    { id: 'third' },
  ]
  tnock(t, OPTS.registry)
    .get('/-/npm/v1/hooks?limit=10&offset=20')
    .reply(200, { objects: entries })
  return hooks.ls({
    ...OPTS,
    limit: 10,
    offset: 20,
  }).then(json => t.same(json, entries))
})

test('ls package+limit+offset', t => {
  const entries = [
    { id: 'first' },
    { id: 'second' },
    { id: 'third' },
  ]
  tnock(t, OPTS.registry)
    .get('/-/npm/v1/hooks?package=%40npm%2Fhooks&limit=10&offset=20')
    .reply(200, { objects: entries })
  return hooks.ls({
    ...OPTS,
    limit: 10,
    offset: 20,
    package: '@npm/hooks',
  }).then(json => t.same(json, entries))
})
test('update with no options', t => {
  tnock(t, REG)
    .put('/-/npm/v1/hooks/hook/hi')
    .reply(200, (uri, body) => body)
  return hooks.update('hi', HOOK_URL, 'sekrit')
    .then(json => t.same(json, {
      endpoint: HOOK_URL,
      secret: 'sekrit',
    }))
})

test('update', t => {
  tnock(t, OPTS.registry)
    .put('/-/npm/v1/hooks/hook/hi')
    .reply(200, (uri, body) => body)
  return hooks.update('hi', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.same(json, {
      endpoint: HOOK_URL,
      secret: 'sekrit',
    }))
})
