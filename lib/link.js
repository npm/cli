// link with no args: symlink the folder to the global location
// link with package arg: symlink the global to the local

const npm = require('./npm.js')
const usageUtil = require('./utils/usage.js')
const reifyOutput = require('./utils/reify-output.js')
const { resolve } = require('path')
const Arborist = require('@npmcli/arborist')

const completion = (opts, cb) => {
  const { readdir } = require('fs')
  const dir = npm.globalDir
  readdir(dir, (er, files) => cb(er, files.filter(f => !/^[._-]/.test(f))))
}

const usage = usageUtil(
  'link',
  'npm link (in package dir)' +
  '\nnpm link [<@scope>/]<pkg>[@<version>]'
)

const cmd = (args, cb) => link(args).then(() => cb()).catch(cb)

const link = async args => {
  if (npm.config.get('global')) {
    throw new Error(
      'link should never be --global.\n' +
      'Please re-run this command with --local'
    )
  }

  args = args.filter(a => resolve(a) !== npm.prefix)
  return args.length ? linkInstall(args) : linkPkg()
}

const linkInstall = async args => {
  // add all the args as global installs, and then add symlink installs locally
  // to the packages in the global space.
  const globalTop = resolve(npm.globalDir, '..')
  const globalArb = new Arborist({
    ...npm.flatOptions,
    path: globalTop,
    global: true
  })

  const globals = await globalArb.reify({ add: args })

  const links = globals.edgesOut.keys()
  const localArb = new Arborist({
    ...npm.flatOptions,
    path: npm.prefix
  })
  await localArb.reify({
    add: links.map(l => `file:${resolve(globalTop, 'node_modules', l)}`)
  })

  reifyOutput(localArb)
}

const linkPkg = async () => {
  const arb = new Arborist({
    ...npm.flatOptions,
    path: resolve(npm.globalDir, '..'),
    global: true
  })
  await arb.reify({ add: [`file:${npm.prefix}`] })
  reifyOutput(arb)
}

module.exports = Object.assign(cmd, { completion, usage })
