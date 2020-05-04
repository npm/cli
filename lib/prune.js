// prune extraneous packages.
const util = require('util')
const Arborist = require('@npmcli/arborist')
const rimraf = util.promisify(require('rimraf'))
const reifyOutput = require('./utils/reify-output.js')
const usageUtil = require('./utils/usage.js')

const usage = usageUtil('prune',
  'npm prune [[<@scope>/]<pkg>...] [--production]')

const completion = require('./utils/completion/installed-deep.js')

const cmd = (args, cb) => prune(args).then(() => cb()).catch(cb)

const prune = async args => {
  require('npmlog').warn('coming soon!')
  throw new Error('not yet implemented')
}

module.exports = Object.assign(cmd, { usage, completion })
