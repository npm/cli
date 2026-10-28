const t = require('tap')
const shouldPrintPatch = require('../lib/should-print-patch.js')

t.test('valid filenames', async t => {
  t.equal(await shouldPrintPatch('LICENSE'), true)
  t.equal(await shouldPrintPatch('.gitignore'), true)
  t.equal(await shouldPrintPatch('foo.md'), true)
  t.equal(await shouldPrintPatch('./bar.txt'), true)
  t.equal(await shouldPrintPatch('/a/b/c/bar.html'), true)
})

t.test('invalid filenames', async t => {
  t.equal(await shouldPrintPatch('foo.exe'), false)
  t.equal(await shouldPrintPatch('./foo.jpg'), false)
  t.equal(await shouldPrintPatch('/a/b/c/bar.bin'), false)
})

t.test('using --text/-a option', async t => {
  const opts = {
    diffText: true,
  }
  t.equal(await shouldPrintPatch('foo.exe', opts), true)
  t.equal(await shouldPrintPatch('./foo.jpg', opts), true)
  t.equal(await shouldPrintPatch('/a/b/c/bar.bin', opts), true)
})
