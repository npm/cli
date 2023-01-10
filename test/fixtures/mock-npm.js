const os = require('os')
const fs = require('fs').promises
const path = require('path')
const tap = require('tap')
const { EnvKeys, ProcessKeys } = require('@npmcli/config')
const errorMessage = require('../../lib/utils/error-message')
const mockLogs = require('./mock-logs')
const mockGlobals = require('@npmcli/mock-globals')
const tmock = require('./tmock')
const defExitCode = process.exitCode
const npmRoot = path.resolve(__dirname, '../../')

// changes to the supplied directory and returns a function
// to reset at the end of a test
const changeDir = (dir) => {
  if (dir) {
    const cwd = process.cwd()
    process.chdir(dir)
    return () => process.chdir(cwd)
  }
  return () => {}
}

// takes the passed in testdir options for the global directory and rewrites
// the nested depth and any symlinks to match the desired location based on the
// platform. windows wants everything at `GLOBAL/node_modules` and other platforms
// want `GLOBAL/lib/node_modules`
const setGlobalNodeModules = (globalDir) => {
  const updateSymlinks = (obj, visit) => {
    for (const [key, value] of Object.entries(obj)) {
      if (/Fixture<symlink>/.test(value.toString())) {
        obj[key] = tap.fixture('symlink', path.join('..', value.content))
      } else if (typeof value === 'object') {
        obj[key] = updateSymlinks(value, visit)
      }
    }
    return obj
  }

  if (globalDir.lib) {
    throw new Error('`globalPrefixDir` should not have a top-level `lib/` directory, only a ' +
      'top-level `node_modules/` dir that gets set in the correct location based on platform. ' +
      `Received the following top level entries: ${Object.keys(globalDir).join(', ')}.`
    )
  }

  if (process.platform !== 'win32' && globalDir.node_modules) {
    const { node_modules: nm, ...rest } = globalDir
    return {
      ...rest,
      lib: { node_modules: updateSymlinks(nm) },
    }
  }

  return globalDir
}

const getMockNpm = async (t, { mocks, init, load, npm: npmOpts }) => {
  const mock = {
    ...mockLogs(mocks),
    outputs: [],
    outputErrors: [],
    joinedOutput: () => mock.outputs.map(o => o.join(' ')).join('\n'),
  }

  const Npm = tmock(t, '{LIB}/npm.js', {
    // update-notifier is designed to not await until its finished
    // so we always mock it to a sync noop function so tests will
    // always complete. the actual update notifier is tested separately
    '{LIB}/utils/update-notifier.js': () => {},
    ...mocks,
    ...mock.logMocks,
  })

  mock.Npm = class extends Npm {
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
    mock.npm = new mock.Npm(npmOpts)
    if (load) {
      await mock.npm.load()
    }
  }

  return mock
}

const mockNpms = new Map()

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
  globalPrefixDir = { node_modules: {} },
  otherDirs = {},
  chdir = ({ prefix }) => prefix,
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

  // mockNpm is designed to only be run once per test chain so we assign it to
  // the test in the cache and error if it is attempted to run again
  let tapInstance = t
  while (tapInstance) {
    if (mockNpms.has(tapInstance)) {
      throw new Error('mockNpm can only be called once in each t.test chain')
    }
    tapInstance = tapInstance.parent
  }
  mockNpms.set(t, true)

  if (!init && load) {
    throw new Error('cant `load` without `init`')
  }

  // These are globals manipulated by npm itself that we need to reset to their
  // original values between tests
  mockGlobals(t, {
    process: {
      ...['title', ...ProcessKeys].reduce((acc, k) => {
        acc[k] = process[k]
        return acc
      }, {}),
      env: {
        ...EnvKeys.reduce((acc, k) => {
          // XXX: we could ensure an original value for all these configs if we wanted
          // to normalize them across all tests and require tests set them explicitly
          acc[k] = process.env[k]
          return acc
        }, {}),
        // further, these are npm controlled envs that we need to zero out before
        // the test. setting them to undefined ensures they are not set and
        // also returned to their original value after the test
        ...Object.keys(process.env).filter(k => k.startsWith('npm_')).reduce((acc, k) => {
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
    global: setGlobalNodeModules(globalPrefixDir),
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

  const teardownDir = changeDir(withDirs(chdir))

  const defaultConfigs = {
    // We want to fail fast when writing tests. Default this to 0 unless it was
    // explicitly set in a test.
    'fetch-retries': 0,
    cache: dirs.cache,
  }

  const { argv, env } = Object.entries({ ...defaultConfigs, ...withDirs(_config) })
    .reduce((acc, [key, value]) => {
      // nerfdart configs passed in need to be set via env var instead of argv
      // and quoted with `"` so mock globals will ignore that it contains dots
      if (key.startsWith('//')) {
        acc.env[`process.env."npm_config_${key}"`] = value
      } else {
        const values = [].concat(value)
        acc.argv.push(...values.flatMap(v => [`--${key}`, v.toString()]))
      }
      return acc
    }, { argv: [...rawArgv], env: {} })

  mockGlobals(t, {
    'process.env.HOME': dirs.home,
    // global prefix cannot be set via argv without affecting other prefixes so
    // this is the easiest way to set it that also closely mimics the behavior a
    // user would see since it will already be set while `npm.load()` is being
    // run Note that this only sets the global prefix and the prefix is set via
    // chdir
    'process.env.PREFIX': dirs.globalPrefix,
    ...withDirs(globals),
    ...env,
  })

  const { npm, Npm, ...mockNpm } = await getMockNpm(t, {
    init,
    load,
    mocks: withDirs(mocks),
    npm: { argv, npmRoot, cwdRoot: dir, ...withDirs(npmOpts) },
  })

  t.teardown(() => {
    if (npm) {
      npm.unload()
    }
    // only set exitCode back if we're passing tests
    if (t.passing()) {
      process.exitCode = defExitCode
    }
    teardownDir()
  })

  const mockCommand = {}
  if (command) {
    const camelCommand = command.replace(/-[a-z]/g, (...a) => a[1].toUpperCase())
    const Cmd = Npm.cmd(command)
    mockCommand.Cmd = Cmd
    mockCommand[camelCommand] = {
      usage: Cmd.describeUsage,
      exec: (args) => npm.exec(command, args),
      completion: (args) => Cmd.completion(args, npm),
    }
    if (exec) {
      await mockCommand[command].exec(exec)
      // assign string output to the command now that we have it
      // for easier testing
      mockCommand[command].output = mockNpm.joinedOutput()
    }
  }

  return {
    Npm,
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
module.exports.setGlobalNodeModules = setGlobalNodeModules
