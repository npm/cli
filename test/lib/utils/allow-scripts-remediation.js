const t = require('tap')

const {
  allowScriptsFlag,
  configSetAllowScripts,
  policyKeyFor,
} = require('../../../lib/utils/allow-scripts-remediation.js')

t.test('registry deps are keyed by their trusted name', async t => {
  const node = {
    name: 'canvas',
    version: '2.11.0',
    resolved: 'https://registry.npmjs.org/canvas/-/canvas-2.11.0.tgz',
  }
  t.equal(policyKeyFor(node), 'canvas')
})

// An alias installs `naughty` at `node_modules/trusted`. The policy matches
// on the registered name, so the suggestion has to name it too.
t.test('aliased registry deps are keyed by the registered name', async t => {
  const node = {
    name: 'trusted',
    version: '1.0.0',
    resolved: 'https://registry.npmjs.org/naughty/-/naughty-1.0.0.tgz',
  }
  t.equal(policyKeyFor(node), 'naughty')
})

// Non-registry deps are matched by their resolved source. Keying them by
// name would produce a suggestion the matcher rejects, leaving the scripts
// blocked after the user followed the advice.
t.test('tarball deps are keyed by their resolved URL', async t => {
  const node = { name: 'tool', version: '1.0.0', resolved: 'https://example.com/tool.tgz' }
  t.equal(policyKeyFor(node), 'https://example.com/tool.tgz')
})

t.test('file deps are keyed by their resolved path', async t => {
  const node = { name: 'local', version: '1.0.0', resolved: 'file:../local' }
  t.equal(policyKeyFor(node), 'file:../local')
})

t.test('git deps are keyed by their resolved git URL', async t => {
  const resolved = `git+ssh://git@github.com/o/r.git#${'a'.repeat(40)}`
  const node = { name: 'forked', version: '1.0.0', resolved }
  t.equal(policyKeyFor(node), resolved)
})

// Bundled deps can never be allowlisted, so no candidate matches. Fall back
// to the display name rather than emitting nothing.
t.test('falls back to the display name when nothing matches', async t => {
  const node = {
    name: 'bundled',
    version: '1.0.0',
    inBundle: true,
    resolved: 'https://registry.npmjs.org/bundled/-/bundled-1.0.0.tgz',
  }
  t.equal(policyKeyFor(node), 'bundled')
})

t.test('plain keys are left unquoted', async t => {
  t.equal(
    configSetAllowScripts(['canvas', 'sharp']),
    'npm config set allow-scripts=canvas,sharp --location=user'
  )
  t.equal(allowScriptsFlag(['canvas', 'sharp']), '--allow-scripts=canvas,sharp')
})

// `#` starts a shell comment, which would silently truncate the committish
// off a pasted suggestion.
t.test('shell-unsafe keys are quoted', async t => {
  const key = `git+ssh://git@github.com/o/r.git#${'a'.repeat(40)}`
  t.equal(
    configSetAllowScripts([key]),
    `npm config set allow-scripts='${key}' --location=user`
  )
  t.equal(allowScriptsFlag([key]), `--allow-scripts='${key}'`)
})

t.test('single quotes in a key are escaped', async t => {
  t.equal(allowScriptsFlag(["file:../it's"]), `--allow-scripts='file:../it'\\''s'`)
})

// Test for issue: URLs with query parameters containing tokens should not be exposed
t.test('URLs with auth tokens are not used as policy keys', async t => {
  const node = {
    name: 'private-pkg',
    version: '1.0.0',
    resolved: 'https://registry.npmjs.org/private-pkg/-/private-pkg-1.0.0.tgz?npm_token=secret123',
  }
  // Should use package name instead of URL with token
  t.equal(policyKeyFor(node), 'private-pkg')
})

// Test for issue: URLs with commas should not break round-trip
t.test('URLs with commas are handled safely', async t => {
  // When a URL contains a comma, it should either be rejected or encoded
  // The parser splits on commas, so we need to ensure the round-trip works.
  // For non-registry deps, we return null to avoid breaking the comma-separated list.
  const parseAllowScriptsList = require('@npmcli/config/lib/parse-allow-scripts-list.js')
  const node = {
    name: 'tool',
    version: '1.0.0',
    resolved: 'https://example.com/tool,prod.tgz',
  }
  const key = policyKeyFor(node)
  
  // For non-registry deps with commas, we return null to avoid breaking the parser
  t.equal(key, null, 'should return null for non-registry URLs with commas')
  
  // Verify that null keys are filtered out in config generation
  const cmd = configSetAllowScripts([key, 'safe-pkg'])
  t.ok(cmd, 'should generate a command even with null keys')
  // The command should not include the null key
  t.equal(cmd.includes('safe-pkg'), true, 'should include safe keys')
  t.equal(cmd.includes('tool,prod'), false, 'should not include unsafe keys')
})

// Test for issue: Shell unsafe characters (like &) should be handled for Windows
t.test('shell unsafe characters like & are escaped or avoided', async t => {
  const node = {
    name: 'pkg',
    version: '1.0.0',
    resolved: 'https://example.com/pkg.tgz?x=1&whoami',
  }
  const key = policyKeyFor(node)
  // For non-registry deps with unsafe URLs (&, |, >, <), we return null
  // to avoid suggesting commands that could execute arbitrary code on Windows
  t.equal(key, null, 'should return null for non-registry URLs with &')
})

// Round-trip test: parser and matcher should handle the generated keys correctly
// Note: shell quoting is for the command line only. When the user pastes the command,
// the shell removes the quotes before passing to npm config set, which stores the unquoted value.
t.test('round-trip: generated config should parse back to original keys', async t => {
  const parseAllowScriptsList = require('@npmcli/config/lib/parse-allow-scripts-list.js')
  const keys = ['canvas', 'sharp']
  const cmd = configSetAllowScripts(keys)
  // Extract the allow-scripts value from the command
  const match = cmd.match(/allow-scripts=([^\s]+)/)
  t.ok(match, 'should have allow-scripts value')
  let value = match[1]
  // Simulate shell unquoting: remove outer single quotes if present
  if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1)
  }
  const parsed = parseAllowScriptsList(value)
  t.same(parsed, keys, 'parsed keys should match original')
})

// Round-trip test with special characters
t.test('round-trip: keys with shell-unsafe characters should parse correctly', async t => {
  const parseAllowScriptsList = require('@npmcli/config/lib/parse-allow-scripts-list.js')
  const key = `git+ssh://git@github.com/o/r.git#${'a'.repeat(40)}`
  const cmd = configSetAllowScripts([key])
  const match = cmd.match(/allow-scripts=([^\s]+)/)
  t.ok(match, 'should have allow-scripts value')
  let value = match[1]
  // Simulate shell unquoting: remove outer single quotes if present
  if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1)
  }
  const parsed = parseAllowScriptsList(value)
  t.same(parsed, [key], 'parsed keys should match original')
})
