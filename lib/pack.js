'use strict'

const util = require('util')
const log = require('npmlog')
const pacote = require('pacote')
const libpack = require('libnpmpack')
const npa = require('npm-package-arg')

const npm = require('./npm.js')
const output = require('./utils/output.js')
const { getContents, logTar } = require('./utils/tar.js')

const writeFile = util.promisify(require('fs').writeFile)

cmd.usage = 'npm pack [[<@scope>/]<pkg>...] [--dry-run]'

module.exports = cmd
function cmd (args, silent, cb) {
  if (typeof cb !== 'function') {
    cb = silent
    silent = false
  }
  pack(args, silent)
    .then(() => cb())
    .catch(cb)
}

async function pack (args, silent) {
  if (args.length === 0) args = ['.']

  const opts = { ...npm.flatOptions }
  const { unicode, json } = opts

  const tarballs = await Promise.all(args.map((arg) => pack_(arg, opts)))
  if (!silent && json) {
    output(JSON.stringify(tarballs, null, 2))
  } else if (!silent) {
    tarballs.forEach((tar) => {
      logTar(tar, { log, unicode })
    })
  }

  return tarballs
}

async function pack_ (arg, opts) {
  const spec = npa(arg)
  const manifest = await pacote.manifest(spec)
  const filename = `${manifest.name}-${manifest.version}.tgz`
  const tarballData = await libpack(arg)
  const pkgContents = await getContents(manifest, tarballData)
  const { dryRun } = opts

  if (!dryRun) {
    await writeFile(filename, tarballData)
  }

  return pkgContents
}
