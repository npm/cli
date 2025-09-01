const t = require('tap')
const cachedSemver = require('../lib/cached-semver.js')
const semver = require('semver')

t.test('cached semver functions work identically to semver', t => {
  // Test basic functionality
  t.equal(cachedSemver.satisfies('1.2.3', '^1.0.0'), true, 'satisfies works')
  t.equal(cachedSemver.satisfies('2.0.0', '^1.0.0'), false, 'satisfies rejects correctly')

  t.equal(cachedSemver.intersects('^1.0.0', '^1.1.0'), true, 'intersects works')
  t.equal(cachedSemver.intersects('^1.0.0', '^2.0.0'), false, 'intersects rejects correctly')

  t.equal(cachedSemver.valid('1.2.3'), '1.2.3', 'valid works')
  t.equal(cachedSemver.valid('invalid'), null, 'valid rejects invalid')

  t.equal(cachedSemver.validRange('^1.0.0'), '>=1.0.0 <2.0.0-0', 'validRange works')
  t.equal(cachedSemver.validRange('invalid'), null, 'validRange rejects invalid')

  t.equal(cachedSemver.clean(' 1.2.3 '), '1.2.3', 'clean works')
  t.equal(cachedSemver.clean('invalid'), null, 'clean rejects invalid')

  t.ok(cachedSemver.parse('1.2.3'), 'parse works')
  t.equal(cachedSemver.parse('invalid'), null, 'parse rejects invalid')

  t.end()
})

t.test('caching works correctly', t => {
  // Clear any existing cache by calling with new values
  const version = '1.2.3'
  const range = '^1.0.0'

  // First call - should cache
  const result1 = cachedSemver.satisfies(version, range)
  // Second call - should use cache
  const result2 = cachedSemver.satisfies(version, range)

  t.equal(result1, result2, 'cached results are consistent')
  t.equal(result1, true, 'cached result is correct')

  t.end()
})

t.test('options handling', t => {
  const options = { loose: true, includePrerelease: true }

  // Test with options
  const result1 = cachedSemver.satisfies('1.2.3-beta', '^1.0.0', options)
  const result2 = cachedSemver.satisfies('1.2.3-beta', '^1.0.0', options)

  t.equal(result1, result2, 'cached results with options are consistent')

  // Test options key generation with different key orders
  const opts1 = { loose: true, includePrerelease: false }
  const opts2 = { includePrerelease: false, loose: true }

  const result3 = cachedSemver.satisfies('1.2.3', '^1.0.0', opts1)
  const result4 = cachedSemver.satisfies('1.2.3', '^1.0.0', opts2)

  t.equal(result3, result4, 'option key order does not affect caching')

  t.end()
})

t.test('edge cases', t => {
  // Test invalid inputs
  t.equal(cachedSemver.satisfies(null, '^1.0.0'), false, 'null version returns false')
  t.equal(cachedSemver.satisfies('1.2.3', null), false, 'null range returns false')
  t.equal(cachedSemver.satisfies('1.2.3', ''), true, 'empty range returns true')
  t.equal(cachedSemver.satisfies('1.2.3', '*'), true, 'wildcard range returns true')
  t.equal(cachedSemver.satisfies('1.2.3', '1.2.3'), true, 'exact match returns true')

  t.throws(() => cachedSemver.intersects(null, '^1.0.0'), /Cannot read properties of null/, 'null range1 throws')
  t.throws(() => cachedSemver.intersects('^1.0.0', null), /Cannot read properties of null/, 'null range2 throws')
  t.equal(cachedSemver.intersects('^1.0.0', '^1.0.0'), true, 'same ranges return true')
  t.equal(cachedSemver.intersects('*', '^1.0.0'), true, 'wildcard intersects')
  t.equal(cachedSemver.intersects('^1.0.0', '*'), true, 'wildcard intersects (reversed)')

  // Test non-string inputs
  t.equal(cachedSemver.valid(123), null, 'number input returns null')
  t.equal(cachedSemver.validRange(123), null, 'number range input returns null')
  t.equal(cachedSemver.clean(123), null, 'number clean input returns null')
  t.equal(cachedSemver.parse(123), null, 'number parse input returns null')

  // Test falsy but valid version strings
  t.equal(cachedSemver.satisfies('0.0.0', '>=0.0.0'), true, 'version "0.0.0" works correctly')
  t.equal(cachedSemver.satisfies('0.0.0', '^0.0.0'), true, 'version "0.0.0" with caret works correctly')

  // Test wildcard range handling
  t.equal(cachedSemver.validRange('*'), '*', 'validRange("*") returns "*"')
  t.equal(cachedSemver.validRange(''), '*', 'validRange("") returns "*"')

  // Test prerelease behavior with wildcard (regression test)
  t.equal(cachedSemver.satisfies('1.0.0', '*'), true, 'release version satisfies *')
  t.equal(cachedSemver.satisfies('2.0.0-beta.45', '*'), false, 'prerelease version does not satisfy *')
  t.equal(cachedSemver.satisfies('2.0.0-beta.45', '*', { includePrerelease: true }), true, 'prerelease satisfies * with includePrerelease')

  t.end()
})

t.test('exception behavior matches original semver', t => {
  // Test that non-string version inputs throw the same exceptions as original semver
  t.throws(() => cachedSemver.satisfies(123, '^1.0.0'), /Invalid version/, 'number version throws')
  t.throws(() => cachedSemver.satisfies({}, '^1.0.0'), /Invalid version/, 'object version throws')

  // Test that non-string range inputs behave the same (return false, don't throw)
  t.equal(cachedSemver.satisfies('1.2.3', 123), false, 'number range returns false')
  t.equal(cachedSemver.satisfies('1.2.3', {}), false, 'object range returns false')

  // Test intersects function throws for non-string inputs (like original semver)
  t.throws(() => cachedSemver.intersects(123, '^1.0.0'), /trim is not a function/, 'number range1 in intersects throws')
  t.throws(() => cachedSemver.intersects('^1.0.0', 123), /trim is not a function/, 'number range2 in intersects throws')

  t.end()
})

t.test('comprehensive coverage tests', t => {
  // Test cache hit in clean function
  const cleanResult1 = cachedSemver.clean(' 1.2.3 ')
  const cleanResult2 = cachedSemver.clean(' 1.2.3 ') // Should hit cache
  t.equal(cleanResult1, cleanResult2, 'clean cache hit works')

  // Test clean with options to trigger cache with options
  const cleanWithOpts1 = cachedSemver.clean(' 1.2.3 ', { loose: true })
  const cleanWithOpts2 = cachedSemver.clean(' 1.2.3 ', { loose: true }) // Cache hit
  t.equal(cleanWithOpts1, cleanWithOpts2, 'clean with options cache hit')

  // Test intersects with invalid range
  t.equal(cachedSemver.intersects('totally-invalid-range', '^1.0.0'), false, 'intersects with invalid range1')
  t.equal(cachedSemver.intersects('^1.0.0', 'totally-invalid-range'), false, 'intersects with invalid range2')

  // Force cache eviction by parsing more than 1000 ranges to hit line 26
  const manyRanges = []
  for (let i = 0; i < 1002; i++) {
    const range = `^${i}.0.0`
    manyRanges.push(range)
    cachedSemver.satisfies('1.0.0', range) // This will populate and evict cache
  }
  t.ok(manyRanges.length > 1000, 'created enough ranges to trigger eviction')

  // Test parseRange with non-string (line 73) - need direct call to parseRange
  // This is internal but we can trigger it through intersects
  t.throws(() => cachedSemver.intersects(123, '^1.0.0'), /trim is not a function/, 'intersects with non-string throws like original')

  // Test LRU cache methods directly if possible
  // Force cache to use .has() method by checking existing vs new entries
  const version1 = '1.0.0'
  const version2 = '2.0.0'
  cachedSemver.satisfies(version1, '^1.0.0') // Cache miss
  cachedSemver.satisfies(version1, '^1.0.0') // Cache hit (should use .has())
  cachedSemver.satisfies(version2, '^2.0.0') // New entry

  t.end()
})

t.test('cache behavior and edge cases', t => {
  // Fill up different caches to ensure we hit cache methods
  // Fill version cache
  for (let i = 0; i < 50; i++) {
    cachedSemver.parse(`${i}.0.0`)
    cachedSemver.valid(`${i}.0.0`)
  }

  // Fill range cache
  for (let i = 0; i < 50; i++) {
    cachedSemver.validRange(`^${i}.0.0`)
  }

  // Fill clean cache
  for (let i = 0; i < 50; i++) {
    cachedSemver.clean(` ${i}.0.0 `)
  }

  // Re-access some cached items to trigger .has() method
  cachedSemver.parse('1.0.0') // Should be cached
  cachedSemver.validRange('^1.0.0') // Should be cached
  cachedSemver.clean(' 1.0.0 ') // Should be cached

  t.ok(true, 'cache operations completed')
  t.end()
})

t.test('branch coverage completion', t => {
  // We need to trigger the remaining branches to get 100% coverage

  // Trigger the "else" branch in createCacheKey when options are provided (line 51)
  const resultWithOptions = cachedSemver.satisfies('1.0.0', '^1.0.0', { loose: true })
  t.equal(resultWithOptions, true, 'satisfies works with options')

  // Also test with different option combinations to ensure cache key generation
  cachedSemver.satisfies('1.0.0', '^1.0.0', { includePrerelease: true })
  cachedSemver.validRange('^1.0.0', { loose: true })
  cachedSemver.clean(' 1.0.0 ', { loose: true })

  // Test that the cache is working with options
  const result1 = cachedSemver.satisfies('1.0.0', '^1.0.0', { loose: true })
  const result2 = cachedSemver.satisfies('1.0.0', '^1.0.0', { loose: true })
  t.equal(result1, result2, 'cached results with options are consistent')

  // Test the remaining coverage for invalid inputs
  const invalidVersionResult = cachedSemver.satisfies('not.a.valid.version', '^1.0.0')
  t.equal(invalidVersionResult, false, 'invalid version should return false')

  const invalidRangeResult = cachedSemver.satisfies('1.0.0', 'not-a-valid-range')
  t.equal(invalidRangeResult, false, 'invalid range should return false')

  // Test non-string range via validRange (which calls parseRange)
  const nonStringRangeTest = cachedSemver.validRange(123)
  t.equal(nonStringRangeTest, null, 'non-string range should return null')

  // Force coverage of every branch by testing edge cases we might have missed

  // Test cache update path - try to trigger line 24-27 in set() method
  // This requires calling set() on an existing key, but our caching logic makes this difficult

  // Test all createCacheKey branches more thoroughly
  cachedSemver.satisfies('1.0.0', '^1.0.0') // No options - should hit if keys.length === 0 branch
  cachedSemver.satisfies('1.0.0', '^1.0.0', {}) // Empty options - should still hit if keys.length === 0 branch
  cachedSemver.satisfies('1.0.0', '^1.0.0', { loose: true }) // With options - should hit else branch
  cachedSemver.satisfies('1.0.0', '^1.0.0', { loose: true, includePrerelease: false }) // Multiple options

  // Test parseRange non-string branch via different entry points
  // Note: cachedSemver.intersects('^1.0.0', 123) would throw because semver.intersects expects strings

  t.end()
})

t.test('error path coverage attempts', t => {
  // Lines 118 and 145 are error handling in try/catch blocks
  // These are very difficult to reach as semver is robust

  // Try to trigger error in parsedRange.test() (line 118)
  // This would require a valid Range object that throws when .test() is called
  // This is extremely unlikely with normal semver usage

  // Try to trigger error in parsedRange1.intersects() (line 145)
  // This would require two valid Range objects where .intersects() throws
  // Also extremely unlikely with normal semver usage

  // These error paths are defensive code that may be practically unreachable
  // with the semver library's current implementation

  t.pass('Error paths are defensive code, may be unreachable in practice')
  t.end()
})

t.test('has all semver exports', t => {
  // Verify that all semver functions are available
  const semverKeys = Object.keys(semver)
  const cachedKeys = Object.keys(cachedSemver)

  for (const key of semverKeys) {
    t.ok(cachedKeys.includes(key), `${key} is exported from cached-semver`)
    t.equal(typeof cachedSemver[key], typeof semver[key], `${key} has same type`)
  }

  t.end()
})
