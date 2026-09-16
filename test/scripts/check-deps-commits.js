const t = require('tap')
const { execFileSync, spawnSync } = require('node:child_process')
const { resolve, join } = require('node:path')
const { mkdirSync, unlinkSync, writeFileSync } = require('node:fs')

const SCRIPT = resolve(__dirname, '../../scripts/check-deps-commits.js')

const git = (cwd, ...args) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()

const writePackage = (cwd, version, extra = {}) => {
  writeFileSync(join(cwd, 'package.json'), `${JSON.stringify({
    name: 'test-package',
    version: '1.0.0',
    dependencies: {
      foo: version,
    },
    ...extra,
  }, null, 2)}\n`)
}

const setup = (t) => {
  const cwd = t.testdir()
  git(cwd, 'init', '--initial-branch=main')
  git(cwd, 'config', 'user.name', 'Test User')
  git(cwd, 'config', 'user.email', 'test@example.com')
  git(cwd, 'config', 'commit.gpgsign', 'false')
  git(cwd, 'config', 'core.hooksPath', '')
  writePackage(cwd, '1.0.0')
  git(cwd, 'add', 'package.json')
  git(cwd, 'commit', '-m', 'chore: initial')
  return cwd
}

const run = (cwd, ...args) =>
  spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd,
    encoding: 'utf8',
  })

const check = (cwd, from, to) =>
  run(cwd, '--from', from, ...(to ? ['--to', to] : []))

t.test('requires a base ref', t => {
  const cwd = setup(t)
  const result = run(cwd)

  t.equal(result.status, 1)
  t.match(result.stderr, /Usage: node scripts\/check-deps-commits\.js/)
  t.end()
})

t.test('accepts inline ref arguments', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  const result = run(cwd, `--from=${from}`, '--to=HEAD')
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})

t.test('uses the merge base for the before manifest', t => {
  const cwd = setup(t)
  git(cwd, 'branch', 'pr')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  git(cwd, 'checkout', 'pr')
  writePackage(cwd, '1.0.0', { description: 'PR-only change' })
  git(cwd, 'commit', '-am', 'docs: update package description')

  const result = check(cwd, 'main', 'pr')
  t.equal(result.status, 0)
  t.match(result.stdout, 'no production dependency changes detected')
  t.end()
})

t.test('accepts a dependency in a newly added workspace', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')
  const workspace = join(cwd, 'mock-registry')

  writePackage(cwd, '1.0.0', { workspaces: ['mock-registry'] })
  mkdirSync(workspace)
  writePackage(workspace, '2.0.0')
  git(cwd, 'add', 'package.json', 'mock-registry/package.json')
  git(cwd, 'commit', '-m', 'deps(mock-registry): foo@2.0.0')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})

t.test('suggests a deps commit for a deleted workspace manifest', t => {
  const cwd = setup(t)
  const workspace = join(cwd, 'workspaces', 'example')

  writePackage(cwd, '1.0.0', { workspaces: ['workspaces/*'] })
  mkdirSync(workspace, { recursive: true })
  writePackage(workspace, '2.0.0')
  git(cwd, 'add', 'package.json', 'workspaces/example/package.json')
  git(cwd, 'commit', '-m', 'chore: add workspace')
  const from = git(cwd, 'rev-parse', 'HEAD')

  unlinkSync(join(workspace, 'package.json'))
  git(cwd, 'add', 'workspaces/example/package.json')
  git(cwd, 'commit', '-m', 'fix: remove workspace manifest')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, 'deps(example): remove foo')
  t.end()
})

t.test('ignores changed files whose names merely end in package.json', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writeFileSync(join(cwd, 'notpackage.json'), '{}\n')
  git(cwd, 'add', 'notpackage.json')
  git(cwd, 'commit', '-m', 'fix: add package metadata')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'no production dependency changes detected')
  t.end()
})

t.test('ignores package manifests nested below workspace roots', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')
  const fixture = join(
    cwd,
    'workspaces',
    'example',
    'test',
    'fixtures',
    'dependency'
  )

  writePackage(cwd, '1.0.0', { workspaces: ['workspaces/*'] })
  mkdirSync(fixture, { recursive: true })
  writePackage(fixture, '2.0.0')
  git(cwd, 'add', 'package.json', 'workspaces/example/test/fixtures/dependency/package.json')
  git(cwd, 'commit', '-m', 'fix: add dependency fixture')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'no production dependency changes detected')
  t.end()
})

t.test('ignores dependency changes that are not in the final diff', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '1.0.0', {
    dependencies: {
      foo: '1.0.0',
      temporary: '1.0.0',
    },
  })
  git(cwd, 'commit', '-am', 'fix: add temporary dependency')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})

t.test('rejects a dependency changed by an unrelated commit', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writeFileSync(join(cwd, 'README.md'), 'documentation\n')
  git(cwd, 'add', 'README.md')
  git(cwd, 'commit', '-m', 'deps: foo@2.0.0')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'fix: update foo')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /fix: update foo/)
  t.end()
})

t.test('rejects a deps commit that names a different dependency', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: bar@2.0.0')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /foo \(changed in: package\.json/)
  t.end()
})

t.test('rejects a later non-deps change to the same dependency', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  writePackage(cwd, '3.0.0')
  git(cwd, 'commit', '-am', 'fix: update foo again')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /fix: update foo again/)
  t.end()
})

t.test('accepts a deps commit that supersedes an unrelated change', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'fix: update foo')

  writePackage(cwd, '3.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@3.0.0')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})

t.test('reports every unrelated change to the same dependency', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'fix: update foo')

  writePackage(cwd, '3.0.0')
  git(cwd, 'commit', '-am', 'fix: update foo again')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /fix: update foo"/)
  t.match(result.stderr, /fix: update foo again"/)
  t.end()
})

t.test('rejects a dependency introduced by merge resolution', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  git(cwd, 'branch', 'feature')
  writeFileSync(join(cwd, 'main.txt'), 'main\n')
  git(cwd, 'add', 'main.txt')
  git(cwd, 'commit', '-m', 'chore: update main')

  git(cwd, 'checkout', 'feature')
  writeFileSync(join(cwd, 'feature.txt'), 'feature\n')
  git(cwd, 'add', 'feature.txt')
  git(cwd, 'commit', '-m', 'feat: update feature')
  git(cwd, 'merge', 'main', '--no-ff', '--no-commit')
  writePackage(cwd, '2.0.0')
  git(cwd, 'add', 'package.json')
  git(cwd, 'commit', '-m', 'merge main')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /foo \(changed in: package\.json\)/)
  t.end()
})

t.test('rejects merge resolution changing a covered dependency again', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  git(cwd, 'branch', 'main-update')
  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  git(cwd, 'checkout', 'main-update')
  writeFileSync(join(cwd, 'main.txt'), 'main\n')
  git(cwd, 'add', 'main.txt')
  git(cwd, 'commit', '-m', 'chore: update main')

  git(cwd, 'checkout', 'main')
  git(cwd, 'merge', 'main-update', '--no-ff', '--no-commit')
  writePackage(cwd, '3.0.0')
  git(cwd, 'add', 'package.json')
  git(cwd, 'commit', '-m', 'merge main update')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /merge main update/)
  t.end()
})

t.test('accepts a dependency inherited unchanged from a merge parent', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  git(cwd, 'branch', 'feature')
  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  git(cwd, 'checkout', 'feature')
  writeFileSync(join(cwd, 'feature.txt'), 'feature\n')
  git(cwd, 'add', 'feature.txt')
  git(cwd, 'commit', '-m', 'feat: update feature')
  git(cwd, 'merge', 'main', '--no-ff', '-m', 'merge main')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})

t.test('accepts the valid parent selected during a dependency conflict', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  git(cwd, 'branch', 'invalid')
  writePackage(cwd, '3.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@3.0.0')

  git(cwd, 'checkout', 'invalid')
  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'fix: update foo')
  const merge = spawnSync('git', ['merge', 'main', '--no-ff', '--no-commit'], {
    cwd,
    encoding: 'utf8',
  })
  t.equal(merge.status, 1)
  writePackage(cwd, '3.0.0')
  git(cwd, 'add', 'package.json')
  git(cwd, 'commit', '-m', 'merge main')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})

t.test('rejects the invalid parent selected during a dependency conflict', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  git(cwd, 'branch', 'invalid')
  writePackage(cwd, '3.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@3.0.0')

  git(cwd, 'checkout', 'invalid')
  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'fix: update foo')
  git(cwd, 'checkout', 'main')
  const merge = spawnSync('git', ['merge', 'invalid', '--no-ff', '--no-commit'], {
    cwd,
    encoding: 'utf8',
  })
  t.equal(merge.status, 1)
  writePackage(cwd, '2.0.0')
  git(cwd, 'add', 'package.json')
  git(cwd, 'commit', '-m', 'merge invalid')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /fix: update foo/)
  t.end()
})

t.test('tracks the same dependency separately in each manifest', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  const workspace = join(cwd, 'workspaces', 'example')
  writeFileSync(join(cwd, 'package.json'), `${JSON.stringify({
    name: 'test-package',
    version: '1.0.0',
    dependencies: {
      foo: '2.0.0',
    },
    workspaces: ['workspaces/*'],
  }, null, 2)}\n`)
  mkdirSync(workspace, { recursive: true })
  writePackage(workspace, '2.0.0')
  git(cwd, 'add', 'package.json', 'workspaces/example/package.json')
  git(cwd, 'commit', '-m', 'fix: update workspace foo')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, /foo \(changed in: workspaces\/example\/package\.json/)
  t.end()
})

t.test('suggests a deps commit when removing a dependency', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, undefined, { dependencies: {} })
  git(cwd, 'commit', '-am', 'fix: remove foo')

  const result = check(cwd, from)
  t.equal(result.status, 1)
  t.match(result.stderr, 'deps: remove foo')
  t.end()
})

t.test('accepts multiple matching changes to the same dependency', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  writePackage(cwd, '3.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@3.0.0')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})

t.test('accepts the commit that changes and names the dependency', t => {
  const cwd = setup(t)
  const from = git(cwd, 'rev-parse', 'HEAD')

  writePackage(cwd, '2.0.0')
  git(cwd, 'commit', '-am', 'deps: foo@2.0.0')

  const result = check(cwd, from)
  t.equal(result.status, 0)
  t.match(result.stdout, 'have a matching deps: commit')
  t.end()
})
