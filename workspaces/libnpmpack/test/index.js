'use strict'

const t = require('tap')

const tspawk = require('./fixtures/tspawk.js')
const spawk = tspawk(t)

const fs = require('node:fs')
const path = require('node:path')
const { resolve } = require('node:path')
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

t.test('flattens path separators in name so tarball stays in packDestination', async t => {
  const testDir = t.testdir({
    src: {
      'package.json': JSON.stringify({
        name: 'x/../../../../../../escaped',
        version: '1.0.0',
      }, null, 2),
    },
    dest: {},
  })

  const dest = path.join(testDir, 'dest')
  await pack(`file:${path.join(testDir, 'src')}`, {
    dryRun: false,
    packDestination: dest,
    silent: true,
  })

  const written = fs.readdirSync(dest)
  t.same(written, ['x-..-..-..-..-..-..-escaped-1.0.0.tgz'], 'separators flattened to a single filename')
  t.notOk(fs.existsSync(path.join(testDir, 'escaped-1.0.0.tgz')), 'nothing escaped the destination')
})

t.test('writes tarball to file when dryRun === false', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      scripts: {
        prepack: 'touch prepack && sleep 1',
        postpack: 'sleep 1 && touch postpack',
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

t.test('packs from git spec', async t => {
  const spec = 'test/test#111111aaaaaaaabbbbbbbbccccccdddddddeeeee'
  const pkgPath = resolve(__dirname, 'fixtures/git-test.tgz')

  const srv = tnock(t, 'https://codeload.github.com')
  srv.get('/test/test/tar.gz/111111aaaaaaaabbbbbbbbccccccdddddddeeeee')
    .times(2)
    .reply(200, fs.readFileSync(pkgPath))

  const tarball = await pack(spec, { ...OPTS })
  t.ok(tarball)
})

t.test('runs scripts in foreground when foregroundScripts === true', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      scripts: {
        prepack: 'touch prepack',
      },
    }, null, 2),
  })

  const cwd = process.cwd()
  process.chdir(testDir)

  const shell = process.platform === 'win32'
    ? process.env.COMSPEC
    : 'sh'

  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', 'touch prepack']
    : ['-c', 'touch prepack']

  const prepack = spawk.spawn(shell, args)

  await pack('file:.', {
    packDestination: testDir,
    foregroundScripts: true,
  })

  t.ok(prepack.called)

  t.teardown(async () => {
    process.chdir(cwd)
  })
})

t.test('doesn\'t run scripts when ignoreScripts === true', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      scripts: {
        prepack: 'touch prepack',
      },
    }, null, 2),
  })

  const cwd = process.cwd()
  process.chdir(testDir)

  const prepack = spawk.spawn('sh', ['-c', 'touch prepack'])

  await pack('file:.', {
    packDestination: testDir,
    foregroundScripts: true,
    ignoreScripts: true,
  })

  t.ok(!prepack.called)

  t.teardown(async () => {
    process.chdir(cwd)
    spawk.clean()
  })
})

t.test('refuses to pack when overrides affect a bundled package', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      bundledDependencies: ['foo'],
      dependencies: { foo: '1.0.0' },
      overrides: { bar: '2.0.0' },
    }, null, 2),
    node_modules: {
      foo: {
        'package.json': JSON.stringify({
          name: 'foo',
          version: '1.0.0',
          dependencies: { bar: '^1.0.0' },
        }),
        node_modules: {
          bar: {
            'package.json': JSON.stringify({ name: 'bar', version: '2.0.0' }),
          },
        },
      },
    },
  })

  const cwd = process.cwd()
  process.chdir(testDir)
  t.teardown(() => process.chdir(cwd))

  await t.rejects(
    pack('file:.'),
    {
      code: 'EBUNDLEOVERRIDE',
      packages: ['bar'],
      message: /affects a bundled package \(bar\)/,
    },
    'throws EBUNDLEOVERRIDE listing the offending bundled package'
  )
})

t.test('lists all offenders when multiple bundled packages are overridden', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      bundledDependencies: ['foo'],
      dependencies: { foo: '1.0.0' },
      overrides: { bar: '2.0.0', baz: '3.0.0' },
    }, null, 2),
    node_modules: {
      foo: {
        'package.json': JSON.stringify({
          name: 'foo',
          version: '1.0.0',
          dependencies: { bar: '^1.0.0', baz: '^1.0.0' },
        }),
        node_modules: {
          bar: {
            'package.json': JSON.stringify({ name: 'bar', version: '2.0.0' }),
          },
          baz: {
            'package.json': JSON.stringify({ name: 'baz', version: '3.0.0' }),
          },
        },
      },
    },
  })

  const cwd = process.cwd()
  process.chdir(testDir)
  t.teardown(() => process.chdir(cwd))

  await t.rejects(
    pack('file:.'),
    {
      code: 'EBUNDLEOVERRIDE',
      packages: ['bar', 'baz'],
      message: /affect bundled packages \(bar, baz\)/,
    },
    'lists every overridden bundled package and uses plural wording'
  )
})

t.test('refuses to pack with bundleDependencies (alt spelling) + affected override', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      bundleDependencies: ['foo'],
      dependencies: { foo: '1.0.0' },
      overrides: { bar: '2.0.0' },
    }, null, 2),
    node_modules: {
      foo: {
        'package.json': JSON.stringify({
          name: 'foo',
          version: '1.0.0',
          dependencies: { bar: '^1.0.0' },
        }),
        node_modules: {
          bar: {
            'package.json': JSON.stringify({ name: 'bar', version: '2.0.0' }),
          },
        },
      },
    },
  })

  const cwd = process.cwd()
  process.chdir(testDir)
  t.teardown(() => process.chdir(cwd))

  await t.rejects(
    pack('file:.'),
    { code: 'EBUNDLEOVERRIDE' },
    'throws EBUNDLEOVERRIDE with alternate bundleDependencies spelling'
  )
})

t.test('packs when overrides target only a dev dependency (not bundled)', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      bundledDependencies: ['keep'],
      dependencies: { keep: '1.0.0' },
      devDependencies: { dev: '1.0.0' },
      overrides: { transdev: '2.0.0' },
    }, null, 2),
    node_modules: {
      keep: {
        'package.json': JSON.stringify({ name: 'keep', version: '1.0.0' }),
      },
      dev: {
        'package.json': JSON.stringify({
          name: 'dev',
          version: '1.0.0',
          dependencies: { transdev: '^1.0.0' },
        }),
        node_modules: {
          transdev: {
            'package.json': JSON.stringify({ name: 'transdev', version: '2.0.0' }),
          },
        },
      },
    },
  })

  const cwd = process.cwd()
  process.chdir(testDir)
  t.teardown(() => process.chdir(cwd))

  const tarball = await pack('file:.')
  t.ok(tarball, 'pack succeeds — overridden dev-only transitive dep is not in the bundle')
})

t.test('packs when overrides target a package outside the bundled subtree', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      bundledDependencies: ['foo'],
      dependencies: { foo: '1.0.0', qux: '^1.0.0' },
      overrides: { baz: '2.0.0' },
    }, null, 2),
    node_modules: {
      foo: {
        'package.json': JSON.stringify({ name: 'foo', version: '1.0.0' }),
      },
      qux: {
        'package.json': JSON.stringify({
          name: 'qux',
          version: '1.0.0',
          dependencies: { baz: '^1.0.0' },
        }),
        node_modules: {
          baz: {
            'package.json': JSON.stringify({ name: 'baz', version: '2.0.0' }),
          },
        },
      },
    },
  })

  const cwd = process.cwd()
  process.chdir(testDir)
  t.teardown(() => process.chdir(cwd))

  const tarball = await pack('file:.')
  t.ok(tarball, 'pack succeeds — overridden package is not bundled')
})

t.test('packs with only bundledDependencies (no overrides)', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      bundledDependencies: [],
    }, null, 2),
  })

  const cwd = process.cwd()
  process.chdir(testDir)
  t.teardown(() => process.chdir(cwd))

  const tarball = await pack('file:.')
  t.ok(tarball)
})

t.test('packs with only overrides (no bundled)', async t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      overrides: { 'lru-cache': '6.0.0' },
    }, null, 2),
  })

  const cwd = process.cwd()
  process.chdir(testDir)
  t.teardown(() => process.chdir(cwd))

  const tarball = await pack('file:.')
  t.ok(tarball)
})
