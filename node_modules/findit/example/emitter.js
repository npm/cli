var finder = require('../')(process.argv[2] || '.');
var path = require('path');

finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') stop()
    else console.log(dir + '/')
});

finder.on('file', function (file, stat) {
    console.log(file);
});

finder.on('link', function (link, stat) {
    console.log(link);
});
