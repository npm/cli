const { test } = require('tap')

const install = require('../../lib/install.js')
const requireInject = require('require-inject')

test('should install using Arborist', (t) => {
  const install = requireInject('../../lib/install.js', {
    '../../lib/npm.js': {
      globalDir: 'path/to/node_modules/',
      prefix: 'foo',
      flatOptions: {},
      config: {
        get: () => true
      }
    },
    'npmlog': {
      warn: () => {}
    },
    '@npmcli/arborist': function (args) {
      t.ok(args, 'gets options object')
      this.reify = () => {
        t.ok(true, 'reify is called')
      }
    },
    '../../lib/utils/reify-output.js': function (arb) {
      t.ok(arb, 'gets arborist tree')
    }
  })
  install(['fizzbuzz'], () => {
    t.end()
  })
})

test('should install globally using Arborist', (t) => {
  const install = requireInject('../../lib/install.js', {
    '../../lib/npm.js': {
      globalDir: 'path/to/node_modules/',
      prefix: 'foo',
      flatOptions: {
        'global': 'true',
      },
      config: {
        get: () => false
      }
    },
    '@npmcli/arborist': function () {
      this.reify = () => {}
    },
  })
  install([], () => {
    t.end()
  })
})

test('completion to folder', (t) => {
  const install = requireInject('../../lib/install.js', {
    'util': {
      'promisify': (fn) => fn
    },
    'fs': {
      'readdir': (path) => {
        if (path === '/') {
          return ['arborist']
        } else {
          return ['package.json']
        }
      }
    }
  })
  install.completion({
    partialWord: '/ar'
  }, (er, res) => {
    t.equal(er, null)
    t.strictSame(res, ['/arborist'], 'package dir match')
    t.end()
  })
})

test('completion to folder - invalid dir', (t) => {
  const install = requireInject('../../lib/install.js', {
    'util': {
      'promisify': (fn) => fn
    },
    'fs': {
      'readdir': () => {
        throw new Error('EONT')
      }
    }
  })
  install.completion({
    partialWord: 'path/to/folder'
  }, (er, res) => {
    t.equal(er, null)
    t.strictSame(res, [], 'invalid dir: no matching')
    t.end()
  })
})

test('completion to folder - no matches', (t) => {
  const install = requireInject('../../lib/install.js', {
    'util': {
      'promisify': (fn) => fn
    },
    'fs': {
      'readdir': (path) => {
        return ['foobar']
      }
    }
  })
  install.completion({
    partialWord: '/pa'
  }, (er, res) => {
    t.equal(er, null)
    t.strictSame(res, [], 'no name match')
    t.end()
  })
})

test('completion to folder - match is not a package', (t) => {
  const install = requireInject('../../lib/install.js', {
    'util': {
      'promisify': (fn) => fn
    },
    'fs': {
      'readdir': (path) => {
        if (path === '/') {
          return ['arborist']
        } else {
          throw new Error('EONT')
        }
      }
    }
  })
  install.completion({
    partialWord: '/ar'
  }, (er, res) => {
    t.equal(er, null)
    t.strictSame(res, [], 'no name match')
    t.end()
  })
})

test('completion to url', (t) => {
  install.completion({
    partialWord: 'http://path/to/url'
  }, (er, res) => {
    t.equal(er, null)
    t.strictSame(res, [])
    t.end()
  })
})

test('completion', (t) => {
  install.completion({
    partialWord: 'toto'
  }, (er, res) => {
    t.notOk(er)
    t.notOk(res)
    t.end()
  })
})
