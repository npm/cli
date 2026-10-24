const hgi = require('hosted-git-info')
const npa = require('npm-package-arg')
const { pickRegistry } = require('npm-registry-fetch')

// Rewrite lockfile tarball URLs according to replace-registry-host.
const registryResolved = (resolved, options) => {
  try {
    const resolvedURL = hgi.parseUrl(resolved)
    const registryURL = new URL(options.registry)
    const registryPath = registryURL.pathname.replace(/\/$/, '')

    let matchURL = null
    try {
      matchURL = new URL(options.replaceRegistryHost)
    } catch {
      // keep matchURL null
    }

    const matchHost = matchURL?.hostname ?? options.replaceRegistryHost
    const matchPath = matchURL?.pathname.replace(/\/$/, '') ?? null
    const hasPathPrefix = (pathname, prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)

    const hostMatches = options.replaceRegistryHost === 'always' ||
      matchHost === resolvedURL.hostname
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
  if (!node.resolved || !node.isRegistryDependency) {
    return false
  }
  try {
    const resolvedURL = new URL(registryResolved(node.resolved, options))
    const registry = new URL(pickRegistry(npa(node.name), options))
    const registryPath = registry.pathname.replace(/\/?$/, '/')
    return resolvedURL.origin === registry.origin &&
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
