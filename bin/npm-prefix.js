#!/usr/bin/env node
// This is a single-use bin to help windows discover the proper prefix for npm
// without having to load all of npm first
// It does not accept argv params
// The Windows shims now make this decision in-process via npm-shim.js; this
// is still used by bin/npm and bin/npx outside Git Bash and Cygwin (WSL).

const globalPrefix = require('../lib/cli/global-prefix.js')

async function main () {
  try {
    // eslint-disable-next-line no-console
    console.log(await globalPrefix())
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}
main()
