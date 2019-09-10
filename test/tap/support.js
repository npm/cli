'use strict'
var test = require('tap').test
var Tacks = require('tacks')
var path = require('path')
var Dir = Tacks.Dir
var File = Tacks.File
var common = require('../common-tap.js')

var fixturepath = common.pkg
var fixture = new Tacks(Dir({
  'package.json': File({
    name: 'a',
    version: '0.0.0',
    dependencies: { 'hassupport': '7.7.7' }
  }),
  'node_modules': Dir({
    hassupport: Dir({
      'package.json': File({
        name: 'hassupport',
        version: '7.7.7',
        homepage: 'http://example.com/project',
        support: 'http://example.com/project/donate'
      })
    })
  })
}))

test('setup', function (t) {
  fixture.remove(fixturepath)
  fixture.create(fixturepath)
  t.end()
})

test('support --json', function (t) {
  common.npm(['support', '--json'], {cwd: fixturepath}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.is(code, 0, 'exited 0')
    t.is(stderr, '', 'no warnings')
    var parsed
    t.doesNotThrow(function () {
      parsed = JSON.parse(stdout)
    }, 'valid JSON')
    t.deepEqual(
      parsed,
      [
        {
          name: 'hassupport',
          version: '7.7.7',
          homepage: 'http://example.com/project',
          support: 'http://example.com/project/donate',
          path: path.resolve(fixturepath, 'node_modules', 'hassupport')
        }
      ],
      'output data'
    )
    t.end()
  })
})

test('support', function (t) {
  common.npm(['support'], {cwd: fixturepath}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.is(code, 0, 'exited 0')
    t.is(stderr, '', 'no warnings')
    t.includes(stdout, 'hassupport', 'outputs project name')
    t.includes(stdout, '7.7.7', 'outputs project version')
    t.includes(stdout, 'http://example.com/project', 'outputs contributor homepage')
    t.includes(stdout, 'http://example.com/project/donate', 'outputs support link')
    t.end()
  })
})

test('cleanup', function (t) {
  t.pass(fixturepath)
  fixture.remove(fixturepath)
  t.end()
})
