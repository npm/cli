const os = require('os')
const path = require('path')
const { format } = require('util')
const writeFileAtomic = require('write-file-atomic')
const mkdirp = require('mkdirp-infer-owner')
const fs = require('graceful-fs')
const log = require('proc-log')
const stripAnsi = require('strip-ansi')

const errorMessage = require('./error-message.js')
const replaceInfo = require('./replace-info.js')

let exitHandlerCalled = false
let logFileName
let npm // set by the cli
let wroteLogFile = false

// Timers in progress
const timers = new Map()
// Finished timers
const timings = {}

const logRecord = []
let logId = 0

const getLogFile = () => {
  // we call this multiple times, so we need to treat it as a singleton because
  // the date is part of the name
  if (!logFileName) {
    logFileName = path.resolve(
      npm.config.get('cache'),
      '_logs',
      new Date().toISOString().replace(/[.:]/g, '_') + '-debug.log'
    )
  }

  return logFileName
}

const logHandler = (level, prefix, ...args) => {
  // TODO(display): open append only file and write to it
  // per event and delete on success
  logRecord.push({
    id: logId++,
    level,
    prefix,
    message: format(...args),
  })
}

const timeHandler = (name) => {
  timers.set(name, Date.now())
}

const timeEndHandler = (name) => {
  if (timers.has(name)) {
    const ms = Date.now() - timers.get(name)
    npm.display.timing(name, `Completed in ${ms}ms`)
    timings[name] = ms
    timers.delete(name)
  } else
    log.silly('timing', "Tried to end timer that doesn't exist:", name)
}

process.on('log', logHandler)
process.on('time', timeHandler)
process.on('timeEnd', timeEndHandler)

process.on('exit', code => {
  // process.emit is synchronous, so the timeEnd handler will run before the
  // unfinished timer check below
  process.emit('timeEnd', 'npm')
  // npm.log.disableProgress() // TODO(display): proggy
  for (const [name, timer] of timers) {
    log.verbose('unfinished npm timer', name, timer)
  }
  if (npm.config.loaded && npm.config.get('timing')) {
    try {
      const file = path.resolve(npm.config.get('cache'), '_timing.json')
      const dir = path.dirname(npm.config.get('cache'))
      mkdirp.sync(dir)

      fs.appendFileSync(
        file,
        JSON.stringify({
          command: process.argv.slice(2),
          logfile: getLogFile(),
          version: npm.version,
          ...timings,
        }) + '\n'
      )

      const st = fs.lstatSync(path.dirname(npm.config.get('cache')))
      fs.chownSync(dir, st.uid, st.gid)
      fs.chownSync(file, st.uid, st.gid)
    } catch (ex) {
      // ignore
    }
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
    // TODO this doesn't have an npm.config.loaded guard
    writeLogFile()
  }
  // In timing mode we always write the log file
  if (npm.config.loaded && npm.config.get('timing') && !wroteLogFile) {
    writeLogFile()
  }
  if (wroteLogFile) {
    // just a line break
    if (npm.config.get('loglevel') !== 'silent') {
      log.error('')
    }

    log.error(
      '',
      ['A complete log of this run can be found in:', '    ' + getLogFile()].join('\n')
    )
  }

  // these are needed for the tests to have a clean slate in each test case
  exitHandlerCalled = false
  wroteLogFile = false
})

const exitHandler = err => {
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

  if (npm.config.get('loglevel') === 'silent') {
    noLog = true
  }

  // noLog is true if there was an error, including if config wasn't loaded, so
  // this doesn't need a config.loaded guard
  if (exitCode && !noLog) {
    writeLogFile()
  }

  process.off('log', logHandler)
  process.off('time', timeHandler)
  process.off('timeEnd', timeEndHandler)

  // explicitly call process.exit now so we don't hang on things like the
  // update notifier, also flush stdout beforehand because process.exit doesn't
  // wait for that to happen.
  process.stdout.write('', () => process.exit(exitCode))
}

// This can be colorized if it's an ERESOLVE but we don't ever want
// it colorized in the resulting json error.
// TODO(display): this should be cleaned up by the display layer
const jsonMessageText = msg => stripAnsi(msg.map(line => line.slice(1).join(' ')).join('\n')).trim()

const writeLogFile = () => {
  try {
    let logOutput = ''
    logRecord.forEach(m => {
      const p = [m.id, m.level]
      if (m.prefix) {
        p.push(m.prefix)
      }
      const pref = p.join(' ')

      m.message
        .trim()
        .split(/\r?\n/)
        .map(line => (pref + ' ' + line).trim())
        .forEach(line => {
          logOutput += line + os.EOL
        })
    })

    const file = getLogFile()
    const dir = path.dirname(file)
    mkdirp.sync(dir)
    writeFileAtomic.sync(file, logOutput)

    const st = fs.lstatSync(path.dirname(npm.config.get('cache')))
    fs.chownSync(dir, st.uid, st.gid)
    fs.chownSync(file, st.uid, st.gid)

    // truncate once it's been written.
    logRecord.length = 0
    wroteLogFile = true
  } catch (ex) {}
}

module.exports = exitHandler
module.exports.setNpm = n => {
  npm = n
}
