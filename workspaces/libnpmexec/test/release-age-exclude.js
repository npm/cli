const t = require('tap')
const npa = require('npm-package-arg')
const {
  isReleaseAgeExcluded,
  trustedSpecName,
  applyReleaseAgeExclude,
} = require('../lib/release-age-exclude.js')

t.test('isReleaseAgeExcluded: empty / invalid patterns', async t => {
  t.equal(isReleaseAgeExcluded('lodash', []), false)
  t.equal(isReleaseAgeExcluded('lodash', undefined), false)
  t.equal(isReleaseAgeExcluded('lodash', null), false)
  t.equal(isReleaseAgeExcluded(undefined, ['*']), false)
  t.equal(isReleaseAgeExcluded('', ['*']), false)
})

t.test('isReleaseAgeExcluded: exact and glob patterns', async t => {
  t.equal(isReleaseAgeExcluded('lodash', ['lodash']), true, 'exact match')
  t.equal(isReleaseAgeExcluded('lodash', ['other']), false, 'exact miss')
  t.equal(isReleaseAgeExcluded('@myorg/foo', ['@myorg/*']), true, 'scope glob match')
  t.equal(isReleaseAgeExcluded('@other/foo', ['@myorg/*']), false, 'scope glob miss')
})

t.test('isReleaseAgeExcluded: hardened glob semantics', async t => {
  // `!foo` must NOT act as a negation exempting everything but foo.
  t.equal(isReleaseAgeExcluded('bar', ['!foo']), false,
    'leading ! stays literal and does not exempt unrelated names')
  // `#foo` must NOT be treated as a comment (which would match nothing).
  t.equal(isReleaseAgeExcluded('#foo', ['#foo']), true,
    'leading # is literal')
})

t.test('trustedSpecName: registry, alias, and edge cases', async t => {
  t.equal(trustedSpecName(undefined), undefined)
  t.equal(trustedSpecName(npa('lodash@1.2.3')), 'lodash', 'registry spec')
  // npm: alias — the fetched package is the alias target.
  t.equal(trustedSpecName(npa('foo@npm:@myorg/real@1')), '@myorg/real',
    'alias resolves to underlying package name')
})

t.test('applyReleaseAgeExclude: no before => passthrough', async t => {
  const opts = { before: null, minReleaseAgeExclude: ['@myorg/*'] }
  t.equal(applyReleaseAgeExclude(npa('@myorg/foo@1'), opts), opts,
    'returns same object when there is no cutoff to clear')
})

t.test('applyReleaseAgeExclude: not excluded => passthrough', async t => {
  const opts = { before: new Date('2026-01-01'), minReleaseAgeExclude: ['@myorg/*'] }
  t.equal(applyReleaseAgeExclude(npa('lodash@1'), opts), opts,
    'unrelated package keeps the before cutoff')
})

t.test('applyReleaseAgeExclude: excluded => before cleared, non-mutating', async t => {
  const before = new Date('2026-01-01')
  const opts = { before, minReleaseAgeExclude: ['@myorg/*'], other: 'x' }
  const out = applyReleaseAgeExclude(npa('@myorg/foo@1.2.3'), opts)
  t.not(out, opts, 'returns a copy')
  t.equal(opts.before, before, 'input untouched')
  t.equal(out.before, null, 'before cleared for excluded spec')
  t.equal(out.other, 'x', 'other options preserved')
  t.same(out.minReleaseAgeExclude, ['@myorg/*'], 'exclude list preserved')
})

t.test('applyReleaseAgeExclude: alias excluded by alias-target name', async t => {
  const opts = {
    before: new Date('2026-01-01'),
    minReleaseAgeExclude: ['@myorg/real'],
  }
  const out = applyReleaseAgeExclude(npa('foo@npm:@myorg/real@1'), opts)
  t.equal(out.before, null,
    'alias exemption keyed on underlying package name, not alias key')
})

t.test('applyReleaseAgeExclude: null / empty options', async t => {
  t.equal(applyReleaseAgeExclude(npa('lodash@1'), null), null)
  t.equal(applyReleaseAgeExclude(npa('lodash@1'), undefined), undefined)
  const opts = {}
  t.equal(applyReleaseAgeExclude(npa('lodash@1'), opts), opts,
    'no before => passthrough')
})
