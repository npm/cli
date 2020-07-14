// print a banner telling the user to upgrade npm to latest
// but not in CI, and not if we're doing that already.

const isGlobalNpmUpdate = npm => {
  return npm.config.get('global') &&
    ['install', 'update'].includes(npm.command) &&
    npm.argv.includes('npm')
}

const { checkVersion } = require('./unsupported.js')

module.exports = (npm) => {
  if (!npm.config.get('update-notifier') ||
    isGlobalNpmUpdate(npm) ||
    checkVersion(process.version).unsupported) {
    return
  }

  const pkg = require('../../package.json')
  const notifier = require('update-notifier')({pkg})
  const ciDetect = require('@npmcli/ci-detect')
  if (
    notifier.update &&
    notifier.update.latest !== pkg.version &&
    !ciDetect()
  ) {
    const chalk = require('chalk')
    const useColor = npm.color
    const useUnicode = npm.config.get('unicode')
    const old = notifier.update.current
    const latest = notifier.update.latest
    const type = notifier.update.type
    const typec = !useColor ? type
      : type === 'major' ? chalk.red(type)
      : type === 'minor' ? chalk.yellow(type)
      : chalk.green(type)

    const changelog = `https://github.com/npm/cli/releases/tag/v${latest}`
    notifier.notify({
      message: `New ${typec} version of ${pkg.name} available! ${
        useColor ? chalk.red(old) : old
      } ${useUnicode ? '→' : '->'} ${
        useColor ? chalk.green(latest) : latest
      }\n` +
      `${
        useColor ? chalk.yellow('Changelog:') : 'Changelog:'
      } ${
        useColor ? chalk.cyan(changelog) : changelog
      }\n` +
      `Run ${
        useColor
          ? chalk.green(`npm install -g ${pkg.name}`)
          : `npm i -g ${pkg.name}`
      } to update!`
    })
  }
}
