// use rimraf for tap recursive directory removal, so that
// the windows tests don't flake with fs errors
const { rimraf } = require('rimraf')
module.exports = {
  rmdirRecursiveSync: path => rimraf.sync(path),
  rmdirRecursive: (path, cb) => rimraf(path).then(() => cb(), cb),
}
