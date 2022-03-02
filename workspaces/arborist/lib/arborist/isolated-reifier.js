const _makeIdealGraph = Symbol.for('makeIdealGraph')
const fs = require('fs')
const pacote = require('pacote')

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
    
    this.rootNode = {}
    const root = this.rootNode
    this.counter = 0


    this.externalProxyMemo = memoize(this.externalProxy.bind(this))
    this.workspaceProxyMemo = memoize(this.workspaceProxy.bind(this))

    root.isProjectRoot = true,
    root.localLocation = idealTree.location,
    root.localPath = idealTree.path,
    root.workspaces = await Promise.all([...idealTree.fsChildren.values()].map(this.workspaceProxyMemo)),
    root.external = await Promise.all([...idealTree.inventory.values()].filter(n => !n.isProjectRoot && !n.isWorkspace).map(this.externalProxyMemo)),
    await this.assignCommonProperties(idealTree, root)


    this.idealGraph = root
  }
    async workspaceProxy(result, node) {
      result.localLocation = node.location
      result.localPath = node.path
      result.isWorkspace = true
      await this.assignCommonProperties(node, result)
    }
    async externalProxy(result, node) {
      if (node.hasShrinkwrap) {
        const dir = `${node.root.path}/node_modules/.store/${node.name}@${node.version}`
        fs.mkdirSync(dir,{recursive: true})
        await pacote.extract(node.resolved, dir, {
          resolved: node.resolved,
          integrity: node.integrity,
        })
      debugger
        const Arborist = this.constructor
        const arb = new Arborist({...this.options, path: dir})
        await arb[_makeIdealGraph]({dev: false})
        result.external = arb.idealGraph.external
        result.external.forEach(e => {
            e.root = this.rootNode
            e.id = `${node.id}=>${e.id}`
            })
        result.localDependencies = []
        result.externalDependencies = arb.idealGraph.externalDependencies
        result.externalOptionalDependencies = arb.idealGraph.externalOptionalDependencies
        result.dependencies = [...result.externalDependencies, ...result.localDependencies, ...result.externalOptionalDependencies]
        
      }
      result.optional = node.optional
      result.resolved = node.resolved
      result.version = node.version
      await this.assignCommonProperties(node, result)
    }
    async assignCommonProperties(node, result) {
      function validEdgesOut(node) {
        return [...node.edgesOut.values()].filter(e => e.to && e.to.target) 
      }
      const edges = validEdgesOut(node)
      const optionalDeps = edges.filter(e => e.optional).map(e => e.to.target)
      const nonOptionalDeps = edges.filter(e => !e.optional).map(e => e.to.target)

      result.localDependencies = await Promise.all(nonOptionalDeps.filter(n => n.isWorkspace).map(this.workspaceProxyMemo)),
      result.externalDependencies = await Promise.all(nonOptionalDeps.filter(n => !n.isWorkspace).map(this.externalProxyMemo)),
      result.externalOptionalDependencies = await Promise.all(optionalDeps.map(this.externalProxyMemo)),
      result.dependencies = [...result.externalDependencies, ...result.localDependencies, ...result.externalOptionalDependencies],
      result.root = this.rootNode
      result.id = this.counter++
      result.name = node.name
      result.package = node.package
      result.hasInstallScript = node.hasInstallScript
    }
}
