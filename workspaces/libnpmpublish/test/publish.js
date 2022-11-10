'use strict'

const t = require('tap')
const ssri = require('ssri')
const crypto = require('crypto')
const pack = require('libnpmpack')
const cloneDeep = require('lodash.clonedeep')

const publish = require('../lib/publish.js')
const tnock = require('./fixtures/tnock.js')

const testDir = t.testdir({
  'package.json': JSON.stringify({
    name: 'libnpmpublish',
    version: '1.0.0',
  }, null, 2),
  'index.js': 'hello',
})

const OPTS = {
  registry: 'https://mock.reg/',
}

const REG = OPTS.registry

t.test('basic publish', async t => {
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })
  const packument = {
    _id: 'libnpmpublish',
    name: 'libnpmpublish',
    description: 'some stuff',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        _id: 'libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        name: 'libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    access: 'public',
    _attachments: {
      'libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  }

  const srv = tnock(t, REG)
  srv.put('/libnpmpublish', body => {
    t.same(body, packument, 'posted packument matches expectations')
    return true
  }, {
    authorization: 'Bearer deadbeef',
  }).reply(201, {})

  const ret = await publish(manifest, tarData, {
    ...OPTS,
    token: 'deadbeef',
  })
  t.ok(ret, 'publish succeeded')
})

t.test('basic publish w/ provenance', async t => {
  // Data for mocking the OIDC token request
  const oidcURL = 'https://mock.oidc'
  const requestToken = 'decafbad'
  const oidcClaims = {
    iss: 'https://oauth2.sigstore.dev/auth',
    email: 'foo@bar.com',
  };
  const idToken = `.${Buffer.from(JSON.stringify(oidcClaims)).toString('base64')}.`;

  // Data for mocking Fulcio certifcate request
  const fulcioURL = 'https://mock.fulcio'
  const leafCertificate = `-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----\n`;
  const rootCertificate = `-----BEGIN CERTIFICATE-----\nxyz\n-----END CERTIFICATE-----\n`;
  const certificate = [leafCertificate, rootCertificate].join()

  // Data for mocking Rekor upload
  const rekorURL = 'https://mock.rekor'
  const signature = 'ABC123';
  const b64Cert = Buffer.from(leafCertificate).toString('base64');
  const uuid =
    '69e5a0c1663ee4452674a5c9d5050d866c2ee31e2faaf79913aea7cc27293cf6';

  const signatureBundle = {
    kind: 'hashedrekord',
    apiVersion: '0.0.1',
    spec: {
      signature: {
        content: signature,
        publicKey: { content: b64Cert },
      },
    },
  };

  const rekorEntry = {
    [uuid]: {
      body: Buffer.from(JSON.stringify(signatureBundle)).toString(
        'base64'
      ),
      integratedTime: 1654015743,
      logID:
        'c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d',
      logIndex: 2513258,
      verification: {
        signedEntryTimestamp:
          'MEUCIQD6CD7ZNLUipFoxzmSL/L8Ewic4SRkXN77UjfJZ7d/wAAIgatokSuX9Rg0iWxAgSfHMtcsagtDCQalU5IvXdQ+yLEA=',
      },
    },
  };

  // Set-up GHA environment variables
  process.env.CI = true
  process.env.GITHUB_ACTIONS = true
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = oidcURL
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken

  t.on('end', () => {
    delete process.env.CI
    delete process.env.GITHUB_ACTIONS
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  })

  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })
  const packument = {
    _id: 'libnpmpublish',
    name: 'libnpmpublish',
    description: 'some stuff',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        _id: 'libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        name: 'libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    access: 'public',
    _attachments: {
      'libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
      'libnpmpublish-1.0.0.sigstore': {
        content_type: 'application/vnd.dev.sigstore.bundle+json;version=0.1',
        data: /.*/, // Can't match against static valud as signature is always different
        length: 1870,
      }
    },
  }

  const oidcSrv = tnock(t, oidcURL)
  oidcSrv.get('/?audience=sigstore', undefined, { 
    authorization: `Bearer ${requestToken}`
  }).reply(200, { value: idToken });

  const fulcioSrv = tnock(t, fulcioURL)
  fulcioSrv.matchHeader('Accept', 'application/pem-certificate-chain')
    .matchHeader('Content-Type', 'application/json')
    .matchHeader('Authorization', `Bearer ${idToken}`)
    .post('/api/v1/signingCert', {
      publicKey: { content: /.+/i },
      signedEmailAddress: /.+/i,
    })
    .reply(200, certificate);

  const rekorSrv = tnock(t, rekorURL)
  rekorSrv
    .matchHeader('Accept', 'application/json')
    .matchHeader('Content-Type', 'application/json')
    .post('/api/v1/log/entries')
    .reply(201, rekorEntry);

  const srv = tnock(t, REG)
  srv.put('/libnpmpublish', body => {
    t.match(body, packument, 'posted packument matches expectations')
    return true
  }, {
    authorization: 'Bearer deadbeef',
  }).reply(201, {})

  const ret = await publish(manifest, tarData, {
    ...OPTS,
    token: 'deadbeef',
    provenance: true,
    fulcioBaseURL: fulcioURL,
    rekorBaseURL: rekorURL,
  })
  t.ok(ret, 'publish succeeded')
})

t.test('scoped publish - default access', async t => {
  const manifest = {
    name: '@claudiahdz/libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })
  const packument = {
    _id: '@claudiahdz/libnpmpublish',
    name: '@claudiahdz/libnpmpublish',
    description: 'some stuff',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        _id: '@claudiahdz/libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        _npmVersion: '6.13.7',
        name: '@claudiahdz/libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/@claudiahdz/libnpmpublish/'
            + '-/@claudiahdz/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    access: 'public',
    _attachments: {
      '@claudiahdz/libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  }

  const srv = tnock(t, REG)
  srv.put('/@claudiahdz%2flibnpmpublish', body => {
    t.same(body, packument, 'posted packument matches expectations')
    return true
  }, {
    authorization: 'Bearer deadbeef',
  }).reply(201, {})

  const ret = await publish(manifest, tarData, {
    ...OPTS,
    npmVersion: '6.13.7',
    token: 'deadbeef',
  })
  t.ok(ret, 'publish succeeded')
})

t.test('scoped publish - restricted access', async t => {
  const manifest = {
    name: '@claudiahdz/libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })
  const packument = {
    _id: '@claudiahdz/libnpmpublish',
    name: '@claudiahdz/libnpmpublish',
    description: 'some stuff',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        _id: '@claudiahdz/libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        _npmVersion: '6.13.7',
        name: '@claudiahdz/libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/@claudiahdz/libnpmpublish/'
            + '-/@claudiahdz/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    access: 'restricted',
    _attachments: {
      '@claudiahdz/libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  }

  const srv = tnock(t, REG)
  srv.put('/@claudiahdz%2flibnpmpublish', body => {
    t.same(body, packument, 'posted packument matches expectations')
    return true
  }, {
    authorization: 'Bearer deadbeef',
  }).reply(201, {})

  const ret = await publish(manifest, tarData, {
    ...OPTS,
    access: 'restricted',
    npmVersion: '6.13.7',
    token: 'deadbeef',
  })
  t.ok(ret, 'publish succeeded')
})

t.test('retry after a conflict', async t => {
  const REV = '72-47f2986bfd8e8b55068b204588bbf484'
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })

  const basePackument = {
    name: 'libnpmpublish',
    description: 'some stuff',
    access: 'public',
    _id: 'libnpmpublish',
    'dist-tags': {},
    versions: {},
    _attachments: {},
  }
  const currentPackument = cloneDeep({
    ...basePackument,
    time: {
      modified: new Date().toISOString(),
      created: new Date().toISOString(),
      '1.0.1': new Date().toISOString(),
    },
    'dist-tags': { latest: '1.0.1' },
    versions: {
      '1.0.1': {
        _id: 'libnpmpublish@1.0.1',
        _nodeVersion: process.versions.node,
        _npmVersion: '13.7.0',
        name: 'libnpmpublish',
        version: '1.0.1',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.1.tgz',
        },
      },
    },
    _attachments: {
      'libnpmpublish-1.0.1.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  })
  const newPackument = cloneDeep({
    ...basePackument,
    'dist-tags': { latest: '1.0.0' },
    versions: {
      '1.0.0': {
        _id: 'libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        _npmVersion: '6.13.7',
        name: 'libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    _attachments: {
      'libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  })
  const mergedPackument = cloneDeep({
    ...basePackument,
    time: currentPackument.time,
    'dist-tags': { latest: '1.0.0' },
    versions: { ...currentPackument.versions, ...newPackument.versions },
    _attachments: { ...currentPackument._attachments, ...newPackument._attachments },
  })

  const srv = tnock(t, REG)
  srv.put('/libnpmpublish', body => {
    t.notOk(body._rev, 'no _rev in initial post')
    t.same(body, newPackument, 'got conflicting packument')
    return true
  }).reply(409, { error: 'gimme _rev plz' })

  srv.get('/libnpmpublish?write=true').reply(200, {
    _rev: REV,
    ...currentPackument,
  })

  srv.put('/libnpmpublish', body => {
    t.same(body, {
      _rev: REV,
      ...mergedPackument,
    }, 'posted packument includes _rev and a merged version')
    return true
  }).reply(201, {})

  const ret = await publish(manifest, tarData, {
    ...OPTS,
    token: 'deadbeef',
    npmVersion: '6.13.7',
  })

  t.ok(ret, 'publish succeeded')
})

t.test('retry after a conflict -- no versions on remote', async t => {
  const REV = '72-47f2986bfd8e8b55068b204588bbf484'
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })

  const basePackument = {
    name: 'libnpmpublish',
    description: 'some stuff',
    access: 'public',
    _id: 'libnpmpublish',
  }
  const currentPackument = { ...basePackument }
  const newPackument = cloneDeep({
    ...basePackument,
    'dist-tags': { latest: '1.0.0' },
    versions: {
      '1.0.0': {
        _id: 'libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        _npmVersion: '6.13.7',
        name: 'libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    _attachments: {
      'libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  })
  const mergedPackument = cloneDeep({
    ...basePackument,
    'dist-tags': { latest: '1.0.0' },
    versions: { ...newPackument.versions },
    _attachments: { ...newPackument._attachments },
  })

  const srv = tnock(t, REG)
  srv.put('/libnpmpublish', body => {
    t.notOk(body._rev, 'no _rev in initial post')
    t.same(body, newPackument, 'got conflicting packument')
    return true
  }).reply(409, { error: 'gimme _rev plz' })

  srv.get('/libnpmpublish?write=true').reply(200, {
    _rev: REV,
    ...currentPackument,
  })

  srv.put('/libnpmpublish', body => {
    t.same(body, {
      _rev: REV,
      ...mergedPackument,
    }, 'posted packument includes _rev and a merged version')
    return true
  }).reply(201, {})

  const ret = await publish(manifest, tarData, {
    ...OPTS,
    npmVersion: '6.13.7',
    token: 'deadbeef',
  })

  t.ok(ret, 'publish succeeded')
})

t.test('version conflict', async t => {
  const REV = '72-47f2986bfd8e8b55068b204588bbf484'
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })
  const basePackument = {
    name: 'libnpmpublish',
    description: 'some stuff',
    access: 'public',
    _id: 'libnpmpublish',
    'dist-tags': {},
    versions: {},
    _attachments: {},
  }
  const newPackument = cloneDeep(Object.assign({}, basePackument, {
    'dist-tags': { latest: '1.0.0' },
    versions: {
      '1.0.0': {
        _id: 'libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        _npmVersion: '6.13.7',
        name: 'libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    _attachments: {
      'libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  }))

  const srv = tnock(t, REG)
  srv.put('/libnpmpublish', body => {
    t.notOk(body._rev, 'no _rev in initial post')
    t.same(body, newPackument, 'got conflicting packument')
    return true
  }).reply(409, { error: 'gimme _rev plz' })

  srv.get('/libnpmpublish?write=true').reply(200, {
    _rev: REV,
    ...newPackument,
  })

  try {
    await publish(manifest, tarData, {
      ...OPTS,
      npmVersion: '6.13.7',
      token: 'deadbeef',
    })
  } catch (err) {
    t.equal(err.code, 'EPUBLISHCONFLICT', 'got publish conflict code')
  }
})

t.test('refuse if package marked private', async t => {
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
    private: true,
  }

  try {
    await publish(manifest, Buffer.from(''), {
      ...OPTS,
      npmVersion: '6.9.0',
      token: 'deadbeef',
    })
  } catch (err) {
    t.equal(err.code, 'EPRIVATE', 'got correct error code')
  }
})

t.test('publish includes access', async t => {
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })
  const packument = {
    name: 'libnpmpublish',
    description: 'some stuff',
    access: 'public',
    _id: 'libnpmpublish',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        _id: 'libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        name: 'libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    _attachments: {
      'libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  }

  const srv = tnock(t, REG)
  srv.put('/libnpmpublish', body => {
    t.same(body, packument, 'posted packument matches expectations')
    return true
  }, {
    authorization: 'Bearer deadbeef',
  }).reply(201, {})

  const ret = await publish(manifest, tarData, {
    ...OPTS,
    token: 'deadbeef',
    access: 'public',
  })

  t.ok(ret, 'publish succeeded')
})

t.test('refuse if package is unscoped plus `restricted` access', async t => {
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  try {
    await publish(manifest, Buffer.from(''), {
      ...OPTS,
      npmVersion: '6.13.7',
      access: 'restricted',
    })
  } catch (err) {
    t.equal(err.code, 'EUNSCOPED', 'got correct error code')
  }
})

t.test('refuse if bad semver on manifest', async t => {
  const manifest = {
    name: 'libnpmpublish',
    version: 'lmao',
    description: 'some stuff',
  }

  try {
    await publish(manifest, Buffer.from(''), OPTS)
  } catch (err) {
    t.equal(err.code, 'EBADSEMVER', 'got correct error code')
  }
})

t.test('other error code', async t => {
  const manifest = {
    name: 'libnpmpublish',
    version: '1.0.0',
    description: 'some stuff',
  }

  const tarData = await pack(`file:${testDir}`, { ...OPTS })
  const shasum = crypto.createHash('sha1').update(tarData).digest('hex')
  const integrity = ssri.fromData(tarData, { algorithms: ['sha512'] })
  const packument = {
    name: 'libnpmpublish',
    description: 'some stuff',
    access: 'public',
    _id: 'libnpmpublish',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        _id: 'libnpmpublish@1.0.0',
        _nodeVersion: process.versions.node,
        _npmVersion: '6.13.7',
        name: 'libnpmpublish',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum,
          integrity: integrity.toString(),
          tarball: 'http://mock.reg/libnpmpublish/-/libnpmpublish-1.0.0.tgz',
        },
      },
    },
    _attachments: {
      'libnpmpublish-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: tarData.toString('base64'),
        length: tarData.length,
      },
    },
  }

  const srv = tnock(t, REG)
  srv.put('/libnpmpublish', body => {
    t.same(body, packument, 'posted packument matches expectations')
    return true
  }, {
    authorization: 'Bearer deadbeef',
  }).reply(500, { error: 'go away' })

  try {
    await publish(manifest, tarData, {
      ...OPTS,
      npmVersion: '6.13.7',
      token: 'deadbeef',
    })
  } catch (err) {
    t.match(err.message, /go away/, 'no retry on non-409')
  }
})
