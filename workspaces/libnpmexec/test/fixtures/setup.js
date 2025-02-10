
const fs = require('node:fs/promises')
const { existsSync } = require('node:fs')
const { resolve, extname, join } = require('node:path')
const binLinks = require('bin-links')
const MockRegistry = require('@npmcli/mock-registry')
const justExtend = require('just-extend')
const set = require('just-safe-set')

const merge = (...args) => justExtend(true, ...args)

const DEFAULT_BIN_FILE = 'bin-file.js'

const createPkg = ({
  name = '@npmcli/create-index',
  bin,
  files,
  versions = [],
  version,
  localVersion,
}) => {
  if (localVersion && !versions.includes(localVersion)) {
    versions = [...versions, localVersion]
  }
  if (version && !versions.includes(version)) {
    versions = [...versions, version]
  }

  const defaultBinName = name.includes('/') ? name.split('/')[1] : name

  if (!bin) {
    bin = {
      [defaultBinName]: `./${DEFAULT_BIN_FILE}`,
    }
  }

  const pkgsArr = versions.map((v) => ({
    name,
    version: v,
    bin,
  }))

  const pkgs = {}
  const tarballs = {}
  const fixtures = {}

  for (const pkg of pkgsArr) {
    pkgs[pkg.version] = pkg
  }

  if (localVersion) {
    set(fixtures, ['node_modules', ...name.split('/')], {
      'package.json': pkgs[localVersion],
      ...files || {
        [DEFAULT_BIN_FILE]: { key: name, value: `local-${localVersion}` },
      },
    })
    fixtures['package.json'] = {
      name: 'pkg',
      version: '9.9.9',
      dependencies: {
        [name]: `^${localVersion}`,
      },
    }
  }

  for (const pkg of pkgsArr) {
    const fixturePath = `${pkg.name}-${pkg.version}`.replace('/', '-')
    set(fixtures, ['packages', fixturePath], {
      'package.json': pkg,
      ...files || {
        [DEFAULT_BIN_FILE]: { key: pkg.name, value: `packages-${pkg.version}` },
      },
    })
    tarballs[pkg.version] = join('packages', fixturePath)
  }

  return {
    pkg: pkgsArr[0],
    pkgs,
    fixtures,
    package: ({ registry, path, tarballs: tgz = versions, ...opts }) => registry.package({
      times: 2,
      manifest: registry.manifest({ name: pkgsArr[0].name, packuments: pkgsArr }),
      tarballs: tgz.reduce((acc, v) => {
        acc[v] = resolve(path, tarballs[v])
        return acc
      }, {}),
      ...opts,
    }),
  }
}

const createTestdir = (...objs) => {
  const testdirHelper = (obj, ancestors = []) => {
    for (const [key, value] of Object.entries(obj)) {
      if (extname(key) === '.json') {
        obj[key] = JSON.stringify(value, null, 2)
      } else if (extname(key) === '.js' || ancestors.slice(-2).join('/') === 'node_modules/.bin') {
        // a js or bin file is converted to a bin script that writes a file
        obj[key] = `#!/usr/bin/env node\nrequire('fs').writeFileSync(
          'output-${value.key.replace('/', '-')}',
          JSON.stringify({
            value: '${value.value}',
            args: process.argv.slice(2),
            created: '${[...ancestors, key].join('/')}',
          })
        )`
      } else if (value && typeof value === 'object') {
        obj[key] = testdirHelper(value, [...ancestors, key])
      } else {
        obj[key] = value
      }
    }
    return obj
  }

  return testdirHelper(merge(...objs))
}

const setup = (t, {
  pkg,
  testdir: _testdir = {},
  mocks,
  global,
  debug,
  execPath,
  defaults = true,
} = {}) => {
  const registry = new MockRegistry({
    tap: t,
    registry: 'http://smoke-test-registry.club/',
    strict: true,
    debug,
  })

  if (debug) {
    process.on('log', console.error)
    t.teardown(() => process.off('log', console.error))
  }

  const { node_modules: testdirNm, ...testdir } = _testdir
  const fullTestdir = createTestdir({
    cache: {},
    npxCache: {},
    ...testdirNm ?
      global ? {
        global: {
          node_modules: {
            '.bin': {},
            ...testdirNm,
          },
        },
      } : {
        node_modules: {
          '.bin': {},
          ...testdirNm,
        },
      }
      : {},
  }, testdir)

  // quick way to remove undefined  and null values that we merged
  // in to not write certain directories
  const path = t.testdir(JSON.parse(JSON.stringify(fullTestdir, (_, v) => {
    if (v === null) {
      return
    }
    if (typeof v === 'string') {
      return v.replace(/\{REGISTRY\}/g, registry.origin)
    }
    return v
  }))
  )

  const cache = resolve(path, 'cache')
  const npxCache = resolve(path, 'npxCache')
  const nodeModules = resolve(path, global ? 'global/node_modules' : 'node_modules')

  const defaultOpts = {
    call: '',
    color: false,
    localBin: '',
    globalBin: '',
    packages: [],
    scriptShell: undefined,
    yes: true,
    path,
    runPath: path,
  }

  const baseOpts = {
    audit: false,
    registry: registry.origin + '/',
    ...existsSync(cache) ? { cache } : {},
    ...existsSync(npxCache) ? { npxCache } : {},
    ...global ? {
      globalBin: resolve(path, nodeModules, '.bin'),
      globalPath: resolve(path, 'global'),
    } : {},
  }

  return {
    path,
    registry,
    chmod: async (chmodPath) => {
      if (!chmodPath) {
        for (const p of [].concat(pkg)) {
          await fs.chmod(resolve(path, nodeModules, p.name, DEFAULT_BIN_FILE), 0o775)
        }
        return
      }
      return fs.chmod(resolve(path, chmodPath), 0o775)
    },
    binLinks: async (binPkg) => {
      if (!binPkg) {
        for (const p of [].concat(pkg)) {
          await binLinks({
            pkg: p,
            path: resolve(path, nodeModules, p.name),
          })
        }
        return
      }
      await binLinks({
        pkg: binPkg,
        path: resolve(path, nodeModules, binPkg.name),
      })
    },
    readOutput: async (outputPath, { root = path } = {}) => {
      if (!outputPath) {
        outputPath = pkg.name.replace('/', '-')
      }
      return fs.readFile(resolve(root, `output-${outputPath}`), 'utf-8').then(r => JSON.parse(r))
    },
    rmOutput: (outputPath, { root = path } = {}) => {
      if (!outputPath) {
        outputPath = pkg.name.replace('/', '-')
      }
      return fs.rm(resolve(root, `output-${outputPath}`))
    },
    exec: (opts) => t.mock(execPath || '../../lib/index.js', mocks)({
      ...defaults ? {
        ...defaultOpts,
        path,
        runPath: path,
      } : {},
      ...baseOpts,
      ...opts,
    }),
  }
}

module.exports.setup = setup
module.exports.createPkg = createPkg
module.exports.merge = merge
