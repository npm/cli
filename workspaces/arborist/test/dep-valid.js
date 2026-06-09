const t = require('tap')
const depValid = require('../lib/dep-valid.js')
const npa = require('npm-package-arg')
const { normalizePaths } = require('./fixtures/utils.js')
const { resolve } = require('node:path')

// dep-valid reads from requestor.edgesOut so we use this instead of {} in these tests
const emptyRequestor = {
  edgesOut: new Map(),
}

t.test('basic', t => {
  t.ok(depValid({}, '', null, emptyRequestor), '* is always ok')

  t.ok(depValid({
    package: {
      version: '1.2.3',
    },
    get version () {
      return this.package.version
    },
  }, '1.x', null, emptyRequestor), 'range that is satisfied')

  t.ok(depValid({
    package: {
      version: '2.2.3',
    },
    get version () {
      return this.package.version
    },
  }, '1.x', '2.x', emptyRequestor), 'range that is acceptable')

  t.ok(depValid({
    isLink: true,
    realpath: '/some/path',
  }, normalizePaths(npa('file:/some/path')), null, emptyRequestor), 'links must point at intended target')

  t.notOk(depValid({
    isLink: true,
    realpath: '/some/other/path',
  }, 'file:/some/path', null, emptyRequestor), 'links must point at intended target')

  t.notOk(depValid({
    realpath: '/some/path',
  }, 'file:/some/path', null, emptyRequestor), 'file:// must be a link')

  t.ok(depValid({
    name: 'foo',
    resolved: 'git://host/repo#somebranch',
    package: {
      version: '1.2.3',
    },
    get version () {
      return this.package.version
    },
  }, 'git://host/repo#semver:1.x', null, emptyRequestor), 'git url with semver range')

  t.ok(depValid({
    name: 'foo',
    package: {
      name: 'bar',
      version: '1.2.3',
    },
    get version () {
      return this.package.version
    },
  }, 'npm:bar@1.2.3', null, emptyRequestor), 'alias is ok')

  t.ok(depValid({
    resolved: 'https://registry/abbrev-1.1.1.tgz',
    package: {},
    get version () {
      return this.package.version
    },
  }, 'https://registry/abbrev-1.1.1.tgz', null, emptyRequestor), 'remote url match')

  t.ok(depValid({
    resolved: 'git+ssh://git@github.com/foo/bar',
    package: {},
    get version () {
      return this.package.version
    },
  }, 'git+ssh://git@github.com/foo/bar.git', null, emptyRequestor), 'matching _from saveSpec')

  t.notOk(depValid({
    resolved: 'git+ssh://git@github.com/foo/bar',
    package: {},
    get version () {
      return this.package.version
    },
  }, 'git+ssh://git@github.com/bar/foo.git', null, emptyRequestor), 'different repo')

  t.notOk(depValid({
    package: {},
    get version () {
      return this.package.version
    },
  }, 'git+ssh://git@github.com/bar/foo.git', null, emptyRequestor), 'missing repo')

  t.ok(depValid({
    resolved: `file:${resolve('/path/to/tarball.tgz')}`,
  }, resolve('/path/to/tarball.tgz'), null, emptyRequestor), 'same tarball')

  t.notOk(depValid({
    resolved: 'file:/path/to/other/tarball.tgz',
  }, '/path/to/tarball.tgz', null, emptyRequestor), 'different tarball')

  t.notOk(depValid({
    isLink: true,
  }, '/path/to/tarball.tgz', null, emptyRequestor), 'links are not tarballs')

  t.ok(depValid({
    package: {
      _requested: {
        saveSpec: 'file:tarball.tgz',
      },
    },
    get version () {
      return this.package.version
    },
  }, './tarball.tgz', null, emptyRequestor), 'probably the same-ish, hopefully')

  t.notOk(depValid({
    package: {},
    get version () {
      return this.package.version
    },
  }, './tarball.tgz', null, emptyRequestor), 'too uncertain, nope')

  t.ok(depValid({
    resolved: 'https://registry.npmjs.org/foo/foo-1.2.3.tgz',
  }, 'latest', null, emptyRequestor), 'tagged registry version needs remote tarball')

  t.notOk(depValid({
    resolved: 'git+https://registry.npmjs.org/foo/foo-1.2.3.git',
  }, 'latest', null, emptyRequestor), 'tagged registry version needs remote tarball, not git')

  t.notOk(depValid({}, 'latest', null, emptyRequestor),
    'tagged registry version needs remote tarball resolution')
  t.end()
})

t.test('unsupported dependency type', t => {
  const requestor = { errors: [], edgesOut: new Map() }
  const child = { name: 'kid' }
  const request = { type: 'not a type' }
  t.notOk(depValid(child, request, null, requestor))
  t.match(requestor, {
    errors: [{
      message: 'Unsupported dependency type',
      dependency: 'kid',
      requested: { type: 'not a type' },
    }],
  }, 'parent got an error for their unsupported request')
  t.end()
})

t.test('invalid tag name', t => {
  const requestor = { errors: [], edgesOut: new Map() }
  const child = { name: 'kid' }
  const request = '!!@#$%!#@$!'
  t.notOk(depValid(child, request, null, requestor))
  t.match(requestor, {
    errors: [{
      message: 'Invalid tag name "!!@#$%!#@$!"',
      dependency: 'kid',
      requested: '!!@#$%!#@$!',
    }],
  }, 'parent got an error for their invalid request')
  t.end()
})

t.test('invalid request all together', t => {
  const requestor = { errors: [], edgesOut: new Map() }
  const child = { name: 'kid' }
  const request = null
  t.notOk(depValid(child, request, null, requestor))
  t.match(requestor, {
    errors: [{
      message: 'Invalid dependency specifier',
      requested: null,
      dependency: 'kid',
    }],
  }, 'parent got an error for their invalid request')
  t.end()
})

t.test('installLinks makes Link nodes invalid', t => {
  const requestor = { errors: [], installLinks: true, edgesOut: new Map() }
  const child = { isLink: true, isWorkspace: false, name: 'kid' }
  const request = { type: 'directory' }
  t.notOk(depValid(child, request, null, requestor))
  t.end()
})

t.test('installLinks does not make workspace nodes invalid', t => {
  const requestor = { errors: [], installLinks: true, edgesOut: new Map() }
  const child = {
    isLink: true,
    isWorkspace: true,
    name: 'kid',
    realpath: '/some/path',
  }
  const request = normalizePaths(npa('file:/some/path'))
  t.ok(depValid(child, request, null, requestor))
  t.end()
})

t.test('sha-1 and sha-256', t => {
  t.ok(depValid({
    name: 'foo',
    resolved: 'npm/repo#0d7bd85a85fa2571fa532d2fc842ed099b236ad2',
    package: {
      version: '1.2.3',
    },
    get version () {
      return this.package.version
    },
  }, 'npm/repo#0d7bd85a85fa2571fa532d2fc842ed099b236ad2', null, emptyRequestor), 'git url with full sha-1 hash match')

  t.notOk(depValid({
    name: 'foo',
    resolved: 'npm/repo#0d7bd85a85fa2571fa532d2fc842ed099b236ad2',
    package: {
      version: '1.2.3',
    },
    get version () {
      return this.package.version
    },
  }, 'npm/repo#1d7bd85a85fa2571fa532d2fc842ed099b236ad2', null, emptyRequestor), 'git url with full sha-1 hash mismatch')

  t.ok(depValid({
    name: 'foo',
    resolved: 'npm/repo#8e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8',
    package: {
      version: '1.2.3',
    },
    get version () {
      return this.package.version
    },
  }, 'npm/repo#8e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8', null, emptyRequestor), 'git url with full sha-256 hash match')

  t.notOk(depValid({
    name: 'foo',
    resolved: 'npm/repo#8e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8',
    package: {
      version: '1.2.3',
    },
    get version () {
      return this.package.version
    },
  }, 'npm/repo#9e3a9b3579ab330238c06b761e7f1b5dc5b4ac6e5a96da4dd2fb3b7411009df8', null, emptyRequestor), 'git url with full sha-256 hash mismatch')

  t.end()
})

t.test('git tag/branch change detected via lockfile committish', t => {
  // a named ref points at a commit hash, so the recorded committish tells us
  // whether the spec changed
  const mkRequestor = (recorded) => ({
    errors: [],
    edgesOut: new Map(),
    realpath: resolve('/some/path'),
    location: '',
    root: {
      meta: { data: { packages: { '': recorded } } },
    },
  })

  const child = {
    name: 'repo',
    resolved: 'git+ssh://git@github.com/npm/repo.git#0d7bd85a85fa2571fa532d2fc842ed099b236ad2',
    package: { version: '1.0.0' },
    get version () {
      return this.package.version
    },
  }

  t.ok(depValid(child, 'npm/repo#v1.0.0', null,
    mkRequestor({ dependencies: { repo: 'npm/repo#v1.0.0' } })),
  'unchanged tag is valid')

  t.notOk(depValid(child, 'npm/repo#v2.0.0', null,
    mkRequestor({ dependencies: { repo: 'npm/repo#v1.0.0' } })),
  'changed tag must be re-resolved')

  t.notOk(depValid(child, 'npm/repo#other', null,
    mkRequestor({ devDependencies: { repo: 'npm/repo#main' } })),
  'changed branch in devDependencies must be re-resolved')

  t.notOk(depValid(child, 'npm/repo#v2.0.0', null,
    mkRequestor({ optionalDependencies: { repo: 'npm/repo#v1.0.0' } })),
  'changed tag in optionalDependencies must be re-resolved')

  t.notOk(depValid(child, 'npm/repo#other', null,
    mkRequestor({ peerDependencies: { repo: 'npm/repo#main' } })),
  'changed branch in peerDependencies must be re-resolved')

  t.notOk(depValid(child, 'npm/repo#v2.0.0', null,
    mkRequestor({ dependencies: { repo: 'npm/repo' } })),
  'lockfile git spec without a committish differs from a named ref')

  t.ok(depValid(child, 'npm/repo#v2.0.0', null,
    mkRequestor({ dependencies: { repo: '^1.0.0' } })),
  'non-git lockfile spec is ignored, falling back to the repo-only check')

  t.ok(depValid(child, 'npm/repo#v2.0.0', null, emptyRequestor),
    'without lockfile data, fall back to the repo-only check')

  t.ok(depValid(child, 'npm/repo#v2.0.0', null,
    mkRequestor({ dependencies: { repo: 'invalid spec with spaces' } })),
  'unparseable lockfile spec is ignored, falling back to the repo-only check')

  t.end()
})
