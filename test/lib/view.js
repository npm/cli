const t = require('tap')
const mr = require('npm-registry-mock')
const requireInject = require('require-inject')

const REG = 'http://localhost:1331'

let logs
let server
const cleanLogs = (done) => {
  logs = ''
  const fn = (...args) => {
    logs += '\n'
    args.map(el => logs += el)
  }
  console.log = fn
  done()
}

t.beforeEach(cleanLogs)
t.test('setup', (t) => {
  var mocks = {
    'get': {
      '/red': [200, {
        'name' : 'red',
        'dist-tags': {
          '1.0.1': {}
        },
        'time': {
          'unpublished': new Date()
        }
      }],
      '/blue': [200, {
        'name': 'blue',
        'dist-tags': {},
        'time': {
          '1.0.0': '2019-08-06T16:21:09.842Z'
        },
        'versions': {
          '1.0.0': {
            'name': 'blue',
            'version': 'blue',
            'dist': {
              'shasum': '123',
              'tarball': 'http://hm.blue.com/1.0.0.tgz',
              'integrity': '---',
              'fileCount': 1,
              'unpackedSize': 1              
            }
          },
          '1.0.1': {}
        }
      }],
      '/cyan': [200, {
        '_npmUser': {
          'name': 'claudia',
          'email': 'claudia@cyan.com'
        } ,
        'name': 'cyan',
        'dist-tags': {},
        'versions': {
          '1.0.0': {
            'version': '1.0.0',
            'name': 'cyan',
            'dist': {
              'shasum': '123',
              'tarball': 'http://hm.cyan.com/1.0.0.tgz',
              'integrity': '---',
              'fileCount': 1,
              'unpackedSize': 1
            }
          },
          '1.0.1': {}
        }
      }],
      '/brown': [200, {
        'name': 'brown'
      }],
      '/yellow': [200, {
        'name': 'yellow',
        'author': {
          'name': 'foo',
          'email': 'foo@yellow.com',
          'twitter': 'foo'
        },
        'readme': 'a very useful readme',
        'versions': {
          '1.0.0': {
            'readme': 'a very useful readme',
            'maintainers': [
              { 'name': 'claudia', 'email': 'c@yellow.com', 'twitter': 'cyellow' },
              { 'name': 'isaacs', 'email': 'i@yellow.com', 'twitter': 'iyellow' }
            ]
          },
          '1.0.1': {}
        }
      }],
      '/purple': [200, {
        'name': 'purple',
        'versions': {
          '1.0.0': {
            'foo': 1,
            'maintainers': [
              { 'name': 'claudia' }
            ]
          },
          '1.0.1': {}
        }
      }],
      '/green': [200, {
        'name': 'green',
        'dist-tags': {
          'latest': '1.0.0'
        },
        'keywords': ['colors', 'green', 'crayola'],
        'versions': {
          '1.0.0': {
            'version': '1.0.0',
            'bugs': {
              'url': 'http://bugs.green.com'
            },
            'deprecated': true,
            'repository': {
              'url': 'http://repository.green.com'
            },
            'license': { type: 'ACME' },
            'bin': {
              'green': 'bin/green.js'
            },
            'dependencies': {
              'red': '1.0.0',
              'yellow': '1.0.0'
            },
            'dist': {
              'shasum': '123',
              'tarball': 'http://hm.green.com/1.0.0.tgz',
              'integrity': '---',
              'fileCount': 1,
              'unpackedSize': 1
            }
          },
          '1.0.1': {}
        }
      }],
      '/black': [200, {
        'name': 'black',
        'dist-tags': {
          'latest': '1.0.0'
        },
        'versions': {
          '1.0.0': {
            'version': '1.0.0',
            'bugs': 'http://bugs.black.com',
            'license': {},
            'dependencies': (() => {
              const deps = {}
              for (i = 0; i < 25; i++) {
                deps[i] = '1.0.0'
              }
              return deps
            })(),
            'dist': {
              'shasum': '123',
              'tarball': 'http://hm.black.com/1.0.0.tgz',
              'integrity': '---',
              'fileCount': 1,
              'unpackedSize': 1
            }
          },
          '1.0.1': {}
        }
      }],
      '/pink': [200, {
        'name': 'pink',
        'dist-tags': {
          'latest': '1.0.0'
        },
        'versions': {
          '1.0.0': {
            'version': '1.0.0',
            'maintainers': [
              { 'name': 'claudia', 'url': 'http://c.pink.com' },
              { 'name': 'isaacs', 'url': 'http://i.pink.com'  }
            ],
            'repository': 'http://repository.pink.com',
            'license': {},
            'dist': {
              'shasum': '123',
              'tarball': 'http://hm.pink.com/1.0.0.tgz',
              'integrity': '---',
              'fileCount': 1,
              'unpackedSize': 1
            }
          },
          '1.0.1': {}
        }
      }],
      '/orange': [200, {
        'name': 'orange',
        'dist-tags': {
          'latest': '1.0.0'
        },
        'versions': {
          '1.0.0': {
            'version': '1.0.0',
            'homepage': 'http://hm.orange.com',
            'license': {},
            'dist': {
              'shasum': '123',
              'tarball': 'http://hm.orange.com/1.0.0.tgz',
              'integrity': '---',
              'fileCount': 1,
              'unpackedSize': 1
            }
          },
          '1.0.1': {}
        }
      }]
    }
  }
  mr({ port: 1331, mocks }, (err, s) => {
    server = s
  })
  t.done()
})

t.test('should log package info', t => {
  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        registry: REG,
        global: false,
        unicode: true
      }
    }
  })

  const viewJson = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        registry: REG,
        json: true
      }
    }
  })

  t.test('mkdirp@0.3.5', t => {
    view(['mkdirp@0.3.5'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with license, bugs, repository and other fields', t => {
    view(['green@1.0.0'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with more than 25 deps', t => {
    view(['black@1.0.0'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with maintainers info as object', t => {
    view(['pink@1.0.0'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with homepage', t => {
    view(['orange@1.0.0'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with no versions', t => {
    view(['brown'], () => {
      t.equals(logs, '', 'no info to display')
      t.end()
    })
  })

  t.test('package with no repo or homepage', t => {
    view(['blue@1.0.0'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with no modified time', t => {
    view(['cyan@1.0.0'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with --json and semver range', t => {
    viewJson(['underscore@^1.3.1'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('package with --json and no versions', t => {
    viewJson(['brown'], () => {
      t.equals(logs, '\n', 'no info to display')
      t.end()
    })
  })

  t.end()
})

t.test('should log info of package in current working dir', t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'underscore',
      version: '1.3.1'
    }, null, 2)
  })

  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      prefix: testDir,
      flatOptions: {
        defaultTag: '1.3.1',
        registry: REG,
        global: false
      }
    }
  })

  t.test('specific version', t => {
    view(['.@1.3.1'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('non-specific version', t => {
    view(['.'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.end()
})

t.test('should log info by field name', t => {
  const viewJson = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        registry: REG,
        json: true,
        global: false
      }
    }
  })

  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        registry: REG,
        global: false
      }
    }
  })

  t.test('readme', t => {
    view(['yellow@1.0.0', 'readme'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('several fields', t => {
    viewJson(['underscore@1.3.1', 'name', 'version', 'foo[bar]'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('several fields with several versions', t => {
    view(['underscore@1.x.x', 'author'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('nested field with brackets', t => {
    viewJson(['underscore@1.3.0', 'author[name]'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('maintainers with email', t => {
    viewJson(['yellow@1.0.0', 'maintainers', 'name'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('maintainers with url', t => {
    viewJson(['pink@1.0.0', 'maintainers'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('unknown nested field ', t => {
    view(['underscore@1.3.1', 'dist.foobar'], () => {
      t.equals(logs, '\n', 'no info to display')
      t.end()
    })
  })

  t.test('array field - 1 element', t => {
    view(['purple@1.0.0',  'maintainers.name'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('array field - 2 elements', t => {
    view(['yellow@1.x.x',  'maintainers.name'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.end()
})

t.test('throw error if global mode', (t) => {
  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        global: true
      }
    }
  })
  view([], (err) => {
    t.equals(err.message, 'Cannot use view command in global mode.')
    t.end()
  })
})

t.test('throw error if invalid package.json', (t) => {
  const testDir = t.testdir({
    'package.json': '{}'
  })

  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      prefix: testDir,
      flatOptions: {
        global: false
      }
    }
  })
  view([], (err) => {
    t.equals(err.message, 'Invalid package.json')
    t.end()
  })
})

t.test('throws when unpublished', (t) => {
  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        defaultTag: '1.0.1',
        registry: REG,
        global: false
      }
    }
  })
  view(['red'], (err) => {
    t.equals(err.code, 'E404')
    t.end()
  })
})

t.test('completion', (t) => {
  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        defaultTag: '1.0.1',
        registry: REG,
        global: false
      }
    }
  })
  view.completion({
    conf: { argv: { remain: ['npm', 'view', 'mkdirp@0.3.5'] } }
  }, (err, res) => {
    t.ok(res, 'returns back fields')
    t.end()
  })
})

t.test('no registry completion', (t) => {
  const view = requireInject('../../lib/view.js', {
    '../../lib/npm.js': {
      flatOptions: {
        defaultTag: '1.0.1',
      }
    }
  })
  view.completion({
    conf: { argv: { remain: ['npm', 'view'] } }
  }, (err) => {
    t.notOk(err, 'there is no package completion')
    t.end()
  })
})

t.test('cleanup', function (t) {
  server.close()
  t.done()
})
