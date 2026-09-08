const {
  getTrustedRegistryIdentity,
  matches,
  resolvedSourceSpecs,
  trustedDisplay,
} = require('@npmcli/arborist/lib/script-allowed.js')

// Copy of isRegistryNode from arborist to check if a node is a registry dependency
// This is needed to determine if we can safely extract a package name
const isRegistryNode = (node) => {
  // arborist Node objects have an isRegistryDependency getter
  if (typeof node.isRegistryDependency === 'boolean') {
    return node.isRegistryDependency
  }
  // Fall back to URL parsing for nodes without the getter (e.g., test fixtures)
  if (!node.resolved) {
    return !!node.version
  }
  // Registry tarballs live at `<host>/<pkg-name>/-/<pkg-name>-<version>.tgz`
  // Strip query parameters and hash for matching
  const urlWithoutQuery = node.resolved.split('?')[0].split('#')[0]
  return /^https?:\/\/[^\/]+\/.+\/-\/[^\/]+-\d/.test(urlWithoutQuery)
}

// Extract package name from a registry URL, handling query parameters and auth
// This is similar to getTrustedRegistryIdentity but works even when the URL has query params
const extractPackageNameFromRegistryUrl = (url) => {
  // Strip query parameters and hash
  const cleanUrl = url.split('?')[0].split('#')[0]
  
  const { URL } = require('node:url')
  try {
    const u = new URL(cleanUrl)
    const parts = u.pathname.slice(1).split('/-/')
    if (parts.length >= 2) {
      // The part before /-/ is the package name (or scope/pkg-name)
      return parts[0]
    }
  } catch {
    // If URL parsing fails, try to extract from the path
  }
  
  // Fallback: try to extract from the path
  const match = cleanUrl.match(/\/([^\/]+)\/-\/[^\/]+-\d/)
  if (match) {
    return match[1]
  }
  
  return null
}

// Policy keys come straight from resolved sources, which carry characters
// the shell acts on: `#` in a git committish starts a comment, and `&`,
// `?` or spaces in a tarball URL break the command apart. Quote whenever
// the value is not plainly safe, so the suggestion can be pasted as-is.
const SHELL_SAFE = /^[\w@,./:-]+$/

const shellQuote = (value) =>
  SHELL_SAFE.test(value) ? value : `'${value.replace(/'/g, `'\\''`)}'`

// Characters that are unsafe in shell commands, even when quoted.
// `&` in cmd.exe runs the following text as a command.
// `|` pipes output.
// `>` and `<` redirect output/input.
// Query parameters (`?`) in URLs can contain these characters.
// We avoid suggesting copy-paste commands for URLs with these characters.
// Note: `#` is safe in cmd.exe (only starts comments in POSIX), so we allow it
// and rely on shellQuoting to handle it for POSIX shells.
const UNSAFE_FOR_SHELL = /[&|><\s?]/

// Check if a URL is a registry URL and extract the package name safely.
// For registry URLs with query parameters or auth, this extracts the
// package name without the sensitive parts.
const safeRegistryKey = (node) => {
  // If we already have a trusted identity, use it
  const trusted = getTrustedRegistryIdentity(node)
  if (trusted && trusted.name) {
    return trusted.name
  }

  // For registry URLs without trusted identity (e.g., due to query params),
  // try to extract the package name from the URL
  if (node.resolved && typeof node.resolved === 'string' && isRegistryNode(node)) {
    const pkgName = extractPackageNameFromRegistryUrl(node.resolved)
    if (pkgName) {
      return pkgName
    }
  }

  return null
}

// Check if a key is safe to include in a copy-paste shell command.
// Returns true if the key can be safely quoted and pasted into a shell.
// For non-registry deps with URLs containing unsafe characters, we return false
// to avoid suggesting commands that could execute arbitrary code when pasted.
const isSafeForShell = (key) => {
  // Registry package names are always safe (alphanumeric, hyphens, underscores, dots)
  // Git URLs, file paths, and tarball URLs may contain unsafe characters
  if (typeof key !== 'string' || key === '') {
    return false
  }

  // Check if it looks like a registry package name (no URL scheme)
  if (!key.includes('://') && !key.includes('/') && !UNSAFE_FOR_SHELL.test(key)) {
    return true
  }

  // For URLs, check if they contain characters that are unsafe even when quoted
  // Also check for commas, which break the comma-separated list parsing
  if (UNSAFE_FOR_SHELL.test(key) || key.includes(',')) {
    return false
  }

  return true
}

// The blocked-scripts summary shows a human-readable name, but the
// allowScripts policy only matches registry deps by name. git, file, remote
// and tarball deps are matched by their resolved source, so a suggestion
// built from display names would leave their scripts blocked. Verify each
// candidate against the node with the real matcher, so the key we hand the
// user is one the policy will actually accept.
//
// For registry deps, we prefer the package name (without version or URL)
// to avoid exposing credentials or query parameters in the suggestion.
// For non-registry deps, we use the resolved source, but only if it's safe
// for shell use (no characters that could be exploited in shell commands).
const policyKeyFor = (node) => {
  // Create a cleaned node for matching purposes (strip query params and hash)
  // This allows getTrustedRegistryIdentity to work even when the original
  // node.resolved contains query parameters with tokens
  const cleanNode = { ...node }
  if (node.resolved && typeof node.resolved === 'string') {
    cleanNode.resolved = node.resolved.split('?')[0].split('#')[0]
  }

  // Try to get the trusted identity from the cleaned node
  const trusted = getTrustedRegistryIdentity(cleanNode)
  if (trusted && trusted.name) {
    // For registry deps, verify that the package name matches
    // We use the cleaned node for matching to avoid issues with query params
    if (matches(cleanNode, trusted.name, false)) {
      return trusted.name
    }
  }

  // For registry URLs without trusted identity (e.g., due to unusual URL format),
  // try to extract the package name from the URL
  if (node.resolved && typeof node.resolved === 'string' && isRegistryNode(node)) {
    const pkgName = extractPackageNameFromRegistryUrl(node.resolved)
    if (pkgName) {
      // Verify with the cleaned node
      if (matches(cleanNode, pkgName, false)) {
        return pkgName
      }
    }
  }

  // For non-registry deps or fallback, try the original candidates
  const candidates = [node.resolved, ...resolvedSourceSpecs(node)]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate !== '' && matches(node, candidate, false)) {
      // Only return keys that are safe for shell use
      if (isSafeForShell(candidate)) {
        return candidate
      }
      // For registry nodes, also accept the candidate even if not shell-safe
      // (we already tried to get a safe version above)
      if (isRegistryNode(node)) {
        // Strip query params from registry URLs to avoid exposing tokens
        const cleaned = candidate.split('?')[0].split('#')[0]
        const pkgName = extractPackageNameFromRegistryUrl(cleaned)
        if (pkgName) {
          return pkgName
        }
        return cleaned
      }
      // For non-registry nodes with unsafe URLs (commas, &, etc.),
      // we cannot safely include them in a comma-separated list.
      // Return null to indicate this.
      return null
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
//
// Filter out null/undefined keys to avoid suggesting invalid entries
const configSetAllowScripts = (keys) =>
  `npm config set allow-scripts=${shellQuote(keys.filter(k => k).join(','))} --location=user`

// Builds the `--allow-scripts=<keys>` flag global users add to the install
// they just ran. Deliberately not a whole command: npm.argv holds
// positionals only, so a reconstructed `npm install -g <specs>` would drop
// flags like --registry and retry against the default registry while
// allowing that package's scripts to run. A spec-less
// `npm install -g --allow-scripts=<keys>` is no better: it installs the
// current directory and fails with ENOENT reading package.json.
const allowScriptsFlag = (keys) => `--allow-scripts=${shellQuote(keys.filter(k => k).join(','))}`

module.exports = { allowScriptsFlag, configSetAllowScripts, policyKeyFor }
