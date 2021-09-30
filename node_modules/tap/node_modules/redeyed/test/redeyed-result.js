'use strict'

var test = require('tape')
var redeyed = require('..')
var esprima = require('esprima')

test('redeyed result does not have esprima ast by default', function(t) {
  var code = '// a comment\nvar a = 3;'
  var conf = { Keyword: { _default: '_:-' } }

  var ast    =  esprima.parse(code, { tokens: true, comment: true, range: true, loc: true, tolerant: true })
  var tokens =  ast.tokens
  var comments = ast.comments

  var result = redeyed(code, conf)

  t.equal(typeof result.ast, 'undefined', 'ast')
  t.deepEquals(result.tokens, tokens, 'tokens')
  t.deepEquals(result.comments, comments, 'comments')
  t.notEquals(result.code, undefined, 'code')
  t.end()
})

test('redeyed result has esprima ast, tokens, comments and splits and transformed code', function(t) {
  var code = '// a comment\nvar a = 3;'
  var conf = { Keyword: { _default: '_:-' } }
  var ast    =  esprima.parse(code, { tokens: true, comment: true, range: true, loc: true, tolerant: true })
  var tokens =  ast.tokens
  var comments = ast.comments

  var result = redeyed(code, conf, { buildAst: true })

  t.deepEquals(result.ast, ast, 'ast')
  t.deepEquals(result.tokens, tokens, 'tokens')
  t.deepEquals(result.comments, comments, 'comments')
  t.notEquals(result.code, undefined, 'code')

  t.end()
})

test('redeyed result - { nojoin } has esprima ast, tokens, comments and splits but no transformed code', function(t) {
  var code = '// a comment\nvar a = 3;'
  var conf = { Keyword: { _default: '_:-' } }
  var ast    =  esprima.parse(code, { tokens: true, comment: true, range: true, loc: true, tolerant: true })
  var tokens =  ast.tokens
  var comments = ast.comments

  var result = redeyed(code, conf, { nojoin: true, buildAst: true })

  t.deepEquals(result.ast, ast, 'ast')
  t.deepEquals(result.tokens, tokens, 'tokens')
  t.deepEquals(result.comments, comments, 'comments')
  t.equals(result.code, undefined, 'code')

  t.end()
})
