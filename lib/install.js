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
module.exports.Installer = Installer

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
var archy = require('archy')

// npm internal utils
var npm = require('./npm.js')
var parseJSON = require('./utils/parse-json.js')
var output = require('./utils/output.js')
var saveMetrics = require('./utils/metrics.js').save

// install specific libraries
var audit = require('./install/audit.js')
var {
  getPrintFundingReport,
  getPrintFundingReportJSON
} = require('./install/fund.js')
var errorMessage = require('./utils/error-message.js')

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
  var dryrun = npm.flatOptions.dryRun

  // TODO: Add warnings for other deprecated flags
  if (npm.config.get('dev')) {
    log.warn('install', 'Usage of the `--dev` option is deprecated. Use `--include=dev` instead.')
  }

  if (where === globalTop && !args.length) {
    args = ['.']
  }
  args = args.filter(function (a) {
    return path.resolve(a) !== npm.prefix
  })

    /* used to build up the appropriate {add:{...}} options to Arborist.reify
    save: npm.config.get('save'),
    saveBundle: npm.config.get('save-bundle'),
    saveDev: npm.config.get('save-dev'),
    saveOptional: npm.config.get('save-optional'),
    savePeer: npm.config.get('save-peer'),
    saveProd: npm.config.get('save-prod'),
    saveExact: npm.config.get('save-exact'),
    savePrefix: npm.config.get('save-prefix'),*/

  const opts = {
    ...npm.flatOptions,
    add: {

    }
  }

}

