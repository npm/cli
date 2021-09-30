var find = require('../');
var test = require('tap').test;

test('foo', function (t) {
    var finder = find(__dirname + '/foo');
    var ps = {};
    
    var paths = []
    finder.on('path', function (p, stat) {
        paths.push(p);
        ps[p] = stat.isDirectory();
    });
    
    var dirs = []
    finder.on('directory', function (dir) {
        dirs.push(dir);
    });
    
    var files = []
    finder.on('file', function (file) {
        files.push(file);
    });
    
    finder.on('end', function () {
        var ref = {
            '' : true,
            'a' : true,
            'a/b' : true,
            'a/b/c' : true,
            'x' : false,
            'a/y' : false,
            'a/b/z' : false,
            'a/b/c/w' : false,
        };
        
        t.equal(Object.keys(ref).length, Object.keys(ps).length);
        var count = { dirs : 0, files : 0, paths : 0 };
        
        Object.keys(ref).forEach(function (key) {
            var file = (__dirname + '/foo/' + key).replace(/\/$/, '');
            t.equal(ref[key], ps[file]);
            if (ref[key]) {
                t.ok(dirs.indexOf(file) >= 0);
                count.dirs ++;
            }
            else {
                t.ok(files.indexOf(file) >= 0);
                count.files ++;
            }
        });
        
        t.deepEqual(count.dirs, dirs.length);
        t.deepEqual(count.files, files.length);
        t.deepEqual(paths.sort(), Object.keys(ps).sort());
        t.end();
    });
});
