// This file will highlight the passed code using the custom theme when run via: "node highlight-json"
'use strict'

var cardinal = require('..')

var json = JSON.stringify({
  foo: 'bar',
  baz: 'quux'
})

console.log(cardinal.highlight(json))
