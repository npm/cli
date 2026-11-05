const t = require('tap')
const fs = require('node:fs/promises')
const { join } = require('node:path')
const { cleanNewlines } = require('../../fixtures/clean-snapshot')
const tmock = require('../../fixtures/tmock')
const mockNpm = require('../../fixtures/mock-npm')
const Arborist = require('@npmcli/arborist')
const MockRegistry = require('@npmcli/mock-registry')

// windowwwwwwssss!!!!!
const readRc = async (dir) => {
  const res = await fs.readFile(join(dir, 'npmrc'), 'utf8').catch(() => '')
  return cleanNewlines(res).trim()
}

const mockReififyFinish = async (t, {
  actualTree = {},
  otherDirs = {},
  diff,
  unreviewedNodes,
  captureReifyOutput,
  ...config
} = {}) => {
  const mock = await mockNpm(t, {
    npm: ({ other }) => ({
      npmRoot: other,
    }),
    otherDirs: {
      npmrc: `key=value`,
      ...otherDirs,
    },
    config,
  })

  const mocks = {
    '{LIB}/utils/reify-output.js': captureReifyOutput || (() => {}),
  }
  if (unreviewedNodes !== undefined) {
    mocks['{LIB}/utils/check-allow-scripts.js'] = async () =>
      unreviewedNodes.map((node) => ({ node, scripts: { install: 'x' } }))
  }
  const reifyFinish = tmock(t, '{LIB}/utils/reify-finish.js', mocks)

  await reifyFinish(mock.npm, {
    options: { global: mock.npm.global },
    diff,
    actualTree: typeof actualTree === 'function' ? actualTree(mock) : actualTree,
  })

  const builtinRc = {
    raw: await readRc(mock.other),
    data: Object.fromEntries(Object.entries(mock.npm.config.data.get('builtin').data)),
  }

  return {
    builtinRc,
    ...mock,
  }
}

t.test('ok by default', async t => {
  const mock = await mockReififyFinish(t, {
    global: false,
  })
  t.same(mock.builtinRc.raw, 'key=value')
  t.strictSame(mock.builtinRc.data, { key: 'value' })
})

t.test('should not write if no global npm module', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    actualTree: {
      inventory: new Map(),
    },
  })
  t.same(mock.builtinRc.raw, 'key=value')
  t.strictSame(mock.builtinRc.data, { key: 'value' })
})

t.test('should not write if builtin conf had load error', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    otherDirs: {
      npmrc: {},
    },
    actualTree: {
      inventory: new Map([['node_modules/npm', {}]]),
    },
  })
  t.same(mock.builtinRc.raw, '')
  t.strictSame(mock.builtinRc.data, {})
})

t.test('should write if everything above passes', async t => {
  const mock = await mockReififyFinish(t, {
    global: true,
    otherDirs: {
      'new-npm': {},
    },
    actualTree: ({ other }) => ({
      inventory: new Map([['node_modules/npm', { path: join(other, 'new-npm') }]]),
    }),
  })

  t.same(mock.builtinRc.raw, 'key=value')
  t.strictSame(mock.builtinRc.data, { key: 'value' })

  const newFile = await readRc(join(mock.other, 'new-npm'))
  t.equal(mock.builtinRc.raw, newFile)
})

t.test('pending approvals remain visible for untouched installed nodes (npm/cli#9797)', async t => {
  const captured = []
  const touched = { location: 'node_modules/touched', name: 'touched' }
  const untouched = { location: 'node_modules/untouched', name: 'untouched' }
  await mockReififyFinish(t, {
    global: false,
    unreviewedNodes: [touched, untouched],
    diff: {
      children: [
        { action: 'ADD', ideal: touched, children: [] },
        { action: 'REMOVE', actual: { location: 'node_modules/removed' }, children: [] },
      ],
    },
    captureReifyOutput: (_npm, _arb, extras) => captured.push(extras),
  })
  t.equal(captured.length, 1)
  t.equal(captured[0].unreviewedScripts.length, 2,
    'both installed packages have pending approvals')
  t.equal(captured[0].unreviewedScripts[0].node.name, 'touched')
})

t.test('unreviewedScripts pass through when there is no diff (defensive)', async t => {
  const captured = []
  const a = { location: 'node_modules/a', name: 'a' }
  await mockReififyFinish(t, {
    global: false,
    unreviewedNodes: [a],
    captureReifyOutput: (_npm, _arb, extras) => captured.push(extras),
  })
  t.equal(captured[0].unreviewedScripts.length, 1)
})

t.test('pending approvals do not depend on diff shape', async t => {
  const captured = []
  const changed = { location: 'node_modules/changed', name: 'changed' }
  const nested = { location: 'node_modules/nested', name: 'nested' }
  const untouched = { location: 'node_modules/untouched', name: 'untouched' }
  await mockReififyFinish(t, {
    global: false,
    unreviewedNodes: [changed, nested, untouched],
    diff: {
      children: [
        null,
        { action: 'CHANGE', ideal: changed, children: [] },
        {
          action: 'ADD',
          ideal: { location: null },
          children: [
            { action: 'ADD', ideal: nested },
          ],
        },
      ],
    },
    captureReifyOutput: (_npm, _arb, extras) => captured.push(extras),
  })
  const names = captured[0].unreviewedScripts.map(u => u.node.name).sort()
  t.strictSame(names, ['changed', 'nested', 'untouched'])
})

t.test('build candidates include link targets and directly managed unchanged links', async t => {
  const captured = []
  const link = { location: 'node_modules/foo', name: 'foo', isLink: true }
  const linkTarget = { location: 'packages/foo', name: 'foo-target' }
  link.target = linkTarget
  const unchangedLink = { location: 'node_modules/bar', name: 'bar', isLink: true }
  const unchangedTarget = { location: 'packages/bar', name: 'bar-target', fsTop: '/project' }
  unchangedLink.target = unchangedTarget
  const root = { target: { location: '', fsTop: '/project' } }
  unchangedLink.root = root
  unchangedLink.parent = root.target
  const untouched = { location: 'node_modules/untouched', name: 'untouched' }
  await mockReififyFinish(t, {
    global: false,
    unreviewedNodes: [linkTarget, unchangedTarget, untouched],
    diff: {
      children: [{ action: 'ADD', ideal: link, children: [] }],
      unchanged: [unchangedLink],
    },
    captureReifyOutput: (_npm, _arb, extras) => captured.push(extras),
  })
  const names = captured[0].unreviewedScripts.map(u => u.node.name).sort()
  t.strictSame(names, ['bar-target', 'foo-target', 'untouched'])
})

const capturePending = (t) => {
  const captured = []
  const finish = tmock(t, '{LIB}/utils/reify-finish.js', {
    '{LIB}/utils/reify-output.js': (_npm, _arb, extras) => captured.push(extras.unreviewedScripts),
  })
  return { finish, captured }
}

t.test('real file dependency remains pending on added and unchanged installs', async t => {
  const mock = await mockNpm(t, {
    prefixDir: { 'package.json': JSON.stringify({
      name: 'project', dependencies: { local: 'file:../other/local' },
    }) },
    otherDirs: { local: { 'package.json': JSON.stringify({
      name: 'local', version: '1.0.0', scripts: { install: 'echo local' },
    }) } },
  })
  const { finish, captured } = capturePending(t)
  for (let i = 0; i < 2; i++) {
    const arb = new Arborist({ path: mock.prefix, cache: mock.cache, audit: false })
    await arb.reify()
    await finish(mock.npm, arb)
    t.same(captured[i].map(({ node }) => node.name), ['local'])
  }
})

t.test('real linked install retains transitive pending approvals', async t => {
  const packages = [
    { name: 'parent', version: '1.0.0', dependencies: { child: '1.0.0' } },
    { name: 'child', version: '1.0.0', scripts: { install: 'echo child' } },
  ]
  const mock = await mockNpm(t, {
    prefixDir: { 'package.json': JSON.stringify({ name: 'project', dependencies: { parent: '1.0.0' } }) },
    otherDirs: Object.fromEntries(packages.map(pkg => [pkg.name, { 'package.json': JSON.stringify(pkg) }])),
  })
  const registry = new MockRegistry({ tap: t, registry: 'https://registry.npmjs.org', strict: true })
  for (const pkg of packages) {
    const manifest = registry.manifest({ name: pkg.name, packuments: [pkg] })
    await registry.package({ manifest, tarballs: { '1.0.0': join(mock.other, pkg.name) } })
  }
  const arb = new Arborist({ path: mock.prefix, cache: mock.cache, audit: false })
  await arb.reify({ installStrategy: 'linked' })
  const { finish, captured } = capturePending(t)
  await finish(mock.npm, arb)
  t.same(captured[0].map(({ node }) => node.name), ['child'])
})

t.test('normal empty-diff install reports approvals pending from an ignored install', async t => {
  const pkg = { name: 'child', version: '1.0.0', scripts: { install: 'echo child' } }
  const mock = await mockNpm(t, {
    prefixDir: { 'package.json': JSON.stringify({ name: 'project', dependencies: { child: '1.0.0' } }) },
    otherDirs: { child: { 'package.json': JSON.stringify(pkg) } },
  })
  const registry = new MockRegistry({ tap: t, registry: 'https://registry.npmjs.org', strict: true })
  const manifest = registry.manifest({ name: pkg.name, packuments: [pkg] })
  await registry.package({ manifest, tarballs: { '1.0.0': join(mock.other, 'child') } })
  const { finish, captured } = capturePending(t)
  const ignored = new Arborist({
    path: mock.prefix, cache: mock.cache, audit: false, ignoreScripts: true,
  })
  await ignored.reify()
  await finish(mock.npm, ignored)
  t.same(captured[0], [], 'ignored install suppresses the advisory')
  const normal = new Arborist({ path: mock.prefix, cache: mock.cache, audit: false })
  await normal.reify()
  t.same(normal.diff.children, [], 'second install has no added or changed packages')
  await finish(mock.npm, normal)
  t.same(captured[1].map(({ node }) => node.name), ['child'])
})
