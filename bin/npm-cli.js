#!/usr/bin/env node

process.title = 'npm'

const {
  checkForBrokenNode,
  checkForUnsupportedNode,
  checkVersion
} = require('../lib/utils/unsupported.js')

checkForBrokenNode()

const log = require('npmlog')
// pause it here so it can unpause when we've loaded the configs
// and know what loglevel we should be printing.
log.pause()

checkForUnsupportedNode()

const npm = require('../lib/npm.js')
const { defs: { shorthands, types } } = require('../lib/config/core.js')
const errorHandler = require('../lib/utils/error-handler.js')
const nopt = require('nopt')

// if npm is called as "npmg" or "npm_g", then
// run in global mode.
if (process.argv[1][process.argv[1].length - 1] === 'g') {
  process.argv.splice(1, 1, 'npm', '-g')
}

log.verbose('cli', process.argv)

const conf = nopt(types, shorthands)
npm.argv = conf.argv.remain

if (conf.version) {
  console.log(npm.version)
  return errorHandler.exit(0)
}

if (conf.versions) {
  npm.argv = ['version']
  conf.usage = false
}

log.info('using', 'npm@%s', npm.version)
log.info('using', 'node@%s', process.version)

process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)

const isGlobalNpmUpdate = npm => {
  return npm.config.get('global') &&
    ['install', 'update'].includes(npm.command) &&
    npm.argv.includes('npm')
}

// now actually fire up npm and run the command.
// this is how to use npm programmatically:
conf._exit = true
npm.load(conf, function (er) {
  if (er) return errorHandler(er)
  if (
    !isGlobalNpmUpdate(npm) &&
    npm.config.get('update-notifier') &&
    !checkVersion(process.version).unsupported
  ) {
    // XXX move update notifier stuff into separate module
    const pkg = require('../package.json')
    let notifier = require('update-notifier')({pkg})
    const isCI = require('ci-info').isCI
    if (
      notifier.update &&
      notifier.update.latest !== pkg.version &&
      !isCI
    ) {
      const color = require('ansicolors')
      const useColor = npm.color
      const useUnicode = npm.config.get('unicode')
      const old = notifier.update.current
      const latest = notifier.update.latest
      let type = notifier.update.type
      if (useColor) {
        switch (type) {
          case 'major':
            type = color.red(type)
            break
          case 'minor':
            type = color.yellow(type)
            break
          case 'patch':
            type = color.green(type)
            break
        }
      }
      const changelog = `https://github.com/npm/cli/releases/tag/v${latest}`
      notifier.notify({
        message: `New ${type} version of ${pkg.name} available! ${
          useColor ? color.red(old) : old
        } ${useUnicode ? '→' : '->'} ${
          useColor ? color.green(latest) : latest
        }\n` +
        `${
          useColor ? color.yellow('Changelog:') : 'Changelog:'
        } ${
          useColor ? color.cyan(changelog) : changelog
        }\n` +
        `Run ${
          useColor
            ? color.green(`npm install -g ${pkg.name}`)
            : `npm i -g ${pkg.name}`
        } to update!`
      })
    }
  }

  const cmd = npm.argv.shift()
  const impl = npm.commands[cmd]
  if (impl) {
    impl(npm.argv, errorHandler)
  } else {
    npm.config.set('usage', false)
    npm.argv.unshift(cmd)
    npm.commands.help(npm.argv, errorHandler)
  }
})
