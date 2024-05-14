const t = require('tap')
const { load: _loadMockNpm } = require('../../fixtures/mock-npm')
const MockRegistry = require('@npmcli/mock-registry')

const path = require('path')
const fs = require('fs')

// t.cleanSnapshot = str => str.replace(/ in [0-9ms]+/g, ' in {TIME}')

const loadMockNpm = async (t, opts) => {
  const mock = await _loadMockNpm(t, opts)
  const registry = new MockRegistry({
    tap: t,
    registry: mock.npm.config.get('registry'),
    strict: true,
  })
  return { registry, ...mock }
}

const packageJson = {
  name: 'test-package',
  version: '1.0.0',
  dependencies: {
    abbrev: '^1.0.0',
  },
}
const packageLock = {
  name: 'test-package',
  version: '1.0.0',
  lockfileVersion: 2,
  requires: true,
  packages: {
    '': {
      name: 'test-package',
      version: '1.0.0',
      dependencies: {
        abbrev: '^1.0.0',
      },
    },
    'node_modules/abbrev': {
      version: '1.0.0',
      resolved: 'https://registry.npmjs.org/abbrev/-/abbrev-1.0.0.tgz',
      // integrity changes w/ each test cause the path is different?
    },
  },
  dependencies: {
    abbrev: {
      version: '1.0.0',
      resolved: 'https://registry.npmjs.org/abbrev/-/abbrev-1.0.0.tgz',
      // integrity changes w/ each test cause the path is different?
    },
  },
}

const abbrev = {
  'package.json': '{"name": "abbrev", "version": "1.0.0"}',
  test: 'test file',
}

t.test('reifies, but doesn\'t remove node_modules because --dry-run', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: {
      'dry-run': true,
    },
    prefixDir: {
      abbrev: abbrev,
      'package.json': JSON.stringify(packageJson),
      'package-lock.json': JSON.stringify(packageLock),
      node_modules: { test: 'test file that will not be removed' },
    },
  })
  await npm.exec('ci', [])
  t.match(joinedOutput(), 'added 1 package, and removed 1 package in')
  const nmTest = path.join(npm.prefix, 'node_modules', 'test')
  t.equal(fs.existsSync(nmTest), true, 'existing node_modules is not removed')
  const nmAbbrev = path.join(npm.prefix, 'node_modules', 'abbrev')
  t.equal(fs.existsSync(nmAbbrev), false, 'does not install abbrev')
})

t.test('reifies, audits, removes node_modules', async t => {
  const { npm, joinedOutput, registry } = await loadMockNpm(t, {
    prefixDir: {
      abbrev: abbrev,
      'package.json': JSON.stringify(packageJson),
      'package-lock.json': JSON.stringify(packageLock),
      node_modules: { test: 'test file that will be removed' },
    },
  })
  const manifest = registry.manifest({ name: 'abbrev' })
  await registry.tarball({
    manifest: manifest.versions['1.0.0'],
    tarball: path.join(npm.prefix, 'abbrev'),
  })
  registry.nock.post('/-/npm/v1/security/advisories/bulk').reply(200, {})
  await npm.exec('ci', [])
  t.match(joinedOutput(), 'added 1 package, and audited 2 packages in')
  const nmTest = path.join(npm.prefix, 'node_modules', 'test')
  t.equal(fs.existsSync(nmTest), false, 'existing node_modules is removed')
  const nmAbbrev = path.join(npm.prefix, 'node_modules', 'abbrev')
  t.equal(fs.existsSync(nmAbbrev), true, 'installs abbrev')
})

t.test('reifies, audits, removes node_modules on repeat run', async t => {
  const { npm, joinedOutput, registry } = await loadMockNpm(t, {
    prefixDir: {
      abbrev: abbrev,
      'package.json': JSON.stringify(packageJson),
      'package-lock.json': JSON.stringify(packageLock),
      node_modules: { test: 'test file that will be removed' },
    },
  })
  const manifest = registry.manifest({ name: 'abbrev' })
  await registry.tarball({
    manifest: manifest.versions['1.0.0'],
    tarball: path.join(npm.prefix, 'abbrev'),
  })
  await registry.tarball({
    manifest: manifest.versions['1.0.0'],
    tarball: path.join(npm.prefix, 'abbrev'),
  })
  registry.nock.post('/-/npm/v1/security/advisories/bulk').reply(200, {})
  registry.nock.post('/-/npm/v1/security/advisories/bulk').reply(200, {})
  await npm.exec('ci', [])
  await npm.exec('ci', [])
  t.match(joinedOutput(), 'added 1 package, and audited 2 packages in')
  const nmTest = path.join(npm.prefix, 'node_modules', 'test')
  t.equal(fs.existsSync(nmTest), false, 'existing node_modules is removed')
  const nmAbbrev = path.join(npm.prefix, 'node_modules', 'abbrev')
  t.equal(fs.existsSync(nmAbbrev), true, 'installs abbrev')
})

t.test('--no-audit and --ignore-scripts', async t => {
  const { npm, joinedOutput, registry } = await loadMockNpm(t, {
    config: {
      'ignore-scripts': true,
      audit: false,
    },
    prefixDir: {
      abbrev: {
        'package.json': '{"name": "abbrev", "version": "1.0.0"}',
        test: 'test-file',
      },
      'package.json': JSON.stringify({
        ...packageJson,
        // Would make install fail
        scripts: { install: 'echo "SHOULD NOT RUN" && exit 1' },
      }),
      'package-lock.json': JSON.stringify(packageLock),
    },
  })
  const manifest = registry.manifest({ name: 'abbrev' })
  await registry.tarball({
    manifest: manifest.versions['1.0.0'],
    tarball: path.join(npm.prefix, 'abbrev'),
  })
  await npm.exec('ci', [])
  t.match(joinedOutput(), 'added 1 package in', 'would fail if install script ran')
})

t.test('lifecycle scripts', async t => {
  const scripts = []
  const { npm, registry } = await loadMockNpm(t, {
    prefixDir: {
      abbrev: abbrev,
      'package.json': JSON.stringify(packageJson),
      'package-lock.json': JSON.stringify(packageLock),
    },
    mocks: {
      '@npmcli/run-script': (opts) => {
        scripts.push(opts.event)
      },
    },
  })
  const manifest = registry.manifest({ name: 'abbrev' })
  await registry.tarball({
    manifest: manifest.versions['1.0.0'],
    tarball: path.join(npm.prefix, 'abbrev'),
  })
  registry.nock.post('/-/npm/v1/security/advisories/bulk').reply(200, {})
  await npm.exec('ci', [])
  t.same(scripts, [
    'preinstall',
    'install',
    'postinstall',
    'prepublish',
    'preprepare',
    'prepare',
    'postprepare',
  ], 'runs appropriate scripts, in order')
})

t.test('should throw if package-lock.json or npm-shrinkwrap missing', async t => {
  const { npm } = await loadMockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify(packageJson),
      node_modules: {
        'test-file': 'should not be removed',
      },
    },
  })
  await t.rejects(npm.exec('ci', []), { code: 'EUSAGE', message: /package-lock.json/ })
  const nmTestFile = path.join(npm.prefix, 'node_modules', 'test-file')
  t.equal(fs.existsSync(nmTestFile), true, 'does not remove node_modules')
})

t.test('should throw ECIGLOBAL', async t => {
  const { npm } = await loadMockNpm(t, {
    config: { global: true },
  })
  await t.rejects(npm.exec('ci', []), { code: 'ECIGLOBAL' })
})

t.test('should throw error when ideal inventory mismatches virtual', async t => {
  const { npm, registry } = await loadMockNpm(t, {
    prefixDir: {
      abbrev: abbrev,
      'package.json': JSON.stringify({
        ...packageJson,
        dependencies: { notabbrev: '^1.0.0' },
      }),
      'package-lock.json': JSON.stringify(packageLock),
      node_modules: {
        'test-file': 'should not be removed',
      },
    },
  })
  const manifest = registry.manifest({ name: 'notabbrev' })
  await registry.package({ manifest })
  await t.rejects(
    npm.exec('ci', []),
    { code: 'EUSAGE', message: /in sync/ }
  )
  const nmTestFile = path.join(npm.prefix, 'node_modules', 'test-file')
  t.equal(fs.existsSync(nmTestFile), true, 'does not remove node_modules')
})

t.test('should remove node_modules within workspaces', async t => {
  const { npm, registry } = await loadMockNpm(t, {
    prefixDir: {
      tarballs: {
        oneOneZero: {
          'package.json': JSON.stringify({ name: 'abbrev', version: '1.1.0' }),
          'index.js': 'module.exports = "hello world"',
        },
        oneOneOne: {
          'package.json': JSON.stringify({ name: 'abbrev', version: '1.1.1' }),
          'index.js': 'module.exports = "hello world"',
        },
      },
      node_modules: {
        abbrev: {
          'foo.txt': '',
          'package.json': JSON.stringify({
            name: 'abbrev',
            version: '1.1.0',
          }),
        },
        'workspace-a': t.fixture('symlink', '../workspace-a'),
        'workspace-b': t.fixture('symlink', '../workspace-b'),
      },
      'package-lock.json': JSON.stringify({
        name: 'workspace-test-3',
        version: '1.0.0',
        lockfileVersion: 3,
        requires: true,
        packages: {
          '': {
            name: 'workspace-test-3',
            version: '1.0.0',
            license: 'ISC',
            workspaces: [
              'workspace-a',
              'workspace-b',
            ],
          },
          'node_modules/abbrev': {
            version: '1.1.0',
            resolved: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.0.tgz',
          },
          'node_modules/workspace-a': {
            resolved: 'workspace-a',
            link: true,
          },
          'node_modules/workspace-b': {
            resolved: 'workspace-b',
            link: true,
          },
          'workspace-a': {
            version: '1.0.0',
            license: 'ISC',
            dependencies: {
              abbrev: '1.1.0',
            },
          },
          'workspace-b': {
            version: '1.0.0',
            dependencies: {
              abbrev: '1.1.1',
            },
            devDependencies: {},
          },
          'workspace-b/node_modules/abbrev': {
            version: '1.1.1',
            resolved: 'https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz',
          },
        },
      }),
      'package.json': JSON.stringify({
        name: 'workspace-test-3',
        version: '1.0.0',
        workspaces: [
          'workspace-a',
          'workspace-b',
        ],
      }),
      'workspace-a': {
        'package.json': JSON.stringify({
          name: 'workspace-a',
          version: '1.0.0',
          dependencies: {
            abbrev: '1.1.0',
          },
        }),
      },
      'workspace-b': {
        node_modules: {
          abbrev: {
            'bar.txt': '',
            'package.json': JSON.stringify({
              name: 'abbrev',
              version: '1.1.1',
            }),
          },
        },
        'package.json': JSON.stringify({
          name: 'workspace-b',
          version: '1.0.0',
          dependencies: {
            abbrev: '1.1.1',
          },
        }),
      },
    },
  })

  const manifest = registry.manifest({
    name: 'abbrev',
    versions: ['1.1.0', '1.1.1'],
  })

  await registry.tarball({
    manifest: manifest.versions['1.1.0'],
    tarball: path.join(npm.prefix, 'tarballs/oneOneZero'),
  })

  await registry.tarball({
    manifest: manifest.versions['1.1.1'],
    tarball: path.join(npm.prefix, 'tarballs/oneOneOne'),
  })

  registry.nock.post('/-/npm/v1/security/advisories/bulk').reply(200, {})

  await npm.exec('ci', [])

  const rmFooTest = path.join(npm.prefix, 'node_modules/abbrev/foo.txt')
  t.equal(fs.existsSync(rmFooTest), false, 'existing node_modules is removed')

  const rmBarTest = path.join(npm.prefix, 'workspace-b/node_modules/abbrev/bar.txt')
  t.equal(fs.existsSync(rmBarTest), false, 'existing ws node_modules is removed')

  const checkNmAbbrev = path.join(npm.prefix, 'node_modules/abbrev')
  t.equal(fs.existsSync(checkNmAbbrev), true, 'installs abbrev')

  const checkWsAbbrev = path.join(npm.prefix, 'workspace-b/node_modules/abbrev')
  t.equal(fs.existsSync(checkWsAbbrev), true, 'installs abbrev')
})
