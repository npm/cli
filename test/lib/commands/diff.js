const t = require('tap')
const { resolve, join, extname } = require('path')
const MockRegistry = require('@npmcli/mock-registry')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')

const jsonifyTestdir = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    if (extname(key) === '.json') {
      obj[key] = JSON.stringify(value, null, 2) + '\n'
    } else if (typeof value === 'object') {
      obj[key] = jsonifyTestdir(value)
    } else {
      obj[key] = value.trim() + '\n'
    }
  }
  return obj
}

// generic helper to call diff with a specified dir contents and registry calls
const mockDiff = async (t, {
  exec,
  diff = [],
  tarballs = {},
  times = {},
  ...opts
} = {}) => {
  const tarballFixtures = Object.entries(tarballs).reduce((acc, [spec, fixture]) => {
    const [name, version] = spec.split('@')
    acc[name] = acc[name] || {}
    acc[name][version] = fixture
    if (!acc[name][version]['package.json']) {
      acc[name][version]['package.json'] = { name, version }
    } else {
      acc[name][version]['package.json'].name = name
      acc[name][version]['package.json'].version = version
    }
    return acc
  }, {})

  const { npm, ...res } = await loadMockNpm(t, {
    argv: [].concat(diff).reduce((acc, d) => acc.concat(['--diff', d]), []),
    prefixDir: jsonifyTestdir(opts.prefixDir || {}),
    otherDirs: jsonifyTestdir({ tarballs: tarballFixtures }),
    globalPrefixDir: jsonifyTestdir(opts.globalPrefixDir || {}),
    ...opts,
  })

  const registry = new MockRegistry({
    tap: t,
    registry: npm.config.get('registry'),
    strict: true,
    debug: true,
  })

  const manifests = Object.entries(tarballFixtures).reduce((acc, [name, versions]) => {
    acc[name] = registry.manifest({
      name,
      packuments: Object.keys(versions).map((version) => ({ version })),
    })
    return acc
  }, {})

  for (const [name, manifest] of Object.entries(manifests)) {
    await registry.package({ manifest, times: times[name] ?? 1 })
    for (const [version, tarballManifest] of Object.entries(manifest.versions)) {
      await registry.tarball({
        manifest: tarballManifest,
        tarball: join(res.other, 'tarballs', name, version),
      })
    }
  }

  if (exec) {
    await npm.exec('diff', exec)
    res.output = res.joinedOutput()
  }

  return { npm, registry, ...res }
}

// a more specific helper to call diff against a local package and a registry package
// and assert the diff output contains the matching strings
const assertFoo = async (t, arg) => {
  let diff = []
  let exec = []

  if (typeof arg === 'string' || Array.isArray(arg)) {
    diff = arg
  } else if (arg && typeof arg === 'object') {
    diff = arg.diff
    exec = arg.exec
  }

  const { output } = await mockDiff(t, {
    diff,
    prefixDir: {
      'package.json': { name: 'foo', version: '1.0.0' },
      'index.js': 'const version = "1.0.0"',
      'a.js': 'const a = "a@1.0.0"',
      'b.js': 'const b = "b@1.0.0"',
    },
    tarballs: {
      'foo@0.1.0': {
        'index.js': 'const version = "0.1.0"',
        'a.js': 'const a = "a@0.1.0"',
        'b.js': 'const b = "b@0.1.0"',
      },
    },
    exec,
  })

  const hasFile = (f) => !exec.length || exec.some(e => e.endsWith(f))

  if (hasFile('package.json')) {
    t.match(output, /-\s*"version": "0\.1\.0"/)
    t.match(output, /\+\s*"version": "1\.0\.0"/)
  }

  if (hasFile('index.js')) {
    t.match(output, /-\s*const version = "0\.1\.0"/)
    t.match(output, /\+\s*const version = "1\.0\.0"/)
  }

  if (hasFile('a.js')) {
    t.match(output, /-\s*const a = "a@0\.1\.0"/)
    t.match(output, /\+\s*const a = "a@1\.0\.0"/)
  }

  if (hasFile('b.js')) {
    t.match(output, /-\s*const b = "b@0\.1\.0"/)
    t.match(output, /\+\s*const b = "b@1\.0\.0"/)
  }

  return output
}

const rejectDiff = async (t, msg, opts) => {
  const { npm } = await mockDiff(t, opts)
  await t.rejects(npm.exec('diff', []), msg)
}

t.test('no args', async t => {
  t.test('in a project dir', async t => {
    const output = await assertFoo(t)
    t.matchSnapshot(output)
  })

  t.test('no args, missing package.json name in cwd', async t => {
    await rejectDiff(t, /Needs multiple arguments to compare or run from a project dir./)
  })

  t.test('no args, bad package.json in cwd', async t => {
    await rejectDiff(t, /Needs multiple arguments to compare or run from a project dir./, {
      prefixDir: { 'package.json': '{invalid"json' },
    })
  })
})

t.test('single arg', async t => {
  t.test('spec using cwd package name', async t => {
    await assertFoo(t, 'foo@0.1.0')
  })

  t.test('unknown spec, no package.json', async t => {
    await rejectDiff(t, /Needs multiple arguments to compare or run from a project dir./, {
      diff: ['foo@1.0.0'],
    })
  })

  t.test('spec using semver range', async t => {
    await assertFoo(t, 'foo@~0.1.0')
  })

  t.test('version', async t => {
    await assertFoo(t, '0.1.0')
  })

  t.test('version, no package.json', async t => {
    await rejectDiff(t, /Needs multiple arguments to compare or run from a project dir./, {
      diff: ['0.1.0'],
    })
  })

  t.test('version, filtering by files', async t => {
    const output = await assertFoo(t, { diff: '0.1.0', exec: ['./a.js', './b.js'] })
    t.matchSnapshot(output)
  })

  t.test('spec is not a dep', async t => {
    const { output } = await mockDiff(t, {
      diff: 'bar@1.0.0',
      prefixDir: {
        node_modules: {},
        'package.json': { name: 'my-project', version: '1.0.0' },
      },
      tarballs: {
        'bar@1.0.0': {},
      },
      exec: [],
    })

    t.match(output, /-\s*"name": "bar"/)
    t.match(output, /\+\s*"name": "my-project"/)
  })

  t.test('unknown package name', async t => {
    const { npm, registry } = await mockDiff(t, {
      diff: 'bar',
      prefixDir: {
        'package.json': {
          name: 'my-project',
          dependencies: {
            bar: '^1.0.0',
          },
        },
      },
    })
    registry.getPackage('bar', { times: 2, code: 404 })
    t.rejects(npm.exec('diff', []), /404 Not Found.*bar/)
  })

  t.test('unknown package name, no package.json', async t => {
    const { npm } = await mockDiff(t, {
      diff: 'bar',
    })
    t.rejects(npm.exec('diff', []),
      /Needs multiple arguments to compare or run from a project dir./)
  })

  t.test('transform single direct dep name into spec comparison', async t => {
    const { output } = await mockDiff(t, {
      diff: 'bar',
      prefixDir: {
        node_modules: {
          bar: {
            'package.json': {
              name: 'bar',
              version: '1.0.0',
            },
          },
        },
        'package.json': {
          name: 'my-project',
          dependencies: {
            bar: '^1.0.0',
          },
        },
      },
      tarballs: {
        'bar@1.8.0': {},
      },
      times: { bar: 2 },
      exec: [],
    })

    t.match(output, /-\s*"version": "1\.0\.0"/)
    t.match(output, /\+\s*"version": "1\.8\.0"/)
  })

  t.test('global space, transform single direct dep name', async t => {
    const { output } = await mockDiff(t, {
      diff: 'lorem',
      config: {
        global: true,
      },
      globalPrefixDir: {
        lib: {
          node_modules: {
            lorem: {
              'package.json': {
                name: 'lorem',
                version: '2.0.0',
              },
            },
          },
        },
      },
      prefixDir: {
        node_modules: {
          lorem: {
            'package.json': {
              name: 'lorem',
              version: '3.0.0',
            },
          },
        },
        'package.json': {
          name: 'my-project',
          dependencies: {
            lorem: '^3.0.0',
          },
        },
      },
      tarballs: {
        'lorem@1.0.0': {},
      },
      times: {
        lorem: 2,
      },
      exec: [],
    })

    t.match(output, 'lorem')
    t.match(output, /-\s*"version": "2\.0\.0"/)
    t.match(output, /\+\s*"version": "1\.0\.0"/)
  })

  t.test('transform single spec into spec comparison', async t => {
    const { output } = await mockDiff(t, {
      diff: 'bar@2.0.0',
      prefixDir: {
        node_modules: {
          bar: {
            'package.json': {
              name: 'bar',
              version: '1.0.0',
            },
          },
        },
        'package.json': {
          name: 'my-project',
          dependencies: {
            bar: '^1.0.0',
          },
        },
      },
      tarballs: {
        'bar@2.0.0': {},
      },
      times: {
        lorem: 2,
      },
      exec: [],
    })

    t.match(output, 'bar')
    t.match(output, /-\s*"version": "1\.0\.0"/)
    t.match(output, /\+\s*"version": "2\.0\.0"/)
  })

  t.test('transform single spec from transitive deps', async t => {
    const { output } = await mockDiff(t, {
      diff: 'lorem',
      prefixDir: {
        node_modules: {
          bar: {
            'package.json': {
              name: 'bar',
              version: '1.0.0',
              dependencies: {
                lorem: '^2.0.0',
              },
            },
          },
          lorem: {
            'package.json': {
              name: 'lorem',
              version: '2.0.0',
            },
          },
        },
        'package.json': {
          name: 'my-project',
          dependencies: {
            bar: '^1.0.0',
          },
        },
      },
      tarballs: {
        'lorem@2.2.2': {},
      },
      times: {
        lorem: 2,
      },
      exec: [],
    })

    t.match(output, 'lorem')
    t.match(output, /-\s*"version": "2\.0\.0"/)
    t.match(output, /\+\s*"version": "2\.2\.2"/)
  })

  t.test('missing actual tree', async t => {
    const { output } = await mockDiff(t, {
      diff: 'lorem',
      prefixDir: {
        'package.json': {
          name: 'lorem',
          version: '2.0.0',
        },
      },
      mocks: {
        '@npmcli/arborist': class {
          constructor () {
            throw new Error('ERR')
          }
        },
      },
      tarballs: {
        'lorem@2.2.2': {},
      },
      exec: [],
    })

    t.match(output, 'lorem')
    t.match(output, /-\s*"version": "2\.2\.2"/)
    t.match(output, /\+\s*"version": "2\.0\.0"/)
  })

  // t.test('unknown package name', async t => {
  //   const path = t.testdir({
  //     'package.json': { version: '1.0.0' },
  //   })
  //   libnpmdiff = async ([a, b], opts) => {
  //     t.equal(a, 'bar@*', 'should target any version of pkg name')
  //     t.equal(b, `file:${path}`, 'should compare to cwd')
  //   }

  //   config.diff = ['bar']
  //   npm.prefix = path

  //   await npm.exec('diff', [])
  // })

  // t.test('use project name in project dir', async t => {
  //   libnpmdiff = async ([a, b], opts) => {
  //     t.equal(a, 'foo@*', 'should target any version of pkg name')
  //     t.equal(b, `file:${fooPath}`, 'should compare to cwd')
  //   }

  //   config.diff = ['foo']
  //   await npm.exec('diff', [])
  // })

  // t.test('dir spec type', async t => {
  //   const otherPath = resolve('/path/to/other-dir')
  //   libnpmdiff = async ([a, b], opts) => {
  //     t.equal(a, `file:${otherPath}`, 'should target dir')
  //     t.equal(b, `file:${fooPath}`, 'should compare to cwd')
  //   }

  //   config.diff = [otherPath]
  //   await npm.exec('diff', [])
  // })

  // t.test('unsupported spec type', async t => {
  //   config.diff = ['git+https://github.com/user/foo']
  //   await t.rejects(
  //     npm.exec('diff', []),
  //     /Spec type git not supported./,
  //     'should throw spec type not supported error.'
  //   )
  // })
})

t.test('first arg is a qualified spec', async t => {
  t.test('second arg is ALSO a qualified spec', async t => {
    const { output } = await mockDiff(t, {
      diff: ['bar@1.0.0', 'bar@^2.0.0'],
      tarballs: {
        'bar@1.0.0': {},
        'bar@2.2.2': {},
      },
      times: {
        bar: 2,
      },
      exec: [],
    })

    t.match(output, 'bar')
    t.match(output, /-\s*"version": "1\.0\.0"/)
    t.match(output, /\+\s*"version": "2\.2\.2"/)
  })

  t.test('second arg is a known dependency name', async t => {
    const { output } = await mockDiff(t, {
      prefixDir: {
        node_modules: {
          bar: {
            'package.json': {
              name: 'bar',
              version: '1.0.0',
            },
          },
        },
        'package.json': {
          name: 'my-project',
          dependencies: {
            bar: '^1.0.0',
          },
        },
      },
      tarballs: {
        'bar@2.0.0': {},
      },
      diff: ['bar@2.0.0', 'bar'],
      exec: [],
    })

    t.match(output, 'bar')
    t.match(output, /-\s*"version": "2\.0\.0"/)
    t.match(output, /\+\s*"version": "1\.0\.0"/)
  })

  t.test('second arg is a valid semver version', async t => {
    const { output } = await mockDiff(t, {
      tarballs: {
        'bar@1.0.0': {},
        'bar@2.0.0': {},
      },
      times: {
        bar: 2,
      },
      diff: ['bar@1.0.0', '2.0.0'],
      exec: [],
    })

    t.match(output, 'bar')
    t.match(output, /-\s*"version": "1\.0\.0"/)
    t.match(output, /\+\s*"version": "2\.0\.0"/)
  })

  t.test('second arg is an unknown dependency name', async t => {
    const { output } = await mockDiff(t, {
      tarballs: {
        'bar@1.0.0': {},
        'bar-fork@2.0.0': {},
      },
      diff: ['bar@1.0.0', 'bar-fork'],
      exec: [],
    })

    t.match(output, /-\s*"name": "bar"/)
    t.match(output, /\+\s*"name": "bar-fork"/)

    t.match(output, /-\s*"version": "1\.0\.0"/)
    t.match(output, /\+\s*"version": "2\.0\.0"/)
  })
})

t.test('first arg is a known dependency name', async t => {
  t.test('second arg is a qualified spec', async t => {
    const path = t.testdir({
      node_modules: {
        bar: {
          'package.json': {
            name: 'bar',
            version: '1.0.0',
          },
        },
      },
      'package.json': {
        name: 'my-project',
        dependencies: {
          bar: '^1.0.0',
        },
      },
    })

    libnpmdiff = async ([a, b], opts) => {
      t.equal(
        a,
        `bar@file:${resolve(path, 'node_modules/bar')}`,
        'should target local node_modules pkg'
      )
      t.equal(b, 'bar@2.0.0', 'should set expected second spec')
    }

    npm.prefix = path
    config.diff = ['bar', 'bar@2.0.0']
    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })

  t.test('second arg is ALSO a known dependency', async t => {
    const path = t.testdir({
      node_modules: {
        bar: {
          'package.json': {
            name: 'bar',
            version: '1.0.0',
          },
        },
        'bar-fork': {
          'package.json': {
            name: 'bar-fork',
            version: '1.0.0',
          },
        },
      },
      'package.json': {
        name: 'my-project',
        dependencies: {
          bar: '^1.0.0',
        },
      },
    })

    libnpmdiff = async ([a, b], opts) => {
      t.equal(
        a,
        `bar@file:${resolve(path, 'node_modules/bar')}`,
        'should target local node_modules pkg'
      )
      t.equal(
        b,
        `bar-fork@file:${resolve(path, 'node_modules/bar-fork')}`,
        'should target fork local node_modules pkg'
      )
    }

    npm.prefix = path
    config.diff = ['bar', 'bar-fork']
    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })

  t.test('second arg is a valid semver version', async t => {
    const path = t.testdir({
      node_modules: {
        bar: {
          'package.json': {
            name: 'bar',
            version: '1.0.0',
          },
        },
      },
      'package.json': {
        name: 'my-project',
        dependencies: {
          bar: '^1.0.0',
        },
      },
    })

    libnpmdiff = async ([a, b], opts) => {
      t.equal(
        a,
        `bar@file:${resolve(path, 'node_modules/bar')}`,
        'should target local node_modules pkg'
      )
      t.equal(b, 'bar@2.0.0', 'should use package name from first arg')
    }

    npm.prefix = path
    config.diff = ['bar', '2.0.0']
    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })

  t.test('second arg is an unknown dependency name', async t => {
    const path = t.testdir({
      node_modules: {
        bar: {
          'package.json': {
            name: 'bar',
            version: '1.0.0',
          },
        },
      },
      'package.json': {
        name: 'my-project',
        dependencies: {
          bar: '^1.0.0',
        },
      },
    })

    libnpmdiff = async ([a, b], opts) => {
      t.equal(
        a,
        `bar@file:${resolve(path, 'node_modules/bar')}`,
        'should target local node_modules pkg'
      )
      t.equal(b, 'bar-fork@*', 'should set expected second spec')
    }

    npm.prefix = path
    config.diff = ['bar', 'bar-fork']
    await npm.exec('diff', [])
  })
})

t.test('first arg is a valid semver range', async t => {
  t.test('second arg is a qualified spec', async t => {
    config.diff = ['1.0.0', 'bar@2.0.0']

    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar@1.0.0', 'should use name from second arg')
      t.equal(b, 'bar@2.0.0', 'should use expected spec')
    }

    await npm.exec('diff', [])
  })

  t.test('second arg is a known dependency', async t => {
    const path = t.testdir({
      node_modules: {
        bar: {
          'package.json': {
            name: 'bar',
            version: '2.0.0',
          },
        },
      },
      'package.json': {
        name: 'my-project',
        dependencies: {
          bar: '^1.0.0',
        },
      },
    })

    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar@1.0.0', 'should use name from second arg')
      t.equal(
        b,
        `bar@file:${resolve(path, 'node_modules/bar')}`,
        'should set expected second spec from nm'
      )
    }

    npm.prefix = path
    config.diff = ['1.0.0', 'bar']
    await npm.exec('diff', [])
  })

  t.test('second arg is ALSO a semver version', async t => {
    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'foo@1.0.0', 'should use name from project dir')
      t.equal(b, 'foo@2.0.0', 'should use name from project dir')
    }

    config.diff = ['1.0.0', '2.0.0']
    await npm.exec('diff', [])
  })

  t.test('second arg is ALSO a semver version BUT cwd not a project dir', async t => {
    const path = t.testdir({})
    config.diff = ['1.0.0', '2.0.0']
    npm.prefix = path
    await t.rejects(
      npm.exec('diff', []),
      /Needs to be run from a project dir in order to diff two versions./,
      'should throw two versions need project dir error usage msg'
    )
  })

  t.test('second arg is an unknown dependency name', async t => {
    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar@1.0.0', 'should use name from second arg')
      t.equal(b, 'bar@*', 'should compare against any version')
    }

    config.diff = ['1.0.0', 'bar']
    await npm.exec('diff', [])
  })

  t.test('second arg is a qualified spec, missing actual tree', async t => {
    const path = t.testdir({
      'package.json': {
        name: 'my-project',
      },
    })

    const Diff = t.mock('../../../lib/commands/diff.js', {
      ...mocks,
      '@npmcli/arborist': class {
        constructor () {
          throw new Error('ERR')
        }
      },
      libnpmdiff: async ([a, b], opts) => {
        t.equal(a, 'lorem@1.0.0', 'should target latest version of pkg name')
        t.equal(b, 'lorem@2.0.0', 'should target expected spec')
      },
    })
    const diff = new Diff(npm)

    config.diff = ['1.0.0', 'lorem@2.0.0']
    npm.prefix = path

    await npm.exec('diff', [])
  })
})

t.test('first arg is an unknown dependency name', async t => {
  t.test('second arg is a qualified spec', async t => {
    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar@*', 'should set expected first spec')
      t.equal(b, 'bar@2.0.0', 'should set expected second spec')
      t.match(opts, npm.flatOptions, 'should forward flat options')
      t.match(opts, { where: fooPath }, 'should forward pacote options')
    }

    config.diff = ['bar', 'bar@2.0.0']
    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })

  t.test('second arg is a known dependency', async t => {
    const path = t.testdir({
      node_modules: {
        bar: {
          'package.json': {
            name: 'bar',
            version: '2.0.0',
          },
        },
      },
      'package.json': {
        name: 'my-project',
        dependencies: {
          bar: '^1.0.0',
        },
      },
    })

    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar-fork@*', 'should use any version')
      t.equal(
        b,
        `bar@file:${resolve(path, 'node_modules/bar')}`,
        'should target local node_modules pkg'
      )
    }

    npm.prefix = path
    config.diff = ['bar-fork', 'bar']
    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })

  t.test('second arg is a valid semver version', async t => {
    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar@*', 'should use any version')
      t.equal(b, 'bar@^1.0.0', 'should use name from first arg')
    }

    config.diff = ['bar', '^1.0.0']
    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })

  t.test('second arg is ALSO an unknown dependency name', async t => {
    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar@*', 'should use any version')
      t.equal(b, 'bar-fork@*', 'should use any version')
    }

    config.diff = ['bar', 'bar-fork']
    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })

  t.test('cwd not a project dir', async t => {
    const path = t.testdir({})
    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'bar@*', 'should use any version')
      t.equal(b, 'bar-fork@*', 'should use any version')
    }

    config.diff = ['bar', 'bar-fork']
    npm.prefix = path

    npm.exec('diff', [], err => {
      if (err) {
        throw err
      }
    })
  })
})

t.test('various options', async t => {
  t.test('using --name-only option', async t => {
    flatOptions.diffNameOnly = true

    libnpmdiff = async ([a, b], opts) => {
      t.match(
        opts,
        {
          ...npm.flatOptions,
          diffNameOnly: true,
        },
        'should forward nameOnly=true option'
      )
    }

    await npm.exec('diff', [])
  })

  t.test('set files after both versions', async t => {
    config.diff = ['2.1.4', '3.0.0']

    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'foo@2.1.4', 'should use expected spec')
      t.equal(b, 'foo@3.0.0', 'should use expected spec')
      t.match(
        opts,
        {
          ...npm.flatOptions,
          diffFiles: ['./foo.js', './bar.js'],
        },
        'should forward diffFiles values'
      )
    }

    await npm.exec('diff', ['./foo.js', './bar.js'])
  })

  t.test('set files no diff args', async t => {
    libnpmdiff = async ([a, b], opts) => {
      t.equal(a, 'foo@latest', 'should have default spec')
      t.equal(b, `file:${fooPath}`, 'should compare to cwd')
      t.match(
        opts,
        {
          ...npm.flatOptions,
          diffFiles: ['./foo.js', './bar.js'],
        },
        'should forward all remaining items as filenames'
      )
    }

    await npm.exec('diff', ['./foo.js', './bar.js'])
  })

  t.test('using diff option', async t => {
    flatOptions.diffContext = 5
    flatOptions.diffIgnoreWhitespace = true
    flatOptions.diffNoPrefix = false
    flatOptions.diffSrcPrefix = 'foo/'
    flatOptions.diffDstPrefix = 'bar/'
    flatOptions.diffText = true

    libnpmdiff = async ([a, b], opts) => {
      t.match(
        opts,
        {
          ...npm.flatOptions,
          diffContext: 5,
          diffIgnoreWhitespace: true,
          diffNoPrefix: false,
          diffSrcPrefix: 'foo/',
          diffDstPrefix: 'bar/',
          diffText: true,
        },
        'should forward diff options'
      )
    }

    await npm.exec('diff', [])
  })
})

t.test('too many args', async t => {
  config.diff = ['a', 'b', 'c']
  await t.rejects(
    npm.exec('diff', []),
    /Can't use more than two --diff arguments./,
    'should throw usage error'
  )
})

t.test('workspaces', async t => {
  const path = t.testdir({
    'package.json': {
      name: 'workspaces-test',
      version: '1.2.3-test',
      workspaces: ['workspace-a', 'workspace-b', 'workspace-c'],
    },
    'workspace-a': {
      'package.json': {
        name: 'workspace-a',
        version: '1.2.3-a',
      },
    },
    'workspace-b': {
      'package.json': {
        name: 'workspace-b',
        version: '1.2.3-b',
      },
    },
    'workspace-c': {
      'package.json': {
        name: 'workspace-n',
        version: '1.2.3-n',
      },
    },
  })

  t.test('all workspaces', async t => {
    const diffCalls = []
    libnpmdiff = async ([a, b]) => {
      diffCalls.push([a, b])
    }
    npm.prefix = path
    npm.localPrefix = path
    await diff.execWorkspaces([], [])
    t.same(
      diffCalls,
      [
        ['workspace-a@latest', join(`file:${path}`, 'workspace-a')],
        ['workspace-b@latest', join(`file:${path}`, 'workspace-b')],
      ],
      'should call libnpmdiff with workspaces params'
    )
  })

  t.test('one workspace', async t => {
    const diffCalls = []
    libnpmdiff = async ([a, b]) => {
      diffCalls.push([a, b])
    }
    npm.prefix = path
    npm.localPrefix = path
    await diff.execWorkspaces([], ['workspace-a'])
    t.same(
      diffCalls,
      [['workspace-a@latest', join(`file:${path}`, 'workspace-a')]],
      'should call libnpmdiff with workspaces params'
    )
  })

  t.test('invalid workspace', async t => {
    libnpmdiff = () => {
      t.fail('should not call libnpmdiff')
    }
    npm.prefix = path
    npm.localPrefix = path
    await t.rejects(diff.execWorkspaces([], ['workspace-x']), /No workspaces found/)
    await t.rejects(diff.execWorkspaces([], ['workspace-x']), /workspace-x/)
  })
})
