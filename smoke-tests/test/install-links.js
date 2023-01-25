const t = require('tap')
const { join } = require('path')
const setup = require('./fixtures/setup.js')

t.test('workspaces + file deps + non-deduping abbrev', async t => {
  const abbrevs = ['1.0.3', '1.0.4', '1.0.5', '1.0.6']

  const { npm, registry, paths } = await setup(t, {
    debug: true,
    testdir: {
      a: {
        'package.json': { name: 'a', dependencies: { abbrev: abbrevs[0], b: 'file:./b' } },
      },
      b: {
        'package.json': { name: 'b', dependencies: { abbrev: abbrevs[1] } },
      },
      packages: abbrevs.reduce((acc, v) => {
        acc[`abbrev-${v}`] = { 'package.json': { name: 'abbrev', version: v } }
        return acc
      }, {}),
    },
  })

  await npm('init', '-y')
  await npm('init', '-y', '--workspace=workspaces/ws-a')
  await npm('init', '-y', '--workspace=workspaces/ws-b')

  // set root deps
  await npm('pkg', 'set', `dependencies.ws-a=1.0.0`)
  await npm('pkg', 'set', `dependencies.a=file:../a`)

  // set workspace a deps
  await npm('pkg', 'set', `dependencies.abbrev=${abbrevs[2]}`, '--workspace=ws-a')
  await npm('pkg', 'set', `dependencies.ws-b=1.0.0`, '--workspace=ws-a')

  // set workspace b deps
  await npm('pkg', 'set', `dependencies.abbrev=${abbrevs[3]}`, '--workspace=ws-b')

  await registry.package({
    manifest: registry.manifest({ name: 'abbrev', versions: abbrevs }),
    tarballs: abbrevs.reduce((acc, v) => {
      acc[v] = join(paths.root, 'packages', `abbrev-${v}`)
      return acc
    }, {}),
    times: 2,

  })

  // this should not fail and all 4 abbrevs should get installed
  // with no mocks remaining
  await npm('install', '--install-links=true')
})
