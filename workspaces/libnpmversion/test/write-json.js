const t = require('tap')
const path = require('node:path')
const writeJson = require('../lib/write-json.js')
const { readFile } = require('node:fs/promises')

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
