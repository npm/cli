'use strict'

const { readdir } = require('fs')
const { resolve } = require('path')

const Arborist = require('@npmcli/arborist')

const npm = require('./npm.js')
const usageUtil = require('./utils/usage.js')
const reifyOutput = require('./utils/reify-output.js')

const completion = (opts, cb) => {
  const dir = npm.globalDir
  readdir(dir, (er, files) => cb(er, files.filter(f => !/^[._-]/.test(f))))
}

const usage = usageUtil(
  'link',
  'npm link (in package dir)' +
  '\nnpm link [<@scope>/]<pkg>'
)

const cmd = (args, cb) => link(args).then(() => cb()).catch(cb)

const link = async args => {
  if (npm.config.get('global')) {
    throw Object.assign(
      new Error(
        'link should never be --global.\n' +
        'Please re-run this command with --local'
      ),
      { code: 'ELINKGLOBAL' }
    )
  }

  // link with no args: symlink the folder to the global location
  // link with package arg: symlink the global to the local
  args = args.filter(a => resolve(a) !== npm.prefix)
  return args.length
    ? linkInstall(args)
    : linkPkg()
}

const linkInstall = async args => {
  // load current packages from the global space,
  // and then add symlinks installs locally
  const globalTop = resolve(npm.globalDir, '..')
  const globalArb = new Arborist({
    ...npm.flatOptions,
    path: globalTop,
    global: true
  })

  const globals = await globalArb.loadActual()

  const links = [
    ...globals.children.values()
  ]
    .filter(i => args.some(j => j === i.name))

  const localArb = new Arborist({
    ...npm.flatOptions,
    path: npm.prefix
  })
  await localArb.reify({
    add: links.map(l => `file:${resolve(globalTop, 'node_modules', l.path)}`)
  })

  reifyOutput(localArb)
}

const linkPkg = async () => {
  const globalTop = resolve(npm.globalDir, '..')
  const arb = new Arborist({
    ...npm.flatOptions,
    path: globalTop,
    global: true
  })
  await arb.reify({ add: [`file:${npm.prefix}`] })
  reifyOutput(arb)
}

module.exports = Object.assign(cmd, { completion, usage })
