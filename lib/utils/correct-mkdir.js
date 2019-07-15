const chownr = require('chownr')
const fs = require('graceful-fs')
const inflight = require('inflight')
const log = require('npmlog')
const mkdirp = require('mkdirp')
const { dirname } = require('path')

// retain ownership of the parent dir
// this matches behavior in cacache to infer the cache ownership
// based on the ownership of the cache folder or it is parent.

module.exports = function correctMkdir (path, cb) {
  cb = inflight('correctMkdir: ' + path, cb)
  if (!cb) {
    return log.verbose('correctMkdir', path, 'correctMkdir already in flight; waiting')
  } else {
    log.verbose('correctMkdir', path, 'correctMkdir not in flight; initializing')
  }

  if (!process.getuid) {
    log.verbose('makeCacheDir', 'UID & GID are irrelevant on', process.platform)
    return mkdirp(path, (er, made) => cb(er, { uid: 0, gid: 0 }))
  }

  inferOwner(path, (er, owner) => {
    if (er) {
      log.error('correctMkdir', 'failed to infer path ownership %s', path)
      return cb(er)
    }

    mkdirp(path, (er, made) => {
      if (er) {
        log.error('correctMkdir', 'failed to make directory %s', path)
        return cb(er)
      }
      chownr(made || path, owner.uid, owner.gid, (er) => cb(er, owner))
    })
  })
}

const pathToOwner = new Map()
const inferOwner = (path, cb) => {
  if (pathToOwner.has(path)) {
    return cb(null, pathToOwner.get(path))
  }

  const parent = dirname(path)
  fs.lstat(path, (er, st) => {
    if (er && parent !== path) {
      inferOwner(parent, (er, owner) => {
        if (er) {
          return cb(er)
        }
        pathToOwner.set(path, owner)
        return cb(null, owner)
      })
    } else if (er) {
      cb(er)
    } else {
      const owner = { uid: st.uid, gid: st.gid }
      pathToOwner.set(path, owner)
      cb(null, owner)
    }
  })
}
