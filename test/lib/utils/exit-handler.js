/* eslint no-restricted-globals: ["error", "process"] */
// Make sure tests all use the mocked process

const t = require('tap')
const fsMiniPass = require('fs-minipass')
const fs = require('node:fs')
const { join, resolve } = require('node:path')
const os = require('node:os')
const { output, time } = require('proc-log')
const { load: loadMockNpm } = require('../../fixtures/mock-npm')
const { mockExit } = require('../../fixtures/mock-exit')
const { cleanCwd, cleanDate } = require('../../fixtures/clean-snapshot')
const tmock = require('../../fixtures/tmock')
const { version: NPM_VERSION } = require('../../../package.json')

t.formatSnapshot = (obj) => {
  if (Array.isArray(obj)) {
    return obj
      .map((i) => Array.isArray(i) ? i.join(' ') : i)
      .join('\n')
  }
  return obj
}

t.cleanSnapshot = (path) => cleanDate(cleanCwd(path))
  // Config loading is dependent on env so strip those from snapshots
  .replace(/.*timing config:load:.*\n/gm, '')
  // logfile cleaning is not awaited so it races with the process.exit
  // in this test and can cause snapshot failures so we always remove them
  .replace(/.*silly logfile.*cleaning.*\n/gm, '')
  .replace(/(Completed in )\d+(ms)/g, '$1{TIME}$2')
  .replace(/(removing )\d+( files)/g, '$1${NUM}2')
  // eslint-disable-next-line no-restricted-globals
  .replaceAll(`node ${process.version}`, '{NODE-VERSION}')
  .replaceAll(`${os.type()} ${os.release()}`, '{OS}')
  .replaceAll(`v${NPM_VERSION}`, '{NPM-VERSION}')

const mockExitHandler = async (t, { config, mocks, files, ...opts } = {}) => {
  const { npm, ...rest } = await loadMockNpm(t, {
    ...opts,
    mocks,
    config: (dirs) => ({
      loglevel: 'notice',
      ...(typeof config === 'function' ? config(dirs) : config),
    }),
  })

  const { process, exitHandler, consoleErrors } = mockExit(t, { mocks })
  exitHandler.npm = npm

  return {
    ...rest,
    errors: () => [
      ...rest.outputErrors,
      ...consoleErrors,
    ],
    npm,
    process,
    // Make it async to make testing ergonomics a little easier so we dont need
    // to t.plan() every test to make sure we get process.exit called.
    exitHandler: (err) => new Promise(res => {
      exitHandler.exit(err)
      res()
    }),
  }
}

// Create errors with properties to be used in tests
const err = (message = '', options = {}, noStack = false) => {
  const e = Object.assign(
    new Error(message),
    typeof options !== 'object' ? { code: options } : options
  )
  e.stack = options.stack || `Error: ${message}`
  if (noStack) {
    delete e.stack
  }
  return e
}

t.test('handles unknown error with logs and debug file', async (t) => {
  const { exitHandler, debugFile, logs, process } = await mockExitHandler(t, {
    config: { loglevel: 'silly', timing: true },
  })

  await exitHandler(err('Unknown error', 'ECODE'))

  const fileLogs = await debugFile()
  const fileLines = fileLogs.split('\n')

  const lineNumber = /^(\d+)\s/
  const lastLog = fileLines[fileLines.length - 1].match(lineNumber)[1]

  t.equal(process.exitCode, 1)

  logs.forEach((logItem, i) => {
    const logLines = logItem.split('\n').map(l => `${i} ${l}`)
    for (const line of logLines) {
      t.match(fileLogs.trim(), line, 'log appears in debug file')
    }
  })

  t.equal(logs.length, parseInt(lastLog) + 1)
  t.match(logs.error, [
    'code ECODE',
    'Unknown error',
    /A complete log of this/,
  ])
  t.match(fileLogs, /^\d+ error code ECODE/m)
  t.match(fileLogs, /^\d+ error Unknown error/m)
  t.match(fileLogs, /^\d+ error A complete log of this/m)
  t.matchSnapshot(logs, 'logs')
  t.matchSnapshot(fileLines.map(l => l.replace(lineNumber, 'XX ')), 'debug file contents')
})

t.test('exit handler never called - loglevel silent', async (t) => {
  const { logs, errors, process } = await mockExitHandler(t, {
    config: { loglevel: 'silent' },
  })
  process.emit('exit', 1)
  t.strictSame(logs.error, [])
  t.strictSame(errors(), [])
})

t.test('exit handler never called - loglevel notice', async (t) => {
  const { logs, errors, process } = await mockExitHandler(t)
  process.emit('exit', 1)
  t.equal(process.exitCode, 1)
  t.match(logs.error, [
    'Exit handler never called!',
    /error with npm itself/,
  ])
  t.strictSame(errors(), [])
})

t.test('exit handler never called - no npm', async (t) => {
  const { logs, errors, process } = await mockExitHandler(t, { init: false })
  process.emit('exit', 5)
  t.equal(process.exitCode, 5)
  t.strictSame(logs.error, [])
  t.equal(errors().length, 1)
  t.match(errors()[0], /Error: Process exited unexpectedly with code: 5/)
})

t.test('exit handler called - no npm', async (t) => {
  const { exitHandler, errors, process } = await mockExitHandler(t, { init: false })
  await exitHandler()
  t.equal(process.exitCode, 1)
  t.equal(errors().length, 1)
  t.match(errors(), [/Error: Exit prior to setting npm in exit handler/])
})

t.test('exit handler called - no npm with error', async (t) => {
  const { exitHandler, errors, process } = await mockExitHandler(t, { init: false })
  await exitHandler(err('something happened'))
  t.equal(process.exitCode, 1)
  t.equal(errors().length, 1)
  t.match(errors(), [/Error: something happened/])
})

t.test('exit handler called - no npm with error without stack', async (t) => {
  const { exitHandler, errors, process } = await mockExitHandler(t, { init: false })
  await exitHandler(err('something happened', {}, true))
  t.equal(process.exitCode, 1)
  t.equal(errors().length, 1)
  t.match(errors(), [/something happened/])
})

t.test('standard output using --json', async (t) => {
  const { exitHandler, outputs, process } = await mockExitHandler(t, {
    config: { json: true },
  })

  await exitHandler(err('Error: ENEEDAUTH Something happened'))

  t.equal(process.exitCode, 1)
  t.same(JSON.parse(outputs[0]), {
    error: {
      code: 'ENEEDAUTH',
      summary: 'Error: ENEEDAUTH Something happened',
      detail: 'You need to authorize this machine using `npm adduser`',
    },
  }, 'should output expected json output')
})

t.test('merges output buffers errors with --json', async (t) => {
  const { exitHandler, outputs, process } = await mockExitHandler(t, {
    config: { json: true },
  })

  output.buffer({ output_data: 1 })
  output.buffer(JSON.stringify({ more_data: 2 }))
  output.buffer('not json, will be ignored')

  await exitHandler(err('Error: ENEEDAUTH Something happened'))

  t.equal(process.exitCode, 1)
  t.same(JSON.parse(outputs[0]), {
    output_data: 1,
    more_data: 2,
    error: {
      code: 'ENEEDAUTH',
      summary: 'Error: ENEEDAUTH Something happened',
      detail: 'You need to authorize this machine using `npm adduser`',
    },
  }, 'should output expected json output')
})

t.test('output buffer without json', async (t) => {
  const { exitHandler, outputs, logs, process } = await mockExitHandler(t)

  output.buffer('output_data')
  output.buffer('more_data')

  await exitHandler(err('Error: EBADTHING Something happened'))

  t.equal(process.exitCode, 1)
  t.same(
    outputs,
    ['output_data', 'more_data'],
    'should output expected output'
  )
  t.match(logs.error, ['code EBADTHING'])
})

t.test('throw a non-error obj', async (t) => {
  const { exitHandler, logs, process } = await mockExitHandler(t)

  await exitHandler({
    code: 'ESOMETHING',
    message: 'foo bar',
  })

  t.equal(process.exitCode, 1)
  t.match(logs.error, [
    "weird error { code: 'ESOMETHING', message: 'foo bar' }",
  ])
})

t.test('throw a string error', async (t) => {
  const { exitHandler, logs, process } = await mockExitHandler(t)

  await exitHandler('foo bar')

  t.equal(process.exitCode, 1)
  t.match(logs.error, [
    'foo bar',
  ])
})

t.test('update notification - shows even with loglevel error', async (t) => {
  const { exitHandler, logs, npm } = await mockExitHandler(t, {
    config: { loglevel: 'error' },
  })
  npm.updateNotification = 'you should update npm!'

  await exitHandler()

  t.match(logs.notice, [
    'you should update npm!',
  ])
})

t.test('update notification - hidden with silent', async (t) => {
  const { exitHandler, logs, npm } = await mockExitHandler(t, {
    config: { loglevel: 'silent' },
  })
  npm.updateNotification = 'you should update npm!'

  await exitHandler()

  t.strictSame(logs.notice, [])
})

t.test('npm.config not ready', async (t) => {
  const { exitHandler, logs, errors, process } = await mockExitHandler(t, {
    load: false,
  })

  await exitHandler()

  t.equal(process.exitCode, 1)
  t.equal(errors().length, 1)
  t.match(errors(), [
    /Error: Exit prior to config file resolving/,
  ], 'should exit with config error msg')
  t.strictSame(logs, [], 'no logs if it doesnt load')
})

t.test('no logs dir', async (t) => {
  const { exitHandler, logs } = await mockExitHandler(t, {
    config: { 'logs-max': 0 },
  })
  await exitHandler(err('oh no'))

  t.match(logs.error[1],
    'Log files were not written due to the config logs-max=0')
  t.match(logs.filter((l) => l.includes('npm.load.mkdirplogs')), [])
})

t.test('timers fail to write', async (t) => {
  const { exitHandler, logs } = await mockExitHandler(t, {
    config: (dirs) => ({
      'logs-dir': resolve(dirs.prefix, 'LOGS_DIR'),
      timing: true,
    }),
    mocks: {
      // we want the fs.writeFileSync in the Timers class to fail
      '{LIB}/utils/timers.js': tmock(t, '{LIB}/utils/timers.js', {
        'node:fs': {
          ...fs,
          writeFileSync: (file, ...rest) => {
            if (file.includes('LOGS_DIR')) {
              throw new Error('timing_err')
            }

            return fs.writeFileSync(file, ...rest)
          },
        },
      }),
    },
  })

  await exitHandler()

  t.match(logs.warn[0], 'timing could not write timing file: Error: timing_err')
})

t.test('log files fail to write', async (t) => {
  const { exitHandler, logs } = await mockExitHandler(t, {
    config: (dirs) => ({
      'logs-dir': resolve(dirs.prefix, 'LOGS_DIR'),
    }),
    mocks: {
      // we want the fsMiniPass.WriteStreamSync in the LogFile class to fail
      '{LIB}/utils/log-file.js': tmock(t, '{LIB}/utils/log-file.js', {
        'fs-minipass': {
          ...fsMiniPass,
          WriteStreamSync: class {
            constructor (file) {
              if (file.includes('LOGS_DIR')) {
                throw new Error('err')
              }
            }
          },
        },
      }),
    },
  })

  await exitHandler(err())

  t.match(logs.error[1], `error writing to the directory`)
})

t.test('files from error message', async (t) => {
  const { exitHandler, logs, cache } = await mockExitHandler(t, {
    mocks: {
      '{LIB}/utils/explain-eresolve.js': {
        report: () => ({ explanation: 'explanation', file: 'eresolve contents' }),
      },
    },
  })

  await exitHandler(err('ERESOLVE'))

  const logFiles = fs.readdirSync(join(cache, '_logs'))
  const errorFileName = logFiles.find(f => f.endsWith('eresolve-report.txt'))
  const errorFile = fs.readFileSync(join(cache, '_logs', errorFileName)).toString()

  t.match(logs[3], /For a full report see:\n.*-eresolve-report\.txt/)
  t.match(errorFile, 'eresolve contents')
  t.match(errorFile, 'Log files:')
})

t.test('files from error message with error', async (t) => {
  const { exitHandler, logs } = await mockExitHandler(t, {
    config: (dirs) => ({
      'logs-dir': resolve(dirs.prefix, 'LOGS_DIR'),
    }),
    mocks: {
      '{LIB}/utils/explain-eresolve.js': {
        report: () => ({ explanation: 'explanation', file: 'eresolve contents' }),
      },
      'node:fs': {
        ...fs,
        writeFileSync: (dir) => {
          if (dir.includes('LOGS_DIR') && dir.endsWith('eresolve-report.txt')) {
            throw new Error('err')
          }
        },
      },
    },
  })

  await exitHandler(err('ERESOLVE'))

  t.match(logs.warn[0], /Could not write error message to.*eresolve-report\.txt.*err/)
})

t.test('timing with no error', async (t) => {
  const { exitHandler, timingFile, logs, process } = await mockExitHandler(t, {
    config: { timing: true, loglevel: 'info' },
  })

  await exitHandler()
  const timingFileData = await timingFile()

  t.equal(process.exitCode, 0)

  const msg = logs.info[0]
  t.match(msg, /Timing info written to:/)

  t.match(timingFileData, {
    metadata: {
      command: [],
      version: NPM_VERSION,
      logfiles: [String],
    },
    timers: {
      npm: Number,
    },
  })
})

t.test('timing message hidden by loglevel', async (t) => {
  const { exitHandler, logs, process } = await mockExitHandler(t, {
    config: { timing: true, loglevel: 'notice' },
  })

  await exitHandler()

  t.equal(process.exitCode, 0)

  t.strictSame(logs.info, [], 'no log message')
})

t.test('unfinished timers', async (t) => {
  const { exitHandler, timingFile, process } = await mockExitHandler(t, {
    config: { timing: true },
  })

  time.start('foo')
  time.start('bar')

  await exitHandler()
  const timingFileData = await timingFile()

  t.equal(process.exitCode, 0)
  t.match(timingFileData, {
    metadata: {
      command: [],
      version: NPM_VERSION,
      logfiles: [String],
    },
    timers: {
      npm: Number,
    },
    unfinishedTimers: {
      foo: [Number, Number],
      bar: [Number, Number],
    },
  })
})

t.test('uses code from errno', async (t) => {
  const { exitHandler, logs, process } = await mockExitHandler(t)

  await exitHandler(err('Error with errno', { errno: 127 }))
  t.equal(process.exitCode, 127)
  t.match(logs.error, ['errno 127'])
})

t.test('uses code from number', async (t) => {
  const { exitHandler, logs, process } = await mockExitHandler(t)

  await exitHandler(err('Error with code type number', 404))
  t.equal(process.exitCode, 404)
  t.match(logs.error, ['code 404'])
})

t.test('uses all err special properties', async t => {
  const { exitHandler, logs, process } = await mockExitHandler(t)

  const keys = ['code', 'syscall', 'file', 'path', 'dest', 'errno']
  const properties = keys.reduce((acc, k) => {
    acc[k] = `${k}-hey`
    return acc
  }, {})

  await exitHandler(err('Error with code type number', properties))
  t.equal(process.exitCode, 1)
  t.match(logs.error, keys.map((k) => `${k} ${k}-hey`), 'all special keys get logged')
})

t.test('verbose logs replace info on err props', async t => {
  const { exitHandler, logs, process } = await mockExitHandler(t, {
    config: { loglevel: 'verbose' },
  })

  const keys = ['type', 'stack', 'pkgid']
  const properties = keys.reduce((acc, k) => {
    acc[k] = `${k}-https://user:pass@registry.npmjs.org/`
    return acc
  }, {})

  await exitHandler(err('Error with code type number', properties))
  t.equal(process.exitCode, 1)
  t.match(
    logs.verbose.filter(l => !/^(logfile|title|argv)/.test(l)),
    keys.map((k) => `${k} ${k}-https://user:***@registry.npmjs.org/`),
    'all special keys get replaced'
  )
})

t.test('call exitHandler with no error', async (t) => {
  const { exitHandler, logs, process } = await mockExitHandler(t)

  await exitHandler()

  t.equal(process.exitCode, 0)
  t.match(logs.error, [])
})

t.test('defaults to log error msg if stack is missing when unloaded', async (t) => {
  const { exitHandler, logs, errors, process } = await mockExitHandler(t, { load: false })

  await exitHandler(err('Error with no stack', { code: 'ENOSTACK', errno: 127 }, true))
  t.equal(process.exitCode, 127)
  t.strictSame(errors(), ['Error with no stack'], 'should use error msg')
  t.strictSame(logs.error, [])
})

t.test('exits uncleanly when only emitting exit event', async (t) => {
  const { logs, process } = await mockExitHandler(t)

  process.emit('exit')

  t.match(logs.error, ['Exit handler never called!'])
  t.equal(process.exitCode, 1, 'exitCode coerced to 1')
})

t.test('do no fancy handling for shellouts', async t => {
  const mockShelloutExit = (t) => mockExitHandler(t, {
    command: 'exec',
    exec: true,
    argv: ['-c', 'exit'],
    config: {
      timing: false,
    },
  })

  t.test('shellout with a numeric error code', async t => {
    const { exitHandler, logs, errors, process } = await mockShelloutExit(t)
    await exitHandler(err('', 5))
    t.equal(process.exitCode, 5, 'got expected exit code')
    t.strictSame(logs.error, [], 'no noisy warnings')
    t.strictSame(logs.warn, [], 'no noisy warnings')
    t.strictSame(errors(), [])
  })

  t.test('shellout without a numeric error code (something in npm)', async t => {
    const { exitHandler, logs, errors, process } = await mockShelloutExit(t)
    await exitHandler(err('', 'banana stand'))
    t.equal(process.exitCode, 1, 'got expected exit code')
    t.strictNotSame(logs.error, [], 'bring the noise')
    t.strictSame(errors(), [])
  })

  t.test('shellout with code=0 (extra weird?)', async t => {
    const { exitHandler, logs, errors, process } = await mockShelloutExit(t)
    await exitHandler(Object.assign(new Error(), { code: 0 }))
    t.equal(process.exitCode, 1, 'got expected exit code')
    t.strictNotSame(logs.error, [], 'bring the noise')
    t.strictSame(errors(), [])
  })
})
