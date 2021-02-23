const { resolve } = require('path')
const mapWorkspaces = require('@npmcli/map-workspaces')
const rpj = require('read-package-json-fast')

const npm = require('./npm.js')
const usageUtil = require('./utils/usage.js')

const wsCmds = new Map(Object.entries({
  docs: require('./workspaces/default.js'),
  doctor: require('./workspaces/default.js'),
  diff: require('./workspaces/default.js'),
  'dist-tag': require('./workspaces/default.js'),
  pack: require('./workspaces/default.js'),
  publish: require('./workspaces/default.js'),
  repo: require('./workspaces/default.js'),
  'set-script': require('./workspaces/default.js'),
  unpublish: require('./workspaces/default.js'),
  version: require('./workspaces/default.js'),
  view: require('./workspaces/default.js'),
  ls: require('./workspaces/ls.js'),
}))

class Workspaces {
  constructor (npm) {
    this.npm = npm
  }

  get usage () {
    return usageUtil('npm ws <cmd>')
  }

  exec (args, cb) {
    this.workspaces(args).then(() => cb()).catch(cb)
  }

  async workspaces (args) {
    if (npm.flatOptions.global) {
      throw Object.assign(
        new Error('`npm workspaces` does not support global packages'),
        { code: 'ENOGLOBAL' }
      )
    }

    if (!args.length) {
      throw Object.assign(
        new Error('`npm workspaces` needs at least a command to run'),
        { code: 'ENOWSCMD' }
      )
    }

    const cwd = npm.flatOptions.prefix
    const pkg = await rpj(resolve(npm.flatOptions.prefix, 'package.json'))
    const workspaces = await mapWorkspaces({ cwd, pkg })

    if (npm.flatOptions.workspace) {
      for (const workspaceArg of npm.flatOptions.workspace) {
        for (const [key, path] of workspaces.entries()) {
          if (workspaceArg !== key
            && resolve(npm.flatOptions.prefix, workspaceArg) !== path)
            workspaces.delete(key)
        }
      }
    }

    let [cmdName, ...cmdArgs] = args

    if (cmdName === 'workspaces')
      cmdName = cmdArgs.shift(1)

    if (wsCmds.has(cmdName)) {
      await wsCmds.get(cmdName)({
        args: cmdArgs,
        cmdName,
        npm: this.npm,
        workspaces,
      })
      return
    }

    throw Object.assign(
      new Error(`${cmdName} is not a recognized command`),
      { code: 'EBADWSCMD' }
    )
  }
}

module.exports = Workspaces
