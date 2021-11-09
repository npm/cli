const os = require('os')
const log = require('proc-log')
const stripAnsi = require('strip-ansi')

const errorMessage = require('./error-message.js')
const replaceInfo = require('./replace-info.js')

let npm // set by the cli
let exitHandlerCalled = false
let showLogFileMessage = false

process.on('exit', code => {
  // process.emit is synchronous, so the timeEnd handler will run before the
  // unfinished timer check below
  process.emit('timeEnd', 'npm')

  // npm.log.disableProgress() // TODO(display): proggy

  for (const [name, timer] of npm.timers.unfinished) {
    log.verbose('unfinished npm timer', name, timer)
  }

  const timing = npm.config.loaded && npm.config.get('timing')

  if (timing) {
    npm.timers.writeFile({
      dir: npm.config.get('cache'),
      version: npm.version,
      command: process.argv.slice(2),
      logfile: npm.logFiles.writtenFiles,
    })
  }

  if (!code) {
    log.info('ok')
  } else {
    log.verbose('code', code)
  }

  if (!exitHandlerCalled) {
    process.exitCode = code || 1
    log.error('', 'Exit handler never called!')
    log.error('')
    log.error('', 'This is an error with npm itself. Please report this error at:')
    log.error('', '    <https://github.com/npm/cli/issues>')
    showLogFileMessage = true
  }

  // In timing mode we always show the log file message
  if (timing) {
    showLogFileMessage = true
  }

  if (showLogFileMessage) {
    // just a line break
    // TODO(display): why is this here?
    if (npm.config.loaded && npm.config.get('loglevel') !== 'silent') {
      log.error('')
    }

    // XXX: display this differently if it is successful
    // but we are showing it for other reasons
    log.error(
      '',
      [
        'A complete log of this run can be found in:',
        ...npm.logFiles.writtenFiles.map(f => '    ' + f),
      ].join('\n')
    )
  }

  npm.logFiles.off()
  npm.timers.off()

  // these are needed for the tests to have a clean slate in each test case
  exitHandlerCalled = false
  showLogFileMessage = false
})

// This might be colorized if it's an ERESOLVE but we don't ever want
// it colorized in the resulting json error.
// TODO(display): this should be cleaned up by the display layer
const jsonMessageText = msg =>
  stripAnsi(msg.map(line => line.slice(1).join(' ')).join('\n')).trim()

const exitHandler = async err => {
  // npm.log.disableProgress() // TODO(display): proggy

  if (!npm.config.loaded) {
    err = err || new Error('Exit prior to config file resolving.')
    npm.outputError(err.stack || err.message)
  }

  // only show the notification if it finished.
  if (typeof npm.updateNotification === 'string') {
    // Logging this way displays it regardless of loglevel
    // TODO(display): we should make this more visible so its
    // not lost in the logs
    npm.display.log('notice', '', npm.updateNotification)
  }

  exitHandlerCalled = true

  let exitCode
  let noLog

  if (err) {
    exitCode = 1
    // if we got a command that just shells out to something else, then it
    // will presumably print its own errors and exit with a proper status
    // code if there's a problem.  If we got an error with a code=0, then...
    // something else went wrong along the way, so maybe an npm problem?
    const isShellout = npm.shelloutCommands.includes(npm.command)
    const quietShellout = isShellout && typeof err.code === 'number' && err.code
    if (quietShellout) {
      exitCode = err.code
      noLog = true
    } else if (typeof err === 'string') {
      noLog = true
      log.error('', err)
    } else if (!(err instanceof Error)) {
      noLog = true
      log.error('weird error', err)
    } else {
      if (!err.code) {
        const matchErrorCode = err.message.match(/^(?:Error: )?(E[A-Z]+)/)
        err.code = matchErrorCode && matchErrorCode[1]
      }

      for (const k of ['type', 'stack', 'statusCode', 'pkgid']) {
        const v = err[k]
        if (v) {
          log.verbose(k, replaceInfo(v))
        }
      }

      log.verbose('cwd', process.cwd())

      const args = replaceInfo(process.argv)
      log.verbose('', os.type() + ' ' + os.release())
      log.verbose('argv', args.map(JSON.stringify).join(' '))
      log.verbose('node', process.version)
      log.verbose('npm ', 'v' + npm.version)

      for (const k of ['code', 'syscall', 'file', 'path', 'dest', 'errno']) {
        const v = err[k]
        if (v) {
          log.error(k, v)
        }
      }

      const msg = errorMessage(err, npm)
      for (const errline of [...msg.summary, ...msg.detail]) {
        log.error(...errline)
      }

      if (npm.config.loaded && npm.config.get('json')) {
        const error = {
          error: {
            code: err.code,
            summary: jsonMessageText(msg.summary),
            detail: jsonMessageText(msg.detail),
          },
        }
        // TODO(display): the display layer could provide a way for
        // json errors to be on stdout so they are pipeable
        // Ref: https://github.com/npm/cli/pull/3437
        npm.display.outputError(JSON.stringify(error, null, 2))
      }

      if (typeof err.errno === 'number') {
        exitCode = err.errno
      } else if (typeof err.code === 'number') {
        exitCode = err.code
      }
    }
  }

  log.verbose('exit', exitCode || 0)

  if (npm.config.loaded && npm.config.get('loglevel') === 'silent') {
    noLog = true
  }

  // noLog is true if there was an error, including if config wasn't loaded, so
  // this doesn't need a config.loaded guard
  if (exitCode && !noLog) {
    showLogFileMessage = true
  }

  // flush stdout and log file beforehand because process.exit doesn't
  // wait for that to happen
  // explicitly call process.exit now so we don't hang on things like the
  // update notifier
  process.stdout.write('', () => process.exit(exitCode))
}

module.exports = exitHandler
module.exports.setNpm = n => {
  npm = n
}
