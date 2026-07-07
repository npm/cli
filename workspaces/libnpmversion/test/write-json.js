const t = require('tap')
const path = require('node:path')
const writeJson = require('../lib/write-json.js')
const { readFile, readdir, mkdir } = require('node:fs/promises')

const kIndent = Symbol.for('indent')
const kNewline = Symbol.for('newline')

t.test('write json with newlines and indent set', async t => {
  t.test('numeric three space indent, CRLF line breaks', async t => {
    const dir = t.testdir()
    const file = path.join(dir, 'x')

    await writeJson(file, {
      [kNewline]: '\r\n',
      [kIndent]: 3,
      a: 1,
      b: [2, 3],
    })

    const str = await readFile(file, 'utf-8')
    t.equal(str, `{\r\n   "a": 1,\r\n   "b": [\r\n      2,\r\n      3\r\n   ]\r\n}\r\n`)
  })

  t.test('string tap indent, CRLF line breaks', async t => {
    const dir = t.testdir()
    const file = path.join(dir, 'x')

    await writeJson(file, {
      [kNewline]: 'XYZ\n',
      [kIndent]: '\t',
      a: 1,
      b: [2, 3],
    })

    const str = await readFile(file, 'utf-8')
    t.equal(str, `{XYZ\n\t"a": 1,XYZ\n\t"b": [XYZ\n\t\t2,XYZ\n\t\t3XYZ\n\t]XYZ\n}XYZ\n`)
  })

  t.test('default newline and indent', async t => {
    const dir = t.testdir()
    const file = path.join(dir, 'x')

    await writeJson(file, {
      a: 1,
      b: [2, 3],
    })

    const str = await readFile(file, 'utf-8')
    t.match(str, `{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}\n`)
  })

  t.end()
})

t.test('writes atomically, never leaving a truncated file for readers', async t => {
  const dir = t.testdir()
  const file = path.join(dir, 'package.json')

  // seed an initial version of the file
  await writeJson(file, { a: 1 })

  const bigPkg = { a: 2, filler: 'x'.repeat(100000) }

  const state = { sawTruncated: false, readsDone: false }

  const readLoop = async () => {
    while (!state.readsDone) {
      let str
      try {
        str = await readFile(file, 'utf-8')
      } catch {
        // file briefly missing between unlink/rename is not expected here,
        // but ignore transient ENOENT if it ever occurs
        continue
      }
      if (str !== '{\n  "a": 1\n}\n') {
        try {
          JSON.parse(str)
        } catch {
          state.sawTruncated = true
        }
      }
    }
  }

  const readers = Array.from({ length: 20 }, () => readLoop())

  await writeJson(file, bigPkg)
  state.readsDone = true
  await Promise.all(readers)

  t.equal(state.sawTruncated, false, 'no concurrent reader ever saw a truncated file')

  const final = await readFile(file, 'utf-8')
  t.match(JSON.parse(final), { a: 2 })

  const leftoverTmp = (await readdir(dir)).filter(f => f.endsWith('.tmp'))
  t.strictSame(leftoverTmp, [], 'no leftover temp files')
})

t.test('cleans up the temp file when the rename fails', async t => {
  const dir = t.testdir()
  // the target path is a directory, so renaming the temp file onto it fails
  const target = path.join(dir, 'not-a-file')
  await mkdir(target)

  await t.rejects(writeJson(target, { a: 1 }))

  const leftoverTmp = (await readdir(dir)).filter(f => f.endsWith('.tmp'))
  t.strictSame(leftoverTmp, [], 'temp file was cleaned up after failure')
})

t.test('swallows the cleanup error when the temp file was never created', async t => {
  const dir = t.testdir()
  // the parent dir doesn't exist, so the initial write to the temp file
  // fails before it's ever created, and the unlink cleanup also fails
  const target = path.join(dir, 'missing-subdir', 'package.json')

  await t.rejects(writeJson(target, { a: 1 }))
})
