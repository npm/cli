const t = require('tap')
const fs = require('node:fs')
const { resolve } = require('node:path')
const _mockNpm = require('../../fixtures/mock-npm')
const InstallScripts = require('../../../lib/commands/install-scripts.js')

const mockNpm = async (t, opts = {}) => {
  return _mockNpm(t, opts)
}

const remoteCypressUrl =
  'https://cdn.example.test/releases/cypress.tgz'
const registryShapedRemoteCypressUrl =
  'https://cdn.example.test/artifact/-/artifact-1.0.0.tgz'
const topLevelToolUrl =
  'https://good.example.test/releases/tool.tgz'
const nestedToolUrl =
  'https://evil.example.test/decoy/-/decoy-7.0.0.tgz'

const setupProject = ({
  allowScripts,
  withScripts = ['canvas'],
  noScripts = [],
  remoteUrls = {},
  extraneous = false,
} = {}) => {
  const pkg = {
    name: 'host',
    version: '1.0.0',
    dependencies: extraneous ? {} : Object.fromEntries(
      [...withScripts, ...noScripts].map((name) => [name, remoteUrls[name] ?? '*'])
    ),
  }
  if (allowScripts !== undefined) {
    pkg.allowScripts = allowScripts
  }

  const lockPackages = { '': pkg }
  const nodeModules = {}
  for (const name of withScripts) {
    nodeModules[name] = {
      'package.json': JSON.stringify({
        name,
        version: '1.0.0',
        scripts: { install: 'echo install' },
      }),
    }
    lockPackages[`node_modules/${name}`] = {
      version: '1.0.0',
      hasInstallScript: true,
      resolved: remoteUrls[name] ??
        `https://registry.npmjs.org/${name}/-/${name}-1.0.0.tgz`,
    }
  }
  for (const name of noScripts) {
    nodeModules[name] = {
      'package.json': JSON.stringify({ name, version: '1.0.0' }),
    }
    lockPackages[`node_modules/${name}`] = {
      version: '1.0.0',
      resolved: remoteUrls[name] ??
        `https://registry.npmjs.org/${name}/-/${name}-1.0.0.tgz`,
    }
  }

  return {
    'package.json': JSON.stringify(pkg, null, 2),
    'package-lock.json': JSON.stringify({
      name: pkg.name,
      version: pkg.version,
      lockfileVersion: 3,
      requires: true,
      packages: lockPackages,
    }),
    node_modules: nodeModules,
  }
}

const setupDistinctRemoteSourcesProject = () => {
  const pkg = {
    name: 'host',
    version: '1.0.0',
    dependencies: {
      tool: topLevelToolUrl,
      parent: '1.0.0',
    },
  }

  return {
    'package.json': JSON.stringify(pkg, null, 2),
    'package-lock.json': JSON.stringify({
      name: pkg.name,
      version: pkg.version,
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': pkg,
        'node_modules/tool': {
          version: '1.0.0',
          hasInstallScript: true,
          resolved: topLevelToolUrl,
        },
        'node_modules/parent': {
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/parent/-/parent-1.0.0.tgz',
          dependencies: { tool: nestedToolUrl },
        },
        'node_modules/parent/node_modules/tool': {
          version: '1.0.0',
          hasInstallScript: true,
          resolved: nestedToolUrl,
        },
      },
    }),
    node_modules: {
      tool: {
        'package.json': JSON.stringify({
          name: 'tool',
          version: '1.0.0',
          scripts: { install: 'echo install' },
        }),
      },
      parent: {
        'package.json': JSON.stringify({
          name: 'parent',
          version: '1.0.0',
          dependencies: { tool: nestedToolUrl },
        }),
        node_modules: {
          tool: {
            'package.json': JSON.stringify({
              name: 'tool',
              version: '1.0.0',
              scripts: { install: 'echo install' },
            }),
          },
        },
      },
    },
  }
}

const toolSourceNode = (source, overrides = {}) => ({
  name: 'tool',
  version: '1.0.0',
  resolved: source,
  isRegistryDependency: false,
  edgesIn: new Set([{ name: 'tool', spec: source }]),
  ...overrides,
})

const mockProjectWithInventory = (t, inventory, { unreviewed = [], config = {} } = {}) => {
  const FakeArborist = function (options) {
    this.options = options
    this.actualTree = { inventory: new Map(Object.entries(inventory)) }
  }
  FakeArborist.prototype.loadActual = async () => {}

  return mockNpm(t, {
    config,
    prefixDir: {
      'package.json': JSON.stringify({ name: 'host', version: '1.0.0' }),
    },
    mocks: {
      '@npmcli/arborist': FakeArborist,
      '{LIB}/utils/check-allow-scripts.js': async () => unreviewed,
    },
  })
}

const mixedRegistryRemoteInventory = () => ({
  registry: toolSourceNode('https://registry.npmjs.org/tool/-/tool-1.0.0.tgz', {
    isRegistryDependency: true,
    edgesIn: new Set([{ name: 'tool', spec: '1.0.0' }]),
  }),
  remote: toolSourceNode(topLevelToolUrl),
})

const linkedFileNode = (source, location) => {
  const rootPath = resolve('project')
  const linkPath = resolve(rootPath, location)
  const targetPath = resolve(rootPath, source.slice('file:'.length))
  const root = {
    path: rootPath,
    meta: {
      get: nodePath => nodePath === linkPath
        ? { resolved: source, link: true }
        : {},
    },
  }
  return {
    name: 'tool',
    version: '1.0.0',
    resolved: null,
    isRegistryDependency: false,
    path: targetPath,
    realpath: targetPath,
    root,
    linksIn: new Set([{
      path: linkPath,
      resolved: 'file:../../tool',
      root,
    }]),
  }
}

t.test('completion', async t => {
  const comp = (argv) =>
    InstallScripts.completion({ conf: { argv: { remain: argv } } })

  t.resolveMatch(comp(['npm', 'install-scripts']), ['approve', 'deny', 'ls', 'prune'])
  t.resolveMatch(comp(['npm', 'install-scripts', 'approve']), [])
  t.resolveMatch(comp(['npm', 'install-scripts', 'deny']), [])
  t.resolveMatch(comp(['npm', 'install-scripts', 'ls']), [])
  t.resolveMatch(comp(['npm', 'install-scripts', 'prune']), [])
  await t.rejects(comp(['npm', 'install-scripts', 'frobnicate']), {
    message: 'frobnicate not recognized',
  })
})

t.test('install-scripts approve <pkg> writes a pinned entry', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await npm.exec('install-scripts', ['approve', 'canvas'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { 'canvas@1.0.0': true })
})

t.test('install-scripts approve <pkg> writes exact URL for a remote tarball', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: remoteCypressUrl },
    }),
  })
  await npm.exec('install-scripts', ['approve', 'cypress'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [remoteCypressUrl]: true })
})

t.test('install-scripts approve <pkg> selects a remote tarball by installed name', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: registryShapedRemoteCypressUrl },
    }),
  })
  await npm.exec('install-scripts', ['approve', 'cypress'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [registryShapedRemoteCypressUrl]: true })
})

t.test('install-scripts approve rejects a name shared by distinct remote sources', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupDistinctRemoteSourcesProject(),
  })

  await t.rejects(
    npm.exec('install-scripts', ['approve', 'tool']),
    {
      code: 'EINSTALLSCRIPTSAMBIGUOUS',
      message: /tool.*multiple sources/i,
    }
  )

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk('allowScripts' in pkg)
})

t.test('install-scripts does not select unnamed untrusted candidates', async t => {
  const { npm, logs, clearLogs } = await mockProjectWithInventory(t, {
    located: {
      location: 'node_modules/located',
      resolved: null,
    },
    anonymous: {
      resolved: null,
    },
  })

  for (const selector of ['node_modules/located', '<untrusted source>']) {
    clearLogs()
    await t.rejects(
      npm.exec('install-scripts', ['approve', selector]),
      { code: 'ENOMATCH' }
    )
    t.strictSame(logs.warn, [], `${selector} was not selected`)
  }
})

t.test('install-scripts approve accepts an exact remote source selector', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupDistinctRemoteSourcesProject(),
  })

  await npm.exec('install-scripts', ['approve', topLevelToolUrl])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [topLevelToolUrl]: true })
})

t.test('install-scripts approve does not trust remote manifest versions as selectors', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: remoteCypressUrl },
    }),
  })

  await t.rejects(
    npm.exec('install-scripts', ['approve', 'cypress@1.0.0']),
    { code: 'ENOMATCH' }
  )

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk('allowScripts' in pkg)
})

t.test('install-scripts non-bare registry selectors cannot select remote dependencies', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: remoteCypressUrl },
    }),
  })

  for (const selector of [
    'cypress@',
    'cypress@*',
    'cypress@latest',
    'cypress@npm:other@1.0.0',
  ]) {
    await t.rejects(
      npm.exec('install-scripts', ['approve', selector]),
      { code: 'ENOMATCH' },
      selector
    )
  }

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk('allowScripts' in pkg)
})

t.test('install-scripts deny blocks every exact source sharing an installed name', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupDistinctRemoteSourcesProject(),
  })

  await npm.exec('install-scripts', ['deny', 'tool'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, {
    [nestedToolUrl]: false,
    [topLevelToolUrl]: false,
  })
})

t.test('install-scripts positional selection skips Link wrappers', async t => {
  const target = toolSourceNode(topLevelToolUrl)
  const link = {
    name: 'tool',
    version: '1.0.0',
    resolved: 'file:.store/tool',
    isLink: true,
    isRegistryDependency: false,
  }
  const { npm, prefix } = await mockProjectWithInventory(t, { link, target })

  await npm.exec('install-scripts', ['approve', 'tool'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [topLevelToolUrl]: true })
})

t.test('install-scripts positional selection skips inert nodes', async t => {
  const available = toolSourceNode(topLevelToolUrl)
  const inert = toolSourceNode(nestedToolUrl, { inert: true })
  const { npm, prefix } = await mockProjectWithInventory(t, { available, inert })

  await npm.exec('install-scripts', ['approve', 'tool'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [topLevelToolUrl]: true })
})

t.test('install-scripts approve --all approves every unreviewed package', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas', 'sharp'] }),
    config: { all: true },
  })
  await npm.exec('install-scripts', ['approve'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, {
    'canvas@1.0.0': true,
    'sharp@1.0.0': true,
  })
})

t.test('install-scripts approve --all writes exact URL for a remote tarball', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: remoteCypressUrl },
    }),
    config: { all: true },
  })
  await npm.exec('install-scripts', ['approve'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [remoteCypressUrl]: true })
})

t.test('install-scripts approve --all allows distinct same-name remote sources explicitly', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupDistinctRemoteSourcesProject(),
    config: { all: true },
  })

  await npm.exec('install-scripts', ['approve'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, {
    [nestedToolUrl]: true,
    [topLevelToolUrl]: true,
  })
})

t.test('install-scripts approve allows multiple commits from one hosted repository', async t => {
  const firstCommit = 'github:example/tool#deadbeef'
  const secondCommit = 'github:example/tool#cafebabe'
  const { npm, prefix } = await mockProjectWithInventory(t, {
    firstCommit: toolSourceNode(firstCommit),
    secondCommit: toolSourceNode(secondCommit),
  })

  await npm.exec('install-scripts', ['approve', 'tool'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [firstCommit]: true, [secondCommit]: true })
})

t.test('install-scripts exact git selector approves only the selected commit', async t => {
  const firstCommit = 'github:example/tool#deadbeef'
  const secondCommit = 'github:example/tool#cafebabe'
  const { npm, prefix } = await mockProjectWithInventory(t, {
    firstCommit: toolSourceNode(firstCommit),
    secondCommit: toolSourceNode(secondCommit),
  })

  await npm.exec('install-scripts', ['approve', firstCommit])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [firstCommit]: true })
})

t.test('install-scripts exact git selector replaces a broad repository approval', async t => {
  const commit = 'github:example/tool#deadbeef'
  const repository = 'github:example/tool'
  const { npm, prefix } = await mockProjectWithInventory(t, {
    commit: toolSourceNode(commit),
  })
  fs.writeFileSync(resolve(prefix, 'package.json'), JSON.stringify({
    name: 'host',
    version: '1.0.0',
    allowScripts: { [repository]: true },
  }))

  await npm.exec('install-scripts', ['approve', commit])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [commit]: true })
})

t.test('install-scripts approve rejects same-name dependencies from different git repositories', async t => {
  const firstRepositoryCommit = 'github:example/tool#deadbeef'
  const secondRepositoryCommit = 'github:attacker/tool#cafebabe'
  const { npm, prefix } = await mockProjectWithInventory(t, {
    firstRepositoryCommit: toolSourceNode(firstRepositoryCommit),
    secondRepositoryCommit: toolSourceNode(secondRepositoryCommit),
  })

  await t.rejects(
    npm.exec('install-scripts', ['approve', 'tool']),
    { code: 'EINSTALLSCRIPTSAMBIGUOUS' }
  )

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk('allowScripts' in pkg)
})

t.test('install-scripts ambiguity lists an exact selector for registry matches', async t => {
  const { npm } = await mockProjectWithInventory(t, mixedRegistryRemoteInventory())

  await t.rejects(
    npm.exec('install-scripts', ['approve', 'tool']),
    {
      code: 'EINSTALLSCRIPTSAMBIGUOUS',
      message: new RegExp(
        `tool@1\\.0\\.0[\\s\\S]*${topLevelToolUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
      ),
    }
  )
})

t.test('install-scripts registry version selector disambiguates a remote name collision', async t => {
  const { npm, prefix } = await mockProjectWithInventory(t, mixedRegistryRemoteInventory())

  await npm.exec('install-scripts', ['approve', 'tool@1.0.0'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { 'tool@1.0.0': true })
})

t.test('install-scripts approve rejects distinct linked file sources with one name', async t => {
  const inventory = {
    good: linkedFileNode('file:../good-tool', 'node_modules/tool'),
    attacker: linkedFileNode(
      'file:../attacker-tool',
      'node_modules/parent/node_modules/tool'
    ),
  }
  const { npm, prefix } = await mockProjectWithInventory(t, inventory)

  await t.rejects(
    npm.exec('install-scripts', ['approve', 'tool']),
    { code: 'EINSTALLSCRIPTSAMBIGUOUS' }
  )

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk('allowScripts' in pkg)
})

t.test('install-scripts exact resolver identity disambiguates linked targets', async t => {
  const exactSource = 'file:../good-tool'
  const inventory = {
    good: linkedFileNode(exactSource, 'node_modules/tool'),
    attacker: linkedFileNode(
      'file:../attacker-tool',
      'node_modules/parent/node_modules/tool'
    ),
  }
  const { npm, prefix } = await mockProjectWithInventory(t, inventory)

  await npm.exec('install-scripts', ['approve', exactSource])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [exactSource]: true })
})

const multiLinkFileNode = () => {
  const rootPath = resolve('project')
  const targetPath = resolve(rootPath, '../shared')
  const firstLinkPath = resolve(rootPath, 'node_modules/first')
  const secondLinkPath = resolve(rootPath, 'node_modules/second')
  const firstSource = 'file:../shared'
  const secondSource = 'file:vendor/shared'
  const root = {
    path: rootPath,
    meta: {
      get: nodePath => ({
        [firstLinkPath]: { resolved: firstSource, link: true },
        [secondLinkPath]: { resolved: secondSource, link: true },
      })[nodePath] || {},
    },
  }
  return {
    name: 'shared',
    version: '1.0.0',
    resolved: null,
    isRegistryDependency: false,
    path: targetPath,
    realpath: targetPath,
    root,
    linksIn: new Set([
      { path: firstLinkPath, resolved: firstSource, root },
      { path: secondLinkPath, resolved: secondSource, root },
    ]),
  }
}

t.test('install-scripts exact resolver identity approves a multi-link target', async t => {
  const target = multiLinkFileNode()
  const firstSource = 'file:../shared'
  const { npm, prefix } = await mockProjectWithInventory(t, { target })
  await npm.exec('install-scripts', ['approve', firstSource])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [firstSource]: true })
})

t.test('install-scripts denies every selected identity of a multi-link target', async t => {
  for (const sources of [
    ['file:../shared', 'file:vendor/shared'],
    ['file:vendor/shared', 'file:../shared'],
  ]) {
    await t.test(sources.join(' then '), async t => {
      const { npm, prefix } = await mockProjectWithInventory(t, { target: multiLinkFileNode() })
      await npm.exec('install-scripts', ['deny', ...sources])

      const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
      t.strictSame(pkg.allowScripts, {
        'file:../shared': false,
        'file:vendor/shared': false,
      })
    })
  }
})

t.test('install-scripts file selectors write the matching lockfile identity', async t => {
  for (const source of ['file:../shared', 'file:vendor/shared']) {
    for (const filePrefix of ['', 'file:']) {
      await t.test(`${filePrefix || 'absolute path: '}${source}`, async t => {
        const target = multiLinkFileNode()
        const selector = `${filePrefix}${resolve(target.root.path, source.slice('file:'.length))}`
        const { npm, prefix } = await mockProjectWithInventory(t, { target })
        await npm.exec('install-scripts', ['approve', selector])

        const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
        t.strictSame(pkg.allowScripts, { [source]: true })
      })
    }
  }
})

t.test('install-scripts exposes every identity for a multi-link target', async t => {
  for (const json of [false, true]) {
    await t.test(json ? 'json' : 'text', async t => {
      const target = multiLinkFileNode()
      const { npm, joinedOutput } = await mockProjectWithInventory(t, { target }, {
        config: { json },
        unreviewed: [{ node: target, scripts: { install: 'echo install' } }],
      })
      await npm.exec('install-scripts', ['ls'])
      if (json) {
        t.strictSame(JSON.parse(joinedOutput()), {
          allowScripts: [{
            name: 'shared',
            changes: [
              { key: 'file:../shared', change: 'pending' },
              { key: 'file:vendor/shared', change: 'pending' },
            ],
          }],
        })
      } else {
        t.match(joinedOutput(), /file:\.\.\/shared/)
        t.match(joinedOutput(), /file:vendor\/shared/)
        t.notMatch(joinedOutput(), /untrusted source/)
      }
    })
  }
  for (const verb of ['approve', 'deny']) {
    await t.test(`${verb} requires an exact identity`, async t => {
      const { npm } = await mockProjectWithInventory(t, { target: multiLinkFileNode() })
      await t.rejects(npm.exec('install-scripts', [verb, 'shared']), {
        code: 'EINSTALLSCRIPTSAMBIGUOUS',
        message: /file:\.\.\/shared[\s\S]*file:vendor\/shared/,
      })
    })
  }
  const target = multiLinkFileNode()
  const { npm, prefix, logs } = await mockProjectWithInventory(t, { target }, {
    config: { all: true },
    unreviewed: [{ node: target, scripts: { install: 'echo install' } }],
  })
  await npm.exec('install-scripts', ['approve'])
  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk(pkg.allowScripts)
  t.match(logs.warn.byTitle('install-scripts').join('\n'),
    /exact source selector: file:\.\.\/shared, file:vendor\/shared/)
})

t.test('install-scripts exact file selectors do not cross path anchors', async t => {
  const outside = linkedFileNode('file:../tool', 'node_modules/outside')
  const inside = linkedFileNode('file:tool', 'node_modules/inside')
  for (const link of inside.linksIn) {
    link.resolved = 'file:../tool'
  }
  const { npm, prefix } = await mockProjectWithInventory(t, { outside, inside })
  await npm.exec('install-scripts', ['approve', 'file:../tool'])
  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  const isScriptAllowed = require('../../../workspaces/arborist/lib/script-allowed.js')
  t.equal(isScriptAllowed(outside, pkg.allowScripts), true)
  t.equal(isScriptAllowed(inside, pkg.allowScripts), null)
})

t.test('install-scripts non-bare selectors do not select local links by link name', async t => {
  const target = {
    ...linkedFileNode('file:../local-tool', 'node_modules/foo'),
    name: 'local-tool',
  }
  const inventory = {
    link: {
      isLink: true,
      name: 'foo',
      target,
    },
  }
  const { npm, prefix } = await mockProjectWithInventory(t, inventory)

  for (const selector of ['foo@*', 'foo@latest', 'foo@npm:bar@1.0.0']) {
    await t.rejects(
      npm.exec('install-scripts', ['approve', selector]),
      { code: 'ENOMATCH' }
    )
  }

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk('allowScripts' in pkg)
})

t.test('install-scripts deny <pkg> writes a name-only false entry', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await npm.exec('install-scripts', ['deny', 'canvas'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { canvas: false })
})

t.test('install-scripts deny <pkg> writes exact URL for a remote tarball', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: remoteCypressUrl },
    }),
  })
  await npm.exec('install-scripts', ['deny', 'cypress'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [remoteCypressUrl]: false })
})

t.test('install-scripts deny --all denies every unreviewed package', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas', 'sharp'] }),
    config: { all: true },
  })
  await npm.exec('install-scripts', ['deny'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { canvas: false, sharp: false })
})

t.test('install-scripts deny --all writes exact URL for a remote tarball', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: remoteCypressUrl },
    }),
    config: { all: true },
  })
  await npm.exec('install-scripts', ['deny'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { [remoteCypressUrl]: false })
})

t.test('install-scripts ignores allow-scripts-pending and still writes', async t => {
  // The namespace exposes listing through `ls`, so a stray
  // `allow-scripts-pending` config must not divert approve into list mode.
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
    config: { 'allow-scripts-pending': true },
  })
  await npm.exec('install-scripts', ['approve', 'canvas'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { 'canvas@1.0.0': true })
})

t.test('install-scripts ls lists unreviewed packages', async t => {
  const { npm, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas', 'sharp'] }),
  })
  await npm.exec('install-scripts', ['ls'])
  const out = joinedOutput()
  t.match(out, /2 packages have install scripts blocked because they are not covered by allowScripts/)
  t.match(out, /canvas@1\.0\.0/)
  t.match(out, /sharp@1\.0\.0/)
})

t.test('install-scripts ls shows installed name and exact source for remote tarballs', async t => {
  const { npm, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: registryShapedRemoteCypressUrl },
    }),
  })

  await npm.exec('install-scripts', ['ls'])

  const out = joinedOutput()
  t.match(out, /cypress/)
  t.match(out, new RegExp(registryShapedRemoteCypressUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  t.notMatch(out, /artifact@1\.0\.0/)
})

t.test('install-scripts ls --json exposes exact remote source selectors', async t => {
  const { npm, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['cypress'],
      remoteUrls: { cypress: registryShapedRemoteCypressUrl },
    }),
    config: { json: true },
  })

  await npm.exec('install-scripts', ['ls'])

  t.strictSame(JSON.parse(joinedOutput()), {
    allowScripts: [{
      name: 'cypress',
      changes: [{ key: registryShapedRemoteCypressUrl, change: 'pending' }],
    }],
  })
})

t.test('install-scripts ls lists extraneous packages on disk', async t => {
  for (const json of [false, true]) {
    await t.test(json ? 'json' : 'text', async t => {
      const { npm, joinedOutput } = await mockNpm(t, {
        prefixDir: setupProject({ extraneous: true }),
        config: { json },
      })
      await npm.exec('install-scripts', ['ls'])
      if (json) {
        t.strictSame(JSON.parse(joinedOutput()), {
          allowScripts: [{
            name: 'canvas',
            changes: [{ key: 'canvas@1.0.0', change: 'pending' }],
          }],
        })
      } else {
        t.match(joinedOutput(), /1 package has install scripts blocked/)
        t.match(joinedOutput(), /canvas@1\.0\.0/)
      }
    })
  }
})

t.test('install-scripts ls with no unreviewed says so', async t => {
  const { npm, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({ allowScripts: { canvas: true }, withScripts: ['canvas'] }),
  })
  await npm.exec('install-scripts', ['ls'])
  t.match(joinedOutput(), /No packages with unreviewed install scripts/)
})

t.test('install-scripts ls rejects positional args', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await t.rejects(
    npm.exec('install-scripts', ['ls', 'canvas']),
    /cannot be combined with positional arguments/
  )
})

t.test('install-scripts with no subcommand errors with usage', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await t.rejects(
    npm.exec('install-scripts', []),
    { code: 'EUSAGE' }
  )
})

t.test('install-scripts with an unknown subcommand errors', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await t.rejects(
    npm.exec('install-scripts', ['frobnicate']),
    /`frobnicate` is not a recognized subcommand/
  )
})

t.test('install-scripts approve errors on unknown package', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await t.rejects(
    npm.exec('install-scripts', ['approve', 'not-installed']),
    { code: 'ENOMATCH' }
  )
})

t.test('install-scripts fails for global installs', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
    config: { global: true },
  })
  await t.rejects(
    npm.exec('install-scripts', ['approve', 'canvas']),
    { code: 'EGLOBAL' }
  )
})

t.test('install-scripts prune removes not-installed and no-script entries', async t => {
  const { npm, prefix, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['canvas'],
      noScripts: ['no-scripts-pkg'],
      allowScripts: {
        'canvas@1.0.0': true,
        'no-scripts-pkg': true,
        gone: true,
      },
    }),
  })
  await npm.exec('install-scripts', ['prune'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { 'canvas@1.0.0': true })

  const out = joinedOutput()
  t.match(out, /Removed 2 unused allowScripts entries:/)
  t.match(out, /no-scripts-pkg \(no install scripts\)/)
  t.match(out, /gone \(package not installed\)/)
})

t.test('install-scripts prune removes unused deny entries too', async t => {
  const { npm, prefix } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['canvas'],
      allowScripts: { 'canvas@1.0.0': true, 'denied-gone': false },
    }),
  })
  await npm.exec('install-scripts', ['prune'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { 'canvas@1.0.0': true })
})

t.test('install-scripts prune removes a stale version pin and drops the field', async t => {
  const { npm, prefix, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['canvas'],
      allowScripts: { 'canvas@9.9.9': true },
    }),
  })
  await npm.exec('install-scripts', ['prune'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.notOk('allowScripts' in pkg, 'allowScripts field is removed when empty')
  // Singular wording for a single entry.
  t.match(joinedOutput(), /Removed 1 unused allowScripts entry:/)
})

t.test('install-scripts prune --dry-run reports without writing', async t => {
  const allowScripts = { 'canvas@1.0.0': true, gone: true }
  const { npm, prefix, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'], allowScripts }),
    config: { 'dry-run': true },
  })
  await npm.exec('install-scripts', ['prune'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, allowScripts, 'package.json is unchanged')
  t.match(joinedOutput(), /Would remove 1 unused allowScripts entry:/)
})

t.test('install-scripts prune --json emits a machine-readable summary', async t => {
  const { npm, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['canvas'],
      allowScripts: { 'canvas@1.0.0': true, gone: true },
    }),
    config: { json: true },
  })
  await npm.exec('install-scripts', ['prune'])

  t.strictSame(JSON.parse(joinedOutput()), {
    allowScripts: {
      removed: [{ key: 'gone', value: true, reason: 'not-installed' }],
      dryRun: false,
    },
  })
})

t.test('install-scripts prune with nothing unused says so', async t => {
  const { npm, prefix, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({
      withScripts: ['canvas'],
      allowScripts: { 'canvas@1.0.0': true },
    }),
  })
  await npm.exec('install-scripts', ['prune'])

  const pkg = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(pkg.allowScripts, { 'canvas@1.0.0': true })
  t.match(joinedOutput(), /No unused allowScripts entries\./)
})

t.test('install-scripts prune with no allowScripts field says so', async t => {
  const { npm, joinedOutput } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await npm.exec('install-scripts', ['prune'])
  t.match(joinedOutput(), /No unused allowScripts entries\./)
})

t.test('install-scripts prune rejects positional args', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
  })
  await t.rejects(
    npm.exec('install-scripts', ['prune', 'canvas']),
    /cannot be combined with positional arguments/
  )
})

t.test('install-scripts prune rejects --all', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
    config: { all: true },
  })
  await t.rejects(
    npm.exec('install-scripts', ['prune']),
    /cannot be combined with positional arguments or `--all`/
  )
})

t.test('install-scripts prune fails for global installs', async t => {
  const { npm } = await mockNpm(t, {
    prefixDir: setupProject({ withScripts: ['canvas'] }),
    config: { global: true },
  })
  await t.rejects(
    npm.exec('install-scripts', ['prune']),
    { code: 'EGLOBAL' }
  )
})

t.test('install-scripts prune under linked strategy keeps the registry pin, drops store paths', async t => {
  // Regression for npm/cli#9939: the buggy writer produced file:.store keys; prune must drop those and keep the valid registry pin covering the store package.
  const storeDir = 'canvas@1.0.0-c2FsdHNhbHRzYWx0c2FsdA'
  const storeLoc = `node_modules/.store/${storeDir}/node_modules/canvas`
  const tarUrl = 'https://registry.npmjs.org/canvas/-/canvas-1.0.0.tgz'
  const pkg = {
    name: 'host',
    version: '1.0.0',
    dependencies: { canvas: '^1.0.0' },
    allowScripts: {
      'canvas@1.0.0': true,
      [`file:.store/${storeDir}/node_modules/canvas`]: true,
    },
  }
  const { npm, prefix, joinedOutput } = await mockNpm(t, {
    prefixDir: {
      'package.json': JSON.stringify(pkg, null, 2),
      node_modules: {
        '.package-lock.json': JSON.stringify({
          lockfileVersion: 3,
          requires: true,
          packages: {
            [`node_modules/.store/${storeDir}`]: {},
            [storeLoc]: {
              version: '1.0.0',
              resolved: tarUrl,
              hasInstallScript: true,
            },
            'node_modules/canvas': {
              resolved: storeLoc,
              link: true,
            },
          },
        }),
        '.store': {
          [storeDir]: {
            node_modules: {
              canvas: {
                'package.json': JSON.stringify({
                  name: 'canvas',
                  version: '1.0.0',
                  scripts: { install: 'echo install' },
                }),
              },
            },
          },
        },
        canvas: t.fixture('symlink', `.store/${storeDir}/node_modules/canvas`),
      },
    },
  })
  // loadActual only trusts the hidden lockfile when it is newer than every dir under node_modules (assertNoNewer allows 10ms), and fixture creation order makes that racy, so bump its mtime past the fixture writes.
  const future = new Date(Date.now() + 60_000)
  fs.utimesSync(resolve(prefix, 'node_modules', '.package-lock.json'), future, future)
  await npm.exec('install-scripts', ['prune'])

  const updated = JSON.parse(fs.readFileSync(resolve(prefix, 'package.json'), 'utf8'))
  t.strictSame(updated.allowScripts, { 'canvas@1.0.0': true })
  t.match(joinedOutput(), /file:\.store.*\(package not installed\)/)
})
