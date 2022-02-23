const _makeIdealGraph = Symbol('makeIdealGraph')

module.exports = cls => class IsolatedReifier extends cls {
  /**
   * Create an ideal graph.
   *
   *
   **/
  async [_makeIdealGraph](options = {}) {

    /* We make sure that the ideal tree is build as the rest of 
     * the algorithm depends on it.
     */
    const bitOpt = {
      ...options,
      complete: this[_packageLockOnly] || this[_dryRun],
    }
    await this.buildIdealTree(bitOpt)

    const root = {
      name: 'root',
      version: 'local',
      resolved: this.idealTree.resolved,
      children: new Map(),
      package: this.idealTree.package,
    }
    idealTree.fsChildren.forEach(c => {
      const workspace = {
        name: c.name,
        version: 'local',
        resolved: c.resolved,
        children: new Map(),
        package: c.package,
      }
      root.children.set(name, workspace)
    })
    const processed = new Set()
    function processEdges(node, graph) {
      if (processed.has(node.location)) {
        return
      }
      for(const [name, edge] of node.edgesOut) {
        const to = edge.to
        // We have a failed dependency... ignore
        if (!to.target) {
          return
        }

        const child = {
          name: to.target.name,
          version: to.target.version,
          resolved: to.target.resolved,
          children: new Map(),
          package: to.target.package,
        }

        graph.children.set(child.name, child)

        processEdges(to.target, child)
      }
      processed.add(node.location)
    }
    processEdges(idealTree, root)
  }
}
