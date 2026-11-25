const t = require('tap')
const { resolve } = require('node:path')
const PathCoordinates = require('../lib/path-coordinates.js')

t.test('symlink root path coordinates', t => {
  const logical = resolve('/shortcuts/project')
  const real = resolve('/repo/project')
  const coordinates = new PathCoordinates(logical, real)
  const direct = new PathCoordinates(real)
  const cases = [
    {
      name: 'root',
      location: '',
      path: real,
    },
    {
      name: 'internal dependency',
      location: 'node_modules/dep',
      path: resolve(real, 'node_modules/dep'),
    },
    {
      name: 'internal tarball',
      location: 'tarballs/dep.tgz',
      path: resolve(real, 'tarballs/dep.tgz'),
    },
    {
      name: 'external dependency',
      location: '../shared',
      path: resolve(real, '../shared'),
    },
    {
      name: 'external tarball',
      location: '../shared/dep.tgz',
      path: resolve(real, '../shared/dep.tgz'),
    },
  ]

  for (const test of cases) {
    t.equal(coordinates.toLockfile(test.path), test.location,
      `${test.name} serializes in lockfile coordinates`)
    t.equal(coordinates.toFilesystem(test.location), test.path,
      `${test.name} hydrates in canonical coordinates`)
  }
  t.equal(direct.canonicalRoot, direct.logicalRoot,
    'non-symlink roots use one coordinate system')
  t.equal(coordinates.toFilesystem(resolve(logical, 'tarball.tgz')),
    resolve(real, 'tarball.tgz'),
    'absolute logical paths map to the canonical root')
  t.equal(
    coordinates.toLockfileSpec(
      `file:${resolve(logical, 'tarball.tgz')}`,
      logical
    ),
    'file:tarball.tgz',
    'logical absolute file specs serialize in lockfile coordinates'
  )
  t.equal(
    coordinates.toFilesystemSpec('file:../shared/dep.tgz'),
    `file:${resolve(real, '../shared/dep.tgz')}`,
    'relative file specs hydrate from the canonical root'
  )
  t.equal(
    coordinates.toLockfileSpec('git+file:/repo/pkg', logical),
    'git+file:/repo/pkg',
    'non-file specs are not translated'
  )
  t.equal(
    coordinates.toLockfileSpec('file:\u0000', logical, 'file:\u0000'),
    'file:\u0000',
    'malformed file specs retain their original value'
  )
  t.equal(
    coordinates.toFilesystemSpec('file:\u0000'),
    'file:\u0000',
    'malformed lockfile specs retain their original value'
  )
  t.end()
})
