const { getNodeHashes } = require('hash-graph-nodes')
const _makeIdealGraph = Symbol.for('makeIdealGraph')
const _createIsolatedTree = Symbol.for('createIsolatedTree')
const _createBundledTree = Symbol('createBundledTree')
const fs = require('fs')
const pacote = require('pacote')
const { join } = require('path')

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
    result.resolved = node.resolved
    await this.assignCommonProperties(node, result)
  }

  async externalProxy (result, node) {
    await this.assignCommonProperties(node, result)
    if (node.hasShrinkwrap) {
      const dir = join(
        node.root.path,
        'node_modules',
        '.store',
        `${node.name}@${node.version}`
      )
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
      result.dependencies = [
        ...result.externalDependencies,
        ...result.localDependencies,
        ...result.externalOptionalDependencies,
      ]
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
    result.dependencies = [
      ...result.externalDependencies,
      ...result.localDependencies,
      ...result.externalOptionalDependencies,
    ]
    result.root = this.rootNode
    result.id = this.counter++
    result.name = node.name
    result.package = { ...node.package }
    result.package.bundleDependencies = undefined
    result.hasInstallScript = node.hasInstallScript
  }

  async [_createBundledTree] () {
    // TODO: make sure that idealTree object exists
    const idealTree = this.idealTree
    // TODO: test workspaces having bundled deps
    const queue = []

    for (const [, edge] of idealTree.edgesOut) {
      if (edge.to && (idealTree.package.bundleDependencies || idealTree.package.bundledDependencies || []).includes(edge.to.name)) {
        queue.push({ from: idealTree, to: edge.to })
      }
    }
    for (const child of idealTree.fsChildren) {
      for (const [, edge] of child.edgesOut) {
        if (edge.to && (child.package.bundleDependencies || child.package.bundledDependencies || []).includes(edge.to.name)) {
          queue.push({ from: child, to: edge.to })
        }
      }
    }

    const processed = new Set()
    const nodes = new Map()
    const edges = []
    while (queue.length !== 0) {
      const nextEdge = queue.pop()
      const key = `${nextEdge.from.location}=>${nextEdge.to.location}`
      if (processed.has(key)) {
        continue
      }
      processed.add(key)
      const from = nextEdge.from
      if (!from.isRoot && !from.isWorkspace) {
        nodes.set(from.location, { location: from.location, resolved: from.resolved, name: from.name, optional: from.optional, pkg: { ...from.package, bundleDependencies: undefined } })
      }
      const to = nextEdge.to
      nodes.set(to.location, { location: to.location, resolved: to.resolved, name: to.name, optional: to.optional, pkg: { ...to.package, bundleDependencies: undefined } })
      edges.push({ from: from.isRoot ? 'root' : from.location, to: to.location })

      to.edgesOut.forEach(e => {
        if (e.to) {
          queue.push({ from: e.from, to: e.to })
        }
      })
    }
    return { edges, nodes }
  }

  async [_createIsolatedTree] (idealTree) {
    await this[_makeIdealGraph](this.options)

    const proxiedIdealTree = this.idealGraph

    const bundledTree = await this[_createBundledTree]()

    const hasher = (() => {
      const result = new Map()
      const idToLocation = new Map()
      const locationToId = new Map()
      const graph = { nodes: [], links: [] }
      const visited = new Set()
      const visit = (node, parentId) => {
        let id = 0
        if (!visited.has(node.id)) {
          id = locationToId.size
          idToLocation.set(id, node.id)
          locationToId.set(node.id, id)
          graph.nodes.push({ contentHash: `${node.name}@${node.version}`, id })
        } else {
          id = locationToId.get(node.id)
        }
        if (parentId !== undefined) {
          graph.links.push({ source: parentId, target: id })
        }
        if (!visited.has(node.id)) {
          visited.add(node.id)
          node.dependencies.forEach(d => {
            visit(d, id)
          })
        }
      }
      visit(proxiedIdealTree)
      const nodeHashes = getNodeHashes(graph)
      nodeHashes.forEach((value, key) => {
        result.set(idToLocation.get(key), value)
      })

      return result
    })()

    const getKey = (idealTreeNode) => {
      const hash = hasher.get(idealTreeNode.id)
      return `${idealTreeNode.name}@${idealTreeNode.version}-${hash.substring(hash.length - 5)}`
    }

    const root = {
      fsChildren: [],
      integrity: null,
      inventory: new Map(),
      isLink: false,
      isRoot: true,
      binPaths: [],
      edgesIn: new Set(),
      edgesOut: new Map(),
      hasShrinkwrap: false,
      parent: null,
      // TODO: we should probably not reference this.idealTree
      resolved: this.idealTree.resolved,
      isTop: true,
      path: proxiedIdealTree.root.localPath,
      realpath: proxiedIdealTree.root.localPath,
      package: proxiedIdealTree.root.package,
      meta: { loadedFromDisk: false },
      global: false,
      isProjectRoot: true,
      children: [],
    }
    // root.inventory.set('', t)
    // root.meta = this.idealTree.meta
    // TODO We should mock better the inventory object because it is used by audit-report.js ... maybe
    root.inventory.query = () => {
      return []
    }
    const processed = new Set()
    proxiedIdealTree.workspaces.forEach(c => {
      const workspace = {
        edgesIn: new Set(),
        edgesOut: new Map(),
        children: [],
        hasInstallScript: c.hasInstallScript,
        binPaths: [],
        package: c.package,
        location: c.localLocation,
        path: c.localPath,
        realpath: c.localPath,
        resolved: c.resolved,
      }
      root.fsChildren.push(workspace)
      root.inventory.set(workspace.location, workspace)
    })
    const generateChild = (node, location, pkg) => {
      const newChild = {
        global: false,
        globalTop: false,
        isProjectRoot: false,
        isTop: false,
        location,
        name: node.name,
        optional: node.optional,
        top: { path: proxiedIdealTree.root.localPath },
        children: [],
        edgesIn: new Set(),
        edgesOut: new Map(),
        binPaths: [],
        fsChildren: [],
        getBundler () {
          return null
        },
        hasShrinkwrap: false,
        inDepBundle: false,
        integrity: null,
        isLink: false,
        isRoot: false,
        path: join(proxiedIdealTree.root.localPath, location),
        realpath: join(proxiedIdealTree.root.localPath, location),
        resolved: node.resolved,
        package: pkg,
      }
      newChild.target = newChild
      root.children.push(newChild)
      root.inventory.set(newChild.location, newChild)
    }
    proxiedIdealTree.external.forEach(c => {
      const key = getKey(c)
      if (processed.has(key)) {
        return
      }
      processed.add(key)
      const location = join('node_modules', '.store', key, 'node_modules', c.name)
      generateChild(c, location, c.package)
    })
    bundledTree.nodes.forEach(node => {
      generateChild(node, node.location, node.pkg)
    })
    bundledTree.edges.forEach(e => {
      const from = e.from === 'root' ? root : root.inventory.get(e.from)
      const to = root.inventory.get(e.to)
      // Maybe optional should be propagated from the original edge
      const edge = { optional: false, from, to }
      from.edgesOut.set(to.name, edge)
      to.edgesIn.add(edge)
    })
    const memo = new Set()

    function processEdges (node, externalEdge) {
      externalEdge = !!externalEdge
      const key = getKey(node)
      if (memo.has(key)) {
        return
      }
      memo.add(key)
      let from, nmFolder
      if (externalEdge) {
        const fromLocation = join('node_modules', '.store', key, 'node_modules', node.name)
        from = root.children.find(c => c.location === fromLocation)
        nmFolder = join('node_modules', '.store', key, 'node_modules')
      } else {
        from = node.isProjectRoot ? root : root.fsChildren.find(c => c.location === node.localLocation)
        nmFolder = join(node.localLocation, 'node_modules')
      }

      const processDeps = (dep, optional, external) => {
        optional = !!optional
        external = !!external
        const binNames = dep.package.bin && Object.keys(dep.package.bin) || []

        const toKey = getKey(dep)

        let target
        if (external) {
          const toLocation = join('node_modules', '.store', toKey, 'node_modules', dep.name)
          target = root.children.find(c => c.location === toLocation)
        } else {
          target = root.fsChildren.find(c => c.location === dep.localLocation)
        }
        // TODO: we should no-op is an edge has already been created with the same fromKey and toKey

        binNames.forEach(bn => {
          target.binPaths.push(join(from.realpath, 'node_modules', '.bin', bn))
        })

        const link = {
          global: false,
          globalTop: false,
          isProjectRoot: false,
          edgesIn: new Set(),
          edgesOut: new Map(),
          binPaths: [],
          isTop: false,
          optional,
          location: join(nmFolder, dep.name),
          path: join(dep.root.localPath, nmFolder, dep.name),
          realpath: target.path,
          name: toKey,
          resolved: dep.resolved,
          top: { path: dep.root.localPath },
          children: [],
          fsChildren: [],
          isLink: true,
          isRoot: false,
          package: { _id: 'abc', bundleDependencies: undefined, deprecated: undefined, bin: target.package.bin },
          target,
        }
        const newEdge1 = { optional, from, to: link }
        from.edgesOut.set(dep.name, newEdge1)
        link.edgesIn.add(newEdge1)
        const newEdge2 = { optional: false, from: link, to: target }
        link.edgesOut.set(dep.name, newEdge2)
        target.edgesIn.add(newEdge2)
        root.children.push(link)
      }

      for (const dep of node.localDependencies) {
        processEdges(dep, false)
        // nonOptional, local
        processDeps(dep, false, false)
      }
      for (const dep of node.externalDependencies) {
        processEdges(dep, true)
        // nonOptional, external
        processDeps(dep, false, true)
      }
      for (const dep of node.externalOptionalDependencies) {
        processEdges(dep, true)
        // optional, external
        processDeps(dep, true, true)
      }
    }

    processEdges(proxiedIdealTree, false)
    root.children.forEach(c => c.parent = root)
    root.children.forEach(c => c.root = root)
    root.root = root
    root.target = root
    return root
  }
}
