const reifyOutput = require('./reify-output.js')
const checkAllowScripts = require('./check-allow-scripts.js')
const warnWorkspaceAllowScripts = require('./warn-workspace-allow-scripts.js')
const ini = require('ini')
const { writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')

// Collect the set of node locations touched (added or changed) by this reify
// run, using arb.diff. Pre-existing untouched packages don't run their install
// scripts this run, so we shouldn't flag them as "blocked" (npm/cli#9797).
const collectTouchedLocations = (diff) => {
  const touched = new Set()
  if (!diff) {
    return null
  }
  const stack = [diff]
  while (stack.length) {
    const d = stack.pop()
    if (d.action === 'ADD' || d.action === 'CHANGE') {
      const location = d.ideal?.location
      if (location != null) {
        touched.add(location)
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
  const touched = collectTouchedLocations(arb.diff)
  const unreviewedScripts = touched
    ? allUnreviewed.filter(({ node }) => touched.has(node.location))
    : allUnreviewed
  reifyOutput(npm, arb, { unreviewedScripts })
}

module.exports = reifyFinish
