var fs = require('graceful-fs')
var path = require('path')

var mkdirp = require('mkdirp')
var osenv = require('osenv')
var rimraf = require('rimraf')
var test = require('tap').test

var common = require('../common-tap.js')

var pkg = common.pkg

var EXEC_OPTS = { cwd: pkg, stdio: [0, 1, 2] }

var localDependencyJson = {
  name: 'local-dependency',
  version: '0.0.0',
  dependencies: {
    underscore: '1.5.1'
  }
}

var dependentJson = {
  name: 'dependent',
  version: '0.0.0',
  dependencies: {
    'local-dependency': '../local-dependency'
  }
}

var target = path.resolve(pkg, '../local-dependency')

test('setup', function (t) {
  cleanup()
  t.end()
})

test('\'npm install\' should install local pkg from sub path', function (t) {
  setup()
  common.npm(['install', '--loglevel=silent'], EXEC_OPTS, function (err, code) {
    if (err) throw err
    t.equal(code, 0, 'npm install exited with code')
    t.ok(fs.statSync(path.resolve(pkg, 'node_modules/local-dependency/package.json')).isFile(), 'local dependency package.json exists')
    t.ok(fs.statSync(path.resolve(pkg, 'node_modules/local-dependency/node_modules/underscore')).isDirectory(), 'transitive dependency installed')
    t.end()
  })
})

test('\'npm ci\' should work', function (t) {
  common.npm(['ci', '--loglevel=silent'], EXEC_OPTS, function (err, code) {
    if (err) throw err
    t.equal(code, 0, 'npm install exited with code')
    t.ok(fs.statSync(path.resolve(pkg, 'node_modules/local-dependency/package.json')).isFile(), 'local dependency package.json exists')
    t.ok(fs.statSync(path.resolve(pkg, 'node_modules/local-dependency/node_modules/underscore')).isDirectory(), 'transitive dependency installed')
    t.end()
  })
})

test('cleanup', function (t) {
  cleanup()
  t.end()
})

function cleanup () {
  process.chdir(osenv.tmpdir())
  rimraf.sync(pkg)
  rimraf.sync(target)
}

function setup () {
  cleanup()
  mkdirp.sync(target)
  fs.writeFileSync(
    path.join(target, 'package.json'),
    JSON.stringify(localDependencyJson, null, 2)
  )
  mkdirp.sync(pkg)
  fs.writeFileSync(
    path.join(pkg, 'package.json'),
    JSON.stringify(dependentJson, null, 2)
  )
  process.chdir(pkg)
}
