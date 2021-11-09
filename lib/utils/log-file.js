const os = require('os')
const path = require('path')
const { format } = require('util')
const mkdirp = require('mkdirp-infer-owner')
const fs = require('graceful-fs')
const rimraf = require('rimraf')
const glob = require('glob')
const log = require('proc-log')
const MiniPass = require('minipass')
const fsMiniPass = require('fs-minipass')

const _logHandler = Symbol('logHandler')
const _timerHandler = Symbol('timerHandler')
const _formatLogItem = Symbol('formatLogItem')
const _formatTimer = Symbol('formatTimer')
const _getLogFileName = Symbol('getLogFileName')
const _openLogFile = Symbol('openLogFile')
const _cleanLogs = Symbol('cleanlogs')

class LogFiles {
  // If we write multiple log files we want them all to have the same
  // identifier for sorting and matching purposes
  #logId = new Date().toISOString().replace(/[.:]/g, '_')

  // Default to a plain minipass stream so we can buffer
  // initial writes before we know the cache location
  #logStream = new MiniPass()

  // We cap log files at a certain number of log events per file.
  // Note that each log event can write more than one line to the
  // file. Then we rotate log files once this number of events is reached.
  #MAX_LOGS_PER_FILE = null

  // Now that we write logs continuously we need to have a backstop
  // here for infinite loops that still log. This is also handled
  // by the cleanining of log files, but this is a failsafe to
  // prevent runaway log file creation
  #MAX_LOG_FILES_PER_PROCESS = null

  #fileCount = 0
  #fileLogCount = 0
  #totalLogCount = 0
  #lastClean = 0
  #dir = null
  #maxFiles = null
  #timers = null
  #writtenFiles = []

  constructor ({
    timers,
    maxLogsPerFile = 5,
    maxFilesPerProcess = 100,
  } = {}) {
    this.#MAX_LOGS_PER_FILE = maxLogsPerFile
    this.#MAX_LOG_FILES_PER_PROCESS = maxFilesPerProcess
    // proc log doesnt have a timing level so we hook directly into
    // the timers and add log events directly
    if (timers) {
      this.#timers = timers
      this.#timers.on(this[_timerHandler])
    }
    process.on('log', this[_logHandler])
  }

  on ({ dir, maxFiles }) {
    this.#dir = dir
    this.#maxFiles = maxFiles

    // Pipe our initial stream to our new log stream and
    // return that
    this.#logStream = this.#logStream.pipe(this[_openLogFile](0))

    // Kickoff cleaning process. This is async but it wont delete
    // our next log file since it deletes oldest first.
    this[_cleanLogs]()
  }

  off () {
    process.off('log', this[_logHandler])

    if (this.#timers) {
      this.#timers.off(this[_timerHandler])
    }

    if (this.#logStream) {
      this.#logStream.end()
    }
  }

  get writtenFiles () {
    return this.#writtenFiles
  }

  // Public so other things can write stuff here too
  get dir () {
    return path.resolve(this.#dir, '_logs')
  }

  [_timerHandler] = (name, ms) => {
    this[_logHandler]('timing', ...this[_formatTimer](name, ms))
  }

  [_logHandler] = (level, ...args) => {
    // Ignore pause and resume events since we
    // write everything to the log file
    if (level === 'pause' || level === 'resume') {
      return
    }

    const logOutput = this[_formatLogItem](level, ...args)

    // Open a new log file if we've written too many logs to this one
    // and were no longer writing to the initial buffer
    if (this.#fileLogCount >= this.#MAX_LOGS_PER_FILE &&
        !(this.#logStream instanceof MiniPass)) {
      this.#fileLogCount = 0
      this.#fileCount++
      if (this.#fileCount > this.#MAX_LOG_FILES_PER_PROCESS) {
        // but if its way too many then we just stop listening
        this.off()
      } else {
        this.#logStream.end(logOutput)
        this.#logStream = null
      }
    } else {
      if (!this.#logStream) {
        this.#logStream = this[_openLogFile](this.#fileCount)
      }
      this.#logStream.write(logOutput)
    }

    // Kick off another cleaning process if we've written enough files
    // for it to matter
    if (Math.floor(this.#fileCount / this.#maxFiles) > this.#lastClean) {
      this.#lastClean++
      this[_cleanLogs]()
    }
  }

  [_formatTimer] (name, ms) {
    return [name, `Completed in ${ms}ms`]
  }

  [_formatLogItem] (level, title, ...args) {
    this.#fileLogCount += 1
    this.#totalLogCount += 1

    const prefixes = [this.#totalLogCount, level]
    if (title) {
      prefixes.push(title)
    }
    const prefix = prefixes.join(' ')

    return format(...args)
      .trim()
      .split(/\r?\n/)
      .reduce((lines, line) =>
        lines += (prefix + ' ' + line).trim() + os.EOL,
      ''
      )
  }

  [_getLogFileName] (prefix, suffix) {
    return path.resolve(this.dir, `${prefix}-debug-${suffix}.log`)
  }

  [_openLogFile] (count) {
    // Pad with zeros so that our log files are always sorted properly
    const countDigits = this.#MAX_LOG_FILES_PER_PROCESS.toString().length
    const file = this[_getLogFileName](this.#logId, count.toString().padStart(countDigits, '0'))
    mkdirp.sync(path.dirname(file))

    const logStream = new fsMiniPass.WriteStreamSync(file, { flags: 'a+' })
    this.#writtenFiles.push(logStream.path)

    const st = fs.lstatSync(path.dirname(this.#dir))
    fs.chownSync(this.#dir, st.uid, st.gid)
    fs.chownSync(file, st.uid, st.gid)

    return logStream
  }

  [_cleanLogs] () {
    // module to clean out the old log files
    // this is a best-effort attempt.  if a rm fails, we just
    // log a message about it and move on.  We do return a
    // Promise that succeeds when we've tried to delete everything,
    // just for the benefit of testing this function properly.
    return new Promise(done => {
      glob(this.file('*', '*'), (er, files) => {
        if (er) {
          return done()
        }

        let pending = files.length - this.#maxFiles
        if (pending <= 0) {
          return done()
        }

        for (let i = 0; i < files.length - this.#maxFiles; i++) {
          rimraf(files[i], er => {
            if (er) {
              log.warn('log', 'failed to remove log file', files[i])
            }

            if (--pending === 0) {
              done()
            }
          })
        }
      })
    }).catch((e) => {
      log.warn('log', 'error removing log files', e)
    })
  }
}

module.exports = LogFiles
