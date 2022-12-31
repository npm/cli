const os = require('os')
const fs = require('fs').promises
const path = require('path')
const tap = require('tap')
const errorMessage = require('../../lib/utils/error-message')
const mockLogs = require('./mock-logs')
const mockGlobals = require('./mock-globals')
const log = require('../../lib/utils/log-shim')
const ogLevel = log.level

const getMockNpm = async (t, {
  mocks = {},
  globals = {},
  npm = {},
  init = false,
  load = false,
} = {}) => {
  const mock = {
    ...mockLogs(mocks),
    outputs: [],
    outputErrors: [],
    joinedOutput: () => mock.outputs.map(o => o.join(' ')).join('\n'),
  }

  const Npm = t.mock('../../lib/npm.js', {
    '../../lib/utils/update-notifier.js': async () => {},
    ...mocks,
    ...mock.logMocks,
  })

  mock.Npm = class MockNpm extends Npm {
    constructor () {
      mockGlobals(t, globals)
      super(npm)
    }

    async exec (...args) {
      const [res, err] = await super.exec(...args).then((r) => [r]).catch(e => [null, e])
      // This mimics how the exit handler flushes output for commands that have
      // buffered output. It also uses the same json error processing from the
      // error message fn. This is necessary for commands with buffered output
      // to read the output after exec is called. This is not *exactly* how it
      // works in practice, but it is close enough for now.
      this.flushOutput(err ? errorMessage(err, this).json : null)
      if (err) {
        throw err
      }
      return res
    }

    // lib/npm.js tests needs this to actually test the function!
    originalOutput (...args) {
      super.output(...args)
    }

    originalOutputError (...args) {
      super.outputError(...args)
    }

    output (...args) {
      mock.outputs.push(args)
    }

    outputError (...args) {
      mock.outputErrors.push(args)
    }
  }

  if (init) {
    mock.npm = new mock.Npm()
    if (load) {
      await mock.npm.load()
    }
  }

  return mock
}

const mockNpms = new WeakMap()

const setupMockNpm = async (t, {
  init = true,
  load = init,
  // preload a command
  command = null, // string name of the command
  exec = null, // optionally exec the command before returning
  // test dirs
  prefixDir = {},
  homeDir = {},
  cacheDir = {},
  globalPrefixDir = { lib: {} },
  otherDirs = {},
  // setup config, env vars, mocks, npm opts
  config: _config = {},
  mocks = {},
  globals = {},
  npm: npmOpts = {},
  argv: rawArgv = [],
} = {}) => {
  // easy to accidentally forget to pass in tap
  if (!(t instanceof tap.Test)) {
    throw new Error('first argument must be a tap instance')
  }

  // mockNpm is designed to only be run once per test so we assign it to the
  // test in the cache and error if it is attempted to run again
  if (!mockNpms.has(t)) {
    mockNpms.set(t, true)
  } else {
    throw new Error('each tap instance can only be used once with mockNpm')
  }

  if (!init && load) {
    throw new Error('cant `load` without `init`')
  }

  if (!init && load) {
    throw new Error('cant `load` without `init`')
  }

  const npmEnvs = Object.keys(process.env).filter(k => k.startsWith('npm_'))

  // These are globals manipulated by npm itself that we need to reset to their
  // original values between tests
  mockGlobals(t, {
    process: {
      title: process.title,
      execPath: process.execPath,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        COLOR: process.env.COLOR,
        // further, these are npm controlled envs that we need to zero out before
        // before the test. setting them to undefined ensures they are not set and
        // also returned to their original value after the test
        ...npmEnvs.reduce((acc, k) => {
          acc[k] = undefined
          return acc
        }, {}),
      },
    },
  })

  const dir = t.testdir({
    home: homeDir,
    prefix: prefixDir,
    cache: cacheDir,
    global: globalPrefixDir,
    other: otherDirs,
  })

  const dirs = {
    testdir: dir,
    prefix: path.join(dir, 'prefix'),
    cache: path.join(dir, 'cache'),
    globalPrefix: path.join(dir, 'global'),
    home: path.join(dir, 'home'),
    other: path.join(dir, 'other'),
  }

  // Option objects can also be functions that are called with all the dir paths
  // so they can be used to set configs that need to be based on paths
  const withDirs = (v) => typeof v === 'function' ? v(dirs) : v

  const { argv, env, config } = Object.entries({
    // We want to fail fast when writing tests. Default this to 0 unless it was
    // explicitly set in a test.
    'fetch-retries': 0,
    cache: dirs.cache,
    ...withDirs(_config),
  })
    .reduce((acc, [key, value]) => {
      // nerfdart configs passed in need to be set via env var instead of argv
      if (key.startsWith('//')) {
        acc.env[`process.env.npm_config_${key}`] = value
      } else {
        const values = [].concat(value)
        acc.argv.push(...values.flatMap(v => [`--${key}`, v.toString()]))
      }
      acc.config[key] = value
      return acc
    }, { argv: [...rawArgv], env: {}, config: {} })

  // process.cwd shouldnt be mocked unless we are actually initializing npm
  // here, since it messes with other things like t.mock paths
  const { 'process.cwd': processCwd, ...mockedGlobals } = {
    'process.env.HOME': dirs.home,
    // global prefix and prefix cannot be (easily) set via argv
    // so this is the easiest way to set them that also closely mimics the
    // behavior a user would see since they will already be set while
    // `npm.load()` is being run
    'process.env.PREFIX': dirs.globalPrefix,
    'process.cwd': () => dirs.prefix,
    ...withDirs(globals),
  }

  mockGlobals(t, mockedGlobals)

  const { npm, ...mockNpm } = await getMockNpm(t, {
    init,
    load,
    mocks: withDirs(mocks),
    npm: { argv, excludeNpmCwd: true, ...withDirs(npmOpts) },
    globals: { ...env, 'process.cwd': processCwd },
  })

  if (config.omit?.includes('prod')) {
    // XXX: --omit=prod is not a valid config according to the definitions but
    // it was being hacked in via flatOptions for older tests so this is to
    // preserve that behavior and reduce churn in the snapshots. this should be
    // removed or fixed in the future
    npm.flatOptions.omit.push('prod')
  }

  t.teardown(() => {
    // npmlog is a singleton so we need to reset the loglevel to the original
    // value between each test
    log.level = ogLevel
    if (npm) {
      npm.unload()
    }
  })

  const mockCommand = {}
  if (command) {
    const cmd = await npm.cmd(command)
    const usage = await cmd.usage
    mockCommand.cmd = cmd
    mockCommand[command] = {
      usage,
      exec: (args) => npm.exec(command, args),
      completion: (args) => cmd.completion(args),
    }
    if (exec) {
      await mockCommand[command].exec(exec)
      // assign string output to the command now that we have it
      // for easier testing
      mockCommand[command].output = mockNpm.joinedOutput()
    }
  }

  return {
    npm,
    ...mockNpm,
    ...dirs,
    ...mockCommand,
    debugFile: async () => {
      const readFiles = npm.logFiles.map(f => fs.readFile(f))
      const logFiles = await Promise.all(readFiles)
      return logFiles
        .flatMap((d) => d.toString().trim().split(os.EOL))
        .filter(Boolean)
        .join('\n')
    },
    timingFile: async () => {
      const data = await fs.readFile(npm.timingFile, 'utf8')
      return JSON.parse(data)
    },
  }
}

module.exports = setupMockNpm
module.exports.load = setupMockNpm
