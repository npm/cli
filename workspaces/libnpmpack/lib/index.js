'use strict'

const pacote = require('pacote')
const npa = require('npm-package-arg')
const runScript = require('@npmcli/run-script')
const path = require('node:path')
const Arborist = require('@npmcli/arborist')
const { writeFile, mkdir, symlink, unlink } = require('node:fs/promises')

module.exports = pack
async function pack (spec = 'file:.', opts = {}) {
  // gets spec
  spec = npa(spec)

  const manifest = await pacote.manifest(spec, { ...opts, Arborist, _isRoot: true })

  if (spec.type === 'directory') {
    const hasBundled = manifest.bundleDependencies?.length > 0
    const hasOverrides = manifest.overrides
      && typeof manifest.overrides === 'object'
      && Object.keys(manifest.overrides).length > 0
    if (hasBundled && hasOverrides) {
      // Only refuse when an override rule actually applies to a package that is bundled by the root.
      // Overrides targeting dev dependencies or any package outside the bundled tree are harmless to consumers, because consumers do not apply the publishing package's overrides.
      // We rely on Arborist's own semantics (inBundle/inDepBundle/overridden) rather than reimplementing what npm-packlist/arborist already knows.
      const arb = new Arborist({ path: spec.fetchSpec })
      const tree = await arb.loadActual()
      const offenders = new Set()
      for (const node of tree.inventory.values()) {
        if (node.isRoot) {
          continue
        }
        // Only packages bundled by the root are at risk: nested dep-bundles are published as-is and arborist already treats them as immune to the root's overrides (see Edge#satisfiedBy).
        if (!node.inBundle || node.inDepBundle) {
          continue
        }
        if (node.overridden) {
          offenders.add(node.name)
        }
      }
      if (offenders.size) {
        const names = [...offenders].sort()
        const list = names.join(', ')
        const isOne = names.length === 1
        throw Object.assign(
          new Error(`Cannot pack or publish: "overrides" ${isOne ? 'affects a bundled package' : 'affect bundled packages'} (${list}). Consumers do not apply your package's overrides, so the published bundle will produce invalid dependency edges. Remove ${isOne ? 'this package' : 'these packages'} from "bundledDependencies"/"bundleDependencies" or from "overrides" before publishing.`),
          { code: 'EBUNDLEOVERRIDE', packages: names }
        )
      }
    }
  }

  const stdio = opts.foregroundScripts ? 'inherit' : 'pipe'

  if (spec.type === 'directory' && !opts.ignoreScripts) {
    // prepack
    await runScript({
      ...opts,
      event: 'prepack',
      path: spec.fetchSpec,
      stdio,
      pkg: manifest,
    })
  }

  // When packing a workspace directory, hoisted bundled dependencies need to
  // appear inside the workspace's node_modules so that packlist includes them
  // with correct paths (node_modules/<dep>/file, not ../../node_modules/...).
  // Create temporary symlinks before tar, clean up after.
  const cleanupSymlinks = []
  const wsNmDir = spec.type === 'directory' ? path.join(spec.fetchSpec, 'node_modules') : null
  if (wsNmDir && opts.prefix && spec.fetchSpec !== opts.prefix) {
    const rootArb = new Arborist({ path: opts.prefix })
    const fullTree = await rootArb.loadActual()
    for (const node of fullTree.inventory.values()) {
      if (node.path === spec.fetchSpec) {
        node.root = node
        const toBundle = node.package.bundleDependencies || []
        for (const dep of toBundle) {
          const edge = node.edgesOut.get(dep)
          if (!edge || edge.peer || edge.dev) continue
          const depNode = node.edgesOut.get(dep).to
          if (!depNode) continue
          const depRealPath = depNode.realpath
          const linkPath = path.join(wsNmDir, dep)
          try {
            await mkdir(wsNmDir, { recursive: true })
            await symlink(path.relative(path.dirname(linkPath), depRealPath), linkPath)
            cleanupSymlinks.push(linkPath)
          } catch {}
        }
        break
      }
    }
  }

  // packs tarball
  const tarballOpts = {
    ...opts,
    Arborist,
    integrity: manifest._integrity,
  }
  // pacote re-parses manifest._resolved as type=remote, so allow-remote=none
  // would mis-fire on the tarball URL the registry just handed us. mirror
  // arborist reify's carve-out: trust resolved tarballs for registry-typed specs.
  if (spec.registry) {
    tarballOpts.allowRemote = 'all'
  }
  const tarball = await pacote.tarball(manifest._resolved, tarballOpts)

  // check for explicit `false` so the default behavior is to skip writing to disk
  if (opts.dryRun === false) {
    const filename = `${manifest.name}-${manifest.version}.tgz`
      .replace(/^@/, '').replace(/[/\\]/g, '-')
    const destination = path.resolve(opts.packDestination, filename)
    await writeFile(destination, tarball)
  }

  // Clean up temporary symlinks
  for (const link of cleanupSymlinks) {
    try { await unlink(link) } catch {}
  }

  if (spec.type === 'directory' && !opts.ignoreScripts) {
    // postpack
    await runScript({
      ...opts,
      event: 'postpack',
      path: spec.fetchSpec,
      stdio,
      pkg: manifest,
      env: {
        npm_package_from: tarball.from,
        npm_package_resolved: tarball.resolved,
        npm_package_integrity: tarball.integrity,
      },
    })
  }

  return tarball
}
