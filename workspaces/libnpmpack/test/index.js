'use strict'

const t = require('tap')
const fs = require('fs')
const path = require('path')
const pack = require('../lib/index.js')
const tnock = require('./fixtures/tnock.js')

const OPTS = {
  registry: 'https://mock.reg/',
}

const REG = OPTS.registry

t.test('packs from local directory', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
    }, null, 2),
  })

  const cwd = process.cwd()
  process.chdir(testDir)

  const tarball = await pack()
  t.ok(tarball)

  t.teardown(async () => {
    process.chdir(cwd)
  })
})

t.test('writes tarball to file when dryRun === false', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      scripts: {
        prepack: 'touch prepack',
        postpack: 'touch postpack',
      },
    }, null, 2),
  })

  const cwd = process.cwd()
  process.chdir(testDir)

  const tarball = await pack('file:.', {
    dryRun: false,
    packDestination: testDir,
    silent: true,
  })
  t.ok(tarball)
  const expectedTarball = path.join(testDir, 'my-cool-pkg-1.0.0.tgz')
  t.ok(fs.existsSync(expectedTarball), 'file was written')
  t.same(fs.readFileSync(expectedTarball), tarball, 'wrote same data that was returned')

  const prepackTimestamp = (await fs.promises.stat(path.join(testDir, 'prepack'))).mtime
  const tarballTimestamp = (await fs.promises.stat(expectedTarball)).mtime
  const postpackTimestamp = (await fs.promises.stat(path.join(testDir, 'postpack'))).mtime

  t.ok(prepackTimestamp < tarballTimestamp, 'prepack ran before tarball was written')
  t.ok(tarballTimestamp < postpackTimestamp, 'postpack ran after tarball was written')

  t.teardown(async () => {
    process.chdir(cwd)
  })
})

t.test('packs from local directory with silent', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
    }, null, 2),
  })

  const cwd = process.cwd()
  process.chdir(testDir)

  const tarball = await pack('file:', { silent: true })
  t.ok(tarball)

  t.teardown(async () => {
    process.chdir(cwd)
  })
})

t.test('packs from registry spec', async t => {
  const spec = 'my-cool-pkg'
  const packument = {
    _id: 'my-cool-pkg',
    name: 'my-cool-pkg',
    description: 'some stuff',
    'dist-tags': {
      latest: '1.0.0',
    },
    versions: {
      '1.0.0': {
        _id: 'my-cool-pkg@1.0.0',
        _nodeVersion: process.versions.node,
        name: 'my-cool-pkg',
        version: '1.0.0',
        description: 'some stuff',
        dist: {
          shasum: 'some-shasum',
          integrity: '123',
          tarball: 'https://mock.reg/my-cool-pkg/-/my-cool-pkg-1.0.0.tgz',
        },
      },
    },
    readme: '',
    access: 'public',
    _attachments: {
      'my-cool-pkg-1.0.0.tgz': {
        content_type: 'application/octet-stream',
        data: '',
        length: '0',
      },
    },
  }

  const srv = tnock(t, REG)
  srv.get('/my-cool-pkg').reply(200, packument)
  srv.get('/my-cool-pkg/-/my-cool-pkg-1.0.0.tgz').reply(200, '')

  const tarball = await pack(spec, { ...OPTS })
  t.ok(tarball)
})
