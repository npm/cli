// Formats the structured dependency `explanation` attached to install errors
// (ETARGET, EALLOWREMOTE/EALLOWGIT, tarball/network, EINCOMPLETEMANIFEST,
// EBADENGINE, EBADPLATFORM, ESTRICTALLOWSCRIPTS) into a human-readable
// "why is this package here" report. Mirrors explain-eresolve.js and reuses
// the same `npm explain` formatters.
//
// Arborist attaches one of two shapes to `er.explanation`:
//   - an edge-explanation object (from `edge.explain()`) describing the single
//     dependency request that failed to resolve/fetch, or
//   - a node-explanation object (or array of them, from `node.explain()`) for
//     a package that resolved but is unusable/flagged (bad platform/engine,
//     unreviewed install scripts).
const { explainEdge, explainNode } = require('./explain-dep.js')

// Normalize `er.explanation` (single object, array, or nothing) to a list.
const toList = (expl) => Array.isArray(expl) ? expl : expl ? [expl] : []

// An edge-explanation carries a top-level `spec`; a node-explanation does not.
const explainOne = (expl, depth, chalk) =>
  'spec' in expl
    ? explainEdge(expl, depth, chalk)
    : explainNode(expl, depth, chalk)

const explain = (expl, chalk, depth) =>
  toList(expl).map(e => explainOne(e, depth, chalk)).join('\n\n')

// Generate a depth-limited explanation for the terminal plus a full
// (depth=Infinity) report written to the logs folder, just like ERESOLVE.
const report = (er, chalk, noColorChalk) => {
  const list = toList(er.explanation)
  if (!list.length) {
    return { explanation: '', file: '' }
  }
  // Edge-shaped explanations are genuine resolution failures; node-shaped ones
  // describe a package that resolved but is unusable, where the actionable
  // context is "why is it here" (removing that path avoids the error).
  const heading = 'spec' in list[0]
    ? 'Could not resolve dependency:'
    : list.length > 1
      ? 'These packages are installed because:'
      : 'This package is installed because:'
  return {
    explanation: `${heading}\n${explain(er.explanation, chalk, 4)}`,
    file: `# npm ${er.code} error report\n\n${heading}\n${explain(er.explanation, noColorChalk, Infinity)}`,
  }
}

module.exports = {
  explain,
  report,
}
