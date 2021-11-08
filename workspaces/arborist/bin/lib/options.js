const nopt = require('nopt')
const path = require('path')
const npmlog = require('npmlog')

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const cleanPath = (val) => {
  const k = Symbol('key')
  const data = {}
  nopt.typeDefs.path.validate(data, k, val)
  return data[k]
}

const parse = (...noptArgs) => {
  const knownBin = {
    command: String,
    loglevel: String,
    colors: Boolean,
    timing: ['always', Boolean],
    progress: Boolean,
    logfile: String,
    debug: Boolean,
  }

  const known = {
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
    ...knownBin,
  }

  const short = {
    quiet: ['--loglevel', 'warn'],
    logs: ['--logfile', 'true'],
    w: '--workspaces',
    g: '--global',
    f: '--force',
  }

  const def = {
    // key order is important for command and path
    // since they shift positional args
    // command is 1st, path is 2nd
    command: (o) => o.argv.remain.shift(),
    path: (o) => cleanPath(o.argv.remain.shift() || '.'),
    colors: has(process.env, 'NO_COLOR') ? false : !!process.stderr.isTTY,
    loglevel: 'silly',
    timing: (o) => o.loglevel === 'silly',
    cache: `${process.env.HOME}/.npm/_cacache`,
  }

  const derived = [
    // making update either `all` or an array of names but not both
    ({ updateAll: all, update: names, ...o }) => {
      if (all || names) {
        o.update = all != null ? { all } : { names }
      }
      return o
    },
    ({ logfile, ...o }) => {
      // logfile is parsed as a string so if its true or set but empty
      // then set the default logfile
      if (logfile === 'true' || logfile === '') {
        logfile = `arb-log-${new Date().toISOString().replace(/[.:]/g, '_')}.log`
      }
      // then parse it the same as nopt parses other paths
      if (logfile) {
        o.logfile = cleanPath(logfile)
      }
      return o
    },
  ]

  const transforms = [
    // Camelcase all top level keys
    (o) => {
      const entries = Object.entries(o).map(([k, v]) => [
        k.replace(/-./g, s => s[1].toUpperCase()),
        v,
      ])
      return Object.fromEntries(entries)
    },
    // Set defaults on unset keys
    (o) => {
      for (const [k, v] of Object.entries(def)) {
        if (!has(o, k)) {
          o[k] = typeof v === 'function' ? v(o) : v
        }
      }
      return o
    },
    // Set/unset derived values
    ...derived.map((derive) => (o) => derive(o) || o),
    // Separate bin and arborist options
    ({ argv: { remain: _ }, ...o }) => {
      const bin = { _ }
      for (const k of Object.keys(knownBin)) {
        if (has(o, k)) {
          bin[k] = o[k]
          delete o[k]
        }
      }
      return { bin, arb: o }
    },
  ]

  let options = nopt(known, short, ...noptArgs)
  for (const t of transforms) {
    options = t(options)
  }

  options.arb.log = npmlog
  npmlog.level = 'silent'
  npmlog.disableProgress()

  return options
}

module.exports = parse()

// ;[
//   ['reify', 'a/path', '-w=a', '-w', 'b', '--woo', '--', 'query'],
//   ['-w=a', '-w', 'b', '--woo', '--', 'reify', 'xxxx', 'query'],
//   ['reify', '-w=a', '-w', 'b', '--aaa', 'false'],
//   ['reify', '--update-all', '-w', 'b', '--aaa', 'false'],
//   ['reify', '--update=woo', '-w', 'b', '--aaa', 'false'],
//   ['reify', '--update-all', '--update=woo', '-w', 'b', '--aaa', 'false'],
//   ['--update-all', '--update=woo', '-w', 'b', '--aaa', 'false', '--command=rrr', '--path=woo', '--quiet'],
// ].forEach((c) => console.log(parse(c, 0)))
