// Helpers for `auto-install-peers=false`, where only the project root and workspaces get their required peers installed.

const DECLARING_FIELDS = ['dependencies', 'optionalDependencies', 'peerDependencies']
const DEV_DECLARING_FIELDS = [...DECLARING_FIELDS, 'devDependencies']

const isMine = node => node.isProjectRoot || node.isWorkspace

// A peer edge declared by a dependency, which does not install anything on its own.
const isDependencyPeer = edge => edge.peer && !isMine(edge.from)

// Whether the required peer `edge` would be placed only for a dependency, given the `declaring` edge of the same name in the dependent's context.
const isAutoInstalledPeer = (edge, declaring) => edge.type === 'peer' &&
  (!declaring || isDependencyPeer(declaring) && !declaring.to)

// Link targets reached from `tree` through non-optional edges that pass `follow`.
const reachable = (tree, follow) => {
  const seen = new Set([tree.target])
  for (const node of seen) {
    for (const edge of node.edgesOut.values()) {
      const to = edge.to?.target
      if (to && edge.type !== 'peerOptional' && follow(edge)) {
        seen.add(to)
      }
    }
  }
  return seen
}

// Nodes that are in the tree only because a dependency's required peer edge reaches them, e.g. loaded from a lockfile written with auto-installed peers.
const autoInstalledPeerNodes = tree => {
  const kept = reachable(tree, edge => !isDependencyPeer(edge))
  return [...reachable(tree, () => true)].filter(node => !kept.has(node))
}

const declares = (pkg, name, fields) => fields.some(field =>
  Object.hasOwn(pkg[field] || {}, name) &&
  (field !== 'peerDependencies' || !pkg.peerDependenciesMeta?.[name]?.optional))

// Every package that depends on a package with a required peer without declaring that peer itself, once per package and peer.
const undeclaredPeers = tree => {
  const found = []
  for (const node of tree.inventory.values()) {
    if (node.isLink || node.inDepBundle || node.inert) {
      continue
    }
    const { package: pkg } = node
    const seen = new Set()
    for (const edge of node.edgesOut.values()) {
      if (!edge.to || edge.type === 'workspace' || edge.type === 'peerOptional') {
        continue
      }
      // devDependencies are only installed for the project root and workspaces.
      const devOnly = !declares(pkg, edge.name, DECLARING_FIELDS)
      if (devOnly && !isMine(node)) {
        continue
      }
      const fields = devOnly ? DEV_DECLARING_FIELDS : DECLARING_FIELDS
      const dep = edge.to.target
      for (const peer of dep.edgesOut.values()) {
        if (peer.type !== 'peer' || seen.has(peer.name) || peer.name === pkg.name ||
          declares(pkg, peer.name, fields)) {
          continue
        }
        seen.add(peer.name)
        found.push({ node, dep, peer })
      }
    }
  }
  return found.sort((a, b) => a.node.location.localeCompare(b.node.location, 'en') ||
    a.peer.name.localeCompare(b.peer.name, 'en'))
}

module.exports = {
  autoInstalledPeerNodes,
  isAutoInstalledPeer,
  isMine,
  undeclaredPeers,
}
