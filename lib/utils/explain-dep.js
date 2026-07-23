const { relative } = require('node:path')

// `c` is a colorizer with the signature `(format, text) => string`.
const explainNode = (node, depth, c, seen = new Set()) =>
  printNode(node, c) +
  explainDependents(node, depth, c, seen) +
  explainLinksIn(node, depth, c, seen)

const colorType = (type, c) => {
  const style = type === 'extraneous' ? s => c('red', s)
    : type === 'dev' ? s => c('blue', s)
    : type === 'optional' ? s => c('magenta', s)
    : type === 'peer' ? s => c('magentaBright', s)
    : type === 'bundled' ? s => c(['underline', 'cyan'], s)
    : type === 'workspace' ? s => c('blueBright', s)
    : type === 'overridden' ? s => c('dim', s)
    : /* istanbul ignore next */ s => s
  return style(type)
}

const printNode = (node, c) => {
  const extra = []

  for (const meta of ['extraneous', 'dev', 'optional', 'peer', 'bundled', 'overridden']) {
    if (node[meta]) {
      extra.push(` ${colorType(meta, c)}`)
    }
  }

  const pkgid = node.isWorkspace
    ? c('blueBright', `${node.name}@${node.version}`)
    : `${node.name}@${node.version}`

  return `${pkgid}${extra.join('')}` +
    (node.location ? c('dim', `\n${node.location}`) : '')
}

const explainLinksIn = ({ linksIn }, depth, c, seen) => {
  if (!linksIn || !linksIn.length || depth <= 0) {
    return ''
  }

  const messages = linksIn.map(link => explainNode(link, depth - 1, c, seen))
  const str = '\n' + messages.join('\n')
  return str.split('\n').join('\n  ')
}

const explainDependents = ({ dependents }, depth, c, seen) => {
  if (!dependents || !dependents.length || depth <= 0) {
    return ''
  }

  const max = Math.ceil(depth / 2)
  const messages = dependents.slice(0, max)
    .map(edge => explainEdge(edge, depth, c, seen))

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
  depth, c, seen = new Set()
) => {
  let dep = type === 'workspace'
    ? c('bold', relative(from.location, spec.slice('file:'.length)))
    : `${name}@"${spec}"`
  if (overridden) {
    dep = `${colorType('overridden', c)} ${dep} (was "${rawSpec}")`
  }

  const fromMsg = ` from ${explainFrom(from, depth, c, seen)}`

  // note an edge created by a root packageExtensions repair
  const extMsg = packageExtensions
    ? c('dim', ` (added by packageExtensions["${packageExtensions.selector}"].${packageExtensions.field}.${name})`)
    : ''

  // note an edge created or changed by a root .npm-extension repair
  const npmExtMsg = npmExtension
    ? c('dim', ` (changed by .npm-extension ${npmExtension.extensionPoint} ${npmExtension.field}.${name})`)
    : ''

  return (type === 'prod' ? '' : `${colorType(type, c)} `) +
    (bundled ? `${colorType('bundled', c)} ` : '') +
    `${dep}${fromMsg}${extMsg}${npmExtMsg}`
}

const explainFrom = (from, depth, c, seen) => {
  if (!from.name && !from.version) {
    return 'the root project'
  }

  // Prevent infinite recursion from cycles in the dependency graph (e.g. linked strategy store nodes). Use stack-based tracking so diamond dependencies (same node reached via different paths) are still explained, but recursive cycles are broken.
  const nodeId = `${from.name}@${from.version}:${from.location}`
  if (seen.has(nodeId)) {
    return printNode(from, c)
  }
  seen.add(nodeId)

  const result = printNode(from, c) +
    explainDependents(from, depth - 1, c, seen) +
    explainLinksIn(from, depth - 1, c, seen)

  seen.delete(nodeId)
  return result
}

module.exports = { explainNode, printNode, explainEdge }
