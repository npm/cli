const {basename, dirname } = require('path')
const isWindows = require('./lib/is-windows.js')

const linkBins = require('./lib/link-bins.js')
const linkMans = require('./lib/link-mans.js')

const binLinks = opts => {
  const { path, pkg, force, global, top } = opts
  // global top pkgs on windows get bins installed in {prefix}, and no mans
  //
  // unix global top pkgs get their bins installed in {prefix}/bin,
  // and mans in {prefix}/share/man
  //
  // non-top pkgs get their bins installed in {prefix}/node_modules/.bin,
  // and do not install mans
  //
  // non-global top pkgs don't have any bins or mans linked.
  if (top && !global)
    return Promise.resolve()

  // now we know it's global and/or not top, so the path has to be
  // {prefix}/node_modules/{name}.  Can't rely on pkg.name, because
  // it might be installed as an alias.
  const scopeOrNm = dirname(path)
  const nm = basename(scopeOrNm) === 'node_modules' ? scopeOrNm
    : dirname(scopeOrNm)
  const prefix = dirname(nm)

  const binTarget = !top ? nm + '/.bin'
    : isWindows ? prefix
    : dirname(prefix) + '/bin'

  const manTarget = !top || isWindows ? null
    : dirname(prefix) + '/share/man'

  return Promise.all([
    // allow clobbering within the local node_modules/.bin folder.
    // only global bins are protected in this way, or else it is
    // yet another vector for excessive dependency conflicts.
    linkBins({path, binTarget, pkg, force: force || !top}),
    linkMans({path, manTarget, pkg, force}),
  ])
}

module.exports = binLinks
