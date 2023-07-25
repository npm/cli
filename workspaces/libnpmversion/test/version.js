const t = require('tap')
const requireInject = require('require-inject')

const actionLog = []

const gitMock = {
  is: async opts => !/\bnot-git$/.test(opts.path),
  spawn: async (args, opts) => actionLog.push(['spawn', args, opts]),
}

const version = requireInject('../lib/version.js', {
  '../lib/enforce-clean.js': async () => true,
  '../lib/write-json.js': async (file, data) => actionLog.push(['write-json', file, data]),
  '../lib/commit.js': async (v, opts) => actionLog.push(['commit', v, opts]),
  '../lib/tag.js': async (v, opts) => actionLog.push(['tag', v, opts]),
  '../lib/retrieve-tag.js': async (opts) => {
    if (/\bnot-git$/.test(opts.path)) {
      throw new Error('not a git dir')
    }
    actionLog.push(['retrieve-tag', opts])
    return '1.2.3'
  },
  '@npmcli/git': gitMock,
  '@npmcli/run-script': async opt => actionLog.push(['run-script', opt.event, opt.env, opt]),
  'proc-log': {
    verbose: (...msg) => actionLog.push(['verbose', ...msg]),
  },
})

t.test('test out bumping the version in all the ways', async t => {
  const pkg = {
    name: 'foo',
    version: '1.2.0',
  }
  const lock = {
    name: 'foo',
    version: '1.2.0',
    dependencies: {},
  }

  const dir = t.testdir({
    git: {
      'package-lock.json': JSON.stringify(lock, null, 2),
    },
    'not-git': {
      'npm-shrinkwrap.json': JSON.stringify({
        ...lock,
        packages: {
          '': { ...pkg },
        },
      }, null, 2),
    },
  })

  await t.test('git dir', async t => {
    t.afterEach(async () => {
      actionLog.length = 0
    })
    const path = `${dir}/git`
    await t.test('major', async t => {
      // for this one, let's pretend that the package-lock.json is .gitignored
      const { spawn } = gitMock
      t.teardown(() => {
        gitMock.spawn = spawn
      })
      gitMock.spawn = async (args, opts) => {
        if (args[0] !== 'add' || !args.some(a => /package-lock\.json$/.test(a))) {
          return spawn(args, opts)
        }
        throw new Error('no addy the locky fiel please & thanky i ignoring it')
      }
      t.equal(await version('major', { path, pkg, gitTagVersion: true }), '2.0.0')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '1.2.0', npm_new_version: '2.0.0' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '1.2.0', npm_new_version: '2.0.0' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['commit', '2.0.0', { path, pkg }],
        ['tag', '2.0.0', { path, pkg }],
        ['run-script', 'postversion', { npm_old_version: '1.2.0', npm_new_version: '2.0.0' }],
      ])
      t.equal(pkg.version, '2.0.0')
    })
    await t.test('minor (ignore scripts)', async t => {
      t.equal(await version('minor',
        { path, pkg, ignoreScripts: true, gitTagVersion: true }), '2.1.0')
      t.match(actionLog, [
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg }],
        ['commit', '2.1.0', { path, pkg }],
        ['tag', '2.1.0', { path, pkg }],
      ])
      t.equal(pkg.version, '2.1.0')
    })
    await t.test('patch', async t => {
      t.equal(await version('patch', { path, pkg, gitTagVersion: true }), '2.1.1')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '2.1.0', npm_new_version: '2.1.1' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.1.0', npm_new_version: '2.1.1' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg }],
        ['commit', '2.1.1', { path, pkg }],
        ['tag', '2.1.1', { path, pkg }],
        ['run-script', 'postversion', { npm_old_version: '2.1.0', npm_new_version: '2.1.1' }],
      ])
      t.equal(pkg.version, '2.1.1')
    })
    await t.test('pre', async t => {
      t.equal(await version('pre', { path, pkg, gitTagVersion: true }), '2.1.1-0')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '2.1.1', npm_new_version: '2.1.1-0' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.1.1', npm_new_version: '2.1.1-0' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg }],
        ['commit', '2.1.1-0', { path, pkg }],
        ['tag', '2.1.1-0', { path, pkg }],
        ['run-script', 'postversion', { npm_old_version: '2.1.1', npm_new_version: '2.1.1-0' }],
      ])
      t.equal(pkg.version, '2.1.1-0')
    })
    await t.test('pre with preid', async t => {
      t.equal(await version('pre', { path, preid: 'alpha', pkg, gitTagVersion: true }),
        '2.1.1-alpha.0')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '2.1.1-0',
          npm_new_version: '2.1.1-alpha.0' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.1.1-0', npm_new_version: '2.1.1-alpha.0' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg }],
        ['commit', '2.1.1-alpha.0', { path, pkg }],
        ['tag', '2.1.1-alpha.0', { path, pkg }],
        ['run-script', 'postversion', { npm_old_version: '2.1.1-0',
          npm_new_version: '2.1.1-alpha.0' }],
      ])
      t.equal(pkg.version, '2.1.1-alpha.0')
    })
    await t.test('skips git tag when gitTagVersion is false', async t => {
      t.equal(await version('minor', { path, pkg, ignoreScripts: true, gitTagVersion: false }),
        '2.2.0')
      t.match(actionLog, [
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
      ])
      t.equal(pkg.version, '2.2.0')
    })
    await t.test('explicit version', async t => {
      t.equal(await version('=v3.2.1', { path, pkg, gitTagVersion: true }), '3.2.1')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '2.2.0', npm_new_version: '3.2.1' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.2.0', npm_new_version: '3.2.1' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg }],
        ['commit', '3.2.1', { path, pkg }],
        ['tag', '3.2.1', { path, pkg }],
        ['run-script', 'postversion', { npm_old_version: '2.2.0', npm_new_version: '3.2.1' }],
      ])
      t.equal(pkg.version, '3.2.1')
    })
    await t.test('invalid version', async t => {
      await t.rejects(version('invalid version', { path, pkg }), {
        message: 'Invalid version: invalid version',
        current: '3.2.1',
        requested: 'invalid version',
      })
    })
    await t.test('same version, not allowed', async t => {
      await t.rejects(version('=v3.2.1', { path, pkg }), {
        message: 'Version not changed',
        current: '3.2.1',
        requested: '=v3.2.1',
        newVersion: '3.2.1',
      })
    })
    await t.test('same version, is allowed', async t => {
      t.equal(await version('=v3.2.1',
        { path, pkg, allowSameVersion: true, gitTagVersion: true }), '3.2.1')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg, allowSameVersion: true }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg, allowSameVersion: true }],
        ['commit', '3.2.1', { path, pkg, allowSameVersion: true }],
        ['tag', '3.2.1', { path, pkg, allowSameVersion: true }],
        ['run-script', 'postversion', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' }],
      ])
      t.equal(pkg.version, '3.2.1')
    })
    await t.test('from git', async t => {
      t.equal(await version('from-git', { path, pkg, gitTagVersion: true }), '1.2.3')
      t.match(actionLog, [
        ['retrieve-tag', { path, pkg }],
        ['run-script', 'preversion', { npm_old_version: '3.2.1', npm_new_version: '1.2.3' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '3.2.1', npm_new_version: '1.2.3' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg }],
        ['commit', '1.2.3', { path, pkg }],
        ['tag', '1.2.3', { path, pkg }],
        ['run-script', 'postversion', { npm_old_version: '3.2.1', npm_new_version: '1.2.3' }],
      ])
      t.equal(pkg.version, '1.2.3')
    })
    await t.test('no current version', async t => {
      delete pkg.version
      t.equal(await version('2.3.4', { path, pkg, gitTagVersion: true }), '2.3.4')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '0.0.0', npm_new_version: '2.3.4' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/package-lock.json', pkg],
        ['run-script', 'version', { npm_old_version: '0.0.0', npm_new_version: '2.3.4' }],
        ['spawn', ['add', path + '/package.json'], { path, pkg }],
        ['spawn', ['add', path + '/package-lock.json'], { path, pkg }],
        ['commit', '2.3.4', { path, pkg }],
        ['tag', '2.3.4', { path, pkg }],
        ['run-script', 'postversion', { npm_old_version: '0.0.0', npm_new_version: '2.3.4' }],
      ])
      t.equal(pkg.version, '2.3.4')
    })
  })

  await t.test('not a git dir', async t => {
    pkg.version = '1.2.0'
    t.afterEach(async () => {
      actionLog.length = 0
    })
    const path = `${dir}/not-git`
    await t.test('major', async t => {
      t.equal(await version('major', { path, pkg }), '2.0.0')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '1.2.0', npm_new_version: '2.0.0' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['run-script', 'version', { npm_old_version: '1.2.0', npm_new_version: '2.0.0' }],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
        ['run-script', 'postversion', { npm_old_version: '1.2.0', npm_new_version: '2.0.0' }],
      ])
      t.equal(pkg.version, '2.0.0')
    })
    await t.test('minor (ignore scripts)', async t => {
      t.equal(await version('minor', { path, pkg, ignoreScripts: true }), '2.1.0')
      t.match(actionLog, [
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
      ])
      t.equal(pkg.version, '2.1.0')
    })
    await t.test('patch', async t => {
      t.equal(await version('patch', { path, pkg }), '2.1.1')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '2.1.0', npm_new_version: '2.1.1' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.1.0', npm_new_version: '2.1.1' }],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
        ['run-script', 'postversion', { npm_old_version: '2.1.0', npm_new_version: '2.1.1' }],
      ])
      t.equal(pkg.version, '2.1.1')
    })
    await t.test('pre', async t => {
      t.equal(await version('pre', { path, pkg }), '2.1.1-0')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '2.1.1', npm_new_version: '2.1.1-0' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.1.1', npm_new_version: '2.1.1-0' }],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
        ['run-script', 'postversion', { npm_old_version: '2.1.1', npm_new_version: '2.1.1-0' }],
      ])
      t.equal(pkg.version, '2.1.1-0')
    })
    await t.test('pre with preid', async t => {
      t.equal(await version('pre', { path, preid: 'alpha', pkg }), '2.1.1-alpha.0')
      t.match(actionLog, [
        ['run-script', 'preversion',
          { npm_old_version: '2.1.1-0', npm_new_version: '2.1.1-alpha.0' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.1.1-0', npm_new_version: '2.1.1-alpha.0' }],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
        ['run-script', 'postversion',
          { npm_old_version: '2.1.1-0', npm_new_version: '2.1.1-alpha.0' }],
      ])
      t.equal(pkg.version, '2.1.1-alpha.0')
    })
    await t.test('explicit version', async t => {
      t.equal(await version('=v3.2.1', { path, pkg }), '3.2.1')
      t.match(actionLog, [
        ['run-script', 'preversion',
          { npm_old_version: '2.1.1-alpha.0', npm_new_version: '3.2.1' }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['run-script', 'version', { npm_old_version: '2.1.1-alpha.0', npm_new_version: '3.2.1' }],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
        ['run-script', 'postversion',
          { npm_old_version: '2.1.1-alpha.0', npm_new_version: '3.2.1' }],
      ])
      t.equal(pkg.version, '3.2.1')
    })
    await t.test('invalid version', async t => {
      await t.rejects(version('invalid version', { path, pkg }), {
        message: 'Invalid version: invalid version',
        current: '3.2.1',
        requested: 'invalid version',
      })
    })
    await t.test('same version, not allowed', async t => {
      await t.rejects(version('=v3.2.1', { path, pkg }), {
        message: 'Version not changed',
        current: '3.2.1',
        requested: '=v3.2.1',
        newVersion: '3.2.1',
      })
    })
    await t.test('same version, is allowed', async t => {
      t.equal(await version('=v3.2.1', { path, pkg, allowSameVersion: true }), '3.2.1')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' },
          { banner: true }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['run-script', 'version', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' },
          { banner: true }],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
        ['run-script', 'postversion', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' },
          { banner: true }],
      ])
      t.equal(pkg.version, '3.2.1')
    })
    await t.test('same version, is allowed (silent mode)', async t => {
      t.equal(await version('=v3.2.1',
        { path, silent: true, pkg, allowSameVersion: true }), '3.2.1')
      t.match(actionLog, [
        ['run-script', 'preversion', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' },
          { banner: false }],
        ['write-json', path + '/package.json', pkg],
        ['write-json', path + '/npm-shrinkwrap.json', pkg],
        ['run-script', 'version', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' },
          { banner: false }],
        ['verbose', 'version', 'Not tagging: not in a git repo or no git cmd'],
        ['run-script', 'postversion', { npm_old_version: '3.2.1', npm_new_version: '3.2.1' },
          { banner: false }],
      ])
      t.equal(pkg.version, '3.2.1')
    })
    await t.test('from git', async t => {
      await t.rejects(version('from-git', { path, pkg }), {
        message: 'not a git dir',
      })
    })
  })
})
