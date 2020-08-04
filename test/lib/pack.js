const { test } = require('tap')
const requireInject = require('require-inject')

test('should pack current directory with no arguments', (t) => {
  const pack = requireInject('../../lib/pack.js', {
    '../../lib/npm.js': {
      flatOptions: {
        unicode: false,
        json: false,
        dryRun: false
      }
    },
    'libnpmpack': () => {
      t.ok(true, 'libnpmpack is called')
      return ''
    },
    'npmlog': {
      'showProgress': () => {},
      'clearProgress': () => {}
    }
  })

  pack([], () => {
    t.end()
  })
})

test('should pack given directory', (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0'
    }, null, 2)
  })

  const pack = requireInject('../../lib/pack.js', {
    '../../lib/utils/output.js': () => {},
    '../../lib/npm.js': {
      flatOptions: {
        unicode: true,
        json: true,
        dryRun: true
      }
    },
    'libnpmpack': () => '',
    'npmlog': {
      'showProgress': () => {},
      'clearProgress': () => {}
    }
  })

  pack([testDir], () => {
    t.end()
  })
})

test('should log pack contents', (t) => {
  const pack = requireInject('../../lib/pack.js', {
    '../../lib/utils/tar.js': {
      'getContents': () => {},
      'logTar': () => {
        t.ok(true, 'logTar is called')
      } 
    },
    '../../lib/npm.js': {
      flatOptions: {
        unicode: false,
        json: false,
        dryRun: false
      }
    },
    'libnpmpack': () => '',
    'npmlog': {
      'showProgress': () => {},
      'clearProgress': () => {}
    }
  })

  pack([], () => {
    t.end()
  })
})
