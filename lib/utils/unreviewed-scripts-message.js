const { log } = require('proc-log')
const { trustedDisplay } = require('@npmcli/arborist/lib/script-allowed.js')
const checkAllowScripts = require('./check-allow-scripts.js')
const { configSetAllowScripts } = require('./allow-scripts-remediation.js')

const unreviewedScriptsMessage = (npm, unreviewedScripts) => {
  if (!unreviewedScripts.length) {
    return
  }

  // Goes through log.warn so it respects --loglevel / --silent and lands
  // on stderr like every other "FYI, here's something to know" message.
  // stdout is reserved for things the user explicitly asked to see
  // (npm ls, npm view).
  const count = unreviewedScripts.length
  const pkg = count === 1 ? 'package had' : 'packages had'
  const header =
    `${count} ${pkg} install scripts blocked because they are not covered by allowScripts:`

  const names = []
  const lines = unreviewedScripts.map(({ node, scripts }) => {
    const { name, version } = trustedDisplay(node)
    /* istanbul ignore next: every test node has a name */
    const display = name || '<unknown>'
    names.push(display)
    const ver = version ? `@${version}` : ''
    const events = Object.entries(scripts)
      .map(([event, cmd]) => `${event}: ${cmd}`)
      .join('; ')
    return `  ${display}${ver} (${events})`
  })

  log.warn(
    'install-scripts',
    [
      header,
      ...lines,
      '',
      ...remediationLines(npm, names),
    ].join('\n')
  )
}

// `npm install-scripts` writes to a project package.json, which doesn't
// exist for global installs (it throws EGLOBAL). For those, point users at
// the mechanism that does work globally: the `--allow-scripts` flag for a
// one-off, or `npm config set allow-scripts` to persist it.
const remediationLines = (npm, names) => {
  if (npm.global) {
    const list = names.join(',')
    return [
      `Run \`npm install -g --allow-scripts=${list}\` to allow these scripts ` +
      `once, or \`${configSetAllowScripts(names)}\` to allow them for ` +
      'all global installs.',
    ]
  }
  return [
    'Run `npm install-scripts ls` to review, ' +
    'or `npm install-scripts approve <pkg>` to allow.',
  ]
}

// Root lifecycle scripts run before `reifyFinish` does, so a failing one exits
// the command before the blocked-scripts warning would have been printed.
// Callers that run those scripts use this to report the blocked scripts first.
const warnUnreviewedScripts = async (npm, arb) =>
  unreviewedScriptsMessage(npm, await checkAllowScripts({ arb, npm }))

module.exports = { unreviewedScriptsMessage, warnUnreviewedScripts }
