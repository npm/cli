'use strict'
var test = require('tap').test
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File
var common = require('../common-tap.js')

var testdir = common.pkg
var fixture = new Tacks(Dir({
  'b-src': Dir({
    'package.json': File({
      name: 'b',
      version: '1.0.0',
      support: 'http://example.com/support.json'
    })
  })
}))

test('setup', function (t) {
  fixture.remove(testdir)
  fixture.create(testdir)
  t.end()
})

test('install-report', function (t) {
  common.npm(['install', '--no-save', './b-src'], {cwd: testdir}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.is(code, 0, 'installed successfully')
    t.is(stderr, '', 'no warnings')
    t.includes(stdout, '`npm support`', 'metions `npm support`')
    t.end()
  })
})

test('cleanup', function (t) {
  fixture.remove(testdir)
  t.end()
})
