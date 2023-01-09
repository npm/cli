const { resolve } = require('path')
const Config = require('@npmcli/config')
const chalk = require('chalk')
const fs = require('fs/promises')

// Patch the global fs module here at the app level
require('graceful-fs').gracefulify(require('fs'))

const usage = require('./utils/npm-usage.js')
const LogFile = require('./utils/log-file.js')
const Timers = require('./utils/timers.js')
const Display = require('./utils/display.js')
const log = require('./utils/log-shim')
const updateNotifier = require('./utils/update-notifier.js')
const pkg = require('../package.json')
const { deref } = require('./utils/cmd-list.js')

class Npm {
  static version = pkg.version

  static derefCommand (c) {
    const command = deref(c)
    if (!command) {
      throw Object.assign(new Error(`Unknown command ${c}`), {
        code: 'EUNKNOWNCOMMAND',
      })
    }
    return require(`./commands/${command}.js`)
  }

  updateNotification = null

  #argvCommand = null
  #argvArgs = null
  #argvClean = null

  #command = null

  #npmRoot = null
  #runId = new Date().toISOString().replace(/[.:]/g, '_')
  #chalk = null

  #outputBuffer = []
  #logFile = new LogFile()
  #display = new Display()
  #timers = new Timers({
    start: 'npm',
    listener: (name, ms) => {
      const args = ['timing', name, `Completed in ${ms}ms`]
      this.#logFile.log(...args)
      this.#display.log(...args)
    },
  })

  constructor ({ npmRoot, argv, cwdRoot }) {
    this.#npmRoot = npmRoot
    this.config = new Config({ npmRoot, argv, cwdRoot })
    // config has parsed argv and now knows the command name
    // and the remaining args
    this.#argvCommand = this.config.command
    this.#argvArgs = this.config.args
    this.#argvClean = this.config.clean
  }

  get version () {
    return this.constructor.version
  }

  get title () {
    return this.config.title
  }

  get command () {
    return this.#command?.constructor?.name
  }

  get isShellout () {
    return this.#command?.constructor?.isShellout
  }

  get npmRoot () {
    return this.#npmRoot
  }

  get usage () {
    return usage(this)
  }

  // Execute an npm command
  // XXX: tests call this method directly with a supplied
  // command name and args, but the actual cli relies on the config module to
  // parse the argv and then execute the resulting command. So we account for
  // both methods here, but a future refactor should convert tests to run
  // similar to how the CLI does by passing in an argv containing the command
  // and args.
  async exec (commandName = this.#argvCommand, args = this.#argvArgs) {
    // exec can be re-entered by an already running command but if it is the
    // first time we want to kickoff the update notifier
    if (!this.#command) {
      // this is async but we dont await it, since its ok if it doesnt
      // finish before the command finishes running. it uses command and argv
      // so it must be initiated here, after the command name is set
      // eslint-disable-next-line promise/catch-or-return
      updateNotifier(this).then((msg) => (this.updateNotification = msg))
    }

    const Impl = Npm.derefCommand(commandName)
    this.#command = new Impl(this)
    return this.time(`command:${this.command}`, () => this.#command.cmdExec(args))
  }

  get loaded () {
    return this.config.loaded
  }

  async load () {
    return this.time('npm:load', () => this.#load())
  }

  // This gets called at the end of the exit handler and
  // during any tests to cleanup all of our listeners
  // Everything in here should be synchronous
  unload () {
    this.#timers.off()
    this.#display.off()
    this.#logFile.off()
  }

  time (name, fn) {
    return this.#timers.time(name, fn)
  }

  writeTimingFile () {
    this.#timers.writeFile({
      id: this.#runId,
      command: this.#argvClean,
      logfiles: this.logFiles,
      version: this.version,
    })
  }

  async #load () {
    if (this.config.get('version', Config.Locations.cli)) {
      this.output(this.version)
      return
    }

    await this.time('npm:load:configload', () => this.config.load())

    // mkdir this separately since the logs dir can be set to
    // a different location. if this fails, then we don't have
    // a cache dir, but we don't want to fail immediately since
    // the command might not need a cache dir (like `npm --version`)
    await this.time('npm:load:mkdirpcache', () =>
      fs.mkdir(this.cache, { recursive: true })
        .catch((e) => log.verbose('cache', `could not create cache: ${e}`)))

    // its ok if this fails. user might have specified an invalid dir
    // which we will tell them about at the end
    await this.time('npm:load:mkdirplogs', () =>
      fs.mkdir(this.flatOptions.logsDir, { recursive: true })
        .catch((e) => log.verbose('logfile', `could not create logs-dir: ${e}`)))

    this.time('npm:load:display', () => this.#display.load({
      // Use logColor since that is based on stderr
      color: this.logColor,
      progress: this.flatOptions.progress,
      silent: this.silent,
      timing: this.config.get('timing'),
      loglevel: this.config.get('loglevel'),
      unicode: this.config.get('unicode'),
      heading: this.config.get('heading'),
    }))

    this.time('npm:load:logFile', () => this.#logFile.load({
      path: this.logPath,
      logsMax: this.config.get('logs-max'),
    }))

    this.time('npm:load:timers', () => this.#timers.load({
      path: this.config.get('timing') ? this.logPath : null,
    }))

    if (this.config.get('force')) {
      log.warn('using --force', 'Recommended protections disabled.')
    }
  }

  get flatOptions () {
    const { flat } = this.config
    if (this.command) {
      flat.npmCommand = this.commandName
    }
    return flat
  }

  // color and logColor are a special derived values that takes into
  // consideration not only the config, but whether or not we are operating
  // in a tty with the associated output (stdout/stderr)
  get color () {
    return this.flatOptions.color
  }

  get logColor () {
    return this.flatOptions.logColor
  }

  get chalk () {
    if (!this.#chalk) {
      const level = this.color ? chalk.level : 0
      this.#chalk = new chalk.Instance({ level })
    }
    return this.#chalk
  }

  get global () {
    return this.flatOptions.global
  }

  get silent () {
    return this.flatOptions.silent
  }

  get lockfileVersion () {
    return 2
  }

  get timingFile () {
    return this.#timers.file
  }

  get unfinishedTimers () {
    return this.#timers.unfinished
  }

  get finishedTimers () {
    return this.#timers.finished
  }

  get started () {
    return this.#timers.started
  }

  get logFiles () {
    return this.#logFile.files
  }

  get logsDir () {
    return this.flatOptions.logsDir
  }

  get logPath () {
    return resolve(this.logsDir, `${this.#runId}-`)
  }

  get cache () {
    return this.config.get('cache')
  }

  get prefix () {
    return this.global ? this.globalPrefix : this.localPrefix
  }

  get globalPrefix () {
    return this.config.globalPrefix
  }

  get localPrefix () {
    return this.config.localPrefix
  }

  get localPackage () {
    return this.config.localPackage
  }

  get dir () {
    return this.global ? this.globalDir : this.localDir
  }

  get globalDir () {
    return resolve(this.globalPrefix, process.platform !== 'win32' ? 'lib' : '', 'node_modules')
  }

  get localDir () {
    return resolve(this.localPrefix, 'node_modules')
  }

  get bin () {
    return this.global ? this.globalBin : this.localBin
  }

  get globalBin () {
    return resolve(this.globalPrefix, process.platform !== 'win32' ? 'bin' : '')
  }

  get localBin () {
    return resolve(this.dir, '.bin')
  }

  // output to stdout in a progress bar compatible way
  output (...msg) {
    log.clearProgress()
    // eslint-disable-next-line no-console
    console.log(...msg)
    log.showProgress()
  }

  outputError (...msg) {
    log.clearProgress()
    // eslint-disable-next-line no-console
    console.error(...msg)
    log.showProgress()
  }

  outputBuffer (item) {
    this.#outputBuffer.push(item)
  }

  flushOutput (jsonError) {
    if (!jsonError && !this.#outputBuffer.length) {
      return
    }

    if (this.config.get('json')) {
      const jsonOutput = this.#outputBuffer.reduce((acc, item) => {
        if (typeof item === 'string') {
          // try to parse it as json in case its a string
          try {
            item = JSON.parse(item)
          } catch {
            return acc
          }
        }
        return { ...acc, ...item }
      }, {})
      this.output(JSON.stringify({ ...jsonOutput, ...jsonError }, null, 2))
    } else {
      for (const item of this.#outputBuffer) {
        this.output(item)
      }
    }

    this.#outputBuffer.length = 0
  }
}
module.exports = Npm
