#!/usr/bin/env node

const cli = require('../lib/cli.js')

// run the resulting command as `npm exec ...args`
process.argv[1] = require.resolve('./npm-cli.js')
process.argv.splice(2, 0, 'exec')

// break out of loop when we find a positional argument or --
// If we find a positional arg, we shove -- in front of it, and
// let the normal npm cli handle the rest.
let i
for (i = 3; i < process.argv.length; i++) {
  const arg = process.argv[i]
  if (arg === '--') {
    break
  } else if (/^-/.test(arg)) {
    // `--package foo` treated the same as `--package=foo`
    if (!arg.includes('=')) {
      i++
    }
    continue
  } else {
    // found a positional arg, put -- in front of it, and we're done
    process.argv.splice(i, 0, '--')
    break
  }
}

cli(process)
