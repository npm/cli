
const t = require('tap')
const setup = require('./fixtures/setup.js')

t.test('install links with package lock only', async t => {
  const setupTest = async (t) => {
    const mock = await setup(t, {
      testdir: {
        project: {
          'package.json': {
            name: 'root',
            version: '1.0.0',
            workspaces: ['workspaces/*'],
          },
          workspaces: {
            pkg1: {
              'package.json': {
                name: '@npmcli/pkg1',
                version: '1.0.0',
                dependencies: { '@npmcli/pkg3': '^1.0.0' },
              },
            },
            pkg2: {
              'package.json': {
                name: '@npmcli/pkg2',
                version: '1.0.0',
                dependencies: { '@npmcli/pkg3': '^1.0.0' },
              },
            },
            pkg3: {
              'package.json': {
                name: '@npmcli/pkg3',
                version: '1.0.0',
              },
            },
          },
        },
      },
    })
    const { npm } = mock

    // generate an initially valid lockfile
    await npm('install', '--package-lock-only', '--install-links=false')

    // manually set version and semver ranges for pkg3
    await npm('pkg', 'set', '--workspace=@npmcli/pkg1', 'dependencies.@npmcli/pkg3=^1.0.1')
    await npm('pkg', 'set', '--workspace=@npmcli/pkg2', 'dependencies.@npmcli/pkg3=^1.0.1')
    await npm('pkg', 'set', '--workspace=@npmcli/pkg3', 'version=1.0.1')

    return mock
  }

  await t.test('updates package lock with install-links=false', async t => {
    const { npm, readFile } = await setupTest(t)

    await npm('install', '--package-lock-only', '--install-links=false')

    const lock = await readFile('package-lock.json')
    t.equal(lock.packages['workspaces/pkg3'].version, '1.0.1')
  })

  // See https://github.com/npm/cli/issues/5967 for full bug
  // change to t.test when this gets fixed
  await t.todo('updates package lock with install-links=true', async t => {
    const { npm, readFile, registry } = await setupTest(t)

    // TODO: this test should pass the same as the previous one. For debugging
    // purposes the @npmcli/pkg3 package is mocked with only version 1.0.0 so
    // the `npm install` command will fail, instead of nock failing for the
    // missing request. But a proper fix for this will not need any registry
    // requests mocked.
    await registry.package({
      manifest: registry.manifest({ name: '@npmcli/pkg3', versions: ['1.0.0'] }),
      times: 1,
    })

    await npm('install', '--package-lock-only', '--install-links=true')

    const lock = await readFile('package-lock.json')
    t.equal(lock.packages['workspaces/pkg3'].version, '1.0.1')
  })
})
