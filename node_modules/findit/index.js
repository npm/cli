var EventEmitter = require('events').EventEmitter;
var rfs = require('fs');
var path = require('path');

module.exports = function walk (dir, opts, emitter, dstat) {
    if (!opts) opts = {};
    var fdir = opts._original || dir;
    opts._original = undefined;
    var fs = opts.fs || rfs;
    
    if (!emitter) {
        emitter = new EventEmitter;
        emitter.stop = function () {
            emitter._stopped = true;
            emitter.emit('stop');
        };
        emitter._pending = 0;
        emitter._seen = {};
    }
    
    if (dstat) {
        var stopped = false;
        emitter.emit('directory', fdir, dstat, function stop () {
            stopped = true;
        });
        emitter.emit('path', fdir, dstat);
        if (!stopped) {
            emitter._pending ++;
            fs.readdir(dir, function (err, files) {
                emitter._pending --;
                onreaddir(dir, err, files);
            });
        }
        else check()
    }
    else {
        emitter._pending ++;
        fs.lstat(dir, function (err, stat) {
            emitter._pending --;
            onlstat(err, stat);
        });
    }
    function onlstat (err, stat) {
        if (emitter._stopped) return;
        
        if (err) {
            if (!err.path) err.path = dir;
            emitter.emit('error', err);
            return check();
        }
        emitter._seen[stat.ino || dir] = true;
        
        if (stat.isSymbolicLink() && opts.followSymlinks) {
            emitter.emit('link', fdir, stat);
            emitter._pending ++;
            fs.readlink(dir, function (err, rfile) {
                if (emitter._stopped) return;
                emitter._pending --;
                if (err) {
                    if (!err.path) err.path = dir;
                    emitter.emit('error', err);
                    return check();
                }
                var file_ = path.resolve(dir, rfile);
                emitter.emit('readlink', fdir, file_);
                emitter._pending ++;
                fs.lstat(file_, function (err, stat) {
                    emitter._pending --;
                    onstat(err, stat);
                });
            });
        }
        else if (stat.isSymbolicLink()) {
            emitter.emit('link', fdir, stat);
            emitter.emit('path', fdir, stat);
            check();
        }
        else if (stat.isDirectory()) {
            var stopped = false;
            emitter.emit('directory', fdir, stat, function stop () {
                stopped = true;
            });
            emitter.emit('path', fdir, stat);
            if (!stopped) {
                emitter._pending ++;
                fs.readdir(dir, function (err, files) {
                    emitter._pending --;
                    onreaddir(dir, err, files);
                });
            }
            else check()
        }
        else {
            emitter.emit('file', fdir, stat);
            emitter.emit('path', fdir, stat);
            check();
        }
    }
    
    return emitter;
    
    function check () {
        if (emitter._pending === 0) finish();
    }
    
    function finish () {
        emitter.emit('end');
        emitter._stopped = true;
    }
    
    function onreaddir (dir, err, files) {
        if (emitter._stopped) return;
        
        if (err) {
            if (!err.path) err.path = dir;
            emitter.emit('error', err);
            return check();
        }
        
        files.forEach(function (rfile) {
            var file = path.join(fdir, rfile);
            
            emitter._pending ++;
            fs.lstat(file, function (err, stat) {
                emitter._pending --;
                
                if (emitter._stopped) return;
                if (err) {
                    if (!err.path) err.path = file;
                    emitter.emit('error', err);
                    check()
                }
                else onstat(file, stat)
            });
        });
       check();
    }
    
    function onstat (file, stat, original) {
        if (emitter._seen[stat.ino || file]) return check();
        emitter._seen[stat.ino || file] = true;
        
        if (stat.isDirectory()) {
            if (original) opts._original = original;
            walk(file, opts, emitter, stat);
            check();
        }
        else if (stat.isSymbolicLink() && opts.followSymlinks) {
            emitter.emit('link', file, stat);
            
            fs.readlink(file, function (err, rfile) {
                if (emitter._stopped) return;
                if (err) {
                    if (!err.path) err.path = file;
                    emitter.emit('error', err);
                    return check();
                }
                var file_ = path.resolve(path.dirname(file), rfile);
                
                emitter.emit('readlink', file, file_);
                emitter._pending ++;
                fs.lstat(file_, function (err, stat_) {
                    emitter._pending --;
                    if (emitter._stopped) return;
                    if (err) {
                        if (!err.path) err.path = file_;
                        emitter.emit('error', err);
                        return check();
                    }
                    
                    onstat(file_, stat_, file);
                    check();
                });
            });
        }
        else if (stat.isSymbolicLink()) {
            emitter.emit('link', file, stat);
            emitter.emit('path', file, stat);
            check();
        }
        else {
            emitter.emit('file', file, stat);
            emitter.emit('path', file, stat);
            check();
        }
    }
};
