const Arborist = require('../')

const printTree = require('./lib/print-tree.js')

module.exports = (options, time) => new Arborist(options)
  .loadVirtual()
  .then(time)
  .then(({ timing, result: tree }) => {
    printTree(tree)
    if (options.save) {
      tree.meta.save()
    }
    return `read ${tree.inventory.size} deps in ${timing.ms}`
  })
