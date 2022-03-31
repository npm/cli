const t = require('tap')
const spawn = require('@npmcli/promise-spawn')
const fs = require('@npmcli/fs')
const { resolve, join } = require('path')
const which = require('which').sync

const cwd = resolve(__dirname, '..')
const output = join(cwd, 'output')

const rmOutput = () => fs.rm(output, { recursive: true, force: true }).catch(() => {})

const spawnNpm = (cmd, ...args) => {
  // remove npm config when spawning so config set by test commands don't interfere
  const env = Object.entries(process.env)
    .filter(([k]) => k.toLowerCase() !== 'npm_config_ignore_scripts')

  return spawn(which(cmd), args, {
    env: Object.fromEntries(env),
    stdioString: true,
    cwd,
  })
}

t.before(() => spawnNpm('npm', 'rebuild', 'cmark-gfm'))
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
