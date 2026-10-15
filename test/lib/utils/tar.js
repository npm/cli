const path = require('node:path')
const t = require('tap')
const tar = require('tar')
const pack = require('libnpmpack')
const ssri = require('ssri')
const { readFile } = require('fs/promises')
const tmock = require('../../fixtures/tmock')
const { cleanZlib } = require('../../fixtures/clean-snapshot')

const { getContents } = require('../../../lib/utils/tar.js')
t.cleanSnapshot = data => cleanZlib(data)

const mockTar = ({ notice }) => tmock(t, '{LIB}/utils/tar.js', {
  'proc-log': {
    log: {
      notice,
    },
  },
})

const printLogs = (tarball, options) => {
  const logs = []
  const { logTar } = mockTar({
    notice: (...args) => logs.push(...args),
  })
  logTar(tarball, options)
  return logs.join('\n')
}

t.test('should log tarball contents', async (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
      bundleDependencies: [
        'bundle-dep',
      ],
      dependencies: {
        'bundle-dep': '1.0.0',
      },
    }),
    cat: 'meow',
    chai: 'blub',
    dog: 'woof',
    node_modules: {
      'bundle-dep': {
        'package.json': '',
      },
    },
  })

  const tarball = await pack(testDir)
  const tarballContents = await getContents({
    _id: '1',
    name: 'my-cool-pkg',
    version: '1.0.0',
  }, tarball)

  t.matchSnapshot(printLogs(tarballContents))
})

t.test('should log tarball contents of a scoped package', async (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: '@myscope/my-cool-pkg',
      version: '1.0.0',
      bundleDependencies: [
        'bundle-dep',
      ],
      dependencies: {
        'bundle-dep': '1.0.0',
      },
    }),
    cat: 'meow',
    chai: 'blub',
    dog: 'woof',
    node_modules: {
      'bundle-dep': {
        'package.json': '',
      },
    },
  })

  const tarball = await pack(testDir)
  const tarballContents = await getContents({
    _id: '1',
    name: '@myscope/my-cool-pkg',
    version: '1.0.0',
  }, tarball)

  t.matchSnapshot(printLogs(tarballContents))
})

t.test('should log tarball contents with unicode', async (t) => {
  const { logTar } = mockTar({
    notice: (str) => {
      t.ok(true, 'defaults to proc-log')
      return str
    },
  })

  logTar({
    files: [],
    bundled: [],
    size: 0,
    unpackedSize: 0,
    integrity: '',
  }, { unicode: true })
  t.end()
})

t.test('should getContents of a tarball with only a package.json', async (t) => {
  const testDir = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-cool-pkg',
      version: '1.0.0',
    }, null, 2),
  })

  const tarball = await pack(testDir)

  const tarballContents = await getContents({
    name: 'my-cool-pkg',
    version: '1.0.0',
  }, tarball)

  const integrity = await ssri.fromData(tarball, {
    algorithms: ['sha1', 'sha512'],
  })

  // zlib is nondeterministic
  t.match(tarballContents.shasum, /^[0-9a-f]{40}$/)
  delete tarballContents.shasum
  t.strictSame(tarballContents, {
    id: 'my-cool-pkg@1.0.0',
    name: 'my-cool-pkg',
    version: '1.0.0',
    size: tarball.length,
    unpackedSize: 49,
    integrity: ssri.parse(integrity.sha512[0]),
    filename: 'my-cool-pkg-1.0.0.tgz',
    files: [{ path: 'package.json', size: 49, mode: 420 }],
    entryCount: 1,
    bundled: [],
  }, 'contents are correct')
  t.end()
})

t.test('should getContents of a tarball with a node_modules directory included', async (t) => {
  const testDir = t.testdir({
    package: {
      'package.json': JSON.stringify({
        name: 'my-cool-pkg',
        version: '1.0.0',
      }, null, 2),
      node_modules: {
        'bundle-dep': {
          'package.json': JSON.stringify({
            name: 'bundle-dep',
            version: '1.0.0',
          }, null, 2),
        },
      },
    },
  })

  const fileName = path.join(testDir, 'npm-example-v1.tgz')
  await tar.c({
    gzip: true,
    file: fileName,
    C: testDir,
  }, ['package'])

  const tarball = await readFile(fileName)

  const tarballContents = await getContents({
    name: 'my-cool-pkg',
    version: '1.0.0',
  }, tarball)

  const integrity = ssri.fromData(tarball, {
    algorithms: ['sha1', 'sha512'],
  })

  // zlib is nondeterministic
  t.match(tarballContents.shasum, /^[0-9a-f]{40}$/)
  delete tarballContents.shasum

  // assert mode differently according to platform
  if (process.platform === 'win32') {
    tarballContents.files[0].mode = 511
    tarballContents.files[1].mode = 511
    tarballContents.files[2].mode = 511
    tarballContents.files[3].mode = 438
    tarballContents.files[4].mode = 438
  } else {
    tarballContents.files[0].mode = 493
    tarballContents.files[1].mode = 493
    tarballContents.files[2].mode = 493
    tarballContents.files[3].mode = 420
    tarballContents.files[4].mode = 420
  }

  tarballContents.files.forEach((file) => {
    delete file.mode
  })

  t.same(tarballContents, {
    id: 'my-cool-pkg@1.0.0',
    name: 'my-cool-pkg',
    version: '1.0.0',
    size: tarball.length,
    unpackedSize: 97,
    integrity: ssri.parse(integrity.sha512[0]),
    filename: 'my-cool-pkg-1.0.0.tgz',
    files: [
      { path: '', size: 0 },
      { path: 'node_modules/', size: 0 },
      { path: 'node_modules/bundle-dep/', size: 0 },
      { path: 'node_modules/bundle-dep/package.json', size: 48 },
      { path: 'package.json', size: 49 },
    ],
    entryCount: 5,
    bundled: ['bundle-dep'],
  }, 'contents are correct')
  t.end()
})

t.test('should getContents of a tarball with a malformed bundled entry name', async (t) => {
  // tarballs on the registry or staging endpoint are not built by npm, so an
  // entry under package/node_modules/ can carry a path the bundled name regex
  // does not match. This helper writes raw tar entries because the filesystem
  // collapses doubled separators and the tar package normalizes entry paths.
  const craftEntry = (name, content) => {
    const header = Buffer.alloc(512)
    header.write(name.slice(0, 100), 0, 100, 'utf8')
    header.write('0000644\0', 100, 8, 'ascii')
    header.write('0000000\0', 108, 8, 'ascii')
    header.write('0000000\0', 116, 8, 'ascii')
    header.write(content.length.toString(8).padStart(7, '0') + '\0', 124, 8, 'ascii')
    header.write('0000000\0', 136, 8, 'ascii')
    header.write('        ', 148, 8, 'ascii')
    header.write('0', 156, 1, 'ascii')
    header.write('ustar\0', 257, 6, 'ascii')
    header.write('00', 263, 2, 'ascii')
    let sum = 0
    for (const byte of header) {
      sum += byte
    }
    header.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii')
    const data = Buffer.alloc(Math.ceil(content.length / 512) * 512)
    data.write(content, 0, 'utf8')
    return Buffer.concat([header, data])
  }
  const craftTarball = (entries) =>
    Buffer.concat([...entries, Buffer.alloc(1024)])

  const tarball = craftTarball([
    craftEntry('package/package.json', '{"name":"evil","version":"1.0.0"}'),
    craftEntry('package/node_modules//evil', 'abc'),
  ])

  const tarballContents = await getContents({
    name: 'evil',
    version: '1.0.0',
  }, tarball)

  t.strictSame(tarballContents.bundled, [], 'malformed bundled entry is skipped')
  t.equal(tarballContents.entryCount, 2, 'both entries are counted')
  t.strictSame(tarballContents.files.map(f => f.path), [
    'node_modules//evil',
    'package.json',
  ])
})

t.test('should log byte sizes correctly', async (t) => {
  const cases = [
    [0, '0 B', '0B'],
    [1, '1 B', '1B'],
    [10, '10 B', '10B'],
    [999, '999 B', '999B'],
    [1000, '1.0 kB', '1.0kB'],
    [1001, '1.0 kB', '1.0kB'],
    [1500, '1.5 kB', '1.5kB'],
    [999999, '1.0 MB', '1.0MB'],
    [1000000, '1.0 MB', '1.0MB'],
    [999999999, '1.0 GB', '1.0GB'],
    [1000000000, '1.0 GB', '1.0GB'],
  ]

  for (const [size, expected, expectedNoSpace] of cases) {
    const logs = printLogs({
      name: 'pkg',
      version: '1.0.0',
      files: [
        { path: 'file.txt', size: size },
      ],
      bundled: [],
      size: size,
      unpackedSize: size,
      integrity: 'sha512-xxx',
    })

    t.match(logs, `package size: ${expected}`, `package size: ${expected}`)
    t.match(logs, `unpacked size: ${expected}`, `unpacked size: ${expected}`)
    t.match(logs, `${expectedNoSpace} file.txt`, `file size: ${expectedNoSpace}`)
  }
})
