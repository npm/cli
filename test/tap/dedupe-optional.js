var fs = require('graceful-fs')
var path = require('path')

var mkdirp = require('mkdirp')
var mr = require('npm-registry-mock')
var rimraf = require('rimraf')
var test = require('tap').test

var common = require('../common-tap.js')
var server

var pkg = path.join(__dirname, 'dedupe-optional')

var EXEC_OPTS = { cwd: pkg }

var json = {
  author: 'Dedupe tester',
  name: 'dedupe',
  version: '0.0.0',
  dependencies: {
    clean: '2.1.6'
  }
}

var shrinkwrap = {
  name: 'dedupe',
  version: '0.0.0',
  dependencies: {
    clean: {
      version: '2.1.6'
    }
  }
}

test('setup', function (t) {
  t.comment('test for https://npm.community/t/3807')
  setup(function () {
    t.end()
  })
})

test('dedupe keeps uninstalled packages in package-lock.json', function (t) {
  common.npm(['dedupe'], EXEC_OPTS, function (err, code) {
    t.ifError(err, 'successfully deduped against previous install')
    t.notOk(code, 'npm dedupe exited with code')

    var shrinkwrap = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))

    t.ok(shrinkwrap.dependencies, 'npm dedupe kept packages')
    t.end()
  })
})

test('cleanup', function (t) {
  server.close()
  cleanup()

  t.end()
})

function cleanup () {
  rimraf.sync(pkg)
}

function setup (cb) {
  cleanup()
  mkdirp.sync(pkg)
  fs.writeFileSync(
    path.join(pkg, 'package.json'),
    JSON.stringify(json, null, 2)
  )
  fs.writeFileSync(
    path.join(pkg, 'package-lock.json'),
    JSON.stringify(shrinkwrap, null, 2)
  )
  process.chdir(pkg)

  mr({ port: common.port }, function (er, s) {
    server = s
    cb()
  })
}
