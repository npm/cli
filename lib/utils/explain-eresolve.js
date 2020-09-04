// this is called when an ERESOLVE error is caught in the error-handler,
// or when there's a log.warn('eresolve', msg, explanation), to turn it
// into a human-intelligible explanation of what's wrong and how to fix.
//
// TODO: abstract out the explainNode methods into a separate util for
// use by a future `npm explain <path || spec>` command.

const npm = require('../npm.js')
const { writeFileSync } = require('fs')
const { resolve } = require('path')

const chalk = require('chalk')
const nocolor = {
  bold: s => s,
  dim: s => s
}

// expl is an explanation object that comes from Arborist.  It looks like:
// {
//   dep: {
//     whileInstalling: {
//       explanation of the thing being installed when we hit the conflict
//     },
//     name,
//     version,
//     dependents: [
//       things depending on this node (ie, reason for inclusion)
//       { name, version, dependents }, ...
//     ]
//   }
//   current: {
//     explanation of the current node that already was in the tree conflicting
//   }
//   peerConflict: {
//     explanation of the peer dependency that couldn't be added, or null
//   }
//   fixWithForce: Boolean - can we use --force to push through this?
//   type: type of the edge that couldn't be met
//   isPeer: true if the edge that couldn't be met is a peer dependency
// }
// Depth is how far we want to want to descend into the object making a report.
// The full report (ie, depth=Infinity) is always written to the cache folder
// at ${cache}/eresolve-report.txt along with full json.
const explainEresolve = (expl, color, depth) => {
  const { dep, current, peerConflict } = expl

  const out = []
  /* istanbul ignore else - should always have this for ERESOLVEs */
  if (dep.whileInstalling) {
    out.push('While resolving: ' + printNode(dep.whileInstalling, color))
  }

  out.push(explainNode('Found:', current, depth, color))

  out.push(explainNode('\nCould not add conflicting dependency:', dep, depth, color))

  if (peerConflict) {
    const heading = '\nConflicting peer dependency:'
    const pc = explainNode(heading, peerConflict, depth, color)
    out.push(pc)
  }

  return out.join('\n')
}

const explainNode = (heading, node, depth, color) =>
  `${heading} ${printNode(node, color)}` +
  explainDependents(node, depth, color)

const printNode = ({ name, version, location }, color) => {
  const { bold, dim } = color ? chalk : nocolor
  return `${bold(name)}@${bold(version)}` +
    (location ? dim(` at ${location}`) : '')
}

const explainDependents = ({ name, dependents }, depth, color) => {
  if (!dependents || !dependents.length || depth <= 0) {
    return ''
  }

  const max = Math.ceil(depth / 2)
  const messages = dependents.slice(0, max)
    .map(dep => explainDependency(name, dep, depth, color))

  // show just the names of the first 5 deps that overflowed the list
  if (dependents.length > max) {
    const names = dependents.slice(max).map(d => d.from.name)
    const showNames = names.slice(0, 5)
    if (showNames.length < names.length) {
      showNames.push('...')
    }
    const show = `(${showNames.join(', ')})`
    messages.push(`${names.length} more ${show}`)
  }

  const str = '\nfor: ' + messages.join('\nand: ')
  return str.split('\n').join('\n  ')
}

const explainDependency = (name, { type, from, spec }, depth, color) => {
  const { bold } = color ? chalk : nocolor
  return `${type} dependency ` +
    `${bold(name)}@"${bold(spec)}"\nfrom: ` +
    explainFrom(from, depth, color)
}

const explainFrom = (from, depth, color) => {
  if (!from.name && !from.version) {
    return 'the root project'
  }

  return printNode(from, color) +
    explainDependents(from, depth - 1, color)
}

// generate a full verbose report and tell the user how to fix it
const report = (expl, depth = 4) => {
  const fullReport = resolve(npm.cache, 'eresolve-report.txt')

  const orForce = expl.fixWithForce ? ' or --force' : ''
  const fix = `Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps${orForce}
to accept an incorrect (and potentially broken) dependency resolution.`

  writeFileSync(fullReport, `# npm resolution error report

${new Date().toISOString()}

${explainEresolve(expl, false, Infinity)}

${fix}

Raw JSON explanation object:

${JSON.stringify(expl, null, 2)}
`, 'utf8')

  return explainEresolve(expl, npm.color, depth) +
    `\n\n${fix}\n\nSee ${fullReport} for a full report.`
}

// the terser explain method for the warning when using --force
const explain = (expl, depth = 2) => explainEresolve(expl, npm.color, depth)

module.exports = {
  explain,
  report
}
