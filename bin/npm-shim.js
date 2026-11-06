#!/usr/bin/env node
// Entry point for the Windows shims (npm, npx, npm.cmd, npx.cmd, npm.ps1,
// npx.ps1): node npm-shim.js <npm|npx> [args...]
//
// It runs the npm installed in the global prefix if there is one, else this
// one, like the shims did with npm-prefix.js, but decides in the node process
// that then runs npm instead of starting node a second time to print the
// prefix.

const { join } = require('node:path')
const { existsSync } = require('node:fs')
const globalPrefix = require('../lib/cli/global-prefix.js')

async function main () {
  const [node, , bin, ...args] = process.argv
  const cliName = bin === 'npx' ? 'npx-cli.js' : 'npm-cli.js'
  let prefix
  try {
    prefix = await globalPrefix()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    // eslint-disable-next-line no-console
    console.error('Could not determine Node.js install directory')
    process.exit(1)
    return
  }
  const fromPrefix = join(prefix, 'node_modules', 'npm', 'bin', cliName)
  const cli = existsSync(fromPrefix) ? fromPrefix : join(__dirname, cliName)
  // the cli sees the same argv as when it is run directly
  process.argv = [node, cli, ...args]
  require(cli)
}
main()
