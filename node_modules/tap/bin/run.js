#!/usr/bin/env node

// default to no color if requested via standard environment var
if (process.env.NO_COLOR === '1') {
  process.env.TAP_COLORS = '0'
  process.env.FORCE_COLOR = '0'
}

const signalExit = require('signal-exit')
const opener = require('opener')
const node = process.execPath
const fs = require('fs')
const fg = require('foreground-child')
const {spawn, spawnSync} = require('child_process')
const nycBin = require.resolve(
  'nyc/' + require('nyc/package.json').bin.nyc
)
const glob = require('glob')
const isexe = require('isexe')
const yaml = require('tap-yaml')
const path = require('path')
const exists = require('fs-exists-cached').sync
const os = require('os')

const maybeResolve = id => {
  try {
    return require.resolve(id)
  } catch (er) {}
}
const tsNode = maybeResolve('ts-node/register')
const flowNode = maybeResolve('flow-remove-types/register')
const jsx = require.resolve('./jsx.js')

const which = require('which')
const {ProcessDB} = require('istanbul-lib-processinfo')
const rimraf = require('rimraf').sync
const {Repl} = require('../lib/repl.js')


/* istanbul ignore next */
const debug = process.env.TAP_DEBUG === '1'
  || /\btap\b/.test(process.env.NODE_DEBUG) ? (...args) => {
    const {format} = require('util')
    const prefix = `TAP ${process.pid} RUN: `
    const msg = format(...args).trim()
    console.error(prefix + msg.split('\n').join(`\n${prefix}`))
  } : () => {}

const filesFromTest = exports.filesFromTest = (index, testFile) => {
  const set = index.externalIds[testFile]
  return !set ? null
    : Object.keys(index.files).filter(file =>
      index.files[file].includes(set.root) ||
      set.children.some(c => index.files[file].includes(c)))
}

// returns a function that tells whether a given file should be run,
// because one or more of its deps have changed.
const getChangedFilter = exports.getChangedFilter = options => {
  if (!options.changed)
    return () => true

  if (!options.coverage)
    throw new Error('--changed requires coverage to be enabled')

  const indexFile = '.nyc_output/processinfo/index.json'

  if (!fs.existsSync(indexFile))
    return () => true

  const indexDate = fs.statSync(indexFile).mtime
  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'))

  return testFile => {
    if (fs.statSync(testFile).mtime > indexDate)
      return true

    const files = filesFromTest(index, testFile)

    // if not found, probably a test file not run last time, so run it
    if (!files)
      return true

    // if the file is gone, that's a pretty big change.
    return files.some(f => !fs.existsSync(f) || fs.statSync(f).mtime > indexDate)
  }
}

const defaultFiles = options => new Promise((res, rej) => {
  debug('try to get default files')
  const findit = require('findit')
  const good = strToRegExp(options['test-regex'])
  const bad = strToRegExp(options['test-ignore'])
  const fileFilter = f => {
    f = f.replace(/\\/g, '/')
    debug('fileFilter', f)
    const parts = f.split('/')
    const include = good.test(f) &&
      !bad.test(f) &&
      !parts.includes('node_modules') &&
      !parts.includes('tap-snapshots') &&
      !parts.includes('fixtures') &&
      !parts.includes('.git') &&
      !parts.includes('.hg') &&
      !parts.some(p => /^tap-testdir-/.test(p))
    debug('include?', f, include)
    return include
  }

  const addFile = files => f => fileFilter(f) && files.push(f)

  // search in any folder that isn't node_modules, .git, or tap generated
  // these can get pretty huge, so just walking them at all is costly
  const entryFilter =
    /^((node_modules|tap-snapshots|.git|.hg|fixtures)$|tap-testdir-)/
  fs.readdir(process.cwd(), (er, entries) => {
    debug('readdir cwd', er, entries)
    Promise.all(entries.filter(entry => !entryFilter.test(entry))
      .map(entry => new Promise((res, rej) => {
        fs.lstat(entry, (er, stat) => {
          debug('lstat', entry, er, stat)
          // It's pretty unusual to have a file in cwd you can't even stat
          /* istanbul ignore next */
          if (er)
            return rej(er)
          if (stat.isFile())
            return res(fileFilter(entry) ? [entry] : [])
          if (!stat.isDirectory())
            return res([])
          const finder = findit(entry)
          const files = []
          finder.on('file', addFile(files))
          finder.on('end', () => res(files))
          finder.on('error', /* istanbul ignore next */ er => rej(er))
        })
      }))).then(a => res(a.reduce((a, i) => a.concat(i), []))).catch(rej)
  })
})

const main = options =>
  mainAsync(options).catch(er => onError(er))

const mainAsync = async options => {
  debug('main', options)

  if (require.main !== module)
    return debug('not main module, do not run tests')

  const rc = parseRcFile(options.rcfile)
  debug('rc options', rc)
  options._.update(rc)

  const pj = parsePackageJson()
  debug('package.json options', pj)
  options._.update(pj)

  if (options.files.length && !options._.length)
    options._.push(...options.files)

  // tell chalk if we want color or not.
  if (!options.color) {
    process.env.NO_COLOR = '1'
    delete process.env.FORCE_COLOR
  } else {
    delete process.env.NO_COLOR
    process.env.FORCE_COLOR = '3'
  }

  if (options.reporter === null)
    options.reporter = options.color ? 'base' : 'tap'

  if (options['dump-config']) {
    console.log(yaml.stringify(Object.keys(options).filter(k =>
      k !== 'dump-config' && k !== '_' && !/^[A-Z_]+$/.test(k)
    ).sort().reduce((set, k) =>
      (set[k] = options[k], set), {})))
    return
  }

  if (options.versions) {
    const {libtap, tapParser, tapYaml, tcompare} = require('libtap/versions')
    return console.log(yaml.stringify({
      tap: require('../package.json').version,
      libtap,
      'tap-parser': tapParser,
      nyc: require('nyc/package.json').version,
      'tap-yaml': tapYaml,
      treport: require('treport/package.json').version,
      tcompare
    }))
  }

  if (options.version)
    return console.log(require('../package.json').version)

  if (options['parser-version'])
    return console.log(require('libtap/versions').tapParser)

  if (options['nyc-version'])
    return console.log(require('nyc/package.json').version)

  if (options['nyc-help'])
    return nycHelp()

  process.stdout.on('error', er => {
    /* istanbul ignore else */
    if (er.code === 'EPIPE')
      process.exit()
    else
      throw er
  })

  if (options['libtap-settings'])
    process.env.TAP_LIBTAP_SETTINGS = path.resolve(options['libtap-settings'])

  require('../settings.js')

  // we test this directly, not from here.
  /* istanbul ignore next */
  if (options.watch)
    return new Repl(options, process.stdin, process.stdout)

  options.grep = options.grep.map(strToRegExp)

  // this is only testable by escaping from the covered environment
  /* istanbul ignore next */
  if (fs.existsSync('.nyc_output') &&
      options._.length === 0 &&
      (options['coverage-report'] &&
        options._.explicit.has('coverage-report') ||
      options['check-coverage'] &&
        options._.explicit.has('check-coverage')))
    return runCoverageReportOnly(options)

  try {
    debug('try to get default files?', options._.length === 0)
    if (options._.length === 0)
      options._.push.apply(options._, await defaultFiles(options))
    debug('added default files', options._)
  } /* istanbul ignore next */ catch (er) /* istanbul ignore next */ {
    // This gets tested on Mac, but not Linux/travis, and is
    // somewhat challenging to do in a cross-platform way.
    /* istanbul ignore next */
    return require('../lib/tap.js').threw(er)
  }

  options.files = globFiles(options._)
  debug('after globbing', options.files)

  if (options['output-dir'] !== null)
    require('../settings.js').mkdirRecursiveSync(options['output-dir'])

  if (options.files.length === 1 && options.files[0] === '-') {
    debug('do stdin only')
    setupTapEnv(options)
    stdinOnly(options)
    return
  }

  options.saved = readSaveFile(options)
  options.changedFilter = getChangedFilter(options)

  /* istanbul ignore next */
  if (options.coverage && !process.env.NYC_CONFIG)
    respawnWithCoverage(options)
  else {
    setupTapEnv(options)
    runTests(options)
  }
}

/* istanbul ignore next */
const nycReporter = options =>
  options['coverage-report'] === false ? ['--silent']
  : options['coverage-report'].map(cr =>
    cr === 'html' ? '--reporter=lcov' : `--reporter=${cr}`)

const defaultNycExcludes = [
  'coverage/**',
  'packages/*/test/**',
  'test/**',
  'test{,-*}.js',
  '**/*{.,-}test.js',
  '**/__tests__/**',
  '**/{ava,babel,jest,nyc,rollup,webpack}.config.js',
]

/* istanbul ignore next */
const runNyc = (cmd, programArgs, options, spawnOpts) => {
  const reporter = nycReporter(options)

  // note: these are forced to be numeric in the option parsing phase
  const branches = Math.min(options.branches, 100)
  const lines = Math.min(options.lines, 100)
  const functions = Math.min(options.functions, 100)
  const statements = Math.min(options.statements, 100)
  const excludes = defaultNycExcludes.concat(options.files).map(f =>
    '--exclude=' + f)
  if (options.before)
    excludes.push('--exclude=' + options.before)
  if (options.after)
    excludes.push('--exclude=' + options.after)

  const args = [
    nycBin,
    ...cmd,
    ...(options['show-process-tree'] ? ['--show-process-tree'] : []),
    ...excludes,
    '--produce-source-map',
    '--cache=true',
    '--branches=' + branches,
    '--watermarks.branches=' + branches,
    '--watermarks.branches=' + (branches + (100 - branches)/2),
    '--functions=' + functions,
    '--watermarks.functions=' + functions,
    '--watermarks.functions=' + (functions + (100 - functions)/2),
    '--lines=' + lines,
    '--watermarks.lines=' + lines,
    '--watermarks.lines=' + (lines + (100 - lines)/2),
    '--statements=' + statements,
    '--watermarks.statements=' + statements,
    '--watermarks.statements=' + (statements + (100 - statements)/2),
    ...reporter,
    '--extension=.js',
    '--extension=.jsx',
    '--extension=.mjs',
    '--extension=.cjs',
    '--extension=.ts',
    '--extension=.tsx',
    ...(options['nyc-arg'] || []),
  ]
  if (options['check-coverage'])
    args.push('--check-coverage')

  args.push.apply(args, programArgs)

  if (spawnOpts)
    return fg(node, args, spawnOpts)

  // fake it
  process.argv = [
    node,
    ...args,
  ]
  require(nycBin)

  if (reporter.includes('--reporter=lcov') && options.browser)
    process.on('exit', () => openHtmlCoverageReport(options))
}

/* istanbul ignore next */
const runCoverageReportOnly = options => {
  runNyc(['report'], [], options)
  if (process.env.COVERALLS_REPO_TOKEN ||
      process.env.__TAP_COVERALLS_TEST__) {
    pipeToCoveralls()
  }
}

/* istanbul ignore next */
const pipeToCoveralls = async options => {
  const reporter = spawn(node, [nycBin, 'report', '--reporter=text-lcov'], {
    stdio: [ 0, 'pipe', 2 ]
  })

  const bin = process.env.__TAP_COVERALLS_TEST__
    || require.resolve('coveralls/bin/coveralls.js')

  const ca = spawn(node, [bin], { stdio: ['pipe', 1, 2] })
  reporter.stdout.pipe(ca.stdin)
  await new Promise(resolve => ca.on('close', resolve))
}

/* istanbul ignore next */
const respawnWithCoverage = options => {
  debug('respawn with coverage')
  // If we have a coverage map, then include nothing by default here.
  runNyc(options['coverage-map'] ? [
    '--include=',
    '--no-exclude-after-remap',
    ...(options.saved || options.changed ? ['--no-clean'] : []),
  ] : [], [
    '--',
    node,
    ...process.execArgv,
    ...process.argv.slice(1)
  ], options)
}

/* istanbul ignore next */
const openHtmlCoverageReport = (options, code, signal) => {
  opener('coverage/lcov-report/index.html')
  if (signal) {
    setTimeout(() => {}, 200)
    process.kill(process.pid, signal)
  } else if (code) {
    process.exitCode = code
  }
}

const nycHelp = _ => fg(node, [nycBin, '--help'])

// export for easier testing
const setupTapEnv = exports.setupTapEnv = options => {
  process.env.TAP_TIMEOUT = options.timeout
  if (options.color)
    process.env.TAP_COLORS = '1'
  else
    process.env.TAP_COLORS = '0'

  if (options.snapshot)
    process.env.TAP_SNAPSHOT = '1'

  if (options.bail)
    process.env.TAP_BAIL = '1'

  if (options['save-fixture'])
    process.env.TAP_SAVE_FIXTURE = '1'

  if (options.invert)
    process.env.TAP_GREP_INVERT = '1'

  if (options.grep.length)
    process.env.TAP_GREP = options.grep.map(p => p.toString())
      .join('\n')

  if (options.only)
    process.env.TAP_ONLY = '1'
}

const globFiles = files => Array.from(files.reduce((acc, f) =>
  acc.concat(f === '-' ? f : glob.sync(f, { nonull: true })), [])
  .reduce((set, f) => {
    set.add(f)
    return set
  }, new Set()))

const makeReporter = exports.makeReporter = (tap, options) => {
  const treportTypes = require('treport/types')
  const tapMochaReporter = require('tap-mocha-reporter')
  // if it's a treport type, use that
  const reporter = options.reporter
  if (reporter === 'tap')
    tap.pipe(process.stdout)
  else if (treportTypes.includes(reporter))
    require('treport')(tap, reporter)
  else if (tapMochaReporter.types.includes(reporter))
    tap.pipe(new tapMochaReporter(options.reporter))
  else {
    // might be a child process or a module
    try {
      which.sync(reporter)
      // it's a cli reporter!
      const c = spawn(reporter, options['reporter-arg'], {
        stdio: ['pipe', 1, 2]
      })
      tap.pipe(c.stdin)
    } catch (_) {
      // resolve to cwd if it's a relative path
      const rmod = /^\.\.?[\\\/]/.test(reporter) ? path.resolve(reporter) : reporter
      // it'll often be jsx, and this is harmless if it isn't.
      const R = require('import-jsx')(rmod)
      if (typeof R !== 'function' || !R.prototype)
        throw new Error(
          `Invalid reporter: non-class exported by ${reporter}`)
      else if (R.prototype.isReactComponent)
        require('treport')(tap, R)
      else if (R.prototype.write && R.prototype.end)
        tap.pipe(new R(...(options['reporter-arg'])))
      else
        throw new Error(
          `Invalid reporter: not a stream or react component ${reporter}`)
    }
  }
}

const stdinOnly = options => {
  // if we didn't specify any files, then just passthrough
  // to the reporter, so we don't get '/dev/stdin' in the suite list.
  // We have to pause() before piping to switch streams2 into old-mode
  const tap = require('../lib/tap.js')
  tap.writeSnapshot = false
  tap.stdinOnly()
  makeReporter(tap, options)

  if (options['output-file'] !== null)
    process.stdin.pipe(fs.createWriteStream(options['output-file']))
  if (options['output-dir'] !== null)
    process.stdin.pipe(fs.createWriteStream(options['output-dir'] +
      '/stdin.tap'))
  process.stdin.resume()
}

const readSaveFile = options => {
  if (options.save)
    try {
      const s = fs.readFileSync(options.save, 'utf8').trim()
      if (s)
        return s.split('\n')
    } catch (er) {}

  return null
}

const saveFails = (options, tap) => {
  if (!options.save)
    return

  let fails = []
  const successes = []
  tap.on('result', res => {
    // we will continue to re-run todo tests, even though they're
    // not technically "failures".
    if (!res.ok && !res.extra.skip)
      fails.push(res.extra.file)
    else
      successes.push(res.extra.file)
  })

  const save = () => {
    fails = fails.reduce((set, f) => {
      f = f.replace(/\\/g, '/')
      if (set.indexOf(f) === -1)
        set.push(f)
      return set
    }, [])

    if (!fails.length)
      rimraf(options.save)
    else
      try {
        fs.writeFileSync(options.save, fails.join('\n') + '\n')
      } catch (er) {}
  }

  tap.on('bailout', reason => {
    // add any pending test files to the fails list.
    fails.push.apply(fails, options.files.filter(file =>
      successes.indexOf(file) === -1))
    save()
  })

  tap.on('end', save)
}

const filesMatch = (a, b) =>
  a && b && path.resolve(a) === path.resolve(b)

const filterFiles = exports.filterFiles = (files, options, parallelOk) =>
  files.filter(file =>
    path.basename(file) === 'tap-parallel-ok' ?
      ((parallelOk[path.resolve(path.dirname(file))] = true), false)
    : path.basename(file) === 'tap-parallel-not-ok' ?
      parallelOk[path.resolve(path.dirname(file))] = false
    // don't include the --before and --after scripts as files,
    // so they're not run as tests if they would be found normally.
    // This allows test/setup.js and test/teardown.js for example.
    : filesMatch(file, options.before) ? false
    : filesMatch(file, options.after) ? false
    : options.saved && options.saved.length ? onSavedList(options.saved, file)
    : options.changed ? options.changedFilter(file)
    : true
  )

// check if the file is on the list, or if it's a parent dir of
// any items that are on the list.
const onSavedList = (saved, file) =>
  saved.indexOf(file) !== -1 ? true
  : saved.some(f => f.indexOf(file + '/') === 0)

const isParallelOk = (parallelOk, file) => {
  const dir = path.resolve(path.dirname(file))
  return (dir in parallelOk) ? parallelOk[dir]
    : exists(dir + '/tap-parallel-ok')
    ? parallelOk[dir] = true
    : exists(dir + '/tap-parallel-not-ok')
    ? parallelOk[dir] = false
    : dir.length >= process.cwd().length
    ? isParallelOk(parallelOk, dir)
    : true
}

const getEnv = options => options['test-env'].reduce((env, kv) => {
  const split = kv.split('=')
  const key = split.shift()
  if (!split.length)
    delete env[key]
  else
    env[key] = split.join('=')
  return env
}, {...process.env})

// the test that checks this escapes from NYC, so it'll never show up
/* istanbul ignore next */
const coverageMapOverride = (env, file, coverageMap) => {
  if (coverageMap) {
    /* istanbul ignore next */
    env.NYC_CONFIG_OVERRIDE = JSON.stringify({
      include: coverageMap(file) || ''
    })
  }
}

const runAllFiles = (options, env, tap, processDB) => {
  debug('run all files')
  let doStdin = false
  let parallelOk = Object.create(null)

  if (options['output-dir'] !== null) {
    tap.on('spawn', t => {
      const dir = options['output-dir'] + '/' + path.dirname(t.name)
      require('../settings.js').mkdirRecursiveSync(dir)
      const file = dir + '/' + path.basename(t.name) + '.tap'
      t.proc.stdout.pipe(fs.createWriteStream(file))
    })
    tap.on('stdin', t => {
      const file = options['output-dir'] + '/stdin.tap'
      t.stream.pipe(fs.createWriteStream(file))
    })
  }

  options.files = filterFiles(options.files, options, parallelOk)

  if (options.files.length === 0 && !doStdin && !options.changed) {
    tap.fail('no tests specified')
  }

  /* istanbul ignore next */
  const coverageMap = options['coverage-map']
    ? require(path.resolve(options['coverage-map']))
    : null

  const seen = new Set()
  for (let i = 0; i < options.files.length; i++) {
    const file = options.files[i]
    if (seen.has(file))
      continue

    debug('run file', file)
    seen.add(file)

    // Pick up stdin after all the other files are handled.
    if (file === '-') {
      doStdin = true
      continue
    }

    let st
    try {
      st = fs.statSync(file)
    } catch (er) {
      tap.test(file, t => t.threw(er))
      continue
    }

    if (st.isDirectory()) {
      debug('is a directory', file)
      const dir = filterFiles(fs.readdirSync(file).map(f =>
        file.replace(/[\/\\]+$/, '') + '/' + f), options, parallelOk)
      options.files.splice(i, 1, ...dir)
      i--
    } else {
      const opt = { env, file, processDB }

      coverageMapOverride(env, file, coverageMap)

      if (options.timeout)
        opt.timeout = options.timeout * 1000

      if (options.jobs > 1)
        opt.buffered = isParallelOk(parallelOk, file) !== false

      if (options.flow && flowNode)
        options['node-arg'].push('-r', flowNode)

      if (options.ts && tsNode && /\.tsx?$/.test(file)) {
        debug('typescript file', file)
        const compilerOpts = JSON.parse(env.TS_NODE_COMPILER_OPTIONS || '{}')
        if (options.jsx)
          compilerOpts.jsx = 'react'

        opt.env = {
          ...env,
          TS_NODE_COMPILER_OPTIONS: JSON.stringify(compilerOpts),
        }
        const args = [
          '-r', tsNode,
          ...options['node-arg'],
          file,
          ...options['test-arg']
        ]
        tap.spawn(node, args, opt, file)
      } else if (options.jsx && /\.jsx$/.test(file)) {
        debug('jsx file', file)
        const args = [
          ...(options['node-arg']),
          jsx,
          file,
          ...(options['test-arg']),
        ]
        tap.spawn(node, args, opt, file)
      } else if (/\.jsx$|\.tsx?$|\.[mc]?js$/.test(file)) {
        debug('js file', file)
        /* istanbul ignore next - version specific behavior */
        const experimental = /^v10\./.test(process.version) && /\.mjs$/.test(file)
          ? ['--experimental-modules'] : []

        const args = [
          ...options['node-arg'],
          ...experimental,
          file,
          ...options['test-arg']
        ]
        tap.spawn(node, args, opt, file)
      } else if (/\.tap$/.test(file)) {
        debug('tap file', file)
        tap.spawn('cat', [file], opt, file)
      } else if (isexe.sync(options.files[i])) {
        debug('executable', file)
        tap.spawn(options.files[i], options['test-arg'], opt, file)
      } else {
        debug('not a test file', file)
      }
    }
  }

  if (doStdin)
    tap.stdin()

  debug('scheduled all files for execution')
}

const runTests = options => {
  debug('run tests')
  // At this point, we know we need to use the tap root,
  // because there are 1 or more files to spawn.
  const tap = require('../lib/tap.js')
  tap.writeSnapshot = false
  if (options.comments) {
    const onComment = c => {
      if (!c.match(/^# (timeout=[0-9]+|time=[0-9\.]+m?s|Subtest(: .+)?)\n$/))
        console.error(c.substr(2).trim())
    }
    const onChild = p => {
      p.on('comment', onComment)
      p.on('child', onChild)
    }
    tap.parser.on('comment', onComment)
    tap.parser.on('child', onChild)
  }

  tap.runOnly = false

  // greps are passed to children, but not the runner itself
  tap.grep = []
  tap.jobs = options.jobs

  const env = getEnv(options)

  /* istanbul ignore next */
  const processDB = options.coverage && process.env.NYC_CONFIG
    ? new ProcessDB() : null

  // run --before before everything, and --after as the very last thing
  runBeforeAfter(options, env, tap, processDB)

  tap.patchProcess()

  // if not -Rtap, then output what the user wants.
  // otherwise just dump to stdout
  /* istanbul ignore next */
  makeReporter(tap, options)

  // need to replay the first version line, because the previous
  // line will have flushed it out to stdout or the reporter already.
  if (options['output-file'] !== null)
    tap.pipe(fs.createWriteStream(options['output-file'])).write('TAP version 13\n')

  saveFails(options, tap)

  runAllFiles(options, env, tap, processDB)

  /* istanbul ignore next */
  if (process.env.COVERALLS_REPO_TOKEN ||
      process.env.__TAP_COVERALLS_TEST__) {
    tap.teardown(() => pipeToCoveralls())
  }

  tap.end()
  debug('called tap.end()')
}

const beforeAfter = (env, script) => {
  const {status, signal} = spawnSync(process.execPath, [script], {
    env,
    stdio: 'inherit',
  })

  if (status || signal) {
    const msg = `\n# failed ${script}\n# code=${status} signal=${signal}\n`
    console.error(msg)
    process.exitCode = status || 1
    process.exit(status || 1)
  }
}

const runBeforeAfter = (options, env, tap, processDB) => {
  // Have to write the index before running a script so that this
  // process is included in the DB, or else it'll crash when it
  // tries to get the parent info.
  /* istanbul ignore next */
  if (processDB && (options.before || options.after))
    processDB.writeIndex()

  if (options.before)
    beforeAfter(env, options.before)

  if (options.after) {
    /* istanbul ignore next - run after istanbul's report */
    signalExit(() => beforeAfter(env, options.after), { alwaysLast: true })
  }
}

const parsePackageJson = () => {
  try {
    return JSON.parse(fs.readFileSync('package.json', 'utf8')).tap || {}
  } catch (er) {
    return {}
  }
}

const parseRcFile = path => {
  let contents
  try {
    contents = fs.readFileSync(path, 'utf8')
  } catch (_) {
    try {
      contents = fs.readFileSync(path + '.yaml', 'utf8')
    } catch (_) {
      try {
        contents = fs.readFileSync(path + '.yml', 'utf8')
      } catch (_) {}
    }
  }
  if (!contents) {
    // if no dotfile exists, just return an empty object
    return {}
  }
  return yaml.parse(contents)
}

const strToRegExp = g => {
  const p = g.match(/^\/(.*)\/([a-z]*)$/)
  g = p ? p[1] : g
  const flags = p ? p[2] : ''
  return new RegExp(g, flags)
}

const onError = er => {
  /* istanbul ignore else - parse errors are the only ones we ever expect */
  if (er.name.match(/^AssertionError/) && !er.generatedMessage) {
    console.error('Error: ' + er.message)
    console.error('Run `tap --help` for usage information')
    process.exit(1)
  } else {
    console.error(er)
    process.exit(1)
  }
}

try {
  require('./jack.js')(main)
} catch (er) {
  onError(er)
}
