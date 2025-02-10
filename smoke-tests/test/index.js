const { join } = require('node:path')
const t = require('tap')
const setup = require('./fixtures/setup.js')

t.test('basic', async t => {
  const { registry, npm, npmPath, npmLocal, readFile, paths } = await setup(t, {
    testdir: {
      packages: {
        'abbrev-1.0.4': {
          'package.json': { name: 'abbrev', version: '1.0.4' },
          'index.js': 'module.exports = "1.0.4"',
        },
        'abbrev-1.1.1': {
          'package.json': { name: 'abbrev', version: '1.1.1' },
          'index.js': 'module.exports = "1.1.1"',
        },
        'promise-all-reject-late': {
          'package.json': { name: 'promise-all-reject-late', version: '5.0.0' },
          'index.js': 'module.exports = null',
        },
        'exec-test-1.0.0': {
          'package.json': { name: 'exec-test', version: '1.0.0', bin: { 'exec-test': 'run.sh' } },
          'index.js': 'module.exports = "1.0.0"',
          'run.sh': 'echo 1.0.0',
        },
        'exec-test-1.0.1': {
          'package.json': { name: 'exec-test', version: '1.0.1', bin: { 'exec-test': 'run.sh' } },
          'index.js': 'module.exports = "1.0.1"',
          'run.sh': 'echo 1.0.1',
        },
      },
    },
  })

  const abbrevManifest = () => registry.manifest({ name: 'abbrev', versions: ['1.0.4', '1.1.1'] })

  await t.test('npm init', async t => {
    const cmdRes = await npm('init', '-y')

    t.matchSnapshot(cmdRes.stdout, 'should have successful npm init result')
    const pkg = await readFile('package.json')
    t.equal(pkg.name, 'project', 'should have expected generated name')
    t.equal(pkg.version, '1.0.0', 'should have expected generated version')
  })

  await t.test('npm root', async t => {
    const npmRoot = await npm('help').then(setup.getNpmRoot)

    if (setup.SMOKE_PUBLISH) {
      const globalNpmRoot = await npmPath('help').then(setup.getNpmRoot)
      t.rejects(npmLocal('help'), 'npm local rejects during smoke publish')
      t.not(npmRoot, setup.CLI_ROOT, 'npm root is not the local source dir')
      t.equal(
        npmRoot,
        globalNpmRoot,
        'during smoke publish, npm root and global root are equal'
      )
    } else {
      t.equal(
        await npmLocal('help').then(setup.getNpmRoot),
        setup.CLI_ROOT,
        'npm local root is the local source dir'
      )
      t.equal(npmRoot, setup.CLI_ROOT, 'npm root is the local source dir')
    }
  })

  await t.test('npm --version', async t => {
    const v = await npm('--version').then(r => r.stdout.trim())

    if (setup.SMOKE_PUBLISH) {
      t.match(v, /-[0-9a-f]{40}\.\d$/, 'must have a git version')
    } else {
      t.match(v, /^\d+\.\d+\.\d+/, 'has a version')
    }
  })

  await t.test('npm (no args)', async t => {
    const err = await npm('--loglevel=notice').catch(e => e)

    t.equal(err.code, 1, 'should exit with error code')
    t.equal(err.stderr, '', 'should have no stderr output')
    t.matchSnapshot(err.stdout, 'should have expected no args output')
  })

  await t.test('npm install prodDep@version', async t => {
    const manifest = abbrevManifest()
    await registry.package({
      manifest: manifest,
      tarballs: { '1.0.4': join(paths.root, 'packages', 'abbrev-1.0.4') },
    })

    const cmdRes = await npm('install', 'abbrev@1.0.4')

    t.matchSnapshot(cmdRes.stdout, 'should have expected install reify output')
    t.resolveMatchSnapshot(readFile('package.json'), 'should have expected package.json result')
    t.resolveMatchSnapshot(readFile('package-lock.json'), 'should have expected lockfile result')
  })

  await t.test('npm install dev dep', async t => {
    const manifest = registry.manifest({
      name: 'promise-all-reject-late',
      packuments: [{ version: '5.0.0', funding: 'https://github.com/sponsors' }],
    })
    await registry.package({
      manifest: manifest,
      tarballs: { '5.0.0': join(paths.root, 'packages', 'promise-all-reject-late') },
    })

    const cmdRes = await npm('install', 'promise-all-reject-late', '-D')

    t.matchSnapshot(cmdRes.stdout, 'should have expected dev dep added reify output')
    t.resolveMatchSnapshot(
      readFile('package.json'),
      'should have expected dev dep added package.json result'
    )
    t.resolveMatchSnapshot(
      readFile('package-lock.json'),
      'should have expected dev dep added lockfile result'
    )
  })

  await t.test('npm ls', async t => {
    const cmdRes = await npm('ls')

    t.matchSnapshot(cmdRes.stdout, 'should have expected ls output')
  })

  await t.test('npm fund', async t => {
    const cmdRes = await npm('fund')

    t.matchSnapshot(cmdRes.stdout, 'should have expected fund output')
  })

  await t.test('npm explain', async t => {
    const cmdRes = await npm('explain', 'abbrev')

    t.matchSnapshot(cmdRes.stdout, 'should have expected explain output')
  })

  await t.test('npm diff', async t => {
    const manifest = abbrevManifest()
    await registry.package({
      manifest: manifest,
      tarballs: { '1.0.4': join(paths.root, 'packages', 'abbrev-1.0.4') },
    })
    await registry.package({
      manifest: manifest,
      tarballs: { '1.1.1': join(paths.root, 'packages', 'abbrev-1.1.1') },
    })

    const cmdRes = await npm('diff', '--diff=abbrev@1.0.4', '--diff=abbrev@1.1.1')

    t.matchSnapshot(cmdRes.stdout, 'should have expected diff output')
  })

  await t.test('npm outdated', async t => {
    await registry.package({
      manifest: registry.manifest({
        name: 'promise-all-reject-late',
        versions: ['5.0.0'],
      }),
    })
    await registry.package({
      manifest: abbrevManifest(),
    })

    const outdated = await npm('outdated').catch(e => e)

    t.equal(outdated.code, 1, 'should exit with error code')
    t.not(outdated.stderr, '', 'should have stderr output')
    t.matchSnapshot(outdated.stdout, 'should have expected outdated output')
  })

  await t.test('npm pkg set scripts', async t => {
    const cmdRes = await npm('pkg', 'set', 'scripts.hello=echo Hello')

    t.matchSnapshot(cmdRes.stdout, 'should have expected set-script output')
    t.resolveMatchSnapshot(
      readFile('package.json'),
      'should have expected script added package.json result'
    )
  })

  await t.test('npm run-script', async t => {
    const cmdRes = await npm('run', 'hello')

    t.matchSnapshot(cmdRes.stdout, 'should have expected run-script output')
  })

  await t.test('npm prefix', async t => {
    const cmdRes = await npm('prefix')

    t.matchSnapshot(cmdRes.stdout, 'should have expected prefix output')
  })

  await t.test('npm view', async t => {
    await registry.package({
      manifest: abbrevManifest(),
    })
    const cmdRes = await npm('view', 'abbrev@1.0.4')

    t.matchSnapshot(cmdRes.stdout, 'should have expected view output')
  })

  await t.test('npm update dep', async t => {
    const manifest = abbrevManifest()
    await registry.package({
      manifest: manifest,
      tarballs: {
        '1.1.1': join(paths.root, 'packages', 'abbrev-1.1.1'),
      },
    })

    const cmdRes = await npm('update', 'abbrev')

    t.matchSnapshot(cmdRes.stdout, 'should have expected update reify output')
    t.resolveMatchSnapshot(readFile('package.json'),
      'should have expected update package.json result')
    t.resolveMatchSnapshot(readFile('package-lock.json'),
      'should have expected update lockfile result')
  })

  await t.test('npm uninstall', async t => {
    const cmdRes = await npm('uninstall', 'promise-all-reject-late')

    t.matchSnapshot(cmdRes.stdout, 'should have expected uninstall reify output')
    t.resolveMatchSnapshot(readFile('package.json'),
      'should have expected uninstall package.json result')
    t.resolveMatchSnapshot(readFile('package-lock.json'),
      'should have expected uninstall lockfile result')
  })

  await t.test('npm pkg', async t => {
    let cmdRes = await npm('pkg', 'get', 'license')
    t.matchSnapshot(cmdRes.stdout, 'should have expected pkg get output')

    cmdRes = await npm('pkg', 'set', 'tap[test-env][0]=LC_ALL=sk')
    t.matchSnapshot(cmdRes.stdout, 'should have expected pkg set output')

    t.resolveMatchSnapshot(
      readFile('package.json'),
      'should have expected npm pkg set modified package.json result'
    )

    cmdRes = await npm('pkg', 'get')
    t.matchSnapshot(cmdRes.stdout, 'should print package.json contents')

    cmdRes = await npm('pkg', 'delete', 'tap')
    t.matchSnapshot(cmdRes.stdout, 'should have expected pkg delete output')

    t.resolveMatchSnapshot(
      readFile('package.json'),
      'should have expected npm pkg delete modified package.json result'
    )
  })

  await t.test('npm update --no-save --no-package-lock', async t => {
    const manifest = abbrevManifest()
    await registry.package({
      manifest: manifest,
      tarballs: {
        '1.0.4': join(paths.root, 'packages', 'abbrev-1.0.4'),
      },
    })

    // setup, manually reset dep value
    await npm('pkg', 'set', 'dependencies.abbrev==1.0.4')
    await npm('install')

    await registry.package({
      manifest: manifest,
      tarballs: {
        '1.1.1': join(paths.root, 'packages', 'abbrev-1.1.1'),
      },
    })

    await npm('pkg', 'set', 'dependencies.abbrev=^1.0.4')
    await npm('update', '--no-save', '--no-package-lock')

    t.equal(
      (await readFile('package.json')).dependencies.abbrev,
      '^1.0.4',
      'should have expected update --no-save --no-package-lock package.json result'
    )
    t.equal(
      (await readFile('package-lock.json')).packages['node_modules/abbrev'].version,
      '1.0.4',
      'should have expected update --no-save --no-package-lock lockfile result'
    )
    t.equal(
      (await readFile('node_modules/abbrev/package.json')).version,
      '1.1.1',
      'actual installed version is 1.1.1'
    )
  })

  await t.test('npm update --no-save', async t => {
    const manifest = abbrevManifest()
    await registry.package({
      manifest: manifest,
    })

    await npm('update', '--no-save')

    t.equal(
      (await readFile('package.json')).dependencies.abbrev,
      '^1.0.4',
      'should have expected update --no-save package.json result'
    )
    t.equal(
      (await readFile('package-lock.json')).packages['node_modules/abbrev'].version,
      '1.1.1',
      'should have expected update --no-save lockfile result'
    )
  })

  await t.test('npm update --save', async t => {
    const manifest = abbrevManifest()
    await registry.package({
      manifest: manifest,
    })

    await npm('update', '--save')

    t.equal(
      (await readFile('package.json')).dependencies.abbrev,
      '^1.1.1',
      'should have expected update --save package.json result'
    )
    t.equal(
      (await readFile('package-lock.json')).packages['node_modules/abbrev'].version,
      '1.1.1',
      'should have expected update --save lockfile result'
    )
  })

  await t.test('npm ci', async t => {
    await npm('uninstall', 'abbrev')

    const manifest = abbrevManifest()
    await registry.package({
      manifest: manifest,
      tarballs: {
        '1.0.4': join(paths.root, 'packages', 'abbrev-1.0.4'),
      },
    })

    await npm('install', 'abbrev@1.0.4', '--save-exact')

    t.equal(
      (await readFile('package-lock.json')).packages['node_modules/abbrev'].version,
      '1.0.4',
      'should have stored exact installed version'
    )

    await npm('pkg', 'set', 'dependencies.abbrev=^1.1.1')

    await registry.package({
      manifest,
    })

    const err = await npm('ci', '--loglevel=error').catch(e => e)
    t.equal(err.code, 1)
    t.matchSnapshot(err.stderr, 'should throw mismatch deps in lock file error')
  })

  await t.test('npm exec', async t => {
    if (process.platform === 'win32') {
      t.skip()
      return
    }
    // First run finds package
    {
      const packument = registry.packument({
        name: 'exec-test', version: '1.0.0', bin: { 'exec-test': 'run.sh' },
      })
      const manifest = registry.manifest({ name: 'exec-test', packuments: [packument] })
      await registry.package({
        times: 2,
        manifest,
        tarballs: {
          '1.0.0': join(paths.root, 'packages', 'exec-test-1.0.0'),
        },
      })

      const o = await npm('exec', 'exec-test')
      t.match(o.stdout.trim(), '1.0.0')
    }
    // Second run finds newer version
    {
      const packument = registry.packument({
        name: 'exec-test', version: '1.0.1', bin: { 'exec-test': 'run.sh' },
      })
      const manifest = registry.manifest({ name: 'exec-test', packuments: [packument] })
      await registry.package({
        times: 2,
        manifest,
        tarballs: {
          '1.0.1': join(paths.root, 'packages', 'exec-test-1.0.1'),
        },
      })
      const o = await npm('exec', 'exec-test')
      t.match(o.stdout.trim(), '1.0.1')
    }
  })
})
