// Shared by reify.js (#extractOrLink) and build-ideal-tree.js (the
// --complete/--dry-run "crack open" path): both hand pacote a `name@URL` or
// bare URL spec for a registry-hosted tarball. pacote's npa re-parses that
// as spec.type === 'remote', so without an override the allow-remote gate
// would mis-fire on every registry tarball (both allowRemote=none and
// allowRemote=root). isRegistryResolvedTarball() tells the caller when it is
// safe to pass `allowRemote: 'all'` to bypass that false positive.
const hgi = require('hosted-git-info')
const npa = require('npm-package-arg')
const { pickRegistry } = require('npm-registry-fetch')

// the default registry url is a magic value meaning "the currently
// configured registry".
// `resolved` must never be falsey.
//
// XXX: use a magic string that isn't also a valid value, like
// ${REGISTRY} or something.  This has to be threaded through the
// Shrinkwrap and Node classes carefully, so for now, just treat
// the default reg as the magical animal that it has been.
const registryResolved = (resolved, arb) => {
  try {
    const resolvedURL = hgi.parseUrl(resolved)
    const registryURL = new URL(arb.registry)
    const registryPath = registryURL.pathname.replace(/\/$/, '')

    let matchURL = null
    try {
      matchURL = new URL(arb.options.replaceRegistryHost)
    } catch {
      // keep matchURL null
    }

    const matchHost = matchURL?.hostname ?? arb.options.replaceRegistryHost
    const matchPath = matchURL?.pathname.replace(/\/$/, '') ?? null
    const hasPathPrefix = (pathname, prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)

    const hostMatches = arb.options.replaceRegistryHost === 'always' || matchHost === resolvedURL.hostname
    const pathMatches = !matchPath || hasPathPrefix(resolvedURL.pathname, matchPath)

    if (!hostMatches || !pathMatches) {
      return resolved
    }

    resolvedURL.protocol = registryURL.protocol
    resolvedURL.hostname = registryURL.hostname
    resolvedURL.port = registryURL.port

    if (matchPath) {
      // full-URL prefix: swap old path prefix for the registry path
      resolvedURL.pathname = registryPath + resolvedURL.pathname.slice(matchPath.length)
    } else if (registryPath && !hasPathPrefix(resolvedURL.pathname, registryPath)) {
      // host-only: prepend registry path if not already present
      resolvedURL.pathname = registryPath + resolvedURL.pathname
    }

    return resolvedURL.toString()
  } catch {
    // if we could not parse the url at all then returning nothing
    // here means it will get removed from the tree in the next step
    return undefined
  }
}

// Returns true only when we are confident this is a registry-mediated
// install, i.e. it is safe to pass `allowRemote: 'all'` to pacote.
const isRegistryResolvedTarball = (node, arb) => {
  if (!node.resolved || !node.isRegistryDependency) {
    return false
  }
  try {
    // Match the effective fetch URL, not the raw lockfile value.
    // registryResolved() applies replace-registry-host, rewriting a public-registry pin to the configured proxy/mirror so it matches.
    const resolvedURL = new URL(registryResolved(node.resolved, arb))
    // pickRegistry only consults spec.scope, so a bare-name (tag) parse is sufficient and avoids a node.version dependency.
    const registry = new URL(pickRegistry(npa(node.name), arb.options))
    const registryPath = registry.pathname.replace(/\/?$/, '/')
    return resolvedURL.origin === registry.origin &&
      (registryPath === '/' || resolvedURL.pathname.startsWith(registryPath))
  } catch {
    return false
  }
}

module.exports = { registryResolved, isRegistryResolvedTarball }
