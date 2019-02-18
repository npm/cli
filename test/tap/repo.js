var common = require('../common-tap.js')
var mr = require('npm-registry-mock')

var test = require('tap').test
var rimraf = require('rimraf')
var fs = require('fs')
var path = require('path')
var fakeBrowser = path.join(__dirname, '_script.sh')
var outFile = path.join(__dirname, '/_output')

var opts = { cwd: __dirname }

common.pendIfWindows('This is trickier to convert without opening new shells')

test('setup', function (t) {
  var s = '#!/usr/bin/env bash\n' +
          'echo "$@" > ' + JSON.stringify(__dirname) + '/_output\n'
  fs.writeFileSync(fakeBrowser, s, 'ascii')
  fs.chmodSync(fakeBrowser, '0755')
  t.pass('made script')
  t.end()
})

test('npm repo underscore', function (t) {
  mr({ port: common.port }, function (er, s) {
    common.npm([
      'repo', 'underscore',
      '--registry=' + common.registry,
      '--loglevel=silent',
      '--browser=' + fakeBrowser
    ], opts, function (err, code, stdout, stderr) {
      t.ifError(err, 'repo command ran without error')
      t.equal(code, 0, 'exit ok')
      var res = fs.readFileSync(outFile, 'ascii')
      s.close()
      t.equal(res, 'https://github.com/jashkenas/underscore\n')
      rimraf.sync(outFile)
      t.end()
    })
  })
})

test('npm repo optimist - github (https://)', function (t) {
  mr({ port: common.port }, function (er, s) {
    common.npm([
      'repo', 'optimist',
      '--registry=' + common.registry,
      '--loglevel=silent',
      '--browser=' + fakeBrowser
    ], opts, function (err, code, stdout, stderr) {
      t.ifError(err, 'repo command ran without error')
      t.equal(code, 0, 'exit ok')
      var res = fs.readFileSync(outFile, 'ascii')
      s.close()
      t.equal(res, 'https://github.com/substack/node-optimist\n')
      rimraf.sync(outFile)
      t.end()
    })
  })
})

test('npm repo npm-test-peer-deps - no repo', function (t) {
  mr({ port: common.port }, function (er, s) {
    common.npm([
      'repo', 'npm-test-peer-deps',
      '--registry=' + common.registry,
      '--loglevel=silent',
      '--browser=' + fakeBrowser
    ], opts, function (err, code, stdout, stderr) {
      t.ifError(err, 'repo command ran without error')
      t.equal(code, 1, 'exit not ok')
      s.close()
      t.end()
    })
  })
})

test('npm repo test-repo-url-http - non-github (http://)', function (t) {
  mr({ port: common.port }, function (er, s) {
    common.npm([
      'repo', 'test-repo-url-http',
      '--registry=' + common.registry,
      '--loglevel=silent',
      '--browser=' + fakeBrowser
    ], opts, function (err, code, stdout, stderr) {
      t.ifError(err, 'repo command ran without error')
      t.equal(code, 0, 'exit ok')
      var res = fs.readFileSync(outFile, 'ascii')
      s.close()
      t.equal(res, 'http://gitlab.com/evanlucas/test-repo-url-http\n')
      rimraf.sync(outFile)
      t.end()
    })
  })
})

test('npm repo test-repo-url-https - non-github (https://)', function (t) {
  mr({ port: common.port }, function (er, s) {
    common.npm([
      'repo', 'test-repo-url-https',
      '--registry=' + common.registry,
      '--loglevel=silent',
      '--browser=' + fakeBrowser
    ], opts, function (err, code, stdout, stderr) {
      t.ifError(err, 'repo command ran without error')
      t.equal(code, 0, 'exit ok')
      var res = fs.readFileSync(outFile, 'ascii')
      s.close()
      t.equal(res, 'https://gitlab.com/evanlucas/test-repo-url-https\n')
      rimraf.sync(outFile)
      t.end()
    })
  })
})

test('npm repo test-repo-url-ssh - non-github (ssh://)', function (t) {
  mr({ port: common.port }, function (er, s) {
    common.npm([
      'repo', 'test-repo-url-ssh',
      '--registry=' + common.registry,
      '--loglevel=silent',
      '--browser=' + fakeBrowser
    ], opts, function (err, code, stdout, stderr) {
      t.ifError(err, 'repo command ran without error')
      t.equal(code, 0, 'exit ok')
      var res = fs.readFileSync(outFile, 'ascii')
      s.close()
      t.equal(res, 'https://gitlab.com/evanlucas/test-repo-url-ssh\n')
      rimraf.sync(outFile)
      t.end()
    })
  })
})

/* ----- Test by new mock registry: BEGIN ----- */

const Tacks = require('tacks')
const mockTar = require('../util/mock-tarball.js')

const { Dir, File } = Tacks
const testDir = path.join(__dirname, path.basename(__filename, '.js'))

let server
test('setup mocked registry', t => {
  common.fakeRegistry.compat({}, (err, s) => {
    t.ifError(err, 'registry mocked successfully')
    server = s
    t.end()
  })
})

test('npm repo test-repo-with-directory', t => {
  const fixture = new Tacks(Dir({
    'package.json': File({})
  }))
  fixture.create(testDir)
  const packument = {
    name: 'test-repo-with-directory',
    'dist-tags': { latest: '1.2.3' },
    versions: {
      '1.2.3': {
        name: 'test-repo-with-directory',
        version: '1.2.3',
        dist: {
          tarball: `${server.registry}/test-repo-with-directory/-/test-repo-with-directory-1.2.3.tgz`
        },
        repository: {
          type: 'git',
          url: 'git+https://github.com/foo/test-repo-with-directory.git',
          directory: 'some/directory'
        }
      }
    }
  }
  server.get('/test-repo-with-directory').reply(200, packument)
  return mockTar({
    'package.json': JSON.stringify({
      name: 'test-repo-with-directory',
      version: '1.2.3'
    })
  }).then(tarball => {
    server.get('/test-repo-with-directory/-/test-repo-with-directory-1.2.3.tgz').reply(200, tarball)
    return common.npm([
      'repo', 'test-repo-with-directory',
      '--registry=' + server.registry,
      '--loglevel=silent',
      '--browser=' + fakeBrowser
    ])
  }).then(([code, stdout, stderr]) => {
    t.equal(code, 0)
    t.comment(stdout)
    t.comment(stderr)

    const res = fs.readFileSync(outFile, 'ascii')
    t.equal(res, 'https://github.com/foo/test-repo-with-directory/tree/master/some%2Fdirectory\n')
    rimraf.sync(outFile)
  })
})

test('cleanup mocked registry', t => {
  server.close()
  rimraf.sync(testDir)
  t.end()
})

/* ----- Test by new mock registry: END ----- */

test('cleanup', function (t) {
  fs.unlinkSync(fakeBrowser)
  t.pass('cleaned up')
  t.end()
})
