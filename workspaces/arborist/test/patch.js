const t = require('tap')
const { readFileSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')
const { createTwoFilesPatch } = require('diff')
const { applyPatchToDir, patchIntegrity } = require('../lib/patch.js')

// build a git-style unified diff for a single file change
const filePatch = (file, before, after) => {
  let p = createTwoFilesPatch(`a/${file}`, `b/${file}`, before, after, '', '')
    .replace('===================================================================\n', '')
  if (before === '') {
    p = p.replace(`--- a/${file}\t`, '--- /dev/null\t')
  }
  if (after === '') {
    p = p.replace(`+++ b/${file}\t`, '+++ /dev/null\t')
  }
  return p
}

t.test('modifies an existing file', async t => {
  const dir = t.testdir({ 'index.js': 'const v = 1\n' })
  await applyPatchToDir({ patch: filePatch('index.js', 'const v = 1\n', 'const v = 2\n'), cwd: dir })
  t.equal(readFileSync(resolve(dir, 'index.js'), 'utf8'), 'const v = 2\n')
})

t.test('creates a new file', async t => {
  const dir = t.testdir({ 'index.js': 'x\n' })
  await applyPatchToDir({ patch: filePatch('added.js', '', 'new\n'), cwd: dir })
  t.equal(readFileSync(resolve(dir, 'added.js'), 'utf8'), 'new\n')
})

t.test('deletes a file', async t => {
  const dir = t.testdir({ 'gone.js': 'bye\n' })
  await applyPatchToDir({ patch: filePatch('gone.js', 'bye\n', ''), cwd: dir })
  t.notOk(existsSync(resolve(dir, 'gone.js')), 'file removed')
})

t.test('creates nested directories for new files', async t => {
  const dir = t.testdir({})
  await applyPatchToDir({ patch: filePatch('lib/deep/x.js', '', 'deep\n'), cwd: dir })
  t.equal(readFileSync(resolve(dir, 'lib/deep/x.js'), 'utf8'), 'deep\n')
})

t.test('throws on context drift (fuzz 0)', async t => {
  const dir = t.testdir({ 'index.js': 'totally different content\n' })
  await t.rejects(
    applyPatchToDir({ patch: filePatch('index.js', 'const v = 1\n', 'const v = 2\n'), cwd: dir }),
    { code: 'EPATCHFAILED' }
  )
})

t.test('patchIntegrity is stable and content-addressed', t => {
  const a = patchIntegrity('hello')
  const b = patchIntegrity(Buffer.from('hello'))
  const c = patchIntegrity('world')
  t.equal(a, b, 'string and buffer match')
  t.match(a, /^sha512-/, 'is a sha512 SSRI')
  t.not(a, c, 'different content -> different hash')
  t.end()
})

t.test('round-trips a multi-file diff', async t => {
  const dir = t.testdir({ 'a.js': 'aaa\n', 'del.js': 'd\n' })
  const patch =
    filePatch('a.js', 'aaa\n', 'AAA\n') +
    filePatch('b.js', '', 'bbb\n') +
    filePatch('del.js', 'd\n', '')
  await applyPatchToDir({ patch, cwd: dir })
  t.equal(readFileSync(resolve(dir, 'a.js'), 'utf8'), 'AAA\n')
  t.equal(readFileSync(resolve(dir, 'b.js'), 'utf8'), 'bbb\n')
  t.notOk(existsSync(resolve(dir, 'del.js')))
})
