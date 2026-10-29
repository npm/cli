const npa = require('npm-package-arg')
const pacote = require('pacote')
const { callLimit: promiseCallLimit } = require('promise-call-limit')
const { checkTrustDowngrade, isTrustPolicyExcluded } = require('./trust-policy.js')

const registryVersions = tree => {
  const packages = new Map()
  for (const node of tree.inventory.values()) {
    if (node.isProjectRoot || node.isWorkspace || node.isLink || node.inDepBundle || !node.version) {
      continue
    }

    // An edgeless node can still be a registry dependency. Only skip when
    // every actual consumer edge proves the package came from file:, git:,
    // or remote. If any registry edge reaches the node, verify it.
    const incomingEdges = [...node.edgesIn]
    if (incomingEdges.length &&
        incomingEdges.every(edge => edge.spec && !npa(edge.spec).registry)) {
      continue
    }
    const name = node.packageName || node.name
    if (!name) {
      continue
    }

    if (!packages.has(name)) {
      packages.set(name, new Set())
    }
    packages.get(name).add(node.version)
  }
  return packages
}

const verifyTrustPolicy = async (tree, opts = {}) => {
  if (opts.trustPolicy !== 'no-downgrade') {
    return
  }

  const queue = []
  for (const [name, versions] of registryVersions(tree)) {
    const versionsToCheck = [...versions].filter(version =>
      !isTrustPolicyExcluded(opts.trustPolicyExclude, name, version))
    if (!versionsToCheck.length) {
      continue
    }

    queue.push(async () => {
      const packument = await pacote.packument(name, {
        ...opts,
        fullMetadata: true,
      })
      for (const version of versionsToCheck) {
        checkTrustDowngrade(packument, version, {
          exclude: opts.trustPolicyExclude,
          ignoreAfter: opts.trustPolicyIgnoreAfter,
        })
      }
    })
  }
  await promiseCallLimit(queue)
}

module.exports = {
  registryVersions,
  verifyTrustPolicy,
}
