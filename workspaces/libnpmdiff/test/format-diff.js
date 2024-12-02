const t = require('tap')

const formatDiff = require('../lib/format-diff.js')

const normalizeWin = (str) => str
  .replace(/\\+/g, '/')
  .replace(/\r\n/g, '\n')

t.cleanSnapshot = (str) => normalizeWin(str)

t.test('format simple diff', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foobar"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
    }),
    'should output expected diff result'
  )
})

t.test('nothing to diff', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '1.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
    }),
    'should output empty result'
  )
})

t.test('format removed file', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
    }),
    'should output expected removed file diff result'
  )
})

t.test('changed file mode', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100755',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
    }),
    'should output expected changed file mode diff result'
  )
})

t.test('added file', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100755',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
    }),
    'should output expected added file diff result'
  )
})

t.test('binary file', async t => {
  const files = new Set([
    'foo.jpg',
  ])
  const refs = new Map(Object.entries({
    'a/foo.jpg': {
      content: Buffer.from(''),
      mode: '100644',
    },
    'b/foo.jpg': {
      content: Buffer.from(''),
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
    }),
    'should output expected bin file diff result'
  )
})

t.test('nothing to compare', async t => {
  const files = new Set([
    'foo.jpg',
  ])
  const refs = new Map(Object.entries({
    'a/foo.jpg': {},
    'b/foo.jpg': {},
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatch(
    formatDiff({
      files,
      refs,
      versions,
    }),
    '',
    'should have no output'
  )
})

t.test('colored output', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foobar"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
      opts: {
        color: true,
      },
    }),
    'should output expected colored diff result'
  )
})

t.test('using --name-only option', async t => {
  const files = new Set([
    'foo.js',
    'lib/bar.js',
    'lib/utils.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foobar"\n',
      mode: '100644',
    },
    'a/lib/bar.js': {
      content: '"use strict"\nmodule.exports = "bar"\n',
      mode: '100644',
    },
    'b/lib/bar.js': {
      content: '"use strict"\nmodule.exports = "bar"\n',
      mode: '100644',
    },
    'a/lib/utils.js': {
      content: '"use strict"\nconst bar = require("./bar.js")\n'
        + 'module.exports = () => bar\n',
      mode: '100644',
    },
    'b/lib/utils.js': {
      content: '"use strict"\nconst bar = require("./bar.js")\n'
        + 'module.exports =\n  () => bar + "util"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
      opts: {
        diffNameOnly: true,
      },
    }),
    'should output expected diff result'
  )
})

t.test('respect --tag-version-prefix option', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foobar"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
      opts: {
        tagVersionPrefix: 'b',
      },
    }),
    'should output expected diff result'
  )
})

t.test('diff options', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nconst a = "a"\nconst b = "b"\n'
        + 'const c = "c"\nmodule.exports = () => a+\nb+\nc\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nconst a = "a"\n  const b = "b"\n'
        + '  const c = "c"\n  const d = "d"\n'
        + 'module.exports = () => a+\nb+\nc+\nd\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
      opts: {
        diffUnified: 1,
        diffIgnoreAllSpace: true,
        diffSrcPrefix: 'before/',
        diffDstPrefix: 'after/',
      },
    }),
    'should output expected diff result'
  )
})

t.test('diffUnified=0', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nconst a = "a"\nconst b = "b"\n'
        + 'const c = "c"\nmodule.exports = () => a+\nb+\nc\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nconst a = "a"\n  const b = "b"\n'
        + '  const c = "c"\n  const d = "d"\n'
        + 'module.exports = () => a+\nb+\nc+\nd\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
      opts: {
        diffUnified: 0,
      },
    }),
    'should output no context lines in output'
  )
})

t.test('noPrefix', async t => {
  const files = new Set([
    'foo.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foobar"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '2.0.0',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
      opts: {
        diffNoPrefix: true,
      },
    }),
    'should output result with no prefixes'
  )
})

t.test('format multiple files patch', async t => {
  const files = new Set([
    'foo.js',
    'lib/bar.js',
    'lib/utils.js',
  ])
  const refs = new Map(Object.entries({
    'a/foo.js': {
      content: '"use strict"\nmodule.exports = "foo"\n',
      mode: '100644',
    },
    'b/foo.js': {
      content: '"use strict"\nmodule.exports = "foobar"\n',
      mode: '100644',
    },
    'a/lib/bar.js': {
      content: '"use strict"\nmodule.exports = "bar"\n',
      mode: '100644',
    },
    'b/lib/bar.js': {
      content: '"use strict"\nmodule.exports = "bar"\n',
      mode: '100644',
    },
    'a/lib/utils.js': {
      content: '"use strict"\nconst bar = require("./bar.js")\n'
        + 'module.exports = () => bar\n',
      mode: '100644',
    },
    'b/lib/utils.js': {
      content: '"use strict"\nconst bar = require("./bar.js")\n'
        + 'module.exports =\n  () => bar + "util"\n',
      mode: '100644',
    },
  }))
  const versions = {
    a: '1.0.0',
    b: '1.1.1',
  }

  await t.resolveMatchSnapshot(
    formatDiff({
      files,
      refs,
      versions,
    }),
    'should output expected result for multiple files'
  )
})
