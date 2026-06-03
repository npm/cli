const t = require('tap')
const {
  collectUnreviewedScripts,
  strictAllowScriptsError,
} = require('../lib/unreviewed-scripts.js')

// Loads a fresh copy of the shared module with `install-scripts.js` mocked,
// so script detection (including the synthetic node-gyp `binding.gyp` path)
// can be controlled without touching the filesystem.
const mockCollect = (t, getInstallScripts) =>
  t.mock('../lib/unreviewed-scripts.js', {
    '../lib/install-scripts.js': getInstallScripts,
  }).collectUnreviewedScripts

// Minimal tree fixture for the walk.
const tree = (nodes) => ({
  inventory: new Map(nodes.map((n, i) => [`node_modules/${n.name || `n${i}`}`, n])),
})

// Registry-shaped node so the real script-allowed/install-scripts helpers
// behave deterministically (registry tarballs skip `prepare`, and the
// identity matcher keys off the resolved URL).
const node = ({
  name = 'pkg',
  version = '1.0.0',
  scripts = {},
  isProjectRoot = false,
  isWorkspace = false,
  isLink = false,
  inBundle = false,
  resolved,
} = {}) => ({
  name,
  packageName: name,
  version,
  resolved: resolved ?? `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`,
  location: `node_modules/${name}`,
  isProjectRoot,
  isWorkspace,
  isLink,
  inBundle,
  isRegistryDependency: true,
  package: { name, version, scripts },
})

t.test('collectUnreviewedScripts', async t => {
  t.test('returns [] when ignoreScripts is set', async t => {
    const result = await collectUnreviewedScripts({
      tree: tree([node({ scripts: { install: 'x' } })]),
      policy: null,
      ignoreScripts: true,
    })
    t.strictSame(result, [])
  })

  t.test('returns [] when dangerouslyAllowAllScripts is set', async t => {
    const result = await collectUnreviewedScripts({
      tree: tree([node({ scripts: { install: 'x' } })]),
      policy: null,
      dangerouslyAllowAllScripts: true,
    })
    t.strictSame(result, [])
  })

  t.test('returns [] when tree has no inventory', async t => {
    t.strictSame(await collectUnreviewedScripts({ tree: undefined }), [])
    t.strictSame(await collectUnreviewedScripts({ tree: {} }), [])
    t.strictSame(await collectUnreviewedScripts({}), [])
    t.strictSame(await collectUnreviewedScripts(), [])
  })

  t.test('skips project root, workspace, linked, and bundled nodes', async t => {
    const result = await collectUnreviewedScripts({
      tree: tree([
        node({ name: 'root', scripts: { install: 'x' }, isProjectRoot: true }),
        node({ name: 'ws', scripts: { install: 'x' }, isWorkspace: true }),
        node({ name: 'linked', scripts: { install: 'x' }, isLink: true }),
        node({ name: 'bundled', scripts: { install: 'x' }, inBundle: true }),
      ]),
      policy: null,
    })
    t.strictSame(result, [])
  })

  t.test('skips nodes with no install-relevant scripts', async t => {
    const result = await collectUnreviewedScripts({
      tree: tree([node({ scripts: { test: 'jest' } })]),
      policy: null,
    })
    t.strictSame(result, [])
  })

  t.test('collects unreviewed install scripts', async t => {
    const result = await collectUnreviewedScripts({
      tree: tree([
        node({ name: 'a', scripts: { preinstall: 'pre' } }),
        node({ name: 'b', scripts: { install: 'inst' } }),
        node({ name: 'c', scripts: { postinstall: 'post' } }),
      ]),
      policy: null,
    })
    t.equal(result.length, 3)
    t.strictSame(result[0].scripts, { preinstall: 'pre' })
    t.strictSame(result[1].scripts, { install: 'inst' })
    t.strictSame(result[2].scripts, { postinstall: 'post' })
  })

  t.test('skips nodes the policy allows or denies', async t => {
    const result = await collectUnreviewedScripts({
      tree: tree([
        node({ name: 'allowed', version: '1.0.0', scripts: { install: 'x' } }),
        node({ name: 'denied', version: '1.0.0', scripts: { install: 'x' } }),
        node({ name: 'pending', version: '1.0.0', scripts: { install: 'x' } }),
      ]),
      policy: { allowed: true, denied: false },
    })
    t.equal(result.length, 1)
    t.equal(result[0].node.name, 'pending')
  })

  t.test('detects synthetic node-gyp via binding.gyp runtime check', async t => {
    const collect = mockCollect(t, async (n) => {
      if (n.path === '/has-bindings') {
        return { install: 'node-gyp rebuild' }
      }
      return {}
    })
    const result = await collect({
      tree: tree([
        { ...node({ name: 'native' }), path: '/has-bindings' },
        { ...node({ name: 'pure-js' }), path: '/no-bindings' },
      ]),
      policy: null,
    })
    t.equal(result.length, 1)
    t.equal(result[0].node.name, 'native')
    t.strictSame(result[0].scripts, { install: 'node-gyp rebuild' })
  })
})

t.test('strictAllowScriptsError', async t => {
  const unreviewed = [
    { node: { package: { name: 'a', version: '1.0.0' } }, scripts: { install: 'do-a' } },
    { node: { package: { name: 'b', version: '2.0.0' } }, scripts: { preinstall: 'pre', postinstall: 'post' } },
  ]

  const err = strictAllowScriptsError(unreviewed, { remediation: 'FIX IT.' })
  t.equal(err.code, 'ESTRICTALLOWSCRIPTS')
  t.match(err.message, /2 package\(s\) have install scripts not covered by allowScripts:/)
  t.match(err.message, /a@1\.0\.0 \(install: do-a\)/)
  t.match(err.message, /b@2\.0\.0 \(preinstall: pre; postinstall: post\)/)
  t.match(err.message, /FIX IT\.$/)
})

t.test('strictAllowScriptsError falls back to node.name when no package', async t => {
  const err = strictAllowScriptsError(
    [{ node: { name: 'c' }, scripts: { install: 'x' } }],
    { remediation: 'go.' }
  )
  t.match(err.message, /\n {2}c \(install: x\)\n/)
})

t.test('strictAllowScriptsError defaults options when called without them', async t => {
  const err = strictAllowScriptsError(
    [{ node: { name: 'c' }, scripts: { install: 'x' } }]
  )
  t.equal(err.code, 'ESTRICTALLOWSCRIPTS')
  t.match(err.message, /\n {2}c \(install: x\)\n/)
})
