'use strict'

var test = require('tape')
var util = require('util')
var redeyed = require('..')

function inspect(obj) {
  return util.inspect(obj, false, 5, true)
}

test('preserves shebang', function(t) {
  var code = [
        '#!/usr/bin/env node'
      , 'var util = require("util");'
      ].join('\n')
  var opts = { Keyword: { 'var': '%:^' } }
  var expected = [
        '#!/usr/bin/env node'
      , '%var^ util = require("util");'
      ].join('\n')
  var res = redeyed(code, opts).code

  t.equals(res, expected, inspect(code) + ' opts: ' + inspect(opts) + ' => ' + inspect(expected))
  t.end()
})
