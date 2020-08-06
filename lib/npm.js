// The order of the code in this file is relevant, because a lot of things
// require('npm.js'), but also we need to use some of those modules.  So,
// we define and instantiate the singleton ahead of loading any modules
// required for its methods.

// these are all dependencies used in the ctor
const EventEmitter = require('events')
const { resolve } = require('path')

// Patch the global fs module here at the app level
require('graceful-fs').gracefulify(require('fs'))

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

const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

// the first time `npm.commands.xyz` is loaded, it gets added
// to the cmds object, so we don't have to load it again.
const proxyCmds = (npm) => {
  const cmds = {}
  return new Proxy(cmds, {
    get: (prop, cmd) => {
      if (hasOwnProperty(cmds, cmd)) {
        return cmds[cmd]
      }

      const actual = deref(cmd)
      if (!actual) {
        cmds[cmd] = undefined
        return cmds[cmd]
      }
      if (cmds[actual]) {
        cmds[cmd] = cmds[actual]
        return cmds[cmd]
      }
      cmds[actual] = makeCmd(actual)
      cmds[cmd] = cmds[actual]
      return cmds[cmd]
    }
  })
}

const makeCmd = cmd => {
  const impl = require(`./${cmd}.js`)
  const fn = (args, cb) => npm[_runCmd](cmd, impl, args, cb)
  Object.assign(fn, impl)
  return fn
}

let warnedNonDashArg = false
const _runCmd = Symbol('_runCmd')
const _load = Symbol('_load')
const _flatOptions = Symbol('_flatOptions')
const _tmpFolder = Symbol('_tmpFolder')
const npm = module.exports = new class extends EventEmitter {
  constructor () {
    super()
    require('./utils/perf.js')
    this.modes = {
      exec: 0o755,
      file: 0o644,
      umask: 0o22
    }
    this.started = Date.now()
    this.command = null
    this.commands = proxyCmds(this)
    procLogListener()
    process.emit('time', 'npm')
    this.version = require('../package.json').version
    this.config = notYetLoadedConfig
    this.loading = false
    this.loaded = false
    this.updateNotification = null
  }

  deref (c) {
    return deref(c)
  }

  // this will only ever be called with cmd set to the canonical command name
  [_runCmd] (cmd, impl, args, cb) {
    if (!this.loaded) {
      throw new Error(
        'Call npm.load(config, cb) before using this command.\n' +
        'See the README.md or bin/npm-cli.js for example usage.'
      )
    }

    process.emit('time', `command:${cmd}`)
    this.command = cmd

    // Options are prefixed by a hyphen-minus (-, \u2d).
    // Other dash-type chars look similar but are invalid.
    if (!warnedNonDashArg) {
      args.filter(arg => /^[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/.test(arg))
        .forEach(arg => {
          warnedNonDashArg = true
          log.error('arg', 'Argument starts with non-ascii dash, this is probably invalid:', arg)
        })
    }

    if (this.config.get('usage')) {
      console.log(impl.usage)
      cb()
    } else {
      impl(args, er => {
        process.emit('timeEnd', `command:${cmd}`)
        cb(er)
      })
    }
  }

  // call with parsed CLI options and a callback when done loading
  load (cli, cb) {
    if (!cli || !cb || typeof cli !== 'object' || typeof cb !== 'function') {
      throw new TypeError('must call as: npm.load(options, callback)')
    }
    this.once('load', cb)
    if (this.loaded || this.loadErr) {
      this.emit('load', this.loadErr)
      return
    }
    if (this.loading) {
      return
    }
    this.loading = true

    process.emit('time', 'npm:load')
    this.log.pause()
    return this[_load](cli).catch(er => er).then((er) => {
      this.loading = false
      this.loaded = true
      this.config.loaded = true
      this.loadErr = er
      if (!er && this.config.get('force')) {
        this.log.warn('using --force', 'Recommended protections disabled.')
      }
      if (!er && !this[_flatOptions]) {
        this[_flatOptions] = require('./config/flat-options.js')(this)
        require('./config/set-envs.js')(this)
      }
      process.emit('timeEnd', 'npm:load')
      this.emit('load', er)
    })
  }

  async [_load] (cli) {
    const node = await which(process.argv[0]).catch(er => null)
    if (node && node.toUpperCase() !== process.execPath.toUpperCase()) {
      log.verbose('node symlink', node)
      process.execPath = node
    }

    const builtin = resolve(__dirname, '../npmrc')
    const config = this.config = await npmconf.load(cli, builtin)

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

    setUserAgent(config)

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

  get localDir () {
    return resolve(this.localPrefix, 'node_modules')
  }

  get dir () {
    return (this.config.get('global')) ? this.globalDir : this.localDir
  }

  get globalBin () {
    const b = this.globalPrefix
    return process.platform !== 'win32' ? resolve(b, 'bin') : b
  }

  get localBin () {
    return resolve(this.dir, '.bin')
  }

  get bin () {
    return this.config.get('global') ? this.globalBin : this.localBin
  }

  get prefix () {
    return this.config.get('global') ? this.globalPrefix : this.localPrefix
  }

  set prefix (r) {
    const k = this.config.get('global') ? 'globalPrefix' : 'localPrefix'
    this[k] = r
  }

  // XXX add logging to see if we actually use this
  get tmp () {
    if (!this[_tmpFolder]) {
      const rand = require('crypto').randomBytes(4).toString('hex')
      this[_tmpFolder] = `npm-${process.pid}-${rand}`
    }
    return resolve(this.config.get('tmp'), this[_tmpFolder])
  }
}()

// now load everything required by the class methods

const npmconf = require('./config/core.js')
const log = require('npmlog')
const { promisify } = require('util')
const startMetrics = require('./utils/metrics.js').start

const which = promisify(require('which'))

const setUserAgent = require('./utils/set-user-agent.js')
const deref = require('./utils/deref-command.js')
const setupLog = require('./utils/setup-log.js')
const cleanUpLogFiles = require('./utils/cleanup-log-files.js')
const getProjectScope = require('./utils/get-project-scope.js')

if (require.main === module) {
  require('./cli.js')(process)
}
