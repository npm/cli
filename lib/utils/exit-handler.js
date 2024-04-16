const { log, output, META } = require('proc-log')
const errorMessage = require('./error-message.js')
const { redactLog: replaceInfo } = require('@npmcli/redact')

const getExitCodeFromError = (err) => {
  if (typeof err?.errno === 'number') {
    return err.errno
  } else if (typeof err?.code === 'number') {
    return err.code
  }
}

class ExitHandler {
  #npm = null
  #process = null
  #exited = false
  #suppressError = false

  get #hasNpm () {
    return !!this.#npm
  }

  get #loaded () {
    return this.#npm?.config.loaded
  }

  get #showLogFileError () {
    if (this.#suppressError || !this.#loaded) {
      return false
    }
    return !this.#exited || this.#process.exitCode
  }

  get #loadedOrExited () {
    return this.#loaded || this.#exited
  }

  set npm (npm) {
    this.#npm = npm
  }

  get npm () {
    return this.#npm
  }

  #setExitCode (code) {
    this.#process.exitCode = code
    return code
  }

  constructor ({ process }) {
    this.#process = process
    this.#process.on('exit', this.#handleProcesExitAndReset)
  }

  registerUncaughtHandlers () {
    this.#process.on('uncaughtException', this.#handleExit)
    this.#process.on('unhandledRejection', this.#handleExit)
  }

  exit (err) {
    this.#handleExit(err)
  }

  #handleProcesExitAndReset = (code) => {
    this.#handleProcessExit(code)

    // Reset all the state. This is only relevant for tests since
    // in reality the process fully exits here.
    this.#process.off('exit', this.#handleProcesExitAndReset)
    this.#process.off('uncaughtException', this.#handleExit)
    this.#process.off('unhandledRejection', this.#handleExit)
    if (this.#loaded) {
      this.#npm.unload()
    }
  }

  #handleProcessExit (code) {
    // Force exit code to 1 in case of an unexpected error.
    // Otherwise this is the final exit code we will have
    const exitCode = this.#setExitCode(this.#exited ? (code || 0) : (code || 1))

    if (!this.#loadedOrExited) {
      // Exit handler was not called and npm loaded so we have to log something
      this.#logConsoleError(new Error(`Process exited unexpectedly with code: ${exitCode}`))
      return
    }

    if (!this.#exited) {
      log.error('', 'Exit handler never called!')
      log.error('', 'This is an error with npm itself. Please report this error at:')
      log.error('', '    <https://github.com/npm/cli/issues>')
    }

    log.verbose('exit', exitCode)

    if (exitCode) {
      log.verbose('code', exitCode)
    } else {
      log.info('ok')
    }

    if (this.#showLogFileError) {
      log.error('', this.#npm.exitErrorMessage())
    }
  }

  #logConsoleError (err) {
    // Run our error message formatters on all errors even if we
    // have no npm or an unloaded npm. This will clean the error
    // and possible return a formatted message about EACCESS or something.
    const { summary = [], detail = [] } = errorMessage(err, this.#npm)
    const formatted = [...summary, ...detail].flat().filter(Boolean).join('\n')

    // If we didn't get anything from the formatted message then just display the full stack
    const message = formatted === err.message ? err.stack || err.message : formatted

    // eslint-disable-next-line no-console
    console.error(message)
  }

  #handleExit = (err) => {
    this.#exited = true

    // No npm at all
    if (!this.#hasNpm) {
      this.#logConsoleError(err || new Error(`Exit prior to setting npm in exit handler`))
      return this.#process.exit(this.#process.exitCode || getExitCodeFromError(err) || 1)
    }

    // npm was never loaded but we still might have a config loading error or
    // something similar that we can run through the error message formatter
    // to give the user a clue as to what happened.s
    if (!this.#loaded) {
      this.#logConsoleError(err || new Error('Exit prior to config file resolving'))
      return this.#process.exit(this.#process.exitCode || getExitCodeFromError(err) || 1)
    }

    return this.#handleNpmExit(err)
  }

  // We know npm has loaded here
  #handleNpmExit (err) {
    // only show the notification if it finished
    if (typeof this.#npm.updateNotification === 'string') {
      log.notice('', this.#npm.updateNotification, { [META]: true, force: true })
    }

    // Finish all our timer work, this will write the file if requested, end timers, etc
    this.#npm.finishTimers()

    // We might have an exit code already. Commands can set an exit code
    // separately from throwing an error. This could also be undefined which
    // is why we dont want to set it a a default here since we manually call
    // process.exit with this code.
    let exitCode = process.exitCode

    let flushJsonError
    if (err) {
      const errorState = this.#getErrorState(err)
      exitCode = errorState.exitCode
      flushJsonError = errorState.jsonError
      this.#suppressError = errorState.suppressError
    }

    // explicitly call process.exit now so we don't hang on things like the
    // update notifier. This is done as a callback to output so all stdout/err
    // can be flushed beforehand because process.exit doesn't wait for that to happen.
    output.flush({
      [META]: true,
      jsonError: flushJsonError,
      callback: () => this.#process.exit(exitCode),
    })
  }

  #getErrorState (err) {
    // if we got a command that just shells out to something else, then it
    // will presumably print its own errors and exit with a proper status
    // code if there's a problem.  If we got an error with a code=0, then...
    // something else went wrong along the way, so maybe an npm problem?
    if (this.#npm.isShellout && typeof err.code === 'number' && err.code) {
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

    err.code ||= err.message.match(/^(?:Error: )?(E[A-Z]+)/)?.[1]

    const exitCode = getExitCodeFromError(err) || 1

    for (const k of ['type', 'stack', 'statusCode', 'pkgid']) {
      const v = err[k]
      if (v) {
        log.verbose(k, replaceInfo(v))
      }
    }

    const os = require('node:os')
    log.verbose('cwd', this.#process.cwd())
    log.verbose('', `${os.type()} ${os.release()}`)
    log.verbose('node', this.#process.version)
    log.verbose('npm ', 'v' + this.#npm.version)

    for (const k of ['code', 'syscall', 'file', 'path', 'dest', 'errno']) {
      const v = err[k]
      if (v) {
        log.error(k, v)
      }
    }

    const { summary, detail, json, files = [] } = errorMessage(err, this.#npm)

    const fs = require('node:fs')
    for (const [file, content] of files) {
      try {
        fs.writeFileSync(file, content)
      } catch (fileErr) {
        log.warn('', `Could not write error message to ${file} due to ${fileErr}`)
      }
    }

    for (const errline of [...summary, ...detail]) {
      log.error(...errline)
    }

    return {
      jsonError: json,
      exitCode,
    }
  }
}

module.exports = ExitHandler
