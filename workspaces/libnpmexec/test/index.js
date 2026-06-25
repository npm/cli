const t = require('tap')
const { setup } = require('./fixtures/setup.js')

t.test('no args', async t => {
  t.plan(1)

  const { exec } = setup(t, {
    mocks: {
      '../../lib/run-script': ({ args }) => {
        t.ok(args.length === 0, 'should call run-script with no args')
      },
    },
  })

  await exec()
})

t.test('resolves binary from workspace dependencies', async t => {
  t.plan(2)

  const { exec, path } = setup(t, {
    testdir: {
      'tool-v1': {
        'package.json': { name: 'tool-v1', version: '1.0.0', bin: { 'shared-bin': 'cli.js' } },
        'cli.js': { key: 'tool-v1', value: 'hello' },
      },
      packages: {
        a: {},
      },
    },
    mocks: {
      '../../lib/is-windows.js': false,
      '@npmcli/arborist': class MockArborist {
        constructor (options) {
          this.path = options.path
        }

        async loadActual () {
          const resolve = require('path').resolve
          const wsPath = resolve(this.path, 'packages/a')
          const wsNode = {
            path: wsPath,
            name: 'workspace-a',
            edgesOut: new Map([
              ['tool-v1', {
                to: {
                  path: `${this.path}/tool-v1`,
                  package: { name: 'tool-v1', bin: { 'shared-bin': 'cli.js' } },
                },
              }],
            ]),
          }
          const inventory = new Map([
            [wsPath, wsNode],
          ])
          inventory.query = () => []
          return {
            inventory,
            edgesOut: new Map(),
          }
        }

        async reify () {}
      },
      '../../lib/run-script': ({ args }) => {
        t.equal(args[0], process.execPath, 'args[0] should be process.execPath')
        t.match(args[1], /tool-v1[/\\]cli\.js$/, 'args[1] should point to correct cli.js')
      },
    },
  })

  const resolve = require('path').resolve
  await exec({ pkgPath: resolve(path, 'packages/a'), args: ['shared-bin'] })
})

t.test('resolves binary from workspace dependencies (windows)', async t => {
  t.plan(2)

  const { exec, path } = setup(t, {
    testdir: {
      'tool-v1': {
        'package.json': { name: 'tool-v1', version: '1.0.0', bin: { 'shared-bin': 'cli.js' } },
        'cli.js': { key: 'tool-v1', value: 'hello' },
      },
      packages: {
        a: {},
      },
    },
    mocks: {
      '../../lib/is-windows.js': true,
      '@npmcli/arborist': class MockArborist {
        constructor (options) {
          this.path = options.path
        }

        async loadActual () {
          const resolve = require('path').resolve
          const wsPath = resolve(this.path, 'packages/a')
          const wsNode = {
            path: wsPath,
            name: 'workspace-a',
            edgesOut: new Map([
              ['tool-v1', {
                to: {
                  path: `${this.path}/tool-v1`,
                  package: { name: 'tool-v1', bin: { 'shared-bin': 'cli.js' } },
                },
              }],
            ]),
          }
          const inventory = new Map([
            [wsPath, wsNode],
          ])
          inventory.query = () => []
          return {
            inventory,
            edgesOut: new Map(),
          }
        }

        async reify () {}
      },
      '../../lib/run-script': ({ args }) => {
        t.equal(args[0], `"${process.execPath}"`, 'args[0] should be securely quoted on Windows')
        t.match(args[1], /tool-v1[/\\]cli\.js$/, 'args[1] should point to correct cli.js')
      },
    },
  })

  const resolve = require('path').resolve
  await exec({ pkgPath: resolve(path, 'packages/a'), args: ['shared-bin'] })
})

t.test('does not fallback to hoisted .bin for missing workspace dep', async t => {
  t.plan(1)

  const { exec, path } = setup(t, {
    testdir: {
      packages: {
        a: {},
      },
    },
    mocks: {
      '@npmcli/arborist': class MockArborist {
        constructor (options) {
          this.path = options.path
        }

        async loadActual () {
          const resolve = require('path').resolve
          const wsPath = resolve(this.path, 'packages/a')
          const wsNode = {
            path: wsPath,
            name: 'workspace-a',
            edgesOut: new Map(),
          }
          const inventory = new Map([
            [wsPath, wsNode],
          ])
          inventory.query = () => []
          return {
            inventory,
            edgesOut: new Map(),
          }
        }

        async reify () {}
      },
      '../../lib/file-exists.js': {
        localFileExists: async () => {
          t.fail('localFileExists should not be called in workspace context for undeclared bins')
          return null
        },
        fileExists: async () => false,
      },
      pacote: {
        manifest: async () => {
          throw new Error('ABORT_TEST')
        },
      },
    },
  })

  const resolve = require('path').resolve
  try {
    await exec({ pkgPath: resolve(path, 'packages/a'), args: ['missing-bin'] })
    t.fail('should have aborted')
  } catch (err) {
    t.equal(err.message, 'ABORT_TEST', 'skipped localFileExists and proceeded to missingFromTree')
  }
})
