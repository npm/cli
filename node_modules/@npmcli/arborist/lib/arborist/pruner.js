module.exports = cls => class Pruner extends cls {
  async prune (options = {}) {
    const tree = await this.buildIdealTree(options)
    const extraneousNodes = this.idealTree.inventory.filter(n => n.extraneous)

    for (const node of extraneousNodes) {
      node.parent = null
    }

    return this.reify(options)
  }
}
