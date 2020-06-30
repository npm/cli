const { test } = require('tap')
const requireInject = require('require-inject')

const simpleNmFixture = {
  node_modules: {
    'foo': {
      'package.json': JSON.stringify({
        name: 'foo',
        version: '1.0.0',
        dependencies: {
          'bar': '^1.0.0'
        }
      })
    },
    'bar': {
      'package.json': JSON.stringify({
        name: 'bar',
        version: '1.0.0'
      })
    },
    'lorem': {
      'package.json': JSON.stringify({
        name: 'lorem',
        version: '1.0.0'
      })
    }
  }
}

const diffDepTypesNmFixture = {
  node_modules: {
    'dev-dep': {
      'package.json': JSON.stringify({
        name: 'dev-dep',
        description: 'A DEV dep kind of dep',
        version: '1.0.0',
        dependencies: {
          'foo': '^1.0.0'
        }
      })
    },
    'prod-dep': {
      'package.json': JSON.stringify({
        name: 'prod-dep',
        description: 'A PROD dep kind of dep',
        version: '1.0.0',
        dependencies: {
          'bar': '^2.0.0'
        }
      }),
      node_modules: {
        bar: {
          'package.json': JSON.stringify({
            name: 'bar',
            description: 'A dep that bars',
            version: '2.0.0'
          })
        }
      }
    },
    'optional-dep': {
      'package.json': JSON.stringify({
        name: 'optional-dep',
        description: 'Maybe a dep?',
        version: '1.0.0'
      })
    },
    'peer-dep': {
      'package.json': JSON.stringify({
        name: 'peer-dep',
        description: 'Peer-dep description here',
        version: '1.0.0'
      })
    },
    ...simpleNmFixture.node_modules
  }
}

let prefix
let result = ''
const _flatOptions = {
  dev: false,
  depth: Infinity,
  json: false,
  link: false,
  only: null,
  parseable: false,
  production: false
}
const ls = requireInject('../../lib/ls.js', {
  '../../lib/npm.js': {
    flatOptions: _flatOptions,
    limit: {
      fetch: 3
    },
    get dir () { return prefix + '/node_modules/' },
    globalDir: '/foo',
    config: {
      get (key) {
        return _flatOptions[key]
      }
    }
  },
  '../../lib/utils/output.js': msg => { result = msg }
})

const redactCwd = res =>
    res.replace(/\\/g, '/').replace(new RegExp(__dirname.replace(/\\/g, '/'), 'gi'), '{CWD}')

const jsonParse = res =>
  JSON.parse(redactCwd(res))

test('ls', (t) => {
  _flatOptions.json = false
  _flatOptions.unicode = false
  t.test('no args', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree representation of dependencies structure')
      t.end()
    })
  })

  t.test('missing package.json', (t) => {
    prefix = t.testdir({
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output json missing name/version of top-level package')
      t.end()
    })
  })

  t.test('extraneous deps', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.equal(
        redactCwd(err),
        'extraneous: lorem@1.0.0 {CWD}/ls-ls-extraneous-deps/node_modules/lorem',
        'should log extraneous dep as error'
      )
      t.matchSnapshot(redactCwd(result), 'should output containing problems info')
      t.end()
    })
  })

  t.test('with filter arg', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls(['lorem'], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree contaning only occurences of filtered by package')
      t.end()
    })
  })

  t.test('with missing filter arg', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls(['notadep'], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree containing no dependencies info')
      t.equal(
        process.exitCode,
        1,
        'should exit with error code 1'
      )
      process.exitCode = 0
      t.end()
    })
  })

  t.test('--depth=0', (t) => {
    _flatOptions.depth = 0
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree containing only top-level dependencies')
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('--depth=1', (t) => {
    _flatOptions.depth = 1
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree containing top-level deps and their deps only')
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('missing/invalid/extraneous', (t) => {
    _flatOptions.depth = 1
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^2.0.0',
          ipsum: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing top-level deps and their deps only')
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('--dev', (t) => {
    _flatOptions.dev = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing dev deps')
      _flatOptions.dev = false
      t.end()
    })
  })

  t.test('--only=development', (t) => {
    _flatOptions.only = 'development'
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing only development deps')
      _flatOptions.only = null
      t.end()
    })
  })

  t.test('--link', (t) => {
    _flatOptions.link = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0',
          'linked-dep': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      'linked-dep': {
        'package.json': JSON.stringify({
          name: 'linked-dep',
          version: '1.0.0'
        })
      },
      node_modules: {
        'linked-dep': t.fixture('symlink', '../linked-dep'),
        ...diffDepTypesNmFixture.node_modules
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing linked deps')
      _flatOptions.link = false
      t.end()
    })
  })

  t.test('--production', (t) => {
    _flatOptions.production = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing production deps')
      _flatOptions.production = false
      t.end()
    })
  })

  t.test('--only=prod', (t) => {
    _flatOptions.only = 'prod'
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing only prod deps')
      _flatOptions.only = null
      t.end()
    })
  })

  t.test('--long', (t) => {
    _flatOptions.long = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree info with descriptions')
      _flatOptions.long = true
      t.end()
    })
  })

  t.test('--long --depth=0', (t) => {
    _flatOptions.depth = 0
    _flatOptions.long = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing top-level deps with descriptions')
      _flatOptions.depth = Infinity
      _flatOptions.long = false
      t.end()
    })
  })

  t.test('json read problems', (t) => {
    prefix = t.testdir({
      'package.json': '{broken json'
    })
    ls([], (err) => {
      t.match(err, /Failed to parse json/)
      t.matchSnapshot(redactCwd(result), 'should print empty result')
      t.end()
    })
  })

  t.test('empty location', (t) => {
    prefix = t.testdir({})
    ls([], (err) => {
      t.ifError(err, 'should not error out on empty locations')
      t.matchSnapshot(redactCwd(result), 'should print empty result')
      t.end()
    })
  })

  t.test('unmet peer dep', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^2.0.0' // mismatching version #
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree signaling missing peer dep in problems')
      t.end()
    })
  })

  t.test('unmet optional dep', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'missing-optional-dep': '^1.0.0',
          'optional-dep': '^2.0.0' // mismatching version #
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree with empty entry for missing optional deps')
      t.end()
    })
  })

  t.test('cycle deps', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'a': '^1.0.0'
        }
      }),
      node_modules: {
        'a': {
          'package.json': JSON.stringify({
            name: 'a',
            version: '1.0.0',
            dependencies: {
              b: '^1.0.0'
            }
          })
        },
        'b': {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1.0.0',
            dependencies: {
              a: '^1.0.0'
            }
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should print tree output containing deduped ref')
      t.end()
    })
  })

  t.test('using aliases', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          a: 'npm:b@1.0.0'
        }
      }),
      node_modules: {
        'a': {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1.0.0',
            _from: 'a@npm:b',
            _resolved: 'https://localhost:8080/abbrev/-/abbrev-1.1.1.tgz',
            _requested: {
              type: 'alias'
            }
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing aliases')
      t.end()
    })
  })

  t.test('resolved points to git ref', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'abbrev': 'git+https://github.com/isaacs/abbrev-js.git'
        }
      }),
      node_modules: {
        'abbrev': {
          'package.json': JSON.stringify({
            name: 'abbrev',
            version: '1.1.1',
            _id: 'abbrev@1.1.1',
            _from: 'git+https://github.com/isaacs/abbrev-js.git',
            _resolved: 'git+https://github.com/isaacs/abbrev-js.git#b8f3a2fc0c3bb8ffd8b0d0072cc6b5a3667e963c',
            _requested: {
              type: 'git',
              raw: 'git+https:github.com/isaacs/abbrev-js.git',
              rawSpec: 'git+https:github.com/isaacs/abbrev-js.git',
              saveSpec: 'git+https://github.com/isaacs/abbrev-js.git',
              fetchSpec: 'https://github.com/isaacs/abbrev-js.git',
              gitCommittish: null
            }
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing git refs')
      t.end()
    })
  })

  t.test('from and resolved properties', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'simple-output': '^2.0.0'
        }
      }),
      node_modules: {
        'simple-output': {
          'package.json': JSON.stringify({
            name: 'simple-output',
            version: '2.1.1',
            _from: 'simple-output',
            _id: 'simple-output@2.1.1',
            _resolved: 'https://registry.npmjs.org/simple-output/-/simple-output-2.1.1.tgz',
            _requested: {
              type: 'tag',
              registry: true,
              raw: 'simple-output',
              name: 'simple-output',
              escapedName: 'simple-output',
              rawSpec: '',
              saveSpec: null,
              fetchSpec: 'latest'
            },
            _requiredBy: [
              '#USER',
              '/'
            ],
            _shasum: '3c07708ec9ef3e3c985cf0ddd67df09ab8ec2abc',
            _spec: 'simple-output'
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should not be printed in tree output')
      t.end()
    })
  })

  t.end()
})

test('ls --parseable', (t) => {
  _flatOptions.json = false
  _flatOptions.unicode = false
  _flatOptions.parseable = true
  t.test('no args', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree representation of dependencies structure')
      t.end()
    })
  })

  t.test('missing package.json', (t) => {
    prefix = t.testdir({
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output json missing name/version of top-level package')
      t.end()
    })
  })

  t.test('extraneous deps', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.equal(
        redactCwd(err),
        'extraneous: lorem@1.0.0 {CWD}/ls-ls-parseable-extraneous-deps/node_modules/lorem',
        'should log extraneous dep as error'
      )
      t.matchSnapshot(redactCwd(result), 'should output containing problems info')
      t.end()
    })
  })

  t.test('with filter arg', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls(['lorem'], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree contaning only occurences of filtered by package')
      t.end()
    })
  })

  t.test('with missing filter arg', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls(['notadep'], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree containing no dependencies info')
      t.equal(
        process.exitCode,
        1,
        'should exit with error code 1'
      )
      process.exitCode = 0
      t.end()
    })
  })

  t.test('--depth=0', (t) => {
    _flatOptions.depth = 0
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree containing only top-level dependencies')
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('--depth=1', (t) => {
    _flatOptions.depth = 1
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.matchSnapshot(redactCwd(result), 'should output tree containing top-level deps and their deps only')
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('missing/invalid/extraneous', (t) => {
    _flatOptions.depth = 1
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^2.0.0',
          ipsum: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing top-level deps and their deps only')
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('--dev', (t) => {
    _flatOptions.dev = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing dev deps')
      _flatOptions.dev = false
      t.end()
    })
  })

  t.test('--only=development', (t) => {
    _flatOptions.only = 'development'
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing only development deps')
      _flatOptions.only = null
      t.end()
    })
  })

  t.test('--link', (t) => {
    _flatOptions.link = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0',
          'linked-dep': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      'linked-dep': {
        'package.json': JSON.stringify({
          name: 'linked-dep',
          version: '1.0.0'
        })
      },
      node_modules: {
        'linked-dep': t.fixture('symlink', '../linked-dep'),
        ...diffDepTypesNmFixture.node_modules
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing linked deps')
      _flatOptions.link = false
      t.end()
    })
  })

  t.test('--production', (t) => {
    _flatOptions.production = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing production deps')
      _flatOptions.production = false
      t.end()
    })
  })

  t.test('--only=prod', (t) => {
    _flatOptions.only = 'prod'
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing only prod deps')
      _flatOptions.only = null
      t.end()
    })
  })

  t.test('--long', (t) => {
    _flatOptions.long = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree info with descriptions')
      _flatOptions.long = true
      t.end()
    })
  })

  t.test('--long --depth=0', (t) => {
    _flatOptions.depth = 0
    _flatOptions.long = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing top-level deps with descriptions')
      _flatOptions.depth = Infinity
      _flatOptions.long = false
      t.end()
    })
  })

  t.test('json read problems', (t) => {
    prefix = t.testdir({
      'package.json': '{broken json'
    })
    ls([], (err) => {
      t.match(err, /Failed to parse json/)
      t.matchSnapshot(redactCwd(result), 'should print empty result')
      t.end()
    })
  })

  t.test('empty location', (t) => {
    prefix = t.testdir({})
    ls([], (err) => {
      t.ifError(err, 'should not error out on empty locations')
      t.matchSnapshot(redactCwd(result), 'should print empty result')
      t.end()
    })
  })

  t.test('unmet peer dep', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^2.0.0' // mismatching version #
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree signaling missing peer dep in problems')
      t.end()
    })
  })

  t.test('unmet optional dep', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'missing-optional-dep': '^1.0.0',
          'optional-dep': '^2.0.0' // mismatching version #
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree with empty entry for missing optional deps')
      t.end()
    })
  })

  t.test('cycle deps', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'a': '^1.0.0'
        }
      }),
      node_modules: {
        'a': {
          'package.json': JSON.stringify({
            name: 'a',
            version: '1.0.0',
            dependencies: {
              b: '^1.0.0'
            }
          })
        },
        'b': {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1.0.0',
            dependencies: {
              a: '^1.0.0'
            }
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should print tree output ommiting deduped ref')
      t.end()
    })
  })

  t.test('using aliases', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          a: 'npm:b@1.0.0'
        }
      }),
      node_modules: {
        'a': {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1.0.0',
            _from: 'a@npm:b',
            _resolved: 'https://localhost:8080/abbrev/-/abbrev-1.1.1.tgz',
            _requested: {
              type: 'alias'
            }
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing aliases')
      t.end()
    })
  })

  t.test('resolved points to git ref', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'abbrev': 'git+https://github.com/isaacs/abbrev-js.git'
        }
      }),
      node_modules: {
        'abbrev': {
          'package.json': JSON.stringify({
            name: 'abbrev',
            version: '1.1.1',
            _id: 'abbrev@1.1.1',
            _from: 'git+https://github.com/isaacs/abbrev-js.git',
            _resolved: 'git+https://github.com/isaacs/abbrev-js.git#b8f3a2fc0c3bb8ffd8b0d0072cc6b5a3667e963c',
            _requested: {
              type: 'git',
              raw: 'git+https:github.com/isaacs/abbrev-js.git',
              rawSpec: 'git+https:github.com/isaacs/abbrev-js.git',
              saveSpec: 'git+https://github.com/isaacs/abbrev-js.git',
              fetchSpec: 'https://github.com/isaacs/abbrev-js.git',
              gitCommittish: null
            }
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should output tree containing git refs')
      t.end()
    })
  })

  t.test('from and resolved properties', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'simple-output': '^2.0.0'
        }
      }),
      node_modules: {
        'simple-output': {
          'package.json': JSON.stringify({
            name: 'simple-output',
            version: '2.1.1',
            _from: 'simple-output',
            _id: 'simple-output@2.1.1',
            _resolved: 'https://registry.npmjs.org/simple-output/-/simple-output-2.1.1.tgz',
            _requested: {
              type: 'tag',
              registry: true,
              raw: 'simple-output',
              name: 'simple-output',
              escapedName: 'simple-output',
              rawSpec: '',
              saveSpec: null,
              fetchSpec: 'latest'
            },
            _requiredBy: [
              '#USER',
              '/'
            ],
            _shasum: '3c07708ec9ef3e3c985cf0ddd67df09ab8ec2abc',
            _spec: 'simple-output'
          })
        }
      }
    })
    ls([], () => {
      t.matchSnapshot(redactCwd(result), 'should not be printed in tree output')
      t.end()
    })
  })

  t.end()
})

test('ls --json', (t) => {
  _flatOptions.json = true
  _flatOptions.parseable = false
  t.test('no args', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          'dependencies': {
            'foo': {
              'version': '1.0.0',
              'dependencies': {
                'bar': {
                  'version': '1.0.0'
                }
              }
            },
            'lorem': {
              'version': '1.0.0'
            }
          }
        },
        'should output json representation of dependencies structure'
      )
      t.end()
    })
  })

  t.test('missing package.json', (t) => {
    prefix = t.testdir({
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.deepEqual(
        jsonParse(result),
        {
          'dependencies': {
            'foo': {
              'version': '1.0.0',
              'dependencies': {
                'bar': {
                  'version': '1.0.0'
                }
              }
            },
            'lorem': {
              'version': '1.0.0'
            }
          }
        },
        'should output json missing name/version of top-level package'
      )
      t.end()
    })
  })

  t.test('extraneous deps', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.equal(
        redactCwd(err),
        'extraneous: lorem@1.0.0 {CWD}/ls-ls-json-extraneous-deps/node_modules/lorem',
        'should log extraneous dep as error'
      )
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          'problems': [
            'extraneous: lorem@1.0.0 {CWD}/ls-ls-json-extraneous-deps/node_modules/lorem'
          ],
          'dependencies': {
            'foo': {
              'version': '1.0.0',
              'dependencies': {
                'bar': {
                  'version': '1.0.0'
                }
              }
            },
            'lorem': {
              'version': '1.0.0',
              'extraneous': true,
              'problems': [
                'extraneous: lorem@1.0.0 {CWD}/ls-ls-json-extraneous-deps/node_modules/lorem'
              ]
            }
          }
        },
        'should output json containing problems info'
      )
      t.end()
    })
  })

  t.test('with filter arg', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls(['lorem'], (err) => {
      t.ifError(err, 'npm ls')
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          'dependencies': {
            'lorem': {
              'version': '1.0.0'
            }
          }
        },
        'should output json contaning only occurences of filtered by package'
      )
      t.end()
    })
  })

  t.test('with missing filter arg', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls(['notadep'], (err) => {
      t.ifError(err, 'npm ls')
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0'
        },
        'should output json containing no dependencies info'
      )
      t.equal(
        process.exitCode,
        1,
        'should exit with error code 1'
      )
      process.exitCode = 0
      t.end()
    })
  })

  t.test('--depth=0', (t) => {
    _flatOptions.depth = 0
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          'dependencies': {
            'foo': {
              'version': '1.0.0'
            },
            'lorem': {
              'version': '1.0.0'
            }
          }
        },
        'should output json containing only top-level dependencies'
      )
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('--depth=1', (t) => {
    _flatOptions.depth = 1
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          lorem: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], (err) => {
      t.ifError(err, 'npm ls')
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          'dependencies': {
            'foo': {
              'version': '1.0.0',
              'dependencies': {
                'bar': {
                  'version': '1.0.0'
                }
              }
            },
            'lorem': {
              'version': '1.0.0'
            }
          }
        },
        'should output json containing top-level deps and their deps only'
      )
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('missing/invalid/extraneous', (t) => {
    _flatOptions.depth = 1
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          foo: '^2.0.0',
          ipsum: '^1.0.0'
        }
      }),
      ...simpleNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          'name': 'test-npm-ls',
          'version': '1.0.0',
          'problems': [
            'missing: ipsum@^1.0.0, required by test-npm-ls@1.0.0',
            'invalid: foo@1.0.0 {CWD}/ls-ls-json-missing-invalid-extraneous/node_modules/foo',
            'extraneous: bar@1.0.0 {CWD}/ls-ls-json-missing-invalid-extraneous/node_modules/bar',
            'extraneous: lorem@1.0.0 {CWD}/ls-ls-json-missing-invalid-extraneous/node_modules/lorem'
          ],
          'dependencies': {
            'foo': {
              'version': '1.0.0',
              'invalid': true,
              'problems': [
                'invalid: foo@1.0.0 {CWD}/ls-ls-json-missing-invalid-extraneous/node_modules/foo',
                'extraneous: bar@1.0.0 {CWD}/ls-ls-json-missing-invalid-extraneous/node_modules/bar'
              ],
              'dependencies': {
                'bar': {
                  'version': '1.0.0',
                  'extraneous': true,
                  'problems': [
                    'extraneous: bar@1.0.0 {CWD}/ls-ls-json-missing-invalid-extraneous/node_modules/bar'
                  ]
                }
              }
            },
            'lorem': {
              'version': '1.0.0',
              'extraneous': true,
              'problems': [
                'extraneous: lorem@1.0.0 {CWD}/ls-ls-json-missing-invalid-extraneous/node_modules/lorem'
              ]
            },
            'ipsum': {
              'required': '^1.0.0',
              'missing': true
            }
          }
        },
        'should output json containing top-level deps and their deps only'
      )
      _flatOptions.depth = Infinity
      t.end()
    })
  })

  t.test('--dev', (t) => {
    _flatOptions.dev = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            'dev-dep': {
              version: '1.0.0',
              dependencies: {
                foo: {
                  version: '1.0.0',
                  dependencies: { bar: { version: '1.0.0' } }
                }
              }
            }
          }
        },
        'should output json containing dev deps'
      )
      _flatOptions.dev = false
      t.end()
    })
  })

  t.test('--only=development', (t) => {
    _flatOptions.only = 'development'
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            'dev-dep': {
              version: '1.0.0',
              dependencies: {
                foo: {
                  version: '1.0.0',
                  dependencies: { bar: { version: '1.0.0' } }
                }
              }
            }
          }
        },
        'should output json containing only development deps'
      )
      _flatOptions.only = null
      t.end()
    })
  })

  t.test('--link', (t) => {
    _flatOptions.link = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0',
          'linked-dep': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      'linked-dep': {
        'package.json': JSON.stringify({
          name: 'linked-dep',
          version: '1.0.0'
        })
      },
      node_modules: {
        'linked-dep': t.fixture('symlink', '../linked-dep'),
        ...diffDepTypesNmFixture.node_modules
      }
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            'linked-dep': { version: '1.0.0' }
          }
        },
        'should output json containing linked deps'
      )
      _flatOptions.link = false
      t.end()
    })
  })

  t.test('--production', (t) => {
    _flatOptions.production = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            lorem: { version: '1.0.0' },
            'optional-dep': { version: '1.0.0' },
            'prod-dep': { version: '1.0.0', dependencies: { bar: { version: '2.0.0' } } }
          }
        },
        'should output json containing production deps'
      )
      _flatOptions.production = false
      t.end()
    })
  })

  t.test('--only=prod', (t) => {
    _flatOptions.only = 'prod'
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            lorem: { version: '1.0.0' },
            'optional-dep': { version: '1.0.0' },
            'prod-dep': { version: '1.0.0', dependencies: { bar: { version: '2.0.0' } } }
          }
        },
        'should output json containing only prod deps'
      )
      _flatOptions.only = null
      t.end()
    })
  })

  t.test('--long', (t) => {
    _flatOptions.long = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            'peer-dep': {
              name: 'peer-dep',
              description: 'Peer-dep description here',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'peer-dep@1.0.0',
              dependencies: {},
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: {},
              path: '{CWD}/ls-ls-json--long/node_modules/peer-dep',
              error: null,
              extraneous: true
            },
            'dev-dep': {
              name: 'dev-dep',
              description: 'A DEV dep kind of dep',
              version: '1.0.0',
              dependencies: {
                foo: {
                  name: 'foo',
                  version: '1.0.0',
                  dependencies: {
                    bar: {
                      name: 'bar',
                      version: '1.0.0',
                      readme: 'ERROR: No README data found!',
                      _id: 'bar@1.0.0',
                      dependencies: {},
                      devDependencies: {},
                      optionalDependencies: {},
                      _dependencies: {},
                      path: '{CWD}/ls-ls-json--long/node_modules/bar',
                      error: '[Circular]',
                      extraneous: false
                    }
                  },
                  readme: 'ERROR: No README data found!',
                  _id: 'foo@1.0.0',
                  devDependencies: {},
                  optionalDependencies: {},
                  _dependencies: { bar: '^1.0.0' },
                  path: '{CWD}/ls-ls-json--long/node_modules/foo',
                  error: '[Circular]',
                  extraneous: false
                }
              },
              readme: 'ERROR: No README data found!',
              _id: 'dev-dep@1.0.0',
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: { foo: '^1.0.0' },
              path: '{CWD}/ls-ls-json--long/node_modules/dev-dep',
              error: '[Circular]',
              extraneous: false
            },
            lorem: {
              name: 'lorem',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'lorem@1.0.0',
              dependencies: {},
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: {},
              path: '{CWD}/ls-ls-json--long/node_modules/lorem',
              error: '[Circular]',
              extraneous: false
            },
            'optional-dep': {
              name: 'optional-dep',
              description: 'Maybe a dep?',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'optional-dep@1.0.0',
              dependencies: {},
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: {},
              path: '{CWD}/ls-ls-json--long/node_modules/optional-dep',
              error: '[Circular]',
              extraneous: false
            },
            'prod-dep': {
              name: 'prod-dep',
              description: 'A PROD dep kind of dep',
              version: '1.0.0',
              dependencies: {
                bar: {
                  name: 'bar',
                  description: 'A dep that bars',
                  version: '2.0.0',
                  readme: 'ERROR: No README data found!',
                  _id: 'bar@2.0.0',
                  dependencies: {},
                  devDependencies: {},
                  optionalDependencies: {},
                  _dependencies: {},
                  path: '{CWD}/ls-ls-json--long/node_modules/prod-dep/node_modules/bar',
                  error: '[Circular]',
                  extraneous: false
                }
              },
              readme: 'ERROR: No README data found!',
              _id: 'prod-dep@1.0.0',
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: { bar: '^2.0.0' },
              path: '{CWD}/ls-ls-json--long/node_modules/prod-dep',
              error: '[Circular]',
              extraneous: false
            }
          },
          devDependencies: { 'dev-dep': '^1.0.0' },
          optionalDependencies: { 'optional-dep': '^1.0.0' },
          peerDependencies: { 'peer-dep': '^1.0.0' },
          readme: 'ERROR: No README data found!',
          _id: 'test-npm-ls@1.0.0',
          _shrinkwrap: '[Circular]',
          _dependencies: { 'prod-dep': '^1.0.0', lorem: '^1.0.0', 'optional-dep': '^1.0.0' },
          path: '{CWD}/ls-ls-json--long',
          error: '[Circular]',
          extraneous: false
        },
        'should output long json info'
      )
      _flatOptions.long = true
      t.end()
    })
  })

  t.test('--long --depth=0', (t) => {
    _flatOptions.depth = 0
    _flatOptions.long = true
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            'peer-dep': {
              name: 'peer-dep',
              description: 'Peer-dep description here',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'peer-dep@1.0.0',
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: {},
              path: '{CWD}/ls-ls-json--long-depth-0/node_modules/peer-dep',
              error: null,
              extraneous: true
            },
            'dev-dep': {
              name: 'dev-dep',
              description: 'A DEV dep kind of dep',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'dev-dep@1.0.0',
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: { foo: '^1.0.0' },
              path: '{CWD}/ls-ls-json--long-depth-0/node_modules/dev-dep',
              error: '[Circular]',
              extraneous: false
            },
            lorem: {
              name: 'lorem',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'lorem@1.0.0',
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: {},
              path: '{CWD}/ls-ls-json--long-depth-0/node_modules/lorem',
              error: '[Circular]',
              extraneous: false
            },
            'optional-dep': {
              name: 'optional-dep',
              description: 'Maybe a dep?',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'optional-dep@1.0.0',
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: {},
              path: '{CWD}/ls-ls-json--long-depth-0/node_modules/optional-dep',
              error: '[Circular]',
              extraneous: false
            },
            'prod-dep': {
              name: 'prod-dep',
              description: 'A PROD dep kind of dep',
              version: '1.0.0',
              readme: 'ERROR: No README data found!',
              _id: 'prod-dep@1.0.0',
              devDependencies: {},
              optionalDependencies: {},
              _dependencies: { bar: '^2.0.0' },
              path: '{CWD}/ls-ls-json--long-depth-0/node_modules/prod-dep',
              error: '[Circular]',
              extraneous: false
            }
          },
          devDependencies: { 'dev-dep': '^1.0.0' },
          optionalDependencies: { 'optional-dep': '^1.0.0' },
          peerDependencies: { 'peer-dep': '^1.0.0' },
          readme: 'ERROR: No README data found!',
          _id: 'test-npm-ls@1.0.0',
          _shrinkwrap: '[Circular]',
          _dependencies: { 'prod-dep': '^1.0.0', lorem: '^1.0.0', 'optional-dep': '^1.0.0' },
          path: '{CWD}/ls-ls-json--long-depth-0',
          error: '[Circular]',
          extraneous: false
        },
        'should output json containing top-level deps in long format'
      )
      _flatOptions.depth = Infinity
      _flatOptions.long = false
      t.end()
    })
  })

  t.test('json read problems', (t) => {
    prefix = t.testdir({
      'package.json': '{broken json'
    })
    ls([], (err) => {
      t.match(err, /Failed to parse json/)
      t.deepEqual(
        jsonParse(result),
        {
          invalid: true,
          problems: [
            "error in {CWD}/ls-ls-json-json-read-problems: Failed to parse json/nUnexpected token b in JSON at position 1 while parsing near '{broken json'"
          ]
        },
        'should print empty json result'
      )
      t.end()
    })
  })

  t.test('empty location', (t) => {
    prefix = t.testdir({})
    ls([], (err) => {
      t.ifError(err, 'should not error out on empty locations')
      t.deepEqual(
        jsonParse(result),
        {},
        'should print empty json result'
      )
      t.end()
    })
  })

  t.test('unmet peer dep', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'optional-dep': '^1.0.0'
        },
        peerDependencies: {
          'peer-dep': '^2.0.0' // mismatching version #
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          problems: [
            'peer dep missing: peer-dep@^2.0.0, required by test-npm-ls@1.0.0'
          ],
          dependencies: {
            'peer-dep': {
              required: {
                name: 'peer-dep',
                description: 'Peer-dep description here',
                version: '1.0.0',
                readme: 'ERROR: No README data found!',
                _id: 'peer-dep@1.0.0',
                dependencies: {},
                devDependencies: {},
                optionalDependencies: {},
                _dependencies: {},
                path: '{CWD}/ls-ls-json-unmet-peer-dep/node_modules/peer-dep',
                error: null,
                extraneous: true,
                peerMissing: [
                  {
                    requiredBy: 'test-npm-ls@1.0.0',
                    requires: 'peer-dep@^2.0.0'
                  }
                ]
              },
              peerMissing: true
            },
            'dev-dep': {
              version: '1.0.0',
              dependencies: {
                foo: {
                  version: '1.0.0',
                  dependencies: { bar: { version: '1.0.0' } }
                }
              }
            },
            lorem: { version: '1.0.0' },
            'optional-dep': { version: '1.0.0' },
            'prod-dep': { version: '1.0.0', dependencies: { bar: { version: '2.0.0' } } }
          }
        },
        'should output json signaling missing peer dep in problems'
      )
      t.end()
    })
  })

  t.test('unmet optional dep', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'prod-dep': '^1.0.0',
          'lorem': '^1.0.0'
        },
        devDependencies: {
          'dev-dep': '^1.0.0'
        },
        optionalDependencies: {
          'missing-optional-dep': '^1.0.0',
          'optional-dep': '^2.0.0' // mismatching version #
        },
        peerDependencies: {
          'peer-dep': '^1.0.0'
        }
      }),
      ...diffDepTypesNmFixture
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          problems: [
            'invalid: optional-dep@1.0.0 {CWD}/ls-ls-json-unmet-optional-dep/node_modules/optional-dep', // mismatching optional deps get flagged in problems
            'extraneous: peer-dep@1.0.0 {CWD}/ls-ls-json-unmet-optional-dep/node_modules/peer-dep'
          ],
          dependencies: {
            'optional-dep': {
              version: '1.0.0',
              invalid: true,
              problems: [
                'invalid: optional-dep@1.0.0 {CWD}/ls-ls-json-unmet-optional-dep/node_modules/optional-dep'
              ]
            },
            'peer-dep': {
              version: '1.0.0',
              extraneous: true,
              problems: [
                'extraneous: peer-dep@1.0.0 {CWD}/ls-ls-json-unmet-optional-dep/node_modules/peer-dep'
              ]
            },
            'dev-dep': {
              version: '1.0.0',
              dependencies: {
                foo: {
                  version: '1.0.0',
                  dependencies: { bar: { version: '1.0.0' } }
                }
              }
            },
            lorem: { version: '1.0.0' },
            'prod-dep': { version: '1.0.0', dependencies: { bar: { version: '2.0.0' } } },
            'missing-optional-dep': {} // missing optional dep has an empty entry in json output
          }
        },
        'should output json with empty entry for missing optional deps'
      )
      t.end()
    })
  })

  t.test('cycle deps', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'a': '^1.0.0'
        }
      }),
      node_modules: {
        'a': {
          'package.json': JSON.stringify({
            name: 'a',
            version: '1.0.0',
            dependencies: {
              b: '^1.0.0'
            }
          })
        },
        'b': {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1.0.0',
            dependencies: {
              a: '^1.0.0'
            }
          })
        }
      }
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            a: {
              version: '1.0.0',
              dependencies: {
                b: {
                  version: '1.0.0',
                  dependencies: {
                    a: { version: '1.0.0' }
                  }
                }
              }
            }
          }
        },
        'should print json output containing deduped ref'
      )
      t.end()
    })
  })

  t.test('using aliases', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          a: 'npm:b@1.0.0'
        }
      }),
      node_modules: {
        'a': {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1.0.0',
            _from: 'a@npm:b',
            _resolved: 'https://localhost:8080/abbrev/-/abbrev-1.1.1.tgz',
            _requested: {
              type: 'alias'
            }
          })
        }
      }
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            a: {
              version: '1.0.0',
              from: 'a@npm:b',
              resolved: 'https://localhost:8080/abbrev/-/abbrev-1.1.1.tgz'
            }
          }
        },
        'should output json containing aliases'
      )
      t.end()
    })
  })

  t.test('resolved points to git ref', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'abbrev': 'git+https://github.com/isaacs/abbrev-js.git'
        }
      }),
      node_modules: {
        'abbrev': {
          'package.json': JSON.stringify({
            name: 'abbrev',
            version: '1.1.1',
            _id: 'abbrev@1.1.1',
            _from: 'git+https://github.com/isaacs/abbrev-js.git',
            _resolved: 'git+https://github.com/isaacs/abbrev-js.git#b8f3a2fc0c3bb8ffd8b0d0072cc6b5a3667e963c',
            _requested: {
              type: 'git',
              raw: 'git+https:github.com/isaacs/abbrev-js.git',
              rawSpec: 'git+https:github.com/isaacs/abbrev-js.git',
              saveSpec: 'git+https://github.com/isaacs/abbrev-js.git',
              fetchSpec: 'https://github.com/isaacs/abbrev-js.git',
              gitCommittish: null
            }
          })
        }
      }
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            abbrev: {
              version: '1.1.1',
              from: 'git+https://github.com/isaacs/abbrev-js.git',
              resolved: 'git+https://github.com/isaacs/abbrev-js.git#b8f3a2fc0c3bb8ffd8b0d0072cc6b5a3667e963c'
            }
          }
        },
        'should output json containing git refs'
      )
      t.end()
    })
  })

  t.test('from and resolved properties', (t) => {
    prefix = t.testdir({
      'package.json': JSON.stringify({
        name: 'test-npm-ls',
        version: '1.0.0',
        dependencies: {
          'simple-output': '^2.0.0'
        }
      }),
      node_modules: {
        'simple-output': {
          'package.json': JSON.stringify({
            name: 'simple-output',
            version: '2.1.1',
            _from: 'simple-output',
            _id: 'simple-output@2.1.1',
            _resolved: 'https://registry.npmjs.org/simple-output/-/simple-output-2.1.1.tgz',
            _requested: {
              type: 'tag',
              registry: true,
              raw: 'simple-output',
              name: 'simple-output',
              escapedName: 'simple-output',
              rawSpec: '',
              saveSpec: null,
              fetchSpec: 'latest'
            },
            _requiredBy: [
              '#USER',
              '/'
            ],
            _shasum: '3c07708ec9ef3e3c985cf0ddd67df09ab8ec2abc',
            _spec: 'simple-output'
          })
        }
      }
    })
    ls([], () => {
      t.deepEqual(
        jsonParse(result),
        {
          name: 'test-npm-ls',
          version: '1.0.0',
          dependencies: {
            'simple-output': {
              version: '2.1.1',
              from: 'simple-output',
              resolved: 'https://registry.npmjs.org/simple-output/-/simple-output-2.1.1.tgz'
            }
          }
        },
        'should be printed in json output'
      )
      t.end()
    })
  })

  t.end()
})
