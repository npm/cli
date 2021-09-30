#!/usr/bin/env node

const Parser = require('../')
const etoa = require('events-to-array')
const util = require('util')

const args = process.argv.slice(2)
let json = null
let flat = false
let bail = false
let preserveWhitespace = true
let omitVersion = false
let strict = false

function version () {
  console.log(require('../package.json').version)
  process.exit(0)
}

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === '-j') {
    const val = +args[i + 1]
    if (val >= 0) {
      json = val
      i += 1
    } else
      json = 2
    continue
  } else {
    const m = arg.match(/^--json(?:=([0-9]+))?$/)
    if (m) {
      if (+m[1] >= 0)
        json = +m[1]
      else if (+args[i + 1] >= 0) {
        json = +args[i + 1]
        i += 1
      } else
        json = 2
      continue
    }
  }

  if (arg === '-v' || arg === '--version')
    version()
  else if (arg === '-o' || arg === '--omit-version')
    omitVersion = true
  else if (arg === '-w' || arg === '--ignore-all-whitespace')
    preserveWhitespace = false
  else if (arg === '-b' || arg === '--bail')
    bail = true
  else if (arg === '-B' || arg === '--no-bail')
    bail = false
  else if (arg === '-t' || arg === '--tap')
    json = 'tap'
  else if (arg === '-l' || arg === '--lines')
    json = 'lines'
  else if (arg === '-h' || arg === '--help')
    usage()
  else if (arg === '-f' || arg === '--flat')
    flat = true
  else if (arg === '-F' || arg === '--no-flat')
    flat = false
  else if (arg === '--strict')
    strict = true
  else if (arg === '--no-strict')
    strict = false
  else if (arg === '-s' || arg === '--silent')
    json = 'silent'
  else
    console.error('Unrecognized arg: %j', arg)
}

function usage () {
  console.log(`Usage:
  tap-parser <options>

Parses TAP data from stdin, and outputs the parsed result
in the format specified by the options.  Default output
uses node's \`util.inspect()\` method.

Options:

  -j [<indent>] | --json[=indent]
    Output event data as JSON with the specified indentation (default=2)

  -t | --tap
    Output data as reconstituted TAP based on parsed results

  -l | --lines
    Output each parsed line as it is recognized by the parser

  -b | --bail
    Emit a \`Bail out!\` at the first failed test point encountered

  -B | --no-bail
    Do not bail out at the first failed test point encountered
    (Default)

  -f | --flat
    Flatten all assertions to the top level parser

  -F | --no-flat
    Do not flatten all assertions to the top level parser
    (Default)

  -w | --ignore-all-whitespace
    Skip over blank lines outside of YAML blocks

  -o | --omit-version
    Ignore the \`TAP version 13\` line at the start of tests

  --strict
    Run the parser in strict mode

  --no-strict
    Do not run the parser in strict mode

  -s | --silent
    Do not print output, just exit success/failure based on TAP stream
`)

  // prevent the EPIPE upstream when the data drops on the floor
  /* istanbul ignore else */
  if (!process.stdin.isTTY)
    process.stdin.resume()

  process.exit()
}

const yaml = require('tap-yaml')

function format (msg) {
  if (json === 'tap')
    return Parser.stringify(msg, options)
  else if (json !== null)
    return JSON.stringify(msg, null, +json)
  else
    return util.inspect(msg, null, Infinity)
}

const options = {
  bail: bail,
  preserveWhitespace: preserveWhitespace,
  omitVersion: omitVersion,
  strict: strict,
  flat: flat,
}

if (json === 'lines' || json === 'silent') {
  const parser = new Parser(options)
  if (json === 'lines')
    parser.on('line', l => process.stdout.write(l))
  parser.on('complete', () => process.exit(parser.ok ? 0 : 1))
  process.stdin.pipe(parser)
} else {
  const input = []
  process.stdin.on('data', c => input.push(c)).on('end', () => {
    const buf = Buffer.concat(input)
    const result = Parser.parse(buf, options)
    const summary = result[ result.length - 1 ]
    console.log(format(result))
    if (summary[0] !== 'complete' || !summary[1].ok)
      process.exit(1)
  })
}
