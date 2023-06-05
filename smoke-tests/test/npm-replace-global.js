
const t = require('tap')
const { join, dirname, basename, extname } = require('path')
const fs = require('fs/promises')
const _which = require('which')
const setup = require('./fixtures/setup.js')

const which = async (cmd, opts) => {
  const path = await _which(cmd, { nothrow: true, ...opts })
  return path ? join(dirname(path), basename(path, extname(path))) : null
}

t.test('npm replace global', async t => {
  const {
    npm,
    npmLocal,
    npmPath,
    getPath,
    paths: { root, globalBin, globalNodeModules },
  } = await setup(t, {
    testdir: {
      project: {
        'package.json': { name: 'npm', version: '999.999.999' },
      },
    },
  })

  const getPaths = async () => {
    const binContents = await fs.readdir(globalBin).then(results => results
      .filter(p => p !== '.npmrc' && p !== 'node_modules')
      .map(p => basename(p, extname(p)))
      .reduce((set, p) => set.add(p), new Set()))

    return {
      npmRoot: await npmPath('help').then(setup.getNpmRoot),
      pathNpm: await which('npm', { path: getPath(), nothrow: true }),
      globalNpm: await which('npm', { nothrow: true }),
      pathNpx: await which('npx', { path: getPath(), nothrow: true }),
      globalNpx: await which('npx', { nothrow: true }),
      binContents: [...binContents],
      nodeModulesContents: await fs.readdir(join(globalNodeModules, 'npm')),
    }
  }

  const tarball = setup.SMOKE_PUBLISH_TARBALL ??
    await npmLocal('pack', `--pack-destination=${root}`).then(r => join(root, r))

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
  t.match(prePaths.binContents, ['npm', 'npx'], 'bin has npm and npx')
  t.ok(prePaths.nodeModulesContents.length > 1, 'node modules has npm contents')
  t.ok(prePaths.nodeModulesContents.includes('node_modules'), 'npm has its node_modules')

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
