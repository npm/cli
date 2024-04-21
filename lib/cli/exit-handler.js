const { log, output, META } = require('proc-log')
const { errorMessage, getExitCodeFromError } = require('../utils/error-message.js')

class ExitHandler {
  #npm = null
  #process = null
  #exited = false
  #exitErrorMessage = false

  get #hasNpm () {
    return !!this.#npm
  }

  get #loaded () {
    return !!this.#npm?.loaded
  }

  get #showExitErrorMessage () {
    if (!this.#loaded) {
      return false
    }
    if (!this.#exited) {
      return true
    }
    return this.#exitErrorMessage
  }

  get #notLoadedOrExited () {
    return !this.#loaded && !this.#exited
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
    // Force exit code to a number if it has not been set
    const exitCode = this.#setExitCode(this.#exited ? (code || 0) : (code || 1))

    if (this.#notLoadedOrExited) {
      // Exit handler was not called and npm loaded so we have to log something
      this.#logConsoleError(new Error(`Process exited unexpectedly with code: ${exitCode}`))
      return
    }

    const os = require('node:os')
    log.verbose('cwd', process.cwd())
    log.verbose('os', `${os.type()} ${os.release()}`)
    log.verbose('node', process.version)
    log.verbose('npm ', 'v' + this.#npm.version)

    // only show the notification if it finished
    if (typeof this.#npm.updateNotification === 'string') {
      log.notice('', this.#npm.updateNotification, { [META]: true, force: true })
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

    if (this.#showExitErrorMessage) {
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

    this.#exitErrorMessage = err?.suppressError === true ? false : !!err

    // explicitly call process.exit now so we don't hang on things like the
    // update notifier. This is done as a callback to output so all stdout/err
    // can be flushed beforehand because process.exit doesn't wait for that to happen.
    output.flush({
      [META]: true,
      callback: () => this.#process.exit(err?.exitCode || this.#process.exitCode),
    })
  }
}

module.exports = ExitHandler
