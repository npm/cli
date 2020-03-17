'use strict'

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const Arborist = require('@npmcli/arborist')
const rimraf = promisify(require('rimraf'))
const lstat = promisify(fs.lstat)

const npm = require('./npm')
const output = require('./utils/output')

ci.usage = 'npm ci'

ci.completion = (cb) => cb(null, [])

module.exports = ci
async function ci (args, cb) {
  try {
    const where = npm.flatOptions.prefix
    if (
      await hasLockfile(where, 'package-lock.json') ||
      await hasLockfile(where, 'npm-shrinkwrap.json')
    ) {
      const arb = new Arborist({ ...npm.flatOptions, path: where })

      const start = Date.now()
      await rimraf(`${where}/node_modules/`)
      await arb.reify({ ...npm.flatOptions })
      const stop = Date.now()

      const pkgCount = arb.diff.children.length
      const added = `added ${pkgCount}`
      const time = (stop - start) / 1000
      output(`${added} packages in ${time}s`)
      cb()
    } else {
      const msg = `The \`npm ci\` command can only install packages with an existing
package-lock.json or npm-shrinkwrap.json with lockfileVersion >= 1. Run an install
with npm@5 or later to generate a package-lock.json file, then try again.`
      throw new Error(msg)
    }
  } catch (err) {
    cb(err)
  }
}

async function hasLockfile (path, lockfile) {
  try {
    await lstat(`${path}/${lockfile}`)
    return true
  } catch (_) {
    return false
  }
}
