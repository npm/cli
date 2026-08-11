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
