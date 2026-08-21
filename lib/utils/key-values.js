const { output, META } = require('proc-log')
const color = require('./color.js')

const defaultPredicate = (key, value) => {
  if (value === null || value === undefined) {
    return null
  }
  return color.stdout('green', value)
}

function logObject (values, { json, predicate = defaultPredicate } = {}) {
  if (json) {
    output.standard(JSON.stringify(values, null, 2), { [META]: true, redact: false })
    return
  }

  const lines = []
  for (const [key, value] of Object.entries(values)) {
    const formatted = predicate(key, value)
    if (formatted !== null) {
      lines.push(`${color.stdout('cyan', key)}: ${formatted}`)
    }
  }
  if (lines.length) {
    output.standard(lines.join('\n'), { [META]: true, redact: false })
  }
}

function logStageItem (item) {
  const { id, packageName, version, tag, createdAt, actor, actorType, shasum, ...rest } = item
  logObject({
    id,
    'package name': packageName,
    version,
    tag,
    'date staged': createdAt,
    'staged by': actorType ? `${actor} (${actorType})` : actor,
    shasum,
    ...rest,
  })
}

module.exports = { logObject, logStageItem, defaultPredicate }
