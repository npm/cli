
const npa = require('npm-package-arg')
const pacote = require('pacote')
const { pickRegistry } = require('npm-registry-fetch')
const semver = require('semver')

const TRUST_RANK = {
  none: 0,
  provenance: 1,
  trustedPublisher: 2,
}

const trustLabel = evidence => evidence === 'trustedPublisher'
  ? 'trusted publisher provenance'
  : evidence === 'provenance'
    ? 'provenance attestation'
    : 'no trust evidence'

const getTrustEvidence = manifest => {
  const provenance = manifest?.dist?.attestations?.provenance
  if (manifest?._npmUser?.trustedPublisher && provenance) {
    return 'trustedPublisher'
  }
  if (provenance) {
    return 'provenance'
  }
  return 'none'
}

const isTrustPolicyExcluded = (entries, name, version) => {
  for (const entry of entries || []) {
    let spec
    try {
      spec = npa(entry)
    } catch {
      continue
    }

    if (spec.name !== name) {
      continue
    }

    if (spec.raw === spec.name || spec.rawSpec === '*') {
      return true
    }

    if (spec.type === 'version' && spec.fetchSpec === version) {
      return true
    }

    if (spec.type === 'range' && semver.satisfies(version, spec.fetchSpec)) {
      return true
    }
  }
  return false
}

const metadataError = (name, version, message) => Object.assign(
  new Error(`Unable to enforce trust policy for ${name}@${version}: ${message}`),
  {
    code: 'ETRUSTPOLICYMETADATA',
    package: name,
    version,
  }
)

const checkTrustDowngrade = (packument, version, {
  exclude = [],
  ignoreAfter = null,
  now = Date.now(),
} = {}) => {
  const name = packument?.name
  if (!name || !packument?.versions?.[version]) {
    throw metadataError(name || '<unknown>', version, 'version metadata is missing')
  }

  if (isTrustPolicyExcluded(exclude, name, version)) {
    return
  }

  const published = packument.time?.[version]
  const publishedAt = published && Date.parse(published)
  if (!Number.isFinite(publishedAt)) {
    throw metadataError(name, version, 'publish time is missing or invalid')
  }

  if (ignoreAfter != null && Number.isFinite(ignoreAfter) && ignoreAfter > 0) {
    const ageMinutes = (now - publishedAt) / 60000
    if (ageMinutes > ignoreAfter) {
      return
    }
  }

  const current = packument.versions[version]
  const currentEvidence = getTrustEvidence(current)
  const currentIsPrerelease = Boolean(semver.prerelease(version))
  let strongestPriorEvidence = 'none'

  for (const [priorVersion, priorManifest] of Object.entries(packument.versions)) {
    if (priorVersion === version) {
      continue
    }

    if (!currentIsPrerelease && semver.prerelease(priorVersion)) {
      continue
    }

    const priorPublished = packument.time?.[priorVersion]
    const priorPublishedAt = priorPublished && Date.parse(priorPublished)
    if (!Number.isFinite(priorPublishedAt) || priorPublishedAt >= publishedAt) {
      continue
    }

    const priorEvidence = getTrustEvidence(priorManifest)
    if (TRUST_RANK[priorEvidence] > TRUST_RANK[strongestPriorEvidence]) {
      strongestPriorEvidence = priorEvidence
    }
  }

  if (TRUST_RANK[strongestPriorEvidence] <= TRUST_RANK[currentEvidence]) {
    return
  }

  throw Object.assign(
    new Error(
      `High-risk trust downgrade for "${name}@${version}" (possible package takeover): ` +
      `earlier versions had ${trustLabel(strongestPriorEvidence)}, ` +
      `but this version has ${trustLabel(currentEvidence)}.`
    ),
    {
      code: 'ETRUSTDOWNGRADE',
      package: name,
      version,
      previousTrust: strongestPriorEvidence,
      currentTrust: currentEvidence,
    }
  )
}

const registrySpecForNode = (node, options) => {
  if (!node || node.isRoot || node.isWorkspace || node.isLink) {
    return null
  }

  const name = node.packageName || node.package?.name
  const version = node.version || node.package?.version
  if (!name || !semver.valid(version)) {
    return null
  }

  const spec = npa.resolve(name, version, node.path || options.path || process.cwd())
  const registry = pickRegistry(spec, options)

  // A direct URL or git dependency can still report a package name and semver
  // after its manifest is loaded. Only apply registry trust policy when the
  // locked/resolved artifact comes from the selected registry origin. A
  // missing resolved URL is treated as a normal registry dependency because
  // npm can reconstruct registry tarball URLs from name + version.
  if (node.resolved) {
    let resolvedUrl
    let registryUrl
    try {
      resolvedUrl = new URL(node.resolved)
      registryUrl = new URL(registry)
    } catch {
      return null
    }
    if (resolvedUrl.origin !== registryUrl.origin) {
      return null
    }
  }

  return { spec, registry }
}

const verifyTrustPolicy = async (tree, options = {}) => {
  if (options.trustPolicy !== 'no-downgrade' || !tree?.inventory) {
    return
  }

  const exclude = options.trustPolicyExclude || []
  const ignoreAfter = options.trustPolicyIgnoreAfter ?? null
  const checks = []
  const seen = new Set()

  for (const node of tree.inventory.values()) {
    const registryInfo = registrySpecForNode(node, options)
    if (!registryInfo) {
      continue
    }

    const name = node.packageName || node.package.name
    const version = node.version || node.package.version
    if (isTrustPolicyExcluded(exclude, name, version)) {
      continue
    }

    const key = `${registryInfo.registry}\n${name}@${version}`
    if (seen.has(key)) {
      continue
    }
    seen.add(key)

    checks.push(async () => {
      const packument = await pacote.packument(registryInfo.spec, {
        ...options,
        fullMetadata: true,
      })
      checkTrustDowngrade(packument, version, {
        exclude,
        ignoreAfter,
      })
    })
  }

  // Keep metadata lookup concurrency bounded. Large applications routinely
  // contain hundreds or thousands of inventory nodes, while packumentCache
  // still deduplicates repeated package metadata within one Arborist run.
  const concurrency = 20
  for (let index = 0; index < checks.length; index += concurrency) {
    await Promise.all(checks.slice(index, index + concurrency).map(check => check()))
  }
}

module.exports = {
  checkTrustDowngrade,
  getTrustEvidence,
  isTrustPolicyExcluded,
  registrySpecForNode,
  verifyTrustPolicy,
}
