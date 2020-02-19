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

var usage = require('./utils/usage')

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

const npa = require('npm-package-arg')

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

const Arborist = require('@npmcli/arborist')

// dependencies
var log = require('npmlog')
// const sillyLogTree = require('./util/silly-log-tree.js')

// npm internal utils
var npm = require('./npm.js')
var output = require('./utils/output.js')
var saveMetrics = require('./utils/metrics.js').save

// install specific libraries
var audit = require('./install/audit.js')
var {
  getPrintFundingReport,
  getPrintFundingReportJSON
} = require('./install/fund.js')
var errorMessage = require('./utils/error-message.js')

const path = require('path')

function install (where, args, cb) {
  if (!cb) {
    cb = args
    args = where
    where = null
  }
  // the /path/to/node_modules/..
  var globalTop = path.resolve(npm.globalDir, '..')
  if (!where) {
    where = npm.flatOptions.global
      ? globalTop
      : npm.prefix
  }
  const {dryRun} = npm.flatOptions.dryRun

  // TODO: Add warnings for other deprecated flags
  if (npm.config.get('dev')) {
    log.warn('install', 'Usage of the `--dev` option is deprecated. Use `--include=dev` instead.')
  }

  if (where === globalTop && !args.length) {
    args = ['.']
  }
  args = args.filter(a => path.resolve(a) !== npm.prefix)

  const saveWhere = npm.flatOptions.saveProd ? 'dependencies'
    : npm.flatOptions.saveDev ? 'devDependencies'
    : npm.flatOptions.saveOptional ? 'optionalDependencies'
    : npm.flatOptions.savePeer ? 'peerDependencies'
    : 'dependencies'

  const {saveBundled} = npm.flatOptions
  const add = !args.length ? null : args.reduce((add, a) => {
    // npm install foo
    // npm install @foo/bar
    // npm install foo@bar
    // npm install @foo/bar@baz
    // npm install git+ssh://foogit.com:bar/baz#boo
    const spec = npa(a, where)
    add[saveWhere].push(spec)

    // XXX need to fix this npm install http://foo.com/bar.tgz --save-bundled
    // TODO: arborist should take saveBundled boolean
    // Point of research: can you bundle any dep other than production?  If not,
    // we can pass `bundleDependencies: [array, of, specs]` to arborist,
    // it'll do {dependencies:{name:spec, ...}, bundleDependencies:[name,...]}
    if (saveBundled && spec.name) {
      add.bundleDependencies.push(spec.name)
    }
    return add
  }, { [saveWhere]: [], bundleDependencies: [] })

  const arb = new Arborist({
    ...this.flatOptions,
    path: where,
  })

  // TODO:
  // - audit
  // - funding
  // - more logging (archy-ize the tree for silly logging)
  // - global installs in Arborist

  const opt = {
    ...this.flatOptions,
    add,
  }
  arb[dryRun ? 'buildIdealTree' : 'reify'](opt).then(tree => {
    output('TREEEEEEEE', tree)
    cb()
  }, er => cb(er))
}
