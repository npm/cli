const util = require('util')
const log = require('npmlog')
const pacote = require('pacote')
const libpack = require('libnpmpack')
const npa = require('npm-package-arg')

const npm = require('./npm.js')
const { getContents, logTar } = require('./utils/tar.js')

const writeFile = util.promisify(require('fs').writeFile)

const completion = require('./utils/completion/none.js')
const usageUtil = require('./utils/usage.js')
const usage = usageUtil('pack', 'npm pack [[<@scope>/]<pkg>...] [--dry-run]')

const cmd = (args, cb) => pack(args).then(() => cb()).catch(cb)

const pack = async (args) => {
  if (args.length === 0) args = ['.']

  const opts = { ...npm.flatOptions }
  const { unicode } = opts

  const tarballs = await Promise.all(args.map((arg) => pack_(arg, opts)))
  tarballs.forEach(tar => logTar(tar, { log, unicode }))

  return tarballs
}

const pack_ = async (arg, { dryRun }) => {
  const spec = npa(arg)
  const manifest = await pacote.manifest(spec)
  const filename = `${manifest.name}-${manifest.version}.tgz`
  const tarballData = await libpack(arg)
  const pkgContents = await getContents(manifest, tarballData)

  if (!dryRun) {
    await writeFile(filename, tarballData)
  }

  return pkgContents
}

module.exports = Object.assign(cmd, { usage, completion })
