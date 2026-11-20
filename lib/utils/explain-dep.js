const { relative } = require('node:path')

const explainNode = (node, depth, chalk, seen = new Set(), expanded = new Set()) =>
  printNode(node, chalk) +
  explainDependents(node, depth, chalk, seen, expanded) +
  explainLinksIn(node, depth, chalk, seen, expanded)

const colorType = (type, chalk) => {
  const style = type === 'extraneous' ? chalk.red
    : type === 'dev' ? chalk.blue
    : type === 'optional' ? chalk.magenta
    : type === 'peer' ? chalk.magentaBright
    : type === 'bundled' ? chalk.underline.cyan
    : type === 'workspace' ? chalk.blueBright
    : type === 'overridden' ? chalk.dim
    : /* istanbul ignore next */ s => s
  return style(type)
}

const printNode = (node, chalk, deduped = false) => {
  const extra = []

  for (const meta of ['extraneous', 'dev', 'optional', 'peer', 'bundled', 'overridden']) {
    if (node[meta]) {
      extra.push(` ${colorType(meta, chalk)}`)
    }
  }

  if (deduped) {
    extra.push(` ${chalk.dim('deduped')}`)
  }

  const pkgid = node.isWorkspace
    ? chalk.blueBright(`${node.name}@${node.version}`)
    : `${node.name}@${node.version}`

  return `${pkgid}${extra.join('')}` +
    (node.location ? chalk.dim(`\n${node.location}`) : '')
}

const explainLinksIn = ({ linksIn }, depth, chalk, seen, expanded) => {
  if (!linksIn || !linksIn.length || depth <= 0) {
    return ''
  }

  const messages = linksIn.map(link => explainNode(link, depth - 1, chalk, seen, expanded))
  const str = '\n' + messages.join('\n')
  return str.split('\n').join('\n  ')
}

const explainDependents = ({ dependents }, depth, chalk, seen, expanded) => {
  if (!dependents || !dependents.length || depth <= 0) {
    return ''
  }

  const max = Math.ceil(depth / 2)
  const messages = dependents.slice(0, max)
    .map(edge => explainEdge(edge, depth, chalk, seen, expanded))

  // show just the names of the first 5 deps that overflowed the list
  if (dependents.length > max) {
    let len = 0
    const maxLen = 50
    const showNames = []
    for (let i = max; i < dependents.length; i++) {
      const { from: { name: depName = 'the root project' } } = dependents[i]
      len += depName.length
      if (len >= maxLen && i < dependents.length - 1) {
        showNames.push('...')
        break
      }
      showNames.push(depName)
    }
    const show = `(${showNames.join(', ')})`
    messages.push(`${dependents.length - max} more ${show}`)
  }

  const str = '\n' + messages.join('\n')
  return str.split('\n').join('\n  ')
}

const explainEdge = (
  { name, type, bundled, from, spec, rawSpec, overridden, packageExtensions, npmExtension },
  depth, chalk, seen = new Set(), expanded = new Set()
) => {
  let dep = type === 'workspace'
    ? chalk.bold(relative(from.location, spec.slice('file:'.length)))
    : `${name}@"${spec}"`
  if (overridden) {
    dep = `${colorType('overridden', chalk)} ${dep} (was "${rawSpec}")`
  }

  const fromMsg = ` from ${explainFrom(from, depth, chalk, seen, expanded)}`

  // note an edge created by a root packageExtensions repair
  const extMsg = packageExtensions
    ? chalk.dim(` (added by packageExtensions["${packageExtensions.selector}"].${packageExtensions.field}.${name})`)
    : ''

  // note an edge created or changed by a root .npm-extension repair
  const npmExtMsg = npmExtension
    ? chalk.dim(` (changed by .npm-extension ${npmExtension.extensionPoint} ${npmExtension.field}.${name})`)
    : ''

  return (type === 'prod' ? '' : `${colorType(type, chalk)} `) +
    (bundled ? `${colorType('bundled', chalk)} ` : '') +
    `${dep}${fromMsg}${extMsg}${npmExtMsg}`
}

const explainFrom = (from, depth, chalk, seen, expanded) => {
  if (!from.name && !from.version) {
    return 'the root project'
  }

  // Prevent infinite recursion from cycles in the dependency graph (e.g. linked strategy store nodes). Use stack-based tracking so diamond dependencies (same node reached via different paths) are still explained, but recursive cycles are broken.
  const nodeId = `${from.name}@${from.version}:${from.location}`
  if (seen.has(nodeId)) {
    return printNode(from, chalk)
  }

  // An unbounded report re-expanding shared ancestors on every path grows exponentially, so expand each node only once.
  if (depth === Infinity) {
    if (expanded.has(nodeId)) {
      return printNode(from, chalk, true)
    }
    expanded.add(nodeId)
  }

  seen.add(nodeId)

  const result = printNode(from, chalk) +
    explainDependents(from, depth - 1, chalk, seen, expanded) +
    explainLinksIn(from, depth - 1, chalk, seen, expanded)

  seen.delete(nodeId)
  return result
}

module.exports = { explainNode, printNode, explainEdge }
