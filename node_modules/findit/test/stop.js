var find = require('../');
var test = require('tap').test;
var path = require('path');

test('stop', function (t) {
    t.plan(1);
    
    var finder = find(__dirname + '/..');
    var files = [];
    var stopped = false;
    finder.on('file', function (file) {
        files.push(file);
        if (files.length === 3) {
            finder.stop();
            stopped = true;
        }
        else if (stopped) {
            t.fail("files didn't stop");
        }
    });
    
    finder.on('directory', function (dir, stat, stop) {
        if (stopped) t.fail("directories didn't stop");
    });
    
    finder.on('end', function () {
        t.fail("shouldn't have ended");
    });
    
    finder.on('stop', function () {
        t.equal(files.length, 3);
    });
});
