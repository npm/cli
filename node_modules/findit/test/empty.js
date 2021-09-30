var mkdirp = require('mkdirp');
var test = require('tap').test;
var find = require('../');

mkdirp.sync(__dirname + '/empty');

test('empty', function (t) {
    t.plan(1);
    var w = find(__dirname + '/empty');
    var files = [];
    w.on('file', function (file) {
        files.push(file);
    });
    w.on('end', function () {
        t.deepEqual(files, []);
    });
});
