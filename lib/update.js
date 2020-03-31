'use strict'

const Arborist = require('@npmcli/arborist')

const npm = require('./npm.js')
const usage = require('./utils/usage.js')
const output = require('./utils/output.js')

cmd.usage = usage(
  'update',
  'npm update [-g] [<pkg>...]'
)

module.exports = cmd
function cmd(args, cb) {
  update(args, cb)
    .then(() => cb())
    .catch(cb)
}

async function update (args) {
  const update = args.length === 0 ? true : args
  const where = npm.flatOptions.global
    ? globalTop
    : npm.prefix
  
  const arb = new Arborist({ 
    ...npm.flatOptions, 
    path: where 
  })
  
  const start = Date.now()
  await arb.reify({ update })
  const stop = Date.now()

  const time = (stop - start) / 1000
  const pkgCount = arb.diff.children.length
  const added = `updated ${pkgCount}`
  output(`${added} packages in ${time}s`)
}
