'use strict'

var test = require('tape')
var path = require('path')
var cardinal = require('..')

var file = path.join(__dirname, 'fixtures/json.json')

test('without custom theme', function(t) {
  var highlighted = cardinal.highlightFileSync(file)

  t.equals(highlighted, '\u001b[33m{\u001b[39m\u001b[32m"foo"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"bar"\u001b[39m\u001b[32m,\u001b[39m\u001b[32m"baz"\u001b[39m\u001b[93m:\u001b[39m\u001b[92m"quux"\u001b[39m\u001b[32m,\u001b[39m\u001b[32m"bam"\u001b[39m\u001b[93m:\u001b[39m\u001b[90mnull\u001b[39m\u001b[33m}\u001b[39m')
  t.end()
})
