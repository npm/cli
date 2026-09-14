const {
  cleanCwd,
  cleanTime,
  cleanDate,
  cleanPackumentCache,
} = require('../../fixtures/clean-snapshot.js')

const { resolve } = require('node:path')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const t = require('tap')

t.cleanSnapshot = (str) => cleanPackumentCache(cleanDate(cleanTime(cleanCwd(str))))

const {
  loadNpmWithRegistry: loadMockNpm,
} = require('../../fixtures/mock-npm')

const packageJson = {
  name: '@npmcli/test-jsr-package',
  version: '1.0.0',
}

const jsrPackage = {
  'package.json': JSON.stringify({
    name: '@jsr/std__testing',
    version: '1.0.0',
    description: 'Testing utilities from JSR',
  }),
  'index.js': 'module.exports = {}',
}

const readPackageJson = (prefix) =>
  JSON.parse(readFileSync(resolve(prefix, 'package.json'), 'utf8'))

t.test('JSR protocol support', async t => {
  await t.test('install JSR package without version', async t => {
    const { npm, registry } = await loadMockNpm(t, {
      config: {
        audit: false,
        // Configure @jsr:registry to use the mock registry for testing
        '@jsr:registry': 'https://registry.npmjs.org/',
      },
      prefixDir: {
        'package.json': JSON.stringify(packageJson),
        'jsr-std-testing': jsrPackage,
      },
    })

    // The JSR package @std/testing will be transformed to @jsr/std__testing
    const manifest = registry.manifest({
      name: '@jsr/std__testing',
    })
    await registry.package({ manifest })
    await registry.tarball({
      manifest: manifest.versions['1.0.0'],
      tarball: path.join(npm.prefix, 'jsr-std-testing'),
    })

    await npm.exec('install', ['jsr:@std/testing'])

    const pkg = readPackageJson(npm.prefix)
    t.ok(pkg.dependencies, 'has dependencies')
    t.match(pkg.dependencies, {
      '@jsr/std__testing': '^1.0.0',
    }, 'JSR package was added to dependencies with transformed name')
  })

  await t.test('install JSR package with specific version', async t => {
    const jsrPackageV110 = {
      'package.json': JSON.stringify({
        name: '@jsr/std__testing',
        version: '1.1.0',
      }),
      'index.js': 'module.exports = {}',
    }

    const { npm, registry } = await loadMockNpm(t, {
      config: {
        audit: false,
        '@jsr:registry': 'https://registry.npmjs.org/',
      },
      prefixDir: {
        'package.json': JSON.stringify(packageJson),
        'jsr-std-testing': jsrPackageV110,
      },
    })

    const manifest = registry.manifest({
      name: '@jsr/std__testing',
      versions: ['1.0.0', '1.1.0', '2.0.0'],
    })
    await registry.package({ manifest })
    await registry.tarball({
      manifest: manifest.versions['1.1.0'],
      tarball: path.join(npm.prefix, 'jsr-std-testing'),
    })

    await npm.exec('install', ['jsr:@std/testing@1.1.0'])

    const pkg = readPackageJson(npm.prefix)
    t.match(pkg.dependencies, {
      '@jsr/std__testing': '1.1.0',
    }, 'JSR package with specific version was installed')
  })

  await t.test('install JSR package with version range', async t => {
    const jsrPackageV110 = {
      'package.json': JSON.stringify({
        name: '@jsr/std__testing',
        version: '1.1.0',
      }),
      'index.js': 'module.exports = {}',
    }

    const { npm, registry } = await loadMockNpm(t, {
      config: {
        audit: false,
        '@jsr:registry': 'https://registry.npmjs.org/',
      },
      prefixDir: {
        'package.json': JSON.stringify(packageJson),
        'jsr-std-testing': jsrPackageV110,
      },
    })

    const manifest = registry.manifest({
      name: '@jsr/std__testing',
      versions: ['1.0.0', '1.1.0', '2.0.0'],
    })
    await registry.package({ manifest })
    await registry.tarball({
      manifest: manifest.versions['1.1.0'],
      tarball: path.join(npm.prefix, 'jsr-std-testing'),
    })

    await npm.exec('install', ['jsr:@std/testing@^1.0.0'])

    const pkg = readPackageJson(npm.prefix)
    t.match(pkg.dependencies, {
      '@jsr/std__testing': '^1.1.0',
    }, 'JSR package with range was installed and resolved to latest matching version')
  })

  await t.test('install JSR package with alias', async t => {
    const { npm, registry } = await loadMockNpm(t, {
      config: {
        audit: false,
        '@jsr:registry': 'https://registry.npmjs.org/',
      },
      prefixDir: {
        'package.json': JSON.stringify(packageJson),
        'jsr-std-testing': jsrPackage,
      },
    })

    const manifest = registry.manifest({
      name: '@jsr/std__testing',
    })
    await registry.package({ manifest })
    await registry.tarball({
      manifest: manifest.versions['1.0.0'],
      tarball: path.join(npm.prefix, 'jsr-std-testing'),
    })

    await npm.exec('install', ['testing@jsr:@std/testing'])

    const pkg = readPackageJson(npm.prefix)
    // When using alias syntax, npm should save it as: "testing": "jsr:@std/testing@^1.0.0"
    t.ok(pkg.dependencies.testing || pkg.dependencies['@jsr/std__testing'], 'JSR package was added')
    if (pkg.dependencies.testing) {
      t.match(pkg.dependencies.testing, /jsr:@std\/testing/, 'alias points to JSR package')
    }
  })

  await t.test('JSR package validation', async t => {
    await t.test('reject unscoped JSR packages', async t => {
      const { npm } = await loadMockNpm(t, {
        config: {
          audit: false,
        },
        prefixDir: {
          'package.json': JSON.stringify(packageJson),
        },
      })

      await t.rejects(
        npm.exec('install', ['jsr:unscoped-package']),
        /JSR packages must be scoped/,
        'rejects unscoped JSR package'
      )
    })

    await t.test('reject JSR package without slash', async t => {
      const { npm } = await loadMockNpm(t, {
        config: {
          audit: false,
        },
        prefixDir: {
          'package.json': JSON.stringify(packageJson),
        },
      })

      await t.rejects(
        npm.exec('install', ['jsr:@scopeonly']),
        /JSR packages must be scoped/,
        'rejects JSR package without name part'
      )
    })
  })

  await t.test('JSR registry configuration', async t => {
    const { npm } = await loadMockNpm(t, {
      config: {
        audit: false,
      },
      prefixDir: {
        'package.json': JSON.stringify(packageJson),
      },
    })

    t.equal(
      npm.config.get('@jsr:registry'),
      'https://npm.jsr.io/',
      '@jsr:registry is configured with default value'
    )
  })
})
