module.exports = setUser

const assert = require('assert')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp-infer-owner')

function setUser (cb) {
  var defaultConf = this.root
  assert(defaultConf !== Object.prototype)

  // If global, leave it as-is.
  // If not global, then set the user to the owner of the prefix folder.
  // Just set the default, so it can be overridden.
  if (this.get('global')) return cb()
  if (process.env.SUDO_UID) {
    defaultConf.user = +(process.env.SUDO_UID)
    return cb()
  }

  const prefix = path.resolve(this.get('prefix'))
  mkdirp(prefix).catch(cb).then(() => {
    fs.stat(prefix, function (er, st) {
      defaultConf.user = st && st.uid
      return cb(er)
    })
  })
}
