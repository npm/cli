const { resolve } = require('path')
const Config = require('@npmcli/config')
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
  static get version () {
    return pkg.version
  }

  static cmd (c) {
    const command = deref(c)
    if (!command) {
      throw Object.assign(new Error(`Unknown command ${c}`), {
        code: 'EUNKNOWNCOMMAND',
      })
    }
    return require(`./commands/${command}.js`)
  }

  updateNotification = null
  loadErr = null

  #argvCommand = null
  #argvArgs = null
  #argvClean = null
  #configBailout = null

  #command = null
  #runId = new Date().toISOString().replace(/[.:]/g, '_')
  #loadPromise = null

  #npmRoot = null
  #warnedNonDashArg = false

  #chalk = null
  #logChalk = null
  #noColorChalk = null

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

  constructor ({ npmRoot, process, localPrefixRoot }) {
    this.#npmRoot = npmRoot
    this.config = new Config({ builtinRoot: npmRoot, process, localPrefixRoot })
    // config has parsed argv and now knows the command name
    // and the remaining args
    this.#argvCommand = this.config.command
    this.#argvArgs = this.config.args
    this.#argvClean = this.config.clean
    this.#configBailout = this.config.bailout
    if (this.#configBailout) {
      this.output(this.#configBailout)
    }
  }

  setCmd (cmd) {
    const Command = Npm.cmd(cmd)
    const command = new Command(this)

    // since 'test', 'start', 'stop', etc. commands re-enter this function
    // to call the run-script command, we need to only set it one time.
    if (!this.#command) {
      this.#command = command
      this.config.set('npm-command', this.command)
    }

    return command
  }

  // Call an npm command
  // TODO: tests are currently the only time the second
  // parameter of args is used. When called via `lib/cli.js` the config is
  // loaded and this.argv is set to the remaining command line args. We should
  // consider testing the CLI the same way it is used and not allow args to be
  // passed in directly.
  async exec (cmd, args = this.#argvArgs) {
    if (this.#configBailout) {
      return
    }

    const command = this.setCmd(cmd)

    const timeEnd = this.time(`command:${cmd}`)

    // this is async but we dont await it, since its ok if it doesnt
    // finish before the command finishes running. it uses command and argv
    // so it must be initiated here, after the command name is set
    // eslint-disable-next-line promise/catch-or-return
    updateNotifier(this).then((msg) => (this.updateNotification = msg))

    // Options are prefixed by a hyphen-minus (-, \u2d).
    // Other dash-type chars look similar but are invalid.
    if (!this.#warnedNonDashArg) {
      const nonDashArgs = args.filter(a => /^[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/.test(a))
      if (nonDashArgs.length) {
        this.#warnedNonDashArg = true
        log.error(
          'arg',
          'Argument starts with non-ascii dash, this is probably invalid:',
          nonDashArgs.join(', ')
        )
      }
    }

    return command.cmdExec(args).finally(timeEnd)
  }

  async load () {
    if (this.#configBailout) {
      return
    }
    if (!this.#loadPromise) {
      this.#loadPromise = this.time('npm:load', () => this.#load().catch((er) => {
        this.loadErr = er
        throw er
      }))
    }
    return this.#loadPromise
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
    await this.time('npm:load:configload', () => this.config.load())

    const { Chalk, supportsColor, supportsColorStderr } = await import('chalk')
    this.#noColorChalk = new Chalk({ level: 0 })
    this.#chalk = this.color ? new Chalk({ level: supportsColor.level })
      : this.#noColorChalk
    this.#logChalk = this.logColor ? new Chalk({ level: supportsColorStderr.level })
      : this.#noColorChalk

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
      chalk: this.logChalk,
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

  get loaded () {
    return this.config.loaded
  }

  get flatOptions () {
    return this.config.flat
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

  get noColorChalk () {
    return this.#noColorChalk
  }

  get chalk () {
    return this.#chalk
  }

  get logChalk () {
    return this.#logChalk
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

  outputError (...msg) {
    log.clearProgress()
    // eslint-disable-next-line no-console
    console.error(...msg)
    log.showProgress()
  }
}
module.exports = Npm
