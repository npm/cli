const Shrinkwrap = require('../lib/shrinkwrap.js')
const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const calcDepFlags = require('../lib/calc-dep-flags.js')
const fs = require('node:fs')
const Arborist = require('../lib/arborist/index.js')

const t = require('tap')

const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')
t.cleanSnapshot = s => s.split(process.cwd()).join('{CWD}')

const { resolve } = require('node:path')
const fixture = resolve(__dirname, 'fixtures/install-types')
const swonlyFixture = resolve(__dirname, 'fixtures/install-types-sw-only')
const YarnLock = require('../lib/yarn-lock.js')
const yarnFixture = resolve(__dirname, 'fixtures/yarn-stuff')
const emptyFixture = resolve(__dirname, 'fixtures/empty')
const depTypesFixture = resolve(__dirname, 'fixtures/dev-deps')
const badJsonFixture = resolve(__dirname, 'fixtures/testing-peer-deps-bad-sw')
const hiddenLockfileFixture = resolve(__dirname, 'fixtures/hidden-lockfile')
const hidden = 'node_modules/.package-lock.json'
const saxFixture = resolve(__dirname, 'fixtures/sax')

// start out with the file being fresh
const later = Date.now() + 10000
fs.utimesSync(
  resolve(hiddenLockfileFixture, hidden),
  new Date(later),
  new Date(later)
)

t.test('shrinkwrap key order', async t => t.matchSnapshot(Shrinkwrap.keyOrder))

t.test('path defaults to .', async t => {
  const sw = new Shrinkwrap()
  t.equal(sw.path, process.cwd())
})

t.test('load and change lockfileVersion', async t => {
  const vDefault = await Shrinkwrap.load({ path: fixture })
  const v1 = await Shrinkwrap.load({ path: fixture, lockfileVersion: 1 })
  const v2 = await Shrinkwrap.load({ path: fixture, lockfileVersion: 2 })
  const v3 = await Shrinkwrap.load({ path: fixture, lockfileVersion: 3 })

  t.strictSame(vDefault, v3, 'default is same as version 3')
  const v1Data = await v1.commit()
  const v2Data = await v2.commit()
  const v3Data = await v3.commit()
  t.strictSame(v2Data, { ...v1Data, ...v3Data, lockfileVersion: 2 },
    'v2 is superset of v1 and v3')
  t.equal(v1Data.packages, undefined, 'v1 data does not have packages')
  t.equal(v3Data.dependencies, undefined, 'v3 data does not have dependencies')
})

t.test('load and then reset gets empty lockfile', async t => {
  const sw = await Shrinkwrap.load({ path: fixture })
  sw.reset()
  t.strictSame(sw.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(sw.loadedFromDisk, true)
  t.equal(sw.filename, resolve(fixture, 'package-lock.json'))
})

t.test('starting out with a reset lockfile is an empty lockfile', async t => {
  const sw = await Shrinkwrap.reset({ path: fixture })
  t.strictSame(sw.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(sw.originalLockfileVersion, 3)
  t.equal(sw.loadedFromDisk, true)
  t.equal(sw.filename, resolve(fixture, 'package-lock.json'))
})

t.test('reset in a bad dir gets an empty lockfile with no lockfile version', async t => {
  const nullLockDir = t.testdir({
    'package-lock.json': JSON.stringify(null),
  })

  const [swMissingLock, swNullLock] = await Promise.all([
    Shrinkwrap.reset({ path: 'path/which/does/not/exist' }),
    Shrinkwrap.reset({ path: nullLockDir }),
  ])

  t.strictSame(swMissingLock.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(swMissingLock.lockfileVersion, null)
  t.equal(swMissingLock.loadedFromDisk, false)

  t.strictSame(swNullLock.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(swNullLock.lockfileVersion, null)
  t.equal(swNullLock.loadedFromDisk, true)
})

t.test('loading in bad dir gets empty lockfile', async t => {
  const sw = await Shrinkwrap.load({ path: 'path/which/does/not/exist' })
  t.strictSame(sw.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(sw.loadedFromDisk, false)
})

t.test('failure to parse json gets empty lockfile', async t => {
  const sw = await Shrinkwrap.load({ path: badJsonFixture })
  t.strictSame(sw.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(sw.loadedFromDisk, false)
})

t.test('loading in empty dir gets empty lockfile', async t => {
  const sw = await Shrinkwrap.load({ path: emptyFixture })
  t.strictSame(sw.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(sw.loadedFromDisk, false)
  // update with an empty node, set name to node name, not package name
  const root = new Node({
    path: emptyFixture,
    realpath: emptyFixture,
  })
  root.peer = false
  root.dev = false
  root.devOptional = false
  root.optional = false
  root.extraneous = false
  sw.add(root)
  t.strictSame(sw.commit(), {
    name: 'empty',
    lockfileVersion: 3,
    requires: true,
    packages: {},
  })
})

t.test('look up from locks and such', async t => {
  const m = await new Shrinkwrap({ path: fixture }).load()
  t.strictSame(m.get(''), {
    name: 'a',
    version: '1.2.3',
    dependencies: {
      abbrev: '^1.1.1',
      'full-git-url': 'git+https://github.com/isaacs/abbrev-js.git',
      ghshort: 'github:isaacs/abbrev-js',
      old: 'npm:abbrev@^1.0.3',
      pinned: 'npm:abbrev@^1.1.1',
      reg: 'npm:abbrev@^1.1.1',
      remote: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz',
      symlink: 'file:./abbrev-link-target',
      tarball: 'file:abbrev-1.1.1.tgz',
      bundler: '1.2.3',
    },
  }, 'root metadata')
  t.match(m.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: Object,
    packages: Object,
  })
  t.equal(m.loadedFromDisk, true)
  t.matchSnapshot(m.get('node_modules/abbrev'), 'basic package')
  t.matchSnapshot(m.get(
    'node_modules/abbrev/node_modules/@scope/name/node_modules/@otherscope/othername', 'scoped package'))
  t.matchSnapshot(m.get('package/not/found'), 'not found')

  t.matchSnapshot(m.get('node_modules/old/node_modules/notfound'), 'fall off the dep tree')

  t.test('lockfile', t => {
    const p = m.data.packages
    m.data.packages = {}
    t.matchSnapshot(m.get('node_modules/abbrev'), 'basic pkg, from lock')
    t.matchSnapshot(m.data.packages, 'saved fetched metadata back to packages section')
    t.matchSnapshot(m.get(
      'node_modules/abbrev/node_modules/@scope/name/node_modules/@otherscope/othername', 'scoped package'))
    t.matchSnapshot(m.get('package/not/found'), 'not found')
    t.matchSnapshot(m.get('node_modules/full-git-url'), 'full git')
    t.matchSnapshot(m.get('node_modules/symlink'), 'symlink')
    t.matchSnapshot(m.get('node_modules/unhosted-git'), 'unhosted git')
    m.data.packages = p
    t.end()
  })
})

t.test('load a shrinkwrap with some dev and optional flags', t =>
  Shrinkwrap.load({ path: depTypesFixture }).then(m =>
    t.matchSnapshot(m.data, 'got expected dependency types')))

t.test('load a legacy shrinkwrap without a package.json', t =>
  Shrinkwrap.load({ path: swonlyFixture }).then(m =>
    t.matchSnapshot(m.data, 'did our best with what we had')))

t.test('throws when attempting to access data before loading', t => {
  t.throws(() =>
    new Shrinkwrap().get(), Error('run load() before getting or setting data'))
  t.throws(() =>
    new Shrinkwrap().delete(), Error('run load() before getting or setting data'))
  t.throws(() =>
    new Shrinkwrap().add(), Error('run load() before getting or setting data'))
  t.throws(() =>
    new Shrinkwrap().toJSON(), Error('run load() before getting or setting data'))
  t.throws(() =>
    new Shrinkwrap().toString(), Error('run load() before getting or setting data'))
  t.throws(() =>
    new Shrinkwrap().save(), Error('run load() before saving data'))
  t.end()
})

t.test('resolveOptions', async t => {
  const url = 'https://private.registry.org/deadbeef/registry/-/registry-1.2.3.tgz'
  const someOtherRegistry = 'https://someother.registry.org/registry/-/registry-1.2.3.tgz'
  const getData = async (resolveOptions) => {
    const dir = t.testdir()
    const meta = await Shrinkwrap.load({
      path: dir,
      resolveOptions,
      lockfileVersion: 2,
    })

    const root = new Node({
      pkg: {
        name: 'root',
        dependencies: {
          registry: '^1.0.0',
          'some-other-registry': '^1.0.0',
          '@scoped/some-other-registry': '^1.0.0',
          tar: url,
        },
      },
      path: dir,
      realpath: dir,
      meta,
    })

    const registry = new Node({
      pkg: { name: 'registry', version: '1.2.3' },
      resolved: url,
      integrity: 'sha512-registry',
      parent: root,
    })

    const otherRegistry = new Node({
      pkg: { name: 'some-other-registry', version: '1.2.3' },
      resolved: someOtherRegistry,
      integrity: 'sha512-registry',
      parent: root,
    })

    const scopedOtherRegistry = new Node({
      pkg: { name: '@scope/some-other-registry', version: '1.2.3' },
      resolved: someOtherRegistry,
      integrity: 'sha512-registry',
      parent: root,
    })

    const tar = new Node({
      pkg: { name: 'tar', version: '1.2.3' },
      resolved: url,
      integrity: 'sha512-registry',
      parent: root,
    })

    calcDepFlags(root)
    meta.add(root)
    return { data: meta.commit(), registry, tar, root, otherRegistry, scopedOtherRegistry }
  }

  await t.test('omitLockfileRegistryResolved', async t => {
    const { data } = await getData({ omitLockfileRegistryResolved: true })
    // registry dependencies in v2 packages and v1 dependencies should
    // have resolved stripped.
    t.strictSame(data.packages['node_modules/registry'].resolved, undefined)

    // tar should have resolved because it is not a registry dep.
    t.strictSame(data.packages['node_modules/tar'].resolved, url)
    // v1 url dependencies never have resolved.
    t.strictSame(data.dependencies.tar.resolved, undefined)
  })

  await t.test('omitLockfileRegistryResolved: false', async t => {
    const { data } = await getData({ omitLockfileRegistryResolved: false })
    t.strictSame(data.packages['node_modules/registry'].resolved, url)
    t.strictSame(data.dependencies.registry.resolved, url)

    t.strictSame(data.packages['node_modules/tar'].resolved, url)
    // v1 url dependencies never have resolved.
    t.strictSame(data.dependencies.tar.resolved, undefined)
  })

  t.test('metaFromNode default', async t => {
    // test to cover options default.
    const { registry } = await getData(undefined)
    t.strictSame(Shrinkwrap.metaFromNode(registry, '').resolved, url)
  })
})

t.test('construct metadata from node and package data', t => {
  const meta = new Shrinkwrap({ path: '/home/user/projects/root' })
  // fake load
  meta.data = {
    lockfileVersion: 2,
    requires: true,
    dependencies: {},
    packages: {},
  }

  const root = new Node({
    pkg: {
      name: 'root',
      dependencies: { a: '', link: '', link2: '', link3: '' },
      devDependencies: { d: '', e: 'https://foo.com/e.tgz', devit: '' },
      optionalDependencies: { optin: '' },
      peerDependencies: { peer: '' },
      scripts: {
        install: 'true',
      },
    },
    path: '/home/user/projects/root',
    realpath: '/home/user/projects/root',
    meta,
  })

  const peer = new Node({
    pkg: {
      name: 'peer',
      version: '1.2.3',
      dependencies: { peerdep: '' },
    },
    resolved: 'https://peer.com/peer.tgz',
    integrity: 'sha512-peerpeerpeer',
    parent: root,
  })

  const peerdep = new Node({
    pkg: {
      name: 'peerdep',
      version: '1.2.3',
    },
    resolved: 'https://peer.com/peerdep.tgz',
    integrity: 'sha512-peerdeppeerdep',
    parent: peer,
  })

  const e = new Node({
    pkg: {
      name: 'e',
      version: '1.2.3',
      dependencies: {
        tgz: '',
        'tgz-pkg-resolved': '',
      },
      // expect to get "license": "blurb" in the metadata, not an object
      license: {
        type: 'blurb',
        url: 'http://example.com/',
      },
    },
    resolved: 'https://foo.com/e.tgz',
    parent: root,
  })

  const tgz = new Node({
    pkg: {
      name: 'tgz',
      version: '1.2.3',
      funding: { url: 'https://example.com/' },
      engines: {
        node: '>=10',
      },
      os: ['any', '!win32'],
      cpu: ['x64'],
    },
    resolved: '/home/user/projects/root/archives/tarball.tgz',
    parent: root,
  })
  const tgzPkgResolved = new Node({
    pkg: {
      name: 'tgz-pkg-resolved',
      version: '1.2.3',
      funding: { url: 'https://example.com/' },
      _resolved: '/home/user/projects/root/archives/tarball-pkg-resolved.tgz',
      _integrity: 'sha512-tarball/package/resolved/integrity',
    },
    parent: root,
  })

  const link = new Link({
    path: '/home/user/projects/root/node_modules/link',
    realpath: '/home/user/projects/root/target',
    parent: root,
    pkg: {
      name: 'link',
      version: '1.2.3',
      funding: 'https://example.com/payme',
      _resolved: 'github:isaacs/foobarbaz#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
    target: new Node({
      realpath: '/home/user/projects/root/target',
      path: '/home/user/projects/root/target',
      root,
      pkg: {
        name: 'link',
        version: '1.2.3',
        funding: 'https://example.com/payme',
        _resolved: 'github:isaacs/foobarbaz#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    }),
  })
  // special case when link alias is the same as target package name
  const link3 = new Link({
    name: 'link3',
    path: '/home/user/projects/root/node_modules/link3',
    realpath: '/home/user/projects/root/realPkg',
    parent: root,
    pkg: {
      name: 'link3',
      version: '1.2.3',
      funding: 'https://example.com/payme',
      _resolved: 'github:isaacs/foobarbaz#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
    target: new Node({
      name: 'link3',
      realpath: '/home/user/projects/root/realPkg',
      path: '/home/user/projects/root/realPkg',
      root,
      pkg: {
        name: 'link3',
        version: '1.2.3',
        funding: 'https://example.com/payme',
        _resolved: 'github:isaacs/foobarbaz#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    }),
  })

  const a = new Node({
    resolved: 'https://example.com/a.tgz',
    integrity: 'sha512-helloyesthisisdog',
    pkg: {
      name: 'a',
      version: '1.2.3',
    },
    parent: root,
  })

  const optin = new Node({
    pkg: {
      name: 'optin',
      version: '1.2.3',
      dependencies: { devo: '' },
    },
    parent: root,
  })

  const devit = new Node({
    pkg: {
      name: 'devit',
      version: '1.2.3',
      dependencies: { devo: '' },
    },
    parent: root,
  })

  const devo = new Node({
    pkg: {
      name: 'devo',
      version: '1.2.3',
    },
    parent: root,
  })

  const d = new Node({
    pkg: {
      name: 'd',
      version: '1.2.3',
      _shasum: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      bundleDependencies: ['bundled'],
      dependencies: {
        e: '1.2.3',
        bundled: 'npm:not-bundled-tho@*',
        'git-dep': 'github:foo/bar',
      },
    },
    parent: root,
  })
  const bundled = new Node({
    pkg: {
      name: 'not-bundled-tho',
      version: '1.2.3',
    },
    path: d.path + '/node_modules/bundled',
    name: 'bundled',
    parent: d,
  })
  const git = new Node({
    pkg: {
      name: 'git-dep',
      version: '1.2.3',
    },
    parent: d,
    resolved: 'git+ssh://git@github.com/foo/bar.git#0000000000000000000000000000000000000000',
  })

  const nopkg = new Node({
    path: root.path + '/node_modules/nopkg',
    parent: root,
  })

  calcDepFlags(root)

  t.matchSnapshot(meta.get(''), 'root metadata, no package version')
  root.package.version = '1.2.3'
  meta.add(root)
  t.matchSnapshot(meta.get(''), 'root metadata, with package version')

  t.matchSnapshot(meta.get(optin.location), 'meta for optional dep')
  t.matchSnapshot(meta.get(devit.location), 'meta for dev dep')
  t.matchSnapshot(meta.get(devo.location), 'meta for devOptional dep')

  t.matchSnapshot(meta.get(tgz.location), 'metadata for tarball file pkg')
  t.matchSnapshot(meta.get(tgzPkgResolved.location),
    'metadata for tarball file pkg with _resolved value')
  t.matchSnapshot(meta.get(link.path), 'link metadata')
  t.matchSnapshot(meta.get(link.target.path), 'link target metadata')

  t.matchSnapshot(meta.get(link3.path), 'link metadata with same pkg name as link target')
  t.matchSnapshot(meta.get(link3.target.path), 'link target metadata with same pkg name as link target')

  t.matchSnapshot(meta.get(a.location), 'dep a metadata')
  t.matchSnapshot(meta.get(d.location), 'dep d metadata')
  t.matchSnapshot(meta.get(e.location), 'dep e metadata')
  t.matchSnapshot(meta.get(bundled.location), 'bundled pkg metadata')
  t.matchSnapshot(meta.get(git.location), 'git dep metadata')
  t.matchSnapshot(meta.get(nopkg.location), 'node without a package')
  t.matchSnapshot(meta.get(peer.location), 'a peer dep')
  t.matchSnapshot(meta.get(peerdep.location), 'a peer meta-dep')
  t.matchSnapshot(meta.commit(), 'data calculated from nodes themselves')
  t.end()
})

t.test('saving dependency-free shrinkwrap object', t => {
  const dir = t.testdir({
    'package.json': JSON.stringify({
      name: 'badsave',
      version: '1.0.0',
      description: 'no node_modules/ will fail',
    }),
  })

  t.test('save meta lockfile into node_modules directory', async t => {
    const sw = await Shrinkwrap.load({ path: dir, hiddenLockfile: true })
    t.equal(
      sw.filename,
      resolve(`${dir}/node_modules/.package-lock.json`),
      'correct filepath on shrinkwrap instance'
    )
    // save does not throw, but doens't write the file
    await sw.save()
    t.throws(() => fs.statSync(sw.filename))
  })

  t.test('if save fails, it does throw, if not a hidden lockfile', async t => {
    const sw = await Shrinkwrap.load({ path: dir, hiddenLockfile: false })
    sw.filename = dir + '/this/path/does/not/exist.json'
    await t.rejects(sw.save(), { code: 'ENOENT' })
    t.throws(() => fs.statSync(sw.filename))
  })

  t.test('save lockfile to root directory', async t => {
    const sw = await Shrinkwrap.load({ path: dir })
    t.equal(
      sw.filename,
      resolve(`${dir}/package-lock.json`),
      'correct filepath on shrinkwrap instance'
    )
    await sw.save({ format: false })
    fs.statSync(sw.filename)
    t.matchSnapshot(fs.readFileSync(sw.filename, 'utf8'), 'no indent json output')
  })

  t.test('load the unindented file, and generate expected contents', async t => {
    const sw = await Shrinkwrap.load({ path: dir })
    t.equal(
      sw.filename,
      resolve(`${dir}/package-lock.json`),
      'correct filepath on shrinkwrap instance'
    )
    t.equal(sw.indent, '')
    const json = await sw.toJSON()
    t.matchSnapshot(json, 'indented json object output')

    const jsonString = await sw.toString()
    t.matchSnapshot(jsonString, 'indented json string output')
  })

  t.test('load the unindented file, and save it back default', async t => {
    const sw = await Shrinkwrap.load({ path: dir })
    t.equal(
      sw.filename,
      resolve(`${dir}/package-lock.json`),
      'correct filepath on shrinkwrap instance'
    )
    t.equal(sw.indent, '')
    await sw.save()
    t.matchSnapshot(fs.readFileSync(sw.filename, 'utf8'), 'indented json output')
  })

  t.test('load file, and save it with a custom format', async t => {
    const sw = await Shrinkwrap.load({ path: dir })
    t.equal(
      sw.filename,
      resolve(`${dir}/package-lock.json`),
      'correct filepath on shrinkwrap instance'
    )
    await sw.save({ format: '\t' })
    t.matchSnapshot(fs.readFileSync(sw.filename, 'utf8'), 'custom indented json output')
  })

  t.end()
})

t.test('write the shrinkwrap back to disk', t => {
  const dir = t.testdir({})
  t.test('just read and write back', async t => {
    const s = await Shrinkwrap.load({ path: fixture, lockfileVersion: 1 })
    const fileData = require(s.filename)
    s.filename = dir + '/test-shrinkwrap.json'
    const shrinkwrapData = await s.commit()
    t.strictSame(shrinkwrapData, fileData, 'saved json matches data')
  })
  t.test('write back with pending changes', async t => {
    const s = await Shrinkwrap.load({ path: fixture, lockfileVersion: 2 })
    const dir = t.testdir({})
    s.filename = dir + '/test-shrinkwrap-with-changes.json'
    const node = new Node({
      path: fixture + '/node_modules/newthing',
      pkg: {
        name: 'newthing',
        version: '1.2.3',
      },
    })
    s.add(node)
    const preCommit = JSON.parse(JSON.stringify(s.data))
    const postCommit = s.commit()
    t.notSame(postCommit, preCommit, 'committing changes the data')
    // delete and re-add to put us back in the pre-commit state
    s.delete(node.location)
    s.add(node)
    await s.save()
    t.strictSame(s.data, postCommit, 'committed changes to data')
    t.strictSame(require(s.filename), s.data, 'saved json matches data')
  })
  t.end()
})

t.test('load shrinkwrap if no package-lock.json present', async t => {
  const dir = t.testdir({
    'npm-shrinkwrap.json': JSON.stringify({
      lockfileVersion: 1,
      name: 'foo',
      version: '1.2.3',
    }),
  })
  let s
  s = await Shrinkwrap.load({ path: dir, shrinkwrapOnly: true })
  t.equal(s.type, 'npm-shrinkwrap.json', 'loaded with swonly')
  s = await Shrinkwrap.reset({ path: dir, shrinkwrapOnly: true })
  t.equal(s.type, 'npm-shrinkwrap.json', 'loaded fresh')
  s = await Shrinkwrap.load({ path: dir })
  t.equal(s.type, 'npm-shrinkwrap.json', 'loaded without swonly')
  s = await Shrinkwrap.reset({ path: dir })
  t.equal(s.type, 'npm-shrinkwrap.json', 'loaded fresh without swonly')
})

t.test('load yarn.lock file if present', async t => {
  const s = await Shrinkwrap.load({ path: yarnFixture })
  t.type(s.yarnLock, YarnLock, 'loaded a yarn lock file')
  t.not(s.yarnLock.entries.size, 0, 'got some entries')
})

t.test('save yarn lock if loaded', async t => {
  const s = await Shrinkwrap.load({ path: yarnFixture })
  s.path = t.testdir()
  s.filename = s.path + '/package-lock.json'
  await s.save()
  const ss = await Shrinkwrap.load({ path: s.path })
  t.strictSame(s.yarnLock, ss.yarnLock)
})

t.test('ignore yarn lock file parse errors', async t => {
  const dir = t.testdir({
    'yarn.lock': 'this is not a yarn lock file!',
  })
  const s = await Shrinkwrap.load({ path: dir })
  t.type(s.yarnLock, YarnLock, 'got a yarn lock object because a yarn lock exists')
  t.equal(s.yarnLock.entries.size, 0, 'did not get any entries out of it')
})

t.test('load a resolution from yarn.lock if we dont have our own', async t => {
  const path = t.testdir({
    'yarn.lock': `
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1

mkdirp@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/mkdirp/-/mkdirp-1.0.2.tgz#5ccd93437619ca7050b538573fc918327eba98fb"
  integrity sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==

mcdork@^1.0.0:
  version "1.0.2"
  resolved "https://registry.npmjs.org/mcdork/-/mcdork-1.0.2.tgz#5ccd93437619ca7050b538573fc918327eba98fb"
  integrity sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==

otherreg@^1.0.0:
  version "1.0.2"
  resolved "https://otherreg.registry.npm/othrreg/-/othrreg-1.0.2.tgz#5ccd93437619ca7050b538573fc918327eba98fb"
  integrity sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==

brokenempty@^1.2.3:
  version "1.2.3"

regalias@xyz:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/mkdirp/-/mkdirp-1.0.2.tgz#5ccd93437619ca7050b538573fc918327eba98fb"
  integrity sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==
`,
    'package.json': JSON.stringify({
      dependencies: {
        mkdirp: '^1.0.2',
      },
    }),
  })
  const s = await Shrinkwrap.load({ path })
  {
    const opt = {}
    t.equal(s.checkYarnLock('mkdirp@^1.0.2', opt).raw, 'mkdirp@1.0.2')
    t.strictSame(opt, {
      resolved: 'https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.2.tgz',
      integrity: 'sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==',
    })
  }
  {
    const opt = {}
    t.equal(s.checkYarnLock('mcdork@^1.0.0', opt).raw, 'mcdork@1.0.2')
    t.strictSame(opt, {
      resolved: 'https://registry.npmjs.org/mcdork/-/mcdork-1.0.2.tgz',
      integrity: 'sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==',
    })
  }
  {
    const opt = {}
    t.equal(s.checkYarnLock('notfound@^1.0.0', opt).raw, 'notfound@^1.0.0')
    t.strictSame(opt, {})
  }
  {
    const opt = {}
    t.equal(s.checkYarnLock('otherreg@^1.0.0', opt).raw, 'otherreg@https://otherreg.registry.npm/othrreg/-/othrreg-1.0.2.tgz')
    t.strictSame(opt, {
      resolved: 'https://otherreg.registry.npm/othrreg/-/othrreg-1.0.2.tgz',
      integrity: 'sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==',
    })
  }
  {
    const opt = {}
    t.equal(s.checkYarnLock('brokenempty@^1.2.3', opt).raw, 'brokenempty@^1.2.3')
    t.strictSame(opt, {})
  }
  {
    const opt = {}
    t.equal(s.checkYarnLock('regalias@xyz', opt).raw, 'regalias@npm:mkdirp@1.0.2')
    t.strictSame(opt, {
      resolved: 'https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.2.tgz',
      integrity: 'sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==',
    })
  }

  t.equal(s.checkYarnLock('mkdirp').raw, 'mkdirp')

  {
    s.loadedFromDisk = true
    const opt = {}
    t.equal(s.checkYarnLock('regalias@xyz', opt).raw, 'regalias@xyz')
    t.strictSame(opt, {})
    s.loadedFromDisk = false
  }
  {
    const { yarnLock } = s
    s.yarnLock = null
    const opt = {}
    t.equal(s.checkYarnLock('regalias@xyz', opt).raw, 'regalias@xyz')
    t.strictSame(opt, {})
    s.yarnLock = yarnLock
  }
})

t.test('handle missing dependencies object without borking', t => {
  const s = new Shrinkwrap({ path: '/path/to/root' })
  s.data = {
    packages: {
      'node_modules/foo': {},
      'node_modules/foo/node_modules/bar': {},
    },
    dependencies: {
      foo: {
        resolved: 'http://foo.com',
        integrity: 'foo integrity',
        // no dependencies object here!
      },
    },
  }
  s.delete('/path/to/root/node_modules/foo/node_modules/bar')
  t.matchSnapshot(s.commit())
  t.end()
})

t.test('load a hidden lockfile', async t => {
  // ensure the hidden lockfile is newer than the contents
  // otherwise this can fail on a fresh checkout.
  fs.utimesSync(resolve(hiddenLockfileFixture, hidden), new Date(), new Date())
  const s = await Shrinkwrap.load({
    path: hiddenLockfileFixture,
    hiddenLockfile: true,
  })
  t.matchSnapshot(s.data)
  // make sure it does not add to the dependencies block when a new
  // node is added.
  s.data.dependencies = {}
  s.add(new Node({
    path: hiddenLockfileFixture + '/node_modules/foo',
    pkg: {
      name: 'foo',
      version: '1.2.3',
      _integrity: 'sha512-deadbeef',
      _resolved: 'https://registry.npmjs.org/foo/-/foo-1.2.3.tgz',
    },
  }))
  t.strictSame(s.data.dependencies, {}, 'did not add to legacy data')
  const data = s.commit()
  t.equal(data.packages[''], undefined, 'no root entry')
  t.equal(data.dependencies, undefined, 'deleted legacy metadata')
})

t.test('load a fresh hidden lockfile', async t => {
  const sw = await Shrinkwrap.reset({
    path: hiddenLockfileFixture,
    hiddenLockfile: true,
  })
  t.strictSame(sw.data, {
    lockfileVersion: 3,
    requires: true,
    dependencies: {},
    packages: {},
  })
  t.equal(sw.loadedFromDisk, true)
  t.equal(sw.filename, resolve(hiddenLockfileFixture, hidden))
})

t.test('hidden lockfile only used if up to date', async t => {
  const lockdata = require(resolve(hiddenLockfileFixture, hidden))
  const path = t.testdir({
    node_modules: {
      '.package-lock.json': JSON.stringify(lockdata),
      abbrev: {
        'package.json': JSON.stringify({ name: 'abbrev', version: '1.1.1' }),
      },
    },
    'package.json': JSON.stringify({ dependencies: { abbrev: '1.1.1' } }),
  })

  // ensure that the lockfile is fresh to start
  {
    const later = Date.now() + 10000
    fs.utimesSync(resolve(path, hidden), new Date(later), new Date(later))
    const s = await Shrinkwrap.load({ path, hiddenLockfile: true })
    t.equal(s.loadedFromDisk, true, 'loading from fresh lockfile')
  }

  // make the node_modules dir have a newer mtime by adding an entry
  // and setting the hidden lockfile back in time
  {
    fs.mkdirSync(resolve(path, 'node_modules/xyz'))
    const time = new Date('1999-12-31T23:59:59Z')
    fs.utimesSync(resolve(path, hidden), time, time)
    const s = await Shrinkwrap.load({ path, hiddenLockfile: true })
    t.equal(s.loadedFromDisk, false, 'did not load from disk, updated nm')
    t.equal(s.loadingError.message, 'out of date, updated: node_modules')
  }

  // make the lockfile newer, but that new entry is still a problem
  {
    const later = Date.now() + 10000
    fs.utimesSync(resolve(path, hidden), new Date(later), new Date(later))
    const s = await Shrinkwrap.load({ path, hiddenLockfile: true })
    t.equal(s.loadedFromDisk, false, 'did not load, new entry')
    t.equal(s.loadingError.message, 'missing from lockfile: node_modules/xyz')
  }

  // make the lockfile newer, but missing a folder from node_modules
  {
    fs.rmSync(resolve(path, 'node_modules/abbrev'), { recursive: true, force: true })
    fs.rmSync(resolve(path, 'node_modules/xyz'), { recursive: true, force: true })
    const later = Date.now() + 10000
    fs.utimesSync(resolve(path, hidden), new Date(later), new Date(later))
    const s = await Shrinkwrap.load({ path, hiddenLockfile: true })
    t.equal(s.loadedFromDisk, false, 'did not load, missing entry')
    t.equal(s.loadingError.message, 'missing from node_modules: node_modules/abbrev')
  }
})

t.test('hidden lockfile understands symlinks', async t => {
  const path = t.testdir({
    node_modules: {
      '.package-lock.json': JSON.stringify({
        name: 'hidden-lockfile-with-symlink',
        lockfileVersion: 2,
        requires: true,
        packages: {
          abbrev: {
            version: '1.1.1',
          },
          'node_modules/abbrev': {
            resolved: 'abbrev',
            link: true,
          },
        },
      }),
      abbrev: t.fixture('symlink', '../abbrev'),

      // a symlink missing a target is not relevant
      // windows cannot handle missing symlink targets, though
      ...(process.platform === 'win32' ? {} : {
        missing: t.fixture('symlink', '../missing'),
      }),
    },
    abbrev: {
      'package.json': JSON.stringify({
        name: 'abbrev',
        version: '1.1.1',
      }),
    },
    'package.json': JSON.stringify({
      dependencies: {
        abbrev: 'file:abbrev',
      },
    }),
  })

  // respect it if not newer, and the target included in shrinkwrap
  {
    const later = Date.now() + 10000
    fs.utimesSync(resolve(path, hidden), new Date(later), new Date(later))
    const s = await Shrinkwrap.load({ path, hiddenLockfile: true })
    t.equal(s.loadedFromDisk, true, 'loaded from disk')
    t.equal(s.filename, resolve(path, hidden))
  }

  // don't respect if the target is newer than hidden shrinkwrap
  {
    const later = Date.now() + 20000
    fs.utimesSync(resolve(path, 'abbrev/package.json'), new Date(later), new Date(later))
    fs.utimesSync(resolve(path, 'abbrev'), new Date(later), new Date(later))
    const s = await Shrinkwrap.load({ path, hiddenLockfile: true })
    t.equal(s.loadedFromDisk, false, 'not loaded from disk')
    t.equal(s.filename, resolve(path, hidden))
  }

  // don't respect it if the target is not in hidden shrinkwrap
  {
    fs.mkdirSync(resolve(path, 'missing'))
    fs.writeFileSync(resolve(path, 'missing/package.json'), JSON.stringify({
      name: 'missing',
      version: '1.2.3',
    }))
    if (process.platform === 'win32') {
      fs.symlinkSync(resolve(path, 'missing'), resolve(path, 'node_modules/missing'), 'junction')
    }
    // even though it's newer, the 'missing' is not found in the lock
    const later = Date.now() + 30000
    fs.utimesSync(resolve(path, hidden), new Date(later), new Date(later))

    const s = await Shrinkwrap.load({ path, hiddenLockfile: true })
    t.equal(s.loadedFromDisk, false, 'not loaded from disk')
    t.equal(s.filename, resolve(path, hidden))
  }
})

t.test('a yarn.lock entry with version mismatch', async t => {
  const path = t.testdir({
    'yarn.lock': `
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1

mkdirp@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/mkdirp/-/mkdirp-1.0.2.tgz#5ccd93437619ca7050b538573fc918327eba98fb"
  integrity sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA==
`,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { mkdirp: '^1.0.2' }, // spec matches
    }),
    node_modules: {
      mkdirp: {
        'package.json': JSON.stringify({
          name: 'mkdirp',
          version: '1.0.4', // version does not!
          _resolved: 'https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz',
        }),
      },
    },
  })

  const arb = new Arborist({ path })
  const tree = await arb.loadActual()
  tree.meta.commit()
  t.matchSnapshot(tree.meta.data, 'lockfile')
  t.matchSnapshot(tree.meta.yarnLock.toString(), 'yarn.lock')
})

t.test('a yarn.lock entry with integrity mismatch', async t => {
  const path = t.testdir({
    'yarn.lock': `
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1

mkdirp@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/mkdirp/-/mkdirp-1.0.2.tgz#5ccd93437619ca7050b538573fc918327eba98fb"
  integrity "sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA=="
`,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { mkdirp: '^1.0.2' }, // spec matches
    }),
    node_modules: {
      mkdirp: {
        'package.json': JSON.stringify({
          name: 'mkdirp',
          version: '1.0.2',
          _resolved: 'https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.2.tgz',
          // integrity mismatch
          _integrity: 'um, nope, not even close buddy',
        }),
      },
    },
  })

  const arb = new Arborist({ path })
  const tree = await arb.loadActual()
  tree.meta.commit()
  t.matchSnapshot(tree.meta.data, 'lockfile')
  t.matchSnapshot(tree.meta.yarnLock.toString(), 'yarn.lock')
})

t.test('a yarn.lock entry with no resolved', async t => {
  const path = t.testdir({
    'yarn.lock': `
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1

mkdirp@^1.0.2:
  version "1.0.2"
  integrity "sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA=="
`,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { mkdirp: '^1.0.2' }, // spec matches
    }),
    node_modules: {
      mkdirp: {
        'package.json': JSON.stringify({
          name: 'mkdirp',
          version: '1.0.2',
        }),
      },
    },
  })

  const arb = new Arborist({ path })
  const tree = await arb.loadActual()
  tree.meta.commit()
  t.matchSnapshot(tree.meta.data, 'lockfile')
  t.matchSnapshot(tree.meta.yarnLock.toString(), 'yarn.lock')
})

t.test('a yarn.lock entry with file: resolved', async t => {
  const path = t.testdir({
    'yarn.lock': `
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1

mkdirp@file:mkdirp:
  version "1.0.2"
  integrity "sha512-N2REVrJ/X/jGPfit2d7zea2J1pf7EAR5chIUcfHffAZ7gmlam5U65sAm76+o4ntQbSRdTjYf7qZz3chuHlwXEA=="
`,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { mkdirp: 'file:mkdirp' }, // spec matches
    }),
    mkdirp: {
      'package.json': JSON.stringify({
        name: 'mkdirp',
        version: '1.0.2',
      }),
    },
    node_modules: {
      mkdirp: t.fixture('symlink', '../mkdirp'),
    },
  })

  const arb = new Arborist({ path })
  const tree = await arb.loadActual()
  tree.meta.commit()
  t.matchSnapshot(tree.meta.data, 'lockfile')
  t.matchSnapshot(tree.meta.yarnLock.toString(), 'yarn.lock')
})

t.test('a yarn.lock entry with no integrity', async t => {
  const path = t.testdir({
    'yarn.lock': `
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1

mkdirp@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/mkdirp/-/mkdirp-1.0.2.tgz#5ccd93437619ca7050b538573fc918327eba98fb"
`,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { mkdirp: '^1.0.2' }, // spec matches
    }),
    node_modules: {
      mkdirp: {
        'package.json': JSON.stringify({
          name: 'mkdirp',
          version: '1.0.2',
        }),
      },
    },
  })

  const arb = new Arborist({ path })
  const tree = await arb.loadActual()
  tree.meta.commit()
  t.matchSnapshot(tree.meta.data, 'lockfile')
  t.matchSnapshot(tree.meta.yarnLock.toString(), 'yarn.lock')
})

t.test('a yarn.lock with no entries', async t => {
  const path = t.testdir({
    'yarn.lock': `
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1
`,
    'package.json': JSON.stringify({
      name: 'root',
      version: '1.0.0',
      dependencies: { mkdirp: '^1.0.2' }, // spec matches
    }),
    node_modules: {
      mkdirp: {
        'package.json': JSON.stringify({
          name: 'mkdirp',
          version: '1.0.4', // version does not!
          _resolved: 'https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz',
        }),
      },
    },
  })

  const arb = new Arborist({ path })
  const tree = await arb.loadActual()
  tree.meta.commit()
  t.matchSnapshot(tree.meta.data, 'lockfile')
  t.matchSnapshot(tree.meta.yarnLock.toString(), 'yarn.lock')
})

// basically just reproduce the loadActual and loadVirtual tests with
// a closer eye on the shrinkwrap results.
t.test('loadActual tests', t => {
  const {
    fixtures,
    roots,
  } = require('./fixtures/index.js')

  roots.push('tap-with-yarn-lock')

  for (const root of roots) {
    const path = resolve(fixtures, root)
    t.test(root, async t => {
      const tree = await new Arborist({ path }).loadActual()
      const shrinkwrap = tree.meta.commit()
      t.matchSnapshot(shrinkwrap, 'shrinkwrap data')
      if (tree.meta.yarnLock) {
        const yarnLock = tree.meta.yarnLock.toString()
        t.matchSnapshot(yarnLock, 'yarn.lock data')
      }
    })
  }
  t.end()
})

t.test('set integrity because location and resolved match', async t => {
  const s = new Shrinkwrap({ path: '/some/path' })
  s.reset()
  s.data = {
    packages: {
      '': {},
      'node_modules/foo': {
        resolved: 'https://registry.npmjs.org/foo/foo-1.2.3.tgz',
        version: '1.2.3',
        integrity: 'sha512-happyhappyjoyjoy',
      },
    },
  }
  const root = new Node({
    path: '/some/path',
    meta: s,
  })
  const foo = new Node({
    parent: root,
    name: 'foo',
    pkg: {
      version: '1.2.3',
      _resolved: 'https://registry.npmjs.org/foo/foo-1.2.3.tgz',
    },
  })
  t.equal(foo.integrity, 'sha512-happyhappyjoyjoy')
})

t.test('set integrity because location matches and no resolved', async t => {
  const s = new Shrinkwrap({ path: '/some/path' })
  s.reset()
  s.data = {
    packages: {
      '': {},
      'node_modules/foo': {
        resolved: 'https://registry.npmjs.org/foo/foo-1.2.3.tgz',
        version: '1.2.3',
        integrity: 'sha512-happyhappyjoyjoy',
      },
    },
  }
  const root = new Node({
    path: '/some/path',
    meta: s,
  })
  const foo = new Node({
    parent: root,
    name: 'foo',
    pkg: {
      version: '1.2.3',
    },
  })
  t.equal(foo.resolved, 'https://registry.npmjs.org/foo/foo-1.2.3.tgz')
  t.equal(foo.integrity, 'sha512-happyhappyjoyjoy')
})

t.test('set integrity but no resolved', async t => {
  const s = new Shrinkwrap({ path: '/some/path' })
  s.reset()
  s.data = {
    packages: {
      '': {},
      'node_modules/foo': {
        version: '1.2.3',
        integrity: 'sha512-happyhappyjoyjoy',
      },
    },
  }
  const root = new Node({
    path: '/some/path',
    meta: s,
  })
  const foo = new Node({
    parent: root,
    name: 'foo',
    pkg: {
      version: '1.2.3',
    },
  })
  t.equal(foo.resolved, null)
  t.equal(foo.integrity, 'sha512-happyhappyjoyjoy')
})

t.test('get meta from yarn.lock', t => {
  const fooEntry = {
    integrity: 'sha512-freebeerisworththeprice',
    resolved: 'https://example.com/foo.tgz',
    version: '1.2.3',
    optionalDependencies: {
      bar: '2.x',
    },
  }
  const foo2Entry = {
    integrity: 'the second coming of fooo',
    resolved: 'https://example.com/foo-2.tgz',
    version: '2.3.4',
  }
  const barEntry = {
    integrity: 'sha512-integrity is allegiance to your truest self',
    resolved: 'file:bar-2.3.4.tgz',
    version: '2.3.4',
  }
  const yarnLock = {
    entries: new Map([
      ['foo@1.x', fooEntry],
      ['foo@1.2.x', fooEntry],
      ['bar@2.x', barEntry],
      ['foo@2.x', foo2Entry],
    ]),
  }

  const root = '/path/to/root'
  const meta = new Shrinkwrap({ path: root })
  meta.data = {
    lockfileVersion: 2,
    packages: {},
    dependencies: {},
    requires: true,
  }
  meta.yarnLock = yarnLock

  const tree = new Node({
    meta,
    path: root,
    realpath: root,
    pkg: {
      name: 'root',
      version: '4.5.6',
      dependencies: {
        foo: '1.x',
      },
      devDependencies: {
        bar: '2.x',
      },
    },
  })

  const foo = new Node({
    name: 'foo',
    parent: tree,
    pkg: {
      name: 'foo',
      version: '1.2.3',
      optionalDependencies: { bar: '2.x' },
    },
  })

  t.equal(foo.integrity, fooEntry.integrity, 'foo integrity from yarn.lock')
  t.equal(foo.resolved, fooEntry.resolved, 'foo resolved from yarn.lock')

  const bar = new Node({
    name: 'bar',
    parent: tree,
    pkg: {
      name: 'bar',
      version: '2.3.4',
    },
  })
  t.equal(bar.integrity, barEntry.integrity, 'bar integrity from yarn.lock')
  t.equal(normalizePath(bar.resolved), 'file:/path/to/root/bar-2.3.4.tgz', 'bar resolved from yarn.lock')

  bar.parent = null

  const barDiffVersion = new Node({
    name: 'bar',
    parent: tree,
    pkg: {
      name: 'bar',
      description: 'witaf',
      version: '2.4.5',
    },
  })

  t.equal(barDiffVersion.integrity, null, 'version mismatch, no integrity')
  t.equal(barDiffVersion.resolved, null, 'version mismatch, no resolved')

  const barDiffIntegrity = new Node({
    integrity: 'sha512-a fundamental lack of commitment to ideals',
    name: 'bar',
    parent: tree,
    pkg: {
      name: 'bar',
      version: '2.3.4',
    },
  })
  t.equal(barDiffIntegrity.integrity,
    'sha512-a fundamental lack of commitment to ideals',
    'integrity not updated from yarn lock')
  t.equal(barDiffIntegrity.resolved, null, 'integrity mismatch, no resolved')

  const barDiffResolved = new Node({
    resolved: 'https://x.com/b.tgz',
    name: 'bar',
    parent: tree,
    pkg: {
      name: 'bar',
      version: '2.3.4',
    },
  })
  t.equal(barDiffResolved.integrity, null, 'integrity not updated from yarn lock')
  t.equal(barDiffResolved.resolved, 'https://x.com/b.tgz',
    'resolved was not updated from yarn lock')

  const barSameIntegrity = new Node({
    integrity: barEntry.integrity,
    name: 'bar',
    parent: tree,
    pkg: {
      name: 'bar',
      version: '2.3.4',
    },
  })
  t.equal(barSameIntegrity.integrity, barEntry.integrity, 'bar integrity still matches')
  t.equal(normalizePath(barSameIntegrity.resolved), 'file:/path/to/root/bar-2.3.4.tgz', 'bar resolved from yarn.lock')

  const barSameResolved = new Node({
    resolved: 'file:/path/to/root/bar-2.3.4.tgz',
    name: 'bar',
    parent: tree,
    pkg: {
      name: 'bar',
      version: '2.3.4',
    },
  })
  t.equal(barSameResolved.integrity, barEntry.integrity, 'bar integrity from yarn.lock')
  t.equal(barSameResolved.resolved, 'file:/path/to/root/bar-2.3.4.tgz', 'bar resolved still matches')

  // test that we sometimes might not get the resolved/integrity values
  barEntry.resolved = barEntry.integrity = null
  bar.package.description = 'new integrity, no resolved'
  bar.integrity = 'new integrity'
  bar.resolved = null
  bar.parent = tree
  t.equal(bar.integrity, 'new integrity', 'integrity unchanged by yarn lock')
  t.equal(bar.resolved, null, 'resolved set to null, not in yarn entry')

  bar.package.description = 'new resolved, no integrity'
  bar.parent = null
  bar.integrity = null
  bar.resolved = 'new resolved'
  bar.parent = tree
  t.equal(bar.integrity, null, 'integrity set to null, not in yarn entry')
  t.equal(bar.resolved, 'new resolved', 'resolved unchanged by yarn lock')

  const foo2 = new Node({
    name: 'foo',
    package: {
      name: 'foo',
      version: '2.3.4',
    },
    parent: tree,
  })
  t.equal(foo2.integrity, null, 'no integrity, entry invalid')
  t.equal(foo2.resolved, null, 'no resolved, entry invalid')

  t.end()
})

t.test('metadata that only has one of resolved/integrity', t => {
  const root = '/path/to/root'
  const meta = new Shrinkwrap({ path: root })
  meta.data = {
    name: 'root',
    version: '4.5.6',
    lockfileVersion: 2,
    packages: {
      'node_modules/integrity': {
        integrity: 'has integrity no resolved',
      },
      'node_modules/resolved': {
        resolved: 'file:has-resolved-no-integrity.tgz',
      },
      'node_modules/intalready': {
        integrity: 'superceded by node integrity value',
      },
      'node_modules/resalready': {
        resolved: 'superceded by node resolved value',
      },
    },
    dependencies: {},
  }

  const tree = new Node({
    path: root,
    realpath: root,
    meta,
  })
  const integrity = new Node({
    name: 'integrity',
    parent: tree,
  })
  const resolved = new Node({
    name: 'resolved',
    parent: tree,
  })
  const intalready = new Node({
    name: 'intalready',
    parent: tree,
    integrity: 'pre-existing integrity',
  })
  const resalready = new Node({
    name: 'resalready',
    parent: tree,
    resolved: 'pre-existing resolved',
  })

  t.equal(integrity.integrity, 'has integrity no resolved', 'integrity only')
  t.equal(integrity.resolved, null, 'integrity only')

  t.equal(normalizePath(resolved.resolved), 'file:/path/to/root/has-resolved-no-integrity.tgz',
    'resolved only')
  t.equal(resolved.integrity, null, 'resolved only')

  t.equal(intalready.resolved, null, 'integrity only, from node settings')
  t.equal(intalready.integrity, 'pre-existing integrity', 'integrity only, from node settings')

  t.equal(resalready.resolved, 'pre-existing resolved', 'resolved only, from node settings')
  t.equal(resalready.integrity, null, 'resolved only, from node settings')

  t.end()
})

t.test('load an ancient lockfile', async t =>
  t.match(await Shrinkwrap.load({ path: saxFixture }), {
    ancientLockfile: true,
  }))

t.test('shrinkwrap where root is a link node', async t => {
  const meta = await Shrinkwrap.reset({ path: '/actual/project/path' })
  const root = new Link({
    path: '/some/link/path',
    realpath: '/actual/project/path',
    meta,
  })

  new Node({
    root,
    path: '/actual/project/path',
    pkg: {
      name: 'path',
      version: '1.2.3',
      dependencies: { kid: '' },
    },
    children: [
      { pkg: { name: 'kid', version: '1.2.3' } },
    ],
  })

  t.strictSame(root.meta.commit(), {
    lockfileVersion: 3,
    requires: true,
    packages: {
      '': {
        version: '1.2.3',
        dependencies: {
          kid: '',
        },
        extraneous: true,
      },
      'node_modules/kid': {
        version: '1.2.3',
        extraneous: true,
      },
    },
    name: 'path',
    version: '1.2.3',
    extraneous: true,
  })
})

t.test('prioritize npm-shrinkwrap.json over package-lock.json', async t => {
  const path = t.testdir({
    'npm-shrinkwrap.json': '{}',
    'package-lock.json': '{}',
    'package.json': '{}',
  })
  const sw = await Shrinkwrap.load({ path })
  t.equal(sw.type, 'npm-shrinkwrap.json')
})

t.test('do not add metadata if versions mismatch', async t => {
  const meta = new Shrinkwrap({ path: '/home/user/projects/root' })
  // fake load
  meta.data = {
    lockfileVersion: 2,
    requires: true,
    dependencies: {},
    packages: {},
  }

  const root = new Node({
    path: '/home/usr/projects/root',
    meta,
    pkg: {
      name: 'root',
      version: '1.2.3',
      dependencies: {
        foo: '1',
      },
    },
    children: [
      {
        name: 'foo',
        pkg: {
          name: 'foo',
          version: '1.0.0',
        },
        resolved: 'https://registry.npmjs.org/foo-1.0.0.tgz',
        integrity: 'sha512-this is no sha of mine',
      },
    ],
  })
  const oldFoo = root.children.get('foo')
  const newFoo = new Node({
    path: oldFoo.path,
    root,
    pkg: {
      name: 'foo',
      version: '1.2.3',
    },
  })
  t.equal(newFoo.resolved, null)
  t.equal(newFoo.integrity, null)
})

t.test('setting lockfileVersion from the file contents', async t => {
  const path = t.testdir({
    v1: {
      'package-lock.json': JSON.stringify({ lockfileVersion: 1 }),
    },
    v2: {
      'package-lock.json': JSON.stringify({ lockfileVersion: 2 }),
    },
    v3: {
      'package-lock.json': JSON.stringify({ lockfileVersion: 3 }),
    },
  })

  const loadAndReset = (options) => Promise.all([
    Shrinkwrap.load(options).then((s) => s.lockfileVersion),
    Shrinkwrap.reset(options).then((s) => s.lockfileVersion),
  ])

  t.test('default setting', async t => {
    const s1 = await loadAndReset({ path: `${path}/v1` })
    t.strictSame(s1, [3, null], 'will upgrade old lockfile')
    const s2 = await loadAndReset({ path: `${path}/v2` })
    t.strictSame(s2, [2, null], 'will keep v2 as v2')
    const s3 = await loadAndReset({ path: `${path}/v3` })
    t.strictSame(s3, [3, null], 'load will keep v3 as v3')
  })
  t.test('v1', async t => {
    const s1 = await loadAndReset({ path: `${path}/v1`, lockfileVersion: 1 })
    t.strictSame(s1, [1, 1], 'keep explicit v1 setting')
    const s2 = await loadAndReset({ path: `${path}/v2`, lockfileVersion: 1 })
    t.strictSame(s2, [1, 1], 'downgrade explicitly')
    const s3 = await loadAndReset({ path: `${path}/v3`, lockfileVersion: 1 })
    t.strictSame(s3, [1, 1], 'downgrade explicitly')
  })
  t.test('v2', async t => {
    const s1 = await loadAndReset({ path: `${path}/v1`, lockfileVersion: 2 })
    t.strictSame(s1, [2, 2], 'upgrade explicitly')
    const s2 = await loadAndReset({ path: `${path}/v2`, lockfileVersion: 2 })
    t.strictSame(s2, [2, 2], 'keep v2 setting')
    const s3 = await loadAndReset({ path: `${path}/v3`, lockfileVersion: 2 })
    t.strictSame(s3, [2, 2], 'downgrade explicitly')
  })
  t.test('v3', async t => {
    const s1 = await loadAndReset({ path: `${path}/v1`, lockfileVersion: 3 })
    t.strictSame(s1, [3, 3], 'upgrade explicitly')
    const s2 = await loadAndReset({ path: `${path}/v2`, lockfileVersion: 3 })
    t.strictSame(s2, [3, 3], 'upgrade explicitly')
    const s3 = await loadAndReset({ path: `${path}/v3`, lockfileVersion: 3 })
    t.strictSame(s3, [3, 3], 'keep v3 setting')
  })

  t.equal(Shrinkwrap.defaultLockfileVersion, 3, 'default is 3')

  t.test('load should return error correctly when it cant access folder',
    { skip: process.platform === 'win32' ? 'skip chmod in windows' : false },
    async t => {
      const dir = t.testdir({})
      try {
        fs.chmodSync(dir, '000')
        const res = await Shrinkwrap.load({ path: dir })
        t.ok(res.loadingError, 'loading error should exist')
        t.strictSame(res.loadingError.errno, -13)
        t.strictSame(res.loadingError.code, 'EACCES')
      } finally {
        fs.chmodSync(dir, '666')
      }
    })
})
