const fs = require('fs/promises')
const { existsSync } = require('fs')
const { join, resolve, sep, extname, relative, delimiter } = require('path')
const which = require('which')
const spawn = require('@npmcli/promise-spawn')
const MockRegistry = require('@npmcli/mock-registry')
const http = require('http')
const { createProxy } = require('proxy')

const { SMOKE_PUBLISH_NPM, SMOKE_PUBLISH_TARBALL, CI, PATH, Path } = process.env

const DEFAULT_REGISTRY = new URL('https://registry.npmjs.org/')
const MOCK_REGISTRY = new URL('http://smoke-test-registry.club/')

const NODE_PATH = process.execPath
const CLI_ROOT = resolve(process.cwd(), '..')
const CLI_JS_BIN = join('bin', 'npm-cli.js')
const NPM_PATH = join(CLI_ROOT, CLI_JS_BIN)

const WINDOWS = process.platform === 'win32'
const GLOBAL_BIN = WINDOWS ? '' : 'bin'
const GLOBAL_NODE_MODULES = join(WINDOWS ? '' : 'lib', 'node_modules')

const getOpts = (...a) => {
  const [opts, args] = a.reduce((acc, arg) => {
    acc[typeof arg === 'object' ? 0 : 1].push(arg)
    return acc
  }, [[], []])
  return [Object.assign({}, ...opts), args]
}

const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')

const testdirHelper = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    if (extname(key) === '.json') {
      obj[key] = JSON.stringify(value, null, 2)
    } else if (typeof value === 'object') {
      obj[key] = testdirHelper(value)
    } else {
      obj[key] = value
    }
  }
  return obj
}

const getNpmRoot = (helpText) => {
  return helpText
    .split('\n')
    .slice(-1)[0]
    .match(/^npm@.*?\s(.*)$/)
    ?.[1]
}

const getCleanPaths = async () => {
  const cliBin = join('bin', 'npm')
  const npmLinks = await which('npm', { all: true })
  const npmPaths = await Promise.all(npmLinks.map(npm => fs.realpath(npm)))

  const cleanNpmPaths = [...new Set([
    CLI_ROOT,
    join(CLI_ROOT, cliBin),
    join(CLI_ROOT, CLI_JS_BIN),
    ...npmLinks,
    ...npmPaths,
    ...npmPaths.map(n => n.replace(sep + cliBin, '')),
    ...npmPaths.map(n => n.replace(sep + CLI_JS_BIN, '')),
  ])]

  return Object.entries({
    NODE: NODE_PATH,
    NPM: cleanNpmPaths,
  })
}

module.exports = async (t, { testdir = {}, debug, mockRegistry = true, useProxy = false } = {}) => {
  const debugLog = debug || CI ? (...a) => console.error(...a) : () => {}
  const cleanPaths = await getCleanPaths()

  // setup fixtures
  const root = t.testdir({
    cache: {},
    project: { '.npmrc': '' },
    global: { '.npmrc': '' },
    home: { '.npmrc': '' },
    ...testdirHelper(testdir),
  })
  const paths = {
    root,
    project: join(root, 'project'),
    global: join(root, 'global'),
    home: join(root, 'home'),
    userConfig: join(root, 'home', '.npmrc'),
    globalConfig: join(root, 'global', '.npmrc'),
    cache: join(root, 'cache'),
    globalBin: join(root, 'global', GLOBAL_BIN),
    globalNodeModules: join(root, 'global', GLOBAL_NODE_MODULES),
  }

  const registry = !mockRegistry ? DEFAULT_REGISTRY : new MockRegistry({
    tap: t,
    registry: MOCK_REGISTRY,
    debug,
    strict: true,
  })

  const proxyEnv = {}
  if (useProxy || mockRegistry) {
    useProxy = true
    const proxyServer = createProxy(http.createServer())
    await new Promise(res => proxyServer.listen(0, res))
    t.teardown(() => proxyServer.close())
    proxyEnv.HTTP_PROXY = new URL(`http://localhost:${proxyServer.address().port}`)
  }

  // update notifier should never be written
  t.afterEach((t) => {
    t.equal(existsSync(join(paths.cache, '_update-notifier-last-checked')), false)
  })

  const cleanOutput = s => {
    // sometimes we print normalized paths in snapshots regardless of
    // platform so replace those first then replace platform style paths
    for (const [key, value] of cleanPaths) {
      const values = [].concat(value)
      for (const v of values) {
        s = s.split(normalizePath(v)).join(`{${key}}`)
      }
    }
    for (const [key, value] of cleanPaths) {
      const values = [].concat(value)
      for (const v of values) {
        s = s.split(v).join(`{${key}}`)
      }
    }
    return s
      .split(relative(CLI_ROOT, t.testdirName)).join('{TESTDIR}')
      .split(registry.origin).join('{REGISTRY}')
      .replace(/\\+/g, '/')
      .replace(/\r\n/g, '\n')
      .replace(/ \(in a browser\)/g, '')
      .replace(/^npm@.* /gm, 'npm ')
      .replace(/[0-9TZ_-]*debug-[0-9]+.log$/gm, '{LOG}')
      .replace(/in \d+[ms]+$/gm, 'in {TIME}')
  }
  const log = (...a) => debugLog(cleanOutput(a.join(' ')))
  t.cleanSnapshot = cleanOutput

  const getPath = () => `${paths.globalBin}${delimiter}${Path || PATH}`
  const getEnvPath = () => ({ [Path ? 'Path' : 'PATH']: getPath() })

  const baseSpawn = async (spawnCmd, spawnArgs, {
    cwd = paths.project,
    env,
    stderr: _stderr,
    ...opts } = {}
  ) => {
    log(`CWD: ${cwd}`)
    log(`${spawnCmd} ${spawnArgs.join(' ')}`)
    log('-'.repeat(40))

    const { stderr, stdout } = await spawn(spawnCmd, spawnArgs, {
      cwd,
      env: {
        ...getEnvPath(),
        HOME: paths.root,
        ComSpec: process.env.ComSpec,
        ...env,
      },
      ...opts,
    })

    log(stderr)
    log('-'.repeat(40))
    log(stdout)
    log('='.repeat(40))

    return _stderr ? { stderr, stdout } : stdout
  }

  const baseNpm = async (...a) => {
    const [{ cwd, cmd, argv = [], proxy = useProxy, ...opts }, args] = getOpts(...a)

    const isGlobal = args.some(arg => ['-g', '--global', '--global=true'].includes(arg))

    const defaultFlags = [
      `--registry=${registry.origin}`,
      `--cache=${paths.cache}`,
      `--prefix=${isGlobal ? paths.global : cwd}`,
      `--userconfig=${paths.userConfig}`,
      `--globalconfig=${paths.globalConfig}`,
      '--no-audit',
      '--no-update-notifier',
      '--loglevel=silly',
      '--fetch-retries=0',
    ].filter(Boolean)

    const cliArgv = args.reduce((acc, arg) => {
      if (arg.startsWith('-')) {
        acc[1].push(arg)
      } else {
        acc[0].push(arg)
      }
      return acc
    }, [[], defaultFlags]).reduce((acc, i) => acc.concat(i), [])

    return baseSpawn(cmd, [...argv, ...cliArgv], {
      cwd,
      env: {
        ...opts.env,
        ...proxy ? proxyEnv : {},
      },
      ...opts,
    })
  }

  const npmLocal = async (...args) => {
    const [{ force = false }] = getOpts(...args)
    if (SMOKE_PUBLISH_NPM && !force) {
      throw new Error('npmLocal cannot be called during smoke-publish')
    }
    return baseNpm({
      cwd: CLI_ROOT,
      cmd: process.execPath,
      argv: ['.'],
      proxy: false,
    }, ...args)
  }

  const npmPath = async (...args) => baseNpm({
    cwd: paths.project,
    cmd: 'npm',
    shell: true,
  }, ...args)

  const npm = async (...args) => baseNpm({
    cwd: paths.project,
    cmd: process.execPath,
    argv: [NPM_PATH],
  }, ...args)

  // helpers for reading/writing files and their source
  const readFile = async (f) => {
    const file = await fs.readFile(join(paths.project, f), 'utf-8')
    return extname(f) === '.json' ? JSON.parse(file) : file
  }

  return {
    npmPath,
    npmLocal,
    npm: SMOKE_PUBLISH_NPM ? npmPath : npm,
    spawn: baseSpawn,
    readFile,
    getPath,
    paths,
    registry,
    npmLocalTarball: async () => SMOKE_PUBLISH_TARBALL ??
      npmLocal('pack', `--pack-destination=${root}`).then(r => join(root, r)),
  }
}

module.exports.testdir = testdirHelper
module.exports.getNpmRoot = getNpmRoot
module.exports.CLI_ROOT = CLI_ROOT
module.exports.WINDOWS = WINDOWS
module.exports.SMOKE_PUBLISH = !!SMOKE_PUBLISH_NPM
module.exports.SMOKE_PUBLISH_TARBALL = SMOKE_PUBLISH_TARBALL
module.exports.MOCK_REGISTRY = MOCK_REGISTRY
