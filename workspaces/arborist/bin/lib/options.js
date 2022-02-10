const nopt = require('nopt')
const path = require('path')

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const cleanPath = (val) => {
  const k = Symbol('key')
  const data = {}
  nopt.typeDefs.path.validate(data, k, val)
  return data[k]
}

const parse = (...noptArgs) => {
  const binOnlyOptions = {
    command: String,
    loglevel: String,
    colors: Boolean,
    timing: ['always', Boolean],
    progress: Boolean,
    logfile: String,
    debug: Boolean,
  }

  const allOptions = {
    add: Array,
    rm: Array,
    omit: Array,
    update: Array,
    workspaces: Array,
    global: Boolean,
    force: Boolean,
    'global-style': Boolean,
    'prefer-dedupe': Boolean,
    'legacy-peer-deps': Boolean,
    'update-all': Boolean,
    before: Date,
    path: path,
    cache: path,
    ...binOnlyOptions,
  }

  const short = {
    quiet: ['--loglevel', 'warn'],
    logs: ['--logfile', 'true'],
    w: '--workspaces',
    g: '--global',
    f: '--force',
  }

  const defaults = {
    // key order is important for command and path
    // since they mutate positional args
    // command is 1st, path is 2nd
    command: ({ argv }) => argv.remain.shift(),
    path: ({ argv }) => cleanPath(argv.remain.shift() || '.'),
    colors: has(process.env, 'NO_COLOR') ? false : !!process.stderr.isTTY,
    loglevel: 'silly',
    timing: ({ loglevel }) => loglevel === 'silly',
    cache: `${process.env.HOME}/.npm/_cacache`,
  }

  const derived = [
    // making update either `all` or an array of names but not both
    ({ updateAll: all, update: names, ...options }) => {
      if (all || names) {
        options.update = all != null ? { all } : { names }
      }
      return options
    },
    ({ logfile, ...options }) => {
      // logfile is parsed as a string so if its true or set but empty
      // then set the default logfile
      if (logfile === 'true' || logfile === '') {
        logfile = `arb-log-${new Date().toISOString().replace(/[.:]/g, '_')}.log`
      }
      // then parse it the same as nopt parses other paths
      if (logfile) {
        options.logfile = cleanPath(logfile)
      }
      return options
    },
  ].map((fn) => (options) => fn(options) || options)

  const transforms = [
    // Camelcase all top level keys
    (options) => {
      const keys = Object.keys(options).map((k) => k.replace(/-./g, s => s[1].toUpperCase()))
      return Object.fromEntries(keys.map((k, i) => [k, options[k]]))
    },
    // Set defaults on unset keys
    (options) => {
      for (const [k, v] of Object.entries(defaults)) {
        if (!has(options, k)) {
          options[k] = typeof v === 'function' ? v(options) : v
        }
      }
      return options
    },
    // Set/unset derived values
    ...derived,
    // Separate bin and arborist options
    ({ argv: { remain: _ }, ...options }) => {
      const bin = { _ }
      for (const k of Object.keys(binOnlyOptions)) {
        if (has(options, k)) {
          bin[k] = options[k]
          delete options[k]
        }
      }
      return { bin, arb: options }
    },
  ]

  let options = nopt(allOptions, short, ...noptArgs)
  for (const t of transforms) {
    options = t(options)
  }

  return options
}

module.exports = parse()
