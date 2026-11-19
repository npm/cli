const t = require('tap')
const fs = require('node:fs')
const { join } = require('node:path')
const Arborist = require('../lib/arborist')
const MockRegistry = require('@npmcli/mock-registry')
const { collectUnreviewedScripts } = require('../lib/unreviewed-scripts.js')

for (const installStrategy of ['hoisted', 'linked']) {
  for (const owner of ['root', 'workspace']) {
    for (const approved of [false, true]) {
      t.test(`${owner} bundle scripts ${installStrategy} approved=${approved}`, async t => {
        const bundle = { dependencies: { 'build-me': '1.0.0' }, bundleDependencies: ['build-me'] }
        const graph = {
          registry: [{
            name: 'build-me',
            version: '1.0.0',
            scripts: { install: 'node -e "require(\'node:fs\').writeFileSync(\'built.txt\', \'ok\')"' },
          }],
          root: { name: 'project', version: '1.0.0', ...bundle },
        }
        if (owner === 'workspace') {
          graph.root = { name: 'project', version: '1.0.0', dependencies: { ws: '*' } }
          graph.workspaces = [{ name: 'ws', version: '1.0.0', ...bundle }]
        }
        const project = { 'package.json': JSON.stringify({
          ...graph.root, ...(owner === 'workspace' ? { workspaces: ['packages/*'] } : {}),
        }) }
        if (owner === 'workspace') {
          project.packages = { ws: { 'package.json': JSON.stringify(graph.workspaces[0]) } }
        }
        const fixture = t.testdir({
          project, source: { 'package.json': JSON.stringify(graph.registry[0]) }, cache: {},
        })
        const registry = new MockRegistry({ tap: t, registry: 'https://registry.npmjs.org', strict: true })
        const manifest = registry.manifest({ name: 'build-me', packuments: [graph.registry[0]] })
        await registry.package({ manifest, tarballs: { '1.0.0': join(fixture, 'source') } })
        const arb = new Arborist({
          path: join(fixture, 'project'),
          registry: registry.origin,
          cache: join(fixture, 'cache'),
          packumentCache: new Map(),
          audit: false,
          allowScripts: approved ? { 'build-me@1.0.0': true } : {},
        })
        await arb.buildIdealTree()
        const pending = await collectUnreviewedScripts({ tree: arb.idealTree })
        t.same(pending.map(({ node }) => node.name), ['build-me'], 'local bundle is reviewable')
        await arb.reify({ installStrategy })
        const installed = [...arb.actualTree.inventory.values()].find(node => node.name === 'build-me')
        t.ok(installed, 'bundle dependency is installed')
        t.equal(fs.existsSync(join(installed.path, 'built.txt')), approved,
          'only an approved install script runs')
      })
    }
  }
}
