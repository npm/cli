#!/usr/bin/env node
if (__filename !== process.argv[1] || process.argv.length < 3)
  throw new Error('this should only be used to load a jsx file')
process.argv.splice(1, 2, require('path').resolve(process.argv[2]))
require('import-jsx')(process.argv[1])
