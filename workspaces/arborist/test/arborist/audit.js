const t = require('tap')
const { join, resolve } = require('node:path')
const Arborist = require('../../lib/arborist/index.js')
const { normalizePath, printTree } = require('../fixtures/utils.js')
const MockRegistry = require('@npmcli/mock-registry')

const fixtures = resolve(__dirname, '../fixtures')
const fixture = (t, p) => require(fixtures + '/reify-cases/' + p)(t)

const cache = t.testdir()
const newArb = (path, options = {}) => new Arborist({ path, cache, ...options })

const cwd = normalizePath(process.cwd())
t.cleanSnapshot = s => s.split(cwd).join('{CWD}')

const createRegistry = (t) => {
  const registry = new MockRegistry({
    strict: true,
    tap: t,
    registry: 'https://registry.npmjs.org',
  })
  return registry
}

t.test('audit finds the bad deps', async t => {
  const path = resolve(fixtures, 'deprecated-dep')
  const registry = createRegistry(t, false)
  registry.audit({ convert: true, results: require(resolve(fixtures, 'audit-nyc-mkdirp', 'audit.json')) })
  registry.mocks({ dir: join(__dirname, '..', 'fixtures') })
  const arb = newArb(path)
  const report = await arb.audit()
  t.equal(report.topVulns.size, 0)
  t.equal(report.size, 2)
})

t.test('no package lock finds no bad deps', async t => {
  const path = resolve(fixtures, 'deprecated-dep')
  const registry = createRegistry(t, false)
  registry.audit({ convert: true, results: require(resolve(fixtures, 'audit-nyc-mkdirp', 'audit.json')) })
  registry.mocks({ dir: join(__dirname, '..', 'fixtures') })
  const arb = newArb(path, { packageLock: false })
  const report = await arb.audit()
  t.equal(report.topVulns.size, 0)
  t.equal(report.size, 0)
})

t.test('audit fix reifies out the bad deps', async t => {
  const path = fixture(t, 'deprecated-dep')
  const registry = createRegistry(t, false)
  registry.audit({ convert: true, results: require(resolve(fixtures, 'audit-nyc-mkdirp', 'audit.json')) })
  registry.mocks({ dir: join(__dirname, '..', 'fixtures') })
  const arb = newArb(path)
  const tree = printTree(await arb.audit({ fix: true }))
  t.matchSnapshot(tree, 'reified out the bad mkdirp and minimist')
})

t.test('audit fix does not update when fix requires semver-major bump', async t => {
  const registry = createRegistry(t)
  const advisory = registry.advisory({ id: 101, vulnerable_versions: '<3.0.0' })
  const manifest = registry.manifest({
    name: 'test-pkg',
    packuments: [{ version: '2.0.0' }, { version: '2.0.1' }, { version: '3.0.0' }],
  })
  await registry.package({ manifest, times: 2 })
  registry.audit({ times: 2, results: { 'test-pkg': [advisory] } })

  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'my-project',
      version: '1.0.0',
      dependencies: { 'test-pkg': '^2.0.0' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'my-project',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': { name: 'my-project', version: '1.0.0', dependencies: { 'test-pkg': '^2.0.0' } },
        'node_modules/test-pkg': {
          version: '2.0.0',
          resolved: 'https://registry.npmjs.org/test-pkg/-/test-pkg-2.0.0.tgz',
          integrity: 'sha512-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        },
      },
    }),
    node_modules: {
      'test-pkg': {
        'package.json': JSON.stringify({ name: 'test-pkg', version: '2.0.0' }),
      },
    },
  })

  const tree = await newArb(path).audit({ fix: true })
  t.equal(
    tree.children.get('test-pkg').version,
    '2.0.0',
    'test-pkg not updated when fix requires semver-major bump'
  )
})

t.test('audit does not do globals', async t => {
  await t.rejects(newArb('.', { global: true }).audit(), {
    message: '`npm audit` does not support testing globals',
    code: 'EAUDITGLOBAL',
  })
})

t.test('audit in a workspace', async t => {
  const src = resolve(fixtures, 'audit-nyc-mkdirp')
  const registry = createRegistry(t)
  registry.audit({ results: require(resolve(src, 'advisory-bulk.json')) })
  registry.mocks({ dir: join(__dirname, '..', 'fixtures') })

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
  const registry = createRegistry(t)
  registry.audit({ results: require(resolve(src, 'advisory-bulk.json')) })
  registry.mocks({ dir: join(__dirname, '..', 'fixtures') })

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
