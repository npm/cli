'use strict'

const util = require('util')
const log = require('npmlog')
const semver = require('semver')
const pack = require('libnpmpack')
const libpub = require('libnpmpublish').publish
const runScript = require('@npmcli/run-script')

const npm = require('./npm.js')
const output = require('./utils/output.js')
const otplease = require('./utils/otplease.js')
const { getContents, logTar } = require('./utils/tar.js')

const readJson = util.promisify(require('read-package-json'))

cmd.usage = 'npm publish [<folder>] [--tag <tag>] [--access <public|restricted>] [--dry-run]' +
                "\n\nPublishes '.' if no argument supplied" +
                '\n\nSets tag `latest` if no --tag specified'

module.exports = cmd
function cmd(args, cb) {
  publish(args, cb)
    .then(() => cb())
    .catch(cb)
}

async function publish (args, cb) {
  if (args.length === 0) args = ['.']
  if (args.length !== 1) return cb(publish.usage)

  log.verbose('publish', args) 

  const opts = { ...npm.flatOptions }
  const { json, defaultTag } = opts
  if (semver.validRange(defaultTag)) {
    return cb(new Error('Tag name must not be a valid SemVer range: ' + t))
  }

  const tarball = await publish_(args[0], opts)
  const silent = log.level === 'silent'
  if (!silent && json) {
    output(JSON.stringify(tarball, null, 2))
  } else if (!silent) {
    output(`+ ${tarball.id}`)
  }

  return tarball
}

async function publish_ (arg, opts) {
  const { unicode, dryRun, json } = opts
  let manifest = await readJson(`${arg}/package.json`)

  // prepublishOnly
  await runScript({
    event: 'prepublishOnly',
    path: arg,
    stdio: 'inherit',
    pkg: manifest
  })
  
  const tarballData = await pack(arg)
  const pkgContents = await getContents(manifest, tarballData)

  if (!json) {
    logTar(pkgContents, { log, unicode })
  }
  
  if (!dryRun) {
    // The purpose of re-reading the manifest is in case it changed, 
    // so that we send the latest and greatest thing to the registry
    manifest = await readJson(`${arg}/package.json`)
    await otplease(opts, opts => libpub(arg, manifest, opts))
  }

  // publish
  await runScript({
    event: 'publish',
    path: arg,
    stdio: 'inherit',
    pkg: manifest
  })

  // postpublish
  await runScript({
    event: 'postpublish',
    path: arg,
    stdio: 'inherit',
    pkg: manifest
  })

  return pkgContents
}
