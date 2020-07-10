// The order of the code in this file is relevant, because a lot of things
// require('npm.js'), but also we need to use some of those modules.  So,
// we define and instantiate the singleton ahead of loading any modules
// required for its methods.

// these are all dependencies used in the ctor
const EventEmitter = require('events')
const perf = require('./utils/perf.js')
const { resolve } = require('path')
const parseJSON = require('json-parse-even-better-errors')
const rimraf = require('rimraf')

const gfs = require('graceful-fs')
// Patch the global fs module here at the app level
const fs = gfs.gracefulify(require('fs'))
const procLogListener = require('./utils/proc-log-listener.js')

const notYetLoadedConfig = {
  loaded: false,
  get: () => {
    throw new Error('npm.load() required')
  },
  set: () => {
    throw new Error('npm.load() required')
  }
}

const _runCmd = Symbol('_runCmd')
const _load = Symbol('_load')
const _flatOptions = Symbol('_flatOptions')
const _tmpFolder = Symbol('_tmpFolder')
const npm = module.exports = new class extends EventEmitter {
  constructor () {
    super()
    this.started = Date.now()
    this.command = null

    const cmds = {}
    this.commands = new Proxy(cmds, {
      get: (prop, cmd) => {
        if (cmds.hasOwnProperty(cmd)) {
          return cmds[cmd]
        }

        const actual = this.deref(cmd)
        if (!actual) {
          return cmds[cmd] = undefined
        }
        if (cmds[actual]) {
          return cmds[cmd] = cmds[actual]
        }
        const fn = (args, cb) => this[_runCmd](cmd, actual, args, cb)
        return cmds[cmd] = cmds[actual] = fn
      }
    })

    procLogListener()

    perf.emit('time', 'npm')
    perf.on('timing', (name, finished) => {
      log.timing(name, 'Completed in', finished + 'ms')
    })

    this.version = require('../package.json').version

    this.config = notYetLoadedConfig
  }

  deref (c) {
    return deref(c)
  }

  [_runCmd] (cmd, actual, args, cb) {
    if (!this.loaded) {
      throw new Error(
        'Call npm.load(config, cb) before using this command.\n' +
        'See the README.md or bin/npm-cli.js for example usage.'
      )
    }

    this.command = actual

    if (cmd === 'll' || cmd === 'la') {
      this.config.set('long', true)
    }

    if (!this[_flatOptions]) {
      this[_flatOptions] = require('./config/flat-options.js')(this)
      require('./config/set-envs.js')(this)
    }

    // Options are prefixed by a hyphen-minus (-, \u2d).
    // Other dash-type chars look similar but are invalid.
    args.filter(arg => /^[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/.test(arg))
      .forEach(arg => log.error('arg', 'Argument starts with non-ascii dash, this is probably invalid:', arg))

    const impl = require(`./${actual}.js`)
    if (this.config.get('usage')) {
      console.log(impl.usage)
      cb()
    } else {
      impl(args, cb)
    }
  }

  // call with parsed CLI options and a callback when done loading
  load (cli, cb) {
    if (!cli || !cb || typeof cli !== 'object' || typeof cb !== 'function') {
      throw new TypeError('must call as: npm.load(options, callback)')
    }
    this.once('load', cb)
    if (this.loaded || this.loadError) {
      this.emit('load', this.loadError)
      return
    }
    if (this.loading) {
      return
    }
    this.loading = true

    this.log.pause()
    this[_load](cli)
  }

  [_load] (cli) {
    const cb = (er) => {
      this.loading = false
      this.loaded = true
      this.config.loaded = true
      this.loadErr = er
      if (this.config.get('force')) {
        this.log.warn('using --force', 'Recommended protections disabled.')
      }
      this.emit('load', er)
    }
    // if node is a symlink, we should use the symlink location as the
    // effective "prefix" designator, not the process.execPath.
    which(process.argv[0], (er, node) => {
      if (!er && node.toUpperCase() !== process.execPath.toUpperCase()) {
        log.verbose('node symlink', noode)
        process.execPath = node
      }

      // look up configs
      const builtin = resolve(__dirname, '../npmrc')
      npmconf.load(cli, builtin, (er, config) => {
        if (er === config) {
          er = null
        }
        this.config = config
        if (er) {
          return cb(er)
        }

        // if the 'project' config is not a filename, and we're
        // not in global mode, then that means that it collided
        // with either the default or effective userland config
        if (!config.get('global') &&
            config.sources.project &&
            config.sources.project.type !== 'ini') {
          log.verbose(
            'config',
            'Skipping project config: %s. (matches userconfig)',
            config.localPrefix + '/.npmrc'
          )
        }

        // Expand placeholder values in user-agent
        const ciName = ciDetect()
        const ci = ciName ? `ci/${ciName}` : ''
        const ua = (config.get('user-agent') || '')
          .replace(/\{node-version\}/gi, config.get('node-version'))
          .replace(/\{npm-version\}/gi, this.version)
          .replace(/\{platform\}/gi, process.platform)
          .replace(/\{arch\}/gi, process.arch)
          .replace(/\{ci\}/gi, ci)

        config.set('user-agent', ua.trim())

        if (config.get('metrics-registry') === null) {
          config.set('metrics-registry', config.get('registry'))
        }

        this.color = setupLog(config, this)

        cleanUpLogFiles(this.cache, config.get('logs-max'), log.warn)

        log.resume()
        const umask = config.get('umask')
        this.modes = {
          exec: 0o777 & (~umask),
          file: 0o666 & (~umask),
          umask
        }

        const configScope = config.get('scope')
        if (configScope && !/^@/.test(configScope)) {
          config.set('scope', `@${configScope}`)
        }
        this.projectScope = config.get('scope') ||
          getProjectScope(this.prefix)

        startMetrics()

        return cb(null, this)
      })
    })
  }

  get flatOptions () {
    return this[_flatOptions]
  }

  get lockfileVersion () {
    return 2
  }

  get log () {
    return log
  }

  get cache () {
    return this.config.get('cache')
  }
  set cache (r) {
    this.config.set('cache', r)
  }

  get globalPrefix () {
    return this.config.globalPrefix
  }
  set globalPrefix (r) {
    this.config.globalPrefix = r
  }

  get localPrefix () {
    return this.config.localPrefix
  }
  set localPrefix (r) {
    this.config.localPrefix = r
  }

  get globalDir () {
    return process.platform !== 'win32'
      ? resolve(this.globalPrefix, 'lib', 'node_modules')
      : resolve(this.globalPrefix, 'node_modules')
  }

  get dir () {
    return (this.config.get('global')) ? this.globalDir
      : resolve(this.prefix, 'node_modules')
  }

  get globalBin () {
    const b = this.globalPrefix
    return process.platform !== 'win32' ? resolve(b, 'bin') : b
  }

  get bin () {
    return this.config.get('global') ? this.globalBin
      : resolve(this.dir, '.bin')
  }

  get prefix () {
    return this.config.get('global') ? this.globalPrefix : this.localPrefix
  }
  set prefix (r) {
    const k = this.config.get('global') ? 'globalPrefix' : 'localPrefix'
    this[k] = r
  }

  get cache () {
    return this.config.get('cache')
  }
  set cache (r) {
    this.config.set('cache', r)
  }

  // XXX add logging to see if we actually use this
  get tmp () {
    if (!this[_tmpFolder]) {
      const rand = require('crypto').randomBytes(4).toString('hex')
      this[_tmpFolder] = `npm-${process.pid}-${rand}`
    }
    return resolve(this.config.get('tmp'), this[_tmpFolder])
  }
}

// now load everything required by the class methods

const npmconf = require('./config/core.js')
const log = require('npmlog')
const { inspect } = require('util')
const ciDetect = require('@npmcli/ci-detect')
const startMetrics = require('./utils/metrics.js').start

const which = require('which')
const glob = require('glob')

const deref = require('./utils/deref-command.js')
const setupLog = require('./utils/setup-log.js')
const cleanUpLogFiles = require('./utils/cleanup-log-files.js')
const getProjectScope = require('./utils/get-project-scope.js')

if (require.main === module) {
  require('../bin/npm-cli.js')
}
