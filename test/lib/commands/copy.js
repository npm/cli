const t = require('tap')
const { load } = require('../../fixtures/mock-npm')
const path = require('path')
const fs = require('fs')

const cwd = process.cwd()
t.afterEach(t => process.chdir(cwd))

t.test('should copy module files to destination', async t => {
  const { npm, outputs, logs } = await load(t, {
    prefixDir: {
      'package.json': JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        files: ['lib'],
      }),
      'README.md': 'file',
      lib: {
        'index.js': '// empty',
      },
      src: {
        'index.js': '// empty',
      },
    },
  })
  process.chdir(npm.prefix)
  await npm.exec('copy', ['build'])
  t.strictSame(outputs, [])
  t.strictSame(logs.notice, [])

  // lib is included in files, while package.json and README.md are always included.
  assertExists(path.join('build', 'package.json'))
  assertExists(path.join('build', 'README.md'))
  assertExists(path.join('build', 'lib', 'index.js'))

  // src should not be copied because it's excluded by files.
  assertMissing(path.join('build', 'src'))
})

t.test('should copy dependencies', async t => {
  const { npm, outputs, logs } = await load(t, {
    prefixDir: {
      'package.json': JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          foo: '^1.0.0',
          bar: '^1.0.0',
        },
      }),
      node_modules: {
        foo: { },
        bar: { },
        baz: { },
      },
    },
  })
  process.chdir(npm.prefix)
  await npm.exec('copy', ['build'])
  t.strictSame(outputs, [])
  t.strictSame(logs.notice, [])

  assertExists(path.join('build', 'node_modules', 'foo'))
  assertExists(path.join('build', 'node_modules', 'bar'))
  // baz is missing because it is an extraneous dep.
  assertMissing(path.join('build', 'node_modules', 'baz'))
})

t.test('should not copy bundled dependencies if they are omitted', async t => {
  const { npm, outputs, logs } = await load(t, {
    prefixDir: {
      'package.json': JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        bundledDependencies: true,
        optionalDependencies: {
          foo: '^1.0.0',
        },
      }),
      node_modules: {
        foo: {
          'package.json': JSON.stringify({
            name: 'foo',
            version: '1.0.0',
          }),
        },
      },
    },
  })
  process.chdir(npm.prefix)
  npm.config.set('omit', ['optional'])
  await npm.exec('copy', ['build'])
  t.strictSame(outputs, [])
  t.strictSame(logs.notice, [])

  assertMissing(path.join('build', 'node_modules', 'foo'))
})

t.test('workspaces', async t => {
  const fixture = {
    prefixDir: {
      'package.json': JSON.stringify({
        name: 'workspace-root',
        workspaces: [
          'pkgs/a',
          'pkgs/b',
        ],
      }),
      pkgs: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            version: '1.0.0',
          }),
          'README.md': 'a',
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1.0.0',
            dependencies: { c: '^1.0.0' },
          }),
          'README.md': 'b',
        },
      },
      node_modules: {
        a: t.fixture('symlink', '../pkgs/a'),
        b: t.fixture('symlink', '../pkgs/b'),
        c: t.fixture('symlink', '../pkgs/a'),
      },
    },
  }

  t.test('should only copy included workspaces', async t => {
    const { npm } = await load(t, fixture)
    process.chdir(npm.prefix)
    npm.config.set('workspace', ['a'])
    await npm.exec('copy', ['build'])

    assertExists(path.join('build', 'node_modules', 'a'))
    assertMissing(path.join('build', 'node_modules', 'b'))
    assertMissing(path.join('build', 'package.json'))
  })

  t.test('should copy all included workspaces', async t => {
    const { npm } = await load(t, fixture)
    process.chdir(npm.prefix)
    npm.config.set('workspace', ['a', 'b'])
    await npm.exec('copy', ['build'])

    assertExists(path.join('build', 'node_modules', 'a'))
    assertExists(path.join('build', 'node_modules', 'b'))
    assertMissing(path.join('build', 'package.json'))
  })

  t.test('should copy workspace root', async t => {
    const { npm } = await load(t, fixture)
    process.chdir(npm.prefix)
    npm.config.set('workspaces', true)
    npm.config.set('include-workspace-root', true)
    await npm.exec('copy', ['build'])

    assertExists(path.join('build', 'node_modules', 'a'))
    assertExists(path.join('build', 'node_modules', 'b'))
    assertExists(path.join('build', 'package.json'))
  })

  t.test('should copy symlinks once', async t => {
    const { npm } = await load(t, fixture)
    process.chdir(npm.prefix)
    npm.config.set('workspaces', true)
    await npm.exec('copy', ['build'])
    const canonPath = path.join('build', 'node_modules', 'a')
    const linkPath = path.join('build', 'node_modules', 'c')

    // if we stat the linkPath windows errors with EPERM, so I want to stat the
    // link target, which means resolving relative links.
    const linkDest = path.resolve(
      path.dirname(linkPath),
      fs.readlinkSync(linkPath))

    t.strictSame(
      fs.statSync(canonPath),
      fs.statSync(linkDest),
      `${linkPath} should be a link to ${canonPath}`)
  })
})

t.test('requires destination argument', async t => {
  const { npm, outputs } = await load(t)
  process.chdir(npm.prefix)
  await t.rejects(
    npm.exec('copy', []),
    /Missing required destination argument/
  )
  t.strictSame(outputs, [])
})

function assertExists (path) {
  try {
    fs.statSync(path)
    t.pass(`${path} exists`)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return t.fail(`${path} should exist but does not`)
    }
    throw err
  }
}

function assertMissing (path) {
  try {
    fs.statSync(path)
    t.fail(`${path} should not exist but does`)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return t.pass(`${path} does not exist`)
    }
    throw err
  }
}
