// dedupe duplicated packages, or find them in the tree
const util = require('util')
const Arborist = require('@npmcli/arborist')
const rimraf = util.promisify(require('rimraf'))
const reifyOutput = require('./utils/reify-output.js')
const usageUtil = require('./utils/usage.js')

const usage = usageUtil('dedupe', 'npm dedupe')

const completion = (cb) => cb(null, [])

const cmd = (args, cb) => dedupe(args).then(() => cb()).catch(cb)

const dedupe = async args => {
  require('npmlog').warn('coming soon!')
  throw new Error('not yet implemented')
}

module.exports = Object.assign(cmd, { usage, completion })
