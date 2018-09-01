const boxen = require('boxen')
const cacache = require('cacache')
const log = require('npmlog')
const nopt = require('nopt')
const path = require('path')
const pacote = require('pacote')
const semver = require('semver')

const npm = require('../npm.js')
const npmconf = require('../config/core.js')
const configDefs = npmconf.defs
const shorthands = configDefs.shorthands
const types = configDefs.types
const pacoteOpts = require('../config/pacote')
const unsupported = require('./unsupported.js')

exports.check = function () {
  var checkerLaunch = require('./version-checker-launch')
  return checkerLaunch()
}

exports.doCheck = function () {
  const conf = nopt(types, shorthands)
  npm.argv = conf.argv.remain
  const isGlobalNpmUpdate = conf.global && ['install', 'update'].includes(npm.command) && npm.argv.includes('npm')
  const isCI = require('ci-info').isCI

  npm.load(conf, function (err) {
    if (err) return

    isBeyondCheckInterval().then((shouldCheck) => {
      if (shouldCheck) {
        if (
          npm.config.get('update-notifier') &&
          !isGlobalNpmUpdate &&
          !unsupported.checkVersion(process.version).unsupported &&
          !isCI
        ) {
          pacote.manifest('npm@latest', pacoteOpts())
            .then((latest) => {
              const oldVersion = require('../../package.json').version
              let diffType = semver.diff(oldVersion, latest.version)
              if (diffType) {
                console.log(generateMessage(oldVersion, latest.version, diffType, npm))
              } else {
                log.silly('version-checker', 'we are running the latest version of npm')
              }
            })
        }
      }
    })
  })
}

function isBeyondCheckInterval () {
  const cache = path.join(npm.config.get('cache'), '_cacache')
  const ONE_DAY = 24 * 60 * 60 * 1000

  return cacache.get(cache, 'update-notifier:last-check').then(cacheObj => {
    const time = Number(cacheObj.data.toString('utf8'))
    return (time + ONE_DAY) < Date.now()
  }).catch((notFound) => {
    const time = Number(Date.now()).toString()
    return cacache.put(cache, 'update-notifier:last-check', time).then(() => {
      return true
    })
  })
}

function generateMessage (oldVersion, latestVersion, diffType, npm) {
  const color = require('ansicolors')
  const useColor = npm.config.get('color')
  const useUnicode = npm.config.get('unicode')
  if (useColor) {
    switch (diffType) {
      case 'major':
        diffType = color.red(diffType)
        break
      case 'minor':
        diffType = color.yellow(diffType)
        break
      case 'patch':
        diffType = color.green(diffType)
        break
    }
  }
  const changelog = `https://github.com/npm/cli/releases/tag/v${latestVersion}`

  let message = `New ${diffType} version of npm available! ${
    useColor ? color.red(oldVersion) : oldVersion
  } ${useUnicode ? '→' : '->'} ${
    useColor ? color.green(latestVersion) : latestVersion
  }\n` +
  `${
    useColor ? color.yellow('Changelog:') : 'Changelog:'
  } ${
    useColor ? color.cyan(changelog) : changelog
  }\n` +
  `Run ${
    useColor
      ? color.green(`npm install -g npm`)
      : `npm i -g npm`
  } to update!`

  const boxenOptions = {
    padding: 1,
    margin: 1,
    align: 'center',
    borderColor: 'yellow',
    borderStyle: 'round'
  }
  return boxen(message, boxenOptions)
}
