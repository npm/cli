const t = require('tap')
const depValid = require('../lib/dep-valid.js')
const npa = require('npm-package-arg')
const { normalizePaths } = require('./fixtures/utils.js')
const { resolve } = require('path')

// dep-valid reads from requestor.edgesOut so we use this instead of {} in these tests
const emptyRequestor = {
  edgesOut: new Map(),
}

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
