const PackageJson = require('@npmcli/package-json')

// `gypfile: false` opts a package out of the synthetic `node-gyp rebuild`
// install script npm adds when it finds a `binding.gyp`.
//
// The flag is only on the tree node when the node came from a packument or
// from disk. Lockfile-derived nodes (`npm ci`, a repeat `npm install`) carry
// no `gypfile` field at all, so the opt-out is invisible there and has to be
// read back off the installed package.json.
const hasGypfileOptOut = async (path, gypfile) => {
  if (gypfile !== undefined) {
    return gypfile === false
  }

  const { content } = await PackageJson.load(path).catch(() => ({ content: {} }))
  return content.gypfile === false
}

module.exports = { hasGypfileOptOut }
