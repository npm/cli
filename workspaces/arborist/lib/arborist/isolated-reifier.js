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

    function memoize(fn) {
      const memo = new Map()
      return function(arg) {
        const key = arg
        if (memo.has(key)) { return memo.get(key) }
        const result = {}
        memo.set(key, result)
        fn(result, arg)
        return result
      }
    }
    
    const root = {}
    let counter = 0

    function validEdgesOut(node) {
      return [...node.edgesOut.values()].filter(e => e.to && e.to.target) 
    }

    function assignCommonProperties(node, result) {
      const edges = validEdgesOut(node)
      const optionalDeps = edges.filter(e => e.optional).map(e => e.to.target)
      const nonOptionalDeps = edges.filter(e => !e.optional).map(e => e.to.target)

      result.localDependencies = nonOptionalDeps.filter(n => n.isWorkspace).map(workspaceProxyMemo),
      result.externalDependencies = nonOptionalDeps.filter(n => !n.isWorkspace).map(externalProxyMemo),
      result.externalOptionalDependencies = optionalDeps.map(externalProxyMemo),
      result.dependencies = [...result.externalDependencies, ...result.localDependencies, ...result.externalOptionalDependencies],
      result.root = root
      result.id = counter++
      result.name = node.name
      result.package = node.package
      result.hasInstallScript = node.hasInstallScript
    }

    const externalProxyMemo = memoize(externalProxy)
    const workspaceProxyMemo = memoize(workspaceProxy)

    root.isProjectRoot = true,
    root.localLocation = idealTree.location,
    root.localPath = idealTree.path,
    root.workspaces = [...idealTree.fsChildren.values()].map(workspaceProxyMemo),
    root.external = [...idealTree.inventory.values()].filter(n => !n.isProjectRoot && !n.isWorkspace).map(externalProxyMemo),
    assignCommonProperties(idealTree, root)

    function workspaceProxy(result, node) {
      result.localLocation = node.location
      result.localPath = node.path
      result.isWorkspace = true
      assignCommonProperties(node, result)
    }
    function externalProxy(result, node) {
      result.optional = node.optional
      result.resolved = node.resolved
      result.version = node.version
      assignCommonProperties(node, result)
    }

    this.idealGraph = root
  }
}
