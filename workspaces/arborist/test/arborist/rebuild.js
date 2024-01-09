const t = require('tap')
const _trashList = Symbol.for('trashList')
const Arborist = require('../../lib/arborist/index.js')
const { resolve, dirname } = require('path')
const os = require('os')
const fs = require('fs')
const fixtures = resolve(__dirname, '../fixtures')
const relpath = require('../../lib/relpath.js')
const localeCompare = require('@isaacs/string-locale-compare')('en')

const fixture = (t, p) => require(`${fixtures}/reify-cases/${p}`)(t)

const isWindows = process.platform === 'win32'
const PORT = 12345 + (+process.env.TAP_CHILD_ID || 0)

const server = require('http').createServer(() => {
  throw new Error('rebuild should not hit the registry')
})
t.before(() => new Promise(res => {
  server.listen(PORT, () => {
    t.teardown(() => server.close())
    res()
  })
}))

const registry = `http://localhost:${PORT}`
const newArb = opt => new Arborist({ ...opt, registry })

// track the logs that are emitted.  returns a function that removes
// the listener and provides the list of what it saw.
const logTracker = () => {
  const list = []
  const onlog = (...msg) => list.push(msg)
  process.on('log', onlog)
  return () => {
    process.removeListener('log', onlog)
    return list
  }
}

t.test('rebuild bin links for all nodes if no nodes specified', async t => {
  const path = fixture(t, 'dep-installed-without-bin-link')
  const semver = resolve(path, 'node_modules/.bin/semver')
  const mkdirp = resolve(path, 'node_modules/.bin/mkdirp')
  await newArb({ path }).rebuild()
  t.equal(fs.statSync(semver).isFile(), true, 'semver bin linked')
  t.equal(fs.statSync(mkdirp).isFile(), true, 'mkdirp bin linked')
})

t.test('rebuild bin links only for specified node', async t => {
  const path = fixture(t, 'dep-installed-without-bin-link')
  const semver = resolve(path, 'node_modules/.bin/semver')
  const mkdirp = resolve(path, 'node_modules/.bin/mkdirp')
  const arb = newArb({ path })
  await arb.loadActual()
  await arb.rebuild({
    nodes: arb.actualTree.inventory.query('name', 'semver'),
  })
  t.equal(fs.statSync(semver).isFile(), true, 'semver bin linked')
  t.throws(() => fs.statSync(mkdirp), 'mkdirp bin not linked')
})

t.test('rebuild no matching nodes', async t => {
  const path = fixture(t, 'dep-installed-without-bin-link')
  const semver = resolve(path, 'node_modules/.bin/semver')
  const mkdirp = resolve(path, 'node_modules/.bin/mkdirp')
  const arb = newArb({ path })
  await arb.rebuild({ nodes: [] })
  t.throws(() => fs.statSync(semver), 'semver bin not linked')
  t.throws(() => fs.statSync(mkdirp), 'mkdirp bin not linked')
})

t.test('rebuild skip bin links', async t => {
  const path = fixture(t, 'dep-installed-without-bin-link')
  const semver = resolve(path, 'node_modules/.bin/semver')
  const mkdirp = resolve(path, 'node_modules/.bin/mkdirp')
  const arb = newArb({ path, binLinks: false })
  await arb.rebuild({ nodes: [] })
  t.throws(() => fs.statSync(semver), 'semver bin not linked')
  t.throws(() => fs.statSync(mkdirp), 'mkdirp bin not linked')
})

t.test('rebuild bundled deps', async t => {
  const path = fixture(t, 'testing-rebuild-bundle-reified')
  const file = resolve(path, 'node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b/cwd')
  t.throws(() => fs.statSync(file), 'file not there already (gut check)')
  const arb = newArb({ path })
  await arb.rebuild()
  t.equal(fs.readFileSync(file, 'utf8'), dirname(file), 'bundle build script run')
})

t.test('rebuild bundled dep if bundling parent on the list', async t => {
  const path = fixture(t, 'testing-rebuild-bundle-reified')
  const file = resolve(path, 'node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b/cwd')
  t.throws(() => fs.statSync(file), 'file not there already (gut check)')
  const arb = newArb({ path })
  const nodes = (await arb.loadActual()).inventory.query('name', '@isaacs/testing-rebuild-bundle-a')
  await arb.rebuild({ nodes })
  t.equal(fs.readFileSync(file, 'utf8'), dirname(file), 'bundle build script run')
})

t.test('do not rebuild bundled dep if rebuildBundle=false', async t => {
  const path = fixture(t, 'testing-rebuild-bundle-reified')
  const file = resolve(path, 'node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b/cwd')
  t.throws(() => fs.statSync(file), 'file not there already (gut check)')
  const arb = newArb({ path, rebuildBundle: false })
  const nodes = (await arb.loadActual()).inventory.query('name', '@isaacs/testing-rebuild-bundle-a')
  await arb.rebuild({ nodes })
  t.throws(() => fs.statSync(file), 'bundle build script not run')
})

t.test('do not run scripts if ignoreScripts=true', async t => {
  const path = fixture(t, 'testing-rebuild-bundle-reified')
  const file = resolve(path, 'node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b/cwd')
  t.throws(() => fs.statSync(file), 'file not there already (gut check)')
  const arb = newArb({ path, ignoreScripts: true })
  await arb.rebuild()
  t.throws(() => fs.statSync(file), 'bundle build script not run')
})

t.test('do nothing if ignoreScripts=true and binLinks=false', async t => {
  const path = fixture(t, 'testing-rebuild-bundle-reified')
  const file = resolve(path, 'node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b/cwd')
  t.throws(() => fs.statSync(file), 'file not there already (gut check)')
  const arb = newArb({ path, ignoreScripts: true, binLinks: false })
  await arb.rebuild()
  t.throws(() => fs.statSync(file), 'bundle build script not run')
})

t.test('do not link bins for nodes on trash list', async t => {
  const path = fixture(t, 'dep-installed-without-bin-link')
  const semver = resolve(path, 'node_modules/.bin/semver')
  const mkdirp = resolve(path, 'node_modules/.bin/mkdirp')
  const arb = newArb({ path })
  await arb.loadActual()
  arb[_trashList].add(arb.actualTree.children.get('mkdirp').path)
  // just set this so it calls the fn, the actual test of this function
  // is in the reify rollback tests.
  await arb.rebuild({ handleOptionalFailure: true })
  t.equal(fs.statSync(semver).isFile(), true, 'semver bin linked')
  t.throws(() => fs.statSync(mkdirp), 'mkdirp bin not linked')
})

t.test('do not run scripts for nodes on trash list', async t => {
  const path = fixture(t, 'testing-rebuild-bundle-reified')
  const loc = 'node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b'
  const file = resolve(path, `${loc}/cwd`)
  t.throws(() => fs.statSync(file), 'file not there already (gut check)')
  const arb = newArb({ path })
  await arb.loadActual()
  arb[_trashList].add(arb.actualTree.inventory.get(loc).path)
  await arb.rebuild()
  t.throws(() => fs.statSync(file), 'bundle build script not run')
})

t.test('dont blow up if package.json is borked', async t => {
  const path = fixture(t, 'testing-rebuild-bundle-reified')
  const loc = 'node_modules/@isaacs/testing-rebuild-bundle-a/node_modules/@isaacs/testing-rebuild-bundle-b'
  const file = resolve(path, loc, 'cwd')
  fs.unlinkSync(resolve(path, loc, 'package.json'))
  t.throws(() => fs.statSync(file), 'file not there already (gut check)')
  const arb = newArb({ path })
  await arb.rebuild()
  t.throws(() => fs.statSync(file), 'bundle build script not run')
})

t.test('verify dep flags in script environments', async t => {
  const path = fixture(t, 'testing-rebuild-script-env-flags')
  const checkLogs = logTracker()

  const expect = {
    devdep: ['npm_package_dev'],
    optdep: ['npm_package_optional'],
    'opt-and-dev': ['npm_package_dev', 'npm_package_optional'],
    devopt: ['npm_package_dev_optional'],
  }

  const arb = newArb({ path })
  // just set this so it calls the fn, the actual test of this function
  // is in the reify rollback tests.
  await arb.rebuild({ handleOptionalFailure: true })
  // sort into a predictable order and pull out the fields we wanna test
  // don't include path or env, because that's going to be platform-specific
  const saved = [...arb.scriptsRun]
    .sort(({ path: patha, event: eventa }, { path: pathb, event: eventb }) =>
      localeCompare(patha, pathb) || localeCompare(eventa, eventb))
    .map(({ pkg, event, cmd, code, signal, stdout, stderr }) =>
      ({ pkg, event, cmd, code, signal, stdout, stderr }))
  t.cleanSnapshot = (input) => {
    return input.replace(new RegExp(os.tmpdir().replace(/\\/g, '\\\\\\\\'), 'g'), '{TMP}')
      .replace(/\\\\/g, '/')
      .replace(/-(.+)\.(?:sh|cmd)/g, '{HASH}')
  }
  t.matchSnapshot(saved, 'saved script results')

  for (const [pkg, flags] of Object.entries(expect)) {
    const file = resolve(path, 'node_modules', pkg, 'env')
    t.strictSame(flags, fs.readFileSync(file, 'utf8').split('\n'), pkg)
  }
  t.strictSame(checkLogs().sort((a, b) =>
    localeCompare(a[2], b[2]) || (typeof a[4] === 'string' ? -1 : 1)), [
    ['info', 'run', 'devdep@1.0.0', 'postinstall', 'node_modules/devdep', 'node ../../env.js'],
    ['info', 'run', 'devdep@1.0.0', 'postinstall', { code: 0, signal: null }],
    ['info', 'run', 'devopt@1.0.0', 'postinstall', 'node_modules/devopt', 'node ../../env.js'],
    ['info', 'run', 'devopt@1.0.0', 'postinstall', { code: 0, signal: null }],
    ['info', 'run', 'opt-and-dev@1.0.0', 'postinstall', 'node_modules/opt-and-dev', 'node ../../env.js'],
    ['info', 'run', 'opt-and-dev@1.0.0', 'postinstall', { code: 0, signal: null }],
    ['info', 'run', 'optdep@1.0.0', 'postinstall', 'node_modules/optdep', 'node ../../env.js'],
    ['info', 'run', 'optdep@1.0.0', 'postinstall', { code: 0, signal: null }],
  ], 'logged script executions at info level')
})

t.test('run scripts in foreground if foregroundScripts set', async t => {
  const path = fixture(t, 'rebuild-foreground-scripts')
  const RUNS = []
  let tick = 0
  const Arborist = t.mock('../../lib/arborist/index.js', {
    '@npmcli/run-script': async opts => {
      // ensure that they don't get parallelized
      const run = tick++
      RUNS.push({ opts, run })
      await new Promise(res => setTimeout(res))
      RUNS.push({ opts, finished: true, run })
      return { code: 0, signal: null }
    },
  })

  const arb = new Arborist({ path, registry, foregroundScripts: true })
  await arb.rebuild()
  // add a sentinel to make sure we didn't get too many entries, since
  // t.match() will allow trailing/extra values in the test object.
  RUNS.push(undefined)
  t.match(RUNS, [
    { run: 0, opts: { event: 'preinstall', stdio: 'inherit' }, finished: undefined },
    { run: 0, opts: { event: 'preinstall', stdio: 'inherit' }, finished: true },
    { run: 1, opts: { event: 'preinstall', stdio: 'inherit' }, finished: undefined },
    { run: 1, opts: { event: 'preinstall', stdio: 'inherit' }, finished: true },
    { run: 2, opts: { event: 'install', stdio: 'inherit' }, finished: undefined },
    { run: 2, opts: { event: 'install', stdio: 'inherit' }, finished: true },
    { run: 3, opts: { event: 'install', stdio: 'inherit' }, finished: undefined },
    { run: 3, opts: { event: 'install', stdio: 'inherit' }, finished: true },
    { run: 4, opts: { event: 'postinstall', stdio: 'inherit' }, finished: undefined },
    { run: 4, opts: { event: 'postinstall', stdio: 'inherit' }, finished: true },
    { run: 5, opts: { event: 'postinstall', stdio: 'inherit' }, finished: undefined },
    { run: 5, opts: { event: 'postinstall', stdio: 'inherit' }, finished: true },
    undefined,
  ])
})

t.test('log failed exit codes as well, even if we dont crash', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      optionalDependencies: { optdep: '1' },
    }),
    node_modules: {
      optdep: {
        'package.json': JSON.stringify({
          name: 'optdep',
          version: '1.2.3',
          scripts: {
            preinstall: 'exit 1',
          },
        }),
      },
    },
  })
  const arb = newArb({ path })
  const checkLogs = logTracker()
  await arb.rebuild({ handleOptionalFailure: true })
  t.strictSame(checkLogs(), [
    ['info', 'run', 'optdep@1.2.3', 'preinstall', 'node_modules/optdep', 'exit 1'],
    ['info', 'run', 'optdep@1.2.3', 'preinstall', { code: 1, signal: null }],
    ['verbose', 'reify', 'failed optional dependency', resolve(path, 'node_modules/optdep')],
    ['silly', 'reify', 'mark', 'deleted', [resolve(path, 'node_modules/optdep')]],
  ])
})

t.test('rebuild global top bin links', async t => {
  const path = t.testdir({
    lib: {
      node_modules: {
        foo: {
          'package.json': JSON.stringify({
            name: 'foo',
            bin: 'foo.js',
            version: '1.2.3',
          }),
          'foo.js': '#!/usr/local/bin node\nconsole.log("hello")\n',
        },
      },
    },
  })
  const file = isWindows ? `${path}/lib/foo.cmd` : `${path}/bin/foo`
  const arb = newArb({
    path: `${path}/lib`,
    global: true,
  })
  await arb.rebuild()
  const isCorrect = isWindows ? 'isFile' : 'isSymbolicLink'
  t.equal(fs.lstatSync(file)[isCorrect](), true, 'bin was linked')
})

t.test('do not build if theres a conflicting globalTop bin', async t => {
  const path = t.testdir({
    lib: {
      node_modules: {
        foo: {
          'package.json': '',
          'foo.js': '#!/usr/local/bin node\nconsole.log("hello")\n',
        },
      },
    },
    bin: {},
  })
  const file = isWindows ? `${path}/lib/foo.cmd` : `${path}/bin/foo`
  fs.writeFileSync(file, 'this is not the linked bin')
  fs.writeFileSync(`${path}/lib/node_modules/foo/package.json`, JSON.stringify({
    name: 'foo',
    bin: 'foo.js',
    version: '1.2.3',
    scripts: {
      // try to get clever...
      preinstall: `node -e "require('fs').unlinkSync(process.argv[1])" ${JSON.stringify(file)}`,
    },
  }))

  const arb = newArb({
    path: `${path}/lib`,
    global: true,
  })
  t.rejects(arb.rebuild(), { code: 'EEXIST' })
  t.equal(fs.readFileSync(file, 'utf8'), 'this is not the linked bin')
})

t.test('force overwrite the conflicting globalTop bin', async t => {
  const path = t.testdir({
    lib: {
      node_modules: {
        foo: {
          'package.json': JSON.stringify({
            name: 'foo',
            bin: 'foo.js',
            version: '1.2.3',
          }),
          'foo.js': '#!/usr/local/bin node\nconsole.log("hello")\n',
        },
      },
    },
    bin: {},
  })
  const file = isWindows ? `${path}/lib/foo.cmd` : `${path}/bin/foo`
  fs.writeFileSync(file, 'this is not the linked bin')

  const arb = newArb({
    path: `${path}/lib`,
    global: true,
    force: true,
  })
  await arb.rebuild()
  const isCorrect = isWindows ? 'isFile' : 'isSymbolicLink'
  t.equal(fs.lstatSync(file)[isCorrect](), true, 'bin was linked')
  t.not(fs.readFileSync(file, 'utf8'), 'this is not the linked bin')
})

t.test('checkBins is fine if no bins', async t => {
  const path = t.testdir({
    lib: {
      node_modules: {
        foo: {
          'package.json': JSON.stringify({
            name: 'foo',
            version: '1.2.3',
          }),
          'foo.js': '#!/usr/local/bin node\nconsole.log("hello")\n',
        },
      },
    },
    bin: {},
  })
  const file = isWindows ? `${path}/lib/foo.cmd` : `${path}/bin/foo`
  fs.writeFileSync(file, 'this is not the linked bin')

  const arb = newArb({
    path: `${path}/lib`,
    global: true,
  })
  await arb.rebuild()
  t.equal(fs.readFileSync(file, 'utf8'), 'this is not the linked bin')
})

t.test('rebuild node-gyp dependencies lacking both preinstall and install scripts', async t => {
  // use require-inject so we don't need an actual massive binary dep fixture
  const RUNS = []
  const Arborist = t.mock('../../lib/arborist/index.js', {
    '@npmcli/run-script': async opts => {
      RUNS.push(opts)
      return { code: 0, signal: null }
    },
  })
  const path = t.testdir({
    node_modules: {
      dep: {
        'package.json': JSON.stringify({
          name: 'dep',
          version: '1.0.0',
        }),
        'binding.gyp': '',
      },
    },
    'package.json': JSON.stringify({
      name: 'project',
      dependencies: {
        dep: '1',
      },
    }),
  })
  const arb = new Arborist({ path, registry })
  await arb.rebuild()
  t.match(RUNS, [
    {
      event: 'install',
      path: resolve(path, 'node_modules/dep'),
      pkg: { scripts: { install: 'node-gyp rebuild' } },
      env: {
        npm_package_resolved: null,
        npm_package_integrity: null,
        npm_package_json: resolve(path, 'node_modules/dep/package.json'),
        npm_package_optional: '',
        npm_package_dev: '',
        npm_package_peer: '',
        npm_package_dev_optional: '',
      },
      scriptShell: undefined,
    },
  ])
})

t.test('do not rebuild node-gyp dependencies with gypfile:false', async t => {
  // use require-inject so we don't need an actual massive binary dep fixture
  const Arborist = t.mock('../../lib/arborist/index.js', {
    '@npmcli/run-script': async opts => {
      throw new Error('should not run any scripts')
    },
  })
  const path = t.testdir({
    node_modules: {
      dep: {
        'package.json': JSON.stringify({
          name: 'dep',
          version: '1.0.0',
          gypfile: false,
        }),
        'binding.gyp': '',
      },
    },
    'package.json': JSON.stringify({
      name: 'project',
      dependencies: {
        dep: '1',
      },
    }),
  })
  const arb = new Arborist({ path, registry })
  await arb.rebuild()
})

// ref: https://github.com/npm/cli/issues/2905
t.test('do not run lifecycle scripts of linked deps twice', async t => {
  const testdir = t.testdir({
    project: {
      'package.json': JSON.stringify({
        name: 'my-project',
        version: '1.0.0',
        dependencies: {
          foo: 'file:../foo',
        },
      }),
      node_modules: {
        foo: t.fixture('symlink', '../../foo'),
      },
    },
    foo: {
      'package.json': JSON.stringify({
        name: 'foo',
        version: '1.0.0',
        scripts: {
          postinstall: 'echo "ok"',
        },
      }),
    },
  })

  const path = resolve(testdir, 'project')
  const RUNS = []
  const Arborist = t.mock('../../lib/arborist/index.js', {
    '@npmcli/run-script': opts => {
      RUNS.push(opts)
      return require('@npmcli/run-script')(opts)
    },
  })
  const arb = new Arborist({ path, registry })
  await arb.rebuild()
  t.equal(RUNS.length, 1, 'should run postinstall script only once')
  t.match(RUNS, [
    {
      event: 'postinstall',
      pkg: { name: 'foo' },
    },
  ])
})

t.test('workspaces', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-workspaces-powered-project',
      workspaces: ['a', 'b'],
    }),
    node_modules: {
      a: t.fixture('symlink', '../a'),
      b: t.fixture('symlink', '../b'),
    },
    a: {
      'package.json': JSON.stringify({
        name: 'a',
        version: '1.0.0',
        bin: './foo',
        scripts: {
          prepare: `node -e "require('fs').writeFileSync('foo', '')"`,
        },
      }),
    },
    b: {
      'package.json': JSON.stringify({
        name: 'b',
        scripts: { prepare: 'exit 0' },
      }),
    },
  })

  const RUNS = []
  const Arborist = t.mock('../../lib/arborist/index.js', {
    '@npmcli/run-script': opts => {
      RUNS.push(opts)
      return require('@npmcli/run-script')(opts)
    },
  })
  const arb = new Arborist({ path, registry })

  await arb.rebuild()
  t.equal(RUNS.length, 2, 'should run prepare script only once per ws')
  t.match(RUNS, [
    {
      event: 'prepare',
      pkg: { name: 'a' },
    },
    {
      event: 'prepare',
      pkg: { name: 'b' },
    },
  ])

  // should place bin links AFTER running lifecycle scripts
  // foo is a file created during prepare script
  const foo = resolve(path, 'node_modules/a/foo')
  const binLink = resolve(path, 'node_modules/.bin/a')
  t.equal(fs.statSync(foo).isFile(), true, 'foo is put into place')
  t.equal(fs.statSync(binLink).isFile(), true, 'bin symlink is put into place')

  t.test('with binLinks: false', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'my-workspaces-powered-project',
        workspaces: ['a'],
      }),
      node_modules: {
        a: t.fixture('symlink', '../a'),
      },
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          bin: './foo',
          scripts: { prepare: 'exit 0' },
        }),
        foo: 'foo',
      },
    })

    const RUNS = []
    const Arborist = t.mock('../../lib/arborist/index.js', {
      '@npmcli/run-script': async opts => {
        RUNS.push(opts)
        return { code: 0, signal: null }
      },
    })
    const arb = new Arborist({ path, registry, binLinks: false })

    await arb.rebuild()
    t.equal(RUNS.length, 1, 'should run prepare script only once')
    t.match(RUNS, [
      {
        event: 'prepare',
        pkg: { name: 'a' },
      },
    ])

    const binLink = resolve(path, 'node_modules/.bin/a')
    t.throws(
      () => fs.statSync(binLink),
      /ENOENT/,
      'bin symlink should not be put into place'
    )
  })

  t.test('linked deps', async t => {
    const path = t.testdir({
      'package.json': JSON.stringify({
        name: 'my-workspaces-powered-project',
        dependencies: {
          a: 'file:./a',
        },
      }),
      node_modules: {
        a: t.fixture('symlink', '../a'),
      },
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.0.0',
          bin: './foo',
          scripts: { prepare: 'exit 0' },
        }),
        foo: 'foo',
      },
    })

    const RUNS = []
    const Arborist = t.mock('../../lib/arborist/index.js', {
      '@npmcli/run-script': async opts => {
        RUNS.push(opts)
        return { code: 0, signal: null }
      },
    })
    const arb = new Arborist({ path, registry })

    await arb.rebuild()
    t.equal(RUNS.length, 1, 'should run prepare script only once')
    t.match(RUNS, [
      {
        event: 'prepare',
        pkg: { name: 'a' },
      },
    ])

    // should place bin links AFTER running lifecycle scripts
    const binLink = resolve(path, 'node_modules/.bin/a')
    t.equal(
      fs.statSync(binLink).isFile(),
      true,
      'bin symlink is put into place'
    )
  })
})

t.test('put bins in the right place for linked-global top pkgs', async t => {
  const path = t.testdir({
    lib: t.fixture('symlink', 'target'),
    target: {
      node_modules: {
        foo: {
          'package.json': JSON.stringify({
            name: 'foo',
            version: '1.2.3',
            bin: 'foo',
          }),
          foo: 'the bin script',
        },
      },
    },
  })
  const binpath = resolve(path, isWindows ? 'lib' : 'bin')
  const arb = newArb({ path: path + '/lib', global: true })
  await arb.rebuild()
  const expect = isWindows ? [
    'foo',
    'foo.cmd',
    'foo.ps1',
  ] : ['foo']
  const test = isWindows ? 'isFile' : 'isSymbolicLink'
  for (const f of expect) {
    const p = resolve(binpath, f)
    const rel = relpath(t.testdirName, p)
    t.equal(fs.lstatSync(p)[test](), true, `${test} ${rel}`)
  }
})

t.test('only rebuild for workspace', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
      dependencies: {
        inroot: '*',
      },
    }),
    node_modules: {
      a: t.fixture('symlink', '../packages/a'),
      b: t.fixture('symlink', '../packages/b'),
      inroot: {
        'package.json': JSON.stringify({
          name: 'inroot',
          version: '1.2.3',
          scripts: {
            install: 'exit 1',
          },
        }),
      },
      adep: {
        'package.json': JSON.stringify({
          name: 'adep',
          version: '1.2.3',
          scripts: {
            install: 'node adep.js',
          },
        }),
        'adep.js': `require('fs').writeFileSync('adep.txt', 'adep')`,
      },
      bdep: {
        'package.json': JSON.stringify({
          name: 'bdep',
          version: '1.2.3',
          scripts: {
            install: 'node bdep.js',
          },
        }),
        'bdep.js': `require('fs').writeFileSync('bdep.txt', 'bdep')`,
      },
    },
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: {
            adep: '*',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
          dependencies: {
            bdep: '*',
          },
        }),
      },
    },
  })

  const arb = newArb({ path, workspaces: ['a'] })
  await arb.rebuild()
  const adepTxt = resolve(path, 'node_modules/adep/adep.txt')
  const bdepTxt = resolve(path, 'node_modules/bdep/bdep.txt')
  t.equal(fs.readFileSync(adepTxt, 'utf8'), 'adep', 'adep rebuilt')
  t.throws(() => fs.readFileSync(bdepTxt, 'utf8'), { code: 'ENOENT' }, 'bdep not rebuilt')
})

t.test('no workspaces', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'no-workspaces-powered-project',
      workspaces: ['a', 'b'],
      bin: './foo',
      scripts: { install: `exit 0` },
    }),
    node_modules: {
      a: t.fixture('symlink', '../a'),
      b: t.fixture('symlink', '../b'),
    },
    a: {
      'package.json': JSON.stringify({
        name: 'a',
        version: '1.0.0',
        bin: './foo',
        scripts: {
          prepare: `node -e "require('fs').writeFileSync('foo', '')"`,
        },
      }),
    },
    b: {
      'package.json': JSON.stringify({
        name: 'b',
        scripts: { prepare: 'exit 0' },
      }),
    },
  })

  const RUNS = []
  const Arborist = t.mock('../../lib/arborist/index.js', {
    '@npmcli/run-script': opts => {
      RUNS.push(opts)
      return require('@npmcli/run-script')(opts)
    },
  })
  const arb = new Arborist({
    path,
    registry,
    workspacesEnabled: false,
  })

  await arb.rebuild()
  t.equal(RUNS.length, 1, 'should run only root')
  t.match(RUNS, [
    {
      event: 'install',
      pkg: { name: 'no-workspaces-powered-project' },
    },
  ])
})
