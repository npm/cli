// Helpers for `auto-install-peers=false`, where only the project root and workspaces get their required peers installed.

const RUNTIME_FIELDS = ['dependencies', 'optionalDependencies']
const DECLARING_FIELDS = [...RUNTIME_FIELDS, 'peerDependencies']
const DEV_DECLARING_FIELDS = [...DECLARING_FIELDS, 'devDependencies']

const isMine = node => node.isProjectRoot || node.isWorkspace

// A peer edge that installs nothing on its own: an optional peer, or any peer of a dependency.
const isPassivePeer = edge => edge.type === 'peerOptional' || edge.peer && !isMine(edge.from)

// Whether the required peer `edge` would be placed only for a dependency, given the `declaring` edge of the same name in the dependent's context.
const isAutoInstalledPeer = (edge, declaring) => edge.type === 'peer' &&
  (!declaring || isPassivePeer(declaring) && !declaring.to)

// Nodes and links reached from `tree` through non-optional edges that pass `follow`.
const reachable = (tree, follow) => {
  const seen = new Set([tree])
  for (const node of seen) {
    for (const edge of node.target.edgesOut.values()) {
      if (edge.to && edge.type !== 'peerOptional' && follow(edge)) {
        seen.add(edge.to)
      }
    }
  }
  return seen
}

// Nodes that are in the tree only because a dependency's required peer edge reaches them, e.g. loaded from a lockfile written with auto-installed peers.
const autoInstalledPeerNodes = tree => {
  const kept = reachable(tree, edge => !isPassivePeer(edge))
  return [...reachable(tree, () => true)].filter(node => !kept.has(node))
}

const declares = (pkg, name, fields) => fields.some(field => Object.hasOwn(pkg[field] || {}, name))

// An optional peer does not make the dependent's consumers provide it.
const declaresRequired = (pkg, name, fields) => fields.some(field => declares(pkg, name, [field]) &&
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
      if (!edge.to) {
        continue
      }
      // Implicit workspace edges are not declarations, and devDependencies are only installed for the project root and workspaces.
      const runtime = declares(pkg, edge.name, RUNTIME_FIELDS)
      const peerOnly = !runtime && declares(pkg, edge.name, ['peerDependencies'])
      const dev = isMine(node) && declares(pkg, edge.name, ['devDependencies'])
      if (!runtime && !peerOnly && !dev) {
        continue
      }
      const fields = runtime || !dev ? DECLARING_FIELDS : DEV_DECLARING_FIELDS
      // The consumer that provides a peer-only dependency must provide its peers too, so any declaration forwards the obligation.
      const satisfied = peerOnly ? declares : declaresRequired
      const dep = edge.to.target
      for (const peer of dep.edgesOut.values()) {
        if (peer.type !== 'peer' || seen.has(peer.name) || peer.name === pkg.name ||
          satisfied(pkg, peer.name, fields)) {
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
