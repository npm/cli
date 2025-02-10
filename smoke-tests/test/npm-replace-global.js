
const t = require('tap')
const { join, dirname, basename, extname } = require('node:path')
const fs = require('node:fs/promises')
const _which = require('which')
const setup = require('./fixtures/setup.js')

const which = async (cmd, opts) => {
  const path = await _which(cmd, { nothrow: true, ...opts })
  return path ? join(dirname(path), basename(path, extname(path))) : null
}

const setupNpmGlobal = async (t, opts) => {
  const mock = await setup(t, opts)

  return {
    ...mock,
    getPaths: async () => {
      const binContents = await fs.readdir(mock.paths.globalBin)
        .then(r => r.filter(p => p !== '.npmrc' && p !== 'node_modules'))
        .catch(() => null)

      const nodeModulesContents = await fs.readdir(join(mock.paths.globalNodeModules, 'npm'))
        .catch(() => null)

      return {
        npmRoot: await mock.npmPath('help').then(setup.getNpmRoot),
        pathNpm: await which('npm', { path: mock.getPath() }),
        globalNpm: await which('npm'),
        pathNpx: await which('npx', { path: mock.getPath() }),
        globalNpx: await which('npx'),
        binContents,
        nodeModulesContents,
      }
    },
  }
}

t.test('pack and replace global self', async t => {
  const {
    npm,
    npmLocalTarball,
    npmPath,
    getPaths,
    paths: { globalBin, globalNodeModules },
  } = await setupNpmGlobal(t, {
    testdir: {
      project: {
        'package.json': { name: 'npm', version: '999.999.999' },
      },
    },
  })

  const tarball = await npmLocalTarball()
  await npm('install', tarball, '--global')

  t.equal(
    await fs.realpath(join(globalBin, 'npm')),
    setup.WINDOWS ? join(globalBin, 'npm') : join(globalNodeModules, 'npm/bin/npm-cli.js'),
    'npm realpath is in the testdir'
  )
  t.equal(
    await fs.realpath(join(globalBin, 'npx')),
    setup.WINDOWS ? join(globalBin, 'npx') : join(globalNodeModules, 'npm/bin/npx-cli.js'),
    'npx realpath is in the testdir'
  )

  const prePaths = await getPaths()
  t.equal(prePaths.npmRoot, join(globalNodeModules, 'npm'), 'npm root is in the testdir')
  t.equal(prePaths.pathNpm, join(globalBin, 'npm'), 'npm bin is in the testdir')
  t.equal(prePaths.pathNpx, join(globalBin, 'npx'), 'npx bin is in the testdir')
  t.not(prePaths.pathNpm, prePaths.globalNpm, 'npm bin is not the same as the global one')
  t.not(prePaths.pathNpx, prePaths.globalNpx, 'npm bin is not the same as the global one')
  t.ok(prePaths.nodeModulesContents.length > 1, 'node modules has npm contents')
  t.ok(prePaths.nodeModulesContents.includes('node_modules'), 'npm has its node_modules')

  t.strictSame(
    prePaths.binContents,
    ['npm', 'npx'].flatMap(p => setup.WINDOWS ? [p, `${p}.cmd`, `${p}.ps1`] : p),
    'bin has npm and npx'
  )

  await npmPath('pack')
  await npmPath('install', 'npm-999.999.999.tgz', '--global')

  const postPaths = await getPaths()
  t.not(prePaths.npmRoot, postPaths.npmRoot, 'npm roots are different')
  t.equal(postPaths.pathNpm, postPaths.globalNpm, 'npm bin is the same as the global one')
  t.equal(postPaths.pathNpx, postPaths.globalNpx, 'npx bin is the same as the global one')
  t.equal(postPaths.pathNpm, prePaths.globalNpm, 'after install npm bin is same as previous global')
  t.equal(postPaths.pathNpx, prePaths.globalNpx, 'after install npx bin is same as previous global')
  t.strictSame(postPaths.binContents, [], 'bin is empty')
  t.strictSame(postPaths.nodeModulesContents, ['package.json'], 'contents is only package.json')
})

t.test('publish and replace global self', async t => {
  const {
    npm,
    npmPath,
    registry,
    npmLocal,
    npmLocalTarball,
    getPaths,
    paths: { globalBin, globalNodeModules, cache },
  } = await setupNpmGlobal(t, {
    strictRegistryNock: false,
    testdir: {
      home: {
        '.npmrc': `//${setup.MOCK_REGISTRY.host}/:_authToken = test-token`,
      },
    },
  })

  let publishedPackument = null
  const { name, version } = require('../../package.json')

  const npmPackage = async ({ manifest, ...opts } = {}) => {
    await registry.package({
      manifest: registry.manifest({ name, ...manifest }),
      ...opts,
    })
  }

  const npmInstall = async (useNpm) => {
    await npmPackage({
      manifest: { packuments: [publishedPackument] },
      tarballs: { [version]: tarball },
      times: 3,
    })
    await fs.rm(cache, { recursive: true, force: true })
    await useNpm('install', 'npm@latest', '--global')
    return getPaths()
  }

  const tarball = await npmLocalTarball()

  if (setup.SMOKE_PUBLISH) {
    await npmPackage()
  }
  registry.nock.put('/npm', body => {
    if (body._id === 'npm' && body.versions[version]) {
      publishedPackument = body.versions[version]
      return true
    }
    return false
  }).reply(201, {})
  await npmLocal('publish', '--tag=smoke-test', { proxy: true, force: true })

  t.comment(JSON.stringify(publishedPackument, null, 2))

  const paths = await npmInstall(npm)
  t.equal(paths.npmRoot, join(globalNodeModules, 'npm'), 'npm root is in the testdir')
  t.equal(paths.pathNpm, join(globalBin, 'npm'), 'npm bin is in the testdir')
  t.equal(paths.pathNpx, join(globalBin, 'npx'), 'npx bin is in the testdir')
  t.ok(paths.nodeModulesContents.length > 1, 'node modules has npm contents')
  t.ok(paths.nodeModulesContents.includes('node_modules'), 'npm has its node_modules')

  t.strictSame(
    paths.binContents,
    ['npm', 'npx'].flatMap(p => setup.WINDOWS ? [p, `${p}.cmd`, `${p}.ps1`] : p),
    'bin has npm and npx'
  )

  t.strictSame(await npmInstall(npmPath), paths)
})

t.test('fail when updating with lazy require', async t => {
  const {
    npm,
    npmLocalTarball,
    npmPath,
    paths,
  } = await setupNpmGlobal(t, {
    testdir: {
      project: {
        'package.json': {
          name: 'npm',
          version: '999.999.999',
          bin: {
            npm: './my-new-npm-bin.js',
          },
        },
        'my-new-npm-bin.js': `#!/usr/bin/env node\nconsole.log('This worked!')`,
      },
    },
  })

  const tarball = await npmLocalTarball()
  await npm('install', tarball, '--global')
  await npmPath('pack')

  // exit-handler is the last thing called in the code
  // so an uncached lazy require within the exit handler will always throw
  await fs.writeFile(
    join(paths.globalNodeModules, 'npm/lib/cli/exit-handler.js'),
    `module.exports = class {
      setNpm(){}
      registerUncaughtHandlers(){}
      exit() { require('./LAZY_REQUIRE_CANARY') }
    }`,
    'utf-8'
  )

  await t.rejects(npmPath('install', 'npm-999.999.999.tgz', '--global'), {
    stderr: `Error: Cannot find module './LAZY_REQUIRE_CANARY'`,
  }, 'install command fails with lazy require error')

  await t.resolveMatch(npmPath(), { stdout: 'This worked!' }, 'bin placement still works')
})
