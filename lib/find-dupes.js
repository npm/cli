// dedupe duplicated packages, or find them in the tree
const dedupe = require('./dedupe.js')
const usageUtil = require('./utils/usage.js')

class FindDupes {
  /* istanbul ignore next - see test/lib/load-all-commands.js */
  get usage () {
    return usageUtil('find-dupes', 'npm find-dupes')
  }

  exec (args, cb) {
    // TODO this should really be this.npm.commands.dedupe
    dedupe({ dryRun: true }, cb)
  }
}
module.exports = FindDupes
