const t = require('tap')
const { load: loadMockNpm } = require('../../fixtures/mock-npm.js')
const tmock = require('../../fixtures/tmock.js')
const validateEngines = require('../../../lib/cli/validate-engines.js')
const ExitHandler = require('../../../lib/cli/exit-handler.js')
const mockGlobals = require('@npmcli/mock-globals')
const { EventEmitter } = require('node:events')

const cliMock = async (t, opts) => {
  const consoleErrors = []

  mockGlobals(t, {
    'console.error': (err) => consoleErrors.push(err),
  })

  const { Npm, ...mock } = await loadMockNpm(t, {
    ...opts,
    init: false,
  })

  let npm

  const cli = tmock(t, '{LIB}/cli/cli-entry.js', {
    '{LIB}/npm.js': class CliEntryNpm extends Npm {
      constructor (...args) {
        super(...args)
        npm = this
      }
    },
    '{LIB}/cli/exit-handler.js': class MockExitHandler extends ExitHandler {
      constructor ({ process }) {
        super({
          process: Object.assign(new EventEmitter(), process, {
            exit () {
              // this.emit('exit')
            },
          }),
        })
      }
    },
  })

  return {
    ...mock,
    getNpm () {
      return npm
    },
    Npm,
    consoleErrors,
    cli: (p) => validateEngines(p, () => cli),
  }
}

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
  // t.match(process.exitCode, 1)
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
  // t.match(process.exitCode, 1)
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

t.test('non dashes', async t => {
  //   await npm.exec('get', ['scope', '\u2010not-a-dash'])

  // t.strictSame([npm.command, npm.flatOptions.npmCommand], ['ll', 'll'],
  //   'does not change npm.command when another command is called')

  // t.match(logs, [
  //   'error arg Argument starts with non-ascii dash, this is probably invalid: \u2010not-a-dash',
  //   /timing command:config Completed in [0-9.]+ms/,
  //   /timing command:get Completed in [0-9.]+ms/,
  // ])
})
