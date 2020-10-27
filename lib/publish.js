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

// this is the only case in the CLI where we use the old full slow
// 'read-package-json' module, because we want to pull in all the
// defaults and metadata, like git sha's and default scripts and all that.
const readJson = util.promisify(require('read-package-json'))

const completion = require('./utils/completion/none.js')
const usageUtil = require('./utils/usage.js')
const usage = usageUtil('publish',
  'npm publish [<folder>] [--tag <tag>] [--access <public|restricted>] [--dry-run]' +
  '\n\nPublishes \'.\' if no argument supplied' +
  '\nSets tag `latest` if no --tag specified')

const cmd = (args, cb) => publish(args).then(() => cb()).catch(cb)

const publish = async args => {
  if (args.length === 0)
    args = ['.']
  if (args.length !== 1)
    throw usage

  log.verbose('publish', args)

  const opts = { ...npm.flatOptions }
  const { json, defaultTag } = opts
  if (semver.validRange(defaultTag))
    throw new Error('Tag name must not be a valid SemVer range: ' + defaultTag.trim())

  const tarball = await publish_(args[0], opts)
  const silent = log.level === 'silent'
  if (!silent && json)
    output(JSON.stringify(tarball, null, 2))
  else if (!silent)
    output(`+ ${tarball.id}`)

  return tarball
}

// for historical reasons, publishConfig in package.json can contain
// ANY config keys that npm supports in .npmrc files and elsewhere.
// We *may* want to revisit this at some point, and have a minimal set
// that's a SemVer-major change that ought to get a RFC written on it.
const { flatten } = require('./utils/flat-options.js')
const publishConfigToOpts = publishConfig =>
  // create a new object that inherits from the config stack
  // then squash the css-case into camelCase opts, like we do
  flatten(Object.assign(Object.create(npm.config.list[0]), publishConfig))

const publish_ = async (arg, opts) => {
  const { unicode, dryRun, json } = opts
  const manifest = await readJson(`${arg}/package.json`)

  if (manifest.publishConfig)
    Object.assign(opts, publishConfigToOpts(manifest.publishConfig))

  // prepublishOnly
  await runScript({
    event: 'prepublishOnly',
    path: arg,
    stdio: 'inherit',
    pkg: manifest,
  })

  const tarballData = await pack(arg, opts)
  const pkgContents = await getContents(manifest, tarballData)

  if (!json)
    logTar(pkgContents, { log, unicode })

  if (!dryRun) {
    // The purpose of re-reading the manifest is in case it changed,
    // so that we send the latest and greatest thing to the registry
    // note that publishConfig might have changed as well!
    const manifest = await readJson(`${arg}/package.json`, opts)
    if (manifest.publishConfig)
      Object.assign(opts, publishConfigToOpts(manifest.publishConfig))
    await otplease(opts, opts => libpub(arg, manifest, opts))
  }

  // publish
  await runScript({
    event: 'publish',
    path: arg,
    stdio: 'inherit',
    pkg: manifest,
  })

  // postpublish
  await runScript({
    event: 'postpublish',
    path: arg,
    stdio: 'inherit',
    pkg: manifest,
  })

  return pkgContents
}

module.exports = Object.assign(cmd, { usage, completion })
