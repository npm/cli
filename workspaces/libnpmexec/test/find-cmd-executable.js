const t = require('tap')
const { delimiter, resolve } = require('node:path')
const { findCmdExecutable, unsafeForCmd } = require('../lib/find-cmd-executable.js')

// an explicit PATHEXT keeps these tests independent of filesystem case sensitivity
const env = { PATHEXT: '.EXE;.CMD' }

t.test('unsafeForCmd', async t => {
  for (const name of ['bin%PATH%', 'bin!PATH!', 'bin"name', 'bin\nname', 'bin\0name']) {
    t.ok(unsafeForCmd(name), JSON.stringify(name))
  }
  for (const name of ['bin', 'two words', 'C:\\Program Files (x86)\\bin.cmd', 'bin&name']) {
    t.notOk(unsafeForCmd(name), JSON.stringify(name))
  }
})

t.test('leaves names that cmd.exe does not search PATH for alone', async t => {
  const runPath = t.testdir({ node_modules: { '.bin': { 'tool.CMD': '' } } })
  for (const name of ['./tool', '.\\tool', 'node_modules/.bin/tool', 'C:tool']) {
    t.equal(await findCmdExecutable(name, { runPath, env }), name)
  }
})

t.test('resolves a bin in node_modules/.bin of the run path', async t => {
  const runPath = t.testdir({ node_modules: { '.bin': { 'tool.CMD': '' } } })
  t.equal(
    await findCmdExecutable('tool', { runPath, env }),
    resolve(runPath, 'node_modules', '.bin', 'tool.CMD')
  )
})

t.test('resolves a bin in node_modules/.bin of an ancestor', async t => {
  const root = t.testdir({
    node_modules: { '.bin': { 'tool.CMD': '' } },
    packages: { a: {} },
  })
  t.equal(
    await findCmdExecutable('tool', { runPath: resolve(root, 'packages', 'a'), env }),
    resolve(root, 'node_modules', '.bin', 'tool.CMD')
  )
})

t.test('searches the current directory first, then binPaths, then PATH', async t => {
  const dir = t.testdir({
    cwd: { 'tool.CMD': '' },
    empty: {},
    bin: { 'tool.CMD': '' },
    path: { 'tool.CMD': '', 'other.EXE': '' },
  })
  const runPath = resolve(dir, 'cwd')
  const binPaths = [resolve(dir, 'bin')]
  const PATH = ['', resolve(dir, 'path')].join(delimiter)

  t.equal(
    await findCmdExecutable('tool', { binPaths, runPath, env: { ...env, PATH } }),
    resolve(runPath, 'tool.CMD'),
    'current directory wins'
  )
  t.equal(
    await findCmdExecutable('tool', {
      binPaths,
      runPath,
      env: { ...env, PATH, NoDefaultCurrentDirectoryInExePath: '' },
    }),
    resolve(dir, 'bin', 'tool.CMD'),
    'NoDefaultCurrentDirectoryInExePath skips the current directory'
  )
  t.equal(
    await findCmdExecutable('other', {
      binPaths,
      runPath: resolve(dir, 'empty'),
      env: { ...env, PATH },
    }),
    resolve(dir, 'path', 'other.EXE'),
    'falls through to PATH'
  )
})

t.test('tries PATHEXT extensions per directory, in order', async t => {
  const runPath = t.testdir({ 'tool.EXE': '', 'tool.CMD': '' })
  t.equal(await findCmdExecutable('tool', { runPath, env }), resolve(runPath, 'tool.EXE'))
})

t.test('uses the name as is when it already has a PATHEXT extension', async t => {
  const runPath = t.testdir({ 'tool.CMD': '', 'tool.CMD.EXE': '' })
  t.equal(await findCmdExecutable('tool.CMD', { runPath, env }), resolve(runPath, 'tool.CMD'))
})

t.test('defaults PATHEXT when it is not set', async t => {
  const runPath = t.testdir({ 'tool.CMD': '' })
  t.equal(await findCmdExecutable('tool', { runPath, env: {} }), resolve(runPath, 'tool.CMD'))
})

t.test('ignores directories that match a candidate name', async t => {
  const runPath = t.testdir({ 'tool.CMD': {} })
  t.equal(await findCmdExecutable('tool', { runPath, env }), 'tool')
})

t.test('keeps the bare name when nothing is found', async t => {
  const runPath = t.testdir()
  t.equal(await findCmdExecutable('missing', { runPath, env }), 'missing')
})

t.test('keeps the bare name when the resolved path cannot be quoted safely', async t => {
  const dir = t.testdir({ 'a%b': { 'tool.CMD': '' } })
  t.equal(await findCmdExecutable('tool', { runPath: resolve(dir, 'a%b'), env }), 'tool')
})
