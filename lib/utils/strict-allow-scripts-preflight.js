const checkAllowScripts = require('./check-allow-scripts.js')
const { trustedDisplay } = require('@npmcli/arborist/lib/script-allowed.js')
const { strictAllowScriptsError } = require('@npmcli/arborist/lib/unreviewed-scripts.js')
const { configSetAllowScripts } = require('./allow-scripts-remediation.js')

// Pre-flight check for `--strict-allow-scripts`. Call after arborist has
// been constructed but before `arb.reify()` runs, so that install scripts
// never execute when strict mode would block them.
//
// Behaviour:
//   - No-op unless `npm.flatOptions.strictAllowScripts` is set.
//   - Bypassed by `--dangerously-allow-all-scripts` and `--ignore-scripts`
//     (the per-flag short-circuits already live in checkAllowScripts).
//   - Builds the ideal tree (idempotent — subsequent reify reuses it),
//     walks it for nodes whose install scripts have not been covered by
//     the `allowScripts` policy, and throws if any are found.
const strictAllowScriptsPreflight = async ({ arb, npm, idealTreeOpts }) => {
  if (!npm?.flatOptions?.strictAllowScripts) {
    return
  }

  // Prefer the idealTree when reify is about to run; fall back to
  // actualTree for npm rebuild (which never builds an ideal tree).
  let tree
  if (idealTreeOpts !== undefined) {
    // `npm ci` builds the ideal tree before calling the preflight, so
    // skip the rebuild when one already exists. `npm install` calls the
    // preflight before reify and needs us to build.
    if (!arb.idealTree) {
      await arb.buildIdealTree(idealTreeOpts)
    }
    tree = arb.idealTree
  } else {
    tree = arb.actualTree
  }

  const unreviewed = await checkAllowScripts({ arb, npm, tree })
  if (unreviewed.length === 0) {
    return
  }

  // `npm approve-scripts` / `npm deny-scripts` write to a project
  // package.json, which doesn't exist for global installs. Point global
  // users at the `--allow-scripts` flag and `npm config set allow-scripts`,
  // which both work for global installs. Use the trusted display identity
  // so the suggested `npm config set` value matches what the policy matches
  // on, not the tarball's self-reported name.
  const names = unreviewed.map(({ node }) => trustedDisplay(node).name)
  const remediation = npm.global
    ? 'Allow them with `--allow-scripts`, persist them with ' +
      `\`${configSetAllowScripts(names)}\`, or bypass this ` +
      'check with `--dangerously-allow-all-scripts`.'
    : 'Approve them with `npm approve-scripts`, deny them with ' +
      '`npm deny-scripts`, or bypass this check with ' +
      '`--dangerously-allow-all-scripts`.'

  // Build via the shared arborist helper so the thrown error carries the
  // structured dependency `explanation` (one node.explain() per unreviewed
  // package). This lets the CLI show *which path* pulled each package in —
  // removing that path is how a user avoids the prompt. The message produced
  // here is identical to the inline form this previously threw.
  throw strictAllowScriptsError(unreviewed, { remediation })
}

module.exports = strictAllowScriptsPreflight
