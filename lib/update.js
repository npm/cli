'use strict'

const Arborist = require('@npmcli/arborist')

const log = require('npmlog')
const npm = require('./npm.js')
const usage = require('./utils/usage.js')
const reifyOutput = require('./utils/reify-output.js')

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

const update = async args => {
  const update = args.length === 0 ? true : args
  const where = npm.flatOptions.global
    ? globalTop
    : npm.prefix

  if (npm.flatOptions.depth !== Infinity) {
    log.warn('update', 'The --depth option no longer has any effect. See RFC0019.\n' +
      'https://github.com/npm/rfcs/blob/latest/accepted/0019-remove-update-depth-option.md')
  }

  const arb = new Arborist({
    ...npm.flatOptions,
    path: where
  })

  await arb.reify({ update })
  reifyOutput(arb)
}
