const reifyOutput = require('./reify-output.js')
const checkAllowScripts = require('./check-allow-scripts.js')
const warnWorkspaceAllowScripts = require('./warn-workspace-allow-scripts.js')
const ini = require('ini')
const { writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')

// Collect the set of node locations that reify will build. Most build
// candidates are added or changed diff nodes, but reify also rebuilds directly
// managed links in diff.unchanged (see Arborist's _build()). For links, the
// build candidate is the target node returned by checkAllowScripts, not only
// the link location in the diff.
const collectBuildCandidateLocations = (diff) => {
  const touched = new Set()
  if (!diff) {
    return null
  }
  const stack = [diff]
  while (stack.length) {
    const d = stack.pop()
    if (d.action === 'ADD' || d.action === 'CHANGE') {
      const ideal = d.ideal
      for (const location of [ideal?.location, ideal?.target?.location]) {
        if (location != null) {
          touched.add(location)
        }
      }
    }
    if (d.children?.length) {
      for (const child of d.children) {
        if (child) {
          stack.push(child)
        }
      }
    }
  }
  for (const node of diff.unchanged || []) {
    const root = node?.root?.target
    const linkedFromRoot = node?.isLink &&
      ((node.parent === root && !node.inert) || node.target?.fsTop === root)
    if (linkedFromRoot) {
      for (const location of [node.location, node.target?.location]) {
        if (location != null) {
          touched.add(location)
        }
      }
    }
  }
  return touched
}

const reifyFinish = async (npm, arb) => {
  // if we are using a builtin config, and just installed npm as a top-level global package, we have to preserve that config.
  if (arb.options.global) {
    const npmNode = arb.actualTree.inventory.get('node_modules/npm')
    if (npmNode) {
      const builtinConf = npm.config.data.get('builtin')
      if (!builtinConf.loadError) {
        const content = ini.stringify(builtinConf.raw).trim() + '\n'
        await writeFile(resolve(npmNode.path, 'npmrc'), content)
      }
    }
  }
  warnWorkspaceAllowScripts(arb.actualTree)
  const allUnreviewed = await checkAllowScripts({ arb, npm })
  // Only warn about install scripts on packages this reify actually touched;
  // untouched pre-existing packages don't run scripts here (npm/cli#9797).
  const touched = collectBuildCandidateLocations(arb.diff)
  const unreviewedScripts = touched
    ? allUnreviewed.filter(({ node }) => touched.has(node.location))
    : allUnreviewed
  reifyOutput(npm, arb, { unreviewedScripts })
}

module.exports = reifyFinish
