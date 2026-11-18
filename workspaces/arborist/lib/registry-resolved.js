const hgi = require('hosted-git-info')
const npa = require('npm-package-arg')
const { pickRegistry } = require('npm-registry-fetch')
const { getRegistryPackageNames } = require('./registry-package-name.js')

// Normalize a node's resolved tarball URL to the configured registry, honoring replace-registry-host.
// File/directory and Git sources are not registry tarball URLs and must stay unchanged.
// Return the input unchanged when replacement does not match, or undefined if the tarball or
// registry URL cannot be parsed.
const registryResolved = (resolved, options) => {
  try {
    if (['file', 'directory', 'git'].includes(npa(resolved).type)) {
      return resolved
    }
    const resolvedURL = hgi.parseUrl(resolved)
    const registryURL = new URL(options.registry)
    const registryPath = registryURL.pathname.replace(/\/$/, '')

    let matchURL = null
    try {
      matchURL = new URL(options.replaceRegistryHost)
    } catch {
      // keep matchURL null
    }

    const matchHost = matchURL?.host ?? options.replaceRegistryHost
    const matchPath = matchURL?.pathname.replace(/\/$/, '') ?? null
    const hasPathPrefix = (pathname, prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)

    const hostMatches = options.replaceRegistryHost === 'always' ||
      matchHost === (matchURL ? resolvedURL.host : resolvedURL.hostname)
    const pathMatches = !matchPath ||
      hasPathPrefix(resolvedURL.pathname, matchPath)

    if (!hostMatches || !pathMatches) {
      return resolved
    }

    resolvedURL.protocol = registryURL.protocol
    resolvedURL.hostname = registryURL.hostname
    resolvedURL.port = registryURL.port

    if (matchPath) {
      resolvedURL.pathname = registryPath +
        resolvedURL.pathname.slice(matchPath.length)
    } else if (registryPath &&
      !hasPathPrefix(resolvedURL.pathname, registryPath)) {
      resolvedURL.pathname = registryPath + resolvedURL.pathname
    }

    return resolvedURL.toString()
  } catch {
    return undefined
  }
}

// Only bypass allow-remote when the effective URL is inside the registry path.
const isRegistryResolvedTarball = (node, options) => {
  if (!node.resolved) {
    return false
  }
  const names = getRegistryPackageNames(node)
  if (!names) {
    return false
  }
  try {
    const resolvedURL = new URL(registryResolved(node.resolved, options))
    const registries = [...names].map(name => new URL(pickRegistry(npa(name), options)))
    const registry = registries[0]
    const registryPath = registry.pathname.replace(/\/?$/, '/')
    return registries.every(candidate =>
      candidate.origin === registry.origin &&
      candidate.pathname.replace(/\/?$/, '/') === registryPath
    ) &&
      resolvedURL.origin === registry.origin &&
      (registryPath === '/' ||
        resolvedURL.pathname.startsWith(registryPath))
  } catch {
    return false
  }
}

module.exports = {
  isRegistryResolvedTarball,
  registryResolved,
}
