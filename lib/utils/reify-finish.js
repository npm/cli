const reifyOutput = require('./reify-output.js')
const { Locations } = require('@npmcli/config')
const { resolve } = require('path')

const reifyFinish = async (npm, arb) => {
  await saveBuiltinConfig(npm, arb)
  reifyOutput(npm, arb)
}

const saveBuiltinConfig = async (npm, arb) => {
  const { options: { global }, actualTree } = arb
  if (!global) {
    return
  }

  // if we are using a builtin config, and just installed npm as
  // a top-level global package, we have to preserve that config.
  const npmNode = actualTree.inventory.get('node_modules/npm')
  if (!npmNode) {
    return
  }

  const builtinConf = npm.config.get(Locations.builtin)
  await builtinConf.save(resolve(npmNode.path, 'npmrc'))
}

module.exports = reifyFinish
