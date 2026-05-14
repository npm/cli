const isScriptAllowed = require('@npmcli/arborist/lib/script-allowed.js')
const getInstallScripts = require('@npmcli/arborist/lib/install-scripts.js')

// Walks arb.actualTree.inventory and returns the list of dep nodes that
// have install-relevant lifecycle scripts and are not yet covered (or
// explicitly denied) by the allowScripts policy.
//
// Returns an array of `{ node, scripts }` entries. `scripts` is an object
// describing the relevant lifecycle scripts that would run.

const checkAllowScripts = async ({ arb, npm }) => {
  const ignoreScripts = !!arb.options?.ignoreScripts
  const dangerouslyAllowAll = !!npm?.flatOptions?.dangerouslyAllowAllScripts

  if (ignoreScripts || dangerouslyAllowAll) {
    return []
  }

  const tree = arb.actualTree
  if (!tree?.inventory) {
    return []
  }

  const policy = arb.options?.allowScripts || null

  const unreviewed = []
  for (const node of tree.inventory.values()) {
    if (node.isProjectRoot || node.isWorkspace) {
      continue
    }
    if (node.isLink) {
      // Linked workspace dependencies are managed by the workspace owner.
      continue
    }

    const verdict = isScriptAllowed(node, policy)
    if (verdict === true || verdict === false) {
      continue
    }

    const scripts = await getInstallScripts(node)
    if (Object.keys(scripts).length === 0) {
      continue
    }

    unreviewed.push({ node, scripts })
  }

  return unreviewed
}

module.exports = checkAllowScripts
