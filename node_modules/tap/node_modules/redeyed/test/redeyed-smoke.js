'use strict'

// applying redeyed to a bunch of files of contained libraries as a smoke test
var test     =  require('tape')
var path     =  require('path')
var fs       =  require('fs')
var readdirp =  require('readdirp')
var redeyed  =  require('..')
var nodeModules =  path.join(__dirname, '..', 'node_modules')
var esprimadir   =  path.join(nodeModules, 'esprima')

test('esprima', function(t) {
  readdirp({ root: esprimadir, fileFilter: '*.js' })
    .on('data', function(entry) {
      var code = fs.readFileSync(entry.fullPath, 'utf-8')
      var resultAst = redeyed(code, { Keyword: { 'var': '+:-' } }, { buildAst: true }).code
      var resultTokenize = redeyed(code, { Keyword: { 'var': '+:-' } }, { buildAst: false }).code

      t.assert(~resultAst.indexOf('+var-') || !(~resultAst.indexOf('var ')), 'redeyed ' + entry.path)
      t.assert(~resultTokenize.indexOf('+var-') || !(~resultTokenize.indexOf('var ')), 'redeyed ' + entry.path)
    })
    .on('end', t.end.bind(t))
})

test('redeyed', function(t) {
  readdirp({
      root: path.join(__dirname, '..')
    , fileFilter: '*.js'
    , directoryFilter: [ '!.git', '!node_modules' ]
  })
    .on('data', function(entry) {
      var code = fs.readFileSync(entry.fullPath, 'utf-8')
      var result = redeyed(code, { Keyword: { 'var': '+:-' } }).code

        t.assert(~result.indexOf('+var-') || !(~result.indexOf('var ')), 'redeyed ' + entry.path)
    })
    .on('end', t.end.bind(t))
})
