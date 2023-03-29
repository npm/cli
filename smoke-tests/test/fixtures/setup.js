const fs = require('fs/promises')
const { existsSync } = require('fs')
const { join, resolve, sep, extname, relative, delimiter } = require('path')
const which = require('which')
const spawn = require('@npmcli/promise-spawn')
const justExtend = require('just-extend')
const justSet = require('just-safe-set')
const MockRegistry = require('@npmcli/mock-registry')
const { Blob } = require('buffer')
const http = require('http')
const httpProxy = require('http-proxy')

const { SMOKE_PUBLISH_NPM, CI, PATH, Path, TAP_CHILD_ID = '0' } = process.env
const PORT = 12345 + (+TAP_CHILD_ID)
const CLI_ROOT = resolve(process.cwd(), '..')

const set = (obj, ...args) => justSet(obj, ...args) && obj
const merge = (...args) => justExtend(true, ...args)
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

const getSpawnArgs = async () => {
  const cliBin = join('bin', 'npm')
  const cliJsBin = join('bin', 'npm-cli.js')
  const npmLinks = await which('npm', { all: true })
  const npmPaths = await Promise.all(npmLinks.map(npm => fs.realpath(npm)))

  const cleanNpmPaths = [...new Set([
    CLI_ROOT,
    join(CLI_ROOT, cliBin),
    join(CLI_ROOT, cliJsBin),
    ...npmLinks,
    ...npmPaths,
    ...npmPaths.map(n => n.replace(sep + cliBin, '')),
    ...npmPaths.map(n => n.replace(sep + cliJsBin, '')),
  ])]

  if (SMOKE_PUBLISH_NPM) {
    return {
      command: ['npm'],
      NPM: cleanNpmPaths,
    }
  }

  return {
    command: [process.execPath, join(CLI_ROOT, cliJsBin)],
    NODE: process.execPath,
    NPM: cleanNpmPaths,
  }
}

module.exports = async (t, { testdir = {}, debug } = {}) => {
  // setup fixtures
  const root = t.testdir({
    cache: {},
    project: { '.npmrc': '' },
    bin: {},
    global: { '.npmrc': '' },
    ...testdirHelper(testdir),
  })
  const paths = {
    root,
    project: join(root, 'project'),
    global: join(root, 'global'),
    userConfig: join(root, 'project', '.npmrc'),
    globalConfig: join(root, 'global', '.npmrc'),
    cache: join(root, 'cache'),
    bin: join(root, 'bin'),
  }

  const registry = new MockRegistry({
    tap: t,
    registry: 'http://smoke-test-registry.club/',
    debug,
    strict: true,
  })
  const httpProxyRegistry = `http://localhost:${PORT}`
  const proxy = httpProxy.createProxyServer({})
  const server = http.createServer((req, res) => proxy.web(req, res, { target: registry.origin }))
  await new Promise(res => server.listen(PORT, res))
  t.teardown(() => server.close())

  // update notifier should never be written
  t.afterEach((t) => {
    t.equal(existsSync(join(paths.cache, '_update-notifier-last-checked')), false)
  })

  const debugLog = debug || CI ? (...a) => console.error(...a) : () => {}
  const { command, ...spawnPaths } = await getSpawnArgs({ log: debugLog })
  const cleanPaths = Object.entries(spawnPaths)

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
      .split(httpProxyRegistry).join('{REGISTRY}')
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

  const npm = async (...args) => {
    const defaultFlags = [
    `--registry=${httpProxyRegistry}`,
    `--cache=${paths.cache}`,
    `--prefix=${paths.project}`,
    `--userconfig=${paths.userConfig}`,
    `--globalconfig=${paths.globalConfig}`,
    '--no-audit',
    '--no-update-notifier',
    '--loglevel=silly',
    '--fetch-retries=0',
    ]
    const [positionals, flags] = args.reduce((acc, arg) => {
      if (arg.startsWith('-')) {
        acc[1].push(arg)
      } else {
        acc[0].push(arg)
      }
      return acc
    }, [[], defaultFlags])

    const spawnCmd = command[0]
    const spawnArgs = [...command.slice(1), ...positionals, ...flags]

    log(`${spawnCmd} ${spawnArgs.filter(a => !defaultFlags.includes(a)).join(' ')}`)
    log('-'.repeat(40))

    const { stderr, stdout } = await spawn(spawnCmd, spawnArgs, {
      cwd: paths.project,
      env: {
        HTTP_PROXY: httpProxyRegistry,
        HOME: paths.root,
        [Path ? 'Path' : 'PATH']: `${Path || PATH}${delimiter}${paths.bin}`,
        COMSPEC: process.env.COMSPEC,
      },
    })

    log(stderr)
    log('-'.repeat(40))
    log(stdout)
    log('='.repeat(40))

    return cleanOutput(stdout)
  }

  // helpers for reading/writing files and their source
  const readFile = async (f) => {
    const file = await fs.readFile(join(paths.project, f), 'utf-8')
    return extname(f) === '.json' ? JSON.parse(file) : file
  }

  // Returns a recurisve list of relative file paths in the testdir root
  // will also follow symlinks and print their relative paths
  const tree = async (rootDir = paths.project, dir = rootDir) => {
    const results = {}
    for (const item of await fs.readdir(dir)) {
      const itemPath = join(dir, item)
      const relPath = relative(rootDir, itemPath)
      const stat = await fs.lstat(itemPath)

      if (stat.isSymbolicLink()) {
        const realpath = await fs.realpath(itemPath)
        merge(results, await tree(rootDir, realpath))
      } else if (stat.isDirectory()) {
        merge(results, await tree(rootDir, itemPath))
      } else {
        const raw = await readFile(relPath)
        const content = typeof raw === 'string' ? `${new Blob([raw]).size} bytes` : raw
        merge(results, set({}, relPath.split(sep), content))
      }
    }
    return results
  }

  return {
    npm,
    readFile,
    tree,
    paths,
    registry,
    isSmokePublish: !!SMOKE_PUBLISH_NPM,
  }
}

module.exports.testdir = testdirHelper
