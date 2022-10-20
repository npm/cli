const t = require('tap')
const isWorkspaceSafe = require('../lib/is-workspace-safe.js')
const path = require('path')

t.cleanSnapshot = s => s.replace(/\\+/g, '/')

t.test('all the potential states', async t => {
  const pkg = {
    name: 'foo',
  }
  const dir = t.testdir({
    git: {
      'package.json': JSON.stringify({
        ...pkg,
        workspaces: [
          'packages/a',
        ],
      }, null, 2),
    },
    'git/packages/a': {
      'package.json': JSON.stringify({
        ...pkg,
      }, null, 2),
    },
    'git/other': {},
    'not-git': {},
    'git-too': {
      'package.json': JSON.stringify({
        ...pkg,
      }, null, 2),
    },
    'git-too/subdir': {},
  })

  await t.test('no git', async t => {
    t.ok(await isWorkspaceSafe(
      null,
      `${dir}/not-git`
    ), 'should be safe because there is no git')
  })

  await t.test('is git root', async t => {
    t.ok(await isWorkspaceSafe(
      `${dir}/git`,
      `${dir}/git`,
      `${dir}/git`
    ), 'should be safe because cwd is git root')
  })

  await t.test('top level package has workspaces', async t => {
    t.ok(await isWorkspaceSafe(
      `${dir}/git`,
      `${dir}/git`,
      `${dir}/git/other`
    ), 'should be safe because we see the workspaces')
  })

  await t.test('in workspace', async t => {
    t.notOk(await isWorkspaceSafe(
      `${dir}/git`,
      `${dir}${path.sep}git${path.sep}packages${path.sep}a`,
      `${dir}${path.sep}git${path.sep}packages${path.sep}a`
    ), 'should return false for being in a workspace')
  })

  await t.test('no workspaces', async t => {
    t.ok(await isWorkspaceSafe(
      `${dir}/git-too`,
      `${dir}/git-too`,
      `${dir}/git-too/subdir`
    ), 'should be safe because of no workspaces')
  })
})
