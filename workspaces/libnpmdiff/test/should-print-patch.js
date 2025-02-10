const t = require('tap')
const shouldPrintPatch = require('../lib/should-print-patch.js')

t.test('valid filenames', async t => {
  await t.resolves(shouldPrintPatch('LICENSE'), true)
  await t.resolves(shouldPrintPatch('.gitignore'), true)
  await t.resolves(shouldPrintPatch('foo.md'), true)
  await t.resolves(shouldPrintPatch('./bar.txt'), true)
  await t.resolves(shouldPrintPatch('/a/b/c/bar.html'), true)
})

t.test('invalid filenames', async t => {
  await t.resolves(shouldPrintPatch('foo.exe'), false)
  await t.resolves(shouldPrintPatch('./foo.jpg'), false)
  await t.resolves(shouldPrintPatch('/a/b/c/bar.bin'), false)
})

t.test('using --text/-a option', async t => {
  const opts = {
    diffText: true,
  }
  await t.resolves(shouldPrintPatch('foo.exe', opts), true)
  await t.resolves(shouldPrintPatch('./foo.jpg', opts), true)
  await t.resolves(shouldPrintPatch('/a/b/c/bar.bin', opts), true)
})
