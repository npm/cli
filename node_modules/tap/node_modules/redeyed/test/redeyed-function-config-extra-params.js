'use strict'

var test = require('tape')
var util = require('util')
var redeyed = require('..')

function inspect(obj) {
  return util.inspect(obj, false, 5, true)
}

test('function - config passing idx and tokens', function(t) {
  var args = []
  var opts001 = {
      Boolean: {
        _default: identity
      }
    , Keyword: {
        _default: identity
      }
    , Identifier: {
        _default: identity
      }
    , Punctuator: {
        _default: identity
      }
  }
  var code = 'var fn = function () { return true; }'

  function identity(s, info) {
    args.push({ value: s, idx: info.tokenIndex, tokens: info.tokens, code: info.code })
    // returning unchanged string will keep the splits be equal to the original tokens
    return s
  }

  t.test(inspect(opts001) + ' -- ' + code, function(t) {
    var result = redeyed(code, opts001, { splits: true })
    var tokens = result.tokens

      t.equals(args.length, tokens.length, 'called with all tokens')

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]
        var arg = args[i]

        t.equals(arg.value, token.value, 'passes correct value: ' + inspect([ arg.value, token.value ]))
        t.equals(arg.idx, i, 'passes correct index')
        t.equals(arg.code, code, 'passes code')
        t.deepEquals(arg.tokens, tokens, 'passes all tokens')
      }
    t.end()
  })
  t.end()
})
