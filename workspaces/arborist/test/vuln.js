const t = require('tap')
const Vuln = require('../lib/vuln.js')
const Node = require('../lib/node.js')
const Link = require('../lib/link.js')
const Edge = require('../lib/edge.js')
const { resolve } = require('path')

const semver = require('semver')
const semverOpt = { includePrerelease: true, loose: true }
class MockAdvisory {
  constructor (obj) {
    Object.assign(this, obj)
    this.vulnerableVersions = this.versions.filter(v =>
      semver.satisfies(v, this.range, semverOpt))
  }

  testVersion (v) {
    return this.vulnerableVersions.includes(v)
  }
}

t.test('basic vulnerability object tests', async t => {
  const crit = new MockAdvisory({
    type: 'advisory',
    source: 420,
    id: 'cafebad',
    title: 'borgsafalamash',
    name: 'name',
    dependency: 'name',
    severity: 'critical',
    range: '1.x < 1.3',
    versions: [
      '0.0.1',
      '0.0.2',
      '0.0.3',
      '0.1.0',
      '1.0.0',
      '1.0.1',
      '1.1.0',
      '1.2.0',
      '1.2.1',
      '2.0.0',
      '2.0.1',
      '2.1.0',
      '2.2.0',
      '2.2.0-pre.0',
      '3.0.0-pre.0',
      '3.0.0-pre.1',
      '3.0.0',
      '3.0.1',
      '3.1.0',
      '3.2.0',
    ],
  })

  const low = new MockAdvisory({
    type: 'advisory',
    source: 69,
    id: 'deadbeef',
    title: 'flerbygurrf',
    name: 'name',
    dependency: 'name',
    severity: 'low',
    range: '2.x < 2.3.2 || 3.x <3.0.1',
    versions: [
      '0.0.1',
      '0.0.2',
      '0.0.3',
      '0.1.0',
      '1.0.0',
      '1.0.1',
      '1.1.0',
      '1.2.0',
      '1.2.1',
      '2.0.0',
      '2.0.1',
      '2.1.0',
      '2.2.0',
      '2.2.0-pre.0',
      '3.0.0-pre.0',
      '3.0.0-pre.1',
      '3.0.0',
      '3.0.1',
      '3.1.0',
      '3.2.0',
    ],
  })

  const v = new Vuln({ name: 'name', advisory: crit })
  t.type(v, Vuln)
  t.equal(v.testSpec('github:foo/bar'), true)
  t.equal(v.testSpec('0.x'), false)
  t.equal(v.testSpec('>4.x'), true)
  t.equal(v.testSpec('npm:name@>4.x'), true)
  t.strictSame([...v.advisories], [crit])
  t.equal(v.severity, 'critical')
  v.addAdvisory(low)
  t.equal(v.testSpec('2.x'), true)
  t.equal(v.severity, 'critical')
  t.match(v.advisories, new Set([crit, low]))
  v.deleteAdvisory(crit)
  t.equal(v.severity, 'low')
  t.match(v.advisories, new Set([low]))
  v.addAdvisory(crit)
  t.equal(v.severity, 'critical')
  t.match(v.advisories, new Set([crit, low]))
  t.matchSnapshot(JSON.stringify(v, 0, 2), 'json formatted')

  const meta = new MockAdvisory({
    type: 'metavuln',
    source: 'deadbeef',
    severity: 'low',
    name: 'another',
    dependency: 'name',
    range: '1.x',
    versions: [
      '0.0.0',
      '1.0.0',
      '1.0.1',
      '1.0.2',
      '2.0.0',
      '2.0.1',
      '3.0.0',
    ],
  })

  const meta2 = new MockAdvisory({
    type: 'metavuln',
    source: 'cafebad',
    severity: 'critical',
    name: 'another',
    dependency: 'name',
    range: '>1.0.0 <=2.0.1',
    versions: [
      '0.0.0',
      '1.0.0',
      '1.0.1',
      '2.0.0',
      '2.0.1',
      '3.0.0',
    ],
  })

  const v2 = new Vuln({ name: 'another', advisory: meta })
  v2.addVia(v)
  t.matchSnapshot(JSON.stringify(v), 'json after adding effect')
  t.match(v2.advisories, new Set([meta]))
  t.equal(v2.range, meta.range)

  v2.addAdvisory(meta2)
  t.equal(v2.range, [meta.range, meta2.range].join(' || '))

  // when the simple range is loaded, it memoizes and sets range as well
  t.equal(v2.simpleRange, '1.0.0 - 2.0.1')
  t.equal(v2.range, v2.simpleRange)

  const root = new Node({
    path: '/path/to',
    pkg: {
      dependencies: { thing: '1.2.1' },
      workspaces: [
        'packages/foo',
      ],
    },
  })

  // a workspace with one direct vuln and one indirect vuln
  const ws = new Node({
    pkg: { name: 'foo', version: '1.2.3', dependencies: { bar: '' } },
    path: resolve(root.path, 'packages/foo'),
    root,
    children: [
      { pkg: { name: 'bar', version: '1.2.3', dependencies: { baz: '' } } },
      { pkg: { name: 'baz', version: '1.2.3' } },
    ],
  })

  // manually connect the workspace
  new Link({
    name: 'foo',
    parent: root,
    target: ws,
  })
  new Edge({
    type: 'workspace',
    name: 'foo',
    spec: 'file:packages/foo',
    from: root,
  })

  const directWsVuln = new Vuln({
    name: 'bar',
    advisory: new MockAdvisory({
      name: 'bar',
      versions: ['1.2.2', '1.2.3', '1.2.4'],
      range: '<=1.2.3',
    }),
  })
  const indirectWsVuln = new Vuln({
    name: 'baz',
    advisory: new MockAdvisory({
      name: 'baz',
      versions: ['1.2.2', '1.2.3', '1.2.4'],
      range: '<=1.2.3',
    }),
  })
  // workspace dep vulns are direct vulnerabilities as well
  t.equal(directWsVuln.isVulnerable(ws.children.get('bar')), true)
  t.equal(directWsVuln.isDirect, true)
  t.equal(indirectWsVuln.isVulnerable(ws.children.get('baz')), true)
  t.equal(indirectWsVuln.isDirect, false)

  const node = new Node({
    path: '/path/to/node_modules/thing',
    name: 'thing',
    pkg: {
      name: 'name',
      version: '1.2.1',
    },
    parent: root,
  })

  // check twice to hit memoizing code path
  t.equal(v.isVulnerable(node), true)
  t.equal(v.isVulnerable(node), true)
  t.equal(v.isDirect, true)
  t.match(v.nodes, new Set([node]))

  // make sure we don't infinitely loop when setting it to true
  v.addVia(v2)
  v2.fixAvailable = true
  v.fixAvailable = true
  v2.fixAvailable = true
  v.deleteVia(v2)

  v2.fixAvailable = { isSemVerMajor: false }
  t.strictSame(v.fixAvailable, { isSemVerMajor: false })
  v2.fixAvailable = true
  t.strictSame(v.fixAvailable, { isSemVerMajor: false })
  v2.fixAvailable = { isSemVerMajor: true }
  t.strictSame(v.fixAvailable, { isSemVerMajor: true })
  v2.fixAvailable = false
  t.strictSame(v.fixAvailable, false)

  t.matchSnapshot(JSON.stringify(v, 0, 2), 'json formatted after loading')
  t.matchSnapshot(JSON.stringify(v2, 0, 2), 'json formatted metavuln')

  const ok = new Node({
    path: '/path/to/node_modules/thing',
    pkg: {
      name: 'name',
      version: '3.2.0',
    },
  })
  t.match(v.isVulnerable(ok), false)

  const noVersion = new Node({
    path: '/path/to/node_modules/thing',
    pkg: {},
  })
  t.match(v.isVulnerable(noVersion), false, 'node without version, no opinion')

  v2.deleteAdvisory(meta2)
  v2.deleteAdvisory(meta)
  t.strictSame([...v2.via], [], 'removing advisories removes via')
  t.strictSame([...v.effects], [], 'removing via removes effect')
})
