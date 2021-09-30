'use strict'

var test = require('tape')
var customTheme = require('./fixtures/custom')
var cardinal = require('..')

var json = JSON.stringify({
  foo: 'bar',
  baz: 'quux',
  bam: null
})

test('supplying custom theme', function(t) {
  var highlighted = cardinal.highlight(json, { theme: customTheme })

  t.equals(highlighted, '\u001b[33m{\u001b[39m\u001b[92m"foo"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"bar"\u001b[39m\u001b[32m,\u001b[39m\u001b[92m"baz"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"quux"\u001b[39m\u001b[32m,\u001b[39m\u001b[92m"bam"\u001b[39m\u001b[93m:\u001b[39m\u001b[90mnull\u001b[39m\u001b[33m}\u001b[39m')
  t.end()
})

test('not supplying custom theme', function(t) {
  var highlighted = cardinal.highlight(json)

  t.equals(highlighted, '\u001b[33m{\u001b[39m\u001b[32m"foo"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"bar"\u001b[39m\u001b[32m,\u001b[39m\u001b[32m"baz"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"quux"\u001b[39m\u001b[32m,\u001b[39m\u001b[32m"bam"\u001b[39m\u001b[93m:\u001b[39m\u001b[90mnull\u001b[39m\u001b[33m}\u001b[39m')
  t.end()
})

test('with the obsoleted json option (ignored)', function(t) {
  var highlighted = cardinal.highlight(json, { json: true })

  t.equals(highlighted, '\u001b[33m{\u001b[39m\u001b[32m"foo"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"bar"\u001b[39m\u001b[32m,\u001b[39m\u001b[32m"baz"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"quux"\u001b[39m\u001b[32m,\u001b[39m\u001b[32m"bam"\u001b[39m\u001b[93m:\u001b[39m\u001b[90mnull\u001b[39m\u001b[33m}\u001b[39m')
  t.end()
})
