const t = require('tap')
const path = require('node:path')
const writeJson = require('../lib/write-json.js')
const { readFile, readdir } = require('node:fs/promises')

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

t.test('writes atomically, never leaving a truncated file for concurrent readers', async t => {
  const dir = t.testdir()
  const file = path.join(dir, 'package.json')

  // A concurrent reader must always see either the old complete contents or
  // the new complete contents, never a partial/empty file mid-write.
  await writeJson(file, { a: 1 })
  let sawTruncated = false
  const reads = []
  for (let i = 0; i < 20; i++) {
    reads.push(readFile(file, 'utf8').then(str => {
      if (str.length === 0 || !str.trim().endsWith('}')) {
        sawTruncated = true
      }
      return null
    }).catch(() => {}))
  }
  await writeJson(file, { a: 2, b: [1, 2, 3] })
  await Promise.all(reads)

  t.equal(sawTruncated, false, 'never observed a truncated file')
  const final = JSON.parse(await readFile(file, 'utf8'))
  t.same(final, { a: 2, b: [1, 2, 3] })

  const leftover = (await readdir(dir)).filter(f => f.endsWith('.tmp'))
  t.same(leftover, [], 'no leftover temp files')
})

t.test('cleans up the temp file when the write fails', async t => {
  const dir = t.testdir()
  // path is a directory, not a file, so renaming onto it will fail
  const file = path.join(dir, 'package.json')
  const { mkdir } = require('node:fs/promises')
  await mkdir(file)

  await t.rejects(writeJson(file, { a: 1 }))

  const leftover = (await readdir(dir)).filter(f => f.endsWith('.tmp'))
  t.same(leftover, [], 'temp file was cleaned up after failure')
})
