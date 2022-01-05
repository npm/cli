const npa = require('npm-package-arg')

function overrideResolves (node, resolved, opts = {}) {
  const {
    omitLockfileRegistryResolved = false,
    recordDefaultRegistry = false,
  } = opts

  const isRegistryDependency = node.isRegistryDependency

  // omit the resolved url of registry dependencies. this makes installs slower
  // because npm must resolve the url for each package version but it allows
  // users to use a lockfile across registries that host tarballs at different
  // paths.
  if (isRegistryDependency && omitLockfileRegistryResolved) {
    return undefined
  }

  // replace the configured registry with the default registry. the default
  // registry is a magic value meaning the current registry, so recording
  // resolved with the default registry allows users to switch to a
  // different registry without removing their lockfile. The path portion
  // of the resolved url is preserved so this trick only works when the
  // different registries host tarballs at the same relative paths.
  if (isRegistryDependency && recordDefaultRegistry) {
    const scope = npa(node.packageName).scope
    const registry = scope && opts[`${scope}:registry`]
      ? opts[`${scope}:registry`]
      : opts.registry

    // normalize registry url - strip trailing slash.
    // TODO improve normalization for both the configured registry and resolved
    // url. consider port, protocol, more path normalization.
    const normalized = registry.endsWith('/')
      ? registry.slice(0, -1)
      : registry

    // only replace the host if the resolved url is for the configured
    // registry. registries may host tarballs on another server. return
    // undefined so npm will re-resolve the url from the current registry when
    // it reads the lockfile.
    if (resolved.startsWith(normalized)) {
      return 'https://registry.npmjs.org' + resolved.slice(normalized.length)
    } else {
      return undefined
    }
  }

  return resolved
}

module.exports = { overrideResolves }
