'use strict'

const colors = require('../colors.js')
const install = require('./install.js')

module.exports = (data, { color }) => {
  const summary = install.summary(data, { color })
  const none = data.metadata.vulnerabilities.total === 0
  return none ? summary : fullReport(data, {color, summary})
}

const fullReport = (data, { color, summary }) => {
  const c = colors(color)
  const output = [c.white('# npm audit report'), '']

  const printed = new Set()
  for (const [name, vuln] of Object.entries(data.vulnerabilities)) {
    if (printed.has(vuln))
      continue

    printed.add(vuln)
    output.push(printVuln(vuln, c, data.vulnerabilities, printed))
  }

  output.push(summary)

  return output.join('\n')
}

const printVuln = (vuln, c, vulnerabilities, printed, indent = '') => {
  const output = []

  output.push(c.white(vuln.name) + '  ' + vuln.range)

  if (indent === '' && (vuln.severity !== 'low' || vuln.severity === 'info')) {
    output.push(`Severity: ${c.severity(vuln.severity)}`)
  }

  for (const via of vuln.via) {
    if (typeof via === 'string') {
      output.push(`Depends on vulnerable versions of ${c.white(via)}`)
    } else if (indent === '') {
      output.push(`${c.white(via.title)} - ${via.url}`)
    }
  }

  if (indent === '') {
    const { fixAvailable: fa } = vuln
    if (fa === false) {
      output.push(c.red('No fix available'))
    } else if (fa === true) {
      output.push(c.green('fix available') + ' via `npm audit fix`')
    } else {
      /* istanbul ignore else - should be impossible, just being cautious */
      if (typeof fa === 'object' && indent === '') {
        output.push(
          `${c.yellow('fix available')} via \`npm audit fix --force\``,
          `Will install ${fa.name}@${fa.version}` +
          `, which is ${fa.isSemVerMajor ? 'a breaking change' :
            'outside the stated dependency range' }`
        )
      }
    }
  }

  for (const path of vuln.nodes) {
    output.push(c.dim(path))
  }

  for (const effect of vuln.effects) {
    const vuln = vulnerabilities[effect]
    // still print it again if it has its own advisory as well
    if (vuln.via.filter(v => typeof v !== 'string').length === 0)
      printed.add(vuln)
    const e = printVuln(vuln, c, vulnerabilities, printed, '  ')
    output.push(...e.split('\n'))
  }

  if (indent === '') {
    output.push('')
  }

  return output.map(l => `${indent}${l}`).join('\n')
}
