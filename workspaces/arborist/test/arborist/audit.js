const t = require('tap')
const { resolve } = require('path')
const Arborist = require('../../lib/arborist/index.js')
const { normalizePath, printTree } = require('../fixtures/utils.js')
const { auditResponse, advisoryBulkResponse, ...mockRegistry } = require('../fixtures/server.js')

const fixtures = resolve(__dirname, '../fixtures')
const fixture = (t, p) => require(fixtures + '/reify-cases/' + p)(t)

t.before(mockRegistry.start)
t.teardown(mockRegistry.stop)

const cache = t.testdir()
const newArb = (path, options = {}) =>
  new Arborist({ path, cache, registry: mockRegistry.registry, ...options })

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')
  .split(mockRegistry.registry).join('https://registry.npmjs.org/')

t.test('audit finds the bad deps', async t => {
  const path = resolve(fixtures, 'deprecated-dep')
  t.teardown(auditResponse(resolve(fixtures, 'audit-nyc-mkdirp/audit.json')))
  const arb = newArb(path)
  const report = await arb.audit()
  t.equal(report.topVulns.size, 0)
  t.equal(report.size, 2)
})

t.test('no package lock finds no bad deps', async t => {
  const path = resolve(fixtures, 'deprecated-dep')
  t.teardown(auditResponse(resolve(fixtures, 'audit-nyc-mkdirp/audit.json')))
  const arb = newArb(path, { packageLock: false })
  const report = await arb.audit()
  t.equal(report.topVulns.size, 0)
  t.equal(report.size, 0)
})

t.test('audit fix reifies out the bad deps', async t => {
  const path = fixture(t, 'deprecated-dep')
  t.teardown(auditResponse(resolve(fixtures, 'audit-nyc-mkdirp/audit.json')))
  const arb = newArb(path)
  const tree = printTree(await arb.audit({ fix: true }))
  t.matchSnapshot(tree, 'reified out the bad mkdirp and minimist')
})

t.test('audit does not do globals', t =>
  t.rejects(newArb('.', { global: true }).audit(), {
    message: '`npm audit` does not support testing globals',
    code: 'EAUDITGLOBAL',
  }))

t.test('audit in a workspace', async t => {
  const src = resolve(fixtures, 'audit-nyc-mkdirp')
  const auditFile = resolve(src, 'advisory-bulk.json')
  t.teardown(advisoryBulkResponse(auditFile))

  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
      dependencies: {
        mkdirp: '1',
      },
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: {
            mkdirp: '0',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
          dependencies: {
            mkdirp: '0',
          },
        }),
      },
    },
  })

  // reify it without auditing so that we can put the "bad" versions
  // in place and save a lockfile reflecting this.
  await newArb(path, { audit: false }).reify()
  const bad = 'mkdirp@0.5.0'
  await newArb(path, { audit: false, workspaces: ['a'] }).reify({ add: [bad] })
  await newArb(path, { audit: false, workspaces: ['b'] }).reify({ add: [bad] })

  const auditReport = await newArb(path, { workspaces: ['a'] }).audit()
  t.equal(auditReport.get('mkdirp').nodes.size, 1)
  t.strictSame(auditReport.toJSON().vulnerabilities.mkdirp.nodes, ['packages/a/node_modules/mkdirp'])
  t.equal(auditReport.get('minimist').nodes.size, 1)
  t.strictSame(auditReport.toJSON().vulnerabilities.minimist.nodes, ['node_modules/minimist'])

  const fixed = await newArb(path, { workspaces: ['b'] }).audit({ fix: true })
  t.equal(fixed.children.get('a').target.children.get('mkdirp').version, '0.5.0', 'did not fix a')
  t.equal(fixed.children.get('b').target.children.get('mkdirp').version, '0.5.5', 'did fix b')
})

t.test('audit with workspaces disabled', async t => {
  const src = resolve(fixtures, 'audit-nyc-mkdirp')
  const auditFile = resolve(src, 'advisory-bulk.json')
  t.teardown(advisoryBulkResponse(auditFile))

  const path = t.testdir({
    'package.json': JSON.stringify({
      workspaces: ['packages/*'],
      dependencies: {
        mkdirp: '1',
      },
    }),
    packages: {
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          version: '1.2.3',
          dependencies: {
            mkdirp: '0',
          },
        }),
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1.2.3',
          dependencies: {
            mkdirp: '0',
          },
        }),
      },
    },
  })

  // reify it without auditing so that we can put the "bad" versions
  // in place and save a lockfile reflecting this.
  await newArb(path, { audit: false }).reify()
  const bad = 'mkdirp@0.5.0'
  await newArb(path, { audit: false, workspaces: ['a'] }).reify({ add: [bad] })
  await newArb(path, { audit: false, workspaces: ['b'] }).reify({ add: [bad] })

  const auditReport = await newArb(path, { workspacesEnabled: false }).audit()
  t.notOk(auditReport.get('mkdirp'))
})
