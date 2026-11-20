const { existsSync } = require('node:fs')
const { join } = require('node:path')
const NPM_CLI = join(__dirname, '..', '..', 'bin', 'npm-cli.js')
const t = require('tap')
const setup = require('./fixtures/setup.js')

const rootPackage = {
  name: 'workspaces-test',
  version: '1.0.0',
  private: true,
  workspaces: ['workspace-a', 'workspace-b'],
  dependencies: {
    'workspace-a': '^1.0.0',
    'workspace-b': '^1.0.0',
  },
}

const workspacePackage = name => ({ name, version: '1.0.0' })

const rootLock = {
  name: 'workspaces-test',
  version: '1.0.0',
  lockfileVersion: 3,
  requires: true,
  packages: {
    '': {
      name: 'workspaces-test',
      version: '1.0.0',
      workspaces: ['workspace-a', 'workspace-b'],
      dependencies: {
        'workspace-a': '^1.0.0',
        'workspace-b': '^1.0.0',
      },
    },
    'node_modules/workspace-a': { resolved: 'workspace-a', link: true },
    'node_modules/workspace-b': { resolved: 'workspace-b', link: true },
    'workspace-a': { version: '1.0.0' },
    'workspace-b': { version: '1.0.0' },
  },
}

t.test('version', async t => {
  // the default smoke test npm does not run through `npm version` at all, and
  // passes --prefix which would disable implicit workspace detection, so these
  // tests spawn the cli directly from inside the workspace.
  const { spawn, paths, readFile, registry } = await setup(t, {
    testdir: {
      project: {
        'package.json': rootPackage,
        'package-lock.json': rootLock,
        'workspace-a': { 'package.json': workspacePackage('workspace-a') },
        'workspace-b': { 'package.json': workspacePackage('workspace-b') },
      },
    },
  })

  const npmVersion = (cwd, ...args) => spawn(process.execPath, [
    NPM_CLI,
    'version',
    ...args,
    `--registry=${registry.origin}`,
    `--cache=${paths.cache}`,
    `--userconfig=${paths.userConfig}`,
    `--globalconfig=${paths.globalConfig}`,
    '--no-audit',
    '--no-update-notifier',
    '--loglevel=warn',
  ], { cwd })

  const inWorkspace = name => join(paths.project, name)

  await t.test('versions only the workspace it runs in', async t => {
    const res = await npmVersion(inWorkspace('workspace-a'), 'patch', '--no-git-tag-version')

    t.equal(res.stdout.trim(), 'v1.0.1', 'should output the new version')
    t.equal(
      (await readFile('workspace-a/package.json')).version,
      '1.0.1',
      'should bump the workspace manifest'
    )
    t.equal((await readFile('package.json')).version, '1.0.0', 'should leave the root manifest alone')
    t.same(
      (await readFile('package-lock.json')).packages['workspace-a'].version,
      '1.0.0',
      'should not write the project lockfile without --save'
    )
    t.notOk(
      existsSync(join(paths.project, 'node_modules')),
      'should not reify the project'
    )
  })

  await t.test('versions only the workspace with --save', async t => {
    const res = await npmVersion(inWorkspace('workspace-b'), 'patch', '--no-git-tag-version', '--save')

    t.equal(res.stdout.trim(), 'v1.0.1', 'should output the new version')
    t.equal(
      (await readFile('workspace-b/package.json')).version,
      '1.0.1',
      'should bump the workspace manifest'
    )

    const lock = await readFile('package-lock.json')
    t.equal(lock.packages['workspace-b'].version, '1.0.1', 'should update the workspace lock entry')
    t.equal(lock.packages['workspace-a'].version, '1.0.0', 'should leave other workspaces alone')
    t.equal(lock.packages[''].version, '1.0.0', 'should leave the root entry alone')
    t.same(
      lock.packages[''].dependencies,
      { 'workspace-a': '^1.0.0', 'workspace-b': '^1.0.0' },
      'should not rewrite the root dependency ranges'
    )
    t.notOk(
      existsSync(join(paths.project, 'node_modules')),
      'should not reify the project'
    )
  })
})
