'use strict'

// applying esprima to a bunch of files of contained libraries as a smoke test
var test     =  require('tape')
var path     =  require('path')
var fs       =  require('fs')
var readdirp =  require('readdirp')
var cardinal  =  require('..')
var nodeModules =  path.join(__dirname, '..', 'node_modules')
var tapedir       =  path.join(nodeModules, 'tape')
var redeyeddir   =  path.join(nodeModules, 'redeyed')

test('tape', function(t) {
  readdirp({ root: tapedir, fileFilter: '*.js' })
    .on('data', function(entry) {
      var code = fs.readFileSync(entry.fullPath, 'utf-8')
      var result = cardinal.highlight(code)

      if (!(/^[^/*]*var /.test(code))) {
        t.pass('skipping ' + entry.path + ' due to missing var statement')
      } else {
        t.assert(~result.indexOf('[32mvar\u001b[39m'), 'highlighted ' + entry.path)
      }
    })
    .on('end', t.end.bind(t))
})

test('redeyed', function(t) {
  readdirp({ root: redeyeddir, fileFilter: 'redeyed.js' })
    .on('data', function(entry) {
      var code = fs.readFileSync(entry.fullPath, 'utf-8')
      var result = cardinal.highlight(code)

      t.assert(~result.indexOf('[32mvar\u001b[39m') || !(~result.indexOf('var ')), 'highlighted ' + entry.path)
    })
    .on('end', t.end.bind(t))
})
