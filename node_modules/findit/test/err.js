var find = require('../');
var test = require('tap').test;
var path = require('path');

test('error', function (t) {
    t.plan(1);
    
    var finder = find(__dirname + '/does/not/exist');
    finder.on('error', function (err) {
        t.equal(err.path, __dirname + '/does/not/exist');
    });
});
