'use strict'
/* eslint-disable camelcase */
/* eslint-disable standard/no-callback-literal */
// npm install <pkg> <pkg> <pkg>
//
// See doc/cli/npm-install.md for more description
//
// Managing contexts...
// there's a lot of state associated with an "install" operation, including
// packages that are already installed, parent packages, current shrinkwrap, and
// so on. We maintain this state in a "context" object that gets passed around.
// every time we dive into a deeper node_modules folder, the "family" list that
// gets passed along uses the previous "family" list as its __proto__.  Any
// "resolved precise dependency" things that aren't already on this object get
// added, and then that's passed to the next generation of installation.

module.exports = install

// --- node core modules
const fs = require('fs')
// - @npmcli modules
const Arborist = require('@npmcli/arborist')
const log = require('npmlog')
const validate = require('aproba')
// - deps
const asyncMap = require('slide').asyncMap // XXX remove this
const archy = require('archy')
// - npm internal utils
const audit = require('./install/audit.js')
const {
  getPrintFundingReport,
  getPrintFundingReportJSON
} = require('./install/fund.js')
const usage = require('./utils/usage')
const npm = require('./npm.js')
const output = require('./utils/output.js')
const errorMessage = require('./utils/error-message.js')
// XXX this file doesn't exist anymore; remove this
// const sillyLogTree = require('./util/silly-log-tree.js')
// ---

const path = require('path')

install.usage = usage(
  'install',
  '\nnpm install (with no args, in package dir)' +
  '\nnpm install [<@scope>/]<pkg>' +
  '\nnpm install [<@scope>/]<pkg>@<tag>' +
  '\nnpm install [<@scope>/]<pkg>@<version>' +
  '\nnpm install [<@scope>/]<pkg>@<version range>' +
  '\nnpm install <alias>@npm:<name>' +
  '\nnpm install <folder>' +
  '\nnpm install <tarball file>' +
  '\nnpm install <tarball url>' +
  '\nnpm install <git:// url>' +
  '\nnpm install <github username>/<github project>',
  '[--save-prod|--save-dev|--save-optional] [--save-exact] [--no-save]'
)

install.completion = function (opts, cb) {
  validate('OF', arguments)
  // install can complete to a folder with a package.json, or any package.
  // if it has a slash, then it's gotta be a folder
  // if it starts with https?://, then just give up, because it's a url
  if (/^https?:\/\//.test(opts.partialWord)) {
    // do not complete to URLs
    return cb(null, [])
  }

  if (/\//.test(opts.partialWord)) {
    // Complete fully to folder if there is exactly one match and it
    // is a folder containing a package.json file.  If that is not the
    // case we return 0 matches, which will trigger the default bash
    // complete.
    var lastSlashIdx = opts.partialWord.lastIndexOf('/')
    var partialName = opts.partialWord.slice(lastSlashIdx + 1)
    var partialPath = opts.partialWord.slice(0, lastSlashIdx)
    if (partialPath === '') partialPath = '/'

    var annotatePackageDirMatch = function (sibling, cb) {
      var fullPath = path.join(partialPath, sibling)
      if (sibling.slice(0, partialName.length) !== partialName) {
        return cb(null, null) // not name match
      }
      fs.readdir(fullPath, function (err, contents) {
        if (err) return cb(null, { isPackage: false })

        cb(
          null,
          {
            fullPath: fullPath,
            isPackage: contents.indexOf('package.json') !== -1
          }
        )
      })
    }

    return fs.readdir(partialPath, function (err, siblings) {
      if (err) return cb(null, []) // invalid dir: no matching

      asyncMap(siblings, annotatePackageDirMatch, function (err, matches) {
        if (err) return cb(err)

        var cleaned = matches.filter(function (x) { return x !== null })
        if (cleaned.length !== 1) return cb(null, [])
        if (!cleaned[0].isPackage) return cb(null, [])

        // Success - only one match and it is a package dir
        return cb(null, [cleaned[0].fullPath])
      })
    })
  }

  // FIXME: there used to be registry completion here, but it stopped making
  // sense somewhere around 50,000 packages on the registry
  cb()
}

async function install (where, args, cb) {
  if (!cb) {
    cb = args
    args = where
    where = null
  }

  // the /path/to/node_modules/..
  const globalTop = path.resolve(npm.globalDir, '..')
  const {
    dryRun,
    global: isGlobalInstall
  } = npm.flatOptions

  // Determine where install is happening
  // - If `where` is NOT set, then we need to determine if it's a global install
  //    or if it's a local context install (hence nested ternary)
  // - `where` IS SET, just use it
  where = (!where)
    ? (isGlobalInstall)
      ? globalTop
      : npm.prefix
    : where

  // TODO: Add warnings for other deprecated flags
  if (npm.config.get('dev')) {
    log.warn('install', 'Usage of the `--dev` option is deprecated. Use `--include=dev` instead.')
  }

  // If global install, and NO args passed; user meant "this directory context"
  if (where === globalTop && !args.length) {
    args = ['.']
  }

  // Filter our paths that are not THIS directory
  args = args.filter(a => path.resolve(a) !== npm.prefix)

  // Create arborist object to work with
  const arb = new Arborist({ ...npm.flatOptions, path: where })

  const arbCallOpts = { ...npm.flatOptions, add: args }

  try {
    const start = Date.now()

    const tree = (dryRun)
      ? await arb.buildIdealTree(arbCallOpts)
      : await arb.reify(arbCallOpts)

    const stop = Date.now()

    // Print list of installed packages and their version
    // Buffer with newline
    output('')
    arb.diff.children.forEach(diff => {
      const node = diff.ideal
      if (diff.action === 'ADD' && arb.explicitRequests.has(node.name)) {
        output(`+ ${node.name}@${node.package.version}`)
      }
    })

    /**
     * TODO:
     * - Add audit
     * - Add funding
     */

    printResults({ start, stop }, tree, arb)
    cb()
  } catch (err) {
    const msg = errorMessage(err)
    msg.summary.forEach(s => log.warn.apply(log, s))
    msg.detail.forEach(d => log.verbose.apply(log, d))
    cb(err)
  }
}

function printResults (timing, tree, arb) {
  const { unicode } = npm.flatOptions

  // Create archy tree from arborist tree
  const reducedTree = reduceArbTree(tree)
  const archyTree = archy(reducedTree, '', { unicode })

  // Collect information about command action taken
  const pkgCount = arb.diff.children.length
  const contribCount = pkgCount
  const added = `added ${pkgCount}`

  const from = `from ${contribCount} contributor${contribCount ? 's' : ''}`
  const audited = `audited ${0} package${'s'}`
  const time = (timing.stop - timing.start) / 1000

  // Print summary of command action taken
  output(`${added}, ${from}, and ${audited} in ${time}s`)

  // Optionally print the top level dependency tree
  log.silly('topLevelDepTree', archyTree)
}

function reduceArbTree (rootNode) {
  const initialValue = {
    label: rootNode.name,
    nodes: []
  }
  const rootChildrenMap = rootNode.children
  for (const child of rootChildrenMap.keys()) {
    initialValue.nodes.push(child)
  }

  return initialValue
}
