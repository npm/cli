'use strict'

const fs = require('fs')
const path = require('path')
const { exec, execSync } = require('child_process')

const { test } = require('tap')
const bin = require.resolve('../../bin/npm-cli.js')
const isWindows = require('../../lib/utils/is-windows.js')

const version = '1.0.0'
const funding = {
  type: 'individual',
  url: 'http://example.com/donate'
}

const maintainerOwnsAllDeps = {
  'package.json': JSON.stringify({
    name: 'maintainer-owns-all-deps',
    version,
    funding,
    dependencies: {
      'dep-foo': '*',
      'dep-bar': '*'
    }
  }),
  node_modules: {
    'dep-foo': {
      'package.json': JSON.stringify({
        name: 'dep-foo',
        version,
        funding,
        dependencies: {
          'dep-sub-foo': '*'
        }
      }),
      node_modules: {
        'dep-sub-foo': {
          'package.json': JSON.stringify({
            name: 'dep-sub-foo',
            version,
            funding
          })
        }
      }
    },
    'dep-bar': {
      'package.json': JSON.stringify({
        name: 'dep-bar',
        version,
        funding
      })
    }
  }
}

const nestedNoFundingPackages = {
  'package.json': JSON.stringify({
    name: 'nested-no-funding-packages',
    version,
    dependencies: {
      foo: '*'
    },
    devDependencies: {
      lorem: '*'
    }
  }),
  node_modules: {
    foo: {
      'package.json': JSON.stringify({
        name: 'foo',
        version,
        dependencies: {
          bar: '*'
        }
      }),
      node_modules: {
        bar: {
          'package.json': JSON.stringify({
            name: 'bar',
            version,
            funding
          }),
          node_modules: {
            'sub-bar': {
              'package.json': JSON.stringify({
                name: 'sub-bar',
                version,
                funding: 'https://example.com/sponsor'
              })
            }
          }
        }
      }
    },
    lorem: {
      'package.json': JSON.stringify({
        name: 'lorem',
        version,
        funding: {
          url: 'https://example.com/lorem'
        }
      })
    }
  }
}

const nestedMultipleFundingPackages = {
  'package.json': JSON.stringify({
    name: 'nested-multiple-funding-packages',
    version,
    funding: [
      'https://one.example.com',
      'https://two.example.com'
    ],
    dependencies: {
      foo: '*'
    },
    devDependencies: {
      bar: '*'
    }
  }),
  node_modules: {
    foo: {
      'package.json': JSON.stringify({
        name: 'foo',
        version,
        funding: [
          'http://example.com',
          { url: 'http://sponsors.example.com/me' },
          'http://collective.example.com'
        ]
      })
    },
    bar: {
      'package.json': JSON.stringify({
        name: 'bar',
        version,
        funding: [
          'http://collective.example.com',
          { url: 'http://sponsors.example.com/you' }
        ]
      })
    }
  }
}

const conflictingFundingPackages = {
  'package.json': JSON.stringify({
    name: 'conflicting-funding-packages',
    version,
    dependencies: {
      foo: '1.0.0'
    },
    devDependencies: {
      bar: '1.0.0'
    }
  }),
  node_modules: {
    foo: {
      'package.json': JSON.stringify({
        name: 'foo',
        version: '1.0.0',
        funding: 'http://example.com/1'
      })
    },
    bar: {
      node_modules: {
        foo: {
          'package.json': JSON.stringify({
            name: 'foo',
            version: '2.0.0',
            funding: 'http://example.com/2'
          })
        }
      },
      'package.json': JSON.stringify({
        name: 'bar',
        version: '1.0.0',
        dependencies: {
          foo: '2.0.0'
        }
      })
    }
  }
}

test('fund with no package containing funding', t => {
  const cwd = t.testdir({
    'package.json': JSON.stringify({
      name: 'no-funding-package',
      version: '0.0.0'
    })
  })
  const stdout = execSync(
    `${process.execPath} ${bin} fund --unicode=false`,
    { cwd }
  )
  t.matchSnapshot(stdout.toString(), 'should print empty funding info')
  t.end()
})

test('fund in which same maintainer owns all its deps', t => {
  const cwd = t.testdir(maintainerOwnsAllDeps)
  const stdout = execSync(
    `${process.execPath} ${bin} fund --unicode=false`,
    { cwd }
  )
  t.matchSnapshot(stdout.toString(), 'should print stack packages together')
  t.end()
})

test('fund in which same maintainer owns all its deps, using --json option', t => {
  const cwd = t.testdir(maintainerOwnsAllDeps)
  const stdout = execSync(
    `${process.execPath} ${bin} fund --json`,
    { cwd }
  )
  t.deepEqual(
    JSON.parse(stdout.toString()),
    {
      length: 3,
      name: 'maintainer-owns-all-deps',
      version: '1.0.0',
      funding: { type: 'individual', url: 'http://example.com/donate' },
      dependencies: {
        'dep-bar': {
          version: '1.0.0',
          funding: { type: 'individual', url: 'http://example.com/donate' }
        },
        'dep-foo': {
          version: '1.0.0',
          funding: { type: 'individual', url: 'http://example.com/donate' },
          dependencies: {
            'dep-sub-foo': {
              version: '1.0.0',
              funding: { type: 'individual', url: 'http://example.com/donate' }
            }
          }
        }
      }
    },
    'should print stack packages together'
  )
  t.end()
})

test('fund containing multi-level nested deps with no funding', t => {
  const cwd = t.testdir(nestedNoFundingPackages)
  const stdout = execSync(
    `${process.execPath} ${bin} fund --unicode=false`,
    { cwd }
  )
  t.matchSnapshot(
    stdout.toString(),
    'should omit dependencies with no funding declared'
  )
  t.end()
})

test('fund containing multi-level nested deps with no funding, using --json option', t => {
  const cwd = t.testdir(nestedNoFundingPackages)
  const stdout = execSync(
    `${process.execPath} ${bin} fund --json`,
    { cwd }
  )
  t.deepEqual(
    JSON.parse(stdout.toString()),
    {
      length: 2,
      name: 'nested-no-funding-packages',
      version: '1.0.0',
      dependencies: {
        lorem: {
          version: '1.0.0',
          funding: { url: 'https://example.com/lorem' }
        },
        bar: {
          version: '1.0.0',
          funding: { type: 'individual', url: 'http://example.com/donate' }
        }
      }
    },
    'should omit dependencies with no funding declared in json output'
  )
  t.end()
})

test('fund containing multi-level nested deps with no funding, using --json option', t => {
  const cwd = t.testdir(nestedMultipleFundingPackages)
  const stdout = execSync(
    `${process.execPath} ${bin} fund --json`,
    { cwd }
  )
  t.deepEqual(
    JSON.parse(stdout.toString()),
    {
      length: 2,
      name: 'nested-multiple-funding-packages',
      version: '1.0.0',
      funding: [
        {
          url: 'https://one.example.com'
        },
        {
          url: 'https://two.example.com'
        }
      ],
      dependencies: {
        bar: {
          version: '1.0.0',
          funding: [
            {
              url: 'http://collective.example.com'
            },
            {
              url: 'http://sponsors.example.com/you'
            }
          ]
        },
        foo: {
          version: '1.0.0',
          funding: [
            {
              url: 'http://example.com'
            },
            {
              url: 'http://sponsors.example.com/me'
            },
            {
              url: 'http://collective.example.com'
            }
          ]
        }
      }
    },
    'should list multiple funding entries in json output'
  )
  t.end()
})

test('fund does not support global', t => {
  t.plan(1)
  try {
    execSync(`${process.execPath} ${bin} fund --global`, { stdio: 'pipe' })
  } catch (err) {
    t.match(
      err.toString(),
      'code EFUNDGLOBAL',
      'should throw EFUNDGLOBAL error'
    )
  }
})

test('fund using package argument with no browser', t => {
  const cwd = t.testdir(maintainerOwnsAllDeps)
  const stdout = execSync(
    `${process.execPath} ${bin} fund . --no-browser`,
    { cwd }
  )
  t.matchSnapshot(stdout.toString(), 'should open funding url')
  t.end()
})

test('fund does not support global, using --json option', t => {
  exec(
    `${process.execPath} ${bin} fund --global --json`,
    (_, stdout) => {
      t.deepEqual(
        JSON.parse(stdout.toString()),
        {
          error: {
            code: 'EFUNDGLOBAL',
            summary: '`npm fund` does not support global packages',
            detail: ''
          }
        },
        'should throw EFUNDGLOBAL error using json output'
      )
      t.end()
    }
  )
})

test('fund using string shorthand', t => {
  const cwd = t.testdir({
    'package.json': JSON.stringify({
      name: 'funding-string-shorthand',
      version: '0.0.0',
      funding: 'https://example.com/sponsor'
    })
  })
  const stdout = execSync(
    `${process.execPath} ${bin} fund . --no-browser`,
    { cwd }
  )
  t.matchSnapshot(stdout.toString(), 'should open string-only url')
  t.end()
})

test('fund using nested packages with multiple sources', t => {
  const cwd = t.testdir(nestedMultipleFundingPackages)
  const stdout = execSync(
    `${process.execPath} ${bin} fund .`,
    { cwd }
  )
  t.matchSnapshot(stdout.toString(), 'should prompt with all available URLs')
  t.end()
})

test('fund using symlink ref', t => {
  const cwd = t.testdir({
    'package.json': JSON.stringify({
      name: 'using-symlink-ref',
      version: '1.0.0'
    }),
    'a': {
      'package.json': JSON.stringify({
        name: 'a',
        version: '1.0.0',
        funding: 'http://example.com/a'
      })
    },
    node_modules: {
      a: t.fixture('symlink', '../a')
    }
  })

  // using symlinked ref
  t.match(
    execSync(
      `${process.execPath} ${bin} fund ./node_modules/a --no-browser`,
      { cwd }
    ).toString(),
    'http://example.com/a',
    'should retrieve funding url from symlink'
  )

  // using target ref
  t.match(
    execSync(
      `${process.execPath} ${bin} fund ./a --no-browser`,
      { cwd }
    ).toString(),
    'http://example.com/a',
    'should retrieve funding url from symlink target'
  )

  t.end()
})

test('fund using data from actual tree', t => {
  const cwd = t.testdir({
    'package.json': JSON.stringify({
      name: 'using-actual-tree',
      version: '1.0.0'
    }),
    node_modules: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          funding: 'http://example.com/a'
        })
      },
      b: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          funding: 'http://example.com/b'
        }),
        node_modules: {
          a: {
            'package.json': JSON.stringify({
              name: 'a',
              version: '1.0.1',
              funding: 'http://example.com/_AAA'
            })
          }
        }
      }
    }
  })

  // using symlinked ref
  t.match(
    execSync(
      `${process.execPath} ${bin} fund a --no-browser`,
      { cwd }
    ).toString(),
    'http://example.com/_AAA',
    'should retrieve fund info from actual tree, using greatest version found'
  )

  t.end()
})

test('fund using nested packages with multiple sources, with a source number', t => {
  const cwd = t.testdir(nestedMultipleFundingPackages)
  const stdout = execSync(
    `${process.execPath} ${bin} fund . --which=1 --no-browser`,
    { cwd }
  )
  t.matchSnapshot(stdout.toString(), 'should open the numbered URL')
  t.end()
})

test('fund using pkg name while having conflicting versions', t => {
  const cwd = t.testdir(conflictingFundingPackages)
  const stdout = execSync(
    `${process.execPath} ${bin} fund foo --which=1 --no-browser`,
    { cwd }
  )
  t.matchSnapshot(stdout.toString(), 'should open greatest version')
  t.end()
})

test('fund using package argument with no browser, using --json option', t => {
  const cwd = t.testdir(maintainerOwnsAllDeps)
  const stdout = execSync(
    `${process.execPath} ${bin} fund . --json --no-browser`,
    { cwd }
  )
  t.deepEqual(
    JSON.parse(stdout.toString()),
    {
      title: 'individual funding available at the following URL',
      url: 'http://example.com/donate'
    },
    'should open funding url using json output'
  )
  t.end()
})

if (!isWindows) {
  test('mock browser using package name argument', function (t) {
    const cwd = t.testdir(maintainerOwnsAllDeps)
    const fakeBrowser = path.join(cwd, '_script.sh')
    const outFile = path.join(cwd, '_output')

    const s = `#!/usr/bin/env bash\necho "$@" > ${outFile}\n`
    fs.writeFileSync(fakeBrowser, s)
    fs.chmodSync(fakeBrowser, '0755')

    execSync(
      `${process.execPath} ${bin} fund . --loglevel=silent --browser=${fakeBrowser}`,
      { cwd }
    )
    var res = fs.readFileSync(outFile, 'utf8')
    t.equal(res, 'http://example.com/donate\n')
    t.end()
  })
}
