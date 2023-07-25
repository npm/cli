const { resolve } = require('path')

const t = require('tap')
const Arborist = require('../../lib/arborist/index.js')

const { start, stop, registry } = require('../fixtures/server.js')

t.before(start)
t.teardown(stop)

const {
  normalizePath,
  printTree,
} = require('../fixtures/utils.js')

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')
  .split(registry).join('https://registry.npmjs.org/')

const fixture = (t, p) => require('../fixtures/reify-cases/' + p)(t)

const cache = t.testdir()
const pruneTree = (path, opt) =>
  new Arborist({ registry, path, cache, ...(opt || {}) }).prune(opt)

t.test('prune with actual tree', async t => {
  const path = fixture(t, 'prune-actual')
  const tree = await pruneTree(path)
  const dep = tree.children.get('abbrev')
  t.notOk(dep, 'dep was pruned from tree')
  t.matchSnapshot(printTree(tree))
})

t.test('prune with lockfile', async t => {
  const path = fixture(t, 'prune-lockfile')
  const tree = await pruneTree(path)
  const dep = tree.children.get('abbrev')
  t.notOk(dep, 'dep was pruned from tree')
  t.matchSnapshot(printTree(tree))
})

t.test('prune with actual tree omit dev', async t => {
  const path = fixture(t, 'prune-actual-omit-dev')
  const tree = await pruneTree(path, { omit: ['dev'] })

  const prodDep = tree.children.get('abbrev')
  t.notOk(prodDep, 'missing prod dep was pruned from tree')

  const devDep = tree.children.get('once')
  t.notOk(devDep, 'all listed dev deps pruned from tree')

  t.matchSnapshot(
    require(path + '/package-lock.json'),
    'should keep dev dependencies in package-lock.json'
  )
  t.matchSnapshot(
    printTree(tree),
    'should remove all deps from reified tree'
  )
})

t.test('prune with lockfile omit dev', async t => {
  const path = fixture(t, 'prune-lockfile-omit-dev')
  const tree = await pruneTree(path, { omit: ['dev'] })

  const prodDep = tree.children.get('abbrev')
  t.notOk(prodDep, 'missing prod dep was pruned from tree')

  const devDep = tree.children.get('once')
  t.notOk(devDep, 'all listed dev deps pruned from tree')

  t.matchSnapshot(
    require(path + '/package-lock.json'),
    'should keep dev dependencies in package-lock.json'
  )
  t.matchSnapshot(
    printTree(tree),
    'should remove all deps from reified tree'
  )
})

t.test('prune omit dev with bins', async t => {
  const fs = require('fs')
  const { promisify } = require('util')
  const readdir = promisify(fs.readdir)
  const path = fixture(t, 'prune-dev-bins')

  // should have bin files
  const reifiedBin = resolve(path, 'node_modules/.bin/yes')
  if (process.platform === 'win32') {
    t.ok(fs.statSync(reifiedBin + '.cmd').isFile(), 'should have shim')
  } else {
    t.ok(fs.lstatSync(reifiedBin).isSymbolicLink(), 'should have symlink')
  }

  // PRUNE things
  const tree = await pruneTree(path, { prefix: path, omit: ['dev'] })
  const dirs = await readdir(path + '/node_modules')

  // bindirs are never removed
  // they should remain after prune
  t.same(dirs, ['.bin', '.package-lock.json'], 'should keep bin dir')

  const devDep = tree.children.get('yes')
  t.notOk(devDep, 'all listed dev deps pruned from tree')

  // should also remove ./bin/* files
  const bin = resolve(path, 'node_modules/.bin/yes')
  if (process.platform === 'win32') {
    t.throws(() => fs.statSync(bin + '.cmd').isFile(), /ENOENT/, 'should not have shim')
  } else {
    t.throws(() => fs.lstatSync(bin).isSymbolicLink(), /ENOENT/, 'should not have symlink')
  }
})

t.test('prune workspaces', async t => {
  const fs = require('fs')
  const { join } = require('path')
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'prune-workspaces',
      version: '1.0.0',
      description: '',
      main: 'index.js',
      dependencies: {
        qs: '',
        derp: '',
      },
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: [],
      author: '',
      license: 'ISC',
      workspaces: [
        'packages/a',
        'packages/b',
      ],
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: { once: '' },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
        }),
      },
    },
    node_modules: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: { once: '' },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
        }),
      },
      once: {
        'package.json': JSON.stringify({
          name: 'once',
          version: '1.2.3',
          dependencies: {
            wrappy: '',
            derp: '',
          },
        }),
      },
      wrappy: {
        'package.json': JSON.stringify({
          name: 'wrappy',
          version: '1.2.3',
        }),
      },
      qs: {
        'package.json': JSON.stringify({
          name: 'qs',
          version: '1.2.3',
        }),
      },
      derp: {
        'package.json': JSON.stringify({
          name: 'derp',
          version: '90.2.11',
        }),
      },
    },
  })
  const tree = await pruneTree(path, { workspacesEnabled: false })
  t.ok(fs.existsSync(join(path, 'node_modules', 'qs')), 'qs was not pruned from tree')
  t.notOk(fs.existsSync(join(path, 'node_modules', 'once')), 'once was pruned from tree')
  t.notOk(fs.existsSync(join(path, 'node_modules', 'wrappy')), 'wrappy was pruned from tree')
  t.notOk(fs.existsSync(join(path, 'node_modules', 'a')), 'a was pruned from tree')
  t.notOk(fs.existsSync(join(path, 'node_modules', 'b')), 'b was pruned from tree')
  t.ok(fs.existsSync(join(path, 'node_modules', 'derp')), 'derp was not pruned from tree')
  t.matchSnapshot(printTree(tree))
})
