'use strict'

const t = require('tap')
const tnock = require('./fixtures/tnock.js')

const OPTS = {
  registry: 'https://mock.reg/',
}

const REG = OPTS.registry
const REV = '72-47f2986bfd8e8b55068b204588bbf484'
const unpub = require('../lib/unpublish.js')

t.test('basic test', async t => {
  const doc = {
    _id: 'foo',
    _rev: REV,
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.0.tgz`,
        },
      },
    },
  }
  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(200, doc)
  srv.delete(`/foo/-rev/${REV}`).reply(201)
  const ret = await unpub('foo', OPTS)
  t.ok(ret, 'foo was unpublished')
})

t.test('scoped basic test', async t => {
  const doc = {
    _id: '@foo/bar',
    _rev: REV,
    name: '@foo/bar',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: '@foo/bar',
        dist: {
          tarball: `${REG}/@foo/bar/-/foo-1.0.0.tgz`,
        },
      },
    },
  }
  const srv = tnock(t, REG)
  srv.get('/@foo%2fbar?write=true').reply(200, doc)
  srv.delete(`/@foo%2fbar/-rev/${REV}`).reply(201)
  const ret = await unpub('@foo/bar', OPTS)
  t.ok(ret, 'foo was unpublished')
})

t.test('unpublish specific, last version', async t => {
  const doc = {
    _id: 'foo',
    _rev: REV,
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.0.tgz`,
        },
      },
    },
  }
  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(200, doc)
  srv.delete(`/foo/-rev/${REV}`).reply(201)
  const ret = await unpub('foo@1.0.0', OPTS)
  t.ok(ret, 'foo was unpublished')
})

t.test('unpublish specific version', async t => {
  const doc = {
    _id: 'foo',
    _rev: REV,
    _revisions: [1, 2, 3],
    _attachments: [1, 2, 3],
    name: 'foo',
    'dist-tags': {
      latest: '1.0.1',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.0.tgz`,
        },
      },
      '1.0.1': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.1.tgz`,
        },
      },
    },
  }
  const postEdit = {
    _id: 'foo',
    _rev: REV,
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.0.tgz`,
        },
      },
    },
  }

  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(200, doc)
  srv.put(`/foo/-rev/${REV}`, postEdit).reply(200)
  srv.get('/foo?write=true').reply(200, postEdit)
  srv.delete(`/foo/-/foo-1.0.1.tgz/-rev/${REV}`).reply(200)
  const ret = await unpub('foo@1.0.1', OPTS)
  t.ok(ret, 'foo was unpublished')
})

t.test('unpublishing from a custom registry', async t => {
  const opt = {
    registry: 'https://artifactory.example.com/api/npm/npm-snapshots/',
  }
  const reg = opt.registry
  const doc = {
    _id: 'foo',
    _rev: REV,
    _revisions: [1, 2, 3],
    _attachments: [1, 2, 3],
    name: 'foo',
    'dist-tags': {
      latest: '1.0.1',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${reg}/foo/-/foo-1.0.0.tgz`,
        },
      },
      '1.0.1': {
        name: 'foo',
        dist: {
          tarball: `${reg}/foo/-/foo-1.0.1.tgz`,
        },
      },
    },
  }
  const postEdit = {
    _id: 'foo',
    _rev: REV,
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${reg}/foo/-/foo-1.0.0.tgz`,
        },
      },
    },
  }

  const srv = tnock(t, reg)
  srv.get('/foo?write=true').reply(200, doc)
  srv.put(`/foo/-rev/${REV}`, postEdit).reply(200)
  srv.get('/foo?write=true').reply(200, postEdit)
  srv.delete(`/foo/-/foo-1.0.1.tgz/-rev/${REV}`).reply(200)
  const ret = await unpub('foo@1.0.1', opt)
  t.ok(ret, 'foo was unpublished')
})

t.test('404 considered a success', async t => {
  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(404)
  const ret = await unpub('foo', OPTS)
  t.ok(ret, 'foo was unpublished')
})

t.test('non-404 errors', async t => {
  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(500)

  try {
    await unpub('foo', OPTS)
  } catch (err) {
    t.equal(err.code, 'E500', 'got right error from server')
  }
})

t.test('packument with missing versions unpublishes whole thing', async t => {
  const doc = {
    _id: 'foo',
    _rev: REV,
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
  }
  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(200, doc)
  srv.delete(`/foo/-rev/${REV}`).reply(201)
  const ret = await unpub('foo@1.0.0', OPTS)
  t.ok(ret, 'foo was unpublished')
})

t.test('packument with missing specific version assumed unpublished', async t => {
  const doc = {
    _id: 'foo',
    _rev: REV,
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.0.tgz`,
        },
      },
    },
  }
  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(200, doc)
  const ret = await unpub('foo@1.0.1', OPTS)
  t.ok(ret, 'foo was unpublished')
})

t.test('unpublish specific version without dist-tag update', async t => {
  const doc = {
    _id: 'foo',
    _rev: REV,
    _revisions: [1, 2, 3],
    _attachments: [1, 2, 3],
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.0.tgz`,
        },
      },
      '1.0.1': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.1.tgz`,
        },
      },
    },
  }
  const postEdit = {
    _id: 'foo',
    _rev: REV,
    name: 'foo',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        name: 'foo',
        dist: {
          tarball: `${REG}/foo/-/foo-1.0.0.tgz`,
        },
      },
    },
  }
  const srv = tnock(t, REG)
  srv.get('/foo?write=true').reply(200, doc)
  srv.put(`/foo/-rev/${REV}`, postEdit).reply(200)
  srv.get('/foo?write=true').reply(200, postEdit)
  srv.delete(`/foo/-/foo-1.0.1.tgz/-rev/${REV}`).reply(200)
  const ret = await unpub('foo@1.0.1', OPTS)
  t.ok(ret, 'foo was unpublished')
})
