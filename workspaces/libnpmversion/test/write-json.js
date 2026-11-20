const t = require('tap')
const fs = require('node:fs')
const path = require('node:path')
const writeJson = require('../lib/write-json.js')
const requireInject = require('require-inject')
const writeFileAtomic = require('write-file-atomic')
const { readFile, writeFile } = require('node:fs/promises')

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

  t.test('atomic write keeps destination valid until replacement', async t => {
    const dir = t.testdir()
    const file = path.join(dir, 'package.json')
    const originalPkg = { name: 'test-package', version: '1.0.0' }
    const updatedPkg = { name: 'test-package', version: '1.0.1' }
    await writeFile(file, JSON.stringify(originalPkg))

    let signalRename
    const renameStarted = new Promise(resolve => {
      signalRename = resolve
    })
    let releaseRename
    const renameGate = new Promise(resolve => {
      releaseRename = resolve
    })
    const withTimeout = promise => {
      let timer
      return Promise.race([
        promise,
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('Timed out waiting for atomic write')), 10000)
        }),
      ]).finally(() => clearTimeout(timer))
    }

    let restoreRename = () => {}
    const writeJsonWithGatedRename = requireInject('../lib/write-json.js', {
      'write-file-atomic': (...args) => {
        const rename = fs.rename
        const gatedRename = (source, destination, callback) => {
          if (path.resolve(destination) !== file) {
            return rename(source, destination, callback)
          }

          signalRename(source)
          renameGate
            .then(() => rename(source, destination, callback))
            .catch(callback)
        }

        fs.rename = gatedRename
        restoreRename = () => {
          if (fs.rename === gatedRename) {
            fs.rename = rename
          }
        }
        return writeFileAtomic(...args).finally(restoreRename)
      },
    })

    const writePromise = writeJsonWithGatedRename(file, updatedPkg)

    try {
      const tempFile = await Promise.race([
        renameStarted,
        withTimeout(writePromise.then(() => {
          throw new Error('Atomic write completed before rename was observed')
        })),
      ])

      t.same(JSON.parse(await readFile(file, 'utf8')), originalPkg, 'destination remains old valid JSON')
      t.same(JSON.parse(await readFile(tempFile, 'utf8')), updatedPkg, 'temporary file contains new valid JSON')
    } finally {
      releaseRename()
      restoreRename()
    }

    await withTimeout(writePromise)
    t.same(JSON.parse(await readFile(file, 'utf8')), updatedPkg, 'destination contains new valid JSON after replacement')
  })

  t.end()
})
