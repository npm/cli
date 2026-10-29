const t = require('tap')
const { join } = require('node:path')
const { writeFileSync } = require('node:fs')
const readCmdShim = require('read-cmd-shim')

// Regression for https://github.com/npm/cli/issues/10140:
// cmd-shim@9 writes "$basedir_win/..." in the sh shim; read-cmd-shim@7.0.0
// only matched "$basedir/", so bin-links treated npm's own shim as foreign
// and raised EEXIST. 7.0.1 accepts basedir_win.
t.test('read-cmd-shim parses cmd-shim 9 basedir_win shims', async t => {
  const dir = t.testdir({})
  const shim = join(dir, 'prettier')
  writeFileSync(shim, `#!/bin/sh
basedir=\`dirname "$0"\`
basedir_win=\`cygpath -w "$basedir"\`
exec node  "$basedir_win/node_modules/prettier/bin/prettier.cjs" "$@"
`)
  t.equal(
    readCmdShim.sync(shim),
    'node_modules/prettier/bin/prettier.cjs',
    'sync parse'
  )
  t.equal(
    await readCmdShim(shim),
    'node_modules/prettier/bin/prettier.cjs',
    'async parse'
  )
})
