const t = require('tap')
const resetDepFlags = require('../lib/reset-dep-flags.js')

const tree = {
  inventory: new Map([
    ['x', {}],
    ['y', { extraneous: false, dev: false, devOptional: false, peer: false, optional: false }],
  ]),
}

resetDepFlags(tree)
t.match(tree, {
  inventory: new Map([
    ['x', { extraneous: true, dev: true, devOptional: true, peer: true, optional: true }],
    ['y', { extraneous: true, dev: true, devOptional: true, peer: true, optional: true }],
  ]),
})
