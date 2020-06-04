// prune extraneous packages
const npm = require('./npm.js')
const Arborist = require('@npmcli/arborist')
const usageUtil = require('./utils/usage.js')

const reifyOutput = require('./utils/reify-output.js')

const usage = usageUtil('prune',
  'npm prune [[<@scope>/]<pkg>...] [--production]'
)
const completion = (cb) => cb(null, [])

const cmd = (args, cb) => prune().then(() => cb()).catch(cb)

const prune = async () => {
  const where = npm.prefix
  const arb = new Arborist({
    ...npm.flatOptions,
    path: where
  })
  await arb.prune()
  reifyOutput(arb)
}

module.exports = Object.assign(cmd, { usage, completion })
