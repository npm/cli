// pass in an arborist object, and it'll output the data about what
// was done, what was audited, etc.
//
// added 351 packages, removed 132 packages, and audited 13388 packages in 19.157s
//
// 1 package is looking for funding
//   run `npm fund` for details
//
// found 37 vulnerabilities (5 low, 7 moderate, 25 high)
//   run `npm audit fix` to fix them, or `npm audit` for details

const npm = require('../npm.js')
const log = require('npmlog')
const output = log.level === 'silent' ? () => {} : require('./output.js')
const { depth } = require('treeverse')
const ms = require('ms')
const auditReport = require('npm-audit-report')

// TODO: output JSON if flatOptions.json is true
const reifyOutput = arb => {
  const {diff, auditReport, actualTree} = arb

  const summary = {
    added: 0,
    removed: 0,
    changed: 0,
    audited: auditReport ? actualTree.inventory.size : 0,
    fund: 0
  }

  depth({
    tree: diff,
    visit: d => {
      switch (d.action) {
        case 'REMOVE':
          summary.removed ++
          break
        case 'ADD':
          summary.added ++
          break
        case 'CHANGE':
          summary.changed ++
          break
        default:
          return
      }
      const node = d.actual || d.ideal
      log.silly(d.action, node.location)
    },
    getChildren: d => d.children
  })

  for (const node of actualTree.inventory.filter(n => n.package.funding)) {
    summary.fund ++
  }

  if (npm.flatOptions.json) {
    if (arb.auditReport) {
      summary.audit = npm.command === 'audit' ? arb.auditReport
        : arb.auditReport.toJSON().metadata
    }
    output(JSON.stringify(summary, 0, 2))
  } else {
    packagesChangedMessage(summary)
    packagesFundingMessage(summary)
    printAuditReport(arb)
  }
}

// if we're running `npm audit fix`, then we print the full audit report
// at the end if there's still stuff, because it's silly for `npm audit`
// to tell you to run `npm audit` for details.  otherwise, use the summary
// report.  if we get here, we know it's not quiet or json.
const printAuditReport = arb => {
  const reporter = npm.command !== 'audit' ? 'install' : 'detail'
  const res = auditReport(arb.auditReport, {
    reporter,
    ...npm.flatOptions
  })
  process.exitCode = process.exitCode || res.exitCode
  output('\n' + res.report)
}

const packagesChangedMessage = ({ added, removed, changed, audited }) => {
  const msg = ['\n']
  if (added === 0 && removed === 0 && changed === 0) {
    msg.push('up to date')
    if (audited) {
      msg.push(', ')
    }
  } else {
    if (added) {
      msg.push(`added ${added} package${ added === 1 ? '' : 's' }`)
    }
    if (removed) {
      if (added) {
        msg.push(', ')
      }
      if (!audited && !changed) {
        msg.push('and ')
      }
      msg.push(`removed ${removed} package${ removed === 1 ? '' : 's' }`)
    }
    if (changed) {
      if (added || removed) {
        msg.push(', ')
      }
      if (!audited) {
        msg.push('and ')
      }
      msg.push(`changed ${changed} package${ changed === 1 ? '' : 's' }`)
    }
    if (audited) {
      msg.push(', and ')
    }
  }
  if (audited) {
    msg.push(`audited ${audited} package${ audited === 1 ? '' : 's' }`)
  }
  msg.push(` in ${ms(Date.now() - npm.started)}`)
  output(msg.join(''))
}

const packagesFundingMessage = ({ fund }) => {
  if (!fund) {
    return
  }

  output('')
  const pkg = fund === 1 ? 'package' : 'packages'
  const is = fund === 1 ? 'is' : 'are'
  output(`${fund} ${pkg} ${is} looking for funding`)
  output('  run `npm fund` for details')
}

module.exports = reifyOutput
