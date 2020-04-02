'use strict'

const util = require('util')
const Arborist = require('@npmcli/arborist')
const rimraf = util.promisify(require('rimraf'))

const npm = require('./npm.js')
const output = require('./utils/output.js')

cmd.usage = 'npm ci'

cmd.completion = (cb) => cb(null, [])

module.exports = cmd
function cmd(cb) {
  ci()
    .then(() => cb())
    .catch(cb)
}

async function ci () {
  const where = npm.flatOptions.global
    ? globalTop
    : npm.prefix

  const arb = new Arborist({ ...npm.flatOptions, path: where })

  try {
    await arb.loadVirtual()
    const start = Date.now()
    await rimraf(`${where}/node_modules/`)
    await arb.reify()
    const stop = Date.now()

    const time = (stop - start) / 1000
    const pkgCount = arb.diff.children.length
    const added = `added ${pkgCount}`
    output(`${added} packages in ${time}s`)

  } catch (err) {
    if (err.message.match(/shrinkwrap/)) {
      const msg = 'The \`npm ci\` command can only install packages with an existing ' +
      'package-lock.json or npm-shrinkwrap.json with lockfileVersion >= 1. Run an install ' +
      'with npm@5 or later to generate a package-lock.json file, then try again.'
      throw new Error(msg)
    } else {
      throw err
    }
  }
}
