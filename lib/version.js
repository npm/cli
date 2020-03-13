'use strict'

const libversion = require('libnpmversion')
const npm = require('./npm.js')
const output = require('./utils/output.js')

const usage = 'npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]' +
              '\n(run in package dir)\n' +
              "'npm -v' or 'npm --version' to print npm version " +
              '(' + npm.version + ')\n' +
              "'npm view <pkg> version' to view a package's " +
              'published version\n' +
              "'npm ls' to inspect current package/dependency versions"

const version = (args, cb) => {
  switch (args.length) {
    case 0:
      list(cb)
      break
    case 1:
      libversion(args[0], {
        ...npm.flatOptions,
        path: npm.prefix
      }).then(newVersion => {
        output(newVersion)
        cb()
      }).catch(cb)
      break
    default:
      cb(version.usage)
      break
  }
}

const list = cb => {
  const results = {}
  const { promisify } = require('util')
  const { resolve } = require('path')
  const readFile = promisify(require('fs').readFile)
  const pj = resolve(npm.prefix, 'package.json')
  readFile(pj, 'utf8')
    .then(data => JSON.parse(data))
    .catch(er => ({}))
    .then(pkg => {
      if (pkg && pkg.name && pkg.version) {
        results[pkg.name] = pkg.version
      }
      results.npm = npm.version
      for (const [key, version] of Object.entries(process.versions)) {
        results[key] = version
      }

      output(npm.flatOptions.json ? JSON.stringify(results, null, 2) : results)
      cb()
    })
}

module.exports = Object.assign(version, { usage })
