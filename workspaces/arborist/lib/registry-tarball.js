const npa = require('npm-package-arg')
const pacote = require('pacote')
const { pickRegistry } = require('npm-registry-fetch')
const { parse } = require('semver')

const exactVersion = value => {
  const version = parse(value)
  return version ? version.version +
    (version.build.length ? `+${version.build.join('.')}` : '') : null
}

// Keep registry evidence separate from serializable node/lockfile metadata.
const caches = new WeakMap()
const getCache = arb => {
  if (!caches.has(arb)) {
    caches.set(arb, { manifests: new Map(), packuments: new Map() })
  }
  return caches.get(arb)
}

const context = (spec, options) => {
  spec = spec.subSpec || spec
  const registry = pickRegistry(spec, options).replace(/\/+$/, '')
  const url = `${registry}/${spec.escapedName}`
  return { spec, url }
}

const tarballFromManifest = (name, version, manifest) =>
  manifest?.name === name && exactVersion(manifest.version) === version &&
  typeof manifest.dist?.tarball === 'string' ? manifest.dist.tarball : null

const manifestKey = (url, version, options = {}) => JSON.stringify([
  url, version, !!options.verifySignatures, !!options.verifyAttestations,
])

// Called only with manifests returned by pacote, never with node.package.
const rememberRegistryTarball = (arb, spec, manifest) => {
  if (!spec.registry) {
    return
  }
  const version = exactVersion(manifest.version)
  const { spec: target, url } = context(spec, arb.options)
  const tarball = tarballFromManifest(target.name, version, manifest)
  if (version && tarball) {
    // Resolution can use abbreviated metadata even with verifyAttestations.
    // Capture URL evidence only; explicit verification must use the full
    // metadata path below rather than inferring checks from Arborist options.
    getCache(arb).manifests.set(manifestKey(url, version), tarball)
  }
}

const loadPackument = async (arb, spec, url) => {
  const { packumentCache } = arb.options
  // Pacote distinguishes full/corgi responses, but either contains dist.tarball.
  for (const format of ['full', 'corgi']) {
    const key = `${format}:${url}`
    if (packumentCache?.has(key)) {
      return packumentCache.get(key)
    }
  }
  const options = {
    ...arb.options,
    before: null,
    fullMetadata: false,
  }
  try {
    return await pacote.packument(spec, options)
  } catch (error) {
    if (!options.offline || error.code !== 'ENOTCACHED') {
      throw error
    }
    // HTTP caches can vary on Accept. An offline install may have only the
    // full response cached by a previous resolution, not the corgi variant.
    return pacote.packument(spec, { ...options, fullMetadata: true })
  }
}

const getRegistryTarball = async (arb, packageName, lockedVersion) => {
  // A lockfile version is not a dependency spec: aliases, tags and ranges
  // must not redirect this lookup to another package or version.
  const version = exactVersion(lockedVersion)
  if (!version) {
    return null
  }
  const { spec, url } = context(npa(packageName), arb.options)
  const cache = getCache(arb)
  const key = manifestKey(url, version, arb.options)
  if (cache.manifests.has(key)) {
    return cache.manifests.get(key)
  }

  // Preserve explicit pacote verification options, which need more than
  // the abbreviated metadata used for URL verification alone.
  if (arb.options.verifySignatures || arb.options.verifyAttestations) {
    const request = pacote.manifest(npa.resolve(packageName, version), {
      ...arb.options,
      before: null,
      fullMetadata: true,
    }).then(manifest => tarballFromManifest(packageName, version, manifest)).catch(error => {
      cache.manifests.delete(key)
      throw error
    })
    cache.manifests.set(key, request)
    return request
  }

  if (!cache.packuments.has(url)) {
    const request = loadPackument(arb, spec, url).then(packument => {
      // Retain only URL evidence, including when the production packument
      // cache discards a large response or one without Content-Length.
      const tarballs = new Map()
      for (const [entryVersion, manifest] of Object.entries(packument.versions || {})) {
        const entry = exactVersion(entryVersion)
        const tarball = tarballFromManifest(packageName, entry, manifest)
        if (entry && tarball) {
          tarballs.set(entry, tarball)
        }
      }
      return tarballs
    }).catch(error => {
      cache.packuments.delete(url)
      throw error
    })
    // Unlike pacote's completed-response cache, this shares pending requests.
    cache.packuments.set(url, request)
  }
  const tarballs = await cache.packuments.get(url)
  return tarballs.get(version) || null
}

module.exports = { getRegistryTarball, rememberRegistryTarball }
