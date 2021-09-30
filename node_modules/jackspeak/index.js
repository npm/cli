'use strict'

const assert = require('assert')
const cliui = require('cliui')
const path = require('path')

// only way to trigger is run as non-module, which can't be instrumented
/* istanbul ignore next */
const $0 = require.main ? path.basename(require.main.filename) : '$0'

const _flag = Symbol('flag')
const flag = options => ({
  [_env]: false,
  [_list]: false,
  ...(options || {}),
  [_num]: false,
  [_opt]: false,
  [_flag]: true
})
const isFlag = arg => arg[_flag]

const _opt = Symbol('opt')
const opt = options => ({
  [_num]: false,
  [_list]: false,
  [_env]: false,
  ...(options || {}),
  [_flag]: false,
  [_opt]: true
})
const isOpt = arg => arg[_opt]

const _num = Symbol('num')
const num = options => (opt({
  ...(options || {}),
  [_num]: true,
}))
const isNum = arg => arg[_num]

const isArg = arg => isOpt(arg) || isFlag(arg)

const _env = Symbol('env')
const env = options => ({
  [_flag]: false,
  [_list]: false,
  [_opt]: true,
  [_num]: false,
  ...(options || {}),
  [_env]: true,
})
const isEnv = arg => arg[_env]

const _list = Symbol('list')
const list = options => ({
  [_flag]: false,
  [_opt]: true,
  [_num]: false,
  [_env]: false,
  ...(options || {}),
  [_list]: true
})
const isList = arg => arg[_list]

const count = options => list(flag(options))
const isCount = arg => isList(arg) && isFlag(arg)

const trim = string => string
  // remove single line breaks
  .replace(/([^\n])\n[ \t]*([^\n])/g, '$1 $2')
  // normalize mid-line whitespace
  .replace(/([^\n])[ \t]+([^\n])/g, '$1 $2')
  // two line breaks are enough
  .replace(/\n{3,}/g, '\n\n')
  .trim()

const usageMemo = Symbol('usageMemo')
const usage = j => {
  if (j[usageMemo])
    return j[usageMemo]

  const width = Math.min(
    process && process.stdout && process.stdout.columns || 80,
    80
  )

  const ui = cliui({ width })

  if (!/^Usage:/.test(j.help[0].text)) {
    ui.div('Usage:')
    ui.div({
      text: `${$0} <options>`,
      padding: [0, 0, 1, 2]
    })
  }

  let maxMax = 26
  let maxWidth = 8
  let prev = null
  j.help.forEach(row => {
    // find the max width of left-hand sides, and decide whether or not
    // to skip a line based on the length of the next option
    if (row.left) {
      if (row.text.length > width - maxMax) {
        if (prev)
          prev.skipLine = true
        row.skipLine = true
      }
      prev = row
      const len = row.left.length + 4
      if (len > maxWidth && len < maxMax)
        maxWidth = len
    } else {
      if (prev)
        prev.skipLine = true
      prev = null
    }
  })

  j.help.forEach(row => {
    if (row.left) {
      // If the row is too long, don't wrap it
      // Bump the right-hand side down a line to make room
      if (row.left.length >= maxWidth - 2) {
        ui.div({
          text: row.left,
          padding: [ 0, 0, 0, 2 ]
        })
        ui.div({
          text: row.text,
          padding: [ 0, 0, 0, maxWidth ]
        })
      } else {
        ui.div({
          text: row.left,
          padding: [0, 1, 0, 2],
          width: maxWidth,
        }, { text: row.text })
      }
      if (row.skipLine)
        ui.div()
    } else
      ui.div(row)
  })

  return j[usageMemo] = ui.toString()
}

// parse each section
// Resulting internal object looks like:
// {
//   help: [
//     { text, padding, left }, ...
//   ],
//   // single-char shorthands
//   shortOpts: { char: name, ... }
//   shortFlags: { char: name, ... }
//   options: { all opts and flags }
//   main: mainFn or null,
//   argv: argument list being parsed,
//   result: parsed object passed to main function and returned
//   implies: all the implied variable values (set last)
// }
const jack = (...sections) => execute(parse_(buildParser(newObj(), sections)))

const kvToArg = j => (k, v) =>
  j.options[k] && isFlag(j.options[k]) ? (v ? `--${k}` : `--no-${k}`)
  : `--${k}=${v}`

const objToArgv = j => obj => Object.keys(obj).reduce((set, k) => {
  const toArg = kvToArg(j)
  const val = obj[k]
  if (Array.isArray(val))
    set.push(...val.map(v => toArg(k, v)))
  else
    set.push(toArg(k, val))
  return set
}, [])

const update = j => args => {
  const argv = []
  const toArgv = objToArgv(j)
  if (typeof args === 'string')
    argv.push(args)
  else if (Array.isArray(args))
    argv.push(...args)
  else if (args)
    argv.push(...toArgv(args))
  const result = reparse(j)(argv)
  Object.keys(result)
    .filter(k => k !== '_' && !j.explicit.has(k))
    .forEach(k => j.result[k] = result[k])
}

const reparse = j => args => {
  const argv = Array.isArray(args) ? args : [args]
  return parse_({
    ...j,
    explicit: new Set(),
    result: { _: [] },
    help: [],
    main: null,
    argv,
  }).result
}

const newObj = () => ({
  help: [],
  shortOpts: {},
  shortFlags: {},
  options: {},
  result: { _: [] },
  explicit: new Set(),
  main: null,
  argv: null,
  env: null,
  implies: {},
  [usageMemo]: false,
})

const execute = j => {
  if (j.result.help)
    console.log(usage(j))
  else if (j.main)
    j.main(j.result)
  return j.result
}

const buildParser = (j, sections) => {
  let inHeader = true

  sections.forEach(section => {
    if (Array.isArray(section))
      section = { argv: section }
    if (section.argv && !isArg(section.argv)) {
      !j.argv || assert(false, 'argv specified multiple times')
      j.argv = section.argv
    }

    if (section.env && !isArg(section.env)) {
      !j.env || assert(false, 'env specified multiple times\n' +
             '(did you set it after defining some environment args?)')
      j.env = section.env
    }

    if (section.usage && !isArg(section.usage)) {
      const val = section.usage
      typeof val === 'string' || Array.isArray(val) || assert(false,
             'usage must be a string or array')
      j.help.push({ text: 'Usage:' })
      j.help.push.apply(j.help, [].concat(val).map(text => ({
        text, padding: [0, 0, 0, 2]
      })))
      j.help.push({ text: '' })
    }

    if (section.description && !isArg(section.description)) {
      typeof section.description === 'string' || assert(false,
             'description must be string')
      inHeader = false
      j.help.push({
        text: trim(`${section.description}:`),
        padding: [0, 0, 1, 0]
      })
    }

    if (section.help && !isArg(section.help)) {
      typeof section.help === 'string' || assert(false, 'help must be a string')
      j.help.push({
        text: trim(section.help) + '\n',
        padding: inHeader ? null : [ 0, 0, 0, 2 ]
      })
    }

    if (section.main && !isArg(section.main))
      addMain(j, section.main)

    !section._ || assert(false, '_ is reserved for positional arguments')

    const names = Object.keys(section)
    for (let n = 0; n < names.length; n++) {
      inHeader = false
      const name = names[n]
      const val = section[name]

      if (isEnv(val))
        addEnv(j, name, val)
      else if (isArg(val))
        addArg(j, name, val)
      else {
        switch (name) {
          case 'argv':
          case 'description':
          case 'usage':
          case 'help':
          case 'main':
          case 'env':
            continue
          default:
            assert(false, `${name} not flag, opt, or env`)
        }
      }
    }
  })

  // if not already mentioned, add the note about -h and `--` ending parsing
  if (!j.options.help)
    addArg(j, 'help', flag({ description: 'Show this helpful output' }))

  if (!j.options['--']) {
    addHelpText(j, '', flag({
      description: `Stop parsing flags and options, treat any additional
                    command line arguments as positional arguments.`
    }))
  }

  return j
}

const envToNum = (name, spec) => e => {
  if (e === '')
    return undefined

  return toNum(e, `environment variable ${name}`, spec)
}

const envToBool = name => e => {
  typeof e === 'boolean' ||
    e === '' ||
    e === '1' ||
    e === '0' ||
    typeof e === 'number' ||
    assert(false,
      `Environment variable ${name} must be set to 0 or 1 only`)
  return !!+e
}

const countBools = l => l.reduce((v, a) => v ? a + 1 : a - 1, 0)

const envVal = (j, name, val) => {
  if (!j.env)
    j.env = process.env

  const def = val.default
  const has = Object.prototype.hasOwnProperty.call(j.env, name)
  const e = has && j.env[name] !== '' ? j.env[name]
    : def !== undefined ? def
    : ''

  if (isList(val)) {
    val.delimiter || assert(false, `env list ${name} lacks delimiter`)
    if (!has)
      return []
    else {
      const split = e.split(val.delimiter)
      return isFlag(val) ? countBools(split.map(envToBool(name)))
        : isNum(val) ? split.map(envToNum(name, val)).filter(e => e !== undefined)
        : split
    }
  } else if (isFlag(val))
    return envToBool(name)(e)
  else if (isNum(val))
    return envToNum(name, val)(e)
  else
    return e
}

const addEnv = (j, name, val) => {
  assertNotDefined(j, name)
  const e = envVal(j, name, val)
  if (Object.prototype.hasOwnProperty.call(j.env, name))
    set(j, name, val, e)
  else
    j.result[name] = e
  addHelpText(j, name, val)
}

const assertNotDefined = (j, name) =>
  !j.options[name] && !j.shortOpts[name] && !j.shortFlags[name] ||
    assert(false, `${name} defined multiple times`)

const addArg = (j, name, val) => {
  assertNotDefined(j, name)
  if (val.envDefault)
    val.default = envVal(j, val.envDefault, val)

  if (isFlag(val))
    addFlag(j, name, val)
  else
    addOpt(j, name, val)
}

const addOpt = (j, name, val) => {
  addShort(j, name, val)
  j.options[name] = val
  addHelpText(j, name, val)
  if (!val.alias)
    j.result[name] = isList(val) ? [] : val.default
}

const addFlag = (j, name, val) => {
  if (name === '--') {
    addHelpText(j, '', flag(val))
    j.options['--'] = true
    return
  }

  if (name === 'help' && !val.short)
    val.short = 'h'

  const negate = name.substr(0, 3) === 'no-'
  // aliases can't be negated
  if (!negate && !val.alias)
    !j.options[`no-${name}`] || assert(false,
      `flag '${name}' specified, but 'no-${name}' already defined`)

  addShort(j, name, val)

  j.options[name] = val
  if (!negate && !val.alias)
    j.result[name] = isList(val) ? 0 : (val.default || false)

  addHelpText(j, name, val)

  // pick up the description and short arg
  if (!negate && !val.alias)
    addFlag(j, `no-${name}`, flag({
      description: `${
        isCount(val) ? 'decrement' : 'switch off'
      } the --${name} flag`,
      hidden: val.hidden,
      implies: val.implies,
      ...(val.negate || {}),
      [_list]: isList(val)
    }))
}

const addHelpText = (j, name, val) => {
  // help text
  if (val.hidden)
    return

  const desc = trim(val.description || (
    val.alias ? `Alias for ${[].concat(val.alias).join(' ')}`
    : '[no description provided]'
  ))
  const mult = isList(val) && !isEnv(val) ? `${
    desc.indexOf('\n') === -1 ? '\n' : '\n\n'
  }Can be set multiple times` : ''
  const text = `${desc}${mult}`

  const hint = val.hint || name
  const shortEq = val.short && val.short.length > 1 ? '=' : ''
  const short = val.short ? (
    isFlag(val) ? `-${val.short} `
    : `-${val.short}${shortEq}<${hint}> `
  ) : ''

  const left = isEnv(val) ? name
    : isFlag(val) ? `${short}--${name}`
    : `${short}--${name}=<${hint}>`

  j.help.push({ text, left })
}

const addShort = (j, name, val) => {
  if (!val.short)
    return

  assertNotDefined(j, val.short)
  val.short !== 'h' || name === 'help' || assert(false,
    `${name} using 'h' short val, reserved for --help`)

  if (isFlag(val))
    j.shortFlags[val.short] = name
  else
    j.shortOpts[val.short] = name
}

const addMain = (j, main) => {
  typeof main === 'function' || assert(false, 'main must be function')
  !j.main || assert(false, 'main function specified multiple times')
  j.main = result => {
    main(result)
    return result
  }
}

const getArgv = j => {
  const argv = [...(j.argv || process.argv)]

  if (argv[0] === process.execPath) {
    argv.shift()
    argv.shift()
  }
  return argv
}

const toNum = (val, key, spec) => {
  !isNaN(val) || assert(false, `non-number '${val}' given for numeric ${key}`)
  val = +val
  isNaN(spec.max) || val <= spec.max || assert(false,
         `value ${val} for ${key} exceeds max (${spec.max})`)
  isNaN(spec.min) || val >= spec.min || assert(false,
         `value ${val} for ${key} below min (${spec.min})`)
  return val
}

const wrap = (text, padding) => {
  const ui = cliui()
  ui.div({ text, padding })
  return ui.toString()
}

const assertValid = (val, key, spec) =>
  !isOpt(spec) || !spec.valid ||
    spec.valid.indexOf(val) !== -1 || assert(false,
      `Invalid value ${val} provided for ${key}.
    Must be one of:
${wrap(spec.valid.join(' '), [ 0, 2, 0, 8 ])}`)

const parse_ = j => {
  const argv = getArgv(j)
  const original = [...argv]

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg.charAt(0) !== '-' || arg === '-') {
      j.result._.push(arg)
      continue
    }

    if (arg === '--') {
      j.result._ = j.result._.concat(argv.slice(i + 1))
      i = argv.length
      continue
    }

    // short-flags
    if (arg.charAt(1) !== '-') {
      const expand = []
      for (let f = 1; f < arg.length; f++) {
        const fc = arg.charAt(f)
        const sf = j.shortFlags[fc]
        const so = j.shortOpts[fc]
        if (sf)
          expand.push(`--${sf}`)
        else if (so) {
          const soslice = arg.slice(f + 1)
          const soval = !soslice || soslice.charAt(0) === '='
            ? soslice : '=' + soslice

          expand.push(`--${so}${soval}`)
          f = arg.length
        } else if (arg !== `-${fc}`)
          // this will trigger a failure with the appropriate message
          expand.push(`-${fc}`)
      }
      if (expand.length) {
        argv.splice.apply(argv, [i, 1].concat(expand))
        i--
        continue
      }
    }

    const argsplit = arg.split('=')
    const literalKey = argsplit.shift()

    // check if there's a >1 char shortopt/flag for this key,
    // and de-reference it as an alias

    const k = literalKey.replace(/^--?/, '')
    // pick up shorts that aren't single-char
    const key = j.shortOpts[k] || j.shortFlags[k] || k
    let val = argsplit.length ? argsplit.join('=') : null

    const spec = j.options[key]

    spec || assert(false, `invalid argument: ${literalKey}`)
    !isFlag(spec) || val === null || assert(false,
      `value provided for boolean flag: ${key}`)

    if (isOpt(spec) && val === null) {
      val = argv[++i]
      val !== undefined || assert(false,
        `no value provided for option: ${key}`)
    }

    if (spec.alias) {
      const alias = isFlag(spec) ? spec.alias
      : [].concat(spec.alias).map(a => a.replace(/\$\{value\}/g, val))
      argv.splice.apply(argv, [i, 1].concat(alias))
      i--
      continue
    }

    const negate = isFlag(spec) && key.substr(0, 3) === 'no-'
    const name = negate ? key.substr(3) : key
    if (isNum(spec))
      val = toNum(val, `arg ${literalKey}`, spec)

    assertValid(val, key, spec)

    if (isList(spec)) {
      if (isOpt(spec)) {
        if (!Array.isArray(j.result[name]))
          j.result[name] = []
        set(j, name, spec, j.result[name].concat(val))
      } else {
        const v = j.result[name] || 0
        set(j, name, spec, negate ? v - 1 : v + 1)
      }
    } else {
      // either flag or opt
      set(j, name, spec, isFlag(spec) ? !negate : val)
    }
  }

  for (let i in j.implies)
    for (let k in j.implies[i])
      j.result[k] = j.implies[i][k]

  Object.defineProperty(j.result._, 'usage', {
    value: () => console.log(usage(j))
  })
  Object.defineProperty(j.result._, 'update', { value: update(j) })
  Object.defineProperty(j.result._, 'reparse', { value: reparse(j) })
  Object.defineProperty(j.result._, 'explicit', { value: j.explicit })
  Object.defineProperty(j.result._, 'parsed', { value: argv })
  Object.defineProperty(j.result._, 'original', { value: original })

  return j
}

const set = (j, key, spec, val) => {
  j.result[key] = val
  j.explicit.add(key)
  if (spec && spec.implies) {
    if (val === false)
      delete j.implies[key]
    else
      j.implies[key] = {...spec.implies}
  }
  // delete implications about this, since we have an explicit value
  for (const i in j.implies)
    delete j.implies[i][key]
}

// just parse the arguments and return the result
const parse = (...sections) => parse_(buildParser(newObj(), sections)).result

module.exports = { jack, flag, opt, list, count, env, parse, num }
