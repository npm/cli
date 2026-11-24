const { relative } = require('node:path')

const Arborist = require('@npmcli/arborist')
const npa = require('npm-package-arg')
const pkgContents = require('@npmcli/installed-package-contents')
const pacote = require('pacote')
const { tarCreateOptions } = pacote.DirFetcher
const tar = require('tar')

// returns a simplified tarball when reading files from node_modules folder,
// thus avoiding running the prepare scripts and the extra logic from packlist
const nodeModulesTarball = (manifest) =>
  pkgContents({ path: manifest._resolved, depth: 1 })
    .then(files =>
      files.map(file => relative(manifest._resolved, file))
    )
    .then(files =>
      tar.c(tarCreateOptions(manifest), files).concat()
    )

const tarball = (manifest, opts) => {
  const resolved = manifest._resolved
  const where = opts.where || process.cwd()

  const fromNodeModules = npa(resolved).type === 'directory'
    && /node_modules[\\/](@[^\\/]+\/)?[^\\/]+[\\/]?$/.test(relative(where, resolved))

  if (fromNodeModules) {
    return nodeModulesTarball(manifest, opts)
  }

  // pacote re-parses manifest._resolved as type=remote, so allow-remote=none
  // would mis-fire on the tarball URL the registry just handed us. mirror
  // arborist reify's carve-out: trust resolved tarballs for registry-typed specs.
  const tarballOpts = { ...opts, Arborist }
  let fromSpec
  try {
    fromSpec = manifest._from ? npa(manifest._from) : null
  } catch {
    fromSpec = null
  }
  let spec = manifest._resolved
  if (fromSpec?.registry) {
    tarballOpts.allowRemote = 'all'
    // fetch as name@url like arborist reify does, so the package scope selects
    // the scoped registry and its credentials when the tarball URL is not
    // under the registry path (e.g. GitLab project-level tarball URLs).
    if (manifest.name) {
      spec = `${manifest.name}@${manifest._resolved}`
    }
  }

  return pacote.tarball(spec, tarballOpts)
}

module.exports = tarball
