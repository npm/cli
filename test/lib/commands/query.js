const { resolve } = require('path')
const t = require('tap')
const { fake: mockNpm } = require('../../fixtures/mock-npm')
const Query = require('../../../lib/commands/query.js')

const config = {
  global: false,
}

const npm = mockNpm({
  config,
  globalDir: '',
  flatOptions: {},
  output: () => {},
})

const query = new Query(npm)

t.test('simple query', async t => {
  const path = t.testdir({
    node_modules: {
      a: {
        name: 'a',
        version: '1.0.0',
      },
      b: {
        name: 'b',
        version: '^2.0.0',
      },
    },
    'package.json': JSON.stringify({
      name: 'project',
      dependencies: {
        a: '^1.0.0',
        b: '^1.0.0',
      },
    }),
  })
  npm.prefix = path
  npm.output = (res) => {
    t.matchSnapshot(res, 'should return expected object')
  }
  await query.exec([':root, :root > *:not(.workspace)'])
})

t.test('workspace query', async t => {
  const path = t.testdir({
    node_modules: {
      a: {
        name: 'a',
        version: '1.0.0',
      },
      b: {
        name: 'b',
        version: '^2.0.0',
      },
      c: t.fixture('symlink', '../c'),
    },
    c: {
      'package.json': JSON.stringify({
        name: 'c',
        version: '1.0.0',
      }),
    },
    'package.json': JSON.stringify({
      name: 'project',
      workspaces: ['c'],
      dependencies: {
        a: '^1.0.0',
        b: '^1.0.0',
      },
    }),
  })
  npm.prefix = npm.localPrefix = path
  npm.output = (res) => {
    t.matchSnapshot(res, 'should return expected workspace res')
  }
  await query.execWorkspaces([':scope'], ['c'])
})

t.test('linked node', async t => {
  const path = t.testdir({
    node_modules: {
      a: t.fixture('symlink', '../a'),
    },
    a: {
      'package.json': JSON.stringify({
        name: 'a',
        version: '1.0.0',
      }),
    },
    'package.json': JSON.stringify({
      name: 'project',
      dependencies: {
        a: 'file:./a',
      },
    }),
  })
  npm.prefix = npm.localPrefix = path
  npm.output = (res) => {
    t.matchSnapshot(res, 'should return expected linked node res')
  }
  await query.exec(['[name=a]'])
})

t.test('global', async t => {
  const path = t.testdir({
    globalDir: {
      lib: {
        node_modules: {
          lorem: {
            'package.json': JSON.stringify({
              name: 'lorem',
              version: '2.0.0',
            }),
          },
        },
      },
    },
    project: {},
  })
  config.global = true
  npm.globalDir = resolve(path, 'globalDir/lib/node_modules')
  npm.prefix = npm.localPrefix = resolve(path, 'project')
  npm.output = (res) => {
    t.matchSnapshot(res, 'should return expected linked node res')
  }
  await query.exec(['[name=lorem]'])
})
