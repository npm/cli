const t = require('tap')

// NOTE lib/npm.js is wrapped in t.mock() every time because it's currently a
// singleton.  In the next semver major we will export the class and lib/cli.js
// can call `new` on it and then we won't have to do that anymore

const unsupportedMock = {
  checkForBrokenNode: () => {},
  checkForUnsupportedNode: () => {},
}

let exitHandlerCalled = null
let exitHandlerNpm = null
let exitHandlerCb
const exitHandlerMock = (...args) => {
  exitHandlerCalled = args
  if (exitHandlerCb)
    exitHandlerCb()
}
exitHandlerMock.setNpm = npm => {
  exitHandlerNpm = npm
}

const logs = []
const npmlogMock = {
  pause: () => logs.push('pause'),
  verbose: (...msg) => logs.push(['verbose', ...msg]),
  info: (...msg) => logs.push(['info', ...msg]),
}

const cliMock = (npm) => t.mock('../../lib/cli.js', {
  '../../lib/npm.js': npm,
  '../../lib/utils/update-notifier.js': async () => null,
  '../../lib/utils/unsupported.js': unsupportedMock,
  '../../lib/utils/exit-handler.js': exitHandlerMock,
  npmlog: npmlogMock,
})

const npmOutputs = []
const npmMock = () => {
  const npm = t.mock('../../lib/npm.js')
  npm.output = (...msg) => npmOutputs.push(msg)
  return npm
}

const processMock = (proc) => {
  const mocked = {
    ...process,
    on: () => {},
    ...proc,
  }
  // nopt looks at process directly
  process.argv = mocked.argv
  return mocked
}

const { argv } = process

t.afterEach(() => {
  logs.length = 0
  process.argv = argv
  npmOutputs.length = 0
  exitHandlerCalled = null
  exitHandlerNpm = null
})

t.test('print the version, and treat npm_g as npm -g', async t => {
  const proc = processMock({
    argv: ['node', 'npm_g', '-v'],
    version: process.version,
  })

  const npm = npmMock()
  const cli = cliMock(npm)
  await cli(proc)

  t.strictSame(proc.argv, ['node', 'npm', '-g', '-v'], 'npm process.argv was rewritten')
  t.strictSame(process.argv, ['node', 'npm', '-g', '-v'], 'system process.argv was rewritten')
  t.strictSame(logs, [
    'pause',
    ['verbose', 'cli', proc.argv],
    ['info', 'using', 'npm@%s', npm.version],
    ['info', 'using', 'node@%s', process.version],
  ])
  t.strictSame(npmOutputs, [[npm.version]])
  t.strictSame(exitHandlerCalled, [])
})

t.test('calling with --versions calls npm version with no args', async t => {
  const proc = processMock({
    argv: ['node', 'npm', 'install', 'or', 'whatever', '--versions'],
  })
  const npm = npmMock()
  const cli = cliMock(npm)

  let versionArgs
  npm.commands.version = (args, cb) => {
    versionArgs = args
    cb()
  }

  await cli(proc)
  t.strictSame(versionArgs, [])
  t.equal(proc.title, 'npm')
  t.strictSame(npm.argv, [])
  t.strictSame(logs, [
    'pause',
    ['verbose', 'cli', proc.argv],
    ['info', 'using', 'npm@%s', npm.version],
    ['info', 'using', 'node@%s', process.version],
  ])

  t.strictSame(npmOutputs, [])
  t.strictSame(exitHandlerCalled, [])
})

t.test('print usage if no params provided', async t => {
  const proc = processMock({
    argv: ['node', 'npm'],
  })

  const npm = npmMock()
  const cli = cliMock(npm)
  await cli(proc)
  t.match(npmOutputs[0][0], 'Usage:', 'outputs npm usage')
  t.match(exitHandlerCalled, [], 'should call exitHandler with no args')
  t.ok(exitHandlerNpm, 'exitHandler npm is set')
  t.match(proc.exitCode, 1)
})

t.test('print usage if non-command param provided', async t => {
  const proc = processMock({
    argv: ['node', 'npm', 'tset'],
  })

  const npm = npmMock()
  const cli = cliMock(npm)
  await cli(proc)
  t.match(npmOutputs[0][0], 'Unknown command: "tset"')
  t.match(npmOutputs[0][0], 'Did you mean this?')
  t.match(exitHandlerCalled, [], 'should call exitHandler with no args')
  t.ok(exitHandlerNpm, 'exitHandler npm is set')
  t.match(proc.exitCode, 1)
})

t.test('load error calls error handler', async t => {
  const proc = processMock({
    argv: ['node', 'npm', 'asdf'],
  })

  const npm = npmMock()
  const cli = cliMock(npm)
  const er = new Error('test load error')
  npm.load = () => Promise.reject(er)
  await cli(proc)
  t.strictSame(exitHandlerCalled, [er])
})
