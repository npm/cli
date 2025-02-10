const t = require('tap')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const AuditReport = require('../lib/audit-report.js')
const Node = require('../lib/node.js')
const Arborist = require('../')
const MockRegistry = require('@npmcli/mock-registry')

const { join, resolve } = require('node:path')
const fixtures = resolve(__dirname, 'fixtures')

const newArb = (path, opts = {}) => new Arborist({ path, ...opts })

const sortReport = report => {
  const entries = Object.entries(report.vulnerabilities)
  const vulns = entries.sort(([a], [b]) => localeCompare(a, b))
    .map(([name, vuln]) => [
      name,
      {
        ...vuln,
        via: (vuln.via || []).sort((a, b) =>
          localeCompare(String(a.source || a), String(b.source || b))),
        effects: (vuln.effects || []).sort(localeCompare),
      },
    ])
  report.vulnerabilities = vulns.reduce((set, [k, v]) => {
    set[k] = v
    return set
  }, {})
}

const createRegistry = (t) => {
  const registry = new MockRegistry({
    strict: true,
    tap: t,
    registry: 'https://registry.npmjs.org',
  })
  return registry
}

t.test('all severity levels', async t => {
  const path = resolve(fixtures, 'audit-all-severities')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')
  t.equal(report.topVulns.size, 2)
})

t.test('vulnerable dep not from registry', async t => {
  const path = resolve(fixtures, 'minimist-git-dep')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')
  t.equal(report.has('minimist'), true)
  t.equal(report.topVulns.has('minimist'), true)
  t.equal(report.isVulnerable(tree.children.get('minimist')), true)
})

t.test('metavuln where dep is not a registry dep', async t => {
  const path = resolve(fixtures, 'minimist-git-metadep')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')

  t.equal(report.has('@isaacs/minimist-git-dep'), true)
  t.equal(report.has('minimist'), true)
  t.equal(report.topVulns.has('@isaacs/minimist-git-dep'), true)
})

t.test('metavuln where a dep is not on the registry at all', async t => {
  const path = resolve(fixtures, 'audit-missing-packument')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')
  t.equal(report.topVulns.size, 1)
})

t.test('get advisory about node not in tree', async t => {
  // this should never happen, but if it does, we're prepared for it
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  tree.children.get('mkdirp').parent = null
  tree.children.get('nyc').parent = null
  tree.children.get('minimist').parent = null
  new Node({
    parent: tree,
    path: resolve(path, 'node_modules/fooo'),
    pkg: { name: 'fooo', version: '1.2.3' },
  })
  tree.package = { dependencies: {
    fooo: '',
  } }

  const report = await AuditReport.load(tree, arb.options)
  t.equal(report.topVulns.size, 0, 'one top node found vulnerable')
  t.equal(report.size, 0, 'no vulns that were relevant')
  t.equal(report.get('nyc'), undefined)
  t.equal(report.get('mkdirp'), undefined)
})

t.test('unfixable, but not a semver major forced fix', async t => {
  const path = resolve(fixtures, 'mkdirp-pinned')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(fixtures, 'audit-nyc-mkdirp', 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')

  t.equal(report.topVulns.size, 1)
})

t.test('audit outdated nyc and mkdirp', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t)
  registry.audit({ results: require(resolve(path, 'advisory-bulk.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')

  t.throws(() => report.set('foo', 'bar'), {
    message: 'do not call AuditReport.set() directly',
  })

  t.equal(report.topVulns.size, 1, 'one top node found vulnerable')
  t.equal(report.get('nyc').simpleRange, '6.2.0-alpha - 13.1.0')
  t.equal(report.get('mkdirp').simpleRange, '0.4.1 - 0.5.1')
})

t.test('audit outdated nyc and mkdirp with before: option', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t)
  registry.audit({ results: require(resolve(path, 'advisory-bulk.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })

  const cache = t.testdir()
  const arb = newArb(path, { before: new Date('2020-01-01'), cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')

  t.equal(report.topVulns.size, 1, 'one top node found vulnerable')
  t.equal(report.get('nyc').simpleRange, '6.2.0-alpha - 13.1.0')
  t.equal(report.get('mkdirp').simpleRange, '0.4.1 - 0.5.1')
})

t.test('audit returns an error', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t)
  registry.audit({ responseCode: 503, results: 'no audit for you' })

  const logs = []
  const onlog = (...msg) => {
    if (msg[0] === 'http') {
      return
    }
    logs.push(msg)
  }
  process.on('log', onlog)
  t.teardown(() => process.removeListener('log', onlog))

  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.equal(report.report, null, 'did not get audit response')
  t.equal(report.size, 0, 'did not find any vulnerabilities')
  t.match(logs.filter(l => l[1].includes('audit')), [
    [
      'silly',
      'audit',
      'bulk request',
    ],
    [
      'verbose',
      'audit error',
      report.error,
    ],
    ['silly', 'audit error', 'no audit for you'],
  ], 'logged audit failure')
  t.match(report.error, Error)
})

t.test('audit disabled by config', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  createRegistry(t)

  const logs = []
  const onlog = (...msg) => logs.push(msg)
  process.on('log', onlog)
  t.teardown(() => process.removeListener('log', onlog))

  const cache = t.testdir()
  const arb = newArb(path, { audit: false, cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.equal(report.report, null, 'did not get audit response')
  t.equal(report.size, 0, 'did not find any vulnerabilities')
  t.match(logs, [], 'no logs of error')
  t.equal(report.error, null, 'no error encountered')
})

t.test('audit disabled by offline mode', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  createRegistry(t)

  const logs = []
  const onlog = (...msg) => logs.push(msg)
  process.on('log', onlog)
  t.teardown(() => process.removeListener('log', onlog))

  const cache = t.testdir()
  const arb = newArb(path, { offline: true, cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.equal(report.report, null, 'did not get audit response')
  t.equal(report.size, 0, 'did not find any vulnerabilities')
  t.match(logs, [], 'no logs of error')
  t.equal(report.error, null, 'no error encountered')
})

t.test('one vulnerability', async t => {
  const path = resolve(fixtures, 'audit-one-vuln')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')

  t.equal(report.topVulns.size, 0)
})

t.test('a dep vuln that also has its own advisory against it', async t => {
  const path = resolve(fixtures, 'audit-dep-vuln-with-own-advisory')
  const registry = createRegistry(t)
  registry.audit({ convert: true, results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')

  t.equal(report.topVulns.size, 0)
})

t.test('get default opts when loaded without opts', async t => {
  const ar = new AuditReport()
  t.equal(ar.tree, undefined)
  t.strictSame(ar.options, {})
})

t.test('audit report with a lying v5 lockfile', async t => {
  // npm v5 stored the resolved dependency version in the `requires`
  // set, rather than the spec that is actually required.  As a result,
  // a dep may _appear_ to be a metavuln, but when we scan the
  // packument, it turns out that it matches no nodes, and gets deleted.
  const path = resolve(fixtures, 'eslintme')
  const registry = createRegistry(t)
  registry.audit({ results: require(resolve(path, 'audit.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })
  const tree = await arb.loadVirtual()
  const report = await AuditReport.load(tree, arb.options)
  // also try to delete something that just very much is not present
  report.delete('eslint')
  report.delete('eslint')
  t.matchSnapshot(report.toJSON())
})

t.test('omit options', async t => {
  const path = resolve(fixtures, 'audit-omit')
  const omits = [
    [],
    ['dev'],
    ['optional'],
    ['dev', 'optional'],
    ['peer'],
    ['peer', 'dev'],
    ['peer', 'dev', 'optional'], // empty
  ]
  for (const omit of omits) {
    await t.test(`omit=[${omit.join(',')}]`, async t => {
      const cache = t.testdir()
      const arb = newArb(path, { cache })
      const tree = await arb.loadVirtual()
      const registry = createRegistry(t)
      const s = omit.map(o => `-omit${o}`).join('')
      const bulkResults = require(resolve(path, `bulk${s}.json`))
      if (Object.keys(bulkResults).length) { /// peer, dev, optional is empty
        registry.audit({ convert: false, results: bulkResults })
        registry.mocks({ dir: join(__dirname, 'fixtures') })
      }
      const r1 = (await AuditReport.load(tree, { ...arb.options, omit })).toJSON()
      sortReport(r1)
      t.matchSnapshot(r1, 'bulk')
      const r2 = (await AuditReport.load(tree, { ...arb.options, omit })).toJSON()
      sortReport(r2)
      t.strictSame(r1, r2, 'same results')
    })
  }
})

t.test('audit when tree is empty', async t => {
  createRegistry(t)
  const tree = new Node({
    path: '/path/to/tree',
  })
  const auditReport = new AuditReport(tree)
  const { report } = await auditReport.run()
  t.strictSame(report, null)
})

t.test('audit when bulk report doenst have anything in it', async t => {
  createRegistry(t)
  const tree = new Node({
    path: '/path/to/tree',
    pkg: {
      name: 'tree',
      version: '1.2.3',
      devDependencies: { something: '1.2.3' },
    },
    children: [
      { pkg: { name: 'something', version: '1.2.3' } },
    ],
  })
  const auditReport = new AuditReport(tree, { omit: ['dev'] })
  const { report } = await auditReport.run()
  t.strictSame(report, null)
})

t.test('audit supports alias deps', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t)
  registry.audit({ results: require(resolve(path, 'advisory-bulk.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const tree = new Node({
    path,
    pkg: {
      name: 'mkdirp',
      version: '0.5.0',
      dependencies: {
        novulnshereiswear: 'npm:mkdirp@*',
        mkdirp: 'npm:mkdirp@0.5.1',
      },
    },
    children: [
      {
        name: 'novulnshereiswear',
        pkg: {
          name: 'mkdirp',
          version: '0.5.1',
          dependencies: {
            minimist: '0.0.8',
          },
        },
      },
      {
        pkg: {
          name: 'mkdirp',
          version: '0.5.1',
          dependencies: {
            minimist: '0.0.8',
          },
        },
      },
      { pkg: { name: 'minimist', version: '0.0.8' } },
    ],
  })

  const report = await AuditReport.load(tree, { path })
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')
  t.equal(report.get('mkdirp').simpleRange, '0.4.1 - 0.5.1')
})

t.test('audit with filterSet limiting to only mkdirp and minimist', async t => {
  const path = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t)
  registry.audit({ results: require(resolve(path, 'advisory-bulk.json')) })
  registry.mocks({ dir: join(__dirname, 'fixtures') })
  const cache = t.testdir()
  const arb = newArb(path, { cache })

  const tree = await arb.loadVirtual()
  const filterSet = new Set([
    tree.children.get('mkdirp'),
    tree.children.get('minimist'),
  ])
  const options = { ...arb.options, filterSet }
  const report = await AuditReport.load(tree, options)
  t.matchSnapshot(JSON.stringify(report, 0, 2), 'json version')

  t.equal(report.topVulns.size, 0, 'no top nodes reported')
  t.equal(report.get('nyc'), undefined, 'no nyc vuln reported')
  t.equal(report.get('mkdirp').simpleRange, '0.4.1 - 0.5.1', 'mkdirp vuln reported')
})
