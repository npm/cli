const t = require('tap')
const npa = require('npm-package-arg')
const { isReleaseAgeExcluded, trustedSpecName } = require('../lib/release-age-exclude.js')

t.test('returns false when there are no patterns', t => {
  t.equal(isReleaseAgeExcluded('lodash', []), false, 'empty array')
  t.equal(isReleaseAgeExcluded('lodash', undefined), false, 'undefined')
  t.equal(isReleaseAgeExcluded('lodash', null), false, 'null')
  t.end()
})

t.test('returns false when the name is missing', t => {
  t.equal(isReleaseAgeExcluded(undefined, ['*']), false, 'undefined name')
  t.equal(isReleaseAgeExcluded('', ['*']), false, 'empty name')
  t.end()
})

t.test('matches exact package names', t => {
  t.equal(isReleaseAgeExcluded('lodash', ['lodash']), true, 'unscoped exact')
  t.equal(isReleaseAgeExcluded('@myorg/utils', ['@myorg/utils']), true, 'scoped exact')
  t.equal(isReleaseAgeExcluded('react', ['lodash', 'react', 'vue']), true, 'one of many')
  t.equal(isReleaseAgeExcluded('react-dom', ['react']), false, 'no partial match')
  t.end()
})

t.test('matches glob patterns', t => {
  t.equal(isReleaseAgeExcluded('@myorg/utils', ['@myorg/*']), true, 'scope wildcard')
  t.equal(isReleaseAgeExcluded('@myorg/shared-utils', ['@myorg/*']), true, 'scope wildcard 2')
  t.equal(isReleaseAgeExcluded('@other/utils', ['@myorg/*']), false, 'different scope')
  t.equal(isReleaseAgeExcluded('lodash', ['lo*']), true, 'prefix wildcard')
  t.equal(isReleaseAgeExcluded('react', ['@myorg/*', 'lodash']), false, 'no pattern matches')
  t.end()
})

t.test('negation and comment patterns cannot invert into a match-all', t => {
  // A leading `!` must be treated literally (no package name can contain `!`),
  // so it exempts nothing rather than everything-but-the-listed-name. Likewise
  // a leading `#` must not be swallowed as a comment.
  t.equal(isReleaseAgeExcluded('lodash', ['!react']), false, 'negation does not match others')
  t.equal(isReleaseAgeExcluded('react', ['!react']), false, 'negation does not match itself')
  t.equal(isReleaseAgeExcluded('lodash', ['#lodash']), false, 'comment matches nothing')
  t.end()
})

t.test('trustedSpecName unwraps npm: aliases to the resolved package', t => {
  t.equal(trustedSpecName(npa.resolve('lodash', '^4.17.0')), 'lodash', 'plain registry range')
  t.equal(trustedSpecName(npa.resolve('@scope/pkg', '^1.0.0')), '@scope/pkg', 'scoped registry range')
  // For an alias the fetched package is the alias target, not the alias key.
  t.equal(
    trustedSpecName(npa.resolve('@myorg/x', 'npm:attacker-pkg@1.0.0')),
    'attacker-pkg',
    'alias resolves to the underlying package name'
  )
  t.equal(trustedSpecName(undefined), undefined, 'missing spec')
  t.end()
})

t.test('an alias key cannot match an exclude pattern for its target', t => {
  // Victim excludes their own scope; a malicious dep aliases an attacker package
  // under a name in that scope (`"@myorg/x": "npm:attacker-pkg@1"`). The exempt
  // decision must be keyed on the resolved target, not the alias key, so the
  // age filter is NOT disabled for attacker-pkg.
  const spec = npa.resolve('@myorg/x', 'npm:attacker-pkg@1.0.0')
  t.equal(isReleaseAgeExcluded(spec.name, ['@myorg/*']), true,
    'the raw alias key would wrongly match')
  t.equal(isReleaseAgeExcluded(trustedSpecName(spec), ['@myorg/*']), false,
    'the trusted target name does not match')
  t.end()
})

t.end()
