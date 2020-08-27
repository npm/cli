const t = require('tap')
const requireInject = require('require-inject')

const packument = spec => {
  const mocks = {
    'alpha': {
      'name': 'alpha',
      'dist-tags': {
        'latest': '1.0.1'
      },
      'versions': {
        '1.0.1': {
          'version': '1.0.1',
          'dependencies': {
            'gamma': '2.0.0'
          }
        }
      }
    },
    'beta': {
      'name': 'beta',
      'dist-tags': {
        'latest': '1.0.1'
      },
      'versions': {
        '1.0.1': {
          'version': '1.0.1'
        }
      }
    },
    'gamma': {
      'name': 'gamma',
      'dist-tags': {
        'latest': '2.0.0'
      },
      'versions': {
        '1.0.1': {
          'version': '1.0.1',
        }, 
        '2.0.0': {
          'version': '2.0.0'
        }
      }
    },
    'theta': {
      'name': 'theta',
      'dist-tags': {
        'latest': '1.0.1'
      },
      'versions': {
        '1.0.1': {
          'version': '1.0.1'
        }
      }
    }
  }

  if (spec.name === 'eta') {
    throw new Error('There is an error with this package.')
  }

  if (!mocks[spec.name]) {
    const err = new Error()
    err.code = 'E404'
    throw err
  }

  return mocks[spec.name]
}

let logs
const cleanLogs = (done) => {
  logs = ''
  const fn = (...args) => {
    logs += '\n'
    args.map(el => logs += el)
  }
  console.log = fn
  done()
}

const globalDir = t.testdir({
  'node_modules': {
    'alpha': {
      'package.json': JSON.stringify({
        name: 'alpha',
        version: '1.0.0'
      }, null, 2)
    }
  }
})

const outdated = (dir, opts) => requireInject(
  '../../lib/outdated.js', 
  {
    '../../lib/npm.js': {
      prefix: dir,
      globalDir: `${globalDir}/node_modules`,
      flatOptions: opts
    },
    'pacote': {
      packument
    }
  }
)

t.beforeEach(cleanLogs)
t.cleanSnapshot = s => {
  return s.replace(
    /(\/.*)(cli\/test\/lib\/)|(D:\\.*)(cli(\\\\|\\)test(\\\\|\\)lib(\\\\|\\))/g,
    '/cli/test/lib/'
  ).replace(/(\\\\|\\)/g, '/')
}

t.test('should display outdated deps', t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'delta',
      version: '1.0.0',
      dependencies: {
        alpha: '^1.0.0',
        gamma: '^1.0.0',
        theta: '^1.0.0'
      },
      devDependencies: {
        zeta: '^1.0.0'
      },
      peerDependencies: {
        beta: '^1.0.0'
      }
    }, null, 2),
    'node_modules': {
      'alpha': {
        'package.json': JSON.stringify({
          name: 'alpha',
          version: '1.0.0',
          dependencies: {
            gamma: '2.0.0'
          }
        }, null, 2),
        'node_modules': {
          'gamma': {
            'package.json': JSON.stringify({
              name: 'gamma',
              version: '2.0.0'
            }, null, 2)
          }
        }
      },
      'beta': {
        'package.json': JSON.stringify({
          name: 'beta',
          version: '1.0.0'
        }, null, 2)
      }, 
      'gamma': {
        'package.json': JSON.stringify({
          name: 'gamma',
          version: '1.0.1'
        }, null, 2)
      },
      'zeta': {
        'package.json': JSON.stringify({
          name: 'zeta',
          version: '1.0.0'
        }, null, 2)
      }
    }
  })

  t.test('outdated global', t => {
    outdated(null, {
     global: true,
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated', t => {
    outdated(testDir, {
     global: false,
     color: true
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated --long', t => {
    outdated(testDir, {
     global: false,
     long: true,
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated --json', t => {
    outdated(testDir, {
     global: false,
     json: true,
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated --json --long', t => {
    outdated(testDir, {
     global: false,
     json: true,
     long: true
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated --parseable', t => {
    outdated(testDir, {
     global: false,
     parseable: true,
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated --parseable --long', t => {
    outdated(testDir, {
     global: false,
     parseable: true,
     long: true
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated --all', t => {
    outdated(testDir, {
     all: true,
    })([], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.test('outdated specific dep', t => {
    outdated(testDir, {
     global: false,
    })(['alpha'], () => {
      t.matchSnapshot(logs)
      t.end()
    })
  })

  t.end()

})

t.test('should return if no outdated deps', t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'delta',
      version: '1.0.0',
      dependencies: {
        alpha: '^1.0.0'
      }
    }, null, 2),
    'node_modules': {
      'alpha': {
        'package.json': JSON.stringify({
          name: 'alpha',
          version: '1.0.1'
        }, null, 2)
      }
    }
  })

  outdated(testDir, {
    global: false,
   })([], () => {
    t.equals(logs.length, 0, 'no logs')
    t.end()
   })
})

t.test('throws if error with a dep', t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'delta',
      version: '1.0.0',
      dependencies: {
        eta: '^1.0.0'
      }
    }, null, 2),
    'node_modules': {
      'eta': {
        'package.json': JSON.stringify({
          name: 'eta',
          version: '1.0.1'
        }, null, 2)
      }
    }
  })

  outdated(testDir, {
    global: false,
   })([], (err) => {
    t.equals(err.message, 'There is an error with this package.')
    t.end()
   })
})

t.test('should skip missing non-prod deps', t => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'delta',
      version: '1.0.0',
      devDependencies: {
        beta: '^1.0.0'
      }
    }, null, 2),
    'node_modules': {}
  })

  outdated(testDir, {
    global: false,
   })([], () => {
    //t.equals(logs.length, 0, 'no logs')
    t.end()
   })
})
