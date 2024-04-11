const { LEVELS: PROC_LOC_LEVELS } = require('proc-log')

const LEVELS = ['timing', ...PROC_LOC_LEVELS]
const LABELS = new Map([
  ['error', 'ERR!'],
  ['warn', 'WARN'],
  ['verbose', 'verb'],
  ['silly', 'sill'],
].reduce((acc, v) => acc.concat([v, v.slice(0).reverse()]), []))

const LOG_PREFIX = new RegExp(`^npm (${LEVELS.map(l => LABELS.get(l) ?? l).join('|')}) `, 'm')
const GLOBAL_LOG_PREFIX = new RegExp(LOG_PREFIX.source, 'gm')

// We only strip trailing newlines since some output will
// have significant tabs and spaces
const trimTrailingNewline = (str) => str.replace(/\n$/, '')

const joinAndTrimTrailingNewlines = (arr) =>
  trimTrailingNewline(arr.map(trimTrailingNewline).join('\n'))

const logsByTitle = (logs) => (title) => {
  return logs
    .filter((l) => l.messageNoLevel.startsWith(title + ' '))
    .map((l) => l.messageNoLevel)
}

module.exports = () => {
  const outputs = []
  const outputErrors = []

  const RAW_LOGS = []

  const logs = Object.defineProperties([], {
    byTitle: {
      value: logsByTitle(RAW_LOGS),
    },
    ...LEVELS.reduce((acc, level) => {
      acc[level] = {
        get () {
          const byLevel = RAW_LOGS.filter((l) => l.level === level)
          const messagesForLevel = byLevel.map((l) => l.messageNoLevel)
          return Object.defineProperty(messagesForLevel, 'byTitle', {
            value: logsByTitle(byLevel),
          })
        },
      }
      return acc
    }, {}),
  })

  const streams = {
    stderr: {
      write: (str) => {
        // Use the beginning of each line to determine if its a log
        // or an output error since we write both of those to stderr.
        // This couples logging format to this test but we only need
        // to do it in a single place so hopefully its easy to change
        // in the future if/when we refactor what logs look like.
        const logMatch = str.match(LOG_PREFIX)
        if (logMatch) {
          // This is the message including the `npm` heading on each line.
          // This is not really used in tests since we know every single
          // line will have this prefix and it makes it a pain to assert
          // stuff about each log line.
          const fullMessage = trimTrailingNewline(str)
          const [, label] = logMatch
          const level = LABELS.get(label) ?? label
          const messageNoHeading = fullMessage.replace(GLOBAL_LOG_PREFIX, `${level} `)
          const messageNoLevel = fullMessage.replace(GLOBAL_LOG_PREFIX, '')

          RAW_LOGS.push({
            level,
            fullMessage,
            messageNoHeading,
            messageNoLevel,
          })

          // The message without the heading is what is used throughout the tests
          logs.push(messageNoHeading)
        } else {
          outputErrors.push(trimTrailingNewline(str))
        }
      },
    },
    stdout: {
      write: (str) => {
        outputs.push(trimTrailingNewline(str))
      },
    },
  }

  return {
    streams,
    logs: {
      outputs,
      joinedOutput: () => joinAndTrimTrailingNewlines(outputs),
      clearOutput: () => {
        outputs.length = 0
        outputErrors.length = 0
      },
      outputErrors,
      joinedOutputError: () => joinAndTrimTrailingNewlines(outputs),
      logs,
      clearLogs: () => {
        RAW_LOGS.length = 0
        logs.length = 0
      },
    },
  }
}
