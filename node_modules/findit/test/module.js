var find = require('../');
var test = require('tap').test;

test('single file', function (t) {
    t.plan(2);
    
    var finder = find(__filename);
    var files = [];
    finder.on('file', function (file) {
        t.equal(file, __filename);
        files.push(file);
    });
    
    finder.on('directory', function (dir) {
        t.fail(dir);
    });
    
    finder.on('end', function () {
        t.deepEqual(files, [ __filename ]);
    });
});
