'use strict'
/* jshint asi: true */

var test     =  require('tape')
var path     =  require('path')
var fs       =  require('fs')
var themesdir = path.join(__dirname, '..', 'themes')
var allFiles = fs.readdirSync(themesdir)

test('validate themes by requiring all of them', function(t) {
  allFiles
    .filter(function(file) { return path.extname(file) === '.js' })
    .forEach(function(theme) {
      try {
        t.ok(require(path.join(themesdir, theme)), theme + ' is valid')
      } catch (e) {
        t.fail('theme: ' + theme + ' is invalid! ' + e.message)
      }
    })
  t.end()
})

