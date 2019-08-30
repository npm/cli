'use strict'
var test = require('tap').test
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File
var common = require('../common-tap.js')

var fixturepath = common.pkg
var fixture = new Tacks(Dir({
  'package.json': File({}),
  'hassupport': Dir({
    'package.json': File({
      name: 'hassupport',
      version: '7.7.7',
      support: 'http://example.com/project/support'
    })
  })
}))

test('setup', function (t) {
  fixture.remove(fixturepath)
  fixture.create(fixturepath)
  t.end()
})

test('install-report', function (t) {
  common.npm(['install', '--no-save', './hassupport'], {cwd: fixturepath}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.is(code, 0, 'installed successfully')
    t.is(stderr, '', 'no warnings')
    t.includes(stdout, '`npm support`', 'mentions `npm support`')
    t.end()
  })
})

test('cleanup', function (t) {
  fixture.remove(fixturepath)
  t.end()
})
