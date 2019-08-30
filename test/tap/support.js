'use strict'
var test = require('tap').test
var http = require('http')
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File
var common = require('../common-tap.js')

var server
var PORT = 8989

var CONTRIBUTOR = 'Test Contributor'
var EMAIL = 'contributor@example.com'
var HOMEPAGE = 'http://example.com/contributor'
var CONTRIBUTOR_LINK = 'http://example.com/donate'

var testdir = common.pkg
var fixture = new Tacks(Dir({
  node_modules: Dir({
    'package.json': File({
      name: 'a',
      version: '0.0.0',
      dependencies: { 'has-support': '7.7.7' }
    }),
    'node_modules': Dir({
      b: Dir({
        'package.json': File({
          name: 'has-support',
          homepage: 'http://example.com/project',
          version: '7.7.7',
          support: 'http://localhost:' + PORT + '/project.json'
        })
      })
    })
  })
}))

test('setup', function (t) {
  fixture.remove(testdir)
  fixture.create(testdir)
  server = http.createServer()
    .on('request', function (request, response) {
      if (request.url === '/project.json') {
        response.end(JSON.stringify({
          contributors: [
            { url: 'http://localhost:' + PORT + '/contributor.json' }
          ]
        }))
      } else if (request.url === '/contributor.json') {
        response.end(JSON.stringify({
          name: CONTRIBUTOR,
          email: EMAIL,
          homepage: HOMEPAGE,
          links: [CONTRIBUTOR_LINK]
        }))
      } else {
        response.statusCode = 404
        response.end()
      }
    })
    .listen(PORT, function () {
      t.end()
    })
})

test('support --json', function (t) {
  common.npm(['support', '--json'], {cwd: testdir}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.is(code, 0, 'exited 0')
    t.is(stderr, '', 'no warnings')
    t.includes(stdout, 'has-support', 'metions project name')
    t.includes(stdout, '7.7.7', 'metions project version')
    t.includes(stdout, CONTRIBUTOR, 'metions contributor name')
    t.includes(stdout, HOMEPAGE, 'metions contributor homepage')
    t.includes(stdout, CONTRIBUTOR_LINK, 'metions contributor link')
    t.end()
  })
})

test('support', function (t) {
  common.npm(['support'], {cwd: testdir}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.is(code, 0, 'exited 0')
    t.is(stderr, '', 'no warnings')
    t.includes(stdout, 'has-support', 'metions project name')
    t.includes(stdout, '7.7.7', 'metions project version')
    t.includes(stdout, CONTRIBUTOR, 'metions contributor name')
    t.includes(stdout, HOMEPAGE, 'metions contributor homepage')
    t.includes(stdout, CONTRIBUTOR_LINK, 'metions contributor link')
    t.end()
  })
})

test('cleanup', function (t) {
  server.close()
  fixture.remove(testdir)
  t.end()
})
