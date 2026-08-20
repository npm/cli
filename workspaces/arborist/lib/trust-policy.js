
const npa = require('npm-package-arg')
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
      `but this version has ${trustLabel(currentEvidence)}. ` +
      `If this downgrade is expected, add "${name}@${version}" to trust-policy-exclude.`
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

module.exports = {
  checkTrustDowngrade,
  getTrustEvidence,
  isTrustPolicyExcluded,
}
