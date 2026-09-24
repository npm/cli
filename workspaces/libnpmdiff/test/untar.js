const { resolve } = require('node:path')
const t = require('tap')
const pacote = require('pacote')
const untar = require('../lib/untar.js')

t.test('untar simple package', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/simple-output-2.2.1.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  })

  t.matchSnapshot([...files].join('\n'), 'should return list of filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v}`).join('\n'),
    'should return map of filenames to its contents'
  )
  t.matchSnapshot(refs.get('a/LICENSE').content, 'should have read contents')
})

t.test('untar package with folders', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/archive.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  })

  t.matchSnapshot([...files].join('\n'), 'should return list of filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v}`).join('\n'),
    'should return map of filenames to its contents'
  )
  t.matchSnapshot(
    refs.get('a/lib/utils/b.js').content,
    'should have read contents'
  )
})

t.test('filter files', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/simple-output-2.2.1.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  }, {
    diffFiles: [
      './LICENSE',
      'missing-file',
      'README.md',
    ],
  })

  t.matchSnapshot([...files].join('\n'), 'should return list of filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v.content}`).join('\n'),
    'should return map of filenames with valid contents'
  )
})

t.test('filter files using glob expressions', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/archive.tgz'))
  const cwd = t.testdir({
    lib: {
      'index.js': '',
      utils: {
        '/b.js': '',
      },
    },
    'package-lock.json': '',
    'package.json': '',
    test: {
      '/index.js': '',
      utils: {
        'b.js': '',
      },
    },
  })

  const _cwd = process.cwd()
  process.chdir(cwd)
  t.teardown(() => {
    process.chdir(_cwd)
  })

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  }, {
    diffFiles: [
      './lib/**',
      '*-lock.json',
      'test\\*', // windows-style sep should be normalized
    ],
  })

  t.matchSnapshot([...files].join('\n'), 'should return list of filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v.content}`).join('\n'),
    'should return map of filenames with valid contents'
  )
})

t.test('match files by end of filename', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/archive.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  }, {
    diffFiles: [
      '*.js',
    ],
  })

  t.matchSnapshot([...files].join('\n'), 'should return list of filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v.content}`).join('\n'),
    'should return map of filenames with valid contents'
  )
})

t.test('filter files by exact filename', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/archive.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  }, {
    diffFiles: [
      'index.js',
    ],
  })

  t.matchSnapshot([...files].join('\n'), 'should return no filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v.content}`).join('\n'),
    'should return no filenames'
  )
})

t.test('match files by simple folder name', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/archive.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  }, {
    diffFiles: [
      'lib',
    ],
  })

  t.matchSnapshot([...files].join('\n'), 'should return list of filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v.content}`).join('\n'),
    'should return map of filenames with valid contents'
  )
})

t.test('match files by simple folder name variation', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/archive.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  }, {
    diffFiles: [
      './test/',
    ],
  })

  t.matchSnapshot([...files].join('\n'), 'should return list of filenames')
  t.matchSnapshot(
    [...refs.entries()].map(([k, v]) => `${k}: ${!!v.content}`).join('\n'),
    'should return map of filenames with valid contents'
  )
})

t.test('filter out all files', async t => {
  const item =
    await pacote.tarball(resolve('./test/fixtures/simple-output-2.2.1.tgz'))

  const {
    files,
    refs,
  } = await untar({
    item,
    prefix: 'a/',
  }, {
    diffFiles: [
      'non-matching-pattern',
    ],
  })

  t.equal(files.size, 0, 'should have no files')
  t.equal(refs.size, 0, 'should have no refs')
})

t.test('compiles each glob pattern only once', async t => {
  const realMinimatch = require('minimatch')
  const mockUntar = () => {
    const compiled = []
    const untarWithSpy = t.mock('../lib/untar.js', {
      minimatch: {
        ...realMinimatch,
        Minimatch: function (pattern, opts) {
          compiled.push(pattern)
          return new realMinimatch.Minimatch(pattern, opts)
        },
      },
    })
    return { compiled, untar: untarWithSpy }
  }
  const tarballs = async () => [
    { item: await pacote.tarball(resolve('./test/fixtures/archive.tgz')), prefix: 'a/' },
    { item: await pacote.tarball(resolve('./test/fixtures/archive.tgz')), prefix: 'b/' },
  ]

  t.test('with filters', async t => {
    const { compiled, untar: untarWithSpy } = mockUntar()
    const { files, refs } = await untarWithSpy(await tarballs(), {
      diffFiles: ['*.json', 'lib/**/*.js'],
    })

    t.same(compiled, [
      '{package/,}*.json',
      '{package/,}lib/**/*.js',
    ], 'should compile each pattern once across all tarballs and files')
    t.same([...files], [
      'lib/index.js',
      'lib/utils/b.js',
      'package-lock.json',
      'package.json',
    ], 'should return list of matched filenames')
    t.same([...refs.keys()], [
      'a/lib/index.js',
      'a/lib/utils/b.js',
      'a/package-lock.json',
      'a/package.json',
      'b/lib/index.js',
      'b/lib/utils/b.js',
      'b/package-lock.json',
      'b/package.json',
    ], 'should read matched files from both tarballs')
  })

  t.test('without filters', async t => {
    const { compiled, untar: untarWithSpy } = mockUntar()
    const { files } = await untarWithSpy(await tarballs())

    t.same(compiled, [], 'should not compile any pattern')
    t.same([...files], [
      'lib/index.js',
      'lib/utils/b.js',
      'package-lock.json',
      'package.json',
      'test/index.js',
      'test/utils/b.js',
    ], 'should return all filenames')
  })
})
