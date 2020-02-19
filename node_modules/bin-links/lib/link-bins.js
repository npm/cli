const isWindows = require('./is-windows.js')
const { dirname, resolve, relative } = require('path')
const linkBin = isWindows ? require('./shim-bin.js') : require('./link-bin.js')
const normalize = require('npm-normalize-package-bin')

const linkBins = ({path, binTarget, pkg, force}) => {
  pkg = normalize(pkg)
  if (!pkg.bin)
    return Promise.resolve([])
  const promises = []
  for (const [key, val] of Object.entries(pkg.bin)) {
    const to = resolve(binTarget, key)
    const absFrom = resolve(path, val)
    const from = relative(dirname(to), absFrom)
    promises.push(linkBin({path, from, to, absFrom, force}))
  }
  return Promise.all(promises)
}

module.exports = linkBins
