const t = require('tap')
const { load: loadMockNpm } = require('../fixtures/mock-npm.js')
const { MockProcess } = require('../fixtures/mock-exit.js')
const ExitHandler = require('../../lib/utils/exit-handler.js')
const tmock = require('../fixtures/tmock.js')
const validateEngines = require('../../lib/es6/validate-engines.js')
const mockGlobals = require('@npmcli/mock-globals')

const cliMock = async (t, opts) => {
  const consoleErrors = []

  mockGlobals(t, {
    'console.error': (err) => consoleErrors.push(err),
  })

  const mockedProcess = new MockProcess()

  const { Npm, ...mock } = await loadMockNpm(t, {
    ...opts,
    init: false,
  })

  const cli = tmock(t, '{LIB}/cli-entry.js', {
    '{LIB}/npm.js': Npm,
    '{LIB}/utils/exit-handler.js': class extends ExitHandler {
      constructor () {
        super({ process: mockedProcess })
      }
    },
  })

  return {
    ...mock,
    Npm,
    process,
    consoleErrors,
    cli: (p) => validateEngines(p, () => cli),
  }
}

t.test('print the version, and treat npm_g as npm -g', async t => {
  const { logs, cli, Npm, outputs } = await cliMock(t, {
    globals: { 'process.argv': ['node', 'npm_g', '-v'] },
  })

  await cli(process)

  t.strictSame(process.argv, ['node', 'npm', '-g', '-v'], 'system process.argv was rewritten')
  t.strictSame(logs.verbose.byTitle('cli'), ['cli node npm'])
  t.strictSame(logs.verbose.byTitle('title'), ['title npm'])
  t.match(logs.verbose.byTitle('argv'), ['argv "--global" "--version"'])
  t.strictSame(logs.info.byTitle('using'), [
    `using npm@${Npm.version}`,
    `using node@${process.version}`,
  ])
  t.equal(outputs.length, 1)
  t.strictSame(outputs, [Npm.version])
})

t.test('calling with --versions calls npm version with no args', async t => {
  const { logs, cli, outputs } = await cliMock(t, {
    globals: {
      'process.argv': ['node', 'npm', 'install', 'or', 'whatever', '--versions', '--json'],
    },
  })

  await cli(process)

  t.equal(process.title, 'npm install or whatever')
  t.strictSame(logs.verbose.byTitle('cli'), ['cli node npm'])
  t.strictSame(logs.verbose.byTitle('title'), ['title npm install or whatever'])
  t.match(logs.verbose.byTitle('argv'), ['argv "install" "or" "whatever" "--versions"'])
  t.equal(outputs.length, 1)
  t.match(JSON.parse(outputs[0]), { npm: String, node: String, v8: String })
})

t.test('logged argv is sanitized', async t => {
  const { logs, cli } = await cliMock(t, {
    globals: {
      'process.argv': [
        'node',
        'npm',
        'version',
        '--registry',
        'https://u:password@npmjs.org/password',
      ],
    },
  })

  await cli(process)

  t.equal(process.title, 'npm version')
  t.strictSame(logs.verbose.byTitle('cli'), ['cli node npm'])
  t.strictSame(logs.verbose.byTitle('title'), ['title npm version'])
  t.match(logs.verbose.byTitle('argv'),
    ['argv "version" "--registry" "https://u:***@npmjs.org/password"'])
})

t.test('logged argv is sanitized with equals', async t => {
  const { logs, cli } = await cliMock(t, {
    globals: {
      'process.argv': [
        'node',
        'npm',
        'version',
        '--registry=https://u:password@npmjs.org',
      ],
    },
  })

  await cli(process)

  t.match(logs.verbose.byTitle('argv'), ['argv "version" "--registry" "https://u:***@npmjs.org/"'])
})

t.test('print usage if no params provided', async t => {
  const { cli, outputs } = await cliMock(t, {
    globals: {
      'process.argv': ['node', 'npm'],
    },
  })

  await cli(process)

  t.match(outputs[0], 'Usage:', 'outputs npm usage')
  t.match(process.exitCode, 1)
})

t.test('print usage if non-command param provided', async t => {
  const { cli, outputs } = await cliMock(t, {
    globals: {
      'process.argv': ['node', 'npm', 'tset'],
    },
  })

  await cli(process)

  t.match(outputs[0], 'Unknown command: "tset"')
  t.match(outputs[0], 'Did you mean this?')
  t.match(process.exitCode, 1)
})

t.test('load error calls error handler', async t => {
  const err = new Error('test load error')
  const { consoleErrors, cli } = await cliMock(t, {
    mocks: {
      '@npmcli/config': class BadConfig {
        async load () {
          throw err
        }
      },
    },
    globals: {
      'process.argv': ['node', 'npm'],
    },
  })

  await cli(process)

  t.match(consoleErrors[0], /Error: test load error/)
})

t.test('unsupported node version', async t => {
  const { cli, logs } = await cliMock(t, {
    globals: {
      'process.version': '12.6.0',
    },
  })

  await cli(process)

  t.match(
    logs.warn[0],
    /npm v.* does not support Node\.js 12\.6\.0\./
  )
})
