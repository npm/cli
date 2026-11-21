const t = require('tap')
const fs = require('node:fs')
const { join } = require('node:path')
const { createRequire } = require('node:module')
const pacote = require('pacote')
const MockRegistry = require('@npmcli/mock-registry')
const Arborist = require('../..')

const setup = async (t, dependencyType, workspace = false) => {
  const packages = {
    chosen: {
      dependencies: { child: '1.0.0' },
      optionalDependencies: { extra: '1.0.0' },
    },
    child: {},
    extra: {},
    unrelated: {},
  }
  const project = {
    name: 'project',
    version: '1.0.0',
    [dependencyType]: { chosen: '1.0.0', unrelated: '1.0.0' },
  }
  const path = t.testdir({
    'package.json': JSON.stringify(workspace
      ? { name: 'root', workspaces: ['workspace'] } : project),
    ...(workspace ? { workspace: { 'package.json': JSON.stringify(project) } } : {}),
    packages: Object.fromEntries(Object.entries(packages).map(([name, deps]) => [name, {
      'package.json': JSON.stringify({ name, version: '1.0.0', ...deps }),
      'index.js': name === 'chosen' ? 'module.exports = require("child")' : 'module.exports = "child"',
    }])),
  })
  const registry = new MockRegistry({ tap: t, registry: 'https://registry.npmjs.org' })
  for (const [name, deps] of Object.entries(packages)) {
    const manifest = registry.manifest({ name, packuments: [{ version: '1.0.0', ...deps }] })
    registry.nock.get(`/${name}`).optionally().reply(200, manifest)
    registry.nock.get(`/${name}/-/${name}-1.0.0.tgz`).optionally().reply(200,
      await pacote.tarball(join(path, 'packages', name), { Arborist }))
  }
  return { path, projectPath: workspace ? join(path, 'workspace') : path, project }
}

for (const installStrategy of ['hoisted', 'linked']) {
  for (const dependencyType of ['optionalDependencies', 'devDependencies', 'peerDependencies']) {
    t.test(`${installStrategy}: explicitly install an omitted ${dependencyType}`, async t => {
      const { path, projectPath, project } = await setup(t, dependencyType)
      const options = {
        path,
        installStrategy,
        audit: false,
        cache: join(path, 'cache'),
        ignoreScripts: true,
        omit: ['optional', 'dev', 'peer'],
        save: false,
      }
      const arb = new Arborist(options)
      await arb.reify({ ...options, add: ['chosen'] })
      const requireFromProject = createRequire(join(projectPath, 'package.json'))
      t.equal(requireFromProject('chosen'), 'child', 'requested package can use its dependency')
      const requireFromChosen = createRequire(requireFromProject.resolve('chosen'))
      t.throws(() => requireFromChosen.resolve('extra'), { code: 'MODULE_NOT_FOUND' },
        'the requested package\'s optional dependency remains omitted')
      t.throws(() => requireFromProject.resolve('unrelated'), { code: 'MODULE_NOT_FOUND' },
        'unrequested dependencies remain omitted')
      t.same(JSON.parse(fs.readFileSync(join(projectPath, 'package.json'))), project,
        'no-save preserves the dependency declaration')

      await new Arborist(options).reify(options)
      t.notOk(fs.existsSync(join(path, 'node_modules/chosen')),
        'a later install without an explicit request omits the package again')
    })
  }

  t.test(`${installStrategy}: explicitly install an omitted workspace dependency`, async t => {
    const { path, projectPath } = await setup(t, 'optionalDependencies', true)
    const options = {
      path,
      installStrategy,
      audit: false,
      cache: join(path, 'cache'),
      ignoreScripts: true,
      omit: ['optional'],
      workspaces: ['project'],
      save: false,
    }
    await new Arborist(options).reify({ ...options, add: ['chosen'] })
    const requireFromProject = createRequire(join(projectPath, 'package.json'))
    t.equal(requireFromProject('chosen'), 'child', 'selected workspace can use the requested package')
    t.throws(() => requireFromProject.resolve('unrelated'), { code: 'MODULE_NOT_FOUND' })
  })

  t.test(`${installStrategy}: requesting a workspace does not include its dev dependencies`, async t => {
    const { path, projectPath } = await setup(t, 'devDependencies', true)
    fs.writeFileSync(join(path, 'package.json'), JSON.stringify({
      name: 'root',
      workspaces: ['workspace'],
      devDependencies: { project: '1.0.0' },
    }))
    fs.writeFileSync(join(projectPath, 'package.json'), JSON.stringify({
      name: 'project',
      version: '1.0.0',
      dependencies: { chosen: '1.0.0' },
      devDependencies: { unrelated: '1.0.0' },
    }))
    fs.writeFileSync(join(projectPath, 'index.js'), 'module.exports = require("chosen")')
    const options = {
      path,
      installStrategy,
      audit: false,
      cache: join(path, 'cache'),
      ignoreScripts: true,
      omit: ['dev', 'optional'],
      save: false,
    }
    await new Arborist(options).reify({ ...options, add: ['project'] })
    const requireFromRoot = createRequire(join(path, 'package.json'))
    const requireFromWorkspace = createRequire(join(projectPath, 'package.json'))
    t.equal(requireFromRoot('project'), 'child')
    t.throws(() => requireFromWorkspace.resolve('unrelated'), { code: 'MODULE_NOT_FOUND' })
  })
}

t.test('engine-strict still checks an explicitly requested omitted dev dependency', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({ devDependencies: { chosen: '1.0.0' } }),
  })
  const registry = new MockRegistry({ tap: t, registry: 'https://registry.npmjs.org' })
  await registry.package({
    manifest: registry.manifest({
      name: 'chosen',
      packuments: [{ version: '1.0.0', engines: { node: '>=999' } }],
    }),
  })
  const options = { path, cache: path, audit: false, omit: ['dev'], engineStrict: true }
  await t.rejects(new Arborist(options).reify({ ...options, add: ['chosen'] }), { code: 'EBADENGINE' })
})
