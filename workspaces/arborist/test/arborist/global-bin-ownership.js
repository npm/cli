const fs = require('node:fs/promises')
const { join, relative } = require('node:path')
const t = require('tap')
const Arborist = require('../..')

t.test('global uninstall retires only links owned by the removed package', {
  skip: process.platform === 'win32' && 'Windows installs command shims instead of symlinks',
}, async t => {
  const root = t.testdir({
    bin: {},
    lib: {
      node_modules: {
        'remove-me': {
          'package.json': JSON.stringify({
            name: 'remove-me',
            version: '1.0.0',
            bin: {
              'keep-relative': 'cli.js',
              'keep-absolute': 'cli.js',
              'remove-owned': 'cli.js',
              'remove-dangling': 'missing.js',
              'keep-file': 'cli.js',
              'already-absent': 'cli.js',
            },
          }),
          'cli.js': '',
        },
        'remove-me-other': {
          'package.json': JSON.stringify({ name: 'remove-me-other', version: '1.0.0' }),
          'cli.js': '',
        },
      },
    },
  })
  const bin = join(root, 'bin')
  const lib = join(root, 'lib')
  const modules = join(lib, 'node_modules')
  const removedPackage = join(modules, 'remove-me')
  const otherTarget = join(modules, 'remove-me-other', 'cli.js')
  const relativeTarget = relative(bin, otherTarget)

  await fs.symlink(relativeTarget, join(bin, 'keep-relative'))
  await fs.symlink(otherTarget, join(bin, 'keep-absolute'))
  await fs.symlink(relative(bin, join(removedPackage, 'cli.js')), join(bin, 'remove-owned'))
  await fs.symlink(join(removedPackage, 'missing.js'), join(bin, 'remove-dangling'))
  await fs.writeFile(join(bin, 'keep-file'), 'a user-managed command')

  const arborist = new Arborist({ path: lib, global: true, offline: true, audit: false })
  await arborist.reify({ rm: ['remove-me'] })

  await t.rejects(fs.lstat(removedPackage), { code: 'ENOENT' })
  await t.rejects(fs.lstat(join(bin, 'remove-owned')), { code: 'ENOENT' })
  await t.rejects(fs.lstat(join(bin, 'remove-dangling')), { code: 'ENOENT' })
  await t.rejects(fs.lstat(join(bin, 'already-absent')), { code: 'ENOENT' })
  t.same((await fs.readdir(join(modules, 'remove-me-other'))).sort(), ['cli.js', 'package.json'])
  t.equal(await fs.readlink(join(bin, 'keep-relative')), relativeTarget)
  t.equal(await fs.readlink(join(bin, 'keep-absolute')), otherTarget)
  t.equal(await fs.readFile(join(bin, 'keep-file'), 'utf8'), 'a user-managed command')
})
