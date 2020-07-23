const { test, cleanSnapshot } = require('tap')
const requireInject = require('require-inject')

test('should publish with libnpmpublish', (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0'
    }, null, 2)
  })

  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: true,
        defaultTag: 'latest',
      }
    },
    '../../lib/utils/tar.js': {
      'getContents': () => ({
        id: 'someid'
      }),
      'logTar': () => {} 
    },
    '../../lib/utils/output.js': () => {},
    '../../lib/utils/otplease.js': (opts, fn) => {
      return Promise.resolve().then(() => fn(opts))
    },
    'libnpmpack': () => '',
    'libnpmpublish': {
      publish: (arg, manifest, opts) => {
        t.ok(arg, 'gets path')
        t.ok(manifest, 'gets manifest')
        t.ok(opts, 'gets opts object')
        t.ok(true, 'libnpmpublish is called')
      }
    },
  })

  publish([testDir], () => {
    t.end()
  })
})

test('should not log if silent', (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0'
    }, null, 2)
  })

  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: 'latest',
        dryRun: true
      }
    },
    '../../lib/utils/tar.js': {
      'getContents': () => ({}),
      'logTar': () => {} 
    },
    '../../lib/utils/otplease.js': (opts, fn) => {
      return Promise.resolve().then(() => fn(opts))
    }, 
    'npmlog': {
      'verbose': () => {},
      'level': 'silent'
    },
    'libnpmpack': () => '',
    'libnpmpublish': {
      publish: () => {}
    },
  })

  publish([testDir], () => {
    t.end()
  })
})

test('should log tarball contents', (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0'
    }, null, 2)
  })

  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: 'latest',
        dryRun: true
      }
    },
    '../../lib/utils/tar.js': {
      'getContents': () => ({
        id: 'someid'
      }),
      'logTar': () => {
        t.ok(true, 'logTar is called')
      } 
    },
    '../../lib/utils/output.js': () => {
      t.ok(true, 'output fn is called')
    },
    '../../lib/utils/otplease.js': (opts, fn) => {
      return Promise.resolve().then(() => fn(opts))
    },
    'libnpmpack': () => '',
    'libnpmpublish': {
      publish: () => {}
    },
  })

  publish([testDir], () => {
    t.end()
  })
})

test('shows usage with wrong set of arguments', async (t) => {
  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: '0.0.13'
      }
    }
  })

  const printUsage = async () => {
    let usage
    await publish(['a', 'b', 'c'], (str) => {
      if (str) usage = str
    })
    return usage
  }
  const info = await printUsage()

  t.matchSnapshot(info)
})

test('throws when invalid tag', (t) => {
  const publish = requireInject('../../lib/publish.js', {
    '../../lib/npm.js': {
      flatOptions: {
        json: false,
        defaultTag: '0.0.13'
      }
    }
  })

  publish([], (err) => {
    t.ok(err, 'throws when tag name is a valid SemVer range')  
    t.end()
  })
})
