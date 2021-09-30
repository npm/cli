'use strict'

/* eslint-disable no-template-curly-in-string */

var test = require('tape')
var util = require('util')
var redeyed = require('..')

function inspect(obj) {
  return util.inspect(obj, false, 5, true)
}

test('adding custom asserts ... ', function(t) {
  t.constructor.prototype.assertSurrounds = function(code, opts, expected) {
    var result = redeyed(code, opts, { jsx: true }).code
    if (expected == null) console.log(result)
    else this.equals(result, expected, inspect(code) + ' => ' + inspect(expected))
    return this
  }

  t.end()
})

test('\njsx support', function(t) {
  var config = {
      'JSXIdentifier': {
          className: '$xc:cx%'
        , _default: '$x:x%'
      }
    , 'Punctuator': { _default: '$:%'
    }
  }
  t.assertSurrounds(
      '<Component start={1} className="hello" />'
    , config
    , '$<%$xComponentx% $xstartx%$=%${%1$}% $xcclassNamecx%$=%"hello" $/%$>%'
  )
  t.end()
})
