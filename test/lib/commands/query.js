const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')

t.cleanSnapshot = (str) => {
  const normalizePath = p => p
    .replace(/\\+/g, '/')
    .replace(/\r\n/g, '\n')
  return normalizePath(str)
    .replace(new RegExp(normalizePath(process.cwd()), 'g'), '{CWD}')
}

t.test('simple query', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: {
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
    },
  })
  await npm.exec('query', [':root, :root > *'])
  t.matchSnapshot(joinedOutput(), 'should return root object')
})

t.test('workspace query', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: {
      workspaces: ['c'],
    },
    prefixDir: {
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
    },
  })
  await npm.exec('query', [':scope'], ['c'])
  t.matchSnapshot(joinedOutput(), 'should return workspace object')
})

t.test('linked node', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    prefixDir: {
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
    },
  })
  await npm.exec('query', ['[name=a]'])
  t.matchSnapshot(joinedOutput(), 'should return linked node res')
})

t.test('global', async t => {
  const { npm, joinedOutput } = await loadMockNpm(t, {
    config: {
      global: true,
    },
    globalPrefixDir: {
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
  })
  await npm.exec('query', ['[name=lorem]'])
  t.matchSnapshot(joinedOutput(), 'should return global package')
})
