// Mirrors the semantics used by @npmcli/arborist so `npx` honors
// `min-release-age-exclude` the same way `npm install` does.
//
// When the config layer sets `flatOptions.before` from `min-release-age`,
// pacote will refuse to resolve versions published after that cutoff.
// pacote itself has no notion of `min-release-age-exclude`; arborist
// applies it per-spec by dropping `before` for matched names. libnpmexec
// calls `pacote.manifest` directly, so it has to do the same.
//
// Patterns are exact names or minimatch globs against the resolved
// package name. Only the named package is exempt; its own dependencies
// still follow the release-age policy unless they also match a pattern.
const { minimatch } = require('minimatch')

// Match arborist's hardened option set: `nonegate` keeps a leading `!`
// literal so a stray `!foo` exempts nothing instead of everything-but-foo,
// `nocomment` keeps `#` literal, and `noext` disables extglobs. This list
// only ever widens the exemption, so we never want a pattern feature to
// silently turn into match-all.
const minimatchOptions = { nonegate: true, nocomment: true, noext: true }

const isReleaseAgeExcluded = (name, patterns) => {
  if (!name || !Array.isArray(patterns) || patterns.length === 0) {
    return false
  }
  return patterns.some(pattern =>
    name === pattern || minimatch(name, pattern, minimatchOptions))
}

// For `npm:` aliases the fetched package is the alias target, not the
// alias key, so the exemption must be keyed on the underlying name.
// Mirrors `trustedSpecName` in arborist's release-age-exclude.js.
const trustedSpecName = (spec) => {
  if (!spec) {
    return undefined
  }
  if (spec.type === 'alias' && spec.subSpec && spec.subSpec.registry) {
    return spec.subSpec.name
  }
  return spec.name
}

// Return a shallow copy of `flatOptions` with `before` cleared when the
// spec's trusted name matches an exclude pattern. Non-mutating so shared
// option objects aren't clobbered for later, unrelated specs.
const applyReleaseAgeExclude = (spec, flatOptions) => {
  if (!flatOptions || flatOptions.before == null) {
    return flatOptions
  }
  if (!isReleaseAgeExcluded(trustedSpecName(spec), flatOptions.minReleaseAgeExclude)) {
    return flatOptions
  }
  return { ...flatOptions, before: null }
}

module.exports = { isReleaseAgeExcluded, trustedSpecName, applyReleaseAgeExclude }
