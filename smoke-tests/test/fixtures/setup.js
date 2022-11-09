const fs = require('fs/promises')
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

const set = (obj, ...args) => justSet(obj, ...args) && obj
const merge = (...args) => justExtend(true, ...args)
const normalizePath = path => path.replace(/[A-Z]:/, '').replace(/\\/g, '/')
const exists = (f) => fs.access(f, fs.constants.F_OK).catch(() => false)

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

const getNpm = async () => {
  const cliRoot = resolve(__dirname, '..', '..', '..')
  const cliBin = join('bin', 'npm-cli.js')

  if (SMOKE_PUBLISH_NPM) {
    return {
      command: ['npm'],
      cleanPaths: [
        cliRoot,
        await which('npm').then(p => fs.realpath(p).replace(sep + cliBin)),
      ],
    }
  }

  return {
    command: [process.execPath, join(cliRoot, cliBin)],
    cleanPaths: [process.execPath, cliRoot],
  }
}

module.exports = async (t, { testdir = {}, debug } = {}) => {
  const { command, cleanPaths } = await getNpm(t)

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
  })
  const httpProxyRegistry = `http://localhost:${PORT}/`
  const proxy = httpProxy.createProxyServer({})
  const server = http.createServer((req, res) => proxy.web(req, res, { target: registry.origin }))
  await new Promise(res => server.listen(PORT, res))
  t.teardown(() => server.close())

  // update notifier should never be written
  t.afterEach(async (t) => {
    const updateExists = await exists(join(paths.cache, '_update-notifier-last-checked'))
    t.equal(updateExists, false)
    // this requires that mocks not be shared between sub tests but it helps
    // find mistakes quicker instead of waiting for the entire test to end
    t.strictSame(registry.nock.pendingMocks(), [], 'no pending mocks after each')
    t.strictSame(registry.nock.activeMocks(), [], 'no active mocks after each')
  })

  const cleanOutput = s => {
    // sometimes we print normalized paths in snapshots regardless of
    // platform so replace those first then replace platform style paths
    for (const cleanPath of cleanPaths) {
      s = s
        .split(normalizePath(cleanPath)).join('{CWD}')
        .split(cleanPath).join('{CWD}')
        .split(relative(cleanPath, t.testdirName)).join('{TESTDIR}')
    }

    return s.split(httpProxyRegistry).join('{REGISTRY}')
      .replace(/\\+/g, '/')
      .replace(/\r\n/g, '\n')
      .replace(/ \(in a browser\)/g, '')
      .replace(/^npm@.* /gm, 'npm ')
      .replace(/^.*debug-[0-9]+.log$/gm, '')
      .replace(/in \d+ms$/gm, 'in {TIME}')
  }
  t.cleanSnapshot = cleanOutput
  const log = !debug && !CI ? () => {} : (...args) => {
    console.error(...args.map(a => cleanOutput(a.toString())))
  }

  const npm = async (...args) => {
    const defaultCmd = []
    const defaultOpts = [
    `--registry=${httpProxyRegistry}`,
    `--cache=${paths.cache}`,
    `--prefix=${paths.project}`,
    `--userconfig=${paths.userConfig}`,
    `--globalconfig=${paths.globalConfig}`,
    '--no-audit',
    '--no-update-notifier',
    '--loglevel=silly',
    '--fetch-timeout=5000',
    '--fetch-retries=0',
    ]

    const [cmd, opts] = args.reduce((acc, arg) => {
      if (arg.startsWith('--')) {
        acc[1].push(arg)
      } else {
        acc[0].push(arg)
      }
      return acc
    }, [defaultCmd, defaultOpts])

    const spawnCmd = command[0]
    const spawnArgs = [...command.slice(1), ...cmd, ...opts]

    log('='.repeat(40))
    log(`\n${spawnCmd} ${spawnArgs.join(' ')}`)

    const { stderr, stdout } = await spawn(spawnCmd, spawnArgs, {
      cwd: paths.project,
      env: {
        HTTP_PROXY: httpProxyRegistry,
        HOME: paths.root,
        [Path ? 'Path' : 'PATH']: `${Path || PATH}${delimiter}${paths.bin}`,
        COMSPEC: process.env.COMSPEC,
      },
    })

    log('\n' + stderr)
    log('\n' + stdout)
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
