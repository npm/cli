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

const mockPackage = (registry, name, packuments, times = 1) => registry.package({
  manifest: registry.manifest({ name, packuments }),
  times,
})

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

t.test('audit fix installs the highest safe version within the dependency range', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'audit-safe-downgrade',
      version: '1.0.0',
      devDependencies: { a: '^1.0.0' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'audit-safe-downgrade',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          name: 'audit-safe-downgrade',
          version: '1.0.0',
          devDependencies: { a: '^1.0.0' },
        },
        'node_modules/a': {
          version: '1.0.0',
          dev: true,
          dependencies: { b: '~1.0.0' },
        },
        'node_modules/b': {
          version: '1.0.2',
          dev: true,
        },
      },
    }),
  })

  const registry = createRegistry(t)
  registry.audit({
    results: {
      b: [{
        id: 1,
        url: 'https://example.test/advisories/1',
        title: 'Test vulnerability in b',
        severity: 'low',
        vulnerable_versions: '>=1.0.2 <1.1.0',
      }],
    },
    times: 2,
  })
  const bPackuments = [
    { version: '1.0.1' },
    { version: '1.0.2' },
    { version: '1.1.0' },
  ]
  const aPackuments = [
    { version: '1.0.0', dependencies: { b: '~1.0.0' } },
    { version: '1.1.0', dependencies: { b: '~1.1.0' } },
  ]
  await mockPackage(registry, 'b', bPackuments, 3)
  await mockPackage(registry, 'a', aPackuments)

  const tree = await newArb(path, { packageLockOnly: true }).audit({ fix: true })

  t.equal(tree.children.get('a').version, '1.0.0',
    'did not need to update the non-vulnerable parent')
  t.equal(tree.children.get('b').version, '1.0.1',
    'installed the highest safe version inside ~1.0.0')
})

t.test('audit fix removes a vulnerable transitive dependency with a safe downgrade', async t => {
  const path = t.testdir({
    'package.json': JSON.stringify({
      name: 'audit-metavuln-downgrade',
      version: '1.0.0',
      devDependencies: { a: '^1.0.0' },
    }),
    'package-lock.json': JSON.stringify({
      name: 'audit-metavuln-downgrade',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          name: 'audit-metavuln-downgrade',
          version: '1.0.0',
          devDependencies: { a: '^1.0.0' },
        },
        'node_modules/a': {
          version: '1.0.0',
          dev: true,
          dependencies: { b: '^1.0.0' },
        },
        'node_modules/b': {
          version: '1.2.0',
          dev: true,
          dependencies: { c: '^1.0.0' },
        },
        'node_modules/c': {
          version: '1.0.0',
          dev: true,
        },
      },
    }),
  })

  const registry = createRegistry(t)
  registry.audit({
    results: {
      c: [{
        id: 2,
        url: 'https://example.test/advisories/2',
        title: 'Test vulnerability in c',
        severity: 'moderate',
        vulnerable_versions: '<2.0.0',
      }],
    },
    times: 2,
  })
  const cPackuments = [
    { version: '1.0.0' },
  ]
  const bPackuments = [
    { version: '1.0.0' },
    { version: '1.2.0', dependencies: { c: '^1.0.0' } },
  ]
  const aPackuments = [
    { version: '1.0.0', dependencies: { b: '^1.0.0' } },
  ]
  await mockPackage(registry, 'c', cPackuments, 2)
  await mockPackage(registry, 'b', bPackuments, 2)
  await mockPackage(registry, 'a', aPackuments)

  const tree = await newArb(path, { packageLockOnly: true }).audit({ fix: true })

  t.equal(tree.children.get('a').version, '1.0.0',
    'left the top-level package unchanged')
  t.equal(tree.children.get('b').version, '1.0.0',
    'installed the safe version inside ^1.0.0')
  t.notOk(tree.children.has('c'),
    'pruned the dependency that caused the metavulnerability')
})
