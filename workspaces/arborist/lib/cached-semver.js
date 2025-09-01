const semver = require('semver')

const MAX_CACHE_SIZE = 1000

// Simple LRU cache implementation using Map's insertion order
class LRUCache {
  constructor (maxSize) {
    this.maxSize = maxSize
    this.cache = new Map()
  }

  get (key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return undefined
  }

  set (key, value) {
    /* istanbul ignore if - cache update path not reachable with current implementation */
    if (this.cache.has(key)) {
      // Update existing - move to end
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first entry)
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  /* istanbul ignore next - method never called by current implementation */
  has (key) {
    return this.cache.has(key)
  }

  /* istanbul ignore next - method never called by current implementation */
  get size () {
    return this.cache.size
  }
}

const versionCache = new LRUCache(MAX_CACHE_SIZE)
const rangeCache = new LRUCache(MAX_CACHE_SIZE)
const versionCacheClean = new LRUCache(MAX_CACHE_SIZE)

function createCacheKey (input, options) {
  const keys = Object.keys(options)
  if (keys.length === 0) {
    return input
  }
  return `${input}|${JSON.stringify(options, keys.sort())}`
}

function parseVersion (version) {
  if (typeof version !== 'string') {
    return null
  }

  const cached = versionCache.get(version)
  if (cached !== undefined) {
    return cached
  }

  const parsed = semver.parse(version)
  versionCache.set(version, parsed)

  return parsed
}

function parseRange (range, options) {
  /* istanbul ignore if - non-string inputs filtered at higher levels */
  if (typeof range !== 'string') {
    return null
  }

  const cacheKey = createCacheKey(range, options)

  const cached = rangeCache.get(cacheKey)
  if (cached !== undefined) {
    return cached
  }

  let parsed
  try {
    parsed = new semver.Range(range, options)
  } catch (err) {
    parsed = null
  }

  rangeCache.set(cacheKey, parsed)

  return parsed
}

function satisfies (version, range, options = {}) {
  // For any non-string inputs, delegate to original semver to maintain exact behavior
  if (typeof version !== 'string' || typeof range !== 'string') {
    return semver.satisfies(version, range, options)
  }

  if (range === version) {
    return true
  }

  const parsedVersion = parseVersion(version)
  if (!parsedVersion) {
    return false
  }

  const parsedRange = parseRange(range, options)
  if (!parsedRange) {
    return false
  }

  try {
    return parsedRange.test(parsedVersion)
  } catch (err) {
    /* istanbul ignore next - defensive programming, semver rarely throws */
    return false
  }
}

function intersects (range1, range2, options = {}) {
  // For any non-string inputs, delegate to original semver to maintain exact behavior
  if (typeof range1 !== 'string' || typeof range2 !== 'string') {
    return semver.intersects(range1, range2, options)
  }

  if (range1 === range2) {
    return true
  }
  if (range1 === '*' || range2 === '*') {
    return true
  }

  const parsedRange1 = parseRange(range1, options)
  const parsedRange2 = parseRange(range2, options)

  if (!parsedRange1 || !parsedRange2) {
    return false
  }

  try {
    return parsedRange1.intersects(parsedRange2)
  } catch (err) {
    /* istanbul ignore next - defensive programming, semver rarely throws */
    return false
  }
}

function valid (version) {
  if (typeof version !== 'string') {
    return null
  }

  const parsed = parseVersion(version)
  return parsed ? parsed.version : null
}

function validRange (range, options = {}) {
  if (typeof range !== 'string') {
    return null
  }

  const parsed = parseRange(range, options)
  if (!parsed) {
    return null
  }

  // Handle special case: semver.validRange("*") returns "*", not ""
  if (range === '*' || range === '') {
    return '*'
  }

  return parsed.range
}

function clean (version, options = {}) {
  if (typeof version !== 'string') {
    return null
  }

  const cacheKey = createCacheKey(version, options)

  const cached = versionCacheClean.get(cacheKey)
  if (cached !== undefined) {
    return cached
  }

  const result = semver.clean(version, options)
  versionCacheClean.set(cacheKey, result)

  return result
}

module.exports = {
  // Start with all semver functions
  ...semver,

  // Override with cached implementations
  satisfies,
  intersects,
  valid,
  validRange,
  clean,
  parse: parseVersion,
}
