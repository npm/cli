const t = require('tap')
const requireInject = require('require-inject')

// mock config
const {defaults} = require('../../lib/utils/config.js')
const config = { list: [defaults] }
const fs = require('fs')

t.test('should publish with libnpmpublish, respecting publishConfig', (t) => {
  const publishConfig = { registry: 'https://some.registry' }
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      publishConfig,
    }, null, 2),
  })

  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: true,
        defaultTag: 'latest',
      },
      config,
    },
    '../../lib/utils/tar.js': {
      getContents: () => ({
        id: 'someid',
      }),
      logTar: () => {},
    },
    '../../lib/utils/output.js': () => {},
    '../../lib/utils/otplease.js': (opts, fn) => {
      return Promise.resolve().then(() => fn(opts))
    },
    // verify that we do NOT remove publishConfig if it was there originally
    // and then removed during the script/pack process
    libnpmpack: async () => {
      fs.writeFileSync(`${testDir}/package.json`, JSON.stringify({
        name: 'my-cool-pkg',
        version: '1.0.0',
      }))
      return ''
    },
    libnpmpublish: {
      publish: (arg, manifest, opts) => {
        t.ok(arg, 'gets path')
        t.ok(manifest, 'gets manifest')
        t.ok(opts, 'gets opts object')
        t.same(opts.registry, publishConfig.registry, 'publishConfig is passed through')
        t.ok(true, 'libnpmpublish is called')
      },
    },
  })

  publish([testDir], (er) => {
    if (er)
      throw er
    t.end()
  })
})

t.test('re-loads publishConfig if added during script process', (t) => {
  const publishConfig = { registry: 'https://some.registry' }
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
    }, null, 2),
  })

  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: true,
        defaultTag: 'latest',
      },
      config,
    },
    '../../lib/utils/tar.js': {
      getContents: () => ({
        id: 'someid',
      }),
      logTar: () => {},
    },
    '../../lib/utils/output.js': () => {},
    '../../lib/utils/otplease.js': (opts, fn) => {
      return Promise.resolve().then(() => fn(opts))
    },
    libnpmpack: async () => {
      fs.writeFileSync(`${testDir}/package.json`, JSON.stringify({
        name: 'my-cool-pkg',
        version: '1.0.0',
        publishConfig,
      }))
      return ''
    },
    libnpmpublish: {
      publish: (arg, manifest, opts) => {
        t.ok(arg, 'gets path')
        t.ok(manifest, 'gets manifest')
        t.ok(opts, 'gets opts object')
        t.same(opts.registry, publishConfig.registry, 'publishConfig is passed through')
        t.ok(true, 'libnpmpublish is called')
      },
    },
  })

  publish([testDir], (er) => {
    if (er)
      throw er
    t.end()
  })
})

t.test('should not log if silent', (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
    }, null, 2),
  })

  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: 'latest',
        dryRun: true,
      },
      config,
    },
    '../../lib/utils/tar.js': {
      getContents: () => ({}),
      logTar: () => {},
    },
    '../../lib/utils/otplease.js': (opts, fn) => {
      return Promise.resolve().then(() => fn(opts))
    },
    npmlog: {
      verbose: () => {},
      level: 'silent',
    },
    libnpmpack: async () => '',
    libnpmpublish: {
      publish: () => {},
    },
  })

  publish([testDir], (er) => {
    if (er)
      throw er
    t.end()
  })
})

t.test('should log tarball contents', (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
    }, null, 2),
  })

  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: 'latest',
        dryRun: true,
      },
      config,
    },
    '../../lib/utils/tar.js': {
      getContents: () => ({
        id: 'someid',
      }),
      logTar: () => {
        t.ok(true, 'logTar is called')
      },
    },
    '../../lib/utils/output.js': () => {
      t.ok(true, 'output fn is called')
    },
    '../../lib/utils/otplease.js': (opts, fn) => {
      return Promise.resolve().then(() => fn(opts))
    },
    libnpmpack: async () => '',
    libnpmpublish: {
      publish: () => {},
    },
  })

  publish([testDir], (er) => {
    if (er)
      throw er
    t.end()
  })
})

t.test('shows usage with wrong set of arguments', (t) => {
  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: '0.0.13',
      },
      config,
    },
  })

  publish(['a', 'b', 'c'], (er) => {
    t.matchSnapshot(er, 'should print usage')
    t.end()
  })
})

t.test('throws when invalid tag', (t) => {
  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: '0.0.13',
      },
      config,
    },
  })

  publish([], (err) => {
    t.ok(err, 'throws when tag name is a valid SemVer range')
    t.end()
  })
})
