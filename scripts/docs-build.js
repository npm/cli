#!/usr/bin/env node

var fs = require('fs')
var marked = require('marked-man')
var npm = require('../lib/npm.js')
var args = process.argv.slice(2)
var src = args[0]
var dest = args[1] || src

fs.readFile(src, 'utf8', function (err, data) {
  if (err) return console.log(err)

  var fileExt = src.split('.').pop()
  var result = data.replace(/@VERSION@/g, npm.version)

    if (fileExt === 'md') {
      result = marked(
        result.replace(/\-\-\-([\s\S]+)\-\-\-/g, '')
          .replace(/(npm-)?([a-zA-Z\\\.\-]*)\(1\)/g, 'npm help $2')
          .replace(/(npm-)?([a-zA-Z\\\.\-]*)\((5|7)\)/g, 'npm help $2')
          .replace(/(npm-)?([a-zA-Z\\\.\-]*)\(3\)/g, 'npm apihelp $2')
          .replace(/npm(1)/g, 'npm help npm')
          .replace(/npm(3)/g, 'npm apihelp npm')
          .trim()
      )
    }

  fs.writeFile(dest, result, 'utf8', function (err) {
     if (err) return console.log(err)
  })

})
