const _makeIdealGraph = Symbol.for('makeIdealGraph')
const fs = require('fs')
const pacote = require('pacote')

module.exports = cls => class IsolatedReifier extends cls {
  /**
   * Create an ideal graph.
   *
   *
   **/
  async [_makeIdealGraph] (options = {}) {
    /* We make sure that the ideal tree is build as the rest of
     * the algorithm depends on it.
     */
    const bitOpt = {
      ...options,
      complete: false,
    }
    await this.buildIdealTree(bitOpt)
    const idealTree = this.idealTree

    function memoize (fn) {
      const memo = new Map()
      return async function (arg) {
        const key = arg
        if (memo.has(key)) {
          return memo.get(key)
        }
        const result = {}
        memo.set(key, result)
        await fn(result, arg)
        return result
      }
    }

    this.rootNode = {}
    const root = this.rootNode
    this.counter = 0

    this.externalProxyMemo = memoize(this.externalProxy.bind(this))
    this.workspaceProxyMemo = memoize(this.workspaceProxy.bind(this))

    root.external = []
    root.isProjectRoot = true
    root.localLocation = idealTree.location
    root.localPath = idealTree.path
    root.workspaces = await Promise.all([...idealTree.fsChildren.values()].map(this.workspaceProxyMemo))
    const processed = new Set()
    const queue = [idealTree, ...idealTree.fsChildren]
    while (queue.length !== 0) {
      const next = queue.pop()
      if (processed.has(next.location)) {
        continue
      }
      processed.add(next.location)
      next.edgesOut.forEach(e => {
        if (!e.to || (next.package.bundleDependencies || next.package.bundledDependencies || []).includes(e.to.name)) {
          return
        }
        queue.push(e.to)
      })
      if (!next.isProjectRoot && !next.isWorkspace) {
        root.external.push(await this.externalProxyMemo(next))
      }
    }

    await this.assignCommonProperties(idealTree, root)

    this.idealGraph = root
  }

  async workspaceProxy (result, node) {
    result.localLocation = node.location
    result.localPath = node.path
    result.isWorkspace = true
    await this.assignCommonProperties(node, result)
  }

  async externalProxy (result, node) {
    await this.assignCommonProperties(node, result)
    if (node.hasShrinkwrap) {
      const dir = `${node.root.path}/node_modules/.store/${node.name}@${node.version}`
      fs.mkdirSync(dir, { recursive: true })
      await pacote.extract(node.resolved, dir, {
        ...this.options,
        resolved: node.resolved,
        integrity: node.integrity,
      })
      const Arborist = this.constructor
      const arb = new Arborist({ ...this.options, path: dir })
      await arb[_makeIdealGraph]({ dev: false })
      this.rootNode.external.push(...arb.idealGraph.external)
      arb.idealGraph.external.forEach(e => {
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
  }

  async assignCommonProperties (node, result) {
    function validEdgesOut (node) {
      return [...node.edgesOut.values()].filter(e => e.to && e.to.target && !(node.package.bundledDepenedencies || node.package.bundleDependencies || []).includes(e.to.name))
    }
    const edges = validEdgesOut(node)
    const optionalDeps = edges.filter(e => e.optional).map(e => e.to.target)
    const nonOptionalDeps = edges.filter(e => !e.optional).map(e => e.to.target)

    result.localDependencies = await Promise.all(nonOptionalDeps.filter(n => n.isWorkspace).map(this.workspaceProxyMemo))
    result.externalDependencies = await Promise.all(nonOptionalDeps.filter(n => !n.isWorkspace).map(this.externalProxyMemo))
    result.externalOptionalDependencies = await Promise.all(optionalDeps.map(this.externalProxyMemo))
    result.dependencies = [...result.externalDependencies, ...result.localDependencies, ...result.externalOptionalDependencies]
    result.root = this.rootNode
    result.id = this.counter++
    result.name = node.name
    result.package = { ...node.package }
    result.package.bundleDependencies = undefined
    result.hasInstallScript = node.hasInstallScript
  }
}
