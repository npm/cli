const {
  getTrustedRegistryIdentity,
  matches,
  resolvedSourceSpecs,
  trustedDisplay,
} = require('@npmcli/arborist/lib/script-allowed.js')

// Policy keys come straight from resolved sources, which carry characters
// the shell acts on: `#` in a git committish starts a comment, and `&`,
// `?` or spaces in a tarball URL break the command apart. Quote whenever
// the value is not plainly safe, so the suggestion can be pasted as-is.
const SHELL_SAFE = /^[\w@,./:-]+$/

const shellQuote = (value) =>
  SHELL_SAFE.test(value) ? value : `'${value.replace(/'/g, `'\\''`)}'`

// The blocked-scripts summary shows a human-readable name, but the
// allowScripts policy only matches registry deps by name. git, file, remote
// and tarball deps are matched by their resolved source, so a suggestion
// built from display names would leave their scripts blocked. Verify each
// candidate against the node with the real matcher, so the key we hand the
// user is one the policy will actually accept.
const policyKeyFor = (node) => {
  const trusted = getTrustedRegistryIdentity(node)
  const candidates = [trusted && trusted.name, node.resolved, ...resolvedSourceSpecs(node)]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate !== '' && matches(node, candidate, false)) {
      return candidate
    }
  }
  /* istanbul ignore next: defensive fallback for nodes without name */
  return trustedDisplay(node).name || '<unknown>'
}

// Builds the `npm config set allow-scripts` command suggested to global
// users, who have no project package.json for `npm approve-scripts` to
// write to. `--location=user` keeps the setting in the user .npmrc instead
// of trying (and, for global installs, failing) to write it to the local
// project config.
const configSetAllowScripts = (keys) =>
  `npm config set allow-scripts=${shellQuote(keys.join(','))} --location=user`

// Builds the `--allow-scripts=<keys>` flag global users add to the install
// they just ran. Deliberately not a whole command: npm.argv holds
// positionals only, so a reconstructed `npm install -g <specs>` would drop
// flags like --registry and retry against the default registry while
// allowing that package's scripts to run. A spec-less
// `npm install -g --allow-scripts=<keys>` is no better: it installs the
// current directory and fails with ENOENT reading package.json.
const allowScriptsFlag = (keys) => `--allow-scripts=${shellQuote(keys.join(','))}`

module.exports = { allowScriptsFlag, configSetAllowScripts, policyKeyFor }
