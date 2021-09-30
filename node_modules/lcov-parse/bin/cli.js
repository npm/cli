#!/usr/bin/env node
var lcov = require('../lib/index.js');
var file = process.argv[2];

lcov(file, function(err, data) {
    if (err) {
      return console.error(err)
    }

    console.log(JSON.stringify(data));
});
