const _makeIdealGraph = Symbol.for('makeIdealGraph')

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
      complete: false
    }
    await this.buildIdealTree(bitOpt)
    const idealTree = this.idealTree

    function memoize(fn, keyExtractor) {
      const memo = new Map()
      return function(...args) {
        const key = keyExtractor(...args)
        if (memo.has(key)) { return memo.get(key) }
        const result = {}
        memo.set(key, result)
        fn(result, ...args)
        return result
      }
    }
    function mapMap(map, fn, filter = () => true) {
      return new Map([...map.entries()].filter(([key, value]) => filter(value)).map(([key, value]) => ([key, fn(value)])))
    }
    const root = {}
    const externalProxyMemo = memoize(externalProxy, (o) => o.location)
    const workspaceProxyMemo = memoize(workspaceProxy, (o) => o.location)

    root.isProjectRoot = true,
    root.localLocation = idealTree.location,
    root.localPath = idealTree.path,
    root.workspaces = mapMap(idealTree.fsChildren, workspaceProxyMemo),
    root.external = mapMap(idealTree.inventory, externalProxyMemo, v => !v.isProjectRoot && !v.isWorkspace),
    root.package = idealTree.package,
    root.hasInstallScript = idealTree.hasInstallScript,
    root.name = idealTree.name,
    root.id = 0,
    root.localDependencies = [...idealTree.edgesOut.values()].filter(e => e.to && e.to.target && e.to.target.isWorkspace).map(e => e.to.target).map(workspaceProxyMemo),
    root.externalDependencies = [...idealTree.edgesOut.values()].filter(e => e.to && e.to.target && !e.to.target.isWorkspace && !e.optional).map(e => e.to.target).map(externalProxyMemo),
    root.externalOptionalDependencies = [...idealTree.edgesOut.values()].filter(e => e.to && e.to.target && !e.to.target.isWorkspace && e.optional).map(e => e.to.target).map(externalProxyMemo),
    root.dependencies = [...root.externalDependencies, ...root.localDependencies, ...root.externalOptionalDependencies],
    root.root = root

    function workspaceProxy(result, tree) {
      function copy(prop) {
        result[prop] = tree[prop]
      }
      result.localLocation = tree.location
      result.localPath = tree.path
      copy('isProjectRoot')
      copy('isWorkspace')
      copy('package')
      copy('hasInstallScript')
      copy('name')
      result.id = tree.location
      // This is weird but externals can have local dependencies TODO:test this scenario
      result.localDependencies= [...tree.edgesOut.values()].filter(e => e.to && e.to.target && e.to.target.isWorkspace).map(e => e.to.target).map(workspaceProxyMemo)
      result.externalDependencies= [...tree.edgesOut.values()].filter(e => e.to && e.to.target && !e.to.target.isWorkspace && !e.optional).map(e => e.to.target).map(externalProxyMemo)
      result.externalOptionalDependencies= [...tree.edgesOut.values()].filter(e => e.to && e.to.target && !e.to.target.isWorkspace && e.optional).map(e => e.to.target).map(externalProxyMemo)
      result.dependencies = [...result.externalDependencies, ...result.localDependencies, ...result.externalOptionalDependencies]
      result.root= root
    }
    function externalProxy(result, tree) {
      function copy(prop) {
        result[prop] = tree[prop]
      }
      copy('optional')
      copy('resolved')
      copy('version')
      copy('isProjectRoot')
      copy('isWorkspace')
      copy('package')
      copy('hasInstallScript')
      copy('name')
      result.id = tree.location
      // This is weird but externals can have local dependencies TODO:test this scenario
      result.localDependencies= [...tree.edgesOut.values()].filter(e => e.to && e.to.target && e.to.target.isWorkspace).map(e => e.to.target).map(workspaceProxyMemo)
      result.externalDependencies= [...tree.edgesOut.values()].filter(e => e.to && e.to.target && !e.to.target.isWorkspace && !e.optional).map(e => e.to.target).map(externalProxyMemo)
      result.externalOptionalDependencies= [...tree.edgesOut.values()].filter(e => e.to && e.to.target && !e.to.target.isWorkspace && e.optional).map(e => e.to.target).map(externalProxyMemo)
      result.dependencies = [...result.externalDependencies, ...result.localDependencies, ...result.externalOptionalDependencies]
      result.root= root
    }

    this.idealGraph = root
  }
}
