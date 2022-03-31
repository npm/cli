const { definitions, shorthands, describeAll } = require('../../lib/utils/config/index.js')
const { aliases } = require('../../lib/utils/cmd-list')
const Npm = require('../../lib/npm.js')

// These are all the npm internals depended on by the docs scripts. If these change
// the associated targets should also be updated in the Makefile.

module.exports = {
  definitions,
  shorthands,
  describeAll,
  aliases,
  version: Npm.version,
}
