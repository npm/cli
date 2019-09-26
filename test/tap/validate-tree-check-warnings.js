'use strict'
var test = require('tap').test
var log = require('npmlog')
var npm = require('../../lib/npm.js')
var checkEngine = require('npm-install-checks').checkEngine

var idealTree = {
  package: {
    name: 'a b c',
    version: '3.what'
  },
  children: [{
    name: 'faulty-engine',
    version: '0.0.1',
    children: [],
    engines: {
      node: '>=2.0.0'
    },
    package: {
      name: 'faulty-engine',
      version: '0.0.1'
    }
  }],
  warnings: []
}

test('setup', function (t) {
  const faultyEnginePkg = idealTree.children[0]
  checkEngine(faultyEnginePkg, '1.0.0', '1.0.0', false, false, (err, warn) => {
    t.ifError(err, 'check engine ran without issue')
    faultyEnginePkg.package.warnings = [warn]
    npm.load({}, t.end)
  })
})

test('validate-tree should collect warnings from modules', function (t) {
  log.disableProgress()
  var validateTree = require('../../lib/install/validate-tree.js')
  validateTree(idealTree, log.newGroup('validate'), function (er, a, b) {
    t.equal(idealTree.warnings[0].code, 'ENOTSUP', 'should have the correct error')
    t.match(idealTree.warnings[0].message, /Unsupported engine/, 'reason for optional failure in JSON')
    t.end()
  })
})
