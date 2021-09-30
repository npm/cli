'use strict'

var test = require('tape')
var util = require('util')
var redeyed = require('..')

function inspect(obj) {
  return util.inspect(obj, false, 5, true)
}

test('properly handles script level return -- no blow up', function(t) {
  var code = [
      ''
    , 'return 1;'
    ].join('\n')
  var opts = { Keyword: { 'return': '%:^' } }
  var expected = '\n%return^ 1;'
  var res = redeyed(code, opts).code

  t.equals(res, expected, inspect(code) + ' opts: ' + inspect(opts) + ' => ' + inspect(expected))
  t.end()
})
