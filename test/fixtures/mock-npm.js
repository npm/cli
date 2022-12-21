const os = require('os')
const fs = require('fs').promises
const path = require('path')
const mockLogs = require('./mock-logs')
const mockGlobals = require('./mock-globals')
const log = require('../../lib/utils/log-shim')
const ogLevel = log.level

const RealMockNpm = (t, otherMocks = {}, initOpts = {}) => {
  const mock = {
    ...mockLogs(otherMocks),
    outputs: [],
    outputErrors: [],
    joinedOutput: () => mock.outputs.map(o => o.join(' ')).join('\n'),
  }

  const Npm = t.mock('../../lib/npm.js', {
    '../../lib/utils/update-notifier.js': async () => {},
    ...otherMocks,
    ...mock.logMocks,
  })

  mock.Npm = class MockNpm extends Npm {
    constructor () {
      super(initOpts)
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

  return mock
}

const LoadMockNpm = async (t, {
  init = true,
  load = init,
  // test dirs
  prefixDir = {},
  homeDir = {},
  cacheDir = {},
  globalPrefixDir = { lib: {} },
  otherDirs = {},
  // setup config, env vars, mocks, npm opts
  config = {},
  mocks = {},
  globals = {},
  npm: npmOpts = {},
  argv: rawArgv = [],
} = {}) => {
  if (!init && load) {
    throw new Error('cant `load` without `init`')
  }

  mockGlobals(t, {
    process: {
      title: process.title,
      execPath: process.execPath,
      env: {
        npm_command: process.env.npm_command,
        COLOR: process.env.COLOR,
        // Mock some globals with their original values so they get torn down
        // back to the original at the end of the test since they are manipulated
        // by npm itself
        ...Object.keys(process.env).reduce((acc, k) => {
          if (k.startsWith('npm_config_')) {
            acc[k] = undefined
          }
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

  const { argv, env } = Object.entries({
    // We want to fail fast when writing tests. Default this to 0 unless it was
    // explicitly set in a test.
    'fetch-retries': 0,
    cache: dirs.cache,
    ...withDirs(config),
  })
    .reduce((acc, [k, v]) => {
      // nerfdart configs passed in need to be set via env var instead of argv
      if (k.startsWith('//')) {
        acc.env[`process.env.npm_config_${k}`] = v
      } else {
        acc.argv.push(`--${k}`, v.toString())
      }
      return acc
    }, { argv: [...rawArgv], env: {} })

  const { Npm, ...rest } = RealMockNpm(t,
    withDirs(mocks),
    { argv, excludeNpmCwd: true, ...withDirs(npmOpts) }
  )

  let npm = null
  if (init) {
    mockGlobals(t, { ...env, 'process.cwd': processCwd })
    npm = new Npm()
    if (load) {
      await npm.load()
    }
  }

  t.teardown(() => {
    // npmlog is a singleton so we need to reset the loglevel to the original
    // value between each test
    log.level = ogLevel
    if (npm) {
      npm.unload()
    }
  })

  return {
    ...rest,
    ...dirs,
    Npm,
    npm,
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

module.exports = {
  load: LoadMockNpm,
}
