'use strict'
/* eslint-disable camelcase */
/* eslint-disable standard/no-callback-literal */

const npm = require('./npm.js')
const usageUtil = require('./utils/usage.js')
const reifyOutput = require('./utils/reify-output.js')
const log = require('npmlog')
const { resolve, join } = require('path')
const Arborist = require('@npmcli/arborist')

// XXX remove anything relying on this "where" argument, then remove it
const install = async (where, args, cb) => {
  // the /path/to/node_modules/..
  const globalTop = resolve(npm.globalDir, '..')
  const { dryRun, global: isGlobalInstall } = npm.flatOptions
  if (typeof args === 'function') {
    cb = args
    args = where
    where = isGlobalInstall ? globalTop : npm.prefix
  }

  // don't try to install the prefix into itself
  args = args.filter(a => resolve(a) !== npm.prefix)

  // `npm i -g` => "install this package globally"
  if (where === globalTop && !args.length) {
    args = ['.']
  }

  // TODO: Add warnings for other deprecated flags?  or remove this one?
  if (npm.config.get('dev')) {
    log.warn('install', 'Usage of the `--dev` option is deprecated. Use `--include=dev` instead.')
  }

  const arb = new Arborist({
    ...npm.flatOptions,
    path: where
  })

  try {
    const tree = await arb.reify({
      ...npm.flatOptions,
      add: args,
    })
    reifyOutput(arb)
    cb()
  } catch (er) {
    cb(er)
  }
}

const usage = usageUtil(
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

const completion = (opts, cb) => {
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
    const lastSlashIdx = opts.partialWord.lastIndexOf('/')
    const partialName = opts.partialWord.slice(lastSlashIdx + 1)
    const partialPath = opts.partialWord.slice(0, lastSlashIdx) || '/'

    const annotatePackageDirMatch = (sibling, cb) => {
      const fullPath = join(partialPath, sibling)
      if (sibling.slice(0, partialName.length) !== partialName) {
        return cb(null, null) // not name match
      }
      fs.readdir(fullPath, function (err, contents) {
        if (err) return cb(null, { isPackage: false })

        cb(
          null,
          {
            fullPath,
            isPackage: contents.indexOf('package.json') !== -1
          }
        )
      })
    }

    return fs.readdir(partialPath, (err, siblings) => {
      if (err) return cb(null, []) // invalid dir: no matching

      asyncMap(siblings, annotatePackageDirMatch, (err, matches) => {
        if (err) return cb(err)

        const cleaned = matches.filter(x => x !== null)
        if (cleaned.length !== 1) return cb(null, [])
        if (!cleaned[0].isPackage) return cb(null, [])

        // Success - only one match and it is a package dir
        return cb(null, [cleaned[0].fullPath])
      })
    })
  }

  // Note: there used to be registry completion here, but it stopped making
  // sense somewhere around 50,000 packages on the registry
  cb()
}

module.exports = Object.assign(install, { usage, completion })
