const t = require('tap')
const spawn = require('@npmcli/promise-spawn')
const fs = require('@npmcli/fs')
const { resolve, join } = require('path')
const which = require('which').sync

const cwd = resolve(__dirname, '..')
const output = join(cwd, 'output')

const rmOutput = () => fs.rm(output, { recursive: true, force: true }).catch(() => {})

const spawnNpm = (cmd, ...args) => spawn(which(cmd), args, {
  stdioString: true,
  cwd,
})

t.beforeEach(() => rmOutput())

t.test('docs', async (t) => {
  t.rejects(() => fs.stat(output))
  const docs = await spawnNpm('node', join('bin', 'dockhand'))
  t.equal(docs.code, 0)
  t.ok((await fs.stat(output)).isDirectory())
})

t.test('files used by documention repo', async (t) => {
  t.ok((await fs.stat(join(cwd, 'content'))).isDirectory())
  t.ok((await fs.stat(join(cwd, 'nav.yml'))).isFile())
})
