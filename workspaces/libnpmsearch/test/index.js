'use strict'

const qs = require('node:querystring')
const test = require('tap').test
const tnock = require('./fixtures/tnock.js')

const OPTS = {
  registry: 'https://mock.reg/',
}

const REG = OPTS.registry
const NPM_REG = 'https://registry.npmjs.org/'
const search = require('../lib/index.js')

test('basic test no options', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 0.65,
    popularity: 0.98,
    maintenance: 0.5,
  })
  tnock(t, NPM_REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'foo', version: '2.0.0' } },
    ],
  })
  const results = await search('oo')
  t.match(results, [{
    name: 'cool',
    version: '1.0.0',
  }, {
    name: 'foo',
    version: '2.0.0',
  }], 'got back an array of search results')
})

test('basic test', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 0.65,
    popularity: 0.98,
    maintenance: 0.5,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'foo', version: '2.0.0' } },
    ],
  })
  const results = await search('oo', OPTS)
  t.match(results, [{
    name: 'cool',
    version: '1.0.0',
  }, {
    name: 'foo',
    version: '2.0.0',
  }], 'got back an array of search results')
})

test('basic test supports nested options', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 1,
    quality: 0.65,
    popularity: 0.98,
    maintenance: 0.5,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'foo', version: '2.0.0' } },
    ],
  })

  // this test is to ensure we don't break the nested opts parameter
  // that the cli supplies when a user passes --searchopts=
  const results = await search('oo', { ...OPTS, opts: { from: 1 } })
  t.match(results, [{
    name: 'cool',
    version: '1.0.0',
  }, {
    name: 'foo',
    version: '2.0.0',
  }], 'got back an array of search results')
})

test('search.stream', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 0.65,
    popularity: 0.98,
    maintenance: 0.5,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0', date: new Date().toISOString() } },
      { package: { name: 'foo', version: '2.0.0' } },
    ],
  })
  const results = await search.stream('oo', OPTS).collect()
  t.match(results, [{
    name: 'cool',
    version: '1.0.0',
  }, {
    name: 'foo',
    version: '2.0.0',
  }], 'has a stream-based API function with identical results')
})

test('accepts a limit option', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 3,
    from: 0,
    quality: 0.65,
    popularity: 0.98,
    maintenance: 0.5,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
    ],
  })
  const results = await search('oo', { ...OPTS, limit: 3 })
  t.equal(results.length, 4, 'returns more results if endpoint does so')
})

test('accepts a from option', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 1,
    quality: 0.65,
    popularity: 0.98,
    maintenance: 0.5,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.1.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
    ],
  })
  const results = await search('oo', { ...OPTS, from: 1 })
  t.equal(results.length, 4, 'returns more results if endpoint does so')
})

test('accepts quality/mainenance/popularity options', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 1,
    popularity: 2,
    maintenance: 3,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
    ],
  })
  const results = await search('oo', {
    ...OPTS,
    quality: 1,
    popularity: 2,
    maintenance: 3,
  })
  t.equal(results.length, 4, 'returns more results if endpoint does so')
})

test('sortBy: quality', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 1,
    popularity: 0,
    maintenance: 0,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
    ],
  })
  const results = await search('oo', {
    ...OPTS,
    sortBy: 'quality',
  })
  t.equal(results.length, 4, 'returns more results if endpoint does so')
})

test('sortBy: popularity', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 0,
    popularity: 1,
    maintenance: 0,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
    ],
  })
  const results = await search('oo', {
    ...OPTS,
    sortBy: 'popularity',
  })
  t.equal(results.length, 4, 'returns more results if endpoint does so')
})

test('sortBy: maintenance', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 0,
    popularity: 0,
    maintenance: 1,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
    ],
  })
  const results = await search('oo', {
    ...OPTS,
    sortBy: 'maintenance',
  })
  t.equal(results.length, 4, 'returns more results if endpoint does so')
})

test('sortBy: optimal', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 0.65,
    popularity: 0.98,
    maintenance: 0.5,
  })
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: [
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
      { package: { name: 'cool', version: '1.0.0' } },
    ],
  })
  const results = await search('oo', {
    ...OPTS,
    sortBy: 'optimal',
  })
  t.equal(results.length, 4, 'returns more results if endpoint does so')
})

test('detailed format', async t => {
  const query = qs.stringify({
    text: 'oo',
    size: 20,
    from: 0,
    quality: 0,
    popularity: 0,
    maintenance: 1,
  })
  const results = [
    {
      package: { name: 'cool', version: '1.0.0' },
      score: {
        final: 0.9237841281241451,
        detail: {
          quality: 0.9270640902288084,
          popularity: 0.8484861649808381,
          maintenance: 0.9962706951777409,
        },
      },
      searchScore: 100000.914,
    },
    {
      package: { name: 'ok', version: '2.0.0' },
      score: {
        final: 0.9237841281451,
        detail: {
          quality: 0.9270602288084,
          popularity: 0.8461649808381,
          maintenance: 0.9706951777409,
        },
      },
      searchScore: 1000.91,
    },
  ]
  tnock(t, REG).get(`/-/v1/search?${query}`).once().reply(200, {
    objects: results,
  })
  const res = await search('oo', {
    ...OPTS,
    sortBy: 'maintenance',
    detailed: true,
  })
  t.same(res, results, 'return full-format results with opts.detailed')
})

test('space-separates and URI-encodes multiple search params', async t => {
  const query = qs.stringify({
    text: 'foo bar:baz quux?=',
    size: 1,
    from: 0,
    quality: 1,
    popularity: 2,
    maintenance: 3,
  }).replace(/%20/g, '+')

  tnock(t, REG).get(`/-/v1/search?${query}`).reply(200, { objects: [] })
  await t.resolves(search(['foo', 'bar:baz', 'quux?='], {
    ...OPTS,
    limit: 1,
    quality: 1,
    popularity: 2,
    maintenance: 3,
  }))
})
