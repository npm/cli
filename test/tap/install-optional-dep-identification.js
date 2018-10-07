'use strict'
var path = require('path')
var fs = require('graceful-fs')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var test = require('tap').test
var common = require('../common-tap.js')

var base = path.join(__dirname, path.basename(__filename, '.js'))
var moduleDir = path.join(base, 'example')
var moduleJson = {
  name: 'example',
  version: '1.0.0',
  optionalDependencies: {
    'aws-sdk': 'latest'
  }
}

function setup () {
  cleanup()
  mkdirp.sync(moduleDir)
  fs.writeFileSync(path.join(moduleDir, 'package.json'), JSON.stringify(moduleJson))
}

function cleanup () {
  rimraf.sync(base)
}

test('setup', function (t) {
  setup()
  t.end()
})

test('optional dependency identification', function (t) {
  common.npm(
    ['install', '--no-optional'],
    {cwd: moduleDir},
    function (er, code, stdout, stderr) {
      t.is(code, 0, 'no error code')
      t.is(stderr, '', 'no error output')
      t.notOk(fs.existsSync(path.join(moduleDir, 'node_modules')), 'did not install anything')
      t.end()
    }
  )
})

test('cleanup', function (t) {
  cleanup()
  t.end()
})
