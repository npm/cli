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

function longestCommonPrefix (words) {
  // check border cases size 1 array and empty first word)
  if (words.length === 1) {
    return words[0].split(' ')[0]
  }

  let i = 0
  // while all words have the same character at position i, increment i
  while (words[0][i] && words.every(w => w[i] === words[0][i])) {
    i++
  }

  // prefix is the substring from the beginning to the last successfully checked i
  return words[0].substr(0, i)
}

module.exports = () => {
  const outputs = []
  const outputErrors = []

  const RAW_LOGS = []

  const logs = Object.defineProperties(
    [],
    LEVELS.reduce((acc, level) => {
      acc[level] = {
        get () {
          const byLevel = RAW_LOGS.filter((l) => l.level === level)
          return Object.defineProperty(
            byLevel.map((l) => l.titleMessage),
            'byTitle',
            {
              value: (title) => byLevel
                .filter((l) => l.titleMessage.startsWith(title))
                .map((l) => l.titleMessage.replace(new RegExp(`^${title} `, 'gm'), '')),
            }
          )
        },
      }
      return acc
    }, {
      byTitle: {
        value: (title) => {
          return RAW_LOGS
            .filter((l) => l.titleMessage.startsWith(title))
            .map((l) => l.titleMessage.replace(new RegExp(`^${title} `, 'gm'), ''))
        },
      },
    })
  )

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
          str = str.trimEnd()
          const [, label] = logMatch
          const level = LABELS.get(label) ?? label
          const fullMessage = str.replace(GLOBAL_LOG_PREFIX, `${level} `)
          const titleMessage = str.replace(GLOBAL_LOG_PREFIX, '')
          const title = longestCommonPrefix(titleMessage.split('\n'))
          const message = titleMessage.replace(new RegExp(`^${title} `, 'gm'), '')

          RAW_LOGS.push({
            level,
            fullMessage,
            titleMessage,
            title,
            message,
          })

          logs.push(fullMessage)
        } else {
          outputErrors.push(str.replace(/\n$/, ''))
        }
      },
    },
    stdout: {
      write: (str) => {
        outputs.push(str.replace(/\n$/, ''))
      },
    },
  }

  return {
    streams,
    logs: {
      outputs,
      joinedOutput: () => outputs.map(o => o.trimEnd()).join('\n').trimEnd(),
      clearOutput: () => {
        outputs.length = 0
      },
      outputErrors,
      joinedOutputError: () => outputErrors.map(o => o.trimEnd()).join('\n').trimEnd(),
      logs,
      clearLogs: () => {
        RAW_LOGS.length = 0
        logs.length = 0
      },
    },
  }
}
