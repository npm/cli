const { resolve, dirname, join } = require('node:path')
const Config = require('@npmcli/config')
const which = require('which')
const fs = require('node:fs/promises')
const { definitions, flatten, shorthands } = require('@npmcli/config/lib/definitions')
const usage = require('./utils/npm-usage.js')
const LogFile = require('./utils/log-file.js')
const Timers = require('./utils/timers.js')
const Display = require('./utils/display.js')
const { log, time, output, META } = require('proc-log')
const { redactLog: replaceInfo } = require('@npmcli/redact')
const pkg = require('../package.json')
const { deref } = require('./utils/cmd-list.js')

class Npm {
  static get version () {
    return pkg.version
  }

  get version () {
    return this.constructor.version
  }

  static cmd (c) {
    const command = deref(c)
    if (!command) {
      throw Object.assign(new Error(`Unknown command ${c}`), {
        code: 'EUNKNOWNCOMMAND',
        command: c,
      })
    }
    return require(`./commands/${command}.js`)
  }

  updateNotification = null
  argv = []
  unrefPromises = []

  #command = null
  #runId = new Date().toISOString().replace(/[.:]/g, '_')
  #title = 'npm'
  #argvClean = []
  #npmRoot = null

  #chalk = null
  #logChalk = null
  #noColorChalk = null

  #display = null
  #logFile = new LogFile()
  #timers = new Timers()

  // all these options are only used by tests in order to make testing more
  // closely resemble real world usage. for now, npm has no programmatic API so
  // it is ok to add stuff here, but we should not rely on it more than
  // necessary. XXX: make these options not necessary by refactoring @npmcli/config
  //   - npmRoot: this is where npm looks for docs files and the builtin config
  //   - argv: this allows tests to extend argv in the same way the argv would
  //     be passed in via a CLI arg.
  //   - excludeNpmCwd: this is a hack to get @npmcli/config to stop walking up
  //     dirs to set a local prefix when it encounters the `npmRoot`. this
  //     allows tests created by tap inside this repo to not set the local
  //     prefix to `npmRoot` since that is the first dir it would encounter when
  //     doing implicit detection
  constructor ({
    stdout = process.stdout,
    stderr = process.stderr,
    npmRoot = dirname(__dirname),
    argv = [],
    excludeNpmCwd = false,
  } = {}) {
    this.#display = new Display({ stdout, stderr })
    this.#npmRoot = npmRoot
    this.config = new Config({
      npmPath: this.#npmRoot,
      definitions,
      flatten,
      shorthands,
      argv: [...process.argv, ...argv],
      excludeNpmCwd,
    })
  }

  async load () {
    const timeEnd = time.start('npm:load')
    try {
      const skip = await this.#load()
      const cmd = this.argv.shift()
      return {
        skip,
        command: cmd,
        args: this.argv,
      }
    } catch (er) {
      throw Object.assign(er, await this.#handleError(er))
    } finally {
      timeEnd()
    }
  }

  async #load () {
    await time.start('npm:load:whichnode', async () => {
      // TODO should we throw here?
      const node = await which(process.argv[0]).catch(() => {})
      if (node && node.toUpperCase() !== process.execPath.toUpperCase()) {
        log.verbose('node symlink', node)
        process.execPath = node
        this.config.execPath = node
      }
    })

    await time.start('npm:load:configload', () => this.config.load())

    process.env.COLOR = this.color ? '1' : '0'
    await this.#display.load({
      loglevel: this.config.get('loglevel'),
      // TODO: only pass in logColor and color and create chalk instances
      // in display load method. Then remove chalk getters from npm and
      // producers should emit chalk-templates (or something else).
      stdoutColor: this.color,
      stderrColor: this.logColor,
      timing: this.config.get('timing'),
      unicode: this.config.get('unicode'),
      progress: this.flatOptions.progress,
      json: this.config.get('json'),
      heading: this.config.get('heading'),
    })

    // npm -v
    // do this as early as possible after setting up display so we can
    // skip logfiles, cache, etc if all we are doing is printing the version
    if (this.config.get('version', 'cli')) {
      output.standard(this.version)
      return true
    }

    // mkdir this separately since the logs dir can be set to
    // a different location. if this fails, then we don't have
    // a cache dir, but we don't want to fail immediately since
    // the command might not need a cache dir (like `npm --version`)
    await time.start('npm:load:mkdirpcache', () =>
      fs.mkdir(this.cache, { recursive: true })
        .catch((e) => log.verbose('cache', `could not create cache: ${e}`)))

    // it's ok if this fails. user might have specified an invalid dir
    // which we will tell them about at the end
    if (this.config.get('logs-max') > 0) {
      await time.start('npm:load:mkdirplogs', () =>
        fs.mkdir(this.#logsDir, { recursive: true })
          .catch((e) => log.verbose('logfile', `could not create logs-dir: ${e}`)))
    }

    // note: this MUST be shorter than the actual argv length, because it
    // uses the same memory, so node will truncate it if it's too long.
    time.start('npm:load:setTitle', () => {
      const { parsedArgv: { cooked, remain } } = this.config
      this.argv = remain
      // Secrets are mostly in configs, so title is set using only the positional args
      // to keep those from being leaked.
      this.title = ['npm'].concat(replaceInfo(remain)).join(' ').trim()
      // The cooked argv is also logged separately for debugging purposes. It is
      // cleaned as a best effort by replacing known secrets like basic auth
      // password and strings that look like npm tokens. XXX: for this to be
      // safer the config should create a sanitized version of the argv as it
      // has the full context of what each option contains.
      this.#argvClean = replaceInfo(cooked)
      log.verbose('title', this.title)
      log.verbose('argv', this.#argvClean.map(JSON.stringify).join(' '))
    })

    // Not awaited but returned so tests can await it
    this.unrefPromises.push(this.#logFile.load({
      path: this.logPath,
      logsMax: this.config.get('logs-max'),
    }))

    this.#timers.load({
      path: this.logPath,
      timing: this.config.get('timing'),
    })

    const configScope = this.config.get('scope')
    if (configScope && !/^@/.test(configScope)) {
      this.config.set('scope', `@${configScope}`, this.config.find('scope'))
    }

    if (this.config.get('force')) {
      log.warn('using --force', 'Recommended protections disabled.')
    }

    // npm --versions
    if (this.config.get('versions', 'cli')) {
      this.argv = ['version']
      this.config.set('usage', false, 'cli')
    }
  }

  async exec (cmd, args = this.argv) {
    if (!cmd) {
      output.standard(this.usage)
      process.exitCode = 1
      return
    }

    if (!this.#command) {
      return this.#cmdExecInitial(cmd, args)
    } else {
      return this.#cmdExec(cmd, args)
    }
  }

  async #cmdExecInitial (cmd, args) {
    let err
    try {
      await this.#cmdExec(cmd, args)
    } catch (er) {
      err = Object.assign(er, await this.#handleError(er))
    }

    // Finish all our timer work, this will write the file if requested, end timers, etc
    this.finishTimers()

    if (err && this.loaded && this.config.get('json')) {
      output.flush({
        [META]: true,
        jsonError: {
          code: err.code,
          summary: (err.summary || []).map(l => l.slice(1).join(' ')).join('\n'),
          detail: (err.detail || []).map(l => l.slice(1).join(' ')).join('\n'),
        },
      })
    }

    if (err) {
      throw err
    }
  }

  setCmd (cmd) {
    const Command = Npm.cmd(cmd)
    const command = new Command(this)

    // since 'test', 'start', 'stop', etc. commands re-enter this function
    // to call the run-script command, we need to only set it one time.
    if (!this.#command) {
      this.#command = command
      process.env.npm_command = this.command
    }

    return command
  }

  // Call an npm command
  async #cmdExec (cmd, args) {
    const command = this.setCmd(cmd)
    return time.start(`command:${cmd}`, () => command.cmdExec(args))
  }

  async #handleError (err) {
    // if we got a command that just shells out to something else, then it
    // will presumably print its own errors and exit with a proper status
    // code if there's a problem.  If we got an error with a code=0, then...
    // something else went wrong along the way, so maybe an npm problem?
    if (this.isShellout && typeof err.code === 'number' && err.code) {
      return {
        exitCode: err.code,
        suppressError: true,
      }
    }

    // XXX: we should stop throwing strings
    if (typeof err === 'string') {
      log.error('', err)
      return {
        exitCode: 1,
        suppressError: true,
      }
    }

    // XXX: we should stop throwing other non-errors
    if (!(err instanceof Error)) {
      log.error('weird error', err)
      return {
        exitCode: 1,
        suppressError: true,
      }
    }

    if (err.code === 'EUNKNOWNCOMMAND') {
      const didYouMean = require('./utils/did-you-mean.js')
      const suggestions = await didYouMean(this.localPrefix, err.command)
      output.standard(`Unknown command: "${err.command}"\n\n${suggestions}\n`)
      output.standard('To see a list of supported npm commands, run:\n  npm help')
      return {
        exitCode: 1,
        suppressError: true,
      }
    }

    err.code ||= err.message.match(/^(?:Error: )?(E[A-Z]+)/)?.[1]

    for (const k of ['type', 'stack', 'statusCode', 'pkgid']) {
      const v = err[k]
      if (v) {
        log.verbose(k, replaceInfo(v))
      }
    }

    const { errorMessage, getExitCodeFromError } = require('./utils/error-message.js')
    const exitCode = getExitCodeFromError(err) || 1
    const { summary, detail, files = [] } = errorMessage(err, this)

    const { writeFileSync } = require('node:fs')
    for (const [file, content] of files) {
      try {
        writeFileSync(file, content)
      } catch (fileErr) {
        log.warn('', `Could not write error message to ${file} due to ${fileErr}`)
      }
    }

    for (const k of ['code', 'syscall', 'file', 'path', 'dest', 'errno']) {
      const v = err[k]
      if (v) {
        log.error(k, v)
      }
    }

    for (const errline of [...summary, ...detail]) {
      log.error(...errline)
    }

    return {
      exitCode,
      suppressError: false,
      summary,
      detail,
    }
  }

  get loaded () {
    return this.config.loaded
  }

  // This gets called at the end of the exit handler and
  // during any tests to cleanup all of our listeners
  // Everything in here should be synchronous
  unload () {
    this.#timers.off()
    this.#display.off()
    this.#logFile.off()
  }

  finishTimers () {
    this.#timers.finish({
      id: this.#runId,
      command: this.#argvClean,
      logfiles: this.logFiles,
      version: this.version,
    })
  }

  exitErrorMessage () {
    if (this.logFiles.length) {
      return `A complete log of this run can be found in: ${this.logFiles.join('\n')}`
    }

    // user specified no log file
    const logsMax = this.config.get('logs-max')
    if (logsMax <= 0) {
      return `Log files were not written due to the config logs-max=${logsMax}`
    }

    // could be an error writing to the directory
    return [
      `Log files were not written due to an error writing to the directory: ${this.#logsDir}`,
      'You can rerun the command with `--loglevel=verbose` to see the logs in your terminal',
    ].join('\n')
  }

  get title () {
    return this.#title
  }

  set title (t) {
    process.title = t
    this.#title = t
  }

  get isShellout () {
    return this.#command?.constructor?.isShellout
  }

  get command () {
    return this.#command?.name
  }

  get flatOptions () {
    const { flat } = this.config
    flat.nodeVersion = process.version
    flat.npmVersion = pkg.version
    if (this.command) {
      flat.npmCommand = this.command
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

  get noColorChalk () {
    return this.#display.chalk.noColor
  }

  get chalk () {
    return this.#display.chalk.stdout
  }

  get logChalk () {
    return this.#display.chalk.stderr
  }

  get global () {
    return this.config.get('global') || this.config.get('location') === 'global'
  }

  get silent () {
    return this.flatOptions.silent
  }

  get lockfileVersion () {
    return 2
  }

  get started () {
    return this.#timers.started
  }

  get logFiles () {
    return this.#logFile.files
  }

  get #logsDir () {
    return this.config.get('logs-dir') || join(this.cache, '_logs')
  }

  get logPath () {
    return resolve(this.#logsDir, `${this.#runId}-`)
  }

  get npmRoot () {
    return this.#npmRoot
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

  get localPackage () {
    return this.config.localPackage
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
    return this.global ? this.globalDir : this.localDir
  }

  get globalBin () {
    const b = this.globalPrefix
    return process.platform !== 'win32' ? resolve(b, 'bin') : b
  }

  get localBin () {
    return resolve(this.dir, '.bin')
  }

  get bin () {
    return this.global ? this.globalBin : this.localBin
  }

  get prefix () {
    return this.global ? this.globalPrefix : this.localPrefix
  }

  set prefix (r) {
    const k = this.global ? 'globalPrefix' : 'localPrefix'
    this[k] = r
  }

  get usage () {
    return usage(this)
  }
}
module.exports = Npm
